// Shared client-side domain types (API wire shapes).

export type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

export interface User {
  id: string;
  email: string;
  name: string;
  avatarColor: string;
  // Session-30 (S30-P3): the profile-photo URL (the reference's
  // profile_picture) — null = the gray-200 initial fallback.
  photoUrl: string | null;
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
  // Session-28 (S28-P1): the reference's contact vocabulary — priority is
  // Key/Standard/At Risk; role/engagementLevel/companySize/photoUrl are
  // first-class fields (the inline role select, the 3-bar engagement cell,
  // the company-size stack, the photo avatar).
  priority: string; // Key | Standard | At Risk
  role: string | null; // Decision Maker | Key Contact | Influencer | End User | Other
  engagementLevel: string | null; // High | Medium | Low
  companySize: string | null; // "Small (1-50)" | "Medium (51-500)" | "Large (500+)"
  photoUrl: string | null;
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

// Session-31 (S31-P1): the reference's SECOND deal model — serialized shape.
// accountName/owner are NAME STRINGS (the reference stores display names,
// not relations); stage is the OPPORTUNITY_STAGES vocabulary.
export interface Opportunity {
  id: string;
  name: string;
  accountName: string | null;
  stage: string;
  amount: number;
  probability: number | null;
  closeDate: string | null;
  source: string | null;
  owner: string | null;
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
  // Session-31 (S31-P2): the bundle's Eke KPI memo — dealsClosedValue +
  // revenueThisMonth derive from WON OPPORTUNITIES; salesTarget is the
  // reference's HARDCODED 0 (its literal V=0) with targetProgress 0;
  // avgSalesCycleDays is the average AGE of won leads (now − created). The
  // unused scaffold-era delta/count fields are retired (the page's deltas
  // are the KPI_STATICS literals).
  kpis: {
    totalLeads: number;
    dealsClosedValue: number;
    revenueThisMonth: number;
    salesTarget: number;
    salesTargetProgress: number;
    conversionRate: string;
    avgSalesCycleDays: number;
  };
  /** The 5 OPP stages with VALUE sums (labels Prospecting..Won). */
  pipeline: Array<{ stage: string; label: string; count: number; value: number }>;
  /** The FIXED Nov..May label window (the reference's hardcoded quirk). */
  revenueOverTime: Array<{ month: string; won: number; target: number }>;
  /** WON opps by owner STRING, value-desc, slice(0,3). */
  topReps: Array<{ name: string; deals: number; value: number }>;
  leadSources: Array<{ source: string; count: number; value: number }>;
  upcomingActivities: Array<Activity & { daysUntil: number }>;
  /** OPPS sorted by updatedAt desc, slice(0,5). */
  recentDeals: Array<Opportunity>;
}

export interface ReportsData {
  // Session-31 (S31-P3): the bundle's reports KPI memo — openLeads counts
  // leads with status new+contacted ONLY; won/lost count+value and the
  // conversion rate derive from OPPORTUNITIES (won/(won+lost), toFixed(1)).
  kpis: {
    totalLeads: number;
    openLeads: number;
    wonDeals: number;
    wonValue: number;
    lostDeals: number;
    lostValue: number;
    conversionRate: string;
  };
  /** WON opp amounts per close month ("MMM yyyy" keys, insertion order). */
  revenueOverTime: Array<{ month: string; revenue: number }>;
  wonVsLostOverTime: Array<{ month: string; won: number; lost: number }>;
  /** Session-31: the 8-slug funnel SPLIT — leads' new/contacted/qualified
   *  counts + the OPP five-stage counts (pipelineStageCounts). */
  pipeline: Array<{ slug: string; count: number }>;
  /** OPEN opps grouped by stage — RAW slug ticks, row-derived (empty at zero). */
  pipelineByStageRows: Array<{ stage: string; count: number; value: number }>;
  /** Session-10 (S10-8): ROW-DERIVED (types actually present; empty at
   *  zero, like the reference's tab-3 charts). */
  activitiesByType: Array<{ type: string; label: string; count: number; color: string }>;
  /** "Activity Log by Owner" — Owner/Activities rows (slice 10). */
  activitiesByOwner: Array<{ name: string; total: number }>;
  /** The sources tab: leads counted from LEADS; won/lost/revenue/winRate/
   *  avgValue from OPPORTUNITIES (the reference's split model). */
  leadSources: Array<{
    source: string;
    leads: number;
    won: number;
    lost: number;
    revenue: number;
    winRate: string;
    avgValue: number;
  }>;
  /** Session-27 (S27-P1): the COMPUTED health distribution (name/value pairs for the pie). */
  accountHealth: Array<{ name: string; value: number }>;
  topAccounts: Array<{ id: string; name: string; revenue: number; industry: string | null }>;
  atRiskAccounts: Array<{ id: string; name: string; daysSinceActivity: number; health: string }>;
  accountSummary: Array<{ id: string; name: string; industry: string | null; status: string; contacts: number; openLeads: number }>;
  /** WON opps slice(0,10) — Deal/Account/Amount rows. */
  recentWonDeals: Array<{ id: string; name: string; account: string | null; amount: number }>;
  /** ALL opps amount-desc slice(0,10) — Deal/Stage/Amount rows. */
  topDeals: Array<{ id: string; name: string; stage: string; amount: number }>;
  // ---- Session-10 (S10-8): tab 2–4 additions -------------------------------
  /** Fixed 4-bucket aging list (AGING_BUCKETS; all buckets present at zero). */
  agingPipeline: Array<{ label: string; count: number }>;
  /** The tab-2 wide chart + its "Average Accuracy: N%" caption (strings —
   *  the reference's toFixed(1) chain). */
  forecastingAccuracy: {
    points: Array<{ month: string; forecasted: number; actual: number; accuracy: string | number }>;
    average: string;
  };
  /** Session-27 (S27-P4): the FIXED 4 probability bands with value sums (the reference's pie data). */
  forecastByProbability: Array<{ band: string; value: number }>;
  /** Open deals table rows (Deal/Stage/Amount) — slice(0,10), list order. */
  openDealsByStage: Array<{ id: string; deal: string; stage: string; amount: number }>;
  /** Open opps with no linked activity for >14 days (Deal/Account/Amount) — slice(0,20). */
  dealsAtRisk: Array<{ id: string; deal: string; account: string | null; amount: number }>;
  /** Row-derived activity month series (Activities Over Time chart). */
  activitiesOverTime: Array<{ month: string; count: number }>;
  /** Months with activities count vs won-OPP count (Activities vs Wins chart). */
  activitiesVsWins: Array<{ month: string; activities: number; wins: number }>;
  /** Overdue activities table rows (Activity/Type/Due Date) — slice(0,20). */
  overdueActivities: Array<{ id: string; subject: string; type: string; dueAt: string | null }>;
  /** Leads list by source table rows (Lead/Source/Status). */
  leadsListBySource: Array<Lead>;
}

export interface SearchResult {
  accounts: Account[];
  contacts: Contact[];
  leads: Lead[];
}
