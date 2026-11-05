#!/usr/bin/env python3
"""skill-head-216.py — the SKILL frontmatter head surgery (the s216 layer).

The arithmetic: the s216 layer ships at 2894/226 (the F-216a
ink/sqlite/store-bullet semantic census — +8 its: the AGENTS
"Architecture facts" section's three remaining bullet families join
the pin in tests/facts-census.test.ts [the foreground correction +
the ink family + the select-trigger stock claims + the SQLite-path
doc face + the API envelope + the one-store claims + the lint-rule
claim + the three patterns]; E2E 226 HELD · SUITES 138 HELD · badge
3112 -> 3120).

The L-169c3 form (the 204-215 template): the verified-single guard.
The demoted s215 layer keeps its SHIP-TIME counts (2886/226) in its
own comment block (the s171-fix precedent). Idempotent: a re-run is a
verified no-op. Also bumps the frontmatter version (1.212.0 ->
1.213.0) + the H1 lockstep (the s197 exact-H1 guard form);
last_updated stays 2026-11-05 (the same-day form).
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S216_MARKER = "project_state: 2894 unit checks + 226 e2e checks green; the session-216 layer ("

if S216_MARKER in text:
    print("  no-op  [SKILL head] the s216 layer already live")
else:
    LIVE_MARKER = "project_state: 2886 unit checks + 226 e2e checks green; the session-215 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s215 head marker found {live_count} times"

    # 1) extract the live s215 line — its ship count IS 2886/226 (the
    #    held-count form), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s215 layer keeps its ship counts
    #    (2886/226) in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-215 layer (comment-demoted at session-216 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198/\n"
        "     s199/s200/s201/s202/s203/s204/s205/s206/s207/s208/s209/s210/s211/\n"
        "     s212/s213/s214 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s216 live layer — the ink/sqlite/store-bullet semantic
    #    census (2894/226)
    S216_LAYER = (
        "project_state: 2894 unit checks + 226 e2e checks green; the session-216 layer "
        "(THE INK-BULLET SEMANTIC-PROSE CENSUS — the s215 close's named "
        "candidate: the architecture-facts section's REMAINING bullet families "
        "[the stock-primitive-inks bullet · the SQLite-path bullet's doc face · "
        "the store/effects bullets] — PLUS the fresh-eyes walk's own live "
        "finding INSIDE the named family; the CARRY-OVER-WORKSPACE round [the "
        "first since s209: the sandbox KEPT the tree — git pull "
        "fast-forwarded d38f6a2..41e1873, the owner's newest commit adding "
        "docs/session_454.md only; the recent-changes audit ZERO src/tests/"
        "scripts/config changes since the s215 ship; the standing environment "
        "held: the .env contract + db/ at the repo root + chromium-1248 + NO "
        "parent-of-repo db mirror]; the baseline gate GREEN at the exact s215 "
        "ship state: lint 0/0 · tsc 0 · 138/2886 unit · build · smoke 14/14 · "
        "e2e 226/226 CLEAN [8.1m] · db census MATCH · the dev server's DB "
        "anchor re-probed green · probe:ref STABLE at 46bc2d9c; the parity "
        "re-verification probed live with agent-browser 0.41.1 against BOTH "
        "apps logged in — THE MOBILE NAVIGATION BOTH SURFACES WORKING [the "
        "reference drawer at 390x844: the trigger + the dialog + the 8 "
        "destinations + the body-only lock + the Leads ride + Escape; OURS "
        "the same battery PLUS the supersets: the dual lock + the "
        "resize-past-md auto-close verified live at 769px] + the landing "
        "disclosure menu on BOTH apps [ours the aria-expanded superset; the "
        "reference's toggle carries NO aria-expanded] + Tailwind v4 state "
        "CLEAN + SEO/sitemap live-verified + the hygiene legs clean + the "
        "set-state-in-effect ERROR claim VERIFIED EMPIRICALLY [a scratch "
        "probe tripped react-hooks/set-state-in-effect as an ERROR through "
        "the eslint-config-next chain, exit 1]): the round's material F-216a "
        "— THE INK-BULLET STALE-PROSE DEFECT (the first live doc-face "
        "defect since s208: the stock-primitive-inks family's sentence "
        "claiming page-level text KEEPS the old #111827 foreground value STALE since "
        "the s13 S13-P9 flip [b2da6bd — the live token is #0a0a0a, the "
        "reference's body default; only its page h1s are EXPLICIT gray-900 "
        "#111827], surviving at THREE claim sites [the AGENTS bullet :157 · "
        "the globals.css comment :105 · the SKILL §4.1 prose :1433, the "
        "latter additionally carrying the stale TWO-BLACKS doctrine — the "
        "token pair CONVERGED at s13]; the s13 round added its new contract "
        "block but missed the old claim site; the s169 wave re-pinned the "
        "token TABLES but never the prose sentences; every unit gate GREEN "
        "while the doc face lied): D-216a1 THE THREE-SENTENCE FLIP [AGENTS "
        "+ the globals comment + the SKILL §4.1 — the s13 flip narrated in "
        "its live form, the two-blacks doctrine reframed to the convergence "
        "truth] + D-216a2 THE INK/SQLITE/STORE-BULLET SEMANTIC CENSUS PIN "
        "[tests/facts-census.test.ts — eight its: it-1 the FOREGROUND "
        "CORRECTION [the stale-form ban x3 sites + the corrected sentences "
        "+ the live token + the PAGE_HEADER h1 arm] · it-2 the INK/MUTED-INK "
        "family [the doc claims + the SKILL convergence form + INPUT_BASE "
        "bg/ink/placeholder] · it-3 the SELECT-TRIGGER stock claims "
        "[rounded-md · no gap-2 · transparent · NO base w-full · "
        "SEARCH_INPUT.extras] · it-4 the SQLITE-PATH doc face [the schema "
        "rule + the re-anchor + the mkdir-p + the prisma-env wrapper + the "
        "one-constructor src/ census] · it-5 the API-ENVELOPE claims "
        "[ok()/fail()/ERR.* + the call() helper] · it-6 the ONE-STORE "
        "claims [the deps census · the stores file census · hydrate-once] "
        "· it-7 the LINT-RULE claim [the eslint chain carrier + the "
        "never-disabled census] · it-8 the THREE PATTERNS [key={epoch} · "
        "the adjust-during-render conditional · the yield]; BORN-RED AT "
        "THE DOC ARM — the first census round since s208: exactly 2 RED "
        "at the stale tree [it-1 + it-2, the stale sentences] -> the cure "
        "-> GREEN; the mutation battery then caught ONE birth defect in "
        "the pin itself — the SUBSTRING-WEAK adjust-during-render assert "
        "[toContain survived the if (false && ...) plant; cured with the "
        "full /if \\(prevPathname !== pathname\\)/ conditional form]; "
        "MUTATION-PROVEN x11 [M1 the AGENTS fg sentence re-staled -> "
        "exactly 1 RED · M2 the SKILL fg sentence re-staled -> exactly 1 "
        "RED · M3 the AGENTS ink value edited -> exactly 1 RED · M4 the "
        "AGENTS topbar-search claim edited -> exactly 1 RED · M5 a raw "
        "new PrismaClient planted in src/ -> exactly 1 RED · M6 the "
        "AGENTS envelope edited -> exactly 1 RED · M7 a ghost store file "
        "planted -> exactly 1 RED · M8 set-state-in-effect disabled in "
        "eslint.config.mjs -> exactly 1 RED · M9 the epoch-key remounts "
        "flipped -> 2 RED, the DOCUMENTED co-pinned face [it-8 + the s71 "
        "dialog-mount-contract — both pins correctly trip the same face] "
        "· M10 the reports-page yield removed -> exactly 1 RED · M11 the "
        "adjust-during-render guard neutered -> exactly 1 RED at the "
        "cured pin — each restored -> GREEN]; STASH-PROOF [the describe "
        "stashed -> exactly 138/2886, the s215 ship state, zero "
        "collateral -> restored -> 138/2894]: THE COUNT LADDER UNIT 2886 "
        "-> 2894 (+8) · SUITES 138 HELD · E2E 226 HELD · badge 3112 -> "
        "3120 (the unit+e2e arithmetic: 2894+226 — verified against the "
        "live unit run: 138/2894 GREEN) + THE LINE-CENSUS COLLATERAL "
        "RE-ANCHOR [the cure's globals.css comment grew the file 482 -> "
        "483 — the PAD §11 row + the SKILL §4.1 line-count re-anchored, "
        "the s211 same-stroke doctrine] + the docs lockstep (the AGENTS "
        "Session-216 section · the PAD §7.1 s216 inventory row · "
        "docs/session_455.md [the 454 slot holds the s215 close's "
        "working log — this round's pair shifts one] · the plan's "
        "execution record + the worklog entry [Task ID 216] + the "
        "docs-counts layer-axis pair re-anchored [first = s216 · second "
        "= s215 at its ship 2886/226]) + the captures 737-741 (the "
        "round's dev-server set) + beneath it 2886 unit checks + 226 e2e "
        "checks green; the session-215 layer (THE TAILWIND-BULLET "
        "SEMANTIC-PROSE CENSUS — the architecture-facts Tailwind-v4 "
        "bullet joins the pin, and the mutation battery catches the pin's "
        "own boundary-blind and comment-blind teeth; the count ladder "
        "2878 -> 2886 + the docs lockstep + the captures 732-736))"
    )

    # 4) the surgery: the demoted block + the new live layer replace the
    #    live s215 line
    text = text.replace(live_line, demoted_block + S216_LAYER, 1)

    # 5) the frontmatter version bump + the H1 lockstep + last_updated
    #    (the same-day form)
    v_old = "version: 1.212.0"
    v_new = "version: 1.213.0"
    assert text.count(v_old) == 1, "the frontmatter version must be unique"
    text = text.replace(v_old, v_new, 1)
    h1_old = "# NEO CRM — Engineering Skill (SKILL.md v1.212.0)"
    h1_new = "# NEO CRM — Engineering Skill (SKILL.md v1.213.0)"
    assert text.count(h1_old) == 1, "the H1 version lockstep site must be unique"
    text = text.replace(h1_old, h1_new, 1)
    d_old = "last_updated: 2026-11-05"
    d_new = "last_updated: 2026-11-05"
    assert text.count(d_old) == 1, "the last_updated site must be unique"
    text = text.replace(d_old, d_new, 1)

    SKILL.write_text(text, encoding="utf8")
    print("  flip  [SKILL head] the s216 layer live at 2894/226 (the s215 layer demoted at its ship 2886/226)")
    print("  flip  [SKILL frontmatter] version 1.212.0 -> 1.213.0 (last_updated stays 2026-11-05 — the same-day form)")

print("skill-head-216.py done")
