import { AGING_BUCKETS } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Session-10 pure derivations for the reports tabs 2–4 re-mirror
// (src/lib/reports-data.ts). Pinned by tests/reports-data.test.ts.
//
// The zero-state split is DOM-verified on the reference: FIXED lists render
// ticks at zero (dashboard pipeline, tab-1 8-slug pipeline, aging buckets,
// activities types) while ROW-DERIVED series render empty (no ticks) at
// zero — the helpers below cover the row-derived side.
// ---------------------------------------------------------------------------

export interface AgingRow {
  updatedAt: Date | null;
  createdAt: Date;
}

/**
 * S10-8: the tab-2 "Aging Pipeline" chart data — a FIXED 4-bucket list
 * (all four buckets always present, zero counts at zero data, exactly like
 * the reference's 4 bar rects at zero). Age = days since updatedAt (falls
 * back to createdAt).
 */
export function agingCounts(rows: readonly AgingRow[], now: number): Array<{ label: string; count: number }> {
  return AGING_BUCKETS.map((bucket) => ({
    label: bucket.label,
    count: rows.filter((r) => {
      const at = (r.updatedAt ?? r.createdAt).getTime();
      const ageDays = (now - at) / 86_400_000;
      return ageDays >= bucket.min && ageDays < bucket.max;
    }).length,
  }));
}

export interface AccuracyPointInput {
  month: string;
  /** The forecast for the month (reference: its weighted target). */
  forecast: number;
  /** The actual outcome for the month (reference: its won revenue). */
  actual: number;
}

/**
 * S10-8: the tab-2 "Forecasting Accuracy" wide chart + the centered caption
 * "Average Accuracy: N%" below it (the reference's caption reads
 * "Average Accuracy: 0%" at zero data — computed probe).
 *
 * Per month: accuracy = forecast > 0
 *   ? max(0, 100 - |actual - forecast| / forecast * 100)
 *   : 0   (no forecast → no credit; produces 0% at zero data).
 * Average = mean of the per-month accuracies (0 when no months).
 */
export function forecastAccuracySeries(series: readonly AccuracyPointInput[]): {
  points: Array<{ month: string; accuracy: number }>;
  average: number;
} {
  const points = series.map((m) => {
    const accuracy =
      m.forecast > 0
        ? Math.max(0, 100 - (Math.abs(m.actual - m.forecast) / m.forecast) * 100)
        : 0;
    return { month: m.month, accuracy: Math.round(accuracy * 10) / 10 };
  });
  const average =
    points.length > 0
      ? Math.round((points.reduce((s, p) => s + p.accuracy, 0) / points.length) * 10) / 10
      : 0;
  return { points, average };
}

export interface EventLike {
  closedAt: Date | null;
  createdAt: Date;
  value: number;
}

/**
 * S10-9: the row-derived month series (reports tab-1 revenue/wonVsLost +
 * the leads page wonVsLost) — one entry per DISTINCT closed month (falls
 * back to createdAt), ordered ascending. Empty input yields an EMPTY
 * series, which is why the reference renders no month ticks at zero data.
 */
export function monthsFromEvents(
  events: readonly EventLike[],
): Array<{ month: string; count: number; value: number }> {
  const byKey = new Map<string, { count: number; value: number; sort: number }>();
  for (const e of events) {
    const at = e.closedAt ?? e.createdAt;
    const key = `${at.getFullYear()}-${at.getMonth()}`;
    const entry = byKey.get(key) ?? { count: 0, value: 0, sort: at.getTime() };
    entry.count += 1;
    entry.value += e.value;
    byKey.set(key, entry);
  }
  return [...byKey.entries()]
    .sort((a, b) => a[1].sort - b[1].sort)
    .map(([key, v]) => {
      const [y, m] = key.split("-").map(Number);
      return {
        month: new Date(y, m, 1).toLocaleString("en-US", { month: "short" }),
        count: v.count,
        value: v.value,
      };
    });
}
