# Session-39 Parity Remediation Plan (2026-10-03)

Session 39 on `main` @ `f7aac8c` (session-38 code at `4c3aeca` + the
operator's `docs/session_70.md` transcript commit). Baseline gate on the
pulled tree: **lint 0/0 · tsc 0 · 896/896 unit (49 suites)** — the
documented state exactly. `.env` `DATABASE_URL="file:../db/custom.db"`
with `db/` at the repo root verified intact; the dev server alive and
healthy; `agent-browser 0.38.1` ready.

## The audits (two parallel review agents + manual validation of every claim)

### A. The session-38 re-audit (fresh eyes on commit `4c3aeca`)

All six session-38 fix families verified GENUINE (P1 the optional name
parse + the fallback wiring; P2 the photoUrl guards on the complete
three-writer set + the trim harmonization; P3 the parseCsv seam + the
batch refetch; P4 the proof-coverage pins; P5 the upload write envelope;
P6 the four-route sweep). **One claim-vs-reality gap + new findings
(every one manually validated this session):**

- **F1 (MED — convergent with B's N-B1, the headline)** — the gate
  script's stale-server claim is FALSE in the reuse scenario:
  `playwright.config.ts:59` `reuseExistingServer: !process.env.CI`
  means a leftover `:3100` standalone listener is REUSED regardless of
  the preceding `bun run build` — a running process holds the OLD code
  in memory while the rebuild swaps static assets underneath. `bun run
  gate` can go GREEN on stale server code. `tests/gate-script.test.ts`'s
  own header comment ("running it always exercises the fresh tree") and
  the AGENTS.md/SKILL project_state "closes the stale-server class"
  claims encode the false belief. The script genuinely closes only the
  "e2e boots without a build" face.
- **F2 (MED-LOW — convergent with B's N-B2)** — the import's
  all-POSTs-failed conflation: `importContacts` counts only `res.ok`
  (crm-store.ts:219-227) and `runImport` maps `created === 0` → "No
  valid contacts found. Make sure your file has name and email
  columns." (contacts-page.tsx:269-271) — so a CSV WITH valid rows whose
  POSTs all fail (expired session, network drop) gets the WRONG
  message, and the "Failed to import contacts. Please try again."
  branch is reachable only via `importFile.text()` throwing. The batch
  action made the swallow structural (createContact had it too, but
  one-row-at-a-time).
- **F3 (LOW — B's N-B3)** — the profile `save()` lacks the try/catch
  its sibling upload path has (profile-page.tsx:117-136): a network
  throw mid-save propagates from `void save()` as an unhandled
  rejection, `setSaving(false)` never runs → the Save button stays busy
  forever with no toast. Also a raw `fetch`, not the sanctioned
  `call()` — but migrating to `call()` changes the reload choreography,
  so the surgical fix is the try/catch/finally wrap.
- **F4 (LOW)** — the signup name family completion, two edges one
  field over from the s38 fix: `{"name": 123}` silently derives from
  email (no isBadFK guard on signup's name — the same coercion class
  the photoUrl guards closed), and the DERIVED name is not re-capped
  (`nameFromEmail` can return the email local part up to ~150 chars vs
  the 80-char cap an explicit name gets; users PATCH caps at 60 — three
  ceilings).
- **F5 (LOW — test quality)** — the auth-reads containment pin
  (api-robustness.test.ts:590-596) has no presence pairing:
  `allInsideTry` returns TRUE on zero matches, so a route that lost all
  its `findUnique` calls keeps the pin green — the exact vacuity class
  the s38 settings-GET fix closed one pin over.
- **F6 (LOW)** — `eslint .` exits 0 on warnings: the documented "lint
  0/0" gate standard is enforced by convention only. The codebase is at
  0 warnings today; `--max-warnings 0` makes the standard load-bearing.
- **F7 (INFO→hygiene)** — sweep placement inconsistency: login sweeps
  BEFORE the `!limit.allowed` return (denied requests sweep too,
  login:12-13) while the three s38 routes sweep AFTER it (denied
  requests don't sweep) — the in-code "login's placement, mirrored"
  comment is inaccurate.
- **F8 (INFO→hygiene)** — the s38 quoted-comma e2e self-poisons after
  a mid-run failure: `Contact.email` is NOT unique and the cleanup
  `find(...)` deletes only the FIRST match (crm.spec.ts:1490-1497) — a
  leftover probe from an aborted run fails the next run's final
  `toBeUndefined` until manual cleanup.
- **F9 (INFO)** — workspace worklog Task-38 line says "873/817" (a
  typo for 873/873). Noted here; append-only protocol — the record
  stands, corrected in this session's entry.

Deferred with rationale (validated, NOT fixed):

- The Excel `.xlsx` accept (contacts-page.tsx:739-744) — the S26-P6
  parity contract pins the reference's exact file-input vocabulary
  (`accept=".csv,.xls,.xlsx"`, "Click to upload CSV or Excel"); the
  reference parses a real .xlsx through the same CSV text path. Fixing
  the accept list would BREAK parity. The failure mode is honest (rows
  need name+email cells; a binary file yields "No valid contacts
  found").
- Unbounded import / no cancel mid-import — the reference's flow is
  equally unbounded with no cancel; parity.
- The 11 e2e sleeps, the mobile-nav post-wipe coupling, the
  href-sink watch — unchanged, documented.

### B. The deferred-findings graduation audit

**ZERO graduations, ZERO closures** — all 20 ledger descriptions
verified accurate at `f7aac8c`, every rationale still holds (the full
verdict table is in the session record). The closest call: the non-FK
asString/asDate/asNumber coercion family (~15 PUT sites across 6
routes) — s38's photoUrl fix proved the mechanical pattern, but the
deferral was re-affirmed at s38 WITH the precedent in hand; it stays a
live scoping decision, first in line for session 40 if the operator
wants family symmetry.

## Standing layers (35th session, NO DRIFT)

- The reference bundle md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`,
  1,631,071 bytes — TENTH consecutive stable session, fresh-fetched +
  compared).
- The reference's mobile-nav absence at a TRUE 390px (8 links in DOM,
  0 visible, nav w=0, no hamburger — 35th session).
- The reference demo data still zero ($0.0k/$0.0k/$0k).
- Our drawer live in every direction (native-click open: the portal
  nav at 288px with all 8 links visible + the full-screen dialog +
  body scroll-lock + focus on the close button; Escape:
  `visibility:hidden` + `pointer-events:none` + unlocked +
  `aria-expanded:"false"`; history.back() on an in-app route change:
  closed — the s35 ownership fix holds).
- Zero 390px overflow on all nine routes (sweep + direct loads; the
  off-canvas `-translate-x-full` drawer panels are the documented
  fixed-position pattern, not overflow).
- The FK envelope 400 LIVE (`PUT {"accountId":123}` →
  `{"ok":false,"error":{"code":"BAD_REQUEST","message":"Invalid
  company selection"}}`).
- The gitignore negative space holds (`src/app/api/uploads/route.ts`
  NOT ignored; the runtime `/uploads/` anchored at the root).

## The fixes (S39-P1..P7, RED-first)

### S39-P1 — the gate's fresh-boot guarantee (F1, MED)

`package.json` gate script: the e2e step runs with `CI=1` —
`reuseExistingServer: !process.env.CI` then evaluates false, so the
gate ALWAYS boots a fresh server from the just-built tree and kills it
on exit. Plain `bun run test:e2e` keeps the reuse ergonomics for
iteration (the documented local workflow). RED pin first
(tests/gate-script.test.ts): the chain pin expects the `CI=1` prefix on
the e2e step + a new pin that the e2e step carries it (the fresh-boot
guarantee) + the header comment corrected. Docs: the AGENTS.md gate
row + the SKILL project_state "closed" claim sharpened to the honest
"closed under CI=1" wording.

### S39-P2 — the import error semantics (F2, MED-LOW)

`importContacts` returns `{ created, attempted }` instead of a bare
count (the type at crm-store.ts:86 + the action + the one call site).
`runImport`'s message logic then distinguishes the three cases, all
inside the reference's pinned vocabulary (S26-P6): `created > 0` →
"Successfully imported N contact(s)" (unchanged); `created === 0 &&
attempted > 0` → "Failed to import contacts. Please try again." (the
all-POSTs-failed case, now reachable); `created === 0 && attempted ===
0` → "No valid contacts found. Make sure your file has name and email
columns." (unchanged). The existing refetch-once pin's regex shape
(`created += 1; } await get().fetchContacts();`) is preserved by
construction. RED pins first: the store's return shape + the page's
three-way branch.

### S39-P3 — the profile save() envelope (F3, LOW)

profile-page.tsx `save()`: the fetch wrapped in try/catch, the catch
toasts the existing failure vocabulary ("Failed to update profile"),
`setSaving(false)` moved to a finally so every path un-busies the
button. Mirrors the sibling `uploadPhoto`'s structure exactly. RED pin
first (the save block contains the try/catch + the finally-set
saving).

### S39-P4 — the signup name family completion (F4, LOW)

signup/route.ts: `isBadFK(body.name)` → 400 "Invalid name" (the
present-non-string class, mirroring the photoUrl guard's shape — null
and absent still derive, `""` still derives per the s38 semantics);
the derived name capped `.slice(0, 80)` to match the explicit-name
ceiling. RED pins first: the guard presence + the cap on the combined
expression.

### S39-P5 — the auth-reads presence pairing (F5, LOW, strengthening)

tests/api-robustness.test.ts: the auth-reads `it.each` gains the
presence pairing (`toMatch(/db\.user\.findUnique\(/)` per route;
signup also `count`) — the vacuity closer, GREEN-on-arrival against
already-correct code.

### S39-P6 — the lint warning enforcement (F6, LOW)

package.json: `"lint": "eslint . --max-warnings 0"` — the documented
"lint 0/0" standard becomes load-bearing. RED pin first (the lint
script carries the flag), then the script edit; the suite is at 0
warnings so the gate stays green.

### S39-P7 — the sweep + e2e-cleanup hygiene (F7 + F8, INFO)

The three s38 auth routes: `sweepRateLimits()` moved BEFORE the
`!limit.allowed` return (login's exact placement) so denied requests
sweep too — the code finally matches its own "mirrored" comment. The
quoted-comma e2e cleanup deletes ALL matching emails (filter + loop)
and asserts `toHaveLength(0)` — self-healing across aborted runs.

## Execution order

P1 → P2 → P3 → P4 (RED pins written together, confirmed failing, then
the implementations) → P5/P6 (strengthening pins, GREEN-on-arrival) →
P7 → the full gate (lint · tsc · unit · build · e2e on a fresh boot) →
LIVE verification on the dev server (the import three-way message
logic with a dead-session probe, the profile-save catch path, the
signup name edges, the gate's fresh-boot behavior) → screenshots →
docs realignment (README badge/paragraph, AGENTS counts + the session
block, CLAUDE counts, PAD the s39 row, SKILL v1.36.0 §16ae + the
project_state claim fix, docs/session_71.md, this plan's execution
record, both worklogs) → commit on main + the SSH-wrapper push.

## Validation checklist (pre-execution)

- [x] F1: playwright.config.ts:59 + package.json gate script + the
      gate-script test header read; `reuseExistingServer` semantics
      confirmed (the Playwright default pattern).
- [x] F2: crm-store.ts:219-227 + contacts-page.tsx:249-276 read; the
      `call()` swallow at crm-store.ts:41-43 confirmed; the pinned
      vocabulary messages located.
- [x] F3: profile-page.tsx:117-136 read; the sibling uploadPhoto
      try/catch/finally at :95-115 confirmed as the pattern.
- [x] F4: signup/route.ts:46-47 + nameFromEmail:15-23 read; isBadFK
      (api.ts:54-56) + the photoUrl guard shape (contacts/route.ts:69)
      confirmed as the mirror.
- [x] F5: api-robustness.test.ts:590-596 read; the vacuity confirmed
      (no toMatch pairing on the read verbs).
- [x] F6: `eslint .` output clean (0 warnings) — the flag is
      GREEN-on-arrival.
- [x] F7: login:12-13 (sweep before the denied return) vs the three
      s38 routes read; the presence-only sweep pins
      (api-robustness.test.ts:567-569) unaffected by placement.
- [x] F8: crm.spec.ts:1464-1497 read; the single-match cleanup
      confirmed.

## Execution record (filled during execution)

- [x] S39-P1 RED: gate-script pins updated — the chain now expects
      `CI=1 bun run test:e2e` as the 5th step + the new fresh-boot
      pin (`the e2e step refuses to reuse a leftover server (CI=1)`)
      + the header comment corrected. First run: 3 failures (the
      chain + the new pin + the order pin still green). GREEN after
      the package.json edit.
- [x] S39-P2 RED: 3 new pins (the store returns {created, attempted};
      the page's three-way branch: all-failed → "Failed to import
      contacts", no-rows → "No valid contacts found", success
      unchanged; the refetch-once shape re-asserted — GREEN-on-arrival,
      the regex survived the return-type change by construction).
      First run: 2 failures (the shape + the branch). GREEN after the
      store + page edits.
- [x] S39-P3 RED: the profile save pin (try/catch + finally-saving).
      First run: 1 failure. GREEN after the wrap.
- [x] S39-P4 RED: 2 pins (the isBadFK name guard + the derived-name
      cap). First run: 2 failures. GREEN after the signup edit + the
      isBadFK import. One s38 pin re-anchored (the parenthesized
      `const name = (asString…`).
- [x] S39-P5: the auth-reads presence pairing — GREEN-on-arrival (3
      routes × findUnique, signup × count).
- [x] S39-P6 RED: the lint-flag pin. First run: 1 failure. GREEN
      after the script edit; `bun run lint` still 0/0.
- [x] S39-P7: the sweep placement harmonized on the three routes +
      the comment fixed; the e2e cleanup now deletes ALL matches and
      asserts toHaveLength(0). The sweep presence pins stayed green.
- [x] Gate: lint 0/0 · tsc 0 · **909/909 unit (49 suites, +13)** ·
      build clean · **108/108 e2e (+1: the import failure-message
      round-trip)** on a fresh boot (CI=1). The new e2e's first
      full-suite run failed on a strict-mode violation the isolated
      run could never see — the earlier round-trip test's "E2E Import"
      contact gives its row action buttons substring matches on a
      non-exact toolbar `getByRole("Import")` (a 5-way ambiguity,
      order-dependent; the global-setup re-seed hides it in isolation);
      fixed with `exact: true` on the toolbar clicks in BOTH import
      tests (Radix modal dialogs aria-hide the background, so the
      dialog's own submit stays unambiguous).
- [x] LIVE: the import three-way logic (all-POSTs-failed with a
      fetch-rejecting window.fetch patch through the real dialog → the
      exact "Failed to import contacts" banner; no-rows header-only →
      "No valid contacts found"; happy path → e2e); the profile catch
      path (the same patch on PATCH /api/users → toast + the Save
      button re-enabled, not stranded); the signup name edges (numeric
      → 400 "Invalid name"; a 140-a local part derives capped at
      exactly 80); the drawer re-check; the seeded dashboard at the
      s32 scales ($337.0k — VLM on 02).
- [x] Screenshots: 02/12 re-captured (11 byte-identical to HEAD — the
      deterministic seed at the same viewport renders identical pixels)
      + 47 (the import failure-message surface — the exact red
      "Failed to import contacts" banner through the real dialog) NEW;
      02 + 47 VLM-verified (the styling verdicts clean, the banner
      quoted exactly).
- [x] Docs realigned: README badge 1017 + the session-39 paragraph;
      AGENTS 909/108 + the session-39 block; CLAUDE 909/108; PAD the
      s39 row; SKILL v1.36.0 §16ae + frontmatter + project_state (the
      stale-server claim corrected); docs/session_71.md; this record;
      both worklogs.
