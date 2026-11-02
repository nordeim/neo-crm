# The session-208 plan — THE DOC-CLAIM TOTALITY CENSUS (the genus the s206/s207 closes named: every live-section claim family joins the pin)

Date: 2026-11-02 · Rotation: 208
Task: the operator's standing instruction set — audit + validate the
shipped session-207 state (commit `18b1f74` + the owner's transcript
commit `6372207` — the session_437 transcript is this round's rotation
trigger), re-verify visual + functional parity with the live reference
(`https://neo-crm-8ab2c17c.base44.app/`, logged in with the documented
demo credentials), re-run the standing gates, remediate the identified
gaps, capture the round's screenshots, update the docs, and push to
`main`.

## 0. The audit (the baseline + the discovery — EXECUTED, all green, zero live catches)

The baseline gate at the shipped s207 state (a FRESH CLONE at
`6372207`, `bun install`, the standing `.env` rebuilt from
`.env.example` with a fresh `AUTH_SECRET`,
`DATABASE_URL="file:../db/custom.db"` — the operator's standing ask,
`db/` at the repo root — db:push + db:seed, db census MATCH
15/24/10/23/12 + 4 users at `<repo>/db/custom.db`):

- lint 0/0 · tsc 0 · **138/2853** unit · build (compiled successfully —
  the 2 warnings the pre-existing Turbopack tracing heuristics) ·
  smoke 14/14 · **e2e 226/226 — CLEAN FIRST RUN** (7.9m; the F-207a
  response-wait cure green in the exact full-suite context that caught
  the flake at the s207 baseline; the fresh sandbox needed
  `bunx playwright install chromium` first — the s206/s207
  environment-only precedent, zero code involvement).
- THE SIX DRIFT GATES: the four-band sweep CLEAN at `--fail-on-drift`
  (desktop 1280 · phone 390×844 · tablet 768×1024 · landscape
  1024×768) · the fullpage sweep CLEAN (desktop 0.093% / phone
  0.316%, both inside the standing margins) · the interior census
  **byte-parity, zero unexplained deltas** at all four axes.
- probe:ref STABLE — the reference bundle md5 `46bc2d9c`, the demo
  data still ZERO, the nav census standing. The conditional gates
  stay killed (no fresh bundle, no recharts 4.0).

THE PARITY RE-VERIFICATION (the operator's named focus, probed live
this round with the agent-browser CLI against BOTH apps logged in):

- **THE MOBILE NAVIGATION — BOTH SURFACES, WORKING.** The app drawer:
  open at 390×844 — the Close button + the "CRM" h2 + the 8
  destinations; the reference's overlay computes `rgba(0, 0, 0, 0.8)`
  and OURS `oklab(0 0 0 / 0.8)` (the same 80% black — the v4
  serialization); the reference locks the body scroll while open, ours
  locks BOTH body + main (the documented superset); Escape closes on
  both with every lock released; a "Leads" link ride navigates
  `/Dashboard` → `/Leads` AND auto-closes AND releases every lock —
  body `visible` · main `auto`. The landing disclosure menu: the
  toggle mounts the 6-link panel (Features / Preview / Pricing / FAQ /
  Contact / Open dashboard); the reference carries NO aria-expanded,
  ours carries it (`true` open → `false` after the ride — the
  accessible superset); the FAQ link click closes it + lands on
  `/#faq` (verified on both apps). The VLM comparison of the
  drawer-open pair (ours vs the reference): **IDENTICAL** — the sole
  note the reference's own Base44 platform badge (never mirrored, the
  standing doctrine).
- **TAILWIND V4 STATE CLEAN** (no config file, the CSS-first `@theme`,
  the vendored tw-animate — the four-band pixel sweep + byte-parity
  census proving the rendered output identical).
- **SEO/SITEMAP live-verified**: the 11-route `/sitemap.xml` ·
  `/robots.txt` 200 (the Sitemap line) · `/manifest.json` 200
  `application/json` · the landing head's OG/Twitter cards + canonical
  + og-image (curl-verified on the dev server).
- **Hygiene**: no TODO/FIXME · no `console.log` (the one grep hit a
  comment word) · no `any` (the one grep hit a JSDoc comment word) ·
  `.env` + `db/*.db` git-ignored · `bun audit` at the pinned census 10
  (4 high / 5 moderate / 1 low — all dev-toolchain transitive, zero
  runtime exposure; the standing no-mid-rotation-bump posture holds).
