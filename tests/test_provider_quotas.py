import json
import os
import subprocess
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from http import HTTPStatus
from pathlib import Path

from app.provider_quotas import (
    CodexBarCollector,
    ProviderSnapshotService,
    ProviderSnapshotUnavailable,
    normalize_provider_payload,
    write_snapshot,
)


UTC = timezone.utc
FIXED_NOW = datetime(2026, 8, 13, 3, 10, 0, tzinfo=UTC)


class Result:
    def __init__(self, stdout="", returncode=0):
        self.stdout = stdout
        self.returncode = returncode


def snapshot(provider, generated_at="2026-08-13T03:10:00Z"):
    return {
        "schemaVersion": 1,
        "source": "codexbar",
        "generatedAt": generated_at,
        "refreshIntervalSeconds": 300,
        "staleAfterSeconds": 900,
        "providers": [provider],
    }


class ProviderNormalizationTests(unittest.TestCase):
    def test_kimi_plan_windows_are_converted_to_remaining_percent(self):
        raw = [
            {
                "provider": "kimi",
                "source": "Kimi Code API key",
                "usage": {
                    "primary": {
                        "usedPercent": 0,
                        "windowMinutes": 10080,
                        "resetsAt": "2026-08-20T03:10:00Z",
                        "resetDescription": "0/100 requests",
                    },
                    "secondary": {
                        "usedPercent": 65.5,
                        "windowMinutes": 300,
                        "resetsAt": "2026-08-13T06:10:00Z",
                        "resetDescription": "Rate: 65/100 per 5 hours",
                    },
                    "extraRateWindows": [
                        {
                            "id": "kimi-monthly",
                            "title": "Total usage",
                            "window": {
                                "usedPercent": 29.44,
                                "windowMinutes": 43200,
                                "resetsAt": "2026-09-10T00:00:00Z",
                            },
                        }
                    ],
                    "identity": {"email": "private@example.com"},
                },
                "account": {"label": "private account"},
            }
        ]

        provider = normalize_provider_payload("kimi", raw, FIXED_NOW)

        self.assertEqual(provider["name"], "Kimi Code")
        self.assertEqual(
            [limit["remainingPercent"] for limit in provider["limits"]],
            [100.0, 34.5, 70.6],
        )
        self.assertEqual(
            [limit["windowMinutes"] for limit in provider["limits"]],
            [10080, 300, 43200],
        )
        self.assertNotIn("identity", provider)
        self.assertNotIn("account", provider)

    def test_openrouter_credit_details_are_mapped_without_identity_or_key_data(self):
        raw = [
            {
                "provider": "openrouter",
                "usage": {
                    "details": [
                        {
                            "title": "Credits",
                            "rows": [
                                {"label": "Remaining", "value": "$6.86"},
                                {"label": "Used", "value": "$3.14"},
                                {"label": "Total added", "value": "$10.00"},
                            ],
                        },
                        {
                            "title": "API key",
                            "rows": [
                                {"label": "API key budget", "value": "secret-budget"},
                                {"label": "Rate limit", "value": "10 requests / second"},
                            ],
                        },
                    ],
                    "identity": {"accountEmail": "private@example.com"},
                    "accountEmail": "private@example.com",
                    "loginMethod": "Balance: $6.86",
                },
                "account": {"apiKey": "sk-secret"},
            }
        ]

        provider = normalize_provider_payload("openrouter", raw, FIXED_NOW)

        self.assertEqual(provider["balance"]["amount"], 6.86)
        self.assertEqual(provider["balance"]["currency"], "USD")
        self.assertEqual(
            provider["balance"]["detail"],
            "Used $3.14 · Total added $10.00",
        )
        self.assertEqual(provider["limits"], [])
        serialized = json.dumps(provider)
        self.assertNotIn("private@example.com", serialized)
        self.assertNotIn("secret-budget", serialized)
        self.assertNotIn("sk-secret", serialized)

    def test_missing_optional_provider_fields_remain_hidden(self):
        provider = normalize_provider_payload(
            "openrouter",
            [{"provider": "openrouter", "usage": {"details": []}}],
            FIXED_NOW,
        )

        self.assertIsNone(provider["balance"])
        self.assertEqual(provider["limits"], [])
        self.assertNotIn("resetCredits", provider)

    def test_codex_reset_credits_keep_only_available_expiries(self):
        raw = [
            {
                "provider": "codex",
                "usage": {
                    "codexResetCredits": {
                        "availableCount": 4,
                        "credits": [
                            {
                                "id": "private-credit-id",
                                "status": "available",
                                "expires_at": None,
                                "title": "Full reset",
                                "description": "private description",
                            },
                            {
                                "status": "redeemed",
                                "expires_at": "2026-08-15T12:00:00Z",
                            },
                            {
                                "status": "available",
                                "expiresAt": "2026-09-01T12:00:00+00:00",
                            },
                            {
                                "status": "expired",
                                "expires_at": "2026-08-14T12:00:00Z",
                            },
                            {
                                "status": "available",
                                "expires_at": "2026-08-20T12:00:00Z",
                            },
                            {"status": "available", "expires_at": "not-a-date"},
                        ],
                    }
                },
            }
        ]

        provider = normalize_provider_payload("codex", raw, FIXED_NOW)

        self.assertEqual(provider["resetCredits"]["availableCount"], 4)
        self.assertEqual(
            provider["resetCredits"]["items"],
            [
                {"expiresAt": "2026-08-20T12:00:00Z"},
                {"expiresAt": "2026-09-01T12:00:00Z"},
                {"expiresAt": None},
            ],
        )
        serialized = json.dumps(provider)
        self.assertNotIn("private-credit-id", serialized)
        self.assertNotIn("private description", serialized)
        self.assertNotIn("Full reset", serialized)

    def test_codex_zero_reset_credits_remain_visible(self):
        provider = normalize_provider_payload(
            "codex",
            [
                {
                    "provider": "codex",
                    "usage": {
                        "codexResetCredits": {
                            "availableCount": 0,
                            "credits": [],
                        }
                    },
                }
            ],
            FIXED_NOW,
        )

        self.assertEqual(
            provider["resetCredits"], {"availableCount": 0, "items": []}
        )

    def test_deepseek_balance_and_paid_granted_split(self):
        raw = [
            {
                "provider": "deepseek",
                "usage": {
                    "primary": {
                        "usedPercent": 0,
                        "resetDescription": "¥2.07 (Paid: ¥2.07 / Granted: ¥0.00)",
                    },
                    "secondary": None,
                    "tertiary": None,
                    "accountEmail": "private@example.com",
                },
                "account": {"apiKey": "sk-secret"},
            }
        ]

        provider = normalize_provider_payload("deepseek", raw, FIXED_NOW)

        self.assertEqual(provider["balance"]["text"], "¥2.07")
        self.assertEqual(provider["balance"]["amount"], 2.07)
        self.assertEqual(provider["balance"]["currency"], "CNY")
        self.assertEqual(
            provider["balance"]["detail"], "Paid ¥2.07 · Granted ¥0.00"
        )
        self.assertEqual(provider["limits"], [])
        serialized = json.dumps(provider)
        self.assertNotIn("private@example.com", serialized)
        self.assertNotIn("sk-secret", serialized)

    def test_codex_zero_credits_and_weekly_limit_are_both_retained(self):
        raw = [
            {
                "provider": "codex",
                "source": "oauth",
                "usage": {
                    "primary": None,
                    "secondary": {
                        "usedPercent": 18,
                        "windowMinutes": 10080,
                        "resetsAt": "2026-08-20T02:36:47Z",
                    },
                },
                "credits": {"remaining": 0},
            }
        ]

        provider = normalize_provider_payload("codex", raw, FIXED_NOW)

        self.assertEqual(provider["balance"]["amount"], 0)
        self.assertEqual(provider["balance"]["text"], "0 credits")
        self.assertEqual(provider["limits"][0]["remainingPercent"], 82.0)

    def test_zero_and_negative_currency_balances_are_not_hidden_or_clamped(self):
        zero = normalize_provider_payload(
            "deepseek",
            [{"provider": "deepseek", "usage": {"primary": {"usedPercent": 0, "resetDescription": "¥0.00 (Paid: ¥0.00 / Granted: ¥0.00)"}}}],
            FIXED_NOW,
        )
        negative = normalize_provider_payload(
            "deepseek",
            [{"provider": "deepseek", "usage": {"primary": {"usedPercent": 0, "resetDescription": "¥-1.25 (Paid: ¥-1.25 / Granted: ¥0.00)"}}}],
            FIXED_NOW,
        )

        self.assertEqual(zero["balance"]["amount"], 0)
        self.assertEqual(negative["balance"]["amount"], -1.25)


