Session 50 — the dead-mode retirement + INFO-triage session
(docs/session_93.md, the s50 record; the operator's brief =
docs/session_92.md's standing cycle). The workspace refreshed via
git pull: `main` @ `c543b36` (the session-49 code `07d66b5` + the
operator's `docs/session_92.md` transcript + a 271-file `skills/`
refresh — `git diff c543b36 07d66b5 -- src tests` EMPTY, zero
app-code drift). Session 49 confirmed SHIPPED (the commit + the
verified push, recorded in the operator's transcript + the s49 plan's
execution record) — this session is **session 50**.

The five core docs re-read (AGENTS/CLAUDE/README/PAD/SKILL v1.46.0),
then the session docs (session_91/92, the s49 plan + execution
record, the worklog tail Tasks 49-a/49-b/49). Environment rebuilt:
.env verified (DATABASE_URL `file:../db/custom.db`, AUTH_SECRET set),
db:push + db:seed (15/24/10/23/12 + 4 users, API-counted), the dev
server healthy on :3000. **Baseline gate GREEN: lint 0/0 (enforced) ·
tsc 0 · 1160/1160 unit (72 suites)** — the documented state exact.

The standing drift re-sweep (46th session) BEFORE planning: the
reference logged into via agent-browser (session `ref`), the authed
bundle (/assets/index-DZ-xbrIm.js) fresh-fetched IN-PAGE (the
arrayBuffer rolling-hash comparison against the cached
/tmp/ref-bundle-app.js): size 1,631,071 IDENTICAL, h1 982956926 + h2
172713453 IDENTICAL, first/last 16 bytes IDENTICAL — the TWENTY-FIRST
consecutive stable session (the md5 `a70a637fcf1d4291da8e0d965676
dc11` line). The reference census (46th): the demo data still zero
(KPIs "0"/"$0.0k"/"$0k"/"0%"); the mobile-nav defect stands at a TRUE
390px (nav w=0, 8 links in DOM, 0 visible, no hamburger, scrollW
390).

The two parallel audit agents dispatched (Tasks 50-a/50-b) + every
headline claim manually validated at file:line: **50-a** — all five
session-49 fix families verified GENUINE (the membership validation
at reports:84-85 + export:73-74 with REPORT_STATUSES at
constants:459-473, the AND-wrap at reports:108-110 + export:87-89,
the normalizers at saved-reports:108-117 + the Load wiring, the
stale-toast hoist at leads-page:136-137, the LEAD_SOURCES removal
with the pin re-anchored; the e2e layer: exactly 2 annotated
waitForTimeout keeps, 111 exact) with the pins mechanically
non-vacuous in a `1c76660` worktree: **9 failed | 17 passed** there
(the documented arithmetic EXACT), 26/26 at HEAD, full suite
1160/1160, zero suppressions in the diff; **50-b** — ZERO graduations
(all 13 ledger items re-confirmed, 7th consecutive session; the only
drift the s49 code itself), the INFO family ALL UNCHANGED, the .env
parity HOLDS (exactly one line differs), the skills/ exclusion HOLDS
in all three configs, fresh-eyes on topbar/crm-store/Dashboard found
zero staleness. **The new findings (the session-50 mandate)**: N-50a/k
(CLAUDE.md:115's Build Commands table still said e2e "110 checks"
while :38/:290 said 111 — s49 fixed 3 of the 4 carriers in the file,
missed the table row; the `--list` truth: 111 tests in 4 files),
N-50b (PAD:724's golden-path e2e row said 93 vs crm.spec.ts's 94
tests — a chronic off-by-one, each session bumping only its own row;
the table summed 110 vs the Total's 111), N-50c (SKILL §4.4's
constants inventory still listed LEAD_SOURCES as living after S49-P5
removed it), N-50d (AGENTS.md:214-216's living guidance still cited
the removed LEAD_SOURCES/CONTACT_SOURCES constants).

The two standing operator decisions re-verified UNCHANGED (the CSV
formula-injection posture (b) + the source-vocabulary
documented-parity reconciliation — landed s48, re-proven genuine by
two worktree proofs, zero new bundle evidence). The INFO family
TRIAGED (the s49 "suggested next"): **N-47d FIXED** (the session's
headline), F-47c/N-48c/N-48f/N-48j all KEEP with rationale (F-47c the
reference's own Mke 4-option blank-select quirk mirrored; N-48c the
deliberate s47 zero-guard on a superset surface the reference lacks;
N-48f the reference's own String()-based dumps; N-48j the s47
client-side-export duplication — a maintainability note).

The plan written
(docs/plans/2026-10-04-session50-parity-remediation.md) with the
families S50-P1..P4. **RED phase**:
tests/create-dialog-single-mode.test.ts (6 its — the three Dialog
wrappers carry NO entity prop, the three Forms carry NO createMode
machinery, zero updateContact/updateAccount/updateLead references in
entity-dialogs.tsx, the three pages declare NO dead editing state +
the create-mode regression guards + the EventDialog/ActivityDialog
dual-mode boundary guard). **RED confirmed: exactly 4 failures + 2
green-through-RED guards**; full suite through RED: 4 failed / 1162
passed — all 1160 pre-existing checks green.

**GREEN (S50-P1)**: the N-47d dead-edit-branch retirement — the
three create dialogs are create-only (the entity props, the
createMode locals, the ~170-line edit branches, the update-verb
submit ternaries, the "Edit X"/"Save Changes" title/footer ternaries
all removed; the create field sets byte-preserved — the reference's
own 8-field account set, the 7-field lead set with the
Status+Source pair, the contact family with the unconditional h3
section headers + Email\* required); the three pages' dead `editing`
states + `setEditing(null)` calls + entity props removed; the unused
imports dropped (Checkbox, ACCOUNT_TIERS, CONTACT_PRIORITIES,
LEAD_STAGES); EventDialog/ActivityDialog UNTOUCHED (their edit modes
are live). One pre-existing pin re-anchored (the leads-inline
create-default: the raw "email" on the create-only initializer — the
s48/s49 re-anchor precedent). The FINAL pin file proven mechanically
non-vacuous in a pre-fix worktree: **4 failed | 2 passed** there,
6/6 at the fix. **S50-P2**: the four docs-accuracy carriers fixed
(CLAUDE 110→111, PAD 93→94 with the table now summing to the Total,
SKILL §4.4's inventory entry removed with the s42-precedent record,
AGENTS' vocabulary guidance re-pointed at the living
LEAD_SOURCE_OPTIONS/CONTACT_SOURCE_OPTIONS pair).

**FULL GATE GREEN: lint 0/0 (enforced) · tsc 0 · 1166/1166 unit (73
suites, +6) · build clean · 111/111 e2e on a fresh CI=1 boot** (all 7
mobile-nav checks green).

**LIVE verification battery on the dev server**: the create
round-trip (a probe lead created through the Create New Lead dialog →
the row rendered with value 12345 + Status New → the API carried it
→ deleted via the ⋮ menu with the confirm → zero residue); the edit
path routes through the EntityEditDialog (the ⋮ Edit opened the
"Edit Lead" dialog POPULATED with the probe's name — the dual-surface
separation intact); the contact + account create dialogs verified
structurally (the unconditional CONTACT DETAILS / PROFESSIONAL
DETAILS h3s, Email\* required, the ✉️ Email source default, the
8-field account set with Annual Revenue + Employees, no edit-mode
fields anywhere); our drawer verified live in every direction (the
real trigger → the 288px portal nav with 8/8 truly visible links +
aria-expanded true + dual scroll-lock; Escape → visibility:hidden +
0/8 truly visible + unlocked + false); **zero 390px overflow on all
nine routes** (both Dashboard casings); **NO Tailwind v4 bug** (the
token contract re-verified: `--blur-sm` computes blur(4px),
`--shadow-sm` the exact pinned rgba(0,0,0,0.05) 0px 1px 2px);
**zero probe residue** (15/24/10/23/12 pristine).

Screenshots: 02/05 re-captured + 11/12 re-captured (the standing
mobile set) + **59-create-dialog-single-mode NEW** (the fix surface at
1440×900: the Create New Lead dialog with the exact 7-field create
set). 59 VLM-verified 4/4 PASS.

Docs realignment: README (badge 1277, the session-50 paragraph, the
suite list + create-dialog-single-mode, the counts), AGENTS (1166/111
+ the session-50 block + the S50-P2 vocabulary fix), CLAUDE (1166 ×3
+ the e2e table 111), PAD (the s50 row / 73 suites / 1166+111 / the
golden-path row 94 / the checklist / the command table), SKILL
**v1.47.0** (frontmatter + project_state + the H1 + the new §16ap +
the §4.4 inventory fix), this record, the plan's execution record,
both worklogs. `.env`/`.env.example` re-verified (no env surface
change; DATABASE_URL `file:../db/custom.db` with db/ at the repo
root).

**The headline**: the third src-dead-removal of the house closed the
oldest INFO note — the unreachable edit-mode machinery inside the
three create dialogs retired with the boundary pinned
(EventDialog/ActivityDialog's live dual-mode guarded by its own pin),
the INFO family triaged to four documented keeps with rationale, and
the four docs-accuracy carriers (two count off-by-ones, two stale
inventory entries) fixed — the audits' only findings, all landing
RED-first with the worktree proof.

**Gate**: lint 0/0 · tsc 0 · **1166/1166 unit (+4 RED-first pins + 2
regression guards)** · **111/111 e2e** (fresh boot) · 46th
drift-sweep clean (21st consecutive stable reference bundle) ·
live-verified both directions, zero probe residue · docs at SKILL
v1.47.0 + `docs/session_93.md`.

**Suggested next**: the standing ledger (13 items, 7 sessions zero
graduations), the INFO family now four documented keeps (F-47c,
N-48c, N-48f, N-48j — all triaged with rationale, none actionable
without an operator decision), the drift re-sweep next live visit,
and the e2e sleep census standing at 2 (both annotated no-op-contract
keeps).
