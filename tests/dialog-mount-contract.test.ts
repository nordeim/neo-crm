import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-71 pins (S71-P1): the permanently-mounted dialog family —
// the M-71a1/M-71a2/I-71a4 remediation. The 71-c rotation found the
// create/edit dialogs unmounting their form bodies at close:
//
// - M-71a1 (behavioral): ActivityForm's create key rode a RENDER-TIME
//   `Date.now()` — every parent re-render while the dialog was open
//   (all five consumer pages destructure the whole store; the
//   first-load slice resolutions are a guaranteed re-render source)
//   re-keyed the form → REMOUNT → the user's typed input WIPED.
// - M-71a2 (parity, bundle-decoded): the three EntityEditDialog
//   mounts keyed the OUTER component and nulled editTarget in the
//   same batched close render → the Radix Root unmounted instantly →
//   the pinned `data-[state=closed]` exit chrome NEVER played. The
//   reference mounts W7/wce/Mke with NO key, permanently positioned.
// - I-71a4 (parity, bundle-decoded): the five create dialogs'
//   `{open && <XForm/>}` conditional emptied the body during the
//   exit animation (a header-only shell sliding out). The reference
//   renders its create forms UNCONDITIONALLY inside DialogContent.
//
// The fix — the open-epoch key pattern: an adjust-during-render
// `useOpenEpoch(open)` (the sanctioned house pattern; the reference's
// own setState-in-effect sync is an ERROR under our lint) computes a
// stable epoch that increments ONLY on false→true transitions. The
// Form child renders UNCONDITIONALLY keyed by that epoch: at open the
// epoch bumps (fresh state per open — the s46 F-46f contract), while
// open it never re-keys (store re-renders inert), at close it stays
// stable (the exit animation plays over the FULL body).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const dialogs = () => stripComments(read("src/components/shared/entity-dialogs.tsx") ?? "");
const editDialog = () => stripComments(read("src/components/shared/entity-edit-dialog.tsx") ?? "");
const contacts = () => stripComments(read("src/app/(app)/contacts/contacts-page.tsx") ?? "");
const accounts = () => stripComments(read("src/app/(app)/accounts/accounts-page.tsx") ?? "");
const leads = () => stripComments(read("src/app/(app)/leads/leads-page.tsx") ?? "");

/** The JSX region of a named Dialog wrapper (between its declaration
 * and the next component declaration). */
function wrapperRegion(src: string, name: string): string {
  const i = src.indexOf(`export function ${name}(`);
  expect(i, `wrapper not found: ${name}`).toBeGreaterThan(-1);
  // The wrapper ends at the next top-level declaration after it.
  const rest = src.slice(i + 1);
  const m = rest.match(/\n(?:export )?function /);
  const j = m ? src.indexOf(m[0], i + 1) : src.length;
  return src.slice(i, j);
}

