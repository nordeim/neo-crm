import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  DASHBOARD_CARD,
  KPI_CARD,
  KPI_SPARK,
  KPI_VALUE,
  VIEW_SWITCHER,
} from "@/lib/page-layout";

// Session-87 pins: the dashboard KPI-FAMILY parity suite (the 87-c
// fresh-eyes rotation — the standing session_167 alternate, never a
// dedicated rotation: s12 pinned the de-hover + the label gray-600 +
// the container token, s27 the statics + the geometry strings, s78
// the raw-percentage bars — but nobody had walked the card's own
// Card/CardContent split, the label/value row divs, the spark's
// double-container nesting, the bars' span/div + class/inline color
// mechanisms, the chart headers' inner-row structure, or the filter
// bar's source-level chrome). Every pin below is bundle-decoded
// against the fresh-fetched byte-stable reference (the N-87 family,
// validated at file:line + LIVE-probed on BOTH apps by the
// orchestrator; the ot/ct/Ht/Fr/Ct/Ke constructions decoded from
// index-DZ-xbrIm.js).
//
// The decisive contracts:
// - THE CARD SPLIT (L-87c3): the reference ships `Card` (the stock
//   component, NO padding) > `CardContent className="p-4 sm:p-6"` >
//   the rows — the padding NEVER merges into the card div.
// - THE LABEL ROW (L-87c3): `div.flex justify-between items-start
//   mb-2` wrapping the `span.text-xs sm:text-sm text-gray-600` label
//   — a flex ROW div, not a bare paragraph.
// - THE VALUE ROW (L-87c3): `div.flex items-end gap-2` BARE — the
//   label row's mb-2 provides the 8px gap (no mt-2) and the row
//   wraps NOTHING (no flex-wrap — a long value+delta OVERFLOWS on
//   the reference where ours wrapped).
// - THE SUFFIX COLOR (M-87c1): the reference's "days" suffix is
//   `span.text-xs text-gray-600 mb-1` (rgb(75,85,99) LIVE); ours
//   shipped text-muted (#6b7280 gray-500 — one step lighter). The
//   s12 label fix's missed sibling.
// - THE ELEMENT TAGS (L-87c3): the value is a SPAN; the delta and
//   the valueNote are DIVs; the suffix stays a SPAN.
// - THE SPARK SLOT (L-87c2): ONE container div per card — `mt-2 h-8`
//   (line/area) or `mt-2 h-8 flex items-end gap-1` (bars) — with the
//   chart as the DIRECT child (the ResponsiveContainer bare inside
//   the slot; the bars as bare divs). NO intermediate wrapper, NO
//   aria-hidden, NO className prop.
// - THE BAR MECHANISM (L-87c2): the STATIC bar cards carry Tailwind
//   bg-CLASSES (`flex-1 bg-cyan-400 rounded-sm` /
//   `flex-1 bg-green-400 rounded-sm`) + the raw-percentage inline
//   heights; ONLY the Sales Target colorFor variant carries the
//   inline backgroundColor (E<4 ? #fbbf24 : #3b82f6).
// - THE REPORTS SLOT (L-87c2): the CircleStatCard's `flex-1 h-12
//   mr-2` slot holds the ResponsiveContainer DIRECTLY (the
//   intermediate h-full div retired).
// - THE CHART HEADERS (N-87c7): the Sales Pipeline card ships the
//   BARE stock CardHeader (title only); the other five cards nest a
//   `div.flex justify-between items-center` row INSIDE the stock
//   CardHeader; the "Last 6 months" span is text-gray-500.
// - THE FILTER BAR (N-87c4/c5/c6): the three dead SelectValue
//   placeholders ("Stage"/"Format"/"Source" — dead in both apps);
//   the Filter button's bare `sm:w-auto` (the flex-col stretch
//   full-widths it at mobile); the search input's explicit `pl-9
//   h-9`.
// - THE VACUOUS TIER ROW (N-87a1): the api-robustness dead-`??`
//   it.each no longer lists the retired accounts tier row.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const pageParts = () => stripComments(read("src/components/shared/page-parts.tsx") ?? "");
const dashPage = () => stripComments(read("src/app/(app)/page.tsx") ?? "");
const reportsPage = () => stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");
const apiRobustness = () => read("tests/api-robustness.test.ts") ?? "";

