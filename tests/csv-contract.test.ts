import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-25 CSV export pins (S25-P5): the reference's CSVs are
// client-side blobs downloading as prefix_YYYY-MM-DD.csv — the files
// captured live from the reference's downloads on 2026-10-01:
//
//   leads_2026-10-01.csv        Name,Email,Phone,Company,Value,Status,Source,Next Follow-up
//   crm_report_2026-10-01.csv   Deal Name,Account,Amount,Stage,Source,Owner,Close Date
//   open_deals_2026-10-01.csv   Deal,Stage,Amount
//   deals_at_risk_2026-10-01.csv Deal,Account,Amount   (19B blob spy)
//
// Note the naming inconsistencies that are the reference's OWN: the CSV
// is SINGULAR "crm_report" while the canvas PDF is PLURAL
// "crm_reports". Our clone shipped prefix-YYYYMMDD.csv, a different
// leads column set (Lead Name,…,Expected Close,Created), and the
// reports page's THREE CSV buttons were ALL wired to
// /api/export?type=leads (the leads dataset + the leads filename).
//
// The accounts/contacts header CSVs are DISABLED on the reference at
// zero data (data-gated — 21 sessions; their column sets are
// unknowable, ours stay as-is + documented). The accounts toolbar CSV
// is a no-op there; ours exports (data-gated divergence, documented).

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

describe("session-25: the CSV filename convention (S25-P5)", () => {
  it("csvFilename() emits prefix_YYYY-MM-DD.csv (underscore + ISO date)", () => {
    const code = stripComments(read("src/lib/csv.ts")!);
    // The reference: leads_2026-10-01.csv — NOT leads-20261001.csv.
    expect(code).not.toMatch(/`\$\{prefix\}-\$\{d\.getFullYear\(\)\}/);
    expect(code).toMatch(/pad\(d\.getMonth\(\) \+ 1\)/);
    expect(code).toMatch(
      /`\$\{prefix\}_\$\{d\.getFullYear\(\)\}-\$\{pad\(d\.getMonth\(\) \+ 1\)\}-\$\{pad\(d\.getDate\(\)\)\}\.cs/,
    );
  });
});

describe("session-25: the leads CSV column set (S25-P5)", () => {
  it("the export route ships the reference's 8 columns in order", () => {
    const code = stripComments(read("src/app/api/export/route.ts")!);
    const leadsBlock = code.slice(code.indexOf('type === "leads"'), code.indexOf("type === \"leads\"") + 900);
    expect(leadsBlock).toMatch(/\{ header: "Name",/);
    expect(leadsBlock).toMatch(/\{ header: "Next Follow-up",/);
    // The invented/differing columns retire.
    expect(leadsBlock).not.toMatch(/"Lead Name"/);
    expect(leadsBlock).not.toMatch(/"Expected Close"/);
    expect(leadsBlock).not.toMatch(/"Created",/);
    expect(leadsBlock).not.toMatch(/\{ header: "Stage",/);
    // Column ORDER: Name,Email,Phone,Company,Value,Status,Source,Next Follow-up.
    const headers = [...leadsBlock.matchAll(/\{ header: "([^"]+)"/g)].map((m) => m[1]);
    expect(headers).toEqual([
      "Name",
      "Email",
      "Phone",
      "Company",
      "Value",
      "Status",
      "Source",
      "Next Follow-up",
    ]);
  });
});

describe("session-25: the reports CSV wiring (S25-P5)", () => {
  it("the export route handles type=report with the reference's 7 deal columns", () => {
    const code = stripComments(read("src/app/api/export/route.ts")!);
    expect(code).toMatch(/type === "report"/);
    const reportBlock = code.slice(code.indexOf('type === "report"'));
    expect(reportBlock).toMatch(/"Deal Name"/);
    expect(reportBlock).toMatch(/"Close Date"/);
    // The report CSV is filter-aware (the same period/owner/stage/status
    // params as /api/reports).
    expect(code).toMatch(/searchParams\.get\("period"\)/);
  });

  it("the reports page's header Export CSV targets type=report (NOT leads)", () => {
    const code = stripComments(read("src/app/(app)/reports/reports-page.tsx")!);
    expect(code).not.toMatch(/\/api\/export\?type=leads/);
    expect(code).toMatch(/type=report/);
    // Filter params ride the URL (the current filter state).
    expect(code).toMatch(/period=|period: |\$\{period\}/);
  });

  it("the per-table CSVs are client-side blobs from the in-memory rows", () => {
    const code = stripComments(read("src/app/(app)/reports/reports-page.tsx")!);
    // The tables' own data flows into a client-side toCsv + downloadBlob
    // (the reference's model — blob: text/csv captured by the spy).
    expect(code).toMatch(/toCsv\(/);
    expect(code).toMatch(/downloadBlob\(/);
  });

  it("the per-table CSVs use the reference's SHORTER prefixes (its own inconsistency)", () => {
    const code = stripComments(read("src/app/(app)/reports/reports-page.tsx")!);
    // The reference's CSV filenames are SHORTER than its PDF slugs —
    // both captured live: open_deals_2026-10-01.csv (vs the PDF's
    // open_deals_by_stage_…) and deals_at_risk_2026-10-01.csv. The
    // prefixes are explicit per-button literals.
    expect(code).toMatch(/exportTableCsv\("open_deals"/);
    expect(code).toMatch(/exportTableCsv\("deals_at_risk"/);
    // The PDF keeps the title-derived slug family.
    expect(stripComments(read("src/lib/pdf-export.ts")!)).toMatch(/tableSlug/);
  });

  it("download.ts exports downloadBlob() for the client-side artifact family", () => {
    const code = stripComments(read("src/lib/download.ts")!);
    expect(code).toMatch(/export function downloadBlob/);
    // Blob + object URL + anchor click + revoke — the standard client
    // download construction (what the reference's spies observed).
    expect(code).toMatch(/createObjectURL/);
    expect(code).toMatch(/revokeObjectURL/);
  });
});
