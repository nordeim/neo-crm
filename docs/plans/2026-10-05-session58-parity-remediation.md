# Session-58 Parity Remediation Plan (2026-10-05)

Session 58 on `main` @ `d33a90d` (= the session-57 code `a2a1d1c` + the
operator's `docs/session_108.md` transcript commit; zero app-code drift —
`git diff a2a1d1c..d33a90d --stat` = 1 docs file, 92 insertions). Workspace
INTACT from s57 (no sandbox reset): the tree refreshed by `git pull`
(a2a1d1c..d33a90d, docs-only). **Baseline gate on the intact tree: lint 0/0
(enforced) · tsc 0 · 1194/1194 unit (75 suites)** — the documented state
exact. The DB census through the sanctioned seam:
`database: file:/home/z/my-project/neo-crm/db/custom.db` + counts 15/24/10/23/12
+ 4 users + `pristine: MATCH`. The `skills/` exclusion verified in all three
configs (vitest include allowlist, eslint ignores, tsconfig exclude). The
OUTER sandbox-root `.env` hazard (a `DATABASE_URL=file:/home/z/my-project/db/custom.db`
pointing at the mirror db — the documented s53 class) found at intake and
QUARANTINED as `.env.quarantined-s58`; the s57 zombie dev server on :3000
killed (the s51 lesson) — ports 3000/3100 clear at intake.

## The standing layers (54th session, NO DRIFT)

Drift sweep #54: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, curl) — size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` **exact — the 29th consecutive stable
session**. Reference census #54 (agent-browser, live login): the demo data
still zero (Total Leads 0 + "+5.3%", `$0.0k`/`$0.0k`/`$0k`, `0%`/`0%`); the
mobile-nav defect stands at a TRUE 390px (nav w=0, links in DOM, 0
visible, scrollW 390, NO hamburger); desktop nav normal; a reference
390px screenshot captured (docs/screenshots/reference-390-s58.png).

## The audits (two parallel agents + manual validation of every claim)

### A. The session-57 re-audit (58-a, fresh eyes on the 5b86880..a2a1d1c diff)

All eight checklist items verified GENUINE at file:line — the usersTotal
retirement (zero `usersTotal` tokens in src; the `users` destructure gone;
`onSaved={fetchUsers}` + the keyed remount live; tsc clean), the
UPLOADS_DIR_NAME export narrowing (`const` at :19, the internal consumer
at :78, the record comment), the nav-config mt-auto comment, the two
Avatar-attribution corrections (accounts-page, both files), the
page-parts ten-export count (verified by counting: exactly 10), the s57
describe (exactly 2 RED + 1 guard), and the counts by run (75 files
1194/1194). **The non-vacuousness mechanically REPLAYED** in a pre-fix
5b86880 worktree (node_modules hard-linked): **2 failed | 25 passed (27)**
— the commit's arithmetic reproduced to the digit; the guard
green-through-RED. Worktree cleaned; `git worktree list` = the main
checkout only. ONE sub-claim inaccuracy found (see the findings below):
the s57-corrected line citation is already off by one again.

### B. The graduation audit (58-b: the ledger + the fresh-eyes sweep)

**ZERO graduations — 13/13 CONFIRMED (15th consecutive session).** The
drift map since 57-b: line-only, substance identical on all items. The
INFO family ALL UNCHANGED (F-47c, N-48c, N-48f, N-48j, N-51c — anchors
verified, substance identical). Both operator decisions' code anchors
STANDING (the CSV (b) guard in both families + the `-` exclusion; all
retired vocabulary tokens absent from executable src; the stock-mirror
KEEP intact + guard-pinned). The fresh-eyes sweep (24 files read in full
— the API routes, the store, api/auth/rate-limit libs, topbar/sidebar/
app-shell, the mobile-nav spec — plus three repo-wide mechanical
censuses): the orphaned-import census CLEAN (all 104 src files,
comment-stripped, per-token counts — ZERO), the never-caching memo
census CLEAN (all 17 useMemo/useCallback sites stable), the PROP variant
zero (all props read; the store users slice has its live reader at
activities-page:476) — with the **N-58 family** below.

