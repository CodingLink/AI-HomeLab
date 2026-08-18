from __future__ import annotations

import copy
import json
import os
import re
import socket
import tempfile
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Dict, Mapping, Optional, Tuple
from urllib.parse import quote


SCHEMA_VERSION = 1
REFRESH_INTERVAL_SECONDS = 300
STALE_AFTER_SECONDS = 900
REQUEST_TIMEOUT_SECONDS = 3
MAX_RESPONSE_BYTES = 1024 * 1024
PROXY_GROUP = "PROXY"
DEFAULT_CONFIG_PATH = (
    Path.home()
    / "Library"
    / "Application Support"
    / "io.github.clash-verge-rev.clash-verge-rev"
    / "clash-verge.yaml"
)

_INLINE_COMMENT = re.compile(r"\s+#")


class ClashVergeUnavailable(RuntimeError):
    """Raised when the selected Clash Verge proxy cannot be collected safely."""


class ClashVergeSnapshotUnavailable(RuntimeError):
    """Raised when no valid sanitized Clash Verge snapshot exists."""


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def iso_utc(value: datetime) -> str:
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def parse_iso(value: Any) -> Optional[datetime]:
    if not isinstance(value, str) or not value:
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def _parse_yaml_scalar(raw_value: str) -> str:
    value = raw_value.strip()
    if not value:
        return ""
    if value.startswith('"'):
        try:
            parsed = json.loads(value)
        except (TypeError, json.JSONDecodeError) as exc:
            raise ClashVergeUnavailable("Clash Verge configuration is invalid") from exc
        return parsed if isinstance(parsed, str) else ""
    if value.startswith("'"):
        if len(value) < 2 or not value.endswith("'"):
            raise ClashVergeUnavailable("Clash Verge configuration is invalid")
        return value[1:-1].replace("''", "'")
    comment = _INLINE_COMMENT.search(value)
    if comment:
        value = value[: comment.start()]
    return value.strip()


def read_controller_config(path: Path) -> Tuple[str, str]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except (OSError, UnicodeError) as exc:
        raise ClashVergeUnavailable("Clash Verge configuration is unavailable") from exc

    values: Dict[str, str] = {}
    for raw_line in lines:
        if not raw_line or raw_line[:1].isspace() or ":" not in raw_line:
            continue
        key, raw_value = raw_line.lstrip("\ufeff").split(":", 1)
        if key in {"external-controller-unix", "secret"}:
            values[key] = _parse_yaml_scalar(raw_value)

    socket_path = values.get("external-controller-unix", "")
    secret = values.get("secret", "")
    if (
        not socket_path
        or not os.path.isabs(socket_path)
        or not secret
        or any(unicodedata.category(character).startswith("C") for character in socket_path)
        or any(unicodedata.category(character).startswith("C") for character in secret)
    ):
        raise ClashVergeUnavailable("Clash Verge local controller is unavailable")
    return socket_path, secret


def _decode_chunked(body: bytes) -> bytes:
    decoded = bytearray()
    remaining = body
    while True:
        try:
            size_line, remaining = remaining.split(b"\r\n", 1)
            size = int(size_line.split(b";", 1)[0], 16)
        except (ValueError, IndexError) as exc:
            raise ClashVergeUnavailable("Clash Verge returned invalid HTTP data") from exc
        if size == 0:
            return bytes(decoded)
        if size < 0 or len(remaining) < size + 2 or remaining[size : size + 2] != b"\r\n":
            raise ClashVergeUnavailable("Clash Verge returned invalid HTTP data")
        decoded.extend(remaining[:size])
        if len(decoded) > MAX_RESPONSE_BYTES:
            raise ClashVergeUnavailable("Clash Verge response is too large")
        remaining = remaining[size + 2 :]


