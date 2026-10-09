# Session-89 Parity Remediation Plan (2026-10-09)

Session 89 on `main` @ `e5f33f2` (the s88 ship `d7487ad` + the two
docs-only session-log commits `4ac9a08`/`e5f33f2` — `session_174.md`
the process narrative + `session_175.md` the operator-added extended
narrative). The workspace SURVIVED s88 (the pull fast-forwarded
4ac9a08 → e5f33f2, docs-only; the environment verified intact without
a rebuild: node_modules present; `.env` with
`DATABASE_URL="file:../db/custom.db"` + a live `AUTH_SECRET`;
`.env.example` matching; `db/custom.db` + `db/e2e.db` present; the
census MATCH 15/24/10/23/12 + 4 users; vitest + playwright configured;
the `skills/` exclusion verified; the sitemap/robots/manifest handlers
standing). The platform `DATABASE_URL` override hazard STANDS — all
session-89 repo operations run under `env -u DATABASE_URL`.

**Baseline gate on HEAD: lint 0/0 · tsc 0 · 1750/1750 unit (97 suites,
re-run live) · build + e2e deferred to the post-fix gate** (the
one-gate discipline; both audit subagents re-ran the full unit suite
live at HEAD: 97 files / 1750/1750 green).

## The standing layers (85th session, NO APP DRIFT)

Drift sweep #85: the APP bundle re-fetched fresh from the reference
and served byte-identical — `/assets/index-DZ-xbrIm.js` 1,631,071
bytes md5 `a70a637fcf1d4291da8e0d965676dc11` exact + the stylesheet
`index-Be9epoFc.css` 79,581 bytes exact — **the 60th consecutive
stable session**. The login HTML still rides the `/static/*` platform
shell; the LIVE app post-login loads ONLY the old `/assets` pair.
Reference census #85 (agent-browser, live login + a TRUE 390px
viewport): the demo data still zero (the $0.0k KPI family); the
mobile-nav defect STANDS at a TRUE 390px (vw=390, nav w=0, 8 links in
DOM, 0 visible, no mobile menu — the 10th consecutive census);
desktop nav normal (256px, 8 links). Our mobile drawer stays the
deliberate documented superset (the LIVE battery re-verifies
post-fix). Scandihaven re-verified as the tech-stack-patterns
reference (up to date; the same Next.js 16 + React 19 + Tailwind v4
CSS-first family — no new patterns to adopt).

## The audits (two parallel subagents + the orchestrator's own fresh-eyes rotation, every parity claim decoded from the byte-stable 1.63MB reference bundle + LIVE-probed on BOTH apps)

**89-a** — the s88 re-audit: **13/13 checklist items GENUINE, ZERO
material findings** (every s88 fix verified at exact file:line: the
92-token palette block at globals.css:170-261; the Activity icon at
contacts-page.tsx:607; the Award pair :427/:573; the Source
capitalizer :1016/:1021; the IconStatCard contacts-arm split at
page-parts.tsx:379-401; the RAW export binding :380; the mr-[500px]
:357; the bare mobile badge :735; the describe title + the stale
comment + the 116 re-capture; the 17-it suite re-run live 17/17; the
doc carriers at v1.85.0/1882/1750+132; the full unit gate re-verified
live 97/1750). 2 nanos: **N-89a1** — the PAD:780-781 counting-convention
footnote still reads "96 Vitest suites with 1733 checks" under the
correctly-bumped Total row :771 (the s88 doc pass missed the footnote
10 lines below; the N-86a1 footnote genus); **N-89a2** — the
api-robustness.test.ts:393 comment "must be GONE from all nine route
files" while the FK_SITES array :395-413 carries 10 rows (the 10th
added at s42; the count-in-comment genus, pre-existing — NOT s88).

