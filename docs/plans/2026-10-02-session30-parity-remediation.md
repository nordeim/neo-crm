# Session 30 Plan — the contact-photo upload layer (the s51 pointer CLOSED)

Date: 2026-10-02 · Branch: `main` · Base: `9d9c8a8` (docs/session_52.md only — zero app-code drift)

## Context

Session-29 closed the C2 leads pointer (27bd9b3 + d6223b9, gate 697/697 unit · 104/104 e2e,
SKILL v1.26.0). The s51 Next-steps named three pointers: **the contact-photo upload flow**
(the real UploadFile round-trip vs our visual-parity stub — the s47-era deferral), a drift
re-sweep, and the Opportunity-split question. This session closes the first two; the
Opportunity split stays deferred (the Convert item is dead on the reference too, and its
Opportunity entity feeds only the reports pipeline — a model-level seam, not a surface gap).

## Audit results (bundle index-DZ-xbrIm.js — redeployed, all s29 contracts intact + live)

**Standing layers — 26th consecutive session, NO DRIFT:** mobile-nav absent on the reference
at 390px (8 links, 0 visible, no hamburger); our drawer spot-verified live (trigger → 8 links
+ focus on Close + body scroll lock; Escape → closed + restored); zero 390px overflow on all
nine authed routes on BOTH apps; demo data zero; typography controlled-span probes EXACT
(p1=466.75, p2=726.72, byte-identical family); tabs ARIA identical (5 Reports tabs, wired).
The s29-pinned bundle contracts all hold in the redeployed bundle (KPI_STATICS
[65,72,68,85,78,92], the orange Target box, the w-24 h-8 inline value input, "(Active)",
the sticky thead).

**The NEW layer — four UploadFile call sites in the reference's bundle, two live-exercised:**

1. **The AAe contact-dialog photo section** (the pointer — LIVE-verified end-to-end on the
   reference: upload → the base44 CDN file_url → the img renders + the remove X appears;
   the non-image alert intercepted with the exact string). The contract:
   - Avatar `w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500
     to-blue-700 flex items-center justify-center shadow-lg`; `photo_url ?
     <img src alt={name} className="w-full h-full object-cover"/> : <span
     className="text-white font-bold text-3xl">{initials2 || <User className="w-10 h-10
     text-white/80"/>}</span>` (initials = split(" ").map(c=>c[0]).join("").toUpperCase()
     .slice(0,2)).
   - Remove X (photo set only): `absolute -top-1 -right-1 w-7 h-7 bg-red-500 rounded-full
     flex items-center justify-center shadow-md hover:bg-red-600 transition-colors` +
     `X w-4 h-4 text-white`; clears photo_url AND resets the file input's value.
   - Camera button: `absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex
     items-center justify-center shadow-md hover:bg-gray-50 transition-colors border-2
     border-blue-500` + `Camera w-4 h-4 text-blue-600`; `disabled` while uploading.
   - Hidden input `accept="image/jpeg,image/png,image/jpg"`; onChange: files[0] →
     `type.startsWith("image/")` else `alert("Please upload an image file (JPG or PNG)")` →
     UploadFile → `{file_url}` → form.photo_url; catch → `console.error` +
     `alert("Failed to upload photo. Please try again.")`; `"Uploading photo..."` hint
     (`text-xs text-gray-500`) while in flight.
   - The Name field INSIDE the avatar section: `placeholder="John Doe"`, the stock Input
     classes + `text-center font-medium`, required, Label "Name *".
   - The AAe title is HARDCODED "Create New Contact" (edit rides W7 — which has NO photo
     section; a photo cannot be changed post-create on the reference — mirrored).
   - The submit passes the whole form incl. photo_url to the create mutation; the form
     resets (photo_url:"") after save. The Scan Card (NAe) prefills AAe via initialData.
2. **The profile-photo flow (aCe)** — LIVE-verified (upload → img in the form avatar; no
   save clicked — cleanup discipline): the "Upload Photo" outline button + hidden input
   `accept="image/*"` + **NO client type validation** (the reference's own inconsistency —
   no alert path) → UploadFile → profile_picture state + toast `Photo uploaded
   successfully` / `Failed to upload photo`; the form avatar (`w-20 h-20 sm:w-24 sm:h-24`)
   and the Account card avatar (`w-20 h-20 mb-4`) render `img.object-cover` over the
   blue-100 User fallback; Save → `updateMe({display_name, profile_picture})` → toast
   `Profile updated successfully` → `window.location.reload()` after 500ms; the TOPBAR
   avatar (`w-8 h-8`, gray-200/initial fallback) renders `img.object-cover.rounded-full`
   once saved.
