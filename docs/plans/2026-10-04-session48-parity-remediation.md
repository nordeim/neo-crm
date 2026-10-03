# Session-48 Parity Remediation Plan (2026-10-04)

Session 48 on `main` @ `042bfe0` (the session-47 code at `cae88d6` + the
operator's `docs/session_88.md` transcript commit — src/tests delta empty,
verified by the fresh clone). Baseline gate on the fresh clone: **lint 0/0
(enforced) · tsc 0 · 1131/1131 unit (67 suites)** — the documented state
exactly. `.env` created from `.env.example` (+ a fresh `AUTH_SECRET`);
`db:push` + `db:seed` run — the database pristine (15 contacts / 24 leads /
10 accounts / 23 activities / 12 events / 4 users, counted via the
absolute-URL Prisma probe); the dev server healthy on :3000; the vitest
(5.0.1) + playwright (1.63) configs verified standing (`skills/` excluded
from lint/tsc/vitest by the established config trio).

## The standing layers (44th session, NO DRIFT)

The reference bundle fresh-fetched + md5-compared BEFORE planning:
**IDENTICAL** (`a70a637fcf1d4291da8e0d965676dc11`, 1,631,071 bytes — the
NINETEENTH consecutive stable session). The LIVE reference battery (login,
demo-data census, mobile-nav census, our drawer verification, the 390px
overflow sweep, the Tailwind v4 token contract) runs in the LIVE phase
below, per the established order (the sweep first, the live battery after
the fix surfaces exist).

## The audits (two parallel review agents + manual validation of every claim)

### A. The session-47 re-audit (48-a, fresh eyes on `042bfe0`)

All four session-47 fix families verified GENUINE at file:line — P1 the
dashboard export rewire (page.tsx:93-144 the four builders + :185-188/:197
the five affordances; byte-identical builders to the pages' own; zero
`/api/export`/`downloadFile` references; the e2e at crm.spec.ts:1406-1437),
P2 the insights vocabulary (four lowercase comparison sites — see N-48a for
the count correction — tint classes + icon mapping verbatim), P3 the leads
inline-edit feedback (:127-135 the debounced helper + :553/:567/:591 the
three `.then` chains + the unmount cleanup; no leak, no stale closure, the
success path never schedules), P4 the topbar hygiene (:6-14 Menu*-only).
Pins mechanically non-vacuous in a 75bda52 worktree: **11 failed | 1
passed** (the s45-precedent arithmetic exact); **12/12 at HEAD**; full
suite 1131/1131; zero suppressions in the diff (the 602-line src+tests
diff swept); scope exact (4 src + 4 pins + 1 e2e). **No regressions.**

### B. The graduation audit (48-b: the ledger + the CSV/export-family deep sweep)

**ZERO graduations** — all 13 standing-ledger items re-confirmed at
file:line on HEAD (drift map: topbar img −1, crm.spec reset test +33 — both
from the s47 additions; everything else at identical lines). The four
deferred pointers: (a) reports/export filter membership UNCHANGED;
(b) the 2 source enum-membership sites + the five disagreeing vocabularies
UNCHANGED (all anchors re-verified); (c) the CSV formula-injection exposure
fully censused (below); (d) the e2e sleeps drifted 11 → **12** (the s47
dashboard-export e2e added :1411 — re-anchored).

