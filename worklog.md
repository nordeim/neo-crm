# Worklog

---
Task ID: 1
Agent: main (Super Z)
Task: Clone neo-crm scaffold + scandihaven reference; recon target app https://neo-crm-8ab2c17c.base44.app/

Work Log:
- Cloned https://github.com/nordeim/neo-crm.git -> /home/z/my-project/neo-crm (scaffold: Next.js 16.3.6, React 19, Prisma/SQLite, Tailwind 4.3.3, radix, zustand, vitest, playwright; old ORBITAL project files present, to be replaced)
- Cloned scandihaven-ref (reference repo for stack conventions: Next 16 App Router, RSC-first, Server Actions/REST envelope, Tailwind v4 CSS-first tokens with literal hex, mobile drawer nav patterns)
- Logged into target base44 app via agent-browser (sepnetflix2023@outlook.com); captured 23 screenshots in /home/z/my-project/target-app-screenshots/ + full a11y snapshots of every page
- Pages discovered: Login, Dashboard(/), Accounts, Contacts, Leads, Calendar, Activities, Reports, Settings, user menu (Profile/Logout)
- **CRITICAL BUG CONFIRMED**: on mobile viewport (390px) the target app renders NO navigation — no hamburger, no drawer; only the avatar "S" dropdown (Profile/Logout). Sidebar simply disappears. Our clone MUST implement a working mobile drawer nav (hamburger -> slide-out, focus-trap, scroll lock, close-on-route-change).
- Visual spec via VLM: blue sidebar #2563EB (~250px, white text/icons, active = white/15 bg), white topbar with gray pill search (#F3F4F6), KPI cards white rounded-xl on #F9FAFB bg, primary action blue #3B82F6, Inter font, lucide icons, green/red delta chips
- Target data model inferred: Accounts (name, industry, email, phone, website, annual revenue, employees, tier A/B/C, key account, status, owner), Contacts (name, email*, phone, company, position, source, priority), Leads (name, email, phone, company, estimated value, stage New/Qualified/Won/Lost + pipeline stages, source, next follow-up), Events (title, type Meeting/Appointment/Call/Task, status, start/end, location), Activities (Call/Email/Meeting/WhatsApp/Task/Note, due, status, related-to), Settings (editable lists: contact sources, lead stages, activity types, account tiers, industries; defaults: currency AED, stage new, tier B, follow-up 3 days, calendar Month, week starts Monday; data export/reset)
- Delegated deep-read of scandihaven docs + neo-crm skills folder to 2 Explore agents (reports received; key takeaways: Tailwind v4 @theme literal-hex tokens, @import "tw-animate-css" for radix animations, `hidden` attr overrides display utilities, mobile menu failure taxonomy, z-index flat scale, ActionResult envelope, scrypt+HMAC cookie auth pattern from old AGENTS.md)

Stage Summary:
- Recon complete. Next: write CRM prisma schema, lib seams (auth/api/db/format/csv), Tailwind v4 globals.css, UI kit, zustand store, API routes, 9 pages + login/signup/profile, charts (recharts), seed, tests, dev server, mobile-nav verification, screenshots, git push via SSH wrapper (paramiko shim needed - no ssh binary, pip blocked by PEP668 -> use --break-system-packages), then 4 docs via skills, final push.

---
Task ID: 2
Agent: main (Super Z)
Task: Build the complete NEO CRM clone in /home/z/my-project/neo-crm

Work Log:
- Replaced Prisma schema with CRM domain (User, Account, Contact, Lead, Activity, Event, SavedReport, Setting singleton)
- Lib seams: db-path (SQLite path normalization), db (singleton), auth (scrypt + HMAC cookie `neo_session`), api ({ok,data} envelope + guards), rate-limit (10/15min login), format (currency/date/calendar/relative-time), csv (toCsv/parseCsv), constants (stage/status vocabularies + chart palette), download helper
- globals.css: Tailwind v4 CSS-first tokens (literal hex @theme — no var() chains), @utility scrollbar-thin/input-base/chart-no-outline
- UI kit: button/input/card/dialog/select/dropdown/table/tabs/badge/label+checkbox/avatar/toast/misc — all Radix-based or native-ARIA
- Zustand store with hydrate() + per-entity fetch/CRUD actions (API envelope client)
- 16 API routes (auth login/signup/logout/me, users, accounts+id, contacts+id, leads+id, activities+id, events+id, dashboard, reports, settings, search, export, reset, health) — all session-gated, force-dynamic, hand-rolled validation
- App shell: fixed blue sidebar (lg+), sticky topbar with debounced global search + user menu, MobileNav drawer (THE fix: focus trap, Escape, scroll lock, close-on-route-change via adjust-during-render, inert when closed, visibility transition)
- 11 pages: login, signup, dashboard (6 KPIs, filter bar, 2 charts, 4 lists, recent deals), accounts (5 KPIs, filters panel, tier checkboxes), contacts (sort, scan-card dialog, CSV import), leads (sort, 3 charts, funnel), calendar (month grid, agenda, day click), activities (quick-log buttons, priority tabs, timeline, by-type chart), reports (5 tabs, period/owner/stage/status filters, weighted forecast), settings (picklist editors, defaults, data/danger zone), profile
- Entity dialogs use remount-via-key pattern (zero setState-in-effect — React 19 lint clean)
- Seed: demo user sepnetflix2023@outlook.com/$Abcd1234 (mirrors target app), 3 team reps, 10 accounts, 15 contacts, 24 leads across 7 stages/6 months, 20 activities, 12 events, settings
- Tests: 5 vitest suites (47 checks: db-path, auth, format, csv, rate-limit) + 4 Playwright specs (20 checks incl. 5 mobile-navigation regression tests)
- BUGS FOUND & FIXED:
  1. postcss.config.mjs MISSING from scaffold -> Tailwind v4 directives (@theme/@utility) uncompiled -> page rendered unstyled. Created config with @tailwindcss/postcss.
  2. tw-animate-css package uses `style` export condition -> Turbopack CSS import fails. Vendored dist CSS to src/app/vendor/tw-animate.css (MIT).
  3. Store hydrate() was never wired -> added to AppShell mount; /api/auth/me unwrapped user envelope.
  4. E2E SQLite stale-inode: global-setup deleted db file under a reused server -> changed to in-place idempotent reseed (never rm the file).
  5. Closed mobile drawer needed visibility:hidden for correct hidden-state semantics -> transition-[visibility] pattern.
- Verification gate: lint 0 errors/0 warnings, tsc clean, vitest 47/47, build clean (standalone), Playwright 20/20
- agent-browser verification: login flow, dashboard data (24 leads, charts render with bars/lines), all 9 pages, mobile drawer opens with all 8 nav links + navigates + closes + scroll locks + Escape, VLM visual checks passed

Stage Summary:
- Complete working clone at /home/z/my-project/neo-crm, dev server on :3000, e2e db isolated at db/e2e.db
- Next: SSH wrapper setup (paramiko shim - no ssh binary), git commit + push to git@github.com:nordeim/neo-crm.git, then docs via skills, screenshots, final push

---
Task ID: 3
Agent: main (Super Z)
Task: Git push (codebase), documentation via skills, screenshots, final push

Work Log:
- SSH push infra: paramiko installed into venv (pip --user blocked by PEP668), paramiko shim deployed at /home/z/my-project/bin/ssh (outside the repo), operator key saved to /tmp with 0600 then shredded after use
- First push: commit e16efb9 (full codebase) -> git@github.com:nordeim/neo-crm.git main via docs/ssh_git_wrapper_v3.py (dry-run first, then real push with remote ref verification)
- Read all 4 doc skills (agents-md, claude-md, readme-md, project-architecture-document-md) and authored the 4 root docs per their procedures:
  - AGENTS.md (compact agent contract), CLAUDE.md (Meticulous Approach), README.md (badges/features/mermaid/quick-start), Project_Architecture_Document.md (7 ADRs, ER diagram, layer model, security rules, test distribution, key files, glossary)
- Captured 11 dev-server screenshots into docs/screenshots/ (login, 8 desktop pages, mobile dashboard + mobile nav drawer), VLM-verified styling/data
- BUG FOUND & FIXED during screenshot QA: /api/reports treated the UI "all" sentinel as a literal ownerId/stage/status value -> zeroed the default reports view. Fixed with notAll() normalization; e2e regression pinned (stable AED 542.0K assertion that survives the lead-creation test)
- Also fixed: invalid eslint key in NextConfig (removed in Next 16); test-order interaction in reports e2e (24->25 leads)
- Final gate re-run: lint 0/0, typecheck clean, vitest 47/47, build clean, Playwright 20/20
- Final push: commit 7f71cca (docs + screenshots + fixes) -> remote verified @ 7f71cca == local HEAD
- Operator key shredded; dev server still running on :3000 (healthy, session works, all APIs 200)

Stage Summary:
- Remote git@github.com:nordeim/neo-crm.git main @ 7f71cca with: complete clone codebase, 4 architecture docs, 11 screenshots
- Deliverable state: dev server on :3000, demo login sepnetflix2023@outlook.com / $Abcd1234, 67 automated checks green

---
Task ID: 4
Agent: main (Super Z)
Task: Session 2 — remediation, parity iteration, SKILL distillation, push

Work Log:
- git pull refreshed workspace to 9eb86eb (session_1.md, prompt-to-review.md, repo worklog)
- Full doc + codebase review; audit produced remediation plan (docs/plans/2026-09-29-session2-remediation.md) with R-1..R-7, validated against codebase before execution
- TDD execution: 9 new failing tests first (urlForRoot/parseEnvFile/effectiveDatabaseUrl/runtimeDatabaseUrl), then the fix
- Root cause chase for the db-location bug: 21 controlled experiments isolated bun's .env-relative absolutization of file: URLs (process env = schema-relative; .env-loaded = .env-dir-relative; bun absolutizes; prisma/.env doesn't help; bun --env-file doesn't chain; bunshell doesn't source)
- Fix stack: db-path seam (182 lines) + db.ts/seed.ts rewiring + scripts/prisma-env.ts wrapper for db:push; live fd verification passed
- Dependency hygiene: removed tailwindcss-animate + z-ai-web-dev-sdk everywhere
- Parity iteration via VLM comparison loop: sparklines, KPI casing, 3-button header, owner filter, More... link — HIGH parity verdicts on dashboard + accounts
- 11 screenshots refreshed; 4 root docs realigned; neo-crm_SKILL.md distilled (1,019 lines, verified claims)
- Final gate: lint 0/0, tsc clean, 58/58 unit, build clean, 20/20 e2e

Stage Summary:
- Next: git commit (main only) + push via docs/ssh_git_wrapper_v3.py with paramiko shim

---
Task ID: 5
Agent: main (Super Z)
Task: Session 3 — parity hardening vs fresh live-site audit, TDD remediation, docs, push

Work Log:
- git pull to c4a48c1; full docs + codebase review and alignment check
- Fresh live-site audit (login, all pages, desktop + mobile): reference demo data reset to zero — parity targets structure
- Wrote + validated docs/plans/2026-09-29-session3-parity-remediation.md (P-1..P-17)
- TDD execution: currency $ contract, avatar luminance ink, sunday grid (red -> green), then all 17 parity items across topbar/sidebar/dashboard/accounts/contacts/leads/calendar/activities/reports/settings/profile
- New: PATCH /api/users, stat-card component family, chart variants, segmented/pill tabs, 12 refreshed screenshots
- Final gate green: lint 0/0 · tsc · 65/65 unit · build · 21/21 e2e

Stage Summary:
- Next: commit on main + SSH-wrapper push

---
Task ID: 6
Agent: main (Super Z)
Task: Session 5 — interactive-layer parity remediation on neo-crm

Work Log:
- Pulled to b9f388f; reviewed all docs + session-4 plan; baseline gate green (68/68)
- Live-site audit (DOM extraction, both viewports): 16 evidence-backed gaps beyond session-4's visual pass — dialog field sets/vocabularies, table density, responsive column hiding, stat-card subtexts, per-page currency variants, card typography
- TDD execution: 7 red-first checks → constants (unqualified stage, 4 lead sources, 5 emoji contact sources, 6 event types) + formatCompactCurrency({decimals, upper}); 75/75 unit
- Implemented S5-1…S5-16 across table/card/page-parts/dialogs/schema (Event.relatedType, Activity.relatedType+relatedName)/seed; full gate green (lint 0/0 · tsc · 75/75 · build · 21/21 e2e)
- DOM re-verified every item; 12 screenshots; five docs + SKILL v1.2.0 realigned; plan addendum

Stage Summary:
- Ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)

---
Task ID: 7
Agent: main (Super Z)
Task: Session 6 — layout-system parity remediation on neo-crm

Work Log:
- Pulled to 1555c8d; full docs + codebase review; baseline gate green (75/75 unit, 21/21 e2e); .env/db/vitest+playwright configs verified
- Live-site audit (1512x945 + 390x844, class-list extraction): 14 DOM-verified gaps in the layout layer (S6-1..S6-14) — app-shell scroll model, PageHeader anatomy + variants, header-button sizing/labels/disabled states, KPI ladders, dashboard filter card, flex+w-80 rails (accounts/calendar/activities), contacts mobile card list, leads merged card, reports sticky bar, settings/profile wrappers, topbar padding, dual scroll lock
- TDD: 17 red-first pins in tests/page-layout.test.ts -> src/lib/page-layout.ts (132 lines) — every page-level layout class now lives in one test-pinned module consumed by all 9 pages
- Implemented S6-1..S6-14 across app-shell/topbar/mobile-nav/button/page-parts + all 9 pages; full gate green (lint 0/0, tsc, 92/92 unit, build, 21/21 e2e)
- DOM re-verification at 1512/1280/1024/768/390; fixed the flexbox min-width:auto rail squeeze at 1024 (min-w-0 on content); VLM spot-comparison flagged 3 rail details -> re-pinned live (Save All ghost vs calendar blue Clear All link, select mb-2 / checkbox mb-3 labels, activities 4 checkboxes + functional More Filters (1) expander, contacts toolbar max-w-md search + outline Filters button, 16px rail titles)
- Corrected the audit's "broken grid-cols class" finding — a terminal display artifact (ANSI escape ate `[m`); file bytes were always valid; plan doc + test comments fixed
- 12 screenshots refreshed (4 re-captured after the rail refinement round); .env.example verified tracked + matching; docs realigned (README, AGENTS, CLAUDE, Project_Architecture_Document, neo-crm_SKILL v1.3.0)

Stage Summary:
- Gate: lint 0/0 · typecheck clean · 92/92 unit · build clean · 21/21 e2e; rails 320px at 1024; zero horizontal overflow at 390 on all routes
- Ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)
---
Task ID: 8
Agent: main (Super Z)
Task: Session 7 — app-chrome & identity-layer parity remediation on neo-crm

