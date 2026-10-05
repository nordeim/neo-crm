import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-28 pins (S28-P3/P4/P5): the contacts SURFACES — the table row,
// the Pke slide-over, the kke filter panel, the create dialog's h3
// section headers, the stats fix, and the Scan Card rebuild. All
// bundle-extracted with live cross-checks.
//
// The decisive contracts:
// - The ROW is clickable (opens the slide-over), carries the Key-priority
//   amber tint + the ≥30-day opacity-70, the INLINE role select, the
//   3-bar engagement cell, the red/green last-activity icon+ce text, the
//   company+size stack, the raw-source blue badge, and the
//   Call/Email/WhatsApp + ⋮ action family.
// - The SLIDE-OVER (Pke): fixed right-0 w-full md:w-[500px] border-l,
//   the sticky Close header, the hero with the first-initial avatar +
//   badges + engagement bars, the Call/Email/WhatsApp grid, the
//   Contact Information card, and the Activities/Deals/Notes tabs with
//   their empty states.
// - The FILTER PANEL (kke): checkbox CARD groups (not our invented
//   select toolbar) inside the fixed right-0 top-16 bottom-0 w-80
//   lg:static wrapper.
// - The CREATE dialog ships the two h3 section headers
//   ("Contact Details" / "Professional Details") we lacked.
// - "Top Decision Makers" counts role === "Key Contact".

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const page = () => stripComments(read("src/app/(app)/contacts/contacts-page.tsx") ?? "");
const panel = () => stripComments(read("src/components/contacts/contact-detail-panel.tsx") ?? "");
const dialogs = () => stripComments(read("src/components/shared/entity-dialogs.tsx") ?? "");

describe("session-28: the contacts table row contract", () => {
  it("the row is clickable + the Key tint + the ≥30-day opacity", () => {
    const src = page();
    expect(src).toMatch(/cursor-pointer/);
    expect(src).toMatch(/hover:bg-blue-50\/50/);
    expect(src).toMatch(/from-amber-50\/50 to-amber-50\/30/);
    expect(src).toMatch(/border-l-4 border-l-amber-400/);
    expect(src).toMatch(/opacity-70/);
  });

  it("the w-11 h-11 ring-2 ring-blue-100 avatar + the amber Key overlay", () => {
    const src = page();
    expect(src).toMatch(/w-11 h-11/);
    expect(src).toMatch(/ring-2 ring-blue-100/);
    expect(src).toMatch(/w-5 h-5 bg-amber-400/);
  });

  it("the inline role select (h-9 w-[140px], placeholder Set role, immediate update)", () => {
    const src = page();
    expect(src).toMatch(/w-\[140px\]/);
    expect(src).toContain("Set role");
  });

  it("the engagement 3-bar cell (w-2 h-6 rounded-full)", () => {
    const src = page();
    expect(src).toMatch(/w-2 h-6 rounded-full/);
  });

  it("the red/green last-activity icon + ce text", () => {
    const src = page();
    expect(src).toMatch(/text-red-500/);
    expect(src).toMatch(/text-green-500/);
    expect(src).toMatch(/text-red-600/);
  });

  it("the company+size stack (font-semibold text-sm + text-xs mt-0.5)", () => {
    const src = page();
    expect(src).toMatch(/font-semibold text-sm text-gray-900/);
    expect(src).toMatch(/text-xs text-gray-500 mt-0\.5/);
  });

  it("the source outline badge (bg-blue-50 text-blue-700 border-blue-200)", () => {
    const src = page();
    expect(src).toMatch(/bg-blue-50 text-blue-700 border-blue-200/);
  });

  it("the action family: Call/Email/WhatsApp hover tints + the EllipsisVertical menu", () => {
    const src = page();
    expect(src).toMatch(/hover:bg-green-100 hover:text-green-700/);
    expect(src).toMatch(/hover:bg-purple-100 hover:text-purple-700/);
    expect(src).toMatch(/hover:bg-blue-100 hover:text-blue-700/);
    expect(src).toMatch(/EllipsisVertical|MoreVertical/);
    expect(src).toContain("Log Activity");
  });
});

