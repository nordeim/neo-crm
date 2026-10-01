# Session 18 Remediation Plan — The Document Metadata Layer (2026-10-01)

**Scope:** Fresh-login DOM audit of the live reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `d67a237`
(fresh workspace: clone → `bun install` → `.env`
(`DATABASE_URL="file:../db/custom.db"` + `AUTH_SECRET`) → `db/` created at
the repo root → `db:push` + `db:seed` → baseline gate green: lint 0/0 · tsc
clean · **312/312 unit** · dev server healthy on :3000 with
`db/custom.db` at the repo root; vitest + playwright configs verified in
place — the task book's config asks satisfied from prior sessions).

**Standing layers re-verified FIRST (moving-target rule) — NO drift:**

- **Mobile navigation (the standing priority), three ways**: (a) the
  reference at 390px still ships NO navigation (14th consecutive session:
  no `<aside>` in the DOM, zero visible links, only the account chevron
  button); (b) our drawer's 7-check regression LIVE at 390/700/1000px
  **7/7 PASS** (trigger hit-test 36×36 at 16,16; open + 8 links + focus
  entry into the dialog + dual scroll locks; Escape + lock release +
  focus restore to the trigger under a REAL click — the eval-click
  BODY-focus is the documented artifact; focus-trap wrap both directions;
  resize-past-md auto-close + lock release + desktop sidebar swap;
  route-change close); (c) the drawer internals swept for Tailwind v4
  hazards: zero `hidden` attributes (the v4 hidden-vs-display trap),
  zero inline-element margin targets (the s14 space-y inline-label
  hazard), `h-dvh` 844 === innerHeight, panel bg rgb(37,99,235) = the
  reference's exact v3 blue (no oklch drift), overlay blur 2px, 4px
  space-y-1 link gaps. **Zero 390px overflow on all eleven routes**
  (incl. /Profile + the 404).
- **Icon-glyph census (the standing layer from s27's pointers)**: full
  name census on all 9 pages of both apps — **9/9 pages at parity**
  (every reference icon name present with ≥ matching counts; the clone
  extras are exactly the documented supersets: x = drawer/dialog closes,
  ellipsis/pencil/trash2 = data-gated row actions on seeded data,
  circle/clock = timeline visuals).
- **Demo data still zero (14th consecutive session)** — 4/4 /Reports
  loads rendered the empty-state rows ("No won deals"/"No deals"); the
  data-bearing instance behind the load balancer did not serve this
  session. Parity remains structural.
- **Previously-pinned families**: body 16px/#0a0a0a, h1 30px
  #111827 (canvas-normalized lab() → [17,24,39]), dashed grids
  `3px, 3px`, the session-17 surfaces (stock ghost-Button account
  trigger + two-level avatar, 4 button role=checkbox / 0 native inputs on
  the accounts rail), mid-width 900px sweep (settings 2×282px cards,
  contacts 580px card + the 5px mirrored scroll quirk, calendar split
  grids + 24px/700 title). The 236-vs-242px topbar search width at 900
  is the documented font-file rendering artifact (byte-identical classes
  + text; re-confirmed environment-only).

**The audit layer this session: the DOCUMENT METADATA layer** — never
swept in seventeen prior sessions (head census: lang, viewport, title,
meta description, OpenGraph/Twitter cards, favicon, robots.txt,
sitemap.xml — the SEO/social surface of the `<head>`).

---

## Identified Issues, Bugs and Gaps (all DOM/HTTP-verified this session)

| # | Sev | Issue | Evidence (live DOM / reproduction) |
|---|-----|-------|-----------------------------------|
| S18-P1 | **Med** | **Meta description drift.** The reference ships a 405-char marketing paragraph ("NEO CRM is a clean, intuitive customer relationship management platform designed to help teams manage accounts, contacts, and leads in one centralized dashboard. With powerful search, clear account tracking, activity monitoring, and built-in reporting, NEO CRM keeps your client data organized, accessible, and actionable—so you can focus on building stronger relationships and closing more opportunities."). Ours ships a different 96-char sentence. Static copy — a direct parity miss. | `meta[name=description]` dumps both apps |
| S18-P2 | **Med** | **No OpenGraph / Twitter cards.** The reference ships the full social set: og:title "NEO CRM", og:description (same paragraph), og:image (a 1200×630 dashboard screenshot), og:url (origin), og:type website, og:site_name "NEO CRM"; twitter:card summary_large_image, twitter:title/description/image/url. Ours ships NONE — link-unfurls of the clone render a bare title. | meta census both apps (full attribute dump) |
| S18-P3 | **Med** | **No favicon at all.** The reference ships a custom PNG favicon (`<link rel=icon>` → their hosted PNG, HTTP 200 image/png). Ours serves NOTHING: `/favicon.ico` → 404, `/icon.png` → 404, no app-router icon file — every browser tab renders the default blank icon. | `link[rel*=icon]` census + HTTP probes on the clone |
| S18-P4 | **Med** | **No sitemap.xml + robots.txt missing its Sitemap line — while `.env.example`/README/CLAUDE all claim `NEXT_PUBLIC_SITE_URL` is "used for metadata, sitemap.xml, and robots.txt".** The reference ships `/sitemap.xml` (9 URLs: `/` + 8 routes, changefreq weekly, priority 1.0/0.8) and a robots.txt with `Sitemap: <origin>/sitemap.xml`. Ours: `/sitemap.xml` → 404, robots.txt lacks the Sitemap line, and grep proves `NEXT_PUBLIC_SITE_URL` is consumed NOWHERE in `src/` — a documented-vs-code gap in our own repo. | HTTP + grep probes; reference sitemap fetched in full |
| — | Info | **Verified-aligned (no action):** viewport meta `initial-scale=1` vs `1.0` — cosmetic serialization (Next generates `1`), same semantics; our `theme-color` #2563eb is a harmless superset; the reference's sitemap uses CAPITALIZED locs (/Accounts — its platform routes case-insensitively, live 200s both casings) — our clone is case-sensitive by design (the s14 /Profile alias), so OUR sitemap must list the real lowercase routes (fixing the reference's defect of pointing crawlers at URLs that only resolve on a case-insensitive host); the reference's og:image/favicon URLs are their platform's CDN assets — the self-hosted expression is our OWN `public/og-image.png` + `src/app/icon.png`. | probes above |

---

## ToDo — execution order (TDD)

### Phase A — red tests first

1. New `tests/metadata.test.ts` (14 checks):
   - The exact reference description paragraph is pinned in
     `src/app/layout.tsx` (full-string source pin).
   - `openGraph` source pin: title "NEO CRM", type "website", siteName,
     the description, `images: [{ url: "/og-image.png", width: 1200,
     height: 630, alt }]`.
   - `twitter` source pin: card "summary_large_image", title, images
     referencing og-image.png.
   - `metadataBase` consumes `NEXT_PUBLIC_SITE_URL` with the
     `http://localhost:3000` fallback.
   - `src/app/icon.png` exists (fs) and is a valid PNG.
   - `public/og-image.png` exists and its IHDR reads 1200×630.
   - `src/app/sitemap.ts` source pins: 9 routes (lowercase / + /accounts
     … /settings + /profile), `changefreq: "weekly"`, priority 1.0 for /
     and 0.8 for the rest, siteUrl from the env seam.
   - `src/app/robots.ts` source pins: allow all user agents, the
     `Sitemap:` line referencing sitemap.xml.
   - `public/robots.txt` no longer exists (metadata-route conflict
     guard).
2. e2e additions (`tests/e2e/crm.spec.ts`, +5 checks):
   - The dashboard `<head>` serves `meta[name=description]` with the
     reference paragraph; `meta[property=og:title]`; `meta[name=twitter:card]`;
     `link[rel=icon]`.
   - `GET /robots.txt` contains `Sitemap:` and `GET /sitemap.xml`
     contains the nine route `<loc>` entries.

### Phase B — implementation

1. `src/lib/site.ts` (new pure seam): `siteUrl()` reading
   `NEXT_PUBLIC_SITE_URL` with the localhost fallback (unit-testable;
   consumed by layout/sitemap/robots — closes the documented gap that
   the variable was consumed nowhere).
2. `src/app/layout.tsx`: mirror the reference description verbatim; add
   `metadataBase` + `openGraph` + `twitter` blocks (image =
   `/og-image.png` 1200×630 — the self-hosted expression of the
   reference's screenshot card).
3. `src/app/icon.png` (new): a 512×512 brand icon — the BrandMark
   annulus (white ring) on the #2563eb rounded tile (file-convention
   favicon; Next injects `<link rel=icon>` automatically).
4. `public/og-image.png` (new): a 1200×630 social card captured from the
   remediated dashboard.
5. `src/app/sitemap.ts` + `src/app/robots.ts` (new, Next Metadata
   Routes): 9 lowercase URLs (weekly, 1.0/0.8 — the reference's
   structure with OUR real routes), robots allow-all + Sitemap line;
   delete `public/robots.txt` (would conflict with the generated route).

### Phase C — full gate + browser re-verification

lint → typecheck → 312+ unit → `bun run build` (NEVER bare `next build`) →
e2e (45+) → live DOM re-verification: the head census re-run on the clone
(description/og/twitter/icon parity vs the reference), /robots.txt +
/sitemap.xml served, the drawer 7/7 re-run, zero 390px overflow on all
eleven routes, the standing icon census unaffected (no UI change).

### Phase D — deliverables

Screenshots refreshed (the 20 established shots re-captured with per-shot
URL/dialog-state verification); `.env` / `.env.example` re-verified (the
`NEXT_PUBLIC_SITE_URL` doc comment becomes TRUE); docs realigned (README
env table + counts, AGENTS counts + session-18 contract blocks, CLAUDE
counts, PAD matrix + §7.4, SKILL v1.15.0 §16j + frontmatter
project_state, `docs/session_29.md`, this addendum, both worklogs),
commit on main + SSH-wrapper push.

---

## Addendum — execution record (same session)

**Phase A (red tests):** 14 failing checks confirmed RED before any
implementation — `tests/metadata.test.ts` written with DYNAMIC seam
imports (`await import("@/lib/site")`) and existence-guarded source reads
so the red state fails check-by-check instead of erroring the file (the
site seam ×3, the description pin ×2, the OG/Twitter layout pins ×4, the
favicon + og-image asset pins ×2, the sitemap/robots source pins ×2, the
static-robots retirement ×1) + the 5 e2e checks appended to
`tests/e2e/crm.spec.ts`.

**Phase B (implementation):** `src/lib/site.ts` (siteUrl +
SITE_DESCRIPTION), the root layout metadata (metadataBase, openGraph,
twitter, `other`-borne twitter:url), `src/app/icon.png` (BrandMark
annulus on the #2563eb tile), `public/og-image.png` (1200×630 live
dashboard capture). TWO gate-caught rewrites: the first pass shipped
Next's `app/robots.ts` + `app/sitemap.ts` metadata routes and the e2e
caught the serializer drifts (`User-Agent` capital-A vs the reference's
`User-agent` bytes; `changefreq` silently dropped — the type's field is
`changeFrequency`; priority 1.0 serialized as `1`) — rewritten as
explicit `force-static` route handlers whose output is byte-identical
(origin-normalized) to the reference for robots.txt and format-identical
for the sitemap with only the deliberate lowercase-route fix. The unit
robots pin was re-scoped to the structured source composition
accordingly.

**Phase C (gate + live re-verification):** lint 0/0 · tsc clean ·
**326/326 unit** (+14 net) · build via `bun run build` · **50/50 e2e**
(+5; mobile-nav 7/7). ONE unrelated gate failure root-caused on the way:
the pre-existing `reports page loads analytics tabs with seeded data`
broke on its hardcoded `$542.0k` assertion — a QUARTER-BOUNDARY TIME
BOMB (2026-10-01 began Q4; the server-side periodStart() window no
longer contained any seeded close) — fixed deterministically by driving
the period combobox to All Time and pinning the date-independent
`7 $687.0K`. Live DOM re-verified: the head census on the dev server
(full OG/Twitter/icon parity), og:image + icon assets resolving 200,
robots.txt byte-identical, sitemap format-identical, the drawer 7/7
healthy, zero 390px overflow on all eleven routes.

**Phase D (deliverables):** all 20 screenshots re-captured with per-shot
URL + content verification (zero duplicates; the httpOnly cookie forced
the logout-API route for the logged-out shot, and the profile probe was
corrected to the real h1 text); `.env` / `.env.example` re-verified (the
NEXT_PUBLIC_SITE_URL doc comment is finally TRUE — the variable is
consumed by the site seam); docs realigned (README badge 376 + metadata
feature row + env table, AGENTS counts + the session-18 contract block,
CLAUDE counts + suite list + the env-table repair, PAD matrix 326/50 +
§7.2 pattern notes + §7.4 + §8.2, SKILL v1.15.0 §16j + frontmatter,
`docs/session_29.md`, this addendum, both worklogs). Committed on main
+ SSH-wrapper push.
