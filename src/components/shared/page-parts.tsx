"use client";

import * as React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { PAGE_HEADER, type PageHeaderVariant } from "@/lib/page-layout";

/** Page title row with actions — mirrors the reference page headers
 *  (session-6 anatomy): the standard/leads variants STACK on phones
 *  (`flex-col` → `sm:flex-row`, actions `w-full sm:w-auto`); contacts is the
 *  flat variant (fixed `text-3xl` title, plain row, `gap-3` actions). */
export function PageHeader({
  title,
  subtitle,
  actions,
  variant = "standard",
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  variant?: PageHeaderVariant;
}) {
  const spec = PAGE_HEADER[variant];
  return (
    <div className={spec.row}>
      <div>
        <h1 className={spec.title}>{title}</h1>
        {subtitle && <p className={spec.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={spec.actions}>{actions}</div>}
    </div>
  );
}

/**
 * Plain colored delta text — the reference renders deltas as bare inline
 * text-xs (green / red / grey) with no pill (dashboard cards).
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
        "text-xs font-medium",
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
 * Delta row with the reference's trending icon — accounts/activities stat
 * cards render `flex items-center gap-1 text-xs text-{green|red}-600` with a
 * w-3 h-3 lucide trending-up (positive) / trending-down (negative) glyph.
 * Text deltas that the reference renders bare ("+4 today") pass `icon={null}`.
 */
export function DeltaBadgeText({
  children,
  tone = "success",
  icon = "up",
}: {
  children: React.ReactNode;
  tone?: "success" | "danger" | "muted";
  icon?: "up" | "down" | null;
}) {
  const Glyph = icon === "down" ? TrendingDown : TrendingUp;
  return (
    <span
      className={cn(
        "flex items-center gap-1 text-xs",
        tone === "success" ? "text-success" : tone === "danger" ? "text-danger" : "text-muted",
      )}
    >
      {icon && <Glyph className="h-3 w-3" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}

/**
 * KPI card for the dashboard: label on top, big bold value with an inline
 * plain-text delta (text-xs, aligned to the value's baseline), mini chart at
 * the bottom — the reference dashboard anatomy (DOM-verified:
 * `p-4 sm:p-6`, label `text-xs sm:text-sm`, value `text-2xl sm:text-3xl
 * font-bold`, delta `text-xs …-600 mb-1`, value row `flex items-end gap-2`).
 * Session-5: `suffix` renders as a SIBLING `text-xs text-gray-600 mb-1` span
 * (the reference's Avg. Sales Cycle "days" anatomy), not a nested text-sm.
 */
export function KpiCard({
  label,
  value,
  suffix,
  delta,
  deltaSuffix = "%",
  invertDelta = false,
  children,
}: {
  label: string;
  value: React.ReactNode;
  /** Small gray unit suffix next to the value ("days"). */
  suffix?: string;
  delta?: number | null;
  deltaSuffix?: string;
  invertDelta?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      <p className="text-xs text-muted sm:text-sm">{label}</p>
      <div className="mt-2 flex flex-wrap items-end gap-2">
        <p className="text-2xl font-bold leading-none tracking-tight text-foreground sm:text-3xl">{value}</p>
        {suffix && <span className="mb-1 text-xs text-muted">{suffix}</span>}
        <DeltaText delta={delta} suffix={deltaSuffix} invert={invertDelta} className="mb-1" />
      </div>
      {children && <div className="mt-2">{children}</div>}
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
 * Accounts / activities stat card — the side-by-side reference anatomy:
 * header row (label left, delta-with-trending-icon right), footer row
 * (bold value + optional sub-text left, `h-10` mini-bar strip right).
 * DOM-verified: bars are `flex-1 rounded-sm bg-{color}-400` with percentage
 * heights inside `h-10 w-24` (accounts) / `h-10 w-20` (activities).
 * Session-5: header deltas carry ONLY the reference's two icon-deltas
 * (green trending-up percentages, red trending-down "Xh overdue"); the
 * "+N today" / "+Xh Ym" / "Due now" annotations render as gray `text-xs
 * mt-1` SUBTEXTS UNDER the value instead.
 */
export function BarStatCard({
  label,
  value,
  subValue,
  delta,
  deltaIcon = "up",
  deltaTone,
  bars,
  barColor,
  barColorFor,
  barWidth = "w-20",
  className,
}: {
  label: string;
  value: React.ReactNode;
  subValue?: React.ReactNode;
  delta?: React.ReactNode;
  deltaIcon?: "up" | "down" | null;
  /** Derived from the icon direction when omitted. */
  deltaTone?: "success" | "danger" | "muted";
  bars: number[];
  barColor: string;
  barColorFor?: (value: number, index: number) => string;
  /** `w-20` (activities) or `w-24` (accounts) — no responsive growth. */
  barWidth?: "w-20" | "w-24";
  className?: string;
}) {
  const tone = deltaTone ?? (deltaIcon === "down" ? "danger" : "success");
  const pct = (v: number) => Math.max(Math.round((v / Math.max(...bars, 1)) * 100), 12);
  return (
    <div className={cn("rounded-xl border border-line bg-surface p-4 shadow-sm", className)}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="text-xs text-muted">{label}</span>
        {delta != null && (
          <DeltaBadgeText tone={tone} icon={deltaIcon}>
            {delta}
          </DeltaBadgeText>
        )}
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-2xl font-bold leading-none tracking-tight text-foreground sm:text-3xl">{value}</p>
          {subValue !== undefined && <p className="mt-1 text-xs text-muted">{subValue}</p>}
        </div>
        <div className={cn("flex h-10 shrink-0 items-end gap-0.5", barWidth)} aria-hidden="true">
          {bars.map((v, i) => (
            <span
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${pct(v)}%`,
                backgroundColor: barColorFor ? barColorFor(v, i) : barColor,
                opacity: v > 0 ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Contacts / leads stat card: label top-left, big value (plus optional
 * sub-value line) bottom-left, icon chip on the far right — the reference
 * layout. Two DOM-verified variants (session-5):
 * - `contacts` (default): gradient card (`bg-gradient-to-br from-white
 *   to-gray-50`), `p-6`, label `text-sm font-medium text-gray-600`, value
 *   `text-3xl font-bold`, solid `bg-{c}-500` chip (`tone: "solid"`) with a
 *   white glyph, optional trend row (trending-up + green text).
 * - `leads`: plain white card, `p-4 sm:p-6`, header `flex items-center
 *   justify-between mb-2`, label `text-xs sm:text-sm` plain, value
 *   `text-xl sm:text-2xl font-bold`, tinted `rounded-lg bg-{c}-50` chip
 *   `w-8 h-8 sm:w-10 sm:h-10`, no hover shadow.
 */
export function IconStatCard({
  label,
  value,
  subValue,
  trend,
  icon,
  tone = "tint",
  gradient = false,
  variant = "contacts",
  color,
}: {
  label: string;
  value: React.ReactNode;
  subValue?: React.ReactNode;
  /** Optional trend row under the value: trending-up icon + green text. */
  trend?: React.ReactNode;
  icon: React.ReactNode;
  tone?: "solid" | "tint";
  gradient?: boolean;
  /** "contacts" (gradient/p6/text-3xl) or "leads" (p4-sm:p6/text-xl-2xl). */
  variant?: "contacts" | "leads";
  color: string;
}) {
  if (variant === "leads") {
    return (
      <div className="rounded-xl border border-line bg-surface p-4 shadow-sm sm:p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-muted sm:text-sm">{label}</span>
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10"
            style={{ backgroundColor: `${color}1a`, color }}
            aria-hidden="true"
          >
            {icon}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-foreground sm:text-2xl">{value}</span>
          {subValue !== undefined && <span className="text-sm font-medium text-muted">{subValue}</span>}
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border border-line p-6 shadow-sm",
        gradient ? "bg-gradient-to-br from-white to-gray-50" : "bg-surface",
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted">{label}</p>
        <p className="mb-2 mt-2 text-3xl font-bold leading-none tracking-tight text-foreground">{value}</p>
        {trend !== undefined && (
          <span className="flex items-center gap-1 text-sm font-medium text-success">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            {trend}
          </span>
        )}
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
 * Reports stat card — session-5 DOM-verified anatomy: header row
 * (`flex items-center gap-3`, mb-3) with a SQUARE `w-10 h-10 rounded-lg
 * bg-{c}-50` tinted chip, label `text-xs text-gray-500 mb-1` and the count
 * + amount INLINE in one `text-2xl font-bold` value ("6 $542.0K"); optional
 * sparkline below. The card keeps its hover shadow (the reference reports
 * cards are the one place `hover:shadow-md` appears).
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
  /** Inline amount rendered INSIDE the big bold value (same size/weight). */
  subValue?: React.ReactNode;
  icon: React.ReactNode;
  color: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${color}1a`, color }}
            aria-hidden="true"
          >
            {icon}
          </span>
          <div className="min-w-0">
            <p className="mb-1 text-xs text-muted">{label}</p>
            <p className="flex flex-wrap items-baseline gap-1.5 text-2xl font-bold leading-tight text-foreground">
              {value}
              {subValue !== undefined && <span>{subValue}</span>}
            </p>
          </div>
        </div>
      </div>
      {children && <div className="flex-1">{children}</div>}
    </div>
  );
}

/**
 * Centered empty-state cell for entity tables — the reference renders
 * `text-center py-8 text-gray-500` (accounts/leads) / `py-12` (contacts)
 * inside the first td, spanning every column.
 */
export function TableEmptyRow({
  colSpan,
  message,
  padding = "py-8",
}: {
  colSpan: number;
  message: string;
  padding?: "py-8" | "py-12";
}) {
  return (
    <tr>
      <td colSpan={colSpan} className={cn("p-2 text-center text-muted", padding)}>
        {message}
      </td>
    </tr>
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
