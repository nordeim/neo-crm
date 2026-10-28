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
|  Unit tests (2817 checks)      | `bun run test`                         |
|  Unit tests (watch mode)        | `bun run test:watch`                   |
|  Browser E2E (195 checks)        | `bun run test:e2e` (needs build first) |
| Smoke the standalone artifact   | `bun run smoke` (needs build first)    |
| DB census (path + counts)       | `bun run db:census`                    |
| The full gate in one command    | `bun run gate`                         |
| Prisma client after schema edit | `bunx prisma generate` (`db:generate`) |
| Recreate DB from schema         | `bun run db:push`                      |
| Seed demo workspace             | `bun run db:seed`                      |
| Desktop drift sweep             | `bun run sweep`                         |
| Full-page drift sweep           | `bun run sweep:fullpage`               |
| Interior census drift gate      | `bun run census:interior`              |
| Reference drift probe           | `bun run probe:ref`                    |
| The gate + the six drift gates  | `bun run gate:full`                    |

**Gate order before every push:** `bun run lint` → `bun run typecheck` →
`bun run test` (2817) → `bun run build` → `bun run smoke` (the standalone
boot + the 14-check ladder, session-170: the web-app-foundation §13.4/§14
leg — the boot-gate + artifact-hygiene assertions ride it) →
`bun run test:e2e` (195) — or the one-command `bun run gate` (session-38:
the same chain as a package script, so the build always precedes the e2e
boot; session-39: the e2e step runs under `CI=1`, so
`reuseExistingServer` evaluates false and the gate ALWAYS boots the
just-built server — chaining the build alone did NOT close the
stale-server hazard, because a leftover :3100 listener was reused
regardless of build timing). There is no hosted CI; the local gate is
the only gate. Session-174 retired `typescript.ignoreBuildErrors` — the
build IS the type gate now (a type error fails `bun run build`; the
planted-error proof lives in tests/type-gate.test.ts's header), and
`tsconfig.json` runs full strictness (the `noImplicitAny: false` escape
hatch is gone). The explicit `typecheck` step stays in the gate chain as
the FASTER signal; never skip it. Session-164
adds the skill §14 pre-ship step: run `bun audit` periodically (NOT
inside the gate — it is a network dependency and the gate must stay
offline-runnable, the probe doctrine); the current state is triaged in
the PAD known-issues ledger (9 advisories, all dev-toolchain transitive,
zero runtime request-path exposure — re-triaged session-198: the runtime
jspdf›dompurify chain's critical cured by the 3.4.17 transitive
override, lockfile-pinned + dormancy-pinned + ledger-pinned).

First-run setup: `bun install && cp .env.example .env && bun run db:push &&
bun run db:seed && bun run dev`. Demo login: `sepnetflix2023@outlook.com` /
`$Abcd1234` (mirrors the reference app). **`.env` is untracked** — copy
`.env.example` and set `AUTH_SECRET` (`openssl rand -hex 32`).

## Architecture facts you would otherwise guess wrong

- **Auth is hand-rolled** (`src/lib/auth.ts` + the pure `src/lib/password.ts`
  seam): scrypt password hashes (`scrypt:salt:hash`) + HMAC-SHA256 signed
  stateless cookie `neo_session` (7-day TTL) whose payload carries a
  **tokenVersion** revocation dimension (`uid,iat,exp,v` — session-163, the
  digma S67-A port: a password reset increments the live row's version and
  every pre-reset cookie dies at the `getSessionUser` comparison; a missing
  `v` reads as 0, so pre-163 sessions survive). The **password-reset funnel**
  (session-163, the digma port): `POST /api/auth/forgot-password` (the
  no-enumeration 200, 32-byte crypto-random token, 60-min TTL, the in-app
  `resetUrl` delivery behind `NEO_DISABLE_IN_APP_RESET`) +
  `POST /api/auth/reset-password` (token-first ordering, ATOMIC single-use
  conditional consumption, `tokenVersion` eviction, P2024/P2028→503) + the
  `/reset-password` landing page. The login miss branch burns the **timing
  equalizer** scrypt (digma S72-C). `requireSession()` + the `isGuarded()`
  narrowing helper guard every route handler; the `(app)` route-group layout
  redirects unauthenticated page visits. No NextAuth, no JWTs, no
  middleware/proxy. The public auth routes are rate-limited per IP/15 min —
  login 10, signup 10, resend 5, verify 20, forgot 10, reset 10 (session-67
  adds the sessioned upload route at 20; `src/lib/rate-limit.ts`,
  per-process) — keyed on the **LAST x-forwarded-for hop** behind the
  deploy-declared `NEO_PROXY_HOPS` depth (session-163, digma S62-D/S69-A:
  unset=1, 0=direct/unknown, N≥2=Nth-from-last, unparsable fails closed).
  The auth family validates through the **Zod seam** (session-163):
  `src/lib/schemas.ts` + `parseBody()` in `src/lib/api.ts` (zod ^4 —
  the CRUD family joined at session-166: every body route rides the seam;
  the query-param GET family keeps the `asString`/`asDate` helpers).
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
  distance is 28px on both apps after the fix. **Session-178 (walk51)
  decoded the family's fourth member: v4's `outline-none` is
  `outline-style: none`** where the reference's v3-era `outline-none` is
  `outline: 2px solid transparent` — OURS paints nothing (style none),
  the reference paints nothing visible (transparent), so every
  `focus-visible:outline-none` surface shows zero outline pixels on BOTH
  apps and the computed outline triplet (1px/none vs 2px/solid) is the
  genus's own fingerprint, never a defect claim; the VISIBLE focus face
  rides the box-shadow ring on both (the search input's 1px near-black
  `rgb(10,10,10)` ring, byte-equal two-app under REAL keyboard focus).
  The reference's global stylesheet also ships
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
  browsers. `tests/e2e/mobile-navigation.spec.ts` (11 checks, 390/700px
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
  `neo-crm.leads.views`); Clear resets. The dashboard has NO owner filter —
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
  Funnel is a recharts `FunnelChart` (4 trapezoid groups — the
  `LEADS_FUNNEL` vocabulary New Leads/Contacted/Qualified/Won, live in
  constants.ts, the funnel takes its own `data` prop with
  per-datum fills).
- **Reports pipeline vocabulary (session-10 → the s31/s54 form)**: tab-1 "Pipeline by Stage"
  ships the reference's 8 RAW SLUGS through `pipelineStageCounts(leads, opps)`
  in `src/lib/reports-data.ts` (new/contacted/qualified/prospecting/qualification/
  proposal/negotiation/closed_won — the session-31 SPLIT: leads and
  opportunities count into their own stages, NO merged-list double-report
  — a new lead is NOT also counted under "prospecting"; labels
  are raw slugs, no title-casing — the s10 `REPORTS_PIPELINE_SLUGS` +
  `reportsBucketCounts` merged-list approximation was retired at
  session-54). Tabs 2-4 mirror the reference's
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
  38 suites at the s22 era (the live totals ride the docs-counts pins;
  session-13 added `tests/page-titles.test.ts` for the auth
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
  defaults (session-13 CORRECTION → the s27 family form)** — the reference passes
  `strokeDasharray="3 3"` on `#ccc` grid lines on EVERY gridded chart
  (dashboard Sales Pipeline/Revenue, reports tab-1 all four incl. the
  funnel, leads Pipeline/Won-vs-Lost). The session-10 note "the
  CartesianGrid at the default DASHED 3 3" was a misread — recharts'
  default grid is SOLID. `charts.tsx` sets `strokeDasharray="3 3"`
  explicitly at five sites across the live parameterized family (the
  `SingleBarChart`/`GroupedBarsChart`/`TrendLineChart`/
  `HorizontalBarChart` grid arms + `RevenueLineChart`); pinned by
  `tests/charts-contracts.test.ts`.
- **The reports "Conversion Funnel" is a horizontal BAR chart
  (session-13 → the s27 `HorizontalBarChart` form)** — NOT a recharts
  FunnelChart: the reports funnel renders `BarChart layout="vertical"`
  534×300, dashed grid, numeric X, category
  Y with the EIGHT raw slugs (`new/contacted/qualified/prospecting/
  qualification/proposal/negotiation/closed_won` — the
  `pipelineStageCounts` seam's ordered array), fed by the `pipeline` seam.
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
  title/description/image AND `twitter:url`, a PNG favicon, an eleven-URL
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
  (the 13 primary pages consume it — the 8 inner wrappers + login +
  signup + the marketing about/contact pair + reset-password; the 10
  capitalized aliases re-derive their own; the dashboard alone inherits
  the root layout). THREE serializer hazards gate-caught: (a)
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
  v4 stylesheet's compiled output carries the `color-mix()` family the
  classic parser cannot read; 293 calls at the s169 census, read from
  `.next/static/chunks/*.css` — build-dependent, an era record not a
  live claim).
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
- Validation rides the Zod seam at every body boundary (zod ^4:
  `src/lib/schemas.ts` + `parseBody()` in `src/lib/api.ts` —
  the auth family since session-163, the CRUD family since session-166).
  The `asString`/`asNumber`/`asDate` helpers survive on the URL-param
  surfaces (the query-param GET family).
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
### Session-98 — the reports tabs' chart family + the CardHeader v4 row-genus

The 98-c rotation walked the LAST unwalked chart surface — the five
reports tabs' chart family at TRUE 390×844 on BOTH apps at the
zero-data state: **24/26 elements FLAT** initially, the two deltas
decoded live into real fixes:

- **F-98c1 — THE CARDHEADER V4 ROW-GENUS (the M-79c2/s96 family on a
  NEW surface)**: the reports tab-2 table cards ("Open Deals by Stage"
  +6h, "Deals at Risk" +6h/+6y). The base `flex flex-col space-y-1.5
  p-6` + a call-site `flex-row` override: under the reference's v3 the
  gap is margin-TOP on the FOLLOWING sibling (vertically inert in a
  row); under our v4 it is margin-BOTTOM on the TITLE (grows the flex
  line's cross-size +6px when the title is tallest). Single-child
  headers immune — why every prior walk stayed FLAT; the genus was
  invisible to all three sweeps (the tab-2 cards are not mounted at the
  default tab). FIXED at the BASE: `flex flex-col [&>*+*]:mt-1.5 p-6`
  (the v4 expression of the reference's own v3 computed semantics);
  column-mode gaps identical, the genus structurally retired for every
  future flex-row header. The space-y census re-anchored 111/19 →
  110/18 (card.tsx's only space-y retired).
- **F-98c2 — THE ACTIVITIES-VS-WINS LEGEND GENUS**: ours rendered the
  recharts default `<Legend />` (2 items, 24px) on the vs-wins chart at
  BOTH widths; the reference renders NO legend wrapper there (its
  wonlost sibling DOES render its 2-item legend — the s27 bundle decode
  agrees: Legend on wonlost only). FIXED: GroupedBarsChart gains
  `legend?: boolean` (default true); the vs-wins call site opts out.
- The audit finds closed: F-98a1 (the stale nine-page phrasing — the
  three surviving sites fixed + the guard pin WIDENED to read both
  files), B-98a1 (the STANDING_BASELINES doc → the 3-way wording),
  N-98a1 (the PURE `standingExplained(width)` seam — the per-class
  genera line, the desktop trio no longer prints on phone runs).
- Audits clean: 98-a the s97 delta GENUINE (non-vacuousness re-proven
  12 RED → 41/41); 98-b ZERO graduations 13/13 (~55th), the CSV census
  17 sites ZERO unguarded, the source-vocabulary clean. Both operator
  decisions STAND (58th: CSV posture (b) + source-vocabulary parity).
- Standing layers (94th sweep): the bundle md5 EXACT (69th consecutive
  stable); all three drift gates CLEAN pre- and post-fix; census #94:
  demo zero, desktop 256px/8, the mobile-nav defect STANDS (19th); the
  drawer battery FULLY GREEN live. One environmental lesson: a
  long-lived dev server post-recompile produced a false drift-gate FAIL
  (uniform +1.4% mid-animation captures) — the fresh-boot re-run
  reproduced the standing tables exactly.
- **GATE**: lint 0/0 · tsc 0 · 1870/1870 unit [103 suites, +8 net]
  · build · 132/132 e2e fresh CI=1. Docs at SKILL v1.95.0 [§16cl +
  project_state] + README badge 2002 + AGENTS/CLAUDE/PAD at
  1870+132 + the CLAUDE-count lockstep re-anchor (1862 → 1870) +
  session_197.md + the plan + its execution record + the worklog.

### Session-99 — the landscape-tablet maiden run (the lg boundary)

- **Intake**: `git pull` `f96c0a9..ddac209` (the operator's
  docs-only session_198.md); the workspace NOT reset. Baseline lint
  0/0 · tsc 0 · 1870/1870 · census MATCH.
- **Audits**: 99-a the s98 ship delta GENUINE 9/9 (the
  non-vacuousness re-proven 10 failed | 267 passed → 277/277; F-99a1
  REAL — PAD:358 the stale 1862 tree site) · 99-b ZERO graduations
  13/13 (~56th; both operator decisions STAND, the 59th: CSV posture
  (b) + source-vocabulary parity; the config + SEO layers verified).
- **The standing layers (95th sweep)**: the bundle md5 EXACT (the 70th
  consecutive stable); all three drift gates CLEAN; census #95: demo
  zero, desktop 256px/8, the mobile-nav defect STANDS at TRUE 390
  (20th); the drawer battery FULLY GREEN live.
- **99-c — THE 1024×768 LANDSCAPE-TABLET MAIDEN RUN** (the s98
  suggested next #1 — the lg boundary): 8/10 pages FLAT/standing;
  **F-99c1 the accounts overflow genus at the lg band decoded live
  (2.43%)** — the reference's bare flex-1 content floors at its
  table's min-content (535), SQUEEZES its own w-80 rail 320→183, and
  pokes main +6px (scrollW 774 vs 768); ours the min-w-0 in-box
  scroll + the full 320 rail (the s95 consistent pattern;
  VLM-confirmed). Documented STANDING — the reference's own defect
  family, not copied.
- **S99-P0 (TDD)** — the LANDSCAPE class: `STANDING_BASELINES.landscape`
  (accounts 2.6 · settings 4.9 · dashboard 0.6 · login 0.5 · the rest
  0.1) + the 4-way md/lg/xl banding (1024 is NOT desktop — the s97
  boundary pin re-anchored) + the `standingExplained` landscape line +
  the doc comments. The landscape drift gate verified CLEAN live; the
  other three gates re-verified CLEAN post-fix.
- **S99-P1 (TDD)** — gate:full grows the FOURTH drift sweep (the
  1024×768 landscape); the plain `gate` UNCHANGED.
- **S99-P2** — the F-99a1 fix: PAD:358 the stale 1862 tree site →
  the living count.
- **S99-P3 (TDD)** — 2 NEW pins (the landscape table · the
  driftVerdict landscape contrast · the standingExplained landscape
  line) + 6 re-anchors (the 4-way boundary · the 4-way doc pin · the
  explained boundary mirror · the gate:full chain + count · the
  CLAUDE-count lockstep 1870 → 1872). RED 8 failed | 58 passed
  pre-fix; stash-proven (sweep.ts + package.json + CLAUDE.md stashed
  → 8 failed → pop → 66/66).
- **S99-P4** — screenshots 148 (the accounts landscape genus at 1024)
  + 149 (the dashboard landscape at 1024) — VLM 4/4 + 4/4.
- **GATE**: lint 0/0 · tsc 0 · 1872/1872 unit [103 suites, +2 net]
  · build · 132/132 e2e fresh CI=1. Docs at SKILL v1.96.0 [§16cm +
  project_state] + README badge 2004 + AGENTS/CLAUDE/PAD at
  1872+132 + the CLAUDE-count lockstep re-anchor (1870 → 1872) +
  session_199.md + the plan + its execution record + the worklog.

### Session-100 — the diff-clustering decode promoted + the 1280 xl-boundary spot-check

The twice-suggested promotion (the s98 suggested next #2, re-suggested at
s99) + the s99 suggested next #3, riding the promoted tool. Every genus
hunt since s95 decoded its deltas with one-off bucket-diff probes; now
`bun run sweep -- --clusters` decodes each page's diff into BUCKETS —
clustered regions of differing pixels (a coarse-grid union-find, cell =
`--cluster-gap` px [default 16]; clusters closer than ~gap px merge),
each reported with its bbox, pixel count, share of the page's diff, and
share of the frame (top 5 per page, biggest genus first). The PURE
`clusterDiff` seam sits beside diffPixels with the IDENTICAL tolerance
semantics (the size-mismatch throw parity + the non-positive-gap
fail-fast, the B-97a2 doctrine); the browser-side diffPair evaluate
carries the inline twin (the no-bundling doctrine). The gate semantics
are UNCHANGED (the drift-gate output byte-identical with or without
--clusters).

- **The maiden 1280×800 spot-check (the s99 suggested next #3)**: the
  s99 prediction CONFIRMED — accounts 0.00% (was 2.43% at 1024): the
  rail-squeeze genus is DEAD at 1280; every page within the DESKTOP
  standing baselines (dashboard 0.36 · the rest 0.00–0.01 · settings
  4.67 · login 0.34) — the 1280 → desktop class assignment holds, NO
  fifth class, gate:full unchanged. The cluster fingerprints at 1280
  match the 1440 desktop genera (the dashboard chart-artifact bucket ·
  the settings picklist band · the login logo genus).
- **The tool validated against the KNOWN decode**: the landscape 1024
  re-run with --clusters reproduces F-99c1 exactly — one dominant
  accounts bucket [x 356..1023, y 303..767] at 95.4% of the diff (the
  content/rail divergence band), settings' picklist genus at 100% of
  diff in one content band.
- **The audits (both subagents)**: 100-a the s99 ship delta GENUINE
  10/10 (non-vacuousness re-proven 8 RED | 58 passed → 66/66; the full
  suite live 103/1872) — findings F-100a1/F-100a2 REAL docs-only (the
  "3 new" its off-by-one at PAD:779 + SKILL §16cm:8910; the AGENTS
  §Session-94 history block wrongly edited "3 new pins" → "2 new pins"
  by the s99 delta) — ALL FIXED this session; 100-b ZERO graduations
  13/13 (~57th), the CSV census 17 sites zero unguarded, both operator
  decisions STANDING (60th: CSV posture (b) + source-vocabulary
  parity), the config + SEO layers verified 57/57.
- **The standing layers (96th sweep)**: the bundle md5 a70a637f EXACT —
  the 71st consecutive stable; census #96 demo zero · desktop 256px/8 ·
  the mobile-nav defect STANDS at TRUE 390 (21st consecutive); the
  drawer battery FULLY GREEN live.
- **RED-first**: 8 new pins (the cluster seam family — two-cluster
  geometry + shares · the merge · the split · the empty mask · the sort
  · the two throws — + the --clusters wiring pin) + 2 re-anchors (the
  ALL-FIVE parseNumberArg wiring pin + the CLAUDE-count lockstep 1872 →
  1880). **10 failed | 53 passed** pre-fix; stash-proven (sweep.ts +
  CLAUDE.md stashed → 10 failed → pop → 63/63). All four drift gates
  re-verified CLEAN post-fix.
- **GATE**: lint 0/0 · tsc 0 · 1880/1880 unit [103 suites, +8 net] ·
  build · 132/132 e2e fresh CI=1. Docs at SKILL v1.97.0 [§16cn +
  project_state] + README badge 2012 + AGENTS/CLAUDE/PAD at 1880+132 +
  the F-100a1/F-100a2 fixes + session_201.md + the plan + its
  execution record + the worklog.

### Session-101 — the edge-wrap fix + the drift probe promoted + the 375 drift-gate maiden

- **101-a audit**: the s100 ship delta GENUINE **12/12** (non-vacuousness
  re-proven via the pre-fix tree: 10 failed | 53 passed → 63/63).
  **F-101a1 REAL (code)**: the s100 clusterDiff union-find carried NO
  column-bounds guard — the neighbor lookup `nk = (cy+dy)*cw + (cx+dx)`
  wraps cx=0/dx=-1 onto the LAST column of the adjacent row, falsely
  merging edge cells up to ~w-gap px apart (proven live: two 16×16
  blocks 129px apart merged into one [x 0..159] bucket). **F-101a2
  REAL (docs)**: PAD:779 the s99 Files column (the F-100a1 fix
  over-reached 3→2; the s93–s98 semantics [Files = files gaining NEW
  its] say 1) · B-101a-1 the s100 row Files 2→1 · N-101a-1 the
  "non-positive gap" phrasing vs the `gap < 1` guard (record-only) ·
  N-101a-2 the AGENTS:3938 space.
- **101-b audit**: ZERO graduations 13/13 (~58th; src/ byte-identical
  since the s100 ship); the CSV census 17 sites ZERO unguarded; the
  source-vocabulary clean; the config + SEO layers verified 57/57.
  **Both operator decisions re-affirmed (61st): CSV posture (b) +
  source-vocabulary parity.**
- **S101-P0 (F-101a1)**: `if (cx + dx < 0 || cx + dx >= cw) continue;`
  in BOTH clusterDiff copies (the node seam + the browser inline twin,
  the no-bundling doctrine). RED-first pinned.
- **S101-P1 (the drift probe promoted)**: `scripts/drift-probe.ts` +
  `bun run probe:ref` — the per-session reference-stability throwaway
  (the s100-close suggested next #2) as a one-command tool: the
  POST-LOGIN app-shell bundle discovery (largest JS) + md5 + the
  demo-data census + the desktop 256/8 census + the TRUE-390
  mobile-nav defect check; exit 1 on any CHANGED; `--json`; PURE
  seams (pickAppBundle · stabilityVerdict · desktopNavVerdict ·
  mobileNavVerdict · demoDataVerdict · STANDING) pinned in
  tests/drift-probe-tool.test.ts. NOT part of gate/gate:full (the
  reference is a network dependency).
- **The LIVE verification**: the probe's MAIDEN RUN reproduced the
  standing layers — bundle `index-DZ-xbrIm.js` md5
  `a70a637fcf1d4291da8e0d965676dc11` (1,631,071 bytes) **STABLE (the
  72nd consecutive)**; census #97: demo zero · desktop 256px/8 · the
  mobile-nav defect STANDS at TRUE 390 (**22nd consecutive**). The
  MAIDEN 375×812 drift-gate spot-check CLEAN (floor 0.55–0.59 ·
  settings 7.52 · login 0.82 — the phone-class margin holds at the
  second walked width, the s96 plain-run prediction now GATE-proven).
  All four standing drift gates re-verified CLEAN post-fix; the
  drawer battery FULLY GREEN live.
- **RED**: 2 new sweep-tool pins (the edge-wrap geometry pin — blocks
  at OPPOSITE horizontal edges stay TWO buckets; the browser-twin
  guard wiring pin) + the NEW tests/drift-probe-tool.test.ts (10 its)
  + the CLAUDE-count lockstep re-anchor (1880 → 1892). **13 failed |
  62 passed** pre-fix; stash-proven (sweep.ts + drift-probe.ts +
  package.json + CLAUDE.md stashed → 13 failed → pop → 75/75).
- **S101-P5**: screenshots 152 (the dashboard at 375×812) + 153 (the
  leads table at 375×812, the seeded rows + the in-card scroll) —
  VLM 4/4 + 4/4, zero adjudications.
- **GATE**: lint 0/0 · tsc 0 · 1892/1892 unit [104 suites, +12 net] ·
  build · 132/132 e2e fresh CI=1. Docs at SKILL v1.98.0 [§16co +
  project_state] + README badge 2024 + AGENTS/CLAUDE/PAD at 1892+132 +
  the F-101a2/B-101a-1 fixes + session_203.md + the plan + its
  execution record + the worklog.

### Session-102 — the secondary-sites lockstep + the off-by-one fix + the 414 drift-gate maiden

- **102-a audit**: the s101 ship delta GENUINE **8/8** (non-vacuousness
  re-proven twice: the 3-file checkout 4 failed | 71 passed + the true
  pre-fix tree **13 failed | 62 passed (75)** — the 13 enumerated, the
  RED re-proving F-101a1 live; live unit 104/1892; e2e static census
  132). **F-102a1 REAL (docs)**: the s101 "76/76" green-state claim is
  an off-by-one — the true stash-pop count is **75/75** (13 + 62 = 75;
  session_204.md:48 recorded it live, the summary layer transcribed
  76), carried at 6 repo-doc sites + the immutable 1017a5b commit
  message (record-only). **F-102a2 REAL (docs)**: **6 stale live-tense
  secondary count sites** (103/1880 stale at HEAD 104/1892) — README:125
  (the tree) + README:178 (the commands comment; the suite list also
  missing drift-probe-tool) + PAD:358/:795/:1217/:1287 — the recurring
  **F-99a1 genus** (unpinned, so it re-stales every session the count
  grows). N-102a1: the probe header ordinals written pre-maiden (71/
  21st where the live standing is 73rd/23rd). Zero Critical/High.
- **102-b audit**: ZERO graduations 13/13 (~59th; src/ byte-identical
  since the s101 ship); the CSV census 17 sites ZERO unguarded (70/70
  live); the source-vocabulary clean (constants.ts @ 3a89508 since
  s90); the config + SEO/sitemap layers verified **57/57 live** (+
  the implementation review — zero routes missing metadata); the
  mobile-nav contract INTACT; the globals.css v4 re-pins present.
  **Both operator decisions re-affirmed (62nd): CSV posture (b) +
  source-vocabulary parity.**
- **S102-P0 (F-102a1)**: 76/76 → 75/75 at the 6 repo-doc sites —
  at-birth ERROR corrections, the F-100a2 history-record doctrine
  honored (a record corrected to match what actually happened).
- **S102-P1/P2 (the genus retired)**: the NEW `tests/docs-counts.test.ts`
  (11 its: the README badge arithmetic + tree + commands + Tested row ·
  the AGENTS commands + gate-order lines · the PAD tree + Total + HEAD
  + checklist + commands sites · the scoped stale-form negatives —
  never a whole-file number ban, the history blocks keep their
  numbers) + the CLAUDE-count lockstep re-anchor (1892 → 1903). GREEN
  = the full count realignment: **105 suites · 1903 unit · badge
  2035**; README:178's suite list gains drift-probe-tool + docs-counts.
  **Every live-tense count site is now under the unit gate — a stale
  secondary count fails `bun run test` instead of surfacing at the
  next audit.**
- **S102-P3 (N-102a1)**: the probe ordinals corrected to the live
  standing — "73 consecutive sessions" + "the 23rd consecutive census"
  (the drift-probe.ts header + the test echo).
- **The LIVE verification**: probe:ref post-fix reproduced every
  standing layer — the bundle md5 a70a637f... EXACT **STABLE (the 73rd
  consecutive)**; census #98: demo zero · desktop 256px/8 · **the
  mobile-nav defect STANDS at TRUE 390 (the 23rd consecutive)**. The
  MAIDEN 414×896 third-phone-width drift-gate spot-check **CLEAN** —
  floor 0.45–0.49 · login 0.67 · settings 8.15 (the picklist genus at
  its highest phone share yet, within the 7.7 + 0.5 standing margin,
  arithmetic verified against the STANDING_BASELINES table) — the
  phone-class margin HOLDS at the third walked width. The four standing
  drift gates CLEAN; the drawer battery FULLY GREEN live twice.
- **RED**: 12 failed (11 docs-counts + 1 lockstep) at the pre-fix docs,
  the failures enumerated by name; stash-proven (README + AGENTS +
  CLAUDE + PAD stashed → 12 failed → pop → 30/30).
- **S102-P5**: screenshots 154 (the dashboard at 414×896 — the
  third-phone-width maiden view) + 155 (the mobile drawer OPEN at
  390×844 — the blue panel, all 8 links, the dimmed main, the
  Dashboard active state) — VLM 4/4 + 4/4, zero adjudications.
- **GATE**: lint 0/0 · tsc 0 · 1903/1903 unit [105 suites, +11 net] ·
  build · 132/132 e2e fresh CI=1 + the four drift sweeps CLEAN inside
  gate:full. Docs at SKILL v1.99.0 [§16cp + project_state] + README
  badge 2035 + AGENTS/CLAUDE/PAD at 1903+132 + the F-102a1/F-102a2
  fixes + session_205.md + the s102 plan + its execution record + the
  worklog.

### Session-103 — the seeded-state chart-geometry freeze + the 320 phone-floor maiden (the first maiden to trip)

- **103-a audit**: the s102 ship delta GENUINE (docs-only: session_206.md
  + the worklog append; non-vacuousness re-proven via the a0e52ca
  checkout: 12 failed | 18 passed → 30/30, tree clean). **F-103a1 REAL
  (docs)**: the F-102a1 "76/76" at-birth error survived at **PAD:781**
  (the s101 inventory row — a 7th site missed by both the 102-a
  enumeration and the S102-P0 correction; the AGENTS:4043 at-birth-error
  doctrine sanctions the fix). N-103a1: the docs-counts it-name line
  citations self-drifted +1 (the s102 PAD inventory-row insertion).
  N-103a2/N-103a3: record-only.
- **103-b audit**: ZERO graduations 13/13 (~60th; src/ byte-identical
  since the s102 ship); the ledger families 402/402; the CSV census 17
  sites ZERO unguarded; the source-vocabulary clean; the config + SEO
  layers verified 57/57; the mobile-nav contract INTACT; the globals.css
  v4 re-pins present. **Both operator decisions re-affirmed (63rd).**
- **S103-P1 (the headline — the s98 suggested next #3, twice
  deferred)**: the NEW `tests/seeded-charts.test.ts` (11 its) — the
  seed→derivation→chart-input chain frozen through the REAL
  reports-data functions (the leads stage census 7/4/2/2/3/2/4 · the
  won-lead 687,000 + book 2,086,000 · the post-map source distribution
  6/6/5/4/3 · the opps census 4/2/2/1/1/2 · the 337,000/92,000/525,000
  totals · pipelineStageCounts 4/2/3+2/1/1/2/4 · revenueByMonth's
  337,000 total invariant · wonLostByMonth 4/2 · forecastAccuracySeries
  337,000/316,250 · agingCounts' [6,3,3,0] design bands · the "29.2"
  conversion member). **A seed VALUE edit now fails `bun run test`**
  (the census already pinned the row COUNTS; nothing pinned the value
  distributions). Non-vacuousness: the INDUCED-DRIFT proof (87_000 →
  88_000 → 3 failed BY NAME → restored → 11/11).
- **S103-P4 (THE 320×568 PHONE-FLOOR MAIDEN — the first maiden to
  TRIP)**: login 1.39% > 0.8 + 0.5 (the other nine pages HELD at
  0.92–0.97). The diagnosis: the --clusters decode (92.6% of the diff
  in ONE logo-region bucket) + the VLM comparison (the reference's
  hotlinked 3D "NEC-CRM" screenshot vs our CSS brand mark — the
  documented genus) + the denominator arithmetic (**the genus is
  constant-ABSOLUTE ~2,500px; the share scales inversely with the
  frame: 0.75% at 390 · 0.82% at 375 · 0.67% at 414 · 1.39% at the
  320 floor — the frame 45% smaller, the genus unchanged**). The fix:
  `STANDING_BASELINES.phone.login` 0.8 → **1.4** (the class ceiling,
  the s97/s99 maiden doctrine) — RED-first pinned (the floor pin +
  the one-table-for-the-class assertions) → the maiden re-run CLEAN.
- **S103-P0/P2/P3**: the F-103a1 seventh-site fix (PAD:781 76/76 →
  75/75) · the count realignment **106 suites · 1915 unit · badge
  2047** (1914 a never-shipped in-flight intermediate — the maiden's
  pin joined after the first realign; the N-103a1 it-name re-anchors
  rode the same touch) · the probe ordinals 73/23rd → 74/24th.
- **The LIVE verification**: probe:ref — the bundle md5 STABLE (the
  **74th** consecutive); census #99: demo zero · desktop 256px/8 · the
  mobile-nav defect STANDS at TRUE 390 (the **24th**). The four
  standing drift gates CLEAN; the drawer battery FULLY GREEN live.
- **RED**: 11 failed | 19 passed (30) at the pre-realignment docs (10
  docs-counts + 1 lockstep — the plan predicted 12; the stale-form
  negatives pin passes at the s102-state docs, the TRUE RED
  transcribed live) + the induced-drift 3-failed proof + the maiden
  pin's 1-failed RED at the 0.8 table.
- **S103-P5**: screenshots 156 (the seeded dashboard at 1904×1077 —
  the reference era screenshot's EXACT viewport) + 157 (the seeded
  reports analytics view) — VLM 4/4 + 4/4, zero adjudications; the
  era comparison confirms the layout-family parity with our seed
  populating what the reference renders empty.
- **GATE**: lint 0/0 · tsc 0 · 1915/1915 unit [106 suites, +12 net] ·
  build · 132/132 e2e fresh CI=1 + the four drift sweeps CLEAN inside
  gate:full. Docs at SKILL v1.100.0 [§16cq + project_state] + README
  badge 2047 + AGENTS/CLAUDE/PAD at 1915+132 + the F-103a1 fix +
  session_207.md + the s103 plan + its execution record + the worklog.

### Session-104 — the e2e-count lockstep extension + the seeded-state mobile walk at 390

- **104-a audit**: the s103 ship delta GENUINE 12/12 (docs+tests+tooling
  only, ZERO src/; non-vacuousness re-proven TWICE: the mixed-state
  checkout 12 failed | 75 passed — the recorded RED-1 11 + RED-3 1 both
  reproduced — and the induced-drift reproduction 3 failed | 8 passed →
  restored → 98/98). **F-104a1 REAL (docs)**: session_207.md:41 + the
  s103 plan:32 recorded the 103-a live census as "105/1892" — the tests
  half stale by one session (the true s103-baseline count 105/1903; 1892
  is the s101 count carried from the 102-a template). N-104a1/N-104a2:
  record-only.
- **104-b audit**: ZERO graduations 13/13 (~61st; src/ byte-identical
  since the s103 ship); the ledger families 402/402; the CSV census 17
  sites ZERO unguarded; the source-vocabulary clean (constants.ts @
  3a89508 since s90); the config + SEO layers verified (39/39 live + 18
  static wirings); the mobile-nav contract INTACT; the globals.css v4
  re-pins present. **Both operator decisions re-affirmed (64th).**
- **S104-P1 (the headline — the e2e-count lockstep extension)**: the
  FIRST e2e-count change since s102 built the lockstep (the S104-P2
  guard grows the mobile spec 132 → 133) exposed **TEN unpinned
  live-tense e2e sites** — the F-99a1/F-102a2 stale-count genus on the
  e2e axis. 6 NEW docs-counts its: the AGENTS e2e sites (commands table
  + gate-order) · the CLAUDE e2e sites (commands table + gate-order +
  pyramid) · the README e2e sites (tree + commands) · the PAD e2e sites
  (tree + checklist + commands) · the scoped e2e stale-form negatives
  (the badge-2047 · the 132 site-forms — never a bare number ban) · the
  mobile-nav suite-count phrases (README:55/:997 + PAD:207, riding the
  new MOBILE_NAV_E2E=10 constant). **A stale e2e count anywhere now
  fails `bun run test`.**
- **S104-P2 (the drawer-OPEN seeded-state e2e guard)**: the ten-route
  overflow sweep runs drawer-CLOSED by its own documented design — the
  OPEN state's 390px contract was never pinned. The NEW mobile spec
  test: at 390×844 on the SEEDED e2e.db, the open drawer asserts
  docScrollW ≤ 390 · the panel's scrollW ≤ clientW (zero internal
  overflow) · the panel rect 288px (w-72; max-w-[85vw]=331.5 inactive
  at 390) · the 8 destinations. Non-vacuousness by the wrong-bound
  perturbation: ≤ 389 → FAILED live (the real scrollW is exactly 390) →
  restored → GREEN.
- **S104-P3 (the seeded-state mobile walk)**: screenshots 158 (the
  seeded dashboard at 390×844) + 159 (the seeded drawer OPEN at
  390×844) — the VLM battery 4/4 + 4/4, zero adjudications; the VLM
  independently read the freeze pins' values off the phone pixels
  ("Total Leads 24 (+5.3%) · Deals Closed $337.0k · Conversion Rate
  29.2%") and confirmed the 8-link panel + the dimmed seeded dashboard
  behind the overlay.
- **S104-P4 (the 375×812 login maiden re-check)**: CLEAN under the 1.4
  class ceiling — login 0.82% vs the allowed 1.9% · settings 7.52 vs
  7.7+0.5 · the floor family holding; the class margin verified at the
  second walked width under the class-ceiling semantics.
- **S104-P0/P5 + the N-79b1 carrier**: the F-104a1 at-birth fix
  (105/1892 → 105/1903 at both sites) · the probe ordinals 74/24th →
  **75/25th** · the HIDDEN s79 e2e-count carrier in login-family-parity
  caught the CLAUDE realignment live (the pyramid-line form) — the
  carrier re-anchored 132 → 133 with the retired form joining its
  negatives (the lockstep working as designed).
- **The LIVE verification**: probe:ref — the bundle md5 STABLE (the
  **75th** consecutive); census #100: demo zero · desktop 256px/8 · the
  mobile-nav defect STANDS at TRUE 390 (the **25th**). The four
  standing drift gates CLEAN; the drawer battery FULLY GREEN live.
- **RED**: 17 failed | 19 passed (36) at the pre-realignment docs (10
  re-anchored docs-counts + 6 new e2e-site pins + 1 lockstep — **the
  plan's prediction EXACT**), stash-proven (stash the two test files →
  30/30 → pop → 17 RED) + the guard's wrong-bound 1-failed proof.
- **GATE**: lint 0/0 · tsc 0 · 1921/1921 unit [106 suites, +6 net] ·
  build · 133/133 e2e fresh CI=1 (+1: the drawer-open guard) + the four
  drift sweeps CLEAN inside gate:full. Docs at SKILL v1.101.0 [§16cr +
  project_state] + README badge 2054 + AGENTS/CLAUDE/PAD at 1921+133 +
  the F-104a1 fix + session_209.md + the s104 plan + its execution
  record + the worklog.

### Session-105 — the second-surface seeded mobile walk + the F-105a1 stale-suite-count fix

- **105-a audit**: the s104 ship delta GENUINE 10/10 (non-vacuousness
  re-produced EXACTLY: the mixed-state checkout 17 failed | 19 passed
  [the recorded RED-1] + the three-file scope 18 | 56 + the full-suite
  18 failed | 1903 passed [RED-1 + the N-79b1 carrier] + the RED-2
  wrong-bound 1 failed [docScrollW ≤ 389 vs the real 390] → restored →
  GREEN; screenshots 158/159 valid 390×844 PNGs). No real findings;
  N-105a1/2/3 record-only (the commit-message PAD line-citation
  treadmill; the 11/11 vs 10/10 phrasing; session_209 rides the feat).
- **105-b audit**: ZERO graduations 13/13 (~62nd; src/ byte-identical
  since the s104 ship); the ledger families live 106/1921; the CSV
  census 17 sites zero unguarded; source-vocabulary byte-identical
  since s90; the config layer verified; the SEO/sitemap layer 13/13
  LIVE (sitemap 9 urls 1.0/0.8 weekly · robots exact · manifest · all
  9 routes' per-route titles, PORT 3123, server killed after); the
  mobile-nav contract INTACT; the globals.css v4 re-pins present.
  Both operator decisions STANDING (65th).
- **S105-P2 (the headline — the reports-tabs e2e guard)**: the SECOND
  surface family walked at phone width — the s103 157 capture was
  desktop-only and no e2e pin held the reports geometry at 390. The
  NEW tests/e2e/reports-mobile.spec.ts: at 390×844 on the SEEDED
  e2e.db, /reports asserts docScrollW ≤ 390 · the KPI row 5 cards ·
  ONE track · gap 16px · the pill tab bar 5 triggers · TWO tracks
  (grid-cols-2 at 390) · active "Sales Overview" · the sales panel 4
  charts at exactly 300px · gap 24px · single track · a REAL tab
  switch moves the active tab to "Pipeline & Forecast", swaps the
  panel (4 charts @300), and keeps the frame at 390. Non-vacuousness
  by the wrong-bound perturbation: docScrollW ≤ 389 → FAILED live
  (the real scrollW is exactly 390) → restored → GREEN. E2e census
  133 → 134 (the guard lives in a NEW spec file — the mobile-nav
  battery count stays 10).
- **F-105a1 (the in-flight find, REAL — docs)**: the F-99a1 genus
  recurring on the mobile-nav suite-count axis. The s104 realignment
  updated the README/PAD-suite phrases but TWO more sites the pin
  never covered still read the stale 9-check — CLAUDE's pyramid
  listing and the PAD census-table row. Both fixed (10-check) and the
  mobile-nav suite-count pin's scope WIDENED to cover all five sites
  + the retired 9-check SITE-FORM negatives (a session-history row
  quoting the forms cannot match them).
- **S105-P1 (the count ladder)**: E2E 133 → 134; UNIT unchanged 1921
  (+0 net its); badge 2054 → 2055; the retired 133 constructions join
  the negatives ladders (docs-counts + the N-79b1 carrier); the
  HEAD-line template "in 3 spec" → "in 4 spec" (the spec-family
  census gains reports-mobile).
- **S105-P3 (the captures + the VLM battery)**: screenshots 160 (the
  seeded reports SALES tab at 390×844, the tab region scrolled into
  view — the 5 stacked KPI cards push it below the fold at phone
  width) + 161 (the seeded reports PIPELINE tab). VLM 4/4 + 4/4, zero
  adjudications — the VLM independently read the 2×3 tab grid ("5
  tabs arranged in a 2x3 grid, 2 columns, 3 rows, last cell empty"),
  all 5 tab names verbatim, "Sales Overview" active, the Revenue chart
  y-axis, then the SWITCHED state ("Pipeline & Forecast" active, the
  "Forecasting Accuracy" card with its two-series 0-300,000 chart).
  The first-viewport capture also read the seeded reports KPI values
  (Total Leads 18 / Open Leads 6 — the quarter-filtered reports
  derivations, not the dashboard's 24) off the phone pixels.
- **S105-P4 (the 834×1112 tablet maiden)**: CLEAN — the second walked
  tablet width (iPad Pro 10.5 portrait; the maiden walked 768×1024 at
  s97) judged by the tablet class table; login ~0.44% vs the 1.0
  allowed (the constant-absolute logo genus ~2,500px; the larger
  frame shrinks the share, the s103 denominator arithmetic); a
  one-off re-check, NOT a fifth sweep; gate:full unchanged.
- **S105-P0/P5**: the probe ordinals 75/25th → 76/26th · session_
  211.md + the s105 plan + its execution record + the worklog.
- **The LIVE verification**: probe:ref — the bundle STABLE (the 76th
  consecutive); census #101: demo zero · desktop 256px/8 · the
  mobile-nav defect STANDS at TRUE 390 (the 26th). The four drift
  gates CLEAN; the drawer battery FULLY GREEN live; the S105 ANALYZE
  probe (throwaway, deleted) mapped the seeded reports geometry at
  390 before the pin design (docScrollW 390 · the KPI row one track
  358px ×5 gap-16 · the tab bar two tracks 174×2, 5 triggers, 82px
  tall · the sales panel 4 charts @300 gap-24 single-track).
- **RED**: 10 failed | 45 passed (55) at the pre-realignment docs (the
  9 docs-counts e2e-reading pins + the N-79b1 carrier — **the plan's
  prediction EXACT**), stash-proven (stash the two test files → 55/55
  → pop → 10 RED) + the guard's wrong-bound 1-failed proof.
- **GATE**: lint 0/0 · tsc 0 · 1921/1921 unit [106 suites, +0 net] ·
  build · 134/134 e2e fresh CI=1 (+1: the reports-tabs guard) + the
  four drift sweeps CLEAN inside gate:full. Docs at SKILL v1.102.0
  [§16cs + project_state] + README badge 2055 + AGENTS/CLAUDE/PAD at
  1921+134 + session_211.md + the s105 plan + its execution record +
  the worklog.

### Session-106 — the third-surface seeded mobile walk + the three count-lockstep fixes

- **Audits**: 106-a the s105 ship delta GENUINE 10/10 (non-vacuousness
  reproduced: the mixed-state checkout 11 failed | 44 passed [the
  recorded 10 EXACT + the 11th the widened F-105a1 pin re-proving
  itself at the pre-s105 tree] + the native 55/55 + the wrong-bound
  1-failed "Received: 390" → restored GREEN); 106-b 9/9 layers (zero
  graduations ~63rd; SEO/sitemap 13/13 LIVE; mobile-nav contract
  intact; both operator decisions standing 66th).
- **The finds**: F-106a1 REAL (the SKILL H1 not bumped — :16 still
  read v1.101.0 while the frontmatter read 1.102.0; four s105 records
  falsely claimed it; the site was UNPINNED); F-106b1 REAL (the stale
  9-check mobile-nav suite-count at AGENTS:168, s69-vintage — plus its
  SECOND FACE found in-flight at plan validation: SKILL:359 carried
  the same construction; the pin widened to SEVEN sites); F-106c1
  (in-flight: CLAUDE:114's commands-table unit row was an unpinned
  live-tense count site — joined the dialog-geometry lockstep).
- **The rotation**: the SEEDED settings surface walked at TRUE
  390×844 (the THIRD surface family — the picklist genus is the
  largest phone share at 7.7; the s105-close suggested next #2). The
  ANALYZE probe mapped the geometry first (docScrollW 390 exact · the
  segmented tab bar ONE row of THREE equal tracks ~116px · the
  picklist grid ONE track 358px × 5 cards gap-16 · the REAL Data-tab
  switch swaps to 3 cards @358 with the frame held at 390), then the
  NEW tests/e2e/settings-mobile.spec.ts guard transcribed it —
  wrong-bound-perturbation-proven (docScrollW ≤ 389 → 1 failed live →
  restored → GREEN). Captures 162 (the seeded CONFIG tab) + 163 (the
  DATA tab) — the VLM battery 4/4 + 4/4, zero adjudications.
- **The count ladder**: E2E 134 → 135 · UNIT 1921 → 1922 (+1: the NEW
  H1↔frontmatter↔project_state lockstep it — the F-106a1 genus
  structurally retired, a DERIVED pin that reads the frontmatter
  version so it never goes stale) · badge 2055 → 2057 · the HEAD-line
  template "in 4 spec" → "in 5 spec" (the spec-family census gains
  settings-mobile) · the retired 134 constructions joined the
  negatives ladders · the probe ordinals 76/26th → 77/27th.
- **RED**: 19 failed | 56 passed (75) at the pre-realignment docs (the
  17 docs-counts its + the N-79b1 carrier + the dialog-geometry
  lockstep — **the plan's prediction EXACT**), stash-proven (stash the
  three test files → 74/74 → pop → 19 RED) + the guard's wrong-bound
  1-failed proof.
- **GATE**: lint 0/0 · tsc 0 · 1922/1922 unit [106 suites, +1 net] ·
  build · 135/135 e2e fresh CI=1 (+1: the settings-tabs guard) + the
  four drift sweeps CLEAN inside gate:full. Docs at SKILL v1.103.0
  [§16ct + project_state + the H1 — actually bumped this time] +
  README badge 2057 + AGENTS/CLAUDE/PAD at 1922+135 + session_213.md +
  the s106 plan + its execution record + the worklog.

### Session-107 — the reports KPI-derivations unit freeze + the Appendix B / gate-order lockstep fixes

The audits: 107-a the s106 ship delta GENUINE 10/10 (non-vacuousness
reproduced — the mixed-state 19 failed | 56 passed EXACT + the native
75/75) with **F-107a1 REAL** (the SKILL Appendix B test-inventory
table stale since s12: the mobile-nav row "7" vs live 10, the e2e total
"4 files | 28" vs live 135, the unit total "12 files | 206" vs live
106|1922 — the F-99a1 genus at an EIGHTH site, invisible to every
widening); 107-b 9/9 layers PASS (zero graduations ~64th; SEO/sitemap
46/46 LIVE; the mobile-nav contract INTACT; both operator decisions
standing 67th). The live layers: probe:ref STABLE the 78th consecutive
(census #103 — demo zero · desktop 256px/8 · the TRUE-390 defect
STANDS the 28th, the reference's own bug, our drawer the superset) +
the four drift gates CLEAN + the drawer battery at TRUE 390×844 FULLY
GREEN live 9/9 (trigger · panel 288px · 8 links · focus · dual lock ·
navigate-close · Escape · resize-past-md release).

- **THE HEADLINE — the reports KPI-derivations unit freeze** (the
  s106-close suggested next #1, "the s107 candidate"): the
  quarter-filtered KPI row (the values the s105 phone capture read —
  Total Leads 18 / Open Leads 6, NOT the dashboard's 24) derived
  INLINE in the route handler since s31 with no seam and no freeze.
  S107-P1 extracted the pure `reportsKpis(leads, wonOpps, lostOpps)`
  seam into src/lib/reports-data.ts (the house seam doctrine — the
  FIRST src/ change since s90, behavior-preserving, the formulas
  byte-identical); the NEW tests/seeded-reports-kpis.test.ts (4 its)
  pins the seam-formula members (openLeads new+contacted STRICTLY ·
  the toFixed(1) conversion · the zero-division guard · the null-safe
  sums) + the route-wiring (the handler orchestrates, no inline
  derivation survives) + the seeded rolling-quarter row through the
  REAL seam + the REAL subMonthsClamped window (**18/6/4/$337.0K/
  2/$92.0K/"66.7"**) + the window boundary (the −95-created lead
  outside [Jul 8 < Jul 11], the −80 the oldest inside — a 12-day
  margin) + the all-time contrast (24 vs 18: the same seed, two
  windows). Induced-drift-proven BOTH faces: a seed stage perturbation
  (won→contacted) fails the seeded its by name; a seam formula
  perturbation (qualified joined to openLeads) fails four its — both
  restored → GREEN.
- **F-107a1 fixed + pinned**: the Appendix B refreshed (the per-suite
  rows DATED as an s12 snapshot per the F-100a2 doctrine; the three
  live-tense totals now live: unit 107 files | 1927 · e2e 5 spec files
  + the setup project | 135 · mobile-nav 10) + the NEW docs-counts it
  pinning all three constructions against the SKILL source — the genus
  structurally retired at the eighth site.
- **F-107b1 fixed + pinned** (the in-flight plan-validation find):
  CLAUDE's gate-order unit half ("`bun run test` (1922)") was another
  UNPINNED live-tense unit-count site (the docs-counts AGENTS
  gate-order pin covered only AGENTS; CLAUDE's e2e half was already
  pinned — the asymmetry) — the FOURTH assertion joined the
  dialog-geometry CLAUDE unit lockstep carrier (the F-106c1
  precedent); the opportunity-model KPI it re-anchored onto the seam
  construction (the route calls reportsKpis + the seam carries the
  new/contacted strictness).
- **The count ladder**: UNIT 1922 → 1927 (+4 the KPI suite + 1 the
  Appendix B pin) · SUITES 106 → 107 (the new suite file) · E2E
  UNCHANGED at 135 (the N-79b1 carrier + the e2e-site pins untouched)
  · badge 2057 → 2062 · the README commands suite list gains
  seeded-reports-kpis · the retired 1922/106/2057 constructions joined
  the negatives ladders · the probe ordinals 77/27th → 78/28th.
- **RED-1**: 19 failed | 46 passed (65) at the pre-realignment docs +
  the still-inline route (the 10 unit-axis docs-counts pins + the
  stale-forms negatives it tripping on the still-live old forms + the
  H1/project_state counts face + the NEW Appendix B it + the
  dialog-geometry lockstep + the 4 KPI-suite its [the seam not yet
  born] + the opportunity-model re-anchor — the plan predicted 18, the
  +1 the stale-forms it, its RED failure the negatives working as
  designed), stash-proven (stash the four test files → 60/60 → pop →
  19 RED).
- **The captures**: 164 (the seeded reports KPI row at 390×844, first
  viewport — the 18/6 ladder readable off the phone pixels) + 165 (the
  desktop 1440 full 5-card row + the "This Quarter" filter) — the VLM
  battery 4/4 + 4/4, zero adjudications: the VLM independently read
  ALL five frozen values verbatim (18 · 6 · 4 $337.0K · 2 $92K ·
  66.7%) plus the period filter off BOTH viewports' pixels.
- **GATE**: lint 0/0 · tsc 0 · 1927/1927 unit [107 suites, +5 net] ·
  build · 135/135 e2e fresh CI=1 (the seam behavior-preserving — no
  re-baselining) + the four drift sweeps CLEAN inside gate:full. Docs
  at SKILL v1.104.0 [§16cu + project_state + the H1] + README badge
  2062 + AGENTS/CLAUDE/PAD at 1927+135 + session_215.md + the s107
  plan + its execution record + the worklog.

### Session-108 — the fourth-surface seeded mobile walk + the two live finds + the four stale-docs fixes

The audits: 108-a the s107 ship delta GENUINE 9/9 (non-vacuousness
reproduced EXACT: the mixed-state worktree 19 failed | 46 passed (65),
all 19 by name + the native 60/60) with FOUR REAL finds — **F-108a1**
(the SKILL project_state head's LAYER face: the s107 ship bumped the
counts 1922→1927 but never prepended the session-107 layer — the head
still described "the session-106 layer"; the F-106a1 pin asserted only
the counts face, blind to the layer axis), **F-108a2** (SKILL:388
"1520 lines; 180 checks" + PAD's module-table row vs live 1530/182 —
stale since s98, the 95-a fix recurred because unpinned),
**F-108a3** (PAD's reports-data row "~213" vs live 279 — the s107 seam
+66 omitted from the row + its purpose text), **F-108a4**
(DEPLOYMENT.md "16 API route handlers" vs live 27 + the deleted
smoke-test.sh reference — zero pin coverage); 108-b 9/9 layers PASS,
zero real findings (zero graduations ~65th; SEO/sitemap 46/46 LIVE
first-run clean; the mobile-nav contract INTACT; both operator
decisions standing 68th).

- **THE HEADLINE — the fourth-surface seeded mobile walk (the calendar
  grid at 390×844) surfaced TWO LIVE FINDS before any guard was
  written** (the ANALYZE-probe-first doctrine): **M-108c1** the event
  chips render at CONTENT width — the chip spans are INLINE boxes, so
  `truncate` (overflow:hidden + ellipsis + nowrap) never constrains
  them: 93-177px chips inside 43px cells at 390 (two pushing
  main.scrollWidth to **496** — a horizontally-swipeable main) and
  134-203px chips overlapping the neighboring cells at 1440; the
  `+N more` span the same genus. Invisible to every standing gate (the
  drift sweeps run the ZERO-DATA state — no events, no chips; the
  ten-route overflow sweep asserts docScrollW only — the document
  never overflows, main is the scroller). The reference's own
  construction (the s76 L-76c9 bundle decode) carries the same latent
  defect — un-live-verifiable at its zero-data state; ours the
  documented superset: `block` on both spans makes the truncation
  engage at every width. **M-108c2** the 42-cell grid vs the
  reference's COMPLETE-WEEKS grid — the s76 M-76c8 "always-42 / 6
  constant rows" gloss a MISDECODE: LIVE-probed five months the
  reference renders Oct 2026 = 35 [Sep 27..Oct 31] · Nov 2026 = 35
  [Nov 1..Dec 5] · Jan 2027 = 42 [Dec 27..Feb 6, the 6-week month] ·
  Apr 2027 = 35 · Jul 2026 = 35 — the complete-weeks model
  (eachDayOfInterval Sunday-before-the-1st → Saturday-on-or-after-the-
  last), exactly the s51-era "trimmed render" the s51 test comments
  describe. Invisible to every gate (the extra 6th row below the 900px
  sweep fold on both apps — VLM-verified off the sweep screenshots;
  no e2e cell-count pin). The fix: `calendarGrid`'s leading branch
  ceils to whole weeks — the page call byte-identical (the s76 GUARD
  source pin keeps passing), `calendarFetchBounds` follows exactly
  (the N-51a contract now with equality: Oct → Oct 31 · Nov → Dec 5).
- **The NEW tests/calendar-grid.test.ts** (3 its): the LIVE-verified
  members table (Feb 2026 = 28 · Oct/Nov 2026 = 35 · Jan 2027 = 42 ·
  Jul 2026/Apr 2027 = 35, each with its first/last cell + the
  not-42-for-October negative) + the structural invariants (whole
  weeks · Sunday-anchored · contiguous daily steps · the ceil formula
  · the 1st rendered — every month of 2026-2027) + the fetch-bounds
  alignment (the window's last day IS the rendered grid's last cell +
  the seam source form). Induced-drift-proven: a temporary reversion
  to always-42 fails its (a)+(c) members by name.
- **The NEW tests/e2e/calendar-mobile.spec.ts** (the fourth-surface
  walk, +1 e2e): on the SEEDED e2e.db at 390×844 — docScrollW ≤ 390
  AND **mainScrollW ≤ 390 (the NEW inner-overflow assertion — the
  M-108c1 catcher; the s105/s106 walks assert docScrollW only)** ·
  the KPI ladder 4 cards ONE track gap-16 · the DOW grid 7 labels
  7-track gap-4 · the month grid the COMPLETE-WEEKS cell count
  computed in-test (never hardcoded) with 7 tracks and cells ≥ 40px ·
  **zero chips past their cell's right edge (the M-108c1 guard)** ·
  the Upcoming/Agenda single-track stack · a REAL Next-month click
  that increments the title and keeps the frame at 390.
- **The four audit finds fixed + pinned**: F-108a1 (the missing s107
  layer inserted into the project_state head + the H1 lockstep it
  gains the layer-axis assertions — the head's first two layers ===
  the last two sessions, the genus structurally retired) · F-108a2
  (SKILL §5.6 1530 lines / 182 checks + the PAD module-table row) ·
  F-108a3 (the reports-data row 279 + the reportsKpis purpose clause)
  · F-108a4 (DEPLOYMENT 27 handlers + the smoke-test.sh line → `bun
  run gate`) + the NEW docs-counts four-site it holding all of them.
- **The count ladder**: UNIT 1927 → 1932 (+3 calendar-grid + 1
  calendar-cells + 1 docs-counts) · SUITES 107 → 108 · E2E 135 → 136
  (the calendar-mobile guard in a NEW spec file — the mobile-nav
  battery stays 10) · badge 2062 → 2068 · the HEAD-line template
  "in 5 spec" → "in 6 spec" (the spec-family census gains
  calendar-mobile) · the S16-P7 e2e `monthKids ≥ 35` re-anchored to
  `≥ 28` (the complete-weeks floor — a 28-cell February would have
  failed the old bound) · the probe ordinals 78/28th → 79/29th.
- **RED-1**: 27 failed | 55 passed (82) at the pre-realignment docs +
  the still-42 grid + the still-inline chips (the 19 docs-counts +
  the N-79b1 carrier + the 3 calendar-grid + the chip pin + the 3
  fetch-bounds re-anchors — enumerated by name), stash-proven (stash
  the seven files → 77/77 → pop → 27 RED).
- **The captures**: 166 (the seeded calendar at 390×844 — the KPI
  ladder + the month grid with the truncated chips) + 167 (the
  desktop 1440 — the complete-weeks grid + the truncated chips + the
  Filters rail) — the VLM battery 4/4 + 4/4.
- **GATE**: lint 0/0 · tsc 0 · 1932/1932 unit [108 suites, +5 net] ·
  build · 136/136 e2e fresh CI=1 + the four drift sweeps CLEAN inside
  gate:full (both fixes can only DECREASE ours-vs-reference diffs —
  the 6th row disappears below the fold anyway, the chips invisible
  at the zero-data sweep state — no re-baselining). Docs at SKILL
  v1.105.0 [§16cv + project_state + the H1] + README badge 2068 +
  AGENTS/CLAUDE/PAD at 1932+136 + session_218.md + the s108 plan +
  its execution record + the worklog.

### Session-109 — the fifth-surface seeded mobile walk + the live find + the line-census pin

The audits: 109-a the s108 ship delta GENUINE 9/9 (non-vacuousness
reproduced EXACT: the mixed-state worktree 27 failed | 107 passed
(129), all 22 by name + the native 127/127) with THREE REAL finds —
**F-109a1** (PAD's format.ts module-table row "336" vs live 350 —
the very file the s108 ship modified; the ship fixed the
page-layout/reports-data rows but not this one — the F-108a3 genus
recurring at birth, the module-table still unpinned), **F-109a2**
(the SKILL header cluster, SEVEN pre-existing stale line-count sites
newly surfaced: globals.css 171 vs 413 · entity-dialogs 1081 vs
1222 · mobile-nav 170 vs 206 · schema.prisma 242 vs 244 · seed.ts
468 vs 466 · auth.ts 133 vs 153 · types/index.ts 277 vs 276 — all
unchanged since s65-s90), **F-109a3** (PAD's login-reset row "275"
vs live 279 — N-108a5's face, unfixed + unpinned); 109-b 9/9 layers
PASS, zero real findings (zero graduations ~66th; SEO/sitemap 46/46
LIVE first-run clean; the mobile-nav contract INTACT; both operator
decisions standing 69th).

- **THE HEADLINE — the fifth-surface seeded mobile walk (the
  activities priority rows at 390×844, the LAST un-walked phone
  surface) surfaced ONE LIVE FIND before any guard was written**
  (the ANALYZE-probe-first doctrine): **M-109c1** the priority row's
  right cluster overflows the 390px frame — the cluster (the time
  span 40px + the ghost "Check as completed" text button 174px at
  min-content + the 20px iconSm edit button + two 8px gaps) is a
  **249px un-shrinkable min-content** inside the 326px panel
  (content box 302 after `p-3`); the left cluster (`flex-1`,
  min-content 182) + the right (249) = 431 > 302, so the cluster
  lays out to right=475 — **98px past the viewport,
  main.scrollWidth 488** (a horizontally-swipeable /activities, the
  M-108c1 genus on the FLEX axis). Invisible to every standing gate
  (the drift sweeps run the ZERO-DATA state — no activities, no
  rows; the ten-route overflow sweep asserts docScrollW only — the
  document never overflows, main is the scroller; the existing e2e
  activities tests run at desktop widths). The reference's own
  construction (the s76 vx bundle decode) carries the same latent
  defect — un-live-verifiable at its zero-data state; ours the
  documented superset: **min-w-0 on both clusters + the inner text
  block + the button label in a min-w-0 truncate span** (a raw text
  node cannot shrink — the truncate-engages doctrine; validated
  live by class injection BEFORE the plan: 488 → 390). Two ANALYZE
  mysteries resolved and recorded: the whole filters/by-type rail
  is `hidden lg:block` — display:none below lg on BOTH apps (the
  reference's own desktop-only model; the by-type chart's w=0 at
  390 is NOT a defect) — and the quick-log row wraps 2×2 at 390
  (safe, no header offender).
- **The e2e guard** (the NEW activities-mobile.spec.ts, +1 → 137):
  docScrollW AND mainScrollW ≤ 390 (the inner-overflow assertion
  family) · the KPI ladder 6 cards one-track gap-16 · the segmented
  tab strip 4 triggers 4-track · the Overdue badge === the panel's
  row count (self-consistent, never hardcoded) · zero rows past the
  panel's right edge + zero clusters past their row's right edge
  (the M-109c1 guard) · the timeline LONG-WEEKDAY h3 single-column ·
  the rail display:none below lg · the quick-log 2×2 wrap · a REAL
  Completed-tab switch that keeps the frame at 390; wrong-bound
  perturbation-proven (mainScrollW ≤ 389 → FAILED live → restored →
  GREEN).
- **The unit pin** (+1 it in activities-calendar-parity): the row
  construction pinned (min-w-0 on both clusters + the inner block +
  the `text-xs min-w-0` button + the `<span className="min-w-0
  truncate">` label + the retired bare-label negative).
- **The F-109a1/a2/a3 fixes + the NEW line-census pin** (the
  LIVE-CENSUS design, stronger than the four-site form): the it
  reads each SOURCE file live and asserts the docs' stated counts
  match — the next staleness, EITHER face (a doc edit OR a source
  growth), fails `bun run test`. Thirteen pairs: the PAD module-table
  rows (format.ts 350 · login-reset 279 · settings-mobile 106 · the
  tilde forms exact-ified: entity-dialogs 1222 · mobile-nav spec
  277 · reports-mobile 110) + the SKILL header cluster (globals.css
  413 · entity-dialogs 1222 · mobile-nav 206 · schema.prisma 244 ·
  seed.ts 466 · auth.ts 153 · types/index.ts 276).
- **The count ladder**: UNIT 1932 → 1934 (+1 the row pin + 1 the
  census pin) · SUITES 108 unchanged (both its land in EXISTING
  files) · E2E 136 → 137 (the activities-mobile guard in a NEW spec
  file — the mobile-nav battery stays 10) · badge 2068 → 2071 · the
  HEAD-line template "in 6 spec" → "in 7 spec" (the spec-family
  census gains activities-mobile) · the probe ordinals 79/29th →
  80/30th.
- **RED-1**: 22 failed | 107 passed (129) at the pre-realignment
  docs + the still-unshrinkable clusters (the 19 docs-counts [16
  count-axis + the H1 lockstep + the Appendix B] + the N-79b1
  carrier + the dialog-geometry lockstep + the row pin — enumerated
  by name; the plan predicted ≈21-24), stash-proven (stash the seven
  files → 127/127 → pop → 22 RED).
- **The captures**: 168 (the seeded activities at 390×844 — the KPI
  ladder + the wrapped quick-log row + the fitting priority rows) +
  169 (the desktop 1440 — the two-column lg:block rail + the
  by-type chart) — the VLM battery 4/4 × 2.
- **GATE**: lint 0/0 · tsc 0 · 1934/1934 unit [108 suites, +2 net] ·
  build · 137/137 e2e fresh CI=1 + the four drift sweeps CLEAN inside
  gate:full (the fix is invisible at the zero-data sweep state — no
  rows render — no re-baselining). Docs at SKILL v1.106.0 [§16cw +
  project_state + the H1 + the header cluster] + README badge 2071 +
  AGENTS/CLAUDE/PAD at 1934+137 + session_221.md + the s109 plan +
  its execution record + the worklog.

### Session-110 — the dashboard KPI seam unification + the seeded freeze

The s109-close suggested next #1, twice deferred behind the mobile
walks: the dashboard KPI row — the LAST inline KPI derivation (the
exact s107-genus the reportsKpis extraction retired for the reports
route) — derived inline in `src/app/api/dashboard/route.ts` since
session-31, violating the house seam doctrine for 79 sessions. The
s103 seeded-charts pin held two of its members through a MIRRORED
formula inside the test body (a route formula edit would NOT have
failed it — the mirror keeps passing while the app drifts).

**The seam (S110-P1/P2):** the derivation extracted
behavior-preserving into `dashboardKpis(leads, now)` in
`src/lib/dashboard-data.ts` (the s107 precedent — formulas
byte-identical: the reference's HARDCODED V=0 salesTarget +
targetProgress 0, the toFixed(1) WON-LEAD conversion share with the
"0" zero-division guard, the per-lead-floored rounded average AGE of
the won leads — createdAt only, closedAt never enters the signature).
The route now orchestrates: fetches the arrays, hands leads + now to
the seam, assigns to `DashboardData["kpis"]`; the wonLeads
intermediate retired with the block (only the seam consumes it);
wonOpps/revenueOverTime/leadSources/upcomingActivities untouched (the
s78 slim's members). Behavior-preserving — the API response is
byte-identical; the drift sweeps and the e2e golden path unchanged,
NO re-baselining.

**The freeze (S110-P3):** `tests/seeded-dashboard-kpis.test.ts` — 4
its: the seam-formula members (synthetic — the V=0 quirk, the
toFixed(1) won-LEAD share, the FLOOR-then-average-then-ROUND order,
both zero-division guards) · the route wiring (source-level: the seam
call, no inline construction survives) · the seeded dashboard KPI row
through the REAL seam at the synthetic seed-time NOW: **totalLeads 24
· salesTarget 0 · progress 0 · conversionRate "29.2" (7/24) ·
avgSalesCycleDays 83** (the ages 140+120+95+80+62+45+38 = 580, /7 →
83) · the cross-seam contrast (the unification face): the SAME seed
through reportsKpis's rolling quarter reads 18/"66.7" while the
dashboard face reads 24/"29.2" — the WINDOW axis (all-time vs
quarter) AND the NUMERATOR axis (won-LEADS vs won-OPPS) pinned
side-by-side; a future edit pointing either route at the wrong seam
fails BOTH its.

**The re-anchors (S110-P4):** opportunity-model ×2 (the salesTarget +
avgSalesCycle pins read the SEAM source now, the s107 precedent) ·
dashboard-family-parity ×1 (the route-KEEPS pin: the three remaining
derivations + the seam call; the five KPI constructions asserted at
the seam) · seeded-charts ×1 (the s103 MIRRORED formula retired — the
members assert through the REAL imported seam).

**The count ladder:** UNIT 1934 → 1938 (+4 — the new suite; the four
re-anchors land in EXISTING its) · SUITES 108 → 109 (the FIRST new
unit suite since s108's calendar-grid) · E2E 137 UNCHANGED (the
extraction is server-internal) · badge 2071 → 2075 · the README
commands suite list + file-tree lib comment gain the new names · the
Appendix B unit-total 109|1938 + the per-suite row · the line-census
gains its FOURTEENTH pair AT BIRTH (the PAD dashboard-data.ts row —
the F-109a1-genus prevention) · the retired 1934/108/2071
constructions join the negatives ladders · the dialog-geometry CLAUDE
lockstep 1934 → 1938 · the probe ordinals 80/30th → 81/31st.

**RED-first:** 19 failed | 97 passed (116) at the still-inline route +
the still-old docs (the 14 docs-counts count-axis its + the new
suite's route-wiring it + the opportunity-model ×2 + the
dashboard-family-parity + the dialog-geometry lockstep — enumerated by
name; the plan predicted ≈19-21), stash-proven (the nine files stashed
with -u → the native 112/112 → pop → 19 RED) + BOTH induced-drift
proofs (the seam-formula toFixed(1)→toFixed(0) perturbation fails the
formula + seeded + seeded-charts its by name; the seed stage
perturbation won→contacted fails the seeded-row its by name; both
restored → GREEN).

**The captures:** 170 (the seeded dashboard KPI row at 1440 — Total
Leads 24 · Sales Target $0k/0% · Conversion Rate 29.2% · Avg Sales
Cycle 83d) + 171 (the KPI ladder at 390×844) — the VLM battery 4/4 ×
2, the KPI values read off the pixels on both viewports.

**GATE:** lint 0/0 · tsc 0 · 1938/1938 unit [109 suites, +4 net] ·
build · 137/137 e2e fresh CI=1 + the four drift sweeps CLEAN inside
gate:full (the extraction is server-internal — the rendered pixels
identical, no re-baselining). Docs at SKILL v1.107.0 [§16cx +
project_state + the H1 + Appendix B] + README badge 2075 +
AGENTS/CLAUDE/PAD at 1938+137 + session_225.md + the s110 plan + its
execution record + the worklog.

### Session-111 — the login-family LIVE re-walk + the five finds

The s110-close suggested next #3: the first LIVE parity re-walk of a
surface family since s79 — the LOGIN family, the one surface family
the standing probes cannot see. probe:ref tracks only the POST-LOGIN
bundle (`index-DZ-xbrIm.js`; the pre-auth shell rides DIFFERENT
rolldown chunks — zero auth markers in the 1.63MB bundle, the s79
finding); the four drift gates sweep only the nine (app) routes; the
last live walk was s79 — 32 sessions of our changes since. The walk
(a throwaway script, repo-internal, deleted before ship): both apps
driven through the full view ladder — signin, the failed-login
callout, reset, sent, signup (a real POST through to verify) — at
1440x900 + 390x844 on a throwaway walk db, computed-style extraction
+ a per-child viewStack census, every candidate adjudicated against
the source contracts. Three real drifts + two inert class-string
divergences found:

- **D1 (behavioral, verify)**: the reference AUTO-FOCUSES the first
  code box on verify mount — live-measured as the 2px ring on box 1
  only (box 6 rests at none), reproduced twice at both viewports.
  Fixed with a `[view]`-keyed effect (`codeRefs.current[0]?.focus()` —
  a DOM focus, never setState); the e2e verify test now asserts
  `toBeFocused()` (an added expect inside the existing test() block —
  the e2e census stays 137).
- **D3 (structural, signup)**: the reference's signup rides a FLAT
  `space-y-4` stack with the h2 as a DIRECT child (its census:
  `[BUTTON, H2, FORM]`); ours inherited the reset view's shared
  `space-y-4 sm:space-y-6` — the s21-authored
  `LOGIN_SIGNUP_LAYOUT.viewStack = "space-y-4"` const was correct but
  NEVER WIRED in login-card (+8px at >=640 in the title->form gap).
  Fixed: the shared stack div went view-conditional + the inert
  titleStack wrapper retired (the h2 direct, the reference's own
  structure).
- **D4 (structural, verify)**: the reference's verify back->heading
gap computes 16 at >=640 (its `-mb-2` collapses with the v3 stack's mt
24) and 8 at <640; our verify back rode flat `mb-2` (8px at all
widths). Fixed: `LOGIN_VERIFY_LAYOUT.back` gains the `sm:mb-4` arm
(the reset view's back already had the ladder).
- **D2 (inert, verify)** + **D5 (inert, sent)**: the verify
  headingStack (`text-center space-y-2` — the tile's own
  `mb-3 sm:mb-4` always overrides the stack's space-y on both apps,
  the heading heights 168/144 identical) + the sentCallout's `[&>svg]`
  arm family — re-pinned for byte parity, zero rendered effect.

The reconciliation: the post-fix cards byte-match the reference at
BOTH widths — the signup 470@1440/422@390, the verify 488@1440/412@390.
Everything else measured FULL parity (the signin/reset/sent views, the
callout, the code inputs, the tile, the hint, the icons — byte-
identical classes or computed-equal v3/v4 mechanisms; the oklab/rgba
serialization, the transparent-shadow prepends, and the zinc-vs-
neutral inherited foreground are noise — never visible).

**The count ladder:** UNIT 1938 → 1942 (+4 — the four new s111 its in
login-family-parity [D1/D2/D3a/D3b]; the D4 + D5 re-anchors land in
EXISTING its) · SUITES 109 UNCHANGED · E2E 137 UNCHANGED (the D1 pin
is an added expect inside the EXISTING verify test) · badge 2075 →
2079 · the F-111a1 fix (the Appendix B wall-clock phrase "108 suites"
→ 109 + the new phrase pin — the 111-a audit find) · the two
slice-anchor re-derivations in login-family-parity (the `? (`
discriminator — the D1 effect + the D3a conditional introduced earlier
`view ===` occurrences) · the retired 1938/2075 constructions join
the negatives ladders · the dialog-geometry CLAUDE lockstep 1938 →
1942 · the PAD login-reset.ts census row 279 → 291 (the +12 comment
growth — the LIVE-CENSUS re-anchored at the same edit).

**RED-first:** 20 failed | 76 passed (96) at the still-unfixed src +
the still-old docs (13 docs-counts count-axis its + the H1 lockstep +
the Appendix B [the F-111a1 wall-clock] + the dialog-geometry lockstep
+ the D4/D1/D2/D3a/D3b five + the D5 re-anchor — enumerated by name;
the plan predicted 8-10, under-counting the docs-counts axis — the
s110 precedent's 19 was the better guide), stash-proven (the five
files stashed → the native 92/92 → pop → 20 RED re-confirmed) + the
induced-drift proofs below.

**GATE:** lint 0/0 · tsc 0 · 1942/1942 unit [109 suites] · build ·
137/137 e2e + the four drift sweeps CLEAN (the auth pages are not in
the sweep routes — no re-baselining). Docs at SKILL v1.108.0 [§16cy +
project_state + the H1 + Appendix B + the wall-clock fix] + README
badge 2079 + AGENTS/CLAUDE/PAD at 1942+137 + session_229.md + the s111
plan + its execution record + the worklog + the captures 172-175.

### Session-112 — the dialog-family LIVE re-walk + the four finds

The s111-close's third candidate taken: the DIALOG family — the
largest interactive surface group never walked live at BOTH widths
(the s92 walk was 390-ONLY, 20 sessions of changes ago; the dialogs'
mount-focus behavior — the s111 D1 genus — never measured). A
throwaway walk script (repo-internal, deleted before ship) drove
BOTH apps through the CREATE-dialog ladder (New Lead · New Account
· New Contact · Import Contacts · New Event · Log Call · Save
Custom Report View) at 1440×900 + 390×844, extracting the
content-box geometry, the overlay, the header, the close X, the
first field group, the footer, the MOUNT-FOCUS state, the child
census, and the scroll widths; every candidate adjudicated against
the source contracts. **THE RESULT: the dialog family is in
COMPLETE LIVE PARITY** — every geometry axis on all 7 dialogs × 2
viewports AND the mount-focus behavior identical on all seven (the
first input on lead/account/event/savereport · the camera button on
contact · the type select trigger on activity · the Cancel on
import — the dropzone label is not focusable).

- **D-112a1 (class-string, the close X)**: the reference's CURRENT
  stock close carries `ring-offset-background` + the two inert
  `data-[state=open]` arms and NOT `disabled:opacity-70` — our
  s15-era string predates its shadcn bump. The two inert arms gained
  + `disabled:opacity-70` retired (the s111 D2/D5 byte-parity
  genus). `ring-offset-background` is the COMPUTED-CONTRACT
  EXCEPTION, deliberately absent: the ref's focused-close offset
  computes hsl(0 0% 100%) = #fff = our v4 default; the class would
  set #f9fafb (the s11 computed-gap rule).
- **D-112a2 (a11y superset, pinned)**: the reference's icon-only
  camera button is UNNAMED (its own defect); ours carries
  `aria-label="Upload photo"` — the mobile-nav genus, now pinned.
- **D-112a3 (behavioral, six e2e freezes)**: the dialog focus
  landing pinned on the walked dialogs — added expects INSIDE
  existing test() blocks, the e2e census stays 137 (the s111 D1
  precedent).
- **D-112a4 (tooling rule)**: the permanently-mounted mobile-nav
  drawer carries `role="dialog"` with no data-state — CSS
  `[role=dialog]` selectors match it first and never resolve
  (the walk's third iteration, live-debugged); key on
  `[data-state="open"]` or use getByRole (which excludes hidden).
  Documented at the mobile-nav source.

The noise families adjudicated away: the oklab/rgba overlay
serialization; the transparent-shadow prepends (the focused-input
ring computed-equal — the identical 1px #0a0a0a ring + shadow-sm);
the labelMb v3/v4 space-y mechanism flip; the border-input/
border-line + the trigger w-full orderings (the s86 notes).

**The count ladder:** UNIT 1942 → 1944 (+2 — the close-X it in
page-layout + the camera it in contact-photo; both in EXISTING
files) · SUITES 109 UNCHANGED · E2E 137 UNCHANGED · badge 2079 →
2081 · the page-layout census rows 1530 → 1548 + 182 → 183 checks ·
the mobile-nav census row 206 → 215.

**RED-first:** 16 failed | 230 passed (246) at the still-unfixed
src + the still-old docs (the 14 docs-counts + the dialog-geometry
CLAUDE lockstep + the close-X it — enumerated by name; the camera it
a freeze pin passing at staging; the plan predicted 12-16),
stash-proven (the four files → the native 244/244 → pop → 16 RED).
One in-flight correction: the census literals (1543/212 drafted vs
1548/215 actual). RED-2 both faces by name (the bg-accent arm
removal → the close-X it; the aria-label removal → the camera it).

**GATE:** lint 0/0 · tsc 0 · 1944/1944 unit [109 suites] · build ·
137/137 e2e (the six focus expects green on their first run) + the
four drift sweeps CLEAN (no re-baselining — the re-pin is
render-inert) + the closing census MATCH. The captures 176–179 (the
VLM battery 4/4 × 4, one adjudication — the 179 ring at 3x zoom).
Docs at SKILL v1.109.0 + README badge 2081 + AGENTS/CLAUDE/PAD at
1944+137 + session_233.md + the s112 plan + its execution record +
the worklog.

### Session-113 — the menu/popover-family LIVE re-walk + the three finds

The s112-close's candidates adjudicated by a two-app scout: the topbar
search renders NO dropdown on EITHER app (the s32 dead-decode confirmed
live — zero popper surfaces on click and on fill), and the chart
tooltips are recharts defaults on both sides (the s10 doctrine). The
**menu/popover family** was the walk: the s13-era MENU_CONTENT/MENU_ITEM
pins are class-string level (extracted 2026-09-30, thirteen sessions and
one reference shadcn bump ago), the family's mount-focus + keyboard
behavior was never measured (the s111 D1 genus), and the Filters
popover's field-label TAGS were never census'd. Two throwaway walk
scripts drove BOTH apps through the account-menu + leads-Filters +
(ours-only) leads-row-menu ladder at 1440×900 + 390×844, extracting
trigger censuses, open-panel geometry, computed styles, item censuses,
mount-focus states, the ArrowDown highlight, and Escape closes.
**THE RESULT: the family is in COMPLETE LIVE PARITY on every computed
axis** — the account menu's geometry byte-identical at 1440 (x=1280
y=56 w=128 h=74, bottom/end, the popper transform equal), the content
computed-equal on every axis (white / #e5e5e5 / 6px / shadow-md / 4px
pad / #0a0a0a / 128px min-w), the item census identical ([A/Profile
href="/Profile", DIV/Logout] · 118×32 · 6px 8px · 4px radius · 14px),
the mount-focus identical (the content DIV on click-open), the keyboard
model identical (ArrowDown → the first item + #f5f5f5 highlight); the
Filters popover geometry byte-identical at BOTH widths (320×398
@304,483 at 1440; the 390 collision FLIP-UP to data-side=top matched),
the census identical (2 selects · 2 inputs · the four buttons); the
row menus ours-only walkable (the reference's zero-data state — the
documented genus; the s73 bundle decode the contract).

- **D-113a1 (REAL, structural/a11y)**: the reference's Filters popover
  renders FOUR bare `<label>` elements (`text-sm font-medium mb-2
  block`, unassociated); ours shipped the same four as `<span>`s —
  real label semantics is the strict-mirror fix (leads-page.tsx ×4).
- **D-113a2 (inert class-string — the D-112a1 genus)**: our s13-era
  MENU_CONTENT carries `outline-none`; the reference's CURRENT stock
  content does NOT (the s13 dump predates its shadcn bump). Retired for
  byte parity — verified INERT live on both open paths (the click-open's
  programmatic focus is not :focus-visible; the keyboard-open focuses
  the first ITEM). The token-map arms (border-line/bg-surface/
  text-foreground) STAY — the documented s73 computed-equal mechanism,
  live-verified (the s86 border-input precedent).
- **D-113a3 (behavioral, UNPINNED)**: the mount-focus + keyboard model
  frozen as e2e expects INSIDE existing test() blocks (the census stays
  137) — the account menu's content focus + the ArrowDown first-item
  landing + the row menu's content focus.

The noise families adjudicated away: the ring-arms' string position
(the s86 ordering), the transparent-shadow prepends (the s112 v4
serialization noise), the token-map mechanism (s73/s86), the topbar
@390 arrangement (the s93 standing genus — the walk re-confirmed both
censuses exactly).

**The count ladder:** UNIT 1944 → 1946 (+2 — the MENU re-pin it + the
labels it, both in page-layout.test.ts) · SUITES 109 UNCHANGED · E2E
137 UNCHANGED · badge 2081 → 2083 · the page-layout census rows 1548 →
1559 + 183 → 185 checks.

**RED-first:** 16 failed | 190 passed (206) at the still-unfixed src +
the still-old docs (the 14 docs-counts count-axis its + the MENU it +
the labels it — enumerated by name; the plan predicted 15-18),
stash-proven (the two staged files → the native 204/204 → pop → 16
RED). One in-flight correction: the census literal drafted 1556 landed
at **1559** (the comments ran longer than drafted — the s112 genus).

**GATE:** lint 0/0 · tsc 0 · 1946/1946 unit [109 suites] · build ·
137/137 e2e + the four drift sweeps CLEAN (no re-baselining — the
label re-tag renders identically; the class retirement is
render-inert) + the closing census MATCH. The captures 180–183 (the
VLM battery). Docs at SKILL v1.110.0 + README badge 2083 +
AGENTS/CLAUDE/PAD at 1946+137 + session_237.md + the s113 plan + its
execution record + the worklog.

### Session-114 — the profile + settings Data-tab family LIVE re-walk + the three finds

The s113-close's three candidates scout-adjudicated: the chrome re-walk
ELIMINATED (the sidebar/topbar ride every pixel sweep at all four
viewports every session — the drift gates are its standing live walk);
the profile photo family and the settings Data-tab family walked as ONE
interlocked personal-workspace walk (four throwaway scripts, both apps,
1440×900 + 390×844, the standalone build on a scratch walk db). The
scout also settled the download axis in one pass: the three CSV
templates download md5-IDENTICAL on both apps; the reference's
zero-data exports are EMPTY files (the s26 verification re-confirmed;
ours dump the seeded rows per the s26-P4 bundle-decoded contract).

THE RESULT — near-complete live parity: the /Profile geometry
byte-identical at both widths (the grid 896×594/358×1236; the personal
card 589×594; the four side cards 283×224/98/98/98; the avatar 96/80 +
blue-100 + the stroke-2 user glyph; the camera 159×36; the nameGap 12)
+ the computed styles equal on every axis + the interaction battery
identical (the camera → filechooser on both; the upload POST + the
avatar preview swap + the toast; the save UNCONDITIONAL — disabledBefore
false on both, PATCH /api/users vs the reference's PUT
…/entities/User/me, the platform difference the documented s72
equivalent) + the Data tab cards byte-computed-equal (the Import +
Export 1120×160 both; the seven buttons identical; the tablist→panel
gap 24 both).

The finds: D-114a1 THE DANGER ZONE TEXT-SM RE-PIN (the reference's
CURRENT warning line carries text-sm — live-walked 14px/20px, the card
1120×240; ours rendered the bare class at 16px/24px, the card 244, the
+4px propagating the whole inner ladder; the s26 probe under-read it —
the s112 D-112a1 genus; the drift sweeps never see the Data tab —
text-sm joined SETTINGS_DANGER.desc for byte parity) + D-114a2 THE
PROFILE EMAIL/ROLE ID RE-PIN (the reference wires the BARE
htmlFor="email"/"role" + id pairs, the display_name pair already
matched; ours shipped profile-email/profile-role — retired at the four
profile-page sites, the s113 D-113a1 labels genus, no collision on the
route) + D-114a3 THE INTERACTION-BATTERY FREEZES (the camera/file-input
wiring pin + the email/role id pin, both in profile-family-parity, +2
its; the upload + save round-trip expects INSIDE the existing /Profile
e2e test — the census stays 137). The noise families adjudicated away:
the shadow transparent-prepends (s112), the side-chip span-vs-div +
inline-style (s73 computed-equal), the class orderings (s86), the
token-maps (s73/s86), the avatar radius 9999-vs-33554432 (the v3/v4
rounded-full genus), the Danger confirm-label association (ours the
a11y superset, the s112 D-112a2 genus — KEPT), the nameGap 12 (the s91
compensator validated), the reference's toast auto-dismiss timing.

The count ladder: UNIT 1946→1948 (+2, both its in
profile-family-parity.test.ts) · SUITES 109 UNCHANGED · E2E 137
UNCHANGED · badge 2083→2085 · the page-layout census row 1559→1566.
RED-first: 17 failed | 50 passed (67) at the still-unfixed src + the
still-old docs (the 14 docs-counts-family + the email re-anchor + the
labels it + the danger-desc re-anchor), stash-proven (the four staged
files → the native 65/65 → pop → 17 RED; the camera it a
staging-passing freeze pin — the s112 precedent; two staging lessons:
the stripComments regex eats accept="image/*" — pinned on the raw
source; the case-sensitive fileInputRef regex). The captures 184–187
(the VLM battery). Docs at SKILL v1.111.0 + README badge 2085 +
AGENTS/CLAUDE/PAD at 1948+137 + session_241.md + the s114 plan + its
execution record + the worklog.

### Session-115 — the Defaults-tab re-walk (two-app) + the insights-dialog family walk + the four freeze finds

The s114 close's three candidates scout-adjudicated: the settings
Defaults-tab editors walked TWO-APP (the first Defaults re-walk since
s81, 34 sessions — the s114 close listed it as un-walked, the s81
suite header the correction), the accounts detail surfaces walked
OURS-ONLY (the reference at its zero-data state renders "No accounts
found" — re-confirmed live; the insights dialog un-openable there, the
documented s73 genus, the s113 row-menu precedent), and the reports
tables DEFERRED to session 116 (the populated face ours-only at the
reference's zero-data; the s10 e2e structure tests + the s105 mobile
walk already hold the family's structure).

THE RESULT — zero real parity defects; four freeze finds. The Defaults
family in COMPLETE live parity on every computed axis at both widths
(the tab trigger 371×28/117×28; the card 1120×604/358×604; the header
1118×90 with the title DIV + the subtitle DIV 14px/20px/#737373; the
six groups — the labels byte-equal, the label→control gap 12 + the
control marginTop 8 on BOTH [the s14 controlMt compensator
live-validated], the four inputs + two triggers 1070×36/308×36 with
the values AED/new/B/3, the number input min/max-free [L-81c4
re-verified]; the select dropdown census 1072×74 + the options
Month/Week 1062×32; the interaction battery identical — choose Week →
the trigger swaps + the save round-trip, ours PUT /api/settings 200 vs
the reference's POST+GET+PUT+GET entity dance, the s72 platform
equivalent). The insights dialog (its FIRST live walk, against the
s28/s84 decoded contracts): the chrome rides the s112-verified stock
family (768 @1440 / full-bleed 390 with the p-6 children 340); the
header (text-xl title + industry + the green-100 badge 63×22); the
three stat cards 229×114/103×130 with the three icons; the segmented
tabs 237×28/111×28; the activities rows 718×66 with the 40×40
rounded-lg tinted icon boxes; the battery (the Contacts switch with
the avatar circles + the Open Deals empty state + the Escape close)
healthy at both widths.

The finds: D-115a1 THE DEFAULTS LABEL HTMLFOR/ID ASSOCIATION SUPERSET
(ours wires the six def-* pairs; the reference's six labels BARE
UNASSOCIATED — ours the a11y superset, the s112 D-112a2 camera genus
+ the s114 Danger-confirm precedent, KEPT + frozen in
settings-defaults-parity) + D-115a2 THE DEFAULTS INTERACTION-BATTERY
FREEZE (the Defaults-tab block inside the settings-mobile e2e guard —
the six-group census + the select round-trip with the restore, the
s114 state-pollution lesson applied) + D-115a3 THE INSIGHTS-DIALOG
BATTERY FREEZE (the open/switch/close expects inside the accounts ⋮
menu e2e test — the dialog never before opened by any e2e) + D-115a4
THE INSIGHTS SEGMENTED-VARIANT FREEZE (the variant/cols construction
in account-surfaces). The noise families adjudicated away: the header
mechanism (space-y-1.5 vs the arbitrary variant — the documented v4
house pattern), the token-maps (s73/s86), the input class ordering
(s86), the select-content shadow prepends (s112), the avatar radius
9999-vs-3.35544e+07 (the v4 rounded-full genus, s114), the mount-focus
(the Radix close-X default, no reference face).

The count ladder: UNIT 1948→1950 (+2 — the D-115a1 association pin +
the D-115a4 variant pin, both in EXISTING files) · SUITES 109
UNCHANGED · E2E 137 UNCHANGED (added expects, zero new its) · badge
2085→2087. RED-first: 14 failed | 73 passed (87) at the still-old docs
(the 13 docs-counts-family + the CLAUDE lockstep — enumerated by name;
the plan predicted 12-15), stash-proven (the native 85/85 → pop → 14
RED; both freeze its staging-pass, the s112 camera precedent). The
captures 188-191 (the VLM battery). Docs at SKILL v1.112.0 + README
badge 2087 + AGENTS/CLAUDE/PAD at 1950+137 + session_245.md + the
s115 plan + its execution record + the worklog.

**Session-116 (SKILL v1.113.0)** — the reports-tables family walk (the
116-c rotation on the s115 close's single remaining candidate — the
un-walked list's last name, THE LAST FAMILY: both apps driven through
/reports at 1440×900 + 390×844 with computed-style + census extraction,
login first on both, the zero-data tool on the scratch walk db, PORT
3141 the s115 precedent). THE ZERO-DATA FACE walked TWO-APP — COMPLETE
byte-equal parity on every computed axis at both widths: the five tab
triggers (texts byte-equal, 222×28 14px/500 each @1440 · 174×24 12px/500
@390 — the pill grid), the ten table heads byte-equal, the ten
CardTitles byte-equal (incl. "Top Deals by Value" + "Deals at Risk (No
Activity 14+ Days)"), the ten empty-state copies byte-equal, the empty
rows 14px/400 rgb(107,114,128) centered firstRowH 37 on both, the
card-height family byte-equal (the plain-header tables 167 at both
widths · the two pipeline tables' export-button headers 189 @1440 · the
phone title-wraps 215 + 247 @390), the chart-card census byte-equal
(titles + 548/357 widths + 390 heights + the Forecasting Accuracy
1120-wide row), docScrollW contained 1440/390 on both. THE POPULATED
FACE walked OURS-ONLY (the reference's zero-data genus, re-confirmed
live): the ten tables' seeded row contracts (Recent Won 4 · Top Deals 10
· Open Deals 6 · At Risk Deals 5 · Overdue 13 · By Owner 4 · Leads List
10 · Source Perf 5 · At Risk Accounts 2 · Account Summary 10 — the API
census at quarter AND all-time identical), the first cells 14px/500
rgb(10,10,10) font-medium, the outline Badge census (5 sites: topDeals
`closed_won` · openDeals `prospecting` · overdue `Meeting` · leadsList
`new` · accountSummary `active` — the STOCK chrome 12px/600, border
#e5e5e5, radius 6px, transparent bg), the red-tint rows (bg-red-50
rgb(254,242,242) on exactly 3 tables: dealsAtRisk + overdue +
atRiskAccounts), the red At Risk badge (bg red-100 rgb(254,226,226) /
text red-800 rgb(153,27,27)), the "18d ago" last-activity text, the
overdue date "MMM d, yyyy", the $87K revenue cell — every axis healthy
against the s27/s31/s74/s85 decoded contracts. ZERO src changes — the
two freeze finds: D-116a2 the ten-CardTitle + risk-construction census
pin [reports-tabcontent-parity — the titles never pinned as a set
("Top Deals by Value" in NO test assertion before); the outline-Badge
5-site + bg-red-50 3-site + red-badge 1-site census, read on the RAW
source] + D-116a1 the populated-tables e2e battery [INSIDE the existing
crm.spec reports test — the default-tab titles + row counts, the per-tab
row contracts + the badge texts + the red-tint classes + 18d ago + the
MMM d, yyyy PATTERN (the s18 time-bomb lesson — never a literal date);
the email-default lead folds into an existing source key so the tab-4
census holds; the census stays 137]. The count ladder: UNIT 1950→1951
(+1) · SUITES 109 UNCHANGED · E2E 137 UNCHANGED · badge 2087→2088.
RED-first: 13 failed | 45 passed (58) at the still-old docs (the 12
docs-counts-family + the CLAUDE lockstep — enumerated by name; the plan
predicted 12-15), stash-proven (the native 57/57 → pop → 13 RED; the
D-116a2 it staging-pass, the s112 camera precedent). The captures
192-195 (the VLM battery). Docs at SKILL v1.113.0 + README badge 2088
+ AGENTS/CLAUDE/PAD at 1951+137 + session_249.md + the s116 plan + its
execution record + the worklog.


### Session-117 (2026-10-13) — the accounts-list family walk (the stalest un-re-walked family, 31 sessions) + the three freeze finds

The rotation ledger's next name (the s86-era decode, never live-walked
two-app): both apps driven through /accounts at 1440×900 + 390×844
with computed-style + census extraction, login first on both, the
zero-data tool on the scratch walk db (PORT 3141, the s115/s116
precedent).

- **The ZERO-DATA face — COMPLETE two-app byte-equal parity** on every
  compared axis @1440 (the KPI row: 5 labels byte-equal, the zero
  values 0/0/0/$0.0M/0, the 12px/400 labels + 30px/700 values, the
  211px ×5 grid · the toolbar switcher · the 8 heads · the empty state
  "No accounts found" 14px/400 rgb(107,114,128) centered rowH 85 · the
  rail 320px/hidden-390). The 390 overflow face re-confirms the
  documented s95 genus 22 sessions on (the reference's bare flex-1
  lets its 472px card poke out, toolbar 440, MAIN h-scrolls 488; ours
  min-w-0 contains at 358/326 with the in-box scroll — visually
  equivalent, do NOT restructure).
- **The POPULATED face (ours-only, the reference's zero-data genus)** —
  every axis healthy: the KPI values 10/8/9/$77.5M/3 · the tier census
  9 Key + 1 A + the star census 9 · the health census 5/3/2 · the
  overdue 3× "1 Overdue" + the 4px red borders · the Key oklab tint ·
  the name-only predicate verified LIVE ("Logistics" → Sahara by NAME,
  "Finance" → the empty state) · the Cards view 3×240×10.
- **D-117a2** the five-KPI-label census pin [account-contacts-parity
  +1 it — the labels never pinned as a set, "Total Accounts" in NO
  test assertion before; the per-card trend/color adjacency + the arm
  census on the comment-stripped source: trend="up" ×4, color= ×6 (the
  sixth the Cards-view Avatar hex) — a fifth trend site or a seventh
  color site is a parity event].
- **D-117a1** the populated accounts e2e battery [expects INSIDE the
  existing crm.spec accounts test, the census stays 137: the five KPI
  values + the tier/star census + the three overdue rows + the
  Cards-view switch].
- **D-117a0** the F-117a2 wall-clock defuse [the 117-a audit's find:
  the "18d ago" literal was a 10:00-local time-bomb (the seed's d()
  anchor) — the bounded /^1[89]d ago$/ pattern; the Overdue 13 count
  shared the bomb via the two due-today seed rows — the 13-15 bounds;
  the first-row "Meeting" dependency retired to the card level; the
  tab-4 comment corrected (the Leads List is LEAD-derived, the :39
  lead IS row 1)]. Plus F-117a1 closed: the README Tested row's s116
  clause (missed at the s116 ship) shipped together with the s117
  clause.
- The count ladder: UNIT 1951→1952 (+1, an EXISTING file) · SUITES 109
  UNCHANGED · E2E 137 UNCHANGED · badge 2088→2089; RED-first
  13|1939(1952) stash-proven 1951/1951; GREEN 109/1952; RED-2 both
  faces by name; the captures 196-199 + the VLM battery.

### Session-118 (2026-10-14) — the dashboard-charts + leads-statcard family walk + the F-118a1/F-118a2 defuse

The s117 close's named candidates (the s74/s85-era surfaces, 30+
sessions stale): both surfaces walked in one interlocked pass — both
apps driven through / and /leads at 1440×900 + 390×844 with
computed-style + census extraction, login first on both, the zero-data
tool on the scratch walk db (PORT 3141, the s115/s116/s117 precedent).

The zero-data face walked TWO-APP in COMPLETE byte-equal parity on
every compared axis at both widths: the dashboard KPI row (6 labels
byte-equal, the zero values 0/$0.0k/$0.0k/$0k/0%/0, 14px/400 labels +
30px/700 values @1440 / 12px + 24px/700 @390, the 173.3px ×6 grid),
the 6 chart cards (titles/fonts/widths/SVG heights/zero-data censuses
byte-equal — the REAL chart at zero data on both), the Recent Deals 8
heads byte-equal, the leads statcards (6 labels byte-equal, the zero
values, 24px/700 values, the chip backgrounds blue-50/orange-50/
green-50/red-50/purple-50/cyan-50 byte-equal, the chip widths
40/40/40/34/32/32 byte-equal), the leads 9 heads byte-equal, docScrollW
contained on both apps at both widths. One diff adjudicated as the
documented s91 chart-noise genus (Revenue Over Time @390 gridline
count 26 vs 25 — the drift gate's phone floor authoritative).

The populated face walked OURS-ONLY (the reference's zero-data genus):
the dashboard KPIs 24/$337.0k/$126.0k/$0k+0%/29.2%/83 + the leads
statcards 24/9/7($687,000)/4($226,000)/29.2%/83 days — every value
seed-verified independently off the db. ZERO real parity defects.

The freeze finds (zero src changes): D-118a0 THE F-118a1/F-118a2
DEFUSE [the s117 accounts battery's own two exact "3" asserts were
10:00/14:00-local time-bombs — the seed pins activity dueAt to hour
10 + ownerIdx*2, the two due:0 rows join after their hours (Oasis
Healthcare @10:00, Emirates Global Trading @14:00), the KPI/rows read
3/4/5 by window; the baseline gate live-reproduced 136/137 post-14:00;
the bounded 3-5 counts, the D-117a0 idiom applied to the session's own
battery] + D-118a1 the populated batteries [INSIDE the existing leads
+ dashboard tests, the census stays 137: the six statcard values +
subValues + the Avg-Cycle SHAPE (the day-counter — never a literal)
+ the dashboard KPIs + the Revenue-This-Month in-test month
computation (the month-roller pinned exact at every run date)] +
D-118a2 the six-label + adjacency census pin [leads-statcard-parity
+1 it — the labels never pinned as a set, "Open Leads" in NO unit
label-set assertion before; the per-card icon/chipTone/subValue
adjacency + the six-chipTone arm census on the RAW source].

The count ladder: UNIT 1952→1953 (+1, an EXISTING file) · SUITES 109
UNCHANGED · E2E 137 UNCHANGED · badge 2089→2090; RED-first
13|1940(1953) stash-proven 49/49; GREEN 109/1953; RED-2 both faces
by name; the captures 200-203 + the verification battery.

### Session-119 (2026-10-14) — the contacts-list family walk + the primary-foreground re-pin + the mobile-list empty-state retirement

The s118 close's named candidates (the s27/s31-era derivations' home
surface — the contacts-list family, the s75-era decode 43+ sessions
stale): both apps driven through /contacts at 1440×900 + 390×844 with
computed-style + census extraction, login first on both, the zero-data
tool on the scratch walk db (PORT 3141, the s115-s118 precedent). The
walk scripts OUTSIDE the repo.

The zero-data face walked TWO-APP — COMPLETE byte-equal parity on
every compared axis at BOTH widths: the 4 statcards (labels, the zero
values 0/0/0/0, the trend "+0" green on exactly New This Month, the
chips bg-blue/green/amber/red-500 48px byte-equal, the gradient cards
268×142 @1440 / 326×122 @390), the toolbar, the 8 heads byte-equal
(the sort affordances + the default chevron on Last Activity), the
rich empty state byte-equal (rowH 201 both), the kke filter panel
byte-equal at BOTH widths (the 6 cards — Role 5 / Priority 3 /
Activity Status 1 / Company Size 3 / Source 5 / Engagement Level 3),
docScrollW contained. Noise adjudicated: the v4 oklab gradient
serialization. THE TWO REAL DEFECTS: F-119c1 the mobile-list
empty-state branch INVENTED (the LIVE reference renders the EMPTY
container — childN 0, probe-verified at both widths; the L-75c2-9
"bundle-decoded" reading wrong) + F-119c2 the primary-foreground
token genus SYSTEMIC (every reference blue primary computes #fafafa —
the shadcn stock hsl(0 0% 98%); ours #ffffff; sampled live on six
buttons).

The populated face walked OURS-ONLY (the reference's zero-data
genus): healthy on every decoded contract, every value seed-verified
off the db — the statcards 15/15(+15)/6/5 (the month-roller + the
day-roller documented), the table 15 rows + the priority 4/7/4 +
roles 3×5 + sources partner3/referral5/call2/website2/email3 + the
Key amber 4 + the ≥30d opacity 5 + the engagement bars 3/2/1×5, the
Pke slide-over (w500/full-bleed, the hero + tabs + info card), the
W7 edit dialog (w672, 7 fields, mount-focus on Name). One walk
lesson: at 390 the row-click center hits the stopPropagation
role-select cell — the mobile CARD click is the phone trigger.

The fixes + freezes: D-119a0 THE MOBILE-LIST EMPTY-STATE RETIREMENT
[src: the invented bare-p branch retired — the map only] + D-119a1
THE PRIMARY-FOREGROUND RE-PIN [src: #ffffff → #fafafa + the
design-tokens pin (+1 it) — all blue primaries + the dialog submits +
the emerald quick-log match the reference's own mechanism] + D-119a2
THE POPULATED CONTACTS E2E BATTERY [INSIDE the existing thin test,
the census stays 137: the statcards 15/15/6 + the bounded 5-7
day-roller count + the priority census + the slide-over + the W7
edit-dialog battery] + D-119a3 THE FOUR-LABEL + ADJACENCY CENSUS PIN
[contacts-family-parity +2 its: the labels never pinned as a set +
the icon/iconColor adjacency + the arm census + the retirement pin]
+ the F-119a1 EPOCH-GATE [the settings-debounce e2e's 9-session flake
lineage retired — the 119-a audit's root-cause: the pending→resolved
remount raced the fill].

The count ladder: UNIT 1953→1956 (+3, EXISTING files) · SUITES 109
UNCHANGED · E2E 137 UNCHANGED · badge 2090→2093; RED-first
15|1941(1956) stash-proven 1953/1953; GREEN 109/1956; RED-2 three
faces by name; the captures 204-207 + the verification battery.

### Session-120 (2026-10-14) — the leads interactive-table family walk (a clean walk, the pin-only session)

The rotation ledger's next-stalest name (the session_257 close's
named candidate — the s29-era leads interactive-table decode, ~91
sessions old, last rotated s77): both apps driven through /leads at
1440×900 + 390×844 with computed-style + census extraction, login
first on both, the zero-data tool on the scratch walk db, PORT 3141
the s115-s119 precedent, the walk scripts OUTSIDE the repo. THE
ZERO-DATA FACE walked TWO-APP byte-equal on every compared axis at
BOTH widths — the 9 table heads (cursor:pointer on EXACTLY Lead
Name/Email/Value + the static ArrowUpDown glyphs + the w-12 actions
header) · the Gke filter panel LIVE byte-equal (320×398, the 4
labels, the 286×36 comboboxes, the Clear/Save View 139×36 footer) ·
the (Active) suffix mechanics · the Save View native prompt + the
saved-views select · the Export client-side download byte-equal
(leads_ISO.csv + the UNQUOTED 8-col header) · the phone 390
hidden-column set + docScrollW contained — ZERO parity defects, the
DIFF reporter 0 diffs. THE POPULATED FACE walked OURS-ONLY (the
reference's zero-data genus): healthy on every decoded contract —
every value seed-verified off the db first + every mutation verified
back onto the db after (the 24-row census + the stage census with
the 4 blank negotiation/proposal Radix mirrors + the source census +
the L-77c9 raw code-unit sort LIVE + the Gke filters LIVE with data
+ the Export populated/filtered + the Save View applyView round-trip
+ the inline Value/Status/date round-trips + the overdue face LIVE +
the ⋮ Edit dialog / DEAD Convert / Delete + the phone 390 face on
the table's own overflow-auto scroll area) — 40/40 walk checks, ZERO
defects found.

The remediation — ZERO src changes: D-120a0 THE SORTHEAD
cursor-pointer CENSUS PIN (+1 it in leads-inline.test.ts — the th
class pinned NOWHERE before) + D-120a1 THE /LEADS EXPORT E2E CLICK
(inside the existing round-trip test, the census stays 137 — the
page's OWN Export button, the one call-site the e2e never exercised
directly) + D-120a2 the docs realignment + session_258 + the
captures 208-211.

The count ladder: UNIT 1956→1957 (+1, an EXISTING file) · SUITES 109
UNCHANGED · E2E 137 UNCHANGED · badge 2093→2094; RED-1 the
stash-proof (the class removed → the pin REDs alone) · GREEN
109/1957 · RED-2 the e2e header literal; the full suite 137/137; the
audits 120-a [9/9 Verified, zero real findings] + 120-b [9/9, ~78th
consecutive]; probe:ref the 91st STABLE, the four drift gates CLEAN,
scandihaven d4789c3 on-pattern.

### Session-121 (2026-10-14) — the photo-upload family walk + the standalone uploads-anchor fix

The intake: the fresh clone at `2c3ceca` (the operator's session_259.md
docs-only addition on top of the s120 ship); the environment re-standing
(bun install, `db:push` + `db:seed`, census MATCH, Playwright chromium
reinstalled after the workspace reset).

The baseline gate: lint 0/0 · tsc 0 · **109/1957 unit** · build ·
**e2e 137/137** (3.4m, zero flakes).

Both audits dispatched as subagents (the house pattern):
- **121-a (the s120→2c3ceca ship-delta + the photo pre-walk)**: **9/9
  shipped claims Verified, ZERO real findings** (the delta EXACTLY
  docs/session_259.md +158, docs-only; the counts/captures/pins
  coherent) + the photo-family pre-walk inventory (the unpinned residue:
  the mobile-card photo branch, the table-row conditional, the live
  computed faces, the 5MB hint, the in-flight faces, the uploads anchor
  chain; the seed ships ZERO photoUrl).
- **121-b (the standing layers, ~79th consecutive)**: **9/9 PASS** —
  record-only N-121b1 (the drawer-battery's hardcoded REPO path, stale
  after relocation), N-121b2/N-121b3.

The live verification: **probe:ref the 92nd STABLE** · the four drift
gates CLEAN (1440/390/768/1024) · scandihaven d4789c3 on-pattern.

The rotation (121-c): the **photo-upload family** (the s30-era surfaces
— the AAe contact-dialog photo section + the aCe profile flow + the
upload seam + the negatives), walked in the s118-s120 idiom (the
scripts OUTSIDE the repo, PORT 3141, the scratch walk db). The
ZERO-DATA face walked TWO-APP: **byte-equal on every compared axis at
BOTH widths — ZERO parity defects**, the seven v4 serialization genera
adjudicated noise (L-121c1 the rounded-full radius genus CONFIRMED —
ours calc-infinity vs the reference's 9999px, IDENTICAL 96×96 boxes,
the same effective circle@48px; the oklab gradient + alpha forms; the
shadow-composition zeros; the w-12 trio mechanism; the aria-label
superset; the reference's own CDN upload latency). The POPULATED face
walked OURS-ONLY: **65/65 checks** — every value seed-verified off the
db + every mutation verified back onto it (the upload/remove
round-trips with the in-flight faces LIVE via route-delayed uploads,
the non-image alert + toast negatives, the create-with-photo
persistence, the table-row + mobile-card photo branches, the W7
no-photo + Pke initial-only negatives, the profile round-trip with the
reload topbar pickup, the GET immutable/traversal probes).

**ONE REAL DEFECT — F-121c1, found live and FIXED (D-121a0)**: the
standalone server wrote uploads to `<repo>/.next/standalone/uploads`
(the EPHEMERAL build output, wiped by every rebuild) — the bundle's
VIRTUAL `import.meta.url`
(`<repo>/.next/standalone/src/lib/uploads.ts`) validated
`.next/standalone` as a repo root through its own traced
`prisma/schema.prisma` copy, and uploads.ts consulted the module
anchor FIRST (db-path's session-34 order already guards this trap).
The fix: the standalone-cwd anchor FIRST (the db-path mirror) + the
pure `repoRootFor(moduleUrl, cwd)` seam; pinned by the NEW
tests/uploads-path.test.ts (the trap fixture — stash-proven: the order
reverted alone REDs the trap pin alone); verified live by the PASS 2
re-run (65/65, the uploads at `<repo>/uploads`, the standalone
location EMPTY at every step).

The remediation: D-121a0 [src/lib/uploads.ts + tests/uploads-path.test.ts
(NEW, 4 its)] + D-121a1 the drawer-battery REPO derivation
(scripts/drawer-battery-390.ts — the N-121b1 fix, verified live: the
battery boots its own server, exit 0) + D-121a2 the both-avatar-carriers
pin (+1 it — the table row AND the mobile card, the lg:hidden face
pinned on NO axis before) + D-121a3 the profile 5MB-hint +
Uploading-ternary pins (+2 its) + D-121a4 the docs realignment +
session_260 + the captures 212-215.

The count ladder: UNIT 1957→1964 (+7 — 4 in a NEW file + 1 + 2 in
EXISTING files) · SUITES 109→110 (the NEW uploads-path suite) · E2E
137 UNCHANGED · badge 2094→2101; the TDD: the seam-first RED (the trap
pin RED on the module-first order) → the reorder GREEN → the
stash-proof (the order reverted alone → the trap pin REDs alone);
GREEN 110/1964; the audits 121-a [9/9] + 121-b [9/9, ~79th]; probe:ref
the 92nd STABLE; the full gate; the closing drift sweep CLEAN on all
four gates; census MATCH; src/ 2 files changed (uploads.ts +
drawer-battery-390.ts — the fix session, the s96/s107/s108/s109/s119
lineage).

### Session-122 (2026-10-15) — the settings-family walk (the Danger Zone + account-card arms, the pin-only session)

The intake: the fresh clone at `b15522c` (the s121 ship + the two
docs-only session logs); the environment re-standing (bun install,
`db:push` + `db:seed`, census MATCH, Playwright chromium reinstalled
after the workspace reset; scandihaven re-cloned at `d4789c3`
on-pattern).

The baseline gate: lint 0/0 · tsc 0 · **110/1964 unit** · build ·
**e2e 137/137** (3.4m; one first-run S72-P2 flake, clean on the
re-run — the known lineage).

Both audits dispatched as subagents (the house pattern):
- **122-a (the s121 ship-delta + the settings pre-walk inventory)**:
  **9/9 shipped claims Verified, ZERO real findings** + the pre-walk
  inventory (the unpinned residue enumerated: the AlertCircle icon,
  the reset-confirm wiring, the "Export Data" title, CSV_TEMPLATE_MIME,
  the zero-row EMPTY-export face, the chip label set, the h3/email
  literals, the Add-button wiring; the reset contract mapped — the
  POST /api/reset 7-table $transaction with users + settings
  surviving).
- **122-b (the standing layers, ~80th consecutive)**: **9/9 PASS** —
  record-only N-122b1/N-122b2/N-122b3; the D-121a1 drawer-battery REPO
  derivation verified working via its own spawn path.

The live verification: **probe:ref the 94th STABLE** · the four drift
gates CLEAN (1440/390/768/1024) · scandihaven `d4789c3` on-pattern.

The rotation (122-c): the **settings family — the Danger Zone arm +
the account-card arm** (the session_261 close's named candidate; the
s26-era data-tab surfaces ~96 sessions + the s72-era picklists + the
profile right-column cards), walked in the s115-s121 idiom with the
walk db riding BOTH zeroes (the standing zero-data tool + the 5
picklist arrays emptied — matching the reference's OWN settings state,
live-diagnosed "No items yet" ×5).

**PASS 1 (zero-data + zero-settings, two-app): ZERO PARITY DEFECTS —
0 diffs @1440 + 0 @390.** The shell + tabs + the three Data cards +
the Danger Zone census byte-equal; the config EMPTY face byte-equal
("No items yet" ×5 on BOTH apps); the account-card arm byte-equal (the
badge + the three chips); **the download contracts byte-equal** (the 3
CSV templates at 107/138/112 bytes + the 4 EMPTY exports at 0 bytes
with the singular_ISO filenames). The adjudicated noise: L-121c1
(radius, standing) + **L-122c1 the disabled-button cursor genus** (ours
pointer vs ref default on DISABLED buttons — both
pointer-events-none, the computed cursor never renders; enabled
buttons pointer on both).

**PASS 2 (populated, ours-only): 51/51** — the picklist CRUD
round-trips (db-verified), the populated exports (the raw-dump
contract: unquoted first-row-keys header + double-quoted values +
singular_ISO filenames), the account-card populated face, the Danger
Zone flow (the decline no-op + the accepted 7-table wipe with users +
settings surviving + the post-reset EMPTY export). **ZERO real parity
defects — the pin-only session (the s120 lineage).**

The remediation: D-122a0 the account-card arm pins [+3 its,
profile-family-parity] + D-122a1 the Danger-Zone surface pins [+2 its,
settings-data-tab] + D-122a2 the export title/MIME + EMPTY-face pins
[+2 its, settings-data-tab + csv-contract] + D-122a3 the picklist
Add-button pin [+1 it, settings-profile-parity] + D-122a4 the docs
realignment + session_262 + the captures 216-219.

The count ladder: UNIT 1964→1972 (+8, all in EXISTING files) · SUITES
110 UNCHANGED · E2E 137 UNCHANGED · badge 2101→2109; the TDD:
GREEN-first → the 5 stash-proofs (each pinned content reverted alone →
its pin REDs alone) → GREEN 110/1972; the captures 216-219 (four
unique md5s — 2e8ef6c7/ba31bd48/71677a69/dd2911e8, the tall-viewport
re-take riding the s120 internal-main-scroll workaround) + the VLM
battery 4/4 × 4 CLEAN.

### Session-123 (2026-10-15) — the reports export/PDF family walk (the six-fix session)

The intake: the standing clone refreshed at `b804b3d` (the s122 ship
`dd29078` + its session logs; `docs/session_263.md` the new intake —
its close naming the reports export/PDF flow, the calendar surfaces,
or a re-check; the export arm chosen: the first-named candidate AND
the staler — ~98 sessions since the s25 single-app live probe, never
two-app-walked).

The baseline gate: lint 0/0 · tsc 0 · **110/1972 unit** · build ·
**e2e 137/137** (3.3m, zero flakes).

Both audits dispatched as subagents (the house pattern):
- **123-a (the s122 ship-delta + the export pre-walk inventory)**:
  **9/9 shipped claims Verified, ZERO real findings** (the delta
  exactly the pin-only s122 ship: 19 files +739/−28, ZERO src; the
  +8 pins live in their suites; the counts/badge/md5s coherent) + the
  full export/PDF inventory (the two export mechanisms, the
  savedReport localStorage seam, the PDF nondeterminism mapping, the
  walk-harness notes).
- **123-b (the standing layers, ~81st consecutive)**: **9/9 PASS** —
  census MATCH, the drawer battery exit 0, design-tokens 16/16,
  vocabulary 6/6, config zero drift, the Tailwind v4 layer, metadata
  37/37, SEO live 6/6, the defect ledger intact; record-only
  N-123b1/b2/b3/b4.

The live verification: **probe:ref the 95th STABLE** (bundle md5
exact; demo data ZERO; the TRUE-390 defect STANDS) · the four drift
gates CLEAN (1440/390/768/1024, all 0.5% margin) — under the operator
`env -u DATABASE_URL` discipline after **F-123a1 surfaced** (the
platform's stale absolute DATABASE_URL override poisoning the
unguarded dev-server spawns; live-diagnosed at the sweep's OUR-login
timeout, root-caused to the Prisma CANTOPEN on the nonexistent
platform path, then guarded permanently in the remediation) ·
scandihaven `d4789c3` on-pattern (via git ls-remote — the API
rate-limited).

The rotation (123-c): **the reports export/PDF family** — the shell +
the filter-bar export duo + the Pipeline tab's per-table quartet + the
Save Custom Report View dialog, both apps at 1440×900 + 390×844, the
walk db riding the standing zero-data tool.

**PASS 1 (zero-data, two-app): SIX REAL PARITY DEFECTS** — F-123a1
the unguarded dev-server spawns · F-123a2 the reports CSV BOM (ours
57 bytes vs the reference's 54 — the s25 convention retired) · F-123a3
the per-table PDF geometry family (the reference's mm-anchored
constants decoded from its artifact stream and BYTE-EQUAL-verified
through the jsPDF mm probe: unit mm, margin 14mm, the title
Helvetica-NORMAL 16pt at (14,15), headers bold 9pt at 14+i×60 y32,
the line width = the default flush, NO rule at zero rows) · F-123a4
the dialog Save button's BLACK pair (#171717 — the DIALOG_SUBMIT
family) · F-123a5 the bar Export CSV's literal white pair · F-123a6
the v4 space-y trailing-margin genus (main scrollHeight 1545 vs 1521
— the PDF capture height axis the viewport gates cannot see).

**The POST-FIX re-run: 0 diffs @1440 + 0 @390** — the download
contracts BYTE-EQUAL (the barCsv 54/54 BOM-less, the per-table CSVs
byte-exact, the text PDFs SIZE-EXACT 3563/3559). **PASS 2 (populated,
ours-only): 42/42** — the export contracts db/API-verified + the
saved-reports round-trip on the localStorage seam.

The remediation: **D-123a0** the sweep + battery dev-spawn guards ·
**D-123a1** the BOM retirement (+ the e2e assertion in place) ·
**D-123a2** the PDF mm geometry · **D-123a3** the Save button's
DIALOG_SUBMIT pair · **D-123a4** the Export CSV literal pair ·
**D-123a5** the Tabs-wrapper mt-model (the space-y census re-anchored
108 → 107) · **D-123a6** the docs realignment + the captures 220-223.
The TDD ladder: RED-first (8 pins) → the six fixes → GREEN → the 6
stash-proofs (each reverted alone → its pin REDs alone) → **110/1980**
(+8, all in EXISTING files).

The final gate: lint 0/0 · tsc 0 · **110/1980** · build · **137/137
e2e** · the closing drift sweep CLEAN on all four gates · census
MATCH. **src/ 5 files + scripts/ 2 files changed** (the six-fix
session — the sweeps now run WITHOUT the env -u prefix, the guard is
the tools' own).

## Session-124 — the calendar family walk (the pin-only session)

The 124-c rotation — the session_265 close's named candidate: the
calendar surfaces (never two-app-walked; s108 was the ours-only seeded
390 e2e; the drift gates cover zero-data pixels only). Both apps
driven at 1440×900 + 390×844 through the shell + the KPI row + the
month card (the complete-weeks grid + the today pill) + the
never-walked filter rail (**the radio semantics LIVE-verified two-app
for the first time** — tomorrow checked → This Week checked → Tomorrow
CLEARS, both apps) + the New Event dialog + the month-nav round-trip,
the walk scripts OUTSIDE the repo, the walk db riding the standing
zero-data tool.

**PASS 1: ZERO REAL PARITY DEFECTS** (the third consecutive pin-only
lineage). The single divergent axis adjudicated L-124c1 noise: our
aria-label superset over the reference's unnamed icon-only nav
buttons. The byte-equal contracts: the KPI row, the month card (35
complete-weeks cells == the in-test expectation on both apps), the
rail (all 10 checkboxes), the radio/type-multi/Clear-All semantics,
the New Event dialog, the containment (mainScrollH 1182@1440 +
1750@390 — the L-123c5 axis). **PASS 2 populated ours-only: 44/44**,
every value db-verified (the KPI windows 2/12/3/1, the 12 chips, the
chip→Edit dialog, the Upcoming window slice(0,5), the Agenda
desc slice(0,10), the filter interactions, the create/delete
db-verified round-trip, the month-nav with data).

The remediation: **D-124a0..a6** the walk pins (+10 its,
activities-calendar-parity — the rail vocabularies, the Clear All
dual reset, the empty states, the header search, the KPI week
windows, the nav-trio a11y superset, the account-first related line,
the Phone ghost, the chip edit trio) · **D-124a7** the csvWithBom
dead-code retirement (the N-124a2 find — one src file) · **D-124a8**
the docs realignment + the captures 224-227.

The TDD: GREEN-first → the 10 stash-proofs (each reverted alone →
its pin REDs alone: 1|50 ×9 + 1|10) → **110/1991** (+11, all in
EXISTING files). The audits: 124-a 9/9 Verified (ZERO real findings)
+ the calendar pre-walk inventory; 124-b 9/9 PASS (the ~82nd
standing; the F-123a1 live-guard proof — the battery ran PLAIN,
EXIT=0). probe:ref the 96th STABLE · the four drift gates CLEAN ·
scandihaven d4789c3 on-pattern.

The final gate: lint 0/0 · tsc 0 · **110/1991** · build · **137/137
e2e** · the closing drift sweep CLEAN on all four gates WITHOUT the
prefix · census MATCH. **src/ 1 file + tests/ 3 files changed** (the
pin-only session + the dead-code retirement).

## Session-125 — the activities family walk (the LAST never-two-app-walked interactive family)

The 125-c rotation — the session_267 close's open decision resolved by
the staleness map: the **activities-list family** (the s124-calendar
genus: s109 was the ours-only seeded 390 mobile walk; the drift gates
screenshot /activities at four viewports every session but zero-data
PIXELS only; the reference last live-probed at the s6-s13-era DOM
audits ~116 sessions back). Both apps driven at 1440×900 + 390×844
through the shell + the quick-log quartet + the KPI sextet + the
segmented tab strip + the four empty states + **the never-walked
filter rail** (the Filters card + Save All + the 4 type checkboxes +
the Owner/Status selects + the More Filters (1) expander + the Filter
button) + the by-type card + the Log Activity dialog, the walk scripts
OUTSIDE the repo, the walk db riding the standing zero-data tool.

**PASS 1: ONE REAL PARITY DEFECT found and fixed — F-125c1 THE
SEGMENTED ACTIVE-PILL BG**: the active tab computed
`rgb(249,250,251)` on ours vs `rgb(255,255,255)` on the reference —
live-scoped four-way (ours + reference × /activities + /settings), the
tracks/inactive/geometry all byte-equal, ONLY the pill diverging. The
root cause: the reference's own construction rides
`data-[state=active]:bg-background` (resolving to ITS stock shadcn
white); our theme redefined `--colorbackground` to the page-bg
`#f9fafb` — the **F-119c2 inverted-token-mapping genus** — fixed with
the LITERAL `bg-white` (both segmented surfaces, live-verified
byte-equal post-fix). Plus L-125c2 the More Filters (1) expander
adjudicated noise (ours the functional superset over the reference's
dead stub). **PASS 2 populated ours-only: 49/49**, every value
db-verified (the KPI sextet == the db windows through the 7d range ·
the Overdue tab in the API order · the tab caps · the Timeline groups
· the by-type chips · **the FILTERED-BASIS cascade — the filters MOVE
the KPI values, the OPPOSITE of the calendar's RAW doctrine** · the
Save All restore · the toggle round-trip · the quick-log preset-rides-
the-submit create round-trip).

The remediation: **D-125a0** the active-pill fix (TABS_SEGMENTED,
src/lib/page-layout.ts) · **D-125a1** the pin (+1 it, page-layout,
RED-first) · **D-125a2..a6** the walk pins (+8 its,
activities-calendar-parity — the tab quartet + the empty quartet + the
KPI label sextet + the filtered-basis doctrine + the API order + the
quick-log preset + the toggle arms + the by-type vocabulary) ·
**D-125a7** the docs + the captures 228-231 + the VLM battery 4/4 × 4
CLEAN (231's badge-overlap flag ADJUDICATED a VLM misread — the
geometry probe: 8px gaps everywhere, docScrollW/mainScrollW 390/390).

The TDD: RED-first → the fix → GREEN → **the 9 stash-proofs** (each
reverted alone → its pin REDs alone) → **110/2000** (+9, all in
EXISTING files). The audits: 125-a 9/9 Verified (zero code findings) +
the full activities pre-walk inventory; 125-b 8/9 PASS — **F-125b1**
the platform DATABASE_URL poisoning the stand-up db:push/db:seed onto
the sandbox-root mirror (remediated by the env -u reseed; the walk-
harness lesson recorded). probe:ref the 97th STABLE · the four drift
gates CLEAN · scandihaven d4789c3 on-pattern.

The final gate: lint 0/0 · tsc 0 · **110/2000** · build · **137/137
e2e** · census MATCH. **src/ 2 files + tests/ 4 files changed** (the
active-pill fix + the walk pins + the lockstep carriers).

## Session-126 — the login-family second-cycle re-check (the first re-walk of the second rotation cycle)

The 126-c rotation — the session_269 close's named direction: **the
second rotation cycle begins — re-checks of the earlier walks (login
s111, dialogs s112, menus s113 the stalest)**, login chosen (15
sessions back; the source FROZEN since s111 but the LENSES sharpened
since: the F-119c2/F-125c1 inverted-token genus, the L-123c6
scrollHeight census, the live timings). Both apps driven at 1440×900
+ 390×844 through the FIVE-VIEW LADDER (signin → reset → sent →
signup → verify) + the wrong-password callout (1 attempt) + the
mismatch guard + the wrong-code rung (1 attempt) + THE AUTHED-VISITOR
CARD SERVICE (the S23-P2 first two-app live confirmation) + PASS 2
ours-only (the info-callout auto-dismiss ~3.4s + the db round-trip:
4 seeded + 3 walk signups = 7 users), the walk db a SEEDED copy, the
walk scripts OUTSIDE the repo. **330 axes, 24 raw diffs → THREE REAL
PARITY DEFECTS**:

1. **F-126c1 THE APOSTROPHE GENUS** — ours ships typographic
   `&rsquo;` where the reference ships straight ASCII `'` (the reset
   description, the sent view, the verify email line, the resend line
   — 4 source sites; never text-pinned before, the e2e assertions had
   ridden OUR curly forms).
2. **F-126c2 THE AUTH-INPUT TEXT COLOR** — ours `text-slate-900`
   `rgb(15,23,42)` vs the reference's `rgb(9,9,11)` ink on all 5
   censured inputs (the signin/reset/signup family; never censused
   before).
3. **F-126c3 THE CODE-INPUT BG** — the **F-125c1 inverted-token genus
   ON THE LOGIN SURFACE**: the verify code inputs' `bg-background`
   resolving to our page-bg `#f9fafb` vs the reference's stock white —
   invisible to every prior gate (the login surface is PRE-AUTH:
   invisible to probe:ref's post-login bundle AND to the drift gates'
   authenticated screenshots).

The adjudicated noise (record-only): **L-126c4** the code inputs'
aria-label superset (the L-124c1 a11y doctrine genus) · **L-126c5**
the body-bg invisible axis (the F-119c2 token semantics under a
full-cover gradient wrapper) · **L-126c6** the 1-unit ring/ink residue
(ours `#0a0a0a` vs the reference's `#09090b`, within the standing
fuzzy-2). **The byte-equal contracts: the s111 byte-matches ALL HOLD**
(the card heights 470/422 · 488/412 at both widths) + the full
five-view censuses + the error/sent callouts + the containment.

The remediation (the three-fix session): **D-126a0** the apostrophe
fix (4 sites + the 3 e2e assertions updated in place, the s123 BOM
precedent) · **D-126a1** the auth-input text-color fix
(`text-slate-900` retired from the 3 INPUT records — the typed ink
inherits `--color-foreground` `#0a0a0a`; the TITLES keep slate-900,
the reference's own) · **D-126a2** the code-input bg fix
(`bg-background` → `bg-white`, the D-125a0 literal doctrine,
byte-equal post-fix) · **D-126a3** the pins (+3 its,
login-family-parity, RED-first; the s79 code-arm pin re-anchored in
place, the D-125a1 doctrine) · **D-126a4** the docs + the captures
232-235 + the VLM battery 4/4 × 4 CLEAN (233 reading the STRAIGHT
apostrophes — the fix visibly confirmed).

The TDD: RED-first → the fixes → GREEN → **the 3 stash-proofs** (each
reverted alone → its pin REDs alone; the bg revert REDs both bg pins —
the s79 re-anchor + the new pin, the expected pair) → **110/2003**
(+3, all in EXISTING files). The audits: 126-a 9/9 Verified (zero
code findings + the full login pre-walk inventory); 126-b 9/9 PASS
(the ~84th standing — the drawer battery PLAIN 10/10, the SEO live
verified, the space-y census 107 exact). probe:ref the 98th STABLE ·
the four drift gates CLEAN · scandihaven `d4789c3` on-pattern.

The final gate: lint 0/0 · tsc 0 · **110/2003** · build · **137/137
e2e** (the S72-P2 first-run flake clean on the re-run, the s122
lineage) · THE POST-FIX WALK RE-RUN 4 adjudicated diffs ONLY (body-bg
×2 + aria-label ×2 — ZERO real defects) · the closing drift sweep
CLEAN on all four gates · census MATCH. **src/ 3 files + tests/ 3
files changed** (the three fixes + the walk pins + the lockstep
carriers). The walk-harness lessons recorded: L-126c7 the pydantic
reserved-TLD rejection (walk emails must use plausible domains) ·
L-126c8 the oklab inverse (the cube goes AFTER the linear transform —
cubing first produced phantom 5-unit diffs) · L-126c9 the via-stop
50% serialization · L-126c10 the zero-extent shadow layers.

## Session-127 — the dialog-family second-cycle re-check (the two-fix session)

The 127-c rotation — the session_270/271 close's named direction: **the
second rotation cycle continues — dialogs s112 and menus s113 the
stalest re-checks**, dialogs taken (15 sessions back; the create-dialog
core FROZEN since s92 — entity-dialogs.tsx untouched, entity-edit-dialog
since s91, ui/dialog.tsx since s71 — but the LENSES sharpened since:
the F-126c1 TEXT-CONTENT census, the F-119c2/F-125c1 token-ride census
on every input surface, the L-123c6 scrollHeight census). **The PHASED
walk** (L-127c5: the sandbox reaps background processes at command end
AND the 10-min tool cap bounds one invocation — one app×viewport per
invocation, the censuses persisted to /tmp JSON, the reference's
storageState persisted + reused: ONE login total): both apps at
1440×900 + 390×844 through the s112 CREATE-dialog ladder (New Lead ·
New Account · New Contact · Import Contacts · New Event · Log Activity
[the Log Call quick-log preset] · Save Custom Report View), the
JS-click fallback for the reference's own contacts-header 390 overflow
(L-127c6: its action row nowrap — Import at x=407, New Contact at
x=477 in a 390px frame, its phone-defect family; our header wraps —
the e2e zero-overflow superset). **1154 axes, 8 raw diffs → TWO REAL
PARITY DEFECTS**:

1. **F-127c1 THE CONTACT-DIALOG PLACEHOLDER FAMILY** — the reference's
   Create New Contact ships placeholders on Email/Phone/Company/
   Position (`john@company.com` · `+1 (555) 000-0000` · `Acme Inc.` ·
   `Sales Manager`) where ours shipped none (the Name field's
   `John Doe` matched on both); the s76 bundle decode missed them, the
   live DOM census found them — **the F-126c1 genus: the DOM text
   verbatim, not the decoded bundle, is the ground truth**.
2. **F-127c2 THE IMPORT-SUBMIT COLOR** — the Import Contacts dialog's
   submit computing rgb(37,99,235) on ours (the bare default Button,
   blue-600) vs the reference's rgb(23,23,23) (the bg-neutral-900
   DIALOG_SUBMIT family its entity siblings ride); never censused
   before — the s26 footer pin covered copy + gating, not the color
   class.

The adjudicated noise (record-only): **L-127c3** the contact dialog's
absolute-button radius `3.35544e+07px` vs `9999px` (the L-121c1
rounded-full genus — the walk's own normRadius misses the scientific
notation) · **L-127c4** the camera `aria-label="Upload photo"`
superset (the D-112a2 doctrine). **The byte-equal contracts: the s112
byte-matches ALL HOLD** — the content rects on all 7 dialogs × 2
viewports · the overlay · the titles · the close X · **THE FULL TEXT
CENSUS on 6/7 dialogs** · every input's computed bg/border/color (the
F-125c1 lens — the dialog inputs ride bg-transparent, CLEAN) · the
combobox triggers · the footer buttons on 6/7 · the tinted boxes ·
**THE SCROLL CENSUS** (the L-123c6 genus CLEAN on the dialog family) ·
the MOUNT-FOCUS tags (the D-112a3 freezes hold) · **THE TRIGGER
CENSUS** (the blue CREATE primaries' text color — the F-119c2 #fafafa
carrier computes EQUAL live, the s119 fix live-confirmed on the dialog
surface).

The remediation (the two-fix session): **D-127a0** THE CONTACT
PLACEHOLDER FIX (entity-dialogs.tsx ×4) · **D-127a1** THE
IMPORT-SUBMIT NEUTRAL FIX (contacts-page.tsx — the Import button gains
`className={DIALOG_SUBMIT.button}`) · **D-127a2** THE PINS (RED-first:
the page-layout placeholder pin re-anchored six → TEN in place + the
import-dialog +1 it — the DARK-NEUTRAL family pin with the bg-primary
negative) · **D-127a3** the POST-FIX walk re-run + the captures 236-239
+ the VLM battery 4/4 × 4 CLEAN (236 reading the four placeholders
verbatim — the F-127c1 fix visibly confirmed; 237 reading the Import
button dark charcoal, not blue — the F-127c2 fix visibly confirmed) ·
**D-127a4** the docs realignment.

The TDD: RED-first (the 2 pins failed at the standing source, the 194
neighbors green) → the two fixes → GREEN (196/196) → **the 2
stash-proofs** (each fix reverted alone → its pin REDs alone) →
**110/2004** (+1 it; the placeholder pin an in-place re-anchor). The
audits: 127-a 9/9 Verified (zero real findings + the full dialog
pre-walk inventory — the recommended walk axes all executed); 127-b
9/9 PASS (the ~85th standing — the drawer battery PLAIN 10/10, the SEO
live verified, the space-y census 107 exact). probe:ref the 99th
STABLE + the four drift gates CLEAN · scandihaven `d4789c3` on-pattern.

The final gate: lint 0/0 · tsc 0 · **110/2004** · build · **137/137
e2e** (the S72-P2 first-run flake clean on the re-run, the s122
lineage) · **THE POST-FIX WALK RE-RUN 4 adjudicated diffs ONLY (the
radius pair + the aria pair — ZERO real defects; the two fixes
live-verified byte-equal)** · the closing drift sweep CLEAN on all
four gates · census MATCH. **src/ 2 files + tests/ 4 files changed**
(the two fixes + the two pins + the lockstep carriers). The captures
236-239 (four unique md5s f2a28c2f/c62033de/2174cd93/6f1255a6).

**The next-session suggestion**: the second rotation continues —
**menus s113 is now the stalest re-check**. The s127 lens additions to
carry: the TEXT-CONTENT census (now proven twice — the apostrophe
genus + the placeholder genus) and the SUBMIT-COLOR census on every
dialog footer (the F-127c2 genus).

## Session-128 — the menu/popover-family second-cycle re-check (the one-fix session)

The 128-c rotation — the session_273 close's named direction: **menus s113
now the stalest re-check** (15 sessions back; the family source FROZEN
since s113 — topbar.tsx since s93, dropdown.tsx since s73, leads-page.tsx
since s113 itself — but the LENSES sharpened since: the F-126c1
TEXT-CONTENT census, the F-127c2 SUBMIT-COLOR census, the F-119c2/F-125c1
token-ride census). **The PHASED walk** (walk19, the L-127c5 doctrine:
one app×viewport per invocation, the censuses persisted to /tmp JSON, the
reference's storageState persisted + reused — ONE login total): both apps
at 1440×900 + 390×844 through the s113 menu ladder — **THE ACCOUNT MENU**
(the trigger census + the open content geometry + computed family + the
ITEM census + the mount-focus + the KEYBOARD MODEL + the text census +
Escape) + **THE LEADS FILTERS POPOVER** (the trigger + the panel geometry
incl. the @390 collision FLIP-UP + the four LABELs + the two selects +
the two inputs + the four buttons + THE FULL TEXT-CONTENT census + the
scroll census + Escape) + **THE ROW MENUS ours-only** (leads/contacts/
accounts — the `row.` namespace, 90 axes, the s73 bundle decode the
contract). **298 two-app axes, 4 raw diffs → ONE REAL PARITY DEFECT**:

1. **F-128c1 THE MENU-ITEM HIGHLIGHT INK** — the keyboard-highlighted
   item computing rgb(10,10,10) on ours (`focus:text-foreground`) where
   the reference computes rgb(23,23,23) (its accent-foreground #171717) —
   **the M-81c2 genus on the DropdownMenu family**: the Select family's
   items were live-walked at s81 and fixed to the pair
   `focus:bg-line-soft focus:text-neutral-900` (select.tsx:113, the s80
   badge precedent); the menu family's HIGHLIGHTED ink was never censused
   before (the s113 keyboard census measured only the #f5f5f5 wash bg —
   which byte-matches STILL). The resting ink inherits #0a0a0a on both
   apps; only the focus wash's TEXT arm diverged.

The adjudicated noise (record-only): **L-128c2 the s93 standing genus**
(the @390 account trigger x=290 ours RIGHT — beside our deliberate
hamburger — vs the reference's x=16 LEFT: its search wrapper
`display:none` at 390 leaves its right group the SOLE flex item →
flex-START, an accident of its own construction; "do NOT restructure to
chase the accidental left-placement"; both triggers 84×36, both menus
128×74 at y=56). **The byte-equal contracts: the s113 byte-matches ALL
HOLD** — the account-menu content geometry @1440 + the content computed
family + the item census ([A/Profile href="/Profile", DIV/Logout]) + the
mount-focus + the #f5f5f5 wash + **THE FILTERS POPOVER FAMILY COMPLETE**
(the panel + the four LABEL tags + the two select token-rides + the two
input placeholders [All Status/All Sources/0/none] + the four buttons'
colors — the F-127c2 lens CLEAN + THE FULL TEXT-CONTENT census — the
F-126c1 lens CLEAN) + the row-menu ours-only contract (the three trios).

The remediation (the one-fix session): **D-128a0** THE HIGHLIGHT-INK FIX
(page-layout.ts:986 — MENU_ITEM `focus:text-foreground` → the literal
`focus:text-neutral-900`) · **D-128a1** THE PIN (RED-first: +1 it
page-layout — the neutral-900 positive + the focus:text-foreground
negative) · **D-128a2** the POST-FIX walk re-run + the captures 240-243 +
the VLM battery 4/4 × 4 CLEAN (240 reading the highlighted Profile item;
241 the Filters popover labels verbatim; 242 the red Delete; 243 the 390
right-aligned arrangement) · **D-128a3** the docs realignment (SKILL
v1.125.0 + the README badge 2142 + AGENTS/CLAUDE/PAD + the line-census
1583 — the pre-existing s125/s126 drift corrected in the same stroke +
the Appendix B + the layer-axis pin advanced to the s128/s127 pair).

The TDD: RED (the pin failed alone at the standing source, the 2004
neighbors green) → the one-line fix → GREEN (187/187) → **the stash-proof
(the fix reverted alone → its pin REDs alone)** → **110/2005** (+1 it).
The audits: 128-a 9/9 Verified (zero real findings + the full menus
pre-walk inventory — the family source static since s113, the drift risk
entirely the theme layer) + 128-b 11/11 PASS (the ~86th standing — the
drawer battery PLAIN, the SEO live verified, the space-y census 107
exact, zero findings; the L-128b1 hygiene note: sweep stray servers by
the `next-server` comm). probe:ref the 100th STABLE + the four drift
gates CLEAN · scandihaven `d4789c3` on-pattern.

The final gate: lint 0/0 · tsc 0 · **110/2005** · build · **137/137
e2e** · **THE POST-FIX WALK RE-RUN 2 adjudicated diffs ONLY (the
L-128c2 s93-genus position pair — ZERO real defects; the highlight-ink
axis byte-equal rgb(23,23,23) on both apps at both viewports)** · the
closing drift sweep CLEAN on all four gates · census MATCH. **src/ 1
file + tests/ 2 files changed** (the fix + the pin + the lockstep
carriers). The captures 240-243 (four unique md5s
c840bff6/37990eaf/46756d0d/6907665c). The walk-harness lesson: **L-128c3
the Playwright hasText regex whitespace genus** (the regex form matches
the RAW textContent — icon-bearing buttons carry leading whitespace and
the regex never matches; STRING hasText substring matching is the
cross-app idiom).

**The next-session suggestion**: the second rotation cycle's stalest
re-checks now — the s114 profile + settings Data-tab family (14 sessions
back) or the s115 defaults + insights family; carry the F-128c1 lens
addition: **the HIGHLIGHTED-STATE computed census on every interactive
surface** (the focus/active/data-highlighted states, not just the
resting computed family).

## Session-129 — the profile/Settings-Data family second-cycle re-check (the three-fix session)

The 129-c rotation — the session_275 close's named direction: **the s114
profile + settings Data-tab family the stalest re-check** (15 sessions back;
the family source FROZEN since s114), carrying the NEW **F-128c1
HIGHLIGHTED-STATE computed census** (the focus/active/data-highlighted
states — the state axis every prior walk under-measured). **The PHASED
walk** (walk20, the L-127c5 doctrine): both apps at 1440×900 + 390×844
through the s114 ladder — **THE /PROFILE FAMILY** (the geometry + the
personal card family + the form fields + the side cards + the badge + THE
FULL TEXT-CONTENT census + THE HIGHLIGHTED-STATE census + the interaction
battery) + **THE SETTINGS DATA-TAB FAMILY** (the segmented tablist + THE
ACTIVE PILL + **THE FOCUS-VISIBLE RING CENSUS** + the Import/Export cards +
the seven buttons + the Danger Zone trio + THE FULL TEXT-CONTENT census +
THE DOWNLOAD CONTRACTS). **700 two-app axes, 30 raw diffs → THREE REAL
PARITY DEFECTS — the highlighted-state lens's maiden run found all three:**

1. **F-129c1 THE SEGMENTED RING-OFFSET INK** — `ring-offset-background`
   resolving to OUR page-bg `#f9fafb` where the reference's resolves to
   its stock white `#ffffff`; live-confirmed TWICE (the resting
   `--tw-ring-offset-color` AND the real focus-visible halo
   `rgba(249,250,251,1)` vs `rgb(255,255,255)`, both viewports). **The
   F-119c2 inverted-token genus's THIRD arm** (s119 primary-foreground ·
   s125 active-pill bg · s129 the offset arm). Fix: the class RETIRED at
   the three visible-offset rides (TABS_PILL.trigger + TABS_SEGMENTED.
   trigger + the tabs PANEL_BASE) — the s11 DIALOG_CLOSE
   computed-contract precedent (the v4 default offset color #fff is
   byte-equal with the class absent; the SELECT_TRIGGER's offset-0 ride
   is the zero-extent no-op, untouched).
2. **F-129c2 THE DESTRUCTIVE HOVER** — ours the SOLID `rgb(220,38,38)`
   (`hover:bg-red-600`) vs the reference's `rgba(239,68,68,0.9)` ALPHA —
   the M-80c1 genus on the destructive variant. Fix:
   `hover:bg-danger/90`.
3. **F-129c3 THE OUTLINE HOVER TEXT** — ours `rgb(10,10,10)` (no
   hover:text arm) vs the reference's `rgb(23,23,23)` (its stock
   `hover:text-accent-foreground` #171717) — the F-128c1 value pair.
   Fix: `hover:text-neutral-900` (the s80 badge precedent).

The adjudicated noise: L-129c4 the invisible outline axis (both
non-rendering) · L-129c5 the disabled-cursor axis (pointer-events-none) ·
L-129c6 the s73 span-vs-div chip genus. **The s114 byte-matches ALL HOLD**
— the geometry family, the D-114a2 ids, the placeholder set, the s125
active pill, the panelGap 24, the Data cards, the seven buttons, the
D-114a1 desc, the Danger chrome, BOTH text censuses, the template
downloads md5-IDENTICAL, the complete interaction battery.

The remediation: **D-129a0** the ring-offset retirement · **D-129a1** the
destructive alpha · **D-129a2** the outline hover-text · **D-129a3** THE
PINS (RED-first: the 2 TABS re-anchors + 3 new its; the 3 stash-proofs) ·
**D-129a4** the POST-FIX walk re-run (698 axes, 21 adjudicated diffs ONLY
— ZERO real defects; the halo byte-equal `rgb(255,255,255)` both apps
both viewports) + the captures 244-247 (four unique md5s
619ae301/43c2d540/b0ce2cec/807d7535) + the VLM battery 4/4 × 4 CLEAN
(246 reading the PURE-WHITE halo) · **D-129a5** the docs realignment (SKILL
v1.126.0 + the README badge 2145 + AGENTS/CLAUDE/PAD + the line-census
1600/190 + the layer-axis pin advanced to the s129/s128 pair + the repo
worklog's Session-128 gap repair + session_276.md + the plan).

The TDD: RED (the 5 pins failed alone at the standing source) → the three
fixes → GREEN (293/293) → **the 3 stash-proofs** → **110/2008** (+3 its).
The audits: 129-a 9/9 Verified (zero real findings + the full profile
pre-walk inventory — the named latent ring-offset risk live-confirmed) +
129-b 11/11 PASS (the ~87th standing). probe:ref the 101st STABLE + the
four drift gates CLEAN · scandihaven `d4789c3` on-pattern.

The final gate: lint 0/0 · tsc 0 · **110/2008** · build · **137/137 e2e**
· the closing drift sweep CLEAN on all four gates · census MATCH. **src/ 3
files + tests/ 3 files changed** (page-layout.ts + button.tsx + tabs.tsx;
page-layout.test.ts + docs-counts.test.ts + dialog-geometry-parity.test.ts).
The walk-harness lessons: **L-129c7 the evaluate-closure trap** (the
serialized callback cannot reference outer-scope helpers) · **L-129c8 the
hidden-panel locator** (filter `[data-state="active"]`) · **L-129c9 the
ancestor-climb bounds** (terminal conditions or the climb escapes to the
page root).

**The next-session suggestion**: the second rotation cycle's stalest
re-checks now — the s115 defaults + insights family (14 sessions back);
carry the highlighted-state lens standing (the ghost/secondary/default
variants' hover arms are the unaudited remainder; the pill-tab surfaces'
focus states never live-censused).

## Session-130 — the defaults + insights family second-cycle re-check (the one-fix session)

The 130-c rotation — the session_277 close's named direction: **the s115 defaults +
insights family the stalest re-check** (15 sessions back; the family source FROZEN
since — settings-page.tsx since s82, account-insights-dialog.tsx since s84,
accounts-page.tsx since s90), carrying the standing lenses + the session_277 close's
named remainder: **the ghost/secondary/default variants' hover arms never audited**
(the 130-a inventory's named latent risks L-130a1/a2, the ghost the TOP).

**The walk** (walk21, the phased idiom — one app×viewport per invocation, the
censuses to /tmp JSON, the reference's storageState persisted + reused, ONE
reference login, PORT 3141, the walk db zero-data for PASS 1 / SEEDED for PASS 2):
both apps at 1440×900 + 390×844 through the s115 ladder — **THE SETTINGS
DEFAULTS-TAB FAMILY** (the segmented strip + the ACTIVE pill + the card + the six
groups + the values AED/new/B/3 + the placeholder census + **THE
HIGHLIGHTED-STATE CENSUS** + **THE SELECT DROPDOWN CENSUS** incl. the
data-highlighted wash + the full text-content census) + **THE ACCOUNTS-PAGE OPENER
SURFACES** (the toolbar + **New Account default resting+HOVER** + **the rail's
Save All ghost resting+HOVER** + the empty state) + **PASS 2 OURS-ONLY SEEDED**
(**THE INSIGHTS-DIALOG FAMILY** with the post-s129 halo + the row-menu surfaces +
the Defaults interaction battery with the PUT 200 asserted). **439 two-app axes, 31
raw diffs → ONE REAL PARITY DEFECT:**

1. **F-130c1 THE GHOST HOVER TEXT** — ours rgb(10,10,10)
   (`hover:text-foreground`) vs the reference's rgb(23,23,23) (its stock ghost's
   `hover:text-accent-foreground` #171717). Live-walked TWO-APP on the accounts
   rail's **Save All** ghost @1440 (the hover bg byte-equal rgb(245,245,245) both
   apps — only the TEXT arm diverged); corroborated ours-side on the ⋮ row-menu
   ghost. **The F-128c1/F-129c3 value pair on the GHOST variant — the genus's
   third consecutive session** (s128 the menu-item ink · s129 the outline hover
   text · s130 the ghost hover text); the 130-a named TOP risk L-130a1,
   live-confirmed exactly where named. Fix: `hover:text-foreground` →
   `hover:text-neutral-900` (the s80 badge precedent).
2. **L-130a2 THE DEFAULT-VARIANT SOLID HOVER — CLEAN**: `newAccHover.bg`
   rgb(29,78,216) BOTH apps byte-equal — the reference's own default hover IS the
   solid darker step; the M-80c1 alpha genus does NOT ride its blue primaries.
3. **L-130a4 THE INSIGHTS TABS POST-s129 HALO — CLEAN**: the insights dialog's
   active trigger boxShadow carries `rgb(255,255,255) 0px 0px 0px 2px` — the s129
   ring-offset retirement live-verified on this never-re-walked surface.

**The adjudicated noise (30 axes)**: the 6 `labelFor` pairs (the D-115a1 frozen
a11y superset) · the 6 tab `ringOffset` (#fff vs hsl(0 0% 100%) — the s129
FORMAT-ONLY residual) · the 5 select `ringOffset` (the L-130a3 offset-0 invisible
genus, named up front) · the 2 `tabHalo.outline` (the L-129c4 invisible-outline
genus — **VISUALLY DISPROVEN: the focused-trigger screenshots of both apps are
md5-IDENTICAL** 1b10ec4a…; the platform's globally-authored outline-color
serializes solid/medium under :focus-visible but paints NOTHING) · the 2
`export.cursor` (the L-129c5 disabled-cursor genus). **The s115 byte-matches ALL
HOLD** — the Defaults family complete + the accounts openers + the insights
dialog family + the select dropdown with the highlighted wash byte-equal + the
interaction battery (the Week round-trip PUT 200 + the restore).

The remediation: **D-130a0** the ghost hover-text fix (button.tsx) · **D-130a1**
the pin (RED-first: +1 it page-layout — the session-130 describe; the s17 ghost
pin re-anchored IN PLACE with the base-color negative; the stash-proof — the fix
reverted alone → BOTH ghost pins RED alone) · **D-130a2** the POST-FIX walk
re-run (439 axes, 30 adjudicated diffs ONLY — ZERO real defects; the ghost hover
byte-equal rgb(23,23,23) both apps) + the captures 248-251 (four unique md5s
c31a92f5/d02b144e/f637c507/51deafca) + the VLM battery 4/4 × 4 CLEAN · **D-130a3**
the docs realignment (SKILL v1.127.0 + the README badge 2146 + AGENTS/CLAUDE/PAD +
session_278.md + the plan + the repo worklog).

The TDD: RED (the pin failed alone at the standing source, the 2008 neighbors
green) → the one-line-class fix → GREEN (191/191 the file battery) → **the
stash-proof** → **110/2009** (+1 it; the docs-counts lockstep realigned across
its sites + the dialog-geometry CLAUDE carry-forward + the F-106a1 session-130
layer pin). The audits: 130-a 9/9 Verified (zero real findings + the full
defaults/insights pre-walk inventory — the named latent risks walked and
confirmed) + 130-b 9/9 PASS (the ~88th standing). probe:ref the 102nd STABLE +
the four drift gates CLEAN · scandihaven d4789c3 on-pattern.

The final gate: lint 0/0 · tsc 0 · **110/2009** · build · **137/137 e2e** · the
closing drift sweep CLEAN on all four gates · census MATCH. **src/ 1 file +
tests/ 3 files changed** (button.tsx; page-layout.test.ts + docs-counts.test.ts +
dialog-geometry-parity.test.ts). The walk-harness lessons: **L-130c2 the
hidden-rail hover guard** (count()>0 can still be display:none — isVisible()
before hover()) · **L-130c3 the dual-dialog strict violation** (the mobile-nav
drawer carries role=dialog INERT at every width — scope to [data-state=open]) ·
**L-130c4 the programmatic-focus halo wash** (Tab+focus() matches :focus-visible
per matches() but did not paint the ring layers this run — pair the property read
with the shadow read). The residual genus arms (record-only, no reference
surface): the toast close X · the Tabs underline variant (dead code) · the
mobile-nav trigger.

**The next-session suggestion**: the second rotation cycle's stalest re-checks —
the toast close X is the F-128c1 genus's named residual arm (a future walk that
live-censuses the reference's toast X settles it); the highlighted-state lens
stays standing; the genus is three-for-three on the interactive variants — any
remaining `hover:text-foreground`/`focus:text-foreground` ride is suspect until
proven otherwise.

## Session-131 — the toast family walk (the two-fix session)

The 131-c rotation — the session_278/279 close's named direction: **the toast close
X, the F-128c1 genus's named residual arm** (a walk that live-censuses the reference's
toast X settles it). The 131-a pre-walk inventory: the family source FROZEN since the
s7 scaffold (123 sessions), the close X's `hover:text-foreground` at :123 the named
TOP risk L-131a1, the inert animation family at :107 a REAL finding L-131a5.

**THE HEADLINE — F-131c1 THE REFERENCE'S TOAST SYSTEM IS DOM-DEAD**: the bundle (md5
`a70a637f…`, stable across 103 probes) carries exactly FOUR toast calls — all
profile-page ("Photo uploaded successfully" / "Failed to upload photo" / "Profile
updated successfully" / "Failed to update profile") — but ZERO toast elements render.
The systematic hunt (all live, authed, the JWT-verified storageState): the upload
path's `rt.integrations.Core.UploadFile` now returns **402 (Payment Required)** — the
platform's metered integration quota exhausted — and even the decoded
`catch { Ix.error(...) }` path renders nothing; the Save round-trip PATCHes
successfully (the reload fires — the success path confirmed) and its toast renders
nothing; the document-wide `querySelectorAll("*")` hunt for
sonner/toast/live/status/notification markers found ZERO elements; the
MutationObserver across the save window logged ZERO added nodes. The historical
"sonner toasts" records (s30/s35) were bundle-decode conclusions; no prior walk ever
sighted the reference's toast DOM. **Our toast system is a DELIBERATE SUPERSET
construction** (the mobile-nav doctrine) — there is no reference face to parity
against, and the F-128c1 close-X axis cannot be settled two-app. The genus stands
three-for-three on real surfaces (s128 menu-item · s129 outline · s130 ghost).

**The ours-side census (walk22, the phased idiom — the profile photo upload trigger,
NO Save click ⇒ no mutation; both apps at 1440×900 + 390×844)**: the viewport `fixed
top-0 z-[100] … sm:bottom-0 sm:right-0 md:max-w-[420px] p-4 gap-2` (live-censused
bottom-right @1440 — the card 388×52 anchored 16px from both edges — and
top-full-width @390) · the card `rounded-xl border p-3.5 shadow-lg` (radius 12px,
padding 14px, the two-layer lg shadow) with the success border rgb(167,243,208) ·
the icon 18×18 rgb(16,185,129) · the title 14px/500 rgb(10,10,10) · **the X 22×22
resting rgb(156,163,175) → HOVER rgb(10,10,10) + rgb(245,245,245)** · the timing
4126/4118ms (the 4000ms contract) · the hover-pause holds at 6.5s + dismisses ~4.1s
after the unpause · the max-4 cap (4 cards after 5 pushes, the stack gap 8px) · the
error variant border rgb(254,205,211) + icon rgb(239,68,68) + the X-dismiss
round-trip · the info variant border rgb(229,229,229) + the description 12px
rgb(107,114,128) mt 2px · **the animation axes animName=none** (the L-131a5 finding
live-confirmed).

The remediation: **D-131a0** THE TOAST-X HOVER-TEXT FIX (`hover:text-foreground` →
`hover:text-neutral-900` — the genus's FOURTH arm: the reference surface is DOM-dead,
so the fix rides OUR superset by the trio precedent [the reference's stock
interactive-hover ink #171717, our literal family since the s80 badge] + internal
consistency — the toast X was the LAST live `hover:text-foreground` ride in src/) ·
**D-131a1** THE DEAD-ANIMATION RETIREMENT (the scaffold-era `data-[state]` arms never
applied — the ToastCard never sets data-state; retired per the D-124a7 doctrine; the
tw-animate.css vendor import stays — the Radix dialog family rides it) · **D-131a2**
THE PINS (the NEW `tests/toast-anatomy.test.ts`: 2 RED-first fix pins —
comment-stripped for the negatives, the fix comments themselves name the retired
strings — + 7 walk-censused freeze pins: the viewport geometry family, the card
chrome + the three variant borders, the 4000ms duration + the slice(-4) cap, the
aria family, the title/description classes, the icon family, the hover-pause seam).
The stash-proof: the file reverted alone → both fix pins RED alone.

The audits: 131-a 9/9 Verified (the complete toast inventory: 41 firing sites / 10
files, ZERO anatomy/close-X pins — the gap confirmed; the recommended trigger
verified) + 131-b 9/9 PASS (the ~89th standing — the drawer battery PLAIN, the SEO
live verified, the space-y census 107 exact). probe:ref the 103rd STABLE + the four
drift gates CLEAN + scandihaven d4789c3 on-pattern.

The final gate: lint 0/0 · tsc 0 · **111/2018** · build · **137/137 e2e** · the
closing drift sweep CLEAN on all four gates · census MATCH. **src/ 1 file + tests/ 3
files** (toast.tsx; the NEW toast-anatomy.test.ts + the docs-counts.test.ts +
dialog-geometry-parity.test.ts lockstep carriers). The POST-FIX walk re-run: the X
hover byte-exact **rgb(23,23,23)** at both viewports; every other axis unchanged.
The captures 252-255 (four unique md5s 0fc39d2a/dd4d5ee2/9fc63c9c/3bf25761) + the
VLM battery 4/4 CLEAN. The count ladder: UNIT 2009 → 2018 (+9) · SUITES 110 → 111 ·
E2E 137 · badge 2146 → 2155.

The walk-harness lessons: **L-131c1 the storageState token race** (the reference's
JWT lands in localStorage ~1s after submit, slower cold — POLL for the token, never
a fixed wait) · **L-131c2 the needsLogin SPA-boot race** (a DOM probe 1200ms after
goto reads a half-booted page — use a DETERMINISTIC gate: no state file ⇒ login,
state file ⇒ the /profile upload-input canary) · **L-131c3 the border-signal
currentColor trap** (ancestor-climb card detectors must key on borderWidth > 0, not
border-color — border-color defaults to currentColor) · **L-131c4 the toast-window
census discipline** (a toast lives ~4s — hunt from t=0 with an eager poll or a
MutationObserver).

**The next-session suggestion**: the rotation's second cycle continues — the s116+
third-cycle candidates (reports-tables s116 · accounts-list s117 · dashboard-charts
s118 · contacts-list s119 · leads-table s120 the stalest never-re-walked two-app
surfaces); the highlighted-state + text-content lenses stay standing; any future
reference-side toast census must first re-verify the F-131c1 DOM-dead state (the
platform may revive it).

## Session-132 — the reports-tables family third-cycle re-check (the freeze-pin session)

The 132-c rotation — the session_281 close's named direction: **the s116+ third-cycle
candidates, reports-tables FIRST** (the stalest never-re-walked two-app surface, 16
sessions back). The 132-a pre-walk inventory: the family source FROZEN (the tables arm
since s98, the export arm since s123) but the shared primitives moved under it — the
s129 button outline hover-text + the TABS_PILL ring-offset retirement, the s130 ghost
hover-text, the s125 active-pill bg-white — and the lenses sharpened since s116 (the
F-126c1 text-content · the F-127c2 submit-color · the F-128c1 highlighted-state
censuses). The named latent risks L-132a1..a9 (the TOP: the nine outline-button hover
rides never censused on this surface; a2: the pill focus halo never live-verified;
a3: the text-content census never run here; a4: the unpinned geometry family).

**THE WALK (walk23, the phased idiom — one app×viewport per invocation, the censuses
persisted to /tmp JSON, the reference's storageState persisted + reused, ONE reference
login total, PORT 3141, the walk db zero-data for PASS 1 / SEEDED for PASS 2; both
apps at 1440×900 + 390×844 through the five-tab ladder): 461 two-app axes, 11 raw
diffs, ZERO REAL PARITY DEFECTS.** Every diff adjudicated decisively: the ringOffset
pair the standing #fff-vs-hsl(0 0% 100%) FORMAT-ONLY residual · the ringColor pair a
NON-PAINTING custom-prop eagerness artifact (**the decisive keyboard probe**: under
real Tab focus the reference's ring resolves hsl(0 0% 3.9%) = ours #0a0a0a — both
apps paint the identical white-disk + dark-ring halo; the resting blue
rgb(59,130,246,.5) never paints) · the focusOutline pair the L-129c4 invisible-outline
genus · the focusVisible pair the programmatic-focus heuristic + the deliberate a11y
superset (**the L-132c1 discovery**: the reference's tabs ACTIVATE on programmatic
focus, theirs tabIndex=-1) · the selOpen.shadow the v4 dead-layer genus (trimmed
byte-equal).

**The lenses on their maiden run on this surface — ALL CLEAN**: L-132a1 the NINE
outline-button hover rides byte-equal every one (the bar CSV's literal blue pair + the
bar PDF + Reset + Saved Reports + the per-table quartet — hover text rgb(23,23,23) +
hover bg rgb(245,245,245), the s129 fix verified on the surface it never touched) ·
L-132a2 the pill focus halo keyboard-probed byte-equal · L-132a3 the text-content
census byte-equal both viewports · L-132a4 the geometry family byte-stable across 16
sessions (the chart cards 548×390/357×390 + the Forecasting 1120×434 wide row + the
phone wraps 358×215/247 + the table cards 167/189 — the chartprobe census) · L-132a6
the select OPEN state byte-equal modulo the dead-layer noise.

**The bar-PDF harness artifact (L-132c1, resolved to ground)**: the ref-side
btn.barPdf census recorded a 124×32 "Export PDF" where ours recorded absent — the
walk's focus probe ACTIVATED the reference's pipeline tab, so the locator censused the
per-table button. **The targeted barprobe7 census**: the REAL bar PDF button — text
"PDF" (the reference's own 81×32 outline-sm button), resting + hover BYTE-EQUAL both
apps.

**PASS 2 (populated, ours-only — the reference's zero-data genus)**: the ten row
contracts byte-exact the s116 records (4/10 · 6/5 · 13/4 · 10/5 · 2/10) · the first
cells 14px/500 rgb(10,10,10) · the outline Badge 5-site census (12px/600, #e5e5e5
border, radius 6px, transparent bg) · the red-tint rows on exactly 3 tables · the red
At Risk badge rgb(254,226,226)/rgb(153,27,27) · "18d ago" + the "Oct 14, 2026" MMM d,
yyyy dates ALL HOLD.

**The remediation (ZERO src changes — the s116 freeze-find pattern)**: D-132a0 THE
CHART-CARD FAMILY FREEZE (+2 its, reports-tabcontent-parity.test.ts — the sixteen
chart-card titles as a set + the geometry bearers: the 8-site grid family + the wide
lg:col-span-3 escape + the 10-site height={300} census) · D-132a1 THE BAR-TRIO LABEL
FREEZE (+1 it, reports-page-parity.test.ts — the sticky bar's SHORT "PDF" label vs
the per-table quartet's full "Export CSV"/"Export PDF" pair) · D-132a2 the docs
realignment. The TDD ladder: the pins GREEN at the standing source → the stash-proof
(the title mutation → 3 REDs alone; the bar-label mutation → the pin REDs alone) →
the docs-counts lockstep RED (13) at the stale docs → the realignment → GREEN.

The audits: 132-a 9/9 Verified (the complete reports-tables pre-walk inventory — the
named latent risks L-132a1..a9, the TOP risks walked and confirmed clean) + 132-b 9/9
PASS (the ~90th standing — the drawer battery 11 PLAIN + the 4/4 destination
click-throughs, the SEO 13 metadata-bearing files zero gaps, the space-y census 107
exact). probe:ref the 104th STABLE + the four drift gates CLEAN + scandihaven
d4789c3 on-pattern.

The count ladder: UNIT 2018 → 2021 (+3 its) · SUITES 111 UNCHANGED · E2E 137
UNCHANGED · badge 2155 → 2158. **src/ ZERO files · tests/ 4 files changed (the two
pin files + the docs-counts + dialog-geometry lockstep carriers).**

The walk-harness lessons: L-132c1 the focus-activation side effect (census every
panel-dependent axis BEFORE any focus probe; :has-text() is case-insensitive substring
— text-is() is the exact form) · L-132c2 the evaluate-arg discipline · L-132c3 the
bar-PDF label census discipline.

**The next-session suggestion**: the rotation's third cycle continues — the remaining
s116+ candidates (accounts-list s117 · dashboard-charts s118 · contacts-list s119 ·
leads-table s120); the highlighted-state + text-content lenses stay standing; the
chart-card runtime rects stay walk-verified per re-check cycle (the drift gates own
the pixel layer).

## Session-133 — the accounts-list family third-cycle re-check (the one-fix session)

The 133-c rotation — the session_283 close's named direction: **the s116+ third-cycle
candidates' next member — accounts-list (s117)**, 16 sessions back. The 133-a pre-walk
inventory: the family source FROZEN (accounts-page.tsx since s90 — 43 sessions; the
Insights dialog since s84; the Edit dialog since s91) but the shared primitives moved
under it — the s129 button outline hover-text, the s130 ghost hover-text, the s129
TABS_PILL/PANEL_BASE ring-offset retirement, the s125 active-pill bg-white, the s131
toast close-X — and the lenses sharpened since s117 (the F-126c1 text-content · the
F-127c2 submit-color · the F-128c1 highlighted-state · the s132 select OPEN-state).
The named latent risks L-133a1..a9 (the TOP: the outline hover arms never censused on
/accounts; a2: the Edit Account dialog NEVER in a walk ladder; a3: the text-content
census never run here; a4: the select OPEN state; a5: the unpinned heads set).

**THE WALK (walk24, the phased idiom — one app×viewport per invocation, the censuses
persisted to /tmp JSON, the reference's storageState persisted + reused, ONE reference
login total, PORT 3141, the walk db zero-data for PASS 1 / SEEDED for PASS 2; both
apps at 1440×900 + 390×844): 274 two-app axes, 10 raw diffs, ONE REAL PARITY DEFECT.**

**F-133c1 THE EMPTY-SELECT PLACEHOLDER INK** — the dead density select's trigger
computing `rgb(115,115,115)` on ours vs the reference's `rgb(10,10,10)`. The decisive
probe (walk24b): both apps render the identical empty span + chevron structure, but
OUR `value=""` enters Radix's `data-placeholder` state where our
`SELECT_TRIGGER.placeholderState` (`data-[placeholder]:text-muted-ink`) dims the
trigger — and the chevron (`stroke=currentColor` at `opacity-50`) PAINTS at the
trigger color. The reference's platform avoids the state entirely (its density select
carries the fixed no-match `"format"` value — the N-87c4 decode). The s81 M-81c3
bundle re-derivation already established the reference's verbatim construction
carries NO placeholder arm — confirmed then on five value-carrying selects, never on
a placeholder-STATE one; the density select is the only one on either app. The
adjudicated noise: the v4 dead-layer shadow genus · the s95 containment cascade @390
(both toolbars stack identically — the rows exactly 220px both apps, ours 326
contained vs the ref's 440 poke) · the climb-guard harness artifact (the fixed probe:
the card chrome byte-equal — radius 8 + the shadow family).

**The lenses on their maiden run here — ALL CLEAN**: L-133a1 the outline hover arms
(the toolbar More + both Export CSVs + the Edit Cancel — every one the s129
hover-text pair rgb(23,23,23)/rgb(245,245,245)) · L-133a3 the text-content census
byte-equal both viewports (the entire visible text of the zero-data page) · L-133a4
the select OPEN state (the washes byte-equal) · L-133a7 the rail CLEAN · L-133a8 the
s95 genus re-confirmed.

**PASS 2 populated ours-only — every seeded contract holds**: the KPI values
10/8/9/$77.5M/3 · the tier census 9 Key + 1 A · the star census 9 · the overdue 3 ×
"1 Overdue" + exactly 3 red-left-border rows · the healths 5/3/2 · the Key tint
rgb(254,252,232,0.3) · **THE EDIT ACCOUNT DIALOG's first walk (L-133a2)**: the
672×516 max-w-2xl chrome, the EIGHT field labels, the Cancel outline hover pair, the
dark Save Changes rgb(23,23,23)/rgb(250,250,250) · the Insights tabs · the Cards view
(10 cards) · the row menu + the select OPEN washes.

**The remediation**: D-133a0 THE PLACEHOLDER-INK FIX (`SELECT_TRIGGER.placeholderState`
retired + the select.tsx composition — exactly ONE call site sits in the placeholder
state; the INPUT placeholder family untouched) · D-133a1 the pin re-anchor (RED-first
+ the stash-proof: the fix reverted alone → the pin REDs alone) · D-133a2 THE FREEZE
PINS (+2 its: the 8-heads ordered set + the toolbar construction freeze) · D-133a3
the docs realignment. **The POST-FIX walk re-run: 274 axes, 8 adjudicated diffs ONLY —
the density ink byte-equal both apps.**

The count ladder: UNIT 2021 → 2023 (+2 its) · SUITES 111 UNCHANGED · E2E 137
UNCHANGED · badge 2158 → 2160. The captures 260-263 (four unique md5s) + the VLM
battery 4/4 CLEAN. The audits 133-a [9/9 shipped claims Verified, one prose-only
footnote (the s132 "tests/ 2 files" claim was actually 4 — the two lockstep carriers
ride along) + THE COMPLETE ACCOUNTS-LIST PRE-WALK INVENTORY] + 133-b [9/9 PASS, the
~91st standing — the drawer battery 11 PLAIN + the 4/4 click-throughs, the SEO 13
metadata-bearing files, the space-y census 107 exact, zero findings].

The walk-harness lessons: L-133c1 the climb-guard width fallback (the
borderless-card climb's width>400 guard fails at phone widths — the shadow-only climb
is the phone-safe form) · L-133c2 the data-placeholder state asymmetry (the reference
avoids the state via fixed no-match values; our supersets enter it via value="" — any
computed-ink census on an empty select must account for the asymmetry).

**The next-session suggestion**: the rotation's third cycle continues — the remaining
s116+ candidates (dashboard-charts s118 · contacts-list s119 · leads-table s120); the
highlighted-state + text-content + select-OPEN lenses stay standing; the empty-select
ink genus is now pinned at the source (the placeholderState retirement).

## Session-134 — the dashboard-charts family third-cycle re-check (the zero-fix / freeze-pin session)

The 134-c rotation — the session_285 close's named direction: **the s116+ third-cycle
candidates' next member — dashboard-charts (s118)**, 16 sessions back. The 134-a pre-walk
inventory: the family source FROZEN (page.tsx since s87 — 46 sessions; charts.tsx since
s98; page-parts.tsx since s90; dashboard-data.ts since s110) but the shared primitives
moved under it — the s129 button outline hover-text, the s130 ghost hover-text, the s128
MENU_ITEM focus arm, the s119 primary-foreground #fafafa re-pin — and the s133
placeholderState retirement CHANGED THIS SURFACE'S PAINT (the view-switcher value=""
select — the audit's L-134a1 record-only finding: the s133 fix's "exactly ONE
placeholder-state call site" undercounted; the dashboard's view-switcher is a SECOND
placeholder-state site, repainted with zero dashboard-side census). The named latent
risks L-134a1..a9 (the TOP three: the s133 fix's never-censused dashboard arm · the
s119 primary-foreground re-pin's dashboard arm · the hover arms never censused on /).

**THE WALK (walk25, the phased idiom — one app×viewport per invocation, the censuses
persisted to /tmp JSON, the reference's storageState persisted + reused, ONE reference
login total, PORT 3141, the walk db zero-data for PASS 1 / SEEDED for PASS 2; both apps
at 1440×900 + 390×844) + the decisive adjudication probe (walk25b — the Filter-button
resting state two-app + the menu/dialog lenses ours-only): 398 two-app axes, 7 raw
diffs, ZERO REAL PARITY DEFECTS.** The adjudication: the fb.filterBtn rect/color ×4
both viewports — the HARNESS ARTIFACT defused by the walk25b decisive probe (the Filter
button BYTE-EQUAL at both viewports: 88x32 / 12px-500 / rgb(10,10,10) / white /
rgb(229,229,229) / 6px / icon-16 @1440; 326x32 @390 — the flex-col stretch); the
text.content ×2 — the TEXT-NODE-GRANULARITY genus (the reference's platform splits its
currency template values into separate DOM text nodes "$"/"0.0"/"k" where ours renders
single nodes "$0.0k"; the RENDERED values byte-equal per the per-axis value censuses —
the harness lesson L-134c1: text censuses must compare normalized joined textContent);
the ch1.gridlineCount @390 (12 vs 11) — the documented s91 chart-noise genus (the s118
precedent 26 vs 25; the drift gate's phone floor authoritative, CLEAN this session).

**The lenses on their maiden run here — ALL CLEAN**: L-134a1 the s133 fix's dashboard
arm (the view-switcher trigger ink rgb(10,10,10) BYTE-EQUAL at both viewports + the
chevron rgb(10,10,10) — the placeholderState retirement live-verified on the
dashboard's placeholder-state select; the L-133c2 asymmetry stands: ours IN Radix's
data-placeholder state [true] where the reference avoids it [false], the ink equal
anyway — exactly the fix's intent) · L-134a2 the s119 primary-foreground re-pin's
dashboard arm (the primary Export rgb(250,250,250) on rgb(37,99,235) + both ghost Add
buttons rgb(37,99,235) — byte-equal) · L-134a3 the hover arms (ALL FIVE byte-equal:
the s129 outline pair rgb(23,23,23)/rgb(245,245,245) on the Add + the outline Export +
the Filter; the primary Export hover rgb(250,250,250)/rgb(29,78,216); the s130 ghost
pair on the More... button) · L-134a4 the MENU_ITEM wash rgb(245,245,245)/rgb(10,10,10)
· L-134a5 the select OPEN states (the Stage listbox 6 options + the highlight wash; the
view-switcher listbox Table/Cards) · L-134a6 the text-content census modulo the
granularity genus · L-134a7 the Lead quick-create dialog (the 512x640 chrome, radius 8,
"Create New Lead" 18px/600, the SEVEN field labels, the Cancel outline hover pair) ·
L-134a8 the @390 genera (the s95 containment re-confirmed — the filter bar stacks
column both apps, the kids byte-equal 326-wide; the L-121c1 rounded-full infinity genus
on the populated boxes).

**PASS 2 populated ours-only — every seeded contract holds**: the KPI values
24 / $337.0k / $126.0k / $0k / 29.2% / 82 (the Avg-Cycle day-scale drift from the s118
record's 83 — the wall-clock derivation, expected) · the pipeline 5 bars
(145,84,73,99,258) + the legend values (Prospecting $190.0k / Qualification $110.0k /
Proposal $95.0k / Negotiation $130.0k / Won $337.0k — the swatches byte-equal the
PIPELINE_LEGEND map incl. the Won gray fallback rgb(156,163,175)) · the Top Reps 3
rows + the header row · the Lead Sources 4 rows (the slice(0,4) contract) · the
Upcoming Activities 3 rows · the Recent Deals 5 rows (the slice-5 contract: the LMS
migration row + the dual Status badges + the owner box + the close date) · the Add
menu 5 items (Lead,Contact,Account,Event,Activity — 160x170, radius 8) · the
rounded-full census 13 boxes.

**The remediation (the zero-fix session — freeze pins only)**: **D-134a0 THE FREEZE
PINS** (+3 its, tests/dashboard-kpi-parity.test.ts — the 6 KPI labels as an ORDERED
SET ("Deals Closed"/"Avg. Sales Cycle" in ZERO ordered-set assertions — the s118
D-118a2 pinned the /leads statcards, never the dashboard KpiCards) + the five
quick-create menu items as an ordered set + the five dialog mounts + the icon
adjacency (in ZERO test assertions anywhere) + the filter-bar construction order
freeze; all three stash-proven: the label rename → 1 RED alone; the menu item
dropped → 1 RED alone; the More... ghost moved before the search → 1 RED alone) +
**D-134a1 the docs realignment** (the count ladder UNIT 2023 → 2026 (+3 its) ·
SUITES 111 UNCHANGED · E2E 137 UNCHANGED · badge 2160 → 2163).

**The next-session suggestion**: the rotation's third cycle continues — the remaining
s116+ candidates (contacts-list s119 · leads-table s120); the computed-ink +
hover-arm + text-content + select-OPEN lenses stay standing; the text-node-granularity
harness lesson (L-134c1) rides the next text census.


### Session-135 (2026-10-16) — the contacts-list family third-cycle re-check (the one-fix + freeze-pin session)

- The 135-c rotation (the session_287 close's named direction — the s116+ third-cycle candidates' next member, contacts-list [s119], 16 sessions back): walk26 (the phased idiom) + the walk26b decisive scan-dialog anatomy probe — 12 raw PASS 1 diffs adjudicated to THREE real defects, all in the Scan Business Card dialog: F-135c1 the submit's color (ours the bare blue primary vs the reference's rgb(23,23,23) DIALOG_SUBMIT family — the F-127c2 genus' missed sibling) · F-135c2 the file input's typography (the browser-default 16px/24px zero-padding stack vs the reference's stock 14px + 4px/12px md-responsive stack) · F-135c3 the file input's non-fluid width (the intrinsic 320 min-content escaping the dialog's p-6 padding at 390).
- The maiden lenses ALL CLEAN, incl. the L-135a1 TOP risk — the s133 placeholderState retirement's never-censused contacts arm: the null-role seed's per-row select (the walk db's James Whitfield) sits IN Radix's data-placeholder state and computes the neutral rgb(10,10,10) trigger + chevron ink, exactly the fix's intent; the row-menu wash on the REAL Radix [role=menu] (the L-134c2 inverse); the select OPEN states; the s125 active-pill's third segmented ride (the slide-over tabs); the W7's 672/7-labels/dark-Save contract.
- The remediation: D-135a0 THE SCAN-DIALOG FIX (contacts-page.tsx — the submit rides DIALOG_SUBMIT.button [the s127 idiom]; the file input rides the Input component + max-w-xs mx-auto [the byte-parity-verified stock stack]) + D-135a1 THE PINS (+6 its, contacts-family-parity.test.ts — the 2 fix pins + the 4 freeze pins; all stash-proven) + D-135a2 the docs realignment. The post-fix walk re-run: 6 raw diffs, ZERO real parity defects (the v4 dead-layer shadow genus + the text-node-granularity genus only). Count ladder: 111 suites / 2032 unit / 137 e2e / badge 2169.


### Session-136 (2026-10-17) — the leads-table family third-cycle re-check (the zero-fix + freeze-pin session)

The 136-c rotation (the session_288 close's named direction: the rotation's last s116+ third-cycle candidate — leads-table (s120), 15 sessions back). The walk (walk27, the phased idiom, the walk db zero-data PASS 1 / seeded PASS 2): PASS 1 **byte-equal on every compared axis** (0 raw diffs @1440, 191 axes · 0 @390, 208 axes) — **ZERO REAL PARITY DEFECTS**. The maiden lenses all clean: the L-136a1 TOP risk (the s133 placeholderState retirement's never-censused leads arm — the saved-views select's placeholder ink rgb(10,10,10) + the 4 blank unmatched-value inline triggers) · the L-136a2 hover arms (the s129 outline hover-text live-verified) · the L-136a3 row-menu wash (the s128 fix re-verified, 188×106) · the L-136a4 select OPEN states · the L-136a7 edit dialog (672 + the 7 labels + the dark Save) · the L-136a8 @390 genera (the scrollArea 358/903 — the exact s120 numbers). PASS 2: every seeded contract holds (the KPIs 24/9/7+$687,000/4+$226,000/29.2%/83 days · the sort arms · the filters · the inline round-trips + the overdue face · the export).

- The remediation: D-136a0 THE FREEZE PINS (+4 its, leads-family-parity.test.ts — the 9 table heads ordered set + the Gke 4 field labels + the row-menu trio + the edit dialog's 7 labels; all stash-proven: each mutation → exactly 1 RED alone) + D-136a1 the docs realignment (the PAD duplicate-row cleanup rode it). ZERO src changes.
- Count ladder: 111 suites / 2036 unit / 137 e2e / badge 2173.
- The harness lessons: L-136c1 the locator re-resolution trap · L-136c2 the menuitem existence window · L-136c3 the accessible-name trap; the session-level lesson — our side never round-trips an http storageState (the Secure-flagged session cookie replay).

### Session-137 (2026-10-17) — the settings picklist-editor family fresh-eyes walk (the pin-only session)

The 137-c rotation (the session_290 close's named direction: the fresh-eyes sweep of the never-walked seams — the settings picklist editors FIRST, the stalest candidate: settings-page.tsx frozen since s82, 55 sessions, while the shared primitives moved under it). The walk (walk28, the phased idiom, the walk db ZERO-CONFIG PASS 1 [the both-zeroes idiom — the 5 picklist arrays emptied to mirror the reference's wiped config] / re-seeded PASS 2): PASS 1's 27 raw diffs @1440 + 6 @390 ALL adjudicated to documented genera — the v4 shadow dead-layers, the L-122c1 disabled-cursor, the F-119c2 bodyBg (occluded), the inner-container scroll artifact (the decisive geo probe: BOTH apps' cards at doc-y 249, panelToCard 0), **the space-y margin-direction genus' maiden line-box face** (the reference's v3-style mt-8 on later inline buttons extends the line box's ascent where ours' v4 mb-8 extends it downward — the same 160px cards, the 8px on opposite sides), the L-134c1 whitespace — **ZERO REAL PARITY DEFECTS**. PASS 2: every seeded contract holds — the maiden lenses ALL CLEAN: the L-137a1 TOP (the s130 ghost hover-text live-verified on the picklist rows: the Pencil/Save/X trio rgb(245,245,245)/rgb(23,23,23), the Trash2 red pair rgb(220,38,38)→rgb(185,28,28), the row's gray-50) · the L-137a2 (the Defaults selects' resting ink — the s133 retirement's settings arm, a code-verified no-op) · the L-137a3 rename state + the Enter-save round-trip · the L-137a4 add round-trip (the hover alpha oklab 0.9 = the reference's rgba(23,23,23,0.9)) · the Defaults select round-trips (Week → Month restored). THE REFERENCE INTERACTIVE DRIVE (the maiden, restored): the add-button family censused TWO-APP BYTE-EQUAL (48×36 · rgb(23,23,23) · rgb(250,250,250) · radius 6px · the hover alpha 0.9) — then their Add click fired NO NETWORK CALL: **THE REFERENCE'S ADD FLOW IS A NO-OP TODAY** (their wiped config un-repopulatable from their own UI — the reference-side genus, ours the working superset; the reference restored to wiped, ZERO residue).

- The remediation: D-137a0 THE FREEZE PINS (+5 its, settings-family-parity.test.ts — the 5 panel titles + the 3 tab labels + the 5 add-input placeholders [incl. the Industries typo] + the Defaults 6-label ordered set + the picklist interactive chrome; all five stash-proven: each mutation → exactly 1 RED alone) + D-137a1 the docs realignment (the lockstep RED 12 → GREEN 21/21; the dialog-geometry CLAUDE carrier re-anchored). ZERO src changes — the freeze-pin genus closed on its LAST family (accounts s133 · dashboard s134 · contacts s135 · leads s136 · settings s137).
- Count ladder: 112 suites / 2041 unit / 137 e2e / badge 2178.
- The harness lessons: L-137c1 the inner-container scroll (main.overflow-auto — window.scrollY stays 0; reset before geometry censuses) · L-137c2 the synthetic-hover trap (CSS :hover needs REAL pointer moves — locator.hover() only) · L-137c3 the React controlled-input trap (locator.fill() only — direct .value + synthetic events never reach React state) · L-137c4 the quote-collapse selector trap.

### Session-138 (2026-10-17) — the reports chart-interiors family fresh-eyes walk (the grid-fix session)

The 138-c rotation (the session_292 close's named direction: the remaining fresh-eyes seams — the reports tab-content chart interiors with seeded data; the family source FROZEN [reports-page.tsx since s123, charts.tsx since s98, api/reports + reports-data since s107] while the s133 select retirement moved under it). The walk (walk29, the phased idiom, the walk db ZERO-DATA PASS 1 [the reference's own standing state] / pristine-seeded PASS 2): PASS 1 (two-app, zero-data) — **849 axes compared, ONE pre-fix divergence: the aging chart's gridlineCount ours 4 vs the reference 9 — THE L-138c1 GRID TICK-DELIVERY GENUS** (recharts 2.15.4's CartesianGrid generators spread the context axis object over CartesianAxis.defaultProps, and an explicit `tick={undefined}` prop puts a tick:undefined KEY on that object which nullifies defaultProps.tick, so getTicks() bails on `!tick` — the grid falls back to the 4-line plot FRAME [edges only] where the reference's recharts renders the classic visible-ticks+edges grid; every OTHER axis byte-equal — the ticks, the texts, the bars, the funnel's 15-line grid, the pies). PASS 2 populated ours-only — every seeded contract holds: the KPI row 18/6/4 $337.0K/2 $92K/66.7% matching the /api/reports cross-check (the L-138a4 chain) · the ten tables (4/10 · 6/5 · 15/4 · 10/5 · 2/10 …) · the chart interiors (bars/pies/lines/ticks/legends/sparks) · THE FOUR PIE LABEL TEXTS live-verified (the L-138c2 animation-gate lesson: the labels render only after the ~2s recharts mount animation — the walk's first census recorded zero, the timing artifact, not a defect; "referral: 5,call: 4,email: 3,website: 3,partner: 3" + the forecast/health/by-type formats) · THE MAIDEN TOOLTIP LENS (never censused on ANY chart in ANY family: the bar "prospecting → Value ($): 190,000" · the line "Oct 2026 → revenue: $126,000" · the pie's stock name-index quirk) · the period round-trip (quarter 18 → All Time 24 → Reset 18).

- The fix (D-138a0): the conditional tickProp spread + explicit axis types across the grid-bearing families in charts.tsx (SingleBar / GroupedBars / TrendLine / RevenueLine — the HorizontalBar funnel already immune [explicit types, no tick prop]) — live-verified BYTE-EXACT against the reference (the aging grid H@5/70/135/200/265 + V@65/154/272/302 — all nine lines at both viewports); post-fix PASS 1 re-run: **849 axes, 0 diffs**.
- The remediation: D-138a1 THE PINS (+10 its, reports-family-parity.test.ts — the 5 stash-proven L-138c1 source pins [exactly 5 RED at the pre-fix source: no bare tick={tick}, the conditional tickProp, the explicit types per family, the funnel's standing shape] + the KPI 5-label ordered set [the L-138a6 gap] + the Lost-Deals no-spark split + the 5 tab labels + the four labelFor contracts) + the e2e LIVE pin (+1 — in crm.spec BEFORE the reset test [the wipe leaves zero leads for every later spec file]: the aging chart's 9-line classic grid + the source pie's 5 format-verified labels at 390, the recharts-upgrade sentinel: a future recharts bump that re-breaks the tick delivery REDs here even though the source pins stay green; both halves polled — the s49 deterministic-wait doctrine) + D-138a2 the docs realignment (the lockstep RED 16 sites → GREEN 21/21; SKILL v1.135.0 + the session-138 layer).
- Count ladder: 113 suites / 2051 unit / 138 e2e / badge 2189.

### Session-139 (2026-10-17) — the dashboard chart-interiors post-fix re-walk (the two-fix session)

The 139-c rotation (the s138 grid-fix blast-radius doctrine: charts.tsx moved at
s138; reports — consumer #1 — was re-walked byte-exact in the s138 session; the
DASHBOARD — consumer #2, the family source frozen since s87 — was never re-walked
post-fix; the session_294 close's named alternatives — the toast ours-only surfaces
and the accounts fourth cycle — both strictly lower-yield: the reference's toast
system DOM-dead with the component chrome pinned at s131, the accounts family
frozen since s133 with zero moved-under carriers):

- The walk (walk30, the phased idiom): PASS 1 two-app zero-data — 274 axes, 7 raw
  diffs → TWO REAL parity defects: **F-139c1 the target rounding** (our revenue
  chart's `Math.round(55_000 + Math.random() * 10_000)` rendered integer-only
  tooltip values where the reference's own formula carries NO rounding — the maiden
  tooltip lens caught the ref's "$57,824.88" and the 5-sample decisive probe
  confirmed the raw-float form) + **F-139c2 the area-spark stroke-width** (our
  Sparkline area arm's explicit `strokeWidth={1}` vs the reference's absent
  attribute — the SVG default 1, zero rendered delta, the per-path tuple census).
  The maiden lenses otherwise clean: the gridline geometry byte-equal at 1440 on
  both charts, the zero-state y-tick quirk "0,1,2,3,4" byte-equal, 5/6 sparkline
  interiors byte-equal, the tooltip structure byte-equal, the @390 containment
  clean. The adjudicated noise (all documented): the L-134c1 text-node-granularity
  genus ×2 + the s91 chart-noise V-elision @390 (12-vs-11 gridlines, preserved
  post-fix exactly as reasoned).
- The fixes: D-139a0 the Math.round retirement (api/dashboard/route.ts) + D-139a1
  the strokeWidth retirement (page-parts.tsx) — both live-verified byte-exact on
  the post-fix walk re-run (our tooltip now renders the float form; the spark
  tuples byte-identical; 5 raw diffs, all the adjudicated genera).
- The remediation: D-139a2 THE PINS (+2 its, dashboard-family-parity.test.ts —
  the target-formula pin + the spark-area-arm pin; stash-proven: the fixes
  reverted alone → exactly 2 RED alone) + D-139a3 the docs realignment.
- Count ladder: 113 suites / 2053 unit / 138 e2e / badge 2191.
- The harness lessons: L-139c1 the card-class locator trap (the Card is
  rounded-xl — the title-text CLIMB is the class-agnostic finder) · L-139c2 the
  inactive-tooltip-wrapper trap (every recharts chart keeps its tooltip wrapper
  mounted showing the INITIAL state — scope the read to the hovered chart's card)
  · L-139c3 the random-mask discipline (number-masking hides the value-form
  distinction the raw record exposes — record BOTH) · L-139c4 the trailing-zero
  trim (toLocaleString's 3-fraction-digit default trims zeros — characterize
  random faces across N samples before concluding quantization).

- The harness lessons: L-138c1 the grid tick-delivery genus (the explicit-undefined prop quirk — NEVER pass `tick={undefined}`; spread conditionally) · L-138c2 the pie-animation gate (the recharts labels render only post-animation — settle > 2s before censusing pie label texts) · L-138c3 the login hydration race (an early fill lands before hydration — React resets the values and the POST 400s; settle before filling).

### Session-140 (2026-10-17) — the leads chart-interiors post-fix walk (the pin-only session)

The blast-radius doctrine (the s139 precedent): charts.tsx moved at s138 —
consumer #1 (reports) re-walked s138, consumer #2 (the dashboard) re-walked
s139, **consumer #3 (the leads page — the grid-bearing SingleBarChart
"Pipeline Value by Stage" + GroupedBarsChart "Won vs Lost Over Time" + the
ConversionFunnel) never re-walked post-fix**; the maiden lenses (the tooltip
lens + the H/V gridline split) never ran on the leads charts; the last chart
census s118-shallow (22 sessions); the s136 walk was table-only. The named
alternatives (accounts +7 zero-carrier / calendar +16 no-charts / activities
+15 one-gridless-site) all strictly lower-yield. The 140-a audit confirmed
with the per-file freeze map (leads-page frozen since s113 — 26 sessions).

**walk31** (the phased idiom; the walk dbs walk31-zero/walk31-seed at the
repo db/ folder; the absolute-override standalone boots; PASS 1 two-app
zero-data + PASS 2 populated ours-only; both viewports). **PASS 1: 245
axes, ZERO diffs** — the grids H/V byte-equal on both grid-bearing charts
at both viewports (the s138 fix's third consumer verified, NO residual), the
zero-state y-tick quirk byte-equal, the statcards byte-equal (the s118
contracts hold), the Contacted-elision byte-equal (4-of-5 ticks at the
331px card), **the funnel zero-face byte-equal — BOTH apps render 4
degenerate 0x0 trapezoids + 0 labels** (the "renders NOTHING" note
re-characterized: no VISIBLE funnel on either app, the DOM symmetric), the
wonlost empty face + the 2-item stock Legend byte-equal, the tooltips
untriggerable identically, the @390 containment clean. **PASS 2: every
seeded contract holds** — the statcards 24/9/7($687,000)/4($226,000)/
29.2%/82 days with the API cross-check exact on every axis; the pipeline
bars at the 0..800000 domain; the wonlost 10 bars (the M-77c2
reverse-chrono); **THE THREE MAIDEN TOOLTIP FACES DECODED**: ch0 "New
value : $319,000" (the raw-dataKey + dollarFormatter) + ch1 "Sep 2026 /
Won : 2 / Lost : 0" (the RAW-NUMBER face — never decoded on ANY family) +
ch2 "0 : 4" (the funnel stock payload); the filter + search round-trips
restored byte-identical; the export download fired. **ZERO REAL PARITY
DEFECTS — a clean walk.**

The remediation: D-140a0 the freeze pins (+4 its — the three
maiden-tooltip-face construction pins in leads-family-parity + the
ConversionFunnel family stock-construction pin in charts-internals;
mutation-proven exactly 2 RED alone per drift) + D-140a1 the docs
realignment + D-140a2 the captures 288-291 + the VLM battery + D-140a3 the
final gate (lint 0/0 · tsc 0 · 113/2057 · build · 138/138 · the drift
sweep x4 · census MATCH).

- Count ladder: 113 suites / 2057 unit / 138 e2e / badge 2195.
- The walk-harness lessons: L-140c1 the dead raw mouse.move (the locator
  hover scoped to the marked card is the working mechanism in this
  chromium-headless-shell build) · L-140c2 the wrapper-kill trap (the
  nohup'd server dies with the bash call; pkill -f server.js, else the
  child survives EADDRINUSE-blocked re-boots serving the STALE db).

### Session-141 (2026-10-17) — the activities family walk (the charts.tsx consumer #4 sweep-close + the pin-only session)

The blast-radius doctrine (the consumer sweep): charts.tsx moved at s138 —
consumer #1 (reports) re-walked s138, consumer #2 (the dashboard) s139,
consumer #3 (the leads) s140 — **consumer #4 (THE ACTIVITIES BY-TYPE CHART)
never re-walked post-fix** (the s125 walk 16 sessions back; the page source
frozen since s109 — 32 sessions; ~6 rendering-relevant carriers moved since
the walk: entity-dialogs s127, tabs/TABS_PILL s129, button s129/s130, toast
s131, select s133, charts.tsx s138 — the richest carrier stack of the
rotation candidates). The 141-a freeze map CONFIRMED the call site
grid={false} tickFontSize 10 — **s138-fix-inert at source** (no
CartesianGrid surface; the tick spread a no-op when tick is defined) — the
walk's yield: the maiden chart-interiors census + the tooltip face + the
carrier-stack re-verify. The named alternatives (accounts +7 zero-carrier
re-adjudicated a THIRD time / calendar +16 zero-charts) strictly
lower-yield.

**walk32** (the phased idiom; the walk dbs walk32-zero/walk32-seed at the
repo db/ folder; the absolute-override standalone boots; the reference's
storageState persisted + reused, ONE reference login; PORT 3141; both apps
at 1440×900 + 390×844). **PASS 1 two-app zero-data: 327 axes, 1 diff = the
DOCUMENTED More-Filters superset** (the s125 fix-over-defect genus: ours
EXPANDED, the reference's dead stub) — **ZERO REAL PARITY DEFECTS**: the
by-type chart-interiors maiden census byte-equal (the bars 0-count on both
apps — the all-zero elision genus; the xTicks the 5 labels; the yTicks the
"0,1,2,3,4" quirk; the NO-GRID verification — zero .recharts-cartesian-grid
lines, the L-138c1-immune face; the tick fonts 10px/#666; the chart rect
270×150; the 5 chips byte-equal) + **the maiden zero-face tooltip
"Emailcount : 0" byte-equal two-app** (the chrome white/#ccc/0px/16px/400
identical). **PASS 2 populated ours-only — every seeded contract holds**:
the 7days-windowed KPIs 2/3/3/5/4/2 (the API cross-check: 23 total, the
full byType call:7|email:6|meeting:4|note:1|task:3|whatsapp:2) · the
priority rows 3 with the Xh/Xd badges "3d/1d/20h overdue" · the Overdue
count badge "Overdue3" · the tab switches (Due Today 2 rows / Completed
sliced to 5 — the M-76c4 cap) · the timeline 13 LONG-WEEKDAY headers + 17
rows · **the maiden seeded tooltip face "Callcount : 5"** (the raw-dataKey
+ raw-number face — NO name + NO formatter) · the 0-value-bar elision
genus (Note 0 → 4-of-5 bars) · the Call-filter round-trip (the KPIs
1/2/0/5/0/0 + the chips "Call 5|rest 0" → restored byte-identically) · the
dialog 672×426 + the dark submit · the @390 containment + the M-109c1 row
containment holding (maxRight 358 < cardRight 374).

**THE REMEDIATION (the pin-only session)**: D-141a0 the freeze pins (+3
its, GREEN-at-birth — the by-type call-site construction pin + the
SingleBarChart/GroupedBarsChart L-138c1 tick-spread guard pin in
charts-internals (32) + the by-type chips palette pin in
activities-calendar-parity (60); the mutation-proof: the name-prop drift →
exactly 2 RED, the guard removal → exactly 1 RED, the hex drift → exactly
1 RED, reverted → 92/92 GREEN) + D-141a1 the docs realignment (UNIT
2057 → 2060 · badge 2195 → 2198 · SKILL v1.138.0 + the session-141 layer
+ **the s38→s138 prose-typo cleanup** — ~30 grid-fix-context sites across
the s140 record set, the real session-38 history references preserved).

### Session-142 (2026-10-18) — the marketing-layer parity build (probe:ref #114's parity event)

*The section the s142 record's D-142a8 claimed but the tree never carried —
the 143-a audit found the gap (the docs-counts lockstep checks counts, not
sections); filled at D-143a3.*

**probe:ref #114 = THE PARITY EVENT** — the reference's first bundle change
in 82 sessions (`index-DZ-xbrIm.js` → `index-Dc6wvGtA.js`, +65KB): the
public marketing landing at `/` + the /About + /Contact app pages + the
post-login redirect to `/`. The eight-probe decode: the landing anatomy
(the sticky header + the WORKING md:hidden disclosure menu; the hero + the
CSS-built mock dashboard; the 6 feature cards; the $9/$19/$39 pricing
tiers with the Pro highlight; the 6 single-open FAQ items; the footer) ·
the CRM shell UNCHANGED with its mobile defect STILL STANDING (the #114
"NAV-FIXED" verdict was the LANDING's own hamburger; the probe's TRUE-390
census retargeted `/` → `/Dashboard`) · **the landing brand-token genus**
(the reference's `--brand` custom property never entered its Tailwind
build — zero bg-brand/text-brand utility rules — its landing CTAs render
invisible in every browser; ours the working blue #2563eb, the
drawer-precedent fix-over-defect) · the dashboard re-derivation (the
rolling last-7-months window; the synthetic Target series + Legend
retired; the s33 header trio retired to the singleton disabled-at-zero
Export).

**THE REMEDIATION**: D-142a0 the route move ((app)/page.tsx →
(app)/dashboard/page.tsx, the capital alias re-import, the 14 test-path
carriers, the e2e re-anchors) + D-142a1 the landing page (PUBLIC at the
root, the full censused construction, `--color-brand` in @theme; three
documented deviations: truncate, the FAQ aria superset, the working blue)
+ D-142a2 the /About + /Contact pages + the capital aliases + D-142a3 the
sitemap +/about +/contact + D-142a4 the probe re-anchor (STABLE on the new
fingerprint) + D-142a5 the unit pins (tests/landing-page.test.ts 36 its +
the mutation-proof: 3 drifts → exactly their pins RED) + D-142a6 the
landing e2e spec (+8) + the sweep PAGES + the brand-token baselines +
D-142a7 the captures 296-303 + the VLM battery clean + D-142a8 the docs
realignment (UNIT 2060 → 2101 +41 · SUITES 113 → 114 · E2E 138 → 146 +8 ·
badge 2198 → 2247) + D-142a9 the final gate (lint 0/0 · tsc 0 · 114/2101 ·
build · e2e 146/146 · the drift sweep CLEAN ×4 — the dashboard 0.03%
pixel-perfect · census MATCH). The count ladder: UNIT 2060 → 2101 ·
E2E 138 → 146 · badge 2198 → 2247. The walk-harness lessons: L-142c1 the
brand-utilities-never-generate decode (the CSS source authoritative over
the computed-style probe) · L-142c2 the disabled-at-zero Export's
half-blue face · L-142c3 the retirement blast radius.

### Session-143 (2026-10-18) — the landing family walk (the 143-c rotation)

**THE MAIDEN LANDING-FAMILY FRESH-EYES CENSUS** (walk33): both apps at
1440×900 + 390×844, the anatomy census + the interaction lenses — **19
axes EQUAL · 1 GENUS (the brand-token ctaBg, documented) · 2 REAL
FINDINGS**:

- **F-143c1 THE APP-SHELL FOOTER**: the reference renders a 53px
  main-level footer (`© 2026 NEO CRM` + About/Contact links,
  byte-censused) on **ALL 11 app pages**; ours rendered none. Below the
  900px fold on 10 of 11 (tall pages); above-fold on profile (viewport
  823) where its white-vs-gray-50 bg is a 6-channel delta UNDER the
  sweep's 12 tolerance — the pixel gates never saw it (the text/border
  pixels rode inside profile's 0.17% baseline). Remediated: the
  APP_FOOTER contract in page-layout.ts + the AppShell mount after
  {children} inside main + the S16-P1 e2e re-anchor (scrollDelta 5 → 58,
  live-verified on the reference).
- **F-143c2 THE FAQ CONTAINER**: the reference's FAQ is the ONLY narrow
  landing section (max-w-3xl, the h2 a direct child); ours rode the
  max-w-6xl + max-w-2xl pattern — the 1102px vs 718px column (the answer
  wrap 43 vs 66px). Below the fold — the DOM census caught what the
  viewport-only sweep cannot. Remediated: the container re-derived, the
  walk-verified geometry EQUAL (768/720/66).

**THE VERIFICATION**: the walk re-run (the FAQ geometry byte-equal + the
footer census 11/11) · the audits (143-a 12/13 Verified + the s142
docs-gap finding — the AGENTS Session-142 section + the PAD session-142
row, claimed but missing, filled at D-143a3; 143-b 11/11 PASS, zero
findings) · probe:ref #115 STABLE · the four drift gates CLEAN ×4 (the
profile footer band 0.17% → 0.00%) · the captures 304-306 + the VLM
battery 3/3 clean. The count ladder: UNIT 2101 → 2104 (+3 — the
APP_FOOTER contract pin + the AppShell mount pin + the FAQ container pin,
mutation-proven: 3 drifts → exactly their pins RED) · SUITES + E2E
unchanged (114/146). The walk-harness lessons: **L-143c1 the
viewport-only sweep's blind band** (everything below the fold is never
pixel-compared — run the DOM census on every new surface) · **L-143c2 the
sub-tolerance footer** (white vs gray-50 = 6 channels < the 12 tolerance —
decode a baseline's share with a pixel-band scan before trusting it) ·
**L-143c3 the content-offset vs viewport-offset trap** (a footer at
content-offset 836 inside main is NOT at viewport 836 — add main's
bounding-rect top before declaring above/below-fold).

### Session-144 (2026-10-18) — the guest-family walk (the 144-c rotation)

**THE MAIDEN GUEST-STATE CENSUS** (walk34): the s142/s143 walks censused
the marketing family LOGGED-IN; the GUEST state was never walked — the
s142 build's auth posture rode an unverified assumption (its own source
comment: "the reference's guest-visible app shell is a base44 platform
artifact we deliberately do not mirror"). The walk drove both apps'
logged-OUT faces — **1 REAL FINDING**:

- **F-144c1 THE MARKETING PAGES GATE (High)**: the reference serves
  /About + /Contact to GUESTS — rendered-level verified (the full
  content + the app chrome: the 8-link sidebar, the "Hi, Guest" topbar
  with the gray-200 "G" avatar, the app footer; the guest funnel
  landing → footer → About → Contact all-200). OURS: 307 → /login —
  the funnel broke at the landing footer's links. Remediated: the
  `(marketing)` route group (the four route files git-mv'd; the
  session-optional layout `getSessionUser() ?? APP_GUEST_USER` → the
  same AppShell chrome, NO redirect; the APP_GUEST_USER contract in
  page-layout.ts — the Topbar's own fallback chain renders "Hi, Guest"
  + "G" with ZERO Topbar changes; the store stays user:null —
  hydrate's else branch). The (app) group's redirect UNTOUCHED — the
  CRM data pages stay auth-gated (the reference renders those to
  guests too — its "Hi, Guest" platform face, documented standing
  genus; our server guard is the fix-over-defect).
- **N-144b1 THE STALE DRAWER BATTERY (Medium, tooling)**: the
  standalone `scripts/drawer-battery-390.ts` was stale vs the s142
  route move — post-login lands on the PUBLIC landing (no CRM drawer
  trigger) so the battery timed out deterministically. Remediated: the
  post-login `goto("/Dashboard")` re-anchor (the e2e crm specs' own
  s142 re-anchor; the route-move blast-radius lesson).

**THE VERIFICATION**: the walk re-run (the guest faces EQUAL on every
visible axis + the funnel working both apps) · 144-a 13/13 Verified,
zero findings · 144-b 10/11 (N-144b1) · probe:ref #116 STABLE · the
mutation-proof (3 drifts → exactly their pins RED) · lint 0/0 · tsc 0 ·
**114/2108** · build · **e2e 149/149** (+3: the guest /About +
/Contact + the funnel) · the drawer battery live GREEN · the four drift
gates CLEAN ×4 (the 13-page sweep set — about/contact joined at
0.00/0.00 desktop-tablet-landscape + 0.51/0.51 phone floor) · the
captures 307-309 + the VLM battery 3/3 clean. The count ladder: UNIT
2104 → 2108 (+4) · E2E 146 → 149 (+3) · badge 2250 → 2257. The
walk-harness lessons: **L-144c1 the never-walked state** (every parity
surface has TWO states — logged-in + guest; walk BOTH — the auth
boundary itself is a parity axis) · **L-144c2 the re-anchor blast
radius of a route move** (grep every post-login expectation in
scripts/ + tests/ when a route moves, not just the failing carriers).

### Session-145 (2026-10-18) — the auth-transition family walk (the 145-c rotation)

**THE MAIDEN AUTH-BOUNDARY TRANSITION CENSUS** (walk35, the session_307
"next" hint): the login/signup guest→auth flows — the last barely-walked
family; the s126 login-family re-walk predates the s142 route move. The
walk drove both apps through the full guest→auth→guest round-trip.
**The verdict: 7 axes EQUAL · 3 axes documented-genus · ZERO real
findings** — a PIN-ONLY session (the s136/s140 pattern):

- **The landing's LOGGED-IN face (the maiden census)**: both apps
  SESSION-STATIC — the reference post-login lands on `/` with the
  IDENTICAL guest face (the same nav, the same "Open dashboard" CTA, no
  user indicator); ours the same.
- **The post-login redirect**: EQUAL — both apps `/login` submit → `/`.
- **The login card faces**: EQUAL — the guest anatomy + the
  invalid-credentials error state + the authed-visitor pure render (the
  s23 retirement; the reference serves the login card to authed visitors
  too).
- **The logout transition**: GENUS-consistent — the reference's Logout
  stays on-page rendering its guest platform face (the documented
  no-guard genus); ours `router.push("/login")` — the (app)-guard
  posture's client expression.
- **The guest marketing pages at 390 (the maiden phone census)**: the
  reference's guest /About renders NO navigation affordance at all (the
  standing mobile defect extends to its guest-served app pages); ours
  the working drawer — the headline fix extends to the guest family.

**THE PIN-ONLY REMEDIATION** (the 5 never-pinned axes frozen, the
mutation-proof ×4 — each drift → exactly 1 RED): the landing COMPONENT's
session-static contract + the logout transition target + the post-login
redirect target (source-frozen, e2e-only before) + the /login + /signup
pure-render + the guest 390 drawer e2e. **N-145a1 (the s144 docs-gap
#3)**: the page-layout census site stale 1631/193 vs live 1653/196 at
the s144 ship (the APP_GUEST_USER growth never re-anchored) — filled.
**THE VERIFICATION**: 145-a 14/14 Verified · 145-b 11/11 · probe:ref
#117 STABLE · lint 0/0 · tsc 0 · **114/2112** · build · **e2e 150/150**
(+1) · the four drift gates CLEAN ×4 · census MATCH. The count ladder:
UNIT 2108 → 2112 (+4) · E2E 149 → 150 (+1) · badge 2257 → 2262. The
walk-harness lessons: **L-145c1 the transition targets ride the route
landscape** (a route landscape change re-opens the transition family
even when no bundle changes) · **L-145c2 the pin-only session still
ships pins** (the maiden census axes ride only comments + the e2e's
incidental coverage; the freeze pins are the walk's durable artifact).

### Session-146 (2026-10-18) — the drift-sweep baselines re-derivation (the 146-c rotation)

**THE MAIDEN UNIFORM RE-MEASUREMENT** (walk36, the session_309 "next"
hint's candidate #2 — chosen over the marketing phone re-walk because the
last FOUR sessions all censused the marketing family while the core
10-page baseline tables date from s91–s99, 47+ sessions old): all 4
viewport classes × 13 pages re-measured, the moved values reproduced ×2+
runs. **The verdict: ZERO upward drift — every genus byte-stable or
retired:**

- **The exact reproductions**: tablet landing 15.34 EXACT · landscape
  landing 10.77 EXACT · tablet accounts 0.72 EXACT · landscape accounts
  2.43 EXACT (the maiden s97/s99 values, unchanged 47+ sessions) · the
  desktop landing 9.59 (the s142 maiden) · the settings picklist
  4.73/7.34/5.19/4.74 · the login logo 0.28/0.78/0.46/0.46 · the phone
  floor family 0.51-0.56 · about/contact 0.00/0.00/0.51/0.51.
- **F-146c1 THE PHONE-LANDING BASELINE EROSION**: the genus share 8.5
  (the s142 maiden, the PRIOR sandbox) → **5.32** (byte-stable ×3 runs;
  the cluster decode the SAME brand-token genus — the CTA band 4.30% +
  the hero badge 0.76% + the logo 0.22%; the share rides the sandbox's
  font rasterization — the above-the-fold mock sliver varies
  cross-environment). The 8.5 entry carried **3.2 points of dead slack**
  under which a real +3% blue-shift regression passed the drift gate
  asleep. RE-ANCHORED 8.5 → 6.0 (trips at 6.5, +1.2 regression
  sensitivity).
- **N-146a1 THE STALE DESKTOP GENERA ×2**: the s91-era contacts ~0.5%
  "lucide aria-hidden superset" (0.00 at every gate since s142 — the
  superset is the DOM-level N-89c6 library attribute, never the pixel
  diff; the comment misattributed it) re-anchored 0.6 → 0.1 (the family
  floor) · the dashboard ~0.3% "2px chart-baseline artifact" (0.03 since
  s142) re-anchored 0.4 → 0.15.

**THE REMEDIATION**: D-146a0 the three baseline re-anchors + the header
standing-explained block + the runtime standingExplained lines re-derived
· D-146a1 the pin re-anchors (the standingExplained pin's retired
/lucide/ requirement dropped, the desktop-table pin's stale floors
lowered, the NEW session-146 describe — the re-anchored values frozen +
the byte-stable confirmations + the mechanism-comment source pins; the
mutation-proof ×3 — each value drifted → exactly 1 RED → reverted →
GREEN) · D-146a2 the four drift gates re-run GREEN under the re-anchored
tables · D-146a3 the captures 313-314 + the VLM battery 2/2 clean ·
D-146a4 the docs realignment (the count ladder 2112 → 2115 · badge 2262 →
2265 · SKILL v1.143.0 + the session-146 layer · this section · the PAD
session-146 row + the totals · the session_310 record + the plan record +
the worklog). **THE VERIFICATION**: 146-a 11/11 spot-verified · 146-b
11/11 PASS · probe:ref #118 STABLE (the 5th consecutive) · lint 0/0 ·
tsc 0 · **114/2115** (+3) · build · **e2e 150/150** · the four drift
gates CLEAN ×4 · census MATCH. The walk-harness lessons:
**L-146c1 the baseline is a snapshot of its sandbox** (a standing entry
measured in one environment carries that environment's rasterization;
the quarterly re-derivation is not optional bookkeeping — the dead slack
compounds silently, 3.2 points in 4 sessions here) · **L-146c2 the
genus comment must name the MECHANISM, not the value** (the s91 comment
attributed a DOM-level superset to a pixel diff — when the pixels
retired, the comment kept documenting a genus that never was).

### Session-147 (2026-10-19) — the mobile-nav parity event (probe:ref #119's event)

**THE SECOND BUNDLE CHANGE EVER** (after 5 stable sessions at the s142
fingerprint): the reference shipped `index-n8TZHw0K.js` (md5 `46bc2d9c…`,
+2,675 bytes) and the TRUE-390 census flipped DEFECT-STANDS → NAV-FIXED.
Two posture changes rode the one bundle:

- **F-147c1 THE REFERENCE'S MOBILE-NAV FIX (the standing ledger's #1
  RETIRED)**: its CRM-shell mobile defect (100+ censused sessions) is
  fixed upstream — a stock ghost-button trigger (`aria-label="Open
  navigation"`, lucide-menu, `md:hidden text-gray-600`) + a Radix Sheet
  (the shadcn pattern: `w-72` `bg-[#2563eb]`, the "CRM" wordmark h2 +
  sr-only description, the stock DialogClose, the drawer's own link
  styles — white/80 inactive, `bg-white/20` active — the mt-4 border-t
  Settings group, the `bg-black/80` overlay, the 500/300ms slide). The
  clone's drawer was RE-DERIVED onto the same construction (the repo's
  own Radix primitives + the MOBILE_NAV_SHEET contracts), keeping the
  behavioral supersets (the S8-P1 resize auto-close, the main-scroller
  lock, the route-change close). The desktop shell stayed byte-stable.
- **F-147c2 THE GUEST RE-GATING (the s144 posture REVERSED)**: the
  reference's /About + /Contact now login-wall guests — a client-side
  guard to `/login?from_url=<absolute-url>` with the post-login return
  (walk-verified). The clone mirrors it: the GuestLoginRedirect shim on
  BOTH route groups (the session decision stays server-side — the guest
  never receives the page's HTML) + the login card's from_url round-trip
  behind the same-origin open-redirect guard. APP_GUEST_USER retired.
- **F-147c3 THE DESKTOP-INTERIOR FAMILY (the s148 mirror target —
  baselined, not yet mirrored)**: the same bundle removed the
  reference's KPI delta chips (accounts' +4.2%/-1.8%/+5.1%/+3.0%,
  contacts' "+0", activities' "+23%" + "2h overdue"), its accounts
  toolbar trio (the Table switcher + the empty density select + More) +
  the in-search magnifier + the rail's Save All/Filter, re-morphed its
  landing mock (5 bars, +Reports, taller window, no CTA arrow), FIXED
  its invisible-CTA landing genus (the CTAs now render blue), and
  re-populated its settings picklist data (Won/Lost/converted +
  LinkedIn). The sweep baselines re-anchored with these as
  standing-explained (the phone floor genus RETIRED — the reference's
  topbar now matches ours; the phone landing genus COLLAPSED 6.0 →
  0.01).

**THE REMEDIATION**: D-147a0 the sheet contracts + the mobile-nav
rebuild (the Radix construction) · D-147a1 the isNavActive extraction
(nav-config, both navs) · D-147a2 the guest re-gating + from_url ·
D-147a3 the probe STANDING re-anchor (the new fingerprint + the mobile
standing triple {0,0,1} — drift in EITHER direction trips) · D-147a4
the e2e + battery re-anchors (the trigger label, the dialog name "CRM",
the closed-state unmount semantics, the guest-wall family, the exit-
animation release polls) · D-147a5 the sweep re-derivation (all four
classes re-measured; the baselines + the standingExplained lines + the
pins re-anchored; the mutation-proof ×3) · D-147a6 the captures
313-325 + the VLM battery · D-147a7 the docs realignment (the count
ladder 2112 → 2132 · E2E 150 → 151 · badge 2265 → 2283 · SKILL v1.144.0
+ the session-147 layer · the mobile-defect claim retirement across
README/CLAUDE/PAD/SKILL). **THE VERIFICATION**: 147-a 11/11 spot-
verified · 147-b 11/11 PASS · probe:ref #120 STABLE at the new
fingerprint · lint 0/0 · tsc 0 · **115/2132** (+17) · build · **e2e
151/151** · the four drift gates CLEAN ×4 · census MATCH. The
walk-harness lessons: **L-147c1 the defect ledger is a snapshot too**
(the standing "reference mobile defect" drove five sessions of framing;
its fix arrived without notice and every carrier of the claim needed
the same re-derivation as a pixel baseline) · **L-147c2 the parity
event lands as a CLUSTER** (one bundle carried two posture flips + a
page-interior family — decode the WHOLE delta before choosing the
remediation scope, or the second change rides the first's ticket).

### Session-148 (2026-10-19) — the desktop-interior mirror (the F-147c3 family)

**The F-147c3 family MIRRORED** (probe:ref #122 STABLE at the s147
fingerprint — no new event; the session_312 "next" hint executed). The
walk38 re-decode corrected TWO stale s147 handoff notes before
implementing (the L-148c1 lesson): the accounts search magnifier is
KEPT (only the trio retired), and the desktop hero CTA KEEPS its
ArrowRight (only the mobile-menu/footer CTAs are arrow-less). Two
further decodes the s147 handoff missed entirely: the dashboard's
Recent-Deals bar retired BOTH its blank middle select AND its "More..."
dead ghost (walk38k: [Filter][All Stages][All Sources][search]), and
the Priority card's plain "More" is gone with the activities chips
family (walk38).

- **THE KPI DELTA-CHIP FAMILY (every core page)**: the chips retired —
  dashboard (KPI_STATICS.deltas), accounts (4 trend pairs), contacts
  (the "+0"), activities (the "+23%" + "2h overdue" — the SUB-texts
  "Due now"/"+7 today"/"+4 today"/"+1h 12m" KEPT), calendar (the four
  static trends — CALENDAR_KPI_STATICS retired with them).
- **THE ACCOUNTS TOOLBAR TRIO + RAIL**: the switcher/density/More trio
  retired (the magnifier + Export CSV keep the byte-equal construction);
  the rail's Save All + Filter retired — ACCOUNTS-SCOPED: the
  activities rail KEEPS its pair (the L-148c2 asymmetric-removal
  lesson). The Cards view + the `view` state retired with the switcher.
- **THE DASHBOARD BAR**: the middle view-switcher + the More... ghost
  retired; the dealsView state + its Cards branch retired with them
  (VIEW_SWITCHER + TABLE_TOOLBAR.select/densityOptions retired from
  page-layout.ts — TABLE_TOOLBAR.row/moreBtn stay, the Export's class).
- **THE LANDING MOCK MORPH (walk38d/e/f byte-decoded)**: the Accounts
  preview renders a 4-row micro-table (Northwind/Vertex/Bluepeak/
  Harbour — the grid-cols-3 construction verbatim), the Reports preview
  renders "Revenue by month" with 7 bars [42,64,50,82,60,94,71], the
  middle row flips at lg (`lg:[&>*:first-child]:order-2`), and the
  hero's ≥sm line-heights pin the reference's COMPUTED values
  (`sm:leading-none` + `sm:leading-[28px]` — its leading utilities are
  inert at ≥sm in its build; phone stays the working 1.08/relaxed,
  byte-equal on both apps).
- **THE SWEEP RE-DERIVATION**: the family COLLAPSED to the 0.00-0.01
  floor at EVERY class (desktop accounts 1.97→0.00 · contacts 2.50→
  0.00 · activities 4.52→0.01 · landing 7.26→0.00; tablet landing
  10.77→0.01; phone contacts 5.51→0.00; landscape accounts 3.36→1.67 —
  the PURE s95 overflow genus). All four baseline tables + the
  standingExplained lines + the sweep-tool pins re-anchored; the
  mutation-proof ×3; the four drift gates CLEAN ×4. The standing genera
  left: the settings picklist-DATA genus (volatile workspace data, not
  for mirroring) + the login logo genus + the s95 landscape overflow
  genus.

**THE TDD LEDGER**: 21 new pins RED at birth (the constants retirement
+ the per-page mirror pins) + 9 flipped legacy pins (the s8 trio freeze
→ the trimmed stack; the s117 trend census; the s133 order; the s27
deltas; the s76 statics; the s119 "+0"; the s134/s87 bar freezes; the
route-case More...) → the implementation → GREEN; the e2e re-anchors
(the Cards-view test retired with its switcher, the "+5.3%" assertion
flipped negative, the More... no-op test retired, the NEW landing
mock-variant spec). **THE VERIFICATION**: lint 0/0 · tsc 0 ·
**115/2153** (+21) · build · **e2e 152/152** (+1) · the four drift
gates CLEAN ×4 · census MATCH · the VLM battery 3/3 (accounts trio/rail
/KPI · the preview family · the dashboard bar) · the live two-app smoke
byte-equal (dashboard + landing construction; the accounts h=102
compact cards). **THE DOCS REALIGNMENT**: the count ladder (2132 → 2153
· E2E 151 → 152 · badge 2283 → 2305) · the page-layout line census
(1698/205 → 1687/210) · SKILL v1.145.0 + the session-148 layer · the
PAD row · the session_314/315 records + the plan execution record.
The walk-harness lessons: **L-148c1 the stale handoff decode** (the
s147 handoff's landing decodes were wrong at the live re-walk — the
next round's mirror must re-decode every handoff finding live) ·
**L-148c2 the asymmetric removal** (the accounts rail lost its buttons
while the activities rail kept them — the per-page scope check is part
of the decode).

### Session-149 (2026-10-19) — the below-the-fold landing mirror (the 149-c rotation + the full-page gate)

**The owner's new signal executed**: `d532c56` brought the
full-page-screenshot skill bundle (the quality-gated G1–G6 capture
methodology) + `8a6b0e5` the `neo-crm-homepage.png` (the 1920×4986
full-page capture of our deployed landing — the skill's reference
run). probe:ref #123 STABLE at the s147/s148 fingerprint — a
rotation round on the NEW AXIS: the four viewport sweeps structurally
clip at y≈900, so the landing's below-the-fold sections had NEVER
been pixel-compared end-to-end (the L-149c1 blind spot).

- **THE WALK39 FULL-PAGE DECODE** (both apps' landing full-page at
  1920 + 390, the skill's phases): the height delta is ALL #pricing
  (ref 4990/ours 4986 desktop · 7259/7207 phone — every other section
  byte-equal) — **F-149c1 THE REPRICED TIERS** (ref $8/$14/$20 vs our
  stale s142 census $9/$19/$39) + **F-149c2 THE ADVANCED CARD'S SIXTH
  LI** ("Data tools, templates and guarded reset" — the live order,
  after the defaults row) + **F-149c3 THE PREVIEW ROWS' ≥sm LEADING
  GENUS** (ours computed leading-relaxed at 26px; the reference's
  leading utilities inert at ≥sm — 24px, the text-base pairing — the
  SAME genus the s148 hero fix pinned; phone byte-equal, the
  leading-relaxed ACTIVE at <sm on both apps). The corrected-diff
  validation (shift +4/+52 below the pricing anchors) closed the
  FAQ/footer as pure shift — the decode complete. Pre-fix full-page
  diff: 0.901%/2.455%.
- **THE PLATFORM PILL (standing genus, NOT mirrored)**: the "Edit
  with Base 44" pill — bottom-right fixed chrome, GUEST-only (the
  logged-in sweeps measured landing 0.00 through s146–s148; the
  fresh-context walk39 captures exposed it — the L-149c2 lesson).
- **THE FULLPAGE-SWEEP TOOL** (D-149a3): `scripts/fullpage-sweep.ts`
  — the FIFTH gate, wired into `gate:full`; guest contexts (the
  landing is public, no login); the landing pair at 1920×1080 +
  390×844; the pad-then-diff for unequal heights (the PURE `padTo`
  seam + the browser canvas twin, the no-bundling doctrine);
  `STANDING_FULLPAGE_BASELINES` {desktop 0.14 · phone 0.49} absorb
  the pill genus + the raster floor; `--fail-on-drift` at the
  standing 0.5pct margin. The maiden + post-fix runs: **EQUAL heights
  (4990/7259) at 0.093–0.144% / 0.316–0.487%** — CLEAN.
- **THE DEV-INDICATOR DECODE** (the sweep-order lesson): the
  verification-phase phone gate tripped landing 1.49% — OUR side's
  Next.js dev-server "1 Issue" pill (bottom-left), a per-process
  CUMULATIVE issue counter fed by the e2e error-path tests
  (lockout/400 probes) that ran between the audit-phase gates and the
  verification gates; a fresh dev server reproduces 0.00. The gates
  run before e2e (the house order) or after a dev-server restart.
- **THE TDD LEDGER**: 5 landing pins + 11 fullpage-tool pins RED at
  birth (the flipped s142 price pins + the 6th-li feature pin + the
  F-149c1/c2/c3 describes + the tool wiring/padTo/doctrine pins) →
  the implementation → GREEN; the e2e pricing test flipped + the 6th
  li assertion; the s97 gate-script composite re-anchored to the
  FIVE-gate chain; the docs-counts layer-axis flipped to the s149
  head (2167/116/152, badge 2319).
- **THE VERIFICATION**: lint 0/0 · tsc 0 · **116/2167** (+14) ·
  build · **e2e 152/152** (the definitive re-run after the known
  settings-Defaults flake passed in isolation) · the four viewport
  gates CLEAN ×4 (the fresh-server phone re-run) · **the fullpage
  gate CLEAN** (maiden + final) · the VLM battery 2/2 (the pricing
  pair — $8/$14/$20 + the Data-tools row; the preview pair — the
  three rows, the flip preserved, the line-heights equal). The
  captures 335–340.

### Session-150 (2026-10-19) — the marketing phone-state walk + the leading-genus family closure (the pin-only rotation)

The workspace RESET (re-cloned at `9127928`; the environment re-stood:
install/.env/db push+seed/census MATCH/chromium/dev server). **The s149
worklog gap filled first** — the prior session was interrupted at its
final step (the repo worklog ended at the s148 record; the Task ID 149
record appended). probe:ref **#124 STABLE** at the s147/s148/s149
fingerprint — a rotation round on the session_317 candidates: (a) the
settings picklist family's phone state + (c) the full-page axis past
the landing.

- **150-a**: the baseline gate GREEN — lint 0/0 · tsc 0 · **116/2167**
  · build · **e2e 152/152** — the EXACT s149-ship match.
- **150-b**: the drawer battery GREEN (the mobile-nav contract) · the
  four viewport gates CLEAN ×4 · the fullpage gate CLEAN (0.093/0.316
  at equal heights 4990/7259) · sitemap 11 routes + robots + the SEO
  meta · the tree clean · zero dep changes.
- **walk40 (6 passes) — THE LEADING-GENUS FAMILY CENSUS (PASS 1)**:
  the s148/s149 v4 genus (a base `leading-*` loses to a responsive
  `sm:text-*` on the reference's build — the text-PAIRING renders at
  ≥sm) is **CLOSED**: exactly **3** responsive-text + base-leading
  combos exist in src/ (the landing hero h1/p + the preview-row p),
  all carrying the computed-equal pins (`sm:leading-none` ·
  `sm:leading-[28px]` · `sm:leading-6`). The about/contact
  `leading-relaxed` carriers are OUT of the family BY MECHANISM (no
  responsive text-size token — the value computes at every width on
  both apps, verified live byte-equal at 1920+390).
- **THE INTERNAL-SCROLLER BLIND SPOT (PASS 2 — L-150c1)**: /about +
  /contact do NOT scroll at desktop (scrollH=1080), but at phone they
  scroll INSIDE the shell's `main.overflow-auto` (doc scrollH=844 on
  both; content to y≈1614) — the surface a fullPage capture
  structurally cannot see. The full-geometry census: **/about
  main.scrollHeight 1731 = BOTH** (24 vs 24 elements, 0 diffs) ·
  **/contact 897 = BOTH** (18 vs 18, 0 diffs) — geometry-equal +
  classes-equal ⇒ pixel-equal (the walk39 pattern). The marketing
  phone-state axis is CLEAN.
- **THE SETTINGS PHONE-SHARE DECOMPOSITION (PASS 3/3b/3c)**: the
  standing 3.8% share is the PURE picklist-DATA genus — **all 7 bands
  = row-text/row-count differences** (the reference's live values:
  Call/Email/Website/Partner/Referral/New/Contacted/Qualified/
  Technology/…), ZERO layout bands (the census indices 0-19 aligned
  EQUAL; the card template identical — the 62px row spacing, the
  add-row, the 53px footer). The sweep's own gate pair: 3.633%. **THE
  NEW FINDING — the reference's picklist data is LIVE-EDITED
  INTRADAY**: the ref-vs-ref re-capture (the 07:45 gate capture vs a
  fresh one ~40 min later) drifted **2.653%** — the ours-vs-ref share
  wobbled 3.63 → 6.08 across the same window (the L-150c2 lesson: a
  settings-class trip is FIRST adjudicated by the ref-vs-ref idiom;
  the tripwire stays TIGHT — the s146 doctrine).
- **THE PINS (the s134/s137/s145 pin-only pattern)**:
  `tests/leading-inert-genus.test.ts` NEW +4 (the family-closure
  invariant scanner — a new combo without its pin REDs the suite;
  mutation-proof ×2: the planted about-h1 combo → 3 RED, the stripped
  preview pin → 2 RED, both reverted) · `tests/e2e/marketing-mobile.
  spec.ts` NEW +1 (the walk40 scroll model + the s142 census at 390;
  the intro-paragraph selector re-derived live after the text-filter
  false-RED — the class-derived `.space-y-4 > p` census idiom) ·
  sweep-tool +2 (the LIVE-EDITED-INTRADAY phone-line pin + the
  STANDING_BASELINES comment pin) · the CLAUDE-carrier pins flipped
  (dialog-geometry ×4 + login-family +1) · the docs-counts ladder
  (2173/117/153, badge 2326, the 8→9 spec-file pins, the layer-axis
  to the s150 head).
- **THE VERIFICATION**: lint 0/0 · tsc 0 · **117/2173** · build ·
  **e2e 153/153** · the four viewport gates CLEAN ×4 · the fullpage
  gate CLEAN (the fresh-dev-server house order — the s149
  dev-indicator lesson) · census MATCH · **the VLM battery 2/2** (the
  about pair + the contact pair — both identical except the
  "Edit with Base 44" pill, the standing genus; the pill rides FRESH
  page loads — the SPA-navigating sweeps structurally never see it).
  The captures 341-344.

### Session-151 (2026-10-20) — the internal-scroller census + the dashboard card-header mirror (the F-151c1 remediation rotation)

The workspace RESET (re-cloned at `0f81b55` — the s150 feat `4fdeac2` +
the session_319 log `27163e5` + the owner's `0f81b55` = the
session_320 transcript + the skill-creator bundle); the environment
re-stood (install/.env/db push+seed/census MATCH/chromium/dev
server). probe:ref **#125 STABLE** at the s147/s148/s149/s150
fingerprint — a rotation round on the session_319 candidates, my
judgment: **(c) the internal-scroller axis extended to the app pages'
phone interiors** (the primary walk) + **(a) the login-logo genus
re-decoded live** (the secondary probe).

- **151-a**: the baseline gate GREEN — lint 0/0 · tsc 0 · **117/2173**
  · build · **e2e 153/153** (first run, no flake) — the EXACT s150-ship
  match.
- **151-b**: the drawer battery GREEN (the mobile-nav contract — the
  user's standing particular-attention item) · **probe:ref #125
  STABLE** · **the five drift gates CLEAN ×5** (the fullpage at the
  exact s150-ship values 0.093%/0.316%) · sitemap 11 routes + robots +
  the SEO meta · the tree clean · zero dep changes.
- **walk41 PASS 1 THE FULL-GEOMETRY CENSUS** (both apps logged in at
  390x844, ours at the matched ZERO-DATA state; every element inside
  `main` censused; a greedy resync-alignment decoder): the frame
  contract holds on all 9 app pages · **mainH byte-equal 7/9** — the
  genera decoded + attributed: the lucide DOM-composition genus (our
  0.525 path-normalized icon sets vs its mixed line/polyline/circle
  sets — bounding-box-equal, every page) · the recharts-internal
  genus (the 3px y-axis shift + the zero-data gridline drift — version
  drift below the fold) · the s95 table poke-out now decoded at PHONE
  too (the reference's bare flex-1 cards poke to w=472 inside the 358
  container; ours clamps — its own standing defect) · the settings
  rows = the LIVE-intraday DATA genus (the template identical — the
  62px spacing, the 36px row buttons, the add-row).
- **walk41 PASS 2 F-151c1 THE DASHBOARD'S TWO STALE "+ Add" GHOST
  BUTTONS** (the ONE real defect): our Lead Sources + Upcoming
  Activities CardHeaders carried the **s7-era S7-18 extraction** (75x32
  ghost `h-8 px-3 text-xs text-primary` + the `mr-1` Plus) that the
  CURRENT reference bundle (stable since s147) does NOT render — its
  headers are **title-only (rowH 24 @390 · 28 @1440)**, live-decoded
  on both apps at both widths (the L-148c1 discipline). The count
  math: ours' dashboard +10 = exactly 2 Add subtrees + 2 chart
  wrappers. **The 143-session dead zone**: y≈905 @1440 (below the
  900px sweep fold), y≈2356+ @390 (inside the internal scroller) —
  invisible to all five standing gates; the +16px mainH delta = the
  two 8px rows. THE REMEDIATION: the two buttons + the quickCreate
  state machine + the two dialog mounts + the Plus/entity-dialog
  imports retired; `DASHBOARD_CARD.addBtn`/`addIcon` retired.
- **walk41 PASS 3 THE LOGIN-LOGO GENUS RE-DECODE** (the candidate
  closed): the reference's /login carries an **80x80 (@390) / 96x96
  (@1440) hotlinked logo IMG** (`aspect-square h-full w-full
  object-cover`, now a **supabase storage-render URL** — the asset
  moved) at the page top + the two bottom badge images (the platform
  pill, guest-only); ours draws the 20x20 svg brand-mark in-card.
  The genus STABLE; the claim refreshed. NOT mirrored (the owner's own
  logo asset).
- **THE PINS (TDD)**: `tests/dashboard-interior-parity.test.ts` NEW
  **+4** (the zero-wiring census + the ellipsis-family census + the
  `DASHBOARD_CARD` object-shape freeze + the dead-constants negatives
  — **3 RED at birth** → the implementation → GREEN; the born-green
  survivor census re-asserts the ellipsis family) · the mutation-proof
  ×2 (the replanted button → exactly 1 RED; the replanted constants →
  exactly 2 RED — the pins independent; both reverted → GREEN) · the
  legacy pins flipped (page-layout's DASHBOARD_CARD it → the
  ellipsis-only; dashboard-kpi-parity's quick-create it → the ZERO
  vocabulary; e2e crm.spec 3035 flipped in place — the title-only
  decode + the live rowH 24/24/32, with the nav-trigger haspopup
  false-positive decoded mid-flight: the s47 Radix Sheet idiom is NOT
  a quick-create — the assertion re-narrowed to the s142 haspopup+Add
  form) · the count ladder **UNIT 2173→2177 · SUITES 117→118 · badge
  2326→2330** · the page-layout.ts census HELD at 1687 (the retired
  members offset by the re-anchored comment) · the CLAUDE-carrier pins
  flipped (dialog-geometry ×4) · the SKILL **v1.148.0** + the s151
  head (the s150 layer demoted beneath).
- **THE LESSONS**: **L-151c1 the bundle-stale pin** — a source pin
  extracted against an old bundle (the s7 S7-18) can outlive the
  bundle that justified it through TWO parity events; after any
  bundle event the below-fold interiors' construction pins must be
  re-derived live. **L-151c2 the dead zone is structural** —
  below-every-fold is invisible to ALL five gates by construction;
  the full-geometry census is the only instrument that sees it, and
  it stays a standing rotation axis.
- **THE VERIFICATION**: lint 0/0 · tsc 0 · **118/2177** · build ·
  **e2e 153/153** (the definitive run) · **the five drift gates CLEAN
  ×5** (the fresh-dev-server house order; the dashboard floor
  unchanged — the buttons lived below every fold) · census MATCH ·
  **the VLM battery 2/2** (the phone pair — the fix zone title-only
  on both apps, the framing artifacts decoded; the desktop pair — a
  FULL structural match). The captures 345-348 (the dashboard phone +
  desktop pairs at the fix zone).

### Session-152 (2026-10-20) — the interior census promoted into the STANDING SIXTH GATE (the 152-c rotation)

The workspace stood at the s151 ship (`bd09bbc` + the owner's
`0d98454` session_322 transcript); `git pull` fast-forwarded clean.
The environment verified standing (`.env` root contract · census
MATCH 15/24/10/23/12 + 4 users). probe:ref **#126 STABLE** at the
s147–s151 fingerprint — a rotation round on the session_321
next-round reading's strongest candidate: **the walk41 throwaway
promoted into a standing repo tool** — `scripts/interior-census.ts`,
the full-geometry census across the 9 app pages' phone interiors,
wired as the SIXTH gate (`bun run census:interior -- --fail-on-drift`
chained into `gate:full` after `sweep:fullpage`). The L-151c2 dead
zone — below-every-fold, inside `main.overflow-auto`, invisible to
ALL five pixel gates by construction — is closed STRUCTURALLY, not by
rotation memory.

- **152-a**: the baseline gate GREEN — lint 0/0 · tsc 0 · **118/2177**
  · build · **e2e 153/153** — the EXACT s151-ship match.
- **152-b**: probe:ref **#126 STABLE** · the drawer battery GREEN
  (inside e2e 153/153) · **the five drift gates CLEAN ×5** (the
  fullpage at the exact s151-ship values 0.093%/0.316% at equal
  heights 4990/7259) · sitemap 11 routes + robots · the test configs
  in place · the tree clean · zero dep changes.
- **walk42 PASS 1 — THE MAIDEN CENSUS** (the tool's first run IS the
  walk; the throwaway-probe decode ran 5 decoder rounds against the
  live reference): the v1 greedy-resync decoder (the walk41 idiom,
  13 pins GREEN at birth) measured **79+ unexplained across the 9
  pages** and the decode peeled them face-by-face — the **lucide
  glyph-interior face** (our 0.525 path-normalized icon sets vs its
  mixed sets: the census now EXCLUDES the svg shape vocabulary at the
  collector — the census is a LAYOUT-tree instrument, the icon BOX is
  censused, its version-borne interior never is; the decode caught
  three coincidentally-aligned icon paths sustaining a FALSE resync
  offset and losing the walk's sync) · the **recharts DOM face** (the
  extra wrapper divs by class + the tooltip/axis extras inside paired
  chart boxes) · the **tag-swap face** (the s76 calendar day cells —
  our BUTTON/SPAN vs its DIV at byte-equal boxes: PAIRED across the
  tag difference; the exact-offset form broke on a standing -1px
  subpixel-rounding running offset, the window form fixed) · the
  **wrapper-twin face** (an extra byte-equal to a PAIRED box — the
  reference's space-y-3 nesting wrapper around the paired empty-state
  P) · the **composition-split face** (the reference nests
  [p-4 border-b] > [flex gap-3] where ours merges both — the
  token-superset containment proof) · the **s95 poke-out re-derived
  with the 358px FLOOR discriminator** (only the reference's
  past-the-content-floor widths absorb; an in-container width
  regression stays RED) · the **s16 stock-table container** (our
  shadcn Table wrapper, the s95 in-box-scroll family) · the
  **byte-equal-cls preference** (a nesting wrapper on one side never
  steals its twin's pair — the contacts/activities mispair decode) ·
  the **piecewise direct re-anchor + the sustain-checked pure runs**
  (a coincidental single pair at a stale offset must never steal the
  resync) · **the settings card SEGMENTATION** (the LIVE-DATA page:
  the picklist cards are a fixed template, the card is the alignment
  unit — the row-count deltas stay inside their segment; the decode
  caught a cross-card BACKWARD resync at offset -162, ours card1's
  rows pairing its card2's rows, rows look like rows — structurally
  impossible now). **THE MAIDEN VERDICT: ALL 9 PAGES AT ZERO
  UNEXPLAINED** — mainH byte-equal on the 8 non-settings pages,
  settings Δ+86 the documented LIVE-intraday DATA genus (mainH
  skipped, the L-150c2 doctrine; the shift face report-only; the
  extras face — the row signature + subtree containment — still
  gates), every delta attributed to a named genus.
- **walk42 PASS 2 — THE MUTATION-PROOF** (the structural-cure
  demonstration): the F-151c1 ghost replanted in the Lead Sources
  CardHeader via targeted string surgery → `census:interior --pages
  dashboard --fail-on-drift` → **RED** (mainH Δ+8 — the exact
  F-151c1 row arithmetic — + 39 unexplained: the ghost subtree + the
  displaced below-fold tail) → the string-surgery revert (never
  `git checkout`) → **GREEN** (mainH Δ0 · 0 unexplained). The exact
  defect class that survived 143 sessions now fails the one-command
  gate.
- **THE PINS (TDD)**: `tests/interior-census-tool.test.ts` NEW
  **+22** (the tool + the SIX-gate wiring + the 9-page list contract
  + the lockstep with sweep PAGES + the pure decoder seams: byte-equal
  twins · the ≤3px recharts shifts · the greedy resync · the piecewise
  re-anchor · the tag-swap pairing · the glyph-interior exclusion ·
  the genera whitelist (dead-stub · chart-suppression · s95-wrapper ·
  s95-poke-out · settings-data + subtree · token-mirror · live-data ·
  recharts · tag-swap · wrapper-twin · composition-split) + the s95
  floor discriminator + the byte-equal-cls preference + the
  never-zeroed FINALLY + the `--pages` fail-fast + the settings
  segmentation + the mutation-proof doctrine) — **RED at birth →
  the implementation → GREEN**; the gate-script composite re-anchored
  to the SIX-gate chain (the s152 expected blast radius: the steps
  array + the every-gate-carries-flag filter) · the count ladder
  **UNIT 2177→2199 · SUITES 118→119 · badge 2330→2352** · the 12 RED
  lockstep sites flipped atomically (README ×4 · AGENTS ×2 · PAD ×5 ·
  SKILL ×2) · the CLAUDE-carrier pins flipped ×4 (the 2177 forms
  joining the negatives) · the SKILL **v1.149.0** + the s152 head
  (the s151 layer demoted beneath) + the wall-clock phrase.
- **THE LESSONS**: **L-152c1 the dead zone closed structurally** —
  the interior census as a standing gate converts the L-151c2 blind
  spot from a rotation-memory axis into a one-command gate; the
  F-151c1 class (a below-fold ours-only element) now REDs `gate:full`
  directly. **L-152c2 geometry gates carry no margin** — pixel gates
  need baselines + a raster-floor margin; the census is byte-parity,
  every delta must ATTRIBUTE to a named genus or it is drift (the one
  exception: the settings DATA face, skipped by the L-150c2 doctrine,
  never widened). **L-152c3 the census is a layout-tree instrument**
  — the glyph interiors (lucide paths, recharts curves) are
  version-borne rendering detail; censusing them fed the alignment
  false anchors (three coincidental paths sustained a phantom resync)
  — the BOX is the contract, the interior is never censused.
  **L-152c4 the alignment unit follows the data topology** — a page
  whose sections differ by data-dependent row counts (the LIVE
  settings picklists) must align section-by-section; one continuous
  walk invites cross-section backward resyncs that no amount of
  candidate-ordering can veto (rows look like rows).
- **THE VERIFICATION**: lint 0/0 · tsc 0 · **119/2199** · build ·
  e2e 153/153 · **the SIX drift gates CLEAN ×6** (the five standing +
  the census gate's maiden `--fail-on-drift` pass at all-zero
  unexplained) · census MATCH.

### Session-153 (2026-10-20) — the census DESKTOP leg (the 153-c rotation)

The workspace RESET (re-cloned at `9ba4f83` — the s152 feat + the
session logs); the environment re-stood (bun install, `.env` from
`.env.example` with the root-contract `DATABASE_URL`, db push+seed,
census MATCH 15/24/10/23/12 + 4 users, the Playwright chromium).
**THE S152 WORKLOG GAP FILLED FIRST** (the s149-gap pattern: the
repo worklog ended at Task ID 151 — the s152 ship's worklog record
was lost to a session interruption; reconstructed and appended).
probe:ref **#127 STABLE** at the s147–s152 fingerprint — a rotation
round on the session_323 next-round reading's strongest candidate:
**the census extended past the phone axis — the 1440×900 desktop
interiors walked + gated as the census tool's second leg** (the
F-151c1 axis: the ghost lived at y≈905 @1440, below every desktop
sweep fold; the desktop interiors had never been geometry-censused).

- **153-a**: the baseline gate GREEN — lint 0/0 · tsc 0 · **119/2199**
  · build · **e2e 153/153** — the EXACT s152-ship match.
- **153-b**: probe:ref **#127 STABLE** · the drawer battery GREEN
  (inside e2e 153/153) · **the SIX drift gates CLEAN ×6** (the
  fullpage at the exact standing values 0.093%/0.316% at equal
  heights 4990/7259) · sitemap 11 routes + robots · the tree clean ·
  zero dep changes.
- **THE TOOL EXTENSION (additive)**: `CENSUS_AXES` (phone 390×844 +
  desktop 1440×900) · the `--axis phone|desktop|all` flag (default
  all) · `contentFloor(width)` — the PURE floor seam (the L-153c2
  doctrine: the floor travels with the frame — 358 at phone, 1120
  at desktop) wired into the s95 poke-out discriminator through
  `attributeGenera`'s new floor parameter (back-compat: the 2-arg
  form keeps the phone floor) · the axis-prefixed verdict failures
  · the axis in `--json` · ONE zero-data + ONE seed-restore per
  invocation (the never-zeroed FINALLY spans both legs) ·
  **gate:full UNCHANGED** — `census:interior -- --fail-on-drift`
  now covers both legs internally; the six-gate chain stays six
  commands, the census gate's coverage doubled.
- **walk43 PASS 1 — THE MAIDEN DESKTOP CENSUS**: 7 of 9 pages CLEAN
  at birth (dashboard, accounts, calendar, activities, reports,
  settings, profile — every standing genus reproducing at the
  desktop axis). TWO real decodes:
  - **F-153c1 THE CONTACTS CARD'S mb-6** — the session-6-era spacing
    pin RETIRED: at phone the `lg:hidden mt-6` mobile stub below
    collapsed the adjacent margins to max(24,24)=24 on BOTH apps
    (identical page tails — the census held mainH Δ0 for 147
    sessions); at desktop the stub is display:none and our mb-6 was
    a standing **+24px page-tail delta** — mainH unchanged at both
    axes (the content fits the 836px calc box), the delta lived in
    the white space below the last content, invisible to every
    pixel gate. The reference's card carries NO margin
    (live-decoded at 1440); the FILTER BAR keeps its mb-6 (the
    reference's does carry it). The fix: the class retired + the
    comment re-anchored (contacts-page.tsx).
  - **THE TH-LABEL-STRETCH GENUS** — the s29 th>button accessible
    superset's desktop face: our sortable-header label containers
    are BUTTONs, the reference's DIVs. At phone the columns are
    content-width and the pair is byte-equal (the s152 tag-swap
    face); at desktop the 1120px slack stretches the reference's
    block-level DIV to the TH content box (w177) while our BUTTON
    keeps the UA fit-content sizing (w103) — the content pixels
    identical, only the invisible box stretch differs. Absorbed as
    tag-swap: same top/left/h + byte-equal cls + the same leaf-text,
    ours.w ≤ ref.w; an ours-width OVERFLOW or a different label
    never pairs (real drift, both sides RED).
  - **THE VERDICT: ALL 18 page-axis runs at ZERO unexplained** —
    mainH byte-equal on the 16 non-settings runs, settings skipped
    on both axes (the L-150c2 DATA genus, never widened); the phone
    leg at the EXACT s152 standing values.
- **walk43 PASS 2 — THE DESKTOP MUTATION-PROOF**: the F-151c1 ghost
  replanted in the Lead Sources CardHeader via targeted string
  surgery → `census:interior --axis desktop --pages dashboard
  --fail-on-drift` → **RED** (5 unexplained: the ghost BUTTON +
  the displaced tail, the failure axis-prefixed `[desktop]` — at
  desktop the catch rides the GEOMETRY, mainH stays Δ0 because the
  content fits the calc box; the +8 lives in the row heights,
  exactly the invisible-to-pixel-gates shape) → the string-surgery
  revert → **GREEN**. The F-151c1 class now fails the gate at BOTH
  axes.
- **THE PINS (TDD)**: `tests/interior-census-tool.test.ts` extended
  **+8** (the two-axis CENSUS_AXES contract · the contentFloor pure
  seam · the `--axis` flag · the axis-floor s95 poke-out
  discriminator · the axis-prefixed verdict · the run-loop/--json
  src pins · the th-label-stretch genus · the F-153c1 retirement) —
  **RED at birth → the implementation → GREEN**; the count ladder
  **UNIT 2199→2207 · SUITES 119 held · badge 2352→2360** · the 12
  lockstep sites flipped atomically · the CLAUDE-carrier pins
  (the negatives ladder grew the 2199 forms) · the SKILL
  **v1.150.0** + the s153 head (the s152 layer demoted beneath) +
  the frontmatter version + the Appendix B totals + the layer-axis
  pin.
- **THE LESSONS**: **L-153c1 the dead zone is per-axis** — a
  geometry gate at one viewport proves that viewport only; the
  F-151c1 class lived at BOTH the phone interior (y≈2356 @390) and
  the desktop interior (y≈905 @1440), and only the axis-pair covers
  both. A census axis is cheap (the tool exists); a blind axis is a
  standing gap. **L-153c2 the floor travels with the frame** — the
  s95 poke-out discriminator's floor is a function of the census
  axis (the content column: sidebar + page padding), never a
  constant; the phone's 358 and the desktop's 1120 are the same
  rule at two frames.
- **THE VERIFICATION**: lint 0/0 · tsc 0 · **119/2207** · build ·
  e2e 153/153 · **the SIX drift gates CLEAN ×6** (the census gate
  at BOTH axes in the one standing command) · census MATCH · the
  mutation-proof (planted → RED → reverted → GREEN) · the VLM
  battery 2/2 (the dashboard desktop pair and the contacts desktop
  pair both MATCH) · the captures 353-356.

### Session-154 (2026-10-20) — the census TABLET legs (the 154-c rotation)

The workspace stood (the pull fast-forwarded to `1c10ca8` — the s153 feat
+ the owner's session_326 transcript). probe:ref **#128 STABLE** at the
s147–s153 fingerprint — a rotation round on the session_325 next-round
reading's strongest candidate: **the census extended to the tablet axes —
the 768×1024 + 1024×768 interiors walked + gated as the census tool's
third and fourth legs** (the L-153c1 doctrine: a census axis is cheap, a
blind axis is a standing gap; the sweep-viewport classes and the census
axes now coincide — no blind interior axis remains).

- **154-a**: the baseline gate GREEN — lint 0/0 · tsc 0 · **119/2207**
  · build · **e2e 153/153** — the EXACT s153-ship match.
- **154-b**: probe:ref **#128 STABLE** · the drawer battery GREEN
  (inside e2e 153/153) · **the SIX drift gates CLEAN ×6** (the fullpage
  at the exact standing values 0.093%/0.316%) · sitemap 11 routes +
  robots · the tree clean · zero dep changes.
- **THE TOOL EXTENSION (additive, data-driven)**: `CENSUS_AXES` gains
  `tablet` 768×1024 + `landscape` 1024×768 — the two entries were ALL
  the implementation took (the s153 abstraction at work); the floor
  seam needed NO change (768→448, 1024→704 already fall out of the
  standing formula — the sidebar is in flow from **md**, not lg:
  `hidden md:flex w-64`, page-layout.ts:203).
- **walk44 PASS 1 — THE MAIDEN TABLET + LANDSCAPE CENSUS**: the first
  run surfaced four real decode zones (the maiden walk doing its job);
  the phone + desktop legs held their EXACT standing values throughout:
  - **F-154c1 THE PX-LESS ELLIPSIS ICON FACE** — our two dashboard
    header ellipsis buttons carried the CVA `size="sm"`'s stale
    `px-3 text-xs` (the s7-era ghost vocabulary the reference's
    construction lacks). At 1440 both render 32×32 (w-8 dominates,
    the pair absorbs as token-mirror); at the TIGHT 1024 title row
    (217px cards) the px-3 inflated our min-content past w-8 and
    BLOCKED the flex-yield the reference's bare h-8 w-8 performs —
    title zone 137 vs 150, 3-line vs 2-line wrap, **+28px header,
    +1px mainH**, the space-y-hazard cls pair decoding as a shift
    (the hidden token finally had a geometry effect at the new axis).
    The fix: `size="sm"` → `size="icon"` (the per-row site's own
    px-less precedent; the landscape dashboard leg went CLEAN on the
    fix alone).
  - **THE S95 GENUS'S THREE NEW FACES** (the reference's own standing
    defect, never mirrored): the **tablet cascade** — the poke's
    DESCENDANTS (the search row 440 + the input 335 inside the ref's
    poked 472 card) absorb via the registered poke-box containment
    (the floor test alone misses them: their widths sit ≤ the 448
    floor); the **landscape LG FORM** — at 1024 the ref's bare flex-1
    does NOT poke past the floor (472 ≤ 704): its min-content eats
    the flex row's fair share and **SQUEEZES ITS OWN byte-equal-cls
    w-80 filters rail** (ours 320 @416, the ref 208 @528 — the RIGHT
    EDGES COINCIDENT at 736, the flex row's boundary); the
    construction-signature cls form (ours `[flex-1 min-w-0]` vs the
    ref's bare `[flex-1]`) carries the attribution, the rail twins +
    the whole squeezed subtree absorb as the cascade; the
    **displaced twins** — the Export CSV pair (byte-equal tag/text/
    w/h at the same top, the cls modulo the standing token
    vocabulary, the ref twin inside a poke box).
  - **THE SETTINGS DATA GENUS'S TIGHT-FRAME FACES** (the L-150c2
    doctrine's extras face, restored): the **row-boxes-from-matches
    pass** — the picklist rows pair as byte-equal 166×54 MATCHES at
    768 while the different LIVE-intraday label texts drive different
    flex cascades inside them (ours' labels win 86px vs the ref's
    108px → different button boxes 32 vs 21); the row boxes from ALL
    events (matches included) restore the containment; the
    **VERTICAL displaced twins** — the add-row + footer constructions
    displaced past the aligner's windows by the row-count cascade
    (dTop 12 = the mainH delta): same tag/text/w/h/left + dTop ≤ 96
    (the displaced-tail scale; a planted duplicate 300px below stays
    RED).
  - **THE VERDICT: ALL 36 page-axis runs at ZERO unexplained** —
    mainH byte-equal on the 32 non-settings runs, settings SKIPPED
    at all four axes (the L-150c2 DATA genus, never widened); the
    phone leg at the EXACT s152 standing values, the desktop leg at
    the EXACT s153 values.
- **walk44 PASS 2 — THE TABLET MUTATION-PROOF**: the F-151c1 ghost
  replanted in the Lead Sources CardHeader via targeted string
  surgery → `census:interior --axis tablet --pages dashboard
  --fail-on-drift` → **RED** (38 unexplained: the ghost subtree + the
  displaced tail, **+ mainH Δ4** — at tablet the ghost rides BOTH the
  geometry and mainH; the failure axis-prefixed `[tablet]`) → the
  string-surgery revert → **GREEN**. The F-151c1 class now fails the
  gate at ALL FOUR axes.
- **THE PINS (TDD)**: `tests/interior-census-tool.test.ts` extended
  **+10** (the four-axis CENSUS_AXES contract FLIPPED in place + the
  parseAxisArg ALL flip + the md-boundary floor face [767→703 vs
  768→448 — **L-154c1 the boundary is an axis**: the floor DROPS 255px
  at exactly md because the sidebar enters flow; a wider frame CAN
  floor lower at a breakpoint] + the --axis new names + the four-axis
  verdict + the data-driven run-loop pin + F-154c1 + the s95 lg
  cls-form + the cascade + the rail-squeeze + the settings row-boxes
  + the settings vertical twins; the s152 poke-out negative
  re-anchored to the outside-the-poke-cascade form) — **RED at birth
  → the implementation → GREEN**; the count ladder **UNIT
  2207→2217 · SUITES 119 held · badge 2360→2370** · the 12 lockstep
  sites flipped atomically (count-ladder-154.py, assert-first) · the
  CLAUDE-carrier pins (the negatives ladder grew the 2207 forms) ·
  the SKILL **v1.151.0** + the s154 head (the s153 layer demoted
  beneath) + the Appendix B totals + the layer-axis pin.
- **THE VERIFICATION**: lint 0/0 · tsc 0 · **119/2217** · build ·
  e2e **153/153 (the definitive run** — two order/load flakes in the
  settings tab family re-run clean in isolation + the full suite) ·
  **the SIX drift gates CLEAN ×6** (the four viewport + the fullpage
  at the exact standing values + the census gate at ALL FOUR axes in
  the one standing command, all-36 zero unexplained) · census MATCH ·
  the mutation-proof (planted → RED → reverted → GREEN) · the VLM
  battery 2/2 (the dashboard landscape pair MATCH; the accounts
  landscape pair — the VLM independently confirms the reference's own
  squeezed rail vs our intended layout) · the captures 357-360.

### Session-155 (2026-10-20) — the census LANDING public leg (the 155-c rotation)

The workspace stood (the pull fast-forwarded to `9616106` — the s154
feat `db27237` + the session logs + the owner's session_328
transcript). probe:ref **#129 STABLE** at the s147–s154 fingerprint —
a rotation round on the session_327 next-round reading's strongest
candidate: **the census extended past the 9 auth'd app pages to the
PUBLIC MARKETING LANDING at `/` — the landing walked + gated as the
census tool's PUBLIC leg at ALL FOUR axes** (the L-153c1 doctrine's
surface face: the s153/s154 axis pair closed the viewport gaps, the
SURFACE gap is the same lesson at 90 degrees — the landing is the
last never-geometry-walked surface; its standing gates were
pixel-margin only [the fullpage 0.093%/0.316% at desktop+phone] with
the tablet/landscape interiors FULLY blind).

- **155-a**: the baseline gate GREEN — lint 0/0 · tsc 0 · **119/2217**
  · build · **e2e 153/153** (clean first run) — the EXACT s154-ship
  match.
- **155-b**: probe:ref **#129 STABLE** · the drawer battery GREEN
  (inside e2e 153/153 — the mobile-nav contract, the user's standing
  particular-attention item) · **the SIX drift gates CLEAN ×6** (the
  four viewport + the fullpage at the exact standing values + the
  census gate all-36 zero unexplained) · sitemap 11 routes + robots
  · db census MATCH · the tree clean · zero dep changes.
- **THE PUBLIC-LEG DESIGN (additive — the app-pages protocol
  byte-identical)**: `PUBLIC_PAGES = [{ name: "landing", path: "/" }]`
  + `CENSUS_ALL_PAGES` (the combined 10-name `--pages` filter —
  `--pages landing` runs ONLY the public leg, no login phase) +
  `isPublicPage` dispatch + `censusPublicPage` (the GUEST-context
  collector: **GUESTS, no login** — the s149 fullpage doctrine; the
  anchor `div.min-h-screen.bg-white` — ours `id="top"` at body
  level, the reference's `#root` first child — so the guest pill
  [the body-level `div#base44-edit-badge` sibling, position:fixed]
  and both apps' Toaster portal sit OUTSIDE the census; the height
  seam `docH = documentElement.scrollHeight` — the landing scrolls
  the DOCUMENT; the floor the VIEWPORT column — the s95
  discriminator travels with the frame) + the per-axis guest
  contexts GUARDED (an app-empty selection never logs in; a
  public-empty selection never opens guests); gate:full UNCHANGED
  — the census command covers the public leg internally, the
  six-gate chain stays six commands.
- **walk45 PASS 1 — THE MAIDEN LANDING CENSUS**: ALL FOUR axes born
  CLEAN — **docH byte-equal Δ0 at every axis** (phone 7259 · desktop
  4990 — the fullpage gate's equal heights — and the two
  NEVER-MEASURED tablet/landscape docH byte-equal too), 364/364
  elements, every delta attributed: **token-mirror 43** (the s142
  documented deviations riding byte-equal boxes — the working
  `truncate` vs the reference's dead `rounded-truncate` token, the
  leading/max-w-2xl cls families) · **composition-split 3** (the
  walk45 decode below) · **recharts-internal 6/7** (the sub-3px
  rounding drift through the FAQ/footer box stacks — the ≤3px
  genus's bound, 1px at three axes, a +1 height face at landscape).
- **THE WALK45 DECODES** (the maiden census's real findings — the
  audit discipline: verify the genera truthfully NAMED, never
  mis-bucketed):
  - **THE TEXT-NODE CARDINALITY FACE**: the maiden run read the
    three pricing-tier amounts as **live-data** — WRONG genus
    (live-data means the reference's intraday WORKSPACE data; the
    landing is static marketing, it has none). The raw-byte probe
    decoded the truth: the reference's SPAN carries **two text
    nodes** `[TEXT("$"), TEXT("8")]` where ours carries **one**
    `[TEXT("$8")]` — `textContent` byte-equal on both apps
    (`"$8"`, live-verified codepoint-by-codepoint); the census's
    leaf-text `join(" ")` between direct text nodes is the ONLY
    witness. **THE HAZARD**: unscoped, live-data had absorbed the
    landing's pricing pairs — a future reprice would have been
    SILENTLY absorbed with them. **THE FIX**: the cardinality face
    (whitespace-stripped byte-equal texts at byte-equal boxes →
    composition-split, page-agnostic — at byte-equal boxes a real
    rendered space would widen the box and pair as geometry, so
    only the join artifact reaches this face) + **live-data
    WORKSPACE-SCOPED** (text-only pairs stay RED on the static
    marketing surfaces; the app pages' standing behavior
    unchanged).
  - **TWO LATENT DECODER DEFECTS** the decode's negatives exposed
    (masked for THREE sessions because pass 1 absorbed every
    paired kind — the landing's workspace-scoped fall-through was
    the first paired event to ever reach the later passes):
    `pairedOpposite` **self-matched its own pairedEvents entry**
    (an event's own box trivially contains its own element + its
    own cls tokens are a subset of themselves) and the
    **wrapper-twin pass self-matched its own pairedBoxes entry**
    (the same shape) — a paired event could never legitimately
    reach either pass, so the dead code was never exercised; both
    now EXCLUDED (a paired event can never self-absorb). Pinned
    with negatives both.
- **walk45 PASS 2 — THE LANDING MUTATION-PROOF**: a ghost div
  planted in the hero CTA row via targeted string surgery →
  `census:interior --pages landing --fail-on-drift` → **RED**
  (phone: 320 unexplained + **docH Δ44** — the ghost stacks in
  the flex-col CTA row, riding BOTH the geometry and docH;
  tablet/landscape: 7 each — the geometry catch alone at flex-row
  frames; exit 1, the failure axis-prefixed) → the string-surgery
  revert → **GREEN** (exit 0, the exact standing values). The
  F-151c1 class now fails the gate on **every censused surface** —
  the 9 app pages AND the public leg, at all four axes.
- **THE PINS (TDD)**: `tests/interior-census-tool.test.ts` extended
  **+8** (the PUBLIC_PAGES contract + the walk45 anchor-seam src
  pin [the selector · the pill exclusion documented ·
  documentElement.scrollHeight · the viewport floor] + the
  combined `--pages` composition over the 10-name list + the
  guest-context run loop with both guards + the landing verdict
  [docH never skipped — no DATA genus on a static surface] + the
  landing mutation-proof doctrine + the TEXT-NODE CARDINALITY face
  [pinning the pairedOpposite self-match] + the live-data
  WORKSPACE-SCOPING [pinning the wrapper-twin paired self-match];
  the s152 nine-page pin's title re-anchored) — **5 RED + 2 RED at
  birth → the implementation → GREEN**; the count ladder **UNIT
  2217→2225 · SUITES 119 held · badge 2370→2378** · the 19 sites
  flipped atomically (count-ladder-155.py, assert-first — the 17
  live lockstep sites + **2 s154-audit RESTORES**: the s154
  global flip had corrupted the AGENTS Session-153 historical
  clauses [`2199→2217` → restored `2199→2207`, `119/2217` →
  restored `119/2207` — the s153-era values, caught by this
  round's historical audit]) · the CLAUDE-carrier negatives
  ladder grew the 2217 forms · the SKILL **v1.152.0** + the s155
  head (the s154 layer demoted beneath) + the Appendix B totals +
  the layer-axis pin flipped.
- **THE LESSONS**: **L-155c1 a blind surface is a standing gap**
  (the axis doctrine's surface face: pixel-margin gates absorb
  real drift by construction — the s149 walk39 proof: three
  decodes accumulated on the landing between bundle events; the
  census's byte-parity zero-margin contract is the standing cure)
  · **L-155c2 the context class follows the surface** (the public
  leg censuses GUESTS — the logged-in protocol [login + zero-data
  + the app chrome] is the WRONG instrument for a public
  marketing surface; the anchor + the height seam + the floor
  travel with the surface's own scroller [the document], never
  one-size-fits-all) · **L-155c3 the decoder's passes are only as
  tested as their reachable inputs** (two self-match paths sat
  dead for three sessions because no paired event could ever
  reach them — a new surface class exercised the dead code and
  the negatives caught it; the mutation-proof doctrine extends to
  the decoder itself).
- **THE VERIFICATION**: lint 0/0 · tsc 0 · **119/2225** · build ·
  e2e **153/153 (the definitive run** — the M-72c1 focus window's
  cold-isolation face: 3/3 isolation failures on the 2-core cold
  boot, the epoch remount reverting the fill [the s154 pattern's
  mirror — there the suite flaked and isolation passed]; the full
  suite's warmed pipeline holds it) · **the SIX drift gates CLEAN
  ×6** (the four viewport + the fullpage at the exact standing
  values 0.093%/0.316% at equal heights 4990/7259 + **the census
  gate at ALL FOUR axes × 10 surfaces — 40 page-axis runs, all
  zero unexplained**, the 36 standing runs at their exact standing
  values, settings SKIPPED at all four axes) · census MATCH · the
  mutation-proof (planted → RED → reverted → GREEN) · the VLM
  battery 2/2 (the phone pricing pair MATCH; the tablet hero pair
  — every element identical per the VLM's own analysis, the
  reference's guest pill the only difference on both adjudications
  — the documented genus, never mirrored) · the captures 361-364.

### Session-156 (2026-10-20) — the census ABOUT/CONTACT legs (the 156-c rotation)

The workspace stood (the pull fast-forwarded to `b673bd9` — the s155
feat `30c17b3` + the session logs + the owner's session_330
transcript). probe:ref **#130 STABLE** at the s147–s155 fingerprint —
a rotation round on the session_329 next-round reading's
first-listed candidate: **the two remaining never-censused shell
surfaces — /about + /contact — join INTERIOR_PAGES (the 11-page
interior list; the census covers 12 surfaces at all four axes = 48
page-axis runs)** (the L-155c1 doctrine's completion: the s155 leg
closed the public surface gap; the marketing PAIR were the last
never-geometry-walked shell pages — held above-fold-only by the
sweeps since s144, hand-walked once at phone by the s150 round, their
tablet/landscape/desktop interiors never decoded).

- **156-a**: the baseline gate GREEN — lint 0/0 · tsc 0 · **119/2225**
  · build · **e2e 153/153** (clean first run) — the EXACT s155-ship
  match.
- **156-b**: probe:ref **#130 STABLE** · the drawer battery GREEN
  (inside e2e 153/153 — the mobile-nav contract, the user's standing
  particular-attention item) · **the SIX drift gates CLEAN ×6** (the
  four viewport + the fullpage at the exact standing values
  0.093%/0.316% at equal heights 4990/7259 + the census gate at 40
  page-axis runs, all zero unexplained) · sitemap 11 routes + robots
  200 · db census MATCH 15/24/10/23/12 + 4 users · the tree clean ·
  zero dep changes.
- **THE PRE-PLAN PROBE (the plan validated BEFORE execution)**: the
  reference's /about + /contact re-decoded logged-in at the current
  #130-stable bundle — **mainH byte-equal both apps** (/about 1731
  phone · 1047 desktop — never measured before; /contact 897 · 953),
  element counts 46/46 + 33/33 inside main, the construction current
  (both apps render the pair inside `main.overflow-auto` — the
  reference's own main `bg-gray-50` vs ours `bg-background`, the
  token-mirror face on main ITSELF, never censused: the walk covers
  main's children only). The s150 evidence (6 sessions old) confirmed
  standing; the `censusPage` collector works on the legs AS-IS.
- **THE LEGS DESIGN (additive — the logged-in protocol
  byte-identical)**: `INTERIOR_PAGES` grows 9→11 (about + contact
  appended after profile; the sweep lockstep held — both paths
  standing sweep PAGES since s144) · `CENSUS_ALL_PAGES` grows 10→12 ·
  **THE LIVE-DATA SCOPE RE-ANCHOR (the 156-c hazard face)**:
  about/contact are STATIC marketing surfaces inside the shell — the
  s155 scoping keyed on `!isPublicPage` and would have absorbed
  text-only drift on the first static interior page (a changed
  headline on /about silently absorbed — the walk45 hazard reopened
  at 90°); the fix is the **STATIC_MARKETING_PAGES scope** (landing +
  about + contact — `isStaticMarketingPage`): live-data absorbs
  text-only pairs on the 9 DATA pages only, the static-marketing
  class stays RED, public or interior · the tool header's stale
  "marketing surfaces (landing/about/contact) … no main.overflow-auto
  interior" claim RETIRED (about/contact ARE main-interior logged-in;
  the landing and login are the true no-main surfaces) ·
  **gate:full UNCHANGED** — the six-gate chain stays six commands (the
  census gate grows to 48 page-axis runs internally).
- **walk46 PASS 1 — THE MAIDEN CENSUS**: ALL FOUR axes born CLEAN —
  **mainH Δ0 at every axis**, **30/30 + 25/25 elements, every one a
  MATCH, zero genera, zero unexplained** (the s142 live-censused
  construction held: the about cards' `sm:grid-cols-2` regime, the
  h1's `sm:text-4xl`, the container's `sm:px-8` — all byte-equal both
  apps at the never-measured tablet/landscape frames). A clean maiden
  walk — no decode needed; the maiden-decode discipline's first
  all-MATCH round.
- **walk46 PASS 2 — THE ABOUT MUTATION-PROOF**: a ghost card div
  planted in the about cards grid via targeted string surgery →
  `census:interior --pages about --fail-on-drift` → **RED** (phone: 28
  unexplained + **mainH Δ82** — the ghost stacks in the 1-col grid,
  riding BOTH the geometry and mainH; desktop: 23 + **Δ162** — a full
  2-col row slot; exit 1, the failure axis-prefixed) → the
  string-surgery revert → **GREEN** (exit 0, the exact standing
  values). The F-151c1 class now fails the gate on **all TWELVE
  censused surfaces** — the 9 app pages + the landing public leg +
  the about/contact marketing pair, at all four axes.
- **THE PINS (TDD)**: `tests/interior-census-tool.test.ts` extended
  **+4** (the legs contract [INTERIOR_PAGES 11 + the sweep lockstep +
  the header-doctrine re-anchor] + the STATIC_MARKETING_PAGES scope
  [the hazard face: the fixture negatives keep a text-only pair RED on
  about/contact while the contacts positive holds the standing
  live-data behavior] + the about/contact verdict [mainH never
  skipped — no DATA genus on the static legs; the axis-prefixed
  failure forms; the settings skip untouched] + the
  mutation-proof/--pages doctrine) — **6 RED at birth + 1
  born-green** (the verdict pin — `censusVerdict` surface-agnostic,
  correctly; the s155 pattern) → the implementation → GREEN; the
  re-anchors: the s152 nine-page pin → the 11-page contract, the s155
  PUBLIC_PAGES contract + the --pages composition pins (10→12); the
  count ladder **UNIT 2225→2229 · SUITES 119 held · badge 2378→2382**
  (the live lockstep sites flipped atomically, count-ladder-156.py,
  assert-first; the historical clauses preserved — the AGENTS/PAD
  s155 records, the docs-counts s155 history block) · the
  CLAUDE-carrier negatives ladders grew the 2225 forms (all four
  carrier families) · the SKILL **v1.153.0** + the s156 head (the
  s155 layer demoted beneath) + the Appendix B totals + the
  layer-axis pin flipped.
- **THE LESSONS**: **L-156c1 the surface class, not the route group,
  names the protocol** (about/contact live in the "marketing" route
  group but scroll like app pages — the collector follows the
  SCROLLER, never the label) · **L-156c2 the hazard scope must name
  the SURFACE CLASS, not the dispatch** (keying live-data on
  `!isPublicPage` was correct only while every interior page carried
  workspace data — the first static interior page would have reopened
  the walk45 hazard; the static-marketing class is the invariant) ·
  **L-156c3 a clean maiden walk is the construction's own proof**
  (the s142 live-census discipline: pages built from the reference's
  own DOM byte-for-byte need no decoder faces — the census's all-MATCH
  maiden round is what parity looks like when the source was never
  approximated).
- **THE VERIFICATION**: lint 0/0 · tsc 0 · **119/2229** · build ·
  e2e **153/153** (clean first run) · **the SIX drift gates CLEAN
  ×6** (the four viewport + the fullpage at the exact standing values
  + **the census gate at ALL FOUR axes × 12 surfaces — 48 page-axis
  runs, all zero unexplained**, the 40 standing runs at their exact
  standing values, settings SKIPPED at all four axes, the new legs at
  their maiden values) · census MATCH · the mutation-proof (planted →
  RED at phone + desktop → reverted → GREEN) · the VLM battery 2/2
  (the about tablet pair MATCH — every element identical; the contact
  phone pair MATCH — the reference's Base44 pill the only difference
  on both adjudications — the documented genus, never mirrored) · the
  captures 365-368 (the about cards-grid zone at the never-measured
  768 frame + the contact email-card zone, both logged-in pairs,
  scrolled + verified in-frame).

### Session-157 (2026-10-21) — the census LOGIN-WALL leg (the 157-c rotation)

The workspace stood (the fresh clone + the standing env rebuilt: .env
from `.env.example` + `db:push`/`db:seed` census MATCH · the Playwright
chromium installed · the dev server standing). probe:ref **#131
STABLE** at the s147–s155 fingerprint — a rotation round on the
session_331 next-round reading's strongest candidate: **the login wall
at /login — the LAST never-censused rendered surface — joins
INTERIOR_PAGES (the 12-page interior list; the census covers 13
surfaces at all four axes = 52 page-axis runs)** (the surface census
arc's completion: standing-gate s152 → desktop s153 → tablet/landscape
s154 → landing s155 → about/contact s156 → **the login wall s157 —
every rendered surface now walked + gated**).

- **157-a**: the baseline gate GREEN — lint 0/0 · tsc 0 · **119/2229**
  · build · **e2e 153/153** (clean first run) — with **ONE FINDING**: the
  unit suite's EXIT CODE reds on a fresh box — `scripts/fullpage-sweep.ts`'s
  top-level `run()` fires UNCONDITIONALLY on the vitest import (the
  direct-execution guard idiom its two siblings `sweep.ts` /
  `interior-census.ts` both shipped with was missed at s149); with no
  :3000 listener the import throws → `process.exit(1)` → the
  vitest-patched exit throws an unhandled rejection → exit 1 with ALL
  2229 checks passing — the green masked behind the standing dev
  server for 8 sessions, and the first-run `bun run test` documented in
  AGENTS.md failing on a fresh clone. **D-157a0 remediated it** (the
  RED pin → the siblings' exact guard → GREEN; the direct run
  re-verified clean).
- **157-b**: probe:ref **#131 STABLE** · the drawer battery GREEN
  (inside e2e 153/153 — the mobile-nav contract) · **the SIX drift
  gates CLEAN ×6** (the four viewport + the fullpage at the exact
  standing values 0.093%/0.316% at equal heights 4990/7259 + the
  census gate at 48 page-axis runs, all zero unexplained) · sitemap 11
  routes + robots 200 + the SEO meta · db census MATCH 15/24/10/23/12
  + 4 users · the tree clean · zero dep changes.
- **THE PRE-PLAN PROBE (the plan validated BEFORE execution)**: the
  reference's /login decoded at the #131 bundle, GUEST and LOGGED-IN,
  phone + desktop — **both apps render /login inside `main` with
  byte-equal classes** (`min-h-screen flex items-center justify-center
  bg-gradient-to-br from-slate-50 to-slate-100 p-4`), **mainH byte-equal
  both apps both contexts** (844 phone · 900 desktop — never measured
  before), **els 51/51** in all four context-axis combos, **GUEST and
  LOGGED-IN render the IDENTICAL card** (the S23-P2
  card-to-authed-visitors evidence re-validated) — the censusPage
  collector works AS-IS and the LOGGED-IN protocol is FREE (the census
  login phase already runs; no guest contexts needed).
- **THE LEG DESIGN (additive — the logged-in protocol
  byte-identical)**: `INTERIOR_PAGES` grows 11→12 (login appended
  after contact; the sweep lockstep held — login is a standing sweep
  PAGES path since S96) · `CENSUS_ALL_PAGES` grows 12→13 (the census
  gate grows to 52 page-axis runs) · **THE SCOPE FLIP (the 157-c
  hazard face)**: the login wall is a STATIC-AUTH surface — no
  workspace data — and the s156 keying was NEGATIVE
  (`!isStaticMarketingPage` — absorb unless listed), correct only
  until the next static surface arrives; the login leg was the next
  face of the exact walk45 hazard both re-anchors closed, so the scope
  flips to the POSITIVE DATA class: `CENSUS_DATA_PAGES` (the 9 app
  pages) + `isCensusDataPage` — live-data absorbs text-only pairs
  ONLY on members, every other surface (landing, about, contact,
  **login**, any future surface) REDs BY DEFAULT
  (`STATIC_MARKETING_PAGES`/`isStaticMarketingPage` RETIRED, the s156
  pins re-anchored) · the header's "and login have no main interior"
  claim RETIRED (login IS a main interior — the probe's first
  finding) · **gate:full UNCHANGED** — the six-gate chain stays six
  commands.
- **THE RATE-LIMIT DECODE (the operational finding)**: the census
  retry failures mid-round were NOT the M-72c1 CPU-contention lineage
  — the dev log showed `POST /api/auth/login 429`: the census logs
  into ours once per axis (4/invocation) and the login limiter is 10
  per IP/15 min (fixed-window, 429s also increment) — back-to-back
  census invocations exhaust the bucket (the maiden + the failed
  retries burned it). Resolution: the dev-server restart clears the
  per-process bucket; the maiden + the mutation-proofs + the sweeps
  then fit the 10-login budget per window. The limiter itself is the
  production security contract — untouched.
- **walk47 PASS 1 — THE MAIDEN CENSUS**: **ALL FOUR axes born CLEAN —
  mainH Δ0 at every axis, 43/43 elements: 23 matches + 19
  token-mirror + 1 wrapper-twin + 1 login-logo-mark, zero
  unexplained** (the maiden's one decode face — see below). The
  s96-era login construction held: the card boxes byte-equal at every
  axis (358×650 phone · 448×710 desktop), the cls-only pairs absorbing
  as the standing token-mirror family (the card container, the google
  button, the accent strip order).
- **THE LOGIN-LOGO-MARK GENUS (the walk47 decode)**: our CSS brand
  mark — the 40×40 `flex h-10 w-10 … rounded-full bg-sidebar
  sm:h-12 sm:w-12` SPAN centered in the ring — is ours-extra at every
  axis; the raw-byte probe decoded the reference's construction: its
  ring loads the **WORKSPACE OWNER'S UPLOADED LOGO** (a Base44-prod
  Supabase storage img — the owner's own "Screenshot2026-02-05…png"
  upload, keyed to the workspace id — LIVE BRANDING DATA, the
  Base44-pill genus class, **never mirrored**); the ring boxes pair
  byte-equal as cls-only token-mirrors and the ref img absorbs as the
  ring's wrapper-twin. The genus absorbs ONLY the exact standing
  signature (`loginLogoMarkSignature`, the settingsRowSignature idiom
  — order-independent exact-token matching + the SPAN tag): a
  different tag, a restyled token set, or the same shape on another
  page stays RED (the mutation-proof guard, pinned with negatives
  all).
- **walk47 PASS 2 — THE LOGIN MUTATION-PROOF**: a ghost div planted
  under the login card's subtitle via targeted string surgery →
  `census:interior --pages login --axis phone --fail-on-drift` →
  **RED** (phone: 44/43 els, 42 unexplained — the ghost + the
  displaced card tail; mainH Δ0 — the taller card still fits the 844
  viewport, the catch rides the GEOMETRY alone, the s153 desktop
  form; desktop: 40 unexplained; exit 1, the failure axis-prefixed)
  → the string-surgery revert (zero src diff) → **GREEN** (exit 0,
  the exact standing values). The F-151c1 class now fails the gate on
  **all THIRTEEN censused surfaces** — the 9 app pages + the landing
  public leg + the about/contact marketing pair + **the login wall**,
  at all four axes.
- **THE PINS (TDD)**: `tests/fullpage-sweep-tool.test.ts` +1 (the
  DIRECT-EXECUTION guard — the siblings' idiom pinned, the unguarded
  top-level call RETIRED) · `tests/interior-census-tool.test.ts`
  +3 (the login leg contract [INTERIOR_PAGES 12 + the sweep lockstep +
  the not-public dispatch] + the login mutation-proof doctrine
  [--pages login] + the LOGIN-LOGO-MARK genus [the fixture positives
  + the tag/restyle/page negatives + the src pins]); the re-anchors:
  the s152 11-page pin → the 12-page contract, the s155 PUBLIC/composition
  pins 12→13, the s156 legs/scope/verdict/doctrine pins re-anchored to
  the positive DATA keying — **7 RED at birth + 1 born-green** (the
  verdict login rows — `censusVerdict` surface-agnostic, the
  s155/s156 pattern) → the implementation → GREEN; the count ladder
  **UNIT 2229→2233 · SUITES 119 held · badge 2382→2386** (the live
  lockstep sites flipped atomically, count-ladder-157.py, assert-first,
  idempotent; the historical clauses preserved — the AGENTS/PAD s156
  records, the session_331/332 records, the plans, the worklog) · the
  CLAUDE-carrier negatives ladders grew the 2229 forms (all four
  carrier families) · the SKILL **v1.154.0** + the s157 head (the
  s156 layer demoted beneath) + the Appendix B totals + the layer-axis
  pin flipped.
- **THE LESSONS**: **L-157c1 the entry guard is part of the tool's
  contract** (a script that runs on import is a test-time bomb — the
  guard is what makes the seams-and-pins doctrine safe; the s149 tool
  missed the idiom its two siblings shipped with and the defect sat
  masked behind the standing dev server for 8 sessions) · **L-157c2
  the scope's DEFAULT is the hazard's next face** (the negative keying
  — absorb unless listed — re-opens the walk45 hazard on every new
  static surface; the positive keying — absorb only on the DATA class
  — makes the default RED and the hazard impossible; L-156c2 taken to
  the invariant) · **L-157c3 the census's own login is a scarce
  resource** (the rate limiter is the production contract, not a bug —
  the gate cadence must budget its logins: 4/invocation vs 10 per
  window; the dev-server restart clears the per-process bucket, and
  the "CPU-contention" M-72c1 lineage was at least partly this all
  along).
- **THE VERIFICATION**: lint 0/0 · tsc 0 · **119/2233** · build · e2e
  **153/153** (clean first run) · **the SIX drift gates CLEAN ×6**
  (the four viewport + the fullpage at the exact standing values +
  **the census gate at ALL FOUR axes × 13 surfaces — 52 page-axis
  runs, all zero unexplained**, the 48 standing runs at their exact
  standing values, the login leg at its maiden values) · census MATCH
  · the mutation-proof (planted → RED at phone + desktop → reverted →
  GREEN) · the VLM battery 2/2 (the phone card pair MATCH — every
  element identical; the desktop logo-mark pair MATCH — the logo
  content + the reference's Base44 pill the only differences on both
  adjudications — the documented genera, never mirrored) · the
  captures 369-372 (the phone login-card pair at the mutation-proof
  zone + the desktop logo-mark pair at the genus zone — both
  logged-in pairs, scrolled + verified in-frame).

### Session-158 (2026-10-21) — the census PARALLEL-AXES option (the 158-c rotation)

The workspace stood (the fresh clone + the standing env: .env from
`.env.example` + `db:push`/`db:seed` census MATCH · the Playwright
chromium installed · the dev server standing). probe:ref **#132 STABLE**
at the s147–s155 fingerprint — a rotation round on the session_333
next-round reading's strongest candidate: **the census runtime
optimization — the 52-run gate's wall-clock. The four axis walks run
CONCURRENTLY (`--parallel N`, default 1 = the standing sequential
protocol byte-identical) with the logins staggered.**

- **158-a**: the baseline gate GREEN — lint 0/0 · tsc 0 · **119/2233**
  (clean exit — the s157 entry-guard fix holds on the fresh box) ·
  build · **e2e 153/153** (clean first run — the drawer battery inside,
  the mobile-nav contract).
- **158-b**: probe:ref **#132 STABLE** · **the SIX drift gates CLEAN
  ×6** (the four viewport sweeps [one cold-boot calendar flake re-run
  clean — the documented lineage] + the fullpage at the exact standing
  values 0.093%/0.316% at equal heights 4990/7259 + the census gate at
  52 page-axis runs, all zero unexplained) · sitemap 11 routes +
  robots 200 + the SEO meta · db census MATCH · the tree clean · zero
  dep changes.
- **THE PRE-PLAN PROBE** (scratch, cleaned): the A/B experiment on this
  2-core box, the exact censusPage protocol, the zero-data state, 3
  risk-class pages × all four axes — **A the sequential control 120s ·
  B the concurrent run (logins staggered 4000ms) 44s — 2.7× on the
  subset, all 24 walks STABLE at the exact standing values, mainH Δ0
  everywhere** — the 4-way design validated (and the wall-clock
  projection later confirmed conservative).
- **THE DESIGN (additive)**: `planAxisBatches` (the pure partition —
  consecutive batches of ≤N, order-preserving, capped at the axes
  count, parallel 1 = one axis per batch = the standing semantics) +
  `LOGIN_STAGGER_MS` 4000 (worker i of a batch delays its login phase
  by i×4000 — the no-burst budget form) + `parseParallelArg` (the
  --axis fail-fast idiom) + the `walkAxis` extraction (the standing
  per-axis body verbatim) + **the batch gathers through
  `Promise.allSettled` — INPUT order, never completion order — so the
  report + the --json shape stay byte-identical under concurrency**; a
  rejected worker drains the batch then rethrows (the never-zeroed
  FINALLY unchanged). `gate:full` flips its census leg to `--parallel
  4` — **the six-gate chain stays six commands**.
- **THE PASS-1 DECODE (the real finding)**: the FIRST full parallel
  census read three heavy pages before settle — **the [desktop]
  reports recharts tooltip MID-ENTRANCE (ours w55 h46 vs the settled
  w22 h22 — 3 unexplained, the gate RED)** and the reference's
  settings rows PRE-MOUNT at tablet/landscape/desktop (ref els 97/68
  vs the settled 249 — the reference renders inside OUR slowed
  browser; its heaviest page mounts late under our own CPU
  contention). **The fixed 2500ms settle does not survive 4-way load
  on the 2-core box — the 3-page probe was too light to see it.**
- **THE QUIESCENCE EXTENSION (the cure — strictly stronger reads)**:
  every census read is now a SETTLED read — a geometry fingerprint
  (main.scrollHeight + the descendant count + a rounded geometry
  accumulation over every main descendant — catches mid-animation
  SIZE transitions, not just DOM mutations) sampled until
  `QUIESCENCE_STABLE_SAMPLES` (3) consecutive samples agree
  (`QUIESCENCE_INTERVAL_MS` 400 — a 1.2s no-change span), capped by
  `QUIESCENCE_CEILING_MS` (12000). **THE NEVER-WEAKER GUARANTEE**:
  the standing 2500ms settle stays the FLOOR (never skipped); a
  never-settling page pays the ceiling and reads anyway — the exact
  standing behavior, only ever MORE settled (the sequential gate
  included). **THE GATE-TAIL HARDENING**: the standalone PASS-1 ran
  clean at 2×150ms/6s, but the gate:full chain's load tail
  re-surfaced both faces (the starved [desktop] reports entrance
  stalled past the window + the ceiling; the starved settings mount
  read ours pre-mount as 34 ref-extra) — the window widened and the
  ceiling doubled; the re-run then CLEAN at the exact standing
  values. The census re-run also hit the **L-158c3 budget** live: the
  chain's sweeps (4 logins) + the failed census (4) + the re-run (4)
  exhausted the 10-per-15-min bucket mid-login — the dev-server
  restart (the per-process bucket) + the re-run, the doctrine's own
  operational form.
- **THE LIVE PROOF (PASS 1 re-run)**: the cold parallel census — **52
  page-axis runs, ALL ZERO unexplained, exit 0, the 48 stable rows
  BYTE-IDENTICAL to the standing sequential values** (the settings
  rows absorbed by the standing LIVE-DATA SKIP doctrine — the
  reference's picklist rows are LIVE-EDITED INTRADAY, its own face,
  not ours) — **wall-clock ~26 min → 2m29s** (the hardened
  quiescence's honest cost, still ~10×).
- **THE PARALLEL MUTATION-PROOF (PASS 3)**: the ghost div planted in
  the calendar KPI grid → `--pages calendar --fail-on-drift --parallel
  4` → **RED at ALL FOUR axes simultaneously** (els 222/221, mainH
  Δ40, unexplained 35/36/79/79, the failures axis-prefixed — **no
  axis masks another, the L-153c1 doctrine held under concurrency**) →
  the revert (zero src diff) → GREEN (the calendar rows at their
  standing values inside the live proof). PASS 2 the sequential-form
  sanity: `--pages login --axis phone` at the exact standing values —
  the default `--parallel 1` path unchanged.
- **THE GATE-CADENCE LOGIN-BUDGET DOCTRINE (L-157c3, formalized)**:
  the census's own logins are a scarce resource — the login limiter is
  10-per-IP/15-min fixed-window and 429s also increment; each axis
  worker logs in exactly once (**parallelism multiplies the logins'
  ARRIVAL RATE, never their COUNT**); the stagger spreads the four
  arrivals over ~12s — no burst (an unknown limiter on the reference
  side could punish exactly that shape); the dev-server restart clears
  the per-process bucket when the gate cadence needs a retry.
- **THE PINS (TDD)**: `tests/interior-census-tool.test.ts` **+8** —
  the session-158 block (planAxisBatches' six partition forms +
  LOGIN_STAGGER_MS + parseParallelArg with the fail-fast negatives +
  the input-order contract + the run-loop re-anchors [the s153/s154
  loop-form pins re-anchored to the batches form] + the gate:full
  flip + the header doctrine) and the session-158b block (the
  quiescence constants + the both-collectors pair pin + the header
  doctrine) — **9 RED at birth** (the six s158 + the two re-anchors +
  the gate-script chain pin) → the implementation → GREEN; then the
  PASS-1 decode drove the 158b pair, **2 RED at birth** → the
  quiescence implementation → GREEN. The count ladder **UNIT
  2233→2241 · SUITES 119 held · badge 2386→2394** (count-ladder-158.py,
  assert-first, idempotent; the historicals preserved) · the
  CLAUDE-carrier negatives ladders grew the 2233 forms (all four
  carrier families) · the SKILL **v1.155.0** + the s158 head (the s157
  layer demoted beneath) + the Appendix B totals.
- **THE LESSONS**: **L-158c1 the concurrency is a MEASUREMENT question,
  never an assumption** (the 3-page probe said stable; the full-set
  PASS-1 found what the probe missed — the quiescence is what made it
  stick; a slower box re-measures, the flag documents the dial) ·
  **L-158c2 the collection order must be INPUT order, not completion
  order** (allSettled — the concurrent gate's output stays
  byte-identical; a completion-order collection would make the gate
  nondeterministic) · **L-158c3 parallelism multiplies the logins'
  ARRIVAL RATE, never their COUNT** (the stagger is the whole budget
  story).
- **THE VERIFICATION**: lint 0/0 · tsc 0 · **119/2241** · build · e2e
  **153/153** · **the SIX drift gates CLEAN ×6 — the census leg now
  `--parallel 4`, the ~26-min leg ~2.5 min** · census MATCH · the VLM
  battery 2/2 (the phone + desktop dashboard pairs MATCH — the
  brand-blue fix-over-defect genus + the demo-data state + the Base44
  pill the only differences, all documented) · the captures 373-376
  (the dashboard pair at phone + desktop, the seeded remediated
  codebase, settled + verified in-frame).

### Session-159 (2026-10-21) — the settings INTRADAY-RHYTHM map (the 159-c rotation)

The workspace stood (the fresh clone + the standing env: `.env` from
`.env.example` + `db:push`/`db:seed` census MATCH · the Playwright
chromium installed · the dev server standing). probe:ref **#133
STABLE** at the s147–s155 fingerprint — a rotation round on the
session_335 next-round reading's strongest candidate: **the settings
intraday-rhythm map — the standing observation instrument + the T1/T2
double capture. The census's settings SKIP doctrine gets its evidence
base, and every future round gets a one-command rhythm capture.**

- **159-a**: the baseline gate GREEN — lint 0/0 · tsc 0 · **119/2241**
  (clean exit) · build · **e2e 153/153** (clean first run — the drawer
  battery inside, the mobile-nav contract).
- **159-b**: probe:ref **#133 STABLE** · **the SIX drift gates CLEAN
  ×6** (the four viewport sweeps + the fullpage at the exact standing
  values 0.093%/0.316% at equal heights 4990/7259 + the census gate at
  `--parallel 4`: 52 page-axis runs, all zero unexplained, exit 0 ·
  the settings row 256/249 at the standing genera) · sitemap 11
  routes + robots 200 · db census MATCH · zero dep changes. ONE live
  decode: **the L-158c3 budget again** — the back-to-back census
  diagnostics burned 12 our-logins against the 10/15-min window
  (7 × 429s); the dev-server restart + the re-run, the doctrine's own
  operational form, twice validated live now.
- **THE PRE-PLAN PROBE** (scratch, cleaned): both apps' settings walks
  decoded live at phone — **the card-title construction byte-equal
  both apps** (`DIV` + `font-semibold tracking-tight text-lg` + the
  leaf text, the five section names in the same order) and the
  picklist rows carry the standing `settingsRowSignature` token set on
  both sides; **the document order holds: every title precedes its
  card's rows** — the classifier assigns by ORDER, no geometry needed.
  The discriminators: the tab BUTTONs (a different class family), the
  H1 (`text-3xl font-bold`, no font-semibold), the subtitle P. T1
  phone evidence: reference 31 rows · mainH 2973 · 249 els vs
  ours-seeded 32 rows · 3059 · 256 (the census's standing values).
- **THE INSTRUMENT** (`scripts/settings-rhythm.ts` — observation-only,
  NEVER in the gate chain): the exact-token title signature
  (`SETTINGS_TITLE_TOKENS` + `settingsTitleSignature` — the
  loginLogoMarkSignature idiom; a restyled title stays UNMATCHED, its
  rows fall to `unassignedRows`, the safety face) + the
  document-order classifier (`settingsFingerprint` — the per-section
  row counts, the sections in walk order) + the T1/T2 diff
  (`diffFingerprints` — the per-section deltas, the added/removed
  sections, the totals) + the CLI pair (`--app ref|ours` fail-fast ·
  `--axis` reused with a phone default · `--diff a.json b.json` ·
  `--json`). **The reuse-not-duplicate doctrine**: `login`/`waitOnUrl`
  from sweep · `CENSUS_AXES`/`parseAxisArg`/`CensusEl` +
  **the additive exports** `settingsRowSignature` + `censusPage` +
  `waitQuiescent` from interior-census (zero behavior change; the s152
  precedent) — the instrument gets the SETTLED read for free, the s158
  never-weaker guarantee rides along. The entry guard ships at birth
  (L-157c1).
- **THE LIVE PROOFS (walk49)**: **PASS 1 the axis-invariance** — the
  reference's per-section row counts IDENTICAL at all four axes
  (Contact Sources 5 · Lead Stages 6 · Activity Types 6 · Account
  Tiers 4 · Industries 10 = 31 rows, els 249 at every axis; only the
  cascade geometry varies — mainH 2973 phone → 2135 tablet → 2099
  landscape/desktop); **PASS 2 the control** — ours reproduces the
  seeded state byte-for-byte (32 rows [8/7/6/3/8], els 256, mainH
  3059 — the standing census values); **PASS 3 the sensitivity** — the
  diff on two REAL captures reports every delta (the per-section
  swings +3/+1/0/−1/−2, the totals, the unpaired-axes pairing
  contract).
- **THE STDOUT/STDERR CONTRACT (the PASS-3 find)**: the first diff run
  choked on a log-prefixed T1 file — the capture mode's diagnostics
  had interleaved with the `--json` output on stdout. The fix is the
  standing CLI idiom: **diagnostics log to STDERR, data prints to
  STDOUT** — the `--json` output is one ARRAY per invocation (one
  record per axis walked), pipeable + parseable, and the diff pairs
  the records AXIS-BY-AXIS (the four-axis rhythm map form). Pinned
  with the rest.
- **THE T1/T2 RHYTHM MAP (the null face — L-159c3 live)**: T1
  (02:30Z) the reference ×4 axes — 31 rows (5/6/6/4/10), els 249 at
  every axis, mainH 2973/2135/2099/2099; the ours control at phone —
  32 rows (8/7/6/3/8), els 256, mainH 3059. T2 (03:15Z — a ~45-minute
  intraday window) — **byte-identical to T1 on every axis: zero swing
  on every section**. **THE MAP'S FIRST SYSTEMATIC OBSERVATION: the
  reference's settings state is STABLE across the window at the
  settled protocol** — the s151–s158-era "swing" observations decode
  largely as READ-TIME artifacts (the s158 PASS-1's 97/68 els were
  pre-mount reads under load, not owner edits); the settled reads are
  byte-stable, the swing windows the exception the SKIP doctrine
  correctly absorbs. The one-command re-observation now stands:
  `bun scripts/settings-rhythm.ts --app ref --axis all --json` +
  `--diff` against any prior file.
- **THE PINS (TDD)**: `tests/settings-rhythm-tool.test.ts` (the NEW
  120th suite file) **+11** — the additive-export pins (born-green,
  D-159a0) + the title signature pair (the standing construction + the
  negatives: the tab BUTTON, the H1, the subtitle P, a restyled
  text-base title, an empty text, a wrong tag) + the fingerprint
  classifier + the safety faces (the unassigned rows, the empty
  section, the row-reuse contract) + the diff seam + the CLI pair +
  the entry guard + the observation-only doctrine + the stdout/stderr
  contract — **9 RED at birth + 1 born-green → the implementation →
  GREEN → the PASS-3 find drove the stdout/stderr pin (1 RED at
  birth) → the fix → GREEN**. The count ladder **UNIT 2241→2252 (+11)
  · SUITES 119→120 · badge 2394→2405** (count-ladder-159.py,
  assert-first, idempotent; the historicals preserved) · the
  CLAUDE-carrier negatives ladders grew the 2241 forms (all four
  carrier families) · the SKILL **v1.156.0** + the s159 head (the s158
  layer demoted beneath) + the Appendix B totals.
- **THE LESSONS**: **L-159c1 an observation doctrine needs a STANDING
  instrument, not a one-off probe** (the scattered s151–s158 settings
  observations never composed into a rhythm; the tool makes the next
  observation a one-command capture) · **L-159c2 the classifier pins
  to the CONSTRUCTION, not the content** (the exact-token signatures
  read the template both apps share; the live data — the row counts,
  the names — is the OBSERVATION, never the contract) · **L-159c3 the
  null face is a finding** (a stable window documents the rhythm's
  baseline; the swing windows stay the exception — documented either
  way, never assumed).
- **THE VERIFICATION**: lint 0/0 · tsc 0 · **120/2252** · build · e2e
  **153/153** · **the SIX drift gates CLEAN ×6** (gate:full with the
  census leg at `--parallel 4`) · the VLM battery 2/2 (the phone +
  desktop settings pairs MATCH — the Base44 pill + the live-data row
  counts the only differences, both documented genera) · the captures
  377-380 (the settings picklist-card pair at phone + desktop, the
  rhythm round's subject surface, the seeded remediated codebase,
  scrolled + verified in-frame).

### Session-160 (2026-10-21) — the census LOGIN CONSOLIDATION (the 160-c rotation)

The workspace stood (the fresh clone + the standing env: `.env` from
`.env.example` + `db:push`/`db:seed` census MATCH · the Playwright
chromium installed · the dev server standing). probe:ref **#134
STABLE** at the s147–s155 fingerprint — a rotation round on the
**recurring audit finding**: the L-158c3 login budget exhausted live
in THREE consecutive rounds (s158, s159, and the 160-b audit itself
— 13 chain logins vs the 10-per-IP/15-min window, 2 × 429s, the
manual dev-server restart + re-run each time). **The census's
per-axis logins collapse into ONE pre-flight login pair per
invocation — the structural cure; the app's own login limiter, a
deliberate security contract, stays byte-identical.**

- **160-a**: the baseline gate GREEN — lint 0/0 · tsc 0 · **120/2252**
  (clean exit) · build · **e2e 153/153** (clean first run — the drawer
  battery inside, the mobile-nav contract).
- **160-b**: probe:ref **#134 STABLE** · **the SIX drift gates CLEAN
  ×6** (the four viewport sweeps + the fullpage at the exact standing
  values 0.093%/0.316% at equal heights 4990/7259 + the census gate at
  `--parallel 4`: 52 page-axis runs, all zero unexplained, exit 0 ·
  the settings row 256/249 at the standing genera) · sitemap 11
  routes + robots 200 · db census MATCH · zero dep changes. ONE live
  decode: **the L-158c3 budget for the THIRD consecutive round** — 13
  our-logins (4 sweeps + 1 fullpage + 4 census + 4 census re-run) vs
  the 10-per-IP/15-min window; 2 × 429 POSTs; the dev-server restart
  + the single re-run, the doctrine's own operational form. **This
  round is that finding's structural cure.**
- **THE PRE-PLAN PROBE** (scratch, cleaned): ONE login (~3.9s)
  captured the `neo_session` cookie via `context.storageState()`; a
  FRESH context at a DIFFERENT viewport (1440×900) opened with that
  state read `/dashboard` authenticated — the URL held, `main`
  rendered. **The stateless HMAC cookie survives context recreation —
  the consolidation is safe, the read side unchanged** (the
  zero-data phase keeps the users table; the seed restore is
  idempotent in place — the cookie's user payload persists).
- **THE CONSOLIDATION** (`scripts/interior-census.ts`): the
  `preflightLoginPair` phase — ONE context logs into the reference,
  then ours, captures the **COMBINED storageState** (two origins, one
  cookie jar: the ref's Base44 cookie + our stateless `neo_session`)
  and hands it to every axis worker's fresh context. The in-worker
  logins DELETED. The 429-diagnostic: on pre-flight failure the
  budget hint logs to **STDERR** (the s159 stdout/stderr contract)
  then rethrows — fail-fast. The stagger **re-anchored**
  `LOGIN_STAGGER_MS` → **`WALK_STAGGER_MS`** (the value 4000 held;
  the login-arrival role RETIRED — the worker-START stagger spreads
  the 4-way walk load, the no-burst spirit intact). The public-only
  guard transfers to the pre-flight call site (an app-empty
  selection never logs in — the s152/s149 doctrine held). **The
  gate:full chain's ours-login count drops 9 → 6.**
- **THE LIVE PROOFS (walk50)**: **PASS 1 the budget** — the
  consolidated run burns EXACTLY ONE our-login (the dev log's POST
  200 delta 5→6, was 4; zero 429s); **PASS 2 the byte-parity** — the
  gate clean at the standing values (settings 256/249 SKIPPED at
  the DATA genus, login 43/43, landing 364/364, all 52 page-axis
  runs zero unexplained, exit 0); **PASS 3 the public-only guard**
  — `--pages landing` runs guest-only, login delta 0, no
  pre-flight; **PASS 4 the sequential default form** — `--pages
  login --axis phone`, exactly one login, the standing values;
  **PASS 5 the wall-clock** — 2m29.8s (the walk dominates the
  concurrent form; the budget is the true subject).
- **THE T3 RHYTHM RIDE-ALONG** (the standing instrument's first
  CROSS-SESSION observation — the L-159c1 one-command form): the T2
  reconstruction from the s159-documented byte-exact values + the
  fresh T3 capture (05:35Z) + the axis-by-axis diff — **byte-identical
  on every axis: 31 rows (5/6/6/4/10), els 249, mainH
  2973/2135/2099/2099, +0 on every section** — the window extends
  ~45 min → **~3h05m** (T1 02:30Z → T3 05:35Z, two maintenance
  rounds); the ours control at the standing seeded values (32 rows
  [8/7/6/3/8], els 256, mainH 3059). **L-159c3's null face extends
  across sessions — the swing windows stay the exception the SKIP
  doctrine correctly absorbs.**
- **THE PINS (TDD)**: `tests/interior-census-tool.test.ts` (the
  session-160 describe) **+5** — the `WALK_STAGGER_MS` re-anchor (+
  the old name's RETIREMENT pinned: `not.toHaveProperty`) + the
  one-login-per-run contract (the walkAxis body login-free + the
  pre-flight helper, source-shape) + the storageState propagation
  (the app-leg context carries it; the guest contexts stay bare —
  the s149 doctrine) + the public-only guard + the 429-diagnostic
  (the STDERR hint) + the header doctrine (L-160c1/c2/c3) — **7 RED
  at birth (the 5 new + the 2 s158 stagger re-anchors) → the
  implementation → GREEN**. The count ladder **UNIT 2252→2257 (+5)
  · SUITES 120 held · badge 2405→2410** (count-ladder-160.py +
  skill-head-160.py, assert-first, idempotent, unique-anchor
  replacements; the three PAD sites the docs-counts pins caught
  live — the HEAD line, the checklist, the commands table — joined
  the ladder script) · the CLAUDE-carrier negatives ladders grew
  the 2252 forms (all four carrier families) · the SKILL **v1.157.0**
  + the s160 head (the s159 layer demoted beneath) + the Appendix B
  totals.
- **THE LESSONS**: **L-160c1 the login COUNT is the budget's true
  axis** (the arrival-rate stagger treated the symptom; the
  orchestration shrinks the count itself — never by weakening the
  app's limiter, a deliberate security contract) · **L-160c2 the
  stateless cookie is the consolidation license** (the HMAC-signed
  stateless session + the zero-data-keeps-users contract make
  cross-context reuse safe; a server-side session store would break
  the whole design) · **L-160c3 a recurring operational fix is a
  standing defect** (the same manual restart + re-run three rounds
  running is the signal to spend a round on the structural cure —
  the decode-the-pain doctrine applied to the tooling itself).
- **THE VERIFICATION**: lint 0/0 · tsc 0 · **120/2257** · build ·
  e2e **153/153** · **the SIX drift gates CLEAN ×6** (the census
  leg at the consolidated form) · the VLM battery 2/2 (the phone +
  desktop login-wall pairs MATCH — the 3D-logo genus + the Base44
  pill the only differences, both documented genera, never
  mirrored) · the captures 381-384 (the login-wall pair at phone +
  desktop — the round's subject surface: the consolidated login's
  own wall; the seeded remediated codebase, settled + verified
  in-frame).

### Session-161 (2026-10-22) — the rhythm LOGIN CONSOLIDATION (the 161-c rotation)

The workspace stood (the fresh clone + the standing env: `.env` from
`.env.example` + `db:push`/`db:seed` census MATCH · the Playwright
chromium installed · the dev server standing). probe:ref **#135
STABLE** at the s147–s155 fingerprint — a rotation round on **the s160
doctrine's second application**: the walking-tool family's OTHER
member, the settings-rhythm instrument, still logged in PER AXIS (4
our-logins per `--axis all` ours-control; the control + the gate
chain = 9 of the 10-per-IP/15-min window, one diagnostic re-run from
the 429 wall — the L-160c3 recurring-cost pattern verbatim). **The
rhythm tool's capture loop gets the same pre-flight form — ONE login
per invocation, the storageState shared by every axis context; the
app's own login limiter stays byte-identical.**

- **161-a**: the baseline gate GREEN — lint 0/0 · tsc 0 · **120/2257**
  (clean exit) · build · **e2e 153/153** (clean first run — the drawer
  battery inside, the mobile-nav contract).
- **161-b**: probe:ref **#135 STABLE** · **the SIX drift gates CLEAN
  ×6** (the four viewport sweeps + the fullpage at the exact standing
  values 0.093%/0.316% at equal heights 4990/7259 + the census gate
  at `--parallel 4`: 52 page-axis runs, all zero unexplained, exit 0
  — the census leg at the 160-c form, EXACTLY ONE our-login verified
  live, the dev-log POST-200 delta 4→5) · sitemap 11 routes + robots
  200 · db census MATCH · the tree clean · zero dep changes. ONE
  supplemental live check: the mobile drawer verified in-browser at
  390×844 (trigger unique · the rail hidden · `data-state=open` · 8/8
  links · the MAIN-scroller lock · close-on-navigate + the URL change
  · Escape + the lock release — PASS) — and the login window filled
  to 10/10 inside the audit, the budget reality this round addresses.
- **THE CONSOLIDATION** (`scripts/settings-rhythm.ts`): the
  `preflightLogin` helper — the s160 census construction, single-app
  form (the pair walks both apps because the census does; the rhythm
  walks ONE app per invocation, so the pre-flight takes the target as
  its parameter): ONE context → login the target → `storageState()` →
  close. The capture loop's contexts carry the state; the in-loop
  login DELETED. The 429-diagnostic mirrors the census form (the
  budget hint to STDERR — the s159 stdout/stderr contract — then the
  rethrow, fail-fast). The header re-anchored to L-160c1 (ONE login
  per invocation REGARDLESS of the --axis count); the old per-axis
  arrival-rate language RETIRED ("one login each" + "never a burst"
  both gone). **The ours control's login count drops 4 → 1.**
- **THE LIVE PROOFS**: **PASS 1 the budget** — `--app ours --axis
  all` burns EXACTLY ONE our-login (the dev-log POST-200 delta 0→1,
  was 4; zero 429s); **PASS 2 the byte-parity** — the ours control at
  the standing values byte-for-byte (phone 32 rows [8/7/6/3/8], els
  256, mainH 3059) plus the FIRST multi-axis ours baseline (tablet
  mainH 2147 · landscape 2123 · desktop 2123); **PASS 3 the T4 rhythm
  ride-along** — the reference byte-identical to the T3 reconstruction
  on every axis (31 rows [5/6/6/4/10], els 249, mainH
  2973/2135/2099/2099, +0 everywhere), the null face extends
  ~45 min → **~20.5h ACROSS DAYS** (T1 02:30Z 2026-10-21 → T4 23:00Z
  2026-10-22, four observations, three maintenance rounds);
  **PASS 4 the diff mode** — browser-free, login-free, unchanged.
- **THE PINS (TDD)**: `tests/settings-rhythm-tool.test.ts` (the
  session-161 describe) **+5** — the one-login-per-invocation contract
  (the capture loop login-free + the pre-flight helper, source-shape)
  + the storageState propagation + the 429-diagnostic (the STDERR
  hint + the fail-fast rethrow) + the header re-anchor (the L-160c1
  doctrine present, the old language RETIRED) + the reuse/
  observation-only doctrine — **4 RED at birth → the implementation →
  GREEN** (the 5th born-green by design: it pins contracts that
  already hold). The count ladder **UNIT 2257→2262 (+5) · SUITES 120
  held · badge 2410→2415** (count-ladder-161.py, assert-first,
  idempotent, unique-anchor replacements; the docs-counts pins
  caught the SKILL H1 version site live — joined the ladder script)
  · the CLAUDE-carrier negatives grew the 2257 forms (all four
  carrier families) · the SKILL **v1.158.0** + the s161 head (the
  s160 layer demoted beneath) + the Appendix B totals.
- **THE LESSONS**: **L-161c1 a doctrine lands in a FAMILY, not a
  file** (the s160 cure healed the census while the rhythm tool — the
  same family, the same seams — kept the per-axis pattern; when a
  structural cure lands, enumerate the family members sharing the
  seam) · **L-161c2 the standing ride-along is a standing COST** (the
  moment an observation becomes an every-round feature its budget
  cost recurs every round — minimize it structurally, never just
  tolerate it once).
- **THE VERIFICATION**: lint 0/0 · tsc 0 · **120/2262** · build ·
  e2e **153/153** · **the SIX drift gates CLEAN ×6** · the VLM
  battery 2/2 (the phone + desktop settings pairs MATCH — the
  live-data genus [the reference's own intraday picklist edits, the
  row counts independently CONFIRMING the rhythm fingerprints: ours
  8/7 vs ref 5/6] + the Base44 pill the only differences, both
  documented genera, never mirrored) · the captures 385-388 (the
  settings pair at phone + desktop — the round's subject surface: the
  rhythm instrument's own page; the seeded remediated codebase,
  settled + verified in-frame at the standing mainH values).

### Session-162 (2026-10-22) — the sweep LOGIN CONSOLIDATION (the 162-c rotation)

The workspace stood (the fresh clone + the standing env: `.env` from
`.env.example` + `db:push`/`db:seed` census MATCH · the Playwright
chromium installed · the dev server standing). probe:ref **#136
STABLE** at the s147–s155 fingerprint — a rotation round on **the
login-consolidation doctrine's THIRD application** (s160 census · s161
rhythm · s162 sweeps), the worklog Task ID 161's last-listed
candidate: the four SEPARATE-PROCESS sweep invocations each logged in
fresh — one our-login per invocation, FOUR per `gate:full` chain (the
162-b audit's own four the live evidence). **The sweeps now share ONE
cross-process storageState FILE — the first invocation pays the login
pair, the next three reuse it; the chain's our-login count drops
4 → 1; the app's own login limiter stays byte-identical.**

- **162-a**: the baseline gate GREEN — lint 0/0 · tsc 0 · **120/2262**
  (clean exit) · build · **e2e 153/153** (clean first run — the drawer
  battery inside, the mobile-nav contract).
- **162-b**: probe:ref **#136 STABLE** · **the SIX drift gates CLEAN
  ×6** (the four viewport sweeps + the fullpage at the exact standing
  values 0.093%/0.316% at equal heights 4990/7259 + the census gate at
  `--parallel 4`: 52 page-axis runs, all zero unexplained, exit 0 —
  the census leg at the 160-c form, EXACTLY ONE our-login per
  invocation, the dev-log POST-200 delta 4→5 verified live) · sitemap
  11 routes + robots 200 · db census MATCH · the tree clean · zero
  dep changes. TWO supplemental live checks: the mobile drawer
  verified in-browser at 390×844 (**10/10 PASS** — trigger unique ·
  the rail hidden · `data-state=open` · 8/8 links · the MAIN-scroller
  lock · close-on-navigate + the URL change · Escape + the lock
  release), and the Tailwind v4 state clean (the postcss
  `@tailwindcss/postcss` plugin · the `@theme` `--shadow-sm`/
  `--blur-sm` re-pins · design-tokens 16/16).
- **THE CONSOLIDATION** (`scripts/sweep-state.ts` + the sweep main
  re-wiring): a per-invocation pre-flight cannot cure a per-PROCESS
  seam — the cure crosses the boundary: **`scripts/.
  sweep-auth-state.json`**, the combined pair state (the ref's Base44
  cookie + our stateless `neo_session`, two origins one jar — the
  s160 combined form). `preflightPairState(browser)`: a fresh cached
  file is PROBED (one throwaway context, an authenticated check per
  app — `/dashboard` must not redirect to `/login`; every failure
  mode [rotated AUTH_SECRET · the 7-day cookie TTL · the ref platform
  session loss · a corrupt file] surfaces as that same redirect, one
  guard covers them all); any miss falls back to the fresh login pair
  + REWRITES the file (the self-heal). The 429-diagnostic mirrors the
  census/rhythm form (STDERR budget hint → rethrow, fail-fast). The
  guard trio: the **15-min TTL** (the login-window semantics — reuse
  within one chain, never across rounds) + the authenticated probe
  (validation-by-use) + the mid-run backstop (a login-wall screenshot
  is a catastrophic drift — the gate fails LOUDLY, never silently).
  The security posture (L-162c3, the db-binary discipline): git-ignored
  (the `.gitignore` line PINNED by test) · 0600 · atomic tmp+rename ·
  TTL-bounded. The sweep main's two in-loop logins DELETED; the single
  capture context carries `storageState: pairState`.
- **THE LIVE DECODE (the PASS-1 root cause — the round's own find)**:
  the first four-sweep proof run self-healed on EVERY invocation — the
  consolidation saved nothing. Decoded live: `prisma/seed.ts`'s users
  block was `db.user.deleteMany()` + recreate — **every `db:seed`
  rotated ALL user cuids**, and each sweep's END-OF-RUN seed restore
  orphaned the state file's cookie uid (the next invocation's probe
  found the uid deleted → GuestLoginRedirect → self-heal → a fresh
  login pair). **The cure: the users block rebuilt as UPSERT-BY-EMAIL**
  — the ids STABLE across re-seeds (the "idempotent in place" claim
  now true in the strong sense: the same rows, the demo state restored
  onto them; the domain tables keep their wipe+recreate). The
  measurement lesson recorded with it: never pipe a long-running tool
  through `head` — the early-close orphans the process (bun survives
  SIGPIPE), the bash returns early, and the gate verdict is lost to
  the broken pipe.
- **THE LIVE PROOFS**: **PASS 1 the budget** — the four-sweep chain
  (1440×900 · 390×844 · 768×1024 · 1024×768, run serially after a
  dev-server restart) burns **EXACTLY ONE our-login** (POST 0→1, was
  4; zero 429s); **PASS 2 the byte-parity** — all four drift gates
  CLEAN at the standing margins (the read side provably unchanged);
  **PASS 3 the self-heal** — the state file TAMPERED (a bogus
  cookie), one sweep re-run: the probe detects (`ours=false`), the
  fresh pair fires (POST +1), the file rewritten, the sweep CLEAN;
  **PASS 4 the cross-process reuse** — sweeps 2-4 each logged
  "reusing the fresh sweep auth state — ZERO logins this invocation",
  the state file mtime UNCHANGED across the chain. **The FIFTH
  process**: the captures driver itself reused the state file (POST
  delta 0) — the reuse proven beyond the four-sweep chain.
- **THE PINS (TDD)**: `tests/sweep-tool.test.ts` (the session-162
  describe) **+9** — the state module (the file path · the 15-min TTL
  · the three functions) + the one-login-per-chain contract (the
  capture path login-free, the pre-flight call, the context carries
  the state) + the self-heal guard (the authenticated probe + the
  fall-back pair + the rewrite) + the 429-diagnostic (STDERR +
  rethrow) + the security pin (the `.gitignore` line) + the
  atomic-0600 write + the freshness pure seam (fresh loaded · stale
  rejected · corrupt rejected · miss null — node-testable) + the
  SEED's ID-STABILITY contract + the header doctrine — **8 RED at
  birth → the implementation → GREEN** (the seed pin born RED with
  the live decode; the freshness seam born with it). The count ladder
  **UNIT 2262→2271 (+9) · SUITES 120 held · badge 2415→2424**
  (count-ladder-162.py, assert-first, idempotent, unique-anchor
  replacements; the historicals preserved) · the CLAUDE-carrier
  negatives grew the 2262 forms (all four carrier families) · the
  SKILL **v1.159.0** + the s162 head (the s161 layer demoted beneath)
  + the Appendix B totals + the seed line-count site (466 → 516, the
  docs-counts LIVE-CENSUS catch).
- **THE LESSONS**: **L-162c1 the process boundary is the last
  consolidation axis** (when the per-invocation logins are already
  collapsed, the remaining multiplier is the INVOCATION COUNT itself;
  a shared file beats a per-process pre-flight wherever the processes
  run serially against one budget) · **L-162c2 a cached credential's
  guard is VALIDATION-BY-USE, not trust** (the TTL bounds the cache's
  lifetime, but the authenticated probe is what makes reuse safe —
  every failure mode surfaces as the same redirect, one check
  converts them all into the self-heal) · **L-162c3 session material
  on disk follows the database-binary discipline** (git-ignored,
  0600, TTL-bounded, never in the tree — the `db/*.db` precedent
  extended to auth state).
- **THE VERIFICATION**: lint 0/0 · tsc 0 · **120/2271** · build ·
  e2e **153/153** · **the SIX drift gates CLEAN ×6** (the sweep legs
  at the 162-c form — ONE our-login for the whole four-sweep chain)
  · the VLM battery 2/2 (the phone + desktop zero-data dashboard
  pairs MATCH — **zero differences decoded**, the cleanest battery
  yet: the zero-data subject state removes the live-data genus, the
  Base44 pill closed by the driver) · the captures 389-392 (the
  zero-data dashboard pair at phone + desktop — the round's subject
  surface: the sweep family's own apples-to-apples state; mainH
  byte-equal both apps [phone 2851/2851 · desktop 1274/1274],
  in-frame verified, the state file reused by the driver itself).

### Session-163 (2026-10-22) — THE AUTH RETROFIT + THE ZOD LAYER (the digma-reference port)

**Context**: the four-repo family evaluation (neo-crm 8.1 · zero-balance 7.7
· digma 7.1 · project-management 6.5) recommended "neo-crm base + port
digma's auth completions" — this session executes that recommendation:
retrofit proper auth mechanics + functionality onto neo-crm using digma as
the reference/sample template, evaluate + adopt the Zod layer, TDD
throughout, docs aligned, pushed to main via the SSH wrapper.

- **THE GAP REGISTER** (the audit that motivated the round): G1 no session
  revocation (the token had no version dimension) · G2 NO password-reset
  flow at all (the login card's "Forgot password?" was CLIENT-SIDE THEATER
  since session 11 — the reference app's own demo behavior, no network call
  fired) · G3 the login timing oracle (`!user || !verify` short-circuited —
  unknown emails answered measurably faster) · G4 FIRST-hop XFF trust (the
  limiter key was client-suppliable — header rotation evaded the
  brute-force budget) · G5 the seed script DUPLICATED the scrypt parameter
  set (the drift class digma's S70-D seam solved) · G7 the OTP was
  console-logged only (no in-response delivery — the e2e/demo funnel could
  not complete programmatically).
- **WP-1 THE PURE PASSWORD SEAM** (digma S70-D): `src/lib/password.ts` —
  node:crypto ONLY (`hashPassword`, `verifyPassword`,
  `timingEqualizerHash`, `generateVerifyCode`); `auth.ts` re-exports (the
  routes' import surface survives); `prisma/seed.ts` imports the seam (the
  duplicated params die); `verification-server.ts` keeps verification-shaped
  wrappers on the seam.
- **WP-2 THE REVOCATION DIMENSION** (digma S67-A): `SessionPayload` gains
  `v`; `signSession(uid, tokenVersion = 0, now)`; the parse rejects
  non-integer/fractional/negative `v` under a valid signature; a MISSING `v`
  reads as 0 (no forced fleet re-login — the first eviction event separates
  the eras); `getSessionUser` evicts on `user.tokenVersion !== payload.v`;
  login/verify mint with the live row's version.
- **WP-3 THE RESET FUNNEL** (digma S46/S64/S66/S67-A/S76-A/S102-B/S124-A):
  schema columns `resetToken`/`resetTokenExpiresAt`; the two routes (the
  no-enumeration 200 message verbatim, `randomBytes(32)`, 60-min TTL, the
  RELATIVE resetUrl behind `NEO_DISABLE_IN_APP_RESET`, P2025-swallow +
  P2024/P2028→503; the atomic conditional `updateMany` with token + live
  expiry in the WHERE, count 0 → the invalid-token 400, `tokenVersion`
  increment, single-use clearing); the login card's `onSendResetLink` wired
  to the REAL endpoint (the theater retired); the sent card renders the
  in-app link when the field is a string (graceful degrade); the
  `/reset-password` landing page (the invalid-link card vs the set-password
  form, keyed on `?token=`).
- **WP-4 THE TIMING EQUALIZER** (digma S72-C): the login miss branch burns
  `verifyPassword(password, timingEqualizerHash())` — the lazy-memoized
  throwaway-constant hash; the 401 envelope stays byte-identical.
- **WP-5 THE PROXY-DEPTH IP** (digma S62-D/S69-A): `clientKey` re-keys onto
  the LAST XFF hop; `NEO_PROXY_HOPS` (unset=1 · 0=direct/"unknown" · N≥2
  the Nth-from-last hop · unparsable/negative fails CLOSED); short lists →
  "unknown"; `x-real-ip` only at depth ≥ 1. Single-value headers (the e2e
  isolation form) are unaffected — first == last.
- **WP-6 THE ZOD LAYER** (zero-balance's pattern at digma's seam placement):
  `zod ^4.6.7`; `src/lib/schemas.ts` (login/signup/verify/resend/
  forgot/reset schemas — EVERY message the current route string, zero drift;
  the N-63i 160-cap rides the login schema; >160 now REJECTS honestly where
  asString truncated silently — the reference repos' posture); `parseBody()`
  in `api.ts` (the declared-size pre-gate + safeParse + the first issue →
  the BAD_REQUEST envelope); the auth family retrofitted; the CRUD family
  keeps `asString` (the documented incremental path); signup/resend answer
  `verificationCode` behind `NEO_DISABLE_IN_APP_OTP` (the digma ADR-014
  in-app delivery — also what makes the e2e scratch funnel possible), the
  verify view renders the demo code hint when present.
- **THE PINS (TDD)**: RED-first — `tests/password-seam.test.ts` (+8),
  `tests/schemas.test.ts` (+27), `tests/parse-body.test.ts` (+5),
  `tests/auth-reset.test.ts` (+24: the route contracts — no-enumeration
  message, atomic consumption, eviction, equalizer, knob gates),
  `tests/auth.test.ts` (+6 version tests, the 3 legacy token tests
  re-anchored onto the `(uid, version, now)` signature),
  `tests/rate-limit.test.ts` (the clientKey battery rewritten onto the
  last-hop/depth contract, 2 → 9 checks), `tests/e2e/reset-password.spec.ts`
  (NEW, +8: the landing cards, the form guards, the invalid-token alert, the
  FULL ROUND-TRIP on a dedicated scratch account with its own XFF bucket —
  forgot → sent card carries the link → reset → old password dead → new
  password live → /me resolves — plus the BEHAVIORAL EVICTION pin: a
  pre-reset session dies at the version comparison and the consumed token
  replay answers 400); the collateral re-anchors (api-robustness S38-P1/
  S39-P4, auth-contract S67-P2, dead-code-hygiene N-62a/N-63i, route-case
  N-66e exclusion for the token read, the space-y census 20/114 → 21/117,
  the login-family e2e carrier 153 → 161).
- **THE COUNT LADDER**: UNIT 2271 → 2347 (+76) · SUITES 120 → 124 · E2E
  153 → 161 (+8) · badge 2424 → 2508 · routes 27 → 29 files / 39 → 41
  handlers · every live-tense site re-anchored in lockstep (README ×6 +
  Tested row + badge · AGENTS ×3 + the auth bullet · CLAUDE ×6 · PAD ×8 +
  the route/layer diagrams · SKILL head v1.160.0 + the s163 layer + §7 line
  counts + Appendix B) and the pin carriers (docs-counts UNIT/E2E/SUITES/
  layer-axis/Appendix-B · dialog-geometry CLAUDE ×4 · login-family e2e).
- **THE ZOD FEASIBILITY EVALUATION** (the honest finding, in the plan):
  digma itself is Zod-FREE (hand-rolled clamps in `src/lib/validation.ts`)
  — the family's actual Zod reference is zero-balance (^4.6.5). Verdict:
  FEASIBLE + RECOMMENDED incrementally; adopted for the auth family this
  session, the CRUD path documented.
- **THE VERIFICATION**: lint 0/0 · tsc 0 · **124/2347** · build (29 routes,
  /reset-password live) · e2e **161/161** (the reset round-trip + the
  behavioral eviction green on the first run).

## Session-164 — THE TEST-ISOLATION CURE + THE RESET-TOKEN HASH + THE AMORTIZED SWEEP (2026-10-22)

The post-163 audit round (the baseline gate RED named it): the fresh
workspace's first `bun run test` failed 2346/2347 — the session-163
hand-signed session battery was **ambient-env-dependent**. Root cause
(bisected live): `@prisma/client`'s module init auto-loads the repo
`.env` into `process.env`, so any workspace whose `.env` carries a
≥16-char `AUTH_SECRET` flips `secret()` off the DEV fallback the
hand-signed constructions hard-code — the pre-retrofit acceptance test
fails, and the three rejection siblings (non-integer/fractional/
negative `v`) pass **VACUOUSLY** (the signature gate rejects before the
version-shape guard ever runs). Every environment following the
documented first-run setup hits this. THE CURE: the battery is now
env-PINNED (`beforeAll` plants the ambient condition on purpose,
`beforeEach` deletes `AUTH_SECRET` before every hand-signed
construction, `afterAll` restores) + two regression pins (the
env-pinning invariant + the foreign-key honesty mirror — a token signed
with the AMBIENT secret must NOT verify inside the pinned battery).
Mutation-proven: the pin disabled → exactly 3 RED.

- **THE RESET-TOKEN HASH (the skill §12 compliance)**: the web-app-
  foundation skill's security checklist requires "verification + reset
  tokens stored hashed" — neo-crm hashed the verification CODE (scrypt)
  but stored the reset TOKEN plaintext (digma parity, but the repo's own
  distilled companion skill is the bar). `hashResetToken` joins the pure
  seam (SHA-256 hex — a FAST hash, correct for a 256-bit-entropy token;
  the code-vs-token asymmetry: user-chosen low entropy needs scrypt,
  crypto-random does not); the forgot route stores the hash, both
  reset-route lookups key on it, the delivery URL keeps the RAW token —
  a DB read compromise never mints live reset links. The seed's user
  upserts now CLEAR the reset funnel (the verification fields' own
  posture); `tokenVersion` deliberately not reset (no demo-session
  eviction). Migration note: a pending plaintext token at swap time
  ages out of its 60-min TTL — the dev/demo posture.
- **THE AMORTIZED SWEEP (digma S76-G — the deferred s163 WP-7 landed)**:
  `sweepRateLimits()` ran the full O(n) walk on every call — and every
  auth route calls it on every request, so rotated-key bursts cost
  O(n²). Now a module-level WATERMARK (the earliest live resetAt seen
  at the last sweep) gates the walk: pre-crossing calls are O(1) no-ops
  returning 0; an expired key still resets lazily at its own access;
  only the memory reclamation of un-accessed keys waits for the
  crossing (per-key behavior identical — the never-weakened guarantee).
  The pure seam `computeWatermark` + the swept-count return are the
  honest observables.
- **THE E2E STARVED-READ HARDENING**: the settings Defaults spec's bare
  `boundingBox()` reads (no auto-wait) failed under full-suite load
  (1-in-1; 3/3 isolated) — the tab panel's label subtree mid-mount at
  read time. Visibility pre-waits added; E2E count held at 161.
- **THE AUDIT TRIAGE (skill §14)**: `bun audit` joined the pre-ship
  discipline (periodic, NOT in the offline gate — the probe doctrine);
  current state: 9 advisories, ALL dev-toolchain transitive (braces via
  eslint-config-next · deepmerge-ts via the prisma CLI config · vite
  via vitest · source-map-js via postcss) — zero runtime request-path
  exposure; the posture: no mid-rotation dep bumps (a toolchain bump
  forces the standing pixel baselines' re-derivation — its own
  rotation), recorded in the PAD known-issues ledger.
- **THE COUNT LADDER**: UNIT 2347 → 2362 (+15 — auth +2 · password-seam
  +3 · auth-reset +4 · rate-limit +6) · SUITES 124 held · E2E 161 held
  · badge 2508 → 2523 · the line-census sites (schema.prisma 257 → 262
  · seed.ts 516 → 540) — every live-tense site re-anchored in lockstep
  (count-ladder-164.py, assert-first, idempotent, unique-anchor) and
  the pin carriers (docs-counts UNIT + the comment ladder ·
  dialog-geometry CLAUDE ×4 + the 2347-form negatives).
- **THE LESSONS**: L-164c1 a test that hard-codes a fallback constant
  inherits every ambient env leak of its import graph — pin the env or
  the test is environment-dependent (the @prisma/client .env auto-load
  is invisible until a fresh workspace trips it) · L-164c2 the vacuous
  green is worse than the red (the rejection siblings passed for the
  wrong reason for a full session — an assertion that can pass at the
  wrong layer proves nothing about the layer it names) · L-164c3 the
  distilled skill outranks its source repos (digma's plaintext parity
  was not the bar — the web-app-foundation §12 checklist the family
  distilled AFTER digma is).
- **THE VERIFICATION**: lint 0/0 · tsc 0 · **124/2362** · build (29
  routes) · e2e **161/161** · probe:ref #137 STABLE at the s147-s155
  fingerprint · the six drift gates CLEAN ×6 · db census MATCH.

## Session-165 — THE BOUNDED-READER PORT + THE CONTENT-TYPE CSRF GATE + THE E2E-CENSUS DOCTRINE (2026-10-22)

The post-164 audit round (the baseline gate GREEN at the exact s164 ship
state: lint 0/0 · tsc 0 · 124/2362 · build · e2e 161/161 · probe:ref
#138 STABLE · census MATCH — the test-isolation cure holding in the
ambient workspace). The audit rode the web-app-foundation §7.2
checklist ("zod at every boundary; bounded reader; **reject non-JSON
content types on mutating routes**; count streamed chunks") against
the parse seam digma itself had hardened at S148-A/S75-B.

- **F-165a THE CONTENT-TYPE CSRF GATE (absent)**: `req.json()` parses
  regardless of Content-Type, so a cross-site `<form method="POST"
  enctype="text/plain">` posting a JSON-shaped body reaches the auth
  family's cookie-MINTING verbs — the login-CSRF class (SameSite=Lax
  gates cookie SENDING on cross-site POSTs, never cookie SETTING).
  First-party census lead-verified: every JSON consumer already sent
  `application/json` (the call() seam, the login-card fetches, the
  reset screen, the e2e in-page headers, Playwright's object-data
  default) — the gate lands with zero first-party breakage.
- **F-165b THE CHUNKED-BODY BYPASS**: `isBodyTooLarge` checked only the
  DECLARED Content-Length; a Transfer-Encoding: chunked request carries
  none, so the 16KB cap passed and `req.json()` buffered unbounded —
  api.ts's own comment documented the gap as an accepted backstop.
- **F-165c THE MOBILE-NAV MISCOUNT**: `MOBILE_NAV_E2E = 11` for a
  **10-test spec since s147** (git-verified: landing.spec gained that
  round's +1 e2e while the constant got the bump) — seven pinned doc
  sites carried the wrong number for 17 sessions; no live-census pin
  existed on the axis.
- **F-165d THE APPENDIX B E2E ROWS**: landing 12 vs live 14 · crm 111
  vs live 112 · the s163 reset-password spec absent from the Test
  Inventory since birth — the F-107a1 genus recurring on the e2e axis
  (the totals were re-anchored at s163; the rows were not).
- **F-165e/F-165f/F-165g THE DOCS-TRUTH CARRIERS**: PAD's 27-files/
  39-handlers route census (live 29/41) · the PAD HEAD line's 9-spec
  enumeration (live 10) · SKILL §3.3's "3 — count them, 3" env table
  (live 6) · SKILL §11's era-s12 65/65 + 20/20 gate block · SKILL
  §14's no-schema-library contradiction · ADR-014 referenced since
  s163, never written.

**THE REMEDIATION (TDD — RED 20 → GREEN)**: `readBoundedJson` joins
api.ts (the digma S148-A/S75-B construction adapted: the content-type
gate FIRST with the stream cancelled → the declared fast path → the
body-less pass-through → the stream counter with mid-read producer
cancel → the merged-decode parse tail on the null-on-unparseable
contract); `parseBody` composes it (the auth family inherits both
gates); the THIRTEEN sessioned CRUD sites swapped via the assert-first
crud-seam-swap-165.py — every 400 message preserved VERBATIM (incl.
the divergent siblings: users' "Invalid JSON body", reset's
'Type "RESET" to confirm' fallthrough), the F-69a3 gate-before-DB
ordering carried onto the seam form. The e2e CSRF probe joined the
auth spec's 4xx battery (the trio became the quartet — the probe rides
its own XFF bucket, E2E held at 161). The mobile-nav constant flipped
to 10 + the seven carriers + **the LIVE-CENSUS pin** (the count read
FROM the spec file — the schema/seed doctrine extended to the e2e
axis); the Appendix B e2e rows re-censused (landing 14 · crm 112 ·
the NEW reset-password row 8 · the doctrine note narrowed: the UNIT
rows stay the s12 snapshot, the e2e rows are live-tense, all pinned)
+ THE SUM GUARD (rows + setup must sum to the E2E constant). PAD/SKILL
carriers re-anchored + ADR-014 formalized (PAD §1.3's full entry + both
indexes) + every touched site pinned (the route census read LIVE from
the source tree).

**THE VACUOUS-PIN CATCH**: the row-census pin's first draft rode a
`new RegExp` template whose `\|` escapes collapsed to alternation —
the pin matched EVERYTHING. Caught live by the arithmetic not adding
up (the auth row said 12 while the spec said 11 — and the pin passed),
replaced with the toContain filename-cell form, mutation-proven: a
planted 12 → exactly 1 RED → reverted → GREEN. L-164c2 re-learned at
the pin layer.

- **THE COUNT LADDER**: UNIT 2362 → 2382 (+20 — bounded-reader +11
  [the 125th suite] · parse-body +2 · body-pregate +1 · docs-counts
  +6) · SUITES 124 → 125 · E2E 161 held · badge 2523 → 2543 — every
  live-tense site re-anchored in lockstep (count-ladder-165.py,
  assert-first, idempotent, unique-anchor) and the pin carriers
  (docs-counts UNIT/SUITES + the comment ladder · dialog-geometry
  CLAUDE ×4 + the 2362-form negatives · the mobile-nav 11-check-form
  negatives · the FIRST-layer pin → the s165 head).
- **THE LESSONS**: L-165c1 a pin that checks doc-consistency with a
  constant never checks the constant against the thing it claims to
  census — the live-census doctrine (read the source) is the only root
  cure for count drift · L-165c2 the RegExp-from-template escaping
  trap (`"\|"` is alternation, not a pipe) — a regex pin must be
  mutation-proven at birth or it matches nothing (or everything) ·
  L-165c3 the e2e rows are only 10 — the "too many rows to pin"
  excuse that left them a stale snapshot dies at that scale (the unit
  rows stay snapshot by doctrine; the e2e axis is cheap to pin live).
- **THE VERIFICATION**: lint 0/0 · tsc 0 · **125/2382** · build (29
  routes) · e2e **161/161** · probe:ref #138 STABLE at the s147-s155
  fingerprint · the six drift gates CLEAN ×6 · db census MATCH.

## Session-166 — THE CRUD-FAMILY ZOD SEAM + THE DOC-TRUTH CARRIERS (2026-10-22)

**The round**: the post-165 audit (the web-app-foundation §7.2 "zod at
every boundary" checklist rode it). The baseline gate GREEN at the s165
ship state (lint 0/0 · tsc 0 · 125/2382 · build · e2e 161/161). The
provenance note: this rotation was executed once in a workspace that
was reset before its commit landed — re-executed from the fresh clone
at `0abf8a3` following the same plan; nothing of the interrupted run
survived.

**THE CRUD-FAMILY ZOD SEAM** (the s163 incremental path completed —
F-166a): the TWELVE body routes (accounts/activities/contacts/events/
leads x[root+[id]] + settings + users) ride `parseBody(req, schema)`;
the schemas live in `src/lib/schemas.ts` as the field-builder
vocabulary (nullable/clearable/required-on-present/defaulted-enum/
fkId/date/bool/photoUrl) — every asString/isBad* guard quadrant recast
(the create defaults, the PUT three-state absent-clear-value semantics,
the legacy hot/warm/cold priority mapping, the settings quartet's
absent-no-write/null-default split), every 400 message the route's own
string (the zero-message-drift doctrine extended family-wide), the
field ORDER matching each route's guard ladder (parseBody answers the
FIRST issue — the single-error message equivalence). The users PATCH
keeps its route-local readBoundedJson + safeParse form (its divergent
"Invalid JSON body" null-body message); reset keeps its custom confirm
form; leads/[id] normalized to parseBody-before-404 (the §7.3 ordering
its five siblings already carried — F-166a2); the asString silent-
truncation caps converted to honest `.max()` rejects (F-166a3 — the
s163 email precedent, the "must be reasonably sized" family); the
FK-existence checks + the merged-record invariants stay route-side
(§7.3: parseBody → ownership/FK checks → mutation); the guard helpers
stay exported for the query-param GET family (events' from/to, the
reports/export/search period+q parses) + their behavior battery.

**THE DOC-TRUTH CARRIERS** (F-166b/c/d/e): README's file-tree route
census 27/39 → the LIVE 29/41 · PAD's mermaid route-node ×27 → ×29 ·
PAD's file-tree "9 spec files" → 10 · PAD §8.2's env table gains the
three s163 knobs (the six-knob contract `.env.example` + SKILL §3.3
already carry) — every carrier pinned against the LIVE source tree
(the L-165c1 doctrine extended to all four).

**THE SKILL APPEARANCE FIXES** (F-166f/g): the frontmatter's DUPLICATE
`project_state:` key retired (the stale s141 layer comment-demoted +
the head-bump-orphaned s143 tail folded — the single-key house form
restored) + Appendix A's ADR-007 duplicate row removed.

**THE TDD LEDGER**: RED birth 69 failing across the two NEW batteries
(schemas-crud 38 — every field's quadrant matrix; crud-zod-seam 31 —
the seam-adoption pins; 6 current-state pins green at birth) → GREEN
with the in-flight calibration catches: the Zod 4 optin rule (an
absent object key short-circuits past `.optional()` fields — the
create normalization moved into non-optional nullable cores); the
required-on-present enum's null routing (isBadString(null) is false —
null rides the VALUE message, not the type message); the create-field
absent → null fill (the PUT three-state stays undefined); the count
re-census mid-ladder (the four carrier pins themselves add +4 — UNIT
2450 → 2454, the ladder re-derived before the ship). The collateral
re-anchors: 108 guard-form pins across api-robustness (the S37-S44
tables keep their route+field+message triples; the assertion bodies
flip to the schema-seam census + the parsed-field consumption forms —
the s163 precedent), body-pregate (the parseBody form; the F-69a3
ordering pin consolidated), source-vocabulary (the free-form source
contract re-anchored onto the schema's no-membership fields).

**THE COUNT LADDER**: UNIT 2382 → 2454 (+72 — schemas-crud +38 [the
126th suite] · crud-zod-seam +31 [the 127th suite] · docs-counts +4
[the carrier live-census pins] · body-pregate −1 [the F-69a3 ordering
pin consolidated into the parseBody-before-DB pin]) · SUITES 125 → 127
· E2E 161 held (the migration is behavior-preserving — the standing
e2e suite IS the parity proof) · badge 2543 → 2615 — every live-tense
site re-anchored in lockstep (count-ladder-166.py, assert-first,
idempotent, unique-anchor) and the pin carriers (docs-counts
UNIT/SUITES + the comment ladder + the head-layer pins → the s166 head
· dialog-geometry CLAUDE ×4 + the 2382-form negatives · the §14
Zod-reality pin → the completed-adoption form).

**THE LESSONS**: L-166c1 the Zod 4 optin rule — an absent object key
short-circuits every `.optional()` field BEFORE its preprocess runs;
an absent→value mapping must live in a non-optional core (the probe
caught it: the wrapped field returned undefined, the bare preprocess
returned null — inside an object only the core parses the absent key)
· L-166c2 the null-routing trap — a hand-rolled guard family answers
null through its OWN coercion chain (isBadString(null)=false +
non-optional asString(null)="" + !x fires): the schema port must trace
the null path through the whole chain, not just the type predicate
(the firstDayOfWeek two-message vocabulary caught it) · L-166c3 the
count ladder must be derived AFTER the battery lands — the round's own
carrier pins grew the suite mid-ladder (+4), and the first ladder pass
(2450) was stale before it shipped; re-census before the lockstep.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **127/2454** · build (29
routes) · e2e **161/161** (the migration's parity proof — the CRUD
round-trips, the oversized-body probe, the settings flows all green
through the Zod seam) · db census MATCH.

## Session-167 — THE STALE-SITE CLOSURE + THE SCHEMA LIVE-CENSUS (2026-10-22)

**The round**: the post-166 audit (the web-app-foundation §14 gate +
§15 documentation-contract checklists rode it). The baseline gate GREEN
at the s166 ship state (lint 0/0 · tsc 0 · 127/2454 · build · e2e
161/161 · probe:ref #139 STABLE · the six drift gates CLEAN ×6 · the
mobile drawer 7/7 live at 390×844 · the Tailwind v4 state clean ·
sitemap 11 routes + robots 200 + manifest 200 · bun audit's 9-advisory
dev-toolchain posture unchanged · db census MATCH). One environment
note (sandbox-only, no repo defect): this sandbox exports a stale
ambient `DATABASE_URL` pointing at a retired sandbox-era mirror — every
DB-touching command ran with the ambient var scrubbed so the repo's
own `.env` + the db-path seam resolve `<repo>/db/custom.db` (the
census PRINT confirms the resolved file).

**THE FINDINGS (all reproduced live)**: F-167a SKILL §11's pre-ship
gate block carried the retired 2382/2382 — the exact site class s165
called "the worst possible stale site", recurred ONE ROUND after its
cure because the block rode no pin (the F-99a1/F-102a2 genus) ·
F-167b SKILL §7.4's auth doctrine still said "the CRUD family keeps
the asString guards" (the pre-s166 incremental-path form) + the
heading's schemas.ts line census 103 vs the live 716 · F-167c the
SKILL head layer's OWN ladder clause carried L-166c3's stale first
pass (2450/+68/2611 vs the canonical 2454/+72/2615) · F-167d SKILL
§15.1's canonical route example counted 27 routes and taught the bare
`req.json()` + asString idiom the s165/s166 rounds eradicated ·
F-167e README's env table stayed at 3 knobs vs the six-knob contract ·
F-167f the README suite enumeration lagged 6 batteries · F-167g README
carried zero Zod/parseBody mention + the file-tree root line omitted
SKILL/worklog · F-167h PAD's header date three weeks stale · F-167i
PAD §7.3's "all 7 regression checks" vs the live 10 · F-167j PAD
§7.1's inventory table structurally broken (the Total row mid-table,
the s86-s91 rows orphaned below as headerless fragments) · F-167k the
s166 seam's own census unpinned (the s166 round's own next-round
candidate list named it: "the schemas' OWN live-census — a
schema-field-count pin family").

**THE SCHEMA LIVE-CENSUS** (F-167k — `tests/schemas-census.test.ts`,
the 128th suite, +21): the L-165c1 doctrine extended to the seam the
s166 round built — the field-inventory pins (`Object.keys(schema.shape)`
for every exported object schema, in the route-guard order: the drift
guard against a silent field drop [API widening] or add [API
narrowing]) + the exported-schema census (the 20 members read live
from source) + the line-census carrier pin (SKILL §7.4's schemas.ts
line count read LIVE from disk — RED at birth on the stale 103, GREEN
at the live 716). Mutation-proven at birth: a planted `nickname` field
→ exactly 3 RED (the create inventory + the update-equality + the
line-census) → reverted → GREEN. One calibration catch: the leads PUT
ladder orders accountId BEFORE ownerId (the route's own guard order,
unlike the create form) — the census pinned the true order, not the
assumed symmetry.

**THE STALE-SITE CLOSURE** (F-167a-j): the ten sites flipped — the §11
gate block → the live form · the §7.4 doctrine clause → the
completed-adoption form + the line census → 716 · the head layer's
ladder numbers → the canonical +72/2615 forms · the §15.1 example →
the parseBody(req, accountCreateSchema) canonical idiom + the 29 count
· the README env table → the six-knob contract (the three NEO_* knobs)
· the suite enumeration → + the six missing batteries · the README
file tree → the Zod seam named + the root line's two omitted docs ·
the PAD header date → 2026-10-22 · the §7.3 doctrine → 10 checks ·
the §7.1 surgery (the s86-s91 rows re-seated chronologically between
s85 and s92, the Total row terminating the table again below the s166
row, the counting-convention footnote documenting BOTH row forms —
guarded by structure assertions before and after).

**THE PIN EXTENSION** (the recurrence root-cure, +5 in docs-counts):
five previously-UNPINNED live-tense sites join the pin family — the
§11 gate-block form (`bun run test # ${UNIT}/${UNIT}` + the retired
2382/2382 and 2454/2454 negatives) · the §7.4 doctrine line (the
completed-adoption positive + the retired "keeps the asString guards"
negative) · the §15.1 example idiom (the parseBody positive + the
27-count and bare-req.json negatives) · the README env table (the
six-knob rows) · the PAD §7.3 ten-check form — the sites that had to
be fixed by hand at s99/s102/s106/s165/s166 now fail the gate the day
they drift.

**THE TDD LEDGER**: RED birth 6 (the line-census carrier pin + the
five docs-counts carrier pins — all stale-site findings) → GREEN with
the flips; the mutation proof (the planted field); three ladder
co-flip catches live-caught by the suite itself (the dialog-geometry
CLAUDE ×3 forms and the Appendix B wall-clock phrase the first ladder
census missed — the pin family policing its own ladder, exactly the
L-165c1 design).

**THE COUNT LADDER**: UNIT 2454 → 2480 (+26 — schemas-census +21 [the
128th suite] · docs-counts +5 [the carrier pins]) · SUITES 127 → 128 ·
E2E 161 held · badge 2615 → 2641 — every live-tense site re-anchored
in lockstep (count-ladder-167.py, assert-first, idempotent,
unique-anchor) and the pin carriers (docs-counts UNIT/SUITES + the
head-layer pins → the s167 head [the s166 layer comment-demoted, the
single-key house form] · dialog-geometry CLAUDE ×4 + the 2454-form
negatives · the Appendix B unit-total row + wall-clock phrase · the
SKILL v1.163.0 → v1.164.0 frontmatter + H1 lockstep).

**THE LESSONS**: L-167c1 an unpinned live-tense site is a scheduled
recurrence — the §11 gate block had been hand-fixed at s165 and
re-staled within one round because no pin read it; the cure is never
"remember to flip it" but "make forgetting fail" (the five new carrier
pins retire the genus on these axes) · L-167c2 the ladder's own pin
carriers police the ladder — the first ladder pass missed three
dialog-geometry CLAUDE forms and the Appendix B wall-clock phrase, and
the suite itself caught each one on the next run (the count ladder is
not done when the script exits; it is done when the suite is green) ·
L-167c3 a census pin must pin the TRUE order, not the assumed symmetry
(the leads PUT ladder's accountId-before-ownerId caught the assumption
the moment the battery ran).

**THE VERIFICATION**: lint 0/0 · tsc 0 · **128/2480** · build (29
routes) · e2e **161/161** · db census MATCH · the six drift gates
CLEAN ×6 at the audit leg (the round touches docs + tests only — no
visual source changed, the standing parity verdict carries).

## Session-168 — THE AGENTS-DOCTRINE CLOSURE + THE INVENTORY LIVE-CENSUS (2026-10-22)

The post-167 audit round. Baseline: the s167 ship state reproduced
exactly (lint 0/0 · tsc 0 · **128/2480** · build · e2e **161/161** ·
probe:ref **#140 STABLE** · the six drift gates CLEAN ×6 · the mobile
drawer **7/7 PASS** live at 390×844 · the Tailwind v4 state clean ·
sitemap 11 routes + robots + manifest standing · bun audit's 9-advisory
posture unchanged · db census MATCH) — one fresh-sandbox note: the
Playwright chromium install (the standing intake) + the documented
ambient-DATABASE_URL scrub discipline.

**THE FINDINGS (ten, all reproduced live)**: the s165/s166/s167 rounds
flipped the validation doctrine everywhere EXCEPT AGENTS.md itself —
F-168a the architecture-facts layer still said "the CRUD family keeps
the `asString` guards, the documented incremental adoption path" (the
exact clause F-167b eradicated from SKILL §7.4) · F-168b the
conventions bullet still said "No schema library — zod was deliberately
pruned" (contradicting the same file's own L74 seam) · F-168c PAD §11's
Lines column carried SEVEN stale rows (api 172/308 · constants 547/549
· rate-limit 51/126 · mobile-nav 215/143 · app-shell 70/94 ·
globals.css 413/430 · (app)/layout 11/22 — the s109 line-census family
pinned thirteen rows + the SKILL headers but never these seven PAD
rows) · F-168d/e SKILL's inventory layer carried the era-12 counts
(pages 11/15 · route handlers 27/29 · components 25/19 vs 28/22 · the
page enumeration missing the four post-s12 pages) · F-168f "8 models"
(live 9) · F-168g Bug #1's "7-check e2e suite" (live 10) · F-168h §19's
primary-foreground #ffffff mirror (live #fafafa) · F-168i README's
"nine-route /sitemap.xml" (live 11 since s142) · F-168j the repo
worklog's tail gap (the s166/s167 rounds never appended theirs).

**THE REMEDIATION (TDD — RED 18 → GREEN)**: the 129th suite
`tests/inventory-census.test.ts` (+40) — the L-165c1 live-census
doctrine extended from the schema seam to the DOC INVENTORY LAYER: the
PAD §11 Lines-column live-census (ALL 27 count-carrying rows asserted
against their files' live line counts — a row census pin guards the
surface itself) + the SKILL inventory live-census (the models/pages/
routes/components/sitemap/mobile-nav counts + the §19 color mirror, all
read live from the tree) + the AGENTS doctrine pins (the
completed-adoption clause present, BOTH retired clauses absent —
AGENTS.md joins the docs pin family for the first time) + the README
eleven-route sitemap pins. Mutation-proven at birth (a planted line in
csv.ts → exactly +1 RED → reverted → GREEN). The sixteen stale sites
flipped; the count ladder 2480 → **2520** (+40) · SUITES 128 → **129**
· E2E 161 held · badge 2641 → **2681** — every live-tense site
re-anchored atomically (count-ladder-168.py, assert-first, idempotent
[one live-caught double-application of the insertion pairs, repaired +
the guards moved first], unique-anchor) + the SKILL **v1.165.0**
frontmatter + H1 lockstep + the s168 head layer (the s167 layer
comment-demoted).

**THE SCANDIHAVEN EVALUATION**: the z.input/z.infer colocation candidate
(the s167 next-round list) evaluated live — already structurally
embodied: `parseBody` returns `z.output<S>`, the routes carry zero
hand-written body interfaces; nothing to port (documented, closed).

**THE VERIFICATION**: lint 0/0 · tsc 0 · **129/2520** · build (29
routes) · e2e **161/161** · db census MATCH · the six drift gates CLEAN
×6 at the audit leg (the round touches docs + tests only — no visual
source changed, the standing parity verdict carries).

## Session-169 — THE CLAUDE-DOCTRINE CLOSURE + THE STACK-FACTS LIVE-CENSUS + THE PRODUCTION SECRET GATE (2026-10-23)

The post-168 audit round. Baseline: the s168 ship state reproduced exactly
(lint 0/0 · tsc 0 · **129/2520** · build · e2e **161/161** · probe:ref
STABLE at the s168 fingerprint · the desktop + phone sweeps CLEAN live ·
the mobile drawer **7/7 PASS** at 390×844 · the Tailwind v4 state clean ·
sitemap 11 routes + robots + manifest standing · db census MATCH). The
scandihaven reference round: its five port candidates evaluated — the
stack-version lockstep pin ADOPTED (the exact drift it exists to kill was
live in this repo), the boot fail-fast env validation adopted in the
server-seam form (the production secret gate below; the full
`instrumentation.ts` boot gate documented as a next-rotation candidate),
the error-boundary family + the axe-core a11y gates + fast-check property
tests deferred (each its own rotation / the no-mid-rotation-bump posture),
the response-side Zod validation + DB-backed rate limiting + `@source` +
`z.input` colocation rejected after evaluation.

**THE FINDINGS (twenty-two, all reproduced live)**: the headline pair —
F-169a **CLAUDE.md was the LAST un-flipped doctrine doc** ("Hand-rolled
validation … no schema library by design" stated as current practice; ZERO
zod/parseBody/schemas.ts mentions in the whole file — the s165/s166/s167/
s168 rounds flipped AGENTS, SKILL, README, PAD-ADR-003 and never CLAUDE)
+ F-169p **the production AUTH_SECRET gate was a warn-once fallback, not a
fail** (secret() fell back to DEV_SECRET with ONE console.warn on a
missing OR short secret in production — forgeable sessions with no hard
failure, failing the web-app-foundation §6.2/§12 checklist item AND
misdocumented in .env.example as "the hard error an unset value raises" —
a hard error that never existed for either face). The version-carrier
family — F-169f the s163-era dep bump (`04e367c`: next 16.3.6→16.4.2,
playwright 1.63→1.64.1) updated NO version-carrier doc: README badge +
table row + Playwright row · PAD's stack table · SKILL §2's rows. The
straggler family — F-169b the sitemap "nine-route"/"nine-URL" twins
CLAUDE:343 + AGENTS:767 (the F-168i fix pinned README only) · F-9
DEPLOYMENT's "the 27 API route handlers" (live 29 route files / 41 verb
handlers since s163) **and the docs-counts pin ITSELF asserting the stale
constant** — the L-165c1 genus alive inside the pin family. The PAD
internal-consistency family — F-169k §3.1's "hand-rolled validation at
the boundary" (contradicting PAD's own ADR-003) + §6.1's PHANTOM
`asOneOf` helper (the live set: asString/asNumber/asInt/asDate/asFKId) ·
F-169l the tree's "auth(6: …)" (live 8 since s163) · F-169m ADR-003's
"~129 auditable lines" (live 171→184) · F-169s the s76/s77 row inversion
+ the s127-s130 inventory-row gap. The CLAUDE facts family — F-169c the
models list of 8 (Opportunity missing) · F-169d the env table of 3 knobs
(live 6) · F-169e the enumerations stale-by-omission (~48/129 suites,
7/10 specs). The SKILL mirror family — F-5/F-3/F-4 §4.1's "(complete)"
@theme block carrying FIVE stale tokens (primary #3b82f6 vs live
#2563eb — the session-7 re-pin! — primary-hover, foreground, line,
line-soft) + `--color-line-strong` missing + the false label over a
~30-token block while globals.css carries 127 `--color-*` tokens + §19's
primary/primary-hover rows · F-6 §20's "(3 vars)" · F-19 Appendix B's
"~15 s" vs the table's "~18 s". The README vintage family — F-169h the
file tree's "(app)/ 📄 page.tsx # Dashboard (/)" (the file removed at
s142; the tree omitted dashboard/, the marketing pair, the landing,
reset-password) · F-169i the Quick Start's "Visiting / redirects to
/login" + "land on a dashboard" (pre-s142 narration) · F-169j "gate + the
FOUR drift sweeps" (live six) · F-169n the Tested row's s98-era
"space-y census 110/18" (live 21/117). The AGENTS straggler family —
F-11 "the 8 inner wrappers + login + signup consume it" (live 13 primary
pages + 10 aliases) · F-12 the "596 Vitest checks across 38 suites"
clause with no era marker · F-13 the "242 color-mix() calls" s25-era
count (the live compiled CSS carries 293 — build-dependent, reframed
count-free with the census as an era record).

**THE REMEDIATION (TDD — RED 35 + the auth battery's 2 production-gate
pins → GREEN, mutation-proven)**: `tests/facts-census.test.ts` — the
130th suite (+36), the L-165c1 doctrine extended to the STACK-FACTS
layer: the version carriers read LIVE from node_modules (next 16.4.2 ·
playwright 1.64.1 — package.json, the lockfile, and the build banner
three sources agreeing) with every doc row asserted to carry them (the
scandihaven PAD §1.2 lockstep pattern embodied as a pin) · CLAUDE.md
joins the docs pin family (the doctrine clause + the models list + the
env table + the e2e enumeration + the era marker) · the DEPLOYMENT
live-census re-anchor (BOTH the doc AND the pin-entrenched docs-counts
literal — the root cure applied to the pin family's own member) · the
SKILL §4.1/§19 color mirror read live from globals.css · PAD's doctrine
lines + the auth(8) tree + the ~184 rationale + the s76/s77 order + the
s127-s130 footnote · the README tree/Quick-Start/gate/space-y pins · the
AGENTS stragglers (the eleven-URL, the 13-page consumer census read
live, the era markers) · the production-secret doc posture. THE PRODUCTION
SECRET GATE (the code leg): `secret()` now THROWS in production on a
missing OR short AUTH_SECRET (the web-app-foundation §6.2 posture — the
L-164c3 doctrine: the repo's own distilled companion skill is the bar);
dev/test keep the documented DEV fallback (the DX story unchanged; the
existing hand-signed battery IS that face); the throw rides every session
op so the first op surfaces the actionable message instead of minting
forgeable cookies; `.env.example`'s false contrast retired for the true
posture line; the env-table default cells in README/PAD/CLAUDE flipped.
The ~24 stale sites flipped across the five docs + DEPLOYMENT; the count
ladder 2520 → **2559** (+39: facts-census +36 · auth +3) · SUITES 129 →
**130** · E2E 161 held · badge 2681 → **2720** — every live-tense site
re-anchored atomically (count-ladder-169.py, assert-first, idempotent
[ONE live-caught tooling defect — the head-surgery skip-check split on
the wrong `---` boundary and double-applied on the re-run; repaired +
the guard rebuilt on the verified-single form — the L-168c3 class,
caught and cured in-round again], unique-anchor) + the SKILL **v1.166.0**
frontmatter + H1 lockstep + the s169 head layer (the s168 layer
comment-demoted).

**THE TDD LEDGER**: RED birth 35 failing + 1 born-green census anchor
(every failure a finding; zero wrong-reason failures after the
wrap-normalization calibration catches — FOUR pins initially failed on
line-wrapped anchors, the s167 lesson recurring at birth: fixed by
normalizing whitespace for the wrapped-clause assertions). The auth
battery's 2 production-gate pins born RED (the code face) + the
development-fallback pin born GREEN (the existing behavior). The
mutation-proof: the planted README badge regression (16.4.2 → 16.3.6) →
exactly 1 RED → reverted → GREEN. One in-flight calibration catch: the
auth.ts secret-gate edit grew the file 171 → 184 lines — the live
line-census pins caught the collateral BEFORE the ship (the PAD §11 row
+ the ADR-003 rationale + the SKILL §7.4 heading all re-derived; the
census policing its own round's code change, exactly the L-165c1 design).

**THE VERIFICATION**: lint 0/0 · tsc 0 · **130/2559** · build (29
routes) · e2e **161/161** · db census MATCH · the drift-gate argument
from s164/s168 carries (the round touches docs + tests +
`src/lib/auth.ts` — server-only, zero visual surface; the desktop +
phone sweeps re-verified CLEAN live at the audit leg; the standing
parity verdict holds).

## Session-170 — THE ERROR-BOUNDARY FAMILY + THE BOOT GATE + THE SMOKE LEG + THE ARTIFACT HYGIENE + THE DOCTRINE-STRAGGLER CLOSURE (2026-10-23)

The post-169 audit round. Baseline: the s169 ship state reproduced exactly
(lint 0/0 · tsc 0 · **130/2559** · build · e2e **161/161** · probe:ref
STABLE · the desktop + phone sweeps CLEAN live · the mobile drawer **7/7
PASS** at 390×844 · the Tailwind v4 state clean · sitemap 11 routes +
robots + manifest standing · census MATCH). The scandihaven reference
round: the s169-deferred ports ADOPTED (the `instrumentation.ts` boot
gate + the `error.tsx`/`global-error.tsx` boundary family + the
stale-chunk self-heal — "its own rotation: a new visual surface" — this
is that rotation) + the web-app-foundation §13.4/§14 smoke leg ADOPTED
(the gate-order step the repo never had); the axe-core a11y gates +
fast-check property tests still deferred (new devDeps — the
no-mid-rotation-bump posture holds).

**THE HEADLINE FINDING (F-170a, Critical, verified live)**: the
standalone production artifact shipped the repo's private content —
`.env` (the real AUTH_SECRET + DATABASE_URL), `.git/` (171 MB — the full
history), `db/` (the dev SQLite with user rows + scrypt hashes),
`uploads/`, `skills/` (194 MB — the whole 248-skill bank), `docs/`
(49 MB), `worklog.md`, `test-results/`, the five engineering docs,
`scripts/`, `tests/` — ~550 MB where ~151 MB suffices. ROOT CAUSE: the
upload family's runtime-computed fs paths (uploads.ts's
validated-anchor `existsSync`/`resolve` chains) make `@vercel/nft`'s
static analysis fall back to tracing the whole `outputFileTracingRoot`
— 2715 skills files alone in `app/api/upload/route.js.nft.json`. AND
`.env` rides TWICE: the trace AND Next's own `writeStandaloneDirectory`
`loadedEnvFiles` copy (build/index.js:323 — immune to tracing
excludes). THE CURE (each piece verified live BEFORE the plan landed):
`outputFileTracingExcludes` (the 27-entry set) + the build script's
trailing `rm -f .next/standalone/.env` — the ~151 MB clean artifact
(`server.js` + `.next/` + `node_modules/` + `package.json` + `prisma/`
+ `public/` + `src/` + `next.config.ts` only), the photo-e2e pair GREEN
against it (prisma/schema.prisma stays traced, the db-path anchors
still validate, `db/`/`uploads/` are mkdir'd on demand), and the smoke
leg's 14th assertion policing every rebuild.

**THE FINDINGS (twenty-one, all reproduced live)**: the code legs —
F-170a the artifact hygiene (above) · F-170b zero error boundaries
(anywhere in `src/` — an uncaught render error shipped Next's stock
crash page: no brand, no recovery affordance, no digest, no stale-chunk
self-heal) · F-170c no boot gate (the s169 secret gate is a runtime
seam — a misconfigured production boot failed late or never signaled;
the §6.2 posture prescribes fail-fast AT BOOT) · F-170d no smoke leg
(the §13.4/§14 gate order's missing step — nothing boots the artifact
and asserts the 401/400/429/health/page contracts between build and
e2e). The doc legs — F-170e AGENTS' live-tense reports-pipeline
doctrine citing the RETIRED `REPORTS_PIPELINE_SLUGS` + the nonexistent
`reportsBucketCounts` + the retired merged-list quirk as current
practice (an agent following it implements the wrong counting behavior)
· F-170f PAD §5.2's "DEFINITIVE" color table carrying FOUR stale hexes +
the missing line-strong + the mis-attributed placeholders row + the
`#111827` contrast sentence (the s169 wave re-pinned SKILL §4.1/§19 and
never PAD §5.2 — the LAST un-flipped color carrier) · F-170g the
session-gating counts wrong in three places (PAD §3.1's phantom
"search's public shell" · PAD §6.1's "19 sessioned; the 10 sessionless
[8 verbs]" · SKILL §5.2's "all session-gated" — live: 19 gated / 10
ungated, the 7 public auth verbs + me + health + uploads/[name]) ·
F-170h/i/j the AGENTS straggler family (the retired FUNNEL_STAGES
labels · the s13-era chart-component claims · the singular-form
leads-view localStorage key, fixed to the live .views form) · F-170k
the Commands table omitting seven
package.json scripts · F-170l README's stale $9/$19/$39 pricing (live
$8/$14/$20 since the s149 repricing) · F-170m/n/o/p/q the PAD/SKILL
type/palette/ADR/table-header carriers (the retired SavedReport listed
+ the live Opportunity missing · the stale CHART_COLORS note · §20's
missing Opportunity row · Appendix A's ADR-007 contradiction · the
12px-uppercase table-header claim) · F-170r/s/t/u the small carriers
(the radix ^1-for-all-6 row · the "with empty states" tree annotation ·
the #111827 contrast + the 16.3.6 literals · the MIT license claim with
NO LICENSE file).

**THE REMEDIATION (TDD — RED birth: doctrine-census 26 failing + 4
born-green census anchors, the other three suites failing at the
missing surfaces → GREEN, mutation-proven)**: FOUR NEW SUITES (+79) —
`tests/doctrine-census.test.ts` (the 131st, +30: every doc finding
pinned live-read — the constants, the types barrel, the globals.css
tokens, the package.json scripts, the requireSession CALL-form grep,
the landing price fields, the node_modules versions) ·
`tests/chunk-recovery.test.ts` (the 132nd, +12: the message family, the
cooldown arithmetic, the guarded reload — unavailable storage disables,
the flag written BEFORE the reload) · `tests/boot-env.test.ts` (the
133rd, +20: the env matrix over the pure seam + the instrumentation
source pins) · `tests/error-boundaries.test.ts` (the 134th, +17: the
two boundaries' source contracts + the smoke-script contract). THE CODE
LEGS: `src/lib/chunk-recovery.ts` (the scandihaven port in the
house pure-seam form) + `src/app/error.tsx` + `src/app/global-error.tsx`
(the boundary pair: the house-styled card on the not-found idiom, the
digest ref, the reset() Try-again, the self-heal wiring,
global-error's own html/body + its own globals.css import, ZERO
component-tree imports beyond the recovery seam) + `src/lib/boot-env.ts`
+ `src/instrumentation.ts` (the boot gate: production AUTH_SECRET
missing/short THROWS AT BOOT — verified live, the secretless boot
refuses to serve with the actionable message; the site-url/NEO_*
misconfig warnings; dev/test boot soft; the phase-production-build
skip keeps `next build` secretless) + `scripts/smoke-test.sh` + the
`smoke` script + the gate/gate:full wiring (the §13.4/§14 smoke leg:
the standalone boot on :3210 with `db/smoke.db` + a dedicated throwaway
secret, the 14-check ladder — health · the unauth 401s · the login
round-trip + the neo_session cookie · the sessioned envelope · the Zod
400 · the valid create · the logout data:null face · the 11th-login
429 · the page titles · the sitemap/robots/manifest family · THE
BOOT-GATE PROBE · THE ARTIFACT-HYGIENE assertions) + the
`outputFileTracingExcludes` set + the build script's `rm -f` (the
artifact-hygiene double-cure). THE DOC FLIPS: the ~21 stale sites (the
AGENTS doctrine bullets + the Commands table's 8 new rows + the
gate-order smoke step · the PAD §5.2 table + §5.1 + §3.1/§6.1 + §4.2 +
ADR-015 + the §11 rows + the session-170 inventory row · the SKILL
v1.167.0 + the radix/§5.2/§8/§19/§20/AppA/AppB fixes + the s170 head
layer · the CLAUDE build-table smoke row + the Error Handling section ·
README's pricing + the tree's four new surfaces + the LICENSE file the
MIT claim stood on · `.env.example`'s boot-gate posture line). THE
COLLATERAL RE-ANCHORS: the gate-script chain pins (the smoke step),
the docs-counts UNIT/SUITES constants (2644/134 — the inventory-census's six new §11-row pins grew the suite AFTER the first ladder pass, the L-166c3 lesson live again), the dialog-geometry +
facts-census space-y census (21/117 → 23/123 — the boundary pair's own
space-y usage), the inventory-census next.config.ts row (47 → 93 — the
excludes block), the Appendix B totals + the wall-clock phrase (~21 s).

**THE TDD LEDGER**: RED birth — doctrine-census 26 failing + 4
born-green (the live-census verifications), chunk-recovery/boot-env/
error-boundaries failing at the missing surfaces; THREE live-caught
calibration catches at birth (the wrap/pin-form mismatches — the
L-169c1 lesson applied to this round's OWN pins; the commands-table
`bun run <key>` documentation form; the census-overcount trap — the
bare-name requireSession grep counted me/route.ts's "NOT gated"
COMMENT, the CALL form `await requireSession(` is the truth: 19 gated /
10 ungated — the L-168c2 lesson recurring at birth); ONE live-caught
smoke-script defect at the live run (check 09's contact status
vocabulary — "new" is a LEAD status, contacts ride active/inactive;
check 10's `/api/auth/me` expectation — the route is the by-design
data:null face, session-41, not a 401); ONE head-surgery tooling defect
(the first-pass skill-head script landed the live line in the wrong
position — the corrective script re-seated it, both idempotent); the
mutation-proof (the planted badge regression 2805 → 2720 → exactly 1
RED → reverted → GREEN).

**THE VERIFICATION**: lint 0/0 · tsc 0 · **134/2644** unit · build (29
routes, the ~151 MB hygienic artifact) · **SMOKE 14/14** (the new leg —
incl. the boot-gate refusal probe + the artifact-hygiene assertions) ·
e2e **161/161** · db census MATCH · the drift-gate argument carries
(the round's visual surfaces are failure-path-only — the boundaries
render nowhere on the happy path; the sweeps + probe:ref + the drawer
battery re-verified at the audit leg; the standing parity verdict
holds).

## Session-171 — THE AXE-CORE A11Y TWO-GATE + THE NAMED-CONTROL FAMILY (2026-10-23)

The post-170 audit round. Baseline: the s170 ship state reproduced
exactly (lint 0/0 · tsc 0 · **134/2644** · build · smoke **14/14** · e2e
**161/161** · probe:ref STABLE · the desktop + phone sweeps CLEAN live ·
the mobile drawer **7/7 PASS** at 390×844 · the Tailwind v4 state clean
· sitemap 11 routes + robots + manifest standing · census MATCH). The
rotation candidate: the s170-named **axe-core a11y gates** (the
web-app-foundation §8.3 "best-in-class add-on"); the fast-check property
tests stay deferred (their own rotation — the no-mid-rotation-bump
posture holds for both families).

**THE AUDIT (the live axe probes — ours across twelve surfaces × two
widths + the drawer-open state, PLUS the same scan against the
REFERENCE's own DOM for the parity context)**: three violation families.
(1) `button-name` (critical) — OURS: 19 unnamed SelectTrigger comboboxes
(dashboard ×2 · accounts ×3 · contacts ×15 row selects · activities ×2 ·
reports ×4) + 11 bare inert Checkboxes (the dashboard's two Follow-up
families) + 4 `hidden sm:inline` icon-only Buttons unnamed at phone
width (Filter · Scan Card · Import · Export CSV). ROOT CAUSE (verified
in the axe 4.13 source): `role="combobox"` names come from author
attributes ONLY — `subtreeText` short-circuits on `namedFromContents`,
so the trigger's visible span text ("Decision Maker", "All Stages") is
INVISIBLE to the accessible-name computation; a screen reader announces
every Select nameless. The REFERENCE ships button-name on EVERY page
(6/5/2/2/4/4/6/69 nodes — its own unnamed `w-9` icon-button family).
(2) `color-contrast` — the shared parity palette (the `.bg-white/10`
active-nav chip · the `.text-white/*` drawer family · the landing
preview grays · the `.bg-emerald-600` quick-log · the calendar's
gray-400 off-month cells · the muted-ink inactive tabs — each verified
on the reference's own DOM). (3) `svg-img-alt` — the funnel trapezoid
Layers (recharts 2.15 HARDCODES `role="img"` in
`renderTrapezoidsStatically`, no aria seam — `adaptEventsOfChild` passes
event keys only; the reference ships the identical 4 violations).

**THE REMEDIATION (TDD — RED birth: a11y-controls 21 failing + the
leads-precedent pin born-green, the spec-contract pins born-green with
the spec → GREEN, mutation-proven)**: THE NAMED-CONTROL FAMILY —
aria-label on every open-surface control (the 19 SelectTriggers via the
leads-page precedent form "Filter by stage/source/owner/industry/
revenue range/status/period"; the contacts rows carry the row context
`Role — ${c.name}`; the two Checkbox families carry their sibling-span
text; the 4 icon-only Buttons carry their desktop labels) — invisible
supersets, zero className/DOM changes (the drawer precedent: the
reference's nameless controls are its defect, ours name them). THE
AXE-CORE A11Y TWO-GATE — `tests/e2e/a11y.spec.ts` (the §8.3 battery:
25 checks = the nine CRM pages × desktop + phone + the three anon
surfaces × both widths + the drawer-open state; GATE 1: structural
violations ZERO; GATE 2: color-contrast + svg-img-alt nodes must cite
the SANCTIONED register — the parity palette + the recharts genus, each
matcher carrying its citation, incl. the byte-identical `.self-start`
"Most popular" pill verified on the reference's landing) + `tests/
a11y-controls.test.ts` (the 135th suite, +22: the named-control census
over the five open-surface pages + the declared-devDep pin + the
two-gate spec contract) + `axe-core` DECLARED as a devDep ^4.13.0
(F-171e — the undeclared-transitive standby cured). THE DOC LEG: the
count ladder 2644 → 2668 (+24) · SUITES 134 → 135 · E2E 161 → 186 (+25)
· badge 2805 → 2854 (count-ladder-171.py + skill-head-171.py +
skill-head-fix-171.py, assert-first, idempotent) + the PAD §11's two new
a11y rows + the CLAUDE-missed 2559 gate-order straggler cured + the
SKILL v1.168.0 frontmatter + H1 lockstep + the s171 head layer.

**THE TDD LEDGER**: RED birth — a11y-controls 21 failing + 1 born-green
(the leads precedent) + the spec-contract pins green with the spec;
live-caught at birth: the loop-registered spec broke the Appendix B
per-spec `test(` census (rewritten to 25 EXPLICIT registrations — the
census idiom requires one literal test() per check) + the regex-literal
escaping trap in the sanctioned register (the `\\/` form terminates the
literal — rewritten to plain substring matchers) + the `.self-start`
landing pill missing from the matchers (caught by the e2e run itself,
then verified byte-identical on the reference's landing before
sanctioning it) + the inventory-census +2 (the L-166c3 lesson live
again — the two new §11 rows grew the suite after the first ladder
derivation); the mutation-proof (the planted badge regression 2854 →
2805 → exactly 1 RED → reverted → GREEN).

**THE VERIFICATION**: lint 0/0 · tsc 0 · **135/2668** unit · build (the
~151 MB hygienic artifact) · smoke **14/14** · e2e **186/186** (the 25
new a11y checks GREEN) · db census MATCH · THE ATTRIBUTE-ONLY PROOF:
the mobile drawer **7/7 PASS** re-run + probe:ref **STABLE** + the
desktop + phone sweeps **CLEAN** re-run (the aria-labels changed no
pixel — the parity verdict holds, the reference itself unchanged since
the s168 fingerprint).

## Session-172 — THE DIALOG-SURFACE NAMED-CONTROL CLOSURE + THE FAST-CHECK PROPERTY FAMILY (2026-10-23)

The post-171 audit round. Baseline: the s171 ship state reproduced
exactly (lint 0/0 · tsc 0 · **135/2668** · build · smoke **14/14** · e2e
**186/186** · probe:ref STABLE · the desktop + phone sweeps CLEAN live ·
the mobile drawer **7/7 PASS** at 390×844 · the Tailwind v4 state clean
· sitemap 11 routes + robots + manifest standing · census MATCH). The
rotation candidates (the s171 close's named list): the fast-check
property tests (the other s170-named family — its own devDep bump) ·
the dialog-surface select family (the closed-by-default genus the
probes never reached) · the drawer interior re-walk (covered by the
7/7 battery re-run). This round adopts the FIRST TWO: the dialog genus
needs NO devDep (attribute-only fixes — the s171 cure extended),
fast-check is the round's ONE devDep bump (the no-mid-rotation-bump
posture holds: s171 bumped axe-core, s172 bumps fast-check).

**THE AUDIT (the live OPEN-DIALOG probes — ours across the five CREATE
dialogs + the contact EDIT dialog, PLUS the same scan against the
REFERENCE's own open dialogs for the parity citation)**: the
closed-by-default genus — a Radix Dialog's content is ABSENT from the
DOM while closed, so the s171 round's twelve-surface scan AND the a11y
two-gate never saw it. OURS: 9 nameless create-dialog SelectTriggers
(Lead 2 · Account 1 · Contact 1 · Event 3 · Activity 2 — sibling
`<Label>` text is invisible to the combobox name computation, the
F-171a rule) + the entity-edit-dialog family: 5 nameless
config-driven SelectTriggers (Contact Status+Source · Lead Status+Source
· Account Status) AND 17 unlabeled Inputs (the bare
`<Label>{f.label}</Label>` renders no htmlFor, the Inputs no id). THE
REFERENCE (verified live on its own open DOM): the IDENTICAL
nameless-combobox family on every dialog PLUS its own label violations
(its event dialog: 4 unlabeled inputs; its activity dialog: 1) — our
fixes are invisible supersets under the s171 doctrine.

**THE REMEDIATION (TDD — RED birth: dialog-controls 6 failing +
property 2 failing [the csv round-trip — the F-172e parser defect
caught by the property at birth] + 19 born-green, THREE live-caught
property-calibration catches [the unqualified vocabulary intrusion ·
the undefined minValue · the ragged-row normalization — each a seam
contract the generator must respect] → GREEN, mutation-proven)**: THE
DIALOG-SURFACE NAMED-CONTROL CLOSURE — aria-label = the sibling Label's
exact text on the 9 create triggers ("Status" · "Source" · "How did you
meet?" · "Event Type" · "Related To" · "Activity Type" · "Related To
(Type)") + the edit-dialog htmlFor/id wiring (`edit-${f.key}` — ids
collision-safe, only one dialog open at a time) +
`aria-label={f.label}` on the config-driven trigger + THE TWO-GATE
EXTENDED (`tests/e2e/a11y.spec.ts` +6 EXPLICIT registrations: the five
create dialogs + the contact edit dialog, each open → scanTwoGate →
Escape; the sanctioned register rides UNCHANGED — the open-dialog
landscape verified live: nothing new behind the dialogs) + THE
FAST-CHECK PROPERTY FAMILY (`tests/property.test.ts` — the 137th suite,
+13: the csv escape/parse round-trip · the guard idempotence · the
lead-views round-trip · the saved-reports total/idempotent seam · the
formatter robustness freeze · the initials invariants · the csvFilename
convention; fast-check ^4.10.2 DECLARED — the 13th devDep) + THE PARSER
FIX (F-172e: `parseCsv`'s GLOBAL line-ending normalization mutated
quoted cells — a quoted CRLF became LF on import, RFC 4180 §2.6
violated; the normalization moved INSIDE the state machine, OUTSIDE
quotes only; unquoted CRLF/lone CR keep the pinned s26 row-break
behavior) + `tests/dialog-controls.test.ts` (the 136th suite, +14).

**THE COUNT LADDER**: 2668 → 2697 (+29: dialog-controls +14 + property
+13 + inventory-census +2 [the two new §11 rows]) · SUITES 135 → 137 ·
E2E 186 → 192 (+6) · badge 2854 → 2889 (count-ladder-172.py +
skill-head-172.py, assert-first, idempotent — the re-runs verified
0-flip no-ops). The collateral re-anchors: dialog-geometry (the
bare-cell pin rides the aria-label form + the no-nameless negative) ·
dead-code-hygiene (the 13th devDep) · inventory-census (the 37-row
surface) · docs-counts (the constants + the Appendix B a11y row 25 → 31
+ the layer-axis pin re-anchor) · login-family + the dialog-geometry
CLAUDE lockstep carriers (2668/186 → 2697/192) · README (the commands
list + the Tested row).

**THE VERIFICATION**: lint 0/0 · tsc 0 · **137/2697** unit · build (the
hygienic artifact) · smoke **14/14** · e2e **192/192** (the 6 dialog-open
scans GREEN) · db census MATCH · the mutation proof (the planted badge
regression 2889 → 2854 → exactly 1 RED → reverted → GREEN).

### Session-173 — THE INJECTABLE CLOCK SEAM + THE RATE-LIMIT WINDOW PROPERTY FAMILY + THE ZOD ROUND-TRIP PROPERTY FAMILY (2026-10-23)

The post-172 audit round. The baseline gate GREEN at the exact s172 ship
state (lint 0/0 · tsc 0 · **137/2697** · build · smoke **14/14** · e2e
**192/192** · probe:ref STABLE — the fresh reference probe, the bundle md5
`46bc2d9c`, the sanctioned-register citations hold · the desktop + phone
sweeps CLEAN live · the mobile drawer **7/7 PASS** at 390×844 · the
Tailwind v4 state clean · sitemap 11 routes + robots + manifest standing ·
census MATCH). The rotation: the s172 close's named **deeper property
family** — the schemas.ts Zod round-trips + the rate-limit window
arithmetic (the latter needs an injectable clock seam). NO new devDep
(fast-check ^4.10.2 rides the s172 declaration — the
no-mid-rotation-bump posture holds trivially).

**THE SEAM FINDINGS** (each verified live against the source): F-173a
`rateLimit()` read `Date.now()` internally — the fixed-window arithmetic
(the reset crossing · the retryAfter ceiling · the remaining monotonicity)
was NOT property-testable, a generator cannot drive the clock; the s164
sweep ALREADY took `now = Date.now()` (`sweepRateLimits` + the pure
`computeWatermark` seam) — the rateLimit path never joined its own module's
injectable form. F-173b the rate-limit window invariants unpinned as
properties. F-173c the Zod schema round-trip properties never landed (the
other half of the s172-named deeper family — the ADR-017 doctrine applied
to the s166 seam's OWN invariants).

**THE CURE (TDD — RED birth 5 failing [P-n + P-o + the three rate-limit
clock-seam examples — the 4th argument ignored at runtime, the injected
clock had no effect, the crossing never observed] + 42 born-green [the
Zod family P-h…P-m + P-p/P-q freeze pins] → GREEN, mutation-proven)**:
`rateLimit(key: string, limit: number, windowMs: number, now =
Date.now())` — the s164 `sweepRateLimits` form extended to the rateLimit
path. PURELY ADDITIVE: the default keeps `Date.now()`, all 7 call sites
(login/signup/resend/verify/forgot/reset-password/upload) ride UNCHANGED,
zero behavior change on the wire.

**THE DEEPER PROPERTY FAMILY** — `tests/property.test.ts` grows in place
(+12, the P-lettering continues; the ADR-017 one-suite doctrine — SUITES
137 HELD): the **Zod round-trip half** (P-h the create-defaults quadrant
round-trip for every CREATE schema · P-i the enum membership invariant
[members parse to their trimmed selves, outsiders reject] · P-j the
emailField trim/lowercase contract [login + signup, the one-seam parity] ·
P-k the PUT three-state round-trip [absent stays ABSENT, null clears, a
value trims] · P-l the required-name quadrant [null/empty/whitespace reject
with the route's exact message] · P-m the contacts legacy priority mapping
[hot/warm/cold → Key/Standard/At Risk]) + the **rate-limit window half**
(P-n the fixed-window reset crossing [blocked at t₀ → still blocked one ms
before → allowed with a FRESH count AT t₀+window] · P-o the retryAfterSec
formula [the exact ceiling ceil((resetAt − now)/1000), floor 1] · P-p the
remaining monotonicity [allowed calls decrement exactly once; blocked
calls never transition back] · P-q the first-call + default-clock
equivalence) + the clock-seam example battery
(`tests/rate-limit.test.ts` +3: the crossing example · the retryAfter
ceiling · the default-form equivalence + the additive signature source
pin).

**FOUR live-caught calibration catches at RED birth** (the L-172c3
doctrine live again — each a seam contract the generator/test must
respect): the P-k trimmed-output contract (the generator's raw value may
carry its own whitespace — assert against the TRIMMED form) · the fc.date
NaN edge (an INVALID Date hands `toISOString()` a throw before the schema
ever sees the input — the integer-timestamp generator is deterministic
and always in-range) · the **stateful-seam key collision** (fc's
short-string generator COLLIDES within 150 runs — the module-level bucket
map persists across runs, a second run on a colliding key inherits the
first run's count; the per-run monotonic run id is the cure: uniqueness is
a property of the RUN, not of the generated input) · the P-p/P-q
born-green ledger (the collision was their only RED face).

**THE COUNT LADDER**: 2697 → **2712** (+15: property +12 + rate-limit +3)
· SUITES **137 HELD** · E2E **192 HELD** (the round is seam-only — no
visual surface touched) · badge 2889 → **2904** (count-ladder-173.py +
skill-head-173.py, assert-first, idempotent — the re-runs verified 0-flip
no-ops). The collateral re-anchors: the N-67b signature pin (the additive
`now = Date.now()` form) · the dialog-geometry CLAUDE lockstep carriers
(2697 → 2712, the retired forms joining the negatives ladder) · the
inventory-census (property.test.ts 316 → 723 · rate-limit.ts 126 → 133 —
the §11 rows live-censused) · the docs-counts constants + the lineage
comment + the F-106a1 layer-axis pin (the s173 layer live, the s172 layer
beneath).

**THE DOCS LEG**: the PAD **ADR-018** (the injectable-clock doctrine) +
the session-173 inventory row + the two §11 re-anchors · the CLAUDE
property-pyramid extension (13 → 25 checks, the two s173 halves) · the
README Tested row's s173 property mentions · the SKILL **v1.170.0** +
H1 lockstep + the s173 head layer (the s172 layer comment-demoted at its
ship counts 2697/192).

**THE SEAM-ONLY PROOF**: the round touched no component, no page, no
className — the drawer battery 7/7 re-run · probe:ref STABLE re-run · the
desktop + phone sweeps CLEAN re-run carry the parity verdict unchanged.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **137/2712** unit · build (the
hygienic artifact) · smoke **14/14** · e2e **192/192** · db census MATCH ·
the mutation proof (the planted badge regression 2904 → 2889 → exactly 1
RED → reverted → GREEN).

### Session-174 — THE TYPE-GATE HARDENING + THE FULL-STRICT FLIP + THE SINGLE LOCKFILE (2026-10-23)

The post-173 audit round, its rotation trigger THE REPO'S OWN NEWEST
ARTIFACTS: commit `25f1847` added `skills/web-application/SKILL.md` v1.0.0
(the four-sibling family distillation — digma/neo-crm/project-management/
zero-balance, 1,226 combined commits of build-and-remediate history) plus
`skills/web-application/codebase-evaluation-report.md` (the comparative
audit that ranks neo-crm #1 at 8.55 weighted while naming its defect
register). The report's §9.2 graft list prescribes exactly the three moves
this round lands — the code-wins rule runs in reverse: the CODE disagreed
with the repo's own distilled doctrine, so the code is what got fixed. The
baseline gate GREEN at the exact s173 ship state (lint 0/0 · tsc 0 ·
**137/2712** · build · smoke **14/14** · e2e **192/192** · probe:ref
STABLE · the desktop + phone sweeps CLEAN live · the mobile drawer **7/7
PASS** at 390×844 · the Tailwind v4 state clean · sitemap 11 routes +
robots + manifest standing · census MATCH). NO new devDep (the
no-mid-rotation-bump posture holds trivially: this round bumps NOTHING).

**THE FINDINGS** (each verified live against the source): F-174a
`next.config.ts` set `typescript: { ignoreBuildErrors: true }` — the build
was NOT a type gate; a planted type error compiled GREEN into the
deployable artifact (reproduced live at this round's gate-proof: the SAME
plant swallowed under the old posture, build FAILED under the new one).
F-174b `tsconfig.json` carried `"noImplicitAny": false` — weakened strict
mode; the flip probe surfaced exactly THREE implicit-any stragglers
repo-wide (`scripts/sweep.ts:862,873` — the union-find inline twin of the
FULLY-TYPED pure seam at line 607; the entire `src/` tree already clean).
F-174c two lockfiles committed (`bun.lock` + `package-lock.json`) — the
s61/s62 §16ba npm-world-parity rule, superseded by the new skill's
Appendix A lesson 14 ("Two lockfiles in one repo is a reproducibility
bug"); the npm-world path (`install_packages.sh`) installs by package NAME
from the registry — it never consumed the lockfile.

**THE CURE (TDD — RED birth 4 failing + 1 born-green → GREEN,
gate-proven + mutation-proven + stash-proven)**: the `ignoreBuildErrors`
block RETIRED (the build IS the type gate — the zero-balance graft) · the
`noImplicitAny: false` escape hatch RETIRED (full TS strictness — the
digma graft) with the sweep.ts inline twin typed verbatim like its pure
seam (`find = (k: number): number` · `union = (x: number, y: number)` ·
the two typed Maps) · `package-lock.json` RETIRED (one package manager,
one lockfile; the `outputFileTracingExcludes` entry stays as the defensive
tripwire). The source-pin battery: `tests/type-gate.test.ts` — **the 138th
suite** (+5: the build-is-the-type-gate pin · the full-strict pin · the
typed union-find pin · the single-lockfile pin · the gate-chain freeze pin
— typecheck stays BEFORE build, the §15 fast-gates-first order holds, the
manual step remains the FASTER signal while the build is the ENFORCER).

**THE GATE-PROOF** (this round's own non-vacuousness — the F-174a
evidence live): a planted type error in a src file → `bun run build`
FAILS under the hardened posture → the old posture restored (ignoreBuildErrors:
true) → the SAME plant builds GREEN (the swallowed error — the defect
DEMONSTRATED, not asserted) → both restored → GREEN.

**THE COUNT LADDER**: 2712 → **2717** (+5: the type-gate battery) ·
SUITES 137 → **138** · E2E **192 HELD** (the round is config-only — no
visual surface touched) · badge 2904 → **2909** (count-ladder-174.py +
skill-head-174.py, assert-first, idempotent — the re-runs verified 0-flip
no-ops). The collateral re-anchors: the PAD §11 next.config.ts row
re-censused 93 → 99 lines (the s174 comment grew it — the
inventory-census live-read catch again) · the dialog-geometry CLAUDE
lockstep carriers (2712 → 2717, the retired forms joining the negatives
ladder) · the docs-counts constants + the two lineage comments + the
F-106a1 layer-axis pin (the s174 layer live, the s173 layer beneath).

**THE DOCS LEG**: the PAD **ADR-019** (the build-is-the-type-gate
doctrine) + the session-174 inventory row + the stack-table strict row +
the pre-ship checklist line + the §11 re-anchor · the CLAUDE gate-order
mention + the TypeScript bullet · the README Tested row + the badge + the
suite list's type-gate join · the SKILL **v1.171.0** + H1 lockstep + the
s174 head layer (the s173 layer comment-demoted at its ship counts
2712/192) + the three config-table rows (§2 stack + §3.2 next.config +
§3.2 tsconfig) · the AGENTS gate-order paragraph's s174 re-anchor.

**THE CONFIG-ONLY PROOF**: the round touched no component, no page, no
className — the standing legs re-verified at the audit leg carry the
parity verdict unchanged (the drawer battery 7/7 · probe:ref STABLE · the
sweeps CLEAN; the reference unchanged since the s168 fingerprint).

**THE VERIFICATION**: lint 0/0 · tsc 0 (under FULL strictness) ·
**138/2717** unit · build (the hygienic artifact — now the type gate TOO,
gate-proven) · smoke **14/14** · e2e **192/192** · db census MATCH · the
mutation proof (the planted badge regression 2909 → 2904 → exactly 1 RED
→ reverted → GREEN) + THE STASH-PROOF (the three config moves reverted
alone → exactly the type-gate pins RED → restored → GREEN).

### Session-175 — THE RESPONSE-SIDE WIRE-CONTRACT FAMILY (the READ half) (2026-10-24)

The post-174 audit round, its rotation trigger THE OWNER'S NEWEST COMMITS:
`f5f96d6` re-validated the comparative evaluation report against the four
repo HEADs (neo-crm stays **#1 at 8.70** — the quality score 8.0 → 8.5:
"the three flagged costs were all retired by session-174 within hours of
the original evaluation, exactly the §9.2 graft list") and shipped the
`skills/web-application` SKILL v1.1.0 + the NEW `web-application-engineering`
sibling v1.1.0 carrying the re-validation lessons; `066f9e5` archived the
session-372 transcript (the s174 close-out). The baseline gate GREEN at
the exact s174 ship state on a FRESH CLONE (lint 0/0 · tsc 0 ·
**138/2717** · build · smoke **14/14** · e2e **192/192** — after the
environmental chromium-1248 install, a fresh-sandbox intake step, not a
code defect · probe:ref STABLE [bundle md5 `46bc2d9c`] · the desktop +
phone sweeps CLEAN live · the mobile drawer GREEN at 390×844 · the
Tailwind v4 state clean · sitemap 11 routes + robots + manifest standing
· census MATCH). NO new devDep (the round bumps NOTHING).

**THE AUDIT** (each leg verified live): the READ-side census walked every
GET wire surface — the six list routes' include select sets + orderBy
contracts, the me/login user carriers, the types↔wire agreement across
all six entities (`src/types/index.ts` — "API wire shapes" — matches the
routes' include sets field-for-field). **Zero live defects found.** The
deferral register resolved the s371 close's candidates with rationale:
the hosted-CI port (§9.3 #2) DEFERRED — the owner's own newest doctrine
(`web-application-engineering` v1.1.0 §1: "**The Local Gate is the Only
Gate:** No hosted CI is trusted") + runner-side execution unobservable
from this sandbox (the honest-evidence discipline); the doc-size
restructure (N-1) owner-level; the OTP-at-rest item (§9.3 #6) ALREADY
SATISFIED (`verificationCodeHash` scrypt [s21] + `resetToken` SHA-256
[s164] — the report's parenthetical understated the repo's actual
posture); recharts 3.x (N-3) its own rotation (the standing pixel
baselines would need re-derivation, like the toolchain-bump rule).

**THE ROUND** — the s371 close's named candidate, the s173 close's named
candidate still unclaimed: **the Zod/property family's response-side READ
half.** The request side got its Zod seam (s163/166) + property family
(s173 P-h…P-m); the READ side — what `ok(rows)` actually ships to the
client store — had NO battery: the wire shapes rode entirely on the e2e's
RENDERED output, so a wire-shape regression that keeps the UI rendering
(e.g. a dropped joined field the current seed never exercises as null)
would land silently. The family: **P-r** the entity wire round-trip (for
every one of the six entities, a ROUTE-EXACT row — the include shapes the
GET list routes declare, Dates as Date objects, nulls where the schema
allows — survives the wire serialization verbatim: scalars unchanged,
every Date as its exact `toISOString()` form, nulls PRESENT (the `??`
fallback chains), the key set exact (no field dropped), the joined shapes
intact) + **P-s** the envelope pair contract (`ok()`'s wire form is
exactly `{ok: true, data}` with the payload passed through UNTOUCHED
beyond JSON's own canonicalization; `fail()`'s wire form carries
`{ok: false, error: {code, message}}` verbatim — the toast's message
survives the wire; the s35/s42 envelope doctrine as a property, driven
through the REAL helpers). Plus **the READ-half source pins**
(`tests/crud-zod-seam.test.ts` +5 — the ROUTE-side suite's other half):
the five include-carrying routes' exact include select sets · the six list
routes' orderBy contracts · every GET answers through the envelope (the
s42 doctrine — findMany feeds `return ok`) · opportunities ships RAW rows,
no include (the s31 second-deal-model: owner is a NAME string) · `auth/me`
ships the full SessionUser shape (photoUrl included — the canonical user
carrier; the login response's slim 5-field form has ZERO consumers — the
login card reads only `body.ok`, documented divergence, not a defect).

**THE TDD LEDGER**: 1 RED face at birth (the `fc.jsonObject` →
`fc.jsonValue` fast-check 4.x API calibration catch — the s172/s173
live-caught lineage) + 8 born-green (the contract-freeze pins over
working code — the s173 P-p/P-q precedent). **THE MUTATION-PROOFS**: the
planted include regression (the contacts owner select lost `avatarColor`)
→ exactly 1 RED (the include pin); the planted envelope regression
(`ok()`'s wire form grew a third key) → exactly 1 RED (the P-s key-set
pin); both reverted → GREEN. **THE STASH-PROOF**: the round's test files
stashed alone → the suite returns to exactly **138/2717**; restored →
**138/2726**.

**THE COUNT LADDER**: 2717 → **2726** (+9: property +4 + crud-zod-seam
+5) · SUITES 138 **HELD** (the ADR-017 one-suite doctrine) · E2E 192
**HELD** (the round is test-only — NO product code touched) · badge 2909
→ **2918** (count-ladder-175.py, assert-first, idempotent, unique-anchor
— 21 flips, the re-run a verified 0-flip no-op). The collateral
re-anchors: the PAD §11 `property.test.ts` row re-censused 723 → 998
lines (the inventory-census live-read catch again — the census itself
caught the stale row at the full-suite run) · the dialog-geometry CLAUDE
lockstep carriers (2717 → 2726, the retired forms joining the negatives
ladder) · the docs-counts constants + the lineage comment.

**THE DOCS LEG**: the PAD **ADR-020** (the wire-contract doctrine) + the
session-175 inventory row + the §11 re-anchor · the CLAUDE
property-pyramid extension (the READ-half join) · the README Tested row +
the badge · the SKILL **v1.172.0** + H1 lockstep + the s175 head layer
(the s174 layer comment-demoted at its ship counts 2717/192) · the plan
doc `docs/plans/2026-10-24-session175-response-side-wire-contract-family.md`.

**THE TEST-ONLY PROOF**: the round touched no component, no page, no
className, no route — the standing legs re-verified at the audit leg
carry the parity verdict unchanged (the drawer battery · probe:ref
STABLE · the sweeps CLEAN; the reference unchanged since the s168
fingerprint).

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2726** unit · build (the
type-gate artifact) · smoke **14/14** · e2e **192/192** · db census MATCH.

### Session-176 — THE RECHARTS 3.x MIGRATION (the N-3 retirement) (2026-10-24)

The post-175 audit round, its rotation trigger THE OWNER'S NEWEST COMMIT
`35f04d5` — the session-374 transcript, whose close names this round
verbatim ("the recharts 2.15 → 3.x migration (N-3, needs its own baseline
re-derivation round) is the largest remaining named candidate"); the
session-373 close agrees. The baseline gate GREEN at the exact s175 ship
state (lint 0/0 · tsc 0 · **138/2726** · build · smoke **14/14** · e2e
**192/192** · probe:ref **STABLE** at `46bc2d9c` · the desktop + phone
sweeps CLEAN · the mobile drawer battery GREEN at 390×844 · the Tailwind
v4 state clean · sitemap 11 routes + robots + manifest standing · census
MATCH) — **zero live defects**, the register-RETIREMENT round.

**The migration census first** (the official recharts 3.0 guide walked
against our nine chart-type JSX sites — `charts.tsx`'s seven families +
the Sparkline's area/line arms): the min-version rows all satisfied
(React 19.3 · TS 5.x · ES2017 target), the removed-props register clean
(we never touched `activeIndex`/`blendStroke`/`animateNewValues`), and
exactly ONE DOM-visible default flip for our usage —
**`accessibilityLayer` ships false in 2.x, TRUE in 3.0+** (the recharts
wiki's own words). The parity cure: the explicit `false` at all nine
sites, preserving the reference's 2.x wrapper DOM (the a11y two-gate's
sanctioned register was calibrated on the 2.x genus).

**The migration**: `bun add recharts@^3.10.1` (the sibling zb's proven
3.10 line, the registry's latest stable — the package manager owns the
manifest + the lockfile); the nine parity props; the type seam closed at
the boundary — recharts 3's `Formatter<ValueType, NameType>` types the
tooltip value param as the honest union, so the family's formatters stay
`(v: number) => string` (every dataKey is a numeric aggregate — `Number()`
is the identity on them) behind a `tooltipFormatter` adapter, and the Pie
`label` callback's param is bridged with a documented double-cast against
the closed `PieLabelRenderProps` view (recharts' own `PieSectorDataItem`
note: "we spread the data object into the sector data item, so we can't
really know what is going to be inside" — our open-record param models
the runtime truth). The L-138c1 tickProp guard RETAINED as the harmless
belt-and-suspenders form (the defaultProps machinery the hazard lived in
is gone in the state rewrite).

**The live 3.x faces decoded** (each root-caused against the rendered
DOM, never guessed): the tick-label TEXTS moved out of the axis wrappers
into per-axis z-index layers (`recharts-yAxis-tick-labels`) — the e2e
funnel selector re-anchored; recharts 3.x **elides the zero-value bar
rectangles** (2.15 rendered five degenerate zero-height wrappers at the
wiped dashboard — visually identical, zero-height was never a visible
pixel; the e2e reset re-anchor pins the aliveness face: the wrapper +
the y-domain ticks + the stage labels, never a blank panel — the s10
contract holds); the x-tick elision at narrow cards is width-borne (the
same genus the leads pipeline documents at 331px). **THE UPGRADE-PROOF**:
the e2e grid sentinel — the L-138c2 "future recharts upgrade that
re-breaks the tick delivery REDs here" guard — passed live on 3.10.1
(the 9-line classic grid).

**The census decoder extension + the collector exclusion**: the interior
census's first post-migration run surfaced the tick-machinery faces as
unexplained — the signature-matched **`recharts3-restructure` genus**
(both sides g-elements carrying recharts classes with one side carrying
a 3.x structural token, or the collapsed same-class tick; the r3Boxes
containment cascade for the zIndex-wrapped descendants — the s95
poke-cascade precedent; the negatives pinned: a DIV pair never rides it,
a same-class non-degenerate tick with a real drift stays RED) + the
**chart-interior collector exclusion** (the walk42 glyph doctrine
extended to the chart svg): the tablet-dashboard decode found the
version-borne interiors sustaining FALSE resync offsets — the ref
pointer stalled inside the Pipeline chart's 2.x interiors while ours
advanced, the card-level tail re-pairing across cards at a phantom
+581px — while a direct probe proved both apps **byte-equal at every
card position**. The recharts svg BOX stays censused (the chart's layout
face, with the wrapper divs); the interior never enters the alignment —
the chart visual + DOM parity rides the pixel sweeps + the e2e chart
pins.

**The proofs**: MUTATION-A (the planted version regression `^3.10.1` →
`^2.15.4` → exactly 1 RED, the version floor) · MUTATION-B (the parity
prop removed from the TrendLine family → exactly 1 RED, the 9-site
census) · THE STASH-PROOF (the round's five source files stashed alone →
exactly 6 RED — the round's pins; restored → 2733 GREEN).

**The drift-gate ledger** — the six gates re-run in full at the migrated
tree: the desktop + phone + tablet + landscape sweeps **CLEAN** (margin
0.5pct over the standing baselines — dashboard 0.07%, reports 0.21%),
the fullpage **CLEAN** (docH byte-equal 4990/7259 at both axes), the
interior census **CLEAN at all four axes** (52 page-axis runs, zero
unexplained). **The migration is render-identical — the s373 close's
predicted baseline re-derivation was NOT needed; the standing baselines
hold.**

**The count ladder**: 2726 → **2733** (+7: the charts-internals s176
battery [+4 — the version floor · the lockfile resolution · the
accessibilityLayer 9-site parity census · the e2e grid-sentinel existence
freeze] + the census-tool s176 genus pins [+3 — the attribution with
negatives · the collector exclusion · the decoder exact-token source
pin]) · SUITES 138 **HELD** · E2E 192 **HELD** · badge 2918 → **2925**
(count-ladder-176.py: 23 flips, assert-first, idempotent — the re-run a
verified 0-flip no-op). The collateral re-anchors: the PAD stack-table
recharts row (2.15.4 → 3.10.1) · the facts-census installed-stack row ·
the session-140 funnel pin + the reports-filter spark pin (the
opening-tag forms gaining the parity prop).

**The deferral register** (resolved with rationale in the plan §0.3):
`accessibilityLayer` ON rejected (the DOM-parity doctrine — the enable
path stays an owner-level decision, documented in ADR-021) · the
`Cell` → `shape` refactor deferred to the 4.0 gate (works unmodified in
3.10.1) · the version choice `^3.10.1` (the registry's latest stable =
the sibling's proven line; the canary stream excluded).

**THE VERIFICATION**: lint 0/0 · tsc 0 (full strictness under the 3.x
types) · **138/2733** unit · build (the type-gate artifact) · smoke
**14/14** · e2e **192/192** · db census MATCH (15/24/10/23/12 + 4 users)
· probe:ref STABLE · the six drift gates CLEAN · the drawer battery
GREEN.

### Session-177 — THE DRAWER INTERIOR RE-WALK (walk50) (2026-10-24)

The post-176 audit round, its rotation trigger THE OWNER'S NEWEST COMMIT
`59c8f13` — the session-376 transcript, whose close names it first ("the
strongest next moves are the drawer interior re-walk, the fresh-bundle
re-derivation when the reference next ships a new bundle, or the
recharts 4.0 Cell → shape gate"). The adjudication: probe:ref STABLE
(`46bc2d9c`, unchanged since s168) kills the fresh-bundle candidate; 4.0
unreleased (3.10.1 the registry's latest stable) kills the gate
candidate. The walk is the round — the six-consecutive-closes candidate
(s171–s176) no round ever ran as its own rotation. The workspace
re-cloned fresh at `59c8f13` (the intake: bun install · a fresh AUTH_SECRET ·
`env -u DATABASE_URL` on every DB command · db:push/seed · census MATCH ·
playwright chromium); the baseline gate GREEN at the exact s176 ship
state: lint 0/0 · tsc 0 · **138/2733** · build · smoke **14/14** · e2e
**192/192** (5.7m) · probe:ref STABLE · the desktop + phone sweeps CLEAN
· the mobile drawer battery GREEN at 390×844 · census MATCH — **zero
live defects, the register clean of named code-level candidates.**

**The walk** (`scripts/walk50-drawer-interior.ts` — the two-app
element-ledger of the drawer-OPEN DOM, the coverage gap no standing leg
carries: the interior census runs zero drawer-open pages, the battery
pins behavior, the a11y gate violations, the captures visuals): OURS 61
rows vs REF 53, every delta root-caused against both DOMs —
**ONE LIVE DEFECT**: the drawer header's space-y-2 riding the v4
margin-BOTTOM semantics — the h2's `:where()` mb-2 PARTICIPATES in the
flex-column layout (header 88px) where the reference's v3-era
mt-on-the-sr-only-`<p>` never did (absolute = out of flow, header 80px)
— an **8px spine shift cascading to every nav link and the footer
group** (nav y 88 vs 80 · footer 436 vs 428 · every icon/rect +8),
present since the s147 re-derivation and never caught because no leg
ever walked the open drawer's interior. **The cure**: the M-92c1
phantom-mb precedent — the explicit `mb-0` on `MOBILE_NAV_SHEET.title`
((0,1,0) beats `:where()`'s (0,0,0)); the header's space-y-2 class
string stays byte-parity with the reference's while the COMPUTED rhythm
goes byte-equal (24+32+24 = 80px).

**The adjudicated genera** (each live-decoded, zero visual): the
`bg-sidebar` token vs the reference's `bg-[#2563eb]` literal —
computed-equal rgb(37,99,235), the house token idiom · the Close
button's shadcn stock-version class drift (`bg-accent` +
`text-muted-foreground` vs `bg-secondary`; `ring-offset-background`
absent) — BOTH dead variants (Radix Close carries no data-state; the
computed bg is transparent on both apps, live-probed) · lucide's
`aria-hidden` — version genus · the React 19 `useId` format —
structural genus, the pointing relations identical · OUR kept supersets
re-verified invisible: the focus-visible ring, `aria-current`, the nav
`aria-label`s, the `span.truncate` label wrapper (the row-count
difference's root cause: 61−53 = 8 spans), the icon `shrink-0`.

**The post-cure spine** (the walk re-run): header 80/80 · h2 32/32 ·
all 9 links byte-equal · footer 428/428 — and the two-app drawer-open
captures **0.02% apart** (the font-rendering floor; the reference's
Base44 badge closed). **The TDD ledger**: 1 RED face at birth (the
title mb-0 pin) + 1 born-green (the walk50 decode freeze — the s173
P-p/P-q precedent); **MUTATION-PROOF**: the planted mb-0 regression →
exactly 1 RED → restored → GREEN; **STASH-PROOF**: the round's five
lockstep files stashed → exactly 138/2733 → restored → 138/2735.

**The count ladder**: 2733 → **2735** (+2, both pins in the existing
page-layout suite — the ADR-017 one-suite doctrine) · SUITES 138 HELD ·
E2E 192 HELD (the cure is a class-string fix with zero behavioral face;
the battery re-run GREEN at the walked tree) · badge 2925 → **2927**
(count-ladder-177.py: 23 flips, assert-first, idempotent — the re-run a
verified 0-flip no-op). The collateral re-anchors: the PAD §11
page-layout row 1687 → 1695 · the SKILL §5.6 census 1687/210 → 1695/212
· the docs-counts lockstep (the census policing the census).

**The captures**: 443 RE-ANCHORED (the post-cure drawer-open standing
contract, VLM-verified) + 445-448 (the drawer-open post-cure face · the
reference's own drawer-open parity face · the header wordmark detail ·
the leads-active drawer).

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2735** unit · build (the
type-gate artifact) · smoke **14/14** · e2e **192/192** · db census
MATCH · probe:ref STABLE · the drift gates CLEAN · the drawer battery
GREEN.

### Session-178 — THE TOPBAR SEARCH FOCUS + SETTINGS SEGMENTED-ACTIVE WALK (walk51) (2026-10-24)

The post-177 audit round, its rotation trigger the s177 close
(session_377.md): "The next-rotation candidates: the remaining unwalked
OPEN interiors (… the oldest unwalked OPEN interior is now the topbar
search focus state + the settings segmented tabs' active state, each
adjudicated per ADR-022)". The adjudication: probe:ref STABLE
(`46bc2d9c`, unchanged since s168) kills the fresh-bundle candidate; 4.0
unreleased kills the recharts gate — the two named interiors ARE the
round. The workspace re-cloned fresh at `29b7954` (the intake: bun
install · a fresh AUTH_SECRET · `env -u DATABASE_URL` on every DB command
· db:push/seed · census MATCH · the environmental playwright
chromium-1248 install — a fresh-sandbox intake step, not a code defect);
the baseline gate GREEN at the exact s177 ship state: lint 0/0 · tsc 0 ·
**138/2735** · build · smoke **14/14** · e2e **192/192** (5.4m) ·
probe:ref STABLE · the desktop + phone sweeps CLEAN (dashboard 0.01% ·
reports 0.20% — within the standing floors) · the mobile drawer battery
GREEN at 390×844 · census MATCH — **zero live defects.**

**The walk** (`scripts/walk51-search-focus-segmented-active.ts` — one
tool, two phases, the coverage gaps no standing leg carries: the pixel
sweep sees the topbar's RESTING face only (focus-visible fires under
REAL keyboard focus, which no sweep drives), the e2e topbar-search
battery pins the fetch/abort/envelope BEHAVIOR, the s125/s129 cures are
source-pinned but the ACTIVE-state element ledger was never walked in
the ADR-022 form): **Phase A** — the search focus state, both apps at
1440×900, REAL keyboard Tab focus (9 tabs on both apps, the same
`placeholder="Search Anything..."` locator, `transition-colors` waited
out): the resting + focused computed census (box-shadow · border · bg ·
caret · the outline triplet · placeholder · the icon). **Phase B** — the
settings segmented active state, both apps at 1440×900 AND 390×844, the
default-active AND the click-activated second tab: the track + all three
triggers' tag/class/aria/geometry + the active pill's computed
bg/shadow/ink/weight.

**The decode: ZERO LIVE DEFECTS** — every delta a documented genus or a
kept superset, every VISIBLE face byte-equal: the resting `shadow-sm`
re-pin · the focused 1px near-black ring `rgb(10,10,10) 0px 0px 0px
1px` over the same shadow · the active white pill `rgb(255,255,255)` +
the bare-shadow pair + ink `rgb(10,10,10)` + weight 500 at BOTH
viewports (371px desktop / 117px phone columns, byte-equal geometry) ·
the tablist's computed bg/color byte-equal (the house token idiom
`bg-line-soft`/`text-muted-ink` computing exactly the reference's
`bg-muted`/`text-muted-foreground`). **The new documented genus** — v4's
`outline-none` is `outline-style: none` where the reference's v3-era
`outline-none` is `2px solid transparent`: OURS paints nothing (style
none), the REFERENCE paints nothing visible (transparent) — zero pixels
on both, the shadow/blur/space-y rename family's FOURTH member (the
focused computed triplet 1px/none vs 2px/solid is the genus's own
fingerprint). **The box-shadow slot-count genus**: v4 composes 5 slots
(inset-shadow · inset-ring · ring-offset · ring · shadow) where the
v3-era composes 3 — the extra OURS slots fully transparent, the
reference's zero-extent white slot `rgb(255,255,255) 0px 0px 0px 0px`
clipped inside the border box — the VISIBLE layers byte-equal in every
state (resting · focused · active). **Our kept supersets re-verified
live**: the search input's `aria-label="Search accounts, contacts and
leads"` (the reference's field carries NONE) · the roving tabindex
(OURS `[0,-1,-1]` at default where the reference's is `[-1,-1,-1]` — the
s23 accessible fix over its keyboard-unreachable platform defect) · the
s125 `bg-white` literal + the s129 retired `ring-offset-background`
(the reference's own stock class still carries it — its ride computes
`#ffffff`; ours stays retired). **The standing-gate adjudication (the
plan's §0.3)**: the maiden pass surfaced ZERO unexplained deltas — the
two interiors join the documented one-time decode register, the standing
legs (sweeps + e2e + source pins) are adjudicated sufficient, no census
extension built (the walk tool itself is the standing script, the walk50
pairing form).

**The TDD ledger**: all 5 pins born-green over the zero-defect decode —
the s173 P-p/P-q contract-freeze precedent (the search focus contract —
the 1px keyboard-only ring + no ring-offset · the search aria-label
superset · the segmented active contract — the s125 literal + the s129
retirement re-verified · the roving tabindex · the walk51 standing-script
existence freeze); **MUTATION-PROOFS**: three planted regressions (the
focus-ring `ring-1`→`ring-2` · the `ring-offset-background` replant ·
the `tabIndex={isActive ? 0 : -1}` flip) → **exactly 1 RED each** →
restored → GREEN; **STASH-PROOF**: the round's test file stashed alone →
exactly **138/2735** (the s177 ship state) → restored → **138/2740**.

**The count ladder**: 2735 → **2740** (+5, all five pins in the existing
page-layout suite — the ADR-017 one-suite doctrine) · SUITES 138 HELD ·
E2E 192 HELD (the round is test-only — NO product code touched; the
standing legs re-verified at the audit leg carry the parity verdict) ·
badge 2927 → **2932** (count-ladder-178.py: 23 flips, assert-first,
idempotent — the re-run a verified 0-flip no-op). The collateral
re-anchors: the SKILL §5.6 census 212 → 217 checks (the module stays
1695 — untouched) · the docs-counts lockstep + the F-106a1 layer-axis pin
(the census policing the census).

**The captures**: 449-452 (the two apps' FOCUSED search inputs
side-by-side at desktop — the parity anchor · the segmented ACTIVE state
at desktop · the segmented ACTIVE state at phone · the click-activated
transition face).

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2740** unit · build (the
type-gate artifact) · smoke **14/14** · e2e **192/192** · db census
MATCH · probe:ref STABLE · the desktop + phone sweeps CLEAN · the drawer
battery GREEN · the walk51 visible faces byte-equal.

### Session-179 — THE REPORTS PILL-TAB FOCUS-STATE INTERIOR RE-WALK (walk52) (2026-10-24)

The post-178 audit rotation, its rotation trigger THE OWNER'S NEWEST
COMMITS `eebf8dc` (the merge of the external session-178 walk51 ship —
the topbar search focus + settings segmented-active walk — into main).
A local twin of the s178 round had raced the external ship on this
workspace (the same walk51 subject from the session-378 close, the same
2735→2740 ladder, the same decode conclusions); the twin YIELDED to the
shipped remote per the house single-layer doctrine (git reset to
`eebf8dc`; the local commit discarded — merging the two would have
doubled every s178 documentation layer), and this round re-based onto
the shipped state as **session-179**. The s379 close's first-named
candidate: "the remaining unwalked focus faces (the s129 close's own
never-censused list — the pill-tab focus states on the reports family)";
probe:ref STABLE (`46bc2d9c`) kills the fresh-bundle candidate, the
registry's `latest` 3.10.1 kills the recharts 4.0 gate. The baseline
gate GREEN at the exact s178 ship state: lint 0/0 · tsc 0 ·
**138/2740** · census MATCH — zero live defects.

**The walk** (`scripts/walk52-pill-focus-active.ts` — the two-app
computed ledger of the PILL family's focus + active faces at BOTH axes
(1440×900 + 390×844): the REAL keyboard Tab drive (Tab from a known
origin until a tab trigger holds focus — focus-visible fires only under
real keyboard focus, which no sweep drives) + the effective-layer
box-shadow alignment (the zero-width v4 variable-chain layers never
enter it) + the REAL tab switch): **ZERO LIVE DEFECTS** — the FOCUSED
pill trigger's ring byte-equal on BOTH axes (`rgb(255,255,255) 0 0 0
2px` [the ring-offset-2 halo] + `rgb(10,10,10) 0 0 0 4px` [the ring-2]
+ the active bare-shadow pair — the ring-2+offset-2 focus-visible form
computes IDENTICALLY on both apps) · the pill interior geometry
byte-equal at zero-data (x=293/515/737/959/1181 · w=222 · h=28 — the
five columns pixel-exact) · the switched active face byte-equal +
the post-interaction roving tabindex=0 on BOTH apps (the walk51 decode
re-confirmed on the pill family). The genera: F-129c1's
ring-offset-background retirement · the token-selection genus · the
class-order genus · the outline VERSION FORM (the s178-documented genus
re-met: ours v4 `none` vs the reference's v3-era `2px solid
transparent`, both zero-visual) · the **DATA-STATE genus** (the
seeded-vs-zero 32px page offset above the reports tab bar — the pill
interior itself byte-equal at zero-data, verified live via
`scripts/zero-data.ts`; the sweep's own pairing doctrine).

**The TDD ledger**: 4 born-green pins — the contract-freeze family (the
s173 P-p/P-q precedent): the walk52 decode freeze (the tool's own
contract) · the TABS_PILL.trigger FULL-string freeze (the ring-2 +
offset-2 form's class carrier) · the TABS_PILL.track FULL-string freeze
(the responsive grid-cols-2/lg:grid-cols-5 form) · the data-state genus
pin (the zero-data pairing discipline). **MUTATION-PROOF**: the planted
ring-2→ring-1 regression → exactly 1 RED → restored → GREEN.
**STASH-PROOF**: the round's test file stashed → exactly **138/2740**
(the s178 ship state) → restored → **138/2744**.

**The count ladder**: 2740 → **2744** (+4, all in the existing
page-layout suite — the ADR-017 one-suite doctrine) · SUITES 138 HELD ·
E2E 192 HELD · badge 2932 → **2936** (count-ladder-179.py: 23 flips,
assert-first, idempotent — the re-run a verified 0-flip no-op). The
collateral re-anchors: the SKILL §5.6 census checks 217 → 221 (the
module line count 1695 HELD — page-layout.ts untouched this round) ·
the F-106a1 layer-axis pin (the s179 layer live, the s178 layer demoted
beneath it at 2740/192).

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2744** unit · build (the
type-gate artifact) · smoke **14/14** · e2e **192/192** · db census
MATCH · probe:ref STABLE · the walk52 focus ring byte-equal on both
axes.

### Session-180 — THE DROPDOWN/SELECT OPEN-STATE INTERIOR WALK (walk53) (2026-10-24)

The post-179 audit rotation, its rotation trigger THE OWNER'S NEWEST
COMMITS (`6ff2ba7`/`3b21544` — the session_381 transcript [the s179
round's own execution record] + the prompt-to-review-3 doc). The s380
close's first-named candidate: "the remaining unwalked focus/OPEN
faces — the dropdown/select OPEN states beyond the s133/s136 lenses
(the s379 close's own second arm) · the account-menu OPEN re-walk
under ADR-022". probe:ref STABLE (`46bc2d9c`) kills the
fresh-bundle candidate; the registry's `latest` 3.10.1 (verified live
against registry.npmjs.org) kills the recharts 4.0 gate. The baseline
gate GREEN at the exact s179 ship state on a FRESH CLONE: lint 0/0 ·
tsc 0 · **138/2744** · build (the type-gate artifact) · smoke **14/14**
· e2e **192/192** (one first-run flake in the S72-P2/M-72c1
settings-debounce test — the documented F-119a1 epoch-gate lineage —
passed in isolation AND on the full re-run: a machine-load
observation, never a live defect) · probe:ref STABLE · the mobile
drawer battery GREEN at 390×844 · the desktop + phone drift sweeps
CLEAN (settings 2.65%/3.63% the documented volatile picklist-data
genus — live-edited intraday on the reference, the walk40 ref-vs-ref
doctrine; login 0.28%/0.78% the documented logo genus) · db census
MATCH · sitemap 11 routes + robots + manifest 200.

**The walk** (`scripts/walk53-dropdown-open-interior.ts` — the walk50
ledger form, the OPEN-interior doctrine: the two-app element ledger of
the OPEN states at BOTH axes [1440×900 + 390×844]: Phase A the
account-menu [the topbar `button[aria-haspopup="menu"]` → the
`[role="menu"]` content → the Profile/Logout menuitems], Phase B the
settings Defaults "Default Calendar View" select [the first combobox
→ the `[role="listbox"]` → the Month/Week options, the M-72c3-decoded
vocabulary]; the REAL keyboard ArrowDown drive — data-highlighted
fires only under real keyboard focus, which no sweep drives — + the
mount-focus census + the computed faces of the trigger/content/items
RESTING and KEYBOARD-HIGHLIGHTED): **ZERO LIVE DEFECTS** — the menu
spine byte-equal on both axes (3 rows, the same DFS structure, ZERO
box deltas, mount-focus DIV/menu on both apps, ArrowDown → Profile on
both); the listbox spine byte-equal (the Month/Week vocabulary,
data-state checked/unchecked identical, mount-focus DIV/option on
both — Radix focuses the SELECTED option — ArrowDown → Week on both);
the VISIBLE faces byte-equal on every OPEN face (the trigger's
shadow-sm + the content's shadow-md layers + bg/color/border/radius).
The genera: the outline VERSION FORM (the s178 genus re-met on the
OPEN faces + the NEW alpha-color carrier sub-form: OURS `3px none
rgb(10,10,10)` vs the reference's `3px none rgba(10,10,10,0.5)` on
the triggers — style none paints ZERO pixels on both) · the box-shadow
SLOT-COUNT genus (v4's 5 transparent zero-extent slots vs the
v3-era's 3) · the token-selection genus (MENU_CONTENT's
border-line/bg-surface/text-foreground vs the reference's bare
border/bg-popover/text-popover-foreground + the items'
focus:bg-line-soft/focus:text-neutral-900 vs
focus:bg-accent/focus:text-accent-foreground — computed-equal in BOTH
the resting and the REAL-keyboard-highlighted states, the
M-81c2-decoded #f5f5f5 wash + the #171717 ink shift) · the React useId
format genus (`radix-_R_*` vs `radix-:r*:`) · lucide's aria-hidden
version genus (the option's check svg). **THE WALK'S OWN DISCOVERY**
(the harness lesson): Playwright's `getByRole("combobox")` engine
STOPS matching the trigger once `aria-expanded` flips true at open
(count 0 while the raw `[role="combobox"]` attribute stays live) —
the attribute selector is the only form matching BOTH states; pinned
inside the decode freeze.

**The TDD ledger**: 5 born-green pins — the contract-freeze family
(the s173 P-p/P-q precedent): the walk53 decode freeze (the tool's own
contract) · the MENU_CONTENT FULL-string freeze · the MENU_ITEM
FULL-string freeze (the s179 FULL-string precedent upgrading the
s13/s63/s113/s128 fragment pins) · the select.tsx content full-string
freeze (the M-81c1-decoded z-50/max-h-96 family's inline carrier) ·
the select.tsx item full-string freeze (the M-81c2-decoded rounded-sm
+ wash pair). **MUTATION-PROOF**: the planted MENU_ITEM
disabled-arm order regression → **exactly 1 RED** (the full-string
pin's unique teeth over the fragment pins — the shadow-md and
class-order mutations that trip the older fragment pins were tried
first, both REDing the old pins too; the disabled-arm swap isolates
the new pin) → restored → GREEN. **STASH-PROOF**: the round's test
file stashed → exactly **138/2744** (the s179 ship state) → restored
→ **138/2749** pre-find (see the live find below).

**The count ladder**: 2744 → **2750** (+6: 5 the walk53 pins in the
existing page-layout suite — the ADR-017 one-suite doctrine — + 1 the
RED-first inventory-uniqueness pin in docs-counts, see below) ·
SUITES 138 HELD · E2E 192 HELD (the round is test-only — NO product
code touched) · badge 2936 → **2942** (count-ladder-180.py: 23 flips,
assert-first, idempotent, the two-pass full-ladder form). The
collateral re-anchors: the SKILL §5.6 census checks 221 → 226 (the
module line count 1695 HELD — page-layout.ts untouched) · the F-106a1
layer-axis pin (the s180 layer live, the s179 layer demoted beneath it
at 2744/192).

**The 180-a live find + cure**: the external s179 ship had TRIPLED its
PAD §7.1 inventory row (three near-identical walk52 rows — a
single-layer-doctrine violation that shipped through the gate because
no pin held the table's row multiplicity; the docs-counts suite pinned
the TOTAL row, never the per-row uniqueness). TDD cure: the new
inventory-row uniqueness pin went RED over the live triplication
first, the two duplicate rows were then removed (the first/most-
complete row kept), and the pin went GREEN — a future round that
doubles its row now fails `bun run test`. The verification line below
carries the post-cure count (138/2750).

**The operator's round-shaped asks, all verified standing** (the
session record's own ledger): the `.env` DATABASE_URL
`file:../db/custom.db` with the `db/` folder at the repo root (census
MATCH at `<repo>/db/custom.db` — the ambient DATABASE_URL shadow
scrubbed with `env -u` on every DB-touching command, the F-123a1
doctrine) · the vitest + playwright config files verified standing
(138/2750 unit + 192/192 e2e this session — no config churn: the
configs are already the family-correct form, and changes without a
failing gate would be speculative) · the sitemap + SEO surface
re-verified (the 11-route sitemap.xml + robots.txt with the Sitemap
line + the installable manifest.json — smoke check 12 carries the
200s; the per-route OG/Twitter/canonical factory rides the
pageMetadata() seam) · the mobile-nav comparison re-verified (the
drawer battery GREEN + probe:ref TRUE-390 STANDING — the reference's
own menu button present, ours the Radix Sheet superset with the
S8-P1 auto-close + the main-scroller lock + the route-change close)
· the Tailwind v4 state clean (no new v4 hazard surfaced; the walk's
every delta decoded against the standing genus register) · the
`.env.example` verified against the six-knob contract and included in
this round's commit.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2750** unit · build (the
type-gate artifact) · smoke **14/14** · e2e **192/192** · db census
MATCH · probe:ref STABLE · the walk53 OPEN spines byte-equal on both
axes.

### Session-181 — THE DIALOG-SURFACE FOCUS-STATE INTERIOR WALK (walk54) (2026-10-24)

The post-180 audit rotation, its rotation trigger THE OWNER'S NEWEST
COMMITS (`b8e740d`/`c4a5c4e` — the session_383 transcript [the s180
round's own execution record] + the merge `144f2dd`). The s380 close's
remaining named candidate: "the dialog-surface focus faces" (the s379
close's own third arm — walk53 consumed the dropdown/select OPEN arm,
walk54 takes the dialog family's focus interior). probe:ref STABLE
(`46bc2d9c`) kills the fresh-bundle candidate; the registry's `latest`
3.10.1 (verified live against registry.npmjs.org) kills the recharts
4.0 gate. The baseline gate GREEN at the exact s180 ship state on a
FRESH CLONE: lint 0/0 · tsc 0 · **138/2750** · build (the type-gate
artifact) · smoke **14/14** · e2e **192/192** (clean first run) ·
probe:ref STABLE · the mobile drawer battery GREEN at 390×844 (all
stages: trigger · OPEN focus-trap + dual scroll lock · NAV-CLOSE ·
ESC-CLOSE · REOPEN-BEFORE-GROW · RESIZE-PAST-MD release) · the desktop
+ phone drift sweeps CLEAN · db census MATCH · sitemap 11 routes +
robots + manifest 200.

**The walk** (`scripts/walk54-dialog-focus-interior.ts` — the walk50
ledger form over the New Lead dialog's OPEN + FOCUS states at BOTH
axes [1440×900 + 390×844]: Phase A the OPEN spine — the 51-row DFS
ledger of `[role="dialog"][data-state="open"]` (the D-112a4 rule) +
the computed faces of the overlay/content/title/close-X/inputs/footer
RESTING; Phase B the REAL keyboard Tab drive — 10 stops from the
mount-focused first input through the whole focusable chain (5 inputs
· Status · Source · Cancel · Create Lead · the close X) with each
stop's FOCUSED face censused, then the wrap past the last focusable
[the Radix focus-trap cycle]): **ZERO LIVE DEFECTS** — the 51-row
spine byte-equal on both axes (identical tag census: 12 div · 8
option · 7 label · 5 input · 5 button · 4 path · 3 span · 3 svg · 2
select · 1 h2 · 1 form; ZERO box deltas); the Tab chain
position-identical on every stop (ld-email → phone → company → value
→ Status(New) → Source(Email) → Cancel → Create Lead → Close → WRAP
to ld-name on both apps); the mount-focus on the first input with
`:focus-visible` TRUE on both (Radix's programmatic mount focus
paints the ring); every VISIBLE focus face byte-equal — the inputs'/
triggers'/Cancel's ring `rgb(10,10,10) 0px 0px 0px 1px` + the
shadow-sm layer, the submit's ring + its shadow pair, and the close
X's DOUBLE ring `rgb(255,255,255) 0px 0px 0px 2px` +
`rgb(10,10,10) 0px 0px 0px 4px` (the ring-2 + ring-offset-2 form) —
on BOTH axes. The genera: the outline VERSION FORM (s178, re-met on
every dialog face + the alpha-color carrier sub-form) · the box-shadow
SLOT-COUNT genus (3-vs-1 on the input ring, 4-vs-2 on the content,
2-vs-0 on the close-X double ring — every VISIBLE layer byte-equal) ·
the v4 color-serialization genus (the overlay's bg-black/80 computing
`oklab(0 0 0 / 0.8)` vs `rgba(0,0,0,0.8)` — the SAME visual color,
the s28 canvas-readback precedent) · the token-selection genus
(computed-equal on every face) · the class-order genus · the space-y
margin-BOTTOM family (our `mt-2 mb-0` explicit margins vs the
v3-era's implicit — computed geometry byte-equal) · the s133
placeholderState retirement (the reference's trigger still carries
`data-[placeholder]:text-muted-foreground`) · the F-129c1
ring-offset-background retirement (the reference's close X still
carries it — its ride computes #fff on both) · the id-name superset
(our `ld-` prefixes) · our aria-label supersets (the Status/Source
triggers) · the React useId format genus · lucide's aria-hidden
version genus. **THE WALK'S OWN DISCOVERY (the NEW genus)**: the
DANGLING `aria-describedby` — the reference's OPEN dialog declares
`aria-describedby="radix-:r8:"` pointing at a NON-EXISTENT node (its
own platform's dead pointer, live-probed: "NO SUCH ELEMENT"); OURS
carries no attribute at all (the clean form — the s15-P4
no-description doctrine; a dangling ARIA reference is the reference's
own defect, NOT mirrored per the s23 platform-defect precedent).

**The TDD ledger**: 4 born-green pins — the contract-freeze family
(the s173 P-p/P-q precedent): the walk54 decode freeze (the tool's
own contract, incl. the D-112a4 root rule and the overlay-selector
finding — the portal mounts overlay + content as BODY-level
siblings, `[data-radix-dialog-overlay]` matches nothing on either
app) · the DIALOG_CONTENT.base FULL-string freeze (over the s15
fragment pins) · the DIALOG_CLOSE FULL-string freeze (the focused
DOUBLE-ring carrier, over the s15/s112 fragment pins) · the
DIALOG_OVERLAY FULL-string freeze (the oklab/rgba serialization
genus's class carrier). **MUTATION-PROOF**: the planted
`focus:ring-offset-2` → `focus:ring-offset-4` regression → **exactly
1 RED** (the full-string pin's unique teeth — the offset arm no
fragment pin holds) → restored → GREEN. **STASH-PROOF**: the round's
test file stashed → exactly **138/2750** (the s180 ship state) →
restored → **138/2754**.

**The count ladder**: 2750 → **2754** (+4, all in the existing
page-layout suite — the ADR-017 one-suite doctrine) · SUITES 138
HELD · E2E 192 HELD (the round is test-only — NO product code
touched) · badge 2942 → **2946** (count-ladder-181.py: 23 flips,
assert-first, idempotent). The collateral re-anchors: the SKILL §5.6
census checks 226 → 230 (the module line count 1695 HELD —
page-layout.ts untouched) · the F-106a1 layer-axis pin (the s181
layer live, the s180 layer demoted beneath it at 2750/192).

**The operator's round-shaped asks, all verified standing** (the
session record's own ledger): the `.env` DATABASE_URL
`file:../db/custom.db` with the `db/` folder at the repo root (census
MATCH at `<repo>/db/custom.db` — the ambient `DATABASE_URL` shadow
scrubbed with `env -u` on every DB-touching command, the F-123a1
doctrine) · the vitest + playwright config files verified standing
(138/2754 unit + 192/192 e2e this session — no config churn) · the
sitemap + SEO surface re-verified (the 11-route sitemap.xml +
robots.txt with the Sitemap line + the installable manifest.json —
smoke check 12 carries the 200s) · the mobile-nav comparison
re-verified (the drawer battery GREEN + probe:ref TRUE-390 STANDING)
· the Tailwind v4 state clean (no new v4 hazard; the walk's every
delta decoded against the standing genus register) · the
`.env.example` verified against the six-knob contract and included in
this round's commit.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2754** unit · build (the
type-gate artifact) · smoke **14/14** · e2e **192/192** · db census
MATCH · probe:ref STABLE · the walk54 focus faces byte-equal on both
axes · the captures both pairs 0.00%.

### Session-182 — THE REPORTS-FILTER SELECTS OPEN-STATE INTERIOR WALK (walk55) (2026-10-24)

The post-181 audit rotation, its rotation trigger THE OWNER'S NEWEST
COMMIT (`e59fc03` — the session_385 transcript, the s181 round's own
execution record). The s384 close's first-named candidate: "the
reports filter selects' OPEN states beyond the walk53 settings arm"
— walk53's Phase B consumed the settings Defaults select; the
reports page's own four filter instances (period · owner · stage ·
status) were never walked. probe:ref STABLE (`46bc2d9c`) kills the
fresh-bundle candidate; the registry's `latest` 3.10.1 (verified live
against registry.npmjs.org) kills the recharts 4.0 gate. The baseline
gate GREEN at the exact s181 ship state on a FRESH CLONE: lint 0/0 ·
tsc 0 · **138/2754** · build (the type-gate artifact) · smoke **14/14**
· e2e **192/192** (clean first run) · probe:ref STABLE · the mobile
drawer battery GREEN at 390×844 (all stages) · the desktop + phone
drift sweeps CLEAN · db census MATCH · sitemap 11 routes + robots +
manifest 200.

**The walk** (`scripts/discover-182.ts` the discovery probe — the four
comboboxes at byte-equal geometry on both apps (`329/541/729/917,202
176x36` at 1440×900, the icon-wrap parents byte-equal); OURS carries
the four aria-label supersets (`Filter by period/owner/stage/status`
— the same accessible-name genus as the walk53 account-menu trigger),
the reference's triggers carry NONE; the mount-focus `DIV/option` on
every open; the period/stage/status option vocabularies byte-equal
(6/7/4 options); the OWNER select the data-borne arm. Then
`scripts/walk55-reports-selects-open.ts` — the walk53 ledger form over
the reports filter bar's FOUR selects' OPEN states at BOTH axes
(1440×900 + 390×844): the trigger RESTING + OPEN faces, the listbox
DFS ledger, the option faces RESTING + the checked option's
HIGHLIGHTED face, then the REAL keyboard ArrowDown drive (the
`data-highlighted` wash fires under REAL keyboard focus, which no
sweep drives)): **ZERO LIVE DEFECTS** — the period spine 24 rows
byte-equal on both axes (6 options, checked This Quarter both,
ArrowDown → YTD both); the stage spine 27 rows byte-equal (7 options,
ArrowDown → Prospecting both); the status spine 18 rows byte-equal
(4 options, ArrowDown → Open both); the owner arm the **DATA-STATE
genus** — OURS 18 rows (4 options: All Owners + the 3 DISTINCT
seeded opp owners) vs the reference's 9 (1 option: All Owners only,
its live zero-data state), the listbox height 138-vs-42 the
data-borne consequence, the ArrowDown landing Omar Haddad-vs-All
Owners the same; the chrome + the static All Owners option byte-equal
behind the standing genera. The genera: the outline VERSION FORM
re-met on every face + BOTH its sub-forms (the alpha-color carrier on
the triggers: OURS 3px none rgb(10,10,10) vs the reference's 3px
none rgba(10,10,10,0.5) — style none paints ZERO pixels on both · the
transparent-solid carrier on the options: OURS 1px none rgb(16,16,16)
vs the reference's 2px solid rgba(0,0,0,0) — the s178 fingerprint) ·
the box-shadow SLOT-COUNT genus (5-vs-3 on the trigger, 6-vs-4 on the
content — every VISIBLE layer byte-equal) · the token-selection genus
(the listbox's border-line/bg-surface/text-foreground vs the
reference's border/bg-popover/text-popover-foreground + the options'
focus:bg-line-soft focus:text-neutral-900 vs its focus:bg-accent
focus:text-accent-foreground — the M-81c2 pair, computed-equal on
every face) · the React useId format genus · lucide's aria-hidden
version genus (the Check svg) · the aria-label superset genus (our
four trigger labels) · the DATA-STATE genus (the owner arm). The
walk's own decode knowledge: the mount-focus lands ON the checked
option (the DIV/option census, activeElement = the highlighted
option); the checked option carries data-highlighted at open
(Radix's at-open highlight); the trigger's OPEN face byte-equal to its
own RESTING face on both apps (no visible focus ring paints on the
open trigger).

**The TDD ledger**: 3 born-green pins — the contract-freeze family
(the s173 P-p/P-q precedent), the pin survey first (MENU_CONTENT/
MENU_ITEM + the select.tsx content/item inline strings full-string
frozen at walk53 · SELECT_TRIGGER.base/focusRing at s9/s13 · the four
aria-labels at a11y-controls · the four placeholders + the w-44
call-sites at reports-filter-parity · REPORTS_FILTER_BAR per-field at
s7/s83): the walk55 decode freeze (the four-select OPEN ledger + the
REAL keyboard highlight drive + the owner DATA-STATE arm) · the
DISTINCT-opportunity-owners derivation freeze (the s31 contract, the
DATA-STATE arm's source carrier — the genuine gap the survey found) ·
the SELECT_ITEM indicator span + Check pair full-string freeze (the
genuine s180-battery gap — the content/item strings were frozen, the
indicator construction never). **MUTATION-PROOF**: the planted
h-3.5 w-3.5 → h-4 w-4 indicator regression → **exactly 1 RED** (the
new pin's unique teeth — no s180 fragment pin holds the indicator
construction) → restored → GREEN. **STASH-PROOF**: the round's test
block stashed → exactly **138/2754** (the s181 ship state) → restored
→ **138/2757**.

**The count ladder**: 2754 → **2757** (+3, all in the existing
page-layout suite — the ADR-017 one-suite doctrine) · SUITES 138
HELD · E2E 192 HELD (the round is test-only — NO product code
touched) · badge 2946 → **2949** (count-ladder-182.py: 30 flips,
assert-first, idempotent — the re-run a verified 0-flip no-op) + the
collateral re-anchors (the SKILL §5.6 census checks 230 → 233, the
module line count 1695 HELD — page-layout.ts untouched · the F-106a1
layer-axis pin — the s182 layer live, the s181 layer demoted beneath
it at 2754/192).

**The operator's round-shaped asks, all verified standing** (the
session record's own ledger): the `.env` DATABASE_URL
`file:../db/custom.db` with the `db/` folder at the repo root (census
MATCH at `<repo>/db/custom.db` — the ambient `DATABASE_URL` shadow
scrubbed with `env -u` on every DB-touching command, the F-123a1
doctrine) · the vitest + playwright config files verified standing
(138/2757 unit + 192/192 e2e this session — no config churn) · the
sitemap + SEO surface re-verified (the 11-route sitemap.xml +
robots.txt with its Sitemap line + the installable manifest.json —
smoke check 12 carries the 200s) · the mobile-nav comparison
re-verified (the drawer battery GREEN + probe:ref TRUE-390 STANDING)
· the Tailwind v4 state clean (no new v4 hazard; the walk's every
delta decoded against the standing genus register) · the
`.env.example` verified against the six-knob contract and included in
this round's commit.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2757** unit · build (the
type-gate artifact) · smoke **14/14** · e2e **192/192** · db census
MATCH · probe:ref STABLE · the walk55 select interiors byte-equal on
both axes · the captures: the period pair 0.00% (byte-identical, the
same md5), the owner pair the DATA-STATE face.

### Session-183 — THE LEADS-FILTER POPOVER + CONTACTS-FILTER-PANEL OPEN-STATE INTERIOR WALK (walk56) (2026-10-24)

The post-182 audit rotation, its rotation trigger THE OWNER'S NEWEST
COMMIT (`bf3acec` — the session_386 transcript, the s182 round's own
execution record). The s386 close's first-named candidate: "the
popover family's OPEN faces under ADR-022 — the leads filter popover
+ the contacts filter panel" — walk53 froze the DropdownMenu + Select
chrome carriers (MENU_CONTENT/MENU_ITEM + the select.tsx
content/item strings); the Popover family's own carriers never.
probe:ref STABLE (`46bc2d9c`) kills the fresh-bundle candidate; the
registry's `latest` 3.10.1 (verified live against registry.npmjs.org)
kills the recharts 4.0 gate. The baseline gate GREEN at the exact
s182 ship state on a FRESH CLONE: lint 0/0 · tsc 0 · **138/2757**
unit · build (the type-gate artifact) · smoke **14/14** · e2e
**192/192** (clean first run, 5.6m) · the mobile drawer battery GREEN
at 390×844 (all stages) · the desktop + phone drift sweeps CLEAN · db
census MATCH (15/24/10/23/12 + 4 users at `<repo>/db/custom.db`) ·
sitemap 11 routes + robots + manifest 200.

**The walk** (`scripts/discover-183.ts` the discovery probe — the
leads Filters trigger at byte-equal geometry on both apps
(`304,443 108x36` at 1440×900 · `32,1089 326x36` at 390×844); the
OPEN popover `div[role="dialog"]` at byte-equal boxes
(`304,483 320x398` at 1440 · the 390 collision FLIP-UP to
`data-side=top` at `32,36` on BOTH apps — the s113-decoded flip
re-confirmed); the mount-focus `BUTTON/combobox` (the first select
trigger) on both; the field labels byte-equal `[Status | Source | Min
Deal Value | Follow-up Date]`; OURS carrying the aria-label supersets
(`Open lead filters` · `Filter by status/source` · `Minimum deal
value` · `Follow-up date`), the reference's controls carrying NONE;
the 1st-Tab landing byte-equal (the Source select both); the contacts
Filters trigger + the OPEN panel + the Clear All geometry byte-equal
at BOTH axes (`764,351 108x36` + `1350,85 74x32` at 1440 ·
`234,789 108x36` + `300,80 74x32` at 390); the 20 checkbox ids
identical; OURS carrying the `aria-expanded` superset on the panel
trigger. Then `scripts/walk56-leads-popover-open.ts` — the walk53/55
ledger form over the family's TWO OPEN arms at BOTH axes (1440×900 +
390×844): the trigger RESTING + OPEN faces, the content DFS ledger,
the field faces, the REAL keyboard Tab drive, the panel census):

**THE D-183a1 LIVE FIND + CURE** — the contacts Filters trigger's
OPEN variant-flip: OURS rendered OUR blue default (`bg-primary`
rgb(37,99,235) — our `--color-primary` is deliberately the blue the
reference's CTAs use, per the s10-family re-pin) where the
reference's own default variant renders its **DARK stock primary**
(#171717, rgb(23,23,23) — its global `--primary` token; its blue CTAs
carry explicit classes). The CLOSED outline face was byte-equal; the
OPEN face was never walked before. THE CURE (pinned): the variant
ternary STAYS (the s75 mechanism pin) + the neutral literal pair
(`bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90` — the
s80-computed hover alpha) overrides the blue default via
tailwind-merge — the profile save-button precedent (S13-P2/M-80c1,
the reference's PAGE-LOCAL primary doctrine). **The re-walk PROVES
the OPEN face byte-equal on both axes** (the `panelTriggerOpen.bg`
delta GONE from the census).

Every remaining delta a documented genus: the outline VERSION FORM
re-met on every face + BOTH its sub-forms (the alpha-color carrier on
the triggers/labels/inputs: OURS `3px none rgb(10,10,10)` vs the
reference's `3px none rgba(10,10,10,0.5)` — style none paints ZERO
pixels on both · the transparent-solid carrier on the content + the
select triggers: OURS `3px none rgb(10,10,10)` vs the reference's
`2px solid rgba(0,0,0,0)` — the s178 fingerprint) · the box-shadow
SLOT-COUNT genus (5-vs-3 on the triggers/inputs/footer, 6-vs-4 on the
content — every VISIBLE layer byte-equal) · the token-selection
genus (the popover's `border-line bg-surface text-foreground` + the
call-site `rounded-md shadow-md w-80 p-4` vs the reference's `z-50
rounded-md border bg-popover p-4 text-popover-foreground shadow-md` —
the M-81c2 pair's Popover member, computed-equal on every face) · the
s133 placeholderState retirement (the reference's stock select
trigger still carries `data-[placeholder]:text-muted-foreground`) ·
the React useId format genus (radix-_r_* vs radix-:r*:) · lucide's
aria-hidden version genus (the X/Save svgs) · the class-order genus
(`h-4 w-4` vs `w-4 h-4`) · the aria-label superset genus (our trigger
+ field labels + the panel trigger's aria-expanded).

**The TDD ledger**: 3 pins — the walk56 decode freeze (born-green:
the tool's own contract — the two-arm OPEN ledger, the
`[role="dialog"][data-state="open"]` root rule over the portal, the
mount-focus census, the REAL Tab drive, BOTH axes) · the POPOVER
content chrome FULL-string freeze (born-green — the genuine
walk53-battery gap: the shared `Dropdown` wrapper's content class
string, every popover surface's only chrome carrier, never
full-frozen before) · the D-183a1 OPEN-face cure pin (**RED-first**
over the live find — exactly 1 RED at birth, the cure applied, GREEN).
**MUTATION-PROOF**: the planted `rounded-lg` → `rounded-xl`
content-chrome regression → **exactly 1 RED** (the new full-string
pin's unique teeth — no fragment pin holds the Popover content chrome
construction) → restored → GREEN. **STASH-PROOF**: the round's test
block stashed → exactly **138/2757** (the s182 ship state) → restored
→ **138/2760**.

**The count ladder**: 2757 → **2760** (+3, all in the existing
page-layout suite — the ADR-017 one-suite doctrine) · SUITES 138
HELD · E2E 192 HELD (the round's one product-code touch: the D-183a1
call-site pair in contacts-page.tsx; the final gate re-verifies) ·
badge 2949 → **2952** (count-ladder-183.py: 31 flips, assert-first,
idempotent — the re-run a verified 0-flip no-op) + the collateral
re-anchors (the SKILL §5.6 census checks 233 → 236, the module line
count 1695 HELD — page-layout.ts untouched · the F-106a1 layer-axis
pin — the s183 layer live, the s182 layer demoted beneath it at
2757/192 · the s182-introduced live-tense RED-first arithmetic site
re-anchored 249 → 252).

**The operator's round-shaped asks, all verified standing** (the
session record's own ledger): the `.env` DATABASE_URL
`file:../db/custom.db` with the `db/` folder at the repo root (census
MATCH at `<repo>/db/custom.db` — the ambient `DATABASE_URL` shadow
scrubbed with `env -u` on every DB-touching command, the F-123a1
doctrine) · the vitest + playwright config files verified standing
(138/2760 unit + 192/192 e2e this session — no config churn) · the
sitemap + SEO surface re-verified (the 11-route sitemap.xml +
robots.txt with its Sitemap line + the installable manifest.json —
smoke check 12 carries the 200s) · the mobile-nav comparison
re-verified (the drawer battery GREEN + probe:ref TRUE-390 STANDING)
· the Tailwind v4 state clean (no new v4 hazard; the walk's every
delta decoded against the standing genus register) · the
`.env.example` verified against the six-knob contract and included in
this round's commit.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2760** unit · build (the
type-gate artifact) · smoke **14/14** · e2e **192/192** · db census
MATCH · probe:ref STABLE · the walk56 popover + panel OPEN interiors
byte-equal on both axes (post-cure) · the captures: the round's
ours+ref OPEN faces.

### Session-184 — THE ACTIVITIES MORE-FILTERS TOGGLE + RAIL-ACTIONS OPEN-STATE INTERIOR WALK (walk57) (2026-10-25)

The post-183 audit rotation, its rotation trigger THE OWNER'S NEWEST
COMMIT (`f5792f7` — the session_388/389 transcripts, the s183 round's
own execution record). The s388 close's named OPEN/focus candidates,
adjudicated by the discovery probe (`scripts/discover-184.ts`): the
FIRST-named (the Edit-family dialogs' focus faces) **KILLED BY THE
DISCOVERY** — the reference's live data state carries ZERO rows on
/contacts, /leads, /accounts (the "No contacts found" empty-state rows
alone, zero row-menu triggers) and ZERO calendar chips, so the
W7/wce/Mke edit dialogs have no trigger there and the two-app ledger
has no REF arm (the candidate returns the day the reference carries
rows); the variant-flip-family candidate (the activities More-Filters
toggle's OPEN face — "the same variant-flip family the D-183a1 find
rode, the one other variant-flipping trigger in the app") LIVE AND
WALKED. probe:ref STABLE (`46bc2d9c`) kills the fresh-bundle
candidate; the registry's `latest` 3.10.1 (verified live against
registry.npmjs.org) kills the recharts 4.0 gate. The baseline gate
GREEN at the exact s183 ship state on a FRESH CLONE: lint 0/0 · tsc
0 · **138/2760** · build (the type-gate artifact) · smoke **14/14** ·
e2e **192/192** (clean first run, 5.7m) · db census MATCH
(15/24/10/23/12 + 4 users at `<repo>/db/custom.db`) · sitemap 11
routes + robots + manifest 200.

**The walk** (`scripts/discover-184.ts` the discovery probe — the
expander RESTING at byte-equal geometry on both apps (`1113,692
270x36`, bg white, border `1px solid rgb(229,229,229)`); the CLICK:
OURS reveals the More Types group (labels 8 → 11: `More Types | Task |
Note` — the functional superset, the s125 fix-over-defect doctrine),
the reference's button the DEAD STUB re-verified live (labels 8 → 8,
no reveal, no variant flip — the L-125c2 doctrine); the rail's action
pair byte-equal (the Filter primary BLUE `rgb(37,99,235)` on BOTH
apps — the reference's explicit CTA classes; NO D-183a1 second
member; the Save All ghost byte-equal) + the quick-log quartet
byte-equal (the Log WhatsApp emerald DEFAULT member). Then
`scripts/walk57-activities-rail-open.ts` — the walk53/56 ledger form
over the rail family's states at the desktop axis 1440×900 (the rail
is `display:none` below lg — the s109 e2e pin; the phone leg the
ABSENCE census): Phase A the expander's RESTING + HOVER + OPEN
faces + the reveal census + the toggle-back round-trip; Phase B the
REAL keyboard Tab chains (the closed rail byte-equal **9 stops** on
both apps — `Save All → 4 checkboxes → All Owners → Last 7 Days →
More Filters (1) → Filter`; OURS-OPEN **11 stops** — the revealed
Task/Note checkboxes ENTER the order); Phase C the rail action pair +
the Owner/Status select triggers' faces + the vocabularies (the
status set byte-equal; the owner options the DATA-STATE genus — ours
the seeded members, the reference's live platform list + its "See
all" member); Phase D the phone absence (the visible expander count
**0 on both apps**):

**THE VERDICT — ZERO LIVE DEFECTS**, every delta a documented genus
(the box-shadow SLOT-COUNT genus — 5-vs-3 on the outline faces, 6-vs-5
on the Filter primary, every VISIBLE layer byte-equal · the outline
VERSION FORM + BOTH sub-forms — the alpha-color carrier on every
face (`3px none rgb(10,10,10)` vs `3px none rgba(10,10,10,0.5)`) +
the currentColor cascade member (the hovered outline flips with our
neutral ink; the Filter's outline with the primary-foreground ink —
style none paints ZERO pixels on both) · the aria-expanded superset
genus (s88-c9, kept) · the L-125c2 dead-stub doctrine (ours the
functional superset; the reference's button permanently outline) ·
the DATA-STATE genus (the owner options)). **THE WALK'S OWN DECODE
KNOWLEDGE**: **THE HOVER FACE — the first mouse-borne face ever
walked in the battery** (every standing walk drives the REAL
keyboard only): OURS `hover:bg-line-soft hover:text-neutral-900` ≡
the reference's `hover:bg-accent
hover:text-accent-foreground`, computed-EQUAL
`rgb(245,245,245)` + `rgb(23,23,23)` — the M-81c2 token-selection
pair's outline-Button hover member, walk-proven live with matched
hover states on both apps; **THE CLICK-THROUGH HOVER-PERSISTENCE
form** — the functional reveal MOVES the trigger off the mouse (ours
shows its byte-equal RESTING face post-click) while the dead stub
keeps the wash (the reference's post-click face IS its hover face),
both constituent faces proven byte-equal in their own legs; **the
sequential-focus STARTING-POINT rule** — Chromium's Tab drive starts
from the last-focused element's position even after `blur()` (the
maiden pass's open-rail chain truncated to 1 stop; the debug-proved
fix: the blank-spot click resets the starting point — the walk
tool's own contract note).

**The TDD ledger**: the pin survey first (FILTER_RAIL's fragment
pins + ACTIVITY_QUICKLOG standing; the s125 walk-pins hold the
completed/scheduled toggle, NEVER the expander — the genuine gap), 3
pins — the walk57 decode freeze (born-green: the tool's own contract
— the three-phase rail ledger, the hover probe, the REAL Tab chains,
the dead-stub re-verification, the absence census) · the
more-filters expander construction FULL-string freeze (born-green —
the genuine battery gap: the fixed `variant="outline"` + the
aria-expanded superset + the functional toggle, no pin held the
construction) · the reveal construction freeze (born-green: the More
Types group + the Task/Note vocabulary + the revealed checkboxes
entering the REAL tab order). **MUTATION-PROOF**: the planted
`variant="outline"` → `variant="secondary"` expander regression →
**exactly 1 RED** (the full-string pin's unique teeth — the
activities page's Badge outline and the quick-log ternary untouched) →
restored → GREEN. **STASH-PROOF**: the round's test block stashed →
exactly **138/2760** (the s183 ship state) → restored → **138/2763**.

**The count ladder**: 2760 → **2763** (+3, all in the existing
page-layout suite — the ADR-017 one-suite doctrine) · SUITES 138
HELD · E2E 192 HELD (**the round touches ZERO product code** — the
walk57 decode found zero live defects; test-only + scripts + docs) ·
badge 2952 → **2955** (count-ladder-184.py: 31 flips, assert-first,
idempotent — the re-run a verified 0-flip no-op) + the collateral
re-anchors (the SKILL §5.6 census checks 236 → 239, the module line
count 1695 HELD — page-layout.ts untouched · the F-106a1 layer-axis
pin — the s184 layer live, the s183 layer demoted beneath it at
2760/192 · the s183-era live-tense RED-first arithmetic site
re-anchored 252 → 255).

**The operator's round-shaped asks, all verified standing** (the
session record's own ledger): the `.env` DATABASE_URL
`file:../db/custom.db` with the `db/` folder at the repo root (census
MATCH at `<repo>/db/custom.db` — the ambient `DATABASE_URL` shadow
scrubbed with `env -u` on every DB-touching command, the F-123a1
doctrine) · the vitest + playwright config files verified standing
(138/2763 unit + 192/192 e2e this session — no config churn) · the
sitemap + SEO surface re-verified (the 11-route sitemap.xml +
robots.txt with its Sitemap line + the installable manifest.json —
smoke check 12 carries the 200s) · the mobile-nav comparison
re-verified (probe:ref TRUE-390 STANDING — the reference's own menu
button live; OURS the Radix Sheet superset; the walk's phone-absence
leg re-verified the rail hidden below lg on both apps) · the
Tailwind v4 state clean (no new v4 hazard; the walk's every delta
decoded against the standing genus register) · the `.env.example`
verified against the six-knob contract and included in this round's
commit.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2763** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **192/192** · db
census MATCH · probe:ref STABLE · the walk57 expander hover + open
interiors byte-equal (the computed-equal hover pair + the
permanently-outline dead face) · the captures: the round's ours+ref
faces.

### Session-185 — THE QUICK-LOG DIALOG OPEN-STATE INTERIOR WALK + BY-TYPE FOOTER RE-WALK (walk58) (2026-10-25)

The post-184 audit rotation, its rotation trigger THE OWNER'S NEWEST
COMMIT (`8e48c3d` — the session_390/391 transcripts, the s184 round's
own execution record). The s390 close's named candidates, adjudicated
by the discovery probe (`scripts/discover-185.ts`): the FIRST-named
(the quick-log quartet's OPEN-dialog faces — the Log Activity dialog's
create-focus arm, the walk54 CREATE-family sibling at this call site)
**LIVE, BOTH ARMS** — the reference's quartet is FUNCTIONAL (the
L-125c2 dead-stub doctrine does NOT reach this family; the s76 Mce
decode's `onSubmit: N => mutate({...N, type: i || N.type})` predicted
it, the live census proves it): the dialog OPENS on the reference at
`384,237 672x426` desktop / `0,201 390x442` phone, the labels +
footer + placeholder byte-equal, the type quintet
Call/Email/Meeting/Task/Note with WhatsApp NEVER listed (the L-76c6
doctrine), the related quartet Contact/Account/Opportunity/Lead; the
second-named (the by-type card's checkbox-footer/••• face — the s13
construction never re-walked under ADR-022) byte-equal on every
computed face (the card `1088,821 320x375` · the checkbox 16x16
checked=true with the dark `rgb(23,23,23)` fill · the ••• identical
modulo our kept aria-label superset); the standing Edit-family
re-check: the reference still carries ZERO rows + ZERO calendar chips
— the candidate STAYS suspended. probe:ref STABLE (`46bc2d9c`) kills
the fresh-bundle candidate; the registry's `latest` 3.10.1 (verified
live) kills the recharts 4.0 gate. The baseline gate GREEN at the
exact s184 ship state on a FRESH CLONE: lint 0/0 · tsc 0 ·
**138/2763** · build (the type-gate artifact) · smoke **14/14** · e2e
**192/192** (clean first run, 5.5m) · db census MATCH · sitemap 11
routes + robots + manifest 200.

**The walk** (`scripts/walk58-quicklog-dialog-open.ts`, the walk53-57
ledger form over the dialog family's OPEN states at BOTH axes — the
dialog family reachable at phone, unlike the rail): Phase A the dialog
OPEN census (the chrome faces + the interior DFS ledger + the
mount-focus — both arms land on the FIRST combobox, ours carrying the
aria-label superset — + the combobox faces + the vocabularies + the
footer pair + the CANCEL round-trip); Phase B the REAL keyboard Tab
drive through the OPEN dialog (the walk54 focus form, now TWO-APP: 17
stops, structurally IDENTICAL chains); Phase C the phone-axis census;
Phase D the by-type footer decode.

**THE LIVE FIND + CURE — D-185a1 THE EMPTY-SELECT PLACEHOLDER INK**
(the s133 retirement's own counter-case): the reference's CURRENT
trigger construction carries the stock `data-[placeholder]:
text-muted-foreground` arm (the walk58 class-string census, both
comboboxes) and its placeholder-state Related To (Type) select computes
the MUTED `rgb(115,115,115)` where the s133 retirement left ours at
the foreground `rgb(10,10,10)`. TWO facts reversed the s133 doctrine:
its own protected face (the accounts density select) retired upstream
at session-148 (F-147c3), and the s81-era bundle decode predates the
s147 mobile-nav-fix bundle event. THE CURE: the arm restored in our
token expression — `data-[placeholder]:text-muted-ink` (the s10 pair
for the reference's `text-muted-foreground`) — the composition
interpolation restored in `select.tsx`; the s133 pin block re-anchored
RED-first. The re-walk PROVES the face byte-equal
(`rgb(115,115,115)` on both apps; the value-carrying selects untouched
at `rgb(10,10,10)`). **THE D-183a1 SAME-FAMILY CHECK: CLEAN** — the
dialog submit's OPEN face byte-equal at `rgb(23,23,23)` on both apps
(our neutral-literal pair ≡ the reference's dark stock primary; no
blue flip). Every remaining delta a documented genus (the box-shadow
slot-count, every VISIBLE layer byte-equal · the outline VERSION FORM
+ both sub-forms · the oklab/rgba overlay serialization · the
token-selection M-81c2 pairs · the class-order position · our
aria-label supersets · the React useId format · lucide's aria-hidden
X · the Radix SelectContent mount-state offset in the interior
ledger).

**The TDD ledger**: the pin survey first (the s125 preset/toggle pins,
the s141 chips palette, the s76 footerRow, the s13/s17 class tokens,
the walk54 chrome freezes — the PAGE-side wiring + the footer PAIR
never pinned), 3 born-green pins — the walk58 decode freeze (the
tool's own contract) · the quick-log trigger→dialog construction freeze
(the QUICK_LOG quartet + the onClick wiring + the ActivityDialog
call-site props — the genuine battery gap) · the by-type footer pair
freeze (the defaultChecked checkbox + the htmlFor label + the •••
aria-label superset) — + THE D-185a1 CURE PIN (RED-first: exactly 1
RED at birth → the cure → GREEN). **MUTATION-PROOF**: the planted
`setDefaultType("call")` wiring regression → **exactly 1 RED** (the
full-string pin's unique teeth) → restored → GREEN. **STASH-PROOF**:
the round's test block stashed → exactly **138/2763** (the s184 ship
state) → restored → **138/2766**.

**The count ladder**: 2763 → **2766** (+3, all in the existing
page-layout suite — the ADR-017 one-suite doctrine) · SUITES 138 HELD
· E2E 192 re-verified (the round's ONE product-code touch: the
D-185a1 restoration in page-layout.ts + select.tsx) · badge 2955 →
**2958** (count-ladder-185.py: assert-first, idempotent — the re-run a
verified 0-flip no-op) + the collateral re-anchors (the SKILL §5.6
census checks 239 → 242, the MODULE lines 1695 → 1701 [the D-185a1
comment growth +6 — the PAD §11 row + the negatives ladder] · the
F-106a1 layer-axis pin — the s185 layer live, the s184 demoted beneath
it at 2763/192 · the s184-era live-tense RED-first arithmetic site
re-anchored 255 → 258).

**The operator's round-shaped asks, all verified standing** (the
session record's own ledger): the `.env` DATABASE_URL
`file:../db/custom.db` with the `db/` folder at the repo root (census
MATCH at `<repo>/db/custom.db` — the ambient `DATABASE_URL` shadow
scrubbed with `env -u` on every DB-touching command, the F-123a1
doctrine) · the vitest + playwright config files verified standing
(138/2766 unit + the 192-check e2e battery re-verified this session)
· the sitemap + SEO surface re-verified (the 11-route sitemap.xml +
robots.txt with its Sitemap line + the installable manifest.json —
smoke check 12 carries the 200s) · the mobile-nav comparison
re-verified (probe:ref TRUE-390 STANDING — the reference's own menu
button live; OURS the Radix Sheet superset) · the Tailwind v4 state
clean (no new v4 hazard; the walk's every delta decoded against the
standing genus register) · the `.env.example` verified against the
six-knob contract and included in this round's commit.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2766** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **192/192** · db
census MATCH · probe:ref STABLE · the walk58 dialog OPEN interiors
byte-equal on both axes (post-cure) · the D-183a1 same-family check
CLEAN · the captures: the round's ours+ref faces.

### Session-186 — THE SETTINGS PICKLIST-EDITOR OPEN-STATE INTERIOR WALK + DEFAULTS-TAB SELECTS SIBLING (walk59) (2026-10-25)

The post-185 audit rotation, its rotation trigger THE OWNER'S NEWEST
COMMIT (`1a1c362` — the session_392/393 transcripts, the s185 round's
own execution record). The s392 close's named candidates, adjudicated
by the discovery probe (`scripts/discover-186.ts`): the FIRST-named
(the settings pages' own interactive arms under ADR-022 — the picklist
editor's focus/open faces, the s83-era construction never re-walked
live) **LIVE, rows on BOTH apps** — the picklists are the settings
singleton's own configuration, NOT the demo data the zero-data state
wiped (OURS the seeded 8/7/6/3/8, the reference its own 5/6/6/4/10
defaults — the DATA-STATE genus: the values are data, the construction
is the comparison); the conditional sibling (the topbar search's
dropdown arm) **KILLED** — `populated=0` on BOTH apps at the
seeded-term leg (the placeholder `Search Anything...` byte-equal; the
s392 gate "if the reference's own suggestions ever populate" FAILS —
the candidate stays suspended with the s32 dead-stub doctrine
standing); the standing Edit-family re-check: the reference still
carries ZERO rows + ZERO calendar chips — the candidate STAYS
suspended. probe:ref STABLE (`46bc2d9c`) kills the fresh-bundle
candidate; the registry's `latest` 3.10.1 (verified live) kills the
recharts 4.0 gate. The baseline gate GREEN at the exact s185 ship
state on a FRESH CLONE: lint 0/0 · tsc 0 · **138/2766** · build (the
type-gate artifact) · smoke **14/14** · e2e **192/192** (clean first
run, 5.7m) · db census MATCH · sitemap 11 routes + robots + manifest
200.

**The walk** (`scripts/walk59-settings-picklist-open.ts`, the
walk53-58 ledger form over the settings family's OPEN/focus states at
BOTH axes — the settings family reachable at phone, like the dialog
family): Phase A the picklist OPEN census (the first-card first-row
RESTING face — the row chrome byte-equal: `313,326 502x54`, border
`1px solid rgb(229,229,229)`, radius 8px, the `flex items-center gap-2
p-2 border rounded-lg hover:bg-gray-50` construction IDENTICAL — the
Pencil-click swap opening the rename arm, the mount-focus landing on
the SAVE button on BOTH apps (the DOM-reuse focus retention), the
rename Input's resting + focus rings, the Pencil/Trash2 resting faces
with the red `rgb(220,38,38)` pair byte-equal, the X close
round-trip — the reference's destructive arms NEVER fired: the
delete/save writes ride OURS only — the ADD row census with the
placeholder + the dark Add `rgb(23,23,23)` 48x36 byte-equal, the
row/Trash2/Add HOVER faces — the walk57 mouse-borne precedent, the
rowHoverBg `rgb(249,250,251)` + the trashHoverColor `rgb(185,28,28)`
byte-equal on both); Phase B the REAL keyboard Tab drive through the
swapped row (the fixed 3-stop chain: the mount-focus Save → Shift-Tab
the Input → Tab Save → Tab X, each stop's ring carrier) + THE ESCAPE
PROBE ANSWERED byte-equal (the reference's own rename swap does NOT
close on Escape either — the X is the cancel on BOTH apps; ours never
wired Escape and neither did the reference); Phase C the phone-axis
census (the rename swap + the add row at 390 — the s106
settings-family-at-phone form); Phase D the Defaults tab decode (the
two comboboxes' OPEN faces — the Month/Week vocabulary, the s72
M-72c3 decode with Agenda NEVER listed, + Monday/Sunday, the
highlighted faces + the trigger faces + the Escape round-trip
byte-equal on both apps + the four inputs' AED/new/B/3 fallback family
byte-equal, the M-72c4 decode standing).

**THE LIVE FIND + CURE — D-186a1 THE RENAME-TRIGGER GLYPH** (the
M-82c2 ACTIVITY-icon class): the s72 H-72c1 bundle decode named the
reference's row icon "a Pencil ghost icon button" and ours shipped
lucide `Pencil` accordingly. The walk59 two-app census + the live path
probe REVERSED the glyph claim: the reference's rename trigger
renders `lucide lucide-pen w-4 h-4` carrying EXACTLY ONE path (the
body `M21.174 6.812…z`) where ours rendered Pencil's TWO paths (the
same body + the extra tip line `m15 5 4 4`) — a different lucide
member of the same family, NOT a version genus (the body path is
byte-identical, ours just added the tip stroke; the reference's
calendar chip-edit family already decodes as Pen — the s48
bundle-verified site). THE CURE: `Pencil` → `Pen` in
`settings-page.tsx` (the import + the JSX + the comment); the s72 pin
block re-anchored RED-first. The re-walk PROVES the glyph byte-equal
(1 path, the pen class, both apps; the interior ledger aligns — the
Trash2's 3 paths + 2 lines byte-identical on both). Every remaining
delta a documented genus (the box-shadow SLOT-COUNT, every VISIBLE
layer byte-equal — the Input's shadow-sm resting layer, the Add's
bare shadow pair, the select content's shadow-lg pair, the focused
1px near-black ring · the ring-offset white zero-extent slot, the s129
retirement · the outline VERSION FORM + both sub-forms · the
token-selection M-81c2 pairs · the class-order `md:text-sm` position ·
our aria-label supersets (the Rename/Save/Cancel/Delete/Add naming —
the s88-c9 doctrine, kept) · the lucide version genus (the class
names + the aria-hidden carrier) · the DATA-STATE values).

**The TDD ledger**: the pin survey first (the s72
SETTINGS_PICKLIST/row-anatomy pins · the s14 SETTINGS_DEFAULTS · the
s26 settings-data-tab · the s10 INPUT_BASE/SELECT_TRIGGER pins · the
walk53 select-carrier freezes · the walk55 SELECT_ITEM freeze — the
RENAME SWAP's construction + the Defaults comboboxes' value wiring
never pinned), 3 born-green pins — the walk59 decode freeze (the
tool's own contract: the two-app picklist OPEN ledger at both axes +
the mount-focus census + the REAL Tab drive + the add-row + the
Defaults combobox decode) · the ListEditor rename-arm construction
freeze (the genuine battery gap: the ternary + the Input aria-label +
the Save/X pair + the Enter wiring + the add-row pair) · the
Defaults-tab select wiring freeze (the genuine gap: Month/Week +
Monday/Sunday + the debounced set() persist) — + THE D-186a1 CURE
PIN (RED-first over the live find: exactly 1 RED at birth → the cure
→ GREEN). **MUTATION-PROOF**: the planted Pencil replant → **exactly
1 RED** (the full-string pin's unique teeth) → restored → GREEN, no
residual. **STASH-PROOF**: the round's test block stashed → exactly
**138/2766** (the s185 ship state) → restored → **138/2769**.

**The count ladder**: 2766 → **2769** (+3, all in the existing
page-layout suite — the ADR-017 one-suite doctrine) · SUITES 138 HELD
· E2E 192 re-verified (the round's ONE product-code touch: the
D-186a1 Pen cure in settings-page.tsx alone; page-layout.ts UNTOUCHED
— the MODULE line count 1701 HELD) · badge 2958 → **2961**
(count-ladder-186.py: assert-first, idempotent — the re-run a
verified 0-flip no-op) + the collateral re-anchors (the SKILL §5.6
census checks 242 → 245 · the census era flip — the s186 census HELD
1701 · the F-106a1 layer-axis pin — the s186 layer live, the s185
demoted beneath it at 2766/192 · the s185-era live-tense RED-first
arithmetic site re-anchored 258 → 261) + skill-head-186.py (the SKILL
v1.183.0, idempotent).

**The operator's round-shaped asks, all verified standing** (the
session record's own ledger): the `.env` DATABASE_URL
`file:../db/custom.db` with the `db/` folder at the repo root (census
MATCH at `<repo>/db/custom.db` — the ambient `DATABASE_URL` shadow
scrubbed with `env -u` on every DB-touching command, the F-123a1
doctrine) · the vitest + playwright config files verified standing
(138/2769 unit + the 192-check e2e battery re-verified this session)
· the sitemap + SEO surface re-verified (the 11-route sitemap.xml +
robots.txt with its Sitemap line + the installable manifest.json —
smoke check 12 carries the 200s) · the mobile-nav comparison
re-verified (probe:ref TRUE-390 STANDING — the reference's own menu
button live; OURS the Radix Sheet superset) · the Tailwind v4 state
clean (no new v4 hazard; the walk's every delta decoded against the
standing genus register) · the `.env.example` verified against the
six-knob contract and included in this round's commit.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2769** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **192/192** · db
census MATCH · probe:ref STABLE · the walk59 picklist arms byte-equal
on both axes (post-cure) · the Defaults vocabularies byte-equal ·
the captures: the round's ours+ref faces.

### Session-187 — THE PROFILE PHOTO-UPLOAD FAMILY FOCUS/OPEN INTERIOR WALK + SETTINGS DATA-TAB SIBLING (walk60) (2026-10-26)

The post-186 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`f8e98a8` — the session_394/395 transcripts, the s186 round's
own execution record). The s394 close's named next-rotation candidates,
adjudicated by the discovery probe (`scripts/discover-187.ts`): the
FIRST-named (the profile page's own interactive arms under ADR-022 —
the photo-upload family's focus/open faces, the s30-era construction
never re-walked live) **LIVE on BOTH apps** — the profile family's
construction byte-equal on every resting face (h1 `Profile & Settings`
+ the four labels + the right-column small-card vocabulary + the
Upload/name/Save geometry byte-equal at `537,312 159x36` /
`425,446 539x36` / `425,730 132x36`); the SECOND-named (the Data-tab
template/export buttons' focus faces — the s26/s83 margins walked, the
focus faces never) **LIVE** — the three cards byte-equal, the
ten-button vocabulary byte-equal, the Danger gate states byte-equal;
the topbar-search dropdown arm KILLED again (`populated=0` on both —
the s32 dead-stub doctrine stands); the standing Edit-family re-check
still zero-row (the candidate STAYS suspended). probe:ref STABLE
(`46bc2d9c`) kills the fresh-bundle candidate; the registry's `latest`
3.10.1 (verified live) kills the recharts 4.0 gate.

The baseline gate GREEN at the exact s186 ship state on a FRESH CLONE:
lint 0/0 · tsc 0 · **138/2769** · build (the type-gate artifact) ·
smoke **14/14** · e2e **192/192** (clean first run, 5.8m) · probe:ref
STABLE · db census MATCH (15/24/10/23/12 + 4 users at
`<repo>/db/custom.db`, the ambient `DATABASE_URL` shadow scrubbed with
`env -u` on every DB-touching command — the F-123a1 doctrine) ·
sitemap 11 routes + robots + manifest 200 (smoke check 12).

**The walk** (`scripts/walk60-profile-datatab-focus-open.ts`, the
walk53-59 ledger form over the profile family's focus/open states +
the Data-tab sibling at BOTH axes): Phase A the profile OPEN census
(the PI card's interior DFS ledger + the avatar's face + the Upload
button's resting + FOCUS faces + its Camera glyph [byte-equal, 1
path] + the hidden file input's construction census + the name input's
resting + focus rings [the FULL untruncated slot chains] + the
disabled email/role faces + the Save button's shadow pair + the
right-column census); Phase B the REAL keyboard Tab drives through
the profile form and the Data-tab row — the programmatic `.focus()`
never triggers `:focus-visible` on either app there, the REAL keyboard
is the only true face, and it paints the byte-equal 1px near-black
ring on both (both chains STRUCTURALLY IDENTICAL); Phase C the
Data-tab sibling (the three cards' geometry ledger + the
template/export buttons' faces + the Danger Zone's tinted census + the
RESET input's ring + the gate states — the write NEVER fired); Phase D
the phone-axis census (both families byte-equal at 390).

**THREE LIVE FINDS CURED**:

- **D-187a1 THE FILE INPUT'S CONSTRUCTION** — the reference's hidden
  input carries `id="photo-upload"` + NO tabIndex attribute (the
  property reads 0); ours shipped id-less with an explicit
  `tabIndex={-1}`. Both inert behaviorally (display:none — never
  tabtable regardless; no label wires htmlFor to it on either app),
  but the D-114a2 same-page precedent (the s114 email/role id cure)
  names the reference's ids construction-parity material on this
  route. THE CURE: the id restored + the explicit tabIndex retired in
  profile-page.tsx.
- **D-187a2 THE AVATAR'S STOCK DIV FALLBACK** — the reference's
  fallback renders a DIV (`w-full h-full bg-blue-100 flex
  items-center justify-center`) with the `text-blue-600` ON THE SVG —
  the stock AvatarFallback form the topbar already carries
  (TOPBAR_LAYOUT's two-level stock structure); ours shipped a
  hand-rolled span with the color on the wrapper. THE CURE: the div
  fallback + the on-svg color at BOTH sites (the form avatar via
  PROFILE_LAYOUT.avatarIcon + the Account card avatar).
- **D-187a3 THE DATA-TAB 8PX BUTTON-ROW OFFSET** — the v4 space-y
  semantics flip's INLINE-FLOW variant: the reference's v3-era
  margin-TOP-on-following extends the line box 8px ABOVE, dropping the
  baseline-aligned inline-flex row 8px below our margin-BOTTOM row at
  byte-equal title/desc/content boxes (first button `313,348` REF vs
  `313,340` OURS; the same 8px on the Export card; the phone axis
  byte-equal both before and after). THE CURE:
  `SETTINGS_DATA.listBody` `space-y-2` → the house's s11-era explicit
  `[&>*+*]:mt-2` form (the CardHeader precedent). The live census
  123 → 122 space-y occurrences across 23 files.

The re-walk PROVES all three cures byte-equal on both axes (the
id/tabIndex pair, the div fallback + the svg color, the 8px cured at
BOTH cards). Every remaining delta a documented genus (the box-shadow
SLOT-COUNT with every VISIBLE layer byte-equal · the ring-offset white
zero-extent slot [the s129 retirement] · the outline VERSION FORM +
both sub-forms · the token-selection M-81c2 pairs · the class-order
family · our aria-hidden supersets).

**The TDD ledger**: the pin survey first (the s13/s30 profile pins ·
the s80 avatar ladders · the s14/s26/s83 Data-tab pins · the s114
email/role ids — the avatar's fallback tag/color carrier, the file
input's id/tabIndex, and the list body's rhythm arm never pinned), 3
born-green pins in the page-layout battery — the walk60 decode freeze
(the tool's own contract: the two-app profile + Data-tab OPEN ledgers
at both axes + the REAL Tab drives) · the profile avatar family
construction freeze · the Data-tab list-body rhythm freeze — + THE
D-187a1/a2/a3 CURE PINS (RED-first: exactly 3 RED at birth → the
cures → GREEN; the D-187a1 construction pin rides the profile-photo
suite as a NEW test) + the collateral re-anchors (the s26
SETTINGS_DATA slice-window pins for the block growth · the s80
avatar-ladders pin for the on-svg color · the space-y live census
123 → 122 [the dialog-geometry + facts-census + README faces] · the
PAD §11 page-layout row 1701 → 1718).

**MUTATION-PROOF**: the planted D-187a1 replant (the id removed + the
explicit tabIndex replanted) → **exactly 1 RED** (the full-string
pin's unique teeth) → restored → GREEN, no residual. **STASH-PROOF**:
the round's test block stashed → exactly **138/2769** (the s186 ship
state) → restored → **138/2773**.

**The count ladder**: 2769 → **2773** (+4: 3 walk60 pins + the NEW
D-187a1 pin — the first pass carried +3 before the +4 truth was caught
at the full-suite count; the corrected count-ladder-187.py accepts
both intermediate forms, the docs land on 2773/2965) · SUITES 138
HELD · E2E 192 re-verified (the round's product-code touches:
profile-page.tsx + page-layout.ts — the MODULE line count 1701 → 1718
[+17 the cure comments]) · badge 2961 → **2965** (count-ladder-187.py:
assert-first, idempotent — the re-run a verified 0-flip no-op) +
skill-head-187.py (the SKILL **v1.184.0**, the s186 layer demoted at
its ship counts 2769/192, the s187 layer live, the last_updated flip
2026-10-26; the first-pass head-surgery interaction caught + repaired:
the ladder's project_state flip had corrupted the demoted block's ship
count — the surgical repair restored 2769 in the retired copy while
flipping the live line to 2773).

**The operator's round-shaped asks, all verified standing** (the
session record's own ledger): the `.env` DATABASE_URL
`file:../db/custom.db` with the `db/` folder at the repo root (census
MATCH at `<repo>/db/custom.db` — the ambient `DATABASE_URL` shadow
scrubbed with `env -u` on every DB-touching command, the F-123a1
doctrine) · the vitest + playwright config files verified standing
(138/2773 unit + the 192-check e2e battery re-verified this session) ·
the sitemap + SEO surface re-verified (the 11-route sitemap.xml +
robots.txt with its Sitemap line + the installable manifest.json —
smoke check 12 carries the 200s) · the mobile-nav comparison
re-verified (probe:ref TRUE-390 STANDING — the reference's own menu
button live; OURS the Radix Sheet superset) · **the Tailwind v4 state
— the D-187a3 find IS the round's v4 bug-watch catch** (the space-y
semantics flip's inline-flow variant, a NEW member of the s11/s96/s98/
s123/M-92c1 v3-semantics lineage, decoded against the standing genus
register and cured with the house's explicit form) · the `.env.example`
verified against the six-knob contract and included in this round's
commit.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2773** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **192/192** · db
census MATCH · probe:ref STABLE · the walk60 profile + Data-tab arms
byte-equal on both axes (post-cure) · the REAL Tab chains structurally
identical · the captures: the round's ours+ref faces.

### Session-188 — THE SETTINGS SEGMENTED TAB-BAR FOCUS/OPEN INTERIOR WALK + ACCOUNTS-RAIL/LEADS-SEARCH PAGE-ARMS SIBLING (walk61) (2026-10-26)

The post-187 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`f1a0a8a` — the session_396/397 transcripts, the s187 round's
own execution record). The s396 close's named next-rotation candidates,
adjudicated by the discovery probe (`scripts/discover-188.ts` + the
micro-probe `scripts/probe-leads-search-and-tab-outline.ts`): the
FIRST-named (the settings Data-tab's OWN deeper focus faces — the
tab-bar segmented focus faces, the s23-era construction never walked
live) **LIVE on BOTH apps** — the strip byte-equal on every resting
face (the `288,189 1120x36` strip bg `rgb(245,245,245)` radius 8 + the
three triggers byte-equal at `292/663/1033 371x28` + the active
bg-white face + the 24px content gap live-measured byte-equal); the
SECOND-named (the account/leads/reports page-level interactive arms
under ADR-022 — the s18/s25-era constructions never re-walked live)
**LIVE** — the accounts rail's three filter selects byte-equal at
`1113,376/456/536 270x36` (the OPEN listbox construction byte-equal
modulo the DATA-STATE item counts: REF 1 at its zero-data state vs
OURS 5 at the seeded db), the leads search byte-equal at `304,391
1088x36` desktop + `32,1037 326x36` phone (the reference's input
carries NO aria-label — the s88-c9 superset confirmed live), the
reports pills/selects re-walked byte-equal modulo the
walk52-documented DATA-STATE y-offset; the density-selects arm KILLED
(F-147c3 retired upstream); the topbar-search dropdown arm KILLED
again (`populated=0` on both — the s32 dead-stub doctrine stands); the
standing Edit-family re-check still zero-row (the candidate STAYS
suspended). probe:ref STABLE (`46bc2d9c`) kills the fresh-bundle
candidate; the registry's `latest` 3.10.1 (verified live) kills the
recharts 4.0 gate.

The baseline gate GREEN at the exact s187 ship state on a FRESH CLONE:
lint 0/0 · tsc 0 · **138/2773** · build (the type-gate artifact) ·
smoke **14/14** · e2e **192/192** (clean first run, 5.7m) · probe:ref
STABLE · db census MATCH (15/24/10/23/12 + 4 users at
`<repo>/db/custom.db`, the ambient `DATABASE_URL` shadow scrubbed with
`env -u` on every DB-touching command — the F-123a1 doctrine) ·
sitemap 11 routes + robots + manifest 200 (smoke check 12).

**The walk** (`scripts/walk61-settings-tabs-rail-focus-open.ts`, the
walk53-60 ledger form over the settings tab-bar's focus/open states +
the accounts-rail/leads-search/reports siblings at BOTH axes): Phase A
the settings tab-bar OPEN census (the strip's geometry ledger + the
DFS wiring + the three triggers' resting faces + the active/inactive
pair + the click-through round-trip [local state, NO writes] + the
panel mount census); Phase B the REAL keyboard Tab drive into the strip
— **13 stops BOTH apps STRUCTURALLY IDENTICAL** (the 8 sidebar links →
the topbar search → the 3 topbar buttons → the strip), the ArrowRight
automatic-activation landing byte-equal, and the REAL `:focus-visible`
face byte-equal on the VISIBLE layers (the white 2px offset slot + the
4px near-black ring + the active shadow pair; the outline sub-forms
both zero visible pixels: OURS `1px none`, REF `2px solid
rgba(0,0,0,0)`); Phase B2 the REAL mouse-click face (the walk57
mouse-borne precedent) — the outline decode: `3px none` on BOTH,
nothing paints; Phase C the accounts rail sibling (the three selects'
faces + the OPEN listbox census); Phase D the leads search sibling
(the resting + REAL-focus rings + the toolbar geometry); Phase E the
reports pills/selects re-walk leg (the walk52/55 re-check on the live
tree); Phase F the phone axis (the strip byte-equal at `16,197
358x36` + the 117x28 triggers; the rail `display:none` below lg the
documented phone-axis kill).

**ZERO LIVE FINDS on the walked surfaces** — every delta a documented
genus, the round's ONE live find a DOCS head defect:

- **D-188a1 THE RETIRED SESSION-186 HEAD BLOCK'S CORRUPTED SHIP LINE**
  — the s187 first-pass ladder/head-surgery interaction wrote the LIVE
  s187 counts + layer name into the demoted s186 copy (the retired
  block read `project_state: 2773 … the session-187 layer (THE
  SETTINGS PICKLIST-EDITOR…walk59` where the s171-fix doctrine demands
  the s186 ship form `2769 … the session-186 layer`), and the corrupted
  head shipped undetected at `c36c5f4`/`f1a0a8a` — the worklog's
  described repair never landed, and NO assertion read inside the
  retired blocks. The walk61 round found it via the head-surgery
  preflight's duplicate-marker assert. THE CURE: the ship line restored
  (`skill-head-188.py` step 0) + the doctrine PINNED for the first
  time (the docs-counts D-188a1 pin: the retired blocks carry their
  OWN ship counts — RED-first, exactly 1 RED at birth) + the pin
  GENERALIZED to the retired s187 block after the count-ladder's
  idempotence re-run corrupted it the same way (the s187 disease
  repeating in our own ladder — caught by the extended pin, repaired,
  and the retired-block carrier form REMOVED from the ladder's
  accepted old-forms).
- **The outline COLOR-CARRIER sub-form** (the register's newest genus
  arm, zero visible pixels on both): at rest and at mouse-click BOTH
  apps compute outline-style `none` — nothing paints — but the carrier
  color resolves `currentColor` on OURS (rgb(10,10,10)/rgb(115,115,115)
  per element) against the reference's platform constant
  `rgba(10,10,10,0.5)` on every element. Under the REAL keyboard the
  s178 outline-none v3/v4 sub-forms hold and the VISIBLE ring layers
  are byte-equal.

Every remaining delta a documented genus (the box-shadow SLOT-COUNT
with every VISIBLE layer byte-equal · the ring-offset white
zero-extent slot [the s129 retirement] · the token-selection M-81c2
pairs [border-line/text-ink vs border-input/inherited — the S10-2
deliberate carrier] · the class-order family [the strip's grid/w-full
position, the rail select's w-full append position, the leads input's
md:text-sm position] · our aria-label supersets [s88-c9, kept] · the
React useId format).

**The TDD ledger**: the pin survey first (the s12/s125/s129
TABS_SEGMENTED family · the s23 tabs-aria wiring · the s28
account-surfaces rail · the s29 LEADS_TOOLBAR pl-10 · the s10
INPUT_BASE — the settings page's OWN call-site, the three rail
SelectTrigger sites, and the leads search call-site never pinned), 4
born-green pins in the page-layout battery — the walk61 decode freeze
(the tool's own contract: the two-app settings OPEN ledger at both
axes + the REAL Tab/ArrowRight drives + the mouse-click face + the
rail/leads/reports siblings) · the settings tab-bar call-site
construction freeze · the accounts rail-selects construction freeze ·
the leads-search call-site construction freeze — + THE D-188a1 CURE
PIN (RED-first: exactly 1 RED at birth → the cure → GREEN; a NEW test
in docs-counts).

**MUTATION-PROOF**: the planted D-188a1 replant (the corrupted form
written back into the retired s186 block) → **exactly 1 RED** (the
retired-block pin's unique teeth) → restored → GREEN, no residual.
**STASH-PROOF**: the round's test block stashed → exactly **138/2773**
(the s187 ship state) → restored → **138/2778**. The walk re-run
STABLE (the delta report byte-identical on the second pass).

**The count ladder**: 2773 → **2778** (+5: the 4 walk61 pins + the NEW
D-188a1 pin — the first pass carried +4 before the +5 truth was caught
at the full-suite count, the s187 lesson repeating; the corrected
count-ladder-188.py accepts both intermediate forms, the docs land on
2778/2970, the re-run a verified 0-flip no-op across a triple run) ·
SUITES 138 HELD · E2E 192 re-verified (the round: ZERO product-code
touches — the MODULE line count 1718 HELD) · badge 2965 → **2970** +
skill-head-188.py (the SKILL **v1.185.0**, the s187 layer demoted at
its ship counts 2773/192, the s188 layer live; the s187 lesson applied:
the head surgery ran BEFORE the ladder, so the demotion was a verbatim
move and the ladder's SKILL-head flip a no-op — the retired blocks
untouched, now PINNED).

**The operator's round-shaped asks, all verified standing** (the
session record's own ledger): the `.env` DATABASE_URL
`file:../db/custom.db` with the `db/` folder at the repo root (census
MATCH at `<repo>/db/custom.db` — the ambient `DATABASE_URL` shadow
scrubbed with `env -u` on every DB-touching command, the F-123a1
doctrine) · the vitest + playwright config files verified standing
(138/2778 unit + the 192-check e2e battery re-verified this session) ·
the sitemap + SEO surface re-verified (the 11-route sitemap.xml +
robots.txt with its Sitemap line + the installable manifest.json —
smoke check 12 carries the 200s) · the mobile-nav comparison
re-verified (probe:ref TRUE-390 STANDING — the reference's own menu
button live; OURS the Radix Sheet superset) · **the Tailwind v4 state
— the walk61 decode CLEAN on every arm** (every delta root-caused
against the standing genus register; the outline color-carrier sub-form
documented as the register's newest zero-visible arm; the v3-semantics
lineage [s11/s96/s98/s123/M-92c1/D-187a3] re-checked at the settings
strip + the rail + the leads toolbar — all byte-equal) · the
`.env.example` verified against the six-knob contract and included in
this round's commit.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2778** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **192/192** · db
census MATCH · probe:ref STABLE · the walk61 settings + rail/leads +
reports arms byte-equal on both axes · the REAL Tab chains structurally
identical (13 stops both) · the captures: the round's ours+ref faces.

### Session-189 — THE LEADS SAVED-VIEWS SELECT OPEN FACES + THE CALENDAR MONTH-NAV ARMS (walk62) (2026-10-27)

The post-188 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`2c2c703` — the session_398/399 transcripts, the s188 round's
own execution record). The s398 close's named next-rotation candidates,
adjudicated by the discovery probe (`scripts/discover-189.ts`): the
account INSIGHTS dialog **KILLED** (the reference's zero-row state
persists — rows=1 the empty-state row alone, rowMenus=0,
insightsTriggers=0 on /contacts, /leads, /accounts + zero calendar
chips; the Ece dialog rides an account row's ⋮ menu that does not
exist there; the candidate STAYS suspended) · the leads SAVED-VIEWS
select's open faces **LIVE on BOTH apps** — the s29-era construction
(the conditionally-mounted select, the NATIVE `prompt("Enter view
name:")` save flow, the localStorage `neo-crm.leads.views` seam): the
select byte-equal at `428,443 192x36` desktop + `32,482 326x36`
phone, the OPEN listbox byte-equal at `428,483 194x42` radius 6 with
the one-item vocabulary identical, the apply round-trip identical ·
the calendar MONTH-NAV arms **LIVE on BOTH apps** — the s27-era
construction (data-independent, reachable at the reference's zero-data
state): the heading byte-equal (`313,374 183x32`), the three outline
buttons byte-equal (prev `877,372 36x36` · Today `921,372 75x36` ·
next `1003,372 36x36`), the flip round-trips identical · the
topbar-search gate KILLED again (`populated=0` on both — the s32
dead-stub doctrine stands) · the probe STABLE at `46bc2d9c` kills the
fresh-bundle candidate, the registry's latest staying 3.10.1 kills
the recharts 4.0 gate. The baseline GREEN at the exact s188 ship
state on a FRESH CLONE: lint 0/0 · tsc 0 · 138/2778 · build · smoke
14/14 · e2e 192/192 (clean first run, 5.6m) · probe:ref STABLE ·
census MATCH · sitemap 11 routes + robots + manifest 200.

**THE WALK** (`scripts/walk62-savedviews-calnav-focus-open.ts`, the
walk53-61 ledger form over the two LIVE arms at BOTH axes): Phase A
the Saved-Views select OPEN census — the pre-save absence census (REF
0 comboboxes at its zero-data state vs OURS 24 inline row selects at
the seeded db — the DATA-STATE genus) + the save-flow ride (the
Filters popover → Save View → the NATIVE prompt answered — the s29
live-verified contract, the browser context discarding the storage) +
the mounted select's geometry ledger + the OPEN listbox census + the
apply round-trip (the trigger text `Walk62 View` on both,
listbox-closed on both); Phase B the REAL keyboard drive into the
mounted select — the SAME-SESSION form (NO reload: the reference
keeps its view list IN MEMORY ONLY — ours persists to localStorage,
the kept superset; a reload kills the REF's select) — the chain
STRUCTURALLY IDENTICAL (5 stops: Export → New Lead → search →
Filters → the select, reached at stop 5 on BOTH) + the ArrowDown open
(radius 6, items 1, highlight `Walk62 View` both) + the Enter apply;
Phase C the calendar month-nav census — the header-row geometry + the
three buttons' resting faces + the DFS ledger + the click round-trip
(prev → `September 2026`; today → `October 2026` — local state, NO
writes, identical both) + the month-flip grid re-census (the heading
flip byte-equal; the buttons-only cell census rides OURS' day-cell
superset — the DATA-STATE genus); Phase C2 the REAL keyboard Tab
drive through the three nav buttons (landing at stop 15 on BOTH, the
tag+geometry sequences STRUCTURALLY IDENTICAL, the REAL
:focus-visible faces byte-equal on the VISIBLE layers — the 1px
near-black ring + shadow-sm); Phase D the phone axis 390×844 (the
select w-full stack byte-equal; the Today button hidden below sm on
BOTH — the s27 live pin, 2 nav buttons on each).

**ZERO LIVE FINDS** — every delta a documented genus (the box-shadow
SLOT-COUNT with every VISIBLE layer byte-equal · the ring-offset
white zero-extent slot [s129] · the outline VERSION FORM + both
sub-forms + the COLOR-CARRIER sub-form [zero visible pixels on both]
· the token-selection M-81c2 pairs (border-line/bg-surface vs
border-input/bg-popover, computed-equal) · the class-order family
(the outline-button ring-position pair) · our aria-label supersets
[s88-c9, kept — the select trigger + both nav icons] · our
aria-hidden svg superset · the React useId format · the DATA-STATE
genera). The round: the second consecutive zero-fix freeze-pin
session (the s134/s188 precedent).

**THE TDD LEDGER**: the pin survey first (the s29 LEADS_TOOLBAR
family + the savedViewsSelect width pin · the s16 CALENDAR_CARD
family · the s27 calendar-cells family · the s10 INPUT_BASE/
SELECT_TRIGGER/BUTTON_BASE pins), then 3 born-green pins in the
page-layout battery — the walk62 decode freeze (the tool's own
contract) · the Saved-Views select call-site construction freeze
(the genuine battery gap: the s29 pins hold the toolbar row + the
width class, never the SelectTrigger call-site's own chain) · the
calendar month-nav call-site construction freeze (the genuine gap:
the s16 pins hold the navRow container + the s27 pins the day cells,
never the three Button call-sites) — all BORN GREEN, no cure pins.
**MUTATION-PROOF**: the planted "Prev month" regression → exactly 1
RED → restored → GREEN, no residual. **STASH-PROOF**: the round's
test block stashed → exactly 138/2778 (the s188 ship state) →
restored → 138/2781. The walk re-run STABLE (the delta report
byte-identical).

The count ladder 2778 → **2781** (+3) · SUITES 138 HELD · E2E 192
re-verified (the round: ZERO product-code touches — the MODULE line
count 1718 HELD) · badge 2970 → **2973** (count-ladder-189.py:
assert-first, idempotent — the re-run a verified 0-flip no-op; the
+3 verified directly at the full-suite count, no intermediate form)
+ skill-head-189.py (the SKILL v1.186.0, the s188 layer demoted at
its ship counts 2778/192, the s189 layer live, idempotent — the head
surgery ran BEFORE the ladder, the retired blocks untouched and now
the retired s188 ship line PINNED by the generalized D-188a1
doctrine's next member) + the docs lockstep (the AGENTS Session-189
section · the PAD session-189 inventory row · the CLAUDE
page-layout bullet's walk62 tail · the README Tested row's walk62
clause + the badge · session_400.md + the plan's execution record +
the worklog entry [Task ID 189]).

The operator's round-shaped asks all verified standing (the session
record's own ledger): the `.env` DATABASE_URL
`file:../db/custom.db` with the `db/` folder at the repo root (census
MATCH at `<repo>/db/custom.db` — the ambient `DATABASE_URL` shadow
scrubbed with `env -u` on every DB-touching command, the F-123a1
doctrine) · the vitest + playwright config files verified standing
(138/2781 unit + the 192-check e2e battery re-verified this session) ·
the sitemap + SEO surface re-verified (the 11-route sitemap.xml +
robots.txt with its Sitemap line + the installable manifest.json —
smoke check 12 carries the 200s) · the mobile-nav comparison
re-verified (probe:ref TRUE-390 STANDING — the reference's own menu
button live; OURS the Radix Sheet superset) · **the Tailwind v4 state
— the walk62 decode CLEAN on every arm** (every delta root-caused
against the standing genus register; the v3-semantics lineage
[s11/s96/s98/s123/M-92c1/D-187a3] re-checked at both arms — all
byte-equal) · the `.env.example` verified against the six-knob
contract and included in this round's commit.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2781** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **192/192** · db
census MATCH · probe:ref STABLE · the walk62 Saved-Views + month-nav
arms byte-equal on both axes · the REAL Tab chains structurally
identical (the select at stop 5 both; the nav at stop 15 both) · the
captures: the round's ours+ref faces.

### Session-190 — THE REPORTS SAVE-CUSTOM-VIEW DIALOG OPEN FACES (walk63) (2026-10-27)

The post-189 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`b8ea9f3` — the session_400/401 transcripts, the s189 round's
own execution record). The s400 close's named next-rotation candidates,
adjudicated by the discovery probe (`scripts/discover-190.ts` + the
two micro-probes): the reports SAVE-CUSTOM-VIEW dialog **LIVE on BOTH
apps, rich arms** — the s25-era construction (the "Saved Reports (N)"
outline button → the wide Radix dialog → the localStorage
`crm_saved_reports` seam, the L-74c8 state contract, the F-123a4
BLACK-pair Save): the trigger byte-equal at `1216,113 192x36`, the
OPEN dialog byte-equal at `384,240 672x420` (radius 8), the title +
the name input byte-equal (placeholder + the COMPUTED font 14px/400
line 20px — the `md:text-sm` a CLASS-ORDER genus, the reference
appending it at the chain's end, decoded), the 6-column checkbox grid
vocabulary identical with the checkbox faces computed-EQUAL (the
`border-neutral-900` vs `border-primary` token-selection genus,
decoded), the Current-Filters summary box + the footer identical (the
disabled-Save resting face byte-equal), the SAVE round-trip + the
post-save REOPEN identical (the L-74c8 clear + the one-item
saved-list) · the dashboard FOLLOW-UP-ROWS checkbox arms **KILLED**
(the reference's zero-data state persists — 0 checkboxes on the Lead
Sources card [the empty container, the S9-10 contract] + the
"No upcoming activities" empty-state paragraph; the rows ride DATA
rows that do not exist on the reference — the same doctrine as the
s189 Insights kill; the candidate STAYS suspended) · the activities
COMPLETED-TAB row-action buttons **KILLED** (the reference's
Completed tab renders its empty panel at the zero-data state —
checkButtons=0; the same suspension doctrine) · the topbar-search
gate **KILLED again** (`populated=0` on both — the s32 dead-stub
doctrine stands) · the standing Edit-family re-check still zero-row
(suspended).

The baseline gate GREEN at the exact s189 ship state on a FRESH
CLONE: lint 0/0 · tsc 0 · **138/2781** · build · smoke **14/14** ·
e2e **192/192** (clean first run, 5.7m) · probe:ref STABLE
(`46bc2d9c`) · db census MATCH (15/24/10/23/12 + 4 users at
`<repo>/db/custom.db`) · sitemap 11 routes + robots + manifest 200 ·
recharts latest 3.10.1 verified live (the 4.0 gate killed).

**THE WALK** (`scripts/walk63-savedreports-dialog-focus-open.ts`, the
walk53-62 ledger form over the LIVE arm at BOTH axes): Phase A the
OPEN dialog census — the trigger's resting face + the click-open ride
+ the root geometry + the DFS ledger + the title + the input's FULL
chain + computed face + the checkbox grid + the summary + the footer
trio + the close X + the mount focus (the input, on BOTH); Phase B
the REAL keyboard Tab drive through the OPEN dialog — the chain
**STRUCTURALLY IDENTICAL (10 stops: the mount input → 6 checkboxes →
Cancel → Close → the input wrap; the Save NEVER in the fresh-open
chain — disabled buttons are not focusable; the post-type drive
captures its REAL face)** + the REAL :focus-visible faces byte-equal
on the VISIBLE layers (the 1px near-black ring); Phase C the
interactive arms — the type-flip + the SAVE round-trip (the
localStorage seam, the browser context discarding it) + the post-save
REOPEN (the L-74c8 name-clear byte-equal) + the saved-list arm (the
p-3 bg-gray-50 rows + the Load outline-sm + the bookmark glyph; the
name + the locale date identical) + the cancel-then-reopen decode
(the L-74c7 keep — "Keep Me" survives a cancel on both) + the
checkbox-toggle ride (the unchecked faces identical); Phase D the
phone axis 390×844 — the root `0,184 390x476` + the input
`25,287 340x36` at 16px/400 (the s9 below-md doctrine) + the
checkbox[0] + the footer byte-equal.

**THE LIVE FINDS — TWO CURED**: **D-190a1 THE SIX COLUMN CHECKBOXES'
LITERAL ID/FOR CONSTRUCTION**: the reference's checkboxes carry the literal
REPORT_COLUMNS keys as ids (`id="name"` … `id="wonDate"`,
`for="name"` … `for="wonDate"` — live-walked on its DOM); ours
shipped React useId ids. The D-114a2/D-187a1 ids-are-construction-
parity doctrine. THE CURE: `id={col.key}` at the call site (the
component's `id ?? generated` seam carrying it to the htmlFor); the
re-walk PROVES the id/for ledger deltas GONE, byte-equal both apps.
and **D-190a2 THE README TESTED ROW'S DUPLICATED WALK62 CLAUSE** (the
s189 first-pass residue: the round appended its clause TWICE — once
inside the s29 leads-layer parenthetical + once after it, the second
copy leaving an UNBALANCED double close — shipped undetected at
3739c96/b8ea9f3; caught by this round's docs lockstep; THE CURE: the
s29 paren restored + the single standalone clause + the balanced
pares + the D-190a2 CURE PIN in docs-counts [RED-first: exactly 1 RED
at birth → the cure → GREEN — the clause-unique doctrine]).
Every remaining delta a documented genus: the box-shadow SLOT-COUNT
(every VISIBLE layer byte-equal) · the outline VERSION FORM + both
sub-forms + the COLOR-CARRIER sub-form (zero visible pixels on both)
· the s129 ring-offset white zero-extent slot · the token-selection
M-81c2 pairs (border-line/bg-surface/text-ink/muted-ink/line-soft/
neutral-900 vs border-input/bg-background/muted-foreground/accent/
primary — computed-equal on every face) · the class-order genus · the
React useId format · the DANGLING aria-describedby genus (walk54: the
reference's own dead pointer, not mirrored) · our aria-hidden svg
superset (kept).

**THE TDD LEDGER**: the pin survey first (the s25 saved-reports
content regexes + the s68 wide wiring + the s74 state contracts + the
s83 Load outline-sm + the s123 BLACK-pair + the s10
INPUT_BASE/CHECKBOX.control pins), then the battery: 3 born-green pins
(the walk63 decode freeze · the Saved-Reports TRIGGER call-site
construction freeze — the genuine gap: the s25 pins hold the wiring
regex, never the trigger's own chain · the Save-Report-Dialog
open-interior construction freeze — the genuine gap: the content
words as regexes, never the call-site chains) + THE D-190a1 CURE PIN
(RED-first: exactly 1 RED at birth → the cure → GREEN).
**MUTATION-PROOF**: the `id={col.key}` regression replanted → exactly
1 RED → restored → GREEN, no residual. **STASH-PROOF**: the round's
test block stashed → exactly **138/2781** (the s189 ship state) →
restored → **138/2785** (the page-layout battery) — the D-190a2 pin's
+1 caught at the full-suite count lands the TRUE total **138/2786**
(the s187/s188 undercount lesson repeating, as the worklog predicted).
The walk re-run STABLE (the delta report byte-identical).

The count ladder 2781 → **2786** (+5 — 4 walk63 pins + the NEW D-190a2
pin in docs-counts; the first pass carried +4/2785 before the pin's +1
was caught at the full-suite count, the s187/s188 undercount lesson
repeating as the worklog predicted; the corrected count-ladder-190.py
accepts both intermediate forms) ·
SUITES 138 HELD · E2E 192 re-verified (the round's product-code touch:
save-report-dialog.tsx +8 lines [the D-190a1 cure + its comment] — the
MODULE line count 1718 HELD, page-layout.ts untouched) · badge 2973 →
**2978** + skill-head-190.py (the SKILL **v1.187.0**, the s189 layer
demoted at its ship counts 2781/192, the s190 layer live, idempotent —
the head surgery BEFORE the ladder, the retired s189 ship line PINNED
by the generalized D-188a1 doctrine's next member in docs-counts) +
count-ladder-190.py: assert-first, idempotent — the re-run a verified
0-flip no-op) + the docs lockstep (the AGENTS Session-190 section ·
the PAD session-190 inventory row · the CLAUDE page-layout bullet's
walk63 tail · the README Tested row's walk63 clause + the badge ·
session_402.md + the plan's execution record + the worklog entry
[Task ID 190]).

The operator's round-shaped asks all verified standing (the session
record's own ledger): the `.env` DATABASE_URL
`file:../db/custom.db` with the `db/` folder at the repo root (census
MATCH at `<repo>/db/custom.db` — the ambient `DATABASE_URL` shadow
scrubbed with `env -u` on every DB-touching command, the F-123a1
doctrine) · the vitest + playwright config files verified standing
(138/2786 unit + the 192-check e2e battery re-verified this session) ·
the sitemap + SEO surface re-verified (the 11-route sitemap.xml +
robots.txt with its Sitemap line + the installable manifest.json —
smoke check 12 carries the 200s) · the mobile-nav comparison
re-verified (probe:ref TRUE-390 STANDING — the reference's own menu
button live; OURS the Radix Sheet superset) · **the Tailwind v4 state
— the walk63 decode CLEAN on every arm** (every delta root-caused
against the standing genus register; the v3-semantics lineage
[s11/s96/s98/s123/M-92c1/D-187a3] re-checked at the dialog's arms —
all byte-equal) · the `.env.example` verified against the six-knob
contract and included in this round's commit.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2786** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **192/192** · db
census MATCH · probe:ref STABLE · the walk63 Save-Custom-View dialog
arm byte-equal on both axes (post-cure) · the REAL Tab chains
structurally identical (10 stops both) · the captures: the round's
ours+ref faces.

### Session-191 — THE THREE CREATE DIALOGS' OPEN FACES (walk64) (2026-10-27)

The post-190 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`968736a` — the session_402/403 transcripts, the s190 round's
own execution record). The s402 close's named candidates are ALL
conditional, and the discovery (`scripts/discover-191.ts`) re-checked
every leg: the reference's zero-data state persists (the Edit-family
census rows=1 the empty-state row alone, rowMenus=0, zero calendar
chips — the discover-184..191 standing census), the topbar-search
dropdown still `populated=0` on both (the s32 dead-stub doctrine
stands), the dashboard follow-up-rows checkbox arms + the activities
Completed-tab row actions stay KILLED at the reference's empty panels;
probe:ref STABLE (`46bc2d9c`) kills the fresh-bundle candidate, the
registry's `latest` 3.10.1 (verified live) kills the recharts 4.0
gate. The round material = the discovery's NEW adjudication: **the
THREE CREATE DIALOGS the walk54/58 family never opened two-app** — the
CONTACT (the s15/s30 avatar + photo-upload construction), the ACCOUNT
(the s15 8-field 2-col grid), the EVENT (the s15/s76 WIDE family) —
all LIVE on BOTH apps, byte-equal at the census level, their OPEN
interiors + REAL focus faces genuinely unwalked (the a11y dialog-open
family pins OURS only; walk54's family chrome freezes are OURS-only
source pins).

THE WALK (`scripts/walk64-createdialogs-focus-open.ts`, the walk61
multi-arm form over the THREE dialogs at BOTH axes): Phase A per
dialog the OPEN census — the triggers byte-equal (`1255,115 153x36` /
`1274,103 134x32` / `1269,113 139x36`) + the OPEN roots byte-equal
(`464,45 512x810` / `384,214 672x472` / `384,133 672x634`) + the DFS
ledger + the FULL inputs id map + the labels wiring map + the
comboboxes + the contact's file input + the footer Cancel/Create pairs
+ the mount focus (the camera button on the contact, the first input
on the account/event — byte-equal behavior on both); Phase B the REAL
keyboard Tab drives — the chains STRUCTURALLY IDENTICAL (19/12/19
stops; the datetime segments' native 7-tab cycles identical on both
apps) + the REAL :focus-visible faces byte-equal on the VISIBLE layers
(the 1px near-black ring); Phase C the interactive arms — the
meet-select ride (the 5 emoji options + the listbox `489,623 464x170`
byte-equal) + the status ride (the 3-option set + the listbox
`728,613 305x106` byte-equal) + the EVENT related-to pick (the
M-76c13 conditional Name field LIVE on BOTH apps: the placeholder
"Enter Contact name" + the box `728,638 303x36` + the comboTexts flip,
byte-equal) + the cancel-then-reopen state decode (ours clears via
the S71-P1 epoch — the pinned fresh-per-open contract; the reference
keeps its draft — the KEPT house superset, dialog-mount-contract) —
the Create submits NEVER fired on either app; Phase D the phone axes
byte-equal (`0,42 390x760` / `0,168 390x508` / `0,99 390x646`). The
walk re-run STABLE (the delta report byte-identical modulo the cures).

**FIVE LIVE FINDS CURED — four the id-parity family** (all one doctrine —
the D-114a2/D-187a1/D-190a1 ids-are-construction-parity lineage, the
full DFS id map live-walked on the reference's DOM):

- **D-191a1 THE CONTACT DIALOG'S LITERAL ID/FOR MAP**: the reference
  carries `id="name"`/`"email"`/`"phone"`/`"company"`/`"position"` with
  `for=` the same; ours shipped `ct-*`. THE CURE: the literal ids
  restored at every call site (the ct-* prefixes retired; the s19
  pwa-metadata ct-phone source pin re-anchored to `id="phone"`).
- **D-191a2 THE ACCOUNT DIALOG'S LITERAL ID/FOR MAP**: the reference
  carries `id="name"`/`"industry"`/`"email"`/`"phone"`/`"website"`/
  `"revenue"`/`"employees"`; ours shipped `acc-*`. THE CURE: the
  literal ids restored.
- **D-191a3 THE SELECTS' ID + LABEL-FOR WIRING**: the reference's
  meet-select carries `button id="source"` + `label for="source"` and
  its account Status `button id="status"` + `label for="status"`;
  ours shipped bare labels + aria-label triggers. THE CURE: the id/for
  wiring restored while KEEPING the aria-label superset (aria-label
  wins the accessible-name computation — the a11y pin's name contract
  unchanged).
- **D-191a4 THE CONTACT FILE INPUT'S EXPLICIT tabIndex**: ours shipped
  `tabIndex={-1}`, the reference carries NO tabIndex attribute — the
  D-187a1 retirement's next member (both inert — `className="hidden"`
  removes the input from the layout AND the tab chain). THE CURE: the
  explicit attribute retired.
- **D-191a5 THE EVENT CREATE-DIALOG'S START-DATE PRE-FILL**: the
  reference's fresh-open create form ships the start date EMPTY
  (live-walked — the VLM battery's catch on the ours+ref pair, the
  value-blind census's gap; the micro-probe confirmed OURS
  '2026-10-27T04:00' vs REF ''); ours pre-filled NOW
  (`toLocalInputValue(defaultStart ?? new Date())`). THE CURE: only the
  no-default path empties — the day-cell dblclick flow keeps its OWN
  defaultStart (the s54 decode, untouched); the submit gate's
  empty-start toast stays (our superset).


The re-walk PROVES the id/for/tabIndex ledger deltas GONE (the id map
byte-equal both apps). Every remaining delta a documented genus or a
kept superset (the box-shadow SLOT-COUNT with every VISIBLE layer
byte-equal · the outline VERSION FORM + both sub-forms + the
COLOR-CARRIER sub-form · the M-81c2 token pairs — border-line/
bg-surface vs border/bg-background, computed-equal · the md:text-sm
COMPOSITION genus — the COMPUTED font 14px/500 byte-equal both apps,
the reference inheriting what ours classes · the aria-label supersets
[kept] · our aria-hidden svg + Radix placeholder-`<option>` supersets
[kept] · the reference's own Radix artifacts — the stale aria-controls
at rest + the DANGLING aria-describedby genus [walk54: the reference's
own dead pointer, not mirrored] · the React useId format · the KEPT
s172 label-wiring superset on the event dialog — the reference's bare
labels + id-less inputs are its own defect, never mirrored).

THE TDD LEDGER: the pin survey first (the s15/s19/s28/s30/s50/s76/s92/
s112/s172 dialog pin families + the walk53-63 decode freezes), then the
battery — 4 born-green pins (the walk64 decode freeze · the CONTACT
open-interior construction freeze [the genuine gap: the s19/s30 pins
hold OUR wiring regexes, never the call-site chains] · the ACCOUNT
open-interior construction freeze [the same gap: the s15/s5 pins hold
the field order + payload contracts, never the chains] · the EVENT
open-interior construction freeze [the same gap: the s15/s76 pins hold
the constants + the bundle decode, never the chains]) + THE FOUR CURE
PINS (RED-first: exactly 5 RED at birth — the contact freeze rides the
cured file-input string — → the cures → GREEN). **MUTATION-PROOF**
(the `id="phone"` regression replanted → exactly 1 RED → restored →
GREEN, no residual) · **STASH-PROOF** (the round's page-layout block
stashed → exactly **138/2786** [the s190 ship state] → restored →
138/2794 [the +8 first pass]; the D-191a5 pin's +1 caught at the full-suite count lands the TRUE 2795).

The count ladder 2786 → **2795** (+9 — 4 the walk64 freezes + 5 the
cure pins; the first pass carried +8/2794 before the D-191a5 pin's +1
was caught at the full-suite count, the s187/s188/s190 undercount
lesson repeating; the corrected ladder accepts both intermediate
forms) · SUITES 138 HELD ·
E2E 192 re-verified (the round's product-code touch:
entity-dialogs.tsx 1226 → 1250 [the five cure comment blocks] — the
PAD §11 row + the SKILL line-count census re-anchored, page-layout.ts
untouched at 1718) · badge 2978 → **2987** (the unit+e2e arithmetic:
2795+192) + skill-head-191.py (the SKILL **v1.188.0**, the s190 layer
demoted at its ship counts 2786/192, the s191 layer live, idempotent —
the head surgery BEFORE the ladder, the retired s190 ship line PINNED
by the generalized D-188a1 doctrine's next member in docs-counts) +
count-ladder-191.py: assert-first, idempotent. The docs lockstep (the
AGENTS Session-191 section · the PAD session-191 inventory row · the
CLAUDE page-layout bullet's walk64 tail · the README Tested row's
walk64 clause + the badge · session_404.md + the plan's execution
record + the worklog entry [Task ID 191]).

The operator's round-shaped asks all verified standing: the `.env`
DATABASE_URL `file:../db/custom.db` with the `db/` folder at the repo
root (census MATCH at `<repo>/db/custom.db`) · the vitest + playwright
config files verified standing (138/2795 unit + the 192-check e2e
battery re-verified this session) · the sitemap + SEO surface
re-verified (the 11-route sitemap.xml + robots.txt with its Sitemap
line + the installable manifest.json — smoke check 12 carries the
200s) · the mobile-nav comparison re-verified (probe:ref TRUE-390
STANDING — the reference's own menu button live; OURS the Radix Sheet
superset) · **the Tailwind v4 state — the walk64 decode CLEAN on
every arm** (every delta root-caused against the standing genus
register; the v3-semantics lineage [s11/s96/s98/s123/M-92c1/D-187a3]
re-checked at the three dialogs' arms — all byte-equal) · the
`.env.example` verified against the six-knob contract and included in
this round's commit.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2795** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **192/192** · db
census MATCH · probe:ref STABLE · the three create-dialog arms
byte-equal on both axes (post-cure) · the REAL Tab chains structurally
identical (19/12/19 stops both) · the captures: the round's ours+ref
faces.

### Session-192 — THE LOGIN ANON-SURFACE INTERIORS + THE LANDING MARKETING ARMS (walk65) (2026-10-27)

The post-191 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`26d542e` — the session_404/405 transcripts, the s191 round's
own execution record). The s404 close's named candidates are ALL
conditional, and the discovery (`scripts/discover-192.ts`) re-checked
every leg: the reference's zero-data state persists (the Edit-family
census rows=1 the empty-state row alone, rowMenus=0 — the
discover-184..192 standing census), the topbar-search dropdown still
`populated=0` on both (the s32 dead-stub doctrine stands), the
dashboard follow-up-rows checkbox arms + the activities Completed-tab
row actions stay KILLED at the reference's empty panels; probe:ref
STABLE (`46bc2d9c`) kills the fresh-bundle candidate, the registry's
`latest` 3.10.1 (verified live) kills the recharts 4.0 gate. The
round material = the s404 close's own naming: **the LOGIN PAGE'S
ANON-SURFACE INTERIORS** (the signin resting card + the view
machine's OPEN interiors — signup/reset/sent; last walked at the
s111/s126 computed-style censuses, never at the walk53-64 OPEN-LEDGER
level, never under the ids-are-construction-parity doctrine, stale
through the s163 auth retrofit's sent-view change) + **the LANDING
PAGE'S MARKETING ARMS** (the FAQ single-open accordion + the mobile
disclosure menu — the s143/s155 walks censused the anatomy + the
four-axis geometry, never the OPEN-state interiors) — all LIVE on
BOTH apps, byte-equal at the census level.

- **192-a**: the baseline gate GREEN at the exact s191 ship state (the
  fresh clone at `26d542e`, tree clean): lint 0/0 · tsc 0 ·
  **138/2795** unit · build (the type-gate artifact) · smoke **14/14**
  · e2e **192/192** (clean first run, 5.6m — after the fresh-sandbox
  playwright chromium-1248 install) · probe:ref STABLE (`46bc2d9c`) ·
  db census MATCH (15/24/10/23/12 + 4 users at `<repo>/db/custom.db`,
  the ambient `DATABASE_URL` shadow scrubbed with `env -u` on every
  DB-touching command — the F-123a1 doctrine) · sitemap 11 routes +
  robots + manifest 200 · the Tailwind v4 state clean.

- **THE WALK (walk65)**: `scripts/walk65-login-landing-arms.ts` (the
  walk61 multi-arm form over the TWO surfaces at BOTH axes on FRESH
  contexts — the anon battery, no login, no storageState on either
  app): Phase A per view the OPEN census — the card roots byte-equal
  at `496,95 448x710 / 16,73 358x650` (signin) + `496,215 448x470 /
  16,187 358x422` (signup) + `496,263 448x374 / 16,243 358x310`
  (reset) + `496,251 448x398 / 16,221 358x354` (sent) + the DFS ledger
  + the FULL inputs id map + the labels wiring map + the google button
  + the submit/back faces + the mount focus (body on BOTH) + the
  back-nav round-trips byte-equal; Phase B the REAL keyboard Tab drive
  through the signin card — the chains STRUCTURALLY IDENTICAL through
  the card (7 stops: the google button → `email#email` →
  `password#password` → Sign in → Forgot password? → Need an account?;
  the 7th stop's escape differs only in the landing target — ours
  body, the reference its own platform badge-close button, the s149
  platform-pill genus) + the REAL :focus-visible faces — the email
  input's ring byte-equal on the VISIBLE layers (white 2px +
  slate-400 4px both apps), the google button byte-equal (the UA
  default); Phase C the view-flip draft decode [OURS KEEPS the typed
  email across the reset flip + the back flip — the reference CLEARS
  it; the KEPT house superset — the reference's clear-on-flip loses a
  typed email on an in-place flip, its own defect, never mirrored];
  the sent-view ride write-free [the nonexistent-email
  forgot-password POST, the no-enumeration 200 family — the
  reference's own forgot-password is client-side theater, never a
  network call]; Phase D the phone axes byte-equal; Phase E the FAQ
  single-open ride [Q1 open by default + the Q2/Q3 rides flip the
  single open item + the chevron rotate-180 byte-equal + the section
  `1440x677` + the max-w-3xl container byte-equal; OURS the
  aria-expanded a11y superset — the standing s142 DEVIATION pin,
  KEPT]; Phase F the mobile disclosure menu ride @390 [the hamburger
  `342,16 32x32` + the OPEN panel `0,64 390x229` + the 6-link
  vocabulary + the menu-x icon swap + the re-toggle close — all
  byte-equal]; Phase G the CTA faces [the hero pair + the pricing tier
  buttons byte-equal modulo the brand-token genus — the reference's
  `rgb(36,99,235)` vs ours the working blue `rgb(37,99,235)`].

- **THE LIVE FINDS — THREE cured**: **D-192a1 THE SIGNUP VIEW'S
  CONFIRM INPUT LITERAL ID**: the reference's confirm carries
  `id="confirmPassword"` + `for="confirmPassword"` (live-walked on its
  DOM); ours shipped the kebab-case `id="confirm-password"`. THE CURE:
  the literal id restored (matching the reset-password page's own
  confirmPassword family). **D-192a2 THE RESET VIEW'S EMAIL INPUT
  LITERAL ID**: the reference's reset view carries the bare literal
  `id="email"` + `for="email"`; ours shipped `id="reset-email"`. THE
  CURE: the bare literal restored (the views never render
  simultaneously, no collision with the signin view's own
  `id="email"`). **D-192a3 THE AUTH-CARD DARK SUBMITS' REAL
  FOCUS-VISIBLE RING**: the reference's stock dark submits focus to
  the near-black `--ring` token (`rgb(9,9,11)` over the white 2px
  offset — live-walked on the signin/signup/reset submits' REAL
  keyboard faces via walk65 Phase B +
  `scripts/micro-probe-192-submit-faces.ts`); ours shipped
  `ring-slate-400` (the s10-era authoring assumption, never
  live-probed on the submit). THE CURE:
  `focus-visible:ring-slate-400` → `focus-visible:ring-ring` at all
  four dark-submit sites (LOGIN_LAYOUT.submit + the
  LOGIN_RESET_LAYOUT.send + the LOGIN_SIGNUP_LAYOUT.submit + the
  LOGIN_VERIFY_LAYOUT.submit — the verify arm write-gated, its cure
  rides the family doctrine); the INPUTS' slate-400 rings byte-equal
  and STAY. The re-walk PROVES the id/for ledger deltas GONE + the
  submit's REAL ring now the reference's family (`rgb(10,10,10)` vs
  `rgb(9,9,11)` — the documented 1-unit L-126c6 residue). Every
  remaining delta a documented genus (the box-shadow SLOT-COUNT with
  every VISIBLE layer byte-equal · the outline VERSION FORM · the
  oklab/rgba serialization noise [s126] · the zinc-vs-neutral residue
  [L-126c6] · the class-order genus · the text-card-foreground token
  genus · OUR aria-hidden superset [the s19 family, KEPT] · the
  brand-mark logo genus [the reference's `<img>` brand asset vs ours
  the CSS-built mark] · the lucide svg-internal path-order genus ·
  the v3-semantics `[&>*+*]:mt-1.5` vs `space-y-1.5` lineage
  [computed-equal] · the stock-label inert-arms genus · the body-bg
  invisible axis [the F-119c2/L-126c5 doctrine] · the reference's
  base44 platform artifacts [the badge-close button — never
  mirrored]).

- **THE TDD LEDGER**: the pin survey first (the s11/s21/s79/s111
  login pin families + the s142 landing pins + the walk53-64 decode
  freezes), then the battery: 3 born-green pins in the page-layout
  suite (the walk65 decode freeze · the LOGIN open-interior
  construction freeze — the genuine battery gap: the s11/s21/s79/s111
  pins hold OUR wiring regexes + the computed-style contracts, never
  the call-site chains · the LANDING marketing-arms construction
  freeze — the same gap) + THE THREE CURE PINS (RED-first: **exactly
  3 RED at birth** → the cures → GREEN) + the collateral re-anchors
  (the s79 login-family-parity submit/send ring pins + the s11
  login-reset send record — `ring-slate-400` → `ring-ring` in the
  same commit as the cure).

- **MUTATION-PROOF**: the `id="confirmPassword"` regression replanted
  → exactly 1 RED → restored → GREEN, no residual. **STASH-PROOF**: the
  round's page-layout block stashed → exactly **138/2795** (the s191
  ship state) → restored → 138/2801 — no undercount this round.

- **THE COUNT LADDER**: 2795 → **2801** (+6 — 3 the walk65 freezes +
  3 the cure pins) · SUITES 138 HELD · E2E 192 re-verified (the
  round's product-code touch: login-card.tsx + page-layout.ts +
  login-reset.ts — all string swaps, zero line-count changes) · badge
  2987 → **2993** (the unit+e2e arithmetic: 2801+192) +
  skill-head-192.py (the SKILL **v1.189.0**, the s191 layer demoted at
  its ship counts 2795/192, the s192 layer live, idempotent — the
  head surgery BEFORE the ladder, the retired s191 ship line PINNED
  by the generalized D-188a1 doctrine's next member in docs-counts) +
  count-ladder-192.py (assert-first, idempotent). The docs lockstep
  (the AGENTS Session-192 section · the PAD session-192 inventory row
  · the CLAUDE page-layout bullet's walk65 tail · the README Tested
  row's walk65 clause + the badge · session_406.md + the plan's
  execution record + the worklog entry [Task ID 192]).

The operator's round-shaped asks all verified standing: the `.env`
DATABASE_URL `file:../db/custom.db` with the `db/` folder at the repo
root (census MATCH at `<repo>/db/custom.db`) · the vitest + playwright
config files verified standing (138/2801 unit + the 192-check e2e
battery re-verified this session) · the sitemap + SEO surface
re-verified (the 11-route sitemap.xml + robots.txt with its Sitemap
line + the installable manifest.json — smoke check 12 carries the
200s) · the mobile-nav comparison re-verified (probe:ref TRUE-390
STANDING — the reference's own menu button live; OURS the Radix Sheet
superset) · **the Tailwind v4 state — the walk65 decode CLEAN on
every arm** (every delta root-caused against the standing genus
register; the v3-semantics lineage [s11/s96/s98/s123/M-92c1/D-187a3]
re-checked at the login card's space-y arms + the landing's marketing
stacks — all byte-equal) · the `.env.example` verified against the
six-knob contract and included in this round's commit.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2801** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **192/192** · db
census MATCH · probe:ref STABLE · the four login views + both landing
arms byte-equal on both axes (post-cure) · the REAL Tab chains
structurally identical (7 stops both) · the select rides + the
conditional-Name appearance byte-equal · the captures: the round's
ours+ref faces.

### Session-193 — THE MARKETING-INTERIOR ARMS (walk66) (2026-10-27)

The post-192 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`5aa406a` — the session_406/407 transcripts, the s192 round's
own execution record). The s406 close's named suspended candidates are
ALL conditional, and the discovery (`scripts/discover-193.ts`)
re-checked every leg: the reference's zero-data state persists (the
Edit-family census rows=1 the empty-state row alone, rowMenus=0 — the
discover-184..193 standing census), the topbar-search dropdown still
`populated=0` on both (the s32 dead-stub doctrine stands), the
dashboard follow-up-rows checkbox arms + the activities Completed-tab
row actions stay KILLED at the reference's empty panels; probe:ref
STABLE (`46bc2d9c`) kills the fresh-bundle candidate, the registry's
`latest` 3.10.1 (verified live) kills the recharts 4.0 gate. The
round material = the s406 close's own naming: **the /ABOUT + /CONTACT
AUTHENTICATED INTERIORS' INTERACTIVE ARMS** (the marketing pair inside
the AppShell chrome — censused at s142, the guest funnel walked at
s144, the 156-c interior-census legs holding the mainH geometry, the
sweep holding the pixels — never walked at the walk53-65 OPEN-LEDGER
level: no DFS ledger, no anchor inventory, no REAL keyboard Tab
chain, no REAL :focus-visible face, no link-ride decode; the family 48
sessions stale) — LIVE on BOTH apps, byte-equal at the census level.

The baseline gate GREEN at the exact s192 ship state (the fresh clone
at `5aa406a`, tree clean): lint 0/0 · tsc 0 · **138/2801** unit ·
build (the type-gate artifact) · smoke **14/14** · e2e **192/192**
(clean first run, 5.6m — after the fresh-sandbox playwright
chromium-1248 install) · probe:ref STABLE · db census MATCH
(15/24/10/23/12 + 4 users at `<repo>/db/custom.db`, the ambient
`DATABASE_URL` shadow scrubbed with `env -u` on every DB-touching
command — the F-123a1 doctrine) · sitemap 11 routes + robots +
manifest 200 (smoke check 12).

THE WALK (`scripts/walk66-marketing-interior-arms.ts`, the walk61/65
multi-arm form over the TWO pages at BOTH axes on the sweep-state
pair — the authenticated battery): Phase A per page the OPEN census —
the main roots byte-equal at 256,69 1184x831 + els 46/46 (about) +
33/33 (contact) + the h1 faces + the h2 vocabularies + the FULL
anchor inventories (every href/target/rel byte-equal — the
Get-in-touch link → /Contact, the mailto:hello@example.com, the
LinkedIn/X/GitHub trio target=_blank rel="noopener noreferrer") + the
footer pair + the 256px 8-link nav; Phase B the REAL keyboard Tab
drive through /about — the chains STRUCTURALLY IDENTICAL at **15
stops both** (the 8 sidebar links → the search input → Messages →
Notifications → the account trigger → the Get-in-touch anchor → the
footer pair; the REF's chain adds only the 16th stop — its base44
badge-close button, the s149 platform-pill genus, never mirrored) +
the REAL :focus-visible faces at the six geometry-keyed stops; Phase C
the link rides write-free (the Get-in-touch round-trip /about→
/contact + the footer rides — byte-equal landings both apps); Phase D
the phone axes byte-equal (the main 0,69 390x775 + the h1 16,117
358x36 + the drawer triggers 16,16 36x36 aria="Open navigation" + the
footer stacks); the EXTERNAL navigations NEVER fired (the mailto/
social rides stay census-only).

**TWO LIVE FINDS — ONE CURED, ONE PINNED:**

**D-193a1 THE BASE LAYER'S UNIVERSAL OUTLINE-COLOR RULE (CURED)** —
the alpha-color carrier family's PAINTING member. The walk53/61
resting faces had decoded OURS currentColor/adaptive near-black vs
the reference's fixed rgba(10,10,10,0.5) with outline-style none
(zero pixels — the documented genus); the walk66 FOCUS faces found
the same carrier PAINTING (1px auto) on the marketing anchors —
near-black OPAQUE rgb(16,16,16) vs the reference's authored 50% ring
— and the micro-probe (`scripts/micro-probe-193-outline-carrier.ts`)
root-caused it via the CSSOM walk: the reference's compiled base
carries `* { border-color: hsl(var(--border)); outline-color:
hsl(var(--ring) / .5); }` — the shadcn base template's universal
line; OURS carried only the border-color half (the s7 base import).
THE CURE: the outline-color half added at the same `*` rule —
`color-mix(in oklab, var(--color-ring) 50%, transparent)`, the v4
idiom over our `--color-ring` #0a0a0a, resolving to the same 50%
near-black. The re-walk PROVES every outline-color now the
reference's family (OURS the oklab serialization `oklab(0.144787
0.00000661612 0.00000289828 / 0.5)`, the REF rgba(10,10,10,0.5) —
the same color in the two forms, the s126 noise genus; every authored
focus face unaffected — outline-style none on both).

**D-193a2 THE SIDEBAR LINKS' REAL FOCUS-VISIBLE RING (the KEPT
SUPERSET, PINNED)** — OURS paints `focus-visible:ring-2
focus-visible:ring-white/50` (the oklab white/50 2px shadow carrier)
at every sidebar stop; the reference ships NO authored focus face on
its sidebar links — the bare UA outline (1px auto rgba(10,10,10,0.5)),
its own keyboard-focus-gap family (the D-112a2 doctrine), never
mirrored. The construction dates to session-7 with its "deliberate
a11y superset" comment, was re-verified INVISIBLE at the s177 walk50
resting face, had never been walk-proven at the REAL keyboard face,
and carried ZERO test teeth until this round's pin (sidebar.tsx +
mobile-nav.tsx — both navs in lockstep under the freeze).

Every remaining delta a documented genus: the token-selection
bg-background/bg-gray-50 pair (computed-equal #f9fafb — the M-81c2
family) · the box-shadow SLOT-COUNT (every VISIBLE layer byte-equal —
the s129 doctrine) · the outline VERSION FORM + both sub-forms (1px
none vs 2px solid transparent — zero visible pixels both, the walk51
decode) · OUR aria-hidden svg superset (the s19 family, KEPT) · OUR
aria-label superset on the topbar arms (the s88-c9 family, KEPT) ·
the reference's platform badge-close 16th Tab stop (the s149 genus,
never mirrored).

THE TDD LEDGER: the pin survey first (the s142 landing pins + the
NAV_LAYOUT pins + the s177 drawer pins), then the battery — 3
born-green pins in page-layout (the walk66 decode freeze + the
MARKETING open-interior construction freeze [the genuine battery gap:
the s142 pins hold the LANDING page's strings, never the about/
contact call-site chains] + the SIDEBAR ring construction freeze
[the same gap: the ring-white/50 construction at BOTH nav sites
carried zero test teeth]) + THE D-193a1 CURE PIN in design-tokens
(RED-first: exactly 1 RED at birth → the cure → GREEN — the
globals.css base-layer contract, the windowed-slice form: the rule's
own comment quotes the reference's closing brace, so a rule-body
regex would stop inside it). MUTATION-PROOF (the planted
outline-color regression 50%→90% → exactly 1 RED → restored → GREEN,
no residual; the planted sidebar ring regression white/50→white/40 →
exactly 1 RED → restored → GREEN — both pins' unique teeth proven) ·
STASH-PROOF (the round's test blocks stashed → exactly 138/2801
checks [the s192 ship state] with the 2 line-census collateral pins
reading the CURED globals.css against the stale docs rows [the
same-commit docs-lockstep dependency — the PAD §11 row + the SKILL
census site re-anchored 430→442 in this round's commit, the s168
line-census doctrine] → restored → **138/2805** — the TRUE count
verified at the full-suite count, no undercount).

The count ladder 2801 → **2805** (+4: 3 the walk66 freezes + 1 the
cure pin) · SUITES 138 HELD · E2E 192 re-verified (the round's
product-code touch: globals.css +12 lines — the PAD/SKILL line-census
rows re-anchored) · badge 2993 → **2997** (the unit+e2e arithmetic:
2805+192) + skill-head-193.py (the SKILL **v1.190.0**, the s192 layer
demoted at its ship counts 2801/192, the s193 layer live, idempotent
— the head surgery BEFORE the ladder, the retired s192 ship line
PINNED by the generalized D-188a1 doctrine's next member in
docs-counts) + count-ladder-193.py (assert-first, idempotent — 21
flips). The docs lockstep (the AGENTS Session-193 section · the PAD
session-193 inventory row · the CLAUDE page-layout bullet's walk66
tail · the README Tested row's walk66 clause + the badge ·
session_408.md + the plan's execution record + the worklog entry
[Task ID 193]).

The operator's round-shaped asks all verified standing: the `.env`
DATABASE_URL `file:../db/custom.db` with the `db/` folder at the repo
root (census MATCH at `<repo>/db/custom.db`) · the vitest + playwright
config files verified standing (138/2805 unit + the 192-check e2e
battery re-verified this session) · the sitemap + SEO surface
re-verified (the 11-route sitemap.xml + robots.txt with its Sitemap
line + the installable manifest.json — smoke check 12 carries the
200s) · the mobile-nav comparison re-verified (probe:ref TRUE-390
STANDING — the reference's own menu button live; OURS the Radix Sheet
superset) · **the Tailwind v4 state — the walk66 decode CLEAN on
every arm** (every delta root-caused against the standing genus
register; the v3-semantics lineage re-checked at the marketing
stacks — all byte-equal) · the `.env.example` verified against the
six-knob contract and included in this round's commit.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2805** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **192/192** · db
census MATCH · probe:ref STABLE · the two marketing interiors
byte-equal on the census + the rides + the phone axes (post-cure) ·
the REAL Tab chains structurally identical (15 stops both + the
reference's platform badge) · the outline-color family now the
reference's authored 50% ring on every UA-outline face · the
captures: the round's ours+ref faces.

### Session-194 — THE 404 INTERIOR'S INTERACTIVE ARMS (walk67) (2026-10-27)

The post-193 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`8349d01` — the session_409 transcript, the s193 round's own
execution record). The s408 close's named suspended candidates are ALL
conditional, and the discovery (`scripts/discover-194.ts`) re-checked
every leg: the reference's zero-data state persists (the Edit-family
census rows=1 the empty-state row alone, rowMenus=0 — the
discover-184..194 standing census), the topbar-search dropdown still
`populated=0` on both (the s32 dead-stub doctrine stands), the
dashboard follow-up-rows checkbox arms + the activities Completed-tab
row actions stay KILLED at the reference's empty panels; probe:ref
STABLE (`46bc2d9c`) kills the fresh-bundle candidate, the registry's
`latest` 3.10.1 (verified live) kills the recharts 4.0 gate. The
round material = the s408 close's own naming: **THE 404 INTERIOR'S
INTERACTIVE ARMS** (the error-boundary pair OUR-ONLY — the s170
scandihaven ports, source-pinned; the reference cannot be
crash-walked; the 404 LIVE on BOTH apps) — the designed 404 view the
s12 construction built (NOT_FOUND_LAYOUT + the crm.spec render test
hold the strings) but NEVER walked at the walk53-66 OPEN-LEDGER
level, 180+ sessions stale against the reference's CURRENT build.

The baseline gate GREEN at the exact s193 ship state (the pull to
`8349d01`, tree clean): lint 0/0 · tsc 0 · **138/2805** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **192/192** (clean
first run, 5.7m) · probe:ref STABLE · db census MATCH (15/24/10/23/12
+ 4 users at `<repo>/db/custom.db`, the ambient `DATABASE_URL` shadow
scrubbed with `env -u` on every DB-touching command — the F-123a1
doctrine) · sitemap 11 routes + robots + manifest 200 (smoke check
12).

THE WALK (`scripts/walk67-404-interior-arms.ts`, the walk66 form over
the ONE surface at BOTH contexts on the sweep-state pair + fresh anon
contexts): Phase A the OPEN census at 1440×900 — the DFS ledger from
the min-h-screen page root (the platform artifacts excluded, the s149
doctrine) + the h1/h2/p/span faces + the Go Home arm inventory + the
glyph decode + the title + the http status; Phase B the REAL keyboard
Tab drive — OURS 2 stops, the REF 3 with its platform badge-close
(the s149 genus) + the REAL :focus-visible face at the Go Home stop;
Phase C the Go Home ride write-free — both apps land at the landing
`/` (the byte-equal h1 + CTA); Phase D the phone axes byte-equal
post-cure (card 24,278 342x288 + h1 24,278 342x72 + arm 133,528
123x38 + span 106,431 103x19); Phase E the anon posture census —
OURS the 404 at the unknown URL (http 404) vs the REF the redirect to
`/login?from_url=<absolute-url>` (the genus decode, never fixed); the
destructive arms NEVER fired.

**FIVE FINDS — THREE CURED, TWO PINNED:**

**D-194a1 THE QUOTED-PATHNAME FORM (CURED)** — OURS interpolated
`usePathname()` verbatim: `The page "/x" could not be found…` (the
LEADING SLASH inside the quotes; the span 601,459 108x19); the
reference interpolates its router path WITHOUT it: `The page "x" …`
(the span 604,459 103x19). THE CURE:
`pathname.replace(/^\//, "")` at the interpolation — the deep-path
form "/a/b" → "a/b" matches the reference's router path on both; the
crm.spec e2e string re-anchored in the same commit.

**D-194a3 THE GO HOME GLYPH (CURED)** — the M-82c2 icon-identity
family's first CROSS-LIBRARY member (the D-186a1 pen-cure precedent):
OURS shipped lucide `house` (2 paths — the house + the door;
stroke-width 2; the `lucide lucide-house` class prefix; the
width/height attrs); the reference ships the HEROICONS home outline
(exactly ONE path, NO stroke-width attr → computed weight 1, NO
width/height attrs, the bare `w-4 h-4 mr-2` class) — its 404 view's
platform-template origin, the one non-lucide icon family in its tree.
THE CURE: the reference's exact svg inlined at the Go Home site (the
lucide Home import retired there; OUR aria-hidden kept — the s19
superset family); the `NOT_FOUND_LAYOUT.homeIcon` pin re-anchored
h-4 w-4 → w-4 h-4 (the reference's exact class order).

**D-194a4 THE 404 TITLE (CURED)** — OURS shipped the s12 absolute
title `This Page Does Not Exist | NEO CRM` (decoded from the
reference's PRE-DRIFT build, 180+ sessions and every bundle rotation
ago); the CURRENT reference ships bare `NEO CRM` (live-verified at
BOTH contexts, 3s settles — and the title machinery byte-equal on
every real route: both ship bare `NEO CRM` on /dashboard, `Accounts |
NEO CRM` on /accounts, `About | NEO CRM` on /about — the s10/s13 pins
stand; only the 404 differed). THE CURE: the metadata export retired
in `not-found.tsx` — the root layout's `title.default "NEO CRM"`
renders, byte-equal.

**D-194a2 THE GO HOME TAG (the KEPT SUPERSET, PINNED)** — OURS
renders `<Link href="/">` (an anchor — role=link, the href
affordances, the WCAG-correct link semantics for a navigation
affordance); the reference renders a `<button>` with NO href (its SPA
JS-router idiom). Every VISIBLE layer byte-equal (box 658,556 123x38
· color · bg · border · radius · font · padding) and the rides
byte-equal (both land at the landing `/`) — the D-112a2
a11y-superset doctrine's next member; the reference's own gap never
mirrored; the construction carried ZERO test teeth on the TAG
identity until this round's freeze.

**D-194a5 THE ANON UNKNOWN-ROUTE POSTURE (the PLATFORM GENUS,
PINNED)** — the reference's auth-first client-router guard redirects
anon unknown-routes to `/login?from_url=<absolute-url>` (its designed
404 appears only PAST the guard — it never adjudicates routability
for anon visitors, everything anon → the wall; its SPA also never
ships a real HTTP 404 status at all — 200 everywhere); OURS renders
the designed 404 AT the unknown URL with the true HTTP 404
(routability adjudicated first — the route-group architecture: known
guarded routes → the wall; unknown routes → the 404,
session-independent). The reference's posture is its SPA platform
artifact (the s149 family) — never mirrored; the no-session-check
construction PINNED.

Every remaining walk67 delta a documented genus: the outline-color
serialization (oklab vs rgba — the s126 noise genus, the D-193a1
cure's own family, zero visible pixels) · the box-shadow SLOT-COUNT
(every VISIBLE layer byte-equal — white 2px + slate-500 4px, the
s129 doctrine) · the outline VERSION FORM (ours v4 1px none vs the
reference's v3-era 2px solid transparent — zero visible pixels both,
the walk51 decode) · the reference's platform badge-close Tab stop
(the s149 genus, never mirrored) · OUR aria-hidden superset (the s19
family, KEPT) · the p text-node-split artifact (the p's full text
content + the p/span boxes byte-equal — zero visible delta).

THE TDD LEDGER: the pin survey first (the s12 NOT_FOUND_LAYOUT pins +
the route-case capital-404 pins), then the battery — 3 RED-first CURE
PINS (D-194a1 the interpolation tail — the windowed form: the file's
own docstring quotes the bare expression, so the pin guards the
`}&quot;` interpolation tail only the construction carries · D-194a3
the glyph construction + the no-stroke-width negatives + the
homeIcon class-order · D-194a4 the metadata-export negatives — the
windowed form: the file's own comment quotes the retired title as
decode history, so the pin guards the construction, never the prose)
+ 3 born-green freezes (the walk67 decode freeze + the 404
open-interior construction freeze [the genuine battery gap: the s12
pins hold the constant strings, never the call-site chains] + the
D-194a5 ANON-posture construction freeze). MUTATION-PROOF (the
planted strip regression → 2 RED [the D-194a1 pin + the construction
freeze's designed overlap — both hold the interpolation chain] →
restored → GREEN · the planted stroke-width regression → exactly 1
RED → restored → GREEN · the planted metadata-export regression →
exactly 1 RED → restored → GREEN · the planted button-tag regression
→ exactly 1 RED [the construction freeze's anchor teeth] → restored
→ GREEN · the planted session-redirect regression → exactly 1 RED →
restored → GREEN — every pin's unique teeth proven) · STASH-PROOF
(the round's test block stashed → exactly **138/2805** checks [the
s193 ship state], ZERO collateral this round [the PAD §11 row + the
SKILL §5.6 census site re-anchored 1718→1725 / 277→283 checks in the
same stroke, the s168 line-census doctrine] → restored →
**138/2811** — the TRUE count verified at the full-suite count, no
undercount).

The count ladder 2805 → **2811** (+6: 3 the cure pins + 3 the
freezes) · SUITES 138 HELD · E2E 192 re-verified (the round's
product-code touch: not-found.tsx + not-found-body.tsx +
page-layout.ts +7 lines — the PAD/SKILL line-census rows
re-anchored) · badge 2997 → **3003** (the unit+e2e arithmetic:
2811+192) + skill-head-194.py (the SKILL **v1.191.0**, the s193 layer
demoted at its ship counts 2805/192, the s194 layer live, idempotent
— the head surgery BEFORE the ladder, the retired s193 ship line
PINNED by the generalized D-188a1 doctrine's next member in
docs-counts) + count-ladder-194.py (assert-first, idempotent — 17
flips). The docs lockstep (the AGENTS Session-194 section · the PAD
session-194 inventory row + the §708/§1321 404 census rows
re-anchored · the CLAUDE page-layout bullet's walk67 tail · the
README Tested row's walk67 clause + the badge · the SKILL §"The
custom 404" census site re-anchored · session_410.md + the plan's
execution record + the worklog entry [Task ID 194]).

The operator's round-shaped asks all verified standing: the `.env`
DATABASE_URL `file:../db/custom.db` with the `db/` folder at the repo
root (census MATCH at `<repo>/db/custom.db`) · the vitest +
playwright config files verified standing (138/2811 unit + the
192-check e2e battery re-verified this session) · the sitemap + SEO
surface re-verified (the 11-route sitemap.xml + robots.txt with its
Sitemap line + the installable manifest.json — smoke check 12
carries the 200s) · the mobile-nav comparison re-verified (probe:ref
TRUE-390 STANDING — the reference's own menu button live; OURS the
Radix Sheet superset) · **the Tailwind v4 state — the walk67 decode
CLEAN on every arm** (every delta root-caused against the standing
genus register; the 404's space-y-2/3/6 stacks — the family's home
turf — re-decoded live, byte-equal) · the `.env.example` verified
against the six-knob contract and included in the round's commit.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2811** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **192/192** · db
census MATCH · probe:ref STABLE · the 404 interior byte-equal on the
census + the ride + the phone axes (post-cure) · the REAL Tab chains
structurally identical (2/3 stops — the REF's platform badge the
difference) · the re-walk STABLE (43→23 deltas, every residual a
documented genus or pinned superset) · the captures: the round's
ours+ref faces.

### Session-195 — THE 404 GATE-COVERAGE PINS (2026-10-28)

The post-194 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`facdd56` — the session_411 transcript, the s194 round's own
execution record). The round is the TWO-SKILL AUDIT round: the
`skills/web-application` SKILL.md v1.2.0 rubric applied over the
s193/s194 product-code changes (not-found.tsx · not-found-body.tsx ·
page-layout.ts · globals.css · the error boundaries) AND the
operator's named standing surfaces (the mobile navigation · the
Tailwind v4 setup · the vitest/playwright configs · the sitemap/SEO
surfaces · the env contract) — the audit disposition **0 CRITICAL /
0 HIGH / 0 MEDIUM / 5 LOW / 5 INFORMATIONAL**, every finding
triaged under the parity doctrine (the documented-genera and
pinned-superset families are never "fixed"; the declined items are
recorded considered-and-declined in the plan with their rationale:
the sitemap's `/login`+`/signup` omission [byte-verified reference
parity, double test-pinned] · the shell root's `h-screen`
[reference-parity pinned] · the `bg-gradient-to-*` v3 alias spelling
[compiles identically in v4] · the boundaries' omitted console.error
[the leak posture correct — only the digest rendered] · the
probe-script knobs outside `.env.example` [tooling, not the app
contract] · the robots allow-all [byte-verified parity] · the
nav-landmark shape [the documented per-family contract]).

The baseline gate GREEN at the exact s194 ship state (the clone to
`facdd56`, tree clean): lint 0/0 · tsc 0 · **138/2811** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **192/192** (clean
first run, 5.7m — the fresh-sandbox Playwright chromium install an
environment gap, never source debt) · probe:ref STABLE
(`46bc2d9c` — the bundle md5 unchanged, the demo data still ZERO,
the desktop census 256px/8 links STANDING, the TRUE-390 census
STANDING with the reference's own 1 menu button, the landing census
STANDING) · db census MATCH (15/24/10/23/12 + 4 users at
`<repo>/db/custom.db`) · sitemap 11 routes + robots + manifest 200
(smoke check 12) · the sweeps CLEAN (desktop + TRUE-390 + the
interior census, baselines held, seed restored).

**THREE CURES — the gate-teeth round** (the round's material was
the GATE TEETH, not the product — every shipped s193/s194 change
verified clean on every rubric axis):

- **D-195a1 — THE TRUE-HTTP-404 WIRE FREEZE** (Audit A L-1): the
  D-194a5 ship claim — OURS renders the designed 404 AT the unknown
  URL with the TRUE HTTP 404 — carried ZERO gate teeth (the e2e
  render test's `page.goto()` tolerates any status, no smoke leg
  hits an unknown route, the unit posture pin source-string only; a
  future catch-all route would have kept every gate green while
  falsifying the contract). THE CURE: the response status asserted
  inside the existing S12-P2 e2e test — `page.goto`'s response +
  the authenticated `request.get` arm (the both-contexts census
  form). Born-green (the s194 doctrine for a genuine battery gap).
  MUTATION-PROVEN: the planted `[...catchall]/page.tsx` redirect
  flipped the pin RED exactly at the status line (Expected 404 /
  Received 200) — the shape every visibility pin survives — then
  restored GREEN; the in-boundary `redirect()` mutation found the
  404 status ALREADY committed at the render (the audit's L-1
  adjudicated at the catch-all shape).
- **D-195a2 — THE TWO-GATE'S 404 REGISTRATIONS** (Audit A L-2): the
  one anon-reachable page the 31-registration register never
  adjudicated (its display heading ≈1.42:1 — pure reference
  parity). THE CURE: +2 EXPLICIT registrations (desktop 1280×800 +
  phone 390×844, the anon-surface form — the 404 is
  session-independent by design, D-194a5) + the sanctioned
  color-contrast matcher with its citation (the navy-chip
  precedent's exact form; the axe target form the BARE `h1` selector
  — the surface's only h1, the s171 substring-match doctrine; the
  class arm held for the selector form). GATE 1 structural ZERO at
  both widths (the D-194a2 Link superset's named arm live).
  MUTATION-PROVEN: the neutralized matcher arms tripped GATE 2
  exactly once per registration ("cites no sanctioned matcher"),
  then restored GREEN.
- **D-195a3 — THE CHILD-ENV KILL-SWITCH SCRUBBING** (Audit B L-2):
  the playwright webServer's `...process.env` spread would let a
  polluted parent shell's `NEO_DISABLE_IN_APP_OTP`/`RESET` silently
  hide the OTP/reset payloads the ladder tests assert (the N-69a
  dev-server-lies family on the env axis). THE CURE: both pinned to
  the empty string in the child env beside `DATABASE_URL`/
  `AUTH_SECRET` — deterministic e2e regardless of shell state, no
  existing pin weakened.

- **D-195a4 — THE STARVED-READ FLAKE HARDENING** (the final-gate
  catch): the final full-battery gate caught the settings Defaults-tab
  geometry test RED twice in a row (the s164 starved-read class: the
  visibility pre-waits green, the bare boundingBox() read null — a
  re-render falling between the two reads), then four clean isolation
  runs confirmed the flake window rather than a regression. THE CURE:
  the house expect.poll idiom (the s15 New Lead hardening, the s28
  zoom-in-95 precedent) applied to the box reads themselves — the
  geometry poll retries until BOTH boxes resolve with the vertical
  order intact, the assertion semantics unchanged, no pin weakened.

The operator's round-shaped asks all verified standing: the `.env`
DATABASE_URL `file:../db/custom.db` with the `db/` folder at the
repo root (census MATCH at `<repo>/db/custom.db`) · the vitest +
playwright config files verified standing (138/2811 unit + the
**194-check** e2e battery this round's own census) · the sitemap +
SEO surface re-verified (the 11-route sitemap.xml + robots.txt with
its Sitemap line + the installable manifest.json — smoke check 12
carries the 200s) · the mobile-nav comparison re-verified LIVE (the
reference's own login + dashboard + menu walked: the plain login
lands at `/` on BOTH apps — the from_url round-trip form; the
reference's drawer opened/rode; the VLM battery 3/3 "Structural
Differences: None" on the dashboard-desktop + dashboard-mobile-390
+ menu-open pairs — the sole residual the s149 platform badge
genus; OURS the Radix Sheet superset, the drawer opened/rode/closed
at 390×844 on the dev server — the link ride /Contacts lands, the
menu closes, the trigger re-collapses; the auto-close query holds
at 768px matching the `md:hidden` trigger) · **the Tailwind v4
state — the audit's zero-finding form** (all five §12 traps
mitigated: literal-hex `@theme`, no `tailwind.config.*`, the
vendored tw-animate, the `@utility` cascade law, the
`--shadow-sm`/`--blur-sm` re-pins) · the `.env.example` verified
bidirectional (every knob consumed, every consumer documented) and
included in the round's commit.

**THE COUNT LADDER + THE LOCKSTEP**: E2E 192 → **194** (+2: the two
404 registrations) · SUITES 138 HELD · UNIT 2811 HELD · badge
3003 → **3005** (the unit+e2e arithmetic: 2811+194). skill-head-195.py
ran FIRST (the SKILL v1.192.0, the s194 layer comment-demoted at its
ship counts 2811/192, the s195 layer live at 2811/194, idempotent);
count-ladder-195.py (assert-first, idempotent, unique-anchor — 19
flips: the docs-counts E2E constant · the README badge + Tested
row + tree + commands · the AGENTS commands + gate-order · the
CLAUDE gate-order + commands + pyramid · the PAD tree + Total +
HEAD + checklist + commands · the SKILL commands + Appendix B e2e
total + wall-clock + the a11y row 31 → 33). The three test-side
re-anchors in the same stroke: the docs-counts layer-axis (first =
s195, second = s194) · the login-family negatives ladder (the
retired `**E2E (Playwright, 192 checks)**` joins its negatives, the
live positive re-anchored 194) · the PAD §11 a11y row's line census
407 → 436. The docs lockstep: this AGENTS Session-195 section ·
session_412.md · the PAD §7.1 s195 inventory row · the README
walk-contracts paragraph's s195 clause · the plan's execution
record · the worklog entry {Task ID 195}.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2811** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **194/194** (the
full battery, 5.8m) · db census MATCH · probe:ref STABLE · the
mobile-nav battery 10/10 · the a11y two-gate 33/33 · the VLM parity
battery 3/3 "Structural Differences: None" · the captures: the
round's ours-vs-ref dashboard pairs (desktop + 390 + the menu-open
state) + the dev-server set under `docs/screenshots/`.

### Session-196 — THE DRAWER-OPEN SPINE FREEZE (the re-walk staleness round) (2026-10-28)

The post-195 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`a3ac674` — the session_413 transcript, the s195 round's own
execution record). The round is the RE-WALK STALENESS LADDER — the
session_412 close's own naming ("the re-walk staleness ladder [the
walk50 drawer + the s144-era marketing exteriors] or the sweep-state's
own coverage audit"), adjudicated by `scripts/discover-196.ts` BEFORE
the plan: the standing data-gated re-checks ALL KILLED at the
reference's unchanged zero-data state (the Edit-family census rows=1
empty-state rows, rowMenus=0, the topbar-search populated=0 on both,
the dashboard checkbox arms + the activities Completed-tab empty —
the discover-184..196 standing census) · the conditional gates KILLED
(probe:ref STABLE at `46bc2d9c` kills the fresh-bundle re-derivation;
the registry's latest recharts 3.10.1 kills the 4.0 gate) · the
s144-era marketing exteriors posture byte-equal STANDING (the guest
/about + /About + /contact + /Contact login-wall on BOTH apps with the
identical from_url round-trip form, the landing funnel anchors +
rides identical — the s147 F-147c2 contract, 49 sessions later, no
walk material there).

THE RE-WALK (the walk50 re-run at the current tree, 19 sessions after
the s177 original): the verdict **STABLE — ZERO NEW DELTAS**. OURS 61
rows vs REF 53 (the 8 `span.truncate` label wrappers — the
s177-adjudicated KEPT superset, the row-count difference's own root
cause, standing); after spine alignment every disagreement maps to
the s177 adjudications: the s173/s177 **mb-0 cure holding** (the
header 80/80 · the h2 24,24 240×32 both · the nav 0,80 288×332 both ·
the footer 0,428 288×61 both — the post-cure spine byte-equal two-app)
· the genera standing (the `bg-sidebar` token vs the reference's
`bg-[#2563eb]` literal — computed-equal rgb(37,99,235) · the Close
button's stock-version class drift — both dead variants · lucide's
`aria-hidden` — the version genus · the React 19 `useId` format ·
the icon class order `h-5 w-5 shrink-0` · the nav `aria-label`s +
`aria-current` + the focus-visible ring — the KEPT supersets · the
lucide-users icon's internal child order — the same shapes in a
different DOM order, zero visual delta, lucide-react 0.525.0
unchanged since before s177 · the sr-only `<p>`'s y-delta 23-vs-32 —
the mb-0 cure's own mechanism fingerprint, zero visible pixels). The
19 sessions of changes since s177 — the s193a1 outline-color
base-layer rule included — introduced zero drift.

**ONE CURE — D-196a1 THE DRAWER-OPEN SPINE FREEZE** (the genuine
battery gap): the s177 spine cure + decode carried only SOURCE-STRING
pins (`MOBILE_NAV_SHEET.title`'s `mb-0` + the header literal in
`tests/page-layout.test.ts`), the 10-check e2e battery pinned
BEHAVIOR (the locks, the focus, the rides, the overflow), the a11y
gate violations, the sweeps the CLOSED pixels (the interior census
carries zero drawer-open runs — the s177 coverage-gap finding,
standing). The s177 defect's own shape — a computed-margin regression
(a Tailwind upgrade's space-y semantics, a base-layer margin rule, an
h2 line-height change) shifting the header 80→88 and cascading to
every link + the footer — would keep every gate green while
falsifying the walk50-verified contract. THE CURE: the born-green
e2e registration — the s195a1 wire-freeze doctrine's next member —
pinning the rendered drawer-open spine at the walk50 ledger's own
boxes at TRUE 390×844: the content 288×844 · the header 0,0 288×80
(the cure's own face) · the h2 24,24 240×32 · the nav 0,80 288×332 ·
the 7-link 12,80 264×44 with the 48px pitch · the footer 0,428
288×61 · the Close 256,16 16×16 — the expect.poll starved-read idiom
(s164 → s195a4) on the box reads. MUTATION-PROVEN: the planted `mb-2`
regression (the s177 defect's exact shape — the h2's `:where()`
margin re-entering the flex-column layout) → build → the pin RED
exactly at the header box (Expected 80 / Received 88) → restored →
GREEN, the tree clean.

**THE COUNT LADDER + THE LOCKSTEP**: E2E 194 → **195** (+1: the spine
registration) · the mobile-nav spec census 10 → **11**
(MOBILE_NAV_E2E re-anchored, the live-census pin) · SUITES 138 HELD ·
UNIT 2811 HELD · badge 3005 → **3006** (the unit+e2e arithmetic:
2811+195). skill-head-196.py ran FIRST (the SKILL v1.193.0, the s195
layer comment-demoted at its ship counts 2811/194, the s196 layer
live at 2811/195, idempotent); count-ladder-196.py (assert-first,
idempotent, unique-anchor — 28 flips: the docs-counts E2E + the
MOBILE_NAV_E2E constants · the README badge + Tested row + tree +
commands + the two 10-check mobile-nav sites · the AGENTS commands +
gate-order + the architecture-facts mobile-nav line · the CLAUDE
gate-order + commands + pyramid + the mobile-nav suite line · the PAD
tree + Total + HEAD + checklist + commands + the mobile-nav spec line
+ the §11 census-table row · the SKILL commands + Appendix B e2e
total + wall-clock + the mobile-nav spec line + the Bug #1 line + the
Appendix B mobile-nav row). The test-side re-anchors in the same
stroke: the docs-counts layer-axis (first = s196, second = s195 at
its ship 194) · the login-family negatives ladder (the retired
`**E2E (Playwright, 194 checks)**` joins its negatives, the live
positive re-anchored 195) · the s147-miscount 11-negatives RETIRED
(the 11-form is the live census now — the 10-check forms join the
negatives on both the docs-counts s165 block and the Appendix B row
negative, the s192 re-anchor doctrine) · the inventory-census
Bug #1 checks pin 10 → 11 + the PAD §11 line-census row 284 → 364.
The docs lockstep: this AGENTS Session-196 section · session_414.md ·
the PAD §7.1 s196 inventory row · the README walk-contracts
paragraph's s196 clause · the plan's execution record · the worklog
entry {Task ID 196}.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2811** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **195/195** · db
census MATCH · probe:ref STABLE · the mobile-nav battery 11/11 · the
captures: the round's drawer-open set (ours + the reference pair) +
the dev-server set under `docs/screenshots/`.

### Session-197 — THE SWEEP-STATE COVERAGE AUDIT (the 404 drift-gate registration) (2026-10-28)

The post-196 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`769ba13` — the session_415 transcript, the s196 round's own
execution record). The round is THE SWEEP-STATE'S OWN COVERAGE AUDIT —
the s412 close's OTHER named standing material ("the re-walk staleness
ladder … or the sweep-state's own coverage audit" — the drawer member
walked at s196, this round takes the other naming), adjudicated by
`scripts/discover-197.ts` BEFORE the plan with the s120-era
interactive-table candidate adjudicated in the same pass: the standing
data-gated re-checks ALL KILLED at the reference's unchanged zero-data
state (the Edit-family census rows=1 empty-state rows, rowMenus=0, the
topbar-search populated=0 on both, the dashboard checkbox arms + the
activities Completed-tab empty — the discover-184..197 standing
census) · the conditional gates KILLED (probe:ref STABLE at `46bc2d9c`
kills the fresh-bundle re-derivation; the registry's latest recharts
3.10.1 kills the 4.0 gate) · the s120-era interactive-table candidate
KILLED by evidence (the leads family source-frozen since s113 — 84
sessions; the deps frozen; the family's only computed-style change
vector since s120 the s193a1 outline-color rule, decoded + gated — a
re-walk re-derives the s196 verdict). THE COVERAGE AUDIT: the app's
renderable routes vs. the drift-gate inventories (the sweep PAGES 13 ·
the census 12+1 · the fullpage 1 = the landing only) — /signup +
/reset-password OURS-ONLY supersets outside the two-app sweep (the REF
has no such routes: its /signup renders its own 404, its
/reset-password a blank shell), THE 404 the only two-app-renderable
surface with ZERO drift-gate coverage, the D-197a1 maiden measuring
the pair byte-identical at all four bands (0.01/0.04/0.01/0.01
badge-closed — no genus at any band; the anon posture re-verified
STANDING: OURS the 404 at the unknown URL with the true 404, the REF
the wall redirect with the from_url round-trip).

**TWO CURES — the coverage round** (the round's material was the GATE
TEETH, not the product):

- **D-197a1 — THE 404 SWEEP REGISTRATION.** The designed 404 is the
  only two-app-renderable surface the drift-gate family did not carry:
  the s194 walk67 decoded its faces, the s195 pins hold its render +
  its TRUE-404 status + its a11y registrations — no gate held its
  PIXELS (a future pixel regression on the surface would have kept
  every gate green). THE CURE: the 404 joins the standing sweep — the
  14th PAGES entry `{ name: "not-found", path:
  "/no-such-sweep-route", waitFor: "heading-404" }` with the per-page
  capture-wait override (the bare 404 renders with NO main — the
  sweep's shell-wait soft-falls its full 15s burn per capture; the h1
  "404" heading is the content-wait anchor instead, present on BOTH
  apps' designed 404s) + the STANDING_BASELINES entries at all four
  bands (0.1 the family floor — the maiden measured
  0.01/0.04/0.01/0.01) + the sweep-tool pins (the PAGES census
  re-anchored 13 → 14 + the waitFor override pin + the not-found
  baselines pin). Born-green at all four bands (0.01-0.03% clean, the
  seed restored after every run). MUTATION-PROVEN ×2: the planted
  `text-8xl` h1 regression (the D-194a4 palette's own face) → the
  sweep DRIFT trip exactly at not-found (1.12% > baseline 0.1 +
  margin 0.5 = allowed 0.60%, exit 1) → restored → 0.01% clean; the
  removed desktop baseline → exactly 2 unit REDs (the new baselines
  pin + the standing coverage-loop pin), zero collateral → restored →
  GREEN.
- **D-197a2 — THE SWEEP HEADER'S OWN STALE PAGE CENSUS.** The
  s91-era count-anchored comments ("the ten pages") survived three
  page additions (s96/s142/s144) — and the s98 F-98a1 guard's own live
  face went stale WITH them, pinning the stale count as "the corrected
  phrasing" (the `toMatch(/ten pages|ten-page/)` assertion — the
  guard's teeth had been pointing at a corpse since s144). THE CURE:
  the sweep header + the suite's own two comments re-anchored to the
  count-proof NAME form ("the PAGES list" / "the full PAGES sweep" —
  a name never goes stale when a page joins); the F-98a1/N-97a1 guards
  re-anchored — the negatives grow the retired ten-forms (the s192
  doctrine: the OLD live form joins the negatives), the live faces
  move to the NAME form.

**DECLINED** (recorded considered-and-declined in the plan): the
census 404 registration (a third collector for one page — speculative
scaffolding; the element ledger walk-frozen + source-pinned) ·
/signup + /reset-password in the sweep (OURS-ONLY, e2e-pinned
already) · the s120-era re-walk (KILLED by the discovery evidence).

**THE COUNT LADDER + THE LOCKSTEP**: UNIT 2811 → **2813** (+2: the
waitFor pin + the baselines pin, the sweep-tool suite) · SUITES 138
HELD · E2E 195 HELD · badge 3006 → **3008** (the unit+e2e arithmetic:
2813+195). skill-head-197.py ran FIRST (the SKILL v1.194.0, the s196
layer comment-demoted at its ship counts 2811/195, the s197 layer
live at 2813/195 + the beneath-it tail, idempotent; the surgery's own
live catch: the H1 flip's bare-substring guard was fooled by the new
layer text mentioning "the SKILL v1.194.0" — the H1 flipped directly
+ the script hardened to the exact-H1 form); count-ladder-197.py
(assert-first, idempotent, unique-anchor — 18 flips: the docs-counts
UNIT constant · the README badge + Tested row + tree + commands ·
the AGENTS commands + gate-order · the CLAUDE gate-order + commands
+ pyramid + the coverage seam · the PAD tree + Total + HEAD +
checklist + commands · the SKILL commands + Appendix B unit total).
The test-side re-anchors in the same stroke: the docs-counts
layer-axis (first = s197 at 2813/195, second = s196 at its ship
2811/195) · the unit negatives ladder (the retired 2811 site-forms
join the negatives on the docs-counts s166 block) · the
dialog-geometry-parity F-92a3 ladder (the four CLAUDE live positives
re-anchored 2813 + the 2811 forms join the negatives). The docs
lockstep: this AGENTS Session-197 section · `docs/session_416.md` ·
the PAD §7.1 s197 inventory row · the README walk-contracts
paragraph's s197 clause · the plan's execution record · the worklog
entry {Task ID 197}.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2813** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **195/195** · the
not-found sweep leg GREEN at all four bands (`--fail-on-drift`: 0.01
desktop · 0.03 phone · 0.02 tablet · 0.02 landscape) · db census
MATCH · probe:ref STABLE · the captures: the round's 404 pair (ours +
the reference) + the dev-server set under `docs/screenshots/`.

### Session-198 — THE ADVISORIES RE-TRIAGE (the runtime-chain critical cured + the security-ledger lockstep) (2026-10-29)

The post-197 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`ba30355` — the session_417 transcript, the s197 round's own
execution record). The round is THE STANDING PRE-SHIP DUTY'S OWN
CATCH — the s164 `bun audit` doctrine ("re-run each pre-ship")
re-run live by `scripts/discover-198.ts` BEFORE the plan found the
advisories census DRIFTED: 9 → **12 (1 critical / 5 high / 4 moderate /
2 low)** — the repo's first CRITICAL on a RUNTIME dependency chain
(`jspdf@4.2.1`, the direct runtime dep behind the reports PDF export,
ships the optional `dompurify` at **3.4.16**, INSIDE the vulnerable
range `>=3.4.4 <=3.4.16` — critical GHSA-cg2g-xh64-v4q7 + high
GHSA-mrv2-3pqr-j5jr + low GHSA-c6gr-qvv4-5v3f). The
security-and-hardening triage ladder applied: "Is the vulnerable
function actually called in your code path?" — **NO** — dompurify
executes only inside jsPDF's `html()` plugin and `pdf-export.ts` never
calls `.html(` (grep-verified: DORMANT, shipped). The other discovery
legs: the standing data-gated re-checks ALL KILLED at the reference's
unchanged zero-data state (probe:ref STABLE at `46bc2d9c` — the demo
data still ZERO; the Edit-family census rows=1 empty-state rows,
rowMenus=0, the topbar-search populated=0 — the discover-184..198
standing census) · the conditional gates KILLED (probe:ref STABLE
kills the fresh-bundle re-derivation; the registry's latest recharts
3.10.1 kills the 4.0 gate) · the s120-era re-walk kill STANDING (the
leads family source-frozen since s113 — 85 sessions; the deps locked
at the s196 census; the bundle STABLE — the kill condition unmoved).

**TWO CURES — the security-ledger round** (the round's material was
the ADVISORIES LEDGER, not the pixels):

- **D-198a1 — THE RUNTIME CHAIN'S CRITICAL.** THE CURE: the 3.4.17
  transitive override (`overrides.dompurify` in package.json — the
  first update attempt's live catch: `bun update dompurify` hoisted
  the root while a NESTED `jspdf/dompurify@3.4.16` SURVIVED on disk,
  the failure mode that hardened the pin to scan EVERY resolution) +
  THE PINS (both in the pdf-export suite, the one-suite doctrine):
  the exhaustive lockfile pin (every `dompurify@x.y.z` resolution
  asserted outside the vulnerable range — RED-first at birth against
  the shipping 3.4.16 → the cure → GREEN) + the dormancy freeze
  (`pdf-export.ts` NEVER calls `.html(` — adopting jsPDF's html()
  plugin becomes a conscious act that trips the pin). MUTATION-PROVEN
  ×2: the lockfile flip → exactly 1 RED → restored → GREEN; the
  planted `.html(` call → exactly 1 RED → restored → GREEN. The
  post-cure audit: **9 advisories (4 high / 4 moderate / 1 low)** —
  the critical GONE, zero runtime chains, the documented posture
  restored at the tree level.
- **D-198a2 — THE SECURITY LEDGER'S OWN STALE CENSUS.** The PAD §10
  ledger row + the AGENTS gate-order note both carried the s164
  census verbatim — ZERO test teeth on either claim (the census went
  stale silently for 33 sessions). THE CURE: the PAD row rewritten at
  the live post-cure census (9: 4h/4m/1l — ALL dev-toolchain again:
  zod via eslint-config-next›eslint-plugin-react-hooks · deepmerge-ts
  via the prisma CLI · vite + launch-editor via vitest · source-map-js
  via postcss) + the dormancy decode carried in the row + the s198
  re-triage clause + the AGENTS note re-anchored + THE PINS (both in
  the docs-counts suite): the PAD-ledger pin (the live census + the
  re-triage record + the retired braces-composition negative) + the
  AGENTS-note pin (whitespace-normalized — the pin holds the content,
  never the wrap). MUTATION-PROVEN ×2: the stale re-plant → 1 RED
  each → restored → GREEN.

**DECLINED** (recorded considered-and-declined in the plan): the
dev-toolchain members' bumps (deepmerge-ts 8 · vite 8.3.3 · the
eslint-zod floor · source-map-js 1.2.2 — the s164 no-mid-rotation
TOOLCHAIN posture stands: every member build/lint/CLI-only, zero
runtime request-path) · the registry majors (lucide-react 1.63.0 vs
our 0.525 PARITY pin — the reference's own bundle-decoded version,
probe:ref STABLE re-verified; prisma 7.10.1 vs our 6.19.3; next 16.4.3
vs our 16.4.2; zustand 5.0.16 vs our 5.0.15 — their own rotations,
never mid-rotation, none carries an audit advisory on our locked
versions) · the e2e/a11y extensions for the advisories axis (no page
surface changed — the battery 195/195 + the four-band sweep are the
cure's inertness proof, not new coverage).

**THE COUNT LADDER + THE LOCKSTEP**: UNIT 2813 → **2817** (+4: the
lockfile pin + the dormancy pin in pdf-export · the PAD-ledger pin +
the AGENTS-note pin in docs-counts) · SUITES **138 HELD** (the
one-suite doctrine — both pin pairs ride EXISTING suites) · E2E 195
HELD · badge 3008 → **3012** (the unit+e2e arithmetic: 2817+195).
skill-head-198.py ran FIRST (the SKILL v1.195.0, the s197 layer
comment-demoted at its ship counts 2813/195, the s198 layer live at
2817/195 + the beneath-it tail, idempotent, the s197 exact-H1 guard
form); count-ladder-198.py (assert-first, idempotent, unique-anchor —
18 doc flips + the test-side re-anchors in the same stroke: the
docs-counts UNIT constant + the layer-axis [first = s198 at 2817/195,
second = s197 at its ship 2813/195] + the 2813 negatives joining the
s166 block + the dialog-geometry-parity F-92a3 ladder [the four CLAUDE
live positives re-anchored 2817 + the 2813 forms join the negatives]).
The docs lockstep: this AGENTS Session-198 section ·
`docs/session_418.md` · the PAD §7.1 s198 inventory row + the §10
ledger row (the D-198a2 cure site) · the README walk-contracts
paragraph's s198 clause · the plan's execution record · the worklog
entry {Task ID 198}.

**THE VERIFICATION**: lint 0/0 · tsc 0 · **138/2817** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **195/195** · the
four-band sweep GREEN (the cure's baseline-inertness proof — no
pixel-bearing surface touched) · `bun audit` post-cure (9, all
dev-toolchain, the documented posture restored) · db census MATCH ·
probe:ref STABLE · the captures: the reports pair (ours + the
reference — the PDF-export surface whose dependency chain carried
the critical) + the dev-server set under `docs/screenshots/`.