### C. The findings (all manually validated at file:line this session)

- **N-58a (LOW, dead alias export — the N-57b EXPORT-variant class)**:
  `src/stores/crm-store.ts:339` — `export { call as apiCall };`. The
  only repo-wide `apiCall` reference is the export line itself (grep
  src/tests/scripts/prisma: exactly one hit). Zero consumers, not even
  tests; dead since the initial commit (git -S: never touched again).
  The aliased `call` stays alive internally (every store action feeds
  through it at :28-44). FIX: remove the alias export line entirely.
- **N-58b (LOW, definition-only TYPE exports — the fully-dead class,
  TYPE variant; 4 members)**: exports whose ONLY reference repo-wide is
  the definition itself — not even their own file consumes them:
  1. `src/types/index.ts:271` — `export interface SearchResult` —
     DOUBLY dead: zero consumers AND shape-inaccurate (it claims full
     `Account[]/Contact[]/Lead[]` entities while the live topbar
     consumes its own slimmer inline row shape — the type documents a
     surface that never existed in that form). Carrier:
     neo-crm_SKILL.md §20 (:4838) mirrors the line — must follow.
  2. `src/lib/constants.ts:14` — `export type LeadStage =
     (typeof LEAD_STAGES)[number]` (the only other `LeadStage` hits
     repo-wide are the `defaultLeadStage` settings field — a different
     identifier; prisma/schema.prisma:236 + seed + the settings route).
  3. `src/lib/constants.ts:380` — `export type ActivityType = …` —
     definition-only.
  4. `src/lib/constants.ts:400` — `export type EventType = …` —
     definition-only.
  Zero test pins; zero doc claims of any of the four as living
  vocabulary (grep-clean across the five docs; the SKILL §20 carrier
  is the only mention).
- **N-58c (INFO, the dead-export-keyword class at scale — ~20 members)**:
  export keywords with ZERO external consumers but the values/types
  alive internally (each verified by comment-stripped word-boundary
  census): api.ts `ApiError`/`ApiResult` (alive via the `satisfies`
  at :11/:15), auth.ts `SESSION_TTL_MS`/`SessionPayload`, crm-store.ts
  `CrmState` (`create<CrmState>` :114), format.ts `formatDateShort`
  (timeAgo :127), pdf-export.ts `generatedDate` (:114),
  account-health.ts `NO_ACTIVITY_DAYS`/`daysSince`/`HealthState`,
  db-path.ts `DEFAULT_DATABASE_URL` (:160), saved-reports.ts
  `encodeSavedReports`/`decodeSavedReports` (:208/:187), page-parts.tsx
  `DeltaText`/`DeltaBadgeText` (the in-file siblings KpiCard :177 /
  BarStatCard :258), nav-config.ts `NavItem`, csv-templates.ts
  `CsvTemplate`, entity-edit-dialog.tsx `EditSelectOption`/
  `EditFieldSpec`, rate-limit.ts `RateLimitResult`, reports-data.ts
  `ClosedOppMonthRow`/`AgingRow`/`AccuracyOppInput`/`AtRiskOppRow`/
  `AtRiskActivityRow`. Disposition: the boundary decision below — KEEP,
  guard-pinned.
- **58-a correction (the chronic self-shift class)**:
  `tests/dead-code-hygiene.test.ts:267` — the s57-corrected citation
  "timeAgo is LIVE in activities-page:384" is off by one at HEAD: the
  token sits at `:385` (the containing `<p>` opens at :384). The s57
  comment correction itself grew the activities comment block by one
  line, self-shifting the token — the exact failure mode the :381→:384
  refresh replaced. Comment-only fix.

## The operator decisions (session 58)

