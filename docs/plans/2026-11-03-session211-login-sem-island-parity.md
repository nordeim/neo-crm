# The session-211 plan — THE LOGIN SEM-ISLAND PARITY EVENT (the platform's Google-auth island joins the clone, construction-for-construction)

Date: 2026-11-03 · Rotation: 211
Task: the operator's standing instruction set — audit + validate the
shipped session-210 state (commit `356aba8` + the owner's transcript
commit `839cce7` — the session_443 transcript is this round's rotation
trigger), re-verify visual + functional parity with the live reference
(`https://neo-crm-8ab2c17c.base44.app/`, logged in with the documented
demo credentials; the named focus: the mobile navigation), re-run the
standing gates, remediate the identified gaps, capture the round's
screenshots, update the docs, and push to `main`.

## 0. The audit (the baseline + the discovery — EXECUTED, one live catch, the second fresh-clone round)

The workspace was reset again (the standing brief's contingency ran
`git clone`; the standing `.env` contract re-created:
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root;
`bun install` + `db:push` + `db:seed` → db census MATCH 15/24/10/23/12
+ 4 users).

The baseline gate at the exact s210 ship state, ON THE FRESH CLONE —
**the s210 portability cure verified live** (the facts-census path arm
GREEN with all three runtime artifacts absent, before any e2e/smoke
run — the D-210a1 contract's own named proof, reproduced by this
round's environment):

- lint 0/0 · tsc 0 · **138/2858 unit GREEN** (clean first pass) ·
  build (compiled successfully — the 2 warnings the pre-existing
  Turbopack tracing heuristics) · smoke 14/14 · **e2e 226/226 CLEAN**
  (8.1m; one environment-only wrinkle — the fresh sandbox's Playwright
  1.64.1 wanted chromium-1248, `bunx playwright install chromium`
  cured it, zero code involvement, the s209/s210 precedent).
- THE SIX DRIFT GATES — **the interior census CAUGHT THE ROUND'S
  MATERIAL** (below): the four-band sweep CLEAN at `--fail-on-drift`
  ×4 · the fullpage sweep CLEAN (desktop 0.093% / phone 0.316% — the
  exact standing margins) · probe:ref STABLE at `46bc2d9c` (the demo
  data still ZERO; the conditional gates stay killed) · the interior
  census **RED on the login row, all four bands: 2 unexplained events
  each** (the s210 record: zero unexplained — a new reference-side
  drift).
- THE PARITY RE-VERIFICATION (the operator's named focus, probed live
  with agent-browser against BOTH apps logged in): **the mobile
  navigation both surfaces working** — the app drawer at 390×844 (the
  Close button + the "CRM" h2 + the 8 destinations; the overlay
  `rgba(0,0,0,0.8)` vs ours `oklab(0 0 0 / 0.8)` — the same 80% black;
  ours the dual-lock superset; Escape closes with every lock released;
  the "Leads" link ride navigates `/Dashboard` → `/Leads` AND
  auto-closes AND releases every lock) + the **VLM comparison of the
  drawer-open pair: IDENTICAL** (the sole note the reference's own
  Base44 platform badge — never mirrored) + Tailwind v4 state clean +
  SEO/sitemap live-verified (the 11-route `/sitemap.xml` · `/robots.txt`
  200 with the Sitemap line · `/manifest.json` 200 `application/json` ·
  the OG/Twitter/canonical head) + the hygiene legs clean (no
  TODO/FIXME · no `console.log` · the single `any` hit a comment word ·
  `.env` + `db/*.db` git-ignored · `bun audit` at the pinned census 10
  — 4 high / 5 moderate / 1 low, all dev-toolchain transitive) + the
  recent-changes audit (the owner's newest commit adds
  `docs/session_443.md` only; src/ UNCHANGED since the s194 ship) +
  the scandihaven repo re-cloned (`61711c3`, unchanged since the s208
  review).

## 1. The round's material — F-211a: THE LOGIN GOOGLE-BUTTON PLATFORM-ISLAND PARITY EVENT

The s210 close named the next candidates: "whatever the fresh-eyes
audit surfaces (the semantic-prose residue remains the named candidate,
or a new genus the tree grows)." The interior census surfaced the genus
— **a live reference-side parity event on the login card, the same
family as the 2026-10 mobile-nav event (probe #119)**: the Base44
platform re-wrapped the login Google-auth block in its own
design-system island.

**The decode (every face live-probed on the reference this round):**

- THE WRAPPER: the reference's login `div.w-full` now nests a bare
  `<div data-ds="base44" data-theme="light">` island wrapping
  [the google wrap + the or-divider] (the form stays outside). The
  census's `ref-extra ref DIV` event on all four bands.
- THE SEM-TOKEN RE-SKIN: the island's button flipped from the app's
  slate palette to the platform's semantic tokens —
  `bg-[var(--sem-surface-interactive-white-default)]` (#fff) ·
  `text-[color:var(--sem-text-icon-primary)]` (#0f0e0e — near-black,
  vs our slate-700 #334155) ·
  `border-[var(--sem-border-light-default)]` (#e9e6e0 — a WARM gray,
  vs our slate-200 #e2e8f0) · hover
  `--sem-surface-interactive-white-hover` (#f1eeea) +
  `--sem-border-default-default` (#ddd8d2) · the inert `group` class.
  Pixel-verified on the sweep captures: the ref border renders
  (233,230,224) vs ours (226,232,240); the ref text near-black (301px)
  vs ours slate-700 (277px).
- THE ISLAND FONT — **a LIVE WEBFONT**: the island sets
  `--font-body: "Wix Madefor Text", system-ui, sans-serif` and the
  platform loads the latin variable woff2 (400–800). The button label
  SPAN renders **166px** on the reference vs our **172px** — the
  census's `shift` event. (Decisively probed: on the reference,
  `"Wix Madefor Text", system-ui, sans-serif` measures 166 while BOTH
  `system-ui` and `ui-sans-serif` measure 172.5 — the webfont is
  loaded and rendering, `document.fonts` carries it at status
  `loaded`; the 6px delta is the typeface itself, not an alias
  artifact.)
- THE DIVIDER RE-TOKEN: the "or" label span flipped to
  `bg-[var(--sem-surface-interactive-white-default)]` +
  `text-[color:var(--sem-text-icon-secondary)]` (#5d5d5d — vs our
  slate-500 #64748b), and the divider line carries the platform's
  `data-orientation="horizontal" role="none"` attrs.
- THE G ICON: the reference's button inlines the classic exact Google
  G svg (4 paths, `M22.56 12.25…` — the standard brand asset); ours
  ships a hand-approximated variant (`M23.5 12.3…`). The D-194a3
  icon-identity doctrine: mirror the reference's exact svg.
- THE SCOPE: signin view only (the signup view carries NO google
  button on either app — pinned); everything else on the card
  byte-equal (the h1/subtitle/labels/inputs/links all still the system
  stack + slate classes — live-probed); every other census page
  unexplained 0; the sweeps clean on all 12 other pages; the app
  bundle STABLE at `46bc2d9c` (the platform runtime injected the
  island — not an app-bundle change).
- THE PIXEL FACE: the login sweep diff moved **0.28% → 0.46%** (the
  standing login baseline is ~0.28% the brand-mark logo genus; the
  +0.18pp is the re-skin).

## 2. The cure (TDD — the 2026-10 mobile-nav parity-event doctrine: mirror construction-for-construction)

**D-211a1 — THE LOGIN SEM-ISLAND MIRROR** (src-side; the round's
product-code touch):

- `public/fonts/wix-madefor-text-latin.woff2` — the platform's own
  latin variable subset (20.3KB, magic-verified `wOF2`), fetched from
  the reference's public static origin. Provenance + the Wix-IP
  licensing note recorded here: the font is Wix's brand asset served
  by the owner's own reference deployment; the clone mirrors the
  reference's render (the standing asset-mirroring doctrine — the
  logo, the brand mark, now the island font). The owner can swap the
  file for a licensed copy without any code change (the @font-face
  names the family, not the file).
- `src/app/globals.css` — the island CSS, construction-faithful and
  minimal (only what the island's own subtree consumes): the
  `@font-face` (`"Wix Madefor Text"`, `font-weight: 400 800`,
  `font-display: swap`, the woff2 src) + the
  `[data-ds="base44"]` block (the six sem vars the button + divider
  consume + `--font-body` + the island's own
  `font-family: var(--font-body); color: var(--sem-text-icon-primary)`
  rule — the reference's island sets exactly this on the wrapper).
- `src/lib/page-layout.ts` — the LOGIN_LAYOUT flips:
  `google` → the reference's exact sem class string (its exact class
  order, the `group` class included) · `googleIcon` → the reference's
  exact order (`transition-transform duration-200 -ml-4`) ·
  `dividerLabelSpan` → the reference's exact sem form · the divider
  line's platform attrs.
- `src/components/layout/login-card.tsx` — the island wrapper
  `<div data-ds="base44" data-theme="light">` around [the google wrap
  + the divider] (the form stays outside, the S96-P0 block section
  preserved); the GoogleIcon's four paths replaced with the
  reference's exact path data + fills (our `aria-hidden` kept — the
  s19 superset doctrine); the divider line's
  `data-orientation="horizontal" role="none"` attrs (our
  `aria-hidden` on the divider kept — the same doctrine).

**D-211a2 — THE CURE PINS** (test-side, RED-first at birth):

- `tests/login-views.test.ts` — the S96-P0 construction pin
  re-anchored to the island chain (the regex's structure updated:
  `w-full` > island > [space-y-3 google wrap + divider] + form) + the
  new RED-first pins: the island's exact attributes, the sem class
  string, the exact G-icon path data, the divider's sem span + line
  attrs.
- `tests/design-tokens.test.ts` — the island CSS block pin: the
  @font-face family/weight/src form + the `[data-ds="base44"]` var
  values (the six sem hexes + the font-body stack + the island rule)
  — the negative arms ban the retired slate forms at the constants.
- `tests/typography.test.ts` — the zero-webfont docstring carries the
  s211 supersession note (the claim scoped: the app's own surfaces
  stay zero-webfont; the platform's login island is the documented
  exception — the pins' assertions unchanged and still green).
- The e2e untouched (the Google-button visibility/count assertions
  pass at the cured construction; the click-toast behavior unchanged).

**THE VERIFICATION (the cure's own named proofs):**

- THE CENSUS: the interior census login row → **unexplained 0** on
  all four bands (the wrapper event resolved — both trees carry the
  island; the SPAN shift resolved — both render the webfont at 166).
- THE SWEEP: the login diff returns to the ~0.28% baseline family
  (the re-skin + the typeface mirrored; the G icon now exact).
- THE VLM comparison of the login-card pair (ours vs the reference).
- MUTATION-PROVEN (each planted → exactly 1 RED at its own pin →
  restored → GREEN): a sem var value flipped in globals.css · the
  island attribute dropped at the wrapper · the G-icon path
  re-approximated · the retired slate class re-planted at the
  constant.

## 3. The re-anchors (the count ladder + the docs lockstep)

- The count ladder: UNIT 2858 → **2858+N** (the N new cure its —
  counted at execution) · SUITES 138 HELD (the pins land in existing
  files) · E2E 226 HELD · badge 3084 → 3084+N (the unit+e2e
  arithmetic) + `scripts/skill-head-211.py` (the SKILL v1.208.0, the
  s210 layer comment-demoted at its ship counts 2858/226, the s211
  layer live at the new counts, `last_updated` 2026-11-02 →
  2026-11-03) + the count-ladder script (assert-first, idempotent,
  unique-anchor) + the test-side re-anchors in the same stroke (the
  docs-counts layer-axis: first = s211, second = s210 at its ship
  2858/226 · the unit negatives ladder: the retired 2858 forms join
  the negatives · the dialog-geometry-parity F-92a3 ladder: the CLAUDE
  live positives re-anchored).
- The docs lockstep: the AGENTS Session-211 section · the PAD §7.1
  s211 inventory row · the PAD §6 typography row's island-exception
  clause (the live "reference ships ZERO webfonts" claim scoped) · the
  SKILL §2 design-thesis row's island-exception clause (the same
  scoping) · `docs/session_444.md` (the transcript) · the worklog Task
  ID 211 entry · this plan's execution record (§5).

## 4. The final gate

lint 0/0 · tsc 0 · 138/(2858+N) unit · build · smoke 14/14 (the
artifact carries the font — public/ rides the standalone copy) ·
`CI=1 bun run test:e2e` 226/226 · the interior census CLEAN (the
login row unexplained 0 — the round's own cure proof) · the desktop +
phone sweeps re-run CLEAN (the login diff back at its baseline family)
· db census MATCH · `git status` clean of secrets/dbs · the D-210a1
portability spot-check (the three artifacts moved away → the
facts-census file still GREEN).

## 5. The execution record (filled at execution — all claims live-verified)

- §0 the audit: executed in full before the plan landed (the
  fresh-clone baseline incl. the s210 portability-cure live proof +
  the six drift gates with the F-211a catch + the parity battery with
  agent-browser against BOTH apps + the VLM drawer-pair comparison +
  the SEO/sitemap curl legs + the hygiene greps + the bun-audit tally
  + the recent-changes diff + the scandihaven re-pull).
- D-211a1/D-211a2: RED-first (the pins born at the stale tree →
  **exactly 6 RED** — the re-anchored S96-P0 construction pin + the 3
  login-views its + the 2 design-tokens its, zero collateral) → the
  cure → **GREEN 138/2863** → the census/sweep/VLM proofs →
  **MUTATION-PROVEN ×4** (M1 the sem var `--sem-border-light-default`
  flipped → exactly 1 RED at the design-tokens island-block pin · M2
  the `data-ds` attribute dropped at the wrapper → 1 RED at the
  construction pin · M3 the G-icon blue path re-approximated → 1 RED
  at the exact-svg pin · M4 the retired slate class re-planted at
  `LOGIN_LAYOUT.google` → 1 RED at the sem-class pin — each restored
  → GREEN).
- The cure's live proofs, all verified at the cured tree: **the
  interior census login row unexplained 0 at `--fail-on-drift`**
  (EXIT 0; els 44/44; the matches 21 → 26 — the sem faces now compute
  identical) · **the login sweep diff 0.46% → 0.27%** (below the
  standing 0.28% baseline family; the drift gate CLEAN) · the button
  pixel-identical on the sweep captures (the border (233,230,224) on
  both · the near-black text 301px on both · the G-logo color pixels
  48/20/50/45 on both) · the computed span **166 = 166** (the
  webfont live on both; `document.fonts` loaded) · the hover
  #f1eeea / #ddd8d2 on both · **the VLM login-pair comparison:
  MATCH** (the sole delta the reference's own brand-mark logo — the
  documented standing genus, never mirrored).
- The count ladder: **UNIT 2858 → 2863 (+5)** · SUITES 138 HELD ·
  E2E 226 HELD · **badge 3084 → 3089** (the unit+e2e arithmetic:
  2863+226 — verified against the live unit run: 138/2863 GREEN,
  clean first pass) + `skill-head-211.py` (SKILL v1.208.0 · the s210
  layer comment-demoted at its ship 2858/226 · the s211 layer live
  at 2863/226 · `last_updated` 2026-11-02 → 2026-11-03 · idempotent —
  the re-run a verified no-op) + `count-ladder-211.py` (assert-first,
  idempotent, unique-anchor — 26 flips, the re-run 26 no-ops) + the
  same-stroke line-census re-anchors (page-layout.ts 1725 → 1740 ·
  globals.css 442 → 482 — the s168 doctrine: the PAD §11 rows + the
  SKILL §5.2/§5.6 sites + their pins) + the docs lockstep (the AGENTS
  Session-211 section · the PAD §7.1 s211 inventory row + the §6
  typography row's island-exception clause · the SKILL §2
  design-thesis row's island-exception clause · docs/session_444.md
  · the worklog entry [Task ID 211] · this record).
- The captures 712-716 (the dev-server set): the dashboard at 1280 +
  at 390 · the drawer OPEN at phone (the operator's standing
  mobile-nav ask) · the landing mobile menu OPEN at phone · the login
  card at 1280 — the cured Google button visible.

## The declined list (this round)

- Mirroring the platform's FULL `[data-ds="base44"]` token palette
  (hundreds of vars, three theme variants) — the island's own subtree
  consumes six sem vars + the font; the tight mirror pins what the
  construction consumes (the D-194a3 exact-svg doctrine: inline the
  exact construction at the site, not the whole library).
- Hotlinking the reference's font origin (`/static/…woff2` on
  `neo-crm-8ab2c17c.base44.app`) — a runtime dependency on the
  closed platform the clone exists to replace; the self-hosted copy
  is the self-contained form (with the licensing note recorded).
- A doc-wide rewrite of every "zero webfont" mention — the claim is
  scoped at its two LIVE census sites (the PAD §6 row + the SKILL §2
  row) with the exception clause; the historical session layers
  (SKILL §16n, the session narrations) keep their ship-time form (the
  standing doctrine).
- A mid-rotation eslint/vite-family bump (the standing posture).
- The semantic-prose-claim census (remains the named candidate for a
  future rotation — this round's genus is the live parity event).
- The skills/ mirror (the operator's own domain, the standing
  exclusion).
