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
version: 1.94.0
last_updated: 2026-10-11
project_state: 1862 unit checks + 132 e2e checks green; the session-97 layer (the 97-c rotation — THE DASHBOARD CHART CARDS AT TRUE 390x844 [the last chart surface, walked on BOTH apps at the zero-data state: FULL GEOMETRY MATCH, d=+0 on ALL 13 elements — the 6 KPI cards 358x130 at y 189/335/481/627/773/919 with the 324x32 sparkline SVGs; the KPI grids byte-identical; Sales Pipeline by Stage 358x494 + chart SVG 308x300 + 5 bars + 5 legend chips; Revenue Over Time 358x398 + SVG 308x300; Top Performing Sales Reps 358x131; Lead Sources 358x106; Upcoming Activities 358x158; Recent Deals 358x155 at the identical y-ladder 2337/2492/2622/2804 — the recharts reflow at phone width is at parity] + THE 768x1024 TABLET MAIDEN SWEEP [the md/sm boundary: zero catastrophic drift — dashboard 0.06, contacts 0.09, leads 0.07, calendar 0.02, activities 0.01, reports 0.00, profile 0.00, settings 5.19 the picklist genus, login 0.44 the logo genus, accounts 0.72 DECODED LIVE as the documented s95 overflow genus at the md boundary — the reference's table rides the bare flex-1 and POKES OUT (table 535, main scrollW 567 > clientW 512, h-scroll) while ours scrolls in-box (table 472, min-w-0, scrollW 512 = clientW); documented STANDING, ours the consistent pattern] + B-97a1 CLOSED [the reset view re-walked at 390: FULL GEOMETRY MATCH — card 358x358 @(16,243), the email label y399 h16 inline 14px, the input y425 294x40, the label->input gap 10 on BOTH apps, the submit y481 — the s96 LOGIN_LAYOUT.field fix's scope extension verified] + THE S97-P0 TABLET CLASS [standingBaseline() 3-way md/lg banding: <768 phone, <1024 tablet, else desktop; STANDING_BASELINES.tablet from the maiden run — accounts 0.8 the overflow genus, settings 5.5 the picklist genus, login 0.5 the logo genus, the rest 0.1; the tablet drift gate verified CLEAN live] + THE S97-P1 NUMERIC FAIL-FAST [B-97a2: the PURE parseNumberArg(argv, flag, fallback) seam — absent -> fallback, missing/non-numeric -> THROW listing the expected form; wired into ALL FOUR numeric flags --drift-margin/--max-diff/--width/--height; NaN must never silently disarm a gate — pct > NaN is always false; verified live: exit 1 with the helpful message] + S97-P2 [the N-97a1 stale 9-page comments -> ten-page] + S97-P3 [the gate:full composite: the standing gate chain + the three drift sweeps (desktop, phone 390x844, tablet 768x1024, each --fail-on-drift); the plain gate UNCHANGED] + the standing layers (93rd sweep) [the drift sweep #93: the bundle md5 a70a637f... EXACT, the 68th consecutive stable; the desktop + phone sweeps clean with the drift gate; census #93: demo zero, desktop 256px/8, the mobile-nav defect STANDS at TRUE 390 — the 18th consecutive; the drawer battery FULLY GREEN live] + the audits [97-a: the s96 ship delta 7/7 GENUINE, the non-vacuousness re-proven 10 failed | 50 passed; 97-b: ZERO graduations 13/13 (~54th), the CSV census 17 sites zero unguarded, the source-vocabulary clean, the config + SEO layers verified] + both operator decisions re-affirmed (57th: CSV posture (b) + source-vocabulary parity) + GATE: lint 0/0 - tsc 0 - 1862/1862 unit [103 suites, +13 net] - build - 132/132 e2e fresh CI=1 + 2 screenshots NEW [144 dashboard chart cards 390 + 145 accounts tablet 768, VLM 5/5 x2] + docs at SKILL v1.94.0 [16ck + this project_state + the H1] + README badge 1994 + AGENTS/CLAUDE/PAD at 1862+132 [the AGENTS Session-97 block + the PAD s97 inventory row + the Total 103/1862] + the CLAUDE-count lockstep re-anchor (1849 -> 1862)
---

# NEO CRM — Engineering Skill (SKILL.md v1.94.0)

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
sparkline strips on a `#f9fafb` canvas, the stock system-font stack (session-22: the reference ships ZERO webfonts), and one blue
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
| Components | `@radix-ui/*` (6 pkgs) | `^1` | dialog, select, popover, dropdown, label, slot — alert-dialog + radio-group retired s61, toast retired s62 (the from-scratch ui/toast.tsx never imported it) |
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
remediation; two zero-import scaffold radix packages `react-alert-dialog` +
`react-radio-group` and the never-referenced `bun-types` devDep retired s61;
the never-imported `react-toast` retired s62 — ui/toast.tsx is a
from-scratch mirror, the s61 census had wrongly counted it live):
`@prisma/client`, 6 `@radix-ui/*` packages, `class-variance-authority`,
`clsx`, `html2canvas-pro`, `jspdf`, `lucide-react`, `next`, `prisma`,
`react`, `react-dom`, `recharts`, `tailwind-merge`, `zustand`.

Dev dependencies (11 — `@types/node` joined s62 as an EXPLICIT pin: the s61
package-lock regen had dropped the resolved entry, and npm never
auto-installs the vite/vitest optional peer, so the npm-world install path
lacked the types tsc needs for the `node:` imports):
`@playwright/test`, `@tailwindcss/postcss`, `@types/node`, `@types/react`,
`@types/react-dom`, `eslint`, `eslint-config-next`, `tailwindcss`,
`tw-animate-css`, `typescript`, `vitest`.

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

  /* Typography — session-22: the reference's EXACT stack (it ships ZERO
     webfonts; pinned explicitly because Tailwind 4.3's own default is the
     v4.0 -apple-system/BlinkMacSystemFont list, NOT byte-identical). */
  --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

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

`src/lib/constants.ts` is the single source:
`STAGE_META` (8 lead stages — `unqualified` included since s5),
`ACCOUNT_STATUS_META`, `ACTIVITY_TYPE_META`
(call/email/meeting/whatsapp/task/note), `EVENT_TYPE_META`,
`CONTACT_PRIORITY_META` (the Key/Standard/At Risk badge map),
`ACCOUNT_TIER_BADGE`, `CHART_COLORS`.
(Session-42: the stale `DEFAULT_SETTINGS` entry removed from this
inventory — the export itself was deleted in s41 as dead code.
Session-50: the `LEAD_SOURCES` entry removed the same way — the
src-dead constant was deleted in s49, its twin `CONTACT_SOURCES` in
s48; the living source vocabularies are the `LEAD_SOURCE_OPTIONS` /
`CONTACT_SOURCE_OPTIONS` pair the dialogs consume.
Session-54: the `PRIORITY_META` + `TIER_META` entries removed the same
way — the pre-s28 hot/warm/cold badge map and the tier scaffold were
deleted as src-dead in the N-54b retirement, alongside
`OPEN_STAGES`/`isClosedOppStage`/`CONTACT_SOURCE_LABEL`/
`LEAD_EDIT_STATUSES`/`LEAD_EDIT_SOURCES` and the test-only
`DROPPED_STAGES`/`isDroppedStage`/`REPORTS_PIPELINE_SLUGS`/
`FUNNEL_STAGES`/`ACCOUNT_EDIT_STATUSES` family.)
**Never hardcode a status color** — extend the meta
map when you extend a vocabulary.

## 5. Component Architecture & Patterns

### 5.1 Layer model (the Golden Rule: imports point DOWN only)

```
Layer 1  src/app/**            pages (11) + API route handlers (27) + layouts
Layer 2  src/components/**     UI kit (13 files) + layout chrome + shared dialogs
Layer 3  src/lib/**            pure seams: auth, api envelope, db, db-path,
                               format, csv, rate-limit, constants, download
Layer 4  src/stores/**         the single Zustand store (client)
Layer 5  prisma/**             schema + idempotent seed
```

A component may import the store and lib seams; a lib seam imports nothing
above Layer 3 (db-path imports only fs/path/url). The store is the only
HTTP client for server state (its `call()` helper unwraps the envelope).

### 5.2 Inventory (verified counts)

- 25 `.tsx` files under `src/components/`; 19 start with `"use client"`.
- 11 pages (`src/app/**/page.tsx`): login, signup, dashboard, accounts,
  contacts, leads, calendar, activities, reports, settings, profile.
- 27 API route files: auth (login/signup/logout/me/verify/resend), users,
  accounts±id, contacts±id, leads±id, activities±id, events±id,
  opportunities, dashboard, reports, settings, search, export, upload,
  uploads/[name], reset, health. All `force-dynamic`, all
  session-gated via `requireSession()`.
- Shared dialogs: `src/components/shared/entity-dialogs.tsx` (1081 lines) —
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

`tests/e2e/mobile-navigation.spec.ts` (9 checks, 390/700px viewports) is the regression suite.
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
test-pinned module (1520 lines; `tests/page-layout.test.ts`, 180 checks).
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

### 7.1 Prisma models (9) — `prisma/schema.prisma` (242 lines)

| Model | Key fields | Notes |
|---|---|---|
| `User` | email (unique), name, avatarColor, role, passwordHash | scrypt hash; seeded team of 4 |
| `Account` | name, industry, email/phone/website, annualRevenue, employees, tier A/B/C, isKey, status, ownerId | `_count` includes for contacts/leads/activities |
| `Contact` | name, email, phone, company, position, source, priority, accountId, ownerId | priority hot/warm/cold |
| `Lead` | name, value, stage, source, expectedCloseDate, closedAt, nextFollowUp, accountId, contactId, ownerId | 7 stages: new→contacted→qualified→proposal→negotiation→won/lost |
| `Activity` | type, subject, notes, status, priority, dueAt, completedAt, accountId, contactId, ownerId | types: call/email/meeting/whatsapp/task/note |
| `Event` | title, type, status, startAt, endAt, allDay, location, account/contact links | types: meeting/appointment/call/task |
| `Opportunity` | name, accountName, stage, amount, probability, closeDate, source, owner | 6-stage pipeline: prospecting→qualification→proposal→negotiation→closed_won/closed_lost (session-31) |
| `SavedReport` | name, tab, config (JSON string) | reports save/load |
| `Setting` | singleton row | editable picklists + workspace defaults |

### 7.2 Seed — `prisma/seed.ts` (468 lines)

Idempotent IN PLACE: `deleteMany` every domain table, then insert the
canonical demo workspace (4 users incl. the demo login, 10 accounts,
15 contacts, 24 leads across 7 stages and 6 months, 23 activities,
12 events, settings singleton). **Never `rm` the db file under a running
server** — the process keeps the deleted inode and serves stale data
(§9 bug #5).

### 7.3 The db-path seam — `src/lib/db-path.ts` (227 lines)

Exported API (all unit-tested in `tests/db-path.test.ts`, 20 checks):

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

### 7.4 Auth — `src/lib/auth.ts` (133 lines)

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
  `#6b7280` on white (4.8:1 AA); sidebar white-on-`#2563eb` (4.5:1 AA).
  Session-21's full WCAG 1.4.3 census (computed-style tree-walk on both
  apps): the CORE surfaces pass, and both apps share the SAME failures —
  green-500 "Won" (2.54), red-500 "Target" (3.76), the green/red-600
  delta chips (~3.3 at 12px) — the reference's own design choices,
  mirrored exactly (parity over remediation; the earlier "soft
  backgrounds" claim was stale — the deltas render bare green/red-600
  on white on BOTH apps).

## 9. Anti-Patterns & Common Bugs

Eight real bugs shipped and were fixed in this codebase. Every entry has
a regression test or a structural guard.

### Bug #1: Missing mobile navigation (Critical — the founding defect)

**Symptom:** below `lg` the reference app shows no nav at all.
**Root cause:** the reference template hides the sidebar without shipping
a replacement. **Fix:** `mobile-nav.tsx` drawer + 7-check e2e suite.
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
- **Don't inline `window.location.href` for downloads** — land through
  the blob family (`downloadBlob` in `src/lib/download.ts`) or the
  fetch→blob round-trip (session-48 retired `downloadFile`: a non-200
  navigated to the raw JSON envelope; the reports export now parses
  the envelope and toasts).
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

### 15.1 Route handler (every one of the 27 follows this — session-68 F-68b1)

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
<Sparkline values={monthlyWon} color={CHART_COLORS.cyan400} />          // bars
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
| raw `window.location.href = url` | `downloadBlob(...)` / the fetch→blob flow |
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
download) — mirrored as no-ops. Session-33 completed the set: the
dashboard header "Add" button is dead too (no onClick — the WHOLE
Add/Export/Export trio), as is the dashboard filter-bar "Stage: Source"
search input (no value/onChange — see §16y; ours stay the documented
functional supersets). At 390px the topbar hides search + mail +
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

## 16k. Session-19 Layer (the PWA/installable surface, the per-route OG/Twitter family, the icons-replacement hazard)

**What shipped:** the first sweep of the PWA/INSTALLABLE + PER-ROUTE
metadata surface — the install/head layer never probed in eighteen prior
sessions (manifest.json, the apple/mobile-web-app meta family, the
theme-color VALUE, the apple-touch-icon, per-route canonical/OG/Twitter)
plus the create-dialog input attribute micro-contracts. All findings
DOM/HTTP-verified on the live reference on 2026-10-01:

1. **The findings (S19-P1..P8).** The reference serves `/manifest.json` +
   `<link rel=manifest>` (name/short_name "NEO CRM", the 405-char
   description, TWO icon entries sharing ONE src at 192x192/512x512,
   start_url + scope at the origin, `display: standalone`,
   `theme_color: #000000`, `background_color: #ffffff`, served as
   `application/json`); its `meta[name=theme-color]` is **#000000**
   (black — not the app blue; ours had shipped #2563eb since the
   scaffold); it ships `mobile-web-app-capable` = yes +
   `apple-mobile-web-app-status-bar-style` = black +
   `apple-mobile-web-app-title` = "NEO CRM" + an `apple-touch-icon`
   (sizes 180x180, its login page at least); and its OG/Twitter family
   is **PER-ROUTE on every inner page** — og:title "X | NEO CRM",
   og:url origin+route, og:description `"<Page> on NEO CRM. " + <the
   405-char paragraph>`, twitter:title/url/description likewise, plus a
   per-route `<link rel=canonical>` (root + /login stay unprefixed).
   Dialog micro-contracts: the CONTACT dialog Phone is `type=tel` (its
   LEAD dialog Phone is plain text — its own inconsistency); ZERO
   datalists in any dialog; the avatar file input accepts exactly
   `image/jpeg,image/png,image/jpg`.

2. **The implementation.** `src/app/manifest.json/route.ts` — a
   `force-static` route handler building the manifest object in the
   reference's exact key order (JSON.stringify preserves insertion
   order; `app/manifest.ts` would re-order — the s18 robots/sitemap
   rule extended). `src/lib/site.ts` grew the per-route factory:
   `pageOgDescription(page)`, `PWA_META` (the three metas riding
   `metadata.other`), and `pageMetadata({ page, route, title? })` —
   consumed by the 8 inner page wrappers + login + signup (the
   dashboard inherits the root layout wholesale; its og:url IS the
   origin root, which is exactly the reference's unprefixed family).
   `src/app/apple-icon.png` (180×180 BrandMark tile) rides the file
   convention; the root layout's `viewport.themeColor` flipped to
   "#000000"; `alternates.canonical: "/"` covers the root.

3. **THREE serializer hazards, all gate-caught.** (a) **Declaring
   `metadata.icons` REPLACES the file-convention `link[rel=icon]`** —
   the first pass declared `icons: { apple: ... }` and the s18 favicon
   e2e failed with zero `link[rel=icon]` in the DOM; the fix ships BOTH
   icons as file conventions (`src/app/icon.png` +
   `src/app/apple-icon.png`, which Next emits with sizes="180x180") and
   the layout declares NO icons field. (b) **Page-level
   `metadata.other` REPLACES the layout's map** (shallow merge) — an
   inner page declaring only twitter:url would silently drop the PWA
   metas, so `pageMetadata()` re-declares PWA_META + twitter:url on
   every page. (c) **Next's URL resolution strips the root canonical's
   trailing slash** (the reference's is `origin/`; even passing
   `${siteUrl()}/` emits the slashless href — verified live) — accepted
   as cosmetic serialization, the s18 "viewport 1 vs 1.0" class.

4. **The verification method (reuse for any metadata work).** Probe the
   SSR bytes directly (`curl -s localhost:3000/<route> | grep -o
   '<link rel=...>'`) — the dev server reflects metadata edits via
   hot reload within seconds, so serializer drift is caught BEFORE
   burning a build+e2e cycle. The full-suite pins:
   `tests/pwa-metadata.test.ts` (14 checks — the manifest byte pins,
   the theme-color/PWA_META/apple-icon assets, the factory output, the
   wrapper wiring, the dialog micro-contracts) + 6 e2e checks in
   `crm.spec.ts` (the manifest JSON + link, the theme-color + metas,
   the resolving apple-touch-icon, per-route /accounts, the root
   family, the Contact dialog tel/datalist/accept census).

## 16l. Session-20 Layer (the HTTP response-header surface, the census-method hazards)

**What shipped:** the first sweep of the HTTP RESPONSE-HEADER layer —
the edge-injected set never probed in nineteen prior sessions — plus two
never-swept verification layers (the keyboard tab-order census and the
print-styles sweep, both at PARITY, no action) and the standing layers
re-verified with NO drift (the reference's mobile nav still absent at
390 — 16th session; the drawer 7/7; the s18+s19 metadata head census;
zero 390px overflow on 11 routes; demo data still zero — 16th session).

1. **The findings (S20-P1..P4).** The reference's platform edge
   (Cloudflare/Caddy) injects a three-header security set on **every**
   response — HTML routes (login, /Dashboard, /Leads, /settings,
   /signup, /Reports), its hashed CSS asset, /manifest.json (after its
   302 → /api/apps/manifests/… hop), and its SPA-fallback 200s:
   `referrer-policy: strict-origin-when-cross-origin`,
   `x-content-type-options: nosniff`, and
   `strict-transport-security: max-age=31536000` (BARE max-age — no
   includeSubDomains, no preload). Ours shipped none of the three
   (S20-P1/P2/P3), and our sitemap served
   `application/xml; charset=utf-8` where the reference serves bare
   `application/xml` (S20-P4 — the s18 "viewport 1 vs 1.0"
   cosmetic-serialization class). robots.txt (`text/plain;
   charset=utf-8`) and manifest.json (`application/json`) already
   matched exactly — GET-verified.

2. **The implementation.** One `async headers()` field in
   `next.config.ts` — a single `/:path*` block with the three headers
   at the reference's exact values. It applies to pages AND
   /_next/static assets AND route handlers; verified live with NO
   content-type conflicts (the config headers coexist with the
   sitemap/robots/manifest route handlers' own content-types — the
   merge hazard the plan flagged did not materialize). HSTS is inert
   over plain-HTTP localhost (RFC 6797 §7.1: a UA MUST NOT process it
   over non-secure transport — verified empirically: dev server +
   browser flows + the full e2e suite stay healthy) and correct
   whenever a self-hosted deployment runs behind HTTPS, which is the
   reference's own topology. The sitemap route handler's content-type
   dropped its charset suffix. TypeScript hazard caught by the gate:
   `NextConfig["headers"]` IS the function type itself — annotating
   the method's return as `Promise<NextConfig["headers"]>` produces
   `Promise<() => Header[]>` (a promise OF a function) and fails tsc;
   omit the annotation and let inference handle it.

3. **Census-method hazards (this session's probe lessons).**
   (a) **HEAD ≠ GET on the reference** — its platform answers
   `HEAD /manifest.json` with 200 + `text/html` but the real GET chain
   is 302 → `/api/apps/manifests/…/manifest.json` → 200 +
   `application/json`; always GET-verify content-types with
   `curl -s -D -`. (b) **`Element.checkVisibility()` WITHOUT options
   does NOT test the `visibility` property** — it only checks
   display/content-visibility, and the fixed-position drawer panel is
   never display:none, so the drawer-open probe false-positived on a
   closed panel; read `getComputedStyle(el).visibility` (or pass
   `{checkVisibility: true}`) for visibility-toggled overlays.
   (c) **The reference's interactive affordances are clickable
   divs** — its leads-table sortable headers are `th > div[onclick]`
   with the arrow-up-down SVG + cursor:pointer, NOT `<button>`
   elements; a `th button` census under-counts them. Our `<th><button>`
   SortHead is the accessible expression of the same G-5-pinned
   affordance. The reference also ships FIVE unnamed interactive
   elements on its dashboard (two topbar icon buttons, the
   view-switcher combobox, two table-area buttons — WCAG 4.1.2
   failures) where ours carries aria-labels — the documented
   accessible-superset pattern.

4. **The verification method (reuse for any response-header work).**
   `curl -sI localhost:3000/<route>` on the dev server (headers()
   applies in dev) + `page.request.get()` header assertions in the e2e
   (which hits the production standalone on :3100 — the real parity
   surface). Resource-exhaustion lesson: the e2e browser launch can
   fail with `pthread_create: Resource temporarily unavailable` when
   multiple agent-browser sessions are left open — close them before
   running the suite. The full-suite pins:
   `tests/http-headers.test.ts` (9 checks — the headers() source pins,
   the standing-config regression guards, the content-type pins) + 4
   e2e checks in `crm.spec.ts` (the three-route security set, the CSS
   asset set, the bare sitemap content-type, the manifest/robots
   regression).

## 16m. Session-21 Layer (the login-card funnel: the in-place signup + verify-email views, the Callout banners, the census-method hazards)

**What shipped:** the LOGIN-CARD ERROR + VIEW-STATE surface — never
swept in twenty prior sessions and fully probeable without data (the
wrong-password / signup / verification probes work on both apps; the
reference's sonner toasts never fire on the auth flows). Plus three
more never-swept candidates verified AT PARITY (the color-contrast
census WCAG 1.4.3 — both apps fail on the same tokens: green-500 "Won"
2.54, red-500 "Target" 3.76, the ~3.3 delta chips — the reference's own
design, mirrored; the focus-visible ring census — the reference ships
the UA-default outline, ours the documented a11y superset; the @media
census — reduced-motion/color-scheme/forced-colors all superset-or-
inert, both apps zero print rules) and the standing layers re-verified
with NO drift (the reference's mobile nav still absent at 390 — 17th
session; the drawer 7/7; the s18+s19+s20 metadata/header census; zero
390px overflow on 11 routes; demo data still zero — 17th session).

1. **The s10 "dead login button" pin is DISPROVEN (S21-P4).** The
   reference's "Need an account? Sign up" is an onclick BUTTON that
   swaps the login card IN PLACE (the URL stays /login) to a MINIMAL
   signup view: "Back to sign in" (`flex items-center gap-2 text-sm
   text-slate-500 hover:text-slate-700 font-medium transition-colors
   -mb-2` + ArrowLeft) → h2 "Create your account" (the s11 title
   family) → Email / Password / Confirm Password (the s11 resetInput
   family at h-10 sm:h-11 — NO name field, NO Google button, NO
   divider, NO logo — the column is replaced entirely, the s11
   architecture) → the one-size-down submit "Create account". The
   account name derives from the email local part server-side. The
   /signup PAGE stays as our documented working superset (the reference
   404s it) and now renders the same minimal view (mode="signup" is
   just the card's initial view).

2. **The verify-email view (S21-P5).** A successful signup swaps again:
   the envelope tile (`mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-slate-100
   rounded-full … mb-3 sm:mb-4`, the s11 sent-view family) + h2 "Verify
   your email" + `We've sent a 6-digit code to<br><span class=
   "font-medium text-slate-900">{email}</span>` + SIX single-digit
   inputs (`flex items-center justify-center gap-1.5`; each = the stock
   Input + `text-center w-10 h-11 text-base font-semibold md:text-sm`
   — the FIRST `autoComplete="one-time-code"`, the rest "off") + the
   submit + `Didn't receive the code? Resend` (`text-sm text-slate-600`
   line, the button `font-medium text-slate-700 hover:text-slate-900
   disabled:opacity-50 transition-colors` inside a `text-center`
   wrapper) + "Back to sign in". The error ladder, live-verified across
   eleven wrong submissions: "Please enter all 6 digits" → "Invalid
   verification code. N attempts remaining." (4…1) → "Too many failed
   attempts. Please request a new verification code." (the 5th failure
   and every one after — the button stays enabled, the message
   repeats); the resend → "New verification code sent to your email"
   (which RESETS the attempts). An unverified account's login attempt →
   "Please verify your email before logging in. Check your email for
   the verification code."

3. **The Callout banners + zero toasts (S21-P2/P3).** Every auth error
   renders the shadcn Callout — the RED variant (`relative w-full
   border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:
   absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground
   text-foreground bg-red-50/70 border-red-200 rounded-xl` + the inner
   `[&_p]:leading-relaxed text-red-700 text-sm` div — the red sibling
   of the s11 sentCallout; the `[&>svg]` classes position an icon the
   reference never renders, they ship verbatim). The resend
   confirmation rides the GREEN variant (bg-green-50/70 +
   border-green-200) and AUTO-DISMISSES (~3s, live-bounded 1.6–3.2s)
   where error banners persist. ZERO toasts fire on the auth flows —
   login failure = the banner only; login/signup success = a silent
   redirect (toast-count timelines on both apps). The ONE remaining
   auth toast is the Google button's not-configured `toast.info` — the
   documented self-hosted fallback for the reference's REAL Google
   OAuth redirect (verified live: it navigates to accounts.google.com
   with the base44 client_id).

4. **The client/server verification split (the import-boundary rule).**
   `src/lib/verification.ts` is CLIENT-SAFE (pure constants + message
   builders, ZERO imports — the login card consumes its strings).
   `src/lib/verification-server.ts` (node:crypto + the auth layer's
   scrypt) is SERVER-ONLY — importing it from a client component drags
   `next/headers` + Prisma into the browser bundle and breaks the
   build. The code is stored HASHED (the auth layer's scrypt format)
   with a 15-minute expiry and a 5-attempt counter in three nullable
   User columns; NULL expiry = "no verification pending" (the seeded
   demo users and every pre-s21 account pass straight through login).
   A self-hosted deployment has no mail transport, so the plaintext
   code is logged to the SERVER console at signup/resend time — never
   shipped to the client, never committed.

5. **Census-method hazards (this session's five).** (a) The
   visibility-check INVERSE hazard: `getComputedStyle(el).visibility
   !== 'hidden'` does NOT detect display:none ANCESTORS (computed
   visibility stays `visible` under a hidden container) — it
   false-positived 8 "visible" nav links on the reference's 390px
   probe; the correct check is `el.getClientRects().length > 0`. (b)
   lab()/oklab() computed colors break rgb()-regex parsers — v4
   serializes opacity-modified colors in Oklab, and a naive parser
   silently falls through to the parent background and mis-blends (the
   active-nav 4.32-vs-5.17 contrast false positive). (c) Read the FULL
   computed box-shadow before claiming a missing ring — a 90-char
   truncation cut the 4th shadow layer (the focus ring was rendering
   all along). (d) `role="alert"` ≠ a toast — verify the element's
   container before classifying (the reference's "toast" was the inline
   form banner; the sonner count was 0; and Playwright's getByRole
   also catches Next's built-in `__next-route-announcer__` — scope
   with .filter). (e) agent-browser `fill()` on the reference's
   controlled inputs can silently not-register in React state — use
   the native value setter + an input event.

6. **The bun db-push absolutization trap (bit once this session).** A
   bare `bunx prisma db push` under bun loads the repo .env and
   ABSOLUTIZES the relative `file:../db/custom.db` against the .env's
   own directory → it writes `<parent-of-repo>/db/custom.db` (OUTSIDE
   the repo) while the running server (via `src/lib/db-path.ts`'s
   normalization) reads `<repo>/db/custom.db` — every query then fails
   P2022 "column does not exist". ALWAYS `bun run db:push` (the
   `scripts/prisma-env.ts` wrapper) or `DATABASE_URL` explicitly. The
   stray outer `db/` folder must be deleted after the mistake.

7. **The w-full + w-10 conflict class.** The reference's code inputs
   carry BOTH `w-full` (its stock Input base) and `w-10` (the app
   override) — under its v3 cascade the pair resolves to 40px, but
   under our v4 the same pair in a flex wrap flex-shrinks to ~56px.
   Mirror the COMPUTED result (w-10 only), never the literal class
   list — the s16 "computed-equal, not class-equal" rule's newest
   expression.

8. **The verification method.** The funnel is fully e2e-able WITHOUT
   the email: the wrong-code ladder is deterministic (any wrong code →
   "4 attempts remaining."), the resend banner is live, and the HAPPY
   path (the correct code) is unit-covered only — the plaintext code
   rides the server console, invisible to the browser (the reference's
   own email delivery is equally infra-gated). The full-suite pins:
   `tests/login-views.test.ts` (31 checks) + 5 e2e checks in
   `auth.spec.ts` (the Callout + zero toasts, the signup swap + back,
   the mismatch guard, the verify ladder + resend, the /signup
   superset page).

## 16n. Session-22 Layer (the typography / base-cascade surface: the zero-webfont base, the smoothing + selection retirements, the census-method hazards)

**What shipped:** three retirements that realign the app's entire text
rendering with the reference — 21 sessions of text-metric pins had
compared font SIZE/WEIGHT/line-height/letter-spacing (font-independent
computed properties) and fixed-dimension geometry, but never the font
FAMILY itself, the smoothing mode, or the selection styling.

1. **The reference ships ZERO webfonts.** Its 79.5KB stylesheet contains
   no `@font-face` rule; `document.fonts` is empty; every surface
   (body, h1, buttons, the sidebar brand) computes the stock sans stack
   `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
   "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
   (byte-extracted from its preflight html rule). Our scaffold's
   `next/font/google` Inter rendered every text surface in the wrong
   typeface — measured on the same 62-char string at 16px:
   reference 466.8px/522.4px (regular/bold) vs ours 439px/451.3px.
   The fix: the Inter import + `--font-inter` variable retired from
   `layout.tsx`, and `@theme --font-sans` pins the reference's exact
   stack — pinned EXPLICITLY because Tailwind 4.3's own default is the
   v4.0 `-apple-system, BlinkMacSystemFont, …` list and NOT
   byte-identical (the reference is v3; a "just use the default"
   assumption silently ships the wrong list — and a future Tailwind
   minor could move it again; never pin a "default" you haven't
   byte-verified). Post-fix the controlled-span metrics match the
   reference EXACTLY (466.8/522.4).

2. **The smoothing double-retirement.** The reference computes
   `-webkit-font-smoothing: auto` with no `text-rendering` override
   (zero such rules in its stylesheet). Our scaffold shipped the
   shadcn convention TWICE — `html { -webkit-font-smoothing:
   antialiased; text-rendering: optimizeLegibility; }` in globals.css
   AND the `antialiased` utility on the body className. Both retired;
   macOS rendering now matches the reference's default weight.

3. **The `::selection` retirement.** Our globals.css shipped a
   blue-tinted selection (`rgb(59 130 246 / 0.18)`) — a scaffold-era
   invention; the reference's stylesheet contains zero selection rules
   (the browser default). Retired.

4. **The disproven-pointer lesson.** session_35.md's next-session
   pointer claimed "the reference's 'Notifications alt+T' region hint"
   — a PHANTOM: zero matches in the live DOM (text + attributes), zero
   in the reference's 1.6MB JS bundle ("notify" hits are all
   react-query internals), and Alt+T does nothing from any focus state
   (the first "it focuses the bell" reading was a probe artifact — the
   preceding CLICK had focused the bell). Pointers are LEADS to
   re-verify live, never facts to plan around.

5. **The census-method hazards (three new):**
   - **The `AGENT_BROWSER_SESSION` export leak** — the env var persists
     across bash invocations, so a "reference" probe issued in the same
     shell after `export AGENT_BROWSER_SESSION=clone22` silently ran
     against the CLONE (the smoothing false-parity: both read
     "antialiased"). Prefix reference probes with `env -u
     AGENT_BROWSER_SESSION`.
   - **The focus-race wrap probe** — a programmatic `.focus()` in one
     eval followed by a `press` in a separate CLI call can land focus
     on BODY (lost between commands) and fake a broken focus trap;
     re-establish focus and re-press before declaring the trap broken
     (the drawer's wrap verified clean on the properly-sequenced probe).
   - **The controlled-span metric** — comparing text widths across apps
     requires a created `<span>` with pinned font-size/weight; element
     text widths mix in per-surface class differences (the first
     "119px vs 115px Dashboard link" reading mixed a 500-weight
     reference span against our 400-weight link).

6. **The overflow guard.** The system font runs WIDER than Inter
   (especially bold, ~14%) — after any font change, re-run the 390px
   overflow sweep on all 11 routes (stayed clean here; the wider text
   broke nothing). The e2e font checks count only non-`__nextjs`
   loaded fonts — Next's dev overlay registers Geist faces in dev
   (status "unloaded"); the production build ships neither.

Pinned by `tests/typography.test.ts` (11 checks) + 3 e2e
computed-style checks in `crm.spec.ts`.

## 16o. Session-23 Layer (the ARIA tabs contract + keyboard surface, the activities card restructure, the authed-login redirect retirement, the census-method hazards)

**What shipped:** the first systematic ARIA role/property census (never
swept in 22 sessions — the s20 tab-order census covered focus order
only) surfaced THREE gaps, all live-verified on the reference:

1. **The tabs ARIA + keyboard contract (S23-P1, High).** The
   reference's tab strips are Radix Tabs and ship the full contract:
   every trigger carries `id` (`radix-:rN:-trigger-X`) +
   `aria-controls` → its panel's `id`; every panel carries `id` +
   `aria-labelledby` → back; ALL N panel shells stay mounted (inactive
   ones `hidden` + EMPTY content — Radix mounts the shells, the app
   fills only the active one); the tablist supports ArrowLeft/Right
   with WRAP (4×ArrowRight from tab 0 lands back on tab 0), Home/End,
   and automatic activation (selection follows focus). Our custom
   `tabs.tsx` shipped role=tab/tablist/tabpanel + aria-selected + roving
   tabindex but NONE of the wiring, NO keyboard model (the arrows were
   dead keys), a single unwired panel — and /activities shipped a
   REDUNDANT EMPTY tabpanel (the built-in panel rendered with `{null}`
   children inside the toolbar!) plus a hand-rolled unwired content
   panel below. The fix: `useId()` + a TabsContext, `id`/`aria-controls`
   on every trigger, the exported `TabsPanel` (context-consuming wired
   shell, `hidden` when inactive), the keydown handler (arrows + wrap +
   Home/End + focus-follows-selection + preventDefault), and the
   reference's wrapper anatomy — the component root div carries the
   page's Tabs-region classes and renders `[tablist, children]`, so the
   panels live INSIDE the Tabs subtree (the first attempt rendered the
   panels as siblings OUTSIDE the Provider — the context read `null` and
   every panel id lost its uid prefix, caught by the live wiring probe
   before any test ran).

2. **The activities priority-card restructure (S23-P3, Med — found
   mid-remediation).** The reference's priority card is ONE `p-4
   border-b` region — title row, tab strip, and the panel content all
   inside it, so its border-b renders BELOW the content at the card's
   bottom. The s15-era clone split the content into a CardContent BELOW
   the toolbar, which drew a separator line between the tab strip and
   the rows that the reference DOES NOT SHIP, missed the reference's
   bottom line, and inset the rows at p-6 (24px) instead of the
   toolbar's p-4 (16px) — a 23-session-old structural drift invisible
   to class-level pins (the s6 pin recorded the toolbar's classes
   correctly but not its CONTENT scope). Found by pixel-scanning both
   apps' screenshots for horizontal ~rgb(229,229,229) lines and
   confirmed by DOM-ancestor probes + bounding boxes. The panel classes
   are the reference's own byte-extracted Radix `TabsContent` stock:
   `ring-offset-background focus-visible:outline-none
   focus-visible:ring-2 focus-visible:ring-ring
   focus-visible:ring-offset-2` + `mt-4 space-y-2` (activities) /
   `mt-2 space-y-4` (settings) / `mt-2` (reports) — the mt-* collapses
   against the wrapper's space-y margins: 16px gap on activities, 24px
   on settings/reports, live-measured EQUAL on both apps post-fix.

3. **The authenticated /login redirect retirement (S23-P2, Low).** Our
   login page ran `if (user) redirect("/")` — an invented scaffold
   pattern. The reference serves the login card to AUTHENTICATED
   visitors with no redirect (live-verified twice: the ARIA census row
   + an authed wrong-password attempt rendering the banner on the
   card). The redirect + its `getSessionUser` import retired; the page
   stays `force-dynamic` (the reference serves /login dynamically).

4. **The census-method hazards (→ this section):**
   - **The auth-state hazard**: the first clone ARIA census ran
     logged-out (an earlier probe had logged the session out) — every
     route redirected to /login and the garbage counts mis-read as
     parity gaps. Re-login + re-sweep; verify each row's
     `location.pathname` and a page marker INSIDE the probe.
   - **Platform-vs-app element separation**: the reference's `img`
     counts include the base44 watermark badges (2 per page) — classify
     platform chrome before comparing native-element counts.
   - **Data-driven count inflation**: DOM-count deltas between a
     seeded clone and a zero-data reference are dominated by per-row
     action buttons — compare chrome-level counts or normalize by rows.
   - **The reports skeleton race (e2e)**: the reports fetch toggles a
     `loading && !data` skeleton pass that UNMOUNTS the whole Tabs
     region — an evaluate that passes `toBeVisible(tab)` can still hit
     the skeleton window and read zero tabs; wait for the post-load
     chart (`.recharts-wrapper` in the tabpanel) before probing.

5. **Verified at parity (no action):** the combobox layer (3/3 on /,
   5/5 on /accounts, 2/2 on /activities, 4/4 on /reports — both apps'
   selects/view-switchers are the same Radix combobox family; ours
   labels the unnamed "Recent deals view" switcher, the s20 documented
   superset); the calendar day cells (the reference's are clickable
   DIVs with a `bg-blue-600 text-white` selected state — our BUTTON
   cells with aria-pressed/aria-label are the documented s13 accessible
   superset; "October 2026" / "Upcoming Events" / "Agenda View"
   headings match); the login error banner carries `role=alert` on BOTH
   apps (the s21 visual pin's ARIA half, confirmed); the reference's
   /login empty `aria-live=polite` section is platform announcer chrome;
   our sidebar `aria-current=2` superset; the 500 error-state page is
   UNPROBEABLE on the reference (SPA-fallback 200s + 404s — no 500
   trigger in 23 sessions; documented unverifiable, no action).

Pinned by `tests/tabs-aria.test.ts` (15 checks) + the session-23 e2e
test (wiring + shells + keyboard on all three strips).

## 16p. Session-24 Layer (the route-case contract, the capitalized nav
hrefs, the dead More... affordance, the URL-state census closed)

The session-39 pointer named the URL-state behaviors as the unprobed
layer. The census ran BOTH directions on the reference (writes watched
on every stateful control; deep-link params probed; the link graph
enumerated; every route probed at both casings BROWSER-side) and found
the URL layer itself at parity — but the ROUTE-CASING surface beneath it
had never been checked in 23 sessions:

1. **S24-P1 — the route-case contract.** The reference's sidebar links
   point at CAPITALIZED paths (`/Dashboard`, `/Accounts`, `/Contacts`,
   `/Leads`, `/Calendar`, `/Activities`, `/Reports`, `/Settings` —
   byte-extracted from its live DOM) and its account menu ships
   `<A href="/Profile">`. Every capital URL renders the real page IN
   PLACE with NO normalization, and each casing is a first-class SSR
   route: `/Reports` serves og:url + canonical at `…/Reports` while
   `/reports` serves them at `…/reports` (curl-diffed — identical
   otherwise); `/Dashboard` serves the ROOT head (og:url/canonical at
   the origin) exactly like `/`. Our clone 404'd every capital app
   route, and its s14 `/Profile` alias NORMALIZED the URL bar to
   `/profile` (the reference keeps `/Profile`). Implemented as NINE
   thin RENDER aliases inside the `(app)` group — each re-exporting the
   lowercase page component + `pageMetadata({ page, route: "/Capital" })`;
   the Dashboard alias exports NO metadata (inherits the root head);
   the s14 top-level redirect alias is retired. The lowercase routes
   stay canonical (every prior pin, the sitemap, the search rows).
   THE AUTH ROUTES ARE THE EXCEPTION: the reference's `/Login` and
   `/Signup` render its 404 view (its client router case-folds only the
   app routes) — our clone 404s them too, parity by coincidence, and
   `tests/route-case.test.ts` PINS that no capital auth alias ever
   appears. Route FOLDERS, never next.config redirects — config
   redirects match case-insensitively and a `/Profile -> /profile`
   rule self-loops into ERR_TOO_MANY_REDIRECTS (the s14 lesson,
   twice-reproduced).

2. **S24-P2 — the href + active-state contract.** `NAV_ITEMS` hrefs are
   the reference's capitalized set (Dashboard at `/Dashboard`, NOT the
   root — its post-login redirect still lands on `/`, both paths serve
   the dashboard). The active-state matcher is CASE-INSENSITIVE (the
   reference highlights its Reports item at lowercase `/reports` —
   probed on its live DOM) with the Dashboard special case (`/` OR
   `/Dashboard`): `pathname.toLowerCase()` vs `href.toLowerCase()`.
   The account menu pushes `/Profile`. The topbar SEARCH-result row
   targets stay lowercase + documented as data-gated-unverifiable (the
   reference's search dropdown never opens at zero data — 20 sessions).

3. **S24-P3 — the dead More... affordance.** The reference's dashboard
   "More..." ghost button is a complete NO-OP (live-clicked: zero DOM
   delta, zero dialogs, zero navigation — the same dead-affordance
   family as its mail/bell buttons). Our `router.push("/leads")` was an
   invented behavior invisible to the s6 visual pin — the same class as
   the s21 invented toasts and the s23 invented authed redirect: ALWAYS
   probe the CLICK contract of a pinned control, not just its classes.

4. **URL-state parity, CLOSED:** both apps write ZERO URL state (leads
   filters, table sorting, the reports period/owner/stage/status
   selectors, the calendar month chevrons, the dashboard view-switcher,
   the tab strips, the topbar search) and both IGNORE deep-link params
   (`/leads?status=New&view=board&sort=name` leaves the table mounted;
   `/calendar?month=2026-11` still shows the current month — the string
   persists in the bar with zero effect on both apps). Never serialize
   view state into the address bar.

**The TS1149 casing collision (the implementation hazard):** the nine
capital aliases ship as **`.jsx` files**, NOT `.tsx` — TypeScript's
TS1149 fires whenever ONE program includes two real files whose paths
differ ONLY in casing ((app)/Accounts/page.tsx vs
(app)/accounts/page.tsx), and Next's generated
`.next/types/validator.ts` imports BOTH casings of every dual route.
The check is NOT flag-controllable (`forceConsistentCasingInFileNames:
false` does not suppress it — empirically reproduced in a minimal
repro this session). The `.jsx` extension keeps the alias out of the
collision (paths differ by extension), resolves through `allowJs`
exactly like the validator's `page.js` import, and compiles
identically through SWC; the lowercase `page.tsx` stays canonical +
type-checked. NEVER "normalize" a capital alias back to `.tsx` — the
typecheck gate will fail with eight TS1149s the moment Next regenerates
its validator.

Census-method hazards this session (the §16p lessons):
- **CLI latency hides SPA skeleton passes** — an `eval` after
  `agent-browser open` lands post-hydration; install a MutationObserver
  BEFORE the navigation to catch transitory loading states (this
  session's pulse-catch: the reference's /Reports nav shows ZERO
  animate-pulse elements at CLI timescales).
- **Route-case censuses need BROWSER probes, not curl status codes** —
  the reference's SPA-fallback 200s every unknown path (its `/Login`
  returns 200 to curl but renders the 404 view client-side); only a
  rendered-DOM probe (h1 read) distinguishes page-served from
  fallback-served.
- **Case-folding is ROUTE-SCOPED, not platform-wide** — the reference
  case-folds its 9 app routes but NOT its auth routes; neither a
  "lowercase everything" nor a "redirect everything" shortcut would
  have matched it.
- **Probe the drawer with COMPUTED visibility** — `element.style
  .visibility` (inline) reads empty for the open drawer; the contract
  lives on `getComputedStyle(el).visibility` (the closed-state probe
  from the s20 checkVisibility hazard, inverted).

Pinned by `tests/route-case.test.ts` (16 checks — including the
no-`.tsx`-in-the-capital-folders pin) + the rewritten
`tests/profile-route.test.ts` (5) + the session-24 e2e checks (the
capital-route renders, the capitalized sidebar href set, the
case-insensitive active state, the capital-auth 404, the dead
More...).

## 16q. Session-25 Layer (the instant-render loading model, the real
client-side export artifacts, the saved-reports seam, the period
vocabulary)

The session-41 pointer named the loading/suspense states + the print
stylesheet family as the unprobed layers. Both closed at parity (the
reference ships zero `@media print` rules; its bundle carries only
library-standard keydown handlers), and the loading census found the
layer beneath: **the reference renders INSTANTLY with zeros** — with
its Lead entity fetch network-ABORTED, the full /Leads page paints
immediately (h1, KPI cards at 0, the empty table row, "Hi, Guest"
when the user fetch fails too). Every skeleton family in the clone
was an invention:

- **The dashboard** rendered 6 × `h-[118px]` KPI skeletons from first
  paint (the `!k` condition). The cards now render via
  `k?.totalLeads ?? 0` null-safety — the reports page's established
  pattern; the deltas already accepted `number | undefined`.
- **Leads/accounts/contacts** rendered 5 × `h-12` skeleton rows during
  the fetch window (`loadingFlags.X && X.length === 0`). The tables
  render their empty-state row directly.
- **The reports page** carried a `loading` state + 5 KPI + 4 ×
  `h-64` ReportSkeletons. Retired — each TabsPanel renders its tab
  unconditionally with `data` possibly null.
- The store's `loadingFlags` field + `loading()` helper + the
  `misc.tsx` Skeleton export are GONE. NEVER reintroduce a skeleton
  branch — the empty state IS the loading state (the session-10
  ChartEmpty-retirement precedent, applied page-wide).

**The export/button contracts (the s24 click-contract lesson
applied):** the reference's Reports exports are REAL client-side
artifacts, live-verified by clicking every button and examining the
downloads:

- The header **PDF** button spawns an `IFRAME.html2canvas-container`,
  captures the CONTENT area (no sidebar), and assembles via **jsPDF**
  into A4 portrait pages — `crm_reports_YYYY-MM-DD.pdf`. Our seam:
  `src/lib/pdf-export.ts` with **html2canvas-PRO** (NOT classic 1.4.1
  — our Tailwind v4 stylesheet carries 242 `color-mix()` calls the
  classic parser cannot read; zero oklch, but color-mix alone forces
  the fork).
- The per-table **Export PDF** buttons generate TEXT jsPDFs (3.5KB on
  the reference): the card title TRUNCATED at the parenthetical
  ("Deals at Risk (No Activity 14+ Days)" → "Deals at Risk"), a
  `Generated: M/D/YYYY` line, the column headers, the rows — as
  `<slug>_YYYY-MM-DD.pdf` via the `tableSlug()` rule.
- The **CSVs** download as `prefix_YYYY-MM-DD.csv` (underscore + ISO
  date — NEVER `prefix-YYYYMMDD.csv`): the leads 8-column set
  (Name,Email,Phone,Company,Value,Status,Source,Next Follow-up), the
  SINGULAR `crm_report_` 7-column deal CSV (the filter-aware
  `/api/export?type=report`), and the per-table 3-column CLIENT-side
  blobs — the reference's own inconsistency: its per-table CSV
  prefixes are SHORTER literals (`open_deals_`, `deals_at_risk_`)
  than its PDF slugs (`open_deals_by_stage_`).
- The previous `window.print()` + `toast.info("Print dialog
  opened")` was an invention on all three buttons — retired.

**The Saved Reports seam:** the reference's "Saved Reports (N)"
button opens a full dialog — Report Name input (placeholder
`e.g., Q1 Won Deals by Region`), the 6 column checkboxes
(Name/Account/Owner/Value/Stage/Won Date), the Current Filters
summary (raw slugs, 3 dimensions), the loadable list — persisting to
`localStorage.crm_saved_reports` as
`[{id,name,filters{dateRange,stage,source,status,owner},columns{…},
createdAt}]` (id = `Date.now()`). **Load** reapplies the saved
filters + closes. The seam: `src/lib/saved-reports.ts` (the
lead-filters.ts pattern) + `src/components/shared/
save-report-dialog.tsx`. The count label hydrates client-side (the
established localStorage effect pattern).

**The period vocabulary:** `REPORT_PERIODS` is the reference's
6-entry set — today/week/month/quarter/ytd/all (Today / This Week /
This Month / This Quarter / YTD / All Time). `this_year` was retired
for `ytd`; `today` was missing. `periodStart()` maps today →
startOfDay + ytd → startOfYear; the page default is `quarter`. This
also makes the saved-report `dateRange` values byte-faithful.

Census-method hazards this session (the §16q lessons):
- **The skeleton window needs an init-script fetch delay** — at CLI
  latencies every post-open eval lands post-hydration; only a
  `--init-script` that patches `window.fetch` (with `init` passed
  THROUGH — a url-only patch silently converts POSTs to GETs and
  405s the login) exposes the transitory loading states.
- **Client-side download generation is invisible to MutationObserver**
  — jsPDF/blob downloads create + click + remove the anchor
  synchronously; spy on `document.createElement('a')` +
  `URL.createObjectURL` and check the Downloads folder for the
  artifact.
- **An eval `.click()` does not switch Radix tabs** (and dispatched
  MouseEvents are unreliable on the reference's handlers) — tab-switch
  probes MUST use real agent-browser ref clicks (this session's S25-P3
  false-negative: the per-table export buttons "missing" until a real
  click showed them).
- **Sequencing hazard:** navigating away mid-fetch kills the login
  POST — the delayed-API harness must let the auth call complete
  before navigating.

Pinned by `tests/loading-layer.test.ts` (8) +
`tests/pdf-export.test.ts` (10) + `tests/saved-reports.test.ts` (13)
+ `tests/csv-contract.test.ts` (7) + `tests/report-periods.test.ts`
(3) + the session-25 e2e checks (the zero-skeleton pass, the three
download artifacts, the save/load round-trip, the 6-option period
dropdown).

## 16r. Session-26 Layer (the Settings Data-tab + import/export contract)

**The audit layer.** Never swept in 25 sessions — the s44 "Next"
pointers (the settings danger-zone reset flow was "destructive — probe
on a throwaway workspace"; the accounts/contacts export column sets
were "data-gated — 22 sessions"). The unlock: the reference's own
minified bundle (`fetch` each /assets/ + /static/ script from inside
the page, `indexOf` pattern walks) gave up the exact implementations
where the live DOM cannot express the contract.

Six findings, all live + bundle verified:

- **S26-P1** — the Data tab's three CardDescriptions (the s14 pin
  recorded the card chrome, never the header subtitles — the same
  class-of-pin blind spot as s24's More... button) + the 2nd+ button
  margin `ml-0 sm:ml-2` (live-computed 8px at 1280 — a class-level pin
  that recorded only the FIRST button of a row misses the family).
- **S26-P2** — the reset flow: the native confirm() gate with the
  reference's 118-char message, the native alert() reporting ("Data
  reset complete" / "Failed to reset data" / the defensive "Please
  type RESET to confirm"), the trash2 icon; our toast was the
  invented-behavior family again. The store's refetch-every-slice
  half was ALREADY at parity (predates session-26).
- **S26-P3** — the template buttons are STATIC client-side blobs
  (`contacts_template.csv` etc.); ours hit `/api/export` (live data,
  wrong filename, wrong content). The seam: `src/lib/csv-templates.ts`.
- **S26-P4** — the export buttons are client-side RAW DUMPS:
  `contact_/account_/lead_/activity_` + ISO date (SINGULAR prefixes —
  the reference's onClick args are "Contact"/"Account"/"Lead"/
  "Activity" lowercased); the header is the FIRST ROW's own keys
  (Object.keys(rows[0] || {}).join(",")), every value double-quoted,
  an EMPTY file at zero rows. The seam: `src/lib/entity-export.ts`.
  `/api/export` retired to `type=leads` + `type=report` only.
- **S26-P5** — the page-level exports: contacts
  Name,Email,Phone,Company,Position,Status,Source + accounts
  Name,Industry,Phone,Email,Website,Annual Revenue,Employees,Status,
  Tier,Health — quoted cells, the zero-data guards, and the
  header-disabled/toolbar-guarded pair split (the reference's own
  inconsistency). The Health gap was a MODEL gap: Account now carries
  a STORED `health` (backend-defaulted "Healthy" — the reference's
  dialog has no health field; ours seeds the three-state vocabulary).
- **S26-P6** — the Import Contacts dialog end-to-end: sm:max-w-md,
  the Select File label, the w-32 dashed dropzone (the `upload` w-8
  h-8 glyph), the blue chosen-file box (the `file-text` w-4 h-4
  glyph), the Required/Optional columns box, the Cancel/Close + Import
  footer (disabled until a file, "Processing..." while busy), and the
  green (`circle-check-big`) / red (`circle-alert`) result box with
  `Successfully imported N contact(s)` + the 2-second auto-close. The
  failure vocabulary is the reference's exact strings. NO template
  link — ours invented one.

Census-method hazards this session (the §16r lessons):
- **The reference's own bundle is the census instrument of last
  resort** — three surfaces held "data-gated — 22 sessions" status
  until the minified bundle gave up the exact export/reset/template
  implementations. The bundle is ground truth even where the live DOM
  cannot express the contract (zero-data states, with-data column
  orders, native dialogs).
- **Native dialogs need explicit interception** — `confirm()`/
  `alert()` block the page; resolve with `dialog accept`/`dialog
  dismiss` before any further command. And an `alert()` following an
  accepted `confirm()` in the same handler may be auto-dismissed by
  the CLI — treat the bundle as ground truth for the alert STRINGS,
  the live DOM for the state changes.
- **Per-index class pins**: a row that mixes per-item classes (the
  ml-0 sm:ml-2 family) is invisible to a pin that records only the
  first button — pin per-index classes or computed marginLeft.
- **Probing the reference can be self-undoing** — the import-success
  probe created one contact; the danger-zone reset (itself the
  documented destructive probe) wiped it again, restoring the
  22-session zero-data state. The safe order: create → probe → reset
  → verify zero.

Pinned by `tests/settings-data-tab.test.ts` (10) +
`tests/reset-flow.test.ts` (6) + `tests/csv-templates.test.ts` (5) +
`tests/entity-export.test.ts` (16) + `tests/account-health.test.ts`
(4) + `tests/import-dialog.test.ts` (9) + the session-26 e2e checks
(the three descriptions, the template artifacts, the raw-dump
exports, the quoted page CSVs, the import round-trip, the reset's
decline-holds/accept-wipes native-dialog round-trip).

## 16s. Session-27 Layer (the chart internals + the Account Health / calendar contracts)

**The audit layer.** The s45 "Next" pointers (the account-detail health
surface and the calendar day-cell contract — both "data-gated" for 22
sessions) plus the chart-internals family that the reference's persistent
zero-data state made invisible. The method: the s26 bundle-extraction,
now SYSTEMATIZED — the 1.63MB bundle fetched to a local file for
rg/python walks (the in-page `window.__BUNDLE` cache dies on every SPA
navigation), with live-DOM cross-checks on every surface that renders at
zero.

The systemic finding first: **the reference's Cartesian charts ship
STOCK recharts axes** — the live SVG carries
`line.recharts-cartesian-axis-line` + `line.recharts-cartesian-axis-
tick-line` at the default #666, stock 5/5/5/5 margins, stock 60px YAxis
widths. Our scaffold-era family hid them everywhere
(`axisLine={false} tickLine={false}` + custom margins + width 32/56 +
`allowDecimals={false}`) — a 26-session-old invention nobody could see
at zero data. The rewrite (`src/components/charts/charts.tsx`):
`SingleBarChart` (one Bar, single fill, optional radius/name/formatter/
tick/grid), `GroupedBarsChart` (the won/lost + Activities/Won-Deals
PAIRS + stock Legend — bar pairs, never lines), `TrendLineChart`
(1-2 strokeWidth-2 lines), `LabelPieChart` (the FULL pie — outerRadius
90/100, labelLine false, per-slice label formatters, palette Cells, NO
innerRadius/paddingAngle/Legend), `HorizontalBarChart` (the funnel
#06b6d4 YAxis-width-100 + the tab-5 Top-10 #3b82f6 YAxis-width-120 $).
Retired: `PipelineBarChart`, `WonLostLineChart`, `DonutChart`,
`FunnelBarChart`. `RevenueLineChart` survives ONLY as the dashboard's
won/target areas — re-pinned to fillOpacity **.6/.3** (not 0.08) with
STOCK strokeWidth (not 2.5) + the $ tooltip + tick 12.

The per-surface chart corrections (all bundle-extracted):

- **Reports tab-1**: Revenue = ONE #3b82f6 strokeWidth-2 LINE over
  {month, revenue} (not the dashboard's won/target areas); Won vs Lost =
  grouped BARS + stock Legend; Pipeline by Stage = ROW-DERIVED (empty at
  zero — the fixed 8-slug list was wrong here) with violet #8b5cf6 value
  bars + the "Value ($)" name + a plain-number tooltip; the funnel =
  single #06b6d4 fill, YAxis width 100, no radius/maxBarSize/Cells.
- **Reports tab-2**: Forecasting = TWO lines (forecasted #3b82f6 /
  actual #10b981, $ tooltip) + the bold caption value; the pipeline =
  blue value bars + $; Forecast by Probability = a PIE over the FIXED 4
  bands with `${band}%: $${(v/1e3).toFixed(0)}K` labels + the 4-color
  palette; Aging = violet count bars on the "age" XAxis.
- **Reports tab-3/4**: by-type + by-source = label PIES (`${type}:
  ${count}` / `${source}: ${count}`, the 5-color palette); over-time =
  ONE #3b82f6 line; vs-wins = grouped bars; win-rate = #10b981 + the %
  tooltip; avg-value = #8b5cf6 + the $ tooltip; the overdue rows carry
  bg-red-50 + outline-Badge types.
- **Dashboard**: the pipeline bars are SINGLE #3b82f6 radius [8,8,0,0]
  on the VALUE dataKey ($ tooltip, tick 12) with the per-stage colors
  living ONLY in the PIPELINE_LEGEND chips (w-3 h-3 rounded squares on
  the O-map of bg-*-500 classes, looked up by the LABEL slug — the
  "Won" label misses `closed_won` and falls back to bg-gray-400: the
  s13 "grey #9ca3af" pin finally explained as a LOOKUP MISS).
- **Leads rail**: the 5-status vocabulary (new/contacted/qualified/won/
  lost — "Contacted" elides from the ticks at the 331px card, recharts
  tick elision) with VALUE sums; the funnel labels are New Leads/
  Contacted/Qualified/Won (status-cumulative, LEADS_FUNNEL fills
  #3b82f6/#8b5cf6/#10b981/#22c55e); wonlost = grouped bars.
- **Activities by-type**: single #3b82f6 radius [4,4,0,0], tick 10, NO
  grid, no maxBarSize/interval.

**The reference HARDCODES its KPI data** — the dashboard sparks are the
static arrays `[10,12,11,14,13,15]`/`[40,55,45,70,60,80,75]`/…, the
deltas the literals "+5.3%"/"+15%", the reports sparks the single array
`[65,72,68,85,78,92]`, and the Sales Target progress is NEUTRAL
text-gray-600 (never a green/red delta). Our real-data sparks rendered
EMPTY in dataless quarters where the reference always shows the shape.
`KPI_STATICS` in page-layout.ts pins them; NEVER feed these cards real
series.

**The Account Health tab is COMPUTED, not stored**
(`src/lib/account-health.ts`): `daysSinceActivity = last activity ?
diffDays(now, it) : 999`; `health = days>60 || hasLostDeals ? "At
Risk" : days>30 ? "Needs Attention" : "Healthy"`. The distribution is a
LabelPieChart (outerRadius 100, `${name}: ${value}` labels, fills
#10b981/#f59e0b/#ef4444); the Top-10 a horizontal #3b82f6 chart (sorted
revenue desc, YAxis width 120, $ tooltip); the at-risk rows bg-red-50
with "Nd ago"/"Never" + the bg-red-100 text-red-800 "At Risk" badge
(slice 20); the summary statuses outline Badges with the `|| "-"`
industry. The STORED `Account.health` (s26) stays on the accounts export
only — the reports tab computes its own, exactly like the reference.

**The dashboard's Lead Sources + Upcoming Activities are checkbox
rows** — `p-2 hover:bg-gray-50 rounded` rows with the INERT stock
Checkbox + "Follow up with {source}" (slice 4) / description + related +
`toLocaleDateString()`. The invented progress-bar and colored-dot lists
are retired.

**The calendar chips are the interactive layer** — the day cells' event
chips carry the `EVENT_TYPE_CHIP` tints (bg-*-100 + text-*-800 + a
solid bg-*-600 dot, w-1.5 h-1.5) + title-only text (no time prefix) +
`onClick → the EDIT dialog` + the title attr; the day numbers are PLAIN
TEXT (`text-xs sm:text-sm font-medium mb-1` — no circle pill); "+N
more" is a separate line after the chips; the Upcoming rows are the
`p-3 border rounded-lg hover:bg-gray-50` tall-bar family (w-2 h-12
colored bar + `formatMonthDayTime` "MMM d, h:mm a" + the related line +
Pen/Phone-on-call/MessageCircle ghost buttons); the Agenda is the
FILTERED events list (slice 10 — NOT the selected-day list) in the
40×40 tinted-square rows with the EllipsisVertical Edit/Delete dropdown.
Our clickable day-cells stay the accessible superset over the
reference's inert divs.

Census-method hazards this session (the §16s lessons):

- **The chart-internals family was invisible at zero data for 26
  sessions** — fills, formatters, radii, tick styles, chart TYPES
  (line vs bar vs pie), and row-derived-ness are ALL zero-invisible.
  The bundle gives every one. Never pin a chart's internals from its
  zero-data DOM alone.
- **The bundle contains DEAD paths** — the leads-funnel cluster found
  first (New Leads/Contacted/Qualified/Won from status) is the live
  one, but the sibling "Pipeline Value by Stage" cluster had to be
  cross-checked against the live ticks before trusting it. The live DOM
  is ground truth for what RENDERS; the bundle for the WITH-DATA
  contract; both checks are required before remediation.
- **Recharts tick elision can fake a vocabulary** — the reference's
  leads pipeline ships FIVE stages but renders four ticks at 331px
  ("Contacted" elided). Never read a chart's vocabulary from rendered
  ticks alone; the data construction in the bundle is the truth.
- **Cache the bundle OUTSIDE the page** (`curl` to a local file) — the
  in-page `window.__BUNDLE` cache dies on every SPA navigation and the
  eval failures look like syntax errors.
- **A CSS-class lookup is a behavior, not a mapping** — the reference's
  "Won = gray-400" is a lookup MISS (the label "Won" never matches the
  map key "closed_won"), not a mapped color. Mirror the LOOKUP
  MECHANISM (label → slug → map ?? fallback), never just the observed
  colors — our internal stage ids (new vs prospecting) would have
  produced the wrong chips from a color-only copy.

Pinned by `tests/charts-internals.test.ts` (25) +
`tests/account-health-tab.test.ts` (15) + `tests/dashboard-contracts.test.ts`
(15) + `tests/leads-charts.test.ts` (8) + `tests/calendar-cells.test.ts`
(17) + the session-27 e2e checks (the health tab's PIE + Top-10 + red
rows, the Follow-up checkbox rows, the static KPI sparks, the calendar
chip → Edit dialog, the single-blue by-type bars). The s13
charts-contracts pins were RE-SCOPED to the new family (the
FunnelBarChart pins → HorizontalBarChart; the funnel-is-horizontal
intent preserved).

## 16t. Session-28 Layer (the entity edit/detail contracts)

The s47 pointers CLOSED: the "contact-detail/edit dialog" decomposed into
FIVE surfaces (the W7 edit dialog, the Pke slide-over, the kke filter
panel, the AAe h3 headers + raw-source split, the NAe Scan Card), the
account layer gained the wce edit dialog + the Ece insights dialog + the
rebuilt row, and the leads layer the Mke edit dialog. The model grew the
reference's contact vocabulary (priority Key/Standard/At Risk, role,
engagementLevel, companySize, photoUrl, RAW source values).

**The reference NEVER reuses create dialogs for editing** — the
W7/wce/Mke family is a separate max-w-2xl form per entity
(`src/components/shared/entity-edit-dialog.tsx`): grid-cols-2 rows, the
Status/Source select pair with value/label splits (value "call", label
"Call"), Save Changes/Saving..., and a readOnly "... Details" mode. The
reference's own inconsistencies pinned: the contact edit's source is
PLAIN (emojis are create-only), the lead edit's status is the 4-option
set (not the table's 5), the lead edit's source has FOUR options.

**The contacts row is an interactive surface**: the inline role select
(immediate mutation), the 3-bar engagement cell, the Key amber row tint
+ avatar overlay, the >=30d opacity-70 + red ce text, the raw-source
blue badge, the Call/Email/WhatsApp hover-tinted icons + the
EllipsisVertical menu, and the ROW CLICK -> the Pke slide-over
(`src/components/contacts/contact-detail-panel.tsx`, md:w-[500px]).

**The accounts row + insights**: the Key-tier yellow tint + filled star,
the overdue border-l-4 + "{N} Overdue" badge, the owner initials box,
the HEALTH badge under the "Status" header (the header/cell mismatch
mirrored), the row click -> the Ece insights dialog (max-w-3xl, the 3
stat cards, the type-tinted activity rows, "Close Date: " deal rows).

Census-method hazards this session (the §16t lessons):
- **The empty-state row is the first tbody tr** — the SSR'd
  "No accounts found" row passes toBeVisible BEFORE the client fetch
  lands, and clicking it does nothing: the click-races-the-fetch flake.
  Wait for the data (`getByText("No … found")).toHaveCount(0)`) before
  row interactions (the hydrate-race lesson's list variant).
- **The stripComments helper eats `/*` in STRINGS too** — an
  `accept="image/*"` attribute opens a comment to the next `*/`,
  swallowing everything after it; the https:// placeholder falls to the
  `//` variant of the same hazard. Anchor on raw source or strip-safe
  prefixes.
- **The running dev server holds the OLD Prisma client** after a schema
  push + client regeneration — the API keeps serving the old field set
  (the new columns read as null) until restarted. Restart the dev
  server after every db push.
- **agent-browser screenshots resolve paths against ITS cwd** — use
  absolute paths for captures.
- **The tabs strip shares the stat grid's classes** (both
  grid grid-cols-3) — scope stat-card locators with the gap-4
  distinction, and activate a tab before asserting its (hidden) panel.


## 16u. Session-29 Layer (the leads interactive-table contracts)

The C2 pointer CLOSED: the leads table is the reference's INTERACTIVE
surface (bundle-extracted + live-verified), and the popover layer was
live-exercisable for the first time — which DISPROVED the s8 "Save View
is inert" pin (it was the s26 native-dialog auto-dismiss hazard all
along).

**The row**: the orange Target name box (`w-10 h-10 bg-orange-100
rounded-lg` + `Target` w-5 h-5 text-orange-600 + `p.font-medium`); the
text-sm cells with the `-` single-hyphen fallback; the INLINE Value
number input (`w-24 h-8 text-sm`, placeholder `"$0"`, `parseFloat(v) ||
0` → immediate mutation) / Status select (`w-32 h-8`, EXACTLY the five
raw options new/contacted/qualified/won/lost — NOT the edit dialog's
4-option set; a proposal/negotiation/unqualified stage renders a BLANK
trigger, Radix's unmatched-value behavior) / Next Follow-up date input
(`w-36 h-8`) with the overdue `border-red-500` + `CircleAlert` w-4 h-4
text-red-500; the raw-source outline `text-xs` badge; the ⋮
EllipsisVertical menu with **"Convert to Opportunity" DEAD (no onClick —
the reference's own quirk, the dead-exports precedent)**; an EXPLICIT
`hover:bg-gray-50` on a NON-clickable row (unlike contacts/accounts); the
STICKY thead (`sticky top-0 bg-white z-10`, live-confirmed); the w-12
actions header; the cursor-pointer gap-2 sort headers.

**The mutation seam**: the store's `updateLead` applies the patch to the
leads slice BEFORE the await — the reference's React-Query cache updates
instantly on inline edits, and per-keystroke CONTROLLED inputs need the
optimistic apply or the stale server value clobbers mid-typing. The
refetch reconciles; on failure it rolls back to server truth.
DropdownItems close the popover on click (`PopoverPrimitive.Close
asChild`) — the reference's real DropdownMenus auto-close on select.

**The filtered-set doctrine (the H/U bundle extracts)**: the KPIs, the
charts, AND the Export all derive from the FILTERED set — "Open Leads" =
new+contacted+qualified (not everything-not-won), "Dropped Deals" = lost
STRICTLY (unqualified is not dropped), the conversion rate is the
one-decimal toFixed(1), and the avg sales cycle is the average AGE of
the won leads (now − created, floored to days — NOT created→closed). The
Export button builds a CLIENT-SIDE blob from the filtered rows: the
UNQUOTED 8-column header, every VALUE cell `"quoted"`, `\n` joins,
`leads_YYYY-MM-DD.csv` (`unquotedHeaderCsv` in src/lib/entity-export.ts);
`/api/export?type=leads` is RETIRED (the route serves type=report only).

**The Gke popover (live-verified)**: the Status/Source selects store RAW
values with explicit All items bound to the `"all"` sentinel; the
trigger gains the **"(Active)"** suffix while any filter is set
(`filtersActive`); **Save View fires the NATIVE
`prompt("Enter view name:")`** and the saved views render as a
`w-full sm:w-48` "Saved Views" select that APPLIES a view's filters on
selection. The reference keeps its views IN MEMORY (no localStorage key,
live-verified) — ours persists the list under
`neo-crm.leads.views` (the documented superset) while the FILTERS
themselves do NOT auto-restore on load (the reference starts every load
at the defaults — the s8 auto-restore behavior retired).

**The RAW source migration (the s28 contact precedent)**: lead sources
store raw values end-to-end (value "call", label "Call") —
`LEAD_SOURCE_OPTIONS`, the create dialog (default "email"), the seed's
LEAD_SOURCE_MAP, the dashboard's "Follow up with {raw}" rows, the CSV
exports, the table badge. The reference's filter semantics: the search
matches name OR email OR company (the OR-form, not a concatenated
string); status/source are STRICT equality (the dropped/unqualified
mapping retired); a min value passes only TRUTHY lead values (the
reference's own `X.value &&` quirk — zero-value leads never pass a min
filter); the follow-up filter compares the raw date string.

**The "Loading..." row is a bundle-only transient**: the reference's
leads table ships a "Loading..." row for the in-flight first fetch
(`isLoading`), but an ABORTED fetch lands in the error state (isPending
false) — the s25 live census saw "No leads found" and the row has never
been visible in 25+ sessions of probing. Our instant-empty model stays
(pinned by `tests/loading-layer.test.ts`) — the documented divergence.

Census-method hazards this session (the §16u lessons):
- **agent-browser's selector engine is NOT Playwright** — the
  `:has-text()` pseudo-class silently fails (plain CSS only); use
  aria-label CSS selectors or eval-based text clicks, and never swallow
  the errors when scripting capture batches.
- **A SYNCHRONOUS `window.prompt` hangs the Playwright click promise**
  — `page.waitForEvent("dialog")` resolves but the click that fired the
  prompt never completes; intercept with `page.once("dialog", d =>
  d.accept(...))` registered BEFORE the click (the reset-flow pattern).
- **A date-only "today" string parses at UTC MIDNIGHT** —
  `new Date("2026-10-02") < new Date()` is TRUE for most of the day, so
  "today" IS overdue under the reference's `ee` (pin on the UTC date
  string in timezone-sensitive tests, or the assertion flips before
  08:00 in UTC+8).
- **JS `.click()` bypasses hit-testing** — an eval click lands on
  COVERED elements (a row's ⋮ behind an open slide-over), so scripted
  captures must verify the overlay state, not just the click result
  string.


## 16v. Session-30 Layer (the photo-upload contracts)

The s51 pointer CLOSED: the reference's four `UploadFile` call sites
(bundle index-DZ-xbrIm.js — the authed app serves its bundle from
`/assets/`, NOT `/static/` — two of them LIVE-exercised on the reference
with a real 1x1 PNG) are now mirrored by a self-hosted seam. The audit
also found the dialog scroll-cap layer — a SYSTEMIC geometry family the
s15 dumps missed.

**The upload seam (our UploadFile mirror)**: `POST /api/upload`
(multipart formData, session-guarded, `type.startsWith("image/")`
enforced server-side — the reference checks it client-side only — plus
the 5MB ceiling its own profile hint advertises; stored at
`<repo>/uploads/<32-hex>.<ext>`, gitignored like `db/`; returns
`{file_url: "/api/uploads/<name>"}`) + `GET /api/uploads/[name]`
(public — the reference's file_urls are public CDN links; the pinned
32-hex charset leaves no traversal surface; immutable caching). The
repo-root resolution mirrors db-path's validated-anchor pattern so dev,
build, and the standalone server share one folder.

**The AAe contact-dialog photo section** (LIVE-verified end-to-end:
upload → img renders + the remove X appears; the non-image alert
intercepted at the exact string): the `w-24 h-24 … shadow-lg` gradient
circle renders `img.object-cover` when `photo_url` is set, else the
2-char initials, else the `User` glyph (`w-10 h-10 text-white/80` — the
empty-name fallback the s15 "empty circle" pin finally explains); the
red remove X (`-top-1 -right-1 w-7 h-7 bg-red-500 rounded-full` + `X
w-4 h-4 text-white`, photo-set ONLY, clears the form value AND the
input's `.value` so re-picking the same file re-fires onChange); the
camera button (`border-2 border-blue-500`, `disabled` while
uploading); the exact alert strings ("Please upload an image file (JPG
or PNG)" / "Failed to upload photo. Please try again."); the
"Uploading photo..." hint (text-xs text-gray-500); the Name field
INSIDE the section (placeholder "John Doe" + text-center
font-medium — the s15 "no placeholders" pin re-scoped to allow exactly
this one). TWO negative contracts: the W7 EDIT dialog has NO photo
field (a photo cannot change post-create on the reference — mirrored),
and the Pke slide-over hero is INITIAL-ONLY (no img branch — our s28
invention retired; the TABLE ROW and the mobile cards DO render
photos).

**The aCe profile-photo flow** (LIVE-verified): the hidden input is
`accept="image/*"` — NOT the contact dialog's explicit MIME trio — and
there is NO client type-validation alert on this surface (the
reference's own inconsistency); it TOASTS instead ("Photo uploaded
successfully" / "Failed to upload photo" — sonner toasts, not the
contact dialog's native alerts); the img renders on BOTH the form
avatar and the Account card; the save rides `updateMe({display_name,
profile_picture})` → toast → `setTimeout(window.location.reload, 500)`
— and the TOPBAR avatar (w-8 h-8, the gray-200 initial fallback) picks
up the photo after that reload. Schema: `User.photoUrl String?`
carried through the auth session user + the users GET/PATCH selects
(an explicit null clears, an absent key keeps the stored value).

**The dialog scroll-cap layer (the drift-re-sweep finding)**: the
reference's DialogContent family — `max-h-[90vh] overflow-y-auto` on
the contact CREATE, the W7/Mke EDIT family, Log Activity, Event, and
Save Custom Report (`DIALOG_CONTENT.wide` carries the pair now); the
Account CREATE is the BARE `max-w-2xl` (ours was max-w-lg — a real
width fix) and the Lead CREATE is the bare `max-w-lg` — both cap-FREE,
the reference's own inconsistency, mirrored. Our tallest dialog (the
contact create, with the avatar section + the h3 pair groups) NEEDS
the cap: without it the footer submit sits below the fold and
Playwright's click hangs on "element is outside of the viewport" —
scrollIntoViewIfNeeded alone does NOT help when the container has no
scroll box at all.

Census-method hazards this session (the §16v lessons):
- **The authed reference bundle lives at `/assets/index-*.js`** — the
  login page's `/static/` chunks are the shell (94KB entry, vendors);
  find the real 1.63MB app bundle via `[...document.querySelectorAll('script[src]')]`
  on an AUTHED page, or curl the `/assets/` URL directly (the
  `/static/` path 404s for it).
- **A 1.6MB single-line minified file inside eslint's scan scope OOMs
  the sandbox** (SIGKILL, no diagnostics) — cache census instruments
  OUTSIDE the repo tree (the sandbox scripts/ dir), never in the
  repo's own scripts/.
- **`[role=dialog]` matches the mobile-nav DRAWER WRAPPER too** (it is
  always in the DOM, `invisible pointer-events-none` when closed) —
  disambiguate by finding the dialog whose h2 matches the expected
title,
  or the probe reads the drawer's classes and reports garbage.
- **The reference's own `placeholder` census can MISS fields** — the
  s15 "zero placeholders across all five dialog dumps" pin was wrong
  for the contact Name field ("John Doe", bundle + live-verified);
  re-scope pins when deeper instruments (the bundle) contradict an
  earlier DOM dump, and record WHY.
- **agent-browser eval returns JSON-QUOTED strings** ("IMG" with
  quotes) — bash `[ "$STATE" = "IMG" ]` comparisons silently fail;
  strip the quotes (or compare against '"IMG"') before gating a
  screenshot capture on the probe result.

## 16w. Session-31 Layer (the Opportunity-split contracts)

The LAST s51 pointer CLOSED. The bundle ships a full **Opportunity
entity** the clone had never modeled: name / account_name STRING / stage
(six: prospecting/qualification/proposal/negotiation/closed_won/
closed_lost) / amount / probability (0-100) / close_date / source /
owner STRING. It has NO create-edit UI anywhere (the leads "Convert to
Opportunity" item is dead — no onClick; no New Opportunity dialog
exists) — read-only data feeding the dashboard, ALL FIVE reports tabs,
and both insights surfaces. Until this session every one of those
derivations was approximated from the Lead model.

**The dashboard (Eke)**: the pipeline chart = the 5 OPP stages with
VALUE sums (PIPELINE_STAGES redefined to the opp vocabulary; labels
Prospecting/Qualification/Proposal/Negotiation/Won); the revenue chart
rides the FIXED `["Nov","Dec","Jan","Feb","Mar","Apr","May"]` label
window (hardcoded in the bundle — it does NOT track the data months)
with `55e3 + random*1e4` targets, won grouped by updatedAt month; Top
Reps = won opps by the owner STRING `{name, deals, value}` value-desc
slice(0,3) — the row: the blue-100 INITIALS box + name + the static
"Top Admin" subtitle + `$Xk` + the Won/Active badge; Recent Deals =
opps by updatedAt desc slice(0,5) — the row: the gray-200 icon box +
the name/account stack, `$ toLocaleString` values, the P-map badge
with the RAW slug (Won for closed_won), the blue-100 owner box + the
owner STRING, and the SECOND Status badge's Contacted/Proposal
COPY-PASTE QUIRK (outline, text-xs). KPIs: dealsClosedValue +
revenueThisMonth from WON OPPS, **salesTarget HARDCODED 0 with
targetProgress 0** (the bundle's literal `V=0` — our derived
max(50000, …) model retired), conversionRate = won LEADS/leads
toFixed(1), avgSalesCycle = the average AGE of won leads (now−created,
per-lead floored — NOT created→closed).

**The reports filter model (i3e/lCe)**: OPPS by period(created_date) +
stage + source + owner + status (open=neither-closed / won / lost);
LEADS by period + source ONLY; activities by [start, NOW] (future-dated
excluded from finite periods — the `ld(date, {start, end})` window).
The owner dropdown lists the DISTINCT opp owner strings (NOT the user
directory). The stage select offers all SIX stages (Closed Won / Closed
Lost labels); the status select Open/Won/Lost.

**The reports KPI row**: openLeads = leads with status new+contacted
ONLY (NOT qualified); won/lost count+value from OPPS; conversionRate =
opps won/(won+lost) toFixed(1). **The 8-slug Conversion Funnel is the
CONCATENATION** — the leads' new/contacted/qualified counts + the opp
five-stage counts (`pipelineStageCounts`); the s10 "merged-list
double-report" reading (new≡prospecting, qualified≡qualification) was
a zero-data inference and is RETIRED. **The month series** group by
close_date under "MMM yyyy" keys in INSERTION order (rows list
-created_date → months appear newest-first — the reference's unsorted
Object.entries quirk, mirrored). **Forecasting Accuracy** = the
ACTUAL/FORECASTED formula: forecasted = Σ amount × (probability||50)/
100 per close month, actual = Σ won amounts, accuracy = actual/
forecasted × 100 toFixed(1) UNCLAMPED (>100% renders — live-verified
109.5%), average = the mean of the parsed per-month values (toFixed(1)
chain — "0.0" for one zero month, bare 0 only at zero points).
**Forecast by Probability** bands the OPEN opps by their OWN
probability (the s10 stage-weight proxy retired; the 76-100 band can
carry data). **Aging** = created_date age into the fixed 4 buckets.
**Deals at Risk** = the LAST Opportunity-linked activity >14 days old
or NEVER (the 999 sentinel — every unlinked open opp is at risk),
slice(0,20), bg-red-50 rows. **The tables**: recentWonDeals 10 /
topDeals 10 (amount-desc) / openDealsByStage 10 (LIST order, not
value-sorted) / atRisk 20 — the Amount cells `$ toLocaleString` (NOT
compact currency), the stage cells OUTLINE badges with the RAW slugs.
**The sources tab**: leads counted from LEADS; won/lost/revenue/
winRate/avgValue from OPPS (the summary's revenue cell
`$${(v/1e3).toFixed(0)}K`). **The account-health lost rule** joins
closed_lost OPPS by account NAME (not lost leads by id) — the at-risk
table is PERIOD-DEPENDENT (the reference's r3e receives the filtered
opps; under the quarter default the old-seeded opps correctly vanish).

**The insights surfaces**: the Ece dialog's opps join by account_name;
Total Revenue `$X.XM` (won-opp sum); the Open Deals COUNT quirk
`stage !== "closed_lost"` ONLY — WON DEALS COUNT toward it; the Open
Deals TAB = neither closed. The Pke slide-over's Deals tab = opps where
account_name === contact.company.

**The data layer**: the Prisma model carries accountName/owner as NAME
STRINGS (the reference's model — no relations); the seed plants 12
opps (4 won = **$337.0K** — the e2e's date-independent All-Time pin —
2 lost, 6 open across the four open stages) + 3 Opportunity-linked
activities (relatedType "Opportunity" + the freeform relatedName — one
fresh, two stale — so the at-risk join has live rows on both sides);
`GET /api/opportunities` is LIST-ONLY (the read-only mirror — no
create/edit anywhere); the reset route wipes them; the store's
`opportunities` slice rides hydrate; the export route's type=report
maps the filtered OPPS (Deal Name/Account/Amount/Stage/Source/Owner/
Close Date). KNOWN COSMETIC DIVERGENCE: our REPORT_PERIODS ids are
today/week/month/quarter/ytd/all where the bundle's state uses
thisWeek/thisMonth — same labels, same behavior, only the wire ids
differ (documented; the s25 saved-reports schema keeps ours).

Census-method hazards this session (the §16w lessons):
- **`agent-browser set viewport` takes POSITIONAL args** — `--width`/
  `--height` flags print the usage line and silently leave the viewport
  at its previous width, which false-positived "8 visible nav links"
  until a verified-390px computed-style probe re-ran (the standing
  mobile-nav layer HOLDS — 27th session).
- **A source-pin test's anchor must name the LIVING variable** — the
  s27 account-health pins anchored `const lostAccountIds`, which the
  s31 rename (`lostOppAccounts`) silently emptied (indexOf → −1 → the
  slice windows read garbage-but-empty strings); anchor renames travel
  with their tests.
- **The MultiEdit partial-failure hazard** — a failed edit in a batch
  can leave the EARLIER edits applied; verify file state after any
  reported failure before re-running the whole batch.
- **The reference's period filter bounds BOTH ends** — `ld(date,
  {start, end})` excludes FUTURE-dated activities from finite periods
  (our `>= from` alone counted the seeded future-due activities);
  mirror the window, not just its start.

## 16x. Session-32 Layer (the currency-format + period-wire-id contracts)

Two decode families, one doctrine: **the reference renders every
currency figure through a LITERAL scale formula — never a
magnitude-branching formatter** — and its period select carries WIRE ids
that a zero-data inference had misread.

**The dashboard's currency KPI cards (Eke)**: all three are literal
`/1e3` formulas — Deals Closed + Revenue This Month
`$${(v/1e3).toFixed(1)}k`, Sales Target `$${(v/1e3).toFixed(0)}k`
(zero decimals). At ANY magnitude: "$0.0k" at zero, "$337.0k" at 337k,
"$1400.0k" at 1.4M — the M form NEVER appears on the dashboard, and a
bare "$0" NEVER appears. The "$0k" Sales Target is visible on every
load (both apps render the hardcoded-0 quirk). Ours expresses these
through `formatCompactCurrency(v, { scale: "k" })` /
`{ scale: "k", decimals: 0 }` — the seam's fixed-scale option; the
no-scale default keeps the legacy magnitude branching (the topbar
search hint rides it).

**The accounts' revenue family**: always `$${(v/1e6).toFixed(1)}M` —
the Total Revenue KPI card + every table revenue cell ("-" at falsy):
"$0.0M" at zero, "$0.9M" at Brightline's seeded 900k, "$77.5M" at the
seeded total. Ours: the KPI + the S8-3 Cards-view cell carry
`{ scale: "M" }`; the table cell keeps its literal.

**The REPORT_PERIODS wire ids**: `today/thisWeek/thisMonth/quarter/
ytd/all` — the s25 ids (today/week/month/quarter/ytd/all) had
week/month INFERED from the pattern (only today/quarter/ytd were
live-verified via saved-report probes); the bundle's i3e reports filter
(`dateRange==="thisWeek"?A=Zu(O):e.dateRange==="thisMonth"?...`)
proves the real ids. Same labels, same behavior — only the wire ids
differed. The ids flow: the reports page state → `fetchReports` →
`?period=` → both API routes' periodStart + the export URL + the
SavedReport dateRange. `normalizeSavedPeriod()` (src/lib/
saved-reports.ts) migrates stale localStorage entries (week→thisWeek,
month→thisMonth, unknown→quarter) at the page's onLoad so a Load never
400s.

**The dead-control decode** (verified live, documented supersets): the
reference's topbar "Search Anything..." input has NO value/onChange —
purely decorative; our functional global search is the documented
non-mirror. The reference's accounts View (Table/Cards) + Format
(Standard/Detailed) selects are PINNED to literal values ("table" /
"standard" — no state consumer; clicking "Cards" leaves the trigger at
"Table"); our S8-3 functional switcher is the documented superset.

**Verified at parity (no action)**: the leads KPI subvalues
(`$${v.toLocaleString()}` — formatCurrency), the pipeline chips +
Top Reps + Recent Deals literal formulas (s31), the contacts/
activities KPIs (counts, no currency), the Ece insights' `$X.XM`,
the reports KPI row's uppercase-K variants (s5).

Census-method hazards this session (the §16x lessons):
- **A comment anchor dies under stripComments** — the account-surfaces
  Cards-view pin first anchored on the "S8-3 functional superset"
  COMMENT, which the test helper strips; anchor source-pin tests on
  CODE (the `view === "Cards"` conditional), never on comments.
- **(950/1000).toFixed(1) is "0.9", not "1.0"** — the float 0.95 is
  0.9499... under the hood; when pinning a literal formula's outputs,
  compute the expectation the same way the formula does (or the test
  asserts a rounding the production code never performs).
- **A wire-id rename needs a storage shim** — every persisted id
  (localStorage saved views) keeps flowing after the rename only if the
  load path normalizes; the API boundary should still reject the legacy
  id (400) so the contract stays crisp.

## 16y. Session-33 Layer (the dead-control decode closure)

The 29th-session bundle re-read (md5-identical — zero redeploy) paired
with fresh DOM probes surfaced TWO dead controls the earlier dead-list
had missed, both on the reference's dashboard. The remediation is a
documentation closure: pin the decodes in the layout contracts and the
test layer so they can never silently regress.

**The dead "Stage: Source" search input.** The reference's dashboard
filter-bar search renders as
`c.jsx(Ct,{placeholder:"Stage: Source",className:"pl-9 h-9"})` — NO
value, NO onChange: the same dead-input family as the s32 topbar
"Search Anything..." decode. Typing in it does nothing on the
reference. OURS is functional (it filters the Recent Deals rows) — the
documented superset. The placeholder now rides the contract as
`FILTER_BAR.searchPlaceholder` (src/lib/page-layout.ts) with the decode
note, consumed by page.tsx as
`placeholder={FILTER_BAR.searchPlaceholder}` — pinned by
page-layout.test.ts (the constant) + dashboard-contracts.test.ts (the
render + the functional value/onChange wiring + the no-hardcoded-literal
guard).

**The dead header trio.** The reference's dashboard page header ships
THREE adjacent buttons — Add (outline, label hidden below sm), Export
(outline, label hidden below sm), Export (the blue
`bg-blue-600 hover:bg-blue-700` primary with the bare always-visible
label) — and ALL THREE are dead there (no onClick in the bundle; the
§16c-era dead-list covered only the Exports + the login Sign up link —
the Add button completes the set). Live-confirmed at desktop 1280: the
three buttons render side-by-side under the "Dashboard" h1. OURS keeps
the exact visual with the documented functional superset jobs (the Add
quick-create menu, the outline-Export export menu, the blue Export
one-click leads export). The trio's labels/classes now ride the extended
`DASHBOARD_HEADER` contract — `addLabel`/`addLabelClass`/
`outlineExportLabel`/`outlineExportLabelClass` plus the s8-era
`primaryExportLabel`/`primaryExportLabelClass` — consumed by page.tsx,
pinned by both test suites.

**Verified at parity (no action):** the reference's dashboard Stage
select (`value=i,onValueChange=a` — all/prospecting/qualification/
proposal/negotiation/closed_won) and Source select
(`value=s,onValueChange=o` — all/call/email/website/partner) ARE
functional, matching ours; the "More..." button + the middle
empty-trigger Format select stay dead (the s24/S8-2 pins); the zero-data
KPI currency formats ("$0.0k"/"$0k") live-confirm the s32 doctrine
again; the login page + the Calendar page (KPIs, October-2026 grid,
agenda, the Filters/Clear All/Type/Date vocabulary) compared at parity;
zero 390px overflow on all nine routes BOTH apps.

Census-method hazards this session (the §16y lessons):
- **`element.onclick` never shows React handlers** — React attaches
  synthetic listeners at the root; a "no onclick" probe of a LIVE page
  proves nothing. Decode deadness from the BUNDLE (the JSX props are
  ground truth) or click + observe a DOM delta.
- **`offsetWidth > 0` is NOT visibility** — a `visibility:hidden`
  element keeps its layout box (the drawer's closed state probed as
  "visible" until the computed-style walk found the hidden wrapper);
  gate visibility probes on getComputedStyle, not box metrics.
- **Viewport screenshots cut off below the fold** — a full-page
  interaction shot (the filtered Recent Deals table) needs the target
  scrolled INTO view or a taller viewport; the first capture verified
  nothing.

## 16z. Session-34 Layer (the standalone-launch database-path recovery)

The production start was broken: `bun run start` from the repo root
served pages but every database-touching route failed — login 500,
`/api/health` `db:"down"`, the Prisma log `Error code 14: Unable to open
the database file`. Root cause: TWO directory rules disagreeing —

1. At LAUNCH, bun loads `<repo>/.env` and absolutizes the relative
   `file:../db/custom.db` against the LAUNCH cwd →
   `file:<parent-of-repo>/db/custom.db` (a directory that does not even
   exist).
2. The standalone `server.js` runs `process.chdir(__dirname)` (line 6)
   into `<repo>/.next/standalone` BEFORE the Prisma client boots.
3. `runtimeDatabaseUrl()` then reads the .env at the CURRENT cwd (the
   traced `.next/standalone/.env` copy) and computes the bun signature
   against `.next/standalone` → `file:<repo>/.next/db/custom.db`.
4. Mismatch → the env value looks like an "intentional override" → the
   absolute parent-of-repo URL passes through → SQLITE_CANTOPEN.

The fix (src/lib/db-path.ts): when the cwd-side signature misses and the
standalone anchor validates a repo root different from the cwd,
`runtimeDatabaseUrl()` ALSO tests the signature of the .env at that
LAUNCH directory; on a match it re-anchors through `urlForRoot()`
(the schema rule, anchored exactly where bun loaded it). The pinned
public API is unchanged; the dev context is byte-identical when the cwd
is outside `.next`.

Verified at all three levels: the seam unit proof, the live production
server (health `db:"up"`, login 200 with a session, the seeded dashboard
at the s32 KPI scales), and the unchanged e2e suite (the playwright
`DATABASE_URL` override still re-anchors through the standalone cwd
anchor — 106/106).

Census-method hazards this session (the §16z lessons):
- **The reaper kills background processes between tool calls** — servers
  launched with `&`/`nohup`/`setsid` from a tool call vanish when the
  call ends; run launch → verify → capture → kill inside ONE call.
- **A standalone server can outlive its launcher by accident** — an
  orphaned `next-server` on :3000 makes playwright's
  `reuseExistingServer` bind to a server whose DATABASE_URL is NOT the
  one the config asked for; `pkill` before every launch.
- **`ps -o rss` on the wrapper PID reads the bash pipeline, not the
  server** — target the actual `bun .next/standalone/server.js` process
  when sampling memory.
- **An OOM-killed neighbor looks like a code crash** — check `dmesg` for
  `oom-kill` before debugging "my server died" (the 08:07 casualty was
  an orphan at 2.3GB RSS, not a leak in the request path).

## 16aa. Session-35 Layer (the uploads-GET-route recovery + the API robustness layer)

**The finding — a documented, test-pinned file that was never in git.** The
fresh-clone baseline gate ran RED for the first time since session-4
(799/802): `tests/upload-api.test.ts`'s "the uploads GET route serves the
bytes" block failed because `src/app/api/uploads/[name]/route.ts` did not
exist — not in HEAD, not anywhere in history (`git log --all` for the path
is empty). The session-30 commit `dcf942b` documents the route in its
message and the test file pins it, but the commit's file list never
included it.

**Root cause (proven with `git check-ignore -v`): the unanchored gitignore
pattern `uploads/`.** A gitignore segment with no leading or interior slash
matches a directory of that name at ANY depth — so `uploads/` ignored
`src/app/api/uploads/` exactly as much as the runtime `<repo>/uploads/`.
The route was authored in the session-30 sandbox, but git silently never
tracked it; the long-lived sandbox carried it as an untracked leftover
(`git pull` does not delete untracked files), keeping every session-31..34
gate green THERE while the repository itself shipped broken. The
four-session masking chain, end to end: (1) git never tracked the file;
(2) the sandbox never deleted it; (3) the e2e specs asserted only the
`src` ATTRIBUTE (a broken `<img>` still carries its src) — never the
load; (4) the docs claimed the route existed because the session-30 LIVE
verification HAD exercised it (against the untracked file).

**The fix (S35-P1..P2):** the gitignore pattern is now the ANCHORED
`/uploads/` (root-only; the runtime folder stays ignored), the route is
restored per the session-30 contract (public — the reference's file_urls
are CDN links; the `UPLOAD_NAME_RE` 32-hex charset leaves no traversal
surface and anything else is a 404 BEFORE any filesystem lookup;
`CONTENT_TYPES[ext]` for the header; `Cache-Control: public,
max-age=31536000, immutable` because names are content-random and never
rewritten), `db/.gitkeep` makes the db/-at-root contract exist on fresh
clones, the gitignore pin is RE-ANCHORED with a negative guard
(`/^\/uploads\/$/m` must match AND `/^uploads\/$/m` must NOT — the old
pin encoded the defect), and the profile-photo e2e now `page.request.get`s
the topbar avatar's src demanding 200 + `image/*` bytes.

**The robustness layer (S35-P3..P5):** the db-path launch-dir branch
(session-34) gained the `isRelativeFileUrl(launchEnvUrl)` guard —
`bunAbsolutized()` passes an absolute ref through `path.resolve`
unchanged, so an ABSOLUTE production `.env` value (the DEPLOYMENT.md §4
form) would have MATCHED the signature and re-anchored into a corrupted
`<repo>/prisma/var/lib/…` path with junk mkdirs; absolute URLs are
intentional overrides by the seam's own header contract. The mobile-nav
close-on-route-change adjust-during-render moved from `MobileNav` into
`AppShell` — the state lives in AppShell, and adjusting a parent's state
from a child's render body trips React's "Cannot update a component
while rendering a different component" warning on back/forward
navigations; own-state adjustment is the sanctioned pattern. The PUT
`[id]` routes gained the FK existence guards the POST side already had
(contacts/leads: accountId + ownerId; accounts: ownerId; events:
accountId + contactId — the "Selected company/owner/contact does not
exist" vocabulary) plus the activities/events POST `accountId` checks,
all wrapped in try/catch → `ERR.INTERNAL()` so Prisma failures (P2003,
SQLITE_BUSY) stay inside the `{ ok, error }` envelope. The store
hygiene: `resetData()` refetches `fetchOpportunities()` (the reset route
wipes opps; the reports owner dropdown stays stale without it) and
`logout()` clears `settings` (no cross-session picklist leakage). Pinned
by `tests/api-robustness.test.ts` (14 source-contract checks, RED 14/14
first) + 1 db-path check (RED 1/20 first).

**Standing layers (31st session, NO DRIFT):** the reference bundle
md5-IDENTICAL for the SIXTH consecutive session
(`a70a637fcf1d4291da8e0d965676dc11`, 1,631,071 bytes); the reference's
mobile-nav absence at a TRUE 390px (8 links in the DOM, 0 visible, nav
box w=0, no hamburger); our drawer spot-verified live both directions +
the back/forward close after the ownership move; zero 390px overflow on
all nine routes; the reference demo data still zero (31st — the s32
currency doctrine re-confirmed); the Tailwind v4 stack healthy; the
production start verified on the FRESH clone (health db:"up", login
200, the seeded dashboard — the s34 fix holds outside its birth
sandbox).

Census-method hazards this session (the §16aa lessons):
- **An unanchored gitignore segment is a repo-wide name ban** — `uploads/`
  ignored `src/app/api/uploads/` as surely as the runtime folder; anchor
  runtime-artifact ignores to the root (`/uploads/`) and prove negative
  space with `git check-ignore -v <source-path>` after any ignore edit.
- **A long-lived sandbox can mask repository rot** — untracked files
  survive every `git pull`; the ONLY proof a repo is whole is a FRESH
  CLONE gate. Run one before trusting any "green" claim.
- **An e2e `src`-attribute assertion does not prove an image loads** — a
  404 `<img>` still carries its src; demand the bytes
  (`page.request.get(src)` → 200 + the content-type) for any
  URL-carrying assertion.
- **A unit-suite slice anchor can swallow the wrong block** —
  `src.indexOf("resetData:")` matched the TYPE declaration and made the
  slice include hydrate()'s fetchOpportunities (a tautology); anchor
  slices on implementation signatures ("resetData: async").

## 16ab. Session-36 Layer (the envelope completion + the input-hardening family)

The session-35 re-audit (fresh eyes on `1468867`) found the robustness
layer's claim broader than its implementation: the headline fixes were
genuine, but the five DELETE handlers, the three POST creates
(contacts/leads/accounts), the `users` PATCH update, the `settings` PUT
upsert and the `activities/[id]` update all still let Prisma failures
escape as raw non-envelope 500s — and `/api/reset` ran its seven
`deleteMany` calls sequentially OUTSIDE a transaction (a mid-chain
failure left a partial wipe). The deferred-findings audit graduated one
LOW to HIGH: the events PUT dropped the end≥start invariant its own POST
enforces (`"End time must be after start time"`) — a real user-hitable
inconsistency via the calendar chip → EventDialog's free
`datetime-local` fields. All fixed RED-first (17 + 2 failing checks
before the implementations):

- **The events PUT invariant (S36-P1)** — checked against the MERGED
  record: `effectiveStart = data.startAt ?? existing.startAt`,
  `effectiveEnd = data.endAt !== undefined ? data.endAt :
  existing.endAt` — an `{endAt: <early>}`-only patch can no longer slip
  past an unchanged later startAt (checking only the patch's own fields
  would miss exactly that case). LIVE-verified: end-only inversion →
  400 with the exact message; a consistent reorder → 200; a valid
  extension → 200 persisted.
- **The envelope completion (S36-P2)** — every mutating DB call in every
  handler wrapped: the five DELETEs, the three POST creates, users
  PATCH, settings PUT, activities `[id]` update; the activities/events
  POST `contactId` guards and the `[id]` routes' existence fetches
  moved INSIDE the try (structural symmetry — leads' whole handler body
  is one try because its stage parsing reads `existing.closedAt`);
  `/api/reset`'s seven `deleteMany` inside one `db.$transaction`.
  The pins are per-handler slices (`handlerBlock()` slices from
  `export async function <verb>` to the next export) — STRONGER than
  the session-35 file-wide regexes, which would keep passing if a write
  moved back out of the try.
- **The upload Content-Length pre-gate (S36-P3)** — declared
  `content-length > MAX_UPLOAD_BYTES + 64*1024` (multipart overhead
  allowance) rejected BEFORE `formData()` buffers the body, with the
  same `"File too large (max 5MB)"` vocabulary. LIVE-verified: a
  99,999,999-byte declared CL → 400 in 54ms (no buffering, no hang).
  Documented limitation: chunked uploads without Content-Length bypass
  the pre-gate; the post-parse ceiling remains the backstop.
- **The photoUrl prefix guard (S36-P4)** — users PATCH + contacts
  POST/PUT accept only `null`, `/api/uploads/…` (the documented writer)
  or `https://…` (the reference's CDN-shaped data); `data:` and
  `javascript:` payloads are killed. The 300/500 cap drift normalized
  as a side effect. LIVE-verified: `data:image/png;base64,…` → 400
  "Invalid photo URL"; `javascript:alert(1)` → 400; `null` → 200
  cleared; an https URL stores. The residual https-tracker surface is
  the documented accepted shape (the reference's own photos ARE
  arbitrary https URLs; the killed surface is the payload class).
- **The honest health 503 (S36-P5)** — the catch returns
  `fail("SERVICE_UNAVAILABLE", "Database unavailable", 503)` instead of
  an ok-200 with `db:"down"` (the session-34 incident is the existence
  proof). VERIFIED CAVEAT closed by measurement: Playwright 1.63's
  readiness probe accepts only 200–403 AND webServer setup precedes
  globalSetup — but on a fresh boot SQLite auto-creates `db/e2e.db`
  (the folder exists via `.gitkeep`) and `SELECT 1` succeeds on the
  empty file, so the probe still passes; proven by deleting
  `db/e2e.db` + `tests/e2e/.auth` and running the full e2e (106/106,
  fresh boot).

Standing layers (32nd session, NO DRIFT): the reference bundle
md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11` — SEVENTH consecutive
bundle-stable session; the login page's `/static/index-D96eRrlv.js` is
the documented unauth bundle, not the drift instrument); the reference's
mobile-nav absence at a TRUE 390px (8 links in DOM, 0 visible, nav w=0,
no hamburger — 32nd session); the reference demo data still zero
(`$0.0k`); our drawer live both directions (native-click open: 8 links +
dual scroll lock + focus on the close button — an `eval`-dispatched
`.click()` does NOT trigger React's handler path, the native CDP click
does: a recurring census-method hazard); zero 390px overflow on all
nine routes; the FK envelope 400 live; the gitignore negative space
holds (`git check-ignore src/app/api/uploads/x.ts` → not ignored).

Census-method hazards this session (the §16ab lessons):
- **`offsetParent !== null` is not on-screen** — a `-translate-x-full`
  slide-out sidebar keeps its links "visible" to offsetParent (CSS
  transforms don't affect it); assert geometry
  (`getBoundingClientRect().x >= 0 && width > 0`) for visibility claims.
- **`stripComments` eats `//` inside string literals** — a pin matching
  `https://` in a comment-stripped source never matches (the regex
  `\/\/[^\n]*` swallows the literal's tail); pin the bare scheme
  (`https:`) or another literal fragment that survives.
- **A file-wide try/catch regex pin proves presence, not containment** —
  slice per handler (`export async function <verb>` → next export) so a
  write that moves back out of the try fails its pin.
- **A readiness probe is a contract** — changing a health endpoint's
  failure status changes what your e2e boot accepts; measure the probe's
  accepted range and the boot-order (webServer setup vs globalSetup)
  BEFORE flipping a 200 to a 5xx, then prove it with a fresh-boot run.

## 16ac. Session-37 Layer (the containment proof + the FK-type hardening)

The session-36 re-audit (fresh eyes on `1601436`) verified P1–P5 genuine
but found the "every mutating DB call in every handler" claim one family
short: the **auth routes' four writes** (signup's `user.create`, verify's
attempt-increment + success-clear `user.update`s, resend's `user.update`)
were unwrapped — the plan deferred only the auth READ guards, so the
writes were neither fixed nor deferred; the **activities `[id]` PUT**
still ran its existence fetch outside the try (the only one of the five
`[id]` routes — an intra-file asymmetry with its own DELETE); and the
**settings GET's `readSettings()`** lazily creates the singleton row —
a mutating call reached from a GET, outside any try. The
deferred-findings audit graduated exactly one item: the **non-string FK
coercion** (`asString`'s optional semantics silently coerce
`{"accountId": 123}` to a null FK — a SILENT CLEAR on PUT), and closed
two ledger items as documented non-issues (the auth read guards — the
only GET under `/api/auth` is `me`, the public session probe by design;
and the middleware question — none exists, page auth is the
`(app)/layout.tsx` server redirect).

The fixes (S37-P1..P5, RED-first — 18 failing pins before the code):

1. **The auth-family envelope** — signup wraps findUnique + count +
   create; verify wraps its whole DB tail (the in-try 4xx returns
   bypass the catch by construction — the wrong-code ladder's
   400/429 verified live); resend wraps findUnique + update.
2. **The structural stragglers** — the activities `[id]` fetch moved
   inside the try (missing-id + malformed-body now answers 400 before
   404, matching the sibling `[id]` routes); the settings GET wraps
   `readSettings()`.
3. **The FK-type hardening** — `asFKId(v)` (null/`""`/whitespace →
   null, the explicit clear) + `isBadFK(v)` (a present non-string) in
   `src/lib/api.ts`, with guards at all **16 parse sites across 9
   route files**: `"Invalid company/owner/contact selection"` — the
   family vocabulary. UI-invisible (selects emit string ids or `""`),
   so the e2e 106 stays untouched.
4. **The containment pins** — `trySpans()`/`allInsideTry()` in
   `tests/api-robustness.test.ts`: every `db.<model>.<verb>` call in
   the handler block must fall inside a try→catch span. The s36 pins
   proved PRESENCE ((mutation) ∧ (try) ∧ (ERR.INTERNAL) independently)
   — a write could move back out of the try and every pin stayed green
   (which is exactly how the activities fetch gap escaped). The new
   pins fail on any such move.
5. **The hygiene** — the users PATCH photoUrl cap normalized 300 → 500
   (the s36 "normalized" claim, finally true — a 400-char `https://`
   URL now stores whole); two dead imports removed (`asDate` on
   accounts, `LEAD_SOURCES` on leads — `no-unused-vars: off` means the
   gate can't see this class).

### The census-method lessons (§16ac)

- **A bare `indexOf("catch")` is not a try's catch clause** — the
  promise `.catch(() => null)` chains these handlers carry
  (`req.json().catch`, the fire-and-forget `lastActivityAt` updates)
  truncate a span anchored on any "catch"; anchor the span END on
  `} catch` (the try-catch junction) instead.
- **Presence pins survive containment regressions** — asserting
  (mutation) ∧ (try) ∧ (handler) independently keeps passing while the
  mutation slides out of the try; assert the match INDEX falls inside
  a span.
- **A "normalized as a side effect" claim is a pin away from
  disproof** — the s36 commit claimed the photoUrl cap drift was
  normalized; one regex (`slice(0,\s*300)`) proved it wasn't. Claims
  that ride commit messages need their own pins.
- **The VLM hallucinates form fields** — asked to list the signup
  form's fields it invented a "Full Name" input (the code and the s21
  contract say Email/Password/Confirm only); the DOM is ground truth
  for structural claims, the VLM for styling verdicts.

### The deferred pointers (sharpened)

Reset role-gating (the no-RBAC doctrine + the seed-role/e2e
interaction), list-endpoint caps (the client requires full sets —
`take:` without pagination is silent truncation), trusted-proxy
limiter (+ the quantified margin: ~2 login POSTs per e2e run share the
`"unknown"` bucket vs the 10/15-min limit — a 6th consecutive run
within 15 min would 429 the auth setup), updateLead supersede guard
(the unconditional refetch IS the rollback), hydrate per-slice redesign
(the naive fix only SERIALIZES the duplicate fetch — it does not
dedupe — and stalls every hydrated-gated effect on the slowest of 9
fetches), SavedReport dead model, photoUrl onError fallback (six
conditional `<img>` sites; cosmetic), the 11 e2e `waitForTimeout`
sleeps (convert on first observed flake), the mobile-navigation
post-wipe ordering coupling (it runs after crm.spec.ts by file order —
safe today, asserts only nav structure), the `website`/`location`
href-sink watch item (no `href={…}` sink exists today).

## 16ad. Session-38 Layer (the silent bug, the parser graduation, the proof-coverage completion)

The re-audit verified all four session-37 claims genuine (a full
db-call census of all 27 route files; the FK helpers' edge semantics;
the containment helpers; the photoUrl cap + dead-import removals) but
found a **16-session-old silent bug inside a file s37 restructured**:
the signup `nameFromEmail` fallback was DEAD CODE — `asString`'s
NON-optional form returns `""` for an absent name, and `"" ??
fallback` keeps `""` (**an empty string is not nullish**), so every UI
signup (the s21 no-name-field contract — the client posts
`{email, password}` only) stored `name: ""` since session 21: the "?"
avatars, the blank owners dropdown, the nameless profile. The e2e never
asserted the derived name, so it survived 16 sessions of gates.

The fixes (S38-P1..P6, RED-first — 15 failing pins before the code):

1. **The name-fallback revival** — `optional: true` on the name parse
   so the absent path returns `undefined` and the `??` finally fires
   (LIVE: a probe signup now stores "Probe S38"; an explicit API name
   still wins).
2. **The photoUrl type-guard family** — the exact silent-coercion class
   the s37 FK guards closed, one field over: a numeric/object/boolean
   payload SILENTLY CLEARED the photo on the contacts PUT
   (LIVE-proven: `{"photoUrl": 999}` → 200 + `photoUrl: null`) and was
   silently IGNORED on the users PATCH. All three writers now guard
   `isBadFK(body.photoUrl)` → 400 "Invalid photo URL", with the trim
   harmonized (`" https://…"` stores trimmed on BOTH families).
3. **The import parser graduation** — the tested `parseCsv` seam
   (RFC-4180: BOM, CRLF, quoted commas, blank-row filtering — all
   unit-pinned since s26 but UNUSED: csv.ts's own comment claimed
   "used by the Import feature" falsely) replaces the naive
   `row.split(",")` + quote-strip replace that silently corrupted
   quoted cells (`"Last, First"` became name "Last" + a shifted email
   column), and the store's new `importContacts` batch does ONE slice
   refetch after the loop (the per-row `createContact` refetch was
   O(N²) network). LIVE: "Live, Quoted" imports whole through the real
   dialog. Zero parity surface (the import is already the documented
   divergence).
4. **The upload write envelope** — the mkdir/writeFile wrapped in
   try→`ERR.INTERNAL()` (ENOSPC/EACCES mid-upload stays in
   `{ ok, error }`; LIVE: a small upload still 200s).
5. **The sweep hygiene + the gate script** — all four rate-limited
   auth routes run `sweepRateLimits()` (it ran only from login); the
   `bun run gate` package script chains the documented order
   (lint → typecheck → test → build → test:e2e) — the build always
   precedes the e2e boot, closing the stale-:3100-server class.
6. **The proof-coverage completion** — the reset POST joined the
   containment pins (it had only the s36 presence-style pin — the
   `$transaction` could slide out of the try unseen); the settings-GET
   pin gained its `toMatch(readSettings)` presence check
   (`allInsideTry` returns TRUE when the regex matches nothing — the
   pin was vacuously satisfiable); the auth-family containment regex
   extended to the wrapped reads (`findUnique`/`count`); the health
   route's `db.$queryRaw` pinned explicitly (the `DB_CALL` regex
   misses Prisma `$`-APIs — the `$` needs per-route pins).

### The census-method lessons (§16ad)

- **`""` is not nullish** — the `??` fallback idiom silently dies when
  the left side's helper returns an empty string for "absent" (the
  non-optional `asString` contract); audit every `x ?? fallback` whose
  left side can return `""`.
- **A tested seam that nothing calls is a false comfort** — `parseCsv`
  had a round-trip test for YEARS while the feature used a naive
  parser; a source-contract pin (the page references `parseCsv`) is
  what proves the wiring.
- **`allInsideTry` is vacuously true on zero matches** — pair every
  containment pin with a presence `toMatch` (the settings-GET lesson:
  deleting the very call the pin protects kept it green).
- **The login sweep placement taught the pin lesson again** — the first
  RED run failed on LOGIN too because the pin demanded
  sweep-before-rateLimit (login sweeps AFTER); over-specified pins
  fail on correct code. Pin the contract, not an imagined ordering.

### The deferred pointers (sharpened)

The non-FK asString/asDate/asNumber coercion surface (dueAt/status/
value/endAt — silent mutation on PUT, dozens of sites; the deliberate
FK-first scope), the CSV formula-injection + embedded-quote family
(both apps emit injectable artifacts; the byte-exact reference format
is itself the pinned contract — lands with the deploy-posture
decision), the signup admin TOCTOU race, the dead exported api.ts
helpers (`asRequiredString`/`asOneOf`), hydrate network-failure vs
logged-out, silent fetch failures (doctrine-aligned watch), the
login/verify timing side-channel, the upload MIME trust (contained:
extension lock + nosniff + randomUUID), plus the standing ledger (reset
role-gating, list caps, trusted-proxy limiter, updateLead supersede,
hydrate redesign, SavedReport, photoUrl onError, the 11 e2e sleeps,
the mobile-nav post-wipe coupling, the href-sink watch, the base44 AI
extraction, the Opportunity UI).

## 16ae. Session-39 Layer (the error semantics, the gate integrity)

**Standing layers (35th session, NO DRIFT):** the reference bundle
md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`, 1,631,071 bytes —
TENTH consecutive stable session, fresh-fetched + compared); the
reference's mobile-nav absence at a TRUE 390px (8 links in DOM, 0
visible, nav w=0, no hamburger — 35th session); the reference demo data
still zero ($0.0k/$0.0k/$0k); our drawer live in every direction (the
portal nav at 288px with all 8 links + the full-screen dialog + the
body scroll-lock + focus on the close button; Escape:
`visibility:hidden` + `pointer-events:none` + unlocked +
`aria-expanded:"false"`; history.back() on an in-app route change:
closed — the s35 ownership fix holds); zero 390px overflow on all nine
routes (the off-canvas `-translate-x-full` drawer panels are the
documented fixed-position pattern, not overflow); the FK envelope 400
LIVE; the gitignore negative space holds.

**The audits (two parallel agents + manual validation of every
claim):** the session-38 re-audit verified all six fix families
GENUINE but found the gate script's own header claim FALSE in the
reuse scenario, plus a convergent import-error-semantics gap (both
agents found it independently) and the profile save() gap. The
deferred-graduation audit: ZERO graduations, ZERO closures — all 20
ledger descriptions accurate, every rationale sound at `f7aac8c` (the
non-FK coercion family quantified at ~15 PUT sites across 6 routes —
the top future-graduate; the photoUrl fix proved the mechanical
pattern, but the deferral was re-affirmed at s38 with the precedent in
hand).

**The fixes (S39-P1..P7, RED-first — exactly the predicted 11 failing
pins before the code, the P5 presence pairing GREEN-on-arrival):**

- **P1 the gate's fresh-boot guarantee** — `playwright.config.ts`'s
  `reuseExistingServer: !process.env.CI` reuses a leftover `:3100`
  standalone listener REGARDLESS of the preceding `bun run build` (a
  running process holds the OLD code in memory while the rebuild swaps
  static assets underneath — mixed-version serving). The gate's e2e
  step now runs under `CI=1`: fresh boot from the just-built tree +
  kill on exit. Plain `bun run test:e2e` keeps the reuse ergonomics
  for iteration (pinned: the chain expects `CI=1 bun run test:e2e` +
  the standalone script stays `playwright test`).
- **P2 the import's three-way banner** — `importContacts` returns
  `{ created, attempted }`; `runImport` maps `created > 0` → the
  success message (unchanged), `created === 0 && attempted > 0` → the
  reference's own "Failed to import contacts. Please try again." (the
  all-POSTs-failed case — expired session, network drop — previously
  got the WRONG "No valid contacts found…" banner), `attempted === 0`
  → the no-rows banner (unchanged). The refetch-once shape pin held
  throughout (the `created += 1; } await get().fetchContacts();`
  regex survived the return-type change by construction). LIVE via a
  fetch-rejecting `window.fetch` patch through the real dialog on the
  dev server (both arms) + the 108th e2e check (route.abort).
- **P3 the profile save() envelope** — the try/catch/finally its
  sibling uploadPhoto always had: the catch toasts the existing
  "Failed to update profile" vocabulary, the finally un-busies the
  Save button on every path (LIVE: the fetch patch on PATCH
  /api/users → toast + button re-enabled, no stranded busy state).
- **P4 the signup name family completion** — `isBadFK(body.name)` →
  400 "Invalid name" (the photoUrl guard's shape one field over:
  `{"name": 123}` used to ride the optional coercion to undefined and
  silently derive); the DERIVED name capped `.slice(0, 80)` at the
  explicit-name ceiling (LIVE: a 140-a local part derives exactly 80
  chars; `nameFromEmail` could previously return ~150). One s38 pin
  re-anchored (`const name = (asString…` — the parenthesization).
- **P5 the auth-reads presence pairing** — the vacuity closer:
  `allInsideTry` returns TRUE on zero matches, so the it.each now
  also demands `db.user.findUnique(` per route (+ `count` on signup).
- **P6 the lint warning enforcement** — `"lint": "eslint .
  --max-warnings 0"`: the documented "lint 0/0" standard is
  load-bearing (the suite is at 0 warnings, so the gate stays green).
- **P7 the hygiene** — the sweep placement on the three s38 auth
  routes moved BEFORE the `!limit.allowed` return (login's exact
  placement — denied requests sweep too; the code finally matches its
  own "mirrored" comment); the quoted-comma e2e cleanup deletes ALL
  matching emails + asserts `toHaveLength(0)` (Contact.email is not
  unique — a leftover probe from an aborted run poisoned the next
  run's final assertion).

**Gate:** lint 0/0 (enforced) · tsc 0 · **909/909 unit (49 suites,
+13)** · build clean · **108/108 e2e (+1)** on a fresh boot (CI=1).

### The census-method lessons (§16ae)

- **A claim about a chain is a claim about every link's environment**
  — "build precedes e2e" does not guarantee "the e2e runs the build":
  `reuseExistingServer` re-enters the chain's causality from outside
  it. Audit what the surrounding config does with each step's
  outputs, not just the step order.
- **A count is not a result** — `created === 0` meant two different
  failures; when a UI message distinguishes causes, the underlying
  count must carry enough information to make the distinction (the
  `{ created, attempted }` return).
- **An e2e that passes in isolation can be order-dependent** — the
  "E2E Import" row's action buttons substring-match a non-exact
  `getByRole("Import")` only when an earlier test's contact is in the
  table AND rendered before the click resolves; the global-setup
  re-seed hid it in every isolated run. Use `exact: true` for toolbar
  clicks; Radix modal dialogs aria-hide the background, so the
  dialog's own submit stays unambiguous.
- **A cleanup that assumes uniqueness poisons the NEXT run** —
  `find()` + delete-one leaves duplicates behind when the schema
  allows them; cleanups must be idempotent (filter + delete-ALL +
  assert empty).

### The deferred pointers (re-confirmed)

The non-FK asString/asDate/asNumber coercion surface (~15 PUT sites
across 6 routes — the top future-graduate, first in line for session
40 if the operator wants family symmetry), the CSV formula-injection +
embedded-quote family (the byte-exact format is the pinned contract —
lands with the deploy-posture decision), the Excel `.xlsx` accept (the
S26-P6 pinned file-input vocabulary — the reference parses a real
.xlsx through the same CSV text path; parity keeps it), the unbounded
import / no cancel mid-import (reference parity), the signup admin
TOCTOU race, the dead exported api.ts helpers, hydrate error vs
logged-out, silent fetch failures (doctrine-aligned), the login/verify
timing side-channel, the upload MIME trust (contained), reset
role-gating, list caps, trusted-proxy limiter, updateLead supersede,
hydrate redesign, SavedReport, photoUrl onError, the 11 e2e sleeps,
the mobile-nav post-wipe coupling, the href-sink watch, the base44 AI
extraction, the Opportunity UI, the standing drift re-sweep next live
visit.

## 16af. Session-40 Layer (the non-FK coercion family graduates)

**What shipped:** the graduation audit quantified the deferred non-FK
coercion family at **37 silent PUT members + 40 silent POST members**
(the ledger's "~15 PUT sites" UNDERCOUNTED — the 19 `?? null`
optional-string clears were never counted, and 7 of the named lines
already 400'd). Every silent member was the isBadFK class one
parse-shape over: a present non-string (or, for dates, an unparseable
string; for numbers, a boolean/array payload through `Number()`'s
truthy edges) rode the lenient parse helpers into a SILENT mutation.

**The three LIVE-proven exemplars (probe records, all cleaned):**

1. `PUT {"status": 123}` on a contact with status "inactive" →
   **200 + status silently reset to "active"** (contacts/[id]:94 had
   NO type guard and NO enum check — `CONTACT_STATUSES` was not even
   imported; `{"status": "banana"}` stored verbatim).
2. `PUT {"defaultCurrency": 123, "defaultTier": {"evil": 1}}` on
   settings → **200 + both stored `""`** — the quartet's
   `?? "AED"` / `?? "B"` fallbacks were DEAD CODE (non-optional
   `asString` returns `""`, and `""` is not nullish). The §16ad
   ""-is-not-nullish lesson had four unapplied instances.
3. `PUT {"endAt": {"$gt": "…"}}` on an event → **200 + endAt
   cleared to null — AND the s36 end≥start invariant bypassed** (a
   null effectiveEnd skips the merged-record check). The POST twin
   (`activities` dueAt) was worse: a bad type silently invented NOW.

**The fixes (S40-P1..P6, RED-first — exactly the predicted 57 failing
pins before the code):** P1 the three predicates in `src/lib/api.ts`
with BEHAVIOR tests on the real edge matrix
(`tests/coercion-guards.test.ts`, 11 checks — not source contracts):
- `isBadString(v)` — present non-string (isBadFK's general mirror);
  null/absent stay the explicit clear/absent.
- `isBadDate(v)` — stricter than isBadString: garbage STRINGS are bad
  too (`asDate("garbage")` → undefined → `?? null` silently cleared);
  `""` stays the explicit clear (the asFKId convention).
- `isBadNumber(v)` — kills `Number()`'s truthy/array edges
  (`true`→1, `[5]`→5, `[]`→0, `" "`→0 — a JSON array payload
  silently stored 5); finite numbers + numeric strings good; literal
  `""` stays absent (asNumber's own special case).
P2 the PUT-side sweep at 30 field sites across the five `[id]` routes
+ the contacts `status` type guard AND its `CONTACT_STATUSES`
membership. P3 the settings quartet's `optional: true` revival (the
fallbacks live again — `""`/null default instead of storing "") + the
five settings guards. P4 the POST-side inventing twins (7 sites). P5
login's `findUnique` + cookie-set tail joined the envelope (the last
unwrapped auth read; login joined the auth-reads containment
it.each). P6 hygiene: the dead `asRequiredString`/`asOneOf` exports
deleted (zero call sites), `exact: true` on the two earlier import
tests' toolbar clicks.

**The safety proof:** a UI-payload census BEFORE the rollout — every
real writer sends typed values (the dialogs send strings-or-
undefined/null, `Number()`/`parseFloat()` for numerics, ISO strings
for dates; the inline controls send strings/numbers; settings sends
strings + `Number()`; the e2e drives the UI only; the seed writes via
Prisma directly). No guard can break a real payload — the entire
surface is API-only, the same posture as the s37/s38/s39 families.

**The incident (the session's own census-method lesson):** the first
LIVE probe's cleanup used `d[0]` on `?search=Probe%20S40` — but the
contacts list endpoint does NOT filter server-side on `search` (the
filter is client-side), so `d[0]` was alphabetically-first **"Aisha
Bakr" — a SEEDED contact, deleted by the probe cleanup.** Restored
surgically to the seed loop's exact values (email fold rule, phone
pattern, source/priority/role/engagement/size maps, owners[14 % 4],
`d(-40)` lastActivityAt derived from Robert's `d(-43)` + 3×24h, the
seed loop's createdAt cadence) and verified 15/15 seeded contacts +
4 users + zero residue. **Lesson: a probe cleanup that indexes into a
list endpoint must filter by an EXACT unique key (id or email), never
`d[0]` on a soft search — and `?search=` semantics are a census
question, not an assumption.** (Also cleaned: the s36 "S36 Guard
Probe" leftover + a junk 79-a user from an earlier session.)

**Gate:** lint 0/0 (enforced) · tsc 0 · **966/966 unit (50 suites,
+57)** · build clean · 108/108 e2e on a fresh boot (CI=1). LIVE:
every guard family verified both directions on the dev server (the
400s with exact messages; null/absent still clear; valid values still
store; the settings round-trip restored; login works with the wrap).

**Deferred with rationale (re-confirmed):** the POST-side enum
defaults + string nulls (lenient-create, no data destroyed), the
strict-bool `isKey`/`allDay` idioms (deliberate `=== true`), the CSV
formula-injection + embedded-quote family (deploy-posture), the Excel
.xlsx accept (S26-P6 pinned vocabulary), the partial-import success
conflation (the reference is atomic; the vocabulary is pinned), the
11 e2e sleeps, the standing ledger.

## 16ag. Session-41 Layer (the POST-side lenient-create + export integrity)

**What shipped:** the graduation audit split the deferred lenient-create
item — the "no data destroyed" rationale was FALSE as stated (a present
non-string payload IS silently destroyed: `POST {"phone":123}` → 200 +
`phone:null`, the caller's data dropped without error; `POST
{"stage":123}` → 200 + "new" silently invented — both LIVE-proven with
probe records, cleaned by exact ID). Every one of the 19 string-null
sites had a PUT twin already guarded in s40 with the identical
predicate + message; the 12 enum-field type-gaps silently defaulted.

**The fixes (S41-P1..P5, RED-first — exactly 39 failing pins before the
code, the 40th prediction one off because the P2 byte-exactness pin is
GREEN-on-arrival by design — it IS the contract-preservation proof):**

- **P1 the 31 isBadString guards** across the five POST routes
  (contacts 9, leads 5, accounts 6, activities 6, events 5), each the
  PUT twin's exact predicate + message — ZERO new vocabulary. null/
  absent keep the default/null semantics (a create cannot "clear" a
  field that does not exist yet); `""` keeps the optional-parse
  default. The `source` enum-MEMBERSHIP question stays deferred:
  source is a settings-configurable vocabulary (`contactSources` is
  operator-editable) and the CSV import sends arbitrary source strings.
- **P2 the RFC-4180 `qq()` cell-quoter** in `src/lib/entity-export.ts`
  — the three builders' plain `"${v}"` wrap produced MALFORMED CSV for
  quote-bearing values (`Acme "Best" Inc` → `"Acme "Best" Inc"`, a
  column shift on re-parse that corrupted our own export→import
  round-trip; the reference's own defect). The fix doubles embedded
  quotes and is byte-identical for every quote-free cell — the pinned
  reference format (filenames, headers, the quote-free fixtures)
  untouched. The s26 "every value is double-quoted" source pin
  re-anchored on the qq() shape (an intentional contract update).
  Implementation lesson: the replace's second argument is TWO quotes,
  not three — caught on read-through before any run.
- **P3 the case-insensitive relatedType join** (`reports-data.ts`) —
  the Activity/Event dialogs send lowercase ("opportunity"), the seed
  stores capitalized ("Opportunity"), and the case-sensitive match
  meant a UI-logged "Related To: Opportunity" activity NEVER joined
  the Deals at Risk table. The reference joins on a real
  `related_to_id` FK (any casing joins there). LIVE-proven both
  directions: a lowercase probe activity pulled "Supply chain
  visibility" out of the at-risk list; the deal returned after the
  cleanup.
- **P4 the session-read envelope** — `requireSession()`'s
  `getSessionUser()` await + auth/me's direct read wrapped in try/catch
  → `ERR.INTERNAL()` (a SQLITE_BUSY-class failure during the session
  read answered a raw non-JSON 500 on EVERY protected route). The
  `(app)` layout keeps its direct call — a DB failure there throws to
  Next's error boundary (an honest 500 page); redirecting to /login
  would conflate DB-down with logged-out (the documented
  hydrate-error-vs-logged-out deferred item).
- **P5 hygiene** — the dead `sources` var (contacts-page:183, zero
  reads — the kke panel uses `sourcesF` + the static options) and the
  stale `DEFAULT_SETTINGS` export (constants.ts, zero consumers,
  still the pre-s28 EMOJI vocabulary) deleted; isBadNumber's
  NaN/Infinity edge matrix pinned (GREEN-on-arrival strengthening —
  `JSON.parse('{"v":1e999}')` overflows to Infinity, a present
  typeof-number payload).

**The safety proof:** the UI-payload census held — no e2e tripped a
guard (the 108/108 fresh-boot run). One LIVE probe's first rejection
was its own wrong vocabulary (`"51-200"` is not a COMPANY_SIZES member
— "Medium (51-500)" is; the s28 enum, not a guard regression).

**Gate:** lint 0/0 (enforced) · tsc 0 · **1008/1008 unit (50 suites,
+42)** · build clean · 108/108 e2e on a fresh boot (CI=1).

**The census-method lessons (§16ag):** a deferred rationale is a claim
about behavior — re-verify it against the live surface before
re-deferring ("no data destroyed" was false at the first probe); a
fix that widens a filter cannot reduce rows (the case-insensitive
join's regression proof); and the byte-exactness pin that stays GREEN
through the RED phase is the contract-preservation proof itself (the
prediction's arithmetic slip).

**Deferred with rationale (re-confirmed):** the GET list routes' reads
(the session-42 family-symmetry candidate — never claimed, caught by
`call()`), the 2 source enum-membership sites (settings-configurable
vocabulary), the CSV formula-injection half (deploy-posture — the
operator's (a) parity / (b) `=`+`@`+tab+CR / (c) full-OWASP decision;
the common legit dangerous-prefix data is phone numbers, which the
pinned template itself ships as `+1234567890`), the 11 e2e sleeps
(four back one-shot assertions — zero flakes in 41 sessions), the
partial-import conflation, the standing ledger (all 13 re-confirmed).

## 16ah. Session-42 Layer (the GET-list envelope + the silent-clear completion)

**What shipped:** the family-symmetry graduation — the s37/s41 envelope
families closed every MUTATING db call and the shared session read; the
eleven GET list routes were the last raw reads (a SQLITE_BUSY-class
failure during a list read answered a raw non-JSON 500 the store
degraded to "Request failed (500)" instead of the house message). Three
more silent-mutation classes closed beside it, each LIVE-proven with
probe records before the plan (all cleaned by exact ID): the strict-bool
silent-clear family (`{"isKey":"yes"}` on PUT silently DE-KEYED a key
account), the activities/[id] PUT's silently-ignored FK payload (an
activity's links could never be re-assigned or cleared), and the
contacts PUT `{"status":""}` silent reset to "active" (the only
optional-parse enum whose `??` default passed the membership check).

**The fixes (S42-P1..P6, RED-first — exactly 24 failing pins before the
code: 22 P1-P4 + 2 P6; the failure SET matched the code-change pin set
exactly; all 1008 pre-existing checks stayed green through RED):**

- **P1 the 11 per-route try/catch wraps** — NOT a HOC wrapper (the pin
  machinery slices `export async function ${verb}`; a wrapper would
  break every older family's slicing). The single-read routes wrap
  whole-body; the dashboard/reports/search `Promise.all` families ride
  a type-safe IIFE-wrap + null-guard (`const rows = await (async () =>
  { try { return await Promise.all([...]) } catch { return null } })();
  if (!rows) return ERR.INTERNAL();`) — every derivation below the
  reads is pure, so only the reads need the span, and the const
  destructuring keeps full typing.
- **P2 `isBadBool`** (src/lib/api.ts — the isBadString shape one type
  over: only a PRESENT non-boolean is bad) + the four guard sites:
  accounts isKey POST/PUT ("Invalid key account"), events allDay
  POST/PUT ("Invalid all-day flag"). The UI writers are real Radix
  checkbox booleans or absent (the event dialog has NO all-day
  control) — the surface is API-only, the census held (108/108 e2e).
- **P3 the activities/[id] PUT FK branches** — the contacts/[id] shape
  verbatim (isBadFK + asFKId at the parse site; "Selected contact /
  company does not exist" existence checks inside the try) + the
  FK_SITES census row the s37 sweep missed (the route had NO FK
  branches at all).
- **P4 the contacts status non-optional parse** — `asString(body.status,
  { max: 20 })` + `!status ||` membership: a present `""` is the
  sibling enums' 400, not a silent reset (status is a required enum —
  `""` is a bad value, not a clear).
- **P5 hygiene** — the dead `CONTACT_SOURCES` import
  (entity-dialogs.tsx), the dead `EDIT_SOURCE_OPTIONS` export
  (constants.ts), the settings `?? "monday"` dead fallback removed,
  and the two s41-P4 pins strengthened from presence to `allInsideTry`
  containment (the N-42d shape, GREEN-on-arrival).
- **P6 the bare-request period default** — LIVE-discovered during the
  post-fix warm-up probe itself: a GET `/api/reports` (or
  `/api/export?type=report`) WITHOUT an explicit period answered 400
  "Invalid period" because the `?? "quarter"` defaults were dead code
  (`asString(null)` returns `""`, never undefined, and `""` is not
  nullish). The optional parse makes the documented default reachable;
  the store always sends an explicit period, which is why no e2e ever
  tripped it.

**The census-method lessons (§16ah):** the warm-up probe is itself a
census instrument — run the happy-path battery before declaring victory
and READ the status codes (the 400s on the bare reports/export requests
were the P6 find, invisible to every static audit); a dead `??` on a
NON-optional asString parse can hide a REAL behavioral consequence (the
400-vs-default split), not just dead code; and when the fix shape must
satisfy a containment pin, an IIFE-wrap + null-guard keeps the const
destructuring's full typing where a `let` + reassignment would silently
degrade to `any` (the noImplicitAny:false trap).

**Gate:** lint 0/0 (enforced) · tsc 0 · **1032/1032 unit (50 suites,
+24)** · build clean · 108/108 e2e on a fresh boot (CI=1) — no e2e
tripped a guard, the census held.

**LIVE verification (the dev server, both directions):** the bare
reports/export requests 200 with the default-quarter data (was 400);
the strict-bool rejections 400 with the exact vocabulary
("Invalid key account", "Invalid all-day flag") while null still
false-defaults and true still stores; the activities PUT FK payload now
APPLIES (set → linked, "" → cleared, a stale id → "Selected contact
does not exist", a non-string → "Invalid contact selection"); the
contacts `{"status":""}` → 400 "Invalid status"; every GET happy path
200 with data; all probes cleaned BY EXACT ID (zero residue, 15/15
seeded contacts, 10 accounts, 24 leads).

**Deferred with rationale (re-confirmed):** the 2 source
enum-membership sites (the vocabulary fragmented across five
disagreeing surfaces — create dialog raw lowercase, edit dialog raw
lowercase, seed raw lowercase, import arbitrary/"email", settings
CAPITALIZED defaults; a membership-vs-settings check would 400 every
dialog-created contact — a vocabulary-reconciliation product decision
must come first), the CSV formula-injection half (the operator's
(a)/(b)/(c) decision — unchanged; option (b) would mangle the seed's
legit `+971…` phones), the 11 e2e sleeps (only ~4 back true one-shot
assertions; zero flakes in 42 sessions), the standing ledger (13
re-confirmed), the signup-page session read (the (app)-layout
honest-500 doctrine — documented, not fixed).

## 16ai. Session-43 Layer (Lead.contactId + the settings defaults quartet + the dead-?? sweep)

The session-42 re-audit (fresh eyes on `a8b83f5`) verified all six fix
families genuine with ZERO regressions, and the graduation audit
returned a CLEAN payload census — the s40/41/42 coercion families
closed the unguarded-payload space. The session-43 headline came from
the schema-vs-routes sweep: **`Lead.contactId` is a dead relation
end-to-end** — the Prisma schema (`Lead.contactId String?` + the
`contact Contact?` relation) AND the wire type
(`types/index.ts: contactId: string | null`) carry it, but NO leads
route accepted it: the POST create data had no `contactId` and the PUT
had no branch, so a caller's payload was silently DROPPED on both
verbs (LIVE-proven: `{"name":"…","contactId":<real id>}` → 200 +
`contactId: null`). The N-42b shape one level up — activities was the
same class (fixed s42-P3); leads was the LAST member.

**The fixes (S43-P1..P5, RED-first — exactly 20 failing pins before
the code):**

- **P1 the leads FK branch pair** — the s42-P3 activities shape
  verbatim: parse-side `isBadFK` + `asFKId`, try-side existence checks
  ("Selected contact does not exist" — the POST's own vocabulary), the
  create-data field, and the two FK_SITES census rows. The wire type
  has NO `contact` object, so NO include changes — the minimal fix.
- **P2 the NINE dead `?? "<enum>"` fallbacks removed** — leads/[id]
  stage `?? "new"`, activities/[id] priority/type/status
  `?? "normal"/"call"/"scheduled"`, events/[id] type/status
  `?? "meeting"/"scheduled"`, accounts/[id] status/tier
  `?? "active"/"B"`, contacts/[id] priority `?? "Standard"`. Behavior-
  identical: non-optional `asString` returns `""` (never undefined) so
  the fallbacks were dead, and `""` already 400s on the enums below.
  The `!x ||` narrow keeps tsc happy (the s42-P5 self-fix shape). The
  auth `?? ""` twins (login/resend/signup/verify) are runtime-dead but
  TYPE-load-bearing — `asString` types `string | undefined` and the
  `??` narrows for `.toLowerCase()` — NOT this class; they stay.
- **P3 the settings defaults quartet** — `defaultLeadStage` vs
  LEAD_STAGES, `defaultTier` vs ACCOUNT_TIERS, `calendarView` vs
  month/week/agenda (the settings UI's own Select vocabulary), plus
  the `firstDayOfWeek` isBadString guard its sibling quintet has. A
  poisoned default used to save VERBATIM (LIVE-proven:
  `{"defaultLeadStage":"banana-probe"}` → 200 + saved) and flow into
  the create dialogs' initial values — every subsequent create 400'd
  confusingly. The optional parse keeps the s40-P3 revival (""/null →
  the default, not a 400).
- **P4 the topbar global search's debounced fetch** — the ONLY
  unwrapped fetch in src joined the try/catch family (the s39
  profile-save class): a network failure rejected the setTimeout
  callback → unhandled rejection + silently stale results; the catch
  resets `setResults(null)` + `setOpen(false)`.
- **P5 the events GET `from`/`to` window params reject garbage** —
  `asDate("garbage")` → undefined used to DROP the window filter (the
  caller asked for a window, got everything); now a present-but-
  unparseable param is 400 "Invalid from/to date" (the period param's
  own precedent). `isBadDate` semantics for URL params: absent (null)
  passes, empty `""` passes (≡ absent), garbage rejects.

**The census-method lessons (§16ai):** a schema-vs-routes census is a
first-class audit instrument — walk every Prisma relation against the
routes that could accept it (the dead `Lead.contactId` was invisible to
every payload-field census because the field never appeared in ANY
route's parse code); `visibility: hidden` PRESERVES the layout box, so
`offsetWidth > 0` is NOT a visibility proof — the mobile-nav census
must check `getClientRects().length > 0 && computed visibility !==
'hidden'` (this session's drawer probe was briefly fooled by clicking
the overlay's Close button, whose aria-label also matches /menu/i);
and a `?? ""` on a non-optional asString can be TYPE-load-bearing even
when runtime-dead — audit the downstream type usage before deleting
(the auth emails' `.toLowerCase()` would not compile without it).

**Gate:** lint 0/0 (enforced) · tsc 0 · **1050/1050 unit (51 suites,
+18 tests / +20 RED pins)** · build clean · 108/108 e2e on a fresh
boot (CI=1) — no e2e tripped a guard, the census held.

**LIVE verification (the dev server, both directions):** the leads
contactId payload now APPLIES (POST set → linked [was silently null],
PUT re-assign → moved, `""` → cleared, a stale id → "Selected contact
does not exist", a non-string → "Invalid contact selection", on BOTH
verbs); the settings quartet rejects the exact garbage
("Default lead stage must be a valid stage", "Default account tier
must be A, B or C", "Calendar view must be month, week or agenda",
"Invalid first day of week") while valid values still save and ""/null
still default; the nine dead-?? sites still 400 on present `""` with
the exact enum vocabulary while valid + legacy values ("hot" → "Key")
still store; the events `?from=banana` → 400 "Invalid from date" while
ISO windows 200; the topbar search survives an aborted /api/search
route (no unhandled rejection, the dropdown closed) and recovers on
retype. All probes cleaned BY EXACT ID (zero residue; 15/15 seeded
contacts, 10 accounts, 24 leads, 23 activities, 12 events).

**Deferred with rationale (re-confirmed):** the reports/export filter
membership asymmetry (owner is an arbitrary NAME STRING — membership
impossible; source is the fragmented vocabulary; garbage filters yield
EMPTY reports — GET-only, no corruption), the 2 source
enum-membership sites (the vocabulary-reconciliation product
decision), the CSV formula-injection decision for the operator, the 11
e2e sleeps, the standing ledger, the signup-page session read.

## 16aj. Session-44 Layer (Account.health + the contacts POST status + the 21-site UI clear-parity sweep)

The session-44 completion layer — the last dead schema field, the
last POST-side status drop, and the UI clear family the reference
proves is a parity break. All RED-first (exactly 27 failing pins
before the code; all 1050 pre-existing checks stayed green through
RED).

**S44-P1 — `Account.health` accepted on both verbs.** The N-43a
census instrument (§16ai) applied one model over: `health` was
carried by the Prisma schema (`@default("Healthy")`), the wire type,
the seed ("Healthy"/"At Risk"/"Needs Attention") and TWO UI readers
(the accounts-page badge + the CSV Health column), but neither
accounts verb accepted it — LIVE-proven: POST `{"health":"At Risk"}`
→ 200 + `"Healthy"`; PUT `{"health":"Needs Attention"}` → 200 +
`"Healthy"`. The stored badge was frozen at its seed value forever
(it could never change through ANY surface). The fix: the
`ACCOUNT_HEALTH_STATUSES` constant (the `ACCOUNT_STATUSES` pattern)
+ the POST create-default shape (absent/""/null keep "Healthy", the
priority convention) + the PUT `"health" in body` branch with the
s43-P2 `!health ||` narrow (present "" is the sibling enums' 400).

**S44-P2 — the contacts POST `status` drop closed.** The PUT has
accepted status since s42-P4; the POST silently dropped it (every
contact created "active" regardless of payload — LIVE-proven). The
N-42b PUT-accepts-POST-drops mirror, fixed with the PUT's own
vocabulary adapted to create-default semantics.

**S44-P3 — the 21-site UI clear-parity sweep (the headline).** The
API's explicit-clear convention (present ""/null → null) was
unreachable from the five dual-verb dialogs: every
`X: form.X || undefined` mapping DROPPED the key when the user
emptied the field (JSON.stringify drops undefined), so the PUT's
`"X" in body` branch skipped and the OLD value persisted while the
save toasted success. **Reference parity PROVEN live both
directions** (a probe event on the reference: clear description →
save → re-open shows ""; set Related To "Contact" → save →
"Contact"; set back to "None" → save → the placeholder — the
reference PERSISTS clears; our drop-key idiom was the parity
break). The 18 audited sites PLUS 3 date-ternary members found
during implementation (lead expectedCloseDate/nextFollowUp, event
endAt — the same `? X : undefined` class on user-clearable dates):
all now map empty → null (and the events' "none" → ""), the
EntityEditDialog pages' own `|| null` convention applied to the
layer that missed it. FK safety verified: every FK column is
`String?` and `asFKId(null)` → null (the documented explicit-clear
convention). LIVE-verified end-to-end through the real calendar
dialog: set description/location/Related-To → all stored; clear all
three + "None" → saved → all null, contactId intact.

**S44-P4/P5/P6 — the hygiene trio.** The reports saveReport
localStorage write joined the leads-page saveView guard convention
(a quota/private-mode exception now toasts "Could not save report"
+ "Browser storage is unavailable." instead of escaping the React
event handler uncaught); the topbar search resets on a non-ok
ENVELOPE too (a JSON 401/500 body used to silently no-op, leaving
stale results open — only network-level rejections hit the s43
catch); and the reports' dead account include removed (the leads
findMany fetched `account: {select: {name: true}}` only for
serializeLead to overwrite it with `account: null` — a wasted LEFT
JOIN on every reports read; the owner include stays).

**The census-method lessons (§16aj):** JSON.stringify dropping
`undefined` keys makes a UI payload mapping a silent no-op machine —
audit every dual-verb dialog against the API's explicit-clear
convention (`"X" in body` branch reachability), not just for the
fields it sets; a reference-parity claim for EDIT semantics needs a
live clear-persist round-trip (the set-direction alone proves
nothing — both apps set fine, only one cleared); and the
`? X : undefined` date ternary is the same drop-key class as
`|| undefined` (the constructor guard masks it — `new Date("")`
throws — but the cleared-date payload still needs `: null`).

**Gate:** lint 0/0 (enforced) · tsc 0 · **1080/1080 unit (53 suites,
+30 tests / +27 RED pins + 3 date-site pins)** · build clean ·
108/108 e2e on a fresh boot (CI=1) — no e2e tripped a guard.

**LIVE verification (the dev server, both directions):** accounts
health — POST `{"health":"At Risk"}` → 200 + "At Risk" (was
silently "Healthy"), POST absent → "Healthy", PUT re-assign →
stored, garbage/non-string/present-"" → 400 "Invalid health status"
on both verbs; contacts POST status — `{"status":"inactive"}` → 200
+ "inactive" (was silently "active"), absent → "active", garbage →
400 "Invalid status"; the UI clear round-trip (above). All probes
cleaned BY EXACT ID (zero residue; 15/15 contacts, 10 accounts, 24
leads, 23 activities, 12 events; the Khalid probe event restored to
its seeded all-null state).

**Deferred with rationale (re-confirmed):** the reports/export
filter membership asymmetry, the 2 source enum-membership sites (the
vocabulary-reconciliation product decision — the readSettings
leadStages fallback's missing "unqualified" is entangled with the
same stored-list question), the CSV formula-injection decision, the
11 e2e sleeps, the standing ledger, the signup-page session read.

## 16ak. Session-45 Layer (the reports PDF guard + the localStorage read guards + the topbar AbortController + the calendar token + the format hygiene)

The session-45 unwrapped-surface + stale-response completion layer —
the last rejectable `void`-async in src, the read side of the storage
guard family, and the two stale-response races. All RED-first (exactly
14 failing pins before the code; all 1080 pre-existing checks stayed
green through RED).

**S45-P1 — the reports PDF rejection guard (F-45a).** The header PDF
button's `onClick={() => void exportReportsPdf()}` was the audit's
headline: the ONLY genuinely rejectable discarded promise in src
(`pdf-export.ts` has no internal catch; html2canvas-pro rejects on
huge-canvas/memory failures and mid-capture DOM mutations) — an
unhandled rejection plus a dead-feeling button with no toast. The
s44-P4 convention applied: `void exportReportsPdf().catch(() =>
toast.error("Could not export PDF", "Please try again."))` — the
happy path unchanged (no toast on success, the reference's contract).
The per-table `exportTablePdf` twins are synchronous jsPDF text
layouts — not rejectable, out of scope by design.

**S45-P2 — the localStorage READ guards (F-45b).** The s44-P4 guard
covered only the WRITE. The census found exactly 2 unguarded reads
repo-wide, both inside uncaught `setTimeout` callbacks (the mount
effects defer to avoid the hydration flash):
`listSavedReports()` (`saved-reports.ts`) and the leads saved-views
timer. Merely touching `window.localStorage` throws SecurityError
under all-cookies-blocked Chromium — an uncaught timer exception, with
the saved-list/views silently empty. Both reads now ride try/catch and
fall back to the empty list (the first-paint default); the write paths
already toast.

**S45-P3 — the topbar search AbortController (N-45c).** The 250 ms
debounce prevented same-window timer races but not out-of-order
resolutions: "ab" fires A → "abc" fires B → A resolves last → the
stale "ab" results overwrite B's (last-write-wins by network timing,
not query order). Now a controller per effect run: `signal` on the
fetch, `controller.abort()` in the cleanup, and the aborted
early-return in the catch (only a REAL failure resets — the s43-P4
reset semantics unchanged). A superseded fetch hands its state
ownership to the newer run instead of clobbering it.

**S45-P4 — the calendar events last-call-wins token (F-45e).** The
store's `fetchEvents` was last-RESOLVED-wins — rapid calendar month
flips could strand the stale month's slice in the store (February
resolving after March shows February's events under March's cursor).
A monotonically increasing module token: `const token =
++eventsFetchToken` per call, the set guarded by `token ===
eventsFetchToken`. Sequential flows are unaffected (the token only
skips a write when a NEWER call exists — the hydrate → calendar-effect
handoff resolves in the calendar's favor, the correct owner).
LIVE-verified both directions: 3 rapid flips ending on January 2027
show zero chips under January's grid (a stale October slice would show
the 12 seeded events); flipping back restores October's 11 seeded
chips.

**S45-P5 — the format.ts hygiene pair (F-45c/d).** Three dead exports
removed (`formatCompactNumber`, `monthName`, `monthShort` — zero
callers in src + tests, the s42 dead-code class) and `formatMonthYear`
gained the NaN guard every sibling formatter carries
(`formatMonthYear("not-a-date")` → `"—"`, was `"undefined NaN"`;
latent only — the sole caller passes a controlled Date).

**Census-method lessons (§16ak).** The `void someAsync()` census is a
first-class audit instrument — `void` on a total function is harmless
(the store's `call()` never rejects), but `void` on a fetch/DOM-capture
seam discards a REAL rejection surface; audit every `void` site
against the callee's rejection envelope, not its call shape. The
storage guard family is four-sided, not two-sided: SSR-guard, write
guard, READ guard, decode guard — s44 covered writes, this session
covered reads; a "blocked storage" test needs the property access
itself to throw, not just the JSON parse. And a debounce is NOT an
ordering guarantee — it narrows the race window but two requests can
still be in flight concurrently; ordering needs a controller (fetch
seams) or a token (store seams), chosen by which layer owns the state.

**Deferred with rationale (re-confirmed):** the reports/export filter
membership asymmetry, the 2 source enum-membership sites, the CSV
formula-injection decision (scope covers BOTH `csv.ts` and
`entity-export.ts` — the client-side quote-wrap family shares the
`=/+/-/@` exposure), the 11 e2e sleeps, the standing ledger, the
drift re-sweep next live visit.

## 16al. Session-46 Layer (the mutation-feedback sweep + the settings write seam + the edit-dialog remount + the dropdown containment)

**The mutation-failure silence family (F-46a).** The store's `call()`
is total and toasts NOTHING — an accounts-page comment claimed "toast
handled globally by store refresh" and was FALSE (grep: zero toast
calls in crm-store.ts) — while the codebase's own convention
(entity-dialogs, profile, the settings editors) toasts every failure.
Ten page-level mutation sites discarded failures silently: three
EntityEditDialog submits (`if (res.ok) { close }` with no else — a
failed PUT stranded the dialog open with a dead-feeling Save), five
inline deletes (one behind a literally empty `if (res.ok) {}`), and
two fire-and-forget inline mutations (toggleComplete, updateRole). All
ten now carry `toast.error("Could not save/delete/update X",
res.error)` — the entity-dialogs vocabulary verbatim, happy paths
untouched. The raw census found an 11th site — importContacts —
already handled by the s39-P2 three-way banner.

**The settings write seam (F-46b/c).** The reference mirrors an
immediate-PUT-per-change idiom but validates NOTHING; OUR s43-P3
membership guards collided — typing "Negotiation" in Default Lead
Stage fired a guaranteed-failing PUT per keystroke ("N" → 400 → a red
toast PER KEYSTROKE) plus a last-RESOLVED-wins write race. The
DefaultsEditor now rides ONE shared 500 ms trailing debounce with a
serialized flush chain (a `flushing` ref guard + re-schedule-on-
completion when a newer snapshot arrived — two PUTs can never race
within the editor) and an unmount cleanup that clears the timer AND
flushes a pending snapshot (a typed edit is not lost on navigation);
the no-save-button parity line holds (changes still persist
automatically; LIVE-verified — zero interim toasts, exactly ONE PUT
at t+502 ms, the final value persisted). The picklist `mutate()` now
reverts a failed add's phantom chip, guarded by reference equality
(`cur[key] === next[key]`) so a user who kept editing is never
clobbered; the settings remount keys moved off JSON LENGTH onto the
full serialization (same-length snapshots could collide → no remount
→ stale local state).

**The topbar envelope reset's abort-awareness (N-46a).** The s45-P3
catch treats an abort as a handoff; the s44-P5 envelope reset did not
— an abort landing during the body-parse window resolved `body` to
null via the swallowed `.catch(() => null)`, routing a SUPERSEDED run
into the reset branch (a transient close of the newer run's dropdown).
Now `else if (!controller.signal.aborted)` — and the s44-P5 PIN
EVOLVED with it (intent preserved: the envelope path still resets
BOTH results and dropdown; the evolution documented in the pin's
comment).

**The two LIVE-discovered pre-existing bugs.** Discovered when the
P1 offline probe refused to produce its toast through the edit dialog;
both reproduced on the stashed pre-session code. **F-46f:** the three
EntityEditDialogs opened with EMPTY fields — the `form` useState
initializer reads `initial` at the component's FIRST render, which
happens at PAGE MOUNT when `editTarget` is null; no key, no re-sync —
masked by F-46a (the empty submit 400'd silently). Fix:
`key={editTarget?.id ?? "none"}` on the three usages — the settings
editors' own keyed-remount convention ("local state initializes from
props at mount — never via setState-in-effect"). **F-46g:** the ghost
dialog under every row-menu action — the custom Dropdown renders items
in a Radix Popover portal and React synthetic clicks on portal content
bubble through the REACT tree to the TableRow's onClick (Radix's
`composeEventHandlers` does not stop propagation — source-verified),
so Edit/View-Insights/Delete ALSO opened the row-click dialog
(accounts: insights; contacts: the detail slide-over, rows AND
cards). Fix: click containment in `DropdownContent` itself —
`e.stopPropagation()` composed after `{...props}` (the caller's
onClick, if any, still runs first); item handlers unaffected —
LIVE-verified via View Insights still opening its dialog.

**Census-method lessons (§16al).** A comment claiming a behavior
("toast handled globally") is not evidence — grep the callee before
trusting it; a LIVE probe that refuses to produce its expected effect
is itself a finding (the empty edit dialog was invisible to every
source-level audit for 18 sessions because the SILENT failure masked
the EMPTY form — two bugs compounding into "nothing happens"). React
portal event propagation follows the REACT tree, not the DOM — a
portal-mounted menu inside a clickable row still fires the row's
onClick (containment belongs on the portal CONTENT, not the items).
And a keyed-remount is the repo's idiom for props-initialized local
state — useState initializers capture the FIRST render's props
forever. Finally: stacked fetch-wrappers in a long browser session
masquerade as double-requests — check the log-entry FORMATS (absolute
vs relative timestamps) before diagnosing a race.

**Deferred with rationale:** the reports/export filter membership
asymmetry, the 2 source enum-membership sites (+ the src-dead
CONTACT_SOURCES), the CSV formula-injection decision (a/b/c, covering
BOTH csv.ts and entity-export.ts), the 11 e2e sleeps, the standing
ledger, the drift re-sweep next live visit. New INFO notes: N-46b
(the events token not bumped on logout; the no-arg refetch supersede),
N-46c (pin-span robustness — fixed char-spans + comment-stripping =
false-RED risk), N-46e (the dead isLoading prop — wire a
double-submit guard or remove), N-46f (the BOM-less client CSVs —
parity-preserving), N-46h (the calendar KPI mixed baselines), N-46i
(the upload rate limit).

## 16am. Session-47 Layer (the dashboard export rewire + the insights vocabulary + the leads inline feedback)

**The dashboard export rewire (F-47a, MED).** The dashboard's five
export affordances — the outline Export dropdown's four items
(Leads/Contacts/Accounts/Activities) + the primary Export — rode
`downloadFile("/api/export?type=…&download=1")`, dead since the s29
re-scope (export/route.ts 400s every type except `report`); because
`downloadFile` sets `window.location.href`, every click NAVIGATED the
browser off the dashboard to the raw 400 JSON body. The reference's
own header trio is completely dead (no onClick — bundle-verified:
`["Call","Email",...]`-era template code); ours is the DOCUMENTED
functional superset (dashboard-contracts.test.ts's own comment)
whose jobs went dead with the route re-scope. Fix: all five wired to
the CLIENT-SIDE entity-export family, the pages' own conventions
verbatim — leads: `unquotedHeaderCsv` 8-column `leads_ISO.csv`;
contacts: `toQuotedCsv` 7-column + zero-guard `contacts_ISO.csv`;
accounts: `toQuotedCsv` 10-column + zero-guard `accounts_ISO.csv`;
activities: the settings raw-dump family `entityDumpCsv` +
`activity_ISO.csv` (the repo's only activities-CSV convention). Zero
`/api/export` references remain in the page. A NEW download e2e
closes the coverage gap that hid the bug for 18 sessions (the export
e2es pinned settings/contacts/leads/reports buttons only — nobody
clicked the dashboard's).

**The insights icon vocabulary (F-47b).** The Account Insights
dialog's comparison sites (s48 correction, N-48a: exactly FOUR — the
tint ternary ×2 + the icon ternary ×2, not the "six (×3 each)" the
session-47 records claimed; the fix and pins were unaffected — they
assert presence, not count) compared Capitalized `"Email"`/`"Call"`
against OUR lowercase Activity.type vocabulary (ACTIVITY_TYPES — the
seed and every other surface lowercase), so both branches were dead:
every activity row rendered the purple CalendarDays fallback. The
REFERENCE stores Capitalized types (bundle: `["Call","Email",
"Meeting","Task","Note"]` + the WhatsApp quick-log list) — ITS
comparisons match ITS storage. A mirrored comparison without the
mirrored storage is a broken icon map. Fix: the four sites
lowercased; the tint classes + the Mail/Phone/CalendarDays mapping
VERBATIM (pin-pinned). LIVE-verified: "Overdue: pricing call-back"
(call) renders the green Phone box; "Onsite workshop" (meeting) the
purple CalendarDays fallback.

**The leads inline-edit feedback (F-47f).** The three s29-P2
onChange arrows (value :534 / stage :546 / nextFollowUp :568) called
`updateLead` fire-and-forget — a failed PUT silently reverted via
updateLead's unconditional refetch (the user's edit vanished with
zero feedback). Missed by the s46 census because they are onChange
ARROWS, not async/await sites — the mutation-census lesson: grep for
the store verb, not the await shape. Fix: the three sites chain
`.then(onLeadEditResult)` into ONE shared 500 ms trailing debounced
failure toast — the value input mutates PER KEYSTROKE, and a failing
burst must not toast per keystroke (the s46-P2 DefaultsEditor
lesson applied to feedback): LIVE-verified 5 rapid keystrokes →
maxConcurrentToasts exactly 1. The unmount cleanup clears the window
(a late toast after navigation would fire on a dead page).

**The topbar hygiene (N-47g).** The entire Dropdown import block
(Dropdown/DropdownContent/DropdownItem/DropdownTrigger) was dead —
the topbar uses only the Menu* family (10 usages) since the account
menu migrated to the stock primitives. Lint-invisible because
`no-unused-vars` is off — the fresh-eyes import-block census caught
it. Removed.

**Census-method lessons (§16am).** A "functional superset" claim is
a LIABILITY the moment its wiring breaks — the dashboard's export
jobs were documented in three places (the page comment, the pin
comment, the README) while the actual clicks 400'd for 18 sessions;
only a download-e2e proves the artifact. An e2e coverage map should
be audited against the FEATURE list, not the test list — every
export surface had tests except the one that broke. A mirrored
comparison must be audited against the mirrored STORAGE (the
reference's Capitalized icons worked because its types are
Capitalized; ours were lowercase — the mirror was half-done). And
the mutation-failure census must cover onChange arrows — the store
verb is the census unit, not the await.

**Deferred with rationale:** the reports/export filter membership
asymmetry, the 2 source enum-membership sites (+ the src-dead
CONTACT_SOURCES whose header comment contradicts the s28 correction
— N-47e), the CSV formula-injection decision (a/b/c, covering BOTH
csv.ts and entity-export.ts), the 11 e2e sleeps, the standing
ledger, the drift re-sweep next live visit. New INFO notes: F-47c
(the lead EntityEditDialog 4-option Status select renders blank for
won/lost/negotiation/proposal leads — the documented Mke parity
quirk, same class as the inline select's blank trigger), N-47d (the
three entity-dialogs edit-mode branches dead-in-practice — ~170
unreachable lines; removal changes a shared component's surface),
N-47h (the DefaultsEditor remount-focus corner), N-47i (edits <500 ms
before a hard tab close never flush), N-47j (the flush fast-path
re-schedules at 0 ms), N-47k (the failed updateRole select display),
N-47l (the impure-updater idiom — benign without StrictMode).

## 16an. Session-48 Layer (the CSV formula-injection guard + the source-vocabulary reconciliation + the insights badge case + the reports export flow)

**The two operator decisions, landed.** Seven sessions of deferral
closed in one pass, both decisions evidence-first:

- **The CSV formula-injection posture (b).** Every builder surface
  passed cells beginning with `=`, `+`, `-`, `@`, tab, CR through
  UNSANITIZED (escapeCell quoted only on `[",\n\r]`; qq only
  quote-wrapped) — the OWASP CSV-injection vector, live on eight
  surfaces carrying user free-text (every seeded phone starts with
  `+`). The decision: the `=`/`+`/`@`/tab/CR guard (posture b) — a
  shared `guardFormulaPrefix` in csv.ts, applied inside `escapeCell`
  AND imported into entity-export.ts's `qq` (both families, one
  helper; safe cells byte-identical — the s41-P2 precedent class).
  `-` is DELIBERATELY excluded (posture c rejected): negative numbers
  and dash-prefixed free text stay exact; modern Excel blocks DDE by
  default, narrowing the residual vector. The phone cost is accepted
  and documented: in Excel (the threat model's dominant consumer) the
  `'` text marker renders `+971…` MORE faithfully than the previous
  formula-evaluated `971…`; raw-text/re-import consumers see the `'`
  (parseCsv strips no markers — pinned as the documented round-trip
  trade-off, so a future session cannot "fix" it silently). The three
  STATIC import templates stay OUTSIDE the guard (our own example
  content — zero attacker-controlled data; sanitizing buys nothing
  and costs the import UX) and the import parser stays untouched
  (parity: arbitrary strings BY the reference's own design).
- **The source-vocabulary reconciliation: DOCUMENTED PARITY, not a
  merge.** NEW bundle evidence closed the seven-session calculus: the
  reference's settings contactSources is an ENTITY-BACKED CRUD list
  (`rt.entities.ContactSource` create/update/delete) whose ONLY
  consumer is the settings page's own ConfigEditor (exactly one
  `ContactSource.list` query site) — it drives nothing functional
  THERE either; its create dialog HARDCODES the five emoji options;
  its DB stores raw values. The five-vocabulary fragmentation IS the
  reference's product design. So: the src-dead CONTACT_SOURCES
  constant + its self-contradicting s5 header comment ("Stored values
  include the emoji" vs the s28 correction beneath) REMOVED (N-47e
  closed; the living CONTACT_SOURCE_OPTIONS/SOURCE_PAIRS stay pinned
  where they live); NO enum-membership on the routes' source (a
  single-list guard is case-disjoint from another surface and would
  400 the reference's own accepted arbitrary import strings); the
  settings Capitalized defaults verbatim; the whole posture recorded
  in-file at constants.ts + settings/route.ts + both validation
  routes.

**The insights badge display-case (N-48b, the F-47b seam's remaining
half).** The s47 fix lowercased the icon/tint COMPARISONS but left the
type BADGE rendering the raw lowercase slug ("call") — while the
reference's badge renders ITS raw type, Capitalized in ITS storage.
The same display from OUR storage is the house idiom:
`ACTIVITY_TYPE_META[a.type]?.label ?? a.type` (the activities page +
the reports route convention). LIVE-verified: "Call"/"Meeting" badges
beside the intact green Phone / purple CalendarDays icon boxes.

**The reports export failure-mode (N-48g, the F-47a mechanism's LAST
instance).** The reports header Export CSV rode `downloadFile`
(window.location.href) — a non-200 (expired session's 401 envelope,
INTERNAL 500) NAVIGATED the browser to the raw JSON body. The
reference's own reports export is a CLIENT-side blob (bundle-verified
this session: `new Blob([N])` + a programmatic anchor, the
unquotedHeaderCsv shape) — it cannot fail-navigate. Our s25
architecture keeps the route as the single-source filter/artifact
seam, so the fix is the fetch→blob flow: `!res.ok` → the s46
convention envelope toast; ok → the text → the Content-Disposition
filename (fallback `csvFilename("crm_report")`) → `downloadBlob`.
`downloadFile` retired (zero consumers — the window.location.href
navigation seam left the codebase entirely). A NEW download e2e
closes the zero-coverage gap (the F-47a lesson: audit the e2e map
against the FEATURE list).

**The BOM byte-fidelity lesson (mid-GREEN, the e2e earning its
keep).** The new flow's first e2e run FAILED on the artifact header —
`res.text()` STRIPS the route's BOM (TextDecoder skips it by default),
silently changing the s25-pinned download=1 convention. Fix: the
`ignoreBOM: true` arrayBuffer decode. Two lessons: (1) a
fetch→blob download round-trip is NOT byte-transparent — every text
boundary (res.text, blob.text) silently re-decodes, and only an
end-to-end artifact assertion catches it; (2) when a fix's contract
is BYTES, the e2e must read the DOWNLOADED FILE, not intermediates —
the unit layer cannot see the decode seams.

**Census-method lessons (§16an).** A deferred decision deflates when
the EVIDENCE arrives: six sessions re-counted the five disagreeing
vocabularies while one bundle grep (who queries ContactSource?)
settled the posture — when a deferral's rationale is "we lack the
reference's intent", go READ the reference's intent before re-litigating
the surface list. And a security posture on a parity clone should be
scoped by WHO CONTROLS THE DATA, not by surface: the templates (our
static content) and the import (the reference's arbitrary-string
surface) stayed out of the guard while every user-data builder went
in — the same data-flow lens that found the export affordances dead
in s47.

**Deferred with rationale (re-anchored):** the reports/export filter
membership asymmetry, the 12 e2e sleeps (the s47 dashboard e2e added
one), the standing ledger (13 items, zero graduations 5 sessions
running), the drift re-sweep next live visit. INFO notes: F-47c (the
lead blank-select parity note), N-47d (the dead entity-dialog edit
branches), N-48a (the four-sites correction — landed here), N-48c
(the dashboard activities zero-guard divergence), N-48d (the
failed-then-succeeded toast window), N-48e (the near-vacuous URL
assertion), N-48f (the raw dumps' `[object Object]`/null cells —
parity), N-48i (working-tree residue hygiene), N-48j (the dashboard
builders byte-duplicate the pages').

## 16ao. Session-49 Layer (the pointer-(a) filter-membership decision + the stage∧status AND semantics + the deterministic e2e waits)

The third operator decision cycle closed the oldest standing pointer:
the reports/export **filter-membership asymmetry** (deferred since the
s46 audits — only `period` was validated while owner/stage/status/
source rode unvalidated into the Prisma where). The decision:
**targeted membership on the genuinely-CLOSED vocabularies** — `stage`
validates against `OPPORTUNITY_STAGES` and `status` against the new
shared `REPORT_STATUSES` constant ({open, won, lost} — the
REPORT_PERIODS precedent: one list for the page select + both route
guards), both answering the envelope's 400s; `owner` (the
data-dependent NAME-STRING join — a renamed owner would 400 every
stale saved view) and `source` (the s48 free-form parity) stay
deliberately OPEN with the rationale recorded in-file at both routes.
Pre-fix behaviors, now pinned: a typo'd stage answered a silently
EMPTY report; a typo'd status was a silent NO-OP (the where-builder's
else-branch dropped the filter — EVERYTHING came back, the s42
strict-bool class). The companion (N-49m): the saved-view Load
normalizes stale stage/status through `normalizeSavedStage`/
`normalizeSavedStatus` (the s32 `normalizeSavedPeriod` precedent —
unknown values fall back to "all" so a Load never 400s; LEAD stages
guard the cross-vocabulary boundary).

**The N-49n discovery (the session's headline finding):** decoding the
reference's filter predicate (bundle `D&&$&&V&&B&&R`) revealed that
stage and the status-derived stage test are INDEPENDENT conjuncts —
while BOTH of our routes built `oppWhere` by object spread with the
status branch LAST, so a concurrent stage+status(won/lost) request
OVERWROTE the stage filter (stage=prospecting&status=won returned
every closed_won; the reference returns the EMPTY intersection). An
18-session-old divergence, reachable from the page's own two selects,
invisible because no e2e ever set both. The fix AND-wraps the status
conjunct (`{ AND: [{ stage: closed_won }] }`) in both routes —
stage-only and status-only requests stay byte-equivalent — with a new
e2e proving the zero intersection on the seeded data (it fails on
the pre-fix code, the F-47a zero-coverage lesson applied).

**The deterministic-wait layer (the 12-sleep pointer):** every
`page.waitForTimeout` in crm.spec.ts retired except TWO annotated
no-op-contract keeps (the More... dead button, the reset decline —
where "nothing happens" IS the contract and the following
auto-retrying assertions would pass vacuously at t≈0). The taxonomy:
REDUNDANT sleeps deleted where the following assertion already polls
(the toBeVisible/toHaveValue family IS the wait); RESPONSE-waits where
a fetch completes the state (the settings four-slice hydration, the
dashboard leads slice + the "Follow up with" commit signal, and the
two post-wipe proofs asserted on the RESPONSE BODIES — under the
instant-render-with-zeros contract a bare $0/empty-state DOM poll is
VACUOUS: the zeros render pre-hydration too, so only the fetched body
proves the wipe); and ONE race-free reorder (the reset accept: the
alert blocks the page's JS until the handler accepts, and the dialog
pushes precede the accept, so the auto-retrying toHaveValue("")
cannot pass before both dialogs are recorded). N-48e's
`toContain("/")` tightened to the file's own toHaveURL idiom.

**The feedback + hygiene layer:** the leads inline-edit stale failure
toast (N-48d — a later SUCCESS within the 500ms window now cancels
the pending error: the clearTimeout hoisted above the ok
early-return; the failure path re-schedules, preserving the s46-P2
burst collapse); the src-dead `LEAD_SOURCES` twin removed (the s48
CONTACT_SOURCES precedent — the pin re-anchored to the living
LEAD_SOURCE_OPTIONS); and the four stale `downloadFile` doc carriers
corrected (CLAUDE/AGENTS/SKILL ×2 — the anti-pattern now routes the
blob family) plus the s48 pin-file header's `res.text()` narration
corrected to the ignoreBOM decode (N-49b).

**Census-method lessons (§16ao).** When a filter's semantics are in
question, decode the reference's PREDICATE, not its control list —
the selects' vocabularies had been read three sessions running while
the one-line `D&&$&&V&&B&&R` predicate (which combines them) sat
unread, hiding an 18-session-old overwrite divergence. And a sleep is
a bet on time, not a fact: classify it before replacing it — if a
positive signal exists, the assertion IS the wait (poll); if the
state arrives by fetch, await the RESPONSE (and under a
render-zeros-immediately contract, prove state changes on the
RESPONSE BODY, never the DOM); only a true no-op contract keeps a
bounded sleep, annotated.

**Deferred with rationale (re-anchored):** the standing ledger (13
items, zero graduations 6 sessions running), the drift re-sweep next
live visit, the e2e sleep census now 2 (both annotated no-op-contract
keeps). INFO notes: F-47c, N-47d, N-48c, N-48f, N-48j (documented
parity/scope, unchanged), N-49a (history-record ordinals — stay
as-written), N-49k's AGENTS.md `no-location-assign` claim (retired
with the rewrite — the rule matches no config).

## 16ap. Session-50 Layer (the N-47d dead-edit-branch retirement + the INFO-family triage + the docs-accuracy carriers)

The fourth hygiene cycle of the src-dead-removal class (s48
CONTACT_SOURCES, s49 LEAD_SOURCES — this time a BRANCH family inside
living components): the three create dialogs
(ContactDialog/AccountDialog/LeadDialog in
`src/components/shared/entity-dialogs.tsx`) carried full dual-mode
machinery — entity props, `createMode` locals, `!createMode` edit
branches (~170 lines), update-verb submit ternaries, "Edit X"/"Save
Changes" title/footer ternaries — while every caller passed
`setEditing(null)` ONLY: the branches were UNREACHABLE since the s28
EntityEditDialog family (W7/wce/Mke, `editTarget`-driven) took over
the edit surface. The reference itself NEVER reuses its create
dialogs for editing (the s28 bundle extraction), so the dead branches
were a pre-s28 leftover whose only risk was a future session wiring
`setEditing(entity)` and shipping a divergent-from-reference edit
surface. The retirement: the three dialogs are create-only (props,
initializers, submits, titles, footers simplified; the create field
sets byte-preserved), the three pages' dead `editing` states removed,
the unused imports dropped (Checkbox, ACCOUNT_TIERS,
CONTACT_PRIORITIES, LEAD_STAGES), and EventDialog/ActivityDialog keep
their dual-mode BY DESIGN (their edit modes are LIVE — activities +
calendar). RED-first: `tests/create-dialog-single-mode.test.ts` (4 RED
pins + 2 green-through-RED guards, proven mechanically in a pre-fix
worktree: 4 failed | 2 passed there, 6/6 at the fix) + the
leads-inline create-default pin re-anchored to the create-only
initializer (the raw "email" unchanged).

**The INFO-family triage (the s49 "suggested next", decided):**
N-47d CLOSED by the retirement above; F-47c KEPT documented parity
(the reference's own Mke edit dialog offers the 4-option Status set
that blanks on out-of-vocab stages — its own inconsistency, mirrored);
N-48c KEPT as-planned (the dashboard activities zero-guard is a
deliberate choice on a surface the reference does not have — its
dashboard export menu is entirely dead; a silent no-op on a
zero-count menu item beats a confusing empty artifact there, while
the settings surface keeps the reference's empty-artifact download);
N-48f KEPT documented parity (the reference's own String()-based raw
dumps render "[object Object]" cells the same); N-48j KEPT
maintainability note (the duplicated dashboard builders are the s47
client-side-export consequence — consolidation is churn risk with
zero parity gain).

**The docs-accuracy carriers (the audit findings, fixed):** N-50a/k
(CLAUDE.md's Build Commands table said e2e 110 while the rest of the
file said 111 — s49 fixed 3 of the 4 carriers, missed the table row),
N-50b (PAD's golden-path e2e row said 93 vs crm.spec.ts's 94 tests —
a chronic off-by-one where each session bumps only its own row; the
table now sums 9+1+94+7 = 111 = the Total), N-50c (SKILL §4.4's
constants inventory still listed LEAD_SOURCES as living after s49
removed it — the paragraph's own s42 DEFAULT_SETTINGS precedent note
described the fix), N-50d (AGENTS.md's source-vocabulary guidance
still cited the removed LEAD_SOURCES/CONTACT_SOURCES constants — now
the living LEAD_SOURCE_OPTIONS/CONTACT_SOURCE_OPTIONS pair).

**Census-method lessons (§16ap).** A dead branch inside a living
component is MORE dangerous than a dead constant: the constant can
never fire, but the branch is one `setEditing(entity)` away from
becoming a divergent edit surface nobody designed — retire dead MODES
as aggressively as dead EXPORTS, and pin the boundary (the
EventDialog/ActivityDialog dual-mode guard) so the retirement can
never eat a LIVE mode. And audit docs claims against COUNTABLE
truths: the `--list` count (111), the per-file test counts (94), and
the per-suite unit counts are mechanical — a docs table that sums to
less than its own Total is a finding, not a rounding quirk.

**Deferred with rationale (re-anchored):** the standing ledger (13
items, 7 sessions zero graduations — the N-47d closure is a
DELIBERATE graduation by remediation, not drift), the drift re-sweep
next live visit (the 46th clean — the 21st consecutive stable
bundle), the e2e sleep census stands at 2. INFO notes: F-47c, N-48c,
N-48f, N-48j (all triaged KEEP with rationale above), N-49a (stays
as-written).

## 16aq. Session-51 Layer (the calendar fetch-window seam + the KPI trend baselines + the docs carriers)

**The N-51a fix — the calendar month-flip fetch window.** The calendar
page's month-flip effect built its window inline as
`[prev-month 1st, current-month end]`
(`endOfDay(new Date(year, month + 1, 0))`), but the rendered grid is
the Sunday-anchored `calendarGrid(year, month, "sunday", true)`
TRIMMED to whole weeks (`weeks = max(ceil((lead + daysInMonth)/7),
4)`) — its TRAILING cells extend up to 6 days into the NEXT month
(worked example: Nov 2026 → lead 0, 30 days, 5 weeks → Dec 1-5
rendered). After a month flip the s45 last-call-wins token makes the
windowed fetch authoritative, so events on those trailing days
VANISHED from the cells that render them (the leading side was
over-covered by a full prev month — the asymmetry was the tell; the
same window also governs the KPI cards). The fix extracts the window
into the pure seam `calendarFetchBounds(year, month)` in
`src/lib/format.ts` (next to `calendarGrid`): `from` KEEPS the
deliberate full-prev-month over-coverage (the leading cells + the
today-side KPI cards when viewing ahead) while `to` covers the
UNTRIMMED 42-cell grid's final cell — always ≥ the trimmed render's
last day, so the trailing cells are always inside the window AND the
bound survives future changes to the page's trim (Oct 2026: untrimmed
Nov 7 vs trimmed Oct 31 — a week of harmless over-coverage). The
page's effect rewires to the seam; the `days` memo (the trim) is
untouched. LIVE-verified end-to-end: an event created on a trailing
December cell persists through flip-away-and-back (the pre-fix
behavior — the chip vanishing after the flip — was accidentally
witnessed live through a zombie dev server from a prior session that
was still bound to :3000 serving the old code, a perfect A/B), and
the probe deleted with zero residue.

**The N-51b fix — the KPI trend baselines.** The four TrendStatCards'
trends mixed populations: the CURRENT sides read `visible` (the
filtered set: `todaysEvents` via `eventsOn`, `meetingsThisWeek`,
`callsThisWeek`) while the BASELINE sides read raw `events`
(`yesterdaysEvents`, `meetingsLastWeek`, `callsLastWeek`) — with a
filter active the delta compared a filtered current against an
unfiltered baseline (a pseudo-delta). The three baselines now read
`visible` — both sides of every trend measure the same population.
With no filters `visible ≡ events` (byte-identical behavior — the
pinned no-filter e2e surface unaffected); the reference is
undecidable at its persistent zero data (no observable parity
divergence). The "Total Events" pseudo-delta
(`trend={`+${visible.length}`}`) is the reference's own quirk —
untouched, guarded by the pin.

**The pins** (`tests/calendar-fetch-bounds.test.ts`, RED-first: 4
failing + 1 green-through-RED guard, mechanically proven non-vacuous
in a pre-fix `b7c928c` worktree — 4 failed | 1 passed there, 5/5 at
the fix): the behavioral pins import the seam dynamically and pin the
worked examples (Nov 2026 `to` = the untrimmed Dec 12 cell AND ≥ the
trimmed Dec 5; Oct 2026 `to` = Nov 7 AND ≥ Oct 31; `from` = the
prev-month 1st over-coverage), the source pins assert the page's
effect derives its window from `calendarFetchBounds` (the month-end
form absent) and the three baselines read `visible` (no
`= events.filter` in the KPI region), and the guard holds the
neighbors (calendarGrid's 42-cell + monday-default contracts, the
page's sunday call + whole-week trim, the pseudo-delta + the trend()
helper verbatim, the `fetchEvents(from, to)` call shape).

**The docs/comment carriers (N-51e/f/g/h).** PAD's mobile-nav
"(5 checks, 390px viewport)" → the actual 7 (the chronic N-50b
class); PAD's frozen repo-tree test counts (15 suites/262 + 31) →
74/1171 + 111; the entity-dialogs.tsx file-header's "keyed by entity
id" pattern comment re-worded for the create-only reality (the
Event/Activity edit forms keyed, the create forms unmounted on
close); AGENTS' stale chart-placeholder bullet ("every chart must
render a friendly placeholder when all-zero") → the session-10
real-chart-at-zero contract it contradicted.

**The triage.** N-51c (the `DealTables` vs `DealsTables` one-letter
naming pair in reports-page.tsx — both live, different tables) KEEP
documented (a rename is churn with zero parity gain, the N-48j
precedent). N-51d (the fresh workspace's empty AUTH_SECRET) was a
local env posture — a dev secret set before the LIVE battery; no repo
surface. The INFO family stands as triaged in s50 (F-47c, N-48c,
N-48f, N-48j).

**The audits (the session's evidence base).** The s50 re-audit (51-a):
all six checklist items GENUINE — the create field sets
byte-preserved mechanically (AccountForm 1522/1522 chars, LeadForm
1738/1738 exact), the pins non-vacuous in a `c543b36` worktree
(create-dialog-single-mode 4 failed | 2 passed — the documented
arithmetic; the re-anchored leads-inline pin itself RED pre-fix, 1
failed | 24 passed — a fifth witness), 31/31 at HEAD, zero
suppressions. The graduation audit (51-b): ZERO graduations — 13/13
CONFIRMED (8th consecutive session; the only drift line-number
translation from the s50 retirement), the INFO family unchanged, the
counts exact by run, the operator decisions (the CSV posture (b) +
the source-vocabulary documented parity) standing unchanged. The
drift sweep (47th): the reference bundle byte-identical (the 22nd
consecutive stable session); the reference census: demo data zero +
the mobile-nav defect standing at a TRUE 390px.

**Census-method lessons (§16aq).** (1) A fetch window is a RENDERING
contract, not a calendar convention — derive it from the grid you
actually render (the untrimmed bound), never from the month's
arithmetic end. (2) When a LIVE probe contradicts a just-verified
fix, suspect the ENVIRONMENT before the code: a zombie dev server
from a prior session bound to :3000 (its own DB, its own stale
bundle) reproduced the pre-fix symptom perfectly — always verify
which PROCESS owns the port (`ss -tlnp`) and which file the Prisma
engine holds open (`/proc/<pid>/fd`) before re-litigating the fix.
(3) A trend's two sides must be audited for POPULATION symmetry, not
just arithmetic — the filtered/unfiltered mix was invisible at zero
filters (where visible ≡ events) and only surfaced under an active
filter. (4) `checkVisibility()` does NOT test `visibility: hidden`
unless `{visibilityProperty: true}` is passed — a plain call reports
the drawer's links visible after Escape.

**Deferred pointers.** The standing ledger (13 items, 8 sessions zero
graduations — the N-51a/N-51b fixes are deliberate closures by
remediation); the INFO family (F-47c, N-48c, N-48f, N-48j — triaged
KEEP); N-51c KEEP documented; the drift re-sweep next live visit
(the 47th clean — the 22nd consecutive stable bundle); the e2e sleep
census at 2 (both annotated no-op-contract keeps); an OPTIONAL
future e2e for the month-flip trailing-cell behavior (date-fragile
to author generically — the seam pin + the LIVE probe carry the
contract; noted for the operator).

## 16ar. Session-52 Layer (the saveView updater-purity hoist + the docs-carrier family)

**Standing layers (48th session, NO DRIFT):** the reference bundle
byte-identical (size 1,631,071 + md5 `a70a637fcf1d4291da8e0d965676
dc11` — the 23rd consecutive stable session, curl byte-compared
against the cached copy); the reference census: demo data zero +
the mobile-nav defect standing at a TRUE 390px (nav w=0, 8 links in
DOM, 0 visible, no hamburger, scrollW 390).

**The audits (52-a/52-b + manual validation of every claim):**
52-a — all ten session-51 checklist items GENUINE (the seam, the
rewire, the baselines, the pin file's 4+1 shape, the four carriers,
zero suppressions, the docs counts exact; the non-vacuousness
mechanically REPRODUCED in a pre-fix `b7c928c` worktree: 4 failed |
1 passed there, 5/5 at HEAD). 52-b — ZERO graduations, 13/13
CONFIRMED (9th consecutive session; the only drift a +2
comment-driven line translation in entity-dialogs); the INFO family
unchanged; both operator decisions' anchors standing (the CSV
posture (b) + the source-vocabulary parity); the counts exact by
run (74/1171 + 111 in 4 files; the sleep census at 2 annotated
keeps, zero drift); fresh-eyes on the leads/reports/activities
pages: React-19 discipline holds, zero staleness.

**The fix (S52-P1, N-52c — the updater-purity hoist).** The
leads-page `saveView`'s `localStorage.setItem` sat INSIDE the
`setSavedViews` updater — an impure setState callback (React may
re-invoke updaters; the storage side effect belongs in the handler
body per the S44-P4 `saveReport` convention). Harmless today
(idempotent write + try/catch'd) but a discipline violation the
codebase enforces everywhere else. The hoist: `const next =
[...savedViews, { name, filters }]` → the guarded write →
`setSavedViews(next)` — behavior-identical (the view still joins the
in-memory list when storage is blocked, the toast reports the
persistence failure, the prompt flow + the reload-decode path
unchanged), LIVE-verified with a save → list → reload → persist →
remove round-trip at zero residue. Pinned RED-first in
`tests/storage-read-guards.test.ts` (the source-structure pin: the
`const next` form present + NO storage access after the
`setSavedViews(` call), proven non-vacuous in a pre-fix `6ce8572`
worktree (1 failed | 3 passed there, 4/4 at the fix).

**The docs carriers (S52-P2, N-52a/N-52b).** N-52a: the three
sibling "5 checks" mobile-nav rows (PAD's per-file inventory, SKILL
§5.5, SKILL Bug #1's fix line) → the actual 7 (the chronic N-51e
class — the s51 fix corrected only ONE of the four carriers; a
count-correction sweep must grep for SIBLINGS of the corrected
string, not stop at the first hit). N-52b: README's Tested row —
the frozen session-45 leading pair "1095 unit + 108 e2e" retired
for the current counts stated directly (a growth clause cannot
rescue a stale leading pair; state the current truth, let the badge
carry the arithmetic).

**Census-method lessons (§16ar).** (1) When a count appears in
multiple docs, grep EVERY carrier before fixing one — the N-52a
trio survived the s51 fix because the sweep stopped at PAD. (2) An
updater callback is a PURE function by contract — React reserves
the right to re-invoke, discard, or replay it; side effects
(storage, toasts, logging) belong in the handler body or an effect,
never inside `setState(fn)`. (3) The impurity was invisible to
every green test because it was BEHAVIORALLY harmless — purity
violations surface only under source-structure pins (the
lint-family lesson: some contracts only a pin can hold).

**Deferred pointers.** The standing ledger (13 items, 9 sessions
zero graduations); the INFO family unchanged (F-47c, N-48c, N-48f,
N-48j — all triaged KEEP); N-51c KEEP documented; the drift re-sweep
next live visit (the 48th clean — the 23rd consecutive stable
bundle); the e2e sleep census at 2 (both annotated no-op-contract
keeps); the PAD per-session-row counting-convention ambiguity
observed (some rows carry CURRENT file totals, others the session's
landing delta — a pre-existing mixed convention, recorded for a
future docs pass, not re-litigated here).

## 16as. Session-53 Layer (the census seam + the orphaned-import/memo hygiene + the N-53a retraction)

**Standing layers (49th session, NO DRIFT):** the reference bundle
byte-identical (size 1,631,071 + md5 `a70a637fcf1d4291da8e0d965676
dc11` — the **24th** consecutive stable session, curl byte-compared
against the cached copy); the reference census: demo data zero +
the mobile-nav defect standing at a TRUE 390px (nav w=0, 8 links in
DOM, 0 visible, scrollW 390).

**The audits (53-a/53-b + manual validation of every claim):**
53-a — all seven session-52 checklist items GENUINE (the hoist + the
pin + the worktree arithmetic reproduced: 1 failed | 3 passed in a
pre-fix `6ce8572` worktree, 4/4 at HEAD; the four docs carriers; the
repo-wide "5.check" sweep at zero live carriers; zero suppressions;
the counts exact by run). 53-b — ZERO graduations, 13/13 CONFIRMED
(**10th** consecutive session; the drift map EMPTY — no ledger anchor
in either s52-touched file); the INFO family unchanged; both operator
decisions' anchors standing; fresh-eyes findings N-53c/N-53d (the
fixes below) + the N-53e/N-53f history-record notes.

**The N-53a retraction (the session's headline lesson).** The intake
census reported the repo db at 13 events and read "PROBE51 Trailing
Cell" as surviving s51 residue — and the follow-up forensics
RETRACTED it: the census had been run with a raw `new PrismaClient()`
from the repo root, which opens the SANDBOX-ROOT mirror db, not the
repo's. Proven by `PRAGMA database_list` (the engine's file was
`/home/z/my-project/db/custom.db` while the repo db sat at
`<repo>/db/custom.db` — run the pragma THROUGH the suspect client to
see its truth). The mirror carries the s51 zombie server's own
PROBE51 copy (exactly what the s51 record documented); the repo db —
mtime 03:32, all rows at the 01:24:04 reseed timestamps — was pristine
all along, and the s51/s52 zero-residue claims were TRUE. The
orchestrator committed the exact hazard it then closed.

**The census seam (S53-P2, N-53b — the systemic closure).**
`scripts/census.ts` + `bun run db:census`: counts through the app's
own db singleton (`src/lib/db`, re-anchored by `runtimeDatabaseUrl`),
PRINTS the resolved path first, then the per-model counts, then the
seed-contract verdict (EXPECTED 15/24/10/23/12 + 4 users; exit 1 on
drift with the reseed hint). The mechanics it closes: node resolves
the repo .env's relative `file:../db/custom.db` against the process
CWD (one dir outside the repo), bun absolutizes it against the .env
location (the same outer path), a stale outer `.env` with an absolute
URL redirects a third way, and a SQLite engine opening a MISSING
mirror path CREATES an empty db there (observed — the hazard
manufactures its own plausible mirror). Pinned by the new
`tests/db-census.test.ts` (4 pins: the singleton import + no raw
client, the printed URL, the EXPECTED table + the exit, the package
script).

**The hygiene pair (S53-P3/P4, N-53c/N-53d).** N-53c: eight s27-era
orphaned imports retired (calendar-page ×7 — Clock, Badge,
EVENT_TYPE_META, EVENT_STATUS_META, formatTime, timeUntil, EMPTY_STATE;
leads-page ×1 — CHART_COLORS; each had only its import as the in-file
reference, lint-invisible because no-unused-vars is off) + the
now-src-dead `EVENT_STATUS_META` constant retired from constants.ts
(the s48/s49 src-dead-constant precedent, record comment left in
place). N-53d: the leads-page `wonVsLost` useMemo NEVER cached (deps
`[won, lost]` were fresh `filtered.filter(...)` identities every
render) — extracted VERBATIM to the module-scope pure
`buildWonVsLost(won, lost)` and called plainly (the sibling
`pipelineByStage` idiom; `filtered` :189 and `funnel` :277 are the
live memos and were untouched). Both pinned RED-first in the
dead-code-hygiene session-53 describe (4 pins), the whole 8-pin set
proven non-vacuous in a pre-fix `fe975d6` worktree (8 failed |
2 passed there, 10/10 at the fix).

**Census-method lessons (§16as).** (1) A count without its resolved
path is not evidence — bind every census to a named file by PRINTING
the URL the engine actually holds. (2) `PRAGMA database_list` through
the suspect client is the ground truth for WHICH file a Prisma
process serves — trust it over env-var reasoning. (3) An intake
finding that contradicts a VERIFIED ship record (the s51/s52
zero-residue claims, each backed by a live cleanup) should trigger an
environment audit before a docs correction — the s51 §16aq lesson
(generality confirmed): when a probe contradicts verified history,
audit the probe first. (4) An orphaned import is invisible to lint
(no-unused-vars off) and to every behavioral test — only a
census-by-grep of "exactly one in-file reference" finds them; the
53-b fresh-eyes pass is the pattern. (5) A useMemo whose deps are
fresh identities is not a memo — it is a plain computation wearing a
cache costume; either fix the deps honestly or retire the wrapper to
the sibling idiom.

**Deferred pointers.** The standing ledger (13 items, 10 sessions
zero graduations); the INFO family unchanged (F-47c, N-48c, N-48f,
N-48j — all triaged KEEP; N-51c KEEP); N-53e (the s52 plan's phantom
CLAUDE suite-description promise — history stays as-written, the
N-49a convention) + N-53f (the PAD:1278→1279 citation drift — same
convention) recorded; the drift re-sweep next live visit (the 49th
clean — the 24th consecutive stable bundle); the e2e sleep census at
2 (both annotated no-op-contract keeps); the quarantined outer
leftovers (`.env.quarantined-s53` / `custom.db.quarantined-s53` —
outside the repo, zero git surface) to be left inert.

## 16at. Session-54 Layer (the dead-vocabulary retirement + the calendar-memo family + the trailing-cell e2e)

**Standing layers (50th session, NO DRIFT):** the reference bundle
byte-identical (size 1,631,071 + md5 `a70a637fcf1d4291da8e0d965676
dc11` — the **25th** consecutive stable session, curl byte-compared
against the documented fingerprint); the reference census: demo data
zero + the mobile-nav defect standing at a TRUE 390px (nav w=0, 8
links in DOM, 0 visible, scrollW 390). **The audits (54-a/54-b +
manual validation):** 54-a — all eight session-53 checklist items
GENUINE (the worktree arithmetic reproduced: 8 failed | 2 passed in a
pre-fix `fe975d6` worktree, 10/10 at HEAD; zero suppressions; counts
exact by run). 54-b — ZERO graduations, 13/13 CONFIRMED (**11th**
consecutive session; the drift map EMPTY; one line-only drift family
from the s53 extraction above the N-48j/F-47c sub-anchors, substance
identical); both operator decisions' anchors standing; fresh-eyes
findings N-54a..N-54f (the fixes below).

**The operator decisions (session-54).** Both STANDING and re-verified
against the 25th consecutive stable bundle: the CSV
formula-injection posture (b) unchanged; the source-vocabulary
documented parity STANDS AND EXTENDS — the s48/s49 retirement policy
(src-dead vocabulary exports retire with record comments; pins
re-anchor to the living surface or retire with their dead subject)
now covers the N-54b family. The extension is the session's judgment
call: leaving half the dead-vocabulary family invites the chronic
sibling-carrier relapse (the N-52a lesson — fix every carrier at
once).

**The dead-vocabulary retirement (S54-P2, N-54b).** Eleven exports
retired from constants.ts with record comments: the FULLY-DEAD seven
(OPEN_STAGES, isClosedOppStage, CONTACT_SOURCE_LABEL,
LEAD_EDIT_STATUSES, LEAD_EDIT_SOURCES, TIER_META, PRIORITY_META —
each exactly one repo-wide reference = the definition) + the TEST-ONLY
four (DROPPED_STAGES + isDroppedStage [the s5 "dropped = lost +
unqualified" reading the live S29-P5 KPI contradicts — "Dropped
Deals" counts `lost` STRICTLY], REPORTS_PIPELINE_SLUGS + FUNNEL_STAGES
[redundant with reports-data.test.ts's complete ordered arrays +
LEADS_FUNNEL], ACCOUNT_EDIT_STATUSES [the stale wce decode — the LIVE
select maps ACCOUNT_STATUSES = active/inactive/churned, NOT the
constant's prospect]). Five stale pins removed or re-anchored: the
isDroppedStage pin → the live lost-STRICTLY filter (dead-code-hygiene),
the wce pin → the ACCOUNT_STATUSES.map wiring (contact-model, in
situ).

**The calendar memo family (S54-P1, N-54a).** The `visible` useMemo
(deps `[events, activeTypes, activeDates, query]` — the fresh
`.filter().map()` identities at activeTypes/activeDates defeated the
cache, the N-53d class in calendar) extracted VERBATIM to the
module-scope `buildVisibleEvents(events, activeTypes, activeDates,
query)` + the plain call; the transitively never-caching `eventsOn`
useCallback (deps `[visible]`, called only during render) retired to
a plain arrow. Behavior identical; the `days` grid memo untouched.

**The smaller closures.** S54-P3: the census MATCH banner now DERIVES
from EXPECTED (N-54d — the hardcoded "15/24/10/23/12" literal could
drift stale on a future EXPECTED re-sync) + the db-census pin 2
strengthened to pin the actual `database: ${url}` print form (N-54e —
the s53 pin only asserted any console call, so deleting the URL print
would have passed: the count-without-path regression under-pinned).
S54-P4: the ghost-action dead-affordance annotations (N-54f) — the
contacts Call/Email/WhatsApp trio + the calendar Phone/Message pair
carry NO onClick in the reference's own bundle (verified this session:
`Ke,{variant:"ghost",size:"icon",...}` with children only), now
annotated like the leads Convert item. S54-P5: the docs carriers —
AGENTS' vocabulary row corrected to the live Dropped truth +
PRIORITY_META dropped (N-54g), the SKILL §4.4 inventory fixed
(N-54c: STAGE_META is 8 stages; PRIORITY_META/TIER_META out).

**The month-flip trailing-cell e2e (S54-P6, the s51 suggested-next).**
A new crm.spec.ts test proves the N-51a fetch-window seam END-TO-END:
a Demo event created on a trailing next-month cell through the New
Event dialog (dblclick shortcut; the seed has ZERO demo events, so the
Demos type filter isolates it deterministically for the cleanup) → the
chip renders on the trailing cell → flip away and back (the month-title
h2 pins each view) → THE CHIP PERSISTS (the pre-s51 month-end bound
lost it) → delete via the filtered agenda's ⋮ + native confirm → zero
residue. Deterministic at any run date: the view month is picked so it
HAS trailing cells (last day ≠ Saturday; ≤ 2 "Next month" hops — the
only back-to-back no-trailing pair is a Saturday-ender followed by a
non-leap February).

**Census-method lessons (§16at).** (1) A stale vocabulary pin is
worse than no pin: `ACCOUNT_EDIT_STATUSES` asserted a "wce select"
vocabulary the live select never used (active/inactive/prospect vs
the live active/inactive/churned) — a pin must anchor the LIVING
surface or it documents a fiction. (2) The dead-vocabulary census is
the same discipline as the orphaned-import one (§16as lesson 4):
grep for "exactly one repo-wide reference = the definition", then
check whether the survivors are src consumers, test pins, or record
comments — each class retires differently. (3) A test-only constant
is not coverage — it is documentation wearing a pin; when its living
surface carries its own pin (reports-data, LEADS_FUNNEL), the
duplicate retires with the constant. (4) The never-caching-memo class
(N-53d) transits through useCallback too: a callback whose dep is a
never-caching memo's output recreates every render — retire the whole
chain, not just the memo.

**Deferred pointers.** The standing ledger (13 items, 11 sessions
zero graduations); the INFO family unchanged (F-47c, N-48c, N-48f,
N-48j, N-51c — all triaged KEEP); the drift re-sweep next live visit
(the 50th clean — the 25th consecutive stable bundle); the e2e sleep
census at 2 (both annotated); the quarantined outer leftovers left
inert (the reset recreated the outer `.env`, quarantined again as
`.env.quarantined-s54`).

## 16au. Session-55 Layer (the orphaned-import retirement + the test-only-seam retirement)

**Standing layers (51st session, NO DRIFT):** the reference bundle
byte-identical (size 1,631,071 + md5 `a70a637fcf1d4291da8e0d965676
dc11` — the **26th** consecutive stable session, curl byte-compared
against the documented fingerprint); the reference census: demo data
zero + the mobile-nav defect standing at a TRUE 390px (nav w=0, 8
links in DOM, 0 visible, scrollW 390). **The audits (55-a/55-b +
manual validation):** 55-a — all nine session-54 checklist items
GENUINE at file:line (the buildVisibleEvents extraction, the
11-export retirement, the pin re-anchors, the census derivation, the
ghost annotations, the month-flip e2e, counts by run, diff hygiene,
and the non-vacuousness mechanically reproduced: the 5 RED pins
replayed against `git show d928a30:` — 5 failed | 11 passed | 16/16);
55-b — ZERO graduations, 13/13 CONFIRMED (12th consecutive session;
two line-only drifts from the s54 churn, substance identical); the
INFO family unchanged (F-47c, N-48c, N-48f, N-48j, N-51c); both
operator decisions standing. **The fresh-eyes family (each manually
validated):** N-55a the reports-page FOUR orphaned imports
(KpiCard/RevenueLineChart/ConversionFunnel/CHART_COLORS — the N-53c
class; the s53 sweep's file set simply missed reports-page);
N-55b format.ts avgDaysBetween/percentDelta TEST-ONLY (the live
derivations are the leads-page inline avgCycle + the KPI_STATICS
statics); N-55c lead-filters.ts encodeLeadFilters/decodeLeadFilters
TEST-ONLY since the s29 saved-views supersession (the list decoding
validates through the same internal asFilters); N-55d the PAD
lead-filters row doubly stale (the retired pair + the pre-s29
singular storage key); N-55e the s53 leads-page record comment's
"the reports page owns the palette" claim.

**The operator decisions (session 55):** (1) the CSV
formula-injection posture **(b) STANDS** (the bundle byte-identical
for the 26th consecutive session; both audits' anchors verified; no
new evidence). (2) The source-vocabulary documented parity **STANDS
AND EXTENDS** to the seam-level test-only family — the
s48/s49/s53/s54 retirement policy now covers test-only pure helpers,
not just vocabulary constants: a "unit-tested pure seam" nothing
calls is a false contract surface (the same judgment as the s54
extension; leaving half the family invites the sibling-carrier
relapse — the N-52a lesson). The behavioral safety the encode/decode
its pin is REAL and re-anchors to the living saved-views pair (the
s54 ACCOUNT_EDIT_STATUSES precedent) — legacy-vocabulary + malformed
rejections stay pinned where they live.

**The fixes (S55-P1..P6, RED-first):** the reports-page import
narrowing + the corrected palette comment (P1); the format.ts pair
retired with record comments + the 3 stale analytics its retired
(P2); the lead-filters.ts pair retired + the 4 its re-anchored to
encodeSavedLeadViews/decodeSavedLeadViews (green-through-RED guards
— the living pair already carried the behavior; P3); the PAD row
corrected (P4); the dead-code-hygiene session-55 describe — 4 RED +
1 guard (P5); the docs suite (P6). RED: exactly 4 failures; full
suite 4 failed / 1180 passed (1184 total). Non-vacuousness: 4
failed | 55 passed in a pre-fix `d4b6a61` worktree (hard-linked
node_modules); 59/59 at the fix. **Gate:** lint 0/0 · tsc 0 ·
1184/1184 unit (75 suites, +5 −3) · build clean · 112/112 e2e on a
fresh CI=1 boot (all 7 mobile-nav checks green). **LIVE:** the
Reports page renders the full contract (the N-55a fix surface —
header + filter bar + the KPI row with the $0.0K/$0K uppercase-K
variants + the five tabs + 10 charts, zero errors); the drawer both
directions at a TRUE 390px (288px portal nav, 8/8 truly visible,
aria-expanded, dual scroll-lock; Escape → 0/8 + unlocked); zero
390px overflow on all ten routes (both Dashboard casings); NO
Tailwind v4 bug (the `--blur-sm` 4px token + the exact pinned
`rgba(0,0,0,0.05) 0px 1px 2px` shadow, probe-verified on a live
input). Zero probe residue through the seam (the closing
`bun run db:census` MATCH). **Screenshots:** 02/11/12 re-captured +
**64-reports-page NEW** (the fix surface at 1440×900). All
VLM-verified (the "empty charts" observation = the documented
row-derived-series zero-state with the dashed "3 3" grid — the s10
contract, not a defect).

**§16au census-method lessons:** (1) The orphaned-import class
survives a sweep when the sweep's FILE SET is the census unit —
the s53 sweep cleaned calendar ×7 + leads ×1 because those were the
52-b audit's read list; the reports page was never read, so its four
orphans survived TWO sessions. A file-set census must be refreshed
per session against the churn map, not inherited. (2) A test-only
export is a contract SURFACE, not just dead code: it advertises a
unit-tested derivation the app never performs (the format analytics
pair implied the KPI deltas were computed — they are hardcoded
statics, the reference's own design). Retiring it is a
documentation-accuracy fix, not just hygiene. (3) When retiring a
test-only seam, first ask WHERE the behavior it pins lives now —
if a living surface carries the same class (the saved-views pair
sharing asFilters), the pins re-anchor and the safety net stays; if
nothing carries it (the analytics pair), the pins retire with the
subject and the live surface's OWN pins are the honest coverage.

**Deferred pointers.** The standing ledger (13 items, 12 sessions
zero graduations); the INFO family unchanged (F-47c, N-48c, N-48f,
N-48j, N-51c — all triaged KEEP); the drift re-sweep next live visit
(the 51st clean — the 26th consecutive stable bundle); the e2e sleep
census at 2 (both annotated); the quarantined outer leftovers left
inert (the reset recreated the outer `.env`, quarantined again as
`.env.quarantined-s55`).

## 16bf. Session-66 Layer (the badge-primitive honesty + the parity-gap wiring)

The session-66 lesson triple:

**(1) The stock-primitive re-derivation must eventually reach EVERY stock
surface — the class maps at the call sites are NOT the chrome.** The Badge
primitive had been a rounded-full px-2 font-medium SPAN with an invented
variant set since the initial scaffold commit, surviving 65 parity
sessions because (a) the reference renders NO badges at its persistent
zero data — the live probes could never see them, and (b) the s27-s31
bundle decodes pinned the P map / the priority i-map / the health H-map /
the source classes — all CALL-SITE vocabulary, never the primitive. The
rotation that finally caught it read the primitive against the bundle's
`zn`/`fie` decode directly. The rule: when a decode pins a family of
class STRINGS, also decode the COMPONENT that renders them — the radius,
the padding, the weight, the element, and the variant set are chrome the
strings never carry. The computed-equal rule applies at this layer too:
where the reference's token is deliberately inverted (its --primary is
the stock dark #171717; ours is the app blue), express the variant
through the literal that computes equal (bg-neutral-900 text-neutral-50
— the s13 PROFILE_LAYOUT.badge live-probed precedent), and pin BOTH the
base string and the variant set so the chrome can never silently
re-diverge.

**(2) Dead machinery on a shared component may be an UNWIRED PARITY
FEATURE, not cargo.** The Tabs count badge looked like dead code (zero of
six consumers pass `count`) — but the bundle shows the reference's
activities Overdue tab rendering `["Overdue", P.overdue.length>0 && <span
className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800
rounded-full">{N}</span>]`: a live feature our s23 tabs layer built the
machinery for and never wired, with invented state-dependent classes on
top. Before retiring a dead surface on a SHARED component, grep the
reference bundle for the same affordance — the machinery exists because
a decode saw it once. The fix wires the feature (the guarded count at
the call site, exactly the reference's `>0 &&` shape) and re-pins the
span to the literal classes; the retirement would have permanently
diverged a live surface.

**(3) The mid-flight edit-repair residue class has a test answer: pin
the CONTRACT the repair touched, not just the line it fixed.** The s65
session's calendar upcoming-bar MultiEdit repair accidentally landed
`items-center` on the AGENDA row (a different row family with a
different contract — upcoming is items-center, agenda is items-start);
the s65 gates all stayed green because no pin covered the agenda row's
alignment (the contract lived only in a test-file COMMENT). The rule: a
contract documented in a comment but never asserted is a contract the
next edit can silently break — after any mid-flight repair on a surface
with a documented contract, land the executable pin in the same session.
(And the record rule: the F-66a1 hunk also falsified the s65 plan's
"zero behavior" blast-radius claim — blast-radius claims are per-HUNK,
not per-file; the s66 re-audit's src-diff read is the model.)

The standing layers held: 13/13 ledger zero graduations (23rd
consecutive), both operator decisions standing (the CSV posture (b)
24th re-affirmation; the source-vocabulary parity extended to the N-66
family), the reference bundle byte-identical for the 37th consecutive
session. Gate: lint 0/0 - tsc 0 - 1245/1245 unit (76 suites, +18) -
build clean - 113/113 e2e (fresh CI=1 boot, all 8 mobile-nav checks
green — the inert/Tab-wrap test included) - LIVE-verified (the badge
stock geometry on the dashboard/contacts/accounts surfaces; the search
Escape round-trip; the overdue count badge; the drawer both directions
at a TRUE 390px with focus restore; zero 390px overflow on all ten
routes; NO Tailwind v4 bug; census MATCH, zero residue).

## 16bg. Session-67 Layer (the auth-seam honesty + the small-hole closures)

The session-67 lesson triple:

**(1) A documented mechanism that no code implements is worse than no
documentation — the DEPLOYMENT.md X-Forwarded-Proto claim.** The deploy doc
told operators to forward `X-Forwarded-Proto` "so cookie attributes derive
the right scheme" for 60+ sessions while `setSessionCookie` read nothing
but `NODE_ENV` — an operator following the doc on a plain-HTTP production
boot still shipped Secure cookies browsers silently drop (a login loop),
with the doc actively pointing AWAY from the real lever (`NODE_ENV`).
The 67-c rotation caught it because it audited the DOC and the CODE as one
seam. The rule: every deploy-facing claim about a mechanism (headers read,
env vars consumed, flags derived) must be grep-verifiable in src the day it
is written — and the fix for a false mechanism claim is to correct the DOC,
not to wire the header (reading a spoofable request header to drive the
Secure flag would be its own vulnerability; the trusted-proxy question is
the standing N-67b ledger).

**(2) The small holes compound: rate the FAMILY, then close the family in
one pass.** Each N-67 finding alone was Nano-to-Low (a non-atomic counter,
an ungated JSON parse, an unlimited upload route, a missing Retry-After).
As a family they describe the same failure mode — the auth seam grew
route-by-route across 60+ sessions and the cross-cutting invariants
(nobody buffers unbounded, nobody writes unlimited, every 429 carries
Retry-After) never had an owner. The closures landed as one
family pass with one shared helper (MAX_AUTH_BODY_BYTES/isBodyTooLarge in
api.ts) and one contract suite (tests/auth-contract.test.ts) pinning the
whole family's shape — per-route constants, gate-before-parse ordering,
the Retry-After presence, the twin cookie flags. When a rotation finds
three or more same-mode findings, fix the MODE, not the instances.

**(3) The artifact-evidence rule extends to screenshot IDENTITY: a new
screenshot must carry evidence the existing set does not.** The s66
"75-activities-overdue-count.png" was byte-identical to the re-captured
07-activities.png (both captured the default view — which IS the Overdue
tab), so the file documented nothing the set did not already show. The
s67 re-capture uses the Due-Today-ACTIVE state: the red count pill on the
INACTIVE Overdue tab is exactly the conditional the badge's guard
(`> 0 &&`) promises, and no other shot in the set shows it. The rule: when
a screenshot exists to prove a conditional, capture the state where the
condition's CONTRAST is visible — the off-branch, the inactive tab, the
neighboring surface without the feature.

The standing layers held: 13/13 ledger zero graduations (24th consecutive),
both operator decisions standing (the CSV posture (b) 25th re-affirmation;
the source-vocabulary parity extended to the N-67 family — the auth seam
touches NO vocabulary surface), the reference bundle byte-identical for the
38th consecutive session. Gate: lint 0/0 - tsc 0 - 1257/1257 unit (77
suites, +12) - build clean - 114/114 e2e (fresh CI=1 boot, all 8
mobile-nav checks green — the wrong-code ladder test new) - LIVE-verified
(the body pre-gate 400 on a 20KB body; the 11th-login 429 with
Retry-After: 900; the authed /signup rendering the card with no redirect;
the logout round-trip; the resend banner through body.data.message; the
ladder rung live; the drawer both directions at a TRUE 390px with focus
restore; zero 390px overflow on all ten routes; NO Tailwind v4 bug; census
MATCH — the 2 throwaway LIVE-probe users reseeded in place).

## 16bh. Session-68 Layer (the stat-value honesty + the small-wiring session)

The session-68 lesson pair:

**(1) A proven-once fix does not propagate itself — sweep the FAMILY the
same session the evidence lands.** The s13 KPI-value decoration sweep
(S13-P9) *proved* the leading-none/tracking-tight trio a real computed
diff and fixed exactly one component (KpiCard/KPI_VALUE). The other
three stat-card families (BarStat, IconStat, CircleStat) shipped the
same invented decorations for 55 more sessions — every audit re-read the
KPI_VALUE pin as "the KPI typography contract" instead of asking which
surfaces the pin did NOT cover. The 68-c rotation only found it because
it read page-parts.tsx line-by-line as a never-rotated seam. The rule:
when a live-probe proves a class of styling wrong, enumerate every
consumer of that class THE SAME SESSION (grep the class family, not the
fixed member) — and pin each surface's corrected form so the next
sweep has anchors to diff against.

**(2) A formatter's untested window is a silent 1000x misread waiting
for data.** formatCompactCurrency's sub-1000 + options branch rendered
$950 as "$950.0K" for 36 sessions — invisible because the reference's
persistent zero state ("$0.0K") is byte-identical on both code paths.
The bug class: two code paths that AGREE at the only input the live app
ever shows and DIVERGE everywhere else. The unit pins covered the
scale:"k" path and the legacy branching separately, but nothing pinned
the reports CALL-SITES' options shape — the wiring, not the formatter,
was the defect (the fix is two characters of scale:"k" at the
call-sites). The rule: when a function has magnitude-dependent branches,
pin the branch selection AT THE CONSUMERS (a source-contract pin that
the call-site passes the scale), not just the branches' outputs — and
decode the reference's literal formula from the bundle when the live
app's data state cannot discriminate.

**(3) Byte-copies of pinned constants are divergence debt.** Five sites
hand-inlined strings that constants already pinned (the edit dialogs'
wide shell + footer, the settings typo, the contacts mobile grid) while
their tests pinned the INLINE copies — so a future constant re-pin
would silently fork the create/edit families. The wiring + the pin
re-anchor land together or not at all: wire the constant, then re-pin
to the constant-consumption form (entity-edit-dialog.test.ts:42-61 is
the template).



## 16bi. Session-69 Layer (the e2e-honesty + the s68-straggler session)

The session-69 lesson trio:

**(1) A component's VARIANT is a second surface — sweeps must enumerate
render arms, not component names.** The s68 sweep retired the
decoration family from IconStatCard's contacts arm while the leads arm
(a conditional early-return inside the SAME component) kept
`text-foreground` and the pre-normalization order for another session.
The s68 pins covered the family name, so every audit re-read them as
"the stat-value contract" — no pin asked whether the component had
MORE THAN ONE RETURN ARM. The rule: when a sweep fixes a component,
grep its conditional variants (`if (variant === ...) return`) and pin
each arm's corrected form; a family-level pin that names only the
default arm is half a pin.

**(2) The e2e seam itself deserves a rotation.** Sixty-eight sessions
rotated fresh eyes across every SRC seam while the 2,933-line test
infrastructure — the layer that decides what "green" means — was never
itself read line-by-line. The 69-c rotation's first pass found a Low
(the local reused-server limiter accumulation: `reuseExistingServer:
!CI` keeps in-memory rate buckets alive across runs while global-setup
reseeds the DB, so a third run inside 15 minutes trips resend/verify
with spurious 429s), a redundant assertion that could never fail
(`not.toHaveCount(0)` after `first().toBeVisible()`), a duplicated env
default that could drift the 401 probe at a dead port, and a coverage
catalog whose LIVE-only surfaces (the overflow sweep, the pre-gate
400s) had been re-verified by hand every session without a single
pin. The rule: rotate onto the test layer on a cadence — assertions
that cannot fail, env literals duplicated across files, and
comment-vs-code drift are invisible from the src side, and a LIVE
battery that never graduates into a pin is a regression waiting for
its window.

**(3) A cheap-rejection contract needs its own ordering pin — scoped
to the handler.** The gate-before-parse pin held for 12 routes while
one of them still paid a `findUnique` round-trip before rejecting an
oversized body: the pin measured (gate, parse) when the CONTRACT was
(gate, ALL work). And the obvious fix — pin `gate < first db.` at file
scope — would false-RED on every root route whose GET handler
legitimately reads the DB before the POST's gate. The rule: pin the
semantic contract (no DB work between the handler's start and the
gate), derived from the gate's OWN handler boundary — and when a
family of routes shares a contract, scope the pin the way the code
actually structures the family (per-handler, not per-file).

## 16bj. Session-70 Layer (the chart-family honesty + the store write-guard session)

The session-70 lesson trio:

**(1) A "complete" sweep needs a family ENUMERATION, not a class
retirement.** Two consecutive sessions retired text-foreground from
stat-card values — and the 5th family (TrendStatCard, the calendar
KPIs) still carried it, PINNED AS CORRECT by the very suite meant to
guard the layout contracts. The s68 census counted class forms
repo-wide ("ALL BARE") without enumerating the stat-card FAMILIES
(the census's x15/x4/x10 counted scale+weight forms, several of which
were h1 titles). The rule: when a sweep claims completeness over a
component family, enumerate the family's MEMBERS (every exported
stat-card component + every constant-consumed value string) and pin
each one — a class-retirement absence pin on combined decoration
strings cannot see a survivor that never carried the rest of the
combination.

**(2) An unpinned parity is luck, not law — constants are the pin's
natural home.** The three reports pies rendered the reference's exact
fill palettes for 40+ sessions with #ec4899 in zero test assertions:
byte-identical by luck (nobody edited the arrays), not by contract
(nothing failed if they had). The fix was not just a test — it was
CONSTANT EXTRACTION + consumption (REPORTS_PIE_FILLS.four/.five), the
S68-P4 class: once the call-sites consume the constant, a future
re-pin cannot diverge the three pie families from each other, and the
palette pin lives in the constants suite beside its siblings. The
same session found the inverse hazard at the by-type chart: a
hand-rolled duplicate of an existing family carrying an INVENTED
series name — invisible because no assertion read the tooltip.

**(3) Guard the WRITE, not the fetch — races live wherever an await
precedes a set.** The s64 logout write-guard covered the nine
fetchers and hydrate, and the audit still found an unguarded path:
updateSettings' `if (res.ok) set(...)` AFTER an await — the same
leakage class through a different door (a mutation, not a fetch).
But the audit's other half was WRONG: updateLead's optimistic set
sits BEFORE its await, task-synchronous with the onChange — no
logout continuation can interleave, and a guard there would be dead
code. The rule: enumerate the store's `set(` sites and classify each
by whether an `await` precedes it; guard the post-await writes with
the session token, document the synchronous ones as race-free. And
when a refetch is a ROLLBACK mechanism (the optimistic patch), keep
it unconditional — but gate the refetches that only mirror SUCCESS
(res.ok) so the failure path stops paying for work the server never
did.

## 16bk. Session-71 Layer (the permanently-mounted dialog family + the entity-dialogs rotation)

The session-71 lesson quintet:

**(1) A remount-via-key has a COST AXIS beyond correctness: the
UNMOUNT PATH.** The s46 outer-key fix (F-46f — the edit dialogs
opened empty because the form initialized at page mount) was correct
on the open path but silently killed the exit animation for 25
sessions: the key flipped to "none" in the SAME batched render that
set open=false, so React UNMOUNTED the Radix Root instead of letting
it run its pinned `data-[state=closed]` chrome — the animation
existed in the CSS, was pinned by the tests, and never played once
in production. The pattern for dialogs needing BOTH fresh-per-open
state AND exit animations: keep the shell permanently mounted (no
outer key, no `{open && ...}` conditional) and key an INNER form by
an open-epoch counter — an adjust-during-render counter that bumps
ONLY on false→true transitions. Fresh state at open (the initializer
re-reads the live props), inert to parent re-renders while open, and
the full body animates out at close (the reference's own geometry —
its W7/wce/Mke and create dialogs render unconditionally, no keys).

**(2) Render-time values in keys are the WIPE bug class.** The
ActivityForm's create key `` `${defaultType}-${Date.now()}` ``
re-keyed on EVERY parent render — and all five consumer pages
destructure the whole store, so the first-load slice resolutions
were a guaranteed re-render source: any Log Activity typed before
the settles landed was silently wiped. A key must be a function of
STATE TRANSITIONS (the epoch), never of render-time computation.
The EventDialog's `defaultStart?.getTime()` looked safer (state-
derived) but shared the class — a re-created Date with a new time
mid-session would re-key too.

**(3) The reference's setState-in-effect is OUR lint error — the
adjust-during-render pattern is the sanctioned bridge.** The
reference syncs its permanently-mounted forms via
`useEffect([contact]) => setForm(...)` — an ERROR under this repo's
React 19 lint. The AppShell close-on-route-change idiom (a tracker
useState + a conditional set DURING render, re-rendered by React
before commit) achieves the same prop→state re-derivation with no
effect, no lint violation, and no waterfalls.

**(4) Bundle-decode beats live-probe when the reference has no
data.** The reference's demo workspace is permanently empty — its
edit dialogs cannot be opened LIVE at all (no rows to click). The
bundle is the ground truth for the close-path geometry: the W7 mount
carries NO key (`c.jsx(W7,{open:i,onOpenChange:a,contact:g,...})`),
the forms render unconditionally inside DialogContent, and the
isLoading wiring (`disabled:i, children: i ? "Saving..." :
"Save Changes"`) is visible in the minified props. Five of the
rotation's ten findings were resolved by bundle-decode alone.

**(5) Five of ten audit findings DISMISSED at validation — the
manual-validation gate is where false positives die.** L-2 (the
save-report footer "divergence") misread the component indirection —
our `<DialogFooter>` already renders the full stock string the
bundle confirms. I-2 (saved-view columns on Load), I-3 (account-
create phone type), L-3 (the slide-over's a11y), N-4 (tab
persistence) were each CONFIRMED PARITIES from the bundle — the
reference applies only filters on Load, ships an untyped phone
input, a plain fixed-div slide-over, and a persistent tab state.
The rule stands: every audit finding is validated at file:line (and
bundle-decoded when parity-bearing) BEFORE it enters a plan.

## 16bl. Session-72 Layer (the settings/profile seam rotation + the picklist-anatomy honesty)

The session-72 lesson quintet:

**(1) Pin the ITEM, not just the container — the S12-P8 misread
survived 71 sessions.** The picklist "chip rows — ALIGNED" record
was written from a probe that pinned the items CONTAINER (space-y-2
mb-4) and the ADD ROW (flex gap-2 + the dark Plus button) but never
the item row itself — so the scaffold-era chip pills (rounded-full,
border-line, bg-line-soft, an X-only remove) sailed through every
later session's drift sweep while the reference rendered BORDERED
LIST ROWS (`flex items-center gap-2 p-2 border rounded-lg
hover:bg-gray-50`) with a flex-1 name span + a Pencil inline-rename
(Input + Save + X) + a red Trash2. Zero `rounded-full` classes exist
in the reference's picklist — the 7 bundle hits are all
avatars/dots/pills elsewhere. The lesson is the s70
enumerate-the-family rule applied ONE LEVEL DOWN: a list surface has
three anatomies (container, item, add-row) and a parity probe that
skips the item row has verified nothing about what the user most
sees. The `ly` component decode (title/items/onAdd/onUpdate/
onDelete/isLoading, entity CRUD by id, `order: items.length` on
create) is the ground truth for the whole family.

**(2) The remount-key cost axis extends beyond dialogs — the
props-driven architecture eliminates the class.** The s46
JSON.stringify settings keys (`cfg-/def-${JSON.stringify(settings)}`)
fixed the length-collision hazard (F-46c) but remounted the editors
~RTT after EVERY own save: the focused input lost focus, a half-typed
next add-label was lost, continued typing past a debounce window
visibly dropped characters. The reference never has this problem
because its React-Query data swap re-renders PROPS without
remounting — its ly renders items straight from query data and keeps
only the TRANSIENT editing state (editingId, editingName, the
add-input value) local. Adopting that shape retired three s46-era
machines at once: the local lists copy, the guarded revert (a failed
PUT can no longer leave a phantom item — the props never changed),
and the remount keys. The single-key patch PUT (`updateSettings({
[key]: next })`) rides the route's per-key validation + the
full-settings response.

**(3) A DATA-RESOLUTION epoch is the s71 open-epoch pattern's
sibling.** Where a component needs local state initialized from a
late-resolving fetch, `key={settings ? "resolved" : "pending"}` gives
the reference's instant-render-with-fallbacks contract (AED/new/B/
3/month/monday until the fetch lands — mirror the reference's
`(l?.default_currency) || "AED"` family) with EXACTLY ONE remount —
the pending→resolved transition — and none on subsequent store
updates. The "Loading settings…" gates were an S25-P1 violation on
this page: the reference renders the Config tab instantly with
"No items yet" x5 and the Defaults tab with fallback values.

**(4) The raw-fetch census is a LIVING count — retiring an exception
is a fix, not just adding one.** Moving the profile PATCH into a
store `updateUser` action (call() envelope + the s64 session
write-guard + `set({ user: res.data })`) closed three surfaces at
once: the architecture principle (one store, one envelope — the user
IS server state), the reference's `t(await me())` contract (the
Account card + name update land in the PRE-RELOAD window; the PATCH
response replaces the me() round-trip), and the wrong-slice refresh
(fetchUsers refreshed the users LIST, not the user). The census
dropped nine→eight call-sites across seven endpoints — the store
header comment re-anchored in the same commit.

**(5) Input VALUES are not textContent — hasText locators stop
matching when a row swaps to edit mode.** The picklist e2e's rename
step timed out on a locator that had ALREADY matched its row: the
Pencil click swaps the row's span for an Input whose VALUE (not
text) carries the item name, so `filter({ hasText: "Probe Source" })`
resolves to nothing mid-edit. The fix is to re-scope interactions to
a stable ancestor (the card) for the edit-mode steps — the same
run-caught-mid-flight class as the s71 strict-mode anchor. Also:
`offsetParent` is null for FIXED-position elements (the drawer
probes must use getBoundingClientRect + the inert attribute), the
s70/s71 JS-click focus artifact still requires the snapshot-ref real
click, and the e2e-sleeps census now counts FIVE annotated windows
(the two 1200ms defaults-debounce settles).

**The operator decisions (session 72):** the CSV formula-injection
posture **(b) STANDS** (the 31st re-affirmation — the guard intact
in both export families, the bundle byte-stable for the 43rd
consecutive session, no CSV surface touched). The source-vocabulary
documented parity **STANDS AND EXTENDS to the settings/profile
seam** (the 72-b census re-confirmed every anchor; the session-72
fixes are UI-chrome anatomy, mount-mechanics, an enum retirement,
loading/spacing/icon/vocabulary parities, and e2e additions — the
picklist vocabularies themselves untouched; the S48-P2 string-array
data model stands under the new row anatomy).

**The gate:** RED 35 (the new settings-profile-parity suite's 25 +
the rewritten settings-rollback 4 + the body-pregate 13th-route it +
the re-anchored dch agenda enum + the page-layout itemRow/deleteBtn
pair... plus the two mid-flight lockstep re-anchors the runs
themselves caught: the s57 dch living-surfaces guard and the s43
api-robustness calendarView message) · non-vacuous in a pre-fix
0e40a09 worktree (35 failed | 473 passed — exactly the modified-pin
set) · lint 0/0 · tsc 0 · 1330/1330 unit (81 suites, +30) · build
clean · 122/122 e2e on a fresh CI=1 boot (3.0m, all 9 mobile-nav
checks green) · drift sweep #68 clean (the 43rd consecutive stable
bundle) · LIVE-verified (the bordered rows with the Pencil/Trash2
red pair + zero chips; the rename round-trip in place; the focus
SURVIVING the debounce flush with the PUT landing; the Data panel's
computed 24px; the four export icons; the profile upload → form-only
preview → save → the pre-reload Account-card img → the post-reload
topbar pickup; the drawer at TRUE 390px with focus restored; zero
overflow x10; NO Tailwind v4 bug; the closing census MATCH with the
probe photo cleared) · 2 screenshots VLM-verified 4/4 + 4/4 · docs
at SKILL v1.69.0 (this section + project_state) + README/AGENTS/
CLAUDE/PAD at 1330+122 (badge 1452) + session_138.md + the plan's
execution record + both worklogs.

## 16bm. Session-73 Layer (the topbar/search + row-menu family rotation)

The session-73 lesson quintet:

**(1) A "stock" class on an icon is not its rendered size — measure
the CASCADE.** The reference's Mail/Bell buttons carry icons with
`w-5 h-5` classes that COMPUTE at 16px: the stock Button base's
`[&_svg]:size-4` (specificity (0,1,1) — one class + one type
selector) beats the icon's own `.w-5` (0,1,0). Ours rendered a real
20px for 72 sessions because our Button base was missing the
`[&_svg]:size-4` member and every icon survey compared CLASS STRINGS,
never computed sizes. The live probe (`getComputedStyle(svg).width`
against the class list) is the only trustworthy instrument on the
stock-mirror surfaces — and the same cascade silently governs the
contact-detail close X (the reference's identical construction). When
completing a stock mirror, diff the FULL base string member-by-member,
then measure the rendered result.

**(2) role=dialog vs role=menu is a semantic parity surface, not an
implementation detail.** Our Popover-based Dropdown rendered the four
row-action menus as role=dialog with button children; the reference
ships real Radix DropdownMenus (five `Yg align:"end"` contents
bundle-decoded — 13 stock `$s` items). The difference a keyboard user
feels: no arrow-key roving, no menuitem semantics, no Enter-activation
contract. The migration is mostly mechanical (Menu/MenuTrigger/
MenuContent/MenuItem) EXCEPT the S46-P7 containment — React synthetic
clicks on DropdownMenu portals bubble through the React tree to
clickable TableRows exactly the way Popover portals do, so MenuContent
needs the same composed `props.onClick?.(e); e.stopPropagation()` AFTER
the `{...props}` spread (LIVE-proven: the accounts Edit item opens
ONLY the edit dialog — zero row-click ghosts). The Popover family
stays for the three surfaces with no reference counterpart (the
dashboard quick-create + export dropdowns, the leads Filters panel).

**(3) The reference's dead items and direct deletes are PARITY DATA,
not bugs to fix — but the supersets that guard users stay and get
documented in-code.** The contacts "Log Activity" item is dead in the
reference (`c.jsx($s,{children:"Log Activity"})` — no onClick, the
Convert-to-Opportunity twin); ours stays wired to the
ContactDetailPanel with the S29-P2-style comment. The reference's row
deletes are DIRECT (zero `window.confirm` in the bundle — the
mutations decode bare); ours keeps the confirm gates as the documented
safety superset, e2e-pinned on the calendar round-trip. The house
rule: mirror the dead affordance verbatim when it COSTS nothing
(Convert), keep the wiring when it is a superset's ENTRY POINT (Log
Activity), and keep safety rails that only ADD a confirmation step —
each with its in-code comment so the next audit reads intent, not
archaeology.

**(4) An e2e "negative" written from the ROUTE's code can be wrong
about the ROUTE's own whitelist — read the table, not the intuition.**
The upload-negative trio's third case was drafted as image/gif
"unsupported" — the run failed with only one rejection alert, and the
uploads dir told the truth: `81d38...gif` written, the upload
SUCCEEDED. `EXT_BY_MIME` whitelists gif (and webp); the genuinely
unsupported MIME is image/svg+xml. The lesson generalizes: when an
e2e assertion about server behavior fails, check the ARTIFACT the
server left (the file, the DB row, the log line) before re-reading
the test — the artifact is the server's own testimony about which
branch executed.

**(5) The audit agents find the family; the orchestrator's own
bundle-decode + live-measure finds the truth.** The 73-c rotation
flagged the mail/bell color (one gray step) and the raw-button
construction — but MISSED the 20px icon divergence (a computed-style
fact only a live measurement reveals) and the leads iconSm trigger
(the audit's file list stopped at the family files; the trigger lives
in leads-page.tsx). The three-layer validation the house already
runs — agent audit, orchestrator's manual file:line + bundle decode,
LIVE measurement — each catches a stratum the others cannot. The
LIVE-measured icon cascade and the bundle-decoded trigger size both
came from the orchestrator layer, after the agents had declared the
family "no High findings."

**The gate:** RED 38 (the topbar-rowmenu-parity suite's 26 [one
green-through-RED by window accident — the abort-gate pin's slice
includes the else-if's own gate text, the S49-P3 class] + the
page-layout re-anchors 6 + the dch trio + the calendar-cells Menu*
pin + the leads-inline pair + the route-case anchor) · non-vacuous
in a pre-fix 06e50f7 worktree (38 failed | 311 passed — exactly the
modified-pin set) · lint 0/0 · tsc 0 · 1356/1356 unit (82 suites,
+26) · build clean · 126/126 e2e on a fresh CI=1 boot (3.2m, all 9
mobile-nav checks green; THREE mid-flight e2e repairs the runs caught:
the dashboard route is "/" not "/dashboard"; the quick-create trigger
disambiguated via aria-haspopup among THREE "Add" buttons; the gif
whitelist discovery) · drift sweep #69 clean (the 44th consecutive
stable bundle) · LIVE-verified (the topbar sextet: header border
rgb(229,231,235) + mail/bell 36×36 with computed 16px icons in
gray-600 + the "Hi," label; the accounts menu role=menu with 3
text-only items + the red Delete; ARROW-KEY navigation Edit → View
Insights; the S46-P7 containment under the Menu family — Edit opens
ONLY "Edit Account"; the Profile item a real <a href="/Profile"> with
click-through; the leads trigger 36×36; the drawer at TRUE 390px
(8/8 links + focus trap + Escape + unlock + focus restored); zero
overflow ×10; NO Tailwind v4 bug (--blur-sm 4px + --shadow-sm exact);
the closing census MATCH) · 2 screenshots VLM-verified 4/4 + 4/4 ·
docs at SKILL v1.70.0 (this section + project_state) + README/AGENTS/
CLAUDE/PAD at 1356+126 (badge 1482) + session_140.md + the plan's
execution record + both worklogs.

## 16bn. Session-74 Layer (the reports-page family rotation + the period-semantics honesty)

The session-74 lesson quintet:

**(1) A filter's SEMANTICS live in the helper chain, not the label.**
"This Quarter" read as a calendar quarter for 49 sessions (three
session families pinned `startOfQuarter` as the parity); the reference's
single resolution site decodes `quarter -> bK(O,3)` where `bK(e,t) =
cK(e,-t)` is date-fns subMonths — a ROLLING 3-month window that
preserves the day-of-month AND the time-of-day, clamping month-ends via
the cK algorithm. "This Week" was the same trap one step shallower: the
plain `Zu(O)` (startOfWeek) with NO options resolves its `??0` chain to
SUNDAY — our explicit `"monday"` argument was the s72 calendar-surface
convention bleeding into the reports seam. The decode instrument that
works: grep the bundle for the SWITCH (`case"quarter"`), then follow
EVERY helper in the chain to its `function` definition before naming
the semantics. A label on a select is a string; the helper chain is the
contract.

**(2) The same derivation memo may power two pages with different
vocabularies — attribute before you pin.** The 3-status openLeads
(`["new","contacted","qualified"].includes(status)`) decoded mid-audit
looked like a reports-KPI divergence from our 2-status form; the
1,000-character context walk revealed it was the LEADS page's memo
(the minValue/followUpDate filter model), while the reports memo —
three memos later in the same bundle — ships the exact
`status==="new"||status==="contacted"` we run. Bundle-decode findings
are only as good as their ATTRIBUTION: always walk far enough back to
name the component before writing the pin.

**(3) One export button, two data shapes.** The reference's per-table
exports feed the CSV builder RAW rows (`_.amount||0`) but the PDF
builder FORMATTED rows (the dollar + toLocaleString template) — the
shared dB button component takes the formatted data while the
route-level f/d CSV closures each build their own raw arrays. Our
single-rows-both-consumers shape was half right on each surface. When
two consumers share a button, decode BOTH data pipelines — the button
is one component, the data is two.

**(4) A DOM measurement is not a class.** The spark slot's
`max-w-[176px]` record originated from a live probe that measured the
recharts wrapper's computed 176px — but that width was the flex-b
SHRINK of `flex-1` inside a fixed card, not any class on the slot. The
reference's slot is the bare `flex-1 h-12 mr-2`. The same lesson
replayed from the other side in the LIVE battery: the VLM flagged the
Won Deals value "wrapping" and the Reset button "on a separate row" —
both are the REFERENCE'S OWN rendering at 1440 (measured
byte-identical: bar rows 250/202/202/226/114 on both apps; the plain
div's natural word-wrap is the reference's exact construction).
Computed geometry proves parity; it never defines it.

**(5) The state that survives a dialog close is the state outside the
portal.** Our save-report dialog reset its name/columns on every open
(a prevOpen pattern, documented as "verified on every re-open"); the
reference's n3e holds its useState in the component that RENDERS the
Dialog root — outside the Radix portal — so the typed name survives a
cancel-then-reopen, and only the post-save clear resets it. The s25
live verification must have probed the post-SAVE reopen (where both
models agree). When auditing dialog state, ask WHERE the hooks live:
inside the Content (reset per open cycle) vs outside (persist) — and
probe the CANCEL path, not just the happy one.

## 16bo. Session-75 Layer (the accounts/contacts table-family rotation + the dead-affordance misread)

The session-75 lesson quintet:

**(1) A KPI's derivation is a data-model question, not a label
question.** The accounts "Overdue Activities" card counted raw overdue
ACTIVITIES for 47 sessions — a reading nobody questioned because the
label names the domain. The reference's memo decodes
`W=N.filter(te=>te.overdueActivities>0).length` — the count of ACCOUNTS
carrying at least one overdue item (`overdueAccounts`), a server-side
join its data model exposes per row (the same field the red
`border-l-4` row tint reads). The clone's KPI now derives the
distinct-accountId Set client-side. The instrument: when a KPI's value
looks like "a count of X", decode WHICH collection the memo filters —
the label describes the domain, the memo owns the semantics.

**(2) Computed "natural" derivations are inventions when the bundle
ships literals.** The five accounts sparkbars were per-industry bucket
memos — three near-identical useMemo loops with an in-code rationale
("industries are the natural six buckets for this workspace"). The
reference's five zv cards ship STATIC 6-value chartData literals
(`[50,60,55,70,65,75]` blue … `[30,35,40,38,42,45]` red) — demo chrome
that never moves. A computed derivation that "looks reasonable" is
still a divergence the day the workspace's industry count drifts from
six; the literals are pinnable constants. The instrument: grep the
bundle for `chartData:[` — every literal array is a pin, every
computed series needs its own decode.

**(3) A dead-affordance CLAIM can itself be the misread.** The s6-era
comment on the contacts Name header asserted "w-64 cursor-pointer with
NO sort icon (dead affordance mirrored)" — and the dead th survived 69
sessions behind that comment. The reference's th decodes a LIVE sort:
`onClick:()=>te("name")` + the inner `flex items-center gap-1
hover:text-blue-600 transition-colors` div + the directional chevron
(only while active). The cursor-pointer class was the tell nobody
read — dead affordances don't ship pointer affordances. The instrument:
when a comment claims the reference ships something DEAD, grep the
bundle for the surface's handler before mirroring the deadness — and
treat a `cursor-pointer` on a "dead" element as a contradiction to
resolve, not a quirk to copy.

**(4) WHICH array a stat reads is as parity-bearing as the math.** The
four contacts stat cards computed correct numbers — from the FULL
contacts array. The reference's G memo reads F, the FILTERED memo: a
filter that empties the table empties the cards. And "Top Decision
Makers" counted `role === "Key Contact"` alone where the reference
counts the both-roles union (`"Decision Maker" || "Key Contact"` — the
CONTACT_ROLES vocabulary's two power roles). The instrument: pin the
SOURCE ARRAY + the full predicate, never just the arithmetic.

**(5) Sweep by CONSTRUCTION, not by surface name.** The s17 checkbox
sweep declared "the reference ships button-role checkboxes on EVERY
filter rail (accounts tiers / calendar types+dates / activities
Activity-Type + the by-type footer)" — and it swept exactly those
rails. The contacts kke PANEL — a checkbox GROUP surface called a
"panel" instead of a "rail" — kept its native `<input type="checkbox">`
elements for 58 sessions, one `type="checkbox"` grep away. The same
lesson found the sixth group: the panel shipped five of the reference's
SIX checkbox cards (Engagement Level missing — its filter clause
documented nowhere). The instrument: after any primitive re-derivation,
census the CONSTRUCTION repo-wide (`grep -rn 'type="checkbox"' src/`)
— the surface's NAME is not its class.

**Plus the alias-resolution trick this rotation added to the playbook:**
the empty-state icon `RB` was an unresolvable chunk import until
`grep -o 'RB=[^,;]*'` decoded `RB=tr("CircleUser")` — the lucide
re-export line. Bundle aliases that stall a decode often resolve at
their ASSIGNMENT (`X=tr("Name")` for icons, `X=e.exports` chains for
components); grep the alias as a DEFINITION before declaring it
unresolvable.

The rotation's standing set: the insights-dialog stat icons stay
UNRESOLVABLE in the cached bundle (the Wc/op/q0 aliases carry no
displayName and no assignment decode) — the s28-era icons keep with the
documented-unverifiable posture; the trailing w-12 pair completes the
table-family widths (leads already shipped w-12 — its :553 pin stands).


## 16bp. Session-76 Layer (the activities/calendar rotation + the bundle-beats-live-read lesson)

**What shipped:** the family's first dedicated rotation (the session_145
suggested target) found the N-76 family — 14 M + 10 L + 5 N, every claim
manually validated at file:line and BUNDLE-DECODED (the component
identities: activities = JSe/gm/vx/Rce/Lce/QSe/Mce, calendar =
jAe/Mx/_Ae/SAe; the icon aliases resolved at their tr("Target")/
tr("Users") assignment lines — the s75 playbook trick). The decisive
fixes: the KPI STATICS extension (the gm/Mx literals — the dashboard's
"NEVER feed these cards real" rule now covers all ten family cards), the
two row-family rebuilds (the vx priority rows + the Rce timeline — both
inventions from the scaffold era, both now the reference's own
constructions), the TODAY-PILL correctness bug (white-on-white after any
selection — 61 sessions), the UNTRIMMED 42-cell grid, the desc event
ordering, the 7-day/scheduled/slice-5 upcoming window, the
weekday-bullet agenda format + the description line, the
blue-both-modes Event submit with "Update Event", the CONDITIONAL Name
field (Event.relatedName added at the model), the five s15-missed
placeholders, the five-option Activity type select with the
preset-rides-the-submit semantics, the calendar-day bucket boundaries,
the RAW-basis calendar KPIs, the radio Date rail, and the
opportunities-consumers e2e (the bundle verdict: there is NO
/opportunities surface on either app — the entity feeds its consumers;
ours mirrors every consumer + the list-only route).

**The falsified pins this rotation corrected (the bundle-beats-live-read
lesson, twice more):** (1) the s15 "zero placeholder attributes in every
dump" pin — the bundle carries FIVE placeholders the live dump missed
(Event Location, the two Select-type SelectValues, the Activity
Description, the Activity Related Name); the S30-P2 John Doe precedent
repeated. (2) The s15 "edit keeps the dark superset — unverifiable"
claim on the Event submit — the bundle decodes `bg-blue-600
hover:bg-blue-700` in BOTH modes with the "Update Event" label. The
instrument: a LIVE read at zero data is evidence of the RENDERED state
only — the bundle's construction covers the states the live app never
entered (edit mode, a chosen related type). The same class as the s75
"dead affordance" misread: label the claim with its evidence class, and
re-derive against the bundle before pinning "unverifiable".

**The statics decision extended (the KPI_STATICS precedent):** the ten
family stat cards join the dashboard's static-delta/static-bar family —
ACTIVITY_KPI_STATICS + CALENDAR_KPI_STATICS in page-layout.ts carry the
literals verbatim (+23% / Due now + 2h overdue / +7 today / +4 today /
+1h 12m / the six 6-value bar arrays / +3/+34/+2/+3). The gm color map
has NO purple arm — "purple" falls through to gray-400, so the Meetings
bars are GRAY (CHART_COLORS.gray #9ca3af, byte-equal), and WhatsApp's
"green" is the SAME green-400 as Calls Logged (#4ade80 — the green-500
we shipped was one step dark). The VALUES stay live (the counts derive
from the filtered/raw sets per the decoded memos).

**The overdue boundary + the row caps + the vocabulary:** the reference
buckets overdue at `date < startOfToday` (NOT `< now` — a 9am-due
activity stays Due Today at 3pm), caps upcoming/completed at 5 with NO
cap on overdue/dueToday, and its rail Status select lists exactly
Last 7 Days / Last 30 Days / Last 90 Days (7days/30days/90days — the
select is dead on the reference; ours filters for real, the s8
dead-select precedent, on the mirrored vocabulary).

**The preset-rides-the-submit quirk (mirrored, documented):** the
reference's quick-log opens the SAME dialog for all four types with the
form's type starting "Call"; the chosen preset is applied at SUBMIT
(`onSubmit: N => mutate({...N, type: i || N.type})`) — changing the
select under an active preset is silently overridden (the reference's
own quirk). Our ActivityDialog mirrors the construction (the form
starts "call"; the create submit applies `defaultType || form.type`;
edit mode keeps the form's type). The WhatsApp preset is therefore
INVISIBLE in the five-option select — exactly the reference's behavior.


## 16bq. Session-77 Layer (the leads-page rotation + the statics-vs-state honesty)

**What shipped:** the leads-page family's first dedicated rotation (the
session_147 suggested target — the s29/s31-era interactive table never
rotated before) found the N-77 family — 4 M + 6 L + 7 N, every claim
manually validated at file:line and BUNDLE-DECODED (component
identities: Qke page + Gke popover + Sm card + Xke charts + Tke create
+ Mke edit; the icon aliases resolved at their tr() assignments —
Wc/op/MB/BQ/nJ/qd/l_ = TrendingUp/Target/CircleCheckBig/CircleX/
Percent/Calendar/ArrowUpDown). The decisive fixes: the STATIC
ArrowUpDown on the sortable headers (the s29 "active sort flips to a
directional chevron" pin was bundle-falsified — the flip is the
CONTACTS page's s75-P6 behavior; the leads headers ship the static
glyph in a bare flex items-center gap-2), the won-vs-lost rewrite (the
reference's r-memo: created-date buckets, "Oct 2026" labels, insertion
order over the merged sort, slice(-6)), the Loading... row (the
reference's A ternary — a text row while the first fetch is in flight,
the s76 "Loading activities..." precedent), the edit-dialog submit's
dark DIALOG_SUBMIT fix (the one blue outlier in the edit family), the
"Creating..." create labels, the Sm chip-pair anatomy
(STAT_CHIP_PAIRS + the responsive icons + the gray-600/gray-500
label/subValue + the cyan Avg-cycle + the $${toLocaleString()}
subValues), the min-value RAW-STRING semantics (a typed "0" is ACTIVE
and excludes zero-value leads — the reference's own truthy-string
quirk), the untrimmed search, the raw code-unit comparator + the
always-asc new-key toggle, the popover's shadow-md/sideOffset-4 chrome,
and the select-trigger CLICK focus ring (the S10-2 pin's model
corrected — the reference's stock trigger is plain focus:, unlike the
Input/Button bases which are focus-visible on BOTH apps).

**The bundle-beats-pin lesson (the third instance):** the s29
chevron-flip pin and the S10-2 "keyboard-only focus-visible" pin both
survived 48+ sessions because they were pinned from a LIVE read of the
zero-data app — the states the live read could not enter (an active
sort, a mouse-click focus) hid the divergences. The bundle's
construction covers all states. The standing rule (s75/s76): label
every pin with its evidence class, and re-derive "unverifiable"
claims against the bundle before pinning them.

**The raw-string filter semantics (the reference's own quirk,
mirrored):** the min-value filter stores the input's RAW STRING and
compares `!g.minValue || (X.value && X.value >= parseFloat(g.minValue))`
— a typed "0" is a TRUTHY string, so the filter activates AND excludes
zero-value leads (the `X.value &&` guard fails them on any active
min). Fractions are not floored. Our pre-s77 integer floor + the
`minValue > 0` skip silently diverged on all three axes.

**The N-77c11 scope decision:** the reference's stock SelectTrigger
base carries BOTH `w-full` and plain `focus:` — our pin was wrong on
both counts, but every current surface computes equal widths (our
per-surface w-full additions compensate), so the fix scoped to the
FOCUS classes only (SELECT_TRIGGER.focusRing — the ring now fires on
mouse click, LIVE-verified rgb(10,10,10) 1px); the per-surface w-full
model stays documented. The N-77c17 stock-TableHead token question
(text-muted #6b7280 vs the reference's text-muted-foreground #737373 —
one shade on EVERY table) is DEFERRED to a future session: a
family-wide token-role change needs its own sweep + live probe.

**The stale-header repair:** the SKILL.md version header had been
stale since session-70 (v1.70.0 in-file while the s71-s76 records
carried v1.71.0-v1.73.0 nominally) — repaired to v1.74.0 this session;
the historical in-section version mentions stay as records.

## 16br. Session-78 Layer (the dashboard rotation + the raw-height bars)

**What shipped:** the dashboard family's first dedicated rotation since
the KPI_STATICS adjudication (the session_149 suggested target) found
the N-78 family — 2 M + 3 L + 4 N, every claim bundle-decoded from the
fresh reference (the Eke component's g/p/m/b/y/x/_/A memos) with the
bar construction additionally LIVE-PROBED on the reference itself
(heights 40%..75% on the 32px container, radius 4px). The decisive
fixes: the KPI BAR-SPARK construction (the reference renders the RAW
static values as percentage heights — `style height ${v}%`, the max bar
tops at 75%, NOT 100%; `flex-1 rounded-sm` bars; NO normalization, NO
floor, NO opacity — the s75/s76 statics families had pinned the ARRAYS
but left the height formula invented on BOTH the dashboard's three bar
cards AND the BarStatCard twin's eleven accounts/activities cards), the
FILTER-BAR RE-DERIVATION semantics (the reference's `p` memo — the
stage/source-filtered opps — feeds the Deals Closed + Revenue This
Month KPIs, the pipeline chart + its legend, the Top Reps list, and the
Recent Deals rows (the full-list updatedAt-desc sort, slice 5); ours
filtered only the pre-sliced table rows, so the KPIs never moved — the
five derivations moved client-side onto the store's opportunities slice
with the route's unconsumed copies + the daysUntil wire-extra retired),
the Recent Deals TRAILING ghost button (a MoreHorizontal h-8 w-8 per
row — invisible at the reference's zero data, the bundle-only evidence
class), the UPCOMING window (the reference's `list("-date", 10)` ->
filter date >= now -> slice(0,3), NO status filter — ours shipped
all-scheduled-asc slice 6; the seeded data shows the delta LIVE: the
3-furthest-desc, not the 6-soonest-asc), the ACCOUNTS LOADING ROW (the
M-77c3 missed sibling — the reference's colSpan-8 ternary, the s77
leadsLoaded precedent applied to the sibling page), the upcoming row
subtext (`relatedName` bare — the `?? a.type` invention retired), the
Recent Deals row classes (`border-b hover:bg-gray-50` — our
--color-background #f9fafb is the computed-equal; the
transition-colors + row text classes retired), and the KPI_SPARK
record's re-derivation (a `bars` member; the stale "all sparks are
recharts curves" comment corrected — the family is MIXED).

**The normalization-is-an-invention lesson (the fourth
bundle-beats-live instance):** the s75/s76 statics fixes pinned the
literal ARRAYS but nobody re-derived the HEIGHT FORMULA — the v/max
rescale felt so natural ("make the max bar fill the container") that it
survived two dedicated rotations plus a live re-capture, even though it
makes EVERY bar 33% taller than the reference's. The live probe only
catches it if you measure the PIXEL height of a bar against its
container (12.8px on a 32px rail = 40%, not 100%) — a bare screenshot
comparison passes. The rule: when a component consumes NUMBERS, pin the
number's TRANSFORMATION, not just the number (the s68 "pin the branch
selection at the consumers" lesson, extended to geometry).

**The dead-state-memo lesson:** the reference's filter bar re-derives
half the dashboard through `p` — but at its persistent zero data, every
filter selection is a no-op, so 73 live reads never saw it. The bundle
is the only evidence class for memo-level semantics; a memo that only
diverges under USER STATE (a selection, a sort, a typed filter) needs
its bundle decode BEFORE its live probe is trusted. The same class: the
Recent Deals trailing button (zero rows = zero buttons on the
reference) and the upcoming window's quirky 3-furthest-desc slice.

**The s77 missed-sibling completion:** the accounts Loading row shipped
the same session-cycle the leads one did NOT cover — the s77 rotation
was family-scoped (correctly), but its M-77c3 finding described a
PATTERN (the reference's `b ? Loading : empty : rows` ternary) that
manifests on every table page with a first-fetch. The s78 rule: when a
fix lands on one page, grep the PATTERN across the sibling pages the
same session — the accounts page needed the identical 6-line fix and
waited a full session for it. (The contacts page's own table did NOT
carry the pattern — its empty state is the s75 rich stack, and no
Loading ternary decodes near it — verified before extending the fix.)

**The stale frontmatter repair (78-b's census finding):** the SKILL's
YAML frontmatter (`version:` / `last_updated:`) never rode ANY of the
version bumps — the s77 "stale header repair" fixed the H1 but left the
frontmatter at s76's 1.73.0. Both now bump together with every layer
(pinned going forward by this record).

## 16bs. Session-79 Layer (the login-family rotation + the N-77c17
TableHead adjudication)

**What shipped:** the login/signup card family's FIRST dedicated
rotation (the session_151 suggested target — never rotated; the card is
PLATFORM code, not app-bundle code: zero auth markers exist in the
1.63MB bundle, so every claim was LIVE-EXTRACTED from the reference at
1440 AND 390 and cross-probed on our own dev server) found the N-79
family — 5 M + 6 L + 5 N (incl. the folded-in N-77c17 adjudication +
79-b's CLAUDE.md census finding). The decisive fixes: the AUTH
TEXT-SIZE LADDER (the reference's auth inputs/submits compute 14px at
desktop — the stock `text-base md:text-sm` on the signin/reset inputs,
`text-sm` on all four submits, and the SIGNUP inputs' three-rung
`text-sm sm:text-base` riding the stock `md:text-sm` [14px <640 /
16px 640-767 / 14px >=768]; ours shipped a flat 16px everywhere —
LIVE: 14px vs our old 16px at 1440); the BACK-BUTTON OVERLAP (the s21
"-mb-2 mirrors verbatim" claim v4-FALSIFIED — under our :where(space-y)
margin-BOTTOM model the own class WINS and computed an 8px OVERLAP
[LIVE: -8px] where the reference computes +8px at BOTH widths; the
reset view's ladder is 8px <640 / 16px >=640 [LIVE-measured on both
apps] — `mb-2` / `mb-2 sm:mb-4` are the v4-correct expressions); the
VERIFY-EMAIL ShieldCheck GLYPH (the s21 pin wrongly recorded the sent
view's Mail — the reference's tile is lucide-shield-check slate-700);
the AUTH FOCUS RING (a SOLID slate-400 2px ring + a 2px WHITE offset —
computed `rgb(255,255,255) 0 0 0 2px, rgb(148,163,184) 0 0 0 4px` on
the reference; ours shipped a 30%-opacity ring with no offset); and
the N-77c17 TABLEHEAD adjudication (deferred since s77 — the
reference's stock th is `text-muted-foreground` computing
rgb(115,115,115) on every table [live-probed]; our computed-equal token
is `text-muted-ink` #737373 — the `text-muted` #6b7280 retired
family-wide, per-surface th overrides unaffected).

The L/N set: the missing MOBILE SPACER (every reference auth view
ships a trailing `mt-8 text-center text-xs text-slate-400 sm:hidden`
nbsp spacer inside the max-w-md wrapper — 16px + the 32px margin at
390); the VERIFY view's missing HINT LINE (`text-xs text-slate-500
text-center mt-3` "Enter the verification code sent to your email"
riding the SAME plain wrapper div as the codeWrap — the mt-3 must not
ride the form's space-y, margin collapse would eat it); the verify
STACK/FORM spacing (its own `space-y-4 sm:space-y-6` pair — ours
shipped the signup's tighter families); the INPUT-ICON COLOR SPLIT
(the signin icons slate-500; the reset/signup icons the LIGHTER
slate-400); the CODE-INPUT EXTRAS (the flat stock mirror — the
scaffold-era shadow-sm / transition-colors / ring-offset-2 retired);
the SUBMIT CHROME (disabled:pointer-events-none disabled:opacity-50 +
the keyboard focus-visible ring); the CALLOUT TEXT NODES (the
reference's callout text is a BARE text node — the `[&_p]` arm stays
inert; our `<p>` wrappers retired); the dead `LOGIN_VERIFY_LAYOUT
.back2` member (the dch policy); and 79-b's CLAUDE.md:115/:299 stale
"(131 checks)" pair (the N-50a class — three realignments missed the
e2e-carrier lines).

**The audit lessons:** (1) a PLATFORM page's parity evidence is the
LIVE DOM + computed probes, never the app bundle — the login card
lives in the base44 shell's runtime chunks, and the rotation's first
move (bundle grep) found zero markers. (2) A documented v3->v4
"computed-equal" claim that was never LIVE-measured is a hypothesis,
not a pin — the s21 -mb-2 analysis reasoned correctly about v3 but
asserted the v4 result without measuring it; the overlap hid for 58
sessions behind a green pin (the fix: measure the gap on BOTH apps
before writing the pin). (3) A desktop-only probe of a RESPONSIVE
class (`mb-4` for the reference's `16px gap`) misses the mobile rung —
always probe both ends of a responsive expression.

## 16bt. Session-80 Layer (the profile rotation + the hover-variant
un-wrap)

**What shipped:** the profile page's own surfaces' FIRST dedicated
VISUAL rotation (the session_154 suggested target — never rotated:
s13 pinned PROFILE_LAYOUT, s30 the photo flow, s72 the store/API
seams; nobody had walked the page's DOM + computed styles against the
live reference at 1440 AND 390) found the N-80 family — 2 M + 1 L +
2 N (incl. 80-a's stale-comment remnant + 80-b's three stale doc
carriers). The decisive fixes: the M-80c1 NEUTRAL-900 HOVER ALPHA
ARMS (the reference's dark-primary surfaces ship ALPHA hovers — its
stylesheet literally reads `.hover\:bg-primary\/80:hover
{background-color:hsl(var(--primary) / .8)}` with --primary #171717;
LIVE hover-probed: the profile role badge settles rgba(23,23,23,0.8),
the profile Save rgba(23,23,23,0.9), the dialog submits + the settings
picklist Add buttons carry the class-decoded hover:bg-primary/90.
OURS shipped SOLID `hover:bg-neutral-800` (#262626 = rgb(38,38,38)) on
ALL FIVE carriers — badge.tsx's default variant, PROFILE_LAYOUT.badge,
DIALOG_SUBMIT.button [8 call sites], SETTINGS_PICKLIST.addButton, and
the profile-page inline Save. The s66 badge translation miscalculated
the alpha math (0.8x23 + 0.2x255 = 69.4 ~= #454545, NOT #262626 — the
same genus as the s21 "-mb-2 verbatim" v4-math error): the solid arm
renders rgb(38,38,38) where the reference renders rgb(69,69,69)
[badges] / rgb(46,46,46) [buttons] on EVERY hover. The computed-equal
expressions: `hover:bg-neutral-900/80` [badges] + `/90` [buttons]); and
the M-80c2 HOVER-VARIANT UN-WRAP (THE Tailwind v4 bug of the session —
the fourth member of the v4 shadow/blur/space-y re-pin family: v4
compiles every `hover:` utility inside `@media (hover: hover)`
[CSSOM-walked live: our .hover\:bg-neutral-800:hover rode TWO
(hover: hover) blocks], so ALL our hover affordances no-op on
hover-incapable devices — touch users never see a single sticky-hover
wash. The reference's v3-era compiled stylesheet (79,581 bytes)
contains ZERO (hover: hover) media queries — every hover rule is a
BARE :hover selector. LIVE-PROVEN on the divergence: with the mouse
parked over our role badge (:hover matching, polled true for 1s) the
computed background stayed #171717 — the rule never fired in a
hover:none environment where the reference's identical probe computes
rgba(23,23,23,0.8). The fix is ONE top-level line after the imports:
`@custom-variant hover (&:hover);` — restoring the reference's v3
semantics family-wide AND making the alpha arms LIVE-exercisable in
the headless battery [post-fix: our badge hovers at
oklab(0.205.../0.8), the save/dialog/add buttons at /0.9 — the
reference's values exact, verified in the hover:none environment that
could not exercise the wrapped rules at all]).

The L/N set: the L-80c3 PROFILE EMAIL INPUT TYPE (the reference's
disabled email input renders type="email" — Full Name + Role stay
text like ours; ours shipped type="text": a DOM attribute diff with
autofill + password-manager + a11y-role semantics); the N-80c4 S21
COMMENT REMNANTS (the login-reset.ts file header still asserted the
LIVE-FALSIFIED "-mb-2 verbatim / computes 8px under BOTH v3 and v4"
claim + login-card.tsx:305 still read "the -mb-2 back button" — 80-a's
nano note, both retired with the s79 records); and 80-b's three stale
doc carriers (CLAUDE.md:38 + :125 at 1523 + PAD:772 at 87/1523 — the
N-50a class, three realignments missed them).

**The documented parities pinned green (N-80c5):** the three info-card
values' `text-foreground` (BOTH apps compute rgb(10,10,10) — the s73
foreground re-pin made the class the computed-equal of the reference's
inherited card-foreground); `text-muted` vs its `text-gray-500` (both
#6b7280); the outline button's `bg-surface`/`border-line` vs its
`bg-background`/`border-input` (white/#e5e5e5 both, live-probed); its
`hover:bg-accent hover:text-accent-foreground` pair (the accent =
#f5f5f5 = our line-soft; the text arm a no-op over the resting
#0a0a0a); the chips' inline-style vs class expressions
(computed-equal); the Account card's flat-80 avatar vs the form's
80/96 ladder; the gap stack (h3->p 0, p->badge 8px via mt-2); the
390px responsive set (upload/save w-full 308px, grid-cols-1, zero
overflow — measured identical on both apps).

**The audit lessons:** (1) a STYLESHEET is a parity surface like the
DOM — fetching the reference's compiled CSS and decoding it settled in
minutes what three sessions of class-string translation had gotten
wrong (the /80-vs-800 question never needed probing once the literal
rule `hsl(var(--primary) / .8)` was in hand). (2) An ALPHA-TRANSLATED
hover ("bg-primary/80 ~= neutral-800") is a hypothesis until the
blended value is computed — the same measure-both-apps rule as the s79
gap lesson, now extended to color math. (3) v4's variant COMPILATION
SEMANTICS (not just its renamed scales) are a parity surface: the
(hover: hover) wrap silently disabled every hover affordance on touch
— a divergence no desktop probe can see, caught only by walking the
CSSOM media context of a live rule.

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

## 16av. Session-56 Layer (the orphaned-import sweep + the dead-module retirement)

The N-56 family closure: the 56-b fresh-eyes census found TWELVE more
lint-invisible orphaned imports across six files — contacts ×6 (Pencil,
Avatar, DropdownSeparator, FILTER_RAIL, ENGAGEMENT_LEVELS, timeAgo),
accounts ×1, activities ×2, the dashboard ×1, the reports route ×1
(addMonths, orphaned since s31), charts ×1 (the dead-since-initial-commit
`import * as React`) — each with exactly one in-file reference (the
import itself). Root cause unchanged from s53/s55: eslint has BOTH
no-unused-vars rules off, so only source-reading pins catch the class.
Plus the dead-surface retirements: page-parts' CardCaption (fully dead
since the initial commit), the whole app-authored ui/misc.tsx module
(its sole export EmptyState was s25-stranded; the loading-layer
Skeleton pin re-anchored to the module's ABSENCE — the strongest form
of the no-Skeleton contract), and format's addMonths (the seam went
TEST-ONLY when the reports route's import narrowed — the s55 N-55b
class, its one stale it retired with it).

**The operator decisions (session 56):** (1) the CSV
formula-injection posture **(b) STANDS** (the bundle byte-identical
for the 27th consecutive session). (2) The source-vocabulary
documented parity **STANDS AND EXTENDS** to the N-56 family WITH ONE
EXPLICIT BOUNDARY: the retirement policy covers APP-OWNED vocabulary
but NOT the vendored ui stock-surface mirror — unused stock exports
(CardDescription, CardFooter, DialogClose, DialogTrigger,
DropdownLabel, SelectGroup, SelectLabel, SelectSeparator) stay
exported because the mirror's completeness is part of the parity
contract (the s10 stock-primitive layer) and tree-shaking keeps the
bundle byte-identical. **The KEEP is pinned by a guard test** so the
boundary is durable — a future session cannot silently retire the
stock surface without failing it.

**The audit corrections (the manual-validation value):** two claims in
the 56-b report were corrected at validation — timeAgo is NOT test-only
(activities-page consumes it live; only the contacts import narrowed)
and addMonths IS (zero src consumers after the narrowing). Both folded
into the plan before RED.

**The fixes (S56-P1..P4, RED-first):** the twelve-import narrowing
with per-file record comments (P1); the CardCaption + misc.tsx +
addMonths retirements with the loading-layer re-anchor + the stale it
retired (P2); the stale it-title corrected (P3); the docs carriers
(P4). RED: the dead-code-hygiene session-56 describe (6 RED + 2
guards) + the re-anchored loading-layer it — exactly 7 failures; full
suite 7 failed / 1184 passed (1191 total). Non-vacuousness: 7 failed |
49 passed in a pre-fix `f7ca140` worktree (hard-linked node_modules);
56/56 on the three touched suites at the fix. **Gate:** lint 0/0 ·
tsc 0 · 1191/1191 unit (75 suites, +8 −1) · build clean · 112/112 e2e
on a fresh CI=1 boot. **LIVE:** the fix surfaces render (Contacts 15
rows, Activities with its chart, the Dashboard KPI row); the drawer
both directions at a TRUE 390px; zero 390px overflow ×10 routes; NO
Tailwind v4 bug; zero probe residue through the seam (db:census
MATCH). **Screenshots:** 02/11/12 re-captured + 65-contacts-page NEW
(the six-orphan narrowing surface). All VLM-verified.

**§16av lessons:** (1) A fresh-eyes orphan census must sweep the FULL
import surface of every high-churn file, not just the files the last
sweep touched — the s53/s55 sweeps each found orphans in files the
other never read. (2) When an import narrows, re-run the liveness
census on the underlying export BEFORE deciding its fate — one
orphaned import does not make an export dead (timeAgo), but removing
the LAST src consumer does (addMonths): the seam's test-only status is
a PROPERTY OF THE CLOSURE, not of the helper. (3) An operator-decision
boundary is only as durable as its pin — the stock-mirror KEEP would
be re-litigated every session without the guard test that now fails on
any retirement attempt. (4) A negative pin that reads a file can be
re-anchored to the file's ABSENCE when the module retires — the
strongest assertion of the same contract (the s54/s55 re-anchor
precedent applied to a file-level pin).

## 16aw. Session-57 Layer (the dead-surface narrowing + the comment-accuracy carriers)

The N-57 family: the 57-b fresh-eyes sweep (21 not-recently-swept files
read in full) found the orphaned-import class's PROP and EXPORT variants
— dead surfaces that survive every import sweep because they are not
imports at all.

**N-57c (the PROP variant — the headline)**: profile-page passed
`usersTotal={users.length}` and typed it in ProfileForm's props, but the
form never destructured it — dead since s10, invisible to eslint (both
no-unused-vars rules off, and a typed-but-unread prop is not even an
unused-var), invisible to the import sweeps (it IS consumed — by a
prop type). The tell: the `users` store destructure existed SOLELY to
feed it. Retired: the prop, the type entry, and the destructure — the
`fetchUsers` onSaved refresh stays LIVE, and the store's users slice
keeps its live write path (hydrate + the refresh). Scope discipline:
the store slice itself is NOT dead surface — its write path is live
production code.

**N-57b (the EXPORT variant)**: uploads.ts's `export const
UPLOADS_DIR_NAME` — zero external consumers repo-wide, but the constant
is alive (uploadsDir()'s repo-root resolution consumes it internally).
The narrow: drop the `export` keyword, keep the constant. The
distinction matters: retiring the CONSTANT would break the live
consumer; retiring the EXPORT removes only dead surface.

**N-57a + the 57-a corrections (comment-accuracy, the chronic
sibling-carrier class)**: the nav-config footer comment said "not
pinned to the bottom" while the live footer pins via `mt-auto` (stale
since the s7 re-pin — the line dated to s3); the s56 record comments
attributed Avatar's consumption to profile (profile hand-rolls its
avatar spans; the real consumer is accounts-page); page-parts' record
comment said "seven living exports" where the file has ten (the guard
pins the seven load-bearing ones). Comments are carriers too — a wrong
attribution in a record comment sends the next session's liveness
census to the wrong file.

**§16aw lessons:** (1) The orphaned-import class has PROP and EXPORT
variants — a dead-surface census that only reads import blocks misses
props that are passed-but-never-read and export keywords with zero
external consumers. Sweep the JSX prop surface and the export list too.
(2) "Alive" has two independent axes — the VALUE (the constant, the
prop type) and the SURFACE (the export keyword, the passed prop). A
surface can be dead while its value is alive; narrow the surface, keep
the value. (3) A store slice with a live write path is not dead surface
even when no component reads the state — the fix narrows the dead UI
read, not the store architecture. (4) Record-comment accuracy is a
finding class of its own: the 57-a audit found the Avatar misattribution
by actually grepping the consumers the comment named. Verify record
comments like code — they steer future sessions' censuses.

## 16ax. Session-58 Layer (the dead-surface narrowing + the type-contract boundary)

The N-58 family: the 58-b fresh-eyes sweep (24 not-recently-swept files
read in full — the API routes, the store, the api/auth/rate-limit libs,
topbar/sidebar/app-shell — plus three repo-wide mechanical censuses:
orphaned imports ZERO across all 104 src files, never-caching memos ZERO
across all 17 sites, unread props ZERO) found the dead-surface classes
the s57 §16aw lesson predicted, in two new variants:

- **N-58a — the ALIAS export.** `export { call as apiCall };` in
  crm-store.ts: the ONLY repo-wide `apiCall` reference was the export
  line itself. An alias export is doubly misleading — it implies an
  external consumption convention (`apiCall` from the store) that never
  existed, under a name nothing ever used. Dead since the initial
  commit; it survived 14 sweeps because the store file was never in an
  import-sweep file set. RETIRED (the whole alias line; `call` stays
  the internal engine of every store action).
- **N-58b — the definition-only TYPE exports (the fully-dead class,
  TYPE variant).** Four exports whose ONLY reference repo-wide was the
  definition itself — not even their own file consumed them: the types
  barrel's `SearchResult` interface (DOUBLY dead: zero consumers AND
  shape-inaccurate — it claimed full `Account[]/Contact[]/Lead[]`
  entities while the live topbar consumes its own slimmer inline row
  shape `{ id, name }` + the leads' stage/value; a type can document a
  surface that never existed in that form), plus constants.ts's
  `LeadStage`/`ActivityType`/`EventType` derived types
  (`(typeof ARRAY)[number]` with zero non-definition references — the
  `defaultLeadStage` settings FIELD is a different identifier). All
  four RETIRED per the s48/s49/s54 policy. The SKILL §20 carrier
  followed the code.
- **N-58c — the module type-contract boundary (the KEEP).** ~20 export
  keywords with zero EXTERNAL consumers but the values/types alive
  INTERNALLY (api.ts ApiError/ApiResult via the `satisfies`, auth.ts
  SESSION_TTL_MS/SessionPayload, crm-store CrmState via
  `create<CrmState>`, format.ts formatDateShort via timeAgo,
  page-parts DeltaText/DeltaBadgeText via the in-file siblings,
  rate-limit RateLimitResult, the reports-data row types, …). The
  s58 operator decision: these KEEP — they are each module's declared
  contract surface (consumable types/values for future callers, the
  idiomatic module design), not dead code; wholesale narrowing buys
  zero behavior and re-creates the comment-churn treadmill on the
  just-corrected s57 carriers (page-parts' ten-living-exports count).
  PINNED by the session-58 guard test so the boundary survives future
  sweeps — the N-56e mechanism (documented + guard-pinned KEEP, never
  a silent one) applied to app-owned modules.

Plus the 58-a correction: the s57-corrected "activities-page:384" line
citation in dead-code-hygiene.test.ts was already off by one at HEAD —
the s57 comment correction itself grew the activities comment block by
one line, self-shifting the token to :385. The chronic self-shift
class, second generation: a line-citation refresh can be invalidated by
the very edit that refreshes it when the citation and the cited file
share a diff. The fix cites :385.

**§16ax lessons:** (1) The fully-dead class has a TYPE variant — a type
export with zero references anywhere (including its own file) is dead
vocabulary even though it "documents" a shape; and a definition-only
type can be a FALSE document (SearchResult claimed a shape the live
consumer never used — verify the claimed shape against the consumer,
not just the reference count). (2) "Dead export keyword" splits into
two dispositions by the value's life: value dead everywhere → retire
(the s54 class); value alive internally → the module's contract
surface, KEEP and guard-pin (the N-58c boundary — the N-56e mechanism
generalized from the vendored mirror to app-owned modules). (3) An
ALIAS export (`export { x as y }`) is the loudest dead surface of the
family — it advertises a consumption name nothing uses; sweep the
alias list explicitly. (4) A fresh-eyes sweep's file set must rotate by
staleness (git log per file), not by recency of the AREA — the store
went 14 sessions unswept because its area "felt" covered.

## 16ay. Session-59 Layer (the dead-surface narrowing: the missed sibling + the destructured prop)

The session-59 lesson pair, both from the fresh-eyes rotation:

**(1) The fully-dead TYPE class had a missed sibling.** The s58 sweep
retired the types barrel's `SearchResult` interface and verified the
barrel's other interfaces only as *SearchResult's neighbors* — it never
censused every interface's consumers independently. The 59-b rotation
(a complementary file set, not the area-recency heuristic) found
`export interface SavedReport` (id/name/tab/config/createdAt) with ZERO
references repo-wide INCLUDING its own file — the DB-wire-shape twin of
ledger-10's dead Prisma model, and shape-DIVERGENT from the LIVE
`SavedReport` (the localStorage filters/columns shape in
saved-reports.ts, the s25 seam consumed by save-report-dialog + the
reports page). Same-name-different-shape made it doubly dangerous as
documentation: a reader importing `SavedReport` from the barrel would
get a type that matches nothing the app actually reads or writes.
Methodology: a barrel sweep must census EVERY exported name's
consumers (word-boundary, comment-stripped), not just the named
finding's vicinity — dead exports cluster by oversight, not by
adjacency. Retired with the record comment; the SKILL §20 carrier
followed (the interface line + the stale "(192 lines)" header count
refreshed to the live 277 — §20's line-count header had been stale
since it was written; refresh it whenever §20 is touched).

**(2) The dead-prop class's DESTRUCTURED variant.** The
entity-edit-dialog's `entityId` prop was destructured + typed + passed
by all three call sites (contacts/leads/accounts) since s28 — but
never read in the body. This is the third face of the N-56a
lint-invisible class: the IMPORT variant (s56 — an import line with no
usages), the PROP-TYPE variant (s57c — a prop typed and passed but
never destructured), and now the DESTRUCTURED variant (typed, passed,
AND destructured — but never read). An unused destructured binding is
exactly what eslint's `no-unused-vars` flags on its own — the only
reason it survived 31 sessions is that BOTH no-unused-vars rules are
deliberately OFF (eslint.config.mjs:13/:33). The class rule going
forward: any prop that survives a sweep must be read IN THE BODY
(grep the identifier after the destructure point), not merely
destructured. The three call-site bindings retired with it;
`editTarget` stays live through `initial` at every site (the prop and
its feed are separable — check both).

**(3) The doc-arithmetic class.** The s58 README badge read 1309 where
the convention demanded 1198+112=1310 — and the s58 record itself
wrote "badge 1309 = 1198 + 112", the self-contradiction invisible to
its author because the badge number and the sum were never
cross-checked in one place. Arithmetic claims in records need the
SAME evidence discipline as code claims: state the sum AND show the
addition. (Also caught: the SKILL "5622 → 5692 lines" narrative —
actual 5621 → 5692, the off-by-one inherited from session_107.md's
own off-by-one on both ends. Line-count narratives drift; `wc -l` at
both commits is the only source of truth.)

The standing layers held: 13/13 ledger zero graduations (16th
consecutive), both operator decisions standing (the CSV posture (b)
17th re-affirmation; the source-vocabulary parity extended to the
N-59 family — fully-dead surfaces retire, the N-58c module
type-contract boundary and the stock mirror stay guard-pinned), the
reference bundle byte-identical for the 30th consecutive session.
Gate: lint 0/0 · tsc 0 · 1201/1201 unit (75 suites, +3) · build
clean · 112/112 e2e (fresh CI=1 boot, all 7 mobile-nav checks green)
· LIVE-verified (the Edit Contact dialog full contract + save
round-trip; the saved-reports save/load round-trip through the LIVE
localStorage shape, zero residue; the drawer both directions at a
TRUE 390px; zero 390px overflow on all ten routes; NO Tailwind v4
bug — `--blur-sm` 4px + the exact pinned shadow).

## 16az. Session-60 Layer (the dead-surface narrowing: the palette key + the test-local locator)

The session-60 lesson triple:

**(1) The fully-dead class reached the exported const MAP.** Six of
`CHART_COLORS`' sixteen keys — blue/cyan/teal/amber/orange/green — had
zero key-reads AND zero computed access (`CHART_COLORS[`) repo-wide.
The retirement granularity finally descended below the export: a map
can be half-dead, and the dead half is invisible to import sweeps (the
map itself is imported; only the KEY reads count). The census that
finds this class: per-key read counts (`.key` word-boundary greps +
computed-access greps), never import-line greps. Collisions to respect:
`emerald` and the retired `green` SHARE the `#10b981` hex — the pins
must anchor on key names, not values; the raw-hex string literals
elsewhere (`color="#3b82f6"` in the contacts/reports pages) are
independent props, NOT key reads. And the CSS `--color-chart-1…6`
token family is a DIFFERENT surface (globals.css design tokens) — it
stays whole; the §19 "keep both lists aligned" note retired with the
full mirror it described. LIVE-verification is mandatory for this
class: the live read set must still RENDER (the dashboard sparklines
emerald/violet/red + the cyan400/green400 bar strips; the accounts
-five -400 mini-bar families; the activities gray) — a retirement that
breaks a render is a wrong census.

**(2) The lint-invisible class's TEST-LOCAL variant.** A dead locator
declared inside an e2e spec (`const formAvatar = page.locator(...)` in
crm.spec.ts, dead since s30) — the fourth home of the N-56a class:
IMPORT (s56) / PROP-TYPE (s57c) / DESTRUCTURED (s59) / TEST-LOCAL
(s60). The unit-side hygiene suite reads src/ only, so test-tree
debris is invisible to it BY CONSTRUCTION — found only by rotating the
fresh-eyes sweep INTO tests/. The sweep-rotation rule stands
re-affirmed: each session's fresh-eyes pass must pick a DIFFERENT
census angle (imports → props → exports → parameters → map-keys →
test-locals), because every variant class hides from the previous
angle's tooling.

**(3) The off-by-one class bit the tooling itself.** The s59 SKILL-edit
script counted lines as `src.count("\n") + 1` — correct for a file
whose last line lacks a trailing newline, OVER-counting by exactly one
on a newline-terminated file (which this one is). The s59 record then
explained the discrepancy with a false bracket ("the file's last line
lacks a trailing newline") instead of doubting the formula. Lessons:
(a) count by `wc -l` semantics (count("\n"), no +1) and verify with
`wc -l` at the shell; (b) when two counts disagree, distrust the
DERIVED one before inventing a physical explanation for it; (c)
arithmetic in tooling needs the same audit discipline as arithmetic in
records — the 60-a re-audit caught it exactly the way the 59-a re-audit
caught the README badge.

The standing layers held: 13/13 ledger zero graduations (17th
consecutive), both operator decisions standing (the CSV posture (b)
18th re-affirmation; the source-vocabulary parity extended to the
N-60 family — the six dead keys + the dead locator retire, the N-58c
module type-contract boundary and the stock mirror stay guard-pinned),
the reference bundle byte-identical for the 31st consecutive session.
Gate: lint 0/0 · tsc 0 · 1204/1204 unit (75 suites, +3) · build
clean · 112/112 e2e (fresh CI=1 boot, all 7 mobile-nav checks green)
· LIVE-verified (the palette consumers render through the live keys —
the dashboard sparklines + bar strips, the accounts -400 families, the
activities gray; the drawer both directions at a TRUE 390px; zero
390px overflow on all ten routes; NO Tailwind v4 bug — `--blur-sm`
4px + the exact pinned shadow; census MATCH, zero residue).

## 16ba. Session-61 Layer (the dead-surface narrowing: the manifest + the public asset)

The session-61 lesson triple:

**(1) The fully-dead class reached the dependency manifest and the
public-asset tree.** Three never-referenced dependencies —
`@radix-ui/react-alert-dialog` + `@radix-ui/react-radio-group`
(zero imports repo-wide AND in all git history, no ui components) and
`bun-types` (zero references, never auto-included) — plus one duplicate
public asset (`public/neo-crm-dashboard.png`, byte-identical to the
referenced `docs/` original, shipping in every standalone build). The
RUNTIME-DEP, DEV-DEP, and PUBLIC-ASSET variants of the s54
fully-dead class: the fresh-eyes rotation must sweep OUTSIDE src/ —
the manifest, the lockfiles, the public tree, the scaffold scripts.
The censuses that find this class: `git log -S` on the package name
(an import grep alone cannot prove a dependency dead — the scaffold
installs ahead of use, and `git log -S` proves it was NEVER consumed
in any commit), tracked-reference greps on the asset path (the prompt
docs pointing at the GitHub `docs/` path are not consumers), and the
ui/-folder inventory (no component file = no consumer surface). And
LIVE-verification for the retirement side: the surviving surface must
still render (the Edit Contact dialog's dropdown + dialog + select +
label round-trip post-dep-removal) — a retirement that breaks a
render is a wrong census.

**(2) The lockfile-staleness lesson.** `package-lock.json` had been
untouched since session 4's b3e3d6d — s13's
`@radix-ui/react-dropdown-menu` and s25's `jspdf` + `html2canvas-pro`
never landed in it — because only `bun.lock` tracked the dependency
edits. A stale lockfile is invisible to every gate (bun installs from
bun.lock; tsc/lint/vitest read node_modules), so nothing fails while
an npm-installed environment silently resolves a different tree. Rule:
EVERY package.json change regenerates BOTH lockfiles (`bun install` +
`npm install --package-lock-only --ignore-scripts` — the s61 shipped
diff was 308 insertions / 86 deletions with zero version churn on
surviving entries; session-62 corrected the dry-run "310 pure
insertions" this lesson originally carried), and the regeneration
belongs in the same commit as the manifest edit. The `@types/node`
trap — CLOSED at s62: npm's regeneration dropped the resolved
@types/node (an optional peer npm never auto-installs), leaving the
npm-world install path without the types tsc needs for the `node:`
imports. The durable fix is the EXPLICIT devDep (`@types/node` joined
the manifest at s62); verify `tsc --noEmit` on the regenerated tree
before shipping regardless.

**(3) The doc-numerics census must be fully mechanical.** The N-61c
tree-block drift (16 → 27 route files, 8 → 9 models, 38 → 75 suites,
600 → 1207 checks, 92 → 112 e2e) plus ~20 stale rows in the PAD §11
Lines column — every number a manually-derived-then-forgotten count
that no gate ever re-verified. The method this session: derive EVERY
count from the shell (`wc -l`, route-file globs, `--list`), never from
the previous session's records — a number nobody recomputes is a
number that drifts. And the §19 mirror-table contract applies to hex
LISTS too: the chart row drifted from globals.css since session 4
while the §4 mirror beside it stayed exact — two mirrors of one file
can disagree for 57 sessions when only one is ever diffed. A mirror
row is a TEST, not documentation; when two mirrors of the same source
exist, diff them against each other periodically.

The standing layers held: 13/13 ledger zero graduations (18th
consecutive), both operator decisions standing (the CSV posture (b)
19th re-affirmation; the source-vocabulary parity extended to the
N-61 family — the manifest + public-asset dead surfaces retire; the
tw-animate-css re-vendor source, the CSS chart token family, the
N-58c boundary, and the stock mirror stay guard-pinned), the
reference bundle byte-identical for the 32nd consecutive session.
Gate: lint 0/0 · tsc 0 · 1207/1207 unit (75 suites, +3) · build
clean · 112/112 e2e (fresh CI=1 boot, all 7 mobile-nav checks green)
· LIVE-verified (the radix surfaces render post-dep-removal — the
Edit Contact dialog's dropdown + dialog + select + label round-trip
with the save closing cleanly, zero page errors; the drawer both
directions at a TRUE 390px; zero 390px overflow on all ten routes; NO
Tailwind v4 bug — `--blur-sm` 4px + the exact pinned shadow; census
MATCH, zero residue).

## 16bb. Session-62 Layer (the manifest honesty + the profile-save divergence)

The session-62 lesson triple:

**(1) A census claim needs a machine-checkable definition — and a guard
that pins the claim must pin its PROOF, not its conclusion.** The s61
audit had asserted "the other 7 radix packages are all live (…toast —
each with a verified import site)" — FALSE for toast, whose only src/
occurrence was a design-mirroring COMMENT in the from-scratch
toast.tsx. The s61 guard then pinned `pkg.dependencies[
"@radix-ui/react-toast"]).toBeTruthy()` — entrenching the dead dep as
a KEEP. Two failure modes compounded: the census read a comment as an
import (no stripComments), and the guard asserted the manifest's
conclusion instead of the import-site evidence. The s62 repair: the
guard now asserts a REAL import site for EVERY surviving radix
package (each pinned to its actual consumer file, comment-stripped) —
a guard that cannot be satisfied by a manifest entry alone. The
general rules: (a) any "verified import site" claim in an audit MUST
cite the file:line of the import statement itself; (b) a KEEP guard
pins the consumption evidence, never just the package.json key; (c)
`git log -S 'from "<pkg>"'` is the dead-dep proof (empty across ALL
commits = never imported in any commit — the scaffold installs ahead
of use, so "it's in package.json" proves nothing).

**(2) The npm world and the bun world are different install universes
— lockfile parity must be verified per-universe.** The s61
package-lock regeneration silently dropped the resolved @types/node +
undici-types entries (they had been transitives of the retired
bun-types, and npm does NOT auto-install the vite/vitest OPTIONAL
peers that re-declare them). The bun tree kept @types/node — so tsc
stayed green in the repo while any `npm install` consumer (the
install_packages.sh recovery path!) would lack the types for the
`node:` imports (db-path/verification-server/next.config/scripts).
The durable fix: an EXPLICIT devDep pinning the version the bun tree
already resolves — and the rule: after ANY lockfile regeneration,
grep the NEW lockfile for the resolved entries the toolchain needs
(not just the manifest parity), and record the per-universe versions
(here: bun 26.6.2, npm 26.6.4 — both inside ^26.6.2, benign for a
types-only devDep, but the skew gets documented, not ignored).

**(3) A "parity" gate that the reference does not have is a
divergence wearing a mirror's clothes — the bundle is the arbiter.**
Our profile save carried a name-only `dirty` gate (
`if (!dirty) return;`) that no reference surface exhibits: the
reference bundle's Save button is `disabled:i` with i = the SAVING
state ONLY, and its submit unconditionally PATCHes
{display_name, profile_picture}. The gate made a photo-only upload a
silent no-op — the button rendered enabled (mirroring the reference
visually) while the handler swallowed the action (diverging
behaviorally). The worst kind of divergence: invisible in a
screenshot, discoverable only in the flow. The method that caught it:
decode the reference bundle AT THE COMPONENT (search the toast
vocabulary string, then read the surrounding minified component for
the state bindings and the submit body). When a clone adds a gate the
reference lacks, the burden of proof is on the clone — and the proof
here retired the gate entirely (the unconditional PATCH, the
saving-only disabled state, LIVE-verified with a photo-only
round-trip: upload → toast → Save → reload with all three avatars).

The standing layers held: 13/13 ledger zero graduations (19th
consecutive), both operator decisions standing (the CSV posture (b)
20th re-affirmation; the source-vocabulary parity extended to the
N-62 family — the never-imported dep + the dead arms retire with
their carriers; the tw-animate-css re-vendor source, the N-58c
boundary, and the stock mirror stay guard-pinned), the reference
bundle byte-identical for the 33rd consecutive session. Gate: lint
0/0 · tsc 0 · 1210/1210 unit (75 suites, +3) · build clean · 112/112
e2e (fresh CI=1 boot, all 7 mobile-nav checks green) · LIVE-verified
(the fix surfaces render — the profile photo-only round-trip with the
from-scratch toast system post-dep-removal + the avatar pickup after
the unconditional save, the probe restored to photoUrl null; the
drawer both directions at a TRUE 390px; zero 390px overflow on all
ten routes; NO Tailwind v4 bug — `--blur-sm` 4px + the exact pinned
shadow; census MATCH, zero residue).

## 16bc. Session-63 Layer (the server-seam honesty: the foreign docs + the dead-arm split + the page-layout honesty)

The session-63 lesson triple:

**(1) A repo ships its OWN truth — foreign manuals are dead weight in
every clone.** `scandihaven_SKILL.md` (128,868 B — the Scandi Haven
project's master skill) and `project-management_SKILL.md` (31,946 B —
ORBITAL's, a third project entirely) sat at the repo root since the
initial scaffold `b48fc3d`, never modified once in 62+ sessions, with
zero functional references: the operator's prompt templates cite the
GITHUB repo URL for scandihaven's docs, never the local copies. The
s54 fully-dead class, DOC-FILE variant (~160 KB per clone). Retired
RED-first with an absence pin; the recovery path is
`git show b48fc3d:<file>`. The rule: reference material the workflow
POINTS AT BY URL is not a reason to carry a copy — the repo's own docs
(README/AGENTS/CLAUDE/PAD/SKILL) are the shipped truth.

**(2) "Dead arm" is two risk classes, not one — split by what the left
operand is.** The N-62c retirement precedent covered arms unreachable
by the TYPE contract. Session 63 met the boundary of that class and
split the rest: lookups over INTERNAL constants
(`PIPELINE_LABELS[stage]` inside a `PIPELINE_STAGES.map` — every key
verified present; `!view` after asString's optional+trim contract +
`?? "month"`) are construction-dead → RETIRE. Lookups over PERSISTED
data (`ACTIVITY_TYPE_META[t]?.label ?? t` over DB types,
`o.stage || "unknown"`, the `: 0` ternary over `DateTime?` dueAt) are
defensive-DB-read → KEEP + ANNOTATE: a `Record<string,…>` index over
persisted values degrades gracefully on an unexpected key, and the
codebase's zero-type-predicate discipline makes some arms the honest
STATIC form even when runtime-unreachable. The rule: before retiring a
fallback, name the operand's provenance — internal constant vs
persisted data — and retire only the first kind.

**(3) A pin that guards a record the live page no longer renders is a
guard over a stale copy.** page-layout.ts's header claimed "Pages
consume these records" — FALSE for an 8-record family (PAGE_TITLES,
DIALOG_BARE_GROUP, RECENT_DEALS, STAT_SHADOWS, CHART_GEOMETRY,
TABLE_SHADOWS, CALENDAR_CELL, DELTA_TEXT) whose consumers are the test
file alone, while the live pages hand-inline (and CALENDAR_CELL.base
had DRIFTED from the live calendar cell — no `flex flex-col
items-stretch`, no focus-ring key, a duplicated `transition-all`).
The s24 click-contract lesson at the layout seam: the record was
RE-DERIVED from the live surface (the pins re-anchored, so the change
was RED-proven), the header claim corrected, and every record
annotated with its consumption status — the wire-or-remove posture
family (N-46e/N-62d) extended to the layout seam. Same session, the
allLayoutClasses sweep's "Every exported class string" claim was made
true (41 → 71 groups, plus the bare-string branch — `Object.values` on
a STRING splits into characters, the trap that had kept every
single-string export out of the sweep).

The standing layers held: 13/13 ledger zero graduations (20th
consecutive), both operator decisions standing (the CSV posture (b)
21st re-affirmation; the source-vocabulary parity extended to the
N-63 family — the foreign docs + the construction-dead arms retire;
the defensive family + the snapshot records annotate), the reference
bundle byte-identical for the 34th consecutive session. Gate: lint
0/0 · tsc 0 · 1216/1216 unit (75 suites, +6) · build clean · 112/112
e2e (fresh CI=1 boot, all 7 mobile-nav checks green) · LIVE-verified
(the pipeline labels render identically through the retired-arm path;
the calendar cell matches the re-derived record byte-for-byte; the
drawer both directions at a TRUE 390px; zero 390px overflow on all ten
routes; NO Tailwind v4 bug — `--blur-sm` 4px + the exact pinned
shadow; census MATCH, zero residue).

## 16bd. Session-64 Layer (the logout write-guard + the test-suite honesty)

The session-64 lesson triple:

**(1) A regex with an always-matching disjunct guards nothing.** The
leads funnel's status-cumulative pin asserted
`toMatch(/cumulative|LEADS_FUNNEL/)` over the `const funnel` region —
a region that always contains `LEADS_FUNNEL.map`, so the second
disjunct could never fail, and the contract it named (contacted =
contacted+qualified+won; qualified = qualified+won) had ZERO effective
coverage: the exact filter forms were pinned nowhere repo-wide. The
re-anchor pins the forms themselves (`n(["contacted", "qualified",
"won"])` and siblings) and was proven non-vacuous by PERTURBATION —
mutating the source form fails the new pin where the old pin stayed
green. The rule: when a pin's region contains a token from its own
disjunct set, the pin is vacuous by construction; pin the exact
strings the contract names, and prove new pins by breaking the source
in a scratch worktree, not by trusting the region math.

**(2) The s45 token family generalizes to the SESSION boundary.**
fetchEvents's last-call-wins token solved CALLER RIVALRY (two fetches
racing); the logout write-guard solves WRITER INVALIDATION (a fetch
racing a state reset). Same mechanism, different trigger: a
module-level `sessionWriteToken` every slice fetch captures at entry;
`logout()` bumps it — and the events token — immediately before the
clearing set, so every in-flight resolution is skipped instead of
re-populating the cleared slices (the s35 leakage class's last open
window: a fast logout → login could flash user A's data under user
B's session). hydrate dies ENTIRELY on a mid-auth logout (no user
set, no slice fetches). The s45 fetchEvents body stays byte-identical
— its in-flight writes are invalidated through its own token, the
guard riding the bump instead of a second condition (pinned: the s45
form must not grow a session clause).

**(3) Dead cargo duplicates too — sweep the HELPER family, not just
src.** The shared stripComments helper's second replace (the
braced-pattern pass) was unreachable — the first replace already
removes every plain `/*…*/` span, and the braced pattern requires
exactly such a span — and it rode along in ALL 54 test-helper copies,
surviving every src-focused dead-surface sweep because tests/ was
never a rotation seam. Retired in one provably-zero-behavior sweep,
absence-pinned with an ESCAPED needle (the pin's own bytes can never
satisfy it — and its documentation comments must avoid the literal
too, a trap caught mid-flight). Companion findings: 13 stale
line-citation anchors across 10 test files (the chronic self-shift
family — prefer TOKEN anchors over line numbers; the drift is
generational), and the tautology family (`expect(localLiteral)
.toHaveLength(n)` — runtime-dead, its residual value is the type
annotation at the tsc gate; annotate, don't pretend it guards).

The standing layers held: 13/13 ledger zero graduations (21st
consecutive), both operator decisions standing (the CSV posture (b)
22nd re-affirmation; the source-vocabulary parity extended to the
N-64 family — the vacuous pin re-anchors, the logout guard lands,
the dead cargo retires, the anchors refresh, the precision carriers
land), the reference bundle byte-identical for the 35th consecutive
session. Gate: lint 0/0 · tsc 0 · 1222/1222 unit (75 suites, +6) ·
build clean · 112/112 e2e (fresh CI=1 boot, all 7 mobile-nav checks
green) · LIVE-verified (the funnel chips render the cumulative


## 16be. Session-65 Layer (the e2e honesty + the page-render dead surfaces)

The session-65 lesson triple:

**(1) The vacuous-assertion class has an e2e twin — assert the widget's
OWN DOM, never a look-alike the background already renders.** The global
search test asserted `getByText("Accounts").first()` and
`getByText("Northwind Energy").first()` — the first resolved to the
sidebar nav link (always visible at the desktop viewport, and EARLIER in
DOM order than the dropdown it meant), the second to the Recent Deals
accountName cell (the seeded "Turbine telemetry POC" opp is rank-4 of
the updatedAt-desc top-5, rendered on the dashboard without any search).
Both assertions passed with a completely broken search — exactly the
family the s43-P4/s45 search bugs were, caught by neither. The re-anchor
pins the dropdown's own DOM: the SearchResultRow renders a BUTTON
(unique page-wide — the background cells are td/p) and the section
header is asserted as that button's preceding sibling. The rule: when a
test can pass against the BACKGROUND, it does not test the feature;
scope every assertion to the widget under test (role + structural
relationship), and prefer assertions that would fail if the widget
unmounted.

**(2) The self-shift anchor family drifts AT BIRTH when the refresh
cites a different line than the edit lands on.** The s64 refresh of the
settings-rollback/debounce anchors wrote ":98/:111, the membership
guards" — but :98 is the defaultLeadStage BLOCK start and :111 is the
tier block's isBadString 400 line; the guards sit at :107/:116. The one
file the s64 edits did not touch (settings/route.ts) is exactly where
the fresh anchor drifted, because the citation was derived from the
plan's proposal instead of re-grepped at landing time. The rule: the
anchor's final form is re-derived from the file AT EDIT TIME, never
copied from the plan; and token-form citations ("the LEAD_STAGES/
ACCOUNT_TIERS includes") survive edits above them that line numbers
cannot. The same class hit the e2e seam for the first time (the only
line-number citation in crm.spec.ts had drifted — the never-swept seam
again).

**(3) The dead-surface sweeps MISS the destructured bindings and the
disjunct arms that read plausibly.** The contacts-page destructure
carried leads/users/settings with zero body reads — invisible to the
import-sweep (they are not imports) and to no-unused-vars (the rules are
off; destructuring IS a use in the lint's eyes) — surviving since s41,
whose sweep deleted the `sources` sibling from the very same line. The
accounts rows carried `a.isKey || a.tier === "Key"` — the second arm can
never fire (tier is membership-validated to A/B/C at both write seams)
but reads like defensive parity. The reports select carried
`OPP_STAGE_META[s]?.label ?? s` — the s63 retirement's missed sibling,
one file over. The rule: after every vocabulary/validation seam lands,
grep the CONSUMERS for arms that reference values the seam forbids, and
treat destructures as sweepable surface (grep the binding, not the
import). Defensive arms over PERSISTED data stay — but they ANNOTATE
(the s63 house rule, now extended to the calendar/activities chip
lookups).

The standing layers held: 13/13 ledger zero graduations (22nd
consecutive), both operator decisions standing (the CSV posture (b)
23rd re-affirmation; the source-vocabulary parity extended to the N-65
family), the reference bundle byte-identical for the 36th consecutive
session. Gate: lint 0/0 · tsc 0 · 1227/1227 unit (75 suites, +5) ·
build clean · 112/112 e2e (fresh CI=1 boot, all 7 mobile-nav checks
green — the Escape test now asserts the focus RESTORE) · LIVE-verified
(the search dropdown round-trip with the result-row button + section
headers; the drawer both directions at TRUE 390px with the Escape focus
restore; zero 390px overflow on all ten routes; NO Tailwind v4 bug;
census MATCH, zero residue).
counts; the logout round-trip clears the store; the drawer both
directions at a TRUE 390px; zero 390px overflow on all ten routes;
NO Tailwind v4 bug; census MATCH, zero residue).

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
| `chart-1…6` | `#3b82f6 #06b6d4 #eab308 #f97316 #9ca3af #ef4444` | — | inline styles | recharts series + sparklines |

Chart palette note [s60/N-60a carrier]: `CHART_COLORS` in `constants.ts`
carries only the LIVE read set for TS consumers — red/gray/violet/emerald
+ the `-400` family (the six never-read keys blue/cyan/teal/amber/orange/
green retired s60 after a zero-reads census). The CSS `--color-chart-1…6`
token family above is a different surface and stays whole; the two lists
are no longer full mirrors — the TS side is the consumed subset.

**Forbidden:** raw palette classes (`bg-blue-600`, `text-gray-500`, …)
in app code — always the semantic token. (The single historical exception
is the login card's `bg-gray-900` dark "Sign in" button, measured from
the reference and kept deliberately.)

## 20. The Complete TypeScript Interface Reference

From `src/types/index.ts` (277 lines) — the API wire shapes shared by
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

// Session-59 (S59-P2, N-59a): the `SavedReport` interface RETIRED from
// the barrel — zero references repo-wide INCLUDING its own file. The
// LIVE SavedReport is a different localStorage shape in
// src/lib/saved-reports.ts (the s25 seam). The type shadow of the dead
// Prisma model (ledger-10's deferral — reset + seed-time wipes only).

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
```
(The s58 N-58b retirement: the definition-only `SearchResult` interface
— zero references repo-wide and shape-inaccurate vs the topbar's live
inline row shape — was removed from this barrel; §16ax has the record.)

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
  Unqualified, Lead Source = the RAW call/email/website/partner values
  with capitalized labels — session-29, the s28 contact-source
  precedent; the default is "email", Contact
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
  [Session-24 supersession: the s14 redirect alias itself was RETIRED —
  the reference renders each casing IN PLACE with no normalization, so
  /Profile is now the (app)/Profile/page.jsx RENDER alias (§16p); the
  config-redirect loop lesson above is the eternal part.]
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


## 16bu. Session-81 Layer (the settings-defaults rotation + the Select
stock-family re-derivation)

**What shipped:** the settings defaults editors' deeper family's FIRST
dedicated rotation (the session_157 suggested target #1 — never rotated:
s14 pinned the SETTINGS_DEFAULTS layout records, s26 the data-tab chrome,
s72 the store/API seams + the debounce contract; nobody had walked the
editors' own DOM + computed styles + the Select stock family they ride
against the live reference at 1440 AND 390) found the N-81 family —
3 M + 2 L + 2 N (incl. 81-a's three stale s80-hover comment carriers).
The decisive fixes: the M-81c1 SELECT-CONTENT CHROME (the reference's
open popovers ship `z-50 max-h-96 … rounded-md … shadow-md` + the FULL
animation arm set — all four slide-in-from-* arms + the four per-side
translates, all unconditional on its single popper construction. OURS
shipped the scaffold-era shadcn draft: `z-[60] max-h-72 rounded-lg
shadow-lg` with fade+zoom only, behind a position ternary — LIVE-
computed divergences: radius 8px vs 6px, shadow-lg (0 10px 15px -3px)
vs md (0 4px 6px -1px), max-height 288px vs 384px, z-index 60 vs 50,
plus the missing 8px slide-in open animation on every popover. The s13
MENU_CONTENT pin had covered the dropdown-menu family; the select
content was never pinned — 80 sessions of unpinned scaffold chrome);
the M-81c2 SELECT-ITEM + CHECK family (the reference's items ship
rounded-sm computing 4px (its shadcn radius derivation; ours computed
6px as rounded-md) + the focus WASH pair `focus:bg-accent
focus:text-accent-foreground` — the highlighted item's text SHIFTS
#a0a0a0 -> #171717 (LIVE: the highlighted "Month" computed rgb(23,23,23)
while the resting "Week" computed rgb(10,10,10); ours stayed flat
#0a0a0a). Our computed-equals: `focus:bg-line-soft` (#f5f5f5 = its
accent) + `focus:text-neutral-900` (#171717 — the s80 badge precedent
for its accent-foreground). AND THE CHECK: the reference's selected
item's check svg is BARE h-4 w-4 — inheriting the near-black ink.
OURS carried `h-4 w-4 text-primary` = #2563eb — a BLUE check on every
selected select item app-wide (our --color-primary is the app blue,
not the reference's popover ink)); and the M-81c3 TRIGGER BASE
RE-DERIVATION (the reference's bundle-verbatim base carries NO text
color, NO transition-colors, NO placeholder: arm, and DOES carry the
latent ring-offset-background (an offset-0 no-op) + `[&>span]:
line-clamp-1` — LIVE-computed on its trigger span: `display:
flow-root; overflow: hidden; text-overflow: clip; -webkit-line-clamp:
1` vs OURS truncate's `display: block; text-overflow: ellipsis;
line-clamp: none` — a different clipping construction on every
select. OURS invented three arms (text-ink, transition-colors,
placeholder:text-muted-ink — computed-equal/no-op but not the
reference's construction), and the chevron carried an extra shrink-0 —
the bundle's `h-4 w-4 shrink-0` is the CHECKBOX's class, not the
chevron's).

The L/N set: the L-81c4 NUMBER-INPUT MIN FAMILY (the reference ships
NO min and NO max on its settings follow-up input and NO min on its
New Account dialog's Annual Revenue + Employees inputs — live-probed,
hasAttribute false; OURS shipped min={0} max={90} + min={0} x2 — DOM
attribute divergences with real spinner-clamping + :out-of-range
semantics, the s77 min-retire precedent; the API-side 0-90 guard
STAYS as the documented s43-P3/S46-P2 superset); the L-81c5 TABSPANEL
ATTR TRIO (the reference's Radix panels carry data-state="active" +
data-orientation="horizontal" + tabindex="0" alongside the s23
id/aria-labelledby/hidden wiring — tabindex=0 is the a11y-relevant
one, the panel enters the tab order; shared across all three tab
strips); the N-81c6 SUBTITLE ELEMENT (the reference's Default Values
CardDescription slot renders a DIV; ours a `<p>` — tag-only, computed
identical); and 81-a's three stale s80-hover comment carriers
(AGENTS.md:200's Badge description still carrying the retired solid
hover claim + badge-contract.test.ts:32's header map +
page-layout.test.ts:1190's "#262626" comment).

**The audit lessons:** (1) a STOCK PRIMITIVE the pins never covered is
a 80-session blind spot — the s13 MENU pin covered the dropdown-menu
family and everyone assumed the select rode the same record; it did
not (its own inline scaffold draft). When walking a family, decode the
REFERENCE'S OWN DOM class strings for every primitive the family
touches, not just the records that exist. (2) The reference's
highlighted-select-item color (#171717 via accent-foreground) differs
from its resting color (#0a0a0a) — a probe that samples only ONE item
(the auto-highlighted first) mis-reads the resting palette; probe BOTH
the highlighted and the resting items. (3) Tailwind v4 scans COMMENTS
— a hazard comment naming retired classes (max-h-72, z-[60]) emits
dead rules into the built CSS; harmless, but the negative test pins
must strip comments (the stripComments convention) or they false-FAIL
on the documentation itself.

**Gate:** lint 0/0 · tsc 0 · **1599/1599 unit (90 suites, +23)** ·
build clean · **132/132 e2e on a fresh CI=1 boot (3.3m, FIRST run
green; all 9 mobile-nav green)**. LIVE-verified: the popover 6px
radius + shadow-md + z-50 + the full arm set; the item 4px radius +
the highlighted text lab(7.78)≈#171717; the check BARE; the span
flow-root/clip/clamp-1; the chevron bare; the follow-up input min/max
gone; the panel attr trio; the subtitle DIV; the trigger's inherited
#0a0a0a ink; the drawer at TRUE 390px (full-bleed, 8 links, dual
lock, focus inside, navigate-close, Escape-inert); zero overflow ×10;
the built CSS zero (hover: hover) wraps; the closing census MATCH.
Screenshots 101 + 102 NEW (VLM 4/5 + 4/4 — the item-radius flag a
VLM-scale artifact, DOM-proven borderRadius 4px). RED: 16 failing pins
exactly (the new suite's 15 + the page-layout re-anchor) + 2 mid-flight
pin-shape repairs (the epoch-key call-site scope + the stripComments
negative); non-vacuousness PROVEN: 16 failed | 1583 passed at the
pre-fix state — exactly the modified-pin set, ZERO collateral.

## 16bv. Session-82 Layer (the contacts slide-over rotation + the
Button-icon-margin re-derivation)

**What shipped:** the contacts slide-over's deeper chrome — the FIRST
dedicated rotation (the session_159 suggested target #1: s28 decoded
the Pke structure + s75 walked the filter rail, but nobody had ever
walked the panel's own card bodies + the activity/deal constructions +
the icon identities + the Button icon-text mechanics they ride). Every
claim decoded from the byte-stable 1.63MB reference bundle (md5-exact
for the 53rd consecutive session) + LIVE-probed on our dev server.
The N-82 family: 3 M + 2 L + 2 N.

**The headline — M-82c1, the Button-icon-margin re-derivation:** the
reference's stock Button base (the bundle's `uie`, decoded verbatim)
carries `[&_svg]:pointer-events-none [&_svg]:size-4
[&_svg]:shrink-0` and NO svg-margin arms — its icon-text spacing rides
EACH SURFACE'S OWN svg margin class: `w-4 h-4 mr-2` on the entire
header/export family (New Account/Contact/Lead/Event, Export CSV/
Export/Export PDF, Saved Reports, Reset All Data, Scan Card, Import,
the dashboard Add — every one bundle-decoded with mr-2; 8px margin +
the 8px flex gap = the 16px icon-text gap s9 measured), and
`w-4 h-4 mr-1` on the compact family (the slide-over's Call/Email/
WhatsApp, the contacts mobile cards' Call/Email, the activities
Check-as-completed ghost: 4px + 8px = 12px). OURS shipped the s9
`BUTTON_BASE.iconGap` invention (`[&_svg]:mr-2
[&_svg:only-child]:mr-0`) whose cascade BROKE the per-surface
margins: on svg+BARE-TEXT buttons (the svg is the only ELEMENT child
— text labels are text nodes) the only-child mr-0 (specificity
(0,2,1)) nullified the svg's own mr-1/mr-2 ((0,1,0)) — LIVE-measured
**0px** margin on our contacts header Export CSV + New Contact (the
reference's mr-2 family: our total gap 8px vs its 16px) and on the
panel's Call button (the mr-1 family: 8px vs 12px); on svg+SPAN
buttons the mr-2 arm fabricated the 8px (accidentally right only for
the mr-2 family); and the topbar user button carried an
`[&_svg]:mr-0` NEUTRALIZER that existed purely to undo our own
invention. THE FIX: the base arms retired (the reference-verbatim
construction), the neutralizer retired, the 16 header/export sites
gained their own mr-2, and the 11 already-carrying sites (6 mr-1 +
5 mr-2) simply start applying — the s9-measured 16px gap now rides
the reference's own mechanism everywhere. Tailwind v4 note: the
compiled CSS keeps two INERT dead rules (`.\[\&_svg\]\:mr-2 svg`
+ the only-child one) — comment-mention artifacts (v4 scans comments;
the s80/s81 precedent), matched by zero elements.

**M-82c2 — the Activity-icon identity:** the reference's slide-over
activity card renders `AC` = lucide **Activity** (the bundle:
`AC=tr("Activity",vQ)` with the pulse path `M22 12h-2.48a2 2 0 0 0
1.93 1.46l-2.35 8.36…` — our lucide-react 0.525's Activity path is
byte-identical). OURS rendered **Zap** (the lightning bolt) — the
wrong glyph on every activity card in the slide-over; the s76
icon-alias rotation resolved the activities page's families but never
walked this card. (The panel's Activity TYPE import rides an alias —
`Activity as ActivityRecord` — keeping the DOM-facing component name
identical to the reference's glyph.)

**M-82c3 — the activity-date format:** the reference renders
`st(l.date).format("MMM D, YYYY h:mm A")` — the date AND the time
(e.g. "Oct 5, 2026 10:00 AM"); ours rendered "MMM D, YYYY" (no time).
The new `formatMonthDayYearTime` seam in `src/lib/format.ts` (the
house hand-rolled pattern riding MONTHS_SHORT) + the panel's card
consumes it; the `l.date` field maps to our dueAt (the ActivityDialog
binding, the s76 mapping); the fallback chain stays (the robustness
superset); the Last Activity row keeps the reference's own date-only
form (its per-surface split).

**L-82c4 — the deals amount:** the reference renders the jsx array
`["$",(f=l.amount)==null?void 0:f.toLocaleString()]` — "$" +
amount?.toLocaleString() with NO space and NO 0-fallback (a null
amount renders "$" alone); ours rendered `$ {…0…}` ("$ 1,234" / "$ 0").
Mirrored verbatim.

**L-82c5 + N-82c6 + N-82c7:** the AGENTS.md:200-202 stale carrier
(the S81-P7 half claimed landed in six doc surfaces but never
executed — the 82-a re-audit caught it; re-derived to the /80 alpha
arm); the email row's `?? "—"` retired (the reference renders the
bare `e.email`; our email is non-null); the PAD:766 phantom-pin
wording corrected (the s81 row claimed the AGENTS:200 carrier was
pinned — no such pin exists, which is why the stale carrier survived
the s81 gate — the N-50a doc-carrier-escapes-pins genus).

**The gate:** lint 0/0 · tsc 0 · **1619/1619 unit (91 suites, +20)**
· build clean · **132/132 e2e on a fresh CI=1 boot (3.2m, FIRST run
green, all 9 mobile-nav checks green)**. LIVE: the contacts header
Export CSV/New Contact svgs compute 8px margins (the 16px total gap);
the panel's Call 4px (12px total); the dashboard Add 8px (preserved
via its own mr-2); the topbar chevron 0px (the reference's bare
form); the activity card's icon `lucide-activity` with the pulse
path; the card dates "Sep 26, 2026 9:36 AM" / "Oct 8, 2026 2:00 PM";
the deals amounts "$110,000"/"$145,000" (no space); the drawer at
TRUE 390px (full-bleed, 8 links, dual scroll-lock, focus inside,
navigate-close + locks released, Escape-inert); zero overflow ×10;
the built CSS zero (hover: hover) wraps; the closing census MATCH
(db pristine + the reference unchanged). Screenshots 103 (the
slide-over Activities tab — the pulse icon + the datetime) + 104
(the panel at TRUE 390px) — VLM 3/5 (both flags DOM-disproven: the
16px pulse icon at screenshot scale + the date-only Last Activity
row the reference itself ships) + 4/4 PASS.

**The intake layers:** drift sweep #78 — the app bundle byte-identical
for the 53rd consecutive session; the s81-flagged `/static/*`
platform-shell re-check DONE: the login page now renders via the
platform loader (37 modulepreloads, zero /assets refs in the login
HTML) but the LIVE app post-login still loads ONLY the old /assets
pair — ZERO app-code migration (the documented non-drift extends one
step deeper). Reference census #78: demo zero, the mobile-nav defect
standing at TRUE 390px, desktop normal. 82-a: the s81 re-audit 9/10
GENUINE + the AGENTS:200 catch; 82-b: ZERO graduations 12/12 (the
39th consecutive), the 8 censuses 8/8 CLEAN, both operator decisions
standing (the 41st re-affirmation: CSV posture (b) + the
source-vocabulary parity).

## 16bw. Session-83 Layer (the reports filter-card rotation + the
per-surface-margin collateral closure)

**What shipped:** the reports filter-card family — the standing
session_159 alternate (s74 walked the page family broadly; the filter
card's own chrome + the surfaces it rides never had a dedicated pass) —
plus the collateral sweep closing the s82 re-derivation's un-enumerated
Filter/quick-log surfaces. Every claim bundle-decoded from the
byte-stable 1.63MB reference (md5-exact for the 54th consecutive
session) + LIVE-probed on our dev server. The N-83 family: 3 M + 1 L +
7 N.

**The M-family — the per-surface margin closure:** M-83a1 the settings
Data tab's SEVEN export buttons (the record's own s72 comment
documented the reference's `cs` = w-4 h-4 mr-2 while the record shipped
h-4 w-4 — LIVE-measured 8px icon-text gap vs the reference's 16px on
all seven; one record change, buttonIcon re-derived); M-83c2 the
dashboard Filter button (the reference's svg w-4 h-4 mr-2 vs our
scaffold-era h-3.5 w-3.5 no-margin — a 2-fold divergence whose gap
REGRESSED 16px->8px at s82 when the base cascade retired, the only s82
regression, missed because the s82 census read the contacts/leads
FilterPolygon pair as "already-carrying" and never checked the
dashboard's own divergent classes); M-83c3 the activities quick-log row
(the reference's four header buttons all ship w-4 h-4 mr-2; ours
shipped the bare h-4 w-4 — the margin had been nullified since s9 by
the only-child arm and the s82 retirement simply left it absent).

**L-83c4 — the Log WhatsApp variant:** the reference rides the DEFAULT
Button variant + the bare `bg-emerald-600 hover:bg-emerald-700` pair —
the base's `text-primary-foreground` keeps the label WHITE on hover.
OURS rode `variant="ghost"` + text-white: the ghost's
`hover:text-foreground` survives the twMerge (no conflict with
text-white) and flipped the label #0a0a0a on hover over the emerald
surface — live-exercisable since the s80 hover un-wrap. LIVE-verified
post-fix: the mouse parked with `:hover` matching, the color stays
rgb(255,255,255) over emerald-700 (lab(44.4871 -41.0396 11.0361)).

**The N-family:** the four dead SelectValue placeholders mirrored
("Date: This Quarter" / "Owner: All" / "Stage: All" / "Status: All" —
dead in BOTH apps, the controlled values always set; the
FILTER_BAR.searchPlaceholder precedent); the fifth tab id "health" ->
the reference's "accounts" (invisible internal state, no URL); the
save-dialog Load button's redundant className retired (it duplicated
the sm size's own h-8 px-3 text-xs); the page root mirrors the
reference's `id="reports-content"` (its own PDF capture hook; ours
captures `main` — the s25-pinned documented variant, the id is the
zero-risk mirror); the three stale doc carriers re-derived (the two
AGENTS.md iconGap/neutralizer entries + the page-layout SETTINGS_DATA
comment — the N-50a doc-carrier-escapes-pins genus, now absence-pinned
in the new suite so they cannot recur).

**The gate:** lint 0/0 · tsc 0 · **1649/1649 unit (92 suites, +30)** ·
build clean · **132/132 e2e on a fresh CI=1 boot (3.2m, FIRST run
green, all 9 mobile-nav checks green)**. Non-vacuousness PROVEN at the
pre-fix state: **15 failed | 1634 passed (1649 total)** — exactly the
modified-pin set, ZERO collateral (4 mid-flight pin-shape repairs: the
Reset last-child assertion, the two require()->await-import ESM fixes,
the KPI_CHIP_BG hex-vs-class read). LIVE: the 7 Data-tab buttons at
16px gaps (was 8px); the dashboard Filter 16px icon + 16px gap; the
four quick-log buttons 16px gaps; the WhatsApp white-on-hover; the
fifth tab round-trip; the reports-content id; the drawer at TRUE 390px
(full-bleed, 8 links, dual scroll-lock, focus inside, navigate-close +
locks released, the closed state inert + visibility:hidden); zero
overflow x10; the built CSS zero (hover: hover) wraps; the closing
census MATCH (db pristine + the reference md5-exact). Screenshots 105
(the activities quick-log row) + 106 (the reports filter card) — VLM
5/5 + 6/6 PASS.

**The intake layers:** drift sweep #79 — the app bundle byte-identical
for the 54th consecutive session; the /static/* platform shell still
renders the login page but the live app loads only the old /assets
pair (no app-code migration). Reference census #79: demo zero, the
mobile-nav defect standing at TRUE 390px, desktop normal. 83-a: the
s82 re-audit 12/12 GENUINE + the M-83a1 catch + 5 nanos; 83-b: ZERO
graduations 12/12 (the 40th consecutive), the 8 censuses clean, both
operator decisions standing (the 42nd re-affirmation: CSV posture (b)
+ the source-vocabulary parity — the rotation's own decode of the
reference's naive always-quote `y` builder re-confirms the guarded
superset).

## 16bx. Session-84 Layer (the accounts insights-dialog rotation + the
icon-identity resolution)

**What shipped:** the accounts insights-dialog family — the standing
session_163 suggested target, chosen because its "unresolvable-in-bundle
icon identities" note could be re-tested: the byte-stable bundle decodes
the stat-card aliases cleanly at their own `tr()` assignment lines (the
s76 playbook trick) — `Wc=tr("TrendingUp",bJ)`, `op=tr("Target",vJ)`,
`q0=tr("Users",SJ)`, `qd=tr("Calendar",jQ)`. Every claim
bundle-decoded + LIVE-probed on the dev server (the reference itself
renders only empty states at its zero demo data — the bundle is the
evidence, the s76 bundle-beats-live-read precedent). The N-84 family:
3 M + 2 L + 1 N.

**The M-family:** M-84c1 the Total Revenue stat icon (the reference's
TrendingUp zigzag in blue; ours shipped Users — the s28 decode never
resolved the alias); M-84c2 the Open Deals stat icon (Target's
concentric circles in green; ours shipped Phone); M-84c3 the contacts
initials box — the reference ships the STOCK AVATAR PRIMITIVE (its Ll
is the Radix Avatar.Root wrapper `relative flex h-10 w-10 shrink-0
overflow-hidden rounded-full` with the tint classes appended;
twMerge-resolved to a 40×40 ROUNDED-FULL CIRCLE) where ours shipped a
bare SQUARE div (LIVE pre-fix: radius 0px, position static, overflow
visible; post-fix: rounded-full + relative + hidden + shrink-0 — the
topbar's s17 two-level avatar is the house stock-mirror precedent).

**The L-family:** L-84c4 the deals badge — the reference's zn Badge
carries ONLY `mt-1 text-xs` (the DEFAULT dark variant + the RAW stage
slug); ours appended the OPP_STAGE_META colored map. The colored-map
family is the reference's OWN DASHBOARD badge (its Recent Deals
`zn` rides its `P[N.stage]` map) — our dashboard surface keeps the map
(pin-pinned by dashboard-contracts); the insights badge is the bare
dark form (LIVE post-fix: lab(7.78) ≈ #171717 + neutral-50 text).
L-84c5 the activities fallback icon — the reference's `qd` is lucide
CALENDAR (the blank-body glyph, the s17 sidebar census family); ours
shipped CalendarDays (the s28 header comment's own claim misread the
alias — LIVE pre-fix: lucide-calendar-days 20px on the meeting row).

**N-84c6:** the initials FORMULA — the reference renders
`d.name.split(" ").map(g=>g[0]).join("")` with NO `.toUpperCase()` and
NO fallback; ours added the uppercase (behavior-identical on the
capitalized seed — mirrored for source parity, the topbar's "the
FORMULA is the parity" precedent). The local `initials()` helper
retired.

**The gate:** lint 0/0 · tsc 0 · **1670/1670 unit (93 suites, +21)** ·
build clean · **132/132 e2e on a fresh CI=1 boot (3.3m, FIRST run
green, all 9 mobile-nav checks green)**. Non-vacuousness PROVEN at the
pre-fix state (only the test files modified): **12 failed | 1658 passed
(1670 total)** — exactly the modified-pin set (the new
insights-parity suite's 11 + the re-anchored insights-vocabulary pin),
ZERO collateral. LIVE: the three stat icons (trending-up/target/users
24px); the initials circle (rounded-full/relative/hidden/shrink-0,
40×40, "TN"); the deals badge (the dark stock primary + "prospecting"
raw); the blank-body calendar fallback 20px; the drawer at TRUE 390px
(full-bleed overlay, 8 links, dual scroll-lock, focus inside,
navigate-close + locks released, the closed overlay inert +
visibility:hidden); zero overflow; the closing census MATCH (db
pristine + the reference md5-exact, the 55th consecutive stable
session). Screenshots 107 (the insights stat icons + the activities
rows) + 108 (the contacts initials circles) — VLM 4/5 [the (4) note is
the correct type-map: Phone on the call row, Calendar on the meeting
row] + 4/4 PASS.

**The intake layers:** drift sweep #80 — the app bundle byte-identical
for the 55th consecutive session; the /static/* platform shell still
renders the login page but the live app loads only the old /assets
pair (no app-code migration). Reference census #80: demo zero, the
mobile-nav defect standing at TRUE 390px, desktop normal. 84-a: the
s83 re-audit 12/12 GENUINE + zero material findings + 4 nanos (the
PAD:774 "4 spec files" stale carrier re-derived this session); 84-b:
ZERO graduations 12/12 (the 41st consecutive), the 8 censuses clean,
both operator decisions standing (the 43rd re-affirmation; the
orchestrator's 44th).

## 16by. Session-85 Layer (the reports tab-content rotation)

**What shipped:** the reports tab-content family — the standing
session_165 suggested target (the cCe/ZEe/e3e/t3e/r3e table + chart
chrome that s74's labels/PDF/cells pins never fully walked). Full
decode of the reference's five tab components from the byte-stable
bundle + the LIVE probe on BOTH apps (each tab's DOM censused
side-by-side). The N-85 family: 1 L + 4 N.

**The L-family:** L-85c1 the ACCOUNT EM-DASH FALLBACKS — the
reference's Recent Won Deals row renders `ht children:d.account_name`
and its Deals at Risk row `ht children:p.account_name` — the BARE
field, NO fallback (a null account renders an EMPTY cell). Ours
shipped `{d.account ?? "—"}` at both sites — the L-82c4
invented-fallback genus (the reference's own "$"-alone deals amount was
the s82 precedent). Invisible on the seed (all 12 opps carry accounts
— probed) but LIVE-exercisable (an opportunity without an account
renders "—" ours / empty reference).

**The N-family:** N-85c2 the TAB-1 GRID SPLIT — the reference's cCe
renders THREE grid children (`grid grid-cols-1 lg:grid-cols-2 gap-6`
×3 — Revenue+WonLost, Pipeline+Funnel, then the tables); ours wrapped
all four charts in ONE grid (root children 2 vs the reference's 3) —
visually identical (all charts height 300 + gap-6), a structural
mirror. N-85c3 the FORECASTING-ACCURACY HEADER — the reference's ZEe
ships that ONE CardHeader with `flex flex-row items-center
justify-between` appended (LIVE-computed `space-y-1.5 p-6 flex
flex-row items-center justify-between`); the ChartCard helper gained
the `headerClassName` escape. N-85c4 the AVERAGE-ACCURACY CAPTION —
the reference wraps `div.mt-4.text-center > p.text-sm.text-gray-500 >
["Average Accuracy: ", " ", span.font-bold.text-lg.text-gray-900]`;
ours merged into a single p — the div>p construction mirrored. N-85c5
the OVERDUE DUE-DATE EM-DASH — the reference's e3e filter carries the
DATE-PRESENT guard (`f.date &&`) and renders
`Tc(li(f.date),"MMM d, yyyy")` BARE; ours filtered on the activityDate
createdAt fallback (including dueAt-less rows) and shipped a dueAt
ternary with an em-dash. The guard mirrored, the bare render landed,
the wire type narrowed dueAt to string (the API maps the GUARANTEED
date). Dead in practice (the dialog requires dueAt; the seed's 23
activities all carry one — probed).

**The foundations SOLID** (verified, not fixed): all five tab
root/grid structures; the chart internals — the tab-1 revenue SINGLE
#3b82f6 strokeWidth-2 line + the $ tooltip, the won-vs-lost grouped
bars + the stock Legend, the tab-1 violet "Value ($)" bars + the plain
toLocaleString tooltip, the funnel's #06b6d4 vertical bars + the stage
YAxis at width 100, the tab-2 forecast two-line trend + the tab-2
BLUE #3b82f6 pipeline bars (the tab-1/tab-2 fill divergence is the
reference's own — ours mirrors), the forecast pie's `${band}%: $XK`
labels + outerRadius 90, the aging violet bars + the fixed 4 buckets,
the tab-3 by-type PIE + the 5-color palette, the tab-4 source PIE +
the #10b981/#8b5cf6 bars, the tab-5 health PIE + outerRadius 100 +
the ["#10b981","#f59e0b","#ef4444"] palette + the Top-10 horizontal
bars; all ten table heads/cells/empty states; the dB export component
= our two-button construction verbatim; the s31 derivations; the
N-48b label display-case parity; the raw-source renders; the `$XK`
revenue cell.

**The gate:** lint 0/0 · tsc 0 · **1687/1687 unit (94 suites, +17)** ·
build clean · **132/132 e2e on a fresh CI=1 boot**. Non-vacuousness
PROVEN at the pre-fix state (only the test files modified): **10
failed | 1677 passed (1687 total)** — exactly the modified-pin set
(the new reports-tabcontent-parity suite), ZERO collateral. One
mid-flight pin-shape repair (the grid-count anchor 5 → 8 — the
tab-3/4 tables + the tab-5 pair undercounted) + the overdue-guard
now.getTime() shape. LIVE: the tab-1 root's THREE grid children; the
tab-2 fcHeader's flex-row family; the caption div>p; the overdue bare
dates; the drawer battery green at TRUE 390px (full-bleed overlay,
w-72 panel, 8 links, dual lock, focus inside, navigate-close, closed
inert+hidden); zero overflow; the closing census MATCH (db pristine +
the reference md5-exact, the 56th consecutive stable session).

**The intake layers:** drift sweep #81 — the app bundle byte-identical
for the 56th consecutive session; the /static/* platform shell still
renders the login page but the live app loads only the old /assets
pair (no app-code migration). Reference census #81: demo zero, the
mobile-nav defect standing at TRUE 390px, desktop normal. 85-a: the
s84 re-audit 6/6 GENUINE + zero material findings + 3 nanos (the
SKILL H1 v1.80.0 stale carrier — the actionable one, fixed this
session; corroborated by 85-b); 85-b: ZERO graduations 12/12 (the
42nd consecutive), the 8 censuses clean, both operator decisions
standing.

**The operator decisions (45th re-affirmation):** the CSV
formula-injection posture (b) STANDS — the guard intact at
csv.ts:31-33 applied in escapeCell AND entity-export.ts's qq; ZERO
new unguarded builders (the 85-b census); the tab-content family
rides the SAME two export seams (exportTableCsv → toCsv → escapeCell;
exportTablePdf) — no new CSV surface. The source-vocabulary documented
parity STANDS — every anchor re-confirmed at file:line; the family
introduces NO vocabularies (the raw stage/status slugs + the
ACTIVITY_TYPE_META label map are the existing pinned sets; the
overdue table's "note" exclusion mirrors the reference's own "Note"
guard).


**The operator decisions (44th re-affirmation):** the CSV
formula-injection posture (b) STANDS — the guard intact, ZERO new
unguarded builders (the 84-b sweep); the insights family builds no CSV
surface. The source-vocabulary documented parity STANDS — every anchor
re-confirmed at file:line; the family introduces NO vocabularies (the
raw stage slug + the ACTIVITY_TYPE_META label map are the existing
pinned sets).


## 16bz. Session-86 Layer (the accounts filter-rail rotation)

The standing session_165 alternate — the Oce rail's own chrome — walked
for the first time (s28 pinned the rail's structure; s17 the CHECKBOX
anatomy; s13 the titles; nobody had decoded the rail's SELECT family,
the page's filter memo, the tier derivation, or the export's row basis).
Every claim decoded from the byte-stable reference (the Oce rail +
the accounts page memo/filter/row/KPI family + the bce/wce dialogs) +
LIVE-probed on BOTH apps (the reference's rail DOM censused at 1440;
our dev server's table/search/rail DOM-censused side-by-side).

**The N-86 family (2 M + 2 L + 3 N):**

- **M-86c1 — the account STATUS VOCABULARY SPLIT.** The reference's
  bce CREATE and wce EDIT dialogs both ship the Status trio
  Active/Inactive/Prospect. Our EDIT config had it right (the s28 wce
  decode) — but ACCOUNT_STATUSES and BOTH API validators carried
  active/inactive/churned, so the edit dialog's own offered Prospect
  option ALWAYS 400'd ("Invalid status"). The s54 retirement killed
  the dead ACCOUNT_EDIT_STATUSES constant but kept the divergent live
  vocabulary (its "stale s28 decode" note mis-read WHICH surface the
  trio rode). FIXED: the unified trio (ACCOUNT_STATUSES +
  ACCOUNT_STATUS_META.prospect [amber — ours; the reference never
  badges account status] + the seed's Sahara churned→inactive + the
  schema comment). The create dialog + both validators follow the
  constant; the option now SAVES (LIVE-verified end-to-end: Prospect
  selected → Save → the dialog re-opens at "Prospect").
- **M-86c2 — the COMPUTED-TIER derivation.** The reference derives
  every account's tier from its revenue (`te = U.annual_revenue > 1e6
  ? "Key" : > 5e5 ? "A" : > 1e5 ? "B" : "C"` — the N memo) and
  consumes the computed value at the row (the bg-yellow-50/30 tint +
  the filled star + the tier badge), the Key Accounts KPI, the tier
  checkbox filter ("Key Account" → computed "Key"), and the CSV
  exports (E.map's fe.tier). OURS read the STORED isKey/tier —
  rendering 4 Key + an A/B/C spread on the seed where the reference's
  formula renders 9 Key + 1 A (LIVE-probed: tierBadges
  [B,C,B,Key,B,Key,Key,Key,B,C] pre-fix → [Key,A,Key,Key,Key,Key,
  Key,Key,Key,Key] post-fix; stars 4→9; tints 4→9; the KPI 4→9).
  FIXED: the new `src/lib/account-tier.ts` seam
  (`accountTierFromRevenue` — null-safe, the boundary matrix
  unit-pinned) consumed at all six sites (row, KPI, filter, both CSV
  exports, the Cards badge). The stored columns RETIRED — the schema's
  tier/isKey + `@@index([tier])`, the Account type members, both API
  routes' write/validation blocks, the create payload's hidden
  fields, and the seed's values (the reference models NO tier field;
  a stored-but-never-displayed write seam is the s42 silent-lie
  class). The settings defaultTier editor STAYS (the reference's own
  surface — its default_account_tier is equally unconsumed; the s43
  comment re-derived to the honest dead-default parity).
- **L-86c3 — the SEARCH SCOPE.** The reference's accounts search
  filters NAME ONLY (`U.name?.toLowerCase().includes(e.toLowerCase())`);
  ours matched name+industry+email — searching "logistics" (an
  industry value) returned 2 rows ours where the reference returns 1
  (the name match, Sahara Logistics). FIXED: the name-only predicate
  (the s10-era concat retired).
- **L-86c4 — the EXPORT ROW BASIS + the header binding.** The
  reference's export maps the FILTERED rows (`ee = E.map(...)` — E is
  the filter memo) under the zero-RAW guard (`if (m.length === 0)
  return`), and its header Export CSV binds `disabled: m.length === 0`
  (RAW). OURS mapped ALL accounts and bound
  `disabled: filtered.length === 0`. The s26 comment's "The export
  covers the FULL list, not the filtered view" was a misdecode of the
  same byte-stable bundle; the N-62e annotation had flagged the
  binding as unresolvable — today's decode resolves it. FIXED: rows
  from `filtered`; the binding re-anchored to `accounts.length === 0`;
  both comments re-derived.
- **N-86c5 — the three DEAD SELECTVALUE placeholders.** The
  reference's rail selects carry `placeholder:"John Kuy"` /
  `"Technology"` / `"$1M to $5M"` — dead in both apps (the "all"
  defaults always match an item). Mirrored (the N-83c5 precedent).
- **N-86c6 — the search input's explicit h-9.** The reference's
  input carries `pl-9 h-9` (the h-9 redundant with its stock base);
  ours rode the base's h-9. Mirrored for source parity (the N-85c6
  precedent).
- **N-86c7 — the SUPERSET DOCUMENTATION.** The reference's Owner +
  Revenue Range selects are DEAD filters (its memo reads
  name/industry/tiers only — d.owner/d.revenue are tracked state,
  never read); its Save All has NO onClick; its Owner/Industry item
  sets are STATIC literals (All Owners/John Kuy + the five
  industries). OURS filter/reset/map live (fix-over-defect) — all
  four now carry the in-code superset comments the S33-P1/S47-P1
  conventions require (plus the search icon's pointer-events-none
  click-through fix documented against the reference's 16x16
  dead-zone icon).

**The React-Compiler hazard (GREEN-phase):** the rewritten filter memo
initially tripped `react-hooks/preserve-manual-memoization`
("Existing memoization could not be preserved") — NOT the memo body
(the imported-seam call was innocent) but `exportAccounts`
FORWARD-REFERENCING `filtered`, a const declared LATER in the
component body: the compiler's flow analysis bails on the
forward-reference and reports the bail at the first manual memo. The
fix: the function moved below the memo it reads (a zero-cost reorder).
Bisected live — the memo-body variations all failed while the calls
were neutralized, isolating the declaration order.

**The operator decisions (46th re-affirmation):** the CSV
formula-injection posture (b) STANDS — the guard intact at
csv.ts:31-33 applied in escapeCell AND entity-export.ts's qq; ZERO
new unguarded builders (the 86-b census); the family rides the same
two export seams. The source-vocabulary documented parity STANDS —
every anchor re-confirmed at file:line. The family introduces ONE
vocabulary change: the account STATUS trio unifies on the reference's
own active/inactive/prospect (a parity RESTORATION — the reference's
dialogs are the source), and the tier vocabulary retires from the
stored model (the computed seam carries the same four-value display
vocabulary the reference itself renders).

**The pin suite:** `tests/accounts-rail-parity.test.ts` (25 its —
6 status + 10 tier [the boundary matrix + the six consumption sites +
the five retirement negatives] + 3 search + 3 export + 3 rail), all
pinned RED-first: 19 failed | 1693 passed (1712 total) at the pre-fix
state — exactly the new pin set, ZERO collateral. 2 mid-flight
pin-shape repairs (both on green anchors: the railRegion slice +
the Save All quote form) + 3 more at GREEN (wrong anchors on the
table row/Cards badge/header binding — the fixes were all in place,
the pin windows were wrong). The lockstep re-anchors: the
api-robustness isKey rows (2) + the POST tier row retire with the
write seams; the entity-export header-binding pin re-anchors to the
RAW form; the contact-model s54 comment re-derives; the
dead-code-hygiene N-65d comment re-derives.

GATE: lint 0/0 · tsc 0 · **1709/1709 unit (95 suites, +22 net)** ·
build clean · **132/132 e2e on a fresh CI=1 boot (3.2m, FIRST run
green; all 9 mobile-nav checks green)**. LIVE (the fixed dev server):
the computed family (9 Key + 1 A badges, 9 stars, 9 tints, the KPI at
9); the name-only search ("logistics" → the 1 name-match row);
the Prospect save (selected → saved → persisted; the db reset after);
the header export enabled at a non-empty filter; the rail trio
rendering their "All X" values + Save All + the blue Filter button;
the drawer at TRUE 390px (the full-bleed overlay, the w-72 panel at
left-0, 8 links all visible, focus INSIDE [the close button — the
panel-header focusable], dual scroll-lock, navigate-close + locks
released, the closed overlay inert + visibility:hidden); zero
overflow; the closing census MATCH (db pristine after the probe
reset + the reference md5-exact re-fetched, the 57th consecutive
stable session). Screenshots 112 (the accounts rail + the
computed-tier table) + 113 (the edit dialog's Status trio) + 114
(the mobile drawer at 390) NEW — VLM 112 = 3/5 (both NOs
DOM-disproven VLM-scale artifacts: the "Kev" misread + the 16px-icon
star undercount) + 113 = 3/3 + 114 = 4/4.


## 16ca. Session-87 Layer (the dashboard KPI-family rotation)

The standing session_167 alternate — the KPI cards' own inner
construction — walked for the first time (s12 pinned the de-hover +
the label gray-600 + the container token; s27 the statics + the
geometry strings; s78 the raw-percentage bars; nobody had walked the
card's Card/CardContent split, the label/value row divs, the spark's
double-container nesting, the bars' span/div + class/inline color
mechanisms, the chart headers' inner-row structure, or the filter
bar's source-level chrome). Every claim decoded from the byte-stable
reference (the six KPI cards' ot/ct constructions + the Eke filter
bar + the six chart-card Ht headers) + LIVE-probed on BOTH apps (the
reference's six cards + six headers + filter bar censused at 1440
AND 390; our dev server's KPI row DOM-censused side-by-side incl.
the computed colors).

**The N-87 family (1 M + 2 L + 5 N):**

- **M-87c1 — the AVG-SALES-CYCLE SUFFIX COLOR.** The reference's
  "days" suffix is `span.text-xs text-gray-600 mb-1` (LIVE
  rgb(75,85,99) = gray-600 #4b5563); OURS shipped
  `span.mb-1 text-xs text-muted` (LIVE rgb(107,114,128) — our
  `--color-muted` #6b7280 = gray-500, one step lighter). The s12
  rotation fixed the LABEL from text-muted to text-gray-600 but the
  suffix kept the token — the missed sibling, LIVE-visible on the
  seed.
- **L-87c2 — the SPARK CONSTRUCTION.** The reference renders ONE
  slot div per KPI card — `mt-2 h-8` (the line/area cards) or
  `mt-2 h-8 flex items-end gap-1` (the three bar cards) — with the
  chart as the DIRECT child: the line/area ResponsiveContainer sits
  bare inside the slot; the bar cards put bare `div.flex-1
  bg-cyan-400|bg-green-400 rounded-sm` bars (the STATIC colors as
  Tailwind bg-CLASSES + the raw-percentage inline heights; the Sales
  Target variant carries the inline `backgroundColor: E<4 ?
  #fbbf24 : #3b82f6`). OURS nested TWO containers on every card (the
  KpiCard's `mt-2 h-8` wrapper + the Sparkline's own
  `flex h-8 items-end gap-1` / `h-8 w-full` div — a doubled h-8),
  rendered the bars as SPANs with inline hex backgroundColor on ALL
  cards, added `aria-hidden` the reference never carries, and the
  reports' CircleStatCard slots held the same intermediate div (the
  reference's `flex-1 h-12 mr-2` slot holds the RC directly — the
  bundle's own construction). The Sparkline is now content-only (the
  bare RC / the bare bar divs with the `flex-1 ${barClassName}
  rounded-sm` template); the KpiCard owns the variant-aware
  `sparkClassName` slot; the `className` prop retires; the reports'
  `className="h-full"` overrides retire.
- **L-87c3 — the KPI CARD'S STRUCTURE.** The reference ships `Card`
  (the stock component, NO padding) > `CardContent` with
  `className="p-4 sm:p-6"` > [a LABEL-ROW `div.flex justify-between
  items-start mb-2` wrapping the label span, a VALUE-ROW `div.flex
  items-end gap-2` BARE (the label row's mb-2 provides the gap; NO
  mt-2, NO flex-wrap — a long value+delta OVERFLOWS on the reference
  where ours wrapped), the spark slot]. OURS shipped ONE div with
  the padding MERGED, a BARE `<p>` label, a value row that ADDED
  mt-2 + flex-wrap, and `<p>` value + `<span>` delta/note elements.
  The KpiCard now renders Card > CardContent(KPI_CARD.content) with
  the labelRow/valueRow tokens, a span value, div delta/valueNote,
  and the span suffix.
- **N-87c4 — the three dead SelectValue placeholders.** The
  reference's filter-bar selects carry `placeholder:"Stage"` /
  `"Format"` / `"Source"` — the stage/source pair mirrored (dead in
  both apps; the values always match their "all" items). The view
  switcher's "Format" CANNOT mirror: the reference's is dead only
  because its value is the FIXED no-match constant "format" (Radix
  renders EMPTY for a non-empty value with no item); OUR functional
  `""` default would RENDER the placeholder — the emptyLabel stays
  `""` with the mechanism documented at the token.
- **N-87c5 — the Filter button's bare `sm:w-auto`.** The reference
  carries ONLY `sm:w-auto` (the flex-col bar's default stretch
  full-widths it at mobile); ours added `w-full` — computed-equal
  (LIVE-verified at 390 + 1440), the N-86c6 mirror genus.
- **N-87c6 — the search input's explicit `h-9`.** The reference's
  dashboard search input is `pl-9 h-9` (both explicit); ours shipped
  `pl-9` (the Input base's h-9 computes it). The N-86c6 EXACT
  precedent (the accounts search got the same mirror at s86).
- **N-87c7 — the chart-card headers' inner-row structure.** The
  Sales Pipeline card ships the BARE stock CardHeader (title only —
  no trailing element); the other FIVE cards (Revenue Over Time /
  Top Reps / Lead Sources / Upcoming Activities / Recent Deals) nest
  a `div.flex justify-between items-center` row INSIDE the stock
  CardHeader (the FILTER_RAIL mechanism — passing the row class
  directly to CardHeader would keep the column direction). OURS
  flattened all six (`CardHeader className="flex-row items-center
  justify-between"`, twMerge-resolved) — now nested per the
  reference (72px measured equal both ways). PLUS the "Last 6
  months" span: the reference `text-xs text-gray-500`; ours
  `text-xs text-muted` (both #6b7280 — computed-equal, the literal
  mirrored).
- **N-87a1 — the vacuous tier row.** The api-robustness dead-`??`
  it.each still listed the `accounts/[id]/route.ts` + `tier` row —
  vacuously green since the s86 stored-tier retirement; retired with
  the retirement comment (the isKey siblings' precedent).

**The lockstep re-anchors:** the page-layout KPI_CARD.card pin (the
merged-div token retired with the split — the pin re-anchors to the
content/labelRow/valueRow tokens + the no-card negative); the
dashboard-family-parity bars-arm pin (the container moved to the
KpiCard's sparkClassName — the slice re-anchors to the bare
fragment) + the KPI_SPARK.bars doc-string pin (the single-slot
construction) + the slice window; the reports-filter-parity
LineChart pin (the margin prop retired — the recharts default IS
the 5px margin the reference inherits by passing none).

GATE: lint 0/0 · tsc 0 · **1733/1733 unit (96 suites, +24 net: +25
new − 1 vacuous-retired)** · build clean · **132/132 e2e on a fresh
CI=1 boot (3.2m, FIRST run green; all 9 mobile-nav checks green)**.
LIVE (the fixed dev server, both apps probed): the suffix computing
gray-600 rgb(75,85,99) (was rgb(107,114,128)); the Deals Closed
spark the SINGLE `mt-2 h-8 flex items-end gap-1` container with 7
DIV bars `flex-1 bg-cyan-400 rounded-sm` + the raw heights; the
card0 walk Card > `p-4 sm:p-6` > [labelRow, valueRow, `mt-2 h-8`];
the six headers (Pipeline the bare stock `flex flex-col space-y-1.5
p-6`; the other five the nested `flex justify-between items-center`
rows); the Filter button's bare sm:w-auto; the search input's pl-9
h-9 at 36px; the "Last 6 months" span the literal text-gray-500;
the drawer at TRUE 390px (the full-bleed overlay, the w-72 panel at
left-0 computing the reference's own sidebar blue rgb(37,99,235), 8
links all visible, focus INSIDE, dual scroll-lock, navigate-close +
locks released, the closed overlay inert + visibility:hidden); zero
overflow; the closing census MATCH (db pristine + the reference
md5-exact re-fetched — the 58th consecutive stable session).
Screenshots 115 (the KPI row) + 116 (the chart headers + filter
bar) + 117 (the mobile drawer at 390) NEW — VLM 115 = 5/5 + 116 =
4/4 + 117 = 3/4 (the one NO — "blue, not white" — a prompt
artifact: the panel correctly mirrors the reference's own sidebar,
which computes the SAME blue rgb(37,99,235)).

## 16cb. Session-88 Layer (the contacts filter-panel + stat-card rotation + the v3-palette re-pin)

The standing session_171 first-listed alternate — the kke panel's own
chrome + the Rx stat cards + the Cke toolbar/export/shrink family —
walked for the first time (s28 pinned the panel structure + the
checkbox anatomy, s75 the memo + the row construction, s82 the
slide-over chrome; nobody had walked the stat card's Card/CardContent
split, the chip's class-vs-inline mechanism, the trend row, the row
icon identities, or the export's disabled binding) — PLUS the
rotation's root-cause discovery: a systematic v3-vs-v4 palette
comparison of every literal palette class used in `src/` against the
reference's compiled stylesheet. Every claim decoded from the
byte-stable reference bundle + LIVE-probed on BOTH apps.

**The N-88 family (4 M + 3 L + 4 N + the 3 audit nanos):**

- **M-88c1 — THE V4 PALETTE DIVERGENCE (the root cause, family-wide).**
  Tailwind v4's default palette is NOT v3's palette expressed in oklch
  — it was re-derived, and the chromatic families compute DIFFERENT
  colors: v4 blue-600 = `#155dfc` rgb(21,93,252) where the reference's
  v3 `bg-blue-600` = rgb(37,99,235) `#2563eb`; v4 red-600 rgb(231,0,11)
  vs v3 rgb(220,38,38) (Δ38); green-400 Δ69; amber-400 Δ36; purple-600
  Δ35; cyan-400 Δ34; green-500 Δ34 (browser canvas pixel reads on our
  dev server vs the rgb triplets in the reference's compiled
  `index-Be9epoFc.css`). **56 of the 118 plain literal classes used in
  `src/` diverged visibly** (the gray/slate families by an
  imperceptible Δ≤3) — plus every `hover:`/`from:`/`via:`/`to:` form
  reading the same tokens. The S15-P12 note documented this hazard for
  ONE surface (the Event dialog submit → the token pair) but the family
  was never swept: the accounts Filter button shipped the literal
  `bg-blue-600 hover:bg-blue-700` (LIVE `lab(44.06…)` where the
  reference computes rgb(37,99,235)); the s87-pinned spark bars
  rendered v4's more-electric chroma; every `text-red-600` overdue
  surface, every `text-blue-600` link/icon, every badge-map tint. The
  fix is the fifth member of the v4 re-pin family: **the @theme
  v3-palette re-pin — 92 tokens covering every literal (family, step)
  pair used in `src/`** (values from the standard v3 default palette,
  verified against the reference's compiled CSS on 97 rules with ZERO
  mismatches; the census pinned by the new suite's token-count test).
  The S15-P12 hazard comment re-derived (the hazard retires
  family-wide; the token pair remains the sanctioned form where it
  predates the pin). LIVE-verified post-fix: every probed class
  computing the reference's exact rgb.
- **M-88c2 — THE TABLE'S LAST-ACTIVITY ICON: Zap → Activity.** The
  reference's `AC=tr("Activity")` — the pulse icon — on every table
  row; ours rendered `Zap` (the M-82c2 slide-over fix's missed
  sibling). LIVE-visible on every row.
- **M-88c3 — THE AWARD/CROWN PAIR.** The reference's `wT=tr("Award")`
  — consumed at BOTH the stat card's Top Decision Makers icon AND the
  name-cell amber overlay; the bundle contains NO Crown at all. Ours
  rendered `Crown` at both sites. The M-84c1/c2 icon-identity genus.
- **M-88c4 — THE SOURCE LABEL CASE.** The reference's kke Source group
  renders the labels CAPITALIZED (`charAt(0).toUpperCase()+slice(1)` →
  Call/Email/Website/Partner/Referral) with the id staying
  `source-${value}` lowercase; ours rendered the raw lowercase values —
  LIVE-visible on the panel.
- **L-88c5 — THE STAT CARD CONSTRUCTION** (the L-87c2/c3 genus). The
  reference's `Rx`: `Card` (the stock component, the gradient
  className) > `CardContent "p-6"` > the `div.flex items-start
  justify-between` row > [`div.flex-1` (the label p + the value p +
  the trend row), the chip `div.p-3 rounded-lg ${iconColor}` where
  iconColor is a CLASS STRING]. The trend row: `div.flex items-center
  gap-1` > [TrendingUp|TrendingDown `w-4 h-4 text-green-600|
  text-red-600` + the direction-colored span]. OURS shipped ONE merged
  div (the p-6 on the card, the flex directly on the card), the chip
  via inline-style hex + shrink-0 + aria-hidden, and the trend row as
  a SPAN with a colorless aria-hidden icon and no down variant. The
  IconStatCard contacts arm now renders the Card > CardContent split
  with the `iconColor` class mechanism + the `trendDir` direction; the
  dead subValue retired from this arm; `tone`/`color` retire.
- **L-88c6 — THE EXPORT DISABLED BINDING.** The reference binds
  `disabled: $.length === 0` (the RAW list) and its export maps the
  RAW rows under the RAW zero guard (ours matched on both); OURS bound
  `filtered.length === 0` — the s63 G-4/N-62e note kept it as
  "unresolvable LIVE"; the bundle resolves it (the s76
  bundle-beats-live lesson). LIVE-exercisable: filter-to-empty → the
  export now stays ENABLED (15 raw contacts), matching the s86
  L-86c4 accounts fix.
- **L-88c7 — THE mr-[500px] DETAIL SHRINK.** The reference's inner
  scroll area appends `mr-[500px]` while the Pke detail slide-over is
  open, pushing the table left so nothing hides under the 500px panel;
  ours kept the static form (the table sat UNDER the fixed overlay).
  Fixed with the conditional class on the inner scroll div
  (LIVE-verified: computed marginRight 500px with the panel open).
- **N-88c8 — THE MOBILE BADGE EXTRAS.** The reference's mobile-card
  priority badge renders the map value ONLY (the Badge base's
  font-semibold = 600 stands); ours appended `border font-medium` —
  the font-medium won the twMerge conflict (500 vs 600). The extras
  retired (LIVE-verified weight 600).
- **N-88c9 — THE FILTERS BUTTON'S aria-expanded** — our accessibility
  superset (the reference's button carries only the variant ternary +
  the toggle); documented per the S33-P1/S47-P1 convention.
- **N-88a1/a2 (the 88-a audit nanos)** — the api-robustness s43-P2
  describe title still read "nine" (8 rows post the N-87a1
  retirement); the page-layout :842 s11 comment still referenced the
  retired KPI_CARD.card member. Both re-derived.
- **N-88b1 (the 88-b audit nano)** — the s87 screenshots 115 + 116
  were byte-identical duplicates; 116 re-captured on the chart-headers
  surface (new md5, distinct from 115).

**The kke panel itself verified BYTE-EXACT** (the s28+s75 layers
hold): the wrapper (incl. the z-40 + lg:static lg:shadow-none), the
scroll container + the sticky header, the six Card groups in the
reference's order, the checkbox rows with the matching id/htmlFor
wiring, the toolbar card, the variant-ternary Filters button, the Pke
slide-over, the name cell, the role select, the engagement bars, the
source badge, the actions row, the G memo, the sort default, the ce
formatter.

RED: **17 failing pins exactly** (the new contacts-family-parity
suite). Non-vacuousness PROVEN at the pre-fix state: **17 failed |
1733 passed (1750 total)** — exactly the new pin set, ZERO collateral.
2 mid-flight pin-shape repairs (the census count 91→92 after the new
bg-amber-500 call-site class entered the set; the contactsArm window
anchored past the comment that names the retired arms).

GATE: lint 0/0 · tsc 0 · **1750/1750 unit (97 suites, +17 net)** ·
build clean · **132/132 e2e on a fresh CI=1 boot (3.2m, FIRST run
green; all 9 mobile-nav checks green)**.

LIVE (the fixed dev server): the palette family computing the
reference's exact rgb on every probed class (blue-600 rgb(37,99,235);
red-600 rgb(220,38,38); cyan-400 rgb(34,211,238); green-400
rgb(74,222,128); amber-400 rgb(251,191,36); purple-600 rgb(147,51,234);
gray-600 rgb(75,85,99)); the stat card walk Card > p-6 > the row with
the bg-class chip + the trend row div; the Activity row icon + the
Award pair; the Source labels capitalized; the export ENABLED at
filter-to-empty; the scroller at marginRight 500px with the detail
panel open; the mobile badge at weight 600; the drawer at TRUE 390px
(the full-bleed overlay, the w-72 panel at left-0 computing the
sidebar blue rgb(37,99,235), 8 links all visible, focus inside, dual
scroll-lock, navigate-close + locks released, the closed overlay
inert + visibility:hidden); zero overflow; the closing census MATCH +
the reference md5-exact re-fetched (the 59th consecutive stable
session). Screenshots 118 (the stat cards + the open filter panel) +
119 (the table with the Activity/Award icons) + 120 (the mobile drawer
at 390) NEW + the 116 RE-CAPTURE (the N-88b1 duplicate replaced) —
VLM 118 = 4/5 (the one NO a below-the-fold framing artifact, the
Source labels DOM-verified) + 119 = 3/5 (both NOs framing/data
artifacts — 5 of 15 rows visible, no At Risk rows in the visible set;
the two KEY icon questions both YES) + 116 = 2/4 RAW / 4/4 effective
(both NOs prompt errors — the uniform-#3b82f6 vertical bars ARE the
reference's own bundle construction) + 120 = 4/4.


## 16cc. Session-89 Layer (the leads stat-card family — the Sm decode)

The remaining standing alternate per session_173's suggested next —
the Sm KPI-card family's own construction never walked (s11 the
shadow, s29 the derivations, s68/s69 the value typography, s77 the
chip PAIRS). The reference's Sm component fully decoded from the
byte-stable bundle + LIVE-probed on BOTH apps at 1440 AND 390.

**The N-89 family (1 M + 2 L + 4 N + the 3 audit nanos):**

- **M-89c1 — THE VALUE COLOR.** The reference's Sm value span is
  `text-xl sm:text-2xl font-bold text-gray-900` → LIVE
  rgb(17,24,39) #111827; ours shipped the bare responsive form
  inheriting the page ink rgb(10,10,10) — the F-69a1 s69 pin's own
  comment cited the reference's gray-900 but shipped the bare form
  (a misdecode the LIVE probe resolved; the M-87c1 suffix-color
  genus). The DASHBOARD KPI values are bare on the reference too
  (rgb(10,10,10) on both apps) — the explicit class is the leads
  family's own.
- **L-89c2 — THE CARD SPLIT.** Card (bare, no className) >
  CardContent "p-4 sm:p-6" — the merged-padding div retires (the
  L-87c3/L-88c5 genus; the leads arm was the LAST stat-card arm
  standing).
- **L-89c3 — THE CHIP.** The icon-guarded width-first DIV consuming
  STAT_CHIP_PAIRS, chipTone defaulting "blue" (the reference's
  color="blue"); the SPAN + shrink-0 + aria-hidden extras retire.
- **N-89c4 — XCircle → CircleX** (the deprecated alias; the
  reference's BQ=tr("CircleX")).
- **N-89c5 — THE DEAD TREND ROW.** The Sm's number-trend mechanism
  (sign-colored row, w-3 h-3 icons, Math.abs + "%") — dead in the
  reference (no call site passes trend); mirrored via the shared
  prop's number arm, zero behavioral delta.
- **N-89c6 — THE LUCIDE SVG aria-hidden SUPERSET** — documented at
  src/components/ui/icons.tsx (the library injects it on every
  a11y-prop-less icon; the reference's older lucide renders bare
  svgs; an a11y improvement kept on the pinned stack).
- **N-89c7 — THE subValue TRUTHY GUARD** (`subValue &&` — the
  reference's own; behaviorally equal on every real input).

The foundations verified SOLID: the six H-memo derivations (ours
expression-for-expression), the grid token, the chip pairs, the
labels/subValues, the responsive icon classes, the 390px geometry.
RED 10 failing pins (9 new + the F-69a1 re-anchor; non-vacuous:
10 failed | 1749 passed — exactly the modified pin set, ZERO
collateral; 3 mid-flight pin-shape repairs — the subValue parens
form, the Math.abs JSX-children pin [never a template literal], and
the import comment reworded off the retired alias token). GATE:
lint 0/0 · tsc 0 · 1759/1759 unit [98 suites, +9 net] · build ·
132/132 e2e fresh CI=1 [3.2m, FIRST run green; all mobile-nav
green]. LIVE-verified [the value rgb(17,24,39); the Card >
CardContent walk; the chip DIV with no shrink-0/aria-hidden; the
circle-x glyph; 0 trend rows; the 390px state at 358px cards +
20px values + zero overflow; the drawer at TRUE 390px full-bleed +
dual lock + navigate-close + closed inert+hidden; the closing
census MATCH + the reference md5-exact — the 60th consecutive
stable session]. 3 screenshots [121 + 122 + 123, VLM 5/5 + 4/4
effective (both NOs artifacts: one above-the-fold framing
[DOM-disproven], one prompt-premise) + 3/4 (the one NO a VLM-scale
artifact — the dimming the VLM describes IS the DOM-verified
overlay)]. Docs at SKILL v1.87.0 [this section + project_state +
the H1] + README badge 1891 + the suite list + AGENTS/CLAUDE/PAD
at 1759+132 [+ the PAD s89 inventory row + the Total 98/1759] +
session_176.md + the plan + its execution record + the worklog.

## 16cd. Session-90 Layer (the stat-card family construction — the gm/zv/Mx/ay decode)

The activities/calendar table-family chrome rotation (the first-listed
standing alternate per session_176's suggested next): the table/
priority/timeline/rail surfaces walked LIVE first and verified SOLID
(the s6/s7/s16/s23/s27/s73/s76 layers hold), then the stat-card
family FULLY decoded from the byte-stable bundle — all four reference
components (gm/zv/Mx/ay) + all twenty call sites — + LIVE-probed on
BOTH apps.

**The N-90 family (2 M + 4 L + 4 N + the 2 audit nanos):**

- **M-90c1 — THE CALENDAR VALUE COLOR.** The reference's Mx value is
  `text-2xl font-bold text-gray-900` → LIVE rgb(17,24,39); ours bare
  → rgb(10,10,10). The F-70a1 s70 pin's own comment CITED the
  gray-900 + its LIVE color and then shipped the bare form on the
  FALSE "inherited card foreground" premise — the M-89c1 misdecode
  genus on the calendar arm.
- **M-90c2 — THE REPORTS VALUE COLOR.** The ay value carries the same
  explicit gray-900 (LIVE rgb(17,24,39)) — the s74 comment's own
  citation finally landed.
- **L-90c3 — THE CARD SPLIT ×3.** BarStatCard merged /
  TrendStatCard plain-divs / CircleStatCard merged reportsCard — all
  → Card (bare, or the border/hover className on reports) >
  CardContent "p-4"/"p-5". The s89 "EVERY stat-card arm" claim was
  overbroad — these three components were standing.
- **L-90c4 — THE BAR CONSTRUCTION.** The bars are DIVs carrying the
  per-arm bg-CLASS color map + the raw-percentage inline height ONLY
  (gm: blue/green/red/cyan else-GRAY, rounded-sm AFTER; zv:
  blue/green/cyan/red else-PURPLE, rounded-sm BEFORE). The
  CHART_COLORS -400 family + gray retired with zero key-reads.
- **L-90c5 — THE CHIP MECHANISM ×2.** The w-10 h-10 rounded-lg
  ${bg-50} DIV with the icon rendered DIRECTLY carrying
  `w-5 h-5 ${text-600}` — the icon a COMPONENT reference, the color a
  KEY (Mx blue/green/purple/orange; ay + red/cyan). The nested
  chipIcon span, the SPAN chip, the inline bg style, the
  shrink-0/aria-hidden extras and the hex-keyed chip maps all retire.
- **L-90c6 — THE DELTA/TREND ROW.** The DIV `flex items-center gap-1
  text-xs ${up?green-600:red-600}` rows with the width-first w-3 h-3
  icons + the bare span; the muted arm + the wrapper aria-hidden
  retire; the ay row uniquely carries font-medium (dead on the
  reference — no call site passes trend).
- **N-90c7-c10** — the label-row gap-2; the gm/zv value-column arm
  split (gm wraps unconditionally, zv direct); the CircleStatCard
  label DIV `text-xs text-gray-500 mb-1`; the calendar rail's bare
  span "Filters" wrapper.
- **S90-P0 — THE PALETTE EXTENSION.** bg-red-400 #f87171 +
  bg-purple-400 #c084fc — the (family, step) pairs the s88 re-pin
  never covered (our bars rode inline hexes); the literal census
  92 → 94 tokens.

RED 40 failing pins (30 new + 10 re-anchors; non-vacuous: 40 failed |
1748 passed (1788 total) — exactly the modified pin set, ZERO
collateral; 6 mid-flight pin-shape repairs + 6 lockstep re-anchors
the full-suite collateral sweep surfaced: the needle-in-own-docs
class ×2, the prettier-wrap regex, the wrong-file label read, the
sparkline-stroke negative, the ternary order). GATE: lint 0/0 · tsc 0
· 1788/1788 unit [99 suites, +29 net] · build · 132/132 e2e fresh
CI=1 [3.3m; one settings-debounce timing flake on the first run
passed standalone + on the full re-run — the known-sensitive test,
untouched by this session's delta]. LIVE-verified [the calendar +
reports values rgb(17,24,39) (were rgb(10,10,10)); the Card >
CardContent walks; the DIV bars with every new palette pin computing
the reference's compiled v3 values (bg-blue-400 rgb(96,165,250) /
bg-red-400 rgb(248,113,113) / bg-purple-400 rgb(192,132,252) /
bg-gray-400 rgb(156,163,175)); the direct-icon chips; the
activities/accounts values still bare rgb(10,10,10); the 390px state
(358px cards, zero overflow); the drawer at TRUE 390px (the w-72
panel computing the sidebar blue rgb(37,99,235), 8 links, focus
inside, dual lock, navigate-close, the closed root inert + hidden +
pointer-events none); the closing census MATCH + the reference
md5-exact re-fetched — the 61st consecutive stable session]. 3
screenshots [124 + 125 + 126, VLM 5/5 + 4/4 + 4/4]. Docs at SKILL
v1.87.0 [this section + project_state + the H1] + README badge 1920
+ the suite list + AGENTS/CLAUDE/PAD at 1788+132 [the PAD s90
inventory row + the Total 99/1788 + the carried-forward footnote] +
session_179.md + the plan + its execution record + the worklog.


## 16ce. Session-91 Layer (the v4 space-y hazard family — the full-app zero-data screenshot diff)

The 91-c rotation (the first-listed suggested next per session_179.md —
the strong sweep): both apps at the ZERO-DATA state, all 9 pages,
the pairwise pixel diff + the DOM probes. Four pages byte-clean
(accounts/reports 0.00%, calendar/activities 0.01%), the rest explained
(the 2px zero-area chart artifact; the contacts noise + the lucide
superset; the settings picklist-data genus — the reference's picklists
were wiped with its workspace, our own empty-picklist form IS mirrored),
and TWO pages with real finds — plus the bundle decode surfacing the
edit/import arms of the same root cause.

**THE ROOT CAUSE (one family):** v3 compiles `space-y-N` as margin-TOP
on FOLLOWING siblings through `.space-y-N > :not([hidden]) ~
:not([hidden])` at (0,3,0) with a `margin-bottom: calc(N ×
--tw-space-y-reverse)` sidecar; v4 compiles it as margin-BOTTOM on
NON-LAST children inside `:where(& > :not(:last-child))` at ZERO
specificity. Identical for plain block stacks. Divergent when (a) a
non-last child is INLINE (vertical margins do not apply to inline
boxes — every shadcn `<Label>` is `display: inline`), or (b) a
non-first child carries `mb-*` (v3's (0,3,0) rule kills it; v4's
:where preserves it).

- **M-91c1 — THE PROFILE FORM'S COLLAPSED LABEL→CONTROL GAPS ×4.**
  Ref 12px (input margin-top 8 + the 4px inline strut) vs ours 4px
  (the label's ignored margin-bottom); the form 472 vs 504px. The
  fix: `PROFILE_LAYOUT.controlMt: "mt-2"` — the FOURTH controlMt of
  the s14/s15 family (SETTINGS_DEFAULTS / SETTINGS_DANGER /
  DIALOG_GROUP) — applied to the avatar row + the Full Name / Email /
  Role inputs.
- **M-91c2 — THE LEADS TOOLBAR'S DEAD mb-4.** The reference's
  filters-row `mb-4` computes 0px (the v3 space-y rule kills it at
  (0,3,0)); ours kept it alive → the toolbar 137 vs 121px, the table
  16px lower, the card 262 vs 246px. The fix: the class retires (the
  s11 rule — re-derive from the reference's COMPUTED gap, never copy
  the class string).
- **L-91c3 — THE EDIT-DIALOG GROUPS.** The reference's wce/Mke/
  Edit-Lead field groups are BARE unclassed divs (the
  DIALOG_BARE_GROUP form the s15 decode documented for the
  Event/Activity dialogs, never re-derived for the EDIT family); ours
  shipped space-y-2 computing 4px only through the v4 accident. The
  fix: the bare construction.
- **L-91c4 — THE IMPORT DIALOG'S SELECT FILE GROUP.** Ref 12px vs
  ours 4px. The fix: mt-2 on the dropzone wrapper.
- **N-91c5 — THE GENUS SWEEP.** The space-y census swept (session-92
  F-92a1 re-derivation: the s91 prose said "all 99 space-y usages" —
  not re-derivable by any method; the documented census is 111
  comment-stripped space-y occurrences across the 19 src files that
  carry one, the algorithm living in the s92 dialog-geometry-parity
  suite): the four finds are the complete set (the other toolbars
  carry no space-y; the create dialogs + settings carry controlMt;
  the rail/save-report labels are block; the checkbox stacks are
  block rows).
- **The audit nanos** — G-91a1..a5 + B-1/B-2 (the count-in-comment
  genus guard re-run): the stat-value-contract + reports-filter-parity
  headers re-derived off the retired "bare" premises; the
  dead-code-hygiene parenthetical re-derived (red/violet/emerald);
  the ACTIVITY_KPI_STATICS comment re-derived off the retired
  CHART_COLORS.gray; the PAD 8→9 miscount; the "four surviving
  components" wording; the constants -400 enumeration.

RED 9 failing pins (13 new; non-vacuousness: 9 failed | 1792 passed —
exactly the modified pin set, ZERO collateral, re-proven via the src
stash after the pin-shape repairs; 5 mid-flight repairs: the cn()/
token forms ×2, the needle-in-own-docs comment-strip, the
comment-window width, the foundation anchor). GATE: lint 0/0 · tsc 0 ·
1801/1801 unit [100 suites, +13 net] · build · 132/132 e2e fresh CI=1
[3.2m; the known settings-debounce focus flake on the first run passed
standalone AND on the full re-run]. LIVE-verified [the profile gaps
12px + the form 504px; the leads toolbar 121px + the table at y496;
the edit groups BARE at 4px; the import gap 12px; the drawer battery
at TRUE 390px; THE ZERO-DATA RE-DIFF: leads 2.17% → 0.00% + profile
2.08% → 0.00% — both BYTE-CLEAN; the closing census MATCH + the
reference md5-exact — the 62nd consecutive stable session]. 3
screenshots [127 + 128 + 129, VLM 5/5 + 5/5 + 5/5]. Docs at SKILL
v1.88.0 [this section + project_state + the H1] + README badge 1933 +
the suite list + AGENTS/CLAUDE/PAD at 1801+132 [the PAD s91 inventory
row + the Total 100/1801 + the footnote] + session_182.md + the plan
+ its execution record + the worklog.


## 16cf. Session-92 Layer (the dialogs-at-390 family walk — the phantom-mb select-trigger genus)

The 92-c rotation walked every dialog family at TRUE 390×844 on BOTH
apps. The outer chrome was SOLID everywhere; four real finds came out
of the interiors — three of them new faces of the v4 space-y genus.

- **M-92c1 — THE PHANTOM-MB SELECT-TRIGGER GENUS.** Radix renders a
  hidden native `<select>` (position:absolute, aria-hidden, **no
  `hidden` attribute**) as the LAST TREE-CHILD of every Select group
  inside `<form>` contexts. v4's `:where(.space-y-2 >
  :not(:last-child))` therefore matches the TRIGGER (a non-last
  child!) and gives it `margin-bottom: 8px` — v3's rule gave triggers
  margin-TOP only (mb always 0). In plain block groups the phantom mb
  collapses out through the parent (invisible); **where the group is a
  DIRECT GRID ITEM (grid items establish a BFC — child margins are
  contained and can never collapse out) the group inflates 68 →
  76px**. Live-verified on the Account create dialog's Status group
  and the Contact create dialog's source group. The fix:
  `DIALOG_GROUP.controlMt` "mt-2" → "mt-2 mb-0" (the (0,1,0) class
  beats the (0,0,0) `:where()` rule). The Lesson: **CSS
  `:last-child` matches the TREE, not the layout** — an invisible
  absolutely-positioned tree-sibling defeats it, and a grid item's
  BFC turns a would-collapse margin into real geometry.
- **L-92c2 — THE CONTACT DIALOG'S FLATTENED SECTIONS.** The reference
  nests each section as `space-y-4 [H3, group, group]`; ours flattened
  the H3s into separate grid rows (the H3→field gap 24px vs 16px).
  Fixed by nesting the headers inside the section divs.
- **M-92c3 — THE EVENT DIALOG'S DESCRIPTION ROWS.** The reference's
  textarea is `rows=3`; ours rendered the HTML default `rows=2` — the
  house's own comment documented the right decode but the prop never
  landed. The Lesson: **a decoded fact in a comment is not a shipped
  prop — pin it.**
- **N-92c4 — THE IMPORT DIALOG'S COLUMNS-BOX p2.** The box carries
  `space-y-1`; the reference's `mt-2` p2 COMPUTES 4px (v3's (0,3,0)
  rule overrides the (0,1,0) utility); ours computed 8px. Fixed to
  `mt-1` per the s11 computed-gap rule — the M-91c2 genus in the
  INVERSE direction.
- **The space-y census (F-92a1).** The s91 "all 99 space-y usages"
  claim was not re-derivable by any method. The documented census: 111
  comment-stripped space-y occurrences across the 19 src files that
  carry one — the algorithm lives IN the s92 dialog-geometry-parity
  suite.
- **The sweep tool (S92-P5).** The s91 zero-data screenshot-diff
  sweep promoted into the repo as a one-command regression:
  `bun run sweep` (see §3 Bootstrapping). Zero new dependencies —
  the capture rides @playwright/test's chromium; the pixel diff
  decodes both PNGs in a browser canvas and runs the same pure
  `diffPixels` seam the unit pins exercise in node. The maiden runs
  (×2, reproducible): five pages byte-clean, every remaining diff a
  standing explained genus.
- **The gate**: lint 0/0 · tsc 0 · 1828/1828 unit (102 suites, +27
  net) · build · 132/132 e2e (the known settings-debounce flake
  passed standalone + on the full re-run). LIVE-verified on both
  apps; the closing census MATCH + the reference md5-exact (the 63rd
  consecutive stable session).

## 16cg. Session-93 Layer (the popover/menu family at TRUE 390 + the fresh-clone gate repair)

The 93-c rotation — the s92 suggested-next: the popover/menu family
opened at TRUE 390×844 on BOTH apps (agent-browser, NATIVE clicks for
the Radix menu triggers — a synthetic `.click()` does not fire the
pointer-event sequence Radix listens for; menus silently fail to open).

- **The leads Filters popover: FULL MATCH.** Content 320px @ x=32,
  h=398, radius 6px, white bg on both apps. The interior `space-y-4`
  rows measure 64/64/64/64/44 with 16px gaps on both — the reference
  computes the gaps as v3 margin-TOP on following siblings, ours as v4
  margin-BOTTOM on preceding siblings. In popover BLOCK flow (no grid
  BFC, no inline-label face) the two mechanisms render IDENTICALLY:
  the `space-y` genus does not bite here. The visible wrapper geometry
  differs (the reference's popper wrapper 320px, ours 390px) but the
  wrapper is an invisible positioning box — the content is the visual
  surface and it matches.
- **The topbar account menu: geometry MATCH, position genus decoded.**
  Menu 128×74 @ y=56, radius 6, items [Profile, Logout] on both. The
  trigger positions differ — the reference's account button renders at
  the LEFT edge at 390. Root cause (live-decoded on both DOMs): the
  topbar is `flex items-center justify-between gap-4` holding
  [search wrapper `hidden sm:flex flex-1 max-w-xl`] + [right group
  `flex items-center gap-2 sm:gap-4`]; below `sm` the search wrapper
  is `display:none`, leaving the right group the SOLE flex item, and
  `justify-between` places a sole item at flex-START. The reference's
  left placement is an accident of its own construction. OURS inserts
  the hamburger as an additional first child (the deliberate
  mobile-nav superset), so the row resolves [hamburger LEFT] +
  [account RIGHT]. The construction is byte-equivalent otherwise.
  DECISION: keep ours; documented as a STANDING EXPLAINED GENUS in
  `topbar.tsx` — chasing the accidental left-placement would imitate
  a defect-side artifact at the cost of a correct construction. The
  Lesson: when a superset addition shifts flex resolution, diff the
  CONSTRUCTION (classes, DOM order, group membership), not the
  accidental placement it produces.
- **The ⋮ row action menus: not walkable on the reference** (its
  workspace is zero-data — no rows). Our row menus stay pinned by the
  e2e family. The reports period Select stays covered by the s92
  settings-selects family (page-level, no `<form>` → no Radix native
  select → phantom-mb-immune).
- **F-A (HIGH) — the fresh-clone gate repair.** `scripts/sweep.ts`
  failed `tsc --noEmit` on a fresh clone: the child-process env was
  cast `as Record<string, string | undefined>` before
  `spawnSync(..., { env })`. Next 16's `next/types/global.d.ts`
  (pulled into every program importing `next/server` — `src/lib/api.ts`
  et al.) augments `NodeJS.ProcessEnv` with a REQUIRED
  `readonly NODE_ENV: 'development' | 'production' | 'test'`; an
  index-signature record cannot satisfy that required member, so no
  `spawnSync` overload accepts it. Reproduced on lockfile-exact
  versions (next@16.3.6, typescript@5.9.3, @types/node@26.6.2) across
  fresh-clone / post-build / post-dev-types / clean-tsbuildinfo
  states — the s92 gate's tsc-0 was masked by its sandbox's
  incremental build state. FIX: retire the cast —
  `const zEnv = { ...process.env };` infers `NodeJS.ProcessEnv`
  (the correct `env` type), and `delete zEnv.DATABASE_URL` stays
  legal because the property rides the `Dict<string>` index
  signature, not a declared required member. Pinned RED-first in the
  sweep-tool suite (the positive construction pin + the
  cast-retirement negative; stash-re-proven non-vacuous). The
  Lesson: a green gate on a long-lived workspace is EVIDENCE ABOUT
  THAT WORKSPACE, not about a fresh clone — the self-contained
  zero-config contract is only proven by re-running the gate from a
  clean checkout (or by distrusting incremental build state).
- **The reference census #89** (isolated session, TRUE 390): demo
  data zero, the mobile-nav defect STANDS, desktop normal. The drift
  sweep #89: the bundle md5 EXACT — the 64th consecutive stable
  session. Our drawer battery re-verified LIVE at TRUE 390 — FULLY
  GREEN.
- **The gate**: lint 0/0 · tsc 0 · 1829/1829 unit (102 suites, +1
  net) · build · 132/132 e2e fresh CI=1 (the known settings-debounce
  flake passed standalone + on the full re-run). The closing census
  MATCH; the reference md5-exact.

## 16ch. Session-94 Layer (the tabs family at TRUE 390 + the phone-width sweep mode)

The 94-c rotation — the LAST unwalked interactive family (the tab
strips on reports/settings/activities) walked at TRUE 390×844 on BOTH
apps, plus the sweep tool's phone-width mode (the s93
suggested-next #1, the rotation method productized).

- **The reports PILL strip: FULL GEOMETRY MATCH.** Track 358×82 @
  (16,1333) on both apps; the `grid-cols-2 lg:grid-cols-5` track
  reflows to cols "174px 174px" at 390 with the 5 tabs in 3 rows of
  24px (text-xs + py-1), zero row/column gaps, no label overflow —
  and the ENTIRE page above the tabs renders at identical heights
  (the y-coordinate 1333 matches exactly; the s91 full-page parity
  extends to phone width).
- **The settings SEGMENTED strip: FULL MATCH including the defect.**
  3 cols ("116.656px 116.672px 116.656px" — the fractional widths
  match), track 358×36 @ (16,197), 28px row. "CRM Configuration"
  computes scrollWidth > clientWidth on BOTH apps — the reference's
  OWN whitespace-nowrap clipping at 3 cols × 117px, faithfully
  mirrored (VLM-adjudicated: the bleed is visually benign; the
  parity claim stands on the DOM evidence).
- **The activities SEGMENTED strip: FULL MATCH.** Track 326×36 @
  (32,1057) (inset inside the toolbar), 4 cols of 79.5px, 28px row,
  no overflow. The only visible delta is DATA-DRIVEN: our seeded
  workspace renders the "Overdue 3" count badge (the reference's own
  `>0 && <span>` construction at its zero-data state).
- **The phone-width sweep mode (S94-P0, TDD)**: `bun run sweep --
  --width 390 --height 844` — the flags feed BOTH the capture context
  and the shots dir (`sweep-shots/w390x844/`, never colliding with
  the desktop shots); the per-page content-wait is now width-agnostic
  (`.locator("main")` — the nav links are display:none below md on
  BOTH apps, so the old nav-a visible-wait burned its full 15s
  timeout per page at 390). Pinned RED-first (3 pins;
  stash-re-proven non-vacuous). The MAIDEN run table: 8 pages at the
  ~0.5% mobile-nav-superset topbar floor (the displaced account
  glyphs + the hamburger ≈ 1600px ≈ 0.49% of the 390×844 frame) +
  settings 7.34% (the picklist genus, a larger share of the narrower
  frame) — ZERO new drift; both standing tables live in the tool
  header.
- **The audits**: 94-a — the s93 delta 4/4 GENUINE-OK + the
  count-in-comment genus guard (the F-94a1–a8 stale-count family:
  the mobile-nav "7-check" quartet [CLAUDE/PAD×2/SKILL], the PAD
  §3.2 tree freeze [77 suites/1257/112 → 102/1829/132], the
  db-path "16 checks" → 20, the §11 Lines-column drift ×14 rows, the
  gate-checklist 1191/112 — all fixed docs-only); 94-b — the
  graduation audit 13/13 GENUINE (zero graduations, the ~50th
  consecutive session), the CSV census 17 sites zero unguarded, the
  source-vocabulary diff EMPTY since s90, the vitest/playwright
  config layer + the SEO/sitemap layer verified standing.
- **The probe-trap lesson (the corrected drawer battery)**: a loose
  `aria-label*=menu` selector hits the drawer's hidden CLOSE button
  FIRST (DOM order) — and `visibility:hidden` preserves geometry AND
  offsetParent, so closed-state probes can read like open-state ones
  (a programmatic `.click()` also bypasses inert, navigating anyway).
  The battery re-run with exact selectors: trigger (16,16) 36×36;
  panel 288px @ x0 computing rgb(37,99,235); 8 links; focus inside;
  dual body+main lock; navigate-close → /Leads; closed root inert +
  hidden + pe-none; Escape-close — FULLY GREEN.
- **The standing layers**: drift sweep #90 (bundle md5 a70a637f…
  EXACT — the 65th consecutive stable session); census #90 (demo
  zero, desktop 256px/8 links, the mobile-nav defect STANDS at TRUE
  390 — nav w=0, 0 visible links, no menu button).
- **The gate**: lint 0/0 · tsc 0 · 1832/1832 unit (102 suites, +3
  net) · build · 132/132 e2e fresh CI=1 (3.2m, zero flakes — one
  environmental chromium crash at setup, clean after the
  stray-browser cleanup). 3 screenshots (136 drawer-open @390 + 137
  reports pill tabs @390 + 138 settings segmented tabs @390, VLM
  5/5 × 3 — one adjudication). Both operator decisions re-affirmed
  (54th): CSV posture (b) + source-vocabulary parity.

## 16ci. Session-95 Layer (the table family at TRUE 390 + the sweep --pages filter)

The 95-c rotation — the TABLE family (the sticky thead + row geometry
at phone width) walked at TRUE 390×844 on BOTH apps, plus the sweep
tool's `--pages` filter (the s94 suggested-next #3) and the drawer
battery productized as a committed tool.

- **The leads table: FULL GEOMETRY MATCH.** Table 380px wide in the
  `relative w-full overflow-auto` scroll box (358px, scrollW 380)
  inside the `rounded-lg shadow` card (358px) on the `p-4 sm:p-8`
  bare page. **The thead is STICKY (top:0, height 63px, bg white)**
  with 9 header cells at widths [81,79,0,0,78,61,0,65,16] — the
  array EXACT on both apps; the empty row 85px; the thead at
  y=1142 EXACT (the whole page above at identical heights). The
  LIVE sticky check: scrolling the main scroller by 800 sticks the
  thead to the container top (342 == 342, stuck) on BOTH apps —
  the rows slide under the opaque white header.
- **The contacts table: FULL MATCH.** Table 633px in the 324px
  scroll box inside the 326px `rounded-xl` card on the `p-8` page;
  thead static 43px; the zero-data empty row 201px ("No contacts
  found / Try adjusting…") — identical. NOTE the page's OWN scroller:
  the contacts root nests `div.flex-1.overflow-auto` INSIDE main
  (the fullHeight construction) — main itself barely scrolls (the
  5px mirrored topbar quirk); drive the inner column when probing.
- **The accounts table: MATCH + ONE EXPLAINED GENUS.** The table
  surface identical (472px, thead 43, 8 columns, the empty row 85,
  thead at y=1040 EXACT). The DIFFERENCE is the horizontal-overflow
  MECHANISM at 390: the reference's accounts column is a bare
  `flex-1` (min-width:auto) so the 472px min-content pokes out past
  the viewport and the MAIN scroller scrolls horizontally (scrollW
  488); OURS adds `min-w-0` so the column keeps the 358px width and
  the table scrolls INSIDE its own overflow-auto box (main never
  h-scrolls). Visually equivalent at first paint (both cards end
  flush at the viewport edge — the phone sweep measures accounts at
  the ~0.5% standing floor); functionally ours matches the
  contacts/leads in-box pattern on BOTH apps. STANDING EXPLAINED
  GENUS — do NOT restructure to chase the reference's poke-out.
- **The sweep `--pages` filter (S95-P0, TDD).** `bun run sweep --
  --pages leads,settings` restricts the run to the named pages (a
  comma-separated list; BOTH the capture and the diff loops) for
  targeted rotation runs. The PURE `parsePagesArg(argv, all)` seam
  sits beside PAGES/TOLERANCE/diffPixels: the result keeps the
  PAGES order; an unknown name FAILS FAST listing the valid names
  (a typo must never silently sweep everything). RED-first 4 pins,
  stash-re-proven non-vacuous (4 failed | 12 passed pre-fix → 16/16
  post); the maiden filtered run reproduced the standing values
  (leads 0.00% + settings 4.73%). The B-95a8 header fix landed with
  it: `--max-diff <pct>` documents the space-separated form — the
  one the parser actually reads.
- **The drawer battery, productized.** `scripts/drawer-battery-390.ts`
  (env -u DATABASE_URL bun scripts/drawer-battery-390.ts) encodes
  the s94 corrected exact-selector protocol: the PANEL
  `div.h-dvh.w-72` inside `[role="dialog"]` (never the root), exact
  aria-labels, a REAL user click, and the URL-based wait — the
  /Leads route is the s24 CAPITAL-route construction and the dev
  server compiles it on first visit (a fixed 1200ms wait reads the
  pre-navigation pathname). Re-verified FULLY GREEN at TRUE 390:
  trigger (16,16) 36×36; panel 288px @ x0 computing rgb(37,99,235);
  8 links; focus inside; dual body+main lock; navigate-close →
  /Leads with the full release; Escape-close; the resize-past-md
  lock release. One tooling decode: a pipeline sanitizer strips the
  literal `[h` two-char sequence from DISPLAYED outputs — probe
  selectors were correct all along; verify with od/python before
  "fixing" a mangled-looking selector.
- **The audits.** 95-a: the s94 delta GENUINE (the phone-width mode
  verified end-to-end; the non-vacuousness re-proven independently
  against `git show 7b43516:scripts/sweep.ts`; the docs counts
  verified against the live tree; F-95a1 — the SKILL §5.6 stale
  "300 lines; 37 checks" claim, fixed to 1520 lines / 180 checks).
  95-b: the graduation audit 13/13 GENUINE (zero graduations, ~52nd
  consecutive; the src tree byte-identical since the s94-b base);
  the CSV census 17 sites ZERO unguarded; the source-vocabulary
  clean; the config layer + the SEO/sitemap layer verified (37/37
  across the three SEO suites; the 47/47 figure counts
  csv-formula-guard's 10 in the four-suite sum). Both operator
  decisions re-affirmed (55th): CSV posture (b) + source-vocabulary
  parity.
- **The standing layers.** Drift sweep #91: the reference bundle md5
  `a70a637f…` EXACT — the 66th consecutive stable session. The
  desktop sweep CLEAN (the standing table reproduced — dashboard
  0.32%, settings 4.73%, the rest 0.00–0.01%); the phone sweep
  CLEAN (the s94 maiden table reproduced — the ~0.5% floor +
  settings 7.34%). Census #91: demo zero, desktop 256px/8 links,
  the mobile-nav defect STANDS at TRUE 390 (the 16th consecutive).
- **The gate.** lint 0/0 · tsc 0 · 1836/1836 unit (102 suites, +4
  net) · build · 132/132 e2e fresh CI=1 (3.1m, zero flakes; the
  mobile-nav suite green inside the run). 3 screenshots (139 leads
  sticky thead mid-scroll + 140 accounts + 141 contacts, VLM 5/5 × 2
  + 4/5 — one adjudication: 139's clipped-edge NO vs the
  DOM-verified shared horizontal-scroll genus, the 380px table in
  the 358px box on BOTH apps).

## 16cj. Session-96 Layer (the form family at TRUE 390 + the login-card v4 space-y-genus fix — the FIRST src/ change since s90)

**The rotation (96-c)** — the FORM family at TRUE 390×844 on BOTH apps
(the s95 suggested next #1, the last unwalked static family):

- **The FILTER ROWS: FULL GEOMETRY MATCH — every value identical.** The
  leads Filters popover's form controls: the trigger (32,1089) 326×36
  radius 6; the content (32,36) 320×398 radius 6 white p-16; the rows
  64/64/64/64/44 at y 53/133/213/293/373 w 286; the labels (Status /
  Source / Min Deal Value / Follow-up Date) 14px/500 rgb(10,10,10) h 20;
  the combobox triggers 286×36 radius 6 border 1 p-8/12; the number/date
  inputs 286×36 16px radius 6 p-4/12; the footer Clear + Save View
  buttons 139×36 each. The in-app form family closes CLEAN (the popover
  labels are `text-sm font-medium mb-2 block` — a BLOCK label with an
  explicit margin, the s29-era construction; the genus does not bite
  there).
- **THE LOGIN CARD: THREE RHYTHM DELTAS — the v4 space-y genus on the
  auth surface, decoded** (present at BOTH 390 and 1440; net +12px card
  height at 390, +20px at 1440):
  1. **The Google→divider gap: REF 24, OURS 48 (+24 at 390; 56 vs 24 at
     1440).** The reference nests [google + divider + form] inside ONE
     `w-full` BLOCK section (DOM-verified: its form's parent chain runs
     form → `div.w-full` m=[24/0] → the centered column) — inside it
     the adjacent margins COLLAPSE (googleWrap mb 0 vs the divider's
     my-6 mt 24 → 24; the divider's mb 24 vs the form's mt 0 → 24).
     OURS had the three as DIRECT children of the `flex flex-col`
     centered column — flex containers do NOT collapse margins, so v4's
     space-y-6 margin-BOTTOM (on the google wrap) STACKS with the
     divider's my-6 margin-top → 48.
  2. **The field label→input gap: REF 10, OURS 4 (−6 per field × 2).**
     The reference's `space-y-1.5` is v3 — margin-TOP on the FOLLOWING
     block (its inputWrap measures m=[6px/0px] live). Our v4
     `space-y-1.5` puts margin-BOTTOM on the PRECEDING child — the
     label — a non-replaced INLINE element where vertical margins are
     IGNORED, so the 6px is silently LOST. The same genus class as
     M-79c2 (the back-button −mb-2 → mb-2 fix).
  3. **The card's top offset (−6 at 390): downstream** — resolves with
     fixes 1+2.

  Never caught before because the login page was NOT in the sweep's
  PAGES and the form family was the last unwalked static family — the
  s7/s11 class-string pins copied `space-y-1.5` verbatim from the
  reference's own bundle, which is exactly wrong under v4 semantics.

**The remediation (S96-P0, TDD — RED first)**: `LOGIN_LAYOUT.field` +
`LOGIN_SIGNUP_LAYOUT.field` → `[&>*+*]:mt-1.5` (the v4-correct
mt-on-following; the label stays INLINE like the reference's own 16px
inline box — a block label would sit 2px high); the signin column
restructured into ONE `w-full` section wrapping [the google button (its
own wrap the reference's inert `space-y-3`) + the divider + the form];
**login added to the sweep's PAGES** (10 pages — the reference serves
the login card to AUTHENTICATED visitors, the S23-P2 finding, and ours
mirrors it, so the post-login capture works on both apps). RED-first 3
pins + the labels-stay-inline guard; the stash proof 10 failed | 50
passed → pop → 60/60. **The LIVE re-walk: the login card FULL GEOMETRY
MATCH — Δ=+0 on ALL 11 elements** (h1 209 · subtitle 249 · google 293
· divider 371 · emailLabel 415 · emailInput 441 · pwLabel 501 ·
pwInput 527 · submit 587 · forgot 643 · signup 671; the rhythm gaps
24/10/10 exact).

**The drawer battery (S96-P1, the F-96a1 audit fix)**: the step-5
resize-past-md probe now REOPENS the drawer first (verified open +
locks engaged before the grow — the auto-close listener at
mobile-nav.tsx:54-62 only registers while open, so the closed-drawer
probe could never go red for an s8-class regression); pinned in the new
`tests/drawer-battery-tool.test.ts` (4 pins: the reopen construction +
the exact-selector protocol + the URL-based CAPITAL /Leads wait + the
dual-lock/no-synthetic-click guards); the battery re-verified FULLY
GREEN live.

**The drift gate (S96-P2, the s95 suggested next #2)**: `--fail-on-drift`
judges each page against ITS OWN standing baseline + margin (default
0.5pct, `--drift-margin` override) — a 0.00% page drifting to 5% fails
here where a global `--max-diff 8` (which must sit above the settings
genus) never could. The STANDING_BASELINES table splits at the md
breakpoint (BOTH walked phone widths ride the phone table); a page
missing from the table is judged at baseline 0 (the fail-fast
doctrine). PURE seams (standingBaseline/driftVerdict) pinned RED-first;
both maiden runs gated CLEAN. The login baselines document the NEW
standing genus: 0.27% desktop / 0.75% phone — the CSS brand-mark logo
(the reference hotlinks a screenshot; ours draws the white-circle/
blue-dot shape).

**The lesson (the fourth v4-genus fix in the family)**: M-79c2
(−mb-2 → mb-2), the s91 space-y hazard family (controlMt), and now the
auth fields + the flex-column section — the doctrine holds: NEVER copy
a v3 class string verbatim; re-derive the reference's COMPUTED
geometry and express it with the v4-correct construction. The remaining
unwalked surfaces are covered by the now-10-page sweep (login
included) — any future genus on the auth surface ships as a drift
number, not a silent gap.

## 16ck. Session-97 Layer (the tablet class + the chart cards at TRUE 390 + the numeric fail-fast)

**The 97-c rotation — the chart-surface walk program CLOSED.** The
dashboard's chart cards walked at TRUE 390×844 on BOTH apps at the
zero-data state: **FULL GEOMETRY MATCH, Δ=+0 on ALL 13 elements** —
the 6 KPI cards (358×130, the sparkline SVGs 324×32 where present),
Sales Pipeline by Stage (358×494, the chart SVG 308×300, 5 bars, 5
legend chips), Revenue Over Time (358×398, SVG 308×300), Top
Performing Sales Reps (358×131), Lead Sources (358×106), Upcoming
Activities (358×158), Recent Deals (358×155) — every y-ladder position
identical. With the dialogs (s92), popovers/menus (s93), tabs (s94),
tables (s95), and forms (s96) already walked, the recharts reflow at
phone width was the last chart surface: the interactive-surface walk
program is now closed at every family. The method: probe BOTH apps at
the same zero-data state, measure per-card bounding rects + the SVG
surfaces + the bar/chip/row counts, then pairwise-delta.

**The 768×1024 tablet maiden sweep (the md/sm boundary).** The third
viewport class: zero catastrophic drift everywhere. The accounts 0.72%
is the documented s95 overflow genus AT THE MD BOUNDARY — the
reference's accounts table rides the bare `flex-1` container and
pokes out (main scrollWidth 567 > clientWidth 512, main h-scroll
on), ours scrolls in-box (`min-w-0`, scrollW = clientW) — the same
mechanism as the phone walk, the th distribution differing
downstream (ref 90/74/77/42/62/81/61/48 vs ours
73/74/77/42/62/68/61/16). Ours stays the consistent pattern;
documented STANDING, now carried as the tablet-class baseline.

**S97-P0 — the tablet baseline class.** `standingBaseline()` is now
the 3-way md/lg banding: `< 768` phone (both walked widths ride one
table) · `< 1024` tablet (the maiden 768×1024 values: accounts 0.8,
settings 5.5, login 0.5, the rest 0.1) · else desktop. A width in an
un-walked band is judged by its class table — run a maiden sweep
before trusting a new band.

**S97-P1 — the numeric-arg fail-fast (B-97a2, a live audit find).**
The hazard: `Number(argv[idx + 1])` on a missing or non-numeric value
yields NaN, and `pct > NaN` is ALWAYS false — a typo'd `--drift-margin
zero` (or a trailing flag) would silently disarm the drift gate. The
fix: the PURE `parseNumberArg(argv, flag, fallback)` seam returns the
fallback when the flag is absent and THROWS listing the expected form
when the value is missing or non-numeric — the `--pages` typo doctrine
extended to the numeric family. Wired into ALL FOUR numeric flags
(`--drift-margin`, `--max-diff`, `--width`, `--height`); verified live
(exit 1, the helpful message).

**S97-P3 — the `gate:full` composite (the s96 suggested next #3).**
`bun run gate:full` chains the standing gate (lint → typecheck →
test → build → CI=1 e2e) + the three drift sweeps (desktop, phone
390×844, tablet 768×1024, each `--fail-on-drift` against its own
class baselines). The plain `gate` is UNCHANGED — the drift-free fast
path keeps its ergonomics; `gate:full` is the one command that proves
code AND parity.

**B-97a1 — the reset-view scope extension, re-walked.** The s96
`LOGIN_LAYOUT.field` fix also styles the reset view's email field
(the shared constant); the live re-walk at 390 verified the label→
input gap 10 on BOTH apps (the fix's computed gap) with the card
358×358, the label inline 14px, the input 294×40 — the scope
extension is correct, not a regression.

**The session-97 lesson (the audit-to-remediation loop):** the 97-a
audit found the NaN hazard precisely BECAUSE the drift gate became
load-bearing (S96-P2) — the more a tool gates, the more its own
argument surface needs the fail-fast doctrine. Tool pins must cover
not just the happy path but every silently-degrading path (NaN,
empty, absent) — the same lesson as the `--pages` typo and the
missing-baseline=0 doctrine, now complete across the sweep's flag
family.
