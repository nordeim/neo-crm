#!/usr/bin/env python3
"""skill-head-215.py — the SKILL frontmatter head surgery (the s215 layer).

The arithmetic: the s215 layer ships at 2886/226 (the F-215a
tailwind-bullet semantic census — +8 its: the AGENTS "Architecture
facts" Tailwind-v4 bullet joins the pin in tests/facts-census.test.ts
[the CSS-first census + the postcss guard + the shadow/blur re-pins +
the space-y flip family + the outline-none doctrine + the cursor rule +
the tw-animate vendoring]; E2E 226 HELD · SUITES 138 HELD · badge
3104 -> 3112).

The L-169c3 form (the 204-214 template): the verified-single guard.
The demoted s214 layer keeps its SHIP-TIME counts (2878/226) in its
own comment block (the s171-fix precedent). Idempotent: a re-run is a
verified no-op. Also bumps the frontmatter version (1.211.0 ->
1.212.0) + the H1 lockstep (the s197 exact-H1 guard form);
last_updated flips 2026-11-04 -> 2026-11-05 (the next-day form).
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S215_MARKER = "project_state: 2886 unit checks + 226 e2e checks green; the session-215 layer ("

if S215_MARKER in text:
    print("  no-op  [SKILL head] the s215 layer already live")
else:
    LIVE_MARKER = "project_state: 2878 unit checks + 226 e2e checks green; the session-214 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s214 head marker found {live_count} times"

    # 1) extract the live s214 line — its ship count IS 2878/226 (the
    #    held-count form), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s214 layer keeps its ship counts
    #    (2878/226) in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-214 layer (comment-demoted at session-215 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198/\n"
        "     s199/s200/s201/s202/s203/s204/s205/s206/s207/s208/s209/s210/s211/\n"
        "     s212/s213 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s215 live layer — the tailwind-bullet semantic census
    #    (2886/226)
    S215_LAYER = (
        "project_state: 2886 unit checks + 226 e2e checks green; the session-215 layer "
        "(THE TAILWIND-BULLET SEMANTIC-PROSE CENSUS — the s214 close's named "
        "candidate: the AGENTS \"Architecture facts you would otherwise guess "
        "wrong\" section's SECOND bullet, the Tailwind-v4 bullet — the family's "
        "own hazard register, the section's longest mechanically-checkable "
        "prose surface — joins the pin; the FRESH-CLONE round [the sandbox "
        "reset EMPTIED neo-crm/ again — the round cloned fresh + rebuilt: bun "
        "install 536 packages, the .env contract with DATABASE_URL="
        "file:../db/custom.db + a fresh AUTH_SECRET, db:push + db:seed, db "
        "census MATCH 15/24/10/23/12 + 4 users at the repo-root anchor; NO "
        "parent-of-repo db mirror this round — the s212/s214 hazard probed "
        "clean BEFORE any listener reuse; the PLAYWRIGHT chromium-1248 gap "
        "cured PROACTIVELY (bunx playwright install chromium BEFORE the e2e "
        "leg — the first attempt ran clean, 226/226 in 7.9m); the scandihaven "
        "reference re-cloned at 61711c3]; the baseline gate GREEN at the exact "
        "s214 ship state: lint 0/0 · tsc 0 · 138/2878 unit · build · smoke "
        "14/14 · e2e 226/226 CLEAN · probe:ref STABLE at 46bc2d9c; the parity "
        "re-verification probed live with agent-browser 0.41.1 against BOTH "
        "apps logged in — THE MOBILE NAVIGATION BOTH SURFACES WORKING [the "
        "reference drawer at 390x844: the Open-navigation trigger, the dialog "
        "+ Close + the 8 destinations, the body-only lock, the Leads ride "
        "with auto-close, Escape + release; OURS the same battery PLUS the "
        "documented supersets: the body+main DUAL lock released on every "
        "close path, the resize-past-md auto-close verified live at 769px] + "
        "the landing disclosure menu on BOTH apps [ours the aria-expanded "
        "superset] + Tailwind v4 state CLEAN + SEO/sitemap live-verified [the "
        "11-route sitemap 200 application/xml · robots 200 with the Sitemap "
        "line · manifest 200 application/json · OG/Twitter/canonical · the "
        "three security headers] + the test-suite configs verified sound and "
        "green [the operator's add-vitest+playwright instruction satisfied "
        "by verification — no modification warranted, the smallest-safe-edit "
        "doctrine]): the round's material F-215a — THE TAILWIND-BULLET "
        "SEMANTIC-PROSE RESIDUE (the fresh-eyes walk found ZERO live "
        "defects — every prose sample verified live: the CSS-first form · "
        "the postcss plugin · the shadow/blur re-pins · the space-y flip's "
        "login + settings faces · the outline-none fingerprint · the cursor "
        "rule · the vendored tw-animate): D-215a1 THE TAILWIND-BULLET "
        "SEMANTIC CENSUS PIN [tests/facts-census.test.ts — eight its: it-1 "
        "the CSS-FIRST claim [literal hex @theme · NO var( chains inside the "
        "block · the no-tailwind.config tree census at the root + src/] · "
        "it-2 the POSTCSS claim [the plugins array EXACTLY "
        "[\"@tailwindcss/postcss\"] — the unstyled-page bug's own guard, NO "
        "test ever read postcss.config.mjs before this pin] · it-3 the "
        "SHADOW re-pin [--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05) inside "
        "@theme · the NOT-overridden arm: no bare --shadow: token] · it-4 "
        "the BLUR re-pin [--blur-sm: 4px] · it-5 the SPACE-Y FLIP family "
        "[the computed-gap re-derivation doctrine · SETTINGS_DEFAULTS + "
        "SETTINGS_DANGER controlMt === mt-2 · the login-reset Back ladder "
        "mb-2 sm:mb-4, read LIVE via the login-reset seam] · it-6 the "
        "OUTLINE-NONE doctrine [style:none fingerprint · INPUT_BASE."
        "focusRing carries outline-none + ring-1 + ring-ring] · it-7 the "
        "CURSOR rule [the comment-stripped base-layer regex] · it-8 the "
        "TW-ANIMATE VENDORING [its OWN bullet slice — the third of the "
        "family's section run — the vendored file + the local import + the "
        "ZERO npm-import census]; BORN-GREEN at the first run (70/70 at the "
        "file) then the mutation battery caught TWO birth defects in the "
        "pin itself and both were cured in-round: the BOUNDARY-BLIND slice "
        "[the end marker **Stock-primitive inks** never matched — the slice "
        "ran to EOF and the doc face went vacuous; cured with the exact form "
        "**Stock-primitive inks (session-10)** + the end>start guard] and "
        "the COMMENT-BLIND cursor match [the explanatory comment above the "
        "rule carries the rule's own literal text — an unstripped match "
        "stays green when the RULE is deleted; cured with the noComments "
        "face]; MUTATION-PROVEN x9 [M1 a tailwind.config.js planted at the "
        "root -> exactly 1 RED at it-1 · M2 the postcss plugin swapped to "
        "[\"tailwindcss\"] -> exactly 1 RED at it-2 · M3 the AGENTS shadow "
        "value edited doc-side -> exactly 1 RED at it-3 · M4 the globals "
        "--blur-sm flipped to 8px -> exactly 1 RED at it-4 · M5 the "
        "controlMt flipped to mt-4 -> exactly 1 RED at it-5 · M6 the AGENTS "
        "outline-none clause removed (whitespace-flexible) -> exactly 1 RED "
        "at it-6 · M7 the cursor rule removed SURGICALLY (the raw file "
        "matches the rule-form twice — the comment's literal text + the "
        "rule — the rule is the LAST raw match) -> exactly 1 RED at it-7 · "
        "M8 the vendor import switched to the npm form -> exactly 1 RED at "
        "it-8 · M9 the bullet boundary rot -> the suite-level throw, exit 1 "
        "— each restored -> GREEN]; STASH-PROOF [the describe stashed -> "
        "exactly 138/2878, the s214 ship state, zero collateral -> "
        "restored -> 138/2886]: THE COUNT LADDER UNIT 2878 -> 2886 (+8) · "
        "SUITES 138 HELD · E2E 226 HELD · badge 3104 -> 3112 (the "
        "unit+e2e arithmetic: 2886+226 — verified against the live unit "
        "run: 138/2886 GREEN) + the docs lockstep (the AGENTS Session-215 "
        "section · the PAD §7.1 s215 inventory row · docs/session_452.md · "
        "the plan's execution record + the worklog entry [Task ID 215] + "
        "the docs-counts layer-axis pair re-anchored [first = s215 · "
        "second = s214 at its ship 2878/226]) + the captures 732-736 (the "
        "round's dev-server set) + beneath it 2878 unit checks + 226 e2e "
        "checks green; the session-214 layer (THE AUTH-BULLET SEMANTIC-PROSE "
        "CENSUS — the architecture-facts auth bullet joins the pin, and the "
        "fresh-clone round re-proves the s212 DB-anchor lesson; the count "
        "ladder 2873 -> 2878 + the docs lockstep + the captures 727-731))"
    )

    # 4) the surgery: the demoted block + the new live layer replace the
    #    live s214 line
    text = text.replace(live_line, demoted_block + S215_LAYER, 1)

    # 5) the frontmatter version bump + the H1 lockstep + last_updated
    #    (the next-day form)
    v_old = "version: 1.211.0"
    v_new = "version: 1.212.0"
    assert text.count(v_old) == 1, "the frontmatter version must be unique"
    text = text.replace(v_old, v_new, 1)
    h1_old = "# NEO CRM — Engineering Skill (SKILL.md v1.211.0)"
    h1_new = "# NEO CRM — Engineering Skill (SKILL.md v1.212.0)"
    assert text.count(h1_old) == 1, "the H1 version lockstep site must be unique"
    text = text.replace(h1_old, h1_new, 1)
    d_old = "last_updated: 2026-11-04"
    d_new = "last_updated: 2026-11-05"
    assert text.count(d_old) == 1, "the last_updated site must be unique"
    text = text.replace(d_old, d_new, 1)

    SKILL.write_text(text, encoding="utf8")
    print("  flip  [SKILL head] the s215 layer live at 2886/226 (the s214 layer demoted at its ship 2878/226)")
    print("  flip  [SKILL frontmatter] version 1.211.0 -> 1.212.0 (last_updated 2026-11-04 -> 2026-11-05)")

print("skill-head-215.py done")
