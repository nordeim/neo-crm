import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  LEAD_INLINE_STATUS_OPTIONS,
  LEAD_SOURCE_OPTIONS,
} from "@/lib/constants";

// Session-29 pins (S29-P2/P3/P4): the leads INTERACTIVE table layer —
// bundle-extracted (the C2 pointer) with live cross-checks on the
// popover (the "(Active)" suffix, the native Save View prompt, and the
// Saved Views select were all LIVE-exercised on the reference).
//
// The decisive contracts:
// - The ROW: the orange Target name box, text-sm cells with "-"
//   fallbacks, the INLINE Value number input / Status select (the
//   FIVE-status set) / Next Follow-up date input with the overdue red
//   border + CircleAlert, the raw-source outline badge, and the ⋮
//   Edit / Convert-to-Opportunity (DEAD) / Delete menu. Explicit
//   hover:bg-gray-50; NO row click (unlike contacts/accounts).
// - The thead is STICKY (live-confirmed) with the w-12 actions header.
// - The Gke popover: raw-value selects + the All items, "(Active)",
//   prompt-based Save View + the saved-views select.
// - The SOURCE vocabulary migrates to RAW values end-to-end (the s28
//   contact precedent): constants, create dialog, seed, dashboard.

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

const page = () => stripComments(read("src/app/(app)/leads/leads-page.tsx") ?? "");
const store = () => stripComments(read("src/stores/crm-store.ts") ?? "");
const dialogs = () => stripComments(read("src/components/shared/entity-dialogs.tsx") ?? "");
const seed = () => read("prisma/seed.ts") ?? "";

