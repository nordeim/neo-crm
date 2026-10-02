/**
 * Layout-system contracts — session-6 parity pins.
 *
 * Every string here was extracted from the LIVE reference app's DOM
 * (class-list extraction at 1512×945 + 390×844 on 2026-09-29). Pages
 * consume these records instead of hand-writing grid/header/rail classes so
 * the whole layout system has a single, test-pinned source of truth
 * (`tests/page-layout.test.ts`).
 *
 * Reference token mapping: gray-50 → `background`, white → `surface`,
 * gray-200 → `line`, gray-500 → `muted`, gray-900 → `foreground`.
 */

/** KPI stat-card row per page — the reference starts every grid at a single
 *  phone column and climbs the sm/lg ladder (never a 2-col phone base). */
export const PAGE_KPI_GRIDS = {
  dashboard: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6",
  accounts: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6",
  contacts: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6",
  leads: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6",
  calendar: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6",
  activities: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6",
  reports: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6",
} as const;

/** Page-header anatomy per page variant. The standard header stacks
 *  vertically on phones (`flex-col` → `sm:flex-row`); contacts is the flat
 *  variant (fixed `text-3xl` title, no stacking); leads adds `sm:mb-8`.
 *  Session-7: calendar + reports subtitles render at 14px on the reference
 *  (`text-gray-500 text-sm mt-1`) while every other page stays 16px —
 *  `subtitleSm` pins the small variant. */
export const PAGE_HEADER = {
  standard: {
    row: "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4",
    title: "text-2xl sm:text-3xl font-bold text-gray-900",
    subtitle: "text-muted mt-1",
    subtitleSm: "text-sm text-muted mt-1",
    actions: "flex gap-2 w-full sm:w-auto",
  },
  leads: {
    row: "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4",
    title: "text-2xl sm:text-3xl font-bold text-gray-900",
    subtitle: "text-muted mt-1",
    subtitleSm: "text-sm text-muted mt-1",
    // Session-9 (S9-5): the reference's leads actions STACK below sm
    // (flex-col sm:flex-row) and both buttons stretch full-width on
    // phones via `buttonStretch`.
    actions: "flex flex-col sm:flex-row gap-2 w-full sm:w-auto",
    buttonStretch: "w-full sm:w-auto",
  },
  contacts: {
    row: "flex items-center justify-between mb-6",
    title: "text-3xl font-bold text-gray-900",
    subtitle: "text-muted mt-1",
    subtitleSm: "text-sm text-muted mt-1",
    actions: "flex gap-3",
  },
  activities: {
    row: "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4",
    title: "text-2xl sm:text-3xl font-bold text-gray-900",
    subtitle: "text-muted mt-1",
    subtitleSm: "text-sm text-muted mt-1",
    // Session-9 (S9-6): the quick-log row WRAPS on the reference instead
    // of squeezing four buttons.
    actions: "flex flex-wrap gap-2 w-full sm:w-auto",
  },
  settings: {
    // Session-9 (S9-4): the settings page has no header buttons, so the
    // reference renders a PLAIN `mb-6` div with a non-responsive text-3xl
    // h1 (no sm: downshift like the other pages).
    row: "mb-6",
    title: "text-3xl font-bold text-gray-900",
    subtitle: "text-muted mt-1",
    subtitleSm: "text-sm text-muted mt-1",
    actions: "",
    noActionsWrap: true,
  },
} as const;

export type PageHeaderVariant = keyof typeof PAGE_HEADER;

/** Right-rail page scaffolding (accounts / calendar / activities): a flex
 *  row whose rail only exists from `lg` up — the reference hides phone
 *  filtering entirely (documented quirk; our mobile drawer covers nav).
 *  The content column carries `min-w-0` so wide tables inside
 *  `overflow-x-auto` cannot squeeze the w-80 rail (flexbox min-width:
 *  auto default). */
export const RAIL_LAYOUT = {
  row: "flex gap-6",
  rail: "hidden lg:block w-80",
  railStack: "hidden lg:block w-80 space-y-6",
  content: "flex-1 min-w-0",
  contentStack: "flex-1 min-w-0 space-y-6",
} as const;

/** The reference's white entity-table card: `rounded-lg shadow` with NO
 *  border, an inner `p-4 border-b` toolbar and an `overflow-x-auto` body. */
export const TABLE_CARD = {
  card: "bg-surface rounded-lg shadow",
  toolbar: "p-4 border-b",
  toolbarRow: "flex flex-col sm:flex-row gap-3",
  scrollArea: "overflow-x-auto",
} as const;

/** Dashboard filter bar — a white card (not a bare row) that stacks its
 *  controls on phones. */
export const FILTER_BAR = {
  card: "bg-surface rounded-lg shadow mb-6 p-4",
  row: "flex flex-col sm:flex-row gap-3",
  searchWrap: "relative flex-1",
  /** Session-33 (S33-P1): the reference's filter-bar search input —
   *  bundle-decoded as c.jsx(Ct,{placeholder:"Stage: Source"}) with NO
   *  value/onChange (the dead-input family of the s32 topbar decode).
   *  Ours stays functional (the documented superset); the placeholder
   *  rides the contract so the decode is pinned + testable. */
  searchPlaceholder: "Stage: Source",
} as const;

/** Reports filter bar — sticky inside the scrolling main, bordered with a
 *  stronger shadow than everything else on the page. Session-7 re-pin: the
 *  bar buttons dropped to h-8 and the reference RE-ADDED the Reset button
 *  (it was absent during the session-6 audit); every button carries an
 *  `mr-2` leading icon, and the first two selects (period / owner) wrap in
 *  `flex items-center gap-2` rows with calendar / user leading icons. */
export const REPORTS_FILTER_BAR = {
  bar: "rounded-xl border border-line-strong bg-surface p-4 mb-6 sticky top-0 z-10 shadow-md",
  row: "flex flex-col lg:flex-row gap-4 items-center",
  selectsWrap: "flex flex-wrap gap-3 flex-1",
  selectWrap: "flex items-center gap-2",
  selectIcon: "h-4 w-4 text-muted",
  actions: "flex gap-2",
  barBtn: "h-8 rounded-md px-3 text-xs",
  barBtnIcon: "h-4 w-4 mr-2",
} as const;

/** Shared anatomy of the w-80 filter rails (accounts / calendar /
 *  activities). The reference nests a `flex justify-between items-center`
 *  row INSIDE the stock CardHeader (`flex flex-col space-y-1.5 p-6 pb-3`)
 *  — passing the row class directly to CardHeader would keep the column
 *  direction (cn merge does not reset flex-col), so the row is a child
 *  element. Rail titles are fixed 16px (`sm:text-base` override — they
 *  never climb to the sm:text-lg of regular card titles). Checkbox-group
 *  labels carry `mb-3`, select-group labels `mb-2`; groups are plain divs
 *  (no grid gap wrappers). Calendar's action is a blue text link
 *  (Clear All); accounts/activities use a ghost h-8 "Save All" button. */
export const FILTER_RAIL = {
  headerPad: "p-6 pb-3",
  headerRow: "flex justify-between items-center",
  // Session-13 (S13-P6): literal cleanup — the reference's filter titles
  // are `text-base` (16px, no sm: step); the calendar title row adds the
  // flex classes for its Clear All action.
  title: "text-base",
  titleWithAction: "text-base flex items-center justify-between",
  clearAllLink: "text-xs text-blue-600 hover:text-blue-700 font-normal",
  body: "p-6 pt-0 space-y-4",
  groupLabel: "text-sm font-semibold mb-3 block",
  groupLabelSelect: "text-sm font-semibold mb-2 block",
  checkboxStack: "space-y-2",
  filterButtonWrap: "pt-2",
} as const;

/** Session-17 (S17-P3): the STOCK checkbox anatomy — every reference
 *  filter rail (accounts 4 tiers / calendar 10 types+dates / activities
 *  4 Activity-Type + the by-type footer) ships the Radix button checkbox:
 *  `<button type="button" role="checkbox" aria-checked data-state
 *  value="on">` with a Check h-4 w-4 indicator that mounts ONLY when
 *  checked. The reference's `border-primary` / `data-[state=checked]:
 *  bg-primary` compute #171717 — the platform's DARK stock primary, not
 *  the app blue (same family as DIALOG_SUBMIT) — so the computed-equal
 *  expression is neutral-900 / neutral-50. The shadow is the BARE scale
 *  (computed rgba(0,0,0,.1) 0 1px 3px 0 … on the reference). Ours shipped
 *  native inputs with appearance-none styling — no check glyph ever
 *  rendered and the checked fill was the app blue. */
