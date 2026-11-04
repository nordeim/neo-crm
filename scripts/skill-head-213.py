#!/usr/bin/env python3
"""skill-head-213.py — the SKILL frontmatter head surgery (the s213 layer).

The arithmetic: the s213 layer ships at 2873/226 (the F-213a
semantic-prose conventions census — +6 its: the AGENTS "Conventions
that differ from defaults" block's semantic claims join the pin in
tests/facts-census.test.ts [the validation-seam + icon-cascade +
delta-text + z-scale census + eslint-ignores + the charts bullet's
AGENTS face]; E2E 226 HELD · SUITES 138 HELD · badge 3093 -> 3099).

The L-169c3 form (the 204-212 template): the verified-single guard.
The demoted s212 layer keeps its SHIP-TIME counts (2867/226) in its
own comment block (the s171-fix precedent). Idempotent: a re-run is a
verified no-op. Also bumps the frontmatter version (1.209.0 ->
1.210.0) + the H1 lockstep (the s197 exact-H1 guard form);
last_updated STAYS 2026-11-04 (the same-day form — the s209
precedent).

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live
s212 line still carries its ship count (2867/226), so the demotion is
a verbatim move. The retired blocks stay UNTOUCHED.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S213_MARKER = "project_state: 2873 unit checks + 226 e2e checks green; the session-213 layer ("

if S213_MARKER in text:
    print("  no-op  [SKILL head] the s213 layer already live")
else:
    LIVE_MARKER = "project_state: 2867 unit checks + 226 e2e checks green; the session-212 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s212 head marker found {live_count} times"

    # 1) extract the live s212 line — its ship count IS 2867/226 (the
    #    held-count form), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s212 layer keeps its ship counts
    #    (2867/226) in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-212 layer (comment-demoted at session-213 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198/\n"
        "     s199/s200/s201/s202/s203/s204/s205/s206/s207/s208/s209/s210/s211\n"
        "     layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s213 live layer — the semantic-prose conventions
    #    census (2873/226)
    S213_LAYER = (
        "project_state: 2873 unit checks + 226 e2e checks green; the session-213 layer "
        "(THE SEMANTIC-PROSE LAYOUT-CONTRACT CENSUS — the s212 close's named candidate, "
        "scoped to its first mechanically-checkable family: the AGENTS \"Conventions "
        "that differ from defaults\" block — the F-206a HOME BLOCK, where the stale "
        "strictness claim lived 31 sessions — joins the pin; the continued-workspace "
        "round [the rotation trigger THE OWNER'S NEWEST COMMIT b0bb8cd: the "
        "session_447 transcript — the s212 round's own execution record; the git pull "
        "fast-forwarding only that transcript; the standing .env contract verified in "
        "place, db census MATCH 15/24/10/23/12 + 4 users; the s212 lesson applied at "
        "the gate layer: the :3000 listener's DB anchor PROBED before the drift gates "
        "reused it — the dev server, cwd = the repo root, the correctly-anchored form, "
        "the parent-of-repo db/ absent]; the baseline gate GREEN at the exact s212 "
        "ship state: lint 0/0 · tsc 0 · 138/2867 unit · build · smoke 14/14 · e2e "
        "226/226 CLEAN [8.2m] · THE SIX DRIFT GATES ALL CLEAN — probe:ref STABLE at "
        "46bc2d9c · the four-band sweep at --fail-on-drift x4 [desktop 1280 · phone "
        "390x844 · tablet 768x1024 · landscape 1024x768] · the fullpage sweep CLEAN "
        "[desktop 0.093% / phone 0.316% — the exact standing margins] · the interior "
        "census CLEAN at --fail-on-drift [byte-parity]; the parity re-verification "
        "probed live with agent-browser against BOTH apps logged in — THE MOBILE "
        "NAVIGATION BOTH SURFACES WORKING [the drawer: the Close button + the CRM h2 "
        "+ the 8 destinations, the overlay rgba(0,0,0,0.8) vs our oklab(0 0 0 / 0.8), "
        "ours the body+main dual lock vs the reference's body-only — the documented "
        "superset, Escape + the Leads ride /Dashboard -> /Leads with auto-close + "
        "full release, verified on BOTH apps] + the landing disclosure menu working "
        "on BOTH apps [the 6 links, ours the aria-expanded superset, the in-panel "
        "FAQ ride lands /#faq + collapses] + Tailwind v4 clean + SEO/sitemap "
        "live-verified + the hygiene legs clean [bun audit at the pinned census 10] "
        "+ the scandihaven repo re-checked [61711c3, unchanged]): the round's "
        "material F-213a — THE SEMANTIC-PROSE RESIDUE (the fresh-eyes walk found "
        "ZERO live defects — every prose sample verified live: the icon cascade · "
        "the z-scale inventory · the delta tokens · the validation seam · the "
        "eslint ignores — so the round's material IS the named candidate, the "
        "genus-closing pin, the s208/s209 precedent): D-213a1 THE "
        "CONVENTIONS-BLOCK SEMANTIC CENSUS PIN [tests/facts-census.test.ts — six "
        "its: it-1 the VALIDATION-SEAM claim [zod ^4 read LIVE from node_modules · "
        "schemas.ts a real module · parseBody/asString/asNumber/asDate exported, "
        "the \\b-anchored forms] · it-2 the ICON-CASCADE claim [NAV_LAYOUT.icon + "
        "TOPBAR_LAYOUT.iconClass/searchIcon + MOBILE_NAV_TRIGGER.icon === h-5 w-5 · "
        "the content tokens REPORTS_FILTER_BAR.selectIcon/barBtnIcon + "
        "TOPBAR_LAYOUT.userChevron + LOGIN_LAYOUT.inputIcon carry h-4 w-4 · the "
        "sidebar's exactly-one strokeWidth={2}] · it-3 the DELTA-TEXT claim "
        "[DELTA_TEXT.good/bad === text-green-600/text-red-600 · the hand-inlined "
        "delta site carries the raw classes NOT the tokens · toast.tsx keeps "
        "text-success/text-danger — the stay-on-badges split] · it-4 the Z-SCALE "
        "CENSUS [the D-205a2 census form: the comment-stripped src/ walk collects "
        "EVERY z-tier, the tier set asserted a subset of {10,40,50,60,100} — any "
        "new tier trips the census — the four claimed tiers present, z-[9999] "
        "banned] · it-5 the ESLint-IGNORES claim [skills + the build output dirs, "
        "read live from eslint.config.mjs] · it-6 the CHARTS bullet's AGENTS face "
        "[the one chart-doctrine site D-207b1 never covered: recharts DEFAULTS + "
        "the REAL chart at all-zero data + the fixed/row-derived forms]; the "
        "doc-face arms read the WRAP-BLIND flattened section — the s208 birth "
        "lesson applied at birth; BORN-GREEN after two anchor-form cures [the "
        "REPORTS_FILTER_BAR token mis-anchor + the wrap-blind prose anchors — the "
        "D-208a1 birth precedent, the pin's own flaws not live findings]; "
        "MUTATION-PROVEN x6 [M1 NAV_LAYOUT.icon -> h-6 w-6 -> exactly 1 RED at "
        "it-2 · M2 the AGENTS icons bullet h-5 w-5 -> h-4 w-4 -> exactly 1 RED at "
        "it-2 · M3 a z-[9999] planted in toast.tsx -> exactly 1 RED at it-4 · M4 "
        "skills dropped from the eslint ignores -> exactly 1 RED at it-5 · M5 "
        "DELTA_TEXT.good -> text-success -> exactly 1 RED at it-3 · M6 parseBody "
        "renamed -> the FIRST RUN GREEN — the mutation caught the pin's own "
        "prefix-blind teeth [the regex matched parseBodyRenamed] — the \\b anchors "
        "added, the re-plant -> exactly 1 RED at it-1 — each restored -> GREEN]; "
        "STASH-PROOF [the describe stashed -> exactly 138/2867, the s212 ship "
        "state, zero collateral -> restored -> 138/2873]: THE COUNT LADDER UNIT "
        "2867 -> 2873 (+6) · SUITES 138 HELD · E2E 226 HELD · badge 3093 -> 3099 "
        "(the unit+e2e arithmetic: 2873+226 — verified against the live unit run: "
        "138/2873 GREEN) + the docs lockstep (the AGENTS Session-213 section · "
        "the PAD §7.1 s213 inventory row · docs/session_448.md · the plan's "
        "execution record + the worklog entry [Task ID 213] + the docs-counts "
        "layer-axis pair re-anchored [first = s213 · second = s212 at its ship "
        "2867/226]) + the captures 722-726 (the round's dev-server set) + beneath "
        "it 2867 unit checks + 226 e2e checks green; the session-212 layer (THE "
        "STANDALONE BUN-LAUNCH DB RE-ANCHOR — the session-34 recovery rejoins "
        "the session-170 artifact shape, and the phantom drift decodes to a live "
        "seam defect; the count ladder 2863 -> 2867 + the docs lockstep + the "
        "captures 717-721))"
    )

    # 4) the surgery: the demoted block + the new live layer replace the
    #    live s212 line
    text = text.replace(live_line, demoted_block + S213_LAYER, 1)

    # 5) the frontmatter version bump + the H1 lockstep (last_updated
    #    stays 2026-11-04 — the same-day form, the s209 precedent)
    v_old = "version: 1.209.0"
    v_new = "version: 1.210.0"
    assert text.count(v_old) == 1, "the frontmatter version must be unique"
    text = text.replace(v_old, v_new, 1)
    h1_old = "# NEO CRM — Engineering Skill (SKILL.md v1.209.0)"
    h1_new = "# NEO CRM — Engineering Skill (SKILL.md v1.210.0)"
    assert text.count(h1_old) == 1, "the H1 version lockstep site must be unique"
    text = text.replace(h1_old, h1_new, 1)

    SKILL.write_text(text, encoding="utf8")
    print("  flip  [SKILL head] the s213 layer live at 2873/226 (the s212 layer demoted at its ship 2867/226)")
    print("  flip  [SKILL frontmatter] version 1.209.0 -> 1.210.0 (last_updated stays 2026-11-04 — the same-day form)")

print("skill-head-213.py done")
