import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-72 pins (the 72-c rotation on the settings/profile seam —
// every parity claim bundle-decoded against the fresh-fetched
// reference index-DZ-xbrIm.js at drift sweep #68). The H-72c1
// picklist anatomy, the M-72c1 remount-wipe retirement, the M-72c2
// users-PATCH pre-gate, the M-72c3 agenda retirement, the M-72c4
// instant-render contract, the M-72c5 Data-panel spacing, the
// L-72c1 export icons, the profile parity sextet (S72-P7), and the
// defaults input parity (S72-P8).

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const page = () => stripComments(read("src/app/(app)/settings/settings-page.tsx") ?? "");
const pageRaw = () => read("src/app/(app)/settings/settings-page.tsx") ?? "";
const profile = () => stripComments(read("src/app/(app)/profile/profile-page.tsx") ?? "");
const profileRaw = () => read("src/app/(app)/profile/profile-page.tsx") ?? "";
const settingsRoute = () => stripComments(read("src/app/api/settings/route.ts") ?? "");
const usersRoute = () => stripComments(read("src/app/api/users/route.ts") ?? "");
const store = () => stripComments(read("src/stores/crm-store.ts") ?? "");

/** The ListEditor component body (declaration to the page component). */
function listEditor(src: string): string {
  const at = src.indexOf("function ListEditor(");
  expect(at).toBeGreaterThanOrEqual(0);
  const end = src.indexOf("export default function SettingsPage");
  return src.slice(at, end > at ? end : at + 6000);
}

describe("session-72: the picklist bordered-row anatomy (H-72c1, bundle-decoded)", () => {
  it("the items render as bordered list rows — the reference's ly geometry, not chip pills", () => {
    const src = listEditor(page());
    // The row rides the SETTINGS_PICKLIST.itemRow pin (the literal
    // lives in page-layout.ts — pinned there in lockstep).
    expect(src).toMatch(/className=\{SETTINGS_PICKLIST\.itemRow\}/);
    // The chip-pill classes are GONE.
    expect(src).not.toContain("rounded-full border border-line");
    expect(src).not.toContain("flex flex-wrap");
  });

  it("each row carries the flex-1 name span + the Pencil rename + the red Trash2 delete", () => {
    const src = listEditor(page());
    expect(src).toMatch(/<span className="flex-1">\{item\}<\/span>/);
    expect(src).toContain("<Pencil");
    expect(src).toContain("<Trash2");
    // The delete icon button rides the SETTINGS_PICKLIST.deleteBtn pin.
    expect(src).toMatch(/className=\{SETTINGS_PICKLIST\.deleteBtn\}/);
  });

  it("the rename mode swaps the row to Input(flex-1, Enter saves) + Save icon + X", () => {
    const src = listEditor(page());
    expect(src).toContain("<Save");
    expect(src).toMatch(/className="flex-1"/);
    expect(src).toMatch(/e\.key === "Enter"/);
    // The rename buttons are ghost icon buttons (the reference's Ke
    // size="icon" variant="ghost").
    expect(src).toMatch(/size="icon"\s+variant="ghost"|variant="ghost"\s+size="icon"/);
  });

  it("the empty state renders inside the items container as a sibling of the rows", () => {
    const src = listEditor(page());
    // The children-array `&&` form — the p is a sibling of the mapped
    // rows inside the space-y-2 mb-4 container (the reference's
    // `t.length===0 && jsx("p", …)`).
    expect(src).toMatch(/\{items\.length === 0 && <p className=\{SETTINGS_PICKLIST\.empty\}>No items yet<\/p>\}/);
  });

  it("the add button carries NO dead size prop (the default size, N-72c2)", () => {
    const src = listEditor(page());
    const at = src.indexOf("SETTINGS_PICKLIST.addButton");
    expect(at).toBeGreaterThanOrEqual(0);
    const btn = src.slice(Math.max(0, at - 300), at + 200);
    expect(btn).not.toContain('size="sm"');
  });

  it("ListEditor's contract: onAdd + onUpdate + onDelete (the rename capability)", () => {
    const src = pageRaw();
    expect(src).toMatch(/onAdd: \(value: string\) => void/);
    expect(src).toMatch(/onUpdate: \(index: number, name: string\) => void/);
    expect(src).toMatch(/onDelete: \(index: number\) => void/);
    // The index-only remove contract is gone.
    expect(src).not.toMatch(/onRemove: \(index: number\) => void/);
  });
});

describe("session-72: the props-driven editors + the instant render (M-72c1 + M-72c4 + L-72c6)", () => {
  it("the ConfigEditor renders its lists from props — no local lists copy, no mutate-in-updater", () => {
    const src = page();
    const at = src.indexOf("function ConfigEditor");
    expect(at).toBeGreaterThanOrEqual(0);
    const body = src.slice(at, at + 3000);
    // Props-driven: the settings snapshot read directly with the []
    // fallback (the reference's data:n=[] initial).
    expect(body).toMatch(/settings\?\.contactSources \?\? \[\]/);
    expect(body).toMatch(/settings\?\.industries \?\? \[\]/);
    // The local-lists copy is GONE.
    expect(body).not.toMatch(/React\.useState\(\(\) => \(\{[\s\S]*contactSources:/);
    expect(body).not.toContain("function mutate(");
    expect(body).not.toContain("setLists");
  });

  it("the JSON.stringify remount keys are RETIRED — the editors never remount on their own saves", () => {
    const src = page();
    expect(src).not.toContain("JSON.stringify(settings)");
    // The DefaultsEditor keys on the resolved epoch ONLY (pending →
    // resolved — the single remount when the fetch lands).
    expect(src).toMatch(/key=\{settings \? "resolved" : "pending"\}/);
  });

  it("the 'Loading settings…' gates are RETIRED — both tabs render instantly (M-72c4)", () => {
    const src = page();
    expect(src).not.toContain("Loading settings");
    // The editors mount unconditionally (the null-settings contract
    // handled by the fallbacks inside).
    expect(src).toMatch(/<ConfigEditor settings=\{settings\} \/>/);
  });

  it("the DefaultsEditor initializes from the reference's fallback values (M-72c4)", () => {
    const src = page();
    const at = src.indexOf("function DefaultsEditor");
    expect(at).toBeGreaterThanOrEqual(0);
    const body = src.slice(at, at + 1800);
    expect(body).toMatch(/settings\?\.defaultCurrency \?\? "AED"/);
    expect(body).toMatch(/settings\?\.defaultLeadStage \?\? "new"/);
    expect(body).toMatch(/settings\?\.defaultTier \?\? "B"/);
    expect(body).toMatch(/settings\?\.followUpDays \?\? 3/);
    expect(body).toMatch(/settings\?\.calendarView \?\? "month"/);
    expect(body).toMatch(/settings\?\.firstDayOfWeek \?\? "monday"/);
  });

  it("the DefaultsEditor set() computes next OUTSIDE the updater (L-72c6 — pure updaters)", () => {
    const src = page();
    const at = src.indexOf("function set<");
    expect(at).toBeGreaterThanOrEqual(0);
    const setFn = src.slice(at, at + 600);
    // The next snapshot is computed from the render's `defaults`
    // BEFORE setDefaults — no side effects inside the updater.
    expect(setFn).toMatch(/const next = \{ \.\.\.defaults, \[key\]: value \};/);
    expect(setFn).not.toMatch(/setDefaults\(\(d\) =>/);
  });

  it("a failed picklist PUT cannot leave a phantom item — the structural F-46c successor", () => {
    const src = page();
    // The handlers PUT the computed list and only toast on failure —
    // the UI shows the store's truth (props), so a 400 changes nothing.
    const at = src.indexOf("function ConfigEditor");
    const body = src.slice(at, at + 3000);
    expect(body).toMatch(/toast\.error\(\s*"Could not save",\s*res\.error\s*\)/);
    expect(body).not.toContain("prev");
  });
});

describe("session-72: the agenda retirement + the Data panel spacing (M-72c3 + M-72c5)", () => {
  it("the calendar-view Select ships exactly month/week — the reference's set (bundle-decoded)", () => {
    const src = page();
    expect(src).not.toContain('"agenda"');
    expect(src).not.toContain(">Agenda<");
    expect(src).toMatch(/<SelectItem value="month">Month<\/SelectItem>/);
    expect(src).toMatch(/<SelectItem value="week">Week<\/SelectItem>/);
  });

  it("the settings route's calendarView enum is month/week only", () => {
    const src = settingsRoute();
    expect(src).toMatch(/\["month", "week"\]\.includes\(view\)/);
    expect(src).not.toContain('"agenda"');
  });

  it("the Data panel carries the reference's space-y-6 (24px between cards, M-72c5)", () => {
    const src = page();
    expect(src).toMatch(/tab="data" className="mt-2 space-y-6"/);
    // The inner 16px wrapper is GONE — the cards are the panel's
    // direct children.
    expect(src).not.toMatch(/tab="data"[\s\S]{0,200}flex flex-col gap-4/);
  });
});

describe("session-72: the export-button icons + the defaults input parity (L-72c1 + L-72c8 + N-72c1)", () => {
  it("all four Export buttons carry the Download icon (L-72c1)", () => {
    const src = page();
    const exports = src.match(/Export (Contacts|Accounts|Leads|Activities)/g) ?? [];
    expect(exports.length).toBe(4);
    // Every export button's icon: the Download at SETTINGS_DATA.buttonIcon.
    const iconMatches = src.match(/<Download className=\{SETTINGS_DATA\.buttonIcon\} \/> Export /g) ?? [];
    expect(iconMatches.length).toBe(4);
  });

  it("the free-text defaults inputs persist RAW keystrokes — no client transforms (L-72c8)", () => {
    const src = page();
    expect(src).not.toContain("toUpperCase().slice");
    expect(src).toMatch(/onChange=\{\(e\) => set\("defaultCurrency", e\.target\.value\)\}/);
    expect(src).toMatch(/onChange=\{\(e\) => set\("defaultTier", e\.target\.value\)\}/);
  });

  it("the three free-text defaults inputs carry the reference's placeholders (N-72c1)", () => {
    const src = page();
    expect(src).toMatch(/placeholder="AED"/);
    expect(src).toMatch(/placeholder="new"/);
    expect(src).toMatch(/placeholder="B"/);
  });
});

describe("session-72: the users PATCH body pre-gate (M-72c2)", () => {
  it("the users route imports isBodyTooLarge and gates BEFORE the parse", () => {
    const src = usersRoute();
    expect(src).toMatch(/isBodyTooLarge/);
    const gate = src.indexOf("isBodyTooLarge(request)");
    const parse = src.indexOf("request.json()");
    expect(gate).toBeGreaterThanOrEqual(0);
    expect(parse).toBeGreaterThan(gate);
    expect(src).toContain(
      'if (isBodyTooLarge(request)) return ERR.BAD_REQUEST("Request body too large");',
    );
  });
});

describe("session-72: the profile parity sextet (S72-P7)", () => {
  it("the save path goes through the store's updateUser action (the reference's t(await me()) contract)", () => {
    const src = profile();
    expect(src).toMatch(/updateUser/);
    // The raw PATCH + the wrong-slice fetchUsers refresh are GONE from
    // the page.
    expect(src).not.toMatch(/fetch\("\/api\/users"/);
    expect(src).not.toContain("fetchUsers");
  });

  it("the store carries the updateUser action with the call() envelope + the s64 write-guard", () => {
    const src = store();
    const at = src.indexOf("updateUser: async");
    expect(at).toBeGreaterThanOrEqual(0);
    const body = src.slice(at, at + 700);
    expect(body).toMatch(/call<User>\("\/api\/users"/);
    expect(body).toMatch(/method: "PATCH"/);
    expect(body).toMatch(/session === sessionWriteToken/);
    expect(body).toMatch(/set\(\{ user: res\.data \}\)/);
  });

  it("the Account card reads the STORE user's photo + name — not the local form state (L-72c2)", () => {
    const src = profile();
    // The right-column card renders user.photoUrl (stale until save,
    // the reference's own behavior); the form avatar keeps the local
    // photoUrl.
    const cardAt = src.indexOf('className={PROFILE_LAYOUT.nameWrap}');
    expect(cardAt).toBeGreaterThanOrEqual(0);
    const card = src.slice(cardAt, cardAt + 1600);
    expect(card).toMatch(/user\.photoUrl \?/);
    expect(card).not.toMatch(/\{photoUrl \? <img/);
  });

  it("the toasts are single-arg — no second description args (L-72c3 + N-72c3)", () => {
    const src = profileRaw();
    expect(src).toContain('toast.error("Failed to update profile")');
    expect(src).toContain('toast.success("Profile updated successfully")');
    expect(src).not.toContain('toast.error("Failed to update profile",');
    expect(src).not.toContain('toast.success("Profile updated successfully",');
  });

  it("the Save button uses the three-dot 'Saving...' form (L-72c4)", () => {
    const src = profile();
    expect(src).toContain('"Saving..."');
    expect(src).not.toContain("Saving…");
  });

  it("the loading branch is HEADERLESS — plain 'Loading...' at text-center py-12 (L-72c9)", () => {
    const src = profile();
    expect(src).not.toContain("Loading profile");
    expect(src).toMatch(/<div className="text-center py-12">Loading\.\.\.<\/div>/);
    // The header row renders only in the loaded branch (after the
    // user resolves).
    const loadAt = src.indexOf("text-center py-12");
    const headerAt = src.indexOf("PROFILE_LAYOUT.headerRow");
    expect(headerAt).toBeGreaterThan(loadAt);
  });

  it("the upload label drops the Camera icon while uploading (N-72c7)", () => {
    const src = profile();
    expect(src).toMatch(/\{uploading \? "Uploading\.\.\." :/);
  });
});
