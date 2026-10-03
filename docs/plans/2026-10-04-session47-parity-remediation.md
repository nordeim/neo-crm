# Session-47 Parity Remediation Plan (2026-10-04)

Session 47 on `main` @ `75bda52` (the session-46 code at `2aee8bb` + the
operator's `docs/session_86.md` transcript commit — src identical, empty diff
verified by the fresh clone). Baseline gate on the fresh clone: **lint 0/0
(enforced) · tsc 0 · 1119/1119 unit (63 suites)** — the documented state
exactly. `.env` created from `.env.example` (+ `AUTH_SECRET`); `db:push` +
`db:seed` run — the database pristine (15 contacts / 24 leads / 10 accounts /
23 activities / 12 events / 4 users, counted via the absolute-URL Prisma
probe); the dev server healthy on :3000 (`/api/health` → ok/healthy/db up);
`agent-browser 0.38.1` ready; the vitest (5.0.1) + playwright (1.63) configs
verified standing (`skills/` excluded from lint/tsc/vitest by the established
config trio).

## The audits (two parallel review agents + manual validation of every claim)

### A. The session-46 re-audit (fresh eyes on `2aee8bb`)

All seven session-46 fix families verified GENUINE — P1 the ten-site
mutation-feedback sweep (the three submits' else-branches, the five deletes,
the two inline mutations, the four toast imports — vocabulary verbatim vs
entity-dialogs, zero shadowing, happy paths untouched), P2 the DefaultsEditor
debounce (one shared 500 ms trailing timer; the serialized flush chain; the
unmount clear+flush; all six fields on one `set()`), P3 the guarded picklist
revert (reference equality) + the full-serialization remount keys, P4 the
topbar abort-aware envelope reset, P5 the hygiene pair, P6 the per-target
remount keys (every close path nulls editTarget; no mid-open remount), P7 the
dropdown containment (composed after `{...props}`, zero document-level click
listeners in src — no outside-close path shielded). The seven pin files
re-ran 30/30 at HEAD; non-vacuousness proven MECHANICALLY in a c706f01
worktree (24 failed / 6 passed = the documented RED-24); full suite 1119/1119;
zero suppressions in the diff. **No regressions.**

New findings: **F-47f (LOW)** the leads-page inline-edit family — the three
s29-P2 onChange arrows (`leads-page.tsx:534` value / `:546` stage /
`:568` nextFollowUp) call `updateLead` fire-and-forget with no feedback; a
failed PUT silently reverts via the unconditional refetch (the user's edit
vanishes). Missed by the s46 census because they are onChange arrows, not
async/await sites. N-47g (INFO) the topbar's entire Dropdown import block is
dead (topbar.tsx:7-10 — only the Menu* family is used; lint-invisible,
no-unused-vars off). N-47h..l INFO-grade (the DefaultsEditor remount-focus
corner, the <500 ms hard-close flush window, the 0 ms flush fast-path, the
failed-updateRole select display, the impure-updater idiom).

### B. The deferred-findings graduation audit

**ZERO graduations** — all 13 standing-ledger items re-confirmed at
file:line on HEAD (benign line drift only: the contacts-page items +11 from
the s46-P1 toast imports; the topbar img site +5). All four deferred pointers
re-confirmed unchanged.

Fresh-eyes findings (each manually validated at file:line this session):

- **F-47a (MED, the headline) — the dashboard's five export affordances are
  dead-since-s29 wiring.** `src/app/(app)/page.tsx:120-123` (the outline
  Export dropdown: Leads/Contacts/Accounts/Activities items) + `:133` (the
  primary Export) call `downloadFile("/api/export?type=…&download=1")`, but
  `export/route.ts:42` 400s every type except `report` (the s29 re-scope —
  the route comment documents the branch retirement). `downloadFile` sets
  `window.location.href` (`download.ts:8`), so clicking any of the five
  NAVIGATES THE BROWSER OFF THE DASHBOARD to the raw 400 JSON body. The
  reference's own header trio is dead (no onClick on any — bundle-verified
  again this session); ours is the DOCUMENTED functional superset
  (dashboard-contracts.test.ts:284-291) whose jobs went dead with the route
  re-scope. Zero e2e coverage — how 18 green sessions missed it.
