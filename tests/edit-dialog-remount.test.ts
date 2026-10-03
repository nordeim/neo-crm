import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-46 pins (S46-P6): the edit-dialog remount keys — the F-46f
// finding (discovered LIVE while verifying S46-P1, reproduced on the
// stashed pre-session code — pre-existing). The three EntityEditDialog
// edit dialogs opened with EMPTY fields: the `form` useState initializer
// reads `initial` at the component's FIRST render — which happens at
// PAGE MOUNT, when editTarget is null and initial is all-empty. No key,
// no re-sync: the form stayed empty forever, whichever row's Edit you
// clicked — masked by F-46a (the empty submit 400'd silently). The fix,
// the repo's own settings-editor convention ("local state initializes
// from props at mount — never via setState-in-effect"): a per-target
// remount key — every open re-initializes the form from the live
// initial.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const accounts = () => stripComments(read("src/app/(app)/accounts/accounts-page.tsx") ?? "");
const leads = () => stripComments(read("src/app/(app)/leads/leads-page.tsx") ?? "");
const contacts = () => stripComments(read("src/app/(app)/contacts/contacts-page.tsx") ?? "");

/** The EntityEditDialog JSX region in a page source. */
function usage(src: string): string {
  const at = src.indexOf("<EntityEditDialog");
  expect(at).toBeGreaterThanOrEqual(0);
  return src.slice(at, at + 400);
}

describe("session-46: the edit dialogs remount per target (S46-P6)", () => {
  it("accounts: the EntityEditDialog carries the per-target remount key (the form initializes from the live initial)", () => {
    const region = usage(accounts());
    expect(region).toMatch(/key=\{editTarget\?\.id \?\? "none"\}/);
  });

  it("leads: the EntityEditDialog carries the per-target remount key", () => {
    const region = usage(leads());
    expect(region).toMatch(/key=\{editTarget\?\.id \?\? "none"\}/);
  });

  it("contacts: the EntityEditDialog carries the per-target remount key", () => {
    const region = usage(contacts());
    expect(region).toMatch(/key=\{editTarget\?\.id \?\? "none"\}/);
  });
});