export const CHECKBOX = {
  control:
    "peer h-4 w-4 shrink-0 rounded-sm border border-neutral-900 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-neutral-900 data-[state=checked]:text-neutral-50",
  indicator: "flex items-center justify-center text-current",
  row: "flex items-center space-x-2",
  label: "text-sm cursor-pointer",
} as const;

/** Session-7: app-chrome contracts — shell, sidebar nav, topbar and the
 *  login card, all extracted from the live reference DOM on 2026-09-29.
 *  Token mapping stays: gray-50 → background, white → surface,
 *  gray-200 → line, gray-400/500 → subtle/muted, gray-600/700/900 use the
 *  literal Tailwind palette (not in our token set). */

/** App shell — the reference keeps the window from scrolling entirely:
 *  a `flex h-screen` row holds the sidebar as an IN-FLOW flex child
 *  (visible from `md`, not `lg`) and a `flex-1 … overflow-hidden` main
 *  column whose `main` is the only scroller. */
export const SHELL_LAYOUT = {
  root: "flex h-screen bg-background",
  sidebar: "hidden md:flex w-64 bg-sidebar text-white flex-col",
  mainColumn: "flex-1 flex flex-col overflow-hidden",
  main: "flex-1 overflow-auto bg-background",
} as const;

/** S16-P2: the page-ROOT model — every page owns its padding (the
 *  reference renders NO shell-level wrapper; its page roots carry the
 *  classes directly). Six pages ship the bg + min-height variant
 *  (dashboard, accounts, calendar, activities, reports, settings);
 *  Leads + Profile drop both (the reference's own quirk — main's
 *  bg-background fills the gap); Contacts ships the full-height
 *  layout instead (CONTACTS_LAYOUT.fullHeight IS its root, padding
 *  inside the p-8 scroller). bg-background (#f9fafb) computes equal
 *  to the reference's literal bg-gray-50 (canvas pixel-verified — no
 *  literal-palette drift for gray-50 under v4). */
export const PAGE_ROOT = {
  standard: "p-4 sm:p-8 bg-background min-h-screen",
  bare: "p-4 sm:p-8",
} as const;

/** Sidebar navigation — brand mark, nav links and the bottom-pinned footer
 *  group. Icons are uniform `h-5 w-5` stroke-2 (no active/inactive stroke
 *  variation on the reference). */
export const NAV_LAYOUT = {
  brand: "p-6 flex items-center gap-3",
  brandLogoOuter: "w-10 h-10 bg-white rounded-full flex items-center justify-center",
  brandLogoInner: "w-6 h-6 bg-sidebar rounded-full",
  brandWordmark: "text-2xl font-bold",
  container: "flex-1 px-3 space-y-1 flex flex-col",
  group: "space-y-1",
  link: "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-white/5",
  linkActive: "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-white/10",
  icon: "h-5 w-5",
  label: "font-medium",
  footerGroup: "mt-auto space-y-1 pt-4 border-t border-white/10",
} as const;

/** Topbar — a STATIC `py-4` header (it never scrolls because `main` owns
 *  scrolling). The global search is hidden below `sm` on the reference;
  ours keeps the functional results dropdown + aria-label (e2e-pinned). */
export const TOPBAR_LAYOUT = {
  header: "bg-surface border-b border-line px-4 sm:px-8 py-4",
  inner: "flex items-center justify-between gap-4",
  searchBlock: "hidden sm:flex flex-1 max-w-xl",
  searchWrap: "relative w-full",
  searchIcon: "h-5 w-5 text-subtle",
  // Session-9 (S9-16): the reference's topbar search focuses with a 1px
  // near-black ring (focus:ring-1 focus:ring-ring).
  // Session-10 (S10-3): the search pill is now the shared (stock) Input
  // component + SEARCH_INPUT.extras (pl-10 bg-gray-50 border-gray-200) —
  // exactly the reference's construction. The stock base carries the 12px
  // right padding (px-3), the ink/placeholder tokens and the keyboard-only
  // focus-visible ring. The old custom string (pr-4 16px, focus: on click,
  // text-foreground) is retired.
  searchInput: "use shared Input + SEARCH_INPUT.extras",
  // Session-11 (S11-P10): the reference's mail/bell buttons are
  // `hidden … sm:flex` (computed display: flex) — ours shipped
  // sm:inline-flex, visually identical on fixed-size buttons but a
  // computed diff; aligned.
  iconButton:
    "hidden h-9 w-9 rounded-md text-muted transition-colors hover:bg-line-soft hover:text-foreground sm:flex",
  iconClass: "h-5 w-5",
  rightGroup: "flex items-center gap-2 sm:gap-4",
  // Session-17 (S17-P1): the reference's trigger is the STOCK ghost Button
  // — `…whitespace-nowrap rounded-md text-sm font-medium …
  // focus-visible:ring-1 focus-visible:ring-ring … hover:bg-accent
  // hover:text-accent-foreground h-9 px-4 py-2` + `flex items-center gap-1
  // sm:gap-2` (tailwind-merge replaces inline-flex/gap-2). The trigger now
  // renders via <Button variant="ghost">; this className only supplies the
  // flex/gap composition and neutralizes the iconGap's trailing-chevron
  // margin (the reference's chevron carries NO mr-2 — its spacing is the
  // flex gap alone).
  userButton: "flex items-center gap-1 sm:gap-2 [&_svg]:mr-0",
  userLabel: "hidden text-sm font-medium text-gray-700 sm:inline",
  // Session-17 (S17-P1): the reference ships the STOCK two-level Avatar —
  // a root span in the stock Avatar shape (w-8 h-8) wrapping a fallback
  // div in the stock AvatarFallback shape with the gray-200/gray-600
  // literals. Ours was a ONE-level hand-written span.
  userAvatarRoot: "relative flex shrink-0 overflow-hidden rounded-full w-8 h-8",
  userAvatarFallback:
    "w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm",
  userChevron: "h-4 w-4 text-muted",
  userMenu: "min-w-[8rem]",
} as const;

/** Login card — the reference's slate design: borderless glass card with a
 *  gradient accent strip, centered logo/title, white Google button and
 *  `h-11 sm:h-12` slate inputs. The logo is a CSS brand mark (the reference
 *  hotlinks a screenshot; we keep the same white-circle/blue-dot shape). */
export const LOGIN_LAYOUT = {
  page: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4",
  card: "relative overflow-hidden rounded-2xl border-0 bg-white/95 shadow-2xl backdrop-blur-sm",
  accent: "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200",
  inner: "p-8 sm:p-10 md:pt-12 md:pb-10 md:px-10",
  centered: "flex flex-col items-center text-center space-y-6 sm:space-y-8",
  logoWrap: "relative group",
  logoGlow:
    "absolute inset-0 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 opacity-30 blur-xl transition-opacity duration-300 group-hover:opacity-40",
  logo: "relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg ring-4 ring-white/50 transition-all duration-300 group-hover:shadow-xl sm:h-24 sm:w-24",
  title: "text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight",
  subtitle: "text-slate-500 text-sm sm:text-base font-medium",
  google:
    "flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-medium text-slate-700 text-[16px] transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm",
  googleIcon: "-ml-4 transition-transform duration-200",
  divider: "relative my-6",
  dividerLine: "shrink-0 h-[1px] w-full bg-slate-200",
  dividerLabel: "relative flex justify-center text-xs uppercase",
  dividerLabelSpan: "bg-white px-3 font-medium tracking-wider text-slate-500",
  form: "w-full space-y-4 sm:space-y-5",
  fields: "space-y-3 sm:space-y-4",
  field: "space-y-1.5",
  label: "text-sm font-medium text-slate-700",
  inputWrap: "relative",
  inputIcon: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500",
  input:
    "h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 text-slate-900 placeholder:text-slate-600 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/30 sm:h-12",
  submit:
    "flex h-11 w-full items-center justify-center gap-1 rounded-xl bg-slate-900 font-medium text-white shadow-sm transition-all duration-200 hover:bg-slate-800 sm:h-12",
  footer: "flex flex-col items-center justify-between gap-2 sm:flex-row sm:gap-0",
  footerLink: "text-sm text-slate-500 transition-colors hover:text-slate-700",
  footerLinkStrong: "font-medium text-slate-700",
} as const;

