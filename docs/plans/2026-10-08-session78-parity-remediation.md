# Session-78 Parity Remediation Plan (2026-10-08)

Session 78 on `main` @ `9966dbb` (the s77 ship `92bc235` + one
docs-only session-log commit — `docs/session_150.md`, ZERO code drift).
The workspace SURVIVED s77: the environment verified in place (`.env`
with `DATABASE_URL="file:../db/custom.db"` + the db/ folder at the repo
root; census MATCH 15/24/10/23/12 + 4 users). The documented intake
hazard STANDS (the platform `DATABASE_URL` override points at a
non-existent mirror; all session-78 repo operations run under
`env -u DATABASE_URL`). **Baseline gate on HEAD: lint 0/0 (enforced) ·
tsc 0 · 1495/1495 unit (86 suites) · playwright --list 132 in 4 files**
— the documented state exact; the `skills/` exclusion verified in all
three configs (eslint ignores + tsconfig exclude + vitest include-scope).

## The standing layers (74th session, NO DRIFT)

Drift sweep #74: the reference bundle fresh-fetched — size 1,631,071 +
md5 `a70a637fcf1d4291da8e0d965676dc11` **exact — the 49th consecutive
stable session**. Reference census #74 (agent-browser, live login at
1280 then a TRUE 390px viewport): the demo data still zero (the KPI
values 0/$0.0k/$0.0k/$0k/0%); the mobile-nav defect STANDS at a TRUE
390px (vw=390, nav w=0, 8 links in DOM, 0 visible, no hamburger);
desktop nav normal (256px, 8 links, all visible). Our mobile drawer
stays the deliberate documented superset.

## The audits (two parallel agents + the orchestrator's own fresh-eyes
rotation, every parity claim BUNDLE-DECODED against the fresh-fetched
reference, the bar construction additionally LIVE-PROBED on the
reference)

**78-a** — the s77 re-audit: **15/15 claims GENUINE** (every S77-P1..P13
fix at file:line; the counts corroborated by live runs [86 suites, 1495
its, playwright --list 132, tsc 0, lint 0/0]; the 92bc235 commit honest
[22 files, +1080/−144, zero strays]; 9966dbb docs-only). Five nano notes
(the path shorthands; the plan P5 line-citation :785→:789 drift; the
RED-phrasing ambiguity; the Loading-row text-muted note — the N-77c17
family deferral, not a regression; PAD:758's historical session-75 row).

**78-b** — the graduation audit: **ZERO graduations, 13/13 (the 35th
consecutive)**; the 8 mechanical censuses 7 CLEAN + **ONE finding**:
`neo-crm_SKILL.md:11` — the YAML frontmatter still reads `version:
1.73.0` + `last_updated: 2026-10-06` while the H1 (line 16) reads
v1.74.0: the s77 "stale version header repair" fixed the H1 but never
bumped the frontmatter field (the AGENTS:29 stale-count class). A
docs-phase fix (S78-P10). Both operator decisions' evidence INTACT.

**78-c** — the fresh-eyes rotation on the DASHBOARD FAMILY (the
session_149 suggested target — the dashboard's KPI-memo seams, never
re-rotated since the KPI_STATICS adjudication; `(app)/page.tsx` 676 +
`api/dashboard/route.ts` 199 + the KpiCard/Sparkline/BarStatCard arms
in page-parts + the KPI_STATICS/PIPELINE_LEGEND/TOP_REPS/FILTER_BAR
records + the store's dashboard slice): the foundations SOLID (the KPI
grid + the six statics arrays + the deltas, the filter-bar anatomy, the
charts' internals [grid dashes + $ tooltips + the default Legend], the
Top Reps construction, the Lead Sources checkbox rows, the Recent Deals
compact table + the duplicate-Status quirk, the legend chips with the
Won lookup-miss, the export family, the header trio, the tokens
[text-muted ≡ gray-500, text-subtle ≡ gray-400 — computed-equal]) —
the **N-78 family: 2 M + 3 L + 4 N**, every M/L claim re-decoded from
the fresh bundle (the Eke component: the g/p/m/b/y/x/_/A memos) and the
bar construction LIVE-PROBED on the reference itself:

- **M-78c1 CONFIRMED (live-probed)** — the KPI BAR-SPARK construction:
  the reference's Deals Closed / Revenue This Month / Sales Target cards
  render the spark as a STATIC BAR ROW — `mt-2 h-8 flex items-end gap-1`
  containing `flex-1 bg-cyan-400 rounded-sm` (LIVE-computed: 4px radius)
  divs whose heights are the RAW STATIC VALUES AS PERCENTAGES
  (`style={height: `${N}%`}` — LIVE-measured 40%/55%/45%/70%/60%/80%/75%
  on the 32px container: the max bar tops at 75% height, NOT 100%); the
  Sales Target pair carries inline `backgroundColor: i<4 ? "#fbbf24" :
  "#3b82f6"`. OURS normalizes (`Math.max((v/max)*100, 8)` — the max bar
  hits 100%, a 33% taller silhouette), adds `rounded-[2px]` (2px — one
  step off the reference's 4px), a `w-1.5` width class, and a
  `opacity: v > 0 ? 1 : 0.35` treatment the reference does not ship.
- **M-78c2 CONFIRMED (bundle-decoded)** — the FILTER-BAR RE-DERIVATION
  semantics: the reference's `p` memo (the opportunities filtered by the
  LIVE stage/source select axes — its owner state exists but no control
  ever sets it, dead) feeds **the Deals Closed + Revenue This Month KPI
  cards, the pipeline chart + its legend chips, the Top Reps list, AND
  the Recent Deals rows (the FULL list sorted updatedAt desc, slice 5)**.
  Total Leads / Conversion Rate / Avg. Sales Cycle read the UNFILTERED
  leads (l); the revenue chart reads the UNFILTERED opps (f); Lead
  Sources reads all leads; Upcoming reads the activities. OURS filters
  only the Recent Deals rows — and those from the route's PRE-SLICED
  top-5, so a stage with >5 matches shows fewer rows than the
  reference's full-list-slice-5. Invisible on the reference (its
  persistent zero data) but LIVE-VISIBLE on ours (12 seeded opps):
  picking a stage/source on the reference re-derives the KPIs + charts;
  on ours nothing moves but the table rows.
