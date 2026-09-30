The workspace exists. Let me check the git state and refresh from remote.
Workspace is on `main` with a clean tree at commit `b2da6bd` (session-13 parity work already committed). Let me pull to refresh and check for session 19/20 docs.
The pull brought in `docs/session_20.md` — the current session's task book. Let me read the key documents.
`docs/session_20.md` 记录了上一个已完成的会话（session-13 的修复已推送为 `b2da6bd`）。当前会话是**下一个对齐迭代**。让我查阅其余所需的文档。
Now the session-13 plan and the worklog:
Session-13 is fully complete and pushed. This session is the **next parity iteration** (session-14 work under the 19th/20th task-book). Let me review the core docs' current state.
Now let me quickly review CLAUDE.md, README.md, PAD, and SKILL.md current state:
All docs are aligned at session-13 state (v1.10.0, 244 unit + 31 e2e). Now validating the environment against the codebase:
Environment verified. Running the baseline gate (lint → typecheck → unit):
Baseline gate green: lint 0/0 · tsc clean · 244/244 unit. Starting the dev server and checking browser tooling:
Dev server healthy on :3000, db up. Let me refresh the relevant skills from the catalog (Tailwind v4, clone-app-pat-pro, agent-browser, tdd):
Skills catalog refreshed. Now let me update the todo list and begin the live-reference audit for this new parity iteration (session-14).
Let me start the live-reference audit. First, log in to the reference site:
Logged in. First check per standing pointers: **has the demo data returned?** (10th consecutive session check):
**Demo data still zero — 10th consecutive session.** Parity remains structural. Now re-probing previously-pinned families for drift (the reference is a moving target). Starting with the dashboard KPI family (which moved in s12):
Dashboard pins all hold (#0a0a0a/16px, dashed grids, 6px buttons, CardTitle map). Checking KPI card structure:
KPI family fully stable vs session-13 pins. Now checking the account menu (was rebuilt in s13):
Account menu matches s13 pins exactly. Now sweeping all remaining pages for drift:
Accounts/contacts/leads/calendar all match pins. Checking calendar day cells (s13-P7) then the remaining pages:
Calendar cells match s13 pins exactly. Continuing with activities, reports, settings, profile:
All pages match session-13 pins — **the reference has NOT moved this session**. Now probing the unprobed layers. First: settings picklist surfaces (deep-interactive layer):
Reference picklist anatomy captured — note the **"Add new industrie" typo quirk** (missing 's'). Now comparing our clone's settings:
Our clone shows populated chips (seeded data — documented superset vs reference's zero data). Key comparable: the **empty state**. Let me check our source:
发现一个 class diff：我们的 empty 使用了 `text-muted`，而参考项目的 empty 使用的是 `text-gray-500`。让我验证一下计算出的值和添加按钮的颜色：
Computed-equal (#6b7280 both sides — our `text-muted` = reference `text-gray-500`). Now testing the reference's picklist **add flow** behavior (unprobed interactive layer):
The reference's picklist add flow is **dead** (button + Enter both no-op, no toast) — ours is the documented functional superset. Now checking the `/Profile` vs `/profile` casing pointer:
Real routing gap found. Checking what the reference's account menu links to:
Reference menu: Profile = `<a href="/Profile">`, Logout = `<div>`. Checking ours:
我们的菜单在功能上是对等的（已被 `e2e` 锁定）；真正需要修复的是 `/Profile` 路由 404 的问题。现在进行键盘焦点顺序检测（`a11y` 层）：
Focus order matches. One diff to verify — the search placeholder:
Both "Search Anything..." (our aria-label is the a11y superset). Now testing the reference's profile **Save Changes** toast behavior (never probed):
Reference save is silent (dead — ours is the functional superset). Now re-verifying the reference's mobile layer at 390px (standing check):
Reference still has no mobile nav (defect confirmed). Now running **our clone's mobile-nav regression** at 390px (standing priority):
Unexpected — drawer links present but not visible/locked. Probing the actual drawer state:
我的轮询逻辑存在缺陷（在 `frame-capture` 之前就结束了）。正在进行带有适当探测的分步重做：
Something's off — let me carefully enumerate all dialog elements before/after a clean burger click:
Only one dialog exists. Let me read the mobile-nav source to understand the open/close render mechanics:
我的正则表达式匹配到了抽屉的覆盖关闭按钮（标签始终为 "Close navigation menu"），而不是 header 触发器。抽屉本身没有问题 —— 现在重新进行回归测试，并带有适当的触发器作用域限制：
Drawer opens with dual locks. Verifying exactly where focus landed:
Focus correctly landed on the in-panel close button (inside the dialog — s12 fix works; my `nav` scope was too narrow). Continuing: Escape + restore + focus-trap:
Focus-trap wraps correctly. Testing route-change close + resize auto-close:
**Mobile-nav regression: 7/7 PASS live** (open, focus entry, dual locks, Escape, trap wrap, resize auto-close, route close). Now the 390px overflow sweep on all routes:
All 10 routes clean at 390px. Now checking the settings tab structure (3 tabs — the other two tabs' content may be under-probed):
Tab switched (needed full pointer events). Dumping the Defaults + Data tab anatomy:
Now comparing our clone's Defaults + Data tabs:
Structural diffs found in Defaults tab. Getting precise computed spacings on both:
**Real findings in Defaults tab** — ours is a 3-column grid, reference is single-column. Let me capture both visually and dump our Data tab:
多个实际发现。正在检查我们的 Default Groups 5-6 控件以及具有破坏性的按钮颜色：
Destructive = #ef4444 both (fg differs slightly: ref #fafafa vs ours #fff). Quick drift spot-check on reports tabs + our settings tablist:
Reports tabs stable. Quick signup page check (last unprobed surface):
The reference's `/signup` now renders a **404**! Checking logged-out behavior on both:
Reference `/signup` SSR title = "Signup | NEO CRM" but renders 404 **when logged in**. Checking the logged-out view (logging out, then back in):
Reference logged out → "Hi, Guest", and `/signup` 404s. Checking if the reference's login page still links to signup:
**Major drift found** — the reference removed the signup link from login! Dumping the full login anatomy:
"Sign up" text DOES exist. Finding its element:
Reference signup button is **dead** and /signup 404s — the platform removed the signup flow (ours stays the documented functional superset). Comparing our login page for other drift:
Still logged in on the clone. Logging out first:
Our login matches — but the "Need an account? Sign up" button is missing from the dump. Verifying:
**Real finding**: reference login has "Need an account? Sign up" — ours doesn't. Checking our source:
我们的卡片中确实有链接（是一个 `<a>`，而不是按钮 —— 我的探针之前只搜索了按钮）。正在对比底部的结构：
Login footer aligned (same utility set). Final checks before writing the plan — our Data tab buttons + settings header:
We got logged out of the clone earlier. Logging back in:
Settings h1 aligned. More button diffs found (size + w-full sm:w-auto + icon). Checking the page subtitles then writing the plan:
Subtitles computed-equal. One last check — our Defaults select triggers:
`w-full` missing on our select triggers too. The audit is complete — writing the session-14 remediation plan now:
Let me verify the reference's Danger Zone card details (border, description, layout):
Checking whether our `bg-line-soft` (#f3f4f6) matches the reference's tab-track `bg-muted`:
Found a subtle token-level diff (our `line-soft` #f3f4f6 vs reference `muted/accent` #f5f5f5). Checking where our accent token and line-soft are used:
Checking whether `line-soft` #f3f4f6 was ever live-pinned or just an early assumption:
`line-soft` dates from the scaffold (never live-pinned). Enumerating all usages to confirm the re-pin is safe:
Verifying the Defaults SelectTrigger `w-full` (probe was truncated):
Audit complete. Writing the session-14 remediation plan:
Plan written. Now validating it against the codebase before execution:
Plan validated against the codebase. Starting **Phase A — red tests first**:
Now appending the session-14 red tests to page-layout.test.ts:
Now the design-tokens re-pin and the new profile-route test:
Now the e2e red additions for the settings structure + /Profile redirect:
Now confirming the red state (Phase A):
**RED confirmed: 16 failing tests.** Starting **Phase B — implementation**. First the token re-pin + contracts:
Now the contract groups in page-layout.ts (after SETTINGS_PICKLIST):
Registering the new groups in the aggregator:
Now the settings-page implementation — DefaultsEditor, Data tab, and Danger Zone:
Now the DefaultsEditor rebuild:
Now the `/Profile` redirect in next.config.ts:
Running the unit suite to check the green state:
Test regex mismatch — the source says `async function redirects()`. Fixing the test:
Unit GREEN 260/260. Fixing the two e2e type errors (boundingBox returns a Promise here):
Typecheck clean · 260/260 unit. Building via the package script (never bare `next build`) and running e2e:
33/34 e2e — only the new `/Profile` redirect test failed. Investigating:
URL stayed at `/Profile` — the redirect didn't fire. Checking the routes manifest:
Found it — `redirects()` must be a **property of the config object**, not a separate export. Fixing:
Updating the test to pin the correct shape (property of the config object):
Redirect now in the manifest (307). Re-running the full e2e suite:
**Redirect loop** — Next.js redirects are case-insensitive by default, so `/profile` also matches. Adding `caseSensitive: true`:
`caseSensitive` isn't a valid per-redirect property in Next 16. Pivoting to the cleaner approach — a thin top-level alias route folder (case-exact by filesystem), dropping the config redirect entirely:
Rewriting the profile-route test for the alias-page approach:
261/261 unit · build has `/Profile`. Full e2e suite:
The URL redirect works — but "Personal Information" is a CardTitle **div**, not a heading. Checking how the existing profile test locates it:
**E2E GREEN: 34/34** (+3 new). Now Phase C live re-verification — restarting the dev server:
`/Profile` → 307 → `/profile` ✓. Logging in and verifying the settings tabs live:
Structure matches but the label gap reads 3px (reference was 12px). Measuring precisely on both apps with the same probe:
**New Tailwind v4 bug pattern discovered**: the reference (v3-era) `space-y-2` puts margin-TOP on the input; our v4 flips it to margin-BOTTOM on the INLINE label — which **no-ops** (inline vertical margins don't apply). The label gap collapses. Fix: explicit `mt-2` on the controls. Checking the Danger Zone group too:
Confirmed same pattern in Danger Zone. Applying the `mt-2` fix + updating contracts:
Now applying `mt-2` to the controls in settings-page.tsx:
Adding the controlMt unit pins:
262/262 green. Live-verifying the computed label gap on the dev server:
11px vs 12px — 1px subpixel rounding (label rect 17 vs 16). Measuring the layout-determined top-to-top distance on both:
**Layout identical: 28px both** (the 1px was inline-rect font rounding). Verifying the Data tab + Danger Zone live:
All Data tab + Danger Zone fixes verified live. Now the 390px overflow sweep:
All routes clean. Now VLM comparison rounds on the touched surfaces — capturing both apps' settings tabs at 1512:
VLM output references non-existent elements ("General Settings", "Notify Owner") — hallucinated. Re-running with a grounded prompt that forces quoting actual text:
Defaults tab: VLM says **ALIGNED**. Now the Data tab round:
The VLM admitted it cannot see the images (unusable round). DOM verification is the ground truth here. One more attempt with a simpler prompt:
**VLM rounds complete: ALIGNED / SAME** (two earlier rounds were hallucinated — documented; DOM carries the evidence). Phase C done. Now Phase D — refreshing the 13 screenshots:
The login shot needs a logged-out state (we're logged in — /login would redirect). Verifying and re-capturing properly:
All 13 screenshots refreshed. Quick VLM sanity check on the new captures:
抽屉状态正常。现在进行文档对齐——首先获取确切的测试数量：
262 单元 / 34 e2e = 共 296 项。正在更新 README：
Now AGENTS.md — counts, the session-14 contract blocks, and the new v4 hazard:
Now CLAUDE.md and PAD:
Now the PAD session-14 notes section (after the session-13 notes):
Now the SKILL.md bump to v1.11.0 with §16f:
TOC doesn't list 16b-16e individually (consistent). Checking SKILL's remaining count references:
The SKILL color table is stale from older sessions (foreground/line pre-s13 pins). Fixing it:
Now writing the session completion log `docs/session_21.md`:
Now the plan addendum with the execution record:
Now updating the repo worklog:
Final sanity gate before commit:
只有 4 张截图有字节差异（未更改的页面渲染效果一致——正常）。正在更新 agent-side 工作日志，然后进行 commit：
Committed `5ee8006` on main. Now the SSH-wrapper push — checking the runbook and shim:
The wrapper defaulted to the wrong remote (task-management). Passing the explicit `--remote`:
Dry-run clean (`08ed611..5ee8006` fast-forward). Executing the real push:
Pushed and verified — remote main @ `5ee8006` == local HEAD, tree clean. Shredding the key file:
Appending the final push record to the worklog:
The session-14 parity iteration is complete and pushed. Here's what happened this session:

**Audit** — Re-probed every previously-pinned family first (the reference did NOT move, demo data still zero for the 10th session), then went after the never-compared **settings Defaults/Data tabs** — finding real structural gaps: a 3-column grid vs the reference's single column, "Templates" vs "Import Templates", wrong button family, and a Danger Zone missing its tint/icon/stacked layout. Also: `/Profile` 404s and a scaffold-era `line-soft` token (#f3f4f6 vs the reference's #f5f5f5).

**Two hard-won root causes** (both e2e/gate-caught before shipping): Next config redirects match case-insensitively → the `/Profile` redirect looped (fixed with a thin route-folder alias); and a **new Tailwind v4 hazard** — v4's space-y flip puts margin on inline `<label>`s where it silently no-ops, collapsing label gaps (fixed with explicit `mt-2`, 28px geometry on both apps).

**Delivered**: 262/262 unit · 34/34 e2e · mobile-nav 7/7 live · zero 390px overflow on 11 routes · 13 screenshots · docs realigned (SKILL v1.11.0) · committed `5ee8006` and pushed to main, remote verified, key shredded.

**Next steps**: (1) The reference removed its signup flow this session — worth watching whether more auth-surface changes land; (2) if its demo data ever returns, every data-driven surface becomes comparable — the highest-value re-audit moment; (3) remaining unprobed layers are listed in `docs/session_21.md`.