/** TrendStatCard (calendar KPI cards) — session-7 re-pin: p-4 body, mb-3
 *  top row, 40px `-50` tinted chips with `h-5 w-5` icons, `text-green-600`
 *  trend with a `w-3 h-3` trending-up glyph, label under the value.
 *  Session-12: reportsCard pins the REPORTS KPI family (CircleStatCard)
 *  — the one stat family that still carries the explicit gray-200 border
 *  (--color-line-strong) + hover after the reference's dashboard KPI
 *  cards dropped theirs. */
export const STAT_CARD = {
  card: "rounded-xl border border-line bg-surface shadow",
  reportsCard: "rounded-xl border border-line-strong bg-surface p-5 shadow transition-shadow hover:shadow-md",
  body: "p-4",
  topRow: "flex items-start justify-between mb-3",
  chip: "w-10 h-10 rounded-lg flex items-center justify-center",
  chipIcon: "h-5 w-5",
  trend: "flex items-center gap-1 text-xs text-green-600",
  trendIcon: "h-3 w-3",
  value: "text-2xl font-bold text-foreground",
  label: "text-xs text-muted mt-1",
} as const;

/** Activities card headers — both cards title with `h2 text-lg
 *  font-semibold`; the Timeline action is a ghost h-8 button with the
 *  literal "•••" TEXT (not an SVG glyph — the reference renders three
 *  middot characters). */
export const ACTIVITY_CARD = {
  title: "text-lg font-semibold text-foreground",
  priorityRow: "flex items-center justify-between mb-4",
  timelineRow: "flex items-center justify-between mb-6",
  dotsLabel: "•••",
  emptyTimeline: "text-center py-12 text-muted",
  emptyPanel: "text-center py-8 text-muted",
} as const;

/** Dashboard card-header buttons — the Add buttons (Lead Sources /
 *  Upcoming Activities) are ghost h-8 with BLUE text and an `mr-1` plus
 *  glyph; the ellipsis actions are ghost `h-8 w-8`. */
export const DASHBOARD_CARD = {
  addBtn: "h-8 px-3 text-xs text-primary",
  addIcon: "h-4 w-4 mr-1",
  ellipsisBtn: "h-8 w-8",
} as const;

/** Settings picklist cards — items stack `space-y-2 mb-4`, the empty state
 *  is a plain `text-sm text-center py-4` paragraph (no dashed box), and the
 *  add action is an h-9 icon-only Plus button. Session-8 re-pin: the
 *  reference's `bg-primary` resolves to the STOCK shadcn zinc-950
 *  (computed rgb(23,23,23)) — a dark neutral button, not the app's blue
 *  (same family as the profile Save Changes button). The reference's
 *  "Add new industrie" placeholder typo is mirrored (like "Conversion
 *  Funnel"). */
export const SETTINGS_PICKLIST = {
  items: "space-y-2 mb-4",
  empty: "text-sm text-muted text-center py-4",
  addRow: "flex gap-2",
  addButton: "bg-neutral-900 text-neutral-50 hover:bg-neutral-800 shadow h-9 px-4 py-2",
  industriesPlaceholder: "Add new industrie",
} as const;

/** Session-14 (S14-P1): the settings DEFAULTS tab. The reference's
 *  "Default Values" card is a SINGLE-COLUMN stack at every width — body
 *  `p-6 pt-0 space-y-4` (16px between groups, computed), six groups each
 *  `space-y-2` (12px computed label→control gap) — with the STOCK
 *  CardTitle and the stock CardDescription subtitle `text-sm
 *  text-muted-foreground` (14px / #737373). Ours shipped a responsive
 *  3-column grid (sm:grid-cols-2 lg:grid-cols-3), `grid gap-1.5` groups
 *  (6px), the settings text-lg title override and a `text-xs text-muted`
 *  subtitle (12px / #6b7280 — both size and color wrong). */
export const SETTINGS_DEFAULTS = {
  body: "p-6 pt-0 space-y-4",
  group: "space-y-2",
  /** Session-14: the v4 space-y flip NO-OPS on inline labels. The
   *  reference's v3-era `space-y-2 > * + *` lands margin-TOP 8px on the
   *  block-level control (computed inputMT 8px, rect gap 12px); our v4
   *  `:where(& > :not(:last-child))` lands margin-BOTTOM on the INLINE
   *  label — and vertical margins on inline elements do not apply, so
   *  the gap collapsed to ~3px. The explicit mt-2 on every control
   *  restores the reference's computed geometry (same re-derive-from-
   *  computed-gap rule as the s11 -mb-2 hazard). */
  controlMt: "mt-2",
  cardTitle: "font-semibold leading-none tracking-tight",
  subtitle: "text-sm text-muted-ink",
} as const;

/** Session-14 (S14-P2): the settings DATA tab. The template card is
 *  titled "Import Templates" (the reference carries the 'Import '
 *  prefix); both list bodies are VERTICAL `p-6 pt-0 space-y-2` stacks of
 *  stock outline default-size buttons (`w-full sm:w-auto`, download icon
 *  w-4 h-4 — the mr-2 gap rides BUTTON_BASE.iconGap). Ours shipped
 *  "Templates", `flex flex-wrap gap-2` bodies and secondary/sm buttons
 *  (h-8 px-3 text-xs, icon h-3.5, no responsive width). */
export const SETTINGS_DATA = {
  importTitle: "Import Templates",
  listBody: "p-6 pt-0 space-y-2",
  cardTitle: "font-semibold leading-none tracking-tight",
  buttonCls: "w-full sm:w-auto",
  /** Session-26 (S26-P1): the reference's 2nd+ button margin — live-computed
   *  marginLeft 8px at 1280px on buttons 2-3 of the template row and 2-4 of
   *  the export row (`ml-0` resets the mobile stack, `sm:ml-2` spaces the
   *  inline row). A class-level pin that recorded only the FIRST button of
   *  a row misses the family (the s24 More... lesson). */
  buttonClsAlt: "w-full sm:w-auto ml-0 sm:ml-2",
  buttonIcon: "h-4 w-4",
  /** Session-26 (S26-P1): the header subtitle — the reference's
   *  CardDescription is a `text-sm text-muted-foreground` DIV (#737373);
   *  our muted-ink token is that exact color. */
  desc: "text-sm text-muted-ink",
} as const;

/** Session-14 (S14-P3): the Danger Zone card — the reference's TINTED
 *  warning surface. Card `rounded-xl border … border-red-200 bg-red-50`
 *  (computed border #fecdd3; ours had the border but not the bg); title
 *  the STOCK string + `text-red-700 flex items-center gap-2` with a
 *  circle-alert icon `w-5 h-5` (ours: text-lg text-danger = #ef4444, the
 *  wrong red, no icon); body `p-6 pt-0 space-y-4` holding ONLY the
 *  `space-y-2` input group (label 'Type "RESET" to confirm', input
 *  `max-w-xs` placeholder RESET) and the destructive button BELOW it —
 *  no warning paragraph (ours shipped extra copy + a flex-row pair). The
 *  reset foreground is #fafafa (neutral-50), not pure white. */
export const SETTINGS_DANGER = {
  card: "rounded-xl border text-card-foreground shadow border-red-200 bg-red-50",
  title: "font-semibold leading-none tracking-tight text-red-700 flex items-center gap-2",
  titleIcon: "h-5 w-5",
  body: "p-6 pt-0 space-y-4",
  group: "space-y-2",
  /** Same v4 inline-label fix as SETTINGS_DEFAULTS.controlMt — the
   *  reference's confirm input computes margin-top 8px (v3 space-y
   *  semantics); ours needs the explicit mt-2. */
  controlMt: "mt-2",
  label: 'Type "RESET" to confirm',
  inputCls: "max-w-xs",
  resetFg: "text-neutral-50",
  /** Session-26 (S26-P1): the Danger Zone header subtitle — the reference
   *  ships it as a `text-red-600` DIV (live DOM probe; the s14 pin recorded
   *  the card chrome + "no warning paragraph" from a different reference
   *  state — the live reference ships the paragraph today). */
  desc: "text-red-600",
} as const;

