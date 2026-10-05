# Session-65 Parity Remediation Plan (2026-10-05)

Session 65 on `main` @ `9952a23` (the session-64 ship a541e07 + the
operator's session-log update — docs/session_122.md, the s64 operator
transcript). Workspace: the sandbox SURVIVED s64 (not reset — the same
clone at `/home/z/my-project/neo-crm`, node_modules intact). The `.env`
contract standing (`DATABASE_URL="file:../db/custom.db"` + AUTH_SECRET +
NEXT_PUBLIC_SITE_URL); `<repo>/db/custom.db` bound and the census reads
`database: file:/home/z/my-project/neo-crm/db/custom.db` + 15/24/10/23/12
+ 4 users + `pristine: MATCH` — db/ at the repo root, as the operator's
brief requires. The s63/s64 intake hazard STANDS: the orchestration
environment exports a STALE
`DATABASE_URL=file:/home/z/my-project/db/custom.db` (an absolute override
the db-path seam honors BY DESIGN) pointing at a NON-EXISTENT mirror —
all session-65 repo operations run under `env -u DATABASE_URL` so the
repo `.env` relative contract wins (the e2e suite immune — it sets its
own E2E_DATABASE_URL). Intake hygiene: NO zombie dev servers; ports
3000/3100 clear. **Baseline gate on HEAD: lint 0/0 (enforced) · tsc 0 ·
1222/1222 unit (75 suites)** — the documented state exact. The `skills/`
exclusion verified in all three configs (vitest include allowlist,
eslint ignores, tsconfig exclude).

## The standing layers (61st session, NO DRIFT)

Drift sweep #61: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, direct curl with a browser UA) — size
1,631,071 + md5 `a70a637fcf1d4291da8e0d965676dc11` **exact — the 36th
consecutive stable session**. Reference census #61 (agent-browser, live
login at 1280 then a TRUE 390px viewport): the demo data still zero
(Total Leads 0 + "+5.3%", `$0.0k`); the mobile-nav defect STANDS at a
TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible, scrollW 390, NO
hamburger); desktop nav normal (256px, 8 links); a reference 390px
screenshot captured (outside the repo, reference-390-s65.png).

## The audits (three parallel agents + manual validation of every claim)

### A. The session-64 re-audit (65-a) — 8/8 FULLY GENUINE

Every s64 checklist item verified at file:line: the logout write-guard
byte-exact at every claimed line (sessionWriteToken :67; hydrate
:145/:147; the 8 fetch captures/guards; logout dual-bump :177-178;
fetchEvents byte-identical to f7760f7 — zero byte delta); the funnel
re-anchor exact (the 5 forms pinned :85-89 over the unique `const
funnel` region; the vacuous disjunct gone; the perturbation re-proven
read-only); the dead-cargo sweep exact (zero residue at HEAD; exactly 54
pre-fix carriers — the 2-file delta vs the 56 first-replace files is
inline non-helper usage); the precision carriers + record corrections +
docs arithmetic all GENUINE (badge 1334, SKILL v1.61.0 at 6116 lines,
1222/1222 re-run). **The non-vacuousness REPLAYED in a pre-fix f7760f7
worktree: 5 failed | 49 passed (54)** — the s64 arithmetic reproduced to
the digit; clean teardown. Three Nano precision notes (the funnel source
citation "~297-304" spans :301-308; the E>=4 title at :123 not ~121; the
s45 guard comment's "inside the function" loose — the window bleeds 2
lines into fetchSettings's capture) + three Info notes. **No Medium, no
Low, no FAILED items.**

### B. The graduation audit (65-b) — ZERO graduations, 13/13 (22nd consecutive)

All 13 standing items re-verified at file:line (the INFO family
F-47c/N-48c/N-48f/N-48j/N-51c; both operator anchors; the stock-mirror
KEEP; the N-58c boundary guard; the s63 defensive annotations; the
foreign-docs retirement; the never-imported deps; public/; the dead-arm
retirements; the profile PATCH + `?? a.dueAt`; the s64 family; the 8
zero-page-consumer page-layout records). The 8 mechanical censuses ALL
CLEAN (localStorage exactly 2 live keys; public/ og-image.png only; 19
runtime deps all consumed; API 27/39 all consumed; env parity 3-var
exact; doc anchors all at 1222+112/badge 1334; zero commented-out code;
exactly 2 annotated e2e sleeps). Extra probes all negative (no
downloadFile/formAvatar graduations; zero TODO/.skip/console.log). ONE
new finding: **N-65a** (Nano — the settings-route anchor pair drifted at
birth: settings-rollback.test.ts:8 + settings-debounce.test.ts:8-9 cite
"settings/route.ts:98/:111, the membership guards" but the tier block
starts :110, :111 is its isBadString 400 line, and the named guards sit
at :107/:116 — the chronic N-64a self-shift class, third generation,
born inside the refresh meant to close it; the one file untouched by the
s64 edit is exactly where the fresh anchor drifted).

### C. The fresh-eyes rotation (65-c: the PAGE-RENDER + E2E-SPEC seam —
src/app 23 .tsx files ~6,700 lines + tests/e2e 3 specs + 2 setups ~2,700
lines, never a dedicated rotation target; every locator cross-checked
against live components)

