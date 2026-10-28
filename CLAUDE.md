---
IMPORTANT: File is read fresh for every conversation. Be brief and practical.
---

# NEO CRM

## Core Identity & Purpose

NEO CRM is a production-grade clone of the reference CRM workspace
(`https://neo-crm-8ab2c17c.base44.app/`) built as a single Next.js 16
application. It gives a small sales team everything the reference offers —
dashboard KPIs, pipeline analytics, accounts, contacts, leads, calendar,
activities, reports and settings. The mobile navigation sheet mirrors the
reference's own 2026-10 fix (probe #119's parity event; its pre-fix defect
drove this clone's original drawer), with kept behavioral supersets: the
resize-past-md auto-close, the main-scroller lock, the route-change close.
Maintained by the repo owner (nordeim); agents work
directly on `main`.

Key technical decisions that shape everything else: Next.js 16 App Router
with a server-guarded `(app)` route group, Prisma + SQLite (zero-config,
path-normalized), hand-rolled scrypt + HMAC cookie sessions, one Zustand
store for all server state, and Tailwind CSS v4 configured CSS-first
(literal-hex `@theme` tokens, no JS config).

## Foundational Principles

### Meticulous Approach (Six-Phase Workflow)

1. **ANALYZE** — Read the relevant files in full before planning; never work
   from partial excerpts. Identify explicit requirements, implicit needs and
   ambiguities. Check what the reference app actually does before assuming.
2. **PLAN** — Write a structured plan with sequential phases; confirm scope
   with the user before implementing when the request is ambiguous.
3. **VALIDATE** — Verify assumptions against executable truth (configs,
   lockfiles, running app) — prose docs may be stale.
4. **IMPLEMENT** — Incremental, testable components. Extend the pure seams in
   `src/lib/` rather than inlining logic. Keep lint green as you go.
5. **VERIFY** — Run the full gate: `bun run lint` → `bun run typecheck` →
   `bun run test` (2817) → `bun run build` → `bun run test:e2e` (195) — or the
   one-command `bun run gate` (session-38: the chain as a package script,
   so the build always precedes the e2e boot; session-39: the e2e step
   runs under `CI=1`, forcing a fresh server — a leftover :3100 listener
   is never reused). For UI
   changes, also drive the real app in a browser at both desktop and mobile
   widths — especially the mobile drawer regression suite.
6. **DELIVER** — Conventional Commit, push via the SSH wrapper, report what
   was Verified vs. Reasoned vs. Assumed.

### Project-Specific Principles

- **Match the reference, fix its defects.** Visual/behavioral parity with the
  reference app is the default; known reference bugs (e.g. missing mobile
  nav) are fixed, not copied.
- **One store, one envelope.** All server state flows through the Zustand
  store; all API responses use the `{ ok, data } | { ok, error }` envelope.
- **React 19 discipline is non-negotiable.** No setState-in-effect, no
  conditional hooks, no component definitions inside render.
- **Self-contained zero-config dev.** SQLite + seed must keep `bun install &&
  bun run db:push && bun run db:seed && bun run dev` working everywhere.

## Implementation Standards

### General Coding Practices

- Early returns over nested conditionals; composition over inheritance.
- Pure domain logic lives in `src/lib/*` seams with Vitest coverage; handlers
  and pages only orchestrate.
- Validation rides the Zod seam at every body boundary —
  `parseBody(req, schema)` with the schemas in `src/lib/schemas.ts`
  (zod ^4 — the auth family since session-163, the CRUD family since
  session-166); the URL-param GET family keeps the `asString`/`asDate`
  helpers.
- Named exports for components; kebab-case files; `@/` path alias only.

### Language & Framework Guidelines

- **Next.js 16 App Router**: `params`/`cookies()`/`headers()` are async —
  always `await` them. Page files export only `default` + metadata/config
  exports. Route handlers export only HTTP verbs + route config.
- **TypeScript** full strict (session-174: the `noImplicitAny: false`
  escape hatch retired — the build fails on type errors, the
  `ignoreBuildErrors` block gone), `isolatedModules`,
  no `any` in new code.
- **Tailwind v4 CSS-first**: tokens are literal hex in `src/app/globals.css`
  `@theme`; custom utilities via `@utility`, never `@layer utilities`. The
  `hidden` HTML attribute overrides display utilities — never combine them.
  v4 rename hazards (the AGENTS architecture-facts register): shadow-sm ·
  backdrop-blur-sm · space-y margin-BOTTOM · `outline-none` (v4 = style
  none; the reference's v3-era = 2px solid transparent — zero visible
  pixels on both, walk51-decoded; the visible focus face rides the
  box-shadow ring, byte-equal two-app).
- **Radix primitives** for dialogs/selects/popovers; `tw-animate-css`
  (vendored at `src/app/vendor/tw-animate.css`) drives `data-[state]`
  animations.
- **recharts** for charts — with recharts DEFAULTS (no custom tooltip
  content, no tick/grid style overrides) and the REAL chart at all-zero
  data (session-10 reversal: the session-1 ChartEmpty dashed placeholders
  are retired; the reference renders real charts in its persistent
  zero-data state). Session-176 migrated the major 2.15 → 3.10.1
  (ADR-021): every chart-type site pins `accessibilityLayer={false}`
  (the 3.x default flip — the reference's 2.x wrapper DOM is the parity
  surface), the type seam lives at the family boundary (the
  `tooltipFormatter` adapter + the Pie-label bridge), and the e2e grid
  sentinel is the standing upgrade guard (it passed live on 3.10.1 —
  the upgrade-proof).
- **lucide-react** icons only.

## Development Workflow

### Environment Setup

```bash
bun install
cp .env.example .env            # then set AUTH_SECRET (openssl rand -hex 32)
bun run db:push                 # create db/custom.db from the schema
bun run db:seed                 # demo workspace (idempotent, in place)
bun run dev                     # http://localhost:3000
```

Demo login: `sepnetflix2023@outlook.com` / `$Abcd1234`.

### Build Commands

| Command             | Purpose                                       |
| ------------------- | --------------------------------------------- |
| `bun run dev`       | Dev server on port 3000 (Turbopack)           |
| `bun run build`     | Production standalone build                   |
| `bun run start`     | Boot the standalone production server         |
| `bun run lint`      | ESLint (flat config) — must be 0/0            |
| `bun run typecheck` | `tsc --noEmit` — the real type gate           |
| `bun run test`      | Vitest unit suites (2817 checks)            |
| `bun run test:watch`| Vitest in watch mode                          |
| `bun run smoke`     | Smoke the standalone artifact (14 checks, needs build first) |
| `bun run test:e2e`  | Playwright E2E (195 checks, needs build first) |
| `bun run gate`      | The full gate in one command (lint → typecheck → test → build → smoke → e2e) |
| `bun run db:push`   | Push Prisma schema (no migrations folder)     |
| `bun run db:seed`   | Reseed demo data in place                     |
| `bun run db:census` | Print the resolved db path + counts vs the seed contract (session-53; the sanctioned census — see the anti-patterns) |

