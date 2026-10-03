import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-48 pins (S48-P4): the reports export failure-mode — N-48g, the
// F-47a mechanism's LAST instance. The reports header "Export CSV" called
// downloadFile("/api/export?type=report…") — window.location.href — so a
// non-200 (an expired session's 401 envelope, an INTERNAL 500) NAVIGATED
// the browser to the raw JSON body instead of downloading anything. The
// reference's own reports export is a CLIENT-SIDE blob (bundle-verified:
// new Blob([N]) + a programmatic anchor — it cannot fail-navigate); our
// s25 architecture keeps the route as the single-source filter/artifact
// seam, so the fix is the fetch→blob flow: fetch → !res.ok → the s46
// convention toast ("Could not export report") → ok → res.text() → the
// Content-Disposition filename (fallback csvFilename("crm_report")) →
// downloadBlob. The artifact bytes stay EXACTLY the route's (BOM + CRLF +
// escapeCell quoting — the s25-pinned convention). downloadFile itself
// retires (this was its sole remaining consumer; the navigation seam
// leaves the codebase with it).

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

describe("session-48: the reports export failure-mode (S48-P4, N-48g)", () => {
  it("the reports page carries ZERO downloadFile references (no navigation seam)", () => {
    const src = stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");
    expect(src).not.toMatch(/downloadFile/);
    // The blob family remains the page's download mechanism.
    expect(src).toMatch(/downloadBlob/);
  });

  it("the export is the fetch→blob flow with the s46 failure vocabulary", () => {
    const src = stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");
    // The guarded fetch (non-200 → the envelope toast, never a navigation).
    expect(src).toMatch(/await fetch\(/);
    expect(src).toMatch(/res\.ok/);
    expect(src).toMatch(/toast\.error\("Could not export report"/);
    // The artifact round-trip: the route's text + its own filename.
    expect(src).toMatch(/downloadBlob\(/);
    expect(src).toMatch(/content-disposition/i);
    expect(src).toMatch(/csvFilename\("crm_report"\)/);
  });

  it("downloadFile is retired from the download helper (its last consumer gone)", () => {
    const src = stripComments(read("src/lib/download.ts") ?? "");
    // The window.location.href seam leaves the codebase entirely; the
    // blob family (downloadBlob) stays.
    expect(src).not.toMatch(/downloadFile/);
    expect(src).not.toMatch(/window\.location\.href/);
    expect(src).toMatch(/export function downloadBlob/);
  });
});
