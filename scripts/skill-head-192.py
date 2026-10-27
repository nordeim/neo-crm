#!/usr/bin/env python3
"""skill-head-192.py — the SKILL frontmatter head surgery (the s192 layer).

The L-169c3 form: the verified-single guard. The demoted s191 layer keeps
its SHIP-TIME counts (2795/192) in its own comment block (the s171-fix
precedent). Idempotent: a re-run is a verified no-op. Also bumps the
frontmatter version (1.188.0 -> 1.189.0) + the H1 lockstep +
last_updated (already 2026-10-27 — the same-day round, held).

The s188-191 lesson applied: the HEAD surgery runs FIRST — the live s191
line still carries its ship count (2795), so the demotion is a verbatim
move (no ship-count restore needed), and the count-ladder-192.py run
that follows flips only the OTHER doc sites (the head's live line is
already 2801 when it reads them). The retired blocks stay UNTOUCHED —
the generalized D-188a1 doctrine holds their ship lines under the unit
gate, and the doctrine's next member (the retired s191 block's own ship
line) is pinned in docs-counts by THIS round.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S192_MARKER = "project_state: 2801 unit checks + 192 e2e checks green; the session-192 layer ("

if S192_MARKER in text:
    print("  no-op  [SKILL head] the s192 layer already live")
else:
    LIVE_MARKER = "project_state: 2795 unit checks + 192 e2e checks green; the session-191 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s191 head marker found {live_count} times"

    # 1) extract the live s191 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s191 layer keeps its ship counts (2795/192)
    #    in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-191 layer (comment-demoted at session-192 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s192 live layer — the walk65 round: the login anon-surface
    #    interiors + the landing marketing arms walked two-app, the
    #    id-parity family + the REAL focus-ring find cured
    S192_LAYER = (
        "project_state: 2801 unit checks + 192 e2e checks green; the session-192 layer "
        "(THE LOGIN ANON-SURFACE INTERIORS + THE LANDING MARKETING ARMS [walk65] "
        "— the s404 close's conditional candidates all KILLED at the "
        "reference's unchanged zero-data state [the Edit-family census "
        "rows=1 rowMenus=0 — the discover-184..192 standing census · the "
        "topbar-search populated=0 on both — the s32 dead-stub doctrine "
        "stands · the dashboard follow-up-rows checkbox arms + the "
        "activities Completed-tab row actions — the data-dependent "
        "candidates stay suspended] + the standing gates killed [probe:ref "
        "STABLE at 46bc2d9c kills the fresh-bundle candidate; the "
        "registry's latest 3.10.1 verified live kills the recharts 4.0 "
        "gate]; the round material = the s404 close's named unwalked "
        "surfaces adjudicated LIVE on BOTH apps + byte-equal at the "
        "census level by scripts/discover-192.ts [THE LOGIN PAGE'S "
        "ANON-SURFACE INTERIORS — the signin resting card + the view "
        "machine's OPEN interiors (signup/reset/sent), last walked at "
        "the s111/s126 computed-style censuses, never at the "
        "walk53-64 OPEN-LEDGER level, never under the "
        "ids-are-construction-parity doctrine, stale through the s163 "
        "auth retrofit's sent-view change · THE LANDING PAGE'S "
        "MARKETING ARMS — the FAQ single-open accordion + the mobile "
        "disclosure menu, the s143/s155 walks censused the anatomy + "
        "the four-axis geometry, never the OPEN-state interiors]: THE "
        "WALK [scripts/walk65-login-landing-arms.ts, the walk61 "
        "multi-arm form over the TWO surfaces at BOTH axes on FRESH "
        "contexts (the anon battery — no login, no storageState on "
        "either app): Phase A per view the OPEN census — the card "
        "roots byte-equal at 496,95 448x710 / 16,73 358x650 (signin) "
        "+ 496,215 448x470 / 16,187 358x422 (signup) + 496,263 448x374 "
        "/ 16,243 358x310 (reset) + 496,251 448x398 / 16,221 358x354 "
        "(sent) + the DFS ledger + the FULL inputs id map + the labels "
        "wiring map + the google button + the submit/back faces + the "
        "mount focus (body on BOTH) + the back-navs byte-equal; Phase B "
        "the REAL keyboard Tab drive through the signin card — the "
        "chains STRUCTURALLY IDENTICAL through the card (7 stops: the "
        "google button -> email#email -> password#password -> Sign in "
        "-> Forgot password? -> Need an account?; the 7th stop's escape "
        "differs only in the landing target — ours body, the reference "
        "its own platform badge-close button, the s149 platform-pill "
        "genus) + the REAL :focus-visible faces — the email input's "
        "ring byte-equal on the VISIBLE layers (white 2px + "
        "slate-400 4px both apps), the google button byte-equal (the "
        "UA default 1px auto); Phase C the view-flip draft decode "
        "[OURS KEEPS the typed email across the reset flip + the back "
        "flip — the reference CLEARS it; the KEPT house superset — "
        "the reference's clear-on-flip loses a typed email on an "
        "in-place flip, its own defect, never mirrored]; the "
        "sent-view ride write-free [the nonexistent-email "
        "forgot-password POST, the no-enumeration 200 family — the "
        "reference's own forgot-password is client-side theater]; "
        "Phase D the phone axes byte-equal; Phase E the FAQ "
        "single-open ride [Q1 open by default + the Q2/Q3 rides flip "
        "the single open item + the chevron rotate-180 byte-equal + "
        "the section 1440x677 + the max-w-3xl container byte-equal; "
        "OURS the aria-expanded a11y superset — the standing s142 "
        "DEVIATION pin, KEPT]; Phase F the mobile disclosure menu ride "
        "@390 [the hamburger 342,16 32x32 + the OPEN panel 0,64 "
        "390x229 + the 6-link vocabulary + the menu-x icon swap + the "
        "re-toggle close — all byte-equal; OURS the toggle's "
        "aria-expanded superset]; Phase G the CTA faces [the hero "
        "pair + the pricing tier buttons byte-equal modulo the "
        "brand-token genus — the reference's rgb(36,99,235) vs ours "
        "the working blue rgb(37,99,235)]): THREE LIVE FINDS CURED — "
        "D-192a1 THE SIGNUP VIEW'S CONFIRM INPUT LITERAL ID "
        "[id=\"confirmPassword\" + for= the same restored; the "
        "kebab-case id=\"confirm-password\" retired — the "
        "D-114a2/D-187a1/D-190a1/D-191a1/a2 "
        "ids-are-construction-parity doctrine's next member, matching "
        "the reset-password page's own confirmPassword family] · "
        "D-192a2 THE RESET VIEW'S EMAIL INPUT LITERAL ID "
        "[the bare literal id=\"email\" + for= the same restored; the "
        "id=\"reset-email\" retired — the views never render "
        "simultaneously, no collision with the signin view's own "
        "id=\"email\"] · D-192a3 THE AUTH-CARD DARK SUBMITS' REAL "
        "FOCUS-VISIBLE RING [the reference's stock dark submits focus "
        "to the near-black --ring token rgb(9,9,11) over the white 2px "
        "offset — live-walked on the signin/signup/reset submits' REAL "
        "keyboard faces via walk65 Phase B + "
        "scripts/micro-probe-192-submit-faces.ts; ours shipped "
        "ring-slate-400 (the s10-era authoring assumption, never "
        "live-probed on the submit); THE CURE: "
        "focus-visible:ring-slate-400 -> focus-visible:ring-ring at "
        "all four dark-submit sites (LOGIN_LAYOUT.submit + the "
        "LOGIN_RESET_LAYOUT.send + the LOGIN_SIGNUP_LAYOUT.submit + "
        "the LOGIN_VERIFY_LAYOUT.submit — the verify arm write-gated, "
        "its cure rides the family doctrine); the INPUTS' "
        "slate-400 rings byte-equal and STAY]; the re-walk PROVES "
        "the id/for ledger deltas GONE + the submit's REAL ring now "
        "the reference's family (rgb(10,10,10) vs rgb(9,9,11) — the "
        "documented 1-unit L-126c6 residue); every remaining delta a "
        "documented genus [the box-shadow SLOT-COUNT with every "
        "VISIBLE layer byte-equal · the outline VERSION FORM (ours "
        "v4 1px none vs the reference's v3-era 2px solid transparent "
        "— zero visible pixels both, the walk51 decode) · the "
        "oklab/rgba serialization noise (s126 L-126c8/c9) · the "
        "zinc-vs-neutral inherited-foreground residue (L-126c6) · "
        "the class-order genus (computed-equal) · the "
        "text-card-foreground token genus (the reference's stock "
        "token, normCls-matched) · OUR aria-hidden superset on the "
        "decorative divs/spans/svgs (the s19 family, KEPT) · the "
        "brand-mark logo genus (the reference's <img> brand asset vs "
        "ours the CSS-built mark — the sweep's own documented "
        "brand-mark tolerance) · the lucide svg-internal path-order "
        "genus (the Mail icon's path/rect order — computed-identical "
        "icons) · the v3-semantics space-y lineage (the "
        "[&>*+*]:mt-1.5 vs space-y-1.5 fields — computed-equal, the "
        "M-79c2 doctrine) · the stock-label inert-arms genus (the "
        "reference's peer-disabled arms, inert without a peer) · "
        "the body-bg invisible axis (the F-119c2/L-126c5 full-cover "
        "gradient doctrine) · the reference's base44 platform "
        "artifacts (the badge-close button — never mirrored)]; THE "
        "TDD LEDGER [the pin survey first — the s11/s21/s79/s111 "
        "login pin families + the s142 landing pins + the walk53-64 "
        "decode freezes; 3 born-green pins — the walk65 decode "
        "freeze + the login open-interior construction freeze + the "
        "landing marketing-arms construction freeze + THE THREE CURE "
        "PINS (RED-first: exactly 3 RED at birth -> the cures -> "
        "GREEN)]; MUTATION-PROOF [the id=\"confirmPassword\" "
        "regression replanted -> exactly 1 RED -> restored -> GREEN, "
        "no residual] · STASH-PROOF [the round's page-layout block "
        "stashed -> exactly 138/2795, the s191 ship state -> "
        "restored -> 138/2801]; the count ladder 2795 -> 2801 (+6: "
        "3 the walk65 freezes + 3 the cure pins) · SUITES 138 HELD "
        "· E2E 192 re-verified (the round's product-code touch: "
        "login-card.tsx + page-layout.ts + login-reset.ts — all "
        "string swaps, zero line-count changes, the docs census "
        "rows HELD) · badge 2987 -> 2993 (the unit+e2e arithmetic: "
        "2801+192) + count-ladder-192.py: assert-first, idempotent — "
        "session-192, the login anon-surface family + the landing "
        "marketing arms walked two-app, the "
        "ids-are-construction-parity doctrine's next members + the "
        "first REAL-keyboard-face ring find cured ) + beneath it "
        + live_line.replace("project_state: ", "", 1)
    )

    # 4) splice: the demoted block + the new live layer replace the live line
    text = text.replace(live_line, demoted_block + S192_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s191 layer demoted at its ship counts (2795/192)")
    print("  flip   [SKILL head] the s192 layer live at 2801/192")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.189.0" not in t:
    assert t.count("version: 1.188.0") == 1, "the 1.188.0 frontmarker not unique"
    t = t.replace("version: 1.188.0", "version: 1.189.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.188.0 -> 1.189.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.189.0")

t = SKILL.read_text(encoding="utf8")
if "v1.189.0" not in t:
    assert t.count("v1.188.0") == 1, "the v1.188.0 H1 not unique"
    t = t.replace("# NEO CRM — Engineering Skill (SKILL.md v1.188.0)", "# NEO CRM — Engineering Skill (SKILL.md v1.189.0)", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL H1] v1.188.0 -> v1.189.0")
else:
    print("  no-op  [SKILL H1] version already v1.189.0")

print("skill-head-192: done")
