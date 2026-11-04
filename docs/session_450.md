# Session 450 — the session-214 round transcript (THE AUTH-BULLET SEMANTIC-PROSE CENSUS)

The rotation trigger: the owner's newest commit `99edfe2` — the
session_449 transcript, the s213 round's own execution record. The
**FRESH-CLONE round** (the sandbox reset EMPTIED `neo-crm/` — the
bootstrap parent dir re-initialized at an unrelated `Initial commit`
— so the round cloned the repo + rebuilt the environment: `bun
install` 536 packages · the standing `.env` contract re-created
[DATABASE_URL="file:../db/custom.db" + a fresh AUTH_SECRET] ·
`db:push` + `db:seed` · **db census MATCH 15/24/10/23/12 + 4 users**,
the repo-root anchor first-run verified).

TWO reset artifacts caught + cured at the gate layer (the s212
lesson, fresh-clone face):

1. **The stale parent-of-repo `db/custom.db` RESTORED by the reset**
   (mtime 2026-11-01 — the pre-s212-cleanup era file, still carrying
   the old seed): probed BEFORE the drift gates reused the :3000
   listener — the listener's cwd = the repo root (the
   correctly-anchored dev-server form), the app resolving the REPO db
   (the dashboard API re-probed green AFTER the stale file's removal —
   the anchor proof) — then the file REMOVED (the s212 cleanup
   re-applied; the phantom-drift hazard eliminated at the source).
2. **The Playwright browser-binary mismatch** (the project's
   Playwright expects `chromium_headless_shell-1248`; the sandbox
   cache carried only the 1200 era): the first e2e attempt's setup
   leg failed on the missing binary (1 failed / 225 did not run),
   cured with `bunx playwright install chromium`, the re-run CLEAN.

The scandihaven reference re-cloned (the reset emptied it too) —
`61711c3`, the standing commit, unchanged.

The baseline gate at the exact s213 ship state: lint 0/0 · tsc 0 ·
**138/2873 unit** · build (the 2 warnings the pre-existing Turbopack
tracing heuristics) · smoke 14/14 · **e2e 226/226 CLEAN** (8.1m). **THE
SIX DRIFT GATES ALL CLEAN**: probe:ref STABLE at `46bc2d9c` (the
demo data still ZERO) · the four-band sweep at `--fail-on-drift` ×4
(desktop 1280 · phone 390x844 · tablet 768x1024 · landscape
1024x768) · the fullpage sweep CLEAN (desktop 0.093% / phone 0.316%
— the exact standing margins) · the interior census CLEAN at
`--fail-on-drift` (byte-parity, every delta attributed, unexplained
0).

The parity re-verification (the operator's named focus) with
**agent-browser 0.41.1 against BOTH apps logged in**: **the mobile
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
apps). Tailwind v4 state CLEAN (no config file — the CSS-first
`@theme`; `postcss.config.mjs` carries the `@tailwindcss/postcss`
plugin). SEO/sitemap live-verified on the dev server (the 11-route
`/sitemap.xml` · `/robots.txt` 200 with the Sitemap line ·
`/manifest.json` 200 `application/json` · the OG/Twitter/canonical
head tags). The hygiene legs clean (`bun audit` at the pinned census
10 — 4 high / 5 moderate / 1 low, all dev-toolchain transitive; no
TODO/FIXME · no `console.log`). The recent-changes audit: the owner's
newest commit adds `docs/session_449.md` only; src/ last touched at
the s213 ship.

**THE ROUND'S MATERIAL — F-214a: THE AUTH-BULLET SEMANTIC-PROSE
RESIDUE (the s213 close's named candidate's next family).** The
fresh-eyes walk found ZERO live defects — every prose sample verified
live (the rate-limit table · the session contract · the reset-funnel
constants · the proxy-hops ladder · the guard claims · the envelope ·
the store · the postcss plugin · the vendored tw-animate) — so the
round's material IS the named candidate's next family — the
genus-closing pin (the s208/s209/s213 precedent). The genus: every
mechanically-checkable doc-claim family is pinned, but the AGENTS
**"Architecture facts you would otherwise guess wrong"** section's
FIRST bullet, the AUTH BULLET (the section's densest
mechanically-checkable unpinned prose surface), still carried FIVE
semantic claim clusters with no teeth: the rate-limit table (login
10, signup 10, resend 5, verify 20, forgot 10, reset 10 + the
sessioned upload route at 20, per IP/15 min) · the session contract
(scrypt `scrypt:salt:hash` · the HMAC-SHA256 signed stateless cookie
`neo_session` at the 7-day TTL · the `uid,iat,exp,v` payload with the
tokenVersion revocation dimension) · the reset funnel (the
no-enumeration 200 · the 32-byte crypto-random token at 60-min TTL ·
P2024/P2028→503 · the tokenVersion eviction) · the proxy-hops
semantics (`NEO_PROXY_HOPS`: unset=1, 0=direct/unknown, N≥2=
Nth-from-last, unparsable fails closed) · the guard claims
(`requireSession()` + the `isGuarded()` narrowing helper · No
NextAuth, no JWTs, no middleware/proxy). Any of them could rot
silently — a limit tuned, a TTL change, a cookie rename, a fails-open
slip, a middleware.ts planted for a "quick fix" — with every gate
GREEN.

