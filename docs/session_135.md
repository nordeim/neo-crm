Session 71 — the permanently-mounted dialog-family session
(docs/session_133.md, the s70 record; the operator's brief = the
standing cycle + this session's explicit instructions: refresh the
workspace from the remote, review the five core docs + the four
session records [session_133.md, the session70 plan, worklog.md,
session_134.md], validate against the codebase, audit with the repo
skills, proceed on the two operator decisions, iterate for parity
with the reference, mind the mobile navigation + the Tailwind v4
hazard class, keep DATABASE_URL at file:../db/custom.db with db/ at
the repo root, verify the vitest + playwright suites, plan + execute
RED-first, capture screenshots, keep .env.example aligned, realign
the docs, ship to main via the SSH wrapper).
Workspace: the sandbox was RESET (a fresh clone of main @ 098ce51 —
the s70 ship 8643b1a + the session-log update; the environment
rebuilt: bun install, .env from .env.example with a generated
AUTH_SECRET, db:push + db:seed). The census reads
file:/home/z/my-project/neo-crm/db/custom.db + 15/24/10/23/12 +
4 users + pristine: MATCH — db/ at the repo root, as the operator's
brief requires (the documented intake hazard in this sandbox's
shape: the stale platform DATABASE_URL override points at a
NON-EXISTENT mirror, all session-71 repo operations ran under
`env -u DATABASE_URL`, the e2e suite immune via its own pinned
E2E_DATABASE_URL). Intake hygiene: NO zombie servers; ports 3000/
3100 clear. Baseline gate GREEN: lint 0/0 (enforced) · tsc 0 ·
1287/1287 unit (79 suites) — the documented state exact; the skills/
exclusion verified in all three configs (vitest include allowlist,
eslint ignores, tsconfig exclude — the folder excluded from code
checking, testing and compilation per the brief).

