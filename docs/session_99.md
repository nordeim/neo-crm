Session 53 — the census-seam + hygiene session (with the N-53a
retraction as its headline lesson)
(docs/session_99.md, the s53 record; the operator's brief =
docs/session_98.md's standing cycle). The workspace REFRESHED via
git pull (fast-forward 884e3e1..fe975d6 — the operator's
docs/session_98.md transcript ONLY, zero app-code drift; tree clean).
This session on `main` @ `fe975d6` before the changes.

The five core docs re-read (AGENTS/CLAUDE/README/PAD/SKILL
v1.49.0), then the session docs (session_97, the s52 plan +
execution record, the worklog tail, session_98). **Baseline gate
GREEN: lint 0/0 (enforced) · tsc 0 · 1172/1172 unit (74 suites)**
— the documented state exact. The environment intact: no :3000/:3100
listeners at intake, `.env` correct (DATABASE_URL
`file:../db/custom.db` + AUTH_SECRET set), .env/.env.example parity,
the `skills/` exclusion verified in all three configs.

The standing drift re-sweep (49th session): the reference bundle
fresh-fetched (the Vite chunk `assets/index-DZ-xbrIm.js`, curl) +
byte-compared against the cached copy — **byte-identical** (size
1,631,071 + md5 `a70a637fcf1d4291da8e0d965676dc11` exact — the
**24th consecutive stable session**). The reference census (49th):
the demo data still zero (Total Leads 0, `$0.0k`/`$0.0k`/`$0k`,
`0%`, `0` days); the mobile-nav defect stands at a TRUE 390px
(nav w=0, 8 links in DOM, 0 visible, scrollW 390).

The two parallel audit agents dispatched (Tasks 53-a/53-b) + every
headline claim manually validated at file:line: **53-a** — all
seven session-52 checklist items GENUINE (the saveView hoist
:148-164 with the call-site census; the pin's tail check; the
non-vacuousness mechanically REPRODUCED in a pre-fix `6ce8572`
worktree: **1 failed | 3 passed** there, 4/4 at HEAD; the four
docs carriers with the repo-wide "5.check" sweep at zero live
carriers; zero suppressions; the counts exact by run) — with
N-53e (the s52 plan's phantom CLAUDE suite-description promise,
history stays as-written) + N-53f (the PAD:1278→1279 citation
drift). **53-b** — ZERO graduations (**13/13 CONFIRMED, 10th
consecutive session; the drift map EMPTY** — no ledger anchor in
either s52-touched file); the INFO family unchanged (F-47c,
N-48c, N-48f, N-48j, N-51c); both operator decisions' code anchors
STANDING (the CSV formula-injection posture (b) + the
source-vocabulary documented parity); the counts exact BY RUN
(74/1172; `--list` → 111 in 4 files; the sleep census at exactly 2
annotated keeps); the fresh-eyes sweep finding **N-53c** (8
orphaned imports: calendar-page ×7 + leads-page ×1, each with only
its import as the in-file reference) + **N-53d** (the leads-page
`wonVsLost` useMemo never caches — deps `[won, lost]` are fresh
identities every render).

**The N-53a retraction (the session's story).** The INTAKE census
reported the repo db at 15/24/10/23/**13** + 4 users — "PROBE51
Trailing Cell" (created 2026-10-04T03:09:35.750Z) read as s51
residue, briefly implicating the s51/s52 zero-residue claims. The
follow-up forensics RETRACTED it: the census had run a raw
`new PrismaClient()` from the repo root, which opens the
SANDBOX-ROOT mirror db (`/home/z/my-project/db/custom.db`), not
the repo's — proven by `PRAGMA database_list` run through the
suspect client itself (the engine's true file). The mirror carries
the s51 zombie server's own PROBE51 copy (exactly what the s51
record documented); the REPO db (mtime 03:32, all rows at the
01:24:04 reseed timestamps, 12 events) was PRISTINE all along —
the s51 battery's cleanup landed at 03:32, ten minutes before the
ship, and the s51/s52 "zero residue, 12 events pristine" claims
were TRUE. The mechanics of the hazard (N-53b): node resolves the
repo .env's relative `file:../db/custom.db` against the process
CWD (one dir outside the repo); bun absolutizes it against the
.env location (the same outer path); the leftover outer `.env`
with its absolute URL redirected a third way; and a SQLite engine
opening a MISSING mirror path CREATES an empty db there (observed
live — the hazard manufactures its own plausible mirror). The
outer leftovers quarantined (renamed `.env.quarantined-s53` /
`custom.db.quarantined-s53` — outside the repo, zero git surface).

The plan written
(docs/plans/2026-10-04-session53-parity-remediation.md) with the
families S53-P1..P5 (the N-53a retraction + N-53b strengthening
folded in as the forensics developed), validated against the
codebase before execution (the pin blast radius: no existing pin
references the calendar import block, CHART_COLORS, or the
wonVsLost region; `filtered` :189 and `funnel` :277 are the live
memos).

**RED**: the new `tests/db-census.test.ts` (4 pins) + the
dead-code-hygiene session-53 describe (4 pins) — **exactly 8
failures**; full suite through RED: **8 failed / 1172 passed** —
all pre-existing checks green.

**GREEN**: S53-P2 — `scripts/census.ts` + `bun run db:census` (the
census through the app's own db singleton + the PRINTED resolved
path + the seed-contract verdict, exit 1 on drift); S53-P3 — the
eight orphaned imports retired + the src-dead EVENT_STATUS_META
constant retired from constants.ts (the s48/s49 precedent); S53-P4
— the wonVsLost series extracted VERBATIM to the module-scope pure
`buildWonVsLost(won, lost)` + the plain call (the sibling
`pipelineByStage` idiom). The 8-pin set re-proven mechanically
non-vacuous in a pre-fix `fe975d6` worktree (node_modules
hard-linked): **8 failed | 2 passed** there, **10/10** at the fix;
the worktree cleaned after. S53-P1 resolved as the pristine
verification: `bun run db:census` prints
`database: file:/home/z/my-project/neo-crm/db/custom.db` +
15/24/10/23/12 + 4 users + `pristine: MATCH`.

**FULL GATE GREEN: lint 0/0 (enforced) · tsc 0 · 1180/1180 unit (75
suites, +8) · build clean · 111/111 e2e on a fresh CI=1 boot** (all
7 mobile-nav checks green).

**LIVE verification battery on the dev server** — the fix surfaces:
the Leads page renders the Won vs Lost Over Time chart with data
(Jun–Sep ticks, the Won/Lost legend, the grouped bars) + the
Conversion Funnel + the four KPI cards; the Calendar page renders
the KPI quartet + the October grid with the event chips (the
import retirements behavior-identical). The standing battery: the
drawer both directions at a TRUE 390px (the trigger → the 288px
portal nav with 8/8 truly visible links + aria-expanded + dual
scroll-lock; Escape → 0/8 truly visible [with
`{visibilityProperty: true}`] + unlocked); **zero 390px overflow on
all ten routes** (both Dashboard casings); **NO Tailwind v4 bug**
(the token contract: `--blur-sm` computes blur(4px), `--shadow-sm`
the exact pinned rgba(0,0,0,0.05) 0px 1px 2px — probe-verified on a
live element). Zero probe residue through the NEW seam (the
closing `bun run db:census` MATCH).

Screenshots: 02/11/12 re-captured (the standing set) +
**62-leads-won-vs-lost NEW** (the N-53d fix surface at 1440×900:
the Won vs Lost Over Time chart with its grouped bars + legend +
the Leads page chrome). **62 VLM-verified 4/4** (the chart + months
+ legend + grouped bars; the chrome normal; nothing broken or
clipped); 02/11/12 VLM-verified.

Docs realignment: README (badge 1291 = 1180 + 111, the session-53
paragraph, the suite comment + db-census in the list, the Tested
row), AGENTS (1180/111 + the db:census row + the session-53
block), CLAUDE (1180 ×3 + the db:census row + the census-method
anti-pattern), PAD (the s53 test-inventory row / 75 suites / the
repo-tree counts / the Total / the checklist / the command table),
SKILL **v1.50.0** (frontmatter + project_state + the H1 + the new
§16as), this record, the plan's execution record, both worklogs.
`.env`/`.env.example` re-verified (no env surface change; the
census script consumes the existing DATABASE_URL contract).

**The headline**: the census method was the bug — the session
proved live that a raw PrismaClient from the repo root silently
counts a sandbox-root mirror (and even manufactures one), retracted
its own intake finding against the verified s51/s52 records, and
closed the class with the sanctioned `bun run db:census` seam
(the singleton + the printed path + the seed-contract verdict);
plus the hygiene pair (the eight orphaned imports + the src-dead
constant + the never-caching memo) — 13/13 ledger zero graduations
for the 10th consecutive session, both operator decisions standing,
the reference bundle stable for the 24th consecutive session.

**Gate**: lint 0/0 · tsc 0 · **1180/1180 unit (+8 RED-first pins
proven non-vacuous)** · **111/111 e2e** (fresh boot) · 49th
drift-sweep clean (24th consecutive stable reference bundle) ·
live-verified, zero probe residue (through the seam) · docs at
SKILL v1.50.0 + `docs/session_99.md`.

**Suggested next**: the standing ledger (13 items, 10 sessions zero
graduations), the INFO family unchanged (F-47c, N-48c, N-48f,
N-48j, N-51c — all triaged), N-53e/N-53f recorded (history stays
as-written), the drift re-sweep next live visit, the PAD
per-session-row counting-convention ambiguity (observed, recorded),
and the quarantined outer leftovers left inert.
