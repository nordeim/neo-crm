Session 62 — the manifest honesty + the profile-save divergence
session (docs/session_116.md, the s61 transcript; the operator's brief =
the standing cycle). Workspace REBUILT after a sandbox reset (fresh
clone → main @ k6125f6b = the session-61 code c30ca6a + the operator's
session_115/session_116 transcript commits; zero app-code drift).
Intake hygiene: NO zombie dev servers; ports 3000/3100 clear; the
OUTER sandbox-root `.env` hazard QUARANTINED (.env.quarantined-s62 —
it pointed DATABASE_URL at the sandbox-root mirror db, the s53/s58
class). Environment: bun install (534 pkgs) · .env recreated from
.env.example (DATABASE_URL="file:../db/custom.db" + fresh AUTH_SECRET
+ NEXT_PUBLIC_SITE_URL) · db:push + db:seed.

The five core docs re-read (AGENTS/CLAUDE/README/PAD/SKILL v1.58.0),
then the session docs (session_115, the s61 plan + execution record,
the worklog tails, session_116). **Baseline gate GREEN: lint 0/0
(enforced) · tsc 0 · 1207/1207 unit (75 suites)** — the documented
state exact. The DB census through the sanctioned seam:
`database: file:/home/z/my-project/neo-crm/db/custom.db` + 15/24/10/23/12
+ 4 users + `pristine: MATCH`. The `skills/` exclusion verified in all
three configs (vitest include allowlist, eslint ignores, tsconfig
exclude).

