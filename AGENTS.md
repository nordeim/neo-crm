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
|  Unit tests (1862 checks)       | `bun run test`                         |
|  Browser E2E (132 checks)        | `bun run test:e2e` (needs build first) |
| DB census (path + counts)       | `bun run db:census`                    |
| The full gate in one command    | `bun run gate`                         |
| Prisma client after schema edit | `bunx prisma generate`                 |
| Recreate DB from schema         | `bun run db:push`                      |
| Seed demo workspace             | `bun run db:seed`                      |

**Gate order before every push:** `bun run lint` → `bun run typecheck` →
`bun run test` (1862) → `bun run build` → `bun run test:e2e` (132) — or the
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
  page visits. No NextAuth, no JWTs, no middleware/proxy. The public auth
  routes are rate-limited per IP/15 min — login 10, signup 10, resend 5,
  verify 20 (session-67 adds the sessioned upload route at 20;
  `src/lib/rate-limit.ts`, per-process).
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
  (`w-full` is per-surface — 270px rails yes / 128px toolbars no; the
  reference's own stock trigger base DOES carry `w-full` and its
  toolbar triggers override with `w-full sm:w-32` — computed-equal
  everywhere, the mechanisms differ [session-86 precision note]); the
  topbar search is the shared Input + `pl-10 bg-gray-50
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
  browsers. `tests/e2e/mobile-navigation.spec.ts` (9 checks, 390/700px
  viewports — the focus-entry test + the ten-route zero-overflow sweep
  included) is the
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
- **Component anatomy (session-9, re-derived s82/s83)**: button icons in
  TEXT buttons carry their OWN `mr-2` per surface on top of the flex
  `gap-2` (the measured 16px icon-text gap; the base ships NO svg-margin
  arms — `mr-1` on the compact family: the slide-over actions, the
  mobile cards, the Check ghost). Focus
  rings are 1px near-black (`ring-1 ring-ring`, `--color-ring: #0a0a0a`) on
  inputs, buttons and selects; tabs keep ring-2 + offset. Inputs are
  `text-base md:text-sm` (16px below md, matching the reference's phones).
  **CardTitle renders a `<div>`** (the reference has no card-heading
  semantics; the activities h2s and the calendar rail h3s are literal
  elements, and e2e card-title assertions use text locators). **The
  shared Badge primitive is the reference's STOCK badge mirror
  (session-66, N-66i)** — a `<div>` with `rounded-md border px-2.5
  py-0.5 text-xs font-semibold` + the stock variant set
  {default: `border-transparent bg-neutral-900 text-neutral-50 shadow
  hover:bg-neutral-900/80` (the computed-equal of the reference's
  alpha hover hsl(var(--primary) / .8) — ours is the app blue), secondary: neutral-100/900,
  destructive: `bg-danger text-neutral-50 shadow hover:bg-danger/80`
  (the solid #ef4444 — the accounts "N Overdue" family), outline:
  `text-foreground` (NOT muted)}; the call-site class MAPS (P map,
  priority i-map, health H-map, source classes) stay byte-identical to
  the bundle — only the chrome re-derived. Pinned by
  `tests/badge-contract.test.ts`. **Entity
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
- **The account tier is DERIVED, never stored (session-86)** — the
  reference computes tier from revenue (`>1M "Key" / >500k "A" /
  >100k "B" / else "C"`, null-safe) at the row (tint/star/badge), the
  Key Accounts KPI, the tier checkbox filter, and the CSV exports;
  `src/lib/account-tier.ts` (`accountTierFromRevenue`) is the seam;
  the stored tier/isKey columns + their API write seams are RETIRED
  (the reference models no tier field — its settings defaultTier is
  its own dead default). The account STATUS vocabulary is
  active/inactive/prospect (the reference's bce/wce dialog trio).
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
- **`/Profile` is a thin RENDER alias inside the (app) group (session-24;
  re-derived at session-65 from the retired session-14 redirect)** — the
  reference serves BOTH casings (its account menu links to `/Profile`);
  ours keeps the canonical lowercase `(app)/profile` and aliases the
  capital casing via `src/app/(app)/Profile/page.jsx` — a `.jsx`
  re-export of the lowercase page + `pageMetadata({ page: "Profile",
  route: "/Profile" })` that renders IN PLACE (no redirect; the URL bar
  keeps `/Profile`; the alias is a `.jsx` file ON PURPOSE — TypeScript's
  TS1149 fires when one program includes two real files differing only
  in casing, and the extension dodge keeps the alias out of that
  collision). The session-14 top-level redirect alias outside the group
  is RETIRED. Do NOT convert it to a next.config.ts redirect: Next
  matches config redirects CASE-INSENSITIVELY, so the rule matches its
  own destination and loops (ERR_TOO_MANY_REDIRECTS), and
  `caseSensitive` is not a valid per-redirect property in Next 16
  ("Invalid redirect found"). Pinned by `tests/profile-route.test.ts`
  (which asserts the redirect's ABSENCE).
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
  composition (the chevron carries no margin of its own — the
  reference's bare form, since the s82 base retirement no svg-margin
  neutralizer is needed).
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
  icon rows (Email=blue, Call=green, else purple — session-84: the
  stat icons are TrendingUp/Target/Users, the contacts initials box is
  the stock Avatar rounded-full CIRCLE with the reference's no-uppercase
  formula, the fallback icon is the blank-body Calendar, and the deals
  badge is the BARE default dark variant + the raw slug — the colored
  OPP_STAGE_META map is the dashboard-only family) and "Close Date: "
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

**Session-58** (the dead-surface narrowing + the type-contract
boundary layer): (1) The N-58a closure — the zero-consumer ALIAS
export retired: crm-store's `export { call as apiCall };` was the
only repo-wide `apiCall` reference (dead since the initial commit,
the N-57b EXPORT-variant class); the aliased `call` stays the
internal engine of every store action. (2) The N-58b definition-only
TYPE retirements (the s54 fully-dead class, TYPE variant): the types
barrel's `SearchResult` interface (zero references repo-wide AND
shape-inaccurate — it claimed full entities while the topbar consumes
its own slimmer inline row shape; the SKILL §20 carrier followed) plus
constants.ts's `LeadStage`/`ActivityType`/`EventType` derived types
(zero non-definition references; the `defaultLeadStage` settings FIELD
is a different identifier). (3) The N-58c module type-contract
boundary PINNED by the new guard: ~20 internally-consumed export
keywords (ApiError/ApiResult, SESSION_TTL_MS/SessionPayload, CrmState,
formatDateShort, DeltaText/DeltaBadgeText, RateLimitResult, the
reports-data row types, …) stay exported as each module's declared
contract surface — the N-56e KEEP mechanism applied to app-owned
modules, so future fresh-eyes sweeps don't re-litigate the boundary.
Plus the s58 line-citation self-shift refresh (the s57 comment growth
itself shifted the activities timeAgo token :384→:385 — the chronic
class, second generation). All pinned RED-first in the dead-code-hygiene
session-58 describe (3 RED + 1 guard, +4 its =
1198 total), proven non-vacuous in a pre-fix d33a90d worktree (3
failed | 28 passed there, 31/31 at the fix). Audits: the s57 re-audit
verified all eight checklist items GENUINE (the worktree arithmetic
replayed: 2 failed | 25 passed pre-fix); the graduation audit: ZERO
graduations — 13/13 re-confirmed (15th consecutive session; the drift
map line-only, substance identical); both operator decisions
re-verified UNCHANGED — the CSV posture (b) STANDS (16th
re-affirmation), the source-vocabulary documented parity STANDS AND
EXTENDS to the N-58 family WITH the module type-contract boundary
(the bundle byte-identical for the 29th consecutive session).

**Session-59** (the dead-surface narrowing, missed-sibling +
destructured-prop layer): (1) The N-59a closure — the types barrel's
`SavedReport` interface RETIRED: the DB-wire-shape type (id/name/tab/
config/createdAt) had zero references repo-wide INCLUDING its own
file, AND it is shape-divergent from the LIVE `SavedReport` (the
localStorage filters/columns shape in saved-reports.ts, the s25 seam)
— the s58 SearchResult class's MISSED SIBLING, found only by the 59-b
complementary-sweep rotation; the type shadow of ledger-10's dead
Prisma model (the model + its reset/seed wipes stay — the documented
deferral). The SKILL §20 carrier followed (the interface line retired
+ the stale "(192 lines)" header count refreshed to the live 277).
(2) The N-59b closure — the entity-edit-dialog's `entityId` prop
RETIRED with its three call-site bindings (contacts/leads/accounts
pages): destructured + typed + passed since s28 but never read in the
body (the N-56a lint-invisible class, DESTRUCTURED variant — an
unused destructured binding is exactly what the OFF no-unused-vars
rules would have flagged; the class's third face after the IMPORT
(s56) and PROP-TYPE (s57c) variants). `editTarget` stays live through
`initial` at every site. (3) The README badge arithmetic corrected
(the s58 badge read 1309 where the convention demanded 1310 — the
59-a audit catch; with s59's +3 its the badge now reads 1313 =
1201 + 112). All pinned RED-first in the dead-code-hygiene session-59
describe (2 RED + 1 guard, +3 its = 1201 total), proven non-vacuous in
a pre-fix dca98e9 worktree (2 failed | 32 passed there, 34/34 at the
fix). Audits: the s58 re-audit verified all nine checklist items
GENUINE (the worktree arithmetic replayed: 3 failed | 28 passed
pre-fix) + three narrative inaccuracies (the badge −1, the SKILL
5622→5621 start-count, the §20 stale line count — all corrected or
recorded); the graduation audit: ZERO graduations — 13/13 re-confirmed
(16th consecutive session); both operator decisions re-verified
UNCHANGED — the CSV posture (b) STANDS (17th re-affirmation), the
source-vocabulary documented parity STANDS AND EXTENDS to the N-59
family (the bundle byte-identical for the 30th consecutive session).

### Session 60 (2026-10-05) — the dead-surface narrowing: the palette
key + the test-local locator

The session-60 layer (the palette-key + test-local layer): (1) The
N-60a closure — six of `CHART_COLORS`' sixteen keys RETIRED
(blue/cyan/teal/amber/orange/green): zero key-reads AND zero computed
access repo-wide (the live read set: red/gray/violet/emerald + the
-400 family — verified by exhaustive grep and LIVE-rendered on the
dashboard sparklines + the accounts/activities stat-card mini bars).
The s54 fully-dead class, KEY variant — the third face after the TYPE
(s58) and INTERFACE (s59) variants. The SKILL carriers followed (the
§15.4 Sparkline example's dead `cyan` → the live `cyan400`; the §19
palette-duplication note rewritten — the TS list is now the consumed
subset, the CSS `--color-chart-1…6` family a different surface that
stays whole). (2) The N-60b closure — crm.spec.ts's dead
`formAvatar` locator RETIRED: declared inside the profile-photo
upload test since s30 and never used (the empty state is asserted
through the `form img` count) — the N-56a lint-invisible class,
TEST-LOCAL variant (its fourth home: IMPORT s56 / PROP-TYPE s57c /
DESTRUCTURED s59 / TEST-LOCAL s60; found only by rotating the
fresh-eyes sweep INTO the test tree). (3) The session_111.md
line-count bracket corrected (the s59 record's "no trailing newline"
claim was FALSE — the SKILL file IS newline-terminated, `wc -l`'s
5763 the true count; the s59 script's `count("\n") + 1` formula
over-counts by one — the off-by-one class bit the tooling itself;
the s60 SKILL-edit script counts by wc semantics). All pinned
RED-first in the dead-code-hygiene session-60 describe (2 RED + 1
guard, +3 its = 1204 total), proven non-vacuous in a pre-fix b077443
worktree (2 failed | 35 passed there, 37/37 at the fix). Audits: the
s59 re-audit verified all eight checklist items GENUINE (the worktree
arithmetic replayed: 2 failed | 32 passed pre-fix); the graduation
audit: ZERO graduations — 13/13 re-confirmed (17th consecutive
session); both operator decisions re-verified UNCHANGED — the CSV
posture (b) STANDS (18th re-affirmation), the source-vocabulary
documented parity STANDS AND EXTENDS to the N-60 family (the bundle
byte-identical for the 31st consecutive session).

### Session 61 (2026-10-05) — the dead-surface narrowing: the
manifest + the public asset

The session-61 layer (the manifest + public-asset + doc-numerics
layer): (1) The N-61a closure — `public/neo-crm-dashboard.png`
RETIRED: a byte-identical duplicate of `docs/neo-crm-dashboard.png`
(the referenced copy — the prompt docs point at the GitHub docs/ path)
with zero tracked references, shipping in every standalone build via
the `cp -r public` step. The s54 fully-dead class, PUBLIC-ASSET
variant. (2) The N-61b + N-61d closures — three dead dependencies
RETIRED: `@radix-ui/react-alert-dialog` + `@radix-ui/react-radio-group`
(zero imports repo-wide AND in all git history; no ui components —
the session-2 R-4 unused-scaffold class, RUNTIME-DEP variant) +
`bun-types` (zero references — no Bun.* usage, no tsconfig "types"
field, never auto-included — the DEV-DEP variant). Both lockfiles
regenerated; `package-lock.json` returns to `package.json` parity for
the first time since session 4 (the s13/s25 staleness closed — the
regeneration carried 308 insertions / 86 deletions with zero version
churn on surviving entries; session-62 corrected this paragraph's
"session 25" anchor and the "pure additions" framing). (3) The N-61c +
61-a #1 doc-numerics refresh — the README/PAD tree-block counts (27
route files / 39 verb handlers, 9 models, 75 suites / 1207 checks,
112 e2e), the PAD §11 Lines column (~20 rows re-censused by `wc -l`),
and the SKILL §19 chart-row hex sync to globals.css (chart-3
`#eab308`, chart-5 `#9ca3af` — stale since session 4). All pinned
RED-first in the dead-code-hygiene session-61 describe (2 RED + 1
guard, +3 its = 1207 total), proven non-vacuous in a pre-fix b01bd01
worktree (2 failed | 38 passed there, 40/40 at the fix). Audits: the
s60 re-audit verified all eight checklist items GENUINE (the worktree
arithmetic replayed: 2 failed | 35 passed pre-fix); the graduation
audit: ZERO graduations — 13/13 re-confirmed (18th consecutive
session); both operator decisions re-verified UNCHANGED — the CSV
posture (b) STANDS (19th re-affirmation), the source-vocabulary
documented parity STANDS AND EXTENDS to the N-61 family (the bundle
byte-identical for the 32nd consecutive session; the manifest +
public-asset dead surfaces retire; the tw-animate-css re-vendor
source, the CSS chart token family, the N-58c boundary, and the stock
mirror stay guard-pinned).

### Session 62 (2026-10-05) — the manifest honesty + the profile-save
divergence

The session-62 layer: (1) The N-62a closure —
`@radix-ui/react-toast` RETIRED: a never-imported runtime dep
(`src/components/ui/toast.tsx` is a from-scratch mirror — its header
says it "Mirrors the @radix-ui/react-toast API shape" without
importing it; `git log -S` finds no import in ANY commit). The
convergent 62-a#1 + 62-b find; the s61 census had wrongly claimed a
"verified import site" and the s61 guard had PINNED the dead dep live
— the entrenchment is reversed and the guard now asserts a REAL
import site for EVERY surviving radix package (react-label joins the
pinned set — 62-a#4). (2) The 62-a#3 closure — `@types/node` joins
the devDependencies EXPLICITLY (`^26.6.2`, pinning what the bun tree
already resolves): the s61 package-lock regen had dropped the
resolved entry (an optional peer npm never auto-installs), leaving
the npm-world install path (install_packages.sh) without the types
tsc needs for the `node:` imports. Both lockfiles regenerated per the
§16ba rule. (3) The N-62b closure — the profile save's name-only
`dirty` gate RETIRED as a reference-divergence fix: the reference
bundle disables Save only while SAVING and PATCHes {display_name,
profile_picture} unconditionally; our gate silently swallowed
photo-only uploads (button enabled, handler no-op). LIVE-verified:
upload → toast → Save → reload with all three avatars rendering. (4)
The N-62c closure — the unreachable `?? a.dueAt` arms retired at both
activities count filters (Activity.createdAt is a non-nullable
string; the s42/s46 dead-?? class). (5) The doc-numerics sweep
(62-a#2/#5/#6): the 22→27 route-file counts (PAD + SKILL §5, auth(6)
+ opportunities/upload/uploads/[name] named), the SKILL §7 model
table to 9 rows with Opportunity, the component/line-count refresh,
the "session 25"→"session 4" lockfile anchor + the "pure
additions"→308/86 framing, the §16ba(2) dry-run-number correction;
the N-62d readOnly posture + the N-62e filtered-vs-full
disabled-binding divergence annotated in place. All pinned RED-first
(3 RED: the manifest it + the re-anchored s46 it + the profile
photo it) and proven non-vacuous in a pre-fix k6125f6b worktree (3
failed | 52 passed there; 55/55 at the fix). Audits: the s61
re-audit verified all eight checklist items GENUINE (the worktree
arithmetic replayed: 2 failed | 38 passed pre-fix) with six new
findings; the graduation audit: ZERO graduations — 13/13 re-confirmed
(19th consecutive session); both operator decisions re-verified
UNCHANGED — the CSV posture (b) STANDS (20th re-affirmation), the
source-vocabulary documented parity STANDS AND EXTENDS to the N-62
family (the bundle byte-identical for the 33rd consecutive session).

### Session 63 (2026-10-05) — the server-seam honesty

The session-63 layer: (1) The 63-b#1 closure — the two FOREIGN project
manuals retired from the repo root: `scandihaven_SKILL.md` (the Scandi
Haven project's own 128 KB master skill) + `project-management_SKILL.md`
(ORBITAL's manual — a third project entirely), tracked since the
initial scaffold `b48fc3d`, never modified once, zero functional
references (the operator's prompt templates cite the GITHUB repo URL,
never the local copies) — the s54 fully-dead class, DOC-FILE variant
(~160 KB per clone). (2) The N-63b dead-arm SPLIT by risk class —
RETIRED as construction-dead over internal constants: the
`PIPELINE_LABELS[stage] ?? stage` pair (dashboard route + the client
page's stage select — the PIPELINE_STAGES loops carry only keys the
record verifies present) and settings' `!view` fragment (asString's
optional+trim contract + `?? "month"` guarantee non-empty); KEPT +
ANNOTATED as the defensive DB-read posture: the reports
`ACTIVITY_TYPE_META[t]?.… ?? …` triple, `o.stage || "unknown"`, and
the dashboard `: 0` ternary arm (Activity.dueAt is `DateTime?` and
the codebase carries zero type-predicate / non-null-assertion
patterns — the arm is the honest static form). (3) The N-63a/N-63c
page-layout honesty package — CALENDAR_CELL RE-DERIVED from the live
calendar cell (the pre-s63 record had drifted: no `flex flex-col
items-stretch`, no focus-ring key, a duplicated `transition-all`; the
pins re-anchored so the change is RED-proven), the allLayoutClasses
sweep extended from 41 to 71 groups with the bare-string branch
(`Object.values` on a string splits into characters — the trap that
kept every single-string export out), the module header's false
"pages consume these records" claim corrected, and the 8
zero-page-consumer records annotated as test-pinned reference
snapshots (the N-46e/N-62d wire-or-remove posture family). (4) The
micro-honesty — N-63g the DEV_SECRET fallback now warns ONCE in
production (the short-secret case used to be as silent as unset);
N-63i login's email cap joins the 160 family (signup/resend/verify —
truncation parity: a >160-char email stored truncated by signup can
now log in); N-63e the rate-limit header at the real per-route
numbers (login 10 / signup 10 / resend 5 / verify 20, all per 15
min); N-63d the server-TZ annotation at the startOf* period-window
seam; G-1..G-4 the record-precision corrections (the session_117
"13 transitives" overstatement, the PAD tree-block 1207/111
leftovers, the stale crm.spec "must be dirty" comment, the N-62e
precision notes completed on contacts-page + the export pin). All
pinned RED-first (7 RED: the foreign-docs it + the dead-arms it +
the auth-warn it + the login-cap it + the sweep it + the two
CALENDAR_CELL re-anchors; +6 its = 1216) and proven non-vacuous in a
pre-fix d0129de worktree (7 failed | 272 passed there; 1216/1216 at
the fix). Audits: the s62 re-audit verified all 23 checklist items
GENUINE (the worktree arithmetic replayed: 3 failed | 52 passed
pre-fix) with nine record-precision findings; the graduation audit:
ZERO graduations — 13/13 re-confirmed (20th consecutive session);
both operator decisions re-verified UNCHANGED — the CSV posture (b)
STANDS (21st re-affirmation), the source-vocabulary documented
parity STANDS AND EXTENDS to the N-63 family (the bundle
byte-identical for the 34th consecutive session). The mid-flight
pin repairs: the three O-map its re-anchored to the
`export const PIPELINE_LEGEND` definition form (the sweep extension
made the bare token ambiguous — the chronic self-shift class) + the
sweep it's INPUT_BASE representative switched to `.size` (the record
is an object, not a bare string).

### Session-64 — the logout write-guard + the test-suite honesty

The fresh-eyes rotation landed on the TEST-CONTRACT + CLIENT-STATE
seam (tests/ 75 files + src/stores/crm-store.ts + src/types/ — never
a dedicated rotation target before) and found the N-64 family:
N-64j the logout write-guard (src/stores/crm-store.ts — logout()
clears every slice but hydrate()'s nine parallel fetches carried no
generation token, so a logout landing mid-fetch let stale
resolutions re-populate the cleared slices, the s35 leakage class's
last open window; FIXED with a module-level sessionWriteToken every
slice fetch captures at entry — logout bumps it + the events token
before the clearing set, hydrate dies entirely on a mid-auth logout,
and the s45 fetchEvents body stays byte-identical, its in-flight
writes invalidated through its own token); N-64b the vacuous funnel
pin (the leads status-cumulative contract asserted
/cumulative|LEADS_FUNNEL/ over a region that always contains
LEADS_FUNNEL.map — zero effective coverage; re-anchored to the exact
filter forms and perturbation-proven); N-64g the stripComments
dead cargo (the unreachable second replace — the braced-pattern pass
after the plain-pattern sweep — retired from all 54 test-helper
copies, absence-pinned with an escaped needle); N-64a the stale
line-anchor family (13 citation drifts across 10 test files, token
anchors preferred); N-64c/d/e/f/h/i the precision carriers (the
dead region local, the E>=4 title, the retired-constant comment,
the tautology/sampling annotations, the vestigial scaffolding). All
pinned RED-first (5 RED: the 4 store its + the stripComments absence
it; +6 its = 1222) and proven non-vacuous in a pre-fix f7760f7
worktree (5 failed | 49 passed there; 1222/1222 at the fix; the
funnel pin additionally perturbation-proven). Audits: the s63
re-audit verified 13/15 checklist items fully GENUINE (the
non-vacuousness arithmetic replayed exactly: 7 failed | 272 passed)
with the P-1..P-3 record-precision corrections landed at s64; the
graduation audit: ZERO graduations — 13/13 re-confirmed (21st
consecutive session); both operator decisions re-verified UNCHANGED
— the CSV posture (b) STANDS (22nd re-affirmation), the
source-vocabulary documented parity STANDS AND EXTENDS to the N-64
family (the bundle byte-identical for the 35th consecutive session).
The mid-flight pin repair: the s45 no-collateral guard's window
narrowed 500 → 400 chars (the guarded neighborhood grew — the fetch
functions now carry the session capture; the chronic self-shift
class in window form).

### Session-65 — the e2e honesty + the page-render dead surfaces

The fresh-eyes rotation landed on the PAGE-RENDER + E2E-SPEC seam
(src/app 23 .tsx files + tests/e2e 3 specs, never a dedicated rotation
target) and found the N-65 family: N-65b (Medium — the global-search
e2e test VACUOUS: getByText("Accounts").first() resolved to the
always-visible SIDEBAR nav link and getByText("Northwind Energy")
.first() to the RECENT DEALS accountName cell, so a completely broken
search stayed green — the s43-P4/s45 stale-results family was exactly
what it never caught; re-anchored to the dropdown's OWN DOM, the
SearchResultRow button + the section header as its preceding sibling);
N-65c (4 dead store-destructures: contacts-page's leads/users/settings
— the s41-P5 sweep's missed siblings — + settings-page's
updateSettings); N-65d/N-65e (the construction-dead arms: the
`a.tier === "Key"` disjuncts [tier is membership-validated to A/B/C at
both write seams] + the OPP_STAGE_META `?? s` arm — the s63 N-63b
class's missed siblings); N-65g (AGENTS + PAD still documented the
RETIRED s14 /Profile redirect — both re-derived to the s24 render
alias + the SKILL §16f supersession bracket); N-65h (the mobile-nav
Escape test's "restores focus" half, now ASSERTED); N-65a/N-65f (the
settings anchors drifted at birth + the only e2e line-citation —
token-form refreshes); N-65i/N-65j/N-65l/N-65m/N-65n/N-65o (the
below-lg comments → md, the no-op conditionals, the defensive DB-read
annotations at the calendar/activities chip lookups, the owner-select
comment, the main re-indent, the import merge); N-65k/N-65p
record-only. All pinned RED-first (5 RED: the 4 dead-surface its + the
AGENTS/PAD mechanism it; +5 its = 1227) and proven non-vacuous in a
pre-fix 9952a23 worktree (5 failed | 47 passed there; 1227/1227 at the
fix). Audits: the s64 re-audit verified all 8 checklist items GENUINE
(the worktree arithmetic replayed exactly: 5 failed | 49 passed); the
graduation audit: ZERO graduations — 13/13 re-confirmed (22nd
consecutive session); both operator decisions re-verified UNCHANGED —
the CSV posture (b) STANDS (23rd re-affirmation), the source-vocabulary
documented parity STANDS AND EXTENDS to the N-65 family (the bundle
byte-identical for the 36th consecutive session).

### Session-66 — the badge-primitive honesty + the parity-gap wiring

The fresh-eyes rotation landed on the COMPONENTS seam (src/components/
27 files, 5,332 lines — never a dedicated rotation target) and found the
N-66 family, with the orchestrator's bundle re-decode PROMOTING two
findings to their root causes: **N-66i** — the shared Badge PRIMITIVE
itself diverged from the reference's stock badge on every surface (the
scaffold-era rounded-full px-2 font-medium SPAN with invented variants
vs the bundle's `zn`/`fie` DIV: rounded-md px-2.5 py-0.5 font-semibold +
default/secondary/destructive/outline; invisible for 65 sessions
because the reference renders NO badges at its persistent zero data
and the s27-s31 decodes pinned the CALL-SITE class maps, not the
chrome — every call-site className was already byte-identical);
re-derived with the computed-equal variant expressions (default ->
neutral-900/50 + shadow [the s13 PROFILE_LAYOUT.badge form], destructive
-> the solid bg-danger, outline -> text-foreground), the unused
success/warning/info/muted variants retired, danger renamed destructive,
and the slide-over priority badge's wrongly-copied row overrides
dropped. **N-66d** — the Tabs count badge was an UNWIRED PARITY
FEATURE, not dead cargo (the reference's activities Overdue tab renders
`P.overdue.length>0 && <span className="ml-2 px-2 py-0.5 text-xs
bg-red-100 text-red-800 rounded-full">`); wired with the guarded count
at the call site + the literal span classes. **N-66a** — the
global-search dropdown gained its Escape close (the S12-P1 mobile-nav
precedent: our functional-superset surfaces get the keyboard contract).
**F-66a1** (the 66-a re-audit's find) — the s65 mid-flight-repair
residue on the calendar AGENDA row (`items-center` where the bundle
renders `items-start`) reverted + pinned. **N-66b/c** — GRID_COLS_LG +
the page-parts dead props (KpiCard.deltaSuffix/invertDelta,
BarStatCard.barColorFor) + the Sparkline guard reorder retired.
**N-66e/f** — the N-65p coverage notes closed (the route-case URL-state
scan sees the nine .jsx aliases; the mobile-nav inert + Tab-wrap e2e
landed). All pinned RED-first (17 RED: the badge-contract suite + the
dch session-66 describe + the calendar/tabs re-anchors; +18 its =
1245) and proven non-vacuous in a pre-fix 603184e worktree (17 failed
| 1228 passed there). THE AUDITS: the s65 re-audit 11/12 GENUINE with
item 12 PARTIAL (the F-66a1 hunk — every other src hunk verified
dead-code/comments only; the non-vacuousness arithmetic replayed
exactly: 5 failed | 47 passed pre-fix); the graduation audit: ZERO
graduations — 13/13 re-confirmed (23rd consecutive session), the 8
mechanical censuses ALL CLEAN; both operator decisions standing — the
CSV formula-injection posture (b) STANDS (24th re-affirmation), the
source-vocabulary documented parity STANDS AND EXTENDS to the N-66
family (the class maps stay byte-identical; the primitive re-derives)
[the bundle byte-identical for the 37th consecutive session] — GATE:
lint 0/0 · tsc 0 · 1245/1245 unit (76 suites, +18) · build clean ·
113/113 e2e on a fresh CI=1 boot (2.6m, all 8 mobile-nav checks green
— the inert/Tab-wrap test included) · 62nd drift-sweep clean (37th
consecutive stable reference bundle: size 1,631,071 + md5
a70a637fcf1d4291da8e0d965676dc11) · LIVE-verified (the badge stock
geometry on the dashboard Recent Deals [6px radius, 2px 10px padding,
weight 600, transparent border, shadow, DIV] + the contacts priority/
source [the row's px-3 py-1 font-medium overrides] + the accounts
destructive [#ef4444 solid + shadow] + health badges; the search Escape
round-trip; the overdue count badge [the red "4" pill, the other tabs
plain]; the drawer both directions at a TRUE 390px [closed inert, open
8/8 truly visible + the dual lock + focus in panel; Escape -> inert +
hidden + unlocked + focus RESTORED]; zero 390px overflow on all ten
routes; NO Tailwind v4 bug [--blur-sm 4px + --shadow-sm 0 1px 2px 0
#0000000d + a live surface computing rgba(0,0,0,0.05) 0px 1px 2px
0px]; zero probe residue [the closing census MATCH]) · 5 screenshots
(02/03/04/07 re-captured + 75-activities-overdue-count NEW — the fix
surfaces at 1440x900; VLM-verified with the accounts Status column
DOM-probe-verified [a viewport-crop artifact]) · docs at SKILL v1.63.0
(the new §16bf + project_state, applied atomically via the assert-first
scripts/skill_edits_s66.py at the sandbox root, 6187 -> 6251 lines by
wc -l) + session_125.md [the odd-number record convention] + the plan's
execution record + both worklogs + README/AGENTS/CLAUDE/PAD at 1245+113
(badge 1358); .env/.env.example verified (no env surface change;
DATABASE_URL file:../db/custom.db with db/ at the repo root; the
intake: the sandbox was RESET — a FRESH CLONE + bun install + db:push
+ db:seed, the census MATCH at the repo path; the stale platform
DATABASE_URL override still points at the non-existent mirror, all
operations under env -u DATABASE_URL).

**Session-67 (SKILL v1.64.0)** — the auth-seam honesty + the small-hole
closures: the 67-c fresh-eyes rotation on the AUTH/SESSION/UPLOAD seam
(the 6 auth routes + the auth/verification/rate-limit/login-reset/uploads
libs + the upload routes + the login/signup pages + next.config headers
— never a dedicated rotation target) finding the N-67 family, every
finding manually validated at file:line. **N-67c** — the verify attempt
counter is now ATOMIC (the DB-side `{ increment: 1 }` whose returned
record feeds the lockout/remaining ladder — the read-modify-write form
could let concurrent submissions overshoot the 5-wrong lockout against
one code). **N-67d** — the auth body pre-gate (MAX_AUTH_BODY_BYTES
16KB + isBodyTooLarge in api.ts, applied before `req.json()` in all four
public auth routes — the S36-P3 upload precedent extended to the family
that buffers with no default cap). **N-67e** — the upload route joins
the rate-limit family (20/15min/IP, DELIBERATELY after the session
guard — the unauth 401 is cheap, and pre-auth bucketing would let an
attacker exhaust a legitimate IP's upload budget without a session).
**N-67f** — the /signup authed redirect RETIRED (the s23-P2 /login
pure-render shape; the s43 deferred "signup-page session read" ledger
entry closed). **N-67h** — the Retry-After family (ERR.RATE_LIMITED
gains the optional retryAfterSec param; all four routes pass it; login's
hand-built NextResponse 429 block retired). **N-67j/k/l** — the
clear-cookie twin symmetry; the resend in-flight guard (the 5/15-min
budget survives a double-click); the honest `body.data.message` read
(the envelope nests at .data — the root read always fell to the
fallback). **N-67a/o** — the doc carriers (DEPLOYMENT.md's
X-Forwarded-Proto claim re-derived to the NODE_ENV reality — NO code
ever read that header, and wiring it would be its own spoofing hazard;
the AUTH_SECRET >=16-char minimum documented in .env.example +
DEPLOYMENT.md §3). **N-67g** — the three stale flat-"10" rate-limit
carriers refreshed (AGENTS + playwright.config + auth.setup at the
per-route numbers: login 10 / signup 10 / resend 5 / verify 20).
**F-67a1** — the s66 screenshot 75 re-captured in the Due-Today-ACTIVE
state (the red count pill on the INACTIVE Overdue tab — the conditional
evidence the byte-identical default-view shot never carried; errata in
session_125.md). KEEP: N-67b (the trusted-proxy limiter — the standing
s36/s37 deferred ledger), N-67i (the auth ok() payloads are the API's
public self-hosted shape), N-67m/N-67n (the timing oracle + scrypt
defaults — documented). All pinned RED-first (10 RED: the new
tests/auth-contract.test.ts; +12 its = 1257) and proven non-vacuous in
a pre-fix 9628bf4 worktree (10 failed | 1247 passed there). Plus the
NEW e2e wrong-code ladder (the 114th check: rungs 2-5 + the lockout
repeat + the post-lockout resend). THE AUDITS: the s66 re-audit 12/12
GENUINE (the non-vacuousness arithmetic replayed exactly: 17 failed |
1228 passed pre-fix) + F-67a1 (the 75/07 byte-identity); the graduation
audit: ZERO graduations — 13/13 re-confirmed (24th consecutive
session), the 8 mechanical censuses ALL CLEAN; both operator decisions
standing — the CSV formula-injection posture (b) STANDS (25th
re-affirmation), the source-vocabulary documented parity STANDS AND
EXTENDS to the N-67 family (the auth seam touches NO vocabulary
surface) [the bundle byte-identical for the 38th consecutive session]
— GATE: lint 0/0 · tsc 0 · 1257/1257 unit (77 suites, +12) · build
clean · 114/114 e2e on a fresh CI=1 boot (2.6m, all 8 mobile-nav
checks green) · 63rd drift-sweep clean (38th consecutive stable
reference bundle: size 1,631,071 + md5 a70a637fcf1d4291da8e0d965676dc11)
· LIVE-verified (the body pre-gate: a 20KB login body answers 400
"Request body too large" unparsed; the 429 family: the 11th login from
one IP answers Retry-After: 900; the authed /signup RENDERS the card
with no redirect; the logout round-trip [me -> null]; the resend banner
through body.data.message; the wrong-code ladder rung live; the drawer
both directions at a TRUE 390px [closed inert, open 8/8 + the body
lock + focus in the dialog; Escape -> inert + unlocked + focus
RESTORED]; zero 390px overflow on all ten routes; NO Tailwind v4 bug
[--blur-sm 4px + --shadow-sm 0 1px 2px 0 #0000000d + a live surface
computing rgba(0,0,0,0.05) 0px 1px 2px 0px]; the closing census MATCH
after an in-place reseed of the 2 throwaway LIVE-probe users) · 5
screenshots (01/02/07 re-captured + 75 re-captured in the contrast
state + 76-verify-ladder NEW — the fix surfaces at 1440x900;
VLM-verified: the salesTarget $0k question is the reference's own
HARDCODED value [API + docs verified] and the login accent-strip
question a 4px DOM-probe-verified sub-pixel artifact) · docs at SKILL
v1.64.0 (the new §16bg + project_state, applied atomically via the
assert-first scripts/skill_edits_s67.py at the sandbox root, 6251 ->
6309 lines by wc -l) + session_127.md [the odd-number record
convention] + the plan's execution record + both worklogs + the
F-67a1 errata in session_125.md + README/AGENTS/CLAUDE/PAD at
1257+114 (badge 1371); .env/.env.example verified (the AUTH_SECRET
minimum note added; DATABASE_URL file:../db/custom.db with db/ at the
repo root; the intake: the sandbox SURVIVED s66 — the pull
fast-forwarded 2c748c3 -> 9628bf4, session_126.md only, zero code
drift; the stale platform DATABASE_URL override still points at the
non-existent mirror, all operations under env -u DATABASE_URL).

**Session-68 (SKILL v1.65.0)** — the stat-value honesty + the
small-wiring session (a fresh-clone intake: bun install + db:push +
db:seed, the census MATCH; the 64th drift sweep CLEAN — the bundle
byte-identical for the 39th consecutive session; the reference census
#64: demo data zero + the mobile-nav defect standing at TRUE 390px;
the triple audits: 68-a the s67 re-audit 12/12 GENUINE, 68-b the
graduation audit ZERO graduations 13/13 [25th consecutive session] +
the 8 censuses clean, 68-c the fresh-eyes rotation on the
page-layout.ts + format.ts seam [never a dedicated target] finding the
N-68 family; both operator decisions standing: the CSV
formula-injection posture (b) [26th re-affirmation] + the
source-vocabulary documented parity): the N-68a KPI-VALUE TYPOGRAPHY
SWEEP COMPLETED [the s13 decoration trio — leading-none/tracking-tight/
leading-tight/text-foreground — retired from BarStatCard/IconStatCard/
CircleStatCard; the bundle census: text-2xl sm:text-3xl font-bold x15,
text-3xl font-bold x4, text-2xl font-bold x10, ALL bare — LIVE-probed
at 36px/32px line-heights + normal letter-spacing on all three
surfaces]; the N-68b REPORTS FIXED-SCALE [scale:"k" at the Won/Lost
call-sites — the reference's literal /1e3 formula; the sub-1000
options window misread amounts 1000x ($950 -> "$950.0K"); LIVE: "4
$337.0K" + "$92K" at the ytd period]; the N-68c stale hover-comment
re-scope [the dashboard half retired at s12]; the N-68d
UNWIRED-DUPLICATE WIRING [DIALOG_CONTENT.wide + DIALOG_FOOTER_WIDE at
the edit family + the save-report dialog; SETTINGS_PICKLIST.
industriesPlaceholder at the settings page; CONTACTS_LAYOUT.mobileCards
at the contacts page — the source pins re-anchored to the
constant-consumption form, contact-photo's s30 twins included]; the
N-68e FORMAT COVERAGE [timeAgo upcoming/>=7d, timeUntil in-1m/in-Nd,
the startOf* boundaries, addDays rollover — the 7-day boundary flips AT
7 days, pinned]; the N-68g/h nano pair [the timeUntil doc re-derived;
formatMonthDayTime rides MONTHS_SHORT]; the F-68a2 SESSIONED BODY
PRE-GATE [isBodyTooLarge after requireSession + before req.json() in
all 12 sessioned routes — the N-67d family extended; LIVE: a 20KB PUT
/api/settings answers 400 "Request body too large", the honest body
parses]; the F-68a1/a3/b1 carriers [the SKILL H1 re-versioned; the
rate-limit header gains the upload line; the five 22-era API-count
numerics refreshed to 27/39]; the N-68i CARD_TITLE_OVERRIDE.filters
member retired [the rails consume FILTER_RAIL.title — absence-pinned].
All pinned RED-first [18 RED: the new stat-value-contract + body-pregate
suites + the format/dch/page-layout/saved-reports/entity-edit-dialog/
contact-photo extensions; +18 its = 1275] and proven non-vacuous in a
pre-fix 3d60a20 worktree [18 failed | 1257 passed there; 1275/1275 at
the fix]. GATE: lint 0/0 · tsc 0 · 1275/1275 unit (79 suites) · build
clean · 114/114 e2e on a fresh CI=1 boot (2.6m, all 8 mobile-nav checks
green) · LIVE-verified (the pre-gate round-trip; the reports KPIs at
nonzero; the three stat-value computed-style probes; the drawer both
directions at a TRUE 390px [closed inert; open 8/8 + the body lock +
focus in the drawer; Escape -> inert + unlocked + focus RESTORED];
zero 390px overflow on all ten routes [both Dashboard casings]; NO
Tailwind v4 bug [--blur-sm 4px + --shadow-sm 0 1px 2px 0 #0000000d +
a live surface computing rgba(0,0,0,0.05) 0px 1px 2px 0px]; the
closing census MATCH — zero probe residue) · 7 screenshots (01/02/03/
04/08 re-captured + 77-reports-kpi-scale NEW [the fix surface at ytd]
+ 78-mobile-nav-drawer NEW [the s68 mobile-regression evidence] at
1440x900/390x844; VLM-verified 3/3 + 4/4) · docs at SKILL v1.65.0 (the
new §16bh + project_state, applied atomically via the assert-first
scripts/skill_edits_s68.py at the sandbox root, 6309 -> 6352 lines by
wc -l) + session_129.md [the odd-number record convention] + the
plan's execution record + both worklogs + README/AGENTS/CLAUDE/PAD at
1275+114 (badge 1389); .env/.env.example verified (no env surface
change; DATABASE_URL file:../db/custom.db with db/ at the repo root;
the intake: the FRESH CLONE — .env re-created from .env.example with a
generated AUTH_SECRET; the stale platform DATABASE_URL override still
points at the non-existent mirror, all operations under env -u
DATABASE_URL).

**Session-69 (SKILL v1.66.0)** — the e2e-honesty + the s68-straggler
session (the 69-c fresh-eyes rotation on the NEVER-AUDITED e2e
infrastructure seam — 2,933 lines of specs + config — finding the
N-69 family with every claim manually validated; the 69-a s68
re-audit 12/12 GENUINE [9 clean + 3 nano-noted: F-69a1 the
leads-variant text-foreground survivor, F-69a2/a4 the record
precision pair, F-69a3 the leads/[id] gate inside-the-try, F-69a5 the
contact-detail-panel month re-declaration, F-69a6 the format sub-1000
stale comment]; the 69-b graduation audit ZERO graduations 13/13 [26th
consecutive], the 8 censuses clean; both operator decisions standing:
the CSV formula-injection posture (b) [28th re-affirmation] + the
source-vocabulary documented parity): the F-69a1 LEADS-VARIANT STAT
VALUE [the IconStatCard leads render arm's surviving text-foreground +
pre-normalization order retired — the reference's leads values are
text-xl sm:text-2xl font-bold text-gray-900; now the bare family-order
form, LIVE-verified at 24px/700/inherited]; the F-69a3 GATE HOIST
[the leads/[id] pre-gate above the try — the only one of the 12
sessioned routes paying a DB round-trip before rejection; the
handler-scoped no-DB-before-the-gate pin added, scoped to the gate's
OWN handler so root GET findMany stays legitimately green]; the
F-69a5 MONTHS_SHORT EXPORT [the N-68h dedupe closed repo-wide —
contact-detail-panel's mmmDyyyy rides the single declaration]; the
F-69a6 format comment re-scope [the sub-1000 options branch = the
test-pinned zero-state guard, no src consumer since S68-P2]; the
N-69a LOCAL REUSE LIMITER HAZARD documented [reuseExistingServer:!CI
keeps in-memory buckets across runs while the DB reseeds — third-run
429s; the gate's CI=1 fresh boot immune, self-heals in 15 min]; the
N-69c REDUNDANT ASSERTION RETIRED [not.toHaveCount(0) after
first().toBeVisible() can never fail]; the N-69g E2E_PORT SINGLE
SOURCE [tests/e2e/e2e-port.ts owns the 3100 default; playwright.config
+ the crm.spec 401 probe import it]; the N-69h/i/b comment carriers
[the deliberate E2E_DATABASE_URL pin; auth.setup's four budgets; the
sibling verify spend corrected to 1 — the incomplete guard is
client-side]; PLUS the TWO NEW E2E CHECKS [the sessioned pre-gate 400
probe (PUT /api/settings, 20KB → 400 "Request body too large", zero
residue) + the ten-route zero-390px-overflow sweep (both Dashboard
casings) — the LIVE-only surfaces the rotation catalogued, now
pinned; 114 → 116] — all pinned RED-first [4 RED: the
stat-value-contract leads-variant it + the body-pregate handler-scoped
it + the dch MONTHS_SHORT it + the gate-script E2E_PORT it; +4 its =
1279] and proven non-vacuous in a pre-fix 57e692b worktree [4 failed |
74 passed there]; GATE: lint 0/0 · tsc 0 · 1279/1279 unit (79 suites)
· build clean · 116/116 e2e on a fresh CI=1 boot (2.7m, all 9
mobile-nav checks green) · 65th drift-sweep clean (40th consecutive
stable reference bundle) · LIVE-verified (the leads computed styles;
the pre-gate 400 + honest 200 round-trip; the drawer both directions
at TRUE 390px; zero overflow ×10; NO Tailwind v4 bug; the closing
census MATCH) · 2 screenshots (05 re-captured + 79-mobile-overflow-
sweep NEW; VLM-verified 3/3 + 3/3) · docs at SKILL v1.66.0 (§16bi +
project_state via the assert-first scripts/skill_edits_s69.py at the
sandbox root, 6352 -> 6399 lines by wc -l) + session_131.md + the
plan's execution record + both worklogs + README/AGENTS/CLAUDE/PAD at
1279+116 (badge 1395; the AGENTS mobile-nav sub-count refreshed 7 →
9, closing the stale s66 carrier in passing); .env/.env.example
verified (no env surface change; DATABASE_URL file:../db/custom.db
with db/ at the repo root; the intake: the FRESH CLONE — .env
re-created from .env.example with a generated AUTH_SECRET; the stale
platform DATABASE_URL override still points at the non-existent
mirror, all operations under env -u DATABASE_URL).

**Session-72 (SKILL v1.69.0)** — the settings/profile seam session (the
72-c fresh-eyes rotation on the NEVER-AUDITED settings/profile seam
— settings-page 549 + profile-page 349 + the settings/users/upload
routes + the store slices — session_134's own suggested target,
finding the N-72 family with every claim manually validated + the
parity-bearing fixes bundle-decoded [the standing parities
re-verified clean; the S48-P2 string-array data model stands]; the
72-a s71 re-audit 10/10 GENUINE [the settings/profile value-keyed
remount seam flagged — this session's own target]; the 72-b
graduation audit ZERO graduations 13/13 [29th consecutive], the 8
censuses clean, the 6 guard suites 48/48; both operator decisions
standing: the CSV formula-injection posture (b) [31st re-affirmation]
+ the source-vocabulary documented parity EXTENDING to the seam): the
H-72c1 PICKLIST ITEM-ROW ANATOMY [the reference's ly renders
BORDERED LIST ROWS — flex items-center gap-2 p-2 border rounded-lg
hover:bg-gray-50 — each with a span.flex-1 name + a Pencil ghost
icon button (the inline RENAME: the row swaps to an Input flex-1
[Enter saves] + a Save-icon + an X) + a Trash2 ghost icon button in
text-red-600 hover:text-red-700; our chip pills were a scaffold-era
invention the S12-P8 "chip rows — ALIGNED" misread protected for 71
sessions — the probe pinned the container + the add-row but never
the item row; zero rounded-full classes in the reference's picklist];
the M-72c1 EDITOR REMOUNT-WIPE RETIREMENT [the
`cfg-/def-${JSON.stringify(settings)}` keys remounted the editors
~RTT after every own save — focus lost, in-flight typing wiped; the
ConfigEditor is now PROPS-DRIVEN (the reference's React-Query
shape: items render from store data, only the transient edit state
local — a failed PUT can no longer leave a phantom item, the s46-P3
revert now structural) and the DefaultsEditor keys on the RESOLVED
EPOCH only (key={settings ? "resolved" : "pending"} — the s71
open-epoch sibling: one remount when the fetch lands, none on
saves)]; the M-72c2 USERS-PATCH BODY PRE-GATE [the 13th sessioned
req.json() route joins the F-68a2 family — the api.ts +
body-pregate "all 12" claims re-anchored]; the M-72c3 AGENDA
RETIREMENT [the invented third calendar-view option — the
reference's Select ships exactly month/week, bundle-decoded; the
route enum + the dch/api-robustness pins re-anchored]; the M-72c4
INSTANT-RENDER RESTORATION [both editor tabs render immediately —
"No items yet" ×5 + the AED/new/B/3/month/monday fallbacks; the
"Loading settings…" gates were an S25-P1 violation]; the M-72c5
DATA-PANEL SPACE-Y-6 [24px directly on the panel, the inner 16px
wrapper retired]; the L-72c1 EXPORT ICONS ×4; the S72-P7 PROFILE
SEXTET [the updateUser STORE ACTION — call() envelope + the s64
write-guard + set({ user: res.data }): the reference's t(await me())
contract, the Account card reading the STORE user's photo/name (the
pre-reload update), the single-arg toasts, the three-dot
"Saving...", the HEADERLESS text-center py-12 "Loading..." branch,
the icon-dropping "Uploading..." label; the raw-fetch census
nine→eight call-sites across seven endpoints]; the S72-P8 DEFAULTS
INPUT PARITY [raw keystrokes — the route's server-side uppercase +
caps own the guard; the AED/new/B placeholders]; the hygiene pair
[the dead size="sm" on the add button; the pure set() — next
computed OUTSIDE the updater]; the THREE E2E ADDITIONS [the picklist
add/rename/delete round-trip — the ListEditor's first e2e,
self-cleaning; the defaults debounce + FOCUS-persistence contract;
the upload negative — the documented standing gap closed; 119 →
122] — all pinned RED-first [35 RED: the settings-profile-parity
suite's 25 + the rewritten settings-rollback 4 + the body-pregate
13th-route it + the re-anchored dch agenda enum + the page-layout
itemRow/deleteBtn pair + the two mid-flight lockstep re-anchors the
runs caught (the s57 dch living-surfaces guard + the s43
api-robustness calendarView message); +30 its = 1330] and proven
non-vacuous in a pre-fix 0e40a09 worktree [35 failed | 473 passed
there — exactly the modified-pin set] — GATE: lint 0/0 · tsc 0 ·
1330/1330 unit (81 suites) · build clean · 122/122 e2e on a fresh
CI=1 boot (3.0m, all 9 mobile-nav checks green) · 68th drift-sweep
clean (43rd consecutive stable reference bundle: size 1,631,071 +
md5 a70a637fcf1d4291da8e0d965676dc11) · LIVE-verified (the bordered
rows with the Pencil/Trash2 red pair + zero chips; the rename
round-trip in place; the focus SURVIVING the debounce flush with the
PUT landing; the Data panel's computed 24px; the four export icons;
the profile upload → form-only preview → save → the pre-reload
Account-card img → the post-reload topbar pickup; the drawer at TRUE
390px with focus restored; zero 390px overflow on all ten routes; NO
Tailwind v4 bug; the closing census MATCH with the probe photo
cleared) · 2 mid-flight repairs (the e2e hasText/value locator trap
via the run; the two lockstep pin re-anchors via the runs — all
caught by the gate, none post-ship) · 2 screenshots
(83-settings-picklist-rows + 84-settings-defaults NEW; VLM-verified
4/4 + 4/4) · docs at SKILL v1.69.0 (§16bl + project_state, applied
atomically via the assert-first scripts/skill_edits_s72.py at the
sandbox root, 6509 → 6619 lines by wc -l) + session_138.md + the
plan + its execution record + the worklog + README/AGENTS/CLAUDE/
PAD at 1330+122 (badge 1452); .env/.env.example verified (no env
surface change; DATABASE_URL file:../db/custom.db with db/ at the
repo root; the intake: the sandbox SURVIVED s71 — the pull
fast-forwarded f38f675 → 0e40a09, docs/session_137.md only, zero
code drift; the stale platform DATABASE_URL override still points
at the non-existent mirror, all operations under env -u
DATABASE_URL).

**Session-71 (SKILL v1.68.0)** — the permanently-mounted dialog-family
session (the 71-c fresh-eyes rotation on the NEVER-AUDITED
entity-dialogs family — entity-dialogs.tsx 1081 + entity-edit-dialog.tsx
254 + dialog.tsx + the siblings + the consumers — finding the N-71
family with every claim manually validated + the parity-bearing fixes
bundle-decoded [5 of 10 findings DISMISSED at validation: L-2 a
false-positive (the DialogFooter constant already exact), I-2/I-3/L-3/
N-4 confirmed parities from the bundle]; the 71-a s70 re-audit 10/10
GENUINE [the N-71x "eight raw-fetch exceptions" precision note ->
the nine-call-sites-across-eight-endpoints carrier]; the 70-b-style
graduation audit ZERO graduations 13/13 [28th consecutive], the 8
censuses clean; both operator decisions standing: the CSV
formula-injection posture (b) [30th re-affirmation] + the
source-vocabulary documented parity): the M-71a1 ACTIVITYFORM
RENDER-TIME KEY RETIREMENT [the create key rode
`${defaultType}-${Date.now()}` — every parent re-render while the
dialog was open re-keyed the form and WIPED the typed input; all
five consumer pages destructure the whole store, so the first-load
slice resolutions were a guaranteed re-render source]; the
M-71a2/I-71a4 EXIT-ANIMATION RESTORATION [the three EntityEditDialog
outer keys unmounted the Radix Root in the same batched close render
— the pinned data-[state=closed] chrome NEVER played; the five
create dialogs' `{open && ...}` conditionals emptied the body
mid-exit — the reference renders W7/wce/Mke + its create forms
UNCONDITIONALLY, no keys, full bodies animating out (bundle-decoded;
its own prop-sync rides setState-in-effect, an ERROR under our
lint)]; the S71-P1 OPEN-EPOCH KEY PATTERN [the adjust-during-render
useOpenEpoch counter bumping ONLY on false→true transitions: fresh
state per open against the live props (the s46 F-46f contract
preserved — the epoch remount re-reads the resolved settings slice),
inert to store re-renders while open, full body through the exit];
the S71-P2 SAVINGEDIT WIRING [the three edit call sites feed
isLoading with the setSavingEdit bracket — the reference's own
disabled/"Saving..." capability, the N-46e posture closed with the
double-submit guard]; the S71-P3 EVENT STATUS LITERAL FORM; the
S71-P4 HYGIENE QUARTET [the invented hideClose prop retired from
dialog.tsx; ContactForm's dead settings destructure; the slide-over's
dead `??`; the zero-consumer DIALOG_FIELDS_WRAPPER.contact/.account
records]; the TWO E2E ADDITIONS [the Log Activity quick-create
round-trip — the ActivityDialog's first e2e with the 700ms
typed-value persistence window + the exit-phase/reopen-fresh pair;
117 -> 119] — all pinned RED-first [16 RED: the dialog-mount-contract
suite's 8 + the rewritten edit-dialog-remount 4 + the dch hygiene
trio + the re-anchored page-layout wrapper pin; +13 its = 1300] and
proven non-vacuous in a pre-fix 098ce51 worktree [16 failed | 239
passed there]; GATE: lint 0/0 · tsc 0 · 1300/1300 unit (80 suites) ·
build clean · 119/119 e2e on a fresh CI=1 boot (3.0m, all 9
mobile-nav checks green) · 67th drift-sweep clean (42nd consecutive
stable reference bundle) · LIVE-verified (the typed value surviving
the settle window; the exit phases on BOTH families with the edited
values in the animating bodies; the reopen-fresh epoch contract; the
edit round-trip; the drawer both directions at TRUE 390px with focus
restored; zero overflow x10; NO Tailwind v4 bug; the closing census
MATCH) · 2 screenshots (81-log-activity-dialog + 82-edit-contact-dialog
NEW; VLM-verified 4/4 + 4/4) · docs at SKILL v1.68.0 (the new §16bk +
project_state, applied atomically via the assert-first
scripts/skill_edits_s71.py at the sandbox root) + session_135.md +
the plan + its execution record + both worklogs + README/AGENTS/
CLAUDE/PAD at 1300+119 (badge 1419).

**Session-70 (SKILL v1.67.0)** — the chart-family honesty + the store
write-guard session (the 70-c fresh-eyes rotation on the NEVER-AUDITED
Zustand store + charts family seam — 739 lines + consumers — finding
the N-70 family with every claim manually validated + the
parity-bearing fixes bundle-decoded; the 70-a s69 re-audit 12/12
GENUINE [F-70a1 the STAT_CARD.value text-foreground survivor — the
5th stat-card family, pinned AS-CORRECT at page-layout.test:393;
F-70a2 the record-precision pair -> session_133 errata]; the 70-b
graduation audit ZERO graduations 13/13 [27th consecutive], the 8
censuses clean; both operator decisions standing: the CSV
formula-injection posture (b) [29th re-affirmation] + the
source-vocabulary documented parity): the F-70a1 STAT_CARD.VALUE
RETIREMENT [TrendStatCard — the calendar KPI x4 — now the bare
`text-2xl font-bold` family form; the reference's calendar values are
text-2xl font-bold text-gray-900 (bundle-decoded, computed
rgb(17,24,39)/24px/700/32px LIVE); the pin re-anchored in lockstep +
the stat-value-contract gaining the 5th family]; the N-70c4
REPORTS_PIE_FILLS CONSTANTS [four/five in constants.ts, the three
reports pies consuming them — #ec4899 was in ZERO test assertions; +
the new e2e sector-fills check]; the N-70c5 BY-TYPE FAMILY REWIRE
[SingleBarChart grid={false} tickFontSize={10} height={150}; the
invented name="Logged" retired — the tooltip reads "count : N" like
the reference; the whole recharts import retired from the page]; the
N-70c6 ANIMATION RETIREMENT x3 [the funnel + the Sparkline Area/Line
arms drop isAnimationActive={false} — ALL 38 bundle occurrences are
recharts library internals, zero reference call-sites]; the N-70c2
UPDATESETTINGS WRITE-GUARD [the post-await set captures the s64
session token — a logout between the PUT resolution and the set
re-populated the cleared settings slice; updateLead's optimistic set
documented as task-synchronous, no guard needed]; the N-70c10
UPDATELEAD REFETCH SHAPE [fetchLeads unconditional as the rollback,
fetchDashboard gated on res.ok]; the N-70c3/c1 comment carriers [the
store header's only-sanctioned-client claim re-scoped; the first-load
duplicate-GET documented as the page-effect's one-shot retry]; the
TWO E2E ADDITIONS [the reports pie sector-fills check + the post-wipe
fixed-list-flat-bars assertion in the reset test — the s10
real-chart-renders-empty parity, LIVE-only until now; 116 -> 117] —
all pinned RED-first [8 RED + the page-layout lockstep pin + the dch
s56 re-anchor; +8 its = 1287] and proven non-vacuous in a pre-fix
047f3be worktree [10 failed | 286 passed there]; GATE: lint 0/0 · tsc
0 · 1287/1287 unit (79 suites) · build clean · 117/117 e2e on a fresh
CI=1 boot (2.7m, all 9 mobile-nav checks green) · 66th drift-sweep
clean (41st consecutive stable reference bundle) · LIVE-verified (the
calendar KPI bare form at 24px/700/32px; the pie fills; the by-type
tooltip "Email count : 3"; the funnel labels x4; the drawer both
directions at TRUE 390px with focus restored; zero overflow x10; NO
Tailwind v4 bug; the closing census MATCH) · 2 screenshots (06
re-captured + 80-activities-bytype-family NEW; VLM-verified 4/4 +
4/4) · docs at SKILL v1.67.0 (the new §16bj + project_state, applied
atomically via the assert-first scripts/skill_edits_s70.py at the
sandbox root, 6399 -> 6446 lines by wc -l) + session_133.md [the
odd-number record convention] + the plan's execution record + both
worklogs + README/AGENTS/CLAUDE/PAD at 1287+117 (badge 1404);
.env/.env.example verified (no env surface change; DATABASE_URL
file:../db/custom.db with db/ at the repo root; the intake: the
sandbox SURVIVED s69 — the pull fast-forwarded 94aab54 -> 047f3be,
docs/session_132.md only, zero code drift; the stale platform
DATABASE_URL override still points at the non-existent mirror, all
operations under env -u DATABASE_URL).

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

**Session-73 (SKILL v1.70.0)** — the topbar/search + row-menu family
session (the 73-c fresh-eyes rotation on the topbar/search family —
topbar.tsx 262 + mobile-nav 206 + app-shell 70 + sidebar 79 +
api/search 73 + the page-layout records + the ui kit — session_138's
own suggested target, never a dedicated rotation, finding the N-73
family with every claim manually validated + the parity-bearing fixes
bundle-decoded AND live-measured [the computed-16px icon cascade
measured on the reference itself]; the 73-a s72 re-audit 9/9 GENUINE
+ 5 Nano notes [the N-73a1 api.ts comment half-claim — fixed this
session]; the 73-b graduation audit ZERO graduations 13/13 [30th
consecutive], the 8 censuses clean; both operator decisions standing:
the CSV formula-injection posture (b) [32nd re-affirmation] + the
source-vocabulary documented parity EXTENDING to the family [the
row-menu vocabularies now bundle-verified verbatim]): the M-73c6
ROW-MENU MIGRATION [the four row-action menus — accounts/contacts/
leads/calendar — moved from the Popover-based Dropdown (role=dialog)
to the REAL Menu* primitives: the reference ships five Yg align:"end"
DropdownMenus bundle-decoded with 13 stock text-only $s items; role=menu
+ arrow-key navigation + the S46-P7 click containment extended to
MenuContent, LIVE-proven — the accounts Edit opens ONLY the edit
dialog, zero row-click ghosts] — PLUS the M-73c7 ITEM-ICON +
SEPARATOR RETIREMENT [the Pencil/Trash2 icons + the leads separator
gone; the DropdownSeparator component retired with its last consumer
while DropdownLabel stays per the N-56e operator KEEP] — PLUS the
M-73c8 LEADS-TRIGGER SIZE [iconSm 28px → the stock 36px] — PLUS the
M-73c9 RED-DELETE LITERAL [className="text-red-600" on the stock base;
the destructive prop's danger-soft hover retired] — PLUS the topbar
sextet [the L-73c1/c2/c9 mail/bell as the STOCK ghost icon Buttons
with text-gray-600 hidden sm:flex — the icons COMPUTE 16px under
their w-5 h-5 class noise via the [&_svg]:size-4 cascade, LIVE-
measured; the L-73c3 header border-line-strong (the reference's
explicit gray-200, the S12-P3 inventory corrected); the L-73c4 "Hi,"
chain (user.name || user.email || "Guest", no @-split) + the avatar
"G" terminal; the L-73c5 Profile item as MenuItem asChild + next/link
— a REAL anchor with the middle-click semantics] — PLUS the
N-73c5/c6 STOCK-MIRROR COMPLETION [BUTTON_BASE.svgSize +
INPUT_BASE.file — both live-dumped from the reference's bases] — PLUS
the N-73c2/c7 SEARCH HYGIENE PAIR [the debounce success-path abort
gate; the /api/search include trim] — PLUS the N-73a1/a3 STRAGGLERS
[the api.ts 13-route comment + the body-pregate header; the
DefaultsEditor's dead single-child wrapper] — PLUS the FOUR E2E
CLOSURES [the logout round-trip; the signup 4xx negatives (the
duplicate in the card + the API trio); the contact upload negative
trio (the non-image client alert + the oversized pre-gate 400 + the
unsupported svg — the run's own gif-whitelist discovery); the
quick-create dropdown smoke; 122 → 126] — all pinned RED-first [38
RED: the topbar-rowmenu-parity suite's 26 (one green-through-RED by
window accident) + the page-layout re-anchors 6 + the dch trio + the
calendar-cells pin + the leads-inline pair + the route-case anchor;
+26 its = 1356] and proven non-vacuous in a pre-fix 06e50f7 worktree
[38 failed | 311 passed there — exactly the modified-pin set]. The
documented supersets kept + commented in-code: the contacts Log
Activity wiring (the reference's item is DEAD — the S29-P2 twin; ours
opens the ContactDetailPanel) + the row-delete window.confirm gates
(the reference's deletes are direct) + the mail/bell aria-labels.


**Session-86 (SKILL v1.83.0)** — the accounts filter-rail session (the
86-c fresh-eyes rotation on the standing session_165 alternate — the
Oce rail's own chrome + the accounts page's filter/tier/export family,
never a dedicated pass: s28 pinned the rail structure, s17 the CHECKBOX
anatomy, but nobody had decoded the rail's select family, the filter
memo, the tier derivation, or the export's row basis — finding the
N-86 family [2 M + 2 L + 3 N] with every claim bundle-decoded from the
byte-stable reference + LIVE-probed on BOTH apps): the M-86c1 ACCOUNT
STATUS VOCABULARY SPLIT [the reference's bce + wce dialogs both ship
Active/Inactive/PROSPECT; our edit config had it right but
ACCOUNT_STATUSES + both API validators carried CHURNED — the edit
dialog's own offered Prospect option ALWAYS 400'd; the trio unified,
the seed's Sahara churned→inactive, the option now SAVES
(LIVE-verified end-to-end)] + the M-86c2 COMPUTED-TIER DERIVATION [the
reference derives tier from revenue (>1M Key / >500k A / >100k B /
else C) at the row/KPI/filter/exports; ours read the STORED isKey/tier
— 4 Key + a spread on the seed vs the reference's 9 Key + 1 A; the new
src/lib/account-tier.ts seam consumed at all six sites, the stored
columns + write seams RETIRED, the settings defaultTier stays as the
reference's own dead-default parity] + the L-86c3 SEARCH SCOPE [the
reference filters NAME ONLY; our name+industry+email concat retired] +
the L-86c4 EXPORT ROW BASIS + HEADER BINDING [the reference maps the
FILTERED rows under the zero-RAW guard + binds the RAW zero on the
header button — ours mapped ALL accounts + bound the filtered zero;
the s26 "FULL list" note was a misdecode, the N-62e ambiguity
RESOLVED] + the N-86c5 THREE DEAD SELECTVALUE PLACEHOLDERS ["John
Kuy"/"Technology"/"$1M to $5M" mirrored — dead in both apps, the
N-83c5 precedent] + the N-86c6 SEARCH INPUT h-9 [the reference's
explicit pl-9 h-9 mirrored] + the N-86c7 SUPERSET DOCUMENTATION [the
reference's Owner/Revenue selects are DEAD filters + its Save All has
no onClick + its item sets are STATIC — ours filter/reset/map live,
now documented per the S33-P1/S47-P1 convention] — all pinned RED-first
[19 failing pins: the new accounts-rail-parity suite's 25 its minus the
6 green anchors; non-vacuousness proven: 19 failed | 1693 passed (1712
total) — exactly the modified-pin set, ZERO collateral; 5 mid-flight
pin-shape repairs, all anchor-side]; GATE: lint 0/0 · tsc 0 ·
1709/1709 unit [95 suites, +22 net] · build · 132/132 e2e fresh CI=1
[3.2m, FIRST run green; all 9 mobile-nav green] · LIVE-verified [the
computed family at 9 Key + 1 A + stars 9 + tints 9 + the KPI 9; the
name-only search; the Prospect save persisted; the rail trio; the
drawer at TRUE 390px full-bleed + dual lock + navigate-close + closed
inert+hidden; zero overflow; the closing census MATCH + the reference
md5-exact] · 3 screenshots [112 + 113 + 114, VLM 3/5-both-NOs-DOM-
disproven + 3/3 + 4/4] · docs at SKILL v1.83.0 [§16bz + project_state]
+ README badge 1841 + AGENTS/CLAUDE/PAD at 1709+132 [+ the PAD s86
inventory row + the Total 95/1709 + the N-86a1 footnote fix] +
session_169.md + the plan + its execution record + the worklog; the
React-Compiler hazard documented (the forward-reference bail —
exportAccounts reading the later-declared filtered const).


### Session-87 — the dashboard KPI-family rotation

The standing session_167 alternate. The KPI cards' own inner
construction walked for the first time (s12 the de-hover + the label
gray-600; s27 the statics + geometry; s78 the raw-percentage bars —
nobody the Card/CardContent split, the label/value row divs, the
spark double-container, the bars' span/div + class/inline color
mechanisms, the chart headers' inner rows, or the filter bar's
source chrome). The N-87 family [1 M + 2 L + 5 N]: the M-87c1 SUFFIX
COLOR [the "days" suffix text-muted gray-500 → the reference's
literal text-gray-600 rgb(75,85,99), LIVE-verified] + the L-87c2
SPARK CONSTRUCTION [ONE slot div per card with the chart as the
DIRECT child — the bare RC / the bare div bars with bg-CLASSES for
the static pair + inline only for colorFor; the KpiCard owns the
variant-aware sparkClassName; the Sparkline is content-only; the
className prop + the aria-hidden + the reports' intermediate div
retire] + the L-87c3 CARD STRUCTURE [Card > CardContent "p-4 sm:p-6"
> the labelRow (flex justify-between items-start mb-2 > span) + the
valueRow (bare flex items-end gap-2 — NO mt-2, NO flex-wrap) + the
slot; the value a SPAN, the delta/valueNote DIVs] + the N-87c4
dead placeholders [stage/source mirrored; the view switcher's
"Format" documented-unmirrorable — our functional "" default would
RENDER it] + the N-87c5 bare sm:w-auto + the N-87c6 explicit pl-9
h-9 + the N-87c7 chart headers [Pipeline the BARE stock header; the
other five the nested flex justify-between items-center rows + the
Last-6-months literal text-gray-500] + the N-87a1 vacuous tier row
retired. RED 25 pins (non-vacuous: 25 failed | 1709 passed, ZERO
collateral; 1 RED-phase pin-shape repair — the view-switcher
placeholder unmirrorable) + 3 lockstep re-anchors (page-layout
KPI_CARD.card, dashboard-family bars-arm + KPI_SPARK.bars doc,
reports-filter LineChart margin). GATE: lint 0/0 · tsc 0 · 1733/1733
unit [96 suites, +24 net] · build · 132/132 e2e fresh CI=1 [3.2m,
FIRST run green; all 9 mobile-nav green]. LIVE-verified [the suffix
rgb(75,85,99); the single-container sparks with div bg-class bars;
the Card>CardContent walk; the six headers; the filter bar; the
drawer at TRUE 390px full-bleed + dual lock + navigate-close +
closed inert+hidden; zero overflow; the closing census MATCH + the
reference md5-exact — the 58th consecutive stable session]. 3
screenshots [115 + 116 + 117, VLM 5/5 + 4/4 + 3/4-the-one-NO-a-
prompt-artifact-DOM-disproven]. Docs at SKILL v1.84.0 [§16ca +
project_state] + README badge 1865 + AGENTS/CLAUDE/PAD at 1733+132
[+ the PAD s87 inventory row + the Total 96/1733] + session_171.md
+ the plan + its execution record + the worklog.

### Session-88 — the contacts filter-panel + stat-card rotation + the v3-palette re-pin

The standing session_171 first-listed alternate (the kke panel's own
chrome + the Rx stat cards + the Cke toolbar/export/shrink family)
PLUS the rotation's root-cause discovery: THE V4 PALETTE DIVERGENCE —
Tailwind v4's default palette is NOT v3's (blue-600 v4 #155dfc
rgb(21,93,252) vs the reference's v3 #2563eb rgb(37,99,235); red-600
Δ38; green-400 Δ69; amber-400 Δ36; purple-600 Δ35; cyan-400 Δ34) — 56
of the 118 literal classes used in src/ diverged visibly (canvas pixel
reads vs the reference's compiled CSS). FIXED by the @theme
V3-PALETTE RE-PIN: 92 tokens covering every literal (family, step)
used in src/, verified against the reference's compiled CSS on 97
rules (zero mismatches) — the fifth member of the v4 re-pin family
(shadow-sm s9 → blur-sm s10 → space-y s11/s14 → hover-variant s80 →
palette s88); the S15-P12 hazard retired family-wide. The N-88 family
[4 M + 3 L + 4 N]: the M-88c1 PALETTE [above] + the M-88c2 ROW ICON
[Zap → the reference's AC=tr("Activity") pulse — the M-82c2 missed
sibling] + the M-88c3 AWARD PAIR [wT=tr("Award") at the stat card +
the name-cell overlay; the bundle ships NO Crown] + the M-88c4 SOURCE
LABEL CASE [the reference capitalizes via charAt(0).toUpperCase()+
slice(1); the id/value stay raw] + the L-88c5 STAT CARD SPLIT [Card >
CardContent "p-6" > the row; the chip as a bg-CLASS mechanism; the
trend row div with explicit-color TrendingUp|TrendingDown + trendDir;
the subValue/tone/color retire from the contacts arm] + the L-88c6
EXPORT BINDING [disabled reads the RAW list — the bundle's
$.length===0; the s63 "unresolvable" resolved; filter-to-empty keeps
the export enabled] + the L-88c7 mr-[500px] DETAIL SHRINK [the scroll
area narrows while the Pke slide-over is open] + the N-88c8 mobile
badge extras retired [font-medium lost the twMerge fight — 500 vs the
base's 600] + the N-88c9 aria-expanded superset documented + the
N-88a1/a2/b1 audit nanos [the "nine"→8 describe title; the stale s11
comment; the 115/116 byte-identical duplicate re-captured]. The kke
panel itself verified BYTE-EXACT (the s28+s75 layers hold). RED 17
pins (non-vacuous: 17 failed | 1733 passed, ZERO collateral; 2
pin-shape repairs — the census count + the arm window). GATE: lint
0/0 · tsc 0 · 1750/1750 unit [97 suites, +17 net] · build · 132/132
e2e fresh CI=1 [3.2m, FIRST run green; all 9 mobile-nav green].
LIVE-verified [every probed palette class computing the reference's
exact rgb; the stat card walk; the icons; the labels; the binding; the
500px shrink; the badge weight; the drawer at TRUE 390px full-bleed +
dual lock + navigate-close + closed inert+hidden; zero overflow; the
closing census MATCH + the reference md5-exact — the 59th consecutive
stable session]. 3 screenshots NEW [118 + 119 + 120] + the 116
RE-CAPTURE, VLM 4/5 + 3/5 + 4/4-effective + 4/4 (every NO an
artifact, DOM/bundle-disproven). Docs at SKILL v1.85.0 [§16cb +
project_state] + README badge 1882 + AGENTS/CLAUDE/PAD at 1750+132
[+ the PAD s88 inventory row + the Total 97/1750] + session_173.md +
the plan + its execution record + the worklog.


### Session-89 — the leads stat-card family (the Sm decode)

The remaining standing alternate per session_173's suggested next —
the Sm KPI-card family's own construction never walked (s11 the
shadow, s29 the derivations, s68/s69 the value typography, s77 the
chip PAIRS; nobody the Card/CardContent split, the chip's
element/guard mechanism, the value's explicit color, or the dead
trend row). The N-89 family [1 M + 2 L + 4 N]: the M-89c1 VALUE
COLOR [the reference's Sm value = text-gray-900 LIVE rgb(17,24,39);
ours inherited the page ink rgb(10,10,10) — the F-69a1 s69
misdecode resolved; the dashboard values stay bare on both apps] +
the L-89c2 CARD SPLIT [Card (bare) > CardContent "p-4 sm:p-6" — the
merged-padding div retires; the L-87c3/L-88c5 genus, the LAST
stat-card arm] + the L-89c3 CHIP [the icon-guarded width-first DIV
consuming STAT_CHIP_PAIRS, chipTone defaulting "blue"; the
SPAN/shrink-0/aria-hidden extras retire] + the N-89c4 CircleX
import [BQ=tr("CircleX"); the deprecated XCircle alias retires] +
the N-89c5 DEAD TREND MECHANISM [the Sm's number-trend row —
sign-colored, w-3 h-3 icons, Math.abs + "%"; dead in the reference;
mirrored via the shared prop's number arm] + the N-89c6 LUCIDE SVG
aria-hidden SUPERSET documented [the 0.525 library injects it on
every a11y-prop-less icon; the reference's older lucide renders
bare svgs — icons.tsx] + the N-89c7 subValue truthy guard. The
foundations SOLID (the six H-memo derivations expression-for-
expression, the grid token, the chip pairs, the 390px geometry).
RED 10 pins (non-vacuous: 10 failed | 1749 passed, ZERO collateral;
3 pin-shape repairs). GATE: lint 0/0 · tsc 0 · 1759/1759 unit
[98 suites, +9 net] · build · 132/132 e2e fresh CI=1 [3.2m, FIRST
run green]. LIVE-verified [the value rgb(17,24,39); the Card >
CardContent walk; the chip DIV; 0 trend rows; the 390px state; the
drawer at TRUE 390px full-bleed + dual lock + navigate-close +
closed inert+hidden; zero overflow; the census MATCH + the
reference md5-exact — the 60th consecutive stable session]. 3
screenshots [121 + 122 + 123, VLM 5/5 + 4/4 effective + 3/4 (the
one NO a VLM-scale artifact)]. Docs at SKILL v1.86.0 [§16cc +
project_state] + README badge 1891 + AGENTS/CLAUDE/PAD at
1759+132 [+ the PAD s89 inventory row + the Total 98/1759] +
session_176.md + the plan + its execution record + the worklog.

### Session-90 — the stat-card family construction (the gm/zv/Mx/ay decode)

The activities/calendar table-family chrome rotation (the
first-listed standing alternate per session_176's suggested next).
The table/priority/timeline/rail surfaces verified SOLID; the
stat-card family FULLY decoded — all four reference components
(gm/zv/Mx/ay) + all twenty call sites + LIVE-probed on BOTH apps.
The N-90 family [2 M + 4 L + 4 N]: the M-90c1 CALENDAR VALUE COLOR
[the Mx value = text-gray-900 LIVE rgb(17,24,39); ours bare →
rgb(10,10,10) — the F-70a1 s70 pin's own comment CITED the gray-900
then shipped the bare form on the FALSE "inherited card foreground"
premise, the M-89c1 misdecode genus] + the M-90c2 REPORTS VALUE
COLOR [the ay value's gray-900 — the s74 comment's own citation] +
the L-90c3 CARD SPLIT ×3 [BarStatCard/TrendStatCard/CircleStatCard
all → Card > CardContent p-4/p-5; the s89 "EVERY stat-card arm"
claim was overbroad] + the L-90c4 BARS [DIVs + the per-arm bg-CLASS
color maps + the raw-percentage height ONLY; the CHART_COLORS -400
family + gray retired] + the L-90c5 CHIPS [the color-KEY pair maps
with the direct-icon mechanism — the icon a component reference] +
the L-90c6 TREND ROWS [the direction-keyed DIV rows, w-3 h-3, up/down
only; the ay font-medium arm dead on the reference] + the N-90c7-c10
nanos + the S90-P0 palette extension [red-400 #f87171 + purple-400
#c084fc; the census 92 → 94] + the two audit nanos [the README "all
FIVE families" prose + the stat-value-contract "bare" title]. RED 40
pins (non-vacuous: 40 failed | 1748 passed, ZERO collateral; 6
pin-shape repairs + 6 lockstep re-anchors). GATE: lint 0/0 · tsc 0 ·
1788/1788 unit [99 suites, +29 net] · build · 132/132 e2e fresh
CI=1 [one known-sensitive settings-debounce flake on the first run,
green standalone + on the re-run]. LIVE-verified [the calendar +
reports values rgb(17,24,39); the Card > CardContent walks; the DIV
bars at the reference's compiled v3 rgb on every new palette pin;
the direct-icon chips; the 390px state; the drawer battery; the
census MATCH + the reference md5-exact — the 61st consecutive stable
session]. 3 screenshots [124 + 125 + 126, VLM 5/5 + 4/4 + 4/4].
Docs at SKILL v1.87.0 [§16cd + project_state] + README badge 1920 +
AGENTS/CLAUDE/PAD at 1788+132 [+ the PAD s90 inventory row + the
Total 99/1788] + session_179.md + the plan + its execution record +
the worklog.

### Session-91 — the v4 space-y hazard family (the 91-c full-app zero-data screenshot diff)

The strong sweep: both apps driven to the reference's own ZERO-DATA
state (scripts/zero-data.ts clearing the 7 domain tables incl.
opportunity), 9 pages per app at 1440×900, pairwise pixel diff +
cluster analysis + DOM probes on BOTH apps. Four pages byte-clean
[accounts/reports 0.00%, calendar/activities 0.01%], every other diff
explained [contacts 0.51% noise + the lucide superset, dashboard 0.33%
a 2px zero-area chart artifact, settings 4.73% the picklist-DATA
genus], and TWO real finds + the bundle-decoded siblings — ALL ONE
ROOT CAUSE: **v4's space-y compiles margin-BOTTOM on NON-LAST children
inside `:where()` at zero specificity where v3 compiled margin-TOP on
FOLLOWING siblings at (0,3,0)** — identical for plain block stacks,
diverging exactly when a non-last child is INLINE (every shadcn Label;
vertical margins do not apply to inline boxes) or a non-first child
carries `mb-*` (v3's rule kills it, v4's `:where` preserves it).

- **M-91c1** the profile form's four collapsed gaps (4px vs the
  reference's 12px; the form 32px shorter) — FIXED via
  `PROFILE_LAYOUT.controlMt`, the FOURTH of the s14/s15 family.
- **M-91c2** the leads toolbar's dead `mb-4` (computes 0px on the
  reference — v3's rule kills it; ours kept it alive → the table 16px
  lower) — FIXED by the class retirement per the s11 computed-gap rule.
- **L-91c3** the edit dialogs' groups (the reference ships BARE
  unclassed divs) — FIXED to the bare construction.
- **L-91c4** the import dialog's Select File group (ref 12px vs ours
  4px) — FIXED with mt-2 on the dropzone wrapper.
- **N-91c5** the genus sweep + the 7 audit nanos (G-91a1..a5 + B-1/B-2,
  the count-in-comment genus guard re-run).
- The 91-a s90 re-audit 13/13 GENUINE; the 91-b graduation audit zero
  graduations 13/13 (the 48th consecutive); both operator decisions
  re-affirmed (the 51st).

RED 9 pins (non-vacuous: 9 failed | 1792 passed, ZERO collateral,
re-proven via the src stash). GATE: lint 0/0 · tsc 0 · 1801/1801 unit
[100 suites, +13 net] · build · 132/132 e2e fresh CI=1. LIVE: the
profile gap 12px + form 504px; the leads toolbar 121px + row mb 0 +
table y496; the edit groups BARE at 4px; the import gap 12px; the
drawer battery at TRUE 390px; THE ZERO-DATA RE-DIFF: leads 2.17% →
0.00% + profile 2.08% → 0.00% — both BYTE-CLEAN. 3 screenshots
[127 + 128 + 129, VLM 5/5 × 3]. Docs at SKILL v1.88.0 [§16ce +
project_state] + README badge 1933 + AGENTS/CLAUDE/PAD at 1801+132
[+ the PAD s91 inventory row + the Total 100/1801] + session_182.md +
the plan + its execution record + the worklog.


### Session-92 — the dialogs-at-390 family walk (the phantom-mb select-trigger genus)

The 92-c rotation: every dialog family opened at TRUE 390×844 on BOTH
apps, geometry + construction diffed live. The outer chrome SOLID on
every family; four real finds in the interiors — three of them new
faces of the v4 space-y genus:

- **M-92c1** the phantom-mb select-trigger genus: Radix renders a
  hidden native `<select>` (position:absolute, no `hidden` attribute)
  as the LAST TREE-CHILD of every Select group inside `<form>`
  contexts — v4's `:not(:last-child)` matches the TRIGGER and gives it
  margin-bottom 8px (v3 gave triggers margin-TOP only, mb always 0).
  In plain block groups the phantom mb collapses out; where the group
  is a DIRECT GRID ITEM (a BFC — margins contained) the group inflates
  68 → 76px (the Account Status + Contact source groups). FIXED via
  `DIALOG_GROUP.controlMt` "mt-2" → "mt-2 mb-0". The Lesson:
  `:last-child` matches the TREE, not the layout.
- **L-92c2** the contact dialog's flattened sections (the reference
  nests `space-y-4 [H3, groups…]`; ours put the H3s in separate grid
  rows — the H3→field gap 24px vs 16px). FIXED: nested.
- **M-92c3** the Event Description textarea rows=3 (ours rendered the
  HTML default rows=2 — the house's own comment had decoded rows=3 but
  the prop never landed). FIXED.
- **N-92c4** the Import columns-box p2 `mt-2` → `mt-1` (the reference
  COMPUTES 4px — v3's space-y-1 rule at (0,3,0) overrides the
  (0,1,0) utility; ours computed 8px). The M-91c2 genus INVERSE.
- **The sweep tool promoted** (S92-P5): `bun run sweep` — the s91
  zero-data screenshot-diff sweep as a one-command regression
  (scripts/sweep.ts; zero new deps; the pure diffPixels seam; the
  maiden runs ×2 reproducible: five pages byte-clean, every remaining
  diff a standing explained genus).
- The genus-guard nanos: F-92a1 the space-y census re-derived (112
  comment-stripped occurrences across 19 files — the algorithm lives
  in the s92 suite), F-92a2 the stat-value-contract leads-arm
  double-count, F-92a3 CLAUDE.md's stale 1788s, B-92a4 the §Session-91
  history block restored, B-92a5 the constants B-2 label.
- The 92-a s91 re-audit 8/8 GENUINE; the 92-b graduation audit zero
  graduations 13/13 (the 49th consecutive); both operator decisions
  re-affirmed (the 52nd).

RED 27 pins (non-vacuous: 23 failed | 1805 passed, ZERO collateral,
stash-re-proven after the pin-shape repairs; 2 lockstep re-anchors).
GATE: lint 0/0 · tsc 0 · 1828/1828 unit [102 suites, +27 net] · build
· 132/132 e2e fresh CI=1 (the known settings-debounce flake green
standalone + on the re-run). LIVE: the Account dialog 508/rows 68×4/mb
0; the Contact sections [197,188,188,68] = the reference exact + gap
16px + formH 817; the Event 646/ta 90 rows=3; the Import 544/box 118;
the drawer battery at TRUE 390px; the sweep maiden ×2 — five pages
0.00%, every diff standing-explained. 3 screenshots [130 + 131 + 132,
VLM 5/5 × 3]. Docs at SKILL v1.89.0 [§16cf + project_state] + README
badge 1960 + AGENTS/CLAUDE/PAD at 1828+132 + session_185.md + the
plan + its execution record + the worklog.

### Session-93 — the popover/menu family at TRUE 390 + the fresh-clone gate repair

The 93-c rotation (the s92 suggested-next): the popover/menu family
opened at TRUE 390×844 on BOTH apps — with NATIVE clicks for Radix
menu triggers (a synthetic `.click()` does not fire the pointer-event
sequence Radix listens for; menus silently fail to open).

- **The leads Filters popover: FULL MATCH** (content 320px @ x=32,
  h=398, radius 6 on both; the interior space-y-4 rows 64×4 + 44 with
  16px gaps on both — the reference's v3 margin-TOP mechanism vs our
  v4 margin-BOTTOM render identically in popover block flow; the
  space-y genus does not bite outside grid BFC / inline-label
  contexts).
- **The topbar account menu: geometry MATCH + the trigger-position
  genus decoded and DOCUMENTED** (topbar.tsx): the reference's
  topbar is [search `hidden sm:flex flex-1 max-w-xl`] + [right
  group] in a `justify-between` row; at 390 the search wrapper is
  display:none so the right group is the SOLE flex item → flex-START
  → the reference's account renders LEFT (an accident of its own
  construction). Ours inserts the hamburger (the deliberate
  mobile-nav superset) → [hamburger LEFT] + [account RIGHT].
  Construction byte-equivalent otherwise; documented as a standing
  explained genus — do NOT restructure to chase the accidental
  left-placement.
- **F-A (HIGH) — the fresh-clone gate repair**: scripts/sweep.ts
  failed `tsc --noEmit` on a fresh clone — the child-process env was
  cast `as Record<string, string | undefined>` before
  `spawnSync({ env })`, and Next 16's `next/types/global.d.ts`
  augments NodeJS.ProcessEnv with a REQUIRED NODE_ENV literal union
  that an index-signature record cannot satisfy (reproduced on
  lockfile-exact versions across fresh-clone/post-build/post-dev-
  types/clean-tsbuildinfo states; the s92 gate's tsc-0 was masked by
  its sandbox's incremental build state). FIXED by retiring the cast
  — the spread's inferred NodeJS.ProcessEnv is the correct env, and
  `delete zEnv.DATABASE_URL` stays legal (the property rides the
  Dict<string> index signature). RED-first pin in the sweep-tool
  suite (stash-re-proven non-vacuous). The Lesson: a green gate on a
  long-lived workspace is evidence about THAT workspace — the
  zero-config contract is only proven from a clean checkout.
- The reference census #89 (isolated session): demo zero, the
  mobile-nav defect STANDS, desktop normal; the drift sweep #89
  bundle md5 EXACT (the 64th consecutive). Our drawer battery
  re-verified LIVE at TRUE 390 — FULLY GREEN.

RED 1 pin (non-vacuous: 1 failed | 8 passed pre-fix, ZERO collateral,
stash-re-proven). GATE: lint 0/0 · tsc 0 · 1829/1829 unit [102
suites, +1 net] · build · 132/132 e2e fresh CI=1 (the known
settings-debounce flake green standalone + on the full re-run). 3
screenshots [133 + 134 + 135, VLM 5/5 × 3 — two adjudications + one
expected below-fold note]. Docs at SKILL v1.90.0 [§16cg +
project_state] + README badge 1961 + AGENTS/CLAUDE/PAD at 1829+132 +
session_187.md + the plan + its execution record + the worklog.

### Session-94 — the tabs family at TRUE 390 + the phone-width sweep mode

The 94-c rotation (the s93 suggested-next, the LAST unwalked
interactive family): the tab strips on all three carrier pages walked
at TRUE 390×844 on BOTH apps — plus the s93 suggested-next #1, the
sweep tool's `--width` phone mode (the rotation method productized).

- **The reports PILL strip: FULL GEOMETRY MATCH** (track 358×82 @
  (16,1333) on both; the grid reflows to cols "174px 174px" with 5
  tabs in 3 rows of 24px, zero gaps, no overflow — the page above the
  tabs renders at identical heights down to the y-coordinate).
- **The settings SEGMENTED strip: FULL MATCH including the defect** —
  3 cols ("116.656/116.672/116.656px"), track 358×36 @ (16,197), and
  "CRM Configuration" scrollWidth>clientWidth on BOTH apps (the
  reference's own whitespace-nowrap clipping at 3 cols × 117px,
  faithfully mirrored — VLM-adjudicated visually benign).
- **The activities SEGMENTED strip: FULL MATCH** (track 326×36 @
  (32,1057) inside the toolbar, 4 cols of 79.5px, 28px row; the only
  delta is DATA — our seeded "Overdue 3" count badge, the reference's
  own construction at zero data).
- **The sweep tool phone mode (S94-P0, TDD)**: `bun run sweep --
  --width 390 --height 844` — the flag parsing, the parameterized
  capture viewport (the hardcoded 1440×900 retired), the
  viewport-tagged shots dir (`sweep-shots/w390x844/`), and the
  width-AGNOSTIC per-page content-wait (`.locator("main")` — the nav
  links are display:none below md on BOTH apps, so the old nav-a
  visible-wait burned 15s/page at 390). RED-first: 3 new pins
  (stash-re-proven non-vacuous: 3 failed | 9 passed pre-fix → 12/12
  post). The MAIDEN run: 8 pages at the ~0.5% mobile-nav-superset
  topbar floor (the displaced account glyphs + hamburger ≈ 1600px ≈
  0.49% of the 390×844 frame) + settings 7.34% (the picklist genus,
  larger share of the narrower frame) — ZERO new drift; both standing
  tables documented in the tool header.
- **The audits**: 94-a (subagent) — the s93 delta 4/4 GENUINE-OK, the
  count-in-comment genus guard finding the F-94a1–a8 stale-count
  family (the mobile-nav "7-check" quartet, the PAD §3.2 tree freeze
  at 77/1257/112, the db-path "16 checks", the §11 Lines-column
  drift) + N-94a1 (the SKILL "16Session-93" §-mangling) — all fixed
  docs-only; 94-b (subagent) — the graduation audit 13/13 GENUINE
  (zero graduations, the ~50th consecutive), the CSV census 17 sites
  zero unguarded, the source-vocabulary diff empty since s90, the
  config layer + the SEO/sitemap layer verified. Both operator
  decisions re-affirmed (54th): CSV posture (b) + source-vocabulary
  parity.
- **The standing layers**: drift sweep #90 (bundle md5 a70a637f… exact
  — the 65th consecutive stable session); census #90 (demo zero,
  desktop 256px/8, the mobile-nav defect STANDS at TRUE 390); the
  drawer battery FULLY GREEN at TRUE 390 (trigger 16,16 36×36; panel
  288px @ x0 computing rgb(37,99,235); 8 links; focus inside; dual
  body+main lock; navigate-close → /Leads; closed root inert +
  hidden + pe-none; Escape-close) — after decoding a probe trap (the
  loose aria-label*=menu selector hits the hidden close button first;
  visibility:hidden preserves geometry + offsetParent).
- **GATE**: lint 0/0 · tsc 0 · 1832/1832 unit [102 suites, +3 net] ·
  build · 132/132 e2e fresh CI=1 (3.2m, zero flakes — one
  environmental chromium crash at setup, clean after the stray-browser
  cleanup; the mobile-nav suite green inside the run). 3 screenshots
  [136 + 137 + 138, VLM 5/5 × 3 — one adjudication (138's
  clipped-label NO vs the DOM-verified shared overflow genus)]. Docs
  at SKILL v1.91.0 [§16ch + project_state] + README badge 1964 +
  AGENTS/CLAUDE/PAD at 1832+132 + session_189.md + the plan + its
  execution record + the worklog.

### Session-95 — the table family at TRUE 390 + the sweep --pages filter

Fresh clone (the workspace reset); the environment rebuilt (.env +
db:push + db:seed, census MATCH). Baseline 1832/1832 → the session's
work took it to 1836/1836 (102 suites).

- **The rotation (95-c)** — the TABLE family at TRUE 390×844 on BOTH
  apps (the s94 suggested next, both at the zero-data state): the
  leads table FULL GEOMETRY MATCH [table 380px in the 358px
  `relative w-full overflow-auto` scroll box inside the 358px
  rounded-lg card on the p-4 bare page; thead STICKY top:0 h:63 bg
  white; the 9 th widths [81,79,0,0,78,61,0,65,16] EXACT; thead at
  y=1142 EXACT; the LIVE sticky check — scrolling main by 800 sticks
  the thead to the container top on BOTH apps]; the contacts table
  FULL MATCH [633px table in the 324px scroll box inside the 326px
  rounded-xl card; the 201px zero-data empty row]; the accounts table
  MATCH + ONE EXPLAINED GENUS [the table surface identical — 472px,
  thead 43, the empty row 85, y=1040 EXACT; the DIFFERENCE is the
  horizontal-overflow MECHANISM: the reference's bare `flex-1`
  (min-width:auto) lets the 472px min-content poke out and MAIN
  h-scrolls (scrollW 488), ours adds `min-w-0` so the table scrolls
  INSIDE its own box (main never h-scrolls) — visually equivalent
  (both cards end flush at the viewport edge; the phone sweep floor
  ~0.5%), ours matching the contacts/leads in-box pattern; do NOT
  restructure]. The interactive-surface program: dialogs s92 →
  popovers/menus s93 → tabs s94 → TABLES s95.
- **The drawer battery at TRUE 390: FULLY GREEN** (re-verified with
  the exact-selector protocol; productized as
  `scripts/drawer-battery-390.ts` — the s94 probe-trap lessons
  encoded). One tooling decode: a pipeline sanitizer strips the
  literal `[h` two-char sequence from displayed outputs (the
  selectors were correct all along; the real catch was the CAPITAL
  /Leads route — the s24 route-case construction).
- **S95-P0 (TDD)**: the sweep `--pages` filter — the pure
  `parsePagesArg` seam (PAGES-order result; unknown names fail fast
  listing the valid names), the wiring through BOTH loops, the
  B-95a8 `--max-diff <pct>` header fix. RED 4 failed | 12 passed →
  stash-re-proven → 16/16; the maiden filtered run (leads,settings)
  reproduced the standing values (0.00% / 4.73%).
- **The audits**: 95-a — the s94 delta GENUINE (the phone-width mode
  verified; the non-vacuousness independently re-proven; the docs
  counts verified against the live tree; F-95a1 the SKILL §5.6
  stale 300-lines/37-checks claim → fixed to 1520/180); 95-b — the
  graduation audit 13/13 GENUINE (zero graduations, ~52nd
  consecutive; the src tree byte-identical since the s94-b base),
  the CSV census 17 sites zero unguarded, the source-vocabulary
  clean, the config + SEO/sitemap layers verified (37/37 across the
  three SEO suites). Both operator decisions re-affirmed (55th): CSV
  posture (b) + source-vocabulary parity.
- **The standing layers**: drift sweep #91 (bundle md5 a70a637f…
  exact — the 66th consecutive stable session); the desktop sweep
  CLEAN (the standing table reproduced, zero new drift); the phone
  sweep CLEAN (the s94 maiden table reproduced); census #91 (demo
  zero, desktop 256px/8, the mobile-nav defect STANDS at TRUE 390 —
  the 16th consecutive).
- **GATE**: lint 0/0 · tsc 0 · 1836/1836 unit [102 suites, +4 net] ·
  build · 132/132 e2e fresh CI=1 (3.1m, zero flakes; the mobile-nav
  suite green inside the run). 3 screenshots [139 leads sticky
  thead mid-scroll + 140 accounts + 141 contacts, VLM 5/5 × 2 + 4/5
  (one adjudication: 139's clipped-edge NO vs the DOM-verified
  shared horizontal-scroll genus)]. Docs at SKILL v1.92.0 [§16ci +
  project_state] + README badge 1968 + AGENTS/CLAUDE/PAD at 1836+132
  + session_191.md + the plan + its execution record + the worklog.

### Session-96 — the form family at TRUE 390 + the login-card v4 space-y-genus fix

Same sandbox (survived from s95); refreshed via `git pull` (one file:
the operator's `session_192.md`). Baseline 1836/1836 → the session's
work took it to 1849/1849 (103 suites).

- **The standing layers (92nd sweep)** — drift sweep #92: the reference
  bundle md5 `a70a637f…` EXACT (the 67th consecutive stable session;
  DECODE: the PRE-AUTH login shell references `/static/*` chunks — the
  tracked bundle is extracted from the POST-LOGIN shell). The desktop
  sweep reproduced the standing table (dashboard 0.31 · the rest
  0.00–0.01 · settings 4.73). The phone sweep reproduced the s94/s95
  table (floor 0.51–0.56 · reports 0.71 · settings 7.34). The MAIDEN
  375×812 second-width run (the s95 suggested next #3): the SAME
  standing genera at the iPhone baseline (floor ~0.55 · settings
  7.52) — zero new drift; the fractional-column reflow holds. Census
  #92: demo zero · desktop 256px/8 · the mobile-nav defect STANDS at
  TRUE 390 (the 17th consecutive).
- **The audits** — 96-a: the s95 ship delta GENUINE (the --pages
  filter verified line-by-line, the non-vacuousness independently
  re-proven 4/4 RED against `git show c215904:scripts/sweep.ts`, the
  docs counts verified, src/ untouched, .env.example 3 vars);
  **F-96a1** (REAL, tool-coverage): the drawer battery's step-5
  resize-past-md probe ran against a CLOSED drawer (the auto-close
  listener only registers while open — it could never go red); fixed
  this session (S96-P1). 96-b: the graduation audit 13/13 GENUINE
  (zero graduations, ~53rd consecutive); the CSV census 17 sites ZERO
  unguarded; the source-vocabulary clean; the config + SEO/sitemap
  layers verified (37/37 three-suite / 47/47 four-suite; db-path
  20/20). Both operator decisions re-affirmed (56th: CSV posture (b)
  + source-vocabulary parity).
- **The rotation (96-c)** — the FORM family at TRUE 390×844 on BOTH
  apps (the s95 suggested next #1, the last unwalked static family):
  the FILTER ROWS FULL GEOMETRY MATCH — every value identical (the
  trigger 326×36 radius 6; the content 320×398 @ (32,36) radius 6
  white p-16; the rows 64/64/64/64/44 at y 53/133/213/293/373 w 286;
  the labels 14px/500 rgb(10,10,10) h20; the comboboxes 286×36
  radius 6 p-8/12; the number/date inputs 286×36 16px; the Clear +
  Save View buttons 139×36). THE LOGIN CARD: three rhythm deltas
  decoded as the **Tailwind v4 space-y genus on the auth surface**
  (present at BOTH 390 and 1440, never caught before because /login
  was not in the sweep's PAGES and the form family was the last
  unwalked): (1) the Google→divider gap 48 vs 24 — the reference
  nests [google + divider + form] in ONE w-full BLOCK section (its
  margins COLLAPSE), ours had them as DIRECT children of the flex
  column (v4 space-y's margin-bottom STACKS with the divider's my-6 —
  flex containers do not collapse margins); (2) the label→input gap
  4 vs 10 per field — the reference's v3 space-y-1.5 puts margin-TOP
  on the FOLLOWING inputWrap block, v4's margin-BOTTOM lands on the
  INLINE label where vertical margins are IGNORED (the same genus
  class as M-79c2, the back-button fix); (3) the card top offset —
  downstream (the net +12px card height at 390).
- **S96-P0 (TDD)** — the login-card v4-genus fix, the FIRST src/
  change since s90: `LOGIN_LAYOUT.field` + `LOGIN_SIGNUP_LAYOUT.field`
  `space-y-1.5` → `[&>*+*]:mt-1.5` (the v4-correct mt-on-following,
  the label stays INLINE like the reference's own 16px box); the
  signin column restructured into ONE w-full section wrapping [the
  google button (its own wrap the reference's inert space-y-3) + the
  divider + the form]; **login added to the sweep's PAGES** (10
  pages — the reference serves the login card to authed visitors,
  the S23-P2 finding; the auth surface joins the standing pixel
  sweep). RED-first: 3 login-view pins (the field ×2 + the section)
  + the labels-stay-inline guard; stash-proof 10 failed | 50 passed
  → pop → 60/60. The LIVE re-walk: **THE LOGIN CARD FULL GEOMETRY
  MATCH — Δ=+0 on ALL 11 elements** (h1 209 · subtitle 249 · google
  293 · divider 371 · emailLabel 415 · emailInput 441 · pwLabel 501
  · pwInput 527 · submit 587 · forgot 643 · signup 671; the rhythm
  gaps 24/10/10 exact). The maiden 10-page sweeps: desktop login
  0.27% (the CSS brand-mark logo genus — the reference hotlinks a
  screenshot) · phone login 0.75% (the same genus at a larger share
  of the narrower frame) — the standing tables reproduced elsewhere.
- **S96-P1 (TDD)** — the F-96a1 drawer-battery fix: step 5 REOPENS
  the drawer (verified open + locks engaged) before the resize-past-
  md probe; pinned in the new tests/drawer-battery-tool.test.ts (4
  pins: the reopen construction + the exact-selector protocol + the
  URL-based CAPITAL /Leads wait + the dual-lock/no-synthetic-click
  guards). The battery re-verified FULLY GREEN live (trigger
  16,16 36×36 · panel 288 @ x0 blue · 8 links · focus inside · dual
  lock · navigate-close → /Leads · Escape · reopen-then-resize with
  the release).
- **S96-P2 (TDD)** — the sweep `--fail-on-drift` mode (the s95
  suggested next #2): the STANDING_BASELINES table (desktop + phone
  classes split at the md breakpoint — BOTH walked phone widths ride
  one table) + the PURE standingBaseline/driftVerdict seams; a page
  fails when it exceeds ITS OWN baseline + margin (default 0.5pct,
  `--drift-margin` override); a page missing from the table is judged
  at 0 (the fail-fast doctrine). RED-first 5 pins; both maiden runs
  gated CLEAN.
- **S96-P3** — screenshots 142 (the login card at 390 post-fix) +
  143 (the leads Filters popover at 390) — VLM 5/5 + 5/5, zero
  adjudications.
- **GATE**: lint 0/0 · tsc 0 · 1849/1849 unit [103 suites, +13 net]
  · build · 132/132 e2e fresh CI=1. Docs at SKILL v1.93.0 [§16cj +
  project_state] + README badge 1981 + AGENTS/CLAUDE/PAD at
  1849+132 + the CLAUDE-count lockstep re-anchor (1836 → 1849) + the
  space-y census re-anchor (112 → 111: two field constants retired
  to the mt-variant, the google wrap's inert space-y-3 added) +
  session_193.md + the plan + its execution record + the worklog.


### Session-97 — the tablet class + the chart cards at TRUE 390 + the numeric fail-fast

Fresh clone (the sandbox was reset): clone → install → .env → db:push +
db:seed; all ops under `env -u DATABASE_URL`. Baseline 1849/1849 → the
session's work took it to 1862/1862 (103 suites).

- **The standing layers (93rd sweep)** — drift sweep #93: the bundle md5
  `a70a637f…` EXACT (the 68th consecutive stable session). The desktop
  sweep: the standing table + the drift gate CLEAN (dashboard 0.43
  within margin). The phone sweep: the standing table + the gate CLEAN.
  Census #93: demo zero · desktop 256px/8 · the mobile-nav defect
  STANDS at TRUE 390 (the 18th consecutive). The drawer battery at
  TRUE 390: FULLY GREEN live (the F-96a1-fixed reopen verified).
- **The audits** — 97-a: the s96 ship delta 7/7 GENUINE (the
  non-vacuousness independently re-proven via a throwaway pre-fix
  tree: 10 failed | 50 passed → 60/60 reproduced); zero REAL findings;
  B-97a1 (the reset view rides the fixed LOGIN_LAYOUT.field) CLOSED
  this session by the live re-walk; B-97a2 (the --drift-margin NaN
  hazard) fixed (S97-P1); N-97a1 (two stale 9-page comments) fixed
  (S97-P2). 97-b: the graduation audit 13/13 GENUINE (ZERO
  graduations, ~54th consecutive); the CSV census 17 sites ZERO
  unguarded; the source-vocabulary clean; the config + SEO/sitemap
  layers verified. Both operator decisions re-affirmed (57th: CSV
  posture (b) + source-vocabulary parity).
- **The rotation (97-c)** — THE DASHBOARD CHART CARDS AT TRUE 390×844
  (the last chart surface): FULL GEOMETRY MATCH — Δ=+0 on ALL 13
  elements (the 6 KPI cards 358×130 with the 324×32 sparks; Sales
  Pipeline 358×494 + SVG 308×300 + 5 bars + 5 chips; Revenue 358×398 +
  SVG 308×300; Top Reps 131 · Lead Sources 106 · Upcoming Activities
  158 · Recent Deals 155 at the identical y-ladder). THE 768×1024
  TABLET MAIDEN SWEEP (the md boundary): zero catastrophic drift; the
  accounts 0.72% decoded live as the s95 overflow genus at the md
  boundary (the reference's bare flex-1 poke-out scrollW 567 vs our
  min-w-0 in-box 512). B-97a1: the reset view re-walked — FULL
  GEOMETRY MATCH (the label→input gap 10 on both apps).
- **S97-P0 (TDD)** — the sweep's TABLET class: `standingBaseline()`
  3-way md/lg banding (<768 phone · <1024 tablet · else desktop) +
  `STANDING_BASELINES.tablet` from the maiden run (accounts 0.8 the
  overflow genus · settings 5.5 · login 0.5 · the rest 0.1) + the
  header docs. The tablet drift gate verified CLEAN live.
- **S97-P1 (TDD)** — the B-97a2 numeric-arg fail-fast: the PURE
  `parseNumberArg()` seam (absent → fallback · missing/non-numeric →
  THROW listing the expected form), wired into ALL FOUR numeric flags;
  verified live (`--drift-margin` with no value → exit 1 with the
  helpful message).
- **S97-P2** — the N-97a1 stale-count nanos (the two 9-page comments →
  ten-page).
- **S97-P3 (TDD)** — the `gate:full` composite (the s96 suggested next
  #3): the standing gate chain + the three drift sweeps; the plain
  `gate` UNCHANGED. 4 pins in tests/gate-script.test.ts.
- **S97-P4** — screenshots 144 (the dashboard chart cards at 390) +
  145 (the accounts tablet surface at 768) — VLM 5/5 + 5/5, one
  adjudication (145's edge crop = the documented overflow genus, a
  viewport crop not a rendering error).
- **GATE**: lint 0/0 · tsc 0 · 1862/1862 unit [103 suites, +13 net]
  · build · 132/132 e2e fresh CI=1. Docs at SKILL v1.94.0 [§16ck +
  project_state] + README badge 1994 + AGENTS/CLAUDE/PAD at
  1862+132 + the CLAUDE-count lockstep re-anchor (1849 → 1862) +
  session_195.md + the plan + its execution record + the worklog.