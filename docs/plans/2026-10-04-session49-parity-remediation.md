# Session-49 Parity Remediation Plan (2026-10-04)

Session 49 on `main` @ `1c76660` (the session-48 code at `ca332f1` + the
operator's `docs/session_90.md` transcript commit — src/tests delta empty,
verified by the fresh clone; the tree clean except the session-49 probe
`scripts/db-count-probe.ts`, deleted before the commit). Baseline gate on
the fresh clone: **lint 0/0 (enforced) · tsc 0 · 1150/1150 unit (71
suites)** — the documented state exactly. `.env` created from
`.env.example` (+ a fresh `AUTH_SECRET`); `db:push` + `db:seed` run — the
database pristine (15 contacts / 24 leads / 10 accounts / 23 activities /
12 events / 4 users, counted via the absolute-URL Prisma probe); the dev
server healthy on :3000; the vitest (5.0.1) + playwright (1.63) configs
verified standing (`skills/` excluded from lint/tsc/vitest by the
established config trio).

## The standing layers (45th session, NO DRIFT)

The reference bundle fresh-fetched + md5-compared BEFORE planning:
**IDENTICAL** (`a70a637fcf1d4291da8e0d965676dc11`, 1,631,071 bytes — the
TWENTIETH consecutive stable session). The reference census (45th): the
demo data still zero; the mobile-nav defect stands at a TRUE 390px (NAV
w=0, 8 links in DOM, 0 visible, no hamburger). The LIVE battery (our
drawer verification, the 390px overflow sweep, the Tailwind v4 token
contract, the fix probes) runs in the LIVE phase below, per the
established order.

## The audits (two parallel review agents + manual validation of every claim)

### A. The session-48 re-audit (49-a, fresh eyes on `1c76660`)

All four session-48 fix families verified GENUINE at file:line — P1 the
formula-injection guard (csv.ts:31-33 `guardFormulaPrefix` inside
`escapeCell` :37 + entity-export.ts:24/:43 `qq`; 12 builder surfaces
re-censused, templates + parseCsv guard-free), P2 the source-vocabulary
reconciliation (CONTACT_SOURCES gone, records at constants.ts:234-250 +
settings:24-36 + contacts:128-136 + leads:43-49, no membership,
constants.test.ts:70-89 re-anchored), P3 the insights badge
(account-insights-dialog.tsx:175-177), P4 the reports export fetch→blob
(reports-page.tsx:208-240, the ignoreBOM decode :229-231, `downloadFile`
retired — zero functional window.location.href seams). Pins mechanically
non-vacuous in a 042bfe0 worktree: **13 failed | 6 passed** (the
documented arithmetic EXACT); **19/19 at HEAD**; the six CSV-family files
60/60; full suite 1150/1150; zero suppressions in the 784-line diff; scope
exact. **No regressions.** Three INFO findings: N-49a (the "e2e #78"
ordinal claim wrong in three HISTORY records — commit message, plan
record :313, worklog Task 48 :1559; the test runs #72; history stays
as-written, no living doc carries it), N-49b (the
reports-export-feedback.test.ts:14 header still narrates the pre-correction
`res.text()` mechanism — a LIVING pin-file comment, fixed in S49-P6),
N-49c (`LEAD_SOURCES` remains src-dead with only its constants.test.ts:67
pin — the twin of the constant s48 removed; S49-P5).

### B. The graduation audit (49-b: the ledger + the session-49 surfaces)

