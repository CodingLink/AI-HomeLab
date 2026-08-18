from __future__ import annotations

import json
import math
import os
import sqlite3
import tempfile
import time
import unicodedata
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Callable, Dict, Iterable, List, Mapping, Optional
from urllib.parse import quote


SCHEMA_VERSION = 1
POLL_INTERVAL_SECONDS = 1
STALE_AFTER_SECONDS = 5
MAX_TAIL_BYTES = 512 * 1024
MAX_SESSION_FILES = 6
MAX_ACTIVE_AGE = timedelta(minutes=30)


class LiveActivitySnapshotUnavailable(RuntimeError):
    """Raised when no valid sanitized live-activity snapshot exists."""


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def iso_utc(value: datetime) -> str:
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc).replace(microsecond=0).isoformat().replace(
        "+00:00", "Z"
    )


def parse_iso(value: Any) -> Optional[datetime]:
    if not isinstance(value, str) or not value.strip():
        return None
    try:
        parsed = datetime.fromisoformat(value.strip().replace("Z", "+00:00"))
    except ValueError:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def safe_text(value: Any, limit: int = 160) -> Optional[str]:
    if not isinstance(value, str):
        return None
    cleaned = "".join(
        "" if unicodedata.category(character).startswith("C") else character
        for character in value
    )
    cleaned = " ".join(cleaned.split()).strip()
    if not cleaned:
        return None
    return cleaned[:limit]


def safe_int(value: Any) -> int:
    try:
        number = int(value or 0)
    except (TypeError, ValueError):
        return 0
    return max(0, number)


def safe_float(value: Any) -> Optional[float]:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return number if math.isfinite(number) and number >= 0 else None


def read_routing(database_path: Path) -> Dict[str, bool]:
    routing = {"codex": False, "claude": False}
    try:
        resolved = database_path.expanduser().resolve(strict=True)
        connection = sqlite3.connect(
            "file:{}?mode=ro".format(quote(str(resolved), safe="/")),
            uri=True,
            timeout=1,
        )
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA query_only = ON")
        table = connection.execute(
            "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'proxy_config'"
        ).fetchone()
        if table is None:
            return routing
        columns = {
            row["name"] for row in connection.execute("PRAGMA table_info(proxy_config)")
        }
        if not {"app_type", "enabled"}.issubset(columns):
            return routing
        for row in connection.execute(
            "SELECT app_type, enabled FROM proxy_config "
            "WHERE app_type IN ('codex', 'claude')"
        ):
            app = str(row["app_type"] or "").lower()
            if app in routing:
                routing[app] = safe_int(row["enabled"]) == 1
        return routing
    except (OSError, sqlite3.Error):
        return routing
    finally:
        if "connection" in locals():
            connection.close()


def _tail_lines(path: Path) -> Iterable[str]:
    try:
        with path.open("rb") as handle:
            size = handle.seek(0, os.SEEK_END)
            start = max(0, size - MAX_TAIL_BYTES)
            handle.seek(start)
            data = handle.read(MAX_TAIL_BYTES)
    except OSError:
        return []
    if start:
        _, _, data = data.partition(b"\n")
    return data.decode("utf-8", errors="ignore").splitlines()


def _event_timestamp(event: Mapping[str, Any]) -> Optional[datetime]:
    timestamp = parse_iso(event.get("timestamp"))
    if timestamp:
        return timestamp
    payload = event.get("payload")
    return parse_iso(payload.get("timestamp")) if isinstance(payload, Mapping) else None


def _usage_values(value: Any) -> Dict[str, int]:
    if not isinstance(value, Mapping):
        return {"inputTokens": 0, "outputTokens": 0}
    return {
        "inputTokens": safe_int(value.get("input_tokens") or value.get("inputTokens")),
        "outputTokens": safe_int(value.get("output_tokens") or value.get("outputTokens")),
    }


def _activity(
    app: str,
    model: Optional[str],
    started_at: datetime,
    first_token_at: Optional[datetime],
    usage: Mapping[str, int],
    now: datetime,
) -> Dict[str, Any]:
    duration_ms = max(0, round((now - started_at).total_seconds() * 1000))
    ttft_ms = (
        max(0, round((first_token_at - started_at).total_seconds() * 1000))
        if first_token_at
        else None
    )
    generation_ms = (
        max(0, round((now - first_token_at).total_seconds() * 1000))
        if first_token_at
        else 0
    )
    output_tokens = safe_int(usage.get("outputTokens"))
    tps = (
        round(output_tokens / (generation_ms / 1000), 2)
        if output_tokens > 0 and generation_ms > 0
        else None
    )
    return {
        "app": app,
        "model": safe_text(model) or "Unknown model",
        "state": "calling",
        "startedAt": iso_utc(started_at),
        "inputTokens": safe_int(usage.get("inputTokens")),
        "outputTokens": output_tokens,
        "ttftMs": ttft_ms,
        "durationMs": duration_ms,
        "tps": tps,
        "estimated": True,
    }


