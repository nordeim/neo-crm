Session 49 — the filter-semantics session (docs/session_91.md, the
s49 record; the operator's brief = docs/session_90.md's standing
cycle). The workspace refreshed (fresh `git clone` — the sandbox had
been reset again; `main` @ `1c76660` = the session-48 code `ca332f1`
+ the operator's `docs/session_90.md` transcript). Session 48
confirmed SHIPPED (the commit + the verified push, recorded in the
operator's transcript + the s48 plan's execution record) — this
session is **session 49**.

The five core docs re-read (AGENTS/CLAUDE/README/PAD/SKILL v1.45.0 —
the CLAUDE.md re-read surfaced the FIRST finding before any audit
ran: the Anti-Patterns section still routed downloads through the
RETIREd `downloadFile()`), then the session docs (session_89/90, the
s48 plan + execution record, the worklog tail Tasks 47-b/48-a/48-b/48
— the 13-item ledger + the INFO family + the deferred pointers).
Environment rebuilt: bun install (537 packages), .env from
.env.example + a fresh AUTH_SECRET, db:push + db:seed (15/24/10/23/12
+ 4 users, the absolute-URL probe), the dev server healthy on :3000.
**Baseline gate GREEN: lint 0/0 (enforced) · tsc 0 · 1150/1150 unit
(71 suites)** — the documented state exact.

The standing drift re-sweep (45th session) BEFORE planning: the
reference logged into via agent-browser, the authed bundle
(/assets/index-DZ-xbrIm.js) fresh-fetched OUTSIDE the repo tree (the
OOM lesson) — **md5-IDENTICAL** (`a70a637fcf1d4291da8e0d965676dc11`,
1,631,071 bytes — the TWENTIETH consecutive stable session). The
reference census (45th): the demo data still zero; the mobile-nav
defect stands at a TRUE 390px (NAV w=0, 8 links in DOM, 0 visible, no
hamburger).

The two parallel audit agents dispatched (Tasks 49-a/49-b) + every
headline claim manually validated at file:line before planning:
**49-a** — all four session-48 fix families verified GENUINE (the
pins mechanically non-vacuous in a 042bfe0 worktree: exactly 13
failed | 6 passed there, 19/19 at HEAD; zero suppressions in the
784-line diff) with three INFO findings — N-49a (the "e2e #78"
ordinal claim wrong in three HISTORY records — the test runs #72;
history stays as-written), N-49b (the reports-export-feedback pin
header still narrating the pre-correction `res.text()` mechanism),
N-49c (LEAD_SOURCES remains src-dead — the twin of the constant s48
removed); **49-b** — ZERO graduations (all 13 ledger items
re-confirmed, 6th consecutive session), the pointer-(a) blast radius
censused (a stage+status membership validation breaks ZERO existing
pins), the 12 e2e sleeps classified (2 no-op-contract keeps, 5
redundant deletes, 4 response-wait replacements, 1 race-free
reorder), N-48d's fix shape validated pin-compatible, and the
CLAUDE.md staleness confirmed across FOUR carriers (CLAUDE:494-495,
AGENTS:165-168 — whose `no-location-assign` lint-rule claim matches
no config — SKILL:768-769 + :886). **The main-agent validation then
found the session's headline: N-49n (MED-parity)** — decoding the
reference's filter predicate (bundle `D&&$&&V&&B&&R`) revealed stage
and the status-derived stage test as INDEPENDENT conjuncts, while
BOTH our routes built oppWhere by object spread with the status
branch LAST — a concurrent stage+status(won/lost) request OVERWROTE
the stage filter (stage=prospecting&status=won returned every
closed_won; the reference returns the EMPTY intersection). An
18-session-old divergence, reachable from the page's own two
selects, invisible because no e2e ever set both.

**The operator decision (pointer (a), deferred since the s46 audits)
DECIDED**: targeted membership validation on the genuinely-CLOSED
vocabularies — `stage` vs OPPORTUNITY_STAGES (a typo'd stage used to
answer a silently EMPTY report) and `status` vs the new shared
REPORT_STATUSES constant (a typo'd status used to be a silent NO-OP —
the where-builder's else-branch dropped the filter, EVERYTHING came
back, the s42 strict-bool class), both answering the envelope's 400s
on BOTH routes; `owner` (the data-dependent NAME-STRING join — a
renamed owner would 400 every stale saved view) and `source` (the
s48 free-form parity) stay deliberately OPEN with the rationale
recorded in-file. The N-49m companion: normalizeSavedStage/
normalizeSavedStatus (the s32 normalizeSavedPeriod precedent —
unknown values fall back to "all" so a Load never 400s) applied at
the reports-page Load path.

The plan written
(docs/plans/2026-10-04-session49-parity-remediation.md) with the
families S49-P1..P6. **RED phase**: tests/reports-filter-validation
.test.ts (8 its: the membership pairs on both routes, the
owner/source-open GUARD, the in-file records, the two functional
normalizer matrices incl. the lead-stage cross-vocabulary guards,
the Load wiring, the AND-conjunct shape) + the leads-inline-feedback
ordering pin (the clearTimeout precedes the ok early-return) + the
constants re-anchor (LEAD_SOURCES absent, the living OPTIONS values).
**RED confirmed: exactly 9 failures + 1 green-through-RED guard** (the
plan's 10+1 arithmetic corrected at execution — the stage+status
membership its merged per-route) — full suite through RED: 9 failed /
1151 passed, all 1150 pre-existing checks green.

**GREEN (S49-P1..P5)**: the validation + the AND-wrap on both routes
(the status conjunct AND-wrapped so it can never overwrite a
concurrent stage filter — stage-only and status-only requests
byte-equivalent); REPORT_STATUSES added beside REPORT_PERIODS (the
shared-vocabulary precedent) with the reports-page status select
re-wired to it; the two normalizers + the Load wiring; the
clearTimeout hoist (N-48d — a later success within the 500ms window
cancels the pending stale toast, the burst collapse preserved);
LEAD_SOURCES removed with its pin re-anchored to LEAD_SOURCE_OPTIONS
(N-49c, the s48-P2 twin); the e2e layer — ONE new combination e2e
(stage=Prospecting + status=Won → the API's wonDeals 0 + the
rendered "Won Deals 0 $" — it FAILS on the pre-fix code, the F-47a
zero-coverage lesson) + the 12 sleeps retired to 2 annotated
no-op-contract keeps (5 redundant deletes before auto-retrying
assertions, 4 response-waits — the settings four-slice hydration, the
dashboard leads slice + the "Follow up with" commit signal, the two
post-wipe proofs asserted on the RESPONSE BODIES because the
instant-render-with-zeros contract makes bare $0/empty-state DOM
polls vacuous — and 1 race-free reorder: the reset accept's
auto-retrying toHaveValue("")/toBeDisabled() moved above the
one-shot dialogs-array assertions, race-free because the alert blocks
the page's JS until the handler accepts and the pushes precede the
accept) + the N-48e `toContain("/")` tightened to the file's own
toHaveURL idiom.

**FULL GATE GREEN: lint 0/0 (enforced) · tsc 0 · 1160/1160 unit (72
suites, +10) · build clean · 111/111 e2e on a fresh CI=1 boot** (the
new combination e2e + all 7 mobile-nav checks green; the sleep
replacements held across the full suite — the reset reorder included).

**LIVE verification battery on the dev server**: the API probes —
`stage=typo` → 400 "Invalid stage" (both routes), `status=typo` →
400 "Invalid status", `stage=prospecting&status=won` → 200 with
wonDeals 0 (the AND semantics; the positive controls: status=won
alone → wonDeals 4, stage-only → 200 with data); the saved-view Load
probes (network-log-verified): a stale view carrying
`{dateRange:'week', stage:'qualified', status:'new', owner:'Ghost
User'}` fetched `/api/reports?period=thisWeek&owner=Ghost+User&stage
=all&status=all` — 200, every normalization landing (the legacy week
id migrated, the cross-vocab LEAD stage fallen back to "all", the
lead status fallen back to "all", the raw owner passing through
open); the stale-toast probe (the single-eval fetch-reject form after
the first attempt's command latency exceeded the window — itself the
correct sustained-failure behavior): a failed PUT recovered by a
successful one 150ms later → NO "Could not update lead" toast; our
drawer verified live in every direction (the real 36×36 trigger →
the 288px portal nav with 8/8 truly visible links + aria-expanded
true + dual scroll-lock; Escape → inert + 0 visible + unlocked +
false); **zero 390px overflow on all nine routes** (both Dashboard
casings); **NO Tailwind v4 bug** (the token contract re-verified:
`--blur-sm` computes blur(4px), `--shadow-sm` the exact pinned
rgba(0,0,0,0.05) 0px 1px 2px); **zero probe residue** (the
probe-edited lead value restored via the API, the localStorage probe
entries cleaned, 15/24/10/23/12 pristine).

Screenshots: 02 re-captured (within the established raster noise) +
11/12 re-captured (byte-identical to HEAD — the deterministic seed;
the first attempt under the wrong 11-leads/12-settings names deleted)
+ **58-reports-stage-status-and NEW** (the fix surface at 1440×900:
the Prospecting+Won filters with the "Won Deals 0 $0.0K" KPI +
"Recent Won Deals: No won deals"). 58 VLM-verified 4/4 PASS.

Docs realignment: the four stale `downloadFile` carriers corrected
(CLAUDE.md's anti-pattern, AGENTS.md's block — the unverifiable
`no-location-assign` claim retired with it — SKILL.md ×2) + the
N-49b pin-header correction + README (badge 1271, the session-49
paragraph, the suite list + reports-filter-validation, the counts) +
AGENTS (1160/111 + the session-49 block) + CLAUDE (the counts) + PAD
(the s49 row / 72 suites / 1160+111 / the e2e row 93 / the checklist
/ the command table) + SKILL **v1.46.0** (frontmatter + project_state
+ the H1 + the new §16ao) + this record + the plan's execution
record + both worklogs. The scripts/db-count-probe.ts probe residue
deleted (N-49l). `.env`/`.env.example` re-verified (no env surface
change; DATABASE_URL `file:../db/custom.db` with db/ at the repo
root).

**The headline**: the oldest standing pointer closed with the
evidence-first method — the filter-membership decision (closed
vocabularies validate through the envelope; owner/source documented
open) landed together with the discovery it surfaced: the reference's
filter predicate decodes to independent conjuncts, exposing an
18-session-old stage∧status overwrite divergence now fixed in both
routes and pinned by a new e2e that fails on the pre-fix code. The
12-sleep deferred pointer retired the same session — every wait now
deterministic except the two genuinely no-op-contract keeps, each
annotated with its rationale. Plus the stale-toast fix, the dead
LEAD_SOURCES twin, and the four stale doc carriers.

**Gate**: lint 0/0 · tsc 0 · **1160/1160 unit (+9 RED-first pins + 1
regression guard)** · **111/111 e2e** (fresh boot, +1) · 45th
drift-sweep clean (20th consecutive stable reference bundle) ·
live-verified both directions, zero probe residue · docs at SKILL
v1.46.0 + `docs/session_91.md`.

**Suggested next**: the standing ledger (13 items, 6 sessions zero
graduations) + the INFO family triage (F-47c, N-47d, N-48c/f/j — all
documented parity/scope notes), the drift re-sweep next live visit,
and the e2e sleep census now standing at 2 (both annotated
no-op-contract keeps — nothing left to retire without weakening a
pinned contract).
