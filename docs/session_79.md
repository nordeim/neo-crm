# Session 79 (Session-43 record) — 2026-10-03

## Context

Pulled `81e53c7` (the session-42 code at `a8b83f5` + the operator's
`docs/session_78.md` transcript commit). Baseline gate on the pulled
tree: **lint 0/0 (enforced) · tsc 0 · 1032/1032 unit (50 suites)** —
the documented state exactly. `.env`
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root
verified intact; the dev server healthy on :3000
(`/api/health` → `{"ok":true,"data":{"status":"healthy","db":"up"}}`);
no stale :3100 listener; `agent-browser 0.38.1` ready.

## The audits (two parallel agents + manual validation of every claim)

### A. The session-42 re-audit (fresh eyes on `a8b83f5`)

All six session-42 fix families verified GENUINE — P1 the 11 GET
wraps (requireSession outside the try everywhere; query objects
byte-identical pre/post; the IIFE + null-guard typing preserved; the
pins non-vacuous), P2 `isBadBool` + the four strict-bool sites, P3 the
activities/[id] FK branches, P4 the contacts status non-optional parse,
P5 the hygiene, P6 the period optional parse. **No regressions** (one
plan-vs-code note: the export CSV `Response` construction sits outside
the try — behaviorally equivalent, the builders are pure). **New
findings (each manually validated at file:line; the headline pair
LIVE-proven with probe records, all cleaned by exact ID):** **N-43a
(LOW-MED)** the `Lead.contactId` dead relation (schema + wire type
carry it, no leads route accepts it — the payload silently dropped on
BOTH verbs); **N-43b (LOW)** the dead-`??` enum-default family on NINE
PUT sites (leads stage, activities priority/type/status, events
type/status, accounts status/tier, contacts priority — the s42-P5
settings shape, ×9); N-43c (LOW) the reports/export filter membership
asymmetry (garbage stage/status/source/owner silently yield empty
reports); N-43d (LOW) the events GET `from`/`to` lenient window (a
garbage param silently DROPPED the filter); **N-43e (LOW-MED)** the
settings defaults trio without membership (a poisoned default saves
verbatim and flows into the create dialogs — the free-text UI Inputs
are the vector); N-43f (INFO) firstDayOfWeek's missing isBadString
guard; N-43g (INFO) CONTACT_SOURCES kept alive by its own vocabulary
pin (intentional — the DOM-pinned reference vocabulary); N-43h (INFO)
the ownerId PUT asymmetry (mirrors the UI); N-43i (INFO) the dashboard
`rows` shadow (cosmetic).

### B. The deferred-findings graduation audit

**ZERO ledger/pointer graduations** — the mechanical well is dry: the
complete unguarded-payload census (every field on the 5 POST + 5 [id]
PUT routes + users PATCH + settings PUT + auth family + reset) comes
back CLEAN. All 13 standing-ledger items re-confirmed at file:line.
The operator decisions remain open (the CSV formula-injection posture,
the source-vocabulary reconciliation). The 11 e2e sleeps re-confirmed
at the exact lines (all hold post-s42). Fresh-eyes: **F-B1 (LOW)** the
topbar global search's debounced fetch — the ONLY unwrapped fetch in
src (a network failure → unhandled rejection + stale results; the s39
profile-save class); F-B2 = N-43d; F-B3 (INFO) the email-format/
URL-shape depth asymmetries; F-B4 (INFO) the StrictMode dev-only
setState-updater double-fire. CLEAN: every db call awaited, all
JSON.parse guarded, cookies sound, the upload chain solid.

## Standing layers (39th session, NO DRIFT)

