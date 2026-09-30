# Session 15 Remediation Plan — The Entity-Dialog Geometry Layer (stock shadcn chrome + per-family body anatomy) (2026-09-30)

**Scope:** Fresh-login DOM audit of the live reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `012071c`
(baseline gate green: lint 0/0 · tsc clean · 262/262 unit · dev server
healthy on :3000 with `db/custom.db` at the repo root; `.env`
(`DATABASE_URL="file:../db/custom.db"`) / `.env.example` / vitest +
playwright configs verified — the task book's config asks were already
satisfied by prior sessions and re-verified this session). The reference's
demo data is STILL zero (11th consecutive session) — parity remains
structural. All reference DOM was captured at **1512×945** and **390×844**
with computed-style probes on both apps. The mobile-nav regression was
re-verified LIVE at 390px before any changes (7/7 PASS: header-trigger
hit-test scoped to `header button[aria-expanded]`, drawer open with 8
links + focus landing INSIDE the dialog, dual scroll locks, Escape +
lock restore, focus-trap wrap, resize-past-md auto-close, route-change
close) and the 390px overflow sweep is clean on all eleven routes
(incl. `/Profile`). The previously-pinned families were re-probed FIRST
(the moving-target rule): body 16px/#0a0a0a, h1 30px gray-900, KPI cards
de-hovered `rounded-xl border bg-card shadow`, dashed `3 3` `#ccc`
grids, 6px button radii, sidebar nav (20px icons, white/10 active — the
clone's oklab serialization is v4's color-mix output, computed-equal),
the 404 family (72px/300 slate-300 + divider + Go Home pill), the login
family incl. the full mobile card at 390 (358px card, 24px h1, 44px
inputs, 12px submit radius — all aligned), the mobile topbar (mail/bell
`display:none` below md on both; our burger is the documented fix), the
bell/mail buttons (dead on BOTH apps — parity), and the auth surface
(the reference's `/signup` still renders the 404 view when logged in —
the s14 drift stands; our functional `/signup` stays the documented
superset). The reference still ships NO mobile navigation (11th
session) — our drawer remains the deliberate fix, and its internals
were re-probed for v4 hazards this session (panel h-dvh 844 = innerHeight
✓, `space-y-1` gaps land on BLOCK nav links — no inline-label hazard ✓,
overlay blur 2px ✓, `#2563eb` panel ✓, transform states ✓).

**The session's finding layer:** the audit went after the **entity-dialog
geometry** — the one interactive layer every session since s5 has used
but never deep-compared beyond field SETS. All five reference create
dialogs were opened on the live app and fully mapped (outerHTML dumps +
computed probes at 1512 and 390): Lead, Account, Contact, Event,
Activity. The chrome AND the body anatomy diverge from ours in
structural, visible ways (documented below).

**Method:** TDD — new contracts land in `src/lib/page-layout.ts`
(`DIALOG_FAMILY`: DIALOG_CONTENT / DIALOG_OVERLAY / DIALOG_HEADER /
DIALOG_FOOTER / DIALOG_FOOTER_WIDE / DIALOG_CLOSE / DIALOG_GROUP /
DIALOG_BARE_GROUP / DIALOG_FIELDS_WRAPPER / plus the per-dialog body
contracts LEAD_DIALOG / ACCOUNT_DIALOG / CONTACT_DIALOG /
CONTACT_AVATAR / EVENT_DIALOG / ACTIVITY_DIALOG), pinned by
`tests/page-layout.test.ts`; e2e assertions land in the same commit as
the behavior changes. UI changes land with the full gate plus browser
re-verification at 1512/1024/768/700/390. The `skills/` folder stays
excluded from all checking, testing and compilation.

---

## Identified Issues, Bugs and Gaps (all DOM-verified)

