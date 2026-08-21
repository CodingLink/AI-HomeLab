from __future__ import annotations

import copy
import os
import sqlite3
import threading
import time
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any, Callable, Dict, Iterable, List, Optional, Tuple
from urllib.parse import quote


SUPPORTED_RANGES = {"today": 1, "7d": 7, "30d": 30}
SUPPORTED_APPS = {"all", "codex", "claude"}
REQUIRED_COLUMNS = {
    "app_type",
    "model",
    "input_tokens",
    "output_tokens",
    "cache_read_tokens",
    "cache_creation_tokens",
    "total_cost_usd",
    "status_code",
    "created_at",
}
OPTIONAL_TIMING_COLUMNS = {"first_token_ms", "duration_ms", "latency_ms"}
CACHE_INCLUSIVE_APP_TYPES = {"codex", "gemini", "grokbuild"}
INPUT_TOKEN_SEMANTICS_LEGACY = 0
INPUT_TOKEN_SEMANTICS_TOTAL = 1
INPUT_TOKEN_SEMANTICS_FRESH = 2


class DashboardError(RuntimeError):
    """Base error returned for dashboard data failures."""


class DatabaseUnavailable(DashboardError):
    """Raised when the configured CC Switch database cannot be read."""


class SchemaIncompatible(DashboardError):
    """Raised when the database lacks the fields required by the dashboard."""


def singapore_now() -> datetime:
    # Singapore has used UTC+08:00 without DST since 1982. A fixed offset keeps
    # local-day aggregation deterministic in minimal containers without tzdata.
    return datetime.now(timezone(timedelta(hours=8), name="Asia/Singapore"))


def _iso(value: datetime) -> str:
    return value.replace(microsecond=0).isoformat()


def _safe_int(value: Any) -> int:
    try:
        return max(0, int(value or 0))
    except (TypeError, ValueError):
        return 0


def _optional_nonnegative_int(value: Any) -> Optional[int]:
    if value is None:
        return None
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return None
    return parsed if parsed >= 0 else None


def _safe_decimal(value: Any) -> Decimal:
    try:
        parsed = Decimal(str(value or "0"))
        return parsed if parsed >= 0 else Decimal("0")
    except (InvalidOperation, TypeError, ValueError):
        return Decimal("0")


def _round_cost(value: Decimal) -> float:
    return float(value.quantize(Decimal("0.000001")))


def _percent(part: int, total: int) -> float:
    if total <= 0:
        return 0.0
    return round((part / total) * 100, 1)


