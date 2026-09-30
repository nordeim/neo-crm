# Session 17 — The Stock Button/Checkbox Layer + the Icon-Glyph Census (completion log)

> Picked up from the session-16 completion point (pushed at `0b6e256` +
> the worklog record `c758c22` + the operator's `docs/session_26.md`
> transcript commit at `28678cb`). This file is the completion record for
> **Session 17** (the 25th/26th task-book brief — the remediation plan
> lives at `docs/plans/2026-09-30-session17-parity-remediation.md`); the
> next session should treat it as the brief. This session ALSO completed
> the audit the interrupted session-17 attempt had started (its S17-P1/
> P2/P3 findings were re-verified live before any change — the
> moving-target rule).

## What happened

1. **Workspace refresh** — pulled to `28678cb` (clean tree, already up
   to date); re-read the five core docs (SKILL v1.13.0) + session_25 +
   session_26 + the session-16 plan + both worklogs. Baseline gate
   green: lint 0/0 · tsc clean · 297/297 unit · dev server healthy on
   :3000 with `db/custom.db` at the repo root. The task book's config
   asks re-verified ALREADY SATISFIED: `.env`
   (`DATABASE_URL="file:../db/custom.db"`), `db/` at the repo root,
   `.env.example` matching, `vitest.config.ts` + `playwright.config.ts`
   both in place.

2. **The mobile navigation menu — the standing priority — verified
   THREE ways FIRST.** (a) The reference at 390px: no burger, sidebar
   `display:none`, mail/bell hidden — still no mobile navigation (13th
   consecutive session), our drawer remains the documented fix. (b) Our
   clone's 7-check regression LIVE at 390px before any changes:
   **7/7 PASS** (trigger hit-test, drawer open with 8 links + focus
   entry, dual scroll locks, Escape + lock restore, focus-trap wrap,
   resize-past-md auto-close, route-change close). (c) Re-run after the
   changes: the drawer healthy with the NEW sidebar glyphs
   (users/circle-user/calendar render in the drawer too — it shares
   NAV_ITEMS). Demo data STILL zero (13th consecutive session) —
   parity remains structural.

3. **The audit layer this session: the ICON-GLYPH CENSUS + the two
   chrome surfaces still hand-written.** An icon-name + SVG-path census
   on every page of both apps (a layer never swept before) found
   FOURTEEN drifted surfaces:
   - **S17-P1 (High)**: the topbar account trigger was hand-written —
     missing the stock ghost-Button construction (notably the
     focus-visible ring: the reference shows a 1px near-black ring
     under Tab, ours had NONE) and shipping a one-level avatar against
     the reference's stock two-level Avatar (root + fallback div).
   - **S17-P2 (High)**: 14 glyph drifts — the sidebar's `users` /
     `circle-user` / `calendar` (ours: User/CircleUserRound/
     CalendarDays — three DIFFERENT glyphs; the reference's are
     exported under renamed canonical names in lucide 0.525,
     path-verified byte-equal); the Filter/Filters buttons ×3 ship the
     OLD lucide POLYGON funnel (lucide 0.525 re-exports the redesigned
     curved Funnel AS `Filter` — the polygon is exported by NO name, so
     it is hand-rolled as `FilterPolygon` in
     `src/components/ui/icons.tsx` with the `lucide lucide-filter`
     namespacing classes); contacts' Scan Card ships `scan` (no center
     line) and its Import ships a DOWNLOAD glyph (the reference's own
     quirk); the leads chips ship `circle-check-big` + `calendar`; the
     calendar chips `calendar` + `users`; the quick-log `calendar` (Log
     Meeting) + `message-square` (Log WhatsApp). LESSON: compare glyph
     PATH DATA, never names alone — renames hide redesigns and aliases
     hide renames.
   - **S17-P3 (High)**: every reference filter rail (accounts 4 tiers /
     calendar 10 types+dates / activities 4 Activity-Type + the by-type
     footer) ships the stock Radix-style BUTTON checkbox —
     `role=checkbox` + `data-state` + a Check indicator mounting only
     when checked, with the checked fill computing **#171717 (the
     platform's DARK stock primary, not the app blue)**. Ours shipped
     native inputs everywhere: no check glyph ever rendered, a blue
     checked fill, a 2px translucent ring.
   - **S17-P4 (Med)**: the default (blue) Button variant shipped
     `shadow-sm` where the reference's blue primaries (New Account/
     Lead/Event/Contact + the activities Filter) compute the BARE
     `shadow` scale (rgba(0,0,0,.1) 0 1px 3px 0 — one step heavier than
     our re-pinned shadow-sm). Outline buttons are shadow-sm on BOTH
     (verified on Add/Export/Scan Card/Import).
   - **S17-P5 (Med)**: the ghost Button variant carried an invented
     `text-muted` — the reference's ghost is the stock no-base-text
     variant; its one text-bearing ghost ("Save All" on the activities
     rail) renders the inherited #0a0a0a, ours rendered gray.

