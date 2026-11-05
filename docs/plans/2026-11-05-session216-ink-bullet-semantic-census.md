# The session-216 plan — THE INK-BULLET SEMANTIC-PROSE CENSUS (the architecture-facts ink/SQLite/store bullets join the pin, and the fresh-eyes walk finds the family's own stale #111827 sentence)

Date: 2026-11-05 · Rotation: 216
Task: the operator's standing instruction set — audit + validate the
shipped session-215 state (commit `5685b9f` + the transcript commits
`d38f6a2`/`41e1873` — the session_454 transcript is this round's
rotation trigger), re-verify visual + functional parity with the live
reference (`https://neo-crm-8ab2c17c.base44.app/`, logged in with the
documented demo credentials; the named focus: the mobile navigation),
re-run the standing gates, remediate the identified gaps, capture the
round's screenshots, update the docs, and push to `main`.

## 0. The audit (the baseline — EXECUTED, one live defect found, the CARRY-OVER WORKSPACE round)

The workspace SURVIVED this round (the first carry-over round since
s209): `git pull` fast-forwarded `d38f6a2..41e1873` (the owner's
newest commit adds `docs/session_454.md` only — the s215 close's
polished transcript). The recent-changes audit since the s215 ship:
`docs/session_453.md` + `docs/session_454.md` added, ZERO
src/tests/scripts/config changes — the tree is at the exact s215 ship
state on the code axis. The standing environment held: `.env`
(`DATABASE_URL="file:../db/custom.db"` + the AUTH_SECRET) · `db/` at
the repo root with custom.db/e2e.db/smoke.db · NO parent-of-repo
`db/` mirror (the s212/s214 hazard probed clean BEFORE listener
reuse) · node_modules installed · the Playwright chromium-1248 cache
present · the scandihaven reference at `61711c3`, the standing
commit, unchanged.

The baseline gate at the exact s215 ship state:

- lint 0/0 · tsc 0 · **138/2886 unit GREEN** · build (compiled
  successfully — the 2 warnings the pre-existing Turbopack tracing
  heuristics) · smoke 14/14 · **e2e 226/226 CLEAN (8.1m)** · db
  census MATCH 15/24/10/23/12 + 4 users at the repo-root anchor ·
  the dev server's DB anchor re-probed green (login + dashboard API
  against the REPO db, leads=24 matching the census) · **probe:ref
  STABLE at `46bc2d9c`** (the demo data still ZERO; nav 256px/8
  links; the 390 census; the landing census — every standing layer
  verified).
- THE PARITY RE-VERIFICATION (the operator's named focus, probed
  live with agent-browser 0.41.1 against BOTH apps logged in):
  **the mobile navigation both surfaces working** — the REFERENCE
  drawer at 390×844 (the "Open navigation" trigger 36px visible →
  the dialog "CRM" + the Close button + the "Navigate between your
  CRM pages" paragraph + the 8 destinations; the body-only scroll
  lock `hidden` with main staying `auto`; the "Leads" link ride
  `/Dashboard` → `/Leads` AND auto-closes AND releases; Escape
  closes AND releases) — OURS the same battery PLUS the documented
  supersets (the body+main DUAL lock `hidden/hidden`, released to
  `visible/auto` on every close path; the resize-past-md auto-close
  verified live at 769px with both locks released and the trigger
  hidden). The landing "Toggle navigation" disclosure menu working
  on BOTH apps (ours the aria-expanded superset, verified
  true→false→true across the toggle ride with the panel
  unmounting; the reference's toggle carries NO aria-expanded —
  null; the 6-link panel on both; the toggle correctly
  `display:none` at 1280).
