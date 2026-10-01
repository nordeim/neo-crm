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
version: 1.15.0
last_updated: 2026-09-30
project_state: 326 unit checks + 50 e2e checks green; database pinned to <repo>/db/custom.db; chart palette + dialog vocabularies + layout/chrome contracts + view-switcher/leads-popover/mobile-nav-breakpoint/login-reset/chart-geometry/stat-shadow/table-shadow/contacts-layout/page-titles/charts-contracts/profile-route contracts DOM-pinned by tests (constants.test.ts, page-layout.test.ts, lead-filters.test.ts, login-reset.test.ts, page-titles.test.ts, charts-contracts.test.ts, profile-route.test.ts); table density + card typography + dialog contract + the full layout system + the app chrome (session-7) + the functional control layer (view switchers, filters popover, quick-log buttons — session-8) + the component-anatomy layer (session-9) + the stock-primitive layer (session-10: input/select/textarea stock internals, ink/placeholder tokens, the global cursor rule, the topbar search on the shared Input, the blur-scale re-pin) + chart internals (recharts defaults everywhere, the REAL chart at zero data — ChartEmpty retired, the leads-page FunnelChart, the 8-slug reports pipeline, row-derived vs fixed series split) + the reports tabs 2-4 re-mirror + per-page titles + the login card's in-place reset-password flow (signin→reset→sent, session-11) + per-surface chart geometry (300/250/150 + stock legends) + stat-card shadow scales + the reports bare-tabs layout + the contacts full-height architecture (session-11) + the border-color split (#e5e5e5 default / #e5e7eb explicit family) + stock Radix tab strips + the recharts monotone sparklines + the custom 404 + the KPI de-hover (the reference moved) + the drawer focus-entry retry (session-12) + the auth absolute titles + the explicit dashed grids (strokeDasharray "3 3" — recharts default is SOLID, the s10 pin was a misread) + the reports funnel as a horizontal BarChart + the rounded-md button radius + the per-page CardTitle map + the #0a0a0a foreground + the 16px base font + the stock Label/DialogTitle + the stock DropdownMenu account menu + the profile page neutral family + the complete by-type card + the bordered calendar cells + the avg-cycle delta removal (session-13) + the settings Defaults/Data tab structures + the /Profile casing alias + the line-soft #f5f5f5 re-pin + the v4 space-y inline-label no-op fix (session-14) + the entity-dialog geometry layer (session-15: stock shadcn dialog chrome — w-full/sm:rounded-lg/shadow-lg/slide animations, the bg-black/80 no-blur overlay, centered-mobile headers, the opacity close X, no descriptions, no placeholders; two body families — the max-w-lg py-4 space-y-2+controlMt dialogs with Lead Status/Source 2-col, the 2-col Account body, the Contact gradient-avatar section; the max-w-2xl Event/Activity space-y-4 bare-pair family with pt-4 footers; the Event blue submit expressed via the --primary tokens because v4's literal bg-blue-600 compiles to a DIFFERENT oklch blue) + the responsive page-root layer (session-16: PAGE_ROOT standard/bare, the stock table kit + the th/td platform reset, the TABLE_CARD plain-div border-leak rule, the md settings grid, the flat calendar card) + the stock button/checkbox layer (session-17: the account trigger as the stock ghost Button with the two-level Avatar, the icon-glyph census — 14 swapped surfaces + the hand-rolled polygon FilterPolygon because lucide 0.525 re-exports the curved Funnel as Filter, the stock Radix-style button checkbox with the dark #171717 checked fill, the default variant's bare shadow, the ghost's no-text-color) + the document metadata layer (session-18: the reference's 405-char meta description mirrored verbatim as SITE_DESCRIPTION in src/lib/site.ts, the full OG + Twitter card family with the 1200x630 og-image, the file-convention favicon, robots.txt + sitemap.xml as byte-format route handlers because Next's serializers drift — User-Agent case + priority number collapse — and the quarter-boundary time-bomb fix in the reports e2e) aligned to the live reference; the build script's static-copy step (bare `next build` leaves the standalone server chunkless) documented
---

# NEO CRM — Engineering Skill (SKILL.md v1.15.0)

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
  --color-subtle: #9ca3af;          /* tertiary text, icons */
  /* Session-10 stock-primitive inks: typed text in inputs/selects and
     placeholders — the reference's --foreground 3.9% / --muted-foreground
     45.1% (computed probes). */
  --color-ink: #0a0a0a;             /* input/select typed text */
  --color-muted-ink: #737373;       /* placeholders */
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
simply hides its sidebar below `md` (768px — session-7 live verification)
and ships NO replacement — phone users cannot navigate. The clone ships a
proper drawer:

- hamburger trigger (`MobileNavTrigger`) visible below `md` (the drawer
  and trigger are `md:hidden`, matching the reference sidebar's
  `hidden md:flex`)
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
| Reference REGRESSIONES between sessions: the calendar header search and the reports-bar Reset button disappear and reappear on redeployes | Re-extract every chrome detail each session; session-7 restored both (the Reset actually resets filters, the search filters by event title — functional supersets over the live-dead controls) |
| Reference sidebar nav hrefs are `/Dashboard` (capitalized) | Canonical `/` routes kept |
| Reference login logo is a hotlinked Supabase screenshot | CSS brand mark (white circle + blue dot) — same shape, no external asset |
| Reference CardTitle is a `<div>` (no heading semantics) | Ours stays `<h3>` — a11y superset, e2e asserts heading roles |
| Reference placeholder typo "Add new industrie" (settings) | Mirrored (like "Conversion Funnel") — SETTINGS_PICKLIST pins it |
| Recent Deals duplicate "Status" column (dashboard) | Mirrored (session-9 S9-9) — EIGHT headers pinned by RECENT_DEALS; both cells render the same badge |
| Reports empty table rows carry NO vertical padding | Mirrored (session-9 S9-10) — EMPTY_STATE.reportsRow |
| Top Reps header shows "Deals"/"Owner" right-aligned in flex gap-8 | Mirrored (session-9 S9-17) — TOP_REPS |
| Profile Role input shows the raw lowercase "user" | Mirrored (session-9) — raw user.role, no capitalization in the input |

### 5.6 The layout + chrome system — `src/lib/page-layout.ts` (sessions 6–7)

Every page-level layout AND app-chrome class string lives in ONE
test-pinned module (300 lines; `tests/page-layout.test.ts`, 37 checks).
Pages and chrome components import records — they never hand-write layout
classes. Reference token mapping: gray-50 → `background`, white →
`surface`, gray-200 → `line`, gray-500 → `muted`, gray-600/700 use the
literal Tailwind palette (not in the token set).

- **`PAGE_KPI_GRIDS`** — every KPI ladder starts at `grid-cols-1` (phones)
  and climbs: dashboard/leads/activities `sm:2 lg:3 xl:6`, accounts
  `sm:2 lg:5`, contacts `md:2 lg:4`, calendar `sm:2 lg:4`, reports
  `sm:2 lg:3 xl:5` — all `gap-4 mb-6`.
- **`PAGE_HEADER`** — standard stacks on phones (`flex-col sm:flex-row`,
  `mb-6 gap-4`, h1 `text-2xl sm:text-3xl font-bold`, actions
  `w-full sm:w-auto`); contacts is the flat variant (`text-3xl`, plain row,
  `gap-3`); leads adds `sm:mb-8`. Subtitles split by page (session-7):
  contacts/leads/settings/profile render **16px**, calendar + reports
  render **14px** (`subtitleSm` — pages pass `subtitleSize="sm"`).
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

**Shell scroll model (the session-7 reference truth):** the root is
`flex h-screen` (SHELL_LAYOUT) — the window NEVER scrolls. The sidebar is
an IN-FLOW `hidden md:flex w-64` flex child; the main column is
`flex-1 flex flex-col overflow-hidden`; `main.flex-1.overflow-auto` is the
ONLY scroller (verified: mainScrollable=true, windowScrolls=false); content
wrapper `p-4 sm:p-8 min-h-screen`, NO max-width. The static topbar
(`bg-white border-b px-4 sm:px-8 py-4`) sits in the column above main, so
it never moves; the reports sticky bar sticks to MAIN's top, not the
window's.

**Session-7 chrome records** (all live-extracted):

- **`NAV_LAYOUT`** — brand `p-6 gap-3` (40px white circle + 24px blue dot
  + `text-2xl font-bold` wordmark); links `px-4 py-3` + `hover:bg-white/5`
  + flat active `bg-white/10` (no bold bump); icons uniform `h-5 w-5`
  stroke-2; footer group `mt-auto space-y-1 pt-4 border-t border-white/10`
  (bottom-pinned).
- **`TOPBAR_LAYOUT`** — static header + `justify-between gap-4` inner row;
  search hidden below `sm` (`flex-1 max-w-xl` block, icon `h-5 w-5`,
  input `h-9 rounded-md pl-10 bg-gray-50`); mail/bell `h-9 w-9 rounded-md`
  + `h-5 w-5` icons; right group `gap-2 sm:gap-4`; user button a
  RECTANGULAR ghost h-9 (`px-4 py-2 gap-1 sm:gap-2`) with a
  `text-gray-700` label, 32px `bg-gray-200 text-gray-600` initial avatar
  and `h-4 w-4` chevron; user menu `min-w-[8rem]`, plain Profile/Logout
  (no separator, no destructive red).
- **`LOGIN_LAYOUT`** — the reference's slate login: gradient page wrapper,
  borderless `bg-white/95 backdrop-blur-sm shadow-2xl` card with an `h-1`
  gradient accent strip, centered column (CSS logo `h-20 w-20 sm:h-24
  sm:w-24 ring-4 ring-white/50` + glow, h1 `text-2xl sm:text-3xl
  text-slate-900`), white Google button (`px-5 py-3.5 rounded-xl
  text-[16px]`), `my-6` divider, `h-11 sm:h-12` slate-50/50 inputs,
  slate-900 submit, slate footer links.
- **`STAT_CARD`** — TrendStatCard (calendar KPIs): `p-4` body, `mb-3` top
  row, 40px `-50` tinted chips (`bg-blue-50` + `text-blue-600` icon
  `h-5 w-5`), trend `flex items-center gap-1 text-xs text-green-600` with
  a `w-3 h-3` trending-up glyph, label `text-xs text-muted mt-1` under the
  `text-2xl font-bold` value.
- **`ACTIVITY_CARD`** — activities card titles are literal
  `<h2 class="text-lg font-semibold">` elements (Priority row `mb-4`,
  Timeline row `mb-6` inside the `p-6` card); the Timeline action is a
  ghost h-8 button with the literal "•••" TEXT (three middle dots, not an
  SVG glyph); empty states `py-8` (panels) / `py-12` (Timeline) at 16px.
- **`DASHBOARD_CARD`** — the Lead Sources / Upcoming Activities Add
  buttons are ghost h-8 with `text-primary` (blue-600) + `Plus h-4 w-4
  mr-1`; the ellipsis actions are ghost `h-8 w-8`.
- **`SETTINGS_PICKLIST`** — items `space-y-2 mb-4`; empty state a plain
  `text-sm text-center py-4` paragraph (no dashed box); add action a
  PRIMARY h-9 icon-only Plus; "Add new industrie" typo mirrored.
- **`REPORTS_FILTER_BAR` re-pins (session-7)** — the bar buttons dropped
  to h-8 (`barBtn`) with `mr-2` leading icons (`barBtnIcon`); the Reset
  button is BACK on the reference (functional here — resets the four
  selects); the first two selects (period/owner) wrap in
  `flex items-center gap-2` rows with calendar/user leading icons.
- **Design tokens (session-7)** — `--color-primary` is `#2563eb`
  (blue-600, live-computed `rgb(37,99,235)`; blue-700 hover), NOT blue-500
  as earlier sessions pinned; delta texts are `text-green-600` /
  `text-red-600` (live-computed `rgb(22,163,74)` / `rgb(220,38,38)`); the
  bordered Card family carries `shadow` (not shadow-sm); the base Input is
  stock `rounded-md`.

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

### 15.4 Sparkline (recharts monotone for line/area, CSS for bars)

```tsx
<Sparkline values={monthlyWon} color={CHART_COLORS.cyan} />            // bars
<Sparkline values={won} color={CHART_COLORS.emerald} variant="line" /> // recharts monotone, sw 2
<Sparkline values={won} color={CHART_COLORS.violet} variant="area" />  // fill 0.3 + sw 1
```

(`src/components/shared/page-parts.tsx` — session-12 rebuild: the
reference renders its line/area sparks as recharts MONOTONE curves in a
ResponsiveContainer; only the bar strips stay CSS. Geometry pinned as
`KPI_SPARK` in page-layout.ts.)

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

## 16b. Session-10 Layer (stock primitives, chart internals, reports tabs)

**The blur-scale rename (S10-P0):** the same v3→v4 rename family as the
shadow bug — v4 `backdrop-blur-sm` compiled 8px where the reference's
computes 4px. One `@theme` re-pin (`--blur-sm: 4px`), pinned by the
design-tokens suite. Whenever a reference surface renders visibly
"heavier/stronger" than ours at class-identical markup, suspect a v4 scale
rename (shadow, blur — check `rounded-*` and `ring` too).

**The global cursor rule (S10-1):** the reference's platform CSS ships
`button, [role="button"] { cursor: pointer; }`. Ours computed the arrow
cursor on every button. Landed in the base layer of globals.css; Radix
menu items keep their own cursor-default exactly like the reference. The
mobile drawer overlay keeps its deliberate `cursor-default` (our fix, not
a parity surface).

**Stock-primitive inks (S10-2):** two tokens — `--color-ink` #0a0a0a
(the reference's --foreground 3.9% — typed text in inputs/selects/
textareas) and `--color-muted-ink` #737373 (its --muted-foreground —
placeholders). Page-level text keeps `--color-foreground` #111827 (the
reference's h1s/body render gray-900 there). NEVER "fix" the difference
between the two blacks — it is the reference's own split.

