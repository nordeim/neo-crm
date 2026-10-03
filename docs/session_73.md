# Session 73 (Session-40 record) — 2026-10-03

## Context

Pulled `837a9b9` (the session-39 code at `c568cee` + the operator's
`docs/session_72.md` transcript commit). Baseline gate on the pulled
tree: **lint 0/0 (enforced) · tsc 0 · 909/909 unit (49 suites)** —
the documented state exactly. `.env`
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root
verified intact; the dev server healthy on :3000; no stale :3100
listener; `agent-browser 0.38.1` ready.

## The audits (two parallel agents + manual validation of every claim)

### A. The session-39 re-audit (fresh eyes on `c568cee`)

All seven session-39 fix families verified GENUINE — P1 the CI=1 gate
prefix (the pin really verifies it; the installed Playwright 1.63
source fails CLOSED on a leftover listener), P2 the three-way banner
(the vocabulary verified against the reference bundle itself), P3 the
profile save envelope, P4 the signup name family, P5 the presence
pairing, P6 the lint enforcement, P7 the sweep + cleanup hygiene. No
consumer of the old numeric return, no pin regressions, no e2e
residue. **New: N1 (LOW-MED)** login's `findUnique` the only
auth-route DB read outside the envelope (a raw non-JSON 500 on a
SQLITE_BUSY-class failure; login also excluded from the auth-reads
containment it.each); N2 (LOW-LOW, parity) the partial-import success
conflation; N3 (INFO) the two earlier import tests' non-exact toolbar
clicks — the s40 hygiene fix; N4-N7 INFO, no action.

### B. The deferred-findings graduation audit — the headline

