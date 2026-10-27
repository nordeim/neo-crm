# Session 402 — THE REPORTS SAVE-CUSTOM-VIEW DIALOG OPEN FACES (walk63) (the session-190 round record)

Date: 2026-10-27 · Rotation: 190 · Agent: main (Z.ai) ·
Plan: `docs/plans/2026-10-27-session190-savedreports-dialog-focus-open-walk.md`

## The round

The post-189 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`b8ea9f3` — the session_400/401 transcripts, the s189 round's
own execution record). The s400 close's named next-rotation candidates,
adjudicated by the discovery probe (`scripts/discover-190.ts` + the two
micro-probes): the reports SAVE-CUSTOM-VIEW dialog **LIVE on BOTH apps,
rich arms** (the s25-era construction: the "Saved Reports (N)" outline
button → the wide Radix dialog → the localStorage `crm_saved_reports`
seam, the L-74c8 state contract, the F-123a4 BLACK-pair Save — the
trigger byte-equal at `1216,113 192x36`, the OPEN dialog byte-equal at
`384,240 672x420` radius 8, the name input's placeholder + COMPUTED
font byte-equal [the `md:text-sm` a class-order genus — the reference
appends it at the chain's end, decoded live], the 6-column checkbox
grid vocabulary identical with the checkbox faces computed-EQUAL [the
`border-neutral-900` vs `border-primary` token-selection genus,
decoded], the Current-Filters summary + the footer identical, the save
round-trip + the post-save reopen identical); the dashboard
FOLLOW-UP-ROWS checkbox arms **KILLED** (the reference's zero-data
state persists — 0 checkboxes on the Lead Sources card [the empty
container, the S9-10 contract] + the "No upcoming activities"
empty-state paragraph; the rows ride DATA rows that do not exist on
the reference — the same doctrine as the s189 Insights kill); the
activities COMPLETED-TAB row-action buttons **KILLED** (the reference's
empty panel at the zero-data state); the topbar-search gate **KILLED
again** (`populated=0` on both — the s32 dead-stub doctrine stands);
the probe STABLE at `46bc2d9c` kills the fresh-bundle candidate; the
registry's `latest` 3.10.1 (verified live) kills the recharts 4.0 gate.

## The audit (the baseline + the operator's standing asks)

The baseline gate GREEN at the exact s189 ship state on a FRESH CLONE:
lint 0/0 · tsc 0 · **138/2781** · build (the type-gate artifact) ·
smoke **14/14** · e2e **192/192** (clean first run, 5.7m) · probe:ref
STABLE · db census MATCH (15/24/10/23/12 + 4 users at
`<repo>/db/custom.db`, the ambient `DATABASE_URL` shadow scrubbed with
`env -u` on every DB-touching command — the F-123a1 doctrine) ·
sitemap 11 routes + robots + manifest 200 (smoke check 12).

The operator's round-shaped asks, all verified STANDING: the `.env`
`DATABASE_URL="file:../db/custom.db"` with the `db/` folder at the
repo root (the fresh intake) · the vitest + playwright config files
(138/2786 unit + the 192-check e2e battery re-verified this session) ·
the sitemap + SEO surface (the 11-route `/sitemap.xml` + `/robots.txt`
with its Sitemap line + the installable `/manifest.json`, all
re-verified 200) · the mobile-nav comparison (probe:ref TRUE-390
census STANDING — the reference's own menu button live; OURS the
Radix Sheet superset) · **the Tailwind v4 state — the walk63 decode
CLEAN on every arm** (every delta root-caused against the standing
genus register; the v3-semantics lineage [s11/s96/s98/s123/M-92c1/
D-187a3] re-checked at the dialog's arms — all byte-equal) · the
`.env.example` verified against the six-knob contract and included in
the round's commit.

## The round proper — THE WALK (walk63)

The walk (`scripts/walk63-savedreports-dialog-focus-open.ts`, the
walk53-62 ledger form over the LIVE arm at BOTH axes): Phase A the
OPEN dialog census at the desktop axis 1440×900 — the trigger's
resting face + the click-open ride + the root geometry ledger + the
DFS ledger + the title + the name input's FULL chain + computed face +
the 6-column checkbox grid + the Current-Filters summary box + the
footer trio (Cancel/Save/Close) + the close X + the mount-focus census
(the name input, on BOTH); Phase B the REAL keyboard Tab drive through
the OPEN dialog — the chain **STRUCTURALLY IDENTICAL (10 stops: the
mount input → 6 checkboxes → Cancel → Close → the input wrap; the Save
NEVER in the fresh-open chain — disabled buttons are not focusable;
the post-type drive captures its REAL face)** + the REAL :focus-visible
faces byte-equal on the VISIBLE layers (the 1px near-black ring); the
interactive arms — the type-flip + the SAVE round-trip (the localStorage
seam, the browser context discarding it; the trigger flips
`Saved Reports (0)` → `(1)` on both) + the post-save REOPEN (the
L-74c8 name-clear byte-equal) + the saved-list arm (the p-3 bg-gray-50
rows + the Load outline-sm + the bookmark glyph; the name + the locale
date identical) + the cancel-then-reopen decode (the L-74c7 keep —
"Keep Me" survives a cancel on both) + the checkbox-toggle ride (the
unchecked faces identical); Phase D the phone axis 390×844 — the root
`0,184 390x476` + the input `25,287 340x36` at 16px/400 (the s9
below-md doctrine) + the checkbox[0] + the footer byte-equal. The walk
re-run STABLE (the delta report byte-identical).

## The live finds — TWO cured

**D-190a1 THE SIX COLUMN CHECKBOXES' LITERAL ID/FOR CONSTRUCTION**: the
reference's checkboxes carry the literal REPORT_COLUMNS keys as ids
(`id="name"` … `id="wonDate"`, `for="name"` … `for="wonDate"` —
live-walked on its DOM); ours shipped React useId ids. The
D-114a2/D-187a1 ids-are-construction-parity doctrine. THE CURE:
`id={col.key}` at the call site (the component's `id ?? generated`
seam carrying it to the htmlFor); the re-walk PROVES the id/for ledger
deltas GONE, byte-equal both apps.

**D-190a2 THE README TESTED ROW'S DUPLICATED WALK62 CLAUSE**: the s189
first-pass residue — the round appended its clause TWICE (once inside
the s29 leads-layer parenthetical + once after it, the second copy
leaving an UNBALANCED double close `kept)),`) and shipped undetected
at `3739c96`/`b8ea9f3` — no assertion read the row's clause
multiplicity (the D-188a1 genus on a new axis: a docs defect shipped
by a prior round's own lockstep edit). Caught by this round's docs
lockstep. THE CURE: the s29 paren restored + the single standalone
clause + the balanced parens + the D-190a2 CURE PIN in docs-counts
(the clause-unique doctrine, RED-first: exactly 1 RED at birth → the
cure → GREEN).

Every remaining delta a documented genus (the box-shadow SLOT-COUNT
with every VISIBLE layer byte-equal · the outline VERSION FORM + both
sub-forms + the COLOR-CARRIER sub-form [zero visible pixels on both]
· the s129 ring-offset white zero-extent slot · the token-selection
M-81c2 pairs [border-line/bg-surface/text-ink/muted-ink/line-soft/
neutral-900 vs border-input/bg-background/muted-foreground/accent/
primary — computed-equal on every face] · the class-order genus [the
md:text-sm mt-1 append position] · the React useId format · the
DANGLING aria-describedby genus [walk54: the reference's own dead
pointer, not mirrored] · our aria-hidden svg superset [kept]).

## The TDD ledger

The pin survey first (the s25 saved-reports content regexes + the s68
wide wiring + the s74 state contracts + the s83 Load outline-sm + the
s123 BLACK-pair + the s10 INPUT_BASE/CHECKBOX.control/BUTTON_BASE pins
· the walk53-62 decode freezes), then the battery: 3 born-green pins in
the page-layout suite (the walk63 decode freeze · the Saved-Reports
TRIGGER call-site construction freeze — the genuine battery gap: the
s25 pins hold the wiring regex, never the trigger's own chain · the
Save-Report-Dialog open-interior construction freeze — the genuine gap:
the content words as regexes, never the call-site chains) + THE
D-190a1 CURE PIN (RED-first: exactly 1 RED at birth → the cure →
GREEN) + THE D-190a2 CURE PIN in docs-counts (RED-first: exactly 1 RED
at birth → the cure → GREEN).

**MUTATION-PROOF**: the `id={col.key}` regression replanted → exactly
1 RED → restored → GREEN, no residual. **STASH-PROOF**: the round's
page-layout block stashed → exactly **138/2781** (the s189 ship state)
→ restored → 138/2785 — the D-190a2 pin's +1 caught at the full-suite
count lands the TRUE total **138/2786** (the s187/s188 undercount
lesson repeating, as the worklog predicted).

**The count ladder**: 2781 → **2786** (+5 — 4 walk63 pins + the NEW
D-190a2 pin; the first pass carried +4/2785 before the pin's +1 was
caught at the full-suite count; the corrected count-ladder-190.py
accepts both intermediate forms — the re-run a verified 0-flip no-op)
· SUITES 138 HELD · E2E 192 re-verified (the round's product-code
touch: save-report-dialog.tsx +8 lines [the D-190a1 cure + its
comment] — the MODULE line count 1718 HELD, page-layout.ts untouched)
· badge 2973 → **2978** (the unit+e2e arithmetic: 2786+192) +
skill-head-190.py (the SKILL **v1.187.0**, the s189 layer demoted at
its ship counts 2781/192, the s190 layer live, idempotent — the head
surgery ran BEFORE the ladder, the retired s189 ship line PINNED by
the generalized D-188a1 doctrine's next member in docs-counts).

## The verification ledger

lint 0/0 · tsc 0 · **138/2786** unit · build (the type-gate artifact)
· smoke **14/14** · e2e **192/192** · db census MATCH · probe:ref
STABLE (`46bc2d9c`) · the walk63 Save-Custom-View dialog arm byte-equal
on both axes (post-cure) · the REAL Tab chains structurally identical
(10 stops both) · the save/reopen round-trips identical · the
captures: the round's ours+ref faces.

## Suggested next steps

Verify the commit on GitHub. The next-rotation candidates: the
remaining unwalked interiors at the reference's zero-data state (the
**topbar search's dropdown arm** the day the reference's own
suggestions populate · the **Insights + Edit-family dialogs** the day
the reference carries rows again — the discover-190 census is the
standing re-check, one probe leg · the **dashboard follow-up-rows
checkbox arms + the activities Completed-tab row actions** — the
data-dependent candidates stay suspended under the same doctrine
until then) · the standing conditional gates (the fresh-bundle
re-derivation the day probe:ref trips · the recharts 4.0 gate when 4.0
ships).
