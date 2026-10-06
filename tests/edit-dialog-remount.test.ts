import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-46 pins (S46-P6), RE-ANCHORED session-71 (S71-P1): the
// edit-dialog fresh-state-per-target contract. The F-46f finding
// (discovered LIVE while verifying S46-P1): the three EntityEditDialog
// edit dialogs opened with EMPTY fields — the `form` useState
// initializer read `initial` at the component's FIRST render, which
// happened at PAGE MOUNT (editTarget null, initial all-empty). No key,
// no re-sync: the form stayed empty forever, whichever row's Edit you
// clicked.
//
// The s46 fix keyed the OUTER EntityEditDialog by editTarget.id —
// fresh state per open, but at a cost the 71-c rotation caught
// (M-71a2): the close-path render flipped the key to "none" in the
// same batch `open` went false, unmounting the Radix Root instantly —
// the pinned exit animation NEVER played (the reference mounts its
// W7/wce/Mke permanently, no key — bundle-decoded).
//
// The session-71 form: the epoch-keyed CHILD form. The shell stays
// unkeyed + permanently mounted (the exit animation plays over the
// full body); a useOpenEpoch(open) adjust-during-render counter bumps
// ONLY on false→true transitions, re-keying the inner form at every
// open — the initializer re-reads the live `initial` (the F-46f
// contract, preserved and extended: fresh state per open for ANY
// target, same or different).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const accounts = () => stripComments(read("src/app/(app)/accounts/accounts-page.tsx") ?? "");
const leads = () => stripComments(read("src/app/(app)/leads/leads-page.tsx") ?? "");
const contacts = () => stripComments(read("src/app/(app)/contacts/contacts-page.tsx") ?? "");
const editDialog = () => stripComments(read("src/components/shared/entity-edit-dialog.tsx") ?? "");

/** The EntityEditDialog JSX region in a page source. */
function usage(src: string): string {
  const at = src.indexOf("<EntityEditDialog");
  expect(at).toBeGreaterThanOrEqual(0);
  return src.slice(at, at + 400);
}

describe("session-46 -> session-71: the edit dialogs re-initialize per open (S46-P6 -> S71-P1)", () => {
  it("the shell carries the epoch-keyed child form (the fresh-per-open mechanism inside EntityEditDialog)", () => {
    const src = editDialog();
    expect(src).toMatch(/useOpenEpoch\(open\)/);
    expect(src).toMatch(/key=\{epoch/);
    // The form state initializes from the LIVE initial inside the
    // keyed child (not at page-mount time in the shell).
    const formAt = src.indexOf("function EntityEditForm(");
    expect(formAt).toBeGreaterThan(-1);
    const form = src.slice(formAt);
    expect(form).toMatch(/useState/);
  });

  it("accounts: the mount carries NO outer key (the close-path unmount retired)", () => {
    const region = usage(accounts());
    expect(region).not.toMatch(/key=\{/);
    expect(region).toMatch(/initial=\{/);
  });

  it("leads: the mount carries NO outer key", () => {
    const region = usage(leads());
    expect(region).not.toMatch(/key=\{/);
    expect(region).toMatch(/initial=\{/);
  });

  it("contacts: the mount carries NO outer key", () => {
    const region = usage(contacts());
    expect(region).not.toMatch(/key=\{/);
    expect(region).toMatch(/initial=\{/);
  });
});
