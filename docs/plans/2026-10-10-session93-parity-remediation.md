# Session-93 Parity Remediation Plan (2026-10-10)

Session 93 on `main` @ `90b23ef` (the s92 ship `1fc00ad` + the operator's
`update session log` commits `f6c3012`→`90b23ef` — `docs/session_186.md`
the operator-added s92 process narrative). The workspace was RESET —
fresh clone, `bun install` from the committed `bun.lock` (next@16.3.6 ·
typescript@5.9.3 · @types/node@26.6.2 — all lockfile-exact), `cp
.env.example .env` + AUTH_SECRET, `db:push` + `db:seed`, census MATCH
(15/24/10/23/12 + 4 users at `<repo>/db/custom.db`). The platform
`DATABASE_URL` override hazard STANDS (the sandbox exports
`file:/home/z/my-project/db/custom.db` — one directory OUTSIDE the repo)
— all session-93 repo operations run under `env -u DATABASE_URL`.

## Baseline gate on the fresh clone

- lint 0/0 ✓ · `bun run test` 1828/1828 (102 suites) ✓ · `bun run
  build` ✓ · `bun run test:e2e` 132/132 fresh CI=1 (3.3m, zero flakes,
  the mobile-nav suite green inside the run) ✓
- **`bun run typecheck` FAILS: 2 errors** — see F-A below. This is the
  session's one material finding.

## The standing layers (89th sweep, NO APP DRIFT)

Drift sweep #89: the reference bundle re-fetched post-login —
`/assets/index-DZ-xbrIm.js` 1,631,071 bytes md5
`a70a637fcf1d4291da8e0d965676dc11` EXACT + the stylesheet
`index-Be9epoFc.css` 79,581 bytes exact — **the 64th consecutive stable
session**. Reference census #89 (isolated agent-browser session, live
login, TRUE 390×844): demo data still zero (the $0.0k KPI family); the
mobile-nav defect STANDS at TRUE 390px (vw=390, nav w=0, 0 visible
links, NO menu button — the 14th+1 census, re-verified in a CLEAN
isolated `AGENT_BROWSER_SESSION` after a multi-tab probe ambiguity in
the main session was chased down); desktop nav normal (256px, 8 links).
Scandihaven re-verified as the tech-stack-patterns reference (fresh
clone @ `d4789c3`, up to date; the same Next.js 16 + React 19 +
Tailwind v4 CSS-first family — no new patterns to adopt).

Our mobile drawer battery re-verified LIVE at TRUE 390×844: the
trigger at (16,16) 36×36, the panel 288px @ x0 computing the sidebar
blue rgb(37,99,235), 8 links, focus inside, body scroll lock,
navigate-close → `/Leads`, the closed root inert + visibility:hidden +
pointer-events none, lock released. **FULLY GREEN.**

## The 93-c rotation — the popover/menu family at TRUE 390px

The s92 suggested-next, executed on BOTH apps (agent-browser, native
clicks for Radix menu triggers — synthetic `.click()` does not fire the
pointer-event sequence Radix listens for):

- **The leads Filters popover: FULL MATCH.** Content 320px @ x=32,
  h=398, radius 6px, white bg on both. Interior `space-y-4` rows
  64/64/64/64/44 with 16px gaps on both — the reference computes the
  gaps as v3 margin-TOP on following rows, ours as v4 margin-BOTTOM on
  preceding rows; in block flow (no grid BFC, no inline-label face) the
  rendered geometry is IDENTICAL. The `space-y` genus does NOT bite
  here.
