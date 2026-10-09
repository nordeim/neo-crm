# Session-88 Parity Remediation Plan (2026-10-09)

Session 88 on `main` @ `4e600ff` (the s87 ship `7f6bb36` + the
docs-only session-log commit that added `docs/session_172.md`). The
workspace SURVIVED s87 (the pull fast-forwarded; the environment
verified intact without a rebuild: node_modules present; `.env` with
`DATABASE_URL="file:../db/custom.db"` + a live `AUTH_SECRET`;
`.env.example` matching; `db/custom.db` + `db/e2e.db` present; the
census MATCH 15/24/10/23/12 + 4 users; vitest + playwright configured;
the `skills/` exclusion verified; the sitemap/robots/manifest handlers
re-verified live at 200 + the right content types). The platform
`DATABASE_URL` override hazard STANDS — all session-88 repo operations
run under `env -u DATABASE_URL`.

**Baseline gate on HEAD: lint 0/0 · tsc 0 · 1733/1733 unit (96 suites,
re-run live) · build + e2e deferred to the post-fix gate** (the
one-gate discipline; the 88-a subaudit re-ran the full unit suite live
at HEAD: 96 files, 1733/1733 green, plus the s87 suite 25/25; lint +
tsc re-verified by the orchestrator; the reference bundle was
re-fetched fresh and verified byte-stable FIRST).

## The standing layers (84th session, NO APP DRIFT)

Drift sweep #84: the APP bundle re-fetched fresh from the reference
and served byte-identical — `/assets/index-DZ-xbrIm.js` 1,631,071
bytes md5 `a70a637fcf1d4291da8e0d965676dc11` exact + the stylesheet
`index-Be9epoFc.css` 79,581 bytes exact — **the 59th consecutive
stable session**. The login HTML still rides the `/static/*` platform
shell; the LIVE app post-login loads ONLY the old `/assets` pair.
Reference census #84 (agent-browser, live login + a TRUE 390px
viewport): the demo data still zero (the $0.0k KPI family); the
mobile-nav defect STANDS at a TRUE 390px (vw=390, nav w=auto, 8 links
in DOM, 0 visible, no mobile menu — the 9th consecutive census);
desktop nav normal (256px, 8 links). Our mobile drawer stays the
deliberate documented superset (the LIVE battery re-verifies
post-fix).

## The audits (two parallel subagents + the orchestrator's own fresh-eyes rotation, every parity claim decoded from the byte-stable 1.63MB reference bundle + LIVE-probed on BOTH apps)

**88-a** — the s87 re-audit: **10/10 checklist items GENUINE, ZERO
material findings** (every s87 fix verified at exact file:line: the
suffix gray-600 at page-parts.tsx:191; the KpiCard Card/CardContent
split :176-203 + the tokens; the content-only Sparkline :591-634 +
the sparkClassName slot + the reports' bare slots; the six chart
headers; the filter-bar trio; the vacuous tier row retired; the
25-it suite re-run live 25/25; the full unit gate re-verified
96/1733; the doc carriers at v1.84.0/1865/1733+132). 2 nanos:
**N-88a1** — the api-robustness s43-P2 describe title still reads
"the NINE dead-??" while the it.each carries 8 rows post the N-87a1
tier retirement (the count-in-title genus); **N-88a2** — the
page-layout.test.ts:842 s11 comment still references the retired
KPI_CARD.card member.

**88-b** — the graduation audit: **ZERO graduations, 13/13 (the 45th
consecutive)** — every standing ledger rationale verified UNCHANGED at
HEAD (fresh line evidence in the s87-rewritten page.tsx where
relevant). The 8 mechanical censuses **8/8 CLEAN** (the localStorage
2-key set; public/ og-image only; the 19/19 deps; the 27-route/
39-handler API census; the 3-var env parity; the doc anchors at
1733+132/1865/v1.84.0; zero commented-out code; the 5 annotated e2e
sleeps + the mobile-nav suite intact at 9). Both operator decisions'
evidence INTACT. 1 nano: **N-88b1** — the s87 screenshots 115 + 116
are byte-identical duplicates (md5 `e92b0632…`, both 111,477 bytes —
the same capture under two names while session_172.md records
distinct VLM verdicts); re-capture a proper 116 this session.

