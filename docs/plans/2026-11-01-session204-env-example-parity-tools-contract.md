# The session-204 plan — THE OPERATOR'S STANDING VERIFICATION ROUND + THE .ENV.EXAMPLE PARITY-TOOLS CONTRACT (the drift-gate knobs join the documented env face)

Date: 2026-11-01 · Rotation: 204
Task: the operator's standing instruction set — audit + validate the
shipped session-203 state (commit `0b307aa` + the owner's transcript
commit `257cf15` — the session_429 transcript is this round's rotation
trigger), re-verify visual + functional parity with the live reference
(`https://neo-crm-8ab2c17c.base44.app/`, logged in with the documented
demo credentials), re-run the standing gates, remediate the identified
gaps, capture the round's screenshots, update the docs, and push to
`main`.

## 0. The audit (the baseline + the discovery — EXECUTED, all green)

The baseline gate at the shipped s203 state (the fresh clone at
`257cf15`, tree clean, the env rebuilt: `.env` from `.env.example`
with `DATABASE_URL="file:../db/custom.db"` — the operator's standing
ask, `db/` at the repo root — + a fresh `AUTH_SECRET` · `db:push` +
`db:seed`):

- lint 0/0 · tsc 0 · **138/2841** unit · build · smoke 14/14 ·
  **e2e 226/226** (8.0m, clean first run — the s164-lineage
  settings-defaults focus flake did NOT recur).
- db census MATCH (contacts 15 / leads 24 / accounts 10 / activities
  23 / events 12 + 4 users) at `<repo>/db/custom.db`.
- THE SIX DRIFT GATES: the four-band sweep CLEAN at
  `--fail-on-drift` (desktop 1280 · phone 390×844 · tablet 768×1024 ·
  landscape 1024×768 — every page at the 0.00-0.78 floor except the
  standing settings picklist-data genus 2.64/3.61% and the login logo
  genus 0.28/0.78%, both inside their standing margins) · the interior
  census **byte-parity, zero unexplained deltas** on every page at
  every axis.
- probe:ref STABLE — the reference bundle md5 `46bc2d9c`, the demo
  data still ZERO, the nav census standing. The conditional gates
  stay killed (no fresh bundle, no recharts 4.0).

THE PARITY RE-VERIFICATION (the operator's named focus, probed live
this round with the agent-browser CLI against BOTH apps logged in):

- **THE MOBILE NAVIGATION — BOTH SURFACES, WORKING.** The app drawer
  (the s147 Radix-sheet re-derivation): open at 390×844 — the Close
  button + the "CRM" h2 + the 8 destinations; Escape closes; a link
  ride navigates (`/Dashboard` → `/Leads`) AND auto-closes AND
  releases BOTH scroll locks (body `visible` · main `auto` — the
  MAIN-scroller superset); the overlay computes `oklab(0 0 0 / 0.8)`
  (the `bg-black/80` contract). The landing disclosure menu (the
  s203-registered marketing machine): the toggle mounts the
  `div.md:hidden.border-t` panel (6 links, `aria-expanded` rides),
  an in-panel link click closes it and lands on the section. The
  VLM comparison of the drawer-open pair (ours vs the reference):
  structurally identical — the sole note the reference's own Base44
  platform badge (never mirrored, the standing doctrine).