- Tailwind v4 state CLEAN (no `tailwind.config.*` at the repo root ·
  `postcss.config.mjs` plugins EXACTLY `["@tailwindcss/postcss"]` ·
  the vendored `src/app/vendor/tw-animate.css` imported by
  globals.css · zero npm `tw-animate-css` imports in src/ — the one
  grep hit is the explanatory comment). SEO/sitemap live-verified
  on the dev server (the 11-route `/sitemap.xml` 200
  `application/xml` with the 1.0/0.8 priorities · `/robots.txt` 200
  with the Sitemap line · `/manifest.json` 200 `application/json` ·
  the OG/Twitter/canonical/description head tags · the three
  security headers on every path). The test-suite configs verified
  sound and green (vitest.config.ts + playwright.config.ts carried
  the green baseline; no modification warranted — the
  smallest-safe-edit doctrine, the s215 declined-list precedent).
  The hygiene legs clean (no TODO/FIXME · no `console.log` ·
  `.env` + `db/*.db` git-ignored).
- THE FRESH-EYES WALK (the named candidate's own family): **ONE
  LIVE DEFECT FOUND** — see F-216a. The react-hooks/set-state-in-
  effect ERROR claim VERIFIED EMPIRICALLY (a scratch probe file
  with a synchronous setState-in-effect tripped
  `react-hooks/set-state-in-effect` as an ERROR through the
  `eslint-config-next/core-web-vitals` chain, exit 1 — the claim
  holds, the rule rides in via the extends, not the local rules
  block).

## 1. The round's material — F-216a: THE INK-BULLET STALE-PROSE DEFECT (the fresh-eyes walk's live finding) + the unpinned bullet families

The s215 close named the next candidate: "the architecture-facts
section's remaining bullets — the stock-primitive-inks bullet, the
SQLite-path bullet's doc face, and the store/effects bullets — or
whatever live defect the next fresh-eyes walk finds first." The walk
found BOTH: a live defect INSIDE the named family, and the family's
unpinned doc faces.

- THE DEFECT (F-216a): the stock-primitive-inks family's sentence
  **"page-level text keeps `--color-foreground` #111827 (the
  reference's h1s/body use gray-900 there)"** is STALE since
  session-13's S13-P9 flip (`b2da6bd`): the live token is
  `--color-foreground: #0a0a0a` (globals.css:66), the reference's
  BODY default is #0a0a0a (rgb(10,10,10)), and only the page H1s
  are EXPLICIT text-gray-900 #111827 (pinned in PAGE_HEADER). The
  stale sentence survives at **THREE claim sites**:
  1. `AGENTS.md:156-157` — the architecture-facts
     stock-primitive-inks bullet;
  2. `src/app/globals.css:104-105` — the comment above the
     `--color-ink`/`--color-muted-ink` re-pins;
  3. `neo-crm_SKILL.md:1432-1433` — the §4.1 stock-primitive-inks
     prose, which additionally carries the stale TWO-BLACKS
     doctrine ("NEVER fix the difference between the two blacks" —
     post-s13 the token pair CONVERGED at #0a0a0a by design; the
     design-tokens S13-P9 comment documents the convergence and
     keeps `--color-ink` as the input-text token to guard future
     drift).
  THE EXPOSURE: the s13 round added its NEW contract block (the
  AGENTS foreground-flip bullet at :570) but missed the OLD claim
  site; the s169 wave re-pinned the token TABLES (the
  doctrine-census stale-cell negatives) but never the prose
  sentences; the design-tokens pin asserts the LIVE token value
  but reads no doc face — every unit gate stays GREEN while the
  doc face lies. This is the semantic-prose census's own genus,
  live: the exact defect class the D-213a1/D-214a1/D-215a1 pins
  exist to make impossible.
- THE UNPINNED FAMILIES (the genus's residue): the three remaining
  mechanically-checkable bullet families of the architecture-facts
  section ride on the rotation audit's fresh eyes alone on the
  DOC-FACE axis:
  1. THE STORE/EFFECTS BULLETS (AGENTS:97-107) — the API envelope
     (`{ ok, data } | { ok, error: { code, message } }`, built with
     `ok()`/`fail()`/`ERR.*` from `src/lib/api.ts`; the store's
     `call()` helper the only sanctioned client), the ONE Zustand
     store (no React Query, no SWR; `AppShell` calls `hydrate()`
     once on mount), and the no-setState-in-effect doctrine (the
     React 19 lint rule an ERROR here; the three named patterns:
     the key-remount dialogs, the adjust-during-render mobile-nav
     close, the debounced-search yield);
  2. THE STOCK-PRIMITIVE-INKS BULLET (AGENTS:152-164) — the
     ink/muted-ink tokens, the Select trigger's stock form
     (`rounded-md`, no `gap-2`, transparent, NO base `w-full`), the
     topbar search's `pl-10 bg-gray-50 border-gray-200`;
  3. THE SQLITE-PATH BULLET (AGENTS:169-182) — the schema-rule
     resolution, the bun-absolutization hazard and
     `runtimeDatabaseUrl()`'s re-anchor, the first-boot `mkdir -p`,
     the `scripts/prisma-env.ts` wrapper, and the
     always-import-`db`-from-`@/lib/db` seam (the LIVE faces ride
     the db-path/page-layout/design-tokens pins; the DOC face rides
     on nothing).

## 2. The cure (TDD — the sentence flips + the genus-closing pin, test-side + the three doc sites only, src/ code untouched)

**D-216a1 — THE THREE-SENTENCE FLIP** (the stale #111827 prose
cured at all three sites, the s13 flip narrated in its live form):

- `AGENTS.md` — the bullet's sentence flipped to the live truth:
  page-level text rides `--color-foreground` #0a0a0a (the
  reference's body default); only its page h1s are EXPLICIT
  gray-900 #111827, mirrored by our PAGE_HEADER titles (the
  session-13 flip).
- `src/app/globals.css` — the comment above the ink re-pins flipped
  to the same live form (a comment-only edit; the token lines
  untouched — zero build surface).
- `neo-crm_SKILL.md` §4.1 — the sentence flipped AND the
  two-blacks doctrine reframed to the convergence truth (the token
  pair now coincides at #0a0a0a; `--color-ink` kept as the
  input-text token to guard future drift between the two).

**D-216a2 — THE INK/SQLITE/STORE-BULLET SEMANTIC CENSUS PIN** (a
new describe in `tests/facts-census.test.ts` — the
D-204a1…D-215a1 home; the F-109a1 live-read doctrine throughout;
the s215 boundary-guard + wrap-flatten + comment-strip forms):

- it-1 THE FOREGROUND CORRECTION: the stale sentence form ("keeps
  `--color-foreground` #111827") ABSENT from AGENTS.md, globals.css
  AND the SKILL (the retirement negative); the corrected AGENTS
  sentence carries the #0a0a0a form + the h1s-explicit clause; LIVE:
  the `@theme` block's `--color-foreground: #0a0a0a` +
  `PAGE_HEADER.standard.title` carries `text-gray-900`.
- it-2 THE INK/MUTED-INK FAMILY: the AGENTS bullet carries the
  `--color-ink` #0a0a0a (text-ink) + `--color-muted-ink` #737373
  (placeholder:text-muted-ink) claims + the SKILL's convergence
  form; LIVE: both tokens in `@theme` + `INPUT_BASE.bg ===
  "bg-transparent"` + `INPUT_BASE.ink === "text-ink"` +
  `INPUT_BASE.placeholder === "placeholder:text-muted-ink"`.
- it-3 THE SELECT-TRIGGER STOCK CLAIMS: the bullet carries the
  `rounded-md`/no-`gap-2`/transparent/NO-base-`w-full` cluster +
  the per-surface `w-full` doctrine + the topbar search claim;
  LIVE: `SELECT_TRIGGER.base` carries `rounded-md` +
  `bg-transparent`, NO `gap-2`, NO `w-full`;
  `SEARCH_INPUT.extras === "pl-10 bg-gray-50 border-gray-200"` +
  `usesStockInput === true`.
- it-4 THE SQLITE-PATH DOC FACE: the bullet carries the
  schema-rule claim + the bun-absolutization hazard +
  `runtimeDatabaseUrl()` + the mkdir-p claim + the prisma-env
  wrapper + the always-import clause; LIVE: `src/lib/db-path.ts`
  exports `urlForRoot`/`effectiveDatabaseUrl`/`runtimeDatabaseUrl`
  · `tests/db-path.test.ts` exists (the bullet's own "pinned by"
  claim) · ZERO `new PrismaClient` in src/ outside `lib/db.ts` (the
  walk census, comment-stripped) · `scripts/prisma-env.ts` exists ·
  package.json's `db:push` routes through it.
- it-5 THE API-ENVELOPE CLAIMS: the bullet carries the envelope
  shorthand + the ok()/fail()/ERR.* claim + the call()-only
  sanction; LIVE: `src/lib/api.ts` exports `ok`/`fail`/`ERR` and
  the `ApiResult` union `{ ok: true; data: T } | { ok: false;
  error: ApiError }` · `src/stores/crm-store.ts` carries
  `async function call<T>`.
- it-6 THE ONE-STORE CLAIMS: the bullet carries the one-store/no-
  React-Query/no-SWR/hydrate-once claims; LIVE: package.json
  carries NO `react-query`/`swr`/`@tanstack` dependency ·
  `src/stores/` contains EXACTLY `crm-store.ts` · the store
  exports `useCrmStore` via `create(` · `app-shell.tsx` calls
  `hydrate()` in its mount effect.
- it-7 THE LINT-RULE CLAIM: the bullet carries the ERROR claim;
  LIVE: `eslint.config.mjs` extends `nextCoreWebVitals` (the rule's
  carrier chain — empirically verified this round) and does NOT
  disable `react-hooks/set-state-in-effect` (the off-list census).
- it-8 THE THREE PATTERNS: the bullet names the key-remount
  (`entity-dialogs.tsx`), the adjust-during-render mobile-nav
  close, and the debounced-search yield; LIVE:
  `src/components/shared/entity-dialogs.tsx` carries `key={epoch}`
  form-remounts · `app-shell.tsx` carries the adjust-during-render
  form (`prevPathname !== pathname`) · the reports page carries
  `await Promise.resolve()` (the yield comment's own site).

**THE VERIFICATION (the pin's own named proofs):**

- **BORN-RED AT THE DOC ARM** (the TDD discipline, the first
  census round since s208 with a live defect to catch): it-1 runs
  RED at the stale tree (the sentence flip is the cure) — every
  other it born-green (their claims verified live during this
  audit). Then D-216a1 flips the three sites → GREEN.
- MUTATION-PROVEN (each planted → exactly 1 RED at its own pin →
  restored → GREEN): M1 the AGENTS corrected sentence re-flipped
  to the stale #111827 form (doc-side) · M2 the SKILL §4.1
  sentence re-flipped (the second doc site) · M3 the AGENTS
  ink-claims value edited doc-side · M4 the AGENTS topbar-search
  claim edited doc-side (the src-side extras flip is co-pinned at
  page-layout.test.ts:939 — the exactly-1 discipline) · M5 a raw
  `new PrismaClient`
  planted in `src/lib/api.ts` (the src/ census arm) · M6 the
  AGENTS envelope shorthand edited doc-side · M7 a ghost
  `src/stores/ghost-store.ts` planted (the file census arm) · M8
  `"react-hooks/set-state-in-effect": "off"` planted in
  eslint.config.mjs · M9 the entity-dialogs `key={epoch}` flipped
  to `key="fixed"` on one form · M10 the reports-page
  `await Promise.resolve()` yield removed.
- STASH-PROOF: the round's describe stashed → exactly 138/2886
  (the s215 ship state, zero collateral) → restored → 138/2894.

## 3. The re-anchors (the count ladder + the docs lockstep)

- The count ladder: UNIT **2886 → 2894 (+8)** · SUITES 138 HELD
  (the pins land in an existing file) · E2E 226 HELD · badge
  **3112 → 3120** (the unit+e2e arithmetic: 2894+226) +
  `skill-head-216.py` (the SKILL v1.213.0, the s215 layer
  comment-demoted at its ship counts 2886/226, the s216 layer live
  at 2894/226, `last_updated` 2026-11-05 — the same-day form;
  idempotent) + `count-ladder-216.py` (assert-first, idempotent,
  unique-anchor — the live-tense flips + the test-side re-anchors
  in the same stroke: the docs-counts layer-axis pair [first =
  s216, second = s215 at its ship 2886/226] · the 2886 negatives
  join the retired forms · the dialog-geometry-parity F-92a3
  ladder: the four CLAUDE live positives re-anchored 2894).
- The docs lockstep: the AGENTS Session-216 section · the PAD §7.1
  s216 inventory row · `docs/session_455.md` (the polished
  transcript — the 454 slot holds the s215 close's working log,
  this round's pair shifts one) · the worklog Task ID 216 entry ·
  this plan's execution record (§5).

## 4. The final gate

lint 0/0 · tsc 0 · **138/2894 unit** · build · smoke 14/14 ·
`CI=1 bun run test:e2e` 226/226 · the six drift gates re-run CLEAN
(the cures test-side + comment-side + docs only — no src code
touch, but the house proves it) · db census MATCH · `git status`
clean of secrets/dbs.

## 5. The execution record (filled at execution — all claims live-verified)

- §0 the audit: executed in full before the plan landed (the
  carry-over-workspace round: the pull fast-forward + the
  recent-changes audit + the baseline battery + the parity walk
  with agent-browser against BOTH apps + the SEO/sitemap live legs
  + the Tailwind-v4 state legs + the hygiene greps + the
  probe:ref STABLE + the set-state-in-effect empirical probe +
  the scandihaven check at 61711c3).
- D-216a1 + D-216a2: **BORN-RED AT THE DOC ARM** — exactly 2 RED
  at the stale tree (it-1 the FOREGROUND correction + it-2 the
  INK/MUTED-INK family, the stale sentences) → the three-sentence
  flip → **GREEN 78/78 at the file** (70 prior + 8 new). One
  assert-calibration catch at birth (the it-5 envelope doc face:
  the doc's verbatim form carries `{ ok, error: { code, message }
  }` — the COMMA form, not the colon — the assert aligned to the
  doc's verbatim text, the census doctrine).
- THE MUTATION BATTERY caught **ONE birth defect in the pin
  itself, cured in-round**: M11 (the adjust-during-render guard
  neutered to `if (false && prevPathname !== pathname)`) sailed
  through GREEN — the SUBSTRING-WEAK assert (a bare `toContain`)
  survived the plant; **cured with the full conditional-regex
  form** `/if \(prevPathname !== pathname\)/`, then M11 re-run →
  exactly 1 RED. A second self-catch at the ladder: the s216 SKILL
  layer narrative initially QUOTED the stale form verbatim —
  tripping the pin's own ban (the full-suite run caught it;
  **cured with the ban-safe paraphrase**, now the doctrine for
  every future narration of a banned form).
- **MUTATION-PROVEN ×11**: M1 the AGENTS fg sentence re-staled →
  exactly 1 RED (it-1) · M2 the SKILL fg sentence re-staled →
  exactly 1 RED (it-1) · M3 the AGENTS ink value edited → exactly
  1 RED (it-2) · M4 the AGENTS topbar-search claim edited →
  exactly 1 RED (it-3) · M5 a raw `new PrismaClient` planted in
  src/ → exactly 1 RED (it-4) · M6 the AGENTS envelope edited →
  exactly 1 RED (it-5) · M7 a ghost store file planted → exactly
  1 RED (it-6) · M8 set-state-in-effect disabled in
  eslint.config.mjs → exactly 1 RED (it-7) · M9 the epoch-key
  remounts flipped → **2 RED, the DOCUMENTED co-pinned face**
  (it-8 + the s71 dialog-mount-contract — both pins correctly
  trip the same live face; the mutation proves teeth on both) ·
  M10 the reports-page yield removed → exactly 1 RED (it-8) · M11
  the adjust-during-render guard neutered → exactly 1 RED at the
  cured pin — each restored → GREEN.
- **STASH-PROOF**: the describe stashed → exactly 138/2886 (the
  s215 ship state, zero collateral) → restored → 138/2894.
- The collateral re-anchor: **the cure's globals.css comment grew
  the file 482 → 483** — caught by the full-suite run (the
  docs-counts thirteen-sites + the inventory-census globals row),
  cured same-stroke: the PAD §11 row + the SKILL §4.1 line-count
  flipped (the s211 doctrine).
- The count ladder + the docs lockstep: **UNIT 2886 → 2894 (+8)**
  · SUITES 138 HELD · E2E 226 HELD · **badge 3112 → 3120** (the
  unit+e2e arithmetic: 2894+226 — verified against the live unit
  run: **138/2894 GREEN**) + `skill-head-216.py` (the SKILL
  v1.213.0, the s215 layer comment-demoted at its ship counts
  2886/226, the s216 layer live at 2894/226, `last_updated` stays
  2026-11-05 — the same-day form; idempotent — the re-run a
  verified no-op) + `count-ladder-216.py` (assert-first, idempotent,
  unique-anchor — 26 flips, the re-run all no-ops) + the test-side
  re-anchors (the docs-counts layer-axis pair: first = s216 ·
  second = s215 at its ship 2886/226 · the 2886 negatives join the
  retired forms · the dialog-geometry-parity F-92a3 ladder: the
  four CLAUDE live positives re-anchored 2894) + the docs lockstep
  (the AGENTS Session-216 section · the PAD §7.1 s216 inventory
  row · docs/session_455.md · the worklog entry [Task ID 216] ·
  this record).
- The captures 737-741 (the dev-server set, pixel-signature
  verified: the blue sidebar (37,99,235) on the dashboard at 1280
  · the drawer OPEN at 390 with the blue panel across the left
  edge · the landing mobile menu OPEN at 390 · the near-white
  login card at 1280): `737-s216-dev-dashboard-1280.png` ·
  `738-s216-dev-dashboard-390.png` · `739-s216-dev-drawer-open-390.png`
  · `740-s216-dev-landing-mobilemenu-390.png` ·
  `741-s216-dev-login-1280.png`.
- The final gate at the cured tree: lint 0/0 · tsc 0 · **138/2894
  unit** · build (compiled successfully — the 2 warnings the
  pre-existing Turbopack tracing heuristics) · smoke 14/14 ·
  `CI=1 bun run test:e2e` **226/226 (8.0m)** · **all six drift gates
  CLEAN** (the four-band sweep ×4 at `--fail-on-drift` — desktop
  1280 · phone 390×844 · tablet 768×1024 · landscape 1024×768 · the
  fullpage 0.093%/0.316% — the exact standing margins · the interior
  census exit 0, unexplained 0 on every page) · db census MATCH at
  the repo-root anchor · `git status` clean of secrets/dbs (20
  files: 10 modified + 10 new, zero `.env`/`.db`/`.key`).

## The declined list (this round)

- The remaining architecture-facts bullets beyond the three named
  families (the s217+ rotation's standing residue — the section's
  narrative blocks and the sessions-10-49 DOM-parity bullets stay
  under the fresh-eyes walk; their live faces ride the per-family
  pins).
- A mid-rotation eslint/vite-family bump (the standing posture).
- The skills/ mirror (the operator's own domain, the standing
  exclusion — the operator's own instruction this round re-affirms
  the `skills/` folder stays excluded from code checking, testing,
  and compilation; the eslint ignores + the build's
  outputFileTracingExcludes + the walk censuses' exclusions all
  hold). NOTE: `neo-crm_SKILL.md` at the repo ROOT is one of the
  six core docs (NOT the skills/ mirror) — its §4.1 stale sentence
  IS in scope for D-216a1, per the s169 F-5 precedent.
- Test-suite config modifications (both configs verified sound and
  green again this round — the s215 declined-list precedent).
- The mutation-proof of the co-pinned live arms (the ink token
  values in globals.css are co-pinned by design-tokens S10/S13 —
  a src-side flip there trips 2 REDs by design; the mutation
  battery targets the pin's UNIQUE arms, the doc faces and the
  unpinned live faces, per the exactly-1 discipline).
