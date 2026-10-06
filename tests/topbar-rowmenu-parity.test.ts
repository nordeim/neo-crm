import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-73 parity suite (the 73-c topbar/search rotation + the row-menu
// migration): every pin mirrors a BUNDLE-DECODED reference fact (the
// fresh-fetched index-DZ-xbrIm.js) or a LIVE-MEASURED one (the computed
// 16px icon cascade on the reference's Mail/Bell buttons).
//
// The reference facts pinned here:
// - the four row-action menus are REAL Radix DropdownMenus (`Yg
//   align:"end"` x5 decoded: the account menu + accounts/contacts/leads/
//   calendar row menus) with STOCK `$s` items — TEXT-ONLY children
//   (`children:"Edit"` etc., no icon JSX, no separators), the Delete
//   items carrying the bare literal `className:"text-red-600"`.
// - the row triggers are the STOCK ghost icon Buttons (h-9 w-9) with the
//   EllipsisVertical icon (Bw) at w-4 h-4.
// - the topbar header carries the EXPLICIT `border-gray-200` family (the
//   reference's literal — our --color-line-strong #e5e7eb).
// - the mail/bell are stock ghost icon Buttons + `text-gray-600 hidden
//   sm:flex` (their w-5 h-5-classed icons COMPUTE 16px via the button
//   base's [&_svg]:size-4 — LIVE-measured on the reference).
// - the "Hi, " chain: display_name || full_name || email || "Guest" —
//   no @-split, the "Guest" terminal.
// - the avatar fallback initial chain ends at "G".
// - the Profile menuitem is `asChild` wrapping a REAL anchor (the
//   reference's ox Link → <a href="/Profile">).

function read(rel: string): string {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : "";
}

function stripComments(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const topbar = () => stripComments(read("src/components/layout/topbar.tsx"));
const dropdown = () => stripComments(read("src/components/ui/dropdown.tsx"));
const button = () => stripComments(read("src/components/ui/button.tsx"));
const input = () => stripComments(read("src/components/ui/input.tsx"));
const searchRoute = () => stripComments(read("src/app/api/search/route.ts"));
const settingsPage = () => stripComments(read("src/app/(app)/settings/settings-page.tsx"));
const page = (rel: string) => stripComments(read(`src/app/(app)/${rel}`));

// ---------------------------------------------------------------------------
// S73-P1 — the row-menu migration (M-73c6/c7/c8/c9)
// ---------------------------------------------------------------------------

describe("session-73: the row menus are REAL DropdownMenus (M-73c6)", () => {
  const surfaces = [
    ["accounts/accounts-page.tsx", "accounts"],
    ["contacts/contacts-page.tsx", "contacts"],
    ["leads/leads-page.tsx", "leads"],
    ["calendar/calendar-page.tsx", "calendar"],
  ] as const;

  for (const [rel, name] of surfaces) {
    it(`${name}: the row-action menu uses the Menu* primitives (not the Popover Dropdown)`, () => {
      const src = page(rel);
      expect(src).toMatch(/<Menu>/);
      expect(src).toMatch(/<MenuTrigger/);
      expect(src).toMatch(/<MenuContent/);
      expect(src).toMatch(/<MenuItem/);
      // The Popover family is GONE from the ROW MENUS. (The leads page
      // legitimately keeps its Filters POPOVER — the superset surface
      // with no reference menu counterpart — so the absence pins scope
      // to the row-menu region around the ⋮ trigger.)
      const at = src.indexOf("Actions for ");
      if (at < 0 && name === "calendar") {
        // The calendar trigger carries the static "Event actions" label
        // instead — the whole page is the row-menu surface there.
        expect(src).not.toMatch(/<DropdownItem/);
        return;
      }
      expect(at).toBeGreaterThanOrEqual(0);
      const region = src.slice(Math.max(0, at - 600), at + 2200);
      expect(region).not.toMatch(/<DropdownTrigger/);
      expect(region).not.toMatch(/<DropdownContent/);
      expect(region).not.toMatch(/<DropdownItem/);
    });
  }

  it("MenuContent composes the S46-P7 click containment (the portal tree must not reach clickable rows)", () => {
    const src = dropdown();
    const at = src.indexOf("function MenuContent");
    expect(at).toBeGreaterThanOrEqual(0);
    const fn = src.slice(at, at + 1400);
    // The SAME composed handler contract DropdownContent carries — the
    // caller's onClick first, then the stop, AFTER the {...props} spread.
    expect(fn).toMatch(/onClick=\{\(e\) => \{[\s\S]{0,160}props\.onClick\?\.\(e\);[\s\S]{0,200}e\.stopPropagation\(\);[\s\S]{0,80}\}\}/);
    const spreadAt = fn.indexOf("{...props}");
    const onClickAt = fn.indexOf("onClick={(e) =>");
    expect(spreadAt).toBeGreaterThanOrEqual(0);
    expect(onClickAt).toBeGreaterThan(spreadAt);
  });

  it("the DropdownSeparator retires with its last consumer (the reference's row menus ship no separators)", () => {
    const src = dropdown();
    expect(src).not.toMatch(/DropdownSeparator/);
  });
});

describe("session-73: the row-menu items are TEXT-ONLY with the red Delete literal (M-73c7/c9)", () => {
  const surfaces = [
    ["accounts/accounts-page.tsx", "accounts"],
    ["contacts/contacts-page.tsx", "contacts"],
    ["leads/leads-page.tsx", "leads"],
    ["calendar/calendar-page.tsx", "calendar"],
  ] as const;

  for (const [rel, name] of surfaces) {
    it(`${name}: no icons inside the menu items + the Delete items carry the bare text-red-600 literal`, () => {
      const src = page(rel);
      // Every <MenuItem …>…</MenuItem> body is text-only: no lucide icon
      // components between the item tags.
      const items = src.match(/<MenuItem[\s\S]*?<\/MenuItem>/g) ?? [];
      expect(items.length).toBeGreaterThan(0);
      for (const item of items) {
        expect(item).not.toMatch(/<(Trash2|Pencil|Save|X|Download|Plus) /);
      }
      // The destructive Delete items carry the reference's literal.
      const deleteItems = items.filter((i) => /Delete/.test(i));
      expect(deleteItems.length).toBeGreaterThan(0);
      for (const item of deleteItems) {
        expect(item).toMatch(/className="text-red-600"/);
        // And NOT the old destructive-prop form.
        expect(item).not.toMatch(/destructive/);
        expect(item).not.toMatch(/text-danger/);
      }
    });
  }

  it("the dead items stay dead (the S29-P2 contract under the new primitive)", () => {
    const leads = page("leads/leads-page.tsx");
    // The reference's own quirk: Convert to Opportunity carries NO
    // handler prop at all (bundle-verified) — the bare element.
    expect(leads).toMatch(/<MenuItem>Convert to Opportunity<\/MenuItem>/);
  });
});

describe("session-73: the row triggers are the stock ghost icon Buttons (M-73c8 + N-73c10)", () => {
  it("leads: the ⋮ trigger ships the STOCK icon size (h-9 w-9), not iconSm", () => {
    const src = page("leads/leads-page.tsx");
    const at = src.indexOf('aria-label={`Actions for ${l.name}`}');
    expect(at).toBeGreaterThanOrEqual(0);
    const region = src.slice(Math.max(0, at - 300), at + 120);
    expect(region).toMatch(/variant="ghost" size="icon"/);
    expect(region).not.toMatch(/iconSm/);
  });

  it("accounts + contacts + leads: the EllipsisVertical family (no MoreVertical imports)", () => {
    for (const rel of ["accounts/accounts-page.tsx", "contacts/contacts-page.tsx", "leads/leads-page.tsx"]) {
      const src = page(rel);
      expect(src).not.toMatch(/\bMoreVertical\b/);
      expect(src).toMatch(/<EllipsisVertical/);
    }
  });
});

// ---------------------------------------------------------------------------
// S73-P2 — the topbar sextet (L-73c1/c2/c3/c4/c9 + N-73c1/c4)
// ---------------------------------------------------------------------------

describe("session-73: the topbar parity sextet", () => {
  it("the header border is the reference's EXPLICIT gray-200 family (border-line-strong)", () => {
    expect(read("src/lib/page-layout.ts")).toMatch(
      /header: "bg-surface border-b border-line-strong px-4 sm:px-8 py-4"/,
    );
  });

  it("the mail/bell are the STOCK ghost icon Buttons with the reference's exact className", () => {
    const src = topbar();
    // The stock construction — variant ghost + size icon + the
    // reference's literal class chain (the ring + the computed-16px icon
    // cascade arrive with the base; ours rendered 20px on raw buttons).
    const mailAt = src.indexOf('aria-label="Messages"');
    expect(mailAt).toBeGreaterThanOrEqual(0);
    const mailRegion = src.slice(Math.max(0, mailAt - 400), mailAt + 200);
    expect(mailRegion).toMatch(/<Button[^>]*variant="ghost"[^>]*size="icon"/);
    expect(mailRegion).toMatch(/className="text-gray-600 hidden sm:flex"/);
    const bellAt = src.indexOf('aria-label="Notifications"');
    const bellRegion = src.slice(Math.max(0, bellAt - 400), bellAt + 200);
    expect(bellRegion).toMatch(/<Button[^>]*variant="ghost"[^>]*size="icon"/);
    expect(bellRegion).toMatch(/className="text-gray-600 hidden sm:flex"/);
    // The raw <button> form is retired.
    expect(src).not.toMatch(/<button[^>]*className=\{TOPBAR_LAYOUT\.iconButton\}/);
  });

  it('the "Hi, " chain: name || email || "Guest" — NO @-split (the reference\'s formula)', () => {
    const src = topbar();
    expect(src).toMatch(/Hi, \{user\.name \|\| user\.email \|\| "Guest"\}/);
    expect(src).not.toMatch(/split\("@"\)/);
  });

  it('the avatar fallback initial chain ends at "G"', () => {
    const src = topbar();
    expect(src).toMatch(/\(user\.name \|\| user\.email \|\| "G"\)\.charAt\(0\)\.toUpperCase\(\)/);
  });

  it("the dead iconButton + userMenu records retire (zero consumers after the migration)", () => {
    const src = read("src/lib/page-layout.ts");
    expect(src).not.toMatch(/iconButton:/);
    expect(src).not.toMatch(/userMenu:/);
  });

  it("the globals.css gray-200 inventory gains the topbar header (the S12-P3 record accuracy)", () => {
    const css = read("src/app/globals.css");
    expect(css).toMatch(/TOPBAR\s+HEADER\s+border/);
  });
});

// ---------------------------------------------------------------------------
// S73-P3 — the Profile anchor (L-73c5)
// ---------------------------------------------------------------------------

describe("session-73: the Profile menuitem is a real anchor (L-73c5)", () => {
  it("renders MenuItem asChild wrapping a next/link anchor to /Profile", () => {
    const src = topbar();
    expect(src).toMatch(/<MenuItem asChild>/);
    expect(src).toMatch(/<Link href="\/Profile">Profile<\/Link>/);
    // The router.push form is retired (the anchor keeps middle-click /
    // open-in-new-tab semantics — the reference's own construction).
    expect(src).not.toMatch(/router\.push\("\/Profile"\)/);
  });
});

// ---------------------------------------------------------------------------
// S73-P4 — the stock-mirror completion (N-73c5/c6)
// ---------------------------------------------------------------------------

describe("session-73: the Button/Input stock-mirror completion", () => {
  it("BUTTON_BASE carries the stock svg size (the computed-16px cascade)", () => {
    const src = read("src/lib/page-layout.ts");
    expect(src).toMatch(/svgSize: "\[&_svg\]:size-4"/);
    // And the Button composes it (the literal lives in the record).
    expect(button()).toMatch(/BUTTON_BASE\.svgSize/);
  });

  it("the Input base carries the stock file:* family", () => {
    // The literal family lives in the INPUT_BASE.file record (pinned
    // in page-layout.test.ts); the component composes it.
    const src = input();
    expect(src).toMatch(/\$\{INPUT_BASE\.file\}/);
    const layout = read("src/lib/page-layout.ts");
    expect(layout).toMatch(/file: "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground"/);
  });
});

// ---------------------------------------------------------------------------
// S73-P5 — the search hygiene pair (N-73c2/c7)
// ---------------------------------------------------------------------------

describe("session-73: the search hygiene pair", () => {
  it("the debounce SUCCESS path is abort-gated (the s46-P4 symmetry)", () => {
    const src = topbar();
    // The success branch checks the abort flag before writing state —
    // the catch + envelope paths already carry it.
    const at = src.indexOf("body?.ok");
    expect(at).toBeGreaterThanOrEqual(0);
    const region = src.slice(at, at + 260);
    expect(region).toMatch(/!controller\.signal\.aborted/);
  });

  it("/api/search drops the unused owner/account includes (the topbar consumes id/name/stage/value)", () => {
    const src = searchRoute();
    expect(src).not.toMatch(/include:/);
    expect(src).not.toMatch(/\bowner\b/);
    expect(src).not.toMatch(/avatarColor/);
  });
});

// ---------------------------------------------------------------------------
// S73-P6 — the settings stragglers (N-73a1/a3)
// ---------------------------------------------------------------------------

describe("session-73: the settings stragglers", () => {
  it("the DefaultsEditor's dead single-child flex wrapper retires (the M-72c5 sibling)", () => {
    const src = settingsPage();
    const at = src.indexOf("function DefaultsEditor");
    expect(at).toBeGreaterThanOrEqual(0);
    const fn = src.slice(at, at + 4000);
    expect(fn).not.toMatch(/<div className="flex flex-col gap-4">/);
  });

  it("the api.ts family comment carries the honest 13-route enumeration (N-73a1)", () => {
    const src = read("src/lib/api.ts");
    const at = src.indexOf("F-68a2");
    expect(at).toBeGreaterThanOrEqual(0);
    const comment = src.slice(Math.max(0, at - 400), at + 400);
    expect(comment).toMatch(/settings \+ users \+ reset/);
  });
});
