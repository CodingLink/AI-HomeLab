(function attachWeeklyQuotaLogic(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.HomeDashWeeklyQuota = api;
  }
})(typeof globalThis === "object" ? globalThis : null, function createWeeklyQuotaLogic() {
  "use strict";

  const MINUTE_MS = 60_000;
  const WEEKLY_WINDOW_MINUTES = 10_080;
  const WEEKLY_WINDOW_MS = WEEKLY_WINDOW_MINUTES * MINUTE_MS;
  const PACE_TOLERANCE = 0.05;
  const FORECAST_MIN_ELAPSED = 0.01;
  const FORECAST_MIN_USED = 0.01;
  const EARLY_FORECAST_THRESHOLD = 0.05;

  function timestamp(value) {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : null;
    }
    if (typeof value !== "string" || !value.trim()) return null;
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function finitePercent(value) {
    if (value === null || value === undefined || value === "" || typeof value === "boolean") {
      return null;
    }
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 && number <= 100 ? number : null;
  }

  function waitingForecast(reason) {
    return { kind: "waiting", reason };
  }

  function unknownForecast(reason) {
    return { kind: "unknown", reason };
  }

  function buildWeeklyWindow(provider, limit, options = {}) {
    if (Number(limit?.windowMinutes) !== WEEKLY_WINDOW_MINUTES) return null;

    const providerId = String(provider?.id || "unknown");
    const limitId = String(limit?.id || "weekly");
    const providerStatus = String(provider?.status || "unavailable");
    const remainingPercent = finitePercent(limit?.remainingPercent);
    const resetAtMs = timestamp(limit?.resetAt);
    const providerObservedAtMs = timestamp(provider?.lastSuccessAt);
    const generatedAtMs = timestamp(options.generatedAt);
    const observedAtMs = providerObservedAtMs ?? generatedAtMs;
    const suppliedNowMs = timestamp(options.nowMs);
    const nowMs = suppliedNowMs ?? Date.now();
    const dataState =
      !options.snapshotStale && providerStatus === "live" ? "live" : "stale";
    const windowStartMs = resetAtMs === null ? null : resetAtMs - WEEKLY_WINDOW_MS;

    const record = {
      key: `${providerId}:${limitId}`,
      providerId,
      providerName: String(provider?.name || providerId),
      providerStatus,
      dataState,
      limitId,
      remainingPercent,
      remainingFraction: remainingPercent === null ? null : remainingPercent / 100,
      usedFraction: remainingPercent === null ? null : 1 - remainingPercent / 100,
      resetAtMs,
      windowStartMs,
      observedAtMs,
      observationSource: providerObservedAtMs === null ? "snapshot" : "provider",
      elapsedMs: null,
      elapsedFraction: null,
      burnRatePerMs: null,
      pace: "unknown",
      forecast: unknownForecast("invalid_window"),
    };

    if (dataState === "stale") {
      return {
        ...record,
        pace: "stale",
        forecast: { kind: "stale", reason: "stale_data" },
      };
    }

    if (
      remainingPercent === null ||
      resetAtMs === null ||
      observedAtMs === null ||
      windowStartMs === null
    ) {
      return record;
    }

    if (resetAtMs <= observedAtMs || resetAtMs <= nowMs) {
      return {
        ...record,
        pace: "waiting",
        forecast: waitingForecast("expired_reset"),
      };
    }

    if (observedAtMs < windowStartMs) {
      return record;
    }

    const elapsedMs = observedAtMs - windowStartMs;
    const elapsedFraction = elapsedMs / WEEKLY_WINDOW_MS;
    const remainingFraction = remainingPercent / 100;
    const usedFraction = 1 - remainingFraction;
    const pace =
      remainingFraction < 0.2
        ? "critical"
        : usedFraction - elapsedFraction > PACE_TOLERANCE
          ? "fast"
          : "healthy";
    const calculated = {
      ...record,
      elapsedMs,
      elapsedFraction,
      pace,
    };

    if (
      elapsedFraction < FORECAST_MIN_ELAPSED ||
      usedFraction < FORECAST_MIN_USED ||
      elapsedMs <= 0
    ) {
      return {
        ...calculated,
        forecast: waitingForecast("insufficient_observation"),
      };
    }

    const burnRatePerMs = usedFraction / elapsedMs;
    if (!Number.isFinite(burnRatePerMs) || burnRatePerMs <= 0) {
      return {
        ...calculated,
        forecast: unknownForecast("invalid_burn_rate"),
      };
    }

    const etaMs = remainingFraction / burnRatePerMs;
    const exhaustAtMs = observedAtMs + etaMs;
    const early = elapsedFraction < EARLY_FORECAST_THRESHOLD;
    const withBurnRate = { ...calculated, burnRatePerMs };

    if (!Number.isFinite(etaMs) || !Number.isFinite(exhaustAtMs)) {
      return {
        ...withBurnRate,
        forecast: unknownForecast("invalid_eta"),
      };
    }

    if (exhaustAtMs <= nowMs && nowMs > observedAtMs) {
      return {
        ...withBurnRate,
        forecast: waitingForecast("prediction_elapsed"),
      };
    }

    if (exhaustAtMs < resetAtMs) {
      return {
        ...withBurnRate,
        forecast: {
          kind: "exhausts",
          early,
          etaMs,
          exhaustAtMs,
          leadMs: resetAtMs - exhaustAtMs,
        },
      };
    }

    return {
      ...withBurnRate,
      forecast: {
        kind: "survives",
        early,
        etaMs,
        exhaustAtMs,
        projectedRemainingPercent: Math.max(
          0,
          Math.min(100, (1 - burnRatePerMs * WEEKLY_WINDOW_MS) * 100),
        ),
      },
    };
  }

  function collectWeeklyWindows(providers, options = {}) {
    const windows = [];
    for (const provider of providers || []) {
      for (const limit of provider?.limits || []) {
        const record = buildWeeklyWindow(provider, limit, options);
        if (record) windows.push(record);
      }
    }
    return windows;
  }

  function riskRank(window) {
    if (window.dataState !== "live") return -1;
    if (window.forecast?.kind === "exhausts") return 5;
    return {
      critical: 4,
      fast: 3,
      healthy: 2,
      waiting: 1,
      unknown: 0,
    }[window.pace] ?? 0;
  }

  function compareWindows(left, right) {
    const leftLive = left.dataState === "live";
    const rightLive = right.dataState === "live";
    if (leftLive !== rightLive) return leftLive ? -1 : 1;

    const rankDifference = riskRank(right) - riskRank(left);
    if (rankDifference) return rankDifference;

    if (
      left.forecast?.kind === "exhausts" &&
      right.forecast?.kind === "exhausts" &&
      left.forecast.exhaustAtMs !== right.forecast.exhaustAtMs
    ) {
      return left.forecast.exhaustAtMs - right.forecast.exhaustAtMs;
    }

    const leftRemaining = left.remainingPercent ?? Infinity;
    const rightRemaining = right.remainingPercent ?? Infinity;
    if (leftRemaining !== rightRemaining) return leftRemaining - rightRemaining;

    const leftReset = left.resetAtMs ?? Infinity;
    const rightReset = right.resetAtMs ?? Infinity;
    if (leftReset !== rightReset) return leftReset - rightReset;
    return left.key.localeCompare(right.key);
  }

  function summarizeWeeklyWindows(windows) {
    const sortedWindows = [...(windows || [])].sort(compareWindows);
    const liveWindows = sortedWindows.filter((window) => window.dataState === "live");
    const staleWindows = sortedWindows.filter((window) => window.dataState !== "live");
    const liveRemaining = liveWindows
      .map((window) => window.remainingPercent)
      .filter(Number.isFinite);
    const staleRemaining = staleWindows
      .map((window) => window.remainingPercent)
      .filter(Number.isFinite);

    let ringMode = "unavailable";
    let ringRemainingPercent = null;
    if (liveRemaining.length) {
      ringMode = "live";
      ringRemainingPercent = Math.min(...liveRemaining);
    } else if (!liveWindows.length && staleRemaining.length) {
      ringMode = "stale";
      ringRemainingPercent = Math.min(...staleRemaining);
    }

    return {
      windows: sortedWindows,
      liveWindows,
      staleWindows,
      ringMode,
      ringRemainingPercent,
      worst: liveWindows[0] || staleWindows[0] || null,
    };
  }

  return Object.freeze({
    WEEKLY_WINDOW_MINUTES,
    WEEKLY_WINDOW_MS,
    PACE_TOLERANCE,
    FORECAST_MIN_ELAPSED,
    FORECAST_MIN_USED,
    EARLY_FORECAST_THRESHOLD,
    buildWeeklyWindow,
    collectWeeklyWindows,
    summarizeWeeklyWindows,
  });
});
