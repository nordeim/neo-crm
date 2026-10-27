import { expect, test } from "@playwright/test";

// Session-171 (WP-2): THE A11Y TWO-GATE — the web-app-foundation §8.3
// "best-in-class add-on" the s170 round named as this rotation's
// candidate, landed as a Playwright battery riding the standing harness
// (the storageState auth, the standalone server, the seeded e2e.db).
//
// THE GATE (two parts, per §8.3):
//   1. STRUCTURAL violations must be ZERO — button-name, link-name,
//      label, list, heading-order, every rule outside the sanctioned
//      set. This is the named-control proof: the round's fixes gave
//      every open-surface SelectTrigger / inert Checkbox / icon-only
//      Button an accessible name (role="combobox" names come from author
//      attributes ONLY — the visible span text is invisible to the name
//      computation; the hidden-sm:inline labels evaporate at phone
//      width; the bare Checkboxes carried sibling-span labels).
//   2. COLOR-CONTRAST + SVG-IMG-ALT nodes must cite the SANCTIONED
//      matchers — the parity palette + the recharts genus, each verified
//      live on the REFERENCE's own DOM this round (it ships the
//      identical families; fixing them would break visual parity or
//      require patching library internals — the drawer precedent
//      runs the other way: nameless controls are the reference's
//      defect, ours name them).
//
// The axe engine rides the DECLARED devDep (package.json: axe-core
// ^4.13.0 — F-171e: the gate must not stand on an undeclared
// transitive).
//
// The 25 registrations are EXPLICIT (one test() per surface × width —
// the Appendix B per-spec census counts source test() calls, and the
// granular names name the failing surface directly).

const AXE_PATH = "node_modules/axe-core/axe.min.js";

type Violation = { id: string; targets: string[] };

// The SANCTIONED register — rule → matcher list, every matcher carrying
// its citation. A flagged node matching NONE of them REDs the gate.
// The match arms are plain SUBSTRING tests (the axe target strings carry
// escaped class selectors like `.bg-white\\/10` — regex-literal escaping
// is a trap here; includes() is unambiguous).
const SANCTIONED: Record<string, Array<{ any: string[]; cite: string }>> = {
  "color-contrast": [
    {
      // the active-nav chip on the navy rail — the reference's own palette
      // (verified on its DOM: `.bg-white/10 > .font-medium` on every page)
      any: ["bg-white\\/10"],
      cite: "the active-nav chip on the navy rail — the reference's own palette",
    },
    {
      // the white-wash family on the navy surfaces (the drawer links, the
      // workspace chip, the landing preview's glass rows + micro-captions)
      any: ["text-white\\/", "bg-white\\/", "text-[10px]", "text-[8px]", "text-[9px]"],
      cite: "the white-wash + micro-caption families on the navy/marketing surfaces — the reference's own palette",
    },
    {
      // the quick-log primaries (activities) — the reference's own palette
      // (verified on its DOM: `.bg-emerald-600`)
      any: ["bg-emerald-600"],
      cite: "the quick-log primaries — the reference's own palette",
    },
    {
      // the accounts badge/border families — the reference's own palette
      any: ["bg-danger", "text-neutral-50", "bg-blue-100", "border-l-red-500", "bg-yellow-50"],
      cite: "the accounts badge/border families — the reference's own palette",
    },
    {
      // the calendar's off-month day numbers (gray-400 on gray-50 — the
      // reference's own `W?"bg-gray-50 text-gray-400"` chain; every
      // calendar-day target rides the `… events"]` aria-label form)
      any: [" events\"]", "text-gray-400", "bg-gray-50"],
      cite: "the calendar's off-month day numbers — the reference's own palette",
    },
    {
      // the muted-gray subtitles on tinted surfaces (the landing preview's
      // grays on gray-100/50 rows — the reference's own illustration)
      any: ["text-gray-500", "text-gray-600", "bg-gray-100", "bg-gray-50", "sm:mt-16", "shadow-xl"],
      cite: "the landing preview's muted grays on tinted rows — the reference's own palette",
    },
    {
      // the pricing tier's "Most popular" pill (brand-on-brand/10 — the
      // reference's own design, verified on its DOM with byte-identical
      // classes: `.self-start … bg-brand/10 text-brand`; the landing's
      // sole self-start usage)
      any: ["self-start"],
      cite: "the pricing \"Most popular\" pill — the reference's own design (byte-identical on its DOM)",
    },
    {
      // the 404's "404" display heading (slate-300 on the slate-50 card —
      // the reference's own designed 404 palette, walk67-decoded on its
      // DOM: the `text-7xl font-light text-slate-300` h1 face). The axe
      // target form is the BARE `h1` selector (the 404's only h1 — the
      // s171 substring-match doctrine); the class arm covers the
      // selector form if a second h1 ever lands on the surface.
      any: ["h1", "text-slate-300"],
      cite: "the 404 display heading — the reference's own designed 404 palette",
    },
    {
      // the inactive segmented-tab triggers (the Radix tab ids) — the
      // muted-ink #737373 inactive state is the reference's own tab design
      any: ["-trigger-"],
      cite: "the inactive segmented-tab muted-ink (#737373) — the reference's own tab design",
    },
  ],
  "svg-img-alt": [
    {
      // recharts 2.15 HARDCODES role="img" on the funnel trapezoid Layers
      // (renderTrapezoidsStatically — no aria seam; adaptEventsOfChild
      // passes event keys only) — the reference's identical rendering
      any: ["recharts-funnel-trapezoid"],
      cite: "recharts hardcodes role=img on the funnel Layers — the reference's identical rendering",
    },
  ],
};