- **The topbar account menu: geometry MATCH, position genus decoded.**
  Menu 128×74 @ y=56, radius 6, items [Profile, Logout] on both. The
  trigger positions differ — and the divergence is a SECOND-ORDER
  EFFECT OF THE DELIBERATE MOBILE-NAV SUPERSET, not a construction
  defect: the reference's topbar is `flex items-center justify-between
  gap-4` with [search `hidden sm:flex flex-1 max-w-xl`] + [right group
  `flex items-center gap-2 sm:gap-4` (Messages/Notifications/account)];
  at 390 the search wrapper is `display:none`, leaving the right group
  the SOLE flex item — `justify-between` places it at flex-START, so
  the reference's account renders at x=16 LEFT (an accident of its own
  construction). Ours inserts the hamburger as an additional first
  child (the documented superset), so [hamburger LEFT] + [account
  RIGHT] — the natural standard mobile topbar. The construction is
  byte-equivalent otherwise (same classes, same DOM order, same group
  membership, `hidden sm:flex` Messages/Notifications matched,
  account 84px both). DECISION: keep ours; document as a standing
  explained genus (chasing the reference's accidental left-placement
  would restructure a correct construction to imitate a defect).
- **The ⋮ row action menus: not walkable on the reference** (its
  workspace is zero-data — no rows to open). Our row menus stay pinned
  by the e2e family (the role=menu surfaces, the text-only items, the
  red Delete literal). The reports period Select stays covered by the
  s92 settings-selects family (page-level, no `<form>` → no Radix
  native select → phantom-mb-immune).

## The audit — one material finding

**F-A (HIGH — fresh-clone gate breakage): `scripts/sweep.ts:241/:284`
fail `tsc --noEmit` on a fresh clone.** The env object is cast
`{ ...process.env } as Record<string, string | undefined>` before
`spawnSync(..., { env: zEnv })`. Next.js 16's `next/types/global.d.ts`
(pulled into every program that imports `next/server` — `src/lib/api.ts`
et al.) augments `NodeJS.ProcessEnv` with a REQUIRED
`readonly NODE_ENV: 'development' | 'production' | 'test'`; an index-
signature `Record<string, string | undefined>` cannot satisfy that
required property, so no `spawnSync` overload accepts it. Reproduced
three independent ways on lockfile-exact versions (fresh clone; after
`next build` with `.next/types` + `next-env.d.ts` present; after
`next dev` with `.next/dev/types` present; and after deleting
`tsconfig.tsbuildinfo` — a clean full check). The s92 gate's `tsc 0`
was masked by its sandbox's incremental-build state. Impact: `bun run
typecheck` and `bun run gate` FAIL from a fresh clone — violating the
repo's own self-contained zero-config contract (CLAUDE.md: "bun install
&& bun run db:push && bun run db:seed && bun run dev working
everywhere" — the gate is part of the dev story). Fix (verified in an
isolated tsc probe): drop the cast — `const zEnv = { ...process.env };`
infers `NodeJS.ProcessEnv`, satisfies the env option, and
`delete zEnv.DATABASE_URL` remains legal (the property rides the
`Dict<string>` index signature, not a declared required member).

Everything else audited CLEAN: the CSV guard census (all live-data
builders covered — see the operator decisions), the SEO/sitemap layer
live-verified (9-route sitemap in the reference's byte format, robots
with the Sitemap line, the manifest, the per-route canonical/OG family,
the security headers on every route), the vitest/playwright configs
(isolate `*.test.ts` vs `tests/e2e/*.spec.ts` — zero double-pickup),
`.env.example` exactly 3 vars matching the code, `db/` at the repo root
with the census MATCH, the s92 delta re-read line-by-line (controlMt
mb-0 token + genus comment, the contact nested sections, the Event
rows={3}, the Import mt-1 — all as documented).

## The operator decisions (53rd re-affirmation)

Both STAND, evidence re-verified live this session:

- **CSV formula-injection posture (b)** — `guardFormulaPrefix` at
  csv.ts:32 (the `/^[=+@\t\r]/` regex) + the `qq()` seam at
  entity-export.ts:43; the live-data builder census re-derived:
  api/export :117 (`toCsv`), reports :670 (`toCsv`), accounts :192
  (`toQuotedCsv`), leads :355 (`unquotedHeaderCsv`), the dashboard +
  settings `entityDumpCsv` family — **ZERO unguarded live-data
  builders**; the three static templates stay the documented exception.
  The (b)-vs-(c) line (excluding `-`) remains correct: guarding `-`
  would mangle negative numbers and dash-prefixed free text for a
  materially narrower residual vector (modern Excel blocks DDE by
  default). Session 93 touches no CSV surface.
- **Source-vocabulary documented parity** — `LEAD_SOURCE_OPTIONS`
  (constants.ts:138) + `CONTACT_SOURCE_OPTIONS` (:254) with the RAW
  stored values (call/email/website/partner/referral); the constants
  diff since s90 filtered through META|SLUG|SOURCE|STATUS|STAGE|VOCAB
  = zero hits. Session 93 introduces no vocabulary.

## The remediation set (TDD — RED first, then GREEN)

- **S93-P0 — the fresh-clone tsc fix (F-A).** `scripts/sweep.ts`:
  retire the cast — `const zEnv = { ...process.env };` — plus the
  root-cause comment (the Next 16 ProcessEnv augmentation + why the
  inferred type is the correct spawnSync env). RED-first: a new pin in
  `tests/sweep-tool.test.ts` asserting the exact uncast construction
  (the positive form per the s88/s90 needle-in-own-docs lesson — the
  pin names the FIXED construction, not the banned token).
- **S93-P1 — the topbar genus documentation.** A comment block in
  `src/components/layout/topbar.tsx` documenting the
  account-placement-at-390 standing genus (the reference's
  justify-between sole-flex-item accident vs our hamburger-superset
  consequence; the construction byte-equivalence). No behavior change.
- **S93-P2 — the screenshots.** 133 (the topbar account menu OPEN at
  TRUE 390 — the rotation's surface), 134 (the leads Filters popover
  OPEN at TRUE 390 — the full-match surface), 135 (the desktop
  dashboard at 1440 post-fix) under `docs/screenshots/`.
- **S93-P3 — the docs realignment.** `docs/session_187.md` (the formal
  log) + this plan's execution record + the repo worklog + the count
  realignment (README badge/suite list, AGENTS/CLAUDE/PAD/SKILL at the
  new unit count).

## Blast radius (pre-checked)

- The zEnv fix: `scripts/sweep.ts` only; the variable's consumers are
  the two `spawnSync` calls in the same file; no other file imports or
  references zEnv (grep-verified). The `tests/sweep-tool.test.ts` pins
  do not reference the cast (grep-verified — the existing pins assert
  PAGES/TOLERANCE/diffPixels/the alias/the zero-data wiring).
- The topbar comment: comment-only, zero behavior surface; the
  page-layout pins on TOPBAR_LAYOUT are untouched.
- The gate re-run decides everything else (the one-gate discipline).

## The execution record (2026-10-10, session-93)

Executed exactly as planned, RED-first:
- **RED**: the new pin in `tests/sweep-tool.test.ts` (the uncast
  construction) failed against the pre-fix source; the full-suite
  non-vacuousness check: exactly the modified pin set failed, ZERO
  collateral.
- **GREEN**: S93-P0 the cast retired + the root-cause comment;
  S93-P1 the topbar genus comment; S93-P2 screenshots 133/134/135;
  S93-P3 the docs. The full-suite sweep surfaced 2 lockstep
  re-anchors in the s92 dialog-geometry-parity suite (the s92
  doc-anchor pins): the census pin's whitespace-brittle regex →
  the flexible `112\s+comment-stripped` form (the phrase lives
  line-wrapped in §16cf; the pin had matched only the s92
  project_state's unwrapped copy — the s92 "prettier-wrap regex"
  repair class), and the CLAUDE count pin's carry-forward 1828 →
  1829 (the same lockstep re-anchor s92 itself performed 1788 →
  1828).
- **GATE**: lint 0/0 · tsc 0 · 1829/1829 unit [102 suites, +1 net] ·
  build · 132/132 e2e fresh CI=1 [the known settings-debounce focus
  flake on the first run (131/132) passed standalone AND on the full
  re-run — the documented house-rule pattern, untouched by this
  session's delta; the mobile-nav suite green inside the run].
- **LIVE**: the drawer battery at TRUE 390 GREEN; the popover + menu
  family re-verified; the census MATCH; the reference md5-exact (the
  64th consecutive stable session).
