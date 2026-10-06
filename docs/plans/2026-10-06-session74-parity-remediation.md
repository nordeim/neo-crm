# Session-74 Parity Remediation Plan (2026-10-06)

Session 74 on `main` @ `2e8071a` (the s73 ship `aadbee8` + `06e50f7`/
`2e8071a` the session_139/141 transcripts — docs only, ZERO code drift).
The sandbox SURVIVED session 73 — the pull fast-forwarded `aadbee8` →
`2e8071a` (docs/session_141.md only). Environment verified in place:
`.env` with `DATABASE_URL="file:../db/custom.db"` + the AUTH_SECRET,
`db/custom.db` + `db/e2e.db` at the repo root, the census reading
15/24/10/23/12 + 4 users — MATCH. The documented intake hazard STANDS
(the platform `DATABASE_URL` override points at a non-existent mirror;
all session-74 repo operations run under `env -u DATABASE_URL`; the e2e
suite immune via its own pinned E2E_DATABASE_URL). Ports 3000/3100
clear. **Baseline gate on HEAD: lint 0/0 (enforced) · tsc 0 · 1356/1356
unit (82 suites)** — the documented state exact. The `skills/`
exclusion verified in all three configs (vitest include allowlist,
eslint ignores, tsconfig exclude).

## The standing layers (70th session, NO DRIFT)

Drift sweep #70: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, direct curl with a browser UA) — size
1,631,071 + md5 `a70a637fcf1d4291da8e0d965676dc11` **exact — the 45th
consecutive stable session**. Reference census #70 (agent-browser, live
login at 1280 then a TRUE 390px viewport): the demo data still zero
(the KPI values 0/$0.0k/$0.0k/$0k/0%/0); the mobile-nav defect STANDS
at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible, scrollW
390, NO hamburger); desktop nav normal (256px, 8 links, all visible).

## The audits (three parallel agents + the orchestrator's manual validation of every claim at file:line, the parity claims BUNDLE-DECODED against the fresh-fetched reference)

**74-a** — the s73 re-audit: **16/16 claims GENUINE** (every S73-P1..P7
fix at file:line; the counts corroborated [82 suites, 1356 its,
playwright --list 126, tsc 0, lint 0/0]; the commit honest [33 files,
+1577/−173, zero strays]). Two nano notes: the 73-final record's stat
arithmetic (32/+660 vs the actual 33/+1577 — bookkeeping only); the
calendar row-menu trigger's `h-8 w-8` — **DISMISSED at the
orchestrator's validation: the bundle decodes the calendar trigger as
`className:"h-8 w-8"` (32px) explicitly** (the only 32px member of the
family; accounts/leads stock 36px, contacts `h-9 w-9 hover:bg-gray-100`
— ALL FOUR already match ours exactly).

**74-b** — the graduation audit: **ZERO graduations, 13/13 (the 31st
consecutive)** — every standing item re-verified at file:line. The 8
mechanical censuses ALL CLEAN (localStorage exactly 2 live keys;
public/ og-image.png only; API 27 routes/39 handlers all consumed; env
parity 3-var exact; doc anchors at 1356+126 all four carriers exact,
badge 1482; zero commented-out code; TODO/FIXME 0, .skip/.only 0,
console.log 0 with the 4 documented exceptions; `new PrismaClient`
exactly 2; the e2e-waits census 5 annotated).

**74-c** — the fresh-eyes rotation on the reports-page family (the
session_140 suggested target — reports-page 1085 + charts 366 +
save-report-dialog + saved-reports + the REPORTS_* records + the
REPORT_* vocabularies + /api/reports + /api/export + pdf-export + csv):
the family's foundations SOLID (all five tabs' structures, every chart
config [fills/radii/yWidths/palettes/labels], the KPI math [the
reference's m memo decoded in full: openLeads new||contacted, won/lost
from OPPORTUNITIES, conversion won/(won+lost) — the earlier 3-status
decode was the LEADS page's memo], the funnel 8-slug split, the
forecast model, the aging labels, the empty-state copy 10/10, the
export filenames/prefixes, the saved-reports schema/guards, the
envelope handling — 111/111 family unit battery green). **The N-74
family** (as validated + decoded by the orchestrator):

- **M-74c1 CONFIRMED (bundle-decoded)** — the stage select renders
  OPP_STAGE_META labels "Won"/"Lost"; the reference's `lCe` filter bar
  ships `closed_won → "Closed Won"` / `closed_lost → "Closed Lost"`
  (the full six-item list decoded; the OTHER "Won" select is the status
  vocabulary). Only reports-page:171 consumes `.label` — the blast
  radius contained.
