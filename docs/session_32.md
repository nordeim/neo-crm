I'll start by checking the current workspace state and refreshing the neo-crm repository.
The workspace exists with both repos. Let me check the git status and read the worklog to understand prior work.
工作区来自第 18 次会话（已推送到 main 分支，提交哈希为 fe78bd5 + 153c131）。当前任务是下一次迭代会话。让我制定计划并拉取最新更改。
The pull brought in `docs/session_30.md` (new commit 58b82e4). Now let me review the core documentation files.
`session_29.md` is the session-18 completion log; `session_30.md` is the operator's transcript of session 18. This session is **session 19**. Now let me review the core docs.
Let me read the files in manageable chunks directly.
Now let me read CLAUDE.md and README.md.
现在来看一下 `Project_Architecture_Document` 和 `SKILL` 文件——让我先看看关键部分（顶部状态 + 最新增补内容）。
Let me read the session-18 plan, worklog, and the SKILL §16j layer.
I have the full picture now. This is **session 19** — the workspace survived from session 18 (no reset). Let me validate the codebase state and run the baseline gate.
Environment intact. Running the baseline gate now.
Baseline gate green: lint 0/0 · tsc clean · 326/326 unit. Now let me start the dev server and check for stale processes.
Dev server healthy on :3000 (running since session 18, only docs changed since). Let me verify the DB state and locate the agent-browser tool for the live audit.
`agent-browser` 工具已准备就绪。现在让我开始实时审计——首先登录到参考应用。
Logged in. First standing check: demo data on /Reports (15th session check).
Demo data still zero — 15th consecutive session. Now the standing mobile-nav check on the reference at 390px.
Reference still ships NO mobile nav at 390px — 15th consecutive session. Now verifying OUR clone's drawer (7-check regression).
The query matched an overlay, not the burger. Let me check the actual trigger markup.
The drawer is open from my earlier click. Let me close it and re-run the 7-check regression properly.
Checks 1-2 pass (trigger 36×36, 8 links, dual locks, focus entry). Now check 3: Escape + lock release + focus restore.
Mixed result — locks released but drawer state query unclear. Let me inspect the actual drawer element.
The drawer is closed (visibility:hidden) with locks released — but my click sequence was flawed (the trigger was covered by the open overlay). Let me redo check 3 with the correct sequence.
Check 3 PASS. Now check 4: focus-trap wrap.
Shift+Tab didn't wrap — focus landed on something outside the dialog. Let me identify that element.
Focus fell to BODY — need to understand the trap implementation before judging. Let me read mobile-nav.tsx.
The trap implementation looks correct (wraps on panel-first/panel-last). My eval-based test may have hit the known eval-focus artifact. Let me check the app-shell for inert handling and how the e2e pins this.
The e2e pins 7 checks; the trap wrap was verified live in s18. Let me redo the Shift+Tab wrap correctly — focusing the PANEL's first focusable (the trap's actual `first`), not the overlay.
Check 4 PASS — trap wraps both directions (my earlier "failure" focused the overlay, which is unreachable in natural keyboard flow). Now checks 5-6: resize auto-close + route-change close.
Checks 5-6 PASS. Now check 7: the 390px overflow sweep on all 11 routes.
All drawer checks 7/7 PASS. Now the drawer v4-hazard internals sweep.
Drawer internals healthy. Now the standing metadata layer re-probe (HTTP head census on both apps).
Metadata standing layer: NO drift. Let me confirm no app-code changed since session 18's verification, then spot-check icons.
No app-code drift since session 18 — all pinned families hold. Now the NEW audit layer for session 19: **form input micro-contracts** (autocomplete/types/maxLength — never swept in 18 sessions, reachable at zero data). Starting with the login forms on both apps.
The reference ships a web app manifest (`link[rel=manifest]`)! Let me fetch it and compare with our clone.
The curl returned empty — let me fetch the manifest via the browser session.
**Finding S19-P1: the reference ships a web app manifest** (name/short_name/description/icons 192+512/start_url/standalone/theme #000000/bg #ffffff) — ours ships neither the file nor the link. Let me check the reference's theme-color meta and our clone's login form.
Major findings emerging. Let me check the reference's apple-touch-icon href, then our clone's login card structure (empty form query is suspicious).
The clone redirected /login → dashboard (still authenticated). Let me log out and examine the real login card.
Our login HAS a form + autocomplete attrs (reference has none). Let me compare placeholders and check whether our autocomplete attrs were a documented deliberate superset.
Placeholders match. But our DOM shows autocomplete attrs while `rg` finds none in src/ — let me find where they come from.
Our autoComplete attrs are a deliberate superset (documented pattern). Now the bigger unprobed surface: **create-dialog input attribute contracts** on both apps. Starting with the reference's New Lead dialog.
The dashboard Add buttons are list adds. Let me open the New Lead dialog from the Leads page.
Reference Lead dialog: Phone = plain `text`, Estimated Value = `number`, no placeholders/maxLength. Now our clone's dialog.
Dialog is open — my selector was wrong. Let me query it directly.
Lead dialog at full parity. Now the other dialogs — reference Account/Contact/Event/Activity input types.
Capital-A route quirk (documented). Page reloaded now — retrying the Account dialog probe.
The reference's capital-A /Accounts now 404s! Let me probe both casings via HTTP — this affects the sitemap-locs story from s18.
HTTP says 200 for both — but the browser rendered the 404 view. Let me check raw status codes without redirect-following.
curl 000s without -L (platform quirk). Let me check the reference's actual sidebar link hrefs — this determines whether capitalized routes are its real paths.
Sidebar links are all capitalized — the canonical routes. My pushstate likely didn't trigger the platform router. Let me click the real sidebar link.
Confirmed — capitalized routes work via real navigation (my pushstate was the artifact). Now the Account dialog census.
More is dead (documented pattern). The Activity dialog likely opens from the dashboard's Upcoming Activities "Add". Let me check.
已捕获参考对话活动。现在让我对比源文件中我们全部五个对话的输入类型。
Let me map each dialog's fields precisely from source.
**Finding: our Contact Phone is text; the reference's is `tel`.** Also our inputs carry `list=` datalists — let me check if the reference ships those.
More findings. Let me complete the reference's full PWA meta census (all apple-* metas).
The reference also ships `mobile-web-app-capable`, apple status-bar-style, and a **canonical link**. Let me diff our clone's complete head.
Let me verify our Event/Activity dialog field types and check where our theme-color comes from.
Event/Activity match. Let me get the reference's remaining PWA meta contents + icon link attributes.
The icon type says svg+xml but href is .png, and apple-touch-icon vanished on root vs login — let me re-probe carefully on both routes.
apple-touch-icon appears only on the reference's /login (platform quirk). Let me verify theme-color + manifest on both routes.
Let me confirm the reference's canonical pattern on an inner page.
The canonical may be stale SPA state — let me do a full page load of /Accounts.
Title/canonical confirmed per-route. One more check: the reference's og:url per-route (ours is set once in root layout).
**Major finding: the reference's OG/Twitter metas are PER-ROUTE** — og:title "Accounts | NEO CRM", og:url per page, and og:description carries a page-specific prefix. Ours is root-static everywhere. Let me map the description prefix pattern across routes.
Let me complete the pattern: /Dashboard, /Calendar, /Activities.
Full route map captured. Now let me examine our current metadata implementation (root layout + page wrappers).
让我验证一下 `og:image` 的变体（根页面 vs 内页），然后确认发现。
The og:image is static across routes. One final probe: inner-page twitter:description prefix pattern.
Audit complete. Now let me review the existing test structures to plan the TDD pins correctly.
Let me check the dashboard and signup page metadata exports, then write the plan.
I have the complete picture. The dashboard inherits root metadata (correct as-is); the 8 wrappers need per-route metadata. Now writing the session-19 remediation plan.
Plan written. Now validating against the codebase — first the icon generator script from s18.
Now let me check the page-titles test pins before designing the factory.
Let me check the reference's manifest content-type + our s18 route-handler pattern.
Now let me check the s15 dialog e2e pattern for reuse in the tel-input test.
I have all the patterns. **Phase A — RED tests.** Writing `tests/pwa-metadata.test.ts`:
Now the e2e additions — let me append them to crm.spec.ts after the s18 metadata tests.
Now confirming the RED state before any implementation.
**RED confirmed: 14 failing checks.** Now **Phase B — implementation.** Starting with the site seam extensions.
现在是 manifest 路由处理器（参考代码精确的键顺序）：
Now the root layout — theme-color #000000, manifest link, apple icon, PWA metas, root canonical:
Now generating the 180×180 apple icon (adapting the s18 generator):
Apple icon ready. Now wiring the 8 page wrappers through the factory:
Now the login and signup pages:
Now the entity-dialogs fixes — tel input, datalist removal, accept list:
现在进行 tel type + accept 的修复。首先检查孤立的 `industries`/`accounts` 变量：
All implementation edits done. Running the unit tests:
Three fixes needed. First, find the remaining datalist:
The failures are my own comment strings matching the pins (the s17 lesson). Fixing comments + tests:
现在修复这两个测试侧的引脚（收紧 manifest 计数 + 通过 spread 检查 PWA 元数据）：
New suite green 14/14. Now the full unit suite to check the s18/s13 pins still hold:
**Unit GREEN: 340/340** (+14). Now lint + typecheck:
Unit gate green. Now the critical live verification of Next's serializer emissions (the s18 lesson) — probing the dev server's actual head output:
All root emissions correct. One byte-level nuance: the reference's root canonical carries a trailing slash. Let me test whether Next preserves an absolute canonical:
Next normalizes the trailing slash away — the no-slash form is URL-equivalent (documented nuance, same class as s18's viewport `1` vs `1.0`). Reverting to the cleaner form:
Now the critical inner-page verification — does the page-level `other` REPLACE the layout's (preserving PWA metas via the factory), and are all OG fields present on /accounts:
Inner-page emissions are exactly right. Now /login + the manifest route:
All emissions verified. Let me sweep the remaining routes' heads + apple icon resolution:
All 10 routes verified. Now the build + e2e gate — first checking for stale servers:
Build clean — `/manifest.json` in the standalone manifest. Running e2e:
3 failures to diagnose. Let me inspect each:
明确诊断：`icons` 元数据字段**替换**了文件约定图标链接；我的规范测试需要无斜杠形式。让我修复这两个问题，然后检查 Event 对话框的失败：
Event test passes alone — it was a flake. Now fixing the icon strategy: moving to the file convention (`src/app/apple-icon.png`):
Now update the unit tests to match the file-convention strategy + fix the canonical e2e test:
Verifying the file-convention apple icon emission live:
Both icons emit correctly (sizes 180×180 matches the reference). Rebuilding + full e2e re-run:
**E2E GREEN: 56/56.** Let me verify the test count math (was 50, added 7 → expected 57):
Counts reconcile: 340 unit (+14) · 56 e2e (+6). Now the live Contact dialog verification on the dev server:
The query hit a hidden dialog. Let me target the VISIBLE dialog:
Contact dialog verified live: tel + accept + zero datalists. Final overflow sweep:
Phase C complete — all green. Now Phase D: screenshots. Let me check the s18 capture script:
The s18 script is fully reusable. Let me update it for s19 and run:
All 20 shots captured with verification. Checking freshness:
20 fresh shots, zero duplicates. Now `.env.example` verification — the site URL comment must cover the manifest:
.env verified. Now docs realignment — starting with README:
The first edit succeeded (PWA row inserted). Verifying the badge and updating remaining README counts:
README done. Now AGENTS.md — counts + session-19 contract block:
Now appending the session-19 contract block to AGENTS.md (after the session-18 block):
Now CLAUDE.md updates:
Now the PAD — matrix + §7.4 + session notes:
PAD done. Now the SKILL.md — version bump + §16k + frontmatter:
Now the SKILL frontmatter — version + project_state:
Now writing the session-19 completion log (`docs/session_31.md`):
Now the plan addendum + the repo worklog entry:
Now the final change-set review + commit:
Change set clean, gate green. Committing:
Committed `f377507`. Now the SSH push — reading the runbook first:
Runbook internalized. Checking the shim + paramiko from session 18:
Key verified. Dry-run with the explicit remote:
Dry-run clean (fast-forward 58b82e4..f377507). Real push:
**PUSH VERIFIED** — remote main @ f377507 == local HEAD. Shredding the key and writing the push-record commit:
Both commits pushed and verified, keys shredded, tree clean. Final step — the outer workspace worklog:
**Session 19 complete and pushed.** 

**Audit** — Standing layers all held: mobile nav drawer 7/7 (the reference still ships none — 15th session), metadata census, zero mobile overflow. The new sweep found the **PWA/installable + per-route metadata layer**: no manifest, wrong theme-color, missing apple-touch-icon/meta family, and the reference ships **per-route OG/Twitter + canonical** where ours was root-static.

**Fixed (TDD)** — Manifest byte-format route handler, #000000 theme, 180×180 apple icon, the `pageMetadata()` factory wiring all 10 routes, plus dialog micro-contracts (tel phone, datalist removal). Gate-caught a subtle hazard: `metadata.icons` *replaces* the favicon file convention.

**Delivered** — 340 unit · 56 e2e green · 20 verified screenshots · docs at SKILL v1.16.0 · commits `f377507` + `7367765` pushed to main, keys shredded.

Next: keep watching the reference's `/Reports` for its data-bearing instance (would unlock edit dialogs), or I can sweep a fresh layer — keyboard tab-order, HTTP headers, or print styles.
