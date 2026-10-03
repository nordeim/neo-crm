import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-45 pins (S45-P1): the reports PDF export rejection guard —
// the F-45a audit. The header PDF button was
// `onClick={() => void exportReportsPdf()}` — the `void` discards a
// genuinely rejectable promise (html2canvas-pro rejects on
// huge-canvas/memory failures and mid-capture DOM mutations; the
// helper has no internal catch), leaving an unhandled rejection + a
// dead-feeling button with no toast — the only rejectable void-async
// in src (the s43-P4/s44-P4 unwrapped-surface family, DOM-capture
// seam). The per-table exportTablePdf twins are synchronous jsPDF text
// layouts — not rejectable, out of scope. The fix: the s44-P4
// convention (surface it, never strand it); the happy path unchanged
// (the e2e download checks stay green).

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

const page = () => stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");

describe("session-45: the reports PDF export surfaces rejections (S45-P1)", () => {
  it("the header PDF button catches the exportReportsPdf rejection (no bare void)", () => {
    const src = page();
    // The CALL site (parens) — not the import at the top of the file.
    const at = src.indexOf("exportReportsPdf(");
    expect(at).toBeGreaterThanOrEqual(0);
    const call = src.slice(at, at + 200);
    expect(call).toMatch(/exportReportsPdf\(\)\s*\.\s*catch\(/);
  });

  it("the catch toasts the export-failure vocabulary (the s44-P4 convention)", () => {
    const src = page();
    const at = src.indexOf("exportReportsPdf(");
    const call = src.slice(at, at + 260);
    expect(call).toMatch(/toast\.error\(\s*"Could not export PDF"/);
    expect(call).toMatch(/Please try again\./);
  });
});
