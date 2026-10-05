# Session-60 Parity Remediation Plan (2026-10-05)

Session 60 on `main` @ `b077443` (= the session-59 code `d8d50a3` + the
operator's `docs/session_112.md` transcript commit; zero app-code drift —
`git diff d8d50a3..b077443 --stat` = 1 docs file, 99 insertions). Workspace
INTACT from s59 (no sandbox reset): the tree refreshed by `git pull`
(d8d50a3..b077443, docs-only). **Baseline gate on the intact tree: lint 0/0
(enforced) · tsc 0 · 1201/1201 unit (75 suites)** — the documented state
exact. The DB census through the sanctioned seam:
`database: file:/home/z/my-project/neo-crm/db/custom.db` + counts 15/24/10/23/12
+ 4 users + `pristine: MATCH`. The `skills/` exclusion verified in all three
configs (vitest include allowlist, eslint ignores, tsconfig exclude). No
outer sandbox-root `.env` (the s58 quarantine held); TWO zombie dev-server
generations killed at intake (pids 30937+506 and the 20833-chain — the s51
lesson) — ports 3000/3100 clear.

## The standing layers (56th session, NO DRIFT)

Drift sweep #56: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, URL identified through the logged-in page's
performance API, curl) — size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` **exact — the 31st consecutive stable
session**. Reference census #56 (agent-browser, live login): the demo data
still zero (Total Leads 0 + "+5.3%", `$0.0k`); the mobile-nav defect stands
at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible, scrollW 390,
NO hamburger); desktop nav normal (256px, 8 links); a reference 390px
screenshot captured (outside the repo, reference-screenshots/).

## The audits (two parallel agents + manual validation of every claim)

### A. The session-59 re-audit (60-a, fresh eyes on the dca98e9..d8d50a3 diff)

All eight checklist items verified GENUINE at file:line — the barrel
SavedReport retirement (record comment at types/index.ts:162-169; the LIVE
localStorage shape in saved-reports.ts:51-59 shape-divergent exactly as
claimed; zero barrel-type imports repo-wide), the entityId prop retirement
(record comment at entity-edit-dialog.tsx:153-158; pre-fix exactly 5 refs;
`key={editTarget?.id ?? "none"}` live at all three call sites), the SKILL
§20 carriers (the retirement note at :4933-4937; the "(277 lines)" header
matches wc exactly), the README badge 1313 (= 1201 + 112; the e2e 112 =
111 spec tests + the auth.setup test, per PAD's counting note), the s59
describe (exactly 2 RED + 1 guard; 34 its; the guard pins live exports),
the **non-vacuousness mechanically REPLAYED** in a pre-fix dca98e9 worktree:
**2 failed | 32 passed (34)** — the commit's arithmetic reproduced to the
digit; the guard green-through-RED — plus the regression scan (zero
import-line changes; tsc clean) and the docs-arithmetic cross-check (all
counts match). ONE narrative inaccuracy found (60-a #1 below; the
session_111.md SKILL line-count bracket).

### B. The graduation audit (60-b: the ledger + the fresh-eyes sweep)

**ZERO graduations — 13/13 CONFIRMED (17th consecutive session).** Zero
drift vs 59-b (not even line drift — the s59 code changes touched only
already-retired surfaces). The INFO family ALL UNCHANGED (F-47c, N-48c,
N-48f, N-48j, N-51c — anchors verified, substance identical). Both operator
decisions' code anchors STANDING (the CSV (b) guard in both families + the
`-` exclusion; all retired vocabulary tokens absent from executable src
including the s59 retirements, verified live with their record comments;
the stock-mirror KEEP intact + guard-pinned; the N-58c module type-contract
boundary guard present). The fresh-eyes sweep (12 mandated files + 6 test
files read in full, with the rotation angle COMPLEMENTARY to 59-b's
orphaned-import/dead-prop/dead-export focus — dead function parameters,
barrel-sibling re-check, dead keys in exported const maps, test-file-local
dead helpers): the dead-param census CLEAN, the barrel re-check CLEAN (no
remaining SearchResult/SavedReport-class sibling), the map-key census
finding exactly one (N-60a), the test-local census finding exactly one
(N-60b); ACCOUNT_TIER_BADGE.Key run to ground as LIVE.

### C. The findings (all manually validated at file:line this session)

- **N-60a (Low, dead map keys — the s54 fully-dead class, KEY variant)**:
  `src/lib/constants.ts:475-481` — six of `CHART_COLORS`'s sixteen keys
  (`blue`, `cyan`, `teal`, `amber`, `orange`, `green`) are **never read
  repo-wide**: zero `CHART_COLORS.<key>` sites for the six, zero computed
  access (`CHART_COLORS[`) anywhere, zero scripts/prisma consumers. The
  LIVE read set (verified by exhaustive repo grep): `red` (page.tsx:387),
  `gray` (activities-page:288), `violet` (page.tsx:248), `emerald`
  (page.tsx:228/:257/:386 + constants.test.ts:59) + the `-400` family
  (accounts-page:223-254, activities-page:255/:264, page.tsx:231/:234,
  constants.test.ts:53-58). The raw-hex literals elsewhere
  (`#3b82f6` etc. in contacts/reports pages, page-layout pins) are
  independent string props, NOT key reads. Unpinned by tests (the
  constants suite pins only the live keys). Dead since the map's birth.
  Disposition: RETIRE the six keys (the s48/s49/s54/s58/s59 fully-dead
  policy, KEY variant — a new face after the TYPE (s58) and INTERFACE
  (s59) variants) + the SKILL carriers (§15.4's example uses the dead
  `cyan`; §19's palette-duplication note claims a full mirror that the
  retirement narrows) follow.
- **N-60b (Info, dead test-local locator — the N-56a lint-invisible
  class, TEST-LOCAL variant)**: `tests/e2e/crm.spec.ts:2125` —
  `const formAvatar = page.locator("form .rounded-full.bg-blue-100")`
  declared inside the profile-photo-upload test and **never used** (the
  only repo-wide reference is the declaration; the test asserts the
  empty state through `page.locator("form img")` toHaveCount(0) instead).
  Exactly the class the OFF no-unused-vars rules would have flagged —
  now in its fourth home (IMPORT s56 / PROP-TYPE s57c / DESTRUCTURED
  s59 / TEST-LOCAL s60). Disposition: FIX (drop the one line; the test's
  assertions are unaffected).
- **60-a #1 (the comment-accuracy carrier)**: `docs/session_111.md:127-131`
  — the record claims the s59 SKILL edit went "5697 → 5764 by the
  script's count [5763 by wc — the file's last line lacks a trailing
  newline]". **The bracket is false**: neo-crm_SKILL.md ends `drift.\n`
  (newline-terminated, verified by byte dump at both dca98e9 and
  d8d50a3) — `wc -l` 5763 IS the true line count, and the script's
  `src.count("\n") + 1` formula (skill_edits_s59.py:11) over-counts by
  exactly one on a newline-terminated file (the pre-script true count
  was 5696, not 5697). The same off-by-one class this session polices,
  ironically self-inflicted by the editing script's arithmetic.
  Disposition: FIX the record bracket + the s60 SKILL-edit script uses
  the correct wc-semantics count (no `+ 1`), restoring the convention.

