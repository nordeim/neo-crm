# The session-194 plan — THE 404 INTERIOR'S INTERACTIVE ARMS (walk67)

Date: 2026-10-27 · Rotation: 194 ·
Task: audit + validate the shipped session-193 state (commit `a489314` +
the owner's transcript commit `8349d01` — the session_409 transcript is
this round's rotation trigger), then execute the round material the
s408 close's conditional candidates leave open (all its named suspended
arms stay KILLED at the reference's unchanged zero-data state — the
discovery re-check), adjudicated by the discovery probe
(`scripts/discover-194.ts`) onto the genuinely unwalked surfaces it
finds LIVE on BOTH apps: **the 404 INTERIOR'S INTERACTIVE ARMS** (the
s408 close's own naming: "the 404/error-boundary interiors' interactive
arms, if any surface beyond the census gate's coverage") — the designed
404 view the s12 construction built (NOT_FOUND_LAYOUT + the crm.spec
render test hold the strings) but NEVER walked at the walk53-66
OPEN-LEDGER level: no DFS ledger, no Go Home arm decode, no REAL
keyboard Tab chain, no REAL :focus-visible face, no ride, no phone
axis, no title census; the family is 180+ sessions stale against the
reference's CURRENT build (the s12 decode predates every bundle
rotation since — the SKILL's own standing rule: "treat any s-pin older
than the current audit as provisional until re-verified") — plus the
round-specific operator asks (env/db placement re-verification · the
vitest/playwright config standing check · the sitemap/SEO
re-verification · the mobile-nav two-app comparison · the Tailwind v4
bug-watch · the `.env.example` inclusion · the dev-server captures),
TDD-first, align every doc, push to main via the SSH wrapper.

## 0. The audit (the baseline + the rotation adjudication) — DONE

The baseline gate at the shipped s193 state (the pull to `8349d01`,
tree clean): lint 0/0 · tsc 0 · **138/2805** unit · build (the
type-gate artifact) · smoke **14/14** · e2e **192/192** (clean first
run, 5.7m) · probe:ref STABLE (`46bc2d9c` — the bundle md5 unchanged,
the demo data still ZERO, the desktop census 256px/8 links STANDING,
the TRUE-390 census STANDING with the reference's own 1 menu button,
the landing census STANDING) · db census MATCH (15/24/10/23/12 + 4
users at `<repo>/db/custom.db`, the ambient `DATABASE_URL` shadow
scrubbed with `env -u` on every DB-touching command — the F-123a1
doctrine) · sitemap 11 routes + robots + manifest 200 (smoke check 12)
· recharts registry `latest` 3.10.1 verified live (the 4.0 gate
KILLED).

