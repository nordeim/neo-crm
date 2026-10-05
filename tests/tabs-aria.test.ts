import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session-23 ARIA tabs contract + keyboard pins (S23-P1): the reference's
// tab strips are Radix Tabs and ship the FULL contract, live-verified on
// /activities (4 tabs), /reports (5) and /settings (3) on 2026-10-01:
// every tab button carries an id + aria-controls pointing at its panel's
// id; every panel carries an id + aria-labelledby pointing back at its
// tab's id; ALL N panel shells stay mounted (inactive ones hidden with
// EMPTY content); the tablist supports the full ARIA keyboard model —
// ArrowRight/ArrowLeft with WRAP, Home/End, automatic activation
// (selection follows focus). Our custom Tabs shipped role=tab/tablist/
// tabpanel + aria-selected + roving tabindex (the documented superset
// over the reference's all-tabIndex=-1 platform defect) but none of the
// wiring, none of the keyboard model, a single unwired panel — and
// /activities shipped a REDUNDANT EMPTY tabpanel (the built-in panel
// rendered with {null} children) plus a hand-rolled unwired one.
//
// S23-P2: our login page redirected authenticated users to "/" — an
// invented scaffold pattern; the reference serves the login card to
// authenticated visitors (live-verified twice this session).
//
// These tests parse the component/page sources so the contract is pinned
// at the unit layer without a browser; the live DOM wiring + keyboard
// behavior is pinned by the e2e tab checks (tests/e2e/crm.spec.ts).

const tabsSrc = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/ui/tabs.tsx"),
  "utf8",
);
const activitiesSrc = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/(app)/activities/activities-page.tsx"),
  "utf8",
);
const reportsSrc = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/(app)/reports/reports-page.tsx"),
  "utf8",
);
const settingsSrc = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/(app)/settings/settings-page.tsx"),
  "utf8",
);
const loginSrc = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/login/page.tsx"),
  "utf8",
);

// Source pins read RULES, not documentation: strip comments first (the
// s21/s22 own-doc-comment hazard — the retirement notes themselves name
// the retired constructs).
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const tabs = stripComments(tabsSrc);
const activities = stripComments(activitiesSrc);
const reports = stripComments(reportsSrc);
const settings = stripComments(settingsSrc);
const login = stripComments(loginSrc);

