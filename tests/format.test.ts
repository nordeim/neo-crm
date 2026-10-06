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
  startOfMonth,
  startOfDay,
  endOfDay,
  addDays,
  startOfWeek,
  startOfYear,
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

  // Session-5 DOM-verified per-page variants: the reports page renders an
  // UPPERCASE-K compact form — its zero-state KPIs show "$0.0K" (won, one
  // decimal) and "$0K" (lost, zero decimals) while the dashboard shows
  // "$0.0k" lowercase.
  it("supports the reports uppercase-K variant (1 decimal won / 0 decimals lost)", () => {
    expect(formatCompactCurrency(687_000, { upper: true })).toBe("$687.0K");
    expect(formatCompactCurrency(196_000, { upper: true, decimals: 0 })).toBe("$196K");
    expect(formatCompactCurrency(0, { upper: true, decimals: 0 })).toBe("$0K");
    expect(formatCompactCurrency(0, { upper: true })).toBe("$0.0K");
    expect(formatCompactCurrency(1_400_000, { upper: true })).toBe("$1.4M");
  });

  it("keeps the dashboard lowercase default unchanged when options are passed", () => {
    expect(formatCompactCurrency(542_000, { decimals: 1 })).toBe("$542.0k");
    expect(formatCompactCurrency(542_000)).toBe("$542.0k");
  });
});

// ---------------------------------------------------------------------------
// Session-32 (S32-P1): the FIXED-SCALE variants — the reference renders
// every dashboard/accounts currency figure through a LITERAL scale formula,
// never a magnitude-branching formatter. The bundle (index-DZ-xbrIm.js):
//   dashboard Deals Closed / Revenue This Month: `$${(v/1e3).toFixed(1)}k`
//   dashboard Sales Target:                      `$${(v/1e3).toFixed(0)}k`
//   accounts Total Revenue KPI + revenue cells:  `$${(v/1e6).toFixed(1)}M`
// The `scale` option mirrors those literals at ANY magnitude — "$0.0k" and
// "$1400.0k" are BOTH valid k-scale outputs; "$0.0M" and "$0.9M" are BOTH
// valid M-scale outputs. The no-scale default keeps the legacy
// magnitude-branching behavior (the topbar hint + the s1-s24 pins).
// ---------------------------------------------------------------------------

