# Session 185 — the session-92 formal log (2026-10-10)

## Intake

The workspace SURVIVED session 91 — the pull fast-forwarded
`f455ed7` → `f6c3012` (docs-only, `session_184.md` the operator-added
raw log; `session_183.md` the operator narrative was already in). The
environment verified intact without a rebuild: the `.env`
(`DATABASE_URL="file:../db/custom.db"` + AUTH_SECRET +
NEXT_PUBLIC_SITE_URL) · the census MATCH 15/24/10/23/12 + 4 users.
Baseline gate: lint 0/0 · tsc 0 · 1801/1801 unit (100 suites, re-run
live). The platform `DATABASE_URL` override hazard STANDS — all
session-92 repo operations ran under `env -u DATABASE_URL`.

Core docs re-absorbed: CLAUDE.md (full), AGENTS.md (head + the
space-y codification), the SKILL frontmatter + project_state
(v1.88.0), README/PAD anchors, session_182.md + session_183.md +
session_184.md + the s91 plan + the repo worklog tail. Session 91
shipped at `896bf2e` + `f455ed7`; my task is **Session 92** — the
three suggested nexts: (1) promote the sweep tooling into the repo,
(2) walk the dialogs-at-390 family, (3) re-run the genus guard on the
s91 delta.

Scandihaven re-verified as the tech-stack-patterns reference (fresh
pull @ `d4789c3`, up to date; the same family — no new patterns).

Drift sweep #88 CLEAN — the bundle re-fetched fresh post-login and
served byte-identical (md5 `a70a637f…` exact, 1,631,071 bytes + the
stylesheet 79,581 bytes — the 63rd consecutive stable session).
Reference census #88: demo data zero · desktop nav normal (256px/8) ·
the mobile-nav defect STANDS at TRUE 390px (nav w=0, 0 visible links,
no menu button — the 13th consecutive census).

## The audits

- **92-a** — the s91 re-audit: **8/8 checklist groups GENUINE, ZERO
  material findings** (every s91 fix verified at exact file:line; the
  spacey suite 13/13 live; the screenshots 127/128/129 byte-present;
  10 adjacent suites 391/391). The **count-in-comment genus guard
  re-run on the s91 delta**: **3 drifts + 2 borderline** — F-92a1 (the
  "all 99 space-y usages" census not re-derivable by any method),
  F-92a2 (a fresh miscount inside the G-91a1 fix — the leads arm
  listed in both the bare and explicit lists under a phantom label),
  F-92a3 (CLAUDE.md's two stale 1788 anchors), B-92a4 (the AGENTS
  §Session-91 history block lapsed), B-92a5 (the constants.test
  "G-91a2-class" label).
- **92-b** — the graduation audit (the 49th consecutive): **ZERO
  graduations, 13/13 ledger rationales hold**; the 8 mechanical
  censuses **8/8 CLEAN**; both operator decisions' evidence INTACT.

The operator decisions re-affirmed (52nd): the **CSV
formula-injection posture (b) STANDS** (the guard at csv.ts:32 + the
full 17-site call-site census — ZERO unguarded live-data builders;
this session touches no CSV surface); the **source-vocabulary
documented parity STANDS** (the constants diff 100% non-vocabulary;
no vocabularies introduced).

## The rotation (92-c) — the dialogs-at-390 family walk

Every dialog family opened at TRUE 390×844 on BOTH apps
(agent-browser, settle-waits, offsetHeight/rows/computed-margin
probes). The outer chrome SOLID on every family (the maxW 512/672
set, the max-h 759.6px + overflow:auto scroll family on the 2xl
dialogs, `sm:rounded-lg` → radius 0 at 390, p-6). The matches: New
Lead (676/592, groups 68×6), Log Activity (442/358, textarea rows=4),
Save Custom Report View (476 exact), Edit Lead (the BARE groups
immune), the settings selects (no `<form>` → no native select →
immune). **Four real finds — the N-92 family:**

