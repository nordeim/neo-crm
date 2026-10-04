# Session-56 Parity Remediation Plan (2026-10-04)

Session 56 on `main` @ `f7ca140` (= the session-55 code `9207d8d` + the
operator's `docs/session_104.md` transcript commit; zero app-code drift —
`git diff 9207d8d..f7ca140 --stat` = 1 docs file, 85 insertions). Workspace
INTACT this session (no sandbox reset — the s55 environment survived: bun
node_modules present, `.env` at `DATABASE_URL="file:../db/custom.db"` +
AUTH_SECRET, db/custom.db seeded, NO outer sandbox-root `.env` hazard, no
zombie :3000/:3100 listeners). Baseline gate on the tree: **lint 0/0
(enforced) · tsc 0 · 1184/1184 unit (75 suites)** — the documented state
exact. The DB census through the sanctioned seam: `database:
file:/home/z/my-project/neo-crm/db/custom.db` + counts 15/24/10/23/12 + 4
users + `pristine: MATCH`. `skills/` exclusion verified in all three configs
(vitest include allowlist, eslint ignores, tsconfig exclude).

## The standing layers (52nd session, NO DRIFT)

Drift sweep #52: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, curl) — size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` **exact — the 27th consecutive stable
session**. Reference census #52 (agent-browser, live login): the demo data
still zero (Total Leads 0 + "+5.3%", `$0.0k`/`$0.0k`/`$0k`, `0%`/`0%`); the
mobile-nav defect stands at a TRUE 390px (nav w=0, 8 links in DOM, 0
visible, scrollW 390). Desktop nav normal (256px, 8/8 visible).

## The audits (two parallel agents + manual validation of every claim)

### A. The session-55 re-audit (56-a, fresh eyes on the d4b6a61..9207d8d diff)

All nine checklist items verified GENUINE at file:line — the reports-page
four-import narrowing (record comment :13-19; survivors CircleStatCard 10 /
PageHeader 2 / Sparkline 5; each orphan exactly 1 pre-fix in-file reference,
`git show d4b6a61:` verified); the format.ts pair retirement (:256-261
record comment; format.test.ts 28→25 its); the lead-filters.ts pair
retirement (:69-74/:107 record comments; decodeSavedLeadViews validates
through asFilters :137); the 4 encode/decode its re-anchored to the
saved-views pair (18→18); the PAD row (:1278 — the old row doubly stale);
the hygiene describe 5 its = 4 RED + 1 guard; counts BY RUN (75 files
1184/1184; `--list` 112 in 4 files = 95+9+7+1); diff hygiene exact (7 code
files, zero suppressions, zero prisma drift); the non-vacuousness
MECHANICALLY REPLAYED in a pre-fix d4b6a61 worktree (4 failed | 55 passed,
failing set = its 1/2/3/5 exactly; 59/59 at the fix); docs GENUINE (badge
1296, SKILL v1.52.0 + §16au, session_103.md, 64-reports-page.png 86,193 B).
One NANO: the s53 pin's it title at dead-code-hygiene.test.ts:81 still
says "(the reports page owns it)" — stale since N-55e (→ N-56d here).

### B. The graduation audit (56-b: the ledger + the fresh-eyes sweep)

**ZERO graduations — 13/13 CONFIRMED (13th consecutive session)**. The drift
map since 55-b: EMPTY (every anchor byte-identical). The INFO family ALL
UNCHANGED (F-47c, N-48c, N-48f, N-48j, N-51c — line-only sub-anchor drifts,
substance identical). Both operator decisions' code anchors STANDING (the
CSV (b) guard in both families + the `-` exclusion; all 17 retired
vocabulary tokens absent from executable src). The e2e sleep census at
exactly 2 annotated keeps (crm.spec.ts:454 + :2283). Counts exact BY RUN
(75 files 1184/1184; 112 in 4 files).

### C. The findings (all manually validated at file:line this session)

- **N-56a (FIX, the N-53c/N-55a class)**: TWELVE lint-invisible orphaned
  imports across six files, each with exactly one in-file reference (the
  import itself) — git-verified: contacts-page ×6 (`Pencil` :17, `Avatar`
  :37, `DropdownSeparator` :49, `FILTER_RAIL` :51, `ENGAGEMENT_LEVELS` :63,
  `timeAgo` :67), accounts-page ×1 (`DropdownSeparator` :15),
  activities-page ×2 (`Cell` :18, `Avatar` :23), the dashboard page.tsx ×1
  (`EMPTY_STATE` :14), api/reports/route.ts ×1 (`addMonths` :20, orphaned
  since s31), charts.tsx ×1 (`import * as React` :44, dead since the
  initial commit — zero `React.` refs; page.tsx's own React import :20 is
  LIVE via React.useState and stays). The lint-invisibility root cause:
  eslint.config.mjs turns BOTH no-unused-vars rules off. The underlying
  exports stay alive EXCEPT addMonths (see N-56f).
