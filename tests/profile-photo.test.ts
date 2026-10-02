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
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
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