- **F-47b (LOW) — the account-insights activity icons are vocabulary-dead.**
  `account-insights-dialog.tsx:139-152` compares `a.type === "Email"` /
  `"Call"` (Capitalized) against our lowercase Activity.type vocabulary
  (ACTIVITY_TYPES call/email/meeting/whatsapp/task/note; the seed and every
  other surface lowercase) — both branches are dead with real data: every
  activity row renders the purple CalendarDays fallback. The REFERENCE
  stores Capitalized types (bundle: `["Call","Email","Meeting","Task","Note"]`
  + `["Call","Email","Meeting","WhatsApp"]`), so ITS comparisons match ITS
  storage; our clone pinned the lowercase vocabulary (s28, tested), so OUR
  dialog must compare lowercase to render the same icons the reference
  renders with its own data. The tint classes + icon intent stay verbatim.
- **F-47c (INFO, parity — NOT fixed)** the lead EntityEditDialog's 4-option
  Status select renders a BLANK trigger for the seeded proposal/negotiation/
  won/lost leads — the documented Mke mirror (the same quirk the inline
  select documents at leads-page.tsx:541-545). Parity note only.
- **N-47d (INFO, deferred)** the three entity-dialogs edit-mode branches are
  dead-in-practice (~170 lines: the pages open EntityEditDialog for edits;
  ContactForm/AccountForm/LeadForm edit branches unreachable) — removal
  changes a shared component's public surface (the N-46e isLoading posture).
- **N-47e (INFO, pointer-(b) fold)** the src-dead CONTACT_SOURCES's header
  comment contradicts the s28 correction directly beneath it — folds into
  the operator's vocabulary-reconciliation decision.

