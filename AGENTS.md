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
| Unit tests (1194 checks)        | `bun run test`                         |
| Browser E2E (112 checks)        | `bun run test:e2e` (needs build first) |
| DB census (path + counts)       | `bun run db:census`                    |
| The full gate in one command    | `bun run gate`                         |
| Prisma client after schema edit | `bunx prisma generate`                 |
| Recreate DB from schema         | `bun run db:push`                      |
| Seed demo workspace             | `bun run db:seed`                      |

**Gate order before every push:** `bun run lint` → `bun run typecheck` →
`bun run test` (1194) → `bun run build` → `bun run test:e2e` (112) — or the
one-command `bun run gate` (session-38: the same chain as a package
script, so the build always precedes the e2e boot; session-39: the e2e
step runs under `CI=1`, so `reuseExistingServer` evaluates false and the
gate ALWAYS boots the just-built server — chaining the build alone did
NOT close the stale-server hazard, because a leftover :3100 listener
was reused regardless of build timing). There is no
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
  class string. **Session-14 found the same flip's second face: when the
  space-y container's non-last child is an INLINE element (a bare
  `<label>`), v4's margin-BOTTOM lands on an inline box — vertical
  margins on inline elements DO NOT APPLY, so the label→control gap
  silently collapses (measured 3px where the reference computes 12px via
  its v3 margin-TOP-on-the-control semantics). Fix pattern: keep the
  literal `space-y-2` group class for parity, add an explicit `mt-2` on
  every block-level control (`SETTINGS_DEFAULTS.controlMt` /
  `SETTINGS_DANGER.controlMt`) — the reference's label-top-to-control-top
  distance is 28px on both apps after the fix. The reference's global stylesheet also ships
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
  mainScrollable=true, windowScrolls=false). **Session-16: there is NO
  shell-level padding wrapper** — every PAGE owns its padding
  (`PAGE_ROOT.standard` = `p-4 sm:p-8 bg-background min-h-screen` on the
  dashboard/accounts/calendar/activities/reports/settings; `PAGE_ROOT.bare`
  = `p-4 sm:p-8` on Leads + Profile, the reference's own quirk; Contacts
  ships `CONTACTS_LAYOUT.fullHeight` as its root directly — a blanket shell
  wrapper double-padded the h-calc box: 358px wide at 390 instead of 390,
  the table card 294px instead of 326px, main scrolling 37px instead of
  the 5px mirrored topbar quirk). All chrome contracts live in
  `src/lib/page-layout.ts` (`SHELL_LAYOUT`, `PAGE_ROOT`, `NAV_LAYOUT`,
  `TOPBAR_LAYOUT`, `LOGIN_LAYOUT`, `STAT_CARD`, …) and are pinned by
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
- **File downloads are blob-based** (`src/lib/download.ts`'s
  `downloadBlob` — session-48 retired the `downloadFile`
  `window.location.href` seam: a non-200 navigated the browser to the
  raw JSON envelope). Client-side artifacts build a Blob directly;
  server artifacts round-trip through a fetch that parses the error
  envelope and toasts instead of navigating. Don't inline raw
  location assignments for downloads.
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
  (incl. session-5's `unqualified` — the leads KPI's "Dropped Deals"
  counts `lost` STRICTLY, `unqualified` is NOT dropped; the s5
  `isDroppedStage` helper that said otherwise retired session-54),
  account statuses, activity types/statuses, event types (six —
  meeting/call/demo/task/reminder/appointment), contact priorities each
  have canonical label/color metadata in `src/lib/constants.ts`
  (`STAGE_META`, `ACCOUNT_STATUS_META`, `ACTIVITY_TYPE_META`,
  `EVENT_TYPE_META`, `CONTACT_PRIORITY_META` — the Key/Standard/At Risk
  set + badge map; the pre-s28 `PRIORITY_META` hot/warm/cold badge map
  retired session-54), plus the DOM-pinned source vocabularies the
  dialogs consume: `LEAD_SOURCE_OPTIONS` (Call/Email/Website/Partner —
  the raw values with capitalized labels) and `CONTACT_SOURCE_OPTIONS`
  (the five emoji "How did you meet?" options). Extend the meta maps
  when you extend a vocabulary.
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
- **Entity tables use the stock density + stock strings (session-16)**
  (`src/components/ui/table.tsx`): the container is the stock
  `relative w-full overflow-auto` (NOT overflow-x-auto + scrollbar-thin),
  th `h-10 px-2` + the stock checkbox variant classes, td `p-2` + the
  same variants, tr `hover:bg-line-soft/50
  data-[state=selected]:bg-line-soft` (the reference's `hover:bg-muted/50`
  — its muted SURFACE is our line-soft #f5f5f5; ours shipped /60 opacity
  + no selected state). The reference's platform ALSO resets
  `th, td { padding: 1px }` globally — mirrored in our base layer;
  utility classes override it, so it only fills the unclassed axes
  (standard th compute 1px vertical → 43px header rows; the dashboard
  compact th compute `8px 1px`). Per-page overlays: contacts headers are
  `font-semibold text-gray-700` with a `w-64 cursor-pointer` Name column
  (dead affordance mirrored from the reference); accounts + leads +
  activities table cards and the activities timeline are the BORDERLESS
  `bg-surface rounded-lg shadow [p-6]` PLAIN DIVS (session-16: the Card
  primitive's `border border-line` LEAKS through `cn()` — tailwind-merge
  only replaces same-property classes — so TABLE_CARD surfaces NEVER
  render via Card) while contacts keeps the bordered `rounded-xl` wrapper
  with `overflow-hidden`. Empty states
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
  sessions 6–8 + session-10's stock-primitive pins) — 596 Vitest checks across
  38 suites (session-13 added `tests/page-titles.test.ts` for the auth
  absolute titles and `tests/charts-contracts.test.ts` for the grid dashes +
  funnel type; session-14 added `tests/profile-route.test.ts` for the
  `/Profile` casing alias; session-15 added the 18-check DIALOG_FAMILY layer
  — the stock chrome + the per-dialog body contracts + the
  no-description/no-placeholder source rules; session-16 added the
  PAGE_ROOT + page-root-source + table-kit-stock + TABLE_CARD-plain-div +
  CALENDAR_CARD + SETTINGS_GRID pins + the design-tokens th/td reset;
  session-17 added the stock button/checkbox layer — the account-trigger
  ghost-Button + two-level-avatar pins, the nav-config glyph pins, the
  FilterPolygon polygon source pin + page rules, the icon-swap source
  rules, the CHECKBOX contract + label.tsx button-primitive rule + the
  call-site onCheckedChange rule, and the default-variant bare-shadow +
  ghost no-text-color pins; session-18 added `tests/metadata.test.ts` for
  the site seam + the head family; session-19 added
  `tests/pwa-metadata.test.ts` for the manifest/PWA/per-route factory
  pins; session-20 added `tests/http-headers.test.ts` for the
  security-header set + the static-file content-type pins; session-21
  added `tests/login-views.test.ts` for the login-card funnel — the
  auth error strings, the Callout vocabulary, the signup/verify view
  machines and layouts, and the verification-ladder messages; session-22
  added `tests/typography.test.ts` for the zero-webfont base — the
  Inter-webfont retirement, the exact reference `--font-sans` stack pin,
  the smoothing/selection retirements).
  Route handlers and pages import these modules; don't inline their logic.
  E2E uses its own scratch database (`db/e2e.db` via
  `tests/e2e/global-setup.ts`, in-place reseed) on port 3100 against the
  standalone build. `bun run build` = `next build` + `cp -r .next/static
  .next/standalone/.next/` + `cp -r public .next/standalone/` — running
  `next build` bare leaves the standalone server WITHOUT static chunks
  (every /_next/static request 404s and the pages never hydrate); always
  use the package script.

- **The chart grids are DASHED by an explicit prop, not by recharts
  defaults (session-13 CORRECTION)** — the reference passes
  `strokeDasharray="3 3"` on `#ccc` grid lines on EVERY gridded chart
  (dashboard Sales Pipeline/Revenue, reports tab-1 all four incl. the
  funnel, leads Pipeline/Won-vs-Lost). The session-10 note "the
  CartesianGrid at the default DASHED 3 3" was a misread — recharts'
  default grid is SOLID. `charts.tsx` now sets `strokeDasharray="3 3"`
  explicitly on `PipelineBarChart`, `RevenueLineChart`, `WonLostLineChart`
  and the new `FunnelBarChart`; pinned by
  `tests/charts-contracts.test.ts`.