- **L-78c2 CONFIRMED (bundle-decoded, both component defs)** — the
  BarStatCard TWIN: the reference's zv (accounts) + gm (activities)
  stat cards use the SAME raw-percentage bar construction
  (`flex-1 rounded-sm` + `style={height: `${o}%`}` — the zv/gm arrays
  [50,60,55,70,65,75] etc. ARE the heights). OURS `pct()` normalizes
  to max + a 12% floor + an `opacity: v > 0 ? 1 : 0.4` arm — every bar
  33% taller than the reference's on all ELEVEN cards (accounts 5 +
  activities 6).
- **L-78c3 CONFIRMED (bundle-decoded, zero-data-invisible)** — the
  Recent Deals TRAILING cell: the reference renders a ghost icon
  MoreHorizontal button (`h-8 w-8`) in every row's trailing td; ours
  ships an empty `<td className="w-8" />`.
- **L-78c4 CONFIRMED (bundle-decoded)** — the UPCOMING window: the
  reference fetches its activities `list("-date", 10)` (top-10 by date
  DESC), filters `date >= now` CLIENT-side (NO status filter), slices
  THREE. OURS: all scheduled, orderBy dueAt ASC, slice(0,6).
- **L-78c5 CONFIRMED (bundle-decoded)** — the ACCOUNTS page's missing
  Loading row: the reference's accounts tbody renders the s77-leads
  ternary verbatim (`b ? colSpan-8 text-center py-8 text-gray-500
  "Loading..." : E.length===0 ? "No accounts found" : rows`) — the
  M-77c3 MISSED SIBLING (the s77 fix covered the leads page only).
- **N-78c6 CONFIRMED** — the Upcoming row subtext: the reference
  renders `related_to_name` (null renders empty); ours invents
  `a.relatedName ?? a.type`.