/** Session-8: mobile-nav drawer contracts. The auto-close media query MUST
 *  match the drawer's `md:hidden` range (768px) — session-7 moved the drawer
 *  from lg to md but left the listener at 1024px, so resizing from 700 to
 *  800px with the drawer open hid the drawer while body + main stayed
 *  scroll-locked (reproduced on the dev server; e2e regression pinned in
 *  tests/e2e/mobile-navigation.spec.ts). */
export const MOBILE_NAV_LAYOUT = {
  drawerRange: "md:hidden",
  autoCloseQuery: "(min-width: 768px)",
} as const;

/** Session-8: dashboard header — the primary Export button renders its
 *  label as a BARE text node (always visible), unlike the outline Export
 *  whose label hides below sm. `primaryExportLabelClass: ""` pins the
 *  absence of a hiding class. */
export const DASHBOARD_HEADER = {
  /** Session-33 (S33-P2): the reference's dashboard header ships THREE
   *  adjacent buttons — Add (outline), Export (outline), Export (the
   *  blue bg-blue-600 hover:bg-blue-700 primary) — and ALL THREE are
   *  DEAD there (the s33 bundle decode: no onClick on any; the §16c-era
   *  dead-list covered only the Exports + the login Sign up link). Ours
   *  keeps the exact visual with the documented functional superset
   *  jobs: quick-create menu / export menu / one-click leads export. */
  addLabel: "Add",
  addLabelClass: "hidden sm:inline",
  outlineExportLabel: "Export",
  outlineExportLabelClass: "hidden sm:inline",
  primaryExportLabel: "Export",
  /** S8-1: the primary Export renders its label as a BARE always-visible
   *  text node (not hidden below sm like the outline pair). */
  primaryExportLabelClass: "",
} as const;

/** Session-8: the reference's Table/Cards view-switcher select. Both live
 *  instances (dashboard filter-bar middle slot, accounts table toolbar)
 *  render with an EMPTY placeholder label and are DEAD — picking "Cards"
 *  changes nothing. Ours keeps the empty default label (mirror) and makes
 *  the switch real (functional superset). */
export const VIEW_SWITCHER = {
  trigger: "w-full sm:w-32",
  emptyLabel: "",
  options: ["Table", "Cards"] as const,
} as const;

/** Session-8: accounts table toolbar — the reference stacks
 *  [Table switcher][density switcher (Standard/Detailed, empty label, dead)]
 *  [More outline h-8 dead button] BEFORE the search, then Export CSV. */
export const TABLE_TOOLBAR = {
  row: "flex flex-col sm:flex-row gap-3",
  select: "w-full sm:w-32",
  densityOptions: ["Standard", "Detailed"] as const,
  moreBtn: "h-8 rounded-md px-3 text-xs",
} as const;

/** Session-8: leads search — identical anatomy to contacts (w-5 icon,
 *  pl-10 input); ours was one size small (h-4 + pl-9). */
export const LEADS_TOOLBAR = {
  searchIcon: "h-5 w-5",
  searchInput: "pl-10",
} as const;

/** Session-8: leads Filters popover (Radix Popover) — w-80 p-4 content,
 *  `text-sm font-medium mb-2 block` field labels, h-9 w-full controls
 *  (Status select, Source select, Min Deal Value number input,
 *  Follow-up Date date input) and a `flex gap-2 pt-2` footer with outline
 *  h-9 flex-1 Clear (X icon) + Save View (Save icon) buttons. The trigger
 *  carries a Filter icon and NO chevron. */
export const LEADS_FILTERS_POPOVER = {
  trigger: "h-9 w-full sm:w-auto",
  triggerIcon: "h-4 w-4 mr-2",
  content: "w-80 p-4",
  stack: "space-y-4",
  fieldLabel: "text-sm font-medium mb-2 block",
  select: "h-9 w-full",
  numberInput: "h-9 w-full",
  dateInput: "h-9 w-full",
  footer: "flex gap-2 pt-2",
  footerBtn: "flex-1 h-9 px-4 py-2",
  footerIcon: "h-4 w-4 mr-2",
  // Session-29 (S29-P3, bundle + live verified): the selects store RAW
  // values with explicit All items bound to the "all" sentinel.
  statusOptions: ["All Status", "New", "Contacted", "Qualified", "Won", "Lost"] as const,
  sourceOptions: ["All Sources", "Call", "Email", "Website", "Partner", "Referral"] as const,
  // The saved-views select (live-confirmed): appears once a view exists.
  savedViewsSelect: "w-full sm:w-48",
} as const;

/** Session-8: activities quick-log row — Log WhatsApp is a SOLID emerald
 *  button on the reference (bg-emerald-600 hover:bg-emerald-700 + shadow);
 *  the session-6 "ghost" pin is stale. The other three stay outline h-8. */
export const ACTIVITY_QUICKLOG = {
  whatsapp: "bg-emerald-600 hover:bg-emerald-700 text-white shadow",
} as const;

// ---------------------------------------------------------------------------
// Session-9 component-anatomy contracts (DOM-verified 2026-09-30 at
// 1512x945 against the live reference; see
// docs/plans/2026-09-30-session9-parity-remediation.md).
// ---------------------------------------------------------------------------

/** S9-1 + S9-16: the shared Button base. Reference text buttons carry
 *  `mr-2` ON their icons in addition to the flex `gap-2` — a measured 16px
 *  icon-text gap (ours was 8px). Icon-only buttons (mail/bell, ellipsis)
 *  carry NO margin on either side, hence the only-child guard. Focus rings
 *  are 1px near-black (`ring-1 ring-ring`, --color-ring = #0a0a0a), not
 *  the 2px translucent blue. */
export const BUTTON_BASE = {
  iconGap: "[&_svg]:mr-2 [&_svg:only-child]:mr-0",
  focusRing: "focus-visible:ring-1 focus-visible:ring-ring",
  // Session-13 (S13-P3): the reference is rounded-md (6px) on EVERY
  // button — page headers, dialogs, topbar icon buttons (computed sweep
  // across all 8 pages + profile). Ours shipped rounded-lg on the base
  // (visible on contacts/calendar/reports-saved/profile). The sm and
  // iconSm sizes already overrode to rounded-md, which is why most pages
  // matched.
  rounded: "rounded-md",
} as const;

/** S9-12 + S9-16, session-10 S10-2/S10-3: the stock Input base. The
 *  reference's stock Input is `text-base md:text-sm` (16px below md —
 *  phones), `bg-transparent` with NO text color class (typed text inherits
 *  its --foreground #0a0a0a — pinned as --color-ink / text-ink),
 *  `placeholder:text-muted-foreground` (#737373 — --color-muted-ink),
 *  `transition-colors`, and a keyboard-only focus-visible ring. Ours
 *  shipped bg-white + text-foreground #111827 + placeholder #9ca3af and
 *  the search fired its ring on click (focus:). */
export const INPUT_BASE = {
  size: "text-base md:text-sm",
  bg: "bg-transparent",
  ink: "text-ink",
  placeholder: "placeholder:text-muted-ink",
  transition: "transition-colors",
  focusRing: "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
} as const;

/** S10-2: the stock shadcn Select trigger (DOM-extracted from the live
 *  reference): rounded-md (6px — NOT our rounded-lg 8px), NO gap-2
 *  (justify-between only), bg-transparent, placeholder #737373, and NO
 *  base w-full — the reference adds w-full per-surface (270px rail
 *  selects yes / 128px toolbar + dead switchers no). */
export const SELECT_TRIGGER = {
  base: "flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-line bg-transparent px-3 py-2 text-sm text-ink shadow-sm transition-colors placeholder:text-muted-ink",
  placeholderState: "data-[placeholder]:text-muted-ink",
} as const;

/** S10-3: the topbar search pill = the shared (stock) Input + the
 *  reference's three extras. The stock `px-3 py-1` base leaves a 12px
 *  right padding (ours was pr-4 = 16px); focus is keyboard-only. */
export const SEARCH_INPUT = {
  extras: "pl-10 bg-gray-50 border-gray-200",
  usesStockInput: true,
} as const;

/** S10-10: per-page document titles. The reference titles every
 *  non-dashboard page "X | NEO CRM" (document.title probes, all 10
 *  routes); the dashboard and login stay "NEO CRM". */
