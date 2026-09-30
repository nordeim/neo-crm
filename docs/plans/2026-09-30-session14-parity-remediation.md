# Session 14 Remediation Plan — Settings Defaults/Data Tab Structure + Danger Zone Rebuild + /Profile Casing + line-soft Re-Pin (2026-09-30)

**Scope:** Fresh-login DOM audit of the live reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `b2da6bd`
+`08ed611` (baseline gate green: lint 0/0 · tsc clean · 244/244 unit · dev
server healthy on :3000 with `db/custom.db` at the repo root; `.env` /
`.env.example` / vitest + playwright configs verified). The reference's demo
data is STILL zero (tenth consecutive session) — parity remains structural.
All reference DOM was captured at **1512×945** with computed-style probes on
both apps. The mobile-nav regression was re-verified LIVE at 390px before any
changes (7/7 PASS: header-trigger hit-test, drawer open with 8 links + focus
landing INSIDE the dialog on the in-panel close button, dual scroll locks,
Escape + lock restore, focus-trap wrap, resize-past-md auto-close,
route-change close) and the 390px overflow sweep is clean on all ten routes.
The previously-pinned families were re-probed FIRST (the reference is a
moving target): dashboard KPI cards/foreground/base-font/grids/sparklines,
per-page CardTitle map, button radii, calendar day cells, account-menu
anatomy, by-type card, reports tabs 1+2, login family, th/td densities,
border tokens — **all stable, no drift**. The audit then went after the
unprobed layers named in `docs/session_19.md`: the settings **Defaults and
Data tabs** (only the CRM Configuration tab had ever been deep-compared —
the other two tabs carry REAL structural diffs), the settings picklist
interactive flows, keyboard focus order, the `/Profile` casing route, and
the auth surface (where the reference HAS moved — it removed the signup
flow).

**Method:** TDD — new contracts land in `src/lib/page-layout.ts`
(`SETTINGS_DEFAULTS`, `SETTINGS_DATA`, `SETTINGS_DANGER` groups + the
`CARD_TITLE_OVERRIDE.settings` scope refinement + the line-soft re-pin in
`tests/design-tokens.test.ts`), a routing pin for the `/Profile` redirect,
and e2e assertions land in the same commits as the behavior changes. UI
changes land with the full gate plus browser re-verification at
1512/1024/768/700/390. The `skills/` folder stays excluded from all
checking, testing and compilation.

---

## Identified Issues, Bugs and Gaps (all DOM-verified unless noted)

