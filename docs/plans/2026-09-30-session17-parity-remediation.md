# Session 17 Remediation Plan — The Stock Button/Checkbox Layer + the Icon-Glyph Census (2026-09-30)

**Scope:** Fresh-login DOM audit of the live reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `28678cb`
(baseline gate green: lint 0/0 · tsc clean · 297/297 unit · dev server healthy
on :3000 with `db/custom.db` at the repo root; `.env`
(`DATABASE_URL="file:../db/custom.db"`) / `.env.example` / vitest +
playwright configs re-verified — the task book's config asks remain
satisfied from prior sessions). The audit layer this session: **the icon
glyph census** (icon NAME + SVG path data on every page, both apps — a layer
never swept before), **the topbar account trigger** (the one chrome surface
still hand-written), and **the checkbox anatomy** (every filter rail,
both apps). The mobile navigation — the standing priority — was verified
FIRST: the reference still ships NO mobile nav at 390 (13th consecutive
session: no burger, sidebar `display:none`, mail/bell hidden), our 7-check
drawer regression ran LIVE at 390 **7/7 PASS** (trigger hit-test 36×36 at
16,16; open + 8 links + focus inside the dialog + dual scroll locks;
Escape + lock release; focus-trap wrap; resize-past-md auto-close + lock
release; route-change close). Demo data: **zero in steady state (13th
consecutive session)** — parity remains structural.

**Method:** TDD — new contracts land in `src/lib/page-layout.ts`
(`CHECKBOX`, the re-pinned `TOPBAR_LAYOUT` account keys), pinned by
`tests/page-layout.test.ts`; e2e assertions land in the same commit as the
behavior changes. UI changes land with the full gate plus browser
re-verification at 1512/900/390. The `skills/` folder stays excluded from
all checking, testing and compilation.

---

## Identified Issues, Bugs and Gaps (all DOM-verified this session)