## Testing Strategy

### Test Pyramid

- **Unit (Vitest, 2817 checks)** — pure seams: `tests/db-path.test.ts`, `tests/nav-config.test.ts` (s147),
  `tests/auth.test.ts`, `tests/format.test.ts`, `tests/csv.test.ts`,
  `tests/rate-limit.test.ts`, `tests/avatar.test.ts`,
  `tests/constants.test.ts` (the DOM-pinned chart palette + session-10's
  reports vocabularies: the 8 raw slugs, FUNNEL_STAGES, AGING_BUCKETS),
  `tests/lead-filters.test.ts` (the popover Save View encode/decode seam),
  `tests/reports-data.test.ts` (session-31 rewrite: the 8-slug
  pipelineStageCounts SPLIT, the insertion-order "MMM yyyy" month keys,
  the actual/forecasted accuracy formula, the created-date aging, the
  last-activity at-risk join),
  `tests/login-reset.test.ts` (session-11: the login card's in-place
  reset-password flow — view swaps, submit gating, back navigation),
  `tests/page-titles.test.ts` (session-13: the auth pages' ABSOLUTE
  titles — the root template DOUBLED the relative ones),
  `tests/charts-contracts.test.ts` (session-13: the dashed grid
  `strokeDasharray="3 3"` contract + the funnel-as-horizontal-bar type),
  `tests/metadata.test.ts` (session-18: the siteUrl seam + the reference's
  405-char SITE_DESCRIPTION, the OG/Twitter layout pins, the icon +
  og-image asset pins, the sitemap/robots route-handler pins),
  `tests/pwa-metadata.test.ts` (session-19: the manifest route-handler
  byte pins, the #000000 theme-color + PWA_META family, the 180×180
  apple-icon file convention, the pageMetadata() per-route factory —
  the prefixed og descriptions + per-route canonical/og:url/twitter:url
  + the wrapper wiring, and the dialog micro-contracts: ct-phone type=tel,
  zero datalists, the exact avatar accept list),
  `tests/http-headers.test.ts` (session-20: the next.config.ts headers()
  security set — Referrer-Policy/X-Content-Type-Options/HSTS on every
  path — and the static-file content-type pins: the sitemap's bare
  application/xml, the robots/manifest regression guards),
  `tests/login-views.test.ts` (session-21: the login-card funnel — the
  auth error strings "Invalid email or password" / "A user with this
  email already exists", the Callout banner vocabulary, the extended
  view machine signin→signup→verify→signin, the signup/verify layout
  pins, and the verification-ladder messages incl. the 5-attempt
  lockout),
  `tests/typography.test.ts` (session-22: the zero-webfont base — the
  Inter-webfont retirement pins, the reference's EXACT `--font-sans`
  stack pin, the smoothing + ::selection retirements, and the s13
  base-font regression guards re-held),
  `tests/tabs-aria.test.ts` (session-23: the tabs ARIA + keyboard
  contract — the useId trigger/panel id wiring, the TabsPanel shell +
  hidden/aria-labelledby contract, the ArrowLeft/Right/Home/End + wrap
  keyboard pins, the three pages' one-panel-per-tab migration, and the
  login page's authenticated-redirect retirement; session-178's walk51
  walked the search-focus + segmented-active faces, session-179's
  walk52 the PILL family's — the reports tab triggers' FOCUS ring
  byte-equal on both axes under REAL keyboard focus
  [`scripts/walk52-pill-focus-active.ts`], the seeded-vs-zero page
  offset above the tab bar the walk's documented DATA-STATE genus),
  `tests/route-case.test.ts` (session-24: the route-case + URL-state
  layer — the nine capital-route RENDER aliases inside the (app) group
  (.jsx files — the TS1149 casing-collision fix) with their
  capital-case pageMetadata, the Dashboard alias's NO-metadata
  root-head contract, the retired top-level /Profile redirect, the
  capitalized NAV_ITEMS href set, the case-insensitive sidebar isActive,
  the /Profile account-menu target, the dead More... affordance, the
  no-capital-auth-alias pin, and the zero-URL-state census),
  `tests/profile-route.test.ts` (session-24 rewrite: the /Profile render
  alias INSIDE the (app) group — shell + guard + capital-route metadata;
  the s14 redirect mechanism retired, the next.config no-redirect-loop
  pin kept),
  `tests/pdf-export.test.ts` (session-25: the Reports PDF export
  contract — the html2canvas-pro + jsPDF seam with the A4 portrait
  pagination loop + the `crm_reports_${isoDate()}.pdf` filename, the
  text-artifact `exportTablePdf` with the paren-truncating slug rule,
  and the three-button wiring with NO `window.print` + NO toast on the
  PDF path),
  `tests/saved-reports.test.ts` (session-25: the localStorage seam —
  the `crm_saved_reports` key, the SavedReport schema with the SHORT
  dateRange slugs, the encode/decode round-trip, the dialog component's
  structure pins, and the reports page's live-count wiring with the
  toast retired),
  `tests/loading-layer.test.ts` (session-25: the skeleton retirement —
  zero `Skeleton` imports across the app pages, zero `animate-pulse` in
  src/, the store's `loadingFlags` + `loading()` helper + the
  `misc.tsx` export all gone; session-56: the whole app-authored
  `misc.tsx` module retired — its sole export EmptyState was
  s25-stranded src-dead, and the Skeleton pin re-anchored to the
  module's absence),
  `tests/csv-contract.test.ts` (session-25: the CSV artifact family —
  the `prefix_YYYY-MM-DD.csv` filename convention, the leads 8-column
  set, the filter-aware `type=report` branch, `downloadBlob()`, and the
  per-table client-side blobs with the reference's SHORTER CSV
  prefixes),
  `tests/report-periods.test.ts` (session-25 + the session-32 id
  correction: the 6-entry period vocabulary — today/thisWeek/thisMonth/
  quarter/ytd/all (the bundle's WIRE ids; the s25 week/month inferences
  disproven), the `periodStart()` mappings in both API routes, the
  `quarter` default, and the `normalizeSavedPeriod()` legacy-id
  migration for stale saved-view localStorage entries),
  `tests/settings-data-tab.test.ts` (session-26: the three
  CardDescriptions + the per-index button margins + the trash2 icon),
  `tests/reset-flow.test.ts` (session-26: the native confirm/alert
  contract — the 118-char confirm message, the defensive/success/failure
  alerts, NO toast on the reset path, the store's refetch half pinned),
  `tests/csv-templates.test.ts` (session-26: the three byte-exact static
  templates + the `_template.csv` convention + the seam wiring),
  `tests/entity-export.test.ts` (session-26: the raw-dump seam —
  first-row-keys header, quoted values, empty-at-zero, singular
  prefixes; the quoted page-level contacts/accounts exports incl.
  Health; the dead /api/export branches retired),
  `tests/account-health.test.ts` (session-26: the stored health field —
  schema default, the seeded three-state vocabulary, the export column),
  `tests/import-dialog.test.ts` (session-26: the reference's Import
  Contacts dialog — the copy, the dropzone family, the chosen-file box,
  the Required/Optional columns, the footer gating, no template link),
  `tests/charts-internals.test.ts` (session-27: the chart-family rewrite
  — the stock-axis correction, the five parameterized families, the
  retired scaffold components, the per-surface wirings),
  `tests/account-health-tab.test.ts` (session-27: the computed
  account-health seam + the API + the tab-5 rendering pins),
  `tests/contact-model.test.ts` (session-28: the Key/Standard/At Risk
  vocabulary, the role/engagement/company-size fields, the raw source
  values, the ce formatter, the health/tier badge maps),
  `tests/entity-edit-dialog.test.ts` (session-28: the W7/wce/Mke
  edit-dialog family — the shared max-w-2xl component + the three
  configs' field sets),
  `tests/contact-surfaces.test.ts` (session-28: the contacts row
  contract, the Pke slide-over, the kke filter panel, the stats fix),
  `tests/account-surfaces.test.ts` (session-28: the accounts row, the
  Ece insights dialog, the Oce rail alignment),
  `tests/leads-inline.test.ts` (session-29: the leads INTERACTIVE row —
  the orange Target name box, the inline Value/Status/Date inputs, the
  five raw status options, the source badge, the overdue border +
  CircleAlert, the dead Convert item, the sticky thead, the optimistic
  store apply, the Gke popover pins, the raw source migration),
  `tests/upload-api.test.ts` (session-30: the self-hosted UploadFile
  mirror — POST /api/upload with the image check + the 5MB ceiling,
  GET /api/uploads/[name] with the pinned name charset, uploads/
  gitignored),
  `tests/contact-photo.test.ts` (session-30: the AAe photo section —
  the img/initials/User render, the remove X, the camera + the MIME
  trio, the alert strings, the Uploading hint, the John Doe Name field,
  the W7 photo-less negative, the slide-over initial-only negative, and
  the dialog scroll-cap layer),
  `tests/profile-photo.test.ts` (session-30: the aCe flow — the
  image/* input with no type alert, the toast vocabulary, the schema +
  API photoUrl carriage, the 500ms-reload save, the topbar img branch),
  `tests/opportunity-model.test.ts` (session-31: the Opportunity entity
  — the six-stage vocabulary + the P/O badge maps, the PIPELINE_STAGES
  opp redefinition, the schema/seed/API/store/reset pins, the dashboard
  KPI derivations incl. the hardcoded-0 sales target + the FIXED
  Nov..May labels, and the reports derivations incl. the 8-slug funnel
  split + the opp-based KPI row),
  `tests/dashboard-contracts.test.ts` (session-27: the O-map legend
  chips, the KPI statics, the checkbox-row lists),
  `tests/leads-charts.test.ts` (session-27: the 5-status pipeline, the
  grouped bars, the LEADS_FUNNEL vocabulary),
  `tests/calendar-cells.test.ts` (session-27: the EVENT_TYPE_CHIP tints,
  the plain day numbers, the clickable chips, the tall-bar/agenda rows),
  `tests/calendar-fetch-bounds.test.ts` (session-51: the calendar month
  fetch-window seam — `calendarFetchBounds` in format.ts pins `to` to
  the UNTRIMMED grid's last day so the trailing next-month cells keep
  their events after a month flip [N-51a], plus the KPI trend baselines
  reading the same filtered population as the currents [N-51b]),
  `tests/page-layout.test.ts` (the DOM-pinned layout + chrome contracts,
  sessions 6–11: KPI ladders, page headers, rails, filter bars, the
  shell/sidebar/topbar anatomy, the login card, stat-card and card-header
  button pins, the mobile-nav breakpoint contract, view switchers, the
  leads filters popover, session-10's stock-primitive pins — INPUT_BASE
  / SELECT_TRIGGER / SEARCH_INPUT / PAGE_TITLES, and session-11's
  CHART_GEOMETRY / STAT_SHADOWS / TABLE_SHADOWS / CONTACTS_LAYOUT /
  LOGIN_RESET_LAYOUT pins, and session-12's NOT_FOUND_LAYOUT /
  TABS_PILL / TABS_SEGMENTED / KPI_CARD / DELTA_TEXT / KPI_SPARK /
  KPI_CHIP_BG pins + the border-split token re-pin, and session-13's
  CARD title map + BUTTON_BASE radius + PROFILE_LAYOUT / BY_TYPE_CARD /
  CALENDAR_CELL / MENU_CONTENT / MENU_ITEM / FUNNEL_CHART pins + the
  #0a0a0a foreground + 16px base font re-pins, and session-15's
  DIALOG_FAMILY layer — the stock dialog chrome (DIALOG_CONTENT /
  DIALOG_OVERLAY / DIALOG_HEADER / DIALOG_FOOTER / DIALOG_CLOSE), the
  per-dialog body contracts (DIALOG_GROUP / DIALOG_FIELDS_WRAPPER /
  LEAD_DIALOG / ACCOUNT_DIALOG / CONTACT_DIALOG / CONTACT_AVATAR /
  EVENT_DIALOG / ACTIVITY_DIALOG) + the no-description /
  no-placeholder source rules, and session-16's responsive layer —
  PAGE_ROOT standard/bare + the per-page-root source pins, the
  table-kit stock strings (container/checkbox variants/hover-50), the
  TABLE_CARD plain-div rule, CALENDAR_CARD, SETTINGS_GRID + the
  design-tokens `th, td { padding: 1px }` platform reset, and
  session-180's walk53 layer — the dropdown/select OPEN-state
  interior walk's born-green contract-freeze family [the walk53 decode
  freeze (the tool's own contract, incl. the attribute-selector
  discovery: Playwright's getByRole("combobox") engine stops matching
  the trigger once aria-expanded flips true at open — the raw
  attribute selector is the only form matching both states) · the
  MENU_CONTENT + MENU_ITEM FULL-string freezes · the select.tsx
  content/item full-string freezes (the M-81c1/M-81c2 carriers) —
  `scripts/walk53-dropdown-open-interior.ts`], and session-181's
  walk54 layer — the dialog-surface focus-state interior walk's
  born-green contract-freeze family [the walk54 decode freeze (the
  tool's own contract, incl. the D-112a4 `[role=dialog][data-state=
  "open"]` root rule + the overlay-selector finding) · the
  DIALOG_CONTENT.base + DIALOG_CLOSE + DIALOG_OVERLAY FULL-string
  freezes (the close X's focused DOUBLE-ring carrier + the oklab/rgba
  serialization genus's class carrier) —
  `scripts/walk54-dialog-focus-interior.ts`], and session-182's
  walk55 layer — the reports-filter selects open-state interior
  walk's born-green contract-freeze family [the walk55 decode freeze
  (the four-select OPEN ledger + the REAL keyboard highlight drive +
  the owner DATA-STATE arm) · the DISTINCT-opportunity-owners
  derivation freeze (the s31 contract, the DATA-STATE arm's source
  carrier) · the SELECT_ITEM indicator span + Check pair full-string
  freeze (the genuine s180-battery gap) —
  `scripts/walk55-reports-selects-open.ts`], and session-183's
  walk56 layer — the leads-popover + contacts-panel open-state
  interior walk's contract-freeze family [the walk56 decode freeze
  (the two-arm OPEN ledger + the mount-focus census + the REAL
  keyboard Tab drive + BOTH axes) · the POPOVER content chrome
  FULL-string freeze (the genuine walk53-battery gap: the
  DropdownMenu + Select carriers full-frozen at walk53, the
  Popover family's own carrier never) · the D-183a1 OPEN-face
  cure pin (the contacts Filters trigger's OPEN variant-flip —
  the reference's DARK stock primary #171717 via the neutral
  literals, RED-first over the live find) —
  `scripts/walk56-leads-popover-open.ts`], and session-184's
  walk57 layer — the activities more-filters toggle +
  rail-actions open-state interior walk's contract-freeze family
  [the walk57 decode freeze (the expander hover/open ledger +
  the reveal census + the REAL Tab chains + the rail action
  pair + the phone absence — the first mouse-borne HOVER face
  ever walked) · the more-filters expander construction
  FULL-string freeze (the genuine battery gap: no pin held the
  expander's construction; the fixed outline variant — the
  D-183a1 same-family adjudication CLEAN) · the reveal
  construction freeze (the More Types group + the Task/Note
  vocabulary + the revealed checkboxes entering the REAL tab
  order) — `scripts/walk57-activities-rail-open.ts`], and session-185's
  walk58 layer — the quick-log dialog open-state interior walk's
  contract-freeze family [the walk58 decode freeze (the two-app dialog
  OPEN ledger at BOTH axes — the dialog family reachable at phone,
  unlike the rail — + the mount-focus census + the REAL Tab drive
  through the dialog + the select vocabularies + the by-type footer
  decode) · the quick-log trigger→dialog construction freeze (the
  genuine battery gap: the s125 pins hold the FORM side, never the
  PAGE side — the QUICK_LOG quartet + the onClick wiring + the
  ActivityDialog call-site props) · the by-type footer pair freeze (the
  defaultChecked checkbox + the htmlFor label + the ••• aria-label
  superset) · the D-185a1 placeholderState RESTORATION (the s133
  retirement REVERSED by the walk58 live find: the reference's current
  trigger carries the stock data-[placeholder] arm; the empty-select
  placeholder ink rgb(115,115,115) byte-equal post-cure — RED-first
  over the live find) — `scripts/walk58-quicklog-dialog-open.ts`], and
  session-186's walk59 layer — the settings picklist-editor open-state
  interior walk's contract-freeze family [the walk59 decode freeze (the
  two-app picklist OPEN ledger at both axes — the rows LIVE on both
  apps, the settings singleton's own configuration — + the
  mount-focus census (the Save-button DOM-reuse landing) + the REAL
  Tab drive through the swapped row + the add-row + the Defaults
  combobox decode) · the ListEditor rename-arm construction freeze
  (the genuine battery gap: the s72 pins hold the ROW + the ADD
  classes, never the RENAME SWAP's construction) · the Defaults-tab
  select wiring freeze (the genuine gap: the s14 pins hold the
  LAYOUT, never the two comboboxes' value wiring — Month/Week +
  Monday/Sunday + the debounced set() persist) · the D-186a1 PEN
  GLYPH CURE (the rename-trigger's icon is the reference's lucide
  PEN — exactly ONE path, ours added the Pencil's tip line; the M-82c2
  icon-identity class — RED-first over the walk59 live find,
  re-walked byte-equal) — `scripts/walk59-settings-picklist-open.ts`],
  and session-187's walk60 layer — the profile photo-upload + Data-tab
  focus/open interior walk's contract-freeze family [the walk60 decode
  freeze (the two-app profile + Data-tab OPEN ledgers at both axes +
  the REAL Tab drives — the programmatic .focus() never triggers
  :focus-visible there on either app) · the profile avatar family
  construction freeze (the genuine battery gap: the s13 pins held the
  ROOT + the icon class, never the fallback's tag or the color
  carrier — the stock DIV fallback + the ON-SVG color at BOTH sites
  [the D-187a2 cure]) · the Data-tab list-body rhythm freeze (the
  genuine gap: the s14/s26/s83 pins held the labels/margins/icon,
  never the v4-vs-v3 rhythm arm — the D-187a3 carrier, the v4
  space-y INLINE-FLOW variant: the reference's margin-TOP-on-following
  drops its baseline-aligned row 8px below our margin-BOTTOM form at
  byte-equal title/desc/content boxes, cured with the s11-era explicit
  `[&>*+*]:mt-2` form; + the D-187a1 file-input id + tabIndex
  retirement, the D-114a2 same-page precedent) —
  `scripts/walk60-profile-datatab-focus-open.ts`],
  and session-188's walk61 layer — the settings segmented tab-bar +
  accounts-rail/leads-search page-arms focus/open interior walk's
  contract-freeze family [the walk61 decode freeze (the tool's own
  contract: the two-app settings tab-bar OPEN ledger at both axes + the
  REAL Tab/ArrowRight drives — 13 stops STRUCTURALLY IDENTICAL on both
  apps — + the walk57 mouse-click face + the rail/leads/reports
  siblings' decode) · the settings tab-bar call-site construction
  freeze (the genuine battery gap: the s23 pins hold the tabs-aria
  WIRING + the s12/s125/s129 pins the constant's class strings, never
  the settings page's own segmented call-site) · the accounts
  rail-selects construction freeze (the genuine gap: the s28 pins
  hold the row/rail geometry, never the three SelectTrigger sites'
  construction + the Label pairing) · the leads-search call-site
  construction freeze (the genuine gap: the s29 pins hold the inline
  ROW + the s8-4 pin the pl-10 arm, never the search input's own
  call-site); the round ZERO live finds on the walked surfaces —
  every delta a documented genus, the outline COLOR-CARRIER sub-form
  the register's newest arm (zero visible pixels on both) — the
  ONE live find D-188a1 a DOCS head defect (the retired session-186
  SKILL-head block's corrupted ship line, the s187 first-pass residue
  — the s171-fix doctrine now PINNED in docs-counts) —
  `scripts/walk61-settings-tabs-rail-focus-open.ts`].
    and session-189's walk62 layer — the leads Saved-Views select + calendar
  month-nav focus/open interior walk's contract-freeze family [the walk62
  decode freeze (the tool's own contract: the two-arm OPEN ledger at both
  axes + the REAL Tab/ArrowDown drives + the native-prompt save flow +
  the month-flip round-trips) · the Saved-Views select call-site
  construction freeze (the genuine battery gap: the s29 pins hold the
  toolbar row + the savedViewsSelect width class, never the
  SelectTrigger call-site's own chain) · the calendar month-nav
  call-site construction freeze (the genuine gap: the s16 pins hold the
  navRow container + the s27 pins the day cells, never the three Button
  call-sites); the round ZERO live finds — every delta a documented
  genus, the second consecutive zero-fix freeze-pin session —
  `scripts/walk62-savedviews-calnav-focus-open.ts`].
    and session-190's walk63 layer — the reports Save-Custom-View
  dialog focus/open interior walk's contract-freeze family [the walk63
  decode freeze (the tool's own contract: the one-arm OPEN ledger at
  both axes + the REAL Tab/Save drives + the save/reopen round-trips +
  the checkbox-toggle ride) · the Saved-Reports trigger call-site
  construction freeze (the genuine battery gap: the s25 pins hold the
  wiring regex, never the trigger's own chain) · the Save-Report-Dialog
  open-interior construction freeze (the genuine gap: the s25 pins hold
  the content words as regexes, never the call-site chains) · the
  D-190a1 cure pin — the six column checkboxes' LITERAL id/for
  construction (the reference's REPORT_COLUMNS keys as ids; ours
  shipped React useId ids; the D-114a2/D-187a1 doctrine; id={col.key}
  at the call site; RED-first: 1 RED at birth -> the cure -> GREEN);
  the round ONE live find cured, every other delta a documented genus
  (incl. the md:text-sm class-order genus + the checkbox token genus,
  both computed-equal live) —
  `scripts/walk63-savedreports-dialog-focus-open.ts`],
  and session-191's walk64 layer — the three create dialogs'
  (Contact/Account/Event) focus/open interior walk's
  contract-freeze family [the walk64 decode freeze (the tool's own
  contract: the three-arm OPEN ledger at both axes + the REAL Tab
  drives + the select rides + the conditional-Name appearance + the
  cancel-then-reopen decode) · the CONTACT open-interior construction
  freeze (the genuine battery gap: the s19/s30 pins hold OUR wiring
  regexes, never the call-site chains — the avatar section + the two
  h3 headers + the accept-trio file input + the footer pair) · the
  ACCOUNT open-interior construction freeze (the same gap: the s15/s5
  pins hold the field order + payload contracts, never the chains) ·
  the EVENT open-interior construction freeze (the same gap: the
  s15/s76 pins hold the constants + the bundle decode, never the
  chains — the M-92c3 rows=3 textarea + the M-76c13 conditional Name
  arm + the M-76c12 blue submit) · the D-191a1/a2/a3/a4 id-parity
  cure pins (RED-first: exactly 5 RED at birth → the cures → GREEN —
  the reference's literal id/for maps on the contact + account
  dialogs restored [name/email/phone/company/position ·
  name/industry/email/phone/website/revenue/employees], the selects'
  id + label-for wiring [id="source"/for="source" ·
  id="status"/for="status", the aria-label superset kept], the contact
  file input's explicit tabIndex retired [the D-187a1 doctrine's next
  member]; the re-walk proves the id/for/tabIndex ledger deltas gone,
  byte-equal both apps) — the round's product-code touch
  entity-dialogs.tsx 1226→1250 —
  `scripts/walk64-createdialogs-focus-open.ts`],
  and session-192's walk65 layer — the login anon-surface interiors +
  the landing marketing-arms' focus/open walk's
  contract-freeze family [the walk65 decode freeze (the tool's own
  contract: the four-view OPEN ledgers at both axes + the REAL Tab
  chain + the draft decode + the FAQ/menu arms + the CTA faces — the
  anon battery, FRESH contexts on both apps) · the LOGIN open-interior
  construction freeze (the genuine battery gap: the s11/s21/s79/s111
  pins hold OUR wiring regexes + the computed-style contracts, never
  the call-site chains — the signin card chain + the signup 3-field
  chain + the reset email chain + the sent callout chain) · the
  LANDING marketing-arms construction freeze (the same gap: the s142
  pins hold the component-level regexes, never the call-site chains —
  the FAQ single-open machine + the mobile disclosure menu) · the
  D-192a1/a2/a3 cure pins (RED-first: exactly 3 RED at birth → the
  cures → GREEN — the signup confirm input's literal id
  [confirm-password → confirmPassword] + the reset view's bare
  literal email id [reset-email → email, the
  ids-are-construction-parity doctrine's next members] + the
  auth-card dark submits' REAL focus-visible ring
  [ring-slate-400 → ring-ring at all four sites — the first
  REAL-keyboard-face ring find: the reference's stock dark submits
  focus to the near-black --ring token over the white 2px offset,
  live-walked on the signin/signup/reset submits; the INPUTS'
  slate-400 rings byte-equal and stay]; the re-walk proves the
  id/for ledger deltas gone + the submit's REAL ring now the
  reference's family; the draft-keep decode documented as the KEPT
  house superset — ours keeps the typed email across the in-card view
  flips, the reference clears it, its own defect never mirrored) —
  the round's product-code touch login-card.tsx + page-layout.ts +
  login-reset.ts (all string swaps, zero line-count changes) —
  `scripts/walk65-login-landing-arms.ts`],
  and session-193's walk66 layer — the marketing-interior arms walk's
  contract-freeze family [the walk66 decode freeze (the tool's own
  contract: the two-page OPEN ledgers at both axes + the REAL Tab
  chains with the geometry-keyed focus captures + the write-free link
  rides + the phone axes — the AUTHENTICATED battery, the sweep-state
  pair) · the MARKETING open-interior construction freeze (the genuine
  battery gap: the s142 landing-page pins hold the LANDING page's
  strings, never the about/contact call-site chains — the h1 chains +
  the Get-in-touch anchor + the mailto + the three social anchors) ·
  the SIDEBAR ring construction freeze (the D-193a2 KEPT-SUPERSET
  pin: the ring-white/50 focus-visible construction at BOTH nav
  sites — sidebar.tsx + mobile-nav.tsx — carried ZERO test teeth
  until this pin; the reference ships NO authored focus face on its
  sidebar links, its own keyboard-focus-gap family, the D-112a2
  doctrine, never mirrored) · the D-193a1 cure pin in design-tokens
  (RED-first: exactly 1 RED at birth → the cure → GREEN — the
  globals.css base layer's universal outline-color rule: the
  reference's compiled base carries the shadcn base template's
  `* { border-color: …; outline-color: hsl(var(--ring) / .5); }`; ours
  carried only the border-color half, so every UA-outline-painting
  surface resolved the ENGINE default instead of the reference's
  authored 50% ring — the cure adds color-mix(in oklab,
  var(--color-ring) 50%, transparent), the same resolved color; the
  re-walk proves the marketing anchors' focus outline-color now the
  reference's family, the oklab-vs-rgba serialization the s126 noise
  genus) — the round's product-code touch globals.css (+12 lines —
  the PAD/SKILL line-census rows re-anchored 430→442) —
  `scripts/walk66-marketing-interior-arms.ts`],
  and session-194's walk67 layer — the 404 interior's interactive
  arms walk's contract-freeze family [the walk67 decode freeze (the
  tool's own contract: the two-context OPEN ledgers at both axes + the
  REAL Tab chain with the Go Home focus capture + the write-free ride
  + the anon posture census — the authenticated legs on the
  sweep-state pair, the anon legs on fresh contexts) · the 404
  open-interior construction freeze (the genuine battery gap: the s12
  pins hold the NOT_FOUND_LAYOUT constant strings, never the
  not-found-body call-site chains — the Link construction + the
  leading-slash strip + the inline glyph) · the D-194a5 ANON-posture
  construction freeze (the no-session-check construction — the
  reference's auth-first client-router guard walls anon unknown-routes
  at /login?from_url=<absolute-url>, its SPA platform artifact, never
  mirrored) · the D-194a1/a3/a4 cure pins (RED-first: exactly 3 RED at
  birth → the cures → GREEN — the quoted-path form
  [usePathname's leading slash stripped at the interpolation; the
  crm.spec e2e string re-anchored in the same commit] + the glyph [the
  reference's heroicons home outline inlined — the M-82c2
  icon-identity family's first cross-library member: ONE path, NO
  stroke-width [computed weight 1], the bare w-4 h-4 class; the
  lucide-house import retired at this one site] + the title [the s12
  absolute title was a pre-drift decode — the current reference ships
  bare "NEO CRM"; the metadata export retired, the root default
  renders, byte-equal]; the re-walk proves the span/text/glyph/title
  ledger deltas GONE, 43→23 — every remaining delta a documented genus
  or pinned kept superset) — the round's product-code touch
  not-found.tsx + not-found-body.tsx + page-layout.ts (+7 lines — the
  PAD/SKILL line-census rows re-anchored 1718→1725 / 277→283) —
  `scripts/walk67-404-interior-arms.ts`].
  Node environment; `@` alias resolved.
- **Property (Vitest + fast-check, 29 checks)** — `tests/property.test.ts`
  (session-172: the invariant layer over the pure seams — the csv
  escape/parse round-trip [the F-172e parser guard: line-ending
  normalization inside the state machine, outside quotes only,
  RFC 4180 §2.6] · the guard idempotence · the lead-views +
  saved-reports round-trips/totality · the formatter/initials
  robustness freezes; the generators respect each seam's OWN domain
  contracts — the vocabularies, the raw-string fields, the
  fixed-width csv model; rides the declared `fast-check` devDep
  ^4.10.2 — the 13th devDep; session-173: the deeper family — the Zod
  round-trip half [P-h…P-m: the create-defaults quadrant · the enum
  membership · the emailField trim/lowercase contract · the PUT
  three-state · the required-name quadrant · the contacts legacy
  priority mapping] + the rate-limit window half [P-n…P-q over the
  injectable clock: the fixed-window reset crossing · the retryAfterSec
  formula · the remaining monotonicity · the default-clock equivalence
  — `rateLimit(key, limit, windowMs, now = Date.now())`, the s164
  sweep form extended to the rateLimit path, purely additive];
  session-175: the response-side wire-contract half [the READ half of
  the s166 quadrant — P-r the entity wire round-trip: every one of the
  six route-exact rows survives the wire verbatim, Dates as exact
  toISOString(), nulls PRESENT, the key set exact, the joined shapes
  intact · P-s the envelope pair contract: ok()'s two-key passthrough
  + fail()'s verbatim error arm, driven through the real helpers —
  the wire contracts the crud-zod-seam READ-half source pins freeze
  at the route side])
- **E2E (Playwright, 195 checks)** — `tests/e2e/`: `auth.spec.ts`
  (logged-out surface + session-11's login reset-password flow +
  session-21's in-place funnel: the Callout banner with zero toasts,
  the signup view swap + mismatch guard, the verify-email ladder +
  resend, the /signup superset page),
  `a11y.spec.ts` (session-171: the axe-core two-gate — the nine CRM
  pages × desktop + phone + the three anon surfaces × both widths +
  the drawer-open state + session-172's dialog-open family (the five
  create dialogs + the contact edit dialog — the closed-by-default
  genus a page scan never sees); structural violations must be ZERO
  (every interactive control carries an accessible name —
  `role="combobox"` names come from aria-label, never the visible span
  text; dialog labels wire htmlFor/id, never bare siblings) and
  color-contrast/svg-img-alt nodes must cite the sanctioned register:
  the reference's own palette + the recharts funnel genus, each
  verified on the reference's DOM; the axe engine rides the declared
  `axe-core` devDep),
  `auth.setup.ts` (one real login, storageState saved),
  `crm.spec.ts` (authenticated golden path across all 9 pages + the
  session-10 per-page-titles and reports tab 2-4 structure tests, plus
  session-13's account-menu role=menu, reports-funnel bar-chart and
  by-type card structure tests),
  `mobile-navigation.spec.ts` (11-check regression suite for the drawer —
  pinned because the reference app ships NO mobile navigation; includes the
  resize-past-md lock-release regression, the session-12 focus-entry test,
  the s104 ten-route zero-390px-overflow sweep + the s104 drawer-OPEN
  seeded-state guard; session-177 adds the walk50 doctrine — the drawer's
  OPEN interior is walk-proven byte-equal via
  `scripts/walk50-drawer-interior.ts`, whose maiden pass caught the 8px
  header-rhythm defect no standing leg could see: v4's space-y
  margin-BOTTOM semantics puts the h2's :where() mb-2 IN flow where the
  reference's v3-era mt-on-the-sr-only-<p> never was — cured with the
  explicit `mb-0` on MOBILE_NAV_SHEET.title, the M-92c1 phantom-mb
  precedent, per ADR-022), `reports-mobile.spec.ts` (the s105 seeded-state
  reports-tabs guard — the SECOND surface family walked at phone width:
  the KPI row + the pill tab bar + the 300px charts at 390×844 on the
  SEEDED e2e.db), `settings-mobile.spec.ts` (the s106 seeded-state
  settings-tabs guard — the THIRD surface family: the segmented tab
  bar + the picklist grid + the Data-tab switch at 390×844 on the
  SEEDED e2e.db), `calendar-mobile.spec.ts` (the s108 seeded-state
  calendar-grid guard — the FOURTH surface family: the KPI ladder +
  the DOW/month grids + the chip containment + the month-nav round-trip
  at 390×844 on the SEEDED e2e.db, incl. the NEW mainScrollW
  inner-overflow assertion), `activities-mobile.spec.ts` (the s109
  seeded-state activities guard — the FIFTH surface family, the LAST
  un-walked phone surface: the KPI ladder + the segmented tab strip
  with the Overdue-badge self-consistency + the priority-row/cluster
  containment [the M-109c1 guard] + the rail display:none below lg +
  the quick-log 2×2 wrap + the Completed-tab switch at 390×844 on the
  SEEDED e2e.db, incl. the mainScrollW inner-overflow assertion),
  `landing.spec.ts` (the s142 public landing walk — the marketing
  surface: the hero + the nav + the footer census),
  `marketing-mobile.spec.ts` (the s150 phone-width marketing walk —
  the 403-scroller model + the mobile census), `reset-password.spec.ts`
  (the s163 digma reset-funnel port — the 8-check battery: the token
  landing, the full reset round-trip, the version eviction), and session-12's custom-404 + session-15's entity-dialog geometry
  tests (stock Lead dialog at phone width, the Contact avatar section, the
  wide Event family with its blue submit) + session-16's responsive-layer
  tests (the contacts full-height root at 390, the settings picklist grid
  at tablet width, the calendar's split grids + bold title, the
  borderless accounts table card) in `crm.spec.ts`, and session-17's
  stock button/checkbox layer (the account trigger's ghost-Button
  construction + two-level avatar, the sidebar `users`/`circle-user`/
  `calendar` glyphs, the accounts tier filters' stock button checkboxes
  with the dark #171717 checked fill + Check indicator, the blue
  primaries' bare shadow scale), session-18's document-metadata
  layer (the reference meta description, the OG/Twitter card family, the
  favicon link, robots.txt's Sitemap line, the eleven-route sitemap.xml),
  and session-19's PWA + per-route metadata layer (the installable
  manifest.json, the #000000 theme-color + the apple/PWA metas, the
  resolving apple-touch-icon, per-route canonical/OG/Twitter on
  /accounts, the unprefixed root family, and the Contact dialog's
  type=tel phone + zero datalists + the exact avatar accept list), and
  session-23's tabs ARIA + keyboard layer (the wired trigger/panel ids
  on all three strips, all shells mounted with the inactive ones hidden
  + empty, the arrow-key model with wrap + Home/End + automatic
  activation, live-verified against the reference's Radix tabs), and
  session-25's loading + export-contract layer (the dashboard KPI cards
  visible immediately post-login with zero skeleton pass, the Reports
  header PDF downloading a real client-side `crm_reports_*.pdf`, the
  per-table Export PDF/CSV artifacts, the Save Custom Report View
  round-trip, and the period dropdown's 6-option vocabulary), and
  session-27's chart-internals + Account Health / calendar layer (the
  computed health-distribution PIE with its slice labels, the horizontal
  Top-10 with the $ axis, the red-tinted at-risk rows + red badges +
  the Nd-ago vocabulary, the outline-badge summary, the dashboard's
  Follow-up checkbox rows + static KPI sparklines, the calendar chip
  opening the Edit Event dialog, the single-blue by-type bars), and
  session-29's leads interactive layer (the inline Value/Status/Date
  editing round-trip with the overdue border + CircleAlert persisting
  across reload, the orange Target name box + the sticky thead + the
  dead Convert-to-Opportunity item, the "(Active)" suffix + the
  prompt-based Save View + the loadable Saved Views select), and
  session-30's photo-upload layer (the New Contact photo round-trip
  rendering + persisting with the remove X verified, and the profile
  photo round-trip with the toast + both avatar renders + the topbar
  pickup after the 500ms reload) (the s51-era snapshot — the complete
  live suite enumeration rides README's pinned list).

### Test Commands

```bash
bun run test                       # all unit suites
bunx vitest run tests/auth.test.ts # one suite
bun run build && bun run test:e2e  # E2E boots the standalone server on :3100
```

E2E uses an isolated scratch database (`db/e2e.db`) reseeded **in place** by
`tests/e2e/global-setup.ts`. Never delete that file between runs — a reused
server keeps reading the deleted inode and sees stale data.

### Coverage Targets

Unit coverage of the pure seams (`src/lib/*`) is the gate — every new pure
helper ships with tests. No hard percentage threshold; the count grows with
the seam (currently 2817).

## Code Quality Standards

### Linting & Formatting

```bash
bun run lint   # eslint . — 0 errors, 0 warnings before every commit
```

React-hooks rules that matter here (violations are errors):
`set-state-in-effect`, `refs` (no ref writes during render),
`rules-of-hooks`, `static-components` (no components created during render).

## Git & Version Control

### Branching Strategy

- `main` only — no feature branches. Small, atomic, directly committed.

### Commit Standards

- Conventional Commits with emoji prefixes: `:tada: feat:`, `:bug: fix:`,
  `:memo: docs:`, `:recycle: refactor:`.
- Never commit `.env`, `*.key`, `db/*.db`, `node_modules/`.
- Push via `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo>
  --remote git@github.com:nordeim/neo-crm.git` (runbook:
  `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`).

## Error Handling & Debugging

### Error Handling Approach

- Route handlers return typed errors through the envelope (`ERR.UNAUTHORIZED()`,
  `ERR.BAD_REQUEST(msg)`, `ERR.NOT_FOUND(what)`) — never throw across the
  boundary, never leak stack traces.
- The error-boundary family (session-170): `src/app/error.tsx` (the
  route-segment boundary — the house-styled card + the digest ref + the
  `reset()` Try-again) and `src/app/global-error.tsx` (the root boundary —
  own `<html>/<body>` + its own `globals.css` import, because a crashed
  root layout never loaded it). Both wire the stale-chunk self-heal
  (`src/lib/chunk-recovery.ts` — one guarded reload per 10s cooldown) and
  import NOTHING from the component tree beyond that seam — a resilience
  surface must not depend on the tree that might be broken.
- The boot gate (session-170): `src/instrumentation.ts` → `src/lib/boot-env.ts`
  — production AUTH_SECRET missing/short **fails hard at boot** (the
  server refuses to serve; the s169 first-session-op throw is the runtime
  backstop); the NEXT_PUBLIC_SITE_URL localhost misconfig + the NEO_*
  toggle family warn. Dev/test boot soft (the DEV fallback posture
  unchanged).
- Client actions surface failures via toasts (`toast.error(title, detail)`)
  and inline form alerts; the login card keeps its error state visible.
- Charts and lists render explicit empty states — never blank panels.

### Debugging Tools

- Dev server log: `dev.log` (tee'd by the `dev` script) — read the tail after
  any weirdness; Turbopack surfaces compile + runtime errors there.
- `agent-browser` (headless Chromium CLI) for reproducing UI issues at
  desktop/mobile widths without a display.
- E2E traces land in `test-results/*/trace.zip` — `bunx playwright show-trace`.

## Communication & Documentation

- Explain "why" in code comments only where the reason is not obvious
  (see `mobile-nav.tsx`, `db-path.ts` — they document the reference-app bug
  and the CLI-path rule respectively).
- `AGENTS.md` is the compact agent contract; this file is the full workflow
  reference; `Project_Architecture_Document.md` is the deep engineering
  blueprint. Keep all three in sync when architecture changes.

## Project-Specific Standards

### Architecture

- `(app)` route group: `src/app/(app)/layout.tsx` resolves the session
  server-side and redirects to `/login`; all authenticated pages live inside
  the group. `/login` and `/signup` sit outside it — and, since session-142,
  so does the PUBLIC landing page at `/` (the reference's marketing layer:
  its own root is public; post-login redirects to `/`, the "Open dashboard"
  CTA enters the CRM). The dashboard's canonical route is
  `(app)/dashboard/page.tsx` with the `/Dashboard` capital alias (s24).
- Client shell: `AppShell` (sidebar ≥lg, topbar, mobile drawer) wraps every
  authenticated page; `hydrate()` bootstraps the store once.

### API Design

- REST handlers under `src/app/api/**/route.ts`, all `force-dynamic`,
  session-gated via `requireSession()`.
- Envelope: `{ ok: true, data } | { ok: false, error: { code, message } }`.
- CSV export/import lives at `/api/export` + `src/lib/csv.ts`.

### Database / Data Layer

- Prisma + SQLite; schema at `prisma/schema.prisma`; `db push` (no
  migrations); seed is idempotent in place.
- Singleton client via `globalThis` in `src/lib/db.ts`; path resolution in
  `src/lib/db-path.ts` mirrors the Prisma CLI's schema-relative rule —
  including undoing bun's `.env`-relative absolutization of
  `DATABASE_URL` (see `runtimeDatabaseUrl()`) — and `db:push` goes through
  the `scripts/prisma-env.ts` wrapper so the CLI lands on the same
  `<repo>/db/custom.db` file.
- Models: User, Account, Contact, Lead, Activity, Event, Opportunity,
  SavedReport, Setting (singleton row) — 9 models.

### Environment Variables

| Variable               | Purpose                                  | Example                       |
| ---------------------- | ---------------------------------------- | ----------------------------- |
| `DATABASE_URL`         | SQLite file URL, schema-relative         | `file:../db/custom.db`        |
| `AUTH_SECRET`          | HMAC secret for session cookies (≥16ch)  | `openssl rand -hex 32`        |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin — metadata, robots.txt, sitemap.xml, OG/Twitter cards (consumed via `src/lib/site.ts`, inlined at build time) | `http://localhost:3000` |
| `NEO_PROXY_HOPS` | Declared proxy-topology trust depth for the rate-limit IP keying (unset = 1 — the last `x-forwarded-for` hop is the client; 0 = direct; N ≥ 2 = the Nth-from-last hop; unparsable fails CLOSED onto 1) | unset (`1`) |
| `NEO_DISABLE_IN_APP_OTP` | Signup/resend responses stop carrying the verification code — a deployment with a real mail transport sets `1` (ADR-014) | unset (in-app delivery) |
| `NEO_DISABLE_IN_APP_RESET` | Forgot-password responses stop carrying the reset link — same ADR-014 family | unset (in-app delivery) |

Currency DISPLAY is always `$`-attached, with three DOM-pinned per-page
variants: dashboard compact lowercase (`$337.0k` / `$1400.0k` — the
fixed `scale: "k"` formulas, NEVER the M form), accounts
`scale: "M"` (`$77.5M` / `$0.9M` at ANY magnitude), reports compact
UPPERCASE K (`$542.0K` won / `$196K` lost via `formatCompactCurrency`
options), leads FULL (`$687,000` via `formatCurrency`) — the reference
ignores its own Default Currency setting and so do we (the Settings
field still stores `AED`). Every reference currency figure rides a
LITERAL scale formula (session-32) — express them through the
`scale` option, never the magnitude-branching default. The reference's
dashboard filter-bar "Stage: Source" search input + its header "Add"
button are DEAD (session-33 bundle decode — no value/onChange, no
onClick; the same family as the s32 topbar search); ours stay the
functional supersets with the placeholder pinned as
`FILTER_BAR.searchPlaceholder` and the header trio's labels/classes as
the extended `DASHBOARD_HEADER` contract.

The standalone `server.js` chdirs into `.next/standalone` AFTER bun
already absolutized the relative `DATABASE_URL` against the LAUNCH
directory's .env — the seam now recognizes that signature too and
re-anchors on the schema rule (session-34), so `bun run start` from the
repo root opens `<repo>/db/custom.db` (3 new db-path pins; the e2e-style
override and the launch-from-standalone contexts are guarded unchanged).

## Anti-Patterns to Avoid

- **setState inside useEffect bodies** — use remount-via-key forms,
  adjust-during-render, or yield-before-setState patterns instead.
- **`tailwind.config.js`** — dead config in v4; tokens belong in `@theme`.
- **Deleting the SQLite file under a running server** — reseed in place.
- **Trusting bun's `DATABASE_URL` at face value** — bun absolutizes
  relative `file:` values from `.env` against the `.env` location (one dir
  outside the repo); always derive through `runtimeDatabaseUrl()`.
- **Weakening the mobile-navigation e2e suite** — it pins the app's headline
  fix over the reference app's defect.
- **Inventing status vocabularies** — extend the `*_META` maps in
  `src/lib/constants.ts`.
- **`window.location.href` for downloads** — every surface lands through
  the blob family in `src/lib/download.ts` (`downloadBlob`) or the
  fetch→blob round-trip (session-48 retired `downloadFile`: a non-200
  navigated the browser to the raw JSON envelope; the reports export now
  parses the envelope and toasts).
- **Censusing the db with a raw `new PrismaClient()`** — from the repo
  root a raw client opens the SANDBOX-ROOT mirror db, not the repo's
  (node resolves the relative `file:` URL against the process CWD; bun
  absolutizes it against the .env location — both land one directory
  outside the repo, and a SQLite engine opening a missing mirror path
  CREATES an empty db there). Session-53 proved it live: an intake
  census read the mirror and briefly read zombie-era probe data as
  repo-db residue. Always census through `bun run db:census` (the app's
  own singleton + the printed resolved path — a count without its path
  is not evidence).