- **The recent-changes audit**: src/ UNCHANGED since the s205 ship
  (the s206 + s207 rounds both test-side + docs only, exactly as
  their records claim — `git diff efe14e7..HEAD --stat -- src/`
  empty); the owner's newest commit `6372207` adds
  `docs/session_437.md` only.
- The scandihaven reference repo re-cloned + its AGENTS/CLAUDE/PAD
  reviewed for the tech-stack patterns (the highest-leverage borrows
  already embodied: the ActionResult envelope ≈ our ok/fail seam, the
  boot env validation ≈ boot-env.ts, the literal-hex @theme rule, the
  sitemap-parity doctrine, the per-package stack-table lockstep — the
  very pattern the facts-census WP-1a embodies and this round's
  D-208a2 extends to the general claim families).

## 1. The round's material — the audit's own genus, taken (F-208a)

**THE DOC-CLAIM TOTALITY CENSUS** — the material the s206 and s207
closes both named as "its own rotation's material" ("the FULL general
doc-claim totality census — every prose claim in every doc pinned to
the code"). This round walks it:

**The census walk (executed before the plan landed):** 1516+ claims
extracted and verified across the mechanically-checkable families —
(1) every `bun run <script>` command claim in the six docs +
`.env.example` (each must exist in package.json scripts); (2) every
backticked repo file-path claim `src/…` `scripts/…` `tests/…`
`prisma/…` `db/…` `docs/…` (each must resolve in the tree); (3) every
`ADR-NNN` reference (each must be defined in the PAD's ADR sections);
(4) every `docs/session_NNN.md` transcript reference (each must
exist); (5) the route-count claims (live 29 files / 41 handlers —
carried live-correct at every site: PAD §2 + DEPLOYMENT's build line
+ SKILL's enumeration, both pinned since F-165e/F-166b/WP-1d); (6) the
line-count claim families (the s109 line-census pins — SKILL §7's
262/540/227/184/67/716/143/1725/442 all live-verified this round);
(7) the SKILL §5.2 structural cluster (28 `.tsx` / 22 `"use client"` /
15 pages / 29 route files / 19 gated / 10 ungated / 1250-line
entity-dialogs — every count live-verified this round).

**The census's verdict: the doc family is CLEAN at the s207 ship
state.** Zero stale claims found on any walked axis — the F-169f /
F-165e / s109-line-census / D-205a2 / D-206a1 / D-207b1 pin families
have held the docs honest. The three flagged-by-regex sites are all
doctrine-covered, not stale: AGENTS's `prisma/migrations/` (a negative
claim — the path does not exist BY DESIGN, the doc asserts its
absence), the PAD's `prisma/.env` (an ADR "Alternatives Rejected"
narration), and the SKILL §16p `src/app/Profile/page.tsx` (a
historical lesson carrying its inline s24 supersession note — the
historical-quote doctrine).

**The census's structural finding (F-208a):** the pinned families
guard every axis EXCEPT ONE — the SKILL §5.2 "Inventory (verified
counts)" cluster: the component census (28 `.tsx` / 22
`"use client"`), the page census (15 `page.tsx`), and the route-gating
census (19 `requireSession()`-gated / 10 ungated) are LIVE-TENSE
claims whose section header itself promises "verified counts" — and
no pin anywhere reads them. All currently correct; all one refactor
away from the F-207b ride (the recharts row sat correct-and-unpinned
for 31 sessions before it went stale under green gates). The same
exposure holds genus-wide: a renamed script, a moved file, or an
undefined ADR reference in any LIVE section would ride every standing
gate today.

## 2. The cures (TDD — born-green genus pins, the D-205a2 precedent)

**D-208a1 — THE §5.2 STRUCTURAL LIVE-CENSUS PIN.** A new describe in
`tests/facts-census.test.ts` (the F-169f home — the D-207b1
continuation): the §5.2 section read, every count read LIVE from the
tree (the F-109a1 live-census doctrine — the `walk()` idiom):
- the component census: `src/components` walked for `.tsx` files; the
  `"use client"` count = files whose FIRST LINE carries the directive;
- the page census: `src/app` walked for `page.tsx` (the `.jsx` render
  aliases excluded by extension — the s24 casing-alias doctrine);
- the route-gating census: `src/app/api` walked for `route.ts`; a
  file is GATED when its COMMENT-STRIPPED source (the `noComments`
  idiom — auth/me's explanatory comment must not mask the live
  semantics) contains a `requireSession(` call; ungated = the rest.
The pin asserts §5.2 carries each live number in its exact claim
form (the doc face must follow the tree), plus freeze arms (the
current census 28/22/15/29/19/10 as explicit anchors — a drift on
EITHER face fails with a named message). Born-green at the cured
tree.

