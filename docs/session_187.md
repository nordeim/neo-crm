# Session 187 — the session-93 formal log (2026-10-10)

## Intake

The workspace was RESET — fresh clone from `origin/main` @ `90b23ef`
(the s92 ship `1fc00ad` + the operator's log commits). Environment
rebuilt from the committed contract: `bun install` off the lockfile
(next@16.3.6 · typescript@5.9.3 · @types/node@26.6.2 — all
lockfile-exact) · `.env` recreated (`DATABASE_URL="file:../db/custom.db"`
+ a fresh AUTH_SECRET + NEXT_PUBLIC_SITE_URL) · `db:push` + `db:seed`
· the census MATCH 15/24/10/23/12 + 4 users at
`<repo>/db/custom.db` (the repo-root `db/` folder, exactly per the
root contract). The platform `DATABASE_URL` override hazard STANDS
(the sandbox exports a parent-of-repo path) — all session-93 repo
operations ran under `env -u DATABASE_URL`.

Core docs absorbed: CLAUDE.md (full), AGENTS.md (head + the session
history), the SKILL frontmatter + project_state (v1.89.0), README/PAD
anchors, `docs/session_185.md` + `docs/session_186.md` (the operator
narrative) + the s92 plan + the repo worklog tail. Session 92 shipped
at `1fc00ad` + `90b23ef`; my task is **Session 93** — the suggested
nexts: (1) walk the popover/menu family at 390, (2) the sweep-tool
width extension, (3) the genus guard re-run — plus the operator's
standing instructions (audit, the two decisions, the parity iteration,
the mobile-nav verification, the SEO/sitemap check, screenshots, docs,
the SSH-wrapper push to `main`).

Scandihaven re-verified as the tech-stack-patterns reference (fresh
clone @ `d4789c3`, up to date; the same Next.js 16 + React 19 +
Tailwind v4 CSS-first family — no new patterns to adopt).

## Baseline (the fresh clone)

- lint 0/0 · `bun run test` 1828/1828 (102 suites) · `bun run build`
  clean · `bun run test:e2e` 132/132 fresh CI=1 (3.3m, ZERO flakes,
  the mobile-nav suite green inside the run)
- **`bun run typecheck` FAILED: 2 errors** — scripts/sweep.ts:241/:284
  (see F-A below). The one material finding of the session.

## The standing layers (89th sweep, NO APP DRIFT)

Drift sweep #89: the reference bundle re-fetched post-login — md5
`a70a637fcf1d4291da8e0d965676dc11` EXACT (1,631,071 bytes) + the
stylesheet 79,581 bytes exact — **the 64th consecutive stable
session**. Reference census #89: demo data zero · desktop nav normal
(256px/8 links) · the mobile-nav defect STANDS at TRUE 390px (nav
w=0, 0 visible links, NO menu button). The census was re-run in a
CLEAN isolated `AGENT_BROWSER_SESSION` after a multi-tab probe
ambiguity in the main session was chased down (late-session probes
had flipped to our tab and momentarily looked like the reference
shipped a hamburger — the isolated re-census settled it: the defect
stands, consistent with the byte-identical bundle).

Our mobile drawer battery re-verified LIVE at TRUE 390×844: the
trigger at (16,16) 36×36 · the panel 288px @ x0 computing the sidebar
blue rgb(37,99,235) · 8 links · focus inside · the body scroll lock ·
navigate-close → `/Leads` · the closed root inert +
visibility:hidden + pointer-events none · the lock released.
**FULLY GREEN.**

## The audits

The s92 delta re-read line-by-line (the controlMt `mt-2 mb-0` token +
genus comment, the contact nested sections, the Event `rows={3}`, the
Import `mt-1`, the sweep tool) — all as documented, zero drift. The
SEO/sitemap layer live-verified on the dev server: the nine-route
`/sitemap.xml` in the reference's byte format (bare
`application/xml`), `/robots.txt` with the Sitemap line, the PWA
`/manifest.json`, the security-header trio on every route, the
per-route canonical/OG family. The vitest/playwright config layer
verified (the `*.test.ts` vs `tests/e2e/*.spec.ts` isolation — zero
double-pickup; the pinned e2e db; the CI=1 fresh-boot gate).
`.env.example` exactly 3 vars matching the code. The CSV guard census
re-derived live (see the operator decisions).

