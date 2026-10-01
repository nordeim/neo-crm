# Session 23 Remediation Plan — The ARIA Tabs Contract + Keyboard Layer (2026-10-01)

**Scope:** Fresh-login live audit of the reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `d6b5593`
(pulled to the operator's session-22 transcript `docs/session_38.md` —
the ONLY change since `1d43558`; zero app-code drift, so every pinned
family from s22's live verification held by construction). Workspace
intact: `.env` with `DATABASE_URL="file:../db/custom.db"` + `db/` at the
repo root, dev server healthy on :3000, vitest + playwright configs in
place. **Baseline gate green: lint 0/0 · tsc clean · 391/391 unit.**

**Standing layers re-verified FIRST (moving-target rule) — NO drift:**

- **Mobile navigation (the standing priority)**: (a) the reference at
  390px still ships NO navigation (**19th consecutive session** — zero
  `getClientRects().length > 0` nav links, no `<aside>`); (b) our
  drawer's 7-check regression LIVE **7/7 PASS** — trigger hit-test 36×36
  at (16,16); open + 8 links + focus entry + dual scroll locks (body +
  main both `hidden`); Escape + lock release + focus restore to the
  trigger; focus-trap wrap BOTH directions (the backward probe
  re-sequenced per the s22 focus-race lesson — natural post-open focus
  on Close X, then one Shift+Tab → Settings; the first attempt's
  programmatic-focus-then-press landed on BODY exactly as documented);
  resize-past-md auto-close + lock release + the desktop sidebar swap
  (8 links @256px); route-change close (drawer Leads link → /leads,
  closed, unlocked, h1 "Leads"); **zero 390px overflow on all eleven
  routes** (9 authenticated + /login + /signup logged out via the
  logout API); (c) drawer internals clean (844px height === innerHeight,
  the slide panel `rgb(37,99,235)`, zero `hidden` attributes).
- **The typography / base-cascade layer (s22, standing)**: the computed
  body font-family BYTE-IDENTICAL on both apps, `document.fonts` empty
  on both, smoothing `auto` on both, and the controlled-span metric
  EXACTLY equal on both apps (509.7px regular / 573.5px bold on this
  session's 60-char probe string — pixel convergence re-confirmed).
- **The document metadata + PWA + HTTP header layers (s18+s19+s20)**:
  curl-SSR — description present, theme-color #000000, the manifest
  link, the three security headers on `/`, robots.txt byte-identical
  with the reference modulo the origin line (direct byte-diff this
  session), sitemap 9 locs + bare `application/xml`.
- **The login-card funnel (s21, standing)**: wrong-password → the
  ErrorCallout ("Invalid email or password", the red-50/70 oklab bg +
  red-200 border, ZERO toasts).
- **Demo data still zero (19th consecutive session)** — /Reports served
  the empty-state rows (Total Leads 0, Won Deals 0, Saved Reports (0)).

**This session's NEW audit layer — the ARIA role/property census (never
swept in 22 sessions; the s20 tab-order census covered focus order
only), plus the zero-data interactive-behavior probes it surfaced.**
Swept via a per-route DOM extraction (roles, `aria-*` attribute counts,
native semantic element counts) across all 10 routes on both apps, then
targeted structural probes:

| # | Sev | Issue | Evidence (live probes) |
|---|-----|-------|------------------------|
| S23-P1 | **High** | **The ARIA tabs contract + keyboard layer.** The reference's tab strips are Radix Tabs and ship the FULL contract, live-verified on /activities (4 tabs), /reports (5), /settings (3): every tab BUTTON carries an `id` (`radix-:rN:-trigger-X`) + `aria-controls` → its panel's id; every panel carries `id` (`…-content-X`) + `aria-labelledby` → its tab's id; ALL N panel shells stay mounted (inactive ones `hidden` + `display:none` + EMPTY content — the app renders content into the active panel only); the tablist supports the full ARIA keyboard model — ArrowRight/ArrowLeft move focus AND selection with WRAP (4×ArrowRight from tab 0 lands back on tab 0), Home/End jump to the ends, automatic activation. Our custom `src/components/ui/tabs.tsx` ships `role=tab/tablist/tabpanel` + `aria-selected` + roving tabindex (selected=0, inactive=-1 — the documented accessible superset over the reference's all-`tabIndex=-1` platform defect, re-verified) but MISSES: (a) ANY arrow/Home/End key handling — the keys are dead on our tabs (probed: focus + selection stay on tab 0 after ArrowRight); (b) tab `id`/`aria-controls` wiring (both null); (c) panel `id`/`aria-labelledby` wiring (both null); (d) the N-shell panel structure — ours renders ONE unwired panel (settings/reports pass a single children blob) and /activities ships a REDUNDANT EMPTY `role=tabpanel` (the Tabs' built-in panel rendered with `{null}` children inside the toolbar!) plus an UNWIRED hand-rolled content panel below — the census's `tabpanel: ref=4 clone=2` (activities), `ref=5 clone=1` (reports), `ref=3 clone=1` (settings). | ARIA census (10 routes × both apps) + targeted tablist/panel probes + the keyboard probes above |
| S23-P2 | **Low** | **The authenticated `/login` redirect.** Our `src/app/login/page.tsx` runs `if (user) redirect("/")` — an invented scaffold-era pattern. The reference serves the login card to AUTHENTICATED visitors with no redirect (live-verified twice this session: the census's ref `/login` row shows the login card — 0 nav links, the 5-button card — while authed; and an authed wrong-password attempt renders the error banner on the card). No test pins our redirect; removing it is parity. | ref /login census row (authed) + the authed login-error probe |
| S23-P3 | **Med** | **The activities priority-card arrangement** (found mid-remediation while resolving the panel architecture). The reference's priority card is ONE `p-4 border-b` region — title row, tab strip, and the panel content ALL inside it, so its border-b renders BELOW the content at the card's bottom. Our s15-era clone split the content into a CardContent BELOW the toolbar: a separator line between the tab strip and the rows that the reference does NOT ship (pixel-scanned: the reference's only card line is at its bottom; ours drew one under the tab strip), the missing bottom line, and a p-6 (24px) content inset where the reference computes p-4 (16px). A 23-session-old structural drift invisible to class-level pins — the s6 pin recorded the toolbar's classes correctly but never its CONTENT scope. | pixel line-scans on both apps' screenshots + DOM-ancestor probes + bounding-box measurement |
| — | Info | **The 500 error-state page: UNPROBEABLE on the reference** — unknown routes serve its SPA-fallback 200 (the client renders the s12-mirrored 404 view), a garbage API query returns 404, and no request triggered a 500 in 23 sessions. The surface stays unverifiable (same class as the data-gated layers); we ship no `error.tsx` and Next's default boundary would render — no reference contract to mirror, no action. | curl probes on both apps |
| — | Info | **Verified at parity (no action):** the combobox layer (3/3 on /, 5/5 on /accounts, 2/2 on /activities, 4/4 on /reports — both apps' selects and view-switchers are the same Radix combobox family; ours labels the unnamed "Recent deals view" switcher, the s20 documented superset); the calendar day cells (the reference's are clickable DIVs — `min-h-20 sm:min-h-24 … transition-all bg-blue-600 text-white` selected state on today, onclick selection; ours are BUTTONS with `aria-pressed`/`aria-label` = the documented s13 accessible superset; the "October 2026" / "Upcoming Events" / "Agenda View" headings match); the login error banner carries `role=alert` on BOTH apps (live-verified on the reference this session — the s21 visual pin now has its ARIA half confirmed); the reference's 2 `img`s per page are Base44 platform badges (vendor watermark — deliberately not mirrored); the reference's /login empty `aria-live=polite` section is platform announcer chrome (our Toaster viewport = the documented superset); our sidebar `aria-current=2` = superset; the button/haspopup/svg count deltas are data-driven (our seeded rows' per-row action buttons vs the reference's zero-data empty states) plus the documented supersets (th>button sorters, the drawer, checkbox buttons). | the census + targeted probes |

**Census-method lessons this session (→ SKILL §16o):**
- **The auth-state hazard**: the first clone census ran logged-out (an
  earlier probe had logged the session out) — every route redirected to
  /login and produced garbage counts that mis-read as parity gaps.
  Re-login + re-sweep before comparing; verify each row's
  `location.pathname` and a page marker inside the probe.
- **Platform-vs-app element separation**: the reference's `img` counts
  include the base44 watermark badges — strip platform chrome (or
  classify it) before comparing native-element counts.
- **Data-driven count inflation**: DOM-count deltas between a seeded
  clone and a zero-data reference are dominated by per-row action
  buttons — compare chrome-level counts or normalize by row count.
- **The empty-shell panel structure**: the reference's inactive
  tabpanels are EMPTY (content only in the active panel) — Radix mounts
  the shells, the app fills one. Mirror the structure, not a
  content-per-panel refactor.

---

## ToDo — execution order (TDD)

### Phase A — red tests first

1. New `tests/tabs-aria.test.ts` (~14 checks, the established
   source-pin pattern with comment-stripping per the s21/s22 lessons):
   `tabs.tsx` generates ids via `React.useId` and wires every tab with
   `id={uid}-trigger-{tab.id}` + `aria-controls={uid}-content-{tab.id}`;
   a `TabsPanel` component is exported and renders
   `role=tabpanel` + `id={uid}-content-{tab}` +
   `aria-labelledby={uid}-trigger-{tab}` + `hidden` when inactive; the
   Tabs component itself renders NO built-in tabpanel (the activities
   empty-panel retirement); the tablist carries the keydown handler
   with ArrowRight/ArrowLeft/Home/End + wrap + `preventDefault` +
   focus-follows-selection; the three pages (activities/reports/
   settings) render one `TabsPanel` per tab with the per-tab content;
   the login page carries NO `redirect("/")` (S23-P2) and no
   `getSessionUser` import.
2. E2E additions in `tests/e2e/crm.spec.ts` (~5 checks in the reports
   tab test region): the tab→panel wiring is live (a tab's
   `aria-controls` resolves to an existing panel id; the panel's
   `aria-labelledby` resolves back to the tab); all N panels are
   mounted with the inactive ones hidden; ArrowRight moves focus AND
   selection with wrap; Home/End work; the settings tab strip exposes
   the same wiring.

### Phase B — implementation

1. **S23-P1**: rewrite `src/components/ui/tabs.tsx` — keep the three
   visual vocabularies byte-identical (TABS_PILL / TABS_SEGMENTED /
   the underline track — the s12 pins); add `useId` + a TabsContext
   `{uid, value}`; add `id`/`aria-controls` to every tab button; add
   the keydown handler (ArrowRight/ArrowLeft with wrap, Home, End —
   focus the next button + call `onValueChange`, automatic
   activation); export `TabsPanel` (consumes the context; renders the
   wired, hidden-when-inactive shell; accepts className). Tabs renders
   the tablist ONLY (the built-in `<div role=tabpanel>` retired).
2. Migrate the three pages: activities (4 panels inside CardContent —
   the hand-rolled unwired panel div retired), reports (5 panels; the
   loading skeleton renders into the active shell), settings (3
   panels, each carrying the `py-4` spacing).
3. **S23-P2**: remove `if (user) redirect("/")` + the `getSessionUser`
   import from `src/app/login/page.tsx` (keep `force-dynamic` — the
   reference serves /login dynamically and the s19 metadata pins are
   runtime-stable).

### Phase C — gate + live re-verification

Full gate: `bun run lint` → `bun run typecheck` → `bun run test`
(405+) → `bun run build` → `bun run test:e2e` (72+). LIVE on the dev
server: the tab census re-run (N shells + wiring + hidden on inactive
on all three pages — now matching the reference's counts); the
arrow-key flow live-driven on /activities (wrap + Home/End); the
authed /login probe (the card renders, no redirect); the standing
layers spot-check (drawer open/Escape, the head census, the security
headers, the login Callout, the typography spot-probe).

### Phase D — deliverables

The established 23 screenshots re-captured under `docs/screenshots/`
with per-shot URL + content verification; `.env`/`.env.example`
re-verified (no new env surface); docs realigned (README badge + the
tabs/keyboard feature line + counts, AGENTS counts + the session-23
contract block, CLAUDE counts + the tabs-aria suite, PAD matrix +
§7.2 + the tab-contract rows, SKILL v1.20.0 §16o + frontmatter +
project_state, `docs/session_39.md`, this plan's addendum, the outer
worklog); commit on main + SSH-wrapper push.

---

## Addendum — execution record (same session)

**Phase A (red tests):** 15 checks in `tests/tabs-aria.test.ts` (the
established source-pin pattern with comment-stripping) — 14 confirmed
failing / 1 structural pass initially. One check was STRENGTHENED
mid-red (the built-in-tabpanel retirement check passed vacuously on the
old source — its regex stopped at the tablist; replaced with a
role="tabpanel" occurrence-count pin that only TabsPanel satisfies).

**Phase B (implementation):** `tabs.tsx` rewritten around a TabsContext
+ `useId()`. THREE gate-caught corrections mid-implementation:
(a) **the sibling-panels architecture bug** — the first design rendered
the `TabsPanel`s as JSX siblings OUTSIDE the Tabs component, so the
context read `null`, every panel id lost its uid prefix, and ALL panels
computed `active: false` (hidden) — caught by the live wiring probe
(`wired: 0` with ids present) BEFORE any test ran; the fix restructures
Tabs as the reference's wrapper div rendering `[tablist, children]`, so
the panels live inside the Provider. (b) **the reference's real
anatomy discovered during the fix** — probing the reference's DOM to
resolve the architecture revealed the panels live INSIDE the toolbar's
`p-4 border-b` region (S23-P3, the mid-remediation finding: the
activities priority card is ONE region — title + tab strip + content —
with the border-b BELOW the content; our s15-era CardContent split drew
a separator line the reference does not ship and inset the rows at p-6
instead of p-4). (c) **the per-page panel contracts byte-extracted**
(the stock Radix `TabsContent` focus-ring family + `mt-4 space-y-2` /
`mt-2 space-y-4` / `mt-2`), plus the wrapper classes (`""` on
activities, `space-y-6` on settings/reports). The keydown handler's
typing was gate-caught by tsc (button-typed event attached to the
tablist div). The pages migrated with `PriorityRows` /
`ReportSkeletons` extracted as module-level components; the activities
panels got per-tab conditionals after the live probe showed the
inactive shells rendering hidden content (the reference's are EMPTY).

**Phase C (gate + live re-verification):** lint 0/0 · tsc clean ·
**406/406 unit** (+15, 21 suites) · build · **68/68 e2e** (+1 test —
the wiring/shells/keyboard contract on all three strips; the FIRST run
failed twice: the reports skeleton race — the `loading && !data` pass
unmounts the whole Tabs region and the evaluate read ZERO tabs after a
passing `toBeVisible` — fixed by waiting for the post-load
`.recharts-wrapper`; and an Event-dialog flake that passes clean on
re-run and in the final full suite). LIVE on the dev server: the wiring
complete on all three strips (4/4, 5/5, 3/3 wired + backWired;
inactive shells hidden + empty); the keyboard model live-driven
(ArrowRight → focus+selection, End → last, wrap, Home — identical to
the reference's live-probed contract); the panel contracts
BYTE-IDENTICAL (wrapper + shell classes + the 16px/24px/24px gaps,
live-measured equal on both apps); the activities card line structure
fixed (no mid-card separator, the border-b below the content at the
card's bottom, the 16px content inset — pixel-scanned on both apps);
the authed /login serves the card with no redirect; the 390px overflow
sweep re-run clean on all 11 routes; the standing layers spot-checked
post-change.

**Phase D (deliverables):** all 23 screenshots re-captured with
per-shot verification (zero md5 duplicates; shot 23 re-shot with a
fresh signup email — the s22 address persisted in the demo DB and
tripped the "user already exists" banner); `.env`/`.env.example`
re-verified (no env surface); docs realigned (README badge 474 + the
tabs feature row + counts, AGENTS counts + the session-23 contract
block, CLAUDE counts + the tabs-aria suite + the e2e layer, PAD matrix
406/68 + the §5 tab-contract block + the checklist counts, SKILL
v1.20.0 §16o + frontmatter + project_state, `docs/session_39.md`, this
addendum, the outer worklog). Committed on main + SSH-wrapper push.
