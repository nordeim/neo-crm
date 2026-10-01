I'll continue the task from where we left off. Let me start by checking the current workspace state and refreshing the repository.
The workspace already has both repos. Let me read the worklog to understand previous progress, and refresh the neo-crm repo.
The workspace is intact from session-21 (local HEAD at `677dd9b`, clean tree). The user's instructions now reference `docs/session_35.md`, `docs/session_36.md`, and the session-21 plan — meaning this is **Session 22**. Let me set up the task plan and refresh the repo.
Pull confirmed: `docs/session_36.md` (the session-21 transcript) is the only change — zero app-code drift. Now let me re-read the core documentation.
Session-35/36 docs internalized. Key session-22 pointers: login-card funnel joins standing surfaces, the `__next_route_announcer__` e2e hazard, demo-data re-check (18th session), and unprobed candidates: ARIA census, 500 error page, keyboard shortcuts (alt+T). Now the core docs.
The docs are large; let me read the tail sections of AGENTS.md (the session contracts) and the other core docs in targeted chunks.
Let me extract the key sections efficiently with targeted line ranges.
Now let me read CLAUDE.md, README.md, and the session-21 remediation plan.
Core docs internalized. Now let me verify the environment and run the baseline gate.
Environment intact. Let me check the dev server status and run the baseline gate.
Dev server healthy on :3000. Running the baseline gate now.
**Baseline gate green: lint 0/0 · tsc clean · 380/380 unit (19 suites).** Now let me start the live audit — first check the agent-browser tooling.
Logged in. Standing check 1: demo data on /Reports (18th session check).
Demo data still zero — **18th consecutive session**. Standing check 2: reference mobile nav at 390px (using the correct `getClientRects().length` probe).
**Reference still ships NO mobile nav at 390px — 18th consecutive session.** Now our clone's drawer 7-check regression. Let me open a second session for the clone.
Logged into the clone. Running the 7-check drawer regression at 390px.
The overlay is showing (drawer appears open). Let me close it and find the real trigger.
Check 1 target found: trigger "Open navigation menu" at (16,16) 36×36 ✓. Let me verify the drawer state is truly closed (overlay visibility check).
Drawer confirmed closed (visibility:hidden, locks released — Escape worked). Now Check 2: open via real click, verify links + focus + dual locks.
**Check 2 PASS** (8 links, focus in panel, dual body+main locks). Check 3: Escape + focus restore.
**Check 3 PASS** (Escape closes, locks released, focus restored to trigger). Check 4: focus-trap wrap both directions.
Focus went to BODY on Shift+Tab — unexpected. Let me check the mobile-nav trap implementation and the e2e test to understand the correct probe.
The querySelector string looks suspicious (`aref]` — possibly `a[href]` mangled, or a REAL bug). Let me read the raw source.
Source is correct (`a[href]` — sed output was mangled). Let me re-probe the trap wrap carefully, checking the focusables order first.
The drawer is still open but focus is on BODY — the previous `press` may have reset focus. Let me test the wrap carefully with proper sequencing.
Forward wrap works (Settings + Tab → Close X). Now testing backward wrap with current focus on Close X.
**Check 4 PASS** — trap wraps both directions (the earlier BODY result was a focus race, not a defect). Check 5: resize past md → auto-close + sidebar swap.
**Check 5 PASS** (auto-close + sidebar swap @900px). Check 6: route-change close via drawer link.
**Check 6 PASS** (route → /leads, closed, unlocked). Check 7: 390px overflow sweep on all 11 routes.
9 app routes clean. Now /login + /signup logged-out (clear cookies first).
The session cookie is httpOnly — clearing via the logout API route instead (established pattern).
**All 7 drawer checks PASS (7/7), zero overflow on 11 routes.** Now the drawer v4-hazard internals + the standing metadata/header census via curl.
Drawer internals clean (#2563eb panel, h-dvh, no hidden attrs). Now the standing metadata/header census via curl-SSR.
Standing metadata/header census intact — zero drift. Now the session-21 login-card funnel spot-check (wrong-password Callout).
**Login-card funnel standing layer verified** (Callout red-50/70 + red-200 border + p-4 + red-700 inner, zero toasts). All standing layers hold — NO drift. Now the NEW audit layer: keyboard shortcuts + notifications surface (the "alt+T" hint).
The reference session is still at 390px from the mobile probe. Resetting to desktop width.
Full topbar at desktop. Let me search the reference DOM for the "alt+T" keyboard hint.
No hints in the static DOM — they must live inside the topbar popovers. Let me click the mail and bell buttons.
No popup renders. Let me check where the "alt+T" hint was originally observed — searching repo docs.
Two empty z-[100] toast viewports found — bell opens nothing visible. Let me try the ALT+T shortcut directly on the reference.
**KEY FINDING: Alt+T on the reference moves focus to the BELL button!** The reference implements a real keyboard shortcut. Let me verify this systematically.
My earlier read was wrong — the click itself focused the bell. Let me search the reference's JS bundles for the "alt+T" hint text.
The alt+T lead is **disproven** — no shortcuts or Notifications hint exist in the reference (DOM, attributes, or bundle). Now let me sweep the topbar mail/bell behavior on both apps — a data-free probeable surface.
Both buttons dead on both apps — parity. Let me check what our source pins for these labels and probe the topbar search surface next.
Our clone's search renders a live dropdown. Now the critical comparison — the reference's search behavior.
The reference's search is fully DEAD (no dropdown, no navigation). Let me inspect our clone's search implementation.
Search surface = parity at zero data (both render no dropdown). Let me check never-swept candidates — font-family stack and viewport-width extremes.
**Major finding candidate**: the reference ships NO webfont (system-ui stack, zero loaded fonts) while our clone ships Inter. Let me verify there's no @font-face in the reference's CSS.
**CONFIRMED: the reference ships ZERO webfonts** — plain Tailwind default `ui-sans-serif, system-ui` stack. Let me check our clone's computed stack.
**S22-P1 CONFIRMED — font-family drift.** Our clone ships Inter (webfont loaded); the reference ships the plain Tailwind v4 system stack with ZERO webfonts. Let me quantify the visual difference with text-driven widths.
Let me do a clean controlled measurement — same string, weight 400, 16px, body font on each app.
**Substantial drift confirmed**: same text renders 466.8px vs 439px (regular), 522.4px vs 451.3px (bold). Let me check the reference's body classes and how our font is wired.
The reference's body has NO classes and NO antialiased (auto smoothing). Let me check its base CSS rules.
Let me see the reference's full preflight rule (truncated at "font-f...") and verify our smoothing.
Env var leaked between sessions — the second eval also hit the clone. Re-probing the reference explicitly.
S22-P2 confirmed. Continuing the typography-layer sweep — checking `::selection`, tap-highlight, and other base rules in the reference CSS.
Let me check the reference's head for font preloads and any remaining font-related emissions.
Let me check a few more base-layer details — placeholder rules, caret-color, and box-sizing on the reference.
Now let me probe the dashboard "Add" button menu — a data-free functional surface never compared.
Reference's Add button opens NOTHING. Let me check our clone's Add button.
Our Add opens a create-chooser dialog; the reference's is dead. Let me check the reference's other pages' Add buttons (leads/accounts) — the s5 dialog contract must have come from somewhere.
The leads-page dialog works on the reference (that's the s5 source). The dashboard Add is dead there — our chooser is the documented superset pattern. Let me verify it's documented as such.
The Add button is the documented superset pattern — no finding. The typography layer is the actionable new layer. Let me check what tests pin the font tokens.
No test pins on fonts — clean slate for TDD. Let me verify the reference's brand/logo text also uses the system stack (no display font).
Wait — earlier the sidebar nav link showed weight 500 (reference) vs 400 (ours). Let me verify this potential finding carefully.
Both weights are 400 — no drift there (earlier reading was a probe artifact). The audit layer is complete. Let me validate the font wiring across the codebase before writing the plan.
The full typography wiring is mapped — including a DOUBLE smoothing (html CSS rule + body class) and an invented `text-rendering`. Let me check doc references for realignment scope.
Let me check the reference's og:image (the font change could affect our mirrored og-image asset).
All validation complete. Writing the session-22 remediation plan now.
Plan written. Now validating it against the codebase before execution.
Plan validated — only one font-family rule (body, var-resolved). Now **TDD Phase A: red tests first**. Let me check the established source-pin pattern.
Writing the red-first test suite `tests/typography.test.ts`.
**RED confirmed: 9 failed / 1 passed.** But the s13 guard failed oddly — let me check what matches `font-size: 14px` in globals.css.
The s13 guard needs comment-stripping + body-rule scoping (the established pattern). Fixing the test.
**Granular RED: 8 failed / 2 structural passes.** Now Phase B — implementation.
Now the globals.css fixes — removing the `--font-sans` override, the html smoothing rule, and `::selection`.
Classic s21 lesson — my own retirement comments match the source-pin regexes. Scoping the pins off comments.
The layout comments are `//` style — extending the strip.
**390/390 unit green (+10).** Now adding the e2e typography checks. Let me find the right spot in crm.spec.ts.
Now lint + typecheck, then live verification on the dev server.
tsc clean. Now live verification on the dev server (Turbopack hot-reload).
Unexpected — an old-style stack and 4 loaded fonts. Let me inspect what's actually loading.
The v4 default in OUR Tailwind version differs from the reference's stack — I need to pin the exact stack explicitly. Let me check the version.
Tailwind 4.3.3's default ≠ the reference's v3 stack. Pinning the exact reference stack explicitly (version-proof).
Now updating the test to pin the exact stack value.
Let me make the e2e font-count check robust (exclude Next dev-overlay fonts).
All gates green (391/391 unit). Live-verification of the computed stack on the dev server.
**Byte-identical stack + zero webfonts + auto smoothing.** Now the metric convergence check.
**Exact metric convergence: 466.8/522.4 — pixel-identical to the reference.** Now the overflow guard at 390px (wider text risk).
Zero overflow on all 11 routes. Re-login + drawer spot-check post-change.
All standing layers hold. Now re-capturing the og-image (1200×630) with the remediated font.
og-image re-captured (1200×630). Now the full gate — build + e2e (closing browser sessions first per the pthread hazard).
**FULL GATE GREEN: 391/391 unit · build · 67/67 e2e (+3 typography, mobile-nav 7/7).** Now Phase D — deliverables.
Adapting the capture script for session-22 and running it.
All 23 shots captured with verified probes. Checking for duplicates + .env.example.
Zero duplicates; env verified. Now **docs realignment** — starting with README.
README done. Now AGENTS.md — counts + the session-22 contract block.
AGENTS.md done. Now CLAUDE.md.
CLAUDE.md done. Now the PAD — matrix, typography rows, §7.2, §7.4.
PAD done. Now SKILL.md — v1.19.0 with §16n.
Now adding the §16n section (session-22 lessons) before §17.
11 checks confirmed. Now writing `docs/session_37.md` (the completion log).
Now the plan addendum + the repo worklog.
Now the final changeset review + sanity gate.
One stale comment line in layout.tsx (pre-dates the explicit-pin correction). Fixing.
Final sanity gate before commit.
Gate green. Updating the outer workspace worklog, then committing.
Now the final step — commit and push. Let me re-read the SSH wrapper runbook first.
Shim verified. Writing the deploy key (outside the repo, 0600).
Key verified. Now committing on main.
Dry-run clean (fast-forward `4b4843d..1d43558`). Real push now.
**Push verified** — remote main @ `1d43558` == local HEAD. Shredding the key, then the worklog-record commit (established two-commit pattern).
Both pushes verified, tree clean, keys shredded. Closing browser sessions and finalizing.
**Session 22 complete and pushed to main** (`1d43558` + the worklog record `3700ca1`, both verified via ls-remote).

**Audit** — All standing layers held (18th session: reference still ships no mobile nav; our drawer 7/7; metadata/security-header census; login Callout; demo data still zero). The session-35 "alt+T" pointer was **disproven** (a phantom — zero shortcuts anywhere on the reference). The new **typography/base-cascade sweep** — a surface never probed in 21 prior sessions — found three live-verified gaps:

- **S22-P1**: The reference ships **zero webfonts** (system stack only); our scaffold's Inter webfont rendered *every* text surface in the wrong typeface (~6–14% narrower)
- **S22-P2**: Our double `antialiased` smoothing vs the reference's default `auto`
- **S22-P3**: Our invented blue `::selection` tint

**Fixed (TDD)** — Inter retired, the reference's exact stack pinned in `@theme --font-sans` (explicitly — Tailwind 4.3's own default is *not* byte-identical), smoothing + selection retired. Post-fix: computed font-family **byte-identical**, text metrics **pixel-convergent** (466.8/522.4), zero 390px overflow on all 11 routes. Gate: **391 unit · 67 e2e green** · 23 verified screenshots · og-image re-captured · docs at SKILL v1.19.0.

**Next**: keep watching `/Reports` for the reference's data-bearing instance (would unlock edit dialogs), or sweep the ARIA census / 500 page next session — see `docs/session_37.md`.
