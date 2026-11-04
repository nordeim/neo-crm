# The session-214 plan — THE AUTH-BULLET SEMANTIC-PROSE CENSUS (the AGENTS architecture-facts auth bullet joins the pin)

Date: 2026-11-04 · Rotation: 214
Task: the operator's standing instruction set — audit + validate the
shipped session-213 state (commit `97ea953` + the owner's transcript
commit `99edfe2` — the session_449 transcript is this round's rotation
trigger), re-verify visual + functional parity with the live reference
(`https://neo-crm-8ab2c17c.base44.app/`, logged in with the documented
demo credentials; the named focus: the mobile navigation), re-run the
standing gates, remediate the identified gaps, capture the round's
screenshots, update the docs, and push to `main`.

## 0. The audit (the baseline — EXECUTED, zero live defects, the FRESH-CLONE round)

The workspace did NOT survive this round — the sandbox reset emptied
`neo-crm/` (the bootstrap parent dir re-initialized at an unrelated
`Initial commit`), so the round ran `git clone
https://github.com/nordeim/neo-crm.git` fresh and rebuilt the
environment: `bun install` (536 packages) → `.env` from the documented
contract (`DATABASE_URL="file:../db/custom.db"` + a fresh
`AUTH_SECRET`) → `bun run db:push` + `db:seed` → **db census MATCH
15/24/10/23/12 + 4 users** (`<repo>/db/custom.db` — the repo-root
anchor, first-run verified). TWO reset artifacts caught + cured at the
gate layer (the s212 lesson, fresh-clone face):

1. **The stale parent-of-repo `db/custom.db` RESTORED by the reset**
   (mtime 2026-11-01 — the pre-s212-cleanup era file, still carrying
   the old seed): probed BEFORE the drift gates reused the :3000
   listener — the listener's cwd = the repo root (the correctly-anchored
   dev-server form), the app resolving the REPO db (the dashboard API
   re-probed green AFTER the stale file's removal — the anchor proof) —
   then the file REMOVED (the s212 cleanup re-applied; the phantom-drift
   hazard eliminated at the source).
2. **The Playwright browser-binary mismatch** (the project's Playwright
   expects `chromium_headless_shell-1248`; the sandbox cache carried
   only the 1200 era): `bunx playwright install chromium` — the first
   e2e attempt's setup leg failed on the missing binary (1 failed /
   225 did not run), the re-run CLEAN.

The scandihaven reference re-cloned (the reset emptied it too) —
`61711c3`, the standing commit, unchanged.

The baseline gate at the exact s213 ship state:

- lint 0/0 · tsc 0 · **138/2873 unit GREEN** (clean first pass) ·
  build (compiled successfully — the 2 warnings the pre-existing
  Turbopack tracing heuristics) · smoke 14/14 · **e2e 226/226 CLEAN**
  (8.1m) · db census MATCH.
- **THE SIX DRIFT GATES ALL CLEAN**: probe:ref STABLE at `46bc2d9c`
  (the demo data still ZERO) · the four-band sweep at
  `--fail-on-drift` ×4 (desktop 1280 · phone 390x844 · tablet
  768x1024 · landscape 1024x768) · the fullpage sweep CLEAN (desktop
  0.093% / phone 0.316% — the exact standing margins) · the interior
  census CLEAN at `--fail-on-drift` (byte-parity, every delta
  attributed, unexplained 0).
- THE PARITY RE-VERIFICATION (the operator's named focus, probed live
  with agent-browser 0.41.1 against BOTH apps logged in): **the mobile
  navigation both surfaces working** — the app drawer at 390×844 (the
  Close button + the "CRM" h2 + the 8 destinations; the overlay
  `rgba(0, 0, 0, 0.8)` and OURS `oklab(0 0 0 / 0.8)` — the same 80%
  black, the v4 serialization; ours the body+main dual lock vs the
  reference's body-only — the documented superset; Escape closes +
  releases every lock; the "Leads" link ride navigates `/Dashboard` →
  `/Leads` AND auto-closes AND releases every lock — verified on BOTH
  apps this round) + the landing "Toggle navigation" disclosure menu
  working on BOTH apps (the 6 links; ours the aria-expanded superset;
  the in-panel FAQ ride lands `/#faq` + collapses — verified on BOTH
  apps).
