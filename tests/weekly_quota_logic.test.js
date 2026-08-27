"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const {
  WEEKLY_WINDOW_MS,
  buildWeeklyWindow,
  collectWeeklyWindows,
  summarizeWeeklyWindows,
} = require("../static/weekly-quota-logic.js");

const RESET_MS = Date.parse("2026-01-08T00:00:00Z");
const START_MS = RESET_MS - WEEKLY_WINDOW_MS;

function iso(milliseconds) {
  return new Date(milliseconds).toISOString();
}

function record({
  providerId = "plan",
  limitId = "weekly",
  remaining = 80,
  elapsed = 0.2,
  resetAtMs = RESET_MS,
  observedAtMs = resetAtMs - WEEKLY_WINDOW_MS + elapsed * WEEKLY_WINDOW_MS,
  generatedAtMs = observedAtMs,
  nowMs = generatedAtMs,
  status = "live",
  snapshotStale = false,
} = {}) {
  return buildWeeklyWindow(
    {
      id: providerId,
      name: providerId.toUpperCase(),
      status,
      lastSuccessAt: observedAtMs === null ? null : iso(observedAtMs),
    },
    {
      id: limitId,
      remainingPercent: remaining,
      windowMinutes: 10_080,
      resetAt: resetAtMs === null ? null : iso(resetAtMs),
    },
    {
      generatedAt: generatedAtMs === null ? null : iso(generatedAtMs),
      nowMs,
      snapshotStale,
    },
  );
}

test("each plan derives elapsed time from its own reset boundary", () => {
  const observedAtMs = Date.parse("2026-01-05T00:00:00Z");
  const firstReset = Date.parse("2026-01-08T00:00:00Z");
  const secondReset = Date.parse("2026-01-10T00:00:00Z");
  const providers = [
    {
      id: "first",
      name: "First",
      status: "live",
      lastSuccessAt: iso(observedAtMs),
      limits: [
        {
          id: "primary",
          remainingPercent: 70,
          windowMinutes: 10_080,
          resetAt: iso(firstReset),
        },
      ],
    },
    {
      id: "second",
      name: "Second",
      status: "live",
      lastSuccessAt: iso(observedAtMs),
      limits: [
        {
          id: "primary",
          remainingPercent: 70,
          windowMinutes: 10_080,
          resetAt: iso(secondReset),
        },
      ],
    },
  ];

  const windows = collectWeeklyWindows(providers, {
    generatedAt: iso(observedAtMs),
    nowMs: observedAtMs,
  });

  assert.equal(windows.length, 2);
  assert.equal(windows[0].elapsedFraction, 4 / 7);
  assert.equal(windows[1].elapsedFraction, 2 / 7);
  assert.notEqual(windows[0].burnRatePerMs, windows[1].burnRatePerMs);
});

test("predicts exhaustion before reset and marks an early observation", () => {
  const window = record({ remaining: 90, elapsed: 0.02 });

  assert.equal(window.pace, "fast");
  assert.equal(window.forecast.kind, "exhausts");
  assert.equal(window.forecast.early, true);
  assert.ok(Math.abs(window.forecast.etaMs - WEEKLY_WINDOW_MS * 0.18) < 1);
  assert.ok(Math.abs(window.forecast.leadMs - WEEKLY_WINDOW_MS * 0.8) < 1);
});

test("treats exact reset exhaustion as sustainable and projects zero remaining", () => {
  const window = record({ remaining: 60, elapsed: 0.4 });

  assert.equal(window.forecast.kind, "survives");
  assert.ok(Math.abs(window.forecast.exhaustAtMs - RESET_MS) < 1);
  assert.ok(Math.abs(window.forecast.projectedRemainingPercent) < 1e-9);
});

test("projects remaining quota when the current burn rate reaches reset", () => {
  const window = record({ remaining: 80, elapsed: 0.5 });

  assert.equal(window.pace, "healthy");
  assert.equal(window.forecast.kind, "survives");
  assert.ok(Math.abs(window.forecast.projectedRemainingPercent - 60) < 1e-9);
});

test("does not produce ETA for zero use or observations below the minimum", () => {
  assert.equal(record({ remaining: 100, elapsed: 0.5 }).forecast.kind, "waiting");
  assert.equal(record({ remaining: 99.5, elapsed: 0.2 }).forecast.kind, "waiting");
  assert.equal(record({ remaining: 90, elapsed: 0.005 }).forecast.kind, "waiting");
});

test("does not turn a missing remaining value into zero quota", () => {
  const window = record({ remaining: null, elapsed: 0.5 });
  const summary = summarizeWeeklyWindows([window]);

  assert.equal(window.remainingPercent, null);
  assert.equal(window.pace, "unknown");
  assert.equal(summary.ringMode, "unavailable");
  assert.equal(summary.ringRemainingPercent, null);
});