**88-c** — the fresh-eyes rotation on the **CONTACTS FILTER-PANEL
(kke) + STAT-CARD FAMILY** (the standing session_171 first-listed
alternate — chosen over the leads stat-card family): the kke panel +
its Cke parent decoded from the byte-stable bundle + the LIVE panel
walked open on the reference (the sticky header, the six Card groups,
the checkbox rows), our dev server probed side-by-side, AND the
rotation surfaced a ROOT-CAUSE family beyond the page: a systematic
v3-vs-v4 palette comparison of every literal palette class used in
`src/` against the reference's compiled stylesheet.
**The N-88 family: 4 M + 3 L + 4 N** (+ the 3 audit nanos above):

- **M-88c1 — THE V4 PALETTE DIVERGENCE (the root cause, family-wide).**
  Tailwind v4's default palette is NOT v3's palette expressed in
  oklch — it was re-derived, and the chromatic families compute
  DIFFERENT colors: v4 blue-600 = `#155dfc` rgb(21,93,252) where the
  reference's v3 `bg-blue-600` = rgb(37,99,235) `#2563eb`; v4 red-600
  rgb(231,0,11) vs v3 rgb(220,38,38) (Δ38); green-400 Δ69;
  amber-400 Δ36; purple-600 Δ35; cyan-400 Δ34; green-500 Δ34 — the
  browser's own canvas pixel reads on our dev server vs the rgb
  triplets in the reference's compiled `index-Be9epoFc.css`. **56 of
  the 118 plain literal classes used in `src/` diverge visibly** (the
  gray/slate families by an imperceptible Δ≤3; the chromatic families
  by Δ5–69) — plus every `hover:`/`from:`/`via:`/`to:` form reading
  the same tokens. The S15-P12 note documented this hazard for ONE
  surface (the Event dialog submit → the token pair) but the family
  was never swept: the accounts Filter button ships the literal
  `bg-blue-600 hover:bg-blue-700` (LIVE `lab(44.06…)` where the
  reference computes rgb(37,99,235)); the s87-pinned spark bars
  (`bg-cyan-400`/`bg-green-400`) render v4's more-electric chroma;
  every `text-red-600` overdue surface, every `text-blue-600`
  link/icon, every badge map tint. The fix is the fifth member of the
  v4 re-pin family (shadow-sm s9 → blur-sm s10 → space-y s11/s14 →
  the hover-variant un-wrap s80): **the @theme v3-palette re-pin —
  91 tokens covering every literal (family, step) pair used in
  `src/`** (values from the standard v3 default palette, verified
  against the reference's compiled CSS on 97 rules with ZERO
  mismatches). The S15-P12 hazard comment re-derives (the hazard
  retires family-wide).
- **M-88c2 — THE TABLE'S LAST-ACTIVITY ICON: Zap → Activity.** The
  reference's bundle `AC=tr("Activity")` — the pulse icon — on every
  table row (`w-4 h-4 ${pe ? "text-red-500" : "text-green-500"}`);
  ours renders `Zap` (contacts-page.tsx:593). The M-82c2 slide-over
  fix's missed sibling (the s82 rotation fixed the detail panel's
  activity card but never walked the table row). LIVE-visible on
  every row.
- **M-88c3 — THE AWARD/CROWN PAIR.** The reference's `wT=tr("Award")`
  — consumed at BOTH the stat card's Top Decision Makers icon AND the
  name-cell amber overlay (`w-3 h-3 text-white` inside the
  `absolute -top-1 -right-1 w-5 h-5 bg-amber-400` box); the bundle
  contains NO Crown at all. OURS renders `Crown` at both sites
  (contacts-page.tsx:421 + :562). The M-84c1/c2 icon-identity genus
  (the s84 insights-dialog rotation's aliases resolved at their own
  tr() lines).
