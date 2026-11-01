# The session-207 plan — THE CHART-STACK DOC-CONTRACT + THE EPOCH GATE'S RESPONSE-WAIT (the stale recharts row joins the pin, and the settings e2e's value-blind gate gets a deterministic boundary)

Date: 2026-11-01 · Rotation: 207
Task: the operator's standing instruction set — audit + validate the
shipped session-206 state (commit `4e070cc` + the owner's transcript
commit `f990276` — the session_435 transcript is this round's rotation
trigger), re-verify visual + functional parity with the live reference
(`https://neo-crm-8ab2c17c.base44.app/`, logged in with the documented
demo credentials), re-run the standing gates, remediate the identified
gaps, capture the round's screenshots, update the docs, and push to
`main`.

## 0. The audit (the baseline + the discovery — EXECUTED, all green except the one live catch)

The baseline gate at the shipped s206 state (the workspace reset
mid-round; a FRESH CLONE at `f990276`, `bun install`, the standing
`.env` rebuilt from `.env.example` with a fresh `AUTH_SECRET`,
`DATABASE_URL="file:../db/custom.db"` — the operator's standing ask,
`db/` at the repo root — db:push + db:seed, db census MATCH
15/24/10/23/12 + 4 users at `<repo>/db/custom.db`; the first half of
the round ran the same tree pre-reset with identical results):

- lint 0/0 · tsc 0 · **138/2851** unit · build · smoke 14/14 ·
  **e2e 225/226 — THE ONE LIVE CATCH (F-207a)**: the settings
  defaults debounce/focus test (`tests/e2e/crm.spec.ts:2980`) failed
  once in the full run (`toBeFocused` — the input resolved with
  `value="AED"` + inactive); isolated re-runs passed 5/5 — the
  intermittent signature. Root cause decoded below (§1a).
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
  and OURS `oklab(0 0 0 / 0.8)` (the same 80% black — the v4
  serialization); the reference locks the body scroll while open,
  ours locks BOTH body + main (the documented superset); Escape closes
  on both with every lock released; a link ride navigates
  (`/Dashboard` → `/Leads`) AND auto-closes AND releases every lock
  (body `visible` · main `auto`). The landing disclosure menu: the
  toggle mounts the `div.md:hidden border-t` panel (6 links:
  Features / Preview / Pricing / FAQ / Contact / Open dashboard —
  identical on both apps; the reference carries NO aria-expanded,
  ours carries it — the accessible superset), an in-panel FAQ click
  closes it and lands on `/#faq` (verified on both apps). The VLM
  comparison of the drawer-open pair (ours vs the reference):
  **IDENTICAL** — the sole note the reference's own Base44 platform
  badge (never mirrored, the standing doctrine).
- **TAILWIND V4 STATE CLEAN**: no `tailwind.config.*` (CSS-first
  `@theme` with literal hex in globals.css), the vendored
  `src/app/vendor/tw-animate.css`, `postcss.config.mjs` on
  `@tailwindcss/postcss`, the documented v4 pitfalls avoided in
  source — the four-band pixel sweep + byte-parity census proving the
  rendered output identical.
- **SEO/SITEMAP live-verified**: the 11-route `/sitemap.xml`
  (byte-format contract) · `/robots.txt` (the Sitemap line) ·
  `/manifest.json` 200 `application/json` · the landing head's
  OG/Twitter cards + canonical + og-image (curl-verified on the dev
  server).
- **Hygiene**: no TODO/FIXME · no `console.log` · no `any` (the one
  grep hit is a JSDoc comment word, not a type) · `.env` +
  `db/*.db` git-ignored · `bun audit` at the pinned census 10
  (4 high / 5 moderate / 1 low — all dev-toolchain transitive, zero
  runtime exposure; the standing no-mid-rotation-bump posture holds).
- **The recent-changes audit**: src/ UNCHANGED since the s205 ship
  (the s206 round was test-side + docs only, exactly as its record
  claims — `git diff efe14e7..HEAD --stat -- src/` empty; the s207
  tree is identical); the owner's newest commit `f990276` adds
  `docs/session_435.md` only.
