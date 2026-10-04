Session 58 — the dead-surface narrowing + the type-contract boundary
session (docs/session_108.md, the s57 transcript; the operator's brief =
the standing cycle). Workspace INTACT from s57 (no sandbox reset): the
tree refreshed by `git pull` (a2a1d1c..d33a90d — the operator's
session_108 transcript only; zero app-code drift). The OUTER
sandbox-root `.env` hazard (a `DATABASE_URL` pointing at the mirror db
— the documented s53 class) found at intake and QUARANTINED
(`.env.quarantined-s58`); the s57 zombie dev server on :3000 killed
(the s51 lesson) before the LIVE battery's fresh boot.

The five core docs re-read (AGENTS/CLAUDE/README/PAD/SKILL v1.54.0),
then the session docs (session_107, the s57 plan + execution record,
the worklog tails, session_108). **Baseline gate GREEN: lint 0/0
(enforced) · tsc 0 · 1194/1194 unit (75 suites)** — the documented
state exact. The DB census through the sanctioned seam:
`database: file:/home/z/my-project/neo-crm/db/custom.db` + 15/24/10/23/12
+ 4 users + `pristine: MATCH`. The `skills/` exclusion verified in all
three configs. The vitest + playwright configs verified (the include
allowlist / the e2e port + scratch-db contract).

