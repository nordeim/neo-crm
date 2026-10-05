import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-26 pins (S26-P1): the Settings Data tab's three CardDescription
// lines + the per-index button margins, byte-extracted from the reference's
// live DOM (getClientRects-verified DIVs, computed marginLeft 8px on every
// 2nd+ button) and its minified bundle (the `my` CardDescription calls).
//
//   Import Templates  → "Download CSV templates for bulk imports" (text-sm
//                        text-muted-foreground #737373 = our muted-ink token)
//   Export Data       → "Export your CRM data to CSV"          (same)
//   Danger Zone       → "Permanently delete all CRM data. This cannot be
//                        undone."                               (text-red-600)
//
// The s14 pin recorded the Data tab's card chrome but never the header
// subtitles — the same class-of-pin blind spot as s24's dead More... button.
// The button rows: the reference's FIRST button is `w-full sm:w-auto` and
// every 2nd+ button adds `ml-0 sm:ml-2` (live-computed marginLeft: 8px at
// 1280px on buttons 2-3 of the template row and 2-4 of the export row).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

describe("session-26: the Data tab CardDescription lines (S26-P1)", () => {
  it("SETTINGS_DATA carries the description class pin (the reference's text-sm text-muted-foreground #737373)", () => {
    const layout = read("src/lib/page-layout.ts")!;
    const block = layout.slice(layout.indexOf("SETTINGS_DATA = {"), layout.indexOf("SETTINGS_DATA = {") + 1400);
    expect(block).toMatch(/desc:\s*"text-sm text-muted-ink"/);
  });

  it("SETTINGS_DANGER carries the red description pin", () => {
    const layout = read("src/lib/page-layout.ts")!;
    const block = layout.slice(layout.indexOf("SETTINGS_DANGER = {"), layout.indexOf("SETTINGS_DANGER = {") + 1400);
    expect(block).toMatch(/desc:\s*"text-red-600"/);
  });

  it("the settings page ships the Import Templates description", () => {
    const code = stripComments(read("src/app/(app)/settings/settings-page.tsx")!);
    expect(code).toMatch(/Download CSV templates for bulk imports/);
  });

  it("the settings page ships the Export Data description", () => {
    const code = stripComments(read("src/app/(app)/settings/settings-page.tsx")!);
    expect(code).toMatch(/Export your CRM data to CSV/);
  });

  it("the settings page ships the Danger Zone description", () => {
    const code = stripComments(read("src/app/(app)/settings/settings-page.tsx")!);
    expect(code).toMatch(/Permanently delete all CRM data\. This cannot be undone\./);
  });

  it("all three descriptions are DIVs inside the card headers (the reference's CardDescription construction)", () => {
    const code = stripComments(read("src/app/(app)/settings/settings-page.tsx")!);
    for (const text of [
      "Download CSV templates for bulk imports",
      "Export your CRM data to CSV",
      "Permanently delete all CRM data. This cannot be undone.",
    ]) {
      const i = code.indexOf(text);
      expect(i).toBeGreaterThan(-1);
      // Walk back to the opening tag of the element carrying the text.
      const before = code.slice(Math.max(0, i - 160), i);
      expect(before).toMatch(/<[A-Za-z]+[^>]*>\s*$/);
      expect(before).toMatch(/<(div|p)\b/);
    }
  });
});

describe("session-26: the per-index button margins (S26-P1)", () => {
  it("SETTINGS_DATA carries the buttonClsAlt pin (ml-0 sm:ml-2 for every 2nd+ button)", () => {
    const layout = read("src/lib/page-layout.ts")!;
    const block = layout.slice(layout.indexOf("SETTINGS_DATA = {"), layout.indexOf("SETTINGS_DATA = {") + 700);
    expect(block).toMatch(/buttonClsAlt:\s*"w-full sm:w-auto ml-0 sm:ml-2"/);
  });

  it("the template row's 2nd+ buttons carry buttonClsAlt", () => {
    const code = stripComments(read("src/app/(app)/settings/settings-page.tsx")!);
    const first = code.indexOf("Download Contacts Template");
    const tplBlock = code.slice(
      Math.max(0, first - 350),
      code.indexOf("Download Leads Template") + 160,
    );
    // First button keeps the plain class; the 2nd/3rd get the alt.
    expect(tplBlock).toMatch(/className=\{SETTINGS_DATA\.buttonCls\}/);
    expect(tplBlock).toMatch(/className=\{SETTINGS_DATA\.buttonClsAlt\}/);
    const altUses = tplBlock.match(/SETTINGS_DATA\.buttonClsAlt/g) ?? [];
    expect(altUses.length).toBe(2);
  });

  it("the export row's 2nd+ buttons carry buttonClsAlt", () => {
    const code = stripComments(read("src/app/(app)/settings/settings-page.tsx")!);
    const expBlock = code.slice(
      code.indexOf("Export Contacts"),
      code.indexOf("Export Activities") + 120,
    );
    const altUses = expBlock.match(/SETTINGS_DATA\.buttonClsAlt/g) ?? [];
    expect(altUses.length).toBe(3);
  });
});

describe("session-26: the destructive button's trash icon (S26-P2 chrome)", () => {
  it("the Reset All Data button carries the Trash2 icon at h-4 w-4", () => {
    const code = stripComments(read("src/app/(app)/settings/settings-page.tsx")!);
    const i = code.indexOf("Reset All Data");
    expect(i).toBeGreaterThan(-1);
    const block = code.slice(Math.max(0, i - 400), i + 60);
    expect(block).toMatch(/Trash2\s+className="h-4 w-4"/);
  });
});
