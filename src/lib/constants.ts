// Canonical vocabularies + presentation metadata for the CRM domain.
// Every status vocabulary is distinct — never mix them (scaffold convention).

export const LEAD_STAGES = [
  "new",
  "contacted",
  "qualified",
  "unqualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];

export const OPEN_STAGES: readonly string[] = ["new", "contacted", "qualified", "proposal", "negotiation"];

/** Stages that end a deal — "Dropped Deals" counts both (session-5). */
export const DROPPED_STAGES: readonly string[] = ["lost", "unqualified"];

/** True when a lead stage ends the deal (lost or unqualified). */
export function isDroppedStage(stage: string): boolean {
  return DROPPED_STAGES.includes(stage);
}

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
  // Session-5: the reference's Create Lead dialog offers Unqualified as a
  // fourth status (live listbox: New/Contacted/Qualified/Unqualified). Grey
  // badge — the reference renders no badge for it we can extract, so it
  // shares the neutral pill.
  unqualified: { label: "Unqualified", badge: "bg-gray-100 text-gray-600 border-gray-200", color: "#9ca3af" },
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
  unqualified: "Unqualified",
};

// Session-5 (re-scoped session-29): the reference's lead Create/Edit
// dialogs and the dashboard source surfaces store RAW values — value
// "call", label "Call" (bundle-extracted from the Tke/Mke selects; the
// s28 contact-source precedent). Referral exists in the FILTERS popover's
// five-option list only — no dialog can create it.
export const LEAD_SOURCES = ["call", "email", "website", "partner"] as const;
export const LEAD_SOURCE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "website", label: "Website" },
  { value: "partner", label: "Partner" },
];

// Session-29 (S29-P2, the C2 bundle extract): the leads table's INLINE
// status select ships EXACTLY the five raw options — the table's
// 5-status set (new/contacted/qualified/won/lost), NOT the 8-stage
// vocabulary and NOT the edit dialog's 4-option set.
export const LEAD_INLINE_STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

// ---------------------------------------------------------------------------
// Session-10 vocabulary pins (reports/chart internals — DOM-verified on the
// live reference at 1512×945, 2026-09-30; pinned by tests/constants.test.ts).
// ---------------------------------------------------------------------------

/**
 * S10-6: the reference's reports tab-1 "Pipeline by Stage" chart renders
 * EIGHT raw slug X ticks — a merged-list quirk (its dashboard aliases
 * new≡Prospecting and qualified≡Qualification, plus won≡closed_won, all
 * leaked into one list, raw snake_case, no title-casing). Mirrored per the
 * strict-mirror precedent ("Add new industrie" typo, dead controls).
 */
export const REPORTS_PIPELINE_SLUGS = [
  "new",
  "contacted",
  "qualified",
  "prospecting",
  "qualification",
  "proposal",
  "negotiation",
  "closed_won",
] as const;

/**
 * S10-6 (zero-data-informed mapping, quirk register): converts per-stage
 * lead counts (our vocabulary) into the reference's 8-slug bucket list.
 * The reference's merged list double-reports its new leads under both
 * "new" and "prospecting" and its qualified leads under both "qualified"
 * and "qualification"; won maps to closed_won. Counts input uses OUR stage
 * vocabulary; see /api/reports.
 */
export function reportsBucketCounts(
  counts: Record<string, number>,
): Array<{ slug: string; count: number }> {
  const stageCount = (s: string) => counts[s] ?? 0;
  return REPORTS_PIPELINE_SLUGS.map((slug) => ({
    slug,
    count:
      slug === "prospecting"
        ? stageCount("new")
        : slug === "qualification"
          ? stageCount("qualified")
          : slug === "closed_won"
            ? stageCount("won")
            : stageCount(slug),
  }));
}

/**
 * S10-7: the reference's Conversion Funnel is a recharts FunnelChart with
 * FOUR trapezoid groups (leads page AND reports tab 1) — the same 4-stage
 * vocabulary as the leads page's "Pipeline Value by Stage" chart.
 */
export const FUNNEL_STAGES = ["new", "qualified", "won", "lost"] as const;

/**
 * Session-27 (S27-P9, bundle-extracted from the reference's leads `Xke`
 * component): the LEADS Conversion Funnel's true vocabulary — the labels
 * are New Leads / Contacted / Qualified / Won (NOT the FUNNEL_STAGES
 * new/qualified/won/lost our scaffold inferred from the zero-data DOM,
 * where the funnel renders nothing and the sibling chart's ticks elide
 * "Contacted" at 331px). The counts are STATUS-CUMULATIVE:
 *
 *   New Leads  = status "new"
 *   Contacted  = status in [contacted, qualified, won]
 *   Qualified  = status in [qualified, won]
 *   Won        = status "won"
 */