**D-208a2 — THE DOC-CLAIM TOTALITY CENSUS PIN (the genus closes).**
The D-205a2 pattern extended to the doc-claim axes — a census that
walks the LIVE sections of the doc family and asserts every claim
resolves against the tree (any future staleness on EITHER face — a
doc edit planting a phantom, or a rename orphaning a live claim —
trips the unit gate):
- **The live-section scoping (the s206 doctrine — historical session
  records keep their ship-time quotes; the pin bans the LIVE claim
  site):** README + CLAUDE + DEPLOYMENT whole-file (zero embedded
  session records — verified); AGENTS = the head (Commands +
  Architecture facts) up to the first session record + the
  Conventions/Git islands (the `**Session-50**` / `**Session-73 (SKILL
  v1.70.0)**` / `## Conventions that differ from defaults` markers —
  all verified unique); SKILL = the TOC + §1–§16a block + the
  §17–Appendix-B block (the §16b+ session layers + Appendix C/D
  excluded); PAD = §1–§7 head + §7.2–§12 (the §7.1 inventory rows
  excluded — the `### 7.1 ` / `### 7.2 ` markers verified unique).
- **it-2 (the command arm):** every `bun run <script>` claim in the
  live sections + `.env.example` must exist in package.json scripts.
- **it-3 (the path + ADR arm):** every backticked repo path claim in
  the live sections must resolve (extension-less forms matched
  against `.ts`/`.tsx` siblings); every `ADR-NNN` reference in the
  live sections must be defined in the PAD — with the negative-claim
  window (a path claim whose ±2-line context asserts absence — the
  `prisma/migrations/` form — is a verified-by-doc claim, not a
  phantom; "Alternatives Rejected" narration likewise).

