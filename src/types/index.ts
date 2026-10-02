// Shared client-side domain types (API wire shapes).

export type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

export interface User {
  id: string;
  email: string;
  name: string;
  avatarColor: string;
  role: string;
}

export interface Account {
  id: string;
  name: string;
  industry: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  annualRevenue: number | null;
  employees: number | null;
  tier: string;
  isKey: boolean;
  status: string;
  // Session-26 (S26-P5): the reference's stored health (Healthy | At Risk |
  // Needs Attention) — backend-defaulted, surfaced through the accounts
  // page export's Health column.
  health: string;
  ownerId: string | null;
  owner?: Pick<User, "id" | "name" | "avatarColor"> | null;
  lastActivityAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { contacts: number; leads: number; activities: number };
}

export interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  position: string | null;
  source: string | null;
  priority: string;
  status: string;
  accountId: string | null;
  account?: { id: string; name: string } | null;
  ownerId: string | null;
  owner?: Pick<User, "id" | "name" | "avatarColor"> | null;
  lastActivityAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  value: number;
  stage: string;
  source: string | null;
  status: string;
  expectedCloseDate: string | null;
  closedAt: string | null;
  nextFollowUp: string | null;
  accountId: string | null;
  account?: { id: string; name: string } | null;
  contactId: string | null;
  ownerId: string | null;
  owner?: Pick<User, "id" | "name" | "avatarColor"> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CrmEvent {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  startAt: string;
  endAt: string | null;
  allDay: boolean;
  location: string | null;
  relatedType: string | null;
  accountId: string | null;
  account?: { id: string; name: string } | null;
  contactId: string | null;
  contact?: { id: string; name: string } | null;
  ownerId: string | null;
  owner?: Pick<User, "id" | "name" | "avatarColor"> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: string;
  subject: string;
  notes: string | null;
  status: string;
  priority: string;
  dueAt: string | null;
  completedAt: string | null;
  relatedType: string | null;
  relatedName: string | null;
  accountId: string | null;
  account?: { id: string; name: string } | null;
  contactId: string | null;
  contact?: { id: string; name: string } | null;
  ownerId: string | null;
  owner?: Pick<User, "id" | "name" | "avatarColor"> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  contactSources: string[];
  leadStages: string[];
  activityTypes: string[];
  accountTiers: string[];
  industries: string[];
  defaultCurrency: string;
  defaultLeadStage: string;
  defaultTier: string;
  followUpDays: number;
  calendarView: string;
  firstDayOfWeek: string;
}

export interface SavedReport {
  id: string;
  name: string;
  tab: string;
  config: string;
  createdAt: string;
}

// ---- computed aggregates ---------------------------------------------------

export interface DashboardData {
  kpis: {
    totalLeads: number;
    totalLeadsDelta: number | null;
    dealsClosed: number;
    dealsClosedValue: number;
    revenueThisMonth: number;
    revenueDelta: number | null;
    salesTarget: number;
    salesTargetProgress: number;
    conversionRate: number;
    avgSalesCycleDays: number;
    avgSalesCycleDelta: number | null;
  };
  pipeline: Array<{ stage: string; label: string; count: number; value: number; color: string }>;
  revenueOverTime: Array<{ month: string; won: number; target: number }>;
  topReps: Array<{ id: string; name: string; avatarColor: string; deals: number; value: number }>;
  leadSources: Array<{ source: string; count: number; value: number }>;
  upcomingActivities: Array<Activity & { daysUntil: number }>;
  recentDeals: Array<Lead>;
}

