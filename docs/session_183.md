# Session 183 — the session-91 process narrative (2026-10-10)

The workspace had been RESET — a fresh clone at `17e34cd` (the s90
ship + the two operator-added log commits). The environment rebuilt
end-to-end: install, `.env` with the repo-root db path, schema push,
seed, census MATCH. Baseline gate: lint 0/0 · tsc 0 · 1788/1788
unit (99 suites). Core docs re-absorbed (CLAUDE/AGENTS/SKILL/README/
PAD + session_179/180/181 + the s90 plan + the worklog); my task is
**Session 91** — the full-app screenshot diff against the reference,
the first-listed suggested next.

Drift sweep #87 CLEAN — the bundle md5-exact (the 62nd consecutive
stable session). Reference census #87: demo zero · desktop normal ·
the mobile-nav defect STANDS at TRUE 390px (the 12th census; no
hamburger — only content-area icon buttons). Scandihaven re-verified
(same family, no new patterns).

Both audits back — 91-a: the s90 re-audit **13/13 GENUINE** + the
count-in-comment genus guard re-run finding **5 nanos + 2
borderline** (stale headers, a retired-token citation, an 8-vs-9
miscount); 91-b: **zero graduations 13/13** (the 48th consecutive),
8/8 censuses clean, both operator decisions' evidence INTACT (the
51st re-affirmation — CSV posture **(b)** + the source-vocabulary
parity).

Now the 91-c rotation — the strong sweep. The key insight: the
reference's workspace has been EMPTY for 12 censuses, so a true
apples-to-apples diff means driving OUR app to the same zero-data
state (a session-scoped `zero-data.ts` clearing the 7 domain tables
— the first pass missed `opportunity` and the dashboard still read
$337.0k from the 12 seeded opportunities; the second pass zeroed
it). Nine pages per app at 1440×900, pairwise pixel diff + cluster
analysis + DOM probes on both apps.