**ZERO graduations** — all 13 standing-ledger items re-confirmed at
file:line on HEAD (6th consecutive session; the only anchor movement the
crm.spec.ts +35 drift from the s48 e2e insertion — the reset test
:2073→:2108, still the file's LAST). The deferred pointers re-anchored:
(a) the reports/export filter membership UNCHANGED (reports:53-61, export
:58-73); (d) the e2e sleeps re-anchored (12 sites, the classification
table below). The pointer-(a) blast radius: **a stage+status
membership-validation scoped to both routes breaks ZERO existing pins**
(report-periods 4 its period-only; opportunity-model:204-211 asserts
createdAt/stage/owner presence in the oppWhere block — the AND-wrap keeps
all three visible; api-robustness's same-named "Invalid stage/status" pins
target the ENTITY routes; the e2e family sends only fixed vocab or "all";
fetchReports + /api/export have one caller each, both select-bounded).
New findings: N-49k (the stale `downloadFile` anti-pattern carried by
FOUR living docs — CLAUDE.md:494-495, AGENTS.md:165-168 (whose
`no-location-assign` lint-rule claim matches no config), SKILL.md:768-769
+:886), N-49l (the session-49 probe residue), N-49m (the saved-view Load
applies RAW stage/status — reports-page:373-375 — and the data effect
silently swallows `!ok` :88-90: without a normalization, the new
validation would turn a stale saved view from silently-EMPTY into
silently-STALE data).

### C. The main-agent validation (every headline claim at file:line)

The pointer-(a) surface read in full (both routes + the page filter model
+ the store seam); the saved-view Load path + the s32 normalizeSavedPeriod
precedent (saved-reports.ts:93-97) read; the four stale-doc carriers read;
the redundant-sleep follow-up assertions read (each already auto-retrying);
the reset handler order read (settings-page:296-316: `setResetText("")`
THEN the blocking alert — the reorder at :2132 is race-free because the
polling evaluate cannot observe the cleared value while the alert blocks
the page's JS, and the dialog pushes precede the accept). **NEW FINDING
N-49n (MED-parity, the S49-P2 fix)**: the reference's reports filter
predicate ANDs every conjunct — bundle: `D&&$&&V&&B&&R` with `$` = stage
match and `B` = the status-derived stage test as INDEPENDENT conjuncts —
while BOTH our routes build `oppWhere` by object spread with the status
branch LAST: `{...(stage ? { stage } : {}), ...(status === "won" ? {
stage: "closed_won" } : ...)}` — a concurrent stage+status(won/lost)
request OVERWRITES the stage filter (stage=prospecting&status=won returns
every closed_won; the reference returns the EMPTY intersection). Reachable
from the page's own two selects; 18 sessions old; zero coverage (no e2e
sets both).

## The operator decision (pointer (a) — DECIDED)

**Targeted membership validation on the genuinely-CLOSED vocabularies;
owner and source stay open BY DESIGN.**

- `stage` validates against `OPPORTUNITY_STAGES` (the fixed six — the
  same constant the page's select offers; the leads route's own stage
  membership vs LEAD_STAGES is the house precedent, and the same-route
  `period` validation at :54/:59 is the envelope precedent): a typo'd
  stage used to answer a silently EMPTY report — now `400 "Invalid
  stage"` through the envelope.
- `status` validates against a new `REPORT_STATUSES` ({open, won, lost} —
  the REPORT_PERIODS precedent: one vocabulary, the page select + both
  route guards): a typo'd status used to be a silent NO-OP (the ternary's
  else-branch matched nothing, the filter dropped, EVERYTHING came back —
  the s42 strict-bool silent-coercion class) — now `400 "Invalid
  status"`. The reference's own unknown-status behavior is the same
  no-op (its `B=!0` default), but its selects are the only entry point —
  our URL surface is not, and the envelope contract is the clone's own
  robustness layer (the s41 "fix its defects" doctrine; `period` already
  validates on exactly this reasoning).
