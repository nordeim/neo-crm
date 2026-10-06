# Session-71 Parity Remediation Plan (2026-10-06)

Session 71 on `main` @ `098ce51` (the s70 ship `8643b1a` + the
session-log update — docs/session_133.md the s70 record,
docs/session_134.md the operator's s70 transcript). Workspace: the
sandbox was RESET (a fresh clone; the environment rebuilt — bun
install, .env from .env.example with a generated AUTH_SECRET,
db:push + db:seed). The census reads
`file:/home/z/my-project/neo-crm/db/custom.db` + 15/24/10/23/12 +
4 users + pristine: MATCH — db/ at the repo root, as the operator's
brief requires (the documented intake hazard STANDS in this
sandbox's shape: the stale platform DATABASE_URL override points at
a non-existent mirror, all session-71 repo operations run under
`env -u DATABASE_URL`, the e2e suite immune via its own pinned
E2E_DATABASE_URL). Intake hygiene: NO zombie servers; ports 3000/
3100 clear. **Baseline gate on HEAD: lint 0/0 (enforced) · tsc 0 ·
1287/1287 unit (79 suites)** — the documented state exact. The
`skills/` exclusion verified in all three configs (vitest include
allowlist `src/**` + `tests/**` only, eslint ignores, tsconfig
exclude); the skills/ folder excluded from code checking, testing
and compilation per the operator's brief.

## The standing layers (67th session, NO DRIFT)

Drift sweep #67: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, direct curl with a browser UA) — size
1,631,071 + md5 `a70a637fcf1d4291da8e0d965676dc11` **exact — the 42nd
consecutive stable session**. Reference census #67 (agent-browser,
live login at 1280 then a TRUE 390px viewport): the demo data still
zero (the KPI values 0/$0.0k/$0.0k/$0k/0%/0); the mobile-nav defect
STANDS at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible,
scrollW 390, NO hamburger — the visible-button census lists only the
user-menu/Add/Export cluster); desktop nav normal (256px, 8 links,
all visible).

## The audits (three parallel agents + manual validation of every claim)

### A. The session-70 re-audit (71-a) — 10/10 GENUINE

Every s70 checklist item verified at file:line (S70-P1 the bare
STAT_CARD.value + the lockstep pin + the 5th family; P2 the
REPORTS_PIE_FILLS constants + the three `[...spread]` consumers; P3
the by-type family rewire with the recharts import retired; P4 the
animation retirement ×3 — zero `isAnimationActive` props in src/;
P5 the updateSettings token guard; P6 the updateLead refetch shape;
P7/P8 the comment carriers; P9 the two e2e additions; the counts
corroborated LIVE — 1287/1287 in 79 suites, 117 e2e blocks, tsc 0;
the commit honest — 24 files, +1041/−49, zero strays). NEW: **N-71x
(Nano, record precision)** `crm-store.ts:8` claims "the eight
raw-fetch exceptions" — the site enumeration totals NINE call-sites
(topbar 1, login-card ×4, multipart ×2, blob 1, PATCH 1); "eight"
holds only under the distinct-endpoint reading. The 71-b audit
corroborated the same note.

### B. The graduation audit (71-b) — ZERO graduations, 13/13 (28th consecutive)

All 13 standing items re-verified at file:line (F-47c, N-48c,
N-48f, N-48j, N-51c, the CSV posture (b), the source-vocabulary
parity, the stock-mirror, the N-58c boundary, the defensive
annotations, the foreign-docs retirement, the 19/19 deps, the
standing fixes). The 8 mechanical censuses ALL CLEAN (localStorage
exactly 2 live keys; public/ og-image.png only; API 27 routes/39
handlers all consumed; env parity 3-var exact; doc anchors at
1287+117 all four carriers exact, badge 1404; zero commented-out
code; exactly 2 annotated e2e sleeps; TODO/FIXME 0, .skip/.only 0,
console.log 0 with the 4 documented exceptions, `new PrismaClient`
exactly 2). Doc-hygiene infos: benign anchor drift (the e2e sleeps
:468→:496, :2328→:2383; the dch N-58c guard; the accounts
annotation) — all attributable to the documented s69/s70 edits;
N-70b2 unchanged (the AGENTS.md:185 singular abbreviation).

### C. The fresh-eyes rotation (71-c: the entity-dialogs family —
entity-dialogs.tsx 1081 + entity-edit-dialog.tsx 254 + dialog.tsx
123 + the insights/slide-over/save-report siblings + the consumers;
never a dedicated rotation target; every claim manually re-validated
at file:line by the orchestrator, the parity-bearing claims
BUNDLE-DECODED against the fresh-fetched reference)

**The seam SOLID** (the envelope discipline, React 19 discipline,
the s29/s45/s64 store guards, the pinned chrome/toast/payload
families all intact — zero findings contradict an existing pin).
The **N-71 family** (as validated + decoded):