- **N-78c7 CONFIRMED** — the Recent Deals TBODY row classes: the
  reference ships `border-b hover:bg-gray-50` (solid #f9fafb); ours adds
  `text-xs text-muted` (cells override — computed-equal) +
  `transition-colors` + `hover:bg-line-soft/60` (≈#f9f9f9, a one-unit
  blue-channel miss). The computed-equal expression of gray-50 is our
  `--color-background` token (#f9fafb).
- **N-78c8 CONFIRMED** — the KPI_SPARK record's comment describes ALL
  dashboard sparks as "recharts MONOTONE curves" — STALE for the three
  bar cards (bar divs). The record gains a `bars` member documenting
  the reference's construction.
- **N-78c9 (78-b's finding)** — the SKILL frontmatter version/last_updated
  carriers (the H1 was repaired at s77; the frontmatter field was not).
- **N-78c10 (records only)** — 78-a's nano notes are bookkeeping (the
  historical plan line-citation stays as-written per the N-49a
  history-record precedent).

## The operator decisions (37th re-affirmation)

The **CSV formula-injection posture (b) STANDS** — the 78-b
re-verification: `guardFormulaPrefix` intact at csv.ts:31-33 applied in
`escapeCell` AND imported into entity-export.ts's `qq`; the `-`
exclusion documented; **ZERO new unguarded builders** (the 78-c
rotation re-verified the dashboard family end-to-end — its five export
affordances are the pre-existing s47 client-side builders routing
through the guarded `unquotedHeaderCsv`/`toQuotedCsv`/`entityDumpCsv`
seams; the route slim touches no CSV surface); the reference bundle
byte-stable for the 49th consecutive session; no new evidence moves the
(a) parity / (c) full-OWASP alternatives.

The **source-vocabulary documented parity STANDS AND EXTENDS to the
dashboard family** — the 78-b census re-confirmed every anchor at
file:line (both OPTIONS arrays pinned with the in-file posture
comments; NO enum-membership on the four validation sites; the settings
Capitalized defaults verbatim); the 78-c rotation decoded the
dashboard's vocabularies fresh (the filter bar's source select is the
raw 4-option set call/email/website/partner — NO Referral, matching
LEAD_SOURCE_OPTIONS; the stage select is the 5 OPP stages with the
PIPELINE_LABELS labels — both byte-verified). The M-78c2 change moves
DERIVATIONS, not vocabulary: wire values stay raw.

## The remediation set (TDD — RED first, then GREEN)

- **S78-P1 (M-78c1) — the Sparkline bars arm**: the bars render
  `flex-1 rounded-sm` spans with `style={{ height: `${v}%`,
  backgroundColor: colorFor ? colorFor(v, i) : color }}` — the RAW value
  as the percentage (the static arrays ARE the heights); the
  normalization + the 8% floor + the opacity arm + the w-1.5 +
  rounded-[2px] all retire; the empty-guard stays (the line/area arms
  keep their construction).
- **S78-P2 (L-78c2) — the BarStatCard twin**: `pct()` retires; the bars
  render the raw `style={{ height: `${v}%`, backgroundColor: barColor }}`;
  the 12% floor + the opacity arm retire. Computed-equal at the static
  arrays' shapes on all eleven cards.
- **S78-P3 (M-78c2) — the filter re-derivation**: the page destructures
  the store's `opportunities` slice (hydrated by the shell bootstrap)
  and gains the reference's `p` memo (`filteredOpps` = the opps filtered
  by the stage/source axes); the Deals Closed + Revenue This Month KPI
  cards, the pipeline chart + legend chips, the Top Reps list, and the
  Recent Deals rows (full-list sort updatedAt desc, slice 5, then the
  search superset narrows the shown rows) all derive from `filteredOpps`
  — the reference's g/m/y/_ memo split verbatim; Total Leads /
  Conversion Rate / Avg. Sales Cycle / Sales Target stay on the route's
  unfiltered `kpis` (the reference reads the unfiltered leads list for
  exactly those members — computed-equal at rest).
- **S78-P4 (M-78c2, the route slim)** — the route's now-unconsumed
  members retire (the dch wire-extra policy): `kpis.dealsClosedValue` +
  `kpis.revenueThisMonth` + `pipeline` + `topReps` + `recentDeals` +
  the `daysUntil` wire-extra (zero consumers repo-wide); the route keeps
  `kpis.{totalLeads, salesTarget, salesTargetProgress, conversionRate,
  avgSalesCycleDays}` + `revenueOverTime` (b — unfiltered) +
  `leadSources` (x) + `upcomingActivities` (A); the three DB reads all
  stay (leads/opps/activities — every remaining member needs them); the
  DashboardData type slims in lockstep.