- `owner` stays open: the value is the data-dependent NAME-STRING join
  (the page's dropdown lists the DISTINCT opp owners — a renamed owner
  would 400 every stale saved view; membership would need a DB round
  trip per fetch; the reference's own list is data-derived).
- `source` stays open: the s48 documented-parity free-form decision — no
  canonical list exists to validate against (the five vocabularies are
  disjoint by design; the DB carries arbitrary import strings). The page
  never sends source at all (hardcoded `"all"`).
- The reconciliation record lands in-file at both routes (the s48-P2
  idiom), and the **N-49m companion**: `normalizeSavedStage` +
  `normalizeSavedStatus` in saved-reports.ts (the s32
  normalizeSavedPeriod precedent — unknown values fall back to `"all"`
  so a Load never 400s) applied at the reports-page Load path.

## The fixes (S49-P1..P6, RED-first)

### S49-P1 — the filter-membership validation (Decision + N-49m companion)

`constants.ts`: `REPORT_STATUSES = [{id:"open",label:"Open"},
{id:"won",label:"Won"},{id:"lost",label:"Lost"}]` beside REPORT_PERIODS
(the shared-vocabulary precedent). `reports/route.ts` + `export/route.ts`:
after the notAll parses — `if (stage && !OPPORTUNITY_STAGES.some((s) =>
s === stage)) return ERR.BAD_REQUEST("Invalid stage");` and `if (status
&& !REPORT_STATUSES.some((s) => s.id === status)) return
ERR.BAD_REQUEST("Invalid status");` + the reconciliation-record comments
(the owner/source rationale). `reports-page.tsx`: the status select maps
REPORT_STATUSES (the period-map idiom directly above). `saved-reports.ts`
+ the Load path: the two normalizers. NO change to the oppWhere
stage/source/owner spreads.

### S49-P2 — the stage∧status AND-semantics fix (N-49n)

Both routes: the status conjunct AND-wrapped so it can never overwrite a
concurrent stage filter — `...(status === "won" || status === "lost" ?
{ AND: [{ stage: status === "won" ? "closed_won" : "closed_lost" }] } :
{})` (Prisma ANDs top-level keys with the array: stage=X AND
stage=closed_won — the reference's intersection semantics; status-only
and stage-only requests byte-equivalent to today). The `status ===
"open"` post-filter already ANDs correctly (untouched). ONE new e2e: the
reports page with stage=Prospecting + status=Won renders Won Deals 0
(the seeded closed_won opps prove the pre-fix behavior shows >0 — the
test fails on the pre-fix code, the F-47a zero-coverage lesson applied).

### S49-P3 — the e2e sleep cleanup (the 12-sleep pointer) + N-48e

The classification (49-b's table, main-validated):
- **KEEP (2, the no-op-contract class — annotated in-file)**: :449 (the
  More... dead button — the following auto-retrying assertions would
  pass vacuously at t≈0), :2128 (the reset DECLINE — `toHaveValue("RESET")`
  passes immediately pre-wipe).
- **DELETE (5, redundant — the following assertions already poll)**:
  :1654, :1666, :1680, :1692 (each precedes a `toBeVisible` on a
  data-driven locator), :2083 (the topbar-img `toBeVisible` +
  `toHaveAttribute` IS the reload poll).
- **RESPONSE-WAIT (4)**: :1401 → Promise.all of the four entity-slice
  waitForResponses set up before `goto("/settings")`; :1446 →
  waitForResponse("/api/leads") + the "Follow up with" rows as the
  commit signal (exportLeadsCsv has no zero-guard — a pre-commit click
  downloads a header-only CSV); :2147 → waitForResponse("/api/dashboard")
  with the wipe proof asserted on the RESPONSE BODY
  (`kpis.totalLeads === 0` — the $0 DOM text also renders pre-hydration,
  the zeros contract makes a bare DOM poll vacuous); :2152 →
  waitForResponse("/api/contacts") with `data.length === 0` on the body.
- **REORDER (1)**: :2132 → the auto-retrying `toHaveValue("")` +
  `toBeDisabled()` move UP (they poll until the wipe + settings refetch
  land); the one-shot dialogs-array assertions follow (race-free: the
  alert blocks the page's JS until the handler accepts, and the pushes
  precede the accept — the polls cannot observe the cleared input before
  both dialogs are recorded).
- **N-48e**: :1470 `expect(page.url()).toContain("/")` → `await
  expect(page).toHaveURL(/\/$|\/Dashboard/)` (the file's own :450 idiom).

Net: 12 sleeps → 2 annotated no-op-contract keeps.

### S49-P4 — the stale failure toast (N-48d)

`leads-page.tsx` `onLeadEditResult`: hoist the existing
`window.clearTimeout(leadEditFailTimer.current)` ABOVE the `if (res.ok)
return` — a later success within the 500ms window cancels the pending
failure toast (the final state persisted; the stale error must not
fire). The failure path re-schedules below, preserving the s46-P2 burst
collapse. Pin-compatible with all three existing
leads-inline-feedback.test.ts pins (the shapes stay in the region); the
documented trade-off: a cross-field success can swallow a pending
cross-field failure within the window (accepted — the final state is
persisted either way).

### S49-P5 — the dead LEAD_SOURCES constant (N-49c, the s48-P2 twin)

`constants.ts`: remove `LEAD_SOURCES` (src-dead — only its own pin reads
it; the living vocabulary is LEAD_SOURCE_OPTIONS, consumers
entity-dialogs.tsx:853/:920 + page.tsx:298); extend the comment block
with the s49 record. `tests/constants.test.ts`: retire the dead pin
(:60-67), re-anchor to the LEAD_SOURCE_OPTIONS raw values.

### S49-P6 — the docs realignment (N-49b + N-49k + the standard suite)

- CLAUDE.md:494-495: the anti-pattern → the downloadBlob family (the
  fetch→blob + client-side artifact contract).
- AGENTS.md:165-168: same fix, dropping the unverifiable
  `no-location-assign` lint-rule claim.
- SKILL.md:768-769 + the :886 Don't/Do row: same fix.
- tests/reports-export-feedback.test.ts:14: the header comment → the
  ignoreBOM decode narration (N-49b).
- The standard suite: README (badge + the session-49 paragraph + counts),
  AGENTS (counts + the session-49 block), CLAUDE (counts), PAD (the s49
  row + e2e rows), SKILL **v1.46.0** (frontmatter + project_state + H1 +
  the new §16ao), `docs/session_91.md`, this plan's execution record,
  both worklogs. `.env`/`.env.example` re-verified (no env surface
  change). `scripts/db-count-probe.ts` deleted (N-49l).

## Pre-execution validation (done, at file:line)

- **Pin blast radius**: the validation pins are source-structure pins on
  the two routes (no import of the route handlers); opportunity-model's
  oppWhere block pin (:206-211, 500-char window) keeps createdAt/stage/
  owner visible under the AND-wrap (the conjunct adds ~120 chars after
  all three); report-periods pins period-only; api-robustness's
  "Invalid stage/status" pins target the entity POST/PUT routes
  (different files); the e2e family sends only "all"/fixed vocab; the
  constants.test.ts LEAD_SOURCES pin is retired WITH the constant (the
  s48-P2 precedent). The leads-inline-feedback pins re-checked against
  the hoisted shape — all four regexes still match (the clear/setTimeout/
  500/toast shapes stay in the 900-char region).
- **E2e census**: no e2e asserts a dangerous-prefix CSV cell or an
  invalid filter value; the new combination e2e adds coverage; the sleep
  replacements keep every existing assertion (only the waits change).
- **The reference ground truth**: the filter predicate extracted from
  the stable bundle (the AND semantics); the selects' fixed vocabularies
  confirmed (stage six + status four incl. "all"); no server-side
  validation exists in the reference at all (its filters are client-side
  React state — our envelope validation is the clone's own robustness
  layer, the period precedent).

## RED pins (planned: 11 = 10 RED + 1 guard)

- `tests/reports-filter-validation.test.ts` — 8 its: (1) reports/route.ts
  stage + status membership (the OPPORTUNITY_STAGES.some +
  REPORT_STATUSES.some shapes + the two ERR.BAD_REQUEST messages);
  (2) export/route.ts same pair; (3) the owner/source-open GUARD (the
  raw notAll spreads preserved + no "Invalid owner"/"Invalid source" on
  either route — green through RED by design, the s45-precedent class);
  (4) the reconciliation-record comment present in both routes
  (unstripped read); (5) normalizeSavedStage functional (dynamic import:
  "proposal"→"proposal", "won"→"all" (the LEAD stage, cross-vocab),
  ""→"all", "all"→"all"); (6) normalizeSavedStatus functional ("won",
  "open", "new"→"all", ""); (7) the reports-page Load applies both
  normalizers; (8) the AND-semantics conjunct shape in both routes'
  oppWhere (the `{ AND: [{ stage:` form — N-49n).
- `tests/leads-inline-feedback.test.ts` — +1 it: the clearTimeout
  PRECEDES the `if (res.ok) return` (the ordering pin — N-48d).
- `tests/constants.test.ts` — the LEAD_SOURCES pin retired + re-anchored
  to LEAD_SOURCE_OPTIONS raw values (N-49c).

Predicted RED: 10 failures + 1 guard (the failure SET must equal the
code-change pin set). E2e: the new combination test + the sleep
replacements verified in the gate (the combination test is expected to
FAIL on the pre-fix code — the RED evidence for N-49n).

## Gate + LIVE verification

Gate: lint 0/0 (enforced) · tsc 0 · full unit (1150 + the new pins) ·
build clean · 111/111 e2e on a fresh CI=1 boot (the 7 mobile-nav checks
included). LIVE battery on the dev server: (1) the reference census
(45th — done pre-plan) + our drawer verified live in every direction;
(2) zero 390px overflow on all nine routes; (3) NO Tailwind v4 bug (the
standing token contract re-verified); (4) the fix probes: `/api/reports?
stage=typo` → the 400 envelope + `?status=typo` → 400 + the AND case
(`stage=prospection&status=won`... `stage=prospecting&status=won` → 200
with an empty won set), the saved-view Load with an injected stale stage
→ the "all" fallback, the stale-toast probe (offline → edit fails →
online → edit succeeds within the window → NO toast), zero probe
residue (15/24/10/23/12 pristine).

## Deferred pointers (carried forward)

The standing ledger (13 items, 6 sessions zero graduations); the INFO
family documented-not-fixed: F-47c (the lead blank-select parity quirk),
N-47d (the dead entity-dialog edit branches), N-48c (the dashboard
activities zero-guard divergence — as-planned), N-48f (the raw-dump
"[object Object]" parity), N-48j (the duplicated dashboard builders),
N-49a (history-record ordinals — stay as-written). The drift re-sweep
next live visit. The e2e sleep census re-anchors to 2 (both annotated
no-op-contract keeps).

## EXECUTION RECORD (2026-10-04, session 49 — SHIPPED)

- **RED**: exactly **9 failures + 1 green-through-RED guard** (10 its
  across the changes — the plan's 10+1 arithmetic corrected at
  execution: the stage+status membership its merged per-route, so the
  reports-filter-validation file carries 8 its, not 9). Full suite
  through RED: 9 failed / 1151 passed — all 1150 pre-existing checks
  green.
- **GREEN (S49-P1..P5)**: the membership validation (OPPORTUNITY_
  STAGES + the new REPORT_STATUSES on BOTH routes, the envelope 400s,
  the in-file reconciliation records, owner/source documented-open);
  the AND-wrap (the status conjunct `{ AND: [{ stage: … }] }` in both
  routes' oppWhere — stage-only/status-only byte-equivalent, the
  overwrite form gone); the normalizers (normalizeSavedStage/Status +
  the reports-page Load wiring + the status select re-wired to
  REPORT_STATUSES); the stale-toast hoist (N-48d); the LEAD_SOURCES
  removal + the constants pin re-anchor (N-49c); the e2e layer (the
  new combination e2e + the 12→2 sleep retirement + the N-48e
  tightening).
- **Gate**: lint 0/0 (enforced) · tsc 0 · **1160/1160 unit (72
  suites, +10)** · build clean · **111/111 e2e on a fresh CI=1 boot**
  (the new stage+status AND e2e; all 7 mobile-nav checks green; the
  sleep replacements held suite-wide).
- **LIVE**: the API probes (stage=typo → 400 "Invalid stage" both
  routes; status=typo → 400 "Invalid status";
  stage=prospecting&status=won → 200 wonDeals 0 with the positive
  controls status=won-alone → 4 / stage-only → 200-with-data); the
  saved-view Load network-log-verified (the stale `{week, qualified,
  new, Ghost User}` view fetched `period=thisWeek&owner=Ghost+User&
  stage=all&status=all` → 200 — every normalization landing); the
  stale-toast probe (the failed-then-recovered-within-150ms PUT → NO
  toast; the slow-recovery control correctly fired the sustained
  failure); our drawer verified in every direction (288px portal nav,
  8/8 visible, aria-expanded, dual lock; Escape → inert + unlocked +
  false); zero 390px overflow on all nine routes; NO Tailwind v4 bug
  (blur(4px) + the pinned shadow); **zero probe residue** (the
  probe-edited lead value restored, the localStorage probes cleaned,
  15/24/10/23/12 pristine).
- **Screenshots**: 02 re-captured (within raster noise) + 11/12
  re-captured (byte-identical to HEAD — the first attempt under wrong
  names deleted) + **58-reports-stage-status-and NEW** (the fix
  surface, 1440×900) — 58 VLM-verified 4/4 PASS.
- **Docs**: the four stale downloadFile carriers corrected (CLAUDE +
  AGENTS + SKILL ×2, the no-location-claim retired) + the N-49b
  pin-header correction; README (badge 1271 + the session-49
  paragraph + the suite list + the counts); AGENTS (1160/111 + the
  session-49 block); CLAUDE (the counts); PAD (the s49 row / 72
  suites / 1160+111 / the e2e row 93 / the checklist / the command
  table); SKILL **v1.46.0** (frontmatter + project_state + the H1 +
  the new §16ao); `docs/session_91.md`; this record; both worklogs.
  The scripts/db-count-probe.ts residue deleted (N-49l).
  `.env`/`.env.example` re-verified (no env surface change).
- **Shipped**: commit on main + the SSH-wrapper push to
  `git@github.com:nordeim/neo-crm.git` (the operator ed25519,
  shredded after — the s43-s48 runbook).
