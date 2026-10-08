# Session-85 Parity Remediation Plan (2026-10-09)

Session 85 on `main` @ `0ef05a5` (the s84 ship `abcdca9` + the
session-log commit `19f04ad`-chain, docs-only — `docs/session_166.md`,
ZERO code drift). The workspace SURVIVED s84 (the pull fast-forwarded
`abcdca9` → `0ef05a5`, docs-only); the environment verified intact
(census MATCH 15/24/10/23/12 + 4 users; `.env` with
`DATABASE_URL="file:../db/custom.db"`; `db/` at the repo root). The
documented intake hazard STANDS (the platform `DATABASE_URL` override;
all session-85 repo operations run under `env -u DATABASE_URL`).

**Baseline gate on HEAD: lint 0/0 · tsc 0 · 1670/1670 unit (93 suites)
· build clean · e2e 131/132 on the first run — ONE flake (the S72-P2
settings-debounce focus test, a known timing-sensitive pin) under
deliberate CPU contention (the orchestrator's dev server + agent-browser
probes ran concurrently); the clean CI=1 re-run is the gate of record.
The `skills/` exclusion verified in all three configs (unchanged).

## The standing layers (81st session, NO APP DRIFT)

Drift sweep #81: the APP bundle still served byte-identical from
`/assets/index-DZ-xbrIm.js` — size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` exact — **the 56th consecutive
stable session** (the app stylesheet `index-Be9epoFc.css` 79,581 bytes
exact too). The login HTML still rides ONLY the `/static/*` platform
family (37 modulepreloads, zero `/assets` refs) and the LIVE app
post-login loads ONLY the old `/assets` pair — the documented non-drift
pattern unchanged from s84. Reference census #81 (agent-browser, live
login + a TRUE 390px viewport): the demo data still zero (the $0.0k KPI
family); the mobile-nav defect STANDS at a TRUE 390px (vw=390, nav w=0,
8 links in DOM, 0 visible, no mobile menu); desktop nav normal (256px,
8 links, all visible). Our mobile drawer stays the deliberate
documented superset — the LIVE battery re-verified this session (the
overlay full-bleed + visible, the panel w-72@left-0, 8 links all
visible, focus INSIDE the panel, dual scroll-lock, navigate-close +
locks released, the closed overlay `inert` + `visibility:hidden`, zero
overflow).

## The audits (two parallel subagents + the orchestrator's own fresh-eyes rotation, every parity claim decoded from the byte-stable 1.63MB reference bundle + LIVE-probed on BOTH apps)

**85-a** — the s84 re-audit: **6/6 GENUINE (S84-P1..P6), ZERO material
findings** (the TrendingUp/Target/Users stat trio at
account-insights-dialog.tsx:100/:107/:114; the stock-Avatar initials
circle :201-202; the bare default deals badge :237 + the OPP_STAGE_META
retirement :49; the blank-body Calendar :160; the 21-check suite + the
re-anchored vocabulary pin; the doc carriers incl. PAD:777-778). 3 nano
notes: N-85a1 the **SKILL H1** (neo-crm_SKILL.md:16) still reads
"v1.80.0" while the frontmatter says 1.81.0 — the s84 assert-first
script bumped the frontmatter but missed the heading (corroborated
independently by 85-b as N-85b1 — the first session where the two
disagree); N-85a2/a3 historical-wording/bookkeeping (no repo action).

**85-b** — the graduation audit: **ZERO graduations, 12/12 (the 42nd
consecutive)** — every standing ledger rationale verified UNCHANGED at
HEAD. **The 8 mechanical censuses 8/8 CLEAN** (the localStorage 2-key
set; public/ og-image only; the 19/19 deps; the 27-route/39-handler API
census all consumed; the 3-var env parity; the doc anchors at
1670+132/README 1802/SKILL v1.81.0; zero commented-out code; the 5
annotated e2e sleeps; the mobile-nav e2e suite intact at 9 checks).
Both operator decisions' evidence INTACT.

**85-c** — the fresh-eyes rotation on the **REPORTS TAB-CONTENT
FAMILY** (the standing session_165 suggested target — "the
cCe/ZEe/e3e/r3e table + chart chrome that s74's labels/PDF/cells pins
never fully walked"). Full decode of the reference's five tab
components (cCe @1187800, ZEe @1582499+, e3e @1590100+, t3e @1594700+,
r3e @1597967+) + the LIVE probe on BOTH apps (the reference's tabs 1-5
DOM-censused; our dev server's tabs 1-5 DOM-censused side-by-side).
**The foundations SOLID**: all five tab root/grid structures; the
chart internals (the tab-1 revenue SINGLE #3b82f6 strokeWidth-2 line +
the $ tooltip; the won-vs-lost grouped bars + the stock Legend; the
tab-1 violet "Value ($)" bars + the plain toLocaleString tooltip; the
funnel's #06b6d4 vertical bars + the stage YAxis at width 100; the
tab-2 forecast two-line trend + the tab-2 BLUE #3b82f6 pipeline bars +
the $ tooltip [the tab-1/tab-2 fill divergence is the reference's own —
ours mirrors]; the forecast pie's `${band}%: $XK` labels + outerRadius
90 + the 4-band model; the aging violet bars + the fixed 4 buckets;
the tab-3 by-type PIE `${type}: ${count}` + the 5-color palette + the
over-time single line + the vs-wins Activities/Won bars; the tab-4
source PIE + the #10b981 win-rate `%` bars + the #8b5cf6 avg-value `$`
bars; the tab-5 health PIE `${name}: ${value}` + outerRadius 100 + the
["#10b981","#f59e0b","#ef4444"] palette + the horizontal Top-10 with
the name YAxis at width 120); all ten table heads/cells/empty states;
the dB export component = our two-button construction verbatim (the
jsPDF internals + the `open_deals_`/`deals_at_risk_` prefixes + the
raw-CSV/formatted-PDF split); the s31 derivations (the insertion-order
months, the 8-slug funnel split, the actual/forecasted accuracy, the
aging by created_date, the at-risk 14-day join, the owner
"Unassigned" grouping, the health computation + the 999/"Never"
sentinel, the winRate/avgValue models); the N-48b label display-case
parity; the raw-source renders; the `$XK` revenue cell. **The N-85
family: 1 L + 4 N**:

- **L-85c1 CONFIRMED (bundle: the ht cells + the LIVE probe)** — THE
  ACCOUNT EM-DASH FALLBACKS: the reference's Recent Won Deals row
  renders `c.jsx(ht,{children:d.account_name})` and its Deals at Risk
  row `c.jsx(ht,{children:p.account_name})` — the BARE field, NO
  fallback (a null account renders an EMPTY cell). OURS ships
  `{d.account ?? "—"}` at reports-page.tsx:510 and :734 — the
  L-82c4 invented-fallback genus (the reference's own "$"-alone deals
  amount was the s82 precedent). Invisible on the seed (all 12 opps
  carry accounts — probed) but LIVE-exercisable (an opportunity
  without an account renders "—" ours / empty reference).
- **N-85c2 CONFIRMED (bundle + the LIVE root-children census)** — THE
  TAB-1 GRID SPLIT: the reference's cCe renders THREE grid children
  (`grid grid-cols-1 lg:grid-cols-2 gap-6` ×3 — Revenue+WonLost,
  Pipeline+Funnel, then the tables); OURS renders TWO (ONE grid
  wrapping all four charts at :419, then the tables grid). Visually
  identical (all charts height 300 + gap-6 both apps) — a structural
  mirror.
- **N-85c3 CONFIRMED (bundle: the Ht className + the LIVE computed
  class)** — THE FORECASTING-ACCURACY HEADER: the reference's ZEe
  ships its CardHeader with `className:"flex flex-row items-center
  justify-between"` appended (LIVE-computed
  `space-y-1.5 p-6 flex flex-row items-center justify-between`); OURS
  renders the plain base (`flex flex-col space-y-1.5 p-6`) — the
  ChartCard helper has no per-card header escape.
- **N-85c4 CONFIRMED (bundle: the div>p construction)** — THE
  AVERAGE-ACCURACY CAPTION STRUCTURE: the reference wraps
  `div.mt-4.text-center > p.text-sm.text-gray-500 > ["Average
  Accuracy: ", " ", span.font-bold.text-lg.text-gray-900]`; OURS
  merges into a single `p.mt-4.text-center.text-sm.text-gray-500`
  with `span.text-lg.font-bold` — computed-identical text, a DOM
  structure mirror.
- **N-85c5 CONFIRMED (bundle: the filter + the bare render)** — THE
  OVERDUE DUE-DATE EM-DASH: the reference's e3e filters
  `f.date&&isBefore(now,f.date)&&f.type!=="Note"` (the DATE-PRESENT
  guard) and renders `Tc(li(f.date),"MMM d, yyyy")` BARE; OURS filters
  on the activityDate seam (`dueAt ?? createdAt` — includes dueAt-less
  rows) and renders `a.dueAt ? formatDate(a.dueAt) : "—"`. Dead in
  practice (the dialog requires dueAt; the seed's 23 activities all
  carry one — probed) — a source-parity mirror of both the guard and
  the bare render.

## The operator decisions (45th re-affirmation)

The **CSV formula-injection posture (b) STANDS** — the 85-b
re-verification: `guardFormulaPrefix` intact at csv.ts:31-33 applied
in `escapeCell` AND imported into entity-export.ts's `qq` (entity-export
:24/:43); the `-` exclusion documented; ZERO new unguarded builders
(every CSV surface consumes the 4 central builders — the 85-b census).
The reports tab-content family rides the SAME two export seams
(exportTableCsv → toCsv → escapeCell; exportTablePdf) — no new CSV
surface, no new evidence moves the (a) parity / (c) full-OWASP
alternatives.

The **source-vocabulary documented parity STANDS** — the 85-b census
re-confirmed every anchor at file:line (the free-form source on all 4
route sites; the Capitalized six settings defaults verbatim; the
6 free-form carriers; tests/source-vocabulary.test.ts green). The
tab-content family introduces NO vocabularies (the raw stage/status
slugs + the ACTIVITY_TYPE_META label map are the existing pinned sets;
the overdue table's "note" exclusion mirrors the reference's own
"Note" guard).

## The remediation set (TDD — RED first, then GREEN)

- **S85-P1 (L-85c1)** — the account cells: `{d.account ?? "—"}` →
  `{d.account}` at :510 (Recent Won Deals) and :734 (Deals at Risk) —
  the reference's bare `account_name` form (null renders empty); the
  s82 `$`-alone precedent.
- **S85-P2 (N-85c5)** — the overdue due-date mirror: the API's
  overdue filter gains the reference's DATE-PRESENT guard
  (`a.dueAt &&` before the past-date check — the `f.date&&` arm) and
  the map carries the guaranteed date; the page renders
  `{formatDate(a.dueAt)}` BARE (the ternary + the em-dash retired).
  The ReportsData wire type for overdue rows narrows dueAt to string.
- **S85-P3 (N-85c2)** — the tab-1 grid split: the single 4-chart grid
  at :419 becomes the reference's TWO 2-chart grids (Revenue +
  Won-vs-Lost, then Pipeline-by-Stage + Conversion-Funnel) — the
  tables grid untouched.
- **S85-P4 (N-85c3 + N-85c4)** — the Forecasting-Accuracy chrome: the
  ChartCard helper gains an optional `headerClassName` escape and the
  Forecasting card passes `flex flex-row items-center justify-between`
  (the reference's appended family); the caption restructures to the
  reference's `div.mt-4.text-center > p.text-sm.text-gray-500` wrapper
  + the span at the reference's own class order
  (`font-bold text-lg text-gray-900`).
- **S85-P5 (the tests)** — the NEW
  `tests/reports-tabcontent-parity.test.ts` (the RED-first pin set:
  the two bare account cells + the em-dash negative over the tables
  region; the overdue filter's dueAt guard + the bare formatDate
  render + the em-dash negative; the tab-1 TWO-grid split (the
  SalesTab region's chart-grid count === 2) + the four-chart pairing;
  the headerClassName escape + the Forecasting card's appended family
  + the plain-header negative on the other cards; the caption's
  div>p construction + the span class order) + the green-by-design
  anchors (the five tab titles + grid classes; the ten table heads +
  empty-state copies; the chart fills/formatters/palettes/labels at
  the page wiring level; the export-button pair; the overdue red rows
  + the display-case types; the owner table's Unassigned grouping).
- **S85-P6 (the docs)** — the SKILL H1 bump (the 85-a/85-b
  corroborated nano — the heading joins the frontmatter at the session
  version) + the session-85 section + project_state; README badge +
  the suite list; AGENTS/CLAUDE/PAD counts; session record + this
  plan's execution record + the repo worklog.

No new e2e: every fix surface is class/structure-level (all the
reports e2e locators are role/text-based — verified: the tab-structure
test reads the tablist/first-chart gap (SURVIVES the split — both new
grids stay gap-6), the tab 2-4 tests read titles/tables by role+text;
the caption text "Average Accuracy" is unchanged). The unit pins + the
LIVE computed-probe battery cover the family (the s76–s84 precedent
for styling-only rotations).

## Blast radius (pre-checked)

The pins that RE-ANCHOR in lockstep: NONE (verified by grep — no test
pins `?? "—"`, the tab-1 chart grid, the ChartCard header, the caption
structure, or the overdue dueAt cell; the account-health-tab pins sit
on the tab-5 surfaces — bg-red-50/lastActivityText/outline/`|| "-"`
industry — all untouched; the page-layout `not.lg:grid-cols-2` pin is
scoped to settings-page.tsx; the reports-filter-parity KPI-grid pin
(`sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`) is a different
surface). SURVIVES untouched: reports-page-parity (the KPI/filter
surfaces), reports-data (the pure seams), charts-internals +
charts-contracts (the component layer), report-pdf-guard (the export
seams), the e2e family (132 — role/text locators; the gap-24px probe
reads `closest('.grid')` which stays the first 2-chart grid). The
GREEN-hazard sweep: the ChartCard headerClassName is optional (zero
callers change); the wire-type narrowing (dueAt: string) touches the
ReportsData interface + the one consumer; formatDate's signature
accepts the narrowed type; no test pins the reports-page import lines.

## The execution record (2026-10-09, session-85)

EXECUTED AS PLANNED, 2 mid-flight pin-shape repairs. RED: **10 failed
exactly** (the new reports-tabcontent-parity suite's RED pins — every
fix-family pin failing at its own first assertion, the green anchors
passing through RED as designed except the grid-count anchor which
pins the post-split state by construction). Non-vacuousness PROVEN at
the pre-fix state (only the test files modified): the full suite ran
**10 failed | 1677 passed (1687 total)** — exactly the modified-pin
set, ZERO collateral. The 2 pin-shape repairs: the grid-count anchor
5 → 8 (the tab-3/4 tables + the tab-5 pair undercounted when the
anchor was drafted) + the overdue-guard `now.getTime()` shape (the
route's `now` is a Date, not a number — tsc caught it, the pin
re-anchored in lockstep). GREEN: S85-P1..P6 all landed (P1 the bare
`{d.account}` cells x2 + the L-82c4-genus comments; P2 the API's
DATE-PRESENT guard + the GUARANTEED-date map + the wire type narrowed
to `dueAt: string` + the page's bare `{formatDate(a.dueAt)}`; P3 the
tab-1 TWO 2-chart grids with the pairing comment; P4 the ChartCard
`headerClassName` escape + the Forecasting card's appended flex-row
family + the caption's div>p construction at the reference's own span
class order; P5 the suite at 17 its; P6 the docs below). GATE: lint
0/0 · tsc 0 · **1687/1687 unit (94 suites, +17)** · build clean ·
**132/132 e2e on a fresh CI=1 boot (3.3m, FIRST run green — all 9
mobile-nav checks green)**. LIVE (the fixed dev server, both apps
probed): the tab-1 root's THREE grid children (was 2) with
Revenue/WonLost + Pipeline/Funnel pairing; the tab-2 fcHeader
LIVE-computing `space-y-1.5 p-6 flex flex-row items-center
justify-between` — the reference's exact class; the caption div>p +
`font-bold text-lg` span; the overdue bare dates ("Oct 8, 2026" — no
em-dash anywhere in the Due Date column); the drawer at TRUE 390px
(the full-bleed overlay, the w-72 panel at left-0, 8 links all
visible, focus INSIDE, dual scroll-lock, navigate-close + locks
released, the closed overlay inert + visibility:hidden); zero
overflow; the closing census MATCH (db pristine + the reference
md5-exact, re-fetched — the 56th consecutive stable session).
Screenshots 109 (the Forecasting chrome + the three-card row) + 110
(the overdue/owner tables) + 111 (the mobile drawer at 390) NEW —
VLM 109 = 4/5 [the (3) pie-label NO is the VLM-scale artifact — the
labels are LIVE-DOM-proven: "0-25%: $190K" / "26-50%: $110K" /
"51-75%: $225K" / "76-100%: $0K", the s81 item-radius precedent] +
110 = 5/5 PASS. Docs: SKILL v1.82.0 (§16by + project_state + the H1
re-joined to the frontmatter — the 85-a/85-b corroborated nano, via
the assert-first `scripts/skill_edits_s85.py` at the sandbox root) +
README badge 1819 + the suite list + AGENTS/CLAUDE/PAD at 1687+132 (+
the PAD s85 inventory row + the Total 94/1687) + session_167.md +
this record + the repo worklog; `.env`/`.env.example` verified (no
env surface change). Estimate drift: +17 its exact (the new suite's
17) · 132 e2e exact · the e2e-waits census unchanged at 5.
