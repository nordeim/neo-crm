# Session-54 Parity Remediation Plan (2026-10-04)

Session 54 on `main` @ `d928a30` (= the session-53 code `45714b4` + the
operator's `docs/session_100.md` transcript; zero app-code drift). Workspace
REBUILT after a sandbox reset (fresh clone; bun install 537 pkgs; `.env`
recreated with `DATABASE_URL="file:../db/custom.db"` + a fresh AUTH_SECRET;
db:push + db:seed). Baseline gate on the fresh tree: **lint 0/0 (enforced) ·
tsc 0 · 1180/1180 unit (75 suites)** — the documented state exact. The DB
census through the sanctioned seam: `database:
file:/home/z/my-project/neo-crm/db/custom.db` + 15/24/10/23/12 + 4 users +
`pristine: MATCH`. The OUTER sandbox-root `.env` hazard (the N-53b class —
the reset recreated it) quarantined again as `.env.quarantined-s54`.
`skills/` exclusion verified in all three configs (vitest include allowlist,
eslint ignores, tsconfig exclude). No zombie :3000/:3100 listeners at intake.

## The standing layers (50th session, NO DRIFT)

Drift sweep #50: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, curl) — size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` **exact — the 25th consecutive stable
session**. Reference census #50: the demo data still zero (Total Leads 0,
`$0.0k`/`$0.0k`/`$0k`, `0%`, `0` days); the mobile-nav defect stands at a
TRUE 390px (nav w=0, 8 links in DOM, 0 visible, scrollW 390 — agent-browser
live-verified on the reference).

## The audits (two parallel agents + manual validation of every claim)

### A. The session-53 re-audit (54-a, fresh eyes on the fe975d6..45714b4 diff)

All eight checklist items verified GENUINE at file:line — the census seam
(scripts/census.ts: the singleton import :27, runtimeDatabaseUrl :28, the
printed URL :55 BEFORE the counts :56-59, EXPECTED :32-39, the exit-1 drift
guard :64-70, the invokedAsScript convention :79-80; the package script
wired; the live run MATCH); the orphan retirement (all 8 orphans at zero
code references — only the sanctioned record comments carry the names;
EVENT_TYPE_CHIP/LEADS_FUNNEL/LEAD_INLINE_STATUS_OPTIONS survive with live
consumers); the wonVsLost extraction (the module-scope buildWonVsLost
:83-102 with the plain call :286; the body whitespace-normalized 18/18
identical to the old memo; `filtered`/`funnel` untouched outside every
hunk); both pin files real; the non-vacuousness mechanically REPRODUCED in
a pre-fix `fe975d6` worktree (**8 failed | 2 passed** there, 10/10 at HEAD;
worktree cleaned, main checkout only); counts exact by run (75/1180;
`--list` → 111 in 4 files); diff hygiene (the code delta exactly the 7
files; zero suppressions); fresh-eyes clean.

### B. The graduation audit (54-b: the ledger + the fresh-eyes sweep)

**ZERO graduations — 13/13 CONFIRMED (11th consecutive session; the drift
map EMPTY — no ledger anchor in any s53-touched code file; one line-only
drift family: N-48j's leads sub-anchor +17 and F-47c's leads sub-anchors
from the buildWonVsLost extraction above them, substance identical)**. The
INFO family ALL UNCHANGED (F-47c, N-48c, N-48f, N-48j, N-51c). Both
operator decisions' code anchors verified STANDING (the CSV
formula-injection posture (b) + the source-vocabulary documented parity —
the s53 constants edit sits after every source anchor). Counts exact BY
RUN (75/1180; 111 in 4 files = 94 crm + 9 auth + 7 mobile-nav + 1 setup;
the sleep census at exactly 2 annotated keeps). Fresh-eyes on the 11 swept
files: React-19 discipline holds, all routes guarded, zero security
regressions — findings N-54a/N-54b/N-54c/N-54d/N-54e below (renumbered
into one canonical session sequence, reconciling the two agents'
parallel N-54a/b drafts).

