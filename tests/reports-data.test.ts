import { describe, expect, it } from "vitest";
import {
  agingCounts,
  countByMonth,
  dealsAtRiskRows,
  forecastAccuracySeries,
  pipelineStageCounts,
  revenueByMonth,
  wonLostByMonth,
} from "@/lib/reports-data";

// Session-31 pins: the pure derivations behind the reports tabs, rewritten
// to the bundle-decoded OPPORTUNITY model (index-DZ-xbrIm.js — the cCe/ZEe/
// e3e/t3e/r3e tab components all take filteredOpportunities). Every expected
// value below is a worked example computed by hand from the decoded
// definitions — never recomputed the way the code does it (tautology guard).
//
// The s10-era seams retired this session: monthsFromEvents (sorted, "MMM"
// keys, createdAt fallback) — the reference groups by close_date ONLY, in
// INSERTION order (its rows list -created_date, so months appear newest
// first — an unsorted-Object.entries quirk, mirrored), with "MMM yyyy"
// month keys (Tc(date, "MMM yyyy")); forecastAccuracySeries's clamped
// 100−|diff| formula — the reference divides actual/forecasted where
// forecasted = amount × (probability||50)/100; agingCounts's updatedAt
// basis — the reference ages by created_date; and the stage-weight
// probability proxy — the reference bands by the opp's own probability.

const DAY = 86_400_000;

describe("monthKey format — the reference's Tc(date, \"MMM yyyy\")", () => {
  it("countByMonth groups rows by close/activity date in INSERTION order (newest rows first)", () => {
    // Rows arrive -created_date (newest first); the reference's plain-object
    // grouping keeps FIRST-SEEN order — the chart ticks run newest → oldest.
    const rows = [
      { date: new Date("2026-09-15T00:00:00Z") },
      { date: new Date("2026-09-02T00:00:00Z") },
      { date: new Date("2026-07-20T00:00:00Z") },
      { date: null },
    ];
    expect(countByMonth(rows)).toEqual([
      { month: "Sep 2026", count: 2 },
      { month: "Jul 2026", count: 1 },
    ]);
  });

  it("empty input yields the empty series (no month ticks at zero data)", () => {
    expect(countByMonth([])).toEqual([]);
  });
});

describe("pipelineStageCounts — the 8-slug funnel SPLIT (leads + opportunities)", () => {
  it("concatenates the leads' new/contacted/qualified + the opps' five stages", () => {
    // The s10 "merged-list double-report" reading DISPROVEN by the bundle:
    // p = ["new","contacted","qualified"].map(count by LEAD status),
    // m = ["prospecting","qualification","proposal","negotiation",
    // "closed_won"].map(count by OPP stage), return [...p, ...m].
    const leads = [
      { stage: "new" }, { stage: "new" }, { stage: "contacted" },
      { stage: "qualified" }, { stage: "won" }, { stage: "lost" },
    ];
    const opps = [
      { stage: "prospecting" }, { stage: "prospecting" },
      { stage: "qualification" }, { stage: "proposal" },
      { stage: "negotiation" }, { stage: "closed_won" }, { stage: "closed_lost" },
    ];
    expect(pipelineStageCounts(leads, opps)).toEqual([
      { slug: "new", count: 2 },
      { slug: "contacted", count: 1 },
      { slug: "qualified", count: 1 },
      { slug: "prospecting", count: 2 },
      { slug: "qualification", count: 1 },
      { slug: "proposal", count: 1 },
      { slug: "negotiation", count: 1 },
      { slug: "closed_won", count: 1 },
    ]);
  });

  it("won/lost LEADS do not leak into the funnel (they are not funnel stages)", () => {
    const leads = [{ stage: "won" }, { stage: "lost" }];
    expect(pipelineStageCounts(leads, [])).toEqual([
      { slug: "new", count: 0 },
      { slug: "contacted", count: 0 },
      { slug: "qualified", count: 0 },
      { slug: "prospecting", count: 0 },
      { slug: "qualification", count: 0 },
      { slug: "proposal", count: 0 },
      { slug: "negotiation", count: 0 },
      { slug: "closed_won", count: 0 },
    ]);
  });
});

