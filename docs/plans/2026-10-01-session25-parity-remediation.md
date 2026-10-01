# Session 25 Remediation Plan — The Loading-State + Export/Button-Contract Layer (2026-10-01)

**Scope:** Fresh-login live audit of the reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `43f9ac0`
(pulled to the operator's session-24 transcript `docs/session_42.md` —
the ONLY change since `e445980`; zero app-code drift, so every pinned
family from s24's live verification held by construction). Workspace
intact: `.env` with `DATABASE_URL="file:../db/custom.db"` + `db/` at the
repo root, dev server healthy on :3000, vitest + playwright configs in
place. **Baseline gate green: lint 0/0 · tsc clean · 434/434 unit.**

**Standing layers re-verified FIRST (moving-target rule) — NO drift:**

- **Mobile navigation (the standing priority)**: (a) the reference at
  390px still ships NO navigation (**21st consecutive session** — zero
  visible nav links, no `<aside>`, the only small button is the base44
  platform badge); (b) our drawer's 7-check regression LIVE **7/7 PASS**
  — trigger hit-test 36×36 at (16,16); open + 8 links (the capitalized
  hrefs) + focus entry on the Close X + dual scroll locks; Escape + lock
  release + focus restore; focus-trap wrap BOTH directions; resize-past-md
  auto-close + the desktop sidebar swap; route-change close (drawer
  Leads link → h1 "Leads" at `/Leads`, closed, unlocked); **zero 390px
  overflow on all eleven routes** (9 authenticated + /login + /signup
  logged out via the logout API). One probe lesson: the drawer is the
  hand-rolled dialog (NO `data-state` attribute — probe via the `inert`
  attribute / computed visibility) and drawer-link selectors must scope
  inside `[role=dialog]` (the hidden desktop sidebar's matching href
  shadows the drawer's link in `querySelector` order).
- **The route-case layer (s24, standing)**: all nine capital routes
  render in place; the capital heads curl-verified with the session
  cookie (`/Reports` serves canonical + og:url at `/Reports`;
  `/Dashboard` serves the ROOT head exactly like the reference).
- **The tabs ARIA layer (s23, standing)**: wiring spot-probe on both
  apps — activities 4/4, reports 5/5, settings 3/3 wired + backWired.
  IDENTICAL contracts (tab labels byte-identical too).
- **The typography / base-cascade layer (s22, standing)**: controlled-
  span metrics EXACTLY equal on both apps (410.03px regular / 435.70px
  bold on this session's 52-char probe string); the computed family
  byte-identical; smoothing `auto`; `document.fonts` empty on the
  reference (our 4 faces = the documented dev-overlay Geist artifacts).
- **The document metadata + PWA + HTTP header layers (s18+s19+s20)**:
  curl-SSR — description, theme-color #000000, the manifest link, the
  three security headers on `/`, robots.txt with the Sitemap line,
  sitemap 9 locs + bare `application/xml`, the byte-format manifest.
- **Demo data still zero (21st consecutive session)** — /Reports served
  the empty-state rows (Total Leads 0, Won Deals 0, Saved Reports (0)).
- **The print stylesheet family (the s41 pointer — CLOSED at parity)**:
  the reference's stylesheet ships ZERO `@media print` rules; ours ships
  zero. Both apps' only print-adjacent surface is the Reports PDF
  button — probed below (it is NOT a print dialog on the reference).
- **Keyboard shortcuts beyond the tabs model (the s41 pointer — CLOSED
  at parity)**: the reference's 1.6MB JS bundle contains ONLY
  library-standard keydown handlers — Radix Escape/Tab/arrow models +
  recharts' internal traveler keys; zero application shortcuts (no `/`,
  no Cmd+K, no letter keys, no `?`). Our clone ships the same library
  set (Radix + recharts) and no app shortcuts.

**This session's NEW audit layer — the loading-state + export/button
contract census (never swept in 24 sessions).** Method: a broad
MutationObserver installed BEFORE SPA navigations (the s24 census-method
pointer), a `--init-script` fetch-delaying harness for hard loads (the
skeleton window is unobservable at CLI latencies otherwise), a CDP
network-route abort probe (data-never-arrives → the true loading
family), createElement/createObjectURL spies (client-side download
generation is invisible to MutationObserver), and REAL agent-browser
clicks for every control (the s24 click-contract lesson — an eval
`.click()` does NOT switch Radix tabs and silently false-negatives).

| # | Sev | Issue | Evidence (live probes) |
|---|-----|-------|------------------------|
| S25-P1 | **High** | **The loading/suspense layer — the reference ships ZERO loading UI; our clone ships five skeleton families.** The reference's model is instant-render-with-zeros: with its Lead entity fetch network-ABORTED, the full /Leads page renders immediately (h1, KPI cards showing 0, the empty table row — even "Hi, Guest" when the user fetch fails too); a broad MutationObserver across SPA navigations reads ZERO pulse/skeleton/spinner/progress elements; its bundle's CSS has no skeleton vocabulary. Our clone ships skeletons that flash during the fetch window — caught live with the 4s-delayed-API init script: the dashboard renders **6 × h-[118px] KPI skeletons from FIRST PAINT** (the `!k` condition), /Leads renders the empty state pre-hydration then **5 × h-12 skeleton rows** during the fetch window (T≈5.5s with the delay), and accounts/contacts/reports carry the same families (5 × h-12 rows, 4 × h-24 cards, 5 × KPI + 4 × h-64 ReportSkeletons). The skeletons also cause the documented e2e "reports skeleton race" flake (the workaround comment at tests/e2e/crm.spec.ts:176). Fix: retire the Skeleton families — render the zero-data UI immediately (the reference's instant-render model; the empty state IS the loading state), following the session-10 ChartEmpty-retirement precedent. The store's `loadingFlags` + the reports page's `loading` state become dead and retire with them. | the aborted-fetch probe (reference /Leads with Lead fetch blocked); the MutationObserver SPA-nav probes (zero loading elements, both apps); the delayed-fetch init-script catches (6 skeletons dashboard / 5 skeletons leads on OUR app); source: `!k` in `(app)/page.tsx:145`, `loadingFlags.X && X.length===0` in leads:387/accounts:327/contacts:339+411, `loading && !data` in reports:150+213-217 |
| S25-P2 | **High** | **The PDF export contract — the reference's Reports exports are REAL client-side PDFs; ours is a `window.print()` + an invented toast.** (a) The header **PDF** button: spawns an `IFRAME.html2canvas-container`, renders the content area (NO sidebar — VLM-verified on the rendered PDF: page header + filter bar + KPI cards + tabs + charts), assembles via **jsPDF 4.0.0** (the PDF /Producer string) into **A4 portrait** pages (595.28 × 841.89pt) split across the content height, and downloads as **`crm_reports_YYYY-MM-DD.pdf`** (19MB canvas render at zero data) — no toast, no print dialog, no loading state. (b) The per-table **Export PDF** buttons (tab 2): generate a TEXT jsPDF (3.5KB) — title, `Generated: M/D/YYYY`, the table's column headers, rows — and download as **`<slug>_YYYY-MM-DD.pdf`** (`open_deals_by_stage_2026-10-01.pdf`, `deals_at_risk_2026-10-01.pdf` — the slug TRUNCATES the card title at the parenthetical: "Deals at Risk (No Activity 14+ Days)" → `deals_at_risk`). Our clone's `exportPdf()` calls `window.print()` + `toast.info("Print dialog opened", …)` on all three buttons — an invented behavior (the s24 More... lesson again: the class-level pins recorded the buttons' looks, never their clicks). Fix: add `jspdf@4.2.1` + `html2canvas-pro@2.5.0` (pro — our compiled CSS carries 242 `color-mix()` calls that classic html2canvas 1.4.1 cannot parse; zero oklch, but color-mix is enough to require the fork), implement both export families in a `src/lib/pdf-export.ts` seam, retire `window.print()` + the toast. | the iframe mutation + the downloaded `crm_reports_2026-10-01.pdf` (pdfinfo: 2 pages, A4, /Producer jsPDF 4.0.0) + the VLM read of the rendered pages; the per-table downloads + pdftotext extraction ("Open Deals by Stage / Generated: 10/1/2026 / Deal Stage Amount"); the `window.print` spy (printCalled: 0 on the reference); source: reports-page.tsx:227-230 |
| S25-P4 | **High** | **The "Save Custom Report View" dialog — the reference's "Saved Reports (N)" button opens a full save/load dialog with localStorage persistence; ours ships a hardcoded "(0)" + an invented toast.** The reference's dialog (stock Radix chrome — the same DialogContent/Title/Label/Input families our entity dialogs use): DialogTitle "Save Custom Report View"; Label "Report Name" + Input (placeholder `e.g., Q1 Won Deals by Region`); Label "Select Columns to Display" + 6 checkbox rows (Name / Account / Owner / Value / Stage / Won Date, all default checked — the stock shadcn checkbox construction `peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow` + the Check indicator); the "Current Filters:" summary (`Date Range: quarter, Stage: all, Owner: all` — raw slugs, 3 dimensions only); the saved list when ≥1 exists (`border-t pt-4` + "Saved Reports" label + `space-y-2 max-h-48 overflow-y-auto` scroll list + per-item `flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100` rows with the blue bookmark glyph + name + M/D/YYYY + an outline "Load" button); footer Cancel + Save Report (disabled until named) + the opacity Close X. **Save** → persists to localStorage under **`crm_saved_reports`** as `[{"id":"<Date.now()>","name":…,"filters":{dateRange,stage,source,status,owner},"columns":{name,account,owner,value,stage,wonDate},"createdAt":ISO}]` + the button count updates + the dialog closes (zero network, zero toasts). **Load** → applies the saved filters to the filter bar + closes. The internal dateRange vocabulary is the SHORT form (verified live: This Quarter → `quarter`, Today → `today`, YTD → `ytd`). Fix: implement the dialog + a `src/lib/saved-reports.ts` localStorage seam (the established lead-filters.ts pattern), wire the button to the count + the dialog. | the dialog snapshot + the save round-trip (label → "Saved Reports (1)", the localStorage JSON byte-extracted, the Load click applying the filters); source: reports-page.tsx:69-73 (the invented toast) |
| S25-P5 | **Med** | **The CSV export contract — filenames + column sets + the reports CSV wiring.** The reference's CSVs are client-side blobs downloading as **`prefix_YYYY-MM-DD.csv`** (underscore + ISO date): the leads "Export" → **`leads_2026-10-01.csv`** with headers **`Name,Email,Phone,Company,Value,Status,Source,Next Follow-up`** (59B headers-only at zero data); the reports header "Export CSV" → **`crm_report_2026-10-01.csv`** (SINGULAR "report") with headers **`Deal Name,Account,Amount,Stage,Source,Owner,Close Date`**; the reports per-table "Export CSV" → **`open_deals_2026-10-01.csv`** with **`Deal,Stage,Amount`** and `deals_at_risk_…csv` with `Deal,Account,Amount` (the table's own columns). The accounts header + contacts "Export CSV" are **DISABLED at zero data** and the accounts toolbar one is a no-op (zero blob/anchor) — data-gated, headers unknowable (documented). Our clone: `csvFilename()` emits `prefix-YYYYMMDD.csv` (wrong format); the leads CSV ships a different column set (`Lead Name,Email,Phone,Company,Value,Stage,Status,Source,Expected Close,Created`); **the reports header + BOTH per-table CSVs are wired to `/api/export?type=leads`** (the leads dataset — completely wrong data + filename). Fix: the filename format in `csv.ts`; the leads column set in the export route; a filter-aware `/api/export?type=report` (the 7-column deal CSV); client-side per-table CSVs from the in-memory rows; a `downloadBlob()` helper. | the createElement/createObjectURL spies + the downloaded files (`leads_…`, `crm_report_…`, `open_deals_…`) + `cat` of the headers; source: csv.ts:29-33, export/route.ts, reports-page.tsx:410+447 |
| S25-P6 | **Med** | **The reports period vocabulary — the reference ships 6 periods including Today + YTD; ours ships 5 without them.** The reference's period combobox: **Today / This Week / This Month / This Quarter / YTD / All Time**; ours: This Week / This Month / This Quarter / **This Year** / All Time (the This Year ↔ YTD divergence + the missing Today). The reference's internal values are the SHORT forms (today/week/month/quarter/ytd/all — today/quarter/ytd verified live via the saved-report localStorage). Fix: `REPORT_PERIODS` → the reference's 6-entry vocabulary (ids today/week/month/quarter/ytd/all, labels matching), the page state default `quarter`, the API `periodStart()` extended (`today` → startOfDay, `ytd` → startOfYear, `this_year` retired) — this also makes the saved-report `dateRange` values byte-faithful. | the reference's expanded listbox (6 options, This Quarter selected) vs our expanded listbox (5 options); the saved-report probes (quarter/today/ytd) |
| — | Info | **Verified at parity (no action):** the per-table Export CSV/PDF buttons EXIST on both apps (S25-P3 disproven — the initial eval-click probe was the false negative; real clicks show the reference's tab-2 pair); the reports tab labels + structure; the Leads header "Export" button's ENABLED-at-zero-data state (both apps export headers-only CSVs); the accounts/contacts disabled-at-zero-data states are data-gated-unverifiable (21 sessions). | the real-click probes above |

**Census-method lessons this session (→ SKILL §16q):**
- **The skeleton window needs an init-script fetch delay**: at CLI
  latencies every post-open eval lands post-hydration; only a
  `--init-script` that patches `window.fetch` (with `init` passed
  through — a url-only patch silently converts POSTs to GETs and
  405s the login) exposes the transitory loading states.
- **Client-side download generation is invisible to MutationObserver**:
  jsPDF/blob downloads create + click + remove the anchor
  synchronously — spy on `document.createElement('a')` +
  `URL.createObjectURL` to see them, and check `~/Downloads` for the
  artifact.
- **An eval `.click()` does not switch Radix tabs** (and dispatched
  MouseEvents are unreliable on the reference's handlers): tab-switch
  probes MUST use real agent-browser ref clicks — this session's S25-P3
  false-negative + the delayed-POST cancellation (navigating away
  mid-fetch kills the login) are the two sequencing hazards.
- **The hand-rolled drawer has no `data-state`**: probe open/closed via
  the `inert` attribute (or computed visibility), and scope link
  selectors inside `[role=dialog]` — the hidden desktop sidebar's
  matching href wins `querySelector` order and blocks the click.

---

## ToDo — execution order (TDD)

### Phase A — red tests first

1. New `tests/pdf-export.test.ts` (~12 checks, the established
   source-pin pattern with comment-stripping): `src/lib/pdf-export.ts`
   exists with `exportReportsPdf` (the html2canvas-pro + jsPDF imports;
   the A4 portrait + paginated addImage loop; the
   `crm_reports_${isoDate()}.pdf` filename) and `exportTablePdf`
   (the text layout: title + `Generated: ${m/d date}` + column headers +
   rows; the `<slug>_${isoDate()}.pdf` filename; the paren-truncating
   slug rule); `reports-page.tsx` wires all three buttons to the seam
   (the header PDF + both per-table Export PDFs) and carries NO
   `window.print` + NO toast on the PDF path; `package.json` carries
   `jspdf` + `html2canvas-pro`.
2. New `tests/saved-reports.test.ts` (~14 checks): the
   `src/lib/saved-reports.ts` seam (the `crm_saved_reports` storage key;
   the SavedReport schema — id/name/filters{dateRange,stage,source,
   status,owner}/columns{name,account,owner,value,stage,wonDate}/
   createdAt; the encode/decode round-trip; the load-all/save/next-id
   helpers); the dialog component's structure pins (the title, the
   Report Name input + its placeholder, the 6 column checkboxes, the
   Current Filters 3-dimension summary, the saved list's scrollable
   construction, the Load button, the disabled-until-named Save
   Report); the reports page wiring (the button label renders the live
   count; the toast retired).
3. New `tests/loading-layer.test.ts` (~10 checks): zero `Skeleton`
   imports across the app pages; zero `animate-pulse` in `src/`; the
   dashboard renders KPI cards when `k` is null (the `!k` skeleton
   branch retired — zero `h-[118px]` skeleton strings); the
   leads/accounts/contacts table branches render the empty state (zero
   `loadingFlags` references in the pages); the reports page has no
   `loading` state + no ReportSkeletons + no `h-64` skeleton strings;
   `crm-store.ts` carries no `loadingFlags` field + no `loading()`
   helper; `misc.tsx` no longer exports the Skeleton component.
4. New `tests/csv-contract.test.ts` (~8 checks): `csvFilename()`
   emits `prefix_YYYY-MM-DD.csv` (the underscore + ISO format); the
   export route's leads columns are the reference's 8 (Name…Next
   Follow-up — no Lead Name/Stage/Expected Close/Created); the route
   handles `type=report` (the 7 deal columns, the period/owner/stage/
   status filter params); `download.ts` exports `downloadBlob()`;
   the reports page's header Export CSV targets `type=report`; the
   per-table CSVs generate client-side (the `toCsv` + `downloadBlob`
   wiring with the `open_deals_`/`deals_at_risk_` filenames).
5. New `tests/report-periods.test.ts` (~5 checks):
   `REPORT_PERIODS` is the reference's 6-entry vocabulary (today/week/
   month/quarter/ytd/all with the Today/This Week/This Month/This
   Quarter/YTD/All Time labels); the API's `periodStart` maps today →
   startOfDay + ytd → startOfYear + no `this_year` case; the reports
   page's default period is `quarter`.
6. E2E additions in `tests/e2e/crm.spec.ts` (~8 checks): the reports
   header PDF click downloads `crm_reports_*.pdf` (Playwright's
   download event + the saved file's `%PDF` header); the per-table
   Export PDF downloads `open_deals_by_stage_*.pdf`; the per-table
   Export CSV downloads `open_deals_*.csv`; the Saved Reports dialog
   round-trip (open → the title + 6 checkboxes + disabled Save →
   type a name → save → the button reads "(1)" → re-open → the list
   shows the name + Load → click Load → the dialog closes); the
   period dropdown lists all 6 options; the dashboard KPI cards are
   visible immediately post-login (no skeleton pass — the tab region
   stable at T+0).
7. E2E UPDATES: the reports tab-structure test's skeleton-race
   workaround comment + wait (the `.recharts-wrapper` wait stays — the
   charts still lazy-render inside Suspense); any `this_quarter`
   fixtures → `quarter`; the accounts/contacts export e2e (if any)
   → the new filename format.

### Phase B — implementation

1. **S25-P1**: strip the Skeleton branches from the five pages
   (dashboard `!k` → render the KPI cards with `k ?? zero` defaults +
   the charts' existing empty states; leads/accounts/contacts → the
   empty-state row directly; reports → drop the `loading` state, the
   `loading && !data` branch, and the ReportSkeletons module-level
   component — each TabsPanel renders its tab unconditionally with
   `data` possibly null); delete the `Skeleton` export from
   `misc.tsx`; remove `loadingFlags` + the `loading()` helper from
   `crm-store.ts` and all the `set(loading(...))` calls.
2. **S25-P2**: `src/lib/pdf-export.ts` — `exportReportsPdf()`
   (html2canvas-pro on the main content element at scale 2, the A4/pt
   jsPDF, the full-width paginated addImage loop, the
   `crm_reports_${isoDate()}.pdf` save) + `exportTablePdf(title,
   columns, rows)` (the text layout + the paren-truncating slug +
   `<slug>_${isoDate()}.pdf`); wire the reports page's three buttons;
   retire `exportPdf()`/`window.print()`/the toast.
3. **S25-P4**: `src/lib/saved-reports.ts` (the seam) +
   `src/components/shared/save-report-dialog.tsx` (the stock-kit
   dialog) + the reports page wiring (the count state read on mount
   via the established leads-filters effect pattern; open/save/load).
4. **S25-P5**: `csvFilename()` → the ISO-underscore format; the
   export route's leads column set + the `type=report` branch (the
   same filter params as /api/reports); `downloadBlob()` in
   `download.ts`; the reports header CSV → `type=report` with the
   current filter params; the per-table CSVs → client-side `toCsv` +
   `downloadBlob` with the table's own rows.
5. **S25-P6**: `REPORT_PERIODS` → the 6-entry reference vocabulary;
   `periodStart()` + the page state + the store's default → the short
   ids.

### Phase C — gate + live re-verification

Full gate: `bun run lint` → `bun run typecheck` → `bun run test`
(470+) → `bun run build` → `bun run test:e2e` (80+). LIVE on the dev
server: the PDF downloads land with the reference's filenames + a
visual spot-check of the canvas PDF (the content area, no sidebar);
the per-table PDF's text layout; the Saved Reports round-trip (save →
count → list → load); the CSV filename + headers; the period dropdown's
6 options; the no-skeleton probes (the dashboard KPI cards at T+0 with
the delayed-fetch harness + the broad observer reading zero loading
elements); the standing layers spot-check (drawer open/Escape, the
tabs wiring, the head census, the typography probe); the 390px overflow
sweep.

