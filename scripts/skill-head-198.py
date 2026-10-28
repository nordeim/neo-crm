#!/usr/bin/env python3
"""skill-head-198.py — the SKILL frontmatter head surgery (the s198 layer).

The L-169c3 form: the verified-single guard. The demoted s197 layer keeps
its SHIP-TIME counts (2813/195) in its own comment block (the s171-fix
precedent). Idempotent: a re-run is a verified no-op. Also bumps the
frontmatter version (1.194.0 -> 1.195.0) + the H1 lockstep (the s197
exact-H1 guard form — a bare substring check was fooled once, never
again) + last_updated (2026-10-28 -> 2026-10-29).

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live s197
line still carries its ship count (2813/195), so the demotion is a
verbatim move, and the count-ladder-198.py run that follows flips only
the OTHER doc sites. The retired blocks stay UNTOUCHED — the generalized
D-188a1 doctrine holds their ship lines under the unit gate.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S198_MARKER = "project_state: 2817 unit checks + 195 e2e checks green; the session-198 layer ("

if S198_MARKER in text:
    print("  no-op  [SKILL head] the s198 layer already live")
else:
    LIVE_MARKER = "project_state: 2813 unit checks + 195 e2e checks green; the session-197 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s197 head marker found {live_count} times"

    # 1) extract the live s197 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s197 layer keeps its ship counts (2813/195)
    #    in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-197 layer (comment-demoted at session-198 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196 layers sit\n"
        "     demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s198 live layer — the advisories re-triage (the runtime
    #    chain's critical cured + the security-ledger lockstep)
    S198_LAYER = (
        "project_state: 2817 unit checks + 195 e2e checks green; the session-198 layer "
        "(THE ADVISORIES RE-TRIAGE — the post-197 audit round [the rotation "
        "trigger THE OWNER'S NEWEST COMMIT ba30355: the session_417 transcript — "
        "the s197 round's own execution record; the baseline gate GREEN at the "
        "exact s197 ship state: lint 0/0 · tsc 0 · 138/2813 unit · probe:ref "
        "STABLE at 46bc2d9c (the bundle md5 unchanged, the demo data still "
        "ZERO, the desktop + TRUE-390 + landing censuses STANDING) · db census "
        "MATCH (15/24/10/23/12 + 4 users at <repo>/db/custom.db)]: THE ROUND "
        "IS THE STANDING PRE-SHIP DUTY'S OWN CATCH — the s164 bun-audit "
        "doctrine re-run live by scripts/discover-198.ts BEFORE the plan "
        "found the census DRIFTED (9 -> 12, the repo's first CRITICAL on a "
        "RUNTIME chain): jspdf@4.2.1 (the direct runtime dep behind the "
        "reports PDF export) ships the optional dompurify at 3.4.16, INSIDE "
        "the vulnerable range >=3.4.4 <=3.4.16 (critical GHSA-cg2g-xh64-v4q7 "
        "+ high GHSA-mrv2-3pqr-j5jr + low GHSA-c6gr-qvv4-5v3f), DORMANT in "
        "our tree [pdf-export.ts never calls pdf.html(), dompurify's only "
        "jsPDF activation site — the security-and-hardening triage ladder]; "
        "the other discovery legs: the standing data-gated re-checks ALL "
        "KILLED at the reference's unchanged zero-data state (the "
        "discover-184..198 standing census) · the conditional gates KILLED "
        "(probe:ref STABLE kills the fresh-bundle re-derivation; the "
        "registry's latest recharts 3.10.1 kills the 4.0 gate) · the "
        "s120-era re-walk kill STANDING (the leads family source-frozen "
        "since s113 [85 sessions], the deps locked, the bundle STABLE — "
        "the kill condition unmoved); TWO CURES — D-198a1 THE RUNTIME "
        "CHAIN'S CRITICAL [THE CURE: the 3.4.17 transitive override "
        "(overrides.dompurify in package.json — the first update attempt "
        "hoisted the root while a NESTED jspdf/dompurify@3.4.16 SURVIVED, "
        "the live catch that hardened the pin to scan EVERY resolution) + "
        "THE PINS: the exhaustive lockfile pin (every dompurify@x.y.z "
        "resolution asserted outside the vulnerable range — a re-resolution "
        "or a nested copy regressing it goes RED) + the dormancy freeze "
        "(pdf-export.ts NEVER calls .html( — adopting jsPDF's html() plugin "
        "becomes a conscious act that trips the pin), both in the "
        "pdf-export suite (the one-suite doctrine); RED-first at birth "
        "against the shipping 3.4.16 -> the cure -> GREEN; MUTATION-PROVEN "
        "x2: the lockfile flip -> exactly 1 RED -> restored -> GREEN; the "
        "planted .html( call -> exactly 1 RED -> restored -> GREEN; the "
        "post-cure audit: 9 advisories (4 high / 4 moderate / 1 low), the "
        "critical GONE, zero runtime chains] · D-198a2 THE SECURITY "
        "LEDGER'S OWN STALE CENSUS [the PAD §10 row + the AGENTS "
        "gate-order note both carried the s164 census verbatim, ZERO test "
        "teeth on either claim — the census went stale silently for 33 "
        "sessions; THE CURE: the PAD row rewritten at the live post-cure "
        "census (9: 4h/4m/1l, ALL dev-toolchain again: zod via "
        "eslint-config-next>eslint-plugin-react-hooks · deepmerge-ts via "
        "the prisma CLI · vite + launch-editor via vitest · source-map-js "
        "via postcss) + the dormancy decode carried in the row + the "
        "s198 re-triage clause + the AGENTS note re-anchored + THE PINS: "
        "the PAD-ledger pin (the live census + the re-triage record + the "
        "retired braces-composition negative) + the AGENTS-note pin "
        "(whitespace-normalized — the pin holds the content, never the "
        "wrap), both in the docs-counts suite; RED-first at birth -> the "
        "doc cures -> GREEN; MUTATION-PROVEN x2: the stale re-plant -> 1 "
        "RED each -> restored -> GREEN]; DECLINED: the dev-toolchain "
        "members' bumps (deepmerge-ts 8 · vite 8.3.3 · the eslint-zod "
        "floor · source-map-js 1.2.2 — the s164 no-mid-rotation TOOLCHAIN "
        "posture stands: every member build/lint/CLI-only, zero runtime "
        "request-path) · the registry majors (lucide-react 1.63.0 vs our "
        "0.525 PARITY pin — the reference's own bundle-decoded version; "
        "prisma 7.10.1 vs our 6.19.3; next 16.4.3 vs our 16.4.2; zustand "
        "5.0.16 vs our 5.0.15 — their own rotations, never mid-rotation, "
        "none carries an audit advisory on our locked versions) · the "
        "e2e/a11y extensions for the advisories axis (no page surface "
        "changed — the battery 195/195 + the four-band sweep are the "
        "cure's inertness proof, not new coverage); THE COUNT LADDER UNIT "
        "2813 -> 2817 (+4: the lockfile pin + the dormancy pin in "
        "pdf-export · the PAD-ledger pin + the AGENTS-note pin in "
        "docs-counts) · SUITES 138 HELD (the one-suite doctrine — both "
        "pin pairs ride EXISTING suites) · E2E 195 HELD · badge 3008 -> "
        "3012 (the unit+e2e arithmetic: 2817+195) + skill-head-198.py "
        "(this surgery — the SKILL v1.195.0, the s197 layer comment-demoted "
        "at its ship counts 2813/195, the s198 layer live at 2817/195, "
        "idempotent) + count-ladder-198.py (assert-first, idempotent, "
        "unique-anchor) + the test-side re-anchors in the same stroke "
        "(the docs-counts layer-axis: first = s198, second = s197 at its "
        "ship 2813/195 · the unit negatives ladder: the retired 2813 "
        "site-forms join the negatives · the dialog-geometry-parity "
        "F-92a3 ladder: the four CLAUDE live positives re-anchored 2817 + "
        "the 2813 forms join the negatives) + the docs lockstep (the "
        "AGENTS Session-198 section · session_418.md · the PAD §7.1 s198 "
        "inventory row + the §10 ledger row · the README walk-contracts "
        "paragraph's s198 clause · the plan's execution record + the "
        "worklog entry {Task ID 198}) + the captures 621+ (the reports "
        "pair ours+ref at the desktop + phone axes — the PDF-export "
        "surface whose dependency chain carried the critical + the "
        "dev-server set of the remediated tree: the landing + the "
        "dashboard + the reports + the mobile drawer-open face) "
        "+ beneath it 2813 unit checks + 195 e2e checks green; the "
        "session-197 layer (THE SWEEP-STATE COVERAGE AUDIT — the 404 "
        "drift-gate registration [the 14th PAGES entry + the waitFor "
        "override + the four-band baselines + the three sweep-tool pins; "
        "mutation-proven x2: the text-8xl trip at 1.12% + the "
        "removed-baseline 2-RED trip] + the sweep header's stale census "
        "re-anchored to the count-proof NAME form; the count ladder "
        "2811 -> 2813 · badge 3006 -> 3008 + the docs lockstep + the "
        "captures 613-620))"
    )

    # 4) splice: the demoted block replaces the live line, the new layer
    #    lands right after it (the house head form)
    text = text.replace(live_line, demoted_block + S198_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s198 layer live at 2817/195")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.195.0" not in t:
    assert t.count("version: 1.194.0") == 1, "the 1.194.0 frontmarker not unique"
    t = t.replace("version: 1.194.0", "version: 1.195.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.194.0 -> 1.195.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.195.0")

t = SKILL.read_text(encoding="utf8")
# the exact-H1 guard (the s197 live catch hardened into the form):
OLD_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.194.0)"
NEW_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.195.0)"
if OLD_H1 not in t:
    print("  no-op  [SKILL H1] version already v1.195.0")
else:
    assert t.count(OLD_H1) == 1, "the v1.194.0 H1 not unique"
    t = t.replace(OLD_H1, NEW_H1, 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL H1] v1.194.0 -> v1.195.0")

t = SKILL.read_text(encoding="utf8")
if "last_updated: 2026-10-29" not in t:
    assert t.count("last_updated: 2026-10-28") >= 1, "the 2026-10-28 last_updated not found"
    t = t.replace("last_updated: 2026-10-28", "last_updated: 2026-10-29", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL last_updated] 2026-10-28 -> 2026-10-29")
else:
    print("  no-op  [SKILL last_updated] already 2026-10-29")

print("skill-head-198.py done")
