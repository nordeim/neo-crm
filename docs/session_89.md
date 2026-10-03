Continuing the operator's standing brief. The workspace refreshed
(fresh `git clone` — the sandbox had been reset; `main` @ `042bfe0`
= the session-47 code at `cae88d6` + the operator's
`docs/session_88.md` transcript commit). Session 47 confirmed SHIPPED
(the commit + the verified push, recorded in the operator's
transcript + the s47 plan's execution record) — this session is
**session 48** (docs session_89.md).
The five core docs re-read (AGENTS/CLAUDE/README/PAD/SKILL v1.44.0),
then the session docs — `docs/session_87.md` (the s47 record),
`docs/session_88.md` (the operator's transcript), the session-47
parity plan with its execution record, and the worklog tail.
Environment verified: `.env` created from `.env.example` (+ a fresh
`AUTH_SECRET`), `db:push` + `db:seed` run — the database pristine
(15/24/10/23/12 + 4 users, counted via the absolute-URL Prisma
probe), the dev server healthy on :3000, `agent-browser 0.38.1`
ready, `skills/` excluded from lint/tsc/vitest by the established
config trio.
**Baseline gate GREEN: lint 0/0 (enforced) · tsc 0 · 1131/1131 unit
(67 suites)** — exactly the documented state.
The standing drift re-sweep (44th session) BEFORE planning: the
reference bundle fresh-fetched + md5-compared — **IDENTICAL**
(`a70a637fcf1d4291da8e0d965676dc11`, 1,631,071 bytes — the
NINETEENTH consecutive stable session). NEW ground-truth extraction
for the two open operator decisions: the reference's settings
contactSources is an ENTITY-BACKED CRUD list
(`rt.entities.ContactSource` create/update/delete) whose ONLY
consumer is the settings page's own ConfigEditor (exactly one
`ContactSource.list` query site in the bundle — it drives nothing
functional there either), and the reference's own reports Export CSV
is a CLIENT-side blob (`new Blob([N])` + a programmatic anchor, the
unquotedHeaderCsv shape) — evidence that reshaped both decisions.
The two parallel audit agents dispatched (Tasks 48-a/48-b) + every
headline claim manually validated at file:line before planning:
48-a verified all four session-47 fix families GENUINE (the pins
mechanically non-vacuous in a 75bda52 worktree: exactly 11 failed |
1 passed there, 12/12 at HEAD; zero suppressions in the 602-line
diff; scope exact) with five INFO findings — N-48a (the "six
comparison sites" claim wrong in four places — the file has exactly
FOUR), N-48b (the insights badge renders the raw lowercase slug —
the F-47b seam's remaining half), N-48c/N-48d/N-48e (the INFO
family); 48-b returned **ZERO graduations** (all 13 ledger items
re-confirmed at file:line, the drift map: topbar −1 / crm.spec +33
from the s47 additions) + the four deferred pointers re-anchored
(the e2e sleeps drifted 11 → 12 — the s47 dashboard e2e added one)
+ the COMPLETE CSV/export-family census: eight builder surfaces pass
`= + - @ tab CR` cells through unsanitized, the exposure LIVE (every
seeded phone starts with `+`), **a guard scoped to csv.ts +
entity-export.ts breaks ZERO existing pins** (the unit fixtures +
e2e content assertions carry no dangerous-prefix cells; the
leading-quote assertions survive — the guard prefixes INSIDE the
quotes), one conditional collision (the byte-exact template pin —
only if the STATIC templates were in scope; they are not), and the
import round-trip trade-off (parseCsv strips no markers — a
`'`-prefixed cell re-imports with the literal apostrophe).
**The two operator decisions DECIDED** (the session's mandate): (1)
the CSV formula-injection posture **(b)** — the `=`/`+`/`@`/tab/CR
guard on BOTH csv.ts and entity-export.ts, safe cells
byte-identical, `-` deliberately excluded (the (c) cost rejected),
the templates + import parser untouched, the phone `'` cost accepted
and documented (Excel renders `+971…` MORE faithfully as text); (2)
the source-vocabulary reconciliation — **DOCUMENTED PARITY, not a
merge**: the new bundle evidence settles it (the fragmentation IS
the reference's product design), so the src-dead CONTACT_SOURCES +
its self-contradicting s5 comment are REMOVED (N-47e closed), NO
enum-membership on the routes (free-form — the reference accepts
arbitrary import strings), the settings Capitalized defaults
verbatim, the whole posture recorded in-file at constants.ts +
settings/route.ts + both validation routes. The plan written
(`docs/plans/2026-10-04-session48-parity-remediation.md`) with the
two audit findings folded in as S48-P3 (the insights badge
display-case) and S48-P4 (the reports export failure-mode — the
F-47a mechanism's LAST instance).
**RED phase**: the pins written — `tests/csv-formula-guard.test.ts`
(10 — the `=`/`+`/`@`/tab/CR guards across toCsv/toQuotedCsv/
unquotedHeaderCsv/entityDumpCsv, the `-` exclusion, the no-op
contract, the round-trip `'`, the templates-outside-guard, the
both-seams source pin), `tests/source-vocabulary.test.ts` (4 — the
dead constant absent, the contradictory comment gone, the routes'
free-form no-membership shape, the settings defaults verbatim),
`tests/insights-badge-case.test.ts` (2 — the ACTIVITY_TYPE_META
label + raw fallback, the raw-slug badge absent),
`tests/reports-export-feedback.test.ts` (3 — zero downloadFile, the
fetch→blob + toast shape, downloadFile retired from download.ts).
**RED confirmed: exactly 13 failures + 6 green-through-RED regression
guards** (the plan's 17+1 arithmetic corrected at execution — the
`-`-exclusion/no-op/round-trip/templates pins and the routes/settings
pins are guards by design, the s45-precedent class). Full suite
through RED: 13 failed / 1137 passed — all 1131 pre-existing checks
green.
**GREEN phase — the four families**: P1 the formula-injection guard
(`guardFormulaPrefix` in csv.ts applied inside `escapeCell` AND
imported into entity-export.ts's `qq` — both families, one helper;
safe cells byte-identical; the mid-GREEN e2e correction: the first
run caught `res.text()` STRIPPING the route's BOM — fixed with the
`ignoreBOM: true` arrayBuffer decode, the BOM byte-verified
0xEF 0xBB 0xBF in the LIVE battery); P2 the source-vocabulary
reconciliation (the dead constant + stale comment removed, the
constants.test.ts pin re-anchored to the living CONTACT_SOURCE_
OPTIONS labels, the reconciliation record in-file at four sites);
P3 the insights badge display-case (the label + raw fallback); P4
the reports export fetch→blob flow (the envelope toast + the
Content-Disposition filename + downloadBlob; downloadFile retired
from download.ts — the window.location.href seam left the codebase)
+ ONE new download e2e (the zero-coverage gap — the F-47a lesson
applied).
**FULL GATE GREEN: lint 0/0 (enforced) · tsc 0 · 1150/1150 unit
(71 suites, +19 tests) · build clean · 110/110 e2e on a fresh
CI=1 boot** (the new reports-export e2e #78: All Time → the header
Export CSV → `crm_report_ISO.csv` with the BOM'd 7-column header +
seeded rows + the URL staying `/reports`; all 7 mobile-nav checks
green).
LIVE verification battery on the dev server (the definitive runs):
the reference census (44th session — demo data still zero: Total
Leads 0, "No upcoming activities"; the mobile-nav defect stands at a
TRUE 390px: NAV w=0, 8 links in DOM, 0 visible, no hamburger); OUR
clone's drawer verified live in every direction (the REAL trigger
"Open navigation menu" 36×36 visible → 8/8 links truly visible in
the 288px drawer + dual scroll-lock + `aria-expanded:"true"`; Escape
→ 0 visible + `inert` on the fixed inset-0 container + unlocked +
`aria-expanded:"false"`); **zero 390px overflow on all nine routes**
(both Dashboard casings); **NO Tailwind v4 bug** (the standing token
contract re-verified: literal-hex `@theme`, the re-pinned
`--shadow-sm`/`--blur-sm` — live-computed `blur(4px)` +
`rgba(0,0,0,0.05) 0px 1px 2px`, the vendored tw-animate.css, the
`@tailwindcss/postcss` wiring; tailwindcss 4.3.3); the fix probes: a
`=HYPERPROBE(48)` lead name exported as `"'=HYPERPROBE(48)"`
(blob-anchor instrumentation — the `'` guard INSIDE the quoting) with
the seeded phones as `'+971 …` and the header byte-identical, the
probe lead then deleted by exact ID; the insights dialog on Al Noor
Manufacturing renders the "Call" + "Meeting" badges (was call/meeting)
beside the intact green Phone + purple CalendarDays icon boxes; the
reports export blob byte-verified (BOM + the 7-column header + 12
data rows, URL staying `/reports`); the offline export → exactly ONE
"Could not export report · Network error — check your connection and
try again" toast; **zero probe residue: 15/24/10/23/12 pristine**.
Screenshots: 02 re-captured (within the established raster noise) +
11/12 re-captured (**byte-identical** to HEAD — the deterministic
seed) + **56-insights-badge-case NEW** + **57-reports-export-
failure-toast NEW** (the two fix surfaces, 1440×900). 56 + 57
VLM-verified (56: the Al Noor dialog with the stat cards + the
Capitalized "Meeting"/"Call" badges + the green phone-glyph box, no
defects; 57: the reports page with the dark "Could not export
report" toast, the page intact — not a JSON error page).
Docs realignment: the plan's execution record; README (badge 1260 +
the session-48 paragraph + the four new suites + the 110 e2e);
AGENTS (1150/110 + the session-48 block); CLAUDE (1150 ×3 + 110 ×2);
PAD (the s48 row / 71 suites / 1150+110 / the e2e row +92 / the
checklist / the command table); SKILL **v1.45.0** (frontmatter +
project_state + the H1 + the new §16an + the N-48a correction in
§16am + the insights-vocabulary pin comment); this session record;
both worklogs. `.env`/`.env.example` re-verified (no env surface
change; DATABASE_URL `file:../db/custom.db` with db/ at the repo
root).
Commit on main + the SSH-wrapper push to
`git@github.com:nordeim/neo-crm.git` (the operator ed25519,
shredded after the push — the s43-s47 runbook).

**The headline**: the two decisions deferred across seven sessions
landed evidence-first — every CSV the app exports now carries the
formula-injection text-marker guard (posture b: `=`/`+`/`@`/tab/CR,
both builder families through one helper, safe bytes untouched,
`-`/templates/import deliberately out), and the source-vocabulary
question closed as DOCUMENTED PARITY with the reference's own
entity-backed settings list as the bundle evidence (the dead
contradictory constant gone, the no-membership posture recorded
in-file). Plus the insights badges display-cased and the last
window.location.href download seam retired behind a toast-guarded
fetch→blob flow with a BOM-preserving decode.

**Gate**: lint 0/0 · tsc 0 · **1150/1150 unit (+13 RED-first pins +
6 regression guards)** · **110/110 e2e** (fresh boot, +1) · 44th
drift-sweep clean (19th stable reference bundle) · live-verified
both directions, zero probe residue · docs at SKILL v1.45.0 +
`docs/session_89.md`.

**Suggested next**: the standing deferred pointers — the
reports/export filter membership asymmetry (operator-shaped), the 12
e2e sleeps, the standing ledger (13 items, 5 sessions zero
graduations) — and the INFO family (F-47c, N-47d, N-48c/d/e/f/i/j)
await triage for session 49. The mobile-nav and Tailwind v4 checks
both passed clean again — the drawer works in every direction and no
v4-related bug surfaced.
