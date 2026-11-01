# The session-206 plan — THE STRICTNESS DOC-CONTRACT (the stale AGENTS convention retired, and the doc family joins the pin)

Date: 2026-11-01 · Rotation: 206
Task: the operator's standing instruction set — audit + validate the
shipped session-205 state (commit `efe14e7` + the owner's transcript
commit `60d04e3` — the session_433 transcript is this round's rotation
trigger), re-verify visual + functional parity with the live reference
(`https://neo-crm-8ab2c17c.base44.app/`, logged in with the documented
demo credentials), re-run the standing gates, remediate the identified
gaps, capture the round's screenshots, update the docs, and push to
`main`.

## 0. The audit (the baseline + the discovery — EXECUTED, all green)

The baseline gate at the shipped s205 state (the fresh clone at
`60d04e3`, `bun install`, the standing `.env` rebuilt from
`.env.example` with a fresh `AUTH_SECRET`,
`DATABASE_URL="file:../db/custom.db"` — the operator's standing ask,
`db/` at the repo root — db:push + db:seed, db census MATCH
15/24/10/23/12 + 4 users at `<repo>/db/custom.db`):

- lint 0/0 · tsc 0 · **138/2849** unit · build · smoke 14/14 ·
  **e2e 226/226** (8.1m, clean run — one environment-only false start:
  the fresh sandbox lacked the Playwright browser binary, cured by
  `bunx playwright install chromium`; zero code involvement).
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
  destinations; the reference's overlay computes `rgba(0, 0, 0, 0.8)`
  and ours `oklab(0 0 0 / 0.8)` (the same 80% black — the v4
  serialization); the reference locks the body scroll while open,
  ours locks BOTH (body + the main scroller — the documented
  superset); Escape closes on both; a link ride navigates
  (`/Dashboard` → `/Leads`) AND auto-closes AND releases every lock
  (body `visible` · main `auto`). The landing disclosure menu: the
  toggle mounts the `div.md:hidden` panel (6 links: Features /
  Preview / Pricing / FAQ / Contact / Open dashboard — identical on
  both apps; ours carries `aria-expanded`, the accessible superset),
  an in-panel FAQ click closes it and lands on `/#faq`. The VLM
  comparison of the drawer-open pair (ours vs the reference):
  **identical** in structure, layout, and styling — the sole note
  the reference's own Base44 platform badge (never mirrored, the
  standing doctrine).
- **TAILWIND V4 STATE CLEAN**: no `tailwind.config.*` (CSS-first
  `@theme` with literal hex in globals.css), the vendored
  `src/app/vendor/tw-animate.css`, `postcss.config.mjs` on
  `@tailwindcss/postcss`, the documented v4 pitfalls avoided in
  source — the four-band pixel sweep + interior census proving the
  rendered output identical.
- **SEO/SITEMAP live-verified**: the 11-route `/sitemap.xml`
  (byte-format contract) · `/robots.txt` (the Sitemap line) ·
  `/manifest.json` 200 `application/json` · the landing head's
  description + OG/Twitter cards + canonical + og-image
  (curl-verified on the dev server).
- **Hygiene**: no TODO/FIXME · no `console.log` · no `any` (the one
  grep hit is a JSDoc comment word, not a type) · `.env` +
  `db/*.db` git-ignored · `bun audit` at the pinned census 10
  (4 high / 5 moderate / 1 low — all dev-toolchain transitive, zero
  runtime exposure; the standing no-mid-rotation-bump posture holds).
- **The recent-changes audit**: src/ UNCHANGED since the s205 ship
  (`git diff efe14e7..HEAD --stat -- src/` = empty — the s205 round
  was test-side + docs only, exactly as its record claims); the
  owner's newest commit `60d04e3` adds `docs/session_433.md` only.
- The scandihaven reference repo refreshed + its AGENTS/CLAUDE/PAD/
  SKILL reviewed for the tech-stack patterns (the highest-leverage
  borrows already embodied here: the ActionResult envelope ≈ our
  ok/fail seam, the boot env validation ≈ boot-env.ts, the
  literal-hex @theme rule, the sitemap-parity doctrine).

## 1. The round's material (the gap the audit found)

