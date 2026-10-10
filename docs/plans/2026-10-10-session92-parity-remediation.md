# Session-92 Parity Remediation Plan (2026-10-10)

Session 92 on `main` @ `f6c3012` (the s91 ship `896bf2e` + the two
operator-added log commits `f455ed7`/`f6c3012` — `session_183.md` the
process narrative + `session_184.md` the operator-added raw log). The
workspace SURVIVED session 91 — the pull fast-forwarded docs-only; the
environment verified intact without a rebuild (census MATCH
15/24/10/23/12 + 4 users; the `.env` with
`DATABASE_URL="file:../db/custom.db"`). The platform `DATABASE_URL`
override hazard STANDS — all session-92 repo operations run under
`env -u DATABASE_URL`.

**Baseline gate on HEAD: lint 0/0 · tsc 0 · 1801/1801 unit (100 suites,
re-run live) · build + e2e deferred to the post-fix gate** (the
one-gate discipline).

## The standing layers (88th session, NO APP DRIFT)

Drift sweep #88: the APP bundle re-fetched fresh from the reference
(post-login) — `/assets/index-DZ-xbrIm.js` 1,631,071 bytes md5
`a70a637fcf1d4291da8e0d965676dc11` exact + the stylesheet
`index-Be9epoFc.css` 79,581 bytes exact — **the 63rd consecutive
stable session**. Reference census #88 (agent-browser, live login + a
TRUE 390px viewport): the demo data still zero (the $0.0k KPI family);
the mobile-nav defect STANDS at TRUE 390px (vw=390, nav w=0, 0
visible links, no menu button — the 13th consecutive census); desktop
nav normal (256px, 8 links). Our mobile drawer stays the deliberate
documented superset (the LIVE battery re-verifies post-fix).
Scandihaven re-verified as the tech-stack-patterns reference (fresh
pull @ `d4789c3`, up to date; the same Next.js 16 + React 19 + Tailwind
v4 CSS-first family — no new patterns to adopt).

## The audits (two parallel subagents + the orchestrator's own rotation)

**92-a** — the s91 re-audit: **8/8 checklist groups GENUINE, ZERO
material findings** (every s91 fix verified at exact file:line: the
`PROFILE_LAYOUT.controlMt` token at page-layout.ts:994 + the four
applications profile-page.tsx:184/:243/:257/:270; the leads filters-row
mb-4 retirement leads-page.tsx:470-481; the edit-dialog BARE groups
entity-edit-dialog.tsx:272-282; the import dialog's mt-2
contacts-page.tsx:865-871; the 7 audit nanos all landed; the
spacey-hazard-parity suite 13/13 live; the screenshots 127/128/129
byte-present; 10 adjacent suites re-run live 391/391). The
**count-in-comment genus guard re-run on the s91 delta** (the s91
suggested next): **3 drifts + 2 borderline** —
F-92a1 (the "all 99 space-y usages" census claim at
spacey-hazard-parity.test.ts:48-49 + SKILL.md:13/:8285 + PAD:778 is
not re-derivable: the live counts are 195 raw occurrences / 112
comment-stripped tokens / **100 comment-stripped string-literal
sites** — no method yields 99; prose-only, no pin asserts it);
F-92a2 (a fresh miscount inside the G-91a1 fix itself:
stat-value-contract.test.ts:11-16 lists the leads
`text-xl sm:text-2xl font-bold` among the "three BARE families" while
the file's own :108-110 pin holds it EXPLICIT — internally
inconsistent, plus the phantom "leads-contacts-arm" label that exists
nowhere else); F-92a3 (CLAUDE.md:125 "Unit (Vitest, 1788 checks)" +
:371 "(currently 1788)" stale — s91 updated :38/:114 but missed these
two); B-92a4 (AGENTS.md has no §Session-91 history block — the
per-session cadence lapsed; the s91 AGENTS delta was 2 count lines
only); B-92a5 (constants.test.ts:52 self-labels the B-2 fix
"G-91a2-class" — the wrong attribution).

**92-b** — the graduation audit (the 49th consecutive): **ZERO
graduations, 13/13 ledger rationales hold** (mobile-nav 9, the
dashboard search + quickCreate, the topbar search, the accounts live
filters, the VIEW_SWITCHER dead-default family, TableEmptyRow, the
reports SelectValue placeholders, the lucide superset doc, the
partial-import anchors, the 5 annotated e2e sleeps, the CSV `-`
exclusion, the defaultTier editor, both dead trend rows). The 8
mechanical censuses **8/8 CLEAN** (localStorage exactly 2 keys;
public/ og-image.png only; 19+11 deps; **27 route.ts / 39 handlers**
— 15 GET · 12 POST · 6 PUT · 5 DELETE · 1 PATCH; .env.example exactly
3 vars; all doc anchors exact; zero commented-out code; 5 sleeps +
mobile-nav 9).

