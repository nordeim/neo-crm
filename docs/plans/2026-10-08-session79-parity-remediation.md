# Session-79 Parity Remediation Plan (2026-10-08)

Session 79 on `main` @ `8c679b6` (the s78 ship `da8d2b6` + one
docs-only session-log commit — `docs/session_152.md`, ZERO code drift).
The workspace SURVIVED s78: the environment verified in place (`.env`
with `DATABASE_URL="file:../db/custom.db"` + the db/ folder at the repo
root; census MATCH 15/24/10/23/12 + 4 users). The documented intake
hazard STANDS (the platform `DATABASE_URL` override points at a
non-existent mirror; all session-79 repo operations run under
`env -u DATABASE_URL`). **Baseline gate on HEAD: lint 0/0 (enforced) ·
tsc 0 · 1523/1523 unit (87 suites) · playwright --list 132 in 4 files**
— the documented state exact; the `skills/` exclusion verified in all
three configs (eslint ignores + tsconfig exclude + vitest include-scope).

## The standing layers (75th session, NO DRIFT)

Drift sweep #75: the reference bundle fresh-fetched from
`/assets/index-DZ-xbrIm.js` — size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` **exact — the 50th consecutive
stable session**. Reference census #75 (agent-browser, live login at
1440 then a TRUE 390px viewport): the demo data still zero (the KPI
values 0/$0.0k/$0.0k/$0k/0%); the mobile-nav defect STANDS at a TRUE
390px (vw=390, nav w=0, 8 links in DOM, 0 visible, no hamburger);
desktop nav normal (256px, 8 links, all visible). Our mobile drawer
stays the deliberate documented superset.

## The audits (two parallel agents + the orchestrator's own fresh-eyes
rotation, every parity claim LIVE-EXTRACTED from the reference — the
login card is PLATFORM code, not app-bundle code: zero auth markers
exist in the 1.63MB bundle, so the rotation ran on live DOM + computed
probes at 1440 AND 390 on BOTH apps)

**79-a** — the s78 re-audit: **12/12 checklist items GENUINE** (every
S78-P1..P10 fix at file:line; the parity suite re-ran 28/28; the
da8d2b6 commit honest [20 files, +1066/−196, 5 added / 15 modified,
zero strays]; 8c679b6 docs-only). Two nano notes (the P1 shorthand
omits the style object's backgroundColor arm — the plan's own wording
is exact; the Sparkline docstring's opening phrase is a loose
superset of the P9 pin's target — zero functional impact).

**79-b** — the graduation audit: **ZERO graduations, 13/13 (the 36th
consecutive)**; the 8 mechanical censuses 7 CLEAN + **ONE finding**:
`CLAUDE.md:115` + `:299` still read "(131 checks)" for the e2e layer
while `:38` correctly reads 132 — stale since the s76 131→132 bump
(three realignments + three census sweeps missed the e2e-carrier
lines; the N-50a/AGENTS:29 class). A two-line docs fix (S79-P15).
Both operator decisions' evidence INTACT.

**79-c** — the fresh-eyes rotation on the LOGIN/SIGNUP CARD FAMILY
(the session_151 suggested target — never a dedicated rotation; the
login-card 658 + login-reset.ts 245 + the two page wrappers + the
verification seam + the five-view machine + the e2e funnel): the
foundations SOLID (the page/cradle/inner/centered/accent/title/
subtitle/Google/divider/footer families byte-equal; the five-view
state machine; the sent view's icon tile + callout + back; the verify
email line + code-input geometry + resend line; the error/info
callout classes; the reset/signup input one-size-down heights +
lighter placeholders; the canSubmitReset guard) — the **N-79 family:
5 M + 6 L + 5 N**, every M/L claim LIVE-extracted from the reference
at 1440 AND 390 and cross-probed on our own dev server:

- **M-79c1 CONFIRMED (live-measured, both apps)** — the AUTH
  TEXT-SIZE LADDER: the reference's auth inputs and submits compute
  **14px at desktop** — the signin inputs carry the stock
  `text-base md:text-sm` (LIVE: 16px at 390 / 14px at 1440), the
  signin submit `text-sm` (14px at ALL widths), the reset input the
  same `text-base md:text-sm`, the reset Send + the signup Create +
  the verify Verify submits `text-sm`, and the SIGNUP inputs the
  three-rung `text-sm sm:text-base` riding the stock `md:text-sm`
  (14px <640 / 16px 640–767 / **14px ≥768** — the md: arm re-narrows
  what sm: widened, LIVE-measured 14px at 1440). OURS ships NO
  text-size classes on any auth input or submit (a flat 16px
  everywhere) except the signup input (`text-sm sm:text-base` —
  missing the md:text-sm arm) and the code inputs (`md:text-sm`
  correct). LIVE: ours 16px vs the reference 14px at 1440 on the
  signin input + both submits; the mobile parity holds (16px = 16px).
- **M-79c2 CONFIRMED (live-measured, both apps)** — the
  BACK-BUTTON OVERLAP: the s21 "-mb-2 mirrors verbatim" claim is
  v4-FALSIFIED. Under our v4 space-y (`:where()` margin-BOTTOM), the
  back button's own `-mb-2` (0,1,0) WINS the specificity fight and
  computes a **−8px gap (an OVERLAP)** — LIVE on our dev server: the
  signup view's back→h2 gap = **−8** where the reference measures
  **+8 at BOTH 390 and 1440** (its v3 margin-TOP space-y collapses
  16−8=8 under the constant space-y-4). The same `-mb-2` rides OUR
  verify view's back (the same overlap). The s11 hazard the s21
  analysis claimed immune — it is not: the h2's wrapper div inherits
  the overlap the same way.
- **M-79c3 CONFIRMED (live-extracted)** — the VERIFY-EMAIL ICON
  GLYPH: the reference's verify tile renders a **lucide
  `ShieldCheck`** (`lucide-shield-check h-7 w-7 sm:h-8 sm:w-8
  text-slate-700` inside the w-14/16 slate-100 circle); OURS renders
  a **Mail** icon — the wrong glyph since s21 (the tile classes were
  extracted; the glyph was assumed to be the sent view's).
- **M-79c4 CONFIRMED (live-probed, both apps)** — the AUTH INPUT
  FOCUS RING: the reference's focused auth input computes
  `box-shadow: rgb(255,255,255) 0 0 0 2px, rgb(148,163,184) 0 0 0
  4px` — a SOLID slate-400 2px ring + a 2px WHITE offset (the stock
  `focus-visible:ring-2 focus-visible:ring-ring
  focus-visible:ring-offset-2` + the platform's slate-400 ring) with
  the border going slate-400. OURS: `focus:ring-2
  focus:ring-slate-400/30` — a 30%-OPACITY ring, NO offset
  (LIVE: `oklab(... / 0.3) 0 0 0 2px` only).
- **M-79c5 CONFIRMED (live-probed, both apps — the N-77c17
  adjudication)** — the stock TABLEHEAD token: the reference's th
  carries `h-10 px-2 text-left align-middle font-medium
  **text-muted-foreground**` and computes **rgb(115,115,115)**
  (#737373) on every table (probed on /accounts); OURS ships
  `text-muted` (#6b7280, rgb(107,114,128)) — ONE SHADE DARKER on
  every table family-wide, deferred since s77. The computed-equal
  expression of #737373 in our token system is `text-muted-ink`
  (the s10 muted-ink token the tabs track + placeholders already
  ride).
- **L-79c6 CONFIRMED (live-extracted, all five views)** — the
  MISSING MOBILE SPACER: every reference auth view ships a trailing
  `<div class="mt-8 text-center text-xs text-slate-400 sm:hidden">
  <p>&nbsp;</p></div>` inside the `w-full max-w-md` wrapper AFTER the
  card (LIVE at 390: display block, 16px tall + the 32px mt-8; hidden
  ≥640). OURS: absent entirely.
- **L-79c7 CONFIRMED (live-extracted)** — the VERIFY view's MISSING
  HINT LINE: the reference renders `<p class="text-xs text-slate-500
  text-center mt-3">Enter the verification code sent to your
  email</p>` under the six code inputs (inside the same plain wrapper
  div as the codeWrap). OURS: absent.
- **L-79c8 CONFIRMED (live-extracted)** — the VERIFY view's
  STACK/FORM spacing: the reference's verify viewStack is
  `space-y-4 **sm:space-y-6**` and its form `space-y-4
  **sm:space-y-6**`; OURS ships `space-y-4` (no sm arm) + reuses the
  SIGNUP form family (`space-y-3 sm:space-y-4`) — 8px tight at
  desktop on both seams.
- **L-79c9 CONFIRMED (live-measured, both apps)** — the RESET back's
  RESPONSIVE gap: the reference's reset back→title gap computes
  **8px at 390** (the -mb-2 collapse under space-y-4) and 16px at
  ≥640 (under sm:space-y-6) — the s11 `mb-4` re-expression was
  probed at desktop only and ships a FLAT 16px (LIVE: ours 16px at
  390 where the reference measures 8).
- **L-79c10 CONFIRMED (live-extracted)** — the INPUT-ICON COLOR
  SPLIT: the reference's SIGNIN icons are `text-slate-500` but the
  RESET + SIGNUP views' mail/lock icons are `text-slate-400` (the
  lighter placeholder family extends to the icons); OURS uses
  LOGIN_LAYOUT.inputIcon (slate-500) on every view.
- **L-79c11 CONFIRMED (live-extracted)** — the CODE-INPUT EXTRAS:
  our six verify code inputs carry `shadow-sm transition-colors` +
  `focus-visible:ring-offset-2` that the reference's flat stock code
  inputs do NOT ship (the platform's OTP boxes: `flex rounded-lg
  border border-input bg-background px-3 py-2 …
  focus-visible:ring-2 focus-visible:ring-ring` — no shadow, no
  transition, no offset); ours also carries a redundant inline
  `h-11` beside the codeInput's own `w-10 h-11`.
- **N-79c12 CONFIRMED (class-diff)** — the SUBMIT CHROME: the
  reference's auth submits carry the stock
  `disabled:pointer-events-none disabled:opacity-50` + the keyboard
  `focus-visible:ring-2 focus-visible:ring-ring
  focus-visible:ring-offset-2`; OURS: no disabled styling (the
  pending state shows only the label swap) + no focus-visible ring.
- **N-79c13 CONFIRMED (live-extracted)** — the SENT-CALLOUT text
  node: the reference's sent callout carries its text as a BARE text
  node inside the `[&_p]:leading-relaxed` div (the selector never
  fires — the line-height inherits ~1.5); OURS wraps it in `<p>`
  (leading-relaxed 1.625 fires). Same for the error/info callouts'
  `<p>` wrappers.
- **N-79c14 CONFIRMED (rg: zero consumers)** — the dead
  `LOGIN_VERIFY_LAYOUT.back2` record member (the verify view has no
  bottom back button on either app) — the dch policy retirement.
- **N-79c15 DOCUMENTED PARITIES (no change)** — the label
  peer-disabled:* stock classes (computed-equal — the auth inputs are
  never disabled); our signup `minLength={8}` + autoComplete
  attributes (a11y supersets); the CSS brand mark (the documented
  no-external-asset decision — the reference hotlinks a screenshot);
  the nested heading wrapper (computed-equal gaps); the form's
  `w-full` (computed-equal: 368px both apps); the card's
  text-card-foreground (nothing visible inherits it).
- **N-79b1 (79-b's finding)** — the CLAUDE.md stale e2e counts.

## The operator decisions (38th re-affirmation)

The **CSV formula-injection posture (b) STANDS** — the 79-b
re-verification: `guardFormulaPrefix` intact at csv.ts:31-33 applied
in `escapeCell` AND imported into entity-export.ts's `qq`; the `-`
exclusion documented; **ZERO new unguarded builders** (the login
family ships ZERO CSV surfaces — no export affordance exists on any
auth view; the 79-c rotation re-verified end-to-end); the reference
bundle byte-stable for the 50th consecutive session; no new evidence
moves the (a) parity / (c) full-OWASP alternatives.

The **source-vocabulary documented parity STANDS** — the 79-b census
re-confirmed every anchor at file:line (both OPTIONS arrays pinned
with the in-file posture comments; NO enum-membership on the four
validation sites; the settings Capitalized defaults verbatim). The
login family introduces NO vocabularies (emails / passwords / OTP
digits only — freeform fields with hand-rolled validation at the
route boundary). Wire values stay raw.

## The remediation set (TDD — RED first, then GREEN)

- **S79-P1 (M-79c1) — the auth text-size ladder**:
  `LOGIN_LAYOUT.input` + `LOGIN_RESET_LAYOUT.resetInput` gain
  `text-base md:text-sm`; `LOGIN_LAYOUT.submit` +
  `LOGIN_RESET_LAYOUT.send` gain `text-sm` (the send is the shared
  signup/verify submit — one member fixes three surfaces);
  `LOGIN_SIGNUP_LAYOUT.input` gains the `md:text-sm` arm after its
  `text-sm sm:text-base` (the three-rung 14/16/14 ladder).
- **S79-P2 (M-79c2) — the back-button overlap**: `LOGIN_SIGNUP_LAYOUT
  .back` + `LOGIN_VERIFY_LAYOUT.back`: `-mb-2` → `mb-2` (the
  v4-correct flat 8px — the reference's computed gap at both widths);
  the stale s21 comments re-derive; the login-views pin re-anchors.
- **S79-P3 (M-79c3) — the ShieldCheck glyph**: the verify view's
  tile icon swaps Mail → ShieldCheck (the lucide import re-derives).
- **S79-P4 (M-79c4) — the focus-ring construction**: the three input
  records' focus arm becomes `focus:outline-none focus:ring-2
  focus:ring-slate-400 focus:ring-offset-2` (the computed 2px solid
  slate-400 ring + the 2px white offset; the border arm
  `focus:border-slate-400` stays).
- **S79-P5 (M-79c5) — the N-77c17 TableHead sweep**: table.tsx's
  stock th goes `text-muted` → `text-muted-ink` (the computed-equal
  of the reference's text-muted-foreground #737373) + the in-file
  comment; every per-surface th override (contacts gray-700 etc.)
  stays.
- **S79-P6 (L-79c6) — the mobile spacer**: LoginCard renders the
  trailing `<div className="mt-8 text-center text-xs text-slate-400
  sm:hidden"><p>&nbsp;</p></div>` after the card inside the
  `w-full max-w-md` wrapper (all views — it rides the card, not any
  single view).