export const PAGE_TITLES = {
  dashboard: "NEO CRM",
  accounts: "Accounts | NEO CRM",
  contacts: "Contacts | NEO CRM",
  leads: "Leads | NEO CRM",
  calendar: "Calendar | NEO CRM",
  activities: "Activities | NEO CRM",
  reports: "Reports | NEO CRM",
  settings: "Settings | NEO CRM",
  profile: "Profile | NEO CRM",
} as const;

/** S9-2: entity-dialog submit buttons are DARK on the reference — its
 *  `--primary` is the stock shadcn dark (computed rgb(23,23,23)) with
 *  `shadow` + `hover:bg-primary/90`. Same family as the session-8
 *  settings-add / profile-save treatment. Header primary buttons stay
 *  blue-600 (the app `--primary` token). */
export const DIALOG_SUBMIT = {
  button: "bg-neutral-900 text-neutral-50 hover:bg-neutral-800 shadow h-9 px-4 py-2",
} as const;

/** S9-3: card titles are DIVs on the reference (no heading semantics;
 *  activities' h2 titles and the profile name h3 are separately pinned).
 *  Color is inherited (foreground), not an explicit class. */
export const CARD = {
  // Session-13 (S13-P6): the reference's CardTitle is a PER-PAGE map —
  // reports (11) + profile (1) render the STOCK shadcn string (16px,
  // leading-none); dashboard (6) + leads (3) render text-base sm:text-lg;
  // the filter rails + the activities by-type card render text-base; the
  // settings cards render text-lg at ALL widths. The DEFAULT is now the
  // stock string and the bigger variants arrive via CARD_TITLE_OVERRIDE
  // at the call sites.
  title: "font-semibold leading-none tracking-tight",
} as const;

/** Session-13 (S13-P6): the reference's per-page CardTitle size
 *  overrides (class dumps on every page, 2026-09-30). */
export const CARD_TITLE_OVERRIDE = {
  /** dashboard (6 cards) + leads (3 cards) — 16px below sm, 18px above. */
  dashboard: "text-base sm:text-lg",
  /** accounts/activities/calendar filter rails + activities by-type — 16px. */
  filters: "text-base",
  /** settings (5 cards) — 18px at ALL widths (not sm-gated). */
  settings: "text-lg",
} as const;

/** Session-13 (S13-P9): the reference's KPI value — SPAN `text-2xl
 *  sm:text-3xl font-bold` INHERITING card-foreground #0a0a0a (line-height
 *  36px, letter-spacing normal). Ours added leading-none (30px) +
 *  tracking-tight (-0.75px) + text-foreground — real computed diffs. */
export const KPI_VALUE = "text-2xl sm:text-3xl font-bold";

/** Session-13 (S13-P9): the reference's stock DialogTitle —
 *  `text-lg font-semibold leading-none tracking-tight` (class dump on the
 *  New Account dialog), inheriting the #0a0a0a default. */
export const DIALOG_TITLE = "text-lg font-semibold leading-none tracking-tight";

/** Session-15 (S15-P1): the entity-dialog chrome is the STOCK shadcn
 *  geometry — outerHTML dumps of all five reference create dialogs
 *  (2026-09-30): `fixed left-[50%] top-[50%] z-50 grid w-full
 *  translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6
 *  shadow-lg … slide-* sm:rounded-lg max-w-lg`. Computed: 8px radius
 *  at >=sm and 0 below, FULL-BLEED 390px at phone widths (w-full, not
 *  calc(100vw-2rem)). Our scaffold shipped rounded-2xl (16px at all
 *  widths) + shadow-xl + a 2rem side inset — all retired. The slide-in/
 *  out animations (tw-animate) were missing entirely. Token spellings
 *  that compute equal stay ours: border (default line #e5e5e5) +
 *  bg-surface (white) == border bg-background. */
export const DIALOG_CONTENT = {
  base: "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-line bg-surface p-6 shadow-lg outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
  /** S15-P12/P13 → session-30 (S30-P6): the Event + Activity dialogs cap
   *  at 672px AND carry the reference's scroll-cap pair
   *  (max-h-[90vh] overflow-y-auto — the bundle's exact list; the
   *  reference's Edit-family + Log Activity + Save Custom Report all
   *  ship it). The Lead/Account CREATE dialogs stay cap-FREE (the
   *  reference's own inconsistency, mirrored). */
  wide: "max-w-2xl max-h-[90vh] overflow-y-auto",
} as const;

/** Session-15 (S15-P2): the reference's dialog overlay is the STOCK
 *  `bg-black/80` fade — NO backdrop blur (our scaffold shipped a
 *  gray-900/45 + blur(2px) wash). */
export const DIALOG_OVERLAY =
  "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0";

/** Session-15 (S15-P3): the reference's DialogHeader centers below sm —
 *  `flex flex-col space-y-1.5 text-center sm:text-left` (computed
 *  text-align center at 390). Ours shipped always-left + pr-6. */
export const DIALOG_HEADER = "flex flex-col space-y-1.5 text-center sm:text-left";

/** Session-15 (S15-P5): TWO footer families on the reference. The
 *  max-w-lg dialogs (Lead/Account/Contact) ship the STOCK
 *  `flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2` —
 *  computed column-reverse + gap normal (buttons TOUCH when stacked on
 *  phones; 8px margin between at sm). Ours shipped gap-2 (8px even
 *  stacked). */
export const DIALOG_FOOTER = "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2";

/** Session-15 (S15-P5): the max-w-2xl family (Event/Activity) ships
 *  `flex justify-end gap-3 pt-4` — row at ALL widths, 12px gap, 16px
 *  top padding. */
export const DIALOG_FOOTER_WIDE = "flex justify-end gap-3 pt-4";

/** Session-15 (S15-P6): the close X is the STOCK opacity pattern —
 *  `absolute right-4 top-4 rounded-sm opacity-70 transition-opacity
 *  hover:opacity-100 focus:ring-2 ring-offset-2` (no padding, no bg
 *  wash — ours shipped a rounded-md p-1 hover:bg pill). */
export const DIALOG_CLOSE =
  "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-70";

/** Session-15 (S15-P7): the max-w-lg family's field groups are the
 *  reference's `space-y-2` divs — computed 12px label->control gap /
 *  28px top-to-top (the SAME geometry as the s14 settings fix). Under
 *  v4 the literal space-y-2 collapses on the INLINE label (the s14
 *  hazard) — the established fix is the explicit mt-2 on the control
 *  (SETTINGS_DEFAULTS.controlMt precedent). */
export const DIALOG_GROUP = {
  group: "space-y-2",
  controlMt: "mt-2",
} as const;

/** Session-15 (S15-P12/P13): the max-w-2xl family's single fields +
 *  grid cells are BARE unclassed divs — label + control as direct
 *  children (computed 4px gap from the inline label's font metrics —
 *  no space-y, no mt; DOM-verified on the reference's Event/Activity
 *  dialogs). */
export const DIALOG_BARE_GROUP = "" as const;

/** Session-15 (S15-P8): the reference wraps all fields in a py-4 grid
 *  INSIDE the form (ours made the form itself the grid — no wrapper,
 *  no padding). Per-family shapes: Lead gap-4, Contact gap-6, Account
 *  2-col gap-4. */
export const DIALOG_FIELDS_WRAPPER = {
  lead: "grid gap-4 py-4",
  contact: "grid gap-6 py-4",
  account: "grid grid-cols-2 gap-4 py-4",
} as const;

/** Session-15 (S15-P9): the Lead dialog's Status + Source pair sits
 *  side-by-side in a 2-col grid (162px cells even at 390 — the grid is
 *  NOT sm-gated on the reference). */
export const LEAD_DIALOG = {
  statusSourceGrid: "grid grid-cols-2 gap-4",
} as const;

/** Session-15 (S15-P10): the Account dialog body is 2-column — pairs
 *  Name/Industry, Email/Phone, Website/Annual Revenue, Employees/
 *  Status (field order extracted from the live dump). */
export const ACCOUNT_DIALOG = {
  body: "grid grid-cols-2 gap-4 py-4",
} as const;

