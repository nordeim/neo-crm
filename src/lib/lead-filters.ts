/**
 * Leads Filters popover — the pure seam (session-8, re-scoped session-29).
 *
 * The reference's Gke popover contract (bundle-extracted + LIVE-verified
 * this session): the Status/Source selects store RAW values with explicit
 * "All Status"/"All Sources" items bound to the "all" sentinel; the
 * trigger gains the "(Active)" suffix while any filter is set; Save View
 * fires the native prompt("Enter view name:") and the saved views render
 * as a w-full sm:w-48 select that applies a view's filters on selection.
 * The reference keeps its views IN MEMORY (useState — no localStorage key,
 * live-verified); OUR persistence of the views list to localStorage stays
 * the documented functional superset (session-8).
 *
 * Encode/decode live here as PURE functions (the component owns storage
 * access) so the contract is unit-testable: round-trips are lossless and
 * any malformed payload — bad JSON, wrong types, unknown vocabulary —
 * decodes to null so the page falls back to defaults instead of crashing
 * or resurrecting a stale vocabulary after a future rename (the pre-s29
 * capitalized vocabulary decodes to null by design).
 */

export interface LeadFilters {
  /** "all" = all statuses. RAW slugs: new/contacted/qualified/won/lost. */
  status: string;
  /** "all" = all sources. RAW slugs: call/email/website/partner/referral. */
  source: string;
  /** null = no minimum. Non-negative integer deal value. */
  minValue: number | null;
  /** "" = any date. ISO date string (YYYY-MM-DD) otherwise. */
  followUpDate: string;
}

/** A named filter set — the prompt-named views of the Saved Views select. */
export interface SavedLeadView {
  name: string;
  filters: LeadFilters;
}

/** The views list (our localStorage superset; the reference is in-memory). */
export const LEAD_VIEWS_STORAGE_KEY = "neo-crm.leads.views";

export const DEFAULT_LEAD_FILTERS: LeadFilters = {
  status: "all",
  source: "all",
  minValue: null,
  followUpDate: "",
};

/** RAW option vocabularies (bundle + live verified, 2026-10-02). The
 *  popover's Source list has FIVE options — referral is absent from the
 *  four-option create dialog (both lists are pinned). */
export const LEAD_FILTER_STATUS_OPTIONS = [
  "all",
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
] as const;
export const LEAD_FILTER_SOURCE_OPTIONS = [
  "all",
  "call",
  "email",
  "website",
  "partner",
  "referral",
] as const;

export function encodeLeadFilters(filters: LeadFilters): string {
  return JSON.stringify(filters);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asFilters(parsed: unknown): LeadFilters | null {
  if (!isPlainObject(parsed)) return null;
  const { status, source, minValue, followUpDate } = parsed;
  if (
    typeof status !== "string" ||
    !(LEAD_FILTER_STATUS_OPTIONS as readonly string[]).includes(status)
  ) {
    return null;
  }
  if (
    typeof source !== "string" ||
    !(LEAD_FILTER_SOURCE_OPTIONS as readonly string[]).includes(source)
  ) {
    return null;
  }
  if (
    minValue !== null &&
    (typeof minValue !== "number" || !Number.isInteger(minValue) || minValue < 0)
  ) {
    return null;
  }
  if (typeof followUpDate !== "string") {
    return null;
  }
  return { status, source, minValue, followUpDate };
}

export function decodeLeadFilters(payload: string | null): LeadFilters | null {
  if (typeof payload !== "string" || payload.length === 0) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(payload);
  } catch {
    return null;
  }
  return asFilters(parsed);
}

export function leadFiltersEqual(a: LeadFilters, b: LeadFilters): boolean {
  return (
    a.status === b.status &&
    a.source === b.source &&
    a.minValue === b.minValue &&
    a.followUpDate === b.followUpDate
  );
}

// ---- the saved-views list (S29-P3) -----------------------------------------

export function encodeSavedLeadViews(views: SavedLeadView[]): string {
  return JSON.stringify(views);
}

export function decodeSavedLeadViews(payload: string | null): SavedLeadView[] | null {
  if (typeof payload !== "string" || payload.length === 0) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(payload);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed)) return null;
  const views: SavedLeadView[] = [];
  for (const entry of parsed) {
    if (!isPlainObject(entry)) return null;
    if (typeof entry.name !== "string" || entry.name.length === 0) return null;
    const filters = asFilters(entry.filters);
    if (!filters) return null;
    views.push({ name: entry.name, filters });
  }
  return views;
}

/** Selecting a Saved View applies its filter set. */
export function applySavedView(view: SavedLeadView): LeadFilters {
  return { ...view.filters };
}

// ---- the (Active) suffix + the overdue predicate (S29-P2/P3) ---------------

/** The reference's trigger suffix predicate:
 *  `Object.values(filters).some(v => v && v !== "all")`. */
export function filtersActive(filters: LeadFilters): boolean {
  return Object.values(filters).some((v) => v && v !== "all");
}

/** The reference's `ee`: a next-follow-up date is overdue when it is in
 *  the PAST (strict < today — today itself is not overdue). Null/empty
 *  dates never are. Drives the red border + the CircleAlert glyph. */
export function isOverdueFollowUp(value: string | null | undefined): boolean {
  if (!value) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  return d.getTime() < Date.now();
}

/** The yyyy-MM-dd slice for date inputs (our stored datetimes → the
 *  input's required format). */
export function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}
