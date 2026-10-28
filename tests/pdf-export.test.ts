import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-25 PDF export pins (S25-P2): the reference's Reports exports
// are REAL client-side PDFs — live-verified on 2026-10-01 by clicking
// every button and examining the downloaded artifacts:
//
//  (a) the header "PDF" button spawns an IFRAME.html2canvas-container,
//      renders the CONTENT area (no sidebar — VLM-verified on the
//      rendered PDF: page header + filter bar + KPI cards + tabs +
//      charts), and assembles it via jsPDF 4.0.0 (the artifact's
//      /Producer string) into A4 PORTRAIT pages (595.28 × 841.89pt)
//      split across the content height — downloading as
//      crm_reports_YYYY-MM-DD.pdf. No toast, no print dialog, no
//      loading state.
//
//  (b) the tab-2 per-table "Export PDF" buttons generate TEXT jsPDFs
//      (3.5KB): the card title (the parenthetical TRUNCATED — "Deals
//      at Risk (No Activity 14+ Days)" → "Deals at Risk"), a
//      "Generated: M/D/YYYY" line, the table's column headers, and the
//      rows — downloading as <slug>_YYYY-MM-DD.pdf
//      (open_deals_by_stage_2026-10-01.pdf, deals_at_risk_2026-10-01.pdf
//      — captured live from the reference's downloads).
//
// Our exportPdf() was a window.print() + an invented toast. These tests
// pin the new src/lib/pdf-export.ts seam + the three-button wiring; the
// actual downloads are pinned by the e2e export checks
// (tests/e2e/crm.spec.ts).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

