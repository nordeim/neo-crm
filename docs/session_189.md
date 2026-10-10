# Session 189 — the session-94 formal log (2026-10-10)

## Intake

The workspace SURVIVED s93 — `git pull` fast-forwarded `7b43516` →
`86872b8` (docs-only: `docs/session_188.md`, the operator-added s93
process narrative). Environment verified intact without a rebuild:
`.env` at `DATABASE_URL="file:../db/custom.db"` · `db/custom.db` +
`db/e2e.db` at the repo root · the census MATCH 15/24/10/23/12 + 4
users. The platform `DATABASE_URL` override hazard STANDS — all
session-94 repo operations ran under `env -u DATABASE_URL`.

Core docs absorbed: CLAUDE.md (full), AGENTS.md (head + the session
history), the SKILL frontmatter + project_state (v1.90.0),
`docs/session_187.md` + `docs/session_188.md` (the operator
narrative) + the s93 plan + the worklog tail. Session 93 shipped at
`7b43516`; my task is **Session 94** — the suggested nexts: (1) the
sweep tool `--width 390` phone mode, (2) the TABS family at 390 (the
last unwalked interactive family), (3) the genus guard re-run — plus
the operator's standing instructions (audit, the two decisions, the
parity iteration, the mobile-nav verification, the SEO/sitemap check,
screenshots, docs, the SSH-wrapper push to `main`).

## Baseline

lint 0/0 · tsc 0 (the s93 fresh-clone fix holds at HEAD) ·
1829/1829 unit (102 suites) · build + e2e deferred to the post-fix
gate (the one-gate discipline).

## The standing layers (90th sweep, NO APP DRIFT)

Drift sweep #90: the reference bundle md5 `a70a637f…` EXACT — the
**65th consecutive stable session**. Census #90: demo data zero ·
desktop nav normal (256px/8 links) · the mobile-nav defect STANDS at
TRUE 390×844 (nav w=0, 0 visible links, no menu button).

## The audits

- **94-a (subagent)**: the s93 delta 4/4 GENUINE-OK (the cast
  retirement + genus comment + pins re-verified live: tsc 0, the
  sweep-tool suite 9/9, the dialog suite 19/19). The
  count-in-comment genus guard found the **F-94a1–a8 stale-count
  family** — the mobile-nav "7-check" quartet (the actual suite is 9
  checks), the PAD §3.2 tree freeze (77/1257/112 vs the actual
  102/1829/132), the PAD gate-checklist 1191/112 pair, the db-path
  "16 checks" (actual 20), the §11 Lines-column drift ×14 rows —
  plus **N-94a1** (the SKILL "16Session-93" §-mangling). All
  docs-only; all fixed this session.
- **94-b (subagent)**: the graduation audit **13/13 GENUINE — zero
  graduations** (the ~50th consecutive session); the CSV guard
  census (17 sites, ZERO unguarded live-data builders); the
  source-vocabulary diff EMPTY since s90; the vitest/playwright
  config layer + the SEO/sitemap layer verified standing (the
  47/47 pin re-run across the four targeted suites).

## The operator decisions (54th re-affirmation)

Both STAND, evidence re-verified live: **CSV posture (b)**
(guardFormulaPrefix + qq, the builder census above, the (b)-vs-(c)
line unchanged) and **source-vocabulary parity** (raw storage, no
vocabulary introduced).

## The rotation (94-c) — the tabs family at TRUE 390

The last unwalked interactive family, on BOTH apps:

- **The reports PILL strip: FULL GEOMETRY MATCH** — track 358×82 @
  (16,1333) on both; the 2-col reflow (174px cols), 5 tabs in 3
  rows of 24px, zero gaps, no overflow; the whole page above at
  identical heights (y=1333 exact).
- **The settings SEGMENTED strip: FULL MATCH including the defect** —
  3 fractional cols, track 358×36 @ (16,197); "CRM Configuration"
  overflows its 117px trigger on BOTH apps (the reference's own
  clipping, mirrored; VLM-adjudicated visually benign).
