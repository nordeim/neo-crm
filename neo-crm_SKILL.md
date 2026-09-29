---
name: neo-crm
description: >
  Complete engineering skill for the NEO CRM codebase — a production-grade,
  self-hosted clone of the reference Base44 CRM workspace on Next.js 16 App
  Router + React 19 + Prisma/SQLite + Tailwind CSS v4. Covers the design
  system, component architecture, the SQLite path-normalization seam, the
  mobile-navigation drawer fix, auth, testing strategy, anti-patterns and
  the full debugging playbook. Use it to extend, debug, onboard, or
  replicate this architecture.
version: 1.3.0
last_updated: 2026-09-29
project_state: 92 unit checks + 21 e2e checks green; database pinned to <repo>/db/custom.db; chart palette + dialog vocabularies + layout contracts DOM-pinned by tests (constants.test.ts, page-layout.test.ts); table density + card typography + dialog contract + the full layout system aligned to the live reference (session-6)
---

# NEO CRM — Engineering Skill (SKILL.md v1.3.0)

> **How to use this document:** §1–§3 give you the mental model and a
> working environment. §4–§8 describe what the code actually does (every
> claim verified against the files cited). §9–§16 are the hard-won
> knowledge: bugs that already happened once, the patterns that prevent
> them, and the don'ts. §17–§20 are quick-reference tables you will return
> to constantly. Appendices index the ADRs, tests, audits and the
> live-site validation methodology. When this file and the code disagree,
> **the code wins — then fix this file.**

---

## Table of Contents

