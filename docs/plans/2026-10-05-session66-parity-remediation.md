# Session-66 Parity Remediation Plan (2026-10-05)

Session 66 on `main` @ `603184e` (the session-65 ship 990b3b2 + the
session-log update — docs/session_124.md, the operator's s65 transcript).
Workspace: the sandbox was RESET — a FRESH CLONE at
`/home/z/my-project/neo-crm` (bun install 533 pkgs; `cp .env.example .env`
+ AUTH_SECRET generated; `env -u DATABASE_URL` db:push + db:seed). The
census reads `database: file:/home/z/my-project/neo-crm/db/custom.db` +
15/24/10/23/12 + 4 users + `pristine: MATCH` — db/ at the repo root, as
the operator's brief requires. The s63-s65 intake hazard STANDS: the
orchestration environment exports a STALE
`DATABASE_URL=file:/home/z/my-project/db/custom.db` (an absolute override
the db-path seam honors BY DESIGN) pointing at a NON-EXISTENT mirror —
all session-66 repo operations run under `env -u DATABASE_URL` (the e2e
suite immune — its own E2E_DATABASE_URL). Intake hygiene: NO zombie dev
servers; ports 3000/3100 clear. **Baseline gate on HEAD: lint 0/0
(enforced) · tsc 0 · 1227/1227 unit (75 suites)** — the documented state
exact. The `skills/` exclusion verified in all three configs (vitest
include allowlist, eslint ignores, tsconfig exclude).

## The standing layers (62nd session, NO DRIFT)

Drift sweep #62: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, direct curl with a browser UA) — size
1,631,071 + md5 `a70a637fcf1d4291da8e0d965676dc11` **exact — the 37th
consecutive stable session**. Reference census #62 (agent-browser, live
login at 1280/1512 then a TRUE 390px viewport): the demo data still zero
(Total Leads 0 + "+5.3%", `$0.0k`/`$0.0k`/`$0k`/`0%`/`0`); the mobile-nav
defect STANDS at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0
visible, scrollW 390, NO hamburger); desktop nav normal (256px, 8
links); a reference 390px screenshot captured (outside the repo,
reference-390-s66.png).

## The audits (three parallel agents + manual validation of every claim)

### A. The session-65 re-audit (66-a) — 11/12 GENUINE, 1 PARTIAL