### C. The findings (all manually validated at file:line this session)

- **N-54a (INFO→FIX, the N-53d class in calendar)**: calendar-page.tsx
  :117-148 — the `visible` useMemo NEVER caches: deps :131 `[events,
  activeTypes, activeDates, query]` include `activeTypes` :117 /
  `activeDates` :118, fresh `.filter().map()` identities every render.
  Transitively the `eventsOn` useCallback :145-148 (deps `[visible]`)
  recreates every render. `eventsOn` is called only during render
  (:163 todaysEvents, :309 the days map) — never passed to a memoized
  child — so both wrappers are behavior-neutral dead weight with a false
  caching implication. The s53-P4 buildWonVsLost precedent applies.
- **N-54b (INFO→FIX, the dead-vocabulary family — the operator-decision
  extension)**: constants.ts src-dead exports. **Fully dead** (exactly 1
  repo-wide reference = the definition; zero test refs): `OPEN_STAGES`
  :16, `isClosedOppStage` :43, `CONTACT_SOURCE_LABEL` :266,
  `LEAD_EDIT_STATUSES` :329, `LEAD_EDIT_SOURCES` :330, `TIER_META` :374,
  `PRIORITY_META` :429. **Test-only** (src-dead, pinned by stale tests):
  `DROPPED_STAGES` :19 + `isDroppedStage` :22 (pinned
  constants.test.ts:131-138), `REPORTS_PIPELINE_SLUGS` :166 (pinned
  :139-157 + :184-200 — REDUNDANT with reports-data.test.ts's complete
  ordered-array pins), `FUNNEL_STAGES` :182 (pinned :159-177 — superseded
  by the live LEADS_FUNNEL, pinned in leads-charts.test.ts), 
  `ACCOUNT_EDIT_STATUSES` :324 (pinned contact-model.test.ts:141-149 —
  its "wce select" claim is STALE: the live select at entity-dialogs.tsx
  :269 maps over `ACCOUNT_STATUSES` = active/inactive/churned, NOT the
  constant's active/inactive/prospect). The live vocabulary surfaces:
  CONTACT_PRIORITIES + CONTACT_PRIORITIES_REF + CONTACT_PRIORITY_META
  (priorities), ACCOUNT_TIER_BADGE (tiers), ACCOUNT_STATUSES +
  ACCOUNT_STATUS_META (account status), LEAD_SOURCE_OPTIONS +
  CONTACT_SOURCE_OPTIONS (sources).
- **N-54c (NANO, docs)**: SKILL §4.4 :270 "`STAGE_META` (7 lead stages)"
  — off by one; the map carries 8 keys (constants.ts:85-101, `unqualified`
  pinned since s5).
- **N-54d (NANO)**: scripts/census.ts :71-73 — the MATCH banner hardcodes
  "15/24/10/23/12 + 4 users", duplicating EXPECTED :32-39; a future
  EXPECTED re-sync would leave the banner silently stale.
- **N-54e (NANO, pin-strength)**: tests/db-census.test.ts :48-54 — pin 2
  asserts only `runtimeDatabaseUrl` presence + any `console.(log|info)`;
  deleting the `database: ${url}` print while keeping the counts log
  would still pass — the count-without-path regression (the N-53b hazard
  itself) is under-pinned.
- **N-54f (NANO, annotation hygiene)**: the inert ghost-action family —
  contacts-page :555-563 (Call/Email/WhatsApp trio) + calendar-page
  :434-441 (Phone/Message pair) — lacks the dead-affordance annotations
  the leads Convert item (:643-645) and the dashboard More... carry.
  Bundle-verified THIS session (the reference's own trio/pair carry NO
  onClick — `Ke,{variant:"ghost",size:"icon"...}` with children only).
- **N-54g (INFO, docs-accuracy — the session_99 suggested-next)**:
  AGENTS.md :211-216 — "dropped = `lost` + `unqualified` via
  `isDroppedStage()`" contradicts the live S29-P5 truth ("Dropped Deals" =
  lost STRICTLY, leads-page :250-255 comment + :259 filter), and
  `PRIORITY_META` is listed among the canonical metas (dead — the live
  contact-priority vocabulary is CONTACT_PRIORITIES_REF/
  CONTACT_PRIORITY_META).
