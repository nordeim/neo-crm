#!/usr/bin/env python3
"""skill-head-214.py — the SKILL frontmatter head surgery (the s214 layer).

The arithmetic: the s214 layer ships at 2878/226 (the F-214a
auth-bullet semantic census — +5 its: the AGENTS "Architecture facts"
section's auth bullet joins the pin in tests/facts-census.test.ts
[the rate-limit table census + the session contract + the reset
funnel + the proxy-hops ladder + the guard claims]; E2E 226 HELD ·
SUITES 138 HELD · badge 3099 -> 3104).

The L-169c3 form (the 204-213 template): the verified-single guard.
The demoted s213 layer keeps its SHIP-TIME counts (2873/226) in its
own comment block (the s171-fix precedent). Idempotent: a re-run is a
verified no-op. Also bumps the frontmatter version (1.210.0 ->
1.211.0) + the H1 lockstep (the s197 exact-H1 guard form);
last_updated STAYS 2026-11-04 (the same-day form — the s209
precedent).

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live
s213 line still carries its ship count (2873/226), so the demotion is
a verbatim move. The retired blocks stay UNTOUCHED.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S214_MARKER = "project_state: 2878 unit checks + 226 e2e checks green; the session-214 layer ("

if S214_MARKER in text:
    print("  no-op  [SKILL head] the s214 layer already live")
else:
    LIVE_MARKER = "project_state: 2873 unit checks + 226 e2e checks green; the session-213 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s213 head marker found {live_count} times"

    # 1) extract the live s213 line — its ship count IS 2873/226 (the
    #    held-count form), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s213 layer keeps its ship counts
    #    (2873/226) in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-213 layer (comment-demoted at session-214 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198/\n"
        "     s199/s200/s201/s202/s203/s204/s205/s206/s207/s208/s209/s210/s211/\n"
        "     s212 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s214 live layer — the auth-bullet semantic census
    #    (2878/226)
    S214_LAYER = (
        "project_state: 2878 unit checks + 226 e2e checks green; the session-214 layer "
        "(THE AUTH-BULLET SEMANTIC-PROSE CENSUS — the s213 close's named candidate's "
        "next family: the AGENTS \"Architecture facts you would otherwise guess wrong\" "
        "section's FIRST bullet, the auth bullet — the section's densest "
        "mechanically-checkable unpinned prose surface — joins the pin; the "
        "FRESH-CLONE round [the sandbox reset EMPTIED neo-crm/ — the bootstrap "
        "parent dir re-initialized at an unrelated Initial commit — so the round "
        "cloned fresh + rebuilt the environment: bun install 536 packages, the .env "
        "contract, db:push + db:seed, db census MATCH 15/24/10/23/12 + 4 users; TWO "
        "reset artifacts caught + cured at the gate layer, the s212 lesson's "
        "fresh-clone face: the STALE PARENT-OF-REPO db/custom.db RESTORED by the "
        "reset (mtime 2026-11-01, the pre-s212-cleanup era, still carrying the old "
        "seed) probed BEFORE the drift gates reused the :3000 listener — the "
        "listener's cwd = the repo root, the app resolving the REPO db, the "
        "dashboard API re-probed green AFTER the stale file's removal — then "
        "REMOVED, the s212 cleanup re-applied; the PLAYWRIGHT BROWSER-BINARY "
        "MISMATCH (the project expects chromium_headless_shell-1248, the sandbox "
        "cache carried only the 1200 era) cured with bunx playwright install "
        "chromium — the first e2e attempt's setup leg failed on the missing "
        "binary, the re-run CLEAN; the scandihaven reference re-cloned at "
        "61711c3, the standing commit]; the baseline gate GREEN at the exact s213 "
        "ship state: lint 0/0 · tsc 0 · 138/2873 unit · build · smoke 14/14 · e2e "
        "226/226 CLEAN [8.1m] · THE SIX DRIFT GATES ALL CLEAN — probe:ref STABLE "
        "at 46bc2d9c · the four-band sweep at --fail-on-drift x4 [desktop 1280 · "
        "phone 390x844 · tablet 768x1024 · landscape 1024x768] · the fullpage "
        "sweep CLEAN [desktop 0.093% / phone 0.316% — the exact standing "
        "margins] · the interior census CLEAN at --fail-on-drift [byte-parity, "
        "unexplained 0]; the parity re-verification probed live with "
        "agent-browser 0.41.1 against BOTH apps logged in — THE MOBILE NAVIGATION "
        "BOTH SURFACES WORKING [the drawer: the Close button + the CRM h2 + the "
        "8 destinations, the overlay rgba(0,0,0,0.8) vs our oklab(0 0 0 / 0.8) — "
        "the same 80% black, the v4 serialization — ours the body+main dual lock "
        "vs the reference's body-only, the documented superset, Escape + the "
        "Leads ride /Dashboard -> /Leads with auto-close + full release, verified "
        "on BOTH apps] + the landing disclosure menu working on BOTH apps [the 6 "
        "links, ours the aria-expanded superset, the in-panel FAQ ride lands "
        "/#faq + collapses] + Tailwind v4 clean + SEO/sitemap live-verified + the "
        "hygiene legs clean [bun audit at the pinned census 10]): the round's "
        "material F-214a — THE AUTH-BULLET SEMANTIC-PROSE RESIDUE (the "
        "fresh-eyes walk found ZERO live defects — every prose sample verified "
        "live: the rate-limit table · the session contract · the reset-funnel "
        "constants · the proxy-hops ladder · the guard claims · the envelope · "
        "the store · the postcss plugin — so the round's material IS the named "
        "candidate's next family, the genus-closing pin, the s208/s209/s213 "
        "precedent): D-214a1 THE AUTH-BULLET SEMANTIC CENSUS PIN "
        "[tests/facts-census.test.ts — five its: it-1 the RATE-LIMIT TABLE "
        "[the wrap-blind doc face + the live call-site CENSUS: every "
        "rateLimit(family, limit, window) triple walked from src/app/api — the "
        "exact seven-entry set (login 10 · signup 10 · resend 5 · verify 20 · "
        "forgot 10 · reset 10 · upload 20) at the 15-min window, any "
        "new/changed/removed site trips the census] · it-2 the "
        "SESSION-CONTRACT claim [scrypt:salt:hash template · SESSION_COOKIE === "
        "neo_session · SESSION_TTL_MS === 7-day · the SessionPayload field "
        "census exactly uid/iat/exp/v · the sign + verify createHmac(sha256) "
        "pair] · it-3 the RESET-FUNNEL claim [randomBytes(32) · "
        "RESET_TOKEN_TTL_MS === 60-min · the P2024/P2028->503 co-location arm · "
        "the tokenVersion increment: 1 eviction] · it-4 the PROXY-HOPS claim "
        "[the exact proxyHopDepth parse ladder: unset/empty -> 1 · "
        "unparsable/negative -> 1, fails CLOSED · else the parsed depth] · it-5 "
        "the GUARD claims [requireSession + isGuarded exported, the \\b-anchored "
        "forms · no next-auth in the manifest · NO middleware.ts anywhere in "
        "src/, the walk census]; BORN-GREEN at the first run (the s213 "
        "wrap-blind lesson applied at birth — 62/62 at the file, zero "
        "anchor-form cures needed); MUTATION-PROVEN x6 [M1 the login limit "
        "10 -> 5 -> exactly 1 RED at it-1 · M2 the AGENTS table login 10 -> "
        "login 5 -> exactly 1 RED at it-1, the doc-side arm · M3 "
        "SESSION_TTL_MS 7 -> 30 days -> exactly 1 RED at it-2 · M4 "
        "RESET_TOKEN_TTL_MS 60 -> 30 min -> exactly 1 RED at it-3 · M5 the "
        "proxy-hops unparsable arm fails open (returns 0) -> exactly 1 RED at "
        "it-4 · M6 a src/middleware.ts planted -> exactly 1 RED at it-5 — each "
        "restored -> GREEN]; STASH-PROOF [the describe stashed -> exactly "
        "138/2873, the s213 ship state, zero collateral -> restored -> "
        "138/2878]: THE COUNT LADDER UNIT 2873 -> 2878 (+5) · SUITES 138 HELD "
        "· E2E 226 HELD · badge 3099 -> 3104 (the unit+e2e arithmetic: "
        "2878+226 — verified against the live unit run: 138/2878 GREEN) + the "
        "docs lockstep (the AGENTS Session-214 section · the PAD §7.1 s214 "
        "inventory row · docs/session_450.md · the plan's execution record + "
        "the worklog entry [Task ID 214] + the docs-counts layer-axis pair "
        "re-anchored [first = s214 · second = s213 at its ship 2873/226]) + "
        "the captures 727-731 (the round's dev-server set) + beneath it 2873 "
        "unit checks + 226 e2e checks green; the session-213 layer (THE "
        "SEMANTIC-PROSE LAYOUT-CONTRACT CENSUS — the F-206a home block joins "
        "the pin, and the mutation-proof catches the pin's own prefix-blind "
        "teeth; the count ladder 2867 -> 2873 + the docs lockstep + the "
        "captures 722-726))"
    )

    # 4) the surgery: the demoted block + the new live layer replace the
    #    live s213 line
    text = text.replace(live_line, demoted_block + S214_LAYER, 1)

    # 5) the frontmatter version bump + the H1 lockstep (last_updated
    #    stays 2026-11-04 — the same-day form, the s209 precedent)
    v_old = "version: 1.210.0"
    v_new = "version: 1.211.0"
    assert text.count(v_old) == 1, "the frontmatter version must be unique"
    text = text.replace(v_old, v_new, 1)
    h1_old = "# NEO CRM — Engineering Skill (SKILL.md v1.210.0)"
    h1_new = "# NEO CRM — Engineering Skill (SKILL.md v1.211.0)"
    assert text.count(h1_old) == 1, "the H1 version lockstep site must be unique"
    text = text.replace(h1_old, h1_new, 1)

    SKILL.write_text(text, encoding="utf8")
    print("  flip  [SKILL head] the s214 layer live at 2878/226 (the s213 layer demoted at its ship 2873/226)")
    print("  flip  [SKILL frontmatter] version 1.210.0 -> 1.211.0 (last_updated stays 2026-11-04 — the same-day form)")

print("skill-head-214.py done")