- The scandihaven reference repo refreshed + its AGENTS/CLAUDE/PAD/
  SKILL reviewed for the tech-stack patterns (the highest-leverage
  borrows already embodied here: the ActionResult envelope ≈ our
  ok/fail seam, the boot env validation ≈ boot-env.ts, the
  literal-hex @theme rule, the sitemap-parity doctrine, the
  per-package stack-table lockstep — the very pattern this round's
  D-207b1 extends to the recharts row).

## 1a. The round's first material (the live gate catch — F-207a)

**THE VALUE-BLIND EPOCH GATE.** The settings defaults e2e
(`tests/e2e/crm.spec.ts:2980` — the S72-P2 debounce/focus contract)
failed once at this round's baseline run: `toBeFocused` timed out with
the input resolved at `value="AED"` + inactive. The s119 round
(`F-119a1`) diagnosed this family as the EPOCH RACE — the
DefaultsEditor's pending→resolved remount
(`key={settings ? "resolved" : "pending"}`, the by-design M-72c4
epoch) — and added the gate `await expect(input).toHaveValue("AED")`
before the fill, retiring a 9-session flake lineage. But the gate is
**VALUE-BLIND**: the pending epoch's fallback values
(`settings?.defaultCurrency ?? "AED"` + new/B/3/month/monday) EQUAL
the seed values, so `toHaveValue("AED")` passes on BOTH epochs. The
fill can still race the settings GET's store-set (the hydrate()
9-fetch wave): when that lands after the fill, the remount resets the
input to the stored value + drops focus — exactly the observed
failure. 88 sessions of green runs (s119 → s206) were the race's
window simply not closing; this round's full-suite run closed it.

## 1b. The round's second material (the audit's doc finding — F-207b)

**THE STALE CHART-STACK ROWS.** The s176 recharts major (2.15 →
3.10.1, ADR-021) updated CLAUDE.md's charts row ("Session-176
migrated the major 2.15 → 3.10.1 (ADR-021)") and the PAD's stack
table (`3.10.1`, live-pinned by the facts-census WP-1a STACK loop
since s169) — but THREE sites were missed:

- `neo-crm_SKILL.md` §2 line ~443, the Charts row: BOTH cells stale —
  `| Charts | recharts | \`2.15.x\` | Every chart has an empty-state
  fallback |`. The version cell rode the pre-176 major AND the
  doctrine cell rode the pre-s10 form (session-10's reversal retired
  the empty-state placeholder boxes — "the REAL chart renders at
  all-zero data" is the live doctrine, pinned in CLAUDE + the AGENTS
  conventions bullet).
- `neo-crm_SKILL.md` §10 line ~1100, the chart-blank debugging row:
  `by design — empty-state fallback` — the same pre-s10 doctrine.
- `README.md` line ~76, the stack table: `| Charts | recharts | 2.15
  |` — the pre-176 version.

The stale rows rode **31 sessions of green gates** (s176 → s206): the
facts-census WP-1a pins the PAD's FULL stack table but the SKILL §2
pin covers only the next + playwright rows; no pin guarded the
Charts row anywhere else. The doc contradicted the installed package
(`^3.10.1` in package.json + bun.lock), ADR-021, CLAUDE.md, the PAD,
and the repo's own s10 doctrine — the exact genus F-206a closed for
the strictness claims (the general doc-claim census the s206 close
named as its own rotation's material — this round takes the
chart-stack axis of it).

## 2. The cures (TDD)