1. **The CSV formula-injection posture (b) STANDS** (16th consecutive
   re-affirmation). Anchors verified by 58-b (csv.ts:31-33 the
   `/^[=+@\t\r]/` guard with `-` deliberately excluded, applied inside
   `escapeCell` :35-37 + entity-export.ts:43 `qq`; the three static
   templates outside the guard — csv-templates.ts imports nothing from
   csv.ts; parseCsv untouched); the reference bundle byte-identical for
   the 29th consecutive session — no new evidence; the data-flow
   scoping remains correct.
2. **The source-vocabulary documented parity STANDS AND EXTENDS to the
   N-58 family WITH the module type-contract boundary** (the N-56e
   mechanism applied to app-owned modules):
   - **Fully-dead surfaces retire** (the s48/s49/s54 policy): the
     zero-consumer ALIAS export `apiCall` (N-58a — an alias implies an
     external consumption convention that never existed; the N-57b
     EXPORT-variant class) and the four definition-only TYPE exports
     (N-58b — zero references anywhere including their own files; the
     s54 fully-dead class, TYPE variant; `SearchResult` doubly so: its
     shape documents a surface that never lived).
   - **The internally-live export keywords KEEP** (N-58c, ~20 members):
     every member is ALIVE within its module (consumed by in-file
     siblings or its own signatures) — this is dead-export-KEYWORD
     surface, not dead code; the keywords form each module's declared
     contract surface (consumable types/values for future callers —
     the idiomatic module design). Wholesale narrowing buys zero
     behavior, re-creates the comment-churn treadmill on the
     just-corrected s57 carriers (page-parts' ten-living-exports
     comment), and the class is better pinned than swept. The boundary
     is pinned by a new guard test so it survives future fresh-eyes
     sweeps (the N-56e precedent — a documented, guard-pinned KEEP,
     not a silent one).
   - The vendored ui stock-surface mirror stays whole (the N-56e
     boundary, unchanged). The store's `call` helper stays (internal,
     the sanctioned client seam's engine).

## The families

### S58-P1 — the comment-accuracy carrier (the 58-a correction)

- dead-code-hygiene.test.ts:267: "timeAgo is LIVE in activities-page:384"
  → ":385" (the s57 comment growth self-shifted the token — the chronic
  self-shift class, second generation).

### S58-P2 — the dead-surface narrowing (N-58a + N-58b)

- crm-store.ts:339: the `export { call as apiCall };` line removed;
  a record comment left at the site (the N-57b precedent: the value
  stays, the dead export surface goes — here the whole alias line).
- types/index.ts:271-275: the `SearchResult` interface retired with a
  record comment (zero consumers AND shape-inaccurate — the topbar
  consumes its own slimmer inline shape; the type documented a surface
  that never existed in that form).
- constants.ts:14: `export type LeadStage = (typeof LEAD_STAGES)[number];`
  retired with a record comment (definition-only since birth; the
  s48/s49/s54 retirement policy, TYPE variant).
- constants.ts:380: `export type ActivityType = …` retired (same class,
  one record comment).
- constants.ts:400: `export type EventType = …` retired (same class,
  one record comment).
- neo-crm_SKILL.md §20 (:4838): the `SearchResult` line removed from
  the types-barrel code block (the doc carrier follows the code).

### S58-P3 — the pin set (RED-first)

The new `describe("session-58: the dead-surface narrowing + the
type-contract boundary (S58-P1/P2)")` in tests/dead-code-hygiene.test.ts
— 4 its = 3 RED + 1 guard:
1. RED: crm-store carries no `apiCall` token (the N-58a dead alias
   export retired).
2. RED: types/index.ts carries no `SearchResult` token (the N-58b-1
   definition-only interface retired).
3. RED: constants.ts carries none of the three definition-only derived
   types (`LeadStage`, `ActivityType`, `EventType` — word-boundary
   matches; LEAD_STAGES/ACTIVITY_TYPES/EVENT_TYPES and their _META maps
   are different tokens and stay).
