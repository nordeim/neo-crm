I'll continue the task from where we left off. The workspace exists with prior work; let me refresh it with `git pull` and review the current state.
The pull brought in `docs/session_40.md` (the session-23 transcript — the only change). This is **Session 24**. Let me read the session-39 pointers and the session-23 plan.
The pointers name the unprobed layers: URL-state behaviors (filters/views in the address bar), loading/suspense states. Let me re-verify the environment and run the baseline gate first.
**Baseline gate green: lint 0/0 · tsc clean · 406/406 unit · dev server healthy.** Env intact (.env file:../db/custom.db + db/ at root). Now the standing-layer re-verification — login to the reference.
**Demo data still zero — 20th consecutive session.** Standing check 2: reference mobile nav at 390px.
**Reference still ships NO mobile nav at 390px — 20th consecutive session.** Now our clone's drawer 7-check regression.
The demo credential needed a lookup (the seeded users differ from my first attempt — the wrong-password Callout incidentally re-verified the s21 login-funnel layer). Trigger found at (16,16) 36×36 ✓.
**Check 1 PASS.** Check 2: open via real click — 8 links, focus entry, dual locks.
**Check 2 PASS** (8 links, focus on Close X, body+main both hidden). Checking drawer internals + Check 3: Escape.
**Check 3 PASS** (Escape + locks released + focus restored to the trigger). The slide panel computes rgb(37,99,235) = #2563eb, h-dvh exact, zero hidden attrs ✓. Check 4: focus-trap wrap.
**Check 4 PASS** — Shift+Tab from Close X wraps to Settings, Tab wraps back. Check 5: resize past md.
**Check 5 PASS** (auto-close + locks released + the desktop sidebar at 8 links @256px). Check 6: route-change close.
**Check 6 PASS** (drawer Leads link → h1 "Leads", closed, unlocked). Check 7: the 390px overflow sweep, route-by-route.
**All 7 drawer checks PASS, zero overflow on 11 routes** (login/signup swept logged-out via the logout API). Now the curl-SSR metadata/header census — all intact (description, theme-color #000000, manifest link, the three security headers, robots with the Sitemap line, sitemap 9 locs + bare application/xml).
Re-login + the typography standing layer: the controlled-span metrics EXACTLY equal on both apps (466.8/522.4), the family byte-identical, smoothing auto; our 4 webfonts are all `__nextjs-Geist*` dev-overlay faces (the documented s22 scope rule).
The tabs standing layer (s23): wiring spot-probe on both apps — activities 4/4, reports 5/5, settings 3/3 wired + backWired, inactive shells hidden + empty. IDENTICAL contracts.
**All standing layers hold — NO drift.** Now the NEW audit layer: the URL-state census (the session-39 pointer), both directions. First the WRITES — the reference's /leads Filters popover.
Selecting Status=New: zero URL mutation. Table sorting: zero. The /reports period selector: zero. The calendar month chevrons (October → November in memory): zero. The dashboard view-switcher: zero. The topbar search: zero. Now the READS — deep-link params on both apps: ignored by both, the string persists in the bar with zero effect. **URL-state parity — the pointer closes clean.**
Then the link-graph enumeration — and the **route-case discovery**: the reference's sidebar links point at CAPITALIZED paths (`/Dashboard`, `/Accounts`, … `/Settings` — byte-extracted), and its account menu ships `<A href="/Profile">`. Dashboard links to `/Dashboard`, NOT the root.
Browser-probing every capital URL: all NINE render the real page IN PLACE with NO normalization (h1 "Leads" at /Leads…). Each casing is a first-class SSR route — curl-diffing /Reports vs /reports shows og:url + canonical mirroring the requested case; /Dashboard serves the ROOT head exactly like `/`. Our clone 404s every capital app route (only /Profile resolves — via the s14 redirect that NORMALIZES the URL bar; the reference keeps /Profile). The auth routes are the exception: /Login + /Signup render the reference's 404 view — our clone 404s them too (parity by coincidence).
The active-state probes: the reference highlights Reports (href /Reports) at LOWERCASE /reports — case-insensitive matching; Dashboard active at BOTH / and /Dashboard. **S24-P1/P2 pinned.**
One more live-click probe: the reference's dashboard "More..." button — zero DOM delta, zero dialogs, zero navigation. Ours pushed /leads (an invention — the s6 pin recorded the classes, never the click contract). **S24-P3 pinned.**
Audit complete. Writing docs/plans/2026-10-01-session24-parity-remediation.md, then validating it against the codebase (all 8 page components + the (app) layout guard + the nav-config/sidebar/topbar consumers + the test pins).
Plan validated. **TDD Phase A — red tests first**: tests/route-case.test.ts (16 checks) + the profile-route.test.ts rewrite. **RED confirmed: 27 failed / 5 passed.**
**Phase B — implementation**: the 9 capital render aliases generated inside the (app) group (each re-exporting the lowercase page + capital-case pageMetadata; the Dashboard alias imports the root dashboard with NO metadata); the s14 top-level /Profile redirect retired; nav-config hrefs → the capitalized set; sidebar isActive → case-insensitive + the Dashboard root special case; the account menu → /Profile; the More... onClick + useRouter retired.
Unit gate: the new suites 32/32 green — one test fixed mid-red (the isActive function-capture regex stopped at the first `;`; re-pinned against the source). **Full unit: 434/434.** Lint clean. tsc caught a stale `.next/types` artifact from the deleted alias — cleared… and then the REAL catch: the regenerated validator imported BOTH casings of every dual route and TypeScript refused the program with eight TS1149s (files differing only in casing — empirically NOT flag-controllable; `forceConsistentCasingInFileNames: false` doesn't suppress it, verified in a minimal repro). **Fix: the nine aliases became `.jsx` files** — a Next-supported page extension whose path differs from the canonical by extension too, resolving through allowJs exactly like the validator's page.js import. Full gate re-run clean.
**Live verification**: all 9 capital routes render in place (h1 + URL preserved); the capital heads curl-verified (og:url/canonical at the capital case; /Dashboard serving the root head); the sidebar href set byte-exact with the Dashboard active at `/` and Reports active at BOTH casings; the drawer link → /Leads; the account menu → /Profile; More... a verified no-op; the 390px overflow sweep clean on all 9 capital routes; the standing layers spot-checked post-change (drawer, tabs wiring on the capital /Activities, security headers, zero app webfonts).
**Build clean — both casings in the route table.** E2E updates (the /Profile render contract, the account-menu /Profile target, the drawer /Leads URL) + 5 new tests (the href set, the case-insensitive active state, the capital-route renders, the capital-auth 404, the dead More...). Full suite: 72/73 → the documented Event-dialog flake (clean in isolation) → a second run hit the documented reports skeleton race (clean in isolation) → **the final full run: 73/73 GREEN.**
**Phase D — deliverables**: all 23 screenshots re-captured with per-shot verification (shot 12 re-shot with the COMPUTED-visibility probe — the inline-style read false-negatived the open drawer; zero md5 duplicates; shot 23 on a fresh s24 email); .env/.env.example verified (no env surface); docs realigned (README badge 507 + the route-case row + counts, AGENTS + the session-24 contract block, CLAUDE + the route-case suite + the profile-route rewrite, PAD 434/73 + the §5 route-case block + the checklist, SKILL v1.21.0 §16p + frontmatter + project_state, this log, the plan addendum).

**Audit** — All standing layers held with zero drift (20th session: reference still ships no mobile nav; drawer 7/7; typography metrics pixel-identical; tabs wiring identical; demo data still zero). The new **URL-state / route-case census** — a surface never probed in 23 sessions — closed the session-39 pointer at parity (zero URL writes, params ignored) and found three live-verified gaps:

- **S24-P1**: The reference serves every app route at BOTH casings with no normalization — capitalized URLs are its sidebar's own link targets and carry first-class SSR heads; our clone 404'd them all
- **S24-P2**: The sidebar/drawer/account-menu href byte-contract — capitalized paths + case-insensitive active matching; ours shipped `/` + lowercase + case-sensitive matching
- **S24-P3**: The dashboard "More..." button is the reference's dead affordance; our router.push("/leads") was an invention

**Fixed (TDD)** — Nine capital-route render aliases inside the (app) group (the s14 /Profile redirect retired); the capitalized NAV_ITEMS hrefs + the case-insensitive isActive; the dead More... Gate: **434 unit · 73 e2e green** · 23 verified screenshots · docs at SKILL v1.21.0.

**Next**: Watch `/Reports` for the reference's data (would unlock edit dialogs/avatar upload — 20 sessions zero), or sweep the loading/suspense states (needs a MutationObserver approach — CLI latency hides them) or the print stylesheet family (both zero today); the topbar search-row targets stay data-gated-unverifiable — see `docs/session_41.md` pointers below.

## Next session pointers

- The route-case layer joins the standing surfaces — re-run the session-24
  e2e checks (the capital-route renders + the href set + the active state)
  each session; the capital heads are curl-checkable (og:url/canonical at
  the requested case).
- NEVER convert a capital alias into a next.config.ts redirect
  (case-insensitive matching self-loops — the s14 lesson,
  twice-reproduced); never add capital aliases for the AUTH routes
  (`/Login` + `/Signup` 404 on the reference too — pinned in
  tests/route-case.test.ts).
- The reference's demo data has been zero for TWENTY consecutive
  sessions — keep re-checking `/Reports` on login (it would unlock the
  edit dialogs, the picklist add flow, the avatar upload, and every
  data-gated surface — including the topbar search-row link targets,
  the one remaining data-gated-unverifiable href surface).
- Unprobed layers remaining: the loading/suspense states (install a
  MutationObserver BEFORE the navigation — CLI latency lands every
  post-open eval post-hydration; this session's pulse-catch read ZERO
  animate-pulse elements on the reference's /Reports nav), the print
  stylesheet family (both zero today), keyboard-shortcut parity beyond
  the tabs model.
- The s24 click-contract lesson: a class-level pin records the right
  classes with the wrong CLICK behavior — the "More..." button shipped
  the s6 visual pin for 18 sessions while carrying an invented
  navigation. When a control is pinned, probe what it DOES, not just
  what it looks like.
