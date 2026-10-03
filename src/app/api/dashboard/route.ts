import { db } from "@/lib/db";
import { ok, ERR, isGuarded, requireSession } from "@/lib/api";
import { PIPELINE_STAGES, PIPELINE_LABELS } from "@/lib/constants";
import type { DashboardData, Opportunity } from "@/types";

export const dynamic = "force-dynamic";

// Session-31 (S31-P2): the dashboard re-derivation — the bundle's Eke memo
// (index-DZ-xbrIm.js) computed against BOTH models: leads feed totalLeads,
// the conversion rate and the avg sales cycle; OPPORTUNITIES feed
// dealsClosedValue, revenueThisMonth, the pipeline chart, the revenue
// chart, Top Reps and Recent Deals. salesTarget is the reference's
// HARDCODED 0 (its literal `V=0`) with targetProgress 0.

/** The reference's FIXED 7-label window — hardcoded in its bundle, it does
 *  NOT track the data months (the labels stay Nov..May forever; the data
 *  indexes the last 7 months relative to now). */
const REVENUE_LABELS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"] as const;

function serializeOpportunity(o: {
  id: string;
  name: string;
  accountName: string | null;
  stage: string;
  amount: number;
  probability: number | null;
  closeDate: Date | null;
  source: string | null;
  owner: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Opportunity {
  return {
    ...o,
    closeDate: o.closeDate?.toISOString() ?? null,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  };
}

export async function GET() {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  const now = new Date();

  // Session-42 (S42-P1): the read family joined the envelope — every
  // derivation below is pure computation on the fetched arrays, so only
  // the reads need the wrap; the null-guard answers the envelope.
  const rows = await (async () => {
    try {
      return await Promise.all([
        db.lead.findMany({ include: { owner: { select: { id: true, name: true, avatarColor: true } } } }),
        db.opportunity.findMany({ orderBy: { createdAt: "desc" } }),
        db.activity.findMany({ where: { status: "scheduled" }, orderBy: { dueAt: "asc" } }),
      ]);
    } catch {
      return null;
    }
  })();
  if (!rows) return ERR.INTERNAL();
  const [leads, opportunities, activities] = rows;

  const wonOpps = opportunities.filter((o) => o.stage === "closed_won");
  const wonLeads = leads.filter((l) => l.stage === "won");

  // ---- KPIs (the Eke memo) ----
  const totalLeads = leads.length;

  // WON-OPP amount sum (NOT won-lead values).
  const dealsClosedValue = wonOpps.reduce((s, o) => s + (o.amount || 0), 0);

  // Won opps whose UPDATED month is the current one (the reference groups
  // by updated_date, not close_date).
  const curMonth = now.getMonth();
  const revenueThisMonth = wonOpps
    .filter((o) => o.updatedAt.getMonth() === curMonth)
    .reduce((s, o) => s + (o.amount || 0), 0);

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

  // ---- Pipeline by stage: the 5 OPP stages with VALUE sums ----
  const pipeline = PIPELINE_STAGES.map((stage) => {
    const rows = opportunities.filter((o) => o.stage === stage);
    return {
      stage,
      label: PIPELINE_LABELS[stage] ?? stage,
      count: rows.length,
      value: rows.reduce((s, o) => s + (o.amount || 0), 0),
    };
  });

  // ---- Revenue over time: the FIXED Nov..May labels + the 55k±random
  // target (the reference recomputes the random per render; per request is
  // our server-side expression of the same variance) ----
  const revenueOverTime: DashboardData["revenueOverTime"] = REVENUE_LABELS.map((month, i) => {
    const m = (curMonth - 6 + i + 12) % 12;
    const won = wonOpps
      .filter((o) => o.updatedAt.getMonth() === m)
      .reduce((s, o) => s + (o.amount || 0), 0);
    return { month, won, target: Math.round(55_000 + Math.random() * 10_000) };
  });

  // ---- Top performing reps: WON opps by the owner STRING, slice(0,3) ----
  const repsMap = new Map<string, { name: string; deals: number; value: number }>();
  for (const o of wonOpps) {
    if (!o.owner) continue;
    const entry = repsMap.get(o.owner) ?? { name: o.owner, deals: 0, value: 0 };
    entry.deals += 1;
    entry.value += o.amount || 0;
    repsMap.set(o.owner, entry);
  }
  const topReps = [...repsMap.values()].sort((a, b) => b.value - a.value).slice(0, 3);

  // ---- Lead sources (LEADS — unchanged) ----
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

  // ---- Upcoming activities (unchanged) ----
  const upcomingActivities = activities
    .filter((a) => a.dueAt && a.dueAt >= now)
    .slice(0, 6)
    .map((a) => ({
      ...a,
      daysUntil: a.dueAt ? Math.ceil((a.dueAt.getTime() - now.getTime()) / 86_400_000) : 0,
    }));

  // ---- Recent deals: OPPS by updatedAt desc, slice(0,5) ----
  const recentDeals = opportunities
    .slice()
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5)
    .map(serializeOpportunity);

  const data: DashboardData = {
    kpis: {
      totalLeads,
      dealsClosedValue,
      revenueThisMonth,
      salesTarget,
      salesTargetProgress,
      conversionRate,
      avgSalesCycleDays,
    },
    pipeline,
    revenueOverTime,
    topReps,
    leadSources,
    upcomingActivities: upcomingActivities.map((a) => ({
      ...a,
      dueAt: a.dueAt?.toISOString() ?? null,
      completedAt: a.completedAt?.toISOString() ?? null,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    })),
    recentDeals,
  };

  return ok(data);
}
