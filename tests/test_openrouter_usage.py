import json
import os
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from http import HTTPStatus
from pathlib import Path

from app.openrouter_usage import (
    ACTIVITY_PATH,
    CREDITS_PATH,
    KEYCHAIN_SERVICE,
    MAX_RESPONSE_BYTES,
    OpenRouterClient,
    OpenRouterCollector,
    OpenRouterSnapshotService,
    OpenRouterSnapshotUnavailable,
    OpenRouterUnavailable,
    delete_keychain_key,
    keychain_has_key,
    normalize_activity,
    normalize_credits,
    read_management_key,
    set_keychain_key,
    write_snapshot,
)


UTC = timezone.utc
FIXED_NOW = datetime(2026, 8, 17, 4, 0, 0, tzinfo=UTC)
TEST_KEY = "test-management-key-" + ("x" * 24)


def credits_payload():
    return {
        "data": {
            "total_credits": 100.5,
            "total_usage": 25.75,
            "account_email": "private@example.com",
        },
        "api_key": TEST_KEY,
    }


def activity_payload():
    return {
        "data": [
            {
                "date": "2026-08-16",
                "model": "openai/gpt-4.1",
                "model_permaslug": "openai/gpt-4.1-private-version",
                "provider_name": "OpenAI",
                "requests": 3,
                "prompt_tokens": 50,
                "completion_tokens": 25,
                "reasoning_tokens": 5,
                "usage": 0.3,
                "endpoint_id": "private-endpoint",
                "api_key_hash": "private-key-hash",
                "workspace_id": "private-workspace",
                "user_id": "private-user",
            },
            {
                "date": "2026-08-15",
                "model": "openai/gpt-4.1",
                "provider_name": "Azure",
                "requests": 2,
                "prompt_tokens": 20,
                "completion_tokens": 10,
                "reasoning_tokens": 0,
                "usage": 0.2,
            },
            {
                "date": "2026-08-16",
                "model": "anthropic/claude-opus-4",
                "provider_name": "Anthropic",
                "requests": 1,
                "prompt_tokens": 10,
                "completion_tokens": 5,
                "reasoning_tokens": 1,
                "usage": 0.5,
            },
        ],
        "secret": TEST_KEY,
    }


class Result:
    def __init__(self, returncode=0, stdout=""):
        self.returncode = returncode
        self.stdout = stdout


class KeychainTests(unittest.TestCase):
    def test_set_status_delete_never_pass_a_secret_in_arguments(self):
        calls = []

        def runner(command, **kwargs):
            calls.append((command, kwargs))
            return Result()

        self.assertTrue(set_keychain_key(runner=runner, account="tester"))
        self.assertTrue(keychain_has_key(runner=runner, account="tester"))
        self.assertTrue(delete_keychain_key(runner=runner, account="tester"))

        set_command = calls[0][0]
        self.assertEqual(set_command[-1], "-w")
        self.assertIn(KEYCHAIN_SERVICE, set_command)
        self.assertNotIn(TEST_KEY, json.dumps(calls))
        self.assertNotIn("stdout", calls[0][1])

    def test_collector_reads_key_only_from_captured_stdout(self):
        calls = []

        def runner(command, **kwargs):
            calls.append((command, kwargs))
            return Result(stdout=f"{TEST_KEY}\n")

        self.assertEqual(read_management_key(runner=runner, account="tester"), TEST_KEY)
        self.assertNotIn(TEST_KEY, calls[0][0])
        self.assertEqual(calls[0][1]["stderr"], __import__("subprocess").DEVNULL)


class FakeResponse:
    def __init__(self, payload=None, status=200, body=None):
        self.status = status
        self.body = body if body is not None else json.dumps(payload).encode("utf-8")

    def read(self, _limit):
        return self.body


class FakeConnection:
    def __init__(self, response):
        self.response = response
        self.request_call = None
        self.closed = False

    def request(self, method, path, headers):
        self.request_call = (method, path, headers)

    def getresponse(self):
        return self.response

    def close(self):
        self.closed = True


