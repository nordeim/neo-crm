import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-85 parity suite (the 85-c reports tab-content family rotation):
// every pin mirrors a BUNDLE-DECODED reference fact (the fresh-fetched
// index-DZ-xbrIm.js, md5 a70a637… — the 56th consecutive stable bundle)
// or a LIVE-computed DOM fact censused on BOTH apps this session.
//
// The reference facts pinned here (all decoded from the cCe/ZEe/e3e/t3e/
// r3e tab components + LIVE-probed):
// - the Recent Won Deals row renders `ht children:d.account_name` and the
//   Deals at Risk row `ht children:p.account_name` — the BARE field, NO
//   fallback (a null account renders an EMPTY cell).
// - the e3e overdue filter is `f.date && isBefore(now, f.date) &&
//   f.type !== "Note"` (the DATE-PRESENT guard) and the Due Date cell
//   renders `Tc(li(f.date), "MMM d, yyyy")` BARE.
// - the cCe tab-1 renders THREE grid children (`grid grid-cols-1
//   lg:grid-cols-2 gap-6` — Revenue+WonLost, Pipeline+Funnel, tables).
// - the ZEe Forecasting Accuracy CardHeader carries the appended
//   `flex flex-row items-center justify-between` family (LIVE-computed
//   `space-y-1.5 p-6 flex flex-row items-center justify-between`).
// - the ZEe caption is `div.mt-4.text-center > p.text-sm.text-gray-500 >
//   ["Average Accuracy: ", " ", span.font-bold.text-lg.text-gray-900]`.
//
// Green-by-design anchors: the five tab structures, the chart wirings
// (fills/formatters/palettes/labels), the ten table heads + empty states,
// the export-button pair, the red overdue/at-risk rows, the owner
// "Unassigned" grouping, the $XK revenue cell — the s31/s74-pinned
// surfaces re-held at the page-wiring level.

