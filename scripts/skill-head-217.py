#!/usr/bin/env python3
"""skill-head-217.py — the SKILL frontmatter head surgery (the s217 layer).

The arithmetic: the s217 layer ships at 2897/226 (the F-217a/b/c PAD
narrative-block semantic census — +3 its: the blueprint's stale trio
joins the pin in tests/facts-census.test.ts [the §8.1 build-gate
correction + the §2 diagram boundary correction + the header-date
live-tense]; the first draft's fourth it — the spec-count live census —
REMOVED at the mutation battery's M1 catch: the arm already belongs to
docs-counts:1916, the s147 root-cause cure; E2E 226 HELD · SUITES 138
HELD · badge 3120 -> 3123).

The L-169c3 form (the 204-216 template): the verified-single guard.
The demoted s216 layer keeps its SHIP-TIME counts (2894/226) in its
own comment block (the s171-fix precedent). Idempotent: a re-run is a
verified no-op. Also bumps the frontmatter version (1.213.0 ->
1.214.0) + the H1 lockstep (the s197 exact-H1 guard form);
last_updated stays 2026-11-05 (the same-day form).
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S217_MARKER = "project_state: 2897 unit checks + 226 e2e checks green; the session-217 layer ("

if S217_MARKER in text:
    print("  no-op  [SKILL head] the s217 layer already live")
else:
    LIVE_MARKER = "project_state: 2894 unit checks + 226 e2e checks green; the session-216 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s216 head marker found {live_count} times"

    # 1) extract the live s216 line — its ship count IS 2894/226 (the
    #    held-count form), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s216 layer keeps its ship counts
    #    (2894/226) in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-216 layer (comment-demoted at session-217 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198/\n"
        "     s199/s200/s201/s202/s203/s204/s205/s206/s207/s208/s209/s210/s211/\n"
        "     s212/s213/s214/s215 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s217 live layer — the PAD narrative-block semantic
    #    census (2897/226)
    S217_LAYER = (
        "project_state: 2897 unit checks + 226 e2e checks green; the session-217 layer "
        "(THE PAD NARRATIVE-BLOCK SEMANTIC-PROSE CENSUS — the s216 close's named "
        "candidate: the architecture-facts section's remaining surface [the "
        "sessions-10-49 DOM-parity bullets' doc faces, the narrative blocks] — "
        "sampled CLEAN at the walk, and the live findings came from the PAD's "
        "own narrative blocks instead; the FRESH-CLONE round [the sandbox reset "
        "EMPTIED neo-crm/ — the round cloned fresh + rebuilt: bun install 536 "
        "packages, the .env contract with DATABASE_URL=file:../db/custom.db + "
        "a fresh AUTH_SECRET, db:push + db:seed, db census MATCH 15/24/10/23/12 "
        "+ 4 users at the repo-root anchor; NO parent-of-repo db mirror — the "
        "s212/s214 hazard probed clean BEFORE any listener reuse; the PLAYWRIGHT "
        "chromium-1248 gap cured PROACTIVELY (bunx playwright install chromium "
        "BEFORE the e2e leg — the first attempt ran clean, 226/226 in 8.2m); "
        "the scandihaven reference re-cloned at 61711c3]; the baseline gate "
        "GREEN at the exact s216 ship state: lint 0/0 · tsc 0 · 138/2894 unit · "
        "build · smoke 14/14 · e2e 226/226 CLEAN [8.2m] · db census MATCH · "
        "the dev server's DB anchor probed green [login + dashboard API "
        "against the REPO db, leads=24 matching the census] · probe:ref "
        "STABLE at 46bc2d9c; the parity re-verification probed live with "
        "agent-browser 0.41.1 against BOTH apps logged in — THE MOBILE "
        "NAVIGATION BOTH SURFACES WORKING [the reference drawer at 390x844: "
        "the Open-navigation trigger 36px, the dialog CRM + Close + the "
        "Navigate-between-your-CRM-pages paragraph + the 8 destinations, the "
        "body-only lock, the Leads ride with auto-close + release, Escape + "
        "release; OURS the same battery PLUS the documented supersets: the "
        "body+main DUAL lock released to visible/auto on every close path, "
        "the resize-past-md auto-close verified live at 769px with the "
        "trigger display:none] + the landing disclosure menu on BOTH apps "
        "[ours the aria-expanded superset verified true->false->true with "
        "the panel unmounting; the reference's toggle carries NO "
        "aria-expanded — null; the 6-link panel on both] + Tailwind v4 "
        "state CLEAN + SEO/sitemap live-verified [the 11-route sitemap 200 "
        "application/xml · robots 200 with the Sitemap line · manifest 200 "
        "application/json · the OG/Twitter/canonical/description head tags "
        "· the security headers on every path]): the round's material the "
        "PAD NARRATIVE-BLOCK STALE TRIO — F-217a THE 7.3 STALE DRAWER-COUNT "
        "+ ITS OWN STALE PIN [the doctrine line said all 10 regression "
        "checks; the live spec carries 11 since the s196 walk50 freeze — "
        "and the s167 F-167i pin's own LITERAL asserted the stale 10, a "
        "PINNED-STALE face: every gate GREEN while the doc face lied] · "
        "F-217b THE 8.1 PRE-s174 BUILD-GATE SENTENCE [TypeScript/ESLint "
        "build blocking is intentionally off — stale since session-174 "
        "retired ignoreBuildErrors; the PAD contradicted its OWN 7.4 "
        "checklist two sections later for 43 sessions] · F-217c THE 2 "
        "DIAGRAM BOUNDARY [Mobile browser <1024px — the pre-s8 era; the "
        "live drawer covers <768px, the ranges now partition cleanly] + "
        "the header-date straggler [2026-10-23, five inventory-row rounds "
        "stale]: D-217a1 THE FOUR-SITE PAD FLIP [the 7.3 count -> 11 · "
        "the 8.1 sentence -> the s174 form · the diagram -> the 768 "
        "partition · the header -> 2026-11-05] + D-217b1 THE F-167i PIN "
        "RE-ANCHOR [docs-counts.test.ts: the literal all 10 becomes the "
        "live-constant form all ${MOBILE_NAV_E2E} regression checks — the "
        "L-165c1 root cure applied to the pin family's own member: the "
        "day the constant re-anchors, the face must follow or the gate "
        "trips; the retired 10 joins the negatives] + D-217a2 THE PAD "
        "NARRATIVE-BLOCK SEMANTIC CENSUS PIN [tests/facts-census.test.ts "
        "— three its after the battery's own catch: it-1 the 8.1 "
        "BUILD-GATE correction [the stale sentence ban + the corrected "
        "clauses + the INTERNAL-CONSISTENCY arm: the s174 doctrine "
        "clause rides in BOTH 7.4 and 8.1 — the self-contradiction "
        "banned + the AGENTS build-gate claim joins the pin (the doc "
        "face that rode on nothing) + the type-gate existence arm] · "
        "it-2 the 2 DIAGRAM boundary correction [the <1024px ban scoped "
        "to the Client Layer block + the 768 partition + the "
        "autoCloseQuery live co-face] · it-3 the HEADER-DATE live-tense "
        "[2026-11-05 + the 2026-10-23 ban]; BORN-RED AT THE DOC ARM — "
        "exactly 4 RED at the stale tree [it-1 + it-2 + it-3 + the "
        "re-anchored F-167i] -> the four-site flip -> GREEN; the "
        "mutation battery caught ONE birth defect in the pin itself: "
        "the first draft's FOURTH it — the SPEC-COUNT live census — "
        "tripped SIX pins at once [M1: the arm already belongs to "
        "docs-counts:1916, the s147 root-cause cure, plus five "
        "line-census/Appendix-B/§9 sites]; cured by REMOVING the "
        "redundant it (the one-owner doctrine enforced by the battery "
        "itself); MUTATION-PROVEN x8 [M1 the ghost 12th test planted "
        "-> 6 RED, the birth-defect catch -> the it removed · M2 the "
        "PAD 7.3 re-staled to all 10 -> exactly 1 RED at the "
        "re-anchored F-167i · M3 the PAD 8.1 re-staled -> exactly 1 "
        "RED · M4 the AGENTS build-gate claim edited -> exactly 1 RED "
        "· M5 the diagram re-staled to <1024px -> exactly 1 RED · M6 "
        "the autoCloseQuery flipped src-side -> 2 RED, the DOCUMENTED "
        "co-pinned face [the census it-2 + page-layout:535 — both pins "
        "correctly own the live face] · M7 the header date re-staled "
        "-> exactly 1 RED · M8 the 7.4 checklist s174 clause removed "
        "-> exactly 1 RED at the internal-consistency arm — each "
        "restored -> GREEN]; STASH-PROOF [the describe stashed -> "
        "exactly 138/2894, the s216 ship state, zero collateral -> "
        "restored -> 138/2897]: THE COUNT LADDER UNIT 2894 -> 2897 "
        "(+3) · SUITES 138 HELD · E2E 226 HELD · badge 3120 -> 3123 "
        "(the unit+e2e arithmetic: 2897+226 — verified against the "
        "live unit run: 138/2897 GREEN) + the docs lockstep (the "
        "AGENTS Session-217 section · the PAD §7.1 s217 inventory row "
        "· docs/session_458.md [the 457 slot holds the s216 close's "
        "working log — this round's pair shifts one] · the plan's "
        "execution record + the worklog entry [Task ID 217] + the "
        "docs-counts layer-axis pair re-anchored [first = s217 · "
        "second = s216 at its ship 2894/226]) + the captures 742-746 "
        "(the round's dev-server set) + beneath it 2894 unit checks + "
        "226 e2e checks green; the session-216 layer (THE INK-BULLET "
        "SEMANTIC-PROSE CENSUS — the architecture-facts ink/SQLite/"
        "store bullets join the pin, and the fresh-eyes walk finds the "
        "family's own stale #111827 sentence; the count ladder 2886 -> "
        "2894 + the docs lockstep + the captures 737-741))"
    )

    # 4) the surgery: the demoted block + the new live layer replace the
    #    live s216 line
    text = text.replace(live_line, demoted_block + S217_LAYER, 1)

    # 5) the frontmatter version bump + the H1 lockstep + last_updated
    #    (the same-day form)
    v_old = "version: 1.213.0"
    v_new = "version: 1.214.0"
    assert text.count(v_old) == 1, "the frontmatter version must be unique"
    text = text.replace(v_old, v_new, 1)
    h1_old = "# NEO CRM — Engineering Skill (SKILL.md v1.213.0)"
    h1_new = "# NEO CRM — Engineering Skill (SKILL.md v1.214.0)"
    assert text.count(h1_old) == 1, "the H1 version lockstep site must be unique"
    text = text.replace(h1_old, h1_new, 1)
    d_old = "last_updated: 2026-11-05"
    d_new = "last_updated: 2026-11-05"
    assert text.count(d_old) == 1, "the last_updated site must be unique"
    text = text.replace(d_old, d_new, 1)

    SKILL.write_text(text, encoding="utf8")
    print("  flip  [SKILL head] the s217 layer live at 2897/226 (the s216 layer demoted at its ship 2894/226)")
    print("  flip  [SKILL frontmatter] version 1.213.0 -> 1.214.0 (last_updated stays 2026-11-05 — the same-day form)")

print("skill-head-217.py done")
