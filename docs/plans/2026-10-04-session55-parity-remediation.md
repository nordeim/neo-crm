# Session-55 Parity Remediation Plan (2026-10-04)

Session 55 on `main` @ `d4b6a61` (= the session-54 code `c716d55` + the
operator's `docs/session_102.md` transcript commit; zero app-code drift —
`git diff c716d55..d4b6a61 --stat` = 1 docs file, 125 insertions). Workspace
REBUILT after a sandbox reset (fresh clone; bun install 537 pkgs; `.env`
recreated with `DATABASE_URL="file:../db/custom.db"` + a fresh AUTH_SECRET;
db:push + db:seed). Baseline gate on the fresh tree: **lint 0/0 (enforced) ·
tsc 0 · 1182/1182 unit (75 suites)** — the documented state exact. The DB
census through the sanctioned seam: `database:
file:/home/z/my-project/neo-crm/db/custom.db` + counts 15/24/10/23/12 + 4
users + `pristine: MATCH`. The OUTER sandbox-root `.env` hazard (the N-53b
class — the reset recreated it, pointing at the mirror path) quarantined
again as `.env.quarantined-s55`. `skills/` exclusion verified in all three
configs (vitest include allowlist, eslint ignores, tsconfig exclude). No
zombie :3000/:3100 listeners at intake.

## The standing layers (51st session, NO DRIFT)

Drift sweep #51: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, curl) — size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` **exact — the 26th consecutive stable
session**. Reference census #51 (agent-browser, live login): the demo data
still zero (Total Leads 0, `$0.0k`/`$0.0k`/`$0k`, `0%`, `0` days); the
mobile-nav defect stands at a TRUE 390px (nav w=0, 8 links in DOM, 0
visible, scrollW 390).

## The audits (two parallel agents + manual validation of every claim)

### A. The session-54 re-audit (55-a, fresh eyes on the d928a30..c716d55 diff)

All nine checklist items verified GENUINE at file:line — the
buildVisibleEvents extraction (module-scope :101-117, the plain call :146,
the plain eventsOn arrow :162-163; the days memo untouched, byte-identical
pre→post); the 11 dead-vocabulary exports retired (comment-stripped
absences + the 12 living surfaces export-checked + STAGE_META exactly 8
stages); the stale-pin removals/re-anchors (constants.test.ts imports
narrowed to 9 live surfaces; contact-model.test.ts:141-152 re-anchored in
situ; entity-dialogs.tsx:269-270 really maps ACCOUNT_STATUSES); the census
banner derivation (census.ts:71-79, no hardcoded count literal in
comment-stripped source; db-census.test.ts:56 pins the `database: ${url}`
template + the derivation it :59-66); the ghost-action annotations
(contacts :555-560 + calendar :449-453, both citing bundle verification);
the month-flip trailing-cell e2e (crm.spec.ts:2179, the full round-trip;
the reset test at :2258 still LAST); counts exact BY RUN (75 files
1182/1182; `--list` → 112 in 4 files = 95+9+7+1); diff hygiene exact (the
9-file code delta, zero eslint-disable additions); the non-vacuousness
mechanically REPRODUCED (replaying the 5 RED pins against `git show
d928a30:` — its 1/2/3/5 + the db-census banner it ALL fail pre-fix, the 3
guards pass — the documented "5 failed | 11 passed | 16/16" arithmetic
reproduces exactly).

### B. The graduation audit (55-b: the ledger + the fresh-eyes sweep)

**ZERO graduations — 13/13 CONFIRMED (12th consecutive session)**. Two
line-only drifts, both substance-identical, both from the s54 churn (the
contacts accept trio :760→:766 from the N-54f comment insert; the
crm.spec reset-LAST :2040→:2258 from the month-flip e2e insert). The 18
findMany / take-only-in-search census recounted; the INFO family ALL
UNCHANGED (F-47c at :120-125 one-line drift, N-48c, N-48f, N-48j, N-51c);
both operator decisions' code anchors STANDING. Counts exact BY RUN; the
e2e sleep census at exactly 2 annotated keeps (:454 + :2283 — the +79
line drift from the e2e insert); tree clean after every run.

