# Session 67 (2026-10-03) — Session-37: the containment proof + the FK-type hardening

## The setup

Workspace refreshed (`git pull` → `edf079e`: the session-36 code at
`1601436` + the operator's `docs/session_66.md` transcript commit). The
sandbox survived from session 36 — the tree clean and identical to
remote HEAD, the environment intact (`.env` `DATABASE_URL=
"file:../db/custom.db"`, `db/` at the repo root, node_modules, the
reference bundle cache, the dev server alive and healthy). Baseline
gate on the pulled tree: **lint 0/0 · tsc 0 · 838/838 unit (48
suites)** — the documented state, exactly.

## The audits

Two parallel review agents + manual validation of every claim against
the code:

1. **The session-36 re-audit (fresh eyes on `1601436`)** — P1–P5 all
   verified genuine (the events merged-record invariant incl. its edge
   cases; the upload pre-gate arithmetic + ordering + the
   formData-as-only-multipart-consumer check; the photoUrl guard's
   exhaustive writer set; the health 503; the reset `$transaction`
   child-first order; the read-path doctrine consistently scoped). The
   NEW findings: **F1 (HIGH)** the auth family's four mutating calls
   unwrapped (signup `user.create`, verify's two `user.update`s,
   resend's `user.update`) — the plan deferred only the auth READ
   guards, so the writes were neither fixed nor deferred; **F2 (MED)**
   the activities `[id]` PUT existence fetch outside the try (the only
   one of five); **F3 (MED)** the s36 `handlerBlock()` pins prove
   PRESENCE, not CONTAINMENT (empirically demonstrated: a write moved
   back out of the try keeps every pin green — exactly how F2
   escaped); **F4 (MED-LOW)** the settings GET's `readSettings()`
   lazily creating the singleton row outside any try; **F5 (LOW)** the
   "300/500 cap normalized" claim was false (users still
   `slice(0,300)`); **F6 (LOW)** two dead imports the `no-unused-vars:
   off` gate can't see; F7 (no action — the leads PUT 404-before-400
   ordering is defensible); F8 (pin-strength: the events direction +
   the upload constant unpinned).

2. **The deferred-findings graduation audit** — one graduation (the
   non-string FK coercion: `asString`'s optional semantics silently
   coerce `{"accountId": 123}` to a null FK — a SILENT CLEAR on PUT,
   16 sites across 9 route files); two closures as documented
   non-issues (the auth read guards — the only GET under `/api/auth`
   is `me`, the public session probe; the middleware question — none
   exists, page auth is the `(app)/layout.tsx` server redirect); the
   rest re-confirmed deferred with SHARPENED rationales (notably: the
   naive hydrate fix only serializes the duplicate, it does not dedupe;
   the e2e login-limiter margin is ~6 consecutive runs per 15 min;
   mobile-navigation.spec runs post-wipe by file order — safe today).

## The standing-layer drift re-sweep (live)

33rd consecutive session, **NO DRIFT**: the reference bundle
md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`, 1,631,071 bytes —
EIGHTH consecutive bundle-stable session); the reference's mobile-nav
absence at a TRUE 390px (8 links in DOM, 0 visible, nav w=0, no
hamburger); the reference demo data still zero (`$0.0k`); our clone —
the seeded dashboard at the s32 scales ($337.0k / $126.0k / $0k), the
drawer LIVE both directions (native-click open: 8 links + dual scroll
lock + focus on the close button; Escape: `visibility:hidden` +
unlocked + `aria-expanded:false`; `history.back()`: closed + unlocked),
zero 390px overflow on all nine routes (sweep + direct-load spot
re-checks), the FK envelope 400 LIVE (`"Selected company does not
exist"`), the gitignore negative space holds.

## The remediation (S37-P1..P7, all RED-first: 18 failing pins)

- **S37-P1 — the auth-family envelope** — signup wraps findUnique +
  count + create; verify wraps its whole DB tail (the in-try 4xx
  returns bypass the catch by construction); resend wraps findUnique +
  update. LIVE: signup 200 `requiresVerification`, the wrong-code
  verify → 400 "Invalid verification code. 4 attempts remaining." (NOT
  swallowed as a 500), resend 200, malformed body still 400.
- **S37-P2 — the structural stragglers** — the activities `[id]` PUT
  fetch moved inside the try (missing-id + malformed-body now 400
  before 404, matching the sibling `[id]` routes); the settings GET
  wraps `readSettings()` (the lazy singleton create is a mutating call
  reached from a GET).
- **S37-P3 — the non-string FK 400 family** — `asFKId`/`isBadFK` in
  `src/lib/api.ts` + guards at all 16 parse sites across 9 route
  files, the family vocabulary ("Invalid company/owner/contact
  selection"). LIVE: numeric accountId → 400 "Invalid company
  selection"; object ownerId → 400 "Invalid owner selection"; boolean
  contactId → 400 "Invalid contact selection"; `null` still clears
  (200); a valid string FK still stores ("Al Noor Manufacturing").
- **S37-P4 — the containment pins** — `trySpans()`/`allInsideTry()`:
  every `db.<model>.<verb>` call in the handler block must fall inside
  a try→catch span; the span end anchors on the `} catch` CLAUSE (the
  first RED run caught the pin's own flaw — a bare `indexOf("catch")`
  truncated at `req.json().catch(() => null)` inside leads'
  whole-handler try and at the fire-and-forget `lastActivityAt`
  updates); the events invariant direction + the upload `64 * 1024`
  constant pinned; the missing `[id]` PUT containment pins added.
- **S37-P5 — the hygiene** — the users PATCH photoUrl cap normalized
  300 → 500 (LIVE: a 400-char `https://` URL stores whole,
  `wasFull:true`); the dead `asDate`/`LEAD_SOURCES` imports removed.
- **S37-P6 — the gate** — lint 0/0 · tsc 0 · **873/873 unit (+35)** ·
  build clean · **106/106 e2e**.
- **S37-P7 — the deliverables** — LIVE verification (all of the above
  + the drawer re-check + the seeded dashboard at the s32 scales + the
  probe-user cleanup), 4 screenshots (02/11/12 re-captured + **45** the
  auth-signup surface NEW; 02 + 45 VLM-verified — the VLM's
  "Full Name" field list was a hallucination, the DOM is ground
  truth), `.env`/`.env.example` re-verified (no env surface change),
  docs realigned (README badge 979 + the session-37 paragraph, AGENTS
  873 + the session-37 block, CLAUDE 873, PAD the s37 row / 873+106,
  SKILL **v1.34.0** §16ac + frontmatter + project_state + the stale
  title-version fix, this log, the plan + its execution record, both
  worklogs).

## The census-method lessons (§16ac)

A bare `indexOf("catch")` is not a try's catch clause (the promise
`.catch` chains truncate the span — anchor on `} catch`); presence
pins survive containment regressions (assert the match index falls
inside a span); a "normalized as a side effect" claim is a pin away
from disproof; the VLM hallucinates form fields (the DOM is ground
truth for structure).

## The deferred pointers

Reset role-gating (the no-RBAC doctrine + the seed-role/e2e
interaction), list-endpoint caps, trusted-proxy limiter (+ the
6-runs/15-min e2e margin), updateLead supersede guard, hydrate
per-slice redesign (the naive fix only serializes), SavedReport dead
model, photoUrl onError fallback, the 11 e2e `waitForTimeout` sleeps
(on first observed flake), the mobile-navigation post-wipe ordering
coupling, the `website`/`location` href-sink watch item; the
base44-only AI extraction; the Opportunity create/edit UI (absent on
BOTH sides); the standing drift re-sweep continues next live visit.
