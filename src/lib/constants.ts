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
// Session-58 (S58-P2, N-58b): `export type LeadStage =
// (typeof LEAD_STAGES)[number]` RETIRED here — definition-only since
// birth (zero non-definition references repo-wide; the `defaultLeadStage`
// settings FIELD is a different identifier). The s48/s49/s54 retirement
// policy, TYPE variant. The array + its consumers stay.

// Session-54 (S54-P2, N-54b): OPEN_STAGES + DROPPED_STAGES/isDroppedStage
// RETIRED here — each had zero src consumers (the OPEN_STAGES set was a
// pre-s29 scaffold whose "Open = not-won" reading the live KPI
// contradicts; isDroppedStage's "dropped = lost + unqualified" reading
// was the s5 vocabulary the live S29-P5 KPI ["Dropped Deals" = lost
// STRICTLY, leads-page] supersedes). The s48/s49/s53 retirement
// precedent.

// Session-31 (S31-P1): the OPPORTUNITY stage vocabulary — the reference's
// SECOND deal model (bundle-decoded from index-DZ-xbrIm.js). The reference
// ships a full Opportunity entity with NO create-edit UI (the leads
// "Convert to Opportunity" item is dead — no onClick; no New Opportunity
// dialog exists); its data feeds the dashboard, all five reports tabs, and
// both insights surfaces.
export const OPPORTUNITY_STAGES = [
  "prospecting",
  "qualification",
  "proposal",
  "negotiation",
  "closed_won",
  "closed_lost",
] as const;
export type OpportunityStage = (typeof OPPORTUNITY_STAGES)[number];

// Session-54 (S54-P2, N-54b): isClosedOppStage RETIRED here — zero src
// consumers since the s31 opportunity layer landed (the closed-branch
// checks inline `stage === "closed_won"` where needed).

/**
 * The OPP badge tints — the reference's P map (its table/insight badges):
 * prospecting blue, qualification PURPLE (not the lead cyan), proposal
 * yellow, negotiation orange, closed_won green, closed_lost red.
 */
export const OPP_STAGE_META: Record<string, { label: string; badge: string; color: string }> = {
  prospecting: { label: "Prospecting", badge: "bg-blue-100 text-blue-800", color: "#3b82f6" },
  qualification: { label: "Qualification", badge: "bg-purple-100 text-purple-800", color: "#06b6d4" },
  proposal: { label: "Proposal", badge: "bg-yellow-100 text-yellow-800", color: "#eab308" },
  negotiation: { label: "Negotiation", badge: "bg-orange-100 text-orange-800", color: "#f97316" },
  closed_won: { label: "Won", badge: "bg-green-100 text-green-800", color: "#10b981" },
  closed_lost: { label: "Lost", badge: "bg-red-100 text-red-800", color: "#ef4444" },
};

/**
 * Session-31 REDEFINITION: the dashboard's stage vocabulary IS the
 * opportunity open+won vocabulary (the reference's chart maps
 * ["prospecting","qualification","proposal","negotiation","closed_won"]
 * with VALUE sums from OPPORTUNITIES). The scaffold-era lead-stage list
 * (new/qualified/…) was a zero-data inference; the labels stay
 * Prospecting/Qualification/Proposal/Negotiation/Won via PIPELINE_LABELS.
 */
export const PIPELINE_STAGES: readonly OpportunityStage[] = [
  "prospecting",
  "qualification",
  "proposal",
  "negotiation",
  "closed_won",
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
  prospecting: "Prospecting",
  qualification: "Qualification",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Won",
  closed_lost: "Lost",
  new: "Prospecting",
  contacted: "Contacted",
  qualified: "Qualification",
  won: "Won",
  lost: "Lost",
  unqualified: "Unqualified",
};

// Session-5 (re-scoped session-29): the reference's lead Create/Edit
// dialogs and the dashboard source surfaces store RAW values — value
// "call", label "Call" (bundle-extracted from the Tke/Mke selects; the
// s28 contact-source precedent). Referral exists in the FILTERS popover's
// five-option list only — no dialog can create it.
//
// Session-49 (S49-P5, N-49c): the src-dead LEAD_SOURCES array (zero src
// consumers; only its own constants.test.ts pin read it) was REMOVED
// with the s48-P2 CONTACT_SOURCES precedent — the LIVING vocabulary is
// LEAD_SOURCE_OPTIONS below (the dialogs' own list: entity-dialogs'
// create/edit selects + the dashboard's Lead Sources rows). Source
// stays FREE-FORM at the route boundary (the s48 documented-parity
// decision — no canonical list exists to validate against).
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
 * S10-6: the reports Conversion Funnel's EIGHT raw slugs. Session-31
 * CORRECTION (bundle-decoded): the list is a CONCATENATION — the leads'
 * new/contacted/qualified counts (by lead status) followed by the
 * OPPORTUNITY five-stage counts (prospecting/qualification/proposal/
 * negotiation/closed_won). The s10 "merged-list double-report" reading
 * (new≡prospecting, qualified≡qualification, won→closed_won) was a
 * zero-data inference and is RETIRED — reports-data.ts's
 * pipelineStageCounts(leads, opps) builds the real split.
 */