Work Log:
- Pulled to 29f0f84 (user-pushed docs/session_7.md = session-6 transcript); full docs + codebase review; baseline gate green (92/92 unit, 21/21 e2e); .env/db/test configs verified
- Live-site audit at 1512/900/700/390 (fresh login, saved live-auth-s7.json): reference demo data STILL zeroed. 24 DOM-verified gaps (S7-1..S7-24) concentrated in the never-audited chrome layer + reference regressions since session 6 (calendar header search RE-ADDED, reports Reset RE-ADDED, bar buttons h-8, select leading icons)
- Key discoveries: sidebar is hidden md:flex (768px, in-flow flex child of a flex h-screen root — NOT fixed/lg as pinned since session 1); primary token is blue-600 #2563eb (live-comcomputed rgb(37,99,235), ours was blue-500); deltas are green-600/red-600; login card never re-pinned (full slate redesign); main must be the ONLY scroller (ours window-scrolled with inert overflow-auto)
- TDD: 20 new layout-contract pins (37 total) -> page-layout.ts gained SHELL_LAYOUT/NAV_LAYOUT/TOPBAR_LAYOUT/LOGIN_LAYOUT/STAT_CARD/ACTIVITY_CARD/DASHBOARD_CARD/SETTINGS_PICKLIST + subtitleSm + REPORTS_FILTER_BAR re-pin
- Implemented S7-1..S7-24: shell restructure (in-flow md sidebar, h-screen root, main true scroller), sidebar brand/nav/footer-group, topbar (static py-4, search hidden <sm, rounded-md icon buttons, rectangular user button, plain menu), drawer range lg->md, calendar (header search + outline nav buttons + subtitleSm + TrendStatCard re-pin), reports (Reset + h-8 icon buttons + icon select wraps), activities h2 headers + "•••" text button + empty states, dashboard card-header buttons (blue Adds, h-8 w-8 ellipsis), settings picklists (plain empty state, primary add, industrie typo), login card (full LOGIN_LAYOUT slate redesign + gradient page wrapper), toasts (top on mobile -> bottom-right sm), tokens (primary #2563eb/#1d4ed8, delta green-600/red-600, Card shadow, Input rounded-md)
- Full gate green at every checkpoint: lint 0/0 · tsc · 112/112 unit · build · 21/21 e2e (mobile-nav 5/5)
- DOM re-verification: shell (mainScrollable=true, windowScrolls=false), reports sticky bar sticks to main (programmatic scroll test), Reset functional (This Month -> This Quarter), drawer dual lock engages/releases, breakpoints 1024/900/768/700/390 exact (sidebar from 768, rails from 1024, no overflow), login card classes pin-exact, VLM spot-comparison (login + calendar) zero structural findings
- 12 screenshots refreshed; .env.example verified tracked + matching; docs realigned (AGENTS, CLAUDE, README, PAD, neo-crm_SKILL v1.4.0, plan addendum)

Stage Summary:
- Gate: lint 0/0 · typecheck clean · 112/112 unit · build clean · 21/21 e2e; sidebar from md on all breakpoints; main is the sole scroller
- Ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)

---
Task ID: 9
Agent: main (Super Z)
Task: Session 8 — functional-layer parity + mobile-nav lock bug on neo-crm

Work Log:
- Pulled fresh clone at 667bd3e; full docs + codebase review; baseline gate green (112/112 unit); .env rebuilt with DATABASE_URL="file:../db/custom.db" (db/ at repo root), seeded, dev server healthy; scandihaven skills catalog reviewed (mobile-nav debugging taxonomy, Tailwind v4 pitfalls, tdd, agent-browser, clone-app-pat-pro)
- Live-site audit (fresh login, 1512/900/700/390): reference demo data STILL zero. 9 DOM-verified findings: S8-P1 real bug (mobile-nav auto-close mql stuck at 1024px after session-7's lg->md drawer move — resize 700->800 with drawer open left body+main scroll-locked; reproduced), dashboard primary Export label regression, dashboard middle select is a DEAD Table/Cards switcher misread as "All Owners", accounts toolbar missing [Table][Standard/Detailed][More] + text-only Export CSV, leads search icon one size small, leads Filters is a w-80 popover (Status/Source/MinValue/FollowUpDate + Clear/Save View), Log WhatsApp solid emerald-600, settings add buttons dark rgb(23,23,23), login md padding (already pinned)
- Plan written + validated against codebase (docs/plans/2026-09-30-session8-parity-remediation.md); e2e dependencies mapped (none broken)
- TDD: 21 new page-layout pins + tests/lead-filters.test.ts (10 checks) RED first; e2e resize regression written BEFORE the fix (reproduced the bug); then implemented S8-P1 fix (MOBILE_NAV_LAYOUT.autoCloseQuery 768px shared contract), Export label, functional view switchers (dashboard Recent Deals + accounts table <-> card grids), accounts toolbar trio, leads search re-pin, leads Filters popover with Save View localStorage persistence (src/lib/lead-filters.ts pure seam), emerald Log WhatsApp, dark settings add buttons
- VLM round 2 refinements: accounts Export CSV text-only, switcher defaults to "Table", leads Filters button on its own row below search; 4 VLM false-positives disproven by DOM probes
- Full gate green: lint 0/0 · tsc · 133/133 unit · build · 22/22 e2e (mobile-nav 6/6 incl. resize lock-release); DOM re-verified at 6 breakpoints; zero overflow at 390 on all 9 routes; 12 screenshots refreshed; .env.example verified; docs realigned (README, AGENTS, CLAUDE, PAD, SKILL v1.5.0, plan addendum, session_9.md log, worklog)

Stage Summary:
- Gate: lint 0/0 · typecheck clean · 133/133 unit · build clean · 22/22 e2e; drawer closes+unlocks at md exactly like it hides; view switchers + filters popover functional
- Ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)

---
Task ID: 10
Agent: main (Super Z)
Task: Session 9 — component-anatomy parity + Tailwind v4 shadow-scale bug on neo-crm

Work Log:
- Pulled to 2c6eb3e (docs/session_10.md = session-8 transcript); full docs + codebase review; baseline gate green (133/133 unit); .env/db/test configs verified
- Live-site audit at DESKTOP 1512 first (the 390px first pass produced recharts tick-dropping false positives — pipeline stages MATCH at desktop width); all 9 routes captured from both apps + computed-style probes + structured DOM diffing; demo data STILL zero (5th session)
- 18 DOM-verified findings incl. REAL TAILWIND v4 BUG (S9-P0): our v4.3.3 shadow-sm compiles one step heavier than the reference's (the v3->v4 shadow-scale rename; reference shadow-sm computes 0 1px 2px 0.05) — fixed via a single @theme re-pin pinned by the new tests/design-tokens.test.ts
- Other fixes: 16px button icon-text gap (svg mr-2 + only-child guard), dark neutral-900 dialog submits (reference in-dialog --primary = stock rgb(23,23,23)), CardTitle h3->div, settings plain header variant, leads actions flex-col sm:flex-row + per-button stretch, activities flex-wrap, reports unwrapped header button + p-6 pt-0 inset tables + in-table no-py empty rows, Recent Deals 8-column mirror (duplicate Status quirk — decision reversal documented) + empty tbody, empty-state anatomy (dashboard py-4 text-sm / calendar py-8 / Lead Sources empty container), Top Reps div-list, inputs text-base md:text-sm (16px below md), focus rings ring-1 ring-ring (--color-ring #0a0a0a) on inputs/buttons/selects + ring-2+offset tabs, profile surface (Avatar primitive + stroke-2 icon, stretched buttons, Enter your full name placeholder, raw lowercase role, always-enabled Save, space-y column, no h-fit)
- TDD: design-tokens.test.ts (3) + 12 page-layout pins RED first (14 failing) -> 148/148; VLM round-2 refinements (Save enabled at rest, lowercase role input) both DOM-verified on live
- Full gate green: lint 0/0 · tsc · 148/148 unit · build · 22/22 e2e (mobile-nav 6/6); DOM re-verified at 6 breakpoints + 390 route sweep (zero overflow); drawer regression re-verified; 5 VLM page comparisons (all residuals zero-data artifacts; profile ALIGNED)
- 12 screenshots refreshed (login captured logged-out); .env.example verified; docs realigned (README, AGENTS + session-9 contracts + shadow-scale hazard, CLAUDE, PAD, SKILL v1.6.0 + quirk register, plan addendum, session_11.md log, worklog)

Stage Summary:
- Gate: lint 0/0 · typecheck clean · 148/148 unit · build clean · 22/22 e2e; shadow-sm now computes 0 1px 2px 0.05 like the reference; buttons/inputs/dialogs/empty states/tables anatomy-aligned
- Ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)

---
Task ID: 11 (repo)
Agent: main (Super Z)
Task: Session 10 — stock-primitive internals + chart zero-state + reports tab re-mirror

Work Log:
- Pulled to 203162e; baseline gate green (148/148); mobile-nav regression re-verified live before any change
- Live audit at 1512: 13 findings (S10-P0 blur rename bug, cursor rule, input/select internals, search pill, default tooltips, chart zero-state reversal, 8-slug reports pipeline, FunnelChart funnel, tabs 2-4 rebuild, row-derived series, per-page titles, activities chart internals, favicon/login-logo notes)
- TDD: 21 red-first checks -> 169/169; reports-data.ts new seam (agingCounts, forecastAccuracySeries, monthsFromEvents)
- VLM rounds: 3 real fixes (Conversion Rate icon, dashed-default grid, login demo-hint) + 1 claim disproven by DOM probe
- Full gate: lint 0/0, tsc, 169/169 unit, build, 23/23 e2e (mobile-nav 6/6); zero 390px overflow on all 9 routes; breakpoints exact
- 12 screenshots refreshed; .env.example verified; docs realigned (README, AGENTS, CLAUDE, PAD, SKILL v1.7.0, session_13.md, plan addendum)

Stage Summary:
- Gate green; ready: commit on main + SSH-wrapper push

---
Task ID: 12 (repo)
Agent: main (Super Z)
Task: Session 11 — login reset flow + chart geometry + stat shadows + reports de-card + contacts architecture parity

