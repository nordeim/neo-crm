# Session-82 Parity Remediation Plan (2026-10-08)

Session 82 on `main` @ `5c32c9e` (the s81 ship `746c46b` + the
session-log commit `5c32c9e`, docs-only — `docs/session_160.md`, ZERO
code drift). The workspace SURVIVED s81 (the pull fast-forwarded
`746c46b → 5c32c9e`); the environment verified in place (.env with
`DATABASE_URL="file:../db/custom.db"` + the AUTH_SECRET; `db/` at the
repo root; census MATCH 15/24/10/23/12 + 4 users). The documented
intake hazard STANDS (the platform `DATABASE_URL` override points at a
non-existent mirror; all session-82 repo operations run under
`env -u DATABASE_URL`). **Baseline gate on HEAD: lint 0/0 (enforced) ·
tsc 0 · 1599/1599 unit (90 suites) · build clean · 132/132 e2e** — the
FIRST full e2e run green (no flakes; all 9 mobile-nav checks green).
The `skills/` exclusion verified in all three configs (eslint ignores +
tsconfig exclude + vitest include-scope — unchanged this session).

## The standing layers (78th session, NO APP DRIFT)

Drift sweep #78: the APP bundle still served byte-identical from
`/assets/index-DZ-xbrIm.js` — size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` exact — **the 53rd consecutive
stable session** (the app stylesheet `index-Be9epoFc.css` 79,581 bytes
exact too). **THE S81-FLAGGED `/static/*` RE-CHECK (done, the answer:
NO app-code migration)**: the login HTML now references ONLY the
`/static/*` platform family (37 modulepreloads — index-Bb-Jadgr.js the
102KB entry with ZERO app markers, AuthAPI/WorkspaceAPI/i18n/rolldown
chunks) and NO `/assets/` refs at all — the LOGIN SHELL ITSELF now
renders via the platform loader (the s81 note extended: pre-login too).
But the LIVE app post-login still loads ONLY the old `/assets` pair
(performance entries verified: index-DZ-xbrIm.js + index-Be9epoFc.css
+ zero other /assets) — the app code did NOT move; the documented
non-drift pattern extends one step deeper. Reference census #78
(agent-browser, live login at 1440 then a TRUE 390px viewport): the
demo data still zero (Total Leads 0 / Deals Closed $0.0k / Revenue
$0.0k); the mobile-nav defect STANDS at a TRUE 390px (vw=390, nav w=0,
8 links in DOM, 0 visible); desktop nav normal (256px, 8 links, all
visible). Our mobile drawer stays the deliberate documented superset.

## The audits (two parallel subagents + the orchestrator's own
fresh-eyes rotation, every parity claim decoded from the
byte-stable 1.63MB reference bundle + LIVE-probed on our dev server)

**82-a** — the s81 re-audit: **9/10 GENUINE** (the SelectContent
chrome at select.tsx:75 with the full unconditional arm set; the item
rounded-sm + focus:text-neutral-900 + the BARE check at :113/:125; the
trigger base + line-clamp-1 span + bare chevron; the three min/max
retires + the API 0-90 guard standing; the TabsPanel attr trio; the
subtitle div; 2/3 comment carriers; the parity suite 23 its — vitest
3 files 213/213; the docs carriers at v1.78.0/1731/1599+132; the
commit honest [18 files, +917/−37, zero strays] + fdb34ca/3da08e0/
5c32c9e docs-only). **ONE MATERIAL FINDING (N1 → the L-82c5 fold-in)**:
`AGENTS.md:200-202` STILL carries the retired solid
`hover:bg-neutral-800` Badge description — the S81-P7 AGENTS:200 half
was claimed landed in six doc surfaces (the plan :324-325, session_159
:15, SKILL :7276, the commit message) but never executed (746c46b's
AGENTS.md diff touched only the count hunks); unpinned by any test —
the N-50a doc-carrier-escapes-pins genus. Plus N4: PAD:766's s81 row
claims the carrier was "pinned" (no such pin exists).

**82-b** — the graduation audit: **ZERO graduations, 12/12 (the 39th
consecutive)** — every standing ledger rationale verified UNCHANGED at
HEAD (F-47c, N-48c, N-48f, N-48j, N-51c, the stock-mirror KEEP, N-58c,
N-63b, the s63 foreign-docs retirement, the 19/19 deps [zero diff
since 81-b], the mobile-nav superset, F-46f/s46-P1). **The 8 mechanical
censuses 8/8 CLEAN** (the first all-clean sweep of the rotation era's
second consecutive): the unit count 1599/90, the e2e list 132
(11+111+9+1 across the 4 files), the CSV guard suites 49/49
(guardFormulaPrefix intact at csv.ts:31-33 → escapeCell →
entity-export's qq), the source-vocabulary anchors (both OPTIONS arrays
+ the four isBadString-only sites + the Capitalized six), the e2e sleeps
exactly 5 annotated, the SKILL frontmatter v1.78.0/2026-10-08, the
count carriers all at 1599/132/90 + README 1731, the db census MATCH.
Both operator decisions' evidence INTACT.

**82-c** — the fresh-eyes rotation on the CONTACTS SLIDE-OVER'S
DEEPER CHROME (the session_159 suggested target #1 — the s28 Pke
decode pinned the structure + the s75 panel work touched the filter
rail, but nobody ever walked the panel's own card bodies + the
activity/deal constructions + the icon identities + the Button
icon-text mechanics they ride): the foundations SOLID (the root
`fixed top-0 right-0 h-full w-full md:w-[500px] bg-white shadow-2xl
z-50 overflow-y-auto border-l` LIVE 500px; the sticky header + ghost X;
the hero w-20 gradient + first-initial + position + the badge pair + 
the engagement 3-bar family [-600 solids + 3/2/1 counts + bg-gray-200
empty — the constants byte-equal]; the Call/Email/WhatsApp
grid-cols-3; the Contact Information icon rows; the tabs
`grid w-full grid-cols-3` track computed-equal [the Gg base decoded:
`inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1
text-muted-foreground` + appended `grid w-full grid-cols-3`, twMerge
resolves display]; the three empty states; no backdrop/Escape at the
call site — ours matches verbatim) — the **N-82 family: 3 M + 2 L + 
2 N**:

- **M-82c1 CONFIRMED (bundle-verbatim base decode + LIVE-computed on
  our dev server)** — THE BUTTON-ICON-MARGIN RE-DERIVATION: the
  reference's stock Button base (the bundle's `uie`, decoded verbatim)
  carries `[&_svg]:pointer-events-none [&_svg]:size-4
  [&_svg]:shrink-0` and **NO svg-margin arms** — its icon-text spacing
  rides EACH SURFACE'S OWN svg margin class (`w-4 h-4 mr-2` on the
  entire header/export family — New Account/Contact/Lead/Event, Export
  CSV/Export/Export PDF, Saved Reports, Reset All Data, Scan Card,
  Import, Add, ALL bundle-decoded with mr-2; `w-4 h-4 mr-1` on the
  compact family — the panel's Call/Email/WhatsApp, the mobile cards'
  Call/Email, the activities Check-as-completed). OURS ships the s9
  `BUTTON_BASE.iconGap` invention (`[&_svg]:mr-2
  [&_svg:only-child]:mr-0`) on the base — and the cascade BREAKS the
  per-surface margins: (a) on svg+BARE-TEXT buttons the svg is the only
  ELEMENT child (text labels are text nodes), so `[&_svg:only-child]:
  mr-0` (specificity 0,2,1) nullifies EVERYTHING — the svg's own mr-1/
  mr-2 (0,1,0) included — computing **0px** where the reference
  computes 4px/8px: **LIVE-measured 0px** on the contacts header Export
  CSV + New Contact (the reference's mr-2 family: our total gap 8px vs
  its 16px) AND on the panel's Call button (the mr-1 family: 8px vs
  12px); (b) on svg+SPAN buttons the `[&_svg]:mr-2` arm fabricates the
  8px (accidentally right ONLY for the mr-2 family); (c) the topbar
  user button carries a `[&_svg]:mr-0` NEUTRALIZER that exists purely
  to undo our own invention. The affected set: 16 text-button svgs
  missing their own margin (dashboard Add + outline Export; accounts
  Export CSV + New Account; contacts Export CSV + Scan Card + Import +
  New Contact; leads Export + New Lead; reports Saved Reports + Export
  CSV ×2 + Export PDF ×2; settings Reset All Data) + the 6 already-
  carrying sites (panel ×3 mr-1 + mobile ×2 mr-1 + Check mr-1) + the
  5 already-carrying mr-2 sites (calendar Plus, FilterPolygon, Scan,
  dashboard Download, save-dialog Save) — all already correct, they
  simply START APPLYING once the cascade retires.
- **M-82c2 CONFIRMED (bundle alias resolved + our lucide
  byte-verified)** — THE PANEL ACTIVITY-ICON IDENTITY: the reference's
  slide-over activity card renders `AC` = **lucide Activity** (the
  bundle: `AC=tr("Activity",vQ)` with the pulse path
  `M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48
  0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2` —
  our lucide-react 0.525's Activity path is BYTE-IDENTICAL). OURS
  renders **Zap** (the lightning bolt `M4 14…`) — the wrong glyph on
  every activity card in the slide-over. The s76 icon-alias rotation
  resolved the activities page's families but never walked this card.
- **M-82c3 CONFIRMED (bundle format string decoded)** — THE PANEL
  ACTIVITY-DATE FORMAT: the reference renders
  `st(l.date).format("MMM D, YYYY h:mm A")` — the date + the TIME
  (e.g. "Oct 5, 2026 10:00 AM"); OURS renders "MMM D, YYYY" (no time
  arm) via the panel's local mmmDyyyy. The `l.date` field = our dueAt
  (the ActivityDialog's single datetime binding, the s76 mapping); our
  fallback chain stays (the robustness superset, the priority-rows
  precedent).
- **L-82c4 CONFIRMED (bundle jsx-array decoded)** — THE DEALS-CARD
  AMOUNT: the reference renders the jsx array
  `["$",(f=l.amount)==null?void 0:f.toLocaleString()]` — **"$" +
  amount?.toLocaleString() with NO space and NO 0-fallback** (a null
  amount renders "$" alone). OURS renders
  `` `$ {d.amount == null ? 0 : d.amount.toLocaleString()}` `` — a
  space after the $ AND a 0-fallback ("$ 0" at null). Two visible
  deltas on every deal card.
- **L-82c5 (82-a's N1)** — THE AGENTS.md:200-202 STALE CARRIER: the
  S81-P7 half that was claimed landed in six doc surfaces but never
  executed — the Badge description still documents the retired solid
  `hover:bg-neutral-800` as "the computed-equal" (the s66 alpha-math
  error s80 falsified). One-line re-derivation to the /80 alpha arm.
- **N-82c6 CONFIRMED (bundle-verbatim)** — THE EMAIL-ROW FALLBACK:
  the reference renders `e.email` BARE (jsx children); OURS renders
  `contact.email ?? "—"` — our email is schema-required non-null, so
  computed-equal in practice; retire the "—" to the verbatim form.
- **N-82c7 (82-a's N4)** — THE PAD:766 PHANTOM-PIN WORDING: the s81
  inventory row claims the N-81c7 AGENTS:200 carrier was "pinned" —
  no such pin exists (the reason the stale carrier survived the s81
  gate). Re-word the row to the truth (comment-only, unpinned).

## The operator decisions (41st re-affirmation)

The **CSV formula-injection posture (b) STANDS** — the 82-b
re-verification: `guardFormulaPrefix` intact at csv.ts:31-33 applied in
`escapeCell` AND imported into entity-export.ts's `qq`; the `-`
exclusion documented; **ZERO new unguarded builders** (the 82-b
downloadBlob sweep re-verified all 16 call sites trace to the guarded
seams; the slide-over family ships ZERO CSV surfaces). No new evidence
moves the (a) parity / (c) full-OWASP alternatives.

The **source-vocabulary documented parity STANDS** — the 82-b census
re-confirmed every anchor at file:line (both OPTIONS arrays with the
in-file posture comments; the four validation sites isBadString-only
with in-file rationale; the Capitalized six verbatim). The slide-over
family introduces NO vocabularies (the Activities/Deals/Notes tab ids
are the s23-pinned existing set; the empty states are the s28-pinned
literals).

## The remediation set (TDD — RED first, then GREEN)

- **S82-P1 (M-82c1a) — the Button base retirement**: button.tsx drops
  `BUTTON_BASE.iconGap` from the cva base (the reference-verbatim
  construction: pointer-events-none + size-4 + shrink-0 only); the
  `BUTTON_BASE.iconGap` record field retires from page-layout.ts; the
  topbar `TOPBAR_LAYOUT.userButton` drops its `[&_svg]:mr-0` neutralizer
  (`flex items-center gap-1 sm:gap-2` remains) + the topbar.tsx:215-220
  + page-layout.ts:268-276 comments re-derive; RE-ANCHOR:
  page-layout.test.ts:583 (the iconGap pin → the retirement negative:
  the base source contains NO `[&_svg]:mr-2` and NO only-child arm) +
  page-layout.test.ts:324-327 (the userButton pin + comment).
- **S82-P2 (M-82c1b) — the 16 per-surface mr-2 additions**: the
  header/export family svgs gain `mr-2` (dashboard page.tsx Add +
  outline Export; accounts :207/:215; contacts :376/:379/:382/:389;
  leads :384/:392; reports :120/:657/:660/:699/:702; settings :377) —
  each the reference's own per-surface class (the bundle-decoded
  `w-4 h-4 mr-2` family), preserving the svg+span sites' 8px and
  restoring the bare-text sites' 8px (16px total, the s9-measured
  value, now via the reference's own mechanism).
- **S82-P3 (M-82c2) — the Activity icon**: the panel's Zap → Activity
  (the bundle's AC, our lucide byte-identical path) + the comment.
- **S82-P4 (M-82c3) — the datetime seam**: the new
  `formatMonthDayYearTime` in src/lib/format.ts (the "MMM D, YYYY
  h:mm A" form — the house hand-rolled pattern riding MONTHS_SHORT)
  + the panel's activity-card date line consumes it (the fallback
  chain unchanged).
- **S82-P5 (L-82c4) — the deals amount**: the reference-verbatim jsx
  children `{"$"}{d.amount == null ? undefined :
  d.amount.toLocaleString()}` (no space, no 0-fallback).
- **S82-P6 (L-82c5) — the AGENTS.md:200-202 carrier**: the Badge
  description re-derived to the /80 alpha arm.
- **S82-P7 (N-82c6) — the email row**: `contact.email ?? "—"` →
  `{contact.email}` (the verbatim bare form).
- **S82-P8 (N-82c7) — the PAD row**: the s81 inventory row's
  "pinned" claim re-worded to the truth.
- **S82-P9 — the new `tests/contacts-panel-parity.test.ts`** + the
  page-layout re-anchors: the RED-first pin set (the Activity icon
  import + the Zap negative; the formatMonthDayYearTime helper's
  output pins + the panel's consumption; the deals construction's
  no-space/no-0 pins; the email-row bare form; the three mr-1 action
  buttons' bare-text construction + their svg margins; the base's
  retirement negatives [no iconGap field consumed in button.tsx, no
  `[&_svg]:mr-2`, no only-child arm]; the userButton's neutralizer
  retirement; the 16 mr-2 sites pinned via the page-source reads) +
  green-by-design anchors (the panel's standing computed-equal
  surfaces: the root classes, the hero, the badges, the engagement
  bars, the tabs track construction, the empty states).

No new e2e: the margin changes are class-level (every e2e locator is
role/text-based); the slide-over e2e's amount regex `/\$\s?[\d,]+/`
tolerates both the old and new forms; the Activity icon swap changes
no accessible name; the date format rides the panel body (no e2e
asserts it — Sarah Thompson ships NO activities, the empty state).
The unit pins + the LIVE battery cover the family (the s76–s81
precedent for styling-only rotations).

## Blast radius (pre-checked)

The pins that RE-ANCHOR in lockstep: `tests/page-layout.test.ts:583`
(the iconGap toBe — the only iconGap pin repo-wide), `:324-327` (the
userButton toBe + its comment), `:580-582` (the S9-1 comment block
re-derived to the new mechanism). SURVIVES untouched: `:590`
(BUTTON_BASE.svgSize — the size-4 cascade STAYS, it IS the reference's
own), `:1215` (PROFILE_LAYOUT.uploadIcon — an already-per-surface
mr-2), `:203/:422/:498/:507/:1061` (the per-surface mr-2/mr-1 pins —
all already the reference's own mechanism, now consistently so),
`:1927-1928` (the userButton <Button> wiring — the className value
changes, the wiring pin doesn't read the record's content), the
topbar-rowmenu-parity suite (its `[&_svg]:size-4` references are the
size cascade, not margins), the contact-surfaces suite's Pke block
(the structural pins — none touch the icon identity, the date format,
or the amount construction), the e2e family (132 unchanged — see
above), the settings-defaults-parity suite (no select/tab surface in
the fix set). The GREEN-hazard sweep: the mr-2 additions compile (the
class already ships on 5 sites + the pins' per-surface family); the
iconGap retirement orphans no consumer (grep `[&_svg]:mr-` in src/ →
only the base + the topbar neutralizer); the Activity import exists in
our lucide (byte-verified); the format helper follows the
formatMonthDayTime pattern exactly.

## The execution record (2026-10-08, session-82)

EXECUTED AS PLANNED + 2 mid-flight pin-shape repairs + 2 further
lockstep re-anchors discovered by the GREEN run (the runs' own
catches — all four the house conventions). RED: **12 failed exactly**
(the new contacts-panel-parity suite's 11 + the page-layout
userButton re-anchor). The two shape repairs: (1) the size-cascade
pin initially asserted the literal `[&_svg]:size-4` against
button.tsx — the literal lives in page-layout.ts's record; the pin
now reads the record consumption (`BUTTON_BASE.svgSize`); (2) the
compact-family CircleCheck regex required the tag to close right
after the className — the glyph carries an aria-hidden between them.
The two lockstep re-anchors the plan's blast-radius sweep missed
(both the retired-surface class): reports-page-parity.test.ts:367-369
(the per-table export icons h-4 w-4 → h-4 w-4 mr-2) +
settings-data-tab.test.ts:111-116 (the Reset All Data Trash2 → the
mr-2 form). Non-vacuousness PROVEN at the pre-fix state (only the
test files modified): the full suite ran **12 failed | 1607 passed
(1619 total)** — exactly the modified-pin set, ZERO collateral.
GREEN: S82-P1..P8 all landed (P1 the Button base retirement — the
iconGap arms + the record field + the topbar neutralizer + the three
comment carriers re-derived; P2 the 16 per-surface mr-2 additions
via the assert-once scripts/s82_p2_margins.py; P3 the Activity icon
swap + the ActivityRecord type alias; P4 the formatMonthDayYearTime
seam + the panel's card line; P5 the deals jsx-array construction;
P6 the AGENTS:200-202 carrier; P7 the email bare form; P8 the PAD
row re-wording). GATE: lint 0/0 · tsc 0 · **1619/1619 unit (91
suites, +20)** · build clean · **132/132 e2e on a fresh CI=1 boot
(3.2m; the FIRST run green — no flakes; all 9 mobile-nav checks
green)**. LIVE: the contacts header Export CSV/New Contact 8px
margins (the 16px total gap — was 0px); the panel's Call 4px (12px
total); the dashboard Add 8px (its own mr-2); the topbar chevron 0px
(the bare form); the icon lucide-activity (the pulse path) ×2; the
dates "Sep 26, 2026 9:36 AM" / "Oct 8, 2026 2:00 PM"; the amounts
"$110,000"/"$145,000" (no space); the email row bare; the drawer at
TRUE 390px (full-bleed, 8 links, dual lock, focus inside; navigate →
close + locks released; Escape → inert — via the REAL trigger click;
the earlier synthetic-click misses were a selector artifact, the 9/9
e2e + the real-click probe are the evidence); zero overflow ×10; the
built CSS zero (hover: hover) wraps + the mr-1/mr-2 utilities
compiled (two inert comment-mention rules remain — v4 scans comments,
the s80/s81 precedent, matched by zero elements); the closing census
MATCH (the db pristine 15/24/10/23/12 + 4 users + the reference
unchanged: the bundle md5 exact, demo zero, the mobile defect
standing, 256px/8 desktop). Screenshots 103 (the slide-over
Activities tab — the pulse icon + the datetime) + 104 (the panel at
TRUE 390px) NEW — VLM 3/5 (both flags DOM-disproven: the 16px pulse
glyph at screenshot scale + the date-only Last Activity row the
reference itself ships) + 4/4 PASS. Docs: SKILL v1.79.0 (§16bv +
project_state, 7310 → 7421, via the assert-first
scripts/skill_edits_s82.py at the sandbox root) + README badge 1751
+ AGENTS/CLAUDE/PAD at 1619+132 (+ the PAD s82 inventory row + the
Total 91/1619) + session_161.md + this record + the repo worklog;
.env/.env.example verified (no env surface change). Estimate drift:
+20 its exact (the new suite's 20) · 132 e2e exact · the e2e-waits
census unchanged at 5.