- **M-88c4 — THE SOURCE LABEL CASE.** The reference's kke Source
  group maps the RAW lowercase values but renders the label
  capitalized — `i.charAt(0).toUpperCase()+i.slice(1)` →
  Call/Email/Website/Partner/Referral — with the id staying
  `source-${i}` (lowercase). OURS renders `{o.value}` raw
  (call/email/…) — LIVE-visible on the panel (our walk:
  `["call","email","website","partner","referral"]` vs the
  reference's capitalized set).
- **L-88c5 — THE STAT CARD CONSTRUCTION** (the L-87c2/c3 genus — the
  missed structural underlayer). The reference's `Rx` component:
  `Card` (the stock component, `className="bg-gradient-to-br
  from-white to-gray-50"`) > `CardContent className="p-6"` > a
  `div.flex items-start justify-between` row > [`div.flex-1` (the
  label p + the value p + the trend row), the chip `div.p-3
  rounded-lg ${iconColor}` where iconColor is a CLASS STRING
  ("bg-blue-500"/"bg-green-500"/"bg-amber-500"/"bg-red-500") holding
  the `w-6 h-6 text-white` icon]. The trend row: `div.flex
  items-center gap-1` > [TrendingUp `w-4 h-4 text-green-600` |
  TrendingDown `w-4 h-4 text-red-600` + `span.text-sm font-medium
  text-{green|red}-600`] — the direction is a prop
  (trend/trendValue). OURS ships ONE merged div (the p-6 on the card
  itself, the flex directly on the card, no Card/CardContent), the
  chip via INLINE STYLE hex + `shrink-0` + `aria-hidden`, the trend
  row as a SPAN with a colorless aria-hidden icon and no down
  variant. The label/value p's match byte-exact (the s75 L-75c2-7
  decode); the construction, the chip mechanism, and the trend row
  diverge. The subValue prop is DEAD on this arm (only the leads arm
  uses it) and retires.
- **L-88c6 — THE EXPORT DISABLED BINDING.** The reference binds
  `disabled: $.length === 0` (the RAW list) and its export maps the
  RAW rows under the RAW zero guard; OURS maps RAW + guards RAW
  (correct, s26) but binds `disabled={filtered.length === 0}` — the
  s63 G-4/N-62e note kept it as "unresolvable LIVE (indistinguishable
  mirrors)" because the reference's demo data is zero; the BUNDLE now
  resolves it (the s76 bundle-beats-live-read lesson): `$.length===0`
  is the RAW list. LIVE-exercisable on the seed: search "zzz" →
  our Export CSV disables where the reference's stays enabled (15
  raw contacts). The same genus as the s86 L-86c4 accounts fix (the
  sibling that note deferred).
- **L-88c7 — THE mr-[500px] DETAIL SHRINK.** The reference's inner
  scroll area appends `mr-[500px]` while the Pke contact-detail
  slide-over is open — `className:\`flex-1 overflow-auto
  ${A?"mr-[500px]":""}\`` — pushing the table left so nothing hides
  under the 500px panel. OURS renders the static
  CONTACTS_LAYOUT.innerScroll ("flex-1 overflow-auto") — the table
  sits UNDER the fixed panel (LIVE-verified: detailOpen YES,
  marginRight 0px). The conditional class lands on the inner scroll
  div.