describe("session-32: the fixed-scale currency variants (S32-P1)", () => {
  it("scale 'k' mirrors the dashboard's literal /1e3 formula at ANY magnitude", () => {
    // Deals Closed / Revenue This Month: toFixed(1) — note 950/1e3 is
    // 0.95 in float → "0.9" (the literal formula's own behavior).
    expect(formatCompactCurrency(0, { scale: "k" })).toBe("$0.0k");
    expect(formatCompactCurrency(950, { scale: "k" })).toBe("$0.9k");
    expect(formatCompactCurrency(337_000, { scale: "k" })).toBe("$337.0k");
    expect(formatCompactCurrency(1_400_000, { scale: "k" })).toBe("$1400.0k");
  });

  it("scale 'k' with decimals 0 mirrors the Sales Target formula ($0k)", () => {
    expect(formatCompactCurrency(0, { scale: "k", decimals: 0 })).toBe("$0k");
    expect(formatCompactCurrency(50_000, { scale: "k", decimals: 0 })).toBe("$50k");
    expect(formatCompactCurrency(153_000, { scale: "k", decimals: 0 })).toBe("$153k");
  });

  it("scale 'M' mirrors the accounts' literal /1e6 formula at ANY magnitude", () => {
    expect(formatCompactCurrency(0, { scale: "M" })).toBe("$0.0M");
    expect(formatCompactCurrency(500_000, { scale: "M" })).toBe("$0.5M");
    expect(formatCompactCurrency(900_000, { scale: "M" })).toBe("$0.9M");
    expect(formatCompactCurrency(77_500_000, { scale: "M" })).toBe("$77.5M");
  });

  it("the scale variants keep negatives signed and null as zero", () => {
    expect(formatCompactCurrency(-337_000, { scale: "k" })).toBe("-$337.0k");
    expect(formatCompactCurrency(null, { scale: "M" })).toBe("$0.0M");
  });

  it("the no-scale default keeps the legacy magnitude branching (the topbar hint)", () => {
    expect(formatCompactCurrency(950)).toBe("$950");
    expect(formatCompactCurrency(1_400_000)).toBe("$1.4M");
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

// Session-55 (S55-P2, N-55b): the "analytics helpers" describe retired
// with its dead subject — avgDaysBetween + percentDelta were TEST-ONLY
// (the live derivations are the leads-page inline avgCycle + the
// dashboard's hardcoded KPI_STATICS deltas). Only the live
// toLocalInputValue it survives, re-homed below.

describe("local datetime input values", () => {
  it("serializes local datetime input values", () => {
    const v = toLocalInputValue(new Date(2026, 8, 29, 14, 5));
    expect(v).toBe("2026-09-29T14:05");
    expect(toLocalInputValue(null)).toBe("");
  });
});

// Session-68 (N-68b/N-68e): the reports fixed-scale window pinned at
// the UPPERCASE-K forms + the previously-unpinned production-reachable
// arms of the relative-time and startOf* families (the 68-c rotation's
// coverage closures). The formatter itself is unchanged — these pins
// guard the working behavior the new reports call-sites rely on.
describe("session-68: the reports K-scale window + the relative-time/startOf coverage", () => {
  it("the reports Won form: upper K at ANY magnitude (the reference's literal /1e3 + toFixed(1))", () => {
    expect(formatCompactCurrency(0, { scale: "k", upper: true })).toBe("$0.0K");
    expect(formatCompactCurrency(950, { scale: "k", upper: true })).toBe("$0.9K");
    expect(formatCompactCurrency(2_400, { scale: "k", upper: true })).toBe("$2.4K");
    // negatives stay signed
    expect(formatCompactCurrency(-950, { scale: "k", upper: true })).toBe("-$0.9K");
  });

  it("the reports Lost form: upper K, zero decimals (the literal /1e3 + toFixed(0))", () => {
    expect(formatCompactCurrency(0, { scale: "k", upper: true, decimals: 0 })).toBe("$0K");
    expect(formatCompactCurrency(950, { scale: "k", upper: true, decimals: 0 })).toBe("$1K");
    // 0.4 rounds down (the literal formula's own toFixed behavior —
    // 0.5 rounds UP to "1", the float-rounding family)
    expect(formatCompactCurrency(400, { scale: "k", upper: true, decimals: 0 })).toBe("$0K");
  });

  it("timeAgo's outer arms: the future 'upcoming' + the >=7d MMM-d fallback", () => {
    const now = new Date(2026, 9, 6, 12, 0).getTime();
    expect(timeAgo(new Date(now + 3_600_000), now)).toBe("upcoming");
    // the arm flips AT 7 days (day < 7): 6 days stays "6d ago"…
    expect(timeAgo(new Date(2026, 9, 6, 12, 0).getTime() - 6 * 86_400_000, now)).toBe("6d ago");
    // …and exactly 7 days back falls through to formatDateShort ("Sep 29",
    // no year) — the boundary the >7d read had wrong before this pin
    expect(timeAgo(new Date(2026, 8, 29, 12, 0), now)).toBe("Sep 29");
    expect(timeAgo(new Date(2026, 8, 28, 12, 0), now)).toBe("Sep 28");
  });

  it("timeUntil's outer arms: the sub-minute 'in 1m' edge + the >=24h 'in Nd' form", () => {
    const now = new Date(2026, 9, 6, 12, 0).getTime();
    expect(timeUntil(new Date(now + 30_000), now)).toBe("in 1m");
    expect(timeUntil(new Date(now + 36 * 3_600_000), now)).toBe("in 1d");
    expect(timeUntil(new Date(now + 2 * 86_400_000), now)).toBe("in 2d");
  });

  it("the startOf* period windows: day/week/month/year boundaries + addDays rollover", () => {
    // Wednesday Oct 7 2026, 15:42:10 (Oct 5 2026 is a Monday)
    const d = new Date(2026, 9, 7, 15, 42, 10);
    expect(startOfDay(d)).toEqual(new Date(2026, 9, 7, 0, 0, 0, 0));
    expect(endOfDay(d)).toEqual(new Date(2026, 9, 7, 23, 59, 59, 999));
    expect(startOfWeek(d)).toEqual(new Date(2026, 9, 5)); // Monday Oct 5
    expect(startOfWeek(d, "sunday")).toEqual(new Date(2026, 9, 4)); // Sunday Oct 4
    expect(startOfMonth(d)).toEqual(new Date(2026, 9, 1));
    // Session-74 (M-74c3): startOfQuarter RETIRED — the reference's
    // "quarter" period is the ROLLING subMonths window (both routes now
    // subMonthsClamped; the behavioral pins live in the session-74
    // parity suite).
    expect(startOfYear(d)).toEqual(new Date(2026, 0, 1));
    expect(addDays(d, 3)).toEqual(new Date(2026, 9, 10, 15, 42, 10));
    expect(addDays(new Date(2026, 9, 31), 1)).toEqual(new Date(2026, 10, 1)); // month rollover
  });
});