describe("session-25: the PDF export seam (S25-P2)", () => {
  it("src/lib/pdf-export.ts exists with the two export families", () => {
    const src = read("src/lib/pdf-export.ts");
    expect(src, "src/lib/pdf-export.ts must exist").not.toBeNull();
    const code = stripComments(src!);
    expect(code).toMatch(/export (async )?function exportReportsPdf/);
    expect(code).toMatch(/export (async )?function exportTablePdf/);
  });

  it("imports jspdf + html2canvas-pro (the fork — our compiled CSS carries color-mix())", () => {
    const code = stripComments(read("src/lib/pdf-export.ts")!);
    expect(code).toMatch(/from "jspdf"/);
    expect(code).toMatch(/from "html2canvas-pro"/);
    expect(code).not.toMatch(/from "html2canvas"/);
  });

  it("package.json carries jspdf + html2canvas-pro", () => {
    const pkg = JSON.parse(read("package.json")!);
    expect(pkg.dependencies.jspdf).toBeTruthy();
    expect(pkg.dependencies["html2canvas-pro"]).toBeTruthy();
  });

  it("the header PDF: A4 portrait + the paginated addImage loop + crm_reports_<iso>.pdf", () => {
    const code = stripComments(read("src/lib/pdf-export.ts")!);
    // A4 portrait via the jsPDF constructor (the reference's artifact:
    // 595.28 × 841.89pt = jsPDF's a4 in pt units).
    expect(code).toMatch(/new jsPDF\(\{[^}]*format:\s*"a4"[^}]*\}\)/);
    expect(code).toMatch(/orientation:\s*"p"/);
    // The multi-page split: full-width image, height consumed page by page.
    expect(code).toMatch(/addPage\(\)/);
    expect(code).toMatch(/addImage\(/);
    // The reference's filename (PLURAL "reports" — vs the CSV's singular
    // "crm_report"): crm_reports_2026-10-01.pdf.
    expect(code).toMatch(/crm_reports_\$\{/);
  });

  it("the per-table PDF: title + Generated: M/D/YYYY + the table columns + <slug>_<iso>.pdf", () => {
    const code = stripComments(read("src/lib/pdf-export.ts")!);
    // The reference's text layout (pdftotext-extracted):
    //   Open Deals by Stage
    //   Generated: 10/1/2026
    //   Deal | Stage | Amount
    expect(code).toMatch(/Generated: /);
    // The filename slug helper: paren-truncating, lowercase, underscored.
    expect(code).toMatch(/function tableSlug|const tableSlug/);
    expect(code).toMatch(/\.split\("\("\)/);
  });

  it("the slug rule truncates the parenthetical (deals_at_risk, open_deals_by_stage)", () => {
    const src = read("src/lib/pdf-export.ts")!;
    expect(src).toMatch(/Deals at Risk/);
    // The rule itself is pure string logic — pin it via the module's
    // exported helper if present, else via the source pattern.
    const code = stripComments(src);
    expect(code).toMatch(/replace\(\/\[\^a-z0-9\]\+\/g/);
  });
});

describe("session-25: the three-button wiring (S25-P2)", () => {
  it("the reports header PDF button calls exportReportsPdf — NOT window.print, NOT a toast", () => {
    const code = stripComments(read("src/app/(app)/reports/reports-page.tsx")!);
    expect(code).toMatch(/exportReportsPdf/);
    expect(code).not.toMatch(/window\.print/);
    expect(code).not.toMatch(/Print dialog opened/);
    // The old exportPdf() shim is retired wholesale.
    expect(code).not.toMatch(/function exportPdf/);
  });

  it("both per-table Export PDF buttons call exportTablePdf with their own titles + columns", () => {
    const code = stripComments(read("src/app/(app)/reports/reports-page.tsx")!);
    const calls = code.match(/exportTablePdf\(/g) ?? [];
    expect(calls.length).toBeGreaterThanOrEqual(2);
    expect(code).toMatch(/Open Deals by Stage/);
    expect(code).toMatch(/Deals at Risk/);
  });

  it("no toast rides the PDF path (the reference ships zero export toasts)", () => {
    const code = stripComments(read("src/app/(app)/reports/reports-page.tsx")!);
    // Extract every onClick handler region touching the PDF exports and
    // assert none references the toaster.
    expect(code).not.toMatch(/toast\.(info|success|error)\(\s*"(Print|Export)/);
  });

  it("the per-table PDF keeps the title-derived slug (the CSV carries its own shorter prefixes)", () => {
    const code = stripComments(read("src/app/(app)/reports/reports-page.tsx")!);
    // The PDFs call exportTablePdf with the full card TITLES — the slug
    // derivation lives in the seam. (The CSV prefixes are separate,
    // shorter literals — the reference's own inconsistency.)
    expect(code).not.toMatch(/exportTablePdf\("open_deals/);
    expect(code).not.toMatch(/exportTablePdf\("deals_at_risk/);
  });
});

// ---------------------------------------------------------------------------
// Session-123 (F-123a3, D-123a2): the per-table PDF geometry — the 123-c
// live-walked mm-anchored constants (the reference's zero-row artifact
// stream-decoded, then byte-equal-verified through the jsPDF mm probe)
// ---------------------------------------------------------------------------

describe("session-123: the per-table PDF geometry (the 123-c live walk)", () => {
  it("the constructor rides unit mm — the reference's stream floats are mm conversions (39.685039… = 14mm)", () => {
    const code = stripComments(read("src/lib/pdf-export.ts")!);
    // The reference's artifact: margin x 39.6850393700787407 (= 14mm),
    // title baseline y 42.5197 (= 15mm), generated 62.362 (= 22mm),
    // headers 90.708 (= 32mm), columns at 14/74/134mm (flat 60mm),
    // line width 0.567 (the unit-mm DEFAULT flush — never setLineWidth).
    // VERIFIED: the mm-unit candidate's content stream is BYTE-EQUAL to
    // the reference's zero-row artifact modulo the same-day date.
    expect(code).toMatch(/unit:\s*"mm"/);
    // and NO setLineWidth anywhere in the table export (the default flush
    // emits the reference's exact 0.5670000000000001 operator)
    expect(code).not.toMatch(/setLineWidth/);
  });

  it("the text ladder: title NORMAL 16 at (14,15) · Generated NORMAL 10 at (14,22) · headers BOLD 9 at 14+i*60, y 32 · the rule gated on rows", () => {
    const code = stripComments(read("src/lib/pdf-export.ts")!);
    // the title is Helvetica-NORMAL (the reference's /F1 16 Tf — F1 is
    // Helvetica, F2 Helvetica-Bold in BOTH apps' resource dicts)
    expect(code).toMatch(/const margin = 14/);
    expect(code).toMatch(/pdf\.setFont\("helvetica", "normal"\);\s*pdf\.text\(title, margin, 15\)/);
    // the Generated line — normal 10pt at (14, 22)
    expect(code).toMatch(/pdf\.text\(`Generated: \$\{generatedDate\(\)\}`, margin, 22\)/);
    // the column headers — bold 9pt at x = margin + i * 60, y = 32 (the
    // flat 60mm column spacing, NOT span-derived)
    expect(code).toMatch(/pdf\.setFont\("helvetica", "bold"\);\s*pdf\.setFontSize\(9\)/);
    expect(code).toMatch(/pdf\.text\(c, margin \+ i \* 60, 32\)/);
    // the header rule is GATED on rows existing — the reference's zero-row
    // artifact carries NO line operators at all
    expect(code).toMatch(/drawHeader\(rows\.length > 0\)/);
    // the row ladder carries the mm frame (rowHeight 8) + the 27-char clip
    expect(code).toMatch(/const rowHeight = 8/);
    expect(code).toMatch(/text\.length > 28 \? `\$\{text\.slice\(0, 27\)\}…` : text/);
  });
});

// ---------------------------------------------------------------------------
// Session-198 (D-198a1): the advisories re-triage — the runtime chain's
// critical. bun audit drifted 9 → 12 since the s164 triage: jspdf@4.2.1
// (the DIRECT runtime dep behind this seam) ships the optional dompurify
// at 3.4.16, INSIDE the vulnerable range >=3.4.4 <=3.4.16 (critical
// GHSA-cg2g-xh64-v4q7 + high GHSA-mrv2-3pqr-j5jr + low GHSA-c6gr-qvv4-5v3f).
// The security-and-hardening triage ladder: "Is the vulnerable function
// actually called in your code path?" — NO (dompurify executes only
// inside jsPDF's html() plugin; both export paths ride html2canvas
// image-slicing + the text-mm API). The cure: the 3.4.16 → 3.4.17
// transitive refresh (semver-safe under jspdf's own ^3.3.1 floor,
// baseline-inert by decode — the four-band sweep + the full gate the
// proof). These pins hold the cure's two faces.
// ---------------------------------------------------------------------------

describe("session-198: the runtime chain's critical (the D-198a1 cure pins)", () => {
  it("the lockfile's EVERY dompurify resolution sits OUTSIDE the vulnerable range (>= 3.4.17) — a re-resolution or a nested copy regressing it goes RED", () => {
    const lock = read("bun.lock");
    expect(lock).not.toBeNull();
    // the bun.lock entry form: "dompurify": ["dompurify@3.4.17", …] — and
    // "jspdf/dompurify": ["dompurify@…" for any NESTED resolution (the
    // s198 live find: the first update attempt hoisted the root to
    // 3.4.17 while a nested jspdf/dompurify@3.4.16 SURVIVED on disk —
    // the first-match pin would have passed it. The pin scans EVERY
    // resolution).
    const resolutions = Array.from(lock!.matchAll(/dompurify@(\d+)\.(\d+)\.(\d+)/g)).map((m) => [
      Number(m[1]),
      Number(m[2]),
      Number(m[3]),
    ]);
    expect(resolutions.length).toBeGreaterThan(0);
    for (const [major, minor, patch] of resolutions) {
      const ok = major > 3 || (major === 3 && (minor > 4 || (minor === 4 && patch >= 17)));
      expect(
        ok,
        `a dompurify@${major}.${minor}.${patch} resolution sits inside the GHSA-cg2g-xh64-v4q7 vulnerable range (>=3.4.4 <=3.4.16) — the override pins the fix: overrides.dompurify = 3.4.17`,
      ).toBe(true);
    }
  });

  it("the dormancy freeze: pdf-export.ts NEVER calls .html( — dompurify's only jsPDF activation site stays dormant", () => {
    const src = read("src/lib/pdf-export.ts");
    expect(src).not.toBeNull();
    // Adopting pdf.html() would activate jsPDF's dompurify import (the
    // sanitization plugin) — a conscious act that must re-triage the
    // advisories ledger in the same commit. This pin makes it one.
    expect((src!.match(/\.html\(/g) ?? []).length).toBe(0);
  });
});
