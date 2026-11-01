#!/usr/bin/env python3
"""skill-head-205.py — the SKILL frontmatter head surgery (the s205 layer).

The arithmetic: the s205 layer ships at 2849/226 (+4 — the two D-205a1
env-knob its + the two D-205a2 totality-census its in
tests/facts-census.test.ts).

The L-169c3 form (the 204 template): the verified-single guard. The
demoted s204 layer keeps its SHIP-TIME counts (2845/226) in its own
comment block (the s171-fix precedent). Idempotent: a re-run is a
verified no-op. Also bumps the frontmatter version (1.201.0 ->
1.202.0) + the H1 lockstep (the s197 exact-H1 guard form). The
last_updated stays 2026-11-01 (the same calendar day as s204 — the
no-op form).

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live
s204 line still carries its ship count (2845/226), so the demotion is
a verbatim move, and the count-ladder-205.py run that follows flips
only the OTHER doc sites. The retired blocks stay UNTOUCHED.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S205_MARKER = "project_state: 2849 unit checks + 226 e2e checks green; the session-205 layer ("

if S205_MARKER in text:
    print("  no-op  [SKILL head] the s205 layer already live")
else:
    LIVE_MARKER = "project_state: 2845 unit checks + 226 e2e checks green; the session-204 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s204 head marker found {live_count} times"

    # 1) extract the live s204 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s204 layer keeps its ship counts
    #    (2845/226) in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-204 layer (comment-demoted at session-205 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198/\n"
        "     s199/s200/s201/s202/s203 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s205 live layer — the operator's standing verification
    #     round + the env-face totality contract (the e2e-port + headless
    #     knobs join the documented env face, and the genus closes with
    #     a census)
    S205_LAYER = (
        "project_state: 2849 unit checks + 226 e2e checks green; the session-205 layer "
        "(THE OPERATOR'S STANDING VERIFICATION ROUND + THE ENV-FACE TOTALITY "
        "CONTRACT — the post-204 audit round [the rotation trigger THE OWNER'S "
        "NEWEST COMMIT 881dc50: the session_431 transcript — the s204 round's own "
        "execution record]; the baseline gate GREEN at the exact s204 ship state: "
        "lint 0/0 · tsc 0 · 138/2845 unit · build · smoke 14/14 · e2e 226/226 "
        "clean first run · db census MATCH (15/24/10/23/12 + 4 users at "
        "<repo>/db/custom.db — the operator's standing .env contract, "
        "DATABASE_URL=file:../db/custom.db with db/ at the repo root): THE SIX "
        "DRIFT GATES ALL CLEAN — the four-band sweep at --fail-on-drift (desktop "
        "1280 · phone 390x844 · tablet 768x1024 · landscape 1024x768) + the "
        "fullpage sweep CLEAN (desktop 0.093% / phone 0.316%, both inside the "
        "standing margins) + the interior census BYTE-PARITY (zero unexplained "
        "deltas at all four axes) + probe:ref STABLE at 46bc2d9c (the demo data "
        "still ZERO; the conditional gates stay killed); THE OPERATOR'S NAMED "
        "PARITY FOCUS RE-VERIFIED LIVE WITH agent-browser AGAINST BOTH APPS "
        "LOGGED IN — THE MOBILE NAVIGATION BOTH SURFACES WORKING: the app "
        "drawer open at 390x844 [the Close button + the CRM h2 + the 8 "
        "destinations], Escape closes, a link ride navigates (/Dashboard -> "
        "/Leads) AND auto-closes AND releases BOTH scroll locks (body visible · "
        "main auto), the overlay computing oklab(0 0 0 / 0.8) [the bg-black/80 "
        "contract] + the landing disclosure menu (the toggle mounts the "
        "div.md:hidden.border-t panel, 6 links, aria-expanded rides, an "
        "in-panel link click closes it + lands on the section) + the VLM "
        "comparison of the drawer-open pair ours-vs-ref: IDENTICAL in "
        "structure, layout, and styling (the sole note the reference's own "
        "Base44 platform badge — never mirrored, the standing doctrine); "
        "TAILWIND V4 STATE CLEAN (no config file — the CSS-first @theme with "
        "literal hex · the vendored tw-animate.css · the documented v4 "
        "pitfalls all avoided in source · the four-band pixel sweep + "
        "interior census proving the rendered output identical); SEO/SITEMAP "
        "live-verified (the 11-route /sitemap.xml byte-format contract · "
        "/robots.txt · /manifest.json · the root metadataBase + the per-route "
        "OG/Twitter cards + canonical, curl-verified on the dev server); the "
        "hygiene legs (no TODO/FIXME · no console.log · no any · .env + "
        "db/*.db git-ignored · bun audit at the s204-pinned census 10 "
        "[4h/5m/1l — all dev-toolchain transitive, zero runtime exposure; "
        "the standing no-mid-rotation-bump posture holds]): THE ROUND'S "
        "MATERIAL — THE ENV-FACE TOTALITY CONTRACT (the F-167e genus on the "
        "TOOLING axis, the D-204a1 continuation: the full env-consumer census "
        "found TWO MORE undocumented tooling knobs — E2E_PORT [the e2e boot "
        "port, single source tests/e2e/e2e-port.ts, consumed by "
        "playwright.config.ts + the crm.spec 401 probe; an operator with a "
        ":3100 conflict had no knob] + HEADLESS [the drift scripts' watch "
        "mode, HEADLESS=0, consumed by sweep.ts/drift-probe.ts/"
        "interior-census.ts, documented only in the scripts' own header "
        "comments]): D-205a1 THE E2E-PORT + HEADLESS PINS [a new describe in "
        "tests/facts-census.test.ts — the D-204a1 home: both knobs documented "
        "+ the E2E_PORT default read LIVE from the e2e-port module's own "
        "source (the F-109a1 doctrine) — RED-first at birth (exactly 3 RED + "
        "1 born-green reverse arm, zero collateral, 41 standing GREEN) -> the "
        "cure: the two knobs appended to the .env.example parity-tools block "
        "(commented out — the defaults remain authoritative; the block is "
        "documentation, not configuration) -> born-green 44/44; "
        "MUTATION-PROVEN x3: the planted E2E_PORT_DEFAULT mutation -> "
        "exactly 1 RED · the planted new process.env consumer in src/ -> "
        "exactly 1 RED · the planted phantom knob line in .env.example -> "
        "exactly 1 RED — each restored -> GREEN] · D-205a2 THE ENV-FACE "
        "TOTALITY CENSUS [the genus-closing pin: the per-knob D-204a1 form "
        "fixed the instance, not the genus — THE CURE walks src/ + scripts/ "
        "+ tests/ (skills/ excluded per the standing rule) for every "
        "process.env.* consumer on comment-stripped source, subtracts the "
        "framework set (NODE_ENV · CI · NEXT_RUNTIME · NEXT_PHASE), and "
        "asserts EVERY remaining knob appears in .env.example — any future "
        "env var added to the code without a doc face trips the census RED "
        "at the unit gate; + the REVERSE arm (every .env.example knob must "
        "be a real consumer — a rename leaving the doc face behind trips "
        "it); born-green at the cured tree; the standing face: the six app "
        "knobs + the four s204 parity knobs + E2E_PORT + HEADLESS = the "
        "totality]; THE COUNT LADDER UNIT 2845 -> 2849 (+4: the two D-205a1 "
        "its + the two D-205a2 its) · SUITES 138 HELD (the pins land in an "
        "existing file) · E2E 226 HELD · badge 3071 -> 3075 (the unit+e2e "
        "arithmetic: 2849+226) + skill-head-205.py (this surgery — the SKILL "
        "v1.202.0, the s204 layer comment-demoted at its ship counts "
        "2845/226, the s205 layer live at 2849/226, idempotent) + "
        "count-ladder-205.py (assert-first, idempotent, unique-anchor) + "
        "the test-side re-anchors in the same stroke (the docs-counts "
        "layer-axis: first = s205, second = s204 at its ship 2845/226 · the "
        "unit negatives ladder: the retired 2845 site-forms join the "
        "negatives · the dialog-geometry-parity F-92a3 ladder: the four "
        "CLAUDE live positives re-anchored 2849 + the 2845 forms join the "
        "negatives) + the docs lockstep (the AGENTS Session-205 section · "
        "docs/session_432.md · the PAD section-7.1 s205 inventory row · the "
        "plan's execution record + the worklog entry {Task ID 205}) + the "
        "captures 682-686 (the round's dev-server set: the dashboard at "
        "desktop + the dashboard at 390x844 + the mobile drawer OPEN at "
        "phone [the operator's standing mobile-nav ask] + the landing "
        "mobile disclosure menu OPEN at phone + the login card) + beneath "
        "it 2845 unit checks + 226 e2e checks green; the session-204 layer "
        "(THE OPERATOR'S STANDING VERIFICATION ROUND + THE .ENV.EXAMPLE "
        "PARITY-TOOLS CONTRACT — the drift-gate knobs join the documented "
        "env face; the count ladder 2841 -> 2845 · badge 3067 -> 3071 + the "
        "docs lockstep + the captures 677-681))"
    )

    # 4) splice: the demoted block replaces the live line, the new layer
    #    lands right after it (the house head form)
    text = text.replace(live_line, demoted_block + S205_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s205 layer live at 2849/226")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.202.0" not in t:
    assert t.count("version: 1.201.0") == 1, "the 1.201.0 frontmarker not unique"
    t = t.replace("version: 1.201.0", "version: 1.202.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.201.0 -> 1.202.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.202.0")

t = SKILL.read_text(encoding="utf8")
# the exact-H1 guard (the s197 live catch hardened into the form):
OLD_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.201.0)"
NEW_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.202.0)"
if OLD_H1 not in t:
    print("  no-op  [SKILL H1] version already v1.202.0")
else:
    assert t.count(OLD_H1) == 1, "the v1.201.0 H1 not unique"
    t = t.replace(OLD_H1, NEW_H1, 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL H1] v1.201.0 -> v1.202.0")

# last_updated: the same calendar day as s204 (2026-11-01) — the no-op form
t = SKILL.read_text(encoding="utf8")
if "last_updated: 2026-11-01" in t:
    print("  no-op  [SKILL last_updated] already 2026-11-01 (the same-day form)")
else:
    raise SystemExit("the 2026-11-01 last_updated not found — the s204 form moved")

print("skill-head-205.py done")
