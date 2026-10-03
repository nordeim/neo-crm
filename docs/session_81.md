# Session 81 (Session-44 record) — 2026-10-03

## Context

Pulled `c4048b0` (the session-43 code at `5ff767b` + the operator's
`docs/session_80.md` transcript commit — src identical). Baseline gate on
the pulled tree: **lint 0/0 (enforced) · tsc 0 · 1050/1050 unit (51
suites)** — the documented state exactly. `.env`
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root
verified intact; the dev server healthy on :3000
(`/api/health` → `{"ok":true,"data":{"status":"healthy","db":"up"}}`);
no stale :3100 listener; `agent-browser 0.38.1` ready.

## The audits (two parallel agents + manual validation of every claim)

### A. The session-43 re-audit (fresh eyes on `5ff767b`)

All five session-43 fix families verified GENUINE — P1 the leads
contactId FK pair, P2 the nine dead-`??` removals, P3 the settings
quartet, P4 the topbar wrap, P5 the events from/to guards. **No
regressions** (touched suites 214/214 green). **New findings (each
manually validated at file:line; the headline trio LIVE-proven with
probe records, all cleaned by exact ID):** **N-44a (LOW-MED)**
`Account.health` — the LAST dead schema field end-to-end (schema +
wire type + seed + the badge/CSV readers carry it; neither accounts
verb accepts it — POST `{"health":"At Risk"}` → 200 + "Healthy", the
PUT the same; the stored badge frozen at its seed value forever);
**N-44b (LOW)** the contacts POST silently drops `status` (the PUT
has accepted it since s42-P4 — every contact created "active"
regardless of payload); N-44c (INFO) the reports account/contact
null hardcodes; N-44d (INFO) the P1 capability is API-only;
N-44e (INFO) defaultCurrency unvalidated but consumer-less;
N-44f (INFO) the readSettings leadStages fallback omits
"unqualified" (entangled with the vocabulary product decision);
**N-44g (INFO + a LOW micro)** the topbar's `!body?.ok` envelope
path silently no-ops (only network rejections hit the s43 catch) +
no AbortController; N-44h (INFO) the calendarView `!view ||` narrow
unreachable (kept for symmetry).

### B. The deferred-findings graduation audit

**ZERO ledger/pointer graduations** — all 13 standing-ledger items
re-confirmed at file:line (two mechanical line drifts from s43's own
P5 guard block). The operator decisions remain open. Fresh-eyes:
**F-44a (LOW-MED) the UI clear-gap family** — the API's
explicit-clear convention unreachable from the five dual-verb
dialogs (every `|| undefined` mapping DROPS the key → the PUT's
`"X" in body` branch skips → the OLD value persists while the save
toasts success); the full census found 18 mapping sites across all
five dialogs; **F-44b (LOW)** the reports saveReport localStorage
write unguarded (the leads-page saveView twin IS guarded — a
convention inconsistency); **F-44c (LOW)** the dead account include
in the reports leads findMany (fetched, then discarded by the
serializer — a wasted LEFT JOIN); F-44d (INFO) validation-depth
members. CLEAN: the awaited-db/JSON.parse/timer/.then sweeps.

## Standing layers (40th session, NO DRIFT)

