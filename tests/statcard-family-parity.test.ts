import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-90 pins: the stat-card family parity suite (the 90-c
// fresh-eyes rotation on the activities/calendar table-family chrome —
// the first-listed standing alternate per session_176.md's suggested
// next). The table/priority/timeline/rail surfaces verified SOLID
// (s6/s7/s16/s23/s27/s73/s76); the stat-card family's OWN
// construction was the standing layer: s5/s12/s74/s76/s78 pinned the
// anatomy, the values, the chips and the raw-height bars, but nobody
// had walked the gm/zv/Mx/ay components' Card/CardContent split, the
// bar/chip CLASS-string color mechanisms, the delta-row construction,
// or the value colors on the calendar/reports arms. Every claim
// decoded from the byte-stable reference bundle (all four components +
// all twenty call sites) + LIVE-probed on BOTH apps at 1440.
//
// The decisive contracts:
// - THE CALENDAR VALUE COLOR (M-90c1): the reference's Mx value =
//   `text-2xl font-bold text-gray-900` — LIVE rgb(17,24,39); our bare
//   form computed the page ink rgb(10,10,10). The F-70a1 s70 pin's
//   own comment CITED the gray-900 + its LIVE color and then shipped
//   the bare form on the FALSE premise "the color carried by the
//   inherited card foreground" — the M-89c1 misdecode genus.
// - THE REPORTS VALUE COLOR (M-90c2): the ay value carries the same
//   explicit gray-900 (LIVE rgb(17,24,39)) — the s74 comment's own
//   citation, the same genus on the reports arm.
// - THE CARD SPLIT ×3 (L-90c3): gm/zv/Mx = Card (bare) >
//   CardContent "p-4"; ay = Card className="border border-gray-200
//   hover:shadow-md transition-shadow" > CardContent "p-5". The s89
//   "EVERY stat-card arm" claim was overbroad — these three
//   components were standing.
// - THE BARS (L-90c4): DIVs carrying the per-arm bg-CLASS color map
//   (gm: blue/green/red/cyan else GRAY, rounded-sm AFTER; zv:
//   blue/green/cyan/red else PURPLE, rounded-sm BEFORE) + the
//   raw-percentage inline height ONLY — never an inline
//   backgroundColor.
// - THE CHIP ×2 (L-90c5): the w-10 h-10 rounded-lg ${bg-50} DIV with
//   the icon rendered DIRECTLY carrying `w-5 h-5 ${text-600}` — the
//   color a KEY (Mx blue/green/purple/orange; ay + red/cyan), the
//   icon a component reference. The nested chipIcon span, the SPAN
//   chip, the inline bg style, the shrink-0/aria-hidden extras, and
//   the KPI_CHIP_BG/KPI_ICON_TEXT hex maps all retire.
// - THE DELTA ROW (L-90c6): the DIV `flex items-center gap-1 text-xs
//   ${up?green-600:red-600}` > TrendingUp|TrendingDown `w-3 h-3` + a
//   bare span — up/down only (the muted arm retires, zero call
//   sites); the ay row uniquely carries font-medium (dead on the
//   reference — no call site passes trend).
// - THE PALETTE PRE-REQ (S90-P0): bg-red-400/bg-purple-400 re-pin to
//   the reference's compiled v3 values (#f87171/#c084fc) — the pairs
//   the s88 re-pin never covered (our bars rode inline hexes).

const root = path.resolve(import.meta.dirname, "..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");
const pagePartsSrc = () => read("src/components/shared/page-parts.tsx");
const layoutSrc = () => read("src/lib/page-layout.ts");
const globalsSrc = () => read("src/app/globals.css");
const activitiesSrc = () => read("src/app/(app)/activities/activities-page.tsx");
const accountsSrc = () => read("src/app/(app)/accounts/accounts-page.tsx");
const calendarSrc = () => read("src/app/(app)/calendar/calendar-page.tsx");
const reportsSrc = () => read("src/app/(app)/reports/reports-page.tsx");

/** A whole component: from its `export function` to the next top-level
 * jsdoc comment (which never moves). */
function componentBlock(name: string): string {
  const src = pagePartsSrc();
  const start = src.indexOf(`export function ${name}`);
  const end = src.indexOf("\n/**", start);
  return src.slice(start, end > start ? end : start + 4000);
}

/** The component's CODE ONLY — from its own `return (` (the comments
 * name retired things; the assertions scan the code, not the prose —
 * the s88 lesson). */
function componentCode(name: string): string {
  const block = componentBlock(name);
  const start = block.indexOf("return (");
  return block.slice(start);
}

describe("session-90: the BarStatCard mirror (gm + zv)", () => {
  it("renders the bare stock Card > CardContent p-4 — the merged-padding div retires", () => {
    const block = componentBlock("BarStatCard");
    expect(block).toContain("<Card>");
    expect(block).toContain('<CardContent className="p-4">');
    // the pre-fix merged form (the padding ON the card div)
    expect(componentCode("BarStatCard")).not.toContain("bg-surface p-4 shadow");
  });

  it("the label row is the reference's no-gap-2 form", () => {
    const code = componentCode("BarStatCard");
    expect(code).toContain('"flex justify-between items-start mb-3"');
    expect(code).not.toContain("justify-between gap-2");
  });

  it("the bars are DIVs with the per-arm bg-CLASS map + the inline height ONLY", () => {
    const code = componentCode("BarStatCard");
    // the per-arm class templates (gm: rounded-sm AFTER; zv: BEFORE)
    expect(code).toMatch(/flex-1 \$\{[a-zA-Z]+\.?[a-zA-Z]*\} rounded-sm|flex-1 \$\{/);
    expect(code).not.toContain("backgroundColor: barColor");
    expect(code).not.toContain("backgroundColor");
    // the raw-percentage height survives the s78 contract
    expect(code).toMatch(/height:\s*`\$\{v\}%`/);
    // DIV bars, not SPANs
    expect(code).not.toMatch(/<span\s+key=\{i\}/);
  });

  it("the bar wrap is the reference's height-first form — no shrink-0, no aria-hidden", () => {
    const code = componentCode("BarStatCard");
    expect(code).toMatch(/h-10 (w-20|w-24|\$\{)*/);
    expect(code).not.toContain("shrink-0");
    expect(code).not.toContain('aria-hidden="true"');
  });

  it("the per-arm color maps mirror the reference's own (gm else GRAY, zv else PURPLE)", () => {
    const src = pagePartsSrc();
    const gmMap = src.slice(src.indexOf("BAR_BG_GM"), src.indexOf("BAR_BG_GM") + 400);
    expect(gmMap).toContain('"bg-blue-400"');
    expect(gmMap).toContain('"bg-green-400"');
    expect(gmMap).toContain('"bg-red-400"');
    expect(gmMap).toContain('"bg-cyan-400"');
    expect(gmMap).toContain('"bg-gray-400"');
    const zvMap = src.slice(src.indexOf("BAR_BG_ZV"), src.indexOf("BAR_BG_ZV") + 400);
    expect(zvMap).toContain('"bg-blue-400"');
    expect(zvMap).toContain('"bg-green-400"');
    expect(zvMap).toContain('"bg-cyan-400"');
    expect(zvMap).toContain('"bg-red-400"');
    expect(zvMap).toContain('"bg-purple-400"');
  });

  it("the gm arm wraps [value, subValue] in a BARE div; the zv arm renders the value directly", () => {
    const code = componentCode("BarStatCard");
    expect(code).toMatch(/arm === "activities"/);
    // the gm bare wrapper + the zv direct value (the reference's own split)
    expect(code).toMatch(/<div>\s*\n\s*<div className="text-2xl sm:text-3xl font-bold">/);
  });

  it("the value/subValue are DIVs — the P tags retire, the subValue the literal gray-500", () => {
    const code = componentCode("BarStatCard");
    expect(code).toContain('<div className="text-2xl sm:text-3xl font-bold">{value}</div>');
    expect(code).toContain('<div className="text-xs text-gray-500 mt-1">{subValue}</div>');
    expect(code).not.toContain("<p className");
  });

  it("the trend props are the reference's own vocabulary (trend/trendValue — deltaTone retires)", () => {
    const block = componentBlock("BarStatCard");
    expect(block).toMatch(/trend\?:\s*"up" \| "down"/);
    expect(block).toMatch(/trendValue\?/);
    expect(block).not.toContain("deltaTone");
    expect(block).not.toContain("barColor");
    expect(block).not.toContain("barWidth");
    // the color KEY defaults "blue" (the reference's color="blue")
    expect(block).toMatch(/color = "blue"/);
  });
});

describe("session-90: the DeltaBadgeText row (the gm/zv/Mx construction)", () => {
  it("the row is the DIV with the up/down-only colors + the width-first w-3 h-3 icons", () => {
    const code = componentCode("DeltaBadgeText");
    // The className rides a template literal on its own line when
    // prettier wraps (the s90 pin-shape repair).
    expect(code).toMatch(/className=\{`flex items-center gap-1 text-xs \$\{/);
    expect(code).toMatch(/"text-green-600" : "text-red-600"|text-green-600" : "text-red-600"/);
    expect(code).toContain('"w-3 h-3"');
    expect(code).not.toContain('"h-3 w-3"');
    expect(code).not.toContain("text-muted");
    // the bare span text (the reference's own children form)
    expect(code).toContain("<span>{children}</span>");
  });

  it("the wrapper-level aria-hidden retires (the lucide library-level superset stands, documented at icons.tsx)", () => {
    const code = componentCode("DeltaBadgeText");
    expect(code).not.toContain('aria-hidden="true"');
  });
});

describe("session-90: the TrendStatCard mirror (Mx — the calendar arm)", () => {
  it("renders the bare stock Card > CardContent p-4 (the plain-div construction retires)", () => {
    const block = componentBlock("TrendStatCard");
    expect(block).toContain("<Card>");
    expect(block).toContain('<CardContent className="p-4">');
    expect(componentCode("TrendStatCard")).not.toContain("STAT_CARD.card");
    expect(componentCode("TrendStatCard")).not.toContain("STAT_CARD.body");
  });

  it("THE VALUE CARRIES THE EXPLICIT text-gray-900 (M-90c1 — LIVE rgb(17,24,39) on the reference)", () => {
    const code = componentCode("TrendStatCard");
    expect(code).toContain('<div className="text-2xl font-bold text-gray-900">{value}</div>');
    // the pre-fix bare form is gone
    expect(code).not.toContain('<div className="text-2xl font-bold">{value}</div>');
  });

  it("the chip is the DIV with the DIRECT icon mechanism (the chipIcon span retires)", () => {
    const code = componentCode("TrendStatCard");
    expect(code).toMatch(/w-10 h-10 rounded-lg \$\{pair\.bg\} flex items-center justify-center/);
    expect(code).toMatch(/<Icon className=\{`w-5 h-5 \$\{pair\.text\}`\} \/>/);
    expect(code).not.toContain("chipIcon");
    expect(code).not.toContain("shrink-0");
    expect(code).not.toContain('aria-hidden="true"');
  });

  it("the label is the DIV gray-600 form under the value", () => {
    const code = componentCode("TrendStatCard");
    expect(code).toContain('<div className="text-xs text-gray-600 mt-1">{label}</div>');
  });

  it("the props: the icon a component reference + the color KEY + trend/trendValue (chipBg/chipIconClass/trendDirection retire)", () => {
    const block = componentBlock("TrendStatCard");
    expect(block).toMatch(/icon: React\.ComponentType/);
    expect(block).toMatch(/color = "blue"/);
    expect(block).not.toContain("chipBg");
    expect(block).not.toContain("chipIconClass");
    expect(block).not.toContain("trendDirection");
  });

  it("the Mx chip pair map (blue/green/purple/orange — the -50/-600 pairs)", () => {
    const src = pagePartsSrc();
    const map = src.slice(src.indexOf("TREND_CHIP"), src.indexOf("TREND_CHIP") + 500);
    expect(map).toContain('blue: { bg: "bg-blue-50", text: "text-blue-600" }');
    expect(map).toContain('green: { bg: "bg-green-50", text: "text-green-600" }');
    expect(map).toContain('purple: { bg: "bg-purple-50", text: "text-purple-600" }');
    expect(map).toContain('orange: { bg: "bg-orange-50", text: "text-orange-600" }');
  });
});

describe("session-90: the CircleStatCard mirror (ay — the reports arm)", () => {
  it("renders Card with the border/hover className > CardContent p-5 (the merged reportsCard retires)", () => {
    const block = componentBlock("CircleStatCard");
    expect(block).toContain(
      '<Card className="border border-line-strong hover:shadow-md transition-shadow">',
    );
    expect(block).toContain('<CardContent className="p-5">');
    expect(componentCode("CircleStatCard")).not.toContain("STAT_CARD.reportsCard");
  });

  it("THE VALUE CARRIES THE EXPLICIT text-gray-900 (M-90c2 — the s74 comment's own citation landed)", () => {
    const code = componentCode("CircleStatCard");
    expect(code).toContain('<div className="text-2xl font-bold text-gray-900">{value}</div>');
    expect(code).not.toContain('<div className="text-2xl font-bold">{value}</div>');
  });

  it("the label is the DIV literal gray-500 mb-1 form (the P/text-muted form retires)", () => {
    const code = componentCode("CircleStatCard");
    expect(code).toContain('<div className="text-xs text-gray-500 mb-1">{label}</div>');
    expect(code).not.toContain("text-muted");
  });

  it("the chip is the same DIV + direct-icon mechanism — the inline bg style + the SPAN retire", () => {
    const code = componentCode("CircleStatCard");
    expect(code).toMatch(/w-10 h-10 rounded-lg \$\{pair\.bg\} flex items-center justify-center/);
    expect(code).toMatch(/<Icon className=\{`w-5 h-5 \$\{pair\.text\}`\} \/>/);
    expect(code).not.toContain("KPI_CHIP_BG");
    expect(code).not.toContain("KPI_ICON_TEXT");
    expect(code).not.toContain("style={{ backgroundColor");
    expect(code).not.toContain("shrink-0");
    expect(code).not.toContain('aria-hidden="true"');
  });

  it("the value column wrapper is BARE (min-w-0 retires) + the label/value the reference's own order", () => {
    const code = componentCode("CircleStatCard");
    expect(code).not.toContain("min-w-0");
    // the bare wrapper div around [label, value]
    expect(code).toMatch(/<div>\s*\n\s*<div className="text-xs text-gray-500 mb-1">/);
  });

  it("the ay dead trend row carries font-medium (no call site exercises it — the N-89c5 genus)", () => {
    const code = componentCode("CircleStatCard");
    expect(code).toMatch(/text-xs font-medium \$\{/);
  });

  it("the ay chip pair map (blue/green/purple/orange/red/cyan)", () => {
    const src = pagePartsSrc();
    const map = src.slice(src.indexOf("REPORT_CHIP"), src.indexOf("REPORT_CHIP") + 600);
    expect(map).toContain('red: { bg: "bg-red-50", text: "text-red-600" }');
    expect(map).toContain('cyan: { bg: "bg-cyan-50", text: "text-cyan-600" }');
    expect(map).toContain('blue: { bg: "bg-blue-50", text: "text-blue-600" }');
  });
});

describe("session-90: the call sites (twenty — the color KEYS + the icon component refs)", () => {
  it("the activities page passes the color keys (no CHART_COLORS hexes on the stat cards)", () => {
    const src = activitiesSrc();
    expect((src.match(/<BarStatCard/g) ?? []).length).toBe(6);
    expect(src).not.toMatch(/barColor=\{/);
    expect(src).not.toContain("CHART_COLORS");
    expect(src).toMatch(/color="blue"/);
    expect(src).toMatch(/color="red"/);
    expect(src).toMatch(/color="cyan"/);
    expect(src).toMatch(/color="purple"/);
    // the WhatsApp + Calls green pair (the gm green arm)
    expect((src.match(/color="green"/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });

  it("the accounts page passes the color keys + the zv arm", () => {
    const src = accountsSrc();
    expect((src.match(/<BarStatCard/g) ?? []).length).toBe(5);
    expect(src).not.toMatch(/barColor=\{/);
    expect(src).not.toMatch(/barWidth=/);
    expect((src.match(/arm="accounts"/g) ?? []).length).toBe(5);
    expect(src).toMatch(/color="purple"/);
  });

  it("the calendar page passes the icon component refs + the trend/trendValue split", () => {
    const src = calendarSrc();
    expect((src.match(/<TrendStatCard/g) ?? []).length).toBe(4);
    expect(src).toMatch(/icon=\{Calendar\}/);
    expect(src).toMatch(/icon=\{Target\}/);
    expect(src).toMatch(/icon=\{Users\}/);
    expect(src).toMatch(/icon=\{Phone\}/);
    expect(src).toMatch(/trend="up"/);
    expect(src).toMatch(/trendValue=\{/);
    expect(src).not.toContain("chipBg=");
    expect(src).not.toContain("chipIconClass=");
  });

  it("the reports page passes the icon component refs + the color keys (no element-form icons)", () => {
    const src = reportsSrc();
    expect((src.match(/<CircleStatCard/g) ?? []).length).toBe(5);
    expect(src).toMatch(/icon=\{Target\}/);
    expect(src).toMatch(/icon=\{TrendingUp\}/);
    expect(src).toMatch(/icon=\{TrendingDown\}/);
    expect(src).toMatch(/color="blue"/);
    expect(src).toMatch(/color="orange"/);
    expect(src).toMatch(/color="green"/);
    expect(src).toMatch(/color="red"/);
    expect(src).toMatch(/color="purple"/);
    // the pre-fix element-form icons are gone; the four remaining
    // color="#…" hexes are the Sparkline STROKE props (a different
    // component, the s27/s87 form — Lost Deals ships none)
    expect(src).not.toMatch(/icon=\{</);
    expect((src.match(/color="#/g) ?? []).length).toBe(4);
  });
});

describe("session-90: the palette pre-req (S90-P0 — the s88 re-pin extended)", () => {
  it("bg-red-400 + bg-purple-400 re-pin to the reference's compiled v3 values", () => {
    const globals = globalsSrc();
    expect(globals).toContain("--color-red-400: #f87171;");
    expect(globals).toContain("--color-purple-400: #c084fc;");
  });
});

describe("session-90: the retirements + the calendar rail nano", () => {
  it("the KPI_CHIP_BG/KPI_ICON_TEXT hex maps retire (zero consumers post-mirror)", () => {
    expect(layoutSrc()).not.toContain("KPI_CHIP_BG");
    expect(layoutSrc()).not.toContain("KPI_ICON_TEXT");
    expect(pagePartsSrc()).not.toContain("KPI_CHIP_BG");
    expect(pagePartsSrc()).not.toContain("KPI_ICON_TEXT");
  });

  it("the calendar rail CardTitle wraps the Filters text in the bare span (N-90c10)", () => {
    const src = calendarSrc();
    expect(src).toContain("<span>Filters</span>");
  });
});