Clean surfaces verified in full by the audit: all ui/* primitives, charts,
page-parts, every lib seam swept, all [id] PUT routes, the dashboard route,
login/signup, seed, e2e specs, the systemic greps.

## The standing layers (43rd session, NO DRIFT)

The reference bundle fresh-fetched + md5-compared: **IDENTICAL**
(`a70a637fcf1d4291da8e0d965676dc11`, 1,631,071 bytes — the EIGHTEENTH
consecutive stable session). Logged into the reference with the operator
credentials: demo data still zero (43rd — Total Leads 0, "No upcoming
activities", empty Recent Deals); the mobile-nav census at a TRUE 390px —
the reference's defect stands (NAV w=0, 8 links in DOM, 0 visible, no
hamburger). OUR clone's drawer verified live in every direction: OPEN via
the REAL trigger ("Open navigation menu", 36×36, visible) → 8/8 links truly
visible (getClientRects + computed visibility — the SECOND nav; the desktop
sidebar is the w=0 first) + dual scroll-lock (body AND main hidden) + the
trigger's `aria-expanded:"true"`; Escape → 0 visible + `inert` (on the
fixed inset-0 container) + unlocked + `aria-expanded:"false"`. Zero 390px
overflow on all nine routes (both Dashboard casings included). NO Tailwind
v4 bug surfaced (the standing token contract re-verified: literal-hex
`@theme`, the re-pinned `--shadow-sm`/`--blur-sm`, the vendored
tw-animate.css, the `@tailwindcss/postcss` wiring; tailwindcss 4.3.3).

## The fixes (S47-P1..P4, RED-first)

### S47-P1 — the dashboard export rewire (F-47a)

The five affordances leave the dead `/api/export?type=` wiring for the
CLIENT-SIDE entity-export family — the pages' own s26/s29 conventions
verbatim (the builders, the filenames, the zero-guards):

- The four menu items: Leads → the leads-page builder verbatim
  (`unquotedHeaderCsv`, the 8-column header, `entityExportFilename("Leads")`
  → `leads_ISO.csv`); Contacts → the contacts-page builder verbatim
  (`toQuotedCsv`, 7 columns, `csvFilename("contacts")`, the zero-row guard);
  Accounts → the accounts-page builder verbatim (`toQuotedCsv`, 10 columns,
  `csvFilename("accounts")`, the zero-row guard); Activities → the settings
  raw-dump family (`entityDumpCsv` + `entityExportFilename("Activity")` →
  `activity_ISO.csv`, the zero-row guard) — the repo's only
  activities-CSV convention.
- The primary Export keeps its documented job (the one-click leads export —
  the same builder).
- The page destructures `leads, contacts, accounts, activities` from the
  store (all hydrated by the shell bootstrap); `downloadFile` import
  replaced by `downloadBlob` (+ the entity-export/csv/lead-filters helper
  imports); ZERO `/api/export` references remain in the page.
- ONE new e2e (the coverage gap that hid the bug): the outline Export's
  menu → Leads item downloads `leads_ISO.csv`; the primary Export downloads
  `leads_ISO.csv` (the settings-export e2e's download-event pattern).
  E2e count 108 → 109.

### S47-P2 — the insights icon vocabulary (F-47b)

`account-insights-dialog.tsx:139-152`: the six comparison sites lowercase
(`a.type === "email"` / `"call"` ×3 each) — the tint classes
(`bg-blue-100 text-blue-600` / `bg-green-100 text-green-600` /
`bg-purple-100 text-purple-600`) and the Mail/Phone/CalendarDays icon
mapping stay VERBATIM (pin-pinned). The badge at :160 keeps rendering the
raw type (the mirror).

### S47-P3 — the leads inline-edit failure feedback (F-47f)

The s46-P1 convention adapted to the fire-and-forget onChange arrows — the
three sites chain `.then(onLeadEditResult)`; ONE shared debounced failure
helper (500 ms trailing): the value input mutates PER KEYSTROKE, and a
failing burst must not toast per keystroke (the s46-P2 DefaultsEditor
lesson) — the burst collapses into a single `toast.error("Could not update
lead", res.error)`. The helper clears + reschedules the window timer; an
unmount effect clears it. The pinned call shapes stay verbatim
(`updateLead(l.id, { value: parseFloat(e.target.value) || 0 })` etc. — the
`.then` wraps the call, the regexes still match).

### S47-P4 — the topbar dead-import removal (N-47g)

`topbar.tsx:7-10`: the Dropdown/DropdownContent/DropdownItem/DropdownTrigger
import block removed (only the Menu* family is used — 10 usages).

## Pre-execution validation (done, at file:line)

- **Pin blast radius**: `dashboard-contracts.test.ts:292-316` pins the
  header trio's LABEL contracts (DASHBOARD_HEADER.*), NOT the handlers —
  the rewire is safe (it RESTORES the "documented functional superset jobs"
  the pin's own comment describes); `account-surfaces.test.ts:122-127` pins
  the three tint classes (kept verbatim); `leads-inline.test.ts:77-83/:106`
  pins `updateLead\(l\.id, \{\s*value:` / `{stage:` + `parseFloat\(e\.target\.
  value\) \|\| 0` (kept verbatim inside the `.then` wrap); ZERO pins on the
  topbar's import block. `entity-export.test.ts:94` (the settings export
  block's zero-`/api/export` pin) does not read page.tsx — but the new
  dashboard pins assert the same class of contract for the dashboard.
- **E2e census**: no e2e clicks the dashboard export buttons, the insights
  activity rows, or the leads inline controls (the settings/reports export
  e2es are different surfaces) — nothing can trip. The ONE new e2e adds
  coverage (109 total).
- **The finding validation**: F-47a's five sites + the route guard + the
  navigation seam + the reference's dead trio (bundle) read; F-47b's six
  comparisons + the vocabulary (ACTIVITY_TYPES, the seed, the activities
  page, the reference's Capitalized storage) read; F-47f's three arrows +
  updateLead's failure envelope (the string `error`) read; N-47g's
  dead block + the Menu* usages counted.

## RED pins (planned: 12)

- `tests/dashboard-export.test.ts` — 6 its: (1) the page carries ZERO
  `/api/export` + ZERO `downloadFile` references (the client-side
  rewire); (2) the four menu items call the four builder functions; (3)
  the leads builder = `unquotedHeaderCsv` + `entityExportFilename("Leads")`
  + the 8-column header + the store's leads; (4) the contacts builder =
  `toQuotedCsv` + `csvFilename("contacts")` + the zero-guard + the 7
  columns; (5) the accounts builder = `toQuotedCsv` + `csvFilename(
  "accounts")` + the zero-guard + the 10 columns; (6) the activities
  builder = `entityDumpCsv` + `entityExportFilename("Activity")` +
  the zero-guard.
- `tests/insights-vocabulary.test.ts` — 2 its: (1) the lowercase
  comparisons present + the Capitalized comparisons ABSENT; (2) the three
  tint classes + the Mail/Phone/CalendarDays mapping intact.
- `tests/leads-inline-feedback.test.ts` — 3 its: (1) the three sites chain
  `.then(onLeadEditResult)` with the call shapes verbatim; (2) the
  debounced helper (clearTimeout + 500 ms setTimeout + `toast.error(
  "Could not update lead"`); (3) the unmount cleanup effect.
- `tests/topbar-import-hygiene.test.ts` — 1 it: the Dropdown* import block
  absent from topbar.tsx (the Menu* family still present).

Predicted RED: 12 failures, all 1119 pre-existing checks green through RED
(pin-count arithmetic per the s43-s46 precedent may shift ±1 — the failure
SET must match the code-change pin set exactly).

## Gate + LIVE verification

Gate: lint 0/0 (enforced) · tsc 0 · full unit (1119 + the new pins) ·
build clean · 109/109 e2e on a fresh CI=1 boot (the 7 mobile-nav checks
included). LIVE battery on the dev server: (1) the dashboard's outline
Export menu → each of the four items downloads its CSV (no navigation, no
400 — the URL stays `/`); (2) the primary Export downloads `leads_ISO.csv`;
(3) the insights dialog on an account with seeded email/call activities
renders the BLUE Mail / GREEN Phone icons (was all-purple CalendarDays);
(4) an offline inline-edit burst on the leads value input → exactly ONE
"Could not update lead" toast (not per keystroke); (5) zero probe residue
(15/24/10/23/12 pristine).

## Deferred pointers (unchanged unless noted)

The reports/export filter membership asymmetry; the 2 source
enum-membership sites (the vocabulary-reconciliation product decision —
N-47e's CONTACT_SOURCES comment contradiction folds in); the CSV
formula-injection decision for the operator ((a) parity / (b) =+@tab-CR
/ (c) full-OWASP — covering BOTH csv.ts and entity-export.ts); the 11
e2e sleeps; the standing ledger (13 items, zero graduations); the drift
re-sweep next live visit. New INFO notes deferred: N-47d (the dead
entity-dialogs edit branches), F-47c (the lead blank-select parity note),
N-47h..l (the s46-a INFO family).

## EXECUTION RECORD (2026-10-04, session 47 — SHIPPED)

- **RED**: exactly **11 failures** (6+2+3+1 minus the happy-path guard —
  the insights tint-class pin is the s45-precedent REGRESSION GUARD, green
  through RED by design; 11 RED pins + 1 guard = the planned 12), all 1119
  pre-existing checks green through RED (full suite through RED: 11 failed
  / 1120 passed). Four pins retargeted mid-GREEN (the s45/s46 precedent —
  anchor corrections only, no code changes: the DropdownItem anchor lands
  AFTER the onClick → backward slices; the bare handler reference has no
  call parens; the filters popover shares the input types → aria-label
  anchors; the cleanup-only arrow is `() => () =>`, not `return () =>`).
- **GREEN (S47-P1..P4)**: the dashboard's five export affordances rewired
  to the client-side entity-export family (the four page-convention
  builders + the one-click primary; `downloadFile` → `downloadBlob`; zero
  `/api/export` references remain); the insights icon vocabulary
  lowercased (six comparison sites; the tint classes + icon mapping
  verbatim); the leads inline-edit feedback (the three `.then` chains +
  the 500 ms debounced failure toast + the unmount cleanup); the topbar
  dead-import block removed.
- **Gate**: lint 0/0 (enforced) · tsc 0 · **1131/1131 unit (64 suites,
  +12)** · build clean · **109/109 e2e on a fresh CI=1 boot** (the new
  dashboard-export download e2e included; all 7 mobile-nav checks green).
- **LIVE**: the dashboard export menu's four items + the primary Export
  download their CSVs with ZERO navigation (URL stays `/` — was the raw
  400 JSON page); the insights dialog renders the blue Mail / green Phone
  icons on the seeded email/call activities; the offline leads inline-edit
  burst → exactly ONE toast; zero probe residue (15/24/10/23/12).
- **Screenshots**: 02/11/12 re-captured (within the established
  chart-animation/raster noise) + **55-insights-activity-icons NEW** (the
  F-47b fix's domain surface — the Account Insights dialog's Recent
  Activities tab showing the blue Mail + green Phone icons, 1440×900).
  02 + 55 VLM-verified.
- **Docs**: README (badge + the session-47 paragraph + the suite counts)
  · AGENTS (1131/109 + the session-47 block) · CLAUDE (1131) · PAD (the
  s47 row / 64 suites / totals / checklist / command table) · SKILL
  **v1.44.0** (frontmatter + project_state + the H1 + the new §16am) ·
  `docs/session_87.md` · this record · both worklogs. `.env`/`.env.example`
  re-verified (no env surface change).
- **Shipped**: commit on main + the SSH-wrapper push to
  `git@github.com:nordeim/neo-crm.git` (the operator ed25519, shredded
  after — the s43-s46 runbook).