**THE STALE STRICTNESS CONVENTION (F-206a).** The s174 hardening
(ADR-019) flipped `tsconfig.json` to FULL strictness — `"strict":
true`, the `noImplicitAny: false` escape hatch RETIRED — and pinned
the CODE at `tests/type-gate.test.ts` ("tsconfig.json runs FULL
strictness"). Every doc site was updated in the same stroke —
CLAUDE.md's stack row ("**TypeScript** full strict (session-174: …
retired)"), the PAD's stack table ("Full strict mode (session-174: …
retired)"), the SKILL's §2 table ("FULL strict (s174: … retired)"),
even AGENTS.md's OWN architecture-facts section (line ~49:
"`tsconfig.json` runs full strictness (the `noImplicitAny: false`
escape hatch is gone)") — but ONE site was missed:

- `AGENTS.md` line ~3122, the "Conventions that differ from
  defaults" section, still carries the PRE-174 form:
  `TypeScript strict **except `noImplicitAny: false`** (sandbox
  default, kept).`

The stale bullet rode **31 sessions of green gates** (s174 → s205):
the type-gate pin guards the tsconfig, the docs-counts pin guards
the counts, the facts-census pins the versions/colors/tokens/routes/
models/env — but NO pin guards the strictness DOC CLAIMS. The doc
rotted in plain sight while contradicting the code, ADR-019, the
other three docs, and AGENTS.md's own architecture-facts section.
The code-wins rule (the repo's own skill §19): the code wins, the
doc is fixed in the same commit — and the D-205a2 precedent applies:
a rotted-instance fix alone leaves the genus open.

## 2. The cure (TDD)

**D-206a1 — THE STRICTNESS DOC-FAMILY PIN (RED-first).** One new
describe-adjacent pair of `it`s in `tests/type-gate.test.ts` (the
F-174b home — the suite that already pins the tsconfig side):

- it 1 (RED at birth): the AGENTS conventions section carries the
  LIVE full-strict claim — the pre-174 exception form retired
  (F-206a). Asserts the stale fingerprint (`strict **except`) is
  ABSENT from AGENTS.md and the new live bullet is PRESENT.
- it 2 (born-green): the strictness doc-family lockstep — CLAUDE +
  PAD + SKILL mirror the live tsconfig (the F-206a genus pin).
  Asserts each doc's stack-table full-strict claim is present
  (the three sites are correct today; the pin holds them there).

RED at birth verified (exactly the new it 1 fails, zero collateral)
→ the cure: the AGENTS.md conventions bullet flipped to the
full-strict form → GREEN.

**MUTATION-PROVEN ×2:** the stale form re-planted in AGENTS.md →
exactly 1 RED (it 1's negative); the CLAUDE.md stack row weakened to
the pre-174 form → exactly 1 RED (it 2's positive) — each restored
→ GREEN. src/ untouched by the cures (docs + tests only — the
baseline-inert construction).

**The .env.example bidirectionality holds**: the standing face (the
six app knobs + the four s204 parity knobs + E2E_PORT + HEADLESS =
the D-205a2 totality) is unchanged this round; the working `.env`
was rebuilt from it (fresh `AUTH_SECRET`), the app boots, db census
MATCH — the ritual re-verified at the fresh clone.

## 3. The re-anchors (the count ladder + the docs lockstep)

- `scripts/count-ladder-206.py` (the 205 form, unit-only): UNIT
  **2849 → 2851** (+2 — the two D-206a1 its) · SUITES 138 HELD (the
  pins land in an existing file) · E2E 226 HELD · badge
  **3075 → 3077** (the unit+e2e arithmetic: 2851+226). The retired
  2849 site-forms join the negatives (the s192 doctrine). Sites:
  README (badge · Tested row · tree · commands) · AGENTS (commands
  table · gate-order) · CLAUDE (gate-order · commands · pyramid ·
  coverage seam) · PAD (tree · Total · HEAD · checklist · commands)
  · SKILL (commands · Appendix B unit total) · the test-side
  re-anchors (docs-counts UNIT constant + layer-axis pair [first =
  s206, second = s205 at its ship 2849/226] + the 2849 negatives ·
  the dialog-geometry-parity F-92a3 ladder).
- `scripts/skill-head-206.py`: the SKILL frontmatter v1.202.0 →
  **v1.203.0**, `last_updated` stays 2026-11-01 (the same-day form),
  the H1 lockstep, the s205 layer comment-demoted at its ship counts
  (2849/226), the new s206 head layer.
- The AGENTS Session-206 section · the PAD session inventory row ·
  `docs/session_434.md` (the transcript) · the worklog Task ID 206
  entry · this plan's execution record (§5).

## 4. The final gate

lint 0/0 · tsc 0 · **138/2851** unit · build · smoke 14/14 ·
`CI=1 bun run test:e2e` 226/226 · the desktop + phone sweeps re-run
CLEAN (the cures are baseline-inert by construction — AGENTS.md and
test files never enter the build — but the house proves it) · db
census MATCH · `git status` clean of secrets/dbs.

## 5. The execution record (filled at execution — all claims live-verified)

- §0 the audit: executed in full before the plan landed (the
  baseline gate + the six drift gates + the probe + the parity
  re-verification with agent-browser against BOTH apps + the VLM
  drawer comparison + the SEO/sitemap curl legs + the hygiene greps
  + the recent-changes diff + the scandihaven review). All green, as
  recorded in §0.
- D-206a1 RED-at-birth: the two its appended to
  tests/type-gate.test.ts → `bunx vitest run tests/type-gate.test.ts`
  → **exactly 1 RED** (it-1, the AGENTS instance — both its
  assertions fail: the stale fingerprint present + the live form
  absent) + **1 born-green** (it-2, the doc-family lockstep), 5
  standing GREEN, zero collateral.
- D-206a1 GREEN: the AGENTS.md conventions bullet flipped to the
  full-strict form → **7/7**.
- D-206a1 MUTATION-PROOF ×2: the stale form re-planted in AGENTS.md
  → **exactly 1 RED** (it-1 trips) → restored → 7/7; the CLAUDE.md
  stack row weakened to the pre-174 form → **exactly 1 RED** (it-2
  trips) → restored → 7/7. src/ untouched by the cures (git diff
  --stat after the restores: AGENTS.md + tests/type-gate.test.ts
  only).
- The mid-flight pin repair (recorded): the it-1 negative was born
  FILE-WIDE; the AGENTS Session-206 section's own historical quote
  of the stale form (the record convention) tripped it after the
  docs lockstep landed — the pin re-scoped to the CONVENTIONS
  SECTION (the claim's home) and Mutation 1 re-proven against the
  scoped form (exactly 1 RED → restored → GREEN). The scope repair
  is the s188 doctrine applied at birth: historical records keep
  their ship-time quotes; a pin bans the LIVE claim site.
- The ladder: skill-head-206.py (3 flips: the s206 layer live, the
  frontmatter 1.202.0 → 1.203.0, the H1; last_updated stays
  2026-11-01 — the same-day no-op form; idempotent — the re-run a
  verified no-op) + count-ladder-206.py (**26 flips** — the
  README/AGENTS/CLAUDE/PAD/SKILL live sites + the docs-counts UNIT
  constant + the layer-axis pair [first = s206, second = s205 at
  its ship 2849/226] + the 2849 negatives + the dialog-geometry-
  parity F-92a3 four positives + negatives; the re-run 26 no-ops)
  → **138/2851 GREEN** with every doc pin passing — the arithmetic
  verified against the live unit run BEFORE any doc flip (clean
  first pass, no in-flight corrections).
- The .env bidirectionality: executed at the fresh clone (the .env
  rebuilt from .env.example, a fresh AUTH_SECRET, the app boots, db
  census MATCH). The standing env face unchanged this round.
- The captures 687-691: VLM-verified (each confirmed showing the
  intended page/state — see the session_434.md transcript).
- The final gate: see the session_434.md transcript close.

## The declined list (this round)

- A mid-rotation eslint/vite-family bump to cure the advisories —
  the standing no-mid-rotation-bump posture (a toolchain bump forces
  the pixel baselines' re-derivation — its own rotation).
- A GENERAL doc-claim totality census (every prose claim in every
  doc pinned to the code) — the genus one level up from D-206a1.
  The facts-census + docs-counts + type-gate families already pin
  the volatile axes (versions, colors, tokens, routes, models, env,
  counts, strictness as of this round); a full prose-claim census
  is its own rotation's material, not this round's.
- Re-walking the interactive-table families — the standing kill
  re-verified (the reference bundle STABLE at `46bc2d9c`, the demo
  data ZERO; no new walk material exists).
- The `.env` working-tree refresh as a repo change — `.env` is
  operator-local and untracked; the bidirectional rebuild ritual
  covers the verification (executed at this round's fresh clone).
