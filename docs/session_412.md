# Session 412 — THE 404 GATE-COVERAGE PINS (the session-195 round record)

Date: 2026-10-28 · Rotation: 195 · Agent: main (Z.ai) ·
Plan: `docs/plans/2026-10-28-session195-404-gate-coverage-audit-round.md`

## The round

The post-194 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`facdd56` — the session_411 transcript, the s194 round's own
execution record). The round is the two-skill audit round: the
`skills/web-application` SKILL.md v1.2.0 rubric applied over the
s193/s194 product-code changes (not-found.tsx, not-found-body.tsx,
page-layout.ts, globals.css, the error boundaries) AND the operator's
named standing surfaces (the mobile navigation, the Tailwind v4
setup, the vitest/playwright configs, the sitemap/SEO surfaces, the
env contract) — the audit disposition **0 CRITICAL / 0 HIGH /
0 MEDIUM / 5 LOW / 5 INFORMATIONAL**, every finding triaged under the
parity doctrine (the documented-genera and pinned-superset families
are never "fixed"; the declined items are recorded
considered-and-declined in the plan with their rationale).

## The audit (the baseline + the operator's standing asks)

The baseline gate GREEN at the exact s194 ship state (the clone to
`facdd56`, tree clean, `bun install` fresh): lint 0/0 · tsc 0 ·
**138/2811** unit · build (the type-gate artifact) · smoke **14/14**
· e2e **192/192** (clean first run, 5.7m — the fresh-sandbox
Playwright chromium install an environment gap, never source debt) ·
probe:ref STABLE (`46bc2d9c` — the bundle md5 unchanged, the demo
data still ZERO, the desktop census 256px/8 links STANDING, the
TRUE-390 census STANDING with the reference's own 1 menu button, the
landing census STANDING) · db census MATCH (15/24/10/23/12 + 4 users
at `<repo>/db/custom.db` — the `.env` `DATABASE_URL="file:../db/custom.db"`
with `db/` at the repo root, the operator's standing ask verified) ·
sitemap 11 routes + robots + manifest 200 (smoke check 12) · the
sweeps CLEAN (desktop + TRUE-390 + the interior census, baselines
held, seed restored).

The live parity walk (the operator's asks re-verified standing): the
reference login/dashboard/mobile-menu pair walked live (identical
posture: the plain login lands at `/` on BOTH apps — the from_url
round-trip form; the drawer's 8 links + Close + CRM title
structurally identical — the VLM battery 3/3 "Structural Differences:
None" on the dashboard-desktop, dashboard-mobile-390 and menu-open
pairs, the sole residual the s149 platform badge genus) · the mobile
drawer opened/rode/closed at 390×844 on the dev server (the link ride
/Contacts lands, the menu closes, the trigger re-collapses — the
10-check e2e battery green inside 192; the auto-close query holds at
768px matching the `md:hidden` trigger) · the Tailwind v4 decode
CLEAN (all five §12 traps mitigated: literal-hex `@theme`, no
`tailwind.config.*`, the vendored tw-animate, the `@utility` cascade
law, the `--shadow-sm`/`--blur-sm` re-pins) · the vitest/playwright
configs verified at the full gate · the `.env.example` contract
verified bidirectional (every knob consumed, every consumer
documented).

## The audit findings (the two-skill rubric)

**Audit A** (the s193/s194 product-code review): clean on every rubric
axis — the D-193a1 outline-color cure is the correct v4
`color-mix(in oklab, var(--color-ring) 50%, transparent)` idiom in
`@layer base`; the D-194a1/a3/a4 cures byte-match their pins; the
boundaries' leak posture correct (only the digest rendered). Two
Lows: **L-1** the true-HTTP-404 ship claim carried zero gate teeth;
**L-2** the 404 surface sat outside the a11y two-gate's 31
registrations (its display heading ≈1.42:1, pure reference parity,
never adjudicated).

**Audit B** (the standing infrastructure review): the mobile nav's
five failure classes structurally closed (no manual focus code — the
Radix FocusScope trap; the 768px auto-close; the route-change close;
the scroller lock; the unmounted closed state); the test configs
conformant; the SEO surfaces correct; the env contract bidirectional.
Three Lows: the sitemap's `/login`+`/signup` omission (byte-verified
reference parity, double test-pinned — DECLINED); the Playwright
webServer's whole-shell env spread (the kill-switch hazard — CURED);
the shell root's `h-screen` (reference-parity pinned — DECLINED).
Four Informationals (the `bg-gradient-to-*` v3 alias spelling, the
probe-script knobs outside `.env.example`, the robots allow-all, the
nav-landmark shape) — all declined with rationale in the plan.

## The three cures (the TDD ledger)

**D-195a1 — THE TRUE-HTTP-404 WIRE FREEZE** (Audit A L-1). The
D-194a5 ship claim — OURS renders the designed 404 AT the unknown
URL with the TRUE HTTP 404 — carried ZERO gate teeth: the e2e render
test's `page.goto()` tolerates any status, no smoke leg hits an
unknown route, the unit posture pin is source-string only. A future
catch-all route would have kept every gate green while falsifying
the contract. THE CURE: the response status asserted inside the
existing S12-P2 e2e test — `page.goto`'s response + an authenticated
`request.get` arm (the both-contexts census form). Born-green (the
s194 doctrine for a genuine battery gap). MUTATION-PROVEN: the
planted `[...catchall]/page.tsx` redirect flipped the pin RED
exactly at the status line (Expected 404 / Received 200) — the shape
every visibility pin survives — then restored GREEN; the
in-boundary `redirect()` mutation found the 404 status ALREADY
committed at the render (the audit's L-1 adjudicated at the
catch-all shape).

**D-195a2 — THE TWO-GATE'S 404 REGISTRATIONS** (Audit A L-2). The
one anon-reachable page the register never adjudicated. THE CURE: +2
EXPLICIT registrations (desktop 1280×800 + phone 390×844, the
anon-surface form — the 404 is session-independent by design,
D-194a5) + the sanctioned color-contrast matcher with its citation
(the navy-chip precedent's exact form; the axe target form the BARE
`h1` selector — the surface's only h1, the s171 substring-match
doctrine — the class arm held for the selector form). GATE 1
structural ZERO at both widths (the D-194a2 Link superset's named
arm). MUTATION-PROVEN: the neutralized matcher arms tripped GATE 2
exactly once per registration ("cites no sanctioned matcher"), then
restored GREEN.

**D-195a4 — THE STARVED-READ FLAKE HARDENING** (the final-gate
catch). The final full-battery gate caught the settings Defaults-tab
geometry test RED twice in a row (the s164 starved-read class: the
visibility pre-waits green, the bare boundingBox() read null — a
re-render falling between the two reads), then four clean isolation
runs confirmed the flake window rather than a regression. THE CURE:
the house expect.poll idiom (the s15 New Lead hardening, the s28
zoom-in-95 precedent) applied to the box reads themselves — the
geometry poll retries until BOTH boxes resolve with the vertical
order intact, the assertion semantics unchanged, no pin weakened.

**D-195a3 — THE CHILD-ENV KILL-SWITCH SCRUBBING** (Audit B L-2). The
playwright webServer's `...process.env` spread: a polluted parent
shell exporting `NEO_DISABLE_IN_APP_OTP`/`RESET` would silently
hide the OTP/reset payloads the ladder tests assert (the N-69a
dev-server-lies family on the env axis). THE CURE: both pinned to
the empty string in the child env beside `DATABASE_URL`/
`AUTH_SECRET` — deterministic e2e regardless of shell state, no
existing pin weakened.

## The count ladder + the docs lockstep

The e2e census 192 → **194** (+2: the two 404 registrations) ·
SUITES 138 HELD · UNIT 2811 HELD · badge 3003 → **3005** (the
unit+e2e arithmetic). The head surgery first (skill-head-195.py —
the SKILL v1.192.0, the s194 layer comment-demoted at its ship
counts 2811/192, the s195 layer live at 2811/194, idempotent), then
count-ladder-195.py (assert-first, idempotent, unique-anchor — 19
flips: the docs-counts E2E constant, the README badge + Tested row
+ tree + commands lines, the AGENTS commands + gate-order rows, the
CLAUDE gate-order + commands + pyramid lines, the PAD tree + Total +
HEAD + checklist + commands rows, the SKILL commands + Appendix B
e2e total + wall-clock + the a11y row 31 → 33). The three test-side
re-anchors in the same stroke: the docs-counts layer-axis
(first = s195, second = s194) · the login-family negatives ladder
(the retired `**E2E (Playwright, 192 checks)**` joins its negatives)
· the PAD §11 a11y row's line census 407 → 436. The docs lockstep:
the AGENTS Session-195 section · this record · the PAD §7.1 s195
inventory row · the README walk-contracts paragraph's s195 clause ·
the plan's execution record · the worklog entry {Task ID: 195}.

## The verification (the final gate)

lint 0/0 · tsc 0 · **138/2811** unit · build · smoke **14/14** ·
e2e **194/194** (the full battery, 5.8m) · db census MATCH ·
probe:ref STABLE. The captures: the round's ours-vs-ref dashboard
pairs (desktop + 390 + the menu-open state) + the dev-server set,
landed under `docs/screenshots/`.

## The next rotation's standing material

The data-gated candidates stay suspended at the reference's
zero-data state (the discover-184..195 standing census is the
re-check); the conditional gates unchanged (the fresh-bundle
re-derivation when probe:ref trips; the recharts 4.0 gate). The
audit-coverage posture: the two-gate now adjudicates every surface
reachable at the data-independent state — the 404 family's
gate-teeth gap is closed, and the next round's material, if the
conditional candidates stay killed, remains the re-walk staleness
ladder (the walk50 drawer at 45+ sessions stale, the s144-era
marketing exteriors) or the sweep-state's own coverage audit.
