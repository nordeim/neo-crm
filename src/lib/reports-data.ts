import { AGING_BUCKETS } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Session-31 pure derivations for the reports tabs — REWRITTEN to the
// bundle-decoded OPPORTUNITY model (index-DZ-xbrIm.js; the cCe/ZEe/e3e/t3e/
// r3e tab components all take filteredOpportunities). Pinned by
// tests/reports-data.test.ts.
//
// The s10-era seams retired: monthsFromEvents (sorted "MMM" keys with a
// createdAt fallback) — the reference groups by close_date/date ONLY, in
// INSERTION order (its rows list -created_date, so months appear newest
// first — an unsorted Object.entries quirk, mirrored), under "MMM yyyy"
// keys; the clamped 100−|diff| accuracy formula — the reference divides
// actual/forecasted with forecasted = amount × (probability||50)/100; the
// updatedAt aging basis — the reference ages by created_date; and the
// stage-weight probability proxy — the reference bands by the opp's own
// probability.
// ---------------------------------------------------------------------------

/** The reference's month key format: Tc(date, "MMM yyyy") → "Sep 2026". */
export function monthKey(date: Date): string {
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

/**
 * S31: the generic insertion-order month grouping (the reference's plain
 * `{}.forEach` pattern — first-seen order, rows newest-first). Rows without
 * a date are skipped entirely (no createdAt fallback — the reference's
 * `if (p.close_date)` guards).
 */
export function countByMonth(rows: ReadonlyArray<{ date: Date | null }>): Array<{ month: string; count: number }> {
  const byMonth = new Map<string, { month: string; count: number }>();
  for (const r of rows) {
    if (!r.date) continue;
    const key = monthKey(r.date);
    const entry = byMonth.get(key) ?? { month: key, count: 0 };
    entry.count += 1;
    byMonth.set(key, entry);
  }
  return [...byMonth.values()];
}

/**
 * S31: the 8-slug Conversion Funnel SPLIT — the leads' new/contacted/
 * qualified counts (by lead status — our `Lead.stage` carries the
 * reference's lead-status vocabulary) CONCATENATED with the opportunity
 * five-stage counts. The s10 "merged-list double-report" approximation is
 * retired: a new lead is NOT also counted under "prospecting".
 */
export function pipelineStageCounts(
  leads: ReadonlyArray<{ stage: string }>,
  opps: ReadonlyArray<{ stage: string }>,
): Array<{ slug: string; count: number }> {
  const leadCount = (s: string) => leads.filter((l) => l.stage === s).length;
  const oppCount = (s: string) => opps.filter((o) => o.stage === s).length;
  return [
    ...(["new", "contacted", "qualified"] as const).map((s) => ({ slug: s, count: leadCount(s) })),
    ...(["prospecting", "qualification", "proposal", "negotiation", "closed_won"] as const).map((s) => ({
      slug: s,
      count: oppCount(s),
    })),
  ];
}

export interface ClosedOppMonthRow {
  closeDate: Date | null;
  amount: number;
  stage: string;
}

/** S31: the reports tab-1 "Revenue Over Time" series — WON opp amounts per close month. */
export function revenueByMonth(wonOpps: ReadonlyArray<ClosedOppMonthRow>): Array<{ month: string; revenue: number }> {
  const byMonth = new Map<string, { month: string; revenue: number }>();
  for (const o of wonOpps) {
    if (!o.closeDate) continue;
    const key = monthKey(o.closeDate);
    const entry = byMonth.get(key) ?? { month: key, revenue: 0 };
    entry.revenue += o.amount || 0;
    byMonth.set(key, entry);
  }
  return [...byMonth.values()];
}

/** S31: the reports tab-1 "Won vs Lost Over Time" series — counts per close month. */
export function wonLostByMonth(
  closedOpps: ReadonlyArray<ClosedOppMonthRow>,
): Array<{ month: string; won: number; lost: number }> {
  const byMonth = new Map<string, { month: string; won: number; lost: number }>();
  for (const o of closedOpps) {
    if (!o.closeDate) continue;
    const key = monthKey(o.closeDate);
    const entry = byMonth.get(key) ?? { month: key, won: 0, lost: 0 };
    if (o.stage === "closed_won") entry.won += 1;
    else if (o.stage === "closed_lost") entry.lost += 1;
    byMonth.set(key, entry);
  }
  return [...byMonth.values()];
}

export interface AgingRow {
  createdAt: Date;
}

/**
 * S31: the tab-2 "Aging Pipeline" chart — a FIXED 4-bucket list (all four
 * buckets always present, zero counts at zero data). Age = days since the
 * OPPORTUNITY's created_date (the reference's Pw(new Date, li(g.created_date))
 * — NOT the s10 updatedAt basis).
 */
export function agingCounts(rows: readonly AgingRow[], now: number): Array<{ label: string; count: number }> {
  return AGING_BUCKETS.map((bucket) => ({
    label: bucket.label,
    count: rows.filter((r) => {
      const ageDays = (now - r.createdAt.getTime()) / 86_400_000;
      return ageDays >= bucket.min && ageDays < bucket.max;
    }).length,
  }));
}

export interface AccuracyOppInput {
  closeDate: Date | null;
  createdAt: Date;
  amount: number;
  probability: number | null;
  stage: string;
}

/**
 * S31: the tab-2 "Forecasting Accuracy" wide chart + the centered
 * "Average Accuracy: N%" caption — the reference's ACTUAL/FORECASTED
 * formula (the s10 100−|diff| approximation retired):
 *
 *   per closed opp (close_date AND created_date present), grouped by the
 *   "MMM yyyy" of close_date:
 *     forecasted += amount × (probability || 50) / 100
 *     actual     += (stage === "closed_won" && amount) || 0
 *   accuracy = forecasted > 0 ? (actual / forecasted × 100).toFixed(1) : 0
 *   average  = points.length > 0
 *     ? (Σ parseFloat(accuracy) / points.length).toFixed(1) : "0"
 *
 * accuracy/average are STRINGS (the reference's toFixed(1) chain — the
 * caption renders them verbatim).
 */
export function forecastAccuracySeries(
  closedOpps: readonly AccuracyOppInput[],
): {
  points: Array<{ month: string; forecasted: number; actual: number; accuracy: string | number }>;
  average: string;
} {
  const byMonth = new Map<string, { month: string; forecasted: number; actual: number }>();
  for (const o of closedOpps) {
    if (!o.closeDate || !o.createdAt) continue;
    const key = monthKey(o.closeDate);
    const entry = byMonth.get(key) ?? { month: key, forecasted: 0, actual: 0 };
    entry.forecasted += (o.amount || 0) * ((o.probability || 50) / 100);
    entry.actual += (o.stage === "closed_won" && o.amount) || 0;
    byMonth.set(key, entry);
  }
  const points = [...byMonth.values()].map((m) => ({
    ...m,
    accuracy: m.forecasted > 0 ? ((m.actual / m.forecasted) * 100).toFixed(1) : 0,
  }));
  const average =
    points.length > 0
      ? (points.reduce((s, p) => s + parseFloat(String(p.accuracy)), 0) / points.length).toFixed(1)
      : "0";
  return { points, average };
}

export interface AtRiskOppRow {
  id: string;
  name: string;
  accountName: string | null;
  amount: number;
}

export interface AtRiskActivityRow {
  relatedType: string | null;
  relatedName: string | null;
  /** The activity's date — our Activity model's dueAt (createdAt fallback). */
  date: Date | null;
}

/**
 * S31: the tab-2 "Deals at Risk (No Activity 14+ Days)" table — an OPEN
 * opportunity is at risk when its LAST Opportunity-linked activity (matched
 * by our freeform relatedType/relatedName model — the reference joins on
 * related_to_id) is MORE than 14 days old, or it has NO linked activity at
 * all (the 999 sentinel). Capped at 20 rows.
 */
export function dealsAtRiskRows(
  openOpps: readonly AtRiskOppRow[],
  activities: readonly AtRiskActivityRow[],
  now: number,
): Array<{ id: string; deal: string; account: string | null; amount: number }> {
  const lastActivityDays = (opp: AtRiskOppRow): number => {
    const linked = activities
      .filter((a) => a.relatedType === "Opportunity" && a.relatedName === opp.name && a.date)
      .sort((a, b) => (b.date as Date).getTime() - (a.date as Date).getTime());
    const last = linked[0];
    if (!last?.date) return 999;
    return Math.floor((now - last.date.getTime()) / 86_400_000);
  };
  return openOpps
    .filter((o) => lastActivityDays(o) > 14)
    .slice(0, 20)
    .map((o) => ({ id: o.id, deal: o.name, account: o.accountName, amount: o.amount }));
}
