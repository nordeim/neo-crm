import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-27 pins (S27-P6/P7/P8): the dashboard's chart + KPI + list
// contracts, bundle-extracted. The three decisive findings:
//
// 1. The "Sales Pipeline by Stage" bars are SINGLE #3b82f6 with radius
//    [8,8,0,0] on the VALUE dataKey with a $ tooltip — the per-stage
//    colors live ONLY in the custom legend chips below (w-3 h-3 rounded
//    squares via the O-map of bg-*-500 classes, with the "Won" label
//    MISSING the map and falling back to bg-gray-400 — the s13 grey-pin
//    explained), each chip label `${stage}: $${(v/1e3).toFixed(1)}k` in
//    text-gray-600.
// 2. The revenue chart areas carry fillOpacity .6 (won) / .3 (target)
//    with STOCK strokeWidth — our 0.08/2.5 family was a scaffold-era
//    invention.
// 3. The KPI cards ship HARDCODED STATIC deltas ("+5.3%", "+15%") and
//    STATIC sparkline arrays ([10,12,11,14,13,15] etc. — the reference
//    literally hardcodes them; our real-data sparks rendered EMPTY in
//    the current quarter where the reference always shows the shape).
//    The Sales Target progress is NEUTRAL text-gray-600 (not a delta).
//
// Plus the two list cards: Lead Sources + Upcoming Activities render the
// checkbox-row family (p-2 hover:bg-gray-50 rounded rows with the inert
// stock checkbox, "Follow up with {source}" / description+related+date).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const page = () => stripComments(read("src/app/(app)/page.tsx") ?? "");
const layout = () => stripComments(read("src/lib/page-layout.ts") ?? "");

describe("session-27: the dashboard pipeline legend chips (the O-map)", () => {
  it("PIPELINE_LEGEND pins the chip row classes (flex flex-wrap gap-4 mt-4 text-xs)", () => {
    const src = layout();
    // Session-63 re-anchor (the s62 self-shift lesson): the sweep list
    // now carries the PIPELINE_LEGEND token too — anchor on the
    // DEFINITION form so the two can never collide.
    const at = src.indexOf("export const PIPELINE_LEGEND");
    const block = src.slice(at, at + 1000);
    expect(block).toMatch(/row: "flex flex-wrap gap-4 mt-4 text-xs"/);
    expect(block).toMatch(/chip: "flex items-center gap-2"/);
    expect(block).toMatch(/swatch: "w-3 h-3 rounded"/);
  });

  it("the O-map carries the six stage classes with the Won fallback (bg-gray-400 — the lookup-miss quirk)", () => {
    const src = layout();
    // Session-63 re-anchor: the definition form (see the chip-row it).
    const at = src.indexOf("export const PIPELINE_LEGEND");
    const block = src.slice(at, at + 1400);
    for (const entry of [
      'prospecting: "bg-blue-500"',
      'qualification: "bg-cyan-500"',
      'proposal: "bg-yellow-500"',
      'negotiation: "bg-orange-500"',
      'closed_won: "bg-green-500"',
      'closed_lost: "bg-red-500"',
      '"bg-gray-400"',
    ]) {
      expect(block).toContain(entry);
    }
  });

  it("the legend text format is the reference's $X.Xk (toFixed(1)k — the gray-600 half lives in the PIPELINE_LEGEND pin, charts-internals)", () => {
    // Session-64 (N-64c): the dead `region` local retired (never read —
    // the s60 formAvatar precedent, TEST-LOCAL variant) and the title
    // narrowed to what this it actually asserts (the text-gray-600 half
    // is pinned at charts-internals' PIPELINE_LEGEND exact-form).
    const src = page();
    expect(src).toMatch(/toFixed\(1\)\}k/);
  });
});

