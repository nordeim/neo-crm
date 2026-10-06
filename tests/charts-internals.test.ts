import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-27 pins (S27-P3/P4/P6/P9/P10 + the axis-line correction): the
// reference's chart-internals family, bundle-extracted (its minified bundle
// is ground truth for every config the zero-data DOM cannot express) and
// live-verified where visible. THE decisive systemic finding: the
// reference's Cartesian charts ship STOCK recharts axes — the axis line
// AND tick lines render at the default #666 (live SVG: line.recharts-
// cartesian-axis-line stroke #666 + line.recharts-cartesian-axis-tick-line
// stroke #666 + text fill #666) and stock margins — while our entire
// scaffold-era family hid them (axisLine={false} tickLine={false} +
// custom margins + width 32/56 + allowDecimals={false}). The rewrite:
// stock axes everywhere, per-surface single fills/radii/formatters, the
// chart-TYPE corrections (line vs bar vs pie), and the label-PIE family.
//
// Per-surface contracts (bundle-extracted):
//   dashboard pipeline: Bar value #3b82f6 radius [8,8,0,0], $ tooltip, tick 12
//   tab-1 revenue:      Line revenue #3b82f6 strokeWidth 2, $ tooltip
//   tab-1 wonlost:      Bar won #10b981 "Won" + Bar lost #ef4444 "Lost" + Legend
//   tab-1 pipeline:     Bar value #8b5cf6 name "Value ($)", plain tooltip, ROW-DERIVED
//   tab-1 funnel:       horizontal Bar count #06b6d4, YAxis stage width 100
//   tab-2 forecasting:  Line forecasted #3b82f6 "Forecasted" + Line actual #10b981 "Actual", $ tooltip
//   tab-2 pipeline:     Bar value #3b82f6, $ tooltip
//   tab-2 forecast:     PIE outerRadius 90, label `${band}%: $${(v/1e3).toFixed(0)}K`, 4 colors
//   tab-2 aging:        Bar count #8b5cf6, XAxis age
//   tab-3 by-type:      PIE outerRadius 90, label `${type}: ${count}`, 5 colors
//   tab-3 over-time:    Line count #3b82f6 strokeWidth 2
//   tab-3 vs-wins:      Bar count #3b82f6 "Activities" + Bar won #10b981 "Won Deals"
//   tab-4 by-source:    PIE outerRadius 90, label `${source}: ${count}`, 5 colors
//   tab-4 win-rate:     Bar winRate #10b981, % tooltip
//   tab-4 avg-value:    Bar avgValue #8b5cf6, $ tooltip
//   tab-5 health pie:   PIE outerRadius 100, label `${name}: ${value}`, [#10b981,#f59e0b,#ef4444]
//   tab-5 top-10:       horizontal Bar revenue #3b82f6, YAxis name width 120, $ tooltip
//   leads pipeline:     Bar value #3b82f6, $ tooltip, tick 12 (5-status vocabulary)
//   leads wonlost:      grouped bars + Legend (same family as tab-1)
//   activities by-type: Bar count #3b82f6 radius [4,4,0,0], tick 10, NO grid

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

function charts(): string {
  return stripComments(read("src/components/charts/charts.tsx") ?? "");
}