- **S79-P7 (L-79c7 + the wrapper) — the verify hint line**: the
  codeWrap + the hint `<p className="text-xs text-slate-500
  text-center mt-3">Enter the verification code sent to your
  email</p>` wrap in a plain `<div>` inside the form (the reference's
  own structure — the hint's mt-3 must NOT ride the form's space-y).
- **S79-P8 (L-79c8) — the verify stack/form**:
  `LOGIN_VERIFY_LAYOUT.viewStack` → `space-y-4 sm:space-y-6`; a new
  `LOGIN_VERIFY_LAYOUT.form` = `space-y-4 sm:space-y-6` replaces the
  signup-form reuse at the verify call site.
- **S79-P9 (L-79c9) — the reset back's responsive gap**:
  `LOGIN_RESET_LAYOUT.back`: `mb-4` → `mb-2 sm:mb-4` (8px <640,
  16px ≥640 — the LIVE-measured ladder); the login-reset pin
  re-anchors.
- **S79-P10 (L-79c10) — the icon color split**: the reset + signup
  views' input icons render the lighter `text-slate-400` family (a
  per-record `inputIcon` member on LOGIN_RESET_LAYOUT +
  LOGIN_SIGNUP_LAYOUT; the signin view keeps slate-500).
- **S79-P11 (L-79c11) — the code-input extras**: the inline code
  input classes drop `shadow-sm`, `transition-colors`,
  `focus-visible:ring-offset-2` + the redundant `h-11` (the flat
  stock mirror: `flex rounded-lg border border-input bg-background
  px-3 py-2 focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-ring` + the codeInput member).
