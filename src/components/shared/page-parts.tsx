"use client";

import * as React from "react";
import { Area, AreaChart, Line, LineChart, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  KPI_CARD,
  KPI_SPARK,
  KPI_VALUE,
  PAGE_HEADER,
  STAT_CHIP_PAIRS,
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
    // Session-87 (L-87c3): the reference's delta is a DIV construction
    // (`c.jsx("div",{className:"text-xs text-green-600 mb-1"})` — the
    // bundle's jsxs value-row children).
    return <div className={cn("text-xs text-green-600", className)}>{delta}</div>;
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
 * Delta row with the reference's trending icon — the gm/zv/Mx stat cards
 * render `flex items-center gap-1 text-xs text-{green|red}-600` with a
 * w-3 h-3 lucide trending-up (positive) / trending-down (negative) glyph.
 * Session-90 (L-90c6): the reference's own row is a DIV keyed by the
 * DIRECTION ("up"/"down") — up/down only, the bare-span text child.
 */
export function DeltaBadgeText({
  children,
  direction = "up",
}: {
  children: React.ReactNode;
  /** Session-90 (L-90c6, bundle-decoded from the reference's
   *  gm/zv/Mx trend rows): the trend is a DIRECTION string picking BOTH
   *  the row color and the icon — up/down ONLY (the muted tone arm and
   *  the tone/icon props retired: zero call sites ever passed a
   *  non-default tone; the ay row's font-medium variant constructs its
   *  own row in CircleStatCard). The row is a DIV with the width-first
   *  w-3 h-3 glyph + a bare span — the wrapper-level aria-hidden
   *  retired (the lucide library-level svg superset stands, documented
   *  at icons.tsx). */
  direction?: "up" | "down";
}) {
  const Glyph = direction === "down" ? TrendingDown : TrendingUp;
  return (
    <div
      className={`flex items-center gap-1 text-xs ${direction === "up" ? "text-green-600" : "text-red-600"}`}
    >
      <Glyph className="w-3 h-3" />
      <span>{children}</span>
    </div>
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
  sparkClassName,
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
  /** Session-87 (L-87c2): the variant-aware spark slot — the reference
   * renders ONE slot div per card (`mt-2 h-8` line/area; `mt-2 h-8 flex
   * items-end gap-1` bars); the Sparkline itself is content-only, so the
   * card owns the slot class. The bars cards pass
   * KPI_SPARK.dashboardBarsContainer; the line/area cards take the
   * default. */
  sparkClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    // Session-87 (L-87c3, bundle-decoded ot/ct): the reference's KPI card
    // is the STOCK Card (no padding) > CardContent with className "p-4
    // sm:p-6" > [the label row, the value row, the spark slot] — the
    // padding NEVER merges into the card div. The s12 de-hover pin
    // (plain stock card, no hover) is unchanged.
    <Card>
      <CardContent className={KPI_CARD.content}>
        {/* The label row: the reference wraps the label span in a flex
            `justify-between items-start mb-2` row div (the stock label-row
            construction — its mb-2 provides the label→value gap). */}
        <div className={KPI_CARD.labelRow}>
          <span className={KPI_CARD.label}>{label}</span>
        </div>
        {/* The value row: the BARE `flex items-end gap-2` — no mt-2 (the
            label row's mb-2 does it) and NO flex-wrap (the reference wraps
            nothing; a long value+delta overflows rather than wrapping).
            Session-13 (S13-P9): the value string INHERITS the card
            foreground (#0a0a0a, line-height 36px, letter-spacing normal). */}
        <div className={KPI_CARD.valueRow}>
          <span className={KPI_VALUE}>{value}</span>
          {suffix && <span className="text-xs text-gray-600 mb-1">{suffix}</span>}
          {valueNote !== undefined && (
            /* Session-27 (S27-P7): the reference's Sales Target progress — a
               NEUTRAL text-xs text-gray-600 DIV in the value row, never a
               green/red delta. Session-87 (L-87c3): span → div (the
               reference's jsxs container). */
            <div className="text-xs text-gray-600 mb-1">{valueNote}</div>
          )}
          <DeltaText delta={delta} className="mb-1" />
        </div>
        {children && <div className={sparkClassName ?? KPI_SPARK.dashboardContainer}>{children}</div>}
      </CardContent>
    </Card>
  );
}

// Session-56 (S56-P2, N-56b): CardCaption retired — fully dead since the
// initial commit (zero src consumers, zero test refs; the cards carry
// their own caption spans). The ten living exports above stay (s57 count
// correction — seven was the pre-retirement count).
// Session-75 (L-75c2-7): the IconChip helper RETIRED — the contacts
// stat-card arm re-derived to the reference's Rx construction (the
// inline p-3 rounded-lg chip with the w-6 h-6 icon), leaving this
// helper with zero consumers (the dch living-surfaces policy).

// Session-90 (L-90c4, bundle-decoded from the reference's gm): the
// ACTIVITIES bar color map — the reference's own ternary chain
// blue/green/red/cyan with the GRAY else (any unmatched key falls
// through, so "purple" [Meetings] renders bg-gray-400 — the s76
// M-76c6 note). The bars carry the bg-CLASS + the raw-percentage
// inline height ONLY (never an inline backgroundColor).
const BAR_BG_GM: Record<string, string> = {
  blue: "bg-blue-400",
  green: "bg-green-400",
  red: "bg-red-400",
  cyan: "bg-cyan-400",
};
const BAR_BG_GM_ELSE = "bg-gray-400";

// Session-90 (L-90c4, the zv twin): the ACCOUNTS map — blue/green/
// cyan/red with the PURPLE else (the reference's own map — Total
// Revenue's "purple" resolves through it).
const BAR_BG_ZV: Record<string, string> = {
  blue: "bg-blue-400",
  green: "bg-green-400",
  cyan: "bg-cyan-400",
  red: "bg-red-400",
};
const BAR_BG_ZV_ELSE = "bg-purple-400";

/**
 * Accounts / activities stat card — the gm (activities) + zv (accounts)
 * components FULLY decoded at s90 from the byte-stable reference bundle
 * + LIVE-probed on BOTH apps: `Card` (the stock ot, BARE) >
 * `CardContent` className="p-4" > [the label row (`flex justify-between
 * items-start mb-3` — the label span + the guarded trend row), the
 * value row (`flex items-end justify-between`)]. The ARM SPLIT is the
 * reference's own: gm wraps [the value DIV, the truthy-guarded
 * subValue DIV `text-xs text-gray-500 mt-1`] in a BARE div; zv renders
 * the value DIV directly (no wrapper — the two components genuinely
 * differ). The bar wrap: the guarded `h-10 w-20|w-24 flex items-end
 * gap-0.5` (height-first, no shrink-0, no aria-hidden); each bar a DIV
 * `flex-1 ${bg-CLASS} rounded-sm` (gm — rounded-sm AFTER the map) /
 * `flex-1 rounded-sm ${bg-CLASS}` (zv — rounded-sm BEFORE) with the
 * raw-percentage inline height (the s78 L-78c2 contract). The values
 * are BARE on BOTH apps (rgb(10,10,10) — the dashboard/activities/
 * accounts bare family; the explicit gray-900 is the leads/calendar/
 * reports arms' own). Session-90 (L-90c6): the trend row is the
 * DIRECTION-keyed DeltaBadgeText (the reference's own
 * trend/trendValue props — the delta/deltaIcon/deltaTone vocabulary
 * and the barColor/barWidth hex props retired with the color-KEY
 * mechanism). The reference's gm/zv also accept an `Icon` prop no
 * component body ever references (dead on both sides — unmirrored).
 */
export function BarStatCard({
  label,
  value,
  subValue,
  trend,
  trendValue,
  bars,
  color = "blue",
  arm = "activities",
}: {
  label: string;
  value: React.ReactNode;
  subValue?: React.ReactNode;
  /** The reference's trend: the DIRECTION string picking the row color
   *  AND the icon (falsy renders no row). */
  trend?: "up" | "down";
  trendValue?: React.ReactNode;
  bars: number[];
  /** The color KEY — the per-arm map resolves the bg-CLASS (defaults
   *  "blue", the reference's own color="blue"). */
  color?: string;
  /** gm (activities) wraps the value column; zv (accounts) renders the
   *  value direct — the reference's own per-component split. */
  arm?: "activities" | "accounts";
}) {
  const barBg =
    arm === "activities"
      ? BAR_BG_GM[color] ?? BAR_BG_GM_ELSE
      : BAR_BG_ZV[color] ?? BAR_BG_ZV_ELSE;
  // Session-78 (L-78c2): the reference's zv/gm stat cards render the RAW
  // chartData values as percentage heights (`style height ${o}%` — the
  // [50,60,55,70,65,75] arrays ARE the heights, max bar 75% of the h-10
  // container). The pct() normalization + the 12% floor + the opacity arm
  // were inventions, retired (both component defs bundle-decoded).
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          {/* Session-76 (L-76c1, bundle-decoded from gm): the label is the
              literal gray-600 — one step darker than the muted token. */}
          <span className="text-xs text-gray-600">{label}</span>
          {trend && (
            <DeltaBadgeText direction={trend}>{trendValue}</DeltaBadgeText>
          )}
        </div>
        <div className="flex items-end justify-between">
          {arm === "activities" ? (
            <div>
              <div className="text-2xl sm:text-3xl font-bold">{value}</div>
              {subValue && <div className="text-xs text-gray-500 mt-1">{subValue}</div>}
            </div>
          ) : (
            <div className="text-2xl sm:text-3xl font-bold">{value}</div>
          )}
          {bars && (
            <div className={`h-10 ${arm === "activities" ? "w-20" : "w-24"} flex items-end gap-0.5`}>
              {bars.map((v, i) => (
                <div
                  key={i}
                  className={arm === "activities" ? `flex-1 ${barBg} rounded-sm` : `flex-1 rounded-sm ${barBg}`}
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Contacts / leads stat card: label top-left, big value (plus optional
 * sub-value line on the LEADS arm) bottom-left, icon chip on the far
 * right — the reference layout. Two DOM-verified variants:
 * - `contacts` (default — session-88 L-88c5, bundle-decoded from the
 *   reference's Rx): Card (the stock component, gradient className) >
 *   CardContent "p-6" > the `flex items-start justify-between` row >
 *   [div.flex-1 (label p + value p + the trend row), the chip
 *   `p-3 rounded-lg ${iconColor}` — a CLASS string, no inline style];
 *   the trend row = `flex items-center gap-1` with the EXPLICIT-color
 *   TrendingUp|TrendingDown w-4 h-4 + the direction-colored span.
 * - `leads`: Session-89 (the Sm decode): the bare stock Card >
 *   CardContent "p-4 sm:p-6", header `flex items-center justify-between
 *   mb-2` with the icon-guarded width-first tinted chip DIV
 *   (`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center
 *   ${pair}`, chipTone defaulting "blue"), label `text-xs sm:text-sm
 *   text-gray-600`, value `text-xl sm:text-2xl font-bold text-gray-900`,
 *   the truthy-guarded gray-500 mt-1 subValue, and the dead number-trend
 *   row (sign-colored, Math.abs + "%").
 */
export function IconStatCard({
  label,
  value,
  subValue,
  trend,
  trendDir = "up",
  icon,
  gradient = false,
  variant = "contacts",
  iconColor,
  chipTone = "blue",
}: {
  label: string;
  value: React.ReactNode;
  /** Leads-arm-only sub-value line under the value. */
  subValue?: React.ReactNode;
  /** Optional trend row under the value. The CONTACTS arm consumes the
   *  node form (the reference's Rx trendValue). The LEADS arm consumes
   *  the NUMBER form (Session-89, the reference's Sm trend — a signed
   *  percent; dead in the reference: no Sm call site passes it). */
  trend?: React.ReactNode | number;
  /** Session-88 (L-88c5): the trend row's DIRECTION — the reference's
   *  trend prop ("up" green TrendingUp / "down" red TrendingDown). */
  trendDir?: "up" | "down";
  icon: React.ReactNode;
  gradient?: boolean;
  /** "contacts" (Card/gradient/p6/text-3xl) or "leads" (p4-sm:p6/text-xl-2xl). */
  variant?: "contacts" | "leads";
  /** Session-88 (L-88c5): the chip's CLASS string ("bg-blue-500" …) — the
   *  reference's iconColor prop; replaces the retired inline-style chip. */
  iconColor?: string;
  /** Session-77 (L-77c6): the leads arm's chip KEY — the reference's Sm
   *  class-pair map (STAT_CHIP_PAIRS); replaces the style-tint chip.
   *  Session-89 (L-89c3): defaults "blue" — the reference's own
   *  color="blue" default. */
  chipTone?: keyof typeof STAT_CHIP_PAIRS;
}) {
  if (variant === "leads") {
    return (
      // Session-89 (L-89c2/c3 + M-89c1 + N-89c5/c7, bundle-decoded from
      // the reference's Sm + LIVE-probed on BOTH apps at 1440 AND 390):
      // the bare stock Card > CardContent "p-4 sm:p-6" split (the
      // merged-padding div retires — the L-87c3/L-88c5 genus, this was
      // the last stat-card arm standing); the chip is the icon-guarded
      // width-first DIV consuming STAT_CHIP_PAIRS (chipTone defaults
      // "blue" — the reference's color default); the value carries the
      // EXPLICIT text-gray-900 (LIVE rgb(17,24,39) on the reference —
      // our inherited form computed the page ink rgb(10,10,10); the
      // dashboard KPI values stay bare, both apps rgb(10,10,10)); the
      // subValue guard is the reference's truthy form; and the number
      // trend row is the Sm's own dead mechanism (no reference call
      // site passes trend — the sign picks BOTH the row color and the
      // icon direction, the value renders Math.abs with a "%" suffix).
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-600">{label}</span>
            {icon && (
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${STAT_CHIP_PAIRS[chipTone]}`}>
                {icon}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-gray-900">{value}</span>
            {subValue && (<span className="text-xs sm:text-sm text-gray-500 mt-1">{subValue}</span>)}
            {typeof trend === "number" && (
              <div className={`flex items-center gap-1 mt-2 text-xs ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  // Session-88 (L-88c5, bundle-decoded from the reference's Rx): the
  // card splits Card > CardContent "p-6" > the row — the padding never
  // merges into the card div (the L-87c3 KpiCard genus); the chip is
  // `p-3 rounded-lg ${iconColor}` — a Tailwind bg-CLASS mechanism, no
  // inline style, no shrink-0, no aria-hidden; the trend row is a DIV
  // with the explicit-color icon + the direction-colored span; the
  // subValue stays leads-only (the reference's Rx has no sub-value).
  return (
    <Card className={gradient ? "bg-gradient-to-br from-white to-gray-50" : undefined}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1">
                {trendDir === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${trendDir === "up" ? "text-green-600" : "text-red-600"}`}>
                  {trend}
                </span>
              </div>
            )}
          </div>
          {icon && <div className={`p-3 rounded-lg ${iconColor}`}>{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

// Session-90 (L-90c5, bundle-decoded from the reference's ay): the
// reports chip pair map — the same -50/-600 pair mechanism as the
// calendar Mx, two keys wider (red/cyan — the reference's own map).
const REPORT_CHIP: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600" },
  red: { bg: "bg-red-50", text: "text-red-600" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-600" },
};

/**
 * Reports stat card — the ay component FULLY decoded at s90 from the
 * byte-stable reference bundle + LIVE-probed on BOTH apps: `Card`
 * className="border border-gray-200 hover:shadow-md
 * transition-shadow" (our border-line-strong token — computed-equal,
 * the one stat family with the hover treatment) >
 * `CardContent` className="p-5" > [the top row (`flex items-start
 * justify-between mb-3` > the `flex items-center gap-3` group > [the
 * chip DIV `w-10 h-10 rounded-lg ${bg-50} flex items-center
 * justify-center` with the icon rendered DIRECTLY carrying `w-5 h-5
 * ${text-600}` (the component-reference mechanism — the SPAN chip,
 * the inline bg style, the shrink-0/aria-hidden extras and the
 * hex-keyed chip-color maps all retire), the BARE div >
 * (the label DIV `text-xs text-gray-500 mb-1`, the value DIV
 * `text-2xl font-bold text-gray-900` — M-90c2: the EXPLICIT gray-900
 * LIVE rgb(17,24,39), the s74 comment's own citation finally landed;
 * the min-w-0 wrapper retires)]), the bottom row (`flex items-end
 * justify-between mt-2` > the guarded spark slot `flex-1 h-12 mr-2`
 * (children), the delta column `flex flex-col items-end` > the DEAD
 * trend row — the ay form uniquely carries font-medium, no call site
 * passes trend (the N-89c5 genus) — + the truthy-guarded subtitle
 * `text-xs text-gray-500 mt-1`)].
 */
export function CircleStatCard({
  label,
  value,
  subValue,
  trend,
  trendValue,
  icon,
  color = "blue",
  children,
}: {
  label: string;
  value: React.ReactNode;
  /** The reference's subtitle — the bottom-right delta column's
   *  `text-xs text-gray-500 mt-1` (Lost Deals' $XK). */
  subValue?: React.ReactNode;
  /** The reference's trend: the DIRECTION string — DEAD on the
   *  reference (no ay call site passes it); the row uniquely carries
   *  font-medium. */
  trend?: "up" | "down";
  trendValue?: React.ReactNode;
  /** The icon COMPONENT reference — the component applies the
   *  `w-5 h-5 ${pair.text}` classes itself (the ay mechanism). */
  icon: React.ComponentType<{ className?: string }>;
  /** The color KEY — REPORT_CHIP resolves the -50/-600 pair (defaults
   *  "blue", the reference's own color="blue"). */
  color?: string;
  children?: React.ReactNode;
}) {
  const pair = REPORT_CHIP[color];
  const Icon = icon;
  return (
    <Card className="border border-line-strong hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${pair.bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${pair.text}`} />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">{label}</div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
            </div>
          </div>
        </div>
        <div className={KPI_SPARK.reportsWrapper}>
          {children && <div className={KPI_SPARK.reportsSlot}>{children}</div>}
          {/* Session-27 (S27-P5): the reference's `ay` card renders the
              subtitle (Lost Deals' $XK) in the bottom-right delta column —
              text-xs text-gray-500 mt-1 — NOT inline with the value. */}
          <div className="flex flex-col items-end">
            {trend && (
              <div
                className={`flex items-center gap-1 text-xs font-medium ${trend === "down" ? "text-red-600" : "text-green-600"}`}
              >
                {trend === "down" ? (
                  <TrendingDown className="w-3 h-3" />
                ) : (
                  <TrendingUp className="w-3 h-3" />
                )}
                <span>{trendValue}</span>
              </div>
            )}
            {subValue && <div className="text-xs text-gray-500 mt-1">{subValue}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
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

// Session-90 (L-90c5, bundle-decoded from the reference's Mx): the
// calendar chip pair map — the color KEY resolving to the {bg: -50,
// text: -600} pair (the reference's own map also carries a `chart`
// member no call site exercises — dead, unmirrored).
const TREND_CHIP: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600" },
};

/**
 * Calendar stat card — the Mx component FULLY decoded at s90 from the
 * byte-stable reference bundle + LIVE-probed on BOTH apps: `Card` (the
 * stock ot, BARE) > `CardContent` className="p-4" > [the top row
 * (`flex items-start justify-between mb-3` — the chip DIV `w-10 h-10
 * rounded-lg ${bg-50} flex items-center justify-center` with the ICON
 * RENDERED DIRECTLY carrying `w-5 h-5 ${text-600}` applied BY the
 * component [the icon arrives as a component reference, the color a
 * KEY — the nested chipIcon span retires], the guarded trend row),
 * the value DIV `text-2xl font-bold text-gray-900` (M-90c1: the
 * EXPLICIT gray-900 — LIVE rgb(17,24,39) on the reference where our
 * bare form computed the page ink rgb(10,10,10); the F-70a1 s70 pin's
 * own comment cited the gray-900 then shipped the bare form on the
 * FALSE "inherited card foreground" premise), the label DIV
 * `text-xs text-gray-600 mt-1`]. The trend row: the direction-keyed
 * DeltaBadgeText (up/down + the w-3 h-3 glyph + the bare span).
 */
export function TrendStatCard({
  label,
  value,
  trend,
  trendValue,
  icon,
  color = "blue",
}: {
  label: string;
  value: React.ReactNode;
  /** The reference's trend: the DIRECTION string (falsy renders no
   *  row); trendValue is the row's TEXT. */
  trend?: "up" | "down";
  trendValue?: React.ReactNode;
  /** The icon COMPONENT reference — the component applies the
   *  `w-5 h-5 ${pair.text}` classes itself (the Mx mechanism). */
  icon: React.ComponentType<{ className?: string }>;
  /** The color KEY — TREND_CHIP resolves the -50/-600 pair (defaults
   *  "blue", the reference's own color="blue"). */
  color?: string;
}) {
  const pair = TREND_CHIP[color];
  const Icon = icon;
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg ${pair.bg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${pair.text}`} />
          </div>
          {trend && <DeltaBadgeText direction={trend}>{trendValue}</DeltaBadgeText>}
        </div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-600 mt-1">{label}</div>
      </CardContent>
    </Card>
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
  barClassName,
  variant = "bars",
}: {
  values: number[];
  /** The line/area stroke/fill hex (the bars arm carries its color via
   *  barClassName/colorFor — the reference's own split). */
  color?: string;
  /** Per-bar override (the Sales Target amber/blue split). */
  colorFor?: (value: number, index: number) => string;
  /** Session-87 (L-87c2): the STATIC bar colors ride Tailwind bg-classes
   *  (the reference's `flex-1 bg-cyan-400 rounded-sm` /
   *  `flex-1 bg-green-400 rounded-sm` constructions) — only the colorFor
   *  variant carries the inline backgroundColor. */
  barClassName?: string;
  variant?: "bars" | "line" | "area";
}) {
  // Session-78 (M-78c1): the reference's bar sparks render the RAW static
  // values as percentage heights (`style height ${v}%` — LIVE-probed on
  // the reference: 40%..75% on the 32px container, the max bar tops at
  // 75%, NOT 100%). The v/max normalization + the 8% floor + the opacity
  // treatment were inventions, retired. The N-66j empty guard stays (the
  // line/area arms above it are the recharts surfaces).
  if (values.length === 0) return null;

  // Session-87 (L-87c2, bundle-decoded): the reference renders ONE slot
  // div per card (`mt-2 h-8` / `mt-2 h-8 flex items-end gap-1`) with the
  // CHART as the direct child — the line/area ResponsiveContainer sits
  // BARE inside the card's slot (no intermediate wrapper, no aria-hidden,
  // no margin prop: the recharts default IS the 5px margin the reference
  // inherits by passing none).
  if (variant === "line" || variant === "area") {
    const data = values.map((v, i) => ({ i, v }));
    return (
      <ResponsiveContainer width="100%" height="100%">
        {variant === "area" ? (
          <AreaChart data={data}>
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={1}
              fill={color}
              fillOpacity={0.3}
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    );
  }

  // The bars arm renders the BARE bar divs (the card's slot provides the
  // `mt-2 h-8 flex items-end gap-1` container): `div.flex-1
  // bg-{color}-400 rounded-sm` + the raw-percentage inline heights for the
  // static cards; the colorFor variant carries the inline backgroundColor.
  return (
    <>
      {values.map((v, i) => (
        <div
          key={i}
          className={barClassName ? `flex-1 ${barClassName} rounded-sm` : "flex-1 rounded-sm"}
          style={colorFor ? { height: `${v}%`, backgroundColor: colorFor(v, i) } : { height: `${v}%` }}
        />
      ))}
    </>
  );
}