def request_proxy_group(
    socket_path: str,
    secret: str,
    group: str = PROXY_GROUP,
    timeout_seconds: int = REQUEST_TIMEOUT_SECONDS,
    socket_factory: Callable[[], Any] = lambda: socket.socket(
        socket.AF_UNIX, socket.SOCK_STREAM
    ),
) -> Mapping[str, Any]:
    connection = socket_factory()
    try:
        connection.settimeout(max(1, int(timeout_seconds)))
        connection.connect(socket_path)
        request_lines = [
            "GET /proxies/{} HTTP/1.1".format(quote(group, safe="")),
            "Host: localhost",
            "Accept: application/json",
            "Authorization: Bearer {}".format(secret),
            "Connection: close",
        ]
        connection.sendall(("\r\n".join(request_lines) + "\r\n\r\n").encode("utf-8"))
        chunks = []
        total = 0
        while True:
            chunk = connection.recv(65536)
            if not chunk:
                break
            total += len(chunk)
            if total > MAX_RESPONSE_BYTES:
                raise ClashVergeUnavailable("Clash Verge response is too large")
            chunks.append(chunk)
    except (OSError, TimeoutError) as exc:
        raise ClashVergeUnavailable("Clash Verge local controller is unavailable") from exc
    finally:
        try:
            connection.close()
        except OSError:
            pass

    try:
        header_bytes, body = b"".join(chunks).split(b"\r\n\r\n", 1)
        status = int(header_bytes.split(b" ", 2)[1])
    except (ValueError, IndexError) as exc:
        raise ClashVergeUnavailable("Clash Verge returned invalid HTTP data") from exc
    headers = {}
    for line in header_bytes.split(b"\r\n")[1:]:
        if b":" not in line:
            continue
        key, value = line.split(b":", 1)
        headers[key.strip().lower()] = value.strip().lower()
    if status != 200:
        raise ClashVergeUnavailable("Clash Verge proxy group is unavailable")
    if headers.get(b"transfer-encoding") == b"chunked":
        body = _decode_chunked(body)
    try:
        payload = json.loads(body)
    except (UnicodeError, json.JSONDecodeError) as exc:
        raise ClashVergeUnavailable("Clash Verge returned invalid JSON") from exc
    if not isinstance(payload, Mapping):
        raise ClashVergeUnavailable("Clash Verge returned invalid proxy data")
    return payload


def sanitize_node_name(value: Any) -> Optional[str]:
    if not isinstance(value, str):
        return None
    cleaned = "".join(
        "" if unicodedata.category(character).startswith("C") else character
        for character in value
    )
    cleaned = " ".join(cleaned.split()).strip()
    if not cleaned or len(cleaned) > 160:
        return None
    return cleaned


def normalize_proxy_payload(payload: Mapping[str, Any], checked_at: datetime) -> Dict[str, Any]:
    if payload.get("type") != "Selector":
        raise ClashVergeUnavailable("PROXY is not a selector")
    name = sanitize_node_name(payload.get("now"))
    if not name:
        raise ClashVergeUnavailable("PROXY has no valid selected node")
    return {
        "schemaVersion": SCHEMA_VERSION,
        "source": "clash-verge",
        "generatedAt": iso_utc(checked_at),
        "lastCheckedAt": iso_utc(checked_at),
        "refreshIntervalSeconds": REFRESH_INTERVAL_SECONDS,
        "staleAfterSeconds": STALE_AFTER_SECONDS,
        "status": "live",
        "proxy": {"status": "selected", "name": name},
    }


