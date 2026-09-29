/**
 * Leads Filters popover — pure persist/restore seam (session-8, S8-5).
 *
 * The reference's "Save View" button is inert; ours is a functional
 * superset: the current filter set is persisted to localStorage under
 * LEAD_FILTERS_STORAGE_KEY and restored on the next visit. Encode/decode
 * live here as PURE functions (the component owns storage access) so the
 * contract is unit-testable: round-trips are lossless and any malformed
 * payload — bad JSON, wrong types, unknown vocabulary — decodes to null so
 * the page falls back to defaults instead of crashing or resurrecting a
 * stale vocabulary after a future rename.
 */

export interface LeadFilters {
  /** "" = all statuses. Pinned: "", New, Contacted, Qualified, Won, Lost. */
  status: string;
  /** "" = all sources. Pinned: "", Call, Email, Website, Partner, Referral. */
  source: string;
  /** null = no minimum. Non-negative integer deal value. */
  minValue: number | null;
  /** "" = any date. ISO date string (YYYY-MM-DD) otherwise. */
  followUpDate: string;
}

export const LEAD_FILTERS_STORAGE_KEY = "neo-crm.leads.view";

export const DEFAULT_LEAD_FILTERS: LeadFilters = {
  status: "",
  source: "",
  minValue: null,
  followUpDate: "",
};

/** DOM-pinned option vocabularies (live reference, 2026-09-30). The
 *  popover's Source list has FIVE options — Referral is absent from the
 *  four-option create dialog (both lists are pinned). */
export const LEAD_FILTER_STATUS_OPTIONS = ["", "New", "Contacted", "Qualified", "Won", "Lost"] as const;
export const LEAD_FILTER_SOURCE_OPTIONS = ["", "Call", "Email", "Website", "Partner", "Referral"] as const;

export function encodeLeadFilters(filters: LeadFilters): string {
  return JSON.stringify(filters);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function decodeLeadFilters(payload: string | null): LeadFilters | null {
  if (typeof payload !== "string" || payload.length === 0) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(payload);
  } catch {
    return null;
  }
  if (!isPlainObject(parsed)) return null;
  const { status, source, minValue, followUpDate } = parsed;

  if (typeof status !== "string" || !(LEAD_FILTER_STATUS_OPTIONS as readonly string[]).includes(status)) {
    return null;
  }
  if (typeof source !== "string" || !(LEAD_FILTER_SOURCE_OPTIONS as readonly string[]).includes(source)) {
    return null;
  }
  if (minValue !== null && (typeof minValue !== "number" || !Number.isInteger(minValue) || minValue < 0)) {
    return null;
  }
  if (typeof followUpDate !== "string") {
    return null;
  }

  return { status, source, minValue, followUpDate };
}

export function leadFiltersEqual(a: LeadFilters, b: LeadFilters): boolean {
  return (
    a.status === b.status &&
    a.source === b.source &&
    a.minValue === b.minValue &&
    a.followUpDate === b.followUpDate
  );
}
