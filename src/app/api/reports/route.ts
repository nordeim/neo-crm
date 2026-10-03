import { db } from "@/lib/db";
import { ok, ERR, asString, isGuarded, requireSession } from "@/lib/api";
import {
  ACTIVITY_TYPE_META,
  REPORT_PERIODS,
} from "@/lib/constants";
import { accountHealth, HEALTH_STATES } from "@/lib/account-health";
import {
  agingCounts,
  countByMonth,
  dealsAtRiskRows,
  forecastAccuracySeries,
  monthKey,
  pipelineStageCounts,
  revenueByMonth,
  wonLostByMonth,
} from "@/lib/reports-data";
import { addMonths, startOfDay, startOfMonth, startOfWeek, startOfQuarter, startOfYear } from "@/lib/format";
import type { ReportsData } from "@/types";

export const dynamic = "force-dynamic";

function periodStart(period: string, now: Date): Date {
  // Session-25 (S25-P6) + Session-32 (S32-P4): the reference's period
  // vocabulary with its WIRE ids — today/thisWeek/thisMonth/quarter/
  // ytd/all (REPORT_PERIODS ids; the s25 week/month inferences corrected
  // by the bundle decode of the i3e reports filter).
  switch (period) {
    case "today":
      return startOfDay(now);
    case "thisWeek":
      return startOfWeek(now, "monday");
    case "thisMonth":
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
  // Session-42 (S42-P6): the parse went OPTIONAL — the non-optional form
  // returned "" for a missing param (never undefined), so the `?? "quarter"`
  // default was DEAD and a bare GET answered 400 "Invalid period"
  // (LIVE-discovered; the store always sends an explicit period).
  const period = asString(url.searchParams.get("period"), { optional: true }) ?? "quarter";
  if (!REPORT_PERIODS.some((p) => p.id === period)) return ERR.BAD_REQUEST("Invalid period");
  // "all" is the UI's "no filter" sentinel — normalize to null so it never
  // reaches Prisma as a literal value.
  const notAll = (v: string | null) => (v && v !== "all" ? v : null);
  const owner = notAll(url.searchParams.get("owner"));
  const stage = notAll(url.searchParams.get("stage"));
  const status = notAll(url.searchParams.get("status"));
  const source = notAll(url.searchParams.get("source"));

  const now = new Date();
  const from = periodStart(period, now);

  // Session-31 (S31-P3): the reference's filter model — OPPORTUNITIES carry
  // the full filter set (period by created_date + stage + source + owner +
  // status); LEADS filter by period + source ONLY; ACTIVITIES by period
  // (their date). The owner value is the OPP's owner NAME STRING (the
  // reference's owner dropdown lists the distinct opp owners).
  const oppWhere = {
    ...(period !== "all" ? { createdAt: { gte: from } } : {}),
    ...(stage ? { stage } : {}),
    ...(source ? { source } : {}),
    ...(owner ? { owner } : {}),
    ...(status === "won"
      ? { stage: "closed_won" }
      : status === "lost"
        ? { stage: "closed_lost" }
        : {}),
  };
  const leadWhere = {
    ...(period !== "all" ? { createdAt: { gte: from } } : {}),
    ...(source ? { source } : {}),
  };

  // Session-42 (S42-P1): the read family joined the envelope — every
  // derivation below is pure computation on the fetched arrays (no db
  // call, nothing that throws), so only the reads need the wrap; the
  // null-guard answers the { ok, error } envelope on failure.
  const rows = await (async () => {
    try {
      return await Promise.all([
        db.lead.findMany({
          where: leadWhere,
          include: {
            owner: { select: { id: true, name: true, avatarColor: true } },
          },
          orderBy: { createdAt: "desc" },
        }),
        db.opportunity.findMany({ where: oppWhere, orderBy: { createdAt: "desc" } }),
        db.activity.findMany({ orderBy: { createdAt: "desc" }, include: { owner: { select: { name: true } } } }),
        db.account.findMany({
          include: { _count: { select: { contacts: true, leads: true } } },
          orderBy: { annualRevenue: "desc" },
        }),
      ]);
    } catch {
      return null;
    }
  })();
  if (!rows) return ERR.INTERNAL();
  const [leads, opportunities, activities, accounts] = rows;

  // The reference's status filter open/won/lost maps onto the OPP stages
  // (open = neither closed branch) — the query above carries won/lost
  // directly; open needs the post-filter (Prisma has no != neither pair).
  const filteredOpps =
    status === "open"
      ? opportunities.filter((o) => o.stage !== "closed_won" && o.stage !== "closed_lost")
      : opportunities;
  const wonOpps = filteredOpps.filter((o) => o.stage === "closed_won");
  const lostOpps = filteredOpps.filter((o) => o.stage === "closed_lost");
  const openOpps = filteredOpps.filter((o) => o.stage !== "closed_won" && o.stage !== "closed_lost");
  const closedOpps = [...wonOpps, ...lostOpps];

  // The activity's date (the reference's Activity.date) + the period filter —
  // its `ld(date, {start, end})` bounds the window at BOTH ends (future-
  // dated activities are excluded from finite periods; the "all" period
  // skips the date check entirely).
  const activityDate = (a: { dueAt: Date | null; createdAt: Date }) => a.dueAt ?? a.createdAt;
  const filteredActivities =
    period === "all"
      ? activities
      : activities.filter((a) => activityDate(a) >= from && activityDate(a) <= now);

  // ---- KPI row (the reference's m memo) ----
  const kpis: ReportsData["kpis"] = {
    totalLeads: leads.length,
    // openLeads counts new+contacted ONLY (NOT qualified — the bundle's
    // `X.status==="new"||X.status==="contacted"`).
    openLeads: leads.filter((l) => l.stage === "new" || l.stage === "contacted").length,
    wonDeals: wonOpps.length,
    wonValue: wonOpps.reduce((s, o) => s + (o.amount || 0), 0),
    lostDeals: lostOpps.length,
    lostValue: lostOpps.reduce((s, o) => s + (o.amount || 0), 0),
    // The OPPORTUNITY conversion rate: won/(won+lost), one decimal.
    conversionRate:
      wonOpps.length + lostOpps.length > 0
        ? ((wonOpps.length / (wonOpps.length + lostOpps.length)) * 100).toFixed(1)
        : "0",
  };

  // ---- tab 1: the close_date month series (insertion order) ----
  const revenueOverTime = revenueByMonth(wonOpps);
  const wonVsLostOverTime = wonLostByMonth(closedOpps);

  // ---- the 8-slug Conversion Funnel SPLIT (leads + opps) ----
  const pipeline = pipelineStageCounts(leads, filteredOpps);

  // ---- tab 1/2 "Pipeline by Stage": OPEN opps grouped by stage (raw
  // slugs, first-seen order — the reference's plain-object grouping) ----
  const byStage = new Map<string, { stage: string; count: number; value: number }>();
  for (const o of openOpps) {
    const key = o.stage || "unknown";
    const entry = byStage.get(key) ?? { stage: key, count: 0, value: 0 };
    entry.count += 1;
    entry.value += o.amount || 0;
    byStage.set(key, entry);
  }
  const pipelineByStageRows = [...byStage.values()];

  // ---- tab 3: activities ----
  const presentTypes = [...new Set(filteredActivities.map((a) => a.type))];
  const activitiesByType: ReportsData["activitiesByType"] = presentTypes
    .map((t) => ({
      type: t,
      label: ACTIVITY_TYPE_META[t]?.label ?? t,
      count: filteredActivities.filter((a) => a.type === t).length,
      color: ACTIVITY_TYPE_META[t]?.color ?? "#9ca3af",
    }))
    .sort((a, b) => b.count - a.count);

  // "Activity Log by Owner" — grouped by the owner NAME (the reference's
  // created_by||"Unassigned"), sorted desc, slice(0,10).
  const ownerMap = new Map<string, number>();
  for (const a of filteredActivities) {
    const key = a.owner?.name ?? "Unassigned";
    ownerMap.set(key, (ownerMap.get(key) ?? 0) + 1);
  }
  const activitiesByOwner = [...ownerMap.entries()]
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // ---- tab 4: sources (the split model — leads from LEADS, the rest from
  // OPPORTUNITIES) ----
  const sourceKeys = new Set<string>([
    ...leads.map((l) => l.source || "Unknown"),
    ...filteredOpps.map((o) => o.source || "Unknown"),
  ]);
  const leadSources: ReportsData["leadSources"] = [...sourceKeys]
    .map((source) => {
      const leadsForSource = leads.filter((l) => (l.source || "Unknown") === source);
      const oppsForSource = filteredOpps.filter((o) => (o.source || "Unknown") === source);
      const won = oppsForSource.filter((o) => o.stage === "closed_won");
      const lost = oppsForSource.filter((o) => o.stage === "closed_lost");
      const total = oppsForSource.reduce((s, o) => s + (o.amount || 0), 0);
      return {
        source,
        leads: leadsForSource.length,
        won: won.length,
        lost: lost.length,
        revenue: won.reduce((s, o) => s + (o.amount || 0), 0),
        winRate:
          won.length + lost.length > 0
            ? ((won.length / (won.length + lost.length)) * 100).toFixed(1)
            : "0",
        avgValue: oppsForSource.length > 0 ? Math.round(total / oppsForSource.length) : 0,
      };
    })
    .sort((a, b) => b.leads - a.leads);

  // ---- tab 5: account health (the closed_lost-OPP rule) ----
  const lostOppAccounts = new Set(lostOpps.map((o) => o.accountName ?? ""));
  const accountHealthRows = accounts.map((a) => ({
    account: a,
    ...accountHealth({
      lastActivityAt: a.lastActivityAt ?? null,
      hasLostDeals: lostOppAccounts.has(a.name),
      now,
    }),
  }));
  const accountHealthDistribution = HEALTH_STATES.map((name) => ({
    name,
    value: accountHealthRows.filter((r) => r.health === name).length,
  }));

  const topAccounts = accounts
    .filter((a) => a.annualRevenue)
    .sort((a, b) => (b.annualRevenue ?? 0) - (a.annualRevenue ?? 0))
    .slice(0, 10)
    .map((a) => ({ id: a.id, name: a.name, revenue: a.annualRevenue ?? 0, industry: a.industry }));

  const atRiskAccounts = accountHealthRows
    .filter((r) => r.health === "At Risk")
    .slice(0, 20)
    .map((r) => ({
      id: r.account.id,
      name: r.account.name,
      daysSinceActivity: r.daysSinceActivity,
      health: r.health,
    }));

  const accountSummary = accounts.slice(0, 10).map((a) => ({
    id: a.id,
    name: a.name,
    industry: a.industry,
    status: a.status,
    contacts: a._count.contacts,
    openLeads: a._count.leads,
  }));

  // ---- tables (the reference's slices: 10 / 10 / 10 / 20) ----
  const recentWonDeals = wonOpps.slice(0, 10).map((o) => ({
    id: o.id,
    name: o.name,
    account: o.accountName,
    amount: o.amount,
  }));

  const topDeals = filteredOpps
    .slice()
    .sort((a, b) => (b.amount || 0) - (a.amount || 0))
    .slice(0, 10)
    .map((o) => ({ id: o.id, name: o.name, stage: o.stage, amount: o.amount }));

  // ---- tab 2 additions ----
  const agingPipeline = agingCounts(
    openOpps.map((o) => ({ createdAt: o.createdAt })),
    now.getTime(),
  );

  const forecastingAccuracy = forecastAccuracySeries(
    closedOpps.map((o) => ({
      closeDate: o.closeDate,
      createdAt: o.createdAt,
      amount: o.amount,
      probability: o.probability,
      stage: o.stage,
    })),
  );

  // Forecast by Probability: the OPEN opps banded by their OWN probability
  // (the s10 stage-weight proxy retired; the 76-100 band can now carry data).
  const forecastByProbability: ReportsData["forecastByProbability"] = (
    ["0-25", "26-50", "51-75", "76-100"] as const
  ).map((band) => ({
    band,
    value: Math.round(
      openOpps
        .filter((o) => {
          const p = o.probability || 0;
          return p <= 25 ? band === "0-25" : p <= 50 ? band === "26-50" : p <= 75 ? band === "51-75" : band === "76-100";
        })
        .reduce((s, o) => s + (o.amount || 0), 0),
    ),
  }));

  // Open Deals by Stage: list order (createdAt desc), slice(0,10) — the
  // raw stage slug rides the row (the page renders it in the outline badge).
  const openDealsByStage = openOpps.slice(0, 10).map((o) => ({
    id: o.id,
    deal: o.name,
    stage: o.stage,
    amount: o.amount,
  }));

  const dealsAtRisk = dealsAtRiskRows(
    openOpps.map((o) => ({
      id: o.id,
      name: o.name,
      accountName: o.accountName,
      amount: o.amount,
    })),
    activities.map((a) => ({
      relatedType: a.relatedType,
      relatedName: a.relatedName,
      date: a.dueAt ?? a.createdAt,
    })),
    now.getTime(),
  );

  // ---- tab 3 series ----
  const activitiesOverTime = countByMonth(
    filteredActivities.map((a) => ({ date: activityDate(a) })),
  );
  // Activities vs Wins: the ACTIVITY months, each joined with the won-OPP
  // count whose close month matches (the reference maps over its activity
  // months only — not a union).
  const activitiesVsWins = activitiesOverTime.map((m) => ({
    month: m.month,
    activities: m.count,
    wins: wonOpps.filter((o) => o.closeDate && monthKey(o.closeDate) === m.month).length,
  }));

  // Overdue: past-date NON-Note activities, slice(0,20) (the reference's
  // `f.date&&isBefore(now,f.date)&&f.type!=="Note"`).
  const overdueActivities = filteredActivities
    .filter((a) => activityDate(a) < now && a.type !== "note")
    .slice(0, 20)
    .map((a) => ({
      id: a.id,
      subject: a.subject,
      type: ACTIVITY_TYPE_META[a.type]?.label ?? a.type,
      dueAt: a.dueAt?.toISOString() ?? null,
    }));

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
  const leadsListBySource = leads.slice(0, 10).map(serializeLead);

  const data: ReportsData = {
    kpis,
    revenueOverTime,
    wonVsLostOverTime,
    pipeline,
    pipelineByStageRows,
    activitiesByType,
    activitiesByOwner,
    leadSources,
    accountHealth: accountHealthDistribution,
    topAccounts,
    atRiskAccounts,
    accountSummary,
    recentWonDeals,
    topDeals,
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
