import json
import os
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

from app.live_activity import (
    LiveActivityCollector,
    LiveActivitySnapshotService,
    parse_claude_activity,
    parse_codex_activity,
    write_snapshot,
)


UTC = timezone.utc
NOW = datetime(2026, 8, 17, 5, 0, 10, tzinfo=UTC)


def write_jsonl(path, events):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(json.dumps(event) for event in events) + "\n", encoding="utf-8")


class LiveActivityParsingTests(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.TemporaryDirectory()
        self.root = Path(self.tempdir.name)

    def tearDown(self):
        self.tempdir.cleanup()

    def test_codex_active_turn_uses_metadata_only(self):
        path = self.root / "codex.jsonl"
        write_jsonl(
            path,
            [
                {
                    "timestamp": "2026-08-17T05:00:00Z",
                    "payload": {"type": "turn_context", "model": "gpt-5.3-codex"},
                },
                {
                    "timestamp": "2026-08-17T05:00:01Z",
                    "payload": {"type": "user_message", "message": "private prompt"},
                },
                {
                    "timestamp": "2026-08-17T05:00:03Z",
                    "payload": {"type": "agent_message", "phase": "commentary", "message": "private answer"},
                },
                {
                    "timestamp": "2026-08-17T05:00:08Z",
                    "payload": {
                        "type": "token_count",
                        "info": {"last_token_usage": {"input_tokens": 100, "output_tokens": 14}},
                    },
                },
            ],
        )

        activity = parse_codex_activity(path, NOW)

        self.assertEqual(activity["app"], "codex")
        self.assertEqual(activity["model"], "gpt-5.3-codex")
        self.assertEqual(activity["ttftMs"], 2000)
        self.assertEqual(activity["durationMs"], 9000)
        self.assertEqual(activity["tps"], 2.0)
        serialized = json.dumps(activity)
        self.assertNotIn("private prompt", serialized)
        self.assertNotIn("private answer", serialized)

    def test_completed_codex_and_claude_turns_are_not_reported(self):
        codex = self.root / "codex-complete.jsonl"
        write_jsonl(
            codex,
            [
                {"timestamp": "2026-08-17T05:00:01Z", "payload": {"type": "user_message"}},
                {"timestamp": "2026-08-17T05:00:03Z", "payload": {"type": "agent_message", "phase": "final_answer"}},
            ],
        )
        claude = self.root / "claude-complete.jsonl"
        write_jsonl(
            claude,
            [
                {"type": "user", "timestamp": "2026-08-17T05:00:01Z", "message": {"content": "private"}},
                {"type": "assistant", "timestamp": "2026-08-17T05:00:03Z", "message": {"model": "claude-opus", "stop_reason": "end_turn"}},
            ],
        )
        self.assertIsNone(parse_codex_activity(codex, NOW))
        self.assertIsNone(parse_claude_activity(claude, NOW))

    def test_collector_obeys_route_flags_and_snapshot_is_whitelisted(self):
        codex_root = self.root / "codex"
        claude_root = self.root / "claude"
        write_jsonl(
            codex_root / "active.jsonl",
            [{"timestamp": "2026-08-17T05:00:01Z", "payload": {"type": "user_message"}}],
        )
        write_jsonl(
            claude_root / "active.jsonl",
            [{"type": "user", "timestamp": "2026-08-17T05:00:02Z", "message": {"content": "secret"}}],
        )
        collector = LiveActivityCollector(
            codex_root=codex_root,
            claude_root=claude_root,
            now_provider=lambda: NOW,
            routing_provider=lambda: {"codex": False, "claude": True},
        )

        snapshot = collector.collect()

        self.assertEqual(snapshot["routing"], {"codex": False, "claude": True})
        self.assertEqual([item["app"] for item in snapshot["activities"]], ["claude"])
        self.assertNotIn("secret", json.dumps(snapshot))

    def test_stale_snapshot_hides_old_active_rows_and_permissions_are_private(self):
        path = self.root / "ai-live-activity.json"
        snapshot = {
            "schemaVersion": 1,
            "source": "session-metadata",
            "generatedAt": "2026-08-17T05:00:00Z",
            "staleAfterSeconds": 5,
            "routing": {"codex": True, "claude": False},
            "activities": [
                {
                    "app": "codex",
                    "model": "gpt-5",
                    "state": "calling",
                    "startedAt": "2026-08-17T04:59:58Z",
                    "inputTokens": 1,
                    "outputTokens": 2,
                    "ttftMs": 500,
                    "durationMs": 2000,
                    "tps": 1.3,
                    "estimated": True,
                    "prompt": "must be discarded",
                }
            ],
        }
        write_snapshot(path, snapshot)
        payload = LiveActivitySnapshotService(
            path, now_provider=lambda: NOW
        ).get_activity()

        self.assertEqual(os.stat(path).st_mode & 0o777, 0o600)
        self.assertTrue(payload["meta"]["stale"])
        self.assertEqual(payload["activities"], [])
        self.assertNotIn("must be discarded", path.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