async function scanTwoGate(page: import("@playwright/test").Page, label: string) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(1500);
  await page.addScriptTag({ path: AXE_PATH });
  const violations = await page.evaluate(async () => {
    const axe = (window as unknown as {
      axe: { run: (o: object) => Promise<{ violations: Array<{ id: string; nodes: Array<{ target: string[] }> }> }> };
    }).axe;
    const r = await axe.run({
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    });
    return r.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target.join(" ")),
    }));
  });

  // GATE 1 — structural: every rule OUTSIDE the sanctioned register
  // must be ZERO (button-name is the named-control proof).
  const structural = violations.filter((v: Violation) => !SANCTIONED[v.id]);
  expect(
    structural.map((v: Violation) => `${v.id}: ${v.targets.slice(0, 3).join(" || ")}`),
    `[${label}] STRUCTURAL violations must be zero`,
  ).toEqual([]);

  // GATE 2 — the sanctioned rules: every flagged node must match a
  // sanctioned matcher (a NEW unsanctioned contrast regression REDs here).
  for (const v of violations) {
    const matchers = SANCTIONED[v.id];
    for (const target of v.targets) {
      const sanctioned = matchers.some((m) => m.any.some((a) => target.includes(a)));
      expect(
        sanctioned,
        `[${label}] ${v.id} node "${target}" cites no sanctioned matcher`,
      ).toBe(true);
    }
  }
}

// ---------------------------------------------------------------------------
// The nine CRM pages at desktop (1280×800) — the authed surfaces.
// ---------------------------------------------------------------------------
test.describe("the a11y two-gate: the CRM pages at desktop", () => {
  test("desktop /dashboard — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/dashboard");
    await scanTwoGate(page, "desktop /dashboard");
  });

  test("desktop /accounts — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/accounts");
    await scanTwoGate(page, "desktop /accounts");
  });

  test("desktop /contacts — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/contacts");
    await scanTwoGate(page, "desktop /contacts");
  });

  test("desktop /leads — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/leads");
    await scanTwoGate(page, "desktop /leads");
  });

  test("desktop /calendar — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/calendar");
    await scanTwoGate(page, "desktop /calendar");
  });

  test("desktop /activities — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/activities");
    await scanTwoGate(page, "desktop /activities");
  });

  test("desktop /reports — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/reports");
    await scanTwoGate(page, "desktop /reports");
  });

  test("desktop /settings — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/settings");
    await scanTwoGate(page, "desktop /settings");
  });

  test("desktop /profile — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/profile");
    await scanTwoGate(page, "desktop /profile");
  });
});

// ---------------------------------------------------------------------------
// The nine CRM pages at phone (390×844) — the operator's particular
// emphasis width (the hidden-sm:inline label family lives HERE).
// ---------------------------------------------------------------------------
test.describe("the a11y two-gate: the CRM pages at phone", () => {
  test("phone /dashboard — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dashboard");
    await scanTwoGate(page, "phone /dashboard");
  });

  test("phone /accounts — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/accounts");
    await scanTwoGate(page, "phone /accounts");
  });

  test("phone /contacts — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/contacts");
    await scanTwoGate(page, "phone /contacts");
  });

  test("phone /leads — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/leads");
    await scanTwoGate(page, "phone /leads");
  });

  test("phone /calendar — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/calendar");
    await scanTwoGate(page, "phone /calendar");
  });

  test("phone /activities — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/activities");
    await scanTwoGate(page, "phone /activities");
  });

  test("phone /reports — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/reports");
    await scanTwoGate(page, "phone /reports");
  });

  test("phone /settings — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/settings");
    await scanTwoGate(page, "phone /settings");
  });

  test("phone /profile — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/profile");
    await scanTwoGate(page, "phone /profile");
  });
});