The results VALIDATED the whole 90-session parity program:
**accounts 0.00% · reports 0.00% · calendar 0.01% · activities
0.01%** — four pages byte-clean; contacts 0.51% (the empty-state DOM
byte-identical); dashboard 0.33% (a 2px zero-area chart artifact);
settings 4.73% (the picklist-DATA genus — the reference's picklists
wiped with its workspace, ours seeded). And TWO pages with real
finds — **profile 2.08% + leads 2.17%** — which, with the bundle
decode, traced ALL to one root cause: **the v4 space-y semantics**.
v3 puts margin-TOP on following siblings at specificity (0,3,0); v4
puts margin-BOTTOM on non-last children inside `:where()` at zero
specificity. Identical for plain block stacks — diverging exactly
when a non-last child is INLINE (every shadcn `<Label>`; vertical
margins don't apply to inline boxes) or a non-first child carries
`mb-*` (v3's rule kills it; v4's `:where` preserves it).

The finds: **M-91c1** the profile form's four `space-y-2` groups
collapsed to 4px label→control gaps where the reference computes
12px (the whole form 32px shorter — the s14/s15 controlMt fix never
reached the profile arm); **M-91c2** the leads filters row's `mb-4`
— DEAD on the reference (v3's space-y rule kills it at (0,3,0)) but
alive on ours, pushing the whole table 16px down; **L-91c3** the
edit dialogs' groups — the reference ships BARE unclassed divs, ours
`space-y-2` computing the same 4px only through the v4 accident;
**L-91c4** the import dialog's Select File group (ref 12px vs ours
4px). Plus the N-91c5 genus sweep (all 99 space-y usages — the four
finds are the complete set) and the 7 audit nanos.

RED: the new 13-it suite, **9 failed | 1792 passed (1801 total)** —
exactly the modified pin set, ZERO collateral, re-proven via the src
stash after the 5 pin-shape repairs. GREEN: the
`PROFILE_LAYOUT.controlMt` token (the fourth of the s14/s15 family)
on the avatar row + the three inputs; the mb-4 retirement (the s11
computed-gap rule); the edit dialogs' bare groups; the import
dialog's mt-2; the 7 nanos.

**FULL GREEN: 100 suites, 1801/1801 — +13 net, ZERO collateral.**
Lint + tsc clean. Build clean, then the e2e gate on a fresh CI=1
boot: the known settings-debounce focus flake on the first run
(untouched by this session's delta) — passed standalone AND on the
full re-run: **GATE FULLY GREEN: lint 0/0 · tsc 0 · 1801/1801 ·
build · 132/132 e2e.**

The LIVE battery: the profile gap **12px** + the form **504px** (was
4px/472); the leads toolbar **121px** + row mb **0px** + the table at
**y496** (was 137/16/y512); the Edit Contact groups **(BARE)** at
4px; the import gap **12px**; the drawer battery at TRUE 390px
(full-bleed panel at x0, the sidebar blue, 8 links, focus inside,
dual lock, navigate-close, the closed root inert + hidden). Then the
zero-data re-diff — the strongest verification: **leads 2.17% →
0.00% + profile 2.08% → 0.00% — both pages BYTE-CLEAN against the
reference.** The closing census MATCH + the reference md5-exact
re-fetched.

The screenshots — 127 (the profile card, the controlMt gaps), 128
(the leads table + toolbar), 129 (the open drawer at 390). VLM: all
three **5/5** — zero adjudications.

The docs realignment via the assert-first script: SKILL v1.88.0
(§16ce + project_state + the H1), README badge 1933 + the suite list,
AGENTS/CLAUDE/PAD at 1801+132 (the PAD s91 row + the Total 100/1801),
session_182.md + the plan's execution record + the repo worklog.
Final verification: lint 0/0 + 1801/1801 after the doc edits.

Commit `896bf2e` on main. The push via the SSH wrapper — the operator
key deployed, the fingerprint verified
(SHA256:3ddaNlFhMz1JXiGEDgVEaRsUzI4Ev0IpGEEB7NnU4PU), the dry-run
green (the `--remote` flag per the CLAUDE.md contract), then the real
push:

**PUSHED: main @ `896bf2e` == local HEAD, remote verified.** The
operator key shredded.

**Session 91 delivered and shipped to `main` @ `896bf2e`** — the
complete chain executed end-to-end:

- **Intake**: the workspace rebuilt from a fresh clone; the baseline
  gate green (1788/1788); drift sweep #87 clean (the 62nd consecutive
  stable bundle); the reference's mobile-nav defect standing (12th
  census)
- **Audits**: 91-a the s90 re-audit **13/13 GENUINE** + the genus
  guard re-run (5 nanos + 2 borderline, all fixed); 91-b **zero
  graduations 13/13** (the 48th consecutive); both operator decisions
  re-affirmed (51st)
- **The rotation**: the full-app ZERO-DATA screenshot diff — four
  pages byte-clean, every other diff explained, and the N-91 family
  (2 M + 2 L + the genus sweep + 7 nanos) all traced to ONE root
  cause: v4's space-y margin-bottom semantics collapsing on inline
  labels and preserving v3-dead mb classes
- **Gate**: lint 0/0 · tsc 0 · **1801/1801 unit (100 suites, +13)** ·
  build · **132/132 e2e**; LIVE-verified on both apps; the re-diff
  **leads + profile both 0.00% BYTE-CLEAN**; screenshots 127–129 (VLM
  5/5 × 3); docs at SKILL v1.88.0/README 1933; pushed via the SSH
  wrapper, key shredded

**Suggested next (session 92):** the remaining diffs are all standing
genus — the screenshot-diff sweep is now a reproducible regression
(zero-data.ts is committed; the capture/diff scripts could be
promoted into the repo); the next rotation could walk the
dialogs-at-390 family (the create/edit/import dialogs at phone width
— the sweep covered 1440 only), or re-run the count-in-comment genus
guard on the s91 delta. Want me to proceed?