/** Session-15 (S15-P11) → session-30 (S30-P2): the Contact dialog ships
 *  the avatar section — a centered `flex flex-col items-center gap-4 pb-4
 *  border-b` block with the w-24 h-24 gradient circle (from-blue-500
 *  to-blue-700 + shadow-lg — the bundle's exact list), the photo/initials/
 *  User-glyph render (the real upload round-trip), the remove X (-top-1
 *  -right-1 w-7 h-7 bg-red-500 — inline in the dialog, photo-set only),
 *  the camera button (w-8 h-8 bg-white rounded-full shadow-md + the
 *  border-2 border-blue-500 ring, disabled while uploading) + the hidden
 *  file input, and the Name field INSIDE the section (the reference
 *  places it under the circle, w-full space-y-2, placeholder "John
 *  Doe", text-center font-medium). */
export const CONTACT_AVATAR = {
  section: "flex flex-col items-center gap-4 pb-4 border-b",
  wrapper: "relative",
  circle:
    "w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg",
  initials: "text-white font-bold text-3xl",
  camera:
    "absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors border-2 border-blue-500",
  cameraIcon: "w-4 h-4 text-blue-600",
  nameGroup: "w-full space-y-2",
  uploadingHint: "text-xs text-gray-500",
} as const;

/** Session-15 (S15-P11): the Contact body — `grid gap-6 py-4` with the
 *  avatar section, then space-y-4 pair groups (Email+Phone,
 *  Company+Position — 16px inside the pair vs 24px between groups),
 *  then the How-did-you-meet group. */
export const CONTACT_DIALOG = {
  body: "grid gap-6 py-4",
  pairGroup: "space-y-4",
} as const;

/** Session-15 (S15-P12): the Event dialog — max-w-2xl (672px), form
 *  `space-y-4`, BARE single fields (Title/Description/Location), two
 *  grid-cols-2 pairs (Type+Status, Start+End), Related To ALONE in a
 *  grid-cols-2 (second cell empty — a reference quirk mirrored), the
 *  pt-4 wide footer, and the ONE-OFF blue submit (the reference ships
 *  `bg-blue-600 hover:bg-blue-700` — its v3 palette = #2563eb/#1d4ed8,
 *  which is EXACTLY our --primary/--primary-hover token pair; a v4
 *  HAZARD: the literal bg-blue-600 class compiles to v4's oklch default
 *  (computes rgb(21,93,252) — a DIFFERENT blue than the reference's),
 *  so the computed-equal expression is the TOKEN pair, never the
 *  literal class). Every other dialog ships the dark stock primary. */
export const EVENT_DIALOG = {
  content: "max-w-2xl",
  form: "space-y-4",
  pair: "grid grid-cols-2 gap-4",
  relatedToAlone: "grid grid-cols-2 gap-4",
  submit: "bg-primary text-primary-foreground shadow hover:bg-primary-hover",
} as const;

/** Session-15 (S15-P13): the Activity dialog — max-w-2xl, form
 *  `space-y-4`, grid-cols-2 pairs (Type+DateTime, RelatedType+
 *  RelatedName), the bare Description textarea, the pt-4 wide footer,
 *  dark stock submit. */
export const ACTIVITY_DIALOG = {
  content: "max-w-2xl",
  form: "space-y-4",
  pair: "grid grid-cols-2 gap-4",
} as const;

/** Session-15 (S15-P12/P13): the reference's dialog Description
 *  textareas ship `min-h-[60px] rounded-md` (ours: 72px + rounded-lg). */
export const DIALOG_TEXTAREA =
  "flex min-h-[60px] w-full rounded-md border border-line bg-transparent px-3 py-2 text-base md:text-sm text-ink shadow-sm transition-colors placeholder:text-muted-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

/** Session-13 (S13-P4): the reference's topbar account menu is the STOCK
 *  Radix DropdownMenu surface (role=menu) — z-50, rounded-md, shadow-md,
 *  min-w-[8rem] — with the stock menuitem anatomy (rounded-sm,
 *  focus:bg-accent, cursor-default). */
export const MENU_CONTENT =
  "z-50 min-w-[8rem] overflow-hidden rounded-md border border-line bg-surface p-1 text-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2";

export const MENU_ITEM =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-line-soft focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0";

/** S9-9: the dashboard Recent Deals table. The reference renders EIGHT
 *  columns — "Status" appears TWICE (a visible copy-paste quirk, mirrored
 *  per the strict-mirror precedent: the "Add new industrie" typo, dead
 *  controls, empty-label selects) — and at zero rows it renders the
 *  headers with an EMPTY tbody (no empty-state paragraph). Row cells
 *  render the same stage badge in both Status columns. */
export const RECENT_DEALS = {
  headers: [
    "Lead",
    "Company",
    "Deal Value",
    "Status",
    "Owner",
    "Close Date",
    "Status",
    "",
  ] as const,
  emptyTbody: true,
} as const;

/** S9-10: empty-state anatomy per surface. The dashboard list variant is
 *  an explicit `text-sm` (14px) with py-4; calendar/activities inherit the
 *  16px base with py-8; reports render IN-TABLE rows without vertical
 *  padding. Lead Sources renders an EMPTY container at zero data (no
 *  paragraph at all). */
export const EMPTY_STATE = {
  dashboardList: "py-4 text-center text-sm text-muted",
  calendar: "text-center py-8 text-muted",
  reportsRow: "text-center text-muted",
  leadSourcesEmptyContainer: true,
} as const;

/** S9-17: Top Performing Sales Reps is a DIV list on the reference, not a
 *  table — a bordered header row with "Sales Rep" left and a `flex gap-8`
 *  pair (Deals / Owner) right. */
export const TOP_REPS = {
  headerRow: "flex items-center justify-between text-xs text-muted pb-2 border-b",
  colRight: "flex gap-8",
} as const;

/** S9-11: the reports table cards INSET their tables (p-6 pt-0 content),
 *  unlike the flush accounts/leads table cards. */
export const REPORTS_TABLE_CARD = {
  content: "p-6 pt-0",
} as const;

/** S9-8: the profile card surface — default-size Upload Photo (outline
 *  h-9) and Save Changes both stretch `w-full sm:w-auto`; the avatar is
 *  the stock Avatar primitive (w-20 h-20 sm:w-24 sm:h-24) wrapping a
 *  bg-blue-100 inner div with a stroke-2 lucide-user icon; the name
 *  column is `space-y-4 sm:space-y-6` with p-6 on the parent (not the
 *  name wrapper); the card carries no `h-fit`. */
export const PROFILE_LAYOUT = {
  uploadBtn: "w-full sm:w-auto",
  saveBtn: "w-full sm:w-auto",
  avatarIcon: "h-10 w-10 sm:h-12 sm:w-12",
  avatarIconStroke: 2,
  nameWrap: "flex flex-col items-center text-center",
  columnWrap: "space-y-4 sm:space-y-6",
  card: "rounded-xl border border-line bg-surface shadow",
  namePlaceholder: "Enter your full name",
  // ---- Session-13 (S13-P2) additions ----
  /** Page-level root: the reference's `max-w-4xl mx-auto` inner div (the
   *  p-4 sm:p-8 wrapper is the SHELL's — its inner drops the extra
   *  bg-background/min-h-screen this session). */
  root: "max-w-4xl mx-auto",
  /** Header: the reference's PLAIN `mb-6 sm:mb-8` div. */
  headerRow: "mb-6 sm:mb-8",
  /** The Personal Information title = the STOCK CardTitle (16px). */
  cardTitle: "font-semibold leading-none tracking-tight",
  /** Disabled email input: stock Input + the gray-50 wash. */
  emailDisabled: "bg-gray-50",
  /** Disabled role input: gray-50 wash + capitalize ("user" → "User"). */
  roleDisabled: "bg-gray-50 capitalize",
  /** The role badge = the STOCK shadcn Badge default variant STRUCTURE
   *  (rounded-md px-2.5 py-0.5 text-xs font-semibold, shadow, hover,
   *  transition, focus ring) — the reference's page-local primary is
   *  #171717 (NOT its global blue --primary), so the colors ride the
   *  literal neutral family: bg #171717, fg #fafafa (computed-verified). */
  badge:
    "mt-2 inline-flex items-center rounded-md border border-transparent bg-neutral-900 text-neutral-50 px-2.5 py-0.5 text-xs font-semibold shadow transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 capitalize",
  /** Upload icon carries its margin ON THE SVG like the reference. */
  uploadIcon: "h-4 w-4 mr-2",
} as const;

