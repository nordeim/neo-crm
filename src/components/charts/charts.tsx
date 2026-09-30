"use client";

// Recharts wrappers styled to the NEO CRM palette.
//
// Session-10 (S10-4/S10-5): the reference ships recharts DEFAULT tooltips
// (no `content` prop — the `recharts-default-tooltip` white box with a 1px
// #ccc border) and renders the REAL chart at all-zero data (ticks, zero
// bars, legends — no empty-state placeholder boxes). Both of our session-1
// inventions (the custom ChartTooltip and the ChartEmpty early-returns)
// are retired here; this reverses the "friendly placeholder" decision
// documented in AGENTS/CLAUDE (see the session-10 plan).

import * as React from "react";
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
import { CHART_COLORS } from "@/lib/constants";
import { formatCompactCurrency } from "@/lib/format";

// Session-10 (S10-11 family + VLM round): the reference passes NO tick or
// grid style on its charts — the ticks render at the recharts DEFAULT
// (12px #666) and the CartesianGrid at the default DASHED "3 3" #ccc with
// BOTH horizontal (per Y tick) and vertical (per X tick) lines (11 lines
// on the reference pipeline chart: 5 horizontal + 6 vertical — DOM
// counted). Our solid #f3f4f6 horizontal-only grid is retired.

/**
 * Reference dashboard pipeline chart: vertical bars of the per-stage COUNT
 * (integer Y axis) with a value legend underneath showing "Stage: $x.xk"
 * per stage — exactly the reference anatomy.
 */
export function PipelineBarChart({
  data,
  // Session-11 (S11-P4): the reference's dashboard pipeline renders at
  // 300px (`.recharts-wrapper` measured 534×300); the leads rail passes
  // 250 explicitly (381px cards).
  height = 300,
}: {
  data: Array<{ label: string; value: number; count: number; color: string }>;
  height?: number;
}) {
  return (
    <div>
      <div style={{ height }} className="chart-no-outline">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid />
            <XAxis dataKey="label" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} width={32} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" name="Leads" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((d) => (
                <Cell key={d.label} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {data.map((d) => (
          <span key={d.label} className="inline-flex items-center gap-1.5 text-xs text-muted">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
            {d.label}: {formatCompactCurrency(d.value)}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Reference revenue chart: "Won" teal line + "Target" red line carried on a
 * pale red AREA fill, raw (unformatted) Y-axis values like the reference.
 */
export function RevenueLineChart({
  data,
  // Session-11 (S11-P4): the reference's dashboard revenue chart renders
  // at 300px (534×300).
  height = 300,
  series,
  hideLegend = false,
}: {
  data: Array<Record<string, string | number>>;
  height?: number;
  series: Array<{ key: string; label: string; color: string; dashed?: boolean; filled?: boolean }>;
  /** The reference Reports page ships its revenue chart WITHOUT a legend
      (DOM-verified) — the dashboard version keeps one. */
  hideLegend?: boolean;
}) {
  return (
    <div style={{ height }} className="chart-no-outline">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} width={56} />
          <Tooltip />
          {/* Session-11 (S11-P7): the reference ships the recharts DEFAULT
              legend (plainline icons, series-colored text — Won #10b981 /
              Target #ef4444). Our custom circle-8px/gray variant is retired,
              same rule as the s10 tooltip sweep: no props where the
              reference passes none. */}
          {!hideLegend && <Legend />}
          {series.map((s) =>
            s.filled ? (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2.5}
                fill={s.color}
                fillOpacity={0.08}
                strokeDasharray={s.dashed ? "6 4" : undefined}
                activeDot={{ r: 4 }}
              />
            ) : (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2.5}
                strokeDasharray={s.dashed ? "6 4" : undefined}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ),
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WonLostLineChart({
  data,
  // Session-11 (S11-P4): the reference's reports tab-1 won-vs-lost renders
  // at 300px; the leads rail passes 250 explicitly.
  height = 300,
}: {
  data: Array<{ month: string; won: number; lost: number }>;
  height?: number;
}) {
  return (
    <div style={{ height }} className="chart-no-outline">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} width={32} allowDecimals={false} />
          <Tooltip />
          {/* Session-11 (S11-P7): default legend — the leads/reports
              zero-state renders it empty (row-derived series), but the
              populated style is the recharts default everywhere else we
              could measure; same no-props rule as the tooltip sweep. */}
          <Legend />
          <Line type="monotone" dataKey="won" name="Won" stroke={CHART_COLORS.green} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="lost" name="Lost" stroke={CHART_COLORS.red} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * S10-7: the reference's Conversion Funnel is a recharts FunnelChart —
 * four trapezoid groups (leads page AND reports tab 1; DOM-verified:
 * `.recharts-funnel-trapezoid` groups, empty shapes at zero data, an
 * empty label-list). Ours was a custom div-bar list. The four-stage
 * vocabulary (New/Qualified/Won/Lost) comes from FUNNEL_STAGES.
 */
export function ConversionFunnel({
  data,
  // Session-11 (S11-P4): the reference's funnels render at 300px on the
  // reports tabs (the leads rail passes 250 explicitly).
  height = 300,
}: {
  data: Array<{ id: string; label: string; count: number; color: string }>;
  height?: number;
}) {
  // recharts Funnel takes its own `data` (each datum carries its fill) with
  // a LabelList child — the canonical FunnelChart shape; at zero data it
  // renders the four empty trapezoid groups like the reference.
  const funnelData = data.map((d) => ({
    label: d.label,
    count: d.count,
    fill: d.color,
  }));
  return (
    <div style={{ height }} className="chart-no-outline">
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip />
          <FunnelBar dataKey="count" data={funnelData} isAnimationActive={false}>
            <LabelList position="right" dataKey="label" fill="#111827" fontSize={12} />
          </FunnelBar>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutChart({
  data,
  height = 240,
  centerLabel,
}: {
  data: Array<{ name: string; value: number; color: string }>;
  height?: number;
  centerLabel?: string;
}) {
  return (
    <div style={{ height }} className="chart-no-outline">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2} strokeWidth={2}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "#6b7280" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