- **M-71a1 (Medium, behavioral)** `entity-dialogs.tsx:951` — the
  ActivityForm CREATE key `` `${defaultType}-${Date.now()}` `` —
  `Date.now()` evaluated at RENDER time: any parent re-render while
  the Log Activity dialog is open (all five consumer pages
  destructure the whole store; the first-load slice resolutions are
  a guaranteed re-render source) re-keys the form → REMOUNT → the
  user's typed subject/notes WIPED. The EventDialog sibling's
  `defaultStart?.getTime()` is state-derived (stable) — the
  ActivityDialog's is not. Zero pins cover the key.
- **M-71a2 (Medium, parity — bundle-decoded)** the three
  EntityEditDialog mounts (`contacts-page.tsx:940`,
  `leads-page.tsx:715`, `accounts-page.tsx:618`) key the OUTER
  component (`key={editTarget?.id ?? "none"}`) and null editTarget
  in the same batched close render → React unmounts the entire Radix
  Root instantly → **the pinned `data-[state=closed]` slide-out
  chrome NEVER PLAYS on any close path** of the three edit dialogs.
  BUNDLE: the reference mounts W7/wce/Mke with **NO key, permanently
  positioned** (`c.jsx(W7,{open:i,onOpenChange:a,contact:g,...})`)
  — its exit animation plays with the FULL form body.
- **I-71a4 (Info, parity — folded into the M-71a2 fix)** the five
  create dialogs' `{open && <XForm/>}` conditional unmounts the form
  body at close → the exit animation plays over an EMPTY shell
  (header-only). BUNDLE: the reference's create forms render
  UNCONDITIONALLY inside DialogContent (the lead-create form resets
  itself in the submit handler; the s46-F46f empty-fields hazard is
  why OUR house chose the key pattern — the reference solves it with
  setState-in-effect, an ERROR under our lint).
- **L-71b1 (Low, parity — bundle-decoded)** `isLoading` defaults
  false and NO call site passes it — the three edit dialogs' "Save
  Changes" never disables (no double-submit guard). BUNDLE: the
  reference wires it — `disabled:i, children: i ? "Saving..." :
  "Save Changes"` with `isLoading: H.isPending`. The N-46e
  wire-or-remove posture has stood since s46.
- **N-71c2 (Nano, parity — bundle-decoded)** the EventForm status
  SelectItems carry BOTH `className="capitalize"` AND the manual
  `s[0].toUpperCase() + s.slice(1)`. BUNDLE: the reference ships
  plain literal labels (`value:"scheduled", children:"Scheduled"`)
  — no capitalize class, no runtime transform.
- **L-71d4 (Low, hygiene)** the invented `hideClose` prop on
  DialogContent (`dialog.tsx:39-58`) — zero consumers repo-wide,
  zero pins, not stock shadcn. The N-57 dead-prop class.
- **L-71d5 (Low, hygiene)** ContactForm's dead `settings`
  destructure (`entity-dialogs.tsx:327`) — appears exactly once in
  the body (the destructure itself); AccountForm/LeadForm consume
  theirs (defaultTier/defaultLeadStage).
- **N-71d1 (Nano, hygiene)** `contact-detail-panel.tsx:91` —
  `(contact.name.charAt(0) ?? "")` — the `??` is dead (charAt
  never returns nullish).
- **N-71d3 (Nano, hygiene)** `DIALOG_FIELDS_WRAPPER.contact`/
  `.account` (`page-layout.ts:767`) have ZERO consumers — only
  `.lead` is consumed (entity-dialogs.tsx:656); the contact/account
  dialog bodies carry their own strings. Un-annotated zero-consumer
  records.
- **DISMISSED at validation (the audit's false-positives /
  confirmed parities — recorded for the audit trail)**: L-2 the
  save-report footer (our `<DialogFooter>` already renders the full
  stock `flex flex-col-reverse sm:flex-row sm:justify-end
  sm:space-x-2` — the BUNDLE confirms the reference's save-report
  dialog uses exactly that narrow stock footer); I-2 the saved-view
  columns on Load (BUNDLE: `_ = (A, O) => { if (O) t(A.filters) }` —
  the reference applies ONLY the filters; our documented parity
  exact); I-3 the account-create phone type (BUNDLE: no type
  attribute — plain text, matching ours); L-3 the slide-over a11y
  (BUNDLE: the reference's Pke is a plain `fixed` div — no role,
  no aria, no focus trap, X-only close — our documented parity);
  N-4 the tab persistence (BUNDLE: Pke stays mounted with
  `if (!e) return null` — the reference's tab state persists across
  entity switches too — parity).
