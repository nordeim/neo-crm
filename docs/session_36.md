我将开始执行这项多阶段的 neo-crm 修复任务。让我先检查一下工作区状态。
The workspace persists from previous sessions (18, 19, 20 completed). Let me read the full worklog and refresh the repo.
Sessions 18-20 are complete and pushed. This is the next session in the series. Let me refresh the workspace with `git pull`.
The pull brought `docs/session_34.md` (120 lines — new session pointers). Let me review the session docs as instructed.
`docs/session_34.md` is the session-20 transcript (pushed as e1f808e). Now let me read `docs/session_33.md` and the session-20 plan.
Now the session-20 plan and repo worklog:
Session history internalized. Now let me verify the core docs' current state and the codebase.
Core docs confirmed at session-20 state (SKILL v1.17.0, 349 unit + 60 e2e). Let me verify the environment and run the baseline gate.
Environment intact. Now running the baseline gate (lint → typecheck → unit):
**Baseline gate green: lint 0/0 · tsc clean · 349/349 unit · dev server healthy on :3000.** Now let me check the scandihaven reference repo and skills catalogs:
技能已识别。现在让我加载 agent-browser 技能以进行实时审计：
Now let me start the **session-21 live audit**. First, login to the reference app:
Logged in. **Standing check 1: demo data on /Reports (17th session):**
Demo data still zero — **17th consecutive session**. **Standing check 2: reference mobile nav at 390px:**
Interesting — 8 visible links at 390px. Let me investigate whether the reference has CHANGED its mobile nav (this would be major drift):
**重大发现！** 参考应用现在在 390px 处拥有 8 个可见的导航链接 —— 在连续 16 次会话中没有移动端导航之后。让我分析一下这个新的移动导航结构：
The nav is inside `DIV.hidden md:flex` — my probe had a false positive (computed `visibility` stays `visible` inside `display:none` parents — the inverse of the documented §16l.3 hazard). Let me re-probe correctly:
Confirmed with correct probe: **reference still ships NO mobile nav at 390px (17th consecutive session)** — my first probe's false positive is a new census-method lesson (`visibility` doesn't test `display:none` ancestors; use `getClientRects().length`). 

Now **standing check 3: our clone's drawer 7-check regression:**
**Check 1 PASS** (trigger 36×36 at 16,16). **Check 2: open + links + focus + dual scroll locks** — using a real click:
**Check 2 PASS** (visible panel, 8 links, focus entry, dual body+main locks). **Check 3: Escape + lock release + real-click focus restore:**
**Check 3 PASS** (Escape → closed, focus restored to trigger, both locks released). **Check 4: focus-trap wrap both directions:**
**Check 4 PASS** (wrap both directions at panel boundary). **Check 5: resize-past-md auto-close + desktop sidebar swap:**
Locks released. Let me verify the panel is hidden at desktop width and find the sidebar:
**Check 5 PASS** (panel truly hidden at md, desktop sidebar 8 links @256px, locks released). **Check 6: route-change close:**
The text finder hit a covered dashboard element. Let me use a scoped snapshot to click the drawer's Leads link:
**Check 6 PASS** (route → /leads, panel hidden, locks released, h1 "Leads"). **Check 7: 390px overflow sweep on all 11 routes:**
**All 7 drawer checks PASS (7/7), zero overflow on 11 routes.** Now the **drawer v4-hazard internals sweep:**
`hiddenAttrs: 2` — previous sessions pinned **zero**. Investigating this potential drift:
Hidden div is a benign 0×0 React portal placeholder; drawer internals **CLEAN**. Now the **standing metadata + HTTP header census (curl-SSR)**:
**All standing layers verified — NO DRIFT** (metadata census, security headers, robots/sitemap/manifest bytes). 

