import json
import os
import subprocess
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from http import HTTPStatus
from pathlib import Path

from app.tailscale_status import (
    TailscaleCollector,
    TailscaleSnapshotService,
    TailscaleSnapshotUnavailable,
    classify_transport,
    normalize_tailscale_payload,
    write_snapshot,
)


UTC = timezone.utc
FIXED_NOW = datetime(2026, 8, 13, 7, 0, 0, tzinfo=UTC)


class Result:
    def __init__(self, stdout="", returncode=0):
        self.stdout = stdout
        self.returncode = returncode


def status_payload(*, online=True, relay="sin", peers=None):
    return {
        "BackendState": "Running",
        "Self": {
            "Online": online,
            "Relay": relay,
            "HostName": "private-mac",
            "TailscaleIPs": ["100.64.0.1"],
            "PublicKey": "node-key-secret",
        },
        "Peer": peers or {},
        "User": {"1": {"LoginName": "private@example.com"}},
        "CurrentTailnet": {"Name": "private-tailnet"},
    }


def netcheck_payload(preferred=3, latency=92_200_000):
    return {
        "PreferredDERP": preferred,
        "RegionLatency": {str(preferred): latency},
        "IPv4": "203.0.113.10:1234",
        "GlobalV4": "203.0.113.10:1234",
    }


def derp_map():
    return {
        "Regions": {
            "3": {
                "RegionID": 3,
                "RegionCode": "sin",
                "RegionName": "Singapore",
                "Nodes": [{"HostName": "derp3.example.test", "IPv4": "203.0.113.3"}],
            }
        }
    }


class TransportClassificationTests(unittest.TestCase):
    def test_all_supported_transport_modes(self):
        direct = {"one": {"Active": True, "CurAddr": "192.0.2.1:1234"}}
        derp = {"one": {"Active": True, "Relay": "sin"}}
        peer_relay = {"one": {"Active": True, "PeerRelay": "peer-key"}}
        mixed = {
            "one": {"Active": True, "CurAddr": "192.0.2.1:1234"},
            "two": {"Active": True, "Relay": "sin"},
        }

        self.assertEqual(classify_transport(status_payload(peers=direct)), "direct")
        self.assertEqual(classify_transport(status_payload(peers=derp)), "derp")
        self.assertEqual(
            classify_transport(status_payload(peers=peer_relay)), "peer_relay"
        )
        self.assertEqual(classify_transport(status_payload(peers=mixed)), "mixed")
        self.assertEqual(classify_transport(status_payload(peers={})), "idle")
        self.assertEqual(
            classify_transport(
                status_payload(peers={"one": {"Active": True, "HostName": "private"}})
            ),
            "unknown",
        )


class TailscaleNormalizationTests(unittest.TestCase):
    def test_current_relay_and_latency_are_normalized_without_identity(self):
        payload = normalize_tailscale_payload(
            status_payload(peers={"private-peer": {"Active": True, "Relay": "sin"}}),
            netcheck_payload(),
            derp_map(),
            checked_at=FIXED_NOW,
        )

        self.assertEqual(payload["connection"], {"status": "online", "transport": "derp"})
        self.assertEqual(
            payload["derp"],
            {"id": 3, "code": "sin", "name": "Singapore", "latencyMs": 92.2},
        )
        serialized = json.dumps(payload)
        for secret in (
            "private-mac",
            "100.64.0.1",
            "node-key-secret",
            "private@example.com",
            "private-tailnet",
            "private-peer",
            "203.0.113.10",
            "derp3.example.test",
        ):
            self.assertNotIn(secret, serialized)

    def test_preferred_derp_is_used_when_current_relay_is_missing(self):
        payload = normalize_tailscale_payload(
            status_payload(relay=""),
            netcheck_payload(),
            derp_map(),
            checked_at=FIXED_NOW,
        )
        self.assertEqual(payload["derp"]["code"], "sin")
        self.assertEqual(payload["derp"]["latencyMs"], 92.2)

    def test_offline_status_does_not_reuse_old_derp(self):
        payload = normalize_tailscale_payload(
            status_payload(online=False), {}, {}, checked_at=FIXED_NOW
        )
        self.assertEqual(payload["connection"]["status"], "offline")
        self.assertEqual(payload["connection"]["transport"], "unknown")
        self.assertIsNone(payload["derp"])