## The operator decisions (session 60)

1. **The CSV formula-injection posture (b) STANDS** (18th consecutive
   re-affirmation). Anchors verified by 60-b (csv.ts:31-33 the
   `/^[=+@\t\r]/` guard with `-` deliberately excluded, applied inside
   `escapeCell` :35-42 + entity-export.ts:43 `qq`; the three static
   templates outside the guard; parseCsv untouched); the reference bundle
   byte-identical for the 31st consecutive session — no new evidence; the
   data-flow scoping remains correct.
2. **The source-vocabulary documented parity STANDS AND EXTENDS to the
   N-60 family** (the standing policy, applied to this session's finds):
   - **Fully-dead surfaces retire** (the s48/s49/s54/s58/s59 policy): the
     six never-read `CHART_COLORS` keys (N-60a — the KEY variant of the
     fully-dead class; the CSS `--color-chart-1…6` token family in
     globals.css is a DIFFERENT surface and stays whole) and the dead
     test-local `formAvatar` locator (N-60b — the lint-invisible class's
     TEST-LOCAL variant).
   - The N-58c module type-contract boundary stays intact (guard-pinned
     at the s58 describe — internally-consumed export keywords KEEP).
   - The vendored ui stock-surface mirror stays whole (the N-56e
     boundary, unchanged).
   - The comment-accuracy carrier (60-a #1) lands with the records: the
     session_111.md bracket corrected, and the s60 SKILL-edit script
     counts by wc semantics.

## The families

### S60-P1 — the comment-accuracy fix (60-a #1)

- `docs/session_111.md:129-131`: the bracket corrected to state the truth —
  the file IS newline-terminated, 5763 by wc is the TRUE count, the
  script's `count("\n") + 1` formula over-counted by one (pre-script true
  count 5696). The historical "5697 → 5764" figures stay in the record as
  the script's arithmetic, now annotated.

### S60-P2 — the dead-surface narrowing (N-60a + N-60b)

- `src/lib/constants.ts:475-481`: the six dead keys retired, replaced by a
  record comment at the site (the grounds: zero key-reads + zero computed
  access repo-wide; the live read set = red/gray/violet/emerald + the
  -400 family; the CSS chart-token family is a different surface and
  stays whole; the s54 fully-dead class, KEY variant).
- `tests/e2e/crm.spec.ts:2125`: the dead `formAvatar` locator line
  dropped (the surrounding comment block and the test's real assertions
  untouched; the e2e count stays 112).

### S60-P3 — the SKILL carriers (N-60a's carriers)

- §15.4 (Sparkline examples, :861): `CHART_COLORS.cyan` →
  `CHART_COLORS.cyan400` (the LIVE bars key — page.tsx:231 renders the
  default-variant bars with cyan400; the old example referenced a key
  the retirement removes).
- §19 (the chart palette duplication note, :4855-4858): the note updated —
  the TS list now carries only the LIVE read set (the six never-read keys
  retired s60/N-60a); the CSS `--color-chart-1…6` token family stays
  whole as the design-system side; the "keep both lists aligned" wording
  retired with the full mirror it described.

### S60-P4 — the pin set (RED-first)

The new `describe("session-60: the dead-surface narrowing (S60-P2)")` in
tests/dead-code-hygiene.test.ts — 3 its = 2 RED + 1 guard:

1. RED: constants.ts carries none of the six dead keys
   (`blue: "#3b82f6"` / `cyan: "#06b6d4"` / `teal: "#14b8a6"` /
   `amber: "#f59e0b"` / `orange: "#f97316"` / `green: "#10b981"` —
   key-anchored patterns, comment-stripped source; the `emerald` key
   shares the `#10b981` hex but not the `green:` anchor, so the pin is
   collision-free).
2. RED: tests/e2e/crm.spec.ts carries no `formAvatar` token
   (comment-stripped source; word-boundary match).
3. GUARD: the living palette stays — the ten live keys present
   (`red`/`gray`/`violet`/`emerald` + the six `-400`s) AND the live
   consumers still read them (accounts-page binds `CHART_COLORS.blue400`,
   the dashboard page binds `CHART_COLORS.emerald` + `violet` + `red`,
   activities-page binds `CHART_COLORS.gray`).

**RED arithmetic**: add 3 its (1201 → 1204); the RED run = 2 failed (the
new RED pair) / 1202 passed (1204 total). No stale its to retire (zero
test pins on the six keys — the constants suite pins only live keys;
zero pins on formAvatar — the only reference is the declaration itself).

### S60-P5 — the docs carriers

- README.md: the badge (1313 → 1316 = 1204 + 112) + the Tested row
  (1201 → 1204) + the session-60 paragraph.
- AGENTS.md: the counts (1201 → 1204 ×2) + the session-60 block.
- CLAUDE.md: the counts (1201 → 1204 ×3).
- PAD: the s60 test-inventory row + the Total (1204 + 112).
- neo-crm_SKILL.md: v1.57.0 — frontmatter (version + last_updated +
  project_state) + the H1 + the new §16az (the lesson: the fully-dead
  class reached the exported-const-MAP — a KEY-level retirement, the
  third variant after TYPE (s58) and INTERFACE (s59); and the class's
  TEST-LOCAL face — a dead locator inside an e2e spec, invisible to the
  unit-side hygiene suite by construction, found only by rotating the
  fresh-eyes sweep INTO the test tree; plus the count-arithmetic lesson:
  the SKILL-edit script's `+1` line formula over-counts on
  newline-terminated files — the off-by-one class bit the tooling
  itself) + the s60 session record row + the §15.4/§19 carriers
  (S60-P3) — applied atomically via an assert-first script at the
  sandbox root, counted by wc semantics this time.
- docs/session_113.md: the session record.
- The plan's own execution record + both worklogs.
- `.env`/`.env.example` re-verified (no env surface change expected —
  the example matches the three-var code surface exactly: DATABASE_URL /
  AUTH_SECRET / NEXT_PUBLIC_SITE_URL).

### S60-P6 — the verification suite

- **Non-vacuousness proof**: a pre-fix `b077443` worktree (node_modules
  hard-linked via cp -al), the post-fix dead-code-hygiene.test.ts copied
  in as the ONLY change → the 2-RED set must fail there (expect 2 failed
  | 35 passed of 37); cleanup after.
- **Full gate**: lint 0/0 · tsc 0 · 1204/1204 unit (75 suites, +3) ·
  build clean · 112/112 e2e on a fresh CI=1 boot (all 7 mobile-nav
  checks green).
- **LIVE battery**: the fix surfaces render — the palette consumers (the
  accounts/activities stat-card mini bars + the dashboard KPI sparklines
  through their live keys post-narrowing) and the profile-photo upload
  test's surface (the profile page's avatar fallback); the standing
  drawer battery both directions at a TRUE 390px; zero 390px overflow on
  all ten routes; the Tailwind v4 token contract probe (blur 4px + the
  exact pinned shadow); zero probe residue through the seam (db:census
  MATCH).