**D-207a1 — THE EPOCH GATE'S RESPONSE-WAIT (the F-207a flake cure;
test-side only, src/ untouched — the M-72c4 epoch is by-design
parity).** In `tests/e2e/crm.spec.ts`'s settings defaults test: arm
`page.waitForResponse` for the settings GET BEFORE the `goto`, await
it after — the deterministic epoch boundary. Once awaited, the
store-set has landed, the remount has happened, and the input is
stable for the fill; the `toBeFocused` contract then asserts the
M-72c1 surface it was built for (focus persistence through the
debounce), not the race. The s119 comment superseded by the s207
root-cause note (the value-blindness). No count change (an existing
test's gate repaired); E2E 226 HELD.

**D-207b1 — THE CHART-STACK DOC-FAMILY PIN (RED-first).** A new
describe in `tests/facts-census.test.ts` (the F-169f home — the
WP-1a/WP-1e line, the s204/s205 precedents):

- it 1 (RED at birth): SKILL §2's Charts row mirrors the LIVE
  recharts major.minor (read from node_modules — the F-109a1
  live-census doctrine) + carries the real-chart-at-zero doctrine;
  the stale row + the stale doctrine note banned AT THE §2 SECTION
  (the s206 scoping doctrine — historical session records keep their
  ship-time quotes; the pin bans the LIVE claim site).
- it 2 (RED at birth): the family lockstep — README's Charts row
  mirrors the live major.minor (the stale 2.15 row banned) · SKILL
  §10's chart-blank row carries the live zero-data doctrine (the
  stale "by design — empty-state fallback" banned at the §10
  section) · the CLAUDE freeze arm (the `2.15 → <live>` migration
  form present — a future recharts bump fails the pin until CLAUDE's
  row follows).

The doc cures (the code-wins rule, same commit): the SKILL §2 row
flipped to the live form (version + doctrine cells), the SKILL §10
row flipped to the real-chart-at-zero form, the README row flipped
to the live major.minor + the doctrine note.

RED at birth verified (exactly the two new its RED — three rotted
sites, zero collateral) → the cures → GREEN 2/2.

**MUTATION-PROVEN ×3:** the stale row re-planted in SKILL §2 →
exactly 1 RED (it 1) · the stale row re-planted in README → exactly
1 RED (it 2) · the §10 note weakened to the pre-s10 form → exactly
1 RED (it 2) — each restored → GREEN.

**The .env.example bidirectionality holds**: the standing face (the
six app knobs + the four s204 parity knobs + E2E_PORT + HEADLESS =
the D-205a2 totality) is unchanged this round; the working `.env`
was rebuilt from it at the fresh clone (fresh `AUTH_SECRET`), the
app boots, db census MATCH.

## 3. The re-anchors (the count ladder + the docs lockstep)

- `scripts/count-ladder-207.py` (the 206 form, unit-only): UNIT
  **2851 → 2853** (+2 — the two D-207b1 its) · SUITES 138 HELD (the
  pins land in an existing file) · E2E 226 HELD · badge
  **3077 → 3079** (the unit+e2e arithmetic: 2853+226). The retired
  2851 site-forms join the negatives (the s192 doctrine). Sites:
  README (badge · Tested row · tree · commands) · AGENTS (commands
  table · gate-order) · CLAUDE (gate-order · commands · pyramid ·
  coverage seam) · PAD (tree · Total · HEAD · checklist · commands)
  · SKILL (commands · Appendix B unit total) · the test-side
  re-anchors (docs-counts UNIT constant + layer-axis pair [first =
  s207, second = s206 at its ship 2851/226] + the 2851 negatives ·
  the dialog-geometry-parity F-92a3 ladder).
- `scripts/skill-head-207.py`: the SKILL frontmatter v1.203.0 →
  **v1.204.0**, `last_updated` stays 2026-11-01 (the same-day form),
  the H1 lockstep, the s206 layer comment-demoted at its ship counts
  (2851/226), the new s207 head layer.
- The AGENTS Session-207 section · the PAD session inventory row ·
  `docs/session_436.md` (the transcript) · the worklog Task ID 207
  entry · this plan's execution record (§5).

## 4. The final gate

lint 0/0 · tsc 0 · **138/2853** unit · build · smoke 14/14 ·
`CI=1 bun run test:e2e` 226/226 (the F-207a cure proven by a clean
run) · the desktop + phone sweeps re-run CLEAN (the cures are
baseline-inert by construction — test files + doc rows never enter
the build — but the house proves it) · db census MATCH · `git
status` clean of secrets/dbs.

## 5. The execution record (filled at execution — all claims live-verified)

