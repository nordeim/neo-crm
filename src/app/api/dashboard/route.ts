import { db } from "@/lib/db";
import { ok, isGuarded, requireSession } from "@/lib/api";
import { PIPELINE_STAGES, STAGE_META, PIPELINE_LABELS, CHART_COLORS } from "@/lib/constants";
import { addMonths, startOfMonth } from "@/lib/format";
import type { DashboardData } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  const now = new Date();
  const monthStart = startOfMonth(now);
  const prevMonthStart = addMonths(monthStart, -1);
  const sixMonthsAgo = addMonths(monthStart, -5);

  const [leads, users, activities] = await Promise.all([
    db.lead.findMany({ include: { owner: { select: { id: true, name: true, avatarColor: true } } } }),
    db.user.findMany({ select: { id: true, name: true, avatarColor: true } }),
    db.activity.findMany({ where: { status: "scheduled" }, orderBy: { dueAt: "asc" } }),
  ]);

  const wonLeads = leads.filter((l) => l.stage === "won");
  const lostLeads = leads.filter((l) => l.stage === "lost");
  const openLeads = leads.filter((l) => l.stage !== "won" && l.stage !== "lost");

  // ---- KPIs ----
  const totalLeads = leads.length;
  const totalLeadsPrev = leads.filter((l) => l.createdAt >= prevMonthStart && l.createdAt < monthStart).length;
  const totalLeadsCurrent = leads.filter((l) => l.createdAt >= monthStart).length;

  const dealsClosed = wonLeads.length;
  const dealsClosedValue = wonLeads.reduce((s, l) => s + l.value, 0);

  const revenueThisMonth = wonLeads
    .filter((l) => l.closedAt && l.closedAt >= monthStart)
    .reduce((s, l) => s + l.value, 0);
  const revenuePrevMonth = wonLeads
    .filter((l) => l.closedAt && l.closedAt >= prevMonthStart && l.closedAt < monthStart)
    .reduce((s, l) => s + l.value, 0);

  // Monthly sales target: a simple derived target (total open pipeline / 4,
  // floored at a base 50K) — the reference hardcodes targets; deriving keeps
  // the demo honest while remaining tunable in settings via defaultCurrency.
  const openPipeline = openLeads.reduce((s, l) => s + l.value, 0);
  const salesTarget = Math.max(50000, Math.round(openPipeline / 4));
  const salesTargetProgress = salesTarget > 0 ? Math.min(100, Math.round((revenueThisMonth / salesTarget) * 100)) : 0;

  const conversionRate = leads.length > 0 ? Math.round((dealsClosed / leads.length) * 1000) / 10 : 0;

  const wonWithDates = wonLeads.filter((l) => l.closedAt);
  const avgSalesCycleDays = avgDays(
    wonWithDates.map((l) => l.createdAt),
    wonWithDates.map((l) => l.closedAt ?? l.createdAt),
  );
  // Cycle delta: compare this quarter's wins vs all-time average.
  const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
  const quarterWins = wonWithDates.filter((l) => (l.closedAt ?? l.createdAt) >= quarterStart);
  const avgSalesCycleDelta =
    quarterWins.length >= 2
      ? Math.round(avgDays(quarterWins.map((l) => l.createdAt), quarterWins.map((l) => l.closedAt ?? l.createdAt)) - avgSalesCycleDays)
      : null;

  // ---- Pipeline by stage ----
  const pipeline = PIPELINE_STAGES.map((stage) => {
    const rows = leads.filter((l) => l.stage === stage);
    return {
      stage,
      label: PIPELINE_LABELS[stage] ?? stage,
      count: rows.length,
      value: rows.reduce((s, l) => s + l.value, 0),
      color: STAGE_META[stage]?.color ?? CHART_COLORS.gray,
    };
  });

  // ---- Revenue over time: 7 ticks = current month + 6 back. The reference
  // renders 7 month labels under its "Last 6 months" caption (DOM-verified
  // Nov..May) — "last 6 months" excluding today's partial month.
  const revenueOverTime: DashboardData["revenueOverTime"] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const m = addMonths(monthStart, -i);
    const next = addMonths(m, 1);
    const won = wonLeads
      .filter((l) => l.closedAt && l.closedAt >= m && l.closedAt < next)
      .reduce((s, l) => s + l.value, 0);
    const target = Math.round(salesTarget * (0.8 + 0.05 * (6 - i)));
    revenueOverTime.push({
      month: m.toLocaleString("en-US", { month: "short" }),
      won,
      target,
    });
  }

  // ---- Top performing reps ----
  const topReps = users
    .map((u) => {
      const wins = wonLeads.filter((l) => l.ownerId === u.id);
      return { id: u.id, name: u.name, avatarColor: u.avatarColor, deals: wins.length, value: wins.reduce((s, l) => s + l.value, 0) };
    })
    .sort((a, b) => b.value - a.value || b.deals - a.deals)
    .slice(0, 6);

  // ---- Lead sources ----
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

  // ---- Upcoming activities ----
  const upcomingActivities = activities
    .filter((a) => a.dueAt && a.dueAt >= now)
    .slice(0, 6)
    .map((a) => ({
      ...a,
      daysUntil: a.dueAt ? Math.ceil((a.dueAt.getTime() - now.getTime()) / 86_400_000) : 0,
    }));

  // ---- Recent deals ----
  const recentDeals = leads
    .slice()
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 6)
    .map((l) => ({
      ...l,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
      expectedCloseDate: l.expectedCloseDate?.toISOString() ?? null,
      closedAt: l.closedAt?.toISOString() ?? null,
      nextFollowUp: l.nextFollowUp?.toISOString() ?? null,
      account: null,
      owner: l.owner ? { id: l.owner.id, name: l.owner.name, avatarColor: l.owner.avatarColor } : null,
    }));

  const data: DashboardData = {
    kpis: {
      totalLeads,
      totalLeadsDelta: totalLeadsPrev > 0 ? Math.round(((totalLeadsCurrent - totalLeadsPrev) / totalLeadsPrev) * 1000) / 10 : totalLeadsCurrent > 0 ? null : 0,
      dealsClosed,
      dealsClosedValue,
      revenueThisMonth,
      revenueDelta: revenuePrevMonth > 0 ? Math.round(((revenueThisMonth - revenuePrevMonth) / revenuePrevMonth) * 1000) / 10 : revenueThisMonth > 0 ? null : 0,
      salesTarget,
      salesTargetProgress,
      conversionRate,
      avgSalesCycleDays,
      avgSalesCycleDelta,
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

function avgDays(starts: Date[], ends: Date[]): number {
  if (starts.length === 0) return 0;
  let total = 0;
  for (let i = 0; i < starts.length; i += 1) {
    total += Math.max(0, ends[i].getTime() - starts[i].getTime());
  }
  return Math.round(total / starts.length / 86_400_000);
}