The CSV/export-family deep sweep (the session-48 decision surface): eight
builder surfaces (the /api/export?type=report route, the reports per-table
CSVs, the contacts/accounts/leads page exports, the settings raw dumps, the
dashboard's four builders) all pass cells beginning with `=` `+` `-` `@`
tab CR through UNSANITIZED — `escapeCell` (csv.ts:8-15) quotes only on
`[",\n\r]`, `qq` (entity-export.ts:35) only quote-wraps. The exposure is
LIVE: every seeded phone starts with `+` (seed.ts:117/:196/:259). **A guard
scoped to csv.ts + entity-export.ts breaks ZERO existing pins** (the unit
fixtures and e2e content assertions contain no dangerous-prefix cells; the
e2e leading-quote assertions still match since the guard prefixes INSIDE
the quotes). ONE conditional collision: the byte-exact template pin
(csv-templates.test.ts:46-51) breaks only if the STATIC templates are
brought into scope — they are NOT (our own content, not user data). The
import round-trip: parseCsv does not strip a leading apostrophe — a
`'`-prefixed sanitized cell re-imports as data with the literal apostrophe
(the documented trade-off).

## The two operator decisions (the session's mandate — DECIDED)

### Decision 1 — the CSV formula-injection posture: **(b)**

The `=`/`+`/`@`/tab/CR guard, on BOTH `csv.ts` and `entity-export.ts`.

Rationale: (a) parity leaves a genuine OWASP-documented injection vector
live on eight surfaces carrying user free-text (lead/contact/account
names, activity subjects/notes, report Deal Names) — the reference's own
posture (zero sanitization, even the unescaped quote-wrap its s41 defect
carried) is a template artifact, not a design worth mirroring when it is a
security defect, and the repo precedent for exactly this class is
s41-P2 (the quote-doubling fix: "byte-identical for every quote-free
cell, so the pinned reference format is untouched"). (c) full-OWASP adds
`-` — that mangles legit negative numbers and `-`-prefixed free text
(recurring data-fidelity cost) for a materially narrower residual vector
(modern Excel blocks DDE by default); the exclusion is deliberate and
documented. The phone-number cost of (b) (every `+`-prefixed phone cell
gains a `'`) is accepted: in Excel — the threat model's dominant consumer
— the `'` is the text marker and the phone renders MORE faithfully than
today (a compact `+1234567890` currently loses its `+` to formula
evaluation); the raw-text/re-import consumer sees the `'` (documented).
Mechanism: a shared `guardFormulaPrefix` in `csv.ts` (prefix `'` when the
first char ∈ {`=`, `+`, `@`, tab, CR}), applied inside `escapeCell` and
`qq` — the cell stays RFC-4180-well-formed, safe cells byte-identical.
The three STATIC templates stay VERBATIM (our own example content — no
attacker-controlled data flows through them; sanitizing changes the
import-template UX for zero security gain). The import surface stays
untouched (parity — it accepts arbitrary strings by design, including
`'`-prefixed ones).

### Decision 2 — the source-vocabulary reconciliation: the documented-parity posture

**NEW bundle evidence this session**: the reference's settings
`contactSources` is an ENTITY-BACKED CRUD list (`rt.entities.ContactSource`
— create/update/delete) whose ONLY consumer is the settings page's own
ConfigEditor (exactly one `ContactSource.list` query site in the bundle);
the reference's contact create dialog hardcodes its five emoji options;
its DB stores raw values. The five-vocabulary fragmentation IS the
reference's product design — our clone mirrors every surface of it. The
reconciliation decision, therefore:

- **NO enum-membership on `source`** (contacts/route.ts:128/:136,
  leads/route.ts:43-44 keep `isBadString` + max:40 only): membership would
  400 the reference's own accepted arbitrary import strings — a parity
  break on exactly the surface the reference allows — and every candidate
  vocabulary is case-disjoint from at least one other surface (the
  settings defaults are Capitalized, the functional vocabulary lowercase),
  so any single-list guard 400s either dialog-created rows or import rows.
- **The settings surface stays verbatim** (the Capitalized 6-item schema
  default + the 8-item seed picklist — the reference's own disjoint lists,
  mirrored; the ConfigEditor's list feeds no functional consumer BY
  DESIGN, now bundle-verified).
- **The N-47e hygiene fix lands**: the src-dead `CONTACT_SOURCES` constant
  (zero src consumers; only its own test pin reads it) is REMOVED together
  with its contradictory s5 header comment ("Stored values include the
  emoji — mirrored exactly" vs the s28 correction directly beneath it);
  the s28-corrected `CONTACT_SOURCE_OPTIONS` (raw values + emoji labels —
  pinned in contact-model.test.ts:108) is the surviving vocabulary, and
  the dead pin in constants.test.ts:74-83 is retired with it (the living
  surfaces are pinned: contact-model.test.ts:108 the OPTIONS,
  entity-edit-dialog.test.ts:83 the SOURCE_PAIRS).
- **The decision is documented in-file** at the surviving vocabulary
  (constants.ts), the settings route (readSettings), and the two route
  validation sites — the reconciliation record for future sessions.

## The fixes (S48-P1..P4, RED-first)

### S48-P1 — the CSV formula-injection guard (Decision 1)

`csv.ts`: the exported `guardFormulaPrefix(s: string): string` (prefix `'`
when `/^[=+@\t\r]/` matches) + `escapeCell` applies it after `String(v)`.
`entity-export.ts`: `qq` applies it the same way (imported from
`@/lib/csv` — no cycle: csv.ts imports nothing). Headers and values pass
the same seam uniformly (a no-op for every safe string — the static
headers never match). `entityDumpCsv`'s unquoted header (the first row's
own keys — Prisma field names) stays as-is (schema keys, safe). The
templates + the import parser stay VERBATIM.

### S48-P2 — the source-vocabulary reconciliation (Decision 2)

`constants.ts`: delete `CONTACT_SOURCES` + its s5 header comment; extend
the `CONTACT_SOURCE_OPTIONS` comment with the reconciliation record (the
bundle evidence + the no-membership rationale + the settings-list
design). `tests/constants.test.ts`: retire the dead pin (:74-83).
`settings/route.ts`: the reconciliation comment at the contactSources
defaults. `contacts/route.ts` + `leads/route.ts`: the no-membership
rationale comments at the source validation sites. NO functional change
anywhere — parity.

### S48-P3 — the insights badge display-case (N-48b, the F-47b seam's remaining half)

`account-insights-dialog.tsx:168`: the badge renders
`ACTIVITY_TYPE_META[a.type]?.label ?? a.type` (the house display-case
idiom — activities-page:185 + the reports route:355) instead of the raw
lowercase slug. The reference's badge renders its own raw type — which is
Capitalized in ITS storage; ours stores lowercase, so the label map is
what renders the same DISPLAY the reference renders. The icon/tint
comparisons stay exactly as s47 shipped them.

### S48-P4 — the reports export failure-mode fix (N-48g, the F-47a mechanism's last instance)

`reports-page.tsx`: the header Export CSV leaves `downloadFile`
(`window.location.href` — a non-200 navigates the browser to the raw JSON
envelope) for a fetch→blob flow: `fetch(url)` → `!res.ok` → parse the
envelope → `toast.error("Could not export report", …)` (the s46
convention — surface failures, never strand); ok → `res.text()` → parse
the filename from Content-Disposition (fallback
`csvFilename("crm_report")`) → `downloadBlob(text, filename, "text/csv")`.
The artifact bytes stay EXACTLY the route's (BOM + CRLF + escapeCell
quoting — the s25-pinned convention; the route keeps its single-source
filter model). `downloadFile`'s import goes with it (the page's last
reference; the helper stays for zero consumers — hmm, no: if this is the
last consumer repo-wide, download.ts's `downloadFile` becomes dead — the
audit verified reports-page:197 is the sole remaining site, so the helper
is retired to keep the seam honest, its comment updated).

