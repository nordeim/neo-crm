"use client";

// Recharts wrappers styled to the NEO CRM palette.
//
// Session-27 REWRITE (the chart-internals layer, bundle-extracted): the
// reference's minified bundle is ground truth for every chart config its
// zero-data DOM cannot express, and it revealed a SYSTEMIC scaffold-era
// divergence — our entire family hid the axes (axisLine={false}
// tickLine={false} + custom margins + width 32/56 + allowDecimals={false})
// while the reference ships STOCK recharts axes (live SVG: axis line AND
// tick lines at the default #666, stock 5/5/5/5 margins, stock 60px YAxis
// width). Every Cartesian wrapper here now ships stock axes; the only
// props the reference passes are the ones we mirror per surface:
//
//   SingleBarChart     one Bar, single fill, optional radius/name/
//                      formatter/tick size/grid (the reference's default
//                      bar family — dashboard pipeline #3b82f6 radius
//                      [8,8,0,0] $ tick12; tab-1 pipeline #8b5cf6
//                      "Value ($)"; aging #8b5cf6; win-rate #10b981 %;
//                      avg-value #8b5cf6 $; by-type #3b82f6 radius
//                      [4,4,0,0] tick10 NO grid)
//   GroupedBarsChart   the won/lost + Activities/Won-Deals PAIRS with the
//                      stock <Legend /> (bar pairs, never lines)
//   TrendLineChart     1-2 strokeWidth-2 lines (tab-1 revenue, tab-2
//                      forecasted/actual, activities over time)
//   LabelPieChart      the FULL pie (cx/cy 50%, labelLine false, outer
//                      radius 90/100, per-slice label formatter, palette
//                      Cells) — replaces the old donut
//   HorizontalBarChart layout="vertical" bars (funnel #06b6d4 width 100,
//                      top-10 #3b82f6 width 120 $) with plain bars (no
//                      radius/maxBarSize/Cells)
//   RevenueLineChart   the DASHBOARD's won/target areas only — re-pinned
//                      to fillOpacity .6/.3 + STOCK strokeWidth + $
//                      tooltip + tick 12 (s27-P7)
//   ConversionFunnel   the leads FunnelChart (LabelList right, per-item
//                      fills — the s13 shape, kept)
//
// Session-10 (S10-4/S10-5, still true): the reference passes NO `content`
// to <Tooltip> (the stock recharts-default-tooltip white box) and renders
// the REAL chart at all-zero data. Session-13 (S13-P8, still true): the
// grid is dashed "3 3" EXPLICITLY on every gridded chart (recharts'
// default grid is SOLID).

// Session-56 (S56-P1, N-56a): the `import * as React` line that was
// here is deleted — dead since the initial commit (zero React.* refs;
// Next.js runs the automatic JSX runtime, so no namespace import is
// needed). The N-53c/N-55a orphaned-import class.
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Funnel as FunnelBar,
  FunnelChart,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/** The reference's tooltip formatters (bundle-extracted verbatim). */
export function dollarFormatter(v: number): string {
  return `$${v.toLocaleString()}`;
}

/** Session-74 (L-74c13): the PLAIN grouping-comma mirror — the reference's
 *  tab-1 Pipeline by Stage decodes `formatter: p => p.toLocaleString()`
 *  (no $ prefix; the "$" lives in the series NAME "Value ($)"). */
export function numberFormatter(v: number): string {
  return v.toLocaleString();
}

export function percentFormatter(v: number): string {
  return `${v}%`;
}

type AxisTick = { fontSize: number } | undefined;

/**
 * The reference's single-series vertical bar chart. Stock axes/margins
 * everywhere; ONE Bar carrying the single fill (never per-datum Cells).
 */
