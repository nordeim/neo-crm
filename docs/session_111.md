Session 59 — the dead-surface narrowing: the missed sibling + the
destructured prop
session (docs/session_110.md, the s58 transcript; the operator's brief =
the standing cycle). Workspace INTACT from s58 (no sandbox reset): the
tree refreshed by `git pull` (8b214ba..dca98e9 — the operator's
session_110 transcript only; zero app-code drift). No outer
sandbox-root `.env` (the s58 quarantine held); the s58 zombie dev
server on :3000 killed at intake (the s51 lesson) — ports clear.

The five core docs re-read (AGENTS/CLAUDE/README/PAD/SKILL v1.55.0),
then the session docs (session_109, the s58 plan + execution record,
the worklog tails, session_110). **Baseline gate GREEN: lint 0/0
(enforced) · tsc 0 · 1198/1198 unit (75 suites)** — the documented
state exact. The DB census through the sanctioned seam:
`database: file:/home/z/my-project/neo-crm/db/custom.db` + 15/24/10/23/12
+ 4 users + `pristine: MATCH`. The `skills/` exclusion verified in all
three configs.

The standing drift re-sweep (55th session): the reference bundle
fresh-fetched — **byte-identical** (size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` exact — the **30th consecutive
stable session**). The reference census (55th): the demo data still
zero; the mobile-nav defect stands at a TRUE 390px (vw=390, nav w=0,
8 links in DOM, 0 visible, scrollW 390, NO hamburger); desktop nav
normal; a reference 390px screenshot captured (outside the repo).

The two parallel audit agents (59-a/59-b) + every finding manually
validated at file:line: **59-a** — all nine session-58 checklist items
GENUINE (the worktree arithmetic mechanically REPLAYED: 3 failed | 28
passed pre-fix; the KEEP-set pins live; the :385 citation accurate at
HEAD — no third-generation self-shift), with THREE narrative-level
inaccuracies: the README badge off by one (1309 where the convention
demands 1310 — the only user-visible one), the SKILL pre-fix line
count off by one (5622 narrated vs 5621 actual, inherited from
session_107's own off-by-one), and the stale §20 "(192 lines)" header
(the barrel was 276 at HEAD). **59-b** — ZERO graduations (**13/13
CONFIRMED, 16th consecutive session**; the drift map line-only,
substance identical), the INFO family unchanged (F-47c, N-48c, N-48f,
N-48j, N-51c), both operator decisions' code anchors standing, and
the fresh-eyes sweep (23 files + the three mechanical censuses —
orphaned imports ZERO, dead props exactly one, dead exports exactly
one) finding the **N-59 family**: the types barrel's `SavedReport`
interface (N-59a — zero references repo-wide INCLUDING its own file;
shape-divergent from the LIVE localStorage `SavedReport` in
saved-reports.ts; the type shadow of ledger-10's dead Prisma model)
and the entity-edit-dialog's `entityId` prop (N-59b — destructured +
typed + passed by all three call sites since s28, never read in the
body; the N-56a class, DESTRUCTURED variant).

**The operator decisions (session 59):** (1) the CSV
formula-injection posture **(b) STANDS** (17th consecutive
re-affirmation; the bundle byte-identical for the 30th consecutive
session). (2) The source-vocabulary documented parity **STANDS AND
EXTENDS** to the N-59 family: the fully-dead surfaces retire (the
N-59a interface — the s48/s49/s54/s58 policy, TYPE variant; the
N-59b dead prop with its three call-site bindings), while the N-58c
module type-contract boundary and the vendored ui stock-surface
mirror stay whole (guard-pinned). The ledger-10 Prisma model deferral
is unchanged (the reset + seed-time wipes stay its db consumers).

The plan written
(docs/plans/2026-10-05-session59-parity-remediation.md) with the
families S59-P1..P6, validated against the codebase before execution
(the blast radius: zero test pins on either token; ONE doc carrier
—the SKILL §20 code block + its stale line-count header; the
saved-reports tests read the LIVE module, never the barrel).

**RED**: the dead-code-hygiene session-59 describe (2 RED + 1 guard —
the guard pins the LIVE SavedReport in saved-reports.ts with its
dateRange/wonDate field set, the dialog's living props
initial/fields/onSubmit, and the three pages' fields/initial
bindings). RED run: **exactly 2 failures**; full suite through RED:
**2 failed / 1199 passed (1201 total)**.

**GREEN**: S59-P1 — the README badge arithmetic fix (1309 → 1313 =
1201 + 112, the s58 −1 corrected through the new total). S59-P2 — the
dead-surface narrowing (types/index.ts: the SavedReport interface
retired with the record comment; entity-edit-dialog.tsx: the entityId
destructure + prop-type member retired with the record comment; the
three call-site bindings removed — accounts/leads/contacts, one line
each, `editTarget` live through `initial` everywhere). S59-P3 — the
SKILL §20 carriers (the interface line retired + the "(192 lines)"
header refreshed to the live 277). The 2-RED set re-proven
mechanically non-vacuous in a pre-fix `dca98e9` worktree
(node_modules hard-linked): **2 failed | 32 passed there**, **34/34**
on the suite at the fix; the worktree cleaned after.

**FULL GATE GREEN: lint 0/0 (enforced) · tsc 0 · 1201/1201 unit (75
suites, +3) · build clean (the one pre-existing upload-route warning)
· 112/112 e2e on a fresh CI=1 boot** (2.6m; all 7 mobile-nav checks
green).

**LIVE verification battery on the dev server** — the fix surfaces:
the entity edit dialog (the N-59b surface) renders its full contract
LIVE (the ellipsis menu → Edit Contact opens the W7 dialog with the
populated field set — name/email/phone/company/position + the
Status/Source selects + Cancel/Save Changes; the save round-trip
closes the dialog cleanly, 15 rows intact, zero errors) and the
saved-reports seam (the N-59a context) round-trips through the LIVE
localStorage shape (Save Custom Report View → `crm_saved_reports`
carrying dateRange + wonDate → the count (0)→(1) → Load re-applies →
the probe cleared, zero residue). The standing battery: the drawer
both directions at a TRUE 390px (the real trigger → the 288px inner
panel with 8/8 truly visible links + aria-expanded + the body+scroller
dual lock + focus landed inside the panel; Escape → 0/8 truly visible
+ visibility:hidden + inert + unlocked); **zero 390px overflow on all
ten routes** (both Dashboard casings); **NO Tailwind v4 bug** (the
token contract: `--blur-sm` = 4px, the live input's computed shadow
carries the exact pinned `rgba(0,0,0,0.05) 0px 1px 2px 0px` —
probe-verified). Zero probe residue through the seam (the closing
`bun run db:census` MATCH).

Screenshots: 02/11/12 re-captured (the standing set) +
**68-entity-edit-dialog NEW** (the fix surface at 1440×900 — the Edit
Contact dialog with the populated fields + Cancel/Save Changes). All
four VLM-verified (02: sidebar + the six KPI cards + both charts +
zero defects — the Recent Deals table below the fold at 1440×900, the
standing composition; 11: hamburger + the stacked KPI cards + no
overflow; 12: the drawer + 8 links + X + dimmed overlay; 68: the
dialog + populated fields + both footer buttons + zero defects).

Docs realignment: README (badge 1313 = 1201 + 112, the session-59
paragraph, the Tested row, the test command row), AGENTS (1201/112 +
the session-59 block), CLAUDE (1201 ×3), PAD (the s59 test-inventory
row / the Total / the counting-convention note / the tree row), SKILL
**v1.56.0** (frontmatter + project_state + the H1 + the new §16ay —
applied atomically through the persisted assert-first script,
scripts/skill_edits_s59.py at the sandbox root, 5697 → 5764 by the
script's count [5763 by wc — the file's last line lacks a trailing
newline]; zero anchor repairs; the §20 carriers landed pre-script),
this record, the plan's execution record, both worklogs.
`.env`/`.env.example` re-verified (no env surface change; the example
matches the three-var code surface exactly: DATABASE_URL /
AUTH_SECRET / NEXT_PUBLIC_SITE_URL).

**The headline**: the fully-dead class's TYPE variant had a missed
sibling — found only by the sweep-rotation discipline, not by the
named-finding's vicinity — and the dead-prop class's third face (the
DESTRUCTURED variant) swept with it. The doc-arithmetic class caught
too (the badge −1, self-contradictory in its own record). 13/13
ledger zero graduations for the 16th consecutive session, both
operator decisions standing, the reference bundle stable for the 30th
consecutive session.

**Gate**: lint 0/0 · tsc 0 · **1201/1201 unit (+3 RED-first pins,
proven non-vacuous)** · **112/112 e2e** (fresh boot) · 55th
drift-sweep clean (30th consecutive stable reference bundle) ·
live-verified, zero probe residue (through the seam) · docs at SKILL
v1.56.0 + `docs/session_111.md`.

**Suggested next**: the standing ledger (13 items, 16 sessions zero
graduations), the INFO family unchanged (F-47c, N-48c, N-48f, N-48j,
N-51c — all triaged), the drift re-sweep next live visit, the
dead-surface census now covering the ALIAS + TYPE + DESTRUCTURED-prop
variants with the missed-sibling methodology lesson (§16ay: census
every exported name's consumers, not the named finding's vicinity).