Work Log:
- Pulled to 1982263 (docs/session_14.md = session-10 transcript); full docs + codebase review; baseline gate green (169/169 unit); mobile-nav regression re-verified live before any change (drawer, dual locks, Escape, resize unlock, 390 sweep)
- Live audit at 1512 targeting the layers below the s6-s10 pins: hover micro-states, Radix select/dialog chrome, export/toast behavior (ALL reference Export buttons + Sign up link confirmed dead platform artifacts), chart legends + geometry, settings control types, mobile topbar at 390, login "Forgot password?" (NOT dead — a full in-card reset flow), dialog titles/submits (all 5), reports container (bare tabs vs our Card wrap), contacts architecture (the reference's only full-height layout), stat-card shadow scales
- 10 findings (S11-P1..P10) + one new Tailwind v4 rename-family bug: v4 wraps space-y in :where() AND flips it to margin-bottom on :not(:last-child), so the reference's -mb-2 Back button (16px gap under v3 margin-top semantics) became an 8px OVERLAP under v4 — re-derived to mb-4 from the computed gap
- TDD: tests/login-reset.test.ts (14) + 6 new page-layout pins (CHART_GEOMETRY, STAT_SHADOWS, TABLE_SHADOWS, CONTACTS_LAYOUT, LOGIN_RESET_LAYOUT, iconButton) red-first -> 189/189; +2 auth reset-flow e2e +1 crm chart-geometry e2e -> 26/26
- Implemented: the two-view reset flow (signin->reset->sent, src/lib/login-reset.ts seam; slate-400 placeholder, one-size-smaller submit), chart heights (dashboard/reports 300px, leads rail 250px, activities 150px) + stock recharts <Legend/>, stat-card bare shadows + KPI hover:shadow-md, reports tabs de-carded (bare space-y-6 container, gap-6 grids, tab bodies space-y-6), contacts full-height layout (h-[calc(100vh-64px)] + 5px-short-topbar quirk + fixed p-8), contacts table card shadow-sm
- VLM rounds: 2 real fixes (the space-y/-mb-2 overlap -> mb-4; reset placeholder slate-600 -> slate-400), both DOM-proven before+after; reset view re-compared ALIGNED
- Full gate green: lint 0/0 · tsc · 189/189 unit · build · 26/26 e2e (mobile-nav 6/6); DOM re-verified at 1512/1024/768/700/390; zero 390px overflow on all 9 routes
- 12 screenshots refreshed; .env.example verified tracked+matching; docs realigned (README, AGENTS + space-y hazard + session-11 contracts, CLAUDE, PAD, SKILL v1.8.0, session_15.md, plan addendum, worklog)

Stage Summary:
- Gate green; ready: commit on main + SSH-wrapper push

---
Task ID: 13 (repo)
Agent: main (Super Z)
Task: Session 12 — mobile-nav focus race + border split + tabs anatomy + KPI drift + sparkline rebuild + custom 404

Work Log:
- Pulled to 992befe (docs/session_16.md = session-11 completion transcript); baseline gate green (189/189 unit); mobile-nav regression re-verified live BEFORE changes: 9/10 PASS with one REAL BUG
- S12-P1 root-caused via focus/rAF instrumentation: the drawer's rAF focus() fired in the same frame as the transition-[visibility] class flip — computed visibility still hidden — and focus() on a not-rendered element SILENTLY NO-OPS (keyboard users Tabbed through the background behind the aria-modal dialog; WCAG 2.4.3). Fixed with a bounded retry (verify activeElement, re-schedule ≤5 frames; lands frame 3) + cancelled flag + h-dvh panel; e2e-pinned as the 7th mobile-nav check
- The reference MOVED since session 11 (dashboard KPI cards dropped hover:shadow-md + border-gray-200) — s11 hover pin re-derived to reports-only; moving-target rule recorded
- S12-P3 border split: reference default #e5e5e5 (all stock cards, rows, tablists, outline buttons, selects, dialogs, bare inputs) vs explicit gray-200 #e5e7eb (reports KPI + reports filter + contacts table + topbar search); --color-line re-pinned + --color-line-strong added; login slate-200 verified untouched
- S12-P4 tabs: stock Radix classes (TABS_PILL/TABS_SEGMENTED) — muted-ink tracks (#737373 inactive), natural height, transition-all, ring-offset-background, data-state variants, bare-shadow active pills (segmented shadow-sm was one step light), pill text-xs sm:text-sm, NO hover on any variant; reference's tabIndex=-1 tabs NOT mirrored (accessible roving stays)
- S12-P5 KPI de-hover + text-gray-600 labels + DeltaText de-medium; S12-P6 sparklines rebuilt on recharts (monotone, line sw2 / area fill 0.3 sw1; dashboard mt-2 h-8, reports flex-1 h-12 mr-2 capped 176px; Lost Deals sparkless; solid color-50 chips via KPI_CHIP_BG)
- S12-P2 custom 404: not-found.tsx (server, title.absolute to avoid the doubled suffix) + not-found-body.tsx (client usePathname); VLM round-1 caught the divider bar + space-y-3 group + path span + pt-6 group the first extraction missed; round-2 ALIGNED
- TDD: 17 red-first checks (3 design-tokens + 14 page-layout) -> 206/206; +2 e2e (focus-entry + custom-404) -> 28/28 (mobile-nav 7/7); one s11 e2e re-scoped to [role=tabpanel] (sparks are recharts now)
- Full gate: lint 0/0, tsc, 206/206 unit, build, 28/28 e2e; DOM re-verified at 1512/1024/768/700/390; zero 390px overflow on all TEN routes; verified-aligned: settings picklist, print (none both), dead search/exports (documented), v4 hazard sweep clean
- Deliverables: 12 screenshots refreshed + 13-not-found.png; .env.example verified; docs realigned (README, AGENTS + 5 session-12 contract blocks, CLAUDE, PAD, SKILL v1.9.0 §16d, session_17.md, plan addendum, worklog)

Stage Summary:
- Gate green; ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)

Stage Summary (final):
- PUSHED: session-12 commit 652511b on main -> git@github.com:nordeim/neo-crm.git (first push attempt hit a transient GitHub "fatal error in commit_refs"; retry verified remote @ 652511b == local HEAD); all suites green (206 unit / 28 e2e); docs at SKILL v1.9.0

---
Task ID: 14 (repo)
Agent: main (Super Z)
Task: Session 13 — doubled auth titles + profile parity + button radius + CardTitle map + by-type rebuild + dashed grids + funnel type + foreground/base-font re-pins + stock account menu

Work Log:
- Continued from the interrupted session-13 remediation (cut off during the final VLM verification round); workspace pulled to 22aeb95 (no new remote commits), session-13 tree was fully implemented but uncommitted
- Baseline gate re-run on the uncommitted tree: lint 0/0 · tsc clean · 244/244 unit · 31/31 e2e (mobile-nav 7/7) — one OPERATIONAL root-cause on the way: a bare `next build` had left .next/standalone WITHOUT static chunks (every /_next/static request 404'd, pages never hydrated, auth.setup timed out at waitForURL("/")); fixed by building through `bun run build` (next build + cp .next/static + cp public) — documented in AGENTS/PAD/SKILL §16e
- Live DOM re-verification completed on a fresh dev server (:3000) at 1512 + 390 across every session-13 surface: SSR titles via raw-HTML curl (login "NEO CRM", signup "Sign up | NEO CRM", 404 "This Page Does Not Exist | NEO CRM"), foreground #0a0a0a + KPI 36px lh/normal ls + no +1d, 6px button radii + per-page CardTitle map, by-type card complete (chips #3b82f6/#8b5cf6/#f59e0b/#10b981/#14b8a6 + static "Last 2 days" + checkbox footer), calendar cells bordered in all three states, dashed 3 3 grids + funnel 8 raw-slug ticks, account menu role=menu z-50/rounded-md/stock items (real pointerdown click — synthetic .click() never opens Radix menus), profile gray-50/capitalize/neutral-900 badge/16px stock title; zero 390px overflow on all TEN routes
- VLM rounds (dashboard + profile at 1512): all remaining diffs data-driven (reference demo data still zero — 9th consecutive session) or OCR/platform artifacts; profile "Üser" claim DOM-disproven (both render "User" via capitalize)
- Deliverables: 13 screenshots refreshed (login logged-out, 9 routes at 1512, mobile dashboard + open drawer at 390, custom 404); .env DATABASE_URL="file:../db/custom.db" + db/ at repo root + .env.example matching + vitest/playwright configs verified; docs realigned (README badge 275 + counts + e2e coverage, AGENTS counts + 11 session-13 contract blocks + build-script note + dashed-grid CORRECTION (recharts default grid is SOLID — the s10 pin was a misread), CLAUDE test strategy, PAD tree + 244/31 matrix + session-13 notes, SKILL v1.10.0 §16e, docs/session_19.md, plan addendum, this worklog)

Stage Summary:
- Gate green: lint 0/0 · tsc · 244/244 unit · 31/31 e2e (mobile-nav 7/7); zero 390px overflow all ten routes; 13 screenshots; docs at SKILL v1.10.0
- Ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)

---
Task ID: 15 (repo)
Agent: main (Super Z)
Task: Session 14 — settings Defaults/Data tab structure + Danger Zone rebuild + /Profile casing alias + line-soft re-pin + the v4 space-y inline-label no-op fix

Work Log:
- Pulled to 08ed611 (docs/session_20.md = the prior session's transcript); full docs + codebase review; baseline gate green (244/244 unit); env verified (.env file:../db/custom.db + db/ at root + .env.example + vitest/playwright configs)
- Re-probed every previously-pinned family FIRST (moving-target rule): NO drift — dashboard KPIs/foreground/base-font/grids/CardTitle map/button radii/calendar cells/account menu/by-type/reports tabs/login family/th-td/borders all stable; demo data still zero (10th session)
- Mobile-nav regression re-verified LIVE at 390px before changes: 7/7 PASS (trigger hit-test scoped to header button[aria-expanded] — the overlay close button matches naive regexes; focus lands inside the dialog; dual locks; Escape; trap wrap; resize auto-close; route close); 390 sweep clean on 10 routes
- Unprobed layers audit: settings Defaults/Data tabs (never deep-compared) — REAL findings: 3-col grid vs single-column space-y-4 stack; "Templates" vs "Import Templates"; flex-wrap vs vertical space-y-2 stacks; secondary/sm vs outline default w-full sm:w-auto buttons; Danger Zone missing bg-red-50 tint + circle-alert icon + text-red-700 + max-w-xs + stacked layout + #fafafa fg, with an extra warning paragraph; /Profile 404 vs reference serving both casings; --color-line-soft #f3f4f6 scaffold assumption vs reference muted/accent #f5f5f5 (27 usages)
- Reference drift documented: signup flow REMOVED on the reference (login Sign-up button dead, /signup renders 404 view) — our functional /signup stays the documented superset; logout leaves the reference on / as "Hi, Guest"; picklist add flow DEAD on the reference (ours functional superset); focus order aligned (our aria-labels = accessible superset)
- TDD: 18 red-first checks (12 page-layout + 1 design-tokens + 4+1 profile-route/override-scope) -> 262/262 unit; +3 e2e -> 34/34 (mobile-nav 7/7)
- /Profile alias took 3 gate-caught attempts: (1) separate export async function redirects() silently ignored (routes-manifest empty); (2) in-config redirect LOOPS (Next matches redirects case-insensitively; caseSensitive not a valid per-redirect property in Next 16 -> "Invalid redirect found"); (3) SHIPPED: thin src/app/Profile/page.tsx -> redirect("/profile") outside the (app) group (case-exact by filesystem)
- Mid-verification root cause (NEW Tailwind v4 hazard, the s11 space-y flip's second face): v4's margin-BOTTOM on :not(:last-child) lands on the INLINE <label> — vertical margins on inline elements DO NOT APPLY — the label->control gap collapsed to ~3px vs the reference's 12px (v3 margin-TOP on the control). Fix: literal space-y-2 kept + mt-2 on every control (controlMt contract, 7 call sites); label-top-to-control-top = 28px BOTH apps after
- Full gate: lint 0/0 · tsc · 262/262 unit · build (bun run build) · 34/34 e2e; live DOM re-verified at 1512+390 on every touched surface; zero 390px overflow on all ELEVEN routes (incl. /Profile); VLM: 2 usable rounds (ALIGNED/SAME), 2 hallucinated (DOM-discounted)
- Deliverables: 13 screenshots refreshed; .env/.env.example verified; docs realigned (README badge 296 + counts, AGENTS + 6 session-14 blocks + hazards, CLAUDE, PAD matrix + notes, SKILL v1.11.0 §16f + color table fixed, docs/session_21.md, plan addendum, worklogs)

Stage Summary:
- Gate green: lint 0/0 · tsc · 262/262 unit · 34/34 e2e (mobile-nav 7/7); zero 390px overflow on 11 routes; 13 screenshots; docs at SKILL v1.11.0
- Ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)

Stage Summary (final):
- PUSHED: session-14 commit 5ee8006 on main -> git@github.com:nordeim/neo-crm.git via docs/ssh_git_wrapper_v3.py (explicit --remote — the wrapper's default remote points at the wrong repo; dry-run clean 08ed611..5ee8006 fast-forward, then real push with remote verified @ 5ee8006 == local HEAD); all suites green (262 unit / 34 e2e); docs at SKILL v1.11.0; deploy key shredded after verification

---
Task ID: 16 (repo)
Agent: main (Super Z)
Task: Session 15 — the entity-dialog geometry layer: stock shadcn chrome + two body families + the v4 literal-palette hazard

Work Log:
- Pulled to 012071c (docs/session_22.md = the prior session's transcript); full docs + codebase review; baseline gate green (262/262 unit); env verified (.env file:../db/custom.db + db/ at root + .env.example + vitest/playwright configs — the task book's config asks already satisfied)
- Re-probed every previously-pinned family FIRST (moving-target rule): NO drift — body 16px/#0a0a0a, KPI cards, dashed grids, radii, sidebar, 404, login (incl. full mobile card at 390), mobile topbar, bell dead both; demo data still zero (11th session); reference /signup still renders 404 (s14 drift stands)
- Mobile navigation verified three ways: reference at 390 has NO nav (11th session), our 7-check regression LIVE 7/7 PASS, drawer internals swept for v4 hazards (h-dvh 844, space-y-1 on block links, blur, #2563eb — healthy); 390 sweep clean on 11 routes
- Unprobed-layer audit: ALL FIVE reference create dialogs fully mapped (outerHTML + computed probes at 1512/390) — REAL structural findings: scaffold-era chrome (rounded-2xl/shadow-xl/2rem-inset/blur overlay) vs stock shadcn (w-full/sm:rounded-lg/shadow-lg/slides, bg-black/80 no blur, centered-mobile headers, opacity close X); invented descriptions + placeholders vs NONE on the reference; flat grid-gap-1.5 single-column bodies vs the py-4 space-y-2 families (Lead Status/Source 2-col; Account whole-body 2-col; Contact avatar section with gradient circle + camera + Name inside; Event/Activity max-w-2xl space-y-4 bare-pair family with pt-4 footers); Event submit is the one-off blue
- NEW v4 hazard class (the literal-palette drift): literal bg-blue-600 compiles to rgb(21,93,252) ≠ the reference's v3 #2563eb — e2e-caught via canvas getImageData pixel readback (getComputedStyle serializes v4 colors as lab()/oklab()); fix: the --primary/--primary-hover token pair (#2563eb/#1d4ed8 = the reference's exact blues); rule documented in SKILL 16g.4
- TDD: 18 red-first checks (DIALOG_FAMILY: chrome x6 + body x5 + per-dialog x4 + source rules x2 + textarea re-pin) -> 280/280 unit; +3 e2e (Lead stock geometry at 390, Contact avatar section, wide Event family + blue submit) -> 37/37 (mobile-nav 7/7); two e2e races gate-caught (zoom-in-95 animation vs boundingBox; the closed drawer matching [role=dialog] selectors)
- Full gate: lint 0/0 · tsc · 280/280 unit · build (bun run build) · 37/37 e2e; live DOM re-verified at 1512+390 on every touched surface (28px geometry, full-bleed 390, radius 0, centered title, 2-col pairs, avatar live initials, 672px family, blue submit pixel rgb(37,99,235), scan-card superset intact, drawer healthy); zero 390px overflow
- Deliverables: 19 screenshots (13 established + 6 new dialog captures); .env/.env.example verified; docs realigned (README badge 317, AGENTS + 4 session-15 blocks + literal-palette hazard, CLAUDE, PAD matrix 280/37, SKILL v1.12.0 16g, docs/session_23.md, plan addendum, worklogs)

Stage Summary:
- Gate green: lint 0/0 · tsc · 280/280 unit · 37/37 e2e (mobile-nav 7/7); zero 390px overflow; 19 screenshots; docs at SKILL v1.12.0
- Ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)

Stage Summary (final):
- PUSHED: session-15 commit 2f819a4 on main -> git@github.com:nordeim/neo-crm.git via docs/ssh_git_wrapper_v3.py (explicit --remote; dry-run clean 012071c..2f819a4 fast-forward, then real push with remote verified @ 2f819a4 == local HEAD); all suites green (280 unit / 37 e2e); docs at SKILL v1.12.0; deploy key shredded after verification

---
Task ID: 17 (repo)
Agent: main (Super Z)
Task: Session 16 — the responsive page-root model + the table kit's stock strings + the calendar card rebuild

Work Log:
- Pulled to 0a7620a (docs/session_24.md = the prior session's transcript); full docs + codebase review; baseline gate green (280/280 unit); env verified (.env file:../db/custom.db + db/ at root + .env.example + vitest/playwright configs — the task book's config asks already satisfied)
- Re-probed every previously-pinned family FIRST (moving-target rule): NO drift — body 16px/#0a0a0a, KPI cards, dashed grids, radii, sidebar, 404, tab tracks, auth surface (/signup still 404 view); demo data still zero in steady state (12th session) with ONE documented anomaly: a single /Reports load served the full demo dataset (an instance with data exists behind the platform's load balancer; 6/6 subsequent loads zero)
- Mobile navigation verified three ways: reference at 390 has NO nav (12th session), our 7-check regression LIVE 7/7 PASS, drawer internals swept for v4 hazards (healthy); 390 overflow sweep clean on 11 routes
- Unprobed-layer audit (responsive anatomy at 390/900/1512 — the 900 MID width was never swept before): SEVEN findings — the page-ROOT model (reference pages own their padding: 6x standard bg+min-h, Leads/Profile bare, Contacts h-calc direct under main; our blanket shell wrapper double-padded contacts: 358px box/294px card/37px scroll vs 390/326/5); the table kit off stock strings (overflow-x-auto+scrollbar-thin container, missing checkbox variants, hover /60 vs /50, no selected state) + the platform's global th,td{padding:1px} reset unmirrored (41 vs 43px header rows); THE CARD-PRIMITIVE BORDER LEAK (border border-line passes through cn() — four TABLE_CARD surfaces computed a 1px border + invented overflow-hidden vs the reference's borderless bg-white rounded-lg shadow divs); the settings picklist grid at lg vs the reference's md (1-col 580px vs 2-col 282px at 768-1023px — a mid-width-only divergence); the calendar card's merged 42-child DOW+month grid + CardHeader/CardContent wrappers + 18px semibold title vs the reference's flat anatomy (bold responsive title, gap-1 sm:gap-2 split grids, 24/8px gaps)
- Canvas-verified bg-gray-50 computes rgb(249,250,251) on our v4 = the reference's exact value (no literal-palette drift for gray-50; PAGE_ROOT uses the bg-background token anyway)
- TDD: 18 red-first checks (PAGE_ROOT pair + shell rewrite + per-page-root source pins + contacts-root pin, table-kit stock strings x4, TABLE_CARD plain-div rules x2, CALENDAR_CARD x4, SETTINGS_GRID md, design-tokens th/td reset) -> 297/297 unit (+17 net); +4 e2e (contacts 390 geometry, settings 2-col at 900, calendar split grids + bold title, borderless accounts card) -> 41/41 (mobile-nav 7/7); one mid-flight e2e fix (settings waitForFunction vs the settings-fetch race); three JSX balance slips gate-caught by lint before shipping
- Full gate: lint 0/0 · tsc · 297/297 unit · build (bun run build) · 41/41 e2e; live DOM re-verified at 1512/900/390 on every touched surface (contacts full-width 390 + 326px card + 5px quirk, borderless cards x4, 43px header rows + 8px 1px compact th, stock overflow-auto, settings 2-col 282px cards at 900, calendar two grids + 24/8px gaps + bold title, page roots, drawer healthy); zero 390px overflow on 11 routes
- Deliverables: 20 screenshots (19 re-captured with per-shot URL/dialog verification after the first 1512 loop silently failed to navigate + the NEW contacts 390 full-height capture); .env/.env.example verified; docs realigned (README badge 338 + counts + feature rows, AGENTS + session-16 contract blocks + page-root model + th/td reset + border-leak lesson, CLAUDE, PAD matrix 297/41 + notes, SKILL v1.13.0 16h, docs/session_25.md, plan addendum, worklogs)

Stage Summary:
- Gate green: lint 0/0 · tsc · 297/297 unit · 41/41 e2e (mobile-nav 7/7); zero 390px overflow; 20 screenshots; docs at SKILL v1.13.0
- Ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)

