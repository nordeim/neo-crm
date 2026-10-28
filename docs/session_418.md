# Session 418 — THE ADVISORIES RE-TRIAGE (the session-198 round record)

Date: 2026-10-29 · Rotation: 198 · Agent: main (Z.ai) ·
Plan: `docs/plans/2026-10-29-session198-advisories-retriage-dompurify-critical.md`

## The round

The post-197 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`ba30355` — the session_417 transcript, the s197 round's own
execution record). The round is THE STANDING PRE-SHIP DUTY'S OWN CATCH
— the s164 `bun audit` doctrine ("re-run each pre-ship") re-run live by
`scripts/discover-198.ts` BEFORE the plan: the advisories census had
DRIFTED since the s164 triage, and the drift carried the repo's first
CRITICAL on a RUNTIME dependency chain.

## The audit (the baseline + the discovery)

The baseline gate GREEN at the exact s197 ship state (the fresh-sandbox
clone to `ba30355`, tree clean — the environment rebuilt in the intake:
bun 1.3.14 + the Playwright chromium 1248 install + `db:push`/`db:seed`
+ the `.env` rebuilt from `.env.example` with a fresh 64-hex
AUTH_SECRET): lint 0/0 · tsc 0 · **138/2813** unit · probe:ref STABLE
(`46bc2d9c` — the bundle md5 unchanged, the demo data still ZERO, the
desktop + TRUE-390 + landing censuses STANDING) · db census MATCH
(15/24/10/23/12 + 4 users at `<repo>/db/custom.db` — the `.env`
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root, the
operator's standing ask verified).

The discovery verdicts: the standing data-gated re-checks ALL KILLED at
the reference's unchanged zero-data state (the Edit-family census rows=1
the empty-state rows, rowMenus=0, the topbar-search populated=0 on both
— the discover-184..198 standing census) · the conditional gates KILLED
(probe:ref STABLE kills the fresh-bundle re-derivation; the registry's
latest recharts 3.10.1 kills the 4.0 gate) · the s120-era re-walk kill
STANDING (the leads family source-frozen since s113 — 85 sessions; the
deps locked at the s196 census; the reference bundle STABLE — the kill
condition unmoved).

## The audit triage (the round's material)

`bun audit` run live against the shipped tree: **12 advisories (1
critical / 5 high / 4 moderate / 2 low)** — the census DRIFTED from the
triaged s164 form (9: 4 high / 4 moderate / 1 low, "ALL dev-toolchain
transitive, zero runtime request-path exposure"). THE DELTA: **the
repo's first CRITICAL on a RUNTIME chain** — `jspdf@4.2.1` (the DIRECT
runtime dep behind `src/lib/pdf-export.ts`, the reports PDF export)
ships the optional `dompurify` at **3.4.16, INSIDE the vulnerable range
`>=3.4.4 <=3.4.16`** (critical GHSA-cg2g-xh64-v4q7 — the
SAFE_FOR_TEMPLATES bypass · high GHSA-mrv2-3pqr-j5jr — the IN_PLACE
detached-subtree event-handler arming · low GHSA-c6gr-qvv4-5v3f). The
security-and-hardening triage ladder applied: "Is the vulnerable
function actually called in your code path?" — **NO** — dompurify
executes only inside jsPDF's `html()` plugin, and `pdf-export.ts` never
calls `.html(` (both export paths ride html2canvas image-slicing + the
text-mm API — grep-verified). The exposure form: a vulnerable package
SHIPPED in the runtime dependency tree, DORMANT at the code-path level.
The composition also drifted on the dev-toolchain side (`braces`
retired from the audit in the interim; the nested zod <4.6.6 member
appeared via eslint-config-next › eslint-plugin-react-hooks; the
launch-editor family grew inside the vite block). THE FIX VERIFIED ON
THE REGISTRY: **dompurify 3.4.17** — outside the vulnerable range,
satisfying jspdf's own `^3.3.1` floor. THE STALE-DOC CENSUS: the PAD
§10 ledger row + the AGENTS gate-order note both carried the s164
census verbatim; ZERO test teeth pinned either claim (the census went
stale silently for 33 sessions).

## The cures (the TDD ledger)

**D-198a1 — THE RUNTIME CHAIN'S CRITICAL.** THE CURE: the 3.4.17
transitive override (`overrides.dompurify` in package.json). The live
catch that chose the mechanism: the first attempt (`bun update
dompurify`) hoisted the root entry to 3.4.17 while ADDING dompurify as
a direct dependency and leaving a NESTED `jspdf/dompurify@3.4.16`
surviving on disk — Node resolution would still have loaded the
vulnerable copy at runtime. The override collapses every resolution to
3.4.17 (verified: no nested copy, the clean reinstall reproduces the
lockfile exactly); the accidental direct dependency reverted (the app
never imports dompurify — it is jspdf's optional dep). THE PINS (both
in the pdf-export suite, the one-suite doctrine): the EXHAUSTIVE
lockfile pin (every `dompurify@x.y.z` resolution asserted outside the
vulnerable range — RED-first at birth against the shipping 3.4.16 →
the cure → GREEN) + the DORMANCY FREEZE (`pdf-export.ts` NEVER calls
`.html(` — adopting jsPDF's html() plugin becomes a conscious act that
trips the pin). MUTATION-PROVEN ×2: the lockfile flip → exactly 1 RED
→ restored → GREEN; the planted `.html(` call → exactly 1 RED →
restored → GREEN. The post-cure audit: **9 advisories (4 high / 4
moderate / 1 low)** — the critical GONE, zero runtime chains.

