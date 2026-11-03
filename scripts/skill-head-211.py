#!/usr/bin/env python3
"""skill-head-211.py — the SKILL frontmatter head surgery (the s211 layer).

The arithmetic: the s211 layer ships at 2863/226 (the F-211a login
sem-island parity event — +5 its: the three login-views construction
pins + the two design-tokens island pins; E2E 226 HELD · SUITES 138
HELD · badge 3084 -> 3089).

The L-169c3 form (the 204-210 template): the verified-single guard.
The demoted s210 layer keeps its SHIP-TIME counts (2858/226) in its
own comment block (the s171-fix precedent). Idempotent: a re-run is a
verified no-op. Also bumps the frontmatter version (1.207.0 ->
1.208.0) + the H1 lockstep (the s197 exact-H1 guard form) +
last_updated 2026-11-02 -> 2026-11-03.

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live
s210 line still carries its ship count (2858/226), so the demotion is
a verbatim move. The retired blocks stay UNTOUCHED.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S211_MARKER = "project_state: 2863 unit checks + 226 e2e checks green; the session-211 layer ("

if S211_MARKER in text:
    print("  no-op  [SKILL head] the s211 layer already live")
else:
    LIVE_MARKER = "project_state: 2858 unit checks + 226 e2e checks green; the session-210 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s210 head marker found {live_count} times"

    # 1) extract the live s210 line — its ship count IS 2858/226 (the
    #    held-count form), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s210 layer keeps its ship counts
    #    (2858/226) in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-210 layer (comment-demoted at session-211 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198/\n"
        "     s199/s200/s201/s202/s203/s204/s205/s206/s207/s208/s209 layers sit\n"
        "     demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s211 live layer — the login sem-island parity event
    #    (2863/226)
    S211_LAYER = (
        "project_state: 2863 unit checks + 226 e2e checks green; the session-211 layer "
        "(THE LOGIN SEM-ISLAND PARITY EVENT — the second fresh-clone round's catch: the "
        "interior census went RED on the login row at ALL FOUR BANDS, 2 unexplained "
        "events each [the s210 record: zero] — a live reference-side parity event, the "
        "same family as the 2026-10 mobile-nav event: the Base44 platform re-wrapped "
        "the login Google-auth block in its own design-system island, DOM-decoded live "
        "[a bare div data-ds=base44 data-theme=light wrapping the google wrap + the "
        "or-divider inside div.w-full, the form outside] + the sem-token re-skin [bg "
        "--sem-surface-interactive-white-default #fff · text --sem-text-icon-primary "
        "#0f0e0e vs our slate-700 · border --sem-border-light-default #e9e6e0 vs our "
        "slate-200 · hover #f1eeea / #ddd8d2 · the inert group class — pixel-verified: "
        "the ref border (233,230,224) vs ours (226,232,240), the ref text near-black "
        "vs ours slate-700] + THE ISLAND FONT — a LIVE WEBFONT [the island sets "
        "--font-body: Wix Madefor Text, system-ui, sans-serif and the platform loads "
        "the latin variable woff2 400-800 — the button label renders 166px vs our "
        "system-stack 172px, decisively probed: both system stacks measure 172.5, the "
        "Madefor stack 166, document.fonts carries it loaded] + the divider re-token "
        "[--sem-text-icon-secondary #5d5d5d vs our slate-500 + the platform's "
        "data-orientation/role line attrs] + the G icon [the reference's EXACT classic "
        "Google brand svg M22.56 12.25... vs our hand-approximated variant] + the "
        "scope [signin view only, everything else byte-equal, the app bundle STABLE at "
        "46bc2d9c — the platform runtime injected the island] + the pixel face [the "
        "login sweep diff 0.28% -> 0.46%]; the post-210 audit round [the rotation "
        "trigger THE OWNER'S NEWEST COMMIT 839cce7: the session_443 transcript — the "
        "s210 round's own execution record]; the baseline gate ON THE FRESH CLONE — "
        "THE S210 PORTABILITY CURE VERIFIED LIVE [the facts-census path arm GREEN "
        "with all three runtime artifacts absent, before any e2e/smoke run]: lint 0/0 "
        "· tsc 0 · 138/2858 unit · build (the 2 warnings the pre-existing Turbopack "
        "tracing heuristics) · smoke 14/14 · e2e 226/226 CLEAN (8.1m; one "
        "environment-only wrinkle — the fresh sandbox's Playwright 1.64.1 wanted "
        "chromium-1248, bunx playwright install chromium, zero code involvement) · "
        "probe:ref STABLE at 46bc2d9c (the demo data still ZERO) · the four-band "
        "sweep CLEAN x4 · the fullpage sweep CLEAN (desktop 0.093% / phone 0.316%): "
        "THE PARITY RE-VERIFICATION probed live with agent-browser against BOTH apps "
        "logged in — THE MOBILE NAVIGATION BOTH SURFACES WORKING [the drawer: the "
        "Close button + the CRM h2 + the 8 destinations, the overlay rgba(0,0,0,0.8) "
        "vs our oklab(0 0 0 / 0.8), ours the dual-lock superset, Escape, the Leads "
        "ride /Dashboard -> /Leads + auto-close + full release] + THE VLM "
        "DRAWER-PAIR COMPARISON: IDENTICAL + Tailwind v4 clean + SEO/sitemap "
        "live-verified + the hygiene legs clean [bun audit at the pinned census 10]: "
        "D-211a1 THE LOGIN SEM-ISLAND MIRROR [the 2026-10 mobile-nav parity-event "
        "doctrine — construction-for-construction: public/fonts/wix-madefor-text-"
        "latin.woff2 self-hosted [the platform's own latin subset fetched from the "
        "reference's public static origin, 20.3KB magic-verified; Wix IP — the "
        "licensing note recorded, swap-ready: the @font-face names the family, not "
        "the file] + the globals.css island CSS [the @font-face 400 800 swap + the "
        "[data-ds=base44] block: the six sem vars + --font-body + the island's own "
        "font-family/color rule — the tight mirror, only what the island's subtree "
        "consumes] + the LOGIN_LAYOUT flips [google -> the reference's exact sem "
        "class string its exact order, the group class included · googleIcon -> its "
        "exact order · dividerLabelSpan -> the sem form] + the login-card island "
        "wrapper [data-ds + data-theme, the S96-P0 margin math passing through the "
        "classless block unchanged] + the GoogleIcon replaced with the reference's "
        "exact four brand paths [our aria-hidden kept, the s19 superset] + the "
        "divider line's platform attrs] · D-211a2 THE CURE PINS [RED-first at birth: "
        "exactly 6 RED at the stale tree — the re-anchored S96-P0 construction pin + "
        "the 3 new login-views its + the 2 new design-tokens its, zero collateral -> "
        "the cure -> GREEN 138/2863] + the typography docstring's s211 supersession "
        "note [the zero-webfont claim scoped: the app's own surfaces stay "
        "zero-webfont, the island the sole documented exception] + the same-stroke "
        "line-census re-anchors [page-layout.ts 1725 -> 1740 · globals.css 442 -> "
        "482 — the s168 doctrine, the PAD §11 rows + the SKILL §5.2/§5.6 sites + "
        "their pins]: THE COUNT LADDER UNIT 2858 -> 2863 (+5) · SUITES 138 HELD · "
        "E2E 226 HELD · badge 3084 -> 3089 (the unit+e2e arithmetic: 2863+226 — "
        "verified against the live unit run: 138/2863 GREEN) + the docs lockstep "
        "(the AGENTS Session-211 section · docs/session_444.md · the PAD section-7.1 "
        "s211 inventory row + the §6 typography row's island-exception clause · the "
        "SKILL §2 design-thesis row's island-exception clause · the plan's execution "
        "record + the worklog entry [Task ID 211] + the docs-counts layer-axis pair "
        "re-anchored [first = s211 · second = s210 at its ship 2858/226]) + the "
        "captures 712-716 (the round's dev-server set) + beneath it 2858 unit checks "
        "+ 226 e2e checks green; the session-210 layer (THE CENSUS CHECKOUT-"
        "PORTABILITY CONTRACT — the first fresh-clone round's catch: the D-208a2 "
        "path arm RED on any fresh checkout, 7 runtime-artifact claims; D-210a1 the "
        "generated-artifact contract, the frozen artifact->generator map pinned both "
        "ways, the portability proof + MUTATION-PROVEN x3; the count ladder HELD "
        "2858/226/3084 + the docs lockstep + the captures 707-711))"
    )

    # 4) the surgery: the demoted block + the new live layer replace the
    #    live s210 line
    text = text.replace(live_line, demoted_block + S211_LAYER, 1)

    # 5) the frontmatter version bump + the H1 lockstep + last_updated
    v_old = "version: 1.207.0"
    v_new = "version: 1.208.0"
    assert text.count(v_old) == 1, "the frontmatter version must be unique"
    text = text.replace(v_old, v_new, 1)
    h1_old = "# NEO CRM — Engineering Skill (SKILL.md v1.207.0)"
    h1_new = "# NEO CRM — Engineering Skill (SKILL.md v1.208.0)"
    assert text.count(h1_old) == 1, "the H1 version lockstep site must be unique"
    text = text.replace(h1_old, h1_new, 1)
    d_old = "last_updated: 2026-11-02"
    d_new = "last_updated: 2026-11-03"
    assert text.count(d_old) == 1, "the last_updated site must be unique"
    text = text.replace(d_old, d_new, 1)

    SKILL.write_text(text, encoding="utf8")
    print("  flip  [SKILL head] the s211 layer live at 2863/226 (the s210 layer demoted at its ship 2858/226)")
    print("  flip  [SKILL frontmatter] version 1.207.0 -> 1.208.0 + last_updated -> 2026-11-03")

print("skill-head-211.py done")
