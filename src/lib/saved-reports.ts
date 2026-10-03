/**
 * Saved report views — the localStorage seam (session-25, S25-P4;
 * period ids corrected session-32, S32-P4).
 *
 * The reference's "Saved Reports (N)" button opens a "Save Custom Report
 * View" dialog whose Save persists the current filter set + column
 * selection to localStorage under "crm_saved_reports" — the exact array
 * schema byte-extracted from the reference's localStorage after a live
 * save on 2026-10-01:
 *
 *   [{"id":"1790840557143","name":"Q4 Test Report",
 *     "filters":{"dateRange":"quarter","stage":"all","source":"all",
 *                "status":"all","owner":"all"},
 *     "columns":{"name":true,"account":true,"owner":true,
 *                "value":true,"stage":true,"wonDate":true},
 *     "createdAt":"2026-10-01T07:42:37.143Z"}]
 *
 * Pure encode/decode helpers (the component owns storage access) so the
 * contract is unit-testable — the established lead-filters.ts pattern:
 * round-trips are lossless and any malformed payload decodes to null so
 * the page falls back to an empty list instead of crashing.
 *
 * The period vocabulary is the reference's WIRE form (today / thisWeek /
 * thisMonth / quarter / ytd / all — today, quarter and ytd verified live
 * via saved-report probes; thisWeek/thisMonth proven by the s32 bundle
 * decode of the i3e reports filter; the ids are REPORT_PERIODS ids, so
 * the stored values are byte-faithful). Stale s25 entries carrying the
 * inferred week/month ids migrate through normalizeSavedPeriod().
 */

import { REPORT_PERIODS } from "@/lib/constants";

export interface SavedReportFilters {
  /** REPORT_PERIODS id (today/thisWeek/thisMonth/quarter/ytd/all). */
  dateRange: string;
  stage: string;
  source: string;
  status: string;
  owner: string;
}

export interface SavedReportColumns {
  name: boolean;
  account: boolean;
  owner: boolean;
  value: boolean;
  stage: boolean;
  wonDate: boolean;
}

export interface SavedReport {
  /** Date.now() as a string — the reference's id scheme. */
  id: string;
  name: string;
  filters: SavedReportFilters;
  columns: SavedReportColumns;
  /** ISO timestamp. */
  createdAt: string;
}

export const SAVED_REPORTS_STORAGE_KEY = "crm_saved_reports";

/** The reference's six column checkboxes, in its display order. */
export const REPORT_COLUMNS: { key: keyof SavedReportColumns; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "account", label: "Account" },
  { key: "owner", label: "Owner" },
  { key: "value", label: "Value" },
  { key: "stage", label: "Stage" },
  { key: "wonDate", label: "Won Date" },
];

export const DEFAULT_SAVED_COLUMNS: SavedReportColumns = {
  name: true,
  account: true,
  owner: true,
  value: true,
  stage: true,
  wonDate: true,
};

export function encodeSavedReports(list: SavedReport[]): string {
  return JSON.stringify(list);
}

/** Session-32 (S32-P4): migrate a stored dateRange id to the current
 * REPORT_PERIODS wire vocabulary. The s25 ids were
 * today/week/month/quarter/ytd/all — week/month were INFERRED (the s32
 * bundle decode proves the reference's wire ids are thisWeek/thisMonth).
 * Stale localStorage entries carrying the legacy ids keep their meaning;
 * unknown values fall back to the default period ("quarter") so a Load
 * never 400s the API. */
export function normalizeSavedPeriod(raw: string): string {
  if (raw === "week") return "thisWeek";
  if (raw === "month") return "thisMonth";
  return REPORT_PERIODS.some((p) => p.id === raw) ? raw : "quarter";
}

export function decodeSavedReports(raw: string | null): SavedReport[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const list: SavedReport[] = [];
    for (const item of parsed) {
      if (typeof item !== "object" || item === null) return null;
      const r = item as Record<string, unknown>;
      if (
        typeof r.id !== "string" ||
        typeof r.name !== "string" ||
        typeof r.createdAt !== "string" ||
        typeof r.filters !== "object" ||
        r.filters === null ||
        typeof r.columns !== "object" ||
        r.columns === null
      ) {
        return null;
      }
      const f = r.filters as Record<string, unknown>;
      const c = r.columns as Record<string, unknown>;
      if (
        typeof f.dateRange !== "string" ||
        typeof f.stage !== "string" ||
        typeof f.source !== "string" ||
        typeof f.status !== "string" ||
        typeof f.owner !== "string"
      ) {
        return null;
      }
      const columns: SavedReportColumns = {
        name: c.name === true,
        account: c.account === true,
        owner: c.owner === true,
        value: c.value === true,
        stage: c.stage === true,
        wonDate: c.wonDate === true,
      };
      list.push({
        id: r.id,
        name: r.name,
        createdAt: r.createdAt,
        filters: { dateRange: f.dateRange, stage: f.stage, source: f.source, status: f.status, owner: f.owner },
        columns,
      });
    }
    return list;
  } catch {
    return null;
  }
}

/** The reference's saved-item date display: M/D/YYYY. */
export function savedReportDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

/** Read the list from localStorage (null-safe — SSR + malformed JSON).
 *  Session-45 (S45-P2): merely touching window.localStorage throws
 *  SecurityError under all-cookies-blocked Chromium — the read rides a
 *  try/catch so a blocked storage falls back to the empty list (the
 *  first-paint default), never an uncaught timer exception upstream. */
export function listSavedReports(): SavedReport[] {
  if (typeof window === "undefined") return [];
  try {
    return decodeSavedReports(window.localStorage.getItem(SAVED_REPORTS_STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

/** Append + persist; returns the new count. */
export function saveReport(input: {
  name: string;
  filters: SavedReportFilters;
  columns: SavedReportColumns;
}): number {
  if (typeof window === "undefined") return 0;
  const list = listSavedReports();
  list.push({
    id: String(Date.now()),
    name: input.name,
    filters: input.filters,
    columns: input.columns,
    createdAt: new Date().toISOString(),
  });
  window.localStorage.setItem(SAVED_REPORTS_STORAGE_KEY, encodeSavedReports(list));
  return list.length;
}
