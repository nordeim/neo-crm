# Session 71 (Session-39 record) — 2026-10-03

## Context

Pulled `f7aac8c` (the session-38 code at `4c3aeca` + the operator's
`docs/session_70.md` transcript commit). Baseline gate on the pulled
tree: **lint 0/0 · tsc 0 · 896/896 unit (49 suites)** — the documented
state exactly. `.env` `DATABASE_URL="file:../db/custom.db"` with `db/`
at the repo root verified intact; the dev server healthy;
`agent-browser 0.38.1` ready.

## The audits (two parallel agents + manual validation of every claim)

### A. The session-38 re-audit (fresh eyes on `4c3aeca`)

All six session-38 fix families verified GENUINE — P1 the optional
name parse (the fallback wiring + the edge traces), P2 the photoUrl
guards on the complete three-writer set (+ the src/-wide grep: no
other writer), P3 the parseCsv seam + the batch refetch (ONE
unconditional `fetchContacts` on every path, `importBusy` always
reset), P4 the proof-coverage pins (the reset transaction cannot slide
out of the try unseen), P5 the upload write envelope (complete), P6
the four-route sweep. **One claim-vs-reality gap + the new findings
(every one manually validated, two LIVE-proven before planning):**

- **F1 (MED — the headline, convergent with audit B's N-B1)** — the
  gate script's stale-server claim is FALSE in the reuse scenario:
  `playwright.config.ts:59` `reuseExistingServer: !process.env.CI`
  reuses a leftover `:3100` standalone listener regardless of the
  preceding `bun run build` — a running process holds the OLD code in
  memory while the rebuild swaps static assets underneath, so `bun run
  gate` could go GREEN on stale server code (mixed-version serving).
  The gate-script test's own header comment ("running it always
  exercises the fresh tree") and the AGENTS/SKILL project_state
  "closes the stale-server class" claims encoded the false belief.
- **F2 (MED-LOW — convergent with N-B2)** — the import's
  all-POSTs-failed conflation: `importContacts` counts only `res.ok`
  and `runImport` maps `created === 0` → "No valid contacts found.
  Make sure your file has name and email columns." — so a CSV WITH
  valid rows whose POSTs all fail (expired session, network drop —
  `call()` swallows the fetch rejection) gets the WRONG banner, and
  the "Failed to import contacts. Please try again." branch was
  reachable only via `importFile.text()` throwing.
- **F3 (LOW — N-B3)** — the profile `save()` lacks the try/catch its
  sibling `uploadPhoto` has: a network throw mid-save propagates from
  `void save()` as an unhandled rejection, `setSaving(false)` never
  runs — the Save button stays busy forever with no toast.
- **F4 (LOW)** — the signup name family completion, two edges one
  field over from the s38 fix: `{"name": 123}` silently derives from
  email (no `isBadFK` guard on signup's name), and the DERIVED name is
  not re-capped (`nameFromEmail` can return the email local part, up
  to ~150 chars under the 160 email cap, vs the 80-char ceiling an
  explicit name gets).
- **F5 (LOW — test quality)** — the auth-reads containment pin has no
  presence pairing: `allInsideTry` returns TRUE on zero matches.
- **F6 (LOW)** — `eslint .` exits 0 on warnings: the documented "lint
  0/0" standard is convention, not contract.
- **F7/F8 (INFO)** — the sweep placement inconsistency (login sweeps
  before the denied return; the three s38 routes after — the
  "mirrored" comment inaccurate) + the quoted-comma e2e's
  single-match cleanup (Contact.email is not unique — a leftover probe
  from an aborted run poisons the next run's final assertion).

Deferred with validated rationale: the Excel `.xlsx` accept (the
S26-P6 pinned file-input vocabulary — the reference parses a real
.xlsx through the same CSV text path; parity keeps it), the unbounded
import / no cancel mid-import (reference parity).

### B. The deferred-findings graduation audit

**ZERO graduations, ZERO closures** — all 20 ledger descriptions
verified accurate at `f7aac8c`, every rationale still holds. The
closest call: the non-FK asString/asDate/asNumber coercion family
(~15 PUT sites across 6 routes quantified) — s38's photoUrl fix proved
the mechanical pattern, but the deferral was re-affirmed at s38 WITH
the precedent in hand; it stays a live scoping decision, first in line
for session 40 if the operator wants family symmetry.

## Standing layers (35th session, NO DRIFT)

The reference bundle md5-IDENTICAL
(`a70a637fcf1d4291da8e0d965676dc11`, 1,631,071 bytes — TENTH
consecutive stable session, fresh-fetched + compared); the reference's
mobile-nav absence at a TRUE 390px (8 links in DOM, 0 visible, nav
w=0, no hamburger — 35th session); the reference demo data still zero
($0.0k/$0.0k/$0k); our drawer live in every direction (the portal nav
at 288px with all 8 links + the full-screen dialog + the body
scroll-lock + focus on the close button; Escape: `visibility:hidden` +
`pointer-events:none` + unlocked + `aria-expanded:"false"`; an in-app
history.back(): closed — the s35 ownership fix holds); zero 390px
overflow on all nine routes (the off-canvas `-translate-x-full` drawer
panels are the documented fixed-position pattern); the FK envelope 400
LIVE (`PUT {"accountId":123}` → "Invalid company selection"); the
gitignore negative space holds.

## The fixes (S39-P1..P7, RED-first)

Exactly the predicted **11 failing pins** before the code (2×P1, 2×P2,
1×P3, 2×P4, 1×P6, 3×P7; the P5 presence pairing + login's sweep
placement GREEN-on-arrival):

- **P1 the gate's fresh-boot guarantee** — the gate's e2e step runs
  under `CI=1` (fresh boot + kill on exit; plain `bun run test:e2e`
  keeps the reuse ergonomics — pinned separately). The gate-script
  test's header claim is now true.
- **P2 the import's three-way banner** — `importContacts` returns
  `{ created, attempted }`; `runImport` maps the all-POSTs-failed case
  to the reference's own "Failed to import contacts. Please try
  again." and keeps the no-rows banner for `attempted === 0`. The
  refetch-once shape pin held throughout.
- **P3 the profile save() envelope** — the try/catch/finally (the
  catch toasts the existing failure vocabulary; the finally un-busies
  the button on every path).
- **P4 the signup name family** — `isBadFK(body.name)` → 400 "Invalid
  name" + the derived name capped at 80. One s38 pin re-anchored (the
  parenthesization).
- **P5 the auth-reads presence pairing** — the vacuity closer.
- **P6 the lint warning enforcement** — `--max-warnings 0`.
- **P7 the hygiene** — the sweep placement before the denied return on
  the three s38 routes + the e2e cleanup's delete-ALL-matches.

## Gate

**lint 0/0 (enforced) · tsc 0 · 909/909 unit (49 suites, +13) · build
clean · 108/108 e2e (+1) on a fresh boot (CI=1).** The new e2e's first
full-suite run failed on a strict-mode violation the isolated run
could never see — the earlier round-trip test's "E2E Import" contact
gives its row action buttons substring matches on a non-exact toolbar
`getByRole("Import")` (a 5-way ambiguity, order-dependent; the
global-setup re-seed hides it in isolation). Fixed with `exact: true`
on the toolbar clicks in BOTH import tests (Radix modal dialogs
aria-hide the background, so the dialog's own submit stays
unambiguous).

## LIVE verification (the dev server)

The import three-way logic through the REAL dialog: a
fetch-rejecting `window.fetch` patch (POST /api/contacts → reject, the
same semantics as the e2e's route.abort) renders the exact red
"Failed to import contacts. Please try again." banner; a header-only
CSV renders "No valid contacts found. Make sure your file has name
and email columns."; the happy path is e2e-held. The profile catch
path: the same patch on PATCH /api/users → the "Failed to update
profile" toast + the Save button re-enabled (not stranded). The
signup edges: `{"name":123}` → 400 "Invalid name"; a 140-a local part
derives a name capped at exactly 80 chars (probe cleaned — a one-off
Prisma deleteMany). The drawer re-check + the seeded dashboard at the
s32 scales ($337.0k/$126.0k/$0k).

## Screenshots

02 + 12 re-captured (11 byte-identical to HEAD — the deterministic
seed at the same viewport renders identical pixels) + **47 the import
failure-message surface NEW** (the exact red banner through the real
dialog). 02 + 47 VLM-verified (the styling verdicts clean; the banner
quoted exactly).

## Docs realigned

README badge 1017 + the session-39 paragraph + the gate rows; AGENTS
909/108 + the gate row + the session-39 block; CLAUDE 909/108; PAD
the s39 row / 909+108 / the checklist / the command table; SKILL
**v1.36.0** §16ae + frontmatter + project_state + the H1 (the
stale-server claim corrected); this session record; the plan's
execution record; both worklogs. `.env`/`.env.example` re-verified (no
env surface change; `DATABASE_URL="file:../db/custom.db"` with `db/`
at the repo root).

## The census-method lessons (§16ae)

A claim about a chain is a claim about every link's environment
(`reuseExistingServer` re-enters the chain's causality from outside
it); a count is not a result (`created === 0` meant two different
failures); an e2e that passes in isolation can be order-dependent
(the "E2E Import" substring ambiguity — `exact: true` for toolbar
clicks); a cleanup that assumes uniqueness poisons the NEXT run
(filter + delete-ALL + assert empty).
