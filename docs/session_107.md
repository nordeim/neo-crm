Session 57 — the dead-surface narrowing + the comment-accuracy layer
session (docs/session_106.md, the s56 transcript; the operator's brief =
the standing cycle). Fresh clone this session (sandbox reset): the
workspace rebuilt from scratch — `bun install` (537 packages) + `.env`
from `.env.example` (DATABASE_URL `file:../db/custom.db` + a fresh
AUTH_SECRET) + `db:push` + `db:seed`; no outer sandbox-root `.env`
hazard; no zombie listeners.

The five core docs re-read (AGENTS/CLAUDE/README/PAD/SKILL v1.53.0),
then the session docs (session_105, the s56 plan + execution record,
the worklog tail, session_106). **Baseline gate GREEN: lint 0/0
(enforced) · tsc 0 · 1191/1191 unit (75 suites)** — the documented
state exact. The DB census through the sanctioned seam:
`database: file:/home/z/my-project/neo-crm/db/custom.db` + 15/24/10/23/12
+ 4 users + `pristine: MATCH`. The `skills/` exclusion verified in all
three configs. The scandihaven stack-pattern reference re-reviewed
(AGENTS/CLAUDE/PAD + the tailwind-patterns + nextjs16 skills): the
applicable patterns are all already baked in — no new adoptions
required.