def parse_codex_activity(path: Path, now: datetime) -> Optional[Dict[str, Any]]:
    started_at: Optional[datetime] = None
    first_token_at: Optional[datetime] = None
    latest_at: Optional[datetime] = None
    model: Optional[str] = None
    usage = {"inputTokens": 0, "outputTokens": 0}

    for line in _tail_lines(path):
        try:
            event = json.loads(line)
        except (TypeError, json.JSONDecodeError):
            continue
        if not isinstance(event, Mapping):
            continue
        timestamp = _event_timestamp(event)
        if timestamp:
            latest_at = timestamp
        payload = event.get("payload")
        if not isinstance(payload, Mapping):
            payload = event
        event_type = payload.get("type") or event.get("type")

        if event_type == "turn_context":
            model = safe_text(payload.get("model")) or model
        elif event_type == "user_message" and timestamp:
            started_at = timestamp
            first_token_at = None
            usage = {"inputTokens": 0, "outputTokens": 0}
        elif event_type == "agent_message" and started_at:
            if payload.get("phase") == "final_answer":
                started_at = None
                first_token_at = None
            elif timestamp and first_token_at is None:
                first_token_at = timestamp
        elif event_type == "token_count" and started_at:
            info = payload.get("info")
            last_usage = info.get("last_token_usage") if isinstance(info, Mapping) else None
            parsed_usage = _usage_values(last_usage)
            if parsed_usage["inputTokens"] or parsed_usage["outputTokens"]:
                usage = parsed_usage

    if (
        not started_at
        or now - started_at > MAX_ACTIVE_AGE
        or latest_at is None
        or now - latest_at > MAX_ACTIVE_AGE
    ):
        return None
    return _activity("codex", model, started_at, first_token_at, usage, now)


def _claude_user_starts_turn(message: Any) -> bool:
    if not isinstance(message, Mapping):
        return True
    content = message.get("content")
    if not isinstance(content, list):
        return True
    content_types = {
        item.get("type") for item in content if isinstance(item, Mapping)
    }
    return content_types != {"tool_result"}


def parse_claude_activity(path: Path, now: datetime) -> Optional[Dict[str, Any]]:
    started_at: Optional[datetime] = None
    first_token_at: Optional[datetime] = None
    latest_at: Optional[datetime] = None
    model: Optional[str] = None
    usage = {"inputTokens": 0, "outputTokens": 0}

    for line in _tail_lines(path):
        try:
            event = json.loads(line)
        except (TypeError, json.JSONDecodeError):
            continue
        if not isinstance(event, Mapping):
            continue
        timestamp = _event_timestamp(event)
        if timestamp:
            latest_at = timestamp
        event_type = event.get("type")
        message = event.get("message")

        if event_type == "user" and timestamp and _claude_user_starts_turn(message):
            started_at = timestamp
            first_token_at = None
            usage = {"inputTokens": 0, "outputTokens": 0}
        elif event_type == "assistant" and started_at and isinstance(message, Mapping):
            model = safe_text(message.get("model")) or model
            if timestamp and first_token_at is None:
                first_token_at = timestamp
            parsed_usage = _usage_values(message.get("usage"))
            usage["inputTokens"] += parsed_usage["inputTokens"]
            usage["outputTokens"] += parsed_usage["outputTokens"]
            if message.get("stop_reason") == "end_turn":
                started_at = None
                first_token_at = None
        elif event_type == "system" and event.get("subtype") == "turn_duration":
            started_at = None
            first_token_at = None

    if (
        not started_at
        or now - started_at > MAX_ACTIVE_AGE
        or latest_at is None
        or now - latest_at > MAX_ACTIVE_AGE
    ):
        return None
    return _activity("claude", model, started_at, first_token_at, usage, now)


class LiveActivityCollector:
    def __init__(
        self,
        database_path: Optional[Path] = None,
        codex_root: Optional[Path] = None,
        claude_root: Optional[Path] = None,
        now_provider: Callable[[], datetime] = utc_now,
        routing_provider: Optional[Callable[[], Dict[str, bool]]] = None,
    ) -> None:
        self.database_path = database_path or Path.home() / ".cc-switch" / "cc-switch.db"
        self.roots = {
            "codex": codex_root or Path.home() / ".codex" / "sessions",
            "claude": claude_root or Path.home() / ".claude" / "projects",
        }
        self.now_provider = now_provider
        self.routing_provider = routing_provider or (
            lambda: read_routing(self.database_path)
        )
        self._path_cache: Dict[str, tuple[float, List[Path]]] = {}

    def _recent_files(self, app: str) -> List[Path]:
        cached_at, cached_paths = self._path_cache.get(app, (0.0, []))
        if cached_at > 0 and time.monotonic() - cached_at < 10:
            return cached_paths
        root = self.roots[app]
        try:
            candidates = [path for path in root.rglob("*.jsonl") if path.is_file()]
            candidates.sort(key=lambda path: path.stat().st_mtime_ns, reverse=True)
        except OSError:
            candidates = []
        paths = candidates[:MAX_SESSION_FILES]
        self._path_cache[app] = (time.monotonic(), paths)
        return paths

    def collect(self) -> Dict[str, Any]:
        now = self.now_provider().astimezone(timezone.utc)
        routing = self.routing_provider()
        activities: List[Dict[str, Any]] = []
        parsers = {"codex": parse_codex_activity, "claude": parse_claude_activity}
        for app in ("codex", "claude"):
            if not routing.get(app, False):
                continue
            for path in self._recent_files(app):
                activity = parsers[app](path, now)
                if activity:
                    activities.append(activity)
        activities.sort(key=lambda item: item["startedAt"], reverse=True)
        return {
            "schemaVersion": SCHEMA_VERSION,
            "source": "session-metadata",
            "generatedAt": iso_utc(now),
            "staleAfterSeconds": STALE_AFTER_SECONDS,
            "routing": {
                "codex": bool(routing.get("codex")),
                "claude": bool(routing.get("claude")),
            },
            "activities": activities,
        }

    def collect_to_path(self, path: Path) -> Dict[str, Any]:
        snapshot = self.collect()
        write_snapshot(path, snapshot)
        return snapshot


