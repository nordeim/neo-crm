# Session-57 Parity Remediation Plan (2026-10-05)

Session 57 on `main` @ `5b86880` (= the session-56 code `e168caa` + the
operator's `docs/session_106.md` transcript commit; zero app-code drift —
`git diff e168caa..5b86880 --stat` = 1 docs file, 77 insertions). Fresh
clone this session (sandbox reset): workspace rebuilt from scratch —
`bun install` (537 packages) + `.env` from `.env.example`
(DATABASE_URL `file:../db/custom.db` + a fresh AUTH_SECRET) + `db:push` +
`db:seed`. **Baseline gate on the rebuilt tree: lint 0/0 (enforced) ·
tsc 0 · 1191/1191 unit (75 suites)** — the documented state exact. The DB
census through the sanctioned seam: `database:
file:/home/z/my-project/neo-crm/db/custom.db` + counts 15/24/10/23/12 + 4
users + `pristine: MATCH`. The `skills/` exclusion verified in all three
configs (vitest include allowlist, eslint ignores, tsconfig exclude).
The `.env.example` surface re-verified against the code (exactly
DATABASE_URL / AUTH_SECRET / NEXT_PUBLIC_SITE_URL — the three env vars
`process.env` reads outside NODE_ENV).

## The standing layers (53rd session, NO DRIFT)

Drift sweep #53: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, curl) — size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` **exact — the 28th consecutive stable
session**. Reference census #53 (agent-browser, live login): the demo data
still zero (Total Leads 0 + "+5.3%", `$0.0k`/`$0.0k`/`$0k`, `0%`/`0%`); the
mobile-nav defect stands at a TRUE 390px (nav w=0, links in DOM, 0
visible, scrollW 390, NO hamburger). Desktop nav normal. The scandihaven
stack-pattern reference re-reviewed (AGENTS/CLAUDE/PAD + the
tailwind-patterns + nextjs16 skills): the applicable patterns (Tailwind v4
CSS-first literal-hex `@theme`, Next 16 async params, the envelope, the
mobile-drawer taxonomy) are all already baked into this codebase and
documented in AGENTS.md — no new pattern adoptions required.

## The audits (two parallel agents + manual validation of every claim)

### A. The session-56 re-audit (57-a, fresh eyes on the f7ca140..e168caa diff)

All eight checklist items verified GENUINE at file:line — the
twelve-orphan narrowing (all 12 tokens absent, all six record comments
present, the pre-fix `git show f7ca140:` per-token count = exactly 1
each), the CardCaption retirement, the misc.tsx deletion + the
loading-layer re-anchor, the addMonths retirement + its stale it, the
N-56d it-title fix, the guard pair (both subjects exported at file:line),
the underlying exports alive, and the counts by run (75 files 1191/1191;
24 `it(` in dead-code-hygiene). **The non-vacuousness mechanically
REPLAYED** in a pre-fix f7ca140 worktree: 7 failed | 49 passed (56) —
the commit's arithmetic reproduced to the digit. Two sub-claim
corrections found (see the findings below): the Avatar consumer
attribution and the page-parts export count.

### B. The graduation audit (57-b: the ledger + the fresh-eyes sweep)

**ZERO graduations — 13/13 CONFIRMED (14th consecutive session)**. The
drift map since 56-b: EMPTY. The INFO family ALL UNCHANGED (F-47c, N-48c,
N-48f, N-48j, N-51c — anchors verified, substance identical). Both
operator decisions' code anchors STANDING (the CSV (b) guard in both
families + the `-` exclusion; all 17 retired vocabulary tokens absent
from executable src). The e2e sleep census at exactly 2 annotated keeps.
The fresh-eyes sweep (21 not-recently-swept files read in full): the
orphaned-import scan CLEAN (the s56 sweep holds), React-19 discipline
holds, zero staleness — with THREE new findings (the N-57 family below).

### C. The findings (all manually validated at file:line this session)

