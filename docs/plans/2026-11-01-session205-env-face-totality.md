# The session-205 plan — THE ENV-FACE TOTALITY CONTRACT (the e2e-port + headless knobs join the documented env face, and the genus closes with a census)

Date: 2026-11-01 · Rotation: 205
Task: the operator's standing instruction set — audit + validate the
shipped session-204 state (commit `eced926` + the owner's transcript
commit `881dc50` — the session_431 transcript is this round's rotation
trigger), re-verify visual + functional parity with the live reference
(`https://neo-crm-8ab2c17c.base44.app/`, logged in with the documented
demo credentials), re-run the standing gates, remediate the identified
gaps, capture the round's screenshots, update the docs, and push to
`main`.

## 0. The audit (the baseline + the discovery — EXECUTED, all green)

The baseline gate at the shipped s204 state (the pull at `881dc50`,
tree clean, `bun install` no-op, the standing `.env` with
`DATABASE_URL="file:../db/custom.db"` — the operator's standing ask,
`db/` at the repo root — db census MATCH 15/24/10/23/12 + 4 users at
`<repo>/db/custom.db`):

- lint 0/0 · tsc 0 · **138/2845** unit · build · smoke 14/14 ·
  **e2e 226/226** (8.1m, clean first run — the s164-lineage flake did
  NOT recur).
- THE SIX DRIFT GATES: the four-band sweep CLEAN at
  `--fail-on-drift` (desktop 1280 · phone 390×844 · tablet 768×1024 ·
  landscape 1024×768) · the fullpage sweep CLEAN (desktop 0.093% /
  phone 0.316%, both inside the standing margins) · the interior
  census **byte-parity, zero unexplained deltas** at all four axes.
- probe:ref STABLE — the reference bundle md5 `46bc2d9c`, the demo
  data still ZERO, the nav census standing. The conditional gates
  stay killed (no fresh bundle, no recharts 4.0).

THE PARITY RE-VERIFICATION (the operator's named focus, probed live
this round with the agent-browser CLI against BOTH apps logged in):

- **THE MOBILE NAVIGATION — BOTH SURFACES, WORKING.** The app drawer:
  open at 390×844 — the Close button + the "CRM" h2 + the 8
  destinations; Escape closes; a link ride navigates
  (`/Dashboard` → `/Leads`) AND auto-closes AND releases BOTH scroll
  locks (body `visible` · main `auto`); the overlay computes
  `oklab(0 0 0 / 0.8)` (the `bg-black/80` contract). The landing
  disclosure menu: the toggle mounts the `div.md:hidden.border-t`
  panel (6 links, `aria-expanded` rides), an in-panel link click
  closes it and lands on the section (`/#faq`). The VLM comparison
  of the drawer-open pair (ours vs the reference): **identical in
  structure, layout, and styling** — the sole note the reference's
  own Base44 platform badge (never mirrored, the standing doctrine).
- **TAILWIND V4 STATE CLEAN**: no `tailwind.config.*` (CSS-first
  `@theme` with literal hex in globals.css), the vendored
  `src/app/vendor/tw-animate.css`, `postcss.config.mjs` on
  `@tailwindcss/postcss`, the documented v4 pitfalls avoided in
  source — the four-band pixel sweep + interior census proving the
  rendered output identical.
- **SEO/SITEMAP live-verified**: the 11-route `/sitemap.xml`
  (byte-format contract) · `/robots.txt` · `/manifest.json` · the
  landing head's description + OG/Twitter cards + canonical +
  og-image (curl-verified on the dev server).
- **Hygiene**: no TODO/FIXME · no `console.log` · no `any` (the one
  grep hit is a JSDoc comment word, not a type) · `.env` +
  `db/*.db` git-ignored · `bun audit` at the s204-pinned census 10
  (4 high / 5 moderate / 1 low — all dev-toolchain transitive, zero
  runtime exposure; the standing no-mid-rotation-bump posture holds).
- **The recent-changes audit**: src/ UNCHANGED since the s203 ship
  (`git diff 257cf15..HEAD -- src/` = empty — the s204 round was
  test-side + docs only, exactly as its record claims); the owner's
  newest commit `881dc50` adds docs + skills/ only (excluded from
  code checking per the standing rule).
- The scandihaven reference repo refreshed + its AGENTS/CLAUDE/PAD/
  SKILL reviewed for the tech-stack patterns (the highest-leverage
  borrows already embodied here: the ActionResult envelope ≈ our
  ok/fail seam, the boot env validation ≈ boot-env.ts, the
  literal-hex @theme rule, the sitemap-parity doctrine).