export const LEADS_FUNNEL = [
  { id: "new-leads", label: "New Leads", fill: "#3b82f6" },
  { id: "contacted", label: "Contacted", fill: "#8b5cf6" },
  { id: "qualified", label: "Qualified", fill: "#10b981" },
  { id: "won", label: "Won", fill: "#22c55e" },
] as const;

/**
 * Session-27 (S27-P11, bundle-extracted `B` map): the calendar's
 * event-type CHIP tints — the day-cell chips + rail rows carry
 * bg-*-100 / text-*-800 SURFACES with solid bg-*-600 DOTS (meeting blue /
 * call green / demo purple / task orange / reminder yellow / appointment
 * cyan). The solid EVENT_TYPE_META.color entries stay on the quick-log
 * + agenda-dot surfaces that already use them.
 */
export const EVENT_TYPE_CHIP: Record<string, { bg: string; text: string; dot: string }> = {
  meeting: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-600" },
  call: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-600" },
  demo: { bg: "bg-purple-100", text: "text-purple-800", dot: "bg-purple-600" },
  task: { bg: "bg-orange-100", text: "text-orange-800", dot: "bg-orange-600" },
  reminder: { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-600" },
  appointment: { bg: "bg-cyan-100", text: "text-cyan-800", dot: "bg-cyan-600" },
};

/**
 * S10-8: the reference's tab-2 "Aging Pipeline" bar chart renders 4 bar
 * rects at zero — a FIXED bucket list (ticks <30 days / 30-60 days /
 * >90 days render; the 60-90 label elides at 331px — recharts tick
 * elision, the DATA list is 4).
 */
export const AGING_BUCKETS = [
  { label: "<30 days", min: 0, max: 30 },
  { label: "30-60 days", min: 30, max: 60 },
  { label: "60-90 days", min: 60, max: 90 },
  { label: ">90 days", min: 90, max: Number.POSITIVE_INFINITY },
] as const;


// Session-5: the reference's Create Contact dialog labels its source select
// "How did you meet?" and ships emoji-prefixed options (the trigger itself
// renders "✉️ Email"). Stored values include the emoji — mirrored exactly.
export const CONTACT_SOURCES = [
  "📞 Phone Call",
  "✉️ Email",
  "🌐 Website",
  "🤝 Partner Referral",
  "👥 Personal Referral",
] as const;

// Session-28 (S28-P1): the reference's contact model, bundle-extracted.
// Its SOURCE stores RAW values (call/email/website/partner/referral) —
// the emoji strings above are CREATE-DIALOG LABELS ONLY (its table badge
// and its CSV export carry the raw value; its EDIT dialog's source select
// is plain "Call/Email/Website/Partner/Referral" with no emojis).
export const CONTACT_SOURCE_OPTIONS = [
  { value: "call", label: "📞 Phone Call" },
  { value: "email", label: "✉️ Email" },
  { value: "website", label: "🌐 Website" },
  { value: "partner", label: "🤝 Partner Referral" },
  { value: "referral", label: "👥 Personal Referral" },
] as const;

export const CONTACT_SOURCE_LABEL: Record<string, string> = Object.fromEntries(
  CONTACT_SOURCE_OPTIONS.map((o) => [o.value, o.label]),
);

// The plain (no-emoji) source options the reference's EDIT dialogs ship.
export const EDIT_SOURCE_OPTIONS = ["Call", "Email", "Website", "Partner", "Referral"] as const;

// The contact PRIORITY vocabulary: Key / Standard / At Risk (NOT the lead
// hot/warm/cold temperature — bundle `ne` map + the Pke slide-over's `i`).
export const CONTACT_PRIORITIES_REF = ["Key", "Standard", "At Risk"] as const;

export const CONTACT_PRIORITY_META: Record<string, string> = {
  Key: "bg-amber-100 text-amber-800 border-amber-300",
  Standard: "bg-blue-100 text-blue-800 border-blue-300",
  "At Risk": "bg-red-100 text-red-800 border-red-300",
};

// The contact ROLE vocabulary — the inline table select's five options
// (bundle `kke` + the row's inline Select).
export const CONTACT_ROLES = [
  "Decision Maker",
  "Key Contact",
  "Influencer",
  "End User",
  "Other",
] as const;

export const ENGAGEMENT_LEVELS = ["High", "Medium", "Low"] as const;

// The 3-bar engagement cell classes — the TABLE variant ships the -500s
// with shadow-sm; the slide-over hero uses the -600 solids (its own
// inconsistency, mirrored).
export const ENGAGEMENT_BARS = {
  High: "bg-green-500 shadow-sm",
  Medium: "bg-yellow-500 shadow-sm",
  Low: "bg-red-500 shadow-sm",
  empty: "bg-gray-200",
} as const;

export const ENGAGEMENT_BARS_SOLID = {
  High: "bg-green-600",
  Medium: "bg-yellow-600",
  Low: "bg-red-600",
  empty: "bg-gray-200",
} as const;

export function engagementBarCount(level: string | null | undefined): number {
  if (level === "High") return 3;
  if (level === "Medium") return 2;
  if (level === "Low") return 1;
  return 0;
}

// The company-size filter values (stored verbatim on the model).
export const COMPANY_SIZES = ["Small (1-50)", "Medium (51-500)", "Large (500+)"] as const;

// The contact STATUS select vocabulary (the W7 edit dialog).
export const CONTACT_STATUSES = ["active", "inactive"] as const;

// The account EDIT status vocabulary — the wce select ships THREE options
// (its own superset of the create dialog's pair).
export const ACCOUNT_EDIT_STATUSES = ["active", "inactive", "prospect"] as const;

// The lead EDIT vocabularies — the Mke dialog's own inconsistencies: the
// status set is New/Contacted/Qualified/Unqualified (NOT the table's
// 5-status set) and the source has FOUR options (no Referral).
export const LEAD_EDIT_STATUSES = ["New", "Contacted", "Qualified", "Unqualified"] as const;
export const LEAD_EDIT_SOURCES = ["Call", "Email", "Website", "Partner"] as const;

// The accounts-page badge maps (bundle B/H functions): the tier badge and
// the HEALTH badge rendered under the "Status" header (the reference's own
// header/cell mismatch, mirrored).
export const ACCOUNT_TIER_BADGE: Record<string, string> = {
  Key: "bg-yellow-100 text-yellow-800",
  A: "bg-green-100 text-green-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-gray-100 text-gray-800",
};

export const ACCOUNT_HEALTH_BADGE: Record<string, string> = {
  Healthy: "bg-green-100 text-green-800",
  "At Risk": "bg-yellow-100 text-yellow-800",
  "Needs Attention": "bg-red-100 text-red-800",
};

// The ce() last-activity formatter (bundle-extracted): Never / Today /
// "1 day ago" / "N days ago" (<30) / "N months ago" (floor 30). The
// reference computes it with moment; this is the pure equivalent.
export function lastActivityCe(
  d: Date | string | null | undefined,
  now: Date | number = new Date(),
): string {
  if (!d) return "Never";
  const t = new Date(d).getTime();
  if (Number.isNaN(t)) return "Never";
  const n = typeof now === "number" ? now : now.getTime();
  const days = Math.floor((n - t) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} months ago`;
}

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

// Session-5: the reference's New Event dialog lists exactly these six event
// types in this order (live listbox: Meeting/Call/Demo/Task/Reminder/
// Appointment).
export const EVENT_TYPES = ["meeting", "call", "demo", "task", "reminder", "appointment"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_TYPE_META: Record<string, { label: string; color: string }> = {
  meeting: { label: "Meeting", color: "#f59e0b" },
  call: { label: "Call", color: "#3b82f6" },
  demo: { label: "Demo", color: "#22d3ee" },
  task: { label: "Task", color: "#10b981" },
  reminder: { label: "Reminder", color: "#f97316" },
  appointment: { label: "Appointment", color: "#8b5cf6" },
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

// Session-25 (S25-P6): the reference's SIX periods with its SHORT ids —
// its expanded listbox reads Today / This Week / This Month / This
// Quarter / YTD / All Time, and its saved-report localStorage carries
// dateRange values "today"/"quarter"/"ytd" (each verified live). The
// this_* vocabulary + the This Year option are retired.
export const REPORT_PERIODS = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "quarter", label: "This Quarter" },
  { id: "ytd", label: "YTD" },
  { id: "all", label: "All Time" },
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
  contactSources: [...CONTACT_SOURCES],
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
