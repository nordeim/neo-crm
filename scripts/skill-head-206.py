#!/usr/bin/env python3
"""skill-head-206.py — the SKILL frontmatter head surgery (the s206 layer).

The arithmetic: the s206 layer ships at 2851/226 (+2 — the two D-206a1
strictness doc-family its in tests/type-gate.test.ts).

The L-169c3 form (the 204/205 template): the verified-single guard. The
demoted s205 layer keeps its SHIP-TIME counts (2849/226) in its own
comment block (the s171-fix precedent). Idempotent: a re-run is a
verified no-op. Also bumps the frontmatter version (1.202.0 ->
1.203.0) + the H1 lockstep (the s197 exact-H1 guard form). The
last_updated stays 2026-11-01 (the same calendar day as s204/s205 —
the no-op form).

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live
s205 line still carries its ship count (2849/226), so the demotion is
a verbatim move, and the count-ladder-206.py run that follows flips
only the OTHER doc sites. The retired blocks stay UNTOUCHED.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S206_MARKER = "project_state: 2851 unit checks + 226 e2e checks green; the session-206 layer ("

if S206_MARKER in text:
    print("  no-op  [SKILL head] the s206 layer already live")
else:
    LIVE_MARKER = "project_state: 2849 unit checks + 226 e2e checks green; the session-205 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s205 head marker found {live_count} times"

    # 1) extract the live s205 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s205 layer keeps its ship counts
    #    (2849/226) in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-205 layer (comment-demoted at session-206 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198/\n"
        "     s199/s200/s201/s202/s203/s204 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s206 live layer — the operator's standing verification
    #     round + the strictness doc-contract (the stale AGENTS
    #     convention retired, and the doc family joins the pin)
    S206_LAYER = (
        "project_state: 2851 unit checks + 226 e2e checks green; the session-206 layer "
        "(THE OPERATOR'S STANDING VERIFICATION ROUND + THE STRICTNESS "
        "DOC-CONTRACT — the post-205 audit round [the rotation trigger THE "
        "OWNER'S NEWEST COMMIT 60d04e3: the session_433 transcript — the s205 "
        "round's own execution record]; the baseline gate GREEN at the exact "
        "s205 ship state on a FRESH CLONE: lint 0/0 · tsc 0 · 138/2849 unit · "
        "build · smoke 14/14 · e2e 226/226 (8.1m; one environment-only false "
        "start — the fresh sandbox lacked the Playwright browser binary, cured "
        "by bunx playwright install chromium, zero code involvement) · db "
        "census MATCH (15/24/10/23/12 + 4 users at <repo>/db/custom.db — the "
        "operator's standing .env contract, DATABASE_URL=file:../db/custom.db "
        "with db/ at the repo root, rebuilt from .env.example with a fresh "
        "AUTH_SECRET at the clone): THE SIX DRIFT GATES ALL CLEAN — the "
        "four-band sweep at --fail-on-drift (desktop 1280 · phone 390x844 · "
        "tablet 768x1024 · landscape 1024x768) + the fullpage sweep CLEAN "
        "(desktop 0.093% / phone 0.316%, both inside the standing margins) + "
        "the interior census BYTE-PARITY (zero unexplained deltas at all four "
        "axes) + probe:ref STABLE at 46bc2d9c (the demo data still ZERO; the "
        "conditional gates stay killed); THE OPERATOR'S NAMED PARITY FOCUS "
        "RE-VERIFIED LIVE WITH agent-browser AGAINST BOTH APPS LOGGED IN — "
        "THE MOBILE NAVIGATION BOTH SURFACES WORKING: the app drawer open at "
        "390x844 [the Close button + the CRM h2 + the 8 destinations], Escape "
        "closes, a link ride navigates (/Dashboard -> /Leads) AND auto-closes "
        "AND releases BOTH scroll locks (body visible · main auto), the "
        "reference's overlay computing rgba(0, 0, 0, 0.8) and OURS "
        "oklab(0 0 0 / 0.8) [the same 80% black — the bg-black/80 contract, "
        "the v4 serialization] + the landing disclosure menu (the toggle "
        "mounts the div.md:hidden panel, 6 links byte-identical, ours "
        "carrying aria-expanded — the accessible superset, an in-panel FAQ "
        "click closes it + lands on /#faq) + the VLM comparison of the "
        "drawer-open pair ours-vs-ref: IDENTICAL in structure, layout, and "
        "styling (the sole note the reference's own Base44 platform badge — "
        "never mirrored, the standing doctrine); TAILWIND V4 STATE CLEAN (no "
        "config file — the CSS-first @theme with literal hex · the vendored "
        "tw-animate.css · the documented v4 pitfalls all avoided in source · "
        "the four-band pixel sweep + interior census proving the rendered "
        "output identical); SEO/SITEMAP live-verified (the 11-route "
        "/sitemap.xml byte-format contract · /robots.txt · /manifest.json "
        "200 application/json · the root metadataBase + the per-route "
        "OG/Twitter cards + canonical, curl-verified on the dev server); the "
        "hygiene legs (no TODO/FIXME · no console.log · no any [the one grep "
        "hit a JSDoc comment word] · .env + db/*.db git-ignored · bun audit "
        "at the pinned census 10 [4h/5m/1l — all dev-toolchain transitive, "
        "zero runtime exposure; the standing no-mid-rotation-bump posture "
        "holds]); the recent-changes audit: src/ UNCHANGED since the s205 "
        "ship (git diff efe14e7..HEAD --stat -- src/ empty; the owner's "
        "newest commit adds docs/session_433.md only) + the scandihaven "
        "reference repo re-reviewed (the highest-leverage borrows already "
        "embodied): THE ROUND'S MATERIAL — THE STRICTNESS DOC-CONTRACT "
        "(F-206a: the s174 full-strict flip updated CLAUDE/PAD/SKILL + "
        "AGENTS's own architecture-facts section, but the AGENTS 'Conventions "
        "that differ from defaults' bullet kept the PRE-174 exception form "
        "'TypeScript strict **except noImplicitAny: false** (sandbox "
        "default, kept)' for 31 sessions — every gate green, the doc "
        "contradicting the pinned tsconfig, ADR-019, the other three docs, "
        "and its own file; the type-gate suite pinned the CODE side, no pin "
        "guarded the DOC claims — the exact genus D-205a2 closed for the env "
        "face): D-206a1 THE STRICTNESS DOC-FAMILY PIN [two its appended to "
        "tests/type-gate.test.ts — the F-174b home: it-1 the instance "
        "(AGENTS carries the live full-strict claim + the stale fingerprint "
        "'strict **except' retired) RED-first at birth [exactly 1 RED, zero "
        "collateral, 5 standing GREEN] -> the cure: the AGENTS.md "
        "conventions bullet flipped to the 'TypeScript FULL strict "
        "(session-174: ...)' form -> GREEN 7/7 · it-2 the genus (the "
        "CLAUDE + PAD + SKILL stack-table rows mirror the live tsconfig — "
        "born-green freeze pins, the D-205a1 reverse-arm precedent); "
        "MUTATION-PROVEN x2: the stale form re-planted in AGENTS.md -> "
        "exactly 1 RED (it-1) · the CLAUDE stack row weakened -> exactly 1 "
        "RED (it-2) — each restored -> GREEN; src/ untouched (docs + tests "
        "only — the baseline-inert construction)]; THE COUNT LADDER UNIT "
        "2849 -> 2851 (+2: the two D-206a1 its) · SUITES 138 HELD (the pins "
        "land in an existing file) · E2E 226 HELD · badge 3075 -> 3077 (the "
        "unit+e2e arithmetic: 2851+226) + skill-head-206.py (this surgery — "
        "the SKILL v1.203.0, the s205 layer comment-demoted at its ship "
        "counts 2849/226, the s206 layer live at 2851/226, idempotent) + "
        "count-ladder-206.py (assert-first, idempotent, unique-anchor) + "
        "the test-side re-anchors in the same stroke (the docs-counts "
        "layer-axis: first = s206, second = s205 at its ship 2849/226 · the "
        "unit negatives ladder: the retired 2849 site-forms join the "
        "negatives · the dialog-geometry-parity F-92a3 ladder: the four "
        "CLAUDE live positives re-anchored 2851 + the 2849 forms join the "
        "negatives) + the docs lockstep (the AGENTS Session-206 section · "
        "docs/session_434.md · the PAD section-7.1 s206 inventory row · the "
        "plan's execution record + the worklog entry {Task ID 206}) + the "
        "captures 687-691 (the round's dev-server set: the dashboard at "
        "desktop + the dashboard at 390x844 + the mobile drawer OPEN at "
        "phone [the operator's standing mobile-nav ask] + the landing "
        "mobile disclosure menu OPEN at phone + the login card) + beneath "
        "it 2849 unit checks + 226 e2e checks green; the session-205 layer "
        "(THE OPERATOR'S STANDING VERIFICATION ROUND + THE ENV-FACE "
        "TOTALITY CONTRACT — the e2e-port + headless knobs join the "
        "documented env face, and the genus closes with a census; the "
        "count ladder 2845 -> 2849 · badge 3071 -> 3075 + the docs "
        "lockstep + the captures 682-686))"
    )

    # 4) splice: the demoted block replaces the live line, the new layer
    #    lands right after it (the house head form)
    text = text.replace(live_line, demoted_block + S206_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s206 layer live at 2851/226")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.203.0" not in t:
    assert t.count("version: 1.202.0") == 1, "the 1.202.0 frontmarker not unique"
    t = t.replace("version: 1.202.0", "version: 1.203.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.202.0 -> 1.203.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.203.0")

t = SKILL.read_text(encoding="utf8")
# the exact-H1 guard (the s197 live catch hardened into the form):
OLD_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.202.0)"
NEW_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.203.0)"
if OLD_H1 not in t:
    print("  no-op  [SKILL H1] version already v1.203.0")
else:
    assert t.count(OLD_H1) == 1, "the v1.202.0 H1 not unique"
    t = t.replace(OLD_H1, NEW_H1, 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL H1] v1.202.0 -> v1.203.0")

# last_updated: the same calendar day as s204/s205 (2026-11-01) — the no-op form
t = SKILL.read_text(encoding="utf8")
if "last_updated: 2026-11-01" in t:
    print("  no-op  [SKILL last_updated] already 2026-11-01 (the same-day form)")
else:
    raise SystemExit("the 2026-11-01 last_updated not found — the s205 form moved")

print("skill-head-206.py done")