- **N-54h (NANO, docs-convention — the session_99 suggested-next)**: PAD's
  per-session test-inventory rows count "files touched by that session's
  pin additions" while the Total counts files at HEAD — summing the column
  double-counts shared files (e.g. constants.test.ts appears in multiple
  session rows). A one-line convention note removes the ambiguity.

## The operator-decision standings (session-54 decisions)

Both standing operator decisions re-verified genuine by the 54-a/54-b
audits, the drift sweep #50 (the bundle byte-identical for the 25th
consecutive session — no new evidence), and the manual anchor validation:

1. **The CSV formula-injection posture (b) STANDS** — guardFormulaPrefix
   csv.ts:31-33 applied in BOTH export families, `-` deliberately
   unguarded with the recorded rationale, templates + parser outside the
   guard. Nothing to re-litigate.
2. **The source-vocabulary documented parity STANDS and EXTENDS** — the
   living `LEAD_SOURCE_OPTIONS`/`CONTACT_SOURCE_OPTIONS` pair unchanged;
   the s48/s49 retirement policy (src-dead vocabulary exports retire with
   record comments; pins re-anchor to the living surface or retire with
   their dead subject) now extends to the N-54b family. This is the
   session's judgment call: the remaining dead vocabulary exports are the
   same class the operator already decided to retire — leaving half the
   family invites the chronic sibling-carrier relapse (the N-52a lesson).

## The fixes (S54-P1..P7, RED-first)

### S54-P1 — the calendar memo family (N-54a)

Extract the `visible` computation VERBATIM to the module-scope pure
`buildVisibleEvents(events, activeTypes, activeDates, query)` + the plain
call (the s53-P4 buildWonVsLost idiom); retire the `eventsOn` useCallback
to a plain arrow in the component body (its only callers are render-time:
:163 + :309 — the wrapper never cached and no memoized child consumes it).
Behavior identical; `filtered`-equivalent live memos in the file (the
`days` grid memo :137-143) untouched.

### S54-P2 — the dead-vocabulary retirement (N-54b, the extension)

- constants.ts: retire the 7 fully-dead exports (OPEN_STAGES,
  isClosedOppStage, CONTACT_SOURCE_LABEL, LEAD_EDIT_STATUSES,
  LEAD_EDIT_SOURCES, TIER_META, PRIORITY_META) + the 4 test-only exports
  (DROPPED_STAGES, isDroppedStage, REPORTS_PIPELINE_SLUGS, FUNNEL_STAGES,
  ACCOUNT_EDIT_STATUSES) with the s48/s49/s53 record-comment precedent
  (a short comment where each stood).
- tests/constants.test.ts: remove the 4 stale its (the isDroppedStage it,
  the two REPORTS_PIPELINE_SLUGS its, the FUNNEL_STAGES it) + their
  imports — every removed pin is either redundant with a living-surface
  pin (reports-data.test.ts's ordered arrays; leads-charts.test.ts's
  LEADS_FUNNEL) or pins a retired subject.
- tests/contact-model.test.ts: re-anchor the ACCOUNT_EDIT_STATUSES it to
  the LIVE wiring — the entity-dialogs Status select maps over
  ACCOUNT_STATUSES (entity-dialogs.tsx:269) — the honest s49 re-anchor.

### S54-P3 — the census banner + pin strengthening (N-54d + N-54e)

- scripts/census.ts: derive the MATCH banner from EXPECTED (no hardcoded
  count literal in the source).
- tests/db-census.test.ts: strengthen pin 2 to pin the actual
  `database: ${url}` print form (a green-through-RED guard) + a new it
  asserting the banner derivation (no hardcoded "15/24/10/23/12" literal
  in comment-stripped source — RED against the current hardcode).

