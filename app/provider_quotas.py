from __future__ import annotations

import copy
import json
import math
import os
import re
import shutil
import subprocess
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Dict, List, Mapping, Optional, Sequence, Tuple


SCHEMA_VERSION = 1
REFRESH_INTERVAL_SECONDS = 300
STALE_AFTER_SECONDS = 900
PROVIDER_TIMEOUT_SECONDS = 15

_PROVIDER_ID = re.compile(r"^[a-z0-9][a-z0-9._-]{0,63}$")
_LIMIT_ID = re.compile(r"^[a-z0-9][a-z0-9._-]{0,31}$")
_MAX_RESET_CREDIT_ITEMS = 32
_EMAIL = re.compile(r"\b[^\s@]+@[^\s@]+\b")
_SENSITIVE_MARKERS = (
    "api key",
    "apikey",
    "access token",
    "refresh token",
    "oauth",
    "cookie",
    "bearer ",
    "account email",
    "account label",
    "sk-",
)
_CURRENCY_SYMBOLS = {"CNY": "¥", "USD": "$", "EUR": "€", "GBP": "£"}
_SYMBOL_CURRENCIES = {symbol: code for code, symbol in _CURRENCY_SYMBOLS.items()}
_BALANCE_DESCRIPTION = re.compile(
    r"^\s*(?P<main>[¥$€£]?\s*-?[0-9][0-9,]*(?:\.[0-9]+)?)\s*"
    r"(?:\(\s*Paid\s*:\s*(?P<paid>[¥$€£]?\s*-?[0-9][0-9,]*(?:\.[0-9]+)?)\s*"
    r"/\s*Granted\s*:\s*(?P<granted>[¥$€£]?\s*-?[0-9][0-9,]*(?:\.[0-9]+)?)\s*\))?\s*$",
    re.IGNORECASE,
)

_PROVIDER_NAMES = {
    "anthropic": "Anthropic",
    "claude": "Claude",
    "codex": "Codex",
    "cursor": "Cursor",
    "deepseek": "DeepSeek",
    "gemini": "Gemini",
    "kimi": "Kimi Code",
    "minimax": "MiniMax",
    "openai": "OpenAI",
    "openrouter": "OpenRouter",
    "qwen": "Qwen",
    "zai": "Z.ai",
}


class ProviderSnapshotUnavailable(RuntimeError):
    """Raised when no valid sanitized provider snapshot can be read."""


class CodexBarUnavailable(RuntimeError):
    """Raised for a generic CodexBar invocation or decoding failure."""


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


def canonical_iso(value: Any) -> Optional[str]:
    parsed = parse_iso(value)
    return iso_utc(parsed) if parsed else None


def finite_number(value: Any) -> Optional[float]:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return number if math.isfinite(number) else None


def provider_name(provider_id: str) -> str:
    known = _PROVIDER_NAMES.get(provider_id)
    if known:
        return known
    return provider_id.replace("_", " ").replace("-", " ").title()


def _safe_detail(value: Any, limit: int = 160) -> Optional[str]:
    if not isinstance(value, str):
        return None
    text = " ".join(value.split()).strip()
    if not text or len(text) > limit or _EMAIL.search(text):
        return None
    lowered = text.casefold()
    if any(marker in lowered for marker in _SENSITIVE_MARKERS):
        return None
    return text


def _parse_numeric_text(value: str) -> Optional[float]:
    stripped = value.strip().replace(",", "")
    stripped = stripped.lstrip("¥$€£").strip()
    return finite_number(stripped)


def _number_text(value: float) -> str:
    if value == int(value):
        return str(int(value))
    return f"{value:.6f}".rstrip("0").rstrip(".")


def _currency_text(amount: float, currency: str) -> str:
    symbol = _CURRENCY_SYMBOLS.get(currency)
    number = f"{amount:,.2f}"
    return f"{symbol}{number}" if symbol else f"{number} {currency}"


def _credits_balance(credits: Any) -> Optional[Dict[str, Any]]:
    if not isinstance(credits, Mapping):
        return None
    amount = finite_number(credits.get("remaining"))
    if amount is None:
        amount = finite_number(credits.get("balance"))
    if amount is None:
        return None

    raw_currency = credits.get("currency")
    currency = (
        str(raw_currency).upper()
        if isinstance(raw_currency, str) and re.fullmatch(r"[A-Za-z]{3}", raw_currency)
        else None
    )
    if currency:
        return {
            "text": _currency_text(amount, currency),
            "amount": amount,
            "currency": currency,
        }
    return {
        "text": f"{_number_text(amount)} credits",
        "amount": amount,
        "unit": "credits",
    }