export function SingleBarChart({
  data,
  xKey,
  dataKey,
  fill,
  name,
  radius,
  formatter,
  tickFontSize,
  height = 300,
  grid = true,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  dataKey: string;
  fill: string;
  /** The Bar's series name (tab-1 pipeline ships "Value ($)" — a plain-number tooltip shows it). */
  name?: string;
  radius?: [number, number, number, number];
  formatter?: (v: number) => string;
  tickFontSize?: number;
  height?: number;
  grid?: boolean;
}) {
  const tick: AxisTick = tickFontSize ? { fontSize: tickFontSize } : undefined;
  return (
    <div style={{ height }} className="chart-no-outline">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          {grid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={xKey} tick={tick} />
          <YAxis tick={tick} />
          <Tooltip formatter={formatter} />
          <Bar dataKey={dataKey} fill={fill} radius={radius} name={name} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * The grouped-bar pair family (the reference's won-vs-lost and
 * Activities/Won-Deals charts — bar PAIRS, never the lines our scaffold
 * shipped; the stock Legend rides the wonlost charts only, s98 F-98c2).
 */
export function GroupedBarsChart({
  data,
  xKey,
  series,
  height = 300,
  tickFontSize,
  legend = true,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: Array<{ key: string; name: string; fill: string }>;
  height?: number;
  tickFontSize?: number;
  /** Session-98 (F-98c2): the reference ships the stock Legend on the
   *  WONLOST charts only (its "Won vs Lost Over Time" renders 2 items even
   *  at zero data) — its "Activities vs Wins" renders NO legend wrapper at
   *  all (live-censused at 390 AND 1440; the s27 bundle decode agrees).
   *  Default true keeps the wonlost family; the vs-wins site opts out. */
  legend?: boolean;
}) {
  const tick: AxisTick = tickFontSize ? { fontSize: tickFontSize } : undefined;
  return (
    <div style={{ height }} className="chart-no-outline">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} tick={tick} />
          <YAxis tick={tick} />
          <Tooltip />
          {legend && <Legend />}
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.fill} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * The 1-2 line trend family (strokeWidth 2 — the reference's explicit
 * value). Dots render at the recharts default (the reference passes no
 * dot prop on its main-chart lines).
 */
export function TrendLineChart({
  data,
  xKey,
  series,
  formatter,
  height = 300,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  // Session-74 (L-74c12): name is OPTIONAL — the reference's Revenue Over
  // Time + Activities Over Time lines ship NO name (the tooltip renders
  // the raw dataKey); the named consumers (the Forecasting Accuracy pair)
  // keep passing theirs.
  series: Array<{ key: string; name?: string; stroke: string }>;
  formatter?: (v: number) => string;
  height?: number;
}) {
  return (
    <div style={{ height }} className="chart-no-outline">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip formatter={formatter} />
          {series.map((s) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.stroke} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * The label-PIE family — a FULL pie (cx/cy 50%, labelLine false, no
 * innerRadius/paddingAngle/Legend) with per-slice label text and palette
 * Cells. The reference's four pies: Account Health (outerRadius 100,
 * `${name}: ${value}`, [#10b981,#f59e0b,#ef4444]), Forecast by
 * Probability (90, `${band}%: $${(v/1e3).toFixed(0)}K`, 4 colors),
 * Activities by Type + Leads by Source (90, `${x}: ${count}`, 5 colors).
 */
export function LabelPieChart({
  data,
  outerRadius,
  labelFor,
  fills,
  formatter,
  height = 300,
}: {
  data: Array<Record<string, string | number>>;
  outerRadius: number;
  /** Receives the slice's entry (name/band/type/source… + value) — the reference's label callbacks. */
  labelFor: (entry: Record<string, unknown> & { value?: number }) => string;
  fills: string[];
  formatter?: (v: number) => string;
  height?: number;
}) {
  return (
    <div style={{ height }} className="chart-no-outline">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            labelLine={false}
            label={labelFor}
            outerRadius={outerRadius}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={fills[i % fills.length]} />
            ))}
          </Pie>
          <Tooltip formatter={formatter} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * The horizontal-bar family (layout="vertical"): the reports Conversion
 * Funnel (#06b6d4, YAxis stage width 100) and the tab-5 Top 10 Accounts
 * by Revenue (#3b82f6, YAxis name width 120, $ tooltip). Plain bars —
 * the reference passes no radius/maxBarSize and no Cells here.
 */
export function HorizontalBarChart({
  data,
  yKey,
  yWidth,
  dataKey,
  fill,
  formatter,
  height = 300,
}: {
  data: Array<Record<string, string | number>>;
  yKey: string;
  yWidth: number;
  dataKey: string;
  fill: string;
  formatter?: (v: number) => string;
  height?: number;
}) {
  return (
    <div style={{ height }} className="chart-no-outline">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey={yKey} width={yWidth} />
          <Tooltip formatter={formatter} />
          <Bar dataKey={dataKey} fill={fill} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * The DASHBOARD's revenue chart — the won/target AREA pair only (every
 * other surface that was wired here in the scaffold era now ships the
 * reference's own chart type via the families above). Session-27
 * re-pin: fillOpacity .6 (won) / .3 (target), STOCK strokeWidth (the
 * reference passes none — 1), the $ tooltip, tick fontSize 12 and stock
 * axes/margins.
 */
export function RevenueLineChart({
  data,
  height = 300,
  series,
  tickFontSize,
}: {
  data: Array<Record<string, string | number>>;
  height?: number;
  series: Array<{ key: string; label: string; color: string; fillOpacity?: number }>;
  tickFontSize?: number;
}) {
  const tick: AxisTick = tickFontSize ? { fontSize: tickFontSize } : undefined;
  return (
    <div style={{ height }} className="chart-no-outline">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={tick} />
          <YAxis tick={tick} />
          <Tooltip formatter={dollarFormatter} />
          {/* The reference ships the recharts DEFAULT legend (plainline
              icons, series-colored text) — no props. */}
          <Legend />
          {series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              fill={s.color}
              fillOpacity={s.fillOpacity ?? 0.3}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * The LEADS page's Conversion Funnel — a recharts FunnelChart (the s13
 * shape: its own data prop with per-datum fills + a right-side LabelList).
 * The reference's funnel labels/fills are pinned by LEADS_FUNNEL in
 * constants.ts (New Leads/Contacted/Qualified/Won on
 * #3b82f6/#8b5cf6/#10b981/#22c55e) — see tests/leads-charts.test.ts.
 * Session-70 (N-70c6): isAnimationActive={false} retired — the
 * reference's funnel (bundle: the Funnel + LabelList + per-datum
 * Cells) passes NO animation prop; it animates on mount (every one of
 * the 38 isAnimationActive occurrences in the reference bundle is a
 * recharts library internal, zero application call-sites).
 */
export function ConversionFunnel({
  data,
  height = 300,
}: {
  data: Array<{ id: string; label: string; count: number; color: string }>;
  height?: number;
}) {
  const funnelData = data.map((d) => ({
    ...d,
    value: d.count,
    fill: d.color,
  }));
  return (
    <div style={{ height }} className="chart-no-outline">
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip />
          <FunnelBar dataKey="value" data={funnelData}>
            <LabelList position="right" fill="#000" stroke="none" dataKey="label" />
          </FunnelBar>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}