Stage Summary (final):
- PUSHED: session-16 commit 0b6e256 on main -> git@github.com:nordeim/neo-crm.git via docs/ssh_git_wrapper_v3.py (explicit --remote; dry-run clean 0a7620a..0b6e256 fast-forward, then real push with the wrapper's remote verification + an independent ls-remote check @ 0b6e256 == local HEAD); all suites green (297 unit / 41 e2e); docs at SKILL v1.13.0; deploy keys shredded after verification

---
Task ID: 18 (repo)
Agent: main (Super Z)
Task: Session 17 — the stock button/checkbox layer + the icon-glyph census (completing the interrupted session-17 audit)

Work Log:
- Pulled to 28678cb (docs/session_26.md = the session-16 transcript); full docs + codebase review; baseline gate green (297/297 unit); env verified (.env file:../db/custom.db + db/ at root + .env.example + vitest/playwright configs — the task book's config asks already satisfied)
- Mobile navigation verified three ways: reference at 390 has NO nav (13th session), our 7-check regression LIVE 7/7 PASS (before AND after the changes), drawer healthy with the new glyphs; demo data still zero (13th session)
- Audit layer: the first ICON-GLYPH CENSUS (name + SVG path data, all 9 pages, both apps) — the interrupted session's S17-P1/P2/P3 findings re-verified live + extended: THREE SIDEBAR glyph drifts the interrupted attempt missed (ref users/circle-user/calendar vs our User/CircleUserRound/CalendarDays — path-data-proven), the polygon Filter (lucide 0.525 re-exports the curved Funnel as Filter; the old polygon exported by NO name → hand-rolled FilterPolygon), scan + download-on-Import (contacts), circle-check-big/calendar/users chips, calendar/message-square quick-log; the topbar account trigger hand-written (no focus-visible ring, one-level avatar); every filter rail's checkbox a native input (ref: stock Radix button checkboxes, checked fill #171717 dark-not-blue); the default variant shadow-sm vs the ref's bare shadow; the ghost's invented text-muted
- TDD: 16 red-first checks (topbar re-pin + source rules, nav-config pins, FilterPolygon component + page rules, icon-swap rules, CHECKBOX contract + primitive + call-site rules, variant pins) -> 312/312 unit (+15 net); +4 e2e (trigger ghost+avatar, sidebar users glyph, tier stock checkboxes with canvas-readback #171717, blue primaries bare shadow) -> 45/45 (mobile-nav 7/7)
- Mid-flight: three source-pin regexes re-scoped (they matched the session's own doc comments); the checkbox e2e hit the v4 lab() trap -> 1x1 canvas readback; first e2e run failed on a stale reused :3100 server -> killed + clean re-run
- Full gate: lint 0/0, tsc, 312/312 unit, build (bun run build), 45/45 e2e; live DOM re-verified at 1512+390 on every touched surface (trigger classes + keyboard ring rgb(10,10,10) 1px, two-level avatar, census parity, checkbox Space-toggling + dark fill + Check indicator, polygon points exact, Save All #0a0a0a, New Account bare shadow); zero 390px overflow on 11 routes
- Deliverables: all 20 screenshots re-captured with per-shot URL/dialog verification (zero duplicates); .env/.env.example verified; docs realigned (README badge 357 + counts + feature rows, AGENTS + 5 session-17 contract blocks, CLAUDE, PAD matrix 312/45 + the §7.4 checklist fix (280/37 -> 312/45) + session-17 notes, SKILL v1.14.0 16i + frontmatter project_state fix, docs/session_27.md, plan addendum, worklogs)

Stage Summary:
- Gate green: lint 0/0, tsc, 312/312 unit, 45/45 e2e (mobile-nav 7/7); zero 390px overflow; 20 screenshots; docs at SKILL v1.14.0
- Ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)

Stage Summary (final):
- PUSHED: session-17 commit 4fd842d on main -> git@github.com:nordeim/neo-crm.git via docs/ssh_git_wrapper_v3.py (explicit --remote; dry-run clean 28678cb..4fd842d fast-forward, then real push with the wrapper's remote verification + an independent GIT_SSH_COMMAND ls-remote check @ 4fd842d == local HEAD); all suites green (312 unit / 45 e2e); docs at SKILL v1.14.0; deploy keys shredded after verification

---
Task ID: 19 (repo)
Agent: main (Super Z)
Task: Session 18 — the document metadata layer (description/OG/Twitter/favicon/sitemap/robots) + the quarter time-bomb fix

Work Log:
- Re-cloned the repo fresh at d67a237 (sandbox reset); re-provisioned .env (DATABASE_URL file:../db/custom.db) + db/ at the repo root + db:push/db:seed; baseline gate green (312/312 unit); vitest + playwright configs verified
- Mobile navigation verified three ways FIRST: reference at 390 still ships NO nav (14th session), our 7-check drawer regression LIVE 7/7 PASS (incl. real-click focus restore + focus-trap wrap + resize lock release), drawer internals swept for v4 hazards (zero hidden attrs, zero inline-margin targets, h-dvh exact, #2563eb panel); zero 390px overflow on all 11 routes; icon census 9/9 pages at parity; demo data still zero (14th session)
- NEW audit layer — the document metadata surface (never swept in 17 sessions): found the 405-char description drift, the missing OG/Twitter card family, the missing favicon, and the missing sitemap.xml + robots Sitemap line while NEXT_PUBLIC_SITE_URL was documented but consumed NOWHERE
- TDD: 14 red-first checks (tests/metadata.test.ts, dynamic seam imports for granular red) -> 326/326 unit; +5 e2e -> 50/50 (mobile-nav 7/7)
- Gate-caught corrections: (a) Next's robots.ts/sitemap.ts serializers drift from the reference's bytes (User-Agent case, changefreq dropped, priority 1.0 -> "1") — rewritten as force-static route handlers, byte-identical output; (b) the reports e2e $542.0k assertion was a QUARTER TIME BOMB that detonated on 2026-10-01 (Q4 began, server-side periodStart window emptied) — fixed with the All-Time period + the date-independent 7 $687.0K pin
- Full gate green: lint 0/0, tsc, 326/326 unit, build, 50/50 e2e; live re-verified (head census, og:image/icon 200s, robots byte-identical, sitemap format-identical, drawer 7/7, zero 390 overflow); 20 screenshots re-captured with per-shot verification (zero duplicates); docs realigned (README 376, AGENTS, CLAUDE, PAD 326/50, SKILL v1.15.0 16j, docs/session_29.md, plan addendum, worklogs)

Stage Summary:
- PUSHED: session-18 commit fe78bd5 on main -> git@github.com:nordeim/neo-crm.git via docs/ssh_git_wrapper_v3.py (explicit --remote; dry-run clean d67a237..fe78bd5 fast-forward, then real push with the wrapper's remote verification + an independent GIT_SSH_COMMAND ls-remote check @ fe78bd5 == local HEAD); all suites green (326 unit / 50 e2e); docs at SKILL v1.15.0; deploy key shredded after verification

---
Task ID: 20 (repo)
Agent: main (Super Z)
Task: Session 19 — the PWA/installable + per-route metadata layer (manifest/theme-color/apple family/per-route OG+canonical) + the dialog input micro-contracts

Work Log:
- Pulled to 58b82e4 (docs/session_30.md = the session-18 transcript, the ONLY change — zero app-code drift since fe78bd5, so every s18 pinned family held by construction); full docs + codebase review; baseline gate green (326/326 unit); env verified (.env file:../db/custom.db + db/ at root + .env.example + vitest/playwright configs)
- Mobile navigation verified three ways FIRST: reference at 390 still ships NO nav (15th session), our 7-check drawer regression LIVE 7/7 PASS (trigger 36×36 at 16,16; links + locks + focus entry; Escape + real-click focus restore; focus-trap wrap BOTH directions — a probe "failure" was the overlay, unreachable in natural keyboard flow; resize auto-close + lock release; route-change close), drawer v4-hazard sweep healthy; zero 390px overflow on 11 routes; s18 metadata census re-probed NO drift; demo data still zero (15th session, 4/4 loads)
- NEW audit layer — the PWA/INSTALLABLE + PER-ROUTE metadata surface (never swept in 18 sessions) + the create-dialog input attribute census: EIGHT findings — no manifest.json+link (the reference serves the full installable manifest: standalone, #000000 theme, same-src 192+512 icons, scope at origin), theme-color #000000 vs our #2563eb (an s18 mis-read), the missing mobile-web-app-capable/apple-meta family + apple-touch-icon 180x180, the PER-ROUTE canonical/OG/Twitter family (og:title "X | NEO CRM", og:url origin+route, og:description "<Page> on NEO CRM. " + the 405-char paragraph, twitter likewise — live-probed on all 10 reference routes; root+login unprefixed), no canonical link, the Contact Phone type=tel drift (Lead stays text on both — the reference's own split), our two invented datalists, the avatar accept list
- TDD: 14 red-first checks (tests/pwa-metadata.test.ts, dynamic seam imports) -> 340/340 unit (+14, 17 suites); +6 e2e -> 56/56 (mobile-nav 7/7)
- Gate-caught corrections: (a) declaring metadata.icons REPLACES the file-convention link[rel=icon] — the s18 favicon e2e caught it; both icons now ship as file conventions (src/app/apple-icon.png 180x180 + src/app/icon.png), the layout declares NO icons field; (b) Next's URL resolution strips the root canonical's trailing slash (even the absolute form emits slashless) — test pins the slashless form, nuance documented; (c) one New Event dialog e2e flake under parallel load, clean on re-run; three source-pin regexes re-scoped off the session's own doc comments
- Live serializer verification BEFORE the build (curl SSR probes): manifest link+bytes, theme-color, apple-touch-icon sizes 180x180, per-route canonical/og/twitter on all 10 routes, PWA metas surviving page-level other-replacement, s13 absolute titles intact; Contact dialog live-verified (tel + accept + zero datalists)
- Full gate green: lint 0/0, tsc, 340/340 unit, build (manifest.json + apple-icon.png in the standalone manifest), 56/56 e2e; 20 screenshots re-captured with per-shot verification (zero duplicates); docs realigned (README 396 badge + PWA row + env table, AGENTS + session-19 contract block, CLAUDE, PAD matrix 340/56 + §7.2 + §7.4, SKILL v1.16.0 §16k, docs/session_31.md, plan addendum, worklogs)

Stage Summary:
- Gate green: lint 0/0 · tsc · 340/340 unit · 56/56 e2e (mobile-nav 7/7); zero 390px overflow; 20 verified screenshots; docs at SKILL v1.16.0
- Ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)

Stage Summary (final):
- PUSHED: session-19 commit f377507 on main -> git@github.com:nordeim/neo-crm.git via docs/ssh_git_wrapper_v3.py (explicit --remote; dry-run clean 58b82e4..f377507 fast-forward, then real push with the wrapper's remote verification + an independent GIT_SSH_COMMAND ls-remote check @ f377507 == local HEAD); all suites green (340 unit / 56 e2e); docs at SKILL v1.16.0; deploy key shredded after verification

---
Task ID: 21 (repo)
Agent: main (Super Z)
Task: Session 20 — the HTTP response-header layer (the edge security set) + the tab-order/print-style verification layers

Work Log:
- Pulled to 17e1b02 (docs/session_32.md = the session-19 transcript + a worklog line, the ONLY changes — zero app-code drift since f377507, so every s19 pinned family held by construction); full docs + codebase review; baseline gate green (340/340 unit); env verified (.env file:../db/custom.db + db/ at root re-seeded + .env.example + vitest/playwright configs)
- Mobile navigation verified three ways FIRST: reference at 390 still ships NO nav (16th session), our 7-check drawer regression LIVE 7/7 PASS (trigger 36×36 at 16,16; open + 8 links + focus entry + dual body/main locks; Escape + real-click focus restore; focus-trap wrap BOTH directions at the PANEL boundary; resize auto-close + lock release + sidebar swap; route-change close), drawer v4-hazard sweep clean (zero hidden attrs, h-dvh 844 exact, #2563eb panel, 2px blur); zero 390px overflow on 11 routes; s18+s19 metadata census re-probed via curl-SSR NO drift; demo data still zero (16th session)
- Probe-method lesson: Element.checkVisibility() WITHOUT options does NOT test the visibility property — it false-positived the drawer-open probe on the closed fixed-position panel; read getComputedStyle(el).visibility
- NEW audit layer — the HTTP response-header surface (never swept in 19 sessions): the reference's edge injects referrer-policy strict-origin-when-cross-origin + x-content-type-options nosniff + strict-transport-security max-age=31536000 (bare) on EVERY response (10+ probes incl. its hashed CSS + manifest after its 302 hop); FOUR findings — S20-P1/P2/P3 the three missing headers, S20-P4 our sitemap's charset-suffixed application/xml vs its bare form (robots/manifest already matched)
- Two more never-swept layers verified AT PARITY (no action): the keyboard tab-order census (login/dashboard/leads both apps — identical focus sequences; the reference ships FIVE unnamed interactive elements where ours carries aria-labels, the documented accessible superset; its sortable headers are clickable divs, ours proper th>button) and the print-styles sweep (both zero @media print)
- TDD: 9 red-first checks (tests/http-headers.test.ts) -> 349/349 unit (+9, 18 suites); +4 e2e -> 60/60 (mobile-nav 7/7)
- Gate-caught corrections: (a) annotating the headers() return as Promise<NextConfig["headers"]> fails tsc because that indexed type IS the function type — annotation dropped for inference, test regex re-scoped; (b) the first e2e run failed at browser LAUNCH with pthread_create exhaustion from the session's open agent-browser contexts — closed them, clean 60/60 re-run
- Live serializer verification BEFORE the build (curl, post-config-restart): the three headers on /, /login, manifest, robots, sitemap, the CSS asset, /icon.png — NO content-type conflicts with the route handlers; HSTS verified inert over plain-HTTP localhost (RFC 6797 §7.1) with browser flows + the full suite healthy
- Full gate green: lint 0/0, tsc, 349/349 unit, build, 60/60 e2e; 20 screenshots re-captured with per-shot verification (zero duplicates); .env/.env.example verified (no change needed — the header layer has no env surface); docs realigned (README badge 409 + security-header row + counts, AGENTS + session-20 contract block + suite list, CLAUDE + http-headers suite, PAD matrix 349/60 + §7.2 + §7.4, SKILL v1.17.0 §16l + frontmatter, docs/session_33.md, plan addendum, worklogs)

Stage Summary:
- Gate green: lint 0/0 · tsc · 349/349 unit · 60/60 e2e (mobile-nav 7/7); zero 390px overflow; 20 verified screenshots; docs at SKILL v1.17.0
- Ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)

Stage Summary (final):
- PUSHED: session-20 commit 6b8809e on main -> git@github.com:nordeim/neo-crm.git via docs/ssh_git_wrapper_v3.py (explicit --remote; dry-run clean 17e1b02..6b8809e fast-forward, then real push with the wrapper's remote verification + an independent GIT_SSH_COMMAND ls-remote check @ 6b8809e == local HEAD); all suites green (349 unit / 60 e2e); docs at SKILL v1.17.0; deploy key shredded after verification
---
Task ID: 22 (repo)
Agent: main (Super Z)
Task: Session 21 — the login-card funnel layer (the in-place signup + verify-email views, the Callout banners, the exact auth strings) + the contrast/focus-visible/@media verification layers

Work Log:
- Pulled to e1f808e (docs/session_34.md = the session-20 transcript, the ONLY change — zero app-code drift since 6b8809e, so every s20 pinned family held by construction); full docs + codebase review; baseline gate green (349/349 unit); env verified (.env file:../db/custom.db + db/ at root + .env.example + configs)
- Standing layers re-verified FIRST with NO drift: reference mobile nav still absent at 390 (17th session — after correcting a false-positive probe: visibility !== 'hidden' does NOT detect display:none ancestors, use getClientRects().length), our 7-check drawer regression LIVE 7/7 (trigger 36×36; open + 8 links + focus entry + dual locks; Escape + real-click focus restore; trap wrap BOTH directions; resize auto-close + sidebar swap; route-change close), drawer v4-hazards clean, zero 390px overflow on 11 routes, s18+s19+s20 metadata/header census intact (curl-SSR), demo data still zero (17th session)
- Four never-swept audit candidates: color-contrast census WCAG 1.4.3 (PARITY — both apps fail on the same tokens: green-500 Won 2.54, red-500 Target 3.76, the ~3.3 deltas; login clean on both; two probe-method lessons: oklab/lab computed colors break rgb()-regex parsers, and truncated box-shadow reads fake missing rings), focus-visible census (the reference ships the UA outline, ours the documented ring superset — functional parity), @media census (reduced-motion/color-scheme/forced-colors superset-or-inert, both zero print), and THE actionable layer — the login-card error + view-state surface (never swept, fully probeable without data): SIX findings, all live-verified on the reference (S21-P1 "Invalid email or password" vs our "Incorrect…"; S21-P2 our invented auth toasts — the reference fires ZERO on the auth flows, login success = silent redirect; S21-P3 the error banner's shadcn Callout contract vs our bare p; S21-P4 the IN-PLACE SIGNUP VIEW — "Need an account? Sign up" is an onclick BUTTON that swaps the card, the s10 "dead login button" pin DISPROVEN — a minimal Email/Password/Confirm form, no name/Google/divider; S21-P5 the VERIFY-EMAIL view — six 40×44 digit inputs, the 5-attempt ladder → "Too many failed attempts. Please request a new verification code.", the resend with its auto-dismissing green Callout, the unverified-login refusal; S21-P6 "A user with this email already exists" vs our "An account with…")
- Wrote + validated docs/plans/2026-10-01-session21-parity-remediation.md, then TDD: 31 red-first checks (tests/login-views.test.ts, dynamic seam imports) -> 380/380 unit (+31, 19 suites); +5 e2e in auth.spec.ts -> 64/64 (mobile-nav 7/7)
- Implementation: the login/signup route message fixes; the auth toasts removed (the Google toast.info fallback stays — the reference's button performs a REAL Google OAuth redirect, verified live); the ErrorCallout/InfoCallout shared components (the red/green Callout vocabulary, [&>svg] classes verbatim); the five-view state machine (signin -> signup -> verify -> signin, s11 reset untouched) + LOGIN_SIGNUP_LAYOUT/LOGIN_VERIFY_LAYOUT in login-reset.ts; the minimal signup form + mismatch guard; the verify view (auto-advance/backspace code inputs); the Prisma verification columns (hashed code + attempts + expiry, NULL = no verification pending — the seeded demo users pass through) + /api/auth/verify + /api/auth/resend (rate-limited ladder/lockout/reset) + the client/server lib split (verification.ts client-safe ZERO imports vs verification-server.ts server-only — the import-boundary rule); the code logged to the SERVER console (self-hosted delivery)
- Gate-caught: (a) getByRole("alert") also matches Next's __next_route_announcer__ (scope with .filter), getByLabel("Password") substring-matches "Confirm Password" (exact: true), the empty Notifications REGION ships on both apps (assert zero role=status cards); (b) ONE operational bug: a bare `bunx prisma db push` fell into the documented bun .env-absolutization trap (wrote <parent-of-repo>/db/custom.db while the server read <repo>/db/custom.db — every query failed P2022) — fixed via `bun run db:push` + reseed, the stray outer db/ deleted, the trap documented in SKILL 16m.6
- Live verification on the dev server: the wrong-password Callout (text/bg/border/padding/inner + zero toasts), the in-place signup swap (URL stays /login, minimal form, no Google/divider), the mismatch guard, the fresh-signup -> verify view (40x44 centered inputs at exact computed parity — the reference's own w-full+w-10 conflict resolves differently under v4, only w-10 ships), the full ladder + green resend Callout + ~3s auto-dismiss, the HAPPY path (the server-console code -> session -> dashboard, zero toasts), the /signup page (minimal view + s13 absolute title), the standing layers spot-check (drawer open/Escape + locks + restore at 390, head census, security headers, zero overflow)
- Full gate green: lint 0/0, tsc, 380/380 unit, build, 64/64 e2e; 23 screenshots (the 20 established + 21-login-error-callout/22-signup-view/23-verify-email-view) with per-shot verification, zero duplicates; .env/.env.example verified (no env surface); docs realigned (README badge 444 + auth row + counts, AGENTS + session-21 contract block, CLAUDE + login-views suite, PAD matrix 380/64 + 7.2, SKILL v1.18.0 16m + the 8-contrast re-pin, docs/session_35.md, plan addendum, both worklogs)

Stage Summary:
- Gate green: lint 0/0 · tsc · 380/380 unit · 64/64 e2e (mobile-nav 7/7); zero 390px overflow; 23 verified screenshots; docs at SKILL v1.18.0
- Ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)

Stage Summary (final):
- PUSHED: session-21 commit a496713 on main -> git@github.com:nordeim/neo-crm.git via docs/ssh_git_wrapper_v3.py with the paramiko shim (/home/z/my-project/bin/ssh; explicit --remote; dry-run clean e1f808e..a496713 fast-forward, then real push with the wrapper's remote verification + an independent GIT_SSH_COMMAND ls-remote check @ a496713 == local HEAD); all suites green (380 unit / 64 e2e); docs at SKILL v1.18.0; deploy key shredded after verification

---
Task ID: 23 (repo)
Agent: main (Super Z)
Task: Session 22 — the typography / base-cascade layer (the zero-webfont base: the Inter webfont retired for the reference's exact stock system stack, the double antialiased smoothing retired, the invented ::selection tint retired) + the disproven alt+T pointer

Work Log:
- Pulled to 4b4843d (docs/session_36.md = the session-21 transcript, the ONLY change — zero app-code drift since 677dd9b); full docs + codebase review; baseline gate green (lint 0/0 · tsc · 380/380 unit); env verified (.env file:../db/custom.db + db/ at root + .env.example + configs)
- Standing layers re-verified FIRST with NO drift: reference mobile nav still absent at 390 (18th session), our 7-check drawer regression LIVE 7/7 (one probe lesson: a programmatic .focus() + a separate CLI keypress can land on BODY and fake a broken trap — re-sequenced, the wrap verified clean both directions), drawer v4-hazards clean, zero 390px overflow on 11 routes (login/signup swept logged-out via the logout API — the httpOnly cookie can't be cleared from document.cookie), s18+s19+s20 metadata/header census intact (curl-SSR), the s21 login-card Callout spot-probe intact, demo data still zero (18th session)
- The s21 "Notifications alt+T" pointer DISPROVEN: zero shortcuts + zero Notifications text in the reference's DOM (text + attributes) AND its 1.6MB JS bundle; Alt+T does nothing from any focus state (the one "focuses the bell" reading was the preceding click's focus) — pointers are leads to re-verify live, never facts
- NEW audit layer — the typography / base-cascade census (never swept in 21 sessions; every prior text pin compared font-INDEPENDENT properties): THREE findings, all live-verified (S22-P1 the reference ships ZERO webfonts — no @font-face in its 79.5KB stylesheet, document.fonts empty, the stock sans stack on every surface incl. the brand — while ours loaded next/font/google Inter: every text surface in the wrong typeface, measured 466.8px/522.4px reference vs 439px/451.3px ours on the same 62-char string at 16px; S22-P2 our DOUBLE antialiased smoothing — the html CSS rule + the body class — + text-rendering: optimizeLegibility vs the reference's default auto/auto; S22-P3 our invented ::selection blue tint vs the browser default). Verified at parity: line-height 24px, tab-size 4, feature-settings normal, tap-highlight transparent, the dead mail/bell buttons (ours aria-labeled, the documented superset), the search's no-dropdown-at-zero-data, nav-link weight 400 both, the reference's page-level New Lead dialog still working (the s5 source)
- Wrote + validated docs/plans/2026-10-01-session22-parity-remediation.md, then TDD: 11 red-first checks (tests/typography.test.ts) -> 391/391 unit (+11, 20 suites); +3 e2e computed-style checks in crm.spec.ts -> 67/67 (mobile-nav 7/7)
- Implementation: the Inter import + --font-inter variable retired from layout.tsx; @theme --font-sans pins the reference's EXACT stack — GATE-CAUGHT mid-implementation: Tailwind 4.3's own default is the v4.0 -apple-system/BlinkMacSystemFont list and NOT byte-identical to the reference's v3-era stack (the "just use the default" first attempt computed the wrong family; the explicit pin is version-proof); the double smoothing retired; the ::selection tint retired; the og-image re-captured (1200x630); the e2e font count filters off Next's dev-overlay __nextjs-Geist faces (dev-only, unloaded status)
- Red-phase gate-caught twice: the source-pin regexes matched the RETIREMENT COMMENTS themselves (the s21 own-doc-comment hazard — fixed by comment-stripping incl. // line comments); the s13 font-size guard needed the established body-rule scoping
- Live verification on the dev server: the computed body font-family BYTE-IDENTICAL to the reference's stack; document.fonts empty; smoothing auto; the controlled-span metric now MATCHES the reference exactly (466.8/522.4 — pixel convergence); the 390px overflow sweep re-run clean on all 11 routes (the wider system font — ~14% wider bold — broke nothing); the standing layers spot-checked post-change (drawer, head census, security headers, the login Callout)
- Full gate green: lint 0/0, tsc, 391/391 unit, build, 67/67 e2e; 23 screenshots re-captured with per-shot verification (zero md5 duplicates); public/og-image.png re-captured; .env/.env.example verified (no env surface); docs realigned (README badge 458 + the typography row + counts + the structure-tree line, AGENTS counts + the session-22 contract block + the suite list, CLAUDE counts + the typography suite, PAD matrix 391/67 + 7.2 + the 5.1 typography table re-pin + 7.4, SKILL v1.19.0 16n + frontmatter + project_state + the 4 snippet + the design-thesis line, docs/session_37.md, plan addendum, both worklogs)

Stage Summary:
- Gate green: lint 0/0 · tsc · 391/391 unit · 67/67 e2e (mobile-nav 7/7); zero 390px overflow; 23 verified screenshots + the re-captured og-image; docs at SKILL v1.19.0
- Ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)

Stage Summary (final):
- PUSHED: session-22 commit 1d43558 on main -> git@github.com:nordeim/neo-crm.git via docs/ssh_git_wrapper_v3.py with the paramiko shim (/home/z/my-project/bin/ssh; explicit --remote; dry-run clean 4b4843d..1d43558 fast-forward, then the real push with the wrapper's remote verification + an independent GIT_SSH_COMMAND ls-remote check @ 1d43558 == local HEAD); all suites green (391 unit / 67 e2e); docs at SKILL v1.19.0; deploy key shredded after verification

---
Task ID: 6
Agent: main (Super Z)
Task: Session 23 — neo-crm parity remediation: docs review, standing-layer re-verification (19th session), the ARIA census (the new audit layer), TDD remediation (S23-P1/P2/P3), screenshots, docs realignment, SSH push

Work Log:
- Pulled to d6b5593 (docs/session_38.md = the session-22 transcript, the ONLY change — zero app-code drift since 1d43558); re-read the five core docs + session_37/38 + the session-22 plan + both worklogs; baseline gate green (391/391 unit); env intact (.env file:../db/custom.db + db/ at root + .env.example + vitest/playwright configs)
- Standing layers re-verified FIRST with NO drift: reference mobile nav still absent at 390 (19th session — getClientRects probe), our drawer 7/7 LIVE (the backward-wrap probe re-sequenced per the s22 focus-race lesson — natural post-open focus on Close X, then ONE Shift+Tab → Settings), drawer internals clean, zero 390px overflow on 11 routes, the s18+s19+s20 metadata/header census intact (curl-SSR + a direct robots.txt byte-diff vs the reference — identical modulo origin), the s21 login Callout spot-probe, the s22 typography layer (the family byte-identical, document.fonts empty, smoothing auto, the controlled-span metric EXACTLY equal at 509.7/573.5), demo data still zero (19th session)
- NEW audit layer — the ARIA role/property census (never swept in 22 sessions; the s20 tab-order census covered focus order only) + the zero-data interactive-behavior probes: S23-P1 the tabs ARIA + keyboard contract (the reference's Radix tabs ship trigger id + aria-controls, panel id + aria-labelledby, ALL N shells mounted with the inactive ones hidden + EMPTY, ArrowLeft/Right with WRAP + Home/End + automatic activation — ours shipped NO wiring, NO keyboard model, a redundant EMPTY tabpanel on /activities plus an unwired hand-rolled panel); S23-P2 our /login authed redirect (an invention — the reference serves the card to authed visitors, verified twice); S23-P3 (found mid-remediation) the activities priority card is ONE p-4 border-b region (title + tabs + content inside it, the border-b BELOW the content — our s15-era CardContent split drew a separator line the reference does not ship + a p-6 inset instead of p-4; found by pixel line-scans + DOM-ancestor probes). Verified at parity: the combobox layer, the calendar day cells (the reference's are clickable DIVs with the bg-blue-600 selected state — our BUTTON cells = the documented s13 superset), the login banner role=alert on BOTH, the reference's 2 imgs = base44 platform badges, the 500 page UNPROBEABLE on the reference
- Wrote + validated docs/plans/2026-10-01-session23-parity-remediation.md, then TDD: 15 red-first checks (tests/tabs-aria.test.ts; one strengthened mid-red after passing vacuously) -> 406/406 unit (+15, 21 suites); +1 e2e test (wiring + shells + keyboard on all three strips) -> 68/68 (mobile-nav 7/7)
- Implementation: tabs.tsx rewritten (useId + TabsContext + the id/aria-controls wiring + the exported TabsPanel shell with the stock Radix TabsContent focus-ring family + the keydown handler with wrap/Home/End/focus-follows-selection + the reference's wrapper anatomy rendering [tablist, children]); the three pages migrated to one TabsPanel per tab (PriorityRows/ReportSkeletons extracted); the activities CardContent retired (S23-P3); the login redirect retired (S23-P2). Gate-caught THREE times: the sibling-panels architecture bug (the panels outside the Provider read null context — caught by the live wiring probe BEFORE any test), the reports skeleton race (the e2e evaluate read zero tabs after a passing toBeVisible — fixed by waiting for the post-load .recharts-wrapper), and the tsc keydown-typing catch
- Live verification on the dev server: the wiring complete on all three strips (4/4, 5/5, 3/3 wired + backWired; inactive shells hidden + EMPTY); the keyboard model live-driven (ArrowRight/End/wrap/Home — identical to the reference's probed contract); the panel contracts BYTE-IDENTICAL (the wrapper classes, the shell class strings, the 16px/24px/24px gaps live-measured equal on both apps); the activities card line structure fixed (no mid-card separator, the border-b below the content, the 16px inset — pixel-scanned); the authed /login serves the card; the 390px overflow sweep re-run clean on all 11 routes post-restructure
- Full gate green: lint 0/0, tsc, 406/406 unit, build, 68/68 e2e (one Event-dialog flake on the first run, clean on re-run + the final suite); 23 screenshots re-captured with per-shot verification (zero md5 duplicates; shot 23 re-shot with a fresh signup email — the s22 address persisted in the demo DB); .env/.env.example verified (no env surface); docs realigned (README badge 474 + the tabs feature row + counts, AGENTS + the session-23 contract block, CLAUDE + the tabs-aria suite, PAD 406/68 + the §5 tab-contract block + the checklist, SKILL v1.20.0 §16o + frontmatter + project_state, docs/session_39.md, the plan addendum, both worklogs)

Stage Summary:
- Gate green: lint 0/0 · tsc · 406/406 unit · 68/68 e2e (mobile-nav 7/7); zero 390px overflow on 11 routes; 23 verified screenshots; docs at SKILL v1.20.0
- Ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)

Stage Summary (final):
- PUSHED: session-23 commit 6c60a5e on main -> git@github.com:nordeim/neo-crm.git via docs/ssh_git_wrapper_v3.py with the paramiko shim (/home/z/my-project/bin/ssh; explicit --remote; dry-run clean d6b5593..6c60a5e fast-forward, then the real push with the wrapper's remote verification + an independent GIT_SSH_COMMAND ls-remote check @ 6c60a5e == local HEAD); all suites green (406 unit / 68 e2e); docs at SKILL v1.20.0; deploy key shredded after verification

---
Task ID: 7
Agent: main (Super Z)
Task: Session 24 — neo-crm parity remediation: docs review, standing-layer re-verification (20th session), the URL-state/route-case audit (the new audit layer), TDD remediation (S24-P1/P2/P3), screenshots, docs realignment, SSH push

Work Log:
- Pulled to b27e032 (docs/session_40.md = the session-23 transcript, the ONLY change — zero app-code drift since 6c60a5e); re-read the five core docs + session_39/40 + the session-23 plan + both worklogs; baseline gate green (406/406 unit); env intact (.env file:../db/custom.db + db/ at root + .env.example + vitest/playwright configs)
- Standing layers re-verified FIRST with NO drift: reference mobile nav still absent at 390 (20th session), our drawer 7/7 LIVE (trigger 36x36 hit-test, open + 8 links + focus + dual locks, Escape + restore, trap wrap both directions, resize auto-close + sidebar swap, route-change close), zero 390px overflow on 11 routes, the s18+s19+s20 metadata/header census (curl-SSR), the s21 login Callout (re-verified incidentally on a bad demo credential), the s22 typography layer (metrics EXACTLY equal at 466.8/522.4; our 4 webfonts = the __nextjs-Geist dev-overlay faces), the s23 tabs wiring (4/4 5/5 3/3 identical on both apps), demo data still zero (20th session)
- NEW audit layer — the URL-state/route-case census (never swept in 23 sessions; the s39 pointer), probed BOTH directions + the link graph + the route casings BROWSER-side: URL-state CLOSED at parity (both apps write ZERO URL state across filters/sorting/periods/calendar/view-switchers/tabs/search; deep-link params ignored by both) — and the route-CASING surface beneath it: S24-P1 the reference serves every app route at BOTH casings with NO normalization (its sidebar links point at the CAPITALIZED paths; each casing a first-class SSR route — og:url/canonical mirror the requested case, /Dashboard serves the ROOT head; capital /Login + /Signup render its 404 view) while our clone 404'd every capital app route and the s14 /Profile redirect NORMALIZED the URL bar; S24-P2 the sidebar/drawer/account-menu href byte-contract (capitalized + case-insensitive active matching — the reference highlights Reports at lowercase /reports, Dashboard at BOTH / and /Dashboard); S24-P3 the dashboard More... button is the reference's DEAD affordance (zero DOM delta, no navigation) — our router.push("/leads") was an invention
- Wrote + validated docs/plans/2026-10-01-session24-parity-remediation.md, then TDD: 32 red-first checks (tests/route-case.test.ts 16 + the profile-route.test.ts rewrite; RED 27/5) -> 434/434 unit (+28 net, 22 suites); +5 e2e -> 73/73 (two documented flakes on earlier runs, clean in isolation + the final full suite)
- Implementation: NINE capital-route RENDER aliases inside the (app) group re-exporting the lowercase pages + capital-case pageMetadata (the Dashboard alias NO metadata — inherits the root head); the s14 top-level /Profile redirect retired; NAV_ITEMS flipped to the capitalized hrefs; sidebar isActive case-insensitive + the Dashboard root special case; the account menu pushes /Profile; the More... onClick + useRouter retired. GATE-CAUGHT: TS1149 — Next's regenerated validator imports BOTH casings of every dual route and TypeScript (NOT flag-controllable; forceConsistentCasingInFileNames:false does not suppress it, empirically reproduced) rejects programs with two real files differing only in casing — the aliases became .jsx FILES (the extension difference breaks the collision, resolves through allowJs like the validator's page.js import, compiles identically through SWC; the lowercase page.tsx stays canonical + type-checked)
- Live verification: all 9 capital routes render in place with the URL preserved; the capital heads curl-verified (og:url/canonical at the requested case; /Dashboard = the root head); the sidebar href set byte-exact with Dashboard active at / and Reports active at BOTH casings; the drawer link -> /Leads; the account menu -> /Profile; More... a verified no-op; zero 390px overflow on all 9 capital routes; the standing layers spot-checked post-change
- Full gate green: lint 0/0, tsc 0 errors, 434/434 unit, build (both casings in the route table), 73/73 e2e; 23 screenshots re-captured with per-shot verification (shot 12 re-shot via the computed-visibility probe — the inline style.visibility read false-negatived the open drawer; zero md5 duplicates; shot 23 on a fresh s24 email); .env/.env.example verified (no env surface); docs realigned (README badge 507 + the route-case row + counts, AGENTS + the session-24 contract block, CLAUDE + the route-case suite, PAD 434/73 + the §5 route-case block, SKILL v1.21.0 §16p + frontmatter + project_state, docs/session_41.md, the plan addendum, the outer worklog)

Stage Summary:
- PUSHED: session-24 commit e445980 (the work) on main -> git@github.com:nordeim/neo-crm.git via docs/ssh_git_wrapper_v3.py with the paramiko shim (/home/z/my-project/bin/ssh; explicit --remote; dry-run clean b27e032..e445980 fast-forward; the push verified by the wrapper + an independent GIT_SSH_COMMAND ls-remote @ e445980 == local HEAD); all suites green (434 unit / 73 e2e); docs at SKILL v1.21.0; the deploy key shredded after verification
- Next session pointers live in docs/session_41.md: the route-case layer joins the standing surfaces (the session-24 e2e checks + the capital-head curl); never convert an alias into a next.config redirect (the s14 loop) and never add capital AUTH aliases (/Login + /Signup 404 on the reference too); /Reports re-check continues (20 sessions zero); unprobed: the loading/suspense states (MutationObserver BEFORE navigation — CLI latency lands every post-open eval post-hydration), the print stylesheet family; the s24 click-contract lesson — probe what a control DOES, not just what it looks like

---
Task ID: 8
Agent: main (Super Z)
Task: Session 25 — neo-crm parity remediation: docs review, standing-layer re-verification (21st session), the loading-state + export/button-contract audit (the new audit layer), TDD remediation (S25-P1/P2/P4/P5/P6), screenshots, docs realignment, SSH push

Work Log:
- Pulled to 43f9ac0 (docs/session_42.md = the session-24 transcript, the ONLY change since e445980; zero app-code drift); re-read the five core docs + session_41/42 + the session-24 plan + both worklogs; baseline gate green (434/434 unit); env intact (.env file:../db/custom.db + db/ at root + .env.example + vitest/playwright configs)
- Standing layers re-verified FIRST with NO drift: reference mobile nav still absent at 390 (21st session), our drawer 7/7 LIVE (trigger hit-test, open + 8 links + focus + dual locks, Escape + restore, trap wrap both directions, resize auto-close + sidebar swap, route-change close), zero 390px overflow on 11 routes, the s18+s19+s20 metadata/header census (curl-SSR), the s21 login Callout, the s22 typography layer (metrics EXACTLY equal), the s23 tabs wiring (4/4 5/5 3/3 identical on both apps), the s24 route-case layer (capital routes render in place + the capital heads), demo data still zero (21st session)
- NEW audit layer — the loading-state + export/button-contract census (the s41 pointer): S25-P1 the reference ships ZERO loading UI (verified with the network-ABORTED fetch probe + the fetch-delaying --init-script harness — its /Leads renders the full page with zeros immediately; our clone shipped five skeleton families, caught live at T+5.5s); S25-P2 the Reports exports are REAL client-side PDFs (the header PDF: html2canvas IFRAME + jsPDF 4.0.0 A4 portrait + crm_reports_YYYY-MM-DD.pdf, the content area WITHOUT the sidebar — VLM-verified; the per-table text PDFs with paren-truncated slugs); S25-P4 the Saved Reports button opens a full save/load dialog persisted to localStorage.crm_saved_reports (byte-extracted schema + the save/load round-trip verified live); S25-P5 the CSV contract (prefix_YYYY-MM-DD.csv + the leads 8-column set + the singular crm_report 7-col deal CSV + the per-table client-side blobs); S25-P6 the 6-entry period vocabulary (today/week/month/quarter/ytd/all — this_year retired for ytd). VERIFIED AT PARITY: the print stylesheet family (zero @media print on both), the keyboard-shortcut layer (library-standard handlers only on the reference's bundle), the per-table export buttons exist on BOTH apps (the S25-P3 eval-click false-negative — real clicks show them)
- Wrote + validated docs/plans/2026-10-01-session25-parity-remediation.md, then TDD: 41 red-first checks across five files (tests/pdf-export.test.ts 10, tests/saved-reports.test.ts 13, tests/loading-layer.test.ts 8, tests/csv-contract.test.ts 7, tests/report-periods.test.ts 3; RED 39/2) -> 475/475 unit (+41, 27 suites); +6 e2e -> 79/79 (the first full run read 78/79 — the per-table CSV failure surfaced the reference's OWN inconsistency: its per-table CSV prefixes are SHORTER literals (open_deals_) than its PDF slugs (open_deals_by_stage_) — fixed with per-family prefixes)
- Implementation: the skeleton families retired (dashboard !k -> k?.field ?? 0 null-safety; leads/accounts/contacts render the empty state directly; reports drops the loading state + ReportSkeletons; the store's loadingFlags + loading() + misc.tsx's Skeleton export gone); src/lib/pdf-export.ts (html2canvas-PRO — the v4 stylesheet's 242 color-mix() calls break classic html2canvas; jsPDF A4 pagination + the text-artifact exportTablePdf with tableSlug()); src/lib/saved-reports.ts + src/components/shared/save-report-dialog.tsx (the localStorage seam + the stock-kit dialog + the live-count wiring); csvFilename() -> prefix_YYYY-MM-DD.csv + the export route's leads 8-column set + the filter-aware type=report branch + downloadBlob() in download.ts + the per-table client-side blobs; REPORT_PERIODS -> the 6-entry vocabulary + periodStart() today/ytd mappings
- Session interruption + recovery: the prior run's shell-tool "failures" were a DISPLAY-LAYER artifact (the Bash output pipeline eats bracket-escape-like sequences — a hex dump proved csv.ts was never corrupted; file verification goes through the Read tool). All gates re-run green post-recovery: lint 0/0, tsc 0 errors, 475/475 unit, 79/79 e2e
- Live verification: the header PDF downloads crm_reports_2026-10-01.pdf (A4 portrait, the content area without the sidebar); the per-table PDF + CSV download with the reference's exact filenames; the Saved Reports round-trip (save -> "(1)" -> the list -> Load reapplies + closes); the leads CSV byte-faithful; the period dropdown ships the 6 options; the delayed-fetch harness reads ZERO loading elements (the reference's instant-render model); the standing layers re-verified post-change
- Full gate green: lint 0/0, tsc 0 errors, 475/475 unit, build clean, 79/79 e2e; 24 screenshots (the 23 established re-captured post-remediation + shot 24 the Save Custom Report View dialog, verified open at capture); .env/.env.example verified (no new env surface — the PDF stack is dependency-only); docs realigned (README badge 554 + the three new feature rows + the PDF-stack row + counts, AGENTS + the session-25 contract blocks, CLAUDE + the five new suites, PAD 475/79 + the three §5 contract blocks, SKILL v1.22.0 §16q + frontmatter + project_state, docs/session_43.md, the plan addendum corrected to the real counts, this worklog)

Stage Summary:
- Gate green: lint 0/0 · tsc 0 · 475/475 unit (+41) · 79/79 e2e (+6) · build clean; 24 verified screenshots; docs at SKILL v1.22.0
- Ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)
- Next session pointers live in docs/session_43.md: /Reports re-check continues (21 sessions zero); unprobed: the accounts/contacts export column sets (data-gated), the settings danger-zone reset (destructive), the calendar day-cell click contract (needs seeded reference events); the s25 census-method lessons — init-script fetch delays for skeleton windows, createElement/createObjectURL spies for client-side downloads, REAL clicks for Radix tabs, and the Bash-display bracket-eating hazard (verify files via Read, not terminal echoes)

---
Task ID: 9-push-record
Agent: main (Super Z)
Task: Session-25 push record

Work Log:
- Commit 0cec8c7 (the session-25 work: 33 files, +2136/-203) pushed to main -> git@github.com:nordeim/neo-crm.git via docs/ssh_git_wrapper_v3.py with the paramiko shim (/home/z/my-project/bin/ssh; explicit --remote; dry-run clean 43f9ac0..0cec8c7 fast-forward; the real push verified by the wrapper's remote verification + an independent GIT_SSH_COMMAND ls-remote @ 0cec8c7 == local HEAD; the tracking ref synced)
- This record commit is the second and final push of the session (the established two-commit pattern: the work, then the worklog record)

Stage Summary:
- Session-25 PUSHED + VERIFIED: all gates green (475 unit / 79 e2e / lint 0/0 / tsc 0 / build); docs at SKILL v1.22.0; 24 screenshots; deploy keys shredded after each push

---
Task ID: 26 (repo)
Agent: main (Super Z)
Task: Session 26 — the Settings Data-tab + import/export contract layer (the s44 "Next" pointers) + the full session arc (workspace rebuild, standing-layer re-verification, the bundle-extraction census, TDD remediation, gate, deliverables)

Work Log:
- git pull to 86405d0; workspace rebuilt from scratch; .env with DATABASE_URL="file:../db/custom.db" + db/ at the repo root; baseline gate green (475/475)
- Standing layers: NO drift (mobile nav 22nd session, drawer 7/7, zero 390px overflow, typography equal, tabs identical, demo data zero)
- The new census (the reference's own minified bundle): six findings — the three Data-tab CardDescriptions + ml-0 sm:ml-2, the native confirm/alert reset flow + trash2, the static CSV templates, the raw-dump singular-prefix exports, the quoted page-level exports incl. the stored Account health (a MODEL gap closed), the rebuilt Import Contacts dialog with its exact vocabulary
- TDD: 50 red checks first (RED 46/4), then the six findings implemented (two new seams: csv-templates.ts + entity-export.ts; the Account.health schema addition; /api/export retired to type=leads + type=report)
- Gate: lint 0/0 · tsc · 525/525 unit (+50) · build · 87/87 e2e (+8) + LIVE verification on the dev server; 26 screenshots; docs realigned at SKILL v1.23.0; commit + SSH-wrapper push on main

Stage Summary:
- Ready: the session-26 push; next unprobed pointers in docs/session_45.md (the reference's account DETAIL health surface, the calendar day-cell contract — still data-gated)

---
Task ID: 26-push (repo)
Agent: main (Super Z)
Task: The session-26 push record (the established dual-commit pattern)

Work Log:
- Gate green before push (rule 2): lint 0/0 · tsc 0 · 525/525 unit · build · 87/87 e2e
- Commit f943779 on main; the paramiko shim rebuilt at /home/z/my-project/bin/ssh (the workspace reset had wiped it; paramiko 5.0.0 installed into the venv); the operator key materialized to /tmp/session26-deploy.key (0600, outside the repo), fingerprint SHA256:3ddaNlFhMz1JXiGEDgVEaRsUzI4Ev0IpGEEB7NnU4PU (ed25519) verified
- Dry-run clean (fast-forward 86405d0..f943779), then the real push via docs/ssh_git_wrapper_v3.py --remote git@github.com:nordeim/neo-crm.git
- PUSH VERIFIED: remote refs/heads/main @ f943779 == local HEAD; independently re-verified via GIT_SSH_COMMAND ls-remote (f94377953eeb29e9400acf0b1e3b6375fa5f9cfa); the operator key shredded (random overwrite + remove) after both the wrapper's and the independent verification

Stage Summary:
- Session 26 pushed to main; the shim + this record ride the second commit

---
Task ID: 27
Agent: main (Super Z)
Task: Session 27 — the chart-internals + Account-Health/calendar contract layer (the s45 "Next" pointers): docs review, standing-layer re-verification (23rd session), the bundle-extraction audit (~20 chart-family findings + the SYSTEMIC stock-axes discovery), TDD remediation (S27-P1..P11), screenshots, docs realignment, SSH push

Work Log:
- Pulled to f986f0a (docs/session_46.md = the session-26 transcript, the ONLY change since 4e6a6ae; zero app-code drift); re-read the five core docs + session_45/46 + the s26 plan + both worklogs; the seams verified in code (csv-templates.ts, entity-export.ts, account-health model, vitest+playwright configs, .env DATABASE_URL="file:../db/custom.db" + db/ at root); baseline gate green: lint 0/0 · tsc 0 · 525/525 unit · build · 87/87 e2e (first run 86/87 — the documented s15 Event-dialog flake, clean in isolation + in the full re-run)
- Standing layers re-verified FIRST with NO drift: reference mobile nav still absent at 390 (23rd session — 8 sidebar links in the DOM, 0 visible, zero hamburger), our drawer 7/7 spot-verified live, zero 390px overflow on all nine authed routes, demo data still zero (23rd), typography controlled-span metrics EXACTLY equal on both apps (522/582.89 + 544.39/612.25, byte-identical family), tabs ARIA identical, the contacts table re-checked live (the reference's Role/Priority/Engagement columns already mirrored)
- NEW AUDIT LAYER — the s45 pointers + everything the reference's zero-data state made invisible, via the systematized s26 bundle-extraction (the 1.63MB minified bundle curl'd locally — the in-page cache dies on every navigation — walked with rg/python, every zero-visible surface cross-checked live): S27-P1/P2 the Account Health tab end-to-end (the reference COMPUTES health client-side: daysSinceActivity > 60 OR a closed_lost deal → At Risk; > 30 → Needs Attention; else Healthy; 999 = never — ours shipped a STATUS donut: wrong vocabulary, wrong chart, wrong data; rebuilt as the computed seam + the API rewire + the four surfaces: the PIE with `${name}: ${value}` labels + the 3-color palette, the horizontal Top-10 with the $ axis, the red-tinted at-risk rows with "Nd ago"/"Never" + red badges, the outline-badge summary with the "-" industry fallback); S27-P3/P4 the reports chart types (tab-1 Revenue ONE #3b82f6 line strokeWidth 2; Won vs Lost grouped BARS; the tab-1 Pipeline ROW-DERIVED violet "Value ($)" bars empty at zero — our fixed 8-slug list rendered ticks where the reference renders nothing; the funnel single-cyan width-100; tab-2 Forecasting a TWO-line chart with the bold caption + the 4-band probability PIE; tab-3/4 by-type/by-source label PIES + single-line over-time + grouped vs-wins + the %/$-tooltip win-rate/avg-value bars + the red-tinted overdue rows with outline badges); S27-P5 the reports KPI statics (the reference HARDCODES the sparkline array [65,72,68,85,78,92] on all four sparkline cards; the Lost Deals amount renders as a delta-column SUBTITLE — won-inline/lost-subtitle, its own inconsistency); S27-P6 the dashboard pipeline (SINGLE #3b82f6 radius-8 VALUE bars, $ tooltip, tick 12 — the per-stage colors live ONLY in the legend chips, w-3 h-3 rounded squares via the O-map of bg-*-500 classes, and the "Won = gray-400" pin finally explained: a LOOKUP MISS — the label "Won" never matches the map key "closed_won", mirrored by looking the class up through the label slug exactly like the reference); S27-P7 the dashboard KPI statics + revenue areas (deltas the literals "+5.3%"/"+15%", sparks the six static arrays, the Sales Target progress a NEUTRAL gray note in the value row, the revenue areas fillOpacity .6/.3 with STOCK strokeWidth — our real-data sparks rendered empty in the current quarter where the reference always shows the shape); S27-P8 the dashboard lists (Lead Sources + Upcoming Activities are CHECKBOX rows — "[checkbox] Follow up with {source} [count]" + description/related/toLocaleDateString — our progress-bar and colored-dot lists were inventions); S27-P9 the leads rail (the 5-status pipeline with Contacted — it elides from the ticks at 331px, the reference's own recharts behavior — with VALUE sums, the grouped wonlost bars, the funnel's true New Leads/Contacted/Qualified/Won vocabulary); S27-P10 the by-type chart (single-blue radius-4 bars, tick 10, no grid); S27-P11 the calendar (the tinted clickable chips bg-*-100/text-*-800 + solid dots with click → the Edit dialog, the plain-text day numbers — no circle pill, the "+N more" overflow lines, the tall-bar upcoming rows with "MMM d, h:mm a" + the Pen/Phone/MessageCircle buttons, the filtered-events agenda in the 40×40 tinted-square rows with the EllipsisVertical Edit/Delete dropdown); the SYSTEMIC finding: the reference's Cartesian charts ship STOCK recharts axes (the #666 axis lines AND tick lines render, stock margins) — our entire scaffold-era family hid them (axisLine={false} tickLine={false} + custom margins + width overrides + allowDecimals), every override retired and the family rewritten as five parameterized components
- Wrote + validated docs/plans/2026-10-02-session27-parity-remediation.md against the codebase (two refinements found + folded in), then TDD: 75 red-first checks across five new suites (tests/charts-internals.test.ts 25, tests/account-health-tab.test.ts 15, tests/dashboard-contracts.test.ts 15, tests/leads-charts.test.ts 8, tests/calendar-cells.test.ts 17; RED 69/75 on the first run; the pin shapes refined mid-red — the stripComments helper eats `//`-comment anchors, region-anchor from function definitions, JSX CardTitles carry no quotes)
- Implementation (seams first, then the surfaces): src/lib/account-health.ts (the computed model + 999=never); the chart family rewrite in src/components/charts/charts.tsx (five parameterized components, stock axes, no overrides); the API rewire in src/app/api/reports/route.ts (the computed distribution, the sorted top-10, the 4-band forecastByProbability, the slice-20 at-risk list); src/lib/page-layout.ts (PIPELINE_LEGEND + KPI_STATICS — the static spark arrays/deltas); src/lib/constants.ts (LEADS_FUNNEL + EVENT_TYPE_CHIP); the reports page (all five tabs + the KPI statics + the Lost-as-subtitle delta); the dashboard (the single-blue pipeline + the legend chips through the label-slug lookup + the .6/.3 revenue areas + the KPI statics + the two checkbox lists); the leads rail; the activities by-type chart; the calendar rebuild; src/components/shared/page-parts.tsx (CircleStatCard renders subValue in the delta column; KpiCard gains valueNote); src/lib/format.ts + src/types/index.ts (the changed API shapes). Gate-caught: the accountHealth import/name collision in the route, the CrmEvent relatedName typing (the account/contact relations), the legend lookup operating on our internal stage ids instead of the reference's label-slug mechanism — caught LIVE (the Prospecting/Qualification chips rendered the gray fallback until the lookup was re-expressed through the labels, after which all five chips compute exactly like the reference's)
- Full gate: lint 0/0 · tsc 0 · 600/600 unit (+75) · build clean · 92/92 e2e (+5 — the new checks ordered BEFORE the reset-wipe test; the 3 s13 pins re-scoped to the new chart family, the MMM pin made behavioral); LIVE verification on the dev server with SEEDED data: the Account Health tab (the PIE labels "Healthy: 4 / Needs Attention: 3 / At Risk: 3", the Top-10's $ axis + account names, the 3 red rows "19d/13d/4d ago", the outline badges), the dashboard (single-blue bars, the five legend chips at the reference's exact computed colors, the .6/.3 areas, the "Follow up with Partner/Call/Email/Website" checkbox rows, the "+5.3%" delta, the static sparks), the leads rail (the elided Contacted tick + the New Leads/Contacted/Qualified/Won funnel labels), the calendar (the tinted chips + dots + plain day numbers, the chip click opening the Edit Event dialog), the tab-1 chart types with data (1 line, 8 wonlost bars, 5 pipeline bars, 8 funnel bars), the standing layers spot-checked post-change (the drawer at 390, zero overflow on all nine routes)
- 28 screenshots under docs/screenshots/ (the 26 established re-captured post-remediation + shot 27 the Account Health tab with seeded data + shot 28 the calendar chip → Edit Event dialog); .env/.env.example re-verified (no new env surface); docs realigned (README badge 692 + the Dashboard/Reports/Calendar rows + the session-27 e2e paragraph, AGENTS counts + six contract blocks, CLAUDE counts + the five new suites + the e2e layer, PAD matrix 42 suites / 600+92 + the §5 blocks, SKILL v1.24.0 §16s + frontmatter + project_state, docs/session_47.md, the plan addendum, both worklogs)

Stage Summary:
- Gate green: lint 0/0 · tsc 0 · 600/600 unit (+75) · 92/92 e2e (+5) · build clean; 28 verified screenshots; docs at SKILL v1.24.0; the two s45 pointers CLOSED (the computed Account Health tab, the calendar chip contract) + the systemic chart-internals layer
- Ready: commit on main + SSH-wrapper push (paramiko shim at /home/z/my-project/bin/ssh)
- Next session pointers: the reference's contact-detail/edit dialog (AAe — the role/priority/engagement/photo fields, a dead-or-reachable path to disambiguate), the account-edit dialog's full field set, a drift re-sweep on the next live visit; the bundle cached at scripts/reference-bundle.js in the sandbox (not committed); the s27 census-method lessons — the local curl'd bundle beats the in-page cache (navigation resets it), the lucide icon identity resolves through the SVG path data (the `us` checkbox glyph), and the axis-line "hiding" was a wrong-selector conclusion (the reference renders STOCK #666 axes — verify the selector before concluding absence)

---
Task ID: 27-push (repo)
Agent: main (Super Z)
Task: The session-27 push record (the established dual-commit pattern)

Work Log:
- Gate green before push (rule 2): lint 0/0 · tsc 0 · 600/600 unit (38 suites) · build clean · 92/92 e2e (1.8m single-worker)
- Commit ab4e65c on main (55 files, +2403/-514); the paramiko shim verified present at /home/z/my-project/bin/ssh (executable, venv python with paramiko); the operator key materialized to /tmp/session27-deploy.key (0600, outside the repo), fingerprint SHA256:3ddaNlFhMz1JXiGEDgVEaRsUzI4Ev0IpGEEB7NnU4PU (ed25519 — identical to the session-26 record, the same operator deploy key)
- Dry-run clean (fast-forward f986f0a..ab4e65c, remote untouched), then the real push via docs/ssh_git_wrapper_v3.py --remote git@github.com:nordeim/neo-crm.git
- PUSH VERIFIED: remote refs/heads/main @ ab4e65c == local HEAD; tracking ref synced by the wrapper; independently re-verified via GIT_SSH_COMMAND ls-remote (ab4e65cd8cd9e99e63c56636761b35d8e32c4cfb); the operator key shredded (random overwrite + remove) after both the wrapper's and the independent verification — no /tmp key residue

Stage Summary:
- Session 27 pushed to main; this record rides the second and final commit of the session

---
Task ID: 28
Agent: main (Super Z)
Task: Session 28 — the entity edit/detail contract layer (the s47 "Next" pointers): docs review, standing-layer re-verification (24th session), the five-component contact audit + the account/lead edit-dialog family, TDD remediation (S28-P1..P7), the s15 flake root-cause fix, screenshots, docs realignment, SSH push

Work Log:
- Pulled to c70cb32 (docs/session_48.md = the operator's session-27 continuation transcript, the ONLY change; zero app-code drift); docs re-verified (SKILL v1.24.0, 600+92 counts, the session-47 Next-steps pointers); environment verified (.env file:../db/custom.db, db/ at root, configs, the 1.63MB bundle cache, the shim + paramiko, agent-browser 0.38.1)
- Baseline gate: lint 0/0 · tsc 0 · 600/600 unit · build clean · e2e 92/92 on the confirming run — BUT the documented s15 New Event flake ESCALATED (3 failed full runs, clean in isolation); root cause by inspection: the dialog's zoom-in-95 duration-200 entrance animation races boundingBox() (672×0.95 mid-flight) — the s15 New Lead test's expect.poll idiom (line 582) was missing at line 639; fix queued
- Standing layers re-verified (24th session) with NO drift: the reference's mobile-nav absence at 390 (8 links in DOM, 0 visible — the checkVisibilityCSS:true variant needed, the s20 hazard), our drawer spot-verified (8 links + focus + scroll lock + Escape restore), zero 390px overflow on all 9 authed routes, demo data zero, typography EXACT (p1=337.53/p2=292.02 both apps), the tabs ARIA identical
- NEW AUDIT (bundle + live): the s47 "AAe" pointer decomposed into FIVE components — AAe the CREATE dialog (the two h3 section headers "Contact Details"/"Professional Details" we lacked, live-confirmed; the RAW source values with emoji labels), W7 the Edit Contact dialog (a SEPARATE max-w-2xl family: grid-cols-2 rows, Status/Source value-label pairs, Save Changes, a readOnly mode), Pke the Contact Details SLIDE-OVER (fixed md:w-[500px] right panel: the hero w/ the first-initial avatar + badges + engagement bars, Call/Email/WhatsApp, the Contact Information card, the Activities/Deals/Notes tabs), kke the FILTER PANEL (checkbox-card groups in the fixed right-0 top-16 bottom-0 w-80 lg:static wrapper), NAe the Scan Card dialog (the real upload structure); the contact MODEL (priority Key/Standard/At Risk, role/engagementLevel/companySize/photoUrl, the ce formatter); the contacts ROW (the inline role select, the 3-bar engagement cell, the Key amber tint + avatar overlay, the ≥30d opacity-70 + red/green icon, the raw-source badge, the Call/Email/WhatsApp + ⋮ actions, the row click → Pke); the account layer (wce the Edit Account dialog with the full field set + the 3-option status, Ece the Account Insights dialog max-w-3xl with the 3 stat cards + 3 type-tinted tabs, the accounts ROW with the Key tint + star + overdue border-l-4 + badge + owner initials + the HEALTH badge under the Status header + the ⋮ Edit/View Insights/Delete + the row click → Ece, Oce's $0-$1M/$1M-$5M/$5M+ ranges + the blue Filter button); Mke the lead edit dialog (the 4-option status set + the 4-option source — the reference's own inconsistencies); the leads-table INLINE editing documented as the C2 next-session pointer; "Top Decision Makers" counts role === "Key Contact"
- Wrote + validated docs/plans/2026-10-02-session28-parity-remediation.md, then TDD: 63 red-first checks across four new suites (contact-model 12, entity-edit-dialog 12, contact-surfaces 20, account-surfaces 19; RED 60/63 — the 3 pre-existing passes were the s26 rail labels)
- Implementation: the schema migration (the 4 new Contact fields + the priority default "Standard") + the API routes (the new fields on POST/PATCH, the legacy vocabulary mapped hot→Key/warm→Standard/cold→At Risk) + the seed (the full new vocabulary) + the constants layer (CONTACT_PRIORITY_META, CONTACT_ROLES, ENGAGEMENT_BARS ±500/−600, COMPANY_SIZES, CONTACT_SOURCE_OPTIONS, lastActivityCe, ACCOUNT_TIER_BADGE/ACCOUNT_HEALTH_BADGE, the edit vocabularies) + the EntityEditDialog (the value/label select pairs, the readOnly mode) + the Pke ContactDetailPanel + the Ece AccountInsightsDialog + the contacts page rebuild (the row, the kke filter model + panel, the stats, the mobile cards, the NAe Scan Card) + the accounts page rebuild (the row, the insights + edit wiring, the ranges, the blue Filter) + the leads edit wiring + the AAe h3 headers + the raw-source split + the s15 expect.poll fix. Gate-caught: the `Name*/Email*` doc-comment terminating the block comment (`*/` inside — the tsc "unterminated regular expression"); the stripComments helper eating `accept="image/*"` (a `/*` in a STRING — the anchor moved to raw source); the click-races-the-fetch flake (the SSR'd "No accounts found" empty-state row is the first tbody tr before the fetch lands — the data-wait idiom); the TabsPanel shells mounting hidden (activate before asserting); the tabs strip sharing grid-cols-3 with the stat grid (the gap-4 scoping); the dev server's STALE Prisma client after the schema push (restarted — the live row's fields appeared)
- Full gate: lint 0/0 · tsc 0 · 663/663 unit (+63) · build clean · 100/100 e2e (+8: the h3 headers, the slide-over with the tab activation, the inline role round-trip, the W7 edit dialog, the kke panel, the Ece insights, the accounts menu + health badge, the Mke lead edit); LIVE verification on the restarted dev server: the contacts row (role "Decision Maker", 3 bars, "Key", "Today", company+size, raw "partner", 4 actions), the slide-over (the hero initial, the 3 tabs), the W7 dialog (the full field set + Save Changes), the accounts row (the icon box, the overdue badge, "OH" initials, "At Risk" under Status), the insights dialog (768px + the 3 cards + the 3 tabs), the kke panel (5 groups + 17 checkboxes), the create dialog (both h3s + the "✉️ Email" trigger)
- 32 screenshots under docs/screenshots/ (the 28 established re-captured + 29 the slide-over + 30 the Edit Contact dialog + 31 the Account Insights dialog + 32 the filter panel — each verified open at capture; the agent-browser absolute-path lesson); .env/.env.example re-verified (no new env surface); docs realigned (README badge 763 + the Contacts/Accounts/Leads rows, AGENTS counts + the seven session-28 contract blocks, CLAUDE counts + the four new suites, PAD 42 suites / 663+100, SKILL v1.25.0 §16t + frontmatter + project_state, docs/session_49.md, the plan addendum, both worklogs)

Stage Summary:
- Gate green: lint 0/0 · tsc 0 · 663/663 unit (+63) · 100/100 e2e (+8) · build clean; 32 verified screenshots; docs at SKILL v1.25.0; both s47 pointers CLOSED + the s15 flake root-caused and fixed
- Ready: commit on main + SSH-wrapper push (the shim at /home/z/my-project/bin/ssh)
- Next session pointers: the leads-table INLINE editing (the C2 bundle extract: the value number input, the status select, the next-follow-up date input with the overdue red border + alert icon, the Convert to Opportunity item), the contact-photo upload flow (the real UploadFile round-trip vs our visual-parity input), the drift re-sweep; the bundle cached at scripts/reference-bundle.js in the sandbox (not committed); the §16t census-method lessons — the empty-state-row-races-the-fetch, the string-comment-stripping (/* and // variants), the stale-dev-server-Prisma-client, the agent-browser absolute-path screenshots, the gap-4 stat-grid scoping

---
Task ID: 28-push (repo)
Agent: main (Super Z)
Task: The session-28 push record (the established dual-commit pattern)

Work Log:
- Gate green before push (rule 2): lint 0/0 · tsc 0 · 663/663 unit (42 suites) · build clean · 100/100 e2e (2.1m single-worker)
- Commit 1864b5e on main (57 files, +2968/-234); the paramiko shim verified at /home/z/my-project/bin/ssh; the operator key materialized to /tmp/session28-deploy.key (0600, outside the repo) — the same deploy key as sessions 26/27
- Dry-run clean (fast-forward c70cb32..1864b5e, remote untouched), then the real push via docs/ssh_git_wrapper_v3.py --remote git@github.com:nordeim/neo-crm.git
- PUSH VERIFIED: remote refs/heads/main @ 1864b5e == local HEAD; tracking ref synced by the wrapper; independently re-verified via GIT_SSH_COMMAND ls-remote (1864b5e9804bbc7a349510ffdbbb9c8ca9a2eb65); the operator key shredded (random overwrite + remove) after both verifications

Stage Summary:
- Session 28 pushed to main; this record rides the second and final commit of the session

---
Task ID: 29
Agent: main (Super Z)
Task: Session 29 — the leads interactive-table layer (the C2 pointer): docs review, standing-layer re-verification (25th session), the bundle + live audit (the row + the Gke popover + the filtered-set doctrine + the raw-source migration), TDD remediation (S29-P1..P5), screenshots, docs realignment, SSH push

Work Log:
- Pulled to 5362717 (docs/session_50.md = the operator's session-28 transcript, the ONLY change; zero app-code drift); docs re-verified (SKILL v1.25.0, 663+100 counts, the session-49 Next-steps pointers — the leads inline editing); environment verified (.env file:../db/custom.db, db/ at root, dev server :3000, the 1.63MB bundle cache, the shim + paramiko, agent-browser 0.38.1)
- Baseline gate: lint 0/0 · tsc 0 · 663/663 unit · build clean · 100/100 e2e FIRST TRY (the s15 fix holds)
- Standing layers re-verified (25th session) with NO drift: the reference's mobile-nav absence at 390 (8 links in DOM, 0 visible), our drawer spot-verified (8 links + focus + scroll lock + Escape restore), zero 390px overflow on all 9 routes BOTH apps, demo data zero (25th), typography EXACT (p1=466.75/p2=522.36 both apps, byte-identical family), the tabs ARIA identical — the operator's mobile-menu emphasis confirmed working, zero Tailwind v4 regressions
- NEW AUDIT (bundle + LIVE): the C2 row contract (the orange Target name box, text-sm cells + "-" fallbacks, the INLINE Value number input w-24 h-8 placeholder "$0" parseFloat||0, the INLINE Status select w-32 h-8 with EXACTLY the five raw options + the BLANK unmatched-stage trigger, the raw-source outline badge, the INLINE date w-36 h-8 + the overdue border-red-500 + CircleAlert where ee = any past date — a date-only "today" parses at UTC midnight and IS overdue, the reference's own quirk, the ⋮ EllipsisVertical menu with the DEAD Convert-to-Opportunity item, the explicit hover:bg-gray-50 non-clickable row, the STICKY thead live-confirmed, w-12, the cursor-pointer gap-2 sort heads); the Gke popover LIVE-EXERCISED for the first time — the s8 "Save View is inert" pin DISPROVEN (the s26 native-dialog auto-dismiss hazard): the "(Active)" suffix live-confirmed, the NATIVE prompt("Enter view name:") live-confirmed, the w-full sm:w-48 Saved Views select that applies a view's filters live-confirmed (the reference keeps them IN MEMORY — no localStorage key, live-probed; ours persists the list, the documented superset; the filters no longer auto-restore); the RAW-value selects with the "all" sentinel; the H/U filtered-set doctrine (the KPIs + charts + export ALL derive from the FILTERED set: Open = new+contacted+qualified, Dropped = lost strictly, the conversion toFixed(1), the avg cycle = the won leads' average AGE now-created; the Export is a CLIENT-SIDE blob from the filtered rows — the UNQUOTED 8-column header + quoted values + leads_ prefix; /api/export?type=leads retired); the RAW source migration end-to-end (LEAD_SOURCE_OPTIONS, the create dialog default "email", the seed map, the dashboard "Follow up with {raw}" rows, the CSVs); the reference's filter semantics (the OR-form search, strict equality, the truthy-value min quirk); the "Loading..." row = a bundle-only transient (our instant-empty model stays, documented)
- Wrote + validated docs/plans/2026-10-02-session29-parity-remediation.md, then TDD: 43 red checks across two suites (the rewritten lead-filters 18 + the new leads-inline 25; RED 38/43 — the 4 pre-existing passes were the malformed-rejection/equality/aria-label parity)
- Implementation: the seam rewrite (lead-filters.ts — the raw vocabularies, SavedLeadView + encode/decode, applySavedView, filtersActive, isOverdueFollowUp, toDateInputValue) + the constants (LEAD_SOURCE_OPTIONS, LEAD_INLINE_STATUS_OPTIONS) + the page-layout re-scope + the store's OPTIMISTIC updateLead (the local apply BEFORE the await — per-keystroke controlled inputs demand it) + the DropdownItem close-on-click (PopoverPrimitive.Close asChild — the reference's real menus auto-close) + the row rebuild + the popover re-shape + the export rewire (unquotedHeaderCsv + downloadBlob + entityExportFilename("Leads")) + the /api/export retirement to type=report + the seed + the create-dialog raw split. Gate-caught: the orphaned else in the route (tsc + lint); three test-scope refinements; the timezone-flipping today pin (UTC-date-string); the e2e waitForEvent pattern HANGING on the synchronous prompt (→ page.once("dialog")); the popover-closed ordering
- Full gate: lint 0/0 · tsc 0 · 697/697 unit (+34) · build clean · 104/104 e2e (+4: the Target box + sticky thead + row pins, the inline round-trip PERSISTING across reload, the dead Convert item, the (Active) + prompt + Saved Views loop); LIVE verification on the dev server: the row contract (the box, the inputs at the exact classes, "New", the raw "call" badge, sticky), the KPIs (Open 9 / Dropped 4 / 29.2% / 82 days), the round-trip persisting (123456 + 2020-01-01 + the red border + CircleAlert across reload), the popover loop, the dashboard's "Follow up with referral/partner/call/email"
- 34 screenshots under docs/screenshots/ (the 32 established re-captured + 33 the inline-editing row + 34 the popover with (Active) + Saved Views — each verified open at capture via the VLM; the agent-browser :has-text() hazard: its engine is plain CSS, the round-1 batch silently failed and was re-driven with eval-based clicks); .env/.env.example re-verified (no new env surface); docs realigned (README badge 801 + the Leads row + the session-29 paragraph, AGENTS counts + three contract blocks, CLAUDE counts + the suite + the duplicated-entry fix, PAD 43 suites / 697+104 + the four missing s28 rows added, SKILL v1.26.0 §16u + frontmatter + project_state + the stale-head-count/title fixes, docs/session_51.md, the plan addendum, both worklogs)

Stage Summary:
- Gate green: lint 0/0 · tsc 0 · 697/697 unit (+34) · 104/104 e2e (+4) · build clean; 34 verified screenshots; docs at SKILL v1.26.0; the C2 pointer CLOSED + the s8 Save View pin disproven live + the raw-source migration completed
- Ready: commit on main + the SSH-wrapper push (the shim at /home/z/my-project/bin/ssh)
- Next session pointers: the contact-photo upload flow (the real UploadFile round-trip vs our visual-parity input), the drift re-sweep, the account/lead Opportunity split question; the bundle cached at scripts/reference-bundle.js in the sandbox (not committed); the §16u census-method lessons — agent-browser is plain CSS (:has-text() silently fails), the synchronous-prompt page.once pattern, the UTC-midnight today quirk, the JS-click bypasses hit-testing

---
Task ID: 29-push (repo)
Agent: main (Super Z)
Task: The session-29 push record (the established dual-commit pattern)

Work Log:
- Gate green before push (rule 2): lint 0/0 · tsc 0 · 697/697 unit (43 suites) · build clean · 104/104 e2e (2.3m single-worker)
- Commit 27bd9b3 on main (57 files, +1558/-335); the paramiko shim verified at /home/z/my-project/bin/ssh; the operator key materialized to /tmp/session29-deploy.key (0600, outside the repo), fingerprint SHA256:3ddaNlFhMz1JXiGEDgVEaRsUzI4Ev0IpGEEB7NnU4PU (ed25519 — identical to the session-26/27/28 records, the same operator deploy key)
- Dry-run clean (fast-forward 5362717..27bd9b3, remote untouched), then the real push via docs/ssh_git_wrapper_v3.py --remote git@github.com:nordeim/neo-crm.git
- PUSH VERIFIED: remote refs/heads/main @ 27bd9b3 == local HEAD; tracking ref synced by the wrapper; independently re-verified via GIT_SSH_COMMAND ls-remote (27bd9b33175cc07fcba2ee33e05fe265180e3512); the operator key shredded (random overwrite + remove) after both verifications — no /tmp key residue

Stage Summary:
- Session 29 pushed to main; this record rides the second and final commit of the session
