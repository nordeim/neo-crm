# The session-210 plan — THE CENSUS CHECKOUT-PORTABILITY CONTRACT (the generated artifacts join the pin, and the fresh-clone gate runs clean)

Date: 2026-11-02 · Rotation: 210
Task: the operator's standing instruction set — audit + validate the
shipped session-209 state (commit `14e82c9` + the owner's transcript
commit `7bd4f3d` — the session_441 transcript is this round's rotation
trigger), re-verify visual + functional parity with the live reference
(`https://neo-crm-8ab2c17c.base44.app/`, logged in with the documented
demo credentials; the named focus: the mobile navigation), re-run the
standing gates, remediate the identified gaps, capture the round's
screenshots, update the docs, and push to `main`.

## 0. The audit (the baseline + the discovery — EXECUTED, one live catch, the first fresh-clone round)

The workspace was RESET this round (the standing brief's own
contingency — `git clone https://github.com/nordeim/neo-crm.git`;
every prior round s204–s209 rode a carried-over workspace). The
standing `.env` contract re-created at the fresh clone
(`DATABASE_URL="file:../db/custom.db"`, `db/` at the repo root;
`bun install` + `db:push` + `db:seed` → db census MATCH
15/24/10/23/12 + 4 users at `<repo>/db/custom.db`).

The baseline gate at the exact s209 ship state, ON THE FRESH CLONE:

- lint 0/0 · tsc 0 · **unit 138/2857 — 1 RED (the round's live catch,
  F-210a below)** · build (compiled successfully — the 2 warnings the
  pre-existing Turbopack tracing heuristics) · smoke 14/14 · **e2e
  226/226 CLEAN** (7.9m; one environment-only wrinkle — the fresh
  sandbox lacked the Playwright browser binaries, `npx playwright
  install chromium` cured it, zero code involvement).
- THE SIX DRIFT GATES: the four-band sweep CLEAN at `--fail-on-drift`
  (desktop 1280 · phone 390×844 · tablet 768×1024 · landscape
  1024×768) · the fullpage sweep CLEAN (desktop 0.093% / phone
  0.316% — the exact standing margins; the sweep split into its two
  `--width/--height` classes, each with the dev server booted
  in-session — the sandbox reaps spawned processes between tool
  invocations, the standing environment precedent) · the interior
  census CLEAN (byte-parity, zero unexplained deltas) · probe:ref
  STABLE at `46bc2d9c` (the demo data still ZERO; the conditional
  gates stay killed).

THE PARITY RE-VERIFICATION (the operator's named focus, probed live
with the agent-browser CLI against BOTH apps logged in):

- **THE MOBILE NAVIGATION — BOTH SURFACES, WORKING.** The reference
  battery: the app drawer open at 390×844 (the Close button + the
  "CRM" h2 + the 8 destinations; the overlay computing
  `rgba(0, 0, 0, 0.8)`; no effective background lock — the reference's
  layout never scrolls at phone, its main scroller stays live; Escape
  closes; the "Leads" link ride navigates `/Dashboard` → `/Leads` AND
  auto-closes) + the landing disclosure menu (the 6-link panel —
  Features / Preview / Pricing / FAQ / Contact / Open dashboard; NO
  aria-expanded; the FAQ click closes it + lands on `/#faq`). Our
  battery: the identical drawer anatomy; the overlay computing
  `oklab(0 0 0 / 0.8)` (the same 80% black — the v4 serialization);
  the DUAL lock (body computed `hidden` + main inline `hidden` — the
  documented superset; Escape + the Leads ride release every lock);
  the disclosure menu carrying `aria-expanded` `true` → `false`
  through the FAQ ride (the accessible superset). **The VLM
  comparison of the drawer-open pair (re-captured this round):
  IDENTICAL.**
- **TAILWIND V4 STATE CLEAN** (no config file, the CSS-first
  `@theme`).
- **SEO/SITEMAP live-verified**: the 11-route `/sitemap.xml` ·
  `/robots.txt` 200 (the Sitemap line) · `/manifest.json` 200
  `application/json` · the landing head's OG/Twitter cards +
  canonical (curl-verified on the dev server).
- **Hygiene**: no TODO/FIXME · no `console.log` · no `any` (the
  single standing hit a comment word) · `.env` + `db/*.db` +
  `tests/e2e/.auth/` git-ignored · `bun audit` at the pinned census
  10 (4 high / 5 moderate / 1 low — all dev-toolchain transitive,
  zero runtime exposure; the zod advisory's flagged face the
  eslint-plugin-react-hooks chain, our direct zod ^4.6.7 ≥ the
  patched 4.6.6).
- **The recent-changes audit**: the owner's newest commit `7bd4f3d`
  adds `docs/session_441.md` only; src/ UNCHANGED since the s205 ship
  (the s206–s210 rounds all test-side + docs only).
- The scandihaven reference repo re-pulled (`61711c3`, unchanged
  since the s208 review — no new material).