- **N-57a (INFO, comment-accuracy — the chronic sibling-carrier class)**:
  `src/components/layout/nav-config.ts:41` — the NAV_FOOTER_ITEMS comment
  says "not pinned to the bottom", contradicting the LIVE footer
  (`page-layout.ts:228` `footerGroup: "mt-auto space-y-1 pt-4
  border-t border-white/10"` — `mt-auto` in the flex column pins it) and
  two sibling comments (sidebar.tsx:15-17/:58-59, page-layout.ts:214).
  Stale since the s7 re-pin; the line dates to s3. Comment-only fix.
- **N-57b (INFO, dead export — the N-56a lint-invisible class, EXPORT
  variant)**: `src/lib/uploads.ts:15` — `export const
  UPLOADS_DIR_NAME`: zero external consumers repo-wide (the only use is
  the internal `:74`). The constant lives; the `export` keyword is dead.
  Per the standing source-vocabulary decision: narrow the export (the
  constant stays for the internal repo-root resolution).
- **N-57c (LOW, dead prop — the N-56a class, PROP variant — the session's
  headline)**: `src/app/(app)/profile/profile-page.tsx` — the page passes
  `usersTotal={users.length}` (:43) and types it (:79), but ProfileForm
  never destructures or reads it (dead since s10, git-verified); the
  `users` store destructure (:23) exists solely to feed it. The
  `fetchUsers` prop stays LIVE (the onSaved refresh). FIX: remove the
  prop + the type entry + the `users` destructure.
- **57-a correction 1 (LOW, comment-accuracy)**: the s56 record comments
  say "Avatar in profile" (contacts-page.tsx:50-56,
  activities-page.tsx:18-21, dead-code-hygiene.test.ts:265-268) — Avatar's
  sole live consumer is **accounts-page** (:11/:332/:359); profile
  hand-rolls its avatar spans. Comments-only fix (the guard pins the
  export, not the consumer).
- **57-a correction 2 (LOW, comment-accuracy)**: page-parts.tsx:186 record
  comment + dead-code-hygiene.test.ts:310 guard comment say "the seven
  living exports" — the file has **TEN** living exports (PageHeader,
  DeltaText, DeltaBadgeText, KpiCard, BarStatCard, IconStatCard,
  CircleStatCard, TableEmptyRow, TrendStatCard, Sparkline); the guard
  pins 7 of the 10. Comments-only fix.
- **57-a nano (rides along)**: the stale "activities-page:381" line
  citations in dead-code-hygiene.test.ts:265/:344 (the live consumption
  is now :384 after the s56 narrowing shifted the file).

## The operator decisions (session 57)

1. **The CSV formula-injection posture (b) STANDS** (15th consecutive
   re-affirmation). Anchors verified by 57-b (csv.ts:31-33/:35-37 +
   entity-export.ts:43; the `-` exclusion documented); the reference
   bundle byte-identical for the 28th consecutive session — no new
   evidence; the data-flow scoping remains correct (the guard covers
   every CSV-producing surface we own: escapeCell + the raw-dump qq;
   the static templates and the import parser deliberately untouched).
2. **The source-vocabulary documented parity STANDS AND EXTENDS to the
   N-57 family**: the retirement policy covers APP-OWNED vocabulary — the
   dead `usersTotal` prop + its feeding destructure (N-57c) and the dead
   `export` keyword on UPLOADS_DIR_NAME (N-57b, the constant stays
   alive for its internal consumer) — while the vendored ui
   stock-surface mirror stays whole (the N-56e boundary, guard-pinned
   since s56). The store's `users` STATE slice stays: its write path is
   live (hydrate + the onSaved refresh through fetchUsers) — the fix
   narrows the dead UI read, not the store architecture.

## The families

### S57-P1 — the comment-accuracy carriers (N-57a + the two 57-a corrections)

- nav-config.ts:41: "not pinned to the bottom" → the mt-auto truth (the
  footer pins to the bottom through `mt-auto` in the flex column, the
  divider rides `border-t`).
- contacts-page.tsx record comment: "Avatar in profile + the ui kit" →
  "Avatar in accounts-page + the ui kit".