- **THE DASHBOARD + THE LANDING + THE LOGIN** — DOM censuses match
  the reference at desktop + phone (our named-aria supersets aside:
  "Account menu", "Filter by stage/source", "Filter deals", "More
  actions" — the documented a11y supersets).
- **TAILWIND V4 STATE CLEAN**: no `tailwind.config.*` (CSS-first
  `@theme` in globals.css, literal hex), the vendored
  `src/app/vendor/tw-animate.css`, `postcss.config.mjs` on
  `@tailwindcss/postcss`, the documented v4 pitfalls (hidden-attr,
  space-y flip, shadow-sm, outline-none, var() chains) all avoided
  in source — and the four-band pixel sweep + interior census prove
  the rendered output identical.
- **SEO/SITEMAP live-verified**: `/sitemap.xml` (11 routes, the
  byte-format contract), `/robots.txt`, `/manifest.json`, the root
  `metadataBase` + OG/Twitter cards + canonical (the landing head
  carries description, og:*, twitter:*, canonical, manifest — curl-
  verified on the dev server).
- **Hygiene**: no TODO/FIXME markers, no `console.log`, no `any`, no
  `window.location.href` outside the sanctioned sites; `.env` +
  `db/*.db` git-ignored (the tracked face: `db/.gitkeep` +
  `.env.example`); `bun audit` at the s203-pinned census 10 (4 high /
  5 moderate / 1 low — all dev-toolchain transitive, zero runtime
  exposure; the standing no-mid-rotation-bump posture holds).

## 1. The round's material (the gap the audit found)

**THE .ENV.EXAMPLE PARITY-TOOLS CONTRACT.** `.env.example` documents
the six app knobs (DATABASE_URL · NEXT_PUBLIC_SITE_URL · AUTH_SECRET ·
NEO_PROXY_HOPS · NEO_DISABLE_IN_APP_OTP · NEO_DISABLE_IN_APP_RESET —
the F-167e six-knob contract, pinned at four carriers). But the repo's
own drift-gate tooling consumes FOUR MORE env vars with baked-in
defaults and no documented face:

- `scripts/sweep.ts:741-744` — `OUR_URL` (default
  `http://localhost:3000`) · `REF_URL` (default
  `https://neo-crm-8ab2c17c.base44.app`) · `REF_EMAIL` / `REF_PASSWORD`
  (the documented demo login defaults);
- `scripts/drift-probe.ts` + `scripts/interior-census.ts` — the same
  family.

An operator running the six drift gates against a different port or a
different reference deployment (the gates are the repo's own
`gate:full` ceremony) has no documented knob — the exact F-167e genus
(the env face trailing the code face) on the tooling axis.

## 2. The cure (TDD)

**D-204a1 — THE PARITY-TOOLS PIN (RED-first).** One new describe block
in `tests/facts-census.test.ts` (the .env.example content battery's
own home — the F-169p precedent): pins that `.env.example` documents
all four parity-tool vars WITH their defaults (the
sweep.ts source read live — the live-census doctrine: the pin reads
the script's own default literals, so a default change in the tool
fails the pin until the doc face follows). RED at birth on the
pre-fix file (verified: exactly the new its fail, zero collateral) →
the cure: a commented `# ---- Parity-gate tooling (optional) ----`
block appended to `.env.example` (all four vars commented out — the
defaults remain authoritative; the block is documentation, not
configuration) → GREEN.

**The .env.example bidirectionality holds**: the six-knob contract
pins are toContain-form — the appended block cannot trip them
(verified by running the full unit layer after the edit).

## 2b. The final-gate live catch (D-204b — added at execution)

The first final-gate e2e run tripped the /calendar a11y registrations
(`color-contrast node "span[title=\"Call — Khalid (EGT)\"]" cites no
sanctioned matcher`) — persistent across four runs, not the s164
flake. The decoded root cause: the today cell's event chips
(`bg-white/20 text-white` on the `bg-sidebar` pill — the reference's
own palette, the same white-wash genus the register sanctions) flag
axe color-contrast at 3.63:1, and the axe TARGET FORM is
count-dependent — with ≥2 `bg-white/20` nodes no class is unique and
axe falls back to the `span[title=\"…\"]` attribute form, which the
class-based white-wash matcher cannot catch.

- **D-204b1**: the white-wash matcher gains the `span[title=` arm
  (the count-dependence documented in the matcher comment). The cure
  is test-side only (src/ untouched — the pixel parity contract
  stands; the house doctrine: the reference's own palette is
  sanctioned with a citation, not "fixed").
- **D-204b2**: the title-attribute source census (the arm's scoping
  guard) — the calendar chip is the ONLY `title=` HTML-attribute
  construction in src/ (the backward-tag-scan form excluding
  component-prop passes). Born-green; mutation-proven (the planted
  title= on a landing DOM span → exactly 1 RED → restored).
- **The collateral re-anchor**: the a11y.spec.ts line census 967 →
  984 (the PAD §11 row — caught by the inventory-census live pin).

## 3. The re-anchors (the count ladder + the docs lockstep)

- `scripts/count-ladder-204.py` (the 203 form, unit-only): UNIT
  **2841 → 2845** (+4 — the two D-204a1 its + the two D-204b2 its) ·
  SUITES 138 HELD (the pins land in an existing file) · E2E 226 HELD ·
  badge **3067 → 3071** (the unit+e2e arithmetic: 2845+226). Two
  in-flight arithmetic errors (2842/3068 then 2843/3069) were caught
  by the live unit run and corrected before any commit (the s103
  precedent). The retired 2841 site-forms join the
  negatives (the s192 doctrine). Sites: README (badge · Tested row ·
  tree · commands) · AGENTS (commands table · gate-order) · CLAUDE
  (gate-order · commands · pyramid · coverage seam) · PAD (tree ·
  Total · HEAD · checklist · commands) · SKILL (commands · Appendix B
  unit total) · the test-side re-anchors (docs-counts UNIT constant +
  layer-axis · dialog-geometry-parity F-92a3 ladder).
- `scripts/skill-head-204.py`: the SKILL frontmatter v1.200.0 →
  **v1.201.0**, `last_updated` 2026-10-31 → 2026-11-01, the H1
  lockstep, the s203 layer comment-demoted at its ship counts
  (2841/226), the new s204 head layer.
- The AGENTS Session-204 section · the PAD session inventory row ·
  `docs/session_430.md` (the transcript) · the worklog Task ID 204
  entry · this plan's execution record (§5).
- The PAD §11 facts-census row: NOT touched (the file carries no §11
  line-census row — verified against the live table).

## 4. The final gate

lint 0/0 · tsc 0 · **138/2845** unit · build · smoke 14/14 ·
`CI=1 bun run test:e2e` 226/226 · the desktop + phone sweeps re-run
CLEAN (the cure is baseline-inert by construction — `.env.example`
never enters the build — but the house proves it) · db census MATCH ·
`git status` clean of secrets/dbs.

## 5. The execution record (filled at execution — all claims live-verified)

- **§0 the audit**: executed in full before the plan landed (the baseline
  gate + the six drift gates + the probe + the parity re-verification
  with agent-browser against BOTH apps + the VLM drawer comparison +
  the SEO/sitemap curl legs + the hygiene greps). All green, as
  recorded in §0. The e2e leg ran clean-first-run (the s164-lineage
  settings-defaults focus flake did NOT recur).
- **D-204a1 RED-at-birth**: the describe added to tests/facts-census.test.ts
  → `bunx vitest run tests/facts-census.test.ts` → **exactly 2 RED**
  (the two new its), 36 standing GREEN — zero collateral.
- **D-204a1 GREEN**: the commented parity-tools block appended to
  .env.example → 38/38.
- **D-204a1 MUTATION-PROOF**: the planted `# REF_EMAIL=MUTATED@wrong.example`
  → **exactly 1 RED** (the live-defaults census pin trips — the doc face
  no longer matches the sweep source) → restored → 38/38.
- **The ladder**: skill-head-204.py (4 flips: the s204 layer live, the
  frontmatter 1.200.0 → 1.201.0, the H1, last_updated 2026-11-01;
  idempotent — the re-run a verified no-op) + count-ladder-204.py (the
  README/AGENTS/CLAUDE/PAD/SKILL live sites + the docs-counts UNIT
  constant + the layer-axis pair + the 2841 negatives + the
  dialog-geometry-parity F-92a3 ladder). TWO in-flight arithmetic
  errors (2842/3068 then 2843/3069 — undercounting the round's its)
  caught by the live unit run and corrected in the same stroke —
  neither ever shipped (the s103 precedent).
- **D-204b (the final-gate live catch — see §2b)**: the /calendar a11y
  registrations tripped persistently; the root cause decoded live (the
  axe target-form count-dependence — the today chips' white-wash flags
  escape the class-based matcher when ≥2 `bg-white/20` nodes force the
  `span[title=…]` attribute form); D-204b1 the `span[title=` arm +
  D-204b2 the title-attribute source census (born-green;
  mutation-proven; src/ untouched); the a11y spec 65/65 GREEN; the
  a11y.spec.ts line census re-anchored 967 → 984 (the PAD §11 row,
  caught by the inventory-census live pin).
- **The six-knob contract held**: the full unit layer GREEN after the
  .env.example append (the toContain-form pins cannot trip on an
  appended block — verified live).
- **The final gate**: see the session_430.md transcript close.

## The declined list (this round)

- A mid-rotation eslint/vite-family bump to cure the minimatch/
  source-map-js/vite advisories — the standing no-mid-rotation-bump
  posture (a toolchain bump forces the pixel baselines' re-derivation
  — its own rotation).
- The s120-era interactive-table re-walk kill adjudication — the
  standing kill re-verified this round (the leads family source
  frozen since s113, the reference bundle STABLE); no new walk
  material exists at the zero-data reference state.
- Unit-count live-census machinery (a runtime counter asserting
  vitest's own reported total against UNIT) — the vitest total
  includes generated tests (for-loop/.each), a live counter would
  need runner internals; the doc-lockstep pins remain the contract.
