(function attachHeatmapLogic(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.HomeDashHeatmap = api;
  }
})(typeof globalThis === "object" ? globalThis : null, function createHeatmapLogic() {
  "use strict";

  const HEATMAP_DAYS = 365;
  const DAYS_PER_WEEK = 7;

  function parseDay(dateStr) {
    if (typeof dateStr !== "string") return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }
    return { year, month, day, weekday: date.getDay() };
  }

  function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : 0;
  }

  function buildCalendar(days) {
    const list = (Array.isArray(days) ? days : []).filter(
      (entry) => entry && parseDay(entry.date)
    );
    if (!list.length) {
      return { cells: [], weekCount: 0, leadingBlanks: 0, monthLabels: [] };
    }

    const first = parseDay(list[0].date);
    // Weeks start on Sunday, mirroring GitHub's contribution graph: the first
    // column is padded with invisible blanks up to the first day's weekday.
    const leadingBlanks = first.weekday;
    const cells = [];
    for (let index = 0; index < leadingBlanks; index += 1) {
      cells.push(null);
    }

    const monthLabels = [];
    list.forEach((entry) => {
      const parsed = parseDay(entry.date);
      if (parsed.day === 1) {
        monthLabels.push({
          weekIndex: Math.floor(cells.length / DAYS_PER_WEEK),
          year: parsed.year,
          month: parsed.month,
        });
      }
      cells.push({
        date: entry.date,
        totalTokens: toNumber(entry.totalTokens),
        requests: toNumber(entry.requests),
      });
    });

    // The window rarely starts on the 1st, so label the opening month too —
    // unless the next month's label sits close enough to overlap it (month
    // labels need roughly three columns of room).
    if (!monthLabels.length || monthLabels[0].weekIndex >= 3) {
      monthLabels.unshift({ weekIndex: 0, year: first.year, month: first.month });
    }

    return {
      cells,
      weekCount: Math.ceil(cells.length / DAYS_PER_WEEK),
      leadingBlanks,
      monthLabels,
    };
  }

  function computeThresholds(values) {
    const nonzero = (Array.isArray(values) ? values : [])
      .map((value) => Number(value) || 0)
      .filter((value) => value > 0)
      .sort((a, b) => a - b);
    if (!nonzero.length) return [0, 0, 0];
    const pick = (fraction) =>
      nonzero[Math.floor(fraction * (nonzero.length - 1))];
    return [pick(0.25), pick(0.5), pick(0.75)];
  }

  function levelFor(value, thresholds) {
    const number = Number(value) || 0;
    if (number <= 0) return 0;
    const [t1, t2, t3] = thresholds;
    if (number >= t3) return 4;
    if (number >= t2) return 3;
    if (number >= t1) return 2;
    return 1;
  }

  return Object.freeze({
    HEATMAP_DAYS,
    DAYS_PER_WEEK,
    parseDay,
    buildCalendar,
    computeThresholds,
    levelFor,
  });
});
