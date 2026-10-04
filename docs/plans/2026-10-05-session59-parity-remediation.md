# Session-59 Parity Remediation Plan (2026-10-05)

Session 59 on `main` @ `dca98e9` (= the session-58 code `8b214ba` + the
operator's `docs/session_110.md` transcript commit; zero app-code drift —
`git diff 8b214ba..dca98e9 --stat` = 1 docs file, 91 insertions). Workspace
INTACT from s58 (no sandbox reset): the tree refreshed by `git pull`
(8b214ba..dca98e9, docs-only). **Baseline gate on the intact tree: lint 0/0
(enforced) · tsc 0 · 1198/1198 unit (75 suites)** — the documented state
exact. The DB census through the sanctioned seam:
`database: file:/home/z/my-project/neo-crm/db/custom.db` + counts 15/24/10/23/12
+ 4 users + `pristine: MATCH`. The `skills/` exclusion verified in all three
configs (vitest include allowlist, eslint ignores, tsconfig exclude). No
outer sandbox-root `.env` (the s58 quarantine held); the s58 zombie dev
server on :3000 killed at intake (the s51 lesson) — ports 3000/3100 clear.

## The standing layers (55th session, NO DRIFT)

Drift sweep #55: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, curl) — size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` **exact — the 30th consecutive stable
session**. Reference census #55 (agent-browser, live login): the demo data
still zero (Total Leads 0 + "+5.3%", `$0.0k`); the mobile-nav defect stands
at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible, scrollW 390,
NO hamburger); desktop nav normal (256px, 8 links); a reference 390px
screenshot captured (outside the repo, reference-screenshots/).

## The audits (two parallel agents + manual validation of every claim)

### A. The session-58 re-audit (59-a, fresh eyes on the d33a90d..8b214ba diff)

All nine checklist items verified GENUINE at file:line — the apiCall alias
retirement (zero tokens in src; the record comment at crm-store:339-343;
the `call` engine live with 30 internal sites), the SearchResult
retirement (record comment at types/index.ts:271-276; the topbar's
`SearchResultRow` a distinct identifier at topbar:240 consumed :149/:157/:165;
the shape-inaccuracy claim confirmed against the live inline state), the
three derived-type retirements (record comments at constants.ts:14-18/:384-386/:406-408;
arrays + META maps live; the `defaultLeadStage` FIELD distinct and untouched),
the SKILL §20 carrier followed, the S58-P1 :385 citation ACCURATE at HEAD
(no third-generation self-shift), the s58 describe exactly 3 RED + 1 guard
with the KEEP-set pins live, the counts consistent (31/31 on the suite by
run; 75 files), and the **non-vacuousness mechanically REPLAYED** in a
pre-fix d33a90d worktree: **3 failed | 28 passed (31)** — the commit's
arithmetic reproduced to the digit; the guard green-through-RED. THREE
narrative-level inaccuracies found (see the findings below).

### B. The graduation audit (59-b: the ledger + the fresh-eyes sweep)

**ZERO graduations — 13/13 CONFIRMED (16th consecutive session).** The
drift map since 58-b: line-only, substance identical on all items. The
INFO family ALL UNCHANGED (F-47c, N-48c, N-48f, N-48j, N-51c — anchors
verified, substance identical). Both operator decisions' code anchors
STANDING (the CSV (b) guard in both families + the `-` exclusion; all
retired vocabulary tokens absent from executable src; the stock-mirror
KEEP intact + guard-pinned; the N-58c module type-contract boundary guard
present at dch:411-466). The fresh-eyes sweep (23 files read in full — the
dashboard/reports/calendar/leads/settings pages, the entity-dialog family,
charts, the export/csv/format/lead-filters/reports-data libs, the types
barrel, prisma/seed.ts — plus the three mechanical censuses): the
orphaned-import census CLEAN, the dead-prop census finding exactly one
(N-59b), the dead-export census finding exactly one (N-59a), useMemo
dep-arrays complete, React-19 discipline clean.