| # | Sev | Issue | Evidence (live DOM / reproduction) |
|---|-----|-------|-----------------------------------|
| S17-P1 | **High** | **The topbar account trigger is hand-written, not the stock ghost Button.** Reference trigger: the stock ghost Button construction — `justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring … hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2` + `flex items-center gap-1 sm:gap-2` (tailwind-merge replacing `inline-flex`/`gap-2`) — with a text span `text-sm font-medium text-gray-700 hidden sm:inline`, a TWO-LEVEL avatar (stock Avatar root `relative flex shrink-0 overflow-hidden rounded-full w-8 h-8` + stock fallback div `w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm`), and a chevron `w-4 h-4 text-gray-500`. Ours: a bare `flex h-9 items-center gap-1 rounded-md px-4 py-2 transition-colors hover:bg-line-soft sm:gap-2` button — NO whitespace-nowrap, NO text-sm/font-medium on the button, **NO focus-visible ring** (keyboard-focus gap, live-verified: the reference shows the 1px near-black ring, ours none), and a ONE-level hand-written avatar span. | outerHTML dumps both apps at 1512; keyboard-focus ring probe |
| S17-P2 | **High** | **Icon glyph drift — 14 surfaces** (icon-name + SVG-path census on every page, both apps; path data compared, not names — lucide renames can hide redesigns and aliases can hide renames). (a) **Sidebar nav ×3**: reference ships `users` (two-person glyph `M16 21v-2a4 4 0 0 0-4-4H6… + circle 9,7,4 + M22 21v-2… + M16 3.13…`), `circle-user` (`circle 12,12,10 + circle 12,10,3 + M7 20.662V19…`), `calendar` (`M8 2v4 + M16 2v4 + rect 18×18 + M3 10h18`); ours ships `User` (one person), `CircleUserRound` (rounder head r=4 + arc shoulders), `CalendarDays` (adds 6 day-dots). All three reference glyphs ARE exported by our lucide-react 0.525 under the renamed canonical names (`Users`/`CircleUser`/`Calendar` — path-verified byte-equal). (b) **Filter buttons ×3** (dashboard `Filter`, leads/contacts `Filters`): the reference ships the OLD lucide `filter` — the straight-edged POLYGON funnel `<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3">`; our 0.525 `Filter` is a RE-EXPORT of the redesigned curved `Funnel` (verified in the package source) and the polygon glyph is exported by NO name in 0.525 — needs a hand-rolled SVG component. (c) **Contacts ×2**: Scan Card ships `scan` (4 corner brackets, no center line; ours `ScanLine` adds the line), Import ships **`download`** (the reference's own quirk — an import button with a download glyph; ours ships `Upload`). (d) **Leads KPI chips ×2**: Won Deals ships `circle-check-big` (`M21.801 10A10 10 0 1 1 17 3.335 + m9 11 3 3L22 4`; ours `CheckCircle2` = the small circle-check), Avg. Sales Cycle ships `calendar` (ours `CalendarDays`). (e) **Calendar KPI chips ×2**: Today's Events ships `calendar` (ours `CalendarDays`), Meetings This Week ships `users` (ours `User`). (f) **Activities quick-log ×2**: Log Meeting ships `calendar` (ours `Video`), Log WhatsApp ships `message-square` (ours `MessageCircle`). | icon census both apps (9 pages); SVG path dumps; lucide 0.525 package source |
| S17-P3 | **High** | **The checkbox anatomy — native inputs where the reference ships stock Radix button checkboxes, on EVERY filter rail.** Reference (accounts 4: Key Account/A/B/C; calendar 10: 6 event types + 4 date filters; activities 5: 4 Activity-Type + the by-type footer): `<button type="button" role="checkbox" aria-checked data-state value="on" class="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground">` — computed checked state bg/border **#171717** (the platform's dark `--primary`, NOT the app blue) with a `Check` h-4 w-4 indicator (#fafafa) inside a `flex items-center justify-center text-current` span that mounts ONLY when checked; unchecked = transparent bg + #171717 border + the bare `shadow` scale; rows `flex items-center space-x-2`, labels `text-sm cursor-pointer` (by-type footer label adds `font-medium`). Ours: native `<input type="checkbox">` with custom `appearance-none … checked:bg-primary focus-visible:ring-2 focus-visible:ring-primary/30` styling — **no check glyph ever renders** (the checked by-type toggle fills blue with no indicator), the checked fill is the APP BLUE not the reference's dark, and the ring is 2px translucent blue not the 1px near-black. | outerHTML + computed dumps both apps; role=checkbox vs input counts (ref: accounts 4/calendar 10/activities 5 buttons, 0 native inputs; ours: 4/10/7 native inputs, 0 buttons) |
| S17-P4 | **Med** | **The default (blue) Button variant ships `shadow-sm` where the reference ships the bare `shadow` scale.** Reference blue primaries (New Account / New Lead / New Event / New Contact / the activities rail Filter): `text-primary-foreground shadow … bg-blue-600 hover:bg-blue-700` — computed `rgba(0,0,0,.1) 0 1px 3px 0, rgba(0,0,0,.1) 0 1px 2px -1px`. Ours: `bg-primary text-primary-foreground shadow-sm` — computed `rgba(0,0,0,.05) 0 1px 2px 0` (one step light; the s9 `--shadow-sm` re-pin pinned the TOKEN, so the variant must use the bare class). Outline buttons are `shadow-sm` on BOTH (verified: Add/Export/Scan Card/Import) — only the default variant diverges. The dark family (DIALOG_SUBMIT + the profile Save) already ships bare `shadow` correctly. | computed boxShadow probes on 5 blue surfaces both apps |
| S17-P5 | **Med** | **The ghost Button variant carries `text-muted` where the reference's ghost has NO base text color.** Reference ghost (the activities rail "Save All" — the one text-bearing ghost rendered at zero data): stock `hover:bg-accent hover:text-accent-foreground` — text inherits the card foreground #0a0a0a. Ours: `text-muted hover:bg-line-soft hover:text-foreground` — the "Save All" label renders gray #6b7280. Invisible on icon-only ghosts; a real text-color diff on text-bearing ghosts. | outerHTML + computed text color, "Save All" both apps |
| — | Info | **Docs gaps (no code):** PAD §7.4 pre-deploy checklist still shows the s15 counts (280/280 · 37/37) vs the §7.1 matrix (297/41); the SKILL frontmatter `project_state` still opens with "280 unit checks + 37 e2e checks". | doc reads this session |
| — | Info | **Verified-aligned (no action):** the reference's dashboard Add/Export = outline sm on both apps (computed-equal token spellings); the profile Save Changes = the dark family + bare shadow on BOTH (ours `bg-neutral-900 … shadow`, ref `bg-primary … shadow` rgb(23,23,23)); reports date-select `calendar` + owner `user` icons already match; the Select triggers/labels in the activities rail compute equal (token spellings); every other icon on all nine pages matches (name + glyph); the account menu itself (role=menu, Profile/Logout) unchanged; mobile-nav 7/7 live; reference mobile-nav absence re-confirmed (13th session); demo data zero (13th session). | probes this session |

---

## ToDo — execution order (TDD)

### Phase A — red tests first

1. `tests/page-layout.test.ts` — update the existing topbar pin + new
   session-17 block:
   - `TOPBAR_LAYOUT.userButton` re-pin: `"flex items-center gap-1 sm:gap-2 [&_svg]:mr-0"` (the stock ghost construction + size + focus ring arrive via `Button`; the `[&_svg]:mr-0` neutralizes the iconGap's trailing-chevron margin — the reference's chevron carries no margin).
   - `TOPBAR_LAYOUT.userAvatarRoot` = `"relative flex shrink-0 overflow-hidden rounded-full w-8 h-8"` and `userAvatarFallback` = `"w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm"`; retire the one-level `userAvatar` string.
   - Source pins: `topbar.tsx` renders the trigger via `<Button variant="ghost"` through `MenuTrigger asChild`, ships the two-level avatar, and no longer carries the hand-written string.
   - `nav-config.ts` imports `Users`, `CircleUser`, `Calendar` (not `User`/`CircleUserRound`/`CalendarDays`).
   - Icon-swap source pins: the three Filter sites use the `FilterPolygon` component; contacts ships `Scan` + `Download` (not ScanLine/Upload); leads chips ship `CircleCheckBig` + `Calendar`; calendar chips ship `Calendar` + `Users`; activities ships `Calendar` (Log Meeting) + `MessageSquare` (Log WhatsApp).
   - The `FilterPolygon` component pin: renders the reference's exact `<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3">`.
   - `CHECKBOX` contract: `control` (the stock Radix string with the dark neutral-900 expression for the reference's #171717 primary — `border-neutral-900 … data-[state=checked]:bg-neutral-900 data-[state=checked]:text-neutral-50`), `indicator` = `"flex items-center justify-center text-current"`, `row` = `"flex items-center space-x-2"`, `label` = `"text-sm cursor-pointer"`.
   - Source rule: `label.tsx` no longer renders `input type="checkbox"`; the call sites (accounts/calendar/activities) use the `onCheckedChange` API.
   - Button variant pins: the default variant carries bare `shadow` (not `shadow-sm`); the ghost variant carries NO `text-muted`.
2. e2e additions (`tests/e2e/crm.spec.ts`):
   - The account trigger: the stock ghost construction on the button (class contains `focus-visible:ring-1`) + the two-level avatar (a `rounded-full` span with an inner fallback div).
   - The sidebar Accounts nav svg carries `lucide-users` (the glyph census, e2e-pinned).
   - The accounts tier filters render `button[role=checkbox]` ×4 (no native checkbox inputs on the page).
   - The New Account button's computed boxShadow matches the bare-shadow signature (`1px 3px`).

### Phase B — implementation

1. `src/components/ui/button.tsx`: default variant `shadow-sm` → `shadow`;
   ghost variant drops `text-muted` (→ `"hover:bg-line-soft hover:text-foreground"`).
2. `src/components/ui/label.tsx`: rebuild `Checkbox` as the stock Radix-style
   button (`role=checkbox`, `aria-checked`, `data-state`, `value="on"`, the
   `CHECKBOX.control` string, a `Check` h-4 w-4 indicator inside
   `CHECKBOX.indicator` mounted only when checked, keyboard-native toggle —
   buttons fire click on Space/Enter) with the `onCheckedChange(boolean)` API;
   the row + label ship the reference strings (`space-x-2` row, `text-sm
   cursor-pointer` label; the by-type footer keeps its `font-medium` label).
3. `src/components/ui/icons.tsx` (new): `FilterPolygon` — the reference's
   old-lucide filter glyph as an inline SVG (lucide-compatible props).
4. `src/components/layout/topbar.tsx`: the trigger renders
   `<Button variant="ghost" className={TOPBAR_LAYOUT.userButton}>` inside
   `MenuTrigger asChild` + the two-level avatar + the chevron.
5. `src/components/layout/nav-config.ts`: `User → Users`,
   `CircleUserRound → CircleUser`, `CalendarDays → Calendar`.
6. Page icon swaps: dashboard `page.tsx` + leads + contacts
   `Filter → FilterPolygon`; contacts `ScanLine → Scan`,
   `Upload → Download`; leads `CheckCircle2 → CircleCheckBig` +
   `CalendarDays → Calendar`; calendar chips `CalendarDays → Calendar` +
   `User → Users`; activities `Video → Calendar` +
   `MessageCircle → MessageSquare`.
7. Checkbox call-site migration: accounts (tier ×4), calendar (types +
   dates), activities (rail group + by-type footer) — `onChange` /
   `e.target.checked` → `onCheckedChange`.

### Phase C — full gate + browser re-verification

lint → typecheck → 297+ unit → `bun run build` (NEVER bare `next build`) →
e2e (41+) → live DOM re-verification at 1512/900/390 on every touched
surface: the account trigger (classes + keyboard focus ring + two-level
avatar), the icon census re-run on both apps (all nine pages name+glyph
equal), the checkbox anatomy (role=checkbox counts, checked-state colors
#171717/#fafafa, the check indicator on the by-type footer), the default
variant shadow (computed on New Account), the ghost "Save All" text color,
the drawer 7/7 re-run, zero 390px overflow on all eleven routes.

### Phase D — deliverables

Screenshots refreshed (the 20 established); `.env` / `.env.example`
re-verified; docs realigned (README counts if moved, AGENTS counts + the
session-17 contract blocks + the polygon-filter lesson, CLAUDE, PAD §7.4
checklist counts + matrix + session-17 notes, SKILL v1.14.0 §16i +
frontmatter project_state, `docs/session_27.md`, this addendum, both
worklogs), commit on main + SSH-wrapper push.

---

## Addendum — execution record (same session)

**Phase A (red tests):** 16 failing checks confirmed RED before any
implementation — the rewritten topbar pin (1) + the session-17 block:
the topbar source rules (2), the nav-config glyph pins (1), the
FilterPolygon component + page rules (2), the icon-swap source rules
(4), the CHECKBOX contract + label.tsx primitive rule + the call-site
onCheckedChange rule (3), the default-variant bare-shadow + ghost
no-text-color pins (2), plus the updated by-type footer e2e assertion.

**Phase B (implementation):** all edits landed as planned — the Button
variant corrections (default `shadow`, ghost without `text-muted`), the
Checkbox rebuilt as the stock Radix-style button primitive
(`onCheckedChange` API, Check indicator, neutral-900/neutral-50
expression) + the seven call-site groups migrated (accounts ×4,
calendar ×10, activities ×6+footer, the edit-account dialog's
Key-account toggle for consistency), `FilterPolygon` created with the
reference's exact polygon + the `lucide lucide-filter` namespacing
classes, the topbar trigger via `<Button variant="ghost">` +
two-level avatar, the nav-config glyph swaps, and the twelve page icon
swaps (one extra site found by the gate: a second `Upload` render in
the contacts import dialog's drop zone).

**Phase C (gate + live re-verification):** lint 0/0 · tsc clean ·
**312/312 unit** (+15 net) · build via `bun run build` · **45/45 e2e**
(+4; mobile-nav 7/7). Mid-flight corrections: three source-pin regexes
re-scoped to import/JSX patterns (they initially matched the session's
own documentation comments); the checkbox-fill e2e assertion hit the
v4 lab()-serialization trap and was normalized through the 1×1 canvas
pixel readback (§16g.4); the first e2e run failed against a stale
reused :3100 server — killed and re-run clean. Live DOM re-verified at
1512/390: the trigger's stock construction + keyboard ring
(rgb(10,10,10) 1px), the two-level avatar, the full icon census at
name+glyph parity, the checkbox anatomy on all rails (Space toggling
native), the polygon Filter, the Save All #0a0a0a, the New Account
bare shadow, the drawer 7/7, zero 390px overflow on all eleven routes.

**Phase D (deliverables):** all 20 screenshots re-captured with
per-shot URL/dialog-state verification (zero duplicates); `.env` /
`.env.example` / `db/` / configs re-verified; docs realigned (README
badge 357 + counts + feature rows, AGENTS counts + five session-17
contract blocks, CLAUDE counts + test strategy, PAD matrix 312/45 +
§7.4 checklist fix + session-17 notes, SKILL v1.14.0 §16i +
frontmatter project_state fix, `docs/session_27.md`, this addendum,
both worklogs). Committed on main + SSH-wrapper push.