- **N-88c8 — THE MOBILE BADGE EXTRAS.** The reference's mobile-card
  priority badge renders the map value ONLY (`ne[ie.priority] ||
  ne.Standard` — the Badge base's font-semibold stands); OURS appends
  `border font-medium` — the font-medium WINS the twMerge conflict
  with the base font-semibold → 600 where the reference renders 700.
  (The TABLE badge carries `border font-medium px-3 py-1` on the
  reference too — ours matches there; only the MOBILE form is bare.)
- **N-88c9 — THE FILTERS BUTTON'S aria-expanded.** Ours adds
  `aria-expanded={showFilters}` (the reference's button has NO
  aria — `variant:x?"default":"outline"` + the onClick toggle only);
  our a11y superset, documented per the S33-P1/S47-P1 convention (the
  activities More-Filters toggle carries the same superset).
- **N-88a1/N-88a2/N-88b1** — the three audit nanos (the describe
  title count; the stale s11 comment; the 116 re-capture).

**The kke panel itself verified BYTE-EXACT** (the s28+s75 layers hold):
the wrapper `fixed right-0 top-16 bottom-0 w-80 bg-white shadow-2xl
z-40 lg:static lg:shadow-none` (ours identical incl. the z-40 +
lg:static); the scroll container + the sticky header (h3.font-semibold
+ the ghost sm Clear All); the `p-4 space-y-6` body; the six Card
groups in the reference's order (Role / Priority / Activity Status /
Company Size / Source / Engagement Level) with CardHeader >
CardTitle text-sm + CardContent space-y-2; the checkbox rows
(div.flex.items-center.space-x-2 + the button-role Checkbox with the
matching id/htmlFor wiring incl. source-${value}); the toolbar card
(bg-white rounded-lg shadow mb-6 > p-4 border-b > flex gap-3 with the
max-w-md search + the pl-10 input + the variant-ternary Filters
button); the Filters button's icon `w-4 h-4 mr-2` (the FilterPolygon
mirror); the search row computed-equal (text-subtle = #9ca3af =
gray-400; the pointer-events-none click-through fix the documented
s86 genus); the Pke slide-over byte-exact (the s82 decode); the name
cell, the role select, the engagement bars, the company cell, the
source badge, and the actions row all byte-exact; the G memo + the
sort default + the ce formatter all match.

## The operator decisions (48th re-affirmation)

The **CSV formula-injection posture (b) STANDS** — the 88-b
re-verification: `guardFormulaPrefix` intact at csv.ts:31-33 applied
in `escapeCell` AND imported into entity-export.ts's `qq` (:24/:43);
the `-` exclusion documented; ZERO new unguarded builders (the 88-b
census re-verified every builder call site — settings ×7, dashboard
×4, accounts/contacts/leads ×1 each, reports ×2, api/export ×1 — all
routing through the central guarded builders; the contacts export
rides the same seam; this session's row-basis work changes only the
DISABLED BINDING, not the builder). The **source-vocabulary
documented parity STANDS** — every anchor re-confirmed at file:line
by 88-b; the session's one vocabulary-adjacent change (M-88c4) is a
DISPLAY-case mirror of the reference's own capitalizer — the wire
vocabulary (the raw lowercase source values) is untouched; the
palette re-pin introduces no vocabularies.

## The remediation set (TDD — RED first, then GREEN)

- **S88-P1 (M-88c1)** — the @theme v3-palette re-pin in
  src/app/globals.css: the 91 `--color-{family}-{step}` tokens (amber
  ×7, blue ×10, cyan ×8, emerald ×5, gray ×10, green ×9, neutral ×3,
  orange ×7, purple ×5, red ×9, rose ×3, slate ×9, yellow ×4) with
  the session-88 comment block (the v4≠v3 divergence, the canvas-
  pixel verification method, the 97-rule zero-mismatch table
  verification, the S15-P12 hazard retirement). The S15-P12 comment
  in page-layout.ts re-derives (the literal classes now compute the
  reference's own values; the token pair remains the sanctioned form
  for token-riding variants).
