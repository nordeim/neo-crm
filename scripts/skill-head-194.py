#!/usr/bin/env python3
"""skill-head-194.py — the SKILL frontmatter head surgery (the s194 layer).

The L-169c3 form: the verified-single guard. The demoted s193 layer keeps
its SHIP-TIME counts (2805/192) in its own comment block (the s171-fix
precedent). Idempotent: a re-run is a verified no-op. Also bumps the
frontmatter version (1.190.0 -> 1.191.0) + the H1 lockstep +
last_updated (already 2026-10-27 — the same-day round, held).

The s188-193 lesson applied: the HEAD surgery runs FIRST — the live s193
line still carries its ship count (2805), so the demotion is a verbatim
move, and the count-ladder-194.py run that follows flips only the OTHER
doc sites. The retired blocks stay UNTOUCHED — the generalized D-188a1
doctrine holds their ship lines under the unit gate.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S194_MARKER = "project_state: 2811 unit checks + 192 e2e checks green; the session-194 layer ("

if S194_MARKER in text:
    print("  no-op  [SKILL head] the s194 layer already live")
else:
    LIVE_MARKER = "project_state: 2805 unit checks + 192 e2e checks green; the session-193 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s193 head marker found {live_count} times"

    # 1) extract the live s193 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s193 layer keeps its ship counts (2805/192)
    #    in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-193 layer (comment-demoted at session-194 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s194 live layer — the walk67 round: the 404 interior's
    #    interactive arms walked two-app, three cures + two pins
    S194_LAYER = (
        "project_state: 2811 unit checks + 192 e2e checks green; the session-194 layer "
        "(THE 404 INTERIOR'S INTERACTIVE ARMS [walk67] — the s408 close's "
        "conditional candidates all KILLED at the reference's unchanged "
        "zero-data state [the Edit-family census rows=1 rowMenus=0 — the "
        "discover-184..194 standing census · the topbar-search populated=0 "
        "on both — the s32 dead-stub doctrine stands · the dashboard "
        "follow-up-rows checkbox arms + the activities Completed-tab row "
        "actions — the data-dependent candidates stay suspended] + the "
        "standing gates killed [probe:ref STABLE at 46bc2d9c kills the "
        "fresh-bundle candidate; the registry's latest 3.10.1 verified "
        "live kills the recharts 4.0 gate]; the round material = the s408 "
        "close's own naming adjudicated LIVE on BOTH apps by "
        "scripts/discover-194.ts + the micro-probes [THE 404 INTERIOR'S "
        "INTERACTIVE ARMS — the designed 404 view the s12 construction "
        "built (NOT_FOUND_LAYOUT + the crm.spec render test hold the "
        "strings) but NEVER walked at the walk53-66 OPEN-LEDGER level: no "
        "DFS ledger, no Go Home arm decode, no REAL keyboard Tab chain, "
        "no REAL :focus-visible face, no ride, no phone axis, no title "
        "census; the family 180+ sessions stale against the reference's "
        "CURRENT build — the error-boundary pair OUR-ONLY, the s170 "
        "scandihaven ports, source-pinned, the reference cannot be "
        "crash-walked]: THE WALK [scripts/walk67-404-interior-arms.ts, "
        "the walk66 form over the ONE surface at BOTH contexts on the "
        "sweep-state pair + fresh anon contexts: Phase A the OPEN census "
        "at 1440x900 — the DFS ledger from the min-h-screen page root "
        "(the platform artifacts excluded, the s149 doctrine) + the "
        "h1/h2/p/span faces + the Go Home arm inventory + the glyph "
        "decode + the title + the http status; Phase B the REAL keyboard "
        "Tab drive — OURS 2 stops, the REF 3 with its platform "
        "badge-close (the s149 genus) + the REAL :focus-visible face at "
        "the Go Home stop; Phase C the Go Home ride write-free — both "
        "apps land at the landing '/' with the byte-equal h1 + CTA; "
        "Phase D the phone axes byte-equal [card 24,278 342x288 + h1 "
        "24,278 342x72 + arm 133,528 123x38 + span 106,431 103x19 "
        "post-cure]; Phase E the anon posture census — OURS the 404 at "
        "the unknown URL (http 404) vs the REF the redirect to "
        "/login?from_url=<absolute-url> (the genus decode, never "
        "fixed)]): FIVE FINDS — THREE CURED + TWO PINNED — D-194a1 THE "
        "QUOTED-PATHNAME FORM CURED [OURS interpolated usePathname() "
        "verbatim — the LEADING SLASH inside the quotes; the reference "
        "interpolates its router path WITHOUT it (the span 604,459 "
        "103x19 vs our 601,459 108x19); THE CURE: pathname.replace(/^\\//, "
        '"") at the interpolation; the crm.spec e2e string re-anchored '
        "in the same commit] · D-194a3 THE GO HOME GLYPH CURED [the "
        "M-82c2 icon-identity family's first CROSS-LIBRARY member (the "
        "D-186a1 pen-cure precedent): OURS shipped lucide house (2 "
        "paths — the house + the door; stroke-width 2; the lucide-house "
        "class prefix; the width/height attrs); the reference ships the "
        "HEROICONS home outline (exactly ONE path, NO stroke-width attr "
        "-> computed weight 1, NO width/height attrs, the bare w-4 h-4 "
        "mr-2 class) — its 404 view's platform-template origin, the one "
        "non-lucide icon family in its tree; THE CURE: the reference's "
        "exact svg inlined at the Go Home site, the lucide Home import "
        "retired there, OUR aria-hidden kept (the s19 superset family); "
        "the homeIcon pin re-anchored h-4 w-4 -> w-4 h-4 (the "
        "reference's exact class order)] · D-194a4 THE 404 TITLE CURED "
        "[OURS shipped the s12 absolute title 'This Page Does Not Exist "
        "| NEO CRM' — a PRE-DRIFT decode from the reference's "
        "180-sessions-ago build; the CURRENT reference ships bare 'NEO "
        "CRM' (live-verified at both contexts, 3s settles — and the "
        "title machinery byte-equal on every real route: both ship bare "
        "'NEO CRM' on /dashboard, 'Accounts | NEO CRM' on /accounts, "
        "'About | NEO CRM' on /about; only the 404 differed); THE CURE: "
        "the metadata export retired in not-found.tsx — the root "
        "layout's title.default 'NEO CRM' renders, byte-equal] · "
        "D-194a2 THE GO HOME TAG — the KEPT SUPERSET, PINNED [OURS "
        "renders <Link href='/'> — an ANCHOR, the WCAG-correct link "
        "semantics for a navigation affordance; the reference renders a "
        "<button> with NO href (its SPA JS-router idiom) — every VISIBLE "
        "layer byte-equal (box 658,556 123x38 · color · bg · border · "
        "radius · font · padding), the rides byte-equal; the D-112a2 "
        "a11y-superset doctrine's next member, the reference's own gap "
        "never mirrored; the construction carried ZERO test teeth on "
        "the TAG identity until this round's freeze] · D-194a5 THE ANON "
        "UNKNOWN-ROUTE POSTURE — the PLATFORM GENUS, PINNED [the "
        "reference's auth-first client-router guard redirects anon "
        "unknown-routes to /login?from_url=<absolute-url> — its "
        "designed 404 appears only PAST the guard, and its SPA never "
        "ships a real HTTP 404 status at all (200 everywhere); OURS "
        "renders the designed 404 AT the unknown URL with the true 404 "
        "status, session-independent by design (routability adjudicated "
        "first — the route-group architecture); the reference's posture "
        "is its SPA platform artifact (the s149 family) — never "
        "mirrored; the no-session-check construction pinned]; every "
        "remaining walk67 delta a documented genus [the outline-color "
        "serialization oklab vs rgba — the s126 noise genus, the "
        "D-193a1 cure's own family, zero visible pixels · the "
        "box-shadow SLOT-COUNT with every VISIBLE layer byte-equal "
        "(white 2px + slate-500 4px, the s129 doctrine) · the outline "
        "VERSION FORM (ours v4 1px none vs the reference's v3-era 2px "
        "solid transparent — zero visible pixels both, the walk51 "
        "decode) · the reference's platform badge-close Tab stop (the "
        "s149 genus, never mirrored) · OUR aria-hidden superset (the "
        "s19 family, KEPT) · the p text-node-split artifact (the p.text "
        "full-content + the p/span boxes byte-equal — zero visible "
        "delta)]; THE TDD LEDGER [the pin survey first — the s12 "
        "NOT_FOUND_LAYOUT pins + the route-case capital-404 pins; 3 "
        "RED-first CURE PINS (D-194a1 the interpolation tail — exactly "
        "3 RED at birth -> the cures -> GREEN · D-194a3 the glyph "
        "construction + the no-stroke-width negatives + the homeIcon "
        "class-order · D-194a4 the metadata-export negatives — the "
        "windowed form: the file's own comment quotes the retired title "
        "as decode history, so the pin guards the construction, never "
        "the prose) + 3 born-green freezes (the walk67 decode freeze + "
        "the 404 open-interior construction freeze [the genuine battery "
        "gap: the s12 pins hold the constant strings, never the "
        "call-site chains] + the D-194a5 ANON-posture construction "
        "freeze)]; MUTATION-PROOF [the planted strip regression -> 2 "
        "RED (the D-194a1 pin + the construction freeze's designed "
        "overlap — both hold the interpolation chain) -> restored -> "
        "GREEN · the planted stroke-width regression -> exactly 1 RED "
        "-> restored -> GREEN · the planted metadata-export regression "
        "-> exactly 1 RED -> restored -> GREEN · the planted "
        "button-tag regression -> exactly 1 RED (the construction "
        "freeze's anchor teeth) -> restored -> GREEN · the planted "
        "session-redirect regression -> exactly 1 RED -> restored -> "
        "GREEN — every pin's unique teeth proven] · STASH-PROOF [the "
        "round's test block stashed -> exactly 138/2805 checks (the "
        "s193 ship state), ZERO collateral this round (the PAD §11 row "
        "+ the SKILL §5.6 census site re-anchored 1718 -> 1725 / 277 -> "
        "283 checks in the same stroke, the s168 line-census doctrine) "
        "-> restored -> 138/2811 — the TRUE count verified at the "
        "full-suite count, no undercount]; the count ladder 2805 -> "
        "2811 (+6: 3 the cure pins + 3 the freezes) · SUITES 138 HELD "
        "· E2E 192 re-verified (the round's product-code touch: "
        "not-found.tsx + not-found-body.tsx + page-layout.ts +7 lines "
        "— the PAD/SKILL line-census rows re-anchored) · badge 2997 -> "
        "3003 (the unit+e2e arithmetic: 2811+192) + count-ladder-194.py: "
        "assert-first, idempotent — session-194, the 404 interior's "
        "interactive arms walked two-app, three cures (the path form + "
        "the glyph + the title) + two pins (the anchor superset + the "
        "anon posture) ) + beneath it "
        + live_line.replace("project_state: ", "", 1)
    )

    # 4) splice: the demoted block + the new live layer replace the live line
    text = text.replace(live_line, demoted_block + S194_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s193 layer demoted at its ship counts (2805/192)")
    print("  flip   [SKILL head] the s194 layer live at 2811/192")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.191.0" not in t:
    assert t.count("version: 1.190.0") == 1, "the 1.190.0 frontmarker not unique"
    t = t.replace("version: 1.190.0", "version: 1.191.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.190.0 -> 1.191.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.191.0")

t = SKILL.read_text(encoding="utf8")
if "v1.191.0" not in t:
    assert t.count("v1.190.0") == 1, "the v1.190.0 H1 not unique"
    t = t.replace("# NEO CRM — Engineering Skill (SKILL.md v1.190.0)", "# NEO CRM — Engineering Skill (SKILL.md v1.191.0)", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL H1] v1.190.0 -> v1.191.0")
else:
    print("  no-op  [SKILL H1] version already v1.191.0")

print("skill-head-194: done")