class OpenRouterClientTests(unittest.TestCase):
    def test_fixed_https_get_uses_bearer_and_does_not_follow_redirects(self):
        connection = FakeConnection(FakeResponse(credits_payload()))
        factory_calls = []

        def factory(host, port, timeout):
            factory_calls.append((host, port, timeout))
            return connection

        payload = OpenRouterClient(connection_factory=factory).get_json(
            CREDITS_PATH, TEST_KEY
        )
        self.assertEqual(payload["data"]["total_credits"], 100.5)
        self.assertEqual(factory_calls, [("openrouter.ai", 443, 15)])
        self.assertEqual(connection.request_call[0:2], ("GET", CREDITS_PATH))
        self.assertEqual(
            connection.request_call[2]["Authorization"], f"Bearer {TEST_KEY}"
        )
        self.assertTrue(connection.closed)

        redirect = FakeConnection(FakeResponse({}, status=302))
        with self.assertRaises(OpenRouterUnavailable):
            OpenRouterClient(
                connection_factory=lambda *_args, **_kwargs: redirect
            ).get_json(ACTIVITY_PATH, TEST_KEY)
        with self.assertRaises(OpenRouterUnavailable):
            OpenRouterClient(connection_factory=factory).get_json(
                "/api/v1/keys", TEST_KEY
            )

    def test_http_errors_invalid_json_timeout_and_oversized_body_are_rejected(self):
        for status in (401, 403, 429):
            connection = FakeConnection(FakeResponse({}, status=status))
            with self.subTest(status=status), self.assertRaises(OpenRouterUnavailable):
                OpenRouterClient(
                    connection_factory=lambda *_args, **_kwargs: connection
                ).get_json(CREDITS_PATH, TEST_KEY)

        invalid_json = FakeConnection(FakeResponse(body=b"not json"))
        with self.assertRaises(OpenRouterUnavailable):
            OpenRouterClient(
                connection_factory=lambda *_args, **_kwargs: invalid_json
            ).get_json(CREDITS_PATH, TEST_KEY)

        oversized = FakeConnection(FakeResponse(body=b"x" * (MAX_RESPONSE_BYTES + 1)))
        with self.assertRaises(OpenRouterUnavailable):
            OpenRouterClient(
                connection_factory=lambda *_args, **_kwargs: oversized
            ).get_json(CREDITS_PATH, TEST_KEY)

        class TimeoutConnection(FakeConnection):
            def getresponse(self):
                raise TimeoutError

        timed_out = TimeoutConnection(FakeResponse({}))
        with self.assertRaises(OpenRouterUnavailable):
            OpenRouterClient(
                connection_factory=lambda *_args, **_kwargs: timed_out
            ).get_json(CREDITS_PATH, TEST_KEY)


class NormalizationTests(unittest.TestCase):
    def test_credits_are_calculated_without_identity_fields(self):
        credits = normalize_credits(credits_payload(), FIXED_NOW)
        self.assertEqual(credits["remaining"], 74.75)
        serialized = json.dumps(credits)
        self.assertNotIn("private@example.com", serialized)
        self.assertNotIn(TEST_KEY, serialized)

    def test_activity_aggregates_models_and_discards_identifiers(self):
        activity = normalize_activity(activity_payload(), FIXED_NOW)
        self.assertEqual(activity["summary"]["requests"], 6)
        self.assertEqual(activity["summary"]["usageCredits"], 1.0)
        self.assertEqual(activity["summary"]["modelCount"], 2)
        self.assertEqual(activity["models"][0]["id"], "openai/gpt-4.1")
        openai = activity["models"][0]
        self.assertEqual(openai["providers"], ["Azure", "OpenAI"])
        self.assertEqual(openai["requests"], 5)
        self.assertEqual(openai["promptTokens"], 70)
        serialized = json.dumps(activity)
        for private_value in (
            "private-endpoint",
            "private-key-hash",
            "private-workspace",
            "private-user",
            "private-version",
            TEST_KEY,
        ):
            self.assertNotIn(private_value, serialized)

    def test_zero_usage_and_invalid_rows_are_safe(self):
        payload = {
            "data": [
                {
                    "date": "2026-08-16",
                    "model": "openai/gpt-4.1",
                    "provider_name": "OpenAI\u0000private",
                    "requests": 0,
                    "prompt_tokens": 0,
                    "completion_tokens": 0,
                    "reasoning_tokens": 0,
                    "usage": 0,
                },
                {
                    "date": "2026-08-16",
                    "model": "invalid model",
                    "provider_name": "private",
                    "requests": -1,
                    "prompt_tokens": 0,
                    "completion_tokens": 0,
                    "reasoning_tokens": 0,
                    "usage": -1,
                },
            ]
        }
        activity = normalize_activity(payload, FIXED_NOW)
        self.assertEqual(activity["summary"]["usageCredits"], 0.0)
        self.assertEqual(activity["models"][0]["sharePercent"], 0.0)
        self.assertEqual(activity["models"][0]["providers"], ["OpenAIprivate"])
        self.assertEqual(activity["summary"]["modelCount"], 1)