def _description_balance(description: Any) -> Optional[Dict[str, Any]]:
    if not isinstance(description, str):
        return None
    match = _BALANCE_DESCRIPTION.match(description)
    if not match:
        return None

    main_text = re.sub(r"\s+", "", match.group("main"))
    amount = _parse_numeric_text(main_text)
    if amount is None:
        return None
    symbol = main_text[0] if main_text[0] in _SYMBOL_CURRENCIES else None
    currency = _SYMBOL_CURRENCIES.get(symbol) if symbol else None
    balance: Dict[str, Any] = {
        "text": _currency_text(amount, currency) if currency else _number_text(amount),
        "amount": amount,
    }
    if currency:
        balance["currency"] = currency

    paid = match.group("paid")
    granted = match.group("granted")
    if paid is not None and granted is not None:
        paid_text = re.sub(r"\s+", "", paid)
        granted_text = re.sub(r"\s+", "", granted)
        paid_amount = _parse_numeric_text(paid_text)
        granted_amount = _parse_numeric_text(granted_text)
        if paid_amount is not None and granted_amount is not None:
            if currency:
                paid_text = _currency_text(paid_amount, currency)
                granted_text = _currency_text(granted_amount, currency)
            else:
                paid_text = _number_text(paid_amount)
                granted_text = _number_text(granted_amount)
            balance["detail"] = f"Paid {paid_text} · Granted {granted_text}"
    return balance


def _money_value(value: Any) -> Optional[Tuple[float, Optional[str]]]:
    if not isinstance(value, str):
        return None
    compact = re.sub(r"\s+", "", value)
    amount = _parse_numeric_text(compact)
    if amount is None:
        return None
    symbol = compact[0] if compact and compact[0] in _SYMBOL_CURRENCIES else None
    return amount, _SYMBOL_CURRENCIES.get(symbol) if symbol else None


def _details_balance(usage: Any) -> Optional[Dict[str, Any]]:
    """Extract only the public Credits summary from newer CodexBar payloads."""
    if not isinstance(usage, Mapping):
        return None
    details = usage.get("details")
    if not isinstance(details, list):
        return None

    credit_rows: Optional[List[Any]] = None
    for section in details[:8]:
        if not isinstance(section, Mapping):
            continue
        title = section.get("title")
        rows = section.get("rows")
        if (
            isinstance(title, str)
            and title.strip().casefold() == "credits"
            and isinstance(rows, list)
        ):
            credit_rows = rows
            break
    if credit_rows is None:
        return None

    values: Dict[str, Tuple[float, Optional[str]]] = {}
    allowed_labels = {"remaining", "used", "total added"}
    for row in credit_rows[:12]:
        if not isinstance(row, Mapping):
            continue
        label = row.get("label")
        if not isinstance(label, str):
            continue
        normalized_label = label.strip().casefold()
        if normalized_label not in allowed_labels:
            continue
        parsed = _money_value(row.get("value"))
        if parsed is not None:
            values[normalized_label] = parsed

    remaining = values.get("remaining")
    if remaining is None:
        return None
    amount, currency = remaining
    balance: Dict[str, Any] = {
        "text": _currency_text(amount, currency) if currency else _number_text(amount),
        "amount": amount,
    }
    if currency:
        balance["currency"] = currency

    detail_parts = []
    for label, output_label in (("used", "Used"), ("total added", "Total added")):
        parsed = values.get(label)
        if parsed is None:
            continue
        detail_amount, detail_currency = parsed
        if currency and detail_currency not in {None, currency}:
            continue
        detail_parts.append(
            f"{output_label} "
            f"{_currency_text(detail_amount, currency) if currency else _number_text(detail_amount)}"
        )
    if detail_parts:
        balance["detail"] = " · ".join(detail_parts)
    return balance


