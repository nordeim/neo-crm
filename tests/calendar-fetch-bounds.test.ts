import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-51 pins (S51-P1): the calendar window + KPI-baseline
// consistency family.
//
// P1a — the N-51a fetch-window fix. The month-flip effect in
// calendar-page.tsx built its window as [prev-month 1st, CURRENT-MONTH
// END] (`endOfDay(new Date(year, month + 1, 0))`), but the rendered
// grid is the Sunday-anchored calendarGrid TRIMMED to whole weeks — its
// TRAILING cells extend up to 6 days into the NEXT month (worked
// example: Nov 2026 → lead 0, 30 days, 5 weeks → Dec 1-5 rendered).
// After a month flip the s45 last-call-wins token makes the windowed
// fetch authoritative, so events on those trailing days VANISHED from
// the cells that render them (the leading side was over-covered by a
// full prev month — the asymmetry was the tell). The fix extracts the
// window into the pure seam `calendarFetchBounds(year, month)` in
// src/lib/format.ts: `from` keeps the deliberate full-prev-month
// over-coverage; `to` covers the UNTRIMMED 42-cell grid's last day —
// always >= the trimmed render's last day, so the trailing cells are
// always inside the window and the bound survives future changes to
// the page's trim.
//
// P1b — the N-51b KPI-baseline fix. The four TrendStatCards' trends
// mixed populations: the CURRENT sides read `visible` (the filtered
// set) while the BASELINE sides read raw `events` — with a filter
// active the delta compared a filtered current against an unfiltered
// baseline (a pseudo-delta). Both sides now read `visible`; with no
// filters visible === events, so the pinned no-filter behavior is
// byte-identical. The "Total Events" pseudo-delta (`+${visible.length}`)
// is the reference's own quirk — untouched, guarded below.
//
// The behavioral pins import the seam DYNAMICALLY so each it fails
// individually on pre-fix HEAD (clean RED arithmetic); the
// source-structure pins read the page source (the s50 idiom).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const page = () => stripComments(read("src/app/(app)/calendar/calendar-page.tsx") ?? "");
const format = () => stripComments(read("src/lib/format.ts") ?? "");

// Slice a region between two anchors (the house idiom — the region is
// stable under unrelated edits elsewhere in the file).
function region(src: string, start: string, end: string): string {
  const i = src.indexOf(start);
  expect(i, `anchor not found: ${start}`).toBeGreaterThan(-1);
  const j = src.indexOf(end, i);
  expect(j, `end anchor not found after ${start}: ${end}`).toBeGreaterThan(-1);
  return src.slice(i, j);
}

describe("session-51: the calendar fetch window covers the rendered grid (N-51a)", () => {
  it("calendarFetchBounds covers the trailing next-month cells (Nov 2026 → Dec 5)", async () => {
    const { calendarFetchBounds, endOfDay } = await import("@/lib/format");
    const { from, to } = calendarFetchBounds(2026, 10); // November 2026
    // The UNTRIMMED 42-cell Sunday-anchored grid: Nov 1 2026 is a
    // Sunday, so the grid runs Nov 1 .. Dec 12 (42nd cell).
    expect(to).toBe(endOfDay(new Date(2026, 11, 12)).toISOString());
    // The trimmed render for Nov 2026: lead 0 + 30 days → 5 weeks →
    // the grid SHOWS through Dec 5 — the trailing-cell coverage floor.
    expect(new Date(to).getTime()).toBeGreaterThanOrEqual(endOfDay(new Date(2026, 11, 5)).getTime());
    // The leading side keeps the deliberate full-prev-month coverage.
    expect(from).toBe(new Date(2026, 9, 1).toISOString());
  });

  it("calendarFetchBounds covers a zero-trailing month (Oct 2026 → Oct 31)", async () => {
    const { calendarFetchBounds, endOfDay } = await import("@/lib/format");
    const { from, to } = calendarFetchBounds(2026, 9); // October 2026
    // Oct 1 2026 is a Thursday → the Sunday-anchored grid starts
    // Sep 27; the untrimmed 42nd cell is Nov 7.
    expect(to).toBe(endOfDay(new Date(2026, 10, 7)).toISOString());
    // The trimmed render ends Oct 31 (lead 4 + 31 days = exactly
    // 5 weeks) — zero trailing cells, but the bound still covers it.
    expect(new Date(to).getTime()).toBeGreaterThanOrEqual(endOfDay(new Date(2026, 9, 31)).getTime());
    expect(from).toBe(new Date(2026, 8, 1).toISOString()); // Sep 1
  });

  it("the page's month-flip effect derives its window from the seam (no month-end form)", () => {
    const src = page();
    const effect = region(src, "React.useEffect(() => {", "const activeTypes");
    expect(effect).toContain("calendarFetchBounds(");
    // The OLD form — the current-month-end bound that lost the
    // trailing cells — must be gone from the effect.
    expect(effect).not.toContain("month + 1, 0");
    expect(effect).toContain("fetchEvents(from, to)");
  });

  it("the KPI values read the RAW events array (N-51b superseded s76 — the statics + the raw basis)", () => {
    const src = page();
    const kpi = region(src, "const todaysEvents", "function openNewEvent");
    // Session-51 (N-51b): the baselines moved off raw `events` onto
    // `visible` so both sides of every trend measured the same
    // population. Session-76 (M-76c6 + L-76c3, bundle-decoded from Mx/
    // jAe): the reference ships STATIC trend texts (+3/+34/+2/+3) and
    // computes ALL FOUR values on the RAW events array (its $ memo
    // reads `p`, not the filtered set) — the baseline memos retired
    // with the statics, and the cards stay put under filters.
    expect(kpi).not.toContain("yesterdaysEvents");
    expect(kpi).not.toContain("meetingsLastWeek");
    expect(kpi).not.toContain("callsLastWeek");
    expect(kpi).toMatch(/const todaysEvents = events\.filter/);
    expect(kpi).toMatch(/const meetingsThisWeek = events\.filter/);
    expect(kpi).toMatch(/const callsThisWeek = events\.filter/);
  });

  it("GUARD: the neighbors unchanged — the seam, the quirks, the verb (s76 re-anchor)", () => {
    // calendarGrid keeps the 42-cell leading form + the monday default.
    const lib = format();
    expect(lib).toContain("total = leading ? 42 :");
    expect(lib).toMatch(/firstDay: "monday" \| "sunday" = "monday"/);
    const src = page();
    // Session-76 (M-76c8): the page now renders the UNTRIMMED grid
    // (the reference's always-42 construction — the whole-week trim
    // and its Math.max/ceil/slice machinery retired); the seam call is
    // still the sunday-anchored leading form, now consumed whole.
    expect(src).toContain('calendarGrid(year, month, "sunday", true)');
    expect(src).not.toMatch(/Math\.max\(Math\.ceil\(\(lead/);
    // Session-76 (M-76c6): the Total Events pseudo-delta + the trend()
    // helper retired with the statics (CALENDAR_KPI_STATICS).
    expect(src).not.toContain("trend={`+${visible.length}`}");
    expect(src).not.toMatch(/const trend = \(current: number, previous: number\)/);
    // The store verb's call shape is unchanged.
    expect(src).toContain("fetchEvents(from, to)");
  });
});
