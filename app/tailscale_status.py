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
from typing import Any, Callable, Dict, Mapping, Optional, Sequence


SCHEMA_VERSION = 1
REFRESH_INTERVAL_SECONDS = 300
STALE_AFTER_SECONDS = 900
COMMAND_TIMEOUT_SECONDS = 15

_DERP_CODE = re.compile(r"^[a-z0-9-]{1,16}$")
_CONNECTION_STATUSES = {"online", "offline", "unavailable"}
_TRANSPORT_MODES = {
    "direct",
    "derp",
    "peer_relay",
    "mixed",
    "idle",
    "unknown",
}
_PEER_COUNT_MODES = ("direct", "derp", "peerRelay", "unknown")


class TailscaleUnavailable(RuntimeError):
    """Raised when sanitized Tailscale status cannot be collected."""


class TailscaleSnapshotUnavailable(RuntimeError):
    """Raised when no valid sanitized Tailscale snapshot exists."""


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


def finite_number(value: Any) -> Optional[float]:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return number if math.isfinite(number) else None


def find_tailscale() -> Optional[str]:
    discovered = shutil.which("tailscale")
    if discovered:
        return discovered
    for candidate in ("/opt/homebrew/bin/tailscale", "/usr/local/bin/tailscale"):
        if Path(candidate).is_file() and os.access(candidate, os.X_OK):
            return candidate
    return None


def classify_transport_counts(status_payload: Any) -> Optional[Dict[str, int]]:
    if not isinstance(status_payload, Mapping):
        return None
    raw_peers = status_payload.get("Peer")
    if isinstance(raw_peers, Mapping):
        peers = raw_peers.values()
    elif isinstance(raw_peers, list):
        peers = raw_peers
    else:
        return None

    counts = {mode: 0 for mode in _PEER_COUNT_MODES}
    for peer in peers:
        if not isinstance(peer, Mapping) or peer.get("Active") is not True:
            continue
        if isinstance(peer.get("CurAddr"), str) and peer["CurAddr"].strip():
            counts["direct"] += 1
        elif peer.get("PeerRelay"):
            counts["peerRelay"] += 1
        elif peer.get("Relay"):
            counts["derp"] += 1
        else:
            counts["unknown"] += 1
    counts["active"] = sum(counts.values())
    return counts


def classify_transport(status_payload: Any) -> str:
    counts = classify_transport_counts(status_payload)
    if counts is None:
        return "unknown"

    active_count = counts["active"]
    if active_count == 0:
        return "idle"
    if counts["unknown"]:
        return "unknown"

    modes = {
        mode
        for mode in ("direct", "derp", "peerRelay")
        if counts[mode]
    }
    if len(modes) == 1:
        return {
            "direct": "direct",
            "derp": "derp",
            "peerRelay": "peer_relay",
        }[next(iter(modes))]
    return "mixed"


def connection_status(status_payload: Any) -> str:
    if not isinstance(status_payload, Mapping):
        return "unavailable"
    backend = status_payload.get("BackendState")
    self_status = status_payload.get("Self")
    if backend != "Running":
        return "offline" if isinstance(backend, str) else "unavailable"
    if not isinstance(self_status, Mapping) or not isinstance(
        self_status.get("Online"), bool
    ):
        return "unavailable"
    return "online" if self_status["Online"] else "offline"


def _regions_by_id(derp_map: Any) -> Dict[int, Dict[str, Any]]:
    if not isinstance(derp_map, Mapping):
        return {}
    raw_regions = derp_map.get("Regions")
    if not isinstance(raw_regions, Mapping):
        return {}
    regions: Dict[int, Dict[str, Any]] = {}
    for raw_id, raw_region in raw_regions.items():
        if not isinstance(raw_region, Mapping):
            continue
        try:
            region_id = int(raw_id)
        except (TypeError, ValueError):
            continue
        raw_code = raw_region.get("RegionCode")
        code = raw_code.casefold() if isinstance(raw_code, str) else ""
        raw_name = raw_region.get("RegionName")
        name = " ".join(raw_name.split()) if isinstance(raw_name, str) else ""
        if region_id <= 0 or not _DERP_CODE.fullmatch(code) or not 1 <= len(name) <= 80:
            continue
        regions[region_id] = {"id": region_id, "code": code, "name": name}
    return regions


