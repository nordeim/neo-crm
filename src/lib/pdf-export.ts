"use client";

// Session-25 (S25-P2): the Reports PDF export contract — the reference's
// exports are REAL client-side PDFs, live-verified on 2026-10-01 by
// clicking every button and examining the downloaded artifacts:
//
//  (a) the header "PDF" button renders the CONTENT area (no sidebar)
//      through html2canvas and assembles it via jsPDF into A4 portrait
//      pages split across the content height — downloading as
//      crm_reports_YYYY-MM-DD.pdf (the artifact's /Producer string read
//      "jsPDF 4.0.0"; the reference's 19MB two-page capture).
//
//  (b) the tab-2 per-table "Export PDF" buttons generate TEXT jsPDFs
//      (3.5KB): the card title (the parenthetical TRUNCATED — "Deals at
//      Risk (No Activity 14+ Days)" → "Deals at Risk"), a
//      "Generated: M/D/YYYY" line, the table's column headers, and the
//      rows — downloading as <slug>_YYYY-MM-DD.pdf.
//
// html2canvas-PRO (not the classic 1.4.1 the reference ships): our
// Tailwind v4 compiled stylesheet carries 242 color-mix() calls (the
// opacity-modifier family) that the classic parser cannot read; the pro
// fork handles the modern color functions. Zero oklch in our CSS (the
// literal-hex token rule), but color-mix alone requires the fork.
//
// The previous implementation was a window.print() + an invented toast —
// retired with the s24 click-contract lesson (a class-level pin recorded
// the buttons' looks, never their behavior).

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

/** The reference's ISO-date filename suffix: `_2026-10-01`. */
export function isoDateSuffix(d = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** The reference's "Generated:" date format: `10/1/2026` (M/D/YYYY). */
export function generatedDate(d = new Date()): string {
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

/**
 * The reference's table-artifact slug: the card title TRUNCATED at the
 * parenthetical, lowercased, non-alphanumerics folded to underscores.
 * Live-verified pairs:
 *   "Open Deals by Stage"                     → open_deals_by_stage
 *   "Deals at Risk (No Activity 14+ Days)"    → deals_at_risk
 */
export function tableSlug(title: string): string {
  return title
    .split("(")[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * (a) The header PDF — the full-content canvas capture. The element is
 * the app's `main` scroll container; html2canvas-pro renders its full
 * scrollHeight (the whole report content, sidebar excluded — matching
 * the reference's capture), then jsPDF slices it across A4 portrait
 * pages at full width.
 */
export async function exportReportsPdf(): Promise<void> {
  const el = document.querySelector<HTMLElement>("main");
  if (!el) return;
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#f9fafb",
    windowWidth: el.scrollWidth,
    windowHeight: el.scrollHeight,
    height: el.scrollHeight,
    width: el.scrollWidth,
  });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;
  pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
  heightLeft -= pdfHeight;
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;
  }
  pdf.save(`crm_reports_${isoDateSuffix()}.pdf`);
}

/**
 * (b) The per-table PDF — the TEXT layout the reference's 3.5KB
 * artifacts carry: title, "Generated: M/D/YYYY", the column headers,
 * and the rows as a simple ruled table.
 */
export function exportTablePdf(title: string, columns: string[], rows: string[][]): void {
  const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40;
  let y = margin;

  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text(title, margin, y);
  y += 22;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Generated: ${generatedDate()}`, margin, y);
  y += 28;

  // Column geometry: equal widths across the printable span.
  const span = pageWidth - margin * 2;
  const colWidth = span / columns.length;
  const rowHeight = 22;

  const drawHeader = () => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    columns.forEach((c, i) => pdf.text(c, margin + i * colWidth, y));
    y += 6;
    pdf.setDrawColor(200);
    pdf.line(margin, y, pageWidth - margin, y);
    y += rowHeight - 6;
    pdf.setFont("helvetica", "normal");
  };
  drawHeader();

  for (const row of rows) {
    if (y > pageHeight - margin) {
      pdf.addPage();
      y = margin;
      drawHeader();
    }
    row.forEach((cell, i) => {
      const text = String(cell ?? "");
      // Clip long cells to their column span (single-line rows).
      pdf.text(text.length > 28 ? `${text.slice(0, 27)}…` : text, margin + i * colWidth, y);
    });
    y += rowHeight;
  }

  pdf.save(`${tableSlug(title)}_${isoDateSuffix()}.pdf`);
}