// ---------------------------------------------------------------------------
// The three anon surfaces (login/signup/landing), both widths — the
// logged-out state (no storage state; an authed visit redirects away).
// ---------------------------------------------------------------------------
test.describe("the a11y two-gate: the anon surfaces", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("desktop /login (anon) — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/login");
    await scanTwoGate(page, "desktop /login (anon)");
  });

  test("desktop /signup (anon) — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/signup");
    await scanTwoGate(page, "desktop /signup (anon)");
  });

  test("desktop / (landing, anon) — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await scanTwoGate(page, "desktop / (landing, anon)");
  });

  test("phone /login (anon) — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/login");
    await scanTwoGate(page, "phone /login (anon)");
  });

  test("phone /signup (anon) — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/signup");
    await scanTwoGate(page, "phone /signup (anon)");
  });

  test("phone / (landing, anon) — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await scanTwoGate(page, "phone / (landing, anon)");
  });

  // Session-195 (D-195a2): the 404 surface — the one anon-reachable page
  // the register never adjudicated. The 404 is session-independent by
  // design (D-194a5 — the reference's own auth-first redirect is its SPA
  // platform genus, never mirrored), so the anon context reaches the
  // same designed view. Its display heading rides the reference's own
  // palette (the sanctioned matcher above); every other face passes AA
  // unassisted (slate-800/700/600 on slate-50).
  test("desktop /this-page-does-not-exist (the 404, anon) — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/this-page-does-not-exist");
    await scanTwoGate(page, "desktop /this-page-does-not-exist (the 404, anon)");
  });

  test("phone /this-page-does-not-exist (the 404, anon) — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/this-page-does-not-exist");
    await scanTwoGate(page, "phone /this-page-does-not-exist (the 404, anon)");
  });
});

// ---------------------------------------------------------------------------
// The drawer-OPEN state at phone width — the operator's emphasis: the
// open sheet itself must carry zero structural violations (its links are
// named; the white-wash contrast family is the sanctioned navy palette).
// ---------------------------------------------------------------------------
test.describe("the a11y two-gate: the drawer-open state", () => {
  test("phone /dashboard with the drawer OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.waitForTimeout(600);
    await scanTwoGate(page, "phone /dashboard (drawer OPEN)");
  });
});

// ---------------------------------------------------------------------------
// The dialog-OPEN states (session-172, F-172c) — the closed-by-default
// genus the page scans never reached: a Radix Dialog's content is ABSENT
// from the DOM while closed, so the five CREATE dialogs + the contact
// EDIT dialog get their own open-state walks. Each opens the dialog,
// runs the two-gate, and closes it (the Escape form). The sanctioned
// register rides UNCHANGED: the open-dialog landscape is the same page
// furniture behind the dialog (the active-nav chip + the calendar
// off-month cells — both already sanctioned) plus the clean white
// dialog cards (verified live before the spec landed).
// ---------------------------------------------------------------------------
test.describe("the dialog-open two-gate: the create dialogs", () => {
  test("desktop /leads with the New Lead dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/leads");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "New Lead" }).click();
    await page.waitForTimeout(600);
    await scanTwoGate(page, "/leads (New Lead dialog OPEN)");
    await page.keyboard.press("Escape");
  });

  test("desktop /accounts with the New Account dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/accounts");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "New Account" }).click();
    await page.waitForTimeout(600);
    await scanTwoGate(page, "/accounts (New Account dialog OPEN)");
    await page.keyboard.press("Escape");
  });

  test("desktop /contacts with the New Contact dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/contacts");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "New Contact" }).click();
    await page.waitForTimeout(600);
    await scanTwoGate(page, "/contacts (New Contact dialog OPEN)");
    await page.keyboard.press("Escape");
  });

  test("desktop /calendar with the New Event dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/calendar");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "New Event" }).click();
    await page.waitForTimeout(600);
    await scanTwoGate(page, "/calendar (New Event dialog OPEN)");
    await page.keyboard.press("Escape");
  });

  test("desktop /activities with the Log Call dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/activities");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "Log Call" }).first().click();
    await page.waitForTimeout(600);
    await scanTwoGate(page, "/activities (Log Call dialog OPEN)");
    await page.keyboard.press("Escape");
  });
});

test.describe("the dialog-open two-gate: the contact edit dialog", () => {
  test("desktop /contacts with the Edit Contact dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/contacts");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    // the row ⋮ menu → the Edit item (the W7 entity-edit-dialog walk)
    await page.locator("table tbody button[aria-haspopup='menu']").first().click();
    await page.waitForTimeout(600);
    await page.getByRole("menuitem", { name: /^edit/i }).first().click();
    await page.waitForTimeout(600);
    await scanTwoGate(page, "/contacts (Edit Contact dialog OPEN)");
    await page.keyboard.press("Escape");
  });
});
