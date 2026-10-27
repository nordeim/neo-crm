# The session-193 plan — THE MARKETING-INTERIOR ARMS (walk66)

Date: 2026-10-27 · Rotation: 193 ·
Task: audit + validate the shipped session-192 state (commit `a243a21` +
the owner's transcript commit `5aa406a` — the session_406/407 transcripts
are this round's rotation trigger), then execute the round material the
s406 close's conditional candidates leave open (all its named suspended
arms stay KILLED at the reference's unchanged zero-data state — the
discovery re-check), adjudicated by the discovery probe
(`scripts/discover-193.ts`) onto the genuinely unwalked surfaces it finds
LIVE on BOTH apps: **the /About + /Contact AUTHENTICATED INTERIORS'
INTERACTIVE ARMS** (the marketing pair inside the AppShell chrome — the
s406 close's own naming: "the /About + /Contact authenticated interiors'
interactive arms, if any surface beyond the census gate's coverage") —
the pages' content censused at s142 (the construction), the guest funnel
walked at s144 (walk34), the main-interior geometry gated by the 156-c
census legs, the pixels held by the sweep — but NEVER walked at the
walk53-65 OPEN-LEDGER level: no DFS ledger, no anchor-inventory map, no
REAL keyboard Tab chain, no REAL :focus-visible face, no link-ride
decode; the family is 48 sessions stale (about/contact last touched
s144, the s147 posture flip touched only the group layout) — plus the
round-specific operator asks (env/db placement re-verification · the
vitest/playwright config standing check · the sitemap/SEO re-verification
· the mobile-nav two-app comparison · the Tailwind v4 bug-watch · the
`.env.example` inclusion · the dev-server captures), TDD-first, align
every doc, push to main via the SSH wrapper.

## 0. The audit (the baseline + the rotation adjudication) — DONE

The baseline gate at the shipped s192 state (the fresh clone at
`5aa406a`, tree clean): lint 0/0 · tsc 0 · **138/2801** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **192/192** (clean
first run, 5.6m — after the fresh-sandbox playwright chromium-1248
install) · probe:ref STABLE (`46bc2d9c` — the bundle md5 unchanged, the
demo data still ZERO, the desktop census 256px/8 links STANDING, the
TRUE-390 census STANDING with the reference's own 1 menu button, the
landing census STANDING) · db census MATCH (15/24/10/23/12 + 4 users at
`<repo>/db/custom.db`, the ambient `DATABASE_URL` shadow scrubbed with
`env -u` on every DB-touching command — the F-123a1 doctrine) · sitemap
11 routes + robots + manifest 200 (smoke check 12) · recharts registry
`latest` 3.10.1 verified live (the 4.0 gate KILLED).

The rotation adjudication: probe:ref STABLE kills the fresh-bundle
candidate; the registry's `latest` 3.10.1 kills the recharts 4.0 gate.
The s406 close's conditional candidates re-checked by the discovery
(`scripts/discover-193.ts`, the standing legs):

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
- **THE MARKETING-INTERIOR ARMS — LIVE on BOTH apps, byte-equal at
  the census level, genuinely unwalked at the OPEN-LEDGER level**:
  /about (mainH 831 · els 46 · h1 "About NEO CRM" 704x40 · the four
  h2 cards · the 3-anchor inventory with every href/target/rel
  byte-equal — the Get-in-touch link → /Contact at 496,993 180x19
  blue rgb(37,99,235)/500 · the footer pair /About + /Contact · the
  256px 8-link nav) + /contact (mainH 831 · els 33 · h1 "Contact Us"
  · the mailto:hello@example.com + the three social anchors
  target=_blank rel="noopener noreferrer" at byte-equal boxes · the
  same footer + nav).
- **THE REAL TAB CHAINS — STRUCTURALLY IDENTICAL (15 stops both)**:
  the 8 sidebar links → the search input → Messages → Notifications
  → the account trigger → the Get-in-touch anchor → the footer pair —
  the REF's chain adds only the 16th stop (the base44 platform
  badge-close button — the s149 platform-pill genus, never mirrored).
