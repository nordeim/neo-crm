"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Page title row with actions — mirrors the reference page headers. */
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/**
 * Plain colored delta text — the reference renders deltas as bare inline
 * text (green / red / grey) with no pill and no arrow icon.
 */
export function DeltaText({
  delta,
  suffix = "%",
  invert = false,
  className,
}: {
  delta: number | null | undefined;
  suffix?: string;
  invert?: boolean;
  className?: string;
}) {
  if (typeof delta !== "number") return null;
  const neutral = delta === 0;
  const good = invert ? delta < 0 : delta > 0;
  return (
    <span
      className={cn(
        "text-sm font-medium",
        neutral ? "text-muted" : good ? "text-success" : "text-danger",
        className,
      )}
    >
      {delta > 0 ? "+" : ""}
      {Math.round(delta * 10) / 10}
      {suffix}
    </span>
  );
}

/**
 * KPI card for the dashboard / accounts pages: label on top, big value with
 * an inline plain-text delta, mini chart at the bottom — the reference
 * anatomy (no hint line, no pill badges).
 */
export function KpiCard({
  label,
  value,
  delta,
  deltaSuffix = "%",
  invertDelta = false,
  children,
}: {
  label: string;
  value: React.ReactNode;
  delta?: number | null;
  deltaSuffix?: string;
  invertDelta?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-xs font-medium tracking-wide text-muted">{label}</p>
      <div className="mt-2 flex flex-wrap items-baseline gap-2">
        <p className="text-[28px] font-semibold leading-none tracking-tight text-foreground">{value}</p>
        <DeltaText delta={delta} suffix={deltaSuffix} invert={invertDelta} />
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}

/** Secondary label used inside cards ("Last 6 months", etc.). */
export function CardCaption({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-muted">{children}</span>;
}

/** Icon chip used by the stat-card variants. */
function IconChip({
  icon,
  bg,
  color,
  rounded = "rounded-lg",
  className,
}: {
  icon: React.ReactNode;
  bg: string;
  color: string;
  rounded?: string;
  className?: string;
}) {
  return (
    <span
      className={cn("flex h-10 w-10 shrink-0 items-center justify-center", rounded, className)}
      style={{ backgroundColor: bg, color }}
      aria-hidden="true"
    >
      {icon}
    </span>
  );
}

/**
 * Contacts / leads stat card: label top-left, big value (plus optional
 * sub-value line) bottom-left, icon chip on the far right — the reference
 * layout. `tone: "solid"` renders a colored chip with a white glyph
 * (contacts); `tone: "tint"` renders a light chip with a colored glyph
 * (leads).
 */
export function IconStatCard({
  label,
  value,
  subValue,
  icon,
  tone = "tint",
  color,
}: {
  label: string;
  value: React.ReactNode;
  subValue?: React.ReactNode;
  icon: React.ReactNode;
  tone?: "solid" | "tint";
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-wide text-muted">{label}</p>
        <p className="mt-2 text-[26px] font-semibold leading-none tracking-tight text-foreground">{value}</p>
        {subValue !== undefined && <p className="mt-1.5 text-sm font-medium text-muted">{subValue}</p>}
      </div>
      <IconChip
        icon={icon}
        bg={tone === "solid" ? color : `${color}1a`}
        color={tone === "solid" ? "#ffffff" : color}
      />
    </div>
  );
}

/**
 * Reports stat card: light tinted circle icon on the far left, label and
 * value (plus optional inline $ sub-value) to its right, optional sparkline
 * at the bottom — the reference "Sales Overview" KPI row.
 */
export function CircleStatCard({
  label,
  value,
  subValue,
  icon,
  color,
  children,
}: {
  label: string;
  value: React.ReactNode;
  subValue?: React.ReactNode;
  icon: React.ReactNode;
  color: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3.5">
        <IconChip icon={icon} bg={`${color}1a`} color={color} rounded="rounded-full" className="h-12 w-12" />
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted">{label}</p>
          <p className="mt-0.5 flex flex-wrap items-baseline gap-1.5 text-2xl font-semibold leading-tight tracking-tight text-foreground">
            {value}
            {subValue !== undefined && <span className="text-sm font-medium text-muted">{subValue}</span>}
          </p>
        </div>
      </div>
      {children && <div className="mt-1">{children}</div>}
    </div>
  );
}

/**
 * Calendar stat card: icon chip top-left, green trend text (with the small
 * reference arrow) top-right, big value in the middle, label at the bottom.
 */
export function TrendStatCard({
  label,
  value,
  trend,
  icon,
  color,
}: {
  label: string;
  value: React.ReactNode;
  trend?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <IconChip icon={icon} bg={`${color}1a`} color={color} className="h-9 w-9" />
        {trend && (
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-success">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7" />
              <path d="M8 7h9v9" />
            </svg>
            {trend}
          </span>
        )}
      </div>
      <p className="mt-3 text-[26px] font-semibold leading-none tracking-tight text-foreground">{value}</p>
      <p className="mt-2 text-xs font-medium text-muted">{label}</p>
    </div>
  );
}

/**
 * Mini sparkline for KPI cards — pure SVG/CSS, no chart library.
 * `variant="bars"` renders the reference bar strips; `"line"` and `"area"`
 * render the polyline/area strips seen on the reference dashboard
 * (Total Leads / Avg. Sales Cycle lines, Conversion Rate area).
 */
export function Sparkline({
  values,
  color,
  colorFor,
  variant = "bars",
  className,
}: {
  values: number[];
  color: string;
  /** Per-bar override (e.g. blue when the monthly target was met). */
  colorFor?: (value: number, index: number) => string;
  variant?: "bars" | "line" | "area";
  className?: string;
}) {
  const max = Math.max(...values, 1);
  if (values.length === 0) return null;

  if (variant === "line" || variant === "area") {
    const w = 100;
    const h = 32;
    const step = values.length > 1 ? w / (values.length - 1) : w;
    const pts = values.map(
      (v, i) => `${(i * step).toFixed(2)},${(h - Math.max((v / max) * (h - 4) + 2, 2)).toFixed(2)}`,
    );
    const line = `M${pts.join(" L")}`;
    return (
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className={cn("h-8 w-full", className)}
        aria-hidden="true"
      >
        {variant === "area" && <path d={`${line} L${w},${h} L0,${h} Z`} fill={color} opacity={0.15} />}
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  return (
    <div className={cn("flex h-8 items-end gap-1", className)} aria-hidden="true">
      {values.map((v, i) => (
        <span
          key={i}
          className="w-1.5 flex-1 rounded-[2px]"
          style={{
            height: `${Math.max((v / max) * 100, 8)}%`,
            backgroundColor: colorFor ? colorFor(v, i) : color,
            opacity: v > 0 ? 1 : 0.35,
          }}
        />
      ))}
    </div>
  );
}