- **S78-P5 (L-78c4 + N-78c6) — the Upcoming window**: the route fetches
  `orderBy: { dueAt: "desc" }, take: 10` (the `list("-date", 10)`
  mirror), drops the `status: "scheduled"` where (the reference filters
  only date >= now), keeps the in-route `dueAt >= now` filter, slices
  THREE; the row subtext renders `a.relatedName` bare (the `?? a.type`
  invention retires — null renders empty, the reference's own shape).
- **S78-P6 (L-78c5) — the accounts Loading row**: the accounts-page
  local `accountsLoaded` flag (the s77 `leadsLoaded` precedent verbatim
  — false until the page's `fetchAccounts()` resolves) + the tbody
  ternary `!accountsLoaded ? <TableEmptyRow colSpan={8}
  message="Loading..." /> : rows.length === 0 ? "No accounts found" :
  rows` (the cards-view branch keeps its own empty paragraph).
- **S78-P7 (L-78c3) — the Recent Deals trailing button**: every tbody
  row's trailing cell renders the ghost icon `MoreHorizontal` button
  (`h-8 w-8`, `aria-label="More actions"` — our accessible-superset
  convention), mirroring the reference's per-row affordance.
- **S78-P8 (N-78c7) — the row classes**: the tbody tr goes
  `border-b hover:bg-background` (the computed-equal of the reference's
  `hover:bg-gray-50` #f9fafb); the `text-xs text-muted` +
  `transition-colors` retire from the row (the cells carry their own
  classes; the thead tr keeps its own).
- **S78-P9 (N-78c8) — the KPI_SPARK record**: a `bars` member pins the
  reference's construction (`flex items-end gap-1` + `flex-1
  rounded-sm` + raw `%` heights); the stale "all sparks are recharts
  curves" comment re-derives (the line/area arms stay recharts).
- **S78-P10 (N-78c9, docs phase)** — the SKILL frontmatter
  `version: 1.73.0` → `1.75.0` + `last_updated` → `2026-10-08` (rides
  the §16br edit script, assert-first).

No new e2e this session: the family's standing gaps are covered (the
dashboard export/downloads + the Lead Sources rows + the seeded-KPI
smoke + the zero-skeleton pass all exist); the two timing-sensitive
surfaces (the accounts Loading row, the filter re-derivation) are
unit-pinned by the house convention (the s76/s77 precedents) and
LIVE-verified in the battery. The LIVE battery covers the filtered
re-derivation end-to-end (a stage pick re-derives the KPIs + the chart
+ the table on the seeded data).

## Blast radius (pre-checked)

The pins that RE-ANCHOR in lockstep: `tests/opportunity-model.test.ts`
:173-205 (TWO route pins — the dealsClosedValue/revenueThisMonth
derivation + the pipeline/topReps/recentDeals route pin — move to the
page's derivations with S78-P3/P4); `tests/dead-code-hygiene.test.ts`
:948 (the N-66j guard-before-Math.max pin — `Math.max` retires
entirely with the raw heights; the guard stays, the pin re-anchors to
the guard's presence + the max's ABSENCE). SURVIVES untouched: the
dashboard-contracts suite (the KPI statics pins read the page — the
Sales Target colorFor prop stays; the TopReps region pin reads "topReps"
which remains the local name; the Recent Deals Lead-cell pins; the
Upcoming Checkbox/hover/toLocaleDateString pins — the subtext change
keeps the row shape); stat-value-contract (the value forms stay bare);
charts-internals/charts-contracts (no chart-internal change);
dashboard-export (the builders untouched); the N-66c BarStatCard pin
(`backgroundColor: barColor` stays — only the height formula changes);
the e2e family (the dashboard smoke is shape-based; the accounts
"No accounts found" count assertions hold post-fetch — the Loading row
only renders mid-fetch; the 132 count unchanged). No pins on: the bar
heights, the p memo, the trailing button, the upcoming window, the
accounts loaded flag, the row classes.

## The execution record (2026-10-08, session-78)

EXECUTED AS PLANNED with NINE mid-flight pin-shape repairs (all caught
by the RED/GREEN runs themselves, the s77 class: mis-scoped regions —
the Cards-branch map vs the table map, the comment-above-the-export
window, the type-block boundary crossing into ReportsData's own
`pipeline:`, the needle-in-own-doc on the type's retirement comment)
+ the N-63b re-anchor (the route's `label: PIPELINE_LABELS[stage],`
line retired with the slim — the evidence re-anchored to the page's
memo) + ONE mid-flight e2e repair (the accounts Loading-row race: the
"No accounts found" toHaveCount(0) gate passes WHILE Loading shows —
both accounts e2e gates gained the deterministic
Loading-absence wait). RED: **26 failed exactly** (the
dashboard-family-parity suite's 23 + the 3 re-anchors [opportunity-model
×2 + dch ×1]). Non-vacuousness PROVEN at the pre-fix state (the
worktree held ONLY the test-file changes): the full suite ran
**26 failed | 1497 passed** — exactly the modified-pin set, ZERO
collateral. GREEN: S78-P1..P9 all landed (P1 the Sparkline bars arm —
raw `${v}%` heights, flex-1 rounded-sm, the normalization/floor/opacity
retired; P2 the BarStatCard pct twin; P3 the p memo + the five
client-side derivations + the unfiltered members staying on the route's
kpis; P4 the route slim [pipeline/topReps/recentDeals/dealsClosedValue/
revenueThisMonth/daysUntil retired; the three DB reads stay inside the
try; the type slims] + the leads-read's dead owner include retired;
P5 the upcoming window [orderBy dueAt desc, take 10, no status where,
slice(0,3)] + the relatedName-bare subtext; P6 the accountsLoaded flag
+ the colSpan-8 Loading ternary; P7 the trailing MoreHorizontal ghost
button; P8 the border-b hover:bg-background row classes; P9 the
KPI_SPARK.bars member + the mixed-family comment). GATE: lint 0/0 ·
tsc 0 · **1523/1523 unit (87 suites, +28)** · build clean · **132/132
e2e on a fresh CI=1 boot (3.2m; the first run caught the accounts
Loading-row race — the two gates repaired, the re-run green; all 9
mobile-nav checks green)**. LIVE: the KPI bars computing byte-identical
to the reference (heights 40%/55%/45%/70%/60%/80%/75%, radius 4px, the
first bar 12.7969px on the 32px rail — the SAME number the reference's
live probe measured); the filter re-derivation round-trip (Prospecting
→ Deals Closed $337.0k→$0.0k + Revenue $126.0k→$0.0k + the pipeline 5
bars→1 + Recent Deals 5→2 rows + topReps emptied, the unfiltered 24/
29.2%/83 unchanged; All Stages restores); the trailing buttons 5/5
(32px); the row class `border-b hover:bg-background` with
bg-background = rgb(249,250,251) = the reference's gray-50; the
accounts Loading row OBSERVED via MutationObserver then 10 rows; the
Upcoming card rendering the reference's 3-furthest-DESC construction
(10/16, 10/13, 10/12 — the old code's 6-soonest-asc was a live-visible
divergence the seed data exposes); Lead Sources slice(4); the drawer at
TRUE 390px (full-bleed panel, 8 links, focus inside, body locked;
Escape → inert + hidden + unlocked); zero overflow on all ten routes
(both Dashboard casings); NO Tailwind v4 bug (blur 4px + the shadow-sm
re-pin + rounded-sm 4px computing); the closing census MATCH (256px/8
visible). Screenshots 95 (the KPI bar sparks) + 96 (the Won-filter
re-derivation contrast state) NEW — VLM 5/5 PASS + 3/5 with BOTH flags
run down (the legend-chips flag was the prompt's own wrong assumption —
the reference renders ALL FIVE chips from the m memo, DOM-verified; the
trailing-button flag a VLM-scale artifact — DOM 4/4 in the Won state).
Docs: SKILL v1.75.0 (§16br + project_state, 6991 → 7065, via the
assert-first scripts/skill_edits_s78.py at the sandbox root + the
FRONTMATTER REPAIR [78-b's finding: version 1.73.0/2026-10-06 →
1.75.0/2026-10-08 — the field never rode a bump since s76]) + README
badge 1655 + AGENTS/CLAUDE/PAD at 1523+132 (+ the PAD s78 inventory
row) + session_151.md + this record + the repo worklog;
.env/.env.example verified (no env surface change; DATABASE_URL
file:../db/custom.db with db/ at the repo root). Estimate drift: +28
its exact (the new suite) · 132 e2e exact · the e2e-waits census
unchanged at 5 (no new waits — the two gate repairs are
expect-waits).