The reference bundle md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`,
1,631,071 bytes — FOURTEENTH consecutive stable session, fresh-fetched
+ byte-compared); the reference's mobile-nav absence at a TRUE 390px
(8 links, 0 visible, nav w=0, no hamburger — 39th session); the demo
data still zero (Total Leads 0 / $0.0k / $0.0k / $0k); our drawer live
in every direction (open via the REAL trigger: `aria-expanded:"true"` +
the portal panel at 288px + all 8 links truly visible + the dual
scroll-lock + focus on Close; Escape: hidden + unlocked +
`aria-expanded:"false"` + `translate:-100%`; history.back() on an
in-app route change: closed — the s35 fix holds); zero 390px overflow
on all nine routes; the FK envelope 400 LIVE; the gitignore negative
space holds. **This session's probe lesson:** `visibility: hidden`
PRESERVES the layout box — `offsetWidth > 0` is NOT a visibility
proof; the census must check `getClientRects().length > 0 && computed
visibility !== 'hidden'` (the first drawer probe was fooled by
clicking the overlay's Close button, whose aria-label also matches
/menu/i).

## The fixes (S43-P1..P5, RED-first)

Exactly 20 failing pins before the code (the plan's 21 was an
arithmetic slip — P5 landed as ONE combined pin, the s42 precedent;
the failure SET matched the code-change pin set exactly; all 1032
pre-existing checks stayed green through RED):

- **P1 the leads FK branch pair** — `Lead.contactId` accepted on POST
  + PUT (the s42-P3 activities shape verbatim: parse-side isBadFK +
  asFKId, try-side existence checks with the POST's own vocabulary,
  the create-data field, the two FK_SITES census rows). The wire type
  has no `contact` object — no include changes.
- **P2 the nine dead-`??` removals** — each with the `!x ||` narrow
  (tsc); behavior-identical (the enums already 400 on `""`). The auth
  `?? ""` twins are TYPE-load-bearing and stay (documented).
- **P3 the settings defaults quartet** — defaultLeadStage vs
  LEAD_STAGES, defaultTier vs ACCOUNT_TIERS, calendarView vs
  month/week/agenda, + the firstDayOfWeek isBadString guard. The
  optional parse keeps the s40-P3 revival (`""`/null → the default).
- **P4 the topbar search fetch wrap** — try/catch around fetch+parse;
  the catch resets results + dropdown (the last unwrapped fetch in
  src).
- **P5 the events GET from/to guards** — isBadDate on both params →
  400 "Invalid from/to date" (absent/empty still pass).

## Gate

**lint 0/0 (enforced) · tsc 0 · 1050/1050 unit (51 suites, +18 tests
/ +20 RED pins) · build clean · 108/108 e2e on a fresh boot (CI=1).**
The UI-payload census held — no e2e tripped a guard.

## LIVE verification (the dev server)

Both directions: the leads contactId payload now APPLIES (POST set →
linked [was silently null], PUT re-assign → moved, `""` → cleared, a
stale id → "Selected contact does not exist", a non-string →
"Invalid contact selection", on BOTH verbs); the settings quartet
rejects the exact garbage ("Default lead stage must be a valid stage",
"Default account tier must be A, B or C", "Calendar view must be
month, week or agenda", "Invalid first day of week") while valid
values still save and `""`/null still default; the nine dead-?? sites
still 400 on present `""` with the exact enum vocabulary while valid +
legacy values ("hot" → "Key") still store; the events `?from=banana`
→ 400 "Invalid from date" while ISO windows 200; the topbar search
survives an aborted /api/search route (no unhandled rejection, the
dropdown closed) and recovers on retype. All probes cleaned BY EXACT
ID; zero residue (15/15 seeded contacts + 10 accounts + 24 leads + 23
activities + 12 events; settings restored to new/B/month/monday).

## Screenshots

02/11/12 re-captured (11 byte-identical to HEAD — the deterministic
seed; 02/12 within chart-animation/raster noise) + **51-topbar-search-
results NEW** (the P4 fix's domain surface — the topbar global search
dropdown open with categorized results: Meridian Financial / James
Whitfield / Robert Chen / the three Meridian leads; 41-dashboard-
search-filtered shows the input CLOSED, so the open dropdown is a
genuinely new surface). 02 + 12 + 51 VLM-verified (the KPIs
24/$337.0k/$126.0k/$0k/29.2%/83 days + the blue sidebar clean; the
drawer with its 8 links; the search dropdown with its results).

## Docs realigned

README badge 1158 + the session-43 paragraph + the suite counts;
AGENTS 1050/108 + the session-43 block; CLAUDE 1050; PAD the s43 row /
53 suites / 1050+108 / the checklist / the command table; SKILL
**v1.40.0** frontmatter + project_state + the H1 + §16ai; this session
record; the plan's execution record; both worklogs. `.env`/
`.env.example` re-verified (no env surface change;
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root).

## The deferred pointers (sharpened)

The reports/export filter membership asymmetry (owner is an arbitrary
NAME STRING — membership impossible; source is the fragmented
vocabulary; garbage filters yield EMPTY reports — GET-only, no
corruption); the 2 source enum-membership sites (the
vocabulary-reconciliation product decision — five disagreeing
surfaces); the CSV formula-injection decision for the operator
((a) parity / (b) `=`+`@`+tab+CR / (c) full-OWASP); the 11 e2e
sleeps; the standing ledger; the drift re-sweep next live visit.
