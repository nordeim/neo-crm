# Session 18 — The Document Metadata Layer + the Quarter Time Bomb (completion log)

> Picked up from the session-17 completion point (pushed at `4fd842d` +
> the worklog record `cc93294` + the operator's `docs/session_28.md`
> transcript commit at `d67a237`). This file is the completion record for
> **Session 18** (the 27th/28th task-book brief — the remediation plan
> lives at `docs/plans/2026-10-01-session18-parity-remediation.md`); the
> next session should treat it as the brief.

## What happened

1. **Workspace refresh** — the sandbox had been reset, so the repo was
   re-cloned from `https://github.com/nordeim/neo-crm.git` at `d67a237`
   (clean tree, main only) alongside the scandihaven reference; the five
   core docs (AGENTS/CLAUDE/README/PAD/SKILL v1.14.0) + session_27 +
   session_28 + the session-17 plan + both worklogs re-read in full.
   Environment re-provisioned exactly per the task book: `.env`
   (`DATABASE_URL="file:../db/custom.db"` + fresh `AUTH_SECRET`), `db/`
   created at the repo root, `db:push` + `db:seed` (24 leads / 15
   contacts / 20 activities / 12 events), vitest + playwright configs
   verified in place. **Baseline gate green: lint 0/0 · tsc clean ·
   312/312 unit · dev server healthy on :3000.**

2. **The mobile navigation — the standing priority — verified THREE ways
   FIRST.** (a) The reference at 390px: still NO navigation (14th
   consecutive session — no `<aside>` in the DOM, zero visible links,
   only the account chevron button). (b) Our drawer's 7-check regression
   LIVE at 390/700/1000px **7/7 PASS** — trigger hit-test 36×36 at
   (16,16); open + 8 links + focus entry + dual scroll locks; Escape +
   lock release + focus restore to the trigger under a REAL click (the
   eval-click BODY-focus re-confirmed as the documented artifact);
   focus-trap wrap in both directions; resize-past-md auto-close + lock
   release + desktop sidebar swap; route-change close. (c) The drawer
   internals swept for the Tailwind v4 hazard classes per the task
   book's emphasis: zero `hidden` attributes (the v4 hidden-vs-display
   trap), zero inline-element margin targets (the s14 space-y
   inline-label hazard), `h-dvh` 844 === innerHeight, panel bg
   rgb(37,99,235) = the reference's exact v3 blue (no oklch drift),
   overlay blur 2px, 4px space-y-1 link gaps. **Zero 390px overflow on
   all eleven routes** (incl. /Profile + the 404). Demo data STILL zero
   (14th consecutive session — 4/4 /Reports loads served the
   empty-state rows).

3. **The audit layer this session: the DOCUMENT METADATA surface** —
   the `<head>` layer never swept in seventeen prior sessions (meta
   description, OpenGraph/Twitter cards, favicon, robots.txt,
   sitemap.xml; HTTP + head-census probes on both apps). FOUR findings,
   all live-verified:
   - **S18-P1 (Med)**: meta description drift — the reference ships a
     405-char marketing paragraph (em-dash at char 321); ours shipped a
     different 96-char sentence.
   - **S18-P2 (Med)**: no OpenGraph/Twitter cards — the reference ships
     og:title/description/image/url/type/site_name + twitter:card
     summary_large_image with title/description/image AND twitter:url;
     ours shipped none (bare link unfurls).
   - **S18-P3 (Med)**: no favicon at all — the reference serves a PNG
     favicon; ours 404'd on both /favicon.ico and /icon.png with no
     app-router icon file.
   - **S18-P4 (Med)**: no sitemap.xml, robots.txt missing its Sitemap
     line — while `.env.example`/README/CLAUDE have claimed
     NEXT_PUBLIC_SITE_URL is "used for metadata, sitemap.xml, and
     robots.txt" since the scaffold; grep proved the variable was
     consumed NOWHERE (a documented-vs-code gap).
   - Standing layers re-verified with NO drift: the icon-glyph census
     (9/9 pages full name parity, clone extras = exactly the documented
     supersets), typography pins (16px/#0a0a0a/30px h1 #111827
     canvas-normalized), dashed grids, the session-17 surfaces (stock
     ghost-Button trigger + two-level avatar + 4 button-checkboxes/0
     native), the mid-width 900px sweep (settings 2×282px, contacts
     580px card + the 5px mirrored scroll quirk, calendar split grids +
     24px/700 title). The 236-vs-242px search width delta re-confirmed
     as the documented font-file environment artifact.