ONE new e2e (the coverage gap — the same gap class that hid F-47a): the
reports header Export CSV downloads `crm_report_ISO.csv` with the BOM'd
7-column header + a data row, the URL staying `/reports`. E2e count
109 → 110.

## Pre-execution validation (done, at file:line)

- **Pin blast radius**: the CSV-family pins are behavioral at the public
  seams and their fixtures carry no dangerous-prefix cells (48-b's
  census); the e2e content assertions target headers (static safe words)
  or leading-quote shapes that the guard preserves (the prefix lands
  INSIDE the quotes); the template byte-pin is out of scope by design.
  `contact-model.test.ts:108` pins the OPTIONS (untouched);
  `entity-edit-dialog.test.ts:83` pins SOURCE_PAIRS (untouched);
  `insights-vocabulary.test.ts` pins the comparisons + tints (untouched by
  the badge change — a different JSX site); `reports-export` has ZERO
  existing e2e (the gap the new test closes); no unit pin reads
  reports-page's export onClick. `dashboard-export.test.ts` pins builder
  usage — the guard changes no builder signature.
- **E2e census**: no e2e asserts a dangerous-prefix CSV cell; the new
  reports e2e adds coverage; nothing can trip.
- **The finding validation**: N-48b's badge site (account-insights-dialog
  :168 renders `{a.type}`; ACTIVITY_TYPE_META call→"Call" at
  constants.ts:377-384; the house idiom at activities-page:185 +
  reports route:355); N-48g's site (reports-page :196-199 `downloadFile`
  + download.ts:8 `window.location.href`; the route's only consumer);
  the reference's own reports export is a CLIENT-side blob
  (bundle-verified this session — `new Blob([N]) + anchor.click()` with
  the `unquotedHeaderCsv` shape and `crm_report_ISO.csv`), so our fetch
  flow's failure mode is a strict improvement with the artifact preserved;
  the seed phones `+971…` (seed.ts:117/:196/:259); the four comparison
  sites (:147/:149/:154/:156 — N-48a's count correction); the dead
  constant's consumers (src-dead; tests/constants.test.ts:6/:74 only).

## RED pins (planned: 18 = 17 RED + 1 guard)

- `tests/csv-formula-guard.test.ts` — 10 its: (1) `toCsv` guards
  `=`-prefixed cells (the HYPERLINK payload → `'=HYPERLINK(…)` with
  doubled quotes); (2) guards `+` (the phone), `@`, tab, CR; (3) does NOT
  guard `-` (the posture-(b) exclusion, pinned); (4) safe cells
  byte-identical (the no-op contract); (5) `toQuotedCsv` guards (the
  quoted family); (6) `unquotedHeaderCsv` guards values, header stays
  unquoted; (7) `entityDumpCsv` guards; (8) parseCsv does NOT strip the
  guard marker (the documented round-trip trade-off); (9) the templates
  stay outside the guard (`+1234567890` verbatim — the deliberate
  exclusion); (10) the both-seams source pin (csv.ts defines
  `guardFormulaPrefix`, entity-export.ts imports it).
- `tests/source-vocabulary.test.ts` — 4 its: (1) `CONTACT_SOURCES` is
  absent from constants.ts (the dead export stays dead); (2) the
  contradictory s5 comment is gone; (3) the routes keep `isBadString`-
  only on source (no membership — the regex pin on both route files);
  (4) the settings defaults stay the Capitalized six verbatim.
- `tests/insights-badge-case.test.ts` — 2 its: (1) the badge site renders
  the ACTIVITY_TYPE_META label with the raw fallback; (2) the raw
  `{a.type}` badge shape is absent.
- `tests/reports-export-feedback.test.ts` — 3 its: (1) the page carries
  ZERO `downloadFile` references; (2) the fetch→blob shape (fetch + res.ok
  + `toast.error("Could not export report"` + downloadBlob + the
  Content-Disposition filename parse); (3) `downloadFile` retired from
  download.ts (no `window.location.href` seam left).

Predicted RED: 17 failures + 1 happy-path guard (the
insights tint/regression guard class — the exact count confirmed at
execution; the failure SET must match the code-change pin set).

## Gate + LIVE verification

Gate: lint 0/0 (enforced) · tsc 0 · full unit (1131 + the new pins) ·
build clean · 110/110 e2e on a fresh CI=1 boot (the 7 mobile-nav checks
included). LIVE battery on the dev server: (1) the reference login + the
demo-data census (44th) + the mobile-nav census at a TRUE 390px (the
reference's defect stands) + OUR drawer verified live in every direction
(the real trigger, 8/8 links, the dual scroll-lock, aria-expanded, Escape
→ inert + unlocked); (2) zero 390px overflow on all nine routes; (3) NO
Tailwind v4 bug (the standing token contract re-verified: literal-hex
`@theme`, the re-pinned `--shadow-sm`/`--blur-sm`, the vendored
tw-animate.css, the `@tailwindcss/postcss` wiring); (4) the fix surfaces:
a dangerous-prefixed lead name exported → the `'`-guarded CSV (blob probe,
the URL staying), the phone cells `'`-prefixed (the documented cost), the
insights dialog's badges render "Call"/"Email" (was call/email), the
reports Export CSV downloads with a forced-401 toast (offline probe), the
templates download byte-identical; (5) zero probe residue (15/24/10/23/12
pristine).

## Deferred pointers (carried forward)

The reports/export filter membership asymmetry (operator-shaped); the 12
e2e sleeps (re-anchored this session); the standing ledger (13 items, zero
graduations); the drift re-sweep next live visit. INFO notes documented
not fixed: F-47c (the lead blank-select parity note), N-47d (the dead
entity-dialog edit branches), N-48a (the "six sites" docs-accuracy
correction — lands in the LIVING docs this session: the SKILL §16am + the
pin comment; history records stay as-written), N-48c/N-48d/N-48e/N-48f/
N-48h/N-48j (the INFO family, documented in the session record).

## EXECUTION RECORD (2026-10-04, session 48 — SHIPPED)

- **RED**: exactly **13 failures + 6 regression guards** (19 its across 4
  pin files — the plan's 17+1 arithmetic corrected at execution: the
  `csv-formula-guard` file's `-`-exclusion / no-op / round-trip /
  templates-outside pins and the `source-vocabulary` file's routes /
  settings-defaults pins are GREEN-through-RED guards by design, the
  s45-precedent class). Full suite through RED: 13 failed / 1137 passed —
  all 1131 pre-existing checks green.
- **GREEN (S48-P1..P4)**: the formula-injection guard — `guardFormulaPrefix`
  in csv.ts (the `/^[=+@\t\r]/` → `'` text marker) applied inside
  `escapeCell` AND imported into entity-export.ts's `qq` (both families,
  one helper; safe cells byte-identical; `-` excluded; templates + import
  parser untouched); the source-vocabulary reconciliation — the src-dead
  CONTACT_SOURCES + its contradictory s5 comment REMOVED, the
  constants.test.ts pin re-anchored to the living CONTACT_SOURCE_OPTIONS
  labels, the reconciliation record documented in-file at constants.ts +
  settings/route.ts + both validation routes (NO enum membership, the
  settings defaults verbatim — the parity posture, bundle-evidenced); the
  insights badge display-case (ACTIVITY_TYPE_META label + raw fallback);
  the reports export fetch→blob flow (the !res.ok envelope toast + the
  Content-Disposition filename + `downloadBlob`; `downloadFile` retired
  from download.ts — the window.location.href seam left the codebase).
- **Mid-GREEN correction (the s45-s47 precedent)**: the e2e's first run
  caught a REAL byte-fidelity bug in the new flow — `res.text()` STRIPS
  the route's BOM (TextDecoder skips it by default), silently changing
  the s25-pinned artifact; fixed with the `ignoreBOM: true` arrayBuffer
  decode (the e2e re-run green; the BOM byte-verified 0xEF 0xBB 0xBF in
  the LIVE battery).
- **Gate**: lint 0/0 (enforced) · tsc 0 · **1150/1150 unit (71 suites,
  +19)** · build clean · **110/110 e2e on a fresh CI=1 boot** (the new
  reports-export download e2e #78; all 7 mobile-nav checks green).
- **LIVE**: the reference census (demo data zero + the mobile-nav defect
  at a TRUE 390px — the 44th session); our drawer verified in every
  direction (the real 36×36 trigger → 8/8 truly visible in the 288px
  drawer + dual scroll-lock + aria-expanded true; Escape → inert + 0
  visible + unlocked + false); zero 390px overflow on all nine routes; NO
  Tailwind v4 bug (the token contract re-verified — `--blur-sm` computes
  blur(4px), `--shadow-sm` computes the pinned
  `rgba(0,0,0,0.05) 0px 1px 2px`); the fix probes: a `=HYPERPROBE(48)`
  lead exported as `"'=HYPERPROBE(48)"` (blob-anchor instrumentation),
  the seeded phones as `'+971 …`, the insights badges "Call"/"Meeting"
  (was call/meeting) with the green Phone / purple CalendarDays icons
  intact, the reports export blob byte-verified (BOM + the 7-col header +
  12 data rows, URL staying /reports), the offline export → exactly ONE
  "Could not export report · Network error" toast; **zero probe residue:
  15/24/10/23/12 pristine** (the probe lead deleted by exact ID).
- **Screenshots**: 02 re-captured (within the established raster noise)
  + 11/12 re-captured (BYTE-IDENTICAL to HEAD — the deterministic seed)
  + **56-insights-badge-case NEW** + **57-reports-export-failure-toast
  NEW** (the two fix surfaces, 1440×900). 56 + 57 VLM-verified.
- **Docs**: README (badge + the session-48 paragraph + the suite counts)
  · AGENTS (1150/110 + the session-48 block) · CLAUDE (1150) · PAD (the
  s48 row / 71 suites / totals / checklist / command table) · SKILL
  **v1.45.0** (frontmatter + project_state + the H1 + the new §16an +
  the N-48a correction in §16am) · `docs/session_89.md` · this record ·
  both worklogs. `.env`/`.env.example` re-verified (no env surface
  change; DATABASE_URL `file:../db/custom.db` with db/ at the repo root).
- **Shipped**: commit on main + the SSH-wrapper push to
  `git@github.com:nordeim/neo-crm.git` (the operator ed25519, shredded
  after — the s43-s47 runbook).