class DashboardRepository:
    def __init__(
        self,
        database_path: str,
        now_provider: Callable[[], datetime] = singapore_now,
    ) -> None:
        self.database_path = Path(database_path).expanduser()
        self.now_provider = now_provider

    def database_signature(self) -> Tuple[int, int]:
        try:
            stat = self.database_path.stat()
        except OSError as exc:
            raise DatabaseUnavailable("CC Switch database is unavailable") from exc
        if not self.database_path.is_file():
            raise DatabaseUnavailable("CC Switch database is unavailable")
        return stat.st_mtime_ns, stat.st_size

    def _connect(self) -> sqlite3.Connection:
        try:
            resolved = self.database_path.resolve(strict=True)
            uri = "file:{}?mode=ro".format(quote(str(resolved), safe="/"))
            connection = sqlite3.connect(uri, uri=True, timeout=2.5)
        except (OSError, sqlite3.Error) as exc:
            raise DatabaseUnavailable("CC Switch database is unavailable") from exc

        connection.row_factory = sqlite3.Row
        try:
            connection.execute("PRAGMA query_only = ON")
            connection.execute("PRAGMA busy_timeout = 2500")
        except sqlite3.Error:
            connection.close()
            raise
        return connection

    def validate_schema(self) -> Dict[str, Any]:
        connection = self._connect()
        try:
            table = connection.execute(
                "SELECT 1 FROM sqlite_master "
                "WHERE type = 'table' AND name = 'proxy_request_logs'"
            ).fetchone()
            if table is None:
                raise SchemaIncompatible("CC Switch usage table is unavailable")

            columns = {
                row["name"]
                for row in connection.execute("PRAGMA table_info(proxy_request_logs)")
            }
            missing = REQUIRED_COLUMNS - columns
            if missing:
                raise SchemaIncompatible("CC Switch database schema is incompatible")

            schema_version = int(connection.execute("PRAGMA user_version").fetchone()[0])
            journal_mode = str(connection.execute("PRAGMA journal_mode").fetchone()[0])
            query_only = int(connection.execute("PRAGMA query_only").fetchone()[0])
            return {
                "schemaVersion": schema_version,
                "journalMode": journal_mode,
                "queryOnly": query_only == 1,
            }
        except sqlite3.Error as exc:
            raise DatabaseUnavailable("CC Switch database could not be read") from exc
        finally:
            connection.close()

    def _window(self, range_key: str) -> Tuple[datetime, datetime, str]:
        if range_key not in SUPPORTED_RANGES:
            raise ValueError("Unsupported range")

        now = self.now_provider()
        if now.tzinfo is None:
            now = now.replace(tzinfo=timezone(timedelta(hours=8)))
        local_midnight = now.replace(hour=0, minute=0, second=0, microsecond=0)
        start = local_midnight - timedelta(days=SUPPORTED_RANGES[range_key] - 1)
        granularity = "hour" if range_key == "today" else "day"
        return start, now, granularity

    @staticmethod
    def _app_values(app_filter: str) -> Tuple[str, ...]:
        if app_filter == "all":
            return ("codex", "claude")
        if app_filter in {"codex", "claude"}:
            return (app_filter,)
        raise ValueError("Unsupported app")

    def _load_rows(
        self, start_epoch: int, end_epoch: int, apps: Iterable[str]
    ) -> List[sqlite3.Row]:
        app_values = tuple(apps)
        placeholders = ",".join("?" for _ in app_values)
        connection = self._connect()
        try:
            columns = {
                row["name"]
                for row in connection.execute("PRAGMA table_info(proxy_request_logs)")
            }
            timing_select = [
                column if column in columns else f"NULL AS {column}"
                for column in sorted(OPTIONAL_TIMING_COLUMNS)
            ]
            timing_sql = ",\n                ".join(timing_select)
            input_semantics_select = (
                "input_token_semantics"
                if "input_token_semantics" in columns
                else "0 AS input_token_semantics"
            )

            pricing_table = connection.execute(
                "SELECT 1 FROM sqlite_master "
                "WHERE type = 'table' AND name = 'model_pricing'"
            ).fetchone()
            pricing_columns = (
                {
                    row["name"]
                    for row in connection.execute("PRAGMA table_info(model_pricing)")
                }
                if pricing_table is not None
                else set()
            )
            if {"model_id", "display_name"}.issubset(pricing_columns):
                display_name_select = "model_pricing.display_name AS model_display_name"
                display_name_join = (
                    "LEFT JOIN model_pricing "
                    "ON model_pricing.model_id = proxy_request_logs.model"
                )
            else:
                display_name_select = "NULL AS model_display_name"
                display_name_join = ""
        except sqlite3.Error as exc:
            connection.close()
            raise DatabaseUnavailable("CC Switch usage data could not be read") from exc
        query = f"""
            SELECT
                app_type,
                model,
                input_tokens,
                output_tokens,
                cache_read_tokens,
                cache_creation_tokens,
                {input_semantics_select},
                total_cost_usd,
                status_code,
                created_at,
                {timing_sql},
                {display_name_select}
            FROM proxy_request_logs
            {display_name_join}
            WHERE created_at >= ?
              AND created_at <= ?
              AND app_type IN ({placeholders})
            ORDER BY created_at DESC
        """
        try:
            return list(connection.execute(query, (start_epoch, end_epoch, *app_values)))
        except sqlite3.Error as exc:
            raise DatabaseUnavailable("CC Switch usage data could not be read") from exc
        finally:
            connection.close()

    def _load_routing(self) -> Dict[str, bool]:
        routing = {"codex": False, "claude": False}
        connection = self._connect()
        try:
            table = connection.execute(
                "SELECT 1 FROM sqlite_master "
                "WHERE type = 'table' AND name = 'proxy_config'"
            ).fetchone()
            if table is None:
                return routing
            columns = {
                row["name"]
                for row in connection.execute("PRAGMA table_info(proxy_config)")
            }
            if not {"app_type", "enabled"}.issubset(columns):
                return routing
            rows = connection.execute(
                "SELECT app_type, enabled FROM proxy_config "
                "WHERE app_type IN ('codex', 'claude')"
            )
            for row in rows:
                app_type = str(row["app_type"] or "").lower()
                if app_type in routing:
                    routing[app_type] = _safe_int(row["enabled"]) == 1
            return routing
        except sqlite3.Error:
            # Routing controls are optional. Fail closed so timing and live state
            # are never presented when CC Switch cannot confirm proxy mode.
            return routing
        finally:
            connection.close()

    @staticmethod
    def _timing_metrics(row: sqlite3.Row, routed: bool) -> Dict[str, Any]:
        if not routed:
            return {
                "state": "completed"
                if 200 <= _safe_int(row["status_code"]) < 400
                else "failed",
                "routed": False,
                "ttftMs": None,
                "durationMs": None,
                "tps": None,
                "estimated": False,
            }

        ttft = _optional_nonnegative_int(row["first_token_ms"])
        duration = _optional_nonnegative_int(row["duration_ms"])
        if duration is None:
            duration = _optional_nonnegative_int(row["latency_ms"])
        output_tokens = _safe_int(row["output_tokens"])
        generation_ms = duration - ttft if duration is not None and ttft is not None else None
        tps = (
            round(output_tokens / (generation_ms / 1000), 2)
            if output_tokens > 0 and generation_ms is not None and generation_ms > 0
            else None
        )
        return {
            "state": "completed"
            if 200 <= _safe_int(row["status_code"]) < 400
            else "failed",
            "routed": True,
            "ttftMs": ttft,
            "durationMs": duration,
            "tps": tps,
            "estimated": False,
        }

    @staticmethod
    def _model_display_name(row: sqlite3.Row, model: str) -> str:
        display_name = " ".join(str(row["model_display_name"] or "").split())
        return display_name[:160] or model

    @staticmethod
    def _empty_metrics() -> Dict[str, Any]:
        return {
            "requests": 0,
            "successfulRequests": 0,
            "inputTokens": 0,
            "outputTokens": 0,
            "cacheReadTokens": 0,
            "cacheCreationTokens": 0,
            "totalTokens": 0,
            "totalCostUsd": Decimal("0"),
        }

    @staticmethod
    def _normalized_input_tokens(row: sqlite3.Row) -> int:
        """Return CC Switch's cache-normalized (fresh) input token count."""
        input_tokens = _safe_int(row["input_tokens"])
        cache_read_tokens = _safe_int(row["cache_read_tokens"])
        cache_creation_tokens = _safe_int(row["cache_creation_tokens"])
        semantics = _safe_int(row["input_token_semantics"])
        app_type = str(row["app_type"] or "").lower()

        if semantics == INPUT_TOKEN_SEMANTICS_FRESH:
            return input_tokens
        if app_type not in CACHE_INCLUSIVE_APP_TYPES:
            return input_tokens
        if semantics == INPUT_TOKEN_SEMANTICS_TOTAL:
            cached_tokens = cache_read_tokens + cache_creation_tokens
            return input_tokens - cached_tokens if input_tokens >= cached_tokens else input_tokens
        if semantics == INPUT_TOKEN_SEMANTICS_LEGACY and input_tokens >= cache_read_tokens:
            return input_tokens - cache_read_tokens
        return input_tokens

    @staticmethod
    def _add_row(metrics: Dict[str, Any], row: sqlite3.Row) -> Dict[str, Any]:
        input_tokens = DashboardRepository._normalized_input_tokens(row)
        output_tokens = _safe_int(row["output_tokens"])
        cache_read_tokens = _safe_int(row["cache_read_tokens"])
        cache_creation_tokens = _safe_int(row["cache_creation_tokens"])

        metrics["requests"] += 1
        if 200 <= _safe_int(row["status_code"]) < 400:
            metrics["successfulRequests"] += 1
        metrics["inputTokens"] += input_tokens
        metrics["outputTokens"] += output_tokens
        metrics["cacheReadTokens"] += cache_read_tokens
        metrics["cacheCreationTokens"] += cache_creation_tokens
        metrics["totalTokens"] += (
            input_tokens + output_tokens + cache_read_tokens + cache_creation_tokens
        )
        metrics["totalCostUsd"] += _safe_decimal(row["total_cost_usd"])
        return metrics

    @staticmethod
    def _serialize_metrics(metrics: Dict[str, Any]) -> Dict[str, Any]:
        serialized = dict(metrics)
        serialized["totalCostUsd"] = _round_cost(metrics["totalCostUsd"])
        serialized["successRate"] = _percent(
            metrics["successfulRequests"], metrics["requests"]
        )
        return serialized

    def _empty_trend(
        self, start: datetime, end: datetime, granularity: str
    ) -> Dict[str, Dict[str, Any]]:
        buckets: Dict[str, Dict[str, Any]] = {}
        cursor = start
        step = timedelta(hours=1) if granularity == "hour" else timedelta(days=1)
        while cursor <= end:
            bucket_start = (
                cursor.replace(minute=0, second=0, microsecond=0)
                if granularity == "hour"
                else cursor.replace(hour=0, minute=0, second=0, microsecond=0)
            )
            key = _iso(bucket_start)
            buckets[key] = self._empty_metrics()
            cursor = bucket_start + step
        return buckets

    def fetch_dashboard(
        self, range_key: str, app_filter: str, recent_limit: int = 8
    ) -> Dict[str, Any]:
        schema = self.validate_schema()
        start, now, granularity = self._window(range_key)
        apps = self._app_values(app_filter)
        rows = self._load_rows(int(start.timestamp()), int(now.timestamp()), apps)
        routing = self._load_routing()

        summary = self._empty_metrics()
        models: Dict[str, Dict[str, Any]] = defaultdict(self._empty_metrics)
        model_display_names: Dict[str, str] = {}
        app_totals: Dict[str, Dict[str, Any]] = defaultdict(self._empty_metrics)
        trend = self._empty_trend(start, now, granularity)
        recent: List[Dict[str, Any]] = []
        data_through: Optional[datetime] = None

        for row in rows:
            model = str(row["model"] or "Unknown model").strip() or "Unknown model"
            display_name = self._model_display_name(row, model)
            model_display_names.setdefault(model, display_name)
            app_type = str(row["app_type"] or "unknown").lower()
            created = datetime.fromtimestamp(_safe_int(row["created_at"]), tz=now.tzinfo)
            success = 200 <= _safe_int(row["status_code"]) < 400

            self._add_row(summary, row)
            self._add_row(models[model], row)
            self._add_row(app_totals[app_type], row)

            bucket_start = (
                created.replace(minute=0, second=0, microsecond=0)
                if granularity == "hour"
                else created.replace(hour=0, minute=0, second=0, microsecond=0)
            )
            bucket_key = _iso(bucket_start)
            if bucket_key in trend:
                self._add_row(trend[bucket_key], row)

            if data_through is None or created > data_through:
                data_through = created

            if len(recent) < recent_limit:
                input_tokens = self._normalized_input_tokens(row)
                output_tokens = _safe_int(row["output_tokens"])
                cache_read_tokens = _safe_int(row["cache_read_tokens"])
                cache_creation_tokens = _safe_int(row["cache_creation_tokens"])
                recent.append(
                    {
                        "app": app_type,
                        "model": model,
                        "displayName": display_name,
                        "createdAt": _iso(created),
                        "inputTokens": input_tokens,
                        "outputTokens": output_tokens,
                        "cacheReadTokens": cache_read_tokens,
                        "cacheCreationTokens": cache_creation_tokens,
                        "totalTokens": input_tokens
                        + output_tokens
                        + cache_read_tokens
                        + cache_creation_tokens,
                        "totalCostUsd": _round_cost(_safe_decimal(row["total_cost_usd"])),
                        "statusCode": _safe_int(row["status_code"]),
                        "success": success,
                        **self._timing_metrics(row, routing.get(app_type, False)),
                    }
                )

        serialized_summary = self._serialize_metrics(summary)

        model_items = []
        for model, metrics in models.items():
            item = {
                "model": model,
                "displayName": model_display_names.get(model, model),
                **self._serialize_metrics(metrics),
            }
            item["percentage"] = _percent(
                metrics["totalTokens"], summary["totalTokens"]
            )
            model_items.append(item)
        model_items.sort(
            key=lambda item: (-item["totalTokens"], -item["requests"], item["model"])
        )

        app_items = []
        for app_type in ("codex", "claude"):
            if app_type not in app_totals:
                continue
            metrics = app_totals[app_type]
            item = {"app": app_type, **self._serialize_metrics(metrics)}
            item["percentage"] = _percent(
                metrics["totalTokens"], summary["totalTokens"]
            )
            app_items.append(item)

        trend_items = []
        for bucket, metrics in trend.items():
            trend_items.append({"bucket": bucket, **self._serialize_metrics(metrics)})

        database_mtime_ns, database_size = self.database_signature()
        database_updated = datetime.fromtimestamp(
            database_mtime_ns / 1_000_000_000, tz=now.tzinfo
        )

        return {
            "meta": {
                "range": range_key,
                "app": app_filter,
                "granularity": granularity,
                "generatedAt": _iso(now),
                "dataThrough": _iso(data_through) if data_through else None,
                "databaseUpdatedAt": _iso(database_updated),
                "databaseSizeBytes": database_size,
                "schemaVersion": schema["schemaVersion"],
                "stale": False,
            },
            "summary": {
                **serialized_summary,
                "primaryModel": model_items[0]["model"] if model_items else None,
                "primaryModelDisplayName": model_items[0]["displayName"]
                if model_items
                else None,
            },
            "models": model_items,
            "apps": app_items,
            "trend": trend_items,
            "recent": recent,
            "routing": routing,
        }