- Tailwind v4 state CLEAN (no config file — the CSS-first `@theme`;
  `postcss.config.mjs` carries the `@tailwindcss/postcss` plugin).
  SEO/sitemap live-verified on the dev server (the 11-route
  `/sitemap.xml` · `/robots.txt` 200 with the Sitemap line ·
  `/manifest.json` 200 `application/json` · the OG/Twitter/canonical
  head tags). The hygiene legs clean (`bun audit` at the pinned census
  10 — 4 high / 5 moderate / 1 low, all dev-toolchain transitive; no
  TODO/FIXME · no `console.log`). The recent-changes audit: the owner's
  newest commit adds `docs/session_449.md` only; src/ last touched at
  the s213 ship.

## 1. The round's material — F-214a: THE AUTH-BULLET SEMANTIC-PROSE RESIDUE (the named candidate's next family)

The s213 close named the next candidate: "the semantic-prose census's
REMAINDER (the next prose family, or whatever genus the tree grows)."
The round's fresh-eyes walk found NO live defect — the tree is fully
green at the exact s213 ship state, the reference STABLE, the docs
holding (the prose-claim samples verified live: the rate-limit table ·
the session contract · the reset-funnel constants · the proxy-hops
ladder · the guard claims · the envelope · the store · the postcss
plugin · the vendored tw-animate). So the round's material IS the named
candidate's next family — the genus-closing pin, the s208/s209/s213
precedent (the doc family clean, the pin the material):

- THE GENUS: every mechanically-checkable doc-claim family is pinned
  (the commands/paths/ADRs at D-208a1 · the env face at D-205a2 ·
  the strictness doc-family at D-206a1 · the chart-stack rows at
  D-207b1 · the push-ritual remote at D-209a2 · the counts at
  docs-counts · the conventions block's semantic claims at D-213a1) —
  but the AGENTS **"Architecture facts you would otherwise guess
  wrong"** section's FIRST bullet, the AUTH BULLET (the section's
  densest mechanically-checkable surface, lines ~71–99), still carries
  FIVE semantic claim clusters that ride on the rotation audit's fresh
  eyes alone:
  1. the RATE-LIMIT TABLE (login 10, signup 10, resend 5, verify 20,
     forgot 10, reset 10 — the public auth routes rate-limited per
     IP/15 min; the sessioned upload route at 20);
  2. the SESSION CONTRACT (scrypt password hashes `scrypt:salt:hash` ·
     HMAC-SHA256 signed stateless cookie `neo_session` (7-day TTL) ·
     the payload `uid,iat,exp,v` with the tokenVersion revocation
     dimension);
  3. the RESET FUNNEL (the no-enumeration 200 · the 32-byte
     crypto-random token, 60-min TTL · P2024/P2028→503 · the
     tokenVersion eviction);
  4. the PROXY-HOPS SEMANTICS (`NEO_PROXY_HOPS`: unset=1,
     0=direct/unknown, N≥2=Nth-from-last, unparsable fails closed);
  5. the GUARD CLAIMS (`requireSession()` + the `isGuarded()` narrowing
     helper guard every route handler · No NextAuth, no JWTs, no
     middleware/proxy).