### C. The findings (all manually validated at file:line this session)

- **N-59a (Info, dead type export — the s58 SearchResult class's missed
  sibling)**: `src/types/index.ts:162-168` — `export interface SavedReport`
  (the DB wire shape: id/name/tab/config/createdAt) has **zero references
  repo-wide including its own file**. The LIVE `SavedReport` is a
  different localStorage shape in `src/lib/saved-reports.ts:51`
  (filters/columns nesting — the s25 seam, consumed by
  save-report-dialog.tsx + the reports page). The types-barrel one is the
  type shadow of ledger-10's dead Prisma model (schema.prisma:220-226,
  whose only db consumer is the reset wipe + seed-time wipe). Not pinned
  by any guard. Disposition: RETIRE (the s48/s49/s54/s58 fully-dead
  policy, TYPE variant) + the SKILL §20 carrier (the interface line at
  :4908 region) follows.
- **N-59b (Low, dead prop — the N-56a/N-57c lint-invisible class,
  DESTRUCTURED variant)**: `src/components/shared/entity-edit-dialog.tsx`
  — `entityId` destructured at :143 + typed at :154 (`entityId?: string |
  null`) but **never read in the body** (zero occurrences after :160);
  passed by all three call sites (accounts-page:615, leads-page:723,
  contacts-page:938 — each `entityId={editTarget?.id ?? null}`). Exactly 5
  repo-wide refs, zero test refs, dead since s28 (git-verified: the
  component's birth commit 1864b5e). Lint-invisible (both no-unused-vars
  rules off; an unused DESTRUCTURED binding is exactly what the off rules
  would have caught). Disposition: RETIRE (drop the destructure + the
  prop-type member + the three call-site bindings; `editTarget` stays
  live through `initial` at every site).
- **59-a #1 (the user-visible doc arithmetic)**: README.md:8 — the badge
  reads `tests-1309 checks` but the convention (s56: 1303 = 1191+112; s57:
  1306 = 1194+112) demands 1198 + 112 = **1310**; the s58 record itself
  writes "badge 1309 = 1198 + 112" — self-contradictory. With s59's +3
  its the final badge becomes **1313** (1201 + 112). Disposition: FIX.
- **59-a #3 (the stale §20 line count)**: neo-crm_SKILL.md:4799 — "From
  `src/types/index.ts` (192 lines)" while the barrel is 276 lines at HEAD
  (staleness predates s58, but s58 edited §20 without refreshing it).
  Disposition: FIX alongside the N-59a carrier (the post-retirement
  count).
