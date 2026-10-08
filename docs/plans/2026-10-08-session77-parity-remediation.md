# Session-77 Parity Remediation Plan (2026-10-08)

Session 77 on `main` @ `d6b4668` (the s76 ship `917b38f` + one
docs-only session-log commit — `docs/session_148.md`, ZERO code drift).
The workspace SURVIVED s76: the environment verified in place (`.env`
with `DATABASE_URL="file:../db/custom.db"` + the db/ folder at the repo
root; census MATCH 15/24/10/23/12 + 4 users). The documented intake
hazard STANDS (the platform `DATABASE_URL` override points at a
non-existent mirror; all session-77 repo operations run under
`env -u DATABASE_URL`). **Baseline gate on HEAD: lint 0/0 (enforced) ·
tsc 0 · 1457/1457 unit (85 suites) · playwright --list 132 in 4 files**
— the documented state exact; the `skills/` exclusion verified in all
three configs (eslint ignores + tsconfig exclude + vitest include-scope).

## The standing layers (73rd session, NO DRIFT)

Drift sweep #73: the reference bundle fresh-fetched — size 1,631,071 +
md5 `a70a637fcf1d4291da8e0d965676dc11` **exact — the 48th consecutive
stable session**. Reference census #73 (agent-browser, live login at
1280 then a TRUE 390px viewport): the demo data still zero (the KPI
values $0.0k/$0.0k/$0k); the mobile-nav defect STANDS at a TRUE 390px
(vw=390, nav w=0, 8 links in DOM, 0 visible, no hamburger); desktop
nav normal (256px, 8 links, all visible). Our mobile drawer stays the
deliberate documented superset.

## The audits (three parallel agents + the orchestrator's manual
validation of every claim at file:line, the parity claims BUNDLE-DECODED
against the fresh-fetched reference)

**77-a** — the s76 re-audit: **15/15 claims GENUINE** (every S76-P1..P13
fix at file:line; the counts corroborated by live runs [85 suites, 1457
its, playwright --list 132, tsc 0, lint 0/0]; the 917b38f commit honest
[28 files, +1598/−326, zero strays]). Six nano notes (bookkeeping only):
the vx initials/title fallbacks carry an extra `a.contact?.name` arm;
the TrendStatCard down-glyph rides a separate `trendDirection` prop;
the 42-cell grid is a hand-rolled loop (computed-equal); the today pill
+ Event submit render via tokens (computed-equal, the documented v4
hazard); the Event textarea has no explicit rows; two composition
sub-tallies are phrased differently across carriers.

**77-b** — the graduation audit: **ZERO graduations, 13/13 (the 34th
consecutive)**; the 8 mechanical censuses 7 CLEAN + **ONE finding**:
`AGENTS.md:29` (the gate-order paragraph) still carries the stale
`(1417)`/`(131)` pair — unchanged since pre-s76 — while every other
carrier (README badge 1589, AGENTS:20-21, CLAUDE, PAD totals) carries
1457/132. A one-line docs fix (S77-P13). Both operator decisions'
evidence INTACT (see below).

**77-c** — the fresh-eyes rotation on the LEADS-PAGE FAMILY (the
session_147 suggested target — the s29/s31-era interactive table, never
a dedicated rotation; leads-page 822 + lead-filters 175 + the Gke
popover + the Sm KPI cards + the Xke charts row + the Tke/Mke dialogs +
both leads routes + the seams): the foundations SOLID (the page shell,
the six KPI derivations byte-verified, the toolbar/search, the popover's
trigger/fields/footer, the table chrome + sticky thead + column hiding +
the orange Target box, the inline-edit family, the row menu, the charts,
the export, the create dialog, the edit dialog body, both API routes
ZERO findings) — the **N-77 family: 4 M + 6 L + 7 N**, every M/L claim
re-decoded from /tmp/ref-bundle-check.js and manually validated by the
orchestrator before acceptance (component identities: Qke page + Gke
popover + Sm card + Xke charts + Tke create + Mke edit; the icon
aliases resolved at their tr() assignments: Wc TrendingUp / op Target /
MB CircleCheckBig / BQ CircleX / nJ Percent / qd Calendar / l_
ArrowUpDown):