**Chart defaults (S10-4/5/11):** pass NO `content` to Tooltip, NO tick
style, NO grid style — the reference ships stock recharts (default tooltip
white/#ccc box, ticks 12px #666, CartesianGrid dashed "3 3" #ccc with
horizontal AND vertical lines). Charts render the REAL output at all-zero
data; the ChartEmpty placeholder era is over. The zero-state split:
FIXED lists render ticks at zero; ROW-DERIVED series
(`monthsFromEvents`) render empty. The Conversion Funnel is a FunnelChart
— the `Funnel` takes its own `data` prop with per-datum `fill` (a Cell
children pattern renders empty trapezoid groups — verified the hard way).

**The 8-slug reports pipeline (S10-6):** `REPORTS_PIPELINE_SLUGS` +
`reportsBucketCounts` — the reference's merged-list quirk (new≡prospecting
and qualified≡qualification double-report; won→closed_won; raw snake_case
labels, no title-casing). Pinned by constants.test.ts.

**Reports tabs 2–4 (S10-8):** rebuilt to the reference's structure — see
AGENTS.md for the full per-tab contract. The "Average Accuracy: N%"
caption is a `text-sm text-gray-500` centered <p> UNDER the wide
Forecasting Accuracy chart. Tab 2 ships NO KPI cards.

**Per-page titles (S10-10):** thin SERVER `page.tsx` wrappers + renamed
client parts (`*-page.tsx`). Per-route `layout.tsx` metadata hits a Next 16
typed-routes generation bug (`LayoutRoutes` not assignable to `"/"`) — use
the wrapper pattern.

