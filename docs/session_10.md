I'll start by internalizing the task requirements. This is a complex full-stack code remediation task. Let me set up a structured plan and begin.
I've received the operating instructions. Let me read the full content, then clone the neo-crm repo.
I've internalized the operating instructions (production-grade coding standards, TDD, root-cause discipline, evidence-based verification). Now let me clone the neo-crm repo and set up the workspace.
Repo cloned. Now let me explore the structure and read the key documentation files.
仓库已克隆。我看到已经有一个现有的的结构，包含了会话日志和计划。现在让我阅读关键文档 —— 从 `package.json`、根目录文件和关键文档开始。
The codebase already has test configs and prior session work. Let me read the key documentation files now.
Now let me read the session documentation — session_7.md, session_8.md, the session7 parity plan, and worklog.md.
I have a good picture now — this is Session 8 of an ongoing parity project. Let me read the session-7 parity plan and CLAUDE.md to complete my understanding.
I now have deep context: this is Session 8 of a parity-remediation series. Sessions 1–7 are complete (112 unit + 21 e2e checks green, pushed at `f93d190` + a session-log commit). Let me validate the current environment state and check the codebase.
Environment looks solid — `.env.example` is tracked with the correct `DATABASE_URL="file:../db/custom.db"` contract, and both test configs exist. Now let me set up the working environment (install, .env, database) and verify the baseline.
Database seeded. Let me verify the DB location is correct (repo root `db/` folder) and run the baseline gate.
Baseline gate is green (lint 0/0 · tsc clean · 112/112 unit). Now let me clone the scandihaven reference repo and start the dev server for the parity audit.
Dev server healthy. Now let me review the scandihaven skills catalog as instructed, looking for relevant skills (clone-app-pat-pro, agent-browser, tdd, Tailwind v4).
The user flagged mobile-nav and Tailwind v4 concerns. Let me read the most relevant skill references — mobile-navigation debugging, Tailwind v4 pitfalls, TDD, and agent-browser.
Now let me review the TDD, agent-browser, and clone-app-pat-pro skills quickly, then examine the current mobile-nav implementation.
Now let me examine the current mobile-nav implementation — the user's key concern — along with the app shell.
**Bug found!** In `mobile-nav.tsx` line 48: the `matchMedia("(min-width: 1024px)")` listener still uses the OLD `lg` breakpoint, but session-7 changed the drawer to `md:hidden` (768px). This is a "Class B: Display Mismatch" from the mobile-nav debugging taxonomy — resizing from 700→800px with the drawer open leaves the body/main scroll **locked** with no visible drawer. Let me examine the shell and other components to check for related issues.
Codebase review confirms one bug so far (the 1024px media query). Now let me audit the live reference app using agent-browser to compare current state and find parity gaps.
Now let me log in to the live reference app and audit its current state.
已登录。正在保存认证状态，并检查关键问题——演示数据是否已返回？
**Demo data is STILL zeroed** (Total Leads: 0) — parity remains structural. But I spot something new: the dashboard header now shows **two Export buttons**. Let me extract the detailed DOM.
**Key finding**: The live dashboard header now has THREE buttons — outline "Add", outline "Export" (label hidden below sm), and a **primary blue-600 "Export"** (label always visible). This is a reference regression since session 7. Let me compare with our clone.
Our clone already mirrors the dual Export buttons. Let me verify the exact anatomy matches the live DOM.
**Gap found (S8-1)**: The live reference's primary Export button now has an **always-visible "Export" text label** (bare text node, not `hidden sm:inline`), while our clone renders icon-only. Let me continue the systematic audit — walking all live pages and capturing DOM pins.
Dashboard structure matches our pins. Now let me extract the live topbar DOM to verify chrome anatomy.
Topbar matches session-7 pins. Let me verify the sidebar and check the remaining pages — accounts, contacts, leads.
Sidebar matches pins. Let me walk the remaining live pages to detect any changes since session 7.
Calendar search intact. Now the critical mobile audit — testing the live reference at phone width and the drawer/sidebar boundary.
Reference defect confirmed at 390px (no nav at all). Now let me test the same widths on OUR clone — this is where the drawer bug matters.
The `offsetParent` check is a false negative for `position:fixed` elements — let me verify drawer visibility correctly and test navigation + Escape.
The text-locator hit the underlying page's "Accounts" KPI label instead of the drawer link. Let me use the drawer's link ref directly.
Drawer navigation works correctly. Now let me reproduce the **media-query bug** — open drawer at 390px, then resize past the md breakpoint (768px).
**BUG REPRODUCED (P1)**: At 800px with the drawer open, the drawer hides (`md:hidden`) but **body + main remain scroll-locked** — the app becomes unscrollable. Root cause: the `matchMedia("(min-width: 1024px)")` listener wasn't updated when session-7 moved the drawer to `md`. Let me verify the escape path and reset state.
Escape + unlock works. Now let me do a systematic desktop visual comparison — capturing all live reference pages, then all clone pages.
Now let me compare the screenshots visually using VLM to detect parity gaps. First, create side-by-side composites.
The loop screenshots were saved relative to the daemon's cwd, not my shell. Let me locate them.
Key findings: S8-1 confirmed (Export label), and a possible filter-bar difference. Let me extract the live dashboard filter bar DOM to verify.
**S8-2 CONFIRMED**: The live filter bar has THREE comboboxes — "All Stages", an **EMPTY one** (blank span, no placeholder), then "All Sources". Let me open the empty select to see what it contains.
The empty select is a **view-switcher with "Table"/"Cards" options** (dead on the reference — no default set). Let me check what our clone currently renders in the dashboard filter bar.
The middle select on the live reference is a **Table/Cards view-switcher** (renders with empty label), while our clone renders an "All Owners" filter there. Let me test if the live switcher is functional.
The live view-switcher is **dead** (selecting "Cards" changes nothing — table remains, label stays empty). Our clone misinterprets it as an "All Owners" filter. Let me continue the audit with VLM comparisons of remaining pages.
**S8-3 FOUND — Accounts toolbar**: reference has "Table" dropdown + empty dropdown + "More" button left of the search. Let me extract the exact live DOM.
Let me check the accounts empty combobox options and compare with our clone's toolbar.
Accounts toolbar pinned: "Table/Cards" switcher + empty "Standard/Detailed" switcher + More + search + Export CSV. Let me check our clone's version.
Confirmed — our clone's accounts toolbar lacks the two selects and More button. Let me check contacts/leads toolbars on live and run VLM comparisons.
Contacts toolbar matches. Checking leads toolbar on live.
**S8-4 found**: leads search uses `w-5 icon + pl-10` on live but `h-4 w-4 + pl-9` in our clone. Let me check the leads toolbar wrapper classes too.
The live leads search bar contains ONLY search. But innerText showed a "Filters" section — let me check the live leads page structure around the table.
**S8-5**: Live leads "Filters" button is a **popover trigger** (`aria-haspopup="dialog"`), no chevron — our clone uses an inline expander with chevrons. Let me open the live popover to see its contents.
Full popover anatomy pinned (Status/Source/Min Deal Value/Follow-up Date + Clear/Save View). Let me run the remaining VLM comparisons.
Let me verify the leads charts presence in our clone and the live contacts table headers.
Both false alarms (charts present; Priority header exists). Let me run VLM on the remaining pages.
**S8-6 found**: Live "Log WhatsApp" is a **solid green** button; ours is outline. Let me extract all four quick-log buttons from live.
S8-6 pinned: Log WhatsApp is solid `bg-emerald-600` on live. Let me check our clone's buttons and continue with reports/settings VLM.
**S8-7**: Settings "+" buttons — VLM says reference is gray, ours blue. Let me verify via live DOM.
Buttons use `bg-primary` — but the reference's `--primary` token may resolve to gray. Let me compute the actual color.
**S8-7 CONFIRMED**: Live settings "+" buttons compute to `rgb(23,23,23)` — stock shadcn zinc-950 dark, NOT blue. Our clone renders them blue (bg-primary). Let me check our implementation and audit the login page.
Now let me compare the login pages.
Login differences are minor. Let me verify them via direct DOM comparison.
Live login has `md:pt-12 md:pb-10 md:px-10` padding variant (ours stops at `sm:p-10`) — minor gap. Let me check the profile page and grab our clone's mobile screenshots.
Minor profile finding — let me verify the Save Changes button color on live.
**S8-8**: Live profile "Save Changes" also computes `rgb(23,23,23)` dark. Let me check our clone's profile save button.
Profile is actually aligned (neutral-900 = rgb(23,23,23)). Now let me capture our clone's mobile behavior at multiple widths for the full audit.
Session was overwritten by the live auth state. Let me re-login to the clone and recapture.
Login succeeded (we're on `/`). Capturing mobile screenshots now.
Boundary correct at 700px. Let me verify the exact 767/768 boundary and sweep all clone routes at 390px for overflow.
All routes pass overflow checks. Let me verify a few remaining live details — the dashboard filter search placeholder and the accounts page empty-state toolbar at 390px.
Let me verify subtitle patterns and header buttons across our clone pages vs live.
Subtitles all match. Let me test if the live accounts view-switcher is functional, then compile the full remediation plan.
The live accounts view-switcher is dead too. One final detail — the leads Filters popover's Status/Source options on live.
Full popover vocabulary pinned (Source includes 5th option "Referral"). Let me check our UI kit for a Popover primitive.
Audit is nearly complete. Let me grab the Save View button's exact anatomy, then write the remediation plan.
Audit complete. Let me update my todos and write the comprehensive remediation plan.
Plan written. Now let me validate it against the codebase — checking e2e dependencies on the elements I'll change, and the exact contracts I'll modify.
No e2e dependencies on the elements being changed. Let me examine the page-layout contracts I'll modify.
`LOGIN_LAYOUT.inner` already has the md: variant — let me verify the login-card consumes it, then S8-8 may be a non-issue.
S8-8 is already implemented and pinned — I'll mark it verified-aligned in the plan. Now let me start **TDD Phase A** — reading the test file structure first.
Plan validated against the codebase (S8-8 already pinned). Now **TDD Phase A** — writing the failing tests first.
Now let me add the session-8 RED tests to the test file.
Imports updated. Now let me add the session-8 test block before the regression guards.
Now the Save View persist/restore seam test (red first).
Now let me confirm the RED state, then write the Phase B e2e regression test (also red).
**RED confirmed** (9 failing + missing module). Now the Phase B e2e resize regression test.
E2e regression in place. Now implementing to green — first the `lead-filters` pure seam.
Now the page-layout contracts — implementing the new records to green.
Let me make `allLayoutClasses` type-safe (some new values are arrays, not strings).
**Phase A GREEN: 133/133.** Now Phase B — the mobile-nav drawer fix.
Drawer fixed. Now Phase C — dashboard (S8-1 Export label + S8-2 view switcher). Let me view the dashboard's filter and Recent Deals sections.
Line 61 looks corrupted (`}, ydrated, fetchDashboard]` — missing bracket). Let me verify the actual file bytes.
This is the known ANSI display artifact (`[h` eaten as a cursor-home escape — session-6 documented it). Let me verify the real bytes with Python.
The file IS genuinely corrupted. Let me check whether typecheck catches it — this may be a latent bug the build somehow tolerated.
tsc passes?! Let me hex-dump that line to see what's really there.
The hex dump proves `[h` (5b 68) IS in the file — it's the known ANSI display artifact, file is valid. Now let me view the Recent Deals section and implement the dashboard changes.
Now implementing the dashboard changes — S8-1 (Export label) and S8-2 (view switcher replacing the misread owner filter).
Now adding the Cards view for Recent Deals when the switcher selects "Cards".
Lint clean. Now Phase D — accounts toolbar (S8-3). Let me view the accounts page structure and its mobile card list.
Now implementing the accounts toolbar (S8-3) with the three reference controls plus a functional Cards view.
Now adding the accounts Cards view — wrapping the table in a conditional.
Accounts clean. Now Phase E — leads page (S8-4 + S8-5). Let me view the current leads filter code fully.
Now implementing the leads page rewrite — state, filter logic, toolbar with popover.
Now replacing the toolbar UI with the new search + Filters popover. Let me view the current toolbar block.
Leads clean. Now Phase F (Log WhatsApp) and Phase G (settings add button).
Now Phase G — the settings add button (S8-7).
All phases implemented. Let me check the Button variants to make sure the whatsapp override renders correctly.
Button override will merge correctly (tailwind-merge gives className precedence). Now let me run the full unit suite and verify in the browser.
Dashboard verified. Let me test the view switcher functionality and the other pages.
Recent Deals correctly switched to cards. Let me verify the trigger label and test the accounts toolbar.
Accounts toolbar matches the reference order. Testing the Cards view and remaining pages.
Accounts Cards works; leads trigger + search anatomy correct. Now testing the Filters popover end-to-end.
Filter works (7 Won leads). Testing Save View persistence and Clear.
Popover is open with "Won" persisted. Clicking Save View now.
Save View restores across navigation. Testing Clear, then the remaining surfaces.
Clear works (24 rows). But Log WhatsApp's emerald bg didn't apply — let me inspect the actual classes.
The rendered classes are stale — the file edit may not have propagated. Let me check the source and restart the dev server.
Both buttons now match the reference pins (emerald-600 + neutral-900). All phases implemented and verified. Now running the **full gate**: build + e2e.
**FULL GATE GREEN: 22/22 e2e** — including the new S8-P1 resize regression. Now the breakpoint sweep DOM verification.
Breakpoints perfect. Now the drawer fix re-verification on the dev server.
**S8-P1 fix verified** — the previously-broken scenario now releases both locks. Running the full drawer regression + all-routes sweep.
All mobile checks green. Now the VLM spot-comparison on the restructured surfaces — recapturing clone screenshots.
VLM found real residuals. Let me verify each against the live DOM — the accounts switcher default label, Export CSV icon, header wrap, and sidebar active state.
Sidebar active + header heights are identical (VLM misreads). Two real fixes needed — accounts switcher default "Table" and text-only toolbar Export CSV.
The live toolbar Export CSV label is a bare text node (always visible). Let me match exactly.
**Real finding**: the reference has Filters on a separate row BELOW the search. Let me restructure.
Both toolbars now match the reference. Final VLM verification with fresh captures.
All remaining findings are data artifacts — structural parity achieved. Running the **final full gate**.
**FULL GATE GREEN** (lint 0/0 · tsc · 133/133 unit · build · 22/22 e2e). Now Phase M — refreshing the 12 deliverable screenshots.
All 12 screenshots captured. Quick sanity check, then docs realignment.
Screenshot verified. Now the docs realignment — first ticking the plan's execution record.
Now updating the four root docs (README, AGENTS, CLAUDE, PAD) with the new counts and session-8 facts.
Now updating the SKILL doc to v1.5.0 and checking its structure.
Now writing the session-8 log and appending to worklog.md.
Now the final commit. Let me check the working tree status and verify `.env.example` is tracked.
All green. Let me verify the db folder contents, then commit.
Committed on main. Now the SSH-wrapper push — let me read the runbook first.
Now setting up the SSH push infrastructure — checking for ssh binary and paramiko.
No ssh, no paramiko. Installing paramiko and deploying the shim per the runbook.
paramiko installed. Deploying the Appendix A shim with the venv shebang.
Key validates. Running the wrapper dry-run.
Dry-run clean (fast-forward `667bd3e..ef7e892`). Executing the real push.
**Push successful** — remote verified at `ef7e892`. Shredding the operator key per the runbook.
All done — tree clean, push verified, key shredded. Let me finalize the workspace worklog and close out the todos.
## Session 8 Complete ✅

**The headline find:** a real bug in our own mobile drawer — session-7's `lg→md` migration left the auto-close listener at 1024px, so resizing from 700→800px with the drawer open kept the app **scroll-locked** with the drawer invisible. Fixed via a shared `MOBILE_NAV_LAYOUT` contract + a new e2e resize regression (written red-first, reproduced the bug exactly).

Also closed 8 DOM-verified parity gaps: the dashboard's "All Owners" select was actually the reference's **dead Table/Cards view-switcher** (now functional), the leads Filters control was rebuilt as the reference's **w-80 popover** (with working Save View persistence), plus the Export label, accounts toolbar trio, emerald WhatsApp button, and dark settings buttons.

**Gate:** lint 0/0 · tsc · **133/133 unit** · build · **22/22 e2e** · verified at 6 breakpoints · pushed to `main` @ `ef7e892`.

**Suggested next:** resize the dev server between 700–800px to feel the drawer fix; if the reference's demo data ever returns, session 9 can audit data-populated states.
