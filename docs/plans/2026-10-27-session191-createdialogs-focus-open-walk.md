# The session-191 plan — THE THREE CREATE DIALOGS' OPEN FACES (walk64)

Date: 2026-10-27 · Rotation: 191 ·
Task: audit + validate the shipped session-190 state (commit `c9706f3` +
the owner's transcript commit `968736a` — the session_402/403 transcripts
are this round's rotation trigger), then execute the round material the
s402 close's conditional candidates leave open (all its named arms stay
KILLED at the reference's unchanged zero-data state — the discovery
re-check), adjudicated by the discovery probe (`scripts/discover-191.ts`)
onto the genuinely unwalked surfaces it finds LIVE on BOTH apps: **the
THREE CREATE DIALOGS the walk54/58 family never opened two-app** — the
CONTACT (the s15/s30-era avatar + photo-upload construction), the
ACCOUNT (the s15/s5-era 8-field 2-col grid), and the EVENT (the s15/s76
WIDE family with its combobox trio + datetime pair + conditional Name
arm) create dialogs — plus the round-specific operator asks (env/db
placement re-verification · the vitest/playwright config standing check ·
the sitemap/SEO re-verification · the mobile-nav two-app comparison ·
the Tailwind v4 bug-watch · the `.env.example` inclusion · the
dev-server captures), TDD-first, align every doc, push to main via the
SSH wrapper.

## 0. The audit (the baseline + the rotation adjudication) — DONE

The baseline gate at the shipped s190 state (the pulled workspace at
`968736a`, tree clean): lint 0/0 · tsc 0 · **138/2786** unit · build
(the type-gate artifact) · smoke **14/14** · e2e **192/192** (clean
first run, 5.7m) · probe:ref STABLE (`46bc2d9c` — the bundle md5
unchanged, the demo data still ZERO, the desktop census 256px/8 links
STANDING, the TRUE-390 census STANDING with the reference's own 1 menu
button, the landing census STANDING) · db census MATCH (15/24/10/23/12
+ 4 users at `<repo>/db/custom.db`, the ambient `DATABASE_URL` shadow
scrubbed with `env -u` on every DB-touching command — the F-123a1
doctrine) · sitemap 11 routes + robots + manifest 200 (smoke check 12).

The rotation adjudication: probe:ref STABLE kills the fresh-bundle
candidate; the registry's `latest` 3.10.1 (verified live) kills the
recharts 4.0 gate. The s402 close's conditional candidates re-checked
by the discovery (`scripts/discover-191.ts`, the standing legs):

- **The Edit-family re-check — STILL KILLED**: the reference's
  zero-row state persists (rows=1 the empty-state row alone,
  rowMenus=0, insightsTriggers=0 on /contacts, /leads, /accounts + zero
  calendar chips — while OURS carries the seeded 15/24/10). The
  row-borne dialogs + the Insights family stay suspended.
- **The topbar-search dropdown gate — STILL KILLED**: `populated=0` on
  BOTH apps at the seeded-term leg (the placeholder
  `Search Anything...` byte-equal) — the s32 dead-stub doctrine stands.