4. GUARD: the living surfaces stay — crm-store still defines the
   module-scope `async function call` (every action's engine), constants
   still exports the three arrays (`LEAD_STAGES`/`ACTIVITY_TYPES`/
   `EVENT_TYPES`), AND the N-58c module type-contract boundary holds
   (the representative KEEP set still exported: `ApiError` + `ApiResult`
   in api.ts, `DeltaText` + `DeltaBadgeText` in page-parts.tsx,
   `RateLimitResult` in rate-limit.ts, `CrmState` in crm-store.ts) —
   the boundary pinned so future sweeps don't re-litigate it.

**RED arithmetic**: add 4 its (1194 → 1198); the RED run = 3 failed (the
new RED trio) / 1195 passed (1198 total). No stale its to retire (zero
test pins on any retired token — verified by grep before this plan).

### S58-P4 — the docs carriers

- README.md: the badge (1306 → 1309) + the Tested row (1194 → 1198) +
  the session-58 paragraph.
- AGENTS.md: the counts (1194 → 1198 ×2) + the session-58 block.
- CLAUDE.md: the counts (1194 → 1198 ×3).
- PAD: the s58 test-inventory row + the Total (1198 + 112).
- neo-crm_SKILL.md: v1.55.0 — frontmatter (version + last_updated +
  project_state) + the H1 + the new §16ax (the TYPE-variant lesson: the
  definition-only type exports are the fully-dead class's TYPE variant —
  a type with zero references anywhere is dead vocabulary even though it
  "documents" a shape; AND the module type-contract boundary: internally
  consumed export keywords are the declared contract surface, KEEP +
  guard-pinned, the N-56e mechanism applied to app-owned modules) + the
  s58 session record row + the §20 SearchResult carrier fix.
- docs/session_109.md: the session record.
- The plan's own execution record + both worklogs.
- `.env`/`.env.example` re-verified (no env surface change expected —
  the example already matches the three-var code surface exactly:
  DATABASE_URL / AUTH_SECRET / NEXT_PUBLIC_SITE_URL).

### S58-P5 — the verification suite

- **Non-vacuousness proof**: a pre-fix `d33a90d` worktree (node_modules
  hard-linked via cp -al), the post-fix dead-code-hygiene.test.ts copied
  in as the ONLY change → the 3-RED set must fail there; cleanup after.
- **Full gate**: lint 0/0 · tsc 0 · 1198/1198 unit (75 suites, +4) ·
  build clean · 112/112 e2e on a fresh CI=1 boot (all 7 mobile-nav
  checks green).
- **LIVE battery**: the fix surface renders (the topbar Search popover
  — the would-be SearchResult consumer — with typed results + the
  popover contract); the standing drawer battery both directions at a
  TRUE 390px; zero 390px overflow on all ten routes; the Tailwind v4
  token contract probe (blur 4px + the exact pinned shadow); zero probe
  residue through the seam (db:census MATCH).
- **Screenshots**: the standing set (02/11/12) re-captured + one NEW
  fix-surface shot (67-topbar-search.png — the search popover with
  results open, the surface whose dead type retired, at 1440×900) —
  VLM-verified per the house convention.
- **Ship**: the commit + the SSH-wrapper v3 push to main + the remote
  verification + the operator key shredded.

## The blast-radius pre-check (validated before this plan)

- `apiCall`: zero test pins; zero src/tests/scripts/prisma consumers
  (the single grep hit is the export line itself).
- `SearchResult`: zero consumers repo-wide (the topbar's
  `SearchResultRow` is a different identifier — a local component);
  zero test pins; ONE doc carrier (SKILL §20 :4838 — included in
  S58-P2).
- `LeadStage`/`ActivityType`/`EventType`: zero non-definition
  references repo-wide (the `defaultLeadStage` settings field is a
  different identifier — prisma schema:236, seed:442, the settings
  route + its api-robustness pins all reference the FIELD, not the
  type); zero test pins; zero doc carriers.
- The N-58c KEEP set: zero changes (the boundary is pinned, not
  narrowed).
- The `call` helper: stays internal-and-alive (the store's own actions
  consume it); no store change beyond the one alias line.
- prisma / seed / scripts: untouched.

## Execution record (appended as executed)

- **RED** (exactly as planned): the dead-code-hygiene session-58
  describe added (3 RED + 1 guard — the guard pins the living surfaces
  AND the N-58c boundary: the store's `async function call` engine, the
  three arrays, and the representative KEEP set [ApiError/ApiResult,
  DeltaText/DeltaBadgeText, RateLimitResult, CrmState] stay exported).
  RED run: **exactly 3 failures**; full suite through RED: **3 failed /
  1195 passed (1198 total)**. No mid-flight repairs needed.
- **GREEN**: S58-P1 — the line-citation self-shift refresh
  (dead-code-hygiene.test.ts:267 ":384" → ":385", annotated as the
  chronic self-shift class, second generation). S58-P2 — the
  dead-surface narrowing: crm-store.ts the alias export line retired
  with the record comment; types/index.ts the SearchResult interface
  retired with the record comment (both the zero-consumer and the
  shape-inaccuracy grounds); constants.ts the three derived types
  retired with per-site record comments; the SKILL §20 carrier line
  replaced with the retirement note. Touched suite: **31/31**
  (dead-code-hygiene); lint 0/0; tsc 0.
- **Non-vacuousness**: pre-fix `d33a90d` worktree (node_modules
  hard-linked via cp -al) + the post-fix dead-code-hygiene.test.ts as
  the ONLY change → **3 failed | 28 passed (31)** — exactly the RED
  set; the guard green-through-RED. Worktree cleaned; `git worktree
  list` = the main checkout only.
- **Full gate**: lint 0/0 · tsc 0 · **1198/1198 unit (75 suites,
  +4)** · build clean (the one Turbopack warning pre-existing — the
  upload route) · **112/112 e2e** on a fresh CI=1 boot (2.6m).
- **LIVE battery**: the fix surface — the topbar Search popover renders
  its full contract (the typed query opens the grouped results dropdown:
  an Accounts row, Contacts rows, Leads rows with stage · value hints —
  through the module's own inline row shape, zero errors; the /api/search
  envelope 200 with results); the drawer both directions at TRUE 390px
  (the 288px panel, 8/8 truly visible, aria-expanded, the body+scroller
  dual lock, focus in panel; Escape → 0/8 truly visible +
  visibility:hidden + inert + unlocked); zero 390px overflow ×10 routes
  (both Dashboard casings); the Tailwind v4 token probe (`--blur-sm`
  4px + the exact pinned shadow on a live input); the closing db:census
  MATCH (zero probe residue).
- **Screenshots**: 02/11/12 re-captured + **67-topbar-search NEW**
  (1440×900, 108,737 B — the fix surface with the popover open) — all
  four VLM-verified (02 on the standing checklist: sidebar + KPI row +
  both charts + zero defects — the Recent Deals table below the fold at
  1440×900, the standing composition; the reference-390-s58.png census
  capture also saved).
- **Docs**: README (badge 1309, the session-58 paragraph, the Tested
  row, the command row), AGENTS (1198/112 + the session-58 block),
  CLAUDE (1198 ×3), PAD (the s58 inventory row, the Total, the tree
  row, the HEAD note), SKILL **v1.55.0** (frontmatter + project_state +
  H1 + §16ax, applied atomically via scripts/skill_edits_s58.py at the
  sandbox root — 5622 → 5692 lines, zero anchor repairs needed; the
  §20 SearchResult carrier removed), session_109.md, this record, both
  worklogs.
- **Env**: `.env`/`.env.example` re-verified — no env surface change
  (DATABASE_URL `file:../db/custom.db`, AUTH_SECRET,
  NEXT_PUBLIC_SITE_URL; the example matches the code's three-var
  surface exactly).
