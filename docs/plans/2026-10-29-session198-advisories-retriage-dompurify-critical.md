# The session-198 plan — THE ADVISORIES RE-TRIAGE (the runtime-chain critical's transitive cure + the security-ledger lockstep)

Date: 2026-10-29 · Rotation: 198 ·
Task: audit + validate the shipped session-197 state (commit `a482f72` +
the owner's transcript commit `ba30355` — the session_417 transcript is
this round's rotation trigger), re-run the standing discovery legs (the
data-gated re-checks · the s120-era re-walk kill · the conditional
gates), and take the round's fresh material the standing pre-ship duty
surfaces: the s164 `bun audit` doctrine re-run LIVE — the advisories
census has DRIFTED since the s164 triage (9 → 12, with the repo's FIRST
CRITICAL on a RUNTIME dependency chain — `jspdf` › `dompurify`), the
PAD §10 ledger row + the AGENTS gate-order note both still carry the
stale s164 census, and NOTHING pins either claim. Cure the critical the
same round (the dompurify 3.4.16 → 3.4.17 transitive refresh — the
registry fix, semver-safe under jspdf's own `^3.3.1` floor,
baseline-inert by decode), pin the ledger + the dormancy + the lockfile,
re-anchor every stale census site, TDD-first, align every doc in the
house lockstep, capture the round's set, push to main via the SSH
wrapper.

## 0. The audit (the baseline + the discovery)

The baseline gate at the shipped s197 state (the fresh-sandbox clone to
`ba30355`, tree clean — the environment rebuilt in the intake: bun
1.3.14 + the Playwright chromium 1248 install + `db:push`/`db:seed` +
the `.env` rebuilt from `.env.example` with a fresh 64-hex
AUTH_SECRET): lint 0/0 · tsc 0 · **138/2813** unit · probe:ref STABLE
(`46bc2d9c` — the bundle md5 unchanged, the demo data still ZERO, the
desktop + TRUE-390 + landing censuses STANDING) · db census MATCH
(15/24/10/23/12 + 4 users at `<repo>/db/custom.db` — the `.env`
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root, the
operator's standing ask verified). The build · smoke · e2e legs ride
the final gate (§4).

The discovery (`scripts/discover-198.ts` — the discover-197 form + the
new audit-triage leg):

- **LEG-1 the standing data-gated re-checks — expected KILLED** at the
  reference's unchanged zero-data state (probe:ref this session: the
  demo data still ZERO — the discover-184..198 standing census: the
  Edit-family census rows=1 the empty-state rows, rowMenus=0, the
  topbar-search populated=0 on both, the dashboard follow-up-rows
  checkbox arms + the activities Completed-tab empty).