- **THE CANDIDATE FOCUS-FACE FINDS the discovery surfaced** (the
  walk's decode spine):
  - **D-193a1 candidate — THE SIDEBAR LINKS' REAL focus-visible
    RING**: OURS paints `focus-visible:ring-2 focus-visible:
    ring-white/50` (the box-shadow carrier, outline-style:none) at
    every sidebar stop; the REFERENCE paints NO authored focus face
    — the bare UA default outline (1px auto, rgba(10,10,10,0.5)).
    The construction dates to session-7 with a "deliberate a11y
    superset" comment; the s177 walk50 re-verified it INVISIBLE at
    the resting face — the REAL keyboard face was never walked, and
    the construction carries ZERO test teeth (no pin holds
    ring-white/50). Adjudication under the D-112a2
    keyboard-focus-gap family (the reference's own a11y gaps stay
    unfixed; ours keeps the accessible superset): expected KEPT
    SUPERSET — walk-proven at the REAL level, then PINNED.
  - **D-193a2 candidate — THE IN-PAGE ANCHORS' UA-OUTLINE COLOR
    RESOLUTION**: both apps paint the UA default outline form
    (1px auto — neither authors an outline rule on the anchors), but
    the resolved colors differ: OURS rgb(16,16,16)/rgb(19,19,19)
    (varying per element), the REFERENCE rgba(10,10,10,0.5) (fixed).
    Neither app authors the rule — the delta is a UA-level
    resolution. The pixel clips adjudicate: a VISIBLE ring-color
    delta → decode the root cause; INVISIBLE → the L-126c6
    1-unit-residue family.

## WP-1 — The walk tool

`scripts/walk66-marketing-interior-arms.ts` (the walk61/65 multi-arm
form — ONE battery over the TWO pages at BOTH axes, AUTHENTICATED
contexts — the sweep-state storageState pair, the s162 doctrine; the
pages render only inside the login-walled chrome):

- **Phase A — per page (about/contact), the OPEN census at the
  desktop axis 1440×900**: the main root geometry + the DFS ledger
  (tag/cls/role/aria/id/text/geometry per node, the LEDGER_JS form)
  + the h1 face + the h2 vocabulary + the FULL anchor inventory
  (text/href/target/rel/box/computed face per anchor) + the footer
  link pair + the nav census + the mount state.
- **Phase B — the REAL keyboard Tab drive through each page**: the
  full chain's stop inventory (both apps, to the wrap) + the REAL
  :focus-visible faces at the decoded stops: the FIRST sidebar link
  (the D-193a1 ring adjudication), the search input, the Messages
  dead-stub, the account trigger, the first in-page anchor (the
  D-193a2 outline resolution), and the first footer link — the
  walk54/58/64 focus form (the REAL keyboard Tab is the only true
  focus face).
- **Phase C — the link rides (write-free client nav)**: the
  Get-in-touch round-trip (/about → /contact: the nav fires + the
  landing interior's h1 census) + the footer Contact link ride +
  the back-nav round-trip — both apps.
- **Phase D — the phone axis 390×844, per page**: the main root box
  + the h1 box + the first in-page anchor face + the drawer trigger
  census (the mobile chrome face at the marketing pages) + the
  footer stack geometry.
- **Phase E — the mailto/social href decode (census only)**: the
  full href/target/rel vocabulary verified byte-equal — the EXTERNAL
  navigations are NEVER fired (the destructive-arm discipline).

The DATA-STATE discipline: every arm is data-INDEPENDENT (the pages
are static server content; the chrome is session-borne). The
destructive arms are NEVER fired (no logout, no external nav, no
dialog writes — the ONE interactive family outside the census gate's
coverage is the focus/link arms, all client-side).

## WP-2 — The decode

Every delta root-caused against the standing genus register (the
box-shadow SLOT-COUNT genus with every VISIBLE layer byte-equal · the
outline VERSION FORM + both sub-forms + the COLOR-CARRIER sub-form
[s178/walk61] · the token-selection genus [the M-81c2 pairs,
computed-equal] · the class-order genus · the aria-label/a11y
superset genus [s88-c9, kept — the search input's + the dead-stubs'
+ the trigger's labels] · the React useId format genus · the
oklab/rgba serialization noise [s126] · the zinc-vs-neutral residue
[L-126c6] · the platform-pill genus [s149 — the REF's badge-close
16th Tab stop, never mirrored] · the aria-hidden svg superset [s19,
kept] · the lucide path-order genus) + **THE FOCUS-FACE
ADJUDICATION** (the D-193a1 ring: the pixel-clip pair + the computed
faces at every sidebar stop, both apps — the KEPT-SUPERSET doctrine
walk-proven; the D-193a2 outline resolution: the pixel-clip pair at
the in-page anchors). Target: ZERO live defects, every delta a
documented genus or a kept superset, every find cured or decoded.

## WP-3 — TDD

Born-green contract-freeze pins (the s173 P-p/P-q precedent, the
s178-192 continuation), all in the existing suites (the ADR-017
one-suite doctrine — page-layout for the construction freezes):

1. the walk66 decode freeze (the tool's own contract — the two-page
   OPEN ledgers + the Tab chains + the link rides + the phone axes);
2. the MARKETING open-interior construction freeze (the genuine
   battery gap: the s142 landing-page pins hold the LANDING page's
   strings, never the about/contact call-site chains — the h1 chain +
   the anchor chains + the footer wiring in the two page files);
3. the SIDEBAR NAV focus-visible construction freeze (the genuine
   gap: the ring-white/50 construction at sidebar.tsx +
   mobile-nav.tsx carries ZERO test teeth — the KEPT-SUPERSET
   doctrine pinned with its comment);
   + THE CURE PINS (RED-first: exactly N RED at birth → the cures →
   GREEN) for every live find the walk decodes as a defect (the
   D-193a2 outline resolution if the clips show a visible delta with
   an authored root cause).

## WP-4 — Proofs

MUTATION-PROOF (a planted construction regression on a walked
contract → exactly 1 RED per planted cure → restored → GREEN) ·
STASH-PROOF (the round's test block stashed alone → exactly
**138/2801** [the s192 ship state] → restored → 138/2801+N) · the
walk re-run stable on the walked tree (the delta report byte-identical
modulo the cures).

## WP-5 — Count ladder + docs

2801 → 2801+N (the walk66 pins + the cure pins) · badge 2993 →
2993+N (count-ladder-193.py: the house assert-first idempotent form —
the head surgery runs BEFORE the ladder, the TRUE count verified at
the full-suite count) · the collateral re-anchors (the SKILL §5.6
census checks · the F-106a1 layer-axis pin — the s193 layer live,
the s192 demoted beneath it at 2801/192) · the docs lockstep (the
AGENTS Session-193 section · the PAD session-193 inventory row · the
CLAUDE page-layout bullet's walk66 tail · the README Tested row's
walk66 clause + the badge · the SKILL head surgery [skill-head-193.py,
idempotent] · session_408.md + this plan's execution record + the
worklog entry [Task ID 193]).

## WP-6 — Captures + the operator asks

- The captures (docs/screenshots/): the round's ours+ref faces (the
  two pages' interiors ours+ref at the desktop axis + the phone-axis
  pair + the focus-face clip pair at a sidebar link + an in-page
  anchor) + the standard dev-server page set for the operator's
  record.
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
| vitest + playwright suites via the config files | STANDING (verified) | 138/2801 unit + 192/192 e2e this session |
| Sitemap + SEO | STANDING (re-verified) | smoke check 12; the 11-route sitemap + robots + manifest |
| Mobile nav menu parity | STANDING (re-verified) | probe:ref TRUE-390 STANDING (this session's run) |
| Tailwind v4 bug watch | STANDING | the genus register walked against every WP-2 delta |
| `.env.example` matches + in the commit | VERIFIED | the six-knob contract audit |
| Screenshots under docs/screenshots/ | WP-6 | the round's captures |
| Docs alignment | WP-5 | the lockstep ledger |
| Commit + push via the SSH wrapper, main only | FINAL | the dry-run + the push + the remote verify |

---

## The execution record (2026-10-27, session-193)

- **The audit GREEN** — the baseline gate at the shipped s192 state
  (the fresh clone at `5aa406a`, tree clean): lint 0/0 · tsc 0 ·
  138/2801 · build · smoke 14/14 · e2e 192/192 (clean first run, 5.6m —
  after the fresh-sandbox playwright chromium-1248 install) · probe:ref
  STABLE (46bc2d9c — the demo data still ZERO, the desktop + TRUE-390 +
  landing censuses STANDING) · census MATCH (15/24/10/23/12 + 4 users)
  · sitemap 11 routes + robots + manifest 200 · the Tailwind v4 state
  clean · the operator's standing asks verified (env/db placement ·
  the vitest/playwright configs · sitemap/SEO · mobile-nav ·
  `.env.example`).
- **The rotation adjudication** — probe:ref STABLE kills the
  fresh-bundle candidate; recharts latest 3.10.1 kills the 4.0 gate;
  the s406 close's conditional candidates re-checked by the discovery
  (`scripts/discover-193.ts`): the Edit-family STILL KILLED (rows=1
  the empty-state row, rowMenus=0), the topbar-search gate KILLED
  again (populated=0), the dashboard follow-up-rows + the activities
  Completed-tab STILL KILLED (the zero-data state persists); **the
  round material = the s406 close's own naming — the /ABOUT + /CONTACT
  AUTHENTICATED INTERIORS' INTERACTIVE ARMS — LIVE on BOTH apps,
  byte-equal at the census level** (the discovery's LEG-2 anchor
  inventories + LEG-3 REAL Tab chains); the plan landed + validated
  against the codebase, executed TDD.
- **WP-1 GREEN** — `scripts/walk66-marketing-interior-arms.ts` (the
  walk61/65 multi-arm form over the TWO pages at BOTH axes on the
  sweep-state pair: Phase A per page the OPEN census — the main roots
  byte-equal at 256,69 1184x831 + els 46/46 + 33/33 + the h1 faces +
  the h2 vocabularies + the FULL anchor inventories [every
  href/target/rel byte-equal] + the footer pair + the 256px 8-link
  nav; Phase B the REAL Tab drive — the chains STRUCTURALLY
  IDENTICAL at 15 stops both [the REF's 16th its platform badge —
  the s149 genus] + the REAL :focus-visible faces at the six
  geometry-keyed stops; Phase C the link rides write-free — byte-equal
  landings; Phase D the phone axes byte-equal — the drawer triggers
  + the footer stacks identical); the EXTERNAL navigations NEVER
  fired; the walk re-run STABLE post-cure.
- **WP-2 GREEN — ONE LIVE FIND CURED + ONE KEPT SUPERSET PINNED**:
  D-193a1 the base layer's universal outline-color rule (the
  alpha-color carrier family's painting member — the reference's
  compiled base carries the shadcn base template's `outline-color:
  hsl(var(--ring) / .5)` universal line; ours carried only the
  border-color half; THE CURE: `color-mix(in oklab, var(--color-ring)
  50%, transparent)` at the same `*` rule — the re-walk PROVES every
  outline-color now the reference's family, the oklab-vs-rgba
  serialization the s126 noise genus) · D-193a2 the sidebar links'
  REAL focus-visible ring (the KEPT SUPERSET — ring-2 ring-white/50,
  the s7 deliberate a11y superset, walk-proven at the REAL keyboard
  face, PINNED at both nav sites; the reference ships the bare UA
  outline — its own keyboard-focus-gap family, the D-112a2 doctrine,
  never mirrored); every remaining delta a documented genus (the
  token-selection pair computed-equal · the slot-count · the outline
  version form · the aria-hidden superset · the aria-label superset ·
  the platform badge).
- **WP-3 GREEN** — the pin survey first (the s142 landing pins + the
  NAV_LAYOUT pins + the s177 drawer pins), then the battery: 3
  born-green pins in page-layout (the walk66 decode freeze · the
  MARKETING open-interior construction freeze · the SIDEBAR ring
  construction freeze) + THE D-193a1 CURE PIN in design-tokens
  (RED-first: exactly 1 RED at birth → the cure → GREEN — the
  windowed-slice form).
- **WP-4 GREEN** — MUTATION-PROOF (the planted outline-color
  regression 50%→90% → exactly 1 RED → restored → GREEN, no residual;
  the planted sidebar ring regression white/50→white/40 → exactly 1
  RED → restored → GREEN — both pins' unique teeth proven) ·
  STASH-PROOF (the round's test blocks stashed → exactly 138/2801
  checks [the s192 ship state] with the 2 line-census collateral pins
  reading the CURED globals.css against the stale docs rows [the
  same-commit docs-lockstep dependency — the PAD row + the SKILL
  census site re-anchored 430→442, the s168 line-census doctrine] →
  restored → 138/2805 — the TRUE count verified at the full-suite
  count, no undercount).
- **WP-5 GREEN** — skill-head-193.py ran FIRST (the SKILL v1.190.0,
  the s192 layer demoted at its ship counts 2801/192, the s193 layer
  live, idempotent; the retired s192 ship line PINNED by the
  generalized D-188a1 doctrine's next member in docs-counts) ·
  count-ladder-193.py (2801 → 2805 [+4] · badge 2993 → 2997
  [2805+192]; assert-first, idempotent — 21 flips) · the docs
  lockstep (the AGENTS Session-193 section · the PAD s193 inventory
  row · the CLAUDE page-layout bullet's walk66 tail · the README
  Tested row's walk66 clause + the badge · session_408.md + this
  execution record + the worklog entry [Task ID 193]) · the
  docs-counts re-anchors (the UNIT constant 2805 · the F-106a1
  layer-axis [the s193 first layer + the s192 second] · the
  retired-s192 ship-line pin · the §5.6 census 277 checks + the
  negatives ladder + the census-era + the re-anchor + the RED-first
  arithmetic).
- **WP-6** — the captures (docs/screenshots/: the two marketing
  interiors ours+ref at the desktop axis + the phone-axis pair + the
  standard dev-server page set) + the operator asks all verified
  standing.
- **THE VERIFICATION LEDGER** — lint 0/0 · tsc 0 · 138/2805 · build ·
  smoke 14/14 · e2e 192/192 · db census MATCH · probe:ref STABLE ·
  the two marketing interiors byte-equal on the census + the rides +
  the phone axes (post-cure) · the REAL Tab chains structurally
  identical (15 stops both).
- **SHIPPED** — committed on main + pushed via
  `docs/ssh_git_wrapper_v3.py` (the remote verified; no new branches).