### S54-P4 — the ghost-action annotations (N-54f)

Add the dead-affordance record comments (the leads Convert precedent) to
the contacts trio (:555-563) + the calendar pair (:434-441), citing this
session's bundle verification (the reference's own inert affordances,
mirrored).

### S54-P5 — the docs-accuracy carriers (N-54g + N-54c)

- AGENTS.md :211-216: the vocabulary row corrected to the live truth
  ("Dropped Deals" counts `lost` strictly; the s5 isDroppedStage helper
  retired session-54) + PRIORITY_META dropped from the canonical list
  (the live contact-priority vocabulary named instead).
- SKILL §4.4 :270-272: PRIORITY_META + TIER_META removed from the
  constants inventory (the s42/s50 precedent); "STAGE_META (7 lead
  stages)" → 8 (N-54c).

### S54-P6 — the month-flip trailing-cell e2e (the s51 suggested-next)

A new e2e in tests/e2e/crm.spec.ts: on /calendar, compute the current
month's trailing next-month cells (the Sunday-anchored trimmed grid),
create an event ON a trailing cell date through the New Event dialog,
assert its chip renders on the trailing cell, flip away one month and
back, assert the chip PERSISTS (the N-51a fetch-window proof end-to-end),
then delete it via the agenda ⋮ menu and assert zero residue. Deterministic
at any run date (the target date is computed from the live grid).

### S54-P7 — the docs suite

README (badge 1182+112 = 1294, the session-54 paragraph, the Tested row),
AGENTS (1182/112 + the session-54 block), CLAUDE (1182 ×3 + the e2e count
rows), PAD (the s54 test-inventory row / the Total / the
counting-convention note (N-54h) / the command-table e2e counts), SKILL
**v1.51.0** (frontmatter + project_state + the H1 + the new §16at), 
`docs/session_101.md`, this plan's execution record, both worklogs.
`.env`/`.env.example` re-verified (no env surface change).

## Pre-execution validation (done, at file:line)

- **Pin blast radius**: no existing test pins the calendar `visible`/
  `eventsOn` region (calendar-cells pins the monthGrid/chips body;
  calendar-fetch-bounds pins the effect + the KPI baselines reading
  `visible` — the KPI baseline pin asserts `visible` READS, which the
  plain-call form preserves — the identifier survives, only the wrapper
  goes; verified the fetch-bounds pin's regexes match the plain-call
  form). constants.test.ts's OTHER its (LEAD_STAGES, STAGE_META,
  ACTIVITY_TYPE_META, AGING_BUCKETS, LEAD_SOURCE_OPTIONS,
  CONTACT_SOURCE_OPTIONS, the CHART_COLORS palette) pin living exports —
  untouched by the retirement. The dead-code-hygiene s46/s53 describes
  pin comment-stripped absences — the new describe follows the same
  stripComments helper.
- **Lint surface**: only export removals (each with zero remaining
  references — the census above), a memo-wrapper removal, test-it
  removals + import narrowings, two comment additions, one banner
  derivation. No unused-var hazards.
