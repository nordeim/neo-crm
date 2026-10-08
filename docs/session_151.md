# Session 78 (2026-10-08) — the dashboard family rotation

The workspace SURVIVED s77 (the pull fast-forwarded 92bc235 → 9966dbb, docs/session_150.md only — the session-77 execution narrative, zero code drift). Environment verified in place (DATABASE_URL="file:../db/custom.db" with db/ at the repo root; census MATCH 15/24/10/23/12 + 4 users). The platform DATABASE_URL override hazard stands — all ops under env -u DATABASE_URL.

Baseline gate GREEN: lint 0/0 · tsc 0 · 1495/1495 unit (86 suites) · playwright --list 132 in 4 files — the documented state exact; the skills/ exclusion verified in all three configs.

Drift sweep #74 CLEAN — the reference bundle byte-identical (1,631,071 bytes, md5 a70a637... — the 49th consecutive stable session).

Reference census #74 (agent-browser, live login at 1280 then a TRUE 390px viewport): the demo data zero (0/$0.0k/$0.0k/$0k/0%); the mobile-nav defect STANDS at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible, no hamburger); desktop normal (256px, 8 links, all visible). Our mobile drawer stays the deliberate documented superset.

Session 77 shipped at 92bc235. My task is **Session 78** — the session_149 suggested target: the dashboard's remaining KPI-memo seams (never re-rotated since the KPI_STATICS adjudication).