def sanitize_snapshot(value: Any) -> Optional[Dict[str, Any]]:
    if not isinstance(value, Mapping):
        return None
    generated_at = parse_iso(value.get("generatedAt"))
    last_checked_at = parse_iso(value.get("lastCheckedAt")) or generated_at
    status = value.get("status")
    proxy = value.get("proxy")
    if not generated_at or status not in {"live", "stale", "unavailable"}:
        return None
    if not isinstance(proxy, Mapping):
        return None
    proxy_status = proxy.get("status")
    name = sanitize_node_name(proxy.get("name"))
    if proxy_status == "selected" and not name:
        return None
    if proxy_status not in {"selected", "unavailable"}:
        return None
    return {
        "schemaVersion": SCHEMA_VERSION,
        "source": "clash-verge",
        "generatedAt": iso_utc(generated_at),
        "lastCheckedAt": iso_utc(last_checked_at or generated_at),
        "refreshIntervalSeconds": REFRESH_INTERVAL_SECONDS,
        "staleAfterSeconds": STALE_AFTER_SECONDS,
        "status": status,
        "proxy": {
            "status": proxy_status,
            "name": name if proxy_status == "selected" else None,
        },
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
        prefix=".clash-verge-status.", suffix=".tmp", dir=str(directory)
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


class ClashVergeCollector:
    def __init__(
        self,
        config_path: Path = DEFAULT_CONFIG_PATH,
        requester: Callable[..., Mapping[str, Any]] = request_proxy_group,
        now_provider: Callable[[], datetime] = utc_now,
    ) -> None:
        self.config_path = Path(config_path).expanduser()
        self.requester = requester
        self.now_provider = now_provider

    def collect(self, previous: Optional[Mapping[str, Any]] = None) -> Dict[str, Any]:
        checked_at = self.now_provider()
        try:
            socket_path, secret = read_controller_config(self.config_path)
            payload = self.requester(socket_path, secret, PROXY_GROUP)
            return normalize_proxy_payload(payload, checked_at)
        except ClashVergeUnavailable:
            sanitized_previous = sanitize_snapshot(previous)
            if sanitized_previous and sanitized_previous["proxy"]["status"] == "selected":
                failed = copy.deepcopy(sanitized_previous)
                failed["status"] = "stale"
                failed["lastCheckedAt"] = iso_utc(checked_at)
                return failed
            return {
                "schemaVersion": SCHEMA_VERSION,
                "source": "clash-verge",
                "generatedAt": iso_utc(checked_at),
                "lastCheckedAt": iso_utc(checked_at),
                "refreshIntervalSeconds": REFRESH_INTERVAL_SECONDS,
                "staleAfterSeconds": STALE_AFTER_SECONDS,
                "status": "unavailable",
                "proxy": {"status": "unavailable", "name": None},
            }

    def collect_to_path(self, path: Path) -> Dict[str, Any]:
        snapshot = self.collect(load_snapshot(path))
        write_snapshot(path, snapshot)
        return snapshot


class ClashVergeSnapshotService:
    def __init__(
        self,
        snapshot_path: str,
        now_provider: Callable[[], datetime] = utc_now,
    ) -> None:
        self.snapshot_path = Path(snapshot_path).expanduser()
        self.now_provider = now_provider

    def get_status(self) -> Dict[str, Any]:
        snapshot = load_snapshot(self.snapshot_path)
        if not snapshot:
            raise ClashVergeSnapshotUnavailable("Clash Verge snapshot is unavailable")
        generated_at = parse_iso(snapshot["generatedAt"])
        if generated_at is None:
            raise ClashVergeSnapshotUnavailable("Clash Verge snapshot is invalid")
        now = self.now_provider()
        if now.tzinfo is None:
            now = now.replace(tzinfo=timezone.utc)
        age = max(0.0, (now.astimezone(timezone.utc) - generated_at).total_seconds())
        stale = snapshot["status"] != "live" or age > STALE_AFTER_SECONDS
        return {
            "meta": {
                "source": "clash-verge",
                "schemaVersion": SCHEMA_VERSION,
                "generatedAt": iso_utc(generated_at),
                "staleAfterSeconds": STALE_AFTER_SECONDS,
                "stale": stale,
            },
            "proxy": copy.deepcopy(snapshot["proxy"]),
        }


def clash_verge_service_from_environment() -> ClashVergeSnapshotService:
    path = os.environ.get(
        "CLASH_VERGE_SNAPSHOT", "/provider-data/clash-verge-status.json"
    )
    return ClashVergeSnapshotService(path)
