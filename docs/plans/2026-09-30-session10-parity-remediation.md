# Session 10 Remediation Plan — Stock-Primitive Internals + Chart Zero-State + Reports Tab Re-Mirror (2026-09-30)

**Scope:** Fresh-login DOM audit of the live reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `203162e`
(baseline gate green: lint 0/0 · tsc clean · 148/148 unit · dev server healthy
on :3000 with `db/custom.db` at the repo root; `.env` /
`.env.example` / `db/` / vitest + playwright configs all verified; mobile-nav
regression suite re-verified live — drawer, dual locks, Escape, route-close,
the 700→800 resize unlock, and zero 390px overflow on all nine routes). The
reference's demo data is STILL zero (sixth consecutive session) — parity
remains structural. All reference DOM was captured at **1512×945**
(`/home/z/my-project/s10-audit/live-d1512/` + `clone-d1512/`, 9 routes each)
plus computed-style probes on both apps. Sessions 1–9 covered data/API,
visual basics, dialogs, layout, app chrome, functional controls and component
anatomy. This session's audit targeted the three layers still below/around
those pins: **stock-primitive internals** (the layer under session-9's
anatomy — input/select/textarea base classes, cursors, tokens), **chart
rendering internals** (tooltips + the zero-data state), and — the largest
find — the **reports tabs 2–4 contents**, which had never been audited
against the reference. The Tailwind v4 hazard sweep (per the user's standing
instruction) surfaced one more real rename bug.

**Method:** TDD — new contracts land in `src/lib/page-layout.ts`,
`src/lib/constants.ts`, a new `src/lib/reports-data.ts` pure seam, and
`tests/design-tokens.test.ts` with failing tests first; e2e assertions are
updated in the same commits as the behavior changes. UI changes land with
the full gate plus browser re-verification at 1512/1024/768/700/390. The
`skills/` folder stays excluded from all checking, testing and compilation.

---

## Identified Issues, Bugs and Gaps (all DOM-verified unless noted)