- **The e2e layer**: no existing e2e asserts on the retired constants or
  the memo wrappers; the calendar surfaces render identically (the
  removed wrappers were dead weight); the new e2e uses the established
  dialog + agenda-menu flows (the s51 LIVE probe's own path).

## RED pins (planned: 5 RED + 3 green-through-RED guards = 8 its; 5 stale its removed)

`tests/dead-code-hygiene.test.ts` (the session-54 describe, 6 its):

1. (RED) the calendar memo family: the `visible = React.useMemo(` form
   absent + the module-scope `function buildVisibleEvents(` present + the
   plain call present + the `eventsOn = React.useCallback(` form absent;
2. (RED) the 7 fully-dead constants absent (comment-stripped source);
3. (RED) the 4 test-only constants + isDroppedStage absent;
4. (guard) the dropped re-anchor: leads-page counts `lost` STRICTLY (the
   filter + the STRICTLY comment — the live truth the retired helper
   misdocumented);
5. (guard) the wce re-anchor: entity-dialogs maps `ACCOUNT_STATUSES.map`
   for the Status select;
6. (RED) the ghost annotations: the contacts trio + the calendar pair
   carry the S54 dead-affordance markers.

`tests/db-census.test.ts` (+1 it, pin 2 strengthened):

7. (RED) the banner derivation: no hardcoded "15/24/10/23/12" literal in
   comment-stripped census.ts + the derivation present;
8. (guard, inside the strengthened pin 2) the `database: ${url}` print
   template form pinned.

Removed (the stale 5): constants.test.ts ×4 (isDroppedStage,
REPORTS_PIPELINE_SLUGS ×2, FUNNEL_STAGES) + contact-model.test.ts ×1
(ACCOUNT_EDIT_STATUSES — re-anchored as it 5 above).

Predicted RED: **5 failures** (its 1, 2, 3, 6, 7); the full suite through
RED: 5 failed / 1177 passed (1180 − 5 stale its + 7 new its = 1182 total).
GREEN arithmetic: 1180 − 5 + 7 = **1182 unit checks** (75 suites — no new
files); the e2e 111 + 1 = **112**.

## EXECUTION RECORD (2026-10-04, session 54 — SHIPPED)

- **RED**: exactly **5 failures** (its 1, 2, 3, 6, 7 — the predicted set);
  full suite through RED: **5 failed / 1177 passed (1182 total)** — all
  pre-existing checks green (after the 5 stale its were retired first,
  per the plan). One mid-suite e2e flake fixed before the final gate:
  the trailing-cell test's agenda assertion hit a strict-mode violation
  (two agenda rails + the lingering create-toast all matched the event
  text) — re-anchored to the chip's unique title attribute + `.first()`
  on the actions button.
- **GREEN (S54-P1..P6)**: the buildVisibleEvents extraction + the plain
  eventsOn arrow; the 11 dead-vocabulary exports retired with record
  comments + the 5 stale its removed/re-anchored; the census banner
  derivation + the strengthened pin 2; the two ghost-action annotation
  blocks; the AGENTS/SKILL carriers; the month-flip trailing-cell e2e.
  The 5-RED set re-proven mechanically non-vacuous in a pre-fix `d928a30`
  worktree (node_modules hard-linked).
- **Gate**: lint 0/0 (enforced) · tsc 0 · **1182/1182 unit (75 suites)** ·
  build clean · **112/112 e2e on a fresh CI=1 boot** (all 7 mobile-nav
  checks green).
- **LIVE**: the fix surfaces render (Calendar grid + KPIs; Contacts rows
  with the annotated trio). The standing battery: the drawer both
  directions (288px portal nav, 8/8 truly visible, aria-expanded, dual
  lock; Escape → 0/8 with {visibilityProperty:true} + unlocked); zero
  390px overflow on all ten routes (both Dashboard casings); NO Tailwind
  v4 bug (blur(4px) + the exact pinned shadow, probe-verified on a live
  element). Zero probe residue through the seam (the closing
  `bun run db:census` MATCH).
- **Screenshots**: 02/11/12 re-captured + **63-calendar-trailing-cells
  NEW** (the S54-P6 fix surface — the month view with the trailing
  next-month cells + the probe chip). VLM-verified.
- **Docs**: README (badge 1294 + the session-54 paragraph + the Tested
  row); AGENTS (1182/112 + the session-54 block); CLAUDE (1182 ×3 + the
  e2e row); PAD (the s54 row / the Total / the counting-convention note /
  the command table); SKILL **v1.51.0** (frontmatter + project_state +
  the H1 + the new §16at); `docs/session_101.md`; this record; both
  worklogs. `.env`/`.env.example` re-verified (no env surface change).
- **Shipped**: commit on main + the SSH-wrapper push to
  `git@github.com:nordeim/neo-crm.git` (the operator ed25519, shredded
  after — the s43–s53 runbook).
