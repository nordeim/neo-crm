# Session 75 (Session-41 record) — 2026-10-03

## Context

Pulled `1e088a6` (the session-40 code at `e3b410e` + the operator's
`docs/session_74.md` transcript commit). Baseline gate on the pulled
tree: **lint 0/0 (enforced) · tsc 0 · 966/966 unit (50 suites)** —
the documented state exactly. `.env`
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root
verified intact; the dev server healthy on :3000
(`/api/health` → `{"status":"healthy","db":"up"}`); no stale :3100
listener; `agent-browser 0.38.1` ready.

## The audits (two parallel agents + manual validation of every claim)

### A. The session-40 re-audit (fresh eyes on `e3b410e`)

All six session-40 fix families verified GENUINE — P1 the three
predicates with real behavior tests, P2 the 30-site PUT sweep + the
status enum, P3 the settings revival, P4 the 7 inventing twins, P5 the
login envelope, P6 the hygiene. No regressions, no vacuous pins, no
legit payload can trip a guard (the UI-payload census re-verified
independently; the fresh-boot 108/108 e2e confirms empirically).
**New: N1 (LOW-MED)** the shared session read outside the envelope
(`getSessionUser()`'s `findUnique` via `requireSession()` — a raw
non-JSON 500 on EVERY protected route on a DB failure; auth/me the
only direct reader, absent from the containment it.each); **N2 (LOW)**
the GET list routes' reads (12+ routes — the session-42 family
candidate, stays deferred); N3 isBadNumber's unpinned NaN/Infinity
branch; N6 the four one-shot sleep-backed e2e assertions (deferred,
zero flakes in 40 sessions).

### B. The deferred-findings graduation audit — the headline

**The POST-side lenient-create family GRADUATES, split.** The ledger's
"lenient-create, no data destroyed" rationale was FALSE as stated —
a present non-string payload IS silently destroyed: `POST
{"phone":123}` → **200 + phone:null** (LIVE-proven this session,
probe cleaned by exact ID). The full census: **19 string-null sites +
12 enum-field type-gaps** across the five create routes, every one
with a PUT twin already guarded in s40. **Stays deferred with
sharpened rationale:** the 2 `source` enum-membership sites
(settings-configurable vocabulary + the CSV import's arbitrary source
strings), the strict-bool idioms, the formula-injection half
(deploy-posture), the Excel accept, the partial-import conflation,
the 11 sleeps, the standing ledger (all 13 re-confirmed).

**Two more graduations:** the CSV embedded-quote escaping (the three
builders' plain `"${v}"` wrap → malformed CSV for quote-bearing
values — a correctness defect whose fix is byte-identical for
quote-free data, so the pinned format is untouched) and the
**relatedType vocabulary split** (new find: the dialogs send lowercase
"opportunity", the seed stores "Opportunity", the join was
case-sensitive — a UI-logged activity NEVER joined the Deals at Risk
table; the reference joins on a real FK). Plus hygiene: the dead
`sources` var + the stale `DEFAULT_SETTINGS` export.

## Standing layers (37th session, NO DRIFT)

