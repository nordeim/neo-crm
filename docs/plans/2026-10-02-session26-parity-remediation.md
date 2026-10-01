# Session 26 Remediation Plan — The Settings Data-Tab + Import/Export Contract Layer (2026-10-02)

**Scope:** Fresh-login live audit of the reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `86405d0`
(pulled to the operator's session-44 transcript `docs/session_44.md` — the
ONLY change since `0cec8c7`; zero app-code drift, so every pinned family
from s25's live verification held by construction). Workspace rebuilt from
scratch this session: `bun install` (537 packages), `.env` recreated from
`.env.example` (`DATABASE_URL="file:../db/custom.db"` + a fresh
`AUTH_SECRET`), `db/` at the repo root via `bun run db:push` +
`db:seed`, dev server healthy on :3000. **Baseline gate green: lint 0/0 ·
tsc clean · 475/475 unit · 307 root guard · 200 login.**

**Standing layers re-verified FIRST (moving-target rule) — NO drift:**

- **Mobile navigation (the standing priority)**: (a) the reference at 390px
  still ships NO navigation (**22nd consecutive session** — the sidebar
  links exist in the DOM at `display:flex` but every one fails
  `getClientRects()` (the container is `display:none` below lg); zero
  hamburger, zero `<aside>`, the only small button is the base44 platform
  badge); (b) our drawer's 7-check regression LIVE **7/7 PASS** — trigger
  hit-test 36×36 at (16,16) with the real elementFromPoint hit; open via
  real click (8 capitalized links all visible, focus entry on the Close X
  after the retry-guarded frame race, dual scroll locks); Escape + lock
  release + focus restore to the trigger; focus-trap wrap BOTH directions
  (Tab on "Settings" → "Close navigation menu", Shift+Tab on "Close" →
  "Settings"); resize-past-md auto-close + the desktop sidebar swap (8
  links); route-change close (drawer Leads link → h1 "Leads" at `/Leads`,
  inert, unlocked). **Zero 390px overflow on all eleven routes** (9
  authenticated + /login + /signup logged out via the logout API).
- **Tailwind CSS v4 hazards**: zero — CSS-first `@theme` with literal hex
  tokens, no zombie `tailwind.config.js`, `@utility` (never
  `@layer utilities`), the vendored `tw-animate.css`, and the mobile-nav
  component avoids the full v4 pitfall set (`hidden` attribute never
  fighting display utilities, `h-dvh` not `100vh`, the auto-close media
  query in lockstep with the `md` range, pure CSS transform/opacity
  transitions).
- **Demo data still zero (22nd consecutive session)** — /Reports served
  "Saved Reports (0)", the dashboard KPIs at `$0.0k`.
- **The typography layer (s22)**: controlled-span metrics EXACTLY equal
  (466.8 regular / 522.4 bold this session), byte-identical family, 16px.
- **The tabs ARIA layer (s23)**: settings wiring identical on both apps
  (3/3 wired + backWired, byte-identical labels).
- **The dashboard structure**: h1 classes, KPI count, topbar search
  classes — parity; side-by-side screenshots captured.
- **The s25 layers**: pinned green in the 475/475 baseline (route-case,
  metadata, http-headers, loading-layer, pdf-export, saved-reports,
  csv-contract, report-periods). The leads-page export verified at
  parity (no action): same 8 columns + `leads_ISO.csv` filename on both
  apps, headers-only at zero data on both.

**This session's NEW audit layer — the Settings Data-tab + import/export
contract census (never swept in 25 sessions; the s44 "Next" pointers).**
Method: real agent-browser ref clicks for every Radix control (the
documented eval-click hazard), `document.createElement('a')` +
`URL.createObjectURL` + `Blob` constructor spies (client-side download
generation is invisible to MutationObserver), native-dialog interception
(`dialog accept`), network-log forensics with a cleared log, and — the
session's decisive method — **byte-extraction of the reference's own
minified bundle** (`fetch` of every `/assets/` + `/static/` script +
`indexOf` pattern walks), which turned three "data-gated — 22 sessions"
surfaces into fully knowable contracts.

| # | Sev | Issue | Evidence (live + bundle) |
|---|-----|-------|------------------------|
| S26-P1 | **Med** | **The Settings Data tab is missing the reference's three CardDescription lines + the 2nd+ button margins.** The reference's Import Templates card ships a `text-sm text-muted-foreground` DIV "Download CSV templates for bulk imports"; its Export Data card ships "Export your CRM data to CSV"; its Danger Zone card ships a `text-red-600` DIV "Permanently delete all CRM data. This cannot be undone." Ours ship NO descriptions on any of the three cards (the s14 pin recorded the card chrome, never the header subtitles — the same class-of-pin blind spot as s24's More... button). The button rows: the reference's FIRST button is `w-full sm:w-auto` and every 2nd+ button adds `ml-0 sm:ml-2` (live-computed marginLeft 8px on buttons 2-3 of the template row and 2-4 of the export row); ours render every button without the margin classes. | the DOM probes (`getClientRects`-verified DIVs, computed marginLeft), the bundle's `c.jsx(my,{children:...})` CardDescription calls; source: settings-page.tsx:169-247 |
| S26-P2 | **High** | **The reset flow — the reference gates it with a native confirm() and reports via native alert(); ours resets directly with an invented toast.** The reference's handler (bundle-extracted): a defensive `alert("Please type RESET to confirm")` guard, then `confirm("This will permanently delete all contacts, accounts, leads, opportunities, activities, and calendar events. Are you sure?")`, then the destructive pass, then `invalidateQueries(); t(""); alert("Data reset complete")` with a `catch { alert("Failed to reset data") }`. Live-verified twice on the reference (the confirm dialog intercepted + accepted; the input cleared, the button re-disabled, all six entity lists refetched — at zero data the deletes are no-ops, so the network log shows ONLY the 6 `list()` GETs). Ours: click → direct `resetData()` → `toast.success("Workspace reset", "All domain data deleted. Seed again with \`bun run db:seed\`.")` — the s24/s25 invented-toast family again. The reference's reset button also carries a `lucide-trash2 w-4 h-4 mr-2` icon; ours carries none. Our store's `resetData` already refetches every entity after the wipe (the invalidation equivalent) — that half is at parity. | the bundle extraction (`rt.entities.X.list().then(y=>Promise.all(y.map(x=>rt.entities.X.delete(x.id))))` × 6 + the alert tail), the two live accept cycles + the network log; source: settings-page.tsx:230-245 |
| S26-P3 | **High** | **The "Download X Template" buttons — the reference ships STATIC client-side CSV templates; ours hits `/api/export` (server-side, live data).** The reference's `b(key)` (bundle-extracted): a three-entry static map → `new Blob([_], {type:"text/csv"})` → anchor `download=\`${key}_template.csv\``. Byte-extracted templates (the Blob-constructor spy, live): contacts `name,email,phone,company,position,source\nJohn Doe,john@example.com,+1234567890,Acme Inc,Sales Manager,email`; accounts `name,industry,website,phone,email,annual_revenue,employees,status\nAcme Inc,Technology,acme.com,+1234567890,info@acme.com,1000000,50,active`; leads `name,email,phone,company,status,source,value\nJane Smith,jane@example.com,+1234567890,Beta Corp,new,website,50000`. Filenames `contacts_template.csv` / `accounts_template.csv` / `leads_template.csv`. Ours wire all three buttons to `downloadFile("/api/export?type=X")` — real data, wrong filename, wrong content. | the Blob spy + the bundle map; source: settings-page.tsx:174-182 |
| S26-P4 | **High** | **The Settings "Export Data" buttons — the reference ships client-side RAW-DUMP CSVs with SINGULAR prefixes; ours hits `/api/export` with plural prefixes.** The reference's `m(entity)` (bundle-extracted): `const x = await rt.entities[entity].list(); const csv = [Object.keys(x[0]||{}).join(","), ...x.map(N => Object.values(N).map(E => \`${E}\`).join(","))].join("\n")` → Blob → anchor `download=\`${entity.toLowerCase()}_ISO-date.csv\``. Every value double-quoted; the header row is the FIRST ROW's own keys (so at zero rows the artifact is an EMPTY file — live-verified: the anchor fired four times with `contact_/account_/lead_/activity_2026-10-01.csv` and empty blob bodies). Ours wire the four buttons to `/api/export?type=contacts&download=1` etc. — server-side, our own column sets, `contacts_` plural filenames. | the anchor+Blob spies (empty bodies at zero data) + the bundle extraction; source: settings-page.tsx:191-202 |
| S26-P5 | **High** | **The contacts/accounts PAGE export buttons — the reference ships client-side quoted CSVs with its own column sets (the 22-session "data-gated" surface, unlocked by the bundle); ours ship server-side CSVs with different columns.** Contacts page (bundle): `if (contacts.length === 0) return;` guard + columns `Name,Email,Phone,Company,Position,Status,Source` + `"${v}"`-quoted cells + `contacts_ISO.csv`; the button is DISABLED at zero data (live). Accounts page (bundle): the same guard + columns `Name,Industry,Phone,Email,Website,Annual Revenue,Employees,Status,Tier,Health` + `accounts_ISO.csv`; TWO buttons — the header one disabled at zero data, the toolbar one enabled-but-guarded (live: disabled+enabled pair). Ours: both pages wire `/api/export` with OUR column sets (contacts 8-col incl. Priority+Created; accounts 10-col in a different order with "Account Name"/"Key Account" and NO Health). **The Health gap is a model gap**: the reference's Account entity carries a stored `health` (Healthy/At Risk/Needs Attention — its detail view's class-map), backend-defaulted (its New Account dialog has NO health field — live-verified: 8 labels, none health); our Prisma Account model lacks the field entirely. | the bundle's two page-export functions + the live disabled-state probes + the reference dialog field census; source: contacts-page.tsx:174, accounts-page.tsx:143+260, api/export/route.ts:42-71 |
| S26-P6 | **Med** | **The Import Contacts dialog — the reference's contract differs from ours end-to-end.** The reference (live + bundle): description "Upload a CSV or Excel file with contact information"; a "Select File" stock label; a dropzone label with an `w-8 h-8 text-gray-400` icon, `n ? n.name : "Click to upload CSV or Excel"` (`text-sm text-gray-600`) + "CSV, XLS, XLSX" (`text-xs text-gray-400`); `input accept=".csv,.xls,.xlsx"` hidden; a chosen-file box `p-2 bg-blue-50 rounded border border-blue-200` with a `w-4 h-4 text-blue-600` icon + `text-sm text-blue-900 flex-1` filename; a columns box `bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1` with "Required columns:" (font-semibold) + `ul.list-disc list-inside space-y-0.5 ml-2` [name, email] and "Optional columns:" (font-semibold mt-2) + [phone, company, position, source]. **NO template link anywhere.** Ours: description "Upload a CSV with the columns: name, email, phone, company, position, source."; an INVENTED "Download the CSV template" link (`href="/api/export?type=contacts"` download="contacts-template.csv" — the reference ships no such link); "Choose a CSV file"/"Click to browse" labels; `accept=".csv,text/csv"`; no chosen-file box, no Required/Optional columns section. | the live dialog DOM + the bundle's dialog module; source: contacts-page.tsx:460-485 |

**Census-method lessons this session (→ SKILL §16r):**

- **The reference's own bundle is the census instrument of last resort**:
  three surfaces held "data-gated — 22 sessions" status until the minified
  bundle gave up the exact export/reset/template implementations
  (`fetch` each `/assets/` + `/static/` script from inside the page,
  `indexOf` pattern walks with ±200-1600-char context windows). The
  bundle is ground truth even where the live DOM cannot express the
  contract (zero-data states, with-data column orders, native dialogs).
- **Native dialogs need explicit interception**: `confirm()`/`alert()`
  block the page; resolve them with `dialog accept`/`dialog dismiss`
  before any further command. And an `alert()` following an accepted
  `confirm()` in the same handler may be auto-dismissed by the CLI —
  treat the bundle as ground truth for the alert strings, the live DOM
  for the state changes (input cleared, button re-disabled, the entity
  refetch wave).
- **The `ml-0 sm:ml-2` button-margin family is invisible to class-level
  pins that only record the FIRST button of a row** — pin per-index
  classes (or computed marginLeft) whenever a reference row mixes
  per-item classes.

---

## ToDo — execution order (TDD)

### Phase A — red tests first

1. New `tests/settings-data-tab.test.ts` (~12 checks, the established
   source-pin pattern): the settings page ships the three
   CardDescriptions — Import Templates "Download CSV templates for bulk
   imports", Export Data "Export your CRM data to CSV", Danger Zone
   "Permanently delete all CRM data. This cannot be undone." — with the
   reference's classes (`text-sm text-muted-ink` on the first two via a
   new `SETTINGS_DATA.desc` pin, `text-red-600` on the danger one via
   `SETTINGS_DANGER.desc`); the button rows carry the per-index margin
   classes (a new `SETTINGS_DATA.buttonClsAlt = "w-full sm:w-auto ml-0
   sm:ml-2"` applied to every 2nd+ button of both rows); the reset button
   carries the `Trash2` icon (`h-4 w-4`, the BUTTON_BASE iconGap mr-2).