export interface ReportsData {
  kpis: {
    totalLeads: number;
    totalLeadsDelta: number | null;
    openLeads: number;
    openLeadsDelta: number | null;
    wonDeals: number;
    wonValue: number;
    wonDelta: number | null;
    lostDeals: number;
    lostValue: number;
    lostDelta: number | null;
    conversionRate: number;
  };
  /** Session-10 (S10-9): ROW-DERIVED month series — one entry per DISTINCT
   *  closed month (won + lost events), EMPTY at zero data, which is why the
   *  reference renders no month ticks at zero. The dashboard's charts stay
   *  on their FIXED windows (separate route). */
  revenueOverTime: Array<{ month: string; won: number; target: number }>;
  wonVsLostOverTime: Array<{ month: string; won: number; lost: number }>;
  /** Session-10 (S10-6): tab-1 pipeline — the reference's 8 RAW slugs
   *  (REPORTS_PIPELINE_SLUGS; the merged-list quirk, counts double-report
   *  new/prospecting and qualified/qualification, won maps to closed_won). */
  pipeline: Array<{ slug: string; label: string; count: number; value: number; color: string }>;
  /** Session-10 (S10-8): tab-2 pipeline — ROW-DERIVED (actual open-lead
   *  stages present; empty at zero, like the reference's empty chart). */
  pipelineByStageRows: Array<{ stage: string; label: string; count: number; value: number; color: string }>;
  /** Session-10 (S10-7): the 4-stage funnel (FUNNEL_STAGES), always four
   *  entries (cumulative counts), rendered as a recharts FunnelChart. */
  funnel: Array<{ id: string; label: string; count: number; color: string }>;
  /** Session-10 (S10-8): ROW-DERIVED (types actually present; empty at
   *  zero, like the reference's tab-3 charts). */
  activitiesByType: Array<{ type: string; label: string; count: number; color: string }>;
  /** Session-10 (S10-8): "Activity Log by Owner" — Owner/Activities rows
   *  (row-derived; the reference's 2-column table). */
  activitiesByOwner: Array<{ name: string; total: number }>;
  leadSources: Array<{ source: string; leads: number; won: number; value: number; winRate: number }>;
  /** Session-27 (S27-P1): the COMPUTED health distribution (name/value pairs for the pie). */
  accountHealth: Array<{ name: string; value: number }>;
  topAccounts: Array<{ id: string; name: string; revenue: number; industry: string | null }>;
  atRiskAccounts: Array<{ id: string; name: string; daysSinceActivity: number; health: string }>;
  accountSummary: Array<{ id: string; name: string; industry: string | null; status: string; contacts: number; openLeads: number }>;
  recentWonDeals: Array<Lead>;
  topDeals: Array<Lead>;
  // ---- Session-10 (S10-8): tab 2–4 additions -------------------------------
  /** Fixed 4-bucket aging list (AGING_BUCKETS; all buckets present at zero). */
  agingPipeline: Array<{ label: string; count: number }>;
  /** The tab-2 wide chart + its "Average Accuracy: N%" caption. */
  forecastingAccuracy: { points: Array<{ month: string; accuracy: number }>; average: number };
  /** Session-27 (S27-P4): the FIXED 4 probability bands with value sums (the reference's pie data). */
  forecastByProbability: Array<{ band: string; value: number }>;
  /** Open deals table rows (Deal/Stage/Amount). */
  openDealsByStage: Array<{ id: string; deal: string; stage: string; amount: number }>;
  /** Open leads with no activity for 14+ days (Deal/Account/Amount). */
  dealsAtRisk: Array<{ id: string; deal: string; account: string | null; amount: number }>;
  /** Row-derived activity month series (Activities Over Time chart). */
  activitiesOverTime: Array<{ month: string; count: number }>;
  /** Months with activities count vs won count (Activities vs Wins chart). */
  activitiesVsWins: Array<{ month: string; activities: number; wins: number }>;
  /** Overdue activities table rows (Activity/Type/Due Date). */
  overdueActivities: Array<{ id: string; subject: string; type: string; dueAt: string | null }>;
  /** Leads list by source table rows (Lead/Source/Status). */
  leadsListBySource: Array<Lead>;
}

export interface SearchResult {
  accounts: Account[];
  contacts: Contact[];
  leads: Lead[];
}
