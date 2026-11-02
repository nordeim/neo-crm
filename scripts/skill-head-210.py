#!/usr/bin/env python3
"""skill-head-210.py — the SKILL frontmatter head surgery (the s210 layer).

The arithmetic: the s210 layer ships at 2858/226 HELD (the F-210a cure
modifies the existing D-208a2 path arm's logic — zero new its; the
count ladder is unchanged this round, the held-count form).

The L-169c3 form (the 204-209 template): the verified-single guard.
The demoted s209 layer keeps its SHIP-TIME counts (2858/226) in its
own comment block (the s171-fix precedent). Idempotent: a re-run is a
verified no-op. Also bumps the frontmatter version (1.206.0 ->
1.207.0) + the H1 lockstep (the s197 exact-H1 guard form). The
last_updated stays 2026-11-02 (the same-day form — the s208/s209
rounds already flipped the calendar day; the flip is version-only).

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live
s209 line still carries its ship count (2858/226), so the demotion is
a verbatim move. The retired blocks stay UNTOUCHED.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S210_MARKER = "project_state: 2858 unit checks + 226 e2e checks green; the session-210 layer ("

if S210_MARKER in text:
    print("  no-op  [SKILL head] the s210 layer already live")
else:
    LIVE_MARKER = "project_state: 2858 unit checks + 226 e2e checks green; the session-209 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s209 head marker found {live_count} times"

    # 1) extract the live s209 line — its ship count IS the live count
    #    (the ladder has nothing to flip this round), so the demotion
    #    is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s209 layer keeps its ship counts
    #    (2858/226) in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-209 layer (comment-demoted at session-210 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198/\n"
        "     s199/s200/s201/s202/s203/s204/s205/s206/s207/s208 layers sit\n"
        "     demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s210 live layer — the census checkout-portability
    #    contract (the held-count form: 2858/226)
    S210_LAYER = (
        "project_state: 2858 unit checks + 226 e2e checks green; the session-210 layer "
        "(THE CENSUS CHECKOUT-PORTABILITY CONTRACT — the first fresh-clone round's catch: "
        "the workspace was RESET this rotation [the standing brief's own contingency — "
        "git clone; every prior round s204-s209 rode a carried-over workspace], and the "
        "fresh tree turned the D-208a2 doc-claim totality census's path+ADR arm RED "
        "before a single tool had run — 7 live-section path claims name RUNTIME-GENERATED "
        "ARTIFACTS [db/e2e.db x4 · db/smoke.db x1 · tests/e2e/.auth/user.json x2], "
        "git-ignored files the tools themselves create; none resolves on a fresh clone "
        "and their contexts correctly assert USAGE, not absence — the docs are accurate, "
        "each naming its generator; every prior round ran GREEN only because the "
        "carried-over workspace still held the artifacts on disk — the F-206a/F-207b/"
        "F-209a correct-and-lucky genus; the post-209 audit round [the rotation trigger "
        "THE OWNER'S NEWEST COMMIT 7bd4f3d: the session_441 transcript — the s209 "
        "round's own execution record]; the baseline gate ON THE FRESH CLONE after the "
        "standing .env contract re-created [DATABASE_URL=file:../db/custom.db with db/ "
        "at the repo root; db census MATCH 15/24/10/23/12 + 4 users]: lint 0/0 · tsc 0 "
        "· 138/2857 unit [the 1 RED = the round's own live catch] · build (the 2 "
        "warnings the pre-existing Turbopack tracing heuristics) · smoke 14/14 · e2e "
        "226/226 CLEAN (7.9m; one environment-only wrinkle — the fresh sandbox lacked "
        "the Playwright browser binaries, npx playwright install chromium, zero code "
        "involvement) · THE SIX DRIFT GATES CLEAN — the four-band sweep at "
        "--fail-on-drift (desktop 1280 · phone 390x844 · tablet 768x1024 · landscape "
        "1024x768) + the fullpage sweep CLEAN (desktop 0.093% / phone 0.316% — the "
        "exact standing margins, the sweep split into its two --width/--height classes "
        "with the dev server booted in-session) + the interior census CLEAN (byte-parity) "
        "+ probe:ref STABLE at 46bc2d9c (the demo data still ZERO): THE PARITY "
        "RE-VERIFICATION probed live with agent-browser against BOTH apps logged in — "
        "THE MOBILE NAVIGATION BOTH SURFACES WORKING [the drawer: the Close button + "
        "the CRM h2 + the 8 destinations, the overlay rgba(0,0,0,0.8) vs our "
        "oklab(0 0 0 / 0.8), the dual-lock superset, Escape, the link ride /Dashboard "
        "-> /Leads + auto-close + full release; the landing disclosure menu: the 6 "
        "links, aria-expanded the accessible superset, the FAQ ride -> /#faq] + THE "
        "VLM DRAWER-PAIR COMPARISON re-captured this round: IDENTICAL + Tailwind v4 "
        "clean + SEO/sitemap live-verified + the hygiene legs clean [bun audit at the "
        "pinned census 10]: D-210a1 THE GENERATED-ARTIFACT CONTRACT [the census's path "
        "arm learns the runtime-artifact form — an explicit frozen artifact->generator "
        "map: db/e2e.db -> tests/e2e/global-setup.ts · db/smoke.db -> "
        "scripts/smoke-test.sh · tests/e2e/.auth/user.json -> playwright.config.ts; "
        "each generator asserted to resolve (a deleted generator -> the named RED — "
        "the census pins the generator contract the docs claim) + the self-cleaning "
        "bidirectionality (every map entry must still be claimed in a live section — "
        "a retired claim leaves a dead entry -> the named RED, the map can never rot) "
        "+ a path NOT in the map still needs the tree or the NEGATIVE context — the "
        "carve-out does not gut the census; THE PORTABILITY PROOF: the three artifacts "
        "moved away (the fresh-checkout state reconstructed on demand) -> the full "
        "facts-census file 51/51 GREEN -> restored -> GREEN again; MUTATION-PROVEN x3: "
        "M1 the un-mapped db/fake.db claim planted in AGENTS's live E2E block -> "
        "exactly 1 RED at the path-claim assert · M2 the map's db/e2e.db entry pointed "
        "at a nonexistent generator -> 1 RED at the up-front generator assertion · M3 "
        "the PAD's db/smoke.db claim retired -> 1 RED at the self-cleaning-map "
        "assertion — each restored -> GREEN; src/ untouched (test-side only — the "
        "baseline-inert construction)]: THE COUNT LADDER HELD — UNIT 2858 · SUITES "
        "138 · E2E 226 · badge 3084 (the cure modifies the existing arm's logic, zero "
        "its; verified against the live unit run: 138/2858 GREEN) + the docs lockstep "
        "(the AGENTS Session-210 section · docs/session_442.md · the PAD section-7.1 "
        "s210 inventory row · the plan's execution record + the worklog entry [Task ID "
        "210] + the docs-counts layer-axis pair re-anchored [first = s210 · second = "
        "s209 at its ship 2858/226]) + the captures 707-711 (the round's dev-server "
        "set) + beneath it 2858 unit checks + 226 e2e checks green; the session-209 "
        "layer (THE PUSH-RITUAL REMOTE CONTRACT — the fresh-eyes walk's catch: the "
        "operational push-ritual pair carried the SIBLING REPO's remote from the "
        "initial scaffold; D-209a1 the remote-contract flips + D-209a2 the pin, "
        "mutation-proven x4; the count ladder 2856 -> 2858 · badge 3082 -> 3084 + the "
        "docs lockstep + the captures 702-706))"
    )

    # 4) the surgery: the demoted block + the new live layer replace the
    #    live s209 line
    text = text.replace(live_line, demoted_block + S210_LAYER, 1)

    # 5) the frontmatter version bump + the H1 lockstep + last_updated
    #    (same-day form: stays 2026-11-02)
    v_old = "version: 1.206.0"
    v_new = "version: 1.207.0"
    assert text.count(v_old) == 1, "the frontmatter version must be unique"
    text = text.replace(v_old, v_new, 1)
    h1_old = "# NEO CRM — Engineering Skill (SKILL.md v1.206.0)"
    h1_new = "# NEO CRM — Engineering Skill (SKILL.md v1.207.0)"
    assert text.count(h1_old) == 1, "the H1 version lockstep site must be unique"
    text = text.replace(h1_old, h1_new, 1)

    SKILL.write_text(text, encoding="utf8")
    print("  flip  [SKILL head] the s210 layer live at 2858/226 (the s209 layer demoted at its ship 2858/226)")
    print("  flip  [SKILL frontmatter] version 1.206.0 -> 1.207.0")

print("skill-head-210.py done")
