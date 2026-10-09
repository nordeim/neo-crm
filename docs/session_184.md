I'll continue this task systematically. Let me first set up the task plan and refresh the workspace.
The workspace has been reset. Let me clone the neo-crm repository.
Repo cloned. Latest commit is session-90 work. Now let me review the project structure and core documents.
session_180.md and session_181.md both exist. Let me check which is most recent and read the session docs.
Let me examine session_181.md's tail and the last commits to understand the exact numbering scheme.
The numbering is clear: session-90 shipped at `3a89508`, operator added session_180.md (narrative) and session_181.md (raw log). My task is **Session 91**. Let me absorb the core documents, starting with CLAUDE.md.
The reads keep persisting to files. Let me read CLAUDE.md in chunks directly.
CLAUDE.md absorbed. Now let me read the SKILL.md frontmatter + project_state and check AGENTS.md structure.
Now let me read session_179.md and the session-90 plan.
Now let me read the worklog tail for current state and house patterns.
Worklog absorbed. Now let me verify environment integrity and check the skills catalog.
The environment needs setup (.env missing, db empty). Let me check the platform DATABASE_URL hazard, package.json, and skills catalog.
Let me check the Tailwind v4 skill for the mobile-menu bug pattern the user flagged.
The Tailwind v4 mobile-menu bug knowledge is codified in the repo itself. Let me verify our mobile-nav implementation and the `hidden` attribute anti-pattern.
Mobile-nav is the documented superset fix. Now let me set up the environment: bun install + .env + db setup.
Census MATCH. Now the baseline gate (lint + typecheck + unit).
**Baseline gate GREEN: lint 0/0 · tsc 0 · 1788/1788 unit (99 suites)** — matches the session-90 ship state. Let me verify doc anchors, then run the drift sweep.
All doc anchors verified at session-90 state. Now the drift sweep #87 — login to the reference and fetch the bundle. Let me check the agent-browser tooling.
No standing scripts — the drift sweep was session-scoped. Let me run it with agent-browser.
Logged into the reference. Now let me fetch the bundle for the md5 drift sweep.
**Drift sweep #87 CLEAN** — bundle md5 `a70a637f…` exact (62nd consecutive stable session). Now the reference census: desktop nav + mobile 390px.
Desktop census matches: 256px nav, 8 links, demo data zero. Now the TRUE 390px mobile census.
**Reference census #87: the mobile-nav defect STANDS at TRUE 390px** (nav w=0, 0 visible links, no menu — 12th consecutive census). No hamburger at the top — only content-area icon buttons. Our drawer stays the deliberate superset.

Now the scandihaven re-verify.
Scandihaven re-verified — same family, no new patterns. Let me complete core-doc absorption with the AGENTS.md head and SKILL §16cd tail.
Core docs absorbed. Let me log the intake to the sandbox worklog, then launch the two audit subagents.
Now launching the two audit subagents in parallel — 91-a (s90 re-audit + genus guard) and 91-b (graduation audit).
Now let me launch the two audit subagents in parallel (91-a: s90 re-audit + genus guard; 91-b: graduation audit).
91-b 已返回：**无毕业（连续第 48 次），8/8 普查无误，两项操作员决策均完好**。现在启动 91-a（s90 重新审计 + 种属防护）。
Both audits complete: **91-a 13/13 GENUINE** (genus guard found 5 prose-layer nanos G-91a1..a5 + 2 borderline), **91-b zero graduations**. Now the operator decisions re-affirmation (51st) is evidence-backed by 91-b's census — both STAND.