4. **TDD** — 16 red-first checks confirmed RED before implementation
   (the topbar re-pin + source rules ×2, the nav-config glyph pins, the
   FilterPolygon component + page rules ×2, the icon-swap source rules
   ×4, the CHECKBOX contract + label.tsx primitive rule + the
   call-site onCheckedChange rule ×3, the default-variant bare-shadow +
   ghost no-text-color pins ×2 — one rewritten existing topbar pin) →
   **312/312 unit** (+15 net). Three regex-scoping corrections
   mid-flight (the source pins initially matched the session's own
   documentation comments — the guards were re-scoped to
   import/JSX patterns). +4 e2e (the account trigger's ghost
   construction + two-level avatar, the sidebar `users` glyph, the
   accounts tier stock checkboxes with the canvas-readback #171717
   fill, the blue primaries' bare shadow) → **45/45 e2e** (mobile-nav
   7/7). One e2e fix mid-flight: the checkbox fill assertion hit the
   documented v4 lab()-serialization trap — normalized through the 1×1
   canvas pixel readback (§16g.4). One operational hiccup: the first
   e2e run failed in auth.setup against a stale reused :3100 server —
   killing the stale process and re-running was clean.

5. **Verification** — full gate: lint 0/0 · tsc clean · **312/312
   unit** · build clean (via `bun run build`) · **45/45 e2e**. Live DOM
   re-verified on the dev server at 1512 + 390 on every touched
   surface: the account trigger's class string (whitespace-nowrap /
   text-sm font-medium / focus-visible:ring-1 all present) + the
   two-level avatar + the keyboard focus ring (rgb(10,10,10) 0 0 0 1px
   under Tab); the icon census re-run showing full name+glyph parity
   (the residuals are exactly the documented supersets: the drawer's
   close X, data-gated row-action ellipsis/pencil/trash icons, seeded
   data values); the checkbox anatomy on all three rails (5/4/10
   button role=checkbox, 0 native inputs, Space toggling, the dark
   checked fill + Check indicator); the polygon Filter rendering the
   reference's exact points; the Save All at #0a0a0a; the New Account
   bare shadow; the drawer 7/7; **zero 390px overflow on all eleven
   routes** (incl. /Profile + the 404).

6. **Deliverables** — all 20 screenshots re-captured under
   `docs/screenshots/` with per-shot URL/dialog-state verification
   (zero byte-identical duplicates); `.env` still
   `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root
   and `.env.example` matching; docs realigned (README badge 357 +
   counts + the polygon-filter/checkbox/quick-log feature rows, AGENTS
   counts + five session-17 contract blocks, CLAUDE counts + test
   strategy, PAD matrix 312/45 + the §7.4 checklist fix (it still said
   280/37) + session-17 notes, SKILL v1.14.0 §16i + the frontmatter
   project_state fix (it still said 280/37), this log, the plan
   addendum, both worklogs).

## Next session pointers

- The icon-glyph census is now a standing layer — re-run it every
  session (the script pattern lives in this session's history: icon
  name + context per page, both apps, diffed). Compare PATH DATA for
  any new icon surface.
- The reference's demo data has been zero for THIRTEEN consecutive
  sessions — but an instance WITH data exists behind its load
  balancer (the session-16 anomaly). Re-check `/Reports` on login
  EVERY session; catching the data instance would unlock the edit
  dialogs, the picklist add flow, the upload behavior, and every
  data-driven surface at once.
- Sweep at least one MID width (900px) every session (the S16-P6
  lesson) and re-run the checkbox/trigger glyph surfaces.
- Unprobed layers remaining: the reference's EDIT dialogs, the picklist
  add flow at non-zero data, toast/export behaviors, the avatar UPLOAD
  — all data-gated on the same anomaly.
- Standing rule: verify with raw-HTML/computed-style/path probes; VLM
  claims are hypotheses until DOM-proven.