- **M-77c1 CONFIRMED** — the sortable-header icon family: the
  reference renders a STATIC `w-4 h-4` ArrowUpDown inside a bare
  `flex items-center gap-2` div on all three sortable th's
  (`["Lead Name", l_]` — no conditional); ours flips to
  ChevronUp/ChevronDown while active (the s29 comment
  bundle-falsified — the chevron flip is the CONTACTS page's s75-P6
  behavior, not the leads page's) + `inline-flex … tracking-wide` +
  the `text-subtle` tint on the inactive glyph.
- **M-77c2 CONFIRMED** — the wonVsLost series: the reference's r-memo
  buckets by **created_date** with
  `toLocaleDateString("en-US",{month:"short",year:"numeric"})` →
  **"Oct 2026"** labels, insertion-ordered over the sorted filtered
  list (NO stamp sort), capped `Object.values(i).slice(-6)`; ours
  buckets by `closedAt ?? createdAt`, labels "Oct" (no year),
  first-seen-stamp ascending, unbounded.
- **M-77c3 CONFIRMED** — the missing "Loading..." row: the reference
  renders `A ? <colSpan-9 text-center py-8 text-gray-500 "Loading...">
  : B.length===0 ? <"No leads found"> : rows` (A = the query's
  isLoading); ours renders only the empty ternary — the cold load
  flashes "No leads found" while `leads` is `[]`.
- **M-77c4 CONFIRMED** — the EntityEditDialog submit: the reference's
  Mke ships the UNCLASSED stock default (its in-dialog `--primary` =
  the stock shadcn dark rgb(23,23,23) — the S8-7/DIALOG_SUBMIT pin);
  ours renders our default variant `bg-primary` #2563eb BLUE on all
  three edit dialogs (one shared component — the create dialogs
  already carry DIALOG_SUBMIT.button; only the edit arm is missing
  it).
- **L-77c5 CONFIRMED** — the create dialogs' pending label: the
  reference renders `n?"Creating...":"Create Lead"` (and "Create
  Account"/"Create Contact" — all three bundle hits); ours renders
  "Saving..." on the three create submits. (The Event/Activity
  dialogs keep "Saving..." — the s76 bundle-verified pair.)
- **L-77c6 CONFIRMED** — the Sm KPI-card anatomy: the reference's chip
  is the CLASS-PAIR map `{blue:"bg-blue-50 text-blue-600", green:…,
  orange:…, red:…, purple:…, cyan:…}`, the icon
  `w-4 h-4 sm:w-5 sm:h-5`, the label `text-xs sm:text-sm text-gray-600`,
  the subValue `text-xs sm:text-sm text-gray-500 mt-1`; ours ships the
  alpha-tint style chip (`${color}1a` + the -500 glyph), fixed
  `h-5 w-5` icons, `text-muted` labels, and the font-medium subValue
  without mt. PLUS the Avg-cycle card: the reference's cyan pair
  (cyan-600 #0891b2) vs our teal #14b8a6.
- **L-77c7 CONFIRMED** — the Min Deal Value semantics: the reference
  stores the RAW STRING (`t("minValue", d.target.value)`) and filters
  `!g.minValue || X.value && X.value >= parseFloat(g.minValue)` — a
  typed "0" is a truthy string → "(Active)" shows AND zero-value
  leads are excluded; fractions are not floored. Ours floors to a
  non-negative integer and skips at `minValue > 0`.
- **L-77c8 CONFIRMED** — the search TRIM: the reference matches
  `X.name?.toLowerCase().includes(e.toLowerCase())` — the raw query,
  untrimmed; ours `search.trim().toLowerCase()`.
- **L-77c9 CONFIRMED** — the sort comparator: the reference compares
  raw code units (`te<fe?…:te>fe?…:0` — case-sensitive,
  uppercase-first) with created_date the only Date-coerced key; ours
  `localeCompare`s name/email. PLUS the D-toggle decoded fresh: the
  reference starts EVERY new key at "asc" (`l===z ? p(d==="asc"?
  "desc":"asc") : (f(z), p("asc"))`); ours special-cases
  `createdAt → "desc"` on a new key.
- **L-77c10 CONFIRMED** — the filters-popover chrome: the reference's
  stock PopoverContent base is `z-50 w-72 rounded-md border bg-popover
  p-4 text-popover-foreground shadow-md …` with `sideOffset: 4` (the
  call site adds w-80 + align start); our ui DropdownContent ships
  `shadow-lg` + `sideOffset 6` (the call site already fixes
  rounded-md/p-4/w-80). Visible delta: shadow-lg vs shadow-md + 2px
  offset.
- **N-77c11 CONFIRMED (scoped)** — the S10-2 SELECT_TRIGGER pin is
  bundle-falsified on the FOCUS model: the reference's stock trigger
  base is `flex h-9 w-full items-center justify-between … focus:outline-
  none focus:ring-1 focus:ring-ring` — plain `focus:` (the ring FIRES
  on mouse click) and `w-full` IN the base. Our Button + Input bases
  are `focus-visible:` on BOTH apps (byte-verified this session) —
  the divergence is Select-specific. Every current surface computes
  equal widths (our per-surface w-full additions compensate), so the
  fix is the focus classes + the pin/comment model correction; the
  w-full base stays per-surface (documented, computed-equal).
- **N-77c12 CONFIRMED (partial)** — the create-dialog micro-supersets:
  ours adds `min={0}` on the Estimated Value input (the reference's
  value inputs carry no min) + sends `value: 0` when empty (the
  reference sends undefined — computed-equal through our route's
  `asNumber(body.value) ?? 0` default) + `ld-*` ids (invisible,
  htmlFor-paired). FIX: the min={0} retires; the payload + ids stay
  documented supersets.
- **N-77c13 CONFIRMED (keep)** — the default-lead-stage: the
  reference's Settings STORES `default_lead_stage` but Tke HARDCODES
  `status:"new"` (a dead setting there); ours consumes the setting —
  the functional superset, documented in-code this session.
- **N-77c14 CONFIRMED** — the crm-store updateLead comment claims
  "the reference's React-Query cache updates instantly" — the
  reference's M is a plain `P.mutate({id,data})` + invalidate-on-
  success (NOT optimistic). Our local-apply construction stays right
  (per-keystroke controlled inputs need it); only the comment's
  rationale re-anchors.
- **N-77c15** — the reference's own dead code (Gke's never-read
  `useState("")`) — informational, nothing to mirror.
- **N-77c16 CONFIRMED (rides L-77c6)** — the Won/Dropped subValues:
  the reference renders `$${H.wonValue.toLocaleString()}` (up to 3
  fraction digits — "$50.5"); ours formatCurrency (0 decimals).
- **N-77c17 DEFERRED** — the stock TableHead color: the reference's
  `text-muted-foreground` #737373 vs our `text-muted` #6b7280 — one
  shade on EVERY table family-wide (the shared stock, pinned
  pre-bundle). A family-wide token-role question — documented for a
  future session, not this family's scope.

## The operator decisions (36th re-affirmation)

The **CSV formula-injection posture (b) STANDS** — the 77-b
re-verification: `guardFormulaPrefix` intact at csv.ts:31-33 applied in
`escapeCell` AND imported into entity-export.ts's `qq`; the `-`
exclusion documented; **ZERO new unguarded builders** (the 77-c
rotation re-verified the leads family's export end-to-end — the
`leads_` 8-col client-side blob routes through the guarded
`unquotedHeaderCsv` seam; the raw-dump header + the static templates
are the documented exclusions); the reference bundle byte-stable for
the 48th consecutive session; no new evidence moves the (a) parity /
(c) full-OWASP alternatives.

The **source-vocabulary documented parity STANDS AND EXTENDS to the
leads family** — the 77-b census re-confirmed every anchor at
file:line (CONTACT_SOURCE_OPTIONS/LEAD_SOURCE_OPTIONS pinned with the
in-file posture comments; NO enum-membership on the four validation
sites; the settings Capitalized defaults verbatim); the 77-c rotation
decoded the family's vocabularies fresh (LEAD_FILTER_STATUS_OPTIONS
5+all / LEAD_FILTER_SOURCE_OPTIONS 5+all with Referral popover-only /
the 4+4 dialog sets / the 5-option inline set / LEADS_FUNNEL labels +
fills — all byte-verified). The M-77c5 "Creating..." change is display
vocabulary; wire values stay raw.

## The remediation set (TDD — RED first, then GREEN)

- **S77-P1 (M-77c1 + L-77c9 + the D-toggle) — the sortable-header
  family**: all three sortable headers render the STATIC `h-4 w-4`
  ArrowUpDown (the chevron ternary + the `text-subtle` tint retire);
  the button container goes `flex items-center gap-2` (inline-flex +
  tracking-wide retire — our th>button accessible superset stays);
  the comparator goes raw code-unit for name/email
  (`a.name < b.name ? -1 : a.name > b.name ? 1 : 0`); the D-toggle
  drops the createdAt→desc special case (a new key always starts
  "asc"); SortHead simplifies (the active/dir props retire) + the
  s29 comment re-anchors.
- **S77-P2 (M-77c2) — the wonVsLost rewrite**: the reference's r-memo
  verbatim — bucket by `createdAt`, the
  `toLocaleDateString("en-US",{month:"short",year:"numeric"})` label,
  insertion order over the sorted filtered list (NO stamp sort), the
  `slice(-6)` cap; the signature becomes `(rows: Lead[])` (the won/lost
  filter moves inside — the insertion order must ride the merged sort);
  the dch:114-115 signature pin re-anchors in lockstep.
- **S77-P3 (M-77c3) — the Loading... row**: a page-local
  `leadsLoaded` flag (false until the page's `fetchLeads()` resolves —
  success OR failure, the s76 N-76c5 "Loading activities..." local-flag
  precedent); the tbody renders `!leadsLoaded ? <colSpan-9
  text-center py-8 text-gray-500 "Loading..."> : filtered.length === 0
  ? <"No leads found"> : rows`. The loading-layer pins untouched (no
  loadingFlags, no skeletons, "No leads found" retained).
- **S77-P4 (M-77c4)** — the EntityEditDialog submit gains
  `className={DIALOG_SUBMIT.button}` (the dark neutral-900 — spans all
  three edit dialogs).
- **S77-P5 (L-77c5)** — "Creating..." on the three create submits
  (Account :323 / Contact :599 / Lead :785); the Event/Activity dialogs
  keep "Saving..." (the s76 pair).
- **S77-P6 (L-77c6 + N-77c16) — the Sm card anatomy**: a new
  `STAT_CHIP_PAIRS` record in page-layout.ts (the six class pairs
  verbatim); the IconStatCard leads arm consumes it (the alpha-tint
  style chip retires on that arm; `tone` prop), the label goes
  `text-xs sm:text-sm text-gray-600`, the subValue goes
  `text-xs sm:text-sm text-gray-500 mt-1`; the six call sites pass
  tone KEYS + `w-4 h-4 sm:w-5 sm:h-5` icons (blue/orange/green/red/
  purple/cyan — the Avg-cycle card goes cyan); the Won/Dropped
  subValues go the `$${value.toLocaleString()}` raw form (with the
  `(l.value || 0)` mirror).
- **S77-P7 (L-77c7) — the Min Deal Value raw string**:
  `LeadFilters.minValue` becomes `string` (the DEFAULT "" — the
  reference's `{minValue: ""}` initial state); `asFilters` validates
  the string form; the input stores `e.target.value` verbatim (no
  floor); the predicate mirrors `!minValue || (l.value && l.value >=
  parseFloat(minValue))` (a typed "0" is ACTIVE and excludes
  zero-value leads — the reference's own quirk); the
  lead-filters.test.ts pins re-anchor in lockstep.
- **S77-P8 (L-77c8)** — the search drops the `.trim()`.
- **S77-P9 (L-77c10)** — the leads popover call site gains
  `shadow-md` + `sideOffset={4}` (the stock PopoverContent pair; the
  shared ui base stays — the dashboard/topbar supersets untouched).
- **S77-P10 (N-77c11 scoped) — the select-trigger focus ring**: the
  trigger's focus classes go `focus:outline-none focus:ring-1
  focus:ring-ring` (a new `SELECT_TRIGGER.focusRing` field — the ring
  fires on mouse click, like the reference); the S10-2 comment + the
  page-layout pin re-anchor (the "keyboard-only" claim falsified; the
  "NO base w-full" claim corrected-with-model — the computed-equal
  per-surface w-full stays); the INPUT/BUTTON focus-visible pins
  re-verified byte-equal on both apps (untouched).
- **S77-P11 (N-77c12 partial)** — the `min={0}` retires from the
  create-value input; the value-payload + id supersets documented.
- **S77-P12 (N-77c13 + N-77c14) — the comment re-anchors**: the
  default-lead-stage superset documented in-code (the reference's Tke
  hardcodes "new"); the crm-store updateLead comment re-derived (the
  reference is mutate + invalidate-on-success, NOT optimistic — our
  local-apply stays the right construction for per-keystroke edits).
- **S77-P13 (77-b's finding)** — `AGENTS.md:29` count fix: the stale
  `(1417)`/`(131)` pair → `(1457)`/`(132)`.

No new e2e this session: no standing e2e gap remains (the s76 closure
emptied the ledger) and the two timing-sensitive surfaces (the
Loading... row, the cold-load flag) are unit-pinned by the house
convention (the s76 activities Loading line precedent). The LIVE
battery covers the leads surfaces end-to-end.

## Blast radius (pre-checked)

The pins that RE-ANCHOR in lockstep: `tests/dead-code-hygiene.test.ts:
107-115` (the buildWonVsLost signature — S77-P2); `tests/lead-filters.
test.ts` (the minValue type/validation — S77-P7); `tests/page-layout.
test.ts:743-757` (the SELECT_TRIGGER pin + its "keyboard-only"
comment — S77-P10) + any page-layout pins on the leads-arm classes.
SURVIVES untouched: the loading-layer pins (no loadingFlags reference;
"No leads found" retained; the reports-only useState regex);
entity-edit-dialog.test.ts ("Save Changes"/"Saving..." retained — only
the color changes); the e2e family (the "Create Lead" button-name
locator — "Creating..." only renders while pending; the leads
pipeline/charts/create e2e shape-based; the 390px dialog full-bleed
e2e untouched); stat-value-contract (the leads VALUE form stays bare);
leads-inline-feedback (the inline-edit family untouched);
settings-profile-parity ("Saving..." — the profile button, untouched);
the mobile-nav 9-check suite; the topbar-rowmenu-parity suite. No pins
on: the sortable-header family, the wonVsLost derivations, the
Loading row, the create labels, the Sm chip pairs, the raw-string
minValue semantics, the search trim, the comparator, the popover
chrome, the focus classes, the min={0}.

## The execution record (2026-10-08, session-77)

EXECUTED AS PLANNED with TWO mid-flight pin-shape repairs (both caught
by the RED runs themselves, both on the NEW pins) + ZERO e2e repairs:
(1) the email-comparator pin's regex — the unescaped `??` parsed as a
lazy quantifier and matched nothing; re-escaped `\?\?`. (2) the
store-comment pin — the crmStore() helper strips comments, so the
"invalidate" assertion moved to a RAW read (the rationale lives in a
comment). RED: **40 failed exactly** (the leads-family-parity suite's
34 + the 4 green-by-design retained-surface anchors + the lead-filters
minValue re-anchors + the dch buildWonVsLost signature + the
page-layout SELECT_TRIGGER pin). Non-vacuousness PROVEN at the pre-fix
state (the worktree held ONLY the test-file changes): the full suite
ran **40 failed | 1455 passed** — exactly the modified-pin set, ZERO
collateral (all other 82 files green). GREEN: S77-P1..P13 all landed
(P1 the static glyphs + the comparator + the toggle; P2 the r-memo
rewrite (rows-signature, the dch pin re-anchored); P3 the leadsLoaded
flag + the colSpan-9 Loading row; P4 the DIALOG_SUBMIT edit submit;
P5 the Creating labels x3; P6 STAT_CHIP_PAIRS + the chipTone prop +
the six call sites + the cyan Avg-cycle + the toLocaleString
subValues; P7 the raw-string minValue (the interface + DEFAULT "" +
asFilters + the input + the truthy predicate); P8 the untrimmed
search; P9 shadow-md + sideOffset={4}; P10 SELECT_TRIGGER.focusRing +
the select.tsx consumption + the S10-2 comment/pin model correction;
P11 the min={0} retire; P12 the two comment re-anchors; P13 the
AGENTS:29 count fix). FOUR lockstep re-anchors (the predicted class).
GATE: lint 0/0 · tsc 0 · **1495/1495 unit (86 suites, +38)** · build
clean · **132/132 e2e on a fresh CI=1 boot (3.2m, all 9 mobile-nav
checks green)**. LIVE: the six chip pairs DOM-measured (cyan-600 on
Avg-cycle); the gray-600 labels + the 40px chips + the 20px icons; the
subValues $687,000/$226,000 (14px gray-500 mt-4px); the sortable
headers shipping exactly one svg each + the asc-on-new-key round-trip;
the wonVsLost ticks "May 2026"/"Jun 2026"; the edit submit computing
rgb(23,23,23); the min-value round-trip ("0" → "Filters (Active)", 24
rows; "50000" → 18); the padded " supply" search → the empty row; the
popover shadow-md computed; the select ring rgb(10,10,10) 1px on
focus; the Loading → Rows transition caught via MutationObserver; the
drawer at TRUE 390px (full-bleed, 8 links, focus inside); zero
overflow ×10; NO Tailwind v4 bug (shadow-sm 0 1px 2px + blur 4px
re-pins computing); the closing census MATCH (256px/8 links).
Screenshots 93 + 94 NEW — VLM 4/4 + 3/3 PASS. Docs: SKILL v1.74.0
(§16bq + project_state, 6928 → 6991, via the assert-first
scripts/skill_edits_s77.py at the sandbox root, + the STALE VERSION
HEADER REPAIR — in-file v1.70.0 since s70 while the records carried
v1.71.0-v1.73.0) + README badge 1627 + AGENTS/CLAUDE/PAD at 1495+132
(+ the PAD s77 inventory row) + session_149.md + this record + the
repo worklog; .env/.env.example verified (no env surface change).
Estimate drift: +38 its exact (the new suite) · 132 e2e exact · the
e2e-waits census unchanged at 5 (no new e2e — no standing gap, the
Loading-row/flag surfaces unit-pinned per the s76 precedent).
