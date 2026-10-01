# Session 19 Remediation Plan — The PWA/Installable + Per-Route Metadata Layer (2026-10-01)

**Scope:** Fresh-login DOM audit of the live reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `58b82e4`
(workspace intact from session 18: `.env` with
`DATABASE_URL="file:../db/custom.db"` + `db/` at the repo root, dev server
healthy on :3000; baseline gate green: lint 0/0 · tsc clean · **326/326
unit**; vitest + playwright configs verified — the task book's config asks
satisfied from prior sessions).

**Standing layers re-verified FIRST (moving-target rule) — NO drift:**

- **Mobile navigation (the standing priority), three ways**: (a) the
  reference at 390px still ships NO navigation (15th consecutive session:
  no `<aside>` in the DOM, zero visible links); (b) our drawer's 7-check
  regression LIVE **7/7 PASS** (trigger hit-test 36×36 at 16,16; open + 8
  links + focus entry + dual scroll locks; Escape + lock release + focus
  restore to the trigger under a REAL click; focus-trap wrap in BOTH
  directions — the trap's boundary is the PANEL (first = the panel Close
  X, last = Settings); resize-past-md auto-close + lock release + desktop
  sidebar swap; route-change close); (c) the drawer internals swept for
  Tailwind v4 hazards: zero `hidden` attributes, `h-dvh` 844 ===
  innerHeight, panel bg rgb(37,99,235) = the exact v3 blue, overlay blur
  2px. **Zero 390px overflow on all eleven routes** (incl. /Profile + the
  404).
- **The document metadata layer (s18, now standing)**: the head census
  re-probed on both apps (description 405, the full OG/Twitter family,
  icon link) — no drift; `/robots.txt` byte-identical (origin-normalized);
  `/sitemap.xml` 9 locs.
- **Demo data still zero (15th consecutive session)** — 4/4 /Reports
  loads served the empty-state rows. Parity remains structural; the
  data-gated surfaces (edit dialogs, picklist add flow, avatar upload)
  stay unverifiable.
- **No app-code drift since fe78bd5** — `git diff fe78bd5..58b82e4` on
  src/tests/prisma/public is EMPTY (the pull added only
  `docs/session_30.md`), so every pinned family from s18's live
  verification holds by construction.

**The audit layer this session: the PWA/INSTALLABLE + PER-ROUTE metadata
surface** — never swept in eighteen prior sessions (manifest.json, the
apple/mobile-web-app meta family, the theme-color VALUE, the
apple-touch-icon, per-route canonical/og/twitter, and — in the same sweep
— the form-input attribute micro-contracts of the login card + all five
create dialogs). All findings live-verified on both apps.

---

## Identified Issues, Bugs and Gaps (all DOM/HTTP-verified this session)

