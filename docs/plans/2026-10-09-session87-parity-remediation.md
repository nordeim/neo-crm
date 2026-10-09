# Session-87 Parity Remediation Plan (2026-10-09)

Session 87 on `main` @ `d3fd4a8` (the s86 ship `ac42d92` + the
docs-only session-log commit). The workspace was RECLONED (the sandbox
had been reset); the environment rebuilt and verified intact
(`bun install`; `.env` from `.env.example` with a fresh `AUTH_SECRET`;
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root; the
census MATCH 15/24/10/23/12 + 4 users; vitest + playwright configured;
the `skills/` exclusion verified in eslint/tsconfig/vitest/playwright;
the sitemap/robots/manifest route handlers + the site.ts seam + the
og-image all present). The platform `DATABASE_URL` override hazard
STANDS (it points at the non-existent sandbox-root mirror) — all
session-87 repo operations run under `env -u DATABASE_URL`.

**Baseline gate on HEAD: lint 0/0 · tsc 0 · 1709/1709 unit (95 suites,
re-run live) · build + e2e deferred to the post-fix gate** (the 87-a
subaudit re-ran the full unit suite live at HEAD: 95 files, 1709/1709
green; lint + tsc re-verified by the orchestrator; the one-gate
discipline — the reference bundle was re-fetched fresh and verified
byte-stable first, and the RED checkpoint below proves the pre-fix
state of every new pin).

## The standing layers (83rd session, NO APP DRIFT)

Drift sweep #83: the APP bundle re-fetched fresh from the reference
and served byte-identical from `/assets/index-DZ-xbrIm.js` — size
1,631,071 + md5 `a70a637fcf1d4291da8e0d965676dc11` exact — **the 58th
consecutive stable session** (the stylesheet `index-Be9epoFc.css`
79,581 bytes exact too). The login HTML still rides the `/static/*`
platform shell (the base44 loader); the LIVE app post-login loads
ONLY the old `/assets` pair. Reference census #83 (agent-browser,
live login + a TRUE 390px viewport): the demo data still zero (the
$0.0k KPI family); the mobile-nav defect STANDS at a TRUE 390px
(vw=390, nav w=0, 8 links in DOM, 0 visible, no mobile menu — the 8th
consecutive census); desktop nav normal (256px, 8 links, all visible).
Our mobile drawer stays the deliberate documented superset (the LIVE
battery re-verified post-fix below).

## The audits (two parallel subagents + the orchestrator's own fresh-eyes rotation, every parity claim decoded from the byte-stable 1.63MB reference bundle + LIVE-probed on BOTH apps)

**87-a** — the s86 re-audit: **18/18 checklist items GENUINE, ZERO
material findings** (the status trio + the META prospect entry + the
seed/schema/comments; the account-tier seam + the six consumption
sites + the five retirement surfaces + the settings defaultTier
keeper; the name-only search + the h-9 + the icon comment; the
filtered export basis + the RAW binding; the three placeholders + the
four superset comments; the 25-it suite re-run live 25/25 + the full
unit gate re-verified 95/1709; the doc carriers at v1.83.0/1841/
1709+132 incl. the N-86a1 footnote fix). 1 nano: **N-87a1** —
`tests/api-robustness.test.ts:1101`'s s43-P2 dead-`??` it.each still
lists `["src/app/api/accounts/[id]/route.ts", "tier"]` — vacuously
green since the tier PUT block retired at s86 (the isKey siblings got
retirement comments; the tier row got neither). Folded into S87-P5.