## 1. The round's material (the gap the audit found)

**THE ENV-FACE TOTALITY GAP.** The full env-consumer census this
round (every `process.env.*` read in src/ + scripts/ + tests/):

- The six app knobs (documented in `.env.example`'s main blocks):
  `DATABASE_URL` · `AUTH_SECRET` · `NEXT_PUBLIC_SITE_URL` ·
  `NEO_PROXY_HOPS` · `NEO_DISABLE_IN_APP_OTP` ·
  `NEO_DISABLE_IN_APP_RESET`.
- The four parity-tool knobs (documented in the s204 D-204a1 block):
  `OUR_URL` · `REF_URL` · `REF_EMAIL` · `REF_PASSWORD`.
- The framework/convention set (excluded by doctrine — never in
  `.env.example`): `NODE_ENV` · `CI` · `NEXT_RUNTIME` ·
  `NEXT_PHASE`.
- **TWO UNDOCUMENTED TOOLING KNOBS — the F-167e genus again, the
  D-204a1 continuation**:
  - `E2E_PORT` — the e2e boot port. The single source lives at
    `tests/e2e/e2e-port.ts:10` (`E2E_PORT_DEFAULT = "3100"`),
    consumed by `playwright.config.ts:23` and the crm.spec 401
    probe (`tests/e2e/crm.spec.ts:901`). An operator with a
    `:3100` port conflict has NO documented knob — the README
    documents the port as a fact ("226 Playwright checks on :3100")
    but never the override.
  - `HEADLESS` — the drift scripts' watch mode (`HEADLESS=0` to
    watch the captures), consumed by all three drift-gate scripts
    (`scripts/sweep.ts:1081` · `scripts/drift-probe.ts:212` ·
    `scripts/interior-census.ts:1986`), documented ONLY in the
    scripts' own header comments — invisible to an operator who
    reads the env face.

## 2. The cure (TDD)

