# Session 69 (2026-10-03) — Session-38: the silent bug, the parser graduation, the proof-coverage completion

## The setup

Workspace refreshed (`git pull` → `6d62bc4`: the session-37 code at
`8bb35ba` + the operator's `docs/session_68.md` transcript commit). The
sandbox survived from session 37 — the tree clean and identical to
remote HEAD, the environment intact (`.env` `DATABASE_URL=
"file:../db/custom.db"`, `db/` at the repo root, node_modules, the
reference bundle cache, the dev server alive and healthy). Baseline
gate on the pulled tree: **lint 0/0 · tsc 0 · 873/873 unit (48
suites)** — the documented state, exactly.

## The audits

Two parallel review agents + manual validation of every claim against
the code (two findings LIVE-proven before the plan was written):

1. **The session-37 re-audit (fresh eyes on `8bb35ba`)** — all four
   s37 claims verified GENUINE (a full db-call census of all 27 route
   files: every mutating call inside a try→catch span; the FK helpers'
   edge semantics correct at all 16 sites with zero coercing remnants;
   the containment helpers real; the photoUrl cap + dead-import
   removals real). The NEW findings: **F1 (MED — the headline, 16
   sessions old)** the signup `nameFromEmail` fallback is DEAD CODE
   (`asString`'s non-optional form returns `""` for an absent name,
   and `"" ?? fallback` keeps `""` — an empty string is not nullish) —
   every UI signup stored `name: ""` since s21 (the "?" avatars, the
   blank owners dropdown); **F2 (MED-LOW — LIVE-proven)** `photoUrl`
   carries the exact silent-coercion class the s37 FK guards closed,
   one field over (a numeric payload silently CLEARED the photo on the
   contacts PUT, was silently IGNORED on the users PATCH, and the two
   writer families disagreed on trim); **F3/F4 (test quality)** the
   reset POST had no containment pin (presence-only — the
   `$transaction` could slide out of the try unseen) and the
   settings-GET pin was vacuously satisfiable (`allInsideTry` returns
   true when the regex matches nothing); **F5** the upload POST's
   `writeFile`/`mkdirSync` unwrapped (raw non-envelope 500s on
   ENOSPC/EACCES); **F6** the auth containment pin missed the wrapped
   reads; plus the `DB_CALL` regex's `$`-API blind spot (health's
   `$queryRaw` invisible to the containment machinery).

2. **The deferred-findings graduation audit** — ZERO graduations, ZERO
   closures (all 12 ledger descriptions verified accurate, all
   rationales sound). The NEW deferred-class findings: **N3 (MEDIUM —
   the one clear graduate)** the tested `parseCsv` seam is UNUSED by
   the Import feature (the loop uses naive `row.split(",")` + a
   quote-strip replace — quoted cells with embedded commas silently
   corrupt rows — and each row's `createContact` triggers a full-list
   refetch, O(N²)); **N1/N2 (LEDGER — decision item)** the CSV
   formula-injection + embedded-quote family (both apps emit
   injectable artifacts; the byte-exact reference format is itself the
   pinned contract — deferred until the deploy-posture decision);
   **N7 (fix the script half)** no gate umbrella script + the
   stale-:3100-server e2e hazard; the sweep hygiene note
   (`sweepRateLimits` ran only from login); N4/N5/N6/N8 ledgered.

## The standing-layer drift re-sweep (live)

34th consecutive session, **NO DRIFT**: the reference bundle
md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`, 1,631,071 bytes —
NINTH consecutive bundle-stable session, fresh-fetched and compared);
the reference's mobile-nav absence at a TRUE 390px (8 links in DOM, 0
visible, nav w=0, no hamburger — geometric census); the reference demo
data still zero (`$0.0k/$0.0k/$0k/0`); our clone — the seeded
dashboard at the s32 scales ($337.0k / $126.0k / $0k), the drawer LIVE
both directions (native-click open: 8 links + dual scroll lock + focus
on the close button; Escape: `visibility:hidden` + unlocked +
`aria-expanded:false`; `history.back()`: gone + unlocked), zero 390px
overflow on all nine routes (sweep + direct-load spot re-checks), the
FK envelope 400 LIVE ("Invalid company selection"), the gitignore
negative space holds.

## The remediation (S38-P1..P7, RED-first: 15 failing pins)

- **S38-P1 — the name-fallback revival (F1)** — `optional: true` on
  the signup name parse so the absent path returns `undefined` and the
  `?? nameFromEmail(...)` finally fires. LIVE: a probe signup
  (`probe-s38@test.local`, no name field — exactly what the UI sends)
  stores `name: "Probe S38"`; the probe user removed from the dev DB
  after the verification.
- **S38-P2 — the photoUrl type-guard family (F2 + F12)** —
  `isBadFK(body.photoUrl)` → 400 "Invalid photo URL" on all three
  writers (contacts POST, contacts `[id]` PUT, users PATCH) + the trim
  harmonization in users (`body.photoUrl.trim().slice(0, 500)`).
  LIVE: numeric → 400 on BOTH surfaces (the silent-clear/ignore split
  closed); a leading-space `https://` URL stores trimmed on users
  (was a 400 there only); `null` still clears; a valid string still
  stores.