- **N-56b (INFO→FIX, the s54 FULLY-DEAD class)**: page-parts.tsx:185
  `CardCaption` — fully dead export since the initial commit (zero src
  consumers, zero test refs; the other seven page-parts exports all live).
- **N-56c (INFO→FIX, the s25 stranding)**: ui/misc.tsx — the app-authored
  grab-bag module's sole export `EmptyState` is src-dead since s25 retired
  the loading layer (zero src consumers; the only reader is
  loading-layer.test.ts:84, the negative Skeleton pin). The whole module
  retires; the pin re-anchors (the s54/s55 re-anchor precedent). misc.tsx
  is NOT part of the vendored stock mirror — it is app-authored (it held
  Skeleton, then EmptyState).
- **N-56d (NANO, the sibling-carrier class)**: dead-code-hygiene.test.ts:81
  — the it title still carries the stale "(the reports page owns it)"
  parenthetical that N-55e corrected in source.
- **N-56e (INFO, operator call → KEEP)**: the vendored ui stock-surface
  unused exports (CardDescription/CardFooter, DialogClose/DialogTrigger,
  DropdownLabel, SelectGroup/SelectLabel/SelectSeparator + the unconsumed
  buttonVariants/DialogOverlay/DialogPortal) — CardDescription's only
  "references" are settings-page COMMENTS (:171/:472).
- **N-56f (FIX, found at validation — the s55 N-55b class exactly)**:
  format.ts `addMonths` (:169) becomes TEST-ONLY after the api/reports
  import narrowing (src-wide consumers = the orphaned import + the
  definition; the sole other consumers are tests/format.test.ts:11/:132-137).
  Per the extended source-vocabulary decision it retires WITH its stale it.
  **CORRECTIONS to the audit reports, validated**: `timeAgo` is NOT
  test-only (activities-page:381 consumes it live) — only the contacts
  import narrows, the export STAYS.

## The operator decisions (session 56)

1. **The CSV formula-injection posture (b) STANDS** (14th consecutive
   re-affirmation). Anchors verified by 56-b (csv.ts:31-33/:37 +
   entity-export.ts:43); the reference bundle byte-identical for the 27th
   consecutive session — no new evidence; the data-flow scoping remains
   correct.
2. **The source-vocabulary documented parity STANDS AND EXTENDS to the
   N-56 family WITH ONE EXPLICIT BOUNDARY**: the retirement policy covers
   APP-OWNED vocabulary (the 12 orphaned imports, the fully-dead CardCaption
   export, the app-authored misc.tsx module, the becomes-test-only
   addMonths) but does NOT extend to the vendored ui stock-surface mirror
   (N-56e = KEEP): the ui/ named primitives mirror the reference's own
   stock component library (the s10 stock-primitive layer pinned their
   internals), the mirror's completeness is part of the parity contract,
   tree-shaking keeps the bundle byte-identical, and retiring vendored
   exports would diverge the mirror from stock with zero behavioral value.
   **The KEEP is pinned by a new guard test so the boundary is durable.**

## The families

### S56-P1 — the twelve-orphaned-import narrowing (N-56a)

Six files, one record comment per file, imports narrowed in place:
- contacts-page.tsx: `Pencil` out of the lucide block (:17); `Avatar`
  import line deleted (:37); `DropdownSeparator` out of the dropdown import
  (:49); `FILTER_RAIL` out of the page-layout import (:51 — CONTACTS_LAYOUT
  / PAGE_KPI_GRIDS / TABLE_CARD stay); `ENGAGEMENT_LEVELS` out of the
  constants block (:63 — the other eight stay); `timeAgo` import line
  deleted (:67). ONE record comment above the lucide block.
- accounts-page.tsx: `DropdownSeparator` out of the dropdown import (:15 —
  the other five stay) + the record comment.
- activities-page.tsx: `Cell` out of the recharts import (:18 — the other
  seven stay); `Avatar` import line deleted (:23) + the record comment.
- page.tsx (dashboard): `EMPTY_STATE` out of the page-layout block (:14 —
  the other nine stay) + the record comment.
- api/reports/route.ts: `addMonths` out of the format import (:20 — the
  other five stay) + the record comment.
- charts.tsx: the `import * as React from "react"` line deleted (:44) + the
  record comment.

### S56-P2 — the dead-export/module retirement (N-56b/N-56c/N-56f)