**D-205a1 — THE E2E-PORT + HEADLESS PINS (RED-first).** One new
describe block in `tests/facts-census.test.ts` (the .env.example
content battery's own home — the D-204a1 precedent): pins that
`.env.example` documents both knobs, and that the documented
`E2E_PORT` default matches the e2e-port module's OWN source literal
(the F-109a1 live-census doctrine — a default change in the tool
fails the pin until the doc face follows). RED at birth on the
pre-fix file (verified: exactly the new its fail, zero collateral) →
the cure: the two knobs appended to the `.env.example`
parity-tools block (commented out — the defaults remain
authoritative; the block is documentation, not configuration) →
GREEN.

**D-205a2 — THE ENV-FACE TOTALITY CENSUS (the genus-closing pin).**
The D-204a1 round pinned the four knobs it found; this round's
audit found TWO MORE the pin never saw — the per-knob pin form
cannot close the genus, it only fixes the instance. THE CURE: a
census pin that walks src/ + scripts/ + tests/ (every .ts/.tsx
file) for `process.env.*` consumers, subtracts the
framework/convention exclusion set (`NODE_ENV` · `CI` ·
`NEXT_RUNTIME` · `NEXT_PHASE`), and asserts EVERY remaining knob
appears in `.env.example` — the genus closes permanently: any
future env var added to the code without a doc face trips the
census RED at the unit gate. Born-green at the cured tree (D-205a1
lands first); MUTATION-PROVEN: a planted new `process.env.*`
consumer in src/ trips exactly the census → restored → GREEN.

**The .env.example bidirectionality holds**: the six-knob contract
pins + the D-204a1 pins are toContain-form — the appended lines
cannot trip them (verified by running the full unit layer after the
edit).

## 3. The re-anchors (the count ladder + the docs lockstep)

- `scripts/count-ladder-205.py` (the 204 form, unit-only): UNIT
  **2845 → 2849** (+4 — the two D-205a1 its + the two D-205a2 its) ·
  SUITES 138 HELD (the pins land in an existing file) · E2E 226
  HELD · badge **3071 → 3075** (the unit+e2e arithmetic: 2849+226).
  The retired 2845 site-forms join the negatives (the s192
  doctrine). Sites: README (badge · Tested row · tree · commands) ·
  AGENTS (commands table · gate-order) · CLAUDE (gate-order ·
  commands · pyramid · coverage seam) · PAD (tree · Total · HEAD ·
  checklist · commands) · SKILL (commands · Appendix B unit total) ·
  the test-side re-anchors (docs-counts UNIT constant + layer-axis ·
  dialog-geometry-parity F-92a3 ladder).
- `scripts/skill-head-205.py`: the SKILL frontmatter v1.201.0 →
  **v1.202.0**, `last_updated` stays 2026-11-01, the H1 lockstep,
  the s204 layer comment-demoted at its ship counts (2845/226), the
  new s205 head layer.
- The AGENTS Session-205 section · the PAD session inventory row ·
  `docs/session_432.md` (the transcript) · the worklog Task ID 205
  entry · this plan's execution record (§5).

## 4. The final gate

lint 0/0 · tsc 0 · **138/2849** unit · build · smoke 14/14 ·
`CI=1 bun run test:e2e` 226/226 · the desktop + phone sweeps re-run
CLEAN (the cures are baseline-inert by construction — `.env.example`
never enters the build — but the house proves it) · db census MATCH ·
`git status` clean of secrets/dbs.

## 5. The execution record (filled at execution — all claims live-verified)

- §0 the audit: executed in full before the plan landed (the baseline
  gate + the six drift gates + the probe + the parity re-verification
  with agent-browser against BOTH apps + the VLM drawer comparison +
  the SEO/sitemap curl legs + the hygiene greps + the env-consumer
  census). All green, as recorded in §0. The e2e leg ran
  clean-first-run (8.1m).
- D-205a1 RED-at-birth: the describes added to tests/facts-census.test.ts
  → `bunx vitest run tests/facts-census.test.ts` → **exactly 3 RED**
  (the two D-205a1 its + the D-205a2 totality census — all three
  assert the new doc face) + **1 born-green** (the D-205a2 reverse
  arm — .env.example currently offers only real consumers), 41
  standing GREEN, zero collateral.
- D-205a1 GREEN: the two knobs appended to the .env.example
  parity-tools block → **44/44**.
- D-205a1 MUTATION-PROOF: the planted `E2E_PORT_DEFAULT` mutation
  (3100 → 3200) → **exactly 1 RED** (the live-defaults pin trips —
  the doc face no longer matches the tool source) → restored →
  44/44.
- D-205a2 MUTATION-PROOF ×2: the planted new
  `process.env.NEO_FUTURE_KNOB` consumer in src/lib/site.ts →
  **exactly 1 RED** (the totality census trips) → restored; the
  planted phantom `# NEO_PHANTOM_KNOB=1` line appended to
  .env.example → **exactly 1 RED** (the reverse arm trips) →
  restored → 44/44. src/ untouched by the cures (git diff --stat
  = 0 after the restores).
- The ladder: skill-head-205.py (3 flips: the s205 layer live, the
  frontmatter 1.201.0 → 1.202.0, the H1; last_updated stays
  2026-11-01 — the same-day no-op form; idempotent — the re-run a
  verified no-op) + count-ladder-205.py (**26 flips** — the
  README/AGENTS/CLAUDE/PAD/SKILL live sites + the docs-counts UNIT
  constant + the layer-axis pair [first = s205, second = s204 at
  its ship 2845/226] + the 2845 negatives + the dialog-geometry-
  parity F-92a3 four positives + negatives; the re-run 26 no-ops) →
  **138/2849 GREEN** with every doc pin passing — the arithmetic
  verified against the live unit run BEFORE any doc flip (clean
  first pass, no in-flight corrections).
- The .env bidirectionality: the .env rebuilt from the extended
  .env.example (the operator's AUTH_SECRET preserved) — the live
  (uncommented) lines identical, the app boots, db census MATCH.
- The captures 682-686: VLM-verified (the dashboard at desktop +
  390 · the drawer OPEN at phone · the landing mobile menu OPEN at
  phone · the login card — each confirmed showing the intended
  page/state).
- The final gate: see the session_432.md transcript close.

## The declined list (this round)

- A mid-rotation eslint/vite-family bump to cure the advisories —
  the standing no-mid-rotation-bump posture (a toolchain bump forces
  the pixel baselines' re-derivation — its own rotation).
- Documenting the framework/convention set (`NODE_ENV`/`CI`/
  `NEXT_RUNTIME`/`NEXT_PHASE`) in `.env.example` — framework-owned
  knobs never belong in the app's env face (the D-195a1 scrubbing
  precedent runs the other way: the e2e child env is PINNED, not
  documented).
- The s120-era interactive-table re-walk kill adjudication — the
  standing kill re-verified (the leads family source frozen since
  s113, the reference bundle STABLE); no new walk material exists at
  the zero-data reference state.
- The `.env` working-tree refresh (copying the new block into the
  local untracked `.env`) — `.env` is operator-local and untracked;
  the block is inert comments; the bidirectional rebuild ritual
  covers the verification.