**D-198a2 — THE SECURITY LEDGER'S OWN STALE CENSUS.** THE CURE: the PAD
§10 ledger row rewritten at the live post-cure census (9: 4h/4m/1l —
ALL dev-toolchain again: zod via
eslint-config-next›eslint-plugin-react-hooks · deepmerge-ts via the
prisma CLI · vite + launch-editor via vitest · source-map-js via
postcss) + the dormancy decode + the s198 re-triage clause carried in
the row + the AGENTS gate-order note re-anchored to the same live form
+ THE PINS (both in the docs-counts suite): the PAD-ledger pin (the
live census + the re-triage record + the retired braces-composition
negative) + the AGENTS-note pin (whitespace-normalized — the pin holds
the content, never the wrap). MUTATION-PROVEN ×2: the stale re-plant →
1 RED each → restored → GREEN.

DECLINED (the parity + posture doctrines): the dev-toolchain members'
bumps (deepmerge-ts 8 · vite 8.3.3 · the eslint-zod floor ·
source-map-js 1.2.2 — the s164 no-mid-rotation TOOLCHAIN posture
stands: every member build/lint/CLI-only, zero runtime request-path) ·
the registry majors (lucide-react 1.63.0 vs our 0.525 PARITY pin — the
reference's own bundle-decoded version, probe:ref STABLE re-verified;
prisma 7.10.1 vs our 6.19.3; next 16.4.3 vs our 16.4.2; zustand 5.0.16
vs our 5.0.15 — their own rotations, never mid-rotation, none carries
an audit advisory on our locked versions) · the e2e/a11y extensions
for the advisories axis (no page surface changed — the battery 195/195
+ the four-band sweep are the cure's inertness proof, not new
coverage).

## The count ladder + the docs lockstep

UNIT 2813 → **2817** (+4: the lockfile pin + the dormancy pin in
pdf-export · the PAD-ledger pin + the AGENTS-note pin in docs-counts)
· SUITES **138 HELD** (the one-suite doctrine — both pin pairs ride
EXISTING suites) · E2E 195 HELD · badge 3008 → **3012**. The head
surgery first (skill-head-198.py — the SKILL v1.195.0, the s197 layer
comment-demoted at its ship counts 2813/195, the s198 layer live at
2817/195 + the beneath-it tail, idempotent, the s197 exact-H1 guard
form), then count-ladder-198.py (assert-first, idempotent,
unique-anchor — 18 doc flips + the test-side re-anchors in the same
stroke: the docs-counts layer-axis [first = s198 at 2817/195, second =
s197 at its ship 2813/195] + the 2813 negatives joining the s166 block
+ the dialog-geometry-parity F-92a3 ladder [the four CLAUDE live
positives re-anchored 2817 + the 2813 forms join the negatives]). The
docs lockstep: the AGENTS Session-198 section · this record · the PAD
§7.1 s198 inventory row + the §10 ledger row (the D-198a2 cure site) ·
the README walk-contracts paragraph's s198 clause · the plan's
execution record · the worklog entry {Task ID: 198}.

## The verification (the final gate)

lint 0/0 · tsc 0 · **138/2817** unit · build (the type-gate artifact)
· smoke **14/14** · e2e **195/195** · the four-band sweep GREEN (the
cure's baseline-inertness proof — no pixel-bearing surface touched) ·
`bun audit` post-cure (9, all dev-toolchain, the documented posture
restored) · db census MATCH · probe:ref STABLE. The captures: the
reports pair (ours + the reference — the PDF-export surface whose
dependency chain carried the critical) + the dev-server set of the
remediated tree under `docs/screenshots/`.

## The next rotation's standing material

The advisories ledger is re-triaged and triple-pinned (the lockfile
resolution + the dormancy + the ledger census) — the next drift trips
a RED, not a silent doc. The standing candidates unchanged: the
s120-era interactive-table re-walk (the kill standing until the leads
family source, a dep, or the reference bundle moves) or a fresh
data-gated round if the reference gains demo data; the conditional
gates unchanged (the fresh-bundle re-derivation when probe:ref trips;
the recharts 4.0 gate). The next `bun audit` pre-ship ride re-checks
the census against the new pins.