- §0 the audit: executed in full before the plan landed (the
  baseline gate + the six drift gates + the probe + the parity
  re-verification with agent-browser against BOTH apps + the VLM
  drawer comparison + the SEO/sitemap curl legs + the hygiene greps
  + the recent-changes diff + the scandihaven review). All green
  except the one live catch (F-207a), as recorded in §0.
- D-207a1: applied — the `page.waitForResponse("/api/settings")`
  waiter armed BEFORE the `goto` + awaited after; the s119 comment
  superseded by the s207 value-blindness root-cause note. No count
  change (E2E 226 HELD); the proof = the final gate's full e2e run
  (the exact context that caught the flake at the baseline).
- D-207b1 RED-at-birth: the new describe appended to
  `tests/facts-census.test.ts` → `bunx vitest run
  tests/facts-census.test.ts` → **46 tests | 2 failed** — exactly
  the two new its (it-1 at the SKILL §2 version cell; it-2 at the
  README row arm), 44 standing GREEN, zero collateral.
- D-207b1 GREEN: the three doc flips (the SKILL §2 row → the live
  `3.10.x` + the recharts-DEFAULTS/real-chart doctrine; the SKILL
  §10 row → the REAL-chart-at-zero form; the README row → the live
  `3.10` + the doctrine note) → **46/46**.
- D-207b1 MUTATION-PROOF ×3: the stale SKILL §2 row re-planted →
  **exactly 1 RED** (it-1) → restored → 46/46 · the stale README
  row re-planted → **exactly 1 RED** (it-2, at the README arm) →
  restored → 46/46 · the SKILL §10 note weakened to the pre-s10
  form → **exactly 1 RED** (it-2, at the §10 arm) → restored →
  46/46. src/ untouched by the cures (git diff --stat: README.md +
  neo-crm_SKILL.md + tests only).
- The ladder: skill-head-207.py (3 flips: the s207 layer live, the
  frontmatter 1.203.0 → 1.204.0, the H1; last_updated stays
  2026-11-01 — the same-day no-op form; idempotent — the re-run a
  verified no-op) + count-ladder-207.py (**26 flips** — the
  README/AGENTS/CLAUDE/PAD/SKILL live sites + the docs-counts UNIT
  constant + the layer-axis pair [first = s207, second = s206 at
  its ship 2851/226] + the 2851 negatives + the dialog-geometry-
  parity F-92a3 four positives + negatives; the re-run 26 no-ops)
  → **138/2853 GREEN** with every doc pin passing — the arithmetic
  verified against the live unit run BEFORE any doc flip (clean
  first pass, no in-flight corrections).
- The .env bidirectionality: executed at the fresh clone (the .env
  rebuilt from .env.example, a fresh AUTH_SECRET, the app boots, db
  census MATCH). The standing env face unchanged this round.
- The captures 692-696: VLM-verified (each confirmed showing the
  intended page/state — see the session_436.md transcript).
- The final gate: see the session_436.md transcript close.

## The declined list (this round)

- A mid-rotation eslint/vite-family bump to cure the advisories —
  the standing no-mid-rotation-bump posture (a toolchain bump forces
  the pixel baselines' re-derivation — its own rotation).
- The FULL general doc-claim totality census (every prose claim in
  every doc pinned to the code) — this round takes the chart-stack
  axis (the highest-yield stale genus the audit found: a version
  carrier + a doctrine carrier + a sibling doc row, all riding 31
  sessions); the full census remains its own rotation's material.
  The facts-census + docs-counts + type-gate families now pin the
  volatile axes (versions incl. recharts as of this round · colors ·
  tokens · routes · models · env · counts · strictness).
- Re-walking the interactive-table families — the standing kill
  re-verified (the reference bundle STABLE at `46bc2d9c`, the demo
  data ZERO; no new walk material exists).
- The `.env` working-tree refresh as a repo change — `.env` is
  operator-local and untracked; the bidirectional rebuild ritual
  covers the verification (executed at this round's fresh clone).
- A src-side DefaultsEditor change to kill the epoch remount — the
  M-72c4 epoch is by-design parity (the reference's own epoch
  remount); the flake is the TEST's race, cured test-side.
