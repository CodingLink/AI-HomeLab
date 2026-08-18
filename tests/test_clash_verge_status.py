import json
import os
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from http import HTTPStatus
from pathlib import Path

from app.clash_verge_status import (
    ClashVergeCollector,
    ClashVergeSnapshotService,
    ClashVergeSnapshotUnavailable,
    ClashVergeUnavailable,
    normalize_proxy_payload,
    request_proxy_group,
    write_snapshot,
)


UTC = timezone.utc
FIXED_NOW = datetime(2026, 8, 13, 9, 0, 0, tzinfo=UTC)


def live_snapshot(name="Singapore Premium", generated_at="2026-08-13T09:00:00Z"):
    return {
        "schemaVersion": 1,
        "source": "clash-verge",
        "generatedAt": generated_at,
        "lastCheckedAt": generated_at,
        "refreshIntervalSeconds": 300,
        "staleAfterSeconds": 900,
        "status": "live",
        "proxy": {"status": "selected", "name": name},
    }


def chunked_response(payload):
    body = json.dumps(payload).encode("utf-8")
    midpoint = max(1, len(body) // 2)
    chunks = (body[:midpoint], body[midpoint:])
    encoded = b"".join(
        f"{len(chunk):X}\r\n".encode("ascii") + chunk + b"\r\n"
        for chunk in chunks
    )
    return (
        b"HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n"
        b"Transfer-Encoding: chunked\r\n\r\n"
        + encoded
        + b"0\r\n\r\n"
    )


class FakeSocket:
    def __init__(self, response):
        self.response = response
        self.offset = 0
        self.connected_to = None
        self.sent = b""

    def settimeout(self, _timeout):
        pass

    def connect(self, socket_path):
        self.connected_to = socket_path

    def sendall(self, data):
        self.sent += data

    def recv(self, size):
        if self.offset >= len(self.response):
            return b""
        chunk = self.response[self.offset : self.offset + size]
        self.offset += len(chunk)
        return chunk

    def close(self):
        pass


class ClashVergeUnixClientTests(unittest.TestCase):
    def test_chunked_proxy_response_uses_unix_socket_and_bearer_secret(self):
        response = chunked_response(
            {
                "type": "Selector",
                "now": "Singapore Premium",
                "all": ["private-node-one", "private-node-two"],
                "history": [{"delay": 12}],
            }
        )
        fake_socket = FakeSocket(response)

        payload = request_proxy_group(
            "/private/controller.sock",
            "private-secret",
            socket_factory=lambda: fake_socket,
        )

        self.assertEqual(fake_socket.connected_to, "/private/controller.sock")
        self.assertIn(b"GET /proxies/PROXY HTTP/1.1", fake_socket.sent)
        self.assertIn(b"Authorization: Bearer private-secret", fake_socket.sent)
        self.assertEqual(payload["now"], "Singapore Premium")


class ClashVergeNormalizationTests(unittest.TestCase):
    def test_only_selected_node_survives_normalization(self):
        payload = normalize_proxy_payload(
            {
                "type": "Selector",
                "now": "  Singapore\x00   Premium  ",
                "all": ["private-node-one"],
                "server": "203.0.113.10",
                "subscription": "private-subscription",
                "secret": "private-secret",
            },
            FIXED_NOW,
        )

        self.assertEqual(payload["proxy"], {"status": "selected", "name": "Singapore Premium"})
        serialized = json.dumps(payload)
        for private_value in (
            "private-node-one",
            "203.0.113.10",
            "private-subscription",
            "private-secret",
        ):
            self.assertNotIn(private_value, serialized)

    def test_invalid_selector_names_are_rejected(self):
        for payload in (
            {"type": "URLTest", "now": "Singapore"},
            {"type": "Selector"},
            {"type": "Selector", "now": "x" * 161},
            {"type": "Selector", "now": "\x00\n"},
        ):
            with self.subTest(payload=payload):
                with self.assertRaises(ClashVergeUnavailable):
                    normalize_proxy_payload(payload, FIXED_NOW)


class ClashVergeCollectorTests(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.TemporaryDirectory()
        self.directory = Path(self.tempdir.name)
        self.config_path = self.directory / "clash-verge.yaml"
        self.config_path.write_text(
            "external-controller: ''\n"
            "external-controller-unix: '/private/controller.sock'\n"
            "secret: private-secret\n",
            encoding="utf-8",
        )

    def tearDown(self):
        self.tempdir.cleanup()

    def test_collection_uses_config_in_memory_and_returns_sanitized_snapshot(self):
        calls = []

        def requester(socket_path, secret, group):
            calls.append((socket_path, secret, group))
            return {
                "type": "Selector",
                "now": "Singapore Premium",
                "all": ["private-node"],
                "server": "203.0.113.10",
            }

        snapshot = ClashVergeCollector(
            config_path=self.config_path,
            requester=requester,
            now_provider=lambda: FIXED_NOW,
        ).collect()

        self.assertEqual(calls, [("/private/controller.sock", "private-secret", "PROXY")])
        self.assertEqual(snapshot["status"], "live")
        self.assertEqual(snapshot["proxy"]["name"], "Singapore Premium")
        serialized = json.dumps(snapshot)
        for private_value in (
            "/private/controller.sock",
            "private-secret",
            "private-node",
            "203.0.113.10",
        ):
            self.assertNotIn(private_value, serialized)

    def test_failure_preserves_last_selection_and_first_failure_is_unavailable(self):
        def unavailable(*_args):
            raise ClashVergeUnavailable("raw private failure")

        collector = ClashVergeCollector(
            config_path=self.config_path,
            requester=unavailable,
            now_provider=lambda: FIXED_NOW + timedelta(minutes=5),
        )
        stale = collector.collect(live_snapshot())
        unavailable_snapshot = collector.collect()

        self.assertEqual(stale["status"], "stale")
        self.assertEqual(stale["generatedAt"], "2026-08-13T09:00:00Z")
        self.assertEqual(stale["proxy"]["name"], "Singapore Premium")
        self.assertNotIn("raw private failure", json.dumps(stale))
        self.assertEqual(unavailable_snapshot["status"], "unavailable")
        self.assertEqual(
            unavailable_snapshot["proxy"], {"status": "unavailable", "name": None}
        )


class ClashVergeSnapshotServiceTests(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.TemporaryDirectory()
        self.directory = Path(self.tempdir.name) / "provider-data"
        self.path = self.directory / "clash-verge-status.json"

    def tearDown(self):
        self.tempdir.cleanup()

    def test_permissions_staleness_and_api_whitelist(self):
        snapshot = live_snapshot()
        snapshot["socketPath"] = "/private/controller.sock"
        snapshot["secret"] = "private-secret"
        snapshot["proxy"]["all"] = ["private-node"]
        snapshot["proxy"]["server"] = "203.0.113.10"
        write_snapshot(self.path, snapshot)

        fresh = ClashVergeSnapshotService(
            str(self.path), now_provider=lambda: FIXED_NOW + timedelta(seconds=900)
        ).get_status()
        stale = ClashVergeSnapshotService(
            str(self.path), now_provider=lambda: FIXED_NOW + timedelta(seconds=901)
        ).get_status()

        self.assertFalse(fresh["meta"]["stale"])
        self.assertEqual(fresh["meta"]["staleAfterSeconds"], 900)
        self.assertTrue(stale["meta"]["stale"])
        self.assertEqual(
            set(stale), {"meta", "proxy"}
        )
        self.assertEqual(set(stale["proxy"]), {"status", "name"})
        serialized = json.dumps(stale)
        for private_value in (
            "/private/controller.sock",
            "private-secret",
            "private-node",
            "203.0.113.10",
        ):
            self.assertNotIn(private_value, serialized)
        self.assertEqual(os.stat(self.directory).st_mode & 0o777, 0o700)
        self.assertEqual(os.stat(self.path).st_mode & 0o777, 0o600)

    def test_missing_snapshot_is_unavailable(self):
        with self.assertRaises(ClashVergeSnapshotUnavailable):
            ClashVergeSnapshotService(str(self.path)).get_status()


class ClashVergeEndpointTests(unittest.TestCase):
    def test_missing_snapshot_does_not_change_dashboard_health(self):
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
            original_clash = server_module.CLASH_VERGE_SERVICE
            server_module.SERVICE = HealthyDashboard()
            server_module.CLASH_VERGE_SERVICE = ClashVergeSnapshotService(
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
                clash = route("/api/v1/clash-verge")
                health = route("/api/v1/health")
                self.assertEqual(clash["status"], HTTPStatus.SERVICE_UNAVAILABLE)
                self.assertEqual(
                    clash["payload"]["error"], "clash_verge_data_unavailable"
                )
                self.assertEqual(health["status"], HTTPStatus.OK)
            finally:
                server_module.SERVICE = original_dashboard
                server_module.CLASH_VERGE_SERVICE = original_clash


if __name__ == "__main__":
    unittest.main()
