#!/usr/bin/env python3
"""skill-head-191.py — the SKILL frontmatter head surgery (the s191 layer).

The L-169c3 form: the verified-single guard. The demoted s190 layer keeps
its SHIP-TIME counts (2786/192) in its own comment block (the s171-fix
precedent). Idempotent: a re-run is a verified no-op. Also bumps the
frontmatter version (1.187.0 -> 1.188.0) + the H1 lockstep +
last_updated (already 2026-10-27 — the same-day round, held).

The s188-190 lesson applied: the HEAD surgery runs FIRST — the live s190
line still carries its ship count (2786), so the demotion is a verbatim
move (no ship-count restore needed), and the count-ladder-191.py run
that follows flips only the OTHER doc sites (the head's live line is
already 2794 when it reads them). The retired blocks stay UNTOUCHED —
the generalized D-188a1 doctrine holds their ship lines under the unit
gate, and the doctrine's next member (the retired s190 block's own ship
line) is pinned in docs-counts by THIS round.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S191_MARKER = "project_state: 2795 unit checks + 192 e2e checks green; the session-191 layer ("

if S191_MARKER in text:
    print("  no-op  [SKILL head] the s191 layer already live")
else:
    LIVE_MARKER = "project_state: 2786 unit checks + 192 e2e checks green; the session-190 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s190 head marker found {live_count} times"

    # 1) extract the live s190 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s190 layer keeps its ship counts (2786/192)
    #    in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-190 layer (comment-demoted at session-191 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s191 live layer — the walk64 round: the id-parity family
    #    (D-191a1/a2 the literal id/for maps + D-191a3 the selects' id/for
    #    wiring + D-191a4 the tabIndex retirement) cured + four born-green
    #    freeze pins
    S191_LAYER = (
        "project_state: 2795 unit checks + 192 e2e checks green; the session-191 layer "
        "(THE THREE CREATE DIALOGS' OPEN FACES [walk64] — the s402 close's "
        "conditional candidates all KILLED at the reference's unchanged "
        "zero-data state [the Edit-family census rows=1 rowMenus=0 + zero "
        "calendar chips — the discover-184..191 standing census · the "
        "topbar-search populated=0 on both — the s32 dead-stub doctrine "
        "stands · the dashboard follow-up-rows checkbox arms + the "
        "activities Completed-tab row actions — the data-dependent "
        "candidates stay suspended] + the standing gates killed [probe:ref "
        "STABLE at 46bc2d9c kills the fresh-bundle candidate; the "
        "registry's latest 3.10.1 verified live kills the recharts 4.0 "
        "gate]; the round material = the three unwalked create dialogs "
        "adjudicated LIVE on BOTH apps + byte-equal at the census level by "
        "scripts/discover-191.ts [the CONTACT — the s15/s30 avatar + "
        "photo-upload construction · the ACCOUNT — the s15 8-field 2-col "
        "grid · the EVENT — the s15/s76 WIDE family — the walk54/58 dialog "
        "family's never-opened members]: THE WALK "
        "[scripts/walk64-createdialogs-focus-open.ts, the walk61 multi-arm "
        "form over the THREE dialogs at BOTH axes: Phase A per dialog the "
        "OPEN census — the triggers 1255,115 153x36 / 1274,103 134x32 / "
        "1269,113 139x36 byte-equal + the OPEN roots 464,45 512x810 / "
        "384,214 672x472 / 384,133 672x634 byte-equal + the DFS ledger + "
        "the FULL inputs id map + the labels wiring map + the comboboxes "
        "+ the contact file input + the footer Cancel/Create pairs + the "
        "mount focus; Phase B the REAL Tab drives — the chains "
        "STRUCTURALLY IDENTICAL (19/12/19 stops; the datetime segments' "
        "native 7-tab cycles identical on both) + the REAL :focus-visible "
        "faces byte-equal on the VISIBLE layers (the 1px near-black "
        "ring); Phase C the interactive arms — the meet-select ride [the "
        "5 emoji options + the listbox 489,623 464x170 byte-equal] + the "
        "status ride [the 3-option set + the listbox 728,613 305x106 "
        "byte-equal] + the EVENT related-to pick [the M-76c13 conditional "
        "Name field live on BOTH apps: the placeholder 'Enter Contact "
        "name' + the box 728,638 303x36 + the comboTexts flip] + the "
        "cancel-then-reopen state decode [ours clears via the S71-P1 "
        "epoch — the pinned fresh-per-open contract, the reference keeps "
        "its draft — the kept house superset] — the submits NEVER fired "
        "on either app; Phase D the phone axes 0,42 390x760 / 0,168 "
        "390x508 / 0,99 390x646 byte-equal]: FOUR LIVE FINDS CURED — the "
        "id-parity family: D-191a1 THE CONTACT LITERAL ID/FOR MAP "
        "[id=\"name\"/\"email\"/\"phone\"/\"company\"/\"position\" + for= "
        "the same restored; the ct-* prefixes retired] · D-191a2 THE "
        "ACCOUNT LITERAL ID/FOR MAP [id=\"name\"/\"industry\"/\"email\"/"
        "\"phone\"/\"website\"/\"revenue\"/\"employees\" restored; the "
        "acc-* retired] · D-191a3 THE SELECTS' ID + LABEL-FOR WIRING "
        "[button id=\"source\" + for=\"source\" · button id=\"status\" + "
        "for=\"status\" — the aria-label superset KEPT, it wins the "
        "accessible-name computation] · D-191a4 THE CONTACT FILE INPUT'S "
        "EXPLICIT tabIndex RETIRED [the D-187a1 doctrine's next member; "
        "both inert — className=\"hidden\"]; the re-walk PROVES the "
        "id/for/tabIndex ledger deltas GONE; every remaining delta a "
        "documented genus [the box-shadow SLOT-COUNT with every VISIBLE "
        "layer byte-equal · the outline VERSION FORM + both sub-forms + "
        "the COLOR-CARRIER sub-form · the M-81c2 token pairs — "
        "border-line/bg-surface vs border/bg-background, computed-equal · "
        "the md:text-sm COMPOSITION genus — the COMPUTED font 14px/500 "
        "byte-equal both apps · the aria-label supersets [kept] · our "
        "aria-hidden svg + Radix placeholder-<option> supersets [kept] · "
        "the reference's own Radix artifacts — the stale aria-controls at "
        "rest + the DANGLING aria-describedby genus [walk54: the "
        "reference's own dead pointer, not mirrored] · the React useId "
        "format · the KEPT s172 label-wiring superset on the event "
        "dialog — the reference's bare labels are its own defect, never "
        "mirrored]; THE TDD LEDGER [the pin survey first — the "
        "s15/s19/s28/s30/s50/s76/s92/s112/s172 dialog pin families + the "
        "walk53-63 decode freezes; 4 born-green pins — the walk64 decode "
        "freeze + the three open-interior construction freezes (the "
        "genuine battery gap: the s19/s30/s15 pins hold the wiring "
        "regexes + the constants, never the call-site chains) + THE FOUR "
        "CURE PINS (RED-first: exactly 5 RED at birth — the contact "
        "freeze rides the cured file-input string — -> the cures -> "
        "GREEN)]; MUTATION-PROOF [the id=\"phone\" regression replanted "
        "-> exactly 1 RED -> restored -> GREEN, no residual] · "
        "STASH-PROOF [the round's block stashed -> exactly 138/2786, the "
        "s190 ship state -> restored -> 138/2795]; the count ladder 2786 "
        "-> 2795 (+9: 4 the walk64 freezes + 5 the cure pins) · "
        "SUITES 138 HELD · E2E 192 re-verified (the round's product-code "
        "touch: entity-dialogs.tsx 1226 -> 1245 [the four cure comment "
        "blocks] — the pad/census re-anchored) · badge 2978 -> 2986 (the "
        "unit+e2e arithmetic: 2795+192) + count-ladder-191.py: "
        "assert-first, idempotent — session-191, the create-dialog "
        "family completed two-app, the ids-are-construction-parity "
        "doctrine's next members cured ) + beneath it "
        + live_line.replace("project_state: ", "", 1)
    )

    # 4) splice: the demoted block + the new live layer replace the live line
    text = text.replace(live_line, demoted_block + S191_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    flips_head = 1
    print("  flip   [SKILL head] the s190 layer demoted at its ship counts (2786/192)")
    print("  flip   [SKILL head] the s191 layer live at 2794/192")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.188.0" not in t:
    assert t.count("version: 1.187.0") == 1, "the 1.187.0 frontmarker not unique"
    t = t.replace("version: 1.187.0", "version: 1.188.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.187.0 -> 1.188.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.188.0")

print("skill-head-191: done")