4. **TDD** — 14 red-first checks confirmed RED (a new
   `tests/metadata.test.ts` with dynamic seam imports + guarded source
   reads so the red state fails check-by-check) → **326/326 unit**
   (+14 net). +5 e2e (the reference description content, the OG/Twitter
   card family, the favicon link + asset resolution, robots.txt's
   Sitemap line, the nine-route sitemap.xml) → **50/50 e2e**
   (mobile-nav 7/7). TWO mid-flight corrections, both gate-caught: (a)
   the first implementation used Next's `app/robots.ts` +
   `app/sitemap.ts` metadata routes — the e2e caught the serializer
   drifts (Next emits `User-Agent` capital-A where the reference's bytes
   say `User-agent`, DROPS `changefreq` on a `changefreq` key, and
   serializes priority 1.0 as `1`) — rewritten as explicit route
   handlers (`src/app/robots.txt/route.ts` +
   `src/app/sitemap.xml/route.ts`, `force-static`) whose output is
   BYTE-IDENTICAL to the reference (origin-normalized) for robots.txt
   and format-identical for the sitemap (the only deltas are the
   deliberate lowercase routes — the reference's capitalized locs
   resolve only on its case-insensitive platform); (b) the reports e2e
   `reports page loads analytics tabs with seeded data` failed on the
   `$542.0k` assertion — root-caused as a QUARTER-BOUNDARY TIME BOMB
   (the assertion pinned the quarter-relative won total; 2026-10-01
   began Q4, the server-side `periodStart()` window no longer contained
   any seeded close, and the KPI legitimately rendered `0 $0.0K`) —
   fixed deterministically by driving the period combobox to All Time
   and pinning the date-independent `7 $687.0K`.

5. **Implementation** — `src/lib/site.ts` (the `siteUrl()` seam with the
   NEXT_PUBLIC_SITE_URL/localhost-fallback contract + the mirrored
   `SITE_DESCRIPTION`); the root layout's `metadataBase` + openGraph +
   twitter blocks (twitter:url through `metadata.other` — Next's
   twitter object has no url field, verified against next 16.3.6's
   twitter-types); `src/app/icon.png` (the BrandMark annulus on the
   #2563eb rounded tile, file-convention favicon); `public/og-image.png`
   (a 1200×630 LIVE dashboard capture — the self-hosted expression of
   the reference's screenshot card); the two route handlers; the static
   `public/robots.txt` retired (route conflict).

6. **Verification** — full gate: lint 0/0 · tsc clean · **326/326
   unit** · build via `bun run build` (robots.txt/sitemap.xml/icon.png
   all in the standalone manifest) · **50/50 e2e**. Live DOM
   re-verification on the dev server: the head census (description
   content match, og:title/type/site_name/url/image + twitter:url/card/
   title/description/image all present, `link[rel=icon]` resolving to a
   200 image/png); og:image resolving to the absolute origin URL and
   serving; `/robots.txt` byte-identical to the reference
   (origin-normalized) and `/sitemap.xml` format-identical (48 lines,
   same indentation/cadence, only the documented lowercase-route fix);
   the drawer 7/7 re-run healthy; zero 390px overflow on all eleven
   routes re-confirmed.

7. **Deliverables** — all 20 screenshots re-captured under
   `docs/screenshots/` with per-shot URL + content verification (zero
   duplicates; two probe corrections mid-flight — the httpOnly session
   cookie needed the logout API for the logged-out shot, and the
   profile h1 pins "Profile & Settings"); `.env` still
   `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root;
   `.env.example` re-verified — and its NEXT_PUBLIC_SITE_URL comment is
   finally TRUE; docs realigned (README badge 376 + the metadata feature
   row + env table, AGENTS counts + the session-18 contract block, CLAUDE
   counts + the metadata suite + the env table repair, PAD matrix
   326/50 + §7.2's two new pattern notes + §7.4 + §8.2, SKILL v1.15.0
   §16j + frontmatter project_state, this log, the plan addendum, both
   worklogs).

## Next session pointers

- The document metadata layer is now a standing surface — re-probe the
  head census + robots/sitemap bytes each session (cheap HTTP probes).
- The icon-glyph census + the mid-width (900px) sweep remain standing
  layers; re-run alongside.
- The reference's demo data has been zero for FOURTEEN consecutive
  sessions — keep re-checking `/Reports` on login for the data-bearing
  instance (it would unlock the edit dialogs, the picklist add flow, the
  avatar upload, and every data-gated surface).
- Never hardcode a period-relative KPI value in a test (the §16j.5
  lesson) — audit any remaining `new Date()`-relative assertion before
  it detonates.
- Unprobed layers remaining: the reference's EDIT dialogs, the picklist
  add flow, toast/export behaviors, the avatar UPLOAD — all data-gated
  on the same anomaly.
