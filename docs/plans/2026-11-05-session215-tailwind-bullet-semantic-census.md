# The session-215 plan — THE TAILWIND-BULLET SEMANTIC-PROSE CENSUS (the AGENTS architecture-facts Tailwind-v4 bullet joins the pin)

Date: 2026-11-05 · Rotation: 215
Task: the operator's standing instruction set — audit + validate the
shipped session-214 state (commit `fd69115` + the owner's transcript
commit `36aee3e` — the session_451 transcript is this round's rotation
trigger), re-verify visual + functional parity with the live reference
(`https://neo-crm-8ab2c17c.base44.app/`, logged in with the documented
demo credentials; the named focus: the mobile navigation), re-run the
standing gates, remediate the identified gaps, capture the round's
screenshots, update the docs, and push to `main`.

## 0. The audit (the baseline — EXECUTED, zero live defects, the FRESH-CLONE round)

The workspace did NOT survive this round either — the sandbox reset
emptied `neo-crm/` again, so the round ran `git clone
https://github.com/nordeim/neo-crm.git` fresh and rebuilt the
environment: `bun install` (536 packages) → `.env` from the documented
contract (`DATABASE_URL="file:../db/custom.db"` + a fresh
`AUTH_SECRET` — the operator's own instruction this round names the
exact form) → `bun run db:push` + `db:seed` → **db census MATCH
15/24/10/23/12 + 4 users** (`<repo>/db/custom.db` — the repo-root
anchor, first-run verified; NO parent-of-repo `db/` mirror exists this
round, probed BEFORE any listener reuse — the s212/s214 hazard
checked and clean). The Playwright browser-binary gap (the cache
carried only the 1200 era; the project expects
`chromium_headless_shell-1248`) cured PROACTIVELY this round:
`bunx playwright install chromium` BEFORE the e2e leg — the first
attempt ran clean (226/226, 7.9m). The scandihaven reference
re-cloned (the reset emptied it too) — `61711c3`, the standing
commit, unchanged.

The baseline gate at the exact s214 ship state:

- lint 0/0 · tsc 0 · **138/2878 unit GREEN** (clean first pass) ·
  build (compiled successfully — the 2 warnings the pre-existing
  Turbopack tracing heuristics) · smoke 14/14 · **e2e 226/226 CLEAN**
  (7.9m) · db census MATCH · **probe:ref STABLE at `46bc2d9c`** (the
  demo data still ZERO; nav 256px/8 links; the 390 census; the
  landing census — every standing layer verified).
- THE PARITY RE-VERIFICATION (the operator's named focus, probed live
  with agent-browser 0.41.1 against BOTH apps logged in): **the mobile
  navigation both surfaces working** — the REFERENCE drawer at
  390×844 (the "Open navigation" trigger → the dialog "CRM" + the
  Close button + the "Navigate between your CRM pages" paragraph +
  the 8 destinations; the body-only scroll lock `overflow: hidden`;
  the "Leads" link ride navigates `/Dashboard` → `/Leads` AND
  auto-closes; Escape closes AND releases the lock) — OURS the same
  battery PLUS the documented supersets (the body+main DUAL lock
  `hidden/hidden`, released to `visible/auto` on every close path;
  the resize-past-md auto-close verified live at 769px; the named
  icon-only trigger). The landing "Toggle navigation" disclosure menu
  working on BOTH apps (ours the aria-expanded superset, verified
  true→false across the toggle); the landing toggle correctly
  `display:none` at 1280 (the `hidden md:flex` form) with the inline
  nav links visible.
- Tailwind v4 state CLEAN (no config file — the CSS-first `@theme`;
  `postcss.config.mjs` carries the `@tailwindcss/postcss` plugin as
  its ONLY plugin; the vendored `src/app/vendor/tw-animate.css`
  imported by globals.css; zero npm `tw-animate-css` imports in
  src/; the `--shadow-sm`/`--blur-sm` re-pins live in the `@theme`
  block). SEO/sitemap live-verified on the dev server (the 11-route
  `/sitemap.xml` 200 `application/xml` · `/robots.txt` 200 with the
  Sitemap line · `/manifest.json` 200 `application/json` · the
  OG/Twitter/canonical/description head tags · the three security
  headers on every path). The test-suite configs verified sound and
  green (vitest.config.ts — the `*.test.ts` node layer with the `@`
  alias; playwright.config.ts — the standalone :3100 boot, the pinned
  `db/e2e.db`, the storageState setup project, the N-69a/D-195a3 env
  hardening): the operator's "add vitest + playwright by modifying
  the respective config files" instruction is satisfied by
  VERIFICATION this round — both configs exist, are correct, and
  carried the green baseline; no modification is warranted (the
  smallest-safe-edit doctrine). The hygiene legs clean (no
  TODO/FIXME · no `console.log`). The recent-changes audit: the
  owner's newest commit adds `docs/session_451.md` only; src/ last
  touched at the s214 ship.