def _quota_limit(
    limit_id: str,
    raw_limit: Any,
    detail_source: Any = None,
) -> Optional[Dict[str, Any]]:
    if not isinstance(raw_limit, Mapping):
        return None
    used_percent = finite_number(raw_limit.get("usedPercent"))
    if used_percent is None:
        return None

    limit: Dict[str, Any] = {
        "id": limit_id,
        "remainingPercent": round(
            max(0.0, min(100.0, 100.0 - used_percent)), 1
        ),
    }
    window_number = finite_number(raw_limit.get("windowMinutes"))
    if window_number is not None and window_number > 0:
        limit["windowMinutes"] = int(window_number)
    reset_at = canonical_iso(raw_limit.get("resetsAt"))
    if reset_at:
        limit["resetAt"] = reset_at
    detail = _safe_detail(
        raw_limit.get("resetDescription")
        if raw_limit.get("resetDescription") is not None
        else detail_source
    )
    if detail:
        limit["detail"] = detail
    return limit


def _sort_limits_by_window(limits: List[Dict[str, Any]]) -> None:
    """Keep quota windows consistent from shortest to longest."""
    def window_minutes(limit: Mapping[str, Any]) -> float:
        window = finite_number(limit.get("windowMinutes"))
        return window if window is not None and window > 0 else math.inf

    limits.sort(key=window_minutes)


def _reset_credits(value: Any) -> Optional[Dict[str, Any]]:
    if not isinstance(value, Mapping):
        return None
    available_count = finite_number(value.get("availableCount"))
    if (
        available_count is None
        or available_count < 0
        or not available_count.is_integer()
    ):
        return None

    items: List[Dict[str, Optional[str]]] = []
    raw_credits = value.get("credits")
    if isinstance(raw_credits, list):
        for raw_credit in raw_credits:
            if not isinstance(raw_credit, Mapping):
                continue
            if raw_credit.get("status") != "available":
                continue
            raw_expiry = raw_credit.get("expires_at")
            if raw_expiry is None:
                raw_expiry = raw_credit.get("expiresAt")
            if raw_expiry is None:
                expires_at = None
            else:
                expires_at = canonical_iso(raw_expiry)
                if expires_at is None:
                    continue
            items.append({"expiresAt": expires_at})

    items.sort(key=lambda item: (item["expiresAt"] is None, item["expiresAt"] or ""))
    return {
        "availableCount": int(available_count),
        "items": items[:_MAX_RESET_CREDIT_ITEMS],
    }


def _usage_row(raw_payload: Any, provider_id: str) -> Mapping[str, Any]:
    rows: Sequence[Any]
    if isinstance(raw_payload, list):
        rows = raw_payload
    elif isinstance(raw_payload, Mapping):
        possible_rows = raw_payload.get("providers")
        rows = possible_rows if isinstance(possible_rows, list) else [raw_payload]
    else:
        raise CodexBarUnavailable("CodexBar returned an unsupported response")

    mappings = [row for row in rows if isinstance(row, Mapping)]
    for row in mappings:
        if row.get("provider") == provider_id:
            return row
    if mappings:
        return mappings[0]
    raise CodexBarUnavailable("CodexBar returned no provider data")


def normalize_provider_payload(
    provider_id: str,
    raw_payload: Any,
    checked_at: Optional[datetime] = None,
) -> Dict[str, Any]:
    if not _PROVIDER_ID.fullmatch(provider_id):
        raise CodexBarUnavailable("Invalid provider identifier")
    row = _usage_row(raw_payload, provider_id)
    usage = row.get("usage")
    credits = row.get("credits")
    if not isinstance(usage, Mapping) and not isinstance(credits, Mapping):
        raise CodexBarUnavailable("CodexBar returned no usage or balance data")

    balance = _credits_balance(credits) or _details_balance(usage)
    limits: List[Dict[str, Any]] = []
    if isinstance(usage, Mapping):
        for slot in ("primary", "secondary", "tertiary"):
            raw_limit = usage.get(slot)
            if not isinstance(raw_limit, Mapping):
                continue

            description_balance = _description_balance(
                raw_limit.get("resetDescription")
            )
            window_number = finite_number(raw_limit.get("windowMinutes"))
            reset_at = canonical_iso(raw_limit.get("resetsAt"))
            if description_balance and not window_number and not reset_at:
                if balance is None:
                    balance = description_balance
                continue
            limit = _quota_limit(slot, raw_limit)
            if limit:
                limits.append(limit)

        extra_windows = usage.get("extraRateWindows")
        if isinstance(extra_windows, list):
            seen_ids = {limit["id"] for limit in limits}
            for index, raw_extra in enumerate(extra_windows[:5]):
                if not isinstance(raw_extra, Mapping):
                    continue
                raw_id = raw_extra.get("id")
                limit_id = (
                    raw_id
                    if isinstance(raw_id, str) and _LIMIT_ID.fullmatch(raw_id)
                    else f"extra-{index + 1}"
                )
                if limit_id in seen_ids:
                    continue
                extra_limit = _quota_limit(
                    limit_id,
                    raw_extra.get("window"),
                    detail_source=raw_extra.get("title"),
                )
                if extra_limit:
                    seen_ids.add(limit_id)
                    limits.append(extra_limit)

    _sort_limits_by_window(limits)

    checked = checked_at or utc_now()
    provider = {
        "id": provider_id,
        "name": provider_name(provider_id),
        "status": "live",
        "lastCheckedAt": iso_utc(checked),
        "lastSuccessAt": iso_utc(checked),
        "balance": balance,
        "limits": limits,
    }
    if provider_id == "codex" and isinstance(usage, Mapping):
        reset_credits = _reset_credits(usage.get("codexResetCredits"))
        if reset_credits is not None:
            provider["resetCredits"] = reset_credits
    return provider


