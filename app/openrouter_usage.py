from __future__ import annotations

import copy
import getpass
import http.client
import json
import math
import os
import re
import subprocess
import tempfile
import unicodedata
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Callable, Dict, List, Mapping, Optional, Sequence


SCHEMA_VERSION = 1
REFRESH_INTERVAL_SECONDS = 300
STALE_AFTER_SECONDS = 900
REQUEST_TIMEOUT_SECONDS = 15
MAX_RESPONSE_BYTES = 2 * 1024 * 1024
MAX_ACTIVITY_ROWS = 10_000
MAX_MODELS = 500
OPENROUTER_HOST = "openrouter.ai"
ACTIVITY_PATH = "/api/v1/activity"
CREDITS_PATH = "/api/v1/credits"
ALLOWED_PATHS = {ACTIVITY_PATH, CREDITS_PATH}
SECURITY_BINARY = "/usr/bin/security"
KEYCHAIN_SERVICE = "homedash.openrouter.management"
KEYCHAIN_LABEL = "HomeDash OpenRouter Management Key"

_MODEL_ID = re.compile(r"^[^\s/]+/[^\s]+$")


class OpenRouterUnavailable(RuntimeError):
    """Raised when OpenRouter data cannot be collected safely."""


class OpenRouterSnapshotUnavailable(RuntimeError):
    """Raised when no successful sanitized OpenRouter data exists."""


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


def finite_number(value: Any, *, allow_negative: bool = False) -> Optional[float]:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if not math.isfinite(number) or (number < 0 and not allow_negative):
        return None
    return number


def safe_integer(value: Any) -> Optional[int]:
    number = finite_number(value)
    if number is None or not number.is_integer():
        return None
    return int(number)


def safe_text(value: Any, *, limit: int) -> Optional[str]:
    if not isinstance(value, str):
        return None
    cleaned = "".join(
        "" if unicodedata.category(character).startswith("C") else character
        for character in value
    )
    cleaned = " ".join(cleaned.split()).strip()
    if not cleaned or len(cleaned) > limit:
        return None
    return cleaned


def keychain_account() -> str:
    return getpass.getuser()


def _valid_management_key(value: str) -> bool:
    return (
        20 <= len(value) <= 512
        and not any(unicodedata.category(character).startswith("C") for character in value)
    )