**F-A (HIGH — the fresh-clone gate breakage, the session's one
material finding).** `scripts/sweep.ts:241/:284` failed
`tsc --noEmit` on the fresh clone: the child-process env object was
cast `as Record<string, string | undefined>` before
`spawnSync(..., { env })`. Next.js 16's `next/types/global.d.ts`
(pulled into every program that imports `next/server` —
`src/lib/api.ts` et al.) augments `NodeJS.ProcessEnv` with a REQUIRED
`readonly NODE_ENV: 'development' | 'production' | 'test'`; an
index-signature record cannot satisfy that required member, so no
`spawnSync` overload accepts it. Reproduced on lockfile-exact
versions across fresh-clone / post-build (with `.next/types` +
`next-env.d.ts` present) / post-dev (`/next/dev/types`) / clean
`tsconfig.tsbuildinfo` states — the s92 gate's `tsc 0` was masked by
its sandbox's incremental build state. Impact: `bun run typecheck`
and `bun run gate` FAIL from a clean checkout — violating the
repo's own self-contained zero-config contract.

## The operator decisions (53rd re-affirmation)

Both STAND, evidence re-verified live:

- **CSV formula-injection posture (b)** — `guardFormulaPrefix` at
  csv.ts:32 (the `/^[=+@\t\r]/` regex) applied through `escapeCell`
  (toCsv) + the `qq()` seam (entityDumpCsv / toQuotedCsv /
  unquotedHeaderCsv); the live-data builder census re-derived:
  api/export :117 · reports :670 · accounts :192 · leads :355 · the
  dashboard + settings entityDumpCsv family — **ZERO unguarded
  live-data builders**; the three static templates stay the
  documented exception (our own content). The (b)-vs-(c) line
  (excluding `-`) remains correct: guarding `-` would mangle negative
  numbers and dash-prefixed free text for a materially narrower
  residual vector. Session 93 touches no CSV surface.
- **Source-vocabulary documented parity** — `LEAD_SOURCE_OPTIONS`
  (constants.ts:138) + `CONTACT_SOURCE_OPTIONS` (:254) with the RAW
  stored values (call/email/website/partner/referral; the emojis are
  create-dialog labels only). No vocabulary introduced this session.

## The rotation (93-c) — the popover/menu family at TRUE 390px

Executed on BOTH apps (agent-browser; **native clicks** for the Radix
menu triggers — a synthetic `.click()` does not fire the
pointer-event sequence Radix listens for, and menus silently fail to
open):

- **The leads Filters popover: FULL MATCH.** Content 320px @ x=32,
  h=398, radius 6px, white bg on both. Interior `space-y-4` rows
  64/64/64/64/44 with 16px gaps on both — the reference computes the
  gaps as v3 margin-TOP on following rows, ours as v4 margin-BOTTOM
  on preceding rows; in popover BLOCK flow (no grid BFC, no
  inline-label face) the rendered geometry is IDENTICAL. The
  `space-y` genus does not bite here. (The popper wrapper widths
  differ — 320 there, 390 ours — but the wrapper is an invisible
  positioning box; the content is the visual surface.)
- **The topbar account menu: geometry MATCH + the trigger-position
  genus decoded.** Menu 128×74 @ y=56, radius 6, items
  [Profile, Logout] on both. The trigger positions differ — the
  reference's account button renders at the LEFT edge at 390: its
  topbar is `flex items-center justify-between gap-4` holding
  [search `hidden sm:flex flex-1 max-w-xl`] + [right group
  `flex items-center gap-2 sm:gap-4`]; below `sm` the search wrapper
  is `display:none`, leaving the right group the SOLE flex item, and
  `justify-between` places a sole item at flex-START — the reference's
  account lands at x=16 LEFT, an accident of its own construction.
  OURS inserts the hamburger as an additional first child (the
  deliberate mobile-nav superset), so the row resolves [hamburger
  LEFT] + [account RIGHT] — the natural mobile pattern. The
  construction is byte-equivalent otherwise (same classes, same DOM
  order, same group membership, `hidden sm:flex`
  Messages/Notifications matched, the account trigger 84px on both).
  DECISION: keep ours; documented as a STANDING EXPLAINED GENUS in
  topbar.tsx — chasing the accidental left-placement would imitate a
  defect-side artifact at the cost of a correct construction.
