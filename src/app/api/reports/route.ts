import { db } from "@/lib/db";
import { ok, ERR, asString, isGuarded, requireSession } from "@/lib/api";
import {
  PIPELINE_STAGES,
  STAGE_META,
  PIPELINE_LABELS,
  ACTIVITY_TYPE_META,
  ACCOUNT_STATUS_META,
  CHART_COLORS,
  REPORT_PERIODS,
} from "@/lib/constants";
import { addMonths, startOfMonth, startOfWeek, startOfQuarter, startOfYear } from "@/lib/format";
import type { ReportsData } from "@/types";

export const dynamic = "force-dynamic";

function periodStart(period: string, now: Date): Date {
  switch (period) {
    case "this_week":
      return startOfWeek(now, "monday");
    case "this_month":
      return startOfMonth(now);
    case "this_quarter":
      return startOfQuarter(now);
    case "this_year":
      return startOfYear(now);
    default:
      return new Date(0);
  }
}

export async function GET(req: Request) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  const url = new URL(req.url);
  const period = asString(url.searchParams.get("period")) ?? "this_quarter";
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
      include: { owner: { select: { id: true, name: true, avatarColor: true } } },
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
  const lostLeads = leads.filter((l) => l.stage === "lost" && (l.closedAt ?? l.createdAt) >= from);
  const openLeads = leads.filter((l) => l.stage !== "won" && l.stage !== "lost");

  // Previous period for deltas
  const prevFrom = period === "all_time" ? new Date(0) : periodStart(period, addMonths(now, -3));
  const prevWon = leads.filter((l) => l.stage === "won" && (l.closedAt ?? l.createdAt) >= prevFrom && (l.closedAt ?? l.createdAt) < from);
  const prevLost = leads.filter((l) => l.stage === "lost" && (l.closedAt ?? l.createdAt) >= prevFrom && (l.closedAt ?? l.createdAt) < from);

  const wonValue = wonLeads.reduce((s, l) => s + l.value, 0);
  const lostValue = lostLeads.reduce((s, l) => s + l.value, 0);
  const conversionRate = leads.length > 0 ? Math.round((wonLeads.length / leads.length) * 1000) / 10 : 0;

  const pctDelta = (cur: number, prev: number): number | null =>
    prev > 0 ? Math.round(((cur - prev) / prev) * 1000) / 10 : cur > 0 ? null : 0;

  // ---- time series (last 6 months, honoring owner/stage/status filters) ----
  const monthStart = startOfMonth(now);
  const revenueOverTime: ReportsData["revenueOverTime"] = [];
  const wonVsLostOverTime: ReportsData["wonVsLostOverTime"] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const m = addMonths(monthStart, -i);
    const next = addMonths(m, 1);
    const inRange = (l: (typeof leads)[number]) => {
      const t = l.closedAt ?? l.createdAt;
      return t >= m && t < next;
    };
    const won = wonLeads.filter(inRange).reduce((s, l) => s + l.value, 0);
    const lost = lostLeads.filter(inRange).reduce((s, l) => s + l.value, 0);
    const label = m.toLocaleString("en-US", { month: "short" });
    revenueOverTime.push({ month: label, won, lost, target: Math.round(won * 1.15 + 10000) });
    wonVsLostOverTime.push({ month: label, won: wonLeads.filter(inRange).length, lost: lostLeads.filter(inRange).length });
  }

  // ---- pipeline ----
  const pipeline = PIPELINE_STAGES.map((s) => {
    const rows = leads.filter((l) => l.stage === s);
    return {
      stage: s,
      label: PIPELINE_LABELS[s] ?? s,
      count: rows.length,
      value: rows.reduce((acc, l) => acc + l.value, 0),
      color: STAGE_META[s]?.color ?? CHART_COLORS.gray,
    };
  });

  // ---- funnel (cumulative stage progression) ----
  const funnelOrder = ["new", "contacted", "qualified", "proposal", "negotiation", "won"];
  let funnelPrev = leads.length;
  const funnel = funnelOrder
    .map((s, i) => {
      const reached = leads.filter(
        (l) => funnelOrder.indexOf(l.stage) >= i || (l.stage === "won" && s === "won"),
      ).length;
      const clamped = Math.min(reached, funnelPrev);
      funnelPrev = clamped;
      return {
        id: s,
        label: STAGE_META[s]?.label ?? s,
        count: clamped,
        color: STAGE_META[s]?.color ?? CHART_COLORS.gray,
      };
    })
    .filter((f) => f.count > 0 || f.id === "new");

  // ---- activities ----
  const activitiesByType = Object.keys(ACTIVITY_TYPE_META).map((t) => ({
    type: t,
    label: ACTIVITY_TYPE_META[t].label,
    count: activities.filter((a) => a.type === t).length,
    color: ACTIVITY_TYPE_META[t].color,
  }));

  const activitiesByOwner = users
    .map((u) => {
      const rows = activities.filter((a) => a.ownerId === u.id);
      return {
        name: u.name,
        avatarColor: u.avatarColor,
        calls: rows.filter((a) => a.type === "call").length,
        emails: rows.filter((a) => a.type === "email").length,
        meetings: rows.filter((a) => a.type === "meeting").length,
        total: rows.length,
      };
    })
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
  };

  return ok(data);
}
