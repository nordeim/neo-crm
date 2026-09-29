// Canonical vocabularies + presentation metadata for the CRM domain.
// Every status vocabulary is distinct — never mix them (scaffold convention).

export const LEAD_STAGES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];

export const OPEN_STAGES: readonly LeadStage[] = ["new", "contacted", "qualified", "proposal", "negotiation"];

export const PIPELINE_STAGES: readonly LeadStage[] = [
  "new",
  "qualified",
  "proposal",
  "negotiation",
  "won",
];

export interface StageMeta {
  label: string;
  /** Tailwind classes for a pill badge. */
  badge: string;
  /** Hex for charts. */
  color: string;
}

export const STAGE_META: Record<string, StageMeta> = {
  new: { label: "New", badge: "bg-blue-50 text-blue-700 border-blue-200", color: "#3b82f6" },
  contacted: { label: "Contacted", badge: "bg-sky-50 text-sky-700 border-sky-200", color: "#0ea5e9" },
  qualified: { label: "Qualified", badge: "bg-cyan-50 text-cyan-700 border-cyan-200", color: "#06b6d4" },
  proposal: { label: "Proposal", badge: "bg-amber-50 text-amber-700 border-amber-200", color: "#eab308" },
  negotiation: { label: "Negotiation", badge: "bg-orange-50 text-orange-700 border-orange-200", color: "#f97316" },
  // Chart hex is grey-400 on the reference dashboard pipeline (DOM-verified
  // rgb(156,163,175)); the table BADGE stays emerald via `badge` classes —
  // the reference itself splits chart vs badge colors this way.
  won: { label: "Won", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", color: "#9ca3af" },
  lost: { label: "Lost", badge: "bg-rose-50 text-rose-700 border-rose-200", color: "#ef4444" },
};

/** Dashboard funnel uses friendlier names for two stages. */
export const PIPELINE_LABELS: Record<string, string> = {
  new: "Prospecting",
  contacted: "Contacted",
  qualified: "Qualification",
  proposal: "Proposal",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

export const LEAD_SOURCES = [
  "Email",
  "Phone",
  "Website",
  "Referral",
  "Event",
  "Social Media",
  "Cold Call",
  "Advertisement",
] as const;

export const CONTACT_SOURCES = LEAD_SOURCES;

export const ACCOUNT_TIERS = ["A", "B", "C"] as const;

export const TIER_META: Record<string, { label: string; badge: string }> = {
  A: { label: "A", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  B: { label: "B", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  C: { label: "C", badge: "bg-gray-100 text-gray-600 border-gray-200" },
};

export const ACCOUNT_STATUSES = ["active", "inactive", "churned"] as const;

export const ACCOUNT_STATUS_META: Record<string, { label: string; badge: string; color: string }> = {
  active: { label: "Active", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", color: "#10b981" },
  inactive: { label: "Inactive", badge: "bg-gray-100 text-gray-600 border-gray-200", color: "#6b7280" },
  churned: { label: "Churned", badge: "bg-rose-50 text-rose-700 border-rose-200", color: "#ef4444" },
};

export const ACTIVITY_TYPES = ["call", "email", "meeting", "whatsapp", "task", "note"] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const ACTIVITY_TYPE_META: Record<string, { label: string; color: string; badge: string }> = {
  call: { label: "Call", color: "#3b82f6", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  email: { label: "Email", color: "#06b6d4", badge: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  meeting: { label: "Meeting", color: "#f59e0b", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  whatsapp: { label: "WhatsApp", color: "#22c55e", badge: "bg-green-50 text-green-700 border-green-200" },
  task: { label: "Task", color: "#8b5cf6", badge: "bg-violet-50 text-violet-700 border-violet-200" },
  note: { label: "Note", color: "#6b7280", badge: "bg-gray-100 text-gray-600 border-gray-200" },
};

export const ACTIVITY_STATUS_META: Record<string, { label: string; badge: string }> = {
  scheduled: { label: "Scheduled", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  completed: { label: "Completed", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export const EVENT_TYPES = ["appointment", "call", "meeting", "task"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_TYPE_META: Record<string, { label: string; color: string }> = {
  appointment: { label: "Appointment", color: "#8b5cf6" },
  call: { label: "Call", color: "#3b82f6" },
  meeting: { label: "Meeting", color: "#f59e0b" },
  task: { label: "Task", color: "#10b981" },
};

export const EVENT_STATUS_META: Record<string, { label: string; badge: string }> = {
  scheduled: { label: "Scheduled", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  completed: { label: "Completed", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Cancelled", badge: "bg-gray-100 text-gray-600 border-gray-200" },
};

export const CONTACT_PRIORITIES = ["hot", "warm", "cold"] as const;

export const PRIORITY_META: Record<string, { label: string; badge: string; color: string }> = {
  hot: { label: "Hot", badge: "bg-rose-50 text-rose-700 border-rose-200", color: "#ef4444" },
  warm: { label: "Warm", badge: "bg-amber-50 text-amber-700 border-amber-200", color: "#f59e0b" },
  cold: { label: "Cold", badge: "bg-sky-50 text-sky-700 border-sky-200", color: "#0ea5e9" },
};

export const REPORT_TABS = [
  { id: "sales", label: "Sales Overview" },
  { id: "pipeline", label: "Pipeline & Forecast" },
  { id: "activity", label: "Activity & Productivity" },
  { id: "sources", label: "Lead Sources" },
  { id: "health", label: "Account Health" },
] as const;

export const REPORT_PERIODS = [
  { id: "this_week", label: "This Week" },
  { id: "this_month", label: "This Month" },
  { id: "this_quarter", label: "This Quarter" },
  { id: "this_year", label: "This Year" },
  { id: "all_time", label: "All Time" },
] as const;

export const CHART_COLORS = {
  blue: "#3b82f6",
  cyan: "#06b6d4",
  teal: "#14b8a6",
  amber: "#f59e0b",
  orange: "#f97316",
  green: "#10b981",
  red: "#ef4444",
  gray: "#9ca3af",
  violet: "#8b5cf6",
  // Tailwind -400 family — the reference's stat-card mini bars render
  // bg-{color}-400 (DOM-verified on accounts/activities/dashboard cards).
  blue400: "#60a5fa",
  green400: "#4ade80",
  cyan400: "#22d3ee",
  purple400: "#c084fc",
  red400: "#f87171",
  amber400: "#fbbf24",
  emerald: "#10b981",
};

export const DEFAULT_SETTINGS = {
  contactSources: ["Email", "Phone", "Website", "Referral", "Event", "Social Media"],
  leadStages: [...LEAD_STAGES],
  activityTypes: [...ACTIVITY_TYPES],
  accountTiers: [...ACCOUNT_TIERS],
  industries: [
    "Technology",
    "Manufacturing",
    "Retail",
    "Finance",
    "Healthcare",
    "Education",
    "Logistics",
    "Energy",
  ],
  defaultCurrency: "AED",
  defaultLeadStage: "new",
  defaultTier: "B",
  followUpDays: 3,
  calendarView: "month",
  firstDayOfWeek: "monday",
} as const;
