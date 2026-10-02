# Session 59 Log — the dead-control decode closure (session-33)

The workspace refresh: `git pull` brought `4ceb095 → fad0793`
(`docs/session_58.md` — the operator's session-32 transcript only, zero
app-code drift). The full doc set reviewed (SKILL v1.29.0's §16x +
project_state, AGENTS/CLAUDE/README/PAD at the 793+106 counts) and the
seams verified in code before the baseline gate. The environment: `.env`
`file:../db/custom.db` + `db/` at root verified, the bundle cache alive
(`scripts/reference-bundle.js` outside the repo tree, md5
`a70a637fcf1d4291da8e0d965676dc11`), the scandihaven ref alive at
`cb0002a`, agent-browser 0.38.1, the ssh shim intact, vitest (47 suites)
+ playwright (5 specs) + `.env.example` all in place.

Baseline gate: **lint 0/0 · tsc 0 · 793/793 unit · build clean · 106/106
e2e** — first try, no flakes.

Standing layers re-verified (29th session) — NO DRIFT: the reference
bundle BYTE-IDENTICAL to the s30/s31/s32 cache
(`/assets/index-DZ-xbrIm.js`, 1,631,071 bytes, md5
`a70a637fcf1d4291da8e0d965676dc11` — no redeploy); the reference at a
TRUE 390px viewport still ships NO navigation (8 links in the DOM, 0
visible, the nav box w=0, no hamburger); our drawer spot-verified live
on the dev server (the REAL "Open navigation menu" trigger → 8 links
visible inside the dialog + body scroll lock; Escape → closed via the
wrapper's computed visibility:hidden + unlocked + aria-expanded false);
zero 390px overflow on all nine routes BOTH apps; the reference demo
data still ZERO (29th session) — and its zero-data dashboard
live-confirms the s32 currency doctrine again ("$0.0k" / "$0.0k" /
"$0k"). The login page byte-compared at parity; the Calendar page
(KPIs, the October-2026 grid, the agenda, the Filters/Clear All/Type/
Date vocabulary) compared at parity; the Tailwind v4 stack audited
healthy (postcss plugin + literal-hex @theme + the vendored
tw-animate.css, body computes #f9fafb from the tokens); the dev log
clean (all API routes 200, zero app errors).

**The NEW audit — two dead controls the dead-list had missed.** (1) The
reference's dashboard filter-bar "Stage: Source" search input renders as
`c.jsx(Ct,{placeholder:"Stage: Source",className:"pl-9 h-9"})` — NO
value, NO onChange (the same dead-input family as the s32 topbar
"Search Anything..." decode); OURS is functional (it filters the Recent
Deals rows) but the decode was undocumented and the placeholder was
hardcoded in page.tsx, outside the FILTER_BAR contract. (2) The
reference's dashboard header "Add" button carries NO onClick — the
§16c-era dead-list covered only the Export buttons + the login Sign up
link; live-confirmed at desktop 1280, the whole Add/Export/Export trio
(outline + outline + the blue `bg-blue-600 hover:bg-blue-700` primary
with the bare label) is dead there. Verified at parity: the reference's
dashboard Stage select (`value=i,onValueChange=a`, the five opp stages
+ all) and Source select (`value=s,onValueChange=o`,
call/email/website/partner + all) ARE functional — matching ours; the
"More..." button + the middle empty-trigger Format select stay dead
(the s24/S8-2 pins); our header trio + filter bar + KPI row render the
documented parity (the s8-pinned trio, the S8-2 empty-switcher, the
KPI_STATICS deltas +5.3%/+15%, the s32 currency scales).

TDD Phase A: **6 new checks** across the two suites — page-layout (the
`FILTER_BAR.searchPlaceholder` pin + the `DASHBOARD_HEADER` trio
extension pins) + dashboard-contracts (the contract-consumed
placeholder render + the no-hardcoded-literal guard, the functional
search wiring, the trio's contract-consumed labels, the no-op
Filter/More pair) — RED confirmed (4 failed / 202 pre-existing passes;
the 2 functional-superset guards passed against the current code as
expected). Phase B: the `searchPlaceholder` constant + the extended
`DASHBOARD_HEADER` contract (addLabel/addLabelClass/
outlineExportLabel/outlineExportLabelClass + the s8-era
primaryExportLabel pair) in src/lib/page-layout.ts, page.tsx rewired to
consume them (the Add + outline-Export labels/classes + the search
placeholder) — a pure constants extraction with zero visual delta.

Phase C gate: **lint 0/0 · tsc 0 · 799/799 unit (+6) · build clean ·
106/106 e2e** + LIVE verification on the dev server: the dashboard
renders the trio exactly (Add outline / Export outline / Export blue
rgb(37,99,235)), the placeholder renders from the contract, and the
search round-trip works (typing "LMS" filters Recent Deals to the
single matching row; clearing restores all five).

Phase D: **4 screenshots** (02-dashboard re-captured + **41** the
functional search filtering Recent Deals — the new shot, the documented
superset in action — + the 11/12 mobile standing shots; 02 + 41
VLM-verified: the trio + filter bar + KPI values exact, the "LMS" input
+ the single filtered row both in frame). `.env`/`.env.example`
re-verified (no new env surface). Docs realigned: README badge 905 +
the session-33 paragraph, AGENTS counts + the session-33 contract
block, CLAUDE counts + the dead-control paragraph, PAD the session-33
test row / 799+106, SKILL **v1.30.0** §16y + frontmatter + project_state
+ the §16c-era dead-list extension + the stale title-version fix, this
transcript, the plan's execution record, both worklogs.

**What happened:** the two missed dead-control decodes closed — the
"Stage: Source" input and the header "Add" button are now documented,
contract-pinned, and test-pinned; the functional supersets stay. The
census-method lessons recorded in §16y: element.onclick never shows
React handlers (decode deadness from the bundle or click + observe),
offsetWidth > 0 is not visibility (gate on getComputedStyle), and
below-the-fold interaction shots need scrollIntoView or a taller
viewport. **799/799 unit · 106/106 e2e · 4 screenshots** — docs
realigned at SKILL v1.30.0.

**Next steps:** the Scan Card / Import AI extraction stays base44-only
(documented divergence — no action possible), the Opportunity
create/edit UI stays absent on BOTH sides (the read-only entity,
mirrored), and the standing drift re-sweep on the next live visit (the
reference has now been bundle-stable for four consecutive sessions).