**89-b** — the graduation audit: **ZERO graduations, 13/13 (the 46th
consecutive)** — every standing-ledger rationale verified UNCHANGED at
HEAD (fresh line evidence inside the s88-rewritten regions where
relevant). The 8 mechanical censuses **8/8 CLEAN** (the localStorage
2-key set; public/ og-image only; the 19/19 deps; the 27-route/
39-handler API census; the 3-var env parity; the doc anchors at
1750+132/1882/v1.85.0; zero commented-out code; the 5 annotated e2e
sleeps + the mobile-nav suite intact at 9). Both operator decisions'
evidence INTACT. 1 nano: **N-89b1** = the same PAD footnote (N-89a1).

**89-c** — the fresh-eyes rotation on the **LEADS STAT-CARD FAMILY**
(the remaining standing alternate per session_173.md's suggested
next): the reference's `Sm` component FULLY decoded from the
byte-stable bundle (the whole component + all six call sites + the H
KPI memo + the alias identities Wc/op/MB/BQ/nJ/qd resolved at their
tr() lines) + the LIVE stat-card grid walked on the reference at 1440
AND 390 + our dev server probed side-by-side.
**The N-89 family: 1 M + 2 L + 4 N** (+ the 3 audit nanos above):

- **M-89c1 — THE VALUE COLOR.** The reference's Sm value span is
  `text-xl sm:text-2xl font-bold text-gray-900` → LIVE rgb(17,24,39)
  #111827; OURS ships the bare `text-xl sm:text-2xl font-bold`
  inheriting the page ink #0a0a0a rgb(10,10,10) — LIVE-verified on
  BOTH apps at BOTH widths (1440 + 390: same 20px/12px sizes, the
  358px cards identical — only the color diverges). The F-69a1 s69
  pin's own comment CITED the reference's `text-gray-900` but shipped
  the bare form calling the color "carried by the palette token" — a
  misdecode the LIVE probe now resolves (the M-87c1 suffix-color
  genus: the value family's own missed sibling). Note the DASHBOARD
  KPI values are BARE on the reference too (LIVE rgb(10,10,10) on
  both apps — the s87 form is correct); the gray-900 explicit class
  is the LEADS Sm family's own.
- **L-89c2 — THE CARD SPLIT (the merged-padding genus, the LAST
  stat-card arm).** The reference's Sm: `Card` (the stock ot, BARE —
  NO className, no gradient) > `CardContent` className="p-4 sm:p-6"
  > [the label row, the value column]. OURS ships ONE merged div
  (`rounded-xl border border-line bg-surface p-4 shadow sm:p-6` —
  the padding ON the card) — the exact L-87c3 (KpiCard) / L-88c5
  (contacts IconStatCard) genus; the leads arm is the last
  stat-card arm standing. The stock Card renders
  `rounded-xl border border-line bg-surface shadow` (our documented
  token adaptations of the reference's `rounded-xl border bg-card
  text-card-foreground shadow` — computed-equal).
- **L-89c3 — THE CHIP CONSTRUCTION.** The reference's chip is a
  GUARDED DIV — `i && c.jsx("div", {className: \`w-8 h-8 sm:w-10
  sm:h-10 rounded-lg flex items-center justify-center ${s[a]}\`})`
  — NO shrink-0, NO aria-hidden, width-first class order, and the
  `color` prop DEFAULTS "blue". OURS renders an unguarded SPAN with
  `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
  sm:h-10 sm:w-10` + `aria-hidden="true"` — the exact L-88c5-retired
  extras persisting on this arm (the s88 fix's missed sibling), plus
  the height-first order + no default tone.
- **N-89c4 — XCircle → CircleX.** The reference's fourth icon is
  `BQ=tr("CircleX")` — ours imports the deprecated `XCircle` alias
  (the same circle-x glyph on both sides —
  node_modules/lucide-react/dist/esm/icons/x-circle.js re-exports
  circle-x; the source-parity mirror, the N-84c6 genus).
- **N-89c5 — THE DEAD TREND MECHANISM.** The reference's Sm ships a
  THIRD data row no call site exercises (dead in the reference —
  all six Sm calls pass title/value/Icon/color only):
  `n !== void 0 && div.flex items-center gap-1 mt-2 text-xs
  ${n>=0 ? "text-green-600" : "text-red-600"}` >
  [TrendingUp|TrendingDown `w-3 h-3` + `span{Math.abs(n)}%`] — the
  trend prop a NUMBER (signed percent), the sign picking BOTH the
  row color and the icon direction, the value Math.abs-rendered with
  a "%" suffix. Our leads arm lacks the mechanism entirely (the
  shared `trend` prop is the contacts arm's React.ReactNode form).
  Mirrored: the shared prop widens `React.ReactNode | number`; the
  leads arm consumes `typeof trend === "number"` per the Sm decode —
  zero behavioral delta (the identical undefined guard).
- **N-89c6 — THE LUCIDE SVG aria-hidden SUPERSET (documented).**
  lucide-react 0.525 injects `aria-hidden="true"` on every icon
  lacking an a11y prop (Icon.js: `...!children && !hasA11yProp(rest)
  && { "aria-hidden": "true" }`) — every icon in OUR app renders the
  attribute where the reference's older lucide renders bare svgs
  (LIVE: our chip svg carries it; the reference's does not). A
  family-wide library-version delta, an a11y IMPROVEMENT, not
  removable without forking the pinned stack — documented per the
  S33-P1/S47-P1 superset convention (a comment at the icon family's
  own module + the SKILL note). The s87/s88 chip fixes retired the
  WRAPPER-level aria-hidden; this documents the LIBRARY-level one.
- **N-89c7 — THE subValue TRUTHY GUARD.** The reference renders
  `r &&` (truthy); ours `subValue !== undefined` — behaviorally
  equal on every real input (the subValues are always non-empty
  `$…` strings); the guard mirrors for source parity (the s85
  N-85c5 date-guard precedent), folded into the L-89c2 mirror.

**The foundations verified SOLID** (no fix needed): the six KPI
derivations (the H memo decoded — totalLeads = the FILTERED list's
length; openLeads = new+contacted+qualified; won/lost strictly by
status; conversionRate = the toFixed(1) form with the 0 fallback;
avgCycle = the Math.round mean of the Math.floor day-ages over won
— ours matches expression-for-expression); the grid token
(PAGE_KPI_GRIDS.leads — LIVE-matched on the reference); the
STAT_CHIP_PAIRS six class pairs (s77); the labels (text-gray-600);
the subValues' raw `$${toLocaleString()}` forms; the icons'
responsive `w-4 h-4 sm:w-5 sm:h-5` classes; the 390px geometry
(358px cards, 20px values, 12px labels — identical on both apps);
the identities Wc=TrendingUp / op=Target / MB=CircleCheckBig /
nJ=Percent / qd=Calendar (the blank-body calendar — the L-84c5 fix's
sibling already correct here); the export (the U decode re-confirmed
the 8-column filtered-row basis).

## The operator decisions (49th re-affirmation)

The **CSV formula-injection posture (b) STANDS** — the 89-b
re-verification: `guardFormulaPrefix` intact at csv.ts:31-33 applied
in `escapeCell` AND imported into entity-export.ts's `qq` (:24/:43);
the `-` exclusion documented; ZERO new unguarded builders (the full
call-site census re-verified — settings ×7, dashboard ×4,
accounts/contacts/leads ×1 each, reports ×2, api/export ×1 — all
routing through the central guarded builders; this session touches
no CSV surface). The **source-vocabulary documented parity STANDS**
— every anchor re-confirmed at file:line by 89-b (the 7 *_META maps
+ the raw-slug vocab arrays byte-stable; constants.ts untouched by
the s88 delta; this session introduces no vocabularies).

## The remediation set (TDD — RED first, then GREEN)

- **S89-P1 (M-89c1 + L-89c2 + L-89c3 + N-89c5 + N-89c7)** — the
  IconStatCard leads-arm mirror in src/components/shared/page-parts.tsx:
  the arm renders `<Card>` (bare — no gradient/className) >
  `<CardContent className="p-4 sm:p-6">` > the label row
  (`div.flex items-center justify-between mb-2` > the label span +
  the chip) > the value column (`div.flex flex-col` > the value span
  `text-xl sm:text-2xl font-bold text-gray-900` + the truthy-guarded
  subValue + the number-trend row). The chip: the icon-guarded DIV
  with the reference's own template `` `w-8 h-8 sm:w-10 sm:h-10
  rounded-lg flex items-center justify-center
  ${STAT_CHIP_PAIRS[chipTone]}` `` (chipTone defaults "blue" — the
  reference's own `color="blue"` default; the span/shrink-0/
  aria-hidden retire). The trend mechanism: the shared prop widens
  `React.ReactNode | number`, the leads arm consumes the number form
  (the sign-colored row + the w-3 h-3 icon + the Math.abs "%" span),
  the contacts arm keeps the node form untouched. The arm's comment
  block re-derives (the s77 note + the s89 construction mirror).
- **S89-P2 (N-89c4)** — the leads-page import: `XCircle` →
  `CircleX` (the import list + the one call site at :426).
- **S89-P3 (N-89a1/N-89b1 + N-89a2)** — the PAD:781 footnote
  re-derives to the s89 counts; the api-robustness:393 comment
  "nine" → "ten" (the live FK_SITES row count).
- **S89-P4 (N-89c6)** — the lucide aria-hidden superset comment at
  src/components/ui/icons.tsx (the icon family's own module):
  the library injects aria-hidden on every a11y-prop-less icon,
  the reference's older lucide renders bare svgs, our pinned 0.525
  keeps it — documented per the S33-P1/S47-P1 convention.
- **S89-P5 (the tests)** — the NEW
  `tests/leads-statcard-parity.test.ts` RED-first pin suite: the
  card-split pin (Card > CardContent "p-4 sm:p-6" in the leads arm +
  the no-merged-padding negative — no `p-4 shadow sm:p-6` card
  string); the chip pin (the guarded DIV + the exact width-first
  template + STAT_CHIP_PAIRS consumption + the default "blue" + the
  no-shrink-0/no-aria-hidden/no-SPAN negatives); the value pin
  (the `text-gray-900` form + the rgb(17,24,39) LIVE note); the
  trend-mechanism pin (the typeof-number guard + the sign classes +
  the w-3 h-3 icons + the Math.abs "%" span + the dead-in-reference
  note); the subValue truthy-guard pin; the CircleX pin (the import
  + the no-XCircle negative). Plus the LOCKSTEP re-anchors:
  stat-value-contract.test.ts F-69a1 (the positive string gains
  `text-gray-900`; the negatives survive); leads-family-parity:219
  (the arm window re-anchored past the grown comment block if it
  bleeds — the assertions must scan the CODE, not the prose).
- **S89-P6 (the docs)** — SKILL v1.86.0 (§16cc + project_state +
  the H1 in lockstep, via the assert-first
  scripts/skill_edits_s89.py at the sandbox root) + README badge +
  the suite list + AGENTS/CLAUDE/PAD at the new counts (+ the PAD
  s89 inventory row + the Total row + the :781 footnote fix) +
  session_176.md + this plan's execution record + the repo worklog.
- **S89-P7 (the LIVE battery + the screenshots)** — the fixed dev
  server probed side-by-side with the reference: the value color
  rgb(17,24,39) (was rgb(10,10,10)); the Card > CardContent walk;
  the chip DIV with no shrink-0/aria-hidden; the 390px geometry
  (358px cards, 20px/12px type — unchanged); the drawer at TRUE
  390px (the full battery); zero overflow; the closing census MATCH
  + the reference md5-exact re-fetch. Screenshots 121 (the leads
  stat cards post-fix) + 122 (the leads family — the table + the
  toolbar) + 123 (the mobile drawer at 390) NEW under
  `docs/screenshots/`, VLM-verified per the house protocol.

No new e2e: every fix surface is source/DOM-structural or a color
value (the e2e selectors are role/text/testid — no color or chip
assertions; the "Total Leads" text test survives the DOM change; the
mobile-nav suite untouched). The unit pins + the LIVE DOM-census
battery cover the family (the s78–s88 precedent for structural
rotations).

## Blast radius (pre-checked)

The leads-arm changes touch the LEADS arm of IconStatCard only (the
contacts arm's s88 pins survive untouched — the arm bodies are
separate branches; CircleStatCard/BarStatCard untouched). The
consumers: the leads page's six call sites (no prop changes —
chipTone/trend/subValue APIs stay compatible; the XCircle→CircleX
import swap is type-identical). The locked pins re-anchoring:
stat-value-contract F-69a1 (planned) + leads-family-parity:219's
1400-char arm window (checked; re-anchor if the window bleeds past
the grown arm). The surviving pins verified: s77's STAT_CHIP_PAIRS
six pairs + the label/subValue forms + the call-site tone keys +
the raw $ subValues (all read strings that don't change);
STAT_SHADOWS (documentary token — the Card keeps the bare shadow);
page-layout's grid token + PAGE_HEADER; the e2e family (text
selectors only). The trend prop widening touches the shared prop
type — the contacts arm's four call sites pass nodes (ReactNode
assignable to the union — zero call-site changes).

## The execution record (2026-10-09, session-89)

EXECUTED AS PLANNED, 3 mid-flight pin-shape repairs (the subValue
parens form — the code now renders the `{subValue && (` wrapping
form; the Math.abs pin re-derived to the JSX-children form — the
reference's own `children:[Math.abs(n), "%"]` array, never a
template literal, so the pin asserts `{Math.abs(trend)}%` and
negates the `${…}` form; and the CircleX import comment reworded
off the retired alias token — the negative pin must not trip on the
prose that names the retired thing). RED: **10 failed | 1749
passed (1759 total)** at the pre-fix state — exactly the modified
pin set (the new suite's 9 + the F-69a1 re-anchor), ZERO
collateral. GREEN: S89-P1..P7 all landed (P1 the IconStatCard
leads-arm mirror — Card (bare) > CardContent "p-4 sm:p-6" + the
icon-guarded width-first chip DIV with chipTone defaulting "blue" +
the gray-900 value + the truthy subValue guard + the number-trend
mechanism via the shared prop union; P2 the CircleX import; P3 the
PAD footnote + the api-robustness "ten" comment; P4 the lucide
aria-hidden superset doc at icons.tsx; P5 the 9-it suite + the
F-69a1 + leads-family-parity arm-window re-anchors; P6 the docs at
SKILL v1.86.0/README 1891/AGENTS+CLAUDE+PAD 1759+132; P7 the LIVE
battery + the 3 screenshots). GATE: lint 0/0 · tsc 0 · **1759/1759
unit (98 suites, +9 net)** · build clean · **132/132 e2e on a
fresh CI=1 boot (3.2m, FIRST run green; the mobile-nav suite
re-verified standalone)**. LIVE (both apps probed): the value
rgb(17,24,39) (was rgb(10,10,10)); the Card > CardContent walk; the
chip DIV with no shrink-0/aria-hidden; the circle-x glyph; 0 trend
rows; the 390px state at 358px cards + 20px values + zero
overflow; the drawer at TRUE 390px (full-bleed, the w-72 panel at
left-0 computing the sidebar blue rgb(37,99,235), 8 links, focus
inside, dual lock, navigate-close + released, the closed root
inert + visibility:hidden + pointer-events:none); the closing
census MATCH + the reference md5-exact re-fetched (the 60th
consecutive stable session). Screenshots 121 + 122 + 123 NEW (VLM
5/5 + 2/4 RAW / 4/4 effective [the Filters NO a below-the-fold
framing artifact, DOM-disproven; the badges NO a prompt-premise
error — the status column IS the reference's inline-select family,
the colored SOURCE badges confirmed] + 3/4 [the one NO a VLM-scale
artifact — the dimming IS the DOM-verified overlay]); the 122 first
capture was byte-identical to 121 (the N-88b1 window-scroll genus
on this app's main-scroller architecture) — re-captured via the
real main scroller. Estimate drift: +9 net its exact · 132 e2e
exact · the e2e-waits census unchanged at 5.