describe("tabs: the ARIA id wiring (S23-P1)", () => {
  it("generates a stable uid via React.useId for the trigger/panel pair", () => {
    expect(tabs).toMatch(/\buseId\(\)/);
  });

  it("wires every tab button with id={`${uid}-trigger-…`} + aria-controls={`${uid}-content-…`}", () => {
    expect(tabs).toMatch(/id=\{`\$\{uid\}-trigger-/);
    expect(tabs).toMatch(/aria-controls=\{`\$\{uid\}-content-/);
  });

  it("exports a TabsPanel component consuming the Tabs context", () => {
    expect(tabsSrc).toMatch(/function TabsPanel\(/);
    expect(tabsSrc).toMatch(/export \{ Tabs(?:Panel)?, TabsPanel \}/);
  });

  it("TabsPanel renders the wired shell: role=tabpanel + content id + aria-labelledby + hidden", () => {
    expect(tabs).toMatch(/role="tabpanel"/);
    expect(tabs).toMatch(/id=\{`\$\{uid\}-content-/);
    expect(tabs).toMatch(/aria-labelledby=\{`\$\{uid\}-trigger-/);
    expect(tabs).toMatch(/hidden=\{/);
  });

  it("the Tabs component itself renders NO built-in tabpanel (the activities empty-shell retirement)", () => {
    // The old component rendered `<div role="tabpanel">{children}</div>`
    // directly after each tablist — with {null} children on /activities
    // that produced a REDUNDANT EMPTY role=tabpanel in the toolbar.
    // Post-migration TabsPanel is the ONLY role="tabpanel" renderer in
    // the file — exactly one occurrence in the stripped source.
    expect((tabs.match(/role="tabpanel"/g) ?? []).length).toBe(1);
  });
});

describe("tabs: the ARIA keyboard model (S23-P1)", () => {
  it("handles ArrowRight and ArrowLeft with wrap-around", () => {
    expect(tabs).toMatch(/"ArrowRight"/);
    expect(tabs).toMatch(/"ArrowLeft"/);
    expect(tabs).toMatch(/%\s*tabs\.length/);
  });

  it("handles Home and End (jump to the first/last tab)", () => {
    expect(tabs).toMatch(/"Home"/);
    expect(tabs).toMatch(/"End"/);
  });

  it("moves focus AND selection together (automatic activation)", () => {
    // focus-follows-selection: the newly-selected tab button receives
    // focus in the same keydown pass (Radix's model, live-verified).
    expect(tabs).toMatch(/\.focus\(\)/);
    expect(tabs).toMatch(/onValueChange\(/);
  });

  it("swallows the arrow/Home/End keydown so the page does not scroll", () => {
    expect(tabs).toMatch(/preventDefault\(\)/);
  });
});

describe("tabs: the per-page panel migration (S23-P1)", () => {
  it("activities renders one wired TabsPanel per priority tab (4)", () => {
    expect(activities).toMatch(/TabsPanel/);
    expect((activities.match(/<TabsPanel/g) ?? []).length).toBe(4);
    expect(activities).not.toMatch(/<div role="tabpanel">/);
  });

  it("reports renders one wired TabsPanel per report tab (5)", () => {
    expect(reports).toMatch(/TabsPanel/);
    expect((reports.match(/<TabsPanel/g) ?? []).length).toBe(5);
  });

  it("settings renders one wired TabsPanel per settings tab (3)", () => {
    expect(settings).toMatch(/TabsPanel/);
    expect((settings.match(/<TabsPanel/g) ?? []).length).toBe(3);
  });

  it("every page imports TabsPanel from the shared component", () => {
    expect(activitiesSrc).toMatch(/TabsPanel[^\n]*from "@\/components\/ui\/tabs"/);
    expect(reportsSrc).toMatch(/TabsPanel[^\n]*from "@\/components\/ui\/tabs"/);
    expect(settingsSrc).toMatch(/TabsPanel[^\n]*from "@\/components\/ui\/tabs"/);
  });
});

describe("login: the authenticated-redirect retirement (S23-P2)", () => {
  it("the login page carries NO authenticated redirect (the reference serves the card to authed visitors)", () => {
    expect(login).not.toMatch(/redirect\(/);
    expect(login).not.toMatch(/getSessionUser/);
  });

  it("the login page stays force-dynamic (the reference serves /login dynamically)", () => {
    expect(login).toMatch(/force-dynamic/);
  });
});

// ---------------------------------------------------------------------------
// Session-66 (N-66d re-adjudicated): the count badge is a LIVE reference
// feature, not dead cargo. The bundle's activities priority strip renders
//   ["Overdue", P.overdue.length>0 && <span className="ml-2 px-2 py-0.5
//    text-xs bg-red-100 text-red-800 rounded-full">{P.overdue.length}</span>]
// — ONLY the Overdue tab, ONLY while > 0. The s23 tabs layer built the
// machinery but never wired it (and shipped invented state-dependent
// classes). The count span re-pins to the reference's literal; the guard
// lives at the call site exactly like the reference's `>0 &&`.
// ---------------------------------------------------------------------------

describe("session-66: the Overdue count badge (the unwired parity feature)", () => {
  it("the count span renders the reference's literal classes (red tint, rounded-full, ml-2 px-2 text-xs)", () => {
    const region = tabsSrc.slice(
      tabsSrc.indexOf("typeof tab.count"),
      tabsSrc.indexOf("typeof tab.count") + 700,
    );
    expect(region).toMatch(/ml-2 px-2 py-0\.5 text-xs bg-red-100 text-red-800 rounded-full/);
    // The invented state-dependent color ternary is gone — the reference's
    // badge is ALWAYS the red tint, active or not.
    expect(region).not.toMatch(/isActive \? "bg-primary\/10/);
    expect(region).not.toMatch(/text-\[11px\]/);
  });

  it("the activities Overdue tab passes the guarded count (the reference's P.overdue.length>0 && shape)", () => {
    const region = activitiesSrc.slice(
      activitiesSrc.indexOf("{ id: \"overdue\""),
      activitiesSrc.indexOf("{ id: \"overdue\"") + 200,
    );
    expect(region).toMatch(/count: overdue\.length > 0 \? overdue\.length : undefined/);
  });

  it("ONLY the Overdue tab carries a count (the reference's other three tabs are plain labels)", () => {
    const region = activitiesSrc.slice(
      activitiesSrc.indexOf("tabs={["),
      activitiesSrc.indexOf("tabs={[") + 400,
    );
    expect((region.match(/count:/g) ?? []).length).toBe(1);
  });
});