- activities-page.tsx record comment: "profile + the ui kit own Avatar" →
  "accounts-page + the ui kit own Avatar".
- page-parts.tsx:186 record comment: "The seven living exports above
  stay" → the ten-export truth.
- dead-code-hygiene.test.ts:265-268 (the N-56a comment): the Avatar
  consumer corrected + the :381→:384 line refresh; :310 (the N-56b guard
  comment): "seven" → "ten" (the guard pins the seven load-bearing ones;
  DeltaText/DeltaBadgeText/Sparkline also live, pinned by their own
  consumers' suites).

### S57-P2 — the dead-surface narrowing (N-57b + N-57c)

- profile-page.tsx: `usersTotal={users.length}` removed from the
  ProfileForm JSX (:43); `usersTotal: number;` removed from the props
  type (:79); `users` removed from the store destructure (:23 — the
  `fetchUsers` prop stays, it is the live onSaved refresh).
- uploads.ts: `export const UPLOADS_DIR_NAME` → `const UPLOADS_DIR_NAME`
  (the export keyword narrowed; the constant + its internal consumer at
  :74 stay).

### S57-P3 — the pin set (RED-first)

The new `describe("session-57: the dead-surface narrowing + the
comment-accuracy carriers (S57-P1/P2)")` in tests/dead-code-hygiene.test.ts
— 3 its = 2 RED + 1 guard:
1. RED: profile-page carries no `usersTotal` token (the N-57c dead prop
   retired — neither passed nor typed).
2. RED: uploads.ts no longer EXPORTS UPLOADS_DIR_NAME (the `export const
   UPLOADS_DIR_NAME` form gone — N-57b).
3. GUARD: the living surfaces stay — uploads.ts still defines
   `UPLOADS_DIR_NAME = "uploads"` internally (the repo-root resolution
   feeds on it) AND profile-page still wires the live props
   (`onSaved={fetchUsers}` + the keyed remount).

**RED arithmetic**: add 3 its (1191 → 1194); the RED run = 2 failed (the
new RED pair) / 1192 passed (1194 total). No stale its to retire.

### S57-P4 — the docs carriers

- README.md: the badge (1303 → 1306) + the Tested row (1191 → 1194) + the
  test command row + the session-57 paragraph.
- AGENTS.md: the counts (1191 → 1194 ×2) + the session-57 block.
- CLAUDE.md: the counts (1191 → 1194 ×3).
- PAD: the s57 test-inventory row + the Total (1194 + 112) + the
  counting-convention note.
- neo-crm_SKILL.md: v1.54.0 — frontmatter (version + last_updated +
  project_state) + the H1 + the new §16aw (the dead-prop/export-variant
  lesson: the orphaned-import class has PROP and EXPORT variants that
  survive import-sweeps — sweep the prop surfaces and the export
  keywords too) + the s57 session record row.
- docs/session_107.md: the session record.
- The plan's own execution record + both worklogs.
- `.env`/`.env.example` re-verified (no env surface change expected — the
  example already matches the three-var code surface exactly).

### S57-P5 — the verification suite

- **Non-vacuousness proof**: a pre-fix `5b86880` worktree (node_modules
  hard-linked via cp -al — symlink creation is blocked in this sandbox),
  the post-fix dead-code-hygiene.test.ts copied in as the ONLY change →
  the 2-RED set must fail there; cleanup after.
- **Full gate**: lint 0/0 · tsc 0 · 1194/1194 unit (75 suites, +3) ·
  build clean · 112/112 e2e on a fresh CI=1 boot.
- **LIVE battery**: the fix surfaces render (the Profile page — the
  N-57c surface — with its form + save flow intact); the standing
  drawer battery both directions at a TRUE 390px; zero 390px overflow on
  all ten routes; the Tailwind v4 token contract probe (blur 4px + the
  exact pinned shadow); zero probe residue through the seam (db:census
  MATCH).
- **Screenshots**: the standing set (02/11/12) re-captured + one NEW
  fix-surface shot (66-profile-page.png — the N-57c narrowing surface at
  1440×900) — VLM-verified per the house convention.
- **Ship**: the commit + the SSH-wrapper v3 push to main + the remote
  verification + the operator key shredded.

## The blast-radius pre-check (validated before this plan)

- `usersTotal`: zero test pins (profile-photo.test.ts pins the upload/
  save flows; page-layout.test.ts pins PAGE_ROOT.bare — neither touches
  the prop or the store destructure); zero docs carriers.
- `UPLOADS_DIR_NAME`: zero test pins in upload-api.test.ts; zero external
  src consumers.
- The comment corrections: the only carriers are the ones being fixed
  (verified by grep — "seven living" ×2, "Avatar in profile" ×1, "not
  pinned to the bottom" ×1).
- The store's users slice: `fetchUsers` stays consumed (onSaved);
  `users` state keeps its live write path (hydrate) — no store change.
- prisma / constants / scripts: untouched.

## Execution record (appended as executed)

- **RED** (exactly as planned): the dead-code-hygiene session-57
  describe added (2 RED + 1 guard — the guard pins the living
  surfaces: the constant stays defined internally, the profile form
  keeps `onSaved={fetchUsers}` + the keyed remount). RED run: **exactly
  2 failures**; full suite through RED: **2 failed / 1192 passed
  (1194 total)**. No mid-flight repairs needed.
- **GREEN**: S57-P1 — the five comment corrections (nav-config's
  mt-auto truth; the Avatar attribution in contacts-page +
  activities-page + the dch pin comment, with the :381→:384 line
  refresh; page-parts' seven→ten, twice — the record comment + the
  guard comment). S57-P2 — the dead-surface narrowing (profile-page:
  the prop + the type entry + the `users` destructure retired;
  uploads.ts: the export keyword narrowed with the record comment).
  Touched suites: **230/230** (dead-code-hygiene 27 + page-layout 177
  + profile-photo 12 + upload-api 14); lint 0/0; tsc 0.
- **Non-vacuousness**: pre-fix `5b86880` worktree (node_modules
  hard-linked via cp -al) + the post-fix dead-code-hygiene.test.ts as
  the ONLY change → **2 failed | 25 passed (27)** — exactly the RED
  set; the guard green-through-RED. Worktree cleaned; `git worktree
  list` = the main checkout only.
- **Full gate**: lint 0/0 · tsc 0 · **1194/1194 unit (75 suites,
  +3)** · build clean (the one Turbopack warning pre-existing — the
  upload route) · **112/112 e2e** on a fresh CI=1 boot (2.6m).
- **LIVE battery**: the Profile page renders its full contract (form +
  Upload Photo + Save Changes + the account summary cards; the save
  round-trip clean; /api/users 200 with 4 users); the drawer both
  directions at TRUE 390px (288px panel, 8/8 truly visible,
  aria-expanded, the body+scroller dual lock, focus in panel; close →
  0/8 truly visible + hidden + inert + unlocked); zero 390px overflow
  ×10 routes (both Dashboard casings); the Tailwind v4 token probe
  (`--blur-sm` 4px + the exact pinned shadow on a live input); the
  closing db:census MATCH (zero probe residue).
- **Screenshots**: 02/11/12 re-captured + **66-profile-page NEW**
  (1440×900, 85,810 B) — all four VLM-verified.
- **Docs**: README (badge 1306, the session-57 paragraph, Tested row,
  command row), AGENTS (1194/112 + the session-57 block), CLAUDE
  (1194 ×3), PAD (the s57 inventory row, the Total, the tree row, the
  HEAD note), SKILL **v1.54.0** (frontmatter + project_state + H1 +
  §16aw, applied atomically via scripts/skill_edits_s57.py at the
  sandbox root — 5571 → 5622 lines, zero anchor repairs needed),
  session_107.md, this record, both worklogs.
- **Env**: `.env`/`.env.example` re-verified — no env surface change
  (DATABASE_URL `file:../db/custom.db`, AUTH_SECRET,
  NEXT_PUBLIC_SITE_URL; the example matches the code's three-var
  surface exactly).