The rotation adjudication: probe:ref STABLE kills the fresh-bundle
candidate; the registry's `latest` 3.10.1 kills the recharts 4.0 gate.
The s408 close's conditional candidates re-checked by the discovery
(`scripts/discover-194.ts`, the standing legs):

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
- **THE 404 INTERIOR — LIVE on BOTH apps, byte-equal at the skeleton
  level, genuinely unwalked at the OPEN-LEDGER level** — with FIVE
  finds the discovery + micro-probes (`scripts/micro-probe-194-404-interior.ts`
  + `scripts/glyph-probe-194.ts`) decoded:
  - **D-194a1 — THE QUOTED-PATHNAME FORM (a LIVE DEFECT, CURE)**:
    OURS interpolates `usePathname()` verbatim — `The page
    "/zzz-probe-194" could not be found` (the LEADING SLASH inside the
    quotes; the span box 588,459 134x19); the REFERENCE interpolates
    its router path WITHOUT the leading slash — `The page
    "zzz-probe-194" …` (the span box 591,459 128x19 — the 3px shift +
    the 6px width the visible text delta). THE CURE: strip the leading
    slash at the interpolation (`pathname.replace(/^\//, "")`) —
    the deep-path form "/a/b" → "a/b" matches the reference's router
    path on both. Collateral: the crm.spec e2e string re-anchor (the
    same-commit form).
  - **D-194a2 — THE GO HOME TAG (the KEPT SUPERSET, PINNED)**: OURS
    renders `<Link href="/">` (an anchor — role=link, the href
    affordances: right-click, cmd-click, AT "link" semantics); the
    REFERENCE renders a `<button>` (a JS-router nav arm with NO href —
    its SPA platform idiom). Every VISIBLE layer byte-equal (box
    658,556 123x38 · color rgb(51,65,85) · bg white · border 1px
    solid rgb(226,232,240) · radius 8px · font 14px/500 · padding
    8px 16px · display inline-flex). The anchor is the semantically
    correct construction for a navigation affordance (WCAG link
    semantics) — the D-112a2 a11y-superset doctrine's next member
    (ours keeps the accessible superset; the reference's own gap never
    mirrored). The construction carries ZERO test teeth on the TAG
    identity today (the s12 pins hold the class strings, never the
    Link-vs-button choice) — PINNED this round.
  - **D-194a3 — THE GO HOME GLYPH (a LIVE DEFECT, CURE)**: OURS ships
    lucide `house` (2 paths — the house + the door; stroke-width 2;
    the `lucide lucide-house` class prefix; width/height attrs); the
    REFERENCE ships the heroicons home OUTLINE (exactly ONE path —
    `M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1
    0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0
    001 1m-6 0h6`; NO stroke-width attr → computed weight 1; NO
    width/height attrs; the bare `w-4 h-4 mr-2` class — no lucide
    prefix, the w/h class order flipped). The two glyphs are VISUALLY
    DIFFERENT (the shape AND the stroke weight) — the M-82c2
    icon-identity family's first CROSS-LIBRARY member (the D-186a1
    pen-cure precedent: the reference's exact glyph restored; the
    heroicons glyph marks the reference's 404 view as its platform
    template's own origin — the one non-lucide icon family in its
    tree). THE CURE: inline the reference's exact svg at the Go Home
    site (retire the lucide `Home` import there; the reference's
    exact attrs: viewBox 0 0 24 24, fill none, stroke currentColor,
    NO width/height, NO stroke-width, the class `w-4 h-4 mr-2`).
    Collateral: the `NOT_FOUND_LAYOUT.homeIcon` pin re-anchored
    h-4 w-4 → w-4 h-4 (the reference's exact class order, the
    same-commit form).
  - **D-194a4 — THE 404 TITLE (a LIVE DEFECT, CURE)**: OURS ships the
    s12 absolute title `This Page Does Not Exist | NEO CRM` (decoded
    from the reference's PRE-DRIFT build, 180+ sessions and every
    bundle rotation ago); the CURRENT reference ships bare `NEO CRM`
    (live-verified at BOTH contexts, authenticated + anon, 3s settles
    — and the title machinery is byte-equal on every real route: both
    ship bare `NEO CRM` on /dashboard, `Accounts | NEO CRM` on
    /accounts, `About | NEO CRM` on /about — the s10/s13 pins stand;
    only the 404 differs). THE CURE: retire the `metadata` export in
    `not-found.tsx` — the root layout's `title.default: "NEO CRM"`
    renders → byte-equal. No test pins the 404 title (verified);
    the collateral: the not-found.tsx comment block + the
    page-layout.ts NOT_FOUND_LAYOUT doc-comment Title line + the PAD
    §708/§1321 census rows + the SKILL §"The custom 404" census site
    (the same-commit docs lockstep).
  - **D-194a5 — THE ANON UNKNOWN-ROUTE POSTURE (a PLATFORM GENUS,
    PINNED)**: the REFERENCE's auth-first client-router guard
    redirects anon unknown-routes to `/login?from_url=<absolute-url>`
    (live-decoded: `/login?from_url=https%3A%2F%2F…%2Fzzz-probe-194`,
    http 200 at the wall; its designed 404 view appears only PAST the
    guard — the guard never adjudicates routability for anon
    visitors, everything anon → the wall); OURS renders the designed
    404 AT the unknown URL with a true HTTP 404 (routability
    adjudicated first — the route-group architecture: known guarded
    routes → the wall; unknown routes → the 404, session-independent).
    The reference's posture is its SPA platform artifact (the same
    family as its 200-everywhere HTTP status — it never ships a real
    404 status at all; ours returns the semantically correct 404,
    KEPT) — and its from_url round-trip lands the user back at the
    unknown route → the 404 anyway (one hop later, zero information
    gained). OURS keeps the designed 404 for anon visitors — PINNED
    (the not-found construction carries NO session check, by design;
    the pin holds the construction).