| # | Sev | Issue | Evidence (live DOM / reproduction) |
|---|-----|-------|-----------------------------------|
| S19-P1 | **Med** | **No web app manifest.** The reference serves `/manifest.json` + `<link rel="manifest">` on BOTH the login page and the authed shell: `{name, short_name} "NEO CRM"`, the same 405-char description, TWO icon entries (192x192 + 512x512, the SAME PNG src both — their platform screenshot), `start_url` = origin, `display: "standalone"`, `theme_color: "#000000"`, `background_color: "#ffffff"`, `scope` = origin. Ours: `/manifest.json` → 404, no link. | manifest fetched in full via browser; link census both apps |
| S19-P2 | **Low** | **theme-color value drift.** The reference's `meta[name=theme-color]` is **#000000** (black, both login + authed routes). Ours ships #2563eb — s18 judged ours a "harmless superset" without noting the reference's actual VALUE; it is a real drift. | meta census both apps |
| S19-P3 | **Med** | **Missing apple/PWA meta family + apple-touch-icon.** The reference ships `mobile-web-app-capable` = yes, `apple-mobile-web-app-status-bar-style` = black, `apple-mobile-web-app-title` = "NEO CRM", and (on its login page) `<link rel="apple-touch-icon" sizes="180x180">`. Ours ships none of the four. | meta/link census both routes |
| S19-P4 | **Med** | **Per-route OG/Twitter drift — the biggest gap.** On EVERY reference inner page the OG/Twitter family is PER-ROUTE: og:title = the page title ("Accounts \| NEO CRM"), og:url = origin+route, og:description = `"<Page> on NEO CRM. " + <the 405-char paragraph>`, twitter:title + twitter:url + twitter:description likewise (twitter:description carries the same prefix — verified on /Leads). Root (/ and /Dashboard) and /login stay unprefixed ("NEO CRM" + the plain paragraph). Ours sets the family ONCE in the root layout → every inner page ships og:title "NEO CRM", og:url origin/, and the unprefixed description. Verified on /Accounts, /Contacts, /Leads, /Calendar, /Activities, /Reports, /Settings, /Profile. | per-route meta content probes, 10 routes |
| S19-P5 | **Low-Med** | **No canonical link.** The reference ships `<link rel=canonical>` per-route (origin + current route — verified: `/`→origin/, `/login`→origin/login, `/Accounts`→origin/Accounts on full loads). Ours ships none. | link census, 3 routes full-load |
| S19-P6 | **Low-Med** | **Contact dialog Phone input type.** The reference's New Contact Phone is `type="tel"`; ours is plain text (no type attr). NOTE: the Lead dialog's Phone is `type="text"` on BOTH apps (the reference's own inconsistency — mirrored, not "fixed"). | dialog input census both apps |
| S19-P7 | **Low-Med** | **Invented datalists.** Ours ships `list="industry-options"` (Account Industry) + `list="account-options"` (Contact Company) + the `<datalist>` elements; the reference ships ZERO inputs with `list` attrs and ZERO datalists in any of the five create dialogs. An invented feature (drops a suggestion dropdown the reference doesn't have) — remove for parity. | dialog DOM census (`input[list]`, `datalist` counts) |
| S19-P8 | **Low** | **Avatar file-input accept.** The reference's Contact avatar hidden input: `accept="image/jpeg,image/png,image/jpg"`; ours: `accept="image/*"`. | dialog DOM census |
| — | Info | **Verified-aligned (no action):** the login form micro-contract (both apps: `<form>` + email/password inputs, required flags, identical placeholders "you@example.com"/"••••••••"); our login's `autoComplete` attrs (email/current-password/new-password/name) are the documented accessible-superset pattern (password managers) — kept + to be documented; Lead/Account/Event/Activity dialog input types at full parity (text/email/number/datetime-local + one textarea each); the reference's og:image is the SAME transformed URL on root and inner pages (our static `/og-image.png` everywhere is the right self-hosted expression); the reference's capitalized locs/routes resolve via real navigation (earlier 404s were pushstate/reload artifacts — our lowercase sitemap routes stay the deliberate fix); the reference's inner-page og:image carries platform transform params (`?width=1200&height=630&resize=contain`) — CDN noise, not mirrored. | probes above |

---

## ToDo — execution order (TDD)

### Phase A — red tests first

1. New `tests/pwa-metadata.test.ts` (~15 checks, dynamic seam imports +
   guarded source reads so the red state fails check-by-check — the s18
   pattern):
   - **The manifest route handler** (`src/app/manifest.json/route.ts`):
     exists, `force-static`, and its source pins the reference's exact key
     order (name/short_name "NEO CRM", `SITE_DESCRIPTION`, TWO icon
     entries both pointing at `/icon.png` with sizes "192x192" +
     "512x512" + type image/png — the reference's same-src quirk,
     self-hosted as our app icon, `start_url`/`scope` from `siteUrl()`,
     display "standalone", theme_color "#000000", background_color
     "#ffffff").
   - **The apple icon asset**: `public/apple-icon.png` exists, PNG magic
     bytes, IHDR 180×180.
   - **The root layout**: viewport `themeColor: "#000000"`; `manifest:`
     metadata field; the `icons.apple` entry (url /apple-icon.png, sizes
     180x180); `other` carries `mobile-web-app-capable` = "yes",
     `apple-mobile-web-app-status-bar-style` = "black",
     `apple-mobile-web-app-title` = "NEO CRM".
   - **The per-route seam** (`src/lib/site.ts`): `pageOgDescription(page)`
     → `"<page> on NEO CRM. " + SITE_DESCRIPTION`; `pageMetadata({...})`
     → the full per-page Metadata (title, canonical route, og full set
     with the "| NEO CRM" title + prefixed description + url + images,
     twitter full set, other with the per-route twitter:url + the three
     PWA metas).
   - **Per-page wiring**: the 8 inner wrappers + login + signup consume
     `pageMetadata` (source pins); the dashboard inherits the root layout
     (no wrapper metadata — pinned as ABSENT).
   - **The dialog micro-contracts** (source pins on
     `entity-dialogs.tsx`): `ct-phone` carries `type="tel"`; ZERO `list=`
     attributes + ZERO `<datalist` elements; the avatar input's accept is
     `"image/jpeg,image/png,image/jpg"`.
2. e2e additions (`tests/e2e/crm.spec.ts`, +7 checks):
   - `GET /manifest.json` → 200 with name/icons/theme_color/display
     assertions + `link[rel=manifest]` present.
   - `meta[name=theme-color]` content = `#000000`.
   - `link[rel=apple-touch-icon]` present + the asset resolves 200.
   - The PWA metas (`mobile-web-app-capable`,
     `apple-mobile-web-app-title`) present.
   - On `/accounts`: og:title "Accounts | NEO CRM", og:url ends
     `/accounts`, og:description starts "Accounts on NEO CRM. ",
     twitter:url ends `/accounts`, canonical ends `/accounts`.
   - On `/`: og:title "NEO CRM", canonical = the origin root, twitter:url
     = the origin root (the dashboard family).
   - The Contact dialog's Phone input `type=tel` (live dialog probe).

### Phase B — implementation

1. `src/lib/site.ts`: add `pageOgDescription()` + `pageMetadata()` (the
   per-route metadata factory — DRY, unit-testable; consumed by the page
   wrappers; keeps the full og/twitter/other sets per page because Next
   shallow-merges page metadata over layout metadata).
2. `src/app/manifest.json/route.ts` (new, `force-static`): the reference's
   exact JSON key order with `siteUrl()` origin — the s18
   robots/sitemap route-handler pattern (NEVER `app/manifest.ts`: the
   MetadataRoute serializer re-orders keys and would drift from the
   reference's bytes).
3. `src/app/layout.tsx`: `themeColor: "#000000"`; `manifest` field;
   `icons.apple`; the three PWA metas in `other`; root `alternates.
   canonical: "/"`.
4. `public/apple-icon.png` (new): 180×180 BrandMark annulus on the
   #2563eb tile (adapted from the s18 icon generator script).
5. The 8 inner page wrappers + login + signup: consume `pageMetadata`
   (login keeps its ABSOLUTE "NEO CRM" title; signup keeps "Sign up |
   NEO CRM" — our documented functional superset, self-consistent
   metadata).
6. `src/components/shared/entity-dialogs.tsx`: `type="tel"` on ct-phone;
   remove the two datalists + their `list` attrs; the accept fix.

### Phase C — full gate + browser re-verification

lint → typecheck → 326+ unit → `bun run build` (NEVER bare `next build`)
→ e2e (50+) → live DOM re-verification on the dev server: the manifest
link + JSON bytes, theme-color, apple-touch-icon resolution, the PWA
metas, the per-route og/twitter/canonical census on all 10 routes, the
drawer 7/7 re-run, zero 390px overflow sweep, the Contact dialog tel
input + datalist removal live.

**Serializer hazards to verify live (the s18 lesson):** Next's emission
forms for `metadata.manifest` (href absolute vs relative — the
reference's is absolute), `icons.apple` (sizes attr), and page-level
`other` (REPLACES the layout's `other` — every page must re-declare the
PWA metas, which the `pageMetadata` factory does).

### Phase D — deliverables

Screenshots refreshed (the 20 established shots); `.env` /
`.env.example` re-verified; docs realigned (README feature row + counts,
AGENTS counts + session-19 contract block, CLAUDE counts + suite list,
PAD matrix + §7.4, SKILL v1.16.0 §16k + frontmatter, `docs/session_31.md`,
this addendum, both worklogs), commit on main + SSH-wrapper push.

---

## Addendum — execution record (same session)

**Phase A (red tests):** 14 failing checks confirmed RED before any
implementation — `tests/pwa-metadata.test.ts` written with DYNAMIC seam
imports + guarded source reads (the manifest route-handler byte pins,
the theme-color/PWA_META/apple-icon asset pins, the pageMetadata()
factory output pins, the wrapper wiring pins, the dialog
micro-contract pins) + 6 e2e checks appended to `tests/e2e/crm.spec.ts`.

**Phase B (implementation):** `src/app/manifest.json/route.ts` (the
reference's key order, force-static, application/json),
`src/lib/site.ts` (+ `pageOgDescription` / `PWA_META` /
`pageMetadata`), the 8 wrappers + login + signup rewired through the
factory, the root layout (themeColor #000000, the manifest field with
the absolute href, the root canonical, PWA_META in `other`),
`src/app/apple-icon.png` (180×180 BrandMark tile via the adapted s18
generator), the entity-dialog fixes (ct-phone type=tel, both datalists
removed with their orphaned variables, the exact avatar accept list).

**Phase C (gate + live re-verification):** lint 0/0 · tsc clean ·
**340/340 unit** (+14 net, 17 suites) · build (`/manifest.json` +
`/apple-icon.png` in the standalone manifest) · **56/56 e2e** (+6;
mobile-nav 7/7). THREE gate-caught corrections: (a) the first pass
declared `metadata.icons: { apple }` — the s18 favicon e2e caught that
declaring the field REPLACES the file-convention `link[rel=icon]` (zero
icon links in the DOM); both icons now ship as file conventions and the
layout declares NO icons field; (b) the new root-canonical e2e expected
the reference's trailing slash — live probing proved Next's URL
resolution strips it even when given `${siteUrl()}/` — the test pins the
slashless form and the nuance is documented (the s18 "viewport 1 vs
1.0" cosmetic-serialization class); (c) the New Event dialog test
flaked once under parallel load, passed cleanly on re-run. All
serializer emissions verified live on the dev server BEFORE the build
(the §16k.4 method): manifest link/bytes, theme-color, apple-touch-icon
with sizes 180x180, per-route canonical/og/twitter on all 10 routes,
the PWA metas surviving page-level replacement, the s13 absolute titles
intact.

**Phase D (deliverables):** all 20 screenshots re-captured with per-shot
URL + content verification (zero duplicates, fresh timestamps); `.env` /
`.env.example` re-verified (the site-URL comment now covers the manifest
+ the per-route family); docs realigned (README badge 396 + PWA feature
row + env table + counts, AGENTS counts + the session-19 contract block,
CLAUDE counts + suite list + env table, PAD matrix 340/56 + §7.2 + §7.4,
SKILL v1.16.0 §16k + frontmatter, `docs/session_31.md`, this addendum,
both worklogs). Committed on main + SSH-wrapper push.