// ---------------------------------------------------------------------------
// S87-P1 (L-87c3 + M-87c1): the KpiCard restructure.
// ---------------------------------------------------------------------------

describe("session-87: the KpiCard structure (L-87c3, bundle-decoded ot/ct)", () => {
  it("the padding rides a CardContent (p-4 sm:p-6), NEVER the card div — the merged KPI_CARD.card token retires", () => {
    expect(KPI_CARD.content).toBe("p-4 sm:p-6");
    expect("card" in KPI_CARD).toBe(false);
  });

  it("the card renders the Card + CardContent components (the stock split)", () => {
    const src = pageParts();
    const region = src.slice(src.indexOf("export function KpiCard"), src.indexOf("export function KpiCard") + 2400);
    expect(region).toMatch(/<Card>/);
    expect(region).toMatch(/<CardContent className=\{KPI_CARD\.content\}>/);
    expect(region).not.toMatch(/<div className=\{KPI_CARD\.card\}>/);
  });

  it("the label row is the flex justify-between items-start mb-2 div wrapping the label span", () => {
    expect(KPI_CARD.labelRow).toBe("flex justify-between items-start mb-2");
    const src = pageParts();
    const region = src.slice(src.indexOf("export function KpiCard"), src.indexOf("export function KpiCard") + 2400);
    expect(region).toMatch(/<div className=\{KPI_CARD\.labelRow\}>/);
    expect(region).toMatch(/<span className=\{KPI_CARD\.label\}>/);
    // The bare-paragraph label retires.
    expect(region).not.toMatch(/<p className=\{KPI_CARD\.label\}>/);
  });

  it("the value row is the BARE flex items-end gap-2 — no mt-2, no flex-wrap", () => {
    expect(KPI_CARD.valueRow).toBe("flex items-end gap-2");
    const src = pageParts();
    const region = src.slice(src.indexOf("export function KpiCard"), src.indexOf("export function KpiCard") + 2400);
    expect(region).toMatch(/<div className=\{KPI_CARD\.valueRow\}>/);
    expect(region).not.toMatch(/mt-2 flex flex-wrap items-end gap-2/);
  });

  it("the value renders a SPAN (the reference's construction — not a paragraph)", () => {
    const src = pageParts();
    const region = src.slice(src.indexOf("export function KpiCard"), src.indexOf("export function KpiCard") + 2400);
    expect(region).toMatch(/<span className=\{KPI_VALUE\}>/);
    expect(region).not.toMatch(/<p className=\{KPI_VALUE\}>/);
  });

  it("the suffix is text-gray-600 (M-87c1: the s12 label fix's missed sibling — text-muted #6b7280 retires)", () => {
    const src = pageParts();
    const region = src.slice(src.indexOf("export function KpiCard"), src.indexOf("export function KpiCard") + 2400);
    expect(region).toMatch(/<span className="text-xs text-gray-600 mb-1">\{suffix\}<\/span>/);
    expect(region).not.toMatch(/text-muted">\{suffix\}/);
  });

  it("the valueNote renders a DIV (the reference's jsxs container)", () => {
    const src = pageParts();
    const region = src.slice(src.indexOf("export function KpiCard"), src.indexOf("export function KpiCard") + 2400);
    expect(region).toMatch(/<div className="text-xs text-gray-600 mb-1">\{valueNote\}<\/div>/);
  });

  it("the DeltaText STRING arm renders a DIV (the reference's delta construction)", () => {
    const src = pageParts();
    const region = src.slice(src.indexOf("export function DeltaText"), src.indexOf("export function DeltaText") + 1200);
    const stringArm = region.slice(region.indexOf("typeof delta === \"string\""));
    expect(stringArm.slice(0, 400)).toMatch(/<div className=\{cn\("text-xs text-green-600", className\)\}>/);
  });

  it("the spark slot is the variant-aware sparkClassName prop defaulting to the line/area container", () => {
    const src = pageParts();
    const region = src.slice(src.indexOf("export function KpiCard"), src.indexOf("export function KpiCard") + 2400);
    expect(region).toMatch(/sparkClassName \?\? KPI_SPARK\.dashboardContainer/);
  });
});

// ---------------------------------------------------------------------------
// S87-P2 (L-87c2): the Sparkline content-only restructure.
// ---------------------------------------------------------------------------

describe("session-87: the Sparkline content-only construction (L-87c2, bundle-decoded)", () => {
  it("the bars slot token is the reference's single container (mt-2 h-8 flex items-end gap-1)", () => {
    expect(KPI_SPARK.dashboardBarsContainer).toBe("mt-2 h-8 flex items-end gap-1");
    // The line/area default keeps its exact value (the s12 pin re-held).
    expect(KPI_SPARK.dashboardContainer).toBe("mt-2 h-8");
  });

  it("the line/area arms render the ResponsiveContainer BARE — no wrapping div, no aria-hidden", () => {
    const src = pageParts();
    const region = src.slice(src.indexOf("variant === \"line\""), src.indexOf("variant === \"line\"") + 2200);
    expect(region).not.toMatch(/h-8 w-full/);
    expect(region).not.toMatch(/aria-hidden/);
    // The recharts default IS the 5px margin — the reference passes no
    // margin prop (computed-equal, mirrored for source parity).
    expect(region).not.toMatch(/margin=\{\{/);
    expect(region).toMatch(/<ResponsiveContainer width="100%" height="100%">/);
  });

  it("the bars arm renders BARE div bars (a fragment — no container of its own)", () => {
    const src = pageParts();
    const region = src.slice(src.indexOf("variant === \"line\""), src.indexOf("variant === \"line\"") + 2200);
    const barsArm = region.slice(region.indexOf("<>"));
    expect(barsArm.slice(0, 700)).toMatch(/<div\s*\n?\s*key=\{i\}/);
    expect(barsArm.slice(0, 700)).not.toMatch(/<span\s*\n?\s*key=\{i\}/);
    // The container div retires from the arm.
    expect(region).not.toMatch(/cn\("flex h-8 items-end gap-1"/);
  });

  it("the bar className is the template (flex-1 ${barClassName} rounded-sm) with the static-class mechanism", () => {
    const src = pageParts();
    const region = src.slice(src.indexOf("variant === \"line\""), src.indexOf("variant === \"line\"") + 2200);
    const barsArm = region.slice(region.indexOf("<>"));
    expect(barsArm.slice(0, 900)).toMatch(/`flex-1 \$\{barClassName\} rounded-sm`/);
    expect(barsArm.slice(0, 900)).toMatch(/: "flex-1 rounded-sm"/);
  });

  it("the colorFor arm keeps the INLINE backgroundColor (the Sales Target variant)", () => {
    const src = pageParts();
    const region = src.slice(src.indexOf("variant === \"line\""), src.indexOf("variant === \"line\"") + 2200);
    const barsArm = region.slice(region.indexOf("flex-1"));
    expect(barsArm.slice(0, 900)).toMatch(/backgroundColor: colorFor\?\.|backgroundColor: colorFor\(/);
  });

  it("the className prop RETIRES from the Sparkline API (zero consumers post-restructure)", () => {
    const src = pageParts();
    const region = src.slice(src.indexOf("export function Sparkline"), src.indexOf("export function Sparkline") + 1600);
    // The props block: no className member, no cn(className) merge.
    const propsBlock = region.slice(region.indexOf("}:"), region.indexOf("}:", region.indexOf("}:") + 1));
    expect(propsBlock).not.toMatch(/className\??:/);
    expect(region).not.toMatch(/,\s*className\s*\)/);
  });

  it("the dashboard's THREE bar cards pass the bars slot + the bar mechanism (bg-classes for the static pair, colorFor for the target)", () => {
    const src = dashPage();
    expect(src).toMatch(/sparkClassName=\{KPI_SPARK\.dashboardBarsContainer\}/);
    expect((src.match(/sparkClassName=\{KPI_SPARK\.dashboardBarsContainer\}/g) ?? []).length).toBe(3);
    expect(src).toMatch(/barClassName="bg-cyan-400"/);
    expect(src).toMatch(/barClassName="bg-green-400"/);
    // The colorFor sales-target arm stays inline (no barClassName there).
    const target = src.slice(src.indexOf("salesTarget"), src.indexOf("salesTarget") + 900);
    expect(target).toMatch(/colorFor=/);
    expect(target).not.toMatch(/barClassName/);
  });

  it("the reports sparks render the ResponsiveContainer directly in the slot (the className=\"h-full\" intermediate retires)", () => {
    const src = reportsPage();
    expect((src.match(/<Sparkline values=\{\[\.\.\.KPI_STATICS\.reportsSpark\]\}/g) ?? []).length).toBe(4);
    expect(src).not.toMatch(/className="h-full" \/>/);
  });
});

// ---------------------------------------------------------------------------
// S87-P3 (N-87c7): the chart-card headers' inner-row structure.
// ---------------------------------------------------------------------------

describe("session-87: the chart-card headers (N-87c7, bundle-decoded Ht)", () => {
  it("the headerRow token is the reference's nested row", () => {
    expect(DASHBOARD_CARD.headerRow).toBe("flex justify-between items-center");
  });

  it("the Sales Pipeline card ships the BARE stock CardHeader (no className)", () => {
    const src = dashPage();
    const region = src.slice(src.indexOf("Sales Pipeline by Stage"), src.indexOf("Sales Pipeline by Stage") + 300);
    const back = src.slice(Math.max(0, src.indexOf("Sales Pipeline by Stage") - 300), src.indexOf("Sales Pipeline by Stage"));
    expect(back).toMatch(/<CardHeader>/);
    expect(back).not.toMatch(/<CardHeader className=/);
  });

  it("the other FIVE cards nest the headerRow div inside the stock CardHeader", () => {
    const src = dashPage();
    expect((src.match(/<CardHeader>/g) ?? []).length).toBe(6);
    expect((src.match(/<CardHeader className=/g) ?? []).length).toBe(0);
    expect((src.match(/<div className=\{DASHBOARD_CARD\.headerRow\}>/g) ?? []).length).toBe(5);
  });

  it("the 'Last 6 months' span is text-gray-500 (the reference's literal — text-muted retires)", () => {
    const src = dashPage();
    expect(src).toMatch(/<span className="text-xs text-gray-500">Last 6 months<\/span>/);
    expect(src).not.toMatch(/text-muted">Last 6 months/);
  });
});

// ---------------------------------------------------------------------------
// S87-P4 (N-87c4/c5/c6): the filter bar's source-level chrome.
// ---------------------------------------------------------------------------

describe("session-87: the filter bar chrome (N-87c4/c5/c6, bundle-decoded)", () => {
  it("the stage + source dead SelectValue placeholders mirror the reference; the view switcher's stays the documented empty adaptation", () => {
    const src = dashPage();
    expect(src).toMatch(/<SelectValue placeholder="Stage" \/>/);
    expect(src).toMatch(/<SelectValue placeholder="Source" \/>/);
    // The view switcher: the reference's placeholder "Format" is dead
    // because its value is the FIXED no-match constant "format" (Radix
    // renders EMPTY for a non-empty value with no item). OURS is the
    // functional superset (value "" + onValueChange) — an empty-string
    // placeholder is what keeps OUR default trigger rendering EMPTY
    // like the reference's; a "Format" placeholder would RENDER at our
    // "" default (a regression). The emptyLabel stays "" + the
    // mechanism documented in the token comment.
    expect(VIEW_SWITCHER.emptyLabel).toBe("");
    const layout = read("src/lib/page-layout.ts") ?? "";
    const vw = layout.slice(layout.indexOf("export const VIEW_SWITCHER"), layout.indexOf("export const VIEW_SWITCHER") + 900);
    expect(vw).toMatch(/Format/);
  });

  it("the Filter button carries the BARE sm:w-auto (the flex-col stretch full-widths it at mobile)", () => {
    const src = dashPage();
    expect(src).toMatch(/className="sm:w-auto"/);
    expect(src).not.toMatch(/className="w-full sm:w-auto"/);
  });

  it("the search input carries the EXPLICIT pl-9 h-9 (the N-86c6 exact precedent)", () => {
    const src = dashPage();
    expect(src).toMatch(/className="pl-9 h-9" aria-label="Filter deals"/);
  });
});

// ---------------------------------------------------------------------------
// S87-P5 (N-87a1): the api-robustness lockstep.
// ---------------------------------------------------------------------------

describe("session-87: the api-robustness vacuous tier row retires (N-87a1)", () => {
  it("the dead-?? it.each no longer lists the retired accounts tier row", () => {
    const src = apiRobustness();
    expect(src).not.toMatch(/\["src\/app\/api\/accounts\/\[id\]\/route\.ts", "tier"\]/);
    // The retirement comment carries the record.
    expect(src).toMatch(/tier.*retired|retired.*tier/i);
  });
});