The standing drift re-sweep (67th session): the reference bundle
fresh-fetched (the Vite chunk assets/index-DZ-xbrIm.js, direct curl
with a browser UA) — byte-identical (size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` exact — the 42nd consecutive
stable session). The reference census (67th, agent-browser, live
login at 1280 then a TRUE 390px viewport): the demo data still zero
(the KPI values 0/$0.0k/$0.0k/$0k/0%/0); the mobile-nav defect
STANDS at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible,
scrollW 390, NO hamburger — the visible-button census lists only the
user-menu/Add/Export cluster); desktop nav normal (256px, 8 links,
all visible).

The three parallel audit agents (71-a/71-b/71-c) + every finding
manually validated at file:line by the orchestrator (the
parity-bearing claims additionally BUNDLE-DECODED against the
fresh-fetched reference). **71-a** — the s70 re-audit: **10/10
checklist items GENUINE** (every S70-P1..P9 fix at file:line, the
counts corroborated LIVE [1287/1287 in 79 suites, 117 e2e blocks,
tsc 0], the commit honest [24 files, +1041/−49, zero strays]). NEW:
**N-71x (Nano, record precision)** crm-store.ts:8 — "the eight
raw-fetch exceptions" — the site enumeration totals NINE call-sites
(topbar 1, login-card ×4, multipart ×2, blob 1, PATCH 1); "eight"
holds only under the distinct-endpoint reading (71-b corroborated
the same note). **71-b** — the graduation audit: **ZERO graduations
— 13/13 CONFIRMED (28th consecutive session)**, the 8 mechanical
censuses ALL CLEAN (localStorage exactly 2 live keys; public/
og-image.png only; API 27 routes/39 handlers all consumed; env
parity 3-var; doc anchors at 1287+117 exact, badge 1404; zero
commented-out code; exactly 2 annotated e2e sleeps; TODO/FIXME 0,
.skip/.only 0, console.log 0 with the 4 documented exceptions,
`new PrismaClient` exactly 2). **71-c** — the fresh-eyes ROTATION on
the entity-dialogs family (entity-dialogs.tsx 1081 +
entity-edit-dialog.tsx 254 + dialog.tsx + account-insights-dialog +
contact-detail-panel + save-report-dialog + the consumers; never a
dedicated rotation target — session_134's own suggested target):
**the seam SOLID** (the envelope discipline, React 19 discipline,
the s29/s45/s64 store guards, the pinned chrome/toast/payload
families all intact — zero findings contradict an existing pin).
The **N-71 family** (as validated + decoded): **M-71a1 (Medium,
behavioral)** entity-dialogs.tsx:951 — the ActivityForm create key
rode a RENDER-TIME `Date.now()` (every parent re-render while the
dialog was open re-keyed the form and WIPED the typed input; the
EventDialog sibling's `defaultStart?.getTime()` is state-derived
but shares the class); **M-71a2 (Medium, parity,
bundle-decoded)** the three EntityEditDialog mounts keyed the OUTER
component — the key flipped to "none" in the same batched close
render `open` went false, unmounting the Radix Root instantly — the
pinned exit chrome NEVER played (the reference mounts W7/wce/Mke
with NO key, permanently); **I-71a4 (Info, parity, folded into the
M-71a2 fix)** the five create dialogs' `{open && <XForm/>}`
conditionals emptied the body during the exit (the reference's
create forms render unconditionally — its own prop-sync rides
setState-in-effect, an ERROR under our lint); **L-71b1 (Low,
bundle-decoded)** isLoading never wired at the three edit call
sites (the reference ships `disabled:i` + "Saving..." — the N-46e
posture, 25 sessions); **N-71c2 (Nano, bundle-decoded)** the Event
status SelectItems carried BOTH className="capitalize" AND the
manual uppercase (the reference ships plain literal labels);
**L-71d4/L-71d5/N-71d1/N-71d3 (the hygiene quartet)** the invented
hideClose prop (zero consumers, not stock shadcn), ContactForm's
dead settings destructure, the slide-over's dead `??` on
charAt(0), the zero-consumer DIALOG_FIELDS_WRAPPER.contact/.account
records. **DISMISSED at validation (the audit trail)**: L-2 the
save-report footer (our DialogFooter constant already renders the
full stock string — the bundle confirms the reference's save-report
dialog uses exactly that narrow footer); I-2 the saved-view columns
on Load (the bundle's `_ = (A, O) => { if (O) t(A.filters) }` —
the reference applies ONLY the filters; our documented parity
exact); I-3 the account-create phone type (the bundle ships NO
type attribute — plain text, matching ours); L-3 the slide-over
a11y (the reference's Pke is a plain fixed div — no role, no aria,
no focus trap, X-only close); N-4 the tab persistence (Pke stays
mounted, `if (!e) return null` — the reference's tab state persists
across entity switches too). The rotation's coverage catalog: the
LIVE-only holes — the ENTIRE ActivityDialog (zero e2e), the
dashboard quick-create family, the exit animations, the
double-submit guards — the two new e2e checks below close the two
largest.

The operator decisions: the **CSV formula-injection posture (b)
STANDS** (30th re-affirmation — the guard intact in both export
families [guardFormulaPrefix at csv.ts:31-33 applied in escapeCell
AND imported into entity-export.ts, the 71-b re-verification], the
`-` exclusion documented + pinned, the reference bundle byte-stable
for the 42nd consecutive session; the 71-c rotation touched NO CSV
surface — no new evidence moves the (a) parity / (c) full-OWASP
alternatives); the **source-vocabulary documented parity STANDS AND
EXTENDS to the N-71 family** (the 71-b census re-confirmed the
anchors at file:line; the session-71 fixes touch NO vocabulary
surface — the fixes are mount-mechanics, a loading-state wiring, a
class-string retirement, dead-prop/destructure/`??` retirements, a
comment precision carrier, and e2e additions).

The plan (docs/plans/2026-10-06-session71-parity-remediation.md)
written and validated against the codebase (every anchor grepped at
file:line before execution; the blast radius pre-checked — the
`{open &&` patterns in ZERO test pins, the edit-dialog-remount
outer-key pins identified for the rewrite, the page-layout wrapper
pins for the re-anchor, the e2e absence assertions all polling).

**RED**: 16 failed exactly (the dialog-mount-contract suite's 8
[the epoch pattern + the unconditional mounts + the zero-Date.now +
the no-outer-key family + the savingEdit wiring + the Event status
form] + the rewritten edit-dialog-remount 4 + the dch hygiene trio
+ the re-anchored page-layout wrapper pin); the 17th new it (the
DIALOG_FIELDS_WRAPPER exactly-one-consumer guard) green through the
RED by design.

**GREEN**: S71-P1 the permanently-mounted family — the useOpenEpoch
adjust-during-render helper (the AppShell close-on-route-change
idiom; setState-in-effect stays an ERROR under our lint) + all five
Dialog wrappers + the EntityEditDialog shell mounting their forms
UNCONDITIONALLY keyed by the epoch (the M-71a1 Date.now() key and
the M-71a2 outer keys retired; the EntityEditForm child extracted;
the parents keep nulling editTarget on close — harmless, the keyed
child's state is isolated from the `initial` prop, so the populated
body persists through the exit). S71-P2 the savingEdit bracket at
the three edit call sites (setSavingEdit(true) at submit entry,
false at resolution, isLoading fed). S71-P3 the Event status
literal form (the capitalize class retired, the manual transform
kept). S71-P4 the hygiene quartet (hideClose, settings, `??`, the
wrapper records + the lockstep pin). S71-P5 the store comment
precision (nine raw-fetch call-sites across eight endpoints).
S71-P6 the two e2e additions: the Log Activity quick-create
round-trip (the ActivityDialog's first e2e, with the 700ms
typed-value persistence window) + the exit-phase/reopen-fresh pair
(data-state=closed while mounted, the typed value in the animating
body, the unmount after the animation, the fresh state on reopen).
TWO mid-flight repairs (both caught by the runs, none post-ship):
the `))}}` JSX typo in the Event status edit (tsc caught it) and
the e2e strict-mode violation (getByText('Log Activity') resolving
to the title AND the submit button — corrected to the role-scoped
heading assertion; the run itself caught it).

**Non-vacuousness**: pre-fix 098ce51 worktree (node_modules
hard-linked via cp -al) + ONLY the four modified test files →
**16 failed | 239 passed (255)** — exactly the RED set. Full clean
teardown; `git worktree list` = the main checkout only.

**Full gate**: lint 0/0 · tsc 0 · **1300/1300 unit (80 suites,
+13)** · build clean · **119/119 e2e** on a fresh CI=1 boot (3.0m,
all 9 mobile-nav checks green).

**LIVE battery**: the fix surfaces through real round-trips — the
Log Activity typed value SURVIVING the store-settle window (the
M-71a1 contract); the exit phases on BOTH families (the create
dialog: state=closed + animate-out + the typed description in the
animating body, unmounted at +500ms; the Edit Contact dialog: the
same with the EDITED name — the M-71a2 surface that NEVER animated
before); the reopen-fresh epoch contract (the empty description on
reopen); the F-46f contract preserved (the populated fields on the
edit open); the edit save round-trip (the dialog closes on
success); the drawer both directions at a TRUE 390px (open via the
real click: 8/8 links visible + the body lock + focus in the panel
via Tab; Escape: hidden + unlocked + focus RESTORED to the trigger
— the probe's wrong-element comparison [the drawer's internal
Close button] run down and re-verified; the e2e real-click suite
carries the same contract green); zero 390px overflow on all ten
routes (both Dashboard casings); NO Tailwind v4 bug (--blur-sm 4px
+ --shadow-sm `0 1px 2px 0 #0000000d` + a live surface computing
`rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`); the closing db:census
MATCH (15/24/10/23/12 + 4 users — zero probe residue).