// Session-54 (S54-P2, N-54b): REPORTS_PIPELINE_SLUGS RETIRED here — zero
// src consumers since the s31 split moved into pipelineStageCounts
// (whose tests/reports-data.test.ts pins the complete ordered arrays).

// Session-54 (S54-P2, N-54b): FUNNEL_STAGES RETIRED here — the s10
// zero-data scaffold vocabulary, superseded by LEADS_FUNNEL below (the
// s27 bundle extraction; pinned in leads-charts.test.ts).

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


// Session-28 (S28-P1): the reference's contact model, bundle-extracted.
// Its SOURCE stores RAW values (call/email/website/partner/referral) —
// the create dialog's emoji strings are LABELS ONLY (its table badge
// and its CSV export carry the raw value; its EDIT dialog's source select
// is plain "Call/Email/Website/Partner/Referral" with no emojis).
//
// Session-48 (S48-P2): the source-vocabulary RECONCILIATION record — the
// operator decision, landed after seven sessions of deferral. The
// vocabulary is deliberately FRAGMENTED, mirroring the reference's own
// product design (bundle-verified 2026-10-04): its settings
// contactSources is an ENTITY-BACKED CRUD list whose ONLY consumer is
// the settings page's own ConfigEditor (exactly one ContactSource.list
// query site in the bundle — it drives nothing functional); its create
// dialog HARDCODES the five emoji options below; its DB stores the raw
// values. The five disagreeing surfaces (create dialog / edit dialog /
// seed maps / CSV import arbitrary + "email" fallback / settings
// Capitalized defaults) all stand — NO enum-membership on the routes
// (a single-list guard is case-disjoint from another surface and would
// 400 the reference's own accepted arbitrary import strings), the
// settings list feeds no consumer BY DESIGN. The src-dead s5-era
// CONTACT_SOURCES constant (zero src consumers; its "stored values
// include the emoji" header comment contradicted this correction) was
// removed this session — THIS options list is the surviving vocabulary.
export const CONTACT_SOURCE_OPTIONS = [
  { value: "call", label: "📞 Phone Call" },
  { value: "email", label: "✉️ Email" },
  { value: "website", label: "🌐 Website" },
  { value: "partner", label: "🤝 Partner Referral" },
  { value: "referral", label: "👥 Personal Referral" },
] as const;

// Session-54 (S54-P2, N-54b): CONTACT_SOURCE_LABEL RETIRED here — a
// pre-s28 lookup scaffold with zero consumers (the surfaces read
// CONTACT_SOURCE_OPTIONS directly; the raw values store verbatim).

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
// Session-54 (S54-P2, N-54b): ACCOUNT_EDIT_STATUSES RETIRED here — a
// stale s28 decode (["active","inactive","prospect"]) with zero src
// consumers; the LIVE select maps ACCOUNT_STATUSES
// (active/inactive/churned) through ACCOUNT_STATUS_META labels
// (entity-dialogs.tsx; pinned in contact-model.test.ts).

// The lead EDIT vocabularies — the Mke dialog's own inconsistencies: the
// status set is New/Contacted/Qualified/Unqualified (NOT the table's
// 5-status set) and the source has FOUR options (no Referral).
// Session-54 (S54-P2, N-54b): the LEAD_EDIT_STATUSES/LEAD_EDIT_SOURCES
// pair RETIRED here — a pre-s50 scaffold with zero consumers since the
// s50 create-only retirement (the live EntityEditDialog fields carry
// their own option sets — the F-47c documented parity).

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

// Session-44 (S44-P1): the route-side membership vocabulary for the
// account health field — the seed's three values and the badge map's
// three keys, one named constant instead of anonymous literals (the
// ACCOUNT_STATUSES pattern).
export const ACCOUNT_HEALTH_STATUSES = ["Healthy", "At Risk", "Needs Attention"] as const;

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

// Session-54 (S54-P2, N-54b): TIER_META RETIRED here — a pre-s28 badge
// scaffold with zero consumers (the live tier badge is ACCOUNT_TIER_BADGE,
// the s28 bundle B map; pinned in contact-model.test.ts).