**Display-layer artifact (tooling):** raw `cat`/`grep` output can EAT the
literal two-char sequences `[m` and `[h]` (ANSI escape remnants) —
`const [mobileNavOpen` displayed as `const obileNavOpen`. When a file
looks corrupted but the compilers pass, verify with character ORDINALS
(`[ord(c) for c in line[:30]]`) before touching anything. (This is the
session-6 "broken grid-cols class" artifact, now understood.)

## 16c. Session-11 Layer (login reset flow, chart geometry, stat shadows, reports de-card, contacts architecture)

**The space-y v4 hazard (the session's one new rename-family bug):** v4
wraps `space-y-*` in `:where()` AND flips its semantics to margin-BOTTOM
on `:not(:last-child)`. The reference's login reset view ships `-mb-2` on
its Back button, which under ITS v3-era space-y (margin-TOP on following
siblings) computes a 16px gap — under v4 the `-mb-2` (0,1,0) WINS against
`:where(…)` (0,0,0) and produced an 8px OVERLAP. Rule: when mirroring
negative margins that ride on space-y gaps, re-derive from the reference's
COMPUTED gap (`mb-4` there), never copy the class string.

**The login reset flow (S11-P1):** "Forgot password?" is NOT dead on the
reference — it swaps the card IN PLACE (URL unchanged): signin → reset →
sent; no email is actually sent (the confirmation is pure client state).
The two views replace the login column entirely (no logo / Google button /
divider) and live in `src/lib/login-reset.ts` (`LOGIN_RESET_LAYOUT` +
`nextLoginView()` + `canSubmitReset()`, pinned by `tests/login-reset.test.ts`).
The reset email input's placeholder is LIGHTER than the sign-in fields'
(slate-400 vs slate-600 — the reference's own inconsistency, mirrored), and
its submit is one size smaller than Sign in's (h-10 sm:h-11 vs h-11
sm:h-12).

**Chart geometry (S11-P3):** `CHART_GEOMETRY` in page-layout.ts —
dashboard + all reports tab charts render at **300px** (tab-2 Forecasting
Accuracy is the full 1142px-wide card), the leads rail charts at **250px**,
the activities by-type at **150px**. Legends are the recharts DEFAULT
`<Legend />` (plainline icons, series-colored text) — the custom
circle-8px/gray legends are retired (same no-props rule as the s10
tooltips).

**Stat-card shadows (S11-P4/5):** every stat-card family carries bare
`shadow` (`STAT_SHADOWS`): KpiCard, BarStatCard, TrendStatCard,
IconStatCard (both variants) and CircleStatCard. The dashboard + reports
KPI cards additionally hover (`hover:shadow-md transition-shadow`). The
entity TABLE cards differ: accounts/leads `rounded-lg shadow` (no border)
vs contacts `rounded-xl border shadow-sm overflow-hidden` (the only
tiny-shadow table card — `TABLE_SHADOWS`).

**Reports de-card (S11-P7):** the pill tab bar + panels render BARE in the
page (a `space-y-6` container directly under the KPI row — no Card
wrapper; content spans the full 1192px at 1512). Every reports tab grid is
`gap-6` and the tab bodies are `space-y-6`. The sticky filter card above
the KPI row stays a separate element.

**Contacts architecture (S11-P8/9):** the reference's only full-height
layout — `CONTACTS_LAYOUT`: `main > flex h-[calc(100vh-64px)] > flex-1
overflow-auto > p-8 > content`. The calc's 64px is 5px short of the real
69px topbar (a reference quirk mirrored verbatim — main overflows 5px);
the padding is p-8 at ALL widths (32px at 390px where every other page
ships p-4 sm:p-8 = 16px).

**Dead reference surfaces (re-confirmed):** every Export button
(dashboard/leads/reports/accounts/contacts/activities) and the login
"Sign up" link are dead on the reference platform (no request / toast /
download) — mirrored as no-ops. At 390px the topbar hides search + mail +
bell; only the user menu shows.

## 16d. Session-12 Layer (mobile-nav focus race, border split, tabs anatomy, KPI drift, sparkline rebuild, custom 404)

**The mobile-nav focus race (S12-P1).** The drawer's initial focus RETRIES
across frames: the rAF callback can run in the SAME frame as the
`transition-[visibility]` class flip — before the browser has applied the
now-visible state — and `focus()` on a `visibility:hidden` element
SILENTLY NO-OPS (instrumented live: focus() WAS called, activeElement
never moved; keyboard users Tabbed through the background behind the
aria-modal dialog — WCAG 2.4.3). The fix verifies `activeElement` landed
inside the panel and re-schedules up to 5 frames (observed: lands frame
3), with a `cancelled` flag so the effect cleanup stops pending retries.
The panel also switched `h-full` → `h-dvh` (mobile-nav taxonomy class D).
`mobile-navigation.spec.ts` grew to 7 checks (focus-entry included).

**The border-color split (S12-P3).** The reference renders TWO border
grays: its platform DEFAULT is **#e5e5e5** (neutral-200) — every
bare-`border` surface computes it (ALL stock cards, table rows, the
tablists, outline buttons, select triggers/contents, dropdown contents,
dialog content, bare form inputs) — while an EXPLICIT `border-gray-200`
family (#e5e7eb) covers only the reports KPI cards, the reports sticky
filter card, the contacts table card and the topbar search input. Login
keeps its own slate-200 family. `--color-line` re-pins to #e5e5e5 and
`--color-line-strong` carries #e5e7eb (pinned in design-tokens.test.ts).
Lesson: a single "border gray" assumption hid a two-gray reality —
computed border colors must be probed PER SURFACE.

**Tabs anatomy (S12-P4).** The tab strips ship the reference's stock
Radix classes (`TABS_PILL`/`TABS_SEGMENTED`): tracks carry
`text-muted-ink` (inactive tabs INHERIT #737373), triggers are
natural-height with `transition-all`, `ring-offset-background` and
`data-[state=active]:*` variants riding a `data-state` attribute; the
ACTIVE pill carries the BARE `shadow` scale (the s6 shadow-sm pin was one
step light); the pill trigger is `text-xs sm:text-sm`; NO tab ships hover
classes. The reference's tabs are all `tabIndex=-1` (keyboard-unreachable
platform defect) — our roving tabindex stays the accessible fix.

**KPI drift + sparks (S12-P5/P6).** The reference MOVED: its dashboard
KPI cards dropped `hover:shadow-md transition-shadow` (now plain stock
cards; only the REPORTS KPI family keeps the hover). The KpiCard label
re-pins to `text-gray-600` (#4b5563) and deltas drop font-medium (neutral
= gray-600). The sparklines are recharts monotone curves (line sw 2, area
fill 0.3 + sw 1); dashboard sparks in `mt-2 h-8`, reports sparks in the
`flex-1 h-12 mr-2` slot capped 176px; the reports LOST DEALS card ships
NO spark; the icon chips are SOLID color-50s (`KPI_CHIP_BG`).

**The custom 404 (S12-P2).** `not-found.tsx` (server, ABSOLUTE title —
the root template would double the "| NEO CRM" suffix) +
`not-found-body.tsx` (client, `usePathname`). VLM round-1 caught what the
first DOM extraction missed: the 2px×64px slate-200 divider bar under the
"404", the h2+p in their own `space-y-3` group, the quoted pathname in a
`font-medium text-slate-700` span, and the `pt-6` button group. Lesson:
extract ALL children of a container, not just the obvious headings.

**The reference is a MOVING TARGET.** The dashboard KPI hover removal
happened BETWEEN sessions (the base44 app is live-edited). Standing rule:
re-probe previously-pinned surfaces when their family is touched, and
treat any s-pin older than the current audit as provisional until
re-verified.

## 16j. Session-18 Layer (the document metadata surface, the Next serializer drifts, the quarter time bomb)

**What shipped:** the first sweep of the DOCUMENT METADATA layer — the
`<head>` surface (meta description, OpenGraph/Twitter cards, favicon,
robots.txt, sitemap.xml) never probed in seventeen prior sessions — plus
the time-bomb fix in the reports e2e. All findings DOM/HTTP-verified on
the live reference on 2026-10-01:

1. **The metadata findings (S18-P1..P4).** The reference's
   `meta[name=description]` is a 405-char marketing paragraph (em-dash
   at char 321) — mirrored VERBATIM as `SITE_DESCRIPTION` in
   `src/lib/site.ts` (never paraphrase reference copy). It ships the
   full social set: og:title/description/image/url/type/site_name +
   twitter:card `summary_large_image` with title/description/image AND
   `twitter:url`. It serves a PNG favicon. Its `/sitemap.xml` lists nine
   URLs (weekly, 1.0 for the dashboard, 0.8 for the rest) and its
   robots.txt carries a `Sitemap:` line. Ours shipped NONE of that, and
   `NEXT_PUBLIC_SITE_URL` — documented in .env.example/README/CLAUDE as
   "used for metadata, sitemap.xml, and robots.txt" since the scaffold —
   was consumed NOWHERE (grep-proven): a documented-vs-code gap.

2. **The Next serializer drifts (why robots/sitemap are route handlers).
  ** Next's `app/robots.ts` emits `User-Agent` (capital A) where the
   reference's BYTES say `User-agent`; its `app/sitemap.ts` serializes
   priority 1.0 as `<priority>1</priority>` (JS number collapse — the
   type's field is also `changeFrequency`, not `changefreq`). When the
   reference's exact byte format matters, ship explicit route handlers:
   `src/app/robots.txt/route.ts` + `src/app/sitemap.xml/route.ts`
   (`force-static`) — ours came out BYTE-IDENTICAL to the reference
   (origin-normalized) for robots.txt and format-identical for the
   sitemap (the only deltas are the deliberate lowercase routes — the
   reference's capitalized locs resolve only on its case-insensitive
   platform; a case-sensitive router must not point crawlers at URLs it
   would 404).

3. **twitter:url through `metadata.other`.** Next's twitter metadata
   object has NO url field (verified against next 16.3.6's
   twitter-types: card/site/siteId/creator/creatorId/description/title/
   images only). The reference ships twitter:url — it rides
   `metadata.other: { "twitter:url": siteUrl() }`.

4. **The NEXT_PUBLIC build-time inlining rule.** `NEXT_PUBLIC_*` values
   are inlined AT BUILD TIME — `next build` reads `.env`, so the sitemap
   locs/og:image origin bake in then. Set the variable BEFORE
   `bun run build` in production (docs/DEPLOYMENT.md); the e2e suite
   asserts path substrings, not origins, so a :3100 standalone server
   serving :3000-origin URLs is expected and harmless.

5. **The quarter-boundary TIME BOMB (the e2e lesson).** The reports e2e
   asserted the quarter-relative won total `$542.0k` — a value that was
   only valid while the seeded close dates (-96..-6 days) happened to
   fall inside the then-current quarter. It detonated on 2026-10-01:
   Q4 began, the server-side `periodStart("this_quarter")` window
   emptied, and the KPI legitimately rendered `0 $0.0K`. LESSON: never
   hardcode a period-relative KPI in a test. The deterministic pattern
   (shipped): drive the period combobox to All Time and pin the
   date-independent value (`7 $687.0K` — every seeded won deal). The
   same hazard class applies to any `new Date()`-relative assertion —
   derive the expectation, freeze the clock, or pin an all-time value.

6. **The favicon + OG image assets.** `src/app/icon.png` is the
   file-convention favicon (Next injects `<link rel=icon>` — no code);
   the mark is the BrandMark annulus (white ring, 0.6 inner ratio) on
   the #2563eb rounded tile. `public/og-image.png` is a 1200x630 LIVE
   capture of the authenticated dashboard (the self-hosted expression
   of the reference's screenshot card — never point at their CDN URLs).

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
| `foreground` | `#0a0a0a` | 10 10 10 | `text-foreground` | primary text (session-13 re-pin) |
| `muted` | `#6b7280` | 107 114 128 | `text-muted` | secondary text |
| `subtle` | `#9ca3af` | 156 163 175 | `text-subtle` | tertiary text, icons |
| `ink` | `#0a0a0a` | 10 10 10 | `text-ink` | input/select typed text (session-10) |
| `muted-ink` | `#737373` | 115 115 115 | `placeholder:text-muted-ink` | placeholders (session-10) |
| `line` | `#e5e5e5` | 229 229 229 | `border-line` | borders, dividers (session-12 split) |
| `line-strong` | `#e5e7eb` | 229 231 235 | `border-line-strong` | the explicit gray-200 family (reports KPI/filter, contacts table, topbar search) |
| `line-soft` | `#f5f5f5` | 245 245 245 | `bg-line-soft` | tab tracks, hover/focus washes, chips (session-14 re-pin — the reference muted/accent) |
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
| page-layout | `tests/page-layout.test.ts` | 69 | ~17 ms |
| csv | `tests/csv.test.ts` | 8 | ~6 ms |
| constants | `tests/constants.test.ts` | 12 | ~5 ms |
| rate-limit | `tests/rate-limit.test.ts` | 6 | ~29 ms |
| avatar | `tests/avatar.test.ts` | 5 | ~4 ms |
| lead-filters (session-8) | `tests/lead-filters.test.ts` | 12 | ~6 ms |
| design-tokens (sessions 9–12) | `tests/design-tokens.test.ts` | 11 | ~4 ms |
| reports-data (session-10) | `tests/reports-data.test.ts` | 7 | ~18 ms |
| login-reset (session-11) | `tests/login-reset.test.ts` | 14 | ~6 ms |
| **unit total** | 12 files | **206** | **<1 s** |
| e2e auth (logged out + reset flow) | `tests/e2e/auth.spec.ts` | 5 | — |
| e2e setup (login) | `tests/e2e/auth.setup.ts` | 1 | — |
| e2e golden path (incl. titles, reports tabs, chart geometry, 404) | `tests/e2e/crm.spec.ts` | 15 | — |
| e2e mobile nav regression (incl. focus entry) | `tests/e2e/mobile-navigation.spec.ts` | 7 | — |
| **e2e total** | 4 files | **28** | **~35 s** (incl. server boot) |

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

**Session 7 (app-chrome & identity-layer parity)** — planned in
`docs/plans/2026-09-29-session7-parity-remediation.md`, executed TDD
(20 new pins, 112/112 unit). The audit targeted the one layer never
systematically extracted — the app chrome — plus the reference's
REGRESSIONS since session 6 (the calendar header search is back, the
reports Reset button is back). 24 DOM-verified gaps (S7-1…S7-24):

- **Shell truth (S7-2/S7-3)**: the reference root is `flex h-screen` with
  an IN-FLOW `hidden md:flex w-64` sidebar (768px breakpoint, verified at
  900/700px) — ours was a fixed sidebar at `lg` with window scrolling.
  Restructured to the live model; `main` is now the true scroller
  (mainScrollable=true, windowScrolls=false) and the drawer covers `< md`.
- **Primary token corrected (S7-1)**: live-computed `rgb(37,99,235)` =
  blue-600 — the old `#3b82f6` (blue-500) pin was one shade light. Deltas
  re-pinned to green-600/red-600 the same way (computed-color probes).
- **Chrome re-pins**: sidebar brand/nav/footer-group anatomy, topbar
  (static py-4 header, search hidden below sm, rounded-md icon buttons,
  rectangular ghost user button, plain user menu), login card (full slate
  redesign — it had never been re-pinned since session 1), TrendStatCard,
  activities card headers (h2 titles, "•••" text button), dashboard
  card-header buttons (blue ghost Adds), settings picklists, toast
  viewport position, calendar nav buttons (outline h-9, Today hidden below
  sm), subtitle size split (calendar/reports 14px).
- **Gate**: lint 0/0 · typecheck clean · **112/112 unit** · build clean ·
  **21/21 e2e**; DOM re-verification at 1512/1024/900/768/700/390 (sidebar

### Session 8 (2026-09-30) — functional-layer parity + mobile-nav lock bug

- **Audit focus:** the control layer prior sessions could not verify at zero
  data (view switchers, filter popovers, toolbar anatomy) + a full mobile-nav
  re-test at every breakpoint. Reference demo data STILL zero (4th session).
- **Real bug found & fixed (S8-P1):** the drawer's auto-close listener was
  still `matchMedia("(min-width: 1024px)")` after session-7 moved the drawer
  to `md:hidden` — resizing from 700 to 800px with the drawer open left body
  + main scroll-locked with the drawer invisible (unscrollable app until a
  route change). Fixed via the new `MOBILE_NAV_LAYOUT.autoCloseQuery`
  ("(min-width: 768px)") contract; e2e resize regression added (6th
  mobile-nav check). Lesson: when a breakpoint changes, grep for EVERY
  consumer of the old value — CSS classes AND JS media listeners.
- **Parity gaps closed (all DOM-verified):** dashboard primary Export
  regained its always-visible label; the dashboard "All Owners" select was
  re-identified as the reference's DEAD Table/Cards view-switcher (empty
  label) and replaced (functional: Recent Deals ↔ card grid); accounts
  toolbar gained its [Table switcher][Standard/Detailed (dead mirror)][More
  (dead mirror)] row + text-only Export CSV; leads search re-pinned to the
  contacts anatomy (w-5 + pl-10); the leads inline filter expander was
  rebuilt as the reference's w-80 Filters POPOVER (Status/Source/Min Deal
  Value/Follow-up Date + Clear/Save View — ours filters for real, Save View
  persists via src/lib/lead-filters.ts, localStorage `neo-crm.leads.view`);
  Log WhatsApp re-pinned to solid emerald-600 (session-6 ghost pin was
  stale); settings picklist add buttons re-pinned to the reference's
  computed rgb(23,23,23) dark (bg-primary on stock shadcn tokens ≠ the app's
  blue-600).
- **VLM false-positives disproven by DOM probes:** "leads omits bottom
  charts" (viewport cutoff), "contacts Priority column absent" (header
  exists), "sidebar active state more opaque" (both compute white/10),
  "Last Activity header wraps" (both 40px single-line). Always re-verify
  VLM findings against the DOM before acting.
- **Gate**: lint 0/0 · typecheck clean · **133/133 unit** (21 new
  page-layout pins + 10 lead-filters checks) · build clean · **22/22 e2e**
  (mobile-nav 6/6 including the resize lock-release regression); DOM
  re-verified at 1512/1024/900/768/700/390; zero horizontal overflow at 390
  on all nine routes; 12 screenshots refreshed; docs realigned + SKILL
  v1.5.0.
  from 768, rails from 1024, drawer below 768, dual scroll lock engages);
  VLM spot-comparison (login + calendar) found zero structural deltas.
- **Lesson — compute colors, don't read them**: the blue-500 primary pin
  survived four sessions because class extractions showed `bg-blue-600`
  only where the reference hand-wrote it (New Event) while our token
  mapped to a different hex. A `getComputedStyle` probe settled it in one
  command. Rule: **any token whose reference value matters gets a
  computed-color probe, not a class-name inference.**

**Session-6 lesson #2 — flexbox `min-width: auto` breaks fixed rails.**
A `w-80` rail beside `flex-1` content collapsed to 186px at exactly
1024px because the content column's intrinsic min-width (a wide table
inside `overflow-x-auto`) overrode the rail's fixed width. Fix:
`min-w-0` on the content column (`RAIL_LAYOUT.content`). Rule: **every
`flex-1` sibling of a fixed-width column needs `min-w-0`** — and rail
widths must be asserted at the rail's entry breakpoint (1024), not just
at desktop width.