- **S38-P3 — the import parser graduation (N3)** — the store's new
  `importContacts(inputs)` (serial POSTs, ONE `fetchContacts()` after
  the loop) + the page's `runImport` on the tested `parseCsv` seam
  (csv.ts's "used by the Import feature" comment finally TRUE). LIVE:
  "Live, Quoted" + "Acme, Inc" import WHOLE through the real dialog on
  the dev server; the probe contact removed after. E2E: a NEW
  quoted-comma round-trip test (the imported name renders whole; the
  probe cleaned up API-side — the page's store doesn't refetch after
  an out-of-band delete, the first-run lesson).
- **S38-P4 — the proof-coverage completion** — the reset POST joins
  the containment `it.each`; the settings-GET pin gains its
  `toMatch(readSettings)` presence check; the auth-family containment
  regex extends to `findUnique|count`; the health `$queryRaw` gets an
  explicit containment pin. Strengthening pins — GREEN-on-arrival
  against the already-correct code, each guarding a demonstrated
  escape hatch.
- **S38-P5 — the upload write envelope (F5)** — the mkdir/writeFile
  wrapped in try→`ERR.INTERNAL()`. LIVE: a small real upload still
  200s.
- **S38-P6 — the sweep hygiene + the gate script** —
  `sweepRateLimits()` in signup/verify/resend (login's placement);
  the `bun run gate` package script chaining lint → typecheck → test →
  build → test:e2e (the build always precedes the e2e boot). The
  first RED run failed on LOGIN too — the pin demanded
  sweep-before-rateLimit while login sweeps after; over-specified
  pins fail on correct code, the pin was relaxed to the contract
  (presence in the handler).
- **S38-P7 — the gate + deliverables** — lint 0/0 · tsc 0 ·
  **896/896 unit (+23: 15 RED-first + 8 strengthening)** · build
  clean · **107/107 e2e (+1: the quoted-comma import round-trip)**;
  LIVE verification (above) + the drawer re-check + the seeded
  dashboard; 4 screenshots (02/11/12 re-captured + **46** the
  signup-derived-name surface NEW; 02 + 46 VLM-verified — the styling
  verdicts clean; the VLM's "expected 38 leads" was MY prompt's wrong
  guess, the seed ships 24 — and the "cut off" note is the viewport
  convention); `.env`/`.env.example` re-verified (no env surface
  change); docs realigned (README badge 1003 + the session-38
  paragraph + the gate row, AGENTS 896/107 + the gate row + the
  session-38 block, CLAUDE 896/107 + the gate row, PAD the s38 row /
  896+107 + the checklist + the command table, SKILL **v1.35.0**
  §16ad + frontmatter + project_state + the H1, this log, the plan +
  its execution record, both worklogs).

## The census-method lessons (§16ad)

`""` is not nullish (the `??` fallback idiom silently dies when the
left side's helper returns an empty string for "absent"); a tested seam
that nothing calls is a false comfort (`parseCsv` had a round-trip test
for years while the feature used a naive parser — a source-contract
pin proves the wiring); `allInsideTry` is vacuously true on zero
matches (pair every containment pin with a presence `toMatch`);
over-specified pins fail on correct code (the login sweep-order
lesson — pin the contract, not an imagined ordering).

## The deferred pointers

The non-FK asString/asDate/asNumber coercion surface (dueAt/status/
value/endAt — silent mutation on PUT, the deliberate FK-first scope),
the CSV formula-injection + embedded-quote family (the byte-exact
reference format is the pinned contract — lands with the
deploy-posture decision), the signup admin TOCTOU race, the dead
exported api.ts helpers, hydrate error vs logged-out, silent fetch
failures (doctrine-aligned), the login/verify timing side-channel, the
upload MIME trust (contained), reset role-gating, list caps,
trusted-proxy limiter, updateLead supersede guard, hydrate redesign,
SavedReport, photoUrl onError fallback, the 11 e2e sleeps, the
mobile-nav post-wipe coupling, the href-sink watch, the base44 AI
extraction, the Opportunity create/edit UI; the standing drift
re-sweep continues next live visit.
