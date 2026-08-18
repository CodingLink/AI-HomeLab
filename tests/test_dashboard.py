import os
import sqlite3
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

from app.dashboard import (
    DashboardRepository,
    DashboardService,
    SchemaIncompatible,
)


SGT = timezone(timedelta(hours=8))
FIXED_NOW = datetime(2026, 8, 12, 12, 0, 0, tzinfo=SGT)


def epoch(year, month, day, hour=0):
    return int(datetime(year, month, day, hour, tzinfo=SGT).timestamp())


class DashboardRepositoryTests(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.TemporaryDirectory()
        self.database_path = Path(self.tempdir.name) / "cc-switch.db"
        connection = sqlite3.connect(str(self.database_path))
        connection.executescript(
            """
            PRAGMA user_version = 16;
            CREATE TABLE proxy_request_logs (
                request_id TEXT PRIMARY KEY,
                provider_id TEXT NOT NULL,
                app_type TEXT NOT NULL,
                model TEXT NOT NULL,
                input_tokens INTEGER NOT NULL DEFAULT 0,
                output_tokens INTEGER NOT NULL DEFAULT 0,
                cache_read_tokens INTEGER NOT NULL DEFAULT 0,
                cache_creation_tokens INTEGER NOT NULL DEFAULT 0,
                total_cost_usd TEXT NOT NULL DEFAULT '0',
                status_code INTEGER NOT NULL,
                first_token_ms INTEGER,
                duration_ms INTEGER,
                latency_ms INTEGER NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL
            );
            CREATE TABLE proxy_config (
                app_type TEXT PRIMARY KEY,
                proxy_enabled INTEGER NOT NULL DEFAULT 0,
                enabled INTEGER NOT NULL DEFAULT 0,
                listen_address TEXT,
                listen_port INTEGER
            );
            INSERT INTO proxy_config VALUES ('codex', 1, 0, '127.0.0.1', 15721);
            INSERT INTO proxy_config VALUES ('claude', 1, 1, '127.0.0.1', 15721);
            CREATE TABLE model_pricing (
                model_id TEXT PRIMARY KEY,
                display_name TEXT NOT NULL
            );
            INSERT INTO model_pricing VALUES ('gpt-5', 'GPT-5');
            INSERT INTO model_pricing VALUES ('opus', 'Claude Opus');
            """
        )
        rows = [
            ("today-codex", "private-provider", "codex", "gpt-5", 100, 20, 30, 0, "0.01", 200, 400, 2400, 2400, epoch(2026, 8, 12, 10)),
            ("today-claude", "private-provider", "claude", "opus", 50, 10, 0, 5, "0.02", 500, 300, 2300, 2300, epoch(2026, 8, 12, 11)),
            ("week-codex", "private-provider", "codex", "gpt-5", 200, 30, 20, 0, "0.03", 200, None, None, 0, epoch(2026, 8, 6, 9)),
            ("month-claude", "private-provider", "claude", "sonnet", 80, 15, 5, 0, "0.04", 200, None, None, 0, epoch(2026, 7, 14, 9)),
            ("outside", "private-provider", "codex", "legacy", 999, 999, 999, 999, "9.99", 200, None, None, 0, epoch(2026, 7, 13, 23)),
        ]
        connection.executemany(
            """
            INSERT INTO proxy_request_logs (
                request_id, provider_id, app_type, model, input_tokens,
                output_tokens, cache_read_tokens, cache_creation_tokens,
                total_cost_usd, status_code, first_token_ms, duration_ms,
                latency_ms, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            rows,
        )
        connection.commit()
        connection.close()

        self.repository = DashboardRepository(
            str(self.database_path), now_provider=lambda: FIXED_NOW
        )

    def tearDown(self):
        self.tempdir.cleanup()

    def test_today_aggregation_and_privacy(self):
        payload = self.repository.fetch_dashboard("today", "all")
        summary = payload["summary"]

        self.assertEqual(summary["requests"], 2)
        self.assertEqual(summary["successfulRequests"], 1)
        self.assertEqual(summary["successRate"], 50.0)
        self.assertEqual(summary["inputTokens"], 150)
        self.assertEqual(summary["outputTokens"], 30)
        self.assertEqual(summary["cacheReadTokens"], 30)
        self.assertEqual(summary["cacheCreationTokens"], 5)
        self.assertEqual(summary["totalTokens"], 215)
        self.assertEqual(summary["totalCostUsd"], 0.03)
        self.assertEqual(summary["primaryModel"], "gpt-5")
        self.assertEqual(summary["primaryModelDisplayName"], "GPT-5")
        self.assertEqual(len(payload["trend"]), 13)

        recent_keys = set(payload["recent"][0])
        self.assertNotIn("request_id", recent_keys)
        self.assertNotIn("provider_id", recent_keys)
        self.assertNotIn("session_id", recent_keys)
        self.assertEqual(payload["routing"], {"codex": False, "claude": True})

        routed = payload["recent"][0]
        self.assertEqual(routed["model"], "opus")
        self.assertEqual(routed["displayName"], "Claude Opus")
        self.assertEqual(routed["state"], "failed")
        self.assertEqual(routed["ttftMs"], 300)
        self.assertEqual(routed["durationMs"], 2300)
        self.assertEqual(routed["tps"], 5.0)
        self.assertTrue(routed["routed"])

        unrouted = payload["recent"][1]
        self.assertEqual(unrouted["state"], "completed")
        self.assertIsNone(unrouted["ttftMs"])
        self.assertIsNone(unrouted["durationMs"])
        self.assertIsNone(unrouted["tps"])
        self.assertFalse(unrouted["routed"])
        self.assertEqual(unrouted["displayName"], "GPT-5")

    def test_range_and_app_filters(self):
        week = self.repository.fetch_dashboard("7d", "all")
        month_claude = self.repository.fetch_dashboard("30d", "claude")

        self.assertEqual(week["summary"]["requests"], 3)
        self.assertEqual(len(week["trend"]), 7)
        self.assertEqual(month_claude["summary"]["requests"], 2)
        self.assertEqual(
            {item["model"] for item in month_claude["models"]},
            {"opus", "sonnet"},
        )
        self.assertEqual(
            {item["model"]: item["displayName"] for item in month_claude["models"]},
            {"opus": "Claude Opus", "sonnet": "sonnet"},
        )
        self.assertEqual(month_claude["apps"][0]["app"], "claude")

    def test_connection_is_query_only(self):
        connection = self.repository._connect()
        try:
            with self.assertRaises(sqlite3.OperationalError):
                connection.execute("DELETE FROM proxy_request_logs")
        finally:
            connection.close()

        count = sqlite3.connect(str(self.database_path)).execute(
            "SELECT COUNT(*) FROM proxy_request_logs"
        ).fetchone()[0]
        self.assertEqual(count, 5)

    def test_missing_required_column_is_rejected(self):
        broken_path = Path(self.tempdir.name) / "broken.db"
        connection = sqlite3.connect(str(broken_path))
        connection.execute("CREATE TABLE proxy_request_logs (created_at INTEGER)")
        connection.close()

        with self.assertRaises(SchemaIncompatible):
            DashboardRepository(str(broken_path)).validate_schema()

    def test_service_rejects_unknown_filters(self):
        service = DashboardService(self.repository)
        with self.assertRaises(ValueError):
            service.get_dashboard("forever", "all")
        with self.assertRaises(ValueError):
            service.get_dashboard("today", "gemini")

    def test_service_returns_stale_snapshot_when_database_disappears(self):
        service = DashboardService(self.repository, refresh_seconds=1)
        first = service.get_dashboard("today", "all")
        moved_path = self.database_path.with_suffix(".moved")
        self.database_path.rename(moved_path)

        stale = service.get_dashboard("today", "all")

        self.assertFalse(first["meta"]["stale"])
        self.assertTrue(stale["meta"]["stale"])
        self.assertEqual(
            stale["meta"]["staleReason"], "database_temporarily_unavailable"
        )
        self.assertEqual(stale["summary"], first["summary"])

    def test_empty_valid_database_returns_zero_summary(self):
        empty_path = Path(self.tempdir.name) / "empty.db"
        connection = sqlite3.connect(str(empty_path))
        connection.executescript(
            """
            PRAGMA user_version = 16;
            CREATE TABLE proxy_request_logs (
                app_type TEXT NOT NULL,
                model TEXT NOT NULL,
                input_tokens INTEGER NOT NULL DEFAULT 0,
                output_tokens INTEGER NOT NULL DEFAULT 0,
                cache_read_tokens INTEGER NOT NULL DEFAULT 0,
                cache_creation_tokens INTEGER NOT NULL DEFAULT 0,
                total_cost_usd TEXT NOT NULL DEFAULT '0',
                status_code INTEGER NOT NULL,
                created_at INTEGER NOT NULL
            );
            """
        )
        connection.close()

        payload = DashboardRepository(
            str(empty_path), now_provider=lambda: FIXED_NOW
        ).fetch_dashboard("today", "all")

        self.assertEqual(payload["summary"]["requests"], 0)
        self.assertEqual(payload["summary"]["totalTokens"], 0)
        self.assertIsNone(payload["summary"]["primaryModel"])
        self.assertIsNone(payload["summary"]["primaryModelDisplayName"])
        self.assertEqual(payload["recent"], [])
        self.assertEqual(payload["models"], [])


if __name__ == "__main__":
    unittest.main()