### Session 10 audit (2026-09-30)

- **Layer:** stock-primitive internals + chart rendering internals + the
  never-audited reports tabs 2-4. 13 findings (S10-P0..13) — one more real
  Tailwind v4 rename bug (blur scale), the missing global cursor rule,
  input/select stock internals (transparent bg, ink #0a0a0a, placeholder
  #737373, Select rounded-md/no-gap/no-base-w-full), the topbar search
  pill, default tooltips + default ticks/grid, the ChartEmpty reversal
  (the reference renders REAL charts at its persistent zero state), the
  8-slug reports pipeline, the FunnelChart funnel, the tabs 2-4 rebuild,
  row-derived vs fixed series, per-page titles, the activities chart
  internals, favicon/login-logo notes.
- **VLM rounds:** 3 real fixes (Conversion Rate icon = lucide-target, the
  dashed-default grid, the login demo-hint removed); 1 VLM claim disproven
  by DOM probe ("dotted placeholders on the reference" — `anyDashed:
  false`); 1 capture-artifact lesson (verify with ordinals when the
  display eats `[m`/`[h` sequences).
- **Gate**: lint 0/0 · typecheck clean · **169/169 unit** (21 new checks) ·
  build clean · **23/23 e2e** (mobile-nav 6/6); DOM re-verified at
  1512/1024/768/700/390 + zero 390px overflow on all nine routes; 12
  screenshots refreshed; docs realigned + SKILL v1.7.0.

### Session 11 audit (2026-09-30)

- **Layer:** the login card's reset-password flow (never clicked before —
  the "dead" Forgot-password button was a live in-card view swap with a
  full two-view contract), stat-card + table-card shadow scales (computed
  box-shadows), chart geometry (per-surface heights + the stock recharts
  legend), the reports tabs container (ours were card-wrapped; the
  reference's render bare), and the contacts page architecture (the
  reference's only full-height layout, `h-[calc(100vh-64px)]` with the 5px
  short-topbar quirk). 10 findings (S11-P1..P10) + one new Tailwind v4
  rename-family bug (space-y semantics + `:where()` specificity).