**Screenshots**: **81-log-activity-dialog NEW** (the M-71a1 fix
surface — the Log Activity dialog open with the typed description,
the Email type wired from the quick-log row) + **82-edit-contact-
dialog NEW** (the M-71a2/S71-P2 surface — the Edit Contact dialog
with the populated fields) — VLM-verified 4/4 + 4/4 (81: the modal
over the dimmed Activities page, the typed description + the Email
type + the Date & Time field, the Cancel/Log Activity footer, no
defects; 82: the populated Khalid Al Mansoori fields, the
Name/Email/Phone/Company/Position + Status/Source family, the
Cancel/Save Changes footer, no defects).

**Docs realigned**: README (badge 1419 = 1300 + 119, the Tested row
+ the suite list + the session-71 paragraph), AGENTS (the commands
table + the gate order + the session-71 block), CLAUDE (1300 ×5 +
119 ×4), PAD (the s71 unit inventory row + the Total 80/1300+119 +
the HEAD note), SKILL **v1.68.0** (frontmatter + body H1 +
project_state + the new §16bk, applied atomically via the
assert-first scripts/skill_edits_s71.py at the sandbox root, 6446
→ 6509 lines by wc -l), this record, the plan's execution record,
both worklogs; .env/.env.example verified (no env surface change;
DATABASE_URL `file:../db/custom.db` with db/ at the repo root).

**Errata (the N-71x record-precision note on the s70 record)**: the
session_133/crm-store.ts:8 claim "the eight raw-fetch exceptions" —
the actual NINE call-sites across eight endpoints (topbar 1,
login-card ×4, multipart ×2, blob 1, PATCH 1). Recorded here per
the F-67a1/F-70a2 errata convention; the carrier fixed in-code this
session (S71-P5).

**Estimate drift**: the plan's "the new session-71 its" landed at
+13 (1287 → 1300: the dialog-mount-contract 8 + the rewritten
remount +1 net + the dch 4); the plan's "117 → 119 e2e" exact. The
e2e-sleeps census now counts THREE annotated bounded sleeps (the
s71 700ms settle window added with its justification — recorded for
the next graduation audit's census).

**Ship**: the commit on main + the SSH-wrapper v3 push (with
`--remote git@github.com:nordeim/neo-crm.git` — the s64 wrapper-trap
note honored) + the remote verification + the operator key shredded.
