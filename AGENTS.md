# AGENTS.md — NEO CRM

Single Next.js 16 App Router app that clones the reference CRM workspace
(`https://neo-crm-8ab2c17c.base44.app/`): dashboard, accounts, contacts,
leads, calendar, activities, reports and settings, with Prisma/SQLite
persistence, scrypt + HMAC cookie auth, and a Zustand client store.
Clone remote: `https://github.com/nordeim/neo-crm.git`; pushes go to the SSH
remote via `docs/ssh_git_wrapper_v3.py`.

## Commands

| Task                             | Command                                |
| --------------------------------| ---------------------------------------|
| Install                         | `bun install`                          |
| Dev server (port 3000)          | `bun run dev`                          |
| Production build (standalone)   | `bun run build`                        |
| Production server               | `bun run start`                        |
| Lint                            | `bun run lint`                         |
| Type check                      | `bun run typecheck`                    |
| Unit tests (206 checks)         | `bun run test`                         |
| Browser E2E (28 checks)         | `bun run test:e2e` (needs build first) |
| Prisma client after schema edit | `bunx prisma generate`                 |
| Recreate DB from schema         | `bun run db:push`                      |
| Seed demo workspace             | `bun run db:seed`                      |

**Gate order before every push:** `bun run lint` → `bun run typecheck` →
`bun run test` (206) → `bun run build` → `bun run test:e2e` (28). There is no
hosted CI; the local gate is the only gate. `next.config.ts` sets
`ignoreBuildErrors` — the explicit `typecheck` step is what catches type
errors; never skip it.

First-run setup: `bun install && cp .env.example .env && bun run db:push &&
bun run db:seed && bun run dev`. Demo login: `sepnetflix2023@outlook.com` /
`$Abcd1234` (mirrors the reference app). **`.env` is untracked** — copy
`.env.example` and set `AUTH_SECRET` (`openssl rand -hex 32`).

## Architecture facts you would otherwise guess wrong

- **Auth is hand-rolled** (`src/lib/auth.ts`): scrypt password hashes
  (`scrypt:salt:hash`) + HMAC-SHA256 signed stateless cookie `neo_session`
  (7-day TTL). `requireSession()` + the `isGuarded()` narrowing helper guard
  every route handler; the `(app)` route-group layout redirects unauthenticated
  page visits. No NextAuth, no JWTs, no middleware/proxy. Login/signup are
  rate-limited 10 attempts/IP/15 min (`src/lib/rate-limit.ts`, per-process).
- **API envelope is `{ ok, data } | { ok, error: { code, message } }`** — build
  responses with `ok()` / `fail()` / `ERR.*` from `src/lib/api.ts`. The store's
  `call()` helper (`src/stores/crm-store.ts`) is the only sanctioned client.
- **All server state lives in one Zustand store** — no React Query, no SWR.
  `AppShell` calls `hydrate()` once on mount (resolves `/api/auth/me`, then
  fetches every slice). Actions call the API, then refresh affected slices.
- **`useEffect` never calls setState synchronously** (React 19 lint rule is an
  ERROR here). Patterns in use: dialogs remount their form via `key`
  (`entity-dialogs.tsx`) with `useState` initializers; the mobile nav closes on
  route change via adjust-during-render; debounced search yields with
  `await Promise.resolve()` before touching state. Follow them.
