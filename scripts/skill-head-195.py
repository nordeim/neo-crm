#!/usr/bin/env python3
"""skill-head-195.py — the SKILL frontmatter head surgery (the s195 layer).

The L-169c3 form: the verified-single guard. The demoted s194 layer keeps
its SHIP-TIME counts (2811/192) in its own comment block (the s171-fix
precedent). Idempotent: a re-run is a verified no-op. Also bumps the
frontmatter version (1.191.0 -> 1.192.0) + the H1 lockstep +
last_updated (2026-10-27 -> 2026-10-28).

The s188-194 lesson applied: the HEAD surgery runs FIRST — the live s194
line still carries its ship count (192 e2e), so the demotion is a
verbatim move, and the count-ladder-195.py run that follows flips only
the OTHER doc sites. The retired blocks stay UNTOUCHED — the generalized
D-188a1 doctrine holds their ship lines under the unit gate.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "neo-crm_SKILL.md"

text = SKILL.read_text(encoding="utf8")

S195_MARKER = "project_state: 2811 unit checks + 194 e2e checks green; the session-195 layer ("

if S195_MARKER in text:
    print("  no-op  [SKILL head] the s195 layer already live")
else:
    LIVE_MARKER = "project_state: 2811 unit checks + 192 e2e checks green; the session-194 layer ("
    live_count = text.count(LIVE_MARKER)
    assert live_count == 1, f"the live s194 head marker found {live_count} times"

    # 1) extract the live s194 line — its ship count IS the live count
    #    (the ladder has not run yet), so the demotion is verbatim
    start = text.index(LIVE_MARKER)
    end = text.index("\n", start)
    live_line = text[start:end]

    # 2) the demoted block — the s194 layer keeps its ship counts (2811/192)
    #    in its OWN comment wrapper (the s171-fix precedent)
    demoted_block = (
        "<!-- retired session-194 layer (comment-demoted at session-195 — the house\n"
        "     single-key form; the s141/s143/s165/s166/s167/s168/s169/s170/s171/\n"
        "     s172/s173/s174/s176/s177/s178/s179/s180/s181/s182/s183/s184/s185/\n"
        "     s186/s187/s188/s189/s190/s191/s192/s193 layers sit demoted above it):\n\n"
        + live_line
        + "\n-->\n\n"
    )

    # 3) the new s195 live layer — the 404 gate-coverage round: the
    #    two-skill audit's three cures (the wire-status freeze + the
    #    two-gate's 404 registrations + the child-env scrubbing)
    S195_LAYER = (
        "project_state: 2811 unit checks + 194 e2e checks green; the session-195 layer "
        "(THE 404 GATE-COVERAGE PINS — the post-194 audit round [the rotation "
        "trigger THE OWNER'S NEWEST COMMIT facdd56: the session_411 transcript — "
        "the s194 round's own execution record; the baseline gate GREEN at the "
        "exact s194 ship state: lint 0/0 · tsc 0 · 138/2811 unit · build · "
        "smoke 14/14 · e2e 192/192 (clean first run 5.7m, the fresh-sandbox "
        "chromium install an environment gap, never source debt) · probe:ref "
        "STABLE at 46bc2d9c (the bundle md5 unchanged, the demo data still "
        "ZERO, the desktop census 256px/8 links STANDING, the TRUE-390 census "
        "STANDING with the reference's own 1 menu button, the landing census "
        "STANDING) · db census MATCH (15/24/10/23/12 + 4 users at "
        "<repo>/db/custom.db — the F-123a1 ambient-shadow doctrine held) · "
        "sitemaps 11 routes + robots + manifest 200 (smoke check 12) · the "
        "sweeps CLEAN (desktop + TRUE-390 + the interior census, baselines "
        "held, seed restored)]: THE TWO-SKILL AUDIT [the skills/web-application "
        "SKILL.md v1.2.0 rubric over the s193/s194 product-code changes + "
        "the standing infrastructure — the operator's named surfaces: the "
        "mobile nav (all five §-failure classes structurally closed by the "
        "s147 Radix re-derivation — the focus trap, the 768px auto-close "
        "query matching the md:hidden trigger, the route-change close, the "
        "scroller lock, the unmounted closed state) · the Tailwind v4 setup "
        "(all five §12 traps mitigated: literal-hex @theme, no "
        "tailwind.config.*, the vendored tw-animate, the @utility cascade "
        "law, the --shadow-sm/--blur-sm re-pins) · the vitest/playwright "
        "configs (§14/§3 conformant) · the SEO surfaces (sitemap/robots/"
        "manifest/metadataBase all consuming src/lib/site.ts) · the env "
        "contract (.env.example bidirectional: every knob consumed, every "
        "consumer documented) — 0 CRITICAL / 0 HIGH / 0 MEDIUM / 5 LOW / 5 "
        "INFORMATIONAL across both audits, the findings triaged under the "
        "parity doctrine: the sitemap's /login+/signup omission · the "
        "h-screen shell root · the bg-gradient-to-* v3 alias spelling · the "
        "boundaries' omitted console.error · the scripts/* probe knobs · "
        "the robots allow-all · the nav-landmark shape — ALL DECLINED, "
        "documented parity decisions or zero-delta churn, recorded "
        "considered-and-declined in the plan]: THREE CURES — D-195a1 THE "
        "TRUE-HTTP-404 WIRE FREEZE [D-194a5's ship claim — OURS renders the "
        "designed 404 AT the unknown URL with the TRUE HTTP 404 — carried "
        "ZERO gate teeth: the e2e render test's page.goto() tolerates any "
        "status, no smoke leg hits an unknown route, the unit posture pin "
        "source-string only; a future catch-all route would have kept every "
        "gate green while falsifying the contract; THE CURE: the response "
        "status asserted inside the existing S12-P2 e2e test (page.goto's "
        "response + the authenticated request.get arm, the both-contexts "
        "census form) — born-green, the genuine-battery-gap freeze doctrine; "
        "MUTATION-PROVEN: the planted [...catchall]/page.tsx redirect "
        "flipped the pin RED exactly at the status line (Expected 404 / "
        "Received 200) — the shape every visibility pin survives, then "
        "restored GREEN; the in-boundary redirect mutation found the 404 "
        "status ALREADY committed at the render — the audit's L-1 "
        "adjudicated at the catch-all shape] · D-195a2 THE TWO-GATE'S 404 "
        "REGISTRATIONS [the one anon-reachable surface the 31-registration "
        "register never adjudicated — its display heading rides the "
        "reference's own designed palette (text-slate-300 on slate-50, the "
        "walk67-decoded h1 face) ≈1.42:1, pure reference parity never "
        "sanctioned; THE CURE: +2 EXPLICIT registrations (desktop 1280×800 "
        "+ phone 390×844, the anon-surface form — the 404 is "
        "session-independent by design, D-194a5) + the sanctioned "
        "color-contrast matcher with its citation (the navy-chip "
        "precedent's exact form; the axe target form the BARE h1 selector "
        "— the surface's only h1, the s171 substring-match doctrine — the "
        "class arm held for the selector form); GATE 1 structural ZERO on "
        "the 404 at both widths (the D-194a2 Link superset's named arm, "
        "the s19 aria-hidden supersets); MUTATION-PROVEN: the neutralized "
        "matcher arms tripped GATE 2 exactly once per registration (cites "
        "no sanctioned matcher), then restored GREEN] · D-195a3 THE "
        "CHILD-ENV KILL-SWITCH SCRUBBING [the playwright webServer's "
        "...process.env spread — a polluted parent shell exporting "
        "NEO_DISABLE_IN_APP_OTP/RESET would silently hide the OTP/reset "
        "payloads the ladder tests assert, the N-69a dev-server-lies "
        "family on the env axis; THE CURE: both pinned to the empty string "
        "in the child env beside DATABASE_URL/AUTH_SECRET — deterministic "
        "e2e regardless of shell state, no existing pin weakened]; the "
        "count ladder E2E 192 -> 194 (+2: the two 404 registrations) · "
        "SUITES 138 HELD (the one-suite doctrine) · UNIT 2811 HELD · "
        "badge 3003 -> 3005 (the unit+e2e arithmetic: 2811+194) + "
        "count-ladder-195.py: assert-first, idempotent, unique-anchor — "
        "the e2e-count lockstep applied (the s104/s172 doctrine: every "
        "live-tense e2e site re-anchored in the same commit); the parity "
        "re-verification standing [the reference login/dashboard/mobile-"
        "menu pair walked live: the plain login lands at / on BOTH, the "
        "drawer's 8 links + Close + CRM title structurally identical, the "
        "VLM battery 3/3 Structural Differences: None (the sole residual "
        "the s149 platform badge genus) · the mobile drawer opened/rode/"
        "closed at 390×844 on the dev server (the link ride /Contacts "
        "lands, the menu closes, the trigger re-collapses) · the "
        "Tailwind v4 decode CLEAN · the vitest/playwright configs verified "
        "at the full gate · the .env.example contract verified "
        "bidirectional] ) + beneath it "
        + live_line.replace("project_state: ", "", 1)
    )

    # 4) splice: the demoted block + the new live layer replace the live line
    text = text.replace(live_line, demoted_block + S195_LAYER, 1)
    SKILL.write_text(text, encoding="utf8")
    print("  flip   [SKILL head] the s194 layer demoted at its ship counts (2811/192)")
    print("  flip   [SKILL head] the s195 layer live at 2811/194")

# --- the frontmatter version + the H1 lockstep (idempotent) -------------------
t = SKILL.read_text(encoding="utf8")
if "version: 1.192.0" not in t:
    assert t.count("version: 1.191.0") == 1, "the 1.191.0 frontmarker not unique"
    t = t.replace("version: 1.191.0", "version: 1.192.0", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] version 1.191.0 -> 1.192.0")
else:
    print("  no-op  [SKILL frontmatter] version already 1.192.0")

t = SKILL.read_text(encoding="utf8")
if "v1.192.0" not in t:
    assert t.count("v1.191.0") == 1, "the v1.191.0 H1 not unique"
    t = t.replace(
        "# NEO CRM — Engineering Skill (SKILL.md v1.191.0)",
        "# NEO CRM — Engineering Skill (SKILL.md v1.192.0)",
        1,
    )
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL H1] v1.191.0 -> v1.192.0")
else:
    print("  no-op  [SKILL H1] version already v1.192.0")

t = SKILL.read_text(encoding="utf8")
if "last_updated: 2026-10-28" not in t:
    assert t.count("last_updated: 2026-10-27") >= 1, "the 2026-10-27 last_updated not found"
    t = t.replace("last_updated: 2026-10-27", "last_updated: 2026-10-28", 1)
    SKILL.write_text(t, encoding="utf8")
    print("  flip   [SKILL frontmatter] last_updated 2026-10-27 -> 2026-10-28")
else:
    print("  no-op  [SKILL frontmatter] last_updated already 2026-10-28")

print("skill-head-195: done")
