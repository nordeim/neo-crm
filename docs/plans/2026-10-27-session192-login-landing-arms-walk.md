# The session-192 plan — THE LOGIN ANON-SURFACE INTERIORS + THE LANDING MARKETING ARMS (walk65)

Date: 2026-10-27 · Rotation: 192 ·
Task: audit + validate the shipped session-191 state (commit `d991b9d` +
the owner's transcript commit `26d542e` — the session_404/405 transcripts
are this round's rotation trigger), then execute the round material the
s404 close's conditional candidates leave open (all its named arms stay
KILLED at the reference's unchanged zero-data state — the discovery
re-check), adjudicated by the discovery probe (`scripts/discover-192.ts`)
onto the genuinely unwalked surfaces it finds LIVE on BOTH apps: **the
LOGIN PAGE'S ANON-SURFACE INTERIORS** (the signin resting card + the
view machine's OPEN interiors — the signup/reset/sent views — last
walked at the s111/s126 computed-style censuses, never at the
walk53-64 OPEN-LEDGER level, never under the ids-are-construction-parity
doctrine, and stale through the s163 auth retrofit's sent-view change)
and **the LANDING PAGE'S MARKETING ARMS** (the FAQ single-open
accordion ride + the mobile disclosure menu OPEN ride — the s143/s155
walks censused the anatomy + the four-axis geometry, never the
OPEN-state interiors) — plus the round-specific operator asks
(env/db placement re-verification · the vitest/playwright config
standing check · the sitemap/SEO re-verification · the mobile-nav
two-app comparison · the Tailwind v4 bug-watch · the `.env.example`
inclusion · the dev-server captures), TDD-first, align every doc, push
to main via the SSH wrapper.

## 0. The audit (the baseline + the rotation adjudication) — DONE

The baseline gate at the shipped s191 state (the fresh clone at
`26d542e`, tree clean): lint 0/0 · tsc 0 · **138/2795** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **192/192** (clean
first run, 5.6m — after the fresh-sandbox playwright
chromium-1248 install) · probe:ref STABLE (`46bc2d9c` — the bundle md5
unchanged, the demo data still ZERO, the desktop census 256px/8 links
STANDING, the TRUE-390 census STANDING with the reference's own 1 menu
button, the landing census STANDING) · db census MATCH (15/24/10/23/12
+ 4 users at `<repo>/db/custom.db`, the ambient `DATABASE_URL` shadow
scrubbed with `env -u` on every DB-touching command — the F-123a1
doctrine) · sitemap 11 routes + robots + manifest 200 (smoke check 12)
· recharts registry latest 3.10.1 verified live (the 4.0 gate KILLED).

The rotation adjudication: probe:ref STABLE kills the fresh-bundle
candidate; the registry's `latest` 3.10.1 kills the recharts 4.0 gate.
The s404 close's conditional candidates re-checked by the discovery
(`scripts/discover-192.ts`, the standing legs):

- **The Edit-family re-check — STILL KILLED**: the reference's
  zero-row state persists (rows=1 the empty-state row alone,
  rowMenus=0 on /contacts, /leads, /accounts). The row-borne dialogs
  + the Insights family stay suspended.
- **The topbar-search dropdown gate — STILL KILLED**:
  `populated=0` on BOTH apps at the seeded-term leg (the s32
  dead-stub doctrine stands).
- **The dashboard follow-up-rows checkbox arms — STILL KILLED**
  (the reference's zero-data state persists: checkboxes=0 while OURS
  carries the seeded 7).
- **The activities Completed-tab row-action buttons — STILL KILLED**
  (the reference's empty panel: checkButtons=0 while OURS carries the
  seeded 5 toggle buttons).