def _sanitize_balance(value: Any) -> Optional[Dict[str, Any]]:
    if not isinstance(value, Mapping):
        return None
    amount = finite_number(value.get("amount"))
    raw_currency = value.get("currency")
    currency = (
        raw_currency.upper()
        if isinstance(raw_currency, str) and re.fullmatch(r"[A-Za-z]{3}", raw_currency)
        else None
    )
    unit = value.get("unit") if value.get("unit") == "credits" else None
    text = _safe_detail(value.get("text"), limit=80)
    if amount is not None and currency:
        text = _currency_text(amount, currency)
    elif amount is not None and unit:
        text = f"{_number_text(amount)} credits"
    if not text:
        return None

    balance: Dict[str, Any] = {"text": text}
    if amount is not None:
        balance["amount"] = amount
    if currency:
        balance["currency"] = currency
    if unit:
        balance["unit"] = unit
    detail = _safe_detail(value.get("detail"))
    if detail:
        balance["detail"] = detail
    return balance


def _sanitize_limits(value: Any) -> List[Dict[str, Any]]:
    if not isinstance(value, list):
        return []
    limits: List[Dict[str, Any]] = []
    seen = set()
    for index, raw_limit in enumerate(value[:8]):
        if not isinstance(raw_limit, Mapping):
            continue
        raw_id = raw_limit.get("id")
        limit_id = (
            raw_id
            if isinstance(raw_id, str) and _LIMIT_ID.fullmatch(raw_id)
            else f"limit-{index + 1}"
        )
        if limit_id in seen:
            continue
        remaining = finite_number(raw_limit.get("remainingPercent"))
        if remaining is None:
            continue
        seen.add(limit_id)
        item: Dict[str, Any] = {
            "id": limit_id,
            "remainingPercent": round(max(0.0, min(100.0, remaining)), 1),
        }
        window = finite_number(raw_limit.get("windowMinutes"))
        if window is not None and window > 0:
            item["windowMinutes"] = int(window)
        reset_at = canonical_iso(raw_limit.get("resetAt"))
        if reset_at:
            item["resetAt"] = reset_at
        detail = _safe_detail(raw_limit.get("detail"))
        if detail:
            item["detail"] = detail
        limits.append(item)
    _sort_limits_by_window(limits)
    return limits


def _sanitize_reset_credits(value: Any) -> Optional[Dict[str, Any]]:
    if not isinstance(value, Mapping):
        return None
    available_count = finite_number(value.get("availableCount"))
    if (
        available_count is None
        or available_count < 0
        or not available_count.is_integer()
    ):
        return None

    items: List[Dict[str, Optional[str]]] = []
    raw_items = value.get("items")
    if isinstance(raw_items, list):
        for raw_item in raw_items:
            if not isinstance(raw_item, Mapping):
                continue
            if "expiresAt" not in raw_item:
                continue
            raw_expiry = raw_item.get("expiresAt")
            if raw_expiry is None:
                expires_at = None
            else:
                expires_at = canonical_iso(raw_expiry)
                if expires_at is None:
                    continue
            items.append({"expiresAt": expires_at})

    items.sort(key=lambda item: (item["expiresAt"] is None, item["expiresAt"] or ""))
    return {
        "availableCount": int(available_count),
        "items": items[:_MAX_RESET_CREDIT_ITEMS],
    }