2. New `tests/reset-flow.test.ts` (~8 checks): the settings page's reset
   handler source carries `confirm(` with the exact 118-char message
   ("This will permanently delete all contacts, accounts, leads,
   opportunities, activities, and calendar events. Are you sure?"), the
   success `alert("Data reset complete")`, the catch
   `alert("Failed to reset data")`, the defensive
   `alert("Please type RESET to confirm")` guard, and NO `toast.` call
   on the reset path; the store's `resetData` still refetches every
   entity after the wipe (the existing parity half, now pinned).
3. New `tests/csv-templates.test.ts` (~8 checks): a new
   `src/lib/csv-templates.ts` seam exporting the three byte-exact
   template strings + `templateFilename(key)` → `contacts_template.csv` /
   `accounts_template.csv` / `leads_template.csv`; the settings page's
   three template buttons call the seam through `downloadBlob` and carry
   ZERO `/api/export` references.
4. New `tests/entity-export.test.ts` (~12 checks): a new
   `src/lib/entity-export.ts` seam — `entityDumpCsv(rows)`: header from
   `Object.keys(rows[0] || {})` joined ",", rows from
   `Object.values(row).map(v => \`"${v}"\`)` joined ",", all joined "\n",
   EMPTY STRING at zero rows (no headers when empty);
   `entityExportFilename(entity)` → `contact_/account_/lead_/activity_` +
   `_ISO-date.csv` (singular); the settings page's four export buttons
   wire the seam through `downloadBlob` with ZERO `/api/export`
   references; the contacts page export rewires to a client-side
   `toQuotedCsv`-family helper with the 7-column set
   (Name,Email,Phone,Company,Position,Status,Source) + the zero-data
   guard + the `disabled={!contacts.length}` binding; the accounts page
   export rewires with the 10-column set
   (Name,Industry,Phone,Email,Website,Annual Revenue,Employees,Status,
   Tier,Health) + the guard + the header-button disabled binding (the
   toolbar one stays enabled-but-guarded).
5. New `tests/account-health.test.ts` (~4 checks): the Prisma schema's
   Account model carries `health String @default("Healthy")`; the seed
   assigns varied values (Healthy / At Risk / Needs Attention); the
   accounts export maps `a.health` into the Health column.
6. New `tests/import-dialog.test.ts` (~10 checks): the contacts page's
   import dialog carries the reference's description ("Upload a CSV or
   Excel file with contact information"), the "Select File" label, the
   dropzone with "Click to upload CSV or Excel" + "CSV, XLS, XLSX" +
   `accept=".csv,.xls,.xlsx"`, the chosen-file box classes, the
   Required/Optional columns structure with the `list-disc list-inside
   space-y-0.5 ml-2` lists, and ZERO "Download the CSV template" strings
   (the invented link retired).
7. E2E additions in `tests/e2e/crm.spec.ts` (~8 checks): the Settings
   Data tab renders the three descriptions; the template downloads land
   as `contacts_template.csv` etc. (Playwright download events + content
   checks); the settings export downloads land as `contact_*.csv` /
   `account_*.csv` etc. with the quoted raw-dump bodies (seeded e2e data
   → non-empty, first line = the raw key order); the contacts/accounts
   page exports land with the reference's column sets; the reset flow —
   the confirm dialog accepted, the alert received
   (`page.on('dialog')`), the input cleared, and the dashboard KPIs at
   zero afterward (the LAST test in the file — the wipe must not poison
   earlier assertions); the import dialog structure probe.

### Phase B — implementation

1. **S26-P1**: the three CardDescription DIVs in settings-page.tsx (the
   new `SETTINGS_DATA.desc` / `SETTINGS_DANGER.desc` pins following the
   s14 `SETTINGS_DEFAULTS.subtitle` precedent — our `text-muted-ink`
   token IS the reference's `#737373` muted-foreground); the
   `buttonClsAlt` margin classes on every 2nd+ button of both rows; the
   `Trash2 h-4 w-4` icon inside the destructive reset button.
2. **S26-P2**: the reset handler rewrite — the defensive guard, the
   `confirm()` gate, `try { await resetData(); setResetText("");
   alert("Data reset complete"); } catch { alert("Failed to reset
   data"); }` — the toast retired from the path.
3. **S26-P3**: `src/lib/csv-templates.ts` (the three static strings +
   `templateFilename`) + the three template buttons rewired through
   `downloadBlob` (blob type `text/csv`).
4. **S26-P4**: `src/lib/entity-export.ts` (`entityDumpCsv` +
   `entityExportFilename`) + the four export buttons rewired to the
   store's lists through `downloadBlob`.
5. **S26-P5**: `prisma/schema.prisma` — `health String @default("Healthy")`
   on Account + `bun run db:push` (additive, no data loss) + seed values
   for the demo accounts; the contacts page export → client-side
   (7-col, quoted, guarded, disabled binding); the accounts page export
   → client-side (10-col incl. Health, quoted, guarded, the
   header-disabled/toolbar-guarded split); the now-dead
   `/api/export?type=contacts|accounts|activities` branches retired
   (type=leads + type=report stay — both at verified parity).
6. **S26-P6**: the Import Contacts dialog restructure — the reference's
   description, dropzone (Select File + the w-8 h-8 icon + the
   filename-or-placeholder text + CSV, XLS, XLSX), the hidden
   `.csv,.xls,.xlsx` input, the chosen-file box, the Required/Optional
   columns box; the invented template link retired.

### Phase C — gate + live re-verification

Full gate: `bun run lint` → `bun run typecheck` → `bun run test` (510+)
→ `bun run build` → `bun run test:e2e` (87+). LIVE on the dev server:
the three Data-tab descriptions visible; the template downloads land
with the reference's filenames + byte-exact content; the settings export
downloads land with the singular prefixes + the quoted raw-dump bodies;
the reset round-trip — the confirm dialog + the alert + the input
cleared + the dashboard KPIs at zero + `bun run db:seed` restoring the
demo workspace; the contacts/accounts page exports (quoted cells, the
reference's column orders, disabled at the zero-data state); the import
dialog structure; the standing layers spot-check (drawer open/Escape,
the tabs wiring, the typography probe, the head census, the 390px
overflow sweep).

### Phase D — deliverables

The established 24 screenshots re-captured under `docs/screenshots/`
with per-shot URL + content verification (+ the new surfaces: the Data
tab with its three descriptions + the rebuilt Import Contacts dialog);
`.env`/`.env.example` re-verified (no new env surface); docs realigned
(README badge + the Settings/import/export rows + counts, AGENTS counts
+ the session-26 contract block, CLAUDE counts + the six new suites, PAD
matrix + the §5 blocks, SKILL v1.23.0 §16r + frontmatter + project_state,
`docs/session_45.md`, this plan's addendum, the repo worklog); commit on
main + SSH-wrapper push.

---

## Addendum — execution record (same session)

**Phase A (red tests):** 50 checks across six files —
`tests/settings-data-tab.test.ts` (10), `tests/reset-flow.test.ts` (6),
`tests/csv-templates.test.ts` (5), `tests/entity-export.test.ts` (16),
`tests/account-health.test.ts` (4), `tests/import-dialog.test.ts` (9).
**RED confirmed before any implementation** (46 failed / 4 structural
passes on the first run — the passes were the already-at-parity halves:
the store's refetch block + the file-existence checks satisfiable only
after the seams were written, so the implementation still started from
red). The pin shapes were refined mid-red after source review — the
region-anchor lesson (slice from the FUNCTION definition, not the
button label; widen backward past the JSX attrs that precede the text)
and the quoted-literal lesson (pin JSX text nodes as `>Text<`, JS
strings as `"Text"` — never `"Text"` for JSX).

**Phase B (implementation):** all six findings in the planned order
(page-layout pins → the settings Data tab rewrite → the reset handler →
the two seams → the schema/types/seed health additions → the contacts
export + import dialog → the accounts export → the route cleanup).
Gate-caught during the phase: (a) the TS interface-index-signature rule
— `entityDumpCsv` takes `object[]`, not `Record<string, unknown>[]`
(interfaces lack implicit index signatures); (b) the accounts rows
needed `String(a.annualRevenue || "")` for the numeric fields; (c) the
s17 toolbar Import-button pin needed scoping to the toolbar region —
the rebuilt dialog's dropzone legitimately ships the reference's
`lucide-upload` glyph (live DOM probe), while the toolbar Import button
keeps the reference's Download-glyph quirk.

**Phase C (gate + live re-verification):** lint 0/0 · tsc clean ·
**525/525 unit** (+50) · build clean · **87/87 e2e** (+8). Two
flakes across the full runs, both resolved: the s15 Event-dialog
bounding-box check (clean in isolation ×2, clean in the final run) and
the accounts-export hydrate race (the toolbar guard no-ops at zero
rows — hardened with a toBeEnabled wait on the header button; the
import round-trip's strict-mode fixed by scoping to the first match —
the name renders in BOTH the Table and Cards views). LIVE: the three
descriptions render; the template downloads land byte-exact
(`contacts_template.csv` + the example rows via the Blob spy); the raw
dumps land with the singular prefixes + health in the key order
(`contact_2026-10-01.csv` with `id,name,email,...`); the reset
round-trip (decline holds "RESET" — nothing happens; accept clears +
re-disables; the e2e pinned the confirm + alert vocabulary); the
contacts export `"Name","Email","Phone","Company","Position","Status",
"Source"`; the accounts export `"Name",...,"Health"`; the import dialog
verified attribute-by-attribute (sm:max-w-md, the dropzone family, the
chosen-file box, the columns box, the footer gating, the accept list);
the wipe → reseed cycle restored the demo workspace; zero 390px
overflow on all nine authed routes.

**Phase D (deliverables):** 26 screenshots captured with per-shot
verification (the 24 established re-captured post-remediation + shot 25
the Settings Data tab + shot 26 the rebuilt Import Contacts dialog).
`.env`/`.env.example` re-verified (no new env surface — the two seams
are dependency-free). Docs realigned (README badge 612 + the Settings/
Accounts/Contacts rows + the new Settings import/export row + the
session-26 e2e paragraph, AGENTS counts + four new contract blocks,
CLAUDE counts + the six new suites + the e2e layer, PAD matrix 37
suites / 525+87 + the stale script-table counts fixed, SKILL v1.23.0
§16r + frontmatter + project_state, docs/session_45.md, this
addendum, both worklogs). Committed on main + SSH-wrapper push.