- **THE ERROR-BOUNDARY PAIR — OUR-ONLY (no two-app walk exists)**:
  `src/app/error.tsx` + `src/app/global-error.tsx` are the s170
  scandihaven ports (the house-styled card + the digest ref + the
  reset() Try-again + the stale-chunk self-heal), fully source-pinned
  (the 17-check error-boundaries suite + the 12-check chunk-recovery
  suite). The reference cannot be forced to crash deterministically —
  its error interiors carry no walkable two-app surface; the family
  stays source-pinned, re-verified standing this round (the suite
  counts ride the baseline gate).

## WP-1 — The walk tool

`scripts/walk67-404-interior-arms.ts` (the walk66 form over the ONE
surface at BOTH contexts on BOTH apps — the sweep-state storageState
pair for the authenticated legs, fresh contexts for the anon legs):

- **Phase A — the OPEN census at the desktop axis 1440×900
  (authenticated)**: the DFS ledger (the body-rooted form — the 404
  carries no main/nav/footer chrome; censused from the page-root div,
  the platform artifacts excluded per the s149 doctrine) + the h1/h2
  faces + the p + the span box/text (the D-194a1 decode) + the Go
  Home arm inventory (tag/cls/href/box/computed face — the D-194a2
  decode) + the glyph decode (viewBox/attrs/the exact path data/the
  computed stroke-width/class — the D-194a3 decode) + the document
  title (the D-194a4 decode) + the http status + the
  chrome-absence census.
- **Phase B — the REAL keyboard Tab drive (authenticated)**: the
  full chain's stop inventory (both apps — OURS 2 stops, the REF 3
  with its platform badge-close, the s149 genus) + the REAL
  :focus-visible face at the Go Home stop (the walk54/58/64/66 focus
  form — the programmatic .focus() never paints the true face).
- **Phase C — the Go Home ride (write-free client nav)**: the click →
  the landing at `/` — the landing h1 census + the Open-dashboard CTA
  presence (the s142 landing on both apps; the ride is the
  D-194a2-tagged arm's behavior decode).
- **Phase D — the phone axis 390×844 (authenticated)**: the 404's
  responsive center (the card box + the h1 box + the Go Home box) —
  the surface's phone face never walked.
- **Phase E — the anon posture census (fresh contexts)**: OURS the
  404 at the unknown URL (http 404, the same designed interior) vs
  the REF the redirect to `/login?from_url=<absolute-url>` (the wall)
  — both legs censused, the D-194a5 genus decoded, never "fixed" +
  the capital-auth `/Login` form at both contexts (authenticated:
  the 404 on both — the standing e2e pin; anon: the D-194a5 genus
  member).

The DATA-STATE discipline: every arm is data-INDEPENDENT (the 404 is
static client content; no DB reads, no session-dependent arms beyond
the context itself). The destructive arms are NEVER fired (no logout,
no external nav, no writes — the Go Home ride is a write-free client
nav; the mailto/social family does not exist on this surface).

## WP-2 — The decode

Every delta root-caused against the standing genus register (the
box-shadow SLOT-COUNT genus with every VISIBLE layer byte-equal · the
outline VERSION FORM + both sub-forms [1px none vs 2px solid
transparent — zero visible pixels both, the walk51 decode] + the
COLOR-CARRIER sub-form [the D-193a1 cure's oklab vs rgba — the s126
serialization noise] · the token-selection genus [the M-81c2 pairs,
computed-equal] · the class-order genus [computed-equal] · the
aria-label/a11y superset genus [s88-c9, kept] · the React useId
format genus · the platform-pill genus [s149 — the REF's badge-close
Tab stop + its auth-first anon guard + its 200-everywhere HTTP
posture, never mirrored] · the lucide path-order genus) + THE
ROUND'S FIVE-FIND ADJUDICATIONS (D-194a1 CURED · D-194a2 PINNED ·
D-194a3 CURED · D-194a4 CURED · D-194a5 PINNED). Target: ZERO live
defects post-cure, every delta a documented genus or a pinned kept
superset.