class DashboardService:
    def __init__(self, repository: DashboardRepository, refresh_seconds: float = 8.0) -> None:
        self.repository = repository
        self.refresh_seconds = max(1.0, refresh_seconds)
        self._lock = threading.Lock()
        self._cache: Dict[Tuple[str, str], Dict[str, Any]] = {}

    def get_dashboard(self, range_key: str, app_filter: str) -> Dict[str, Any]:
        if range_key not in SUPPORTED_RANGES or app_filter not in SUPPORTED_APPS:
            raise ValueError("Unsupported dashboard filter")

        key = (range_key, app_filter)
        monotonic_now = time.monotonic()
        try:
            signature = self.repository.database_signature()
        except DashboardError:
            signature = None

        with self._lock:
            cached = self._cache.get(key)
            if (
                cached
                and signature == cached["signature"]
                and monotonic_now - cached["cachedAt"] < self.refresh_seconds
            ):
                return copy.deepcopy(cached["payload"])

            try:
                payload = self.repository.fetch_dashboard(range_key, app_filter)
            except DashboardError:
                if not cached:
                    raise
                stale = copy.deepcopy(cached["payload"])
                stale["meta"]["stale"] = True
                stale["meta"]["staleReason"] = "database_temporarily_unavailable"
                return stale

            self._cache[key] = {
                "signature": signature,
                "cachedAt": monotonic_now,
                "payload": payload,
            }
            return copy.deepcopy(payload)

    def health(self) -> Dict[str, Any]:
        schema = self.repository.validate_schema()
        return {
            "status": "ok",
            "database": "readable",
            "queryOnly": schema["queryOnly"],
            "schemaVersion": schema["schemaVersion"],
        }


def service_from_environment() -> DashboardService:
    database_path = os.environ.get("CC_SWITCH_DB", "/data/cc-switch.db")
    refresh_seconds = float(os.environ.get("DASHBOARD_REFRESH_SECONDS", "8"))
    return DashboardService(
        DashboardRepository(database_path), refresh_seconds=refresh_seconds
    )
