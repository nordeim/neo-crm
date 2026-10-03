import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-47 pins (S47-P1): the dashboard export rewire — the F-47a audit.
// The five affordances (the outline Export's four menu items + the primary
// Export) rode downloadFile("/api/export?type=…&download=1") — dead since
// the s29 re-scope (export/route.ts answers type=report only; every entity
// click NAVIGATED the browser to the raw 400 JSON body). The reference's
// own header trio is dead (no onClick — bundle-verified); ours is the
// DOCUMENTED functional superset (dashboard-contracts.test.ts:284-291),
// now wired to the CLIENT-SIDE entity-export family — the pages' own
// s26/s29 conventions verbatim: the builders, the filenames, the
// zero-guards. Zero e2e coverage is how 18 green sessions missed it (one
// new e2e closes the gap).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const page = () => stripComments(read("src/app/(app)/page.tsx") ?? "");

/** Slice a bounded region at an anchor (a failed anchor fails the pin). */
function regionAt(src: string, anchor: string, span: number): string {
  const at = src.indexOf(anchor);
  expect(at).toBeGreaterThanOrEqual(0);
  return src.slice(at, at + span);
}

describe("session-47: the dashboard export rewire (S47-P1, F-47a)", () => {
  it("the page carries ZERO /api/export references and ZERO downloadFile calls", () => {
    const src = page();
    expect(src).not.toMatch(/\/api\/export/);
    expect(src).not.toMatch(/downloadFile/);
    // The client-side family is the download seam now.
    expect(src).toMatch(/downloadBlob/);
  });

  it("the four menu items call the four builder functions (no inline wiring)", () => {
    const src = page();
    // The onClick precedes the JSX children — slice BACKWARD from each
    // item's text node to its opening tag.
    const itemRegion = (text: string): string => {
      const at = src.indexOf(`>${text}</DropdownItem>`);
      expect(at).toBeGreaterThanOrEqual(0);
      return src.slice(Math.max(0, src.lastIndexOf("<DropdownItem", at)), at + text.length);
    };
    expect(itemRegion("Leads")).toMatch(/onClick=\{exportLeadsCsv\}/);
    expect(itemRegion("Contacts")).toMatch(/onClick=\{exportContactsCsv\}/);
    expect(itemRegion("Accounts")).toMatch(/onClick=\{exportAccountsCsv\}/);
    expect(itemRegion("Activities")).toMatch(/onClick=\{exportActivitiesCsv\}/);
  });

  it("the primary Export is the one-click leads export (the documented job)", () => {
    const src = page();
    const at = src.indexOf("DASHBOARD_HEADER.primaryExportLabel");
    expect(at).toBeGreaterThanOrEqual(0);
    // The button's opening tag (onClick precedes the label node).
    const region = src.slice(Math.max(0, src.lastIndexOf("<Button", at)), at + 200);
    expect(region).toMatch(/onClick=\{exportLeadsCsv\}/);
  });

  it("the leads builder = the leads-page convention verbatim (unquotedHeaderCsv, 8 columns, entityExportFilename)", () => {
    const src = page();
    const region = regionAt(src, "function exportLeadsCsv", 800);
    expect(region).toMatch(/unquotedHeaderCsv\(/);
    expect(region).toMatch(/entityExportFilename\("Leads"\)/);
    expect(region).toMatch(/downloadBlob\(/);
    // The reference's 8-column set, in its order (the S29-P5 U-bundle extract).
    for (const col of ["Name", "Email", "Phone", "Company", "Value", "Status", "Source", "Next Follow-up"]) {
      expect(region).toContain(`"${col}"`);
    }
    // The rows come from the store's leads slice.
    expect(region).toMatch(/leads\.map\(/);
  });

  it("the contacts builder = the contacts-page convention verbatim (toQuotedCsv, 7 columns, zero-guard)", () => {
    const src = page();
    const region = regionAt(src, "function exportContactsCsv", 800);
    expect(region).toMatch(/toQuotedCsv\(/);
    expect(region).toMatch(/csvFilename\("contacts"\)/);
    expect(region).toMatch(/contacts\.length === 0\) return/);
    for (const col of ["Name", "Email", "Phone", "Company", "Position", "Status", "Source"]) {
      expect(region).toContain(`"${col}"`);
    }
    expect(region).toMatch(/contacts\.map\(/);
  });

  it("the accounts + activities builders = the page/settings conventions (10 columns / the raw dump)", () => {
    const src = page();
    const accounts = regionAt(src, "function exportAccountsCsv", 900);
    expect(accounts).toMatch(/toQuotedCsv\(/);
    expect(accounts).toMatch(/csvFilename\("accounts"\)/);
    expect(accounts).toMatch(/accounts\.length === 0\) return/);
    for (const col of ["Name", "Industry", "Phone", "Email", "Website", "Annual Revenue", "Employees", "Status", "Tier", "Health"]) {
      expect(accounts).toContain(`"${col}"`);
    }
    // The activities export = the settings raw-dump family (the repo's only
    // activities-CSV convention): entityDumpCsv + activity_ISO.csv.
    const activities = regionAt(src, "function exportActivitiesCsv", 500);
    expect(activities).toMatch(/entityDumpCsv\(activities\)/);
    expect(activities).toMatch(/entityExportFilename\("Activity"\)/);
    expect(activities).toMatch(/activities\.length === 0\) return/);
  });
});