- **VLM rounds:** 2 real fixes (the reset view's space-y/`-mb-2` 8px
  overlap → the v4-correct `mb-4`; the reset input's placeholder
  slate-600 → the reference's slate-400) — both verified with
  computed-style probes before and after; both initially flagged as VLM
  suspicions, both proven by the DOM.
- **Gate**: lint 0/0 · typecheck clean · **189/189 unit** (20 new checks:
  14 login-reset + 6 page-layout geometry/shadow/layout pins) · build
  clean · **26/26 e2e** (mobile-nav 6/6; +2 auth reset-flow tests, +1 crm
  chart-geometry test); DOM re-verified at 1512/1024/768/700/390 + zero
  390px overflow on all nine routes; 12 screenshots refreshed; docs
  realigned + SKILL v1.8.0.

### Session 12 audit (2026-09-30)

- **Layer:** the mobile navigation drawer under the focus-lock lens (the
  user's standing priority — one REAL bug found), the 404 page (never
  compared), print styles (none on either app — aligned), the settings
  picklist add-flow re-verification (aligned), the reports-tab keyboard
  layer (the reference's tabs are all tabIndex=-1 — a platform defect we
  do NOT mirror), and a full border-color + text-muted token sweep. The
  reference MOVED since session 11 (its dashboard KPI cards dropped
  hover:shadow-md + border-gray-200) — current DOM re-pinned.
- **Findings (S12-P1..P8):** the drawer focus-on-open race (rAF fires in
  the same frame as the transition-visibility flip; focus() on the
  still-hidden element silently no-ops — fixed with a bounded retry,
  e2e-pinned), the custom 404 (slate-50 center + divider bar +
  quoted-path message + Go Home pill), the border split (#e5e5e5 default
  vs #e5e7eb explicit family), the stock-Radix tab anatomy (muted-ink
  tracks, data-state variants, bare-shadow active pills, no hover), the
  KPI de-hover + gray-600 labels, the recharts monotone sparkline rebuild
  (+ solid color-50 chips, Lost Deals sparkless), plus documented
  non-mirrors (dead search/exports, keyboard-inaccessible reference tabs,
  sonner boilerplate media queries).
- **VLM rounds:** round 1 caught the 404's divider bar + space-y-3 group
  split + emphasized pathname span (the first DOM extraction had missed
  them — capture ALL children, not just headings); round 2 compared
  ALIGNED. Dashboard/reports diffs were all data-driven (the reference's
  demo data is still zero — 8th consecutive session).
- **Gate**: lint 0/0 · typecheck clean · **206/206 unit** (17 new checks:
  3 design-tokens border-split + 14 page-layout pins) · build clean ·
  **28/28 e2e** (mobile-nav 7/7 with the focus-entry test; +1 custom-404
  test); DOM re-verified at 1512/1024/768/700/390 + zero 390px overflow
  on all ten routes (nine + the 404); 13 screenshots (12 refreshed + the
  404 capture); docs realigned + SKILL v1.9.0.

## 16e. Session-13 Layer (doubled auth titles, profile parity, button radius, CardTitle map, by-type rebuild, dashed grids, funnel type, foreground + base-font re-pins, stock account menu)

### Session 13 audit (2026-09-30)

- **Layer:** the never-probed **Profile page** (reached via the topbar
  user menu — the menu itself turned out to be a Radix Popover, not the
  reference's stock DropdownMenu), the auth pages' document titles, a
  button-radius sweep of every page, the per-page CardTitle map, the
  activities by-type card, a chart-grid dash sweep (which DISPROVED the
  session-10 "dashed default" pin — recharts' default grid is SOLID; the
  reference passes `strokeDasharray="3 3"` explicitly), the reports
  tab-1 funnel chart TYPE (a horizontal BAR chart, not a FunnelChart),
  and the default foreground token (#0a0a0a vs our #111827). During
  verification two more surfaced: the BASE font-size (reference 16px,
  ours 14px — a scaffold-era assumption) and the Label (stock
  `text-sm font-medium leading-none` at 14px, ours a 12px custom).
- **Findings (S13-P1..P13):** the doubled auth titles (raw SSR HTML
  `NEO CRM | NEO CRM` — relative titles wrapped by the root template;
  fixed with `title: { absolute }`, pinned by page-titles.test.ts), the
  profile page's nine details (bg-gray-50 + capitalize on the disabled
  email/role inputs, the STOCK Badge on the NEUTRAL family
  bg-neutral-900 — the reference's profile primary is #171717, not its
  own blue, stock `w-full sm:w-auto` buttons with the camera icon mr-2
  on the svg itself), rounded-md buttons everywhere (base + lg; only the
  login submit keeps rounded-xl), the CardTitle per-page map (stock
  16px default; dashboard/leads `text-base sm:text-lg`, filter rails +
  by-type `text-base`, settings `text-lg`), the by-type card rebuild
  (FILTER_RAIL header + STATIC "Last 2 days" subtitle inside the header
  + chips row with blue/violet/amber/emerald/teal swatches + the border-t
  checkbox footer + BARE ••• `text-gray-400 hover:text-gray-600`
  buttons), the calendar day cells keeping their border in all three
  states (out-of-month `bg-gray-50 text-gray-400 transition-all`), the
  explicit dashed grids + the funnel-as-horizontal-BarChart
  (`FunnelBarChart`, 8 raw slugs on Y), the #0a0a0a foreground with
  page h1s explicit `text-gray-900`, the avg-cycle delta removal, the
  16px base font, and the stock Label/DialogTitle.
- **Method notes:** `getByLabel`/role-name selectors beat synthetic
  `.click()` for Radix — DropdownMenuTrigger opens on POINTERDOWN, so
  `element.click()` never opens it (use agent-browser's real `click`).
  The per-file unit counts came from `vitest run` output, not the docs.
- **VLM rounds:** all dashboard diffs were data-driven (reference demo
  data still zero — 9th consecutive session); the profile round's
  "Üser" was an OCR artifact (DOM: both render "User" via capitalize).
  Two mid-verification findings (base font 16px, stock Label) came from
  computed-style probes AFTER the suite was green — verification is part
  of the audit, not a formality.
- **Gate**: lint 0/0 · typecheck clean · **244/244 unit** (38 new
  checks: 2 page-titles + 4 charts-contracts + 29 page-layout pins + 3
  design-tokens re-pins) · build clean (via `bun run build` — see the
  build-script note below) · **31/31 e2e** (mobile-nav 7/7; +3 crm:
  account-menu role=menu, funnel bar-chart, by-type card structure);
  DOM re-verified live at 1512 + 390; zero 390px overflow on all ten
  routes; 13 screenshots refreshed; docs realigned + SKILL v1.10.0.
- **Build-script hazard (operational):** `package.json`'s build =
  `next build && cp -r .next/static .next/standalone/.next/ && cp -r
  public .next/standalone/`. Running `next build` BARE leaves the
  standalone server without any static chunks — every `/_next/static`
  request 404s, React never hydrates, and the login form degrades to a
  NATIVE GET submit. Symptom in e2e: `auth.setup.ts` times out at
  `waitForURL("/")`. Always build through the package script.

## 16f. Session-14 Layer (settings Defaults/Data tab structure, Danger Zone rebuild, /Profile casing alias, line-soft re-pin, the v4 space-y inline-label no-op)

### Session 14 audit (2026-09-30)

- **Layer:** the settings **Defaults and Data tabs** (only the CRM
  Configuration tab had ever been deep-compared — the other two tabs
  carried real structural diffs), the picklist interactive flows, the
  keyboard focus order, the `/Profile` casing route, and the auth
  surface. The previously-pinned families were re-probed FIRST (the
  moving-target rule): **no drift** — dashboard KPIs, foreground, base
  font, grids, CardTitle map, button radii, calendar cells, account
  menu, by-type card, reports tabs, login family, th/td, borders all
  stable. Demo data still zero (10th consecutive session).
- **Findings (S14-P1..P6):** the Defaults tab shipped a responsive
  3-COLUMN grid where the reference is a single-column `space-y-4` stack
  of `space-y-2` groups with the STOCK CardTitle + the stock
  CardDescription subtitle (14px/#737373 — ours was 12px/#6b7280, both
  wrong); the Data tab said "Templates" instead of "Import Templates",
  wrapped its buttons horizontally (`flex flex-wrap gap-2` vs the
  reference's vertical `space-y-2` stacks) in secondary/sm size (h-8
  text-xs vs stock outline h-9 px-4 text-sm `w-full sm:w-auto` with the
  `w-4 h-4` download icon); the Danger Zone missed the `bg-red-50`
  tint, the circle-alert `w-5 h-5` title icon, the `text-red-700` (ours
  used the #ef4444 danger token), the `max-w-xs` input, the stacked
  button-below-input layout and the #fafafa destructive foreground —
  and shipped an extra warning paragraph the reference does not have;
  `/Profile` 404ed (the reference serves both casings, its account menu
  links the capital one); `--color-line-soft` was a scaffold-era
  #f3f4f6 where the reference's muted/accent computes #f5f5f5 (verified
  on the live segmented tab tracks + a bg-accent probe; 27 class usages
  ride the token).
- **The new Tailwind v4 hazard (the session's root-cause find):** the
  v4 space-y flip (margin-BOTTOM on `:not(:last-child)`) NO-OPS when
  the container's non-last child is an INLINE element — a bare
  `<label>`. Vertical margins on inline elements do not apply, so the
  label→control gap silently collapsed to ~3px where the reference's
  v3-era semantics (`margin-top` on the block-level control) compute
  12px. Fix pattern: KEEP the literal `space-y-2` group class (parity)
  and add an explicit `mt-2` on every block-level control — after the
  fix the label-top-to-control-top distance is 28px on BOTH apps (the
  remaining 1px rect difference is inline-box font-metric rounding).
  Same re-derive-from-computed-gap rule as the s11 `-mb-2` hazard; this
  is its second face.
- **The /Profile implementation lesson:** a next.config.ts redirect is
  the WRONG tool for casing aliases — Next.js matches config redirects
  CASE-INSENSITIVELY, so `/Profile -> /profile` also matches the
  destination itself and loops into ERR_TOO_MANY_REDIRECTS, and the
  `caseSensitive` escape hatch is not a valid per-redirect property in
  Next 16 ("Invalid redirect found" at build). The thin route folder
  (`src/app/Profile/page.tsx` → `redirect("/profile")`, outside the
  (app) group) is case-exact by filesystem and cannot loop. Both
  failure modes were caught by the e2e suite before they could ship.
- **Reference drift (auth):** the reference REMOVED its signup flow —
  the login "Need an account? Sign up" button no longer navigates and
  `/signup` renders the 404 view (SSR title still "Signup | NEO CRM").
  Our functional `/signup` stays the documented superset (the
  dead-exports precedent). Its logout also leaves it on `/` as
  "Hi, Guest" (ours redirects to /login — the safer behavior).
- **Verified-aligned (no action):** the CRM Configuration picklist cards
  (computed-equal empty state, the #171717 add button, the "Add new
  industrie" typo); the picklist ADD flow is DEAD on the reference
  (button + Enter both no-op, no toast) — ours stays the functional
  superset; keyboard focus order through the dashboard (our aria-labels
  are the accessible superset); the login footer utility set identical.
- **TDD + gate:** 18 red-first checks (12 page-layout pins + 1
  design-tokens re-pin + 4 profile-route + 1 override-scope) →
  **262/262 unit**; +3 e2e (Defaults single-column, Data tab +
  Danger Zone structure, /Profile alias) → **34/34 e2e** (mobile-nav
  7/7); build via `bun run build`; live DOM re-verified at 1512 + 390
  (the 28px label geometry, the 36px/6px stacked buttons, the tinted
  Danger Zone, the 307 alias, the #f5f5f5 tracks); zero 390px overflow
  on all ELEVEN routes (incl. /Profile); two usable VLM rounds
  (ALIGNED/SAME on the touched tabs — two other rounds hallucinated
  non-existent elements and were DOM-discounted); 13 screenshots
  refreshed; docs realigned + SKILL v1.11.0.

## 16g. Session-15 Layer (the entity-dialog geometry: stock chrome, two body families, the literal-palette v4 hazard)

**What shipped:** the dialog layer every prior session USED but never
deep-compared beyond field sets. All five reference create dialogs
(Lead/Account/Contact/Event/Activity) were opened on the live app and
fully mapped — outerHTML dumps + computed probes at 1512 and 390.

1. **The chrome is STOCK shadcn, not a custom surface.** The scaffold
   had shipped `w-[calc(100vw-2rem)] max-w-lg rounded-2xl shadow-xl`
   with a blurred gray-900/45 overlay, an always-left header with a
   description line, and a padded bg-wash close X. The reference ships:
   `w-full max-w-lg sm:rounded-lg shadow-lg` + the four slide-in/out
   animation classes (computing 0px radius and FULL-BLEED 390px width
   on phones — w-full, not a 2rem inset), the stock `bg-black/80` fade
   overlay with NO backdrop blur, `flex flex-col space-y-1.5
   text-center sm:text-left` (the title CENTERS below sm), and the
   stock opacity-70 close X. Contracts: DIALOG_CONTENT /
   DIALOG_OVERLAY / DIALOG_HEADER / DIALOG_CLOSE / DIALOG_FOOTER.

2. **No description, no placeholders.** The reference's create dialogs
   render ONLY the h2 (zero <p> elements) and carry zero placeholder
   attributes on any input. Our invented "Track a new sales
   opportunity." descriptions and "Acme — 50 licenses" placeholders are
   all gone. The contacts scan-card (our unverifiable superset) keeps
   its description — the dead-exports precedent.

3. **Two body families.** The max-w-lg family (Lead/Account/Contact)
   wraps fields in a py-4 grid INSIDE the form with `space-y-2` groups
   + the s14 controlMt fix (12px label→control gap / 28px top-to-top —
   measured identical on both apps); Lead pairs Status+Source in a
   non-sm-gated `grid grid-cols-2 gap-4` (162px cells even at 390);
   Account's WHOLE body is 2-col; Contact ships the avatar section
   (w-24 h-24 from-blue-500 to-blue-700 gradient circle, live-initials
   span, w-8 h-8 camera button + hidden file input, and the Name field
   INSIDE the bordered section) + space-y-4 pair groups on a gap-6
   body. The max-w-2xl family (Event/Activity, 672px) uses
   `form.space-y-4` with BARE unclassed field divs — label + control
   direct children, the ~4px gap comes from the inline label's font
   metrics — plus grid-cols-2 pairs (Event's Related To sits ALONE in
   one, the second cell empty; Activity pairs Type+DateTime and
   RelatedType+RelatedName) and the `flex justify-end gap-3 pt-4`
   footer (the max-w-lg family's footer is the stock col-reverse
   string with NO gap class — the buttons touch when stacked).

4. **THE v4 LITERAL-PALETTE HAZARD (new class, session-15).** The
   reference's New Event submit is `bg-blue-600 hover:bg-blue-700` —
   but under v4 the LITERAL `bg-blue-600` class compiles to v4's oklch
   default palette, which computes **rgb(21,93,252) — a DIFFERENT blue
   than the reference's v3 #2563eb**. e2e-caught via a canvas
   getImageData pixel readback (getComputedStyle serializes v4 colors
   as lab()/oklab() strings — raw string compares lie; normalize
   through a 1×1 canvas pixel before asserting). The computed-equal
   expression is the `--primary`/`--primary-hover` TOKEN pair
   (#2563eb/#1d4ed8 = exactly the reference's v3 blue-600/blue-700).
   General rule: for any reference color expressed as a LITERAL
   palette class, verify what v4 compiles it to before copying the
   class — the token that computes equal is the correct mirror.

5. **Measurement discipline (recurring lesson).** Two e2e races were
   caught by the gate: the stock zoom-in-95 enter animation makes
   `boundingBox()` read ~99% widths right after `toBeVisible` (poll
   until the width settles), and `[role=dialog]` probes must be scoped
   by content — the CLOSED mobile-nav drawer also carries role=dialog
   and matches naive selectors (the s14 lesson, now twice-learned).

## 16h. Session-16 Layer (the responsive page-root model, the table kit's stock strings, the calendar card, the Card-primitive border leak)

**What shipped:** the audit went after the RESPONSIVE anatomy — the
page-ROOT model at 390/900/1512, the table kit's class strings, and the
calendar card internals (a surface only ever pinned at the CELL level).
Seven findings, all DOM-verified on the live reference:

1. **The page-root model (S16-P1/P2).** The reference's pages OWN their
   padding — `p-4 sm:p-8 bg-gray-50 min-h-screen` on the dashboard,
   accounts, calendar, activities, reports and settings; BARE
   `p-4 sm:p-8` on Leads + Profile (its own quirk — main's gray-50
   fills the gap); the h-calc flex directly under `main` on Contacts.
   Our AppShell wrapped EVERY page in a blanket `p-4 sm:p-8` div —
   which DOUBLE-PADDED the contacts full-height layout: the h-calc box
   rendered 358px wide at 390 (not 390), the table card 294px (not
   326px), and main scrolled 37px (not the 5px mirrored topbar quirk).
   Fix: `PAGE_ROOT.standard` / `PAGE_ROOT.bare` contracts, the contacts
   `CONTACTS_LAYOUT.fullHeight` as its root, and NO shell wrapper
   (source-pinned: every page renders its own root).

2. **The table kit on stock strings (S16-P3/P4).** The container is the
   stock `relative w-full overflow-auto` (ours: `overflow-x-auto
   scrollbar-thin`); TableHead/TableCell carry the stock checkbox
   variant classes; TableRow ships `hover:bg-muted/50
   data-[state=selected]:bg-muted` — the reference's muted SURFACE is
   our line-soft #f5f5f5, and ours had /60 opacity + no selected state.
   The reference's platform also resets `th, td { padding: 1px }`
   GLOBALLY — mirrored in our base layer; utility classes override the
   element selector, so the reset only fills the unclassed axes
   (standard th compute 1px vertical → 43px header rows; the dashboard
   compact th compute `8px 1px`).

3. **THE CARD-PRIMITIVE BORDER LEAK (S16-P5 — the session's
   engineering lesson).** The Card base ships `border border-line`;
   `cn(TABLE_CARD.card, …)` CANNOT remove it — tailwind-merge replaces
   same-PROPERTY classes only, and `rounded-lg`/`shadow` replace
   different properties. Every `<Card className={cn(TABLE_CARD.card,
   …)}>` computed a 1px border against the reference's plain BORDERLESS
   `bg-white rounded-lg shadow [p-6]` divs (four surfaces: the
   accounts/leads/activities table cards + the activities timeline;
   accounts/leads also carried an invented overflow-hidden). Rule:
   TABLE_CARD surfaces render as plain divs — never through the Card
   primitive (source-pinned).

4. **Mid-width-only divergence (S16-P6).** The settings picklist grid
   broke at lg where the reference breaks at md — at 768-1023px ours
   rendered ONE 580px column where the reference renders two 282px
   cards. Invisible to the standing 390/1512 probe widths (both agree
   there). LESSON: sweep at least one MID width (900px) every session —
   breakpoint divergences hide between the standard probes.

5. **The calendar card, rebuilt flat (S16-P7).** The reference ships
   padding ON the card and THREE direct children: the header row
   (`flex items-center justify-between mb-6`, h2 `text-xl sm:text-2xl
   font-bold text-gray-900`, nav `flex gap-2`), the DOW grid
   (`grid grid-cols-7 gap-1 sm:gap-2 mb-2` with seven
   `text-center text-xs sm:text-sm font-semibold text-gray-600 py-2`
   divs), and the month grid (`gap-1 sm:gap-2`). Ours had merged the
   DOW labels + cells into ONE 42-child grid behind a
   padding-neutralized CardHeader/CardContent pair (16px header gap vs
   24px, 4px DOW gap vs 8px, an 18px semibold title vs 20/24px bold).
   The cells keep the CALENDAR_CELL states + the clickable flex-stack
   superset.

6. **The reports data anomaly.** One `/Reports` load served the FULL
   demo dataset (Recent Won Deals + Top Deals by Value with the same
   records our seed mirrors), then 6/6 loads returned the steady zero
   state — an instance with data EXISTS behind the platform's load
   balancer. Re-check on login every session; catching the data
   instance would unlock the edit-dialog/picklist/upload verification.

7. **Measurement discipline.** The `bg-gray-50` literal was
   canvas-verified BEFORE copying (rgb(249,250,251) on our v4 = the
   reference's exact value — NO literal-palette drift for that shade,
   unlike blue-600); the page-root contract uses the `bg-background`
   token anyway (computed-equal + theme-following).

## 16i. Session-17 Layer (the stock button/checkbox primitives, the icon-glyph census, the polygon Filter)

**What shipped:** the first ICON-GLYPH census (icon name + SVG path data
on every page, both apps — a layer never swept before) plus the two
chrome surfaces that were still hand-written: the topbar account trigger
and every filter-rail checkbox. All findings DOM-verified on the live
reference:

1. **The icon-glyph census (S17-P2 — 14 surfaces).** LESSON FIRST: compare
   glyph PATH DATA, never icon names alone — lucide RENAMES can hide
   REDESIGNS (0.525's `Filter` re-exports the new curved Funnel) and
   ALIASES can hide renames (`CheckCircle2` renders the small
   circle-check, not the big one). The reference's sidebar ships `users`
   (two-person), `circle-user` (head r=3 + shoulders path) and `calendar`
   (blank body) — ours shipped three DIFFERENT glyphs (`User`,
   `CircleUserRound`, `CalendarDays`) because the renames are exported
   under new canonical names in 0.525 (path-verified byte-equal after the
   swap). Contacts ships `scan` (no center line) and a DOWNLOAD glyph on
   Import (the reference's own quirk); the leads/calendar KPI chips ship
   `circle-check-big`/`calendar`/`users`; the quick-log ships `calendar`
   (Log Meeting) + `message-square` (Log WhatsApp).

2. **The polygon Filter (S17-P2b — the hand-rolled glyph).** The
   reference's Filter/Filters buttons ship the OLD lucide `filter` — the
   straight-edged POLYGON funnel (`<polygon points="22 3 2 3 10 12.46 10
   19 14 21 14 12.46 22 3">`). lucide-react 0.525 re-exports the
   redesigned curved Funnel AS `Filter`, and the polygon is exported by
   NO name in the package (verified against the dist source) — so it
   lives in `src/components/ui/icons.tsx` as `FilterPolygon`, carrying
   the `lucide lucide-filter` namespacing classes (no styles — they keep
   icon censuses comparable with real lucide renders).

3. **The account trigger is the stock ghost Button (S17-P1).** The
   reference's trigger carries the FULL stock construction
   (`whitespace-nowrap text-sm font-medium focus-visible:ring-1
   focus-visible:ring-ring` + the ghost hover pair + `h-9 px-4 py-2` +
   `flex items-center gap-1 sm:gap-2` via tailwind-merge) with a
   TWO-LEVEL avatar (stock Avatar root + fallback div). Ours was
   hand-written with NO focus-visible ring — a keyboard-focus gap
   (live-verified: the reference shows the 1px near-black ring under
   Tab). The composition neutralizes the iconGap's trailing-chevron
   margin (`[&_svg]:mr-0` — the reference's chevron carries no margin).

4. **The stock checkbox is a BUTTON, not an input (S17-P3).** Every
   reference filter rail (accounts 4 tiers / calendar 10 types+dates /
   activities 4 Activity-Type + the by-type footer) ships `<button
   type="button" role="checkbox" aria-checked data-state value="on">`
   with a `Check` h-4 w-4 indicator that mounts ONLY when checked. The
   reference's `border-primary`/`data-[state=checked]:bg-primary`
   compute **#171717 — the platform's DARK stock primary, NOT the app
   blue** (the same family as DIALOG_SUBMIT) — so the computed-equal
   expression is `neutral-900`/`neutral-50`. Our native inputs never
   rendered a check glyph at all (appearance-none + no indicator) and
   filled with the app blue. The primitive lives in `label.tsx` with the
   `onCheckedChange(boolean)` API; keyboard toggling is native (buttons
   fire click on Space/Enter — no keydown handler needed).

5. **Button variant corrections (S17-P4/P5).** The default (blue)
   variant carries the BARE `shadow` scale — the reference's blue
   primaries compute rgba(0,0,0,.1) 0 1px 3px 0, and our `shadow-sm` was
   one step light under the s9-re-pinned scale (outline buttons are
   shadow-sm on BOTH). The ghost variant carries NO base text color (the
   stock ghost) — our invented `text-muted` rendered the one text-bearing
   ghost ("Save All") gray where the reference inherits #0a0a0a.

6. **Measurement discipline.** The checkbox's checked fill was verified
   through the 1×1 canvas pixel readback (§16g.4's rule — v4 serializes
   getComputedStyle colors as lab()/oklab() strings, so raw string
   compares lie); the e2e suite pins it the same way.

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