Every s65 checklist item verified at file:line: the N-65b search
re-anchor exact (the dropdown-own-DOM locators — the SearchResultRow
BUTTON by role+name at crm.spec:474 + the section header as its
preceding sibling at :476; the vacuous `.first()` forms gone, quoted only
inside the explanatory comment); the N-65c destructure retirements exact
(contacts-page :83-95 + settings-page :104-107, ConfigEditor/DefaultsEditor
keep their own); the N-65d Key-disjunct retirement exact (zero live
`a.tier === "Key"`, `a.isKey` the live arm); the N-65e direct read exact
(reports-page :171); the N-65a/N-65f anchors exact (token form, :107/:116
verified against settings/route.ts); the N-65g /Profile re-derives exact
(AGENTS :548-564 + PAD :954-962 + the SKILL supersession bracket
:5913-5916); the N-65h focus-restore assertion exact
(mobile-navigation.spec :64-69); the precision carriers all landed; the
dch 52/52 + the full 1227/1227 re-run. **The non-vacuousness REPLAYED in
a pre-fix 9952a23 worktree: 5 failed | 47 passed (52)** — the s65
arithmetic reproduced to the digit; clean teardown. **Item 12 PARTIAL**:
every src hunk is dead-code/comments/annotations/whitespace EXCEPT ONE —
**F-66a1 (Medium)**: the calendar agenda-row div `flex items-start` →
`flex items-center` (the hunk `@@ -480,9 +485,9`; live at :490) — an
UNDECLARED visual behavior change no s65 record covers (the plan claimed
"zero behavior"), silently diverging from the s27 bundle-decoded contract
still documented at calendar-cells.test.ts:26 ("agenda: flex items-start
gap-3 p-3 border rounded-lg"); likely residue of the mid-flight
"calendar upcoming-bar edit repair" (the repair restored the upcoming-bar
but the MultiEdit's second hunk landed the wrong class on the AGENDA
row). **Bundle re-verification this session: the reference's agenda row
IS `flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50`** —
the revert is mandated. Plus F-66a2 (Low — the s65 record says
"02/11/12 re-captured" but 11-mobile-dashboard.png is byte-unchanged
since s63; record errata), F-66a3/F-66a4 (Nano — citation precision).

### B. The graduation audit (66-b) — ZERO graduations, 13/13 (23rd consecutive)

All 13 standing items re-verified at file:line (the INFO family
F-47c/N-48c/N-48f/N-48j/N-51c; both operator anchors; the stock-mirror
KEEP; the N-58c boundary; the s63/s65 defensive annotations; the
foreign-docs retirement; the never-imported deps posture; the dead-arm
retirements + profile PATCH + sessionWriteToken + the 8 zero-consumer
page-layout records). The 8 mechanical censuses ALL CLEAN (localStorage
exactly 2 live keys — crm_saved_reports + neo-crm.leads.views; public/
og-image.png only; 19 runtime deps all consumed; API 27 routes/39
handlers all consumed; env parity 3-var exact; doc anchors all at
1227+112/badge 1339; zero commented-out code; exactly 2 annotated e2e
sleeps). Extra probes all negative (zero TODO/.skip/console.log in src/;
new PrismaClient only in db.ts + the annotated seed client). ONE Nano:
the standing "console.log allowed in verification-server" probe wording
is stale — verification-server.ts carries NO logging; the 6-digit code
log rides `console.info` at api/auth/resend:52 + signup:100, and reality
is STRICTER than the ledger claim: zero console.log anywhere in src/
(record-only — the repo docs themselves say "logged to the SERVER
console", which stays accurate).

### C. The fresh-eyes rotation (66-c: the COMPONENTS seam — src/components/
27 files, 5,332 lines: layout/ 6, shared/ 4, ui/ 14, charts/ 1,
contacts/ 1, accounts/ 1 — never a dedicated rotation target; every
finding manually re-validated at file:line by the orchestrator, with the
two Medium/Low headlines RE-ADJUDICATED against fresh bundle evidence)

The **N-66 family** (as validated):
- **N-66a (Medium)** topbar.tsx:108-114/:143-175 — the global-search
  dropdown closes only via outside-mousedown, a row click, or query
  collapse: NO Escape, NO blur. Keyboard users Tab away with the
  dropdown stranded open. Our search is the documented functional
  superset over the reference's dead input (the s32 decode), so its
  dropdown UX is OURS to design well — the mobile-nav S12-P1 precedent:
  fix the keyboard access. Fix: an Escape keydown on the input closes
  the dropdown; e2e-pinned beside the re-anchored search test.
- **N-66i RE-ADJUDICATED (Medium, promoted from Low to its root
  cause)** — the shared **Badge primitive itself diverges from the
  reference's stock badge on every surface**. Bundle ground truth (the
  `zn`/`fie` decode): the reference's Badge is a **div** carrying
  `inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs
  font-semibold transition-colors focus:outline-none focus:ring-2
  focus:ring-ring focus:ring-offset-2` + a cva variant set
  {default: `border-transparent bg-primary text-primary-foreground
  shadow hover:bg-primary/80` (its --primary = #171717, the stock dark);
  secondary: `border-transparent bg-secondary text-secondary-foreground
  hover:bg-secondary/80` (its --secondary = #f5f5f5); destructive:
  `border-transparent bg-destructive text-destructive-foreground shadow
  hover:bg-destructive/80` (its --destructive = #ef4444); outline:
  `text-foreground`}. OURS (the scaffold-era ui/badge.tsx, untouched
  since the initial commit e16efb9): a **span** with `inline-flex
  items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium
  whitespace-nowrap` + an invented variant set {default: `bg-primary/10
  text-primary border-primary/20` (OUR --primary = #2563eb — the INVERTED
  token mapping); outline: `bg-transparent text-muted border-line`;
  success/warning/danger/info/muted (four of them zero-consumer)}. Every
  CALL-SITE className is already byte-identical to the bundle's (the
  s27-s31 decodes pinned the CLASS MAPS — the P map, the priority i-map,
  the health H-map, the source classes) — only the PRIMITIVE was never
  re-derived (invisible to the live probes: the reference renders NO
  badges at its persistent zero data; the pins covered the maps, not the
  chrome). The visible deltas: rounded-full pill vs rounded-md on ~10
  surfaces; the default variant's border-primary/20 BLUE border where
  the reference renders border-transparent + shadow (Recent Deals +
  insights stage badges); the outline variant's text-MUTED gray where
  the reference renders text-FOREGROUND (leads source, reports
  stage/status/type, insights type, the role badge, the second-Status
  quirk); our soft danger badge where the reference renders the SOLID
  destructive (the accounts "N Overdue"); PLUS the slide-over priority
  badge wrongly carrying the ROW badge's `border font-medium px-3 py-1`
  overrides (the bundle's slide-over: `zn,{className:i[e.priority]}` —
  NO overrides; the ROW badge: `border font-medium px-3 py-1` — ours at
  contacts-page:527 byte-exact ✓). The fix: the stock re-derivation —
  base/variants/element per the bundle, the computed-equal expressions
  for the tokens we deliberately invert (default → `bg-neutral-900
  text-neutral-50 shadow hover:bg-neutral-800` — the s13
  PROFILE_LAYOUT.badge live-probed form, the repo's canonical stock
  mirror; destructive → `bg-danger text-neutral-50 shadow
  hover:bg-danger/80` — our --danger #ef4444 IS the reference's
  --destructive exactly; secondary → `bg-neutral-100 text-neutral-900
  hover:bg-neutral-100/80` — neutral-100 = hsl(0 0% 96.1%) = the
  reference's --secondary exactly; outline → `text-foreground`); the
  unused success/warning/info/muted variants RETIRE (zero consumers —
  the s54 dead-surface policy); danger RENAMES destructive (its one
  consumer — accounts :441 — matches the bundle's
  `zn,{variant:"destructive",className:"text-xs"}` byte-exactly after
  the rename); gap-1 + whitespace-nowrap + span retire with the base.
  Blast radius pre-checked: NO test pins the Badge primitive's base or
  the call-site overrides (the account-surfaces overdue pin's
  `/destructive|bg-red-|text-red-/` disjunct covers both forms); the
  class maps stay byte-identical.
- **N-66d RE-ADJICATED (Medium, promoted from Low)** — the tabs count
  badge is NOT dead cargo: it is an UNWIRED PARITY FEATURE. Bundle
  ground truth: the reference's activities priority tab strip renders
  `["Overdue", P.overdue.length>0 && <span className="ml-2 px-2 py-0.5
  text-xs bg-red-100 text-red-800 rounded-full">{P.overdue.length}</span>]`
  — ONLY the Overdue tab, ONLY when > 0. Our tabs.tsx HAS the count
  machinery but renders the WRONG classes (`ml-1.5 rounded-full px-1.5
  py-0.5 text-[11px] font-semibold` + state-dependent colors) and the
  activities page passes NO count (`{ id: "overdue", label: "Overdue" }`)
  — the s23 tabs layer missed the wiring. Fix: the count span re-pins to
  the reference's literal classes; the activities page passes
  `count: overdue.length > 0 ? overdue.length : undefined` (the >0 guard
  lives at the call site, exactly the reference's `P.overdue.length>0 &&`
  shape); pinned in tabs-aria + a live e2e assertion.
- **N-66b (Low)** tabs.tsx:71-77 — `GRID_COLS_LG` zero references
  repo-wide (the pill's lg:grid-cols-5 lives in page-layout.ts) — the
  s54 dead-surface class, CONST variant. RETIRE + dch pin.
- **N-66c (Low)** page-parts.tsx — `KpiCard.deltaSuffix` (:141/:151) +
  `invertDelta` (:142/:152) never passed; `BarStatCard.barColorFor`
  (:233/:246) never passed → the :275 ternary arm construction-dead (the
  drifted twin: Sparkline's `colorFor` IS live). The N-56a PROP-TYPE
  variant. RETIRE + dch pin.
- **N-66e (Low)** route-case.test.ts:199 — the URL-state scan filters
  `.endsWith(".tsx")`, so the 9 capital-route `.jsx` aliases are
  INVISIBLE to its "no useSearchParams anywhere" claim (the N-65p note
  (b)). Fix: `/\.(tsx|jsx)$/` (the loading-layer:72 precedent).
- **N-66f (Low)** mobile-nav.tsx:105-119/:141/:146 — the Tab focus-trap
  WRAP + the closed-state `invisible pointer-events-none` + `inert
 ={!open}` are pinned at NO layer (zero `press("Tab")` repo-wide; unit
  pins cover only the 768px query) — the N-65p note (a). Fix: a NEW e2e
  test (closed → the panel carries inert; open → focus the last link,
  Tab wraps to the panel's Close, Shift+Tab returns).
- **N-66g (Nano)** topbar.tsx:7-9 — the import-block comment still says
  "dead weight, lint-invisible" but post-S47-P4 the block carries only
  the four live Menu* primitives. REWORD.
- **N-66h (Nano)** entity-edit-dialog.test.ts:59-60 — the
  `disabled={a}` and `readOnly ? "Close"` alternatives match nothing
  (subsumed). COLLAPSE to the honest forms.
- **N-66j (Nano)** page-parts.tsx:529-530 — `Math.max(...values, 1)`
  computed BEFORE the `values.length === 0` guard. REORDER.
- **N-66k (Info — RECORD)** toast.tsx:104 role="status": VALIDATED
  AGAINST THE BUNDLE — the reference's sonner renders role="status" (the
  only role:"status" in its bundle is recharts'; zero role:"alert") —
  our mirror matches the reference; the role="alert" suggestion recorded
  as a NON-ADOPTED improvement (not a parity item).
- **N-66l (Info — RECORD)** the three initials implementations are
  documented reference mirrors; record-only.

## The operator decisions (session 66)

1. **The CSV formula-injection posture (b) STANDS** (24th re-affirmation
   — the guard intact in both export families [csv.ts guardFormulaPrefix
   + entity-export qq()], the `-` exclusion documented + pinned, the
   reference bundle byte-stable for the 37th consecutive session — no
   reference change to react to).
2. **The source-vocabulary documented parity STANDS AND EXTENDS to the
   N-66 family**: the call-site CLASS MAPS stay byte-identical (the P
   map, the priority i-map, the health H-map, the source classes — the
   vocabulary at the seams is already right); the Badge PRIMITIVE
   re-derives to the stock mirror (the s10 stock-primitive precedent
   applied to the last never-re-derived stock surface — the scaffold-era
   Badge); the reference's own feature WIRES (the overdue count badge);
   the dead surfaces RETIRE (GRID_COLS_LG, the page-parts dead props,
   the unused custom variants — the s54/s56 policy); the coverage gaps
   CLOSE (N-66e the .jsx scan filter, N-66f the mobile-nav e2e —
   strengthen, not narrow); the a11y superset LANDS (N-66a the search
   Escape close — the mobile-nav S12-P1 precedent); the undeclared s65
   visual change REVERTS to the bundle-verified form (F-66a1 — the
   agenda items-start); N-66k/N-66l/F-66a2 record-only.

## The plan (every anchor validated at file:line; blast radius pre-checked)

### S66-P1 — the calendar agenda alignment revert (F-66a1, Medium)

- RED-first: calendar-cells.test.ts's session-27 agenda describe gains
  the alignment pin — the agenda region matches
  `/flex items-start gap-3 p-3 border rounded-lg/` (RED at HEAD: the
  code reads items-center).
- GREEN: calendar-page.tsx:490 `items-center` → `items-start` + the
  F-66a1 record comment (the s65 mid-flight-repair residue; the
  upcoming-bar twin keeps items-center per the same s27 contract).
- Blast radius: one class on one div — the full gate re-proves it.

### S66-P2 — the Badge primitive stock re-derivation (N-66i root, Medium)

- RED-first: the NEW tests/badge-contract.test.ts (~10 its): the base
  class string (rounded-md border px-2.5 py-0.5 text-xs font-semibold
  transition-colors + the focus-ring family; rounded-FAILS: no
  rounded-full, no gap-1, no whitespace-nowrap); the DIV element; the
  exact variant set {default, secondary, destructive, outline} (the
  success/warning/info/muted/danger inventions ABSENT); default =
  `border-transparent bg-neutral-900 text-neutral-50 shadow
  hover:bg-neutral-800` (the s13 live-probed stock-mirror form — our
  --primary is deliberately the app blue, the INVERTED token mapping,
  so the computed-equal expression is the neutral literals); secondary
  = `border-transparent bg-neutral-100 text-neutral-900
  hover:bg-neutral-100/80`; destructive = `border-transparent bg-danger
  text-neutral-50 shadow hover:bg-danger/80` (our --danger #ef4444 IS
  the reference's --destructive); outline = `text-foreground` (NOT
  text-muted); the call-site wirings (accounts :441
  `variant="destructive"`; the slide-over priority badge carries NO
  `px-3 py-1` overrides — the stock form; the ROW badge KEEPS `border
  font-medium px-3 py-1` byte-identical to the bundle).
- GREEN: ui/badge.tsx rewritten as the stock mirror (div + the base +
  the four variants); accounts-page :441 danger → destructive;
  contact-detail-panel :95 drops the `border font-medium px-3 py-1`
  overrides (keeps the META).
- Blast radius: ~10 badge surfaces change corner radius + the outline
  text color + the Recent Deals/insights border/shadow; NO test pins
  the old forms (verified); the class maps unchanged; screenshots
  re-captured (02/03/04/07).

### S66-P3 — the overdue count badge wiring (N-66d', Medium)

- RED-first: tabs-aria.test.ts gains the count pins (the span classes =
  the reference's literal `ml-2 px-2 py-0.5 text-xs bg-red-100
  text-red-800 rounded-full`; the state-dependent color ternary GONE) +
  the activities wiring pin (activities-page passes
  `count: overdue.length > 0 ? overdue.length : undefined` on the
  overdue tab ONLY).
- GREEN: tabs.tsx's count span re-pinned to the literal; the activities
  page's tabs array gains the guarded count.
- Blast radius: the count machinery renders on exactly one tab (the
  other five Tabs consumers pass no count — unchanged); e2e asserts the
  badge renders with the seeded overdue rows.

### S66-P4 — the search Escape close (N-66a, Medium — a repair,
green-through-RED)

- topbar.tsx: the search input's keydown handler closes the dropdown on
  Escape (the outside-mousedown + row-click paths unchanged).
- The re-anchored e2e search test gains the Escape assertion (type →
  dropdown visible → Escape → hidden).
- Blast radius: one new handler + one new assertion; the s43-P4/s45
  abort/reset semantics untouched.

### S66-P5 — the dead-surface retirement (N-66b + N-66c + N-66j)

- RED-first: the dch session-66 describe (4 its): GRID_COLS_LG absent
  from tabs.tsx (+ record comment); KpiCard's deltaSuffix/invertDelta
  absent; BarStatCard's barColorFor absent + the `barColorFor ?
  barColorFor(v, i) : barColor` ternary arm gone; the page-parts
  Sparkline guard-before-max order pinned.
- GREEN: tabs.tsx drops GRID_COLS_LG; page-parts drops the three dead
  props + the dead arm; the Sparkline early-return moves above the max
  computation.
- Blast radius: provably zero behavior (all construction-dead); tsc +
  the full gate re-prove it.

### S66-P6 — the coverage + precision carriers (N-66e + N-66f + N-66g +
N-66h)

- route-case.test.ts:199: `/\.(tsx|jsx)$/` (the aliases join the
  URL-state scan — must stay green: the aliases carry no useSearchParams).
- mobile-navigation.spec.ts: the NEW inert + Tab-wrap test (closed →
  `inert` true on the panel; open → focus the LAST drawer link, Tab →
  the panel's Close button, Shift+Tab → back; the wrap arms at
  mobile-nav.tsx:105-119 get their first e2e coverage).
- topbar.tsx:7-9: the import-block comment reworded to the live truth.
- entity-edit-dialog.test.ts:59-60: the dead alternatives collapsed.
- Blast radius: two test files strengthened, one comment, zero src
  behavior.

### S66-P7 — the docs realignment + the LIVE battery + the ship

- SKILL v1.63.0: frontmatter + project_state + the new §16bf (the
  session-66 layer) — applied atomically via an assert-first
  scripts/skill_edits_s66.py at the sandbox root; wc -l verified.
- README: the badge + the Tested row + the session-66 paragraph (the
  badge-primitive + count-badge stories). AGENTS: the commands table +
  the session-66 block + the Badge stock note in the component-anatomy
  row. CLAUDE: the counts. PAD: the s66 inventory row + the Total.
- session_125.md (this session's record — the odd-number convention;
  the operator's s65 transcript owns session_124.md) + this plan's
  execution record + both worklogs + the F-66a2 errata note.
- Screenshots: 02/03/04/07 re-captured (the badge surfaces) + the NEW
  75-activities-overdue-count (the S66-P3 fix surface at 1440×900) —
  VLM-verified.
- LIVE battery: the fix surfaces render (the badge stock geometry on
  the dashboard Recent Deals + contacts priority/source + accounts
  health/overdue; the count badge on the activities tab; the search
  Escape round-trip); the drawer both directions at TRUE 390px; zero
  390px overflow ×10 routes; NO Tailwind v4 bug (the --blur-sm +
  pinned-shadow probes); the closing db:census MATCH.
- Ship: the commit on main + the SSH-wrapper v3 push (with
  `--remote git@github.com:nordeim/neo-crm.git` — the s64 wrapper-trap
  note) + the remote verification + the operator key shredded.

## The arithmetic

- RED: ~17 failures expected (the badge-contract suite ~10 + the dch
  session-66 describe 4 + the calendar agenda pin 1 + the tabs count
  pins 2); full suite through RED: **~17 failed / 1227 passed (~1244
  total)**.
- GREEN: +~15 its (badge-contract is a NEW suite — 76 suites) →
  **~1244 unit checks**; e2e +1 test (the mobile-nav inert/wrap) +
  assertions in two existing tests → **113 e2e checks**; badge ~1357.
- Non-vacuousness: a pre-fix 603184e worktree (node_modules hard-linked
  via cp -al) + ONLY the modified/new test files → the same RED set
  isolated (the repair-style changes — S66-P4's Escape handler — are
  green-through-RED by design, proven live by the e2e).

## Execution record (2026-10-05, session 66 — SHIPPED)

Executed as planned, with the discoveries noted:

- **Intake**: the sandbox was RESET — a fresh clone + bun install +
  db:push/db:seed; census MATCH at the repo path; baseline gate GREEN
  1227/1227; drift sweep #62 byte-identical (37th consecutive);
  reference census #62: the defect stands at TRUE 390px.
- **Re-adjudications at validation**: the orchestrator's fresh bundle
  decodes PROMOTED N-66i (the Badge primitive root cause — the zn/fie
  decode vs our scaffold-era span) and N-66d (the count badge as an
  unwired parity feature, NOT dead cargo); F-66a1's revert was
  bundle-verified (the reference's agenda row IS items-start; its
  upcoming-bar is the items-center family).
- **RED exact**: 17 failed | 82 passed (99 in the four suites) — the
  badge-contract 9 + the calendar agenda 1 + the dch 4 + the tabs-aria
  3 (the ROW-priority guard green-through-RED by design).
- **GREEN**: S66-P1..P6 all landed as scoped. FOUR mid-flight repairs:
  (1) a JSX-comment syntax slip between `return (` and the element at
  the agenda site (caught at the post-edit read, reworded to a JS
  comment before any gate); (2) TWO needle-in-own-docs pin failures
  (the record comments in tabs.tsx + badge.tsx + contact-detail-panel
  quoted the retired literals — fixed by comment-stripping the pins'
  reads, the dch convention); (3) the e2e search reopen assertion
  needed blur-then-focus (a bare focus() is a no-op on the
  never-blurred input); (4) the Account Health e2e locator pinned the
  OLD badge chrome (`span.inline-flex.rounded-full.border`) — the one
  blast-radius miss (the pre-check swept tests/*.test.ts but not
  tests/e2e), re-anchored to `div.inline-flex.rounded-md.border`.
- **Non-vacuousness**: pre-fix 603184e worktree → 17 failed | 1228
  passed (1245) — exactly the RED set; the full-suite replay identical;
  clean teardown; census sanity MATCH.
- **Full gate**: lint 0/0 · tsc 0 · 1245/1245 (76 suites, +18) · build
  clean · 113/113 e2e on a fresh CI=1 boot (2.6m) — the NEW
  inert/Tab-wrap test green, the search Escape round-trip green, the
  count-badge shape assertions green.
- **LIVE battery**: the badge stock geometry verified by computed-style
  probes on four surfaces (Recent Deals / contacts row / accounts
  destructive + health); the search Escape round-trip; the count badge;
  the drawer both directions at TRUE 390px (inert + the dual lock +
  focus restore); zero 390px overflow ×10; NO Tailwind v4 bug; the
  closing census MATCH.
- **Screenshots**: 02/03/04/07 re-captured + 75-activities-overdue-count
  NEW — VLM-verified (the accounts Status-column FAIL is a viewport-crop
  artifact; the health badge verified via the DOM probe).
- **Docs**: SKILL v1.63.0 (assert-first script, 6187 → 6251 by wc -l),
  README/AGENTS/CLAUDE/PAD at 1245 + 113 (badge 1358), the AGENTS Badge
  stock note, session_125.md, this record, both worklogs, the F-66a2
  errata in session_123.md.
- **Ship**: commit on main + the SSH-wrapper v3 push (with --remote
  git@github.com:nordeim/neo-crm.git) + the remote verification + the
  operator key shredded.
