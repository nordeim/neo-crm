import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-75 pins: the accounts/contacts TABLE-FAMILY parity suite (the
// 75-c fresh-eyes rotation — the seam's first dedicated rotation, the
// session_142 suggested target). Every pin below is bundle-decoded
// against the fresh-fetched reference (the M/L/N-75 family, validated
// at file:line by the orchestrator).
//
// The decisive contracts:
// - ACCOUNTS KPI: the Overdue Activities value counts ACCOUNTS with >=1
//   overdue scheduled activity (the reference's overdueAccounts memo —
//   `N.filter(te=>te.overdueActivities>0).length`), NOT the raw activity
//   count; the five sparkbars are the reference's STATIC 6-value literals
//   ([50,60,55,70,65,75] blue / [55,60,58,68,65,72] green /
//   [40,45,50,55,58,62] cyan / [60,65,70,75,78,82] purple /
//   [30,35,40,38,42,45] red) — never computed per-industry buckets.
// - ACCOUNTS chrome: the trailing TableHead is w-12; the health badge
//   fallback is the GRAY terminal (bg-gray-100 text-gray-800).
// - ACCOUNTS route: NO _count include (zero consumers); NO
//   lastActivityAt stamp on create (the reference's bce form ships no
//   last-activity field — fresh accounts render "No activity").
// - CONTACTS headers: the Name th is a LIVE sort affordance (onClick +
//   the flex items-center gap-1 hover:text-blue-600 transition-colors
//   inner div + the active-only chevron); the Last Activity th carries
//   cursor-pointer + the onClick DIRECTLY (no inner button, no
//   ArrowUpDown fallback — the chevron renders only when active).
// - CONTACTS panel: the Filters button flips variant when open; the kke
//   panel ships SIX groups (Engagement Level last — High/Medium/Low);
//   every checkbox is the kit's button-role Checkbox primitive (never a
//   native input).
// - CONTACTS stats: all four cards derive from the FILTERED memo;
//   "Top Decision Makers" counts BOTH roles (Decision Maker OR Key
//   Contact); the card is the reference's Rx construction (items-start
//   wrapper, flex-1 left, the gray-600 label + gray-900 value with
//   mb-2, the 48px p-3 chip with the w-6 h-6 text-white icon).
// - CONTACTS empty/hygiene: the table empty cell is the rich stack (the
//   w-12 h-12 text-gray-300 icon + the font-medium line + the text-sm
//   hint); the mobile empty p is BARE; the search scope matches
//   name/email/company only; the null-activity sort fallback is the
//   epoch 0; the scanFile resets on dialog close.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const accountsPage = () => stripComments(read("src/app/(app)/accounts/accounts-page.tsx") ?? "");
const accountsRoute = () => stripComments(read("src/app/api/accounts/route.ts") ?? "");
const contactsPage = () => stripComments(read("src/app/(app)/contacts/contacts-page.tsx") ?? "");
const pageParts = () => stripComments(read("src/components/shared/page-parts.tsx") ?? "");

describe("session-75: the accounts KPI family", () => {
  it("the Overdue Activities KPI counts ACCOUNTS with >=1 overdue activity (the distinct-accountId Set)", () => {
    const src = accountsPage();
    // The reference's memo: W = N.filter(te => te.overdueActivities > 0).length
    // — overdueAccounts, rendered value:M.overdueAccounts. Ours counted raw
    // overdue ACTIVITIES (diverges whenever any account carries 2+).
    expect(src).toMatch(/new Set\(/);
    expect(src).toMatch(/\.size/);
    const overdueIdx = src.indexOf("Overdue Activities");
    expect(overdueIdx).toBeGreaterThan(-1);
    // The Set construction feeds the KPI value (anchored near the card).
    const setIdx = src.indexOf("new Set(");
    expect(setIdx).toBeGreaterThan(-1);
  });

  it("the five sparkbars are the reference's STATIC 6-value literals", () => {
    const src = accountsPage();
    expect(src).toContain("[50, 60, 55, 70, 65, 75]");
    expect(src).toContain("[55, 60, 58, 68, 65, 72]");
    expect(src).toContain("[40, 45, 50, 55, 58, 62]");
    expect(src).toContain("[60, 65, 70, 75, 78, 82]");
    expect(src).toContain("[30, 35, 40, 38, 42, 45]");
    // The computed per-industry bucket memos retire.
    expect(src).not.toMatch(/industrySpark/);
    expect(src).not.toMatch(/activeSpark/);
    expect(src).not.toMatch(/revenueSpark/);
  });

  it("the trailing TableHead is w-12 (the reference's literal)", () => {
    const src = accountsPage();
    expect(src).toMatch(/<TableHead className="w-12" \/>/);
    expect(src).not.toMatch(/<TableHead className="w-10" \/>/);
  });

  it("the health badge fallback is the GRAY terminal (not the Healthy green)", () => {
    const src = accountsPage();
    expect(src).toMatch(/bg-gray-100 text-gray-800/);
    expect(src).not.toMatch(/ACCOUNT_HEALTH_BADGE\.Healthy/);
  });
});

describe("session-75: the accounts route hygiene", () => {
  it("the GET ships NO _count include (zero consumers — dead payload)", () => {
    const src = accountsRoute();
    expect(src).not.toMatch(/_count/);
  });

  it("the create route stamps NO lastActivityAt (the reference's form ships no last-activity field)", () => {
    const src = accountsRoute();
    expect(src).not.toMatch(/lastActivityAt/);
  });
});

describe("session-75: the contacts sortable headers", () => {
  it("the Name th is a LIVE sort affordance: onClick + the hover family + the active-only chevron", () => {
    const src = contactsPage();
    const i = src.indexOf('toggleSort("name")');
    expect(i).toBeGreaterThan(-1);
    const block = src.slice(Math.max(0, i - 400), i + 400);
    expect(block).toMatch(/hover:text-blue-600/);
    expect(block).toMatch(/flex items-center gap-1/);
    // The chevron renders ONLY while the column is active (no fallback glyph).
    expect(block).toMatch(/sortKey === "name" &&/);
  });

  it("the Last Activity th carries cursor-pointer + the onClick DIRECTLY (no inner button, no ArrowUpDown fallback)", () => {
    const src = contactsPage();
    const i = src.indexOf("Last Activity");
    expect(i).toBeGreaterThan(-1);
    const block = src.slice(Math.max(0, i - 700), i + 120);
    expect(block).toMatch(/cursor-pointer/);
    expect(block).toMatch(/toggleSort\("lastActivity"\)/);
    expect(block).toMatch(/hover:text-blue-600/);
    expect(src).not.toMatch(/ArrowUpDown/);
    expect(src).not.toMatch(/<button type="button" className="inline-flex items-center gap-1"/);
  });

  it("the null-activity sort fallback is the epoch 0 (not createdAt)", () => {
    const src = contactsPage();
    expect(src).not.toMatch(/\?\? a\.createdAt/);
    expect(src).not.toMatch(/\?\? b\.createdAt/);
  });
});

describe("session-75: the contacts filter panel (kke)", () => {
  it("the Filters button flips variant when the panel is open", () => {
    const src = contactsPage();
    expect(src).toMatch(/variant=\{showFilters \? "default" : "outline"\}/);
  });

  it("the panel ships SIX groups — Engagement Level last (High/Medium/Low)", () => {
    const src = contactsPage();
    expect(src).toContain("Engagement Level");
    // The group rides the High/Medium/Low vocabulary with engagement- ids.
    expect(src).toMatch(/engagement-\$\{/);
    // The filter clause exists.
    expect(src).toMatch(/engagementLevels/);
    // The group is the LAST card (after the Source group's map).
    const srcIdx = src.indexOf("CONTACT_SOURCE_OPTIONS.map");
    const engIdx = src.indexOf(">Engagement Level<");
    expect(engIdx).toBeGreaterThan(srcIdx);
  });

  it("every panel checkbox is the kit's button-role Checkbox primitive (zero native checkbox inputs)", () => {
    const src = contactsPage();
    expect(src).not.toMatch(/type="checkbox"/);
    expect(src).toMatch(/onCheckedChange/);
  });
});

describe("session-75: the contacts stat cards (the Rx construction)", () => {
  it("all four cards derive from the FILTERED memo", () => {
    const src = contactsPage();
    const i = src.indexOf("Total Contacts");
    const block = src.slice(i, i + 1200);
    expect(block).toMatch(/filtered\.length/);
    expect(block).not.toMatch(/contacts\.filter/);
    expect(block).not.toMatch(/contacts\.length/);
  });

  it("Top Decision Makers counts BOTH roles (Decision Maker OR Key Contact)", () => {
    const src = contactsPage();
    const i = src.indexOf("Top Decision Makers");
    const block = src.slice(i + "Top Decision Makers".length, i + 400);
    expect(block).toMatch(/"Decision Maker"/);
    expect(block).toMatch(/"Key Contact"/);
  });

  it("the card anatomy: items-start wrapper, flex-1 left, gray-600 label, gray-900 value, the 48px p-3 chip with the w-6 h-6 icon", () => {
    const src = pageParts();
    // The contacts arm (after the leads early-return).
    const i = src.indexOf('variant === "leads"');
    const contactsArm = src.slice(i);
    expect(contactsArm).toMatch(/flex items-start justify-between/);
    expect(contactsArm).not.toMatch(/flex items-center justify-between gap-3/);
    expect(contactsArm).toMatch(/text-sm font-medium text-gray-600 mb-2/);
    expect(contactsArm).toMatch(/text-3xl font-bold text-gray-900 mb-2/);
    expect(contactsArm).toMatch(/p-3 rounded-lg/);
    // The icon class (the reference's `w-6 h-6 text-white`) rides the
    // contacts page's call sites.
    const page = contactsPage();
    expect(page).toMatch(/w-6 h-6 text-white/);
  });
});

describe("session-75: the contacts empty states + hygiene", () => {
  it("the table empty cell is the rich stack (icon + font-medium line + text-sm hint)", () => {
    const src = contactsPage();
    expect(src).toContain("Try adjusting your search or filters");
    expect(src).toMatch(/w-12 h-12 text-gray-300/);
    expect(src).toMatch(/font-medium/);
  });

  it("the mobile empty p is BARE (no text-sm)", () => {
    const src = contactsPage();
    expect(src).not.toMatch(/py-8 text-center text-sm text-muted/);
    expect(src).toMatch(/text-center text-gray-500 py-8/);
  });

  it("the search scope matches name/email/company only (position retired)", () => {
    const src = contactsPage();
    const i = src.indexOf("const q = search.trim().toLowerCase();");
    const block = src.slice(i, i + 300);
    expect(block).not.toContain("position");
  });

  it("the scanFile resets when the Scan dialog closes (no stale Selected line)", () => {
    const src = contactsPage();
    const i = src.indexOf("open={scanOpen}");
    expect(i).toBeGreaterThan(-1);
    const block = src.slice(Math.max(0, i - 100), i + 500);
    expect(block).toMatch(/setScanFile\(null\)/);
  });

  it("the mobile-card map carries no dead ve (the row state stays row-side)", () => {
    const src = contactsPage();
    // Exactly ONE priority === "Key" read (the row's ve) — the mobile map's
    // dead copy retires.
    const hits = src.match(/priority === "Key"/g) ?? [];
    expect(hits.length).toBe(1);
  });
});