def sanitize_snapshot(value: Any) -> Optional[Dict[str, Any]]:
    if not isinstance(value, Mapping):
        return None
    generated_at = parse_iso(value.get("generatedAt"))
    routing = value.get("routing")
    activities = value.get("activities")
    if not generated_at or not isinstance(routing, Mapping) or not isinstance(activities, list):
        return None
    sanitized_activities = []
    for item in activities[:12]:
        if not isinstance(item, Mapping) or item.get("app") not in {"codex", "claude"}:
            continue
        model = safe_text(item.get("model"))
        started_at = parse_iso(item.get("startedAt"))
        if not model or not started_at or item.get("state") != "calling":
            continue
        sanitized_activities.append(
            {
                "app": item["app"],
                "model": model,
                "state": "calling",
                "startedAt": iso_utc(started_at),
                "inputTokens": safe_int(item.get("inputTokens")),
                "outputTokens": safe_int(item.get("outputTokens")),
                "ttftMs": safe_int(item.get("ttftMs")) if item.get("ttftMs") is not None else None,
                "durationMs": safe_int(item.get("durationMs")) if item.get("durationMs") is not None else None,
                "tps": safe_float(item.get("tps")),
                "estimated": True,
            }
        )
    return {
        "schemaVersion": SCHEMA_VERSION,
        "source": "session-metadata",
        "generatedAt": iso_utc(generated_at),
        "staleAfterSeconds": STALE_AFTER_SECONDS,
        "routing": {
            "codex": routing.get("codex") is True,
            "claude": routing.get("claude") is True,
        },
        "activities": sanitized_activities,
    }


def write_snapshot(path: Path, snapshot: Mapping[str, Any]) -> None:
    sanitized = sanitize_snapshot(snapshot)
    if sanitized is None:
        raise ValueError("Live activity snapshot is invalid")
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    os.chmod(path.parent, 0o700)
    handle, temporary_name = tempfile.mkstemp(prefix=f".{path.name}.", dir=str(path.parent))
    try:
        with os.fdopen(handle, "w", encoding="utf-8") as temporary:
            json.dump(sanitized, temporary, ensure_ascii=False, separators=(",", ":"))
            temporary.write("\n")
            temporary.flush()
            os.fsync(temporary.fileno())
        os.chmod(temporary_name, 0o600)
        os.replace(temporary_name, path)
        os.chmod(path, 0o600)
    finally:
        try:
            os.unlink(temporary_name)
        except OSError:
            pass


class LiveActivitySnapshotService:
    def __init__(
        self,
        path: Path,
        now_provider: Callable[[], datetime] = utc_now,
    ) -> None:
        self.path = path
        self.now_provider = now_provider

    def get_activity(self) -> Dict[str, Any]:
        try:
            raw = json.loads(self.path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, json.JSONDecodeError) as exc:
            raise LiveActivitySnapshotUnavailable from exc
        snapshot = sanitize_snapshot(raw)
        if snapshot is None:
            raise LiveActivitySnapshotUnavailable
        age = max(
            0.0,
            (self.now_provider().astimezone(timezone.utc) - parse_iso(snapshot["generatedAt"])).total_seconds(),
        )
        stale = age > STALE_AFTER_SECONDS
        return {
            "meta": {
                "source": "session-metadata",
                "schemaVersion": SCHEMA_VERSION,
                "generatedAt": snapshot["generatedAt"],
                "staleAfterSeconds": STALE_AFTER_SECONDS,
                "stale": stale,
            },
            "routing": snapshot["routing"],
            "activities": [] if stale else snapshot["activities"],
        }


def live_activity_service_from_environment() -> LiveActivitySnapshotService:
    return LiveActivitySnapshotService(
        Path(os.environ.get("LIVE_ACTIVITY_SNAPSHOT", "/provider-data/ai-live-activity.json"))
    )
