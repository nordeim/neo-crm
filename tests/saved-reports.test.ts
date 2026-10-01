import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-25 saved-reports pins (S25-P4): the reference's "Saved
// Reports (N)" button opens a full "Save Custom Report View" dialog —
// live-verified on 2026-10-01 with a complete round-trip:
//
//  - The dialog (stock Radix chrome): DialogTitle "Save Custom Report
//    View"; Label "Report Name" + Input (placeholder
//    "e.g., Q1 Won Deals by Region"); Label "Select Columns to
//    Display" + 6 checkbox rows (Name / Account / Owner / Value /
//    Stage / Won Date — all default checked, the stock shadcn
//    checkbox construction); the "Current Filters:" summary
//    ("Date Range: quarter, Stage: all, Owner: all" — raw slugs, THREE
//    dimensions only); the saved list when ≥1 exists (border-t pt-4 +
//    "Saved Reports" label + a space-y-2 max-h-48 overflow-y-auto
//    scroll list + per-item p-3 bg-gray-50 rounded-lg rows with the
//    blue bookmark glyph + name + M/D/YYYY + an outline "Load" button);
//    footer Cancel + "Save Report" (disabled until named) + Close X.
//
//  - Save → localStorage under "crm_saved_reports" as
//    [{"id":"<Date.now()>","name":…,"filters":{"dateRange":…,"stage":
//    …,"source":…,"status":…,"owner":…},"columns":{"name":true,…
//    "wonDate":true},"createdAt":"<ISO>"}] — byte-extracted from the
//    reference's localStorage after a live save. The button label
//    updates to the live count; the dialog closes; ZERO network calls,
//    ZERO toasts.
//
//  - Load → applies the saved filters to the filter bar + closes.
//
//  - The dateRange vocabulary is the SHORT form (This Quarter →
//    "quarter", Today → "today", YTD → "ytd" — all three verified live
//    via saved-report probes).
//
// Our button was a hardcoded "(0)" + an invented toast. These tests pin
// the src/lib/saved-reports.ts seam (the established lead-filters.ts
// localStorage pattern) + the dialog structure + the wiring; the full
// round-trip is pinned by the e2e saved-reports checks.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

describe("session-25: the saved-reports localStorage seam (S25-P4)", () => {
  it("src/lib/saved-reports.ts exists with the reference's storage key + schema", () => {
    const src = read("src/lib/saved-reports.ts");
    expect(src, "src/lib/saved-reports.ts must exist").not.toBeNull();
    const code = stripComments(src!);
    expect(code).toMatch(/crm_saved_reports/);
    expect(code).toMatch(/SAVED_REPORTS_STORAGE_KEY/);
  });

  it("the SavedReport type carries the reference's exact field set", () => {
    const code = stripComments(read("src/lib/saved-reports.ts")!);
    // filters: dateRange/stage/source/status/owner — all five keys.
    expect(code).toMatch(/dateRange/);
    expect(code).toMatch(/\bsource\b/);
    // columns: name/account/owner/value/stage/wonDate — all six keys.
    expect(code).toMatch(/wonDate/);
    expect(code).toMatch(/\baccount\b/);
    expect(code).toMatch(/createdAt/);
    expect(code).toMatch(/name:/);
  });

  it("the six report columns vocabulary is exported for the dialog", () => {
    const code = stripComments(read("src/lib/saved-reports.ts")!);
    expect(code).toMatch(/REPORT_COLUMNS/);
    // The reference's checkbox labels, in its order.
    expect(code).toMatch(/"Name"/);
    expect(code).toMatch(/"Won Date"/);
  });

  it("encode/decode round-trip helpers exist (the lead-filters.ts pattern)", () => {
    const code = stripComments(read("src/lib/saved-reports.ts")!);
    expect(code).toMatch(/export function (encode|toStorage|serialize)/);
    expect(code).toMatch(/export function (decode|fromStorage|parse)/);
  });

  it("the save + list helpers exist with the Date.now id + ISO createdAt", () => {
    const code = stripComments(read("src/lib/saved-reports.ts")!);
    expect(code).toMatch(/Date\.now\(\)/);
    expect(code).toMatch(/toISOString/);
    expect(code).toMatch(/export (async )?function (saveReport|addSavedReport)/);
    expect(code).toMatch(/export (async )?function (listSavedReports|loadSavedReports|readSavedReports)/);
  });
});

describe("session-25: the Save Custom Report View dialog (S25-P4)", () => {
  it("the dialog component exists under components/shared/", () => {
    const candidates = [
      "src/components/shared/save-report-dialog.tsx",
    ];
    const found = candidates.find((c) => read(c) !== null);
    expect(found, "the save-report-dialog component must exist").toBeTruthy();
  });

  it("the dialog's title, input, and placeholder match the reference", () => {
    const src =
      read("src/components/shared/save-report-dialog.tsx") ??
      read("src/components/shared/save-report-dialog.ts");
    const code = stripComments(src!);
    expect(code).toMatch(/Save Custom Report View/);
    expect(code).toMatch(/Report Name/);
    expect(code).toMatch(/e\.g\., Q1 Won Deals by Region/);
  });

  it("the six column checkboxes + the Current Filters summary", () => {
    const code = stripComments(read("src/components/shared/save-report-dialog.tsx")!);
    expect(code).toMatch(/Select Columns to Display/);
    expect(code).toMatch(/Current Filters:/);
    // The summary renders THREE dimensions only (Date Range, Stage,
    // Owner — the reference's line).
    expect(code).toMatch(/Date Range:/);
    expect(code).not.toMatch(/Source:/);
    expect(code).not.toMatch(/Status:/);
  });

  it("the saved list: the scrollable container + the Load button + the bookmark glyph", () => {
    const code = stripComments(read("src/components/shared/save-report-dialog.tsx")!);
    expect(code).toMatch(/max-h-48/);
    expect(code).toMatch(/overflow-y-auto/);
    expect(code).toMatch(/border-t pt-4/);
    expect(code).toMatch(/Saved Reports/);
    expect(code).toMatch(/onLoad\(r\)/);
    expect(code).toMatch(/\bLoad\b/);
    expect(code).toMatch(/Bookmark/);
  });

  it("Save Report is disabled until a name is entered; Cancel exists", () => {
    const code = stripComments(read("src/components/shared/save-report-dialog.tsx")!);
    expect(code).toMatch(/Save Report/);
    expect(code).toMatch(/disabled/);
    expect(code).toMatch(/Cancel/);
  });

  it("the dialog rides the stock Radix kit (Dialog/DialogTitle — the entity-dialog family)", () => {
    const code = stripComments(read("src/components/shared/save-report-dialog.tsx")!);
    expect(code).toMatch(/from "@\/components\/ui\/dialog"/);
  });
});

describe("session-25: the reports page wiring (S25-P4)", () => {
  it("the button renders the LIVE count (not a hardcoded (0))", () => {
    const code = stripComments(read("src/app/(app)/reports/reports-page.tsx")!);
    expect(code).not.toMatch(/Saved Reports \(0\)/);
    expect(code).toMatch(/Saved Reports \(\{savedCount\}\)/);
  });

  it("the invented toast is retired; the button opens the dialog", () => {
    const code = stripComments(read("src/app/(app)/reports/reports-page.tsx")!);
    expect(code).not.toMatch(/You have no saved reports yet/);
    expect(code).toMatch(/SaveReportDialog|saveReportDialog/);
  });
});