def sanitize_provider_record(value: Any, include_checked: bool = False) -> Optional[Dict[str, Any]]:
    if not isinstance(value, Mapping):
        return None
    provider_id = value.get("id")
    if not isinstance(provider_id, str) or not _PROVIDER_ID.fullmatch(provider_id):
        return None
    status = value.get("status")
    if status not in {"live", "stale", "unavailable"}:
        status = "unavailable"
    record: Dict[str, Any] = {
        "id": provider_id,
        "name": provider_name(provider_id),
        "status": status,
        "lastSuccessAt": canonical_iso(value.get("lastSuccessAt")),
        "balance": _sanitize_balance(value.get("balance")),
        "limits": _sanitize_limits(value.get("limits")),
    }
    if provider_id == "codex":
        reset_credits = _sanitize_reset_credits(value.get("resetCredits"))
        if reset_credits is not None:
            record["resetCredits"] = reset_credits
    if include_checked:
        record["lastCheckedAt"] = canonical_iso(value.get("lastCheckedAt"))
    return record


def load_previous_snapshot(path: Path) -> Optional[Dict[str, Any]]:
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError):
        return None
    if not isinstance(raw, Mapping) or raw.get("schemaVersion") != SCHEMA_VERSION:
        return None
    providers = []
    for value in raw.get("providers", []):
        sanitized = sanitize_provider_record(value, include_checked=True)
        if sanitized:
            providers.append(sanitized)
    return {
        "schemaVersion": SCHEMA_VERSION,
        "source": "codexbar",
        "generatedAt": canonical_iso(raw.get("generatedAt")),
        "refreshIntervalSeconds": REFRESH_INTERVAL_SECONDS,
        "staleAfterSeconds": STALE_AFTER_SECONDS,
        "providers": providers,
    }


def _failed_provider(
    provider_id: str,
    checked_at: datetime,
    previous: Optional[Mapping[str, Any]],
) -> Dict[str, Any]:
    if previous:
        record = copy.deepcopy(dict(previous))
        record["id"] = provider_id
        record["name"] = provider_name(provider_id)
        record["status"] = "stale" if record.get("lastSuccessAt") else "unavailable"
        record["lastCheckedAt"] = iso_utc(checked_at)
        return record
    return {
        "id": provider_id,
        "name": provider_name(provider_id),
        "status": "unavailable",
        "lastCheckedAt": iso_utc(checked_at),
        "lastSuccessAt": None,
        "balance": None,
        "limits": [],
    }


def find_codexbar() -> Optional[str]:
    discovered = shutil.which("codexbar")
    if discovered:
        return discovered
    for candidate in ("/opt/homebrew/bin/codexbar", "/usr/local/bin/codexbar"):
        if Path(candidate).is_file() and os.access(candidate, os.X_OK):
            return candidate
    return None