describe("session-27: the KPI static deltas + sparklines (the hardcoded family)", () => {
  it("KPI_STATICS pins the reference's static deltas: +5.3% (Total Leads), +15% (Revenue This Month)", () => {
    const src = layout();
    const block = src.slice(src.indexOf("KPI_STATICS"), src.indexOf("KPI_STATICS") + 900);
    expect(block).toMatch(/\+5\.3%/);
    expect(block).toMatch(/\+15%/);
  });

  it("the six static spark arrays are pinned verbatim (the reference hardcodes them)", () => {
    const src = layout();
    const block = src.slice(src.indexOf("KPI_STATICS"), src.indexOf("KPI_STATICS") + 1600);
    expect(block).toContain("[10, 12, 11, 14, 13, 15]"); // Total Leads line #10b981
    expect(block).toContain("[40, 55, 45, 70, 60, 80, 75]"); // Deals Closed bars cyan-400
    expect(block).toContain("[30, 40, 50, 45, 60, 70, 80]"); // Revenue bars green-400
    expect(block).toContain("[30, 45, 60, 50, 70, 65, 75]"); // Sales Target bars
    expect(block).toContain("[25, 28, 30, 29, 32, 31]"); // Conversion Rate area #8b5cf6
    expect(block).toContain("[30, 28, 29, 27, 26, 26]"); // Avg cycle line #10b981
  });

  it("the page wires the static deltas (no computed totalLeadsDelta / revenueDelta)", () => {
    const src = page();
    expect(src).not.toMatch(/totalLeadsDelta/);
    expect(src).not.toMatch(/revenueDelta/);
    const totalLeads = src.slice(src.indexOf('label="Total Leads"'), src.indexOf('label="Total Leads"') + 400);
    expect(totalLeads).toMatch(/KPI_STATICS\.deltas\.totalLeads/);
  });

  it("the Sales Target progress renders NEUTRAL text-gray-600 (not a green/red delta)", () => {
    const src = page();
    const region = src.slice(src.indexOf('label="Sales Target"'), src.indexOf('label="Sales Target"') + 600);
    expect(region).toMatch(/valueNote=/);
    expect(region).not.toMatch(/delta=\{/);
  });

  it("the KPI sparks read the static arrays (the KPI_STATICS values, not real series)", () => {
    const src = page();
    const region = src.slice(src.indexOf('label="Total Leads"'), src.indexOf('label="Total Leads"') + 300);
    expect(region).toMatch(/KPI_STATICS/);
  });

  it("the Sales Target bar colors follow the reference's E<4 amber / E>=4 blue split (#fbbf24 then #3b82f6)", () => {
    // Session-64 (N-64d): title corrected — the pre-s64 "E>=3 blue" arm
    // was self-contradictory (3 satisfies both arms); the source is
    // `i < 4 ? "#fbbf24" : "#3b82f6"` (page.tsx:243).
    const src = page();
    const region = src.slice(src.indexOf('label="Sales Target"'), src.indexOf('label="Sales Target"') + 700);
    expect(region).toMatch(/#fbbf24/);
    expect(region).toMatch(/#3b82f6/);
  });
});

describe("session-27: the Lead Sources checkbox rows (S27-P8)", () => {
  it("the rows are the p-2 hover family with the inert Checkbox + 'Follow up with {source}' + count", () => {
    const src = page();
    const region = src.slice(src.indexOf('Lead Sources'), src.indexOf('Lead Sources') + 2000);
    expect(region).toMatch(/hover:bg-gray-50 rounded/);
    expect(region).toMatch(/<Checkbox/);
    expect(region).toMatch(/Follow up with/);
    expect(region).toMatch(/text-gray-500/);
  });

  it("the list slices FOUR rows (the reference's slice(0,4))", () => {
    const src = page();
    const region = src.slice(src.indexOf('Lead Sources'), src.indexOf('Lead Sources') + 2400);
    expect(region).toMatch(/slice\(0, 4\)/);
  });

  it("the invented progress-bar list is retired (no h-1.5 bar fills)", () => {
    const src = page();
    const region = src.slice(src.indexOf('Lead Sources'), src.indexOf('Lead Sources') + 2400);
    expect(region).not.toMatch(/h-1\.5/);
  });
});

describe("session-27: the Upcoming Activities checkbox rows (S27-P8)", () => {
  it("the rows carry the Checkbox + description + related line + toLocaleDateString", () => {
    const src = page();
    const region = src.slice(src.indexOf('Upcoming Activities'), src.indexOf('Upcoming Activities') + 2400);
    expect(region).toMatch(/<Checkbox/);
    expect(region).toMatch(/hover:bg-gray-50 rounded/);
    expect(region).toMatch(/toLocaleDateString/);
  });

  it("the empty state is the reference's text-sm text-gray-500 text-center py-4 paragraph", () => {
    const src = page();
    const region = src.slice(src.indexOf('Upcoming Activities'), src.indexOf('Upcoming Activities') + 2600);
    expect(region).toMatch(/text-center py-4/);
    expect(region).toMatch(/No upcoming activities/);
  });

  it("the invented colored-dot row model is retired (no meta.color dots on this card)", () => {
    const src = page();
    const region = src.slice(src.indexOf('Upcoming Activities'), src.indexOf('Upcoming Activities') + 2600);
    expect(region).not.toMatch(/ACTIVITY_TYPE_META/);
  });
});

// ---------------------------------------------------------------------------
// Session-31 (S31-P2): the Top Reps + Recent Deals ROW contracts —
// bundle-decoded from index-DZ-xbrIm.js. Both rows were UNVERIFIABLE at the
// reference's zero data (the Top Reps card renders its header row alone; the
// Recent Deals table renders headers + an empty tbody) — the bundle now
// carries the full row JSX.
// ---------------------------------------------------------------------------

describe("session-31: the Top Performing Sales Reps row (the bundle's y.map)", () => {
  it("the row is the initials box + name + 'Top Admin' subtitle + $Xk + the Won/Active badge", () => {
    const src = page();
    const region = src.slice(src.indexOf("Top Performing Sales Reps"), src.indexOf("Top Performing Sales Reps") + 2600);
    // initials box: w-8 h-8 bg-blue-100 text-blue-600 text-xs font-semibold
    expect(region).toMatch(/w-8 h-8 bg-blue-100/);
    expect(region).toMatch(/text-blue-600/);
    expect(region).toMatch(/Top Admin/);
    // value: $${(value/1e3).toFixed(0)}k — NOT formatCompactCurrency
    expect(region).toMatch(/toFixed\(0\)/);
    expect(region).not.toMatch(/formatCompactCurrency/);
    // the Won/Active badge pair
    expect(region).toMatch(/Won/);
    expect(region).toMatch(/Active/);
    expect(region).toMatch(/bg-green-100 text-green-800/);
    expect(region).toMatch(/bg-blue-100 text-blue-800/);
  });

  it("the rep list derives from WON OPPORTUNITIES by owner string, slice(0,3)", () => {
    const src = page();
    const region = src.slice(src.indexOf("Top Performing Sales Reps"), src.indexOf("Top Performing Sales Reps") + 2600);
    expect(region).toMatch(/topReps/);
  });
});

describe("session-31: the Recent Deals row (the bundle's _.map — opportunities)", () => {
  const recentRegion = () => {
    const src = page();
    return src.slice(src.indexOf("Recent Deals"), src.indexOf("Recent Deals") + 7000);
  };

  it("the Lead cell is the icon box + name/account_name stack (py-3, flex gap-2)", () => {
    const region = recentRegion();
    expect(region).toMatch(/py-3/);
    expect(region).toMatch(/w-8 h-8 bg-gray-200/);
    expect(region).toMatch(/text-sm font-medium/);
    expect(region).toMatch(/text-xs text-gray-500/);
  });

  it("Deal Value renders $${amount.toLocaleString()} (NOT compact currency)", () => {
    const region = recentRegion();
    expect(region).toMatch(/toLocaleString\(\)/);
    expect(region).not.toMatch(/formatCompactCurrency/);
  });

  it("the first Status badge uses the OPP P-map with the RAW slug (Won for closed_won)", () => {
    const region = recentRegion();
    expect(region).toMatch(/OPP_STAGE_META/);
    expect(region).toMatch(/"Won"/);
  });

  it("the Owner cell is the w-6 h-6 bg-blue-100 box + the owner STRING", () => {
    const region = recentRegion();
    expect(region).toMatch(/w-6 h-6 bg-blue-100/);
  });

  it("the SECOND Status badge is the outline Contacted/Proposal copy-paste quirk", () => {
    const region = recentRegion();
    expect(region).toMatch(/"Contacted"/);
    expect(region).toMatch(/"Proposal"/);
  });
});

// ---------------------------------------------------------------------------
// Session-32 (S32-P2): the currency KPI VALUES — the bundle renders all
// three through LITERAL /1e3 formulas (never the magnitude-branching
// compact default): Deals Closed + Revenue This Month
// `$${(v/1e3).toFixed(1)}k`, Sales Target `$${(v/1e3).toFixed(0)}k`
// (the "$0k" hardcoded-target quirk). Our call sites express them through
// the format seam's fixed-scale option.
// ---------------------------------------------------------------------------

describe("session-32: the currency KPI value formulas (S32-P2)", () => {
  it("Deals Closed + Revenue This Month use the fixed k scale (1 decimal)", () => {
    const src = page();
    const deals = src.slice(src.indexOf('label="Deals Closed"'), src.indexOf('label="Deals Closed"') + 300);
    expect(deals).toMatch(/scale: "k"/);
    const revenue = src.slice(src.indexOf('label="Revenue This Month"'), src.indexOf('label="Revenue This Month"') + 300);
    expect(revenue).toMatch(/scale: "k"/);
  });

  it("the Sales Target card uses the fixed k scale with ZERO decimals (the $0k quirk)", () => {
    const src = page();
    const target = src.slice(src.indexOf('label="Sales Target"'), src.indexOf('label="Sales Target"') + 400);
    expect(target).toMatch(/scale: "k", decimals: 0/);
  });

  it("no KPI value keeps the bare magnitude-branching default", () => {
    const src = page();
    for (const label of ['label="Deals Closed"', 'label="Revenue This Month"', 'label="Sales Target"']) {
      const region = src.slice(src.indexOf(label), src.indexOf(label) + 300);
      expect(region).not.toMatch(/formatCompactCurrency\((k\?\.?\w+ \?\? 0)\)/);
    }
  });
});

// ---------------------------------------------------------------------------
// Session-33 pins (S33-P1/P2): the filter-bar search + the header trio —
// the two dead-control decodes from the 29th-session bundle re-read.
//
// 1. The reference's dashboard filter-bar search input is DEAD: the
//    bundle renders it with placeholder "Stage: Source" and NO
//    value/onChange (the same dead-input family as the s32 topbar
//    "Search Anything..." decode). Ours stays FUNCTIONAL (the Recent
//    Deals filter) — the documented superset — with the placeholder
//    extracted into the FILTER_BAR contract.
// 2. The reference's dashboard header ships THREE adjacent buttons —
//    Add (outline, hidden-sm label), Export (outline, hidden-sm label),
//    Export (bg-blue-600 hover:bg-blue-700, bare label) — and ALL THREE
//    are DEAD there (no onClick). Ours keeps the exact visual with the
//    documented functional superset jobs, the labels now consumed from
//    the DASHBOARD_HEADER contract.
// ---------------------------------------------------------------------------

describe("session-33: the filter-bar search + the header trio render (S33-P1/P2)", () => {
  it("the search input consumes FILTER_BAR.searchPlaceholder (no hardcoded literal)", () => {
    const src = page();
    expect(src).toContain("placeholder={FILTER_BAR.searchPlaceholder}");
    expect(src).not.toContain('placeholder="Stage: Source"');
  });

  it("the search input is FUNCTIONAL: value + onChange wired (the documented superset)", () => {
    const src = page();
    const at = src.indexOf("FILTER_BAR.searchWrap");
    const region = src.slice(at, at + 700);
    expect(region).toMatch(/value=\{search\}/);
    expect(region).toMatch(/onChange=\{/);
  });

  it("the header trio's labels come from the DASHBOARD_HEADER contract", () => {
    const src = page();
    expect(src).toContain("DASHBOARD_HEADER.addLabel");
    expect(src).toContain("DASHBOARD_HEADER.outlineExportLabel");
    expect(src).toContain("DASHBOARD_HEADER.primaryExportLabel");
    // The hidden-sm label classes ride the contract too (Add + outline
    // Export share it; the primary Export keeps the bare label).
    expect(src.match(/DASHBOARD_HEADER\.addLabelClass/g)?.length).toBe(1);
    expect(src.match(/DASHBOARD_HEADER\.outlineExportLabelClass/g)?.length).toBe(1);
  });

  it("the dead-affordance pair stays no-op: Filter + More... carry NO onClick (the reference's dead controls mirrored)", () => {
    const src = page();
    const filterAt = src.indexOf(">Filter</span>");
    const filterBtn = src.slice(Math.max(0, src.lastIndexOf("<Button", filterAt)), filterAt + 14);
    expect(filterBtn).not.toMatch(/onClick/);
    const moreAt = src.indexOf("More...");
    const moreBtn = src.slice(Math.max(0, src.lastIndexOf("<Button", moreAt)), moreAt + 8);
    expect(moreBtn).not.toMatch(/onClick/);
  });
});