function read(rel: string): string {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : "";
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const page = () => stripComments(read("src/app/(app)/reports/reports-page.tsx"));
const route = () => stripComments(read("src/app/api/reports/route.ts"));
const types = () => stripComments(read("src/types/index.ts"));

/** The SalesTab function region (tab 1 — from its def to the DealTables def). */
function salesTabRegion(): string {
  const src = page();
  const start = src.indexOf("function SalesTab");
  const end = src.indexOf("function DealTables");
  return start >= 0 && end > start ? src.slice(start, end) : "";
}

/** The overdue table region (tab 3). */
function overdueRegion(): string {
  const src = page();
  const start = src.indexOf("Overdue Activities");
  return start >= 0 ? src.slice(start, start + 1600) : "";
}

// ---------------------------------------------------------------------------
// S85-P1 (L-85c1) — the bare account cells
// ---------------------------------------------------------------------------

describe("session-85: the account cells render the BARE field (L-85c1)", () => {
  it("Recent Won Deals + Deals at Risk render {d.account} with NO em-dash fallback", () => {
    // The reference: c.jsx(ht,{children:d.account_name}) — a null account
    // renders an EMPTY cell (the s82 "$"-alone precedent for invented
    // fallbacks).
    const src = page();
    expect(src).toMatch(/<TableCell>\{d\.account\}<\/TableCell>/);
    expect((src.match(/<TableCell>\{d\.account\}<\/TableCell>/g) ?? []).length).toBe(2);
    expect(src).not.toMatch(/\?\? "—"/);
  });

  it("green anchor: the Deal/Amount cells keep the reference's own constructions", () => {
    const src = page();
    // font-medium primary cells + the $ toLocaleString amounts (s31).
    expect((src.match(/className="font-medium">\{d\.name\}<\/TableCell>/g) ?? []).length).toBe(2);
    expect((src.match(/className="text-right">\$\{\(d\.amount \|\| 0\)\.toLocaleString\(\)\}/g) ?? []).length).toBe(4);
    expect(src).toMatch(/<Badge variant="outline">\{d\.stage\}<\/Badge>/);
  });
});

// ---------------------------------------------------------------------------
// S85-P2 (N-85c5) — the overdue due-date mirror
// ---------------------------------------------------------------------------

describe("session-85: the overdue filter + Due Date cell mirror the e3e forms (N-85c5)", () => {
  it("the API's overdue filter carries the reference's DATE-PRESENT guard", () => {
    // The reference: f.date && isBefore(now, li(f.date)) && f.type !== "Note"
    // — date-less activities are EXCLUDED (our activityDate createdAt
    // fallback never reaches this table).
    const src = route();
    const overdueIdx = src.indexOf("overdueActivities");
    const region = overdueIdx >= 0 ? src.slice(overdueIdx, overdueIdx + 700) : "";
    expect(region).toMatch(/a\.dueAt !== null && a\.dueAt\.getTime\(\) < now\.getTime\(\)/);
    expect(region).not.toMatch(/activityDate\(a\) < now/);
  });

  it("the API maps the GUARANTEED date (the wire type narrows to string)", () => {
    const src = route();
    const overdueIdx = src.indexOf("overdueActivities");
    const region = overdueIdx >= 0 ? src.slice(overdueIdx, overdueIdx + 700) : "";
    expect(region).toMatch(/dueAt: a\.dueAt!\.toISOString\(\)/);
    // The wire type: dueAt is a plain string now (the filter guarantees it).
    expect(types()).toMatch(/overdueActivities: Array<\{ id: string; subject: string; type: string; dueAt: string \}>/);
  });

  it("the page renders {formatDate(a.dueAt)} BARE — no ternary, no em-dash", () => {
    const region = overdueRegion();
    expect(region).toMatch(/\{formatDate\(a\.dueAt\)\}/);
    expect(region).not.toMatch(/dueAt \? formatDate/);
    expect(region).not.toMatch(/: "—"/);
  });

  it("green anchor: the overdue rows keep bg-red-50 + the outline Badge + the display-case type", () => {
    const region = overdueRegion();
    expect(region).toMatch(/className="bg-red-50"/);
    expect(region).toMatch(/<Badge variant="outline">\{a\.type\}<\/Badge>/);
    expect(region).toMatch(/No overdue activities/);
  });
});

// ---------------------------------------------------------------------------
// S85-P3 (N-85c2) — the tab-1 grid split
// ---------------------------------------------------------------------------

describe("session-85: the tab-1 charts ride TWO 2-chart grids (N-85c2)", () => {
  it("the SalesTab region carries exactly TWO chart grids (the reference's cCe split)", () => {
    // The reference renders THREE grid children: Revenue+WonLost, then
    // Pipeline+Funnel, then the tables (DealTables owns the third). OUR
    // single 4-chart grid is retired.
    const region = salesTabRegion();
    const grids = region.match(/<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">/g) ?? [];
    expect(grids.length).toBe(2);
  });

  it("the pairing: Revenue+WonLost in the first grid, Pipeline+Funnel in the second", () => {
    const region = salesTabRegion();
    const g1 = region.indexOf("grid grid-cols-1 gap-6 lg:grid-cols-2");
    const g2 = region.indexOf("grid grid-cols-1 gap-6 lg:grid-cols-2", g1 + 1);
    expect(g1).toBeGreaterThan(-1);
    expect(g2).toBeGreaterThan(g1);
    const revenue = region.indexOf('"Revenue Over Time"');
    const wonlost = region.indexOf('"Won vs Lost Over Time"');
    const pipeline = region.indexOf('"Pipeline by Stage"');
    const funnel = region.indexOf('"Conversion Funnel"');
    // First grid: revenue + wonlost between g1 and g2.
    expect(revenue).toBeGreaterThan(g1);
    expect(wonlost).toBeGreaterThan(g1);
    expect(revenue).toBeLessThan(g2);
    expect(wonlost).toBeLessThan(g2);
    // Second grid: pipeline + funnel after g2.
    expect(pipeline).toBeGreaterThan(g2);
    expect(funnel).toBeGreaterThan(g2);
  });

  it("green anchor: the other tabs keep their own grid families", () => {
    const src = page();
    expect((src.match(/grid grid-cols-1 gap-6 lg:grid-cols-3/g) ?? []).length).toBe(3);
    // 8 lg:grid-cols-2 sites: tab-1's TWO chart grids (the split) + the
    // tab-1 tables + the tab-2 tables + the tab-3/4 tables + the tab-5
    // charts + the tab-5 tables.
    expect((src.match(/grid grid-cols-1 gap-6 lg:grid-cols-2/g) ?? []).length).toBe(8);
  });
});

// ---------------------------------------------------------------------------
// S85-P4 (N-85c3 + N-85c4) — the Forecasting-Accuracy chrome
// ---------------------------------------------------------------------------

describe("session-85: the Forecasting-Accuracy header + caption chrome (N-85c3/c4)", () => {
  it("the ChartCard helper ships the headerClassName escape", () => {
    const src = page();
    expect(src).toMatch(/headerClassName\?: string/);
    expect(src).toMatch(/<CardHeader className=\{headerClassName\}>/);
  });

  it("the Forecasting card passes the reference's appended flex-row family — the ONLY carrier", () => {
    const src = page();
    expect(src).toMatch(/title="Forecasting Accuracy" wide headerClassName="flex flex-row items-center justify-between"/);
    expect((src.match(/headerClassName="flex flex-row items-center justify-between"/g) ?? []).length).toBe(1);
  });

  it("the caption is the reference's div>p construction with the span's own class order", () => {
    const src = page();
    expect(src).toMatch(/<div className="mt-4 text-center">/);
    expect(src).toMatch(/<p className="text-sm text-gray-500">/);
    expect(src).toMatch(/<span className="font-bold text-lg text-gray-900">\{data\?\.forecastingAccuracy\.average \?\? 0\}%<\/span>/);
    // The merged single-p form is retired.
    expect(src).not.toMatch(/className="mt-4 text-center text-sm text-gray-500"/);
  });

  it("green anchor: the wide card still spans the full row + the two-line forecast trend", () => {
    const src = page();
    expect(src).toMatch(/wide \? "lg:col-span-3" : undefined/);
    const fcIdx = src.indexOf("Forecasting Accuracy");
    const region = fcIdx >= 0 ? src.slice(fcIdx, fcIdx + 900) : "";
    expect(region).toMatch(/key: "forecasted", name: "Forecasted", stroke: "#3b82f6"/);
    expect(region).toMatch(/key: "actual", name: "Actual", stroke: "#10b981"/);
  });
});

// ---------------------------------------------------------------------------
// Green-by-design anchors — the five tab structures + wirings re-held
// ---------------------------------------------------------------------------

describe("session-85: the tab-content foundations re-held (green by design)", () => {
  it("the five tab titles + their chart wirings", () => {
    const src = page();
    for (const title of [
      "Revenue Over Time",
      "Won vs Lost Over Time",
      "Pipeline by Stage",
      "Conversion Funnel",
      "Forecasting Accuracy",
      "Forecast by Probability",
      "Aging Pipeline",
      "Activities by Type",
      "Activities Over Time",
      "Activities vs Wins",
      "Leads by Source",
      "Win Rate by Source (%)",
      "Avg Deal Value by Source",
      "Account Health Distribution",
      "Top 10 Accounts by Revenue",
    ]) {
      expect(src).toContain(`title="${title}"`);
    }
    // The reference's fill/formatter families (s27/s31/s74 pins re-held).
    expect(src).toMatch(/fill="#8b5cf6"\s*\n\s*name="Value \(\$\)"/);
    expect(src).toMatch(/fill="#06b6d4"/);
    expect(src).toMatch(/formatter=\{numberFormatter\}/);
    expect(src).toMatch(/formatter=\{dollarFormatter\}/);
    expect(src).toMatch(/outerRadius=\{90\}/);
    expect(src).toMatch(/outerRadius=\{100\}/);
    expect(src).toMatch(/yWidth=\{100\}/);
    expect(src).toMatch(/yWidth=\{120\}/);
    expect(src).toMatch(/HEALTH_PIE_FILLS/);
  });

  it("the ten table heads + the empty-state copies", () => {
    const src = page();
    for (const head of ["Deal", "Account", "Amount", "Stage", "Activity", "Type", "Due Date", "Owner", "Activities", "Lead", "Source", "Status", "Leads", "Won", "Revenue", "Industry", "Last Activity"]) {
      expect(src).toContain(`>${head}<`);
    }
    for (const empty of [
      "No won deals",
      "No deals",
      "No open deals",
      "No at-risk deals",
      "No overdue activities",
      "No activities",
      "No leads",
      "No data",
      "No at-risk accounts",
      "No accounts",
    ]) {
      expect(src).toContain(empty);
    }
  });

  it("the export-button pair + the CSV prefixes (the dB mirror)", () => {
    const src = page();
    expect((src.match(/<Download className="h-4 w-4 mr-2" \/> Export CSV/g) ?? []).length).toBe(2);
    expect((src.match(/<FileText className="h-4 w-4 mr-2" \/> Export PDF/g) ?? []).length).toBe(2);
    expect(src).toMatch(/exportTableCsv\("open_deals", \["Deal", "Stage", "Amount"\]/);
    expect(src).toMatch(/exportTableCsv\("deals_at_risk", \["Deal", "Account", "Amount"\]/);
    expect(src).toMatch(/exportTablePdf\("Deals at Risk",/);
  });

  it("the at-risk/health surfaces (s27 pins re-held)", () => {
    const src = page();
    expect(src).toMatch(/lastActivityText\(a\.daysSinceActivity\)/);
    expect(src).toMatch(/<Badge className="bg-red-100 text-red-800">At Risk<\/Badge>/);
    expect(src).toMatch(/a\.industry \|\| "-"/);
    // The API's owner grouping (created_by || "Unassigned").
    expect(route()).toMatch(/a\.owner\?\.name \?\? "Unassigned"/);
    // The $XK revenue cell.
    expect(src).toMatch(/\$\{\(r\.revenue \/ 1e3\)\.toFixed\(0\)\}K/);
  });
});