The triple audits ran in parallel (78-a the s77 re-audit + 78-b the graduation audit as subagents; 78-c the fresh-eyes rotation on the dashboard family by the orchestrator, every parity claim bundle-decoded against the fresh-fetched reference — the Eke component's g/p/m/b/y/x/_/A memos — the bar construction additionally LIVE-PROBED on the reference):

- **78-a: 15/15 GENUINE** — every S77-P1..P13 fix verified at file:line, the counts corroborated by live runs (86/1495 + 132), the 92bc235 commit honest (22 files, +1080/−144, zero strays), 9966dbb docs-only. Five nano notes (the path shorthands, the plan P5 line-citation drift, the RED-phrasing ambiguity, the N-77c17 deferral reconfirmation, PAD:758's historical row).
- **78-b: ZERO graduations, 13/13 (the 35th consecutive)** — the 8 mechanical censuses 7 CLEAN + ONE finding: the SKILL.md YAML frontmatter `version: 1.73.0` + `last_updated: 2026-10-06` (the s77 H1 repair never bumped the frontmatter field). Both operator decisions' evidence INTACT.
- **78-c: the N-78 family — 2 M + 3 L + 4 N** on the dashboard family, every M/L claim bundle-decoded + manually validated (component identities: the Eke dashboard with its g/p/m/b/y/x/_/A memos; the zv/gm stat-card twins; the middle select's placeholder "Format" decodes but renders EMPTY live — the S8-2 "empty label" pin re-verified standing, the bundle-vs-live nuance documented).

**The operator decisions (37th re-affirmation):** the CSV formula-injection posture (b) STANDS — the guard intact (csv.ts:31-33 → escapeCell → entity-export.ts's qq), ZERO new unguarded builders (the dashboard family's five export affordances are the pre-existing guarded seams), the bundle byte-stable for the 49th consecutive session. The source-vocabulary documented parity STANDS AND EXTENDS to the dashboard family — the filter bar's source select is the raw 4-option set (call/email/website/partner — no Referral), byte-verified; no enum-membership changes; wire values stay raw.

The plan (S78-P1..P10) written + validated against the codebase (the blast radius pre-checked: the opportunity-model route pins, the dch N-66j pin, the N-63b evidence line; the surviving pins verified).

RED: **26 failing pins exactly** (the new dashboard-family-parity suite's 23 + the 3 re-anchors). Non-vacuousness PROVEN at the pre-fix state: 26 failed | 1497 passed — exactly the modified-pin set, ZERO collateral.

GREEN applied in full: the raw-percentage bar sparks (the reference's RAW static values AS the heights — `style height ${v}%`, flex-1 rounded-sm, no normalization/floor/opacity; the BarStatCard twin fixed with it); the filter re-derivation (the p memo on the store's opportunities slice feeding the Deals Closed + Revenue This Month KPIs, the pipeline chart + legend, topReps, and the full-list-sorted-slice-5 Recent Deals; the route's unconsumed copies + daysUntil retired); the trailing MoreHorizontal ghost button; the upcoming window (top-10-by-dueAt-desc, take 10, no status filter, slice 3 — the seeded data shows the delta LIVE); the accounts Loading row (the M-77c3 missed sibling); the relatedName-bare subtext; the border-b hover:bg-background row classes; the KPI_SPARK.bars member + the mixed-family comment; the SKILL frontmatter repair.

Nine mid-flight pin-shape repairs (the RED/GREEN runs' own catches) + ONE mid-flight e2e repair (the accounts Loading-row race — the two e2e gates gained the deterministic Loading-absence wait; the first CI=1 run caught it, the re-run green).

Typecheck clean. **FULL UNIT: 1523/1523 (87 suites, +28).** Lint 0/0 + build clean. **FULL E2E GATE: 132/132 on a fresh CI=1 boot (all 9 mobile-nav checks green).**

LIVE battery: the KPI bars computing byte-identical to the reference (heights 40%/55%/45%/70%/60%/80%/75%, radius 4px, first bar 12.7969px on the 32px rail — the same number the reference's probe measured); the filter re-derivation round-trip (Prospecting → $0.0k/$0.0k + 1 pipeline bar + 2 rows + topReps emptied; the unfiltered 24/29.2%/83 unchanged; reset restores); the trailing buttons 5/5; bg-background = rgb(249,250,251) = the reference's gray-50; the accounts Loading row observed via MutationObserver then 10 rows; the Upcoming card rendering the reference's 3-furthest-DESC construction (10/16, 10/13, 10/12); Lead Sources slice(4); the drawer at TRUE 390px (full-bleed, 8 links, focus inside, body locked; Escape → inert + hidden + unlocked); zero overflow on all ten routes; NO Tailwind v4 bug (blur 4px + the shadow-sm re-pin + rounded-sm 4px); the closing census MATCH (256px/8).

Screenshots 95 (the KPI bar sparks) + 96 (the Won-filter re-derivation contrast state) NEW — VLM 5/5 PASS + 3/5 with both flags run down (the legend-chips flag was the verification prompt's own wrong assumption — the reference renders ALL FIVE chips from the m memo, DOM-verified; the trailing-button flag a VLM-scale artifact — DOM 4/4 in the Won state).

Docs realignment: SKILL v1.75.0 (§16br + project_state, 6991 → 7065, via the assert-first scripts/skill_edits_s78.py at the sandbox root + the STALE FRONTMATTER REPAIR — the YAML version/last_updated had never ridden a bump since s76) + README badge 1655 + AGENTS/CLAUDE/PAD at 1523+132 (+ the PAD s78 inventory row) + this record + the plan's execution record + the repo worklog. .env/.env.example verified (no env surface change).

## Summary

The full session-78 cycle completed on the **dashboard family** (the session_149 suggested target — the KPI-memo seams' first dedicated rotation since the KPI_STATICS adjudication):

- **Audits**: 78-a s77 re-audit 15/15 genuine · 78-b zero graduations 13/13 (35th consecutive), 7/8 censuses clean + the SKILL frontmatter finding · 78-c the fresh-eyes rotation found the N-78 family (2 M + 3 L + 4 N, every M/L claim bundle-decoded, the bar construction live-probed on the reference)
- **Key fixes**: the raw-percentage bar sparks (the normalization invention retired on the dashboard's three cards + the BarStatCard twin's eleven — the fourth bundle-beats-live instance), the filter re-derivation onto the reference's p memo (the KPIs + chart + topReps + table now re-derive from the filtered opps, with the route's unconsumed members retired), the trailing ghost button, the upcoming 3-furthest-desc window, the accounts Loading row (the s77 missed sibling)
- **Deferred with evidence**: N-77c17 (the TableHead token sweep) stays deferred (family-wide, unchanged); the contacts table carries no Loading ternary in the bundle (verified before extending the fix)
- **Gate**: lint 0/0 · tsc 0 · **1523/1523 unit (87 suites, +28)** · build · **132/132 e2e** — all RED-first, non-vacuousness proven (26 | 1497 pre-fix)
- **LIVE-verified** incl. the mobile drawer at 390px, no Tailwind v4 bug, 2 VLM-verified screenshots (5/5 + 3/5-with-flags-run-down)
- **Both operator decisions standing** (the 37th re-affirmation, evidence-first)

**Suggested next (session 79)**: the N-77c17 TableHead token sweep (the deferred family-wide question — text-muted vs text-muted-foreground on every table) or the remaining never-rotated seams (the login/signup card family; the topbar's chrome); standing: the insights-dialog icon identities remain unresolvable-in-bundle.