The standing drift re-sweep (53rd session): the reference bundle
fresh-fetched — **byte-identical** (size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` exact — the **28th consecutive
stable session**). The reference census (53rd): the demo data still
zero; the mobile-nav defect stands at a TRUE 390px (nav w=0, links in
DOM, 0 visible, scrollW 390, NO hamburger); desktop nav normal.

The two parallel audit agents (57-a/57-b) + every finding manually
validated at file:line: **57-a** — all eight session-56 checklist items
GENUINE (the worktree arithmetic mechanically REPLAYED: 7 failed | 49
passed pre-fix), with two comment-accuracy corrections found (the
Avatar consumer attribution — the real consumer is accounts-page,
profile hand-rolls its avatar spans; the page-parts "seven living
exports" count — the file has ten). **57-b** — ZERO graduations
(**13/13 CONFIRMED, 14th consecutive session**; the drift map EMPTY),
the INFO family unchanged, both operator decisions' code anchors
STANDING, and the fresh-eyes sweep (21 files read in full) finding the
**N-57 family**: the profile page's dead `usersTotal` prop (N-57c,
dead since s10 — passed + typed but never read, with the `users` store
destructure existing solely to feed it), the uploads.ts dead EXPORT
keyword on UPLOADS_DIR_NAME (N-57b — zero external consumers, the
constant itself alive internally), and the stale nav-config footer
comment (N-57a — "not pinned to the bottom" contradicting the live
`mt-auto` footer).

**The operator decisions (session 57):** (1) the CSV
formula-injection posture **(b) STANDS** (15th consecutive
re-affirmation; the bundle byte-identical for the 28th consecutive
session). (2) The source-vocabulary documented parity **STANDS AND
EXTENDS** to the N-57 family: the retirement policy covers APP-OWNED
vocabulary — the dead prop + its feeding destructure, the dead export
keyword — while the store's users slice keeps its live write path (the
fix narrows the dead UI read, not the store architecture), and the
vendored ui stock-surface mirror stays whole (the N-56e boundary,
guard-pinned).

The plan written
(docs/plans/2026-10-05-session57-parity-remediation.md) with the
families S57-P1..P5, validated against the codebase before execution
(the blast radius: zero test pins on usersTotal / the UPLOADS_DIR_NAME
export / any corrected comment text; the profile-photo + page-layout
pins untouched by the narrowing).

**RED**: the dead-code-hygiene session-57 describe (2 RED + 1 guard —
the guard pins the living surfaces: the constant stays defined
internally, the profile form keeps onSaved={fetchUsers} + the keyed
remount). RED run: **exactly 2 failures**; full suite through RED:
**2 failed / 1192 passed (1194 total)**.

**GREEN**: S57-P1 — the five comment corrections (nav-config's
mt-auto truth; the Avatar attribution in contacts-page +
activities-page + the dch pin comment, with the :381→:384 line
refresh; page-parts' seven→ten, twice). S57-P2 — the dead-surface
narrowing (profile-page: the prop + the type entry + the `users`
destructure retired; uploads.ts: the export keyword narrowed with the
record comment). The 2-RED set re-proven mechanically non-vacuous in a
pre-fix `5b86880` worktree (node_modules hard-linked): **2 failed |
25 passed there**, **27/27** on the suite at the fix; the worktree
cleaned after.

**FULL GATE GREEN: lint 0/0 (enforced) · tsc 0 · 1194/1194 unit (75
suites, +3) · build clean · 112/112 e2e on a fresh CI=1 boot** (all 7
mobile-nav checks green; the one Turbopack warning pre-existing — the
upload route).

**LIVE verification battery on the dev server** — the fix surface:
the Profile page renders its full contract (the form with Full
Name/Email/Role + Upload Photo + Save Changes + the account summary
cards; the save round-trip clean; /api/users 200 with 4 users — the
onSaved refresh path alive). The standing battery: the drawer both
directions at a TRUE 390px (the real trigger → the 288px panel with
8/8 truly visible links + aria-expanded + the body+scroller dual lock
+ focus landed inside the panel; close → 0/8 truly visible +
visibility:hidden + inert + unlocked); **zero 390px overflow on all
ten routes** (both Dashboard casings); **NO Tailwind v4 bug** (the
token contract: `--blur-sm` = 4px, the live input's computed shadow
carries the exact pinned `rgba(0,0,0,0.05) 0px 1px 2px 0px` —
probe-verified). Zero probe residue through the seam (the closing
`bun run db:census` MATCH).

Screenshots: 02/11/12 re-captured (the standing set) +
**66-profile-page NEW** (the N-57c narrowing surface at 1440×900 —
the Profile & Settings page with its form + the account summary
cards). All four VLM-verified (02: sidebar + KPI row + both charts +
zero defects; 11: hamburger + KPI cards + no overflow; 12: blue
drawer + 8 links + X + dimmed overlay; 66: the form fields + buttons
+ cards + zero errors).

Docs realignment: README (badge 1306 = 1194 + 112, the session-57
paragraph, the Tested row, the test command row), AGENTS (1194/112 +
the session-57 block), CLAUDE (1194 ×3), PAD (the s57 test-inventory
row / the Total / the tree row / the HEAD note), SKILL **v1.54.0**
(frontmatter + project_state + the H1 + the new §16aw — applied
atomically through the persisted assert-first script,
scripts/skill_edits_s57.py at the sandbox root, 5571 → 5622 lines),
this record, the plan's execution record, both worklogs.
`.env`/`.env.example` re-verified (no env surface change; the example
matches the three-var code surface exactly: DATABASE_URL /
AUTH_SECRET / NEXT_PUBLIC_SITE_URL).

**The headline**: the orphaned-import class's PROP and EXPORT variants
found and swept — the dead usersTotal prop (invisible to eslint AND to
import sweeps because it was consumed by a prop type) retired with its
feeding destructure, the dead export keyword narrowed while keeping
its live constant, and the record-comment accuracy raised (the Avatar
attribution and the seven-exports count corrected — comments steer
future censuses, so wrong comments are findings). 13/13 ledger zero
graduations for the 14th consecutive session, both operator decisions
standing, the reference bundle stable for the 28th consecutive
session.

**Gate**: lint 0/0 · tsc 0 · **1194/1194 unit (+3 RED-first pins,
proven non-vacuous)** · **112/112 e2e** (fresh boot) · 53rd
drift-sweep clean (28th consecutive stable reference bundle) ·
live-verified, zero probe residue (through the seam) · docs at SKILL
v1.54.0 + `docs/session_107.md`.

**Suggested next**: the standing ledger (13 items, 14 sessions zero
graduations), the INFO family unchanged (F-47c, N-48c, N-48f, N-48j,
N-51c — all triaged), the drift re-sweep next live visit, the
dead-surface census now covering the PROP/EXPORT variants (§16aw).
