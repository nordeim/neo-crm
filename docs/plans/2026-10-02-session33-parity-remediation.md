# Session 33 Plan — the dead-control decode closure + the audit-hardening layer

Date: 2026-10-02 · Branch: `main` · Base: `fad0793` (docs/session_58.md only — zero app-code drift)

## Context

Session-32 shipped the currency-format + period-wire-id remediation (commits
`7d834d4` + `4ceb095`, gate 793/793 unit · 106/106 e2e, SKILL v1.29.0).
The s57 Next-steps named three pointers: the base44-only AI extraction (no
action possible), the Opportunity create/edit UI (absent on BOTH sides —
read-only entity, mirrored), and the standing drift re-sweep. This session
executes the re-sweep (29th) and closes the two documentation gaps the fresh
bundle decode surfaced.

## Audit results

### Standing layers — 29th consecutive session, NO DRIFT

- Baseline gate GREEN FIRST TRY: lint 0/0 · tsc 0 · 793/793 unit · build
  clean · 106/106 e2e — matching the docs exactly.
- The reference bundle BYTE-IDENTICAL to the s30/s31/s32 cache
  (`/assets/index-DZ-xbrIm.js`, 1,631,071 bytes, md5
  `a70a637fcf1d4291da8e0d965676dc11`) — no redeploy, every bundle contract
  intact.
- The reference at a TRUE 390px viewport: 8 nav links in the DOM, **0
  visible** (nav box w=0), no hamburger — the mobile-nav defect STANDS
  (29th session).
- Our drawer spot-verified LIVE on the dev server at 390px (the REAL "Open
  navigation menu" trigger → 8 links visible inside the dialog + body scroll
  lock; Escape → closed via the wrapper's visibility:hidden + unlocked +
  aria-expanded false).
- Zero 390px horizontal overflow on all nine routes BOTH apps.
- The reference demo data still ZERO (29th session).
- The reference's zero-data dashboard live-confirms the s32 currency
  doctrine again ("$0.0k" / "$0.0k" / "$0k").
- Login page byte-compared at parity; the Calendar page (KPIs, October-2026
  grid, agenda, the Filters/Clear All/Type/Date vocabulary) compared at
  parity; the scandihaven ref stable at `cb0002a`; agent-browser 0.38.1;
  Tailwind v4 stack healthy (postcss plugin + literal-hex @theme + the
  vendored tw-animate.css; body computes #f9fafb from the tokens).
- Environment: `.env` `file:../db/custom.db` + `db/` at root verified,
  `.env.example` present, vitest (47 suites) + playwright (5 specs)
  configured, uploads/ gitignored.

### The NEW decode — two dead controls on the reference dashboard (bundle + live)

1. **The dashboard filter-bar search input is DEAD.** The bundle renders
   `c.jsx(Ct,{placeholder:"Stage: Source",className:"pl-9 h-9"})` — NO
   value, NO onChange (the same dead-input family as the s32 topbar
   "Search Anything..." decode). Ours is FUNCTIONAL (it filters the Recent
   Deals rows — page.tsx lines 70-77) — a superset, but UNDOCUMENTED: the
   topbar search has its documented non-mirror note; this one has none, and
   its placeholder "Stage: Source" is HARDCODED in page.tsx (outside the
   FILTER_BAR contract, unpinned by tests).
2. **The dashboard header "Add" button is DEAD.** The bundle renders
   `c.jsxs(Ke,{variant:"outline",size:"sm",children:[icon,"Add"]})` with
   NO onClick. The SKILL's dead-surfaces list (§16c-era) covers "every
   Export button + the login Sign up link" but NOT the Add button. Ours is
   the functional quick-create dropdown (the s6/s8 documented superset).
3. Live-confirmed at desktop 1280px: the reference's header renders THREE
   buttons — Add (outline, `h-8 rounded-md px-3 text-xs`), Export (outline,
   label hidden below sm), Export (BLUE `bg-blue-600 hover:bg-blue-700`,
   bare always-visible label) — already mirrored by S8-P1; the
   DASHBOARD_HEADER contract pins only `primaryExportLabel` — the trio's
   full shape is unpinned.
4. Verified functional on the reference (matching ours): the dashboard
   Stage select (`value=i,onValueChange=a` — all/prospecting/qualification/
   proposal/negotiation/closed_won) and the Source select
   (`value=s,onValueChange=o` — all/call/email/website/partner). The
   "More..." button + the middle empty-trigger Format select stay dead
   (s24/S8-2 pins).

## The remediation — S33-P1..P5

- **S33-P1 — the FILTER_BAR search contract**: extract
  `FILTER_BAR.searchPlaceholder: "Stage: Source"` (page-layout.ts) with the
  dead-input decode note; rewire page.tsx to consume it.
- **S33-P2 — the DASHBOARD_HEADER trio contract**: extend DASHBOARD_HEADER
  with the trio's shape (addLabel "Add" + the hidden-sm label class + the
  outline-Export's label class + the primary Export's blue variant class)
  and the dead-affordance note (all three dead on the reference; ours the
  documented functional superset); rewire page.tsx.
