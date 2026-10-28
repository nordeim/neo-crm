#!/usr/bin/env python3
"""skill-head-197.py — the SKILL frontmatter head surgery (the s197 layer).

The L-169c3 form: the verified-single guard. The demoted s196 layer keeps
its SHIP-TIME counts (2811/195) in its own comment block (the s171-fix
precedent). Idempotent: a re-run is a verified no-op. Also bumps the
frontmatter version (1.193.0 -> 1.194.0) + the H1 lockstep +
last_updated (already 2026-10-28 — the same-day rotation, a verified
no-op).

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live s196
line still carries its ship count (2811/195), so the demotion is a
verbatim move, and the count-ladder-197.py run that follows flips only
the OTHER doc sites. The retired blocks stay UNTOUCHED — the generalized
D-188a1 doctrine holds their ship lines under the unit gate.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S197_MARKER = "project_state: 2813 unit checks + 195 e2e checks green; the session-197 layer ("

if S197_MARKER in text:
    print("  no-op  [SKILL head] the s197 layer already live")
else:
    LIVE_MARKER = "project_state: 2811 unit checks + 195 e2e checks green; the session-196 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s196 head marker found {live_count} times"

    # 1) extract the live s196 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s196 layer keeps its ship counts (2811/195)
    #    in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-196 layer (comment-demoted at session-197 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s197 live layer — the sweep-state's own coverage audit
    #    (the 404 drift-gate registration + the one hygiene cure)
    S197_LAYER = (
        "project_state: 2813 unit checks + 195 e2e checks green; the session-197 layer "
        "(THE SWEEP-STATE COVERAGE AUDIT — the post-196 audit round [the rotation "
        "trigger THE OWNER'S NEWEST COMMIT 769ba13: the session_415 transcript — "
        "the s196 round's own execution record; the baseline gate GREEN at the "
        "exact s196 ship state: lint 0/0 · tsc 0 · 138/2811 unit · build · smoke "
        "14/14 · e2e 195/195 (clean first run, 5.6m) · probe:ref STABLE at "
        "46bc2d9c (the bundle md5 unchanged, the demo data still ZERO, the "
        "desktop + TRUE-390 + landing censuses STANDING) · db census MATCH "
        "(15/24/10/23/12 + 4 users at <repo>/db/custom.db)]: THE ROUND IS THE "
        "SWEEP-STATE'S OWN COVERAGE AUDIT — the s412 close's other naming, "
        "adjudicated by scripts/discover-197.ts BEFORE the plan [the standing "
        "data-gated re-checks ALL KILLED at the reference's unchanged zero-data "
        "state — the Edit-family rows=1 empty-state rows, rowMenus=0, the "
        "topbar-search populated=0 on both, the dashboard checkbox arms + the "
        "activities Completed-tab empty — the discover-184..197 standing census · "
        "the conditional gates KILLED: probe:ref STABLE kills the fresh-bundle "
        "re-derivation, the registry's latest recharts 3.10.1 kills the 4.0 "
        "gate · the s120-era interactive-table candidate KILLED by evidence: the "
        "leads family source-frozen since s113 (84 sessions), the deps frozen, "
        "the family's only computed-style change vector since s120 the s193a1 "
        "outline-color rule — decoded + drift-gated, a re-walk re-derives the "
        "s196 verdict; THE COVERAGE AUDIT: the app's renderable routes vs. the "
        "drift-gate inventories — /signup + /reset-password OURS-ONLY "
        "supersets outside the two-app sweep (the REF has no such routes), "
        "THE 404 the only two-app-renderable surface with ZERO drift-gate "
        "coverage, the D-197a1 maiden measuring the pair byte-identical at "
        "all four bands (0.01/0.04/0.01/0.01 badge-closed)]: TWO CURES — "
        "D-197a1 THE 404 SWEEP REGISTRATION [the genuine coverage gap: the "
        "s194 walk67 decoded the faces, the s195 pins hold the render + the "
        "true-404 status + the a11y — no gate held the PIXELS; THE CURE: the "
        "14th PAGES entry { not-found, /no-such-sweep-route, waitFor: "
        "heading-404 } + the per-page capture-wait override (the bare 404 "
        "renders with NO main — the shell-wait's 15s soft-fall burn cured, "
        "the h1 \"404\" the content-wait anchor) + the STANDING_BASELINES "
        "entries at all four bands (0.1 the family floor) + the sweep-tool "
        "pins (the PAGES census re-anchored 13 -> 14 + the waitFor pin + the "
        "baselines pin); born-green at all four bands (0.01-0.03% clean, the "
        "seed restored after every run); MUTATION-PROVEN ×2: the planted "
        "text-8xl h1 regression -> the sweep DRIFT trip exactly at not-found "
        "(1.12% > baseline 0.1 + margin 0.5 = allowed 0.60%, exit 1) -> "
        "restored -> 0.01% clean; the removed desktop baseline -> exactly 2 "
        "unit REDs (the new baselines pin + the standing coverage-loop pin), "
        "zero collateral -> restored -> GREEN] · D-197a2 THE SWEEP HEADER'S "
        "OWN STALE PAGE CENSUS [the s91-era count-anchored comments (\"the "
        "ten pages\") survived three page additions (s96/s142/s144) — the "
        "s98 guard's own live face went stale WITH them, pinning the stale "
        "count as the corrected phrasing; THE CURE: the header re-anchored to "
        "the count-proof NAME form (\"the PAGES list\" / \"the full PAGES "
        "sweep\"), the F-98a1/N-97a1 guards re-anchored — the negatives grow "
        "the retired ten-forms (the s192 doctrine: the OLD live form joins "
        "the negatives), the live faces move to the NAME form, the suite's "
        "own two stale comments re-anchored in the same stroke]; DECLINED: "
        "the census 404 registration (a third collector for one page — "
        "speculative scaffolding; the element ledger walk-frozen + "
        "source-pinned) · /signup + /reset-password in the sweep (OURS-ONLY, "
        "e2e-pinned already) · the s120-era re-walk (KILLED by the discovery "
        "evidence); THE COUNT LADDER UNIT 2811 -> 2813 (+2: the waitFor pin "
        "+ the baselines pin, the sweep-tool suite) · SUITES 138 HELD · E2E "
        "195 HELD · badge 3006 -> 3008 (the unit+e2e arithmetic: 2813+195) + "
        "skill-head-197.py (this surgery — the SKILL v1.194.0, the s196 "
        "layer comment-demoted at its ship counts 2811/195, the s197 layer "
        "live at 2813/195, idempotent) + count-ladder-197.py (assert-first, "
        "idempotent, unique-anchor) + the test-side re-anchors in the same "
        "stroke (the docs-counts layer-axis: first = s197, second = s196 at "
        "its ship 2811/195 · the unit negatives ladder: the retired 2811 "
        "site-forms join the negatives) + the docs lockstep (the AGENTS "
        "Session-197 section · session_416.md · the PAD §7.1 s197 inventory "
        "row · the README walk-contracts paragraph's s197 clause · the "
        "plan's execution record + the worklog entry {Task ID 197}) + the "
        "captures 613+ (the 404 pair ours+ref at the desktop + phone axes + "
        "the dev-server set of the remediated tree) "
        "+ beneath it 2811 unit checks + 195 e2e checks green; the "
        "session-196 layer (THE DRAWER-OPEN SPINE FREEZE — the re-walk "
        "staleness round [the walk50 re-run 19 sessions after the s177 "
        "original: STABLE, zero new deltas, every disagreement an "
        "adjudicated genus or KEPT superset, the post-cure spine "
        "byte-equal two-app]; ONE CURE D-196a1 the drawer-open spine freeze "
        "[the rendered interior geometry pinned at the walk50 ledger's own "
        "boxes at TRUE 390x844; MUTATION-PROVEN: the planted mb-2 regression "
        "RED exactly at the header box — Expected 80 / Received 88]; the "
        "count ladder E2E 194 -> 195 · the mobile-nav census 10 -> 11 · "
        "badge 3005 -> 3006 + the docs lockstep + the captures 600-612))"
    )

    # 4) splice: the demoted block replaces the live line, the new layer
    #    lands right after it (the house head form)
    text = text.replace(live_line, demoted_block + S197_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s197 layer live at 2813/195")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.194.0" not in t:
    assert t.count("version: 1.193.0") == 1, "the 1.193.0 frontmarker not unique"
    t = t.replace("version: 1.193.0", "version: 1.194.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.193.0 -> 1.194.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.194.0")

t = SKILL.read_text(encoding="utf8")
# the exact-H1 guard: the layer text itself mentions "the SKILL v1.194.0",
# so a bare substring check would no-op while the H1 still reads the old
# version (the live catch — check the H1 form, not the version token)
OLD_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.193.0)"
NEW_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.194.0)"
if OLD_H1 not in t:
    print("  no-op  [SKILL H1] version already v1.194.0")
else:
    assert t.count(OLD_H1) == 1, "the v1.193.0 H1 not unique"
    t = t.replace(OLD_H1, NEW_H1, 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL H1] v1.193.0 -> v1.194.0")

t = SKILL.read_text(encoding="utf8")
if "last_updated: 2026-10-28" not in t:
    assert t.count("last_updated: 2026-10-27") >= 1, "the 2026-10-27 last_updated not found"
    t = t.replace("last_updated: 2026-10-27", "last_updated: 2026-10-28", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] last_updated 2026-10-27 -> 2026-10-28")
else:
    print("  no-op  [SKILL frontmatter] last_updated already 2026-10-28")

print("skill-head-197: done")