The standing drift re-sweep (54th session): the reference bundle
fresh-fetched — **byte-identical** (size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` exact — the **29th consecutive
stable session**). The reference census (54th): the demo data still
zero; the mobile-nav defect stands at a TRUE 390px (nav w=0, links in
DOM, 0 visible, scrollW 390, NO hamburger); desktop nav normal; a
reference 390px screenshot captured (reference-390-s58.png).

The two parallel audit agents (58-a/58-b) + every finding manually
validated at file:line: **58-a** — all eight session-57 checklist items
GENUINE (the worktree arithmetic mechanically REPLAYED: 2 failed | 25
passed pre-fix), with one sub-claim inaccuracy found: the s57-corrected
"activities-page:384" line citation already off by one at HEAD (the
s57 comment correction itself grew the file's comment block one line,
self-shifting the token to :385 — the chronic self-shift class, second
generation). **58-b** — ZERO graduations (**13/13 CONFIRMED, 15th
consecutive session**; the drift map line-only, substance identical),
the INFO family unchanged (F-47c, N-48c, N-48f, N-48j, N-51c), both
operator decisions' code anchors standing, and the fresh-eyes sweep
(24 files + three repo-wide mechanical censuses — orphaned imports
ZERO across all 104 src files, never-caching memos ZERO, unread props
ZERO) finding the **N-58 family**: the crm-store zero-consumer ALIAS
export `export { call as apiCall }` (N-58a — dead since the initial
commit), the four definition-only TYPE exports (N-58b — the types
barrel's SearchResult [zero references AND shape-inaccurate vs the
topbar's live inline row shape] + constants.ts's
LeadStage/ActivityType/EventType derived types), and the ~20-member
internally-live export-keyword class (N-58c).

**The operator decisions (session 58):** (1) the CSV
formula-injection posture **(b) STANDS** (16th consecutive
re-affirmation; the bundle byte-identical for the 29th consecutive
session). (2) The source-vocabulary documented parity **STANDS AND
EXTENDS** to the N-58 family WITH the module type-contract boundary:
the fully-dead surfaces retire (the N-58a alias export + the four
N-58b definition-only types — the s48/s49/s54 policy, TYPE variant),
while the ~20 internally-consumed export keywords KEEP as each
module's declared contract surface (the N-56e KEEP mechanism applied
to app-owned modules — pinned by the new guard so future sweeps don't
re-litigate it). The vendored ui stock-surface mirror stays whole (the
N-56e boundary, unchanged).

The plan written
(docs/plans/2026-10-05-session58-parity-remediation.md) with the
families S58-P1..P5, validated against the codebase before execution
(the blast radius: zero test pins on apiCall / SearchResult /
LeadStage / ActivityType / EventType; the `defaultLeadStage` settings
FIELD a different identifier; one doc carrier — SKILL §20).

**RED**: the dead-code-hygiene session-58 describe (3 RED + 1 guard —
the guard pins the living surfaces AND the N-58c boundary: the store's
`async function call` engine, the three arrays, and the representative
KEEP set [ApiError/ApiResult, DeltaText/DeltaBadgeText,
RateLimitResult, CrmState] stay exported). RED run: **exactly 3
failures**; full suite through RED: **3 failed / 1195 passed (1198
total)**.

**GREEN**: S58-P1 — the line-citation self-shift refresh
(:384→:385, annotated). S58-P2 — the dead-surface narrowing (crm-store:
the alias export line retired; types/index.ts: SearchResult retired;
constants.ts: the three derived types retired — each with a record
comment; the SKILL §20 carrier followed). The 3-RED set re-proven
mechanically non-vacuous in a pre-fix `d33a90d` worktree (node_modules
hard-linked): **3 failed | 28 passed there**, **31/31** on the suite
at the fix; the worktree cleaned after.

**FULL GATE GREEN: lint 0/0 (enforced) · tsc 0 · 1198/1198 unit (75
suites, +4) · build clean · 112/112 e2e on a fresh CI=1 boot** (all 7
mobile-nav checks green; the one Turbopack warning pre-existing — the
upload route).

**LIVE verification battery on the dev server** — the fix surface:
the topbar Search popover (the would-be SearchResult consumer) renders
its full contract LIVE (the typed query opens the grouped results
dropdown — an Accounts row [Al Noor Manufacturing], Contacts rows
[Tomas Novak, Yousef Haddadi], Leads rows with stage · value hints
[Field service app · Lost · $64.0k] — through the module's own inline
row shape, zero errors). The standing battery: the drawer both
directions at a TRUE 390px (the real trigger → the 288px panel with
8/8 truly visible links + aria-expanded + the body+scroller dual lock
+ focus landed inside the panel; Escape → 0/8 truly visible +
visibility:hidden + inert + unlocked); **zero 390px overflow on all
ten routes** (both Dashboard casings); **NO Tailwind v4 bug** (the
token contract: `--blur-sm` = 4px, the live input's computed shadow
carries the exact pinned `rgba(0,0,0,0.05) 0px 1px 2px 0px` —
probe-verified). Zero probe residue through the seam (the closing
`bun run db:census` MATCH).

Screenshots: 02/11/12 re-captured (the standing set) +
**67-topbar-search NEW** (the fix surface at 1440×900 — the search
popover with its grouped results open). All four VLM-verified (02:
sidebar + KPI row + both charts + zero defects — the Recent Deals
table below the fold at 1440×900, the standing composition; 11:
hamburger + KPI cards + no overflow; 12: the drawer + 8 links + X +
dimmed overlay; 67: the typed input + the grouped dropdown + clean
render + intact topbar).

Docs realignment: README (badge 1309 = 1198 + 112, the session-58
paragraph, the Tested row, the test command row), AGENTS (1198/112 +
the session-58 block), CLAUDE (1198 ×3), PAD (the s58 test-inventory
row / the Total / the tree row / the HEAD note), SKILL **v1.55.0**
(frontmatter + project_state + the H1 + the new §16ax — applied
atomically through the persisted assert-first script,
scripts/skill_edits_s58.py at the sandbox root, 5622 → 5692 lines,
zero anchor repairs; the §20 SearchResult carrier removed), this
record, the plan's execution record, both worklogs.
`.env`/`.env.example` re-verified (no env surface change; the example
matches the three-var code surface exactly: DATABASE_URL /
AUTH_SECRET / NEXT_PUBLIC_SITE_URL).

**The headline**: the fully-dead class's TYPE variant found and swept
— four definition-only type exports retired (SearchResult doubly so:
zero consumers AND a shape the live consumer never used), the
zero-consumer alias export gone, and the ~20-member internally-live
export-keyword class resolved by a durable, guard-pinned boundary
(the N-56e mechanism applied to app-owned modules) instead of a
churn-inducing sweep. 13/13 ledger zero graduations for the 15th
consecutive session, both operator decisions standing, the reference
bundle stable for the 29th consecutive session.

**Gate**: lint 0/0 · tsc 0 · **1198/1198 unit (+4 RED-first pins,
proven non-vacuous)** · **112/112 e2e** (fresh boot) · 54th
drift-sweep clean (29th consecutive stable reference bundle) ·
live-verified, zero probe residue (through the seam) · docs at SKILL
v1.55.0 + `docs/session_109.md`.

**Suggested next**: the standing ledger (13 items, 15 sessions zero
graduations), the INFO family unchanged (F-47c, N-48c, N-48f, N-48j,
N-51c — all triaged), the drift re-sweep next live visit, the
dead-surface census now covering the ALIAS + TYPE variants and the
type-contract boundary (§16ax).