class TailscaleCollectorTests(unittest.TestCase):
    def test_commands_are_isolated_and_stderr_is_discarded(self):
        calls = []

        def runner(command, **kwargs):
            calls.append((command, kwargs))
            if command[1:3] == ["status", "--json"]:
                return Result(json.dumps(status_payload()))
            if command[1:3] == ["netcheck", "--format=json"]:
                return Result(json.dumps(netcheck_payload()))
            if command[1:3] == ["debug", "derp-map"]:
                return Result(json.dumps(derp_map()))
            return Result(returncode=1)

        snapshot = TailscaleCollector(
            binary="/fake/tailscale", runner=runner, now_provider=lambda: FIXED_NOW
        ).collect()

        self.assertEqual(snapshot["status"], "live")
        self.assertEqual(len(calls), 3)
        self.assertTrue(all(call[1]["stderr"] is subprocess.DEVNULL for call in calls))

    def test_failure_preserves_previous_values_and_marks_stale(self):
        previous = normalize_tailscale_payload(
            status_payload(), netcheck_payload(), derp_map(), checked_at=FIXED_NOW
        )

        def runner(_command, **_kwargs):
            raise subprocess.TimeoutExpired(["tailscale"], 15)

        later = FIXED_NOW + timedelta(seconds=60)
        snapshot = TailscaleCollector(
            binary="/fake/tailscale", runner=runner, now_provider=lambda: later
        ).collect(previous)

        self.assertEqual(snapshot["status"], "stale")
        self.assertEqual(snapshot["generatedAt"], "2026-08-13T07:00:00Z")
        self.assertEqual(snapshot["lastCheckedAt"], "2026-08-13T07:01:00Z")
        self.assertEqual(snapshot["derp"]["latencyMs"], 92.2)

    def test_first_failure_produces_sanitized_unavailable_snapshot(self):
        def runner(_command, **_kwargs):
            return Result("private raw error", returncode=1)

        snapshot = TailscaleCollector(
            binary="/fake/tailscale", runner=runner, now_provider=lambda: FIXED_NOW
        ).collect()

        self.assertEqual(snapshot["status"], "unavailable")
        self.assertEqual(snapshot["connection"]["status"], "unavailable")
        self.assertNotIn("private raw error", json.dumps(snapshot))


class TailscaleSnapshotServiceTests(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.TemporaryDirectory()
        self.directory = Path(self.tempdir.name) / "provider-data"
        self.path = self.directory / "tailscale-status.json"

    def tearDown(self):
        self.tempdir.cleanup()

    def test_permissions_staleness_and_defense_in_depth(self):
        snapshot = normalize_tailscale_payload(
            status_payload(), netcheck_payload(), derp_map(), checked_at=FIXED_NOW
        )
        snapshot["privateIp"] = "100.64.0.1"
        snapshot["connection"]["peerName"] = "private-peer"
        snapshot["derp"]["nodeHost"] = "derp3.example.test"
        write_snapshot(self.path, snapshot)

        fresh = TailscaleSnapshotService(
            str(self.path), now_provider=lambda: FIXED_NOW + timedelta(seconds=900)
        ).get_status()
        stale = TailscaleSnapshotService(
            str(self.path), now_provider=lambda: FIXED_NOW + timedelta(seconds=901)
        ).get_status()

        self.assertFalse(fresh["meta"]["stale"])
        self.assertEqual(fresh["meta"]["staleAfterSeconds"], 900)
        self.assertTrue(stale["meta"]["stale"])
        serialized = json.dumps(stale)
        self.assertNotIn("100.64.0.1", serialized)
        self.assertNotIn("private-peer", serialized)
        self.assertNotIn("derp3.example.test", serialized)
        self.assertEqual(os.stat(self.directory).st_mode & 0o777, 0o700)
        self.assertEqual(os.stat(self.path).st_mode & 0o777, 0o600)

    def test_stale_collector_status_is_immediately_stale(self):
        snapshot = normalize_tailscale_payload(
            status_payload(), netcheck_payload(), derp_map(), checked_at=FIXED_NOW
        )
        snapshot["status"] = "stale"
        write_snapshot(self.path, snapshot)

        payload = TailscaleSnapshotService(
            str(self.path), now_provider=lambda: FIXED_NOW
        ).get_status()
        self.assertTrue(payload["meta"]["stale"])

    def test_missing_snapshot_is_unavailable(self):
        with self.assertRaises(TailscaleSnapshotUnavailable):
            TailscaleSnapshotService(str(self.path)).get_status()


class TailscaleEndpointTests(unittest.TestCase):
    def test_missing_tailscale_snapshot_does_not_change_dashboard_health(self):
        from app import server as server_module

        class HealthyDashboard:
            def health(self):
                return {
                    "status": "ok",
                    "database": "readable",
                    "queryOnly": True,
                    "schemaVersion": 16,
                }

        with tempfile.TemporaryDirectory() as tempdir:
            original_dashboard = server_module.SERVICE
            original_tailscale = server_module.TAILSCALE_SERVICE
            server_module.SERVICE = HealthyDashboard()
            server_module.TAILSCALE_SERVICE = TailscaleSnapshotService(
                str(Path(tempdir) / "missing.json")
            )

            def route(path):
                captured = {}
                handler = object.__new__(server_module.DashboardHandler)
                handler.path = path
                handler._write_json = lambda status, payload: captured.update(
                    status=status, payload=payload
                )
                handler._route()
                return captured

            try:
                tailscale = route("/api/v1/tailscale")
                health = route("/api/v1/health")
                self.assertEqual(tailscale["status"], HTTPStatus.SERVICE_UNAVAILABLE)
                self.assertEqual(health["status"], HTTPStatus.OK)
            finally:
                server_module.SERVICE = original_dashboard
                server_module.TAILSCALE_SERVICE = original_tailscale


if __name__ == "__main__":
    unittest.main()