- **The reports "Conversion Funnel" is a horizontal BAR chart
  (session-13)** — NOT a recharts FunnelChart: `FunnelBarChart` renders
  `BarChart layout="vertical"` 534×300, dashed grid, numeric X, category
  Y with the EIGHT raw slugs (`new/contacted/qualified/prospecting/
  qualification/proposal/negotiation/closed_won` = the
  `REPORTS_PIPELINE_SLUGS` quirk register), fed by the `pipeline` seam.
  The LEADS page funnel stays a FunnelChart (unverifiable at zero data —
  the reference's leads funnel renders NOTHING at zero).
- **Button radius is rounded-md everywhere (session-13)** — the
  reference ships 6px corners on EVERY button surface (default, sm, icon,
  dialog, profile); the Button base + lg are `rounded-md` (only the login
  submit keeps its own rounded-xl slate family). Calendar day cells stay
  `rounded-lg` (8px) — that is a div/cell family, not a button family.
- **CardTitle is a per-page map (session-13)** — `CARD.title` = the STOCK
  `font-semibold leading-none tracking-tight` (16px at the 16px base);
  overrides: dashboard (6) + leads (3) `text-base sm:text-lg`, the
  accounts/activities/calendar filter rails + the activities by-type
  title `text-base`, settings (5) `text-lg`, reports + profile ride the
  stock default. The BASE font-size is 16px (a session-13 re-pin — 14px
  was a scaffold-era assumption, the reference's body is 16px).
- **The default foreground token is #0a0a0a (session-13)** —
  `--color-foreground` flipped from #111827; page h1s are EXPLICIT
  `text-gray-900`; the KPI value drops `leading-none tracking-tight`
  (line-height 36px / letter-spacing normal at 30px text-3xl — real
  computed diffs the reference showed).
- **The topbar account menu is a stock Radix DropdownMenu (session-13)**
  — `role=menu` + menuitems (was a Popover role=dialog): z-50
  rounded-md shadow-md content, items `relative flex cursor-default
  select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm
  outline-none transition-colors focus:bg-accent
  focus:text-accent-foreground` with Profile + Logout; the stock Menu
  primitives live in `src/components/ui/dropdown.tsx`.
- **The auth pages use ABSOLUTE titles (session-13)** — `/login` and
  `/signup` had RELATIVE titles that the root `"%s | NEO CRM"` template
  DOUBLED (`NEO CRM | NEO CRM` in the raw SSR HTML); both now ship
  `title: { absolute: … }` (same class as the session-12 404 fix);
  pinned by `tests/page-titles.test.ts`.
- **The profile page is the reference's neutral family (session-13)** —
  `PROFILE_LAYOUT`: root `p-4 sm:p-8`, header `mb-6 sm:mb-8` with h1
  `text-2xl sm:text-3xl font-bold text-gray-900`; the disabled email/role
  inputs carry `bg-gray-50` and the role input `capitalize` ("user"
  renders "User"); the role badge is the STOCK Badge pattern
  (`rounded-md px-2.5 py-0.5 text-xs font-semibold shadow
  transition-colors`) on the NEUTRAL family (`bg-neutral-900
  text-neutral-50`) because the reference's profile page primary is
  #171717 (not its own blue); Save Changes = default Button
  (`w-full sm:w-auto`), Upload Photo = outline with the camera icon
  `w-4 h-4 mr-2` on the svg itself.
- **The activities by-type card is complete (session-13)** — the
  FILTER_RAIL header (`flex flex-col space-y-1.5 p-6 pb-3`) with the
  title row (`text-base` CardTitle + a BARE ••• `text-gray-400
  hover:text-gray-600`), the STATIC subtitle "Last 2 days" INSIDE the
  header (the range combobox does not change it), a chips row (`flex
  flex-wrap gap-3 mt-4`: five `w-3 h-3 rounded` inline-bg swatches +
  `text-xs text-gray-600` labels) and a `mt-4 pt-4 border-t` footer with
  the stock checkbox + "Activities" label + •••. Series colors:
  Call #3b82f6, Email #8b5cf6, Meeting #f59e0b, Task #10b981, Note
  #14b8a6 (blue/violet/amber/emerald/teal).
- **Calendar out-of-month cells keep their border (session-13)** — the
  day cells ship `border` (default #e5e5e5) in ALL three states with
  `bg-gray-50 text-gray-400 transition-all` out-of-month, `bg-white
  hover:bg-gray-50` current, `bg-blue-600 text-white border-blue-600`
  today; cells stay BUTTONS (our clickable superset — the reference's
  are divs); "Agenda View" carries `mb-4`.
- **The avg-cycle KPI carries NO delta (session-13)** — the reference's
  card is value + unit only (its other cards DO render deltas at zero,
  so this was a real structural diff, not a data artifact).
- **The Label is stock shadcn (session-13)** — `text-sm font-medium
  leading-none` (14px; was a 12px custom), the DialogTitle stock
  `text-lg font-semibold leading-none tracking-tight`.
- **The settings Defaults tab is a single column (session-14)** — the
  reference's "Default Values" card: body `p-6 pt-0 space-y-4`, six
  `space-y-2` groups, STOCK CardTitle, subtitle `text-sm text-muted-ink`
  (14px/#737373 — the stock CardDescription family), four stock Inputs +
  two w-full select triggers (`SETTINGS_DEFAULTS`). Ours had shipped a
  responsive 3-column grid with `grid gap-1.5` groups and the settings
  text-lg title — the s13 "settings (5) text-lg" pin covered ONLY the CRM
  Configuration tab's five picklist cards.
- **The settings Data tab + Danger Zone (session-14)** — the template card
  is titled "Import Templates"; both list bodies are VERTICAL `space-y-2`
  stacks of stock outline default-size buttons (`w-full sm:w-auto`,
  download icon `w-4 h-4`); the Danger Zone is the TINTED surface
  (`border-red-200 bg-red-50`, circle-alert `w-5 w-5` title on
  text-red-700, body `space-y-4` with the `max-w-xs` confirm input then
  the destructive button below — #fafafa foreground, no warning
  paragraph) (`SETTINGS_DATA` / `SETTINGS_DANGER`).
- **`/Profile` is a thin alias route (session-14)** — the reference serves
  BOTH casings (its account menu links to `/Profile`); ours keeps the
  canonical lowercase `(app)/profile` and aliases the capital casing via
  `src/app/Profile/page.tsx` (a `redirect("/profile")` server component
  outside the (app) group). Do NOT convert it to a next.config.ts
  redirect: Next matches config redirects CASE-INSENSITIVELY, so the rule
  matches its own destination and loops (ERR_TOO_MANY_REDIRECTS), and
  `caseSensitive` is not a valid per-redirect property in Next 16
  ("Invalid redirect found"). Pinned by `tests/profile-route.test.ts`.
- **`--color-line-soft` is #f5f5f5 (session-14)** — the reference's
  muted/accent family (computed live on the segmented tab tracks + a
  bg-accent probe, both rgb(245,245,245)); the scaffold-era #f3f4f6
  (gray-100) was never live-pinned. The token rides every muted/accent
  role surface: tab tracks, outline/ghost hovers, select/menu focus
  washes, row hovers, count badges.
- **The reference REMOVED its signup flow (session-14 drift)** — its
  login "Need an account? Sign up" button no longer navigates and
  `/signup` renders the 404 view (SSR title still "Signup | NEO CRM");
  our working `/signup` stays the documented functional superset (the
  dead-exports precedent). The reference also logs out to `/` as
  "Hi, Guest" without redirecting to /login (ours redirects — the safer
  behavior, documented).
- **The entity-dialog chrome is STOCK shadcn (session-15)** — all five
  reference create dialogs were fully mapped (outerHTML + computed
  probes at 1512/390): `DialogContent` ships `w-full max-w-lg
  sm:rounded-lg shadow-lg` + the four `slide-in/out` animations (ours
  had rounded-2xl/shadow-xl/w-[calc(100vw-2rem)] and NO slides);
  computed 8px radius at ≥sm and **0 below 640, FULL-BLEED 390px on
  phones** (not a 2rem inset); the overlay is the stock `bg-black/80`
  fade (NO backdrop blur — our gray-900/45 + blur wash retired); the
  header is `flex flex-col space-y-1.5 text-center sm:text-left`
  (CENTERED title below sm); the close X is the stock opacity-70
  pattern. Contracts: `DIALOG_CONTENT`/`DIALOG_OVERLAY`/
  `DIALOG_HEADER`/`DIALOG_CLOSE` in `src/lib/page-layout.ts`.
- **The entity dialogs ship NO description and NO placeholders
  (session-15)** — the reference's create dialogs render ONLY the h2
  (zero `<p>` elements, zero placeholder attributes in all five
  dumps). Ours had invented descriptions + placeholders on every
  dialog — all removed (`entity-dialogs.tsx` renders neither; the
  contacts scan-card superset keeps its description, the
  dead-exports precedent).
- **Two dialog BODY families + two footer families (session-15)** —
  the max-w-lg family (Lead/Account/Contact) wraps fields in a `py-4`
  grid INSIDE the form with `space-y-2` groups (the s14 controlMt
  fix — 12px label→control gap / 28px top-to-top on both apps); Lead
  pairs Status+Source in a `grid grid-cols-2 gap-4` (162px cells even
  at 390), Account's WHOLE body is `grid grid-cols-2 gap-4 py-4`
  (Name/Industry, Email/Phone, Website/Revenue, Employees/Status),
  Contact ships the AVATAR SECTION (`flex flex-col items-center gap-4
  pb-4 border-b`: w-24 h-24 gradient circle from-blue-500 to-blue-700
  with live-initials span, the w-8 h-8 camera button + hidden file
  input, and the Name field INSIDE the section) + `space-y-4` pair
  groups on a `grid gap-6 py-4` body; the max-w-2xl family
  (Event/Activity at 672px) uses `form.space-y-4` with BARE unclassed
  field divs (4px natural label gap — no space-y, no mt) and
  grid-cols-2 pairs (Event's Related To sits ALONE in a grid-cols-2,
  second cell empty — a mirrored quirk; Activity pairs
  Type+DateTime and RelatedType+RelatedName). Footers: the max-w-lg
  family ships the stock `flex flex-col-reverse sm:flex-row
  sm:justify-end sm:space-x-2` (buttons TOUCH when stacked — no gap
  class), the wide family `flex justify-end gap-3 pt-4`. Contracts:
  `DIALOG_GROUP`/`DIALOG_BARE_GROUP`/`DIALOG_FIELDS_WRAPPER`/
  `LEAD_DIALOG`/`ACCOUNT_DIALOG`/`CONTACT_DIALOG`/`CONTACT_AVATAR`/
  `EVENT_DIALOG`/`ACTIVITY_DIALOG`/`DIALOG_FOOTER`/
  `DIALOG_FOOTER_WIDE`.
- **The Event dialog's submit is BLUE (session-15)** — the reference
  ships `bg-blue-600 hover:bg-blue-700` on New Event (every other
  dialog is the dark stock primary). **v4 HAZARD: the LITERAL
  `bg-blue-600` class compiles to v4's oklch default which computes
  rgb(21,93,252) — a DIFFERENT blue than the reference's v3 #2563eb.**
  The computed-equal expression is the `--primary`/`--primary-hover`
  TOKEN pair (#2563eb/#1d4ed8 — exactly the reference's v3 blue-600/
  blue-700); never use the literal palette class for the reference's
  blues (`EVENT_DIALOG.submit`).
- **The page-root model (session-16)** — every page owns its padding:
  `PAGE_ROOT.standard` (`p-4 sm:p-8 bg-background min-h-screen`) on the
  dashboard/accounts/calendar/activities/reports/settings,
  `PAGE_ROOT.bare` (`p-4 sm:p-8`) on Leads + Profile (the reference
  drops the bg + min-height on exactly those two — main's own bg fills
  the gap), and `CONTACTS_LAYOUT.fullHeight` as the Contacts root
  DIRECTLY under `main` (padding inside its `flex-1 overflow-auto > p-8`
  scroller; the h-calc box is full-width — a blanket shell wrapper had
  double-padded it to 358px at 390 with a 294px card and 37px of main
  scroll; the fix restores the full 390px + 326px card + the 5px
  mirrored topbar quirk).
- **The settings picklist grid breaks at md (session-16)** —
  `SETTINGS_GRID` = `grid grid-cols-1 md:grid-cols-2 gap-4` (2 columns
  from 768px; ours had shipped `lg:grid-cols-2`, rendering ONE 580px
  column at 768-1023px where the reference renders two 282px cards — a
  mid-width-only divergence invisible to the standing 390/1512 probe
  widths; always sweep at least one MID width).
- **The calendar card is the flat anatomy (session-16)** — `CALENDAR_CARD`:
  padding ON the card (`mb-6 p-4 sm:p-6`), THREE direct children — the
  header row `flex items-center justify-between mb-6` with the h2
  `text-xl sm:text-2xl font-bold text-gray-900` + the `flex gap-2` nav
  (Today hidden below sm), the DOW grid `grid grid-cols-7 gap-1
  sm:gap-2 mb-2` with seven `text-center text-xs sm:text-sm font-semibold
  text-gray-600 py-2` label divs, and the month grid `grid grid-cols-7
  gap-1 sm:gap-2` (the cells keep the CALENDAR_CELL states + our
  clickable flex-stack superset). Ours had merged the DOW labels +
  cells into ONE 42-child grid behind a padding-neutralized
  CardHeader/CardContent pair (16px header gap vs 24px, 4px DOW gap vs
  8px, 18px semibold title vs 20/24px bold).
- **The topbar account trigger is the STOCK ghost Button (session-17)** —
  the reference's trigger carries the full stock construction
  (`whitespace-nowrap text-sm font-medium focus-visible:ring-1
  focus-visible:ring-ring` + the ghost hover pair + `h-9 px-4 py-2` +
  `flex items-center gap-1 sm:gap-2`) with a text span, a TWO-LEVEL
  avatar (stock Avatar root `relative flex shrink-0 overflow-hidden
  rounded-full w-8 h-8` + fallback div `w-full h-full bg-gray-200
  rounded-full flex items-center justify-center text-gray-600
  font-semibold text-sm`) and a chevron. Ours was a hand-written button
  with NO focus-visible ring (a keyboard-focus gap) and a one-level
  avatar. `TOPBAR_LAYOUT.userButton` now only adds the flex/gap
  composition + `[&_svg]:mr-0` (the iconGap's trailing-chevron margin
  must stay neutralized — the reference's chevron carries no margin).
- **Icon glyphs are a census-pinned layer (session-17)** — compare NAME +
  SVG PATH DATA, never names alone (lucide renames can hide redesigns;
  aliases can hide renames). The reference's sidebar ships `users`
  (two-person) / `circle-user` / `calendar` (blank body) — ours had
  `User`/`CircleUserRound`/`CalendarDays` (all different glyphs; the
  renames ARE exported by lucide 0.525). Its Filter/Filters buttons ship
  the OLD lucide POLYGON funnel (`<polygon points="22 3 2 3 10 12.46 10
  19 14 21 14 12.46 22 3">`) — lucide 0.525 re-exports the redesigned
  curved Funnel AS `Filter` and the polygon is exported by NO name, so
  it lives in `src/components/ui/icons.tsx` (`FilterPolygon`, with the
  `lucide lucide-filter` namespacing classes for census comparability).
  Its contacts Scan Card ships `scan` (no center line) and its IMPORT
  button ships a DOWNLOAD glyph (the reference's own quirk); its leads
  chips ship `circle-check-big` + `calendar`; its calendar chips
  `calendar` + `users`; its quick-log `calendar` (Log Meeting) +
  `message-square` (Log WhatsApp). Pinned by the nav-config/page source
  rules + the e2e glyph test.
- **The checkbox is the STOCK Radix-style button (session-17)** — every
  reference filter rail (accounts 4 tiers / calendar 10 types+dates /
  activities 4 Activity-Type + the by-type footer) ships `<button
  type="button" role="checkbox" aria-checked data-state value="on">`
  with a `Check` h-4 w-4 indicator mounting ONLY when checked. The
  reference's `border-primary`/`data-[state=checked]:bg-primary`
  compute **#171717 — the platform's DARK stock primary, not the app
  blue** (the DIALOG_SUBMIT family) — so the computed-equal expression
  is `neutral-900`/`neutral-50` (`CHECKBOX` in page-layout.ts). Ours
  shipped native inputs (no check glyph ever rendered + a blue checked
  fill + a 2px translucent ring). The primitive lives in
  `label.tsx` with the `onCheckedChange(boolean)` API; keyboard
  toggling is native (buttons fire click on Space/Enter).
- **Button variant pins (session-17)** — the default (blue) variant
  carries the BARE `shadow` scale (the reference's blue primaries
  compute rgba(0,0,0,.1) 0 1px 3px 0 — shadow-sm was one step light
  under the s9-re-pinned scale; outline buttons stay shadow-sm on both);
  the ghost variant carries NO base text color (the stock ghost — its
  one text-bearing surface "Save All" renders the inherited #0a0a0a,
  not gray).
- **The document metadata layer is the site seam (session-18)** — the
  reference's `<head>` surface was never swept before s18: its
  `meta[name=description]` is a 405-char marketing paragraph (em-dash at
  char 321 — mirrored verbatim as `SITE_DESCRIPTION` in
  `src/lib/site.ts`), it ships the full OG set (og:title/description/
  image/url/type/site_name) + `twitter:card summary_large_image` with
  title/description/image AND `twitter:url`, a PNG favicon, a nine-URL
  `/sitemap.xml` (weekly, 1.0/0.8) and a robots.txt with a Sitemap line.
  Ours: `src/lib/site.ts` (`siteUrl()` reading NEXT_PUBLIC_SITE_URL with
  the localhost fallback — the variable was documented in
  .env.example/README/CLAUDE since the scaffold but consumed NOWHERE
  before s18) feeding the root layout's `metadataBase` + OG/Twitter
  blocks, `src/app/icon.png` (the BrandMark annulus on the #2563eb tile,
  file-convention favicon), `public/og-image.png` (1200×630 live
  dashboard capture). TWO SERIALIZER HAZARDS (why robots/sitemap are
  explicit route handlers, not metadata routes): Next's `robots.ts`
  emits `User-Agent` (capital A) where the reference's bytes say
  `User-agent`, and its `sitemap.ts` serializes priority 1.0 as `<priority>1</priority>`
  (JS number collapse) — `src/app/robots.txt/route.ts` +
  `src/app/sitemap.xml/route.ts` emit the reference's exact byte format
  (verified byte-identical origin-normalized for robots; the sitemap's
  ONLY deltas are the deliberate lowercase routes — the reference's
  capitalized locs resolve only on its case-insensitive platform).
  `twitter:url` rides `metadata.other` because Next's twitter object has
  no url field (verified against next 16.3.6's twitter-types). The
  quarter-boundary TIME BOMB (also fixed s18): the reports e2e asserted
  the quarter-relative won total "$542.0k" — valid only while the seeded
  closes fell inside the then-current quarter; it broke on 2026-10-01
  when Q4 began (server-side `periodStart()` window no longer contained
  any seeded close). The deterministic expression: select All Time in
  the period combobox and pin the date-independent "7 $687.0K". NEVER
  hardcode a period-relative KPI value in a test — derive it or pin an
  all-time/structural value.
- **The PWA + per-route metadata layer is the site seam's second act
  (session-19)** — the reference's install surface + per-route head were
  live-verified on all 10 routes: it ships `/manifest.json` +
  `<link rel=manifest>` (name/short_name "NEO CRM", the 405-char
  description, TWO icon entries sharing ONE src at 192x192 + 512x512,
  start_url/scope at the origin, standalone, theme `#000000`, bg
  `#ffffff` — served as `application/json`, key order mirrored via an
  explicit `force-static` route handler at `src/app/manifest.json/route.ts`
  because `app/manifest.ts` would re-order the keys); `meta
  name=theme-color` is **#000000** (not the app blue — ours had shipped
  #2563eb since the scaffold); `mobile-web-app-capable` +
  `apple-mobile-web-app-status-bar-style` (black) +
  `apple-mobile-web-app-title` ("NEO CRM") ride `metadata.other` as
  `PWA_META` (Next has no first-class fields); and PER-ROUTE canonical +
  OG/Twitter on every inner page — og:title "X | NEO CRM", og:url
  origin+route, og:description `"<Page> on NEO CRM. " + SITE_DESCRIPTION`,
  twitter:title/url/description likewise, `<link rel=canonical>` per
  route (root + /login stay unprefixed). All of it is built by the
  `pageMetadata({ page, route, title? })` factory in `src/lib/site.ts`
  (the 8 inner wrappers + login + signup consume it; the dashboard
  inherits the root layout). THREE serializer hazards gate-caught: (a)
  **declaring `metadata.icons` REPLACES the file-convention
  `link[rel=icon]`** — the s18 favicon test failed the moment `icons:
  { apple }` appeared, so BOTH icons ship as file conventions
  (`src/app/icon.png` + `src/app/apple-icon.png`, the 180×180 BrandMark
  tile) and the layout declares NO icons field; (b) page-level
  `metadata.other` REPLACES the layout's map (shallow merge) — the
  factory re-declares PWA_META + twitter:url per page or the inner pages
  would lose the PWA metas; (c) Next's URL resolution strips the root
  canonical's trailing slash (the reference's is `origin/` — the
  slashless form is the s18 "viewport 1 vs 1.0" cosmetic-serialization
  class, documented, accepted). The reference's per-route OG image is its
  CDN transform URL — static across routes, so `/og-image.png` ships
  everywhere. Dialog micro-contracts (same session): the CONTACT dialog's
  Phone is `type="tel"` while the LEAD dialog's stays plain text (the
  reference's own inconsistency, mirrored exactly); ZERO datalists
  anywhere (the scaffold-era industry/account suggestion dropdowns are
  removed — the reference ships none); the avatar file input accepts
  exactly `image/jpeg,image/png,image/jpg` (not `image/*`). Our login's
  `autoComplete` attrs (email/current-password/new-password/name) are the
  deliberate accessible superset — password managers; the reference ships
  none.

- **The HTTP response-header layer is the edge seam (session-20)** — the
  reference's platform (Cloudflare/Caddy) injects a three-header security
  set on EVERY response (HTML routes, authed routes, its hashed CSS asset,
  /manifest.json after its 302 hop, its SPA-fallback 200s — curl-verified
  on 10+ responses): `referrer-policy: strict-origin-when-cross-origin`,
  `x-content-type-options: nosniff`, and
  `strict-transport-security: max-age=31536000` (BARE max-age — no
  includeSubDomains, no preload). The self-hosted expression is the
  `headers()` field in `next.config.ts` (one `/:path*` block) — it applies
  to pages AND /_next/static assets AND route handlers, with NO
  content-type conflicts (verified live: the config headers coexist with
  the sitemap/robots/manifest route handlers' own content-types). HSTS is
  inert over plain-HTTP localhost (RFC 6797 §7.1: a UA MUST NOT process
  it over non-secure transport — verified empirically: the dev server and
  the browser flows stay healthy) and correct whenever a deployment runs
  behind HTTPS, which is the reference's own topology. Same session: the
  sitemap's content-type tightened to the reference's bare
  `application/xml` (was `application/xml; charset=utf-8` — the s18
  "viewport 1 vs 1.0" cosmetic-serialization class; robots
  `text/plain; charset=utf-8` and manifest `application/json` already
  matched). Census-method hazards documented: HEAD ≠ GET on the reference
  (its platform answers HEAD /manifest.json with 200 text/html but the
  real GET chain is 302 → /api/apps/manifests/… → 200 application/json —
  always GET-verify content-types), and `Element.checkVisibility()`
  WITHOUT options does NOT test the `visibility` property (it only checks
  display/content-visibility — the fixed-position drawer panel is never
  display:none; read `getComputedStyle(el).visibility` instead — this
  false-positived the drawer-open probe mid-session). The keyboard
  tab-order census (login/dashboard/leads, both apps) and the print-styles
  sweep (both zero @media print) both verified at PARITY — the reference
  ships FIVE unnamed interactive elements on its dashboard (two topbar
  icon buttons, the view-switcher combobox, two table-area buttons — WCAG
  4.1.2 failures) where ours carries aria-labels, the documented
  accessible-superset pattern; its leads-table sortable headers (Lead
  Name/Email/Value, the G-5 pin) are clickable divs with the
  arrow-up-down SVG + onclick — ours are proper `<th><button>`.

- **The login-card funnel is in-place and toastless (session-21)** — the
  reference's login card swaps its column through FIVE views at one URL:
  signin → (Need an account? Sign up — an onclick BUTTON, the s10 "dead
  button" pin DISPROVEN live) → signup → (Create account) → verify →
  (Verify email / Back to sign in) → signin, plus the s11 reset flow
  (signin → reset → sent). The signup view is MINIMAL (Email / Password /
  Confirm Password — NO name field, NO Google button, NO divider — the
  name derives from the email local part server-side); the verify view
  ships six 40×44 single-digit inputs (`flex items-center justify-center
  gap-1.5`, the first `autoComplete="one-time-code"`, rest `"off"` — and
  NO `w-full` on them: the reference's own w-full+w-10 conflict resolves
  to 40px under its v3 cascade but flex-shrinks to ~56px under v4). Every
  auth error renders the shadcn **Callout** banner (red variant:
  `bg-red-50/70 border-red-200` + the inner `[&_p]:leading-relaxed
  text-red-700 text-sm` div, including the never-rendered `[&>svg]` icon
  classes — the same vocabulary the s11 sent-callout pinned in green; the
  resend confirmation rides the GREEN variant and AUTO-DISMISSES ~3s
  where error banners persist). ZERO toasts fire on the auth flows (login
  failure = the banner only; success = a silent redirect — the only
  remaining auth toast is the Google button's not-configured `toast.info`,
  the documented self-hosted fallback for the reference's real OAuth
  redirect). The exact strings, live-verified: "Invalid email or
  password" (login), "A user with this email already exists" (signup),
  "Passwords do not match" (the confirm guard — client-side, no network),
  "Please enter all 6 digits" → "Invalid verification code. N attempts
  remaining." (4…1) → "Too many failed attempts. Please request a new
  verification code." (the 5th failure and every one after — the button
  stays enabled), "New verification code sent to your email" (resend —
  which RESETS the attempts), and "Please verify your email before
  logging in. Check your email for the verification code." (an
  unverified account's login attempt). The machinery: `src/lib/
  verification.ts` (client-safe constants + messages) + `src/lib/
  verification-server.ts` (code mint + scrypt hashing — SERVER-ONLY, it
  imports the auth layer; NEVER import it from a client component) +
  `/api/auth/verify` + `/api/auth/resend` (rate-limited) + three nullable
  User columns (`verificationCodeHash`, `verificationAttempts`,
  `verificationExpiresAt` — NULL expiry = "no verification pending", so
  the seeded demo users and every pre-s21 account pass straight through).
  A self-hosted deployment has no mail transport, so the 6-digit code is
  logged to the SERVER console at signup/resend time — never shipped to
  the client, never committed. Schema pushes go through
  `bun run db:push` (the `scripts/prisma-env.ts` wrapper) — a bare
  `bunx prisma db push` falls into the documented bun .env-absolutization
  trap and writes to `<parent-of-repo>/db/custom.db` instead
  (`src/lib/db-path.ts` documents it; it bit once this session).

- **The app ships ZERO webfonts (session-22)** — the reference loads no
  font at all: zero `@font-face` rules in its 79.5KB stylesheet,
  `document.fonts` empty, every surface computing Tailwind's stock
  sans stack (byte-extracted from its preflight html rule). Our
  scaffold's `next/font/google` Inter rendered every text surface in
  the wrong typeface (measured on the same 62-char string at 16px:
  reference 466.8px/522.4px regular/bold vs ours 439px/451.3px —
  ~6% narrower regular, ~14% narrower bold). The remediation: the
  Inter import + `--font-inter` variable RETIRED from `layout.tsx`,
  and `--font-sans` in the `@theme` block pins the reference's EXACT
  stack (`ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
  "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`) — pinned
  explicitly because Tailwind 4.3's own default is the v4.0
  `-apple-system, BlinkMacSystemFont, …` list and NOT byte-identical
  (a version-proof pin). The same session retired the scaffold's
  double `antialiased` smoothing (the html CSS rule + the body class —
  the reference computes `auto` with no `text-rendering` override) and
  the invented `::selection` blue tint (the reference ships zero
  selection rules). Post-fix the controlled-span metrics MATCH the
  reference exactly (466.8/522.4). Never re-introduce a webfont, a
  smoothing override, or a selection tint without re-probing the live
  reference — and never pin a "default" you haven't byte-verified
  (Tailwind's defaults move between minors).

- **The tabs ship the reference's full Radix ARIA + keyboard contract
  (session-23)** — every tab strip (activities 4, reports 5, settings 3)
  wires `useId()`-generated trigger/panel id pairs: each trigger carries
  `id` + `aria-controls` → its panel's `id`, each `TabsPanel` shell
  carries `id` + `aria-labelledby` → back, and ALL N shells stay mounted
  with the inactive ones `hidden` + EMPTY (the reference's own structure:
  Radix mounts the shells, the app fills only the active one — pages pass
  `{tab === X && <Content/>}` inside each shell). The tablist handles
  ArrowLeft/ArrowRight with WRAP + Home/End + automatic activation
  (focus follows selection via the tabRefs + `preventDefault`). The
  reference's own tabs are all `tabIndex=-1` (keyboard-unreachable
  platform defect) — our roving tabindex (selected tab = 0) stays the
  documented accessible fix. The wrapper div's className is the page's
  Tabs region (space-y-6 on settings/reports, bare on activities);
  each shell's classes append to the stock Radix `TabsContent` focus-ring
  family (`ring-offset-background focus-visible:… mt-4 space-y-2` on
  activities / `mt-2 space-y-4` on settings / `mt-2` on reports — the
  mt-* collapses against the wrapper's space-y margins: 16px gap on
  activities, 24px on settings/reports, live-measured on both apps). The
  activities priority card is ONE `p-4 border-b` region (title row +
  tablist + panels inside it — its border-b renders BELOW the content at
  the card's bottom; the s15-era CardContent split drew a separator line
  the reference does not ship and inset the rows at p-6 instead of the
  toolbar's p-4). The login page serves the card to AUTHENTICATED
  visitors too (the reference does — no `redirect("/")`; the scaffold's
  authed redirect was an invention, retired session-23).

- **The app routes serve at BOTH casings; the nav hrefs are the
  reference's CAPITALIZED paths (session-24)** — the reference's sidebar
  links point at `/Dashboard`, `/Accounts`, `/Contacts`, `/Leads`,
  `/Calendar`, `/Activities`, `/Reports`, `/Settings` (byte-extracted
  from its live DOM — Dashboard at `/Dashboard`, NOT the root) and its
  account menu ships `<A href="/Profile">`. Every capital URL renders
  the real page IN PLACE with NO normalization, and each casing is a
  first-class SSR route (og:url + canonical mirror the requested case;
  `/Dashboard` serves the ROOT head exactly like `/`). Implemented as
  nine thin RENDER aliases inside the `(app)` group —
  `(app)/{Dashboard,Accounts,Contacts,Leads,Calendar,Activities,Reports,
  Settings,Profile}/page.jsx` each re-exporting the lowercase page
  component + `pageMetadata({ page, route: "/Capital" })` (the Dashboard
  alias exports NO metadata — it inherits the root head). The aliases
  are `.jsx` files ON PURPOSE: TypeScript's TS1149 (not
  flag-controllable) rejects any program containing two real files
  differing ONLY in casing — a page.tsx alias would collide with the
  canonical page.tsx through Next's generated route validator. The lowercase
  routes stay canonical (all prior pins, the sitemap, the search-result
  rows). The active-state matcher in `sidebar.tsx` is CASE-INSENSITIVE
  (`pathname.toLowerCase()` vs `href.toLowerCase()`) with the Dashboard
  special case (`/` OR `/Dashboard`) — the reference highlights its
  Reports item at lowercase `/reports`. NEVER convert an alias into a
  `next.config.ts` redirect (case-insensitive matching self-loops — the
  s14 lesson, twice-reproduced) and never add capital aliases for the
  AUTH routes (`/Login` + `/Signup` 404 on the reference too — its
  router case-folds only the app routes; pinned in
  `tests/route-case.test.ts`). The dashboard's "More..." ghost button
  is the reference's DEAD affordance (live-clicked: zero DOM delta, no
  navigation — the same family as its mail/bell buttons); the invented
  `router.push("/leads")` was retired session-24. URL-state parity is
  CLOSED: both apps write zero URL state (filters, sorting, periods,
  calendar months, view switchers, tabs, search) and both ignore URL
  params — never serialize view state into the address bar.

- **The reference ships ZERO loading UI — render zeros immediately
  (session-25)** — with its Lead entity fetch network-ABORTED, the
  reference still renders the full /Leads page instantly (h1, KPI
  cards at 0, the empty table row, even "Hi, Guest" when the user
  fetch fails). Skeletons/spinners/skeleton-row families were an
  invention: every one retired (the empty state IS the loading state),
  together with the store's `loadingFlags` + `loading()` helper and
  the `misc.tsx` Skeleton export. NEVER reintroduce a skeleton branch
  on these pages — the dashboard's KPI cards render via
  `k?.field ?? 0` null-safety, the tables render their empty-state row
  directly.
- **The Reports exports are REAL client-side artifacts (session-25)**
  — the header **PDF** button captures the content area (the `<main>`
  scroll container, sidebar excluded) through `html2canvas-pro` and
  paginates it via jsPDF into A4 portrait, downloading
  `crm_reports_YYYY-MM-DD.pdf`. The per-table **Export PDF** buttons
  generate TEXT jsPDFs (title truncated at the parenthetical,
  `Generated: M/D/YYYY`, column headers, rows) as
  `<slug>_YYYY-MM-DD.pdf` (`open_deals_by_stage_…`,
  `deals_at_risk_…`). NEVER `window.print()` + a toast on these
  buttons — that was the invented behavior. The seam is
  `src/lib/pdf-export.ts` (html2canvas-PRO, not classic — our Tailwind
  v4 stylesheet carries 242 `color-mix()` calls the classic parser
  cannot read).
- **The CSV contract (session-25)** — filenames are
  `prefix_YYYY-MM-DD.csv` (underscore + ISO date, never
  `prefix-YYYYMMDD.csv`); the leads CSV ships the reference's 8
  columns (Name…Next Follow-up); the reports header Export CSV hits
  the filter-aware `/api/export?type=report` (SINGULAR
  `crm_report_…`, the 7 deal columns); the per-table Export CSVs are
  client-side blobs from the in-memory rows with the reference's OWN
  inconsistency: SHORTER prefixes than the PDFs (`open_deals_…` vs
  `open_deals_by_stage_…` — literal per-button prefixes, not
  `tableSlug()`).
- **The Saved Reports feature is localStorage-backed (session-25)** —
  the "Saved Reports (N)" button opens the Save Custom Report View
  dialog (Report Name + the 6 column checkboxes + the Current Filters
  summary + the loadable list), persisting to
  `localStorage.crm_saved_reports` under the reference's byte-exact
  schema (filters carry the SHORT dateRange slugs:
  today/week/month/quarter/ytd/all). **Load** reapplies the saved
  filters. The store's `REPORT_PERIODS` is the reference's 6-entry
  vocabulary — `this_year` was retired for `ytd`, `today` added.
- **The Settings Data tab + import/export contract (session-26)** —
  the three cards ship the reference's CardDescriptions (Import
  Templates "Download CSV templates for bulk imports" / Export Data
  "Export your CRM data to CSV" / the Danger Zone's red
  "Permanently delete all CRM data. This cannot be undone."), the 2nd+
  buttons carry `ml-0 sm:ml-2`, the template buttons are STATIC
  client-side blobs (`contacts_template.csv` etc. — the seam is
  `src/lib/csv-templates.ts`), and the export buttons are client-side
  RAW DUMPS (`contact_/account_/lead_/activity_` + ISO date — the
  header is the first row's OWN keys, every value double-quoted, an
  EMPTY file at zero rows; the seam is `src/lib/entity-export.ts`).
  NEVER wire these to `/api/export` — that route now serves only
  `type=leads` + `type=report`.
- **The reset flow is native-dialog-gated (session-26)** — the
  destructive button carries the reference's `trash2` icon and its
  handler is EXACTLY the reference's (bundle-extracted):
  `alert("Please type RESET to confirm")` defensively, then
  `confirm("This will permanently delete all contacts, accounts,
  leads, opportunities, activities, and calendar events. Are you
  sure?")`, then on success `alert("Data reset complete")` / on
  failure `alert("Failed to reset data")` — NEVER a toast (the store's
  `resetData` already refetches every slice — that half predates
  session-26).
- **The page-level exports are quoted client-side CSVs (session-26)**
  — contacts: the 7-column set
  Name,Email,Phone,Company,Position,Status,Source + `contacts_ISO.csv`
  + the zero-data guard (button disabled at empty); accounts: the
  10-column set
  Name,Industry,Phone,Email,Website,Annual Revenue,Employees,Status,
  Tier,Health + `accounts_ISO.csv` — the header button disabled at
  zero data, the toolbar one enabled-but-guarded (the reference's own
  pair inconsistency). Account carries a STORED `health`
  (Healthy/At Risk/Needs Attention, backend-defaulted — the reference's
  dialog has no health field). Every cell is `"quoted"`.
- **The Import Contacts dialog is the reference's funnel (session-26)**
  — sm:max-w-md, "Upload a CSV or Excel file with contact
  information", the Select File label, the w-32 dashed dropzone with
  the `upload` glyph + "Click to upload CSV or Excel" + "CSV, XLS,
  XLSX", `accept=".csv,.xls,.xlsx"`, the blue chosen-file box, the
  Required/Optional columns box, the Cancel/Close + Import footer
  (disabled until a file; "Processing…" while busy), and the green/red
  result box — `Successfully imported N contact(s)` with the
  2-second auto-close; the failure vocabulary is the reference's exact
  strings ("Could not map any CSV column to the target schema" /
  "No valid contacts found. Make sure your file has name and email
  columns." / "Failed to import contacts. Please try again."). NO
  template link — the reference ships none.

- **The chart internals are a per-surface bundle-pinned layer (session-27)** —
  the reference's Cartesian charts ship STOCK recharts axes (the axis line
  AND tick lines render at the default #666; stock margins; no
  allowDecimals) — the scaffold-era `axisLine={false} tickLine={false}` +
  custom margins are ALL retired. The parameterized family in
  `src/components/charts/charts.tsx`: `SingleBarChart` (one Bar, single
  fill, optional radius/name/formatter/tick/grid), `GroupedBarsChart`
  (the won/lost + Activities/Won-Deals PAIRS + stock Legend),
  `TrendLineChart` (1-2 strokeWidth-2 lines), `LabelPieChart` (the FULL
  pie — outerRadius 90/100, labelLine false, per-slice label formatter,
  palette Cells, NO innerRadius/paddingAngle/Legend), and
  `HorizontalBarChart` (the funnel #06b6d4 YAxis-width-100 and the tab-5
  Top-10 #3b82f6 YAxis-width-120 $). `PipelineBarChart`/`WonLostLineChart`/
  `DonutChart`/`FunnelBarChart` are RETIRED; `RevenueLineChart` survives
  ONLY as the dashboard's won/target areas (fillOpacity .6/.3, STOCK
  strokeWidth, $ tooltip, tick 12).
- **The reference HARDCODES its KPI sparklines and deltas (session-27)** —
  the dashboard sparks are the static arrays in `KPI_STATICS`
  ([10,12,11,14,13,15] etc.), the deltas the literals "+5.3%"/"+15%", the
  reports sparks the single array [65,72,68,85,78,92]; the Sales Target
  progress is a NEUTRAL `valueNote` (text-gray-600), never a green/red
  delta. NEVER feed these cards real series — the reference's cards
  always show the same shapes. The dashboard pipeline's per-stage colors
  live ONLY in the `PIPELINE_LEGEND` chips (w-3 h-3 rounded squares via
  the O-map of bg-*-500 classes, looked up by the LABEL slug — the "Won"
  label misses `closed_won` and falls back to bg-gray-400, the reference's
  own quirk); the bars are single #3b82f6.
- **The dashboard's Lead Sources + Upcoming Activities are checkbox rows
  (session-27)** — `p-2 hover:bg-gray-50 rounded` rows with the INERT
  stock Checkbox + "Follow up with {source}" (slice 4) / description +
  related + `toLocaleDateString()`. The invented progress-bar and
  colored-dot lists are retired. NEVER reintroduce data-driven sparks or
  bar lists on these cards.
- **The Account Health tab is COMPUTED, not stored (session-27)** —
  `src/lib/account-health.ts`: `daysSinceActivity` from the account's
  latest activity (999 = never) and `health = days>60 || hasLostDeals ?
  "At Risk" : days>30 ? "Needs Attention" : "Healthy"`. The distribution
  is a LabelPieChart (outerRadius 100, `${name}: ${value}` labels, fills
  #10b981/#f59e0b/#ef4444); the Top-10 a horizontal #3b82f6 chart
  (sorted by revenue desc, YAxis width 120, $ tooltip); the at-risk rows
  `bg-red-50` with `lastActivityText` ("Nd ago"/"Never") + the
  `bg-red-100 text-red-800` "At Risk" badge (slice 20); the summary
  statuses outline Badges with the `|| "-"` industry. The STORED
  `Account.health` (s26) stays on the accounts export only.
- **The calendar chips are the interactive layer (session-27)** — the day
  cells' event chips carry the `EVENT_TYPE_CHIP` tints (bg-*-100 +
  text-*-800 + a solid bg-*-600 dot, w-1.5 h-1.5) + title-only text +
  `onClick → the EDIT dialog` (cursor-pointer); the day numbers are PLAIN
  TEXT (`text-xs sm:text-sm font-medium mb-1` — no circle pill); "+N
  more" is a separate line after the chips; the Upcoming rows are the
  `p-3 border rounded-lg hover:bg-gray-50` tall-bar family (w-2 h-12
  colored bar + `formatMonthDayTime` "MMM d, h:mm a" + related + Pen/
  Phone/MessageCircle ghost buttons); the Agenda is the FILTERED events
  list (slice 10) in the 40×40 tinted-square rows with the
  EllipsisVertical Edit/Delete dropdown. Our clickable day-cells stay the
  accessible superset over the reference's inert divs.
- **The leads rail vocabulary is the 5-status list (session-27)** —
  "Pipeline Value by Stage" = new/contacted/qualified/won/lost with VALUE
  sums (single #3b82f6 bars, $ tooltip, tick 12; "Contacted" elides from
  the ticks at the 331px card — recharts tick elision, the reference's
  own behavior); the funnel labels are New Leads/Contacted/Qualified/Won
  (status-cumulative, fills #3b82f6/#8b5cf6/#10b981/#22c55e —
  `LEADS_FUNNEL`); won-vs-lost is grouped BARS + stock Legend.

- **The reference NEVER reuses its create dialogs for editing
  (session-28)** — every entity ships a SEPARATE max-w-2xl edit dialog
  (the bundle's W7/wce/Mke family, `src/components/shared/entity-edit-dialog.tsx`):
  grid-cols-2 rows, a Status/Source select pair (RAW values with
  capitalized labels — value "call", label "Call"), and the
  Save Changes/Saving... footer with a justify-end gap-3 pt-4 wrapper.
  All three support a readOnly mode ("... Details" title, disabled
  inputs, a single Close footer). The per-entity quirks: the contact
  edit's source is PLAIN (no emojis — they live only in the create
  dialog's "How did you meet?"); the account edit carries the full field
  set (Website url placeholder "https://example.com", Annual Revenue
  "100000"/Employees "50" numbers, the 3-option status
  active/inactive/prospect); the lead edit's status is the 4-option set
  (New/Contacted/Qualified/Unqualified — NOT the table's 5-status set)
  and its source has FOUR options (no Referral) — the reference's own
  inconsistencies, mirrored.
- **The contacts model is the reference's vocabulary, not the scaffold's
  (session-28)** — priority is Key/Standard/At Risk (amber-100/blue-100/
  red-100 + border-*-300 badges; NOT the lead hot/warm/cold temperature),
  `role` is the 5-option Decision Maker/Key Contact/Influencer/End
  User/Other (an INLINE h-9 w-[140px] select in the row, placeholder
  "Set role", immediate mutation), `engagementLevel` High/Medium/Low
  drives the 3-bar cell (w-2 h-6 rounded-full; -500s + shadow-sm in the
  table, -600 solids in the slide-over — its own inconsistency),
  `companySize` stores the filter's exact strings, and `source` stores
  RAW values (call/email/website/partner/referral; the emoji strings are
  create-dialog labels ONLY). The ce() formatter: Never/Today/
  "1 day ago"/"N days ago"(<30)/"N months ago"(floor 30), red at >=30d.
- **The contacts row is a rich interactive surface (session-28)** —
  cursor-pointer + hover:bg-blue-50/50 hover:shadow-sm; Key priority ->
  the amber row tint (bg-gradient-to-r from-amber-50/50 to-amber-50/30
  border-l-4 border-l-amber-400) + the avatar's amber overlay (w-5 h-5
  bg-amber-400); >=30d last activity -> opacity-70 + the red Zap icon +
  red ce text (green otherwise); the w-11 h-11 gradient avatar
  (blue-500 via blue-600 to blue-700, ring-2 ring-blue-100) + FIRST
  INITIAL; the engagement bars; the company + company_size stack; the
  raw-source blue badge (bg-blue-50 text-blue-700 border-blue-200); the
  actions column: Call/Email/WhatsApp hover-tinted ghost icons
  (green/purple/blue) + the EllipsisVertical menu (Edit / Log Activity /
  Delete). The ROW CLICK opens the Contact Details slide-over
  (`src/components/contacts/contact-detail-panel.tsx`): fixed top-0
  right-0 h-full w-full md:w-[500px] border-l, the sticky Close header,
  the hero (w-20 h-20 gradient + first initial, position ||
  "No position", the priority + role badges, the engagement bars), the
  Call/Email/WhatsApp grid-cols-3, the "Contact Information" card
  (Email/Phone/Company+size/Last Activity "MMM D, YYYY"), the
  Activities/Deals/Notes tabs ("No activities yet"/"No deals found"/
  "No notes yet" — notes is ALWAYS the static empty state).
- **The contacts FILTERS button opens a checkbox-card PANEL (session-28)**
  — the kke contract: `fixed right-0 top-16 bottom-0 w-80 bg-white
  shadow-2xl z-40 lg:static lg:shadow-none` + the w-full lg:w-80 border-l
  panel with the sticky Filters/Clear All header and the Role/Priority/
  "No Recent Activity (30+ days)"/Company Size/Source card groups. NOT
  select dropdowns (our s6-era invention, retired).
- **The accounts row + insights (session-28)** — cursor-pointer
  hover:bg-gray-50; Key tier -> bg-yellow-50/30 + the filled star
  (text-yellow-500 fill-yellow-500); overdue > 0 -> border-l-4
  border-l-red-500 + the "{N} Overdue" destructive badge; the w-10 h-10
  bg-blue-100 rounded-lg building-icon box; the owner INITIALS box
  (w-6 h-6 bg-blue-100 text-blue-600 text-xs); last activity as a DATE
  ("No activity" fallback); the HEALTH badge under the "Status" header
  (the reference's own header/cell mismatch — Healthy=green-100/
  green-800, At Risk=yellow-100/yellow-800, Needs Attention=red-100/
  red-800); the row click + "View Insights" open the Account Insights
  dialog (`src/components/accounts/account-insights-dialog.tsx`,
  max-w-3xl max-h-[80vh]): the name+industry+status header, the 3 stat
  cards (Total Revenue $X.XM / Open Deals / Contacts), the Recent
  Activities/Contacts/Open Deals tabs with the type-tinted w-10 h-10
  icon rows (Email=blue, Call=green, else purple) and "Close Date: "
  deal rows. The rail's revenue ranges are $0-$1M/$1M-$5M/$5M+.
- **The create Contact dialog ships two h3 section headers (session-28)**
  — "Contact Details" over Email/Phone and "Professional Details" over
  Company/Position (`text-sm font-semibold text-gray-700 uppercase
  tracking-wide` — live-verified; an s15-era blind spot). The Scan Card
  dialog is the NAe contract: the border-2 border-dashed gray-300
  dropzone, "Upload a photo or image of the business card", a VISIBLE
  file input, "Selected: {name}" green text, Cancel/Scan Card/"Scanning..."
  (the base44 AI extraction is the documented local divergence — a chosen
  image opens the create dialog).

- **The leads table is the INTERACTIVE surface (session-29)** — the C2
  contract (bundle-extracted + live-verified): the Name cell is the orange
  Target box (`w-10 h-10 bg-orange-100 rounded-lg` + `Target` w-5 h-5
  text-orange-600 + `p.font-medium`); the Email/Phone/Company cells are
  `text-sm` with the `-` single-hyphen fallback; **Value is an INLINE
  number input** (`w-24 h-8 text-sm`, placeholder `"$0"`, `parseFloat(v)
  || 0`, immediate mutation); **Status is an INLINE select** (`w-32 h-8`,
  EXACTLY the five raw options new/contacted/qualified/won/lost — NOT the
  edit dialog's 4-option set; unmatched stages render a BLANK trigger,
  Radix's unmatched-value behavior); Source is an outline `text-xs` Badge
  with the RAW value; **Next Follow-up is an INLINE date input** (`w-36
  h-8`) with `isOverdueFollowUp` (any PAST date — a date-only "today"
  parses at UTC midnight and IS overdue, the reference's own quirk) →
  `border-red-500` + the `CircleAlert` w-4 h-4 text-red-500; the ⋮ menu is
  Edit / **Convert to Opportunity (DEAD — no onClick, the reference's own
  quirk)** / Delete; the row carries an EXPLICIT `hover:bg-gray-50` and is
  NOT clickable (unlike contacts/accounts); the thead is `sticky top-0
  bg-white z-10` (live-confirmed); the actions header is `w-12`; the
  sortable th's are `cursor-pointer` + `flex items-center gap-2` +
  ArrowUpDown. The store's `updateLead` applies the patch to the leads
  slice BEFORE the await (the reference's React-Query cache updates
  instantly — per-keystroke controlled inputs need the optimistic apply).
  DropdownItems CLOSE the popover on click (`PopoverPrimitive.Close
  asChild` — the reference's real menus auto-close on select).
- **The leads KPIs + charts + export ALL derive from the FILTERED set
  (session-29, the H/U bundle extracts)** — "Open Leads" = new+contacted+
  qualified (NOT everything-not-won); "Dropped Deals" = lost STRICTLY
  (unqualified is not dropped); the conversion rate is the one-decimal
  `toFixed(1)`; the avg sales cycle is the average AGE of the won leads
  (now − created, floored to days — NOT created→closed). The Export button
  builds a CLIENT-SIDE blob from the filtered rows (the UNQUOTED 8-column
  header + every VALUE cell quoted + `\n` joins + `leads_YYYY-MM-DD.csv`
  via `unquotedHeaderCsv` — `/api/export?type=leads` is RETIRED; the route
  serves type=report only).
- **The leads filters popover (session-29, the s8 pin re-scoped)** — the
  Status/Source selects store RAW values with explicit All items bound to
  the `"all"` sentinel (all/new/contacted/qualified/won/lost;
  all/call/email/website/partner/referral); the trigger gains the
  "(Active)" suffix while any filter is set (LIVE-confirmed — `filtersActive`);
  **Save View fires the NATIVE `prompt("Enter view name:")`** (LIVE-
  confirmed — the s8 "inert" pin was the s26 native-dialog auto-dismiss
  hazard) and the saved views render as a `w-full sm:w-48` "Saved Views"
  select that applies a view's filters on selection (LIVE-confirmed; the
  reference keeps them in-memory — ours persists the list to
  `localStorage["neo-crm.leads.views"]`, the documented superset; the filters
  themselves do NOT auto-restore on load). The lead SOURCE vocabulary is
  RAW end-to-end (value "call", label "Call" — the s28 contact-source
  precedent): `LEAD_SOURCE_OPTIONS`, the create dialog (default "email"),
  the seed, the dashboard's "Follow up with {raw}" rows, the CSV exports.
  The filter matching: search = name OR email OR company; status/source =
  strict equality; a min value passes only TRUTHY lead values (the
  reference's own `X.value &&` quirk — zero-value leads never pass).
- **The photo-upload layer (session-30, the s51 pointer CLOSED)** — the
  reference's four `UploadFile` call sites (bundle-decoded, two
  LIVE-exercised) are mirrored by a self-hosted seam: `POST /api/upload`
  (multipart, session-guarded, `type.startsWith("image/")` enforced
  server-side, the 5MB ceiling the reference's own hint advertises,
  stored as `<repo>/uploads/<32-hex>.<ext>` — gitignored like `db/`,
  returns `{file_url: "/api/uploads/<name>"}`) + `GET /api/uploads/[name]`
  (public, the stored content-type, the pinned 32-hex charset — no
  traversal surface, immutable caching). The contact CREATE dialog's
  photo section (the AAe contract, LIVE-verified end-to-end): the
  `w-24 h-24 … shadow-lg` gradient circle rendering `img.object-cover`
  when a photo is set, else the 2-char initials, else the `User` glyph
  (`w-10 h-10 text-white/80`); the red remove X (`-top-1 -right-1 w-7
  h-7 bg-red-500 rounded-full` + `X w-4 h-4 text-white`, photo-set only,
  clears the form value AND the input's `.value`); the camera button
  (`border-2 border-blue-500`, `disabled` while uploading); the hidden
  input's explicit MIME trio; the exact alert strings (`Please upload
  an image file (JPG or PNG)` / `Failed to upload photo. Please try
  again.`); the `Uploading photo...` hint (`text-xs text-gray-500`);
  the Name field INSIDE the section (`placeholder="John Doe"` +
  `text-center font-medium`). The W7 EDIT dialog has NO photo field (a
  photo cannot be changed post-create on the reference — mirrored) and
  the Pke slide-over hero is INITIAL-ONLY (our invented img branch
  retired — the row + mobile cards DO render photos). The PROFILE flow
  (the aCe contract, LIVE-verified): `accept="image/*"` with NO type
  alert on this surface (the reference's own inconsistency), TOASTS
  instead of alerts (`Photo uploaded successfully` / `Failed to upload
  photo`), the img render on the form avatar + the Account card, the
  save → `setTimeout(reload, 500)` mechanism, and the TOPBAR avatar
  (`w-8 h-8`) picking up the photo after the reload. The schema:
  `User.photoUrl String?` carried through the auth session user, the
  users GET/PATCH selects (an explicit null clears, an absent key
  keeps).
- **The dialog scroll-cap layer (session-30, the drift-re-sweep
  finding)** — the reference's DialogContent family:
  `max-h-[90vh] overflow-y-auto` on the contact CREATE dialog, the
  W7/Mke EDIT family, Log Activity, Event, and Save Custom Report
  (`DIALOG_CONTENT.wide` now carries the pair); the Account CREATE is
  the BARE `max-w-2xl` (a real width fix — ours was max-w-lg) and the
  Lead CREATE is the bare `max-w-lg` — both cap-FREE, the reference's
  own inconsistency, mirrored. The Account Insights dialog keeps its
  `max-w-3xl max-h-[80vh]` (s28, unchanged).

- **The Opportunity model is the reference's SECOND deal layer (session-31,
  the last s51 pointer CLOSED)** — bundle-decoded from index-DZ-xbrIm.js:
  the reference ships a full Opportunity entity (name / account_name
  STRING / stage / amount / probability / close_date / source / owner
  STRING) with NO create-edit UI anywhere (the leads "Convert to
  Opportunity" item is DEAD — no onClick; no New Opportunity dialog
  exists). Its data feeds: the DASHBOARD (the pipeline chart's 5 OPP
  stages with VALUE sums — PIPELINE_STAGES is the opp vocabulary now,
  labels Prospecting/Qualification/Proposal/Negotiation/Won; the revenue
  chart over the FIXED `["Nov","Dec","Jan","Feb","Mar","Apr","May"]`
  label window — hardcoded in the reference, it does NOT track the data
  months — with `55e3 + random*1e4` targets, won grouped by updatedAt
  month; Top Reps = won opps by the owner STRING `{name, deals, value}`
  value-desc slice(0,3) rendered as the initials box + "Top Admin"
  subtitle + `$Xk` + the Won/Active badge; Recent Deals = opps by
  updatedAt desc slice(0,5) with the icon-box Lead cell, `$ toLocaleString`
  values, the P-map RAW-slug badge (Won for closed_won), the blue-100
  owner box + owner STRING, and the SECOND Status badge's
  Contacted/Proposal COPY-PASTE QUIRK; the KPIs: dealsClosedValue +
  revenueThisMonth from WON OPPS, salesTarget HARDCODED 0 with
  targetProgress 0 (the bundle's literal `V=0`), conversionRate = won
  LEADS/leads toFixed(1), avgSalesCycle = the average AGE of won leads —
  now−created per lead, floored, averaged, rounded), ALL FIVE reports
  tabs (the KPI row: openLeads = leads new+contacted ONLY, won/lost +
  conversion from OPPS won/(won+lost); the 8-slug Conversion Funnel is
  the CONCATENATION of the leads' new/contacted/qualified counts + the
  OPP five-stage counts — reports-data.ts `pipelineStageCounts`, the
  s10 "merged-list double-report" reading RETIRED; the month series
  group by close_date under "MMM yyyy" keys in INSERTION order
  (newest-first — the reference's unsorted Object.entries quirk);
  Forecasting Accuracy = the ACTUAL/FORECASTED formula — forecasted =
  amount × (probability||50)/100, accuracy = actual/forecasted × 100
  toFixed(1), UNCLAMPED (>100% possible), average = the mean of the
  parsed values; Forecast by Probability bands the OPEN opps by their
  OWN probability (the stage-weight proxy retired); Aging = created_date
  age; Deals at Risk = the LAST Opportunity-linked activity >14 days or
  NEVER (the 999 sentinel), slice(0,20), bg-red-50 rows; the sources
  tab: leads from LEADS, won/lost/revenue/winRate/avgValue from OPPS;
  the account-health lost rule joins closed_lost OPPS by account NAME;
  the tables: recentWon 10 / topDeals 10 (amount-desc) / openDeals 10
  (LIST order) / atRisk 20, the Amount cells `$ toLocaleString`, the
  stage cells OUTLINE badges with the RAW slugs; the reports filter
  model: OPPS by period(created_date)+stage+source+owner+status
  (open/won/lost), LEADS by period+source ONLY, activities by
  [start, now] (future-dated EXCLUDED from finite periods); the owner
  dropdown lists the DISTINCT opp owner strings), and the insights
  surfaces (the Ece dialog: opps by account_name, Total Revenue
  `$X.XM` from won opps, the Open Deals COUNT quirk `!== closed_lost`
  ONLY — won deals count; the Pke slide-over's Deals tab: opps where
  account_name === contact.company). The Prisma model carries
  accountName/owner as NAME STRINGS (the reference's model); the seed
  plants 12 opps (4 won = $337.0K — the e2e's All-Time pin — 2 lost, 6
  open) + 3 Opportunity-linked activities for the at-risk join;
  `GET /api/opportunities` is LIST-ONLY (the read-only mirror); the
  reset route wipes them. The s31 REPORT_PERIODS wire-id divergence
  (our week/month vs the bundle's thisWeek/thisMonth) was CLOSED in
  session-32 — see the next block.

- **Every currency figure rides a LITERAL scale formula — never a
  magnitude-branching formatter (session-32)** — bundle-decoded: the
  dashboard's currency KPI cards are ALWAYS `$${(v/1e3).toFixed(1)}k`
  (Deals Closed, Revenue This Month) and `$${(v/1e3).toFixed(0)}k`
  (Sales Target — the "$0k" hardcoded-target quirk) at ANY magnitude
  ("$0.0k" at zero, "$1400.0k" at 1.4M — NEVER the M form, NEVER a
  bare number); the accounts' revenue family is ALWAYS
  `$${(v/1e6).toFixed(1)}M` (the Total Revenue KPI + the table's
  revenue cells — "$0.0M" at zero, "$0.9M" at 900k). Express these
  through `formatCompactCurrency(v, { scale: "k" | "M", decimals })`
  (src/lib/format.ts); the no-scale default keeps the legacy
  magnitude branching (the topbar search hint). The REPORT_PERIODS
  wire ids are today/thisWeek/thisMonth/quarter/ytd/all — the s25
  week/month ids were zero-data inferences, disproven by the bundle's
  i3e reports filter; stale saved-view localStorage entries migrate
  through `normalizeSavedPeriod()` (src/lib/saved-reports.ts, wired
  into the reports page's onLoad).

- **Two MORE dead controls decoded on the reference dashboard
  (session-33)** — the 29th-session bundle re-read: the filter-bar
  search input (placeholder "Stage: Source") renders with NO
  value/onChange (the same dead-input family as the s32 topbar
  "Search Anything..." decode) and the header "Add" button carries NO
  onClick (the §16c-era dead-list covered only the Exports + the login
  Sign up link — the Add button completes the set; the whole header
  trio is dead there). Ours stay the documented functional supersets
  (the Recent-Deals filter + the quick-create menu / export menu /
  one-click export); the placeholder is pinned as
  `FILTER_BAR.searchPlaceholder` and the trio's labels/classes as the
  extended `DASHBOARD_HEADER` contract (src/lib/page-layout.ts), with
  render pins in tests/page-layout.test.ts +
  tests/dashboard-contracts.test.ts.

- **The standalone-launch database-path recovery (session-34)** — the
  production start (`bun run start` from the repo root) could NOT open
  the database: bun absolutizes the relative `file:` `DATABASE_URL`
  against the LAUNCH directory's .env, but the standalone `server.js`
  runs `process.chdir(__dirname)` into `.next/standalone` before the
  Prisma client boots, so `runtimeDatabaseUrl()`'s bun-signature
  comparison ran against the post-chdir cwd (whose .env is the traced
  `.next/standalone` copy) — a mismatch that turned the launch-time
  absolutization into an apparent "intentional override" and handed the
  engine a parent-of-repo path (SQLITE_CANTOPEN — every db route 500'd,
  `/api/health` reported `db:"down"`). The seam now ALSO tests the
  signature of the .env at the validated standalone repo root (the
  launch directory) and re-anchors through `urlForRoot()` — pinned by 3
  new checks in tests/db-path.test.ts (the RED re-anchor + the e2e-style
  override guard + the launch-from-standalone guard).

- **The uploads-GET-route recovery + the API robustness layer (session-35)**
  — the uploads GET route (`src/app/api/uploads/[name]/route.ts`, public,
  the pinned `UPLOAD_NAME_RE` 32-hex charset, `CONTENT_TYPES`, immutable
  caching) was documented since session-30 and pinned by
  `tests/upload-api.test.ts` but was NEVER IN GIT: the unanchored gitignore
  pattern `uploads/` matched `src/app/api/uploads/` at ANY depth
  (gitignore segments without an interior/leading slash are not
  root-anchored), so the file lived as an untracked leftover in the
  long-lived sandbox — gates green there — while every FRESH CLONE shipped
  3 red unit checks and every uploaded photo 404ing behind an e2e mask
  (the S30-P2/P3 specs asserted only the `src` ATTRIBUTE, never the
  load). Fixed: `.gitignore` now carries the ANCHORED `/uploads/` form
  (the runtime folder stays ignored), the route restored, `db/.gitkeep`
  committed (the db/-at-root contract exists on fresh clones), the
  gitignore pin re-anchored with a negative guard, and the profile-photo
  e2e now `page.request.get`s the topbar avatar src demanding 200 +
  `image/*`. Same session: the db-path launch-dir branch gained the
  `isRelativeFileUrl(launchEnvUrl)` guard (an absolute production `.env`
  value — the documented DEPLOYMENT.md §4 form — would otherwise match
  the bun signature and re-anchor into a corrupted `<repo>/prisma/var/…`
  path); the mobile-nav close-on-route-change adjust-during-render moved
  INTO `AppShell` (own-state adjustment — the sanctioned pattern; calling
  the parent's setter from `MobileNav`'s render tripped React's
  "Cannot update a component while rendering a different component"
  warning on back/forward navigations); the PUT `[id]` routes gained the
  FK existence guards the POST side already had (contacts/leads:
  accountId + ownerId; accounts: ownerId; events: accountId + contactId —
  the "Selected company/owner/contact does not exist" vocabulary) plus
  the activities/events POST `accountId` checks, all wrapped in
  try/catch → `ERR.INTERNAL()` so Prisma failures (P2003, SQLITE_BUSY)
  stay inside the `{ ok, error }` envelope; and the store hygiene —
  `resetData()` refetches `fetchOpportunities()` (the reset route wipes
  opps; the reports owner dropdown stays stale without it), `logout()`
  clears `settings` (no cross-session picklist leakage). Pinned by
  `tests/api-robustness.test.ts` (14 checks) + 1 db-path check.

- **The envelope-completion + input-hardening layer (session-36)** — the
  re-audit found the session-35 robustness claim broader than its
  implementation: the five DELETE handlers, the three POST creates
  (contacts/leads/accounts), the `users` PATCH update, the `settings`
  PUT upsert and the `activities/[id]` update still let Prisma failures
  escape as raw non-envelope 500s, and `/api/reset` ran its seven
  `deleteMany` calls sequentially outside a transaction (partial-wipe
  risk). Fixed (all RED-first, 17 + 2 failing pins before the code):
  every mutating DB call in every handler now inside try/catch →
  `ERR.INTERNAL()` (the activities/events POST `contactId` guards and
  the `[id]` routes' existence fetches moved inside the try; leads' PUT
  is one whole-handler try because its stage parsing reads
  `existing.closedAt`); the reset wipe is ATOMIC inside
  `db.$transaction`; the events PUT gained the end≥start invariant its
  own POST enforces, checked against the MERGED record
  (`effectiveStart`/`effectiveEnd` vs `existing` — an endAt-only patch
  can no longer slip past an unchanged later startAt); the upload POST
  pre-gates on the declared `content-length` BEFORE `formData()`
  buffers the body (`> MAX_UPLOAD_BYTES + 64KB` overhead allowance,
  same "File too large (max 5MB)" vocabulary; chunked-encoding bypass
  documented, post-parse ceiling the backstop); `photoUrl` on users
  PATCH + contacts POST/PUT accepts only `null`, `/api/uploads/…` or
  `https://…` (`data:`/`javascript:` payloads killed); and `/api/health`
  returns an honest `503 SERVICE_UNAVAILABLE` on db-down (the
  playwright webServer probe still passes on a healthy boot — verified
  by a fresh-boot e2e run with `db/e2e.db` + `.auth` deleted: SQLite
  auto-creates the file, `SELECT 1` succeeds, 106/106). Pinned by the
  extended `tests/api-robustness.test.ts` (32 checks — the per-handler
  `handlerBlock()` slices are STRONGER than file-wide regexes) + 3 new
  upload-api checks. Deferred with re-confirmed rationale: reset
  role-gating (the seeded demo user's role is `"user"` — a gate breaks
  the demo-user e2e), list-endpoint caps, trusted-proxy limiter,
  updateLead supersede guard, hydrate per-slice redesign, SavedReport
  dead model.

- **The containment-proof + FK-type-hardening layer (session-37)** — the
  re-audit found the session-36 "every mutating DB call" claim one
  family short: the auth routes' four writes (signup's `user.create`,
  verify's two `user.update`s, resend's `user.update`), the
  `activities/[id]` PUT's existence fetch (the only `[id]` route still
  running it outside the try) and the settings GET's lazy singleton
  create (inside `readSettings`, reached from a GET) all still escaped
  the envelope; and the s36 pins proved PRESENCE, not CONTAINMENT (a
  write could move back out of the try and every pin stayed green).
  Fixed (RED-first, 18 failing pins before the code): the auth family
  wraps its DB tails in try/catch → `ERR.INTERNAL()` (the in-try 4xx
  returns bypass the catch by construction — the wrong-code ladder's
  400/429 verified live); the activities fetch moved inside the try
  (missing-id + malformed-body now answers 400 before 404, matching
  the sibling `[id]` routes); the settings GET wraps `readSettings()`;
  the deferred non-string FK coercion graduated — `asFKId`/`isBadFK`
  in `src/lib/api.ts` + guards at all 16 parse sites across 9 route
  files, so `{"accountId": 123}` / `{}` / `true` is a 400 "Invalid
  company/owner/contact selection" instead of a SILENT FK clear
  (UI-invisible: selects emit string ids or `""`; `""`/`null` keep
  their clear semantics); the users PATCH photoUrl cap normalized to
  500 (the contacts writers' ceiling — the s36 "normalized" claim,
  finally true); two dead imports removed. The pins now assert
  CONTAINMENT (`trySpans`/`allInsideTry` — every `db.<model>.<verb>`
  call in the handler block must fall inside a try→catch span; the
  span end anchors on the try's `} catch` CLAUSE so the promise
  `.catch(() => null)` chains don't truncate the span). Pinned by
  `tests/api-robustness.test.ts` (67 checks) + 1 strengthened
  upload-api pin. Closed as documented non-issues: the auth-routes'
  read guards (the only GET under `/api/auth` is `me` — the public
  session probe by design) and the middleware question (none exists;
  page auth is the `(app)/layout.tsx` server redirect). Deferred with
  sharpened rationale: reset role-gating (the no-RBAC doctrine),
  list-endpoint caps (the client requires full sets), trusted-proxy
  limiter (+ the 6-e2e-runs/15-min limiter margin note), updateLead
  supersede guard, hydrate redesign (the naive fix only SERIALIZES
  the duplicate fetch, it does not dedupe), SavedReport, photoUrl
  onError fallback, the 11 e2e `waitForTimeout` sleeps (on first
  observed flake), the mobile-navigation post-wipe ordering coupling.

- **The silent-bug + parser + proof-coverage layer (session-38)** — the
  re-audit verified all four session-37 claims genuine but found a
  16-session-old silent bug inside a file s37 restructured: the signup
  `nameFromEmail` fallback was DEAD CODE (`asString`'s non-optional form
  returns `""` for an absent name, and `"" ?? fallback` keeps `""` — an
  empty string is not nullish), so every UI signup (the s21
  no-name-field contract) stored `name: ""` — the "?" avatars and the
  blank owners dropdown. Fixed with `optional: true` on the name parse
  (LIVE: a probe signup now stores "Probe S38"); `photoUrl` carries the
  exact silent-coercion class the s37 FK guards closed, one field over
  (a numeric payload SILENTLY CLEARED the photo on the contacts PUT —
  LIVE-proven — and was silently IGNORED on the users PATCH): all three
  writers now guard with `isBadFK` → 400 "Invalid photo URL", with the
  trim harmonized (both families accept+store a leading-space `https://`
  URL); the Import dialog graduated to the TESTED `parseCsv` seam
  (RFC-4180 quoted cells with embedded commas import WHOLE — the naive
  `row.split(",")` silently corrupted them into wrong names + shifted
  columns) + the store's `importContacts` batch (ONE slice refetch
  after the loop — the per-row `createContact` refetch was O(N²)
  network); the upload POST's `uploadsDir()` mkdir + `writeFile`
  wrapped in try/catch → `ERR.INTERNAL()` (ENOSPC/EACCES mid-upload
  stays in the envelope); all four rate-limited auth routes run
  `sweepRateLimits()` (it ran only from login — the signup/verify/
  resend buckets were swept only when someone next logged in); and the
  `bun run gate` umbrella script chains the documented gate order as
  one package script. Proof-coverage completion: the reset POST joined
  the containment pins (the `$transaction` can no longer slide out of
  the try unseen — it had only the s36 presence-style pin), the
  settings-GET pin gained its `toMatch(readSettings)` presence check
  (it was vacuously satisfiable — `allInsideTry` returns true when the
  regex matches nothing), the auth-family containment regex extended to
  the wrapped reads (`findUnique`/`count`), and the health route's
  `db.$queryRaw` got an explicit containment pin (the `DB_CALL` regex
  misses Prisma `$`-APIs). Pinned by `tests/api-robustness.test.ts`
  (87 checks) + `tests/gate-script.test.ts` (3) + the new quoted-comma
  import e2e. Deferred with sharpened rationale: the non-FK
  asString/asDate/asNumber coercion surface (dueAt/status/value/endAt —
  silent mutation on PUT, the deliberate FK-first scope), the CSV
  formula-injection + embedded-quote family (the byte-exact reference
  format is itself the pinned contract — lands with the deploy-posture
  decision), the signup admin TOCTOU race, the dead exported api.ts
  helpers, hydrate error vs logged-out, the login/verify timing
  side-channel, the upload MIME trust (contained: extension lock +
  nosniff + randomUUID names).

- **The error-semantics + gate-integrity layer (session-39)** — the
  re-audit verified all six session-38 fix families genuine but found
  the gate script's own header claim FALSE in the reuse scenario
  (`reuseExistingServer: !process.env.CI` reuses a leftover :3100
  standalone listener regardless of the preceding `bun run build` — a
  running process holds the OLD code in memory while the rebuild swaps
  static assets underneath, so `bun run gate` could go green on stale
  server code): the e2e step now runs under `CI=1` (fresh boot + kill
  on exit; plain `bun run test:e2e` keeps the reuse ergonomics for
  iteration). The Import dialog's failure banner conflated "every
  POST failed" (expired session, network drop — `call()` swallows the
  fetch rejection) with "the CSV had no valid rows": both rendered
  "No valid contacts found…"; `importContacts` now returns
  `{ created, attempted }` and the banner is the reference's own
  "Failed to import contacts. Please try again." when rows were
  attempted but none landed (LIVE: a fetch-rejecting probe through the
  real dialog; E2E: the 108th check drives it with route.abort). The
  profile `save()` gained the try/catch/finally its sibling upload
  always had — a network throw no longer strands the Save button busy
  with no toast (LIVE-verified via the same fetch patch). The signup
  name family completed: `{"name": 123}` is a 400 "Invalid name"
  instead of silently deriving (the photoUrl guard's shape, one field
  over), and the DERIVED name is capped at the explicit-name ceiling
  of 80 (LIVE: a 140-a local part derives exactly 80 chars). The lint
  gate enforces `--max-warnings 0` — the documented "lint 0/0"
  standard is load-bearing, not conventional. The sweep placement on
  the three s38 auth routes moved before the denied return (login's
  exact placement — denied requests sweep too; the code finally
  matches its own "mirrored" comment). The auth-reads containment
  pin gained its presence pairing (`allInsideTry` is vacuously true
  on zero matches). Test hygiene: the quoted-comma e2e cleanup now
  deletes ALL matching emails (Contact.email is not unique — a
  leftover probe from an aborted run poisoned the next run's final
  assertion), and the toolbar Import clicks use `exact: true` (a row
  named "E2E Import" gives its Call/Email/WhatsApp/Actions buttons
  substring matches — a 5-way strict-mode violation that only
  surfaced mid-suite, never in isolation). Deferred re-confirmed
  (zero graduations, all 20 ledger rationales hold at f7aac8c): the
  non-FK coercion family is first in line for session 40 if the
  operator wants family symmetry; the Excel .xlsx accept stays — the
  file-input vocabulary is the S26-P6 pinned reference contract.

- **The non-FK coercion-guard layer (session-40)** — the graduation
  audit's headline quantified the family at 37 silent PUT members +
  40 silent POST members (the ledger's "~15 PUT sites" UNDERCOUNTED —
  the 19 `?? null` optional-string clears were never counted), every
  one the isBadFK class one parse-shape over: a present non-string
  (or, for dates, an unparseable string; for numbers, a boolean/array
  payload through `Number()`'s truthy edges) rode the lenient parse
  helpers into a SILENT mutation. Three LIVE-proven examples before
  the fix: `PUT {"status": 123}` on a contact silently reset
  "inactive" → "active" (contacts/[id]:94 had NO type guard and NO
  enum check — `CONTACT_STATUSES` was not even imported);
  `PUT {"defaultCurrency": 123}` on settings stored `""` through a
  DEAD `?? "AED"` fallback (the non-optional `asString` returns ""
  and "" is not nullish — the s38 signup lesson with four unapplied
  instances); `PUT {"endAt": {}}` on an event cleared the end time
  AND bypassed the s36 end≥start invariant (a null effectiveEnd
  skips the merged-record check). THE FIXES (S40-P1..P6, RED-first —
  exactly the predicted 57 failing pins before the code): P1 the
  three predicates in `src/lib/api.ts` — `isBadString` (the general
  isBadFK mirror), `isBadDate` (stricter: garbage STRINGS are bad
  too; `""` stays the explicit clear), `isBadNumber` (finite numbers
  + numeric strings good; `true`/`[5]`/`[]`/`" "` bad) — with
  behavior tests on the real edge matrix (`tests/coercion-guards.test.ts`);
  P2 the PUT-side sweep at 30 field sites across the five [id]
  routes (email/phone/company/position/source/industry/website/
  notes/relatedType/relatedName/description/location strings,
  role/engagementLevel/companySize classifiers, the four dates, the
  three numerics) + the contacts `status` type guard AND its
  `CONTACT_STATUSES` membership; P3 the settings quartet's
  `optional: true` revival (the fallbacks are live again — `""`/
  null now default instead of storing "") + the five settings
  guards; P4 the POST-side inventing twins (leads value/dates,
  accounts revenue/employees, activities dueAt — which silently
  invented NOW — events endAt); P5 login's `findUnique` +
  cookie-set tail joined the envelope (the last unwrapped auth
  read; login also joined the auth-reads containment it.each); P6
  hygiene — the dead `asRequiredString`/`asOneOf` exports deleted
  and `exact: true` on the two earlier import tests' toolbar
  clicks. The UI-payload census proved the surface API-only (every
  real writer sends typed values), so no UI path can trip a guard.
  Pinned by `tests/coercion-guards.test.ts` (11) +
  `tests/api-robustness.test.ts` (143 checks now — +47 s40 rows).
  Deferred re-confirmed: the POST-side enum defaults + string nulls
  (lenient-create, no data destroyed), the strict-bool
  `isKey`/`allDay` idioms, the CSV injection family (deploy-posture),
  the Excel accept (S26-P6 parity), the partial-import success
  conflation (reference-atomic, vocabulary-pinned).

- **The POST-side lenient-create + export-integrity layer (session-41)**
  — the graduation audit's headline: the ledger's "lenient-create, no
  data destroyed" rationale was FALSE as stated — a present non-string
  payload IS silently destroyed on POST (`{"phone":123}` → 200 +
  `phone:null`, the caller's data dropped without error;
  LIVE-proven), and the 12 enum-field type-gaps silently invent
  defaults (`{"stage":123}` → 200 + "new"; `{"type":{}}` → "call").
  THE FIXES (S41-P1..P5, RED-first — exactly 39 failing pins before
  the code): P1 the 31 `isBadString` guards across the five POST
  routes (the 19 string-null sites + the 12 enum type-gaps — each the
  exact PUT twin's predicate + message, ZERO new vocabulary; the
  `source` enum-MEMBERSHIP question stays deferred: source is a
  settings-configurable vocabulary and the CSV import sends arbitrary
  source strings); P2 the RFC-4180 `qq()` cell-quoter in
  `src/lib/entity-export.ts` (the three builders' plain `"${v}"` wrap
  produced MALFORMED CSV for quote-bearing values — `Acme "Best" Inc`
  shifted columns on re-parse, corrupting our own export→import
  round-trip; the fix is byte-identical for every quote-free cell, so
  the pinned reference format is untouched); P3 the Deals-at-Risk
  join went case-insensitive in `reports-data.ts` (the dialogs send
  lowercase "opportunity", the seed stores "Opportunity" — a UI-logged
  activity NEVER joined the table; the reference joins on a real FK);
  P4 `requireSession()`'s shared session read + auth/me's direct read
  joined the envelope (a DB-down session read answered a raw non-JSON
  500 on EVERY protected route); P5 hygiene — the dead `sources` var
  (contacts-page) + the stale `DEFAULT_SETTINGS` export (constants.ts,
  still the pre-s28 emoji vocabulary) deleted, and isBadNumber's
  NaN/Infinity edge matrix pinned. The UI-payload census held (the
  e2e drove no guard). Pinned by tests/api-robustness.test.ts (176
  checks now — +33 s41) + tests/entity-export.test.ts (+5) +
  tests/reports-data.test.ts (+2) + tests/coercion-guards.test.ts
  (+2). Deferred re-confirmed: the GET list routes' reads (the
  session-42 family-symmetry candidate), the 2 source enum sites, the
  CSV formula-injection half (deploy-posture — the operator's
  (a) parity / (b) =@tab-CR / (c) full-OWASP decision), the 11 e2e
  sleeps, the standing ledger.

- **The GET-list envelope + silent-clear completion layer (session-42)**
  — the family-symmetry graduation: the ELEVEN GET list routes joined
  the envelope (the five entity lists, opportunities, users, dashboard,
  reports, search, export — the last raw reads in the app; a
  SQLITE_BUSY-class failure during a list read answered a raw non-JSON
  500 the store degraded to "Request failed (500)"). THE FIXES
  (S42-P1..P6, RED-first — exactly 24 failing pins before the code):
  P1 the 11 per-route try/catch wraps (NOT a HOC — the pin machinery
  slices `export async function ${verb}`; the dashboard/reports/search
  Promise.all families ride a type-safe IIFE-wrap + null-guard, every
  derivation below the reads being pure); P2 `isBadBool` + the four
  strict-bool sites (accounts isKey POST/PUT, events allDay POST/PUT —
  `{"isKey":"yes"}` silently stored FALSE and silently DE-KEYED a key
  account on PUT, LIVE-proven; the UI writers are real checkbox
  booleans, the surface API-only); P3 the activities/[id] PUT's
  missing `contactId`/`accountId` branches (a PUT FK was silently
  IGNORED — the contacts/[id] shape + the POST's existence
  vocabulary; the s37 FK_SITES census row the sweep missed); P4 the
  contacts PUT `{"status":""}` silent reset closed (the only
  optional-parse enum whose `??` default passed membership — the
  sibling-enum non-optional shape now); P5 hygiene (the dead
  CONTACT_SOURCES import + EDIT_SOURCE_OPTIONS export deleted, the
  settings `?? "monday"` dead fallback removed, the two s41-P4 pins
  strengthened to allInsideTry containment); P6 the bare-request
  period default (LIVE-discovered during verification: a GET
  /api/reports without an explicit period answered 400 "Invalid
  period" — the `?? "quarter"` defaults were dead code, unreachable
  since `asString(null)` returns `""`; the optional parse makes the
  documented default reachable in reports + export). Pinned by
  tests/api-robustness.test.ts (212 checks now — +16 s43) +
  tests/topbar-search.test.ts (+2). Deferred re-confirmed: the 2
  source enum-membership sites (the vocabulary-reconciliation product
  decision), the reports/export filter membership asymmetry (owner is
  an arbitrary NAME STRING — membership impossible; source is the
  fragmented vocabulary; garbage filters yield EMPTY reports, GET-only,
  no corruption), the CSV formula-injection decision for the operator,
  the 11 e2e sleeps, the standing ledger, the signup-page session read.

- **The Lead.contactId + settings-quartet + dead-?? completion layer
  (session-43)** — the last silently-dropped payload field: `Lead.
  contactId` was carried by the schema AND the wire type but NO leads
  route accepted it (LIVE-proven: POST `{"contactId":<id>}` → 200 +
  null on BOTH verbs — the N-42b shape one level up; the wire type has
  no `contact` object, so no include changes). THE FIXES (S43-P1..P5,
  RED-first — exactly 20 failing pins before the code): P1 the FK
  branch pair on both leads routes (the s42-P3 activities shape
  verbatim + the FK_SITES census rows); P2 the NINE dead `??
  "<enum>"` fallbacks removed from the [id] PUT routes (leads stage,
  activities priority/type/status, events type/status, accounts
  status/tier, contacts priority — non-optional `asString` returns ""
  never undefined, so the fallbacks were dead; behavior-identical, the
  enums already 400 on ""; the auth `?? ""` twins are TYPE-load-
  bearing and stay); P3 the settings defaults quartet (defaultLeadStage
  vs LEAD_STAGES + defaultTier vs ACCOUNT_TIERS + calendarView vs
  month/week/agenda — a poisoned default used to save verbatim and
  flow into the create dialogs' initial values, LIVE-proven; plus the
  firstDayOfWeek isBadString guard); P4 the topbar global search's
  debounced fetch — the ONLY unwrapped fetch in src — joined the
  try/catch family (a network failure stranded an unhandled rejection
  + stale results; the catch resets results + dropdown); P5 the events
  GET `from`/`to` window params reject garbage (400 "Invalid from/to
  date" — the filter used to silently DROP, returning everything).

- **The health/status + clear-parity layer (session-44)** — the last
  dead schema field + the UI clear family. `Account.health` was
  carried by the schema, wire type, seed and the badge/CSV readers
  but silently dropped by BOTH accounts verbs (LIVE-proven: POST
  `{"health":"At Risk"}` → 200 + "Healthy" — the stored badge frozen
  at its seed value forever; the N-43a shape one model over) — now
  accepted + membership-validated on POST + PUT against the new
  `ACCOUNT_HEALTH_STATUSES` constant. The contacts POST `status`
  silent drop closed (the PUT has accepted it since s42-P4; every
  contact was created "active" regardless of payload — the
  N-42b PUT-accepts-POST-drops mirror). THE UI CLEAR-PARITY SWEEP
  (F-44a, parity-PROVEN live both directions on the reference: the
  reference's edit dialog PERSISTS clears — a cleared description
  stays "", Related To "None" clears back to the placeholder; our
  dual-verb dialogs mapped emptied fields to `undefined`, which
  JSON.stringify DROPS, so the PUT's `"X" in body` branch skipped
  and the OLD value persisted while the save toasted success):
  21 payload mappings across all five dual-verb dialogs (account
  industry/email/phone/website/annualRevenue/employees/ownerId,
  contact accountId, lead email/phone/company/source +
  expectedCloseDate/nextFollowUp, event description/location/
  relatedType-"none"/endAt, activity notes/relatedType/relatedName)
  now map empty → null (and "none" → "") — the EntityEditDialog
  pages' own convention applied to the layer that missed it;
  behavior-identical on create (null/"" ≡ absent through the
  optional parses). Plus: the reports saveReport localStorage write
  joined the leads-page saveView guard convention (a quota/private-
  mode failure toasts "Could not save report" instead of throwing
  uncaught through the React event handler); the topbar search
  resets on a non-ok envelope too (a JSON 401/500 body no longer
  silently strands stale results — only network rejections hit the
  s43 catch); and the reports' dead account include removed (the
  leads findMany fetched `account: {select: {name: true}}` only for
  serializeLead to overwrite it with `account: null` — a wasted LEFT
  JOIN on every reports read; the owner include stays).

- **The unwrapped-surface + stale-response layer (session-45)** — the
  last rejectable `void`-async + the stale-response family. The reports
  PDF button's `onClick={() => void exportReportsPdf()}` was the ONLY
  genuinely rejectable discarded promise in src (`pdf-export.ts` has no
  internal catch; html2canvas-pro rejects on huge-canvas/memory failures
  and mid-capture DOM mutations — an unhandled rejection + a
  dead-feeling button with no toast) — now carries the s44-P4
  convention: `.catch(() => toast.error("Could not export PDF",
  "Please try again."))`, happy path unchanged. The localStorage READ
  guards complete the s44 write-guard family (F-45b: exactly 2 unguarded
  reads repo-wide, both inside uncaught setTimeout callbacks —
  `listSavedReports()` and the leads saved-views mount timer; merely
  touching `window.localStorage` throws SecurityError under
  all-cookies-blocked Chromium) — both now ride try/catch and fall back
  to the empty list (the first-paint default). The topbar search gained
  its AbortController (N-45c: the 250 ms debounce prevented same-window
  timer races, not out-of-order resolutions — "ab" fires A, "abc" fires
  B, A resolves last → stale "ab" results overwrote B's): one
  controller per effect run, `signal` on the fetch, `controller.abort()`
  in the cleanup, the aborted early-return in the catch (only a REAL
  failure resets — the s43-P4 reset unchanged). The calendar
  `fetchEvents` gained a last-call-wins token (F-45e: it was
  last-RESOLVED-wins — rapid month flips could strand the stale month's
  slice; a monotonically increasing module token, the set guarded by
  `token === eventsFetchToken`; the hydrate → calendar-effect handoff
  resolves in the calendar's favor, the correct owner; LIVE-verified
  both directions — 3 rapid flips to January 2027 show zero chips
  under January's grid, flipping back restores October's 11 seeded
  chips). The format.ts hygiene pair (F-45c/d): three dead exports
  removed (`formatCompactNumber`/`monthName`/`monthShort` — zero
  callers in src + tests) + `formatMonthYear` gained the sibling NaN
  guard (`"not-a-date"` → `"—"`, was `"undefined NaN"`).

- **The mutation-feedback + settings-write + dialog-repair layer
  (session-46)** — the F-46 audit trio + the two LIVE-discovered
  pre-existing bugs. The mutation-failure silence family (F-46a: the
  store's `call()` is total and toasts NOTHING — an accounts-page
  comment falsely claimed a global toast — while entity-dialogs,
  profile and the settings editors toast every failure): ten
  page-level sites now carry the convention (`toast.error("Could not
  save/delete/update X", res.error)` — three EntityEditDialog submits
  that used to strand the dialog open on a failed PUT, five inline
  deletes, two fire-and-forget inline mutations; importContacts was
  already handled by the s39-P2 banner). The settings write seam
  (F-46b: the reference mirrors an immediate-PUT-per-change idiom but
  validates nothing — OUR s43-P3 membership guards collided, a red
  toast per keystroke while typing a stage name): the DefaultsEditor
  now rides ONE shared 500 ms trailing debounce with a serialized
  flush chain (a `flushing` guard + re-schedule-on-completion — two
  PUTs can never race within the editor) and an unmount flush (a
  typed edit is not lost on navigation); the no-save-button parity
  line holds. The picklist rollback (F-46c): a failed add reverts its
  phantom chip, guarded by reference equality so a user who kept
  editing is never clobbered; the settings remount keys moved off
  JSON length onto the full serialization (same-length snapshots
  could collide). The topbar envelope reset made abort-aware
  (N-46a: `else if (!controller.signal.aborted)` — the same handoff
  semantics the s45-P3 catch carries; the s44-P5 pin evolved with it,
  intent preserved). The hygiene pair: the unused `leads`
  destructure + the dead `?? a.createdAt` tail removed. The two
  LIVE discoveries: **F-46f** the three EntityEditDialogs opened with
  EMPTY fields (the `form` useState captured the empty `initial` at
  PAGE MOUNT — no key, no re-sync; masked by F-46a because the empty
  submit 400'd silently) — fixed with `key={editTarget?.id ??
  "none"}` (the settings editors' own keyed-remount convention);
  **F-46g** the ghost dialog under every row-menu action (the custom
  Dropdown renders items in a Radix Popover portal and React
  synthetic clicks on portal content bubble through the REACT tree
  to the TableRow's onClick — Edit/View-Insights/Delete ALSO opened
  the row-click dialog) — fixed with click containment in
  `DropdownContent` itself (`e.stopPropagation()` composed after
  `{...props}`; item handlers unaffected, LIVE-verified via View
  Insights).

- **The export-rewire + vocabulary + feedback layer (session-47)** —
  the F-47 audit quartet. The dashboard export rewire (F-47a, MED:
  the five affordances — the outline Export's four menu items + the
  primary Export — rode `downloadFile("/api/export?type=…")`, dead
  since the s29 route re-scope 400s every non-report type, so every
  click NAVIGATED the browser to the raw 400 JSON body; the
  reference's own trio is dead — bundle-verified — ours is the
  documented functional superset): all five now build CLIENT-SIDE
  CSVs via the pages' own conventions verbatim (leads:
  `unquotedHeaderCsv` 8-col `leads_ISO.csv`; contacts:
  `toQuotedCsv` 7-col `contacts_ISO.csv`; accounts: `toQuotedCsv`
  10-col `accounts_ISO.csv`; activities: the settings raw-dump
  `activity_ISO.csv`) — zero `/api/export` references remain, and a
  NEW download e2e closes the coverage gap that hid the bug for 18
  sessions. The insights icon vocabulary (F-47b: the dialog compared
  Capitalized `"Email"`/`"Call"` against our lowercase storage —
  every activity row fell to the purple CalendarDays fallback; the
  REFERENCE stores Capitalized types so ITS comparisons match ITS
  storage): the six comparison sites lowercased, the tint classes +
  icon mapping verbatim — email/call now render their blue Mail /
  green Phone icons. The leads inline-edit feedback (F-47f: the three
  s29-P2 onChange arrows called `updateLead` fire-and-forget — a
  failed PUT silently reverted the user's edit; missed by the s46
  census because arrows, not async/awaits): the three sites chain
  `.then(onLeadEditResult)` into ONE shared 500 ms debounced failure
  toast (the s46-P2 lesson — a failing per-keystroke burst on the
  value input collapses into a single "Could not update lead"), with
  an unmount cleanup. The topbar hygiene (N-47g): the dead Dropdown
  import block removed (only the Menu* family is used; lint-invisible
  because no-unused-vars is off).

- **Session-48 (SKILL v1.45.0)** — the two long-deferred operator
  decisions landed, both evidence-first. (1) The CSV formula-injection
  posture (b): a shared `guardFormulaPrefix` in `csv.ts` (cells whose
  first char is `=`, `+`, `@`, tab or CR gain the Excel `'` text marker
  INSIDE the quoting) applied in `escapeCell` AND imported into
  entity-export.ts's `qq` — both export families guarded by one helper;
  safe cells byte-identical (the s41-P2 precedent), `-` deliberately
  excluded (negative numbers / dash text stay exact), the three static
  import templates and the import parser untouched (our own content /
  the reference's arbitrary-string surface), the round-trip `'`
  documented and pinned. (2) The source-vocabulary reconciliation:
  DOCUMENTED PARITY, not a merge — NEW bundle evidence (the reference's
  settings contactSources is an entity-backed CRUD list whose ONLY
  consumer is the settings page itself) closes the seven-session
  deferral: the src-dead CONTACT_SOURCES constant + its
  self-contradicting s5 comment removed (the living
  CONTACT_SOURCE_OPTIONS/SOURCE_PAIRS stay pinned where they live), NO
  enum-membership on the routes' source (free-form, string-ness + 40
  chars — the reference accepts arbitrary import strings), the settings
  Capitalized defaults verbatim, the whole posture recorded in-file at
  constants.ts + settings/route.ts + both validation routes. Plus two
  audit findings fixed: the insights dialog's type badges render
  ACTIVITY_TYPE_META labels (Call/Meeting — the reference's display
  case from our lowercase storage, N-48b), and the reports header
  Export CSV — the F-47a mechanism's last instance — left
  `downloadFile`'s window.location.href (a non-200 navigated to the raw
  JSON envelope) for the fetch→blob flow with the s46 failure toast,
  the Content-Disposition filename, and a BOM-preserving `ignoreBOM`
  decode (res.text() STRIPS the BOM — TextDecoder default — the e2e's
  first run caught it); `downloadFile` retired (zero consumers; the
  navigation seam left the codebase) + a new download e2e closing the
  zero-coverage gap.

- **Session-49 (SKILL v1.46.0)** — the pointer-(a) filter-membership
  decision + the stage∧status parity fix. (1) The reports/export
  filter validation (deferred since the s46 audits): the
  genuinely-CLOSED vocabularies membership-check through the envelope —
  stage vs OPPORTUNITY_STAGES (a typo'd stage used to answer a
  silently EMPTY report), status vs the new shared REPORT_STATUSES
  constant (a typo'd status used to be a silent NO-OP — the
  where-builder's else-branch dropped the filter and EVERYTHING came
  back, the s42 strict-bool class); owner (the data-dependent
  name-string join — a renamed owner would 400 stale saved views) and
  source (the s48 free-form parity) stay deliberately OPEN with the
  rationale recorded in-file at both routes; the saved-view Load
  normalizes stale stage/status (normalizeSavedStage/Status — the s32
  normalizeSavedPeriod precedent) so a Load never 400s. (2) The
  stage∧status AND-semantics fix (N-49n, an 18-session-old divergence
  found by decoding the reference's filter predicate — bundle
  `D&&$&&V&&B&&R`, independent conjuncts): the object-spread
  where-builder let the status branch OVERWRITE a concurrent stage
  filter (stage=prospecting&status=won returned every closed_won; the
  reference returns the empty intersection) — both routes now AND-wrap
  the status conjunct, with a new e2e proving the zero intersection on
  the seeded data. (3) The 12 e2e sleeps retired to 2 annotated
  no-op-contract keeps (the More... dead button + the reset decline):
  5 deleted as redundant (the following assertions already poll), 4
  replaced by deterministic response-waits (the settings/dashboard
  hydrations + the two post-wipe proofs asserted on the RESPONSE BODIES
  — a bare $0/empty-state DOM poll is vacuous under the
  instant-render-with-zeros contract), 1 race-free reorder (the reset
  accept), and the N-48e near-vacuous `toContain("/")` tightened to the
  file's own toHaveURL idiom. (4) The leads inline-edit stale failure
  toast (N-48d): the clearTimeout hoisted above the ok early-return —
  a later success within the 500ms window cancels the pending error.
  (5) The src-dead LEAD_SOURCES twin removed (the s48 CONTACT_SOURCES
  precedent; the pin re-anchored to the living LEAD_SOURCE_OPTIONS).
  Plus the four stale `downloadFile` doc carriers corrected
  (CLAUDE/AGENTS/SKILL ×2 — the anti-pattern now routes the blob
  family) and the s48 pin-file header's res.text() narration corrected
  (N-49b).

**Session-50** (the dead-mode retirement + INFO-triage layer): (1) The
N-47d closure — the three CREATE dialogs
(ContactDialog/AccountDialog/LeadDialog) are now create-only: their
dual-mode machinery (the contact/account/lead entity props, the
createMode locals, the ~170-line `!createMode` edit branches, the
update-verb submit ternaries, the "Edit X"/"Save Changes" ternaries)
was UNREACHABLE since the s28 EntityEditDialog family took over
editing — every caller passed `setEditing(null)` only, and the
reference itself never reuses its create dialogs for editing. The
three pages' dead `editing` states are gone; EventDialog and
ActivityDialog KEEP their dual-mode (their edit modes are live —
activities + calendar). Pinned by tests/create-dialog-single-mode.test.ts
(RED-first: 4 failing pins + 2 green-through-RED guards, proven
non-vacuous in a pre-fix worktree). (2) The INFO family triaged:
F-47c, N-48c, N-48f, N-48j all KEEP with rationale (documented
parity / as-planned / maintainability); N-47d closed. (3) The four
docs-accuracy carriers fixed (CLAUDE's e2e table count 110→111, PAD's
golden-path row 93→94, SKILL §4.4's stale LEAD_SOURCES inventory
entry, AGENTS' removed source-vocabulary constants → the living
OPTIONS pair).

**Session-51** (the calendar window + KPI-baseline layer): (1) The
N-51a fix — the calendar's month-flip fetch window is now the pure
seam `calendarFetchBounds(year, month)` in `src/lib/format.ts`: `from`
keeps the deliberate full-prev-month over-coverage while `to` covers
the UNTRIMMED 42-cell Sunday-anchored grid's final cell, so the
trailing next-month cells (up to 6 days into the next month, e.g. the
Nov 2026 view renders Dec 1-5) keep their events after a month flip —
the old month-end bound (`endOfDay(new Date(year, month + 1, 0))`)
lost them because the s45 last-call-wins token makes the windowed
fetch authoritative. LIVE-verified end-to-end (create on a trailing
cell → flip away and back → the chip persists → delete → zero
residue; the pre-fix behavior — the chip vanishing after the flip —
was accidentally witnessed live through a zombie dev server from a
prior session, a perfect A/B). (2) The N-51b fix — the calendar KPI
trend baselines (`yesterdaysEvents`, `meetingsLastWeek`,
`callsLastWeek`) now read `visible` (the filtered set), the same
population as the currents, so a filtered view no longer compares a
filtered current against an unfiltered baseline; the no-filter
behavior is byte-identical, and the reference's own "Total Events"
pseudo-delta quirk is untouched. Both pinned RED-first by
tests/calendar-fetch-bounds.test.ts (4 failing pins + 1
green-through-RED guard, proven non-vacuous in a pre-fix worktree).
(3) The four docs/comment carriers (PAD's mobile-nav "(5 checks…)"
→ 7, PAD's frozen repo-tree test counts → 74 suites/1171+111, the
entity-dialogs.tsx file-header's "keyed by entity id" pattern comment
re-worded for the create-only reality, AGENTS' stale chart-placeholder
bullet → the session-10 real-chart-at-zero contract).

**Session-52** (the saveView purity + docs-carriers layer): (1) The
N-52c closure — the leads-page `saveView`'s `localStorage.setItem`
hoisted OUT of the `setSavedViews` updater into the handler body
(`const next = [...savedViews, { name, filters }]` → the guarded write →
`setSavedViews(next)`): updaters stay pure (React may re-invoke them;
the storage side effect now runs once per call — the reports-page
`saveReport` convention, S44-P4). Behavior-identical: the view still
joins the in-memory list when storage is blocked (the toast reports the
persistence failure), the prompt flow + the reload-decode path
unchanged — LIVE-verified with a save → list → reload → persist →
remove round-trip, zero residue. Pinned RED-first in
`tests/storage-read-guards.test.ts` (the updater-purity source pin:
the `const next` form present + no storage access after the
`setSavedViews(` call), proven non-vacuous in a pre-fix `6ce8572`
worktree (1 failed | 3 passed there, 4/4 at the fix). (2) The four
docs-accuracy carriers (N-52a: PAD's per-file inventory row + SKILL
§5.5 + SKILL Bug #1's fix line — the three sibling "5 checks"
mobile-nav rows → 7; N-52b: README's Tested row — the frozen
session-45 leading pair "1095 + 108" retired for the current counts).
Audits: the s51 re-audit verified all ten checklist items GENUINE
(the seam + the rewire + the baselines + the pin file + the four
carriers, the worktree arithmetic reproduced); the graduation audit:
ZERO graduations — 13/13 re-confirmed (9th consecutive session; the
only drift a +2 comment-driven line translation in entity-dialogs);
the INFO family unchanged; both standing operator decisions re-verified
UNCHANGED (the CSV formula-injection posture (b) + the source-vocabulary
documented parity — the bundle byte-identical for the 23rd consecutive
session).

**Session-53** (the census-seam + hygiene layer): (1) The N-53b closure
— `scripts/census.ts` + `bun run db:census`: the sanctioned DB census
goes through the app's own db singleton (`src/lib/db`, re-anchored by
`runtimeDatabaseUrl`) and PRINTS the resolved path + the per-model
counts + the seed-contract verdict (exit 1 on drift). The live proof of
why: a raw `new PrismaClient()` from the repo root opens the
SANDBOX-ROOT mirror db — not the repo's — under BOTH node (relative
`file:` URL resolved against the process CWD) and bun (.env
absolutization; the leftover outer `.env`'s absolute URL was a second
redirection of the same class), and a SQLite engine opening a missing
mirror path CREATES an empty db there. The session-53 intake census
fell into exactly this trap (read the mirror's zombie-era PROBE51 as
repo residue — N-53a, RETRACTED after the `PRAGMA database_list`
forensics showed the engine's true file; the repo db was pristine all
along and the s51/s52 zero-residue claims were TRUE). (2) The N-53c
orphaned-import retirement — eight s27-era imports whose only in-file
reference was the import itself (calendar-page ×7: Clock, Badge,
EVENT_TYPE_META, EVENT_STATUS_META, formatTime, timeUntil, EMPTY_STATE;
leads-page ×1: CHART_COLORS) — plus the now-src-dead EVENT_STATUS_META
constant retired from constants.ts (the s48/s49 precedent). (3) The
N-53d never-caching useMemo retired — the leads-page wonVsLost series
(deps [won, lost] were fresh filtered identities every render)
extracted VERBATIM to the module-scope `buildWonVsLost(won, lost)` and
called plainly (the sibling pipelineByStage idiom). All pinned RED-first
in the new `tests/db-census.test.ts` (4 pins) + the dead-code-hygiene
session-53 describe (4 pins), proven non-vacuous in a pre-fix `fe975d6`
worktree (8 failed | 2 passed there, 10/10 at the fix). Audits: the s52
re-audit verified all seven checklist items GENUINE (the worktree
arithmetic reproduced); the graduation audit: ZERO graduations — 13/13
re-confirmed (10th consecutive session; the drift map EMPTY); both
operator decisions re-verified UNCHANGED (the CSV posture (b) + the
source-vocabulary parity — the bundle byte-identical for the 24th
consecutive session).

**Session-54** (the dead-vocabulary retirement + calendar-memo layer):
(1) The N-54b closure — eleven src-dead vocabulary exports retired from
constants.ts with record comments (the fully-dead seven: OPEN_STAGES,
isClosedOppStage, CONTACT_SOURCE_LABEL, LEAD_EDIT_STATUSES,
LEAD_EDIT_SOURCES, TIER_META, PRIORITY_META; the test-only four:
DROPPED_STAGES + isDroppedStage [the s5 "dropped = lost +
unqualified" reading the live S29-P5 KPI contradicts — "Dropped Deals"
counts `lost` STRICTLY], REPORTS_PIPELINE_SLUGS + FUNNEL_STAGES
[redundant with reports-data.test.ts's ordered arrays + LEADS_FUNNEL],
ACCOUNT_EDIT_STATUSES [the stale wce decode — the live select maps
ACCOUNT_STATUSES]) — the s48/s49 retirement policy EXTENDED per the
standing source-vocabulary operator decision; the five stale pins
removed or re-anchored to the living surfaces (the
Dropped-equals-lost-STRICTLY filter; the ACCOUNT_STATUSES select
wiring). (2) The N-54a calendar memo family — the `visible` useMemo
(deps included the fresh activeTypes/activeDates identities) + the
transitively never-caching `eventsOn` useCallback extracted/retired to
the plain forms (`buildVisibleEvents` module-scope, the s53-P4 idiom).
(3) The census MATCH banner now DERIVES from EXPECTED (N-54d — the
hardcoded "15/24/10/23/12" literal could drift stale) + the db-census
pin strengthened to pin the `database: ${url}` print form (N-54e).
(4) The ghost-action dead-affordance annotations (N-54f — the contacts
Call/Email/WhatsApp trio + the calendar Phone/Message pair carry no
onClick in the reference's own bundle, verified this session; the leads
Convert-item precedent). (5) The month-flip trailing-cell e2e (the s51
suggested-next): a next-month event created on a trailing cell through
the dialog PERSISTS the month flip (the N-51a fetch-window proof
end-to-end), deleted via the Demos-filtered agenda with zero residue.
Docs carriers: the AGENTS vocabulary row corrected to the live truth +
PRIORITY_META dropped (N-54g), the SKILL §4.4 inventory fixed (N-54c:
STAGE_META is 8 stages). All pinned RED-first (5 RED + 3 guards, 7 new
its + 5 stale its retired), proven non-vacuous in a pre-fix `d928a30`
worktree (5 failed | 11 passed there, 16/16 at the fix). Audits: the
s53 re-audit verified all eight checklist items GENUINE (the worktree
arithmetic reproduced); the graduation audit: ZERO graduations — 13/13
re-confirmed (11th consecutive session; the drift map EMPTY); both
operator decisions re-verified UNCHANGED — the CSV posture (b) STANDS,
the source-vocabulary documented parity STANDS AND EXTENDS to the
N-54b family (the bundle byte-identical for the 25th consecutive
session).

**Session-55** (the orphaned-import + test-only-seam retirement): (1)
The N-55a closure — reports-page.tsx carried FOUR lint-invisible
orphaned imports (KpiCard, RevenueLineChart, ConversionFunnel,
CHART_COLORS — each exactly one in-file reference = the import itself;
the N-53c class, this file simply was not in the s53 sweep's file set)
narrowed away with a record comment; the s53 leads-page record
comment's stale "the reports page owns the palette" claim corrected
(N-55e — the palette is shared page.tsx/activities/accounts). (2) The
N-55b/N-55c test-only-seam retirements — the s48/s49/s54 retirement
policy extended to seam-level helpers per the standing
source-vocabulary operator decision: format.ts avgDaysBetween +
percentDelta (zero non-test consumers; the live derivations are the
leads-page inline avgCycle + the KPI_STATICS statics) and lead-filters.ts
encodeLeadFilters + decodeLeadFilters (src-dead since the s29
saved-views supersession — the page persists the VIEWS LIST; the list
decoding validates through the same internal asFilters). The four
encode/decode behavioral its RE-ANCHORED to the living
encodeSavedLeadViews/decodeSavedLeadViews pair (the s54
ACCOUNT_EDIT_STATUSES precedent — the legacy-vocabulary + malformed
rejections stay pinned where they live); the format analytics its
retired with their dead subject. (3) The PAD lead-filters row corrected
to the living storage key `neo-crm.leads.views` (N-55d). All pinned
RED-first in the dead-code-hygiene session-55 describe (4 RED + 1
guard, +5 its − 3 stale its = 1184 total), proven non-vacuous in a
pre-fix d4b6a61 worktree (4 failed | 55 passed there, 59/59 at the
fix). Audits: the s54 re-audit verified all nine checklist items
GENUINE (the worktree arithmetic reproduced); the graduation audit:
ZERO graduations — 13/13 re-confirmed (12th consecutive session; the
drift map EMPTY); both operator decisions re-verified UNCHANGED — the
CSV posture (b) STANDS, the source-vocabulary documented parity STANDS
AND EXTENDS to the seam-level test-only family (the bundle
byte-identical for the 26th consecutive session).

**Session-56** (the orphaned-import sweep + the dead-module retirement):
(1) The N-56a closure — TWELVE more lint-invisible orphaned imports
narrowed away across six files (contacts ×6: Pencil, Avatar,
DropdownSeparator, FILTER_RAIL, ENGAGEMENT_LEVELS, timeAgo; accounts
×1: DropdownSeparator; activities ×2: Cell, Avatar; the dashboard ×1:
EMPTY_STATE; the reports route ×1: addMonths — orphaned since s31;
charts ×1: the dead-since-initial-commit `import * as React`), each
with exactly one in-file reference (the import itself; eslint has
BOTH no-unused-vars rules off, so only source-reading pins catch
them). The underlying exports stay alive on their real consumers
(timeAgo is LIVE in activities; ENGAGEMENT_LEVELS in the contacts API
routes; FILTER_RAIL/EMPTY_STATE in calendar/reports; Avatar in
profile; DropdownSeparator in leads) — import narrowing, not
retirement. (2) The N-56b/N-56c/N-56f dead-surface retirements:
page-parts' CardCaption (fully dead since the initial commit), the
whole app-authored ui/misc.tsx module (its sole export EmptyState was
s25-stranded; the loading-layer Skeleton pin re-anchored to the
module's absence — the strongest form of the no-Skeleton contract),
and format's addMonths (the seam went TEST-ONLY when the reports
route's import narrowed — the s55 N-55b class; its one stale it
retired with it). (3) The N-56d stale it-title corrected. (4) The
source-vocabulary operator boundary PINNED by a new guard test: the
retirement policy covers APP-OWNED vocabulary but NOT the vendored ui
stock-surface mirror — unused stock exports (CardDescription,
CardFooter, DialogClose, DialogTrigger, DropdownLabel, SelectGroup,
SelectLabel, SelectSeparator) stay exported because the mirror's
completeness is part of the parity contract (the s10 stock-primitive
layer) and tree-shaking keeps the bundle byte-identical. All pinned
RED-first in the dead-code-hygiene session-56 describe (6 RED + 2
guards, +8 −1 stale its = 1191 total), proven non-vacuous in a
pre-fix f7ca140 worktree (7 failed | 49 passed there, 56/56 at the
fix). Audits: the s55 re-audit verified all nine checklist items
GENUINE; the graduation audit: ZERO graduations — 13/13 re-confirmed
(13th consecutive session; the drift map EMPTY); both operator
decisions re-verified UNCHANGED — the CSV posture (b) STANDS, the
source-vocabulary documented parity STANDS AND EXTENDS to the N-56
family WITH the stock-mirror boundary (the bundle byte-identical for
the 27th consecutive session).

**Session-57** (the dead-surface narrowing + the comment-accuracy
layer): (1) The N-57c closure — the profile page's dead `usersTotal`
prop retired: the page passed `usersTotal={users.length}` and typed
it, but ProfileForm never destructured it (dead since s10, the
N-56a lint-invisible class, PROP variant), and the `users` store
destructure existed solely to feed it (the `fetchUsers` onSaved
refresh stays LIVE; the store's users slice keeps its live write path
through hydrate). (2) The N-57b export-keyword narrowing —
uploads.ts's `export const UPLOADS_DIR_NAME` had zero external
consumers repo-wide (the EXPORT variant of the same class); the
constant itself stays for its internal repo-root resolution. (3) The
N-57a stale nav-config comment corrected to the live `mt-auto`
footer truth; the s56 record comments' Avatar consumer attribution
corrected to accounts-page (profile hand-rolls its avatar spans — the
57-a audit correction); the page-parts "seven living exports" count
corrected to ten; the stale activities-page line citation refreshed.
All pinned RED-first in the dead-code-hygiene session-57 describe
(2 RED + 1 guard, +3 its = 1194 total), proven non-vacuous in a
pre-fix 5b86880 worktree (2 failed | 25 passed there, 27/27 at the
fix). Audits: the s56 re-audit verified all eight checklist items
GENUINE (the worktree arithmetic replayed: 7 failed | 49 passed
pre-fix); the graduation audit: ZERO graduations — 13/13 re-confirmed
(14th consecutive session; the drift map EMPTY); both operator
decisions re-verified UNCHANGED — the CSV posture (b) STANDS (15th
re-affirmation), the source-vocabulary documented parity STANDS AND
EXTENDS to the N-57 family (the bundle byte-identical for the 28th
consecutive session).

## Conventions that differ from defaults

- TypeScript strict **except `noImplicitAny: false`** (sandbox default, kept).
- Validation is hand-rolled in route handlers (trim, length caps, enum
  membership, referential checks via `asString`/`asNumber`/`asDate` in
  `src/lib/api.ts`). No schema library — zod was deliberately pruned.
- Charts are recharts with recharts DEFAULTS (`src/components/charts/`);
  the REAL chart renders at all-zero data (session-10 reversal — the
  empty-state placeholder boxes are retired; fixed lists render ticks at
  zero, row-derived series render empty).
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
