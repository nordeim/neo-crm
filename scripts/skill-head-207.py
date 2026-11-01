#!/usr/bin/env python3
"""skill-head-207.py — the SKILL frontmatter head surgery (the s207 layer).

The arithmetic: the s207 layer ships at 2853/226 (+2 — the two D-207b1
chart-stack doc-family its in tests/facts-census.test.ts; the D-207a1
epoch-gate cure is an e2e-side gate repair, no count change).

The L-169c3 form (the 204/205/206 template): the verified-single guard.
The demoted s206 layer keeps its SHIP-TIME counts (2851/226) in its own
comment block (the s171-fix precedent). Idempotent: a re-run is a
verified no-op. Also bumps the frontmatter version (1.203.0 ->
1.204.0) + the H1 lockstep (the s197 exact-H1 guard form). The
last_updated stays 2026-11-01 (the same calendar day as s204/s205/s206
— the no-op form).

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live
s206 line still carries its ship count (2851/226), so the demotion is
a verbatim move, and the count-ladder-207.py run that follows flips
only the OTHER doc sites. The retired blocks stay UNTOUCHED.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S207_MARKER = "project_state: 2853 unit checks + 226 e2e checks green; the session-207 layer ("

if S207_MARKER in text:
    print("  no-op  [SKILL head] the s207 layer already live")
else:
    LIVE_MARKER = "project_state: 2851 unit checks + 226 e2e checks green; the session-206 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s206 head marker found {live_count} times"

    # 1) extract the live s206 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s206 layer keeps its ship counts
    #    (2851/226) in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-206 layer (comment-demoted at session-207 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198/\n"
        "     s199/s200/s201/s202/s203/s204/s205 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s207 live layer — the operator's standing verification
    #     round + the chart-stack doc-contract + the epoch gate's
    #     response-wait
    S207_LAYER = (
        "project_state: 2853 unit checks + 226 e2e checks green; the session-207 layer "
        "(THE OPERATOR'S STANDING VERIFICATION ROUND + THE CHART-STACK "
        "DOC-CONTRACT + THE EPOCH GATE'S RESPONSE-WAIT — the post-206 audit "
        "round [the rotation trigger THE OWNER'S NEWEST COMMIT f990276: the "
        "session_435 transcript — the s206 round's own execution record]; the "
        "baseline gate at the exact s206 ship state (the workspace reset "
        "mid-round; the fresh clone rebuilt, the standing .env from "
        ".env.example with a fresh AUTH_SECRET, db census MATCH 15/24/10/23/12 "
        "+ 4 users at <repo>/db/custom.db — the operator's standing contract, "
        "DATABASE_URL=file:../db/custom.db with db/ at the repo root): lint "
        "0/0 · tsc 0 · 138/2851 unit · build · smoke 14/14 · e2e 225/226 — THE "
        "ONE LIVE CATCH (F-207a: the settings defaults debounce/focus test "
        "failed once in the full run, toBeFocused with the input at AED + "
        "inactive; isolated re-runs green — the intermittent signature, the "
        "root cause decoded below); THE SIX DRIFT GATES ALL CLEAN — the "
        "four-band sweep at --fail-on-drift (desktop 1280 · phone 390x844 · "
        "tablet 768x1024 · landscape 1024x768) + the fullpage sweep CLEAN "
        "(desktop 0.093% / phone 0.316%, both inside the standing margins) + "
        "the interior census BYTE-PARITY (zero unexplained deltas at all four "
        "axes) + probe:ref STABLE at 46bc2d9c (the demo data still ZERO; the "
        "conditional gates stay killed); THE OPERATOR'S NAMED PARITY FOCUS "
        "RE-VERIFIED LIVE WITH agent-browser AGAINST BOTH APPS LOGGED IN — "
        "THE MOBILE NAVIGATION BOTH SURFACES WORKING: the app drawer open at "
        "390x844 [the Close button + the CRM h2 + the 8 destinations], the "
        "reference's overlay computing rgba(0, 0, 0, 0.8) and OURS oklab(0 0 "
        "0 / 0.8) [the same 80% black — the bg-black/80 contract, the v4 "
        "serialization], the reference locking the body scroll while ours "
        "locks BOTH body + main [the documented superset], Escape closing "
        "with every lock released, a link ride navigating (/Dashboard -> "
        "/Leads) AND auto-closing AND releasing every lock (body visible · "
        "main auto) + the landing disclosure menu (the toggle mounts the "
        "div.md:hidden border-t panel, 6 links byte-identical, ours carrying "
        "aria-expanded — the accessible superset; an in-panel FAQ click "
        "closes it + lands on /#faq, verified on both apps) + the VLM "
        "comparison of the drawer-open pair ours-vs-ref: IDENTICAL in "
        "structure, layout, and styling (the sole note the reference's own "
        "Base44 platform badge — never mirrored, the standing doctrine); "
        "TAILWIND V4 STATE CLEAN + SEO/SITEMAP live-verified (the 11-route "
        "/sitemap.xml byte-format contract · /robots.txt · /manifest.json "
        "200 application/json · the root metadataBase + the per-route "
        "OG/Twitter cards + canonical, curl-verified on the dev server) + "
        "the hygiene legs (no TODO/FIXME · no console.log · no any [the one "
        "grep hit a JSDoc comment word] · .env + db/*.db git-ignored · bun "
        "audit at the pinned census 10 — 4h/5m/1l, all dev-toolchain "
        "transitive, zero runtime exposure; the standing no-mid-rotation-"
        "bump posture holds) + the recent-changes audit (src/ UNCHANGED "
        "since the s205 ship — the s206 + s207 rounds both test-side + "
        "docs only; the owner's newest commit adds docs/session_435.md "
        "only) + the scandihaven reference repo re-reviewed (the "
        "highest-leverage borrows already embodied): THE ROUND'S FIRST "
        "MATERIAL — THE VALUE-BLIND EPOCH GATE (F-207a: the s119 epoch "
        "gate toHaveValue('AED') passes on BOTH epochs because the pending "
        "epoch's fallback values equal the seed values — the fill could "
        "still race the settings GET's store-set, the M-72c4 remount "
        "resetting the input + dropping focus; 88 green sessions were the "
        "race window simply not closing, this round's full run closed "
        "it): D-207a1 THE RESPONSE-WAIT CURE [test-side only, src/ "
        "untouched — the M-72c4 epoch is by-design parity: the waiter "
        "armed BEFORE the goto + awaited after — the deterministic epoch "
        "boundary; once awaited the store-set has landed, the remount has "
        "happened, the input is stable for the fill; no count change, E2E "
        "226 HELD]; THE ROUND'S SECOND MATERIAL — THE STALE CHART-STACK "
        "ROWS (F-207b: the s176 recharts major updated CLAUDE's charts row "
        "+ the PAD's stack row [live-pinned by the WP-1a STACK loop since "
        "s169] but THREE sites rode 31 sessions — the SKILL §2 Charts row "
        "carried BOTH stale cells [the 2.15.x version + the pre-s10 "
        "empty-state-fallback doctrine note], the SKILL §10 chart-blank "
        "row carried the pre-s10 doctrine, the README stack table carried "
        "the 2.15 version; the WP-1a SKILL pin covers only the next + "
        "playwright rows, no pin guarded the Charts row anywhere — the "
        "F-206a genus on the chart-stack axis, the general doc-claim "
        "census the s206 close named): D-207b1 THE CHART-STACK DOC-FAMILY "
        "PIN [a new describe in tests/facts-census.test.ts — the F-169f "
        "home: it-1 the SKILL §2 instance [the version cell read LIVE "
        "from node_modules — the F-109a1 doctrine: a recharts bump fails "
        "the pin until the doc face follows — + the real-chart doctrine "
        "frozen + the stale row + note banned AT the §2 section, the s206 "
        "scoping doctrine] RED-first at birth [exactly 1 RED] · it-2 the "
        "genus [README's row mirrors the live major.minor + the stale row "
        "banned · SKILL §10's blank-chart note carries the live zero-data "
        "doctrine + the stale form banned at the §10 section · the CLAUDE "
        "freeze arm: the 2.15 -> <live> migration form present] RED-first "
        "at birth [exactly 1 RED, zero collateral, 44 standing GREEN] -> "
        "the cure: the three doc flips (the SKILL §2 row to the live "
        "3.10.x + the recharts-DEFAULTS/real-chart doctrine · the SKILL "
        "§10 row to the REAL-chart-at-zero form · the README row to the "
        "live 3.10 + the doctrine note) -> GREEN 46/46; MUTATION-PROVEN "
        "x3: the stale SKILL §2 row re-planted -> exactly 1 RED (it-1) · "
        "the stale README row re-planted -> exactly 1 RED (it-2) · the "
        "SKILL §10 note weakened to the pre-s10 form -> exactly 1 RED "
        "(it-2) — each restored -> GREEN; src/ untouched (docs + tests "
        "only — the baseline-inert construction)]; THE COUNT LADDER UNIT "
        "2851 -> 2853 (+2: the two D-207b1 its) · SUITES 138 HELD (the "
        "pins land in an existing file) · E2E 226 HELD · badge 3077 -> "
        "3079 (the unit+e2e arithmetic: 2853+226 — verified against the "
        "live unit run BEFORE any doc flip: 138/2853 GREEN) + skill-head-"
        "207.py (this surgery — the SKILL v1.204.0, the s206 layer "
        "comment-demoted at its ship counts 2851/226, the s207 layer "
        "live at 2853/226, idempotent) + count-ladder-207.py (assert-"
        "first, idempotent, unique-anchor) + the test-side re-anchors in "
        "the same stroke (the docs-counts layer-axis: first = s207, "
        "second = s206 at its ship 2851/226 · the unit negatives ladder: "
        "the retired 2851 site-forms join the negatives · the dialog-"
        "geometry-parity F-92a3 ladder: the four CLAUDE live positives "
        "re-anchored 2853 + the 2851 forms join the negatives) + the "
        "docs lockstep (the AGENTS Session-207 section · "
        "docs/session_436.md · the PAD s207 inventory row · the plan's "
        "execution record + the worklog entry {Task ID 207}) + the "
        "captures 692-696 (the round's dev-server set: the dashboard at "
        "desktop + the dashboard at 390x844 + the mobile drawer OPEN at "
        "phone [the operator's standing mobile-nav ask] + the landing "
        "mobile disclosure menu OPEN at phone + the login card) + "
        "beneath it 2851 unit checks + 226 e2e checks green; the "
        "session-206 layer (THE OPERATOR'S STANDING VERIFICATION ROUND + "
        "THE STRICTNESS DOC-CONTRACT — the stale AGENTS convention "
        "retired, and the doc family joins the pin; the count ladder "
        "2849 -> 2851 · badge 3075 -> 3077 + the docs lockstep + the "
        "captures 687-691))"
    )

    # 4) splice: the demoted block replaces the live line, the new layer
    #    lands right after it (the house head form)
    text = text.replace(live_line, demoted_block + S207_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s207 layer live at 2853/226")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.204.0" not in t:
    assert t.count("version: 1.203.0") == 1, "the 1.203.0 frontmarker not unique"
    t = t.replace("version: 1.203.0", "version: 1.204.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.203.0 -> 1.204.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.204.0")

t = SKILL.read_text(encoding="utf8")
# the exact-H1 guard (the s197 live catch hardened into the form):
OLD_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.203.0)"
NEW_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.204.0)"
if OLD_H1 not in t:
    print("  no-op  [SKILL H1] version already v1.204.0")
else:
    assert t.count(OLD_H1) == 1, "the v1.203.0 H1 not unique"
    t = t.replace(OLD_H1, NEW_H1, 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL H1] v1.203.0 -> v1.204.0")

# last_updated: the same calendar day as s204/s205/s206 (2026-11-01) — the no-op form
t = SKILL.read_text(encoding="utf8")
if "last_updated: 2026-11-01" in t:
    print("  no-op  [SKILL last_updated] already 2026-11-01 (the same-day form)")
else:
    raise SystemExit("the 2026-11-01 last_updated not found — the s206 form moved")

print("skill-head-207.py done")