describe("revenueByMonth / wonLostByMonth — the close_date month series", () => {
  const closedOpps = [
    { closeDate: new Date("2026-09-10T00:00:00Z"), amount: 100_000, stage: "closed_won" },
    { closeDate: new Date("2026-09-25T00:00:00Z"), amount: 37_000, stage: "closed_lost" },
    { closeDate: new Date("2026-08-14T00:00:00Z"), amount: 50_000, stage: "closed_won" },
    { closeDate: null, amount: 999, stage: "closed_won" }, // no close date → skipped
  ];

  it("revenueByMonth sums WON amounts per close month (insertion order)", () => {
    expect(revenueByMonth(closedOpps.filter((o) => o.stage === "closed_won"))).toEqual([
      { month: "Sep 2026", revenue: 100_000 },
      { month: "Aug 2026", revenue: 50_000 },
    ]);
  });

  it("wonLostByMonth counts won/lost per close month (insertion order)", () => {
    expect(wonLostByMonth(closedOpps)).toEqual([
      { month: "Sep 2026", won: 1, lost: 1 },
      { month: "Aug 2026", won: 1, lost: 0 },
    ]);
  });
});

describe("agingCounts — created_date age into the fixed 4 buckets", () => {
  it("buckets OPEN OPPORTUNITIES by days since createdAt (NOT updatedAt)", () => {
    // Worked example: ages 5, 40, 75, 120 days → exactly one per bucket.
    const now = new Date("2026-10-02T12:00:00Z").getTime();
    const rows = [5, 40, 75, 120].map((d) => ({ createdAt: new Date(now - d * DAY) }));
    expect(agingCounts(rows, now)).toEqual([
      { label: "<30 days", count: 1 },
      { label: "30-60 days", count: 1 },
      { label: "60-90 days", count: 1 },
      { label: ">90 days", count: 1 },
    ]);
  });

  it("zero rows keep all 4 buckets at 0 (the fixed list, not row-derived)", () => {
    expect(agingCounts([], 1_800_000_000_000).map((b) => b.count)).toEqual([0, 0, 0, 0]);
  });
});

describe("forecastAccuracySeries — the reference's actual/forecasted formula", () => {
  const mk = (
    closeDate: string,
    amount: number,
    probability: number | null,
    stage: "closed_won" | "closed_lost",
  ) => ({ closeDate: new Date(closeDate), createdAt: new Date("2026-01-01T00:00:00Z"), amount, probability, stage });

  it("forecasted = amount × (probability||50)/100; actual = won amounts; accuracy = actual/forecasted", () => {
    // Worked example, one month:
    //   opp A (won, 100k, 80%):  forecasted 80k, actual 100k
    //   opp B (lost, 60k, null): forecasted 30k (50 fallback), actual 0
    //   month: forecasted 110k, actual 100k, accuracy (100/110*100).toFixed(1) = "90.9"
    const { points, average } = forecastAccuracySeries([
      mk("2026-09-10T00:00:00Z", 100_000, 80, "closed_won"),
      mk("2026-09-20T00:00:00Z", 60_000, null, "closed_lost"),
    ]);
    expect(points).toEqual([
      { month: "Sep 2026", forecasted: 110_000, actual: 100_000, accuracy: "90.9" },
    ]);
    expect(average).toBe("90.9");
  });

  it("a month with zero forecasted carries accuracy 0 (no division by zero)", () => {
    const { points, average } = forecastAccuracySeries([
      mk("2026-08-05T00:00:00Z", 0, 0, "closed_lost"),
    ]);
    expect(points[0]).toMatchObject({ month: "Aug 2026", forecasted: 0, actual: 0, accuracy: 0 });
    // One point at accuracy 0 → the mean is (0/1).toFixed(1) = "0.0" — the
    // reference's toFixed(1) chain; only the ZERO-POINTS case returns the
    // bare 0.
    expect(average).toBe("0.0");
  });

  it("the average is the mean of the PARSED per-month accuracies", () => {
    // Two months: 90.9 and 0 → average (90.9 + 0)/2 = 45.45 → "45.5"
    // (toFixed(1) on the mean — the reference's reduce/length).toFixed(1).
    const { average } = forecastAccuracySeries([
      mk("2026-09-10T00:00:00Z", 100_000, 80, "closed_won"),
      mk("2026-09-20T00:00:00Z", 60_000, null, "closed_lost"),
      mk("2026-08-05T00:00:00Z", 0, 0, "closed_lost"),
    ]);
    expect(average).toBe("45.5");
  });

  it("zero closed opps → empty points + average 0 (the caption reads 0% at zero data)", () => {
    const { points, average } = forecastAccuracySeries([]);
    expect(points).toEqual([]);
    expect(average).toBe("0");
  });
});

