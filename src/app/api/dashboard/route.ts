import { db } from "@/lib/db";
import { ok, ERR, isGuarded, requireSession } from "@/lib/api";
import type { DashboardData } from "@/types";

export const dynamic = "force-dynamic";

// Session-31 (S31-P2): the dashboard re-derivation — the bundle's Eke memo
// (index-DZ-xbrIm.js) computed against BOTH models: leads feed totalLeads,
// the conversion rate and the avg sales cycle; OPPORTUNITIES feed the
// revenue chart; activities feed the upcoming card. salesTarget is the
// reference's HARDCODED 0 (its literal `V=0`) with targetProgress 0.
//
// Session-78 (M-78c2, the route slim): the reference's filter bar
// re-derives Deals Closed + Revenue This Month + the pipeline chart +
// Top Reps + Recent Deals from the STAGE/SOURCE-FILTERED opp list (its
// `p` memo) — those five derivations moved CLIENT-SIDE onto the store's
// opportunities slice (the page's filteredOpps memo, the reference's
// exact g/m/y/_ split), so the route's copies retired here (zero
// consumers, the dch wire-extra policy; daysUntil went with them —
// never consumed). The route keeps the UNFILTERED members the
// reference derives from the raw lists: totalLeads / conversionRate /
// avgSalesCycleDays (the leads `l`), salesTarget (its literal 0),
// revenueOverTime (the opps `f`), leadSources (leads) + the upcoming
// window (activities).

/** The reference's FIXED 7-label window — hardcoded in its bundle, it does
 *  NOT track the data months (the labels stay Nov..May forever; the data
 *  indexes the last 7 months relative to now). */
const REVENUE_LABELS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"] as const;

export async function GET() {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  const now = new Date();

  // Session-42 (S42-P1): the read family joined the envelope — every
  // derivation below is pure computation on the fetched arrays, so only
  // the reads need the wrap; the null-guard answers the envelope.
  // Session-78 (L-78c4): the activities read mirrors the reference's
  // `Activity.list("-date", 10)` — the TOP-10 by date DESC, no status
  // filter (its window filters only `date >= now` client-side); the
  // leads read drops the owner include nothing consumed (the s44
  // dead-include precedent).
  const rows = await (async () => {
    try {
      return await Promise.all([
        db.lead.findMany(),
        db.opportunity.findMany(),
        db.activity.findMany({ orderBy: { dueAt: "desc" }, take: 10 }),
      ]);
    } catch {
      return null;
    }
  })();
  if (!rows) return ERR.INTERNAL();
  const [leads, opportunities, activities] = rows;

  const wonOpps = opportunities.filter((o) => o.stage === "closed_won");
  const wonLeads = leads.filter((l) => l.stage === "won");

  // ---- KPIs (the Eke memo's UNFILTERED members — the leads list `l`) ----
  const totalLeads = leads.length;

  // The reference's HARDCODED zero target (its literal V=0) — the Sales
  // Target card renders $0k / 0% on both sides. Our derived
  // max(50_000, openPipeline/4) model is retired.
  const salesTarget = 0;
  const salesTargetProgress = 0;

  // Conversion rate: the WON-LEAD share of all leads, one decimal (the
  // reference's toFixed(1) — a string on the wire).
  const conversionRate = leads.length > 0 ? ((wonLeads.length / leads.length) * 100).toFixed(1) : "0";

  // Avg sales cycle: the average AGE of the won leads — floor((now −
  // created)/day) per lead, averaged, rounded (NOT created→closed; the
  // s29 H/U doctrine now applied to the dashboard KPI too).
  const avgSalesCycleDays =
    wonLeads.length > 0
      ? Math.round(
          wonLeads.reduce(
            (s, l) => s + Math.floor((now.getTime() - l.createdAt.getTime()) / 86_400_000),
            0,
          ) / wonLeads.length,
        )
      : 0;

  // ---- Revenue over time: the FIXED Nov..May labels + the 55k±random
  //      target (the reference recomputes the random per render; per request is
  //      our server-side expression of the same variance) — over the
  //      UNFILTERED opps (the reference's `b` memo reads `f`, not `p`) ----
  const curMonth = now.getMonth();
  const revenueOverTime: DashboardData["revenueOverTime"] = REVENUE_LABELS.map((month, i) => {
    const m = (curMonth - 6 + i + 12) % 12;
    const won = wonOpps
      .filter((o) => o.updatedAt.getMonth() === m)
      .reduce((s, o) => s + (o.amount || 0), 0);
    return { month, won, target: Math.round(55_000 + Math.random() * 10_000) };
  });

  // ---- Lead sources (LEADS — the reference's `x` memo, unfiltered) ----
  const sourceMap = new Map<string, { count: number; value: number }>();
  for (const l of leads) {
    const key = l.source || "Unknown";
    const entry = sourceMap.get(key) ?? { count: 0, value: 0 };
    entry.count += 1;
    entry.value += l.value;
    sourceMap.set(key, entry);
  }
  const leadSources = [...sourceMap.entries()]
    .map(([source, v]) => ({ source, ...v }))
    .sort((a, b) => b.count - a.count);

  // ---- Upcoming activities (the reference's `A` memo: the top-10-by-date
  //      window filtered to date >= now, slice(0,3) — the s78 L-78c4
  //      mirror of `list("-date", 10)` + filter + slice) ----
  const upcomingActivities = activities
    .filter((a) => a.dueAt && a.dueAt >= now)
    .slice(0, 3)
    .map((a) => ({
      ...a,
      dueAt: a.dueAt?.toISOString() ?? null,
      completedAt: a.completedAt?.toISOString() ?? null,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    }));

  const data: DashboardData = {
    kpis: {
      totalLeads,
      salesTarget,
      salesTargetProgress,
      conversionRate,
      avgSalesCycleDays,
    },
    revenueOverTime,
    leadSources,
    upcomingActivities,
  };

  return ok(data);
}
