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


class IncrementalTrackingTests(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.TemporaryDirectory()
        self.root = Path(self.tempdir.name)

    def tearDown(self):
        self.tempdir.cleanup()

    def _collector(self):
        return LiveActivityCollector(
            codex_root=self.root / "codex",
            claude_root=self.root / "claude",
            now_provider=lambda: NOW,
            routing_provider=lambda: {"codex": True, "claude": True},
        )

    @staticmethod
    def _append(path, events):
        with path.open("a", encoding="utf-8") as handle:
            for event in events:
                handle.write(json.dumps(event) + "\n")

    def test_incremental_append_consumes_only_new_bytes(self):
        path = self.root / "claude" / "s.jsonl"
        write_jsonl(
            path,
            [{"type": "user", "timestamp": "2026-08-17T05:00:01Z", "message": {"content": "hi"}}],
        )
        collector = self._collector()
        first = collector.collect()
        self.assertEqual(len(first["activities"]), 1)
        tracker = collector._trackers[path]
        self.assertEqual(tracker.offset, path.stat().st_size)

        self._append(
            path,
            [{"type": "assistant", "timestamp": "2026-08-17T05:00:05Z",
              "message": {"model": "claude-opus", "stop_reason": "tool_use",
                          "usage": {"input_tokens": 10, "output_tokens": 3}}}],
        )
        second = collector.collect()
        self.assertEqual(second["activities"][0]["model"], "claude-opus")
        self.assertEqual(second["activities"][0]["inputTokens"], 10)
        self.assertEqual(tracker.offset, path.stat().st_size)

        # A poll with no new bytes changes nothing and keeps the activity.
        third = collector.collect()
        self.assertEqual(tracker.offset, path.stat().st_size)
        self.assertEqual(len(third["activities"]), 1)

    def test_partial_line_is_buffered_until_completed(self):
        path = self.root / "claude" / "s.jsonl"
        write_jsonl(
            path,
            [{"type": "user", "timestamp": "2026-08-17T05:00:01Z", "message": {"content": "hi"}}],
        )
        collector = self._collector()
        collector.collect()
        tracker = collector._trackers[path]

        raw = json.dumps({"type": "assistant", "timestamp": "2026-08-17T05:00:05Z",
                          "message": {"model": "claude-opus", "stop_reason": "end_turn"}})
        with path.open("a", encoding="utf-8") as handle:
            handle.write(raw[:20])
        partial = collector.collect()
        self.assertEqual(len(partial["activities"]), 1)
        self.assertEqual(tracker.buffer.decode("utf-8"), raw[:20])

        with path.open("a", encoding="utf-8") as handle:
            handle.write(raw[20:] + "\n")
        completed = collector.collect()
        self.assertEqual(completed["activities"], [])
        self.assertEqual(tracker.buffer, b"")

    def test_truncated_file_rebootstraps_without_stale_state(self):
        path = self.root / "claude" / "s.jsonl"
        write_jsonl(
            path,
            [{"type": "user", "timestamp": "2026-08-17T05:00:01Z", "message": {"content": "hi"}}],
        )
        collector = self._collector()
        self.assertEqual(len(collector.collect()["activities"]), 1)

        path.write_text("", encoding="utf-8")
        self.assertEqual(collector.collect()["activities"], [])

        self._append(
            path,
            [{"type": "user", "timestamp": "2026-08-17T05:00:02Z", "message": {"content": "again"}}],
        )
        self.assertEqual(len(collector.collect()["activities"]), 1)

    def test_bootstrap_covers_turn_start_beyond_legacy_512k_window(self):
        path = self.root / "claude" / "big.jsonl"
        filler = {"type": "user", "timestamp": "2026-08-17T04:59:59Z",
                  "message": {"content": [{"type": "tool_result", "content": "x" * 4096}]}}
        filler_line = json.dumps(filler) + "\n"
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("w", encoding="utf-8") as handle:
            handle.write(json.dumps(
                {"type": "user", "timestamp": "2026-08-17T05:00:01Z", "message": {"content": "start"}}
            ) + "\n")
            while handle.tell() < 700 * 1024:  # turn start is ~700KB from the end
                handle.write(filler_line)
            handle.write(json.dumps(
                {"type": "assistant", "timestamp": "2026-08-17T05:00:05Z",
                 "message": {"model": "claude-opus", "stop_reason": "tool_use"}}
            ) + "\n")

        activity = parse_claude_activity(path, NOW)

        self.assertIsNotNone(activity)
        self.assertEqual(activity["model"], "claude-opus")

    def test_local_command_events_do_not_start_turns(self):
        prefixes = ("<local-command-stdout>", "<local-command-caveat>", "<command-name>")
        for is_meta in (True, False, None):
            for index, prefix in enumerate(prefixes):
                path = self.root / f"claude-local-{is_meta}-{index}.jsonl"
                event = {"type": "user", "timestamp": "2026-08-17T05:00:01Z",
                         "message": {"content": f"{prefix}hidden"}}
                if is_meta is not None:
                    event["isMeta"] = is_meta
                write_jsonl(
                    path,
                    [
                        event,
                        {"type": "assistant", "timestamp": "2026-08-17T05:00:03Z",
                         "message": {"model": "claude-opus", "stop_reason": "tool_use"}},
                    ],
                )
                self.assertIsNone(
                    parse_claude_activity(path, NOW),
                    msg=f"{prefix} with isMeta={is_meta}",
                )

    def test_additional_stop_reasons_end_turns(self):
        for reason in ("end_turn", "max_tokens", "stop_sequence", "refusal"):
            path = self.root / f"claude-stop-{reason}.jsonl"
            write_jsonl(
                path,
                [
                    {"type": "user", "timestamp": "2026-08-17T05:00:01Z", "message": {"content": "hi"}},
                    {"type": "assistant", "timestamp": "2026-08-17T05:00:03Z",
                     "message": {"model": "claude-opus", "stop_reason": reason}},
                ],
            )
            self.assertIsNone(parse_claude_activity(path, NOW), msg=reason)

        for reason in ("tool_use", "pause_turn"):
            path = self.root / f"claude-mid-{reason}.jsonl"
            write_jsonl(
                path,
                [
                    {"type": "user", "timestamp": "2026-08-17T05:00:01Z", "message": {"content": "hi"}},
                    {"type": "assistant", "timestamp": "2026-08-17T05:00:03Z",
                     "message": {"model": "claude-opus", "stop_reason": reason}},
                ],
            )
            self.assertIsNotNone(parse_claude_activity(path, NOW), msg=reason)

    def test_sidechain_events_do_not_disturb_main_turn(self):
        path = self.root / "claude" / "s.jsonl"
        write_jsonl(
            path,
            [
                {"type": "user", "timestamp": "2026-08-17T05:00:01Z", "message": {"content": "hi"}},
                {"type": "assistant", "timestamp": "2026-08-17T05:00:03Z",
                 "message": {"model": "claude-opus", "stop_reason": "tool_use",
                             "usage": {"input_tokens": 10, "output_tokens": 2}}},
                # A sub-agent completes mid-turn; its end_turn/model/usage must not leak.
                {"type": "assistant", "timestamp": "2026-08-17T05:00:06Z", "isSidechain": True,
                 "message": {"model": "claude-haiku", "stop_reason": "end_turn",
                             "usage": {"input_tokens": 999, "output_tokens": 999}}},
            ],
        )

        activity = parse_claude_activity(path, NOW)

        self.assertIsNotNone(activity)
        self.assertEqual(activity["model"], "claude-opus")
        self.assertEqual(activity["inputTokens"], 10)
        self.assertEqual(activity["outputTokens"], 2)
