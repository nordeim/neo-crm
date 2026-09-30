# Session 15 — The Entity-Dialog Geometry Layer: Stock shadcn Chrome + Two Body Families + the v4 Literal-Palette Hazard (completion log)

> Picked up from the session-14 completion point (pushed at `5ee8006`,
> plus the operator's `docs/session_22.md` transcript commit at
> `012071c`). This file is the completion record for **Session 15**
> (the 21st/22nd task-book brief — the remediation plan lives at
> `docs/plans/2026-09-30-session15-parity-remediation.md`); the next
> session should treat it as the brief.

## What happened

1. **Workspace refresh** — pulled to `012071c` (the only new remote
   commit was `docs/session_22.md`, the previous session's transcript);
   re-read the five core docs (SKILL v1.11.0) + session_21/22 + the
   session-14 plan + both worklogs. Baseline gate green: lint 0/0 ·
   tsc clean · 262/262 unit · dev server healthy on :3000 with
   `db/custom.db` at the repo root. The task book's config asks were
   verified ALREADY SATISFIED: `.env`
   (`DATABASE_URL="file:../db/custom.db"`), `db/` at the repo root,
   `.env.example` matching, `vitest.config.ts` + `playwright.config.ts`
   both in place.

2. **Re-probe of every previously-pinned family FIRST (the
   moving-target rule)** — the reference did NOT move: body 16px /
   #0a0a0a, h1 30px gray-900, KPI cards de-hovered, dashed `3 3` `#ccc`
   grids, 6px button radii, sidebar nav (20px icons, white/10 active),
   the 404 family, the login family (incl. the full mobile card at
   390: 358px card, 24px h1, 44px inputs, 12px submit radius — all
   aligned), the mobile topbar (mail/bell `display:none` below md on
   both; the bell is dead on BOTH apps), the auth surface (the
   reference's `/signup` still renders the 404 view when logged in —
   the s14 drift stands). Demo data STILL zero (11th consecutive
   session) — parity remains structural.

3. **The mobile navigation menu — the session's standing priority —
   verified THREE ways.** (a) The reference at 390px: sidebar
   `display:none`, NO burger, NO drawer — still no mobile navigation
   (11th session), our drawer remains the documented fix. (b) Our
   clone's 7-check regression LIVE at 390px before any changes:
   7/7 PASS (header-trigger hit-test scoped to
   `header button[aria-expanded]`, drawer open with 8 links + focus
   landing INSIDE the dialog, dual scroll locks, Escape + lock restore,
   focus-trap wrap, resize-past-md auto-close, route-change close).
   (c) A v4-hazard sweep of the drawer internals: panel `h-dvh` 844 =
   innerHeight, `space-y-1` gaps land on BLOCK nav links (no
   inline-label hazard), overlay blur intact, `#2563eb` panel,
   transform states correct. The 390px overflow sweep was clean on all
   eleven routes (incl. `/Profile`).

4. **The audit then went after the one interactive layer never
   deep-compared beyond field sets: the entity dialogs.** All five
   reference create dialogs were opened on the live app and fully
   mapped (outerHTML dumps + computed probes at 1512 and 390). The
   findings were structural and everywhere:

   - **Chrome**: the reference ships STOCK shadcn — `w-full max-w-lg
     sm:rounded-lg shadow-lg` + slide-in/out animations (8px radius at
     ≥sm, **0px and FULL-BLEED 390px on phones**), the stock
     `bg-black/80` overlay (no blur), `text-center sm:text-left`
     headers (**centered titles on phones**), the opacity-70 close X.
     Ours had a rounded-2xl/shadow-xl card with a 2rem side inset, a
     blurred gray-900/45 overlay, always-left headers, and a padded
     bg-wash close X.
   - **No description, no placeholders**: the reference's create
     dialogs render ONLY the h2 (zero `<p>` elements) and zero
     placeholder attributes; ours invented both on every dialog.
   - **Bodies**: the max-w-lg family (Lead/Account/Contact) wraps
     fields in a `py-4` grid with `space-y-2` groups (the SAME 12px/
     28px geometry the s14 settings fix pinned); Lead pairs
     Status+Source in a `grid grid-cols-2 gap-4` (162px cells even at
     390), Account's WHOLE body is 2-col (Name/Industry, Email/Phone,
     Website/Revenue, Employees/Status), Contact ships an AVATAR
     SECTION (w-24 h-24 gradient circle + live-initials span + camera
     button + hidden file input, with the Name field INSIDE the
     section) + `space-y-4` pair groups on a `gap-6` body. The
     max-w-2xl family (Event/Activity at 672px) uses `space-y-4` forms
     with BARE unclassed field divs (~4px natural label gaps — no
     space-y, no mt) + grid-cols-2 pairs + the `flex justify-end
     gap-3 pt-4` footer. Event's Related To sits ALONE in a
     grid-cols-2 (second cell empty — a mirrored quirk).
   - **The Event submit is the ONE-OFF blue** (`bg-blue-600
     hover:bg-blue-700`); every other dialog is the dark stock
     primary.

