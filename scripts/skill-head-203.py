#!/usr/bin/env python3
"""skill-head-203.py — the SKILL frontmatter head surgery (the s203 layer).

The L-169c3 form: the verified-single guard. The demoted s202 layer keeps
its SHIP-TIME counts (2837/223) in its own comment block (the s171-fix
precedent). Idempotent: a re-run is a verified no-op. Also bumps the
frontmatter version (1.199.0 -> 1.200.0) + the H1 lockstep (the s197
exact-H1 guard form) + last_updated (2026-10-30 -> 2026-10-31).

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live s202
line still carries its ship count (2837/223), so the demotion is a
verbatim move, and the count-ladder-203.py run that follows flips only
the OTHER doc sites. The retired blocks stay UNTOUCHED.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S203_MARKER = "project_state: 2841 unit checks + 226 e2e checks green; the session-203 layer ("

if S203_MARKER in text:
    print("  no-op  [SKILL head] the s203 layer already live")
else:
    LIVE_MARKER = "project_state: 2837 unit checks + 223 e2e checks green; the session-202 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s202 head marker found {live_count} times"

    # 1) extract the live s202 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s202 layer keeps its ship counts (2837/223)
    #    in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-202 layer (comment-demoted at session-203 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198/\n"
        "     s199/s200/s201 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s203 live layer — the a11y register's landing-page
    #     client-state coverage audit + the standing duty's audit-census
    #     drift (the marketing-state arms + the minimatch re-triage)
    S203_LAYER = (
        "project_state: 2841 unit checks + 226 e2e checks green; the session-203 layer "
        "(THE A11Y REGISTER'S LANDING-PAGE CLIENT-STATE COVERAGE AUDIT + THE STANDING "
        "DUTY'S AUDIT-CENSUS DRIFT — the post-202 audit round [the rotation trigger "
        "THE OWNER'S NEWEST COMMIT 549e5d2: the session_427 transcript — the s202 "
        "round's own execution record; the baseline gate GREEN at the exact s202 "
        "ship state: lint 0/0 · tsc 0 · 138/2837 unit · db census MATCH "
        "(15/24/10/23/12 + 4 users at <repo>/db/custom.db) · probe:ref STABLE at "
        "46bc2d9c]: the discovery legs — the standing data-gated re-checks ALL "
        "KILLED at the reference's unchanged zero-data state (the "
        "discover-184..203 standing census) · the conditional gates KILLED "
        "(probe:ref STABLE kills the fresh-bundle re-derivation; the registry's "
        "latest recharts 3.10.1 kills the 4.0 gate) · the s120-era re-walk kill "
        "STANDING (the leads family source-frozen since s113 [90 sessions], the "
        "deps locked, the bundle STABLE) · THE PRE-SHIP AUDIT DUTY DRIFT — THE "
        "ROUND'S SECOND MATERIAL (bun audit re-run live: 10 advisories [4 high / "
        "5 moderate / 1 low] vs the s198-pinned census 9 [4h/4m/1l] — the NEW "
        "moderate GHSA-g3hv-75wg-m249 on minimatch <11.0.1, 'potential denial "
        "of service via globparts amplification', riding the DEV-TOOLCHAIN "
        "eslint family [eslint>@eslint/eslintrc>minimatch + "
        "eslint-config-next>typescript-eslint>typescript-estree>minimatch] — "
        "lint-time transitive only, zero runtime exposure, the exact genus of "
        "the other nine; the dormancy .html(=0 re-verified); THE ROUND'S "
        "PRIMARY MATERIAL — THE S202 CLOSE'S BANKED STANDING CANDIDATE TAKEN: "
        "the register's live census 61 registrations [33 page-family + 22 "
        "dialog-open + 6 client-state view + ZERO marketing client-state] "
        "while the PUBLIC landing surface carries exactly TWO client-state "
        "machines whose non-resting states render DOM the resting / "
        "registration never sees — THE MARKETING-STATE GENUS (the register's "
        "own head criterion claims 'one test() per surface x width' but the "
        "landing surface's machines [LandingHeader's menuOpen + Faq's "
        "openIndex] were never adjudicated against the register and no pin "
        "cross-reads them — the s202a2 state-axis doctrine's marketing arm): "
        "the mobile disclosure menu's OPEN panel (a whole-panel MOUNT of 6 "
        "link controls at phone width only — the md:hidden width-inverse, "
        "the drawer-genus sibling on the marketing surface; the header div "
        "count 2 -> 3 on open, the mount/unmount construction) + the FAQ's "
        "non-default open-item states (the answer <p> of an item whose "
        "resting state is closed, mounted while the resting Q1 answer "
        "unmounts); the discovery's LIVE axe probes verified every arm "
        "(3/3 structural=0 — the FAQ non-default state [the Q6 ride, the "
        "maximal-distance member] at BOTH widths + the menu-open state at "
        "phone; every contrast flag citing a sanctioned matcher) + the "
        "mutation-candidate decoded live (the mobile menu toggle's "
        "aria-label 'Toggle navigation' the ONLY accessible name — an "
        "ICON-ONLY md:hidden button: the Menu/X svg, no text, no wired "
        "label, no title; the s201 contacts Import trigger genus's md:hidden "
        "sibling) + the FAQ state decoded (the open-answer TEXT-ONLY — "
        "controls=0; the non-default state's unique surfaces the Q6 answer "
        "mounted + the Q1 face closed): THREE CURES — D-203a1 THE "
        "REGISTER'S MARKETING CLIENT-STATE COVERAGE [+3 e2e registrations "
        "(the anon-family form): the desktop + phone FAQ non-default open "
        "states (the Q6 ride with the L-164c2 SENTINEL PAIR: #faq-answer-5 "
        "visible + #faq-answer-0 hidden — the single-open invariant, the "
        "state the registration claims to scan) + the phone mobile menu "
        "OPEN state (the toggle ride -> the div.md:hidden.border-t panel "
        "mount + its unique Preview link — the only Preview link visible "
        "at 390) + THE PINS in the dialog-controls suite (the one-suite "
        "doctrine): the containment pair + the marketing client-state "
        "census (three, live-read) + the FAQ width-pair census + the menu "
        "arm's phone-only NEGATIVE (the width-inverse doctrine: a desktop "
        "menu twin never appears) — RED-first at birth (exactly 4 RED, "
        "zero collateral) -> the registrations -> born-green (3/3 the "
        "first run; the full scoped spec 65 passed); MUTATION-PROVEN: the "
        "planted aria-label removal on the landing menu toggle -> the NEW "
        "menu-open registration RED at its role-based opener (the nameless "
        "trigger unfindable by name — the s201 Import-opener form) + the "
        "NEW phone FAQ registration RED + the STANDING phone / landing "
        "registration RED exactly at the axe button-name rule (.md:hidden) "
        "-> EVERY desktop registration GREEN (the toggle computes "
        "display:none at >=md — the width-blindness proof, the round's own "
        "rationale) -> restored -> GREEN] · D-203a2 THE CRITERION'S "
        "MARKETING-STATE PIN PAIR [no pin cross-read the landing surface's "
        "client-state machines against the register — the s202a2 "
        "state-machine census holds the LOGIN machine only; THE CURE: the "
        "marketing family registered (the criterion TRUE for the landing "
        "surface's every client-state arm) + the pin pair (the (m) "
        "describe); MUTATION-PROVEN: the planted phone FAQ-twin removal "
        "trips the width-pair census + the containment-a + the census "
        "(exactly 3 RED; the (g) census GREEN by design — the total and "
        "the family count drop together) -> restored -> GREEN (38/38)] · "
        "D-203a3 THE STANDING DUTY'S AUDIT-CENSUS DRIFT (the s198 "
        "D-198a2 doctrine re-applied — the PAD section-10 ledger row + "
        "the AGENTS gate-order note + the docs-counts pin triplex carried "
        "the s198-pinned census 9 while the live audit reads 10: the "
        "re-anchor — the PAD row at the live 10 [4 high / 5 moderate / 1 "
        "low] + the minimatch chain + the RE-TRIAGED session-203 clause "
        "[the drift 9 -> 10 · GHSA-g3hv-75wg-m249 · the dev-toolchain "
        "eslint-family chains · zero runtime exposure · no mid-rotation "
        "toolchain bump — the standing posture: a toolchain bump forces "
        "the standing pixel baselines' re-derivation, its own rotation]; "
        "the AGENTS note keeps the s198 clause verbatim beneath the s203 "
        "tail; the docs-counts D-198a2 pins re-anchored to the live row; "
        "MUTATION-PROVEN: the planted stale-9 row reversion trips the "
        "re-anchored pin exactly once -> restored -> GREEN); THE REQUIRED "
        "TEST-SIDE RE-ANCHOR: the s200 (g) page-family census pin "
        "re-anchored to subtract ALL THREE non-page families (total "
        "minus dialog-open minus view-state minus marketing-client-state "
        "= 33 — the s202 (g) re-anchor precedent, the live read moving "
        "with the register); DECLINED (recorded considered-and-declined "
        "in the plan): the FAQ all-closed state (the minus-construction "
        "— the same-component/richer-face adjudication: the has-open "
        "family is the registered richer face) · the FAQ non-default "
        "members Q2..Q5 individually (the same-construction family — Q6 "
        "the registered representative, the maximal-distance scan; the "
        "s199 Edit Event/Activity doctrine) · the desktop mobile-menu "
        "twin (the width-inverse — the md:hidden toggle renders at no "
        ">=768 band; the s201 declined drawer-at-desktop doctrine) · the "
        "marketing interiors' client-state arms (none exist — the source "
        "census found exactly two useState machines on the landing, zero "
        "on the /About + /Contact interiors) · a mid-rotation "
        "eslint-family bump to cure minimatch (the standing "
        "no-mid-rotation-bump posture); THE COUNT LADDER UNIT 2837 -> "
        "2841 (+4: the dialog-controls session-203 (m) describes — the "
        "containment pair + the census + the width-pair census + the "
        "phone-only negative) · SUITES 138 HELD (the one-suite doctrine) "
        "· E2E 223 -> 226 (+3: the three marketing client-state "
        "registrations; the Appendix B a11y row re-anchored 61 -> 64) · "
        "badge 3060 -> 3067 (the unit+e2e arithmetic: 2841+226) + "
        "skill-head-203.py (this surgery — the SKILL v1.200.0, the s202 "
        "layer comment-demoted at its ship counts 2837/223, the s203 "
        "layer live at 2841/226, idempotent) + count-ladder-203.py "
        "(assert-first, idempotent, unique-anchor) + the test-side "
        "re-anchors in the same stroke (the docs-counts layer-axis: "
        "first = s203, second = s202 at its ship 2837/223 · the unit "
        "negatives ladder: the retired 2837 site-forms join the "
        "negatives · the login-family E2E ladder: the retired E2E 223 "
        "form joins its negatives, the live positive re-anchored 226 · "
        "the dialog-geometry-parity F-92a3 ladder: the four CLAUDE live "
        "positives re-anchored 2841 + the 2837 forms join the negatives) "
        "+ the docs lockstep (the AGENTS Session-203 section · "
        "docs/session_428.md · the PAD section-7.1 s203 inventory row + "
        "the section-11 a11y + dialog-controls rows · the README "
        "walk-contracts paragraph's s203 clause · the plan's execution "
        "record + the worklog entry {Task ID 203}) + the captures "
        "670-676 (the round's marketing client-state pair ours+ref at "
        "the 390x844 phone axis — the mobile disclosure menu OPEN, the "
        "walk65-walked member — + the dev-server set: the FAQ "
        "non-default state at both widths + the menu-open dev face + "
        "the mobile drawer-open face [the operator's standing mobile-nav "
        "ask] + the dashboard) + beneath it 2837 unit checks + 223 "
        "e2e checks green; the session-202 layer (THE A11Y REGISTER'S "
        "LOGIN-CARD CLIENT-STATE COVERAGE AUDIT — the six view-state "
        "registrations + the state-true criterion; the count ladder "
        "2832 -> 2837 · E2E 217 -> 223 · badge 3049 -> 3060 + the docs "
        "lockstep + the captures 660-669))"
    )

    # 4) splice: the demoted block replaces the live line, the new layer
    #    lands right after it (the house head form)
    text = text.replace(live_line, demoted_block + S203_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s203 layer live at 2841/226")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.200.0" not in t:
    assert t.count("version: 1.199.0") == 1, "the 1.199.0 frontmarker not unique"
    t = t.replace("version: 1.199.0", "version: 1.200.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.199.0 -> 1.200.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.200.0")

t = SKILL.read_text(encoding="utf8")
# the exact-H1 guard (the s197 live catch hardened into the form):
OLD_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.199.0)"
NEW_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.200.0)"
if OLD_H1 not in t:
    print("  no-op  [SKILL H1] version already v1.200.0")
else:
    assert t.count(OLD_H1) == 1, "the v1.199.0 H1 not unique"
    t = t.replace(OLD_H1, NEW_H1, 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL H1] v1.199.0 -> v1.200.0")

t = SKILL.read_text(encoding="utf8")
if "last_updated: 2026-10-31" not in t:
    assert t.count("last_updated: 2026-10-30") >= 1, "the 2026-10-30 last_updated not found"
    t = t.replace("last_updated: 2026-10-30", "last_updated: 2026-10-31", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL last_updated] 2026-10-30 -> 2026-10-31")
else:
    print("  no-op  [SKILL last_updated] already 2026-10-31")

print("skill-head-203.py done")
