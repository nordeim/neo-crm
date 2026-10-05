import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-26 pins (S26-P6): the Import Contacts dialog, byte-extracted from
// the reference's live DOM + minified bundle:
//
//   DialogContent sm:max-w-md
//   header: "Import Contacts" / "Upload a CSV or Excel file with contact
//     information"
//   body: div.space-y-4 py-4 →
//     result box (f): flex items-center gap-3 p-4 rounded-lg, success
//       bg-green-50 border-green-200 + w-6 h-6 text-green-600 + text-sm
//       font-medium text-green-900 {message}; failure bg-red-50
//       border-red-200 + text-red-600/-900
//     OR the form: div.space-y-2 [Label "Select File",
//       div.flex.flex-col.gap-3 [dropzone, chosen-file box]] + columns box
//   dropzone label: flex flex-col items-center justify-center w-full h-32
//     border-2 border-dashed border-gray-300 rounded-lg cursor-pointer
//     hover:border-blue-500 hover:bg-blue-50/50 transition-all; inner div
//     flex flex-col items-center justify-center gap-2; icon w-8 h-8
//     text-gray-400; p text-sm text-gray-600 {n ? n.name : "Click to
//     upload CSV or Excel"}; p text-xs text-gray-400 "CSV, XLS, XLSX";
//     input accept=".csv,.xls,.xlsx" hidden
//   chosen-file box: flex items-center gap-2 p-2 bg-blue-50 rounded
//     border-blue-200 + icon w-4 h-4 text-blue-600 + span text-sm
//     text-blue-900 flex-1 {n.name}
//   columns box: bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1
//     ["Required columns:" (font-semibold) + ul list-disc list-inside
//     space-y-0.5 ml-2 [name, email]; "Optional columns:" (font-semibold
//     mt-2) + ul [phone, company, position, source]]
//   footer: Cancel/Close (outline; the label flips to "Close" after a
//     success) + Import (only pre-result; disabled until a file; the
//     uploading/processing labels)
//
// Our clone shipped an invented "Download the CSV template" link (the
// reference ships NO link), the wrong description, no chosen-file box, no
// columns box, and no footer buttons.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

describe("session-26: the Import Contacts dialog copy (S26-P6)", () => {
  it("the description is the reference's", () => {
    const code = stripComments(read("src/app/(app)/contacts/contacts-page.tsx")!);
    expect(code).toContain("Upload a CSV or Excel file with contact information");
    expect(code).not.toContain("Upload a CSV with the columns:");
  });

  it("the invented template link is retired", () => {
    const code = stripComments(read("src/app/(app)/contacts/contacts-page.tsx")!);
    expect(code).not.toContain("Download the CSV template");
    expect(code).not.toContain('download="contacts-template.csv"');
  });

  it("the dropzone copy + accept list match the reference", () => {
    const code = stripComments(read("src/app/(app)/contacts/contacts-page.tsx")!);
    expect(code).toContain("Select File");
    expect(code).toContain("Click to upload CSV or Excel");
    expect(code).toContain("CSV, XLS, XLSX");
    expect(code).toContain('accept=".csv,.xls,.xlsx"');
    expect(code).not.toContain("Choose a CSV file");
    expect(code).not.toContain("Click to browse");
  });
});

describe("session-26: the Import Contacts dialog structure (S26-P6)", () => {
  it("the dropzone carries the reference's class family", () => {
    const code = stripComments(read("src/app/(app)/contacts/contacts-page.tsx")!);
    expect(code).toContain("border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all");
    expect(code).toContain("w-full h-32");
    expect(code).toContain("w-8 h-8 text-gray-400");
    expect(code).toContain("text-sm text-gray-600");
    expect(code).toContain("text-xs text-gray-400");
  });

  it("the chosen-file box carries the blue info family", () => {
    const code = stripComments(read("src/app/(app)/contacts/contacts-page.tsx")!);
    expect(code).toContain("p-2 bg-blue-50 rounded border border-blue-200");
    expect(code).toContain("w-4 h-4 text-blue-600");
    expect(code).toContain("text-sm text-blue-900 flex-1");
  });

  it("the Required/Optional columns box matches the reference", () => {
    const code = stripComments(read("src/app/(app)/contacts/contacts-page.tsx")!);
    expect(code).toContain("bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1");
    expect(code).toContain(">Required columns:<");
    expect(code).toContain(">Optional columns:<");
    expect(code).toContain("list-disc list-inside space-y-0.5 ml-2");
    expect(code).toContain("<li>name</li>");
    expect(code).toContain("<li>email</li>");
    expect(code).toContain("<li>phone, company, position, source</li>");
  });

  it("the body wrapper is space-y-4 py-4", () => {
    const code = stripComments(read("src/app/(app)/contacts/contacts-page.tsx")!);
    const i = code.indexOf("Import Contacts");
    const region = code.slice(Math.max(0, i - 100), i + 1200);
    expect(region).toContain("space-y-4 py-4");
  });

  it("the footer ships Cancel/Close + Import with the reference's gating", () => {
    const code = stripComments(read("src/app/(app)/contacts/contacts-page.tsx")!);
    const i = code.indexOf("Import Contacts");
    const region = code.slice(i, i + 4200);
    expect(region).toContain('"Close"');
    expect(region).toContain('"Cancel"');
    expect(region).toContain('"Import"');
    expect(region).toContain('"Processing..."');
    expect(region).toMatch(/disabled=\{!importFile \|\| importBusy\}/);
  });

  it("the result box carries the green/red family", () => {
    const code = stripComments(read("src/app/(app)/contacts/contacts-page.tsx")!);
    expect(code).toContain("bg-green-50 border border-green-200");
    expect(code).toContain("bg-red-50 border border-red-200");
    expect(code).toContain("text-green-900");
    expect(code).toContain("text-red-900");
  });
});
