import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-26 pins (S26-P2): the reset flow's native-dialog contract,
// byte-extracted from the reference's minified bundle:
//
//   if (e !== "RESET") { alert("Please type RESET to confirm"); return; }
//   if (confirm("This will permanently delete all contacts, accounts,
//   leads, opportunities, activities, and calendar events. Are you sure?"))
//     try {
//       await Promise.all([six entity list+delete passes]);
//       r.invalidateQueries(); t("");
//       alert("Data reset complete");
//     } catch { alert("Failed to reset data"); }
//
// Live-verified twice on the reference (the confirm intercepted + accepted;
// the input cleared, the button re-disabled, all six entity lists
// refetched — at zero data the deletes are no-ops so the network log shows
// ONLY the 6 list() GETs). Our clone shipped a direct reset + an invented
// toast — the s24/s25 invented-toast family.

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

const CONFIRM_MESSAGE =
  "This will permanently delete all contacts, accounts, leads, opportunities, activities, and calendar events. Are you sure?";

describe("session-26: the reset handler's native dialogs (S26-P2)", () => {
  it("the handler gates on confirm() with the reference's exact message", () => {
    const code = stripComments(read("src/app/(app)/settings/settings-page.tsx")!);
    expect(code).toMatch(/confirm\(/);
    expect(code).toContain(CONFIRM_MESSAGE);
  });

  it("the defensive alert fires when the text is not RESET", () => {
    const code = stripComments(read("src/app/(app)/settings/settings-page.tsx")!);
    expect(code).toContain('alert("Please type RESET to confirm")');
  });

  it("the success path reports via the native alert, not a toast", () => {
    const code = stripComments(read("src/app/(app)/settings/settings-page.tsx")!);
    expect(code).toContain('alert("Data reset complete")');
    // The reset path carries NO toast call (the s24/s25 invented-toast
    // family retired). Scope: the reset onClick region only.
    const i = code.indexOf("resetText !== \"RESET\"");
    const region = code.slice(Math.max(0, i - 200), i + 900);
    expect(region).not.toMatch(/toast\./);
  });

  it("the failure path alerts", () => {
    const code = stripComments(read("src/app/(app)/settings/settings-page.tsx")!);
    expect(code).toContain('alert("Failed to reset data")');
  });

  it("the handler only resets when the confirm is accepted", () => {
    const code = stripComments(read("src/app/(app)/settings/settings-page.tsx")!);
    const i = code.indexOf(`confirm(\`${CONFIRM_MESSAGE}\`)`) >= 0
      ? code.indexOf(`confirm(\`${CONFIRM_MESSAGE}\`)`)
      : code.indexOf("confirm(");
    const region = code.slice(i, i + 500);
    // The reset call + the input clear live INSIDE the accepted branch.
    expect(region).toMatch(/resetData\(\)/);
    expect(region).toMatch(/setResetText\(""\)/);
  });
});

describe("session-26: the store's invalidation half (already at parity — now pinned)", () => {
  it("resetData refetches every entity slice after the wipe", () => {
    const code = stripComments(read("src/stores/crm-store.ts")!);
    const i = code.indexOf("resetData: async");
    const region = code.slice(i, i + 600);
    for (const fn of [
      "fetchAccounts()",
      "fetchContacts()",
      "fetchLeads()",
      "fetchActivities()",
      "fetchEvents()",
      "fetchSettings()",
      "fetchDashboard()",
    ]) {
      expect(region).toContain(fn);
    }
  });
});
