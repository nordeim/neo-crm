---
IMPORTANT: File is read fresh for every conversation. Be brief and practical.
---

# NEO CRM

## Core Identity & Purpose

NEO CRM is a production-grade clone of the reference CRM workspace
(`https://neo-crm-8ab2c17c.base44.app/`) built as a single Next.js 16
application. It gives a small sales team everything the reference offers —
dashboard KPIs, pipeline analytics, accounts, contacts, leads, calendar,
activities, reports and settings — plus one deliberate upgrade: a fully
working mobile navigation drawer (the reference app leaves phone users
without navigation). Maintained by the repo owner (nordeim); agents work
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
   `bun run test` (1836) → `bun run build` → `bun run test:e2e` (132) — or the
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
- Hand-rolled validation (`asString` / `asNumber` / `asDate` / enum
  membership) at every route boundary — no schema library by design.
- Named exports for components; kebab-case files; `@/` path alias only.

### Language & Framework Guidelines

- **Next.js 16 App Router**: `params`/`cookies()`/`headers()` are async —
  always `await` them. Page files export only `default` + metadata/config
  exports. Route handlers export only HTTP verbs + route config.
- **TypeScript** strict (except `noImplicitAny: false`), `isolatedModules`,
  no `any` in new code.
- **Tailwind v4 CSS-first**: tokens are literal hex in `src/app/globals.css`
  `@theme`; custom utilities via `@utility`, never `@layer utilities`. The
  `hidden` HTML attribute overrides display utilities — never combine them.
- **Radix primitives** for dialogs/selects/popovers; `tw-animate-css`
  (vendored at `src/app/vendor/tw-animate.css`) drives `data-[state]`
  animations.
- **recharts** for charts — with recharts DEFAULTS (no custom tooltip
  content, no tick/grid style overrides) and the REAL chart at all-zero
  data (session-10 reversal: the session-1 ChartEmpty dashed placeholders
  are retired; the reference renders real charts in its persistent
  zero-data state).
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
| `bun run test`      | Vitest unit suites (1836 checks)            |
| `bun run test:e2e`  | Playwright E2E (132 checks, needs build first) |
| `bun run gate`      | The full gate in one command (lint → typecheck → test → build → e2e) |
| `bun run db:push`   | Push Prisma schema (no migrations folder)     |
| `bun run db:seed`   | Reseed demo data in place                     |
| `bun run db:census` | Print the resolved db path + counts vs the seed contract (session-53; the sanctioned census — see the anti-patterns) |

## Testing Strategy

### Test Pyramid

- **Unit (Vitest, 1836 checks)** — pure seams: `tests/db-path.test.ts`,
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
  login page's authenticated-redirect retirement),
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
  design-tokens `th, td { padding: 1px }` platform reset). Node
  environment; `@` alias resolved.
- **E2E (Playwright, 132 checks)** — `tests/e2e/`: `auth.spec.ts`
  (logged-out surface + session-11's login reset-password flow +
  session-21's in-place funnel: the Callout banner with zero toasts,
  the signup view swap + mismatch guard, the verify-email ladder +
  resend, the /signup superset page),
  `auth.setup.ts` (one real login, storageState saved),
  `crm.spec.ts` (authenticated golden path across all 9 pages + the
  session-10 per-page-titles and reports tab 2-4 structure tests, plus
  session-13's account-menu role=menu, reports-funnel bar-chart and
  by-type card structure tests),
  `mobile-navigation.spec.ts` (9-check regression suite for the drawer —
  pinned because the reference app ships NO mobile navigation; includes the
  resize-past-md lock-release regression and the session-12 focus-entry
  test), and session-12's custom-404 + session-15's entity-dialog geometry
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
  favicon link, robots.txt's Sitemap line, the nine-route sitemap.xml),
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
  pickup after the 500ms reload).

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
the seam (currently 1836).

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
  the group. `/login` and `/signup` sit outside it.
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
- Models: User, Account, Contact, Lead, Activity, Event, SavedReport,
  Setting (singleton row).

### Environment Variables

| Variable               | Purpose                                  | Example                       |
| ---------------------- | ---------------------------------------- | ----------------------------- |
| `DATABASE_URL`         | SQLite file URL, schema-relative         | `file:../db/custom.db`        |
| `AUTH_SECRET`          | HMAC secret for session cookies (≥16ch)  | `openssl rand -hex 32`        |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin — metadata, robots.txt, sitemap.xml, OG/Twitter cards (consumed via `src/lib/site.ts`, inlined at build time) | `http://localhost:3000` |

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