class FakeClient:
    def __init__(self, failures=()):
        self.failures = set(failures)
        self.calls = []

    def get_json(self, path, key):
        self.calls.append((path, key))
        if path in self.failures:
            raise OpenRouterUnavailable("raw private failure")
        return credits_payload() if path == CREDITS_PATH else activity_payload()


class CollectorAndServiceTests(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.TemporaryDirectory()
        self.directory = Path(self.tempdir.name) / "provider-data"
        self.path = self.directory / "openrouter-usage.json"

    def tearDown(self):
        self.tempdir.cleanup()

    def test_partial_failure_preserves_last_activity_and_isolates_credits(self):
        live = OpenRouterCollector(
            key_reader=lambda: TEST_KEY,
            client=FakeClient(),
            now_provider=lambda: FIXED_NOW,
        ).collect()
        partial = OpenRouterCollector(
            key_reader=lambda: TEST_KEY,
            client=FakeClient(failures={ACTIVITY_PATH}),
            now_provider=lambda: FIXED_NOW + timedelta(minutes=5),
        ).collect(live)

        self.assertEqual(partial["credits"]["status"], "live")
        self.assertEqual(partial["activity"]["status"], "stale")
        self.assertEqual(
            partial["activity"]["lastSuccessAt"], live["activity"]["lastSuccessAt"]
        )
        self.assertNotIn("raw private failure", json.dumps(partial))

    def test_permissions_staleness_and_api_whitelist(self):
        snapshot = OpenRouterCollector(
            key_reader=lambda: TEST_KEY,
            client=FakeClient(),
            now_provider=lambda: FIXED_NOW,
        ).collect()
        snapshot["managementKey"] = TEST_KEY
        snapshot["activity"]["endpointId"] = "private-endpoint"
        write_snapshot(self.path, snapshot)

        fresh = OpenRouterSnapshotService(
            str(self.path), now_provider=lambda: FIXED_NOW + timedelta(seconds=900)
        ).get_usage()
        stale = OpenRouterSnapshotService(
            str(self.path), now_provider=lambda: FIXED_NOW + timedelta(seconds=901)
        ).get_usage()

        self.assertFalse(fresh["meta"]["stale"])
        self.assertTrue(stale["meta"]["stale"])
        self.assertEqual(set(stale), {"meta", "credits", "activity"})
        self.assertNotIn("lastCheckedAt", stale["credits"])
        serialized = json.dumps(stale)
        self.assertNotIn(TEST_KEY, serialized)
        self.assertNotIn("private-endpoint", serialized)
        self.assertEqual(os.stat(self.directory).st_mode & 0o777, 0o700)
        self.assertEqual(os.stat(self.path).st_mode & 0o777, 0o600)

    def test_missing_key_or_snapshot_is_unavailable(self):
        def missing_key():
            raise OpenRouterUnavailable("missing")

        snapshot = OpenRouterCollector(
            key_reader=missing_key, now_provider=lambda: FIXED_NOW
        ).collect()
        write_snapshot(self.path, snapshot)
        with self.assertRaises(OpenRouterSnapshotUnavailable):
            OpenRouterSnapshotService(str(self.path)).get_usage()


class OpenRouterEndpointTests(unittest.TestCase):
    def test_missing_snapshot_does_not_change_dashboard_health(self):
        from app import server as server_module

        class HealthyDashboard:
            def health(self):
                return {"status": "ok", "database": "readable", "queryOnly": True}

        with tempfile.TemporaryDirectory() as tempdir:
            original_dashboard = server_module.SERVICE
            original_openrouter = server_module.OPENROUTER_SERVICE
            server_module.SERVICE = HealthyDashboard()
            server_module.OPENROUTER_SERVICE = OpenRouterSnapshotService(
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
                usage = route("/api/v1/openrouter")
                health = route("/api/v1/health")
                self.assertEqual(usage["status"], HTTPStatus.SERVICE_UNAVAILABLE)
                self.assertEqual(
                    usage["payload"]["error"], "openrouter_data_unavailable"
                )
                self.assertEqual(health["status"], HTTPStatus.OK)
            finally:
                server_module.SERVICE = original_dashboard
                server_module.OPENROUTER_SERVICE = original_openrouter


if __name__ == "__main__":
    unittest.main()