## The operator decisions (52nd re-affirmation)

Both STAND, evidence-backed by 92-b's live census:

- **CSV formula-injection posture (b)** — the `guardFormulaPrefix`
  guard at csv.ts:32 (the `/^[=+@\t\r]/` regex) applied in escapeCell +
  imported at entity-export.ts:24/:37/:43; the full 17-site call-site
  census — dashboard ×4, accounts :192, contacts :258, leads :355,
  reports ×2 (:259 server-owned + :670 `toCsv`), settings ×7 (the 3
  static `CSV_TEMPLATES` documented exception + 4 `entityDumpCsv`),
  api/export :117 — **ZERO unguarded live-data builders**. Session 92
  touches no CSV surface.
- **Source-vocabulary documented parity** — the
  `d7487ad..HEAD` constants.ts diff filtered through
  META|SLUG|SOURCE|STATUS|STAGE|VOCAB = **zero hits** (100% the s90
  CHART_COLORS retirement + comment re-derivations); all 7 `*_META`
  maps live at constants.ts:53/:91/:270/:386/:425/:434/:447. Session 92
  introduces no vocabulary.

## The rotation (92-c) — the dialogs-at-390 family walk

Every dialog family opened at TRUE 390×844 on BOTH apps (agent-browser,
settle-waits, offsetHeight/rows/computed-margin probes). **The outer
chrome is SOLID on every family**: the maxW 512/672 family, the
`max-h-[calc(100vh-84px)]` 759.6px + `overflow:auto` scroll family on
the 2xl dialogs, `sm:rounded-lg` → radius 0 at 390, p-6, the footer
72px. **The matches**: New Lead (676/592, groups 68×6), Log Activity
(442/358, textarea rows=4), Save Custom Report View (476 exact), Edit
Lead (the BARE groups immune), the settings selects (no `<form>` → no
native select → immune). **Four real finds — the N-92 family:**

- **M-92c1 — THE PHANTOM-MB SELECT-TRIGGER GENUS** (a NEW v4 space-y
  face). Radix renders a hidden native `<select>`
  (`position:absolute`, `aria-hidden`, **NO `hidden` attribute**) as
  the LAST TREE-CHILD of every Select group inside `<form>` contexts
  — so v4's `:where(.space-y-2 > :not(:last-child))` matches the
  TRIGGER (a non-last child!) and gives it `margin-bottom: 8px`,
  where v3's `:not([hidden]) ~ :not([hidden])` rule gave the trigger
  margin-TOP only (mb always 0). In plain block groups the phantom mb
  collapses out (invisible — but the computed mb is 8 vs the
  reference's 0: the Lead Status/Source triggers). **Where the group
  is a DIRECT GRID ITEM (grid items establish a BFC — margins are
  contained and can NEVER collapse out) the group inflates 68 → 76**:
  LIVE-verified on the Account create dialog's Status group (ours 76
  vs ref 68; the dialog 516 vs 508; the 4th grid row track
  `68px 68px 68px 76px` vs `68px 68px 68px 68px`) and the Contact
  create dialog's "How did you meet?" group (76 vs 68). Proven by
  isolation: the `display:block` natural-height test returns 68 for
  every group at any width — the +8 exists only in the grid/BFC
  context. The affected set (the 4 `DIALOG_GROUP.controlMt` select
  triggers): entity-dialogs.tsx:309 (Account Status), :583 (Contact
  Source), :761/:772 (Lead Status/Source). Immune by construction: the
  Event dialog's selects (BARE pair cells — no space-y ancestor), the
  Activity rail selects (bare groups + block labels), the edit dialogs
  (the s91 BARE groups), every page-level select (no form → no native
  select).
- **L-92c2 — THE CONTACT DIALOG'S FLATTENED SECTIONS.** The reference
  nests each section as `space-y-4 [H3, Email-group, Phone-group]`
  (live-probed: two 188px section divs); ours flattens the H3s as
  separate grid items (20px header rows + 152px field rows) — the
  H3→field gap computes 24px (the grid `gap-6`) where the reference
  computes 16px (the section's `space-y-4`) = +16px total (our form
  841 vs ref 817; the remaining +8 is M-92c1 on the trailing select
  group). The S28-P3 comment correctly identified the two h3 headers
  but the construction was flattened, never re-derived.
- **M-92c3 — THE EVENT DIALOG'S DESCRIPTION ROWS.** The reference's
  Description textarea is `rows=3` (live-probed 90px); ours renders
  `rows=2` (66px — the HTML default, the `rows` prop never set). The
  house's OWN comment at entity-dialogs.tsx:1167-1168 documents "the
  Event dialog's rows=3 min-h-[60px] is its own surface" — the decode
  was right, the code never landed it. The dialog 622 vs ref 646.
