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
version: 1.30.0
last_updated: 2026-10-02
project_state: 799 unit checks + 106 e2e checks green; database pinned to <repo>/db/custom.db; chart palette + dialog vocabularies + layout/chrome contracts + view-switcher/leads-popover/mobile-nav-breakpoint/login-reset/chart-geometry/stat-shadow/table-shadow/contacts-layout/page-titles/charts-contracts/profile-route contracts DOM-pinned by tests (constants.test.ts, page-layout.test.ts, lead-filters.test.ts, login-reset.test.ts, page-titles.test.ts, charts-contracts.test.ts, profile-route.test.ts); table density + card typography + dialog contract + the full layout system + the app chrome (session-7) + the functional control layer (view switchers, filters popover, quick-log buttons — session-8) + the component-anatomy layer (session-9) + the stock-primitive layer (session-10: input/select/textarea stock internals, ink/placeholder tokens, the global cursor rule, the topbar search on the shared Input, the blur-scale re-pin) + chart internals (recharts defaults everywhere, the REAL chart at zero data — ChartEmpty retired, the leads-page FunnelChart, the 8-slug reports pipeline, row-derived vs fixed series split) + the reports tabs 2-4 re-mirror + per-page titles + the login card's in-place reset-password flow (signin→reset→sent, session-11) + per-surface chart geometry (300/250/150 + stock legends) + stat-card shadow scales + the reports bare-tabs layout + the contacts full-height architecture (session-11) + the border-color split (#e5e5e5 default / #e5e7eb explicit family) + stock Radix tab strips + the recharts monotone sparklines + the custom 404 + the KPI de-hover (the reference moved) + the drawer focus-entry retry (session-12) + the auth absolute titles + the explicit dashed grids (strokeDasharray "3 3" — recharts default is SOLID, the s10 pin was a misread) + the reports funnel as a horizontal BarChart + the rounded-md button radius + the per-page CardTitle map + the #0a0a0a foreground + the 16px base font + the stock Label/DialogTitle + the stock DropdownMenu account menu + the profile page neutral family + the complete by-type card + the bordered calendar cells + the avg-cycle delta removal (session-13) + the settings Defaults/Data tab structures + the /Profile casing alias + the line-soft #f5f5f5 re-pin + the v4 space-y inline-label no-op fix (session-14) + the entity-dialog geometry layer (session-15: stock shadcn dialog chrome — w-full/sm:rounded-lg/shadow-lg/slide animations, the bg-black/80 no-blur overlay, centered-mobile headers, the opacity close X, no descriptions, no placeholders; two body families — the max-w-lg py-4 space-y-2+controlMt dialogs with Lead Status/Source 2-col, the 2-col Account body, the Contact gradient-avatar section; the max-w-2xl Event/Activity space-y-4 bare-pair family with pt-4 footers; the Event blue submit expressed via the --primary tokens because v4's literal bg-blue-600 compiles to a DIFFERENT oklch blue) + the responsive page-root layer (session-16: PAGE_ROOT standard/bare, the stock table kit + the th/td platform reset, the TABLE_CARD plain-div border-leak rule, the md settings grid, the flat calendar card) + the stock button/checkbox layer (session-17: the account trigger as the stock ghost Button with the two-level Avatar, the icon-glyph census — 14 swapped surfaces + the hand-rolled polygon FilterPolygon because lucide 0.525 re-exports the curved Funnel as Filter, the stock Radix-style button checkbox with the dark #171717 checked fill, the default variant's bare shadow, the ghost's no-text-color) + the document metadata layer (session-18: the reference's 405-char meta description mirrored verbatim as SITE_DESCRIPTION in src/lib/site.ts, the full OG + Twitter card family with the 1200x630 og-image, the file-convention favicon, robots.txt + sitemap.xml as byte-format route handlers because Next's serializers drift — User-Agent case + priority number collapse — and the quarter-boundary time-bomb fix in the reports e2e) + the PWA/installable + per-route metadata layer (session-19: the manifest.json byte-format route handler, the #000000 theme-color, the apple-touch-icon file convention, the PWA_META family riding metadata.other, the pageMetadata() per-route canonical/OG/Twitter factory with the "<Page> on NEO CRM." description prefix, the metadata.icons-replaces-file-convention hazard, and the dialog input micro-contracts — Contact Phone type=tel, zero datalists, the exact avatar accept list) + the HTTP response-header layer (session-20: the reference's edge security set — Referrer-Policy strict-origin-when-cross-origin + X-Content-Type-Options nosniff + bare HSTS max-age=31536000 on every response via next.config.ts headers(), the sitemap's bare application/xml content-type, the HEAD≠GET + checkVisibility() census-method hazards) + the login-card funnel layer (session-21: the reference's in-place signup view — the s10 "dead button" pin disproven — with its minimal Email/Password/Confirm form, the verify-email view with six single-digit inputs and the 5-attempt ladder, the Callout error/info banners, the exact auth error strings, zero auth toasts, the client/server verification split with the server-console code delivery, and the census-method hazards — visibility-vs-display, lab()/oklab() parsers, the __next_route_announcer__, the bun db-push absolutization trap) + the typography/base-cascade layer (session-22: the reference's ZERO-webfont base — the Inter webfont retired for the exact stock system stack pinned in @theme --font-sans, the double antialiased smoothing retired for the reference's default auto, the invented ::selection tint retired; the AGENT_BROWSER_SESSION export-leak + focus-race + controlled-span census-method hazards) + the tabs ARIA + keyboard layer (session-23: the reference's full Radix tabs contract — useId trigger/panel id pairs with aria-controls/aria-labelledby wiring, the exported TabsPanel shells all mounted with inactive hidden + empty, the ArrowLeft/Right wrap + Home/End + automatic-activation keyboard model, the reference's wrapper anatomy with the per-page TabsContent stock classes, the activities priority card restructured into ONE p-4 border-b region, and the authed-login redirect retirement; the auth-state + platform-badge + data-inflation + skeleton-race census-method hazards) + the route-case + URL-state layer (session-24: the reference serves every app route at BOTH casings with no normalization — nine capital-route RENDER aliases inside the (app) group with capital-case pageMetadata and the Dashboard root-head contract, the capitalized NAV_ITEMS hrefs with the case-insensitive sidebar isActive, the /Profile account-menu target, the dead More... affordance, the no-capital-auth-alias pin, and the URL-state census closed at parity — zero writes, params ignored; the CLI-latency + browser-not-curl + route-scoped-case-folding + computed-visibility census-method hazards) + the loading-state + export/button-contract layer (session-25: the reference's instant-render-with-zeros model — every skeleton family retired with the store's loadingFlags, the empty state IS the loading state; the REAL client-side export artifacts — the html2canvas-pro + jsPDF seam with the A4 portrait crm_reports_ pagination, the text-artifact per-table PDFs with the paren-truncating slugs, the prefix_YYYY-MM-DD.csv family with the leads 8-column set + the filter-aware singular crm_report deal CSV + the per-table client-side blobs with the reference's own SHORTER-CSV-prefix inconsistency; the localStorage-backed Save Custom Report View dialog with the byte-exact crm_saved_reports schema + the 6-entry period vocabulary today/week/month/quarter/ytd/all; the init-script-fetch-delay + download-spy + eval-click-does-not-switch-tabs census-method hazards) + the Settings Data-tab + import/export contract layer (session-26: the three CardDescriptions — Import Templates "Download CSV templates for bulk imports" / Export Data "Export your CRM data to CSV" / the Danger Zone's red "Permanently delete all CRM data. This cannot be undone." — with the per-index ml-0 sm:ml-2 button margins; the STATIC client-side CSV templates (contacts_template.csv etc., the seam src/lib/csv-templates.ts); the RAW-DUMP entity exports (contact_/account_/lead_/activity_ + ISO date — the header is the first row's OWN keys, every value double-quoted, an EMPTY file at zero rows, the seam src/lib/entity-export.ts); the native-dialog-gated reset flow (the reference's exact confirm + alert strings, the trash2 icon, NO toast — the store's refetch half predates); the quoted page-level contacts/accounts exports (the 7- and 10-column sets incl. the STORED Account health — Healthy/At Risk/Needs Attention, backend-defaulted); the rebuilt Import Contacts dialog (the Select File dropzone with the upload glyph, the chosen-file box, the Required/Optional columns, the Cancel/Close + Import footer, the green/red result box with the 2s auto-close, the exact failure vocabulary); /api/export retired to type=leads + type=report only; the bundle-as-census-instrument + native-dialog-interception + per-index-class census-method hazards) aligned to the live reference; + the chart-internals + Account Health / calendar contract layer (session-27: the STOCK-axes correction — the reference's Cartesian charts render the default #666 axis lines + tick lines, every axisLine={false}/tickLine={false}/custom-margin/allowDecimals override retired; the parameterized chart family — SingleBarChart/GroupedBarsChart/TrendLineChart/LabelPieChart/HorizontalBarChart — with the per-surface bundle-pinned configs; the reference's HARDCODED KPI sparklines + deltas (KPI_STATICS) and the O-map pipeline legend chips with the Won gray-400 lookup-miss quirk; the computed Account Health tab (src/lib/account-health.ts — days>60||lost / days>30, the 999 sentinel, the PIE + horizontal Top-10 + the red-tinted at-risk rows + outline-badge summary); the dashboard's checkbox-row Lead Sources + Upcoming Activities; the leads 5-status pipeline + the LEADS_FUNNEL vocabulary; the calendar's EVENT_TYPE_CHIP tints + clickable chips + tall-bar/agenda rows; the bundle-contains-dead-paths + tick-elision-fakes-vocabulary + cache-the-bundle-outside-the-page census-method hazards) aligned to the live reference; the build script's static-copy step (bare `next build` leaves the standalone server chunkless) documented; + the entity edit/detail contract layer (session-28: the W7/wce/Mke max-w-2xl edit-dialog family with the readOnly mode + the value/label select pairs, the contact model's Key/Standard/At Risk + role/engagementLevel/companySize/photoUrl + RAW sources with the legacy-vocabulary mapping, the ce formatter, the contacts row's inline role select + 3-bar engagement + Key tint + red/green last-activity + the Call/Email/WhatsApp actions, the Pke md:w-[500px] Contact Details slide-over, the kke checkbox-card filter panel, the AAe h3 section headers + the raw-source split, the NAe Scan Card rebuild, the accounts row's Key tint + overdue border + health-under-Status + owner initials, the Ece max-w-3xl Account Insights dialog, the Oce revenue ranges + the blue Filter button, the empty-state-row-races-the-fetch + string-comment-stripping + stale-dev-server-Prisma census-method hazards) aligned to the live reference; + the leads interactive-table layer (session-29: the C2 pointer CLOSED — the orange Target name box + text-sm cells with the '-' fallbacks, the INLINE Value number input (w-24 h-8, placeholder "$0", parseFloat||0) / Status select (EXACTLY the five raw options — unmatched stages render a BLANK Radix trigger) / Next Follow-up date input with the overdue border-red-500 + CircleAlert (isOverdueFollowUp: any past date; a date-only "today" parses at UTC midnight and IS overdue — the reference's own quirk), the raw-source outline badge, the ⋮ Edit / DEAD Convert-to-Opportunity / Delete menu with the EllipsisVertical trigger, the explicit hover:bg-gray-50 non-clickable row, the STICKY thead + w-12 + cursor-pointer gap-2 sort headers; the store's updateLead applies optimistically BEFORE the await; DropdownItems close the popover via PopoverPrimitive.Close asChild; the KPIs + charts + export ALL derive from the FILTERED set (Open = new+contacted+qualified, Dropped = lost strictly, the avg cycle = the won leads' average AGE now-created, the one-decimal toFixed(1) conversion); the Export is a CLIENT-SIDE blob from the filtered rows (the UNQUOTED 8-column header + quoted values + leads_ prefix via unquotedHeaderCsv; /api/export retired to type=report only); the Gke popover re-scoped — the RAW-value selects with the "all" sentinel, the "(Active)" suffix (live-confirmed), the NATIVE prompt-based Save View (live-confirmed — the s8 "inert" pin was the s26 native-dialog auto-dismiss hazard) + the loadable w-full sm:w-48 Saved Views select (live-confirmed; the reference keeps them in-memory, ours persists the list; the filters do NOT auto-restore); the lead SOURCE vocabulary migrated to RAW values end-to-end (LEAD_SOURCE_OPTIONS, the create dialog default "email", the seed map, the dashboard "Follow up with {raw}" rows, the CSVs); the reference's filter semantics — the OR-form search, strict status/source equality, the truthy-value min quirk; the has-text-selector-invalid-in-agent-browser + the playwright-once-dialog-for-synchronous-prompts census-method hazards) aligned to the live reference; + the photo-upload contract layer (session-30: the s51 pointer CLOSED — the self-hosted UploadFile mirror (POST /api/upload multipart + session-guarded + the image check + the 5MB ceiling, stored <repo>/uploads/<32-hex>.<ext> gitignored, GET /api/uploads/[name] public with the pinned charset); the AAe contact-dialog photo section (the img/initials/User-glyph render on the shadow-lg circle, the red remove X clearing the form value AND the input's .value, the border-2 border-blue-500 camera disabled while uploading, the exact alert strings, the Uploading photo... hint, the John Doe centered Name field — the s15 no-placeholder pin re-scoped); the W7 edit dialog stays photo-less + the Pke slide-over hero INITIAL-only (our invented img retired) while the table row + mobile cards DO render photos; the aCe profile flow (accept="image/*" with NO type alert, TOASTS not alerts, the img on the form avatar + the Account card, the save→500ms-reload, the topbar avatar pickup, User.photoUrl String? through the session user + the users selects); the dialog scroll-cap layer (max-h-[90vh] overflow-y-auto on the contact create + the W7/Mke edit family + Log Activity + Event + Save Custom Report via DIALOG_CONTENT.wide, the BARE max-w-2xl account create + the bare max-w-lg lead create — the reference's own cap-free inconsistency mirrored); the authed-bundle-lives-at-/assets + the bundle-inside-eslint-ooms + the role-dialog-matches-the-drawer-wrapper + the json-quoted-eval-returns census-method hazards) aligned to the live reference; + the currency-format + period-wire-id layer (session-32: the reference's LITERAL scale formulas mirrored through the format seam's fixed scale option — the dashboard's currency KPIs ALWAYS $${(v/1e3).toFixed(1)}k (Deals Closed, Revenue This Month) + $${(v/1e3).toFixed(0)}k (Sales Target — the "$0k" hardcoded-target quirk) at ANY magnitude, never the M form, never a bare number; the accounts' revenue family ALWAYS $${(v/1e6).toFixed(1)}M (the Total Revenue KPI + the table + Cards-view cells — "$0.9M" at Brightline's seeded 900k); the REPORT_PERIODS wire ids corrected to today/thisWeek/thisMonth/quarter/ytd/all (the s25 week/month ids were zero-data inferences, disproven by the bundle's i3e reports filter decode) + normalizeSavedPeriod() migrating stale saved-view localStorage entries at the reports page's onLoad; the reference's DEAD topbar "Search Anything..." input + its DEAD accounts View/Format selects confirmed live (our functional versions = the documented supersets)) aligned to the live reference; + the dead-control decode closure layer (session-33: the 29th-session bundle re-read — the reference's dashboard filter-bar "Stage: Source" search input is DEAD [no value/onChange, the s32 topbar-search family] + its header "Add" button is DEAD [no onClick — the whole Add/Export/Export trio is dead there]; ours stay the documented functional supersets with the placeholder pinned as FILTER_BAR.searchPlaceholder + the trio's labels/classes as the extended DASHBOARD_HEADER contract, the render pins in page-layout.test.ts + dashboard-contracts.test.ts) aligned to the live reference
---

# NEO CRM — Engineering Skill (SKILL.md v1.30.0)

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
