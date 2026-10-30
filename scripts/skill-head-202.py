#!/usr/bin/env python3
"""skill-head-202.py — the SKILL frontmatter head surgery (the s202 layer).

The L-169c3 form: the verified-single guard. The demoted s201 layer keeps
its SHIP-TIME counts (2832/217) in its own comment block (the s171-fix
precedent). Idempotent: a re-run is a verified no-op. Also bumps the
frontmatter version (1.198.0 -> 1.199.0) + the H1 lockstep (the s197
exact-H1 guard form) + last_updated (stays 2026-10-30 — both rounds the
same date, the no-op arm).

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live s201
line still carries its ship count (2832/217), so the demotion is a
verbatim move, and the count-ladder-202.py run that follows flips only
the OTHER doc sites. The retired blocks stay UNTOUCHED.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S202_MARKER = "project_state: 2837 unit checks + 223 e2e checks green; the session-202 layer ("

if S202_MARKER in text:
    print("  no-op  [SKILL head] the s202 layer already live")
else:
    LIVE_MARKER = "project_state: 2832 unit checks + 217 e2e checks green; the session-201 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s201 head marker found {live_count} times"

    # 1) extract the live s201 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s201 layer keeps its ship counts (2832/217)
    #    in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-201 layer (comment-demoted at session-202 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198/\n"
        "     s199/s200 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s202 live layer — the a11y register's login-card
    #     client-state coverage audit (the three view states + the
    #     spec's own surface-blind criterion claim)
    S202_LAYER = (
        "project_state: 2837 unit checks + 223 e2e checks green; the session-202 layer "
        "(THE A11Y REGISTER'S LOGIN-CARD CLIENT-STATE COVERAGE AUDIT — the post-201 "
        "audit round [the rotation trigger THE OWNER'S NEWEST COMMIT 35b2c97: the "
        "session_425 transcript — the s201 round's own execution record; the baseline "
        "gate GREEN at the exact s201 ship state: lint 0/0 · tsc 0 · 138/2832 unit · "
        "probe:ref STABLE at 46bc2d9c (the bundle md5 unchanged, the demo data still "
        "ZERO) · db census MATCH (15/24/10/23/12 + 4 users at <repo>/db/custom.db)]: "
        "the discovery legs — the standing data-gated re-checks ALL KILLED at the "
        "reference's unchanged zero-data state (the discover-184..202 standing "
        "census) · the conditional gates KILLED (probe:ref STABLE kills the "
        "fresh-bundle re-derivation; the registry's latest recharts 3.10.1 kills "
        "the 4.0 gate) · the s120-era re-walk kill STANDING (the leads family "
        "source-frozen since s113 [89 sessions], the deps locked, the bundle "
        "STABLE) · the pre-ship audit duty CLEAN against the s198 triple pins "
        "(bun audit 9: 4h/4m/1l exactly — no drift; the dormancy .html(=0 "
        "re-verified); THE ROUND'S MATERIAL — the s201 close's banked standing "
        "candidate taken: the register's live census 55 registrations (33 "
        "page-family + 22 dialog-open + ZERO client-state view) while the login "
        "card's view machine (src/lib/login-reset.ts: signin | reset | sent | "
        "signup | verify) renders WHOLE-CARD DOM surfaces no resting scan ever "
        "sees — THE SURFACE-BLIND GENUS (the register's own head criterion "
        "claims 'one test() per surface x width' but its STATE axis was never "
        "adjudicated against the machine's inventory: 3 whole-card view states "
        "carrying zero registrations at ANY width, no pin cross-reading the "
        "union); the discovery's LIVE axe probes verified every state at BOTH "
        "widths (6/6 structural=0 with the view-sentinel h2 guards — the "
        "L-164c2 form; zero contrast flags — the views' slate-on-white passes "
        "AA unassisted) + the mutation-candidate decoded live (the verify "
        "view's six code inputs: the aria-label 'Digit N' the ONLY accessible "
        "name — no wired label, no placeholder, no title; the "
        "client-state name-evaporation genus NO existing registration can "
        "see) + the richer-face decode (the sent view's demo-email ride "
        "renders the resetUrl anchor — the in-app delivery, the s200 "
        "reset-password precedent): TWO CURES — D-202a1 THE REGISTER'S "
        "CLIENT-STATE COVERAGE [+6 e2e registrations at BOTH widths (the "
        "open-state form with the VIEW-SENTINEL h2 open-wait guards — the "
        "L-164c2 vacuous-green cure): the reset view (the 'Forgot password?' "
        "swap) x2 + the sent view (the demo-email 'Send reset link' POST — "
        "the no-enumeration 200 + the resetUrl anchor, the richer face) x2 + "
        "the verify view (the in-card 'Need an account?' signup ladder on a "
        "throwaway email — the s163 in-app OTP delivery) x2 + THE PINS in "
        "the dialog-controls suite (the one-suite doctrine): the containment "
        "pair + the client-state census pin (six, live-read) — RED-first at "
        "birth (exactly 5 RED, zero collateral) -> the registrations -> "
        "born-green (6/6 the first run; the full spec 62 passed); "
        "MUTATION-PROVEN: the planted aria-label removal on the verify "
        "view's code inputs -> BOTH verify-view registrations RED exactly "
        "at the axe label rule (the six nameless inputs; the rides still "
        "complete — the sentinel is the heading, the SCAN catches the "
        "genus) -> EVERY other registration GREEN (the /login page "
        "registrations scan the signin view; the dialog families never "
        "reach the login card — the register's surface-blindness, the "
        "round's own rationale) -> restored -> GREEN] · D-202a2 THE "
        "SPEC'S OWN SURFACE-BLIND CRITERION CLAIM [the head criterion "
        "surface-blind since the register's s171 birth for the "
        "client-state genus — the state axis never adjudicated, never "
        "pinned; THE CURE: the client-state family registered (the "
        "criterion TRUE on the state axis for every family) + the pin "
        "pair: the state-machine census (every LoginView state the "
        "machine names rides the two-gate somewhere — the live "
        "cross-read of the src/lib/login-reset.ts union against the "
        "register's labels: a future view state added to the machine "
        "without its registration trips it) + the state-pair census "
        "(every view-state registration carries its width twin + the "
        "family's live count equals the machine's un-page-registered "
        "state count) — RED-first at birth -> the registrations -> "
        "GREEN; MUTATION-PROVEN: the planted phone verify-twin removal "
        "trips the state-pair census + the containment-b + the "
        "client-state census (exactly 3 RED; the state-machine census "
        "stays GREEN by design — the state axis holds via the desktop "
        "twin, the correct state/width division of labor) -> restored "
        "-> GREEN]; THE REQUIRED TEST-SIDE RE-ANCHOR: the s200 (g) "
        "page-family census pin re-anchored to subtract BOTH non-page "
        "families (total minus dialog-open minus view-state = 33 — the "
        "s201 (e) re-anchor precedent, the live read moving with the "
        "register); DECLINED (recorded considered-and-declined in the "
        "plan): the reset-password no-token card state (the "
        "same-component adjudication — the s200 posture stands) · the "
        "landing page's client-state arms (the FAQ open-item switch + "
        "the mobile disclosure menu — the marketing batteries hold the "
        "wiring; the round's genus is the login card's whole-column "
        "view swaps) · the signup view's in-card registration at /login "
        "(the same-component adjudication — the /signup page "
        "registration scans the identical DOM, the s199 Edit "
        "Event/Activity precedent); THE COUNT LADDER UNIT 2832 -> 2837 "
        "(+5: the dialog-controls session-202 describes — the "
        "containment pair + the client-state census + the state-machine "
        "census + the state-pair census) · SUITES 138 HELD (the "
        "one-suite doctrine) · E2E 217 -> 223 (+6: the six view-state "
        "registrations; the Appendix B a11y row re-anchored 55 -> 61) · "
        "badge 3049 -> 3060 (the unit+e2e arithmetic: 2837+223) + "
        "skill-head-202.py (this surgery — the SKILL v1.199.0, the "
        "s201 layer comment-demoted at its ship counts 2832/217, the "
        "s202 layer live at 2837/223, idempotent) + "
        "count-ladder-202.py (assert-first, idempotent, unique-anchor) "
        "+ the test-side re-anchors in the same stroke (the docs-counts "
        "layer-axis: first = s202, second = s201 at its ship 2832/217 · "
        "the unit negatives ladder: the retired 2832 site-forms join "
        "the negatives · the login-family E2E ladder: the retired E2E "
        "217 form joins its negatives, the live positive re-anchored "
        "223 · the dialog-geometry-parity F-92a3 ladder: the four CLAUDE "
        "live positives re-anchored 2837 + the 2832 forms join the "
        "negatives) + the docs lockstep (the AGENTS Session-202 section "
        "· docs/session_426.md · the PAD §7.1 s202 inventory row + the "
        "§11 a11y + dialog-controls rows · the README walk-contracts "
        "paragraph's s202 clause · the plan's execution record + the "
        "worklog entry {Task ID 202}) + the captures 660+ (the round's "
        "client-state pair ours+ref at the desktop axis — the reset "
        "view, the walk65-walked member — + the dev-server set: the "
        "three view states at both widths + the mobile drawer-open "
        "face + the dashboard) + beneath it 2832 unit checks + 217 "
        "e2e checks green; the session-201 layer (THE A11Y REGISTER'S "
        "PHONE-WIDTH DIALOG-OPEN COVERAGE AUDIT — the eleven phone "
        "registrations + the width-true criterion; the count ladder "
        "2827 -> 2832 · E2E 206 -> 217 · badge 3033 -> 3049 + the "
        "docs lockstep + the captures 646-659))"
    )

    # 4) splice: the demoted block replaces the live line, the new layer
    #    lands right after it (the house head form)
    text = text.replace(live_line, demoted_block + S202_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s202 layer live at 2837/223")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.199.0" not in t:
    assert t.count("version: 1.198.0") == 1, "the 1.198.0 frontmarker not unique"
    t = t.replace("version: 1.198.0", "version: 1.199.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.198.0 -> 1.199.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.199.0")

t = SKILL.read_text(encoding="utf8")
# the exact-H1 guard (the s197 live catch hardened into the form):
OLD_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.198.0)"
NEW_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.199.0)"
if OLD_H1 not in t:
    print("  no-op  [SKILL H1] version already v1.199.0")
else:
    assert t.count(OLD_H1) == 1, "the v1.198.0 H1 not unique"
    t = t.replace(OLD_H1, NEW_H1, 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL H1] v1.198.0 -> v1.199.0")

t = SKILL.read_text(encoding="utf8")
if "last_updated: 2026-10-30" not in t:
    assert t.count("last_updated: 2026-10-29") >= 1, "the 2026-10-29 last_updated not found"
    t = t.replace("last_updated: 2026-10-29", "last_updated: 2026-10-30", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL last_updated] 2026-10-29 -> 2026-10-30")
else:
    print("  no-op  [SKILL last_updated] already 2026-10-30")

print("skill-head-202.py done")