- **The ⋮ row action menus: not walkable on the reference** (its
  workspace is zero-data — no rows to open). Our row menus stay
  pinned by the e2e family (the role=menu surfaces, the text-only
  items, the red Delete literal). The reports period Select stays
  covered by the s92 settings-selects family (page-level, no
  `<form>` → no Radix native select → phantom-mb-immune).

## The remediation (TDD — RED first)

- **RED**: the new pin in `tests/sweep-tool.test.ts` — the uncast
  construction asserted in the positive form
  (`const zEnv = { ...process.env };`) + the cast-retirement negative;
  failed against the pre-fix source (1 failed | 8 passed). The
  stash-based non-vacuousness re-proof after the fix: pre-fix state
  re-stashed → 1 failed | 8 passed → restored → 9/9 — exactly the
  modified pin set, ZERO collateral.
- **GREEN (S93-P0)**: the cast retired at scripts/sweep.ts + the
  root-cause comment (the Next 16 ProcessEnv augmentation; why the
  inferred type is the correct spawnSync env; why
  `delete zEnv.DATABASE_URL` stays legal — the property rides the
  `Dict<string>` index signature).
- **S93-P1**: the topbar genus documentation (topbar.tsx — the
  standing-genus comment block; zero behavior change).
- **S93-P2**: screenshots 133 (the account menu OPEN at TRUE 390) +
  134 (the leads Filters popover OPEN at TRUE 390) + 135 (the desktop
  dashboard 1440 post-fix) — VLM 5/5 × 3 (two adjudications: 133's
  "anchored below" NO vs the DOM-verified right-edges-aligned menu at
  246..374 within 390; 134's "cut off" NO vs the DOM-verified popover
  at 32..352 within 390; one expected note: 135's recent-deals below
  the 900px fold — the shared dashboard scroll geometry).
- **S93-P3**: the docs — this log + the plan's execution record + the
  worklog + README (badge 1961, the counts, the Tested row's
  sweep-tool mention) + AGENTS (the counts + the §Session-93 block) +
  CLAUDE (the counts ×4) + PAD (the s93 inventory row + the Total
  102/1829 + the footnote) + SKILL v1.90.0 (§16cg + project_state +
  the H1, via the assert-first `skill_edits_s93.py`).

## The gate

lint 0/0 · tsc 0 (the fix — verified three ways) · **1829/1829 unit**
(102 suites, +1 net) · build clean · **132/132 e2e** fresh CI=1
(3.1m on the re-run; the known settings-debounce focus flake on the
first run passed standalone AND on the full re-run — the documented
house-rule pattern, untouched by this session's delta; the mobile-nav
suite green inside the run). The closing census MATCH.

## Summary

**Session 93 delivered — the popover/menu family walked at TRUE 390:
the Filters popover a FULL MATCH (the space-y genus proven inert in
popover block flow), the account menu geometry matched with the
trigger-position genus decoded and documented as the direct
second-order effect of the deliberate mobile-nav superset. The one
material find — the fresh-clone typecheck breakage in the sweep tool
(the Next 16 ProcessEnv augmentation vs the widened-record cast, masked
at s92 by incremental build state) — fixed RED-first with the
non-vacuousness stash-re-proven, the gate fully green at 1829/1829 +
132/132, the drawer battery re-verified GREEN at TRUE 390, the
reference bundle stable for the 64th consecutive session, both
operator decisions standing (the 53rd re-affirmation).**

**Suggested next (session 94):** extend the sweep tool with a
`--width 390` phone-width page-sweep mode (the rotation method
productized), or walk the TABS family at 390 (the reports/settings
tab strips at phone width — the last unwalked interactive family),
or re-run the genus guard on the s93 delta.
