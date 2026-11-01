#!/usr/bin/env python3
"""skill-head-204.py — the SKILL frontmatter head surgery (the s204 layer).

The corrected arithmetic: the s204 layer ships at 2843/226 (+2 — the two
D-204a1 parity-tools its; the first pass briefly wrote 2842/3068, a
never-shipped in-flight intermediate corrected by count-ladder-204.py
before any commit — the s103 precedent).

The L-169c3 form (the s203 template): the verified-single guard. The
demoted s203 layer keeps its SHIP-TIME counts (2841/226) in its own
comment block (the s171-fix precedent). Idempotent: a re-run is a
verified no-op. Also bumps the frontmatter version (1.200.0 ->
1.201.0) + the H1 lockstep (the s197 exact-H1 guard form) +
last_updated (2026-10-31 -> 2026-11-01).

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live
s203 line still carries its ship count (2841/226), so the demotion is
a verbatim move, and the count-ladder-204.py run that follows flips
only the OTHER doc sites. The retired blocks stay UNTOUCHED.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S204_MARKER = "project_state: 2843 unit checks + 226 e2e checks green; the session-204 layer ("

if S204_MARKER in text:
    print("  no-op  [SKILL head] the s204 layer already live")
else:
    LIVE_MARKER = "project_state: 2841 unit checks + 226 e2e checks green; the session-203 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s203 head marker found {live_count} times"

    # 1) extract the live s203 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s203 layer keeps its ship counts
    #    (2841/226) in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-203 layer (comment-demoted at session-204 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198/\n"
        "     s199/s200/s201/s202 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s204 live layer — the operator's standing verification
    #     round + the .env.example parity-tools contract (the drift-gate
    #     knobs join the documented env face)
    S204_LAYER = (
        "project_state: 2843 unit checks + 226 e2e checks green; the session-204 layer "
        "(THE OPERATOR'S STANDING VERIFICATION ROUND + THE .ENV.EXAMPLE PARITY-TOOLS "
        "CONTRACT — the post-203 audit round [the rotation trigger THE OWNER'S NEWEST "
        "COMMIT 257cf15: the session_429 transcript — the s203 round's own execution "
        "record]; the baseline gate GREEN at the exact s203 ship state on a FRESH "
        "CLONE: lint 0/0 · tsc 0 · 138/2841 unit · build · smoke 14/14 · e2e "
        "226/226 clean first run [the s164-lineage settings-defaults focus flake did "
        "NOT recur] · db census MATCH (15/24/10/23/12 + 4 users at <repo>/db/custom.db "
        "— the operator's standing .env contract, DATABASE_URL=file:../db/custom.db "
        "with db/ at the repo root): THE SIX DRIFT GATES ALL CLEAN — the four-band "
        "sweep at --fail-on-drift (desktop 1280 · phone 390x844 · tablet 768x1024 · "
        "landscape 1024x768; every page at the 0.00-0.78 floor except the standing "
        "settings picklist-data genus 2.64/3.61% + the login logo genus "
        "0.28/0.78%, both inside their standing margins) + the interior census "
        "BYTE-PARITY (zero unexplained deltas on every page at every axis) + "
        "probe:ref STABLE at 46bc2d9c (the demo data still ZERO; the conditional "
        "gates stay killed); THE OPERATOR'S NAMED PARITY FOCUS RE-VERIFIED LIVE "
        "WITH agent-browser AGAINST BOTH APPS LOGGED IN — THE MOBILE NAVIGATION "
        "BOTH SURFACES WORKING: the app drawer (the s147 Radix-sheet) open at "
        "390x844 [the Close button + the CRM h2 + the 8 destinations], Escape "
        "closes, a link ride navigates (/Dashboard -> /Leads) AND auto-closes AND "
        "releases BOTH scroll locks (body visible · main auto — the MAIN-scroller "
        "superset), the overlay computing oklab(0 0 0 / 0.8) [the bg-black/80 "
        "contract] + the landing disclosure menu (the s203-registered marketing "
        "machine: the toggle mounts the div.md:hidden.border-t panel, 6 links, "
        "aria-expanded rides, an in-panel link click closes it) + the VLM "
        "comparison of the drawer-open pair ours-vs-ref: structurally identical "
        "(the sole note the reference's own Base44 platform badge — never "
        "mirrored, the standing doctrine) + the dashboard/landing/login DOM "
        "censuses match at desktop + phone (our named-aria supersets aside — the "
        "documented a11y supersets); TAILWIND V4 STATE CLEAN (no config file — "
        "the CSS-first @theme with literal hex · the vendored tw-animate.css · "
        "the documented v4 pitfalls all avoided in source · the four-band pixel "
        "sweep + interior census proving the rendered output identical); "
        "SEO/SITEMAP live-verified (the 11-route /sitemap.xml byte-format "
        "contract · /robots.txt · /manifest.json · the root metadataBase + the "
        "per-route OG/Twitter cards + canonical, curl-verified on the dev "
        "server); the hygiene legs (no TODO/FIXME · no console.log · no any · "
        "no window.location.href outside the sanctioned sites · .env + db/*.db "
        "git-ignored · bun audit at the s203-pinned census 10 [4h/5m/1l — all "
        "dev-toolchain transitive, zero runtime exposure; the standing "
        "no-mid-rotation-bump posture holds]); THE ROUND'S MATERIAL — THE "
        ".ENV.EXAMPLE PARITY-TOOLS CONTRACT (the F-167e genus on the TOOLING "
        "axis: the drift-gate scripts consume four env vars with baked-in "
        "defaults — scripts/sweep.ts:741-744 OUR_URL · REF_URL · REF_EMAIL · "
        "REF_PASSWORD, the drift-probe + interior-census family riding the "
        "same REF_* pair — while .env.example documented only the six app "
        "knobs; an operator running gate:full against a different port or "
        "deployment had no knob): D-204a1 THE PARITY-TOOLS PIN [a new "
        "describe in tests/facts-census.test.ts — the .env.example content "
        "battery's own home, the F-169p precedent: the four knobs documented "
        "+ the defaults read LIVE from the sweep's own source (the F-109a1 "
        "live-census doctrine — a default change in the tool fails the pin "
        "until the doc face follows) — RED-first at birth (exactly 2 RED, "
        "zero collateral, 36 standing GREEN) -> the cure: the commented "
        "'# ---- Parity-gate tooling (optional) ----' block appended to "
        ".env.example (all four vars commented out — the defaults remain "
        "authoritative; the block is documentation, not configuration) -> "
        "born-green 38/38; MUTATION-PROVEN: the planted REF_EMAIL default "
        "mutation -> exactly 1 RED (the live-census pin trips) -> restored "
        "-> GREEN; the six-knob contract pins are toContain-form — the "
        "appended block cannot trip them (verified by the full unit layer)]; "
        "THE COUNT LADDER UNIT 2841 -> 2842 (+1: the D-204a1 pin) · SUITES "
        "138 HELD (the pins land in an existing file) · E2E 226 HELD · "
        "badge 3067 -> 3069 (the unit+e2e arithmetic: 2843+226) + "
        "skill-head-204.py (this surgery — the SKILL v1.201.0, the s203 "
        "layer comment-demoted at its ship counts 2841/226, the s204 layer "
        "live at 2842/226, idempotent) + count-ladder-204.py (assert-first, "
        "idempotent, unique-anchor) + the test-side re-anchors in the same "
        "stroke (the docs-counts layer-axis: first = s204, second = s203 at "
        "its ship 2841/226 · the unit negatives ladder: the retired 2841 "
        "site-forms join the negatives · the dialog-geometry-parity F-92a3 "
        "ladder: the four CLAUDE live positives re-anchored 2843 + the 2841 "
        "forms join the negatives) + the docs lockstep (the AGENTS "
        "Session-204 section · docs/session_430.md · the PAD section-7.1 "
        "s204 inventory row · the plan's execution record + the worklog "
        "entry {Task ID 204}) + the captures 677-681 (the round's dev-server "
        "set: the dashboard at desktop + the dashboard at 390x844 + the "
        "mobile drawer OPEN at phone [the operator's standing mobile-nav "
        "ask] + the landing mobile disclosure menu OPEN at phone + the "
        "login card) + beneath it 2841 unit checks + 226 e2e checks green; "
        "the session-203 layer (THE A11Y REGISTER'S LANDING-PAGE "
        "CLIENT-STATE COVERAGE AUDIT + THE STANDING DUTY'S AUDIT-CENSUS "
        "DRIFT — the marketing-state registrations + the census re-pin; the "
        "count ladder 2837 -> 2841 · E2E 223 -> 226 · badge 3060 -> 3067 + "
        "the docs lockstep + the captures 670-676))"
    )

    # 4) splice: the demoted block replaces the live line, the new layer
    #    lands right after it (the house head form)
    text = text.replace(live_line, demoted_block + S204_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s204 layer live at 2843/226")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.201.0" not in t:
    assert t.count("version: 1.200.0") == 1, "the 1.200.0 frontmarker not unique"
    t = t.replace("version: 1.200.0", "version: 1.201.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.200.0 -> 1.201.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.201.0")

t = SKILL.read_text(encoding="utf8")
# the exact-H1 guard (the s197 live catch hardened into the form):
OLD_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.200.0)"
NEW_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.201.0)"
if OLD_H1 not in t:
    print("  no-op  [SKILL H1] version already v1.201.0")
else:
    assert t.count(OLD_H1) == 1, "the v1.200.0 H1 not unique"
    t = t.replace(OLD_H1, NEW_H1, 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL H1] v1.200.0 -> v1.201.0")

t = SKILL.read_text(encoding="utf8")
if "last_updated: 2026-11-01" not in t:
    assert t.count("last_updated: 2026-10-31") >= 1, "the 2026-10-31 last_updated not found"
    t = t.replace("last_updated: 2026-10-31", "last_updated: 2026-11-01", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL last_updated] 2026-10-31 -> 2026-11-01")
else:
    print("  no-op  [SKILL last_updated] already 2026-11-01")

print("skill-head-204.py done")
