#!/usr/bin/env python3
"""skill-head-209.py — the SKILL frontmatter head surgery (the s209 layer).

The arithmetic: the s209 layer ships at 2858/226 (+2 — the two
D-209a2 push-ritual remote-contract its in tests/facts-census.test.ts).

The L-169c3 form (the 204-208 template): the verified-single guard.
The demoted s208 layer keeps its SHIP-TIME counts (2856/226) in its own
comment block (the s171-fix precedent). Idempotent: a re-run is a
verified no-op. Also bumps the frontmatter version (1.205.0 ->
1.206.0) + the H1 lockstep (the s197 exact-H1 guard form). The
last_updated stays 2026-11-02 (the same-day form — the s208 round
already flipped the calendar day this morning; the flip is
version-only).

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live
s208 line still carries its ship count (2856/226), so the demotion is
a verbatim move, and the count-ladder-209.py run that follows flips
only the OTHER doc sites. The retired blocks stay UNTOUCHED.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S209_MARKER = "project_state: 2858 unit checks + 226 e2e checks green; the session-209 layer ("

if S209_MARKER in text:
    print("  no-op  [SKILL head] the s209 layer already live")
else:
    LIVE_MARKER = "project_state: 2856 unit checks + 226 e2e checks green; the session-208 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s208 head marker found {live_count} times"

    # 1) extract the live s208 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s208 layer keeps its ship counts
    #    (2856/226) in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-208 layer (comment-demoted at session-209 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198/\n"
        "     s199/s200/s201/s202/s203/s204/s205/s206/s207 layers sit demoted\n"
        "     above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s209 live layer — the push-ritual remote contract
    S209_LAYER = (
        "project_state: 2858 unit checks + 226 e2e checks green; the session-209 layer "
        "(THE PUSH-RITUAL REMOTE CONTRACT — the fresh-eyes walk's catch: the operational "
        "push-ritual pair [docs/ssh_git_wrapper_v3.py + docs/how-to-git-push-using-ssh-wrapper_SKILL.md] "
        "carried the SIBLING REPO's remote [task-management] verbatim from the initial "
        "scaffold — the wrapper's DEFAULT_REMOTE + its docstring + its Options default, "
        "and the runbook's purpose · cd · expected-output · variants · troubleshooting · "
        "and the factually WRONG AGENTS-corroboration claim [the live AGENTS.md:7 says "
        "neo-crm]; the runbook's PRIMARY sequence invokes the wrapper with NO --remote — "
        "it rode the stale default, every round pushing safely only because AGENTS's git "
        "island + the operator's briefs carry the explicit neo-crm remote [the "
        "F-206a/F-207b correct-and-lucky genus]; the D-208a2 totality census never scoped "
        "this family [the six core docs + .env.example only]; the post-208 audit round "
        "[the rotation trigger THE OWNER'S NEWEST COMMIT 399bda3: the session_439 "
        "transcript — the s208 round's own execution record]; the baseline gate GREEN at "
        "the exact s208 ship state: lint 0/0 · tsc 0 · 138/2856 unit · build (the 2 "
        "warnings the pre-existing Turbopack tracing heuristics) · smoke 14/14 · e2e "
        "226/226 CLEAN FIRST RUN (8.0m) · db census MATCH (15/24/10/23/12 + 4 users at "
        "<repo>/db/custom.db — the operator's standing .env contract, "
        "DATABASE_URL=file:../db/custom.db with db/ at the repo root): THE SIX DRIFT "
        "GATES ALL CLEAN — the four-band sweep at --fail-on-drift (desktop 1280 · phone "
        "390x844 · tablet 768x1024 · landscape 1024x768) + the fullpage sweep CLEAN "
        "(desktop 0.093% / phone 0.316%) + the interior census CLEAN + probe:ref STABLE "
        "at 46bc2d9c (the demo data still ZERO); THE PARITY RE-VERIFICATION probed live "
        "with agent-browser against BOTH apps logged in — THE MOBILE NAVIGATION BOTH "
        "SURFACES WORKING [the drawer: the Close button + the CRM h2 + the 8 "
        "destinations, the overlay rgba(0,0,0,0.8) vs our oklab(0 0 0 / 0.8), the "
        "dual-lock superset, Escape, the link ride /Dashboard -> /Leads + auto-close + "
        "full release; the landing disclosure menu: the 6 links, aria-expanded the "
        "accessible superset, the FAQ ride -> /#faq] + the VLM drawer-pair comparison "
        "IDENTICAL [the sole note the Base44 badge] + Tailwind v4 clean + SEO/sitemap "
        "live-verified + the hygiene legs clean [bun audit at the pinned census 10]: "
        "D-209a1 THE REMOTE-CONTRACT FLIPS [every stale site flipped to the repo's own "
        "canonical remote — the wrapper's DEFAULT_REMOTE + docstring + Options default · "
        "the runbook's 9 sites; the historical field-test note keeps its ship-time "
        "narration — it names no repo] · D-209a2 THE PUSH-RITUAL REMOTE CONTRACT PIN "
        "[the genus closes: it-1 the wrapper arm — the canonical remote read LIVE from "
        "AGENTS.md's own head claim (the SSH transform) asserted equal to the wrapper's "
        "DEFAULT_REMOTE + the freeze anchor + the wrapper's own doc faces + the AGENTS "
        "git-island invocation's explicit --remote (the cross-doc arm) + the stale-form "
        "ban; it-2 the runbook arm — the canonical SSH remote at the claim sites (the "
        "purpose · the --remote variants · the ls-remote troubleshooting line) + the "
        "AGENTS-corroboration claim quoting the LIVE AGENTS clone remote + the "
        "stale-form ban; RED-first at birth (exactly 2 RED at the stale sites — the "
        "proof the pin catches the finding) then GREEN at the cured tree; one "
        "arm-ownership correction at birth (each arm's ban owns its own file — the "
        "first M1 run caught the 2-RED flaw, cured in place); MUTATION-PROVEN x4: the "
        "wrapper DEFAULT_REMOTE re-planted stale -> exactly 1 RED (it-1) · the runbook "
        "variant re-planted stale -> exactly 1 RED (it-2) · the AGENTS-corroboration "
        "line re-planted stale -> exactly 1 RED (it-2) · the AGENTS git-island "
        "invocation's remote flipped -> exactly 1 RED (it-1, the cross-doc arm) — each "
        "restored -> GREEN; src/ untouched (operational docs + tests only)]; THE COUNT "
        "LADDER UNIT 2856 -> 2858 (+2) · SUITES 138 HELD · E2E 226 HELD · badge 3082 "
        "-> 3084 + the docs lockstep (the AGENTS Session-209 section · "
        "docs/session_440.md · the PAD section-7.1 s209 inventory row · the plan's "
        "execution record + the worklog entry [Task ID 209]) + the captures 702-706 "
        "(the round's dev-server set, VLM-verified) + THE WRAPPER FIELD-VERIFICATION "
        "(this round's own push runs through the CURED wrapper — the default now the "
        "repo's own remote) + beneath it 2856 unit checks + 226 e2e checks green; the "
        "session-208 layer (THE DOC-CLAIM TOTALITY CENSUS — the genus the s206/s207 "
        "closes both named as its own rotation's material, taken — every live claim "
        "family joins the pin; the count ladder 2853 -> 2856 · badge 3079 -> 3082 + the "
        "docs lockstep + the captures 697-701))"
    )

    # 4) the surgery: the demoted block + the new live layer replace the
    #    live s208 line
    text = text.replace(live_line, demoted_block + S209_LAYER, 1)

    # 5) the frontmatter version bump + the H1 lockstep + last_updated
    #    (same-day form: stays 2026-11-02)
    v_old = "version: 1.205.0"
    v_new = "version: 1.206.0"
    assert text.count(v_old) == 1, "the frontmatter version must be unique"
    text = text.replace(v_old, v_new, 1)
    h1_old = "# NEO CRM — Engineering Skill (SKILL.md v1.205.0)"
    h1_new = "# NEO CRM — Engineering Skill (SKILL.md v1.206.0)"
    assert text.count(h1_old) == 1, "the H1 version lockstep site must be unique"
    text = text.replace(h1_old, h1_new, 1)

    SKILL.write_text(text, encoding="utf8")
    print("  flip  [SKILL head] the s209 layer live at 2858/226 (the s208 layer demoted at its ship 2856/226)")
    print("  flip  [SKILL frontmatter] version 1.205.0 -> 1.206.0")

print("skill-head-209.py done")