- **M-74c2 CONFIRMED (bundle-decoded)** — periodStart maps thisWeek to
  `startOfWeek(now, "monday")` in BOTH routes (reports route :39 +
  export route :18); the reference's single resolution site decodes
  `thisWeek → Zu(O)` = date-fns startOfWeek with the default
  `weekStartsOn` resolving through the `??0` chain → **Sunday**.
- **M-74c3 CONFIRMED (bundle-decoded)** — periodStart maps quarter to
  `startOfQuarter(now)` (the CALENDAR quarter); the reference decodes
  `quarter → bK(O,3)` = date-fns subMonths(now, 3) — a ROLLING 3-month
  window (day-of-month + time-of-day preserved, end-of-month clamped
  via the cK algorithm). `startOfQuarter` exists nowhere in the bundle.
- **M-74c4 CONFIRMED (bundle-decoded)** — the Leads List by Source
  table caps at `.slice(0, 8)` (reports-page:908) over the API's 10-row
  list; the reference's t3e renders `e.slice(0,10)`.
- **M-74c5 CONFIRMED (bundle-decoded)** — the leads-list Status cell
  renders the STAGE_META tinted pill + label; the reference renders
  `zn variant:"outline"` with the RAW `o.status` (the source-vocabulary
  form).
- **M-74c6 CONFIRMED (bundle-decoded)** — the per-table PDF exports
  pass the same RAW rows as the CSVs; the reference's dB data carries
  the FORMATTED `` `$${(p.amount||0).toLocaleString()}` `` amounts
  (CSV stays raw — the reference's own split, both functions decoded);
  the at-risk PDF title is the SHORT "Deals at Risk" (ours passes the
  full "Deals at Risk (No Activity 14+ Days)").
- **L-74c7 CONFIRMED (bundle-decoded)** — the SaveReportDialog body:
  ours a flat `grid gap-4` with 1-col `grid gap-2` columns and a bare
  text-muted Current-Filters `<p>`; the reference's n3e ships
  `space-y-6 py-4` > a `space-y-4` section (the name field's Input
  `mt-1`; the columns `grid grid-cols-2 gap-3`; the filters summary in
  a `bg-blue-50 border border-blue-200 rounded-lg p-3` box with
  `text-sm text-blue-800`) + the Save Report button's Save icon
  (`w-4 h-4 mr-2`).
- **L-74c8 CONFIRMED (bundle-decoded)** — our dialog RESETS on open
  (the prevOpen pattern); the reference's n3e state lives OUTSIDE the
  dialog portal and persists across opens (the only clear is the
  post-save `s("")`) — a cancel-then-reopen shows the typed name there.
- **L-74c9 CONFIRMED (bundle-decoded)** — the Reset button sits in our
  actions cluster (with Export CSV/PDF); the reference's lCe renders it
  the LAST CHILD of the selects cluster (`flex flex-wrap gap-3 flex-1`).
- **L-74c10 CONFIRMED (bundle-decoded)** — the KPI icon glyphs render
  the -500 hexes (the `color` prop's #3b82f6 inline); the reference's
  `ay` maps to the **-600 text classes** (`text-blue-600` #2563eb etc.)
  — the sparkline STROKES stay -500 on both sides.
- **L-74c11 CONFIRMED (bundle-decoded)** — the KPI spark slot carries
  our invented `max-w-[176px]`; the reference's slot is the bare
  `flex-1 h-12 mr-2`.
- **L-74c12 CONFIRMED (bundle-decoded)** — our TrendLineChart series
  carry names ("Revenue"/"Activities"); the reference's Revenue Over
  Time + Activities Over Time lines ship NO name (the tooltip shows the
  raw dataKey). The Forecasting Accuracy pair KEEPS its names
  ("Forecasted"/"Actual" — decoded) and the bar families keep theirs.
- **L-74c13 CONFIRMED (bundle-decoded)** — the tab-1 Pipeline by Stage
  misses the plain `toLocaleString` tooltip formatter (the reference's
  `formatter:p=>p.toLocaleString()`; tab-2's $ formatter already
  matches).
- **L-74c14 CONFIRMED (bundle-decoded)** — the reports table cells
  carry `text-foreground`/`text-muted`/`font-semibold` chrome; the
  reference's cells are `font-medium` (primary) / BARE (secondary) /
  `text-right` (amounts) — 11 sites.
- **L-74c15 CONFIRMED (bundle-decoded)** — the Won Deals value rides a
  `flex flex-wrap items-baseline gap-1.5` p with a LEADING `{" "}`
  fragment; the reference renders the single template
  `` `${count} $${(value/1e3).toFixed(1)}K` `` on a plain
  `text-2xl font-bold text-gray-900` div.
- **N-74c1** — the four per-table export button icons carry
  `h-3.5 w-3.5` class noise (the reference's literal `w-4 h-4`; ours
  compute 16px under the S73-P4 `[&_svg]:size-4` anyway).
- **N-74c2** — the forecast bands carry a `Math.round` the reference
  lacks (raw accumulation; a no-op on integer amounts).
- **N-74c5** — the export route's Close Date cell renders
  `formatDate(r.closeDate)`; the reference's CSV passes the RAW
  `close_date` string.
- **N-74c6** — the finite-period filters bound `gte: from` only; the
  reference's `ld` is inclusive BOTH ends (future-dated rows excluded
  from finite periods — the activities family already carries the
  `<= now` bound on our side).
- **DISMISSED/STANDING at validation** — the header Bookmark mr-2 (the
  BUTTON_BASE.iconGap `[&_svg]:mr-2` applies it); the SelectValue
  placeholders ("Date: This Quarter" etc. — dead-in-practice, both
  sides always carry a value); the tab id "health" vs "accounts"
  (internal state, never renders); the `lg:col-span-3` (NOT dead —
  tab-2's grid is `lg:grid-cols-3`); the calendar trigger h-8 w-8
  (CORRECT parity — see 74-a); the saved-name trim + the Load button's
  hand-inlined size classes (computed-equal); the accounts'
  revenue-desc order (unpinnable); the export CSV's naive quoting
  (the CSV posture (b) superset — see the operator decisions).

## The operator decisions

The **CSV formula-injection posture (b) STANDS** (the 33rd
re-affirmation — the guard intact in both export families
[guardFormulaPrefix at csv.ts:31-33 applied in escapeCell AND imported
into entity-export.ts, the 74-b re-verification], the `-` exclusion
documented + pinned, the reference bundle byte-stable for the 45th
consecutive session; the 74-c rotation DECODED the reference's three
CSV builders fresh — the header export + both per-table exports all
quote every cell with plain `` `"${V}"` `` and zero guarding, no BOM,
plain `\n` — the posture's factual basis re-confirmed, no new evidence
moves the (a) parity / (c) full-OWASP alternatives).

The **source-vocabulary documented parity STANDS AND EXTENDS to the
reports-page family** (the 74-b census re-confirmed every anchor at
file:line; the M-74c5 fix EXTENDS the raw-value render to the
leads-list Status cell [the outline Badge with the raw stage slug];
the M-74c1 labels are the SELECT's display vocabulary — the same
Capitalized convention as the settings defaults — while the WIRE values
stay the raw closed_won/closed_lost slugs; the page VOCABULARIES
[the five tab labels, the chart titles, the empty-state copy 10/10,
the button labels] are untouched and now bundle-verified verbatim).

## The remediation set (TDD — RED first, then GREEN)

- **S74-P1 (M-74c1)** — OPP_STAGE_META.closed_won/.closed_lost labels
  go "Closed Won"/"Closed Lost" (constants.ts:58-59; only the reports
  select consumes `.label` — verified); the reports-page:158 comment
  re-anchored; the opportunity-model.test.ts "Won"/"Lost" label pins
  re-anchor in lockstep.
- **S74-P2 (M-74c2/c3 + N-74c6 — the period-semantics pair)** —
  format.ts gains `subMonthsClamped(d, months)` (the cK mirror:
  time-of-day preserved, end-of-month clamping); BOTH routes'
  periodStart re-map: thisWeek → `startOfWeek(now, "sunday")`,
  quarter → `subMonthsClamped(now, 3)` (startOfQuarter retires from
  both imports); the finite-period opp/lead where-clauses gain the
  upper bound (`createdAt: { gte: from, lte: now }`). Tests: the
  format suite gains subMonthsClamped behavioral pins (the plain
  month-back, the May-31→Feb-28 clamp, the time-of-day preservation);
  the report-periods suite gains the sunday + subMonthsClamped code
  pins + the upper-bound pin.
- **S74-P3 (M-74c4/c5)** — the leads-list slice goes 10; the Status
  cell becomes `<Badge variant="outline">{l.stage}</Badge>` (the raw
  slug — the source-vocabulary form; STAGE_META retires from the
  file's imports if zero consumers remain).
- **S74-P4 (M-74c6)** — the per-table PDF rows carry the formatted
  `$${amount.toLocaleString()}` amounts (separate pdfRows from csvRows
  at both DealsTables call sites); the at-risk PDF title goes the SHORT
  "Deals at Risk" (the filename inherits the same slug via tableSlug).
- **S74-P5 (L-74c7/c8 + N-74c4 — the save-dialog restructure)** — the
  body becomes the reference's `space-y-6 py-4` > `space-y-4` section
  (the name field's bare div + Input `mt-1`; the columns `grid
  grid-cols-2 gap-3`; the Current-Filters `bg-blue-50 border
  border-blue-200 rounded-lg p-3` box with `text-sm text-blue-800` +
  the `|| "All"` owner terminal); the Save Report button gains the
  Save icon; the reset-on-open RETIRES (the name persists across
  cancel-reopens; the dialog clears its own name after a successful
  save); the Input id goes "reportName".
- **S74-P6 (L-74c9)** — the Reset button moves to the LAST CHILD of
  the selects cluster (inside REPORTS_FILTER_BAR.selectsWrap, after
  the status select; the actions cluster keeps Export CSV + PDF only).
- **S74-P7 (L-74c10/c11/c15 — the KPI trio)** — page-layout gains
  KPI_ICON_TEXT (the -600 class map keyed by the -500 hexes:
  #3b82f6→text-blue-600, #10b981→text-green-600, #ef4444→text-red-600,
  #8b5cf6→text-purple-600, #f97316→text-orange-600); the CircleStatCard
  icon span carries the class (the inline `color` style retires); the
  KPI_SPARK.reportsMaxWidth record + its pin retire; the value p
  becomes the plain `text-2xl font-bold` div and the Won Deals value
  the single template string (the leading `{" "}` retires).
- **S74-P8 (L-74c12/c13 + N-74c1/c2 — the chart hygiene quartet)** —
  the TrendLineChart series `name` goes OPTIONAL (the Line spreads
  `name={s.name}` — undefined renders the raw dataKey tooltip); the
  Revenue + Activities call sites drop their names; the tab-1 Pipeline
  gains the plain numberFormatter (`v.toLocaleString()` — exported
  from charts.tsx beside dollarFormatter); the eight per-table export
  button icons go `h-4 w-4`; the forecast bands' Math.round retires.
- **S74-P9 (L-74c14)** — the reports table cells normalize to the
  reference's bare family: the primary cells `font-medium` (the
  text-foreground retires), the secondary cells BARE (text-muted
  retires), the amount cells `text-right` (the font-semibold +
  text-foreground retire) — 11 sites across DealTables/DealsTables/
  Overdue/ActivityLog/LeadsList/SourcePerformance/AtRiskAccounts/
  AccountSummary.
- **S74-P10 (N-74c5)** — the export route's Close Date cell goes the
  raw `r.closeDate?.toISOString() ?? ""` (the formatDate retire).
- **S74-P11 (the coverage closures — three NEW e2e checks)** — (a) the
  **save/load round-trip**: open the dialog → name it → Save → the
  header button reads "Saved Reports (1)" → reopen → the saved list
  shows the entry → Load → the filters applied (the stage select shows
  the saved value) → the localStorage key cleaned (self-cleaning);
  (b) the **stage-select + Reset round-trip**: open the stage select →
  "Closed Won" present + selectable → the Reset returns all four
  selects to their defaults; (c) the **per-table CSV download**: the
  Open Deals by Stage "Export CSV" fires a download named
  `open_deals_YYYY-MM-DD.csv`. 126 → 129.

## Blast radius (pre-checked)

The pins that RE-ANCHOR in lockstep: `tests/opportunity-model.test.ts:
58-63` (the Won/Lost label pins → Closed Won/Closed Lost);
`tests/page-layout.test.ts:967` (the reportsMaxWidth pin RETIRES with
the record; the KPI_ICON_TEXT pins arrive); `tests/report-periods.
test.ts` (the periodStart code pins gain the sunday/subMonthsClamped
forms); `tests/format.test.ts` (the startOfQuarter its SURVIVE — the
helper stays exported for its calendar consumers... to be verified at
execution: if zero consumers remain, the helper + its its retire per
the dch policy); the e2e reports KPI expectations (the seeded-op set
unchanged — the KPI math untouched); `tests/dead-code-hygiene.test.ts:
849-858` (the OPP_STAGE_META[s].label form pin SURVIVES). No pins on:
the SaveReportDialog anatomy, the Reset placement, the table cells, the
trend names, the PDF rows, the Close Date cell, the icon literals. The
dch guards auto-scan the records (KPI_ICON_TEXT arrives as a new string
map — the de-bracket guard tolerates class strings). The TrendLineChart
name-optional change is type-compatible (all other consumers pass
names). The e2e ⋮/menu tests untouched (no row-menu surface in this
family).

## The gate

lint 0/0 · tsc 0 · the full unit suite at 1356 + the new session-74 its
· build clean · e2e 129 on a fresh CI=1 boot (all 9 mobile-nav checks
green) · the non-vacuousness replay in a pre-fix `2e8071a` worktree
(only the new/modified test files; the exact RED set isolated) · the
LIVE battery (the stage select's Closed Won/Closed Lost; the
thisWeek-Sunday + quarter-rolling semantics spot-probed via the
saved-report filter states; the dialog's blue filters box + 2-col
columns + the persisting name across a cancel-reopen; the Reset as the
selects' last child; the KPI icons at the -600 hexes LIVE-measured;
the spark slot uncapped; the leads-list Status outline badge raw; the
PDF amounts formatted; the mobile drawer regression at TRUE 390px +
the Tailwind v4 token probes + zero 390px overflow ×10 routes + the
closing db:census MATCH) · the screenshot set at 1440×900 · the docs
realignment (SKILL v1.71.0 + README/AGENTS/CLAUDE/PAD at the new
counts + session_142.md [the even-number record convention] + this
execution record + the repo worklog); .env/.env.example verified (no
env surface change).

## The execution record (2026-10-06, session-74)

EXECUTED AS PLANNED with TWO mid-flight test-shape repairs + TWO
mid-flight e2e repairs (all caught by the runs themselves, all on the
NEW tests/pins, none post-ship): (1) the Activities-line pin re-scoped
to the TrendLineChart block only — the adjacent vs-wins bars
legitimately keep their "Activities"/"Won Deals" names (the reference
decodes them); (2) the export-icon count pin re-scoped to 2+2 (the
bar's Export CSV rides the barBtnIcon record — the same h-4 w-4
family through the record); (3) the per-table CSV download e2e's
`.first()` grabbed the FILTER BAR's own Export CSV (crm_report_...
via /api/export — the sticky bar precedes every table button in DOM
order) — re-scoped to the Open-Deals CARD locator; (4) the s72
settings-defaults test flaked ONCE under full-suite load (the debounce
focus window — passes in isolation + on the full re-run; a pre-existing
timing sensitivity with ZERO code intersection with this session's
change set). RED: **45 failed exactly** (the reports-page-parity
suite's 38 [one green-through-RED by design] + the opportunity-model
label re-anchor + the page-layout spark-row re-anchor + the
report-periods sunday/subMonths pair + the dch startOfQuarter
retirement pair + the stat-value CircleStatCard re-anchor). GREEN:
S74-P1..P10 all landed (P1 the labels; P2 subMonthsClamped + sunday +
the lte bounds + the startOfQuarter retirement; P3 the slice + the
outline Badge; P4 the PDF split + the short title; P5 the dialog
restructure + the persist contract; P6 the Reset placement; P7 the KPI
trio; P8 the chart hygiene; P9 the bare cells; P10 the ISO Close
Date); P11 the three e2e closures. Non-vacuousness: 45 failed | 307
passed (352) in the pre-fix 2e8071a worktree (node_modules
hard-linked via cp -al, only the modified test files); clean
teardown. Full gate: lint 0/0 · tsc 0 · **1397/1397 unit (83 suites,
+41)** · build clean · **129/129 e2e on a fresh CI=1 boot (3.4m, all
9 mobile-nav checks green)**. LIVE: the KPI row with the single-template
Won Deals value + the -600 icon glyphs + the uncapped spark slot; the
stage select's Closed Won/Closed Lost + the Reset round-trip; the
save dialog's blue box + 2-col columns + Save icon + mt-1; the
leads-list raw outline Badge + 10 rows; the drawer at TRUE 390px with
focus restored (the JS-click artifact run down — the real click); zero
overflow x10; NO Tailwind v4 bug; the closing census MATCH; the VLM's
two wrap flags proven the reference's own rendering (the bar measured
byte-identical 250/202/202/226/114 on both apps). Docs: SKILL v1.71.0
(§16bn + project_state, 6719 → 6781, via the assert-first
scripts/skill_edits_s74.py) + README/AGENTS/CLAUDE/PAD at 1397+129
(badge 1526) + session_142.md + this record + the repo worklog;
.env/.env.example verified (no env surface change). Estimate drift:
+41 its exact (39 parity + 2 report-periods) · 129 e2e exact · the
e2e-waits census unchanged at 5 (no new waits — the download test
rides the download event, the others role waits).