- **The dashboard follow-up-rows checkbox arms — STILL KILLED** (the
  reference's zero-data state persists per the probe:ref census — the
  s190 micro-probe's text-anchored adjudication STANDING).
- **The activities Completed-tab row-action buttons — STILL KILLED**
  (the reference's empty panel: checkButtons=0 while OURS carries the
  seeded 5 toggle buttons).
- **THE THREE CREATE DIALOGS — LIVE on BOTH apps, byte-equal at the
  census level, genuinely unwalked** (the walk54/58 dialog family
  opened Lead + Log-Activity two-app; the a11y dialog-open family pins
  OURS only; walk54's family chrome freezes are OURS-only source pins):
  - **The CONTACT create dialog** (the s15/s30 construction): the
    trigger byte-equal at `1255,115 153x36` (bg `rgb(37, 99, 235)`,
    radius 6), the OPEN dialog byte-equal at `464,45 512x810` (bg
    white, border `1px solid rgb(229,229,229)`, radius 8), the title
    "Create New Contact" byte-equal, the 6-field vocabulary byte-equal
    (Name/Email/Phone[tel]/Company/Position/How-did-you-meet with the
    exact placeholders), the file input's accept trio byte-equal, the
    footer `(icon) | ✉️ Email | Cancel | Create Contact | Close`
    byte-equal, the mount-focus byte-equal (a button, on BOTH).
  - **The ACCOUNT create dialog** (the s15/s5 construction): the
    trigger byte-equal at `1274,103 134x32`, the OPEN dialog byte-equal
    at `384,214 672x472`, the title "Create New Account" byte-equal,
    the 8-field 2-col grid vocabulary byte-equal (no placeholders), the
    Status combobox + the footer pair byte-equal, the mount-focus the
    first name input on BOTH.
  - **The EVENT create dialog** (the s15/s76 WIDE construction): the
    trigger byte-equal at `1269,113 139x36`, the OPEN dialog
    byte-equal at `384,133 672x634`, the title "New Event" byte-equal,
    the combobox trio (Meeting/Scheduled/"Select type") + the
    datetime pair + the Location placeholder byte-equal, the footer
    pair byte-equal, the mount-focus the title input on BOTH.
- **THE ID-PARITY FIND FAMILY the census surfaces**: the REFERENCE's
  contact phone input carries `id="phone"` where OURS ships
  `id="ct-phone"`; the reference's account first input carries
  `id="name"` where OURS ships `id="acc-name"`; the reference's contact
  file input carries NO `tabIndex` attribute where OURS ships
  `tabIndex={-1}`; the reference's event dialog inputs are ID-LESS
  where OURS wires the s172 htmlFor/id pairs (the kept-superset
  candidate — the reference's bare labels are its own defect). All
  adjudicated in WP-2 under the D-114a2/D-187a1/D-190a1
  ids-are-construction-parity doctrine, the full DFS ledger live.

## WP-1 — The walk tool

`scripts/walk64-createdialogs-focus-open.ts` (the walk61 multi-arm form
— ONE battery over the THREE unwalked dialogs, the walk53-63 ledger
form on each arm at BOTH axes):

- **Phase A — per dialog, the OPEN census at the desktop axis
  1440×900**: the trigger's resting face + the click-open ride + the
  OPEN root geometry ledger (the box + the face + the FULL DFS ledger
  — tag/cls/role/aria/id/type/for/text/geometry per node, the
  LEDGER_JS form) + the title + every labeled input's chain + computed
  face + the combobox triggers' faces + the contact's file-input
  construction census (accept/tabIndex/cls + the camera button) + the
  footer's Cancel/Create pair faces + the close X's aria + the
  mount-focus census + the Escape close round-trip.
- **Phase B — per dialog, the REAL keyboard Tab drive through the OPEN
  dialog** (the walk54/58/63 focus form: the mount-focus stop + the
  chain through the dialog's focusables until the wrap + the REAL
  :focus-visible faces at the key stops — the first input + a mid-form
  control + the Create submit — the programmatic face never the true
  face) + the Escape close round-trip.
- **Phase C — the interactive arms (client-state only)**: the CONTACT
  select ride (open the "How did you meet?" listbox — the OPEN face +
  the first option's data-highlighted face + the emoji vocabulary
  census + the close) · the ACCOUNT Status select ride (the OPEN face +
  the 4-option vocabulary) · the EVENT Related-To ride (open the listbox
  + pick "Contact" — the CONDITIONAL Name field appears: its
  placeholder `Enter Contact name` + the geometry growth + the pick's
  round-trip) · the Cancel-then-reopen decode on one dialog (the
  client-side form state — the epoch-remount contract on OURS, the
  reference's own behavior on REF). The Create submits are NEVER fired
  on either app (the destructive-arm discipline).
- **Phase D — the phone axis 390×844, per dialog**: the phone root box
  (the w-full family) + the first input's face (the below-md doctrine)
  + the footer pair's phone faces.

The pairing idiom: the reference rides the sweep-state storageState
pair (ONE reference login — the s162 doctrine); OURS rides the dev
server on :3000 (the seeded db). The DATA-STATE discipline: the three
dialogs are data-INDEPENDENT (the reference's own zero-data state
reaches every censused face — the create dialogs render their static
vocabularies at zero data; the selects' option sets are constants, not
db rows). The destructive arms are NEVER fired on either app (the
Create submits would write; the select opens/picks are client state
inside a discardable browser context).

## WP-2 — The decode

Every delta root-caused against the standing genus register (the
box-shadow SLOT-COUNT genus — the v4 five-slot variable chain vs the
reference's two/three-slot form, every VISIBLE layer byte-equal · the
outline VERSION FORM + both sub-forms + the color-carrier sub-form
[s178/walk61] · the token-selection genus [the M-81c2 pairs —
`border-line`/`bg-surface` vs `border`/`bg-background`, computed-equal]
· the class-order genus · the aria-label superset genus [s88-c9, kept]
· the React useId format genus · the Radix mount-state offsets · the
s129 ring-offset white zero-extent slot) + the v3-semantics lineage
re-check (s11/s96/s98/s123/M-92c1/D-187a3 — the dialogs' space-y arms:
the `space-y-2` groups + the `controlMt` pairs + the `space-y-4` forms)
+ **the ID-PARITY adjudication**: the full DFS id map live on both
apps, every id delta classified under the D-114a2/D-187a1/D-190a1
ids-are-construction-parity doctrine (the reference's literal ids
restored; the reference's id-less arms decoded as the kept s172
superset — our labels wire htmlFor/id, the reference's bare labels are
its own defect, never mirrored). Target: ZERO live defects, every
delta a documented genus or a kept superset, every id find cured or
decoded.

## WP-3 — TDD

Born-green contract-freeze pins (the s173 P-p/P-q precedent, the
s178-190 continuation), all in the existing page-layout suite (the
ADR-017 one-suite doctrine) — the pin survey FIRST (the standing
families: the s15 dialog geometry + grid constants · the s19
type=tel/accept-trio/zero-datalist pins [incl. the
`tests/pwa-metadata.test.ts:207` ct-phone source pin] · the s28
CONTACT_SOURCE_OPTIONS emoji vocabulary · the s30 photo-upload wiring
· the s50 create-only contracts · the s76 blue-submit + the
conditional Name arm · the s92 section/h3/rows=3 contracts · the s112
mount-focus genus · the s172 named-controls layer · the
dialog-controls/dialog-geometry-parity/create-dialog-single-mode
suites · the walk53-63 decode freezes):

1. the walk64 decode freeze (the tool's own contract — the three-arm
   OPEN ledger at both axes + the REAL Tab drives + the select rides +
   the conditional-Name appearance + the phone axis);
2. the CONTACT open-interior construction freeze (the genuine battery
   gap: the s19/s30 pins hold OUR wiring regexes — the ct-* ids, the
   accept trio, the tel — never the call-site chains: the avatar
   section + the two h3 section headers + the pair groups + the
   footer pair chains);
3. the ACCOUNT open-interior construction freeze (the same gap: the
   acc-* call-site chains + the `grid grid-cols-2 gap-4 py-4` body +
   the Status select chain + the footer pair);
4. the EVENT open-interior construction freeze (the same gap: the
   ev-title/desc/start/end/loc chains + the bare-field forms + the
   combobox trio + the conditional Name arm + the blue submit chain);
   + THE CURE PINS (RED-first: exactly N RED at birth → the cures →
   GREEN) for every live find the walk decodes (the id-parity family +
   the tabIndex retirement — the D-187a1 doctrine's next members), each
   with its collateral re-anchor (the pwa-metadata ct-phone pin + any
   dialog-controls pin riding the renamed ids).

## WP-4 — Proofs

MUTATION-PROOF (a planted construction regression on a walked contract
→ exactly 1 RED per planted cure → restored → GREEN) · STASH-PROOF
(the round's test block stashed alone → exactly **138/2786** [the s190
ship state] → restored → 138/2786+N) · the walk re-run stable on the
walked tree (the delta report byte-identical).

## WP-5 — Count ladder + docs

2786 → 2786+N (the walk64 pins + the cure pins) · badge 2978 →
2978+N (count-ladder-191.py: the house assert-first idempotent form,
the s187/s188/s189/s190 lessons applied — the head surgery runs BEFORE
the ladder, the TRUE count verified at the full-suite count, no
retired-block carrier form in the old-forms) · the collateral
re-anchors (the SKILL §5.6 census checks · the F-106a1 layer-axis pin —
the s191 layer live, the s190 demoted beneath it at 2786/192) · the
docs lockstep (the AGENTS Session-191 section · the PAD session-191
inventory row · the CLAUDE page-layout bullet's walk64 tail · the
README Tested row's walk64 clause + the badge · the SKILL head surgery
[skill-head-191.py, idempotent] · session_404.md + this plan's
execution record + the worklog entry [Task ID 191]).

## WP-6 — Captures + the operator asks

- The captures (docs/screenshots/): the round's ours+ref faces (the
  three create dialogs OPEN ours+ref at the desktop axis + one
  phone-axis pair) + the standard dev-server page set for the
  operator's record.
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
| vitest + playwright suites via the config files | STANDING (verified) | 138/2786 unit + 192/192 e2e this session |
| Sitemap + SEO | STANDING (re-verified) | smoke check 12; the 11-route sitemap + robots + manifest |
| Mobile nav menu parity | STANDING (re-verified) | probe:ref TRUE-390 STANDING (this session's run) |
| Tailwind v4 bug watch | STANDING | the genus register walked against every WP-2 delta |
| `.env.example` matches + in the commit | VERIFIED | the six-knob contract audit |
| Screenshots under docs/screenshots/ | WP-6 | the round's captures |
| Docs alignment | WP-5 | the lockstep ledger |
| Commit + push via the SSH wrapper, main only | FINAL | the dry-run + the push + the remote verify |

---

## The execution record (2026-10-27, session-191)

- **The audit GREEN** — the baseline gate at the shipped s190 state
  (the pulled workspace at `968736a`, tree clean): lint 0/0 · tsc 0 ·
  138/2786 · build · smoke 14/14 · e2e 192/192 (clean first run, 5.7m)
  · probe:ref STABLE (46bc2d9c — the demo data still ZERO, the desktop
  + TRUE-390 + landing censuses STANDING) · census MATCH (15/24/10/23/12
  + 4 users) · sitemap 11 routes + robots + manifest 200 · the
  Tailwind v4 state clean · the operator's standing asks verified
  (env/db placement · the vitest/playwright configs · sitemap/SEO ·
  mobile-nav · `.env.example`).
- **The rotation adjudication** — probe:ref STABLE kills the
  fresh-bundle candidate; recharts latest 3.10.1 kills the 4.0 gate;
  the s402 close's conditional candidates re-checked by the discovery
  (`scripts/discover-191.ts`): the Edit-family STILL KILLED
  (rows=1 the empty-state row, rowMenus=0, zero calendar chips), the
  topbar-search gate KILLED again (populated=0), the dashboard
  follow-up-rows + the activities Completed-tab STILL KILLED (the
  zero-data state persists); **the round material = the THREE CREATE
  DIALOGS — the CONTACT/ACCOUNT/EVENT — LIVE on BOTH apps, byte-equal
  at the census level, genuinely unwalked two-app**; the plan landed +
  validated against the codebase, executed TDD.
- **WP-1 GREEN** — `scripts/walk64-createdialogs-focus-open.ts` (the
  walk61 multi-arm form over the THREE dialogs at BOTH axes: Phase A
  per dialog the OPEN census — the triggers byte-equal at
  1255,115 153x36 / 1274,103 134x32 / 1269,113 139x36 + the OPEN roots
  byte-equal at 464,45 512x810 / 384,214 672x472 / 384,133 672x634 +
  the DFS ledger + the FULL inputs id map + the labels wiring map + the
  comboboxes + the contact file input + the footer pairs + the mount
  focus; Phase B the REAL keyboard Tab drives — the chains
  STRUCTURALLY IDENTICAL (19/12/19 stops; the datetime segments'
  native 7-tab cycles identical on both) + the REAL :focus-visible
  faces byte-equal on the VISIBLE layers; Phase C the interactive arms
  — the meet/status select rides byte-equal + the EVENT related-to
  pick [the M-76c13 conditional Name field live on BOTH: the
  placeholder "Enter Contact name" + the box 728,638 303x36 + the
  comboTexts flip] + the cancel-then-reopen decode [the S71-P1
  fresh-per-open epoch vs the reference's keep-draft — the KEPT house
  superset]; Phase D the phone axes byte-equal at 0,42 390x760 /
  0,168 390x508 / 0,99 390x646); the walk re-run STABLE (the delta
  report byte-identical modulo the cures).
- **WP-2 GREEN — FOUR LIVE FINDS CURED, all the id-parity family**:
  D-191a1 the contact literal id/for map (the reference's
  name/email/phone/company/position restored; the ct-* retired; the
  s19 pwa-metadata pin re-anchored) · D-191a2 the account literal
  id/for map (name/industry/email/phone/website/revenue/employees
  restored; the acc-* retired) · D-191a3 the selects' id + label-for
  wiring (id="source"/for="source" + id="status"/for="status" — the
  aria-label superset KEPT) · D-191a4 the contact file input's
  explicit tabIndex retired (the D-187a1 doctrine's next member); the
  re-walk PROVES the id/for/tabIndex ledger deltas GONE; every
  remaining delta a documented genus or kept superset (the slot-count
  · the outline version + both sub-forms + the color-carrier · the
  M-81c2 token pairs · the md:text-sm composition genus — the COMPUTED
  font 14px/500 byte-equal both · the aria-label/svg/placeholder-
  `<option>` supersets · the reference's stale aria-controls + the
  dangling aria-describedby · the React useId format · the KEPT s172
  wiring superset on the event dialog).
- **WP-3 GREEN** — the pin survey first (the
  s15/s19/s28/s30/s50/s76/s92/s112/s172 families + the walk53-63
  decode freezes), then the battery: 4 born-green pins in page-layout
  (the walk64 decode freeze · the three open-interior construction
  freezes) + THE FOUR CURE PINS (RED-first: exactly 5 RED at birth —
  the contact freeze rides the cured file-input string — → the cures →
  GREEN).
- **WP-4 GREEN** — MUTATION-PROOF (the planted id="phone" regression →
  exactly 1 RED → restored → GREEN, no residual) · STASH-PROOF (the
  round's page-layout block stashed → exactly 138/2786 [the s190 ship
  state] → restored → 138/2794 [the +8 first pass]; the D-191a5 pin's +1
  caught at the full-suite count lands the TRUE 2795) · the walk re-run STABLE.
- **WP-5 GREEN** — skill-head-191.py ran FIRST (the SKILL v1.188.0, the
  s190 layer demoted at its ship counts 2786/192, the s191 layer live,
  idempotent; the retired s190 ship line PINNED by the generalized
  D-188a1 doctrine's next member in docs-counts) · count-ladder-191.py
  (2786 → 2795 [+9] · badge 2978 → 2987 [2795+192]; assert-first,
  idempotent) · the docs lockstep (the AGENTS Session-191 section · the
  PAD s191 inventory row · the CLAUDE page-layout bullet's walk64 tail
  · the README Tested row's walk64 clause + the badge · session_404.md
  + this execution record + the worklog entry [Task ID 191]) · the
  collateral re-anchors (the entity-dialogs.tsx line-count census
  1226 → 1250 at the PAD §11 row + the SKILL · the UNIT constant + the
  F-106a1 layer-axis + the §5.6 negatives ladder + the retired-s190
  ship-line pin).
- **WP-6** — the captures (docs/screenshots/: the three create dialogs
  OPEN ours+ref at the desktop axis + the phone-axis pair + the
  standard dev-server page set) + the operator asks all verified
  standing.
- **THE VERIFICATION LEDGER** — lint 0/0 · tsc 0 · 138/2795 · build ·
  smoke 14/14 · e2e 192/192 · db census MATCH · probe:ref STABLE · the
  three create-dialog arms byte-equal on both axes (post-cure) · the
  REAL Tab chains structurally identical (19/12/19 stops both).
- **SHIPPED** — committed on main + pushed via
  `docs/ssh_git_wrapper_v3.py` (the remote verified; no new branches).