1. [Project Identity & Design Philosophy](#1-project-identity--design-philosophy)
2. [Tech Stack & Environment](#2-tech-stack--environment)
3. [Bootstrapping & Configuration](#3-bootstrapping--configuration)
4. [The Design System (Code-First)](#4-the-design-system-code-first)
5. [Component Architecture & Patterns](#5-component-architecture--patterns)
6. [Client-Side Effects Deep Dive](#6-client-side-effects-deep-dive)
7. [Data Layer & Domain Model](#7-data-layer--domain-model)
8. [Accessibility Implementation](#8-accessibility-implementation)
9. [Anti-Patterns & Common Bugs](#9-anti-patterns--common-bugs)
10. [Debugging Guide](#10-debugging-guide)
11. [Pre-Ship Checklist](#11-pre-ship-checklist)
12. [Lessons Learnt & How to Avoid Them](#12-lessons-learnt--how-to-avoid-them)
13. [Pitfalls to Avoid](#13-pitfalls-to-avoid)
14. [Best Practices](#14-best-practices)
15. [Coding Patterns](#15-coding-patterns)
16. [Coding Anti-Patterns](#16-coding-anti-patterns)
17. [Responsive Breakpoint Reference](#17-responsive-breakpoint-reference)
18. [Z-Index Layer Map](#18-z-index-layer-map)
19. [Color Reference (Complete)](#19-color-reference-complete)
20. [The Complete TypeScript Interface Reference](#20-the-complete-typescript-interface-reference)
- [Appendix A: ADR Index](#appendix-a-adr-index)
- [Appendix B: Test Inventory & Runtime Costs](#appendix-b-test-inventory--runtime-costs)
- [Appendix C: Audit History](#appendix-c-audit-history)
- [Appendix D: Live-Site Validation Methodology](#appendix-d-live-site-validation-methodology)

---

## 1. Project Identity & Design Philosophy

**One sentence:** NEO CRM is a faithful, self-hosted clone of the reference
CRM workspace (`https://neo-crm-8ab2c17c.base44.app/`) — dashboard,
accounts, contacts, leads, calendar, activities, reports and settings —
built as one Next.js 16 App Router process with Prisma/SQLite, scrypt+HMAC
cookie auth and a single Zustand store, for a small sales team that wants
its data on its own infrastructure.

**Design thesis: "faithful light-SaaS utility."** The reference app is a
clean, blue-and-white business tool. The clone reproduces it precisely: a
vibrant `#2563eb` sidebar with white lucide icons, white topbar with a
gray search pill, white `rounded-xl` KPI cards with delta chips and
sparkline strips on a `#f9fafb` canvas, Inter typography, and one blue
primary action per surface. Every color in the design system was measured
from reference captures — see §19.

**Non-negotiable rules:**

- Visual and behavioral parity with the reference is the DEFAULT.
- Known reference defects are FIXED, not copied: the missing mobile
  navigation (§9, bug #1), the empty owner dropdown on the dashboard
  filter bar, and the duplicated Export button (kept visually, but each
  button does a distinct job).
- One process, zero external services: `bun install && cp .env.example
  .env && bun run db:push && bun run db:seed && bun run dev` must always
  produce a working, seeded workspace.
- All API responses flow through the `{ ok, data } | { ok, error }`
  envelope; all server state flows through the one Zustand store.

**Anti-generic mandate:** no gradients, no dark mode, no glassmorphism, no
marketing-page flourishes, no icon sets other than lucide-react, no chart
library other than recharts, no component library other than the local
Radix-based kit in `src/components/ui/`. This is a working tool; if a
change makes it prettier but less like the reference, it is wrong.

## 2. Tech Stack & Environment

Exact versions from `package.json` (bun lockfile; `bun.lock` + regenerated
`package-lock.json` both committed):

| Layer | Technology | Version | Critical Note |
|---|---|---|---|
| Framework | Next.js (App Router) | `16.3.6` | Turbopack dev; `output: "standalone"`; `proxy.ts` not used |
| UI runtime | React | `19.3.x` | No `forwardRef`; async `params`/`cookies()`; `set-state-in-effect` lint rule is an ERROR |
| Language | TypeScript | `5.9.x` | Strict except `noImplicitAny: false`; `isolatedModules` |
| Styling | Tailwind CSS | `4.3.3` (devDep) | CSS-first `@theme` in `src/app/globals.css`; NO `tailwind.config.js` |
| PostCSS | `@tailwindcss/postcss` | `^4` | The ONLY plugin; if missing, pages render unstyled (§9 bug #2) |
| Components | `@radix-ui/*` (9 pkgs) | `^1` | dialog, select, popover, dropdown, label, toast, alert-dialog, radio-group, slot |
| Charts | recharts | `2.15.x` | Every chart has an empty-state fallback |
| ORM | prisma + `@prisma/client` | `6.19.3` | `db push` workflow, no migrations folder |
| Database | SQLite | (libsqlite) | `<repo>/db/custom.db`; dev + e2e (`db/e2e.db`) files, both git-ignored |
| State | zustand | `5.0.x` | ONE store (`src/stores/crm-store.ts`), no React Query/SWR |
| Icons | lucide-react | `0.525.x` | Nav chrome stroke 1.8; content stroke 2 |
| Unit tests | vitest | `5.0.x` | Node env; `@` alias; `*.test.ts` only |
| E2E tests | @playwright/test | `1.63.x` | Chromium project + setup project; standalone server on :3100 |
| Animations | `tw-animate-css` | `^1` (devDep) | **Vendored** at `src/app/vendor/tw-animate.css` — the npm import breaks Turbopack (§9 bug #3) |
| Runtime | bun | `1.3.x` | Runs scripts, tests, the Prisma CLI; **rewrites `.env` relative `file:` URLs** — see §9 bug #8 |

**Currency display convention (session 3):** every amount renders with an
attached dollar sign — `formatCurrency` → `$12,500`,
`formatCompactCurrency` → `$145.0k` / `$1.4M` (lowercase `k`, uppercase
`M`). The reference app ignores its own Settings "Default Currency" value
(stored as `AED`); the clone mirrors that behavior exactly, so the Settings
field is data-only. Never reintroduce an `AED `-prefixed display.

Runtime dependencies (19 total — two unused scaffold packages,
`tailwindcss-animate` and `z-ai-web-dev-sdk`, were removed in the session-2
remediation): `@prisma/client`, 9 `@radix-ui/*` packages,
`class-variance-authority`, `clsx`, `lucide-react`, `next`, `prisma`,
`react`, `react-dom`, `recharts`, `tailwind-merge`, `zustand`.

Dev dependencies (11): `@playwright/test`, `@tailwindcss/postcss`,
`@types/react`, `@types/react-dom`, `bun-types`, `eslint`,
`eslint-config-next`, `tailwindcss`, `tw-animate-css`, `typescript`,
`vitest`.

## 3. Bootstrapping & Configuration

### 3.1 First run (from a clean clone)

```bash
bun install
cp .env.example .env          # then set AUTH_SECRET: openssl rand -hex 32
bun run db:push               # creates <repo>/db/custom.db from the schema
bun run db:seed               # idempotent demo workspace, reseeded IN PLACE
bun run dev                   # http://localhost:3000  (log tee'd to dev.log)
```

Demo login (mirrors the reference app): `sepnetflix2023@outlook.com` /
`$Abcd1234`.

### 3.2 Configuration files

| File | Purpose |
|---|---|
| `next.config.ts` | `output: "standalone"`, `outputFileTracingRoot` pinned to the repo (stable traced `prisma/schema.prisma` for the db-path seam), `typescript.ignoreBuildErrors` (the explicit `typecheck` script is the real type gate) |
| `postcss.config.mjs` | `{ plugins: ["@tailwindcss/postcss"] }` — REQUIRED for `@theme`/`@utility` compilation |
| `tsconfig.json` | strict (except `noImplicitAny: false`), `@/*` → `src/*` alias |
| `eslint.config.mjs` | next/core-web-vitals + next/typescript; `skills/`, build dirs ignored; react-hooks purity rules enforced |
| `vitest.config.ts` | `include: ["src/**/*.test.ts", "tests/**/*.test.ts"]`, node env, `@` alias |
| `playwright.config.ts` | 2 projects (setup + chromium), `globalSetup` reseeds `db/e2e.db` in place, webServer boots the standalone build on :3100 with `DATABASE_URL=file:../db/e2e.db` |
| `prisma/schema.prisma` | 8 models; `datasource db { provider = "sqlite"; url = env("DATABASE_URL") }` |
| `scripts/prisma-env.ts` | `db:push` wrapper — injects the schema-rule URL into the Prisma CLI's env (§9 bug #8) |

### 3.3 Environment variables (3 — count them, 3)

| Variable | Required | Purpose | Example / Default |
|---|---|---|---|
| `DATABASE_URL` | Yes | SQLite URL; relative `file:` values resolve against `prisma/schema.prisma` | `file:../db/custom.db` |
| `AUTH_SECRET` | Prod | HMAC secret for session cookies (≥16 chars) | `openssl rand -hex 32` |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical origin for metadata | `http://localhost:3000` |

`.env` is untracked; `.env.example` is committed and mirrors the contract
exactly (PostgreSQL example: `postgresql://user:password@localhost:5432/neo_crm`).

### 3.4 The database location contract (read this twice)

`db/` lives at the REPO ROOT. Every consumer — Prisma CLI, `next dev`,
`next build`, the standalone server, the seed, the e2e suite — must land on
`<repo>/db/<name>`. Three different resolution rules fight over a relative
`file:` URL (schema-relative, `.env`-file-relative, CWD-relative) plus
bun's silent absolutization; `src/lib/db-path.ts` normalizes them all and
is the ONLY sanctioned source of the URL (§15.5). Never construct a
`PrismaClient` anywhere except `src/lib/db.ts` (and the seed, which
derives through the same seam).

## 4. The Design System (Code-First)

All tokens live in the `@theme` block of `src/app/globals.css` (171 lines)
as LITERAL hex values — no `var()` chains inside `@theme`, no
`tailwind.config.js`. Measured from the reference app.

### 4.1 The `@theme` block (complete)

```css
@theme {
  /* Brand palette */
  --color-sidebar: #2563eb;         /* vibrant blue sidebar */
  --color-sidebar-hover: #3b6ff0;
  --color-sidebar-active: #4d7ef5;
  --color-primary: #3b82f6;         /* buttons, links, active states */
  --color-primary-hover: #2563eb;
  --color-primary-foreground: #ffffff;

  /* Neutrals */
  --color-background: #f9fafb;      /* app canvas */
  --color-surface: #ffffff;         /* cards, topbar */
  --color-foreground: #111827;      /* near-black text */
  --color-muted: #6b7280;           /* secondary text */
  --color-subtle: #9ca3af;          /* placeholders, icons */
  --color-line: #e5e7eb;            /* borders */
  --color-line-soft: #f3f4f6;       /* chips, hover fills, search pill */

  /* Feedback */
  --color-success: #10b981;  --color-success-soft: #ecfdf5;
  --color-warning: #f59e0b;  --color-warning-soft: #fffbeb;
  --color-danger: #ef4444;   --color-danger-soft: #fef2f2;
  --color-info: #06b6d4;     --color-info-soft: #ecfeff;

  /* Typography */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, ...;

  /* Radius scale */
  --radius-card: 0.75rem;   /* rounded-xl — KPI/list cards */
  --radius-button: 0.5rem;  /* rounded-lg — buttons, inputs */
  --radius-pill: 9999px;    /* delta chips, search pill */

  /* Chart palette — NOTE: the live constants live in src/lib/constants.ts
     (CHART_COLORS / *_META hex); the tokens below are the base family.
     Session-4 DOM extraction re-pinned two stage hexes: Proposal renders
     yellow-500 #eab308 and Won renders grey-400 #9ca3af on the reference
     dashboard pipeline (badges stay emerald); stat-card mini bars use the
     tailwind -400 family (see §4). */
  --color-chart-1: #3b82f6;  --color-chart-2: #06b6d4;
  --color-chart-3: #eab308;  --color-chart-4: #f97316;
  --color-chart-5: #9ca3af;  --color-chart-6: #ef4444;

  /* Animations (Radix data-[state] transitions) */
  --animate-fade-in: fade-in 0.2s ease-out;
  --animate-slide-in-right: slide-in-right 0.25s cubic-bezier(0.32,0.72,0,1);
}
```

### 4.2 Typography hierarchy

| Role | Classes | Where |
|---|---|---|
| Page title | `text-2xl font-bold tracking-tight` | `PageHeader` (`src/components/shared/page-parts.tsx`) |
| KPI value | `text-[28px] font-semibold leading-none tracking-tight` | `KpiCard` |
| KPI label | `text-xs font-medium tracking-wide text-muted` (Title Case, NOT uppercase — parity fix) | `KpiCard` |
| Card title | `text-sm font-medium` | `CardTitle` |
| Body | `text-sm text-foreground` / `text-muted` | everywhere |
| Delta chip | `text-xs font-semibold` in soft success/danger pills | `KpiCard` |

### 4.3 Custom utilities (3, via v4-native `@utility` — never `@layer utilities`)

- `scrollbar-thin` — thin gray scrollbars for the drawer/agenda panes
- `chart-no-outline` — removes recharts focus outlines
- `input-base` — shared base for text inputs (radius, border, focus ring)

### 4.4 Status vocabularies (canonical label + color metadata)

`src/lib/constants.ts` (172 lines) is the single source:
`STAGE_META` (7 lead stages), `ACCOUNT_STATUS_META`, `ACTIVITY_TYPE_META`
(call/email/meeting/whatsapp/task/note), `EVENT_TYPE_META`,
`PRIORITY_META`, `TIER_META`, `CHART_COLORS`, `LEAD_SOURCES`,
`DEFAULT_SETTINGS`. **Never hardcode a status color** — extend the meta
map when you extend a vocabulary.

## 5. Component Architecture & Patterns

### 5.1 Layer model (the Golden Rule: imports point DOWN only)

```
Layer 1  src/app/**            pages (11) + API route handlers (22) + layouts
Layer 2  src/components/**     UI kit (12 files) + layout chrome + shared dialogs
Layer 3  src/lib/**            pure seams: auth, api envelope, db, db-path,
                               format, csv, rate-limit, constants, download
Layer 4  src/stores/**         the single Zustand store (client)
Layer 5  prisma/**             schema + idempotent seed
```

A component may import the store and lib seams; a lib seam imports nothing
above Layer 3 (db-path imports only fs/path/url). The store is the only
HTTP client for server state (its `call()` helper unwraps the envelope).

### 5.2 Inventory (verified counts)

- 21 `.tsx` files under `src/components/`; 15 start with `"use client"`.
- 11 pages (`src/app/**/page.tsx`): login, signup, dashboard, accounts,
  contacts, leads, calendar, activities, reports, settings, profile.
- 22 API route files: auth (login/signup/logout/me), users, accounts±id,
  contacts±id, leads±id, activities±id, events±id, dashboard, reports,
  settings, search, export, reset, health. All `force-dynamic`, all
  session-gated via `requireSession()`.
- Shared dialogs: `src/components/shared/entity-dialogs.tsx` (817 lines) —
  Account/Contact/Lead/Event/Activity forms using the remount-via-key
  pattern (§15.2).
- Layout chrome: `app-shell.tsx`, `sidebar.tsx`, `topbar.tsx`,
  `mobile-nav.tsx`, `nav-config.ts`, `login-card.tsx`.

### 5.3 Client/server split

Server components: the `(app)` layout (session guard → redirect `/login`),
page shells re-exporting metadata; everything interactive is a client
component. `AppShell` mounts once per authenticated page, calls
`hydrate()` (resolves `/api/auth/me`, then fetches every slice), and
renders sidebar + topbar + page children.

### 5.4 The mobile navigation drawer (the headline fix)

`src/components/layout/mobile-nav.tsx` (170 lines). The reference app
simply hides its sidebar below `lg` and ships NO replacement — phone users
cannot navigate. The clone ships a proper drawer:

- hamburger trigger (`MobileNavTrigger`) visible below `lg`
- slide-in panel with backdrop, `role="dialog"`, `aria-modal`
- focus trap (Tab/Shift+Tab cycling), Escape to close + focus restore
- **dual scroll lock** while open (session-6): `document.body` AND the
  `main` scroller get `overflow: hidden` and are restored on close — since
  session 6 `main.flex-1.overflow-auto` is the app's scroll container, a
  body-only lock no longer stops scrolling
- close-on-route-change via the adjust-during-render pattern (§6)
- `inert` + `visibility:hidden` (with `transition-[visibility]`) when
  closed — never `display:none`, which kills the exit transition

`tests/e2e/mobile-navigation.spec.ts` (5 checks) is the regression suite.
Do not weaken it; extend it when the drawer changes.

### 5.5 Reference-defect register (fixed deliberately)

| Reference defect | Clone's fix |
|---|---|
| No mobile navigation at all | The drawer (§5.4) |
| Dashboard toolbar's empty Radix select is a DEAD Table/Cards view-switcher (no state persists) | Omitted — toolbars carry only working controls |
| Dashboard "Filter" button opens nothing (dead) | Omitted from the card; our filter controls all work |
| Two adjacent identical Export buttons | Same visual row; outline Export opens the export-type menu, filled Export is one-click leads CSV |
| Activities "More Filters (1)" expander expands nothing (dead) | Same outline button, made functional — reveals the Task/Note type group |
| Contacts filter card body renders NOTHING below its toolbar (stub) | Same card + toolbar; our Priority/Source/Owner groups expand under the outline Filters button |
| Filter rails hidden below `lg` — phone users cannot filter | Mirrored (structural parity), documented as a reference accessibility regression |
| Rail card titles stay 16px while other card titles scale | Pinned via `FILTER_RAIL.title` (`text-base sm:text-base`) — deliberate |
| KPI labels uppercase in clones that copy the template | Title Case, matching the reference |

### 5.6 The layout system — `src/lib/page-layout.ts` (session-6)

Every page-level layout class string lives in ONE test-pinned module
(132 lines; `tests/page-layout.test.ts`, 17 checks). Pages import records —
they never hand-write layout classes. Reference token mapping: gray-50 →
`background`, white → `surface`, gray-200 → `line`, gray-500 → `muted`.

- **`PAGE_KPI_GRIDS`** — every KPI ladder starts at `grid-cols-1` (phones)
  and climbs: dashboard/leads/activities `sm:2 lg:3 xl:6`, accounts
  `sm:2 lg:5`, contacts `md:2 lg:4`, calendar `sm:2 lg:4`, reports
  `sm:2 lg:3 xl:5` — all `gap-4 mb-6`.
- **`PAGE_HEADER`** — standard stacks on phones (`flex-col sm:flex-row`,
  `mb-6 gap-4`, h1 `text-2xl sm:text-3xl font-bold`, actions
  `w-full sm:w-auto`); contacts is the flat variant (`text-3xl`, plain row,
  `gap-3`); leads adds `sm:mb-8`. Subtitles are **16px** (no text-sm).
- **`RAIL_LAYOUT`** — accounts/calendar/activities are `flex gap-6` rows:
  `flex-1 min-w-0` content + `hidden lg:block w-80` rail. The `min-w-0`
  is load-bearing (flexbox `min-width: auto` lets a wide table squeeze the
  rail to 186px at exactly 1024px).
- **`FILTER_RAIL`** — the rail card anatomy. The stock CardHeader keeps its
  column direction, so the action row is a CHILD
  (`flex justify-between items-center` → title + ghost `h-8 px-3 text-xs`
  "Save All" on accounts/activities). Calendar is the outlier: the TITLE
  element itself carries `flex items-center justify-between` and its action
  is a blue text link (`text-xs text-blue-600 hover:text-blue-700
  font-normal` "Clear All"). Select-group labels `mb-2`, checkbox-group
  labels `mb-3` (both `text-sm font-semibold block`); groups are plain
  divs; checkbox stacks `space-y-2`; titles fixed 16px.
- **`TABLE_CARD`** — `bg-surface rounded-lg shadow` (NO border), toolbar
  `p-4 border-b` (`flex flex-col sm:flex-row gap-3`), body `overflow-x-auto`.
- **`FILTER_BAR` / `REPORTS_FILTER_BAR`** — dashboard filter bar is a white
  card (`mb-6 p-4`); reports bar is `sticky top-0 z-10 shadow-md` (works
  because `main` is the scroll container).

**Shell scroll model (the session-6 restructure):** static topbar
(`bg-white border-b px-4 sm:px-8 py-4`); `main.flex-1.overflow-auto` is the
scroll container; content wrapper `p-4 sm:p-8 min-h-screen`, NO max-width
(the old `max-w-[1400px]` cap is gone — full-bleed like the reference).

## 6. Client-Side Effects Deep Dive

There is no `src/hooks/` folder — effects live beside their components,
and all of them follow three React-19-safe patterns (the
`set-state-in-effect` lint rule is an ERROR in this repo):

### 6.1 Mount-and-fetch

```tsx
React.useEffect(() => {
  if (hydrated) fetchDashboard();
}, [hydrated, fetchDashboard]);
```

SetState happens inside the async store action, never synchronously in
the effect body. Used on every page for slice fetching.

### 6.2 Debounced search (yield-before-setState)

```tsx
React.useEffect(() => {
  if (timer.current) clearTimeout(timer.current);
  timer.current = setTimeout(async () => {
    if (query.trim().length < 2) { setResults(null); setOpen(false); return; }
    const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
    const body = await res.json().catch(() => null);
    if (body?.ok) { setResults(body.data); setOpen(true); }  // async → safe
  }, 250);
  return () => { if (timer.current) clearTimeout(timer.current); };
}, [query]);
```

(`src/components/layout/topbar.tsx` — the await satisfies the lint rule;
any await/yield before setState is the sanctioned escape hatch.)

### 6.3 Adjust-during-render (route-change closing)

The drawer closes on navigation by updating state DURING render when it
observes `pathname` changed — the React-endorsed "you probably didn't mean
to do this in an effect" pattern:

```tsx
const [prevPath, setPrevPath] = React.useState(pathname);
if (prevPath !== pathname) { setPrevPath(pathname); if (open) setOpen(false); }
```

### 6.4 Remount-via-key (dialog forms)

Dialog forms never copy props into state in an effect; the parent mounts
them with `key={entity?.id ?? "new"}` and the form initializes from props
in `useState(...)` initializers. This is why `entity-dialogs.tsx` is
lint-clean under React 19.

## 7. Data Layer & Domain Model

### 7.1 Prisma models (8) — `prisma/schema.prisma` (186 lines)

| Model | Key fields | Notes |
|---|---|---|
| `User` | email (unique), name, avatarColor, role, passwordHash | scrypt hash; seeded team of 4 |
| `Account` | name, industry, email/phone/website, annualRevenue, employees, tier A/B/C, isKey, status, ownerId | `_count` includes for contacts/leads/activities |
| `Contact` | name, email, phone, company, position, source, priority, accountId, ownerId | priority hot/warm/cold |
| `Lead` | name, value, stage, source, expectedCloseDate, closedAt, nextFollowUp, accountId, contactId, ownerId | 7 stages: new→contacted→qualified→proposal→negotiation→won/lost |
| `Activity` | type, subject, notes, status, priority, dueAt, completedAt, accountId, contactId, ownerId | types: call/email/meeting/whatsapp/task/note |
| `Event` | title, type, status, startAt, endAt, allDay, location, account/contact links | types: meeting/appointment/call/task |
| `SavedReport` | name, tab, config (JSON string) | reports save/load |
| `Setting` | singleton row | editable picklists + workspace defaults |

### 7.2 Seed — `prisma/seed.ts` (355 lines)

Idempotent IN PLACE: `deleteMany` every domain table, then insert the
canonical demo workspace (4 users incl. the demo login, 10 accounts,
15 contacts, 24 leads across 7 stages and 6 months, 20 activities,
12 events, settings singleton). **Never `rm` the db file under a running
server** — the process keeps the deleted inode and serves stale data
(§9 bug #5).

### 7.3 The db-path seam — `src/lib/db-path.ts` (182 lines)

Exported API (all unit-tested in `tests/db-path.test.ts`, 16 checks):

- `urlForRoot(root, ref)` — join `root/prisma/<ref>`, `mkdir -p` the
  parent, return `file:<abs>`. First-boot safe.
- `resolveDatabaseUrl(raw)` — passthrough for non-file/absolute/in-memory
  URLs; validated anchors (standalone-CWD detector, module repo-root
  validator) accepted unconditionally; unvalidated CWD only with an
  existence guard.
- `parseEnvFile(contents)` — minimal dotenv parser (quotes stripped,
  comments/blanks skipped).
- `effectiveDatabaseUrl({envUrl, envFileUrl, envFileDir})` — if the env
  var is EXACTLY bun's absolutization of the `.env` value, re-derive from
  the RAW value (schema rule); otherwise the env value wins.
- `runtimeDatabaseUrl(cwd)` — combines `process.env.DATABASE_URL` with
  the `.env` at cwd; the one function `db.ts`, `seed.ts` and the
  `scripts/prisma-env.ts` wrapper all call.

### 7.4 Auth — `src/lib/auth.ts` (129 lines)

scrypt password hashes (`scrypt:salt:hash`), HMAC-SHA256 signed stateless
cookie `neo_session` (7-day TTL), `timingSafeEqual` verification,
`getSessionUser()` for pages, `requireSession()` for route handlers.
Login/signup rate-limited 10 attempts/IP/15 min (`rate-limit.ts`).

## 8. Accessibility Implementation

- **Keyboard:** every interactive element is a real button/link; drawer
  traps Tab/Shift+Tab and restores focus on close; Escape closes the
  drawer, dropdowns and dialogs (Radix handles the latter).
- **ARIA:** drawer is `role="dialog" aria-modal="true"` labelled by its
  heading; icon-only buttons carry `aria-label` ("Open navigation menu",
  "Add lead", …); toasts use `role="status"`/`role="alert"`; form errors
  use `role="alert"`.
- **Focus visibility:** global `focus-visible:outline-none` +
  `focus-visible:ring-2 focus-visible:ring-primary/40` on interactive
  elements (button variants centralize this).
- **Reduced motion:** transitions are 0.2–0.25s transforms/opacity only;
  a `@media (prefers-reduced-motion: reduce)` block at the bottom of
  `globals.css` collapses every animation/transition to 0.01ms — the
  drawer slide included — so the UI stays motion-free for sensitive
  users.
- **Semantics:** real `<table>` markup in `ui/table.tsx` and page tables;
  `<label htmlFor>` on every form field; the calendar grid uses
  `role="grid"` with day cells as `role="gridcell"`.
- **Color contrast:** foreground `#111827` on `#ffffff` (17.4:1), muted
  `#6b7280` on white (4.8:1 AA); sidebar white-on-`#2563eb` (4.5:1 AA);
  delta chips use the soft backgrounds precisely so text keeps contrast.

## 9. Anti-Patterns & Common Bugs

Eight real bugs shipped and were fixed in this codebase. Every entry has
a regression test or a structural guard.

### Bug #1: Missing mobile navigation (Critical — the founding defect)

**Symptom:** below `lg` the reference app shows no nav at all.
**Root cause:** the reference template hides the sidebar without shipping
a replacement. **Fix:** `mobile-nav.tsx` drawer + 5-check e2e suite.
**Lesson:** cloning parity means fixing the reference's defects, not
photocopying them.

### Bug #2: Pages rendered unstyled (Critical)

**Symptom:** first dev boot served raw unstyled HTML.
**Root cause:** the scaffold shipped without `postcss.config.mjs`, so
Tailwind v4 `@theme`/`@utility` directives were never compiled.
**Fix:** config with the single `@tailwindcss/postcss` plugin.
**Lesson:** Tailwind v4 is PostCSS-driven; a missing config fails SILENTLY
(no build error — just unstyled pages).

### Bug #3: `Can't resolve 'tw-animate-css'` (High)

**Symptom:** Turbopack CSS import error for the animation library.
**Root cause:** the package exposes only the `style` export condition,
unsupported by Turbopack's CSS resolver (subpaths included).
**Fix:** vendored the dist CSS at `src/app/vendor/tw-animate.css` (MIT,
attribution kept); `globals.css` imports the local file.
**Lesson:** pin the workaround in docs or the next agent reinstalls the
package.

### Bug #4: Empty dashboard despite seeded data (High)

**Symptom:** UI rendered but all data slices were null.
**Root cause:** `hydrate()` was never called by any component, and
`/api/auth/me` double-wrapped the user payload.
**Fix:** `AppShell` calls `hydrate()` on mount; route unwrapped.
**Lesson:** a store nobody hydrates is a very quiet failure mode.

### Bug #5: E2E flakiness from a deleted-inode SQLite (High)

**Symptom:** API routes saw fresh seed data, page routes saw stale data,
in the same server process.
**Root cause:** global-setup DELETED the db file under a reused server;
the process kept reading the deleted inode.
**Fix:** reseed IN PLACE (deleteMany + create). Never delete `db/*.db`
under a live server. **Lesson:** SQLite + reuseExistingServer = file
identity matters.

### Bug #6: Reports zeroed by the "all" sentinel (Medium)

**Symptom:** default Reports view showed zeros until a filter was touched.
**Root cause:** `/api/reports` treated the UI sentinel `"all"` as a
literal ownerId/stage/status.
**Fix:** `notAll()` normalization + e2e assertion (stable $542.0k).
**Lesson:** sentinel values must be normalized at the boundary.

### Bug #7: Invalid `eslint` key in next.config (Low)

**Symptom:** config warning on every build.
**Root cause:** `eslint: {...}` was removed in Next 16.
**Fix:** deleted the block (lint runs standalone). **Lesson:** scaffold
defaults drift across major versions — validate configs against the
installed version.

### Bug #8: Database created OUTSIDE the repo (Critical — session 2)

**Symptom:** the dev server held its SQLite handle on
`/home/z/my-project/db/custom.db` — one directory above the repo — while
`.env` said `file:../db/custom.db`.
**Root cause (three interacting rules, all verified empirically):
  1. **bun** loads `.env` for every `bun run`/`bun x` process and
     ABSOLUTIZES relative `file:` DATABASE_URL values against the `.env`
     file's own directory → `file:/<parent-of-repo>/db/custom.db`;
  2. absolute URLs intentionally pass through the resolver untouched;
  3. on first boot (db/ absent) the old resolver's existence guards
     failed, handing the raw relative URL to the Prisma engine, which
     resolves it against the process CWD → same wrong directory.
**Fix:** the full seam of §7.3 — `urlForRoot` mkdir-on-demand,
`effectiveDatabaseUrl` bun-signature detection and re-anchoring, and the
`scripts/prisma-env.ts` wrapper for `db:push`. Pinned by 9 new unit
checks + live `/proc/<pid>/fd` verification.
**Lesson:** never trust a container runtime's env rewrite; derive from
the raw contract (`.env`) and re-assert the intended rule.

## 10. Debugging Guide

| Symptom | First suspect | Command / action |
|---|---|---|
| Page unstyled | postcss config | `cat postcss.config.mjs` — must list `@tailwindcss/postcss` |
| Data null everywhere | hydrate wiring | check `AppShell` calls `hydrate()`; `curl /api/auth/me` shape |
| DB "outside the repo" | bun absolutization | `for pid in $(pgrep -f next-server); do ls -l /proc/$pid/fd | grep .db; done` — every handle must point at `<repo>/db/*.db` |
| E2E stale data | deleted inode | reseed in place; never `rm db/e2e.db` while a server may reuse it |
| Login rejected | rate limiter / AUTH_SECRET changed | wait 15 min or restart (per-process limiter); re-sign-in |
| 401 on API but page renders | cookie path/Secure flags | check `NODE_ENV=production` + https when debugging standalone |
| Route works in dev, missing in standalone | tracing root | `outputFileTracingRoot` must stay pinned in `next.config.ts` |
| Chart blank | all-zero data | by design — empty-state fallback; verify the API slice feeds it |
| Prisma "table does not exist" | push/seed landed elsewhere | `bun run db:push` (wrapper) then verify `ls -la db/` |

General tools: `dev.log` (tee'd), `agent-browser` for headless UI checks
at both widths, `bunx playwright show-trace test-results/*/trace.zip`,
and `curl` against the envelope (`{"ok":true,"data":…}`) for API truth.

## 11. Pre-Ship Checklist

```bash
bun run lint         # 0 errors, 0 warnings
bun run typecheck    # clean (the REAL type gate — build ignores errors)
bun run test         # 65/65
bun run build        # standalone build succeeds
bun run test:e2e     # 20/20 (build first; boots :3100 with db/e2e.db)
```

Manual additions:

- [ ] Mobile drawer exercised at 390px: open → all 8 destinations navigate
      → Escape closes → scroll lock engages and releases
- [ ] `ls -la db/` — both `custom.db` and `e2e.db` inside the repo; no
      stray `db/` next to it
- [ ] No new `console.log`; no `window.location.href` outside `download.ts`
- [ ] Docs touched if architecture changed (AGENTS.md, CLAUDE.md, PAD,
      this file)
- [ ] Commit on `main` only, Conventional Commit + emoji, push via the
      SSH wrapper runbook

## 12. Lessons Learnt & How to Avoid Them

1. **Scaffold configs drift** — the scaffold was missing postcss config
   and shipped an invalid eslint key (Bugs #2, #7). Validate every config
   against the INSTALLED framework version before blaming your code.
2. **Silent failures are the expensive ones** — unstyled pages and an
   unhydrated store produce no errors. Boot the app in a browser before
   writing more code.
3. **File identity matters with SQLite** — a deleted file under a live
   process is a ghost (Bug #5). Reseed in place, always.
4. **Normalize sentinel values at the boundary** (Bug #6) — `"all"` is a
   UI concept; the API contract must convert it explicitly.
5. **Container runtimes rewrite your env** (Bug #8) — bun's
   `.env`-relative absolutization moved the database outside the repo.
   Derive config from the raw source, verify against live process state
   (`/proc/*/fd`), and pin the behavior with tests.
6. **Empirical beats documented** — three plausible theories about the
   db path were destroyed by 10 minutes of controlled experiments (E1–E21
   in `docs/plans/2026-09-29-session2-remediation.md`). When behavior is
   weird, instrument it.
7. **Lint rules encode real bugs** — the React 19 `set-state-in-effect`
   ERROR forced the remount-via-key pattern (§6.4), which is precisely
   what keeps dialogs correct. Don't suppress; restructure.
8. **Visual parity needs a reference capture pipeline** — screenshots of
   the reference + VLM comparison catches drift human review misses
   (§Appendix D). The sparklines on the KPI cards were found exactly this
   way in session 2.
9. **Reference defects must be catalogued, not photocopied** — §5.5's
   register keeps the "why is this different" discussion out of code
   review.
10. **One seam, all consumers** — db.ts, seed.ts and the CLI wrapper all
    call `runtimeDatabaseUrl()`. A second copy of path logic is how the
    CLI and the app disagreed in the first place.

## 13. Pitfalls to Avoid

- **Don't construct `PrismaClient` outside `src/lib/db.ts`** — hot reload
  multiplies SQLite handles; the `globalThis` singleton exists for a
  reason.
- **Don't delete `db/*.db` while any server runs.**
- **Don't create `tailwind.config.js`** — dead file in v4; tokens belong
  in `@theme`.
- **Don't write `var(--color-x)` inside `@theme`** — literal hex only.
- **Don't combine the `hidden` HTML attribute with display utilities**
  — the attribute overrides them.
- **Don't `mkdir` from an unproven CWD** — only validated anchors create
  directories (see the guarded fallback in `resolveDatabaseUrl`).
- **Don't inline `window.location.href` for downloads** — route through
  `downloadFile()` (`src/lib/download.ts`); the lint rule exists.
- **Don't add a status string without extending its `*_META` map.**
- **Don't trust bun's exported `DATABASE_URL`** — it may be the
  absolutized wrong path (Bug #8).
- **Don't run `prisma` directly in scripts** — use the
  `scripts/prisma-env.ts` wrapper so the CLI lands on `<repo>/db/`.

## 14. Best Practices

- Extend the pure seams in `src/lib/*` instead of inlining logic; every
  new pure helper ships with Vitest coverage.
- Hand-rolled validation at route boundaries (`asString`/`asNumber`/
  `asDate` + enum membership in `src/lib/api.ts`); no schema library by
  design.
- `{ ok, data }` / `{ ok, error }` envelope everywhere; build responses
  with `ok()`/`fail()`/`ERR.*`; never throw across the API boundary.
- Named exports for components; kebab-case files; `@/` alias only.
- Early returns over nesting; composition over inheritance.
- Charts must render explicit empty states; lists must never be blank
  panels.
- Comments explain WHY only where non-obvious (`mobile-nav.tsx`,
  `db-path.ts` are the exemplars).
- Docs are code: AGENTS.md (contract), CLAUDE.md (workflow), PAD
  (blueprint), this file (distilled knowledge) — keep all four in sync
  when architecture changes.

## 15. Coding Patterns

### 15.1 Route handler (every one of the 22 follows this)

```ts
// src/app/api/accounts/route.ts (shape)
import { db } from "@/lib/db";
import { ok, fail, ERR, requireSession, asString } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireSession();     // envelope 401 on miss
  if (!session.ok) return session.response;
  const rows = await db.account.findMany({ include: { owner: true } });
  return ok(rows);
}

export async function POST(req: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;
  const body = await req.json().catch(() => null);
  const name = asString(body?.name, 120);
  if (!name) return ERR.BAD_REQUEST("Name is required");
  const created = await db.account.create({ data: { name, /* … */ } });
  return ok(created);
}
```

### 15.2 Dialog form (remount-via-key)

```tsx
// Parent: <AccountDialog key={editing?.id ?? "new"} entity={editing} … />
function AccountForm({ entity }: { entity: Account | null }) {
  // Initialize FROM PROPS at mount — the parent's key remounts on switch.
  const [name, setName] = React.useState(entity?.name ?? "");
  // …no useEffect copying props into state, ever.
}
```

### 15.3 Drawer (state machine, not class toggles)

Open/close is one `open` boolean driving: panel
`translate-x`+`transition-[visibility]`, backdrop opacity, `inert`,
`aria-hidden`, body `overflow:hidden`, and focus trap lifecycle. See
`mobile-nav.tsx` for the complete reference implementation.

### 15.4 Sparkline (pure CSS, no chart lib)

```tsx
<Sparkline values={monthlyWon} color={CHART_COLORS.cyan} />
<Sparkline values={bars} color={CHART_COLORS.orange}
  colorFor={(_, i) => (won[i] >= target[i] ? CHART_COLORS.blue : CHART_COLORS.orange)} />
```

(`src/components/shared/page-parts.tsx` — 8-bar strips mirroring the
reference KPI cards.)

### 15.5 Database URL derivation (THE rule)

```ts
import { runtimeDatabaseUrl } from "@/lib/db-path";
const url = runtimeDatabaseUrl();            // db.ts, seed.ts, wrapper
new PrismaClient({ datasources: { db: { url } } });
```

Never `process.env.DATABASE_URL` directly; never a bare
`new PrismaClient()`.

### 15.6 Rate limiter (fixed window + sweeper)

```ts
const rl = new RateLimiter({ limit: 10, windowMs: 15 * 60_000 });
if (!rl.check(ip).allowed) return ERR.TOO_MANY("Too many attempts");
```

(`src/lib/rate-limit.ts`; per-process — document that on multi-instance
deploys it needs a shared store.)

## 16. Coding Anti-Patterns

| Don't | Do |
|---|---|
| `React.useEffect(() => setState(...))` | remount-via-key, adjust-during-render, or yield-before-setState (§6) |
| `new PrismaClient()` anywhere but `db.ts` | `import { db } from "@/lib/db"` |
| `process.env.DATABASE_URL` in app code | `runtimeDatabaseUrl()` |
| `prisma db push` in a raw script | `bun scripts/prisma-env.ts db push …` |
| `tailwind.config.js` | `@theme` literals in `globals.css` |
| `@layer utilities` | `@utility` (v4 native) |
| raw `window.location.href = url` | `downloadFile(url)` |
| `<div onClick>` | `<button>` (+ `aria-label` if icon-only) |
| component defined inside render | module-level component |
| hardcoded status color | extend the `*_META` map |
| `z-[9999]` | the flat z-scale (§18) |
| `rm db/*.db` under a live server | reseed in place |
| passing a row class to CardHeader (`cn` can't reset flex-col) | child row div — `FILTER_RAIL.headerRow` (§5.6) |
| `flex-1` content beside a wide table, no `min-w-0` | `RAIL_LAYOUT.content` — else the w-80 rail collapses at 1024px |
| wrapper divs inside a `space-y-*` body | spacing on the element itself (label `mb-2`/`mb-3`) — wrappers double-space |
| hand-writing page-level layout classes | import from `@/lib/page-layout` (single test-pinned source) |
| trusting a terminal echo containing `[m…` | read file bytes — ANSI display artifacts eat `[m` (session-6 lesson) |

## 17. Responsive Breakpoint Reference

Tailwind defaults (no custom config). Layout-critical usage:

| Breakpoint | What changes (all `PAGE_KPI_GRIDS`-pinned, §5.6) |
|---|---|
| base (<640) | EVERY KPI grid 1-col; drawer replaces sidebar; topbar hamburger + compact search; filter rails hidden |
| `sm` (≥640) | KPI 2-col on the sm-ladder pages (contacts waits for md); page headers go horizontal; header-button labels appear (`hidden sm:inline`) |
| `md` (≥768) | contacts KPI 2-col |
| `lg` (≥1024) | **the switch**: persistent sidebar, hamburger hides; `hidden lg:block w-80` rails appear; charts side-by-side (dashboard 2-col, leads 3-col); KPI: accounts 5-col, contacts/calendar 4-col, others 3-col; `lg:hidden` mobile card lists (contacts/leads) drop out |
| `xl` (≥1280) | dashboard/leads/activities KPI 6-col; reports 5-col |

Mobile verification width: **390px** (iPhone-class) — the e2e
mobile-nav suite and the reference defect both key off this width.

## 18. Z-Index Layer Map

Flat scale — no ad-hoc values, ever:

| Layer | Value | Element / location |
|---|---|---|
| Topbar | `z-40` | `sticky top-0` header (`topbar.tsx`) |
| Drawer + dialogs | `z-50` | mobile drawer, Radix dialog overlay/content |
| Dropdown portals | `z-[60]` | dropdown/select/popover content wrappers |
| Toasts | `z-[100]` | toast viewport (topmost, always) |

Rule: a new floating surface joins the NEXT free tier (110), or — better —
question whether it belongs inside an existing tier.

## 19. Color Reference (Complete)

Every token from `globals.css` `@theme` (source of truth; this table is a
mirror — fix both if either changes):

| Token | Hex | RGB | Tailwind class | Usage |
|---|---|---|---|---|
| `sidebar` | `#2563eb` | 37 99 235 | `bg-sidebar` | sidebar canvas |
| `sidebar-hover` | `#3b6ff0` | 59 111 240 | `hover:bg-sidebar-hover` | nav hover |
| `sidebar-active` | `#4d7ef5` | 77 126 245 | `bg-sidebar-active` | active nav row |
| `primary` | `#3b82f6` | 59 130 246 | `bg-primary`/`text-primary` | primary buttons, links, active states |
| `primary-hover` | `#2563eb` | 37 99 235 | `hover:bg-primary-hover` | primary hover |
| `primary-foreground` | `#ffffff` | 255 255 255 | `text-primary-foreground` | on-primary text |
| `background` | `#f9fafb` | 249 250 251 | `bg-background` | app canvas |
| `surface` | `#ffffff` | 255 255 255 | `bg-surface` | cards, topbar, dialogs |
| `foreground` | `#111827` | 17 24 39 | `text-foreground` | primary text |
| `muted` | `#6b7280` | 107 114 128 | `text-muted` | secondary text |
| `subtle` | `#9ca3af` | 156 163 175 | `text-subtle` | placeholders, icons |
| `line` | `#e5e7eb` | 229 231 235 | `border-line` | borders, dividers |
| `line-soft` | `#f3f4f6` | 243 244 246 | `bg-line-soft` | chips, hover fill, search pill |
| `success` / `success-soft` | `#10b981` / `#ecfdf5` | — | `text-success` `bg-success-soft` | positive deltas, won stages |
| `warning` / `warning-soft` | `#f59e0b` / `#fffbeb` | — | `text-warning` `bg-warning-soft` | due-soon, tier B |
| `danger` / `danger-soft` | `#ef4444` / `#fef2f2` | — | `text-danger` `bg-danger-soft` | errors, lost, overdue |
| `info` / `info-soft` | `#06b6d4` / `#ecfeff` | — | `text-info` `bg-info-soft` | informational chips |
| `chart-1…6` | `#3b82f6 #06b6d4 #f59e0b #f97316 #10b981 #ef4444` | — | inline styles | recharts series + sparklines |

Chart palette duplication note: `CHART_COLORS` in `constants.ts` repeats
the chart hexes for TS consumers — keep both lists aligned when changing
either (they are both literal by design).

**Forbidden:** raw palette classes (`bg-blue-600`, `text-gray-500`, …)
in app code — always the semantic token. (The single historical exception
is the login card's `bg-gray-900` dark "Sign in" button, measured from
the reference and kept deliberately.)

## 20. The Complete TypeScript Interface Reference

From `src/types/index.ts` (192 lines) — the API wire shapes shared by
handlers and the store. Prisma model types differ slightly (Dates not
strings; nulls as Prisma declares them).

```ts
export type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

export interface User {
  id: string; email: string; name: string; avatarColor: string; role: string;
}

export interface Account {
  id: string; name: string;
  industry: string | null; email: string | null; phone: string | null;
  website: string | null; annualRevenue: number | null; employees: number | null;
  tier: string; isKey: boolean; status: string;
  ownerId: string | null; owner?: Pick<User, "id" | "name" | "avatarColor"> | null;
  lastActivityAt: string | null; createdAt: string; updatedAt: string;
  _count?: { contacts: number; leads: number; activities: number };
}

export interface Contact {
  id: string; name: string; email: string | null; phone: string | null;
  company: string | null; position: string | null; source: string | null;
  priority: string; status: string;
  accountId: string | null; account?: { id: string; name: string } | null;
  ownerId: string | null; owner?: Pick<User, "id" | "name" | "avatarColor"> | null;
  lastActivityAt: string | null; createdAt: string; updatedAt: string;
}

export interface Lead {
  id: string; name: string; email: string | null; phone: string | null;
  company: string | null; value: number; stage: string; source: string | null;
  status: string; expectedCloseDate: string | null; closedAt: string | null;
  nextFollowUp: string | null;
  accountId: string | null; account?: { id: string; name: string } | null;
  contactId: string | null;
  ownerId: string | null; owner?: Pick<User, "id" | "name" | "avatarColor"> | null;
  createdAt: string; updatedAt: string;
}

export interface CrmEvent {
  id: string; title: string; description: string | null; type: string;
  status: string; startAt: string; endAt: string | null; allDay: boolean;
  location: string | null;
  accountId: string | null; account?: { id: string; name: string } | null;
  contactId: string | null; contact?: { id: string; name: string } | null;
  ownerId: string | null; owner?: Pick<User, "id" | "name" | "avatarColor"> | null;
  createdAt: string; updatedAt: string;
}

export interface Activity {
  id: string; type: string; subject: string; notes: string | null;
  status: string; priority: string; dueAt: string | null; completedAt: string | null;
  accountId: string | null; account?: { id: string; name: string } | null;
  contactId: string | null; contact?: { id: string; name: string } | null;
  ownerId: string | null; owner?: Pick<User, "id" | "name" | "avatarColor"> | null;
  createdAt: string; updatedAt: string;
}

export interface Settings {
  contactSources: string[]; leadStages: string[]; activityTypes: string[];
  accountTiers: string[]; industries: string[];
  defaultCurrency: string; defaultLeadStage: string; defaultTier: string;
  followUpDays: number; calendarView: string; firstDayOfWeek: string;
}

export interface SavedReport { id: string; name: string; tab: string; config: string; createdAt: string; }

export interface DashboardData {
  kpis: {
    totalLeads: number; totalLeadsDelta: number | null;
    dealsClosed: number; dealsClosedValue: number;
    revenueThisMonth: number; revenueDelta: number | null;
    salesTarget: number; salesTargetProgress: number;
    conversionRate: number;
    avgSalesCycleDays: number; avgSalesCycleDelta: number | null;
  };
  pipeline: Array<{ stage: string; label: string; count: number; value: number; color: string }>;
  revenueOverTime: Array<{ month: string; won: number; target: number }>;
  topReps: Array<{ id: string; name: string; avatarColor: string; deals: number; value: number }>;
  leadSources: Array<{ source: string; count: number; value: number }>;
  upcomingActivities: Array<Activity & { daysUntil: number }>;
  recentDeals: Array<Lead>;
}

export interface ReportsData {
  kpis: {
    totalLeads: number; totalLeadsDelta: number | null;
    openLeads: number; openLeadsDelta: number | null;
    wonDeals: number; wonValue: number; wonDelta: number | null;
    lostDeals: number; lostValue: number; lostDelta: number | null;
    conversionRate: number;
  };
  revenueOverTime: Array<{ month: string; won: number; lost: number; target: number }>;
  pipeline: Array<{ stage: string; label: string; count: number; value: number; color: string }>;
  funnel: Array<{ id: string; label: string; count: number; color: string }>;
  activitiesByType: Array<{ type: string; label: string; count: number; color: string }>;
  activitiesByOwner: Array<{ name: string; avatarColor: string; calls: number; emails: number; meetings: number; total: number }>;
  leadSources: Array<{ source: string; leads: number; won: number; value: number; winRate: number }>;
  accountHealth: Array<{ status: string; label: string; count: number; color: string }>;
  topAccounts: Array<{ id: string; name: string; revenue: number; industry: string | null }>;
  atRiskAccounts: Array<{ id: string; name: string; lastActivityAt: string | null; status: string }>;
  accountSummary: Array<{ id: string; name: string; industry: string | null; status: string; contacts: number; openLeads: number }>;
  recentWonDeals: Array<Lead>;
  topDeals: Array<Lead>;
  wonVsLostOverTime: Array<{ month: string; won: number; lost: number }>;
}

export interface SearchResult { accounts: Account[]; contacts: Contact[]; leads: Lead[]; }
```

Environment interface (3 vars): see §3.3.

---

## Appendix A: ADR Index

Full ADRs with context/decision/rationale/consequences/alternatives live in
`Project_Architecture_Document.md` §1. Index:

| ADR | Decision | One-line rationale |
|---|---|---|
| ADR-001 | Single Next.js 16 app (no monorepo) | one team, one deployable, smallest surface |
| ADR-002 | Prisma + SQLite, normalized relative paths | zero-config dev; the seam of §7.3 survives CLI/dev/standalone/bun |
| ADR-003 | Hand-rolled scrypt + HMAC cookie auth | one email/password flow doesn't justify an auth library |
| ADR-004 | One Zustand store, `{ok,data}` envelope | single client state model, no React Query |
| ADR-005 | Tailwind v4 CSS-first (`@theme` literals) | v4 ignores JS config; literal hex = measurable parity |
| ADR-006 | The mobile drawer navigation | the reference ships NO mobile nav — fixed deliberately |
| ADR-007 | Vitest pure seams + Playwright golden path | unit-test the seams, e2e the user-visible contract |

## Appendix B: Test Inventory & Runtime Costs

| Suite | File | Checks | Runtime |
|---|---|---|---|
| db-path | `tests/db-path.test.ts` | 16 | ~10 ms |
| auth | `tests/auth.test.ts` | 9 | ~210 ms (scrypt KDF) |
| format | `tests/format.test.ts` | 23 | ~19 ms |
| page-layout | `tests/page-layout.test.ts` | 17 | ~7 ms |
| csv | `tests/csv.test.ts` | 8 | ~6 ms |
| constants | `tests/constants.test.ts` | 8 | ~5 ms |
| rate-limit | `tests/rate-limit.test.ts` | 6 | ~29 ms |
| avatar | `tests/avatar.test.ts` | 5 | ~4 ms |
| **unit total** | 8 files | **92** | **<1 s** |
| e2e auth (logged out) | `tests/e2e/auth.spec.ts` | 3 | — |
| e2e setup (login) | `tests/e2e/auth.setup.ts` | 1 | — |
| e2e golden path | `tests/e2e/crm.spec.ts` | 12 | — |
| e2e mobile nav regression | `tests/e2e/mobile-navigation.spec.ts` | 5 | — |
| **e2e total** | 4 files | **21** | **~25 s** (incl. server boot) |

Full gate wall-clock: lint ~10 s, typecheck ~8 s, unit <1 s, build ~40 s,
e2e ~25 s → roughly 90 s end-to-end. Costs worth knowing: e2e reseeds
`db/e2e.db` in place (global-setup) and boots the standalone build on
:3100; the auth suite pays the scrypt KDF cost; everything else is
sub-millisecond per check.

## Appendix C: Audit History

**Session 1 (initial build)** — recon of the reference app (23 captures),
full codebase build, bugs #1–#5 found and fixed, gate green at 47 unit +
20 e2e, pushed as `e16efb9` + `7f71cca` (architecture docs + screenshots).
Bug #6 (reports sentinel) and #7 (eslint key) found during screenshot QA
before the final push.

**Session 2 (remediation)** — planned in
`docs/plans/2026-09-29-session2-remediation.md`, executed TDD:

- R-1 (Critical): the database-outside-the-repo bug, root-caused through
  controlled experiments E1–E21 to bun's `.env`-relative absolutization +
  first-boot fallthrough; fixed by the §7.3 seam + the `db:push` wrapper;
  9 new unit checks; live-verified via `/proc/<pid>/fd`.
- R-2/R-3: stale `.env.example` PostgreSQL name and vitest.config comment
  (prior-project leftovers) corrected.
- R-4: unused dependencies `tailwindcss-animate` + `z-ai-web-dev-sdk`
  removed from `package.json`, `scripts/install_packages.sh` and both
  lockfiles.
- Visual-parity iteration (VLM-verified): KPI label casing, sparklines on
  dashboard + accounts KPI cards, the reference's three-button header row,
  working All-Owners filter, "More..." link.
- Gate after remediation: lint 0/0 · typecheck clean · 65/65 unit ·
  build clean · 21/21 e2e; both db files inside the repo; mobile drawer
  re-verified live at 390px.

**Session 3 (parity hardening)** — planned in
`docs/plans/2026-09-29-session3-parity-remediation.md` (P-1…P-17),
executed TDD after a fresh-login audit revealed the reference's demo data
had been reset to zero (both current and session-1 captures are zero-data,
so structure — not data — is the parity target):

- P-1…P-4: reference identity + display chrome — demo user renamed to
  `sepnetflix2023` with the light-grey avatar (luminance-aware ink in
  `avatar.tsx`), bell dot removed, user dropdown reduced to text-only
  Profile/Logout, sidebar icons (Accounts → `User`, Contacts →
  `CircleUserRound`), ring-only brand, Settings below a divider (not
  bottom-pinned), `$`-attached currency everywhere (`$145.0k`/`$1.4M`).
- P-5…P-16: per-page anatomy — plain-text deltas + line/area/bar sparkline
  variants (`page-parts.tsx` stat-card family: KpiCard, IconStatCard,
  CircleStatCard, TrendStatCard), count-axis pipeline chart with `$`
  legends, area-filled revenue chart, Title-Case table headers + chevron
  sort indicators, contacts/leads/reports/calendar stat-card iconography,
  Sunday-anchored calendar grid + search + Type/Date filters panel,
  activities six-card row + segmented tabs + recharts by-type chart,
  reports Saved-Reports button + white filter card + pill tabs, settings
  instant-save picklists, profile page rebuilt to the reference layout
  (Personal Information form + four stacked account cards, new
  `PATCH /api/users`).
- Gate after session 3: lint 0/0 · typecheck clean · 65/65 unit ·
  build clean · 21/21 e2e (mobile-nav regression intact).

**Session 4 (pixel-grade parity hardening)** — planned in
`docs/plans/2026-09-29-session4-parity-remediation.md` (G-1…G-15), executed
TDD. The audit method itself leveled up: instead of VLM screenshot reads,
every finding was extracted from the **live reference's DOM** (computed
styles, lucide class names, outerHTML anatomy) — which overturned several
session-3 VLM-based conclusions (see the lesson below):

- G-1/G-2: **chart palette re-pinned** — pipeline Proposal = `#eab308`
  (yellow-500) and Won = `#9ca3af` (grey-400, chart hex only — badges stay
  emerald); dashboard sparklines: Total Leads + Avg. Sales Cycle = LINE
  `#10b981`, Deals Closed bars `#22d3ee`, Revenue bars `#4ade80`, Sales
  Target two-tone `#fbbf24`/`#3b82f6`, Conversion Rate area `#8b5cf6`.
  All frozen by the new `tests/constants.test.ts` (3 checks).
- G-3: revenue chart = BOTH series filled recharts Areas (Won `#10b981` +
  Target `#ef4444`), 7-tick month window (current + 6 back) under the
  "Last 6 months" caption.
- G-4/G-6: **two stat-card anatomies formalized** — new `BarStatCard`
  (label + trending-icon delta top / bold value left + `h-10` mini-bar
  strip right, bars from the tailwind -400 family) replaces the accounts
  KpiCards and backs the activities cards; `trending-up` glyphs on %
  deltas, `trending-down` on overdue.
- G-5: sort icons — `ArrowUpDown` (h-4) on inactive sortable headers,
  directional chevron on the active one; sortability per table (leads:
  Lead Name/Email/Value; contacts: Last Activity only; accounts: none).
- G-7: profile rebuilt to DOM truth — blue-100 80/96px avatar circle with
  a user glyph, camera-icon Upload Photo, near-black Save Changes
  (rgb(23,23,23)), four right-column cards each with a 48px tinted chip
  (blue-100/user, green-100/mail, purple-100/shield).
- G-8/G-10: tab variants — segmented track is `h-9 grid w-full
  grid-cols-N` (activities ×4, settings ×3); reports pill track is a
  white bordered `grid-cols-2 lg:grid-cols-N` with active `bg-blue-50
  text-blue-700`.
- G-9: reports revenue chart drops its legend. G-11: by-type chart
  categories = Call/Email/Meeting/Task/Note (WhatsApp is quick-log only).
- G-12: calendar selected day = solid `bg-sidebar` (blue-600) cell with
  white text; month heading promoted to `h2`. G-13: contacts cards get
  the reference gradient + trend row (trending-up + green "+N"); New This
  Month chip = green-500 `#22c55e`. G-14: KpiCard typography matched
  (p-4 sm:p-6, text-2xl sm:text-3xl font-bold, delta text-xs mb-1).
- **Tailwind v4 pitfall caught mid-implementation**: dynamic
  `` `grid-cols-${cols}` `` template strings never compile (v4 scans for
  literal class names) — `tabs.tsx` uses a static `GRID_COLS` record.
- Gate after session 4: lint 0/0 · typecheck clean · **68/68 unit** ·
  build clean · **21/21 e2e**; every G-item re-verified in the live DOM
  of the running clone (colors, icons, tab classes, sort icons, selected
  day cell) at 1512×945 and 390×844.

**Session-4 lesson — DOM extraction beats VLM reads.** Session 3 had
"verified" teal-line/purple-area sparkline types and single-chevron sort
glyphs from VLM screenshot reads; the DOM showed the line sparklines were
`#10b981` (not teal), several cards carry trending icons the VLM never
mentioned, and inactive sort headers are `arrow-up-down` (not chevrons).
Rule: **VLM for layout/what-is-there, `getComputedStyle` + outerHTML for
exact colors/icons/anatomy.** A VLM claim about a color or icon is a
hypothesis until the DOM confirms it.

**Session 5 (interactive-layer parity)** — planned in
`docs/plans/2026-09-29-session5-parity-remediation.md` (S5-1…S5-16),
executed TDD. The audit went one layer deeper than session 4: beyond
static anatomy into dialogs, option vocabularies, table density and
responsive column hiding:

- **Table system**: shared Table retuned to the stock shadcn density (th
  `h-10 px-2`, td `p-2`); contacts headers `font-semibold text-gray-700`
  with the reference's dead `w-64 cursor-pointer` Name column; per-page
  wrappers (accounts/leads `rounded-lg border-0 shadow`, contacts
  bordered `rounded-xl` + `overflow-hidden`); in-table centered
  `TableEmptyRow` empty states (py-8/py-12); leads hides columns
  progressively (Phone md, Company lg, Source xl).
- **Dialogs**: CREATE forms mirror the reference's exact field sets and
  hardcoded option lists (Lead Status = New/Contacted/Qualified/
  Unqualified, Lead Source = Call/Email/Website/Partner, Contact
  "How did you meet?" = the five emoji options with required Email,
  Account = 8 fields, Event gains Related To [None/Contact/Account/
  Opportunity/Lead] + six event types, Activity gains Related To
  (Type) + freeform (Name) and drops its Status select). EDIT keeps the
  full superset. New `Event.relatedType` + `Activity.relatedType`/
  `relatedName` columns.
- **Stat cards**: activities subtext deltas ("+N today", "+0h 45m",
  "Due now") under the value; reports CircleStatCard rebuilt (square
  tinted chip, count + amount inline `text-2xl font-bold`, uppercase-K
  currency `$542.0K`/`$196K`); leads cards get the compact variant
  (text-xl sm:text-2xl values, full `$687,000` currency); card
  primitives retuned (p-6 headers, `text-base sm:text-lg` titles).
- **Vocabulary model**: `unqualified` stage added (dropped = lost +
  unqualified via `isDroppedStage()`); seed sources remapped onto the
  reference vocabularies with values/stages unchanged.
- Gate after session 5: lint 0/0 · typecheck clean · **75/75 unit** ·
  build clean · **21/21 e2e** (mobile-nav regression intact); every
  S5-item re-verified in the live DOM at 1512×945 + 390/768/1024/1280
  widths.

**Session-5 lesson — audit the interactive layer, not just the pixels.**
Four sessions of visual hardening had left every create dialog, filter
vocabulary and table-density convention divergent, because screenshot
comparisons of zero-data pages never open the dialogs. Rule: **parity
audits must CLICK things** — open every dialog, expand every listbox,
and read the option lists, because a dialog's option vocabulary is as
visible as its colors.

### Session 6 — layout-system parity (commit pending)

Audit layer: the layout system itself — the one stratum no previous
session systematically extracted. 14 DOM-verified gaps (S6-1…S6-14):
app-shell scroll model (sticky topbar + window scroll → static topbar +
`main` as scroll container, no max-width), PageHeader anatomy (+contacts/
leads variants), per-page header-button sizing/labels/disabled states,
KPI ladders (2-col phone base → 1-col + sm/lg/xl climbs), dashboard
filter card, accounts/calendar/activities flex+w-80 rails, contacts
mobile card list, leads merged card, reports sticky bar, settings/profile
max-width wrappers, topbar padding, dual scroll lock.

- **Method**: all layout classes distilled into `src/lib/page-layout.ts`
  (TDD red-first, 17 pins) and consumed by every page — the layout system
  has a single test-pinned source of truth.
- **Gate**: lint 0/0 · typecheck clean · **92/92 unit** · build clean ·
  **21/21 e2e**; DOM re-verification at 1512/1280/1024/768/390 on all
  9 routes; rails exactly 320px at 1024; zero horizontal overflow at 390.
- **Post-VLM refinement round**: rail headers re-pinned (Save All ghost vs
  calendar's blue Clear All link, title-as-row outlier), label spacing
  split (select mb-2 / checkbox mb-3), activities 4-checkbox + functional
  More Filters (1) expander, contacts toolbar re-extraction (max-w-md
  search + outline Filters button), 16px rail titles.

**Session-6 lesson #1 — verify "broken class" claims against file bytes.**
The audit terminal displayed `xl:grid-cols-inmax(…)` (missing `[m`) for
three rail pages and the finding went into the plan as a bug. The file
bytes were always the valid `xl:grid-cols-[minmax(…)]` — the terminal ate
`[m` as an ANSI escape sequence. The REAL gap was the xl-single-grid model
vs the reference's flex + `lg` rail. Rule: **class-string findings must be
re-read from the file (Read tool / python) before entering a remediation
plan.**

**Session-6 lesson #2 — flexbox `min-width: auto` breaks fixed rails.**
A `w-80` rail beside `flex-1` content collapsed to 186px at exactly
1024px because the content column's intrinsic min-width (a wide table
inside `overflow-x-auto`) overrode the rail's fixed width. Fix:
`min-w-0` on the content column (`RAIL_LAYOUT.content`). Rule: **every
`flex-1` sibling of a fixed-width column needs `min-w-0`** — and rail
widths must be asserted at the rail's entry breakpoint (1024), not just
at desktop width.

## Appendix D: Live-Site Validation Methodology

The parity loop that caught the sparkline/casing/button drift — reuse it
for any visual change. **Session-4 upgrade: when you need EXACT colors,
icon names or anatomy, skip step 3 for that detail and extract it from
the live DOM instead** (`agent-browser eval` + `getComputedStyle`,
`svg[class*=lucide]` class names, `outerHTML` of the card in question) —
VLM reads of colors/icons are hypotheses, DOM values are ground truth.

1. **Capture the reference** (one-time; stored under `docs/` or a local
   `target-app-screenshots/` folder): log in with the demo credentials,
   screenshot every page at 1440×900 and the mobile width 390×844.
2. **Run the clone** (`bun run dev`) and capture the same routes with
   `agent-browser` (`set viewport`, `open`, `wait --load networkidle`,
   `screenshot <absolute path>` — the daemon resolves relative paths
   elsewhere; ALWAYS pass absolute paths).
3. **Compare with VLM**: both images into a vision model with a pointed
   prompt — "list ONLY meaningful visual differences, ignore data
   values" — then a second, zoomed prompt for any area needing exact
   detail (labels, colors, counts). One broad pass + one zoom pass beats
   one giant prompt.
4. **Classify the output**: (a) real parity gap → fix; (b) intentional
   data difference (the reference account was empty at capture time) →
   ignore; (c) reference defect → add to §5.5's register and decide
   consciously.
5. **Re-capture** the changed pages and re-run the comparison until the
   verdict is HIGH parity.
6. Functional spot-checks in the same session: login flow, dashboard
   KPIs, the mobile drawer interaction set (open → navigate → Escape →
   scroll lock), global search.

What live-site testing catches that CI cannot: CSS-only regressions (the
postcss bug), env-rewrite behavior (bun absolutization — visible only by
inspecting a live process's file handles), and "works but looks wrong"
drift.