| # | Sev | Issue | Evidence (live DOM / reproduction) |
|---|-----|-------|-----------------------------------|
| S15-P1 | **High** | **DialogContent ships scaffold-era geometry, not the reference's stock shadcn shape.** Reference (all five dialogs): `fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 … data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-w-lg` (Event/Activity add `max-w-2xl` = 672px). Computed at 1512: radius **8px** (rounded-lg ≥sm), bg white, border #e5e5e5, shadow-lg. At 390: **full-bleed 390px wide (left 0), radius 0px** — `sm:rounded-lg` drops below 640. Ours: `w-[calc(100vw-2rem)] max-w-lg … rounded-2xl border border-line bg-surface p-6 shadow-xl` — radius 16px at ALL widths, 358px at 390, NO slide animations. | outerHTML dumps all five dialogs + computed radius/width probes at 1512 + 390 |
| S15-P2 | **High** | **DialogOverlay is a custom blur wash; the reference ships the stock black/80.** Reference: `fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in … fade-in-0` — NO backdrop blur, 80% black. Ours: `bg-gray-900/45 backdrop-blur-[2px]`. | overlay class extraction from the live portal |
| S15-P3 | **High** | **DialogHeader: the reference centers the title below `sm`.** Reference: `flex flex-col space-y-1.5 text-center sm:text-left` (computed `text-align: center` at 390, `left` at 1512). Ours: `flex flex-col gap-1.5 pr-6 text-left` — always left-aligned, no responsive centering. | computed text-align probes both widths |
| S15-P4 | **High** | **The reference's create dialogs ship NO DialogDescription — ours adds one on all five.** Reference headers render ONLY the h2 (`<div class="flex flex-col space-y-1.5 …"><h2 …>Create New Lead</h2></div>` — zero `<p>` elements in the whole dialog, verified on all five). Ours renders a description line on every dialog ("Track a new sales opportunity." etc.). | `anyP:[]` probes + header outerHTML on all five reference dialogs |
| S15-P5 | **High** | **DialogFooter: two families on the reference, one custom on ours.** Lead/Account/Contact (max-w-lg family): stock `flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2` — computed `column-reverse` + gap `normal` (buttons TOUCH when stacked at 390) and 8px margin between at sm. Event/Activity (max-w-2xl family): `flex justify-end gap-3 pt-4` (row, 12px gap, 16px top padding). Ours: one variant everywhere — `flex flex-col-reverse gap-2 sm:flex-row sm:justify-end` (8px gap also when stacked). | footer class dumps + computed flexDirection/gap at 1512 + 390 |
| S15-P6 | **Med** | **The dialog close X is the stock opacity pattern on the reference.** Reference: `absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none …` (X h-4 w-4 + sr-only). Ours: `rounded-md p-1 text-subtle transition-colors hover:bg-line-soft hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`. | close-button outerHTML both apps |
| S15-P7 | **High** | **Field groups: the reference's max-w-lg dialogs use `space-y-2` groups (12px label→control gap, 28px top-to-top — the SAME geometry the s14 settings fix pinned); ours uses `grid gap-1.5` (6px gap).** Reference Lead/Account/Contact groups: `<div class="space-y-2"><label …/><input …/></div>`, computed gap 12px / top-to-top 28px. Ours: `grid gap-1.5` → 6px / ~20px. Under v4 the literal `space-y-2` collapses on the INLINE label (the s14 hazard) — the fix is the established `controlMt` pattern: group `space-y-2` + explicit `mt-2` on the control. | group class dumps + computed gap/top-to-top measurements both apps |
| S15-P8 | **High** | **Fields wrapper: the reference wraps all fields in a `py-4` grid inside the form; ours makes the form itself the grid (no wrapper, no padding).** Reference Lead: `form > div.grid.gap-4.py-4 > groups`; Contact: `div.grid.gap-6.py-4`; Account: `div.grid.grid-cols-2.gap-4.py-4` (the WHOLE body is 2-col — pairs Name/Industry, Email/Phone, Website/Annual Revenue, Employees/Status). Ours: `form.grid.gap-4 > groups` directly. | form child enumeration all three dialogs |
| S15-P9 | **High** | **Lead dialog Status + Source sit side-by-side in a `grid grid-cols-2 gap-4`** (162px cells at 390 — the 2-col holds at ALL widths); ours stacks them. | DOM probe at 1512 + 390 |
| S15-P10 | **High** | **Account dialog body is 2-column** (`grid grid-cols-2 gap-4 py-4`); ours is single-column. | field-order extraction + wrapper class dump |
| S15-P11 | **High** | **Contact dialog ships an avatar section ours does not have.** Reference body `grid gap-6 py-4` with: (1) `flex flex-col items-center gap-4 pb-4 border-b` — a `w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center` avatar circle with a `text-white font-bold text-3xl` initials span (empty at zero input), an `absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50` camera button (`lucide-camera w-4 h-4 text-blue-600`) + a hidden file input, and the **Name field INSIDE the section** (`w-full space-y-2`); (2) `space-y-4` (Email + Phone); (3) `space-y-4` (Company + Position); (4) `space-y-2` (How did you meet? combobox). Ours: flat single-column grid gap-4, no avatar. | full structure tree + computed gradient/camera probes |
| S15-P12 | **High** | **Event dialog: max-w-2xl (672px), `space-y-4` form, BARE field pairs, one-off BLUE submit.** Reference: `max-w-2xl`; form `space-y-4` with UNCLASSED divs for Title/Description/Location (label+control direct children — computed 4px gap) and `grid grid-cols-2 gap-4` for (Event Type + Status) and (Start + End) — and **Related To sits ALONE in a grid-cols-2** (second cell empty, a reference quirk); Description is a `min-h-[60px]` textarea; footer `flex justify-end gap-3 pt-4`; submit **`bg-blue-600 hover:bg-blue-700`** (the only blue submit — every other dialog is the dark stock primary). Ours: max-w-lg, grid gap-4 groups everywhere, stock footer, dark submit. | form children probe + footer button class extraction + computed submit bg |
| S15-P13 | **High** | **Activity dialog: max-w-2xl + `space-y-4` form with bare pairs in 2-col grids.** Reference: `grid grid-cols-2 gap-4` (Activity Type + Date & Time), unclassed Description (textarea min-h-[60px]), `grid grid-cols-2 gap-4` (Related To (Type) + Related To (Name)), footer `flex justify-end gap-3 pt-4`, dark submit. Ours: max-w-lg, grid gap-4 groups, stock footer. | form children probe + cell-internal probes (bare, 4px gaps) |
| S15-P14 | **Med** | **The reference's create-dialog inputs carry NO placeholder attributes; ours invents them.** Verified `placeholder="` count = 0 in all five reference dialog dumps; ours ships invented placeholders ("Acme — 50 licenses", "buyer@acme.com", "+971 50 123 4567", "Acme Industries", "25000", "Enter location or meeting link", "e.g., John Doe", "Enter activity details..." …). The e2e lead-creation test locates by LABEL — removal is test-safe. | placeholder census both apps |
| S15-P15 | Info | **Verified-aligned (no action):** dialog titles (Create New Lead / Create New Account / Create New Contact / New Event / Log Activity) ✓; submit texts (Create Lead / Create Account / Create Contact / Create Event / Log Activity) ✓; field sets + order ✓ (incl. Account's Industry as a FREEFORM input — ours already ships the datalist superset); stock input anatomy (h-9, `border-input` #e5e5e5, transparent, `text-base md:text-sm`) ✓ computed-equal; Cancel = stock outline computed-equal (white bg, #e5e5e5 border, #f5f5f5 hover) ✓; dark submits rgb(23,23,23)/#fafafa ✓ = our DIALOG_SUBMIT neutral-900 pin; Status/Source combobox + hidden native select pattern ✓; "How did you meet?" combobox ✓; all previously-pinned families stable (dashboard/sidebar/404/login/calendar-cells/reports/settings/borders); demo data zero (11th); reference mobile nav still absent; our mobile drawer internals healthy (no v4 hazards). | computed sweeps + regression runs listed above |

---

## ToDo — execution order (TDD)

### Phase A — red tests first

1. `tests/page-layout.test.ts` new `DIALOG_FAMILY` pins:
   - `DIALOG_CONTENT`: the stock string — `w-full`, `sm:rounded-lg`,
     `shadow-lg`, `bg-background`-computed tokens, the four slide
     animation classes, `max-w-lg` default.
   - `DIALOG_OVERLAY`: `bg-black/80`, NO `backdrop-blur`.
   - `DIALOG_HEADER`: `text-center sm:text-left` + `space-y-1.5`.
   - `DIALOG_FOOTER`: `flex flex-col-reverse sm:flex-row
     sm:justify-end sm:space-x-2` (NO gap class).
   - `DIALOG_FOOTER_WIDE`: `flex justify-end gap-3 pt-4`.
   - `DIALOG_CLOSE`: stock `rounded-sm opacity-70 … hover:opacity-100`
     (no bg/padding classes).
   - `DIALOG_GROUP` (`space-y-2` + `controlMt` mt-2 — the s14 pattern
     extended to dialogs) and `DIALOG_BARE_GROUP` (unclassed div).
   - `DIALOG_FIELDS_WRAPPER`: `grid gap-4 py-4` (gap-6 contact variant).
   - `LEAD_DIALOG`: Status+Source `grid grid-cols-2 gap-4`.
   - `ACCOUNT_DIALOG`: body `grid grid-cols-2 gap-4 py-4`.
   - `CONTACT_DIALOG`: body `grid gap-6 py-4` + the avatar-section
     contract (`CONTACT_AVATAR`: the gradient circle, initials span,
     camera button, hidden file input, Name inside the section) + the
     two `space-y-4` pair groups.
   - `EVENT_DIALOG`: `max-w-2xl`, form `space-y-4`, the two
     grid-cols-2 pairs + the Related-To-alone grid, textarea
     `min-h-[60px]`, submit `bg-blue-600 hover:bg-blue-700`.
   - `ACTIVITY_DIALOG`: `max-w-2xl`, form `space-y-4`, the two
     grid-cols-2 pairs, the bare Description, `DIALOG_FOOTER_WIDE`.
   - No-description rule: a source assertion that `entity-dialogs.tsx`
     renders no `DialogDescription` (the five create dialogs).
   - No-placeholder rule: a source assertion that `entity-dialogs.tsx`
     carries no `placeholder=` attributes.
2. e2e additions (`tests/e2e/crm.spec.ts`):
   - Lead dialog at 390: full-bleed width (390), radius 0, centered
     title, Status/Source side-by-side.
   - Contact dialog: avatar section present (gradient circle + camera
     button) with the Name field inside it.
   - Event dialog: 672px width cap + blue submit.

### Phase B — implementation

1. `src/components/ui/dialog.tsx`:
   - `DialogContent` → the stock geometry (keep our computed-equal token
     spellings where they exist — `border` default line, `bg-surface`
     ≡ `bg-background` white — but adopt the STRUCTURE: `w-full`,
     `sm:rounded-lg`, `shadow-lg`, the slide-in/out animation classes;
     `max-w-lg` stays the default, overridable via className for the
     max-w-2xl family).
   - `DialogOverlay` → `bg-black/80`, drop the blur.
   - `DialogHeader` → `flex flex-col space-y-1.5 text-center
     sm:text-left` (drop `pr-6` — the stock has none; the X is
     `opacity`-pattern so it needs no title clearance).
   - `DialogFooter` → the stock col-reverse string (no gap class).
   - The close X → the stock opacity pattern.
2. `src/components/shared/entity-dialogs.tsx` — all five dialogs:
   - Drop every `DialogDescription` render (create AND edit headers —
     the reference ships none anywhere).
   - Lead: form (no class) > `grid gap-4 py-4` wrapper > `space-y-2`
     + `mt-2` groups for the five single fields + `grid grid-cols-2
     gap-4` (Status + Source); remove placeholders.
   - Account: wrapper `grid grid-cols-2 gap-4 py-4` with the four
     pairs; remove placeholders.
   - Contact: wrapper `grid gap-6 py-4`; the avatar section (gradient
     circle + live initials from the name field + camera button +
     hidden file input + Name inside); `space-y-4` pair groups for
     Email/Phone and Company/Position; `space-y-2` + mt-2 for How-did-
     you-meet; remove placeholders.
   - Event: `DialogContent className="max-w-2xl"`; form `space-y-4`;
     bare (unclassed) divs for Title/Description/Location; grid-cols-2
     pairs (Type+Status, Start+End); Related To alone in a grid-cols-2;
     textarea `min-h-[60px]`; footer `DIALOG_FOOTER_WIDE`; submit
     `bg-blue-600 hover:bg-blue-700` in CREATE mode (edit keeps the
     dark superset — unverifiable surface); remove placeholders.
   - Activity: `max-w-2xl`; form `space-y-4`; grid-cols-2 pairs (Type+
     DateTime, RelatedType+RelatedName); bare Description textarea
     `min-h-[60px]`; footer `DIALOG_FOOTER_WIDE`; remove placeholders.
   - EDIT dialogs keep the field superset (documented) but ride the new
     chrome + group anatomy (the geometry is shared chrome, not fields).
3. The contacts scan-card dialog keeps `DialogDescription` (our
   superset surface, unverifiable on the reference — the dead-exports
   precedent) but inherits the new stock chrome via the shared kit.

### Phase C — full gate + browser re-verification

lint → typecheck → 262+ unit → `bun run build` (NEVER bare `next build`)
→ e2e (34+) → DOM re-verification at 1512/1024/768/700/390 (the stock
content geometry incl. the 390 full-bleed + radius 0 + centered titles,
the 12px/28px group geometry, the Account 2-col, the Lead Status/Source
pair at 390, the Contact avatar section, the Event/Activity 672px +
bare-pair 4px gaps + footers, the blue Event submit, the black/80
overlay) → zero 390px overflow on all eleven routes → mobile-nav
regression re-run (7/7 must stay green — the drawer shares no classes
with the dialog kit, but the gate re-proves it).

### Phase D — deliverables

Screenshots refreshed (13+) incl. the five create dialogs at 1512 + the
Lead dialog at 390; `.env` / `.env.example` re-verified; docs realigned
(README e2e coverage, AGENTS counts + the session-15 contract blocks +
the two-family footer/submit rules, CLAUDE, PAD matrix + session-15
notes, SKILL v1.12.0 §16g, `docs/session_23.md`, this addendum, both
worklogs), commit on main + SSH-wrapper push.

---

## Addendum — execution record (same session)

**Phase A (red tests):** 18 failing checks confirmed RED before any
implementation — the DIALOG_FAMILY pins in `tests/page-layout.test.ts`
(six chrome checks: content/overlay/header/footer×2/close; five body
checks: group/bare-group/wrapper/lead-pair/textarea; four per-dialog
checks: account/contact/event/activity; two source rules:
no-DialogDescription + no-placeholder in `entity-dialogs.tsx`) + the
three e2e additions.

**Phase B (implementation):** `dialog.tsx` rebuilt on the stock chrome
(DIALOG_CONTENT/DIALOG_OVERLAY/DIALOG_HEADER/DIALOG_FOOTER/
DIALOG_FOOTER_WIDE/DIALOG_CLOSE contracts; a new `DialogFooterWide`
export for the wide family); `input.tsx`'s Textarea re-pinned to the
reference's `min-h-[60px] rounded-md`; `entity-dialogs.tsx` fully
rewritten — descriptions and placeholders removed from all five
dialogs, the Lead `py-4` wrapper + space-y-2/controlMt groups + the
Status/Source 2-col pair, the Account 2-col body, the Contact avatar
section (gradient circle + live initials + camera + hidden input +
Name inside) with pair groups, the Event/Activity max-w-2xl family
(space-y-4 forms, bare divs, grid pairs, pt-4 wide footers, the Event
blue submit in create mode). Cancel buttons moved to the stock outline
variant. The contacts scan-card keeps its description (the
unverifiable-superset precedent) on the new chrome.

**Mid-implementation root cause (a NEW v4 hazard class):** the Event
submit's literal `bg-blue-600` compiled to v4's oklch default —
rgb(21,93,252), a DIFFERENT blue than the reference's v3 #2563eb
(e2e-caught via a canvas getImageData pixel readback; getComputedStyle
serializes v4 colors as lab()/oklab() strings, so raw string compares
lie). The shipped fix expresses the reference's blue through the
`--primary`/`--primary-hover` tokens (#2563eb/#1d4ed8 — exactly the
reference's v3 blue-600/blue-700); the pin + the rule documented in
SKILL §16g.4. Two e2e measurement races were also caught: the
zoom-in-95 enter animation (poll boundingBox until settled) and the
closed mobile-nav drawer matching naive `[role=dialog]` selectors
(scope by content).

**Phase C (gate + live re-verification):** lint 0/0 · tsc clean ·
**280/280 unit** (+18) · build via `bun run build` · **37/37 e2e**
(+3; mobile-nav 7/7). Live DOM re-verified on a fresh dev server at
1512 + 390 on every touched surface (the Lead 512px/8px/12px-28px
geometry + the 390 full-bleed/radius-0/centered-title/2-col pair; the
Account 2-col; the Contact avatar section with live initials; the
Event 672px + bare pairs + blue submit pixel rgb(37,99,235); the
Activity 672px + dark submit; the scan-card superset intact; the
drawer healthy; zero 390px overflow).

**Phase D (deliverables):** 19 screenshots (13 established + 6 new
dialog captures incl. the Lead dialog at 390); `.env` /
`.env.example` / `db/` / configs re-verified; docs realigned (README
badge 317 + counts + e2e coverage, AGENTS + 4 session-15 contract
blocks + the literal-palette hazard, CLAUDE counts + test strategy,
PAD matrix 280/37 + session-15 notes, SKILL v1.12.0 §16g,
`docs/session_23.md`, this addendum, both worklogs). Committed on
main + SSH-wrapper push.
