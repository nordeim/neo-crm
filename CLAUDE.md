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
   `bun run test` (326) → `bun run build` → `bun run test:e2e` (50). For UI
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
| `bun run test`      | Vitest unit suites (326 checks)               |
| `bun run test:e2e`  | Playwright E2E (50 checks, needs build first) |
| `bun run db:push`   | Push Prisma schema (no migrations folder)     |
| `bun run db:seed`   | Reseed demo data in place                     |

## Testing Strategy

### Test Pyramid

- **Unit (Vitest, 326 checks)** — pure seams: `tests/db-path.test.ts`,
  `tests/auth.test.ts`, `tests/format.test.ts`, `tests/csv.test.ts`,
  `tests/rate-limit.test.ts`, `tests/avatar.test.ts`,
  `tests/constants.test.ts` (the DOM-pinned chart palette + session-10's
  reports vocabularies: the 8 raw slugs, FUNNEL_STAGES, AGING_BUCKETS),
  `tests/lead-filters.test.ts` (the popover Save View encode/decode seam),
  `tests/reports-data.test.ts` (session-10: aging bucketing, forecast
  accuracy, row-derived month series),
  `tests/login-reset.test.ts` (session-11: the login card's in-place
  reset-password flow — view swaps, submit gating, back navigation),
  `tests/page-titles.test.ts` (session-13: the auth pages' ABSOLUTE
  titles — the root template DOUBLED the relative ones),
  `tests/charts-contracts.test.ts` (session-13: the dashed grid
  `strokeDasharray="3 3"` contract + the funnel-as-horizontal-bar type),
  `tests/metadata.test.ts` (session-18: the siteUrl seam + the reference's
  405-char SITE_DESCRIPTION, the OG/Twitter layout pins, the icon +
  og-image asset pins, the sitemap/robots route-handler pins),
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
- **E2E (Playwright, 50 checks)** — `tests/e2e/`: `auth.spec.ts`
  (logged-out surface + session-11's login reset-password flow),
  `auth.setup.ts` (one real login, storageState saved),
  `crm.spec.ts` (authenticated golden path across all 9 pages + the
  session-10 per-page-titles and reports tab 2-4 structure tests, plus
  session-13's account-menu role=menu, reports-funnel bar-chart and
  by-type card structure tests),
  `mobile-navigation.spec.ts` (7-check regression suite for the drawer —
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
  primaries' bare shadow scale), and session-18's document-metadata
  layer (the reference meta description, the OG/Twitter card family, the
  favicon link, robots.txt's Sitemap line, the nine-route sitemap.xml).

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
the seam (currently 312).

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
variants: dashboard compact lowercase (`$145.0k` / `$1.4M`), reports compact
UPPERCASE K (`$542.0K` won / `$196K` lost via `formatCompactCurrency`
options), leads FULL (`$687,000` via `formatCurrency`) — the reference app
ignores its own Default Currency setting and so do we (the Settings field
still stores `AED`).

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
- **`window.location.href` for downloads** — route through
  `downloadFile()` in `src/lib/download.ts`.
