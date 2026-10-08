# Session-83 Parity Remediation Plan (2026-10-08)

Session 83 on `main` @ `8838d5e` (the s82 ship `2472dd9` + the
session-log commit `8838d5e`, docs-only — `docs/session_162.md`, ZERO
code drift). The workspace was RE-CLONED fresh (the sandbox reset); the
environment rebuilt (.env with `DATABASE_URL="file:../db/custom.db"` + a
fresh openssl AUTH_SECRET; bun install; db:push/db:seed; census MATCH
15/24/10/23/12 + 4 users). The documented intake hazard STANDS (the
platform `DATABASE_URL` override; all session-83 repo operations run
under `env -u DATABASE_URL`). **Baseline gate on HEAD: lint 0/0
(enforced) · tsc 0 · 1619/1619 unit (91 suites) · build clean ·
132/132 e2e on a fresh CI=1 boot (3.2m, the FIRST full run green; all
9 mobile-nav checks green).** The `skills/` exclusion verified in all
three configs (unchanged).

## The standing layers (79th session, NO APP DRIFT)

Drift sweep #79: the APP bundle still served byte-identical from
`/assets/index-DZ-xbrIm.js` — size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` exact — **the 54th consecutive
stable session** (the app stylesheet `index-Be9epoFc.css` 79,581 bytes
exact too). The login HTML still rides ONLY the `/static/*` platform
family (37 modulepreloads, zero `/assets` refs) and the LIVE app
post-login still loads ONLY the old `/assets` pair (performance entries
verified) — the documented non-drift pattern unchanged from s82.
Reference census #79 (agent-browser, live login at 1280 then a TRUE
390px viewport): the demo data still zero (Total Leads 0 / Deals Closed
$0.0k / Revenue $0.0k / Sales Target $0k); the mobile-nav defect STANDS
at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible); desktop
nav normal (256px, 8 links, all visible). Our mobile drawer stays the
deliberate documented superset.

## The audits (two parallel subagents + the orchestrator's own fresh-eyes rotation, every parity claim decoded from the byte-stable 1.63MB reference bundle + LIVE-probed where applicable)

**83-a** — the s82 re-audit: **12/12 checklist items GENUINE** (the
Button base retirement + the 16 mr-2 sites + the Activity icon + the
datetime seam + the deals amount + the email row + the doc carriers +
the parity suite 20 its + the lockstep re-anchors + the docs carriers
at v1.79.0/1751/1619+132 + the screenshots + the commit honest [25
files, zero strays]). **ONE MATERIAL FINDING (M-83a1)**: the s82
export-family re-derivation MISSED the settings Data tab —
`settings-page.tsx` renders `<Download className={SETTINGS_DATA.
buttonIcon} />` on 7 buttons (`:248/:258/:268/:293/:300/:307/:314`) with
`buttonIcon = "h-4 w-4"` (`page-layout.ts:462`) — NO svg margin, an 8px
icon-text gap, while the file's OWN s72 comment
(`settings-page.tsx:279-281`) documents the reference's `cs` =
`w-4 h-4 mr-2` (16px). Unpinned by any test as the class value. Plus 5
nano notes: the AGENTS.md:187-190 iconGap carrier + the AGENTS.md:
684-686 neutralizer carrier + the page-layout.ts:448 SETTINGS_DATA
comment carrier (all three still documenting the RETIRED s9 mechanism
as current — the N-50a doc-carrier genus); the "11 already-carrying
sites" count undercount (the true census is 20: 8 mr-1 + 12 mr-2 —
bookkeeping); the two un-enumerated collateral surfaces (the activities
quick-log row + the dashboard Filter button — run down this session,
see M-83c2/M-83c3).

**83-b** — the graduation audit: **ZERO graduations, 12/12 (the 40th
consecutive)** — every standing ledger rationale verified UNCHANGED at
HEAD (F-47c, N-48c, N-48f, N-48j, N-51c, the stock-mirror KEEP, N-58c,
N-63b, the s63 foreign-docs retirement, the 19/19 deps [zero diff
since the s81 ship], the mobile-nav superset, F-46f/s46-P1 at its s71
re-anchored surface). **The 8 mechanical censuses 8/8 CLEAN**: the unit
count 1619/91, the e2e list 132 (11+111+9+1), the CSV guard suites
green (the guard-scoped set csv + csv-contract + csv-formula-guard +
entity-export = 49/49; guardFormulaPrefix intact at csv.ts:31-33 →
escapeCell → entity-export's qq), the source-vocabulary anchors (both
OPTIONS arrays + the four isBadString-only sites + the Capitalized
six), the e2e sleeps exactly 5 annotated, the SKILL frontmatter
v1.79.0/2026-10-08, the count carriers all at 1619/132/91 + README
1751, the db census MATCH. Both operator decisions' evidence INTACT.

**83-c** — the fresh-eyes rotation on the REPORTS FILTER-CARD FAMILY
(the standing session_159 alternate — s74 walked the page family
broadly but the filter card's own chrome + the surfaces it rides never
had a dedicated pass): the foundations SOLID (the lCe root Card chrome
twMerge-resolves to our computed-equal tokens; the row/selects/
selectWrap construction exact; the four selects' triggers + option
sets exact; the Calendar/User leading icons computed-equal; the Reset
placement + chrome exact; the Export CSV/PDF pair computed-equal; the
page header exact; the PAGE_KPI_GRIDS.reports exact; the ay KPI card's
chip/label/spark constructions computed-equal — the value's bare form
is the s69/s70 documented standing decision; the tabs strip's resolved
track + trigger forms exact; the n3e save dialog's box/columns/list
families exact; the y CSV + x PDF handlers computed-equal on values) —
plus the N-83a5 collateral sweep (the 83-a flag) decoding ALL THREE of
the reference's Filter-icon sites + the activities quick-log row —
**the N-83 family: 3 M + 1 L + 7 N**:

- **M-83a1 CONFIRMED (83-a's finding + the s72 comment's own
  contradiction)** — THE SETTINGS DATA-TAB MARGINS: the 7 export
  buttons' `<Download className={SETTINGS_DATA.buttonIcon} />` ships
  `h-4 w-4` (no margin — an 8px icon-text gap) while the file's own
  s72 comment documents the reference's `cs` = `w-4 h-4 mr-2` (16px).
  One record change fixes all 7. Pinned as current by
  `tests/page-layout.test.ts:1473` (`buttonIcon` toBe "h-4 w-4").
- **M-83c2 CONFIRMED (bundle-decoded at 1123817 + cross-census)** —
  THE DASHBOARD FILTER BUTTON: the reference ships
  `c.jsx(OC,{className:"w-4 h-4 mr-2"}),c.jsx("span",{className:"hidden
  sm:inline",children:"Filter"})` — the FilterPolygon glyph 16px WITH
  mr-2. OURS ships `<FilterPolygon className="h-3.5 w-3.5" />` — a
  2-fold divergence: 14px vs 16px AND no margin. Because this is an
  svg+SPAN construction, the old s9 base cascade fabricated the 8px
  margin here (an accidentally-right 16px gap) — the s82 base
  retirement REGRESSED the gap to 8px (the s82 census enumerated the
  "5 already-carrying mr-2 sites" including "FilterPolygon" but read
  the contacts/leads pair, missing the dashboard's own divergent
  classes). Unpinned (the only FilterPolygon pins assert the glyph +
  the three usages).
- **M-83c3 CONFIRMED (bundle-decoded at 972724)** — THE ACTIVITIES
  QUICK-LOG ROW: the reference's four header buttons (Log Call/Email/
  Meeting/WhatsApp) all ship their icon at `w-4 h-4 mr-2`
  (af=Phone/nf=Mail/qd=Calendar/LB=MessageSquare — our icon identities
  all match). OURS ships `<q.icon className="h-4 w-4" /> {q.label}` —
  the size matches but NO margin (svg + bare-text: the old only-child
  arm had nullified it to 0px since s9; the s82 retirement changed
  nothing here — still 0px, an 8px gap vs the reference's 16px).
  Unpinned (the quick-log pins assert the icon identities + the
  whatsapp chrome only).
- **L-83c4 CONFIRMED (bundle-decoded: the Ke default variant + the
  ghost merge)** — THE LOG WHATSAPP VARIANT: the reference rides the
  DEFAULT Button variant + `className:"bg-emerald-600
  hover:bg-emerald-700"` — the base's `text-primary-foreground` keeps
  the label WHITE on hover. OURS rides `variant="ghost"` +
  `ACTIVITY_QUICKLOG.whatsapp` ("bg-emerald-600 hover:bg-emerald-700
  text-white shadow") — the ghost's `hover:text-foreground` SURVIVES
  the twMerge (no conflict with text-white) and flips the label
  #0a0a0a on hover over the emerald surface. A hover-state divergence
  live-exercisable since the s80 hover un-wrap. Pinned as current by
  `tests/page-layout.test.ts:533-537`.
- **N-83c5 CONFIRMED (bundle-verbatim)** — THE FOUR SELECTVALUE
  PLACEHOLDERS: the reference's lCe selects carry
  `placeholder:"Date: This Quarter"` / `"Owner: All"` / `"Stage: All"`
  / `"Status: All"`; OURS ship no placeholder. Dead in BOTH apps (the
  controlled values are always set — the placeholders never render);
  mirror them for source parity (the FILTER_BAR.searchPlaceholder
  precedent).
- **N-83c6 CONFIRMED (bundle-verbatim)** — THE REPORTS TAB ID: the
  reference's fifth tab is `value:"accounts"`; OURS is
  `REPORT_TABS[4].id = "health"` (+ the `TabsPanel tab="health"`
  consumer). An invisible internal id (no URL state — the s24 census);
  mirror the reference's own id.
- **N-83c7 CONFIRMED (bundle-verbatim)** — THE LOAD BUTTON'S REDUNDANT
  CLASSNAME: the reference's save-dialog Load button is
  `Ke variant:"outline" size:"sm"` bare; OURS appends
  `className="h-8 px-3 text-xs"` — a literal duplication of the sm
  size. Retire the className.
- **N-83c8 CONFIRMED (bundle-verbatim)** — THE REPORTS-CONTENT ID: the
  reference's page root carries `id="reports-content"` (its own PDF
  capture hook); OURS captures `main` (the s25-pinned documented
  variant) with no id on the root. Mirror the id (zero-risk — no
  consumer collision; the reference's own hook).
- **N-83a1/a2/a3 (83-a's nanos)** — THE THREE STALE DOC CARRIERS:
  AGENTS.md:187-190 still documents `BUTTON_BASE.iconGap` +
  `[&_svg]:mr-2 [&_svg:only-child]:mr-0` as the CURRENT mechanism;
  AGENTS.md:684-686 still documents the userButton's
  `[&_svg]:mr-0` neutralizer ("must stay neutralized" — it retired at
  s82); page-layout.ts:448's SETTINGS_DATA doc-comment still says
  "the mr-2 gap rides BUTTON_BASE.iconGap" (the retired field — on
  exactly the M-83a1 surface). All three re-derive to the per-surface
  mechanism.

## The operator decisions (42nd re-affirmation)

The **CSV formula-injection posture (b) STANDS** — the 83-b
re-verification: `guardFormulaPrefix` intact at csv.ts:31-33 applied in
`escapeCell` AND imported into entity-export.ts's `qq`; the `-`
exclusion documented; **ZERO new unguarded builders** (the 83-b
downloadBlob sweep re-verified all 16 call sites trace to the guarded
seams; the 3 static-template sites are the documented s48 exclusion).
The rotation's decode of the reference's own `y` report builder
confirms it again: the reference builds its report CSV CLIENT-SIDE
with naive always-quote escaping and ZERO formula guarding — our
guarded route seam stays the deliberate documented superset. No new
evidence moves the (a) parity / (c) full-OWASP alternatives.

The **source-vocabulary documented parity STANDS** — the 83-b census
re-confirmed every anchor at file:line. The reports filter-card family
introduces NO vocabularies (the period/status/stage sets are the
existing pinned ones — re-verified byte-identical against this
session's fresh lCe decode; the owner list is the s31 distinct-string
memo).

## The remediation set (TDD — RED first, then GREEN)

- **S83-P1 (M-83a1 + N-83a3)** — the settings Data-tab margins:
  `SETTINGS_DATA.buttonIcon` → `"h-4 w-4 mr-2"` (one record change,
  all 7 buttons) + the `:444-452` doc-comment re-derivation (the
  icon class to the reference's own + the retired-field mention out).
  RE-ANCHOR: `tests/page-layout.test.ts:1470-1473` (the toBe + its
  comment).
- **S83-P2 (M-83c2)** — the dashboard Filter button:
  `<FilterPolygon className="w-4 h-4 mr-2" />` (the 16px + margin
  form; the glyph itself unchanged — the s17 hand-rolled polygon is
  the reference's own).
- **S83-P3 (M-83c3 + L-83c4)** — the activities quick-log row: the
  four svgs gain `mr-2` (`className="w-4 h-4 mr-2"`) + the WhatsApp
  button flips `variant="ghost"` → `variant="default"` +
  `ACTIVITY_QUICKLOG.whatsapp` → `"bg-emerald-600 hover:bg-emerald-700"`
  (text-white + shadow ride the default variant exactly like the
  reference's own construction; the page-layout.ts:586-591 comment
  re-derives). RE-ANCHOR: `tests/page-layout.test.ts:533-537` (the
  whatsapp toBe).
- **S83-P4 (N-83c5)** — the four SelectValue placeholders on the
  reports page's four selects (the reference's verbatim strings).
- **S83-P5 (N-83c6 + N-83c8)** — the tab id: `REPORT_TABS[4].id`
  "health" → "accounts" + the `TabsPanel tab="health"` consumer (+
  any `tab === "health"` conditional) + the page root gains
  `id="reports-content"`.
- **S83-P6 (N-83c7)** — the Load button's className retirement.
- **S83-P7 (N-83a1 + N-83a2)** — the two AGENTS.md carriers
  re-derived to the per-surface mechanism (the :187-190 Component
  anatomy entry + the :684-686 userButton entry).
- **S83-P8** — the new `tests/reports-filter-parity.test.ts` + the
  re-anchors: the RED-first pin set (the four placeholders via page
  reads; the REPORT_TABS ids via the constants read; the page root id;
  the Load button's bare construction; the buttonIcon mr-2 via the
  record read + the page consumption; the dashboard Filter svg
  classes; the quick-log svg classes ×4; the WhatsApp default-variant
  construction + the ghost negative; the three doc-carrier absence
  pins [AGENTS.md contains no "BUTTON_BASE.iconGap" and no
  "[&_svg]:mr-0"; page-layout.ts's SETTINGS_DATA comment names no
  iconGap]) + green-by-design anchors (the standing computed-equal
  surfaces: the bar chrome + token equivalences, the selects' trigger
  widths + option sets, the Reset/actions constructions, the header
  family, the KPI grid + the static spark + the bare value form's
  documented standing decision, the TABS_PILL track/trigger exact
  forms, the spark line-variant construction, the Current-Filters box,
  the saved-list family).

No new e2e: every fix surface is class/id-level (all e2e locators are
role/text-based — verified: the reports tabs by role+name, the
settings export buttons by name, the quick-log by name, the save
dialog by name); the tab-id change is internal state (no URL); the
placeholders never render. The unit pins + the LIVE battery cover the
family (the s76–s82 precedent for styling-only rotations).

## Blast radius (pre-checked)

The pins that RE-ANCHOR in lockstep: `tests/page-layout.test.ts:1470-
1473` (the SETTINGS_DATA.buttonIcon toBe + comment — the M-83a1 fix),
`:533-537` (the ACTIVITY_QUICKLOG.whatsapp toBe — the L-83c4 fix).
SURVIVES untouched: `:1976-1996` (the FilterPolygon glyph + usage
pins — the glyph is unchanged), `:575-578` (the quick-log group-wrap
pin — the actions wrapper), `:2049-2060` (the quick-log icon identity
pins), `:1458-1466` (the other SETTINGS_DATA pins), the
reports-page-parity suite (its pins don't touch the placeholders, the
tab ids, or the Load button — the export-icon pins at :361-373 ride
the s82 mr-2 family unchanged), the settings-data-tab suite (the
Trash2 pin at :111-117 is the Reset All Data button — a different
surface from the 7 Download buttons), the e2e family (132 unchanged —
see above), the contacts/leads FilterPolygon sites (already carrying
mr-2 — untouched). The GREEN-hazard sweep: the `w-4 h-4 mr-2` class
family already ships on 20+ sites (compiles); the "accounts" tab id
collides with nothing (grep `tab="health"` → the single TabsPanel +
the state type); `id="reports-content"` collides with nothing (no
other element carries an id in the page); the SelectValue placeholder
prop is a stock Radix prop (no kit change needed); the WhatsApp
default-variant flip changes no accessible name and no e2e assertion.

## The execution record (2026-10-08, session-83)

EXECUTED AS PLANNED + 4 mid-flight pin-shape repairs (the runs' own
catches — the house convention). RED: **15 failed exactly** (the new
reports-filter-parity suite's 13 + the page-layout re-anchors x2). The
four shape repairs: (1) the Reset last-child assertion initially
trimmed the segment against a `</Button>;` terminal that the real
source shape never produces — re-derived to the lastBtn/afterLastBtn
position assertions; (2)+(3) the two `require("@/lib/page-layout")`
calls — vitest runs ESM, `require` cannot resolve the alias (re-derived
to the suite's own `await layout()` pattern); (4) the KPI_CHIP_BG pin
read the map as classes (`bg-blue-50`) where the map carries the HEX
literals (`#eff6ff` — the chips ride an inline style). Non-vacuousness
PROVEN at the pre-fix state (only the test files modified): the full
suite ran **15 failed | 1634 passed (1649 total)** — exactly the
modified-pin set, ZERO collateral. GREEN: S83-P1..P7 all landed (P1 the
buttonIcon re-derivation + the comment; P2 the dashboard Filter
classes; P3 the quick-log margins + the WhatsApp default-variant flip
+ the record pair; P4 the four placeholders; P5 the "accounts" tab id +
the reports-content id; P6 the Load className retirement; P7 the two
AGENTS carriers). GATE: lint 0/0 · tsc 0 · **1649/1649 unit (92 suites,
+30)** · build clean · **132/132 e2e on a fresh CI=1 boot (3.2m; the
FIRST run green — no flakes; all 9 mobile-nav checks green)**. LIVE:
the 7 Data-tab buttons 16px gaps (was 8px); the dashboard Filter 16px
icon + 16px gap (the only s82 regression, closed); the quick-log x4 at
16px; the WhatsApp white-on-hover (:hover matching, rgb(255,255,255)
over emerald-700); the fifth tab round-trip; the reports-content id;
the drawer at TRUE 390px (full-bleed, 8 links, dual scroll-lock, focus
inside, navigate-close + locks released, closed inert); zero overflow
x10; the built CSS zero (hover: hover) wraps; the closing census MATCH
(db pristine + the reference md5-exact, re-fetched). Screenshots 105
(the activities quick-log row) + 106 (the reports filter card) NEW —
VLM 5/5 + 6/6 PASS. Docs: SKILL v1.80.0 (§16bw + project_state, via
the assert-first scripts/skill_edits_s83.py at the sandbox root) +
README badge 1781 + AGENTS/CLAUDE/PAD at 1649+132 (+ the PAD s83
inventory row + the Total 92/1649) + session_163.md + this record + the
repo worklog; .env/.env.example verified (no env surface change).
Estimate drift: +30 its exact (the new suite's 30) · 132 e2e exact ·
the e2e-waits census unchanged at 5.