- **Screenshots**: the standing set (02/11/12) re-captured + one NEW
  fix-surface shot (69-chart-palette.png — a page rendering the live
  palette consumers, 1440×900) — VLM-verified per the house convention.
- **Ship**: the commit + the SSH-wrapper v3 push to main + the remote
  verification + the operator key shredded.

## The blast-radius pre-check (validated before this plan)

- The six dead keys: zero code consumers (exhaustive grep — zero
  `.key` reads, zero computed access, zero scripts/prisma refs); zero
  test pins (constants.test.ts:53-59 pin only the live keys); TWO doc
  carriers (SKILL §15.4's example line + §19's duplication note —
  both included in S60-P3); the CSS `--color-chart-1…6` tokens in
  globals.css are a DIFFERENT surface (untouched); `emerald` shares the
  `#10b981` hex with the retired `green` but is key-distinct (the RED
  pin anchors on the key name, collision-free).
- `formAvatar`: zero refs beyond the declaration (grep exits with the
  single hit); the enclosing test's assertions read other locators; the
  e2e count unchanged (112); the line sits inside a test the e2e gate
  already runs green.
- The N-58c KEEP set + the stock mirror: zero changes (guard-pinned,
  not re-litigated).
- prisma / seed / scripts: untouched.
- The session_111.md bracket: a historical record's annotation — the
  "5697 → 5764" script-count figures stay (they are what the script
  printed), corrected by the truth annotation; no other doc carries the
  false "no trailing newline" claim (grep-verified).

