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
  revenueOverTime: Array<{ month: string; won: number; lost: number; target: number }>;
  pipeline: Array<{ stage: string; label: string; count: number; value: number; color: string }>;
  funnel: Array<{ id: string; label: string; count: number; color: string }>;
  activitiesByType: Array<{ type: string; label: string; count: number; color: string }>;
  activitiesByOwner: Array<{ name: string; avatarColor: string; calls: number; emails: number; meetings: number; total: number }>;
  leadSources: Array<{ source: string; leads: number; won: number; value: number; winRate: number }>;
  accountHealth: Array<{ status: string; label: string; count: number; color: string }>;
  topAccounts: Array<{ id: string; name: string; revenue: number; industry: string | null }>;
  atRiskAccounts: Array<{ id: string; name: string; lastActivityAt: string | null; status: string }>;
  accountSummary: Array<{ id: string; name: string; industry: string | null; status: string; contacts: number; openLeads: number }>;
  recentWonDeals: Array<Lead>;
  topDeals: Array<Lead>;
  wonVsLostOverTime: Array<{ month: string; won: number; lost: number }>;
}

export interface SearchResult {
  accounts: Account[];
  contacts: Contact[];
  leads: Lead[];
}
