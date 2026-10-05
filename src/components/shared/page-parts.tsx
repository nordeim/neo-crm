"use client";

import * as React from "react";
import { Area, AreaChart, Line, LineChart, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  KPI_CARD,
  KPI_CHIP_BG,
  KPI_SPARK,
  KPI_VALUE,
  PAGE_HEADER,
  STAT_CARD,
  type PageHeaderVariant,
} from "@/lib/page-layout";

/** Page title row with actions — mirrors the reference page headers
 *  (session-6 anatomy): the standard/leads variants STACK on phones
 *  (`flex-col` → `sm:flex-row`, actions `w-full sm:w-auto`); contacts is the
 *  flat variant (fixed `text-3xl` title, plain row, `gap-3` actions).
 *  Session-7: `subtitleSize="sm"` renders the 14px subtitle the reference
 *  ships on calendar + reports (every other page is 16px). */
export function PageHeader({
  title,
  subtitle,
  subtitleSize,
  actions,
  unwrapActions = false,
  variant = "standard",
}: {
  title: string;
  subtitle?: string;
  subtitleSize?: "base" | "sm";
  actions?: React.ReactNode;
  /** Session-9 (S9-7): the reports header renders its single button as a
   *  DIRECT child of the header row (no flex group div) — pass true to
   *  skip the wrapper. */
  unwrapActions?: boolean;
  variant?: PageHeaderVariant;
}) {
  const spec = PAGE_HEADER[variant];
  const subtitleClass = subtitleSize === "sm" ? spec.subtitleSm : spec.subtitle;
  // Session-9 (S9-4): the settings variant renders a PLAIN mb-6 header —
  // no actions wrapper (the page has no header buttons).
  const noWrap = "noActionsWrap" in spec && spec.noActionsWrap === true;
  return (
    <div className={spec.row}>
      <div>
        <h1 className={spec.title}>{title}</h1>
        {subtitle && <p className={subtitleClass}>{subtitle}</p>}
      </div>
      {actions && (noWrap || unwrapActions ? actions : <div className={spec.actions}>{actions}</div>)}
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
  /** Session-27 (S27-P7): a STRING delta renders verbatim in green — the
      reference HARDCODES its KPI deltas ("+5.3%", "+15%") as literals. */
  delta: number | string | null | undefined;
  suffix?: string;
  invert?: boolean;
  className?: string;
}) {
  if (typeof delta === "string") {
    return <span className={cn("text-xs text-green-600", className)}>{delta}</span>;
  }
  if (typeof delta !== "number") return null;
  const neutral = delta === 0;
  const good = invert ? delta < 0 : delta > 0;
  return (
    <span
      className={cn(
        // Session-12 (S12-P5): the reference's deltas are BARE text-xs —
        // no font-medium — green-600/red-600, with the NEUTRAL case in
        // gray-600 (#4b5563, not gray-500).
        "text-xs",
        neutral ? "text-gray-600" : good ? "text-green-600" : "text-red-600",
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
        tone === "success" ? "text-green-600" : tone === "danger" ? "text-red-600" : "text-muted",
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
  valueNote,
  children,
}: {
  label: string;
  value: React.ReactNode;
  /** Small gray unit suffix next to the value ("days"). */
  suffix?: string;
  delta?: number | string | null;
  /** Session-66 (N-66c): deltaSuffix/invertDelta retired — zero callers ever
   * passed them; DeltaText keeps its own suffix/invert defaults (the N-58c
   * module type-contract boundary). */
  /** Session-27 (S27-P7): a NEUTRAL text-xs text-gray-600 note in the value row (the Sales Target progress). */
  valueNote?: string;
  children?: React.ReactNode;
}) {
  return (
    // Session-12 (S12-P5): the reference MOVED — its dashboard KPI cards
    // are now PLAIN stock cards (`rounded-xl border bg-card shadow`, no
    // hover, no border-gray-200; the border rides the #e5e5e5 default).
    // The REPORTS KPI family (CircleStatCard) keeps the hover treatment.
    <div className={KPI_CARD.card}>
      <p className={KPI_CARD.label}>{label}</p>
      <div className="mt-2 flex flex-wrap items-end gap-2">
        {/* Session-13 (S13-P9): the reference's exact value string —
            INHERITING the card foreground (#0a0a0a, line-height 36px,
            letter-spacing normal). Our leading-none/tracking-tight/
            text-foreground additions were real computed diffs. */}
        <p className={KPI_VALUE}>{value}</p>
        {suffix && <span className="mb-1 text-xs text-muted">{suffix}</span>}
        {valueNote !== undefined && (
          /* Session-27 (S27-P7): the reference's Sales Target progress — a
             NEUTRAL text-xs text-gray-600 note in the value row, never a
             green/red delta. */
          <span className="mb-1 text-xs text-gray-600">{valueNote}</span>
        )}
        <DeltaText delta={delta} className="mb-1" />
      </div>
      {children && <div className={KPI_SPARK.dashboardContainer}>{children}</div>}
    </div>
  );
}

// Session-56 (S56-P2, N-56b): CardCaption retired — fully dead since the
// initial commit (zero src consumers, zero test refs; the cards carry
// their own caption spans). The ten living exports above stay (s57 count
// correction — seven was the pre-retirement count).
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
  /** Session-66 (N-66c): barColorFor retired — zero callers ever passed
   * it, so the per-bar ternary arm was construction-dead (Sparkline's
   * colorFor IS the live twin, on the dashboard). */
  /** `w-20` (activities) or `w-24` (accounts) — no responsive growth. */
  barWidth?: "w-20" | "w-24";
  className?: string;
}) {
  const tone = deltaTone ?? (deltaIcon === "down" ? "danger" : "success");
  const pct = (v: number) => Math.max(Math.round((v / Math.max(...bars, 1)) * 100), 12);
  return (
    <div className={cn("rounded-xl border border-line bg-surface p-4 shadow", className)}>
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
                backgroundColor: barColor,
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
      // Session-11 (S11-P2): bare `shadow` — the reference's leads stat
      // cards compute the standard shadow, not the tiny one.
      <div className="rounded-xl border border-line bg-surface p-4 shadow sm:p-6">
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
        // Session-11 (S11-P2): bare `shadow` here too — the reference's
        // contacts gradient cards compute the standard shadow.
        "flex items-center justify-between gap-3 rounded-xl border border-line p-6 shadow",
        gradient ? "bg-gradient-to-br from-white to-gray-50" : "bg-surface",
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted">{label}</p>
        <p className="mb-2 mt-2 text-3xl font-bold leading-none tracking-tight text-foreground">{value}</p>
        {trend !== undefined && (
          <span className="flex items-center gap-1 text-sm font-medium text-green-600">
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
    // Session-12 (S12-P3/P5/P6): the reports KPI family is the one stat
    // family that still carries the reference's EXPLICIT gray-200 border
    // (--color-line-strong) + hover:shadow-md after its dashboard KPI
    // cards dropped theirs; the icon chips are SOLID color-50s
    // (KPI_CHIP_BG), not alpha tints; the spark row renders the
    // reference's flex-end split with the h-12 slot.
    <div className={STAT_CARD.reportsCard}>
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: KPI_CHIP_BG[color] ?? `${color}1a`, color }}
            aria-hidden="true"
          >
            {icon}
          </span>
          <div className="min-w-0">
            <p className="mb-1 text-xs text-muted">{label}</p>
            <p className="flex flex-wrap items-baseline gap-1.5 text-2xl font-bold leading-tight text-foreground">
              {value}
            </p>
          </div>
        </div>
      </div>
      {(children || subValue !== undefined) && (
        <div className={KPI_SPARK.reportsWrapper}>
          <div className={cn(KPI_SPARK.reportsSlot, KPI_SPARK.reportsMaxWidth)}>{children}</div>
          {/* Session-27 (S27-P5): the reference's `ay` card renders the
              subtitle (Lost Deals' $XK) in the bottom-right delta column —
              text-xs text-gray-500 mt-1 — NOT inline with the value. */}
          <div className="flex flex-col items-end">
            {subValue !== undefined && (
              <div className="mt-1 text-xs text-gray-500">{subValue}</div>
            )}
          </div>
        </div>
      )}
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
 * Calendar stat card — session-7 re-pin (STAT_CARD contracts): `p-4`
 * body, `mb-3` top row, 40px `-50` tinted chip with an `h-5 w-5` icon,
 * `text-green-600` trend with a `w-3 h-3` trending-up glyph, label under
 * the `text-2xl font-bold` value. Chip colors arrive as class pairs
 * (`chipBg="bg-blue-50"` + `chipIconClass="text-blue-600"`) matching the
 * reference's -50/-600 pairs.
 */
export function TrendStatCard({
  label,
  value,
  trend,
  icon,
  chipBg,
  chipIconClass,
}: {
  label: string;
  value: React.ReactNode;
  trend?: string;
  icon: React.ReactNode;
  chipBg: string;
  chipIconClass: string;
}) {
  return (
    <div className={STAT_CARD.card}>
      <div className={STAT_CARD.body}>
        <div className={STAT_CARD.topRow}>
          <div className={cn(STAT_CARD.chip, chipBg)}>
            <span className={cn(STAT_CARD.chipIcon, chipIconClass)}>{icon}</span>
          </div>
          {trend && (
            <span className={STAT_CARD.trend}>
              <TrendingUp className={STAT_CARD.trendIcon} aria-hidden="true" />
              <span>{trend}</span>
            </span>
          )}
        </div>
        <div className={STAT_CARD.value}>{value}</div>
        <div className={STAT_CARD.label}>{label}</div>
      </div>
    </div>
  );
}

/**
 * Mini sparkline for KPI cards — session-12 (S12-P6) rebuild on recharts:
 * the reference renders its sparks as recharts MONOTONE curves inside a
 * ResponsiveContainer (line variant strokeWidth 2, no dots, stock 5px
 * margins; area variant fillOpacity 0.3 with a 1px stroke closing at the
 * chart's x-axis). `variant="bars"` keeps the reference's CSS bar strips
 * (Deals Closed cyan / Revenue green / Sales Target conditional). The
 * line/area geometry contract is pinned as KPI_SPARK in page-layout.ts.
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
  // Session-66 (N-66j): the empty guard runs BEFORE the max computation —
  // Math.max(...[]) would have been dead arithmetic on the empty path.
  if (values.length === 0) return null;
  const max = Math.max(...values, 1);

  if (variant === "line" || variant === "area") {
    const data = values.map((v, i) => ({ i, v }));
    return (
      <div className={cn("h-8 w-full", className)} aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          {variant === "area" ? (
            <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <Area
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={1}
                fill={color}
                fillOpacity={0.3}
                isAnimationActive={false}
              />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
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