describe("dealsAtRiskRows — the last-related-activity join (>14 days or never)", () => {
  const now = new Date("2026-10-02T12:00:00Z").getTime();

  const opps = [
    { id: "o1", name: "Fresh deal", accountName: "Acme", amount: 10 },
    { id: "o2", name: "Stale deal", accountName: "Beta", amount: 20 },
    { id: "o3", name: "No-activity deal", accountName: "Gamma", amount: 30 },
  ];

  const activities = [
    // o1: activity 2 days ago → NOT at risk
    { relatedType: "Opportunity", relatedName: "Fresh deal", date: new Date(now - 2 * DAY) },
    // o2: activity 30 days ago → at risk
    { relatedType: "Opportunity", relatedName: "Stale deal", date: new Date(now - 30 * DAY) },
    // an unrelated activity type must not join
    { relatedType: "Contact", relatedName: "Stale deal", date: new Date(now - 1 * DAY) },
  ];

  it("flags open opps whose LAST Opportunity-linked activity is >14 days old", () => {
    const rows = dealsAtRiskRows(opps, activities, now);
    expect(rows.map((r) => r.deal)).toEqual(["Stale deal", "No-activity deal"]);
    expect(rows[0]).toEqual({ id: "o2", deal: "Stale deal", account: "Beta", amount: 20 });
  });

  it("caps the rows at 20 (the reference's slice(0,20))", () => {
    const many = Array.from({ length: 25 }, (_, i) => ({
      id: `o${i}`, name: `Deal ${i}`, accountName: `A${i}`, amount: i,
    }));
    expect(dealsAtRiskRows(many, [], now)).toHaveLength(20);
  });

  it("a 15-day-old activity IS at risk (strictly >14 — the boundary)", () => {
    const rows = dealsAtRiskRows(
      [{ id: "x", name: "Edge", accountName: "A", amount: 1 }],
      [{ relatedType: "Opportunity", relatedName: "Edge", date: new Date(now - 15 * DAY) }],
      now,
    );
    expect(rows).toHaveLength(1);
    const rows14 = dealsAtRiskRows(
      [{ id: "x", name: "Edge", accountName: "A", amount: 1 }],
      [{ relatedType: "Opportunity", relatedName: "Edge", date: new Date(now - 14 * DAY) }],
      now,
    );
    expect(rows14).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Session-41 (S41-P3): the relatedType case-insensitive join. The
// Activity/Event dialogs send LOWERCASE related types ("opportunity" —
// ACTIVITY_RELATED_OPTIONS), the seed stores capitalized "Opportunity",
// and the join was case-SENSITIVE: a UI-logged "Related To: Opportunity"
// activity never joined the Deals at Risk table. The reference joins on
// a real FK (related_to_id), so its UI-created activities always join.
// ---------------------------------------------------------------------------

describe("session-41: the relatedType case-insensitive join (S41-P3 — UI-created activities join)", () => {
  const now = new Date("2026-10-02T12:00:00Z").getTime();
  const opps = [{ id: "o1", name: "Fresh deal", accountName: "Acme", amount: 10 }];

  it("a LOWERCASE \"opportunity\" activity joins the at-risk computation (the UI's vocabulary)", () => {
    const rows = dealsAtRiskRows(
      opps,
      [{ relatedType: "opportunity", relatedName: "Fresh deal", date: new Date(now - 2 * DAY) }],
      now,
    );
    expect(rows).toHaveLength(0); // the fresh lowercase activity keeps the deal healthy
    const stale = dealsAtRiskRows(
      [{ id: "o2", name: "Stale", accountName: "B", amount: 1 }],
      [{ relatedType: "opportunity", relatedName: "Stale", date: new Date(now - 30 * DAY) }],
      now,
    );
    expect(stale.map((r) => r.deal)).toEqual(["Stale"]); // and a stale one flags it
  });

  it("ANY casing joins (\"OPPORTUNITY\" too) — the seeded \"Opportunity\" rows unchanged", () => {
    const rows = dealsAtRiskRows(
      opps,
      [{ relatedType: "OPPORTUNITY", relatedName: "Fresh deal", date: new Date(now - 2 * DAY) }],
      now,
    );
    expect(rows).toHaveLength(0);
    const seeded = dealsAtRiskRows(
      opps,
      [{ relatedType: "Opportunity", relatedName: "Fresh deal", date: new Date(now - 2 * DAY) }],
      now,
    );
    expect(seeded).toHaveLength(0);
  });
});
