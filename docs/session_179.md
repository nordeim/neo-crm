# Session 179 — the session-90 formal log (2026-10-09)

## Intake

The workspace survived session 89 — the pull fast-forwarded
`706c4ea` → `469cd14` (docs-only, `docs/session_178.md`, the
operator-added process narrative of the same session-89 work). The
environment verified intact without a rebuild (census MATCH
15/24/10/23/12 + 4 users; `.env`/`db`/configs all standing; the 123
screenshots present). Baseline gate: lint 0/0 · tsc 0 · 1759/1759
unit (98 suites).

Core docs re-absorbed: AGENTS.md, CLAUDE.md, README/PAD structure,
the SKILL frontmatter + project_state + §16cc, session_177.md +
session_178.md + the s89 plan + the worklog tail. Session 89 shipped
at `216363c` (+ the narrative commits); my task is **Session 90** —
the activities/calendar table-family chrome, the first-listed
standing alternate per session_176.md's suggested next.

Scandihaven re-verified as the tech-stack-patterns reference (up to
date; the same family — no new patterns).

Drift sweep #86 CLEAN — the bundle re-fetched fresh post-login and
served byte-identical (md5 `a70a637f…` exact, the 61st consecutive
stable session). Reference census #86: demo data zero · desktop nav
normal (256px/8) · the mobile-nav defect STANDS at TRUE 390px (nav
w=0, 0 visible links, no menu — the 11th consecutive census).

## The audits

Both audit subagents ran in parallel per the house pattern:

- **90-a** — the s89 re-audit: **13/13 GENUINE, zero material
  findings** (every s89 fix verified at exact file:line; the 9-it
  suite re-run live 9/9; the full unit gate re-verified live
  98/1759). The one-shot count-in-comment sweep (the s89 suggested
  nano genus): **2 nanos** — N-90a1 (README:55 "the bare KPI-value
  forms on all FIVE stat-card families" — the phrase dates from
  s70; the live census is 3 bare + 4 explicit post-s89) and N-90a2
  (stat-value-contract:68 the it title "renders the bare text-3xl
  form" while its own pin asserts the explicit gray-900 since s75).
- **90-b** — the graduation audit: **ZERO graduations, 13/13 (the
  47th consecutive)**; the 8 mechanical censuses **8/8 CLEAN** (the
  localStorage 2-key set; public/ og-image only; the 19+11 deps; the
  27-route/39-handler API census; the 3-var env parity; the doc
  anchors at 1759+132/1891/v1.86.0; zero commented-out code; the 5
  annotated e2e sleeps + the mobile-nav suite at 9). Both operator
  decisions' evidence INTACT.

The operator decisions re-affirmed (50th): the **CSV
formula-injection posture (b) STANDS** (the guard at csv.ts:31-33 +
entity-export.ts:24/:43; the full call-site census — settings ×7,
dashboard ×4, accounts/contacts/leads ×1 each, reports ×2,
api/export ×1 — ZERO unguarded builders; this session touches no
CSV surface); the **source-vocabulary documented parity STANDS**
(no vocabularies introduced; `git diff d7487ad..HEAD --
src/lib/constants.ts` was empty at intake).

## The rotation (90-c)

The table/priority/timeline/rail surfaces walked LIVE on the
reference first and verified SOLID (the s6/s7/s16/s23/s27/s73/s76
layers hold — the priority card's one-region p-4 border-b anatomy,
the timeline card, both filter rails, the by-type card, the calendar
month card + Upcoming/Agenda + the rail, all byte-matching). Then
the stat-card family: all four reference components decoded from
the byte-stable bundle (gm/zv/Mx/ay — the whole components + all
twenty call sites + the color-key mechanism) + LIVE-probed on BOTH
apps at 1440 and 390.

**The N-90 family: 2 M + 4 L + 4 N** (+ the 2 audit nanos):

- **M-90c1 — THE CALENDAR VALUE COLOR.** The reference's Mx value =
  `text-2xl font-bold text-gray-900` → LIVE rgb(17,24,39); ours
  bare → rgb(10,10,10). The F-70a1 s70 pin's own comment CITED the
  gray-900 + its LIVE color and then shipped the bare form on the
  FALSE "inherited card foreground" premise — the M-89c1 misdecode
  genus on the calendar arm.
- **M-90c2 — THE REPORTS VALUE COLOR.** The ay value carries the
  same explicit gray-900 (LIVE rgb(17,24,39)) — the s74 comment's
  own citation finally landed.
- **L-90c3 — THE CARD SPLIT ×3.** BarStatCard's merged div,
  TrendStatCard's plain-div pair, CircleStatCard's merged
  reportsCard — all → Card > CardContent ("p-4" ×2 / "p-5" + the
  border/hover className on reports). The s89 "closing the
  merged-padding genus across EVERY stat-card arm" claim was
  OVERBROAD — these three components were standing.
- **L-90c4 — THE BAR CONSTRUCTION.** The reference's bars are DIVs
  carrying the per-arm bg-CLASS color map + the raw-percentage
  inline height ONLY (gm: blue/green/red/cyan else-GRAY, rounded-sm
  AFTER; zv: blue/green/cyan/red else-PURPLE, rounded-sm BEFORE).
  Ours rendered SPANs with inline backgroundColor hexes. The
  CHART_COLORS -400 family + gray retired with zero key-reads.
- **L-90c5 — THE CHIP MECHANISM ×2.** The reference's Mx/ay chip:
  the `w-10 h-10 rounded-lg ${bg-50} flex items-center
  justify-center` DIV with the icon rendered DIRECTLY carrying
  `w-5 h-5 ${text-600}` applied BY the component (the icon a
  component reference, the color a KEY). The nested chipIcon span,
  the SPAN chip, the inline bg style, the shrink-0/aria-hidden
  extras and the hex-keyed KPI_CHIP_BG/KPI_ICON_TEXT maps all
  retired.
- **L-90c6 — THE DELTA/TREND ROW.** The DIV `flex items-center
  gap-1 text-xs ${up?green-600:red-600}` rows with the width-first
  w-3 h-3 icons + the bare span (up/down only; the muted arm and
  the wrapper aria-hidden retired); the ay row uniquely carries
  font-medium — dead on the reference (no call site passes trend).
- **N-90c7-c10** — the label-row gap-2 extra; the gm/zv
  value-column arm split (gm wraps [value, subValue]
  unconditionally, zv renders the value direct); the
  CircleStatCard label P/text-muted → DIV/text-gray-500 mb-1; the
  calendar rail's bare span "Filters" wrapper.
- **S90-P0 — THE PALETTE PRE-REQ.** The mirror introduces
  bg-red-400 + bg-purple-400 — the (family, step) pairs the s88
  re-pin never covered (our bars rode inline hexes). The @theme
  block extends with red-400 #f87171 + purple-400 #c084fc (the
  reference's compiled v3 values, byte-verified in its stylesheet);
  the literal census 92 → 94 tokens.

The foundations verified SOLID: the six gm/zv KPI derivations, the
KPI_STATICS literal family, the reports call-site colors + icons +
the won-inline/lost-subtitle split, the spark slots, the s78
raw-percentage heights, both rails, the e2e family (text/role
selectors — zero blast).

## The remediation (TDD)

The plan (docs/plans/2026-10-09-session90-parity-remediation.md)
validated against the codebase, then RED-first: the NEW
`tests/statcard-family-parity.test.ts` (30 its) + 10 lockstep
re-anchors across stat-value-contract/page-layout/
activities-calendar-parity/reports-filter-parity/
dashboard-family-parity. **Non-vacuousness PROVEN: 40 failed |
1748 passed (1788 total)** — exactly the modified pin set, ZERO
collateral.

GREEN: S90-P0 the palette extension; S90-P1 the BarStatCard mirror
(the Card split + the per-arm color maps BAR_BG_GM/BAR_BG_ZV + the
arm split + the DIV bars + the trend/trendValue props + the
DeltaBadgeText row re-derivation); S90-P2 the TrendStatCard mirror
(the gray-900 value + the direct-icon chip + the TREND_CHIP pairs);
S90-P3 the CircleStatCard mirror (the Card className + the p-5
CardContent + the gray-900 value + the REPORT_CHIP pairs + the dead
font-medium trend row + the truthy subtitle); S90-P4 the calendar
rail span; S90-P5 the audit nanos; the call sites — activities 6
(the ActivityStatCard wrapper retired), accounts 5 (the zv arm),
calendar 4, reports 5 (the icon component refs + the color keys);
the page-layout retirements (the STAT_CARD family + the two hex
maps + the CHART_COLORS -400 family). 6 mid-flight pin-shape
repairs (the needle-in-own-docs class ×2, the prettier-wrap regex,
the wrong-file label read, the sparkline-stroke negative, the
reference's up-first ternary order) + 6 lockstep re-anchors the
full-suite collateral sweep surfaced (dead-code-hygiene ×2,
reports-page-parity ×2, constants, contacts-family-parity — the
census 92 → 94).

**FULL GREEN: lint 0/0 · tsc 0 · 1788/1788 unit (99 suites, +29
net) — ZERO collateral.**

## The gate + the LIVE battery

**GATE FULLY GREEN: lint 0/0 · tsc 0 · 1788/1788 unit (99 suites) ·
build · 132/132 e2e fresh CI=1 (3.3m; one settings-debounce timing
flake on the first run — the known-sensitive test, untouched by
this session's delta — passed standalone AND on the full re-run;
the mobile-nav suite re-verified inside the run).**

The LIVE battery on the fixed dev server: the calendar value now
computes **rgb(17,24,39)** (was rgb(10,10,10)) — M-90c1 FIXED; the
reports value **rgb(17,24,39)** — M-90c2 FIXED; the Card >
CardContent walks byte-mirroring the reference on all three
components; the bars are DIVs with every new palette pin computing
the reference's compiled v3 values (bg-blue-400 rgb(96,165,250),
bg-red-400 rgb(248,113,113), bg-purple-400 rgb(192,132,252),
bg-gray-400 rgb(156,163,175)); the chips render the icons directly
with the pair classes; the activities/accounts values stay bare
rgb(10,10,10) (the reference's own form); the 390px state at 358px
cards + zero overflow; the drawer at TRUE 390px (the w-72 panel
computing the sidebar blue rgb(37,99,235), 8 links, focus inside,
dual lock, navigate-close, the closed root inert + hidden +
pointer-events none). The closing census MATCH + the reference
md5-exact re-fetched (the 61st consecutive stable session).

The screenshots — 124 (the calendar stat cards, the Mx mirror),
125 (the activities stat cards, the gm mirror), 126 (the open
mobile drawer at 390). All three distinct. VLM: 124 = **5/5**;
125 = **4/4**; 126 = **4/4** — zero adjudications needed.

## The docs + the ship

Docs realigned via the assert-first scripts/skill_edits_s90.py (18
anchored edits): SKILL v1.87.0 (§16cd + project_state + the H1),
README badge 1920 + the count prose + the suite list, AGENTS/CLAUDE
at 1788, PAD at 99/1788 (+ the s90 inventory row + the Total + the
footnote), session_179.md (this log), the plan's execution record,
the repo worklog. Final verification after the doc edits: lint 0/0
+ 1788/1788.

**Session 90 delivered — the stat-card construction family closed
for real this time:** two LIVE-VISIBLE color bugs the prior
sessions' own comments had cited and explained away (the M-89c1
misdecode genus on the calendar + reports arms), plus the whole
construction family (the merged cards, the SPAN bars with inline
hexes, the nested chip spans, the SPAN delta rows) — now
byte-exact against the reference's own gm/zv/Mx/ay, with the
palette re-pin extended for the two newly-used bg classes, 13/13
ledger zero graduations for the 47th consecutive session, both
operator decisions standing (the 50th re-affirmation), the
reference bundle stable for the 61st consecutive session.

**Suggested next (session 91):** the full-app screenshot diff
against the reference (the strong sweep — with every stat-card arm
now construction-exact, the diff should be colors-only); or the
remaining count-in-comment genus one-shot (the sweep found 2, both
fixed this session — worth re-running next session as the genus
guard).