- page-parts.tsx: the `CardCaption` function (:185) retired with the record
  comment (the s54 FULLY-DEAD precedent).
- ui/misc.tsx: the WHOLE MODULE deleted (sole export src-dead since s25).
- format.ts: `addMonths` (:169-…) retired with the record comment (the s55
  test-only-seam precedent; the date-arithmetic siblings stay).
- tests/format.test.ts: the stale "adds months with end-of-month clamping"
  it (:132-137) retired + the `addMonths` import token (:11) — 25→24 its;
  the "relative time" describe KEEPS both its (timeAgo is live).
- tests/loading-layer.test.ts: the 3rd it re-anchored — from "the ui kit no
  longer exports a Skeleton component" (reads misc.tsx, asserts
  not.toBeNull + no Skeleton) to "the misc.tsx module itself is retired"
  (asserts the file is GONE — the strongest form of the no-Skeleton
  contract; EmptyState was its sole, src-dead export). 8 its → 8 its.

### S56-P3 — the stale it-title carrier (N-56d)

dead-code-hygiene.test.ts:81: the title's "(the reports page owns it)"
parenthetical corrected to the shared-palette truth (matching the s55
N-55e source correction). Title-only; the assertion stays.

### S56-P4 — the docs carriers

- PAD: the loading-layer test-inventory row (:681) gains the misc-module
  retirement note (session-56); the test-inventory Total + the
  counting-convention note at 1191+112 (badge 1303); the s56
  test-inventory row for the new describe.
- CLAUDE.md: the loading-layer suite description (:192-196 — the misc.tsx
  module now fully retired, session-56); the 1184→1191 count carriers (×3).
- README.md: the badge (1296→1303) + the Tested row + the session-56
  paragraph + the test command row.
- AGENTS.md: the session-56 block + the count carriers (1184/112→1191/112).
- neo-crm_SKILL.md: v1.53.0 — frontmatter + project_state + the H1 + the
  new §16av (the orphaned-import sweep + the stock-mirror boundary lesson)
  + the s56 session record row.
- docs/session_105.md: the session record.
- The plan's own execution record + both worklogs.
- `.env`/`.env.example` re-verified (no env surface change expected).

### S56-P5 — the pin set (RED-first)

The new `describe("session-56: the orphaned-import sweep + the
dead-module retirement (S56-P1/P2/P3)")` in tests/dead-code-hygiene.test.ts
— 8 its = 6 RED + 2 guards:
1. RED: contacts-page carries none of the six orphaned imports (Pencil,
   Avatar, DropdownSeparator, FILTER_RAIL, ENGAGEMENT_LEVELS, timeAgo).
2. RED: accounts-page + activities-page carry none of their three orphans
   (DropdownSeparator; Cell, Avatar).
3. RED: the dashboard page + the reports route + charts.tsx carry none of
   their three orphans (EMPTY_STATE; addMonths; the React namespace
   import).
4. RED: page-parts no longer exports CardCaption (N-56b).
5. RED: the misc.tsx module is retired — EmptyState's whole module (N-56c).
6. RED: format.ts no longer exports addMonths (N-56f, the test-only-seam
   class).
7. GUARD: the living underlying surfaces stay exported — Avatar (ui),
   timeAgo + the format date-arithmetic siblings, ENGAGEMENT_LEVELS,
   FILTER_RAIL + EMPTY_STATE (page-layout), Cell (recharts — importable),
   DropdownSeparator (ui).
8. GUARD: the vendored ui stock-surface mirror stays whole —
   CardDescription, CardFooter, DialogClose, DialogTrigger, DropdownLabel,
   SelectGroup, SelectLabel, SelectSeparator still exported (the N-56e
   operator KEEP, pinned so the boundary is durable).

Plus the re-anchored loading-layer it (RED until the module is deleted) and
the retired format it (removed BEFORE the RED run — the stale-it-first
convention). The N-56d title fix rides along (title-only, stays green).

**RED arithmetic**: retire 1 stale it (1184→1183), add 8 its (→1191); the
RED run = 7 failed (the 6 new RED + the re-anchored loading-layer it) /
1184 passed (1191 total).

### S56-P6 — the verification suite

- **Non-vacuousness proof**: a pre-fix `f7ca140` worktree (node_modules
  hard-linked via cp -al — symlink creation is blocked in this sandbox),
  the three post-fix test files copied in as the ONLY change → the 7-RED
  set must fail there; cleanup after.
- **Full gate**: lint 0/0 · tsc 0 · 1191/1191 unit (75 suites, +8 −1) ·
  build clean · 112/112 e2e on a fresh CI=1 boot.