- **S33-P3 — the TDD test layer**: RED-first pins in page-layout.test.ts
  (the FILTER_BAR.searchPlaceholder + the DASHBOARD_HEADER trio constants)
  and dashboard-contracts.test.ts (the page.tsx render contract: the
  placeholder consumed from FILTER_BAR, the search input FUNCTIONAL
  [value+onChange present], the trio's three buttons at the documented
  variants) — the source-pin anchors on CODE, never comments (the §16x
  lesson).
- **S33-P4 — the gate**: lint 0/0 · tsc 0 · unit (793 + new) · build ·
  e2e (106) · LIVE re-verification on the dev server (the dashboard
  renders identically — the placeholder, the trio, the KPIs).
- **S33-P5 — the deliverables**: the screenshot set re-captured (02 the
  dashboard + the standing shots), `.env`/`.env.example` re-verified, docs
  realigned (README badge + the session-33 paragraph, AGENTS counts + the
  dead-list extension, CLAUDE counts + the FILTER_BAR/HEADER re-scope, PAD
  test matrix, SKILL v1.30.0 §16y + frontmatter + project_state +
  §16c-era dead-list extension, docs/session_59.md, this plan's execution
  record, both worklogs) · commit + SSH-wrapper push.

## Validation gates

- RED-first: the new FILTER_BAR/DASHBOARD_HEADER/trio pins must fail
  against the current code (the s29-s32 TDD doctrine).
- GREEN: lint 0/0 · tsc 0 · unit (793 + new) · build · e2e (106).
- LIVE: the dashboard's rendered filter bar + header trio byte-identical
  to the pre-change state (a pure constants extraction — zero visual
  delta), the search still filtering.

## Deferred (documented, not this session)

The Scan Card / Import AI extraction (base44-only), the Opportunity
create/edit UI (absent on BOTH sides — the read-only entity mirrored), the
reference's dead topbar search + dead accounts View/Format selects (the
s32-documented supersets).

---

## EXECUTION RECORD (2026-10-02, post-gate)

Executed as planned, S33-P1..P5 all landed:

- **S33-P1**: `FILTER_BAR.searchPlaceholder: "Stage: Source"` pinned in
  src/lib/page-layout.ts with the dead-input decode note; page.tsx
  consumes it as `placeholder={FILTER_BAR.searchPlaceholder}`.
- **S33-P2**: `DASHBOARD_HEADER` extended with the trio's shape —
  `addLabel: "Add"` + `addLabelClass: "hidden sm:inline"` +
  `outlineExportLabel: "Export"` + `outlineExportLabelClass:
  "hidden sm:inline"` (the s8-era `primaryExportLabel`/
  `primaryExportLabelClass` pair kept) + the dead-trio decode note;
  page.tsx consumes all four new fields.
- **S33-P3**: RED 6 first (4 failed / 202 passed — the 2
  functional-superset guards passed against the current code as
  expected), then GREEN at **799/799 unit (+6)** — page-layout.test.ts
  (the 2 constant pins) + dashboard-contracts.test.ts (the 4 render
  pins: the contract-consumed placeholder + no-hardcoded-literal guard,
  the functional value/onChange wiring, the trio's contract-consumed
  labels, the no-op Filter/More pair).
- **S33-P4**: gate green — lint 0/0 · tsc 0 · 799/799 unit · build
  clean · 106/106 e2e; LIVE-verified on the dev server (the trio
  renders exactly — Add outline / Export outline / Export blue
  rgb(37,99,235); the placeholder from the contract; the search
  round-trip: "LMS" → the single filtered Recent Deals row, clear →
  all five restored).
- **S33-P5**: 4 screenshots (02 re-captured + **41** the functional
  search filtering Recent Deals — NEW — + the 11/12 mobile standing
  shots; 02 + 41 VLM-verified); docs realigned (README badge 905 + the
  session-33 paragraph, AGENTS counts + the session-33 block, CLAUDE
  counts + the dead-control paragraph, PAD the s33 test row / 799+106,
  SKILL v1.30.0 §16y + frontmatter + project_state + the §16c-era
  dead-list extension + the stale title-version fix, docs/session_59.md,
  both worklogs); .env/.env.example re-verified (no new env surface).
- Standing layers: 29th session, NO DRIFT (the bundle md5-identical,
  the reference's mobile-nav absence at a TRUE 390px, our drawer live
  both directions, zero overflow both apps, the demo data still zero).
- Gate-caught hazards (recorded as the §16y census-method lessons):
  element.onclick never shows React handlers (decode deadness from the
  bundle), offsetWidth > 0 is not visibility (gate on
  getComputedStyle), below-the-fold interaction shots need
  scrollIntoView or a taller viewport (the first 41 capture verified
  nothing).
