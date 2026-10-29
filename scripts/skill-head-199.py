#!/usr/bin/env python3
"""skill-head-199.py — the SKILL frontmatter head surgery (the s199 layer).

The L-169c3 form: the verified-single guard. The demoted s198 layer keeps
its SHIP-TIME counts (2817/195) in its own comment block (the s171-fix
precedent). Idempotent: a re-run is a verified no-op. Also bumps the
frontmatter version (1.195.0 -> 1.196.0) + the H1 lockstep (the s197
exact-H1 guard form) + last_updated (stays 2026-10-29 — the same day).

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live s198
line still carries its ship count (2817/195), so the demotion is a
verbatim move, and the count-ladder-199.py run that follows flips only
the OTHER doc sites. The retired blocks stay UNTOUCHED.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S199_MARKER = "project_state: 2822 unit checks + 200 e2e checks green; the session-199 layer ("

if S199_MARKER in text:
    print("  no-op  [SKILL head] the s199 layer already live")
else:
    LIVE_MARKER = "project_state: 2817 unit checks + 195 e2e checks green; the session-198 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s198 head marker found {live_count} times"

    # 1) extract the live s198 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s198 layer keeps its ship counts (2817/195)
    #    in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-198 layer (comment-demoted at session-199 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197 layers\n"
        "     sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s199 live layer — the a11y register's dialog-open
    #    coverage audit (the five un-registered open states + the spec's
    #    own stale census claim)
    S199_LAYER = (
        "project_state: 2822 unit checks + 200 e2e checks green; the session-199 layer "
        "(THE A11Y REGISTER'S DIALOG-OPEN COVERAGE AUDIT — the post-198 audit round "
        "[the rotation trigger THE OWNER'S NEWEST COMMIT a8a761d: the session_419 "
        "transcript — the s198 round's own execution record; the baseline gate GREEN "
        "at the exact s198 ship state: lint 0/0 · tsc 0 · 138/2817 unit · probe:ref "
        "STABLE at 46bc2d9c (the bundle md5 unchanged, the demo data still ZERO) · "
        "db census MATCH (15/24/10/23/12 + 4 users at <repo>/db/custom.db)]: the "
        "discovery legs — the standing data-gated re-checks ALL KILLED at the "
        "reference's unchanged zero-data state (the discover-184..199 standing "
        "census) · the conditional gates KILLED (probe:ref STABLE kills the "
        "fresh-bundle re-derivation; the registry's latest recharts 3.10.1 kills "
        "the 4.0 gate) · the s120-era re-walk kill STANDING (the leads family "
        "source-frozen since s113 [86 sessions], the deps locked, the bundle "
        "STABLE) · the pre-ship audit duty CLEAN against the s198 triple pins "
        "(bun audit 9: 4h/4m/1l exactly — no drift, the overrides.dompurify "
        "3.4.17 posture verified); THE ROUND'S MATERIAL — the s197 pattern "
        "applied to the OTHER drift-gate inventory: the a11y two-gate "
        "register's own F-172c criterion (a Radix Dialog's content is ABSENT "
        "from the DOM while closed, so every dialog-open state deserves its "
        "own two-gate registration) re-applied against the app's RUNTIME "
        "dialog census — the register holds the five CREATE dialogs + ONE "
        "member of the five-member edit family + neither of the three "
        "standalone dialogs: FIVE dialog-open states carried ZERO "
        "open-surface a11y teeth (Edit Lead · Edit Account · Import "
        "Contacts · Account Insights · Save Custom Report View) + the "
        "spec's own head comment still claimed the s171 ship count ('The "
        "25 registrations are EXPLICIT' — the register is 33; the s197a2 "
        "stale-census pattern INSIDE the spec file); the discovery's LIVE "
        "axe probes pre-verified every open state (GATE 1 structural=0 · "
        "GATE 2 all-cited-sanctioned): TWO CURES — D-199a1 THE REGISTER'S "
        "DIALOG-OPEN COVERAGE [+5 e2e registrations (the s195a2 form: "
        "open -> scanTwoGate -> Escape, each with the visible-dialog "
        "open-wait guard — the L-164c2 vacuous-green cure) + THE PINS in "
        "the dialog-controls suite (the one-suite doctrine): the "
        "containment pair + the dialog-open register census pin (eleven "
        "open-state registrations, live-read) — RED-first at birth (5 "
        "RED) -> the registrations -> born-green (5/5 the first run + "
        "the full spec 39 passed) ; MUTATION-PROVEN: the planted "
        "aria-label removal on the config-driven SelectTrigger (the "
        "F-172b regression's exact shape) -> BOTH new edit-sibling "
        "registrations RED exactly at the structural gate -> restored -> "
        "GREEN; THE LIVE CATCH: the first mutation attempt (the "
        "id=\"reportName\" removal) did NOT trip — axe's label rule "
        "carries non-empty-placeholder as a sanctioned fallback, so the "
        "label association break alone stays green — the decode moved "
        "the mutation to the combobox-name axis where no content "
        "fallback exists] · D-199a2 THE SPEC'S OWN STALE REGISTRATION-"
        "COUNT CLAIM [the head comment re-anchored to the count-proof "
        "NAME form ('The register is EXPLICIT' — a name never goes "
        "stale when a registration joins; the s197a2 doctrine) + THE "
        "PIN: the negative pair (the retired count-anchored form never "
        "returns + the NAME form is the live face), RED-first at birth "
        "-> the comment cure -> GREEN; MUTATION-PROVEN: the stale "
        "re-plant trips BOTH arms of the pin pair -> restored -> "
        "GREEN]; DECLINED (recorded considered-and-declined in the "
        "plan): the Edit Event + Edit Activity edit-mode registrations "
        "(the same-component adjudication — the create registrations "
        "already scan their shared EntityDialog DOM, the edit-mode "
        "delta is prefilled values + the title text only) · the "
        "popover/menu-open a11y registrations (the walk53/56/57/62 "
        "freeze pins hold the open-interior constructions full-string; "
        "the register's family criterion since s172 is the Radix "
        "Dialog genus) · the registry majors (the s198 declined-posture "
        "stands — none carries an advisory on our locked versions); "
        "THE COUNT LADDER UNIT 2817 -> 2822 (+5: the dialog-controls "
        "session-199 describes — the containment pair + the census "
        "pin + the count-proof negative pair) · SUITES 138 HELD (the "
        "one-suite doctrine) · E2E 195 -> 200 (+5: the five "
        "registrations; the Appendix B a11y row re-anchored 33 -> 38) "
        "· badge 3012 -> 3022 (the unit+e2e arithmetic: 2822+200) + "
        "skill-head-199.py (this surgery — the SKILL v1.196.0, the "
        "s198 layer comment-demoted at its ship counts 2817/195, the "
        "s199 layer live at 2822/200, idempotent) + count-ladder-199.py "
        "(assert-first, idempotent, unique-anchor) + the test-side "
        "re-anchors in the same stroke (the docs-counts layer-axis: "
        "first = s199, second = s198 at its ship 2817/195 · the unit "
        "negatives ladder: the retired 2817 site-forms join the "
        "negatives · the login-family negatives ladder: the retired "
        "E2E 195 form joins its negatives, the live positive "
        "re-anchored 200 · the dialog-geometry-parity F-92a3 ladder: "
        "the four CLAUDE live positives re-anchored 2822 + the 2817 "
        "forms join the negatives) + the docs lockstep (the AGENTS "
        "Session-199 section · session_420.md · the PAD §7.1 s199 "
        "inventory row + the §11 a11y line-census 436 -> 526 · the "
        "README walk-contracts paragraph's s199 clause · the plan's "
        "execution record + the worklog entry {Task ID 199}) + the "
        "captures 629+ (the round's save-report pair ours+ref at the "
        "desktop axis — the two-app-openable registered surface — + "
        "the dev-server set: the five newly-registered dialogs OPEN "
        "+ the mobile drawer-open face + the dashboard) "
        "+ beneath it 2817 unit checks + 195 e2e checks green; the "
        "session-198 layer (THE ADVISORIES RE-TRIAGE — the runtime-"
        "chain critical cured by the 3.4.17 transitive override [the "
        "exhaustive lockfile pin + the dormancy freeze + the ledger "
        "re-pin, all mutation-proven] + the security ledger's stale "
        "census re-anchored [the PAD row + the AGENTS note, both "
        "re-pinned]; the count ladder 2813 -> 2817 · badge 3008 -> "
        "3012 + the docs lockstep + the captures 621-628))"
    )

    # 4) splice: the demoted block replaces the live line, the new layer
    #    lands right after it (the house head form)
    text = text.replace(live_line, demoted_block + S199_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s199 layer live at 2822/200")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.196.0" not in t:
    assert t.count("version: 1.195.0") == 1, "the 1.195.0 frontmarker not unique"
    t = t.replace("version: 1.195.0", "version: 1.196.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.195.0 -> 1.196.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.196.0")

t = SKILL.read_text(encoding="utf8")
# the exact-H1 guard (the s197 live catch hardened into the form):
OLD_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.195.0)"
NEW_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.196.0)"
if OLD_H1 not in t:
    print("  no-op  [SKILL H1] version already v1.196.0")
else:
    assert t.count(OLD_H1) == 1, "the v1.195.0 H1 not unique"
    t = t.replace(OLD_H1, NEW_H1, 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL H1] v1.195.0 -> v1.196.0")

t = SKILL.read_text(encoding="utf8")
if "last_updated: 2026-10-29" not in t:
    assert t.count("last_updated: 2026-10-28") >= 1, "the 2026-10-28 last_updated not found"
    t = t.replace("last_updated: 2026-10-28", "last_updated: 2026-10-29", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL last_updated] 2026-10-28 -> 2026-10-29")
else:
    print("  no-op  [SKILL last_updated] already 2026-10-29")

print("skill-head-199.py done")