def normalize_tailscale_payload(
    status_payload: Any,
    netcheck_payload: Any,
    derp_map: Any,
    checked_at: Optional[datetime] = None,
) -> Dict[str, Any]:
    checked = checked_at or utc_now()
    status = connection_status(status_payload)
    peer_counts = (
        classify_transport_counts(status_payload)
        if status == "online"
        else None
    )
    transport = classify_transport(status_payload) if status == "online" else "unknown"
    derp: Optional[Dict[str, Any]] = None

    if status == "online":
        if not isinstance(netcheck_payload, Mapping):
            raise TailscaleUnavailable("Tailscale netcheck data is unavailable")
        regions = _regions_by_id(derp_map)
        self_status = status_payload.get("Self")
        current_code = ""
        if isinstance(self_status, Mapping):
            raw_relay = self_status.get("Relay")
            if isinstance(raw_relay, str):
                current_code = raw_relay.casefold().strip()

        region = next(
            (item for item in regions.values() if item["code"] == current_code),
            None,
        )
        if region is None:
            preferred = finite_number(netcheck_payload.get("PreferredDERP"))
            if preferred is not None and preferred.is_integer():
                region = regions.get(int(preferred))
        if region is None:
            raise TailscaleUnavailable("Tailscale DERP region is unavailable")

        raw_latencies = netcheck_payload.get("RegionLatency")
        if not isinstance(raw_latencies, Mapping):
            raise TailscaleUnavailable("Tailscale DERP latency is unavailable")
        latency_ns = finite_number(raw_latencies.get(str(region["id"])))
        if latency_ns is None or latency_ns < 0:
            raise TailscaleUnavailable("Tailscale DERP latency is unavailable")
        derp = {
            **region,
            "latencyMs": round(latency_ns / 1_000_000, 1),
        }

    return {
        "schemaVersion": SCHEMA_VERSION,
        "source": "tailscale",
        "generatedAt": iso_utc(checked),
        "lastCheckedAt": iso_utc(checked),
        "refreshIntervalSeconds": REFRESH_INTERVAL_SECONDS,
        "staleAfterSeconds": STALE_AFTER_SECONDS,
        "status": "live",
        "connection": {
            "status": status,
            "transport": transport,
            "peerCounts": peer_counts,
        },
        "derp": derp,
    }


def _sanitize_derp(value: Any) -> Optional[Dict[str, Any]]:
    if not isinstance(value, Mapping):
        return None
    region_id = finite_number(value.get("id"))
    raw_code = value.get("code")
    code = raw_code.casefold() if isinstance(raw_code, str) else ""
    raw_name = value.get("name")
    name = " ".join(raw_name.split()) if isinstance(raw_name, str) else ""
    latency = finite_number(value.get("latencyMs"))
    if (
        region_id is None
        or not region_id.is_integer()
        or region_id <= 0
        or not _DERP_CODE.fullmatch(code)
        or not 1 <= len(name) <= 80
        or latency is None
        or not 0 <= latency <= 60_000
    ):
        return None
    return {
        "id": int(region_id),
        "code": code,
        "name": name,
        "latencyMs": round(latency, 1),
    }


def _sanitize_peer_counts(value: Any) -> Optional[Dict[str, int]]:
    if not isinstance(value, Mapping):
        return None
    counts: Dict[str, int] = {}
    for key in ("active", *_PEER_COUNT_MODES):
        raw_count = value.get(key)
        if isinstance(raw_count, bool) or not isinstance(raw_count, int) or raw_count < 0:
            return None
        counts[key] = raw_count
    if counts["active"] != sum(counts[mode] for mode in _PEER_COUNT_MODES):
        return None
    return counts


def sanitize_snapshot(value: Any) -> Optional[Dict[str, Any]]:
    if not isinstance(value, Mapping) or value.get("schemaVersion") != SCHEMA_VERSION:
        return None
    generated_at = parse_iso(value.get("generatedAt"))
    if generated_at is None:
        return None
    raw_status = value.get("status")
    snapshot_status = raw_status if raw_status in {"live", "stale", "unavailable"} else "unavailable"
    raw_connection = value.get("connection")
    connection = raw_connection if isinstance(raw_connection, Mapping) else {}
    raw_connection_status = connection.get("status")
    safe_connection_status = (
        raw_connection_status
        if raw_connection_status in _CONNECTION_STATUSES
        else "unavailable"
    )
    raw_transport = connection.get("transport")
    transport = raw_transport if raw_transport in _TRANSPORT_MODES else "unknown"
    return {
        "schemaVersion": SCHEMA_VERSION,
        "source": "tailscale",
        "generatedAt": iso_utc(generated_at),
        "lastCheckedAt": iso_utc(parse_iso(value.get("lastCheckedAt")) or generated_at),
        "refreshIntervalSeconds": REFRESH_INTERVAL_SECONDS,
        "staleAfterSeconds": STALE_AFTER_SECONDS,
        "status": snapshot_status,
        "connection": {
            "status": safe_connection_status,
            "transport": transport,
            "peerCounts": _sanitize_peer_counts(connection.get("peerCounts")),
        },
        "derp": _sanitize_derp(value.get("derp")),
    }