- **S88-P2 (M-88c2/c3/c4)** — the icon/label family: the table's
  last-activity icon `Zap` → `Activity` (the lucide import + the
  row); `Crown` → `Award` at BOTH sites (the stat card icon + the
  name-cell overlay; the import re-derives); the Source labels
  capitalize via the reference's own `charAt(0).toUpperCase() +
  slice(1)` expression at the label render (the id/value stay raw).
- **S88-P3 (L-88c5)** — the IconStatCard contacts-arm restructure:
  `<Card className={gradient ? "bg-gradient-to-br from-white
  to-gray-50" : undefined}>` > `<CardContent className="p-6">` > the
  `flex items-start justify-between` row > [the `flex-1` column (the
  label p, the value p, the trend row), the chip `div.p-3
  rounded-lg ${chipClass}`]. The API: `chipClass` (the class string)
  replaces tone/color on this arm; `trendDir` ("up" | "down", default
  "up") joins `trend`; the trend row renders the DIV with the
  explicit-color TrendingUp|TrendingDown `w-4 h-4` + the
  direction-colored span; the subValue retires from the contacts arm
  (leads-only); `shrink-0`/`aria-hidden`/the inline style retire.
  The four call sites: iconClass "bg-blue-500"/"bg-green-500"/
  "bg-amber-500"/"bg-red-500" + the Award icon + trend + trendDir.
- **S88-P4 (L-88c6/c7 + N-88c8/c9)** — the binding + the shrink +
  the badge + the comment: the Export CSV `disabled={contacts.length
  === 0}` (the G-4/N-62e note re-derives to the resolved state); the
  inner scroll div's conditional `mr-[500px]` while detailContact is
  set (the class appended after CONTACTS_LAYOUT.innerScroll); the
  mobile badge's bare map (the `border font-medium` extras retire);
  the aria-expanded superset comment at the Filters button.
- **S88-P5 (N-88a1/a2)** — the api-robustness describe title count
  re-derivation ("nine" → the live row count); the page-layout :842
  comment re-derivation.
- **S88-P6 (the tests)** — the NEW
  `tests/contacts-family-parity.test.ts` RED-first pin suite: the
  palette pin block (the 91 tokens present at the exact v3 values +
  a representative exact-value sample + the token count); the
  icon-identity pins (the Activity import + the no-Zap negative; the
  Award pair + the no-Crown negative); the Source label-case pins
  (the capitalizer expression + the raw id/value); the stat-card
  construction pins (the Card/CardContent split + the chipClass
  mechanism + the no-inline-style negative + the trend row div +
  the direction colors + the no-shrink-0/aria-hidden negatives +
  the subValue retirement); the export binding pin (the RAW form +
  the no-filtered negative); the mr-[500px] conditional pin; the
  mobile badge pin (the bare map + the no-font-medium negative).
  Plus the lockstep re-anchors (none predicted — no existing pin
  reads the touched surfaces; the S15-P12 comment is prose-only).
- **S88-P7 (the docs)** — SKILL v1.85.0 (§16cb + project_state +
  the H1 in lockstep, via the assert-first scripts/skill_edits_s88.py
  at the sandbox root) + README badge + the suite list + AGENTS/
  CLAUDE/PAD at the new counts (+ the PAD s88 inventory row + the
  Total row) + session_173.md + this plan's execution record + the
  repo worklog.
- **S88-P8 (the LIVE battery + the screenshots)** — the fixed dev
  server probed side-by-side with the reference: the palette colors
  (text-blue-600/bg-blue-600 computing rgb(37,99,235); red-600;
  the cyan-400/green-400 sparks; the accounts Filter button's
  literal now computing #2563eb); the Activity icon; the Award pair;
  the Source labels; the stat card DOM walk (Card > p-6 > the row +
  the bg-class chip); the export binding (filter-to-empty → the
  button stays enabled); the mr-[500px] shrink (open the detail →
  the scroller's computed marginRight 500px); the mobile badge
  weight; the drawer at TRUE 390px (the full battery); zero
  overflow; the closing census MATCH + the reference md5-exact
  re-fetch. Screenshots 118 (the contacts stat cards + the open
  filter panel) + 119 (the table with the Activity/Award icons) +
  120 (the mobile drawer at 390) NEW + the **116 re-capture** (the
  s87 chart-headers surface, replacing the N-88b1 duplicate) under
  `docs/screenshots/`, VLM-verified per the house protocol.

No new e2e: every fix surface is source/DOM-structural or a token
value (the e2e selectors are structural — by role/text/testid, no
color assertions; the mobile-nav suite untouched). The unit pins +
the LIVE DOM-census battery cover the family (the s78–s87 precedent
for structural rotations). The palette pin's visual delta is
verified via the LIVE computed-color battery.

## Blast radius (pre-checked)

The palette re-pin touches ZERO class strings in src/ (the classes
stay; only their compiled values change to the reference's own) —
the pinned class-string tests are untouched by construction; the
design-tokens suite pins --shadow-sm/--blur-sm/--color-ring (not the
palette); the constants suite pins the CHART_* hexes (the
--color-chart-* tokens, not the palette families). The IconStatCard
restructure touches the contacts arm ONLY (the leads arm is a
separate return branch — its s77 pins survive untouched); the
STAT_SHADOWS.iconStatContacts "shadow" pin survives (the stock Card
base carries the bare shadow). The IconStatCard consumers: the
contacts page (4 call sites) — zero other consumers of the contacts
arm. The Zap/Crown/Award import changes touch contacts-page.tsx
only. The export binding + the mr-[500px] + the mobile badge + the
Source labels touch contacts-page.tsx only. The api-robustness
title + the page-layout comment are test-file prose edits
(count-only). The e2e family: the contacts e2e reads
role/text/placeholder selectors — the Source label case change
alters the PANEL's checkbox LABELS (Call vs call) — no e2e pins
them; the contacts-page e2e rows/panel assertions are structural.

## The execution record (2026-10-09, session-88)

EXECUTED AS PLANNED, 2 mid-flight pin-shape repairs (the palette
census count 91 → 92 — the GREEN phase's own new bg-amber-500
call-site class entered the set, itself one of the reference's Rx
iconColor values; the contactsArm test window re-anchored past the
session-88 comment that names the retired arms — the assertions must
scan the CODE, not the prose). RED: **17 failed | 1733 passed (1750
total)** at the pre-fix state — exactly the new suite's pin set +
ZERO collateral. GREEN: S88-P1..P8 all landed (P1 the @theme
v3-palette re-pin — 92 tokens + the divergence comment + the S15-P12
hazard-note retirement; P2 the icon/label family — Activity + the
Award pair ×2 + the Source capitalizer; P3 the IconStatCard contacts
arm — the Card > CardContent "p-6" split + the iconColor bg-class
chip + the trendDir trend row + the subValue/tone/color retirements +
the 4 call sites; P4 the RAW export binding + the conditional
mr-[500px] + the bare mobile badge + the aria-expanded superset
comment; P5 the describe-title count + the stale s11 comment; P6 the
17-it suite; P7 the docs at SKILL v1.85.0/README 1882/AGENTS+CLAUDE+
PAD 1750+132; P8 the LIVE battery + the 3 new screenshots + the 116
re-capture). GATE: lint 0/0 · tsc 0 · **1750/1750 unit (97 suites,
+17 net)** · build clean · **132/132 e2e on a fresh CI=1 boot (3.2m,
FIRST run green — all 9 mobile-nav checks green)**. LIVE (both apps
probed): every probed palette class computing the reference's exact
rgb (blue-600 rgb(37,99,235); red-600 rgb(220,38,38); cyan-400
rgb(34,211,238); green-400 rgb(74,222,128); amber-400 rgb(251,191,36);
purple-600 rgb(147,51,234); gray-600 rgb(75,85,99)); the stat card
walk Card > p-6 > the row with the bg-class chip + the trend row div;
the Activity row icon + the Award pair; the Source labels capitalized;
the export ENABLED at filter-to-empty; the scroller at marginRight
500px with the detail panel open; the mobile badge at weight 600; the
drawer at TRUE 390px (full-bleed, the w-72 panel at left-0 computing
the reference's own sidebar blue rgb(37,99,235), 8 links, focus
inside, dual lock, navigate-close + released, closed inert+hidden);
zero overflow; the closing census MATCH + the reference md5-exact
re-fetched (the 59th consecutive stable session). Screenshots 118 +
119 + 120 NEW + the 116 RE-CAPTURE (the N-88b1 duplicate replaced) —
VLM 4/5 (the one NO a below-the-fold framing artifact, the Source
labels DOM-verified) + 3/5 (both NOs framing/data artifacts; the two
KEY icon questions both YES) + 2/4 RAW / 4/4 effective (both NOs
prompt errors — the uniform-#3b82f6 vertical bars ARE the reference's
own bundle construction, bundle-decoded at the Bar fill) + 4/4.
Estimate drift: +17 net its exact · 132 e2e exact · the e2e-waits
census unchanged at 5.