- **S79-P12 (N-79c12) — the submit chrome**: the four submit
  records gain `disabled:pointer-events-none disabled:opacity-50` +
  `focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-slate-400 focus-visible:ring-offset-2` (the
  computed-equal keyboard ring — the platform's ring-ring computes
  slate-400 on the auth pages).
- **S79-P13 (N-79c13) — the callout text nodes**: the sent
  callout's (and the error/info callouts') text renders as a BARE
  text node (the `<p>` wrappers retire — the `[&_p]:leading-relaxed`
  arm stays inert like the reference's own).
- **S79-P14 (N-79c14) — the back2 retirement**: the dead
  `LOGIN_VERIFY_LAYOUT.back2` member retires (the dch policy).
- **S79-P15 (N-79b1, docs phase) — the CLAUDE.md counts**: `:115` +
  `:299` "(131 checks)" → 132.

No new e2e: the auth funnel's behavior is unchanged (view swaps,
guards, the resend ladder all stay); the family's e2e coverage
already drives the full funnel (auth.spec.ts). The text-size/gap/
glyph/spacer changes are unit-pinned + LIVE-verified in the battery
(the s76/s77 precedent for timing-insensitive surfaces).

## Blast radius (pre-checked)

The pins that RE-ANCHOR in lockstep: `tests/login-reset.test.ts:63`
(the mb-4 pin → mb-2 sm:mb-4); `tests/login-views.test.ts:168-180`
(the -mb-2 pin → mb-2). SURVIVES untouched: the page-layout
LOGIN_LAYOUT input/submit pins (toContain — the text classes append);
the login-views form/stack pins (the signup families unchanged); the
verify submit pin (`toBe(LOGIN_RESET_LAYOUT.send)` — the send gains
text-sm for all three consumers at once); the codeInput/codeWrap/
resend pins (unchanged members); the login-views machinery pins (the
verification seam untouched); the table-kit stock pins (the head pin
matches the density + checkbox variants — the color token is not
pinned there; the NEW pin lands in the parity suite); the e2e family
(132 unchanged — the auth spec drives behavior, not classes; the
mobile-nav suite is untouched by the sm:hidden spacer which lives on
the auth pages only). No pins on: the text ladder, the focus ring,
the ShieldCheck glyph, the spacer, the hint line, the verify
stack/form, the icon colors, the code-input extras, the submit
chrome, the callout text nodes.

