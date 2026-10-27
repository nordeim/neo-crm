#!/usr/bin/env python3
"""Insert the PAD §7.1 session-195 inventory row after the s194 row.

The house form: the chronological per-session rows ride the Category |
Files | Checks | Location | Framework table; the s195 row follows the
s194 row (the last chronological row) and precedes the Total row.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAD = ROOT / "Project_Architecture_Document.md"

text = PAD.read_text(encoding="utf8")

S195_ROW = (
    "| E2E — THE 404 GATE-COVERAGE PINS (the session-195 post-194 audit "
    "round — its rotation trigger THE OWNER'S NEWEST COMMIT [facdd56: the "
    "session_411 transcript — the s194 round's own execution record]; the "
    "TWO-SKILL AUDIT: the skills/web-application v1.2.0 rubric over the "
    "s193/s194 product-code changes + the operator's named standing "
    "surfaces [the mobile nav — all five failure classes structurally "
    "closed by the s147 Radix re-derivation · the Tailwind v4 setup — all "
    "five §12 traps mitigated · the vitest/playwright configs §14/§3 "
    "conformant · the sitemap/SEO surfaces consuming src/lib/site.ts · "
    "the env contract bidirectional]; the disposition 0 CRITICAL / 0 HIGH "
    "/ 0 MEDIUM / 5 LOW / 5 INFORMATIONAL, every finding triaged under "
    "the parity doctrine — the declined items recorded "
    "considered-and-declined in the plan [the sitemap /login+/signup "
    "omission — byte-verified reference parity, double test-pinned · the "
    "h-screen shell root — reference-parity pinned · the "
    "bg-gradient-to-* v3 alias spelling — compiles identically in v4 · "
    "the boundaries' omitted console.error — the leak posture correct · "
    "the probe-script knobs outside .env.example — tooling, not the app "
    "contract · the robots allow-all — byte-verified parity · the "
    "nav-landmark shape — the documented per-family contract]; the "
    "baseline GREEN at the exact s194 ship state: lint 0/0 · tsc 0 · "
    "138/2811 · build · smoke 14/14 · e2e 192/192 · probe:ref STABLE at "
    "46bc2d9c · census MATCH · sitemap 11 routes + robots + manifest 200 "
    "· the sweeps CLEAN): THREE CURES — D-195a1 THE TRUE-HTTP-404 WIRE "
    "FREEZE [the D-194a5 ship claim carried ZERO gate teeth — page.goto() "
    "tolerates any status, no smoke leg hits an unknown route, the unit "
    "posture pin source-string only; THE CURE: the response status "
    "asserted inside the existing S12-P2 e2e test (page.goto's response "
    "+ the authenticated request.get arm — the both-contexts census "
    "form); born-green — the genuine-battery-gap freeze doctrine; "
    "MUTATION-PROVEN: the planted [...catchall]/page.tsx redirect "
    "flipped the pin RED exactly at the status line (Expected 404 / "
    "Received 200) — the shape every visibility pin survives — then "
    "restored GREEN; the in-boundary redirect() mutation found the 404 "
    "status already committed at the render] · D-195a2 THE TWO-GATE'S "
    "404 REGISTRATIONS [the one anon-reachable page the 31-registration "
    "register never adjudicated — its display heading ≈1.42:1, pure "
    "reference parity; THE CURE: +2 EXPLICIT registrations (desktop "
    "1280×800 + phone 390×844, the anon-surface form — the 404 is "
    "session-independent by design) + the sanctioned color-contrast "
    "matcher with its citation (the navy-chip precedent's form; the axe "
    "target form the BARE h1 selector — the surface's only h1, the s171 "
    "substring-match doctrine; the class arm held for the selector "
    "form); GATE 1 structural ZERO at both widths; MUTATION-PROVEN: the "
    "neutralized matcher arms tripped GATE 2 exactly once per "
    "registration, then restored GREEN] · D-195a3 THE CHILD-ENV "
    "KILL-SWITCH SCRUBBING [the playwright webServer's ...process.env "
    "spread would let a polluted parent shell's "
    "NEO_DISABLE_IN_APP_OTP/RESET silently hide the OTP/reset payloads "
    "the ladder tests assert — the N-69a dev-server-lies family on the "
    "env axis; THE CURE: both pinned to the empty string in the child "
    "env beside DATABASE_URL/AUTH_SECRET — deterministic e2e regardless "
    "of shell state, no existing pin weakened]; the count ladder E2E "
    "192 -> 194 (+2) · SUITES 138 HELD · UNIT 2811 HELD · badge 3003 -> "
    "3005 + skill-head-195.py (the SKILL v1.192.0, the s194 layer "
    "comment-demoted at its ship counts 2811/192, the s195 layer live at "
    "2811/194, idempotent) + count-ladder-195.py (assert-first, "
    "idempotent — 19 flips) + the three test-side re-anchors in the "
    "same stroke (the docs-counts layer-axis [first = s195, second = "
    "s194] · the login-family negatives ladder [the retired **E2E "
    "(Playwright, 192 checks)** joins its negatives, the live positive "
    "re-anchored 194] · the PAD §11 a11y row's line census 407 -> 436) "
    "+ the docs lockstep (the AGENTS Session-195 section · "
    "session_412.md · the PAD §7.1 s195 inventory row · the README "
    "walk-contracts paragraph's s195 clause · the plan's execution "
    "record + the worklog entry [Task ID 195]); the operator's asks "
    "verified standing (the .env DATABASE_URL file:../db/custom.db with "
    "the db/ at the repo root — census MATCH · the vitest + playwright "
    "configs verified at the full gate · the sitemap/SEO surface — smoke "
    "check 12 · the mobile-nav comparison LIVE: the reference's own "
    "login/dashboard/menu walked, the plain login lands at / on BOTH "
    "apps, the VLM battery 3/3 Structural Differences: None — the sole "
    "residual the s149 platform badge genus · the Tailwind v4 decode "
    "CLEAN · the .env.example verified bidirectional and included in "
    "the commit) — session-195, the two-skill audit round, three "
    "gate-coverage cures + seven declined-with-rationale | 1 (the a11y "
    "two-gate spec — the round's census delta) | +2 e2e (194; the "
    "wire-status freeze inside the existing S12-P2 test; 2811 unit "
    "HELD) | `tests/e2e/a11y.spec.ts` | Playwright |\n"
)

# The anchor: the Total row that immediately follows the s194 row.
ANCHOR = "| **Total** | **138** | **2811 unit + 194 e2e** | | |"
assert text.count(ANCHOR) == 1, f"the Total row anchor drifted: {text.count(ANCHOR)}"

if "session-195, the two-skill audit round" in text:
    print("  no-op  [PAD §7.1] the s195 row already present")
else:
    text = text.replace(ANCHOR, S195_ROW + ANCHOR, 1)
    PAD.write_text(text, encoding="utf8")
    print("  flip   [PAD §7.1] the s195 inventory row inserted before the Total row")