- The `.env.example` bidirectionality holds (the standing D-205a2
  face; the totality pins pass at the fresh clone).

## 1. The round's material — the first fresh-clone round's catch (F-210a)

**THE CENSUS CHECKOUT-PORTABILITY BLINDNESS.** The s209 close named
the next rotation's candidates: "whatever the fresh-eyes audit
surfaces (the semantic-prose residue or a new genus the tree grows)."
The fresh clone itself surfaced the genus — the D-208a2
doc-claim totality census's **path + ADR arm** is RED on any fresh
checkout, before a single tool has run.

**The finding:** the path arm asserts every live-section repo-path
claim "must resolve in the tree (or its context must assert
absence)". Seven live-section claims name RUNTIME-GENERATED
ARTIFACTS — git-ignored files the tools themselves create:

- `db/e2e.db` — 4 claim sites (AGENTS.md's E2E block + its
  fresh-boot note · the SKILL §2 stack row · the SKILL e2e section);
- `db/smoke.db` — 1 site (the PAD's smoke leg);
- `tests/e2e/.auth/user.json` — 2 sites (the PAD's e2e rows).

None resolves on a fresh clone (all three are git-ignored), and
their contexts correctly assert USAGE, not absence (the docs are
accurate — each names its generator). The census fails at the first
site it meets (`AGENTS.md` — the e2e scratch-database claim), aborting
the arm. Every prior round s208–s209 ran GREEN **only because the
carried-over workspace still held the artifacts on disk** (the e2e
and smoke runs of earlier rounds) — the same correct-and-lucky genus
as F-206a (the strictness row), F-207b (the recharts row), and
F-209a (the sibling-repo remote): every gate green at the shipped
workspace, the defect invisible until the environment changes. The
operator's standing brief mandates the fresh-clone scenario verbatim
("run `git clone https://github.com/nordeim/neo-crm.git` if your
local workspace has been reset") — the standing `bun run test` gate
must run clean there too.

**The generators (all tracked, all verified):**
`db/e2e.db` ← `tests/e2e/global-setup.ts` (pushes + seeds the e2e
scratch db, `DATABASE_URL=file:../db/e2e.db`) · `db/smoke.db` ←
`scripts/smoke-test.sh` (boots the standalone build on :3210 with
`SMOKE_DB_URL=file:../db/smoke.db`) · `tests/e2e/.auth/user.json` ←
`playwright.config.ts` (the setup project persists the demo session
at `AUTH_STATE`).

## 2. The cure (TDD — the D-206a1/D-207b1/D-209a2 pattern, test-side)

**D-210a1 — THE GENERATED-ARTIFACT CONTRACT.** The path arm's
`pathOk` learns the generated-artifact form — an explicit, frozen
artifact→generator map inside the census (not a loose context
regex):

- the map: `db/e2e.db` → `tests/e2e/global-setup.ts` ·
  `db/smoke.db` → `scripts/smoke-test.sh` ·
  `tests/e2e/.auth/user.json` → `playwright.config.ts`;
- an up-front assertion per entry: the GENERATOR must resolve in the
  tree (a deleted generator → RED with the named message — the
  census gets STRONGER, pinning the generator contract the docs
  claim);
- a self-cleaning bidirectionality assertion: every map entry must
  still be claimed in some live section (a retired artifact claim
  leaves a dead map entry → RED — the map can never rot);
- the claim check: a path in the map passes (its generator already
  asserted); a path NOT in the map still needs the tree or the
  NEGATIVE context — the carve-out does not gut the census (a new
  artifact claim without a map entry stays RED).

**RED-first (the fresh tree IS the RED):** the baseline run above —
the path arm RED at the `AGENTS.md` `db/e2e.db` claim, exactly 1
failed / 2857 passed, the artifacts absent (the fresh clone, before
e2e/smoke ever ran). Then the cure → GREEN.

**THE PORTABILITY PROOF (the cure's own named proof):** with the cure
in, the three artifacts are MOVED AWAY (the fresh-checkout state
reconstructed on demand) and the full facts-census file runs GREEN —
the census now passes independent of whether the tools have ever
run. The artifacts are then restored.

**MUTATION-PROVEN ×3 (each planted → exactly 1 RED at its own
assertion → restored → GREEN):**

- M1 (the carve-out is tight): a claim of an UN-MAPPED artifact
  (`db/fake.db`) planted in a live section → exactly 1 RED at the
  path-claim assert (the census still catches unknown artifacts);
- M2 (the generator contract): the map's `db/e2e.db` entry pointed
  at a nonexistent generator → RED at the up-front generator
  assertion;
- M3 (the self-cleaning map): the PAD's `db/smoke.db` claim retired
  from its live section → RED at the map-entry-still-claimed
  assertion.

src/ untouched (the cure is test-side only — the baseline-inert
construction: nothing in the build reads the census; smoke #14
proves the artifact excludes tests/).

**The .env.example bidirectionality holds**: the standing face (the
six app knobs + the four s204 parity knobs + E2E_PORT + HEADLESS =
the D-205a2 totality) is unchanged this round; the working `.env`
re-created at the fresh clone per the standing contract (db census
MATCH).

## 3. The re-anchors (the count ladder + the docs lockstep)

- **The count ladder: UNCHANGED** — the cure modifies the existing
  D-208a2 arm's logic, adds zero its: UNIT **2858 HELD** · SUITES
  138 HELD · E2E 226 HELD · badge **3084 HELD** (the unit+e2e
  arithmetic: 2858+226). No count-ladder script this round; the
  standing negatives hold.
- `scripts/skill-head-210.py`: the SKILL frontmatter v1.206.0 →
  **v1.207.0**, `last_updated` stays 2026-11-02 (the same-day form),
  the H1 lockstep, the s209 layer comment-demoted at its ship counts
  (2858/226), the new s210 head layer live at 2858/226 (the
  held-count form).
- The test-side re-anchor in the same stroke:
  `tests/docs-counts.test.ts`'s layer-axis pair (the FIRST layer =
  the session-210 layer · the SECOND = the s209 layer at its ship
  2858/226 — the F-108a1 face).
- The AGENTS Session-210 section · the PAD §7.1 s210 inventory row ·
  `docs/session_442.md` (the transcript) · the worklog Task ID 210
  entry · this plan's execution record (§5).

## 4. The final gate

lint 0/0 · tsc 0 · **138/2858** unit (the path arm GREEN with the
artifacts both present and absent — the portability proof) · build ·
smoke 14/14 · `CI=1 bun run test:e2e` 226/226 · the desktop + phone
sweeps re-run CLEAN (the cure is baseline-inert by construction —
test files never enter the build — but the house proves it) · db
census MATCH · `git status` clean of secrets/dbs.

## 5. The execution record (filled at execution — all claims live-verified)

- §0 the audit: executed in full before the plan landed (the
  fresh-clone baseline gate incl. the F-210a RED + the six drift
  gates + the probe + the parity re-verification with agent-browser
  against BOTH apps + the VLM drawer-pair comparison re-captured
  this round + the SEO/sitemap curl legs + the hygiene greps + the
  bun-audit tally + the recent-changes diff + the scandihaven
  re-pull).
- D-210a1: RED-first (the fresh-tree baseline run — exactly 1 RED at
  the AGENTS `db/e2e.db` claim, 2857 passed) → the cure → GREEN at
  the fresh-checkout state (the three artifacts moved away, the full
  facts-census file 51/51) → the artifacts restored → GREEN again.
- MUTATION-PROOF ×3 (each planted → exactly 1 RED at its own
  assertion → restored → GREEN): M1 the un-mapped `db/fake.db`
  claim → 1 RED at the path-claim assert · M2 the broken generator
  mapping → RED at the up-front generator assertion · M3 the retired
  `db/smoke.db` claim → RED at the self-cleaning-map assertion.
- The count ladder HELD (2858/226/3084 — verified against the live
  unit run: 138/2858 GREEN, clean first pass).
- `skill-head-210.py` (idempotent — the re-run a verified no-op) +
  the docs-counts layer-axis re-anchor (first = s210 · second = s209
  at its ship 2858/226) + the docs lockstep (the AGENTS Session-210
  section · docs/session_442.md · the PAD §7.1 s210 inventory row ·
  the plan's execution record + the worklog entry [Task ID 210]).
- The captures 707-711 (the dev-server set): the dashboard at 1280 +
  at 390 · the drawer OPEN at phone (the operator's standing
  mobile-nav ask) · the landing mobile menu OPEN at phone · the
  login card; the drawer pair VLM-verified IDENTICAL against the
  reference re-captured this round.
- The final gate: see the session_442.md transcript close.

## The declined list (this round)

- A doc-side rewording of the seven artifact claims to satisfy the
  NEGATIVE window (e.g. inserting "absent until the first run") —
  the docs are accurate as written (they assert usage and name the
  generators); the defect is the census's environment assumption,
  and the cure belongs test-side (the tighter contract: the
  generator pinned, not the prose bent).
- A general "any context-mentioned tracked path satisfies the claim"
  rule — too loose (a line mentioning any tracked file would pass,
  gutting the census); the explicit frozen map is the tight form.
- The skills/ mirror (`skills/how-to-git-push-using-ssh-wrapper/`)
  — still the operator's own domain (the standing exclusion; the
  s209 declined list records the same).
- A mid-rotation eslint/vite-family bump to cure the advisories —
  the standing no-mid-rotation-bump posture.
- A semantic-prose-claim census — remains the named candidate for a
  future rotation (this round's genus is the census's own
  portability).
- Committing the round's one-shot walker scripts (if any) — the
  GENERATED map inside the census IS the permanent contract.
