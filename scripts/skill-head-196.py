#!/usr/bin/env python3
"""skill-head-196.py — the SKILL frontmatter head surgery (the s196 layer).

The L-169c3 form: the verified-single guard. The demoted s195 layer keeps
its SHIP-TIME counts (2811/194) in its own comment block (the s171-fix
precedent). Idempotent: a re-run is a verified no-op. Also bumps the
frontmatter version (1.192.0 -> 1.193.0) + the H1 lockstep +
last_updated (already 2026-10-28 — the same-day rotation, a verified
no-op).

The s188-195 lesson applied: the HEAD surgery runs FIRST — the live s195
line still carries its ship count (194 e2e), so the demotion is a
verbatim move, and the count-ladder-196.py run that follows flips only
the OTHER doc sites. The retired blocks stay UNTOUCHED — the generalized
D-188a1 doctrine holds their ship lines under the unit gate.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S196_MARKER = "project_state: 2811 unit checks + 195 e2e checks green; the session-196 layer ("

if S196_MARKER in text:
    print("  no-op  [SKILL head] the s196 layer already live")
else:
    LIVE_MARKER = "project_state: 2811 unit checks + 194 e2e checks green; the session-195 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s195 head marker found {live_count} times"

    # 1) extract the live s195 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s195 layer keeps its ship counts (2811/194)
    #    in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-195 layer (comment-demoted at session-196 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193/s194 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s196 live layer — the drawer-open spine freeze: the
    #    re-walk staleness round (the walk50 re-run + the one cure)
    S196_LAYER = (
        "project_state: 2811 unit checks + 195 e2e checks green; the session-196 layer "
        "(THE DRAWER-OPEN SPINE FREEZE — the post-195 audit round [the rotation "
        "trigger THE OWNER'S NEWEST COMMIT a3ac674: the session_413 transcript — "
        "the s195 round's own execution record; the baseline gate GREEN at the "
        "exact s195 ship state: lint 0/0 · tsc 0 · 138/2811 unit · build · "
        "smoke 14/14 · e2e 194/194 (clean first run 5.8m) · probe:ref STABLE "
        "at 46bc2d9c (the bundle md5 unchanged, the demo data still ZERO, the "
        "desktop + TRUE-390 + landing censuses STANDING) · db census MATCH "
        "(15/24/10/23/12 + 4 users at <repo>/db/custom.db) · sitemap 11 "
        "routes + robots + manifest 200 (smoke check 12)]: THE ROUND IS THE "
        "RE-WALK STALENESS LADDER — the s412 close's own naming [the walk50 "
        "drawer + the s144-era marketing exteriors], adjudicated by "
        "scripts/discover-196.ts BEFORE the plan [the standing data-gated "
        "re-checks ALL KILLED at the reference's unchanged zero-data state "
        "— the Edit-family rows=1 empty-state rows, rowMenus=0, the "
        "topbar-search populated=0 on both, the dashboard checkbox arms + "
        "the activities Completed-tab empty — the discover-184..196 "
        "standing census · the conditional gates KILLED: probe:ref STABLE "
        "kills the fresh-bundle re-derivation, the registry's latest "
        "recharts 3.10.1 kills the 4.0 gate · the s144-era marketing "
        "exteriors posture byte-equal STANDING: the guest /about + /About + "
        "/contact + /Contact login-wall on BOTH apps with the identical "
        "from_url round-trip form, the landing funnel anchors + rides "
        "identical — the s147 F-147c2 contract, 49 sessions later, no walk "
        "material there]; THE RE-WALK [the walk50 re-run at the current "
        "tree, 19 sessions after the s177 original]: the verdict STABLE — "
        "ZERO NEW DELTAS [OURS 61 rows vs REF 53 — the 8 span.truncate "
        "label wrappers, the s177-adjudicated KEPT superset, standing; "
        "after spine alignment every disagreement maps to the s177 "
        "adjudications: the s173/s177 mb-0 cure holding (header 80/80 · "
        "h2 24,24 240x32 both · nav 0,80 288x332 both · footer 0,428 "
        "288x61 both — the post-cure spine byte-equal two-app) · the "
        "genera standing (the bg-sidebar token vs the reference's "
        "bg-[#2563eb] literal — computed-equal rgb(37,99,235) · the Close "
        "button's stock-version class drift — both dead variants · "
        "lucide's aria-hidden — the version genus · the React 19 useId "
        "format · the icon class order h-5 w-5 shrink-0 — the shrink-0 "
        "superset · the nav aria-labels + aria-current + the focus-visible "
        "ring — the KEPT supersets · the lucide-users icon's internal "
        "child order — the same shapes in a different DOM order, zero "
        "visual delta, lucide-react 0.525.0 unchanged since before s177 · "
        "the sr-only p's y-delta 23-vs-32 — the mb-0 cure's own mechanism "
        "fingerprint, the reference's v3 margin landing on the abspos p, "
        "zero visible pixels]; the 19 sessions of changes since s177 — "
        "the s193a1 outline-color base-layer rule included — introduced "
        "zero drift]: ONE CURE — D-196a1 THE DRAWER-OPEN SPINE FREEZE "
        "[the genuine battery gap: the s177 spine cure + decode carried "
        "only SOURCE-STRING pins (MOBILE_NAV_SHEET.title's mb-0 + the "
        "header literal), the 10-check battery pins BEHAVIOR, the a11y "
        "gate violations, the sweeps the CLOSED pixels — the s177 "
        "defect's own shape (a computed-margin regression shifting the "
        "header 80 -> 88, cascading to every link + the footer) would "
        "keep every gate green while falsifying the walk50-verified "
        "contract; THE CURE: the born-green e2e registration — the "
        "s195a1 wire-freeze doctrine's next member — pinning the "
        "rendered drawer-open spine at the walk50 ledger's own boxes at "
        "TRUE 390x844: the content 288x844 · the header 0,0 288x80 (the "
        "cure's own face) · the h2 24,24 240x32 · the nav 0,80 288x332 · "
        "the 7-link 12,80 264x44 with the 48px pitch · the footer 0,428 "
        "288x61 · the Close 256,16 16x16, the expect.poll starved-read "
        "idiom (s164 -> s195a4) on the box reads; MUTATION-PROVEN: the "
        "planted mb-2 regression (the s177 defect's exact shape — the "
        "h2's :where() margin re-entering the flex-column layout) -> "
        "build -> the pin RED exactly at the header box (Expected 80 / "
        "Received 88) -> restored -> GREEN, the tree clean]; THE COUNT "
        "LADDER E2E 194 -> 195 (+1: the spine registration) · the "
        "mobile-nav spec census 10 -> 11 (MOBILE_NAV_E2E re-anchored, "
        "the live-census pin) · SUITES 138 HELD · UNIT 2811 HELD · "
        "badge 3005 -> 3006 (the unit+e2e arithmetic: 2811+195) + "
        "count-ladder-196.py [assert-first, idempotent, unique-anchor — "
        "the docs-counts E2E constant + the MOBILE_NAV_E2E constant · "
        "the README badge + Tested row + tree + commands + the five "
        "10-check mobile-nav sites · the AGENTS commands + gate-order + "
        "the mobile-nav sites · the CLAUDE gate-order + commands + "
        "pyramid · the PAD tree + Total + HEAD + checklist + commands · "
        "the SKILL commands + Appendix B e2e total + wall-clock + the "
        "mobile-nav row] + the two test-side re-anchors in the same "
        "stroke [the docs-counts layer-axis: first = s196, second = "
        "s195 at its ship 194 · the login-family negatives ladder: the "
        "retired **E2E (Playwright, 194 checks)** joins its negatives, "
        "the live positive re-anchored 195]; the docs lockstep [the "
        "AGENTS Session-196 section · session_414.md · the PAD §7.1 "
        "s196 inventory row · the README walk-contracts paragraph's "
        "s196 clause · the plan's execution record + the worklog entry "
        "{Task ID 196}]; the captures the round's drawer-open set + the "
        "ours-vs-ref pair + the dev-server pages under "
        "docs/screenshots/)"
    )

    # 4) splice: the demoted block replaces the live line, the new layer
    #    lands right after it (the house head form)
    text = text.replace(live_line, demoted_block + S196_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s196 layer live at 2811/195")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.193.0" not in t:
    assert t.count("version: 1.192.0") == 1, "the 1.192.0 frontmarker not unique"
    t = t.replace("version: 1.192.0", "version: 1.193.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.192.0 -> 1.193.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.193.0")

t = SKILL.read_text(encoding="utf8")
if "v1.193.0" not in t:
    assert t.count("v1.192.0") == 1, "the v1.192.0 H1 not unique"
    t = t.replace(
        "# NEO CRM — Engineering Skill (SKILL.md v1.192.0)",
        "# NEO CRM — Engineering Skill (SKILL.md v1.193.0)",
        1,
    )
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL H1] v1.192.0 -> v1.193.0")
else:
    print("  no-op  [SKILL H1] version already v1.193.0")

t = SKILL.read_text(encoding="utf8")
if "last_updated: 2026-10-28" not in t:
    assert t.count("last_updated: 2026-10-27") >= 1, "the 2026-10-27 last_updated not found"
    t = t.replace("last_updated: 2026-10-27", "last_updated: 2026-10-28", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] last_updated 2026-10-27 -> 2026-10-28")
else:
    print("  no-op  [SKILL frontmatter] last_updated already 2026-10-28")

print("skill-head-196: done")