The reference bundle md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`,
1,631,071 bytes — FIFTEENTH consecutive stable session, fresh-fetched
from `/assets/index-DZ-xbrIm.js` + byte-compared); the reference's
mobile-nav absence at a TRUE 390px (8 links, 0 visible via the
getClientRects+visibility census, nav w=0, no hamburger — 40th
session); the demo data still zero (0/$0.0k/$0.0k/$0k/0%/0); our
drawer live in every direction (open: 8 links truly visible + the
dual scroll-lock + `aria-expanded:"true"`; Escape: hidden + unlocked
+ `aria-expanded:"false"`); zero 390px overflow on all nine routes.

**The F-44a parity proof (NEW this session, both directions, on the
reference):** a probe event created on the reference → edit → clear
the description → save → re-open: CLEARED; set Related To "Contact"
→ save → re-open: "Contact"; set back to "None" → save → re-open:
the placeholder. **The reference PERSISTS clears — our `|| undefined`
drop-key is a real parity break.** The probe event deleted; the
reference restored to zero (no residue). Our API's explicit-clear
verified end-to-end (PUT `{"description":"","location":"","relatedType":""}`
→ all null) — the UI just never sent it.

## The fixes (S44-P1..P6, RED-first)

Exactly 27 failing pins before the code (the plan's 30 was
pin-count arithmetic — pins-as-it-blocks vs expects, the s43
precedent; the failure SET matched the code-change pin set exactly;
all 1050 pre-existing checks stayed green through RED):

- **P1 the accounts health pair** — the `ACCOUNT_HEALTH_STATUSES`
  constant + the POST create-default shape (absent/""/null keep
  "Healthy") + the PUT branch with the `!health ||` narrow. LIVE:
  POST `{"health":"At Risk"}` → 200 + "At Risk" (was silently
  "Healthy"); PUT re-assign → stored; garbage/non-string/present-"" →
  400 "Invalid health status" on both verbs.
- **P2 the contacts POST status** — the PUT's s42-P4 vocabulary on
  create-default semantics. LIVE: `{"status":"inactive"}` → 200 +
  "inactive" (was silently "active"); absent → "active"; garbage →
  400 "Invalid status".
- **P3 the 21-site UI clear-parity sweep** — the 18 audited
  `|| undefined` / `"none" ? undefined :` / `: undefined` mappings
  PLUS 3 date-ternary members found during implementation (lead
  expectedCloseDate/nextFollowUp, event endAt), all mapped to
  null/"" — the EntityEditDialog pages' own convention. LIVE
  end-to-end through the real calendar dialog: set
  description/location/Related-To → all stored; clear all three +
  "None" → saved → **all null, contactId intact** (the old code
  silently kept the values).
- **P4 the reports saveReport guard** — the leads-page saveView
  convention (try/catch → `toast.error("Could not save report",
  "Browser storage is unavailable.")`).
- **P5 the topbar envelope-reset** — the `!body?.ok` path resets
  results + dropdown (a JSON 401/500 no longer strands stale
  results).
- **P6 the dead account include removed** — the reports leads
  findMany keeps only the owner include (the serializer nulls
  account anyway; behavior-identical, the wasted JOIN goes).

## Gate

**lint 0/0 (enforced) · tsc 0 · 1080/1080 unit (53 suites, +30 tests
/ +27 RED pins + 3 date-site pins) · build clean · 108/108 e2e on a
fresh boot (CI=1).** The UI-payload census held — no e2e tripped a
guard.

## LIVE verification (the dev server)

Both directions on all three headline families (P1/P2/P3 above);
P4/P5 pin-verified (storage-quota and a 500-envelope are not cleanly
LIVE-probeable). All probes cleaned BY EXACT ID; zero residue
(15/15 seeded contacts + 10 accounts + 24 leads + 23 activities + 12
events; the Khalid probe event restored to its seeded all-null
state).

## Screenshots

02/11/12 re-captured (11 + 12 BYTE-IDENTICAL to HEAD — the
deterministic seed; 02 within chart-animation raster noise) +
**52-event-related-none-option NEW** (the P3 fix's domain surface —
the Edit Event dialog with the Related To select open listing
None/Contact/Account/Opportunity/Lead, the exact control whose
"None" mapping was fixed). 02 + 52 VLM-verified (the KPIs
24/$337.0k/$126.0k/$0k/29.2%/83 days + the blue sidebar; the dialog
with its five options + the Khalid title).

## Docs realigned

README badge 1188 + the session-44 paragraph + the suite counts;
AGENTS 1080/108 + the session-44 block; CLAUDE 1080; PAD the s44
row / 55 suites / 1080+108 / the checklist / the command table;
SKILL **v1.41.0** frontmatter + project_state + the H1 + §16aj;
this session record; the plan's execution record; both worklogs.
`.env`/`.env.example` re-verified (no env surface change;
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root).

## The deferred pointers (sharpened)

The reports/export filter membership asymmetry (owner is an
arbitrary NAME STRING — membership impossible; garbage filters yield
EMPTY reports — GET-only, no corruption); the 2 source
enum-membership sites (the vocabulary-reconciliation product
decision — five disagreeing surfaces; the readSettings leadStages
fallback's missing "unqualified" is entangled with the same
stored-list question); the CSV formula-injection decision for the
operator ((a) parity / (b) `=`+`@`+tab+CR / (c) full-OWASP); the 11
e2e sleeps; the standing ledger; the drift re-sweep next live visit.
