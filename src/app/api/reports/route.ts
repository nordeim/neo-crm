import { db } from "@/lib/db";
import { ok, ERR, asString, isGuarded, requireSession } from "@/lib/api";
import {
  ACTIVITY_TYPE_META,
  ACCOUNT_STATUS_META,
  CHART_COLORS,
  FUNNEL_STAGES,
  REPORT_PERIODS,
  STAGE_META,
  isDroppedStage,
  reportsBucketCounts,
} from "@/lib/constants";
import { agingCounts, forecastAccuracySeries, monthsFromEvents } from "@/lib/reports-data";
import { addMonths, startOfDay, startOfMonth, startOfWeek, startOfQuarter, startOfYear } from "@/lib/format";
import type { ReportsData } from "@/types";

export const dynamic = "force-dynamic";

function periodStart(period: string, now: Date): Date {
  // Session-25 (S25-P6): the reference's SHORT period vocabulary —
  // today/week/month/quarter/ytd/all (REPORT_PERIODS ids).
  switch (period) {
    case "today":
      return startOfDay(now);
    case "week":
      return startOfWeek(now, "monday");
    case "month":
      return startOfMonth(now);
    case "quarter":
      return startOfQuarter(now);
    case "ytd":
      return startOfYear(now);
    default:
      return new Date(0);
  }
}

