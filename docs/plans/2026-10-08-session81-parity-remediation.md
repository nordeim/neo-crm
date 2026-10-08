# Session-81 Parity Remediation Plan (2026-10-08)

Session 81 on `main` @ `3da08e0` (the s80 ship `5e6da2c` + the two
session-log commits `fdb34ca`/`3da08e0`, docs-only, ZERO code drift).
The workspace was RESET — a fresh clone; the environment rebuilt
(.env with `DATABASE_URL="file:../db/custom.db"` + the openssl
AUTH_SECRET; bun install; db:push/db:seed; census MATCH
15/24/10/23/12 + 4 users). The documented intake hazard STANDS (the
platform `DATABASE_URL` override points at a non-existent mirror; all
session-81 repo operations run under `env -u DATABASE_URL`).
**Baseline gate on HEAD: lint 0/0 (enforced) · tsc 0 · 1576/1576 unit
(89 suites) · build clean · 132/132 e2e** — the FIRST full e2e run
caught the documented s72 settings flake (2 settings-family tests),
re-ran green in isolation (2/2 + crm.spec 112/112) AND the third full
run 132/132 — the s74/s76/s79 precedent. The `skills/` exclusion
verified in all three configs (eslint ignores + tsconfig exclude +
vitest include-scope).

## The standing layers (77th session, NO APP DRIFT)

