"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const {
  HEATMAP_DAYS,
  DAYS_PER_WEEK,
  parseDay,
  buildCalendar,
  computeThresholds,
  levelFor,
} = require("../static/heatmap-logic.js");

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysEnding(dateStr, count, tokens = 0) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const days = [];
  for (let back = count - 1; back >= 0; back -= 1) {
    days.push({
      date: formatDate(new Date(year, month - 1, day - back)),
      totalTokens: tokens,
      requests: tokens > 0 ? 1 : 0,
    });
  }
  return days;
}

test("parseDay parses calendar dates without timezone ambiguity", () => {
  const parsed = parseDay("2026-09-26");
  assert.equal(parsed.year, 2026);
  assert.equal(parsed.month, 9);
  assert.equal(parsed.day, 26);
  assert.equal(parsed.weekday, new Date(2026, 8, 26).getDay());

  assert.equal(parseDay("2026-02-30"), null);
  assert.equal(parseDay("2026-9-5"), null);
  assert.equal(parseDay("not-a-date"), null);
  assert.equal(parseDay(null), null);
  assert.equal(parseDay(20260926), null);
});

test("buildCalendar pads the first week to a Sunday start", () => {
  const days = daysEnding("2026-09-26", HEATMAP_DAYS);
  const calendar = buildCalendar(days);

  const firstWeekday = new Date(2025, 8, 27).getDay();
  assert.equal(calendar.leadingBlanks, firstWeekday);
  assert.equal(calendar.cells.length, HEATMAP_DAYS + firstWeekday);
  assert.equal(calendar.weekCount, 53);
  assert.equal(
    calendar.cells.length <= calendar.weekCount * DAYS_PER_WEEK,
    true
  );
  for (let index = 0; index < firstWeekday; index += 1) {
    assert.equal(calendar.cells[index], null);
  }
  assert.deepEqual(calendar.cells[firstWeekday], {
    date: "2025-09-27",
    totalTokens: 0,
    requests: 0,
  });
  assert.equal(calendar.cells[calendar.cells.length - 1].date, "2026-09-26");
});

test("buildCalendar week count stays at 53 for any alignment", () => {
  for (const end of ["2026-09-20", "2026-09-22", "2026-09-24", "2026-09-26"]) {
    assert.equal(buildCalendar(daysEnding(end, HEATMAP_DAYS)).weekCount, 53);
  }
});

function assertMonthSequence(labels) {
  for (let index = 1; index < labels.length; index += 1) {
    const previous = labels[index - 1];
    const current = labels[index];
    assert.equal(current.weekIndex > previous.weekIndex, true);
    const previousOrder = previous.year * 12 + previous.month;
    const currentOrder = current.year * 12 + current.month;
    assert.equal(currentOrder, previousOrder + 1);
  }
}

test("buildCalendar skips the opening label when it would overlap", () => {
  const calendar = buildCalendar(daysEnding("2026-09-26", HEATMAP_DAYS));

  // 2025-09-27 is a Sunday, so 2025-10-01 lands in column 0; labelling the
  // partial opening month on top of it would overlap, so it is omitted.
  assert.equal(calendar.monthLabels.length, 12);
  assert.deepEqual(calendar.monthLabels[0], {
    weekIndex: 1,
    year: 2025,
    month: 10,
  });
  const last = calendar.monthLabels[calendar.monthLabels.length - 1];
  assert.equal(last.year, 2026);
  assert.equal(last.month, 9);
  assertMonthSequence(calendar.monthLabels);
});

test("buildCalendar labels the opening month when it has room", () => {
  const calendar = buildCalendar(daysEnding("2026-09-01", HEATMAP_DAYS));

  assert.equal(calendar.cells[calendar.leadingBlanks].date, "2025-09-02");
  assert.equal(calendar.monthLabels.length, 13);
  assert.deepEqual(calendar.monthLabels[0], {
    weekIndex: 0,
    year: 2025,
    month: 9,
  });
  assert.equal(calendar.monthLabels[1].month, 10);
  assert.equal(calendar.monthLabels[1].weekIndex >= 3, true);
  const last = calendar.monthLabels[calendar.monthLabels.length - 1];
  assert.equal(last.year, 2026);
  assert.equal(last.month, 9);
  assertMonthSequence(calendar.monthLabels);
});

test("buildCalendar does not duplicate the label when day one starts the window", () => {
  const calendar = buildCalendar(daysEnding("2026-08-31", HEATMAP_DAYS));

  assert.equal(calendar.cells[calendar.leadingBlanks].date, "2025-09-01");
  const septemberLabels = calendar.monthLabels.filter(
    (label) => label.year === 2025 && label.month === 9
  );
  assert.equal(septemberLabels.length, 1);
  assert.equal(septemberLabels[0].weekIndex, 0);
});

test("buildCalendar handles empty and malformed input", () => {
  assert.deepEqual(buildCalendar([]), {
    cells: [],
    weekCount: 0,
    leadingBlanks: 0,
    monthLabels: [],
  });
  assert.deepEqual(buildCalendar(null).cells, []);
  assert.deepEqual(buildCalendar([{ date: "nope" }, null, {}]).cells, []);

  const mixed = buildCalendar([
    { date: "bad" },
    { date: "2026-09-26", totalTokens: "12", requests: 2 },
  ]);
  assert.equal(mixed.cells.length, 1 + new Date(2026, 8, 26).getDay());
  assert.equal(mixed.cells[mixed.cells.length - 1].totalTokens, 12);
});

test("computeThresholds picks quartiles over non-zero values", () => {
  assert.deepEqual(computeThresholds([]), [0, 0, 0]);
  assert.deepEqual(computeThresholds([0, 0, 0]), [0, 0, 0]);
  assert.deepEqual(computeThresholds([7]), [7, 7, 7]);
  assert.deepEqual(computeThresholds([40, 10, 0, 30, 20]), [10, 20, 30]);
  assert.deepEqual(computeThresholds([5, 5, 5, 5, 100]), [5, 5, 5]);
});

test("levelFor maps values onto five levels", () => {
  const thresholds = [10, 20, 30];
  assert.equal(levelFor(0, thresholds), 0);
  assert.equal(levelFor(-5, thresholds), 0);
  assert.equal(levelFor(5, thresholds), 1);
  assert.equal(levelFor(10, thresholds), 2);
  assert.equal(levelFor(15, thresholds), 2);
  assert.equal(levelFor(20, thresholds), 3);
  assert.equal(levelFor(29, thresholds), 3);
  assert.equal(levelFor(30, thresholds), 4);
  assert.equal(levelFor(100, thresholds), 4);

  // All-zero history: any positive value lands on the top level.
  assert.equal(levelFor(1, [0, 0, 0]), 4);
  // Single-sample history collapses the quartiles but stays stable.
  assert.equal(levelFor(7, [7, 7, 7]), 4);
});