## The execution record (2026-10-08, session-79)

EXECUTED AS PLANNED with FIVE mid-flight pin-shape repairs (all caught
by the RED/GREEN runs themselves, the s77/s78 class: the mb-4 negative
regex — a plain ` mb-4` needle replaces the lookbehind \b form; the
Mail-glyph needle re-scoped to the verify tile's own record reference;
the hint literal living in the RECORD not the card — the pin re-scoped
to LOGIN_VERIFY_LAYOUT.hint/hintLine; the wrapper-div structural
assertion rewritten as a single regex; the send-record toBe re-anchor
— the blast-radius survey missed that the login-reset suite pins the
send record's FULL string, the +chrome/text-sm additions re-anchored
it) + ONE structural repair (the mobile spacer's first insertion
landed INSIDE the card after the accent strip — the MultiEdit
half-applied and duplicated the inner div; repaired to the reference's
own position AFTER the card close, inside the max-w-md wrapper). RED:
**34 failed exactly** (the login-family-parity suite's 32 + the 2
re-anchors [login-reset :63 mb-4 → mb-2 sm:mb-4 + login-views :168
-mb-2 → mb-2]). Non-vacuousness PROVEN at the pre-fix state (only the
test files modified): the full suite ran **34 failed | 1526 passed**
— exactly the modified-pin set, ZERO collateral. GREEN: S79-P1..P15
all landed (P1 the text ladder — text-base md:text-sm on the
signin/reset inputs, text-sm on the signin submit + the shared send
record [reset/signup/verify at once], the signup input's md:text-sm
arm; P2 mb-2 on the signup/verify backs + the comments re-derived; P3
the ShieldCheck import + the tile swap; P4 the focus:ring-2
focus:ring-slate-400 focus:ring-offset-2 construction on the three
input records; P5 the table.tsx text-muted-ink sweep + the in-file
comment; P6 the trailing spacer after the card; P7 the hint + the
plain wrapper div; P8 the verify viewStack/form space-y-4 sm:space-y-6
+ the form call site; P9 mb-2 sm:mb-4 on the reset back; P10 the
inputIcon records on RESET/SIGNUP + the call sites; P11 the flat stock
code inputs (the inline h-11/shadow-sm/transition-colors/ring-offset
retired); P12 the disabled + focus-visible chrome on the four submit
records; P13 the bare-text callouts (sent + error + info); P14 the
back2 retirement; P15 the CLAUDE.md :115/:299 132-pair). GATE: lint
0/0 · tsc 0 · **1561/1561 unit (88 suites, +38)** · build clean ·
**132/132 e2e on a fresh CI=1 boot (3.2m; the first run caught the
documented s72 settings flake — S72-P2 re-ran green in isolation AND
the full re-run green, the s74/s76 precedent; all 9 mobile-nav checks
green)**. LIVE: the signin input + submit 14px at 1440 (was 16); the
focused input's box-shadow `rgb(255,255,255) 0 0 0 2px, slate-400 0 0
0 4px` — byte-identical to the reference's construction; the signup
gap +8px (was −8px OVERLAP); the reset ladder 8px at 390 / 16px at
1440; the spacer visible at 390 (16px); the icons slate-400; the
verify tile `lucide-shield-check h-7 w-7 sm:h-8 sm:w-8 text-slate-700`;
the hint 12px slate-500; the code inputs shadow-none at 44px; the th
rgb(115,115,115) = the reference exact; the drawer at TRUE 390px
(full-bleed, 8 links, focus inside, body locked; Escape → inert +
hidden + unlocked); zero overflow ×10; NO Tailwind v4 bug (blur 4px +
the shadow-sm re-pin + rounded-sm 4px); the closing census MATCH
(256px/8) + the pristine census restored post-probe (db:seed → MATCH
15/24/10/23/12 + 4 users). Screenshots 97 (the login text-ladder +
focus ring) + 98 (the reset mobile ladder + spacer) NEW — VLM 5/5 +
4/4 PASS. Docs: SKILL v1.76.0 (§16bs + project_state, 7065 → 7129,
via the assert-first scripts/skill_edits_s79.py at the sandbox root —
the frontmatter + H1 bumped together per the s78 promise) + README
badge 1693 + AGENTS/CLAUDE/PAD at 1561+132 (+ the PAD s79 inventory
row) + session_153.md + this record + the repo worklog;
.env/.env.example verified (no env surface change; DATABASE_URL
file:../db/custom.db with db/ at the repo root). Estimate drift: +38
its exact (the new suite + the hint-record pin split) · 132 e2e exact
· the e2e-waits census unchanged at 5.