The reference bundle md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`,
1,631,071 bytes — TWELFTH consecutive stable session, fresh-fetched +
byte-compared); the reference's mobile-nav absence at a TRUE 390px
(8 links, 0 visible, nav w=0, no hamburger — 37th session); the demo
data still zero ($0.0k/$0.0k/$0k); our drawer live in every direction
(open: portal nav 288px + 8 links + the body+main dual scroll-lock +
focus on Close; Escape: `visibility:hidden` + `pointer-events:none` +
unlocked + `aria-expanded:"false"`; history.back() on an in-app route
change: closed — the s35 ownership fix holds); zero 390px overflow on
all nine routes; the FK envelope 400 LIVE (re-proven: the leads POST
`{"value":true}` → 400 while the then-unguarded `{"stage":123}` sailed
— the exact gap this session closes); the gitignore negative space
holds.

## The fixes (S41-P1..P5, RED-first)

Exactly 39 failing pins before the code (the 40-prediction's one off:
the P2 byte-exactness pin is GREEN-on-arrival — it IS the
contract-preservation proof; the failure SET matched the code-change
pin set exactly; all 966 pre-existing checks stayed green through
RED):

- **P1 the 31 isBadString guards** across the five POST routes
  (contacts 9, leads 5, accounts 6, activities 6, events 5) — the PUT
  twins' predicates + messages verbatim, applied at the parse site.
- **P2 the RFC-4180 qq() cell-quoter** in entity-export.ts (the three
  builders + the export→import round-trip restored; the s26 source pin
  re-anchored on the qq() shape).
- **P3 the case-insensitive relatedType join** (reports-data.ts).
- **P4 the session-read envelope** (requireSession's try/catch →
  ERR.INTERNAL + auth/me's wrap; the (app) layout deliberately keeps
  its direct call — an honest 500 page, not a logged-out redirect).
- **P5 hygiene** (the dead `sources` var + `DEFAULT_SETTINGS` deleted;
  isBadNumber's NaN/Infinity edges pinned).

## Gate

**lint 0/0 (enforced) · tsc 0 · 1008/1008 unit (50 suites, +42: 39
RED-first + 3 strengthening) · build clean · 108/108 e2e on a fresh
boot (CI=1).** The UI-payload census held — no e2e tripped a guard.

## LIVE verification (the dev server)

Both directions: the previously-silent POST mutations now 400 with the
exact house vocabulary (contacts `{"phone":123}` → "Invalid phone
number"; leads `{"stage":123}` → "Invalid stage"; activities
`{"type":{}}` → "Invalid activity type"; events `{"type":[]}` →
"Invalid event type"; accounts `{"tier":123}` → "Invalid tier");
null/absent still default (leads without stage → "new"; value "5000" →
5000); a valid full contact creates whole (quotes-in-company + all
enums — the first attempt's "Invalid company size" was the probe's own
wrong vocabulary, the s28 enum, not a guard regression); login 200 +
auth/me 200 with the wraps; the at-risk join LIVE-proven BOTH
directions (a lowercase "opportunity" probe activity pulled "Supply
chain visibility" OUT of the at-risk list; the deal returned after the
cleanup). All probes cleaned BY EXACT ID; 15/15 seeded contacts + zero
residue across all four entity lists.

## Screenshots

02/11/12 re-captured (11 byte-identical to HEAD — the deterministic
seed; 02/12 within chart-animation raster noise) + **49-reports-deals-
at-risk NEW** (the P3 fix's user-visible surface — the tab-2 table at
the All Time period; the first capture at the default quarter period
showed "No at-risk deals", the CORRECT pre-existing s31 scoping — opps
filter by `createdAt >= Oct 1` and the seed predates Q4). 02 + 49
VLM-verified: the KPIs 24/$337.0k/$126.0k/$0k/29.2%/83 days + the blue
sidebar layout clean; the five at-risk deals (Turbine telemetry POC,
Supply chain visibility, Gulf ERP connector, Procurement dashboard,
Patient portal integration) + all three charts rendering.

## Docs realigned

README badge 1116 + the session-41 paragraph + the suite counts;
AGENTS 1008/108 + the session-41 block; CLAUDE 1008; PAD the s41 row /
1008+108 / the checklist / the command table; SKILL **v1.38.0**
frontmatter + project_state + the H1 + §16ag; this session record; the
plan's execution record; both worklogs. `.env`/`.env.example`
re-verified (no env surface change; `DATABASE_URL="file:../db/custom.db"`
with `db/` at the repo root).

## The deferred pointers (sharpened)

The GET list routes' reads (the session-42 family-symmetry candidate);
the CSV formula-injection decision for the operator ((a) parity /
(b) `=`+`@`+tab+CR / (c) full-OWASP — the phone-number `+` prefix is
the common legit dangerous-prefix data, which the pinned template
itself ships); the 2 source enum-membership sites; the 11 e2e sleeps;
the standing ledger; the drift re-sweep next live visit.
