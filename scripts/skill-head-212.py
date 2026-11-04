#!/usr/bin/env python3
"""skill-head-212.py — the SKILL frontmatter head surgery (the s212 layer).

The arithmetic: the s212 layer ships at 2867/226 (the F-212a standalone
bun-launch DB re-anchor — +4 its: the session-170-artifact-shape pins
in tests/db-path.test.ts [the RED-first re-anchor + the e2e-style
override guard + the absolute override guard + the no-junk property];
E2E 226 HELD · SUITES 138 HELD · badge 3089 -> 3093).

The L-169c3 form (the 204-211 template): the verified-single guard.
The demoted s211 layer keeps its SHIP-TIME counts (2863/226) in its
own comment block (the s171-fix precedent). Idempotent: a re-run is a
verified no-op. Also bumps the frontmatter version (1.208.0 ->
1.209.0) + the H1 lockstep (the s197 exact-H1 guard form) +
last_updated 2026-11-03 -> 2026-11-04.

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live
s211 line still carries its ship count (2863/226), so the demotion is
a verbatim move. The retired blocks stay UNTOUCHED.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S212_MARKER = "project_state: 2867 unit checks + 226 e2e checks green; the session-212 layer ("

if S212_MARKER in text:
    print("  no-op  [SKILL head] the s212 layer already live")
else:
    LIVE_MARKER = "project_state: 2863 unit checks + 226 e2e checks green; the session-211 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s211 head marker found {live_count} times"

    # 1) extract the live s211 line — its ship count IS 2863/226 (the
    #    held-count form), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s211 layer keeps its ship counts
    #    (2863/226) in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-211 layer (comment-demoted at session-212 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198/\n"
        "     s199/s200/s201/s202/s203/s204/s205/s206/s207/s208/s209/s210 layers\n"
        "     sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s212 live layer — the standalone bun-launch DB
    #    re-anchor (2867/226)
    S212_LAYER = (
        "project_state: 2867 unit checks + 226 e2e checks green; the session-212 layer "
        "(THE STANDALONE BUN-LAUNCH DB RE-ANCHOR — the third fresh-clone round's catch: "
        "the FIRST drift-gate run went RED on 7 data pages [dashboard 6.37% · accounts "
        "5.57% · contacts 5.22% · leads 3.78% · calendar 1.29% · activities 3.51% · "
        "reports 6.21%] with the interior census reporting 100-900 unexplained events "
        "and ours at ~2x the reference's element count — a PHANTOM drift, fully decoded "
        "live: the round had booted the standalone production server [bun run start] on "
        ":3000 and the drift gates reused it; the DB was zeroed yet the server's "
        "/api/dashboard still returned the seed — it was reading a STALE SEEDED "
        "DATABASE OUTSIDE THE REPO [/home/z/my-project/db/custom.db, persisted in the "
        "parent directory from an earlier sandbox era]; the chain: bun auto-loads "
        "<repo>/.env and ABSOLUTIZES the relative file:../db/custom.db against the "
        ".env's own directory -> the PARENT OF THE REPO -> the standalone server.js "
        "process.chdir()s into .next/standalone -> runtimeDatabaseUrl() finds NO .env "
        "at the post-chdir cwd [the session-170 artifact hygiene removed the traced "
        "copy] -> the session-34 launch-dir recovery — nested inside the "
        "isRelativeFileUrl(envFileUrl) guard — UNREACHABLE -> bun's absolutized value "
        "mistaken for an intentional override -> the engine opens the parent-of-repo "
        "file; THE TIMELINE: session-34 built the recovery for the traced-.env "
        "artifact shape, session-170's hygiene cure removed that .env — the recovery "
        "dead code for 42 sessions, MASKED because the smoke test boots with an "
        "explicit DATABASE_URL override via node, the e2e pins file:../db/e2e.db, "
        "the drift gates boot/reuse the DEV server, and the db-path unit fixture "
        "WRITES .next/standalone/.env itself — the test-blind-spot genus, the fixture "
        "no longer mirroring the artifact; THE EXPOSURE: bun run start per "
        "README/DEPLOYMENT silently opens <repo-parent>/db/custom.db — "
        "fresh-created-empty on clean machines [a silent data absence], stale-served "
        "where such a file persists [the data-integrity hazard]; the baseline "
        "re-established after the decode [standalone killed, the stale parent db/ "
        "removed, the dev server booted]: all six drift gates CLEAN [the four-band "
        "sweep x4 · the fullpage sweep 0.093%/0.316% · the interior census "
        "byte-parity, the login row unexplained 0]; the post-211 audit round [the "
        "rotation trigger THE OWNER'S NEWEST COMMIT 1b093de: the session_445 "
        "transcript — the s211 round's own execution record]; the baseline gate at "
        "the exact s211 ship state ON THE FRESH CLONE: lint 0/0 · tsc 0 · 138/2863 "
        "unit · build (the 2 warnings the pre-existing Turbopack tracing "
        "heuristics) · smoke 14/14 · e2e 226/226 CLEAN (8.1m; the chromium-1248 "
        "environment-only wrinkle) · probe:ref STABLE at 46bc2d9c (the demo data "
        "still ZERO): THE PARITY RE-VERIFICATION probed live with agent-browser "
        "against BOTH apps logged in — THE MOBILE NAVIGATION BOTH SURFACES WORKING "
        "[the drawer: the Close button + the CRM h2 + the 8 destinations, the "
        "overlay rgba(0,0,0,0.8) vs our oklab(0 0 0 / 0.8), ours the main-scroller "
        "lock superset, Escape, the Leads ride /Dashboard -> /Leads + auto-close + "
        "full release] + Tailwind v4 clean + SEO/sitemap live-verified [the 11-route "
        "sitemap · robots · manifest · the OG head] + the hygiene legs clean [bun "
        "audit at the pinned census 10] + the scandihaven repo re-cloned [61711c3, "
        "unchanged]: D-212a1 THE LAUNCH-DIR RECOVERY HOIST [src/lib/db-path.ts — "
        "the session-34 recovery moves OUT of the envFileUrl guard and runs whenever "
        "the cwd is the validated standalone dir, INDEPENDENT of the artifact's .env "
        "presence; the order: the cwd-side bun signature [the dev server + the "
        "legacy traced-.env shape] -> the hoisted launch-dir signature [the "
        "session-34 form, now shape-independent, the session-35 RELATIVE-only guard "
        "kept] -> the effectiveDatabaseUrl passthrough [the intentional overrides "
        "unchanged]; the seam docstring + file header carry the s212 note] · "
        "D-212a2 THE CURE PINS [tests/db-path.test.ts — the session-170 "
        "ARTIFACT-SHAPE describe: the fixture WITHOUT .next/standalone/.env; "
        "RED-first at birth: exactly 2 RED at the stale tree — the re-anchor it + "
        "the no-junk it, both the defect's signature, zero collateral [the 22 "
        "standing tests + the two override keep-guards GREEN] -> the cure -> GREEN "
        "24/24; MUTATION-PROVEN x3: the hoist reverted [the recovery re-nested under "
        "the cwd-.env reachability] -> exactly 2 RED · the session-35 relative-only "
        "guard dropped -> exactly 1 RED [the absolute-launch-value it] · the "
        "urlForRoot re-anchor swapped for the raw launch absolutization -> 3 RED "
        "[every re-anchor-asserting pin] — each restored -> GREEN; THE LIVE PROOF: "
        "a fresh bun run build + bun run start on the cured tree — the standalone "
        "server serves the REPO database live [the seeded dashboard before the "
        "zero · zeros after the zero · the seed back after the reseed — via the "
        "API] and the parent-of-repo db/ NEVER recreated]: THE COUNT LADDER UNIT "
        "2863 -> 2867 (+4) · SUITES 138 HELD · E2E 226 HELD · badge 3089 -> 3093 "
        "(the unit+e2e arithmetic: 2867+226 — verified against the live unit run: "
        "138/2867 GREEN) + the same-stroke line-census re-anchor [src/lib/db-path.ts "
        "227 -> 240 — the s168 doctrine, the PAD §11 row + the ADR-002 rationale "
        "face] + the docs lockstep (the AGENTS Session-212 section · the PAD §7.1 "
        "s212 inventory row + the ADR-002 seam note · the README Deployment "
        "session-34 claim's s212 scoping · the DEPLOYMENT.md §2 launch note · "
        "docs/session_446.md · the plan's execution record + the worklog entry "
        "[Task ID 212] + the docs-counts layer-axis pair re-anchored [first = s212 "
        "· second = s211 at its ship 2863/226]) + the captures 717-721 (the "
        "round's dev-server set) + beneath it 2863 unit checks + 226 e2e checks "
        "green; the session-211 layer (THE LOGIN SEM-ISLAND PARITY EVENT — the "
        "platform's Google-auth island joined the clone construction-for-"
        "construction, and the login drift gates returned to their standing "
        "baselines; the count ladder 2858 -> 2863 + the docs lockstep + the "
        "captures 712-716))"
    )

    # 4) the surgery: the demoted block + the new live layer replace the
    #    live s211 line
    text = text.replace(live_line, demoted_block + S212_LAYER, 1)

    # 5) the frontmatter version bump + the H1 lockstep + last_updated
    v_old = "version: 1.208.0"
    v_new = "version: 1.209.0"
    assert text.count(v_old) == 1, "the frontmatter version must be unique"
    text = text.replace(v_old, v_new, 1)
    h1_old = "# NEO CRM — Engineering Skill (SKILL.md v1.208.0)"
    h1_new = "# NEO CRM — Engineering Skill (SKILL.md v1.209.0)"
    assert text.count(h1_old) == 1, "the H1 version lockstep site must be unique"
    text = text.replace(h1_old, h1_new, 1)
    d_old = "last_updated: 2026-11-03"
    d_new = "last_updated: 2026-11-04"
    assert text.count(d_old) == 1, "the last_updated site must be unique"
    text = text.replace(d_old, d_new, 1)

    SKILL.write_text(text, encoding="utf8")
    print("  flip  [SKILL head] the s212 layer live at 2867/226 (the s211 layer demoted at its ship 2863/226)")
    print("  flip  [SKILL frontmatter] version 1.208.0 -> 1.209.0 + last_updated -> 2026-11-04")

print("skill-head-212.py done")