## Execution record (appended as executed)

- **RED** (exactly as planned): the dead-code-hygiene session-60
  describe added (2 RED + 1 guard — the guard pins the ten live palette
  keys + their live consumers [the dashboard emerald/violet/red
  bindings, the accounts blue400, the activities gray]). RED run:
  **exactly 2 failures**; full suite through RED: **2 failed / 1202
  passed (1204 total)**. No mid-flight repairs needed.
- **GREEN**: S60-P1 — the session_111.md bracket corrected (the truth
  annotation: the file IS newline-terminated, wc -l's 5763 the true
  count, the s59 script's `count("\n") + 1` formula over-counts by
  one; the pre-script true count was 5696). S60-P2 — the dead-surface
  narrowing: constants.ts the six keys retired with the record comment
  (:475-480); crm.spec.ts the formAvatar locator dropped with its
  record comment. S60-P3 — the SKILL carriers: §15.4's example
  `CHART_COLORS.cyan` → the live `CHART_COLORS.cyan400` (page.tsx:231
  renders the default-variant bars with cyan400); §19's
  palette-duplication note rewritten (the TS list = the consumed
  subset; the CSS token family a different surface, stays whole).
  Touched suites: **47/47** (dead-code-hygiene 37 + constants 10);
  lint 0/0; tsc 0.