3. **The Scan Card (NAe) + Import (OAe)**: base44-AI-dependent (ExtractDataFromUploadedFile)
   — the documented local divergence; visual parity holds from s26/s28.
4. **Divergence found in OUR clone**: our Pke slide-over hero renders a photoUrl `<img>` —
   the reference's slide-over hero is INITIAL-ONLY (`w-20 h-20` gradient + first-initial
   span, no img branch). Fix: remove our img branch.

**Schema state:** `Contact.photoUrl` exists (s28). `User` has NO photoUrl — needs the
schema + API + store addition.

## The remediation — S30-P1..P5

- **S30-P1 — the upload seam (our UploadFile mirror):** `POST /api/upload`
  (multipart formData; requireSession; the file must exist, be an image
  (`type.startsWith("image/")`, the reference's own check enforced server-side), and
  ≤ 5MB — the reference's own "Max 5MB" hint; stored at `<repo>/uploads/<32-hex>.<ext>`
  (gitignored, like db/); returns `{file_url: "/api/uploads/<name>"}` in the standard
  envelope) + `GET /api/uploads/[name]` (serves the bytes with the stored content-type;
  public — the reference's file_urls are public CDN links). `.gitignore` += `uploads/`.
- **S30-P2 — the AAe photo section (the pointer):** the ContactDialog photo section
  rewritten to the real round-trip — the img/initials/User render, the remove X, the
  disabled-while-uploading camera, the exact alert strings, the "Uploading photo..."
  hint, the Name placeholder "John Doe" + `text-center font-medium`, the form-state
  photoUrl carried through create + the post-save reset, the input-value reset on remove.
  CONTACT_AVATAR constants re-scoped in page-layout.ts.
- **S30-P3 — the profile-photo flow (aCe):** schema `User.photoUrl String?`;
  /api/users GET/PATCH select + accept photoUrl (the PATCH keeps the name contract,
  adds photoUrl as an optional string|null); the profile page Upload Photo → real upload
  (accept="image/*", NO type alert) + toasts + the img renders on the form avatar, the
  Account card, and the topbar avatar (img over the existing gray-200 fallback) + the
  post-save reload-after-500ms.
- **S30-P4 — the slide-over hero fix:** remove our photoUrl img branch from
  contact-detail-panel.tsx (the reference is initial-only).
- **S30-P5 — tests + docs:** unit suites (upload-api, contact-photo, profile-photo) +
  e2e (the contact photo round-trip: upload → img + remove X → save persists across
  reload; the profile photo round-trip) + the screenshot set + the docs realignment
  (README/AGENTS/CLAUDE/PAD/SKILL v1.27.0/session_53.md + plan addendum + worklogs).

## Validation gates

- RED-first: the new suites must fail against the current code (the s29 TDD doctrine).
- GREEN: lint 0/0 · tsc 0 · unit (697 + new) · build · e2e (104 + new).
- LIVE: the dev-server round-trip — upload a real PNG in the contact dialog (img + remove
  + "Uploading photo..." + the persisted URL across reload), the non-image alert, the
  profile upload + the topbar img, the slide-over initial-only hero.
- The reference state stays clean (no saved test data; uploads without save are form-state
  only).

## Deferred (documented, not this session)

The Opportunity-split question (dead Convert on both sides; an entity-model seam), the
Scan Card / Import AI extraction (base44-only), the reference's saved-views in-memory
model vs our persisted list (documented superset).

---

## EXECUTION RECORD (2026-10-02, post-gate)

Executed as planned with one addition surfaced mid-execution:

- **S30-P1..P5 all landed** as specified (the upload seam, the AAe photo
  section, the profile flow + schema, the slide-over fix, the tests/docs).
- **S30-P6 (NEW — the dialog scroll-cap layer)**: the e2e contact-photo
  test's click hung on "element is outside of the viewport"; the root cause
  was OUR missing `max-h-[90vh] overflow-y-auto` (the reference ships it on
  the contact create, the W7/Mke edit family, Log Activity, Event, and Save
  Custom Report — the Account create is the BARE `max-w-2xl`, a real width
  fix; the Lead create stays the bare `max-w-lg`). Bundle-verified, pinned,
  mirrored.
- Gate: lint 0/0 · tsc 0 · **741/741 unit (+44)** · build · **106/106 e2e
  (+2)**; LIVE-verified on the dev server (the full round-trips on both
  surfaces + persistence + the exact alert + the slide-over negative).
- 37 screenshots (34 re-captured + 3 new, VLM-verified, zero duplicates).
- Docs realigned at SKILL v1.27.0 (§16v + project_state + README/AGENTS/
  CLAUDE/PAD at 741+106 + session_53.md).
- Deferred unchanged: the Opportunity split (the last s51 pointer), the
  Scan Card / Import AI extraction (base44-only).
