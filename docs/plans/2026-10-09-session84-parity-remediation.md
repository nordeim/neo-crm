# Session-84 Parity Remediation Plan (2026-10-09)

Session 84 on `main` @ `19f04ad` (the s83 ship `294b4f5` + the
session-log commit, docs-only — `docs/session_163.md`, ZERO code
drift). The workspace was RE-CLONED fresh (the sandbox reset); the
environment rebuilt (.env with `DATABASE_URL="file:../db/custom.db"` + a
fresh openssl AUTH_SECRET; bun install; db:push/db:seed; census MATCH
15/24/10/23/12 + 4 users). The documented intake hazard STANDS (the
platform `DATABASE_URL` override; all session-84 repo operations run
under `env -u DATABASE_URL`). **Baseline gate on HEAD: lint 0/0
(enforced) · tsc 0 · 1649/1649 unit (92 suites) · build clean ·
132/132 e2e on a fresh CI=1 boot (3.2m; all 9 mobile-nav checks
green).** The `skills/` exclusion verified in all three configs
(unchanged).

## The standing layers (80th session, NO APP DRIFT)

Drift sweep #80: the APP bundle still served byte-identical from
`/assets/index-DZ-xbrIm.js` — size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` exact — **the 55th consecutive
stable session** (the app stylesheet `index-Be9epoFc.css` 79,581 bytes
exact too). The login HTML still rides ONLY the `/static/*` platform
family (37 modulepreloads, zero `/assets` refs) and the LIVE app
post-login loads ONLY the old `/assets` pair — the documented non-drift
pattern unchanged from s83. Reference census #80 (agent-browser, live
login at 1512 then a TRUE 390px viewport): the demo data still zero
(the $0.0k KPI family); the mobile-nav defect STANDS at a TRUE 390px
(vw=390, nav w=0, 8 links in DOM, 0 visible); desktop nav normal
(256px, 8 links, all visible). Our mobile drawer stays the deliberate
documented superset.

## The audits (two parallel subagents + the orchestrator's own fresh-eyes rotation, every parity claim decoded from the byte-stable 1.63MB reference bundle + LIVE-probed where applicable)

**84-a** — the s83 re-audit: **12/12 checklist items GENUINE, ZERO
material findings** (every S83-P1..P7 fix verified at exact file:line
[buttonIcon :465 + its 7 consumers; the dashboard Filter svg; the
quick-log map + the whatsapp default variant; the four placeholders;
the "accounts" tab id + the reports-content id; the bare Load button;
the two AGENTS carriers absent]; the new suite 30 its + 30/30 green;
the two re-anchors; the docs at SKILL v1.80.0/README 1781/the
1649+132 four; the screenshots byte-exact; the commit 18 files zero
strays). 4 nano notes: N-84a2 the PAD:774 "4 spec files" stale carrier
(HEAD has 3 .spec.ts — the count carrier re-derivation is folded into
this session's docs pass); N-84a1/a3/a4 handoff/path-drift/cosmetic
classes (no repo action).

**84-b** — the graduation audit: **ZERO graduations, 12/12 (the 41st
consecutive)** — every standing ledger rationale verified UNCHANGED at
HEAD. **The 8 mechanical censuses 8/8 CLEAN** (the localStorage 2-key
set; public/ og-image only; the 19/19 deps; the 27-route/39-handler
API census all consumed; the 3-var env parity; the doc anchors at
1649/132 + README 1781; zero commented-out code; the 5 annotated e2e
sleeps). Both operator decisions' evidence INTACT.

**84-c** — the fresh-eyes rotation on the **ACCOUNTS INSIGHTS-DIALOG
FAMILY** (the standing session_163 suggested target — "the
unresolvable-in-bundle icon identities" NOW RESOLVED: the byte-stable
bundle decodes the stat-card aliases cleanly at their tr() assignment
lines — `Wc=tr("TrendingUp",bJ)` + `op=tr("Target",vJ)` +
`q0=tr("Users",SJ)`, the s76 playbook trick; the s28-era decode never
walked them). Full decode of the reference's Ece dialog + the LIVE
pre-fix probe on our dev server (Al Noor Manufacturing + Falcon
Analytics). The foundations SOLID (the vo/xo/yo dialog chrome — the
s15 stock family; the ot Card + ct CardContent trio computed-equal
over `p-4 text-center` — the s83 precedent; the `grid grid-cols-3
gap-4 mb-6` KPI grid; the stat values computed-equal — the `$X.XM`
jsx-array form + the notLostCount quirk + the contacts count; the
i1/Gg/ta/ra tabs construction computed-equal — the segmented track's
twMerge-resolved `grid w-full grid-cols-3` form + the stock trigger's
`data-[state=active]` trio + the panel shells; the activities rows'
`flex items-start gap-3 p-3 border rounded-lg` + the w-10 h-10 icon
boxes + the F-47b lowercased tint ternaries; the empty-state trio
verbatim; the N-48b badge display-case + the N-51c/s31 joins
documented standing) — **the N-84 family: 3 M + 2 L + 1 N**:

- **M-84c1 CONFIRMED (bundle: the Wc assignment + the LIVE probe)** —
  THE TOTAL-REVENUE STAT ICON: the reference ships
  `c.jsx(Wc,{className:"w-6 h-6 mx-auto mb-2 text-blue-600"})` where
  `Wc=tr("TrendingUp",bJ)` (the polyline `22 7 13.5 15.5 8.5 10.5 2
  17` + `16 7 22 7 22 13` — the lucide TrendingUp glyph,
  byte-identical in our lucide 0.525). OURS ships
  `<Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />`
  (LIVE-pre-fix: `lucide-users` 24x24 on the blue card). The s28
  header comment documents the stat cards WITHOUT icon identities —
  the s28 decode never resolved the aliases.
- **M-84c2 CONFIRMED (bundle: the op assignment + the LIVE probe)** —
  THE OPEN-DEALS STAT ICON: the reference ships
  `c.jsx(op,{className:"w-6 h-6 mx-auto mb-2 text-green-600"})` where
  `op=tr("Target",vJ)` (the three concentric circles r=10/6/2 — the
  lucide Target glyph). OURS ships
  `<Phone className="w-6 h-6 mx-auto mb-2 text-green-600" />`
  (LIVE-pre-fix: `lucide-phone` 24x24 on the green card).
- **M-84c3 CONFIRMED (bundle: the Ll construction + the twMerge
  resolution + the LIVE probe)** — THE CONTACTS INITIALS BOX: the
  reference ships the STOCK AVATAR PRIMITIVE —
  `Ll` = the Radix Avatar.Root wrapper
  (`Bt("relative flex h-10 w-10 shrink-0 overflow-hidden
  rounded-full", e)`) with the tint classes appended
  (`w-10 h-10 bg-blue-100 text-blue-600 flex items-center
  justify-center text-sm font-semibold`) — twMerge resolves the pair to
  `relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full
  bg-blue-100 text-blue-600 items-center justify-center text-sm
  font-semibold` — a 40×40 ROUNDED-FULL CIRCLE. OURS ships a bare
  SQUARE div (`w-10 h-10 bg-blue-100 text-blue-600 flex
  items-center justify-center text-sm font-semibold` — LIVE-pre-fix:
  radius 0px, position static, overflow visible). The topbar's s17
  two-level avatar is the house precedent for the stock-mirror form.
- **L-84c4 CONFIRMED (bundle: the zn call + the LIVE probe)** — THE
  DEALS BADGE: the reference ships
  `c.jsx(zn,{className:"mt-1 text-xs",children:d.stage})` — the zn
  Badge with NO variant and NO color map: the DEFAULT dark variant
  (`bg-neutral-900 text-neutral-50` under the s66 stock mirror) with
  the RAW stage slug. OURS ships
  `<Badge className={`mt-1 text-xs ${OPP_STAGE_META[d.stage]?.badge ??
  ""}`}>` (LIVE-pre-fix: `bg-blue-100 text-blue-800` on
  "prospecting"). The colored-map family is the reference's OWN
  DASHBOARD badge (its Recent Deals `zn` rides its `P[N.stage]` map) —
  NOT its insights badge; our dashboard surface keeps the map
  (pin-pinned by dashboard-contracts).
- **L-84c5 CONFIRMED (bundle: the qd assignment + the LIVE probe)** —
  THE ACTIVITIES FALLBACK ICON: the reference's icon ternary renders
  `nf` (Mail) for Email, `af` (Phone) for Call, else `qd` where
  `qd=tr("Calendar",jQ)` — the BLANK-BODY calendar glyph (`M8 2v4` +
  `M16 2v4` + rect(18×18 at 3,4 rx 2) + `M3 10h18`), the same glyph
  the s17 sidebar census fixed. OURS ships `<CalendarDays
  className="w-5 h-5" />` (LIVE-pre-fix: `lucide-calendar-days` 20px
  on the meeting row) — the s28 header comment's own "CalendarDays"
  claim misread the alias.
- **N-84c6 CONFIRMED (bundle-verbatim)** — THE INITIALS UPPERCASE:
  the reference renders
  `d.name.split(" ").map(g=>g[0]).join("")` — NO `.toUpperCase()`, NO
  fallback. OURS ships the local `initials()` helper with
  `.toUpperCase()`. Behavior-identical on the capitalized seed (the
  display computes "JD" both ways for "John Doe") — a source-parity
  mirror (the topbar's "the FORMULA is the parity" precedent).

## The operator decisions (44th re-affirmation)

The **CSV formula-injection posture (b) STANDS** — the 84-b
re-verification: `guardFormulaPrefix` intact at csv.ts:31-33 applied in
`escapeCell` AND imported into entity-export.ts's `qq`; the `-`
exclusion documented; ZERO new unguarded builders. The insights family
builds no CSV surface — no new evidence moves the (a) parity / (c)
full-OWASP alternatives.

The **source-vocabulary documented parity STANDS** — the 84-b census
re-confirmed every anchor at file:line. The insights family introduces
NO vocabularies (the ACTIVITY_TYPE_META label map + the raw stage slug
are the existing pinned sets; the badge's raw `d.stage` render is the
reference's own form, and the stage VOCABULARY itself is untouched).

## The remediation set (TDD — RED first, then GREEN)

- **S84-P1 (M-84c1 + M-84c2)** — the stat-card icons: the Total
  Revenue card `<Users …text-blue-600>` → `<TrendingUp …>`; the Open
  Deals card `<Phone …text-green-600>` → `<Target …>`; the Contacts
  card keeps `Users` (…text-purple-600 — the reference's own q0). The
  lucide import line updated (`Calendar, Mail, Phone, Target,
  TrendingUp, Users` — Phone stays for the call rows); the s28 header
  comment's stat-card line re-derived with the three identities.
- **S84-P2 (M-84c3 + N-84c6)** — the contacts initials box: the bare
  square div → the reference's stock-Avatar resolved construction — a
  span carrying `relative flex h-10 w-10 shrink-0 overflow-hidden
  rounded-full bg-blue-100 text-blue-600 items-center justify-center
  text-sm font-semibold` (the twMerge-resolved form, with a comment
  documenting the reference's two-part construction) + the initials
  formula verbatim (`c.name.split(" ").map((w) => w[0]).join("")` —
  the reference's own expression, no uppercase, no fallback); the
  local `initials()` helper RETIRED (its only consumer was the box).
- **S84-P3 (L-84c4)** — the deals badge:
  `<Badge className="mt-1 text-xs">{d.stage}</Badge>` (the bare
  DEFAULT variant + the raw slug — the reference's own form); the
  `OPP_STAGE_META` import retired from the file (ACTIVITY_TYPE_META
  stays — the activities badge is the N-48b documented surface).
- **S84-P4 (L-84c5)** — the activities fallback icon:
  `<CalendarDays className="w-5 h-5" />` → `<Calendar className="w-5
  h-5" />` (the blank-body glyph — the s17 sidebar precedent); the
  import swap.
- **S84-P5 (the tests)** — the NEW `tests/insights-parity.test.ts`
  (the RED-first pin set: the three stat-icon identities with the
  w-6 h-6 mx-auto mb-2 + tint classes verbatim + the two negatives
  [no Users-on-blue, no Phone-on-green]; the initials box's
  stock-avatar class family [rounded-full + relative + overflow-hidden
  + shrink-0] + the verbatim formula + the toUpperCase negative; the
  deals badge's bare construction + the OPP_STAGE_META-in-file
  negative; the fallback Calendar glyph + the CalendarDays negative)
  + the green-by-design anchors (the standing computed-equal surfaces:
  the shell trio, the KPI grid + the three card bodies, the `$X.XM`
  + notLostCount value formulas, the segmented tabs construction +
  the stock trigger's active trio, the activities tint ternaries +
  the F-47b lowercase comparisons, the empty-state trio, the Close
  Date string + the open-deals filter, the documented join family)
  + the RE-ANCHOR of `tests/insights-vocabulary.test.ts` (the
  `<CalendarDays className="w-5 h-5" />` pin → the `<Calendar …>` form
  + the header comment's "CalendarDays for the rest" + "the purple
  CalendarDays fallback" wording re-derived).
- **S84-P6 (the doc carriers)** — the dialog's s28 header comment
  fully re-derived (the three stat-card icon identities, the
  stock-avatar initials box + its verbatim formula, the bare default
  deals badge, the blank-body Calendar fallback); the AGENTS.md
  insights entry extended with the same four facts (the entry is not
  wrong today — it is silent on them; the precision extension keeps
  the next rotation from re-deriving); the PAD:774 "4 spec files"
  stale carrier re-derived (the 84-a N-84a2 catch) + the PAD inventory
  row for the new suite + the counts.

No new e2e: every fix surface is class/glyph-level (all the insights
e2e locators are role/text-based — verified: the S28-P6 dialog test by
role+name, the S76-P13 opps smoke by text; the badge still renders the
stage text, the tab labels unchanged). The unit pins + the LIVE
computed-probe battery cover the family (the s76–s83 precedent for
styling-only rotations).

## Blast radius (pre-checked)

The pins that RE-ANCHOR in lockstep: `tests/insights-vocabulary.test.ts`
(the CalendarDays icon pin + the two header-comment wordings — the
L-84c5 fix). SURVIVES untouched: `tests/account-surfaces.test.ts`
(all 7 s28 insights pins — the tints, the shell, the header badge
classes, the Close Date; none pin the stat icons, the box shape, the
badge map, or the fallback glyph), `tests/insights-badge-case.test.ts`
(the ACTIVITY_TYPE_META display-case — the ACTIVITIES badge, a
different surface), `tests/contact-photo.test.ts:186` (the shell cap),
`tests/dashboard-contracts.test.ts:235` (the dashboard's OPP_STAGE_META
P-map — a different surface that KEEPS the map), `tests/
dead-code-hygiene.test.ts` (the reports-page OPP_STAGE_META label pin
— a different surface), the e2e family (132 unchanged — role/text
locators only). The GREEN-hazard sweep: TrendingUp/Target/Calendar are
lucide 0.525 exports (verified); the OPP_STAGE_META import retirement
leaves zero dead references in the file (ACTIVITY_TYPE_META stays);
the local `initials()` helper is module-local (zero external
consumers — verified); the toUpperCase retirement touches no other
file (the Avatar PRIMITIVE's own initialsOf is a different seam, used
by the accounts-page row trigger — untouched); no test pins the
insights dialog's import lines (verified by grep).

## The execution record (2026-10-09, session-84)

EXECUTED AS PLANNED, zero mid-flight repairs — the first since s80's
zero-repair run. RED: **12 failed exactly** (the new insights-parity
suite's 11 + the re-anchored insights-vocabulary pin's 1; the
green-by-design anchors all passing through RED as designed).
Non-vacuousness PROVEN at the pre-fix state (only the test files
modified): the full suite ran **12 failed | 1658 passed (1670 total)**
— exactly the modified-pin set, ZERO collateral. GREEN: S84-P1..P6
all landed (P1 the TrendingUp/Target stat icons + the import line;
P2 the stock-Avatar initials circle + the verbatim no-uppercase
formula + the local helper retired; P3 the bare default deals badge +
the OPP_STAGE_META import retired; P4 the blank-body Calendar
fallback + the import swap; P5 the suite + the re-anchor + the
vocabulary header comment; P6 the s28 dialog header comment fully
re-derived + the AGENTS entry extension). GATE: lint 0/0 · tsc 0 ·
**1670/1670 unit (93 suites, +21)** · build clean · **132/132 e2e on
a fresh CI=1 boot (3.3m; the FIRST run green — no flakes; all 9
mobile-nav checks green)**. LIVE: the three stat icons 24px; the
initials circle (rounded-full/relative/hidden/shrink-0, 40×40, "TN");
the deals badge (the dark stock primary lab(7.78) ≈ #171717 +
neutral-50 + the raw "prospecting"); the blank-body calendar fallback
20px; the drawer at TRUE 390px (full-bleed, 8 links, dual
scroll-lock, focus inside, navigate-close + locks released, closed
inert+hidden); zero overflow; the closing census MATCH (db pristine +
the reference md5-exact, re-fetched). Screenshots 107 (the insights
stat icons + the activities rows) + 108 (the contacts initials
circles) NEW — VLM 4/5 + 4/4 PASS (the 107 (4) note is the correct
type-map: Phone on the call row, Calendar on the meeting row). Docs:
SKILL v1.81.0 (§16bx + project_state, via the assert-first
`scripts/skill_edits_s84.py` at the sandbox root) + README badge 1802
+ the suite list + AGENTS/CLAUDE/PAD at 1670+132 (+ the PAD s84
inventory row + the Total 93/1670 + the N-84a2 "4 spec" carrier
re-derived) + session_165.md + this record + the repo worklog;
`.env`/`.env.example` verified (no env surface change). Estimate
drift: +21 its exact (the new suite's 21) · 132 e2e exact · the
e2e-waits census unchanged at 5.