def read_management_key(
    runner: Callable[..., Any] = subprocess.run,
    account: Optional[str] = None,
) -> str:
    try:
        result = runner(
            [
                SECURITY_BINARY,
                "find-generic-password",
                "-a",
                account or keychain_account(),
                "-s",
                KEYCHAIN_SERVICE,
                "-w",
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True,
            check=False,
            timeout=5,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise OpenRouterUnavailable("OpenRouter credential is unavailable") from exc
    key = result.stdout.strip() if result.returncode == 0 else ""
    if not _valid_management_key(key):
        raise OpenRouterUnavailable("OpenRouter credential is unavailable")
    return key


def keychain_has_key(
    runner: Callable[..., Any] = subprocess.run,
    account: Optional[str] = None,
) -> bool:
    try:
        result = runner(
            [
                SECURITY_BINARY,
                "find-generic-password",
                "-a",
                account or keychain_account(),
                "-s",
                KEYCHAIN_SERVICE,
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=False,
            timeout=5,
        )
    except (OSError, subprocess.TimeoutExpired):
        return False
    return result.returncode == 0


def set_keychain_key(
    runner: Callable[..., Any] = subprocess.run,
    account: Optional[str] = None,
) -> bool:
    try:
        result = runner(
            [
                SECURITY_BINARY,
                "add-generic-password",
                "-U",
                "-a",
                account or keychain_account(),
                "-s",
                KEYCHAIN_SERVICE,
                "-l",
                KEYCHAIN_LABEL,
                "-w",
            ],
            check=False,
        )
    except OSError:
        return False
    return result.returncode == 0


def delete_keychain_key(
    runner: Callable[..., Any] = subprocess.run,
    account: Optional[str] = None,
) -> bool:
    try:
        result = runner(
            [
                SECURITY_BINARY,
                "delete-generic-password",
                "-a",
                account or keychain_account(),
                "-s",
                KEYCHAIN_SERVICE,
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=False,
            timeout=5,
        )
    except (OSError, subprocess.TimeoutExpired):
        return False
    return result.returncode == 0


class OpenRouterClient:
    def __init__(
        self,
        connection_factory: Callable[..., Any] = http.client.HTTPSConnection,
        timeout_seconds: int = REQUEST_TIMEOUT_SECONDS,
    ) -> None:
        self.connection_factory = connection_factory
        self.timeout_seconds = max(1, int(timeout_seconds))

    def get_json(self, path: str, management_key: str) -> Any:
        if path not in ALLOWED_PATHS or not _valid_management_key(management_key):
            raise OpenRouterUnavailable("OpenRouter request is unavailable")
        connection = self.connection_factory(
            OPENROUTER_HOST,
            443,
            timeout=self.timeout_seconds,
        )
        try:
            connection.request(
                "GET",
                path,
                headers={
                    "Accept": "application/json",
                    "Authorization": f"Bearer {management_key}",
                    "User-Agent": "HomeDash/1.0",
                },
            )
            response = connection.getresponse()
            if response.status != 200:
                raise OpenRouterUnavailable("OpenRouter request failed")
            body = response.read(MAX_RESPONSE_BYTES + 1)
            if len(body) > MAX_RESPONSE_BYTES:
                raise OpenRouterUnavailable("OpenRouter response is too large")
        except (OSError, TimeoutError, http.client.HTTPException) as exc:
            raise OpenRouterUnavailable("OpenRouter request failed") from exc
        finally:
            try:
                connection.close()
            except OSError:
                pass
        try:
            return json.loads(body)
        except (UnicodeError, json.JSONDecodeError) as exc:
            raise OpenRouterUnavailable("OpenRouter returned invalid JSON") from exc


def normalize_credits(payload: Any, checked_at: datetime) -> Dict[str, Any]:
    data = payload.get("data") if isinstance(payload, Mapping) else None
    if not isinstance(data, Mapping):
        raise OpenRouterUnavailable("OpenRouter credits are unavailable")
    total_credits = finite_number(data.get("total_credits"))
    total_usage = finite_number(data.get("total_usage"))
    if total_credits is None or total_usage is None:
        raise OpenRouterUnavailable("OpenRouter credits are invalid")
    return {
        "status": "live",
        "lastCheckedAt": iso_utc(checked_at),
        "lastSuccessAt": iso_utc(checked_at),
        "totalCredits": total_credits,
        "totalUsage": total_usage,
        "remaining": total_credits - total_usage,
    }


def _activity_dates(checked_at: datetime) -> tuple[date, date]:
    checked = checked_at.astimezone(timezone.utc)
    end = checked.date() - timedelta(days=1)
    return end - timedelta(days=29), end


def normalize_activity(payload: Any, checked_at: datetime) -> Dict[str, Any]:
    rows = payload.get("data") if isinstance(payload, Mapping) else None
    if not isinstance(rows, list) or len(rows) > MAX_ACTIVITY_ROWS:
        raise OpenRouterUnavailable("OpenRouter activity is unavailable")

    start_date, end_date = _activity_dates(checked_at)
    aggregates: Dict[str, Dict[str, Any]] = {}
    total_requests = 0
    total_usage = 0.0
    through_date: Optional[date] = None

    for row in rows:
        if not isinstance(row, Mapping):
            continue
        raw_date = row.get("date")
        try:
            row_date = date.fromisoformat(raw_date) if isinstance(raw_date, str) else None
        except ValueError:
            row_date = None
        if row_date is None or not start_date <= row_date <= end_date:
            continue

        model = safe_text(row.get("model"), limit=160)
        if not model or not _MODEL_ID.fullmatch(model):
            continue
        provider = safe_text(row.get("provider_name"), limit=80)
        requests = safe_integer(row.get("requests"))
        prompt_tokens = safe_integer(row.get("prompt_tokens"))
        completion_tokens = safe_integer(row.get("completion_tokens"))
        reasoning_tokens = safe_integer(row.get("reasoning_tokens"))
        usage = finite_number(row.get("usage"))
        if None in (
            requests,
            prompt_tokens,
            completion_tokens,
            reasoning_tokens,
            usage,
        ):
            continue

        item = aggregates.setdefault(
            model,
            {
                "id": model,
                "providers": set(),
                "requests": 0,
                "promptTokens": 0,
                "completionTokens": 0,
                "reasoningTokens": 0,
                "usageCredits": 0.0,
            },
        )
        if provider:
            item["providers"].add(provider)
        item["requests"] += requests
        item["promptTokens"] += prompt_tokens
        item["completionTokens"] += completion_tokens
        item["reasoningTokens"] += reasoning_tokens
        item["usageCredits"] += usage
        total_requests += requests
        total_usage += usage
        through_date = max(through_date or row_date, row_date)

    models: List[Dict[str, Any]] = []
    for item in aggregates.values():
        usage = float(item["usageCredits"])
        models.append(
            {
                "id": item["id"],
                "providers": sorted(item["providers"]),
                "requests": item["requests"],
                "promptTokens": item["promptTokens"],
                "completionTokens": item["completionTokens"],
                "reasoningTokens": item["reasoningTokens"],
                "usageCredits": round(usage, 8),
                "sharePercent": round(usage / total_usage * 100, 1)
                if total_usage > 0
                else 0.0,
            }
        )
    models.sort(key=lambda item: (-item["usageCredits"], -item["requests"], item["id"]))
    models = models[:MAX_MODELS]

    return {
        "status": "live",
        "lastCheckedAt": iso_utc(checked_at),
        "lastSuccessAt": iso_utc(checked_at),
        "period": {
            "days": 30,
            "timezone": "UTC",
            "throughDate": (through_date or end_date).isoformat(),
        },
        "summary": {
            "requests": total_requests,
            "usageCredits": round(total_usage, 8),
            "modelCount": len(aggregates),
        },
        "models": models,
    }


def _unavailable_credits(checked_at: datetime) -> Dict[str, Any]:
    return {
        "status": "unavailable",
        "lastCheckedAt": iso_utc(checked_at),
        "lastSuccessAt": None,
        "totalCredits": None,
        "totalUsage": None,
        "remaining": None,
    }


def _unavailable_activity(checked_at: datetime) -> Dict[str, Any]:
    _, end_date = _activity_dates(checked_at)
    return {
        "status": "unavailable",
        "lastCheckedAt": iso_utc(checked_at),
        "lastSuccessAt": None,
        "period": {"days": 30, "timezone": "UTC", "throughDate": end_date.isoformat()},
        "summary": {"requests": 0, "usageCredits": 0.0, "modelCount": 0},
        "models": [],
    }


def _failed_section(
    previous: Optional[Mapping[str, Any]],
    checked_at: datetime,
    fallback: Callable[[datetime], Dict[str, Any]],
) -> Dict[str, Any]:
    if previous and previous.get("lastSuccessAt"):
        section = copy.deepcopy(dict(previous))
        section["status"] = "stale"
        section["lastCheckedAt"] = iso_utc(checked_at)
        return section
    return fallback(checked_at)


def _sanitize_credits(value: Any) -> Optional[Dict[str, Any]]:
    if not isinstance(value, Mapping):
        return None
    status = value.get("status")
    if status not in {"live", "stale", "unavailable"}:
        return None
    last_success = parse_iso(value.get("lastSuccessAt"))
    checked = parse_iso(value.get("lastCheckedAt")) or last_success
    total_credits = finite_number(value.get("totalCredits"))
    total_usage = finite_number(value.get("totalUsage"))
    remaining = finite_number(value.get("remaining"), allow_negative=True)
    if status != "unavailable" and (
        not last_success
        or total_credits is None
        or total_usage is None
        or remaining is None
    ):
        return None
    return {
        "status": status,
        "lastCheckedAt": iso_utc(checked) if checked else None,
        "lastSuccessAt": iso_utc(last_success) if last_success else None,
        "totalCredits": total_credits if last_success else None,
        "totalUsage": total_usage if last_success else None,
        "remaining": remaining if last_success else None,
    }


def _sanitize_activity(value: Any) -> Optional[Dict[str, Any]]:
    if not isinstance(value, Mapping):
        return None
    status = value.get("status")
    if status not in {"live", "stale", "unavailable"}:
        return None
    last_success = parse_iso(value.get("lastSuccessAt"))
    checked = parse_iso(value.get("lastCheckedAt")) or last_success
    period = value.get("period") if isinstance(value.get("period"), Mapping) else {}
    through = period.get("throughDate")
    try:
        through_date = date.fromisoformat(through) if isinstance(through, str) else None
    except ValueError:
        through_date = None
    if through_date is None:
        return None

    raw_models = value.get("models")
    models = []
    if isinstance(raw_models, list):
        for raw in raw_models[:MAX_MODELS]:
            if not isinstance(raw, Mapping):
                continue
            model_id = safe_text(raw.get("id"), limit=160)
            if not model_id or not _MODEL_ID.fullmatch(model_id):
                continue
            providers = []
            for provider in raw.get("providers", []) if isinstance(raw.get("providers"), list) else []:
                safe_provider = safe_text(provider, limit=80)
                if safe_provider and safe_provider not in providers:
                    providers.append(safe_provider)
            requests = safe_integer(raw.get("requests"))
            prompt = safe_integer(raw.get("promptTokens"))
            completion = safe_integer(raw.get("completionTokens"))
            reasoning = safe_integer(raw.get("reasoningTokens"))
            usage = finite_number(raw.get("usageCredits"))
            share = finite_number(raw.get("sharePercent"))
            if None in (requests, prompt, completion, reasoning, usage, share):
                continue
            models.append(
                {
                    "id": model_id,
                    "providers": providers,
                    "requests": requests,
                    "promptTokens": prompt,
                    "completionTokens": completion,
                    "reasoningTokens": reasoning,
                    "usageCredits": usage,
                    "sharePercent": round(max(0.0, min(100.0, share)), 1),
                }
            )

    summary = value.get("summary") if isinstance(value.get("summary"), Mapping) else {}
    requests = safe_integer(summary.get("requests"))
    usage = finite_number(summary.get("usageCredits"))
    model_count = safe_integer(summary.get("modelCount"))
    if status != "unavailable" and (
        not last_success or requests is None or usage is None or model_count is None
    ):
        return None
    return {
        "status": status,
        "lastCheckedAt": iso_utc(checked) if checked else None,
        "lastSuccessAt": iso_utc(last_success) if last_success else None,
        "period": {"days": 30, "timezone": "UTC", "throughDate": through_date.isoformat()},
        "summary": {
            "requests": requests or 0,
            "usageCredits": usage or 0.0,
            "modelCount": model_count or 0,
        },
        "models": models,
    }


def sanitize_snapshot(value: Any) -> Optional[Dict[str, Any]]:
    if not isinstance(value, Mapping) or value.get("schemaVersion") != SCHEMA_VERSION:
        return None
    credits = _sanitize_credits(value.get("credits"))
    activity = _sanitize_activity(value.get("activity"))
    checked = parse_iso(value.get("lastCheckedAt"))
    if not credits or not activity or not checked:
        return None
    successes = [
        parsed
        for parsed in (
            parse_iso(credits.get("lastSuccessAt")),
            parse_iso(activity.get("lastSuccessAt")),
        )
        if parsed
    ]
    generated = max(successes) if successes else checked
    return {
        "schemaVersion": SCHEMA_VERSION,
        "source": "openrouter",
        "generatedAt": iso_utc(generated),
        "lastCheckedAt": iso_utc(checked),
        "refreshIntervalSeconds": REFRESH_INTERVAL_SECONDS,
        "staleAfterSeconds": STALE_AFTER_SECONDS,
        "credits": credits,
        "activity": activity,
    }


def load_snapshot(path: Path) -> Optional[Dict[str, Any]]:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError):
        return None
    return sanitize_snapshot(payload)


def write_snapshot(path: Path, snapshot: Mapping[str, Any]) -> None:
    directory = path.parent
    directory.mkdir(parents=True, exist_ok=True, mode=0o700)
    os.chmod(directory, 0o700)
    descriptor, temporary_name = tempfile.mkstemp(
        prefix=".openrouter-usage.", suffix=".tmp", dir=str(directory)
    )
    try:
        os.fchmod(descriptor, 0o600)
        with os.fdopen(descriptor, "w", encoding="utf-8") as handle:
            json.dump(snapshot, handle, ensure_ascii=False, separators=(",", ":"))
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary_name, path)
        os.chmod(path, 0o600)
    except Exception:
        try:
            os.unlink(temporary_name)
        except OSError:
            pass
        raise


class OpenRouterCollector:
    def __init__(
        self,
        key_reader: Callable[[], str] = read_management_key,
        client: Optional[OpenRouterClient] = None,
        now_provider: Callable[[], datetime] = utc_now,
    ) -> None:
        self.key_reader = key_reader
        self.client = client or OpenRouterClient()
        self.now_provider = now_provider

    def collect(self, previous: Optional[Mapping[str, Any]] = None) -> Dict[str, Any]:
        checked_at = self.now_provider()
        if checked_at.tzinfo is None:
            checked_at = checked_at.replace(tzinfo=timezone.utc)
        previous_credits = previous.get("credits") if isinstance(previous, Mapping) else None
        previous_activity = previous.get("activity") if isinstance(previous, Mapping) else None
        try:
            key = self.key_reader()
        except OpenRouterUnavailable:
            credits = _failed_section(previous_credits, checked_at, _unavailable_credits)
            activity = _failed_section(previous_activity, checked_at, _unavailable_activity)
        else:
            try:
                credits = normalize_credits(
                    self.client.get_json(CREDITS_PATH, key), checked_at
                )
            except OpenRouterUnavailable:
                credits = _failed_section(previous_credits, checked_at, _unavailable_credits)
            try:
                activity = normalize_activity(
                    self.client.get_json(ACTIVITY_PATH, key), checked_at
                )
            except OpenRouterUnavailable:
                activity = _failed_section(previous_activity, checked_at, _unavailable_activity)
            del key

        snapshot = {
            "schemaVersion": SCHEMA_VERSION,
            "source": "openrouter",
            "generatedAt": iso_utc(checked_at),
            "lastCheckedAt": iso_utc(checked_at),
            "refreshIntervalSeconds": REFRESH_INTERVAL_SECONDS,
            "staleAfterSeconds": STALE_AFTER_SECONDS,
            "credits": credits,
            "activity": activity,
        }
        return sanitize_snapshot(snapshot) or snapshot

    def collect_to_path(self, path: Path) -> Dict[str, Any]:
        snapshot = self.collect(load_snapshot(path))
        write_snapshot(path, snapshot)
        return snapshot


def _public_section(section: Mapping[str, Any], now: datetime) -> Dict[str, Any]:
    public = copy.deepcopy(dict(section))
    public.pop("lastCheckedAt", None)
    last_success = parse_iso(public.get("lastSuccessAt"))
    if last_success and (now - last_success).total_seconds() > STALE_AFTER_SECONDS:
        public["status"] = "stale"
    return public


class OpenRouterSnapshotService:
    def __init__(
        self,
        snapshot_path: str,
        now_provider: Callable[[], datetime] = utc_now,
    ) -> None:
        self.snapshot_path = Path(snapshot_path).expanduser()
        self.now_provider = now_provider

    def get_usage(self) -> Dict[str, Any]:
        snapshot = load_snapshot(self.snapshot_path)
        if not snapshot:
            raise OpenRouterSnapshotUnavailable("OpenRouter snapshot is unavailable")
        now = self.now_provider()
        if now.tzinfo is None:
            now = now.replace(tzinfo=timezone.utc)
        now = now.astimezone(timezone.utc)
        credits = _public_section(snapshot["credits"], now)
        activity = _public_section(snapshot["activity"], now)
        if not credits.get("lastSuccessAt") and not activity.get("lastSuccessAt"):
            raise OpenRouterSnapshotUnavailable("OpenRouter data is unavailable")
        generated_at = parse_iso(snapshot.get("generatedAt"))
        if not generated_at:
            raise OpenRouterSnapshotUnavailable("OpenRouter snapshot is invalid")
        stale = credits["status"] != "live" or activity["status"] != "live"
        return {
            "meta": {
                "source": "openrouter",
                "schemaVersion": SCHEMA_VERSION,
                "generatedAt": iso_utc(generated_at),
                "staleAfterSeconds": STALE_AFTER_SECONDS,
                "stale": stale,
            },
            "credits": credits,
            "activity": activity,
        }


def openrouter_service_from_environment() -> OpenRouterSnapshotService:
    path = os.environ.get("OPENROUTER_SNAPSHOT", "/provider-data/openrouter-usage.json")
    return OpenRouterSnapshotService(path)