### Phase D — deliverables

The established 23 screenshots re-captured under `docs/screenshots/`
with per-shot URL + content verification (+ the new surfaces: the Saved
Reports dialog open — the reference has no equivalent screenshot family,
ours documents the new feature); `.env`/`.env.example` re-verified (no
new env surface); docs realigned (README badge + the loading-layer +
export-contract rows + counts, AGENTS counts + the session-25 contract
block, CLAUDE counts + the new suites, PAD matrix + the §5 blocks, SKILL
v1.22.0 §16q + frontmatter + project_state, `docs/session_43.md`, this
plan's addendum, the repo worklog); commit on main + SSH-wrapper push.

---

## Addendum — execution record (same session)

**Phase A (red tests):** 41 checks across five files —
`tests/pdf-export.test.ts` (10), `tests/saved-reports.test.ts` (13),
`tests/loading-layer.test.ts` (8), `tests/csv-contract.test.ts` (7),
`tests/report-periods.test.ts` (3). **RED confirmed before any
implementation** (39 failed / 2 structural passes on the first run —
the two passes were `package.json` dependency checks satisfiable only
after `bun add`, so the implementation still started from red).
Two checks strengthened mid-red after source review: the
loading-layer suite initially missed the `misc.tsx` Skeleton-export
retirement (added) and the csv-contract suite initially missed the
per-table CLIENT-side generation split (the header CSV stays
server-side `type=report`; the per-table CSVs are in-memory blobs).

**Phase B (implementation):** all five findings implemented in the
planned order (skeletons → PDF seam → saved-reports seam + dialog →
CSV contract → period vocabulary). Gate-caught during the phase: (a)
the dashboard's KPI cards needed the reports page's existing
null-safe pattern (`k?.totalLeads ?? 0` — the reports cards already
ship it; the dashboard's `!k` branch was the only gate), the deltas
already accept `number | undefined`; (b) the per-table exports needed
per-family filename prefixes — the reference's OWN inconsistency,
caught by the final e2e run: its per-table CSVs download with SHORT
literals (`open_deals_…`, `deals_at_risk_…`) while its PDFs use the
full paren-truncated slugs (`open_deals_by_stage_…`) — the CSV
prefixes are explicit per-button literals, the PDF keeps
`tableSlug()`; (c) the
saved-reports count read on mount needed the leads-filters effect
pattern (localStorage is unavailable during SSR — the dialog + the
button label both hydrate client-side); (d) tsc caught the retired
`loadingFlags` type references in the store's action signatures.

**Phase C (gate + live re-verification):** lint 0/0 · tsc clean ·
**475/475 unit** (+41) · build clean · **79/79 e2e** (+6 — the first
full run read 78/79: the per-table CSV test failed on the SHARED slug
assumption, and the failure itself surfaced the reference's
CSV-shorter-than-PDF prefix split above). LIVE: the
header PDF downloads `crm_reports_2026-10-01.pdf` (jsPDF A4 portrait,
the content area captured WITHOUT the sidebar — VLM-verified against
the reference's own artifact); the per-table PDFs download with the
reference's exact filenames; the Saved Reports round-trip verified
(save → "(1)" → re-open → the list + Load → applied + closed); the CSV
filenames + headers byte-matched; the period dropdown ships the
reference's 6 options; the delayed-fetch harness reads ZERO loading
elements on our app (the reference's instant-render model); the
standing layers re-verified post-change (drawer 7/7, tabs 4/4-5/5-3/3,
typography metrics exactly equal, the head census, zero 390px
overflow).

**Phase D (deliverables):** 24 screenshots captured with per-shot
verification (the 23 established re-captured post-remediation + shot
24 the Saved Reports dialog open — the reference has no equivalent
screenshot family, ours documents the new feature); `.env`/
`.env.example` re-verified (no new env surface — the PDF stack is
dependency-only). Docs realigned (README badge 554 + the three new
feature rows + counts, AGENTS counts + the session-25 contract
block, CLAUDE counts + the five new suites, PAD matrix 475/79 + the
§5 loading + export blocks, SKILL v1.22.0 §16q + frontmatter +
project_state, `docs/session_43.md`, this addendum, the repo worklog).
Committed on main + SSH-wrapper push.