Drift sweep #77: the APP bundle still served byte-identical from
`/assets/index-DZ-xbrIm.js` — size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` exact — **the 52nd consecutive
stable session** (the app stylesheet `index-Be9epoFc.css` 79,581
bytes exact too). **NEW PLATFORM-SHELL NOTE (a documented non-drift)**
: the reference's login HTML now references a NEW `/static/*` module
family (index-B8-VQKlf.js + a 756-chunk rolldown map: WebApp,
UserAppMain, AppContext…) + an SEO snapshot (`data-seo-source`) + a
`cdn.tailwindcss.com` script tag — the base44 PLATFORM loader was
re-deployed. The LIVE app still loads ONLY the old `/assets` pair
(performance entries verified post-login: index-DZ-xbrIm.js +
index-Be9epoFc.css + symbol-orange.png) — the shell changed, the app
did not. Reference census #77 (agent-browser, live login at 1440
then a TRUE 390px viewport): the demo data still zero (the KPI
values 0/$0.0k/$0.0k/$0k); the mobile-nav defect STANDS at a TRUE
390px (vw=390, nav w=0, 8 links in DOM, 0 visible, no hamburger);
desktop nav normal (256px, 8 links, all visible). Our mobile drawer
stays the deliberate documented superset.

## The audits (two parallel subagents + the orchestrator's own
fresh-eyes rotation, every parity claim LIVE-EXTRACTED from the
reference at 1440 AND 390 + cross-probed on our dev server + the
reference's own DOM class strings decoded)

**81-a** — the s80 re-audit: **9/9 checklist items GENUINE** (21/21
sub-checks verified at file:line; the @custom-variant line at
globals.css:20, the five alpha arms, the four re-anchors, the email
type, the two comment repairs, the three doc carriers, the
profile-family-parity suite re-ran 15/15, the re-anchor suites
190/190, the full unit independently re-ran 89 files/1576, the
commit honest [19 files, +740/−31, 5 added/14 modified, zero
strays], fdb34ca + 3da08e0 docs-only). **THREE NANO FINDINGS (the
N-81c7 fold-in — all one N-50a-class comment fix, zero functional
impact)**: (1) `AGENTS.md:200-202` — the present-tense Badge
description still carries the retired solid `hover:bg-neutral-800` as
"the computed-equal" (repeating the s66 alpha-math error s80 itself
falsified; the s80 doc phase fixed AGENTS' count carriers but missed
this hover carrier in the same file); (2)
`tests/badge-contract.test.ts:32` — the file-header computed-equal
map still reads "default -> … shadow hover:bg-neutral-800" (only
:85 was re-anchored — the exact P5 genus); (3)
`tests/page-layout.test.ts:1190` — the s13 comment still reads
"(… hover #262626)" five lines above the :1195 pin now enforcing
/80. Brief-paraphrase notes: the s80 Save carrier lives at
`src/app/(app)/profile/profile-page.tsx:288` and the commit's file
split is 5 added/14 modified.

**81-b** — the graduation audit: **ZERO graduations, 12/12 (the 38th
consecutive)** — the 12 standing ledger items each rationale verified
UNCHANGED at HEAD (F-47c, N-48c, N-48f, N-48j, N-51c, the
stock-mirror KEEP, N-58c, N-63b, the s63 foreign-docs retirement,
the 19/19 deps, the mobile-nav superset, F-46f/s46-P1). **The 8
mechanical censuses 8/8 CLEAN** (the first all-clean sweep since
s79): the unit count 1576/89, the e2e list 132/4, the CSV guard
suites 39/39 + `guardFormulaPrefix` intact at csv.ts:31-33 applied
in escapeCell AND entity-export's qq, the source-vocabulary anchors
(both OPTIONS arrays with posture comments; NO enum-membership on the
four validation sites; the Capitalized six verbatim), the e2e sleeps
exactly 5 annotated, the SKILL frontmatter v1.77.0/2026-10-08 (rode
the s80 bump), the count carriers all at 1576/132/89 + README 1708,
the db census MATCH. Both operator decisions' evidence INTACT.

**81-c** — the fresh-eyes rotation on the SETTINGS DEFAULTS
EDITORS' DEEPER FAMILY (the session_157 suggested target #1 — never
a dedicated rotation: s14 pinned the SETTINGS_DEFAULTS layout
records, s26 the data-tab chrome, s72 the store/API seams + the
debounce contract, but nobody walked the editors' own DOM + computed
styles + the Select stock family they ride against the live
reference): the foundations SOLID (the card chrome 12px/#e5e5e5/
white/shadow computed-equal on both apps; the six-group space-y-4/
space-y-2 stack with the 16px inter-group + 12px labelGap + 8px
inputMT computed identical; the stock Label 14px/500/#0a0a0a; the
inputs 36px/14px/#0a0a0a/#e5e5e5/transparent; the selects 36px/14px
with the 8px computed mt; the 390px responsive set MEASURED
IDENTICAL — input/select 308px, card 358px, the 36px 3-col segmented
tablist, zero overflow ×both; the placeholders AED/new/B verbatim;
the Month/Week + Monday/Sunday vocabularies; the fallback values
AED/new/B/3/month/monday) — the **N-81 family: 3 M + 2 L + 2 N**:

- **M-81c1 CONFIRMED (live-computed on the reference's open Select
  popover, both apps)** — the SELECT-CONTENT CHROME: the reference's
  content ships `z-50 max-h-96 min-w-[8rem] overflow-hidden
  rounded-md border bg-popover text-popover-foreground shadow-md` +
  the FULL animation arm set (fade + zoom + **all four
  slide-in-from-\* arms** + all four per-side translate arms). OURS
  ships `z-[60] max-h-72 … rounded-lg … shadow-lg` with only fade +
  zoom + the two vertical translates — the scaffold-era shadcn
  construction that 80 sessions never walked against the reference
  (the s13 MENU_CONTENT pin covered the dropdown-menu family; the
  select content was never pinned). LIVE-COMPUTED divergences:
  radius **8px vs 6px**, shadow **lg (0 10px 15px -3px + 0 4px 6px
  -4px) vs md (0 4px 6px -1px + 0 2px 4px -2px)**, max-height
  **288px vs 384px**, z-index **60 vs 50**, + the missing
  slide-in-from-top-2 (8px slide) open animation on every popover.
- **M-81c2 CONFIRMED (live-computed on both apps' open popovers)** —
  the SELECT-ITEM + CHECK family: the reference's items ship
  `rounded-sm` computing **4px** (its shadcn radius derivation) +
  `focus:bg-accent focus:text-accent-foreground` — the highlighted
  item's text shifts #0a0a0a → **#171717** (its accent-foreground;
  LIVE: the highlighted "Month" computed rgb(23,23,23) while the
  resting "Week" computed rgb(10,10,10)). OURS ships `rounded-md`
  computing **6px** + `focus:bg-line-soft` with NO text arm (stays
  #0a0a0a on highlight). AND THE CHECK: the reference's selected
  item's check svg is `h-4 w-4` BARE — inheriting the near-black
  (#0a0a0a resting / #171717 highlighted). OURS carries
  `h-4 w-4 text-primary` = **#2563eb — a BLUE check on EVERY selected
  select item app-wide** (our --color-primary is the app blue, not
  the reference's popover ink).
- **M-81c3 CONFIRMED (the reference's DOM + bundle-decoded verbatim,
  live-DOM-confirmed on the settings selects ×2 + the dashboard
  selects ×3)** — the TRIGGER BASE RE-DERIVATION: the reference's
  bundle-verbatim trigger base is `flex h-9 w-full items-center
  justify-between whitespace-nowrap rounded-md border border-input
  bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background
  data-[placeholder]:text-muted-foreground focus:outline-none
  focus:ring-1 focus:ring-ring disabled:cursor-not-allowed
  disabled:opacity-50 [&>span]:line-clamp-1`. OURS invented THREE
  arms the reference does not ship (`text-ink`, `transition-colors`,
  `placeholder:text-muted-ink` — computed-equal/no-op but not the
  reference's construction), MISSES the latent `ring-offset-
  background` (offset-0 no-op), ships `[&>span]:truncate` where the
  reference ships **`[&>span]:line-clamp-1`** (LIVE-COMPUTED on the
  reference's trigger span: `display: flow-root; overflow: hidden;
  text-overflow: clip; -webkit-line-clamp: 1` vs OURS `display:
  block; text-overflow: ellipsis; line-clamp: none` — a different
  clipping construction on every select), and the chevron carries an
  extra `shrink-0` (the bundle's `h-4 w-4 shrink-0` is the CHECKBOX's
  class, not the chevron's — the reference's chevron is `h-4 w-4
  opacity-50`).
- **L-81c4 CONFIRMED (live-probed on BOTH surfaces)** — the
  NUMBER-INPUT MIN family: the reference's settings follow-up input
  (`type="number" value="3"`) ships **NO min and NO max**
  (hasAttribute false on both), and its New Account dialog's
  Annual Revenue + Employees number inputs ship **NO min** either.
  OURS ships `min={0} max={90}` on the follow-up
  (settings-page.tsx:601-602) + `min={0}` on both dialog inputs
  (entity-dialogs.tsx:290/:301) — DOM attribute divergences with
  real semantics (spinner clamping + the :out-of-range flag). The
  s77 "min={0} retire" precedent (the leads create-value input);
  the API-side 0-90 guard STAYS (the documented s43-P3/S46-P2
  functional superset — the debounce ensures only the FINAL value
  meets it).
- **L-81c5 CONFIRMED (live-DOM on the reference's settings strip)** —
  the TABSPANEL ATTR TRIO: the reference's Radix panels carry
  `data-state="active" data-orientation="horizontal" tabindex="0"`
  (plus role/id/aria-labelledby/hidden which our s23 shell already
  wires). OURS ships only the s23 wiring — none of the three
  Radix-stock attributes. `tabindex="0"` is the a11y-relevant one
  (the panel enters the tab order); data-state is the Radix
  data-attribute contract (the tw-animate data-[state] arms read
  it). Shared across all three tab strips (settings/reports/
  activities).
- **N-81c6 CONFIRMED (live-DOM both apps)** — the SUBTITLE ELEMENT:
  the reference's Default Values CardDescription slot renders a
  **DIV** (`<div class="text-sm text-muted-foreground">`); OURS
  renders a `<p className="text-sm text-muted-ink">` — a tag-only
  divergence (computed identical; our own Data tab already renders
  the div form — the s26 pin).
- **N-81c7 (81-a's nano findings)** — the three stale s80-hover
  comment carriers: AGENTS.md:200-202 (the Badge description's
  retired solid hover claim), badge-contract.test.ts:32 (the header
  computed-equal map), page-layout.test.ts:1190 ("hover #262626").

## The operator decisions (40th re-affirmation)

The **CSV formula-injection posture (b) STANDS** — the 81-b
re-verification: `guardFormulaPrefix` intact at csv.ts:31-33 applied
in `escapeCell` AND imported into entity-export.ts's `qq`; the `-`
exclusion documented; **ZERO new unguarded builders** (the 81-b
consumer sweep re-verified every dynamic CSV construction routes
through the guarded builders; the settings-defaults family ships
ZERO CSV surfaces). No new evidence moves the (a) parity / (c)
full-OWASP alternatives.

The **source-vocabulary documented parity STANDS** — the 81-b census
re-confirmed every anchor at file:line (both OPTIONS arrays pinned
with the in-file posture comments; NO enum-membership on the four
validation sites; the settings Capitalized defaults verbatim). The
settings-defaults family introduces NO vocabularies (the Month/Week
+ Monday/Sunday Select sets are the s72-pinned existing ones).

## The remediation set (TDD — RED first, then GREEN)

- **S81-P1 (M-81c1) — the SelectContent chrome**: select.tsx:53-57 →
  the reference-verbatim construction with our computed-equal token
  substitutions (border-line for border-input, bg-surface for
  bg-popover, text-foreground for text-popover-foreground — all
  verified computed-equal today): `relative z-50 max-h-96 min-w-
  [8rem] overflow-hidden rounded-md border border-line bg-surface
  text-foreground shadow-md` + the full animation arm set (fade ×4 +
  zoom ×2 + the four slide-in-from-\* + the four per-side
  translates) UNCONDITIONAL (the reference ships every arm on the
  single popper construction; our position ternary retires — no
  caller passes a non-popper position).
- **S81-P2 (M-81c2) — the SelectItem + Check**: `rounded-md` →
  `rounded-sm` (computes 4px, the reference's measured value);
  `focus:bg-line-soft` stays (the computed-equal of the reference's
  focus:bg-accent #f5f5f5); **+ `focus:text-neutral-900`** (the
  computed-equal of the reference's focus:text-accent-foreground —
  neutral-900 IS our house expression for #171717, the s80 badge
  precedent); the Check svg `h-4 w-4 text-primary` → **`h-4 w-4`**
  (the blue retires; the check inherits the near-black ink like the
  reference's).
- **S81-P3 (M-81c3) — the trigger base + span arm + chevron**:
  SELECT_TRIGGER.base → `flex h-9 items-center justify-between
  whitespace-nowrap rounded-md border border-line bg-transparent
  px-3 py-2 text-sm shadow-sm ring-offset-background` (text-ink +
  transition-colors + placeholder:text-muted-ink retired;
  ring-offset-background added; the per-surface w-full model STAYS —
  the s77 documented decision); the trigger template's
  `[&>span]:truncate` → `[&>span]:line-clamp-1`; the chevron
  `h-4 w-4 shrink-0 opacity-50` → `h-4 w-4 opacity-50`. Re-derive
  the select.tsx:20-29 + page-layout.ts S10-2 comments. RE-ANCHOR:
  page-layout.test.ts:765 (the base toBe).
- **S81-P4 (L-81c4) — the number-input min family**: retire
  `min={0} max={90}` on the settings follow-up input +
  `min={0}` on entity-dialogs' annualRevenue + employees (3 sites).
  The route's 0-90 guard untouched.
- **S81-P5 (L-81c5) — the TabsPanel attr trio**: tabs.tsx TabsPanel
  gains `data-state={active ? "active" : "inactive"}` +
  `data-orientation="horizontal"` + `tabIndex={0}` (the reference's
  Radix stock panels, LIVE-DOM-extracted).
- **S81-P6 (N-81c6) — the subtitle element**: the Defaults card's
  subtitle `<p>` → `<div>` (the reference's CardDescription slot;
  the class unchanged — the SETTINGS_DEFAULTS.subtitle pin
  survives).
- **S81-P7 (N-81c7) — the three comment carriers**: the AGENTS.md
  Badge description re-derived to the /80 alpha arm;
  badge-contract.test.ts:32's header map + page-layout.test.ts:1190's
  comment re-anchored to the s80 values.
- **S81-P8 — the new `tests/settings-defaults-parity.test.ts`**: the
  RED-first pin set (the SelectContent chrome string + the
  slide-arm negatives + z-50/max-h-96/rounded-md/shadow-md; the
  SelectItem rounded-sm + the focus:text-neutral-900 arm + the bare
  Check; the trigger's line-clamp-1 + ring-offset-background + the
  three retired-arm negatives + the bare chevron; the min/max
  negatives ×3; the TabsPanel attr trio; the subtitle div; the
  entity-dialogs min negatives) + green-by-design anchors (the
  computed-equal parities measured today: the card chrome, the
  36px/14px input + select geometry, the 12px labelGap, the 8px
  controlMt, the stock viewport p-1 + the popper trio, the fallback
  values, the placeholders, the Month/Week + Monday/Sunday sets, the
  390px set, the debounce contract's survival).

No new e2e: the select fixes are class-level (every e2e select
interaction is role-based — combobox/option locators unchanged); the
z-50 change matches the reference's own stacking (its dialogs are
z-50 too); the tabs attrs are additive; the min retire changes no
e2e assertion (no e2e types out-of-range numbers). The unit pins +
the LIVE battery cover the family (the s76–s80 precedent for
styling-only rotations).

## Blast radius (pre-checked)

The pins that RE-ANCHOR in lockstep: `tests/page-layout.test.ts:765`
(the SELECT_TRIGGER.base toBe — the only base-string pin; the
leads-family :319-331 pin only matches the focusRing field + the
template consumption, both unchanged). SURVIVES untouched: the
SETTINGS_DEFAULTS pins (:1434-1435 — the subtitle CLASS unchanged;
only the element tag changes); the MENU_CONTENT/MENU_ITEM pins
(:1336-1355 — the dropdown-menu family, untouched by the select
fixes); the tabs-aria pins (all additive-safe toMatch patterns —
role/id/aria-labelledby/hidden unchanged); the settings-debounce +
settings-profile-parity + settings-rollback suites (the debounce
contract, the epoch key, the fallback values — all untouched); the
leads-inline min={0} NEGATIVE pin (consistent — our retire extends
the same rule); the e2e family (132 unchanged — no assertion touches
a select class string, the check svg, the panel attrs, or the
min/max attributes; the S72-P2 debounce e2e fills the CURRENCY
input, not the follow-up). No pins on: the SelectContent/SelectItem
strings (grep z-[60]/max-h-72/focus:bg-line-soft — zero test hits),
the chevron classes, the span arm. The GREEN-hazard sweep: dropping
text-ink from the trigger base — every select context (cards, filter
bars, dialogs, rails, toolbars, reports) is a light surface whose
inherited ink is #0a0a0a = text-ink's value (computed-equal
everywhere, verified by the S10-2 inheritance model); the rounded-sm
item + rounded-md content match our own MENU family's pins (the s13
verified values); the slide arms exist in the vendored
tw-animate.css (slide-in-from-top-\* utilities present).

## The execution record (2026-10-08, session-81)

EXECUTED AS PLANNED + 2 mid-flight pin-shape repairs (the runs' own
catches, both in the new suite — the s80 convention). RED: **16
failed exactly** (the new settings-defaults-parity suite's 15 + the
page-layout:765 re-anchor). The two shape repairs: (1) the
debounce-contract anchor's epoch-key pin initially sliced only the
DefaultsEditor BODY — the key lives on the CALL SITE (SettingsPage's
render); re-scoped to the full source; (2) the scaffold-retire
negatives initially read the RAW source — the Session-81 hazard
comment in select.tsx names the retired classes by design, and
Tailwind v4 scans comments, so the negatives now read the
comment-stripped source (the stripComments house convention).
Non-vacuousness PROVEN at the pre-fix state (only the test files
modified): the full suite ran **16 failed | 1583 passed (1599
total)** — exactly the modified-pin set, ZERO collateral. GREEN:
S81-P1..P7 all landed (P1 the SelectContent chrome — z-50 max-h-96
rounded-md shadow-md + all four slide-in-from-* arms + the four
per-side translates, unconditional, the position ternary retired; P2
the SelectItem rounded-sm + focus:text-neutral-900 + the BARE Check
[the blue text-primary retired]; P3 the SELECT_TRIGGER.base
re-derivation + the line-clamp-1 span arm + the bare chevron + the
select.tsx/page-layout.ts comments re-derived; P4 the three min/max
retires; P5 the TabsPanel attr trio; P6 the subtitle div; P7 the
three comment carriers). GATE: lint 0/0 · tsc 0 · **1599/1599 unit
(90 suites, +23)** · build clean · **132/132 e2e on a fresh CI=1
boot (3.3m; the FIRST run green — no flakes; all 9 mobile-nav checks
green)**. LIVE: the popover 6px radius + shadow-md + z-50 + the full
arm set; the item 4px radius + the highlighted text lab(7.78) ≈
#171717 (the reference's rgb(23,23,23) exact) + the resting #0a0a0a;
the check BARE; the span flow-root/clip/clamp-1; the chevron bare;
the follow-up min/max gone; the panel attr trio; the subtitle DIV;
the trigger's inherited #0a0a0a ink; the drawer at TRUE 390px
(full-bleed, 8 links, dual lock, focus inside; navigate → close +
locks released; Escape → inert); zero overflow ×10; the built CSS
zero (hover: hover) wraps + the new utilities compiled
(slide-in-from-top-2, line-clamp, text-neutral-900:focus, the
max-h-96 calc(var(--spacing) * 48)); the closing census MATCH (the
db pristine 15/24/10/23/12 + 4 users + the reference unchanged: demo
zero, the mobile defect standing, 256px/8 desktop). Screenshots 101
(the Defaults tab with the select popover open) + 102 (the Defaults
tab at TRUE 390px) NEW — VLM 4/5 + 4/4 PASS (the item-radius flag a
VLM-scale artifact, DOM-proven 4px — the s78/s80 precedent). Docs:
SKILL v1.78.0 (§16bu + project_state, 7212 → 7310, via the
assert-first scripts/skill_edits_s81.py at the sandbox root) + README
badge 1731 + AGENTS/CLAUDE/PAD at 1599+132 (+ the PAD s81 inventory
row + the Total 90/1599) + session_159.md + this record + the repo
worklog; .env/.env.example verified (no env surface change).
Estimate drift: +23 its exact (the new suite's 23) · 132 e2e exact ·
the e2e-waits census unchanged at 5.
