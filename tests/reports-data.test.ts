import { describe, expect, it } from "vitest";
import {
  agingCounts,
  forecastAccuracySeries,
  monthsFromEvents,
} from "@/lib/reports-data";

// Session-10 pins: the pure derivations behind the reports tabs 2–4
// re-mirror. Every expected value below was extracted from the live
// reference DOM (zero-data state) or is a worked example computed by hand
// from the definition — never recomputed the way the code does it
// (tautology guard).

describe("agingCounts — the reference's tab-2 fixed 4-bucket list", () => {
  it("buckets open leads by days since last update into the 4 fixed labels", () => {
    // Worked example: ages 5, 40, 75, 120 days → exactly one per bucket.
    const now = new Date("2026-09-30T12:00:00Z").getTime();
    const daysAgo = (d: number) => new Date(now - d * 86_400_000);
    const rows = [
      { updatedAt: daysAgo(5), createdAt: daysAgo(5) },
      { updatedAt: daysAgo(40), createdAt: daysAgo(40) },
      { updatedAt: daysAgo(75), createdAt: daysAgo(75) },
      { updatedAt: daysAgo(120), createdAt: daysAgo(120) },
    ];
    expect(agingCounts(rows, now)).toEqual([
      { label: "<30 days", count: 1 },
      { label: "30-60 days", count: 1 },
      { label: "60-90 days", count: 1 },
      { label: ">90 days", count: 1 },
    ]);
  });

  it("treats missing updatedAt as createdAt, and zero rows keep all 4 buckets at 0", () => {
    // The reference renders 4 bar rects at zero data — the bucket list is
    // FIXED, not row-derived.
    const now = 1_800_000_000_000;
    expect(agingCounts([], now)).toEqual([
      { label: "<30 days", count: 0 },
      { label: "30-60 days", count: 0 },
      { label: "60-90 days", count: 0 },
      { label: ">90 days", count: 0 },
    ]);
    const rows = [{ updatedAt: null, createdAt: new Date(now - 10 * 86_400_000) }];
    expect(agingCounts(rows, now)[0]).toEqual({ label: "<30 days", count: 1 });
  });
});

describe("forecastAccuracySeries — the Average Accuracy caption + line", () => {
  it("computes per-month accuracy and the average (worked example)", () => {
    // Definition: per month, accuracy = forecast > 0
    //   ? max(0, 100 - |actual - forecast| / forecast * 100)
    //   : 0  (no forecast → no credit; matches the reference's 0% at zero)
    // Worked example: months with (forecast 100, actual 90) → 90%;
    // (forecast 100, actual 30) → 30%; (forecast 0, actual 0) → 0%.
    // Average = (90 + 30 + 0) / 3 = 40.
    const series = forecastAccuracySeries([
      { month: "Jul", forecast: 100, actual: 90 },
      { month: "Aug", forecast: 100, actual: 30 },
      { month: "Sep", forecast: 0, actual: 0 },
    ]);
    expect(series.points).toEqual([
      { month: "Jul", accuracy: 90 },
      { month: "Aug", accuracy: 30 },
      { month: "Sep", accuracy: 0 },
    ]);
    expect(series.average).toBe(40);
  });

  it("the zero-data state averages to 0 (the reference caption reads Average Accuracy: 0%)", () => {
    const empty = forecastAccuracySeries([]);
    expect(empty.points).toEqual([]);
    expect(empty.average).toBe(0);
  });
});

describe("monthsFromEvents — row-derived month series (no ticks at zero)", () => {
  it("returns one entry per distinct closed month, ordered, with per-month rollups", () => {
    // Worked example: closed events in Mar(2), May(1) → series
    // [{month:"Mar",won:2},{month:"May",won:1}] — the months PRESENT only,
    // which is why the reference renders no month ticks at zero data.
    const events = [
      { closedAt: new Date("2026-03-05"), createdAt: new Date("2026-03-05"), value: 10 },
      { closedAt: new Date("2026-03-25"), createdAt: new Date("2026-03-25"), value: 20 },
      { closedAt: new Date("2026-05-02"), createdAt: new Date("2026-05-02"), value: 30 },
    ];
    expect(monthsFromEvents(events)).toEqual([
      { month: "Mar", count: 2, value: 30 },
      { month: "May", count: 1, value: 30 },
    ]);
  });

  it("empty input yields an EMPTY series (the reference's tab-1 charts show no ticks at zero)", () => {
    expect(monthsFromEvents([])).toEqual([]);
  });

  it("falls back to createdAt when closedAt is null", () => {
    const events = [{ closedAt: null, createdAt: new Date("2026-07-19"), value: 5 }];
    expect(monthsFromEvents(events)).toEqual([{ month: "Jul", count: 1, value: 5 }]);
  });
});
