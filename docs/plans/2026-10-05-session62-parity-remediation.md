# Session-62 Parity Remediation Plan (2026-10-05)

Session 62 on `main` @ `k6125f6b` (= the session-61 code `c30ca6a` + the
operator's session_115/session_116 transcript commits; zero app-code drift —
`git diff c30ca6a..k6125f6b --stat` = 2 docs files). Workspace REBUILT after
a sandbox reset (fresh clone → bun install → .env recreated with
`DATABASE_URL="file:../db/custom.db"` + a fresh AUTH_SECRET → db:push +
db:seed). Intake hygiene: NO zombie dev servers; ports 3000/3100 clear; the
OUTER sandbox-root `.env` hazard QUARANTINED (`.env.quarantined-s62` — it
pointed DATABASE_URL at the sandbox-root mirror db, the s53/s58 class).
**Baseline gate on the rebuilt tree: lint 0/0 (enforced) · tsc 0 · 1207/1207
unit (75 suites)** — the documented state exact. The DB census through the
sanctioned seam: `database: file:/home/z/my-project/neo-crm/db/custom.db` +
counts 15/24/10/23/12 + 4 users + `pristine: MATCH`. The `skills/` exclusion
verified in all three configs (vitest include allowlist, eslint ignores,
tsconfig exclude).

## The standing layers (58th session, NO DRIFT)

