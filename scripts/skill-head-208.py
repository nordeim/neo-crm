#!/usr/bin/env python3
"""skill-head-208.py — the SKILL frontmatter head surgery (the s208 layer).

The arithmetic: the s208 layer ships at 2856/226 (+3 — the three
D-208a1/D-208a2 doc-claim totality-census its in tests/facts-census.test.ts).

The L-169c3 form (the 204-207 template): the verified-single guard.
The demoted s207 layer keeps its SHIP-TIME counts (2853/226) in its own
comment block (the s171-fix precedent). Idempotent: a re-run is a
verified no-op. Also bumps the frontmatter version (1.204.0 ->
1.205.0) + the H1 lockstep (the s197 exact-H1 guard form). The
last_updated flips 2026-11-01 -> 2026-11-02 (the new calendar day).

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live
s207 line still carries its ship count (2853/226), so the demotion is
a verbatim move, and the count-ladder-208.py run that follows flips
only the OTHER doc sites. The retired blocks stay UNTOUCHED.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S208_MARKER = "project_state: 2856 unit checks + 226 e2e checks green; the session-208 layer ("

if S208_MARKER in text:
    print("  no-op  [SKILL head] the s208 layer already live")
else:
    LIVE_MARKER = "project_state: 2853 unit checks + 226 e2e checks green; the session-207 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s207 head marker found {live_count} times"

    # 1) extract the live s207 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s207 layer keeps its ship counts
    #    (2853/226) in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-207 layer (comment-demoted at session-208 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194/s195/s196/s197/s198/\n"
        "     s199/s200/s201/s202/s203/s204/s205/s206 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s208 live layer — the doc-claim totality census
    S208_LAYER = (
        "project_state: 2856 unit checks + 226 e2e checks green; the session-208 layer "
        "(THE DOC-CLAIM TOTALITY CENSUS — the genus the s206/s207 closes both named "
        "as its own rotation's material, taken; the post-207 audit round [the "
        "rotation trigger THE OWNER'S NEWEST COMMIT 6372207: the session_437 "
        "transcript — the s207 round's own execution record]; the baseline gate "
        "GREEN at the exact s207 ship state on a FRESH CLONE: lint 0/0 · tsc 0 · "
        "138/2853 unit · build (the 2 warnings the pre-existing Turbopack tracing "
        "heuristics) · smoke 14/14 · e2e 226/226 CLEAN FIRST RUN (7.9m — the "
        "F-207a response-wait cure green in the exact full-suite context that "
        "caught the flake; the fresh sandbox needed the chromium-1248 install "
        "first, the s206/s207 environment-only precedent) · db census MATCH "
        "(15/24/10/23/12 + 4 users at <repo>/db/custom.db — the operator's "
        "standing .env contract, DATABASE_URL=file:../db/custom.db with db/ at "
        "the repo root, rebuilt from .env.example with a fresh AUTH_SECRET at "
        "the clone): THE SIX DRIFT GATES ALL CLEAN — the four-band sweep at "
        "--fail-on-drift (desktop 1280 · phone 390x844 · tablet 768x1024 · "
        "landscape 1024x768) + the fullpage sweep CLEAN (desktop 0.093% / phone "
        "0.316%, both inside the standing margins) + the interior census "
        "BYTE-PARITY (zero unexplained deltas at all four axes) + probe:ref "
        "STABLE at 46bc2d9c (the demo data still ZERO; the conditional gates "
        "stay killed); THE OPERATOR'S NAMED PARITY FOCUS RE-VERIFIED LIVE WITH "
        "agent-browser AGAINST BOTH APPS LOGGED IN — THE MOBILE NAVIGATION BOTH "
        "SURFACES WORKING: the app drawer open at 390x844 [the Close button + "
        "the CRM h2 + the 8 destinations], the reference's overlay computing "
        "rgba(0, 0, 0, 0.8) and OURS oklab(0 0 0 / 0.8) [the same 80% black — "
        "the bg-black/80 contract, the v4 serialization], the reference locking "
        "the body scroll while ours locks BOTH body + main [the documented "
        "superset], Escape closing with every lock released, a link ride "
        "navigating (/Dashboard -> /Leads) AND auto-closing AND releasing every "
        "lock (body visible · main auto) + the landing disclosure menu (the "
        "toggle mounts the 6-link panel, ours carrying aria-expanded true->false "
        "through the ride — the accessible superset; the FAQ click closes it + "
        "lands on /#faq, verified on both apps) + the VLM comparison of the "
        "drawer-open pair ours-vs-ref: IDENTICAL (the sole note the reference's "
        "own Base44 platform badge — never mirrored, the standing doctrine); "
        "TAILWIND V4 STATE CLEAN + SEO/SITEMAP live-verified (the 11-route "
        "/sitemap.xml · /robots.txt · /manifest.json 200 application/json · the "
        "root metadataBase + the per-route OG/Twitter cards + canonical, "
        "curl-verified on the dev server) + the hygiene legs (no TODO/FIXME · "
        "no console.log [the one grep hit a comment word] · no any [the one "
        "grep hit a JSDoc comment word] · .env + db/*.db git-ignored · bun "
        "audit at the pinned census 10 — 4h/5m/1l, all dev-toolchain "
        "transitive, zero runtime exposure; the standing no-mid-rotation-bump "
        "posture holds) + the recent-changes audit (src/ UNCHANGED since the "
        "s205 ship — the s206/s207/s208 rounds all test-side + docs only; the "
        "owner's newest commit adds docs/session_437.md only) + the "
        "scandihaven reference repo re-reviewed (the highest-leverage borrows "
        "already embodied): THE ROUND'S MATERIAL — THE DOC-CLAIM TOTALITY "
        "CENSUS (F-208a: the census walk executed BEFORE the plan landed — "
        "1516+ claims verified across the mechanically-checkable families: "
        "the bun-run command claims · the backticked repo-path claims · the "
        "ADR references · the transcript references · the route counts [live "
        "29/41, carried correct at every site] · the s109 line-count families "
        "[all live-verified] · the SKILL 5.2 structural cluster [28/22/15/29/"
        "19/10, all live-verified] — THE DOC FAMILY CLEAN at the s207 ship "
        "state, zero stale claims, the three regex-flagged sites all "
        "doctrine-covered [the negative prisma/migrations claim · the PAD "
        "ADR's rejected-alternative prisma/.env narration · the SKILL 16p "
        "lesson with its inline s24 supersession]; the census's structural "
        "finding: ONE unguarded cluster — the SKILL 5.2 'Inventory (verified "
        "counts)' component/page/route-gating census carried NO pin anywhere "
        "reading it, the F-207b exposure [correct-and-unpinned is one refactor "
        "away from a 31-session stale ride]): D-208a1 THE 5.2 STRUCTURAL "
        "LIVE-CENSUS PIN [every count read LIVE from the tree — the F-109a1 "
        "doctrine: the component census [src/components walked for .tsx + the "
        "first-line use-client count] · the page census [src/app walked for "
        "page.tsx, the .jsx render aliases excluded by extension — the s24 "
        "casing-alias doctrine] · the route-gating census [a route file is "
        "GATED when its comment-stripped source carries a requireSession() "
        "call — auth/me's explanatory comment must not mask the live "
        "semantics] — asserted in the exact claim forms + the freeze anchors "
        "28/22/15/29/19/10, either face drifts RED] · D-208a2 THE DOC-CLAIM "
        "TOTALITY CENSUS PIN [the D-205a2 genus-closing pattern on the "
        "doc-claim axes: the command arm — every live-section bun-run claim "
        "resolves in package.json scripts [.env.example joins — its db:push/"
        "db:seed claims are live] · the path + ADR arm — every backticked "
        "repo path resolves [extension-less forms matched against .ts/.tsx "
        "siblings; a +-2-line negative-claim window — the doc itself asserting "
        "absence or rejecting the alternative — is a verified-by-doc claim, "
        "not a phantom] + every ADR-NNN reference resolves in the PAD [both "
        "definition forms: the bold ADR-001..017 + the H3 ADR-018..022]; the "
        "live-section scoping is the s206 doctrine — README/CLAUDE/DEPLOYMENT "
        "whole-file [zero embedded session records, verified], AGENTS head + "
        "Conventions/Git islands [the **Session-50** / **Session-73 markers, "
        "verified unique], SKILL TOC+1-16a + 17-Appendix-B [the 16b+ session "
        "layers + Appendix C/D excluded], PAD 1-7 head + 7.2-12 [the 7.1 "
        "inventory rows are session records]]; born-green at the cured tree "
        "49/49 [the two birth failures were the pin's own anchor-form flaws, "
        "cured in place: the 5.2 gating claim wraps across lines — the "
        "single-line anchor is the count form — + the PAD's TWO ADR "
        "definition forms extracted]; MUTATION-PROVEN x5: the stale component "
        "count re-planted 28->27 -> exactly 1 RED (D-208a1) · the phantom "
        "bun-run claim planted -> exactly 1 RED (the command arm) · the "
        "phantom path claim planted -> exactly 1 RED (the path arm) · the "
        "undefined ADR-099 planted -> exactly 1 RED (the ADR arm) · the "
        "gating count weakened 19->18 -> exactly 1 RED (D-208a1) — each "
        "restored -> GREEN; src/ untouched (tests only — the baseline-inert "
        "construction; no doc flips needed: the doc family is clean, the "
        "round's material IS the pin)]; THE COUNT LADDER UNIT 2853 -> 2856 "
        "(+3: the three D-208a1/D-208a2 its) · SUITES 138 HELD (the pins "
        "land in an existing file) · E2E 226 HELD · badge 3079 -> 3082 (the "
        "unit+e2e arithmetic: 2856+226 — verified against the live unit run "
        "BEFORE any doc flip: 138/2856 GREEN, clean first pass) + skill-head-"
        "208.py (this surgery — the SKILL v1.205.0, the s207 layer comment-"
        "demoted at its ship counts 2853/226, the s208 layer live at 2856/"
        "226, idempotent) + count-ladder-208.py (assert-first, idempotent, "
        "unique-anchor) + the test-side re-anchors in the same stroke (the "
        "docs-counts layer-axis: first = s208, second = s207 at its ship "
        "2853/226 · the unit negatives ladder: the retired 2853 site-forms "
        "join the negatives · the dialog-geometry-parity F-92a3 ladder: the "
        "four CLAUDE live positives re-anchored 2856 + the 2853 forms join "
        "the negatives) + the docs lockstep (the AGENTS Session-208 section · "
        "docs/session_438.md · the PAD s208 inventory row · the plan's "
        "execution record + the worklog entry {Task ID 208}) + the captures "
        "697-701 (the round's dev-server set: the dashboard at desktop + the "
        "dashboard at 390x844 + the mobile drawer OPEN at phone [the "
        "operator's standing mobile-nav ask] + the landing mobile disclosure "
        "menu OPEN at phone + the login card) + beneath it 2853 unit checks "
        "+ 226 e2e checks green; the session-207 layer (THE OPERATOR'S "
        "STANDING VERIFICATION ROUND + THE CHART-STACK DOC-CONTRACT + THE "
        "EPOCH GATE'S RESPONSE-WAIT — the stale recharts row joins the pin, "
        "and the settings e2e's value-blind gate gets a deterministic "
        "boundary; the count ladder 2851 -> 2853 · badge 3077 -> 3079 + the "
        "docs lockstep + the captures 692-696))"
    )

    # 4) splice: the demoted block replaces the live line, the new layer
    #    lands right after it (the house head form)
    text = text.replace(live_line, demoted_block + S208_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s208 layer live at 2856/226")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.205.0" not in t:
    assert t.count("version: 1.204.0") == 1, "the 1.204.0 frontmarker not unique"
    t = t.replace("version: 1.204.0", "version: 1.205.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.204.0 -> 1.205.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.205.0")

t = SKILL.read_text(encoding="utf8")
# the exact-H1 guard (the s197 live catch hardened into the form):
OLD_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.204.0)"
NEW_H1 = "# NEO CRM — Engineering Skill (SKILL.md v1.205.0)"
if OLD_H1 not in t:
    print("  no-op  [SKILL H1] version already v1.205.0")
else:
    assert t.count(OLD_H1) == 1, "the v1.204.0 H1 not unique"
    t = t.replace(OLD_H1, NEW_H1, 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL H1] v1.204.0 -> v1.205.0")

# last_updated: the new calendar day (2026-11-02 — the flip form)
t = SKILL.read_text(encoding="utf8")
if "last_updated: 2026-11-02" in t:
    print("  no-op  [SKILL last_updated] already 2026-11-02")
else:
    assert t.count("last_updated: 2026-11-01") == 1, "the 2026-11-01 last_updated not unique"
    t = t.replace("last_updated: 2026-11-01", "last_updated: 2026-11-02", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL last_updated] 2026-11-01 -> 2026-11-02")

print("skill-head-208.py done")
