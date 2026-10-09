# Session 182 — the session-91 formal log (2026-10-10)

## Intake

The workspace was RESET at session start — a fresh `git clone` at
`17e34cd` (the s90 ship `3a89508` + the two operator-added log
commits `3060b04`/`17e34cd` — `session_180.md` the process narrative
+ `session_181.md` the operator-added raw conversation log). The
environment rebuilt: `bun install` (533 pkgs) → `.env` written
(`DATABASE_URL="file:../db/custom.db"` + a fresh AUTH_SECRET) →
`db:push` + `db:seed` → census MATCH 15/24/10/23/12 + 4 users.
Baseline gate: lint 0/0 · tsc 0 · 1788/1788 unit (99 suites, re-run
live).

Core docs re-absorbed: CLAUDE.md (full), AGENTS.md (head +
structure), the SKILL frontmatter + project_state + §16cd,
README/PAD anchors, session_179.md + session_180.md + session_181.md
+ the s90 plan + the worklog tail. Session 90 shipped at `3a89508`;
my task is **Session 91** — the full-app screenshot diff against the
reference (the strong sweep), the first-listed suggested next per
session_179.md.

Scandihaven re-verified as the tech-stack-patterns reference (fresh
clone @ `d4789c3`, up to date; the same family — no new patterns).

Drift sweep #87 CLEAN — the bundle re-fetched fresh post-login and
served byte-identical (md5 `a70a637f…` exact + the stylesheet 79,581
bytes — the 62nd consecutive stable session). Reference census #87:
demo data zero · desktop nav normal (256px/8) · the mobile-nav
defect STANDS at TRUE 390px (nav w=0, 0 visible links, no menu
button — the 12th consecutive census).

## The audits

Both audit subagents ran in parallel per the house pattern:

- **91-a** — the s90 re-audit: **13/13 GENUINE, zero material
  findings** (every s90 fix verified at exact file:line; the live
  re-runs 30/30 + 123/123 + the full 99/1788; the screenshots
  124/125/126 present). The **count-in-comment genus guard re-run**
  (the s90 suggested next): **5 drift nanos + 2 borderline** —
  G-91a1 (stat-value-contract:10-13 the header still claiming "BARE
  at every surface"), G-91a2 (reports-filter-parity:49-51 the
  retired s69/s70 "bare form" premise), G-91a3 (dead-code-hygiene:556
  the stale "live read set" parenthetical), G-91a4 (page-layout:1453
  the retired CHART_COLORS.gray citation), G-91a5 (PAD:776 the "8
  files" vs nine listed), B-1 (the "four surviving components"
  wording), B-2 (the constants -400 enumeration + the two-tone
  description).
- **91-b** — the graduation audit: **ZERO graduations, 13/13 (the
  48th consecutive)**; the 8 mechanical censuses **8/8 CLEAN**; both
  operator decisions' evidence INTACT.

The operator decisions re-affirmed (51st): the **CSV
formula-injection posture (b) STANDS** (the guard at csv.ts:31-33 +
entity-export.ts:24/:43; the full call-site census — ZERO unguarded
live-data builders; this session touches no CSV surface); the
**source-vocabulary documented parity STANDS** (no vocabularies
introduced; the constants.ts delta since s88 is 100% non-vocabulary).

## The rotation (91-c) — the full-app zero-data screenshot diff

Both apps driven to the ZERO-DATA state (the reference's own standing
state — its workspace has been empty for 12 censuses; our side via
the session-scoped `scripts/zero-data.ts`, the 7 domain tables
cleared INCLUDING opportunity — the first pass missed it and the
dashboard still computed $337.0k from the 12 seeded opportunities).
Nine pages captured per app at 1440×900, pairwise pixel diff +
cluster analysis + DOM probes on BOTH apps:

**accounts 0.00% · reports 0.00% · calendar 0.01% · activities
0.01%** (four pages byte-clean-to-noise) · contacts **0.51%** (the
empty-state DOM byte-identical — noise + the lucide superset) ·
dashboard **0.33%** (a 2px zero-area chart-baseline artifact,
library-internal) · settings **4.73%** (the picklist-DATA genus —
the reference's picklists wiped with its workspace, ours seeded; our
own "No items yet" empty form IS mirrored) · **profile 2.08%** ·
**leads 2.17%** — the two REAL finds, plus the bundle decode
surfacing the edit/import arms.

**The N-91 family (2 M + 2 L + the genus sweep + the 7 audit nanos)
— ALL ONE ROOT CAUSE: the v4 space-y semantics.** v3 = margin-TOP
on FOLLOWING siblings via `.space-y-N > :not([hidden]) ~
:not([hidden])` at (0,3,0) with a margin-bottom calc sidecar; v4 =
margin-BOTTOM on NON-LAST children inside `:where()` at ZERO
specificity — identical for plain block stacks, diverging exactly
when a non-last child is INLINE (every shadcn `<Label>` is
`display: inline`; vertical margins do not apply) or a non-first
child carries `mb-*` (v3 kills it, v4 keeps it):

