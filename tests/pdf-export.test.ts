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
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
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