- **The activities SEGMENTED strip: FULL MATCH** — track 326×36 @
  (32,1057), 4 cols of 79.5px; the only delta is DATA (our seeded
  Overdue-3 badge, the reference's own construction).

**The probe-trap lesson**: my first drawer-battery pass read
bodyLock="" + focusInside=false — decoded as PROBE traps, not app
defects: a loose `aria-label*=menu` selector hits the drawer's
hidden CLOSE button first (DOM order), and `visibility:hidden`
preserves geometry + offsetParent (a programmatic `.click()` also
bypasses inert). The corrected battery (exact selectors, the panel
not the root): trigger (16,16) 36×36 · panel 288px @ x0 computing
rgb(37,99,235) · 8 links · focus inside · dual body+main lock ·
navigate-close → /Leads · closed root inert + hidden + pe-none ·
Escape-close — **FULLY GREEN**.

## The remediation (TDD — RED first)

- **RED**: the 3 new sweep-tool pins (the flag parsing + the
  parameterized viewport, the viewport-tagged shots dir, the
  width-agnostic content-wait) — 3 failed | 9 passed against the
  pre-fix source; one mid-flight pin-shape repair (the prettier-wrap
  class).
- **Non-vacuousness stash-re-proven**: stash the sweep.ts fix → 3
  failed | 9 passed → pop → 12/12.
- **GREEN (S94-P0)**: the phone-width mode — `bun run sweep --
  --width 390 --height 844`. The MAIDEN run: 8 pages at the ~0.5%
  mobile-nav-superset topbar floor (≈1600 displaced px ≈ 0.49% of
  the 390×844 frame) + settings 7.34% (the picklist genus, larger
  share of the narrower frame) — **ZERO new drift**; both standing
  tables documented in the tool header.
- **S94-P1**: the docs nanos (F-94a1–a8 + N-94a1) — all fixed
  docs-only.
- **S94-P2**: screenshots 136 (drawer OPEN at TRUE 390, re-captured
  post-decode) + 137 (reports pill tabs) + 138 (settings segmented
  tabs) — VLM 5/5 × 3 (one adjudication: 138's clipped-label NO vs
  the DOM-verified shared overflow genus).
- **S94-P3**: the docs — this log + the plan + its execution record
  + the worklog + the count realignment (README badge 1964 + the
  Tested row, AGENTS 1832 + the §Session-94 block, CLAUDE 1832 ×4,
  PAD the s94 row + the Total, SKILL v1.91.0) + the CLAUDE-count
  lockstep pin re-anchor (1829 → 1832).

## The gate

lint 0/0 · tsc 0 · **1832/1832 unit** (102 suites, +3 net) · build
clean · **132/132 e2e** fresh CI=1 (3.2m, zero flakes — one
environmental chromium crash at the first setup, clean after the
stray-browser cleanup; the mobile-nav suite green inside the run).
The closing census MATCH.

## Summary

**Session 94 delivered — the tabs family walked at TRUE 390: FULL
PARITY on all three strips (the reports pill reflow, the settings
clipped-label genus mirrored, the activities data-only delta),
closing the interactive-surface walk program (dialogs s92 →
popovers/menus s93 → tabs s94). The sweep tool's phone-width mode
productized the rotation method (the maiden 390 run showing zero new
drift), the drawer battery re-verified FULLY GREEN after decoding
the probe trap, the audits clean (13/13 graduations zero, the s93
delta 4/4, only docs-count nanos — all fixed), the gate green at
1832/1832 + 132/132, the reference bundle stable for the 65th
consecutive session, both operator decisions standing (54th).**

**Suggested next (session 95):** run the phone sweep on a cadence
(`--width 390 --height 844` before each ship — the standing tables
now live in the tool header), or walk the TABLE-family at 390 (the
sticky-thead + row-height geometry at phone width), or extend the
sweep with a `--pages` filter for targeted rotation runs.