export const ACCOUNT_STATUSES = ["active", "inactive", "churned"] as const;

export const ACCOUNT_STATUS_META: Record<string, { label: string; badge: string; color: string }> = {
  active: { label: "Active", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", color: "#10b981" },
  inactive: { label: "Inactive", badge: "bg-gray-100 text-gray-600 border-gray-200", color: "#6b7280" },
  churned: { label: "Churned", badge: "bg-rose-50 text-rose-700 border-rose-200", color: "#ef4444" },
};

export const ACTIVITY_TYPES = ["call", "email", "meeting", "whatsapp", "task", "note"] as const;
// Session-58 (S58-P2, N-58b): `export type ActivityType` RETIRED here —
// definition-only (the LeadStage class, same retirement). The array +
// ACTIVITY_TYPE_META stay on their live consumers.

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
// Session-58 (S58-P2, N-58b): `export type EventType` RETIRED here —
// definition-only (the LeadStage class, same retirement). The array +
// EVENT_TYPE_META stay on their live consumers.

export const EVENT_TYPE_META: Record<string, { label: string; color: string }> = {
  meeting: { label: "Meeting", color: "#f59e0b" },
  call: { label: "Call", color: "#3b82f6" },
  demo: { label: "Demo", color: "#22d3ee" },
  task: { label: "Task", color: "#10b981" },
  reminder: { label: "Reminder", color: "#f97316" },
  appointment: { label: "Appointment", color: "#8b5cf6" },
};

// Session-53 (S53-P3, N-53c): EVENT_STATUS_META retired — the s27 cleanup
// left its only import (calendar-page) orphaned, and with that import gone
// the constant had zero src consumers (the s48 CONTACT_SOURCES / s49
// LEAD_SOURCES src-dead retirement precedent). The event STATUS vocabulary
// itself (scheduled/completed/cancelled — schema + seed) is untouched; only
// this never-rendered badge map is gone.

export const CONTACT_PRIORITIES = ["hot", "warm", "cold"] as const;

// Session-54 (S54-P2, N-54b): PRIORITY_META RETIRED here — the pre-s28
// hot/warm/cold badge map with zero consumers (the live contact-priority
// vocabulary is CONTACT_PRIORITIES_REF + CONTACT_PRIORITY_META — the s28
// Key/Standard/At Risk bundle `ne` map; the API validates both sets).

export const REPORT_TABS = [
  { id: "sales", label: "Sales Overview" },
  { id: "pipeline", label: "Pipeline & Forecast" },
  { id: "activity", label: "Activity & Productivity" },
  { id: "sources", label: "Lead Sources" },
  { id: "health", label: "Account Health" },
] as const;

// Session-25 (S25-P6) + Session-32 (S32-P4): the reference's SIX periods
// with its WIRE ids — its expanded listbox reads Today / This Week / This
// Month / This Quarter / YTD / All Time. The s25 ids were
// today/week/month/quarter/ytd/all (week/month inferred from the
// pattern); the s32 bundle decode of the i3e reports filter proves the
// wire ids are today/thisWeek/thisMonth/quarter/ytd/all. Stale s25
// localStorage entries migrate through normalizeSavedPeriod()
// (src/lib/saved-reports.ts).
export const REPORT_PERIODS = [
  { id: "today", label: "Today" },
  { id: "thisWeek", label: "This Week" },
  { id: "thisMonth", label: "This Month" },
  { id: "quarter", label: "This Quarter" },
  { id: "ytd", label: "YTD" },
  { id: "all", label: "All Time" },
] as const;

/**
 * Session-49 (S49-P1, pointer (a)): the reports STATUS filter
 * vocabulary — the reference's status select offers All Status / Open /
 * Won / Lost (bundle: its De-value items; "all" is the page's no-filter
 * sentinel, normalized away by notAll on the routes). ONE vocabulary
 * shared by the reports-page select and BOTH route guards (reports +
 * export) — the REPORT_PERIODS precedent. Won/lost map onto the OPP
 * stages (closed_won/closed_lost) inside the routes' where builders;
 * "open" is the post-filter (neither closed branch).
 */
export const REPORT_STATUSES = [
  { id: "open", label: "Open" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
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

// Session-41 (S41-P5): the dead DEFAULT_SETTINGS export deleted — zero
// consumers repo-wide (grep-verified), and it still carried the pre-s28
// EMOJI contact-source vocabulary (a stale session-5 leftover; the s40-P6
// dead-export precedent).