- THE EXPOSURE (the genus's bite, the F-206a/F-213a precedent made
  mechanical): any of these claims can rot silently — a limit tuned
  (`login 10` → `5`) without the doc, a TTL change, a cookie rename, a
  fails-open slip in the proxy-hops ladder, a middleware.ts planted for
  a "quick fix" — and every gate stays GREEN (no pin reads the bullet;
  the behavior tests pin the mechanics at the route level, not the
  doc-face census; the prose is the operator's own contract surface).

## 2. The cure (TDD — the genus-closing pin, test-side only, src/ untouched)

**D-214a1 — THE AUTH-BULLET SEMANTIC CENSUS PIN** (a new
describe in `tests/facts-census.test.ts` — the D-204a1/D-205a1/
D-207b1/D-213a1 home; the F-109a1 live-read doctrine throughout):

- it-1 THE RATE-LIMIT TABLE: the AGENTS section carries the table
  strings (the flattened wrap-blind form) + the upload-20 clause + the
  per-IP/15-min clause; LIVE: walk `src/app/api/**/route.ts` for every
  `rateLimit(` call, extract the (family, limit, window) triples —
  assert the EXACT seven-entry set (login 10 · signup 10 · resend 5 ·
  verify 20 · forgot 10 · reset 10 · upload 20) at the 15-min window
  and NO other call sites (the census form — any new/changed limit
  trips the pin).
- it-2 THE SESSION-CONTRACT claim: the section carries
  `scrypt:salt:hash` + the HMAC-SHA256 cookie clause + `uid,iat,exp,v`;
  LIVE: `src/lib/password.ts` builds the `scrypt:${salt}:${hash}`
  template · `src/lib/auth.ts` carries `SESSION_COOKIE ===
  "neo_session"` + `SESSION_TTL_MS === 7 * 24 * 60 * 60 * 1000` + the
  `SessionPayload` fields exactly `uid/iat/exp/v` + the
  `createHmac("sha256"` signing pair.
- it-3 THE RESET-FUNNEL claim: the section carries the 32-byte/
  60-min clause + the no-enumeration 200 + P2024/P2028→503; LIVE:
  the forgot route's `randomBytes(32)` + `RESET_TOKEN_TTL_MS ===
  60 * 60 * 1000` · the reset route's P2024/P2028 → 503 mapping +
  the `tokenVersion: { increment: 1 }` eviction.
- it-4 THE PROXY-HOPS claim: the section carries the four-arm ladder
  prose; LIVE: `src/lib/rate-limit.ts` `proxyHopDepth()` — the exact
  parse ladder (unset/empty → 1 · unparsable/negative → 1 [fails
  closed] · else the parsed depth).
- it-5 THE GUARD claims: the section carries the requireSession +
  isGuarded clause + the No-NextAuth/JWTs/middleware clause; LIVE:
  `src/lib/api.ts` exports both (the `\b`-anchored forms — the s213
  M6 lesson) · `package.json` carries no next-auth dependency · NO
  `middleware.ts` anywhere under src/ or the repo root (the walk
  census).

**THE VERIFICATION (the pin's own named proofs):**

- Born-green at the cured tree expected (the audit verified every
  claim live — the D-208a1/D-213a1 precedent: the doc family clean,
  the pin the material; the count +5).
- MUTATION-PROVEN (each planted → exactly 1 RED at its own pin →
  restored → GREEN): M1 the login route's limit 10 → 5 (the src-side
  table mutation) · M2 the AGENTS table `login 10, signup 10` →
  `login 5, signup 10` (the doc-side arm) · M3 `SESSION_TTL_MS` 7 →
  30 days (the session contract) · M4 `RESET_TOKEN_TTL_MS` 60 → 30
  min (the reset funnel) · M5 the proxy-hops ladder fails open (the
  unparsable arm returns 0) · M6 a `src/middleware.ts` planted (the
  guard census).
- STASH-PROOF: the round's describe stashed → exactly 138/2873 (the
  s213 ship state) → restored → 138/2878.

## 3. The re-anchors (the count ladder + the docs lockstep)

- The count ladder: UNIT **2873 → 2878 (+5)** · SUITES 138 HELD (the
  pins land in an existing file) · E2E 226 HELD · badge **3099 →
  3104** (the unit+e2e arithmetic: 2878+226) + `skill-head-214.py`
  (the SKILL v1.211.0, the s213 layer comment-demoted at its ship
  counts 2873/226, the s214 layer live at 2878/226, `last_updated`
  stays 2026-11-04 — the same-day form; idempotent) +
  `count-ladder-214.py` (assert-first, idempotent, unique-anchor — the
  README/AGENTS/CLAUDE/PAD/SKILL live-tense flips + the test-side
  re-anchors in the same stroke: the docs-counts layer-axis pair
  [first = s214, second = s213 at its ship 2873/226] · the 2873
  negatives join the retired forms · the dialog-geometry-parity
  F-92a3 ladder: the four CLAUDE live positives re-anchored 2878).
- The docs lockstep: the AGENTS Session-214 section · the PAD §7.1
  s214 inventory row · `docs/session_450.md` (the transcript) · the
  worklog Task ID 214 entry · this plan's execution record (§5).

## 4. The final gate

lint 0/0 · tsc 0 · **138/2878 unit** · build · smoke 14/14 ·
`CI=1 bun run test:e2e` 226/226 · the six drift gates re-run CLEAN
(the cures test-side only — no src touch, but the house proves it) ·
db census MATCH · `git status` clean of secrets/dbs.

## 5. The execution record (filled at execution — all claims live-verified)

- §0 the audit: executed in full before the plan landed (the fresh-clone
  rebuild + the two reset-artifact cures + the six-gate sweep + the
  parity battery with agent-browser against BOTH apps + the SEO/sitemap
  curl legs + the hygiene greps + the bun-audit tally + the recent-changes
  diff + the scandihaven re-clone at 61711c3).
- D-214a1: **BORN-GREEN AT THE FIRST RUN** — 62/62 at the file, zero
  anchor-form cures needed (the s213 wrap-blind lesson applied at birth:
  the flattened-bullet form from the start; the D-208a1/D-213a1 birth
  precedent needed zero this time). **MUTATION-PROVEN ×6**: M1 the login
  route's limit 10 → 5 → exactly 1 RED (it-1, the src-side arm) · M2 the
  AGENTS table `login 10, signup 10` → `login 5, signup 10` → exactly 1
  RED (it-1, the doc-side arm) · M3 `SESSION_TTL_MS` 7 → 30 days →
  exactly 1 RED (it-2) · M4 `RESET_TOKEN_TTL_MS` 60 → 30 min → exactly
  1 RED (it-3) · M5 the proxy-hops unparsable arm fails open (returns
  0) → exactly 1 RED (it-4) · M6 a `src/middleware.ts` planted →
  exactly 1 RED (it-5) — each restored → GREEN. **STASH-PROOF**: the
  describe stashed → exactly 138/2873 (the s213 ship state, zero
  collateral) → restored → 138/2878.
- The count ladder + the docs lockstep: **UNIT 2873 → 2878 (+5)** ·
  SUITES 138 HELD · E2E 226 HELD · **badge 3099 → 3104** (the
  unit+e2e arithmetic: 2878+226 — verified against the live unit run:
  **138/2878 GREEN**) + `skill-head-214.py` (the SKILL v1.211.0, the
  s213 layer comment-demoted at its ship counts 2873/226, the s214
  layer live at 2878/226; `last_updated` stays 2026-11-04 — the
  same-day form; idempotent — the re-run a verified no-op) +
  `count-ladder-214.py` (assert-first, idempotent, unique-anchor — 27
  flips, the re-run all no-ops) + the test-side re-anchors in the same
  stroke (the docs-counts layer-axis pair: first = s214 · second =
  s213 at its ship 2873/226 · the 2873 negatives join the retired
  forms · the dialog-geometry-parity F-92a3 ladder: the four CLAUDE
  live positives re-anchored 2878) + the docs lockstep (the AGENTS
  Session-214 section · the PAD §7.1 s214 inventory row ·
  docs/session_450.md · the worklog entry [Task ID 214] · this
  record).
- The captures 727-731 (the dev-server set, pixel-signature verified:
  the blue sidebar (37,99,235) on the dashboard at 1280 · the
  (51,51,51) 80%-black overlay on the drawer OPEN at 390 · the
  near-white login card at 1280; the STATIC pages — the landing menu
  + the login card — at 0% coarse-grid diff against the s213 set; the
  dashboard pair at 2.8%/3.5%, ATTRIBUTED to the fresh seed's
  date-relative values — avgSalesCycleDays is the won leads' average
  AGE, floor((now−created)/day) per lead, so the KPI value text + the
  chart bar edges drift with the capture time, the s212 record's own
  note; the drawer at 0.5%):
  `727-s214-dev-dashboard-1280.png` · `728-s214-dev-dashboard-390.png`
  · `729-s214-dev-drawer-open-390.png` ·
  `730-s214-dev-landing-mobilemenu-390.png` ·
  `731-s214-dev-login-1280.png`.
- The final gate at the cured tree: lint 0/0 · tsc 0 · **138/2878
  unit** · build (the 2 warnings the pre-existing Turbopack tracing
  heuristics) · smoke 14/14 · `CI=1 bun run test:e2e` **226/226**
  (8.1m) · **all six drift gates re-run CLEAN** (probe:ref STABLE at
  `46bc2d9c` · the four-band sweep ×4 · the fullpage 0.093%/0.316% ·
  the interior census byte-parity, unexplained 0, exit 0 — the
  cures test-side only, no src touch, but the house proves it) · db
  census MATCH · `git status` clean of secrets/dbs (19 files: 9
  modified + 10 new, zero `.env`/`.db`/`.key`).

## The declined list (this round)

- The FULL semantic-prose census of the architecture-facts section's
  REMAINDER (the auth bullet is the next mechanically-checkable
  family after the conventions block; the Tailwind-v4 bullet family
  and the rest stay under the rotation audit's fresh-eyes walk, the
  s208 scoping doctrine — several of the Tailwind claims already ride
  tests/design-tokens.test.ts, the named-pin form).
- A mid-rotation eslint/vite-family bump (the standing posture).
- The skills/ mirror (the operator's own domain, the standing
  exclusion).
- Pinning the AGENTS Git block (the push-ritual family already pinned
  at D-209a2; the branch/commit-convention claims are process, not
  code).