- **M-92c1 — THE PHANTOM-MB SELECT-TRIGGER GENUS** (a NEW v4 space-y
  face). Radix renders a hidden native `<select>`
  (position:absolute, aria-hidden, **NO `hidden` attribute**) as the
  LAST TREE-CHILD of every Select group inside `<form>` contexts —
  so v4's `:where(.space-y-2 > :not(:last-child))` matches the
  TRIGGER (a non-last child!) and gives it margin-bottom: 8px, where
  v3's rule gave the trigger margin-TOP only (mb always 0 on the
  reference — live-probed). In plain block groups the phantom mb
  collapses out (invisible); **where the group is a DIRECT GRID ITEM
  (grid items establish a BFC — child margins are contained) the
  group inflates 68 → 76px** — the Account create dialog's Status
  group (the dialog 516 vs 508, the 4th row track 76px vs 68px) and
  the Contact create dialog's "How did you meet?" group. Proven by
  isolation (the display:block natural-height test returns 68 for
  every group at any width). The affected set: the 4
  `DIALOG_GROUP.controlMt` select triggers.
- **L-92c2 — THE CONTACT DIALOG'S FLATTENED SECTIONS.** The reference
  nests each section as `space-y-4 [H3, group, group]` (two 188px
  sections, live-probed); ours flattened the H3s into separate grid
  rows — the H3→field gap 24px (the grid gap-6) vs the reference's
  16px = +16px.
- **M-92c3 — THE EVENT DIALOG'S DESCRIPTION ROWS.** The reference's
  textarea is `rows=3` (90px); ours rendered `rows=2` (66px — the
  HTML default; the house's own comment at entity-dialogs.tsx:1167
  documented "the Event dialog's rows=3" but the prop never landed).
