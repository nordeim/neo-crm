import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-78 pins: the dashboard-FAMILY parity suite (the 78-c
// fresh-eyes rotation — the dashboard's KPI-memo seams, the
// session_149 suggested target, never re-rotated since the
// KPI_STATICS adjudication). Every pin below is bundle-decoded
// against the fresh-fetched reference (the N-78 family, validated
// at file:line by the orchestrator; the Eke component's g/p/m/b/y/
// x/_/A memos decoded from index-DZ-xbrIm.js; the bar construction
// additionally LIVE-PROBED on the reference: heights 40%..75% on the
// 32px container, radius 4px).
//
// The decisive contracts:
// - BAR SPARKS: the three bar cards (Deals Closed / Revenue This
//   Month / Sales Target) render STATIC BAR ROWS whose heights are
//   the RAW STATIC VALUES AS PERCENTAGES (`style height ${v}%` — the
//   max bar tops at 75%, NOT 100%); `flex-1 rounded-sm` bars (4px,
//   LIVE-computed); NO normalization, NO floor, NO opacity, NO w-1.5.
// - BARSTAT TWIN: the accounts zv + activities gm cards use the SAME
//   raw-percentage construction (no pct() normalization, no 12%
//   floor, no opacity arm).
// - FILTER RE-DERIVATION: the reference's p memo (stage/source
//   filtered opps) feeds the Deals Closed + Revenue This Month KPIs,
//   the pipeline chart + legend, the Top Reps list, and the Recent
//   Deals rows (full-list updatedAt-desc sort, slice 5); Total
//   Leads / Conversion / Avg Cycle stay UNFILTERED (the route's
//   leads-derived kpis); the route's now-unconsumed members retire.
// - UPCOMING WINDOW: list("-date", 10) → filter date >= now →
//   slice(0,3), NO status filter; the row subtext renders
//   relatedName bare (null → empty, the reference's own shape).
// - ACCOUNTS LOADING ROW: the s77 leads missed sibling — the
//   colSpan-8 "Loading..." ternary + the page-local loaded flag.
// - TRAILING BUTTON: every Recent Deals row ships the ghost
//   MoreHorizontal h-8 w-8 affordance (bundle-only — invisible at
//   the reference's zero data).
// - ROW CLASSES: `border-b hover:bg-gray-50` (our --color-background
//   #f9fafb is the computed-equal) — no transition-colors, no row
//   text classes.
// - KPI_SPARK: the record gains a `bars` member; the stale
//   "all sparks are recharts curves" comment re-derives.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const dashPage = () => stripComments(read("src/app/(app)/page.tsx") ?? "");
const dashRoute = () => stripComments(read("src/app/api/dashboard/route.ts") ?? "");
const pageParts = () => stripComments(read("src/components/shared/page-parts.tsx") ?? "");
const accountsPage = () => stripComments(read("src/app/(app)/accounts/accounts-page.tsx") ?? "");
const pageLayout = () => read("src/lib/page-layout.ts") ?? "";
const typesSrc = () => read("src/types/index.ts") ?? "";

// ---------------------------------------------------------------------------
// S78-P1 (M-78c1): the Sparkline bars arm — RAW-percentage heights.
// ---------------------------------------------------------------------------

describe("session-78: the KPI bar-spark construction (M-78c1, live-probed)", () => {
  it("the bars render the RAW value as the percentage height (style height `${v}%` — no normalization)", () => {
    const src = pageParts();
    const arm = src.slice(src.indexOf("variant === \"line\""), src.indexOf("variant === \"line\"") + 2000);
    // Session-87 (L-87c2): the bars arm is the bare-fragment construction
    // (the container moved to the KpiCard's sparkClassName slot).
    const barsArm = arm.slice(arm.indexOf("<>"));
    expect(barsArm).toMatch(/height:\s*`\$\{v\}%`/);
  });

  it("the bars carry flex-1 rounded-sm (the reference's 4px) — no rounded-[2px], no w-1.5", () => {
    const src = pageParts();
    expect(src).not.toMatch(/rounded-\[2px\]/);
    expect(src).toMatch(/flex-1 rounded-sm/);
    expect(src).not.toMatch(/w-1\.5/);
  });

  it("NO Math.max normalization + NO 8% floor + NO opacity treatment in the bars arm (the N-66j max retires)", () => {
    const src = pageParts();
    expect(src).not.toMatch(/Math\.max\(\.\.\.values/);
    expect(src).not.toMatch(/Math\.max\(\(v\s*\/\s*max\)/);
    expect(src).not.toMatch(/opacity:\s*v\s*>\s*0/);
  });

  it("the empty-series guard stays (Sparkline returns null on an empty series)", () => {
    const src = pageParts();
    expect(src).toMatch(/if \(values\.length === 0\) return null;/);
  });
});

// ---------------------------------------------------------------------------
// S78-P2 (L-78c2): the BarStatCard twin — raw heights on all eleven cards.
// ---------------------------------------------------------------------------

describe("session-78: the BarStatCard raw-height twin (L-78c2)", () => {
  it("the pct() normalization helper is RETIRED (no v/max rescale, no 12% floor)", () => {
    const src = pageParts();
    expect(src).not.toMatch(/const pct =/);
    expect(src).not.toMatch(/Math\.max\(\.\.\.bars/);
  });

  it("the bars render the RAW percentage height on the bg-CLASS color map (no inline backgroundColor, no opacity arm — re-anchored at s90)", () => {
    const src = pageParts();
    // Session-90 (L-90c4): the bars ride the reference's own per-arm
    // bg-CLASS color maps (BAR_BG_GM/BAR_BG_ZV) with the raw-percentage
    // inline height ONLY — the inline `backgroundColor: barColor`
    // mechanism retired with the hex barColor prop.
    const start = src.indexOf("h-10 ");
    const bar = src.slice(start, start + 700);
    expect(bar).toMatch(/height:\s*`\$\{v\}%`/);
    expect(src).not.toMatch(/backgroundColor: barColor/);
    expect(src).not.toMatch(/<span\s+key=\{i\}/);
  });
});

// ---------------------------------------------------------------------------
// S78-P3 (M-78c2): the filter re-derivation — the reference's p memo.
// ---------------------------------------------------------------------------

describe("session-78: the filter-bar re-derivation semantics (M-78c2)", () => {
  it("the page consumes the store's opportunities slice (the reference fetches the opp list)", () => {
    const src = dashPage();
    expect(src).toMatch(/opportunities/);
    expect(src).toMatch(/useCrmStore/);
  });

  it("the p memo: the opps filtered by the stage/source axes (the reference's filtered set)", () => {
    const src = dashPage();
    const memo = src.slice(src.indexOf("filteredOpps"), src.indexOf("filteredOpps") + 500);
    expect(memo).toMatch(/opportunities\.filter|opportunities\)\s*=>|filter\(\(o\)/);
    expect(memo).toMatch(/o\.stage === stage|stage !== "all"/);
    expect(memo).toMatch(/o\.source === source|source !== "all"/);
  });

  it("the Deals Closed + Revenue This Month KPIs derive from the FILTERED set (the g memo's p members)", () => {
    const src = dashPage();
    const deals = src.slice(src.indexOf('label="Deals Closed"'), src.indexOf('label="Deals Closed"') + 400);
    expect(deals).toMatch(/dealsClosedValue/);
    const revenue = src.slice(src.indexOf('label="Revenue This Month"'), src.indexOf('label="Revenue This Month"') + 400);
    expect(revenue).toMatch(/revenueThisMonth/);
    // Both derive from the filtered-won memo, not the route's kpis.
    const memo = src.slice(src.indexOf("filteredWon"), src.indexOf("filteredWon") + 900);
    expect(memo).toMatch(/filteredOpps/);
    expect(deals).not.toMatch(/k\?\.dealsClosedValue/);
    expect(revenue).not.toMatch(/k\?\.revenueThisMonth/);
  });

  it("Total Leads / Conversion / Avg Cycle stay on the route's UNFILTERED kpis (the reference reads the unfiltered leads)", () => {
    const src = dashPage();
    const leads = src.slice(src.indexOf('label="Total Leads"'), src.indexOf('label="Total Leads"') + 300);
    expect(leads).toMatch(/k\?\.totalLeads/);
    const conv = src.slice(src.indexOf('label="Conversion Rate"'), src.indexOf('label="Conversion Rate"') + 300);
    expect(conv).toMatch(/k\?\.conversionRate/);
    const cycle = src.slice(src.indexOf('label="Avg. Sales Cycle"'), src.indexOf('label="Avg. Sales Cycle"') + 300);
    expect(cycle).toMatch(/k\?\.avgSalesCycleDays/);
  });

  it("the pipeline chart + legend chips derive from the FILTERED set (the m memo)", () => {
    const src = dashPage();
    const pipeline = src.slice(src.indexOf("Sales Pipeline by Stage"), src.indexOf("Sales Pipeline by Stage") + 1600);
    expect(pipeline).toMatch(/filteredOpps|filteredPipeline/);
    expect(pipeline).not.toMatch(/dashboard\?\.pipeline/);
  });

  it("the Top Reps list derives from the FILTERED won opps by owner, slice(0,3) (the y memo)", () => {
    const src = dashPage();
    const reps = src.slice(src.indexOf("Top Performing Sales Reps"), src.indexOf("Top Performing Sales Reps") + 2600);
    expect(reps).toMatch(/\{topReps\.map\(\(r\) =>/);
    expect(reps).not.toMatch(/dashboard\?\.topReps/);
    const memo = src.slice(src.indexOf("const topReps"), src.indexOf("const topReps") + 800);
    expect(memo).toMatch(/filteredWon/);
    expect(memo).toMatch(/slice\(0,\s*3\)/);
  });

  it("the Recent Deals rows derive from the FULL filtered list sorted updatedAt desc, slice(0,5) (the _ memo — not a filtered pre-sliced top-5)", () => {
    const src = dashPage();
    expect(src).not.toMatch(/dashboard\?\.recentDeals/);
    const memo = src.slice(src.indexOf("const filteredDeals"), src.indexOf("const filteredDeals") + 800);
    expect(memo).toMatch(/filteredOpps/);
    expect(memo).toMatch(/updatedAt/);
    expect(memo).toMatch(/slice\(0,\s*5\)/);
  });
});

// ---------------------------------------------------------------------------
// S78-P4 (M-78c2, the route slim): the unconsumed members retire.
// ---------------------------------------------------------------------------

describe("session-78: the dashboard route slim (the dch wire-extra policy)", () => {
  it("the route RETIRES pipeline + topReps + recentDeals (zero consumers post-P3)", () => {
    const src = dashRoute();
    expect(src).not.toMatch(/const pipeline/);
    expect(src).not.toMatch(/const topReps/);
    expect(src).not.toMatch(/const recentDeals/);
  });

  it("the route RETIRES dealsClosedValue + revenueThisMonth from the kpis (the page derives them from the filtered set)", () => {
    const src = dashRoute();
    expect(src).not.toMatch(/dealsClosedValue/);
    expect(src).not.toMatch(/revenueThisMonth/);
  });

  it("the route RETIRES the daysUntil wire-extra (zero consumers repo-wide)", () => {
    expect(dashRoute()).not.toMatch(/daysUntil/);
    expect(typesSrc()).not.toMatch(/daysUntil/);
  });

  it("the route KEEPS the unfiltered members: totalLeads / salesTarget / conversionRate / avgSalesCycleDays + revenueOverTime + leadSources + upcomingActivities", () => {
    const src = dashRoute();
    expect(src).toMatch(/totalLeads/);
    expect(src).toMatch(/salesTarget\s*=\s*0/);
    expect(src).toMatch(/conversionRate/);
    expect(src).toMatch(/avgSalesCycleDays/);
    expect(src).toMatch(/revenueOverTime/);
    expect(src).toMatch(/leadSources/);
    expect(src).toMatch(/upcomingActivities/);
  });

  it("the three DB reads stay inside the try (leads + opportunities + activities — every remaining member needs them)", () => {
    const src = dashRoute();
    expect(src).toMatch(/db\.lead\.findMany/);
    expect(src).toMatch(/db\.opportunity\.findMany/);
    expect(src).toMatch(/db\.activity\.findMany/);
    const tryIdx = src.indexOf("try {");
    const catchIdx = src.indexOf("} catch");
    const reads = [src.indexOf("db.lead.findMany"), src.indexOf("db.opportunity.findMany"), src.indexOf("db.activity.findMany")];
    for (const r of reads) expect(r).toBeGreaterThan(tryIdx);
    for (const r of reads) expect(r).toBeLessThan(catchIdx);
  });

  it("the DashboardData type slims in lockstep (no pipeline/topReps/recentDeals members)", () => {
    // Comment-stripped: the s78 type comment MENTIONS the retired
    // members as the retirement record (the needle-in-own-doc trap the
    // s64/s65 lessons pinned). The block is scoped to the interface's
    // OWN braces — the next interface (ReportsData) legitimately ships
    // its own `pipeline:` member.
    const t = stripComments(typesSrc());
    const start = t.indexOf("export interface DashboardData");
    const end = t.indexOf("export interface", start + 10);
    const block = t.slice(start, end > start ? end : start + 800);
    expect(block).not.toMatch(/pipeline:/);
    expect(block).not.toMatch(/topReps:/);
    expect(block).not.toMatch(/recentDeals:/);
    expect(block).not.toMatch(/dealsClosedValue/);
    expect(block).not.toMatch(/revenueThisMonth/);
  });
});

// ---------------------------------------------------------------------------
// S78-P5 (L-78c4 + N-78c6): the Upcoming window + the row subtext.
// ---------------------------------------------------------------------------

describe("session-78: the Upcoming Activities window (L-78c4 + N-78c6)", () => {
  it("the route fetches the top-10 by dueAt DESC (the list(\"-date\", 10) mirror) — no status where", () => {
    const src = dashRoute();
    const block = src.slice(src.indexOf("db.activity.findMany"), src.indexOf("db.activity.findMany") + 200);
    expect(block).toMatch(/dueAt:\s*"desc"/);
    expect(block).toMatch(/take:\s*10/);
    expect(block).not.toMatch(/status:\s*"scheduled"/);
  });

  it("the window: filter dueAt >= now, slice THREE (the reference's slice(0,3))", () => {
    const src = dashRoute();
    const block = src.slice(src.indexOf("upcomingActivities"), src.indexOf("upcomingActivities") + 700);
    expect(block).toMatch(/dueAt && a\.dueAt >= now|>= now/);
    expect(block).toMatch(/slice\(0,\s*3\)/);
    expect(block).not.toMatch(/slice\(0,\s*6\)/);
  });

  it("the row subtext renders relatedName BARE (null renders empty — the ?? a.type invention retires)", () => {
    const src = dashPage();
    const region = src.slice(src.indexOf("Upcoming Activities"), src.indexOf("Upcoming Activities") + 2400);
    expect(region).toMatch(/\{a\.relatedName\}/);
    expect(region).not.toMatch(/\?\? a\.type/);
  });
});

// ---------------------------------------------------------------------------
// S78-P6 (L-78c5): the accounts Loading row — the s77 missed sibling.
// ---------------------------------------------------------------------------

describe("session-78: the accounts Loading row (L-78c5 — the M-77c3 missed sibling)", () => {
  it("the page-local accountsLoaded flag (the s77 leadsLoaded precedent)", () => {
    const src = accountsPage();
    expect(src).toMatch(/accountsLoaded/);
    expect(src).toMatch(/useState\(false\)/);
  });

  it("the tbody renders the colSpan-8 Loading ternary BEFORE the empty state", () => {
    const src = accountsPage();
    // The table body (NOT the cards view's own empty paragraph — the
    // first "No accounts found" occurrence lives there).
    const tableRegion = src.slice(src.indexOf("<TableBody>"), src.indexOf("<TableBody>") + 900);
    expect(tableRegion).toMatch(/colSpan=\{8\}/);
    expect(tableRegion).toMatch(/Loading\.\.\./);
    expect(tableRegion.indexOf("Loading...")).toBeLessThan(tableRegion.indexOf("No accounts found"));
  });
});

// ---------------------------------------------------------------------------
// S78-P7 (L-78c3): the Recent Deals trailing ghost button.
// ---------------------------------------------------------------------------

describe("session-78: the Recent Deals trailing ghost button (L-78c3)", () => {
  it("every row's trailing cell renders the ghost MoreHorizontal affordance (h-8 w-8)", () => {
    const src = dashPage();
    // The TABLE view's map is the LAST filteredDeals.map (the Cards
    // view's map renders first in the JSX).
    const rowRegion = src.slice(src.lastIndexOf("filteredDeals.map"), src.lastIndexOf("filteredDeals.map") + 2400);
    expect(rowRegion).toMatch(/MoreHorizontal/);
    expect(rowRegion).toMatch(/size="icon"/);
    expect(rowRegion).not.toMatch(/<td className="w-8" \/>/);
  });
});

// ---------------------------------------------------------------------------
// S78-P8 (N-78c7): the Recent Deals row classes.
// ---------------------------------------------------------------------------

describe("session-78: the Recent Deals row classes (N-78c7)", () => {
  it("the tbody row is border-b + hover:bg-background (the computed-equal of gray-50 #f9fafb) — no transition-colors, no row text classes", () => {
    const src = dashPage();
    const region = src.slice(src.lastIndexOf("filteredDeals.map"), src.lastIndexOf("filteredDeals.map") + 400);
    expect(region).toMatch(/className="border-b hover:bg-background"/);
    expect(region).not.toMatch(/transition-colors hover:bg-line-soft/);
    expect(region).not.toMatch(/border-line text-xs text-muted/);
  });
});

// ---------------------------------------------------------------------------
// S78-P9 (N-78c8): the KPI_SPARK record re-derives its bars member.
// ---------------------------------------------------------------------------

describe("session-78: the KPI_SPARK record (N-78c8)", () => {
  it("the record gains a bars member pinning the reference's bar construction", () => {
    const src = pageLayout();
    const block = src.slice(src.indexOf("export const KPI_SPARK"), src.indexOf("export const KPI_SPARK") + 2000);
    expect(block).toMatch(/bars:/);
    // Session-87 (L-87c2): the doc string re-derived to the single-slot +
    // bare-div + bg-class construction.
    expect(block).toMatch(/single mt-2 h-8 flex items-end gap-1 slot/);
    expect(block).toMatch(/rounded-sm/);
  });

  it("the stale 'all sparks are recharts curves' comment is re-derived (the three bar cards are bar divs)", () => {
    const src = pageLayout();
    // The docstring rides ABOVE the export — include the preceding
    // window (the s77 raw-read lesson: pin the region the claim lives
    // in, not the export token alone).
    const at = src.indexOf("export const KPI_SPARK");
    const block = src.slice(Math.max(0, at - 1400), at + 900);
    expect(block).not.toMatch(/The sparks themselves are recharts MONOTONE curves/);
  });
});