test("handles invalid, expired, stale, and elapsed predictions without ETA", () => {
  assert.equal(record({ resetAtMs: null }).forecast.kind, "unknown");
  assert.equal(record({ nowMs: RESET_MS + 1 }).forecast.kind, "waiting");
  assert.equal(record({ status: "stale" }).forecast.kind, "stale");
  assert.equal(record({ snapshotStale: true }).forecast.kind, "stale");

  const lagged = record({
    remaining: 50,
    elapsed: 0.1,
    generatedAtMs: START_MS + WEEKLY_WINDOW_MS * 0.7,
    nowMs: START_MS + WEEKLY_WINDOW_MS * 0.7,
  });
  assert.equal(lagged.forecast.kind, "waiting");
  assert.equal(lagged.forecast.reason, "prediction_elapsed");
});

test("uses provider observation time and falls back to snapshot time only when missing", () => {
  const observedAtMs = START_MS + WEEKLY_WINDOW_MS * 0.1;
  const generatedAtMs = START_MS + WEEKLY_WINDOW_MS * 0.2;
  const observed = record({
    remaining: 80,
    elapsed: 0.1,
    observedAtMs,
    generatedAtMs,
    nowMs: generatedAtMs,
  });
  const fallback = record({
    remaining: 80,
    observedAtMs: null,
    generatedAtMs,
    nowMs: generatedAtMs,
  });

  assert.equal(observed.observationSource, "provider");
  assert.ok(Math.abs(observed.elapsedFraction - 0.1) < 1e-12);
  assert.ok(Math.abs(observed.forecast.etaMs - WEEKLY_WINDOW_MS * 0.4) < 1);
  assert.equal(fallback.observationSource, "snapshot");
  assert.ok(Math.abs(fallback.elapsedFraction - 0.2) < 1e-12);
});

test("keeps multiple windows from one provider distinct", () => {
  const provider = {
    id: "multi",
    name: "Multi",
    status: "live",
    lastSuccessAt: iso(START_MS + WEEKLY_WINDOW_MS * 0.2),
    limits: [
      {
        id: "primary",
        remainingPercent: 75,
        windowMinutes: 10_080,
        resetAt: iso(RESET_MS),
      },
      {
        id: "secondary",
        remainingPercent: 65,
        windowMinutes: 10_080,
        resetAt: iso(RESET_MS + 60_000),
      },
    ],
  };

  const windows = collectWeeklyWindows([provider], {
    generatedAt: provider.lastSuccessAt,
    nowMs: START_MS + WEEKLY_WINDOW_MS * 0.2,
  });

  assert.deepEqual(
    windows.map((window) => window.key),
    ["multi:primary", "multi:secondary"],
  );
});

test("summary uses the lowest live quota, orders by risk, and excludes stale values", () => {
  const early = record({ providerId: "early", remaining: 80, elapsed: 0.1 });
  const earlier = record({ providerId: "earlier", remaining: 90, elapsed: 0.02 });
  const low = record({ providerId: "low", remaining: 5, elapsed: 0.9 });
  const full = record({ providerId: "full", remaining: 100, elapsed: 0.9 });
  const stale = record({ providerId: "stale", remaining: 1, elapsed: 0.5, status: "stale" });
  const summary = summarizeWeeklyWindows([early, earlier, full, low, stale]);

  assert.equal(summary.ringMode, "live");
  assert.equal(summary.ringRemainingPercent, 5);
  assert.equal(summary.worst.providerId, "earlier");
  assert.equal(summary.windows.at(-1).providerId, "stale");
});

test("only stale plans produce a gray historical aggregate", () => {
  const summary = summarizeWeeklyWindows([
    record({ providerId: "one", remaining: 45, status: "stale" }),
    record({ providerId: "two", remaining: 25, status: "stale" }),
  ]);

  assert.equal(summary.ringMode, "stale");
  assert.equal(summary.ringRemainingPercent, 25);
  assert.equal(summary.liveWindows.length, 0);
});

test("timezone offsets do not change calculations", () => {
  const utc = buildWeeklyWindow(
    {
      id: "utc",
      status: "live",
      lastSuccessAt: "2026-01-01T12:00:00Z",
    },
    {
      id: "weekly",
      remainingPercent: 90,
      windowMinutes: 10_080,
      resetAt: "2026-01-08T00:00:00Z",
    },
    { nowMs: Date.parse("2026-01-01T12:00:00Z") },
  );
  const offset = buildWeeklyWindow(
    {
      id: "offset",
      status: "live",
      lastSuccessAt: "2026-01-01T20:00:00+08:00",
    },
    {
      id: "weekly",
      remainingPercent: 90,
      windowMinutes: 10_080,
      resetAt: "2026-01-08T08:00:00+08:00",
    },
    { nowMs: Date.parse("2026-01-01T12:00:00Z") },
  );

  assert.equal(offset.elapsedMs, utc.elapsedMs);
  assert.equal(offset.forecast.etaMs, utc.forecast.etaMs);
  assert.equal(offset.forecast.exhaustAtMs, utc.forecast.exhaustAtMs);
});