class CollectorFailureTests(unittest.TestCase):
    def test_provider_failures_are_isolated_and_codex_falls_back_to_oauth(self):
        calls = []

        def runner(command, **_kwargs):
            calls.append(command)
            if command[1:3] == ["config", "providers"]:
                return Result(
                    json.dumps(
                        [
                            {"provider": "codex", "enabled": True},
                            {"provider": "kimi", "enabled": True},
                            {"provider": "deepseek", "enabled": True},
                        ]
                    )
                )
            provider = command[command.index("--provider") + 1]
            if provider == "codex" and "--source" not in command:
                return Result(json.dumps([{"provider": "codex", "error": "unavailable"}]))
            if provider == "codex":
                return Result(
                    json.dumps(
                        [
                            {
                                "provider": "codex",
                                "usage": {"primary": None, "secondary": None},
                                "credits": {"remaining": 0},
                            }
                        ]
                    )
                )
            if provider == "kimi":
                raise subprocess.TimeoutExpired(command, 15)
            return Result("not-json")

        previous_kimi = {
            "id": "kimi",
            "name": "Kimi Code",
            "status": "live",
            "lastSuccessAt": "2026-08-13T03:00:00Z",
            "balance": None,
            "limits": [{"id": "primary", "remainingPercent": 55.0}],
        }
        collector = CodexBarCollector(
            binary="/fake/codexbar", runner=runner, now_provider=lambda: FIXED_NOW
        )

        collected = collector.collect({"providers": [previous_kimi]})

        by_id = {provider["id"]: provider for provider in collected["providers"]}
        self.assertEqual(list(by_id), ["codex", "kimi", "deepseek"])
        self.assertEqual(by_id["codex"]["status"], "live")
        self.assertEqual(by_id["codex"]["balance"]["amount"], 0)
        self.assertEqual(by_id["kimi"]["status"], "stale")
        self.assertEqual(by_id["kimi"]["limits"][0]["remainingPercent"], 55.0)
        self.assertEqual(by_id["deepseek"]["status"], "unavailable")
        self.assertTrue(
            any("--source" in command and "oauth" in command for command in calls)
        )

    def test_config_failure_preserves_previous_values_as_stale(self):
        def runner(_command, **_kwargs):
            return Result(returncode=1)

        previous = snapshot(
            {
                "id": "deepseek",
                "name": "DeepSeek",
                "status": "live",
                "lastSuccessAt": "2026-08-13T03:00:00Z",
                "balance": {"text": "¥2.07", "amount": 2.07, "currency": "CNY"},
                "limits": [],
            }
        )
        collected = CodexBarCollector(
            binary="/fake/codexbar", runner=runner, now_provider=lambda: FIXED_NOW
        ).collect(previous)

        self.assertEqual(collected["providers"][0]["status"], "stale")
        self.assertEqual(collected["providers"][0]["balance"]["amount"], 2.07)

    def test_codex_failure_preserves_previous_reset_credits(self):
        def runner(command, **_kwargs):
            if command[1:3] == ["config", "providers"]:
                return Result(json.dumps([{"provider": "codex", "enabled": True}]))
            return Result(returncode=1)

        previous = snapshot(
            {
                "id": "codex",
                "name": "Codex",
                "status": "live",
                "lastSuccessAt": "2026-08-13T03:00:00Z",
                "balance": None,
                "limits": [],
                "resetCredits": {
                    "availableCount": 1,
                    "items": [{"expiresAt": "2026-09-01T12:00:00Z"}],
                },
            }
        )

        collected = CodexBarCollector(
            binary="/fake/codexbar", runner=runner, now_provider=lambda: FIXED_NOW
        ).collect(previous)

        provider = collected["providers"][0]
        self.assertEqual(provider["status"], "stale")
        self.assertEqual(provider["resetCredits"]["availableCount"], 1)


