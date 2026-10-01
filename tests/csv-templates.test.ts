import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-26 pins (S26-P3): the "Download X Template" contract. The
// reference's `b(key)` (bundle-extracted): a three-entry STATIC map →
// `new Blob([_], {type:"text/csv"})` → anchor
// `download=\`${key}_template.csv\``. The template strings captured live
// via the Blob-constructor spy on 2026-10-02 (real \n newlines):
//
//   contacts: name,email,phone,company,position,source
//             John Doe,john@example.com,+1234567890,Acme Inc,Sales Manager,email
//   accounts: name,industry,website,phone,email,annual_revenue,employees,status
//             Acme Inc,Technology,acme.com,+1234567890,info@acme.com,1000000,50,active
//   leads:    name,email,phone,company,status,source,value
//             Jane Smith,jane@example.com,+1234567890,Beta Corp,new,website,50000
//
// Filenames: contacts_template.csv / accounts_template.csv /
// leads_template.csv. Our clone wired the three buttons to
// /api/export?type=X (server-side, live data, wrong filename + content).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const CONTACTS_TEMPLATE =
  "name,email,phone,company,position,source\nJohn Doe,john@example.com,+1234567890,Acme Inc,Sales Manager,email";
const ACCOUNTS_TEMPLATE =
  "name,industry,website,phone,email,annual_revenue,employees,status\nAcme Inc,Technology,acme.com,+1234567890,info@acme.com,1000000,50,active";
const LEADS_TEMPLATE =
  "name,email,phone,company,status,source,value\nJane Smith,jane@example.com,+1234567890,Beta Corp,new,website,50000";

describe("session-26: the static template seam (S26-P3)", () => {
  it("src/lib/csv-templates.ts exists", () => {
    expect(read("src/lib/csv-templates.ts")).not.toBeNull();
  });

  it("the three template strings are byte-exact", () => {
    const code = read("src/lib/csv-templates.ts")!;
    expect(code).toContain(JSON.stringify(CONTACTS_TEMPLATE).slice(1, -1));
    expect(code).toContain(JSON.stringify(ACCOUNTS_TEMPLATE).slice(1, -1));
    expect(code).toContain(JSON.stringify(LEADS_TEMPLATE).slice(1, -1));
  });

  it("templateFilename() emits the <key>_template.csv convention", () => {
    const code = read("src/lib/csv-templates.ts")!;
    expect(code).toMatch(/_template\.csv/);
    expect(code).toMatch(/contacts_template\.csv/);
    expect(code).toMatch(/accounts_template\.csv/);
    expect(code).toMatch(/leads_template\.csv/);
  });
});

describe("session-26: the settings page's template wiring (S26-P3)", () => {
  it("the three template buttons call the seam through downloadBlob", () => {
    const code = stripComments(read("src/app/(app)/settings/settings-page.tsx")!);
    const tplBlock = code.slice(
      code.indexOf("Download Contacts Template"),
      code.indexOf("Download Leads Template") + 120,
    );
    expect(tplBlock).toMatch(/CSV_TEMPLATES|csvTemplates|downloadTemplate/);
    expect(tplBlock).toMatch(/downloadBlob\(/);
  });

  it("the template buttons carry ZERO /api/export references", () => {
    const code = stripComments(read("src/app/(app)/settings/settings-page.tsx")!);
    const tplBlock = code.slice(
      code.indexOf("Download Contacts Template"),
      code.indexOf("Download Leads Template") + 120,
    );
    expect(tplBlock).not.toMatch(/\/api\/export/);
  });
});
