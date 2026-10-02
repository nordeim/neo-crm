I'll start by internalizing the instructions and setting up the workspace. This is a comprehensive code audit and remediation task. Let me create a structured plan first.
Workspace is fresh. Let me clone the neo-crm repository.
Repo cloned successfully. Now let me read the core documentation files.
The docs are large. Let me read the full persisted outputs.
Let me check file sizes and read in manageable chunks.
AGENTS.md fully read — extremely detailed project with 34 sessions of parity work. Now let me read CLAUDE.md and the session docs.
Now let me read the worklog, session-34 plan, and check the remaining docs.
Let me read the worklog tail, the README, and key sections of the SKILL file.
Now let me check the skills catalog and the SKILL.md project state.
The repo's skills catalog is identified. Let me read the key SKILL.md project state and verify the environment.
Key findings: no `.env` and no `db/` folder exist yet. Let me read the full persisted SKILL output and check test configs.
Vitest and Playwright configs already exist. Let me check the runtime environment and key db-path code.
Bun 1.3.14 available. Let me set up the environment: install deps, create `.env` + `db/` folder.
Database created at the correct repo-root location. Now seed it.
3 unit tests failed — this is a real finding. Let me get the failure details.
**REAL FINDING #1**: The uploads GET route `src/app/api/uploads/[name]/route.ts` is missing from the repo but pinned by tests. Let me investigate.
The GET route was never committed — a genuine repo regression. Let me examine the seam, the test contract, and the POST route.
The contract is clear. Now let me run the build to check for other issues, and examine where `file_url` is consumed.
Now let me run the e2e suite against the fresh build.
E2E passed 106/106. Interesting — the photo-upload e2e tests pass despite the missing GET route. Let me check why.
The e2e only asserts the `<img>` DOM node, not the actual image load — so the missing GET route is masked in e2e but breaks real photo display. Let me review the recent session-33/34 diffs for other issues.
Let me trace when the uploads GET route was lost — checking the session-30 commit.
**Root cause confirmed**: session-30's commit message documents `GET /api/uploads/[name]`, but the file was never `git add`ed — it lived as an untracked file in the old sandbox (so sessions 31-34 stayed green there), and a fresh clone breaks. Let me check the full session-30 commit file list and scan for any other missing files.
Only the uploads GET route is genuinely missing (other hits are negative-assertion false positives). Now let me audit the mobile navigation component — the user's key concern.
Mobile nav contract is aligned. Let me verify the Tailwind v4 token pins in globals.css.
Tailwind v4 stack verified healthy. Now let me test background process persistence and launch the dev server.
Dev server persists across calls and the db is UP. Now let me set up browser automation for the live reference comparison.
agent-browser is ready. Let me log into the live reference app.
Logged in. Let me capture the reference dashboard and test its mobile navigation at 390px.
Reference mobile-nav defect confirmed (31st session): 8 links in DOM, 0 visible, no hamburger. Let me capture it and verify the reference demo data state.
Reference demo data still zero (31st session) — s32 currency doctrine confirmed. Now let me verify OUR clone's mobile nav on the dev server.
Clone has the hamburger at 390px with healthy Tailwind tokens. Let me test the drawer open/close cycle.
Mobile nav verified working in both directions. Now let me capture our dashboard and sweep for overflow on all routes.
That sweep ran at desktop width. Let me redo it at a TRUE 390px viewport.
Zero overflow on all nine routes at 390px. Now let me review the scandihaven reference repo (tech stack patterns).
Let me consult the key repo skills for the audit: tdd, tailwind-patterns, and code-review-checklist.
Let me examine the e2e global-setup and check remaining audit surfaces.
Let me dispatch parallel audit agents for a deeper code review while I verify the production start.
Both audits are complete with rich findings. Let me verify the critical `.gitignore` root-cause claim and check the production start.
**ROOT CAUSE PROVEN**: `.gitignore:55` `uploads/` matches `src/app/api/uploads/` — git silently ignores the route file. Let me clean up and verify the production start.
Production start verified working (session-34 fix holds on fresh clone). Let me verify the dashboard data, then switch back to dev.
The audit is complete. Let me examine the route structures for the FK-validation fix scope.
Let me complete the standing-layer drift sweep — fetch the live reference bundle and compare md5 with the documented cache.
**Bundle byte-identical — 6th consecutive stable session.** The audit is complete. Now let me write the session-35 remediation plan.
Plan written. Now let me validate it against the codebase — checking the store and remaining route details.
Plan validated against code — all claims confirmed. Now executing **S35-P1** (the critical fix): .gitignore anchor, the GET route, and db/.gitkeep.
2 tests still fail — let me see which and why.
Two fixes needed: the 404 literal (test pins it in source) and the gitignore pin (the old test encoded the buggy unanchored pattern). Let me fix both.
Now update the gitignore test pin — the old pin encoded the defective unanchored pattern:
**S35-P1 GREEN (11/11)**. Let me do a live end-to-end verification of the photo round-trip on the dev server.
**S35-P1 LIVE-verified**: GET 200 `image/png`, traversal/bad-name/missing all 404. Now **S35-P3** — the db-path guard, RED-first. Let me study the existing test structure.
The bug trace is confirmed. Let me add the RED test for the absolute-launch-.env case.
**RED confirmed (1/20)**. Now the fix — the `isRelativeFileUrl` guard on the launch-dir branch.
**S35-P3 GREEN (20/20)**. Now **S35-P4** — the mobile-nav ownership fix. Checking for source pins first.
No unit pins on the pattern — safe to refactor. Applying the ownership move:
Let me re-read the current file state.
The prevPathname removal applied but the doc header was condensed. Let me restore the full documentation header.
Now add the adjust-during-render to AppShell where the state lives:
**S35-P4 done.** Now **S35-P5** — the API robustness layer. Let me first review the exact PUT-route code to write precise RED pins.
Now writing the RED test suite for the API robustness layer:
RED confirmed (13/14). Let me check which one already passes to ensure the pin isn't weak.
One check unexpectedly passes — let me inspect the store's tail to understand why.
The slice anchored on the type declaration, not the implementation — a tautology risk. Fixing the anchors:
**Full RED (14/14).** Now implementing — starting with contacts/[id]:
Now leads/[id]:
Now accounts/[id] and events/[id]:
Now the activities and events POST routes — let me view their full structure first.
Now events POST:
Let me fix the indentation in the events route:
Now the store fixes — resetData + logout:
**S35-P5 GREEN (14/14)**. Now **S35-P2** — the e2e image-load assertion (mask closure).
All code changes complete. Now **S35-P6** — the full gate.
**817/817 unit GREEN**. Now build + e2e:
**FULL GATE GREEN: lint 0/0 · tsc 0 · 817/817 · build · 106/106 e2e.** Now **S35-P7** — LIVE verification on the dev server.
FK rejection works with the proper envelope. Let me verify a valid PUT still succeeds and test the owner FK too:
Session alive. Running the full photo round-trip verification:
**Full photo round-trip LIVE-verified** (upload → GET 200 → img render → save → topbar pickup). Now verifying the mobile drawer with the new ownership code:
Back-navigation closes the drawer — the ownership fix verified. Now capturing the screenshot set for `docs/screenshots/`.
All images load (`naturalWidth: 1` = decoded 1×1 test PNG). Now the docs realignment — locating all count/version anchors.
All anchors located. Updating README first:
Now add the session-35 paragraph to the README's session narrative:
README done. Now AGENTS.md — counts + the session-35 block:
Now CLAUDE.md and the PAD:
Now the SKILL file — version, project_state, and the new §16aa section:
Now adding the §16aa section to the SKILL file:
Now the plan's execution record and the session log:
Now the session log (docs/session_63.md):
Now the repo worklog entry and the sandbox worklog:
Now the final gate re-run on the complete state:
**FINAL GATE GREEN on the complete state.** Now let me verify the change set and prepare the commit.
The screenshots aren't in the staged list — let me check their status.
Shot 43 saved elsewhere — agent-browser resolves paths against its daemon cwd. Let me find it.
Wait — the 02/11/12 captures may have landed in the daemon cwd too. Let me check.
The re-captures went to the daemon cwd. Moving them into the repo:
All deliverables staged. Now the commit — following the repo's established message convention:
**Commit `1468867` created on main.** Now the SSH-wrapper push — let me read the runbook first.
Runbook understood. Let me set up the SSH tooling and materialize the key.
pip installed to a different python. Let me find the right interpreter.
paramiko ready. Now deploying the ssh shim per the runbook's Appendix A:
Fingerprint matches the session-26..34 records (the same operator deploy key). Now the dry-run with the explicit `--remote`:
Dry-run clean (fast-forward `f63608e..1468867`). Now the real push:
**PUSH VERIFIED.** Now shredding the key and completing the dual-commit pattern:
**SESSION 35 FULLY SHIPPED** — both commits verified on remote main. Final housekeeping:
**Session 35 complete** — all 18 tasks executed and shipped to `main` on `git@github.com:nordeim/neo-crm.git` (commits `1468867` + `96f41cd`, both push-verified, key shredded).

**The headline finding**: your fresh-clone gate was RED (799/802) — the uploads GET route was *never in git*. The unanchored `.gitignore` pattern `uploads/` also matched `src/app/api/uploads/`, so the file lived only in the old sandbox while every fresh clone shipped broken photos. Fixed root-to-tip: anchored `/uploads/`, restored the route, `db/.gitkeep`, plus the API robustness layer (FK guards, envelope 500s, db-path guard, mobile-nav ownership move). Gate now **817/817 unit · 106/106 e2e**, live-verified, docs at SKILL v1.32.0.

**Suggested next steps**: review `docs/session_63.md` + the deferred LOW findings (reset role-gating, health 503, rate limits); consider a fresh-clone CI workflow so this class of rot can never hide again.