Now the **91-c rotation**: the full-app screenshot diff (the strong sweep per session_179's suggested next). Let me boot our dev server.
Dev server is up. Let me set up the screenshot diff sweep — first capture the reference pages at 1440x900.
contacts.png and leads.png are suspiciously small and identical size. Let me check what was captured.
The page loads but shows "Hi, Guest" — the session may have degraded. Let me re-login to the reference to be safe, then re-capture the failed pages.
Session is fine (transient hydration state). Let me re-capture contacts/leads with content-wait logic.
Both captured properly now. Let me re-run the full reference sweep with content-wait for consistency.
All 9 reference pages captured. Now login to our app and capture the same set.
Logged into our app. Now capturing all 9 pages on our side.
Both sides captured. Now the pairwise pixel diff.
Percentages are 1.8–8.8%. Let me verify the data parity first — comparing the actual rendered text content of both dashboards.
The reference dashboard shows ZERO demo data while ours shows the seeded data — the standing known divergence. Let me check the reference's other pages for data state.
**Key insight**: the reference workspace is FULLY EMPTY (zero data — the standing state for 11+ censuses) while ours runs the seeded demo data. For a true apples-to-apples "strong sweep" I should compare both apps at **zero data** — isolating chrome divergence perfectly. Let me check the seed script's restore behavior first.
Seed is a full wipe+recreate — perfectly restorable. Let me create the zero-data state on our app (keep users + settings, clear domain tables).
Zero-data state set. Now capturing our 9 pages in the zero-data state.
File sizes now track the reference closely (calendar 89,358 vs 89,350!). Now the apples-to-apples pixel diff.
**Strong results**: accounts 0.00%, calendar 0.01%, activities 0.01%, contacts 0.51% — essentially perfect. Real chrome-level diffs remain on dashboard (8.54%), reports (5.17%), settings (4.73%), leads (2.17%), profile (2.08%). Let me localize them into clusters.
Diff regions localized. Let me DOM-probe both apps at the dashboard regions first (the biggest diff).
Our probe still shows seeded values — let me verify the zero-data state actually took effect on the API.
DB is confirmed empty. The probe must have hit a stale page. Let me force a fresh reload and re-check.
Total Leads = 0 but Deals Closed still $337.0k — the KPIs must read from a cached or different source. Let me check the store's data flow.
There IS an Opportunity model my zero-data script missed. Let me check the schema for the full model list.
True zero state reached. Re-capturing all 9 pages now that opportunities are cleared too.
**Huge improvement**: dashboard 0.33%, reports 0.00%, accounts 0.00%. Remaining real chrome diffs: **settings 4.73%, leads 2.17%, profile 2.08%, contacts 0.51%, dashboard 0.33%**. Let me re-cluster and investigate each.
Let me compare the settings page text content first (the biggest diff).
The reference's settings picklists are ALL empty ("No items yet") — they live in the workspace data. Let me check ours.
The settings diff is the picklist DATA (reference wiped vs ours seeded) — same genus as the domain data. But let me verify our "No items yet" empty-state form would match if empty. Let me check the source.
Our empty-state form mirrors ("No items yet"). The settings diff is picklist DATA. Let me also check the profile page diff before deciding.
Profile text is identical. The diff must be visual-only. Let me DOM-probe the profile regions on both apps.
**Real structural find on profile**: our Personal Information form is 32px shorter than the reference (472 vs 504). Let me probe the Profile Picture section to locate it.
**Key find**: label→content gaps differ — reference 12px vs ours 4px on the same `space-y-2` wrappers. Let me check our space-y re-pin in globals.css.
Let me read our profile page form source and check the computed margins live.
Both use `space-y-2` yet gaps differ. Let me check the LIVE computed margins on both apps.
Our label carries `margin-bottom: 8px` (v4 semantics) yet the input sits 4px higher than the margin-box. Let me probe the reference's computed styles.
Let me dump the wrapper innerHTML on both apps to decode the exact DOM.
DOM is structurally identical — the delta is pure spacing computation. Let me measure precisely with offsetTop on both.
I probed the wrong app (still on ours). Let me navigate to the reference and re-measure.
**Root cause hypothesis**: the label is inline (`display: inline`) — vertical margins are ignored on inline boxes. v4's space-y (margin-BOTTOM on the non-last child) no-ops when that child is the inline label; v3's (margin-TOP on the following block) always works. Let me verify the display.
**ROOT CAUSE CONFIRMED — a new v4 divergence genus**: v4's space-y puts margin-BOTTOM on the non-last child, but our Labels are `display: inline` — vertical margins on inline boxes are ignored → the gap collapses. v3's margin-TOP on the following block sibling always works. Let me scope the blast radius across src/.
**The house already knows this genus** — DIALOG_GROUP documents the s14/s15 fix: `space-y-2` collapses on INLINE labels under v4; the established fix is explicit `mt-2` on the control. The dialogs and settings were fixed — **but the profile page was missed** (all 4 groups collapsed = the 32px). Let me sweep for other surviving instances.
**A second candidate**: `entity-edit-dialog.tsx:274` — `space-y-2` + Label + Select with no controlMt. Let me check all the Label contexts in the candidate files.
save-report + reports are fine (self-fixed/block labels). Let me check calendar, contacts:863, and verify the edit-dialog LIVE.
Calendar rail is fine (`block` labels). Two real candidates remain: **entity-edit-dialog** and the **contacts Import dialog**. Let me verify LIVE — first read the edit dialog's construction.
Both dialogs need data to open — but the reference is zero-data and must stay read-only. The house methodology: **decode from the byte-stable bundle**. Let me extract the reference's edit-dialog and import-dialog constructions.
**Major decode**: the reference's own dialogs ALL use `space-y-2` + inline Label + block control with no margin classes (v3 semantics make it work). Let me find the reference's EDIT dialogs in the bundle.
**The smoking gun**: the reference's EDIT dialogs (wce/Mke) use **BARE unclassed groups** (Label + control direct children, 4px strut gap) — while ours uses `space-y-2` groups. Under v4 the gap accidentally computes the same 4px — but the class strings diverge. Let me check the existing pins for the edit dialog.
Pins don't cover the group spacing. Now let me complete the picture — probing the contacts, leads, and dashboard diff regions.
Contacts empty-row is identical (only the documented lucide aria-hidden superset). Let me check the leads page diff bands.
**Two leads finds**: (1) our sortable header wraps the label in a `<button>` — the reference uses a bare `<div>`; (2) our table starts 16px lower (y512 vs y496). Let me probe the toolbar region above the table.
The `p-6 px-0 py-0` wrapper matches the table exactly (padding zeroed). The 16px must come from elsewhere. Let me dump the full card structure on both.
**Pinpointed**: the toolbar header `p-4 border-b space-y-4` is 16px taller in ours (137 vs 121). Let me dump its children.
Both toolbars' children are identical — but the reference's bottom padding seems absent (17px vs our 33px below the last row). Let me measure the computed padding/margins directly.
**M-91c2 decoded**: the reference's `mb-4` on the filters row is DEAD (v3's space-y rule, specificity (0,3,0), forces margin-bottom: calc(1rem×0)=0) — ours keeps it alive under v4's `:where()` → 16px extra. Now let me check the leads sortable-header (button vs div) and the reference's sort functionality.
The SortHead button is the **documented accessible superset** (S29-P2) — standing. Now the dashboard chart diff (y580-620).
Dashboard diff = a 2px zero-area chart baseline artifact (library-internal, not actionable). Let me check the last unexplained region — the contacts stat-card block (760,540)-(940,640).
Contacts region identical — noise. The findings ledger is complete. Now the N-91c5 genus sweep — checking other pages for the mb-inside-space-y pattern (the M-91c2 genus).
The bundle confirms M-91c2 (the reference's Gke filters row + the toolbar). Let me check the activities toolbar (the other p-4 border-b region).
Activities toolbar is clean (no space-y). Let me confirm our filters row's live mb-4 value.
All findings decoded and LIVE-confirmed. Let me log the rotation to the worklog and check the current profile-family pins before writing the plan.
Now let me restore the seed data (the standing state), then write the remediation plan.
Let me remove the speculative execution record (the house appends the REAL one post-execution) and validate the plan against the codebase.
Plan validated (all targets verified at file:line during the investigation). Now the RED phase — let me study the house test style first.
Now let me check which existing suites pin the surfaces I'm about to change.
Let me verify no other test pins reference the surfaces being changed.
Clean — no existing pins collide. Now writing the RED-first test suite.
7 failed | 6 passed — but 2 pins are mis-shaped (passing vacuously). Mid-flight pin-shape repairs: tightening the import pin and the retirement-comment pin.
RED clean: 9 failed | 4 passed. Now the full-suite non-vacuousness proof at the pre-fix state.
**Non-vacuousness PROVEN: 9 failed | 1792 passed (1801 total) — ZERO collateral.** Now the GREEN phase. S91-P0: the PROFILE_LAYOUT.controlMt token.
Now apply the controlMt to the 4 controls in profile-page.tsx.
Now the 3 Inputs.
P0 done. Now S91-P1 — the leads filters row.
Now S91-P2 — the edit dialog BARE groups, and S91-P3 — the import dialog mt-2.
P0-P3 landed. Let me run the suite to check GREEN progress.
5 pin-shape repairs needed (the needle-in-own-docs class + the cn()/token forms + an earlier class occurrence). Let me check the leads file for earlier occurrences first.
Only one occurrence — the 700-char window is just too small for my long comment. Let me repair all 5 pin shapes.
13/13 GREEN. But the repaired pins must be re-proven RED against the pre-fix state (non-vacuousness). Let me stash the src changes and verify.
Non-vacuousness proven with final pin shapes. Now S91-P4 — the 7 audit nanos. Let me read each.
Now G-91a4 (the ACTIVITY_KPI_STATICS comment) and B-1 (the "four surviving components" wording).
Now G-91a5 (PAD count) and B-2 (constants.test prose).
All S91-P4 nanos landed. Now the full GREEN check: lint + typecheck + full unit suite.
**FULL GREEN: lint 0/0 · tsc 0 · 1801/1801 unit (100 suites, +13 net)**. Now the build + e2e gate.
One e2e failure — the known settings-debounce focus-timing flake (untouched by this session's delta). Let me verify standalone.
The exact test passes standalone — the known timing flake (the s90 precedent). Full re-run per the house rule.
**GATE FULLY GREEN: lint 0/0 · tsc 0 · 1801/1801 · build · 132/132 e2e** (the first-run flake passed standalone + on the full re-run). Now the LIVE battery. First verify the dev server picked up the fixes.
Session expired — re-login to our app.
**M-91c1 FIXED LIVE: gap 12px, form 504px — byte-matching the reference.** Now the leads toolbar.
The dev server is serving stale code (row2 mb still 16px). Let me restart it.
**M-91c2 FIXED LIVE: toolbar 121px, row mb 0px, table y496 — matching the reference.** Now the edit dialog (L-91c3) — opening one on a seeded row.
The dialog is open. Let me measure via direct element queries.
**L-91c3 FIXED LIVE: the group is BARE, gap 4px — the reference's own wce construction.** Now the import dialog (L-91c4).
**L-91c4 FIXED LIVE: gap 12px, mt 8px.** All four fixes verified. Now the 390px drawer battery.
The drawer is open (the trigger shows "Close"). Let me run the full drawer battery.
Panel at x=-288 (closed/transitioning). Let me settle, verify the closed state, then open and run the full battery.
Closed state verified (inert + visibility:hidden + pointer-events:none). But the trigger label reads "Close" while closed — let me check the source.
Open-state battery green (panel 288px at x=0, sidebar blue, 8 links, focus inside, scroll locked). Now navigate-close.
**Drawer battery fully GREEN** (navigate-close + lock released + closed inert/hidden). Now the closing census + reference md5 re-fetch.
Census MATCH + reference md5-exact. Now the zero-data re-diff sweep — the strongest verification of the fixes.
**THE RE-DIFF: leads 2.17% → 0.00% and profile 2.08% → 0.00% — both now BYTE-CLEAN.** Five pages at 0.00%, all remaining diffs explained. Re-seeding now.
Now the screenshots. Let me check the naming pattern and capture 127/128/129.
The re-seed rotated user IDs — session invalidated. Re-login and re-capture.
All 3 screenshots captured. Now the VLM verification per the house protocol.
**VLM 127: 5/5.** Now 128 and 129.
**VLM battery: 127 = 5/5 · 128 = 5/5 · 129 = 5/5 — zero adjudications.** Now the docs realignment via the assert-first script. Let me survey the anchors.
All anchors surveyed. Writing the assert-first docs script.
§16cd is the file's last section — §16ce appends at the end. Fixing the script.
All doc edits applied. Now session_182.md (the formal log).
Now the plan's execution record and the repo worklog entry.
All files staged-ready. Let me check the full untracked list + run the final verification.
**Final verification GREEN: lint 0/0 + 1801/1801 after the doc edits.** Now the commit — house style.
Commit `896bf2e` landed. Now the push via the SSH wrapper — let me read the runbook.
The runbook is clear (the `--remote` flag required for neo-crm). Let me deploy the key and check the ssh tooling.
No ssh binary — deploying the paramiko shim per Appendix A.
Fingerprint matches the s90-verified operator key. Dry-run first.
**PUSHED: main @ `896bf2e`, remote verified.** Shredding the operator key.
Push verified — remote at `896bf2e`, tree clean, key shredded. Per the house pattern (session_180.md after the s90 push), the follow-up process-narrative commit: session_183.md.
Now pushing the narrative commit — redeploying the key for the second push.
**BOTH PUSHES COMPLETE — main @ `f455ed7`, remote verified, tree clean, keys shredded.** Closing out: stopping the dev server and finalizing the worklog.
**Session 91 delivered and shipped to `main` @ `896bf2e` + `f455ed7`** — the complete chain executed end-to-end:

- **Intake**: workspace rebuilt from a fresh clone; baseline gate green (1788/1788); drift sweep #87 clean (62nd consecutive stable bundle); the reference's mobile-nav defect standing at TRUE 390px (12th census)
- **Audits**: 91-a the s90 re-audit **13/13 GENUINE** + the count-in-comment genus guard re-run (5 nanos + 2 borderline, all fixed); 91-b **zero graduations 13/13** (48th consecutive); both operator decisions re-affirmed (51st — CSV posture **(b)** + source-vocabulary parity)
- **The rotation (the full-app zero-data screenshot diff)**: both apps driven to the reference's own empty-workspace state, 9 pages pixel-diffed — **4 pages byte-clean**, every other diff explained, and the real finds all traced to **one root cause: the v4 space-y semantics** (margin-bottom on non-last inline Labels is ignored; v3-dead `mb-4` classes stay alive under v4's `:where()`)
- **The fixes (TDD)**: the profile form's 4 collapsed gaps (the 4th `controlMt` token), the leads toolbar's dead `mb-4` (16px table shift), the edit dialogs' BARE groups, the import dialog's gap — plus 7 audit nanos. Gate: lint 0/0 · tsc 0 · **1801/1801 (100 suites)** · build · **132/132 e2e**; the re-diff: **leads + profile both 0.00% byte-clean**; screenshots 127–129 (VLM 5/5 × 3); docs at SKILL v1.88.0/README 1933; pushed via the SSH wrapper, key shredded

**Suggested next (session 92):** promote the sweep tooling into the repo as a one-command regression, walk the dialogs-at-390 family (phone-width dialogs weren't covered at 1440), or re-run the genus guard on the s91 delta. Want me to proceed?