**87-b** — the graduation audit: **ZERO graduations, 13/13 (the 44th
consecutive)** — every standing ledger rationale verified UNCHANGED at
HEAD (the mobile drawer's < md coverage + the 768px autoCloseQuery;
the row-delete confirm gates ×4; the contacts Log Activity wiring; the
dashboard search/Add supersets; the view switchers; the vendored
tw-animate-css; the inert+visibility close pattern; the roving
tabindex; the functional /signup; the blob downloads; the login reset
flow; the API 0-90 guard; the (app)/layout direct session read). The
8 mechanical censuses **8/8 CLEAN** (the localStorage 2-key set; the
public/ og-image only; the 19/19 deps; the 27-route/39-handler API
census; the 3-var env parity; the doc anchors at 1709+132/1841/
v1.83.0; zero commented-out code; the 5 annotated e2e sleeps + the
mobile-nav suite intact at 9 checks). Both operator decisions'
evidence INTACT.

**87-c** — the fresh-eyes rotation on the **DASHBOARD KPI-FAMILY**
(the standing session_167 alternate — the KPI cards' own inner
construction + the spark family + the filter bar's source-level
chrome, never a dedicated rotation: s12 pinned the de-hover + the
label gray-600 + the container token, s27 the statics + the geometry
strings, s78 the raw-percentage bars — but nobody walked the card's
Card/CardContent split, the label/value row divs, the spark's
double-container nesting, the bars' span/div + class/inline color
mechanisms, or the chart headers' inner-row structure). Full decode of
the reference's KPI family from the byte-stable bundle (the six KPI
cards' `ot`/`ct` constructions + the Eke filter bar's three Fr
placeholders + the six chart-card `Ht` headers) + the LIVE probe on
BOTH apps (the reference's six cards + six headers + filter bar
censused at 1440 AND 390; our dev server's KPI row DOM-censused
side-by-side incl. the computed colors). **The foundations SOLID**:
the KPI grid token (identical), the KPI_STATICS family (all six arrays
+ both deltas + the color hexes, byte-exact), the line/area geometry
(monotone, strokeWidth 2/1, dot false, fillOpacity .3, the
#10b981/#8b5cf6 strokes), the bar heights (the raw percentages), the
value/label class strings, the page root + the header trio (identical
DOM), the filter bar computed-equal on all six children, the charts
family (grids/fills/radius/formatters/tick 12/dasharray 3 3/the
legend chips), the mobile 390px state (no overflow, single column,
both apps), and the twMerge leading-none resolution (the CardTitle's
`leading-none` base is resolved away by `cn` when the size override
merges — both apps render the identical 28px title, LIVE-verified).
**The N-87 family: 1 M + 2 L + 5 N**:

- **M-87c1 CONFIRMED (bundle: the suffix span's class; LIVE: the
  computed colors)** — THE AVG-SALES-CYCLE SUFFIX COLOR: the
  reference's "days" suffix is `span.text-xs text-gray-600 mb-1`
  (LIVE rgb(75,85,99) = gray-600 #4b5563); OURS is
  `span.mb-1 text-xs text-muted` (LIVE rgb(107,114,128) — our
  `--color-muted` #6b7280 = gray-500, ONE STEP LIGHTER). The s12
  rotation fixed the LABEL from text-muted to text-gray-600 but the
  suffix kept the token — the missed sibling. LIVE-visible on the
  seed (the "days" text renders at #6b7280 where the reference
  computes #4b5563).
- **L-87c2 CONFIRMED (bundle: the six spark constructions verbatim;
  LIVE: both apps' spark DOM censused)** — THE SPARK CONSTRUCTION:
  the reference renders ONE slot div per KPI card — `mt-2 h-8` (the
  line/area cards) or `mt-2 h-8 flex items-end gap-1` (the three bar
  cards) — with the chart as the DIRECT child: the line/area cards
  put the ResponsiveContainer directly inside the slot (no
  intermediate div); the bar cards put bare `div.flex-1
  bg-cyan-400|bg-green-400 rounded-sm` bars (the STATIC colors as
  Tailwind bg-CLASSES + the raw-percentage inline heights) with the
  Sales Target variant carrying `flex-1 rounded-sm` + the inline
  `backgroundColor: E<4 ? "#fbbf24" : "#3b82f6"`. OURS nests TWO
  containers on every card (the KpiCard's `mt-2 h-8` wrapper + the
  Sparkline's own `flex h-8 items-end gap-1` / `h-8 w-full` div — a
  doubled h-8), renders the bars as SPANs with inline hex
  backgroundColor on ALL cards (the reference uses bg-classes for the
  two static cards), adds `aria-hidden` the reference never carries,
  and the reports' CircleStatCard slots get the same intermediate
  div (the reference's `flex-1 h-12 mr-2` slot holds the
  ResponsiveContainer DIRECTLY — bundle-decoded this session). The
  heights/values are identical (computed-equal); the DOM structure,
  the element tags, and the color mechanism diverge.
- **L-87c3 CONFIRMED (bundle: the ot/ct/label-row/value-row
  constructions verbatim; LIVE: the card DOM censused at 1440+390)**
  — THE KPI CARD'S STRUCTURE: the reference ships `Card` (the stock
  component, NO padding) > `CardContent` with `className="p-4
  sm:p-6"` > [a LABEL-ROW `div.flex justify-between items-start mb-2`
  wrapping the `span.text-xs sm:text-sm text-gray-600`, a VALUE-ROW
  `div.flex items-end gap-2` (bare — the label row's mb-2 provides
  the 8px gap) holding the `span.text-2xl sm:text-3xl font-bold`
  value + the `div.text-xs text-green-600 mb-1` delta / the
  `div.text-xs text-gray-600 mb-1` note / the `span.text-xs
  text-gray-600 mb-1` suffix, and the spark slot]. OURS ships ONE
  div with the padding MERGED (`rounded-xl border border-line
  bg-surface p-4 shadow sm:p-6`), a BARE `<p>` label (no row), a
  value row that ADDS `mt-2` + `flex-wrap` (the reference wraps
  nothing — a long value+delta WRAPS on ours where the reference
  overflows; live-exercisable at narrow widths), `<p>` value +
  `<span>` delta/note elements (the reference: span value + div
  delta/note). Computed-equal on the seed; the source + DOM diverge.
- **N-87c4 CONFIRMED (bundle: the three Fr placeholders)** — THE
  THREE DEAD SELECTVALUE PLACEHOLDERS: the reference's filter-bar
  selects carry `placeholder:"Stage"` / `placeholder:"Format"` /
  `placeholder:"Source"` — all DEAD in the reference (the stage/
  source values always match their "all" items; the view-switcher's
  FIXED value `"format"` matches no item and renders EMPTY — the s8
  empty-trigger decode, LIVE-reconfirmed this session). OURS ships
  bare `<SelectValue />` ×2 + `placeholder=""`
  (VIEW_SWITCHER.emptyLabel). The N-86c5 mirror precedent.
- **N-87c5 CONFIRMED (bundle: the Ke className)** — THE FILTER
  BUTTON'S BARE `sm:w-auto`: the reference's Filter button carries
  ONLY `sm:w-auto` (the flex-col bar's default stretch full-widths
  it at mobile); OURS adds `w-full`. Computed-equal (both full-width
  at 390 / auto at ≥sm — LIVE-verified), the N-86c6 mirror genus.
- **N-87c6 CONFIRMED (bundle: the Ct className)** — THE SEARCH
  INPUT'S EXPLICIT `h-9`: the reference's dashboard search input is
  `pl-9 h-9` (both classes explicit); OURS ships `pl-9` (the Input
  base's h-9 computes it). Computed-equal; the N-86c6 EXACT
  precedent (the accounts search got the same mirror last session).
- **N-87c7 CONFIRMED (bundle: the six Ht constructions; LIVE: all
  six headers censused)** — THE CHART-CARD HEADERS' INNER-ROW
  STRUCTURE: the reference's Sales Pipeline card ships the BARE
  stock CardHeader (`flex flex-col space-y-1.5 p-6`, title only —
  no trailing element); the other FIVE cards (Revenue Over Time /
  Top Reps / Lead Sources / Upcoming Activities / Recent Deals) nest
  a `div.flex justify-between items-center` row INSIDE the stock
  CardHeader (the FILTER_RAIL mechanism — "passing the row class
  directly to CardHeader would keep the column direction"). OURS
  flattens all six: `CardHeader className="flex-row items-center
  justify-between"` (twMerge resolves flex-col → flex-row).
  Computed-equal (72px measured both). PLUS the "Last 6 months"
  span: the reference `text-xs text-gray-500`; OURS
  `text-xs text-muted` (both #6b7280 — computed-equal, source
  mirror).
- **N-87a1 (the 87-a audit nano)** — THE VACUOUS TIER ROW: the
  api-robustness dead-`??` it.each still lists the
  `accounts/[id]/route.ts` + `tier` row — vacuously green since the
  s86 retirement; retire the row with the retirement comment (the
  isKey siblings' precedent).

## The operator decisions (47th re-affirmation)

The **CSV formula-injection posture (b) STANDS** — the 87-b
re-verification: `guardFormulaPrefix` intact at csv.ts:31-33 applied
in `escapeCell` AND imported into entity-export.ts's `qq` (:24/:43);
the `-` exclusion documented; ZERO new unguarded builders (every CSV
surface consumes the central builders — the 87-b census; the
dashboard family rides the same four page-level export seams — all
consuming `toQuotedCsv`/`unquotedHeaderCsv`/`entityDumpCsv`). The
**source-vocabulary documented parity STANDS** — the 87-b census
re-confirmed every anchor at file:line. The KPI family introduces NO
vocabularies (the deltas/sparks are the pinned KPI_STATICS statics;
the selects' vocabularies — PIPELINE_STAGES / LEAD_SOURCE_OPTIONS /
Table-Cards — are the existing pinned sets; the three new
SelectValue placeholders are dead display strings, not wire
vocabularies).

## The remediation set (TDD — RED first, then GREEN)

- **S87-P1 (M-87c1 + L-87c3)** — the KpiCard restructure: the card
  renders `<Card>` + `<CardContent className={KPI_CARD.content}>`
  (the token = `"p-4 sm:p-6"`); the label row (`KPI_CARD.labelRow` =
  `"flex justify-between items-start mb-2"`) wraps the label span;
  the value row (`KPI_CARD.valueRow` = `"flex items-end gap-2"`,
  bare — the mt-2 + flex-wrap retire); the value becomes a `<span>`
  (KPI_VALUE unchanged); the suffix `text-muted` → `text-gray-600`
  (the M-87c1 fix); the valueNote span → div; the DeltaText string
  arm span → div; the spark slot becomes the variant-aware
  `sparkClassName` prop (default `KPI_SPARK.dashboardContainer`);
  the old `KPI_CARD.card` merged-div token retires (the Card
  component IS the card).
- **S87-P2 (L-87c2)** — the Sparkline content-only restructure: the
  line/area arms render the ResponsiveContainer BARE (the wrapping
  div + its aria-hidden + the redundant margin prop retire — the
  recharts default IS the 5px margin); the bars arm renders the bar
  DIVs bare (a fragment): `flex-1 ${barClassName} rounded-sm` (the
  new `barClassName` prop — the STATIC cards pass
  `bg-cyan-400`/`bg-green-400`) with the raw-percentage inline
  height, and the colorFor variant keeps the inline
  `backgroundColor`; the `className` prop RETIRES (zero consumers
  post-restructure). The dashboard call sites: the three bar cards
  pass `sparkClassName={KPI_SPARK.dashboardBarsContainer}` (the new
  `"mt-2 h-8 flex items-end gap-1"` token) + their barClassName /
  colorFor; the line/area cards take the default slot. The reports
  call sites drop `className="h-full"` (the slot holds the
  ResponsiveContainer directly — the reference's own construction).
- **S87-P3 (N-87c7)** — the chart-card headers: the Pipeline card
  drops the CardHeader className (the bare stock header); the other
  five wrap their title + trailing element in
  `div.DASHBOARD_CARD.headerRow` (`"flex justify-between
  items-center"`, the new token) inside the stock CardHeader; the
  "Last 6 months" span `text-muted` → `text-gray-500`.
- **S87-P4 (N-87c4/c5/c6)** — the filter bar: the stage select's
  `<SelectValue placeholder="Stage" />`; the view switcher's
  `VIEW_SWITCHER.emptyLabel` `""` → `"Format"`; the source select's
  `<SelectValue placeholder="Source" />`; the Filter button's
  `w-full sm:w-auto` → `sm:w-auto`; the search input's `pl-9` →
  `pl-9 h-9`.
- **S87-P5 (N-87a1)** — the api-robustness vacuous `tier` row
  retires (with the retirement comment, the isKey precedent).
- **S87-P6 (the tests)** — the NEW
  `tests/dashboard-kpi-parity.test.ts` RED-first pin suite: the
  suffix gray-600 pin + the labelRow/valueRow/content token pins +
  the Card/CardContent construction pins + the value-span/delta-div
  tag pins + the no-flex-wrap negative; the spark pins (the
  dashboardBarsContainer token + the bare-RC construction + the
  div-bar construction + the barClassName mechanism + the colorFor
  inline arm + the no-aria-hidden negative + the no-className-prop
  negative); the reports-slot direct-RC pin; the header pins (the
  Pipeline bare-header negative + the five nested headerRow pins +
  the gray-500 span); the filter-bar pins (the three placeholders +
  the emptyLabel "Format" + the bare sm:w-auto + the explicit h-9).
  Plus the lockstep re-anchors: the page-layout KPI_CARD.card pin
  (the split), the dashboard-family-parity bars-arm pins (the
  container moved to the KpiCard), the dead-code-hygiene Sparkline
  comments if needed.
- **S87-P7 (the docs)** — SKILL v1.84.0 (§16ca + project_state + the
  H1 in lockstep, via the assert-first scripts/skill_edits_s87.py at
  the sandbox root) + README badge + the suite list + AGENTS/CLAUDE/
  PAD at the new counts (+ the PAD s87 inventory row + the Total
  row) + session_171.md + this plan's execution record + the repo
  worklog.
- **S87-P8 (the LIVE battery + the screenshots)** — the fixed dev
  server probed side-by-side with the reference: the six KPI cards'
  DOM census (the Card>CardContent split, the label/value rows, the
  single-container sparks, the div bars with bg-classes, the gray-600
  suffix computed #4b5563), the six chart headers (the Pipeline bare
  + the five nested rows), the filter bar (the placeholders dead +
  the Filter button + the search input), the drawer at TRUE 390px
  (the full battery), zero overflow, the closing census MATCH + the
  reference md5-exact re-fetch. Screenshots 115 (the KPI row) + 116
  (a chart-card header + the filter bar) + 117 (the mobile drawer at
  390) NEW under `docs/screenshots/`, VLM-verified per the house
  protocol.

No new e2e: every fix surface is source/DOM-structural (the e2e
sparkline pin reads `.recharts-wrapper` + the "+5.3%" text — both
survive; no e2e pins the KPI card's inner divs, the bar tags, or the
filter-bar classes — verified by grep). The unit pins + the LIVE
DOM-census battery cover the family (the s78-s86 precedent for
structural rotations).

## Blast radius (pre-checked)

The pins that RE-ANCHOR in lockstep: the page-layout KPI_CARD.card
pin (the merged-div token retires → the split re-anchors to
KPI_CARD.content + the Card component's own base); the
dashboard-family-parity bars-arm pins (`arm.indexOf("flex h-8
items-end")` — the container moves to the KpiCard's sparkClassName;
the `flex-1 rounded-sm` regex — the bars construction gains the
barClassName template). SURVIVES untouched: KPI_SPARK.dashboard-
Container ("mt-2 h-8" — the token keeps its exact value), the
KPI_STATICS family + the dashboard-contracts statics, the
DELTA_TEXT tokens, the charts-internals isAnimationActive pin (no
animation props added), the reports-filter-parity KPI comments (the
chips/value/spark mentions — the CircleStatCard construction
unchanged beyond the slot's direct RC), the e2e family (the
sparkline + the "+5.3%" + the filter-bar text selectors + the mobile
suite). The GREEN-hazard sweep: the Sparkline className prop
retirement touches exactly 4 reports call sites + 0 dashboard sites;
the DeltaText string-arm tag change touches only the KpiCard (the
sole consumer); the KpiCard restructure is dashboard-only (the
reports' CircleStatCard + the leads/activities stat cards are
separate families); the header restructure is 6 call sites on the
dashboard page only; the reports' CircleStatCard slot loses its
intermediate div (computed-equal — the recharts surface measures
identical inside the flex-1 h-12 slot).

## The execution record (2026-10-09, session-87)

EXECUTED AS PLANNED, 4 anchor-side pin-shape repairs (1 at RED — the
view-switcher placeholder pin, unmirrorable by mechanism [the
reference's "Format" is dead only because its value is the FIXED
no-match constant "format"; our functional "" default would RENDER
it — the pin re-anchored to the documented empty adaptation]; 3 at
GREEN — the bars-arm slice anchor `<>`, the Filter-button
whole-file anchors, the KPI_SPARK slice window 1200 → 2000; the
fixes were all in place). RED: **25 failed | 1709 passed (1734
total)** at the pre-fix state — exactly the new suite's pin set +
ZERO collateral. GREEN: S87-P1..P8 all landed (P1 the KpiCard
restructure — Card > CardContent "p-4 sm:p-6" + the labelRow + the
BARE valueRow + the span value + the div delta/valueNote + the
suffix gray-600 [M-87c1]; P2 the content-only Sparkline — the bare
RC / the bare div bars with the bg-class template + the
sparkClassName slot + the reports' h-full retirement; P3 the chart
headers — the Pipeline bare stock + the five nested rows + the
Last-6-months literal; P4 the filter bar — the stage/source
placeholders + the bare sm:w-auto + the explicit pl-9 h-9; P5 the
vacuous tier row retired; P6 the suite at 25 its + the 3-file
lockstep re-anchors [page-layout KPI_CARD.card, dashboard-family ×3
pins, reports-filter LineChart]; P7 the docs at SKILL v1.84.0/
README 1865/AGENTS+CLAUDE+PAD 1733+132; P8 the LIVE battery + the 3
screenshots). GATE: lint 0/0 · tsc 0 · **1733/1733 unit (96 suites,
+24 net: +25 new − 1 vacuous-retired)** · build clean · **132/132
e2e on a fresh CI=1 boot (3.2m, FIRST run green — all 9 mobile-nav
checks green)**. LIVE (both apps probed): the suffix rgb(75,85,99)
gray-600 (was rgb(107,114,128)); the single-container spark with 7
DIV bars `flex-1 bg-cyan-400 rounded-sm` + the raw heights; the
card0 walk Card > p-4 sm:p-6 > [labelRow, valueRow, mt-2 h-8]
byte-exact vs the reference's LIVE walk; the six headers (Pipeline
bare stock, five nested rows); the filter bar trio (the bare
sm:w-auto, the pl-9 h-9 at 36px, the literal gray-500 span); the
drawer at TRUE 390px (full-bleed, the w-72 panel at left-0 computing
the reference's own sidebar blue rgb(37,99,235), 8 links, focus
inside, dual lock, navigate-close + released, closed inert+hidden);
zero overflow; the closing census MATCH + the reference md5-exact
re-fetched (the 58th consecutive stable session). Screenshots 115 +
116 + 117 NEW — VLM 5/5 + 4/4 + 3/4 (the one NO a prompt artifact,
DOM-disproven: the drawer panel mirrors the reference's own sidebar
blue exactly). Estimate drift: +24 net its exact · 132 e2e exact ·
the e2e-waits census unchanged at 5.