class ProviderSnapshotServiceTests(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.TemporaryDirectory()
        self.directory = Path(self.tempdir.name) / "provider-data"
        self.path = self.directory / "codexbar-providers.json"

    def tearDown(self):
        self.tempdir.cleanup()

    def test_snapshot_permissions_staleness_and_defense_in_depth_privacy(self):
        provider = {
            "id": "deepseek",
            "name": "private@example.com",
            "status": "live",
            "lastSuccessAt": "2026-08-13T03:10:00Z",
            "balance": {
                "text": "¥2.07",
                "amount": 2.07,
                "currency": "CNY",
                "detail": "private@example.com",
                "cookie": "secret-cookie",
            },
            "limits": [],
            "identity": {"email": "private@example.com"},
            "oauth": "secret-oauth",
        }
        write_snapshot(self.path, snapshot(provider, "2026-08-13T02:54:59Z"))
        service = ProviderSnapshotService(
            str(self.path), now_provider=lambda: FIXED_NOW
        )

        payload = service.get_providers()

        self.assertTrue(payload["meta"]["stale"])
        self.assertEqual(payload["providers"][0]["status"], "stale")
        self.assertEqual(payload["providers"][0]["name"], "DeepSeek")
        serialized = json.dumps(payload)
        self.assertNotIn("private@example.com", serialized)
        self.assertNotIn("secret-cookie", serialized)
        self.assertNotIn("secret-oauth", serialized)
        self.assertEqual(os.stat(self.directory).st_mode & 0o777, 0o700)
        self.assertEqual(os.stat(self.path).st_mode & 0o777, 0o600)

    def test_snapshot_is_fresh_at_900_seconds_and_stale_after_it(self):
        provider = {
            "id": "codex",
            "status": "live",
            "lastSuccessAt": "2026-08-13T02:55:00Z",
            "balance": {"text": "0 credits", "amount": 0, "unit": "credits"},
            "limits": [],
        }
        write_snapshot(self.path, snapshot(provider, "2026-08-13T02:55:00Z"))
        fresh = ProviderSnapshotService(
            str(self.path), now_provider=lambda: FIXED_NOW
        ).get_providers()
        stale = ProviderSnapshotService(
            str(self.path), now_provider=lambda: FIXED_NOW + timedelta(seconds=1)
        ).get_providers()

        self.assertFalse(fresh["meta"]["stale"])
        self.assertEqual(fresh["meta"]["staleAfterSeconds"], 900)
        self.assertTrue(stale["meta"]["stale"])

    def test_snapshot_reset_credits_are_strictly_sanitized(self):
        provider = {
            "id": "codex",
            "status": "live",
            "lastSuccessAt": "2026-08-13T03:10:00Z",
            "balance": None,
            "limits": [],
            "resetCredits": {
                "availableCount": 2,
                "items": [
                    {
                        "expiresAt": "2026-09-01T12:00:00Z",
                        "id": "private-credit-id",
                        "description": "private description",
                    },
                    {"expiresAt": None, "account": "private@example.com"},
                    {"expiresAt": "invalid", "oauth": "secret-oauth"},
                    {"id": "missing-expiry-field"},
                ],
                "cookie": "secret-cookie",
            },
        }
        write_snapshot(self.path, snapshot(provider))

        payload = ProviderSnapshotService(
            str(self.path), now_provider=lambda: FIXED_NOW
        ).get_providers()

        self.assertEqual(
            payload["providers"][0]["resetCredits"],
            {
                "availableCount": 2,
                "items": [
                    {"expiresAt": "2026-09-01T12:00:00Z"},
                    {"expiresAt": None},
                ],
            },
        )
        serialized = json.dumps(payload)
        self.assertNotIn("private-credit-id", serialized)
        self.assertNotIn("private description", serialized)
        self.assertNotIn("private@example.com", serialized)
        self.assertNotIn("secret-cookie", serialized)
        self.assertNotIn("secret-oauth", serialized)

    def test_missing_and_invalid_snapshots_are_unavailable(self):
        service = ProviderSnapshotService(str(self.path), now_provider=lambda: FIXED_NOW)
        with self.assertRaises(ProviderSnapshotUnavailable):
            service.get_providers()

        self.directory.mkdir(parents=True)
        self.path.write_text("not-json", encoding="utf-8")
        with self.assertRaises(ProviderSnapshotUnavailable):
            service.get_providers()


class ProviderEndpointTests(unittest.TestCase):
    def test_missing_provider_snapshot_does_not_change_dashboard_health(self):
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
            original_dashboard_service = server_module.SERVICE
            original_provider_service = server_module.PROVIDER_SERVICE
            server_module.SERVICE = HealthyDashboard()
            server_module.PROVIDER_SERVICE = ProviderSnapshotService(
                str(Path(tempdir) / "missing.json"),
                now_provider=lambda: FIXED_NOW,
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
                providers = route("/api/v1/providers")
                health = route("/api/v1/health")
                self.assertEqual(providers["status"], HTTPStatus.SERVICE_UNAVAILABLE)
                self.assertEqual(health["status"], HTTPStatus.OK)
                self.assertEqual(health["payload"]["status"], "ok")
            finally:
                server_module.SERVICE = original_dashboard_service
                server_module.PROVIDER_SERVICE = original_provider_service


if __name__ == "__main__":
    unittest.main()