## 1. The round's material — F-215a: THE TAILWIND-BULLET SEMANTIC-PROSE RESIDUE (the s214 close's named candidate)

The s214 close named the next candidate: "the semantic-prose census's
REMAINDER — **the Tailwind-v4 bullet family**, or whatever genus the
tree grows." The round's fresh-eyes walk found NO live defect — the
tree is fully green at the exact s214 ship state, the reference
STABLE, the docs holding (the prose-claim samples verified live: the
CSS-first form · the postcss plugin · the shadow/blur re-pins · the
space-y flip's login + settings faces · the outline-none fingerprint
· the cursor rule · the vendored tw-animate). So the round's material
IS the named candidate — the genus-closing pin, the s208/s209/s213/
s214 precedent (the doc family clean, the pin the material):

- THE GENUS: every mechanically-checkable doc-claim family is pinned
  (the commands/paths/ADRs at D-208a1 · the env face at D-205a2 ·
  the strictness doc-family at D-206a1 · the chart-stack rows at
  D-207b1 · the push-ritual remote at D-209a2 · the counts at
  docs-counts · the conventions block's semantic claims at D-213a1 ·
  the auth bullet's five clusters at D-214a1) — but the AGENTS
  **"Architecture facts you would otherwise guess wrong"** section's
  SECOND bullet, the TAILWIND-V4 BULLET (the section's longest
  mechanically-checkable surface, lines ~105–160), still carries
  EIGHT semantic claim clusters that ride on the rotation audit's
  fresh eyes alone on the DOC-FACE axis — and TWO of them ride on
  NOTHING AT ALL:
  1. the CSS-FIRST claim (all tokens literal hex in the `@theme`
     block of `src/app/globals.css` · no `tailwind.config.js` — it
     would be ignored · no var() chains inside `@theme`);
  2. the POSTCSS claim (`postcss.config.mjs` MUST keep the
     `@tailwindcss/postcss` plugin — without it `@theme`/`@utility`
     directives are never compiled and pages render unstyled —
     **this exact bug shipped once**; NO test anywhere reads
     `postcss.config.mjs`);
  3. the SHADOW re-pin claim (`--shadow-sm: 0 1px 2px 0
     rgb(0 0 0 / 0.05)` · bare `shadow` NOT overridden — the live
     value pinned at tests/design-tokens.test.ts S9-P0, the DOC face
     unpinned);
  4. the BLUR re-pin claim (`--blur-sm: 4px` — same split: live
     pinned S10-P0, doc face unpinned);
  5. the SPACE-Y FLIP family (the `-mb-2` login-reset overlap →
     re-derive from the reference's COMPUTED gap, never copy the
     class string · the inline-label gap collapse → the explicit
     `mt-2` on block controls via `SETTINGS_DEFAULTS.controlMt` /
     `SETTINGS_DANGER.controlMt` — the live faces pinned at
     login-reset/settings-family/spacey-hazard, the DOC face
     unpinned);
  6. the OUTLINE-NONE claim (v4's `outline-none` is
     `outline-style: none` — the computed triplet (1px/none vs
     2px/solid) is the genus's own fingerprint, never a defect
     claim; the VISIBLE focus face rides the box-shadow ring);
  7. the CURSOR claim (the reference's global `button,
     [role="button"] { cursor: pointer; }` mirrored in our base
     layer — live pinned S10-2, doc face unpinned);
  8. the TW-ANIMATE VENDORING claim (vendored at
     `src/app/vendor/tw-animate.css` — the npm package exposes only
     the `style` export condition, which Turbopack's CSS resolver
     does not support; import the local file, do not switch back).
- THE EXPOSURE (the genus's bite, the F-213a/F-214a precedent made
  mechanical): any of these claims can rot silently — the postcss
  plugin swapped for a "quick fix" (the unstyled-page bug RESHIPS),
  a `tailwind.config.js` planted by a v3-era habit, a re-pin value
  edited doc-side without the source (or source-side without the
  doc), the vendor import switched back to the npm package — and
  every unit gate stays GREEN (no pin reads the bullet; the
  scattered live-source pins cover only clusters 3/4/5/7's SOURCE
  faces; the doc faces and clusters 1/2/6/8 ride on nothing).

## 2. The cure (TDD — the genus-closing pin, test-side only, src/ untouched)

**D-215a1 — THE TAILWIND-BULLET SEMANTIC CENSUS PIN** (a new
describe in `tests/facts-census.test.ts` — the D-204a1/D-205a1/
D-207b1/D-213a1/D-214a1 home; the F-109a1 live-read doctrine
throughout):

- it-1 THE CSS-FIRST claim: the AGENTS section (the wrap-blind
  flattened form) carries the literal-hex clause + the
  no-`tailwind.config.js` clause + the doc's own
  `docs/Tailwind-V4-Validation-Report.md` pointer; LIVE: the
  `@theme` block exists in `src/app/globals.css` · NO
  `tailwind.config.{js,ts,cjs,mjs}` anywhere in the repo (the walk
  census, `skills/` excluded per the operator's standing
  instruction) · the `@theme` block carries literal hex tokens and
  NO `var(` chain inside it.
- it-2 THE POSTCSS claim: the section carries the plugin clause +
  the unstyled-pages consequence; LIVE: `postcss.config.mjs`'s
  plugins array is EXACTLY `["@tailwindcss/postcss"]` (the only
  plugin — the doc's own MUST form).
- it-3 THE SHADOW re-pin: the section carries the exact
  `--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)` value + the
  "bare `shadow` NOT overridden" arm; LIVE: globals.css carries the
  exact re-pin line · globals.css does NOT define a bare `--shadow:`
  token (the not-overridden arm).
- it-4 THE BLUR re-pin: the section carries `--blur-sm: 4px`; LIVE:
  globals.css carries the exact re-pin line.
- it-5 THE SPACE-Y FLIP family: the section carries the
  computed-gap re-derivation doctrine + the `controlMt` fix pattern
  named at both settings tokens; LIVE: `SETTINGS_DEFAULTS.controlMt`
  and `SETTINGS_DANGER.controlMt` are `"mt-2"` (read LIVE via the
  page-layout import) · the login reset view's Back link carries the
  computed-gap ladder (`mb-2 sm:mb-4` — the s79 re-pin of the
  doc's `mb-4` example, the doc's own "re-derive from the COMPUTED
  gap" doctrine in action; the pin anchors the doc's
  re-derivation RULE, not one frozen class string).
- it-6 THE OUTLINE-NONE claim: the section carries the
  `outline-style: none` fingerprint clause + the ring clause; LIVE:
  the shared Input carries the `focus-visible:` ring face (the
  visible-focus doctrine's source face).
- it-7 THE CURSOR claim: the section carries the mirrored-rule
  clause; LIVE: the globals.css base layer carries
  `button, [role="button"]` with `cursor: pointer`.
- it-8 THE TW-ANIMATE VENDORING claim: the section carries the
  vendored-path clause + the style-export/Turbopack clause + the
  do-not-switch-back clause; LIVE: `src/app/vendor/tw-animate.css`
  exists · globals.css imports `./vendor/tw-animate.css` · ZERO
  npm `tw-animate-css` imports in src/ (the comment-stripped
  census).

**THE VERIFICATION (the pin's own named proofs):**

- Born-green at the cured tree expected (the audit verified every
  claim live — the D-208a1/D-213a1/D-214a1 precedent: the doc family
  clean, the pin the material; the count +8).
- MUTATION-PROVEN (each planted → exactly 1 RED at its own pin →
  restored → GREEN): M1 a `tailwind.config.js` planted at the repo
  root (the tree census) · M2 the postcss plugins swapped to
  `["tailwindcss"]` (the v4 rule's own forbidden form) · M3 the
  AGENTS `--shadow-sm` value edited doc-side · M4 the globals.css
  `--blur-sm` flipped to 8px src-side · M5 `controlMt` flipped to
  `mt-4` in page-layout.ts · M6 the AGENTS outline-none clause
  removed (the doc arm) · M7 the globals.css cursor rule removed ·
  M8 the globals.css vendor import switched to the npm package form.
- STASH-PROOF: the round's describe stashed → exactly 138/2878 (the
  s214 ship state) → restored → 138/2886.

## 3. The re-anchors (the count ladder + the docs lockstep)

- The count ladder: UNIT **2878 → 2886 (+8)** · SUITES 138 HELD (the
  pins land in an existing file) · E2E 226 HELD · badge **3104 →
  3112** (the unit+e2e arithmetic: 2886+226) + `skill-head-215.py`
  (the SKILL v1.212.0, the s214 layer comment-demoted at its ship
  counts 2878/226, the s215 layer live at 2886/226,
  `last_updated` 2026-11-05; idempotent) + `count-ladder-215.py`
  (assert-first, idempotent, unique-anchor — the README/AGENTS/
  CLAUDE/PAD/SKILL live-tense flips + the test-side re-anchors in
  the same stroke: the docs-counts layer-axis pair [first = s215,
  second = s214 at its ship 2878/226] · the 2878 negatives join the
  retired forms · the dialog-geometry-parity F-92a3 ladder: the four
  CLAUDE live positives re-anchored 2886).
- The docs lockstep: the AGENTS Session-215 section · the PAD §7.1
  s215 inventory row · `docs/session_452.md` (the transcript) · the
  worklog Task ID 215 entry · this plan's execution record (§5).

## 4. The final gate

lint 0/0 · tsc 0 · **138/2886 unit** · build · smoke 14/14 ·
`CI=1 bun run test:e2e` 226/226 · the six drift gates re-run CLEAN
(the cures test-side only — no src touch, but the house proves it) ·
db census MATCH · `git status` clean of secrets/dbs.

## 5. The execution record (filled at execution — all claims live-verified)

- §0 the audit: executed in full before the plan landed (the
  fresh-clone rebuild + the proactive chromium-1248 cure + the
  baseline battery + the parity walk with agent-browser against
  BOTH apps + the SEO/sitemap live legs + the Tailwind-v4 state
  legs + the test-config verification + the hygiene greps + the
  probe:ref STABLE + the scandihaven re-clone at 61711c3).
- D-215a1: **BORN-GREEN AT THE FIRST RUN** — 70/70 at the file —
  then the mutation battery caught **TWO BIRTH DEFECTS IN THE PIN
  ITSELF, both cured in-round**: (1) the BOUNDARY-BLIND slice (the
  end marker `**Stock-primitive inks**` never matched — the live
  form carries the `(session-10)` suffix — so the slice ran to EOF
  and the doc face went vacuous; M6 sailed through GREEN; cured
  with the exact form + the `end > start` guard, and the new M9
  proves the guard's teeth: the boundary rot throws at the suite
  level, exit 1); (2) the COMMENT-BLIND cursor match (the
  explanatory comment above the rule carries the rule's own
  literal text — an unstripped match stays green when the RULE is
  deleted; cured with the `noComments` face; the M7 script itself
  learned the same lesson twice — the raw first-match removal
  deletes the COMMENT, not the rule, and the comment-stripped
  rewrite variant tripped the s169 token-count pin as collateral;
  the surgical form removes the LAST raw match, verified by the
  stripped face). **MUTATION-PROVEN ×9**: M1 a `tailwind.config.js`
  planted at the root → exactly 1 RED (it-1) · M2 the postcss
  plugins swapped to `["tailwindcss"]` → exactly 1 RED (it-2) · M3
  the AGENTS `--shadow-sm` value edited doc-side → exactly 1 RED
  (it-3) · M4 the globals `--blur-sm` flipped to 8px → exactly 1
  RED (it-4) · M5 the `controlMt` flipped to `mt-4` → exactly 1
  RED (it-5) · M6 the AGENTS outline-none clause removed
  (whitespace-flexible) → exactly 1 RED (it-6) · M7 the cursor
  rule removed surgically → exactly 1 RED (it-7) · M8 the vendor
  import switched to the npm form → exactly 1 RED (it-8) · M9 the
  bullet boundary rot → the suite-level throw, exit 1 — each
  restored → GREEN. **STASH-PROOF**: the describe stashed →
  exactly 138/2878 (the s214 ship state, zero collateral) →
  restored → 138/2886.
- The count ladder + the docs lockstep: **UNIT 2878 → 2886 (+8)** ·
  SUITES 138 HELD · E2E 226 HELD · **badge 3104 → 3112** (the
  unit+e2e arithmetic: 2886+226 — verified against the live unit
  run: **138/2886 GREEN**) + `skill-head-215.py` (the SKILL
  v1.212.0, the s214 layer comment-demoted at its ship counts
  2878/226, the s215 layer live at 2886/226, `last_updated`
  2026-11-04 → 2026-11-05 — the next-day form; idempotent — the
  re-run a verified no-op) + `count-ladder-215.py` (assert-first,
  idempotent, unique-anchor — 27 flips, the re-run all no-ops) +
  the test-side re-anchors in the same stroke (the docs-counts
  layer-axis pair: first = s215 · second = s214 at its ship
  2878/226 · the 2878 negatives join the retired forms · the
  dialog-geometry-parity F-92a3 ladder: the four CLAUDE live
  positives re-anchored 2886) + the docs lockstep (the AGENTS
  Session-215 section · the PAD §7.1 s215 inventory row ·
  docs/session_452.md · the worklog entry [Task ID 215] · this
  record).
- The captures 732-736 (the dev-server set, pixel-signature
  verified: the blue sidebar (37,99,235) on the dashboard at 1280 ·
  the drawer OPEN at 390 with the blue panel across the left edge ·
  the landing mobile menu OPEN at 390 · the near-white login card
  at 1280): `732-s215-dev-dashboard-1280.png` ·
  `733-s215-dev-dashboard-390.png` ·
  `734-s215-dev-drawer-open-390.png` ·
  `735-s215-dev-landing-mobilemenu-390.png` ·
  `736-s215-dev-login-1280.png`.
- The final gate at the cured tree: lint 0/0 · tsc 0 · **138/2886
  unit** · build (the 2 warnings the pre-existing Turbopack tracing
  heuristics) · smoke 14/14 · `CI=1 bun run test:e2e` **226/226**
  (7.9m) · **all six drift gates re-run CLEAN** (probe:ref STABLE
  at `46bc2d9c` · the four-band sweep ×4 at `--fail-on-drift` · the
  fullpage 0.093%/0.316% — the exact standing margins · the
  interior census exit 0, unexplained 0 — the cures test-side only,
  no src touch, but the house proves it; one environment-only
  wrinkle mid-gate: the dev server died under the e2e memory
  pressure — relaunched with its DB anchor re-probed green, the
  remaining gates re-run CLEAN, zero code involvement) · db census
  MATCH at the repo-root anchor · `git status` clean of
  secrets/dbs (19 files: 9 modified + 10 new, zero
  `.env`/`.db`/`.key`).

## The declined list (this round)

- The FULL semantic-prose census of the architecture-facts section's
  REMAINDER (the Tailwind-v4 bullet is the named next family after
  the auth bullet; the stock-primitive-inks bullet, the SQLite-path
  bullet's doc face, and the store/effects bullets stay under the
  rotation audit's fresh-eyes walk, the s208 scoping doctrine —
  several of their live faces already ride design-tokens/db-path/
  page-layout pins).
- A mid-rotation eslint/vite-family bump (the standing posture).
- The skills/ mirror (the operator's own domain, the standing
  exclusion — the operator's own instruction this round re-affirms
  the `skills/` folder stays excluded from code checking, testing,
  and compilation; the eslint ignores + the build's
  outputFileTracingExcludes + the walk censuses' exclusions all
  hold).
- Test-suite config modifications (the operator's "add vitest +
  playwright by modifying the respective config files" instruction:
  both configs verified sound and green this round — the standing
  hardened forms carry the N-69a/D-195a3/S-186 lessons; inventing
  changes to satisfy the letter of the instruction would violate
  the smallest-safe-edit doctrine; the verification is recorded in
  §0 and the transcript).