- **Tailwind CSS v4 is CSS-first** — all tokens are literal hex in the
  `@theme` block of `src/app/globals.css`. No `tailwind.config.js` (it would be
  ignored). `postcss.config.mjs` MUST keep the `@tailwindcss/postcss` plugin —
  without it `@theme`/`@utility` directives are never compiled and pages
  render unstyled (this exact bug shipped once; see
  `docs/Tailwind-V4-Validation-Report.md`). **v4 also renamed
  the shadow scale** (v3 `shadow-sm` -> v4 `shadow-xs`, v3 `shadow` -> v4
  `shadow-sm`), so the v4 default `shadow-sm` renders ONE STEP HEAVIER than
  the reference's `shadow-sm` (session-9 computed-probe fix): `@theme`
  re-pins `--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)` (pinned by
  `tests/design-tokens.test.ts`). Bare `shadow` (the Card family) matches
  both sides and is NOT overridden. **v4 renamed the blur scale the same
  way** (session-10): v4 `backdrop-blur-sm` compiled 8px where the
  reference's computes 4px — `@theme` re-pins `--blur-sm: 4px` (same test
  suite). **v4 also wraps `space-y-*` in `:where()` AND flips its
  semantics to margin-BOTTOM on `:not(:last-child)`** (session-11): the
  reference's login reset view ships `-mb-2` on its Back button, which
  under ITS v3-era space-y (margin-TOP on following siblings) computes a
  16px gap — but under our v4 a `-mb-2` (0,1,0) WINS the specificity
  fight against `:where(…)` (0,0,0) and produced an 8px OVERLAP. When
  mirroring negative margins that ride on space-y gaps, re-derive the
  class from the reference's COMPUTED gap (`mb-4` there), never copy the
  class string. The reference's global stylesheet also ships
  `button, [role="button"] { cursor: pointer; }` — mirrored in our base
  layer (ours computed the arrow cursor before session-10).