- **N-92c4 — THE IMPORT DIALOG'S COLUMNS-BOX p2 MARGIN.** The box
  carries `space-y-1`; the reference's `font-semibold mt-2` p2
  COMPUTES 4px (v3's rule at (0,3,0) overrides the (0,1,0) utility);
  ours computed 8px — the M-91c2 genus in the INVERSE direction.

## The remediation (TDD)

The plan (`docs/plans/2026-10-10-session92-parity-remediation.md`)
validated against the codebase, then RED-first: the NEW
`tests/dialog-geometry-parity.test.ts` (19 its) + the NEW
`tests/sweep-tool.test.ts` (8 its). **Non-vacuousness PROVEN: 23
failed | 1805 passed (1828 total) — exactly the modified pin set,
ZERO collateral** (re-proven via the tracked-files stash after the
mid-flight pin-shape repairs: the Event-region boundary, the `}>`
JSX-expression regex, the F-92a2 needle-in-own-docs reword, the
optional-comment group). The full-suite sweep surfaced **2 lockstep
re-anchors** (page-layout's DIALOG_GROUP pin + spacey's
controlMt-count regex → the mt-2 PREFIX form).

GREEN: S92-P0 the `DIALOG_GROUP.controlMt` "mt-2" → "mt-2 mb-0" (the
genus comment at the token); S92-P1 the contact sections nested (the
h3s INSIDE the pairGroups); S92-P2 the Event Description `rows={3}`;
S92-P3 the Import p2 `mt-1`; S92-P4 the five genus-guard nanos; S92-P5
the sweep tool (`scripts/sweep.ts` + the `bun run sweep` alias — the
one-command zero-data screenshot-diff regression: Playwright chromium,
the canvas getImageData pixel diff, the PURE `diffPixels` seam, ZERO
new dependencies); S92-P6 the docs.

**FULL GREEN: lint 0/0 · tsc 0 · 1828/1828 unit (102 suites, +27
net) — ZERO collateral.**

## The gate + the LIVE battery

**GATE FULLY GREEN: lint 0/0 · tsc 0 · 1828/1828 unit (102 suites) ·
build · 132/132 e2e fresh CI=1 (3.2m; the known settings-debounce
focus flake on the first run — untouched by this session's delta —
passed standalone AND on the full re-run; the mobile-nav suite green
inside the run).**

The LIVE battery on the fixed dev server: the Account dialog **508**
(was 516) + the rows **68px ×4** (was …76px) + the Status trigger mb
**0px** (was 8px) + formH **424** — M-92c1 FIXED; the Contact dialog's
sections **[197, 188, 188, 68]** = the reference's EXACT rows + the
H3→field gap **16px** (was 24) + the select group **68** (was 76) +
formH **817** (was 841) = the reference — L-92c2 + M-92c1 FIXED; the
Event dialog **646** (was 622) + the textarea **90px rows=3** (was
66/2) — M-92c3 FIXED; the Import dialog **544** (was 548) + the box
**118** (was 122) + p2 mt **4px** — N-92c4 FIXED. The drawer battery
at TRUE 390px (the trigger 16,16; the panel 288px at x0 computing the
sidebar blue rgb(37,99,235); 8 links; focus inside; the dual lock;
navigate-close → /Leads; the closed root inert + visibility:hidden +
pointer-events:none; the lock released).

**THE SWEEP TOOL'S MAIDEN RUNS (×2, reproducible)**: dashboard 0.35%
(the standing 2px chart artifact) · accounts/contacts/leads/reports/
profile **0.00%** (five byte-clean) · calendar/activities 0.01% ·
settings 4.73% (the standing picklist-data genus) — **every diff a
standing explained genus, ZERO new drift**, the seed restored + the
census MATCH after each run. The closing census MATCH + the reference
md5-exact re-fetched (the 63rd consecutive stable session).

The screenshots — 130 (the Account create dialog at 390, the fixed
Status row), 131 (the Contact create dialog, the nested sections), 132
(the Event create dialog, the rows=3 Description). All three distinct.
VLM: 130 = **5/5** (one adjudication — the "side margins" NO vs the
DOM-verified w=390@x=0, the VLM misreading the internal p-6 padding);
131 = **5/5** (the footer below the fold = the expected 760px
scroll-box geometry, identical on both apps); 132 = **5/5**.

## The docs + the ship

Docs realigned: SKILL v1.89.0 (§16cf + project_state + the H1, via
the assert-first scripts/skill_edits_s92.py at the sandbox root),
README badge 1960 + the count prose ×3 + the suite list + the Tested
row, AGENTS at 1828/132 + the §Session-91 block (B-92a4) + the
§Session-92 block, CLAUDE at 1828 ×4 (F-92a3), PAD (the s92 inventory
rows + the Total 102/1828 + the footnote), session_185.md (this log),
the plan's execution record, the repo worklog. The `.env.example`
verified unchanged (exactly 3 vars). The sitemap/robots/manifest
route handlers verified standing (the 92-b census).

**Session 92 delivered — the dialogs-at-390 family closed:** the walk
found four real divergences in the dialog interiors the page-level
sweeps could never see, three of them new faces of the v4 space-y
genus (the phantom-mb select-triggers — `:last-child` matches the
TREE, not the layout; the flattened sections; the v3-utility-kill
inverse), all four fixed with the computed geometry byte-matching the
reference at 390, the sweep tool promoted into the repo as a
one-command regression (its maiden runs proving five pages byte-clean
with zero new drift), the genus guard's five findings closed, 13/13
ledger zero graduations for the 49th consecutive session, both
operator decisions standing (the 52nd re-affirmation), the reference
bundle stable for the 63rd consecutive session.

**Suggested next (session 93):** the dialogs walk covered 390 + the
1440 chrome is byte-pinned by the sweep — the next rotation could walk
the POPOVER/MENU family at 390 (the leads Filters popover, the ⋮
action menus, the topbar account menu — the same live-vs-live
method), or extend the sweep tool with a `--pages` filter +
`--width 390` mode for a phone-width page sweep, or re-run the genus
guard on the s92 delta.