Now the **session-21 NEW audit layer**. Per session_33.md pointers, the unprobed candidates: color-contrast (WCAG 1.4.3), focus-visible rings, ARIA properties, 500 error page. Starting with the **color-contrast census** on both apps:
Reference has its own WCAG failures (green deltas 3.3, "Won" 2.54, active-nav 4.32). Now the identical census on **our clone**:
Census diff found. Key divergence: the reference's **active nav item** sits on `rgb(59,115,237)` (4.32) while ours is on `rgb(37,99,235)` (5.17). Let me verify directly on both:
Reference active nav: `bg-white/10` overlay. Now ours:
Both use `bg-white/10` — ours serializes as `oklab(...)` (Tailwind v4), visually identical; my census parser only matched `rgb()/rgba()` so it mis-blended (census-method lesson #2: handle oklab computed values). 

Now the real diffs: the reference's **green deltas** (3.3) vs our absent deltas, and our **SC/LF avatar initials**. Probing both:
Delta colors are at parity (both green-600; ours serializes in lab). The text difference (+5.3% vs -100%) is data-driven — the reference's static template values vs our computed deltas. Now the **avatar-initials diff** — our SC/LF at 3.68/3.77 vs the reference's absence:
Our clone has avatar-initial chips (data-driven); the reference has zero (data-gated). Let me check our avatar palette source and where the reference documents its avatar colors:
Avatar palette is seed-pinned (documented parity). Now the contrast census on **data-free surfaces where both apps render identically** — /login and /settings:
The clone redirected to / (still authenticated). Clearing cookies and re-running on the real login page:
`total: 1` suggests the census ran mid-transition. Let me re-probe the settled login page directly:
Login verdict: clean on both — the "failure" was my parser's `lab()` blindness again (v4 computes colors in lab/oklab; census-method lesson confirmed twice). 

**Color-contrast census: PARITY** (dashboard failure sets match modulo data-gating; login clean on both). Now the **focus-visible-ring parity census**:
Plain `.focus()` doesn't trigger `:focus-visible`. Probing with real keyboard Tab on both apps:
**关键发现** — 元素匹配 `:focus-visible` 但没有渲染任何圆环效果（轮廓为 none，box-shadow 透明）。这看起来像是一个 **Tailwind v4 ring bug**。让我深入排查 CSS：
The ring variables ARE set — my earlier read truncated the box-shadow at 90 chars. Reading the full computed value:
Ring IS rendering (oklab white/50 0 0 0 2px — my truncation cut it). Now the **reference's focus-visible behavior**:
Reference shows UA-default `outline: 1px auto` — ours is the documented a11y superset (2px ring). **Focus-visible: functional parity.** Now the final unprobed media-query layers — **reduced-motion + color-scheme census**:
Both ship reduced-motion rules (2 vs 1); we additionally ship color-scheme + forced-colors rules. Comparing content:
A real diff: the reference's reduced-motion rule targets **only sonner toasts**; ours is a **global animation kill-switch**. Checking our globals.css source and documentation:
Custom toast (no sonner) — our global guard covers it. The media-query layers resolve to documented superset/inert. 

New actionable candidate: **the login error-state + toast surface** (never compared, no data needed). Testing wrong credentials on the reference first:
Reference shows an `role=alert` toast "Invalid email or password". Capturing its full anatomy:
Reference toast anatomy captured (red-50/70% bg, red-200 border, red-700 text-sm, 12px radius, sonner chrome). Now the same flow on **our clone**:
**Two findings**: text drift ("Invalid" vs "Incorrect") and our clone fires TWO toasts vs the reference's ONE. Capturing our toast structure:
The role=status toast dismissed; the alert remains. Let me examine our toast source and login-card error flow to understand the double-fire and styling drift:
Our clone double-renders (inline alert + toast) with different styling. Let me check what the session history pinned about toasts:
**ZERO prior sessions compared the login error state** — this is a genuinely new actionable layer! Let me measure our toast while still visible (it auto-dismisses at 4s):
Full picture captured. Let me re-verify the reference's toast position + duration behavior (settled, not mid-animation):
Toast dismissed by 2.5s — measuring at finer intervals to pin position + duration:
Position pinned (centered-x, 170px from bottom). The duration is inconsistent — let me measure precisely:
Persists >15s — persistent toast. Probing the container, hover state, and stacking:
**Major revision** — the reference's error surface is an **inline banner** (container = the login form's `space-y-4 sm:space-y-5`), NOT a toast, and **zero sonner toasts fire**. Let me pin the banner's DOM position in both forms:
The reference's banner is a shadcn-Callout pattern (`border p-4 [&>svg]...` + `bg-red-50/70 border-red-200 rounded-xl`) positioned **between the fields and the buttons**. Now triggering ours to compare DOM position:
Banner position parity confirmed (both idx 1). Now testing the reference's **signup error** (duplicate email) — checking whether the Callout renders an icon there:
**MAJOR FINDING** — the reference's `/signup` returns a **404** ("Page not found")! Let me check what the reference's sign-up button does, and what our clone ships:
The reference swaps the login card **in-place** to a signup view ("Back to sign in / Create your account") at `/login` — while `/signup` 404s! Let me check our clone's structure:
The s10 pin called the reference's sign-up button "dead" — **today's live probe disproves that**: it swaps to an in-place signup view. Let me see our card's signup mode and the sitemap:
Our signup mode has a Name field; the reference's has Email/Password/Confirm Password only. Capturing the reference's in-place signup view in full:
Same slate palette across both reference views. Checking our clone's login palette for comparison:
Palette at parity (same colors, v4 lab serialization). Now testing the reference's **signup view submit behavior** — validation errors and success flow:
"Passwords do not match" → same Callout banner, zero toasts. Now the existing-email error case:
No banner, stays at /login. Monitoring network + toasts on re-submit:
Existing-email error: "A user with this email already exists". Checking our clone's signup error contract:
发现更多文本偏差（“An account” 与 “A user”）。现在通过全新的邮箱测试参考应用的注册**成功**流程：
**Yet another view discovered**: signup success → **"Verify your email"** with a 6-digit code flow! Capturing its full structure:
Six separate 40×44 code inputs. Testing the wrong-code error state:
Wrong code → "Invalid verification code. 4 attempts remaining." Capturing the remaining visual details + Resend behavior:
验证视图已完全映射。进行最后一项探测——参考应用在登录**成功**时是否会触发 toast 提示？
Login success: **zero toasts** — just redirect. Our success/error toasts are both inventions. Two more quick probes: the reference's Google button behavior, and the verification attempts ladder:
The reference's Google button does a real OAuth redirect (our toast fallback stays — documented). Now pinning the verification attempts ladder with a fresh throwaway:
完整阶梯已固定，包含锁定消息。最后一个细节——`icon tile` 的完整 `class`：
Audit layer complete. Let me review the full login-card source before writing the plan:
s11 reset 层已经固定了精确的 Callout 词汇（绿色变体）——我的红色错误变体遵循相同的模式。让我看看卡片中的视图渲染：
One more probe — the code-input classes and verify-view text structure:
所有合约详情已锁定。**审计已完成** —— 正在编写 session-21 的整改计划：
Plan written. Now **validating it against the codebase** before execution:
验证见解：e2e 通过实际 UI 进行认证——必须保留现有的 seeded 登录。再进行一次关键探测：在 reference 上**登录一个未验证的账号**（以固定该行为）：
未验证登录已固定："Please verify your email before logging in. Check your email for the verification code." 在 `signin` 上有横幅。最终的探针 —— 注册视图的容器/表单/`h2` 类名：
Signup view structure pinned. Checking the signup form's inner field structure:
Button family confirmed (same as s11's send). **Phase A — RED tests.** Checking the established source-pin pattern first:
Now confirming the **RED state** before any implementation:
RED confirmed at import level. Making it granular with dynamic seam imports (the s18 pattern):
**Granular RED confirmed: 27 failed / 4 passing.** Now **Phase B — implementation**. Starting with the verification lib:
Signatures confirmed (and tests/auth.test.ts already proves `@/lib/auth` imports cleanly under vitest). Now extending the view machine:
Now checking our stock Input component to align the input vocabulary:
The signup inputs showed radius 12px + slate-200 — the reset-input family, not the stock. Probing the full classes while the view is still up:
The signup inputs = the s11 resetInput family + signup placeholders. Checking our LOGIN_LAYOUT input for reference:
Field wrapper = our exact LOGIN_LAYOUT.field pattern. Fixing the signup input vocabulary to the DOM-verified family:
Now the **login route** (S21-P1 + unverified guard):
现在是 **signup 路由**（S21-P6 + 验证机制）：
Now the **verify + resend routes**:
Now the **Prisma schema** — the verification columns:
Schema synced. Now the **login-card rework** — reading the full current file:
Before the card rework, capturing the **resend banner's colors** (missing detail) with a fresh throwaway signup:
重新发送信息横幅 = **绿色 Callout**（green-50/70 + green-200）。正在检查其自动消失时机：
消失介于 1.6秒和 3.2秒之间。再来一次精确探测，以确定计时器：
Banner gone (timer ~3s confirmed within bounds). One last structural probe — the verify-form banner slot:
Structure fully pinned. Adding the final vocabulary pieces (info Callout + buttons group):
The card is a client component — `verification.ts` must not drag server-only imports (`next/headers` via auth). Splitting pure from server parts:
Now the **full login-card rework** — the core of S21-P2/P3/P4/P5:
Updating the Callout test to match the shared-component structure:
The existing e2e "Incorrect email" check must flip to the new message. Checking global-setup first (the e2e DB schema):
Schema flows to e2e.db automatically. Now updating the e2e spec — flipping the message + adding session-21 tests:
现在运行新的单元测试套件以查看当前状态：
30/31 — one test needs its source-pin re-scoped (the literal lives in verification.ts):
Auth suites green + tsc clean. Full unit gate now:
**380/380 unit green.** Restarting the dev server (schema + Prisma client changed) and live-verifying the flows:
后备消息已渲染 —— 正在直接调试 API 响应：
列缺失 —— 正在检查哪个 DB 文件实际接收了推送：
Columns exist in custom.db but the server can't see them — checking the db path normalization seam:
**Root cause found** — the documented BUN ABSOLUTIZATION hazard: my `db push` wrote to the OUTER `/home/z/my-project/db/custom.db` while the runtime (correctly normalized) reads `<repo>/db/custom.db`. Checking the established db scripts:
The established `db:push` wrapper normalizes the env. Running it properly + cleaning the stray outer db:
API returns "Invalid email or password" ✓. Now the full live flow verification in the browser:
**S21-P1/P2/P3 已验证** — Callout 的 text/bg/border/padding/inner-color 均已正常，zero toasts。现在是 signup view 的替换：
**S21-P4 verified** (in-place swap, minimal form, no Google/divider). Now the mismatch + fresh signup → verify:
Verify view works, but the code inputs render 56px (the `w-full` + `w-10` conflict resolved differently than the reference's 40px). Fixing:
还需要 `md:text-sm`（参考实现在桌面端渲染为 14px）：
**Code inputs at exact parity** (40×44, 14px, center, 600). Now the ladder + resend live:
Full ladder + green resend Callout + auto-dismiss verified. Testing the **happy path** with the server-logged code:
**Happy path verified** (code → session → dashboard, zero toasts). Checking the /signup page, then running the full gate:
/signup 页面已验证。现在是 **完整门禁** — lint → typecheck → unit → build：
Build clean. Closing browser sessions (the documented pthread hazard), then the e2e gate:
5 failures — strict-mode violations. Checking the error context to see the actual DOM:
The second alert is Next's `__next_route_announcer__` (always present). Fixing the e2e selectors:
Re-running the e2e (auth spec first for a fast check):
All auth tests green. Full e2e gate now:
**FULL GATE GREEN: lint 0/0 · tsc · 380/380 unit · build · 64/64 e2e** (mobile-nav 7/7 included). Standing-layers spot-check on the dev server:
All standing layers hold post-change. **Phase D — deliverables.** Checking the established screenshot script:
Writing the session-21 capture script (20 established + 3 new auth-flow shots):
All 23 shots verified. Checking for duplicates + timestamps:
Zero duplicates, fresh timestamps. Now **.env / .env.example verification**:
No env changes needed. Now **docs realignment** — starting with README:
README done. Now **AGENTS.md** — counts + session-21 contract block:
Now appending the session-21 contract block after the s20 block:
AGENTS.md 已完成。接下来是 **CLAUDE.md**：
CLAUDE.md 已完成。接下来是 **PAD**：
Adding the PAD §7.2 session-21 pattern note:
PAD done. Now **SKILL.md v1.18.0** — §16m + frontmatter:
Fixing a typo + updating the SKILL frontmatter:
将 session-21 添加到 project_state 行：
Also fixing the stale §8 contrast claim the census disproved:
SKILL 已完成。现在正在写入 **docs/session_35.md**（完成日志）：
现在是 **plan addendum** + repo 工作日志：
文档已重新对齐。**最终变更集审查**：
清理变更集（27 个文件，无敏感信息）。最终准许健全性检查 + 提交：
Commit `a496713` on main. Now the **SSH push** — re-reading the runbook:
已确认 shim。正在写入部署密钥（根据 0600 协议，存放在仓库外）：
Dry-run clean (fast-forward e1f808e..a496713). **Real push:**
**Push verified** — remote main @ a496713 == local HEAD. Shredding the key:
Key shredded. Now the **worklog push-record commit** (the established two-commit pattern):
Both commits pushed and verified. Final step — the **outer workspace worklog**:
**Session 21 complete and pushed to main.**

**Audit** — All standing layers held (17th session: reference still ships no mobile nav; our drawer passed 7/7; metadata + security headers intact). The new sweep of the **login-card funnel** found six live-verified gaps — including two entire reference views we never shipped: the **in-place signup view** (the old "dead button" pin disproven) and the **verify-email view** with its 6-digit code ladder. Contrast/focus-visible/@media censuses verified at parity.

**Fixed (TDD)** — Exact auth strings, toastless flows, the Callout banner contract, the full signup→verify funnel with server-logged codes. Gate: 380 unit · 64 e2e green · 23 screenshots · SKILL v1.18.0.

**Next**: keep watching the reference's `/Reports` for its data-bearing instance (would unlock edit dialogs), or sweep ARIA properties / the 500 page / keyboard shortcuts next session.