**The non-FK coercion family GRADUATES, and it is much bigger than
the ledger knew:** 37 silent PUT members + 40 silent POST members
(the "~15 PUT sites" figure UNDERCOUNTED — the 19 `?? null`
optional-string clears were never counted, and 7 of the named lines
already 400'd). Every claim manually validated at file:line; the
three headline behaviors LIVE-proven with probe records (cleaned):

- **N-B4 (MED)** — the settings dead-fallback quartet:
  `{"defaultCurrency":123,"defaultTier":{"evil":1}}` → **200 + both
  stored `""`** — the non-optional `asString` returns `""`, and `""`
  is not nullish, so `?? "AED"` NEVER fired. The §16ad lesson with
  four unapplied instances.
- **N-B5 (MED-LOW)** — contacts PUT `status`: `{"status":123}` on an
  inactive contact → **200 + silently reset to "active"**;
  `{"status":"banana"}` stored verbatim (no enum —
  `CONTACT_STATUSES` not even imported).
- **N-B8** — events PUT `endAt`: `{"endAt":{"$gt":"…"}}` → **200 +
  the end time cleared AND the s36 end≥start invariant bypassed** (a
  null effectiveEnd skips the merged-record check).
- **N-B6** — `asNumber`'s truthy/array edges: `true`→1, `[5]`→5,
  `[]`→0, `" "`→0 all pass `Number()`.

**The graduation scope:** Tier 1 (the PUT-side silent-mutation
family) + Tier 2 (the POST-side *inventing* twins — `value→0`,
`dueAt→NOW`, the events invariant bypass). **Stays deferred with
rationale:** the POST enum defaults + string nulls (lenient-create,
no data destroyed), the strict-bool idioms, the CSV injection family
(deploy-posture), the Excel accept (S26-P6 parity), and every other
ledger item re-confirmed.

**The UI-payload census (the safety proof):** every real writer sends
typed values — the dialogs (strings-or-undefined/null, `Number()`/
`parseFloat()`, ISO dates), the inline controls, settings, the e2e
(UI-driven only), the seed (direct Prisma). **No guard can break a
real payload — the surface is API-only.**

## Standing layers (36th session, NO DRIFT)

The reference bundle md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`,
1,631,071 bytes — ELEVENTH consecutive stable session, fresh-fetched +
byte-compared); the reference's mobile-nav absence at a TRUE 390px
(8 links in DOM, 0 visible, nav w=0, no hamburger — 36th session);
the reference demo data still zero ($0.0k/$0.0k/$0k); our drawer live
in every direction (open: portal nav 288px + 8 links + scroll lock +
focus on Close; Escape: `visibility:hidden` + `pointer-events:none` +
unlocked + `aria-expanded:"false"`; history.back() on an in-app route
change: closed — the s35 ownership fix holds); zero 390px overflow on
all nine routes; the FK envelope 400 LIVE (re-proven by the audit's
probes — while the non-FK bad types all sailed through, the gap this
session closes); the gitignore negative space holds.

## The fixes (S40-P1..P6, RED-first)

Exactly the predicted failing pin set before the code — **57 RED**
(46 api-robustness + 11 coercion-guards; the prediction said 58 by an
arithmetic slip, the failure SET matched the pin set exactly; all 96
pre-existing api-robustness checks stayed green through RED):

- **P1 the helper family** — `isBadString` (the general isBadFK
  mirror) / `isBadDate` (stricter: garbage STRINGS are bad too; `""`
  stays the explicit clear) / `isBadNumber` (`Number()`'s truthy
  edges killed; finite numbers + numeric strings good) in
  `src/lib/api.ts`, with 11 BEHAVIOR checks on the real edge matrix
  (`tests/coercion-guards.test.ts` — the suite's first behavior
  tests for a guard family, not source contracts).
- **P2 the PUT-side sweep** — 30 field sites across the five `[id]`
  routes + the contacts `status` type guard AND its missing
  `CONTACT_STATUSES` enum.
- **P3 the settings revival** — the quartet's `optional: true` (the
  `??` fallbacks LIVE again: `""`/null default instead of storing "")
  + the five settings guards.
- **P4 the POST-side inventing twins** — leads value/dates, accounts
  revenue/employees, activities dueAt (which silently invented NOW),
  events endAt.
- **P5 the login envelope** — the read + verification + cookie-set
  tail wrapped (the last unwrapped auth read), login joining the
  auth-reads containment it.each.
- **P6 hygiene** — the dead `asRequiredString`/`asOneOf` exports
  deleted; `exact: true` on the two earlier import tests' toolbar
  clicks.

## Gate

**lint 0/0 (enforced) · tsc 0 · 966/966 unit (50 suites, +57) ·
build clean · 108/108 e2e on a fresh boot (CI=1).** The UI-payload
census held — no e2e tripped a guard (the guards' entire surface is
API-only, exactly as censused).

## LIVE verification (the dev server)

Every guard family both directions: the previously-silent mutations
now 400 with the exact house vocabulary (contacts status/phone/role,
settings currency/tier/followUpDays, events endAt POST+PUT, leads
value "abc"+`true`, accounts `[5]`+`" "`, activities dueAt+notes);
null/absent still clear; valid values still store (`"5000"`→5000,
`"aed"`→`"AED"`, a valid endAt intact through both rejects); the
settings round-trip restored (AED/B/new/month/3); login 200 with the
wrap. All probes cleaned BY EXACT ID.

## The incident + recovery (the session's census-method lesson)

The first LIVE probe's cleanup used `d[0]` on
`?search=Probe%20S40` — but the contacts list endpoint does NOT
filter server-side on `search` (the filter is client-side), so `d[0]`
was the alphabetically-first **"Aisha Bakr" — a SEEDED contact,
deleted by the probe cleanup.** Restored surgically to the seed
loop's exact values (the email fold rule, the phone pattern, the
source/priority/role/engagement/size maps, `owners[14 % 4]`, the
`d(-40)` lastActivityAt derived from Robert's `d(-43)` + 3×24h, the
seed loop's createdAt cadence) — verified 15/15 seeded contacts + 4
users + zero residue (the s36 "S36 Guard Probe" leftover and a junk
79-a user from an earlier session cleaned in the same pass). **A
probe cleanup must filter by an EXACT unique key (id or email),
never `d[0]` on a soft search — and `?search=` semantics are a
census question, not an assumption.**

## Screenshots

02/11/12 re-captured + **48-settings-defaults-guards NEW** (the
N-B4 fix's user-visible surface — the Defaults tab). 02 + 48
VLM-verified: the KPIs 24 leads/$337.0k/$126.0k/$0k/29.2%/83 days;
the Defaults tab clean with AED/new/B/3/Month/Monday restored.

## Docs realigned

README badge 1074 + the session-40 paragraph + the suite list
(+coercion-guards); AGENTS 966/108 + the session-40 block; CLAUDE
966; PAD the s40 row / 52 files / 966+108 / the checklist / the
command table; SKILL **v1.37.0** frontmatter + project_state + the
H1 + §16af; this session record; the plan's execution record; both
worklogs. `.env`/`.env.example` re-verified (no env surface change;
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root).