- **Stock-primitive inks (session-10)**: the reference's stock Input/Select
  carry `bg-transparent`, NO text color class (typed text inherits its
  `--foreground` #0a0a0a) and `placeholder:text-muted-foreground` #737373.
  Our tokens: `--color-ink` #0a0a0a (text-ink) + `--color-muted-ink` #737373
  (placeholder:text-muted-ink) — page-level text keeps `--color-foreground`
  #111827 (the reference's h1s/body use gray-900 there). The Select trigger
  is stock: `rounded-md`, no `gap-2`, transparent, NO base `w-full`
  (`w-full` is per-surface — 270px rails yes / 128px toolbars no, like the
  reference); the topbar search is the shared Input + `pl-10 bg-gray-50
  border-gray-200` (12px right padding, keyboard-only focus-visible).
- **`tw-animate-css` is vendored at `src/app/vendor/tw-animate.css`** — the
  npm package exposes only the `style` export condition, which Turbopack's CSS
  resolver does not support (`Can't resolve 'tw-animate-css'`). Import the
  local file; do not switch back to the package import.
- **SQLite path normalization** (`src/lib/db-path.ts`, pinned by
  `tests/db-path.test.ts`): relative `file:` URLs resolve against
  `prisma/schema.prisma` — the same rule as the Prisma CLI — so the CLI,
  `next dev`, and the standalone build all land on `<repo>/db/custom.db`
  regardless of the process working directory. Two hazards are handled
  there: (1) **bun rewrites relative `file:` DATABASE_URL values loaded
  from `.env` into absolute paths resolved against the `.env` file's own
  directory** — with the root contract `file:../db/custom.db` that is one
  directory OUTSIDE the repo; `runtimeDatabaseUrl()` detects exactly that
  signature and re-anchors on the schema rule. (2) First boot: validated
  anchors `mkdir -p` the `db/` folder instead of falling through to the
  raw relative URL. `db:push` routes through the `scripts/prisma-env.ts`
  wrapper so the Prisma CLI gets the same treatment. Always import `db`
  from `@/lib/db`; never construct `PrismaClient` directly.
- **Schema changes use `db push`, not migrations** (`prisma/migrations/` does
  not exist). `bun run db:seed` is idempotent — it wipes domain tables and
  reseeds IN PLACE (never delete the `.db` file itself; a running server keeps
  reading the deleted inode — this bit the e2e suite once).
- **The app shell is an `h-screen` flex row (session-7 reference model)** —
  the sidebar is an IN-FLOW `hidden md:flex w-64` child (visible from 768px,
  NOT lg — live-verified at 900/700px), the main column is
  `flex-1 flex flex-col overflow-hidden`, and `main.flex-1.overflow-auto`
  is the ONLY scroller (the window never scrolls — verified:
  mainScrollable=true, windowScrolls=false). All chrome contracts live in
  `src/lib/page-layout.ts` (`SHELL_LAYOUT`, `NAV_LAYOUT`, `TOPBAR_LAYOUT`,
  `LOGIN_LAYOUT`, `STAT_CARD`, …) and are pinned by
  `tests/page-layout.test.ts`.
- **The mobile navigation drawer is a deliberate fix** — the reference app
  ships no navigation below `md`. `src/components/layout/mobile-nav.tsx`
  covers `< md` only (the trigger and overlay are `md:hidden`): focus trap,
  Escape, dual scroll-lock (body + the `main` scroller), close-on-route-
  change, close-on-viewport-grow past `md` (`MOBILE_NAV_LAYOUT.autoCloseQuery`
  MUST stay at 768px — the same breakpoint as `md:hidden`; session-8 fixed a
  leftover 1024px listener that left the app scroll-locked after resizing
  past 768 with the drawer open), `inert` + `visibility:hidden` when
  closed. Session-12 fixed the focus-on-open race: the initial focus
  RETRIES across frames (bounded rAF loop verifying `activeElement`
  landed inside the panel) because the rAF can fire in the SAME frame
  as the `transition-[visibility]` class flip — before the browser
  applies the visible state — and `focus()` on a still-`visibility:
  hidden` element SILENTLY NO-OPS (keyboard users Tabbed through the
  background behind the aria-modal dialog). The panel also uses
  `h-dvh` (not `h-full`) so it tracks the dynamic viewport on mobile
  browsers. `tests/e2e/mobile-navigation.spec.ts` (7 checks, 390/700px
  viewports — the focus-entry test included) is the
  regression suite — do not weaken it.
- **File downloads use `downloadFile()`** (`src/lib/download.ts`) — a single
  centralized `window.location.href` for `Content-Disposition: attachment`
  responses. Next's `no-location-assign` lint rule fires on raw assignments;
  don't inline them again.
- **View switchers + the leads filter popover (session-8)**: the reference
  ships DEAD Table/Cards selects (dashboard filter bar — empty label;
  accounts toolbar — displays "Table") plus a dead Standard/Detailed select
  and More button on the accounts toolbar; ours keep the empty/label mirrors
  but switch for real (Recent Deals / accounts table ↔ card grids). The leads
  Filters control is a w-80 popover (Status [New/Contacted/Qualified/Won/
  Lost], Source [Call/Email/Website/Partner/Referral — 5 options, Referral is
  popover-only], Min Deal Value, Follow-up Date) whose Save View persists via
  the `src/lib/lead-filters.ts` encode/decode seam (localStorage key
  `neo-crm.leads.view`); Clear resets. The dashboard has NO owner filter —
  the old "All Owners" select was a misread of the empty switcher.
- **Component anatomy (session-9)**: button icons in TEXT buttons carry
  `mr-2` on top of the flex `gap-2` (a measured 16px icon-text gap;
  `BUTTON_BASE.iconGap` applies it via `[&_svg]:mr-2
  [&_svg:only-child]:mr-0`, so icon-only buttons stay unmarginated). Focus
  rings are 1px near-black (`ring-1 ring-ring`, `--color-ring: #0a0a0a`) on
  inputs, buttons and selects; tabs keep ring-2 + offset. Inputs are
  `text-base md:text-sm` (16px below md, matching the reference's phones).
  **CardTitle renders a `<div>`** (the reference has no card-heading
  semantics; the activities h2s and the calendar rail h3s are literal
  elements, and e2e card-title assertions use text locators). **Entity
  dialog submit buttons are DARK neutral-900** (`DIALOG_SUBMIT` - the
  reference's in-dialog `--primary` is stock shadcn dark rgb(23,23,23);
  header primary buttons stay blue-600). The settings page uses the PLAIN
  header variant (`PAGE_HEADER.settings` - a `mb-6` div with a
  non-responsive text-3xl h1); leads actions stack `flex-col sm:flex-row`
  with per-button `w-full sm:w-auto`; activities actions `flex-wrap`. The
  dashboard Recent Deals table mirrors the reference's EIGHT columns -
  "Status" appears TWICE (a visible quirk; quirk register) - and renders an
  empty tbody at zero rows. Empty states: dashboard lists `py-4 text-sm`,
  calendar/activities `py-8` (16px inherited), reports IN-TABLE rows with
  no vertical padding; reports table cards inset their tables (`p-6 pt-0`,
  `REPORTS_TABLE_CARD`). Top Performing Sales Reps is a DIV list
  (`TOP_REPS`), not a table. The profile card: default-size Upload Photo +
  stretched buttons, Avatar-primitive avatar with a stroke-2 user icon, and
  the raw lowercase role value.
- **Status vocabularies are distinct** — never mix them. Lead stages
  (incl. session-5's `unqualified` — dropped = `lost` + `unqualified` via
  `isDroppedStage()`), account statuses, activity types/statuses, event
  types (six — meeting/call/demo/task/reminder/appointment), contact
  priorities each have canonical label/color metadata in
  `src/lib/constants.ts` (`STAGE_META`, `ACCOUNT_STATUS_META`,
  `ACTIVITY_TYPE_META`, `EVENT_TYPE_META`, `PRIORITY_META`), plus the
  DOM-pinned source vocabularies (`LEAD_SOURCES` = Call/Email/Website/
  Partner; `CONTACT_SOURCES` = the five emoji "How did you meet?"
  options). Extend the meta maps when you extend a vocabulary.
- **Charts ship recharts DEFAULTS, no empty-state boxes (session-10
  reversal)** — the reference passes NO `content` to `<Tooltip>` (the stock
  `recharts-default-tooltip` white box), NO tick style (12px #666) and NO
  grid style (CartesianGrid dashed "3 3" #ccc with BOTH horizontal and
  vertical lines). Our custom ChartTooltip/AXIS_STYLE/solid grid and the
  session-1 `ChartEmpty` dashed placeholder boxes are ALL RETIRED: the
  reference renders the REAL chart at all-zero data (its persistent state
  since session 3) — fixed lists render ticks at zero (dashboard 5 stages +
  7-month revenue, reports tab-1 8 slugs, aging 4 buckets, activities 5
  types) while ROW-DERIVED series render empty (no ticks at zero; reports
  revenue/wonVsLost, the leads page wonVsLost, all tab 2-4 charts except
  aging). The split is DOM-verified and lives in
  `src/lib/reports-data.ts` (monthsFromEvents) + the routes. The Conversion
  Funnel is a recharts `FunnelChart` (4 trapezoid groups — FUNNEL_STAGES
  New/Qualified/Won/Lost, the funnel takes its own `data` prop with
  per-datum fills).
- **Reports pipeline vocabulary (session-10)**: tab-1 "Pipeline by Stage"
  ships the reference's 8 RAW SLUGS via `REPORTS_PIPELINE_SLUGS` +
  `reportsBucketCounts` (new/contacted/qualified/prospecting/qualification/
  proposal/negotiation/closed_won — the merged-list quirk: new≡prospecting
  and qualified≡qualification double-report, won maps to closed_won; labels
  are raw slugs, no title-casing). Tabs 2-4 mirror the reference's
  structure exactly (tab 2: Forecasting Accuracy wide chart + the centered
  `Average Accuracy: N%` caption, row-derived Pipeline by Stage, Forecast
  by Probability, the fixed 4-bucket Aging Pipeline, Open Deals by Stage +
  Deals at Risk tables with Export CSV/PDF buttons, NO KPI cards; tab 3:
  Activities by Type / Activities Over Time / Activities vs Wins charts +
  Overdue Activities + Activity Log by Owner (Owner/Activities); tab 4:
  Leads by Source / Win Rate by Source (%) / Avg Deal Value by Source
  charts + Leads List by Source + Source Performance Summary
  (Source/Leads/Won/Revenue)).
- **The login card has a reset-password flow (session-11)** — the
  reference's "Forgot password?" is NOT dead: it swaps the card IN PLACE
  (`signin → reset → sent`, URL unchanged; the reference's demo never
  sends an email — the confirmation is pure client state). The two views
  replace the login column entirely (no logo / Google button / divider),
  live in `src/lib/login-reset.ts` (`LOGIN_RESET_LAYOUT` +
  `nextLoginView()` + `canSubmitReset()`, pinned by
  `tests/login-reset.test.ts`), and the reset email input ships a
  LIGHTER placeholder than the sign-in fields (slate-400 vs slate-600 —
  the reference's own inconsistency, mirrored). The Back button's `mb-4`
  is the v4-correct expression of the reference's computed 16px gap (see
  the space-y hazard above).
- **Chart geometry is a per-surface contract (session-11)** —
  `CHART_GEOMETRY` in `src/lib/page-layout.ts`: dashboard + all reports
  tab charts render at **300px** (tab-2 Forecasting Accuracy is the full
  1142px-wide card), the leads rail charts at **250px**, the activities
  by-type at **150px**. The charts also ship the recharts DEFAULT
  `<Legend />` (plainline icons, series-colored text) — the custom
  circle-8px/gray legends are retired (same no-props rule as the s10
  tooltips).
- **Stat-card shadows + hover (session-11, revised session-12)** — every
  stat-card family carries bare `shadow` (`STAT_SHADOWS`): KpiCard,
  BarStatCard, TrendStatCard, IconStatCard (both variants) and
  CircleStatCard. The reference MOVED in session-12: its DASHBOARD KPI
  cards dropped the hover (now plain `rounded-xl border bg-card shadow`),
  so only the REPORTS KPI family (`CircleStatCard`,
  `STAT_CARD.reportsCard`) keeps `hover:shadow-md transition-shadow` —
  do not re-add the dashboard hover without re-probing the live app. The
  entity TABLE cards differ: accounts/leads `rounded-lg shadow` (no
  border) vs the contacts `rounded-xl border shadow-sm overflow-hidden`
  (the only tiny-shadow table card — `TABLE_SHADOWS`).
- **The border-color split (session-12)** — the reference renders TWO
  border grays and `--color-line` is NOT gray-200: the platform DEFAULT
  is **#e5e5e5** (neutral-200) and rides every bare-`border` surface
  (ALL stock cards, table rows, the tablists, outline buttons, select
  triggers/contents, dropdowns, dialog content, bare form inputs);
  the EXPLICIT `border-gray-200` family (#e5e7eb) covers only the
  reports KPI cards, the reports sticky filter card, the contacts table
  card (`border-line-strong`) and the topbar search input (literal
  `border-gray-200`). Login keeps its own slate-200 family. Pinned by
  `tests/design-tokens.test.ts`; the reference MOVING means computed
  border colors must be re-probed per surface, never assumed.
- **The tab strips ship stock Radix classes (session-12)** —
  `TABS_PILL`/`TABS_SEGMENTED` in `src/lib/page-layout.ts`: the TRACK
  carries `text-muted-ink` (inactive tabs INHERIT #737373), triggers
  are natural-height (no h-7), `transition-all`, `ring-offset-background`
  with `data-[state=active]:*` variants riding a `data-state` attribute,
  the ACTIVE pill carries the bare `shadow` scale (not shadow-sm), the
  pill trigger is `text-xs sm:text-sm`, and NO tab ships hover classes.
  The reference's own tabs are all `tabIndex=-1` (keyboard-unreachable
  platform defect) — our roving tabindex is the deliberate accessible
  fix (mobile-nav precedent).
- **The 404 page is a designed surface (session-12)** —
  `src/app/not-found.tsx` (server, ABSOLUTE title "This Page Does Not
  Exist | NEO CRM" — the root template would double the suffix) +
  `not-found-body.tsx` (client, `usePathname()` for the quoted-path
  message). `NOT_FOUND_LAYOUT`: bg-slate-50 center, `text-7xl
  font-light text-slate-300` 404 + a `h-0.5 w-16 bg-slate-200` divider
  bar, the h2+p in their own `space-y-3` group with the pathname in a
  `font-medium text-slate-700` span, and the Go Home pill in a `pt-6`
  group. No app shell. (VLM round-1 caught the divider + span + group
  split that the first DOM extraction missed — capture ALL children,
  not just the headings.)
- **The KPI sparklines are recharts (session-12)** — `Sparkline` in
  `page-parts.tsx` renders `LineChart`/`AreaChart` with
  `type="monotone"` inside a `ResponsiveContainer` (line: strokeWidth 2,
  dot false; area: fillOpacity 0.3 + strokeWidth 1; stock 5px margins).
  Dashboard sparks sit in `mt-2 h-8` (32px); reports sparks in the
  `flex items-end justify-between mt-2` row's `flex-1 h-12 mr-2` slot
  capped `max-w-[176px]`. The reports LOST DEALS card ships NO spark
  (`KPI_SPARK.lostDealsSpark`). The stat-card icon chips are SOLID
  color-50s (`KPI_CHIP_BG`), not alpha tints.
- **The reports tabs are NOT card-wrapped (session-11)** — the pill tab
  bar + panels render bare in the page (a `space-y-6` container directly
  under the KPI row; tab content spans the full 1192px at 1512). Every
  reports tab grid is `gap-6` (charts 2-col on tab 1, 3-col on tabs 2–4,
  tables 2-col) and the tab bodies are `space-y-6`. The sticky filter
  card above the KPI row is a separate element and stays.
- **The contacts page is the reference's only full-height layout
  (session-11)** — `CONTACTS_LAYOUT`: `main > flex h-[calc(100vh-64px)] >
  flex-1 overflow-auto > p-8 > content`. The calc's 64px is 5px short of
  the real 69px topbar (a reference quirk mirrored verbatim — main
  overflows 5px); the padding is p-8 at ALL widths (32px at 390px where
  every other page ships p-4 sm:p-8 = 16px).
- **Per-page document titles (session-10)** — the reference titles every
  non-dashboard page "X | NEO CRM" (dashboard + login stay "NEO CRM").
  Implemented with thin SERVER `page.tsx` wrappers + renamed client parts
  (`*-page.tsx`) — the (app) pages are client components and cannot export
  metadata; a per-route `layout.tsx` approach hit a Next 16 typed-routes
  generation bug, use the wrapper pattern.
- **Chart colors are DOM-pinned, not aesthetic** — `tests/constants.test.ts`
  freezes the palette against the live reference: pipeline stage hex (Proposal
  = yellow `#eab308`, Won = grey `#9ca3af` — chart hex only, badges stay
  emerald) and the tailwind **-400 bar family** (`blue400 #60a5fa`,
  `green400 #4ade80`, `cyan400 #22d3ee`, `purple400 #c084fc`, `red400
  #f87171`, `amber400 #fbbf24`) used by stat-card mini bars. Sparkline lines
  on the dashboard are `#10b981`. Re-extract from the reference before
  changing any of these — do not "fix" the tests to match the code.
- **Stat-card families, never mixed** (session-5 refinements): the dashboard
  `KpiCard` (label / value + optional `text-xs` suffix span + inline delta /
  sparkline below); `BarStatCard` (accounts `w-24` / activities `w-20` bars,
  header deltas ONLY for the green % + red "Xh overdue", everything else as
  gray `mt-1` subtexts under the value); `IconStatCard` with two variants —
  `contacts` (gradient, p-6, text-3xl, solid -500 chip) and `leads`
  (p-4 sm:p-6, text-xl sm:text-2xl, tinted square chip, no hover); reports'
  `CircleStatCard` (square `rounded-lg` tinted chip, count + amount inline
  in one `text-2xl font-bold` value — the only card with a hover shadow).
- **Sort icons**: inactive sortable headers show `ArrowUpDown` (h-4); the
  active sort column shows a directional `ChevronDown/Up`. Sortability is
  per-table (leads: Lead Name/Email/Value; contacts: Last Activity only;
  accounts: none) — mirror the reference, don't add sort headers it doesn't
  ship.
- **Entity tables use the stock density** (`src/components/ui/table.tsx`):
  th `h-10 px-2` (size inherited from the table's `text-sm`), td `p-2` —
  NOT px-4/py-3. Per-page overlays: contacts headers are
  `font-semibold text-gray-700` with a `w-64 cursor-pointer` Name column
  (dead affordance mirrored from the reference); accounts + leads table
  cards are `rounded-lg border-0 shadow` (no border) while contacts keeps
  the bordered `rounded-xl` wrapper with `overflow-hidden`. Empty states
  render as in-table centered rows (`TableEmptyRow`: py-8 accounts/leads,
  py-12 contacts). The leads table hides columns progressively (Phone
  `hidden md:table-cell`, Company `hidden lg:table-cell`, Source `hidden
  xl:table-cell`). The dashboard Recent Deals is a separate COMPACT table
  (`py-2` cells, tr `text-xs text-muted`, trailing `w-8` th) — do not
  convert it to the shared Table.
- **Dialog contract (session-5)**: CREATE dialogs mirror the reference's
  field sets exactly (Lead: Name*/Email/Phone/Company/Estimated Value/
  Status [New/Contacted/Qualified/Unqualified]/Source [Call/Email/Website/
  Partner] — no dates; Account: 8 fields ending at Status; Contact:
  required Email + "How did you meet?" [the five emoji sources] — no
  Priority; Event: Related To [None/Contact/Account/Opportunity/Lead];
  Activity: Related To (Type) + freeform (Name) — no Status select).
  EDIT dialogs keep our full superset (dates, all stages, Tier/Owner/
  Priority) — the reference's edit surfaces are unverifiable at zero data.
  All single-column, `max-w-lg`.
- **Currency display is `$`-attached with per-page variants**
  (`src/lib/format.ts`, pinned by `tests/format.test.ts`): the dashboard
  renders the lowercase compact form — `formatCompactCurrency` → `$145.0k` /
  `$1.4M`; the REPORTS page renders the uppercase-K variant —
  `formatCompactCurrency(v, { upper: true })` → `$542.0K` (won, one
  decimal) and `{ upper: true, decimals: 0 }` → `$196K` (lost); the LEADS
  page renders the FULL form — `formatCurrency` → `$687,000`. All three
  were DOM-verified against the reference's zero-state KPIs (it prints
  `$0.0k` on the dashboard, `$0.0K`/`$0K` on reports, `$0` on leads).
- **Pure domain seams are unit-tested** (`src/lib/db-path.ts`, `auth.ts`,
  `format.ts`, `csv.ts`, `rate-limit.ts`, `lead-filters.ts`,
  `reports-data.ts` (session-10: agingCounts, forecastAccuracySeries,
  monthsFromEvents), `avatar` helpers,
  the chart palette (`constants.test.ts`), the dialog/filter vocabularies,
  the layout+chrome contracts (`tests/page-layout.test.ts`, 58 pins across
  sessions 6–8 + session-10's stock-primitive pins) — 169 Vitest checks).
  Route handlers and pages import these modules; don't inline their logic.
  E2E uses its own scratch database (`db/e2e.db` via
  `tests/e2e/global-setup.ts`, in-place reseed) on port 3100 against the
  standalone build.

## Conventions that differ from defaults

- TypeScript strict **except `noImplicitAny: false`** (sandbox default, kept).
- Validation is hand-rolled in route handlers (trim, length caps, enum
  membership, referential checks via `asString`/`asNumber`/`asDate` in
  `src/lib/api.ts`). No schema library — zod was deliberately pruned.
- Charts are recharts with empty-state fallbacks (`src/components/charts/`);
  every chart must render a friendly placeholder when its data is all-zero.
- Icons are lucide-react. Session-7 re-pin: sidebar nav icons are
  uniform `h-5 w-5` stroke-2 (no active/inactive stroke variation), as are
  the topbar mail/bell and search icons; content icons stay `h-4 w-4`.
- Delta texts are `text-green-600` / `text-red-600` (live-computed probes,
  session-7) — not the `success`/`danger` tokens (those stay on badges).
- z-index stays on the flat scale: topbar z-40, drawer/dialogs z-50, dropdown
  portals z-[60], toasts z-[100]. No ad-hoc `z-[9999]`.
- ESLint ignores `skills/` (the operator's skill catalog, not app code) plus
  build output dirs — don't remove those ignores.

## Git

- **`main` only.** No feature branches.
- Conventional Commits with emoji prefixes: `:tada: feat: …`, `:memo: docs: …`,
  `:bug: fix: …`.
- Never commit `.env`, `*.key`, `db/*.db`, or `node_modules/` (all gitignored;
  `.env` was untracked from the scaffold's initial commit deliberately).
- Push through the SSH wrapper from the repo root:
  `PATH="/path/to/ssh-shim-dir:$PATH" python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo> --remote git@github.com:nordeim/neo-crm.git`
  — runbook: `docs/how-to-git-push-using-ssh-wrapper_SKILL.md` (the wrapper
  preflights for an `ssh` binary; sandboxes without one deploy the Appendix A
  paramiko shim on PATH first).