The standing drift re-sweep (58th session): the reference bundle
fresh-fetched (the URL identified through the logged-in page's
performance API + a direct curl with a browser UA —
`assets/index-DZ-xbrIm.js`) — **byte-identical** (size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` exact — the **33rd consecutive
stable session**). The reference census (58th): the demo data still
zero (Total Leads 0 + "+5.3%", `$0.0k`); the mobile-nav defect stands
at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible, scrollW
390, NO hamburger); desktop nav normal (256px, 8 links); a reference
390px screenshot captured (outside the repo).

The two parallel audit agents (62-a/62-b) + every finding manually
validated at file:line: **62-a** — all eight session-61 checklist
items GENUINE (the worktree arithmetic mechanically REPLAYED: 2 failed
| 38 passed pre-fix at b01bd01 with the post-fix dch test as the only
change; the png/dep/lockfile/numerics surfaces verified; the docs
arithmetic exact: badge 1319, SKILL wc -l 5901) with SIX new findings:
62-a#1 (@radix-ui/react-toast never-imported — the convergent find),
62-a#2 (PAD:127/:328-330 + SKILL:297/:314 still say "22 route files";
the accurate census is 27 with auth(6) + opportunities/upload/
uploads/[name]), 62-a#3 (the s61 package-lock regen silently dropped
the resolved @types/node + undici-types — the npm-world tsc hazard:
the optional-peer chain npm never installs; the bun tree carries it,
so tsc is green in-repo only; the §16ba(2) lesson also carried the
dry-run "310 insertions" where the shipped diff is 308/86), 62-a#4
(the s61 guard pins import sites for only 5/7 radix packages — label
unpinned, toast unpinable), 62-a#5 (README:724 + AGENTS:2316 say
lockfile parity returns "for the first time since session 25" — the
correct anchor is session 4, b3e3d6d), 62-a#6 (the wider stale-count
family in SKILL §5/§7: UI kit 12→13, components 21→25 .tsx / 15→19
use-client, entity-dialogs 817→1081, §7.1 8→9 models [the Opportunity
row missing] / 186→242, §7.2 355→468 + "20 activities"→23, §7.3
182→227, §7.4 129→133). **62-b** — ZERO graduations (**13/13
CONFIRMED, 19th consecutive session**), the INFO family unchanged
(F-47c, N-48c, N-48f, N-48j, N-51c), both operator decisions' code
anchors standing, all retired vocabulary tokens absent from executable
src, and the fresh-eyes sweep (the src/app + src/components deep-read
rotation: ALL 12 page files + the shell/nav/dialog components + the
store read in full, ≈8,700 lines + the 8 standing mechanical censuses
— the localStorage census CLEAN at exactly 2 live keys, the API
surface CLEAN at 27/39 all consumed, env parity EXACT at 3 vars, doc
anchors 10/10, zero commented-out code, the e2e sleep census at
exactly 2 annotated keeps) finding the **N-62 family**: N-62a (the
convergent react-toast find + the guard-entrenchment wrinkle), N-62b
(the profile Save gate is NAME-ONLY — a photo-only upload leaves Save
a silent no-op), N-62c (the unreachable `?? a.dueAt` arms ×2 at
activities-page:130/:132), N-62d (the readOnly/detailsTitle branch
family production-dead — the third member of the N-46e wire-or-remove
posture family), N-62e (the accounts/contacts header Export CSV
disabled binding reads `filtered.length` while the export ships the
FULL list — the comment claims "disabled at zero data").

The bundle-evidence addendum (decided at validation, for N-62b): the
reference bundle decoded AT the profile component — the reference's
Save button is `disabled:i` where i is the SAVING state ONLY (no
dirty gate exists there) and its submit unconditionally PATCHes
{display_name, profile_picture}. Our name-only gate was a
self-inflicted divergence, not a mirror: the button rendered enabled
(matching the reference) while the handler silently swallowed
photo-only uploads. Disposition: REMOVE the gate, not widen it.

The operator decisions: the **CSV formula-injection posture (b)
STANDS** (20th re-affirmation — the guard intact in both export
families, the `-` exclusion documented, the reference bundle
byte-stable for the 33rd consecutive session); the
**source-vocabulary documented parity STANDS AND EXTENDS to the N-62
family** (the never-imported react-toast retires — the s61 N-61b
RUNTIME-DEP class; @types/node joins as an explicit devDep pinning
the npm world; the unreachable ?? arms retire — the s42/s46 class;
the profile dirty gate retires as the bundle-evidenced
reference-divergence fix; the doc-numerics carriers refresh to the
mechanical census; the N-62d readOnly family + the N-62e
disabled-binding divergence get documented annotations).

The plan (docs/plans/2026-10-05-session62-parity-remediation.md)
written and validated against the codebase (every anchor grepped at
file:line before execution; the blast-radius pre-check: zero test
pins on react-toast outside the s61 guard, zero pins on the profile
dirty gate, the only `createdAt ??` pin is the s46 it itself —
re-anchored per the s54 precedent).

**RED**: the dead-code-hygiene session-62 describe (2 its: the
manifest RED + the honest-census guard) + the s46 it RE-ANCHORED to
the one-arm form + the profile-photo unconditional-save it — exactly
3 failures; full suite through RED: **3 failed / 1207 passed (1210
total)**. **GREEN**: S62-P1 the manifest honesty (react-toast out of
package.json; @types/node in at ^26.6.2 — the version the bun tree
already resolves; bun.lock regenerated [1 insertion / 3 deletions];
package-lock.json regenerated [18 insertions / 35 deletions —
react-toast out [the s63 correction, G-1: only the ONE entry left;
the 12 transitives it shared with the surviving radix packages
remain, correctly], @types/node 26.6.4 +
undici-types resolved in]; the root at 19 runtime + 11 dev;
scripts/install_packages.sh at the 30-token set; the SKILL §2
deps-table + runtime/dev-deps paragraphs; the toast.tsx header
annotated; the s61 guard made honest — toast out of the dep list,
react-label's import site NOW PINNED). S62-P2 the profile save gate
(the `dirty` const + the `if (!dirty) return` retired with the
bundle-evidence record comment; the button's `disabled={saving}`
already matched the reference). S62-P3 the dead-arm retirement
(`new Date(a.createdAt)` at both count filters). S62-P4 the
doc-numerics sweep (PAD:127 + the PAD api tree row at 27 with the
full listing; SKILL §5.1/§5.2 at 13 ui files / 25 .tsx / 19
use-client / the 27-file route listing / entity-dialogs 1081; SKILL
§7.1 at 9 models with the Opportunity row + 242 lines; §7.2 at 468 +
23 activities; §7.3 at 227 + 20 db-path checks; §7.4 at 133;
README:724 + AGENTS at "session 4" + the 308/86 framing; the §16ba(2)
dry-run correction + the @types/node closure note; the N-62d readOnly
annotation; the N-62e precision note). Two mid-flight pin repairs
(the s46 re-anchor's fragile bare count → the exact-form anchors
after `new Date(a.createdAt)` matched 7 file-wide sites; the s39
profile-envelope window 1400 → 2200 — the s62 record comment pushed
the finally clause past the old slice edge, the chronic self-shift
class). Found at execution: the db-path §7.3 check count was 16 (the
actual: 20) — refreshed; the first §7.1 Opportunity row drafted from
memory was field-inaccurate — corrected against the schema
(accountName/amount/closeDate, no FK ids).

**Non-vacuousness**: pre-fix k6125f6b worktree (node_modules
hard-linked via cp -al) + the two modified test files as the ONLY
change → **3 failed | 52 passed (55)** — exactly the RED set; the
guard green-through-RED. Worktree cleaned; `git worktree list` = the
main checkout only; the main node_modules intact (sanity db-path
20/20 after cleanup).

**Full gate**: lint 0/0 · tsc 0 · **1210/1210 unit (75 suites, +3)** ·
build clean (the one Turbopack warning pre-existing — the upload
route; the standalone artifact ships og-image.png only) · **112/112
e2e** on a fresh CI=1 boot (2.5m, all 7 mobile-nav checks green).

**LIVE battery**: the fix surfaces render — the profile photo-only
round-trip (the N-62b decisive case: upload WITHOUT touching the name
→ the from-scratch toast system renders "Photo uploaded successfully"
post-dep-removal → the form avatar img → Save → the unconditional
PATCH → the 500ms reload with ALL THREE avatars rendering the upload
[form + topbar + account card, all at /api/uploads/a9e05a59…]; the
probe then RESTORED to photoUrl null — zero residue); the drawer both
directions at TRUE 390px (open: aria-expanded, 8/8 truly visible,
body overflow hidden, focus in panel, scrollW 390; Escape: 0/8 +
unlocked); zero 390px overflow ×10 routes (both Dashboard casings);
NO Tailwind v4 bug (`--blur-sm` 4px + the exact pinned shadow
`rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` probe-verified on the live
"John Doe" dialog input); the closing db:census MATCH.

**Screenshots**: 02/11/12 re-captured + **71-profile-unconditional-save
NEW** (1440×900, the fix surface — the profile photo uploaded + the
Save Changes flow) — all four VLM-verified 4/4 PASS.

**Docs realigned**: README (badge 1322 = 1210 + 112, the session-62
paragraph, the Tested/command/tree rows at 1210, the session-4
anchor), AGENTS (1210 ×2 + the session-62 block + the session-4
anchor + the 308/86 framing), CLAUDE (1210 ×3 + the coverage note),
PAD (the s62 inventory row + the Total 1210 + 112 + the api tree row
at 27 + the ADR-003 count + the counting note), SKILL **v1.59.0**
(frontmatter + project_state + the new §16bb, applied atomically via
the assert-first scripts/skill_edits_s62.py at the sandbox root —
5913 → 5988 lines by wc -l semantics, the count verified against
`wc -l` exactly; one double-word artifact caught and fixed in both
the file and the script), this record, the plan's execution record,
both worklogs.

`.env`/`.env.example` re-verified (no env surface change; the example
matches the three-var code surface exactly: DATABASE_URL /
AUTH_SECRET / NEXT_PUBLIC_SITE_URL).

**Ship**: the commit on main + the SSH-wrapper v3 push to
`git@github.com:nordeim/neo-crm.git` + the remote verification + the
operator key shredded.