export async function GET(req: Request) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  const url = new URL(req.url);
  const period = asString(url.searchParams.get("period")) ?? "quarter";
  if (!REPORT_PERIODS.some((p) => p.id === period)) return ERR.BAD_REQUEST("Invalid period");
  // "all" is the UI's "no filter" sentinel — normalize to null so it never
  // reaches Prisma as a literal value.
  const notAll = (v: string | null) => (v && v !== "all" ? v : null);
  const ownerId = notAll(url.searchParams.get("ownerId"));
  const stage = notAll(url.searchParams.get("stage"));
  const status = notAll(url.searchParams.get("status"));

  const now = new Date();
  const from = periodStart(period, now);

  const ownerFilter = ownerId ? { ownerId } : {};
  const leadWhere = {
    ...ownerFilter,
    ...(stage ? { stage } : {}),
    ...(status ? { status } : {}),
  };

  const [leads, activities, accounts, users] = await Promise.all([
    db.lead.findMany({
      where: leadWhere,
      include: {
        owner: { select: { id: true, name: true, avatarColor: true } },
        account: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    db.activity.findMany({
      where: { ...ownerFilter, createdAt: { gte: from } },
      include: { owner: { select: { id: true, name: true, avatarColor: true } } },
    }),
    db.account.findMany({
      include: { _count: { select: { contacts: true, leads: true } } },
      orderBy: { annualRevenue: "desc" },
    }),
    db.user.findMany({ select: { id: true, name: true, avatarColor: true } }),
  ]);

  const wonLeads = leads.filter((l) => l.stage === "won" && (l.closedAt ?? l.createdAt) >= from);
  // "Lost Deals" keeps the strict lost filter (the card is labeled Lost);
  // open excludes every dropped stage (lost + unqualified).
  const lostLeads = leads.filter((l) => l.stage === "lost" && (l.closedAt ?? l.createdAt) >= from);
  const openLeads = leads.filter((l) => l.stage !== "won" && !isDroppedStage(l.stage));

  // Previous period for deltas
  const prevFrom = period === "all_time" ? new Date(0) : periodStart(period, addMonths(now, -3));
  const prevWon = leads.filter((l) => l.stage === "won" && (l.closedAt ?? l.createdAt) >= prevFrom && (l.closedAt ?? l.createdAt) < from);
  const prevLost = leads.filter((l) => l.stage === "lost" && (l.closedAt ?? l.createdAt) >= prevFrom && (l.closedAt ?? l.createdAt) < from);

  const wonValue = wonLeads.reduce((s, l) => s + l.value, 0);
  const lostValue = lostLeads.reduce((s, l) => s + l.value, 0);
  const conversionRate = leads.length > 0 ? Math.round((wonLeads.length / leads.length) * 1000) / 10 : 0;

  const pctDelta = (cur: number, prev: number): number | null =>
    prev > 0 ? Math.round(((cur - prev) / prev) * 1000) / 10 : cur > 0 ? null : 0;

  // ---- time series (session-10 S10-9: ROW-DERIVED month series — one entry
  // per DISTINCT closed month, EMPTY at zero (which is why the reference
  // renders no month ticks at zero data); the DASHBOARD's fixed 7-month
  // window lives in /api/dashboard and is unchanged) ----
  const closedEvents = [...wonLeads, ...lostLeads].map((l) => ({
    closedAt: l.closedAt,
    createdAt: l.createdAt,
    value: l.value,
    kind: l.stage === "won" ? ("won" as const) : ("lost" as const),
  }));
  const closedMonths = monthsFromEvents(closedEvents);
  const byMonth = (month: string, kind: "won" | "lost") =>
    closedEvents.filter(
      (e) => e.kind === kind && (e.closedAt ?? e.createdAt).toLocaleString("en-US", { month: "short" }) === month,
    );
  const revenueOverTime: ReportsData["revenueOverTime"] = closedMonths.map((m) => {
    // Months present carry their won value; target keeps the derived
    // formula (won * 1.15 + 10000) used since the series was introduced.
    const won = byMonth(m.month, "won").reduce((s, e) => s + e.value, 0);
    return { month: m.month, won, target: Math.round(won * 1.15 + 10000) };
  });
  const wonVsLostOverTime: ReportsData["wonVsLostOverTime"] = closedMonths.map((m) => ({
    month: m.month,
    won: byMonth(m.month, "won").length,
    lost: byMonth(m.month, "lost").length,
  }));

  // ---- per-stage counts/values (shared by the 8-slug pipeline + funnel) ----
  const stageCounts: Record<string, number> = {};
  const stageValues: Record<string, number> = {};
  for (const l of leads) {
    stageCounts[l.stage] = (stageCounts[l.stage] ?? 0) + 1;
    stageValues[l.stage] = (stageValues[l.stage] ?? 0) + l.value;
  }

  // ---- pipeline (session-10 S10-6: the reference's 8 RAW slugs via
  // reportsBucketCounts — counts double-report new/prospecting and
  // qualified/qualification, won maps to closed_won; colors follow the
  // underlying stage; labels are the RAW slugs, the reference's quirk) ----
  const slugStage = (slug: string) =>
    slug === "prospecting" ? "new" : slug === "qualification" ? "qualified" : slug === "closed_won" ? "won" : slug;
  const pipeline: ReportsData["pipeline"] = reportsBucketCounts(stageCounts).map((b) => {
    const stage = slugStage(b.slug);
    return {
      slug: b.slug,
      label: b.slug, // RAW slug — the reference's quirk (no title-casing)
      count: b.count,
      value: stageValues[stage] ?? 0,
      color: STAGE_META[stage]?.color ?? CHART_COLORS.gray,
    };
  });

  // ---- tab-2 pipeline (S10-8: ROW-DERIVED — the open-lead stages present;
  // empty at zero like the reference's empty chart) ----
  const pipelineByStageRows: ReportsData["pipelineByStageRows"] = [...new Set(openLeads.map((l) => l.stage))]
    .map((stage) => {
      const rows = openLeads.filter((l) => l.stage === stage);
      return {
        stage,
        label: STAGE_META[stage]?.label ?? stage,
        count: rows.length,
        value: rows.reduce((acc, l) => acc + l.value, 0),
        color: STAGE_META[stage]?.color ?? CHART_COLORS.gray,
      };
    })
    .sort((a, b) => b.value - a.value);

  // ---- funnel (session-10 S10-7: the 4-stage FUNNEL_STAGES list, always
  // four entries, cumulative counts; rendered as a recharts FunnelChart) ----
  const reachedStage = (order: string[]) =>
    leads.filter((l) => order.includes(l.stage) || l.stage === "won").length;
  const funnel: ReportsData["funnel"] = FUNNEL_STAGES.map((s) => {
    const count =
      s === "new"
        ? leads.length
        : s === "qualified"
          ? reachedStage(["qualified", "proposal", "negotiation"])
          : s === "won"
            ? (stageCounts["won"] ?? 0)
            : (stageCounts["lost"] ?? 0);
    return { id: s, label: STAGE_META[s]?.label ?? s, count, color: STAGE_META[s]?.color ?? CHART_COLORS.gray };
  });

  // ---- activities (session-10 S10-8: ROW-DERIVED — the types actually
  // present, empty at zero like the reference's tab-3 charts) ----
  const presentTypes = [...new Set(activities.map((a) => a.type))];
  const activitiesByType: ReportsData["activitiesByType"] = presentTypes
    .map((t) => ({
      type: t,
      label: ACTIVITY_TYPE_META[t]?.label ?? t,
      count: activities.filter((a) => a.type === t).length,
      color: ACTIVITY_TYPE_META[t]?.color ?? CHART_COLORS.gray,
    }))
    .sort((a, b) => b.count - a.count);

  // "Activity Log by Owner" — Owner/Activities rows (the reference's
  // 2-column table; row-derived).
  const activitiesByOwner: ReportsData["activitiesByOwner"] = users
    .map((u) => ({ name: u.name, total: activities.filter((a) => a.ownerId === u.id).length }))
    .filter((u) => u.total > 0)
    .sort((a, b) => b.total - a.total);

  // ---- lead sources ----
  const sourceMap = new Map<string, { leads: number; won: number; value: number }>();
  for (const l of leads) {
    const key = l.source || "Unknown";
    const e = sourceMap.get(key) ?? { leads: 0, won: 0, value: 0 };
    e.leads += 1;
    if (l.stage === "won") {
      e.won += 1;
      e.value += l.value;
    }
    sourceMap.set(key, e);
  }
  const leadSources = [...sourceMap.entries()]
    .map(([source, v]) => ({
      source,
      leads: v.leads,
      won: v.won,
      value: v.value,
      winRate: v.leads > 0 ? Math.round((v.won / v.leads) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.leads - a.leads);

  // ---- account health ----
  const accountHealth = Object.keys(ACCOUNT_STATUS_META).map((s) => ({
    status: s,
    label: ACCOUNT_STATUS_META[s].label,
    count: accounts.filter((a) => a.status === s).length,
    color: ACCOUNT_STATUS_META[s].color,
  }));

  const topAccounts = accounts
    .filter((a) => a.annualRevenue)
    .slice(0, 10)
    .map((a) => ({ id: a.id, name: a.name, revenue: a.annualRevenue ?? 0, industry: a.industry }));

  const staleDays = 45;
  const staleCutoff = new Date(now.getTime() - staleDays * 86_400_000);
  const atRiskAccounts = accounts
    .filter((a) => (a.lastActivityAt ?? a.createdAt) < staleCutoff || a.status === "churned")
    .slice(0, 10)
    .map((a) => ({
      id: a.id,
      name: a.name,
      lastActivityAt: a.lastActivityAt?.toISOString() ?? null,
      status: a.status,
    }));

  const accountSummary = accounts.slice(0, 10).map((a) => ({
    id: a.id,
    name: a.name,
    industry: a.industry,
    status: a.status,
    contacts: a._count.contacts,
    openLeads: a._count.leads,
  }));

  // ---- tables ----
  const serializeLead = (l: (typeof leads)[number]) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
    expectedCloseDate: l.expectedCloseDate?.toISOString() ?? null,
    closedAt: l.closedAt?.toISOString() ?? null,
    nextFollowUp: l.nextFollowUp?.toISOString() ?? null,
    account: null,
    contact: null,
  });

  const recentWonDeals = wonLeads.slice(0, 6).map(serializeLead);
  const topDeals = leads.slice().sort((a, b) => b.value - a.value).slice(0, 6).map(serializeLead);

  // ---- session-10 (S10-8): the tab 2-4 additions ----
  const agingPipeline: ReportsData["agingPipeline"] = agingCounts(
    openLeads.map((l) => ({ updatedAt: l.updatedAt, createdAt: l.createdAt })),
    now.getTime(),
  );

  const forecastingAccuracy: ReportsData["forecastingAccuracy"] = forecastAccuracySeries(
    revenueOverTime.map((m) => ({ month: m.month, forecast: m.target, actual: m.won })),
  );

  // Weighted open-pipeline value by stage (negotiation .6 / proposal .4 /
  // qualified .25 / rest .1 — the weighted-forecast weights).
  const weightFor = (stage: string) =>
    stage === "negotiation" ? 0.6 : stage === "proposal" ? 0.4 : stage === "qualified" ? 0.25 : 0.1;
  const forecastByProbability: ReportsData["forecastByProbability"] = pipelineByStageRows
    .map((p) => ({ label: p.label, weighted: Math.round(p.value * weightFor(p.stage)) }))
    .filter((p) => p.weighted > 0)
    .sort((a, b) => b.weighted - a.weighted);

  const openDealsByStage: ReportsData["openDealsByStage"] = openLeads
    .slice()
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
    .map((l) => ({
      id: l.id,
      deal: l.name,
      stage: STAGE_META[l.stage]?.label ?? l.stage,
      amount: l.value,
    }));

  const atRiskCutoff = new Date(now.getTime() - 14 * 86_400_000);
  const dealsAtRisk: ReportsData["dealsAtRisk"] = openLeads
    .filter((l) => l.updatedAt < atRiskCutoff)
    .slice(0, 6)
    .map((l) => ({
      id: l.id,
      deal: l.name,
      account: l.account?.name ?? null,
      amount: l.value,
    }));

  const activityMonths = monthsFromEvents(
    activities.map((a) => ({ closedAt: null, createdAt: a.createdAt, value: 0 })),
  );
  const activitiesOverTime: ReportsData["activitiesOverTime"] = activityMonths.map((m) => ({
    month: m.month,
    count: m.count,
  }));
  const activitiesVsWins: ReportsData["activitiesVsWins"] = [
    ...new Set([...activityMonths.map((m) => m.month), ...closedMonths.map((m) => m.month)]),
  ].map((month) => ({
    month,
    activities: activities.filter((a) => a.createdAt.toLocaleString("en-US", { month: "short" }) === month).length,
    wins: closedEvents.filter(
      (e) => e.kind === "won" && (e.closedAt ?? e.createdAt).toLocaleString("en-US", { month: "short" }) === month,
    ).length,
  }));

  const overdueActivities: ReportsData["overdueActivities"] = activities
    .filter((a) => a.status !== "completed" && a.dueAt && a.dueAt < now)
    .slice(0, 6)
    .map((a) => ({
      id: a.id,
      subject: a.subject,
      type: ACTIVITY_TYPE_META[a.type]?.label ?? a.type,
      dueAt: a.dueAt?.toISOString() ?? null,
    }));

  const leadsListBySource: ReportsData["leadsListBySource"] = leads.slice(0, 10).map(serializeLead);

  const data: ReportsData = {
    kpis: {
      totalLeads: leads.length,
      totalLeadsDelta: null,
      openLeads: openLeads.length,
      openLeadsDelta: null,
      wonDeals: wonLeads.length,
      wonValue,
      wonDelta: pctDelta(wonLeads.length, prevWon.length),
      lostDeals: lostLeads.length,
      lostValue,
      lostDelta: pctDelta(lostLeads.length, prevLost.length),
      conversionRate,
    },
    revenueOverTime,
    pipeline,
    pipelineByStageRows,
    funnel,
    activitiesByType,
    activitiesByOwner,
    leadSources,
    accountHealth,
    topAccounts,
    atRiskAccounts,
    accountSummary,
    recentWonDeals,
    topDeals,
    wonVsLostOverTime,
    agingPipeline,
    forecastingAccuracy,
    forecastByProbability,
    openDealsByStage,
    dealsAtRisk,
    activitiesOverTime,
    activitiesVsWins,
    overdueActivities,
    leadsListBySource,
  };

  return ok(data);
}