**TDD execution — D-214a1 (the auth-bullet semantic census pin)** in
`tests/facts-census.test.ts` (+5 its, src/ untouched — the
baseline-inert construction): it-1 the RATE-LIMIT TABLE (the
wrap-blind doc face + the live call-site CENSUS — every
`rateLimit(family, limit, window)` triple walked from src/app/api;
the exact seven-entry set at the 15-min window; any
new/changed/removed site trips the census) · it-2 the
SESSION-CONTRACT claim (the scrypt template · `SESSION_COOKIE ===
"neo_session"` · `SESSION_TTL_MS === 7 * 24 * 60 * 60 * 1000` · the
SessionPayload field census exactly uid/iat/exp/v · the sign + verify
`createHmac("sha256")` pair) · it-3 the RESET-FUNNEL claim
(`randomBytes(32)` · `RESET_TOKEN_TTL_MS === 60 * 60 * 1000` · the
P2024/P2028→503 co-location arm · the `tokenVersion: { increment: 1
}` eviction) · it-4 the PROXY-HOPS claim (the exact `proxyHopDepth()`
parse ladder, all three arms) · it-5 the GUARD claims (requireSession
+ isGuarded exported with the `\b`-anchored forms — the s213 M6
lesson applied at birth · no next-auth in the manifest · NO
middleware.ts anywhere in src/, the walk census).

**Born-green at the FIRST run** — 62/62 at the file, zero
anchor-form cures needed (the s213 wrap-blind lesson applied at
birth: the flattened-bullet form from the start). **MUTATION-PROVEN
×6**: M1 the login route's limit 10 → 5 → exactly 1 RED (it-1, the
src-side arm) · M2 the AGENTS table `login 10, signup 10` → `login
5, signup 10` → exactly 1 RED (it-1, the doc-side arm) · M3
`SESSION_TTL_MS` 7 → 30 days → exactly 1 RED (it-2) · M4
`RESET_TOKEN_TTL_MS` 60 → 30 min → exactly 1 RED (it-3) · M5 the
proxy-hops unparsable arm fails open (returns 0) → exactly 1 RED
(it-4) · M6 a `src/middleware.ts` planted → exactly 1 RED (it-5) —
each restored → GREEN. **STASH-PROOF**: the describe stashed →
exactly 138/2873 (the s213 ship state, zero collateral) → restored →
138/2878.

The count ladder: UNIT **2873 → 2878 (+5)** · SUITES 138 HELD · E2E
226 HELD · badge **3099 → 3104** (the unit+e2e arithmetic: 2878+226
— verified against the live unit run: **138/2878 GREEN**). 
`skill-head-214.py` (the SKILL v1.211.0, the s213 layer
comment-demoted at its ship counts 2873/226, the s214 layer live at
2878/226, `last_updated` stays 2026-11-04 — the same-day form;
idempotent) + `count-ladder-214.py` (assert-first, idempotent,
unique-anchor — 27 flips, the re-run all no-ops) + the test-side
re-anchors in the same stroke (the docs-counts layer-axis: first =
s214, second = s213 at its ship 2873/226 · the unit negatives ladder:
the retired 2873 forms join the negatives · the dialog-geometry-parity
F-92a3 ladder: the four CLAUDE live positives re-anchored 2878) + the
docs lockstep (the AGENTS Session-214 section · the PAD §7.1 s214
inventory row · this transcript · the worklog Task ID 214 entry · the
plan's execution record).

The captures 727-731 (the dev-server set, pixel-signature verified:
the blue sidebar (37,99,235) on the dashboard at 1280 · the
(51,51,51) 80%-black overlay on the drawer OPEN at 390 · the
near-white login card at 1280; the STATIC pages — the landing menu +
the login card — at 0% coarse-grid diff against the s213 set; the
dashboard pair at 2.8%/3.5%, ATTRIBUTED to the fresh seed's
date-relative values — `avgSalesCycleDays` is the won leads' average
AGE, `floor((now−created)/day)` per lead, so the KPI value text + the
chart bar edges drift with the capture time, the s212 record's own
note; the drawer at 0.5%): `727-s214-dev-dashboard-1280.png` ·
`728-s214-dev-dashboard-390.png` · `729-s214-dev-drawer-open-390.png`
· `730-s214-dev-landing-mobilemenu-390.png` ·
`731-s214-dev-login-1280.png`.

The final gate at the cured tree: lint 0/0 · tsc 0 · **138/2878
unit** · build (the 2 warnings the pre-existing Turbopack tracing
heuristics) · smoke 14/14 · `CI=1 bun run test:e2e` **226/226**
(8.1m) · **all six drift gates re-run CLEAN** (probe:ref STABLE at
`46bc2d9c` · the four-band sweep ×4 · the fullpage 0.093%/0.316% ·
the interior census byte-parity, unexplained 0, exit 0) · db census
MATCH · `git status` clean of secrets/dbs. (One environment-only
wrinkle mid-gate: the dev server died under the e2e memory pressure —
relaunched with its DB anchor re-probed, the gates re-run CLEAN;
zero code involvement.)

DECLINED (recorded in the plan): the FULL semantic-prose census of
the architecture-facts section's REMAINDER (the auth bullet is the
next mechanically-checkable family after the conventions block; the
Tailwind-v4 bullet family and the rest stay under the rotation
audit's fresh-eyes walk, the s208 scoping doctrine — several of the
Tailwind claims already ride tests/design-tokens.test.ts, the
named-pin form) · a mid-rotation eslint/vite-family bump (the
standing posture) · the skills/ mirror (the operator's own domain,
the standing exclusion) · pinning the AGENTS Git block (the
push-ritual family already pinned at D-209a2; the
branch/commit-convention claims are process, not code).

Next step when you're ready: commit the session_451 transcript as the
rotation trigger — the semantic-prose census's remainder stays the
named candidate (the Tailwind-v4 bullet family, or whatever genus the
tree grows).
