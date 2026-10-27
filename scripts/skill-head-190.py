#!/usr/bin/env python3
"""skill-head-190.py — the SKILL frontmatter head surgery (the s190 layer).

The L-169c3 form: the verified-single guard. The demoted s189 layer keeps
its SHIP-TIME counts (2781/192) in its own comment block (the s171-fix
precedent). Idempotent: a re-run is a verified no-op. Also bumps the
frontmatter version (1.186.0 -> 1.187.0) + the H1 lockstep +
last_updated (already 2026-10-27 — the same-day round, held).

The s188/s189 lesson applied: the HEAD surgery runs FIRST — the live
s189 line still carries its ship count (2781), so the demotion is a
verbatim move (no ship-count restore needed), and the
count-ladder-190.py run that follows flips only the OTHER doc sites
(the head's live line is already 2785 when it reads them). The retired
s186/s187/s188 blocks stay UNTOUCHED — the D-188a1 pin (generalized to
every retired block) holds their ship lines under the unit gate, and
the doctrine's next member (the retired s189 block's own ship line)
is pinned in docs-counts by THIS round.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S190_MARKER = "project_state: 2785 unit checks + 192 e2e checks green; the session-190 layer ("

if S190_MARKER in text:
    print("  no-op  [SKILL head] the s190 layer already live")
else:
    LIVE_MARKER = "project_state: 2781 unit checks + 192 e2e checks green; the session-189 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s189 head marker found {live_count} times"

    # 1) extract the live s189 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s189 layer keeps its ship counts (2781/192)
    #    in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-189 layer (comment-demoted at session-190 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s190 live layer — the walk63 round: the ONE live find
    #    (D-190a1 the checkbox literal ids) cured + three born-green
    #    freeze pins
    S190_LAYER = (
        "project_state: 2785 unit checks + 192 e2e checks green; the session-190 layer "
        "(THE REPORTS SAVE-CUSTOM-VIEW DIALOG OPEN FACES [walk63] — the s400 close's "
        "named candidates [the reports SAVE-CUSTOM-VIEW dialog — the s25-era "
        "construction, its open faces never walked under ADR-022 · the dashboard "
        "follow-up-rows checkbox arms — the s27-era construction, its interactive "
        "faces never walked · the activities Completed-tab's row-action buttons — "
        "the s109-era mobile-guard construction never re-walked at the desktop "
        "axis] adjudicated by the discovery scripts/discover-189.ts -> scripts/"
        "discover-190.ts + the micro-probes: the DIALOG LIVE on BOTH apps at "
        "every censused face, the DASHBOARD checkbox arms + the COMPLETED-TAB "
        "row actions KILLED [the reference's zero-data state persists — 0 "
        "checkboxes on Lead Sources, the No-upcoming empty state, the empty "
        "Completed panel — the same doctrine as the s189 Insights kill], the "
        "topbar-search gate KILLED again [populated=0 on both — the s32 "
        "dead-stub doctrine stands]; the probe STABLE at 46bc2d9c kills the "
        "fresh-bundle candidate, the registry's latest staying 3.10.1 kills "
        "the recharts 4.0 gate; the baseline GREEN at the exact s189 ship "
        "state on a FRESH CLONE: lint 0/0 · tsc 0 · 138/2781 · build · smoke "
        "14/14 · e2e 192/192 clean first run 5.7m · probe:ref STABLE · census "
        "MATCH · sitemap 11 routes + robots + manifest 200]: THE WALK "
        "[scripts/walk63-savedreports-dialog-focus-open.ts, the walk53-62 "
        "ledger form over the LIVE arm at BOTH axes: Phase A the OPEN dialog "
        "census — the trigger resting 1216,113 192x36 byte-equal both apps + "
        "the OPEN root 384,240 672x420 + the DFS ledger + the title + the "
        "name input [placeholder byte-equal; the COMPUTED font 14px/400 "
        "line 20px byte-equal — the md:text-sm a CLASS-ORDER genus, the "
        "reference appending it at the chain's end] + the 6-column checkbox "
        "grid [the vocabulary identical: Name/Account/Owner/Value/Stage/"
        "Won Date] + the Current-Filters summary 409,521 622x46 + the "
        "footer Cancel 792,599 81x36 / Save 882,599 149x36 / Close "
        "1023,257 16x16 byte-equal + the mount-focus the input on BOTH; "
        "Phase B the REAL keyboard Tab drive through the OPEN dialog — "
        "the chain STRUCTURALLY IDENTICAL (10 stops: the mount input -> "
        "6 checkboxes -> Cancel -> Close -> the input wrap; the Save NEVER "
        "in the fresh-open chain — disabled buttons are not focusable; the "
        "post-type drive captures its REAL face) + the REAL :focus-visible "
        "faces byte-equal on the VISIBLE layers (the 1px near-black ring); "
        "Phase C the interactive arms — the type-flip + the SAVE round-trip "
        "[dialog closed; the trigger flips Saved Reports (0) -> (1) — the "
        "localStorage crm_saved_reports seam, the browser context "
        "discarding it] + the post-save REOPEN [the L-74c8 name-clear, "
        "byte-equal] + the saved-list arm [the p-3 bg-gray-50 rows + the "
        "Load outline-sm + the bookmark glyph; name + date 10/27/2026 "
        "identical] + the cancel-then-reopen decode [the L-74c7 keep — "
        "Keep Me survives a cancel on both] + the checkbox-toggle ride "
        "[the unchecked faces identical]; Phase D the phone axis 390x844 "
        "[the root 0,184 390x476 + the input 25,287 340x36 at 16px/400 — "
        "the s9 below-md doctrine + the checkbox[0] 25,367 16x16 + the "
        "footer byte-equal]]: ONE LIVE FIND CURED — D-190a1 THE SIX "
        "COLUMN CHECKBOXES' LITERAL ID/FOR CONSTRUCTION [the reference's "
        "checkboxes carry the literal REPORT_COLUMNS keys as ids — "
        "id=\"name\" … id=\"wonDate\", for=\"name\" … for=\"wonDate\" — "
        "live-walked on its DOM; ours shipped React useId ids; the "
        "D-114a2/D-187a1 ids-are-construction-parity doctrine; THE CURE: "
        "id={col.key} at the call site, the component's id ?? generated "
        "seam carrying it to the htmlFor; the re-walk PROVES the id/for "
        "ledger deltas GONE, byte-equal both apps]; every remaining delta "
        "a documented genus [the box-shadow SLOT-COUNT with every VISIBLE "
        "layer byte-equal · the outline VERSION FORM + both sub-forms + the "
        "COLOR-CARRIER sub-form [zero visible pixels on both] · the s129 "
        "ring-offset white zero-extent slot · the token-selection M-81c2 "
        "pairs — border-line/bg-surface/text-ink/muted-ink/line-soft/"
        "neutral-900 vs border-input/bg-background/muted-foreground/"
        "accent/primary, computed-equal on every face · the class-order "
        "genus · the React useId format · the DANGLING aria-describedby "
        "genus [walk54: the reference's own dead pointer, not mirrored] · "
        "our aria-hidden svg superset]; THE TDD LEDGER [the pin survey "
        "first — the s25 saved-reports content regexes + the s68 wide "
        "wiring + the s74 state contracts + the s83 Load outline-sm + the "
        "s123 BLACK-pair + the s10 INPUT_BASE/CHECKBOX.control pins; 3 "
        "born-green pins in the page-layout battery — the walk63 decode "
        "freeze + the Saved-Reports TRIGGER call-site construction freeze "
        "(the genuine gap: the s25 pins hold the wiring regex, never the "
        "trigger's own chain) + the Save-Report-Dialog open-interior "
        "construction freeze (the genuine gap: the content words as "
        "regexes, never the call-site chains) + THE D-190a1 CURE PIN "
        "(RED-first: exactly 1 RED at birth -> the cure -> GREEN)]; "
        "MUTATION-PROOF [the id={col.key} regression replanted -> exactly "
        "1 RED -> restored -> GREEN, no residual] · STASH-PROOF [the "
        "round's block stashed -> exactly 138/2781, the s189 ship state "
        "-> restored -> 138/2785]; the count ladder 2781 -> 2785 (+4) · "
        "SUITES 138 HELD · E2E 192 re-verified · badge 2973 -> 2977 "
        "(count-ladder-190.py: assert-first, idempotent) — session-190, "
        "the Save-Custom-View dialog finally WALKED two-app, the "
        "literal-id doctrine's next member cured ) + beneath it 2781 "
        "unit checks + 192 e2e checks green; the session-189 layer (THE "
        "LEADS SAVED-VIEWS SELECT OPEN FACES + THE CALENDAR MONTH-NAV "
        "ARMS [walk62] — the s189 round"
    )

    # 4) the surgery: demoted block + the new live layer replacing the
    #    old live line
    text = text[:start] + demoted_block + S190_LAYER + text[end:]

    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s189 layer demoted (ship 2781/192 kept); the s190 layer live (2785/192)")

# --- the version bump: frontmatter + the H1 (the F-106a1 lockstep) -----------
OLD_VER = "version: 1.186.0"
NEW_VER = "version: 1.187.0"
OLD_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.186.0)"
NEW_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.187.0)"

text = SKILL.read_text(encoding="utf8")
if NEW_VER in text:
    print("  no-op  [SKILL version] 1.187.0 already live")
else:
    assert text.count(OLD_VER) == 1, "the old frontmatter version not found exactly once"
    assert text.count(OLD_H1) == 1, "the old H1 version not found exactly once"
    SKILL.write_text(text.replace(OLD_VER, NEW_VER).replace(OLD_H1, NEW_H1), encoding="utf8")
    print("  flip   [SKILL version] 1.186.0 -> 1.187.0 (frontmatter + H1)")

# --- last_updated: 2026-10-27 already (the same-day round — held) ------------
text = SKILL.read_text(encoding="utf8")
assert "last_updated: 2026-10-27" in text, "last_updated must read 2026-10-27"
print("  held   [SKILL last_updated] 2026-10-27 (the same-day round)")
