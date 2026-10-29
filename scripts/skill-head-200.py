#!/usr/bin/env python3
"""skill-head-200.py — the SKILL frontmatter head surgery (the s200 layer).

The L-169c3 form: the verified-single guard. The demoted s199 layer keeps
its SHIP-TIME counts (2822/200) in its own comment block (the s171-fix
precedent). Idempotent: a re-run is a verified no-op. Also bumps the
frontmatter version (1.196.0 -> 1.197.0) + the H1 lockstep (the s197
exact-H1 guard form) + last_updated (2026-10-29 -> 2026-10-30).

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live s199
line still carries its ship count (2822/200), so the demotion is a
verbatim move, and the count-ladder-200.py run that follows flips only
the OTHER doc sites. The retired blocks stay UNTOUCHED.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S200_MARKER = "project_state: 2827 unit checks + 206 e2e checks green; the session-200 layer ("

if S200_MARKER in text:
    print("  no-op  [SKILL head] the s200 layer already live")
else:
    LIVE_MARKER = "project_state: 2822 unit checks + 200 e2e checks green; the session-199 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s199 head marker found {live_count} times"

    # 1) extract the live s199 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s199 layer keeps its ship counts (2822/200)
    #    in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-199 layer (comment-demoted at session-200 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198\n"
        "     layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s200 live layer — the a11y register's page-surface
    #    coverage audit (the three un-registered page surfaces + the
    #    spec's own stale anon-family claim)
    S200_LAYER = (
        "project_state: 2827 unit checks + 206 e2e checks green; the session-200 layer "
        "(THE A11Y REGISTER'S PAGE-SURFACE COVERAGE AUDIT — the post-199 audit round "
        "[the rotation trigger THE OWNER'S NEWEST COMMIT 17ea4a4: the session_421 "
        "transcript — the s199 round's own execution record; the baseline gate GREEN "
        "at the exact s199 ship state: lint 0/0 · tsc 0 · 138/2822 unit · probe:ref "
        "STABLE at 46bc2d9c (the bundle md5 unchanged, the demo data still ZERO) · "
        "db census MATCH (15/24/10/23/12 + 4 users at <repo>/db/custom.db)]: the "
        "discovery legs — the standing data-gated re-checks ALL KILLED at the "
        "reference's unchanged zero-data state (the discover-184..200 standing "
        "census) · the conditional gates KILLED (probe:ref STABLE kills the "
        "fresh-bundle re-derivation; the registry's latest recharts 3.10.1 kills "
        "the 4.0 gate) · the s120-era re-walk kill STANDING (the leads family "
        "source-frozen since s113 [87 sessions], the deps locked, the bundle "
        "STABLE) · the pre-ship audit duty CLEAN against the s198 triple pins "
        "(bun audit 9: 4h/4m/1l exactly — no drift); THE ROUND'S MATERIAL — the "
        "s197/s199 pattern applied to the register's OTHER family: the PAGE "
        "SURFACES (the s199 round closed the dialog-open family; the page family "
        "is the other arm) — the register's live census 38 registrations (27 "
        "page-family + 11 dialog-open) vs the app's 16-surface renderable route "
        "inventory: THREE page surfaces carried ZERO a11y teeth at any width — "
        "/about + /contact (the authenticated marketing interiors: two-app-"
        "renderable, login-walled per the s147 reference posture, walked at "
        "s193/walk66 but never axe-scanned) + /reset-password (the OURS-ONLY "
        "anon surface, the /signup registration precedent; the s163 digma port) "
        "+ the spec's own anon-family describe head still claimed 'The three "
        "anon surfaces (login/signup/landing)' — STALE SINCE s195 (the 404 x2 "
        "joined that very describe without the count moving; the s197a2/s199a2 "
        "stale-census pattern INSIDE the spec file); the discovery's LIVE axe "
        "probes pre-verified every surface at both widths (GATE 1 structural=0 "
        "+ GATE 2 zero contrast flags) + the REFERENCE's own /About + /Contact "
        "probed (THE LIVE CATCH: its marketing pages carry TWO NAMELESS "
        "icon-only buttons at desktop — its topbar's Messages + Notifications, "
        "button-name on ITS DOM; OURS renders the same arms NAMED: the "
        "drawer-precedent direction, the reference's own defect, never mirrored) "
        "+ the 11 phone-width dialog-open states probed ALL born-green (the "
        "width-scope census — the standing next-round candidate): TWO CURES — "
        "D-200a1 THE REGISTER'S PAGE-SURFACE COVERAGE [+6 e2e registrations at "
        "BOTH widths (the s171 page-family form: setViewport -> goto -> "
        "scanTwoGate): the /about + /contact authenticated pair (the default "
        "storageState, the CRM-page idiom) + the /reset-password anon pair "
        "(the describe's storageState opt-out, the set-password FORM state via "
        "the shape-probe token) + THE PINS in the dialog-controls suite (the "
        "one-suite doctrine): the containment pair + the page-surface register "
        "census pin (thirty-three page-family registrations, live-read) — "
        "RED-first at birth (5 RED, zero collateral) -> the registrations -> "
        "born-green (6/6 the first run); MUTATION-PROVEN: the planted {label} "
        "removal inside the SocialLink anchor (contact/page.tsx — the three "
        "social links become nameless icon links; no existing pin holds the "
        "label child, the walk66 pins hold href/target/rel only) -> BOTH new "
        "/contact registrations RED exactly at the link-name rule (citing the "
        "linkedin/x/github anchors) -> restored -> GREEN] · D-200a2 THE SPEC'S "
        "OWN STALE ANON-FAMILY CLAIM [the describe head re-anchored to the "
        "count-proof NAME form ('The anon family, both widths' — a name never "
        "goes stale when a surface joins; the s197a2/s199a2 doctrine) + THE "
        "PINS: the negative pair (the retired count-anchored form never "
        "returns + the NAME form is the live face) — RED-first at birth -> "
        "the comment cure -> GREEN; MUTATION-PROVEN: the stale re-plant trips "
        "BOTH arms of the pin pair -> restored -> GREEN; THE LIVE CATCH: the "
        "negative pin's first draft (a bare \\d+ regex) was fooled by the "
        "spelled-out count word — the s171 head carries 'three' the WORD, not "
        "the digit; the \\w+ form catches both spellings]; DECLINED (recorded "
        "considered-and-declined in the plan): the phone-width dialog-open "
        "registrations (11 states — the width-scope arm, born-green "
        "pre-verified this round, the STANDING NEXT-ROUND CANDIDATE with its "
        "pre-verification banked) · the reset-password no-token card state "
        "(the same-component adjudication — the shared ResetPasswordScreen, "
        "the form state the richer face) · the login card's in-card view "
        "states (the client-state genus; the s192 walk65 cures + the "
        "login-views/login-reset batteries hold the wiring); THE COUNT LADDER "
        "UNIT 2822 -> 2827 (+5: the dialog-controls session-200 describes — "
        "the containment pair + the page-family census pin + the count-proof "
        "negative pair) · SUITES 138 HELD (the one-suite doctrine) · E2E 200 "
        "-> 206 (+6: the six registrations; the Appendix B a11y row "
        "re-anchored 38 -> 44) · badge 3022 -> 3033 (the unit+e2e arithmetic: "
        "2827+206) + skill-head-200.py (this surgery — the SKILL v1.197.0, "
        "the s199 layer comment-demoted at its ship counts 2822/200, the "
        "s200 layer live at 2827/206, idempotent) + count-ladder-200.py "
        "(assert-first, idempotent, unique-anchor) + the test-side "
        "re-anchors in the same stroke (the docs-counts layer-axis: "
        "first = s200, second = s199 at its ship 2822/200 · the unit "
        "negatives ladder: the retired 2822 site-forms join the negatives · "
        "the login-family negatives ladder: the retired E2E 200 form joins "
        "its negatives, the live positive re-anchored 206 · the "
        "dialog-geometry-parity F-92a3 ladder: the four CLAUDE live "
        "positives re-anchored 2827 + the 2822 forms join the negatives) + "
        "the docs lockstep (the AGENTS Session-200 section · "
        "docs/session_422.md · the PAD §7.1 s200 inventory row + the §11 "
        "a11y + dialog-controls rows · the README walk-contracts "
        "paragraph's s200 clause · the plan's execution record + the "
        "worklog entry {Task ID 200}) + the captures 637+ (the round's "
        "/contact pair ours+ref at the desktop axis — the two-app-"
        "renderable registered surface — + the dev-server set: the three "
        "newly-registered surfaces at both widths + the mobile drawer-open "
        "face + the dashboard) + beneath it 2822 unit checks + 200 e2e "
        "checks green; the session-199 layer (THE A11Y REGISTER'S "
        "DIALOG-OPEN COVERAGE AUDIT — the five un-registered open states "
        "registered [Edit Lead + Edit Account + Import + Insights + "
        "Save-Report, each with the visible-dialog open-wait guard] + the "
        "spec's stale registration-count claim cured [the count-proof NAME "
        "form + the negative pair]; the count ladder 2817 -> 2822 · badge "
        "3012 -> 3022 + the docs lockstep + the captures 629-636))"
    )

    # 4) splice: the demoted block replaces the live line, the new layer
    #    lands right after it (the house head form)
    text = text.replace(live_line, demoted_block + S200_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s200 layer live at 2827/206")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.197.0" not in t:
    assert t.count("version: 1.196.0") == 1, "the 1.196.0 frontmarker not unique"
    t = t.replace("version: 1.196.0", "version: 1.197.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.196.0 -> 1.197.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.197.0")

t = SKILL.read_text(encoding="utf8")
# the exact-H1 guard (the s197 live catch hardened into the form):
OLD_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.196.0)"
NEW_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.197.0)"
if OLD_H1 not in t:
    print("  no-op  [SKILL H1] version already v1.197.0")
else:
    assert t.count(OLD_H1) == 1, "the v1.196.0 H1 not unique"
    t = t.replace(OLD_H1, NEW_H1, 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL H1] v1.196.0 -> v1.197.0")

t = SKILL.read_text(encoding="utf8")
if "last_updated: 2026-10-30" not in t:
    assert t.count("last_updated: 2026-10-29") >= 1, "the 2026-10-29 last_updated not found"
    t = t.replace("last_updated: 2026-10-29", "last_updated: 2026-10-30", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL last_updated] 2026-10-29 -> 2026-10-30")
else:
    print("  no-op  [SKILL last_updated] already 2026-10-30")

print("skill-head-200.py done")