describe("session-71: the open-epoch mount contract (S71-P1)", () => {
  it("all five Dialog wrappers compute the epoch and mount their Form UNCONDITIONALLY (no {open && ...} conditional)", () => {
    const src = dialogs();
    for (const name of ["AccountDialog", "ContactDialog", "LeadDialog", "EventDialog", "ActivityDialog"]) {
      const region = wrapperRegion(src, name);
      expect(region, `${name} useOpenEpoch`).toMatch(/useOpenEpoch\(open\)/);
      expect(region, `${name} conditional mount`).not.toMatch(/\{open &&/);
    }
  });

  it("the five Forms ride the epoch key (the fresh-state-per-open remount)", () => {
    const src = dialogs();
    for (const name of ["AccountDialog", "ContactDialog", "LeadDialog", "EventDialog", "ActivityDialog"]) {
      const region = wrapperRegion(src, name);
      expect(region, `${name} epoch key`).toMatch(/key=\{epoch/);
    }
  });

  it("zero render-time keys: Date.now() retired from entity-dialogs.tsx (M-71a1)", () => {
    const src = dialogs();
    expect(src).not.toMatch(/Date\.now\(\)/);
  });

  it("the useOpenEpoch helper is the adjust-during-render form (no useEffect — the lint-forbidden reference pattern)", () => {
    const src = dialogs();
    expect(src).toMatch(/function useOpenEpoch\(/);
    // The adjust-during-render shape: a wasOpen tracker + the
    // false→true transition incrementing the epoch.
    const i = src.indexOf("function useOpenEpoch(");
    const helper = src.slice(i, src.indexOf("}", src.indexOf("return epoch", i)) + 1);
    expect(helper).toMatch(/useState/);
    expect(helper).toMatch(/if \(open && !wasOpen\)/);
    expect(helper).not.toMatch(/useEffect/);
  });

  it("the EntityEditDialog form is an epoch-keyed CHILD (the shell stays unkeyed + mounted)", () => {
    const src = editDialog();
    expect(src).toMatch(/useOpenEpoch\(open\)/);
    expect(src).not.toMatch(/\{open &&/);
    // The form body extracted into a child keyed by the epoch.
    expect(src).toMatch(/key=\{epoch\}/);
    // The shell itself carries NO key of its own (the M-71a2 outer-key
    // retirement): the ONLY key= inside the shell region is the
    // child's epoch key.
    const i = src.indexOf("export function EntityEditDialog(");
    const shell = src.slice(i, src.indexOf("function EntityEditForm("));
    expect((shell.match(/\bkey=\{/g) ?? []).length).toBe(1);
    expect(shell).toMatch(/<EntityEditForm\s[^>]*key=\{epoch\}/);
  });

  it("the three pages mount EntityEditDialog with NO outer key (M-71a2 — the close-path unmount retired)", () => {
    for (const [page, src] of [
      ["contacts", contacts()],
      ["accounts", accounts()],
      ["leads", leads()],
    ] as const) {
      const at = src.indexOf("<EntityEditDialog");
      expect(at, `${page} mount not found`).toBeGreaterThan(-1);
      const region = src.slice(at, at + 200);
      expect(region, `${page} outer key`).not.toMatch(/key=\{/);
    }
  });
});

describe("session-71: the savingEdit wiring (S71-P2, L-71b1)", () => {
  it("the three edit call sites feed isLoading (the reference's disabled/Saving... capability, bundle-decoded)", () => {
    for (const [page, src] of [
      ["contacts", contacts()],
      ["accounts", accounts()],
      ["leads", leads()],
    ] as const) {
      const at = src.indexOf("<EntityEditDialog");
      expect(at, `${page} mount not found`).toBeGreaterThan(-1);
      const region = src.slice(at, at + 700);
      expect(region, `${page} isLoading`).toMatch(/isLoading=\{savingEdit\}/);
      // The bracket: setSavingEdit(true) at submit entry, false at
      // resolution (the double-submit guard).
      expect(src, `${page} setSavingEdit(true)`).toMatch(/setSavingEdit\(true\)/);
      expect(src, `${page} setSavingEdit(false)`).toMatch(/setSavingEdit\(false\)/);
    }
  });
});

describe("session-71: the EventForm status options (S71-P3, N-71c2)", () => {
  it("the status SelectItems ship the reference's plain literal labels (no capitalize class)", () => {
    const src = dialogs();
    const i = src.indexOf("function EventForm");
    const form = src.slice(i, src.indexOf("export function ActivityDialog"));
    // Anchor on the OPTIONS ARRAY (the first "scheduled" hit is the
    // useState initializer, not the select).
    const statusAt = form.indexOf('"scheduled", "completed", "cancelled"');
    expect(statusAt).toBeGreaterThan(-1);
    const statusRegion = form.slice(Math.max(0, statusAt - 250), statusAt + 250);
    expect(statusRegion).not.toContain("capitalize");
    // The manual literal transform stays (the reference's
    // value:"scheduled"/children:"Scheduled" pairs).
    expect(statusRegion).toMatch(/toUpperCase/);
  });
});
