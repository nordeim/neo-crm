"use client";

// Recharts wrappers styled to the NEO CRM palette. All charts are responsive
// and render an EmptyPlaceholder when there is no data.

import * as React from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
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

const AXIS_STYLE = { fontSize: 11, fill: "#9ca3af" } as const;
const GRID_COLOR = "#f3f4f6";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string; dataKey?: string | number }>;
  label?: string | number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-line bg-white px-3 py-2 text-xs shadow-lg">
      {label !== undefined && <p className="mb-1 font-semibold text-foreground">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-1.5 text-muted">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="capitalize">{p.name}:</span>{" "}
          <span className="font-medium text-foreground">
            {typeof p.value === "number" && /value|revenue|pipeline/i.test(String(p.dataKey ?? ""))
              ? formatCompactCurrency(p.value)
              : p.value}
          </span>
        </p>
      ))}
    </div>
  );
}

/**
 * Reference dashboard pipeline chart: vertical bars of the per-stage COUNT
 * (integer Y axis) with a value legend underneath showing "Stage: $x.xk"
 * per stage — exactly the reference anatomy.
 */
export function PipelineBarChart({
  data,
  height = 260,
}: {
  data: Array<{ label: string; value: number; count: number; color: string }>;
  height?: number;
}) {
  if (data.length === 0 || data.every((d) => d.count === 0)) {
    return <ChartEmpty height={height} />;
  }
  return (
    <div>
      <div style={{ height }} className="chart-no-outline">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={GRID_COLOR} vertical={false} />
            <XAxis dataKey="label" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(59,130,246,0.06)" }} />
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
  height = 260,
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
  const hasData = data.some((d) => series.some((s) => Number(d[s.key]) > 0));
  if (!hasData) return <ChartEmpty height={height} />;
  return (
    <div style={{ height }} className="chart-no-outline">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID_COLOR} vertical={false} />
          <XAxis dataKey="month" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={56} />
          <Tooltip content={<ChartTooltip />} />
          {!hideLegend && (
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: "#6b7280", paddingTop: 8 }}
            />
          )}
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
  height = 240,
}: {
  data: Array<{ month: string; won: number; lost: number }>;
  height?: number;
}) {
  const hasData = data.some((d) => d.won > 0 || d.lost > 0);
  if (!hasData) return <ChartEmpty height={height} />;
  return (
    <div style={{ height }} className="chart-no-outline">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID_COLOR} vertical={false} />
          <XAxis dataKey="month" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "#6b7280", paddingTop: 8 }} />
          <Line type="monotone" dataKey="won" name="Won" stroke={CHART_COLORS.green} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="lost" name="Lost" stroke={CHART_COLORS.red} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ConversionFunnel({
  data,
  height = 260,
}: {
  data: Array<{ id: string; label: string; count: number; color: string }>;
  height?: number;
}) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const max = data[0]?.count ?? 0;
  if (total === 0) return <ChartEmpty height={height} />;
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-4" style={{ minHeight: height }}>
      {data.map((d, i) => {
        const widthPct = max > 0 ? Math.max(18, Math.round((d.count / max) * 100)) : 0;
        const conv = i > 0 && data[i - 1].count > 0 ? Math.round((d.count / data[i - 1].count) * 100) : null;
        return (
          <React.Fragment key={d.id}>
            {conv !== null && (
              <span className="text-[10px] font-medium text-subtle">↓ {conv}%</span>
            )}
            <div className="flex w-full items-center gap-3">
              <div className="w-full flex-1">
                <div
                  className="mx-auto flex h-9 items-center justify-center rounded-md text-xs font-semibold text-white transition-all"
                  style={{ width: `${widthPct}%`, backgroundColor: d.color, minWidth: 90 }}
                >
                  {d.label} · {d.count}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
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
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <ChartEmpty height={height} />;
  return (
    <div style={{ height }} className="chart-no-outline">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2} strokeWidth={2}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "#6b7280" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartEmpty({ height }: { height: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg border border-dashed border-line text-xs text-subtle"
      style={{ height }}
    >
      No data for this period yet
    </div>
  );
}
