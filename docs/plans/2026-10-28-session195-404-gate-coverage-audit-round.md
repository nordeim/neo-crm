# The session-195 plan — THE 404 GATE-COVERAGE PINS (the post-194 audit round)

Date: 2026-10-28 · Rotation: 195 ·
Task: audit + validate the shipped session-194 state (commit `6d655f9` +
the owner's transcript commit `facdd56` — the session_411 transcript is
this round's rotation trigger), then remediate the genuine gate-coverage
gaps the round's two-skill audit surfaced (the web-application §13/§14
rubric over the s193/s194 product changes + the standing infrastructure:
mobile nav, Tailwind v4 setup, vitest/playwright configs, sitemap/SEO,
the env contract), TDD-first, align every doc in the house lockstep,
capture the dev-server set, push to main via the SSH wrapper.

## 0. The audit (the baseline + the findings triage) — DONE

The baseline gate at the shipped s194 state (the clone to `facdd56`,
tree clean, `bun install` fresh): lint 0/0 · tsc 0 · **138/2811** unit ·
build (the type-gate artifact) · smoke **14/14** · e2e **192/192**
(clean first run, 5.7m — after the fresh-sandbox Playwright chromium
install, the environment gap, not source debt) · probe:ref STABLE
(`46bc2d9c` — the bundle md5 unchanged, demo data still ZERO, the
desktop census 256px/8 links STANDING, the TRUE-390 census STANDING
with the reference's own 1 menu button, the landing census STANDING) ·
db census MATCH (15/24/10/23/12 + 4 users at `<repo>/db/custom.db`,
the ambient `DATABASE_URL` shadow scrubbed via the `prisma-env.ts`
seam on every DB-touching command — the F-123a1 doctrine) · sitemap 11
routes + robots + manifest 200 (smoke check 12) · sweeps CLEAN (desktop
+ TRUE-390 + interior census, all baselines held, seed restored).

The live parity walk (the operator's asks, re-verified standing): the
mobile drawer opened/rode/closed at 390×844 on the dev server (link
ride /Contacts lands, menu closes, trigger re-collapses — the 10-check
e2e battery green inside 192) · the reference login + dashboard +
mobile-menu pair walked live (identical posture: plain login lands at
`/`, the drawer's 8 links + Close + CRM title byte-structural — the
VLM battery 3/3 "Structural Differences: None" on the dashboard
desktop, dashboard mobile + menu-open pairs; the sole residual the
s149 platform badge genus) · Tailwind v4 decode CLEAN (the §12 trap
census: literal-hex `@theme`, no `tailwind.config.*`, vendored
tw-animate, `@utility` cascade law, `--shadow-sm`/`--blur-sm` re-pins
— the audit's zero-finding form) · the vitest/playwright configs ride
the standing contracts (2811 + 192 verified at the full gate) · the
`.env.example` ↔ codebase contract bidirectional (every knob consumed,
every consumer documented).

### The two-skill audit findings (the web-application rubric)

Audit A (the s193/s194 product-code review): **0 Critical / 0 High /
0 Medium / 2 Low / 1 Informational** — the s193/s194 changes verified
clean on every rubric axis (correctness, the v4 idiom, a11y supersets,
React 19 patterns, security, the docs/test lockstep).

Audit B (the standing infrastructure review): **0 Critical / 0 High /
0 Medium / 3 Low / 4 Informational** — the mobile-nav five failure
classes structurally closed, the Tailwind v4 setup conformant on every
§12 trap, both test configs conformant, the SEO surfaces correct, the
env contract bidirectional.

### The triage (the parity doctrine applied finding-by-finding)

**FIX THIS ROUND (gate-coverage gaps — zero product-behavior risk):**

- **D-195a1 (Audit A L-1, Verified)** — the true-HTTP-404 contract
  (D-194a5's own ship claim: "OURS renders the designed 404 AT the
  unknown URL with the TRUE HTTP 404") carries NO standing gate pin:
  the e2e render test's `page.goto()` tolerates any status; no smoke
  leg hits an unknown route; the unit posture pin is source-string
  only. A future catch-all route or redirect regression would keep
  every gate green while falsifying the contract. THE CURE: the status
  assertion added inside the existing S12-P2 e2e test (one
  `page.request.get` line — the born-green freeze form for a genuine
  battery gap, the s194 doctrine's own pattern).
- **D-195a2 (Audit A L-2, Verified)** — the 404 surface (the
  reference's own palette: the slate-300 display heading ≈1.42:1) sits
  OUTSIDE the a11y two-gate's 31 registrations — the sanctioned
  register never adjudicated the one surface whose contrast family is
  pure reference parity. THE CURE: the 404 registered at BOTH widths
  (desktop 1280×800 + phone 390×844, the anon-surface form — the 404
  is session-independent by design) + the sanctioned color-contrast
  matcher for its own palette family with the citation (the navy-chip
  precedent's exact form).
- **D-195a3 (Audit B L-2, Reasoned)** — the Playwright webServer child
  env spreads the whole parent shell: a stray
  `NEO_DISABLE_IN_APP_OTP`/`NEO_DISABLE_IN_APP_RESET` export (a
  polluted shell) would silently flip the auth-surface responses and
  fail the ladder tests with confusing symptoms — the "dev server
  lies" family the config's own N-69a comment warns about. THE CURE:
  both kill-switches pinned to `""` in the child env (deterministic
  e2e regardless of shell state — the test-what-you-deploy form; no
  existing pin weakened).

**DECLINED (documented parity decisions — the doctrine forbids
"fixing" them; recorded here as considered-and-declined):**

- **Audit B L-1** — the sitemap's `/login`+`/signup` omission: byte-
  verified reference parity (the reference's own sitemap carries 11
  routes, no auth routes) + double test-pinned (`metadata.test.ts` +
  `inventory-census.test.ts`). Adding the routes would BREAK the
  parity contract. Standing declined.
- **Audit B L-3** — the shell root's `h-screen` (over `h-dvh`): the
  reference-parity pin; the sheet itself is `h-full`-immune. A known
  limitation, recorded.
- **Audit B I-1** — the `bg-gradient-to-*` v3 spelling: the v4 alias
  compiles identically; every instance a same-family ramp re-pinned in
  `@theme`. Renaming is churn with zero behavior delta. Declined.
- **Audit A I-1** — the error boundaries' omitted `console.error`:
  Next attaches the digest server-side; the leak posture (never render
  `error.message`) is correct. Declined.
- **Audit B I-2** — the probe/sweep script knobs (`REF_URL` etc.)
  absent from `.env.example`: reference-parity tooling with inlined
  defaults, not the app contract (the six-knob `.env.example` is the
  verified app contract). Declined.
- **Audit B I-3** — robots.txt allows everything: byte-verified
  reference parity; the authed pages server-redirect to /login anyway.
  Declined.
- **Audit B I-4** — the drawer's two-nav vs the sidebar's one-nav
  landmark shape: the documented per-family contract; item-level
  parity holds exactly. Declined.

## 1. The TDD ledger (the cure plan)

- **D-195a1** — born-green freeze (the s194 doctrine's form for a
  genuine battery gap: the pinned behavior already shipped, the gate
  carried zero teeth on it). The assertion lands inside the existing
  `unknown routes render the reference's custom 404 page (S12-P2)`
  test — the census HELD (no new `test(` block; the e2e row count
  unchanged). MUTATION-PROOF: a planted catch-all redirect (a temporary
  `redirect("/login")` shape in `not-found.tsx`) must flip the new
  assertion RED exactly once, then restore → GREEN.
- **D-195a2** — born-green registrations: `+2` test() blocks (the
  census 31 → 33; the E2E const 192 → 194; badge 3003 → 3005 — the
  s104 e2e-count lockstep extension applied). The two-gate's own
  GATE-2 form: the sanctioned matcher + citation for the 404's
  palette family must precede the scan (a flagged node citing no
  sanctioned matcher REDs the gate). MUTATION-PROOF: an unsanctioned
  matcher removal must trip the scan at the 404 surface.
- **D-195a3** — config-only, no census delta. The standing config
  contract (the e2e-port seam, the N-69a comments) rides untouched;
  the two new env keys join the pinned block beside
  `DATABASE_URL`/`AUTH_SECRET`.

## 2. The count ladder + the docs lockstep

`count-ladder-195.py` (assert-first, idempotent, unique-anchor — the
house form): the E2E-const flip (`192` → `194` in
`tests/docs-counts.test.ts`) · the SKILL Appendix B a11y row 31 → 33
· the live-tense e2e sites (AGENTS commands row + gate-order · CLAUDE
gate-order · PAD §7.1 Total + HEAD · README badge 3003 → 3005) · the
README Tested row's s195 clause. `skill-head-195.py`: the SKILL
v1.191.0 → v1.192.0 frontmatter + H1 lockstep + the s195 head layer
(the s194 layer comment-demoted at its ship counts 2811/192 — the
s188 lesson: the demoted block's ship line never matches an old form).
The AGENTS Session-195 section · `docs/session_412.md` · the PAD §11
inventory row (the docs-counts census test) · the worklog entry
{Task ID: 195} · this plan's execution record.

## 3. The captures

The dev-server set (the remediated tree): dashboard desktop + mobile
390 + the mobile menu open — the ours-vs-ref pairs the round's live
walk already captured land in the same commit, the s194 captures-194
form.

## 4. The final gate + the push

`bun run gate` (lint 0/0 · tsc 0 · 138/2811 · build · smoke 14/14 ·
CI=1 e2e 194/194) · probe:ref STABLE re-check · db census MATCH · the
SSH-wrapper push to main (`git@github.com:nordeim/neo-crm.git`), no
new branch, the wrapper's verified-push form.

## 5. The execution record (2026-10-28)

Executed as planned, in the order above, all green:

- **The baseline**: lint 0/0 · tsc 0 · 138/2811 unit · build · smoke
  14/14 · e2e 192/192 (clean first run, 5.7m; the fresh-sandbox
  Playwright chromium install an environment gap) · probe:ref STABLE
  at `46bc2d9c` · db census MATCH · sitemap + robots + manifest 200
  · the sweeps CLEAN (desktop + TRUE-390 + the interior census).
- **The live parity walk**: the reference login/dashboard/mobile-menu
  pair walked (the plain login lands at `/` on BOTH apps — the
  from_url round-trip form; the drawer's 8 links + Close + CRM title
  structurally identical; VLM 3/3 "Structural Differences: None");
  OURS opened/rode/closed at 390×844 (the link ride /Contacts lands,
  the menu closes, the trigger re-collapses; the auto-close query at
  768px matches the `md:hidden` trigger).
- **D-195a1**: the wire-status freeze landed inside the S12-P2 e2e
  test (both arms). MUTATION-PROOF: the planted
  `[...catchall]/page.tsx` redirect → RED exactly at the status line
  (Expected 404 / Received 200) → restored → GREEN. The in-boundary
  `redirect()` mutation found the 404 status already committed at
  the render — the L-1 adjudicated at the catch-all shape (the
  mutation note lives in the test's comment).
- **D-195a2**: the two registrations + the sanctioned matcher landed
  (the first GATE-2 run tripped on the axe target form — the BARE
  `h1` selector, not the class form; the matcher re-anchored with
  both arms, per the s171 substring-match doctrine). MUTATION-PROOF:
  the neutralized arms → GATE 2 RED at both widths ("cites no
  sanctioned matcher") → restored → GREEN.
- **D-195a3**: the child-env pins landed in playwright.config.ts
  beside `DATABASE_URL`/`AUTH_SECRET`.
- **D-195a4 (the final-gate catch)**: the full-battery gate caught
  the settings Defaults-tab geometry flake twice (the s164 starved-read
  class — visible face green, bare box read null, a re-render between
  the reads; four clean isolation runs confirmed the window). CURED by
  the house expect.poll idiom on the box reads (the s15/s28
  precedent): the poll retries until both boxes resolve with the
  vertical order intact — semantics unchanged, no pin weakened.
- **The full battery**: e2e **194/194** (5.8m, clean) · unit
  **138/2811** (with the re-anchored lockstep).
- **The lockstep**: skill-head-195.py (SKILL v1.192.0, the s195
  layer live at 2811/194, the s194 layer demoted at its ship counts
  2811/192) · count-ladder-195.py (19 flips, all anchors unique) ·
  the three test-side re-anchors (the docs-counts layer-axis; the
  login-family negatives ladder; the PAD §11 a11y row 407 → 436) ·
  the PAD §7.1 s195 inventory row (scripts/pad-row-195.py) · the
  README walk-contracts s195 clause
  (scripts/readme-clause-195.py) · the AGENTS Session-195 section ·
  session_412.md · the worklog entry {Task ID 195} · this record.
- **The declined findings**: recorded in §0's triage — seven
  considered-and-declined items, each with its parity-doctrine
  rationale (the plan's standing record for the next audit's
  re-triage).
