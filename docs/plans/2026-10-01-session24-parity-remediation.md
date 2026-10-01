# Session 24 Remediation Plan — The URL-State / Route-Case Layer (2026-10-01)

**Scope:** Fresh-login live audit of the reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `b27e032`
(pulled to the operator's session-23 transcript `docs/session_40.md` —
the ONLY change since `6c60a5e`; zero app-code drift, so every pinned
family from s23's live verification held by construction). Workspace
intact: `.env` with `DATABASE_URL="file:../db/custom.db"` + `db/` at the
repo root, dev server healthy on :3000, vitest + playwright configs in
place. **Baseline gate green: lint 0/0 · tsc clean · 406/406 unit.**

**Standing layers re-verified FIRST (moving-target rule) — NO drift:**

- **Mobile navigation (the standing priority)**: (a) the reference at
  390px still ships NO navigation (**20th consecutive session** — zero
  `getClientRects().length > 0` nav links, no `<aside>`); (b) our
  drawer's 7-check regression LIVE **7/7 PASS** — trigger hit-test 36×36
  at (16,16); open + 8 links + focus entry + dual scroll locks (body +
  main both `hidden`); Escape + lock release + focus restore to the
  trigger; focus-trap wrap BOTH directions (Close X ⇄ Settings, the
  s22-lesson sequencing); resize-past-md auto-close + the desktop
  sidebar swap (8 links @256px); route-change close (drawer Leads link
  → h1 "Leads", closed, unlocked); **zero 390px overflow on all eleven
  routes** (9 authenticated + /login + /signup logged out via the
  logout API); (c) drawer internals clean (844px height === innerHeight,
  the slide panel `rgb(37,99,235)` = #2563eb, zero `hidden` attributes).
- **The tabs ARIA layer (s23, standing)**: wiring spot-probe on both
  apps — activities 4/4, reports 5/5, settings 3/3 tabs wired +
  backWired, inactive shells hidden + empty. IDENTICAL contracts.
- **The typography / base-cascade layer (s22, standing)**: controlled-
  span metrics EXACTLY equal on both apps (466.8px regular / 522.4px
  bold on this session's 53-char probe string); the computed family
  byte-identical; `document.fonts` empty on the reference, and our 4
  faces are all `__nextjs-Geist*` dev-overlay artifacts (the documented
  s22 scope rule); smoothing `auto` on both.
- **The document metadata + PWA + HTTP header layers (s18+s19+s20)**:
  curl-SSR — description present, theme-color #000000, the manifest
  link, the three security headers on `/`, robots.txt with the Sitemap
  line, sitemap 9 locs + bare `application/xml`.
- **The login-card funnel (s21, standing)**: wrong-password → the
  ErrorCallout ("Invalid email or password", zero toasts) — re-verified
  incidentally on a bad demo credential.
- **Demo data still zero (20th consecutive session)** — /Reports served
  the empty-state rows (Total Leads 0, Won Deals 0, Saved Reports (0)).

**This session's NEW audit layer — the URL-state / route-pathology
census (never swept in 23 sessions; the session-39 pointer).** Probed
both directions on the reference: (a) WRITES — every stateful control
watched for URL mutation (leads Filters popover + Status/Source
selects, table-column sorting, the reports period/owner/stage/status
comboboxes, the calendar month chevrons, the dashboard view-switcher,
the topbar search, the tab strips); (b) READS — deep-link probes with
guessable params (`?status=New&view=board&sort=name`, `?month=2026-11`,
`?date=…`); (c) the LINK GRAPH — every `href`/router target in the
reference's DOM enumerated (sidebar, account menu, 404 view, post-login
redirect); (d) ROUTE CASING — every nav route probed at BOTH casings
(browser-rendered, not just curl status).

| # | Sev | Issue | Evidence (live probes) |
|---|-----|-------|------------------------|
| S24-P1 | **High** | **The route-case contract — the reference serves every app route at BOTH casings; our clone 404s on the capitalized forms.** The reference's sidebar links point at CAPITALIZED paths (`/Dashboard`, `/Accounts`, `/Contacts`, `/Leads`, `/Calendar`, `/Activities`, `/Reports`, `/Settings` — byte-extracted from its live DOM) and its account menu ships `<A href="/Profile">`. Probing each capital URL browser-side: all NINE render the real page IN PLACE (h1 "Leads" at `/Leads`, "Settings" at `/Settings`, "Profile & Settings" at `/Profile`) with NO normalization — the URL bar keeps the casing the visitor typed/clicked. Each casing is a first-class SSR route: `/Reports` serves `og:url` + `canonical` at `…/Reports` while `/reports` serves them at `…/reports` (identical og:title/og:description); `/Dashboard` serves the ROOT head (og:url/canonical = origin, og:title "NEO CRM") exactly like `/` — the dashboard inherits the root layout head at both paths. Our clone: `/Reports`, `/Leads`, `/Dashboard` etc. all land on the designed 404 (`The page "/Reports" could not be found`); only `/Profile` resolves — via the s14 top-level redirect alias that NORMALIZES the URL bar to `/profile` (the reference keeps `/Profile`). The auth routes are the deliberate exception: `/Login` and `/Signup` render the reference's 404 view (its client router does not case-fold them) — our clone 404s on both too, PARITY BY COINCIDENCE, no aliases wanted there. | sidebar `href` enumeration + per-route browser probes at both casings + curl head diffs (`/Reports` 8577B vs `/reports` 8774B — the og:url/canonical case is the delta) + the account-menu menuitem probe |
| S24-P2 | **Med** | **The sidebar/menu href byte-contract + the case-insensitive active state.** The reference's sidebar anchors carry the capitalized hrefs (Dashboard → `/Dashboard`, NOT `/` — byte-visible in its DOM and in the URL bar after every sidebar click). The active-state matcher is CASE-INSENSITIVE: at lowercase `/reports` the Reports item (href `/Reports`) still carries the active background (probed: `rgba(255,255,255,0.1)`), and the Dashboard item is active at BOTH `/` and `/Dashboard`. Our `nav-config.ts` ships `/` + lowercase hrefs; our `sidebar.tsx` `isActive` compares case-SENSITIVELY (`pathname === href`); our topbar account menu pushes `/profile` (the reference's menuitem is an `<A href="/Profile">`). Fix: point `NAV_ITEMS`/`NAV_FOOTER_ITEMS` at the capitalized routes (each renders in place per S24-P1 — zero redirect hops), make `isActive` case-insensitive with the Dashboard root special case, push `/Profile` from the account menu. | the href enumeration + the active-state probes at `/reports` (lowercase) and `/` + `/Dashboard` |
| S24-P3 | **Low** | **The dashboard "More..." button's invented navigation.** The reference's Recent-deals "More..." ghost button is a complete NO-OP (clicked live: `domDelta 0`, zero dialogs/popovers, URL unchanged at `/`) — the same dead-affordance family as its mail/bell buttons. Our `page.tsx` wires `onClick={() => router.push("/leads")}` — an invented behavior (the s6 pin recorded the button's VISUAL classes but never its click contract). Fix: retire the onClick + the unused `useRouter` import; the button becomes the reference's dead affordance. | the live click probe (domDelta + URL) on both apps — ours navigated to /leads, the reference's did nothing |
| — | Info | **Verified at parity (no action — the session-39 pointer CLOSED):** URL-state behaviors. Both apps write ZERO URL state — filters (leads Status/Source + the popover), table sorting, the reports period/owner/stage/status selectors, the calendar month chevrons (October → November in memory), the dashboard view-switcher (Table/Cards), the tab strips, and the topbar search all mutate NOTHING in the address bar; deep-link params are IGNORED by both (`/leads?status=New&view=board&sort=name` leaves the table mounted, `/calendar?month=2026-11` still shows October 2026) and the search string PERSISTS in the bar with zero effect on both. Also at parity: the 404 "Go Home" target (the reference's button → `/`, ours `<A href="/">` — the link expression is the documented accessible superset), the post-login redirect (both → `/`), the topbar search's no-dropdown-at-zero-data. The topbar SEARCH-result row targets stay lowercase + documented as data-gated-unverifiable (the reference's dropdown never opens at zero data — 20 sessions). | the write/read probes above, both apps |
| — | Info | **The 500 error-state page: UNPROBEABLE on the reference** (carried from s23 — no trigger found in 24 sessions). | — |

**Census-method lessons this session (→ SKILL §16p):**
- **CLI latency hides SPA skeleton passes**: an `eval` after `agent-browser
  open` lands post-hydration — to catch transitory loading states,
  install a MutationObserver BEFORE the navigation and read its log
  after (this session's pulse-catch on the reference's /Reports nav:
  ZERO animate-pulse elements — its zero-data loads are
  data-empty-but-instant, no skeleton flash at CLI timescales).
- **The route-case census needs BROWSER probes, not curl status codes**:
  the reference's SPA-fallback 200s EVERY unknown path (its `/Login`
  returns 200 to curl but renders the 404 view client-side). Only a
  rendered-DOM probe (h1 read) distinguishes page-served from
  fallback-served.
- **The case-insensitivity is ROUTE-SCOPED, not platform-wide**: the
  reference case-folds its 9 app routes but NOT its auth routes — the
  divergence would be invisible to a "just lowercase everything"
  shortcut and to a "redirect everything" shortcut alike.

---

## ToDo — execution order (TDD)

### Phase A — red tests first

1. New `tests/route-case.test.ts` (~16 checks, the established
   source-pin pattern with comment-stripping per the s21/s22 lessons):
   - The 9 capital alias folders exist INSIDE the (app) group
     (`(app)/Dashboard/page.tsx`, `(app)/Accounts/page.tsx`,
     `(app)/Contacts/page.tsx`, `(app)/Leads/page.tsx`,
     `(app)/Calendar/page.tsx`, `(app)/Activities/page.tsx`,
     `(app)/Reports/page.tsx`, `(app)/Settings/page.tsx`,
     `(app)/Profile/page.tsx`) — each re-exporting the lowercase page
     component (`../accounts/accounts-page` etc.), NOT redirecting.
   - Each capital alias except Dashboard emits
     `pageMetadata({ page: "X", route: "/X" })` with the CAPITAL route
     (mirroring the reference's capital-case og:url/canonical heads).
   - The Dashboard alias exports NO metadata (inherits the root head —
     the reference's /Dashboard serves the root og:url/canonical).
   - The s14 top-level `src/app/Profile/page.tsx` redirect alias is
     RETIRED (file gone; no `redirect("/profile")` anywhere in app/).
   - `nav-config.ts` hrefs are the capitalized set — Dashboard
     `/Dashboard` (NOT `/`), Accounts `/Accounts`, … Settings
     `/Settings`; zero lowercase hrefs remain.
   - `sidebar.tsx` `isActive` is case-insensitive (`.toLowerCase()` on
     both sides) with the Dashboard special case (`/` OR `/Dashboard`).
   - `topbar.tsx` pushes `/Profile` from the account menu.
   - The dashboard `page.tsx` "More..." button carries NO
     `router.push("/leads")` and no `useRouter` import (S24-P3).
   - NO capital aliases for the auth routes (`(app)/Login/`,
     `(app)/Signup/`, `src/app/Login/`, `src/app/Signup/` all absent —
     the reference 404s them; parity by coincidence is pinned).
2. REWRITE `tests/profile-route.test.ts` (the s14 pins describe the
   retired redirect mechanism): the alias now lives INSIDE the (app)
   group, renders (no redirect import), and carries capital-route
   metadata; keep the next.config no-redirect-loop pin (still true,
   still load-bearing).
3. E2E additions in `tests/e2e/crm.spec.ts` (~6 checks): `/Reports`
   (capital) renders the reports page with the URL PRESERVED (no
   redirect to lowercase); `/Dashboard` renders the dashboard with the
   URL preserved; the sidebar's first link href is `/Dashboard`
   byte-exact; the active state at lowercase `/reports` still
   highlights the Reports item (case-insensitive matching); the
   account-menu Profile click lands at `/Profile` (URL preserved);
   `/Login` (capital) still 404s.
4. E2E UPDATES for the href flip: `mobile-navigation.spec.ts` drawer
   link test `waitForURL("**/leads")` → `**/Leads`;
   `crm.spec.ts` the `/Profile` alias test asserts the URL STAYS
   `/Profile`; the account-menu test `waitForURL("**/profile")` →
   `**/Profile`.

### Phase B — implementation

1. **S24-P1**: create the 8 in-group capital alias pages — each a thin
   server wrapper importing the lowercase page component
   (`import XPage from "../x/x-page"`) + `pageMetadata({ page: "X",
   route: "/X" })`; the Dashboard alias imports the root dashboard
   (`../page`) with NO metadata export. Remove the s14 top-level
   `src/app/Profile/page.tsx` and add `(app)/Profile/page.tsx` in the
   same render-alias shape (the (app) layout's auth guard + shell now
   cover it — exactly the reference's behavior at /Profile).
2. **S24-P2**: `nav-config.ts` hrefs → the capitalized set;
   `sidebar.tsx` `isActive` → case-insensitive + the Dashboard root
   special case; `topbar.tsx` account menu → `router.push("/Profile")`.
3. **S24-P3**: retire the "More..." `onClick` + the unused `useRouter`
   import from `src/app/(app)/page.tsx`.

### Phase C — gate + live re-verification

Full gate: `bun run lint` → `bun run typecheck` → `bun run test`
(420+) → `bun run build` → `bun run test:e2e` (74+). LIVE on the dev
server: all 9 capital routes render in place (h1 + URL preserved);
curl-SSR the capital heads (og:url/canonical at the capital case; the
Dashboard alias serving the root head); the sidebar href + active
probes at both casings; the drawer link click → /Leads; the "More..."
no-op; the standing layers spot-check (drawer open/Escape, the tabs
wiring, the head census, the security headers, the typography probe);
the 390px overflow sweep on the capital routes too.

### Phase D — deliverables

The established 23 screenshots re-captured under `docs/screenshots/`
with per-shot URL + content verification (the sidebar-href shots now
show capital URLs in the address bar — matching the reference's own
screenshots); `.env`/`.env.example` re-verified (no new env surface);
docs realigned (README badge + the route-case feature row + counts,
AGENTS counts + the session-24 contract block, CLAUDE counts + the
route-case suite, PAD matrix + the §5 route-case rows, SKILL v1.21.0
§16p + frontmatter + project_state, `docs/session_41.md`, this plan's
addendum, the outer worklog); commit on main + SSH-wrapper push.

---

## Addendum — execution record (same session)

**Phase A (red tests):** 32 checks across two files — 16 new checks in
`tests/route-case.test.ts` (the nine render aliases with their capital-case
metadata, the Dashboard no-metadata root-head contract, the retired
top-level /Profile alias, the no-capital-auth-alias pin, the
capitalized NAV_ITEMS set, the case-insensitive isActive, the /Profile
menu target, the dead More..., the zero-URL-state census) + the
`tests/profile-route.test.ts` rewrite (5 checks — the render alias
inside the (app) group, the capital-route metadata, the retired s14
mechanism, the kept no-redirect-loop pin). **RED confirmed: 27 failed /
5 passed.** One check strengthened mid-red: the isActive
function-capture regex stopped at the first `;` (the
`pathname.toLowerCase()` line) and lost the dashboard special case —
re-pinned as direct source assertions.

**Phase B (implementation):** the nine capital aliases generated as thin
server wrappers importing the lowercase page components; the s14
top-level `src/app/Profile/page.tsx` deleted; the nav-config hrefs
flipped; the sidebar isActive rewritten (case-insensitive + the
Dashboard `/`-or-`/Dashboard` special case — covering BOTH the desktop
sidebar and the mobile drawer, which share the SidebarNav); the topbar
account menu pushes `/Profile`; the dashboard More... onClick + the
useRouter import retired. Gate-caught THREE times: (a) tsc read a stale
`.next/types/validator.ts` entry for the DELETED top-level Profile
alias — cleared, only to expose (b) **the TS1149 casing collision** —
Next's regenerated validator imports BOTH casings of every dual route,
and TypeScript REFUSES any program containing two real files whose
paths differ only in casing ((app)/Accounts/page.tsx vs
(app)/accounts/page.tsx) — an empirically-reproduced check that is NOT
flag-controllable (`forceConsistentCasingInFileNames: false` does not
suppress it; verified in a minimal repro). Fix: the nine aliases ship
as **`.jsx` files** — a Next-supported page extension whose path
differs from the canonical by EXTENSION too, so no "only in casing"
collision exists; the validator's `page.js` import resolves the .jsx
through allowJs exactly as before; the lowercase page.tsx stays
canonical + type-checked; the tsconfig keeps its defaults (documented
in-file). Re-gate after the conversion: lint 0/0 · tsc 0 errors ·
434/434 unit · build (both casings in the route table) · 73/73 e2e ·
the capital routes re-verified live (h1 + URL + capital og:url). (c)
the `href: "/"` retirement regex in the test would have matched nothing
after the flip (the pin `not.toMatch(/href: "\/"/)` is exact-match on
the quote — verified).

**Phase C (gate + live re-verification):** lint 0/0 · tsc clean ·
**434/434 unit** (+28 net: 16 route-case + the 5-check profile rewrite
+ the structural passes) · build (both casings in the route table —
`/leads` + `/Leads`, `/reports` + `/Reports`, …) · **73/73 e2e** (+5 —
the href set, the case-insensitive active state, the capital-route
renders, the capital-auth 404, the dead More...; THREE runs needed: the
first hit the documented s23 Event-dialog flake, the second the
documented reports skeleton race — both clean in isolation, the final
full run all-green). LIVE on the dev server: all nine capital routes
render in place with the URL preserved; the capital heads curl-verified
(og:title/og:url/canonical at the requested case — /Reports serves
`…/Reports`, /Dashboard serves the ROOT head exactly like the
reference); the sidebar href set byte-exact with Dashboard active at
`/` and Reports active at BOTH `/reports` and `/Reports`; the drawer
link click → `/Leads` (h1 "Leads", closed, unlocked); the account menu
→ `/Profile` (h1 "Profile & Settings", URL preserved); More... a
verified no-op (domDelta 0); the 390px overflow sweep clean on all nine
capital routes; the standing layers spot-checked post-change (drawer
open/Escape/focus-restore, the tabs wiring on the capital /Activities
4/4, the security headers on the capital routes, zero app webfonts).

**Phase D (deliverables):** all 23 screenshots re-captured with
per-shot URL + content verification (shot 12 re-shot — the drawer probe
initially read the INLINE `style.visibility` which is empty for the
open drawer; the COMPUTED visibility probe is the correct contract, now
also documented in SKILL §16p; zero md5 duplicates; shot 23 captured on
a fresh s24 signup email — the s23 address persists in the demo DB);
`.env`/`.env.example` re-verified (no env surface); docs realigned
(README badge 507 + the route-case feature row + the counts, AGENTS
counts + the session-24 contract block, CLAUDE counts + the route-case
suite + the profile-route rewrite, PAD matrix 434/73 + the §5
route-case block + the checklist counts, SKILL v1.21.0 §16p +
frontmatter + project_state, `docs/session_41.md`, this addendum, the
repo worklog). Committed on main + SSH-wrapper push.