/** Session-13 (S13-P5): the activities "Activities by Type" card — a
 *  full structural rebuild. The header follows the FILTER_RAIL pattern
 *  (p-6 pb-3, flex-col) with the title row + the subtitle INSIDE the
 *  header (the STATIC "Last 2 days" — the range filter does not change
 *  it, live-verified); the body carries the 150px chart + a five-chip
 *  count row + a border-t footer with the "Activities" checkbox. The
 *  card-header dots are BARE text buttons (24px, no radius/bg), not
 *  ghost icon buttons. Chip swatches carry INLINE background-colors
 *  (the chart series palette: blue/violet/amber/emerald/teal). */
export const BY_TYPE_CARD = {
  headerPad: "p-6 pb-3",
  headerRow: "flex justify-between items-center",
  title: "text-base",
  subtitle: "text-xs text-gray-500",
  subtitleText: "Last 2 days",
  dotsButton: "text-gray-400 hover:text-gray-600",
  body: "p-6 pt-0",
  chipsRow: "flex flex-wrap gap-3 mt-4",
  chip: "flex items-center gap-2",
  chipSwatch: "w-3 h-3 rounded",
  chipLabel: "text-xs text-gray-600",
  footer: "mt-4 pt-4 border-t",
  footerLabel: "text-sm font-medium cursor-pointer",
  footerDotsButton: "ml-auto text-gray-400 hover:text-gray-600",
  colors: {
    call: "#3b82f6",
    email: "#8b5cf6",
    meeting: "#f59e0b",
    task: "#10b981",
    note: "#14b8a6",
  },
} as const;

/** Session-13 (S13-P7): the calendar day-cell states. The reference
 *  renders DIVs (not clickable); ours are BUTTONS (the clickable
 *  superset — semantics + focus ring stay, the REST-state classes mirror
 *  the reference). Out-of-month cells KEEP the default border (ours hid
 *  it with border-transparent); today is the blue-600 pill. */
export const CALENDAR_CELL = {
  base: "min-h-20 sm:min-h-24 p-1 sm:p-2 rounded-lg border transition-all text-left",
  outOfMonth: "border-line bg-gray-50 text-gray-400 transition-all",
  current: "border-line bg-white hover:bg-gray-50",
  today: "border-sidebar bg-sidebar text-white",
} as const;

/** Session-16 (S16-P7): the calendar CARD internals — the reference's
 *  flat anatomy (padding ON the card, three direct children: the
 *  header row, the DOW grid, the month grid). Ours had merged the DOW
 *  labels + month cells into ONE grid (42 children, gap-1 text-center)
 *  behind a padding-neutralized CardHeader/CardContent pair, with an
 *  18px semibold title — the reference ships 20/24px BOLD gray-900,
 *  `gap-1 sm:gap-2` responsive gaps, 24px header→DOW and 8px
 *  DOW→month spacing. The day CELLS keep the CALENDAR_CELL states +
 *  our clickable/flex-stack superset. */
export const CALENDAR_CARD = {
  root: "mb-6 p-4 sm:p-6",
  headerRow: "flex items-center justify-between mb-6",
  title: "text-xl sm:text-2xl font-bold text-gray-900",
  navRow: "flex gap-2",
  dowGrid: "grid grid-cols-7 gap-1 sm:gap-2 mb-2",
  dowLabel: "text-center text-xs sm:text-sm font-semibold text-gray-600 py-2",
  monthGrid: "grid grid-cols-7 gap-1 sm:gap-2",
} as const;

/** Session-16 (S16-P6): the settings picklist cards grid breaks at md
 *  (768px) — the reference renders 2 columns at 768-1023px where ours
 *  waited for lg (a mid-width-only divergence invisible to 390/1512
 *  probes). */
export const SETTINGS_GRID = "grid grid-cols-1 md:grid-cols-2 gap-4" as const;

/** Every exported class string, for regression guards. */
export function allLayoutClasses(): string[] {
  const out: string[] = [];
  for (const group of [
    PAGE_KPI_GRIDS,
    ...Object.values(PAGE_HEADER),
    RAIL_LAYOUT,
    TABLE_CARD,
    FILTER_BAR,
    REPORTS_FILTER_BAR,
    FILTER_RAIL,
    SHELL_LAYOUT,
    NAV_LAYOUT,
    TOPBAR_LAYOUT,
    LOGIN_LAYOUT,
    STAT_CARD,
    ACTIVITY_CARD,
    DASHBOARD_CARD,
    DASHBOARD_HEADER,
    SETTINGS_PICKLIST,
    SETTINGS_DEFAULTS,
    SETTINGS_DATA,
    SETTINGS_DANGER,
    MOBILE_NAV_LAYOUT,
    VIEW_SWITCHER,
    TABLE_TOOLBAR,
    LEADS_TOOLBAR,
    LEADS_FILTERS_POPOVER,
    ACTIVITY_QUICKLOG,
    NOT_FOUND_LAYOUT,
    TABS_PILL,
    TABS_SEGMENTED,
    KPI_CARD,
    DELTA_TEXT,
    // Session-13 groups
    CARD_TITLE_OVERRIDE,
    BY_TYPE_CARD,
    CALENDAR_CELL,
    // Session-15 groups
    DIALOG_CONTENT,
    DIALOG_GROUP,
    DIALOG_FIELDS_WRAPPER,
    LEAD_DIALOG,
    ACCOUNT_DIALOG,
    CONTACT_AVATAR,
    CONTACT_DIALOG,
    EVENT_DIALOG,
    ACTIVITY_DIALOG,
  ]) {
    for (const value of Object.values(group as Record<string, string | readonly string[]>)) {
      // Some session-8 records carry option ARRAYS (vocabularies), not class
      // strings — only string values belong in the class-string guard.
      if (typeof value === "string") out.push(value);
    }
  }
  return out;
}

/** Session-11 (S11-P2/P3): the stat-card shadow scale, DOM-verified on the
 *  reference at 1512 — every stat-card family computes the bare `shadow`
 *  (0 1px 3px 0.1 + 0 1px 2px -1px 0.1). Our IconStatCard (both variants)
 *  and CircleStatCard shipped the s9-re-pinned tiny `shadow-sm` — one step
 *  too light. The dashboard + reports KPI cards additionally carry
 *  `hover:shadow-md transition-shadow` (the reference's only hover-shadow
 *  surfaces). */
export const STAT_SHADOWS = {
  kpiCard: "shadow",
  kpiHover: "hover:shadow-md transition-shadow",
  barStatCard: "shadow",
  trendStatCard: "shadow",
  iconStatLeads: "shadow",
  iconStatContacts: "shadow",
  circleStat: "shadow",
} as const;

/** Session-11 (S11-P4): chart heights are per-surface constants measured on
 *  the reference (`.recharts-wrapper` clientHeight at 1512×945): dashboard
 *  pipeline + revenue 300; reports tab-1 4×300, tab-2 Forecasting 300 +
 *  three 300, tabs 3/4 3×300; the leads rail 250 (381px cards); the
 *  activities by-type 150 (270px rail). Ours shipped 260/240/250 across
 *  those surfaces — every one short. */
export const CHART_GEOMETRY = {
  dashboardHeight: 300,
  reportsHeight: 300,
  leadsRailHeight: 250,
  activitiesByTypeHeight: 150,
} as const;

/** Session-11 (S11-P8): the contacts page is the reference's ONLY
 *  full-height layout — main > flex h-[calc(100vh-64px)] > flex-1
 *  overflow-auto > p-8 > content. The calc's 64px is 5px short of the real
 *  69px topbar (a reference quirk mirrored verbatim — main overflows 5px);
 *  the padding is p-8 at ALL widths (every other page ships p-4 sm:p-8, so
 *  contacts shows 32px at 390px where the others show 16px). The trailing
 *  mobile-cards container renders nothing at zero data but is part of the
 *  reference DOM. */
export const CONTACTS_LAYOUT = {
  fullHeight: "flex h-[calc(100vh-64px)]",
  innerScroll: "flex-1 overflow-auto",
  content: "p-8",
  mobileCards: "lg:hidden mt-6 space-y-4",
} as const;