describe("session-28: the Pke contact-detail slide-over", () => {
  it("the panel: fixed top-0 right-0 h-full w-full md:w-[500px] border-l", () => {
    const src = panel();
    expect(src).toMatch(/fixed top-0 right-0 h-full w-full md:w-\[500px\]/);
    expect(src).toMatch(/border-l/);
    expect(src).toMatch(/shadow-2xl/);
  });

  it("the sticky header: Contact Details + the ghost close", () => {
    const src = panel();
    expect(src).toMatch(/sticky top-0/);
    expect(src).toContain("Contact Details");
  });

  it("the hero: w-20 h-20 gradient avatar + first initial + No position fallback", () => {
    const src = panel();
    expect(src).toMatch(/w-20 h-20/);
    expect(src).toMatch(/from-blue-500 to-blue-700/);
    expect(src).toContain("No position");
  });

  it("the engagement 3-bar indicator (the -600 solids via ENGAGEMENT_BARS_SOLID)", () => {
    const src = panel();
    expect(src).toMatch(/ENGAGEMENT_BARS_SOLID/);
    expect(src).toContain("Engagement:");
  });

  it("the Call/Email/WhatsApp grid-cols-3 actions", () => {
    const src = panel();
    expect(src).toMatch(/grid grid-cols-3 gap-2/);
    expect(src).toContain("WhatsApp");
  });

  it("the Contact Information card with the icon rows + MMM D, YYYY", () => {
    const src = panel();
    expect(src).toContain("Contact Information");
    expect(src).toContain("Last Activity");
  });

  it("the Activities/Deals/Notes tabs + the three empty states", () => {
    const src = panel();
    expect(src).toContain("No activities yet");
    expect(src).toContain("No deals found");
    expect(src).toContain("No notes yet");
  });
});

describe("session-28: the kke filter panel", () => {
  it("the wrapper: fixed right-0 top-16 bottom-0 w-80 lg:static lg:shadow-none", () => {
    const src = page();
    expect(src).toMatch(/fixed right-0 top-16 bottom-0 w-80/);
    expect(src).toMatch(/lg:static lg:shadow-none/);
  });

  it("the checkbox-card groups: Role / Priority / Activity Status / Company Size / Source", () => {
    // The vocabulary lists ride the constants (CONTACT_ROLES / COMPANY_SIZES /
    // CONTACT_SOURCE_OPTIONS — pinned in contact-model.test.ts); the page
    // pins are the group STRUCTURE + the literals the reference renders
    // inline (the 30-day line + Clear All).
    const src = page();
    expect(src).toContain("No Recent Activity (30+ days)");
    expect(src).toMatch(/CONTACT_ROLES\.map/);
    expect(src).toMatch(/COMPANY_SIZES\.map/);
    expect(src).toMatch(/CONTACT_SOURCE_OPTIONS\.map/);
    expect(src).toContain("Clear All");
  });
});

describe("session-28: the create dialog h3 headers + the stats fix + Scan Card", () => {
  it("the two h3 section headers (uppercase tracking-wide)", () => {
    const src = dialogs();
    expect(src).toContain("Contact Details");
    expect(src).toContain("Professional Details");
    expect(src).toMatch(/text-sm font-semibold text-gray-700 uppercase tracking-wide/);
  });

  it("Top Decision Makers counts role === Key Contact", () => {
    const src = page();
    const i = src.indexOf("Top Decision Makers");
    // The value prop follows the label in the JSX — anchor AFTER it.
    const block = src.slice(i, i + 260);
    expect(block).toMatch(/role === "Key Contact"|role==="Key Contact"/);
  });

  it("the Scan Card dialog is the real upload structure (not the camera stub)", () => {
    // NOTE: the RAW source — the stripComments helper eats everything after
    // the `accept="image/*"` string (the `/*` opens a comment to the next
    // `*/`); the raw read is the strip-safe anchor (the s27 comment-anchor
    // lesson, the block-comment variant).
    const src = read("src/app/(app)/contacts/contacts-page.tsx") ?? "";
    expect(src).toContain("Upload a photo or image of the business card");
    expect(src).not.toContain("Camera not available");
    expect(src).toMatch(/Selected:/);
  });
});