- **59-a #2 (narrative-only, no living carrier)**: the s58 records claim
  "5622 → 5692 lines" for the SKILL; actual 5621 → 5692 (the 5622
  inherited from session_107.md's own off-by-one). Historical session
  records stand as transcripts; this session's record states the SKILL
  line counts accurately. No code/doc change.
- **59-b observations (NOT findings)**: page-layout's 7 test-only pin
  tokens are the module's documented test-pin design; IconStatCard's
  optional `gradient` prop never passed (dormant, optional-and-harmless);
  ledger-10's "only db consumer is the reset wipe" omits seed.ts:37's
  seeding-time wipe (both deleteMany — a narrative tightening, recorded
  here, no doc carrier edit needed).

## The operator decisions (session 59)

1. **The CSV formula-injection posture (b) STANDS** (17th consecutive
   re-affirmation). Anchors verified by 59-b (csv.ts:31-33 the
   `/^[=+@\t\r]/` guard with `-` deliberately excluded, applied inside
   `escapeCell` :35-42 + entity-export.ts:43 `qq`; the three static
   templates outside the guard; parseCsv untouched); the reference bundle
   byte-identical for the 30th consecutive session — no new evidence; the
   data-flow scoping remains correct.
2. **The source-vocabulary documented parity STANDS AND EXTENDS to the
   N-59 family** (the standing policy, applied to this session's two
   fully-dead surfaces):
   - **Fully-dead surfaces retire** (the s48/s49/s54/s58 policy): the
     types-barrel `SavedReport` interface (N-59a — zero references
     anywhere INCLUDING its own file, AND shape-divergent from the live
     localStorage type of the same name; the type shadow of ledger-10's
     dead Prisma model — the model itself stays, its deferral unchanged)
     and the entity-edit-dialog `entityId` prop (N-59b — the
     lint-invisible dead-prop class, DESTRUCTURED variant, dead since
     s28).
   - The N-58c module type-contract boundary stays intact (guard-pinned
     at the s58 describe — internally-consumed export keywords KEEP).
   - The vendored ui stock-surface mirror stays whole (the N-56e
     boundary, unchanged).

## The families

### S59-P1 — the README badge arithmetic fix (59-a #1)

- README.md:8: `tests-1309%20checks` → `tests-1313%20checks` (the
  convention restored: 1201 unit + 112 e2e after this session's +3 its;
  the s58 −1 error corrected through the new total).

### S59-P2 — the dead-surface narrowing (N-59a + N-59b)

- `src/types/index.ts:162-168`: the `SavedReport` interface retired,
  replaced by a record comment (the s58 SearchResult style — the grounds:
  zero references repo-wide including its own file; the LIVE SavedReport
  is the localStorage shape in saved-reports.ts:51; the type shadow of
  ledger-10's dead Prisma model).
- `src/components/shared/entity-edit-dialog.tsx`: the `entityId`
  destructure (:143) + the prop-type member (:154) removed, with a
  record comment at the type site (the grounds: never read in the body;
  the N-56a class, DESTRUCTURED variant; dead since s28).
- The three call-site bindings removed: accounts-page.tsx:615,
  leads-page.tsx:723, contacts-page.tsx:938 (each
  `entityId={editTarget?.id ?? null}` — one line; `editTarget` stays
  live through `initial` at every site).

### S59-P3 — the SKILL §20 carriers (N-59a's carrier + 59-a #3)

- The `export interface SavedReport { … }` line removed from the §20
  types-barrel code block, replaced by the retirement note (the s58
  SearchResult precedent).
- The §20 header line count refreshed: "(192 lines)" → the post-S59-P2
  barrel count (275 — 276 minus the 7 retired lines plus the 6-line
  record comment).

### S59-P4 — the pin set (RED-first)

The new `describe("session-59: the dead-surface narrowing (S59-P2)")` in
tests/dead-code-hygiene.test.ts — 3 its = 2 RED + 1 guard:

1. RED: types/index.ts carries no `SavedReport` interface (the N-59a
   retirement; word-context match on the barrel source after
   comment-stripping).
2. RED: entity-edit-dialog.tsx carries no `entityId` token (the N-59b
   dead prop retired — destructure, type member, and the record comment
   all comment-stripped).
3. GUARD: the living surfaces stay — saved-reports.ts still exports its
   own `export interface SavedReport` (the LIVE localStorage shape: the
   filters/columns nesting, dateRange + wonDate), the dialog still
   destructures + uses its living props (`initial`, `fields`, `onSubmit`,
   `title`), and the three pages still bind `fields={` and `initial={{`
   (the edit dialogs' real contract surface).

**RED arithmetic**: add 3 its (1198 → 1201); the RED run = 2 failed (the
new RED pair) / 1199 passed (1201 total). No stale its to retire (zero
test pins on either token — verified by grep before this plan: the
entityId grep across tests/ exits 1; the saved-reports tests read
src/lib/saved-reports.ts, never the barrel's interface).

### S59-P5 — the docs carriers

- README.md: the badge (1309 → 1313) + the Tested row (1198 → 1201) + the
  session-59 paragraph.
- AGENTS.md: the counts (1198 → 1201 ×2) + the session-59 block.
- CLAUDE.md: the counts (1198 → 1201 ×3).
- PAD: the s59 test-inventory row + the Total (1201 + 112).
- neo-crm_SKILL.md: v1.56.0 — frontmatter (version + last_updated +
  project_state) + the H1 + the new §16ay (the lesson: the fully-dead
  class's TYPE variant had a MISSED SIBLING found only by a
  complementary-sweep rotation — the s58 sweep of the types barrel
  checked SearchResult's neighbors' imports, not every interface's
  consumers; AND the DESTRUCTURED dead-prop variant: an unused
  destructured binding is exactly what the OFF no-unused-vars rules
  would have flagged — the class's third face after the IMPORT (s56) and
  PROP-TYPE (s57c) variants) + the s59 session record row + the §20
  carriers (S59-P3).
- docs/session_111.md: the session record.
- The plan's own execution record + both worklogs.
- `.env`/`.env.example` re-verified (no env surface change expected —
  the example matches the three-var code surface exactly: DATABASE_URL /
  AUTH_SECRET / NEXT_PUBLIC_SITE_URL).

### S59-P6 — the verification suite

- **Non-vacuousness proof**: a pre-fix `dca98e9` worktree (node_modules
  hard-linked via cp -al), the post-fix dead-code-hygiene.test.ts copied
  in as the ONLY change → the 2-RED set must fail there (expect 2 failed
  | 32 passed of 34); cleanup after.
- **Full gate**: lint 0/0 · tsc 0 · 1201/1201 unit (75 suites, +3) ·
  build clean · 112/112 e2e on a fresh CI=1 boot (all 7 mobile-nav
  checks green).
- **LIVE battery**: the fix surfaces render — the entity edit dialog
  (the N-59b surface: open Edit Contact on a seeded row, verify the
  field set + initial values + the save round-trip) and the saved-reports
  seam (the N-59a context: the LIVE SavedReport's save/load round-trip on
  the reports page); the standing drawer battery both directions at a
  TRUE 390px; zero 390px overflow on all ten routes; the Tailwind v4
  token contract probe (blur 4px + the exact pinned shadow); zero probe
  residue through the seam (db:census MATCH).
- **Screenshots**: the standing set (02/11/12) re-captured + one NEW
  fix-surface shot (68-entity-edit-dialog.png — the Edit Contact dialog
  open at 1440×900) — VLM-verified per the house convention.
- **Ship**: the commit + the SSH-wrapper v3 push to main + the remote
  verification + the operator key shredded.

## The blast-radius pre-check (validated before this plan)

- `SavedReport` (the barrel's): zero code consumers (the live-reports
  seam consumes saved-reports.ts's own type); zero test pins (the
  saved-reports/storage-read-guards suites read src/lib/saved-reports.ts);
  ONE doc carrier (SKILL §20's code block + the line-count header —
  included in S59-P3); the Prisma model + reset/seed wipes untouched
  (ledger-10's deferral unchanged).
- `entityId`: zero test pins (grep across tests/ exits 1; the
  entity-edit-dialog/source-vocabulary/contact-photo suites pin other
  tokens); zero doc carriers (grep across the five living docs is
  empty); the 3 call-site removals each leave `editTarget` live through
  `initial`; tsc-clean only as a complete set (the prop-type member +
  the call-site bindings must retire together — an excess-property
  error otherwise).
- The N-58c KEEP set + the stock mirror: zero changes (guard-pinned,
  not re-litigated).
- prisma / seed / scripts: untouched.
- The e2e suite: zero entityId/SaveReport-barrel references (the crm
  spec drives the edit dialogs through their rendered behavior, not the
  prop).

## Execution record (appended as executed)

- **RED** (exactly as planned): the dead-code-hygiene session-59
  describe added (2 RED + 1 guard — the guard pins the LIVE
  SavedReport in saved-reports.ts [dateRange + wonDate], the dialog's
  living props [initial/fields/onSubmit], and the three pages'
  fields/initial bindings). RED run: **exactly 2 failures**; full
  suite through RED: **2 failed / 1199 passed (1201 total)**. No
  mid-flight repairs needed.
- **GREEN**: S59-P1 — the README badge arithmetic fix (1309 → 1313 =
  1201 + 112; the Tested row + the test command row updated with it).
  S59-P2 — the dead-surface narrowing: types/index.ts the SavedReport
  interface retired with the record comment; entity-edit-dialog.tsx
  the entityId destructure + prop-type member retired with the record
  comment; the three call-site bindings removed (accounts :615, leads
  :723, contacts :938 — one line each). S59-P3 — the SKILL §20
  carriers: the interface line retired + the "(192 lines)" header
  refreshed to the post-fix 277 (the barrel: 276 − 7 retired + 8
  comment lines = 277). Touched suite: **34/34** (dead-code-hygiene);
  lint 0/0; tsc 0.
- **Non-vacuousness**: pre-fix `dca98e9` worktree (node_modules
  hard-linked via cp -al) + the post-fix dead-code-hygiene.test.ts as
  the ONLY change → **2 failed | 32 passed (34)** — exactly the RED
  set; the guard green-through-RED. Worktree cleaned; `git worktree
  list` = the main checkout only; the main node_modules intact
  (sanity db-path suite 20/20 after cleanup).
- **Full gate**: lint 0/0 · tsc 0 · **1201/1201 unit (75 suites,
  +3)** · build clean (the one Turbopack warning pre-existing — the
  upload route) · **112/112 e2e** on a fresh CI=1 boot (2.6m).
- **LIVE battery**: the fix surfaces — the entity edit dialog renders
  its full contract (the ellipsis menu → Edit Contact with the
  populated field set + Status/Source selects + Cancel/Save Changes;
  the save round-trip closes cleanly, 15 rows intact, zero errors) and
  the saved-reports seam round-trips through the LIVE localStorage
  shape (save → `crm_saved_reports` with dateRange + wonDate → count
  (0)→(1) → Load re-applies → the probe cleared, zero residue); the
  drawer both directions at TRUE 390px (the 288px inner panel, 8/8
  truly visible, aria-expanded, the body+scroller dual lock, focus in
  panel; Escape → 0/8 truly visible + visibility:hidden + inert +
  unlocked); zero 390px overflow ×10 routes (both Dashboard casings);
  the Tailwind v4 token probe (`--blur-sm` 4px + the exact pinned
  shadow on a live input); the closing db:census MATCH (zero probe
  residue).
- **Screenshots**: 02/11/12 re-captured + **68-entity-edit-dialog NEW**
  (1440×900, the fix surface with the dialog open) — all four
  VLM-verified (02: sidebar + six KPI cards + both charts + zero
  defects; 11: hamburger + stacked KPI cards + no overflow; 12: the
  drawer + 8 links + X + dimmed overlay; 68: the dialog + populated
  fields + Cancel/Save + zero defects).
- **Docs**: README (badge 1313, the session-59 paragraph, the Tested
  row, the command row), AGENTS (1201/112 + the session-59 block),
  CLAUDE (1201 ×3), PAD (the s59 inventory row, the Total, the
  counting-convention note, the tree row), SKILL **v1.56.0**
  (frontmatter + project_state + H1 + §16ay, applied atomically via
  scripts/skill_edits_s59.py at the sandbox root — 5697 → 5764 by the
  script's count [5763 by wc]; zero anchor repairs needed; the §20
  carriers landed pre-script), session_111.md, this record, both
  worklogs.
- **Env**: `.env`/`.env.example` re-verified — no env surface change
  (DATABASE_URL `file:../db/custom.db`, AUTH_SECRET,
  NEXT_PUBLIC_SITE_URL; the example matches the code's three-var
  surface exactly).
