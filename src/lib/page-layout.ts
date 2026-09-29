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
 *  variant (fixed `text-3xl` title, no stacking); leads adds `sm:mb-8`. */
export const PAGE_HEADER = {
  standard: {
    row: "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4",
    title: "text-2xl sm:text-3xl font-bold text-foreground",
    subtitle: "text-muted mt-1",
    actions: "flex gap-2 w-full sm:w-auto",
  },
  leads: {
    row: "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4",
    title: "text-2xl sm:text-3xl font-bold text-foreground",
    subtitle: "text-muted mt-1",
    actions: "flex gap-2 w-full sm:w-auto",
  },
  contacts: {
    row: "flex items-center justify-between mb-6",
    title: "text-3xl font-bold text-foreground",
    subtitle: "text-muted mt-1",
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
 *  stronger shadow than everything else on the page. */
export const REPORTS_FILTER_BAR = {
  bar: "rounded-xl border border-line bg-surface p-4 mb-6 sticky top-0 z-10 shadow-md",
  row: "flex flex-col lg:flex-row gap-4 items-center",
  selectsWrap: "flex flex-wrap gap-3 flex-1",
  actions: "flex gap-2",
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
  ]) {
    for (const value of Object.values(group as Record<string, string>)) {
      out.push(value);
    }
  }
  return out;
}