| # | Sev | Issue | Evidence (live DOM / reproduction) |
|---|-----|-------|-----------------------------------|
| S14-P1 | **High** | **The settings Defaults tab renders a RESPONSIVE 3-COLUMN GRID; the reference is a single column.** Reference "Default Values" card: body `p-6 pt-0 space-y-4` (one column, 16px between groups — computed `g1MT: 16px`), six groups each `space-y-2` (label→control computed gap 12px), CardTitle the STOCK `font-semibold leading-none tracking-tight` (16px), header subtitle `text-sm text-muted-foreground` (computed 14px / #737373) "Set default values for new records", four stock Inputs (AED / new / B / 3) + two stock Select triggers (`flex h-9 w-full items-center justify-between …` showing Month / Monday). Ours: body `p-6 pt-0 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3` (three columns at 1512 — a visible layout diff), groups `grid gap-1.5` (computed 6px label gap), CardTitle `text-lg` (the settings override applied page-wide), subtitle `text-xs text-muted` (12px / #6b7280 — BOTH size and color wrong). The six controls + values + placeholder vocabularies already match. | full card tree walks + computed spacing probes both apps at 1512 |
| S14-P2 | **High** | **The settings Data tab diverges in title text, body layout, and button family.** Reference: three cards — (1) "**Import** Templates" (ours says just "Templates"), body `p-6 pt-0 space-y-2` — a VERTICAL stack of three stock OUTLINE default-size buttons (`border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2` + `w-full sm:w-auto`, download icon `w-4 h-4 mr-2` on the svg): Download Contacts/Accounts/Leads Template; (2) "Export Data", body `p-6 pt-0 space-y-2` — same family ×4 (Contacts/Accounts/Leads/Activities); (3) "Danger Zone" (P3). All three ride the STOCK CardTitle. Ours: bodies `flex flex-wrap gap-2` (horizontal wrap), buttons `variant="secondary" size="sm"` (h-8 px-3 text-xs — one size smaller than the reference's h-9 px-4 text-sm, icon `h-3.5 w-3.5`, no `w-full sm:w-auto`), titles text-lg. | per-card innerHTML dumps + button class extraction + computed sizes both apps |
| S14-P3 | **Med** | **The Danger Zone card is a tinted warning surface on the reference — ours is a plain card with extra copy.** Reference: card `rounded-xl border text-card-foreground shadow border-red-200 bg-red-50` (computed border rgb(254,202,202) = red-200; ours has border-rose-200 — computed-equal — but NO `bg-red-50`), title `font-semibold leading-none tracking-tight text-red-700 flex items-center gap-2` with a `circle-alert` icon `w-5 h-5` (ours: `text-lg text-danger` = #ef4444 — the WRONG red, 18px, no icon), body `p-6 pt-0 space-y-4` containing ONLY a `space-y-2` group (label `Type "RESET" to confirm` + stock Input with `max-w-xs`, placeholder "RESET") and then the destructive button BELOW it (`bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 h-9 px-4 py-2`; computed bg #ef4444 ✓ but fg rgb(250,250,250) = #fafafa vs our `text-white` #ffffff). Ours: body `flex flex-col gap-3` with an EXTRA warning paragraph ("Reset deletes all accounts…") the reference does not ship, and the input+button in one `flex max-w-md gap-2` ROW. | card class dumps + computed colors + body child enumeration both apps |
| S14-P4 | **Med** | **`/Profile` (capital P) 404s on the clone; the reference serves BOTH casings.** `curl` both apps: reference `/Profile` → 200 (the account menu's Profile item is an `<a href="/Profile">`) and `/profile` → 200; ours `/Profile` → 404 (our designed 404 page) and `/profile` → 200. Fix: a `next.config.ts` redirect `/Profile` → `/profile` (permanent: false) — our canonical route stays lowercase (all internal links + tests keep pointing at `/profile`), but the reference's casing now resolves exactly like it. | curl status sweep + account-menu href extraction on both apps |
| S14-P5 | **Med** | **`--color-line-soft` (#f3f4f6) is a scaffold-era assumption — the reference's muted/accent family is #f5f5f5.** Computed today on the live reference: the settings segmented TAB TRACK (`bg-muted`) = rgb(245,245,245) and a `bg-accent` probe = rgb(245,245,245); ours renders the same track at rgb(243,244,246) (`bg-line-soft`, gray-100). The token dates from the initial scaffold commit (git log -S) and was never live-pinned; `tests/design-tokens.test.ts` merely pinned the assumption (same class as the s13 14px-base-font finding). It rides 27 class usages, ALL in the muted/accent role: the segmented/pill tab tracks, outline + ghost button hovers, select item hovers, the s13 MENU_ITEM `focus:bg-line-soft` (where the reference uses `focus:bg-accent`), table row hovers, tab count badges, and never-comparable own-surfaces (picklist chips, skeleton). Re-pin `--color-line-soft: #f5f5f5`. | computed bg probes on the live tab tracks + `bg-accent`/`bg-muted` token probes + git -S history + full usage census |
| S14-P6 | Info | **Verified-aligned (no action):** all previously-pinned families STABLE (no reference drift on the re-probed surfaces); settings CRM Configuration tab fully aligned (picklist cards `space-y-2 mb-4` empty state computed-equal `text-muted` #6b7280 = the reference's `text-gray-500`; add button bg rgb(23,23,23) = our neutral-900 ✓; "Add new industrie" typo ✓; add flow DEAD on the reference — button + Enter both no-op, no toast — our functional add/remove stays the documented superset, the dead-exports precedent); keyboard focus order aligned through the dashboard (sidebar links → search → icon buttons → account → page buttons; our aria-labels are the accessible superset); login page family aligned (h1/subtitle/Google/divider/footer texts + classes; the footer utility SET identical; our "Need an account? Sign up" is a real link where the reference ships a dead button — superset); the reference REMOVED its signup flow (the login Sign-up button no longer navigates and `/signup` renders the 404 view, SSR title "Signup \| NEO CRM") — our working `/signup` stays the documented functional superset; logout leaves the reference on `/` as "Hi, Guest" (ours redirects to /login — our safer behavior, documented); settings h1 `text-3xl font-bold text-gray-900` + `mb-6` header + subtitle text ✓; destructive bg #ef4444 ✓; reports tabs 1+2 structure ✓; demo data zero (10th session). | computed sweeps + regression runs listed above |

---

## ToDo — execution order (TDD)

### Phase A — red tests first

1. `tests/design-tokens.test.ts`: re-pin `--color-line-soft: #f5f5f5`
   (S14-P5; the old #f3f4f6 line flips to the new expectation with the
   scaffold-era comment corrected).
2. `tests/page-layout.test.ts` new pins:
   - `SETTINGS_DEFAULTS` group: body `p-6 pt-0 space-y-4`, group
     `space-y-2`, CardTitle = stock (NO settings text-lg override on this
     tab), subtitle `text-sm text-muted-ink`, select triggers `w-full`.
   - `SETTINGS_DATA` group: card title "Import Templates", bodies
     `p-6 pt-0 space-y-2`, button = outline default size + `w-full
     sm:w-auto`, icon `w-4 h-4` (S14-P2).
   - `SETTINGS_DANGER` group: card `border-red-200 bg-red-50`, title =
     stock + `text-red-700 flex items-center gap-2` with the circle-alert
     `w-5 h-5`, body `p-6 pt-0 space-y-4`, input `max-w-xs` +
     placeholder "RESET", label `Type "RESET" to confirm`, reset button
     fg = `text-neutral-50` (#fafafa) (S14-P3).
   - `CARD_TITLE_OVERRIDE.settings` scope refinement: the settings
     override applies ONLY to the five CRM Configuration picklist cards;
     the Defaults + Data cards ride the stock default (S14-P1/P2).
3. `tests/profile-route.test.ts` (NEW): the Next config redirects
   `/Profile` → `/profile` (import `next.config.ts` redirects; assert the
   source/destination pair + `permanent: false`).

### Phase B — implementation

1. `src/app/globals.css`: `--color-line-soft: #f5f5f5` (S14-P5 — one
   token, 27 surfaces).
2. `src/lib/page-layout.ts`: the three new contract groups + the
   `CARD_TITLE_OVERRIDE.settings` refinement (the override stays for the
   ConfigEditor's ListEditor; the Defaults/Data cards drop it).
3. `src/app/(app)/settings/settings-page.tsx`:
   - DefaultsEditor: body → `p-6 pt-0 space-y-4`; groups → `space-y-2`;
     CardTitle stock; subtitle → `text-sm text-muted-ink`.
   - Data tab: "Templates" → "Import Templates"; both list bodies →
     `p-6 pt-0 space-y-2`; buttons → `variant="outline"` default size +
     `w-full sm:w-auto` + Download icon `h-4 w-4` (the mr-2 gap rides
     BUTTON_BASE.iconGap).
   - Danger Zone: card + `bg-red-50` (border-red-200 stays —
     computed-equal); title → stock + `text-red-700 flex items-center
     gap-2` + `AlertCircle` icon `h-5 w-5`; body → `p-6 pt-0 space-y-4`;
     drop the extra warning paragraph; the input group (label +
     `max-w-xs` input) then the destructive button below it; reset button
     + `text-neutral-50`.
4. `next.config.ts`: `async redirects()` → `{ source: "/Profile",
   destination: "/profile", permanent: false }` (S14-P4).

### Phase C — full gate + browser re-verification

lint → typecheck → 244+ unit → `bun run build` (NEVER bare `next build` —
the standalone server needs the static/public copy steps) → e2e (31+) →
DOM re-verification at 1512/1024/768/700/390 (the Defaults single-column
layout + label gaps, the Data tab stacks + button sizes + titles, the
Danger Zone tint/icon/layout, the `/Profile` redirect via curl, the tab
track + hover washes at #f5f5f5) → zero 390px overflow on all ten routes.

### Phase D — deliverables

Screenshots refreshed (13) + the settings Defaults/Data captures; `.env`
/ `.env.example` re-verified; docs realigned (README counts, AGENTS
session-14 contract blocks, CLAUDE, PAD test matrix + session-14 notes,
SKILL v1.11.0 §16f, `docs/session_21.md`, this addendum, both worklogs),
commit on main + SSH-wrapper push.

---

## Addendum — execution record (same session)

**Phase A (red tests):** 18 failing checks confirmed RED before any
implementation — 12 new `tests/page-layout.test.ts` pins (the
SETTINGS_DEFAULTS / SETTINGS_DATA / SETTINGS_DANGER contract groups +
the settings CardTitle override-scope source assertion), 1
`tests/design-tokens.test.ts` re-pin (line-soft #f5f5f5), and the new
`tests/profile-route.test.ts` (its first shape pinned a next.config.ts
redirect — see the Phase B lesson).

**Phase B (implementation):** the globals.css line-soft re-pin; the
three page-layout.ts contract groups; the settings-page rebuild
(DefaultsEditor single-column `space-y-4`/`space-y-2` + stock title +
`text-sm text-muted-ink` subtitle; the Data tab "Import Templates" +
vertical `space-y-2` stacks of outline default-size `w-full sm:w-auto`
buttons; the Danger Zone tinted card + circle-alert title + stacked
confirm-input-then-button body). The `/Profile` alias took THREE
attempts, each caught by the gate before it could ship: (1) a separate
`export async function redirects()` in next.config.ts is silently
ignored (the routes-manifest carried no redirect — the e2e caught it);
(2) moving redirects() into the config object looped
(ERR_TOO_MANY_REDIRECTS — Next matches config redirects
case-insensitively, so the rule matches its own destination), and the
`caseSensitive: true` escape hatch failed the build ("Invalid redirect
found" — not a valid per-redirect property in Next 16); (3) the SHIPPED
fix is the thin route folder `src/app/Profile/page.tsx` →
`redirect("/profile")` (case-exact by filesystem, outside the (app)
group so the alias skips the shell + guard), with the
profile-route test rewritten to pin the alias shape + the no-config-
redirect rule.

**Mid-verification finding (after the suite was green):** the live
label→control gap on the rebuilt Defaults tab measured ~3px where the
reference computes 12px — a NEW Tailwind v4 hazard (the s11 space-y
flip's second face): v4's `:where(& > :not(:last-child))
{ margin-bottom }` lands on the INLINE `<label>`, and vertical margins
on inline elements DO NOT APPLY, so the gap silently collapsed. Fixed
by keeping the literal `space-y-2` group + explicit `mt-2` on every
control (contract `controlMt` on both SETTINGS_DEFAULTS and
SETTINGS_DANGER; 7 call sites); after the fix the label-top-to-
control-top distance is 28px on BOTH apps (a residual 1px rect
difference is inline-box font-metric rounding, verified layout-equal).

**Phase C (gate + live re-verification):** lint 0/0 · tsc clean ·
**262/262 unit** (+18; profile-route rewritten to the alias shape) ·
build via `bun run build` · **34/34 e2e** (+3: the Defaults
single-column layout, the Data tab + Danger Zone structure, the
/Profile alias; one locator fix during the run — "Personal
Information" is a CardTitle `<div>`, not a heading). Live DOM
re-verified on a fresh dev server at 1512 + 390 on every touched
surface (the 28px geometry, the 36px/6px stacked buttons, the tinted
Danger Zone, the 307 alias, the #f5f5f5 tracks); zero 390px overflow
on all ELEVEN routes (incl. /Profile). VLM rounds: two usable
(ALIGNED on Defaults, SAME on Data); two hallucinated (non-existent
"General Settings"/"Notify Owner" elements; one round stated it could
not see the images) — DOM-discounted per the standing rule.

**Phase D (deliverables):** 13 screenshots refreshed under
`docs/screenshots/`; `.env` / `.env.example` / `db/` / vitest +
playwright configs re-verified; docs realigned (README badge 296 +
counts + the settings feature row, AGENTS counts + the session-14
contract blocks + the space-y inline-label hazard + the auth-drift
note, CLAUDE counts, PAD tree + matrix + session-14 notes, SKILL
v1.11.0 §16f + the stale color-reference table fixed,
`docs/session_21.md`, this addendum, both worklogs). Committed on
main + SSH-wrapper push.