**MUTATION-PROVEN ×5 (the born-green genus-pin proof, the D-205a2
doctrine):** M1 the §5.2 component count planted stale (28 → 27 in
the doc) → exactly 1 RED (it-1) · M2 a phantom `bun run` claim
planted in a live section → exactly 1 RED (it-2) · M3 a phantom repo
path planted in a live section → exactly 1 RED (it-3) · M4 an
undefined `ADR-099` planted in a live section → exactly 1 RED (it-3)
· M5 the §5.2 gating count weakened (19 → 18) → exactly 1 RED (it-1)
— each restored → GREEN. src/ untouched by the cures (tests only —
the baseline-inert construction; no doc flips needed: the doc family
is clean, the round's material is the PIN, not a cure of stale rows).

**The .env.example bidirectionality holds**: the standing face (the
six app knobs + the four s204 parity knobs + E2E_PORT + HEADLESS =
the D-205a2 totality) is unchanged this round; the working `.env`
was rebuilt from it at the fresh clone (fresh `AUTH_SECRET`), the app
boots, db census MATCH.

## 3. The re-anchors (the count ladder + the docs lockstep)

- `scripts/count-ladder-208.py` (the 207 form, unit-only): UNIT
  **2853 → 2856** (+3 — the three D-208a1/D-208a2 its) · SUITES 138
  HELD (the pins land in an existing file) · E2E 226 HELD · badge
  **3079 → 3082** (the unit+e2e arithmetic: 2856+226). The retired
  2853 site-forms join the negatives (the s192 doctrine). Sites: the
  README badge · Tested row · tree · commands; the AGENTS commands
  table · gate-order; the CLAUDE gate-order · commands · pyramid ·
  coverage seam; the PAD tree · Total · HEAD · checklist · commands;
  the SKILL commands · Appendix B unit total; the test-side
  re-anchors (the docs-counts UNIT constant + the layer-axis pair
  [first = s208, second = s207 at its ship 2853/226] + the 2853
  negatives · the dialog-geometry-parity F-92a3 ladder).
- `scripts/skill-head-208.py`: the SKILL frontmatter v1.204.0 →
  **v1.205.0**, `last_updated` 2026-11-01 → **2026-11-02** (the new
  calendar day — the flip form), the H1 lockstep, the s207 layer
  comment-demoted at its ship counts (2853/226), the new s208 head
  layer at 2856/226.
- The AGENTS Session-208 section · the PAD §7.1 s208 inventory row ·
  `docs/session_438.md` (the transcript) · the worklog Task ID 208
  entry · this plan's execution record (§5).

## 4. The final gate

lint 0/0 · tsc 0 · **138/2856** unit · build · smoke 14/14 ·
`CI=1 bun run test:e2e` 226/226 · the desktop + phone sweeps re-run
CLEAN (the cures are baseline-inert by construction — test files
never enter the build — but the house proves it) · db census MATCH ·
`git status` clean of secrets/dbs.

## 5. The execution record (filled at execution — all claims live-verified)

- §0 the audit: executed in full before the plan landed (the baseline
  gate + the six drift gates + the probe + the parity re-verification
  with agent-browser against BOTH apps + the VLM drawer comparison +
  the SEO/sitemap curl legs + the hygiene greps + the recent-changes
  diff + the scandihaven review + the census walk itself: 1516+
  claims across the seven families). All green, zero live catches.
- D-208a1: born-green at the cured tree — the §5.2 cluster read live
  (28/22/15/29/19/10) and asserted in the exact claim forms + the
  freeze anchors. Two anchor-form corrections at birth (the pin's
  own flaws, not doc staleness): the §5.2 gating claim wraps across
  lines ("… — 19 gated via / `requireSession()`…") — the single-line
  anchor is the count form — and the ungated form verified as-is.
- D-208a2: born-green at the cured tree — the live-section census
  (commands + paths + ADRs) walked over the scoped segments. One
  anchor-form correction at birth: the PAD carries TWO ADR definition
  forms (the bold `**ADR-001..017:**` + the H3 `### ADR-018..022`) —
  both extracted; the first run's ADR-021 catch was the extraction
  gap, not a phantom reference.
- MUTATION-PROOF ×5 (each planted → exactly 1 RED at its arm →
  restored → GREEN):
  - M1 the §5.2 component count re-planted 28 → 27 → exactly 1 RED
    (D-208a1, the component-census anchor).
  - M2 the phantom `bun run no-such-script-208` planted in README →
    exactly 1 RED (D-208a2, the command arm).
  - M3 the phantom `src/lib/phantom-seam-208.ts` planted in README →
    exactly 1 RED (D-208a2, the path arm).
  - M4 the undefined ADR-099 planted in README → exactly 1 RED
    (D-208a2, the ADR arm).
  - M5 the §5.2 gating count weakened 19 → 18 → exactly 1 RED
    (D-208a1, the gating-census anchor).
- The ladder: skill-head-208.py (4 flips: the s208 layer live, the
  frontmatter 1.204.0 → 1.205.0, the H1, last_updated 2026-11-01 →
  2026-11-02; idempotent — the re-run a verified no-op) +
  count-ladder-208.py (**26 flips** — the README/AGENTS/CLAUDE/PAD/
  SKILL live sites + the docs-counts UNIT constant + the layer-axis
  pair [first = s208, second = s207 at its ship 2853/226] + the 2853
  negatives + the dialog-geometry-parity F-92a3 four positives +
  negatives; one anchor correction at run time — the negatives-block
  join anchors on the s207 2851-block tail, not the s206 2849 form;
  the re-run 26 no-ops) → **138/2856 GREEN** with every doc pin
  passing — the arithmetic verified against the live unit run BEFORE
  any doc flip (clean first pass, no in-flight corrections).
- The .env bidirectionality: executed at the fresh clone (the .env
  rebuilt from .env.example, a fresh AUTH_SECRET, the app boots, db
  census MATCH — the mid-rebuild sequencing cured: the first db:seed
  ran pre-.env and landed on the wrong file, re-seeded with the .env
  in place, census MATCH). The standing env face unchanged this
  round.
- The captures 697-701: VLM-verified (each confirmed showing the
  intended page/state — see the session_438.md transcript).
- The final gate: see the session_438.md transcript close.

## The declined list (this round)

- A mid-rotation eslint/vite-family bump to cure the advisories —
  the standing no-mid-rotation-bump posture (a toolchain bump forces
  the pixel baselines' re-derivation — its own rotation).
- A semantic-prose-claim census (narrative claims that no mechanical
  grammar can extract — e.g. "the drawer is a deliberate fix over
  the reference") — the mechanically-checkable families are now all
  pinned (this round's close); the prose residue stays under the
  rotation audit's fresh-eyes walk, which has caught every stale
  doctrine note so far (F-169a, F-206a, F-207b all fell to it).
- Re-walking the interactive-table families — the standing kill
  re-verified (the reference bundle STABLE at `46bc2d9c`, the demo
  data ZERO; no new walk material exists).
- The `.env` working-tree refresh as a repo change — `.env` is
  operator-local and untracked; the bidirectional rebuild ritual
  covers the verification (executed at this round's fresh clone).
- Committing the round's census-walker scripts (`doc-claim-census-
  208*.py`) — one-shot audit material; the PIN (D-208a2) is the
  permanent census, the method documented in this plan.