- **N-92c4 — THE IMPORT DIALOG'S COLUMNS-BOX p2 MARGIN.** The box
  carries `space-y-1`; the reference's second `<p>`
  (`font-semibold mt-2`) COMPUTES `margin-top: 4px` — v3's space-y-1
  rule at (0,3,0) overrides the (0,1,0) utility; ours computes 8px
  (v4's `:where()` at (0,0,0) loses to it). The box 122 vs 118, the
  dialog 548 vs 544. The M-91c2 genus in the INVERSE direction (there
  a v3-killed mb computed 0; here a v3-killed mt computes 4).

Plus the tooling promotion (the first-listed s91 suggested next): the
zero-data screenshot-diff sweep becomes a one-command repo regression.

## The remediation set (TDD — RED first, then GREEN)

- **S92-P0 — the phantom-mb fix (M-92c1).** `DIALOG_GROUP.controlMt`
  `"mt-2"` → `"mt-2 mb-0"` at page-layout.ts (the token definition +
  the genus comment: the Radix native-select tree-sibling + v4's
  `:not(:last-child)` + the BFC containment). `mb-0` at (0,1,0) beats
  the `:where()` rule at (0,0,0) → every controlMt trigger computes
  mb 0 = the reference. The token's Input call sites are unaffected
  (Inputs are genuine last children — mb already 0). The four select
  triggers all ride the token — no call-site edits.
- **S92-P1 — the contact sections (L-92c2).** Nest each
  `[h3 + the two field groups]` inside a `space-y-4` section div (the
  reference's own construction) in entity-dialogs.tsx — the
  `CONTACT_DIALOG.pairGroup` wrapper becomes the section (the h3
  moves INSIDE it). The H3→field gap 24px → 16px, the form −16px.
- **S92-P2 — the Event Description rows (M-92c3).** `rows={3}` on the
  ev-desc Textarea (the reference's own rows; the min-h-[60px] token
  stays).
- **S92-P3 — the Import columns-box p2 (N-92c4).** `mt-2` → `mt-1`
  on the "Optional columns:" p (contacts-page.tsx:905) + the v3-kill
  comment (the s11 computed-gap rule: the reference COMPUTES 4px).
- **S92-P4 — the genus-guard nanos.** F-92a1: re-derive the space-y
  census in spacey-hazard-parity.test.ts:48-49 + SKILL.md:13/:8285 +
  PAD:778 to the documented method + count (the 100 comment-stripped
  string-literal sites; session_182.md stays history-as-written);
  F-92a2: re-derive the stat-value-contract:11-16 header (the leads
  arm is EXPLICIT per its own pin; retire the phantom
  "leads-contacts-arm" label); F-92a3: CLAUDE.md:125/:371 1788 → 1801;
  B-92a4: add the AGENTS.md §Session-91 history block (restore the
  per-session cadence); B-92a5: the constants.test.ts:52 label → the
  B-2 attribution.
- **S92-P5 — the sweep tool (the promotion).** `scripts/sweep.ts`:
  the one-command zero-data screenshot-diff regression — spawn/reuse
  the dev server on :3000, zero our data (subprocess
  `scripts/zero-data.ts`), Playwright-chromium capture the 9 pages on
  BOTH apps at 1440×900 (the reference badge closed, content-waits,
  the login flows), the canvas-based pairwise pixel diff (per-channel
  tolerance 12, zero new dependencies), the % report table, then
  `db:seed` restore. + the `package.json` `"sweep"` alias + the unit
  pins (`tests/sweep-tool.test.ts`: the PAGE list, the TOLERANCE, the
  pure `diffPixels` seam behavior, the CLI surface).
- **S92-P6 — the suite + the re-derivations.** The NEW
  `tests/dialog-geometry-parity.test.ts` (the RED-first pins for
  P0-P3 + the census anchors: the dialog select census, the contact
  section construction, the textarea rows family, the import box
  margins) + the doc realignment (SKILL v1.89.0 §16cf + project_state
  + the H1, README badge + the suite list, AGENTS/CLAUDE at the new
  counts, PAD the s92 inventory row + the Total + the footnote,
  session_185.md, this plan's execution record, the repo worklog).

## Blast radius (pre-checked)

- `DIALOG_GROUP.controlMt` call sites: entity-dialogs.tsx only (the
  Inputs are no-op; the 4 selects get the mb-0). No other file reads
  the token (verified by grep).
- The contact dialog restructure: entity-dialogs.tsx:524-579 (the two
  h3s + pairGroups); the CONTACT_DIALOG.pairGroup token
  (page-layout.ts:875) becomes the section class — its other readers:
  none (grep-verified single call family).
- The Event rows + the Import mt: single-line edits, no other
  consumers.
- The existing pins that touch these surfaces:
  `tests/page-layout.test.ts` (DIALOG_GROUP / CONTACT_DIALOG /
  DIALOG_TEXTAREA pins), `tests/import-dialog.test.ts` (the columns
  box), `tests/entity-edit-dialog.test.ts` (the edit family —
  unaffected), `tests/spacey-hazard-parity.test.ts` (the genus
  anchors — the space-y usage census must be re-derived in lockstep
  if the contact restructure changes the count: the nested section
  keeps `space-y-4` (already counted) and RETIRES nothing — the h3
  moves inside; net usage count unchanged at 100).
- The e2e family (`crm.spec.ts` dialog geometry tests at phone width):
  the Account/Contact/Event dialog geometry tests assert visibility +
  labels, not the 76px tracks — no e2e re-anchor expected; the gate
  re-run decides.

## The execution record (2026-10-10, session-92)

Executed exactly as planned, RED-first:

- **RED**: the NEW tests/dialog-geometry-parity.test.ts (19 its: 4
  phantom-mb + 4 nested-sections + 2 rows + 2 import-mt + 4 census
  [the 112-count, the s91-header needle, the SKILL/PAD needles, the
  select census] + 3 audit-nano + ... the full set) + the NEW
  tests/sweep-tool.test.ts (8 its). First run 23 failed | 3 passed —
  then 2 pin-shape repairs mid-flight (the Event-region boundary
  over-capturing the Activity dialog's selects → the `"Create Event"`
  boundary; the L-92c2 `}">` regex → the JSX-expression `}>` form) +
  2 more (the F-92a2 needle-in-own-docs reword — the phantom-label
  token must not appear in its own retirement prose; the
  optional-comment group in the nesting regex). Final shapes
  re-proven RED via the tracked-files stash: **23 failed | 1805
  passed (1828 total) — exactly the modified pin set, ZERO
  collateral**.
- **GREEN**: S92-P0 controlMt "mt-2 mb-0" + the genus comment
  (page-layout.ts:810-828); S92-P1 the contact sections nested
  (entity-dialogs.tsx:524-563); S92-P2 rows={3} (:926-935); S92-P3
  mt-1 (contacts-page.tsx:905-914); S92-P4 the nanos (the spacey
  header re-derived; the stat-value-contract 2-bare+4-explicit; the
  constants B-2 label; the AGENTS §Session-91 block; CLAUDE 1828 ×4);
  S92-P5 scripts/sweep.ts + the alias + the pins (2 tool bugs fixed
  live: the empty-string env → the UNSET DATABASE_URL — Prisma
  rejects empty; the hydration-race login → networkidle + the settle
  + the URL-negation waitForURL); S92-P6 the docs. The full-suite
  sweep surfaced 2 lockstep re-anchors (page-layout's DIALOG_GROUP
  pin → "mt-2 mb-0"; spacey's controlMt-count → the mt-2 PREFIX
  regex).
- **GATE**: lint 0/0 · tsc 0 · 1828/1828 unit [102 suites, +27 net] ·
  build · 132/132 e2e fresh CI=1 [3.2m; the known settings-debounce
  flake on the first run passed standalone AND on the full re-run].
- **LIVE**: the Account dialog 508/rows 68×4/mb 0/formH 424; the
  Contact sections [197,188,188,68] = ref exact + gap 16 + formH 817;
  the Event 646/ta 90 rows=3; the Import 544/box 118/mt 4; the drawer
  battery at TRUE 390 (the trigger 16,16, the panel 288@x0 blue, 8
  links, focus inside, dual lock, navigate-close → /Leads, the closed
  root inert+hidden+pe-none, the lock released); THE SWEEP MAIDEN
  RUNS ×2 reproducible (five pages 0.00%, every diff standing-
  explained, the seed + census restored each time); the closing
  census MATCH + the reference md5-exact (the 63rd consecutive
  stable session).
- **Screenshots**: 130 (26,967 B) + 131 (29,183 B) + 132 (29,917 B)
  — VLM 5/5 ×3 (one adjudication: 130's "side margins" NO vs the
  DOM-verified w=390@x=0; one expected note: 131's footer below the
  fold = the scroll-box geometry both apps share).
- **Docs**: SKILL v1.89.0 [§16cf + project_state + the H1] + README
  badge 1960 + the suite list + the Tested row + AGENTS 1828/132 +
  the §Session-91/92 blocks + CLAUDE 1828 ×4 + PAD [the s92 rows +
  the Total 102/1828 + the footnote] + session_185.md + this record +
  the worklog.