### C. The findings (all manually validated at file:line this session)

- **N-55a (FIX, the N-53c class)**: reports-page.tsx — FOUR
  lint-invisible orphaned imports, each with exactly one in-file
  reference (the import itself): `KpiCard` :13 (the page-parts import —
  CircleStatCard/PageHeader/Sparkline from the same line ARE used,
  10/2/5 refs), `RevenueLineChart` :26 + `ConversionFunnel` :29 (the
  charts import block — the other seven named imports all used),
  `CHART_COLORS` :34 (the constants import — the other six all used).
  Git-verified orphaned since ≥ fe975d6 and SURVIVING the s53 sweep
  (which cleaned only calendar ×7 + leads ×1 — the reports page was not
  in its file set). The exports themselves stay alive (page.tsx owns
  KpiCard/RevenueLineChart; leads-page owns ConversionFunnel; the
  palette has five consumers) — this is import narrowing, not export
  retirement.
- **N-55b (INFO→FIX, the s48/s49/s54 retirement policy)**: format.ts —
  the TEST-ONLY analytics pair: `avgDaysBetween` :257-270 +
  `percentDelta` :272-275. Src-dead (zero non-test consumers repo-wide);
  the only consumers are tests/format.test.ts:13-14/:198-213 (the
  "analytics helpers" describe). The live surfaces: the leads-page
  inline avgCycle (leads-page.tsx:261-267, the S29-P9 five-status
  derivation) + the dashboard's HARDCODED KPI_STATICS deltas (the
  reference's own +5.3%/+15% statics). Same class as the s54
  ACCOUNT_EDIT_STATUSES retirement: the helpers pin a seam the app never
  calls, implying a unit-tested derivation that does not exist.
- **N-55c (INFO→FIX, the same policy)**: lead-filters.ts — the TEST-ONLY
  encode/decode pair: `encodeLeadFilters` :69-71 + `decodeLeadFilters`
  :104-113. Src-dead since the s29 saved-views supersession (the page
  persists the VIEWS LIST through encodeSavedLeadViews/decodeSavedLeadViews
  :126/:130 — decodeSavedLeadViews validates through the internal
  asFilters :77-101 directly, NOT through decodeLeadFilters); the only
  consumers are tests/lead-filters.test.ts:8/:10/:62-105 (the "encode/
  decode (raw contract)" describe). The header's "unit-testable pure
  seam" rationale (:14-19) predates the supersession. The behavioral
  safety the stale its pin (lossless round-trip + the legacy-vocabulary
  + malformed rejection) is REAL and lives on in the saved-views pair —
  the honest s54 re-anchor pattern applies (pin the living surface).
- **N-55d (NANO, docs)**: PAD :1277 — the lead-filters.ts row is doubly
  stale: it names the retired-to-be `encodeLeadFilters`/
  `decodeLeadFilters` pair AND the pre-s29 singular storage key
  `neo-crm.leads.view` (the living key is `neo-crm.leads.views`,
  LEAD_VIEWS_STORAGE_KEY :40). Same class as the s54 AGENTS vocabulary
  row (N-54g).
- **N-55e (NANO, comment hygiene)**: leads-page.tsx:63-65 — the s53
  record comment says CHART_COLORS retired because "the reports page
  owns the palette"; the palette has FIVE consumers (page.tsx,
  activities, accounts + globals.css + constants.ts itself), and after
  N-55a the reports page will not import it at all. The comment becomes
  flat wrong this session; correct it to the live truth.

## The operator-decision standings (session-55 decisions)

Both standing operator decisions re-verified genuine by the 55-a/55-b
audits, the drift sweep #51 (the bundle byte-identical for the 26th
consecutive session — no new evidence), and the manual anchor validation:

1. **The CSV formula-injection posture (b) STANDS** — guardFormulaPrefix
   csv.ts:31-33 (regex :32) applied in BOTH families (escapeCell :37
   server-side + entity-export.ts qq :43 client-side), `-` deliberately
   unguarded with the :19-26 rationale, the static templates + parseCsv
   (:66-104) outside the guard. Nothing to re-litigate.