/** Session-11 (S11-P9): the entity table cards' shadow scale — accounts +
 *  leads ship `bg-white rounded-lg shadow` (standard, no border), while the
 *  contacts table card is the bordered `rounded-xl shadow-sm
 *  border-gray-200 overflow-hidden` variant (the TINY shadow — the only
 *  place the reference uses it on a table card). */
export const TABLE_SHADOWS = {
  accounts: "shadow",
  leads: "shadow",
  contacts: "shadow-sm",
} as const;

/** Session-12 (S12-P2): the reference's custom 404 page — a designed
 *  slate-family surface (NOT the stock Next built-in): centered on
 *  bg-slate-50, "404" display heading in font-light slate-300, "Page Not
 *  Found" in slate-800, the quoted-pathname message, and a white bordered
 *  Go Home pill with a lucide Home icon navigating to `/`. No app shell.
 *  Title: "This Page Does Not Exist | NEO CRM". */
export const NOT_FOUND_LAYOUT = {
  page: "min-h-screen flex items-center justify-center p-6 bg-slate-50",
  card: "max-w-md w-full",
  center: "text-center space-y-6",
  headingGroup: "space-y-2",
  h1: "text-7xl font-light text-slate-300",
  divider: "h-0.5 w-16 bg-slate-200 mx-auto",
  textGroup: "space-y-3",
  h2: "text-2xl font-medium text-slate-800",
  p: "text-slate-600 leading-relaxed",
  pathSpan: "font-medium text-slate-700",
  buttonGroup: "pt-6",
  homeButton:
    "inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500",
  homeIcon: "h-4 w-4 mr-2",
  homeHref: "/",
} as const;

/** Session-12 (S12-P4): the tab strips' stock-Radix anatomy, DOM-verified
 *  on the reference's reports (pill), activities + settings (segmented).
 *  The TRACK carries text-muted-foreground (our muted-ink #737373) so
 *  inactive tabs INHERIT it — the reference's tabs carry no text color of
 *  their own. Triggers: natural height (no h-7 — computes 28px anyway),
 *  transition-all, ring-offset-background, disabled stock classes, and
 *  the ACTIVE state adds the bare v3 `shadow` scale (0 1px 3px 0.1 +
 *  0 1px 2px -1px 0.1 — our segmented shadow-sm was one step light). The
 *  pill trigger is additionally text-xs sm:text-sm. The reference ships NO
 *  hover classes on ANY tab variant (our hover:text-foreground retired).
 *  Its tabs are also all tabIndex=-1 (keyboard-unreachable platform
 *  defect) — our roving tabindex stays the accessible fix. */
export const TABS_PILL = {
  track: "items-center justify-center rounded-lg p-1 text-muted-ink grid w-full grid-cols-2 lg:grid-cols-5 h-auto bg-white border border-line",
  trigger:
    "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow text-xs sm:text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700",
} as const;

export const TABS_SEGMENTED = {
  track: "h-9 items-center justify-center rounded-lg bg-line-soft p-1 text-muted-ink grid w-full",
  trigger:
    "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow data-[state=active]:bg-background data-[state=active]:text-foreground",
} as const;

/** Session-12 (S12-P5): the dashboard KPI card de-hover — the reference
 *  MOVED: its dashboard KPI cards are now plain stock cards (rounded-xl
 *  border bg-card shadow, no hover/border-gray-200), while the REPORTS
 *  KPI family keeps `border-gray-200 hover:shadow-md transition-shadow`.
 *  The dashboard label is text-gray-600 (#4b5563 — one step darker than
 *  text-muted); deltas are bare text-xs with NO font-medium, neutral in
 *  text-gray-600. */
export const KPI_CARD = {
  card: "rounded-xl border border-line bg-surface p-4 shadow sm:p-6",
  label: "text-xs sm:text-sm text-gray-600",
} as const;

export const DELTA_TEXT = {
  base: "text-xs",
  good: "text-green-600",
  bad: "text-red-600",
  neutral: "text-gray-600",
} as const;

/** Session-12 (S12-P6): the KPI sparkline geometry, measured on the
 *  reference. Dashboard: the trend visual sits in a `mt-2 h-8` (32px)
 *  container. Reports: a `flex items-end justify-between mt-2` row with
 *  the spark in a `flex-1 h-12 mr-2` (48px) slot whose recharts wrapper
 *  caps at max-width 176px. The sparks themselves are recharts MONOTONE
 *  curves (type=monotone) — line variant strokeWidth 2, dot false, no
 *  axes/grid, stock 5px margins; area variant fillOpacity 0.3 with a 1px
 *  stroke closing at the chart's x-axis. The reports LOST DEALS card
 *  ships NO spark (only Total Leads / Open Leads / Won Deals / Conversion
 *  Rate do). */
export const KPI_SPARK = {
  dashboardContainer: "mt-2 h-8",
  reportsWrapper: "flex items-end justify-between mt-2",
  reportsSlot: "flex-1 h-12 mr-2",
  reportsMaxWidth: "max-w-[176px]",
  line: "monotone, strokeWidth: 2, dot: false",
  area: "monotone, strokeWidth: 1, fillOpacity: 0.3",
  lostDealsSpark: false,
} as const;

/**
 * Session-27 (S27-P6, bundle-extracted): the dashboard pipeline chart's
 * custom LEGEND chip row — the per-stage colors live HERE (w-3 h-3
 * rounded squares on Tailwind bg-* classes), never on the bars (which
 * are single #3b82f6). The reference's own quirk, mirrored: the "Won"
 * label MISSES the map (the map keys are the snake_case slugs) and falls
 * back to bg-gray-400 — the s13 "Won = grey #9ca3af" pin explained (it
 * is a lookup miss, not a mapped color).
 */
export const PIPELINE_LEGEND = {
  row: "flex flex-wrap gap-4 mt-4 text-xs",
  chip: "flex items-center gap-2",
  swatch: "w-3 h-3 rounded",
  label: "text-gray-600",
  stageClass: {
    prospecting: "bg-blue-500",
    qualification: "bg-cyan-500",
    proposal: "bg-yellow-500",
    negotiation: "bg-orange-500",
    closed_won: "bg-green-500",
    closed_lost: "bg-red-500",
  } as Record<string, string>,
  fallbackClass: "bg-gray-400",
  /** The chip label format: `${stage}: $${(v / 1e3).toFixed(1)}k`. */
  valueFormat: "toFixed(1)k",
} as const;

/**
 * Session-27 (S27-P7, bundle-extracted): the dashboard KPI family's
 * HARDCODED STATIC deltas + sparkline arrays. The reference literally
 * hardcodes these (its `g` KPI memo computes real totals but feeds the
 * sparks/deltas fixed literals) — our real-data sparks rendered EMPTY in
 * the current quarter where the reference always shows the shape. The
 * Sales Target progress text is NEUTRAL text-gray-600 (never a delta).
 */
export const KPI_STATICS = {
  deltas: {
    totalLeads: "+5.3%",
    revenueThisMonth: "+15%",
  },
  sparks: {
    totalLeads: [10, 12, 11, 14, 13, 15], // line #10b981
    dealsClosed: [40, 55, 45, 70, 60, 80, 75], // bars bg-cyan-400
    revenueThisMonth: [30, 40, 50, 45, 60, 70, 80], // bars bg-green-400
    salesTarget: [30, 45, 60, 50, 70, 65, 75], // bars: first 4 #fbbf24, rest #3b82f6
    conversionRate: [25, 28, 30, 29, 32, 31], // area #8b5cf6
    avgSalesCycle: [30, 28, 29, 27, 26, 26], // line #10b981
  },
  /** The reports KPI cards' static spark (all four sparkline cards share it). */
  reportsSpark: [65, 72, 68, 85, 78, 92],
} as const;

/** Session-12 (S12-P6): the stat-card icon chips are SOLID color-50
 *  surfaces on the reference (computed: #eff6ff / #fff7ed / #f0fdf4 /
 *  #fef2f2 / #faf5ff) — not 10%-alpha tints of the series color. Keyed
 *  by the series hex the pages already pass. */
export const KPI_CHIP_BG: Record<string, string> = {
  "#3b82f6": "#eff6ff",
  "#f97316": "#fff7ed",
  "#10b981": "#f0fdf4",
  "#ef4444": "#fef2f2",
  "#8b5cf6": "#faf5ff",
};