| # | Sev | Issue | Evidence (live DOM / reproduction) |
|---|-----|-------|-----------------------------------|
| S10-P0 | **High (Tailwind v4 bug)** | **`backdrop-blur-sm` compiles one scale-step too strong.** v4 renamed the blur scale (`blur-sm`→`blur-xs`, `blur`→`blur-sm`); our v4.3.3 `backdrop-blur-sm` (the login card's glass) computes **8px** while the reference's computes **4px** (the v3-era value its precompiled CSS ships). Same rename family as session-9's shadow bug; the login card's glass blur is 2× the reference's. | computed `backdrop-filter` probes on the login card (class-identical both sides: `bg-white/95 shadow-2xl backdrop-blur-sm rounded-2xl border-0`); live blur(4px) vs clone blur(8px) |
| S10-1 | High | **Global cursor rule missing.** The reference's global CSS ships `button, [role="button"] { cursor: pointer; }` — every button on the reference shows the hand cursor. Our buttons compute `cursor: default` (arrow) across all nine pages. | stylesheet rule extraction (reference) + computed cursor probes: live pointer / clone default |
| S10-2 | High | **Input/Select/Textarea stock internals diverge.** The reference's stock Input/Select (shadcn base44 CSS): `bg-transparent` (no bg class), NO text color class (inherits body `#0a0a0a` = its `--foreground` 3.9%), placeholder `text-muted-foreground` **#737373**, Select trigger `rounded-md` + NO `gap-2` + auto width. Ours: `bg-white`, `text-foreground` #111827, placeholder `text-subtle` **#9ca3af** (Input) / `text-muted` #6b7280 (search), Select `rounded-lg` + `gap-2` + `w-full`. Affects every input, textarea and select trigger in the app (dialogs, searches, picklists, profile fields, selects). | computed probes + full class extraction both sides (dialog inputs, search pill, selects) |
| S10-3 | Med | **Topbar search internals.** Reference = the stock Input base + `pl-10 bg-gray-50 border-gray-200`: 12px right padding (`px-3 py-1` base), `focus-visible:` ring (keyboard-only), `transition-colors`. Ours: a custom class string — `pr-4` (16px), `focus:` ring (fires on click), no transition. | computed padding/focus probes + class dumps both sides |
| S10-4 | High | **Chart tooltips are custom; the reference ships recharts DEFAULT tooltips** (`recharts-default-tooltip`: white bg, 1px #ccc border, 10px padding, stock label + item list) on every chart. Ours render a custom `ChartTooltip` (rounded-lg border-line shadow-lg + series dots + `capitalize`) on 5 wrappers in charts.tsx + the activities page. | hover probes on the pipeline chart both apps (extracted `.recharts-default-tooltip` HTML vs our custom div) |
| S10-5 | High | **Chart zero-state divergence — our ChartEmpty boxes never appear on the reference.** The reference (zero data for six sessions) renders the REAL chart at all-zero: dashboard pipeline (Y ticks 0-4 + 5 stage ticks + "$0.0k" value legend), revenue (fixed Nov–May window), leads bar (4-stage ticks), reports tab-1 pipeline (8 slug ticks + Y 0-4), aging pipeline (4 bars), activities (5 bar rects + ticks). Ours early-return a dashed "No data for this period yet" placeholder (`ChartEmpty`) on 5 wrappers — an empty-state we invented in session 1 and never verified. This reverses the "friendly placeholder" architecture decision (documented reversal, like session-9's duplicate-Status call). | reference tick extraction at zero (multiple charts) vs our charts.tsx early-returns; the reference IS in this state persistently |
| S10-6 | High | **Reports tab-1 "Pipeline by Stage" vocabulary: 8 RAW SLUGS.** Reference X ticks at desktop: `new, contacted, qualified, prospecting, qualification, proposal, negotiation, closed_won` — raw snake_case, a merged-list quirk (its dashboard aliases: new≡Prospecting, qualified≡Qualification, won≡closed_won leaked into one list). NOT a 390px artifact (re-verified at 1512). Ours: 5 friendly stages (Prospecting/Qualification/Proposal/Negotiation/Won). | reference a11y text + tick extraction at 1512 on reports tab 1 |
| S10-7 | Med | **The Conversion Funnel is a recharts FunnelChart on the reference** (4 trapezoid groups — empty shapes at zero, empty label-list; structure: `.recharts-funnel-trapezoid`). Ours: custom div bars (rounded-md bars + "↓ conv%" labels + a `count>0` filter — at zero ours renders a bare card with no chart structure at all). Used on the leads page AND reports tab 1. | reference DOM structure probes (leads page + reports tab 1) |
| S10-8 | **High (largest)** | **Reports tabs 2–4 structural divergence — never audited before.** Reference tab 2 (Pipeline & Forecast): "Forecasting Accuracy" card (WIDE 1142px chart, grid, row-derived, + centered caption `<p class="text-sm text-gray-500">Average Accuracy: 0%</p>` below the chart), "Pipeline by Stage" (row-derived, empty at zero), "Forecast by Probability" (row-derived, empty at zero), "Aging Pipeline" (FIXED 4 buckets — 4 bar rects at zero, ticks `<30 days / 30-60 days / >90 days` + Y 0-4), "Open Deals by Stage" table [Deal/Stage/Amount + "No open deals"], "Deals at Risk (No Activity 14+ Days)" table [Deal/Account/Amount + "No at-risk deals"] — each table with Export CSV + Export PDF buttons; NO KPI cards in tab 2. Ours: 4 KPI cards + 2 charts (fixed-5 pipeline + fixed-6-month revenue) + tab-1's DealTables duplicated. Reference tab 3 (Activity & Productivity): 3 charts (Activities by Type, Activities Over Time, Activities vs Wins — all row-derived, empty at zero) + "Overdue Activities" table [Activity/Type/Due Date + "No overdue activities"] + "Activity Log by Owner" table [Owner/Activities + "No activities"]. Ours: 1 donut + "Activity by Owner" table [Owner/Calls/Emails/Meetings/Total]. Reference tab 4 (Lead Sources): 3 charts (Leads by Source, Win Rate by Source (%), Avg Deal Value by Source — row-derived) + "Leads List by Source" table [Lead/Source/Status + "No leads"] + "Source Performance Summary" table [Source/Leads/Won/Revenue + "No data"]. Ours: 1 table (Lead Source Performance [Source/Leads/Won/Win Rate/Won Value]). Tab 5 verified STRUCTURALLY ALIGNED ✓ (2 charts + 2 tables, same titles). | full DOM/text extraction of all 5 reference tabs at 1512 (chart-type probes: bar rects / lines / sectors / trapezoids + tick texts) |
| S10-9 | Med | **Reports time-series are ROW-DERIVED on the reference** (empty at zero → no month ticks) — tab 1's Revenue Over Time + Won vs Lost, and the leads page's Won vs Lost. Ours: fixed 6-month windows (always 6 entries → month ticks render at zero). The DASHBOARD's charts stay FIXED (7-month window + 5-stage pipeline — verified on the reference at zero) and are NOT changed. | reference tick extraction at zero (dashboard: Nov–May present; reports tab 1 + leads wonVsLost: absent) |
| S10-10 | Med | **Per-page document titles.** Reference: `NEO CRM` (dashboard + login), `Accounts \| NEO CRM`, `Leads \| NEO CRM`, …, `Reports \| NEO CRM` on the other pages. Ours: `NEO CRM` everywhere (single layout-level metadata). | document.title probes on all 10 routes, both apps |
| S10-11 | Med | **Activities by-Type chart internals.** Reference: fixed 5 types (Call/Email/Meeting/Task/Note — ours already matches ✓), NO CartesianGrid, 270×150 in the rail, default tooltip, subtitle "Last 2 days" style. Ours: grid `#f3f4f6`, `h-[180px]`, custom tooltip, `margin left:-20`. | reference chart DOM probe (5 bar rects, hasGrid:false, 150px height) |
| S10-12 | Low | **Favicon:** the reference ships a base44-hosted PNG favicon; ours has none (browser default). Identity-layer platform-owner asset — NOT mirrored (documented deviation). | link[rel=icon] extraction |
| S10-13 | Low | **The reference's /signup 404s and its login "Sign up" button is dead** (no navigation, no toast). Ours keeps a working /signup page + navigation (functional superset — a self-hosted clone needs account creation; documented deviation, like "Continue with Google" toast degradation). The reference's 404 page is a base44 platform page (not mirrored). | click probes on the reference |

**Verified-aligned (no action):** shell + sidebar (`hidden md:flex w-64`) +
h1 (`text-gray-900` ≡ our `text-foreground` computed-equal), the mobile-nav
regression suite (drawer open, dual locks, Escape, route-close, 700→800
resize unlock), zero 390px horizontal overflow on all nine routes, all
session 6–9 pins re-checked intact, the user menu (stock Radix: Profile link
+ Logout div, `min-w-[8rem]` container), search dropdown (no dropdown at
zero matches — mirrored by our no-results state), reference KPI sparklines
(recharts; ours custom SVG — visual parity stands), no bare `border`/`ring`
v4 hazards in our code (all borders/rings are explicitly colored or sized),
`outline-none` semantics (visually identical both sides), the reference's
Per-page titles on login ("NEO CRM" ✓).

**Quirk-register updates:** the 8-slug reports pipeline list (merged-list
bug — double-reports new and qualified under their dashboard aliases;
won→closed_won), the aging-pipeline 4-bucket fixed list, the raw-slug
labeling style on reports charts, the "Average Accuracy" caption under the
forecasting chart, the dead login Sign up button + /signup 404 (kept as our
working superset), the favicon note.

---

## Remediation ToDo (TDD)

### Phase A — contracts, red first
- [ ] **A1** `tests/design-tokens.test.ts` add pins: `--blur-sm: 4px`
      present in the `@theme` block (S10-P0) + the global cursor rule
      `button, [role="button"] { cursor: pointer; }` present in globals.css
      (S10-1) + the new ink/placeholder tokens
      (`--color-ink: #0a0a0a`, `--color-muted-ink: #737373`).
- [ ] **A2** `tests/constants.test.ts` add pins: `REPORTS_PIPELINE_SLUGS`
      (the 8 raw slugs in exact order), `FUNNEL_STAGES` (4:
      new/qualified/won/lost), `AGING_BUCKETS` (4 labels: <30 days, 30-60
      days, 60-90 days, >90 days).
- [ ] **A3** `tests/page-layout.test.ts` add pins: `INPUT_BASE.bg`
      (`bg-transparent`), `INPUT_BASE.ink` (text color + placeholder via
      `--color-muted-ink`), `SELECT_TRIGGER` stock base (rounded-md, no gap,
      bg-transparent, auto width, placeholder color), `SEARCH_INPUT`
      (stock input base + `pl-10 bg-gray-50 border-gray-200` +
      focus-visible), `PAGE_TITLES` (10 routes → exact strings).
- [ ] **A4** new `tests/reports-data.test.ts`: red-first pins for the new
      `src/lib/reports-data.ts` pure seam — `agingBucket()` (4 fixed
      buckets), `forecastAccuracy()` (average accuracy caption value),
      `monthsFromEvents()` (row-derived month series), the 8-slug bucket
      mapping (alias double-reporting + won→closed_won).

### Phase B — e2e dependencies (same commits as the changes)
- [ ] **B1** Sweep `tests/e2e/*.spec.ts`: no ChartEmpty/text-placeholder
      assertions exist (verified) — no removals needed; ADD per-page title
      assertions; ADD reports tab 2–4 structure checks (aging chart ticks,
      tab 2 tables, tab 3/4 tables); keep the `$542.0k` tab-1 assertion
      (Recent Won Deals Amount cells stay).

### Phase C — implementation to green
- [ ] **C1** `globals.css`: `--blur-sm: 4px` re-pin + `--color-ink` /
      `--color-muted-ink` tokens + the base-layer cursor rule
      (`button, [role="button"] { cursor: pointer; }`).
- [ ] **C2** `input.tsx` / select.tsx / textarea: stock internals —
      `bg-transparent`, text ink `#0a0a0a`, placeholder `#737373`, Select
      trigger `rounded-md` + no gap + drop base `w-full` (add `w-full`
      per-surface where the reference has it — rails + filter bars, NOT the
      dashboard filter bar / dead switchers which are auto-width).
- [ ] **C3** `topbar.tsx`: search = shared Input + `pl-10 bg-gray-50
      border-gray-200` (inherits stock base: 12px right padding,
      focus-visible, transition-colors).
- [ ] **C4** `charts.tsx`: remove ALL ChartEmpty early-returns + the custom
      tooltip `content` props + the custom cursor fill (5 wrappers);
      `ConversionFunnel` → recharts `FunnelChart` (4 stages, label list).
- [ ] **C5** activities page: by-type chart — no grid, 150px, default
      tooltip, margin cleanup (S10-11).
- [ ] **C6** new `src/lib/reports-data.ts` + `/api/reports` reshape:
      8-slug pipeline (tab 1), row-derived revenue/wonVsLost series,
      4-stage funnel data, row-derived activitiesByType, aging buckets,
      forecast accuracy + caption value, forecast-by-probability series,
      open deals, deals at risk, activities over time, activities vs wins,
      overdue activities, leads list by source, win rate by source, avg deal
      value by source, source performance summary, activity log by owner.
- [ ] **C7** reports page: rebuild tabs 2–4 to the reference structure;
      rewire tab 1 (pipeline data + row-derived series); KPI sparkline data
      follows the row-derived series (Sparkline renders nothing at [] —
      verified safe).
- [ ] **C8** leads page: funnel → FunnelChart; wonVsLost → row-derived
      months (client-side, from closed events).
- [ ] **C9** per-page `metadata` title exports on all (app) pages
      ("X | NEO CRM"; dashboard stays "NEO CRM").

### Phase D — verification
- [ ] **D1** Full gate: lint 0/0 · tsc · unit (148 + new pins) · build ·
      e2e (22 + new checks; mobile-nav 6/6 must stay green).
- [ ] **D2** DOM re-verification at 1512/1024/768/700/390: cursor pointer,
      login blur 4px, input internals (placeholder #737373, typed text
      #0a0a0a, transparent bg), select trigger (rounded-md, rails w-full),
      default tooltips (hover probe), chart zero-state (unit-pinned + a
      wiped-data spot check), reports tabs 2–4, per-page titles, the
      standing mobile-nav regression.
- [ ] **D3** VLM spot-comparison (login, dashboard, reports, activities).

### Phase E — deliverables
- [ ] **E1** Refresh `docs/screenshots/` (12 captures).
- [ ] **E2** `.env.example` re-verify (unchanged contract).
- [ ] **E3** Docs realignment: README, AGENTS, CLAUDE,
      Project_Architecture_Document, `neo-crm_SKILL.md` (v1.7.0 — including
      the ChartEmpty decision reversal), this plan's addendum,
      `docs/session_13.md` (session-10 completion log), repo worklog,
      quirk-register updates.
- [ ] **E4** Commit on main + SSH-wrapper push.

---

## Execution notes

- **Why the ChartEmpty removal reverses a documented decision:** the
  "friendly placeholder" was our session-1 invention, never verified against
  the reference. The reference has been in the zero-data state for six
  sessions and renders REAL charts (ticks, zero bars, legends) — so our
  placeholder boxes are a standing visual divergence in exactly the state
  the reference persists in. The reversal is recorded in the SKILL doc and
  AGENTS (like session-9's duplicate-Status reversal).
- **The 8-slug mapping is a zero-data-informed guess** (like session-9's
  duplicate badge cells): the verifiable part is the tick list at zero
  (exact strings, exact order). The populated mapping (new≡prospecting
  double-report, won→closed_won) is the best-supported reading of the
  reference's merged stage list and is documented in the quirk register.
- **Row-derived vs fixed series:** the split is DOM-verified — the reference
  builds FIXED lists where ticks appear at zero (dashboard pipeline 5 stages
  + 7-month revenue; reports tab-1 pipeline 8 slugs; aging 4 buckets;
  activities 5 types) and ROW-DERIVED series where no ticks appear at zero
  (reports revenue/wonVsLost, leads wonVsLost, all tab 2–4 charts except
  aging). Our API/page changes follow that split exactly.
- **Select trigger `w-full`:** the stock trigger is auto-width; the
  reference adds `w-full` only on rail/filter-bar selects (270px in the
  w-80 rails) and keeps toolbar/dead switchers auto (128px). Our per-surface
  audit follows the reference's computed widths.
- **The login `backdrop-blur-sm` fix is a token, not a class rewrite** —
  re-pinning `--blur-sm: 4px` in `@theme` corrects the one usage (the login
  card) and documents the v4-rename hazard next to the session-9 shadow pin.
  Bare `blur-xl` on the decorative logo glow is unchanged by the rename
  (not renamed in v4) and is not a parity surface.
- **Scope guard on tab 2–4 chart internals:** the chart TYPES at zero are
  only identifiable where recharts renders structural groups at zero (bars
  for fixed lists, trapezoids for funnels). Where the reference renders
  empty wrappers (row-derived charts), the type is a zero-data-informed
  choice (bar for per-X charts, line for over-time charts) — documented.


## Addendum — execution record (same session)

All phases executed with the full gate green at every checkpoint:

- **Phase A:** 21 red-first checks (design-tokens +5: blur-sm/cursor-rule/
  ink/muted-ink; constants +4: 8 slugs/funnel stages/aging buckets/bucket
  mapping; page-layout +5 refined: INPUT_BASE/SELECT_TRIGGER/SEARCH_INPUT/
  PAGE_TITLES + the session-9 focusRing refinement; reports-data +7).
- **Phase B:** e2e extended — per-page titles test + reports tab 2–4
  structure checks (23 total, up from 22).
- **Phase C:** globals.css (blur re-pin + cursor rule + ink tokens +
  input-base utility), Input/Textarea/Select stock internals, topbar search
  on the shared Input, charts.tsx (defaults everywhere, ChartEmpty removed,
  FunnelChart funnel with its own data prop), activities chart (no grid,
  150px, default tooltip), reports API reshape + reports-data seam, reports
  tabs 2–4 rebuild, leads funnel + row-derived wonVsLost, per-page title
  wrappers.
- **VLM rounds:** three real fixes (Conversion Rate icon = lucide-target;
  dashed-default grid; login demo-hint removed) + one VLM claim disproven
  by DOM probe (dashed placeholders on the reference — `anyDashed: false`).
- **Phase D:** full gate green (lint 0/0 · tsc · **169/169 unit** · build ·
  **23/23 e2e**, mobile-nav 6/6); DOM re-verification at 6 breakpoints +
  zero 390px overflow on all nine routes; the funnel needed its own `data`
  prop (recharts API — first attempt rendered empty trapezoid groups).
- **Phase E:** 12 screenshots refreshed (login captured logged-out);
  `.env.example` re-verified unchanged; docs realigned (README, AGENTS,
  CLAUDE, PAD, SKILL v1.7.0, session_13.md log, this addendum, worklog).
- **Decision reversal recorded:** the session-1 "friendly chart placeholder"
  (ChartEmpty) is retired — the reference renders the REAL chart at
  all-zero data (its persistent state for six sessions). Reversal
  documented in AGENTS/CLAUDE/SKILL like session-9's duplicate-Status call.
- **Approach pivot recorded:** per-route `layout.tsx` metadata hit a Next 16
  typed-routes generation bug (`LayoutRoutes` not assignable to `"/"`);
  the working pattern is thin server `page.tsx` wrappers + renamed client
  parts (`*-page.tsx`).