- **Non-vacuousness**: pre-fix `b077443` worktree (node_modules
  hard-linked via cp -al) + the post-fix dead-code-hygiene.test.ts as
  the ONLY change → **2 failed | 35 passed (37)** — exactly the RED
  set; the guard green-through-RED. Worktree cleaned; `git worktree
  list` = the main checkout only; the main node_modules intact
  (sanity db-path suite 20/20 after cleanup).
- **Full gate**: lint 0/0 · tsc 0 · **1204/1204 unit (75 suites,
  +3)** · build clean (the one Turbopack warning pre-existing — the
  upload route) · **112/112 e2e** on a fresh CI=1 boot (2.6m, all 7
  mobile-nav checks green).
- **LIVE battery**: the fix surfaces — the palette consumers render
  through the live keys (the dashboard recharts strokes #10b981
  emerald + #8b5cf6 violet; the KPI bar strips rgb(34,211,238) =
  cyan400; the accounts -400 families ×8 each [blue400/green400/
  cyan400/purple400/red400]; the activities gray ×3 + red400 +
  blue400; the revenue chart's Won #10b981 + Target #ef4444 areas);
  the profile page's N-60b surface context clean (form img count 0 —
  the real assertion; zero page errors); the drawer both directions
  at TRUE 390px (open: 8/8 truly visible, aria-expanded, the
  body+scroller dual lock, focus in panel, the 288px inner panel;
  close: 0/8 truly visible + visibility:hidden + unlocked); zero
  390px overflow ×10 routes (both Dashboard casings); the Tailwind v4
  token probe (`--blur-sm` 4px + the exact pinned shadow on a live
  input); the closing db:census MATCH (zero probe residue).
- **Screenshots**: 02/11/12 re-captured + **69-chart-palette NEW**
  (1440×900, the fix surface — the live palette rendering) — all four
  VLM-verified 4/4.
- **Docs**: README (badge 1316, the session-60 paragraph, the Tested
  row, the command row), AGENTS (1204/112 + the session-60 block),
  CLAUDE (1204 ×3), PAD (the s60 inventory row, the Total, the
  counting note, the tree row), SKILL **v1.57.0** (frontmatter +
  project_state + H1 + §16az, applied atomically via
  scripts/skill_edits_s60.py at the sandbox root — 5766 → 5829 lines
  by wc -l semantics [the script's count matches `wc -l` exactly this
  time — the off-by-one fixed]; zero anchor repairs; the §15.4/§19
  carriers landed pre-script), session_113.md, this record, both
  worklogs.
- **Env**: `.env`/`.env.example` re-verified — no env surface change
  (DATABASE_URL `file:../db/custom.db`, AUTH_SECRET,
  NEXT_PUBLIC_SITE_URL; the example matches the code's three-var
  surface exactly).
- **Ship**: the commit on main + the SSH-wrapper v3 push to
  `git@github.com:nordeim/neo-crm.git` + the remote verification +
  the operator key shredded.
