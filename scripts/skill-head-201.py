#!/usr/bin/env python3
"""skill-head-201.py — the SKILL frontmatter head surgery (the s201 layer).

The L-169c3 form: the verified-single guard. The demoted s200 layer keeps
its SHIP-TIME counts (2827/206) in its own comment block (the s171-fix
precedent). Idempotent: a re-run is a verified no-op. Also bumps the
frontmatter version (1.197.0 -> 1.198.0) + the H1 lockstep (the s197
exact-H1 guard form) + last_updated (stays 2026-10-30 — both rounds the
same date, the no-op arm).

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live s200
line still carries its ship count (2827/206), so the demotion is a
verbatim move, and the count-ladder-201.py run that follows flips only
the OTHER doc sites. The retired blocks stay UNTOUCHED.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S201_MARKER = "project_state: 2832 unit checks + 217 e2e checks green; the session-201 layer ("

if S201_MARKER in text:
    print("  no-op  [SKILL head] the s201 layer already live")
else:
    LIVE_MARKER = "project_state: 2827 unit checks + 206 e2e checks green; the session-200 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s200 head marker found {live_count} times"

    # 1) extract the live s200 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s200 layer keeps its ship counts (2827/206)
    #    in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-200 layer (comment-demoted at session-201 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198/\n"
        "     s199 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s201 live layer — the a11y register's phone-width
    #    dialog-open coverage audit (the eleven phone states + the
    #    spec's own width-blind criterion claim)
    S201_LAYER = (
        "project_state: 2832 unit checks + 217 e2e checks green; the session-201 layer "
        "(THE A11Y REGISTER'S PHONE-WIDTH DIALOG-OPEN COVERAGE AUDIT — the post-200 "
        "audit round [the rotation trigger THE OWNER'S NEWEST COMMIT 0e78b16: the "
        "session_423 transcript — the s200 round's own execution record; the baseline "
        "gate GREEN at the exact s200 ship state: lint 0/0 · tsc 0 · 138/2827 unit · "
        "probe:ref STABLE at 46bc2d9c (the bundle md5 unchanged, the demo data still "
        "ZERO) · db census MATCH (15/24/10/23/12 + 4 users at <repo>/db/custom.db)]: "
        "the discovery legs — the standing data-gated re-checks ALL KILLED at the "
        "reference's unchanged zero-data state (the discover-184..201 standing "
        "census) · the conditional gates KILLED (probe:ref STABLE kills the "
        "fresh-bundle re-derivation; the registry's latest recharts 3.10.1 kills "
        "the 4.0 gate) · the s120-era re-walk kill STANDING (the leads family "
        "source-frozen since s113 [88 sessions], the deps locked, the bundle "
        "STABLE) · the pre-ship audit duty CLEAN against the s198 triple pins "
        "(bun audit 9: 4h/4m/1l exactly — no drift; the dormancy .html(=0 "
        "re-verified); THE ROUND'S MATERIAL — the s200 close's banked standing "
        "candidate taken: the register's dialog-open family is DESKTOP-only (11 "
        "registrations, 0 at phone) while the register's own head criterion "
        "claims 'one test() per surface x width' — THE WIDTH-BLIND GENUS (the "
        "s199a2 re-anchor WORDED a criterion the register never satisfied for "
        "the dialog family: born false at s199, held through s200, no pin "
        "holding it); the discovery's LIVE axe probes re-verified every phone "
        "state (11/11 structural=0 at 390x844 with the visible-dialog guard; "
        "every contrast flag citing an existing sanctioned matcher — the "
        "quick-log bg-emerald-600 · the accounts badge/border family · the "
        "calendar text-gray-400 · the -trigger- segmented pair) + the "
        "mutation-candidate decoded live (the contacts Import trigger: the "
        "hidden-sm:inline span computes display:none at 390 — the aria-label "
        "is the ONLY name at phone; display:block at 1280 — the desktop "
        "register is WIDTH-BLIND to the genus): TWO CURES — D-201a1 THE "
        "REGISTER'S PHONE-WIDTH DIALOG-OPEN COVERAGE [+11 e2e registrations at "
        "390x844 (the s199 open-state form: open -> the VISIBLE-DIALOG "
        "open-wait guard -> scanTwoGate -> Escape): the five create dialogs + "
        "the six edit/standalone states (Edit Contact · Edit Lead · Edit "
        "Account · Import · Insights · Save-Report) + THE PINS in the "
        "dialog-controls suite (the one-suite doctrine): the containment pair "
        "+ the phone-width census pin (eleven, live-read) — RED-first at "
        "birth (exactly 5 RED incl. the s199 (e) census re-anchor eleven -> "
        "twenty-two, zero collateral) -> the registrations -> born-green "
        "(11/11 the first run); MUTATION-PROVEN: the planted aria-label "
        "removal on the contacts Import trigger (the hidden-sm:inline genus) "
        "-> the NEW phone Import registration RED (the role-based opener — "
        "the nameless trigger is UNFINDABLE by name at phone) + the standing "
        "phone /contacts page registration RED (the axe button-name rule) "
        "-> EVERY desktop registration GREEN (the visible span carries the "
        "name at 1280) -> restored -> GREEN] · D-201a2 THE SPEC'S OWN "
        "WIDTH-BLIND CRITERION CLAIM [the head criterion ('one test() per "
        "surface x width') born false at s199 — the dialog family carried "
        "one width — and never pinned; THE CURE: the phone family registered "
        "(the criterion TRUE for every family) + the pin pair: the width-pair "
        "census (every desktop dialog registration carries its phone twin, "
        "live-read) + the criterion-form pair (the xwidth criterion is the "
        "live face + the width-blind 'per surface' form never returns) — "
        "RED-first at birth -> the registrations -> GREEN; MUTATION-PROVEN: "
        "the planted phone-twin removal trips the width-pair census + the "
        "containence + the census pins (4 RED) -> restored -> GREEN]; THE "
        "LIVE CATCH (the mutation landscape decoded): while a Radix Dialog "
        "is open, hideOthers aria-hides the app root — GATE 1 (structural) "
        "sees ONLY the dialog content, GATE 2 (color-contrast) still cites "
        "the PAINTED page behind (the visual rule's applicability is "
        "on-screen visibility) — the open-dialog scan mechanics documented "
        "in the spec's s201 family comment; DECLINED (recorded "
        "considered-and-declined in the plan): the Edit Event + Edit "
        "Activity edit modes at phone (the same-component adjudication "
        "carried to the width axis) · the login card's in-card view states "
        "at phone (the client-state genus) · the drawer-open state at "
        "desktop (the width-inverse — the drawer renders at PHONE only); "
        "THE COUNT LADDER UNIT 2827 -> 2832 (+5: the dialog-controls "
        "session-201 describes — the containment pair + the phone census + "
        "the width-pair census + the criterion pair) · SUITES 138 HELD "
        "(the one-suite doctrine) · E2E 206 -> 217 (+11: the eleven phone "
        "registrations; the Appendix B a11y row re-anchored 44 -> 55) · "
        "badge 3033 -> 3049 (the unit+e2e arithmetic: 2832+217) + "
        "skill-head-201.py (this surgery — the SKILL v1.198.0, the s200 "
        "layer comment-demoted at its ship counts 2827/206, the s201 layer "
        "live at 2832/217, idempotent) + count-ladder-201.py (assert-first, "
        "idempotent, unique-anchor) + the test-side re-anchors in the same "
        "stroke (the docs-counts layer-axis: first = s201, second = s200 "
        "at its ship 2827/206 · the unit negatives ladder: the retired "
        "2827 site-forms join the negatives · the login-family negatives "
        "ladder: the retired E2E 206 form joins its negatives, the live "
        "positive re-anchored 217 · the dialog-geometry-parity F-92a3 "
        "ladder: the four CLAUDE live positives re-anchored 2832 + the "
        "2827 forms join the negatives) + the docs lockstep (the AGENTS "
        "Session-201 section · docs/session_424.md · the PAD §7.1 s201 "
        "inventory row + the §11 a11y + dialog-controls rows · the README "
        "walk-contracts paragraph's s201 clause · the plan's execution "
        "record + the worklog entry {Task ID 201}) + the captures 646+ "
        "(the round's phone dialog pair ours+ref at the 390x844 axis — "
        "the round's own width — + the dev-server set: the eleven phone "
        "dialog-open states + the mobile drawer-open face + the "
        "dashboard) + beneath it 2827 unit checks + 206 e2e checks "
        "green; the session-200 layer (THE A11Y REGISTER'S PAGE-SURFACE "
        "COVERAGE AUDIT — the three un-registered page surfaces "
        "registered at both widths + the spec's stale anon-family claim "
        "cured [the count-proof NAME form + the negative pair]; the "
        "count ladder 2822 -> 2827 · E2E 200 -> 206 · badge 3022 -> "
        "3033 + the docs lockstep + the captures 637-645))"
    )

    # 4) splice: the demoted block replaces the live line, the new layer
    #    lands right after it (the house head form)
    text = text.replace(live_line, demoted_block + S201_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s201 layer live at 2832/217")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.198.0" not in t:
    assert t.count("version: 1.197.0") == 1, "the 1.197.0 frontmarker not unique"
    t = t.replace("version: 1.197.0", "version: 1.198.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.197.0 -> 1.198.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.198.0")

t = SKILL.read_text(encoding="utf8")
# the exact-H1 guard (the s197 live catch hardened into the form):
OLD_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.197.0)"
NEW_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.198.0)"
if OLD_H1 not in t:
    print("  no-op  [SKILL H1] version already v1.198.0")
else:
    assert t.count(OLD_H1) == 1, "the v1.197.0 H1 not unique"
    t = t.replace(OLD_H1, NEW_H1, 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL H1] v1.197.0 -> v1.198.0")

t = SKILL.read_text(encoding="utf8")
if "last_updated: 2026-10-30" not in t:
    assert t.count("last_updated: 2026-10-29") >= 1, "the 2026-10-29 last_updated not found"
    t = t.replace("last_updated: 2026-10-29", "last_updated: 2026-10-30", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL last_updated] 2026-10-29 -> 2026-10-30")
else:
    print("  no-op  [SKILL last_updated] already 2026-10-30")

print("skill-head-201.py done")