2. **The source-vocabulary documented parity STANDS AND EXTENDS** — the
   living `LEAD_SOURCE_OPTIONS`/`CONTACT_SOURCE_OPTIONS` pair unchanged
   (:129-134/:245-251); the s48/s49/s53/s54 retirement policy
   (src-dead/test-only exports retire with record comments; pins
   re-anchor to the living surface or retire with their dead subject)
   now extends to the SEAM-LEVEL test-only helpers: the N-55b analytics
   pair + the N-55c encode/decode pair. The judgment call mirrors s54:
   these are the same class the operator already decided to retire — a
   "unit-tested pure seam" nothing calls is a false contract surface,
   and leaving them invites the chronic sibling-carrier relapse (the
   N-52a lesson). The behavioral safety the encode/decode its pin is
   REAL — those its RE-ANCHOR to the living saved-views pair (the s54
   ACCOUNT_EDIT_STATUSES precedent), they do not just vanish.

## The fixes (S55-P1..P6, RED-first)

### S55-P1 — the reports-page orphaned-import retirement (N-55a)

Narrow the four import statements: remove `KpiCard` from the page-parts
import (:13), `RevenueLineChart` (:26) + `ConversionFunnel` (:29) from
the charts import block, `CHART_COLORS` from the constants import (:34),
with one concise record comment noting the N-55a retirement (the s53
leads-page precedent). Plus N-55e: correct the stale "the reports page
owns the palette" claim in the leads-page :63-65 record comment to the
live truth (the palette is shared: page.tsx/activities/accounts).

### S55-P2 — the format.ts analytics pair retirement (N-55b)

Retire `avgDaysBetween` + `percentDelta` with record comments (the
s48/s49/s53/s54 precedent); retire the "analytics helpers" describe (3
its) + the 2 imports from tests/format.test.ts (they pin a dead subject —
the s54 FUNNEL_STAGES precedent; the live derivations are the leads-page
inline avgCycle + the KPI_STATICS statics, each already pinned where it
lives: leads-inline/s27 + dashboard-contracts).

### S55-P3 — the lead-filters encode/decode retirement + re-anchor (N-55c)

Retire `encodeLeadFilters` + `decodeLeadFilters` with record comments;
RE-ANCHOR the four its of the "encode/decode (raw contract)" describe to
the living saved-views surface (encodeSavedLeadViews/decodeSavedLeadViews
— the same asFilters validation, the same behavioral classes):
"round-trips a raw filter set losslessly" → a saved view carrying that
raw filter set round-trips losslessly; "round-trips the all-sentinel
defaults" → the defaults round-trip inside a saved view; "rejects the
LEGACY capitalized vocabulary" → a saved view carrying legacy capitalized
filters decodes to null (stale saved views fall back); "rejects malformed
payloads" → the malformed classes for the saved-views form (null / "" /
not-json / non-array / empty name / bad filter types). The describe
re-titled to the living surface. Green-through-RED guards (the living
pair already carries the behavior — verified by reading asFilters).

### S55-P4 — the docs carriers (N-55d)

PAD :1277 — the lead-filters.ts row corrected to the living truth: the
saved-views list seam (`encodeSavedLeadViews`/`decodeSavedLeadViews`,
storage key `neo-crm.leads.views`), vocabulary-guarded decoding through
asFilters, pinned by tests/lead-filters.test.ts (sessions 8/29/55).

### S55-P5 — the RED pins (dead-code-hygiene session-55 describe, 5 its)

1. (RED) reports-page carries none of the four orphaned imports
   (comment-stripped) while the live siblings stay (CircleStatCard /
   PageHeader / Sparkline / the charts family / the constants family);
2. (RED) format.ts: the test-only analytics pair retired
   (comment-stripped absences) while the living formatters stay
   (formatCurrency / formatCompactCurrency / calendarGrid /
   calendarFetchBounds);
3. (RED) lead-filters.ts: the test-only encode/decode pair retired
   (comment-stripped absences);
4. (guard) the living saved-views seam survives: encodeSavedLeadViews +
   decodeSavedLeadViews + leadFiltersEqual + asFilters-backed decoding
   present in the source;