- **Coverage catalog (the rotation's)**: LIVE-only — the ENTIRE
  ActivityDialog (create + edit, zero e2e), the dashboard
  quick-create family (zero e2e), the exit animations, the
  double-submit guards, the dialog Escape/overlay-close paths. The
  two new e2e checks below close the two largest holes.

## The operator decisions

The **CSV formula-injection posture (b) STANDS** (30th re-affirmation
— the guard intact in both export families [guardFormulaPrefix at
csv.ts:31-33 applied in escapeCell AND imported into
entity-export.ts, the 71-b re-verification], the `-` exclusion
documented + pinned, the reference bundle byte-stable for the 42nd
consecutive session; the 71-c rotation touched NO CSV surface — no
new evidence moves the (a) parity / (c) full-OWASP alternatives).

The **source-vocabulary documented parity STANDS AND EXTENDS to the
N-71 family** (the 71-b census re-confirmed the anchors at file:line:
CONTACT_SOURCE_OPTIONS/LEAD_SOURCE_OPTIONS/SOURCE_PAIRS pinned, NO
enum-membership on routes' source, the settings Capitalized defaults
verbatim; the session-71 fixes touch NO vocabulary surface — the
fixes are mount-mechanics, a loading-state wiring, a class-string
retirement, dead-prop/destructure/`??` retirements, a comment
precision carrier, and e2e additions).

## The remediation set (TDD — RED first, then GREEN)

- **S71-P1 (M-71a1 + M-71a2 + I-71a4 — the permanently-mounted
  dialog family)**: all five Dialog wrappers in entity-dialogs.tsx
  (Lead/Account/Contact/Event/Activity) + the EntityEditDialog shell
  adopt the **open-epoch key pattern**: an adjust-during-render
  `useOpenEpoch(open)` (the sanctioned house pattern — the mobile-nav
  precedent; setState-in-effect stays an ERROR) computes a stable
  epoch that increments ONLY on false→true transitions; the Form
  child renders UNCONDITIONALLY keyed by that epoch. At open: the
  epoch bumps → the form REMOUNTS → fresh state per open (the s46
  F-46f contract preserved — the initializer re-reads the live
  props, including the resolved settings slice for
  defaultTier/defaultLeadStage). While open: NO re-key (any store
  re-render is inert — the M-71a1 wipe fixed). At close: NO unmount
  (the epoch is stable through the exit) → **the Radix root stays
  mounted → the pinned exit animation plays over the FULL form body
  — the reference's own geometry** (bundle-decoded). The
  render-time keys retire (`Date.now()` and
  `defaultStart?.getTime()` both — the epoch covers their job). The
  three call-site pages drop the OUTER `key={editTarget?.id ??
  "none"}` (the close-path unmount retired); the parents keep
  nulling editTarget on close (harmless — the keyed child's state is
  isolated from the `initial` prop).
- **S71-P2 (L-71b1)**: the three edit call sites wire a `savingEdit`
  state — `setSavingEdit(true)` at submit entry, false at
  resolution, `isLoading={savingEdit}` fed to EntityEditDialog (the
  "Saving..." label + the double-submit guard — the reference's own
  capability, bundle-decoded `disabled:i`).
- **S71-P3 (N-71c2)**: the EventForm status SelectItems drop
  `className="capitalize"` (the manual label transform stays — the
  reference's plain literal form).
- **S71-P4 (the hygiene quartet — L-71d4/L-71d5/N-71d1/N-71d3)**:
  retire the invented `hideClose` prop from dialog.tsx; drop
  ContactForm's dead `settings`; `contact.name.charAt(0)
  .toUpperCase()` (the dead `??` retired); retire
  `DIALOG_FIELDS_WRAPPER.contact`/`.account` (only `.lead` stays).
- **S71-P5 (the 71-a precision carrier)**: crm-store.ts:8 — "the
  eight raw-fetch exceptions" → the precise "nine raw-fetch
  call-sites across eight endpoints" form.
- **S71-P6 (the 71-c coverage closures — the two NEW e2e checks)**:
  (a) **the Log Activity create round-trip** (the activities page →
  Log Activity → fill → save → the row appears + the toast — the
  ActivityDialog's first e2e, M-71a1's home surface); (b) **the
  dialog exit-phase + reopen-fresh pair** (the lead dialog: type →
  Cancel → the content carries `data-state=closed` while still
  mounted [the exit phase] → hidden after the animation → reopen →
  the fields are EMPTY [fresh per open]). Both green-through-RED
  guards of LIVE-verified behavior (the s67/s69/s70 precedent).
  117 → 119.
- **The carriers**: the 71-a/71-b corroborated Nano recorded as an
  errata line in session_135.md per the F-67a1/F-70a2 convention; the
  dismissed-finding audit trail recorded in the session record.

## Blast radius (pre-checked)

No unit pins on: the `{open && (` mount conditionals (zero matches
in tests/); the ActivityDialog/EventDialog key shapes (zero pins);
the `hideClose` prop (zero pins); ContactForm's destructure shape;
the `charAt(0) ??` form; `DIALOG_FIELDS_WRAPPER.contact`/`.account`
— EXCEPT the page-layout value pins at :1553-1555 (re-anchored in
the same commit — the retirement's lockstep pin); the
`capitalize` class on the Event status SelectItems (zero pins). The
`tests/edit-dialog-remount.test.ts` pins (×3) assert the OUTER key
shape — REWRITTEN to pin the new mechanism (the F-46f intent —
fresh state per open — preserved and extended: the epoch-keyed
child + the no-outer-key contract). The e2e suite: all
dialog-absence assertions are polling forms (`toHaveCount(0)` at the
10s/6s expect timeouts — the 200ms exit cannot flake them); the
dialog tests are single-dialog-per-test (no strict-mode overlap);
the geometry test already polls through the ENTER animation (the
same tolerance covers the exit). The s46-P1 failure-path pin (the
failed-PUT toast) rides the `onSubmit` .then chain — preserved
under the savingEdit wiring. The settings-at-open contract
(AccountForm's defaultTier / LeadForm's defaultLeadStage read at
form mount) is PRESERVED by the epoch remount (the initializer
re-runs at open with the resolved slice). The
create-dialog-single-mode regions anchor on the component
declarations — the wrapper bodies change, the declarations don't.

## The gate

lint 0/0 · tsc 0 · the full unit suite at 1287 + the new
session-71 its · build clean · e2e 119 on a fresh CI=1 boot (all 9
mobile-nav checks green) · the non-vacuousness replay in a pre-fix
098ce51 worktree (only the new/modified test files; the exact RED
set isolated) · the LIVE battery (the fix surfaces through real
round-trips — the Log Activity wipe-fix, the edit-dialog saving
state, the exit animations on both families, the reopen-fresh
behavior + the mobile drawer regression at TRUE 390px + the
Tailwind v4 token probes + zero 390px overflow ×10 routes + the
closing db:census MATCH) · the screenshot set at 1440×900 · the
docs realignment (SKILL v1.68.0 + README/AGENTS/CLAUDE/PAD at the
new counts + session_135.md [the odd-number record convention] +
this execution record + both worklogs).

## The execution record (2026-10-06, session-71)

EXECUTED AS PLANNED with TWO mid-flight repairs (both caught by the
runs themselves, none post-ship — the honest count): (1) the `))}}`
JSX typo in the Event status edit (tsc caught it at the GREEN
checkpoint); (2) the e2e strict-mode violation — `getByText('Log
Activity')` resolved to BOTH the dialog title and the submit button
(the e2e run itself caught it; corrected to the role-scoped heading
assertion). RED: 16 failed exactly (the dialog-mount-contract
suite's 8 + the rewritten edit-dialog-remount 4 + the dch hygiene
trio + the re-anchored page-layout wrapper pin); the 17th new it
(the DIALOG_FIELDS_WRAPPER exactly-one-consumer guard) green
through the RED by design. GREEN: S71-P1..P6 all landed (P1 the
useOpenEpoch adjust-during-render helper + the five wrappers + the
EntityEditDialog shell mounting their forms UNCONDITIONALLY keyed
by the epoch — the Date.now() key, the defaultStart key, and the
three outer keys retired; the EntityEditForm child extracted; P2
the savingEdit bracket at the three call sites; P3 the Event status
literal form; P4 the hygiene quartet; P5 the store comment
precision; P6 the two e2e additions). Non-vacuousness: 16 failed |
239 passed (255) in the pre-fix 098ce51 worktree (node_modules
hard-linked via cp -al, only the four modified test files); clean
teardown. Full gate: lint 0/0 · tsc 0 · 1300/1300 unit (80 suites,
+13) · build clean · 119/119 e2e on a fresh CI=1 boot (3.0m, all 9
mobile-nav checks green). LIVE: the typed value surviving the
settle window (M-71a1); the exit phases on BOTH families with the
typed/edited values in the animating bodies (M-71a2/I-71a4); the
reopen-fresh epoch contract; the F-46f populated-fields contract;
the edit round-trip; the drawer both directions at TRUE 390px with
focus restored (the probe's wrong-element comparison run down);
zero overflow x10; NO Tailwind v4 bug; the closing census MATCH.
Docs: SKILL v1.68.0 (§16bk, 6446 → 6509) + README/AGENTS/CLAUDE/
PAD at 1300+119 (badge 1419) + session_135.md + this record + both
worklogs. Estimate drift: +13 its (the plan's open count) · 119
e2e exact · the e2e-sleeps census now 3 (the annotated 700ms
settle window, recorded for the next graduation census).