class CodexBarCollector:
    def __init__(
        self,
        binary: Optional[str] = None,
        runner: Callable[..., Any] = subprocess.run,
        timeout_seconds: int = PROVIDER_TIMEOUT_SECONDS,
        now_provider: Callable[[], datetime] = utc_now,
    ) -> None:
        self.binary = binary or find_codexbar()
        self.runner = runner
        self.timeout_seconds = max(1, int(timeout_seconds))
        self.now_provider = now_provider

    def _run_json(self, arguments: Sequence[str]) -> Any:
        if not self.binary:
            raise CodexBarUnavailable("CodexBar CLI is unavailable")
        command = [self.binary, *arguments, "--format", "json", "--json-only"]
        try:
            result = self.runner(
                command,
                capture_output=True,
                text=True,
                check=False,
                timeout=self.timeout_seconds,
            )
        except (OSError, subprocess.TimeoutExpired) as exc:
            raise CodexBarUnavailable("CodexBar invocation failed") from exc
        if result.returncode != 0:
            raise CodexBarUnavailable("CodexBar invocation failed")
        try:
            return json.loads(result.stdout)
        except (TypeError, json.JSONDecodeError) as exc:
            raise CodexBarUnavailable("CodexBar returned invalid JSON") from exc

    def _enabled_providers(self) -> List[str]:
        payload = self._run_json(["config", "providers"])
        if isinstance(payload, Mapping):
            payload = payload.get("providers")
        if not isinstance(payload, list):
            raise CodexBarUnavailable("CodexBar provider config is unavailable")
        enabled: List[str] = []
        for item in payload:
            if not isinstance(item, Mapping):
                continue
            provider_id = item.get("provider")
            is_enabled = item.get("enabled", item.get("defaultEnabled", False))
            if (
                is_enabled is True
                and isinstance(provider_id, str)
                and _PROVIDER_ID.fullmatch(provider_id)
                and provider_id not in enabled
            ):
                enabled.append(provider_id)
        return enabled

    def _provider_usage(self, provider_id: str) -> Tuple[Any, bool]:
        try:
            return self._run_json(["usage", "--provider", provider_id]), False
        except CodexBarUnavailable:
            if provider_id != "codex":
                raise
        return (
            self._run_json(
                ["usage", "--provider", provider_id, "--source", "oauth"]
            ),
            True,
        )

    def collect(self, previous: Optional[Mapping[str, Any]] = None) -> Dict[str, Any]:
        checked_at = self.now_provider()
        previous_records = {
            item["id"]: item
            for item in (previous or {}).get("providers", [])
            if isinstance(item, Mapping) and isinstance(item.get("id"), str)
        }
        try:
            provider_ids = self._enabled_providers()
        except CodexBarUnavailable:
            providers = [
                _failed_provider(provider_id, checked_at, record)
                for provider_id, record in previous_records.items()
            ]
        else:
            providers = []
            for provider_id in provider_ids:
                try:
                    raw_usage, used_oauth = self._provider_usage(provider_id)
                    try:
                        provider = normalize_provider_payload(
                            provider_id, raw_usage, checked_at=checked_at
                        )
                    except CodexBarUnavailable:
                        if provider_id != "codex" or used_oauth:
                            raise
                        oauth_usage = self._run_json(
                            [
                                "usage",
                                "--provider",
                                provider_id,
                                "--source",
                                "oauth",
                            ]
                        )
                        provider = normalize_provider_payload(
                            provider_id, oauth_usage, checked_at=checked_at
                        )
                except CodexBarUnavailable:
                    provider = _failed_provider(
                        provider_id, checked_at, previous_records.get(provider_id)
                    )
                providers.append(provider)

        return {
            "schemaVersion": SCHEMA_VERSION,
            "source": "codexbar",
            "generatedAt": iso_utc(checked_at),
            "refreshIntervalSeconds": REFRESH_INTERVAL_SECONDS,
            "staleAfterSeconds": STALE_AFTER_SECONDS,
            "providers": providers,
        }

    def collect_to_path(self, path: Path) -> Dict[str, Any]:
        previous = load_previous_snapshot(path)
        snapshot = self.collect(previous)
        write_snapshot(path, snapshot)
        return snapshot


def write_snapshot(path: Path, snapshot: Mapping[str, Any]) -> None:
    directory = path.parent
    directory.mkdir(parents=True, exist_ok=True, mode=0o700)
    os.chmod(directory, 0o700)
    descriptor, temporary_name = tempfile.mkstemp(
        prefix=".codexbar-providers.", suffix=".tmp", dir=str(directory)
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


class ProviderSnapshotService:
    def __init__(
        self,
        snapshot_path: str,
        now_provider: Callable[[], datetime] = utc_now,
    ) -> None:
        self.snapshot_path = Path(snapshot_path).expanduser()
        self.now_provider = now_provider

    def get_providers(self) -> Dict[str, Any]:
        snapshot = load_previous_snapshot(self.snapshot_path)
        if not snapshot or not snapshot.get("generatedAt"):
            raise ProviderSnapshotUnavailable("Provider snapshot is unavailable")
        generated_at = parse_iso(snapshot["generatedAt"])
        if not generated_at:
            raise ProviderSnapshotUnavailable("Provider snapshot is invalid")

        now = self.now_provider()
        if now.tzinfo is None:
            now = now.replace(tzinfo=timezone.utc)
        age_seconds = max(0.0, (now.astimezone(timezone.utc) - generated_at).total_seconds())
        stale = age_seconds > STALE_AFTER_SECONDS
        providers = []
        for raw_provider in snapshot.get("providers", []):
            provider = sanitize_provider_record(raw_provider)
            if not provider:
                continue
            if stale and provider["status"] == "live":
                provider["status"] = "stale"
            providers.append(provider)

        return {
            "meta": {
                "source": "codexbar",
                "schemaVersion": SCHEMA_VERSION,
                "generatedAt": iso_utc(generated_at),
                "staleAfterSeconds": STALE_AFTER_SECONDS,
                "stale": stale,
            },
            "providers": providers,
        }


def provider_service_from_environment() -> ProviderSnapshotService:
    path = os.environ.get(
        "CODEXBAR_SNAPSHOT", "/provider-data/codexbar-providers.json"
    )
    return ProviderSnapshotService(path)