5. (guard) the leads-page stale palette-ownership claim corrected (raw
   source no longer contains "the reports page owns the palette").

### S55-P6 — the docs suite

README (badge 1184+112 = 1296, the session-55 paragraph, the Tested row),
AGENTS (1184/112 + the session-55 block), CLAUDE (1184 ×3 + the e2e
rows), PAD (the s55 test-inventory row / the Total / the command-table
counts + the N-55d row fix), SKILL **v1.52.0** (frontmatter +
project_state + the H1 + the new §16au), `docs/session_103.md`, this
plan's execution record, both worklogs. `.env`/`.env.example` re-verified
(no env surface change).

## Pre-execution validation (done, at file:line)

- **Pin blast radius**: the 4 helpers' repo-wide reference census is
  EXACTLY the definitions + the 2 test files (grep verified — zero other
  consumers in src/scripts/prisma). No existing test pins the
  reports-page import statements (the page-layout/reports suites pin
  RENDERED contracts, not imports). The dead-code-hygiene s53 pin
  "leads-page no longer imports CHART_COLORS" stays true (the only
  leads-page occurrence is the record comment — comment-stripped). The
  saved-views describe its (:106-134) pin the living pair already — the
  re-anchored its supplement, not collide.
- **Lint surface**: import narrowings + export removals (each with zero
  remaining references) + test-it edits. No unused-var hazards.
- **Behavior**: zero runtime change — the retired exports had zero src
  callers; the reports-page imports were dead weight; the re-anchored
  its assert behavior that already exists (asFilters verified by read).

## RED pins (planned: 4 RED + 1 guard = 5 its; 3 stale its removed)

Predicted RED: **4 failures** (its 1, 2, 3, 5 — the N-55e comment
correction is RED too, the stale claim stands until fixed); the full
suite through RED: 4 failed / 1180 passed (1182 − 3 stale format its +
5 new its = 1184 total). GREEN arithmetic: 1182 − 3 + 5 = **1184 unit
checks** (75 suites — no new files); the e2e stays **112** (no e2e
change this session — the suggested-next carried no e2e item and the
retirements are invisible to the browser).

## EXECUTION RECORD (2026-10-04, session 55 — SHIPPED)

- **RED**: exactly **4 failures** (its 1, 2, 3, 5 — the predicted set,
  incl. the N-55e comment correction); full suite through RED: **4
  failed / 1180 passed (1184 total)**.
- **GREEN (S55-P1..P4)**: the reports-page import narrowing + the
  leads-page comment correction; the format.ts pair retired + the format
  its retired; the lead-filters pair retired + the 4 its re-anchored to
  the saved-views surface; the PAD row corrected. Non-vacuousness
  re-proven mechanically in a pre-fix `d4b6a61` worktree.
- **Gate**: lint 0/0 (enforced) · tsc 0 · **1184/1184 unit (75 suites)** ·
  build clean · **112/112 e2e on a fresh CI=1 boot**.
- **LIVE**: the fix surfaces render identically (Reports page). The
  standing battery: the drawer both directions at a TRUE 390px; zero
  390px overflow on all ten routes; NO Tailwind v4 bug. Zero probe
  residue through the seam (the closing `bun run db:census` MATCH).
- **Screenshots**: the standing set re-captured + 64-reports-page NEW
  (the N-55a fix surface at 1440×900). VLM-verified.
- **Docs**: README (badge 1296 + the session-55 paragraph + the Tested
  row); AGENTS (1184/112 + the session-55 block); CLAUDE (1184 ×3 + the
  e2e row); PAD (the s55 row / the Total / the command table + the
  N-55d row fix); SKILL **v1.52.0** (frontmatter + project_state + the
  H1 + the new §16au); `docs/session_103.md`; this record; both
  worklogs. `.env`/`.env.example` re-verified (no env surface change).
- **Shipped**: commit on main + the SSH-wrapper push to
  `git@github.com:nordeim/neo-crm.git` (the operator ed25519, shredded
  after — the s43–s54 runbook).
