# Session-53 Parity Remediation Plan (2026-10-04)

Session 53 on `main` @ `fe975d6` (= the session-52 code `884e3e1` + the
operator's `docs/session_98.md` transcript; zero app-code drift). Workspace
refreshed via git pull (fast-forward); the environment intact from the s52
ship. Baseline gate on the fresh tree: **lint 0/0 (enforced) · tsc 0 ·
1172/1172 unit (74 suites)** — the documented state exact. `.env` correct
(`DATABASE_URL=file:../db/custom.db` + AUTH_SECRET set); `.env.example`
present + parity (only the AUTH_SECRET line differs); `db/` at the repo
root; the `skills/` exclusion holds in all three configs (vitest include
allowlist, eslint ignores, tsconfig exclude).

## The standing layers (49th session, NO DRIFT)

Drift sweep #49: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, curl) + byte-compared against the cached copy —
**byte-identical** (size 1,631,071 + md5 `a70a637fcf1d4291da8e0d965676dc11`
exact — the **24th consecutive stable session**). Reference census #49: the
demo data still zero (Total Leads 0, `$0.0k`/`$0.0k`/`$0k`, `0%`, `0` days);
the mobile-nav defect stands at a TRUE 390px (nav w=0, 8 links in DOM, 0
visible, scrollW 390 — agent-browser live-verified on the reference).

## The audits (two parallel agents + manual validation of every claim)

### A. The session-52 re-audit (53-a, fresh eyes on the 6ce8572..884e3e1 diff)

All seven checklist items verified GENUINE at file:line — the saveView
purity hoist (leads-page.tsx:148-164: the `const next` computation + the
guarded write in the handler body + the plain `setSavedViews(next)`, zero
storage access in any updater; the call-site census 3 sites; no
removeView/deleteView exists; the reports-page S44-P4 twin at
reports-page.tsx:352-370); the pin (storage-read-guards.test.ts:95-110, the
tail `not.toMatch(/localStorage/)` check, the 3 pre-existing its untouched);
the mechanical non-vacuousness REPRODUCED (a pre-fix `6ce8572` worktree
with only the HEAD pin file: **1 failed | 3 passed** there, 4/4 at HEAD);
the four docs carriers (PAD:1279 + SKILL:342 + SKILL:608 + README:55 — the
repo-wide "5.check" sweep found ZERO live mobile-nav carriers remaining);
zero suppressions; the counts exact by run (74 files / 1172; `--list` → 111
in 4 files); the diff hygiene (exactly 2 code files: +13/−9 and +17/−0).

### B. The graduation audit (53-b: the ledger + the fresh-eyes sweep)

**ZERO graduations — 13/13 CONFIRMED (10th consecutive session)**. The
drift map since 52-b is EMPTY — no ledger item anchors in either s52-touched
file. The INFO family ALL UNCHANGED (F-47c, N-48c, N-48f, N-48j, N-51c —
anchors verified). Both operator decisions' code anchors verified STANDING
(the CSV formula-injection posture (b): `guardFormulaPrefix` csv.ts:31-33
applied in BOTH families — `escapeCell` :37 + entity-export `qq` :43, `-`
deliberately unguarded; the source-vocabulary documented parity: the living
`*_SOURCE_OPTIONS` pair at constants.ts:132-137/:258, zero
CONTACT_SOURCES/LEAD_SOURCES exports, the free-form routes with in-file
rationales). Counts exact BY RUN (74/1172; 111 in 4 files = 94 crm + 9
auth + 7 mobile-nav + 1 setup; the sleep census at exactly 2 annotated
keeps). Fresh-eyes on the leads/settings/calendar pages + the layout
chromatic family + the db seams + the events/activities routes: React-19
discipline holds, all mutations guarded/toasted, zero staleness.

### C. The new findings (all manually validated at file:line)

- **N-53a (RETRACTED mid-session — recorded for the lesson)**: the
  session-53 INTAKE census reported the repo `db/custom.db` at
  15/24/10/23/**13** + 4 users, with "PROBE51 Trailing Cell"
  (created 2026-10-04T03:09:35.750Z) read as s51 residue, and briefly
  implicated the s51/s52 zero-residue claims. The follow-up forensics
  RETRACTED the finding: the intake census had been run with a raw
  `new PrismaClient()` from the repo root, which opens
  `<sandbox-root>/db/custom.db` — the s51-zombie-era MIRROR db, not the
  repo's (proven by `PRAGMA database_list`: the engine's file was
  `/home/z/my-project/db/custom.db` while the repo db sat at
  `<repo>/db/custom.db`). The mirror carries the zombie server's own
  PROBE51 copy — exactly what the s51 record itself documented ("the
  zombie's DB writes landed in the old sandbox-root custom.db"). The
  REPO db — mtime 03:32, all rows at the 01:24:04 reseed timestamps,
  12 events — was PRISTINE all along: the s51 battery's cleanup (the
  agenda-menu delete at 03:32, ten minutes before the 03:42 ship) and
  the s51/s52 "zero residue, 12 events pristine" claims were TRUE.
  The retraction is the session's headline lesson: the orchestrator
  committed the exact census-method error this session then closed.
- **N-53b (CONFIRMED and STRENGTHENED — the census-method hazard)**: a
  raw `new PrismaClient()` with no explicit URL, run from the repo
  root, opens the SANDBOX-ROOT mirror db under BOTH node (the relative
  `file:` URL from the repo .env resolves against the process CWD, not
  the schema dir) and bun (which additionally absolutizes the .env
  value against the .env location — the same outer path; the leftover
  outer `/home/z/my-project/.env` with its absolute URL was a second
  redirection of the same class). Live-proven this session by the
  N-53a misread itself + the `PRAGMA database_list` diagnostic. A
  SQLite engine opening a nonexistent mirror path CREATES an empty db
  there (observed: the diagnostic run recreated a 0-byte file), so the
  hazard even manufactures its own plausible-looking mirror. LESSON:
  ad-hoc DB censuses must resolve through the app seam
  (`src/lib/db.ts` → `runtimeDatabaseUrl`) and must PRINT the resolved
  path; a count without its path is not evidence. The outer leftovers
  are quarantined this session (renamed `.env.quarantined-s53` /
  `custom.db.quarantined-s53` — outside the repo, zero git surface).
- **N-53c (INFO→FIX, hygiene — the s27 leftover family)**: 8 orphaned
  imports, each exactly one in-file reference (the import itself):
  calendar-page.tsx ×7 (`Clock` :11, `Badge` :25, `EVENT_TYPE_META` +
  `EVENT_STATUS_META` :31, `formatTime` :39, `timeUntil` :42, `EMPTY_STATE`
  :47) + leads-page.tsx ×1 (`CHART_COLORS` :63). Retiring the calendar's
  `EVENT_STATUS_META` import leaves that constant fully src-dead
  (constants.ts:420-424 — the s48 CONTACT_SOURCES / s49 LEAD_SOURCES
  retirement precedent). EVENT_TYPE_META/formatTime/timeUntil/EMPTY_STATE/
  CHART_COLORS stay (live consumers elsewhere + pinned).
- **N-53d (INFO→FIX, hygiene — the s14 leftover)**: leads-page.tsx:250-269
  — the `wonVsLost` useMemo NEVER caches: deps `[won, lost]` are fresh
  `filtered.filter(...)` identities every render (:226-227). It is the ONLY
  memoized computation among its plain-const siblings (`pipelineByStage`
  computes plainly; `funnel` deps on the memoized `filtered` and caches
  properly). Behavior-neutral dead weight with a false caching implication.
- **N-53e (INFO, history-record)**: the s52 plan's S52-P3 promised a
  CLAUDE storage-read-guards suite description that never landed — the
  shipped CLAUDE diff was only the three count bumps; the execution record
  and session_97 honestly narrowed to "CLAUDE (1172 ×3)". No live carrier
  is wrong at HEAD; history stays as-written (the N-49a convention).
- **N-53f (NANO, history-record)**: the s52 plan/session_97 cite the PAD
  carrier as "PAD:1278"; at HEAD the row is PAD:1279 (the s52 suite-row
  insertion shifted it +1). History stays as-written; this plan cites 1279.

## The operator-decision standings (re-verified, unchanged)

The two standing operator decisions — the **CSV formula-injection posture
(b)** and the **source-vocabulary documented-parity reconciliation** — were
landed in session 48, re-verified genuine by the 49-a through 53-a audits,
and carry no new evidence (the bundle byte-identical for the 24th
consecutive session). **Both stand as-decided; nothing to re-litigate.**
The INFO family also stands as triaged (F-47c, N-48c, N-48f, N-48j — all
KEEP with recorded rationale; N-51c KEEP).

## The fixes (S53-P1..P5, RED-first)

### S53-P1 — the pristine verification through the seam (N-53a retracted)

The planned surgical delete turned out to be a NO-OP — the repo db was
already pristine (the intake 13-count was the mirror misread, see
N-53a's retraction). The verification: `bun run db:census` (the NEW
seam, S53-P2) prints the resolved URL
`file:/home/z/my-project/neo-crm/db/custom.db` + the counts
15/24/10/23/12 + 4 users + `pristine: MATCH` — the count bound to a
named file, the exact evidence form the session's lesson demands. The
mirror db (quarantined outside the repo) keeps the zombie's PROBE51
copy as an inert historical artifact.

### S53-P2 — the census seam (N-53b, the systemic closure)

`scripts/census.ts` + the `bun run db:census` package script:

- imports `db` from `../src/lib/db` (the singleton — the SAME client the
  app uses; never a raw `new PrismaClient()`), and `runtimeDatabaseUrl`
  from `../src/lib/db-path`;
- PRINTS the resolved database URL first (the N-53b lesson: a count
  without its resolved path is not evidence);
- counts the six models, prints them, and compares against the
  seed-contract table (`EXPECTED = { contacts: 15, leads: 24, accounts: 10,
  activities: 23, events: 12, users: 4 }` — the prisma/seed.ts row counts);
- exits 1 with a residue hint on mismatch (the deliberate-data case is
  covered by the hint: reseed with `bun run db:seed`);
- follows the prisma-env.ts conventions (the `invokedAsScript` guard,
  relative `../src/lib/db` import, tsc-clean under the repo tsconfig).

### S53-P3 — the orphaned-import retirement (N-53c)

- calendar-page.tsx: drop `Clock` from the lucide import; drop the `Badge`
  import line; narrow the constants import to `EVENT_TYPE_CHIP`; drop
  `formatTime` + `timeUntil` from the format import; drop `EMPTY_STATE`
  from the page-layout import.
- leads-page.tsx: drop `CHART_COLORS` from the constants import (keep
  `LEADS_FUNNEL`, `LEAD_INLINE_STATUS_OPTIONS`).
- constants.ts: retire the src-dead `EVENT_STATUS_META` with the s48/s49
  record-comment precedent (a short comment where it stood).

### S53-P4 — the wonVsLost memo retirement (N-53d)

Extract the computation to a module-scope pure function and call it
plainly — the sibling idiom (`pipelineByStage` computes plainly):

```ts
function buildWonVsLost(won: Lead[], lost: Lead[]) { /* the body, verbatim */ }
…
const wonVsLost = buildWonVsLost(won, lost);
```

The body moves VERBATIM (the month-key Map, the insertion order, the sort);
only the `React.useMemo(() => …, [won, lost])` wrapper goes. Effective
behavior identical (the memo never cached — this is the honest form).

### S53-P5 — the docs suite

README (badge 1286 = 1180 + 111, the session-53 paragraph, the Tested row
counts, the suite comment), AGENTS (1180/111 + the session-53 block),
CLAUDE (1180 ×3), PAD (the s53 row / 75 suites / the repo-tree counts /
the Total / the checklist / the command table / the test-inventory rows
for db-census + the dead-code-hygiene growth), SKILL **v1.50.0**
(frontmatter + project_state + the H1 + the new §16as — the census-method
lesson), `docs/session_99.md`, this plan's execution record, both worklogs.
`.env`/`.env.example` re-verified (no env surface change; the census script
consumes the existing DATABASE_URL contract).

## Pre-execution validation (done, at file:line)

- **Pin blast radius (verified)**: no existing test pins the calendar-page
  import block (calendar-cells/calendar-fetch-bounds assert BODY regions —
  `monthGrid`, `Upcoming Events`, the fetch effect), `CHART_COLORS` in
  leads (constants.test.ts pins the constant's VALUES on the constants.ts
  side; reports-page imports it live), `EVENT_STATUS_META` (zero test
  refs), or the `wonVsLost` region (zero test refs; `filtered` :189 and
  `funnel` :277 are the live memos and stay untouched). The
  `not.toMatch(/formatTime\(e\.startAt\)/)` pin (calendar-cells:92)
  asserts a call form inside the monthGrid region — the import removal
  does not affect it.
- **Lint surface**: only import-list narrowings + a wrapper removal + a
  new tsc-clean script; no unused-var hazards (every removed identifier
  has zero remaining references — the census above).
- **The e2e layer**: no e2e asserts on the removed imports or the memo;
  the calendar/leads surfaces render identically (the removed identifiers
  were dead).

## RED pins (planned: 8 RED)

`tests/db-census.test.ts` (NEW, 4 its — the seam contract):

1. the script exists + counts through the app's db seam (imports
   `../src/lib/db`; NO raw `new PrismaClient`);
2. prints the resolved database URL (`runtimeDatabaseUrl()` present);
3. carries the seed-contract expectations (the EXPECTED table with
   15/24/10/23/12 + 4) + the mismatch exit;
4. the `db:census` package script wired (`"bun scripts/census.ts"`).

`tests/dead-code-hygiene.test.ts` (the session-53 describe, 4 its):

5. calendar-page: the seven orphans absent (word-boundary regexes on
   comment-stripped source; EVENT_TYPE_CHIP explicitly still present);
6. leads-page: `CHART_COLORS` absent;
7. constants: `EVENT_STATUS_META` retired (comment-stripped);
8. the wonVsLost memo retired (the `React.useMemo` form absent + the
   `buildWonVsLost(won, lost)` plain call + the module-scope signature
   present).

Predicted RED: **8 failures** (census.ts absent → its 4 its fail; the
orphans + the memo present → their 4 its fail); full suite through RED:
**8 failed / 1172 passed** — all pre-existing checks green. The failure SET
must equal the code-change pin set. GREEN arithmetic: 1172 + 8 = **1180**
unit checks, 74 + 1 = **75 suites**; the e2e stays 111.

## EXECUTION RECORD (2026-10-04, session 53 — SHIPPED)

- **RED**: exactly **8 failures** (census.ts absent → its 4 its; the
  orphans + the memo present → their 4 its); the 2 pre-existing s46 its
  green. Full suite through RED: **8 failed / 1172 passed** — all
  pre-existing checks green.
- **GREEN (S53-P2..P4)**: `scripts/census.ts` + the `db:census` package
  script (the singleton import + the printed runtimeDatabaseUrl + the
  EXPECTED table + the exit-1 drift guard); the calendar ×7 + leads ×1
  orphaned-import retirement + the src-dead EVENT_STATUS_META constant
  retired (the record comment left in place); the wonVsLost extraction
  to the module-scope `buildWonVsLost(won, lost)` + the plain call. The
  8-pin set re-proven mechanically non-vacuous in a pre-fix `fe975d6`
  worktree (node_modules hard-linked): **8 failed | 2 passed** there,
  **10/10** at the fix; the worktree cleaned after.
- **S53-P1 (resolved as the retraction)**: the surgical delete ran as a
  NO-OP ("stray already absent (before=12)") → the forensics → the
  N-53a RETRACTION (see the findings section). The verification through
  the NEW seam: `bun run db:census` → `database:
  file:/home/z/my-project/neo-crm/db/custom.db` + 15/24/10/23/12 + 4
  users + `pristine: MATCH`.
- **Gate**: lint 0/0 (enforced) · tsc 0 · **1180/1180 unit (75 suites,
  +8)** · build clean · **111/111 e2e on a fresh CI=1 boot** (all 7
  mobile-nav checks green).
- **LIVE**: the fix surfaces render (Leads: the Won vs Lost chart with
  Jun–Sep data + the funnel + the KPI quartet; Calendar: the KPIs + the
  October grid with chips). The standing battery: the drawer both
  directions (288px portal, 8/8 truly visible, aria-expanded, dual
  lock; Escape → 0/8 [with `{visibilityProperty:true}`] + unlocked);
  zero 390px overflow on all ten routes (both Dashboard casings); NO
  Tailwind v4 bug (blur(4px) + the exact pinned shadow, probe-verified
  on a live element). Zero probe residue through the seam (the closing
  census MATCH).
- **Screenshots**: 02/11/12 re-captured +
  **62-leads-won-vs-lost NEW** (1440×900: the Won vs Lost Over Time
  chart — the N-53d fix surface). **62 VLM-verified 4/4** (the chart +
  months + legend + grouped bars; the chrome normal); 02/11/12
  VLM-verified.
- **Docs**: README (badge 1291 + the session-53 paragraph + the suite
  comment + the Tested row); AGENTS (1180/111 + the db:census row + the
  session-53 block); CLAUDE (1180 ×3 + the db:census row + the
  census-method anti-pattern); PAD (the s53 test-inventory row / 75
  suites / the Total / the checklist / the command table); SKILL
  **v1.50.0** (frontmatter + project_state + the H1 + the new §16as);
  `docs/session_99.md`; this record; both worklogs.
  `.env`/`.env.example` re-verified (no env surface change).
- **Shipped**: commit on main + the SSH-wrapper push to
  `git@github.com:nordeim/neo-crm.git` (the operator ed25519,
  shredded after — the s43–s52 runbook).