- **M-91c1 — THE PROFILE FORM'S COLLAPSED GAPS ×4.** Ref 12px
  label→control gaps (the v3 input margin-top 8 + the 4px inline
  strut) vs ours 4px (the label's ignored margin-bottom); the whole
  form 32px shorter (472 vs 504px). The s14/s15 controlMt fix never
  reached the profile arm.
- **M-91c2 — THE LEADS TOOLBAR'S DEAD mb-4.** The reference's
  filters-row `mb-4` computes **0px** (the v3 space-y rule kills it
  at (0,3,0)); ours kept it alive → 16px extra → the toolbar 137 vs
  121px, the table 16px lower, the card 262 vs 246px.
- **L-91c3 — THE EDIT-DIALOG GROUPS.** The reference's wce/Mke/
  Edit-Lead groups are BARE unclassed divs (the DIALOG_BARE_GROUP
  form, never re-derived for the EDIT family); ours shipped
  space-y-2 computing 4px only through the v4 accident.
- **L-91c4 — THE IMPORT DIALOG'S SELECT FILE GROUP.** Ref 12px vs
  ours 4px.
- **N-91c5 — THE GENUS SWEEP.** All 99 space-y usages swept — the
  four finds are the complete set (the other toolbars carry no
  space-y; the create dialogs + settings carry controlMt; the
  rail/save-report labels are block; the checkbox stacks are block
  rows).

## The remediation (TDD)

The plan (docs/plans/2026-10-10-session91-parity-remediation.md)
validated against the codebase, then RED-first: the NEW
`tests/spacey-hazard-parity.test.ts` (13 its). **Non-vacuousness
PROVEN twice: 9 failed | 1792 passed (1801 total) — exactly the
modified pin set, ZERO collateral** (re-proven via the src stash
after the 5 mid-flight pin-shape repairs: the cn()/token forms ×2,
the needle-in-own-docs comment-strip, the comment-window width, the
foundation anchor).

GREEN: S91-P0 the `PROFILE_LAYOUT.controlMt` token (the FOURTH of
the s14/s15 family) + the 4 applications (the avatar row, Full Name,
Email, Role); S91-P1 the leads filters-row mb-4 retirement (the s11
computed-gap rule, the v3-kill comment); S91-P2 the edit-dialog BARE
groups; S91-P3 the import dialog's mt-2 dropzone wrapper; S91-P4
the 7 audit nanos; S91-P5 the suite + the re-derivations.

**FULL GREEN: lint 0/0 · tsc 0 · 1801/1801 unit (100 suites, +13
net) — ZERO collateral.**

## The gate + the LIVE battery

**GATE FULLY GREEN: lint 0/0 · tsc 0 · 1801/1801 unit (100 suites)
· build · 132/132 e2e fresh CI=1 (3.2m; the known settings-debounce
focus flake on the first run — untouched by this session's delta —
passed standalone AND on the full re-run; the mobile-nav suite green
inside the run).**

The LIVE battery on the fixed dev server: the profile label→input
gap **12px** (was 4px) + the form **504px** (was 472) — M-91c1
FIXED; the leads toolbar **121px** (was 137) + the filters row mb
**0px** (was 16px) + the table at **y496** (was 512) — M-91c2
FIXED; the Edit Contact dialog's groups **(BARE)** with the **4px**
strut gap — L-91c3 FIXED; the Import dialog's Select File gap
**12px** (was 4px) — L-91c4 FIXED. The drawer battery at TRUE 390px
(the trigger at 16,16; the open panel 288px at x0 computing the
sidebar blue rgb(37,99,235); 8 links; focus inside; the dual lock;
navigate-close + released; the closed root inert + visibility:hidden
+ pointer-events:none). **THE ZERO-DATA RE-DIFF: leads 2.17% →
0.00% + profile 2.08% → 0.00% — both pages BYTE-CLEAN against the
reference** (the four byte-clean pages standing; every remaining
diff fully explained). The closing census MATCH + the reference
md5-exact re-fetched (the 62nd consecutive stable session).

The screenshots — 127 (the profile Personal Information card, the
controlMt gaps), 128 (the leads table + the toolbar), 129 (the open
mobile drawer at 390). All three distinct. VLM: 127 = **5/5**;
128 = **5/5**; 129 = **5/5** — zero adjudications needed.

## The docs + the ship

Docs realigned via the assert-first scripts/skill_edits_s91.py (at
the sandbox root): SKILL v1.88.0 (§16ce + project_state + the H1),
README badge 1933 + the count prose + the suite list, AGENTS/CLAUDE
at 1801, PAD at 100/1801 (+ the s91 inventory row + the Total + the
footnote + the G-91a5 fix), session_182.md (this log), the plan's
execution record, the repo worklog.

**Session 91 delivered — the v4 space-y hazard family closed:** the
strong-sweep screenshot diff validated the 90-session parity program
(four pages byte-clean at the zero-data state, every other diff
explained), and its two real finds + the bundle-decoded siblings
all traced to ONE root cause — v4's space-y margin-bottom semantics
collapsing on INLINE labels and preserving v3-dead mb classes — now
fixed on all four surfaces with the computed geometry byte-matching
the reference (leads + profile both at 0.00% post-fix), 13/13
ledger zero graduations for the 48th consecutive session, both
operator decisions standing (the 51st re-affirmation), the reference
bundle stable for the 62nd consecutive session.

**Suggested next (session 92):** the remaining explained diffs are
all standing genus (the picklist data, the chart artifact, the
noise) — the screenshot-diff sweep is now a one-command regression
(scripts/zero-data.ts + the capture/diff scripts, worth promoting
into the repo as a tool); the next rotation could walk the
dialogs-at-390 family (the create/edit/import dialogs at phone
width — the screenshot diff covered 1440 only), or re-run the
count-in-comment genus guard on the s91 delta.