- **THE LOGIN ANON SURFACES — LIVE on BOTH apps, byte-equal at the
  census level, genuinely unwalked at the OPEN-LEDGER level**: the
  signin resting card (h1 "Welcome to NEO CRM" + the subtitle + the
  Google button `368x54@1440 / 294x54@390` byte-equal + the 2-input
  vocabulary + the forgot/signup footer links + the submit) + the
  signup view ride (h2 "Create your account" + the back + the 3-input
  vocabulary) + the reset view ride (h2 "Reset your password" + the
  desc + the 1-input vocabulary) — the back-navs byte-equal on both.
  The family's standing walks were the s111/s126 computed-style
  censuses (65+ sessions stale, pre-dating the walk53-64 OPEN-LEDGER
  form, pre-dating the ids-are-construction-parity doctrine, and
  never re-walked after the s163 auth retrofit touched the sent
  view's construction).
- **THE LANDING MARKETING ARMS — LIVE on BOTH apps, byte-equal at the
  census level, never walked at the OPEN-state level**: the FAQ
  single-open ride (questions=6, Q1 open by default, the Q2 click →
  visibleAnswers=1 flips to the Q2 answer, the chevron rotate-180
  byte-equal; OURS the aria-expanded a11y superset — the standing
  s142 DEVIATION pin) + the mobile disclosure menu ride @390 (the
  hamburger `342,16 32x32` + the OPEN panel `0,64 390x229` + the
  6-link vocabulary + the icon swap + the re-toggle close — all
  byte-equal; OURS the aria-expanded superset on the toggle).
- **THE ID-PARITY FIND FAMILY the census surfaces**: the REFERENCE's
  signup confirm-password input carries `id="confirmPassword"` where
  OURS ships `id="confirm-password"`; the reference's reset view email
  input carries the bare literal `id="email"` where OURS ships
  `id="reset-email"`. Both adjudicated in WP-2 under the
  D-114a2/D-187a1/D-190a1/D-191a1/a2 ids-are-construction-parity
  doctrine (the reference's literal ids restored at every call site),
  the full id map live on both apps.

## WP-1 — The walk tool

`scripts/walk65-login-landing-arms.ts` (the walk61 multi-arm form — ONE
battery over the TWO surfaces at BOTH axes, FRESH contexts — the anon
surfaces; NO storageState on the login/landing legs, the authenticated
standing legs ride the sweep-state pair as the discovery did):

- **Phase A — per login view, the OPEN census at the desktop axis
  1440×900**: the signin resting card (the card root geometry + the
  DFS ledger [tag/cls/role/aria/id/type/for/text/geometry per node,
  the LEDGER_JS form] + the h1/subtitle faces + the Google button's
  face/box + the divider + the FULL inputs id map + the labels wiring
  map + the footer links + the submit face + the mount focus) · the
  signup view ride (the footer link click → the h2 box/cls + the back
  button + the 3-input id map + the labels + the submit face) · the
  reset view ride (the forgot link click → the h2 + the desc + the
  1-input id map + the send face) · the sent view ride (the reset ride
  + the nonexistent-email submit — write-free, the no-enumeration 200
  family — → the icon tile + the h2 + the email line + the callout +
  the back) — the back-nav round-trip after each view.
- **Phase B — the REAL keyboard Tab drive through the signin card**
  (the walk54/58/63/64 focus form: the chain through the card's
  focusables + the REAL :focus-visible faces at the email input, the
  Google button, and the submit — the programmatic face never the
  true face).
- **Phase C — the state decode**: the view-flip state round-trip (type
  a value in the signin email field → flip to reset → flip back: does
  the draft survive on either app — the client-state contract) + the
  view-ladder integrity (the five-view machine's transitions, the
  pure `nextLoginView` seam pinned OURS-side).
- **Phase D — the phone axis 390×844, per view**: the root box + the
  first input's face + the submit face + the h2 box.
- **Phase E — the FAQ arm @1440**: the resting census (Q1 open by
  default + the section box + the container width + the question
  vocabulary + the visible-answer census + the chevron states) + the
  Q2 click-open ride (the single-open decode: the Q1 answer unmounts,
  the Q2 answer mounts, the chevrons flip, the aria faces) + the Q3
  re-ride (the open-item switch).
- **Phase F — the mobile disclosure menu arm @390**: the hamburger
  resting face (box/aria/face) + the click-open ride (the OPEN panel
  box + the 6-link vocabulary + their faces) + the icon-swap decode +
  the re-toggle close + the in-panel-link-close decode.
- **Phase G — the CTA faces @both axes** (light census): the hero CTA
  pair + the pricing tier buttons' computed faces (the brand-token
  genus evidence — the reference's invisible CTAs vs ours the working
  blue).

The pairing idiom: the anon legs ride FRESH contexts on BOTH apps (no
login, no storageState — the discovery's form). The DATA-STATE
discipline: every arm is data-INDEPENDENT (the views render at zero
data; the landing is static marketing). The destructive arms are
NEVER fired (the signin/signup submits would write auth state — the
signup submit stays unwalked both apps, the verify view stays
suspended as write-gated; the ONE exception: the sent-view ride's
nonexistent-email forgot-password POST — the no-enumeration 200
family, write-free on both apps; the reference's own forgot-password
is client-side theater — never a network call).

## WP-2 — The decode

Every delta root-caused against the standing genus register (the
box-shadow SLOT-COUNT genus · the outline VERSION FORM + both
sub-forms + the COLOR-CARRIER sub-form [s178/walk61] · the token-
selection genus [the M-81c2 pairs, computed-equal] · the class-order
genus · the aria-label/a11y superset genus [s88-c9, kept — the FAQ
toggles' aria-expanded + the hamburger's aria-expanded, the standing
s142 DEVIATION family] · the React useId format genus · the
brand-token genus [the reference's `--brand` utilities never generate
— its landing CTAs render invisible; ours the working blue #2563eb,
the drawer-precedent fix-over-defect] · the text-node cardinality face
[the s155 pricing-pair decode] · the oklab/rgba serialization noise
[s126, L-126c8/L-126c9] · the zinc-vs-neutral inherited-foreground
noise [s126]) + the v3-semantics lineage re-check (s11/s96/s98/s123/
M-92c1/D-187a3 — the login card's space-y arms + the landing's
marketing stacks) + **THE ID-PARITY adjudication**: the full DFS id
map live on both apps per view, every id delta classified under the
D-114a2/D-187a1/D-190a1/D-191a1/a2 ids-are-construction-parity
doctrine (the reference's literal ids restored; the aria supersets
kept — aria-label wins the accessible-name computation). Target: ZERO
live defects, every delta a documented genus or a kept superset,
every id find cured or decoded.

## WP-3 — TDD

Born-green contract-freeze pins (the s173 P-p/P-q precedent, the
s178-191 continuation), all in the existing suites (the ADR-017
one-suite doctrine — page-layout for the construction freezes, the
login-family suite for the view contracts) — the pin survey FIRST
(the standing families: the s11 LOGIN_RESET_LAYOUT + the s21
login-views vocabulary + the s79 verify-view pins + the s111
login-family-parity five-view pins + the s126 three-fix pins + the
s142 landing-page FAQ/menu pins + the s143 F-143c2 FAQ-container pin):

1. the walk65 decode freeze (the tool's own contract — the four-view
   OPEN ledgers + the Tab chain + the state decode + the FAQ/menu
   arms at both axes);
2. the LOGIN open-interior construction freeze (the genuine battery
   gap: the s11/s21/s79/s111 pins hold OUR wiring regexes + the
   computed-style contracts, never the call-site chains at the
   walk65 level — the signin card chain + the signup view chain +
   the reset view chain + the sent view chain);
3. the LANDING marketing-arms construction freeze (the same gap: the
   s142 pins hold the component-level regexes, never the call-site
   chains — the FAQ single-open chain + the mobile-menu panel chain);
   + THE CURE PINS (RED-first: exactly N RED at birth → the cures →
   GREEN) for every live find the walk decodes (the D-192a1
   confirm-password literal id + the D-192a2 reset-email literal id),
   each with its collateral re-anchor (the e2e label-based selectors
   ride unchanged; any login-family-parity pin holding the old ids
   re-anchored).

## WP-4 — Proofs

MUTATION-PROOF (a planted construction regression on a walked
contract → exactly 1 RED per planted cure → restored → GREEN) ·
STASH-PROOF (the round's test block stashed alone → exactly
**138/2795** [the s191 ship state] → restored → 138/2795+N) · the walk
re-run stable on the walked tree (the delta report byte-identical
modulo the cures).

## WP-5 — Count ladder + docs

2795 → 2795+N (the walk65 pins + the cure pins) · badge 2987 →
2987+N (count-ladder-192.py: the house assert-first idempotent form,
the s187/s188/s189/s190/s191 lessons applied — the head surgery runs
BEFORE the ladder, the TRUE count verified at the full-suite count,
no retired-block carrier form in the old-forms) · the collateral
re-anchors (the SKILL §5.6 census checks · the F-106a1 layer-axis
pin — the s192 layer live, the s191 demoted beneath it at 2795/192)
· the docs lockstep (the AGENTS Session-192 section · the PAD
session-192 inventory row · the CLAUDE page-layout bullet's walk65
tail · the README Tested row's walk65 clause + the badge · the SKILL
head surgery [skill-head-192.py, idempotent] · session_406.md + this
plan's execution record + the worklog entry [Task ID 192]).

## WP-6 — Captures + the operator asks

- The captures (docs/screenshots/): the round's ours+ref faces (the
  four login views ours+ref at the desktop axis + the FAQ open pair +
  the mobile-menu open pair at the phone axis) + the standard
  dev-server page set for the operator's record.
- The `.env.example` verified against the codebase contract (the
  six-knob family; committed as-is, included in this round's commit
  per the operator's instruction).
- The sitemap/SEO standing re-verified (smoke check 12: the 200s ·
  the 11 routes + the robots Sitemap line + the per-route OG/Twitter
  factory).
- The mobile-nav comparison: probe:ref TRUE-390 STANDING (the
  reference's own menu button live — this session's probe re-verified
  it) + the drawer battery GREEN carry the verdict — documented in
  the session record.
- The Tailwind v4 state (the bug-watch): every walk delta decoded
  against the standing genus register — the v3-semantics lineage
  (s11/s96/s98/s123/M-92c1/D-187a3) checked at every WP-2 arm.

## The execution checklist (the operator's round-shaped asks)

| Ask | State | The round's evidence |
| --- | --- | --- |
| `.env` DATABASE_URL = `file:../db/custom.db`, db/ at repo root | DONE (intake) | census MATCH at `<repo>/db/custom.db` |
| vitest + playwright suites via the config files | STANDING (verified) | 138/2795 unit + 192/192 e2e this session |
| Sitemap + SEO | STANDING (re-verified) | smoke check 12; the 11-route sitemap + robots + manifest |
| Mobile nav menu parity | STANDING (re-verified) | probe:ref TRUE-390 STANDING (this session's run) |
| Tailwind v4 bug watch | STANDING | the genus register walked against every WP-2 delta |
| `.env.example` matches + in the commit | VERIFIED | the six-knob contract audit |
| Screenshots under docs/screenshots/ | WP-6 | the round's captures |
| Docs alignment | WP-5 | the lockstep ledger |
| Commit + push via the SSH wrapper, main only | FINAL | the dry-run + the push + the remote verify |

---

## The execution record (2026-10-27, session-192)

- **The audit GREEN** — the baseline gate at the shipped s191 state
  (the fresh clone at `26d542e`, tree clean): lint 0/0 · tsc 0 ·
  138/2795 · build · smoke 14/14 · e2e 192/192 (clean first run, 5.6m —
  after the fresh-sandbox playwright chromium-1248 install) · probe:ref
  STABLE (46bc2d9c — the demo data still ZERO, the desktop + TRUE-390 +
  landing censuses STANDING) · census MATCH (15/24/10/23/12 + 4 users)
  · sitemap 11 routes + robots + manifest 200 · the Tailwind v4 state
  clean · the operator's standing asks verified (env/db placement ·
  the vitest/playwright configs · sitemap/SEO · mobile-nav ·
  `.env.example`).
- **The rotation adjudication** — probe:ref STABLE kills the
  fresh-bundle candidate; recharts latest 3.10.1 kills the 4.0 gate;
  the s404 close's conditional candidates re-checked by the discovery
  (`scripts/discover-192.ts`): the Edit-family STILL KILLED (rows=1
  the empty-state row, rowMenus=0), the topbar-search gate KILLED
  again (populated=0), the dashboard follow-up-rows + the activities
  Completed-tab STILL KILLED (the zero-data state persists); **the
  round material = the s404 close's own naming — the LOGIN
  ANON-SURFACE INTERIORS + the LANDING MARKETING ARMS — LIVE on BOTH
  apps, byte-equal at the census level** (the discovery's L1/L2/L3 +
  M1/M2 censuses); the plan landed + validated against the codebase,
  executed TDD.
- **WP-1 GREEN** — `scripts/walk65-login-landing-arms.ts` (the walk61
  multi-arm form over the TWO surfaces at BOTH axes on FRESH
  contexts: Phase A per view the OPEN census — the card roots
  byte-equal at 496,95 448x710 / 16,73 358x650 (signin) + 496,215
  448x470 / 16,187 358x422 (signup) + 496,263 448x374 / 16,243
  358x310 (reset) + 496,251 448x398 / 16,221 358x354 (sent) + the DFS
  ledger + the FULL inputs id map + the labels wiring map + the
  google button + the submit/back faces + the mount focus (body on
  BOTH) + the back-navs byte-equal; Phase B the REAL Tab drive — the
  chains STRUCTURALLY IDENTICAL through the card [7 stops both; the
  7th stop's escape the s149 platform-pill genus] + the REAL
  :focus-visible faces — the email input's ring byte-equal on the
  VISIBLE layers [white 2px + slate-400 4px both], the google button
  byte-equal; Phase C the draft decode [OURS keeps the typed email —
  the KEPT house superset; the reference clears it — its own defect]
  + the sent-ride write-free [the nonexistent-email POST, the
  no-enumeration 200 family]; Phase D the phone axes byte-equal;
  Phase E the FAQ single-open ride [the Q2/Q3 flips + the chevron
  rotate-180 + the max-w-3xl container byte-equal]; Phase F the
  mobile menu ride [the hamburger + the OPEN panel + the 6-link
  vocabulary + the icon swap + the re-toggle close — byte-equal];
  Phase G the CTA faces [byte-equal modulo the brand-token genus]);
  the walk re-run STABLE (the delta report byte-identical modulo the
  cures).
- **WP-2 GREEN — THREE LIVE FINDS CURED**: D-192a1 the signup confirm
  literal id (confirm-password → confirmPassword + for= the same) ·
  D-192a2 the reset view's bare literal email id (reset-email → email
  + for= the same — no collision, the views never render
  simultaneously) · D-192a3 the auth-card dark submits' REAL
  focus-visible ring (ring-slate-400 → ring-ring at all four submit
  sites — the first REAL-keyboard-face ring find, live-walked via
  Phase B + scripts/micro-probe-192-submit-faces.ts; the INPUTS'
  byte-equal slate-400 rings stay); the re-walk PROVES the id/for
  ledger deltas GONE + the submit's REAL ring now the reference's
  family (rgb(10,10,10) vs rgb(9,9,11) — the 1-unit L-126c6 residue);
  every remaining delta a documented genus or kept superset (the
  slot-count · the outline version · the oklab/rgba noise · the
  zinc-vs-neutral residue · the class-order · the token genus · the
  aria-hidden superset · the brand-mark logo genus · the lucide
  path-order · the v3-semantics space-y lineage · the stock-label
  inert arms · the body-bg invisible axis · the platform artifacts).
- **WP-3 GREEN** — the pin survey first (the s11/s21/s79/s111 login
  families + the s142 landing pins + the walk53-64 decode freezes),
  then the battery: 3 born-green pins in page-layout (the walk65
  decode freeze · the LOGIN open-interior construction freeze · the
  LANDING marketing-arms construction freeze) + THE THREE CURE PINS
  (RED-first: exactly 3 RED at birth → the cures → GREEN) + the
  collateral re-anchors (the s79 login-family-parity submit/send pins
  + the s11 login-reset send record — ring-slate-400 → ring-ring in
  the same commit as the cure).
- **WP-4 GREEN** — MUTATION-PROOF (the planted id="confirmPassword"
  regression → exactly 1 RED → restored → GREEN, no residual) ·
  STASH-PROOF (the round's page-layout block stashed → exactly
  138/2795 [the s191 ship state] → restored → 138/2801 — no
  undercount) · the walk re-run STABLE.
- **WP-5 GREEN** — skill-head-192.py ran FIRST (the SKILL v1.189.0,
  the s191 layer demoted at its ship counts 2795/192, the s192 layer
  live, idempotent; the retired s191 ship line PINNED by the
  generalized D-188a1 doctrine's next member in docs-counts) ·
  count-ladder-192.py (2795 → 2801 [+6] · badge 2987 → 2993
  [2801+192]; assert-first, idempotent — 21 flips) · the docs
  lockstep (the AGENTS Session-192 section · the PAD s192 inventory
  row · the CLAUDE page-layout bullet's walk65 tail · the README
  Tested row's walk65 clause + the badge · session_406.md + this
  execution record + the worklog entry [Task ID 192]) · the
  docs-counts re-anchors (the UNIT constant 2801 · the F-106a1
  layer-axis [the s192 first layer + the s191 second] · the
  retired-s191 ship-line pin · the §5.6 census 274 checks + the
  census-era + the re-anchor + the RED-first arithmetic).
- **WP-6** — the captures (docs/screenshots/: the four login views
  ours+ref at the desktop axis + the FAQ open pair + the mobile-menu
  open pair at the phone axis + the standard dev-server page set) +
  the operator asks all verified standing.
- **THE VERIFICATION LEDGER** — lint 0/0 · tsc 0 · 138/2801 · build ·
  smoke 14/14 · e2e 192/192 · db census MATCH · probe:ref STABLE ·
  the four login views + both landing arms byte-equal on both axes
  (post-cure) · the REAL Tab chains structurally identical (7 stops
  both).
- **SHIPPED** — committed on main + pushed via
  `docs/ssh_git_wrapper_v3.py` (the remote verified; no new branches).
