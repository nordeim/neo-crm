#!/usr/bin/env python3
"""skill-head-193.py — the SKILL frontmatter head surgery (the s193 layer).

The L-169c3 form: the verified-single guard. The demoted s192 layer keeps
its SHIP-TIME counts (2801/192) in its own comment block (the s171-fix
precedent). Idempotent: a re-run is a verified no-op. Also bumps the
frontmatter version (1.189.0 -> 1.190.0) + the H1 lockstep +
last_updated (already 2026-10-27 — the same-day round, held).

The s188-192 lesson applied: the HEAD surgery runs FIRST — the live s192
line still carries its ship count (2801), so the demotion is a verbatim
move, and the count-ladder-193.py run that follows flips only the OTHER
doc sites. The retired blocks stay UNTOUCHED — the generalized D-188a1
doctrine holds their ship lines under the unit gate.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S193_MARKER = "project_state: 2805 unit checks + 192 e2e checks green; the session-193 layer ("

if S193_MARKER in text:
    print("  no-op  [SKILL head] the s193 layer already live")
else:
    LIVE_MARKER = "project_state: 2801 unit checks + 192 e2e checks green; the session-192 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s192 head marker found {live_count} times"

    # 1) extract the live s192 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s192 layer keeps its ship counts (2801/192)
    #    in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-192 layer (comment-demoted at session-193 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s193 live layer — the walk66 round: the marketing-interior
    #    arms walked two-app, the universal outline-color base rule cured
    S193_LAYER = (
        "project_state: 2805 unit checks + 192 e2e checks green; the session-193 layer "
        "(THE MARKETING-INTERIOR ARMS [walk66] — the s406 close's conditional "
        "candidates all KILLED at the reference's unchanged zero-data state "
        "[the Edit-family census rows=1 rowMenus=0 — the discover-184..193 "
        "standing census · the topbar-search populated=0 on both — the s32 "
        "dead-stub doctrine stands · the dashboard follow-up-rows checkbox "
        "arms + the activities Completed-tab row actions — the "
        "data-dependent candidates stay suspended] + the standing gates "
        "killed [probe:ref STABLE at 46bc2d9c kills the fresh-bundle "
        "candidate; the registry's latest 3.10.1 verified live kills the "
        "recharts 4.0 gate]; the round material = the s406 close's own "
        "naming adjudicated LIVE on BOTH apps + byte-equal at the census "
        "level by scripts/discover-193.ts [THE /ABOUT + /CONTACT "
        "AUTHENTICATED INTERIORS' INTERACTIVE ARMS — the marketing pair "
        "inside the AppShell chrome, censused at s142, the guest funnel "
        "walked at s144, the 156-c interior-census legs holding the mainH "
        "geometry, the sweep holding the pixels — never walked at the "
        "walk53-65 OPEN-LEDGER level: no DFS ledger, no anchor inventory, "
        "no REAL keyboard Tab chain, no REAL :focus-visible face, no "
        "link-ride decode; the family 48 sessions stale]: THE WALK "
        "[scripts/walk66-marketing-interior-arms.ts, the walk61/65 "
        "multi-arm form over the TWO pages at BOTH axes on the "
        "sweep-state pair (the authenticated battery): Phase A per page "
        "the OPEN census — the main roots byte-equal at 256,69 1184x831 "
        "+ els 46/46 (about) + 33/33 (contact) + the h1 faces byte-equal "
        "+ the h2 vocabularies + the FULL anchor inventories (every "
        "href/target/rel byte-equal — the Get-in-touch link /Contact + "
        "the mailto:hello@example.com + the LinkedIn/X/GitHub trio "
        "target=_blank rel=noopener noreferrer) + the footer pair + the "
        "256px 8-link nav; Phase B the REAL keyboard Tab drive through "
        "/about — the chains STRUCTURALLY IDENTICAL at 15 stops both "
        "(the 8 sidebar links -> the search input -> Messages -> "
        "Notifications -> the account trigger -> the Get-in-touch anchor "
        "-> the footer pair; the REF's chain adds only the 16th stop — "
        "its base44 badge-close button, the s149 platform-pill genus, "
        "never mirrored) + the REAL :focus-visible faces at the six "
        "decoded stops (the geometry-keyed captures); Phase C the link "
        "rides write-free [the Get-in-touch round-trip /about->/contact "
        "+ the footer Contact ride + the footer About back-nav — "
        "byte-equal landings both apps]; Phase D the phone axes "
        "byte-equal [main 0,69 390x775 + the h1 16,117 358x36 + the "
        "first anchors + the drawer triggers 16,16 36x36 aria=Open "
        "navigation + the footer stacks — every value byte-equal]; the "
        "EXTERNAL navigations NEVER fired (the mailto/social rides stay "
        "census-only)]: TWO LIVE FINDS — D-193a1 THE BASE LAYER'S "
        "UNIVERSAL OUTLINE-COLOR RULE CURED [the alpha-color carrier "
        "family's PAINTING member: the walk53/61/66 resting faces "
        "decoded OURS currentColor/adaptive near-black vs the "
        "reference's fixed rgba(10,10,10,0.5) with style:none (zero "
        "pixels — the documented genus); the walk66 FOCUS faces found "
        "the same carrier PAINTING (1px auto) on the marketing anchors "
        "— near-black OPAQUE rgb(16,16,16) vs the reference's authored "
        "50% ring — and the micro-probe-193 CSSOM walk root-caused it: "
        "the reference's compiled base carries `* { border-color: "
        "hsl(var(--border)); outline-color: hsl(var(--ring) / .5); }` "
        "— the shadcn base template's universal line; OURS carried only "
        "the border-color half (the s7 base import); THE CURE: the "
        "outline-color half added at the same * rule — color-mix(in "
        "oklab, var(--color-ring) 50%, transparent), the v4 idiom over "
        "our --color-ring #0a0a0a, resolving to the same 50% near-black "
        "(the re-walk PROVES every outline-color now the reference's "
        "family — OURS the oklab serialization oklab(0.144787 "
        "0.00000661612 0.00000289828 / 0.5), the REF rgba(10,10,10,0.5) "
        "— the same color in the two forms, the s126 noise genus; every "
        "authored focus face unaffected — outline-style none on both)] · "
        "D-193a2 THE SIDEBAR LINKS' REAL FOCUS-VISIBLE RING — the KEPT "
        "SUPERSET, PINNED [OURS paints focus-visible:ring-2 "
        "focus-visible:ring-white/50 (the oklab white/50 2px shadow "
        "carrier) at every sidebar stop — the s7 deliberate a11y "
        "superset, re-verified invisible at the s177 walk50 RESTING "
        "face, never before walk-proven at the REAL keyboard face, and "
        "carrying ZERO test teeth until this round's pin; the reference "
        "ships NO authored focus face on its sidebar links — the bare "
        "UA outline 1px auto rgba(10,10,10,0.5), its own "
        "keyboard-focus-gap family (the D-112a2 doctrine), never "
        "mirrored; both navs (sidebar.tsx + mobile-nav.tsx) stay in "
        "lockstep under the pin)]; every remaining delta a documented "
        "genus [the token-selection bg-background/bg-gray-50 pair — "
        "computed-equal #f9fafb, the M-81c2 family · the box-shadow "
        "SLOT-COUNT with every VISIBLE layer byte-equal (the 5-vs-3 "
        "slot form, the s129 doctrine) · the outline VERSION FORM + "
        "both sub-forms (ours v4 1px none vs the reference's v3-era 2px "
        "solid transparent — zero visible pixels both, the walk51 "
        "decode) · OUR aria-hidden svg superset (the s19 family, KEPT) "
        "· OUR aria-label superset on the topbar arms (the s88-c9 "
        "family, KEPT — the search/Messages/Notifications/Account-menu "
        "labels vs the REF's bare input/button/Hi,-text) · the "
        "reference's platform badge-close 16th Tab stop (the s149 "
        "genus, never mirrored)]; THE TDD LEDGER [the pin survey first "
        "— the s142 landing pins + the NAV_LAYOUT pins + the s177 "
        "drawer pins; 3 born-green pins in page-layout (the walk66 "
        "decode freeze + the MARKETING open-interior construction "
        "freeze [the genuine battery gap: the s142 pins hold the "
        "LANDING page's strings, never the about/contact call-site "
        "chains] + the SIDEBAR ring construction freeze [the genuine "
        "gap: the ring-white/50 construction at BOTH nav sites carried "
        "zero test teeth]) + THE D-193a1 CURE PIN in design-tokens "
        "(RED-first: exactly 1 RED at birth -> the cure -> GREEN — the "
        "globals.css base-layer contract, the windowed-slice form: the "
        "rule's own comment quotes the reference's closing brace, so a "
        "rule-body regex would stop inside it)]; MUTATION-PROOF [the "
        "planted outline-color regression (50% -> 90%) -> exactly 1 RED "
        "-> restored -> GREEN, no residual; the planted sidebar ring "
        "regression (white/50 -> white/40) -> exactly 1 RED -> "
        "restored -> GREEN — both pins' unique teeth proven] · "
        "STASH-PROOF [the round's test blocks stashed -> exactly "
        "138/2801 checks (the s192 ship state) with the 2 line-census "
        "collateral pins reading the CURED globals.css against the "
        "stale docs rows (the same-commit docs-lockstep dependency — "
        "the PAD 1834 row + the SKILL 413 census site re-anchored "
        "430 -> 442 in this round's commit, the s168 line-census "
        "doctrine) -> restored -> 138/2805 — the TRUE count verified "
        "at the full-suite count, no undercount]; the count ladder "
        "2801 -> 2805 (+4: 3 the walk66 freezes + 1 the cure pin) · "
        "SUITES 138 HELD · E2E 192 re-verified (the round's "
        "product-code touch: globals.css +12 lines — the PAD/SKILL "
        "line-census rows re-anchored; the walked surfaces "
        "construction-frozen) · badge 2993 -> 2997 (the unit+e2e "
        "arithmetic: 2805+192) + count-ladder-193.py: assert-first, "
        "idempotent — session-193, the marketing-interior arms walked "
        "two-app, the alpha-color carrier family's painting member "
        "cured at the base layer + the sidebar ring superset pinned ) "
        "+ beneath it "
        + live_line.replace("project_state: ", "", 1)
    )

    # 4) splice: the demoted block + the new live layer replace the live line
    text = text.replace(live_line, demoted_block + S193_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s192 layer demoted at its ship counts (2801/192)")
    print("  flip   [SKILL head] the s193 layer live at 2805/192")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.190.0" not in t:
    assert t.count("version: 1.189.0") == 1, "the 1.189.0 frontmarker not unique"
    t = t.replace("version: 1.189.0", "version: 1.190.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.189.0 -> 1.190.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.190.0")

t = SKILL.read_text(encoding="utf8")
if "v1.190.0" not in t:
    assert t.count("v1.189.0") == 1, "the v1.189.0 H1 not unique"
    t = t.replace("# NEO CRM — Engineering Skill (SKILL.md v1.189.0)", "# NEO CRM — Engineering Skill (SKILL.md v1.190.0)", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL H1] v1.189.0 -> v1.190.0")
else:
    print("  no-op  [SKILL H1] version already v1.190.0")

print("skill-head-193: done")