- **LEG-2 the s120-era interactive-table re-walk kill — STANDING.**
  The kill condition (the session_416 close: "until the leads family
  source, a dep, or the reference bundle moves"): the leads family
  source untouched since s113 (`f10cee6`, 85 sessions — git log), the
  deps locked (the lockfile census: recharts 3.10.1 · lucide 0.525.0 ·
  tailwind 4.3.3 — the s196 version census unchanged), the reference
  bundle STABLE at `46bc2d9c`. Nothing moved — the kill stands.
- **LEG-3 the conditional gates — KILLED**: probe:ref STABLE at
  `46bc2d9c` kills the fresh-bundle re-derivation; the registry's
  latest recharts is 3.10.1 (fetched live) — the 4.0 gate stays killed.
- **LEG-4 THE STANDING PRE-SHIP DUTY (the s164 `bun audit` doctrine)
  — THE ROUND'S MATERIAL FOUND.** `bun audit` run live against the
  shipped tree: **12 advisories (1 critical / 5 high / 4 moderate /
  2 low)** — the census DRIFTED from the triaged s164 form (9: 4 high /
  4 moderate / 1 low, "ALL dev-toolchain transitive, zero runtime
  request-path exposure"). THE DELTA: **the repo's first CRITICAL on
  a RUNTIME dependency chain** — `jspdf@4.2.1` (the DIRECT runtime dep
  behind `src/lib/pdf-export.ts`, the reports PDF export) ships the
  optional `dompurify` at **3.4.16, INSIDE the vulnerable range
  `>=3.4.4 <=3.4.16`** (critical GHSA-cg2g-xh64-v4q7 — the
  SAFE_FOR_TEMPLATES bypass · high GHSA-mrv2-3pqr-j5jr — the
  IN_PLACE detached-subtree event-handler arming · low
  GHSA-c6gr-qvv4-5v3f — the SMIL attributeName=href guard skip).
  The security-and-hardening skill's own triage ladder applied:
  "Is the vulnerable function actually called in your code path?" —
  **NO**: dompurify executes ONLY inside jsPDF's `html()` plugin, and
  `src/lib/pdf-export.ts` NEVER calls `.html(` (both export paths
  ride `html2canvas` image-slicing + the text-mm API — grep-verified).
  The exposure form: a vulnerable package SHIPPED in the runtime
  dependency tree, DORMANT at the code-path level — the PAD ledger's
  "zero runtime request-path exposure" claim is stale at the tree
  level (it survives only with the dormancy decode attached). The
  composition also drifted on the dev-toolchain side: `braces`
  retired from the audit (an eslint-config-next bump in the interim)
  while the nested **zod <4.6.6** member appeared
  (eslint-config-next › eslint-plugin-react-hooks) + the
  launch-editor family grew inside the vite block. THE FIX VERIFIED
  ON THE REGISTRY: **dompurify 3.4.17** — outside the vulnerable
  range, satisfying jspdf's own `^3.3.1` floor (a semver-safe
  transitive refresh: NO package.json change, NO toolchain touch, NO
  pixel-bearing surface — jspdf's own API untouched, the s25 PDF pins
  + the e2e export checks the proof legs). THE STALE-DOC CENSUS: the
  PAD §10 ledger row (line 1823) + the AGENTS gate-order note (line
  55) both still carry the s164 census verbatim; ZERO test teeth pin
  either claim (docs-counts holds no advisories pin — the census went
  stale silently for 33 sessions, exactly the failure mode the pin
  doctrine exists to prevent).

### The findings triage

**FIX THIS ROUND (the security-ledger round — zero pixel risk by
decode, verified by the four-band sweep):**

- **D-198a1 (Verified) — THE RUNTIME CHAIN'S CRITICAL.** The
  dompurify 3.4.16 → 3.4.17 transitive refresh (`bun update dompurify`
  — the package-manager-sanctioned surgical form; the git diff on
  `bun.lock` must move ONLY the dompurify entries) + THE PINS: the
  lockfile version pin (bun.lock read live, the dompurify version
  extracted + asserted outside the vulnerable range — a future
  re-resolution regressing it goes RED) + the dormancy pin
  (`pdf-export.ts` carries NO `.html(` call — dompurify's only jsPDF
  activation site; adopting `pdf.html()` becomes a CONSCIOUS act that
  trips the pin) — both in `tests/pdf-export.test.ts` (the PDF
  family suite, the one-suite doctrine).
- **D-198a2 (Verified) — THE SECURITY LEDGER'S OWN STALE CENSUS.**
  The PAD §10 ledger row rewritten at the live post-cure census
  (9 advisories: 4 high / 4 moderate / 1 low — ALL dev-toolchain
  again once dompurify is cured: zod via
  eslint-config-next›eslint-plugin-react-hooks · deepmerge-ts via the
  prisma CLI · vite + launch-editor via vitest · source-map-js via
  postcss) + the dormancy decode carried in the row (the s198
  re-triage clause) + the AGENTS gate-order note re-anchored to the
  same live form + THE PINS: the PAD ledger row pin + the AGENTS note
  pin (both in `tests/docs-counts.test.ts` — the doc-truth carrier;
  the ledger's live census claim NEVER unpinned again).

**DECLINED (recorded considered-and-declined for the next audit's
re-triage):**

- **The dev-toolchain members' bumps** (deepmerge-ts 8 · vite 8.3.3 ·
  the eslint-zod floor · source-map-js 1.2.2) — the s164 no-mid-rotation
  TOOLCHAIN posture stands: a toolchain bump forces the standing pixel
  baselines' re-derivation (its own rotation); every member is
  build/lint/CLI-only, zero runtime request-path (the re-triage
  documents each member's chain).
- **The registry majors** (lucide-react 1.63.0 vs our 0.525 parity
  pin — the reference's own bundle-decoded version is 0.525, probe:ref
  STABLE re-verified; prisma 7.10.1 vs our 6.19.3; next 16.4.3 vs our
  16.4.2; zustand 5.0.16 vs our 5.0.15) — the parity + freeze
  doctrines: lucide MUST stay 0.525 while the reference ships it; the
  next/prisma/zustand bumps are their own rotations, never
  mid-rotation, and none carries an audit advisory on OUR locked
  versions (the audit output is the evidence).
- **The e2e/a11y/empty-state extensions for the advisories axis** —
  no page surface changed; the battery's 195/195 + the four-band sweep
  are the cure's inertness proof, not new coverage.

## 1. The TDD ledger (the cure plan)

- **D-198a1 — RED-first pins, then the cure** (the lockfile is the
  shipped source the pins read):
  1. `tests/pdf-export.test.ts`: the NEW lockfile pin — read
     `bun.lock`, extract the dompurify resolved version, assert it
     sits OUTSIDE the vulnerable range (>= 3.4.17) → **RED at birth**
     (the lockfile ships 3.4.16).
  2. `tests/pdf-export.test.ts`: the NEW dormancy pin — read
     `src/lib/pdf-export.ts`, assert ZERO `.html(` call sites →
     GREEN at birth (the existing truth frozen; the pin's teeth ride
     the mutation).
  3. THE CURE: `bun update dompurify` → the lockfile moves
     3.4.16 → 3.4.17 (git diff on bun.lock: ONLY the dompurify
     entries move — the surgicality check) → `bun install` green →
     pin 1 GREEN.
  4. THE POST-CURE AUDIT: `bun audit` → 9 advisories (4 high /
     4 moderate / 1 low), the critical GONE, zero runtime chains.
  5. MUTATION-PROOF ×2: (a) the lockfile mutation (the dompurify
     entry flipped back to 3.4.16) → the lockfile pin RED exactly at
     the version line → restored → GREEN; (b) the planted
     `.html(` call in pdf-export.ts → the dormancy pin RED →
     restored → GREEN.
- **D-198a2 — RED-first doc pins, then the re-anchor**:
  1. `tests/docs-counts.test.ts`: the NEW session-198 describe block —
     the PAD ledger row pin (the live post-cure census form + the
     s198 re-triage clause) + the AGENTS gate-order note pin (the
     re-anchored audit clause) → **RED at birth** (both docs still
     carry the s164 census).
  2. THE CURE: the PAD §10 row rewritten + the AGENTS note
     re-anchored (the exact new forms, §2) → both pins GREEN.
  3. MUTATION-PROOF: the stale census text re-planted in either doc →
     its pin RED → restored → GREEN.

## 2. The count ladder + the docs lockstep

UNIT 2813 → **2817** (+4: the lockfile pin + the dormancy pin in
pdf-export · the PAD-ledger pin + the AGENTS-note pin in docs-counts)
· SUITES 138 HELD (the one-suite doctrine — both pin pairs ride
EXISTING suites) · E2E 195 HELD · badge 3008 → **3012** (the
unit+e2e arithmetic: 2817+195). `skill-head-198.py` FIRST (the SKILL
v1.195.0, the s197 layer comment-demoted at its ship counts 2813/195,
the s198 layer live at 2817/195 + the beneath-it tail, idempotent,
the s197 exact-H1 hardened guard form), then `count-ladder-198.py`
(assert-first, idempotent, unique-anchor — the docs-counts UNIT
constant · the README badge + Tested row + tree + commands · the
AGENTS commands + gate-order · the CLAUDE gate-order + commands +
pyramid + the coverage seam · the PAD tree + Total + HEAD +
checklist + commands · the SKILL commands + Appendix B unit total).
The test-side re-anchors in the same stroke: the docs-counts
layer-axis (first = s198 at 2817/195, second = s197 at its ship
2813/195) + the unit negatives ladder (the retired 2813 site-forms
join the negatives, the s166 form) + the dialog-geometry-parity
F-92a3 ladder (the four CLAUDE live positives re-anchored 2817 + the
2813 forms join the negatives). The docs lockstep: the AGENTS
Session-198 section · `docs/session_418.md` · the PAD §7.1 s198
inventory row + the §10 ledger row (the D-198a2 cure site) · the
README walk-contracts paragraph's s198 clause · this plan's execution
record · the worklog entry {Task ID: 198}.

## 3. The captures

The round's reports pair (ours + ref at the desktop + the 390 phone
axis — the PDF-export surface whose dependency chain carried the
critical, the standing two-app parity re-verified) + the dev-server
set of the remediated tree (the landing + the dashboard + the
reports + the mobile drawer-open face — the operator's standing
mobile-nav ask), numbered past the s197 613-620 (621+), saved under
`docs/screenshots/`, the VLM battery on the reports parity pair (the
house evidence form).

## 4. The final gate + the push

`bun run gate` (lint 0/0 · tsc 0 · 138/2817 · build · smoke 14/14 ·
CI=1 e2e 195/195) · the four-band sweep GREEN (`--fail-on-drift`,
the not-found leg included — the cure's baseline-inertness proof) ·
`bun audit` post-cure (9, all dev-toolchain, the documented posture
restored) · probe:ref STABLE re-check · db census MATCH · the
SSH-wrapper push to main (`git@github.com:nordeim/neo-crm.git`),
no new branch, the wrapper's verified-push form.

## 5. The execution record (2026-10-29)

Executed as planned, in the order above, all green:

- **The baseline**: lint 0/0 · tsc 0 · 138/2813 unit · probe:ref STABLE
  at `46bc2d9c` (the bundle md5 unchanged, the demo data still ZERO,
  the desktop + TRUE-390 + landing censuses STANDING) · db census MATCH
  (15/24/10/23/12 + 4 users at `<repo>/db/custom.db`) — the
  fresh-sandbox environment rebuilt in the intake (bun 1.3.14 + the
  Playwright chromium 1248 install + the .env rebuilt from
  `.env.example` with a fresh 64-hex AUTH_SECRET).
- **The discovery** (scripts/discover-198.ts): the standing data-gated
  re-checks ALL KILLED (the live Edit-family census on both apps: OURS
  rows=15/24/10 with rowMenus live, the REF rows=1 the empty-state
  rows with rowMenus=0 — the discover-184..198 standing census; the
  topbar-search populated=0 on both) · the conditional gates KILLED
  (probe:ref STABLE; the registry's latest recharts 3.10.1) · the
  s120-era re-walk kill STANDING (the leads family source-frozen
  since s113 — 85 sessions; the lockfile deps at the s196 census; the
  bundle STABLE) · **THE AUDIT TRIAGE**: `bun audit` live → 12
  advisories (1 critical / 5 high / 4 moderate / 2 low) — the critical
  chain block decoded (jspdf@4.2.1 › dompurify 3.4.16, inside the
  vulnerable range), the dormancy check run (pdf-export.ts `.html(`
  call sites = 0 — the vulnerable function NEVER called in our code
  path), the fix verified on the registry (dompurify 3.4.17), the
  stale-doc census run (the PAD §10 row + the AGENTS gate-order note
  both carrying the s164 census verbatim), the post-cure projection
  (12 − 3 = 9, the documented posture restored).
- **D-198a1**: the two pins written into tests/pdf-export.test.ts (the
  lockfile pin RED at birth against the shipping 3.4.16 · the dormancy
  freeze GREEN at birth). THE CURE: the first attempt (`bun update
  dompurify`) caught LIVE — it hoisted the root to 3.4.17 but added
  dompurify as a direct dependency (reverted — the app never imports
  it; it is jspdf's optional dep) AND left a NESTED
  `jspdf/dompurify@3.4.16` surviving on disk (Node resolution would
  still have loaded the vulnerable copy) — the failure mode that
  chose the override mechanism: `overrides.dompurify = "3.4.17"` in
  package.json + a clean reinstall (the physical tree now reproduces
  the lockfile exactly; no nested copy). The pin hardened to scan
  EVERY `dompurify@x.y.z` resolution (the first-match form would have
  passed the nested copy). → GREEN. MUTATION-PROVEN ×2: the lockfile
  flip (3.4.17 → 3.4.16) → exactly 1 RED → restored → GREEN; the
  planted `.html(` call → exactly 1 RED → restored → GREEN. The
  post-cure audit: **9 advisories (4 high / 4 moderate / 1 low)** —
  the critical GONE, zero runtime chains. The bundle census:
  dompurify DOES ship in the client bundle (2 chunks — jspdf's static
  import graph; the html() plugin never invoked), so the override
  cured the SHIPPED copy too: the pre-cure bundle compiled against
  3.4.16, the post-cure build compiles against 3.4.17.
- **D-198a2**: the two pins written into tests/docs-counts.test.ts
  (both RED at birth). THE CURE: the PAD §10 ledger row rewritten at
  the live post-cure census (the composition re-derived: zod via
  eslint-config-next›eslint-plugin-react-hooks · deepmerge-ts via the
  prisma CLI · vite + launch-editor via vitest · source-map-js via
  postcss; the retired braces composition joined the negatives) + the
  dormancy decode + the s198 re-triage clause + the AGENTS gate-order
  note re-anchored (the whitespace-normalized pin — the first draft
  failed on the hard-wrapped head, the fix teaching the pin holds the
  CONTENT, never the wrap) → both GREEN. MUTATION-PROVEN ×2: the PAD
  stale re-plant → 1 RED → restored → GREEN; the AGENTS tail removal
  → 1 RED → restored → GREEN.
- **The lockstep**: skill-head-198.py ran FIRST (the SKILL v1.195.0,
  the s197 layer comment-demoted at its ship counts 2813/195, the s198
  layer live at 2817/195 + the beneath-it tail, idempotent, the s197
  exact-H1 guard form) · count-ladder-198.py (assert-first, idempotent,
  unique-anchor — 18 doc flips + the test-side re-anchors in the same
  stroke: the docs-counts UNIT constant + the layer-axis [first = s198,
  second = s197 at its ship 2813/195] + the 12 retired-2813 negatives
  joining the s166 block + the dialog-geometry-parity F-92a3 ladder
  [the four live positives re-anchored 2817 + the 2813 forms join the
  negatives]) · the docs (the AGENTS Session-198 section ·
  session_418.md · the PAD §7.1 s198 inventory row [inserted BEFORE
  the Total row per the s180 table-termination doctrine — the first
  edit landed after it and was reordered] + the §10 ledger row · the
  README walk-contracts paragraph's s198 clause · this execution
  record · the worklog entry {Task ID 198}).
- **The captures**: 621-628 (the reports pair ours+ref at the desktop +
  390 axes — the PDF-export surface whose dependency chain carried
  the critical — + the dev-server set: the landing + the dashboard +
  the reports + the mobile drawer-open face). The VLM battery: the
  desktop pair "all UI structure, layout, and styling remain in
  perfect parity" (the sole deviations the acceptable data-vs-empty
  genus) · the phone pair "visually identical in structure and
  styling, differing only in the numerical data".
- **The final gate**: lint 0/0 · tsc 0 · **138/2817** unit · build ·
  smoke **14/14** · e2e **195/195** (5.7m) · the four-band sweep GREEN
  (`--fail-on-drift` at desktop + 390 + 768×1024 + 1024×768 — the
  drift gate clean at every band, the not-found leg included, the
  seed restored after every run; the cure's baseline-inertness
  sweep-proven) · `bun audit` post-cure 9 (all dev-toolchain) · db
  census MATCH · probe:ref STABLE at `46bc2d9c`.