The **N-65 family** (every anchor manually validated at file:line by the
orchestrator):
- **N-65b (Medium — the only genuinely vacuous test found, the N-64b
  class at the e2e seam)** tests/e2e/crm.spec.ts:459-464 "global search
  finds a seeded account": BOTH assertions pass with a completely broken
  search — `getByText("Accounts").first()` resolves to the ALWAYS-VISIBLE
  SIDEBAR NAV LINK (nav-config.ts:33; the sidebar precedes the topbar
  dropdown in DOM order) and `getByText("Northwind Energy").first()` to
  the RECENT DEALS accountName cell (the seeded "Turbine telemetry POC"
  opp, updated −3d, is rank-4 of the updatedAt-desc top-5 — page.tsx
  :626/:630). The dropdown's own DOM (topbar.tsx:143-175 — the section
  header + the SearchResultRow BUTTONs) is never asserted. The s43-P4 /
  s45 search bugs (stale results, unhandled rejection) were exactly the
  family this test never caught.
- **N-65c (Low)** dead store-destructures (the N-56a DESTRUCTURED
  variant): contacts-page.tsx:86/:88/:89 (`leads`, `users`, `settings` —
  zero body reads, comment mentions only; the s41-P5 sweep deleted the
  dead `sources` sibling from this very destructure and missed these
  three) + settings-page.tsx:104 (`updateSettings` — dead in
  SettingsPage's scope; ConfigEditor:329 + DefaultsEditor:405
  destructure their own). 4 dead bindings across 2 files.
- **N-65d (Low)** accounts-page.tsx:416/:432 — the `a.tier === "Key"`
  disjuncts are construction-dead: tier is membership-validated to
  ["A","B","C"] at both write seams (api/accounts/route.ts:40,
  api/accounts/[id]/route.ts:74) and the seed plants only A/B/C;
  `a.isKey` is the only live arm. The adjudicated s63 N-63b class.
- **N-65e (Low)** reports-page.tsx:166 — `OPP_STAGE_META[s]?.label ?? s`:
  the arm is construction-dead over internal constants (`s` ranges over
  OPPORTUNITY_STAGES; OPP_STAGE_META covers all six — constants.ts:34-60)
  — the MISSED SIBLING of the s63 N-63b retirement (the dashboard twin
  `PIPELINE_LABELS[s] ?? s` was retired with its :278-280 comment).
- **N-65f (Low)** crm.spec.ts:1524 — the ONLY line-number citation in
  the e2e suite is stale: "dashboard-contracts.test.ts:284-291" lands in
  the s33 header comment at HEAD; the header-trio pins live at :302-337
  (the DASHBOARD_HEADER pins :317-326). The s64 13-anchor refresh fixed
  the tests/-side twin but missed the e2e copy — the chronic self-shift
  family in the never-swept e2e seam.