def load_snapshot(path: Path) -> Optional[Dict[str, Any]]:
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError):
        return None
    return sanitize_snapshot(raw)


def write_snapshot(path: Path, snapshot: Mapping[str, Any]) -> None:
    directory = path.parent
    directory.mkdir(parents=True, exist_ok=True, mode=0o700)
    os.chmod(directory, 0o700)
    descriptor, temporary_name = tempfile.mkstemp(
        prefix=".tailscale-status.", suffix=".tmp", dir=str(directory)
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


class TailscaleCollector:
    def __init__(
        self,
        binary: Optional[str] = None,
        runner: Callable[..., Any] = subprocess.run,
        timeout_seconds: int = COMMAND_TIMEOUT_SECONDS,
        now_provider: Callable[[], datetime] = utc_now,
    ) -> None:
        self.binary = binary or find_tailscale()
        self.runner = runner
        self.timeout_seconds = max(1, int(timeout_seconds))
        self.now_provider = now_provider

    def _run_json(self, arguments: Sequence[str]) -> Any:
        if not self.binary:
            raise TailscaleUnavailable("Tailscale CLI is unavailable")
        try:
            result = self.runner(
                [self.binary, *arguments],
                stdout=subprocess.PIPE,
                stderr=subprocess.DEVNULL,
                text=True,
                check=False,
                timeout=self.timeout_seconds,
            )
        except (OSError, subprocess.TimeoutExpired) as exc:
            raise TailscaleUnavailable("Tailscale invocation failed") from exc
        if result.returncode != 0:
            raise TailscaleUnavailable("Tailscale invocation failed")
        try:
            return json.loads(result.stdout)
        except (TypeError, json.JSONDecodeError) as exc:
            raise TailscaleUnavailable("Tailscale returned invalid JSON") from exc

    def collect(self, previous: Optional[Mapping[str, Any]] = None) -> Dict[str, Any]:
        checked_at = self.now_provider()
        try:
            status_payload = self._run_json(["status", "--json"])
            status = connection_status(status_payload)
            if status == "unavailable":
                raise TailscaleUnavailable("Tailscale status is unavailable")
            if status == "online":
                netcheck_payload = self._run_json(["netcheck", "--format=json"])
                derp_map = self._run_json(["debug", "derp-map"])
            else:
                netcheck_payload = {}
                derp_map = {}
            return normalize_tailscale_payload(
                status_payload,
                netcheck_payload,
                derp_map,
                checked_at=checked_at,
            )
        except TailscaleUnavailable:
            sanitized_previous = sanitize_snapshot(previous)
            if sanitized_previous:
                failed = copy.deepcopy(sanitized_previous)
                failed["status"] = "stale"
                failed["lastCheckedAt"] = iso_utc(checked_at)
                return failed
            return {
                "schemaVersion": SCHEMA_VERSION,
                "source": "tailscale",
                "generatedAt": iso_utc(checked_at),
                "lastCheckedAt": iso_utc(checked_at),
                "refreshIntervalSeconds": REFRESH_INTERVAL_SECONDS,
                "staleAfterSeconds": STALE_AFTER_SECONDS,
                "status": "unavailable",
                "connection": {
                    "status": "unavailable",
                    "transport": "unknown",
                    "peerCounts": None,
                },
                "derp": None,
            }

    def collect_to_path(self, path: Path) -> Dict[str, Any]:
        snapshot = self.collect(load_snapshot(path))
        write_snapshot(path, snapshot)
        return snapshot


class TailscaleSnapshotService:
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
            raise TailscaleSnapshotUnavailable("Tailscale snapshot is unavailable")
        generated_at = parse_iso(snapshot["generatedAt"])
        if generated_at is None:
            raise TailscaleSnapshotUnavailable("Tailscale snapshot is invalid")
        now = self.now_provider()
        if now.tzinfo is None:
            now = now.replace(tzinfo=timezone.utc)
        age = max(0.0, (now.astimezone(timezone.utc) - generated_at).total_seconds())
        stale = snapshot["status"] != "live" or age > STALE_AFTER_SECONDS
        return {
            "meta": {
                "source": "tailscale",
                "schemaVersion": SCHEMA_VERSION,
                "generatedAt": iso_utc(generated_at),
                "staleAfterSeconds": STALE_AFTER_SECONDS,
                "stale": stale,
            },
            "connection": dict(snapshot["connection"]),
            "derp": copy.deepcopy(snapshot["derp"]),
        }


def tailscale_service_from_environment() -> TailscaleSnapshotService:
    path = os.environ.get(
        "TAILSCALE_SNAPSHOT", "/provider-data/tailscale-status.json"
    )
    return TailscaleSnapshotService(path)