## WP-3 — TDD

Born-green contract-freeze pins + RED-first cure pins, all in the
existing suites (the ADR-017 one-suite doctrine — page-layout for the
construction freezes + the cures' source pins):

1. the walk67 decode freeze (the tool's own contract — the two-app
   OPEN ledgers + the Tab chains + the ride + the phone axes + the
   anon posture census);
2. the 404 open-interior construction freeze (the genuine battery
   gap: the s12 pins hold the NOT_FOUND_LAYOUT constant strings,
   never the not-found-body CALL-SITE chains — the Link construction
   + the href + the leading-slash strip + the inline glyph + the
   span interpolation);
3. the ANON-posture construction freeze (D-194a5's pin: the
   not-found construction carries NO session check, NO redirect —
   the session-independent 404, the auth-first-guard genus decoded
   and pinned);
   + THE CURE PINS (RED-first: exactly N RED at birth → the cures →
   GREEN):
4. D-194a1 — the quoted-path form (the stripped interpolation: the
   span text `"{path-without-leading-slash}"`);
5. D-194a3 — the glyph (the heroicons path data + the no-stroke-width
   form + the no-lucide-class + the w-4 h-4 order);
6. D-194a4 — the title retirement (no metadata export in
   not-found.tsx; the root default renders);
   + the collateral re-anchors (the same-commit form): the crm.spec
   e2e quoted-path string (D-194a1's cure changes the interpolated
   text) · the `NOT_FOUND_LAYOUT.homeIcon` pin h-4 w-4 → w-4 h-4
   (D-194a3's class-order match) · the page-layout.ts doc-comment
   Title line + the not-found.tsx/not-found-body.tsx comment blocks
   (D-194a4/a1/a3's decode notes).

## WP-4 — Proofs

MUTATION-PROOF (a planted construction regression per cure pin →
exactly 1 RED each → restored → GREEN, no residual) · STASH-PROOF
(the round's test blocks stashed alone → exactly **138/2805** [the
s193 ship state] → restored → 138/2805+N) · the walk re-run stable
on the cured tree (the delta report byte-identical modulo the cures'
resolutions).

## WP-5 — Count ladder + docs

2805 → 2805+N (the walk67 pins + the cure pins) · badge 2997 →
2997+N (count-ladder-194.py: the house assert-first idempotent form —
the head surgery runs BEFORE the ladder, the TRUE count verified at
the full-suite count) · the collateral re-anchors (the SKILL §5.6
census checks · the F-106a1 layer-axis pin — the s194 layer live, the
s193 demoted beneath it at 2805/192) · the docs lockstep (the AGENTS
Session-194 section · the PAD session-194 inventory row + the §708/
§1321 404 census rows re-anchored [the title retirement + the glyph]
· the CLAUDE page-layout bullet's walk67 tail · the README Tested
row's walk67 clause + the badge · the SKILL head surgery
[skill-head-194.py, idempotent] + the SKILL §"The custom 404" census
site re-anchored · session_410.md + this plan's execution record +
the worklog entry [Task ID 194]).

## WP-6 — Captures + the operator asks

- The captures (docs/screenshots/): the round's ours+ref faces (the
  404 interior ours+ref at the desktop axis + the phone-axis pair +
  the Go Home focus-face clip pair) + the standard dev-server page
  set for the operator's record.
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
  (s11/s96/s98/s123/M-92c1/D-187a3) checked at every WP-2 arm (the
  404's space-y stacks are the family's home turf — the s12
  space-y-2/3/6 groups re-decoded live).

## The execution checklist (the operator's round-shaped asks)

| Ask | State | The round's evidence |
| --- | --- | --- |
| `.env` DATABASE_URL = `file:../db/custom.db`, db/ at repo root | DONE (intake) | census MATCH at `<repo>/db/custom.db` |
| vitest + playwright suites via the config files | STANDING (verified) | 138/2805 unit + 192/192 e2e this session |
| Sitemap + SEO | STANDING (re-verified) | smoke check 12; the 11-route sitemap + robots + manifest |
| Mobile nav menu parity | STANDING (re-verified) | probe:ref TRUE-390 STANDING (this session's run) |
| Tailwind v4 bug watch | STANDING | the genus register walked against every WP-2 delta |
| `.env.example` matches + in the commit | VERIFIED | the six-knob contract audit |
| Screenshots under docs/screenshots/ | WP-6 | the round's captures |
| Docs alignment | WP-5 | the lockstep ledger |
| Commit + push via the SSH wrapper, main only | FINAL | the dry-run + the push + the remote verify |

---

## The execution record (2026-10-27, session-194)

- **The audit GREEN** — the baseline gate at the shipped s193 state
  (the pull to `8349d01`, tree clean): lint 0/0 · tsc 0 · 138/2805 ·
  build · smoke 14/14 · e2e 192/192 (clean first run, 5.7m) ·
  probe:ref STABLE (46bc2d9c — the demo data still ZERO, the desktop
  + TRUE-390 + landing censuses STANDING) · census MATCH
  (15/24/10/23/12 + 4 users) · sitemap 11 routes + robots +
  manifest 200 · the Tailwind v4 state clean · the operator's
  standing asks verified (env/db placement · the vitest/playwright
  configs · sitemap/SEO · mobile-nav · `.env.example`).
- **The rotation adjudication** — probe:ref STABLE kills the
  fresh-bundle candidate; recharts latest 3.10.1 kills the 4.0 gate;
  the s408 close's conditional candidates re-checked by the discovery
  (`scripts/discover-194.ts`): the Edit-family STILL KILLED (rows=1
  the empty-state row, rowMenus=0), the topbar-search gate KILLED
  again (populated=0), the dashboard follow-up-rows + the activities
  Completed-tab STILL KILLED (the zero-data state persists); **the
  round material = the s408 close's own naming — THE 404 INTERIOR'S
  INTERACTIVE ARMS** (the error-boundary pair OUR-ONLY, source-pinned
  at 17+12 checks; the 404 LIVE on BOTH apps, never walked at the
  OPEN-LEDGER level, 180+ sessions stale); the micro-probes
  (`scripts/micro-probe-194-404-interior.ts` +
  `scripts/glyph-probe-194.ts`) decoded the five finds BEFORE the
  plan; the plan landed + validated against the codebase, executed
  TDD.
- **WP-1 GREEN** — `scripts/walk67-404-interior-arms.ts` (the walk66
  form over the ONE surface at BOTH contexts on the sweep-state pair
  + fresh anon contexts: Phase A the OPEN census — the DFS ledger
  from the min-h-screen page root + the h1/h2/p/span faces + the Go
  Home arm inventory + the glyph decode + the title + the http
  status; Phase B the REAL Tab drive — OURS 2 stops, the REF 3 with
  its platform badge-close (the s149 genus) + the REAL
  :focus-visible face at the Go Home stop; Phase C the Go Home ride
  write-free — both apps land at the landing "/"; Phase D the phone
  axes; Phase E the anon posture census — OURS the 404 (http 404)
  vs the REF the redirect to /login?from_url=<absolute-url>); the
  destructive arms NEVER fired; the walk re-run STABLE post-cure.
- **WP-2 GREEN — THREE LIVE FINDS CURED + TWO SUPERSETS PINNED**:
  D-194a1 the quoted-pathname form (usePathname's leading slash
  stripped at the interpolation — the reference's router-path form;
  the crm.spec e2e string re-anchored in the same commit) · D-194a3
  the Go Home glyph (the M-82c2 icon-identity family's first
  CROSS-LIBRARY member: the reference's heroicons home outline
  inlined — ONE path, NO stroke-width [computed weight 1], the bare
  w-4 h-4 class; the lucide-house import retired at this one site;
  the homeIcon pin re-anchored to the reference's class order) ·
  D-194a4 the 404 title (the s12 absolute title a pre-drift decode —
  the current reference ships bare "NEO CRM", live-verified at both
  contexts with the titles byte-equal on every real route; the
  metadata export retired, the root default renders byte-equal) ·
  D-194a2 the Go Home tag — the KEPT SUPERSET, PINNED (the Link
  anchor vs the reference's no-href JS-router button — every visible
  layer byte-equal, the D-112a2 doctrine's next member, never
  mirrored) · D-194a5 the anon unknown-route posture — the PLATFORM
  GENUS, PINNED (the reference's auth-first guard walls anon
  unknown-routes and its SPA never ships a real HTTP 404; ours
  renders the designed 404 with the true 404 status,
  session-independent — the s149 family, never mirrored); every
  remaining delta a documented genus (the oklab/rgba serialization
  [s126] · the shadow slot-count [s129] · the outline version form
  [walk51] · the platform badge [s149] · OUR aria-hidden superset
  [s19, kept] · the p text-node-split artifact).
- **WP-3 GREEN** — the pin survey first (the s12 NOT_FOUND_LAYOUT
  pins + the route-case capital-404 pins), then the battery: 3
  RED-first cure pins (exactly 3 RED at birth → the cures → GREEN —
  the windowed forms: the docstrings quote the decoded forms, so the
  pins guard the construction tails) + 3 born-green freezes (the
  walk67 decode freeze · the 404 open-interior construction freeze
  [the genuine battery gap] · the D-194a5 ANON-posture construction
  freeze).
- **WP-4 GREEN** — MUTATION-PROOF (the planted strip regression → 2
  RED [the pin + the freeze's designed overlap] → restored → GREEN;
  the planted stroke-width → 1 RED → restored; the planted
  metadata-export → 1 RED → restored; the planted button-tag → 1
  RED [the freeze's anchor teeth] → restored; the planted
  session-redirect → 1 RED → restored — every pin's unique teeth
  proven) · STASH-PROOF (the round's test block stashed → exactly
  138/2805 [the s193 ship state], ZERO collateral → restored →
  138/2811 — the TRUE count verified at the full-suite count, no
  undercount).
- **WP-5 GREEN** — skill-head-194.py ran FIRST (the SKILL v1.191.0,
  the s193 layer demoted at its ship counts 2805/192, the s194 layer
  live, idempotent; the retired s193 ship line PINNED by the
  generalized D-188a1 doctrine's next member in docs-counts) ·
  count-ladder-194.py (2805 → 2811 [+6] · badge 2997 → 3003
  [2811+192]; assert-first, idempotent — 17 flips) · the docs
  lockstep (the AGENTS Session-194 section · the PAD s194 inventory
  row + the §708/§1321 404 census rows re-anchored · the CLAUDE
  page-layout bullet's walk67 tail · the README Tested row's walk67
  clause + the badge · the SKILL §"The custom 404" census site
  re-anchored · session_410.md + this execution record + the worklog
  entry [Task ID 194]) · the docs-counts re-anchors (the UNIT
  constant 2811 · the F-106a1 layer-axis [the s194 first layer +
  the s193 second] · the retired-s193 ship-line pin · the §5.6
  census 283 checks + the negatives ladder + the retired 1718/277
  forms).
- **WP-6** — the captures (docs/screenshots/: the 404 interior
  ours+ref at the desktop axis + the phone-axis pair + the
  focus-face clip pair + the standard dev-server page set) + the
  operator asks all verified standing.
- **THE VERIFICATION LEDGER** — lint 0/0 · tsc 0 · 138/2811 · build ·
  smoke 14/14 · e2e 192/192 · db census MATCH · probe:ref STABLE ·
  the 404 interior byte-equal on the census + the ride + the phone
  axes (post-cure) · the REAL Tab chains structurally identical (2/3
  stops) · the re-walk STABLE (43→23 deltas).
- **SHIPPED** — committed on main + pushed via
  `docs/ssh_git_wrapper_v3.py` (the remote verified; no new
  branches).