- **N-65g (Low)** AGENTS.md:548-556 — the /Profile block still documents
  the RETIRED s14 mechanism (`src/app/Profile/page.tsx`, a
  `redirect("/profile")` outside the (app) group). At HEAD /Profile is
  the s24 render alias `src/app/(app)/Profile/page.jsx` INSIDE the group
  (renders in place; pinned by tests/profile-route.test.ts:26-60
  asserting the redirect's ABSENCE + crm.spec:372-384). The
  "current facts" section misdirects; the do-NOT-use-config-redirect
  rationale survives (the .jsx carries the same comment).
- **N-65h (Nano)** mobile-navigation.spec.ts:55-66 — title "Escape
  closes the drawer **and restores focus**": the restore half is
  unasserted (only `dialog` hidden is checked, though mobile-nav.tsx:129
  implements the restore). STRENGTHEN (add the activeElement assertion —
  the strengthen-not-narrow precedent).
- **N-65i (Nano)** stale "below `lg`" comments ×2:
  mobile-navigation.spec.ts:4 + mobile-nav.tsx:4 — contradicting the
  session-7 live pin in the same file (mobile-nav.tsx:136 "md, not lg —
  the desktop sidebar appears from md") and AGENTS ("visible from 768px,
  NOT lg").
- **N-65j (Nano)** two no-op conditionals in crm.spec: :1106
  `expect(res.status()).toBe(route === "/login" ? 200 : 200)` and :953
  `${route === "/" ? "/" : route}` (always yields `route` itself). Dead
  conditional cargo, the s54 class.
- **N-65k (Nano — RECORD)** AGENTS.md:2402 — the s63 record's premise
  "the codebase carries zero type-predicate / non-null-assertion
  patterns" is false as written: 15 `!` assertions live in src
  (reports-page ×9, topbar ×5, entity-dialogs :408). True only for the
  api-routes/lib layers. RECORD: scope the claim when next touched.
- **N-65l (Nano — ANNOTATE)** unannotated defensive-posture arms:
  calendar-page.tsx:363/:422/:483 (`EVENT_TYPE_CHIP[e.type] ??
  EVENT_TYPE_CHIP.meeting`) + activities-page.tsx:377/:614
  (`ACTIVITY_TYPE_META[a.type] ?? ACTIVITY_TYPE_META.call`) —
  persisted-DB-read arms in the adjudicated s63 defensive family without
  the annotation the reports-route sites carry. ANNOTATE (the s63 house
  rule: defensive arms annotate).
- **N-65m (Nano)** (app)/page.tsx:69-72 — the comment "the owner filter
  rides the lead-owner select our bar has shipped since s6 (kept for
  parity)" is stale: the dashboard bar carries NO owner select at HEAD
  (the "All Owners" select was re-read as the empty switcher at S8-2).
- **N-65n (Nano)** login/page.tsx:29-31 + signup/page.tsx:23-25 —
  malformed `<main>` opening-tag indentation (copy-paste-era quirk).
- **N-65o (Nano — RECORD)** reports-page.tsx:22-28 + :41 — two separate
  imports from `@/lib/page-layout` (KPI_STATICS rides its own line) —
  vestigial import split. MERGE opportunistically.
- **N-65p (Info — RECORD)** (1) the mobile-nav Tab focus-trap wrap + the
  closed-state `inert`/`visibility:hidden` are pinned nowhere in e2e
  (unit pins only the 768px query); (2) the 9 capital-route `.jsx`
  aliases are invisible to a `*.tsx` scope declaration — future
  rotations should name them.

## The operator decisions (session 65)

1. **The CSV formula-injection posture (b) STANDS** (23rd re-affirmation
   — the guard intact in both export families [csv.ts:31-33
   guardFormulaPrefix + entity-export.ts:43 qq()], the `-` exclusion
   documented at csv.ts:19-22 + pinned at csv-formula-guard.test.ts:71-80,
   the reference bundle byte-stable for the 36th consecutive session).
2. **The source-vocabulary documented parity STANDS AND EXTENDS to the
   N-65 family**: the vacuous search pin RE-ANCHORS to the dropdown's
   own DOM (N-65b — the N-64b lesson at the e2e seam: assert the
   SearchResultRow BUTTON + the section header scoped INSIDE the
   dropdown container, never the always-visible look-alikes); the dead
   surfaces RETIRE (N-65c the 4 dead bindings, N-65d the Key disjuncts,
   N-65e the OPP_STAGE_META arm — the s63 N-63b class's missed
   siblings); the stale anchors REFRESH (N-65a the settings-route pair
   + N-65f the e2e citation — token-form preferred); the AGENTS /Profile
   block RE-DERIVES to the s24 mechanism (N-65g); the focus-restore
   assertion LANDS (N-65h — strengthen, not narrow); the precision
   carriers LAND (N-65i lg→md ×2, N-65j the no-op conditionals, N-65m
   the owner-select comment, N-65n the indentation, N-65o the import
   merge); the defensive arms ANNOTATE (N-65l — the s63 house rule);
   N-65k/N-65p RECORD-only.

## The plan (every anchor validated at file:line; blast radius pre-checked)

### S65-P1 — the vacuous search pin re-anchor (N-65b, Medium)

- GREEN (a re-anchor, green-through-RED — the s64 funnel precedent):
  tests/e2e/crm.spec.ts:459-464 re-pinned to the dropdown's OWN DOM —
  `page.getByRole("button", { name: "Northwind Energy" })` (the
  SearchResultRow renders a BUTTON, topbar.tsx:240-242 — unique
  page-wide: the Recent Deals accountName cells are td/p, not buttons)
  + the "Accounts" section header asserted INSIDE the dropdown
  container (the `z-[60]` portal, unique at rest). The N-65b record
  note documents the vacuity (both old assertions + why they always
  passed).
- Non-vacuousness: the new locators target dropdown-unique DOM (a
  button role the background pages never render for that name + a
  header scoped to the portal that only exists when results render).
  The e2e gate re-proves it mechanically (the dropdown DOES render for
  the seeded account).

### S65-P2 — the dead-surface retirement (N-65c + N-65d + N-65e)

- RED-first: the session-65 describe in tests/dead-code-hygiene.test.ts
  (4 its): the Key-disjunct absence (accounts-page carries no
  `a.tier === "Key"` + carries the retirement record comment); the
  OPP_STAGE_META dead-arm absence (reports-page's stage select reads
  `OPP_STAGE_META[s].label` — no `?.` + no `?? s`); the
  contacts-page destructure narrowed (no `leads,`/`users,`/`settings,`
  lines in the useCrmStore destructure — comment-stripped source); the
  settings-page `updateSettings` binding gone (SettingsPage's own
  destructure — ConfigEditor/DefaultsEditor keep their own).
- GREEN: contacts-page.tsx drops `leads`/`users`/`settings` from the
  destructure (the N-65c record comment — the s41-P5 sibling note);
  settings-page.tsx:104 drops `updateSettings`; accounts-page.tsx:416/
  :432 retire the `|| a.tier === "Key"` disjuncts (the s63 N-63b
  precedent comment: tier is membership-validated to A/B/C at both
  write seams; `a.isKey` is the live arm); reports-page.tsx:166 reads
  `OPP_STAGE_META[s].label` (the missed-sibling note).
- Blast radius: provably zero behavior (all four retirements are
  construction-dead); the full unit gate re-proves it mechanically;
  tsc confirms the destructured types stay sound.

### S65-P3 — the anchor refresh + the AGENTS /Profile re-derive
(N-65a + N-65f + N-65g)

- RED-first: the dch session-65 describe gains the AGENTS /Profile
  mechanism it (AGENTS.md documents `(app)/Profile/page.jsx` — the s24
  render alias — and no longer the `src/app/Profile/page.tsx` redirect
  path).
- GREEN: settings-rollback.test.ts:8 + settings-debounce.test.ts:8-9
  cite the membership guards at :107/:116 in token form (the N-65a
  note — drifted at birth); crm.spec.ts:1524 cites the header-trio pins
  in token form (the session-33 S33-P1/P2 describe,
  DASHBOARD_HEADER.primaryExportLabel — N-65f); AGENTS.md:548-556
  rewritten to the s24 render-alias mechanism (the
  do-NOT-use-config-redirect rationale + the case-insensitive-match
  loop hazard survive verbatim — N-65g).
- Blast radius: comments + one doc block — zero assertion changes
  beyond S65-P2's describe.

### S65-P4 — the e2e precision carriers (N-65h + N-65i + N-65j)

- mobile-navigation.spec.ts: the Escape test gains the restore half
  (`await expect(trigger).toBeFocused()` after the hidden assert — the
  impl restores at mobile-nav.tsx:129; N-65h) + the header comment
  lg → md (N-65i).
- mobile-nav.tsx:4: lg → md (N-65i — the s7 live pin at :136 governs).
- crm.spec.ts:1106 `toBe(200)` + :953 `${route}` (the no-op
  conditionals simplified — N-65j).
- Blast radius: one NEW assertion (must pass — the impl is live), two
  comment refreshes, two dead-conditionnal simplifications.

### S65-P5 — the page-render precision carriers (N-65l + N-65m +
N-65n + N-65o + the 65-a Nanos)

- calendar-page.tsx:363/:422/:483 + activities-page.tsx:377/:614: the
  defensive DB-read annotations (the s63 marker style — N-65l).
- (app)/page.tsx:69-72: the owner-filter comment refreshed to the S8-2
  reality (the bar carries no owner select — N-65m).
- login/page.tsx + signup/page.tsx: the `<main>` re-indent (N-65n).
- reports-page.tsx:22-28 + :41: the import split merged (N-65o).
- The 65-a Nanos recorded in the session record (the funnel citation
  :301-308; the E>=4 at :123; the s45 window comment) — no code change
  (the record is the fix).
- Blast radius: comments, indentation, one import merge — zero
  behavior.

### S65-P6 — the docs realignment + the ship

- SKILL v1.62.0: frontmatter + project_state + the new §16be (the
  session-65 layer) — applied atomically via an assert-first
  scripts/skill_edits_s65.py at the sandbox root; wc -l verified.
- README: the badge + the Tested row + the session-65 paragraph.
  AGENTS: the commands table + the session-65 block + the /Profile
  re-derive (S65-P3). CLAUDE: the counts. PAD: the s65 inventory row +
  the Total.
- session_123.md (this session's record — the odd-number convention;
  the operator's s64 transcript owns session_122.md) + this plan's
  execution record + both worklogs.
- Screenshots: 02/11/12 re-captured + **74-search-dropdown NEW**
  (1440×900, the N-65b fix surface — the topbar search dropdown with
  the Northwind result row) — VLM-verified.
- LIVE battery: the fix surfaces render (the search dropdown round-trip
  with the result-row button + the section header; the drawer both
  directions at TRUE 390px + the Escape FOCUS RESTORE; zero 390px
  overflow ×10 routes; NO Tailwind v4 bug — the --blur-sm + pinned-
  shadow probes; the closing db:census MATCH).
- Ship: the commit on main + the SSH-wrapper v3 push (with
  `--remote git@github.com:nordeim/neo-crm.git` — the s64 wrapper-trap
  note) + the remote verification + the operator key shredded.

## The arithmetic

- RED: 5 failures expected (the 4 dead-surface its + the AGENTS
  /Profile mechanism it); full suite through RED: **5 failed / 1222
  passed (1227 total)**.
- GREEN: dch +5 its → **1227 unit checks (75 suites)**; e2e unchanged
  at 112 (one assertion ADDED to an existing test, no new test); badge
  1339.
- Non-vacuousness: pre-fix 9952a23 worktree (node_modules hard-linked
  via cp -al) + the modified dead-code-hygiene.test.ts as the ONLY
  change → the same 5-failure RED set isolated; the search re-anchor
  green-through-RED (a repair) but proven dropdown-unique by
  construction (the role + portal scoping).

## Execution record (2026-10-05, session 65 — SHIPPED)

Executed as planned, with the discoveries noted:

- **Intake**: the sandbox SURVIVED s64 (the same clone; the pull
  fast-forwarded a541e07 → 9952a23 — session_122.md only, zero code
  drift); baseline gate GREEN 1222/1222; drift sweep #61 byte-identical
  (36th consecutive); reference census #61: the defect stands at TRUE
  390px.
- **Pre-validation catch**: the N-65g scope EXTENDED at validation —
  65-c found the AGENTS block only, but the orchestrator's grep found
  the SAME retired mechanism documented at PAD:953-957 (a current-facts
  claim — rewritten) + SKILL:5843 (an unbracketed historical record —
  the supersession bracket added). No existing pins on the AGENTS
  /Profile text (verified — profile-route.test.ts pins the
  filesystem).
- **RED exact**: 5 failed | 1222 passed (1227) — exactly the 5 new dch
  its, no collateral.
- **GREEN**: S65-P1 through S65-P5 all landed as scoped. One mid-flight
  EDIT repair (the calendar upcoming-bar site — a MultiEdit old_str
  accidentally dropped the `return (` + parent div; caught at the
  post-edit read and restored before any gate ran; tsc + the full
  suite re-proved the file). The activities MultiEdit hit a substring
  ambiguity (the 8-space pattern matching both sites) — re-applied
  with unique context. ONE post-docs pin repair (the s64
  needle-in-own-docs class REBORN): the PAD's own s65 inventory row
  described the N-65g pin using the literal retired path
  ("...NOT the retired `src/app/Profile/page.tsx` redirect") — the
  pin failed on its own documentation at the final re-check; reworded
  to "the retired top-level redirect path outside the group" and
  green re-proven.
- **Non-vacuousness**: pre-fix 9952a23 worktree → 5 failed | 47 passed
  (52) — exactly the RED set; clean teardown; census sanity MATCH. The
  search re-anchor green-through-RED (a repair), proven dropdown-unique
  by construction + re-proven live (the isolated test green, 1.7s).
- **Full gate**: lint 0/0 · tsc 0 · 1227/1227 (75 suites, +5) · build
  clean · 112/112 e2e on a fresh CI=1 boot (2.5m) — the Escape test
  now asserting the focus restore, the search test on the
  dropdown-own-DOM locators.
- **LIVE battery**: the search dropdown round-trip through real
  keyboard events (the result-row button INSIDE the dropdown + the
  Accounts/Contacts/Leads headers + 4 result rows); the drawer both
  directions at TRUE 390px with the focus RESTORE verified live; zero
  390px overflow ×10; NO Tailwind v4 bug (--blur-sm 4px + the pinned
  shadow: `--shadow-sm` reads `0 1px 2px 0 #0000000d`, a live surface
  computes `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`); the closing census
  MATCH at <repo>/db/custom.db.
- **Screenshots**: 02/11/12 re-captured + 74-search-dropdown NEW — all
  VLM-verified 4/4 PASS.
- **Docs**: SKILL v1.62.0 (assert-first script, 6120 → 6187 by wc -l),
  README/AGENTS/CLAUDE/PAD at 1227 + 112 (badge 1339), the AGENTS/PAD
  /Profile re-derives, session_123.md, this record, both worklogs.
- **Ship**: commit on main + the SSH-wrapper v3 push (with --remote
  git@github.com:nordeim/neo-crm.git) + the remote verification + the
  operator key shredded.