Drift sweep #58: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, URL identified through the logged-in page's
performance API + a direct curl with a browser UA) — size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` **exact — the 33rd consecutive stable
session**. Reference census #58 (agent-browser, live login): the demo data
still zero (Total Leads 0 + "+5.3%", `$0.0k`); the mobile-nav defect stands
at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible, scrollW 390,
NO hamburger); desktop nav normal (256px, 8 links visible); a reference
390px screenshot captured (outside the repo).

## The audits (two parallel agents + manual validation of every claim)

### A. The session-61 re-audit (62-a, fresh eyes on the b01bd01..c30ca6a diff)

All eight session-61 checklist items verified GENUINE at file:line — the
png retirement (public/ = og-image.png only; the docs/ original
byte-identical, md5 `a7b963b0…`), the three-dep retirement (package.json +
both lockfiles + the 30-token install script), the doc-numerics refresh
(all named anchors re-derived mechanically: 27 files / 39 handlers / 9
models / 75 suites / 112 e2e; all 20 PAD §11 rows within tolerance; the
§19 hexes exact), the pin set (3 its, 40/40), the **non-vacuousness
REPLAYED** in a pre-fix b01bd01 worktree: **2 failed | 38 passed (40)** —
the commit's arithmetic reproduced to the digit — plus counts by run and
the docs arithmetic (badge 1319; SKILL wc -l 5901 exact). SIX new findings:
**62-a #1** (@radix-ui/react-toast never-imported — convergent with
62-b's N-62a), **62-a #2** (PAD:127 + PAD:328-330 + SKILL:297/:314 still
say "22 route files"; the accurate census is 27 with auth(6) +
opportunities/upload/uploads), **62-a #3** (the s61 package-lock regen
silently dropped the resolved @types/node + undici-types — npm-world tsc
hazard: the optional-peer chain npm never installs; the bun tree carries
it, so tsc is green HERE only; the §16ba(2) lesson carries the dry-run
"310 insertions" where the shipped diff is 308/86), **62-a #4** (the s61
guard pins import sites for only 5/7 radix packages — react-label's real
import unpinned, react-toast unpinable), **62-a #5** (README:724 +
AGENTS:2316 say lockfile parity returns "for the first time since session
25" — the correct anchor is session 4, b3e3d6d, per the commit + SKILL +
session_115), **62-a #6** (the wider stale-count family in SKILL §5/§7:
UI kit "12 files" (13), components "21 .tsx" (25) / "15 use client" (19),
entity-dialogs "(817 lines)" (1081), §7.1 "(8)" models (9 — the
Opportunity row missing from the table) + "(186 lines)" (242), §7.2
"(355)" (468) + "20 activities" (the seed contract is 23), §7.3 "(182)"
(227), §7.4 "(129)" (133)).

### B. The graduation audit (62-b: the ledger + the fresh-eyes sweep)

**ZERO graduations — 13/13 CONFIRMED (19th consecutive session).** All 13
standing items re-verified at file:line. The INFO family ALL UNCHANGED
(F-47c, N-48c, N-48f, N-48j, N-51c). Both operator decisions' code anchors
STANDING (the CSV (b) guard in both families + the `-` exclusion; all
retired vocabulary tokens absent from executable src). The fresh-eyes
sweep (the ROTATION angle: ALL 12 page files + the shell/nav/dialog
components + the store read IN FULL, ≈8,700 lines + the 8 standing
mechanical censuses): the localStorage census CLEAN (exactly 2 live keys),
public assets CLEAN (og-image.png only), the API surface CLEAN (27/39 all
consumed), env parity EXACT (3-var), doc anchors 10/10 LAND (zero
self-shift), zero commented-out code, the e2e sleep census at exactly 2
annotated keeps — with the **N-62 family**: N-62a (the convergent
react-toast find + the guard-entrenchment wrinkle: the s61 guard PINS the
dead dep as live at test:627), N-62b (the profile Save gate is NAME-ONLY —
a photo-only upload leaves Save a silent no-op), N-62c (the unreachable
`?? a.dueAt` arm ×2 at activities-page:130/:132 — Activity.createdAt is
non-nullable), N-62d (the readOnly/detailsTitle branch family
production-dead — no call site passes readOnly; the third member of the
N-46e wire-or-remove posture family), N-62e (the accounts/contacts header
Export CSV disabled binding reads `filtered.length` while the export ships
the FULL list — the comment claims "disabled at zero data").

### C. The bundle-evidence addendum (the N-62b disposition, decided at validation)

The reference bundle (index-DZ-xbrIm.js) decoded at the profile component:
the reference's Save button is `disabled:i` where `i` is the SAVING state
ONLY — **no dirty gate exists in the reference** — and its submit
unconditionally PATCHes `{display_name, profile_picture}`. Our `dirty`
name-only gate (`if (!dirty) return`) is a self-inflicted divergence, not
a reference mirror: the button renders enabled (matching the reference)
but the handler silently swallows photo-only uploads. Disposition: REMOVE
the gate (the unconditional-PATCH contract), not widen it.

## The operator decisions (session 62)

1. **The CSV formula-injection posture (b) STANDS** (20th re-affirmation —
   the guard intact in both export families, the `-` exclusion documented,
   the reference bundle byte-stable for the 33rd consecutive session).
2. **The source-vocabulary documented parity STANDS AND EXTENDS to the
   N-62 family**: the never-imported `@radix-ui/react-toast` runtime dep
   RETIRES (the s61 N-61b class, RUNTIME-DEP variant — convergent
   62-a#1 + 62-b; the from-scratch toast.tsx mirror STAYS, its
   design-mirroring comment annotated); `@types/node` becomes an EXPLICIT
   devDep (the 62-a#3 closure — pinning what tsc already requires for the
   `node:` imports, making the npm world deterministic);
   the unreachable `?? a.dueAt` arms RETIRE (the s42/s46 dead-?? class);
   the profile dirty gate RETIRES as a reference-divergence fix
   (bundle-evidenced); the doc-numerics carriers refresh to the mechanical
   census (62-a#2/#5/#6); the N-62d readOnly family + the N-62e
   disabled-binding divergence get documented annotations (the N-46e
   posture family).

## The plan (every anchor validated at file:line; blast radius pre-checked)

### S62-P1 — the manifest honesty (N-62a + 62-a#3 + 62-a#4)

- RED-first: the dead-code-hygiene session-62 describe (2 its) + the s46
  it RE-ANCHORED (see S62-P3) + the s61 guard's toast line dropped with a
  correction comment.
- GREEN: (a) `@radix-ui/react-toast` removed from package.json deps;
  (b) `@types/node` added to devDependencies at `^26.6.2` (the version
  already resolved in the bun tree — zero resolution change, tsc
  unaffected); (c) `bun install` regenerates bun.lock; `npm install
  --package-lock-only` regenerates package-lock.json (the §16ba lesson:
  BOTH lockfiles on every manifest change) — verify react-toast leaves
  both, @types/node + undici-types land in package-lock.json as resolved
  entries; (d) scripts/install_packages.sh: react-toast out, @types/node
  in — still exactly 30 tokens (19 runtime + 11 dev); (e) the SKILL §2
  carriers (deps-table row 7→6 pkgs + the toast note; runtime paragraph
  20→19 total, 7→6 radix; dev paragraph 10→11 + @types/node listed);
  (f) the s61 guard made honest (toast out of the dep list;
  react-label's import site NOW PINNED — all 6 survivors pinned); (g) the
  toast.tsx header comment annotated (the package retired s62; never
  imported).
- Blast radius: zero test pins on react-toast outside the s61 guard; the
  toast.tsx surface itself untouched (the from-scratch implementation is
  the live one).

### S62-P2 — the profile save gate (N-62b, bundle-evidenced)

- RED-first: a new it in tests/profile-photo.test.ts (12 → 13 its) — the
  save handler mirrors the reference's unconditional PATCH: NO `dirty`
  token in the comment-stripped source + the
  `JSON.stringify({ name: name.trim(), photoUrl: photoUrl || null })`
  body pin.
- GREEN: profile-page.tsx — the `dirty` const (:84) and the
  `if (!dirty) return;` early-return (:117) RETIRED with a record comment
  (the bundle evidence: `disabled:i` saving-only + the unconditional
  updateMe). The button's `disabled={saving}` (:264) already matches the
  reference exactly.
- Blast radius: the e2e profile round-trip (crm.spec.ts:2147+) changes
  the NAME too, so it stays green; no other pin reads `dirty`.

### S62-P3 — the dead-arm retirement (N-62c)

- RED-first: the s46 it in dead-code-hygiene.test.ts (:65-74) RE-ANCHORED
  from "the two-arm form appears exactly twice" to "the one-arm
  `new Date(a.createdAt)` form at both count filters + zero
  `?? a.dueAt` anywhere" (the s54 re-anchor precedent).
- GREEN: activities-page.tsx:130/:132 — `new Date(a.createdAt ?? a.dueAt)`
  → `new Date(a.createdAt)` (Activity.createdAt: string is non-nullable
  by the type contract; the arm is unreachable).
- Blast radius: the only `createdAt ??` pin is the s46 it itself;
  api-robustness pins target the API routes, not the page.

### S62-P4 — the doc-numerics sweep + the annotations (62-a#2/#5/#6, N-62d, N-62e)

All counts re-derived from the shell at execution time (the §16ba(3)
rule):
- PAD:127 "22 route handler files" → 27; PAD:328-330 the api tree row →
  "auth(6: login/signup/logout/me/verify/resend) users accounts contacts
  leads activities events opportunities dashboard reports settings search
  export upload uploads/[name] reset health — 27 route files".
- SKILL:297 Layer 1 "(22)" → 27; §5.1 "UI kit (12 files)" → 13; §5.2
  "21 .tsx files" → 25, "15 use client" → 19, the "22 API route files"
  listing → the accurate 27-file listing; :318 "entity-dialogs.tsx (817
  lines)" → 1081.
- SKILL §7.1 "(8)" → 9 + the Opportunity row added to the model table +
  "(186 lines)" → 242; §7.2 "(355 lines)" → 468 + "20 activities" → 23;
  §7.3 "(182 lines)" → 227; §7.4 "(129 lines)" → 133.
- README:722-724 + AGENTS:2314-2318: "since session 25" → "since session
  4"; AGENTS "pure additions" → the accurate 308/86 with the transitives
  note.
- SKILL §16ba(2): the dry-run "310 insertions" corrected to the shipped
  308/86 + the @types/node closure note (now pinned by the explicit
  devDep).
- N-62d: entity-edit-dialog.tsx — a comment at the readOnly prop noting
  the production-dead posture (no call site passes readOnly; the
  detailsTitle bindings render only under it; the N-46e wire-or-remove
  family, third member; test-pinned at entity-edit-dialog.test.ts:58-61).
- N-62e: accounts-page.tsx:58-64 — the "disabled at zero data" claim
  corrected to the filtered-length reality + the indistinguishability
  note (the reference's zero-data state makes the two hypotheses
  unresolvable LIVE; the binding + the pin stay as shipped).

### S62-P5 — the docs realignment + the ship

- SKILL v1.59.0: frontmatter + project_state + the new §16bb (the
  session-62 layer) — applied atomically via an assert-first
  scripts/skill_edits_s62.py at the sandbox root; wc -l verified.
- README: badge 1322 (1210 + 112), the Tested row, the command rows, the
  tree-block counts, the session-62 paragraph.
- AGENTS: the commands table (1210), the session-62 block.
- CLAUDE: 1210 ×3.
- PAD: the s62 inventory row + the Total (1210 + 112) + the tree/api rows.
- session_117.md (this session's record) + this plan's execution record +
  both worklogs.
- Screenshots: 02/11/12 re-captured + **71-profile-unconditional-save**
  NEW (the fix surface at 1440×900 — the profile photo round-trip with
  the toasts + the Save flow).
- LIVE battery: the fix surfaces render (the profile photo round-trip —
  upload → the toast [the from-scratch toast system post-dep-removal] →
  Save → the reload with the avatar; the probe RESTORED to photoUrl null
  after — zero residue) + the drawer both directions at TRUE 390px +
  zero 390px overflow ×10 routes + NO Tailwind v4 bug (the --blur-sm +
  pinned-shadow probe) + the closing db:census MATCH.
- Ship: the commit on main + the SSH-wrapper v3 push +
  `git@github.com:nordeim/neo-crm.git` + the remote verification + the
  operator key shredded.

## The arithmetic

- RED: 3 failures expected (the manifest it + the re-anchored s46 it +
  the profile it); full suite through RED: **3 failed / 1207 passed
  (1210 total)**.
- GREEN: dch 42 (40 + 2), profile-photo 13 (12 + 1) → **1210 unit checks
  (75 suites)**; e2e unchanged at 112; badge 1322.
- Non-vacuousness: pre-fix k6125f6b worktree (node_modules hard-linked
  via cp -al) + the two modified test files as the ONLY changes →
  **3 failed | 1207 passed (1210)** — exactly the RED set; the guard
  green-through-RED.

---

## Execution record (2026-10-05, session 62 — SHIPPED)

Executed exactly as planned, with the discoveries noted:

- **Intake** (62-0): REBUILT after a sandbox reset; outer `.env`
  quarantined (.env.quarantined-s62); baseline gate GREEN 1207/1207;
  census MATCH; drift sweep #58 byte-identical (33rd consecutive);
  reference census #58: the defect stands at TRUE 390px.
- **RED exact**: 3 failed / 1207 passed (1210) — the manifest it +
  the re-anchored s46 it + the profile it; the guards
  green-through-RED.
- **GREEN**: S62-P1 through S62-P4 all landed as scoped. Both
  lockfiles regenerated (bun.lock 1+/3−; package-lock 18+/35− with
  @types/node 26.6.4 + undici-types resolved IN — the 62-a#3 closure
  proven in the artifact); the install script at the 30-token set
  (19 runtime + 11 dev); the s61 guard honest (6 survivors, label's
  import site pinned).
- **Mid-flight pin repairs (2)**: the s46 re-anchor's bare count
  assertion was fragile (`new Date(a.createdAt)` matches 7 file-wide
  sites — only 2 are the count filters) → re-anchored to the two
  exact forms; the s39 profile-envelope window widened 1400 → 2200
  (the s62 record comment pushed the finally clause past the old
  slice edge — the chronic self-shift class).
- **Found at execution (2)**: the SKILL §7.3 db-path check count was
  16 (actual 20) — refreshed with the §7 sweep; the first Opportunity
  §7.1 row drafted from memory was field-inaccurate — corrected
  against the schema (accountName/amount/closeDate/source/owner, no
  FK ids — the derive-from-the-shell rule applied mid-flight).
- **Non-vacuousness**: pre-fix k6125f6b worktree → 3 failed | 52
  passed (55) — exactly the RED set; clean teardown; sanity 20/20.
- **Full gate**: lint 0/0 · tsc 0 · 1210/1210 (75 suites, +3) ·
  build clean (og-image.png only in the standalone artifact) ·
  112/112 e2e on a fresh CI=1 boot (2.5m).
- **LIVE battery**: the photo-only save round-trip GREEN (toast →
  avatar → Save → reload with all three avatars — the old gate's
  silent no-op case now works); the probe restored (photoUrl null);
  the drawer both directions; zero 390px overflow ×10; NO Tailwind v4
  bug (the pinned shadow + blur on the live "John Doe" input); the
  closing census MATCH.
- **Screenshots**: 02/11/12 re-captured + 71-profile-unconditional-
  save NEW — all VLM-verified 4/4.
- **Docs**: SKILL v1.59.0 (assert-first script at the sandbox root,
  5913 → 5988 lines; one double-word artifact caught + fixed in both
  the file and the script); README/AGENTS/CLAUDE/PAD at 1210 + 112
  (badge 1322); session_117.md; this record; both worklogs.
- **Ship**: commit on main + the SSH-wrapper v3 push + the remote
  verification + the operator key shredded.
