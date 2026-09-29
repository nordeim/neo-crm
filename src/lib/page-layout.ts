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
    title: "text-2xl sm:text-3xl font-bold text-foreground",
    subtitle: "text-muted mt-1",
    subtitleSm: "text-sm text-muted mt-1",
    actions: "flex gap-2 w-full sm:w-auto",
  },
  leads: {
    row: "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4",
    title: "text-2xl sm:text-3xl font-bold text-foreground",
    subtitle: "text-muted mt-1",
    subtitleSm: "text-sm text-muted mt-1",
    actions: "flex gap-2 w-full sm:w-auto",
  },
  contacts: {
    row: "flex items-center justify-between mb-6",
    title: "text-3xl font-bold text-foreground",
    subtitle: "text-muted mt-1",
    subtitleSm: "text-sm text-muted mt-1",
    actions: "flex gap-3",
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
} as const;

/** Reports filter bar — sticky inside the scrolling main, bordered with a
 *  stronger shadow than everything else on the page. Session-7 re-pin: the
 *  bar buttons dropped to h-8 and the reference RE-ADDED the Reset button
 *  (it was absent during the session-6 audit); every button carries an
 *  `mr-2` leading icon, and the first two selects (period / owner) wrap in
 *  `flex items-center gap-2` rows with calendar / user leading icons. */
export const REPORTS_FILTER_BAR = {
  bar: "rounded-xl border border-line bg-surface p-4 mb-6 sticky top-0 z-10 shadow-md",
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
  title: "text-base sm:text-base",
  titleWithAction: "text-base sm:text-base flex items-center justify-between",
  clearAllLink: "text-xs text-blue-600 hover:text-blue-700 font-normal",
  body: "p-6 pt-0 space-y-4",
  groupLabel: "text-sm font-semibold mb-3 block",
  groupLabelSelect: "text-sm font-semibold mb-2 block",
  checkboxStack: "space-y-2",
  filterButtonWrap: "pt-2",
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
  inner: "p-4 sm:p-8 bg-background min-h-screen",
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
  searchInput:
    "h-9 w-full rounded-md border border-line bg-background pl-10 pr-4 text-base text-foreground shadow-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 md:text-sm",
  iconButton:
    "hidden h-9 w-9 rounded-md text-muted transition-colors hover:bg-line-soft hover:text-foreground sm:inline-flex",
  iconClass: "h-5 w-5",
  rightGroup: "flex items-center gap-2 sm:gap-4",
  userButton:
    "flex h-9 items-center gap-1 rounded-md px-4 py-2 transition-colors hover:bg-line-soft sm:gap-2",
  userLabel: "hidden text-sm font-medium text-gray-700 sm:inline",
  userAvatar:
    "flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 font-semibold text-sm text-gray-600",
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
 *  trend with a `w-3 h-3` trending-up glyph, label under the value. */
export const STAT_CARD = {
  card: "rounded-xl border border-line bg-surface shadow",
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
  primaryExportLabel: "Export",
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
  statusOptions: ["All Status", "New", "Contacted", "Qualified", "Won", "Lost"] as const,
  sourceOptions: ["All Sources", "Call", "Email", "Website", "Partner", "Referral"] as const,
} as const;

/** Session-8: activities quick-log row — Log WhatsApp is a SOLID emerald
 *  button on the reference (bg-emerald-600 hover:bg-emerald-700 + shadow);
 *  the session-6 "ghost" pin is stale. The other three stay outline h-8. */
export const ACTIVITY_QUICKLOG = {
  whatsapp: "bg-emerald-600 hover:bg-emerald-700 text-white shadow",
} as const;

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
    MOBILE_NAV_LAYOUT,
    VIEW_SWITCHER,
    TABLE_TOOLBAR,
    LEADS_TOOLBAR,
    LEADS_FILTERS_POPOVER,
    ACTIVITY_QUICKLOG,
  ]) {
    for (const value of Object.values(group as Record<string, string | readonly string[]>)) {
      // Some session-8 records carry option ARRAYS (vocabularies), not class
      // strings — only string values belong in the class-string guard.
      if (typeof value === "string") out.push(value);
    }
  }
  return out;
}
