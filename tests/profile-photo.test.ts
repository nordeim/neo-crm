import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-30 pins (S30-P3): the PROFILE-PHOTO flow — the reference's
// aCe component (bundle index-DZ-xbrIm.js, LIVE-verified: upload → the
// form avatar renders the img; no save clicked — cleanup discipline).
//
// The decisive contracts:
// - The hidden input accepts image/* (NOT the contact dialog's explicit
//   MIME trio — the reference's own inconsistency) and there is NO
//   client type-validation alert on this surface.
// - Upload → toast "Photo uploaded successfully" / "Failed to upload
//   photo" (toasts, NOT alerts — the contact dialog's alerts are its
//   own inconsistency).
// - The avatar renders the img on the form (w-20 h-20 sm:w-24 sm:h-24)
//   AND the Account card (w-20 h-20 mb-4), over the blue-100 User
//   fallback.
// - Save → PATCH {name, photoUrl} → toast "Profile updated
//   successfully" → window.location.reload() after 500ms.
// - The TOPBAR avatar (w-8 h-8) renders the img over the gray-200
//   initial fallback once set.
// - Schema: User.photoUrl String? — carried through the users GET/PATCH
//   selects and the store's User type.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const page = () => stripComments(read("src/app/(app)/profile/profile-page.tsx") ?? "");
const pageRaw = () => read("src/app/(app)/profile/profile-page.tsx") ?? "";
const topbar = () => stripComments(read("src/components/layout/topbar.tsx") ?? "");
const usersRoute = () => stripComments(read("src/app/api/users/route.ts") ?? "");
const schema = () => read("prisma/schema.prisma") ?? "";
const types = () => read("src/types/index.ts") ?? "";

describe("session-30: the schema + API carry User.photoUrl", () => {
  it("the Prisma User model has photoUrl String?", () => {
    const src = schema();
    const userModel = src.slice(src.indexOf("model User"), src.indexOf("model User") + 700);
    expect(userModel).toMatch(/photoUrl\s+String\?/);
  });

  it("the users GET/PATCH select photoUrl", () => {
    const src = usersRoute();
    expect(src).toMatch(/photoUrl: true/);
  });

  it("the PATCH accepts photoUrl alongside the name", () => {
    const src = usersRoute();
    expect(src).toMatch(/photoUrl/);
    expect(src).toMatch(/name/);
  });

  it("the store's User type carries photoUrl", () => {
    const src = types();
    const userIface = src.slice(src.indexOf("export interface User"), src.indexOf("export interface User") + 400);
    expect(userIface).toMatch(/photoUrl:\s*string \| null/);
  });
});

describe("session-30: the profile upload flow (aCe)", () => {
  it("the hidden input accepts image/* (the reference's inconsistency vs the contact trio)", () => {
    const raw = pageRaw();
    expect(raw).toMatch(/accept="image\/\*"/);
  });

  it("NO client type-validation alert on this surface (the reference has none)", () => {
    const src = page();
    expect(src).not.toMatch(/Please upload an image file/);
    expect(src).not.toMatch(/alert\(/);
  });

  it("uploads to our seam and stores the returned file_url", () => {
    const src = page();
    expect(src).toMatch(/\/api\/upload/);
    expect(src).toMatch(/file_url/);
  });

  it("toasts the reference's exact strings (success + failure)", () => {
    const src = page();
    expect(src).toMatch(/Photo uploaded successfully/);
    expect(src).toMatch(/Failed to upload photo/);
  });

  it("the form avatar renders the img over the blue-100 User fallback", () => {
    const src = page();
    expect(src).toMatch(/<img[^>]*object-cover/);
  });

  it("saves via PATCH with photoUrl and reloads after 500ms", () => {
    const src = page();
    expect(src).toMatch(/photoUrl/);
    expect(src).toMatch(/500/);
    expect(src).toMatch(/location\.reload/);
    expect(src).toMatch(/Profile updated successfully/);
  });
});

describe("session-30: the topbar avatar img branch", () => {
  it("renders the user's photo over the gray-200 initial fallback", () => {
    const src = topbar();
    expect(src).toMatch(/user\.photoUrl/);
    expect(src).toMatch(/<img/);
    expect(src).toMatch(/object-cover/);
  });
});

describe("session-39: the profile save envelope (S39-P3)", () => {
  it("save() is try/catch-wrapped with setSaving in a finally — a network throw cannot strand the busy state", () => {
    const src = pageRaw();
    const start = src.indexOf("async function save()");
    expect(start).toBeGreaterThan(-1);
    // Session-62: the window widened 1400 → 2200 — the s62 record
    // comment above setSaving pushed the finally clause past the old
    // slice edge (the chronic self-shift class; the assertions
    // themselves are unchanged).
    const body = src.slice(start, start + 2200);
    // The sibling uploadPhoto has had this shape since s30; save() was
    // a bare await chain — a network throw mid-save propagated from
    // `void save()` as an unhandled rejection and setSaving(false)
    // never ran (the Save button stayed busy forever, no toast).
    expect(body).toMatch(/try\s*\{/);
    expect(body).toMatch(/\}\s*catch/);
    expect(body).toMatch(/finally\s*\{/);
    expect(body).toMatch(/setSaving\(false\);\s*\}/);
    // The catch surfaces the existing failure vocabulary, not silence.
    expect(body).toMatch(/Failed to update profile/);
  });
});

describe("session-62: the unconditional profile save (N-62b)", () => {
  it("save() mirrors the reference's unconditional PATCH — no dirty gate", () => {
    // Bundle evidence (index-DZ-xbrIm.js, the profile component): the
    // reference's Save button is disabled ONLY while saving
    // (`disabled:i` where i = the saving useState) and its submit
    // handler unconditionally PATCHes {display_name,
    // profile_picture} — NO dirty concept exists there. Our name-only
    // `dirty` gate was a self-inflicted divergence: the button rendered
    // enabled (matching the reference) but `if (!dirty) return;`
    // silently swallowed photo-only uploads (the uploaded file_url
    // landed in form state, Save clicked, nothing happened, navigation
    // lost the upload). The gate retires at s62 — the button's
    // `disabled={saving}` already mirrors the reference exactly.
    const code = page();
    expect(code).not.toMatch(/\bdirty\b/);
    expect(code).not.toMatch(/if\s*\(!dirty\)\s*return;/);
    // The unconditional body still sends BOTH fields, exactly as the
    // reference's updateMe call does.
    expect(code).toMatch(
      /JSON\.stringify\(\{\s*name:\s*name\.trim\(\),\s*photoUrl:\s*photoUrl\s*\|\|\s*null\s*\}\)/,
    );
  });
});