5. **THE session's root-cause find — a NEW Tailwind v4 hazard class
   (the literal-palette drift):** the reference's Event submit classes
   are `bg-blue-600 hover:bg-blue-700`, but under v4 the LITERAL
   `bg-blue-600` class compiles to v4's oklch default palette which
   computes **rgb(21,93,252) — a DIFFERENT blue than the reference's
   v3 #2563eb**. e2e-caught through a canvas `getImageData` pixel
   readback (getComputedStyle serializes v4 colors as `lab()`/
   `oklab()` strings — raw string compares lie; a 1×1 canvas pixel
   normalizes). The computed-equal expression is the
   `--primary`/`--primary-hover` TOKEN pair (#2563eb/#1d4ed8 —
   exactly the reference's v3 blue-600/blue-700). General rule
   recorded: for any reference color expressed as a literal palette
   class, verify what v4 compiles it to before copying the class.

6. **Two e2e measurement races caught by the gate** (both now
   documented in SKILL §16g): the stock `zoom-in-95` enter animation
   makes `boundingBox()` read ~99% widths right after `toBeVisible`
   (poll until the width settles), and `[role=dialog]` probes must be
   scoped by content — the CLOSED mobile-nav drawer also carries
   role=dialog and matches naive selectors (the s14 lesson,
   twice-learned).

7. **TDD** — 18 red-first unit checks confirmed RED before
   implementation (the DIALOG_FAMILY contracts: chrome ×6, body
   anatomy ×5, per-dialog bodies ×4, the no-description +
   no-placeholder source rules ×2, the textarea re-pin) → **280/280
   unit** (+18; one mid-flight correction — the Event submit pin
   rewritten from the literal classes to the token pair after the v4
   palette find). +3 e2e (the Lead dialog stock geometry at 390, the
   Contact avatar section with live initials, the wide Event family
   with the blue submit) → **37/37 e2e** (mobile-nav 7/7).

8. **Verification** — full gate: lint 0/0 · tsc clean · **280/280
   unit** · build clean (via `bun run build`) · **37/37 e2e**. Live
   DOM re-verified on a fresh dev server at 1512 + 390 on every
   touched surface: the Lead dialog (512px/8px radius/shadow-lg/stock
   header/black-80-no-blur overlay/no desc/11–12px gap/28px
   top-to-top/Status-Source same row/no placeholders/stock close +
   footer; at 390: full-bleed/radius 0/centered title/2-col pair), the
   Account 2-col body, the Contact avatar section (gradient circle,
   camera, Name inside, live "AL" initials for "Ada Lovelace"), the
   Event (672px, 3 bare divs, 3 grids, related-alone, 60px textarea,
   pt-4 footer, submit pixel rgb(37,99,235)), the Activity (672px, 2
   grids, dark submit), the scan-card superset intact on the new
   chrome, the mobile drawer still healthy (its own blur overlay is
   independent of the dialog kit), zero 390px overflow on all routes.

9. **Deliverables** — 19 screenshots under `docs/screenshots/` (the
   13 established + 6 NEW dialog captures: the five create dialogs at
   1512 + the Lead dialog at 390); `.env` still
   `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root
   and `.env.example` matching; docs realigned (README badge 317 +
   counts + e2e coverage, AGENTS counts + 4 session-15 contract blocks
   + the literal-palette hazard, CLAUDE counts + test strategy, PAD
   matrix 280/37 + session-15 notes, SKILL v1.12.0 §16g, this log, the
   plan addendum, both worklogs).

## Next session pointers

- The reference's demo data has been zero for ELEVEN consecutive
  sessions — parity remains structural; re-check on login (it may
  return and change every data-driven surface).
- Unprobed layers remaining: the reference's EDIT dialogs (still
  unverifiable at zero data — ours keep the documented superset), the
  picklist add flow at non-zero data, toast/export behaviors, and the
  avatar UPLOAD behavior (the reference's camera button is present but
  its processing is unverifiable at zero data — our picker opens and
  discards, documented).
- The literal-palette v4 hazard (§16g.4) is a NEW class of finding —
  when mirroring any reference surface with literal palette classes,
  compute what v4 compiles the class to before copying it.
- Standing rule: verify with raw-HTML/computed-style probes; VLM
  claims are hypotheses until DOM-proven.