describe("session-29: the leads row — the orange Target name box", () => {
  it("the w-10 h-10 bg-orange-100 rounded-lg box with the Target glyph", () => {
    const src = page();
    expect(src).toMatch(/w-10 h-10 bg-orange-100 rounded-lg/);
    expect(src).toMatch(/text-orange-600/);
    expect(src).toMatch(/flex items-center gap-3/);
    expect(src).toMatch(/<Target/);
  });

  it("the name renders as a font-medium paragraph (not the old plain cell)", () => {
    const src = page();
    expect(src).toMatch(/font-medium/);
    expect(src).not.toMatch(/font-medium text-foreground">\{l\.name\}/);
  });
});

describe("session-29: the text cells — text-sm + the '-' fallback", () => {
  it("the email/phone/company cells use the single-hyphen fallback", () => {
    const src = page();
    expect(src).toMatch(/\|\| "-"/);
    expect(src).not.toMatch(/\?\? "—"/);
    expect(src).not.toMatch(/\|\| "—"/);
  });
});

describe("session-29: the INLINE Value input (the C2 core)", () => {
  it("the w-24 h-8 number input with the $0 placeholder", () => {
    const src = page();
    expect(src).toMatch(/type="number"/);
    expect(src).toMatch(/w-24 h-8/);
    expect(src).toMatch(/placeholder="\$0"/);
  });

  it("the onChange parses parseFloat || 0 and mutates immediately", () => {
    const src = page();
    expect(src).toMatch(/parseFloat\(e\.target\.value\) \|\| 0/);
    expect(src).toMatch(/updateLead\(l\.id, \{\s*value:/);
  });
});

describe("session-29: the INLINE Status select (the C2 core)", () => {
  it("ships EXACTLY the five raw options (the table's 5-status set)", () => {
    expect(LEAD_INLINE_STATUS_OPTIONS).toHaveLength(5);
    expect(LEAD_INLINE_STATUS_OPTIONS.map((o) => o.value)).toEqual([
      "new",
      "contacted",
      "qualified",
      "won",
      "lost",
    ]);
    expect(LEAD_INLINE_STATUS_OPTIONS.map((o) => o.label)).toEqual([
      "New",
      "Contacted",
      "Qualified",
      "Won",
      "Lost",
    ]);
  });

  it("the w-32 h-8 trigger mutates the stage immediately, no placeholder", () => {
    const src = page();
    expect(src).toMatch(/w-32 h-8/);
    expect(src).toMatch(/updateLead\(l\.id, \{\s*stage:/);
    // The reference's inline select has NO placeholder (a blank trigger
    // for unmatched stages — Radix's unmatched-value behavior).
    const rowSelect = src.match(/SelectTrigger className="w-32 h-8"[\s\S]{0,200}/)?.[0] ?? "";
    expect(rowSelect).not.toMatch(/placeholder=/);
  });
});

describe("session-29: the Source badge cell", () => {
  it("the raw source renders as an outline text-xs badge, '-' when absent", () => {
    const src = page();
    expect(src).toMatch(/variant="outline"/);
    expect(src).toMatch(/text-xs/);
    expect(src).toMatch(/l\.source \?/);
  });
});

describe("session-29: the INLINE Next Follow-up date (the C2 core)", () => {
  it("the w-36 h-8 date input + the overdue border-red-500", () => {
    const src = page();
    expect(src).toMatch(/type="date"/);
    expect(src).toMatch(/w-36 h-8/);
    expect(src).toMatch(/border-red-500/);
  });

  it("the overdue CircleAlert rides beside the input", () => {
    const src = page();
    expect(src).toMatch(/<CircleAlert/);
    expect(src).toMatch(/text-red-500 flex-shrink-0/);
    expect(src).toMatch(/isOverdueFollowUp/);
  });
});

describe("session-29: the actions menu", () => {
  it("the EllipsisVertical trigger (not MoreHorizontal)", () => {
    const src = page();
    expect(src).toMatch(/<EllipsisVertical/);
    expect(src).not.toMatch(/<MoreHorizontal/);
  });

  it("Edit / Convert to Opportunity / Delete — Convert is DEAD (no onClick)", () => {
    const src = page();
    // The reference's own quirk: the item carries NO handler prop at all
    // (bundle-verified) — pinned as the exact bare element.
    expect(src).toMatch(/<DropdownItem>Convert to Opportunity<\/DropdownItem>/);
    expect(src).toMatch(/Delete/);
  });

  it("the trigger keeps its accessible label", () => {
    const src = page();
    expect(src).toMatch(/Actions for /);
  });
});

describe("session-29: the row + thead chrome", () => {
  it("the explicit hover:bg-gray-50 row, NOT clickable", () => {
    const src = page();
    // The row's COMPLETE opening tag carries the explicit gray-50 hover
    // and NO cursor-pointer / onClick (unlike the contacts/accounts rows
    // — the leads row is inert; the actions DropdownItems inside the
    // cells are separate surfaces).
    expect(src).toMatch(/<TableRow key=\{l\.id\} className="hover:bg-gray-50">/);
  });

  it("the sticky thead (live-confirmed on the reference)", () => {
    const src = page();
    expect(src).toMatch(/sticky top-0 bg-white z-10/);
  });

  it("the actions header is w-12", () => {
    const src = page();
    expect(src).toMatch(/w-12/);
    expect(src).not.toMatch(/className="w-10"/);
  });

  it("the sortable headers wrap label + ArrowUpDown at gap-2", () => {
    const src = page();
    expect(src).toMatch(/items-center gap-2/);
    expect(src).toMatch(/<ArrowUpDown/);
  });
});

describe("session-29: the store's optimistic updateLead", () => {
  it("applies the patch to the leads slice BEFORE the await", () => {
    const src = store();
    const fn = src.slice(src.indexOf("updateLead: async"), src.indexOf("updateLead: async") + 700);
    expect(fn).toMatch(/set\(\{/);
    // The local apply precedes the network call.
    expect(fn.indexOf("set({")).toBeLessThan(fn.indexOf("await call"));
  });
});

describe("session-29: the Gke popover (the s8 pin re-scoped, live-verified)", () => {
  it("the Status/Source selects carry the All items + raw values", () => {
    const src = page();
    expect(src).toMatch(/"All Status"/);
    expect(src).toMatch(/"All Sources"/);
    expect(src).toMatch(/LEAD_FILTER_STATUS_OPTIONS/);
    expect(src).toMatch(/LEAD_FILTER_SOURCE_OPTIONS/);
  });

  it("the trigger gains the (Active) suffix via filtersActive", () => {
    const src = page();
    expect(src).toMatch(/filtersActive/);
    expect(src).toMatch(/\(Active\)/);
  });

  it("Save View fires the native prompt (not a toast)", () => {
    const src = page();
    expect(src).toMatch(/window\.prompt\("Enter view name:"\)/);
    expect(src).not.toMatch(/View saved/);
  });

  it("the saved-views select applies a view's filters on selection", () => {
    const src = page();
    expect(src).toMatch(/Saved Views/);
    expect(src).toMatch(/applySavedView|savedViews/);
    expect(src).toMatch(/LEADS_FILTERS_POPOVER\.savedViewsSelect/);
    // The w-full sm:w-48 geometry lives in the page-layout contract.
    const layout = stripComments(read("src/lib/page-layout.ts") ?? "");
    expect(layout).toMatch(/savedViewsSelect: "w-full sm:w-48"/);
  });
});

describe("session-29: the RAW source vocabulary migration", () => {
  it("LEAD_SOURCE_OPTIONS are the raw value/label pairs", () => {
    expect(LEAD_SOURCE_OPTIONS.map((o) => o.value)).toEqual([
      "call",
      "email",
      "website",
      "partner",
    ]);
    expect(LEAD_SOURCE_OPTIONS.map((o) => o.label)).toEqual([
      "Call",
      "Email",
      "Website",
      "Partner",
    ]);
  });

  it("the create dialog defaults to the raw email source", () => {
    const src = stripComments(dialogs());
    const leadForm = src.slice(src.indexOf("LeadDialog"), src.indexOf("LeadDialog") + 4000);
    expect(leadForm).toMatch(/source: lead\?\.source \?\? "email"/);
  });

  it("the seed maps the legacy vocabulary onto the RAW values", () => {
    const src = seed();
    expect(src).toMatch(/Referral: "referral"/);
    expect(src).toMatch(/Phone: "call"/);
    expect(src).toMatch(/"Cold Call": "call"/);
    expect(src).toMatch(/Event: "partner"|Event: "referral"/);
    // No capitalized targets remain in the map.
    const mapBlock = src.slice(src.indexOf("LEAD_SOURCE_MAP"), src.indexOf("LEAD_SOURCE_MAP") + 500);
    expect(mapBlock).not.toMatch(/: "(Call|Email|Website|Partner|Referral)"/);
  });
});
