import { describe, expect, it } from "vitest";
import {
  formatCurrency,
  formatCompactCurrency,
  formatDate,
  formatTime,
  timeAgo,
  timeUntil,
  isSameDay,
  calendarGrid,
  addMonths,
  startOfMonth,
  avgDaysBetween,
  percentDelta,
  toLocalInputValue,
} from "@/lib/format";

describe("currency formatting", () => {
  it("formats plain amounts with the reference dollar style", () => {
    expect(formatCurrency(12500)).toBe("$12,500");
    expect(formatCurrency(0)).toBe("$0");
  });

  it("keeps negatives signed", () => {
    expect(formatCurrency(-1250)).toBe("-$1,250");
  });

  it("compacts thousands and millions like the reference ($0.0k / $8.2M)", () => {
    expect(formatCompactCurrency(145_000)).toBe("$145.0k");
    expect(formatCompactCurrency(1_400_000)).toBe("$1.4M");
    expect(formatCompactCurrency(950)).toBe("$950");
    expect(formatCompactCurrency(0)).toBe("$0");
  });

  it("handles null/undefined as zero", () => {
    expect(formatCompactCurrency(null)).toBe("$0");
    expect(formatCurrency(undefined)).toBe("$0");
  });

  it("uses lowercase k and uppercase M at the exact boundaries", () => {
    expect(formatCompactCurrency(1_000)).toBe("$1.0k");
    expect(formatCompactCurrency(999)).toBe("$999");
    expect(formatCompactCurrency(1_000_000)).toBe("$1.0M");
  });
});

describe("date formatting", () => {
  const mar4 = new Date(2026, 2, 4, 15, 30);

  it("formats a long date", () => {
    expect(formatDate(mar4)).toBe("Mar 4, 2026");
  });

  it("formats time in 12h clock", () => {
    expect(formatTime(mar4)).toBe("3:30 PM");
    expect(formatTime(new Date(2026, 2, 4, 0, 5))).toBe("12:05 AM");
  });

  it("renders em-dashes for missing dates", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatTime(undefined)).toBe("—");
  });

  it("recognizes same-calendar-day timestamps", () => {
    expect(isSameDay(mar4, new Date(2026, 2, 4, 23, 59))).toBe(true);
    expect(isSameDay(mar4, new Date(2026, 2, 5))).toBe(false);
  });

  it("adds months with end-of-month clamping", () => {
    const jan31 = new Date(2026, 0, 31);
    const feb = addMonths(jan31, 1);
    expect(feb.getMonth()).toBe(1);
    expect(feb.getDate()).toBe(28); // 2026 is not a leap year
  });

  it("startOfMonth pins to day 1", () => {
    const s = startOfMonth(mar4);
    expect(s.getDate()).toBe(1);
    expect(s.getHours()).toBe(0);
  });
});

describe("relative time", () => {
  const now = new Date(2026, 8, 29, 12, 0).getTime();

  it("labels the recent past", () => {
    expect(timeAgo(new Date(now - 30_000), now)).toBe("just now");
    expect(timeAgo(new Date(now - 5 * 60_000), now)).toBe("5m ago");
    expect(timeAgo(new Date(now - 3 * 3_600_000), now)).toBe("3h ago");
    expect(timeAgo(new Date(now - 2 * 86_400_000), now)).toBe("2d ago");
  });

  it("labels the near future", () => {
    expect(timeUntil(new Date(now + 45 * 60_000), now)).toBe("in 45m");
    expect(timeUntil(new Date(now + 5 * 3_600_000), now)).toBe("in 5h");
    expect(timeUntil(new Date(now - 1000), now)).toBe("overdue");
  });
});

describe("calendarGrid", () => {
  it("produces whole weeks anchored on Monday", () => {
    const days = calendarGrid(2026, 8, "monday", true); // Sep 2026
    expect(days[0]).toEqual(new Date(2026, 7, 31)); // Monday Aug 31
    expect(days.length % 7).toBe(0);
    expect(days[0]!.getDay()).toBe(1); // Monday
  });

  it("anchors sunday-first grids like the reference calendar", () => {
    const days = calendarGrid(2026, 8, "sunday", true); // Sep 2026
    // Sep 1 2026 is a Tuesday -> the grid opens on Sunday Aug 30.
    expect(days[0]).toEqual(new Date(2026, 7, 30));
    expect(days[1]).toEqual(new Date(2026, 7, 31));
    expect(days[2]).toEqual(new Date(2026, 8, 1));
    expect(days.length % 7).toBe(0);
    expect(days[0]!.getDay()).toBe(0); // Sunday
  });

  it("starts the grid in the previous month when needed", () => {
    const days = calendarGrid(2026, 8, "monday", true);
    // September 2026 starts on a Tuesday -> Monday-anchored grid starts Mon Aug 31
    expect(days[0]!.getDate()).toBe(31);
    expect(days[0]!.getMonth()).toBe(7);
  });

  it("without leading, starts at the 1st", () => {
    const days = calendarGrid(2026, 8, "monday", false);
    expect(days[0]!.getDate()).toBe(1);
    expect(days[0]!.getMonth()).toBe(8);
  });
});

describe("analytics helpers", () => {
  it("averages day-differences", () => {
    const a = avgDaysBetween(
      [new Date(2026, 0, 1), new Date(2026, 0, 11)],
      [new Date(2026, 0, 11), new Date(2026, 0, 31)],
    );
    expect(a).toBe(15);
  });

  it("returns 0 for mismatched inputs", () => {
    expect(avgDaysBetween([], [])).toBe(0);
    expect(avgDaysBetween([new Date()], [])).toBe(0);
  });

  it("computes percent deltas with null for divide-by-zero", () => {
    expect(percentDelta(110, 100)).toBeCloseTo(10);
    expect(percentDelta(0, 0)).toBe(0);
    expect(percentDelta(50, 0)).toBeNull();
  });

  it("serializes local datetime input values", () => {
    const v = toLocalInputValue(new Date(2026, 8, 29, 14, 5));
    expect(v).toBe("2026-09-29T14:05");
    expect(toLocalInputValue(null)).toBe("");
  });
});
