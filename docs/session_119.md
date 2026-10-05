Session 63 — the server-seam honesty: the foreign docs + the
dead-arm split + the page-layout honesty
session (docs/session_117.md, the s62 record + the operator's s62
transcript at docs/session_118.md [fe17bd7, fetched + reviewed at ship
time — the numbering convention: odd = the session record, even = the
operator's transcript of the PRIOR session]; the operator's brief =
the standing cycle). Workspace NOTE: the repo was RESTRUCTURED between
sessions — it now lives at /home/z/neo-crm (previously
/home/z/my-project/neo-crm, the sandbox root's child; the move orphaned
the s62 dev db, so `db:push` + `db:seed` recreated `<repo>/db/custom.db`
and the census reads `database: file:/home/z/neo-crm/db/custom.db` +
15/24/10/23/12 + 4 users + `pristine: MATCH`). NEW INTAKE HAZARD
neutralized: the orchestration environment exports a STALE
`DATABASE_URL=file:/home/z/my-project/db/custom.db` (the OLD layout's
mirror) — an ABSOLUTE override the db-path seam honors BY DESIGN
("absolute URLs are intentional overrides"), which silently retargeted
every bun process at the orphaned mirror; all session-63 repo
operations ran under `env -u DATABASE_URL` so the repo .env relative
contract won (the e2e suite immune — it sets its own
E2E_DATABASE_URL). Intake hygiene: NO zombie dev servers; ports
3000/3100 clear. Baseline gate GREEN: lint 0/0 (enforced) · tsc 0 ·
1210/1210 unit (75 suites) — the documented state exact; the skills/
exclusion verified in all three configs (vitest include allowlist,
eslint ignores, tsconfig exclude).

The standing drift re-sweep (59th session): the reference bundle
fresh-fetched (direct curl with a browser UA — `assets/
index-DZ-xbrIm.js`) — **byte-identical** (size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` exact — the **34th consecutive
stable session**). The reference census (59th, agent-browser, live
login at 1280 then a TRUE 390px viewport): the demo data still zero
(Total Leads 0 + "+5.3%", `$0.0k`); the mobile-nav defect STANDS at a
TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible, scrollW 390,
NO hamburger); desktop nav normal (256px, 8 links); a reference 390px
screenshot captured (outside the repo).

The three parallel audit agents (63-a/63-b/63-c) + every finding
manually validated at file:line: **63-a** — all TWENTY-THREE
session-62 checklist items GENUINE (the manifest honesty, the profile
gate retirement, the dead-arm retirement, the doc-numerics sweep, the
counts by run, the docs arithmetic: badge 1322, SKILL v1.59.0, wc -l
5988 exact; the non-vacuousness REPLAYED in a pre-fix `6125f6b`
worktree: 3 failed | 52 passed (55) — the commit's arithmetic
reproduced to the digit) with NINE record-precision findings: G-1
(session_117.md:112 "react-toast + its 13 transitives out" OVERSTATES
— only the one entry left; the 12 transitives remain, shared by the
surviving radix packages), G-2 (PAD:357-358 still "1207 checks" /
"111 checks" — the 62-a#2 tree-block class, missed sibling), G-3
(crm.spec.ts:2147 "The name must be dirty to save" — stale
post-N-62b), G-4 (the N-62e precision note landed on 1 of 3 sites —
contacts-page + the entity-export pin comment still claim "disabled
at zero data"), G-5..G-9 INFO-grade (the "k6125f6b" typo — not a
resolvable git object, the actual is `6125f6b`; the s62 plan's "2
docs files" actually 1; the "5913 → 5988" intermediate-base class;
CLAUDE:371 silently healed at s62; PAD:739's historical s61 row).
**63-b** — ZERO graduations (**13/13 CONFIRMED, 20th consecutive
session**; line-tolerance drift only), the INFO family unchanged
(F-47c, N-48c, N-48f, N-48j, N-51c), both operator anchors standing,
the 8 standing mechanical censuses ALL CLEAN (localStorage exactly 2
live keys; public/ og-image.png only; the package surface with the
63-b #2 precision note — prisma/react-dom are framework/CLI-consumed,
"import site OR documented framework consumption" is the honest
census form; API 27/39 all consumed; env parity 3-var exact; doc
anchors 10/10; zero commented-out code; exactly 2 annotated e2e
sleeps) — with ONE new finding: **63-b #1** — `scandihaven_SKILL.md`
(128,868 B) + `project-management_SKILL.md` (31,946 B) tracked at the
repo root since the initial scaffold `b48fc3d`, NEVER modified in
62+ sessions, zero functional references (the operator's prompt
templates cite the GITHUB repo URL for scandihaven's docs;
project-management_SKILL.md documents ORBITAL — a different project
entirely) — ~160 KB of foreign manuals in every clone, the s54
fully-dead class, DOC-FILE variant. **63-c** — the fresh-eyes
ROTATION sweep: the SERVER SEAM read in full (src/lib 23 files +
src/app/api 27 routes + prisma/seed.ts + scripts/, ≈7,720 lines +
a reverse per-export consumer census of ~240 symbols) finding the
**N-63 family**: N-63a (page-layout.ts's header claims "Pages consume
these records" — FALSE for an 8-record family with zero page
consumers: PAGE_TITLES, DIALOG_BARE_GROUP, RECENT_DEALS,
STAT_SHADOWS, CHART_GEOMETRY, TABLE_SHADOWS [zero consumers anywhere
outside the record file + its test] + CALENDAR_CELL, DELTA_TEXT
[in-file only through the sweep]; the live pages hand-inline, and
CALENDAR_CELL.base had DRIFTED from the live cell — no `flex
flex-col items-stretch`, no focus-ring key, a duplicated
`transition-all`; a test pinning a value the live page no longer
renders is a guard pinning a stale copy — the s24 click-contract
lesson at the layout seam), N-63b (the surviving dead-arm set,
SPLIT by risk class: construction-dead over internal constants —
dashboard/route.ts:108 + the client page's stage select
`PIPELINE_LABELS[…] ?? …` [the PIPELINE_STAGES loops; all 5 keys
verified present] + settings' `!view` [asString's optional+trim
contract makes it unreachable after `?? "month"`] → RETIRE;
defensive over persisted data — the reports ACTIVITY_TYPE_META
triple + `o.stage || "unknown"` + the dashboard `: 0` arm
[Activity.dueAt is DateTime?; zero type-predicate patterns in the
codebase make the arm the honest static form] → KEEP + ANNOTATE),
N-63c (the allLayoutClasses sweep claims "Every exported class
string" but ~30 groups were absent — the 62-a#4 coverage class),
N-63d (the undocumented server-TZ dependence of the period windows),
N-63e (the rate-limit header's flat "10 attempts / 15 min" vs the
real per-route 10/10/5/20), N-63f (the new N-58c internally-live
members — documented alongside the boundary), N-63g (DEV_SECRET
fires silently for a SHORT AUTH_SECRET in production), N-63h (the
seed trio — record-only), N-63i (login's email cap 500 vs the auth
family's uniform 160 — a >160-char email stored truncated by signup
could never log in), N-63j (Info — the duplicated date-suffix
builders + the events message/check mismatch; record-only).

The operator decisions: the **CSV formula-injection posture (b)
STANDS** (21st re-affirmation — the guard intact in both export
families, the `-` exclusion documented, the reference bundle
byte-stable for the 34th consecutive session); the
**source-vocabulary documented parity STANDS AND EXTENDS to the N-63
family** (the two foreign doc files RETIRE with an absence pin — the
s54 DOC-FILE variant, git history the recovery path; the
construction-dead arms RETIRE — the N-62c class over internal
constants; the CALENDAR_CELL snapshot RE-DERIVES from the live page
— the drifted pin made honest, the s54 re-anchor precedent; the
sweep EXTENDS to full coverage; the header claim CORRECTED + the 8
records ANNOTATED — the N-46e/N-62d wire-or-remove posture family;
the defensive-DB-read arms ANNOTATED as deliberate; the auth warn +
the login cap + the comment/record-accuracy carriers land).

The plan (docs/plans/2026-10-05-session63-parity-remediation.md)
written and validated against the codebase (every anchor grepped at
file:line before execution; the blast radius pre-checked: zero test
pins on `?? stage` / `!view`; the email-cap family verified 160
everywhere but login; the sweep's "shadow" representative verified
unique pre-extension; the foreign docs' references verified
URL-only).

**RED**: the dead-code-hygiene session-63 describe (4 its: the
foreign-docs absence + the dead-arm split with the defensive
annotations pinned by marker + the auth-warn source pin + the
login-cap pin) + the page-layout sweep-coverage it + the two
CALENDAR_CELL re-anchors (the out-of-month it re-anchored to the
de-duplicated form + the NEW base it pinning the re-derived cell) —
exactly **7 failures; full suite through RED: 7 failed / 1209 passed
(1216 total)**.

**GREEN**: S63-P1 the foreign-docs retirement (`git rm` both files;
the absence pin the proof). S63-P2 the dead-arm split (the `?? stage`
pair + `!view` retired with construction-guarantee record comments;
the defensive triple + `o.stage` + `: 0` annotated with the
"defensive DB-read" / "statically required" markers, pinned). S63-P3
the page-layout honesty package (CALENDAR_CELL re-derived: base
carries the live `flex min-h-20 flex-col items-stretch …` form + the
focusRing key; outOfMonth de-duplicated; the 3 test its re-anchored
+ the new base it [s64 correction: only the OUT-OF-MONTH it carries
the s63 re-anchor note — the current/today its stayed byte-identical
to pre-s63 and simply went green through the record change; the
"re-anchored" plural overstated the touched set]; the sweep extended
41 → 71 groups with the
bare-string branch + the excluded vocabulary groups documented; the
module header corrected; the 8 records annotated). S63-P4 the
micro-hygiene (the auth warn-once production branch; login `{ max:
160 }`; the rate-limit header at the real numbers; the server-TZ
annotation at the startOf* seam; the G-1 session_117 correction
bracket; the G-2 PAD tree refresh; the G-3 spec comment; the G-4
contacts-page + entity-export pin precision notes). **Two mid-flight
pin repairs** (the chronic classes): the three O-map its re-anchored
to the `export const PIPELINE_LEGEND` DEFINITION form — the sweep
extension made the bare token ambiguous (the s62 self-shift lesson
applied the same session it was re-learned) + the sweep it's
INPUT_BASE representative switched to `.size` (the record is an
object; `toContain(object)` never matches a string array).

**Non-vacuousness**: pre-fix d0129de worktree (node_modules
hard-linked via cp -al) + the four modified test files as the ONLY
changes → **7 failed | 272 passed (279)** — exactly the RED set
isolated; the O-map re-anchors green-through-RED (they repair
anchors, not drive RED). Worktree cleaned; `git worktree list` = the
main checkout only; the main node_modules intact (sanity db-path
20/20 after cleanup).

**Full gate**: lint 0/0 · tsc 0 · **1216/1216 unit (75 suites, +6)**
· build clean (the standalone artifact ships og-image.png only) ·
**112/112 e2e** on a fresh CI=1 boot (2.5m, all 7 mobile-nav checks
green).

**LIVE battery**: the fix surfaces render — the dashboard pipeline
labels verified IDENTICAL through the retired-arm path (the API's
pipeline array + the page's "Sales Pipeline by Stage" card + the
O-map legend chips: Prospecting $190.0k / Qualification $110.0k /
Proposal $95.0k / Negotiation $130.0k / Won $337.0k); the calendar
cell matches the re-derived record BYTE-FOR-BYTE (the live button's
className = base + focusRing + the state ternary — `flex min-h-20
flex-col items-stretch rounded-lg border p-1 text-left
transition-all sm:min-h-24 sm:p-2 focus-visible:… ring-primary/30
border-line bg-gray-50 text-gray-400`); the drawer both directions
at TRUE 390px (open: aria-expanded, 8/8 truly visible, body locked,
focus on the Close button IN the drawer, scrollW 390; Escape: 0/8 +
unlocked); zero 390px overflow on all ten routes (both Dashboard
casings); NO Tailwind v4 bug (`--blur-sm` 4px + the exact pinned
shadow `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` probe-verified on the
live John Doe dialog input); the closing db:census MATCH (bound to
`file:/home/z/neo-crm/db/custom.db` — zero probe residue).

**Screenshots**: 02/11/12 re-captured + **72-calendar-cell-rederive
NEW** (1440×900, the s63 fix surface — the calendar month grid whose
cells the record now mirrors) — all four VLM-verified 4/4 PASS.

**Docs realigned**: README (badge 1328 = 1216 + 112, the Tested row,
the tree/command rows at 1216, the session-63 segment), AGENTS (the
commands table at 1216 + the session-63 block), CLAUDE (1216 ×3
[s64 correction: ×4 — CLAUDE.md carries the count at :38, :114, :125
and :371] +
the coverage note), PAD (the s63 inventory row [4 files, 6 new + 4
re-anchored] + the Total 1216 + 112 + the counting note + the G-2
tree-block refresh [s64 correction: the :357 tree-block landed at
"1210" — the plan's own pre-session number, stale by the session's
+6 its; refreshed to the live count at s64]), SKILL **v1.60.0** (frontmatter + project_state
+ the new §16bc, applied atomically via the assert-first
scripts/skill_edits_s63.py at the sandbox root, 5988 → 6053 lines by
wc -l; the doubled-word scan clean — the two hits are the legitimate
`flex flex-col` + `strokeDasharray="3 3"` tokens), this record, the
plan's execution record, both worklogs.

`.env`/`.env.example` re-verified (no env surface change; the
example matches the three-var code surface exactly: DATABASE_URL /
AUTH_SECRET / NEXT_PUBLIC_SITE_URL; DATABASE_URL
`file:../db/custom.db` with db/ at the repo root).

**Ship**: the commit on main + the SSH-wrapper v3 push to
`git@github.com:nordeim/neo-crm.git` + the remote verification + the
operator key shredded.