- **LIVE battery**: the fix surfaces render (Contacts page + Activities
  page + the Dashboard — the narrowed-import surfaces); the standing
  drawer battery both directions at a TRUE 390px; zero 390px overflow on
  all ten routes; the Tailwind v4 token contract probe (blur 4px + the
  exact pinned shadow); zero probe residue through the seam (db:census
  MATCH).
- **Screenshots**: the standing set (02/11/12) re-captured + one NEW
  fix-surface shot (65-contacts-page.png — the six-orphan narrowing
  surface) — VLM-verified per the house convention.
- **Ship**: the commit + the SSH-wrapper v3 push to main + the remote
  verification + the operator key shredded.

## The blast-radius pre-check (validated before this plan)

- The 12 orphan tokens: repo-wide reference census done (src + tests
  separately) — the only src references are the import statements
  themselves; no test pins the import statements of these six files
  (page-layout.test.ts pins the page-layout EXPORTS :211-220, not the
  pages' imports; loading-layer pins Skeleton/animate-pulse absence).
- CardCaption: zero consumers + zero test refs.
- misc.tsx: only loading-layer.test.ts:84 reads it (the re-anchor covers).
- addMonths: the format it (:132-137) is the only test consumer.
- The ui stock mirror: ZERO pins reference the unused stock exports
  (component-anatomy/page-layout pin the USED surfaces) — the new guard 8
  ADDS the first pin, deliberately.
- constants.ts / prisma / scripts: untouched.

## Execution record (appended as executed)

- **RED** (exactly as planned, +1 mid-flight repair): the addMonths it
  retired first (:132-137 + the import token — format.test.ts 25→24);
  the loading-layer 3rd it re-anchored to the module's ABSENCE; the
  dead-code-hygiene session-56 describe added (6 RED + 2 guards — the
  guard 8 pins the N-56e stock-mirror KEEP); the N-56d it-title
  corrected. RED run: **exactly 7 failures** (the 6 new RED + the
  re-anchored loading-layer it); full suite **7 failed / 1184 passed
  (1191 total)**. Mid-flight repair: guard 7's Avatar assertion
  corrected from `export function Avatar` to the real bottom-bar
  `export { Avatar,` form (avatar.tsx's export idiom) — a pin bug,
  not a plan change; the guards stayed green-through-RED after it.
- **GREEN**: S56-P1 — the twelve-import narrowing (contacts ×6 with
  one six-token record comment; accounts ×1; activities ×2; the
  dashboard ×1; the reports route ×1; charts ×1 — each with its record
  comment). S56-P2 — CardCaption retired from page-parts; misc.tsx
  DELETED; addMonths retired from format.ts. S56-P3 — the it-title
  fixed (rides GREEN). Touched suites: **56/56**; lint 0/0; tsc 0.
- **Non-vacuousness**: pre-fix `f7ca140` worktree (node_modules
  hard-linked via cp -al) + the 3 post-fix test files as the ONLY
  change → **7 failed | 49 passed (56)** — exactly the RED set; both
  guards + all pre-existing its green pre-fix. Worktree cleaned;
  `git worktree list` = the main checkout only.
- **Full gate**: lint 0/0 · tsc 0 · **1191/1191 unit (75 suites,
  +8 −1)** · build clean (the one Turbopack warning pre-existing —
  the upload route) · **112/112 e2e** on a fresh CI=1 boot (2.6m).
- **LIVE battery**: Contacts 15 rows zero errors; Activities + its
  chart; the Dashboard KPI row; the drawer both directions at TRUE
  390px (288px portal nav, 8/8, aria-expanded, the body+scroller dual
  lock — mobile-nav.tsx:73-74; close → 0/8 + unlocked); zero 390px
  overflow ×10 routes (both Dashboard casings); the Tailwind v4 token
  probe (`--blur-sm` 4px + the exact pinned shadow on a live input);
  the closing db:census MATCH (zero probe residue).
- **Screenshots**: 02/11/12 re-captured + **65-contacts-page NEW**
  (1440×900, 301,005 B) — all four VLM-verified.
- **Docs**: README (badge 1303, the session-56 paragraph, Tested row,
  command row), AGENTS (1191/112 + the session-56 block), CLAUDE
  (1191 ×3 + the loading-layer note), PAD (the s56 inventory row, the
  loading-layer row note, Total 1191+112, the checklist, the command
  table), SKILL **v1.53.0** (frontmatter + project_state + H1 + §16av,
  applied atomically via scripts/skill_edits_s56.py — the assert-first
  script, 5500 → 5571 lines; two anchor repairs during development,
  zero partial writes), session_105.md, this record, both worklogs.
- **Env**: `.env`/`.env.example` re-verified — no env surface change
  (DATABASE_URL `file:../db/custom.db`, AUTH_SECRET).