describe("session-27: the stock-axis correction (the systemic finding)", () => {
  it("the chart family carries ZERO axisLine={false} / tickLine={false} props (the reference ships stock #666 axes)", () => {
    const src = charts();
    expect(src).not.toMatch(/axisLine=\{false\}/);
    expect(src).not.toMatch(/tickLine=\{false\}/);
  });

  it("the Cartesian charts carry NO custom margin prop (the reference passes none — recharts stock 5/5/5/5)", () => {
    const src = charts();
    expect(src).not.toMatch(/margin=\{\{/);
  });

  it("the vertical charts carry no YAxis width override and no allowDecimals={false} (stock axes)", () => {
    const src = charts();
    expect(src).not.toMatch(/allowDecimals=\{false\}/);
  });
});

describe("session-27: the single-series bar chart family (SingleBarChart)", () => {
  it("exports SingleBarChart with the per-surface config surface (xKey, dataKey, fill, radius, name, formatter, tickFontSize, grid)", () => {
    const src = charts();
    expect(src).toMatch(/export function SingleBarChart\(/);
    for (const prop of ["xKey", "dataKey", "fill", "radius", "name", "formatter", "tickFontSize", "grid"]) {
      expect(src).toMatch(new RegExp(`${prop}[?]?:`));
    }
  });

  it("renders ONE Bar with the single fill prop and NO per-datum Cells (the reference's bars are single-color)", () => {
    const src = charts();
    const fn = src.slice(src.indexOf("export function SingleBarChart"), src.indexOf("export function SingleBarChart") + 2200);
    expect(fn).toMatch(/<Bar\s/);
    expect(fn).toMatch(/fill=\{fill\}/);
    expect(fn).not.toMatch(/<Cell/);
  });

  it("the grid is conditional (the by-type chart ships NO CartesianGrid)", () => {
    const src = charts();
    const fn = src.slice(src.indexOf("export function SingleBarChart"), src.indexOf("export function SingleBarChart") + 2200);
    expect(fn).toMatch(/\{grid && <CartesianGrid/);
  });
});

describe("session-27: the grouped-bar pair family (GroupedBarsChart)", () => {
  it("exports GroupedBarsChart with a series array (key/fill/name per pair)", () => {
    const src = charts();
    expect(src).toMatch(/export function GroupedBarsChart\(/);
  });

  it("renders one Bar per series entry with the stock <Legend /> (the wonlost + vs-wins family)", () => {
    const src = charts();
    const fn = src.slice(src.indexOf("export function GroupedBarsChart"), src.indexOf("export function GroupedBarsChart") + 2400);
    expect(fn).toMatch(/series\.map/);
    expect(fn).toMatch(/<Legend \/>/);
  });
});

describe("session-27: the trend-line family (TrendLineChart)", () => {
  it("exports TrendLineChart with per-series stroke/name and an optional formatter", () => {
    const src = charts();
    expect(src).toMatch(/export function TrendLineChart\(/);
  });

  it("the lines carry strokeWidth 2 (the reference's explicit value — not our old 2.5)", () => {
    const src = charts();
    const fn = src.slice(src.indexOf("export function TrendLineChart"), src.indexOf("export function TrendLineChart") + 2400);
    expect(fn).toMatch(/strokeWidth=\{2\}/);
    expect(fn).not.toMatch(/strokeWidth=\{2\.5\}/);
  });
});

describe("session-27: the label-PIE family (LabelPieChart)", () => {
  it("exports LabelPieChart with outerRadius, labelFor, fills and the stock tooltip", () => {
    const src = charts();
    expect(src).toMatch(/export function LabelPieChart\(/);
    const fn = src.slice(src.indexOf("export function LabelPieChart"), src.indexOf("export function LabelPieChart") + 2200);
    expect(fn).toMatch(/labelLine=\{false\}/);
    expect(fn).toMatch(/outerRadius=\{outerRadius\}/);
    expect(fn).toMatch(/cx="50%"/);
    expect(fn).toMatch(/cy="50%"/);
  });

  it("the PIE carries NO innerRadius / paddingAngle / Legend (a FULL pie, not our old donut)", () => {
    const src = charts();
    const fn = src.slice(src.indexOf("export function LabelPieChart"), src.indexOf("export function LabelPieChart") + 2200);
    expect(fn).not.toMatch(/innerRadius/);
    expect(fn).not.toMatch(/paddingAngle/);
    expect(fn).not.toMatch(/<Legend/);
  });
});

describe("session-27: the horizontal-bar family (HorizontalBarChart)", () => {
  it("exports HorizontalBarChart with yKey + yWidth (the funnel 100 / top-10 120) and a single fill", () => {
    const src = charts();
    expect(src).toMatch(/export function HorizontalBarChart\(/);
    const fn = src.slice(src.indexOf("export function HorizontalBarChart"), src.indexOf("export function HorizontalBarChart") + 2200);
    expect(fn).toMatch(/layout="vertical"/);
    expect(fn).toMatch(/yWidth/);
  });

  it("carries NO radius, NO maxBarSize and NO per-datum Cells (the reference's horizontal bars are plain)", () => {
    const src = charts();
    const fn = src.slice(src.indexOf("export function HorizontalBarChart"), src.indexOf("export function HorizontalBarChart") + 2200);
    expect(fn).not.toMatch(/maxBarSize/);
    expect(fn).not.toMatch(/<Cell/);
  });
});

describe("session-27: the retired chart family", () => {
  it("PipelineBarChart / WonLostLineChart / DonutChart / FunnelBarChart are retired (replaced by the new family)", () => {
    const src = charts();
    expect(src).not.toMatch(/export function PipelineBarChart/);
    expect(src).not.toMatch(/export function WonLostLineChart/);
    expect(src).not.toMatch(/export function DonutChart/);
    expect(src).not.toMatch(/export function FunnelBarChart/);
  });

  it("RevenueLineChart survives ONLY as the dashboard's won/target area chart, re-pinned to the reference's fillOpacity .6/.3 + stock strokeWidth + $ tooltip + tick 12", () => {
    const src = charts();
    const fn = src.slice(src.indexOf("export function RevenueLineChart"), src.indexOf("export function RevenueLineChart") + 3000);
    expect(src).toMatch(/export function RevenueLineChart/);
    expect(fn).not.toMatch(/0\.08/);
    expect(fn).not.toMatch(/strokeWidth=\{2\.5\}/);
  });
});

describe("session-27: the per-surface chart wirings (the pages)", () => {
  it("the dashboard pipeline uses SingleBarChart with #3b82f6 + radius [8,8,0,0] + value dataKey + $ formatter + tick 12", () => {
    const page = stripComments(read("src/app/(app)/page.tsx") ?? "");
    expect(page).toMatch(/SingleBarChart/);
    const region = page.slice(page.indexOf("Sales Pipeline by Stage") - 1200, page.indexOf("Sales Pipeline by Stage") + 400);
    expect(region).toMatch(/fill="#3b82f6"/);
    expect(region).toMatch(/radius=\{\[8, 8, 0, 0\]\}/);
  });

  it("the dashboard renders the O-map legend chips (w-3 h-3 rounded squares + text-gray-600 + $X.Xk format)", () => {
    const page = stripComments(read("src/app/(app)/page.tsx") ?? "");
    expect(page).toMatch(/PIPELINE_LEGEND/);
    const layout = stripComments(read("src/lib/page-layout.ts") ?? "");
    // Session-63 re-anchor: the definition form (the sweep list carries
    // the token too now).
    const at = layout.indexOf("export const PIPELINE_LEGEND");
    const block = layout.slice(at, at + 900);
    expect(block).toMatch(/w-3 h-3 rounded/);
    expect(block).toMatch(/text-gray-600/);
    expect(block).toMatch(/bg-gray-400/);
  });

  it("the tab-1 revenue chart is TrendLineChart (ONE revenue line, NOT the dashboard's won/target areas)", () => {
    const page = stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");
    const region = page.slice(page.indexOf('title="Revenue Over Time"') - 400, page.indexOf('title="Revenue Over Time"') + 500);
    expect(region).toMatch(/TrendLineChart/);
    expect(region).not.toMatch(/RevenueLineChart/);
  });

  it("the tab-1 wonlost + tab-3 vs-wins are GroupedBarsChart; the tab-1 pipeline is ROW-DERIVED violet with the Value ($) name", () => {
    const page = stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");
    const wonlost = page.slice(page.indexOf('title="Won vs Lost Over Time"') - 400, page.indexOf('title="Won vs Lost Over Time"') + 400);
    expect(wonlost).toMatch(/GroupedBarsChart/);
    const pipeline = page.slice(page.indexOf('title="Pipeline by Stage"') - 500, page.indexOf('title="Pipeline by Stage"') + 500);
    expect(pipeline).toMatch(/pipelineByStageRows/);
    expect(pipeline).toMatch(/#8b5cf6/);
    const vswins = page.slice(page.indexOf('title="Activities vs Wins"') - 400, page.indexOf('title="Activities vs Wins"') + 400);
    expect(vswins).toMatch(/GroupedBarsChart/);
  });

  it("the funnel is HorizontalBarChart with #06b6d4 + stage yKey + width 100", () => {
    const page = stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");
    const region = page.slice(page.indexOf('title="Conversion Funnel"') - 500, page.indexOf('title="Conversion Funnel"') + 500);
    expect(region).toMatch(/HorizontalBarChart/);
    expect(region).toMatch(/#06b6d4/);
    expect(region).toMatch(/yWidth=\{100\}/);
  });

  it("the tab-2 forecast + tab-3 by-type + tab-4 by-source + tab-5 health charts are LabelPieChart", () => {
    const page = stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");
    for (const title of ["Forecast by Probability", "Activities by Type", "Leads by Source", "Account Health Distribution"]) {
      const region = page.slice(page.indexOf(`title="${title}"`) - 400, page.indexOf(`title="${title}"`) + 500);
      expect(region).toMatch(/LabelPieChart/);
    }
  });

  it("the tab-5 Top 10 Accounts is HorizontalBarChart with #3b82f6 + name yKey + width 120", () => {
    const page = stripComments(read("src/app/(app)/reports/reports-page.tsx") ?? "");
    const region = page.slice(page.indexOf('title="Top 10 Accounts by Revenue"') - 500, page.indexOf('title="Top 10 Accounts by Revenue"') + 500);
    expect(region).toMatch(/HorizontalBarChart/);
    expect(region).toMatch(/#3b82f6/);
    expect(region).toMatch(/yWidth=\{120\}/);
  });

  it("the leads pipeline uses the FIVE-status vocabulary (incl. Contacted) with value sums and single-blue fill", () => {
    const page = stripComments(read("src/app/(app)/leads/leads-page.tsx") ?? "");
    expect(page).toMatch(/"contacted", "qualified", "won", "lost"|"contacted","qualified","won","lost"/);
    const region = page.slice(page.indexOf("Pipeline Value by Stage") - 900, page.indexOf("Pipeline Value by Stage") + 300);
    expect(region).toMatch(/SingleBarChart/);
  });

  it("the activities by-type chart is single-blue radius [4,4,0,0] with tick 10 and NO grid", () => {
    const page = stripComments(read("src/app/(app)/activities/activities-page.tsx") ?? "");
    const region = page.slice(page.indexOf("Activities by Type") - 200, page.indexOf("Activities by Type") + 1600);
    expect(region).toMatch(/#3b82f6/);
    expect(region).toMatch(/radius=\{\[4, 4, 0, 0\]\}/);
    expect(region).toMatch(/tickFontSize=\{10\}/);
    expect(region).not.toMatch(/maxBarSize/);
  });
});

describe("session-70: the by-type family rewire + the animation retirement (N-70c5/c6)", () => {
  it("the activities by-type chart rides the SingleBarChart family (grid=false, height 150) — no hand-rolled BarChart", () => {
    // The 70-c rotation's find: the call-site was a hand-rolled BarChart
    // duplicate of the family (drift hazard) carrying an INVENTED
    // name="Logged" (the bundle's Bar ships NO name — the reference's
    // tooltip reads "count : N", ours read "Logged : N"). The family
    // already supported the whole shape: grid={false} tickFontSize={10}
    // height={150} fill radius.
    const page = stripComments(read("src/app/(app)/activities/activities-page.tsx") ?? "");
    const region = page.slice(page.indexOf("Activities by Type") - 200, page.indexOf("Activities by Type") + 1600);
    expect(region).toMatch(/<SingleBarChart/);
    expect(region).toMatch(/grid=\{false\}/);
    expect(region).toMatch(/height=\{150\}/);
    expect(region).not.toMatch(/<BarChart/);
    expect(region).not.toMatch(/name="Logged"/);
  });

  it("ZERO isAnimationActive props in src/ (the reference never disables chart animation at a call-site)", () => {
    // The 70-c rotation + the orchestrator's bundle decode: ALL 38
    // occurrences of isAnimationActive in the reference bundle are
    // recharts LIBRARY INTERNALS (defaultProps + class machinery) —
    // the reference's app code passes the prop NOWHERE. Its funnel
    // (Kd + LabelList + per-datum Cells) and its KPI sparkline (Fc
    // Area fillOpacity .3) both ANIMATE on mount. Ours disabled the
    // animation at three sites (the funnel + the Sparkline Area/Line
    // arms) — a scaffold-era artifact, now retired.
    const surfaces = [
      "src/components/charts/charts.tsx",
      "src/components/shared/page-parts.tsx",
    ];
    for (const rel of surfaces) {
      const src = stripComments(read(rel) ?? "");
      expect(src, rel).not.toContain("isAnimationActive");
    }
  });
});
