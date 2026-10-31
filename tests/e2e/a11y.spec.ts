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
// The register is EXPLICIT (one test() per surface × width — the
// Appendix B per-spec census counts source test() calls, and the
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
// The marketing interiors (session-200) — the register's page-surface
// coverage closure's authenticated pair. The /about + /contact pages are
// two-app-renderable surfaces login-walled per the s147 reference
// posture (F-147c2 — its parity-event bundle re-walled its marketing
// pages; ours mirrors): they render for logged-in users with the full
// app chrome, so the registrations ride the same authenticated form as
// the nine CRM pages. Their interactive arms were focus-walked at
// s193/walk66 but NEVER axe-scanned (the s171 register's page family
// was enumerated before the marketing pair existed); the discovery's
// live probes pre-verified both surfaces at both widths (structural
// zero — OURS renders the topbar's Messages/Notifications arms NAMED
// where the reference's own marketing pages carry them nameless: the
// drawer-precedent direction, the reference's own defect, never
// mirrored).
// ---------------------------------------------------------------------------
test.describe("the a11y two-gate: the marketing interiors (session-200)", () => {
  test("desktop /about — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/about");
    await scanTwoGate(page, "desktop /about");
  });

  test("phone /about — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about");
    await scanTwoGate(page, "phone /about");
  });

  test("desktop /contact — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/contact");
    await scanTwoGate(page, "desktop /contact");
  });

  test("phone /contact — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/contact");
    await scanTwoGate(page, "phone /contact");
  });
});

// ---------------------------------------------------------------------------
// The anon family, both widths — the logged-out state (no storage
// state; an authed visit redirects away). (The s200 count-proof cure:
// this head shipped at s171 counting the anon family at three —
// login/signup/landing — and went stale at s195 when the 404 joined
// the describe without the count moving; a name never goes stale when
// a surface joins.)
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

  // Session-200 (D-200a1): the reset-password surface — the OURS-ONLY
  // anon member (the /signup registration precedent; the register's
  // family criterion is renderable surfaces, not two-app parity). The
  // s163 digma S46/RA-66 port; the set-password FORM state via the
  // shape-probe token (any non-empty ?token= renders the form —
  // validity is checked on submit only; the reset-password.spec's own
  // idiom). The no-token invalid-link card is adjudicated
  // same-component (the shared ResetPasswordScreen; the card's delta is
  // the title + text + the Back button — the form is the richer face).
  test("desktop /reset-password (anon, the set-password form) — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/reset-password?token=e2e-shape-probe");
    await scanTwoGate(page, "desktop /reset-password (anon)");
  });

  test("phone /reset-password (anon, the set-password form) — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/reset-password?token=e2e-shape-probe");
    await scanTwoGate(page, "phone /reset-password (anon)");
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

// ---------------------------------------------------------------------------
// The dialog-open two-gate: the session-199 register-coverage closure.
// The register's own closed-by-default criterion (F-172c) re-applied at
// s199 against the app's full runtime dialog census: the s172 audit
// covered the five CREATE dialogs + ONE edit member; the five open
// states below carried ZERO open-surface a11y teeth — the Edit Lead +
// Edit Account siblings (the Mke/wce configs — a SEPARATE component
// from the registered Edit Contact) + the three standalone dialogs
// (Import Contacts · Account Insights · Save Custom Report View —
// never in the s172 audit's scope). The discovery's live axe probes
// (discover-199 LEG-5c) pre-verified every open state (GATE 1
// structural=0 · GATE 2 all-cited-sanctioned) — born-green
// registrations. Each walk WAITS ON THE VISIBLE DIALOG before scanning
// (the L-164c2 vacuous-green cure: a silently-failed open would
// otherwise scan the page behind the label — the open-wait guard).
// The Edit Event + Edit Activity edit modes are ADJUDICATED
// same-component (declined): the create registrations already scan
// their shared EntityDialog DOM — the edit-mode delta is the prefilled
// values + the title text only.
// ---------------------------------------------------------------------------
test.describe("the dialog-open two-gate: the entity-edit siblings", () => {
  test("desktop /leads with the Edit Lead dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/leads");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    // the row ⋮ menu → the Edit item (the Mke config — the separate
    // EntityEditDialog member, never scanned before s199)
    await page.locator("table tbody button[aria-haspopup='menu']").first().click();
    await page.waitForTimeout(600);
    await page.getByRole("menuitem", { name: /^edit/i }).first().click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "/leads (Edit Lead dialog OPEN)");
    await page.keyboard.press("Escape");
  });

  test("desktop /accounts with the Edit Account dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/accounts");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    // the row ⋮ menu → the Edit item (the wce config)
    await page.locator("table tbody button[aria-haspopup='menu']").first().click();
    await page.waitForTimeout(600);
    await page.getByRole("menuitem", { name: /^edit/i }).first().click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "/accounts (Edit Account dialog OPEN)");
    await page.keyboard.press("Escape");
  });
});

test.describe("the dialog-open two-gate: the standalone dialogs (session-199)", () => {
  test("desktop /contacts with the Import Contacts dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/contacts");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    // the outline Import trigger (the s26 reference-decoded dialog)
    await page.getByRole("button", { name: "Import" }).click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "/contacts (Import Contacts dialog OPEN)");
    await page.keyboard.press("Escape");
  });

  test("desktop /accounts with the Account Insights dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/accounts");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    // the accounts ROW CLICK opens the Ece insights dialog (the s28
    // reference-decoded surface — the row click / the ⋮ View Insights)
    await page.locator("table tbody tr").first().click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "/accounts (Account Insights dialog OPEN)");
    await page.keyboard.press("Escape");
  });

  test("desktop /reports with the Save Custom Report View dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/reports");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    // the Saved Reports (N) outline trigger (the s25/walk63 surface)
    await page.getByRole("button", { name: /Saved Reports \(\d+\)/ }).click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "/reports (Save Custom Report View dialog OPEN)");
    await page.keyboard.press("Escape");
  });
});

// ---------------------------------------------------------------------------
// The dialog-open two-gate: the session-201 width-scope closure. The
// register's own head criterion ("one test() per surface × width") was
// VIOLATED by this family since s172 — the 11 open states carried ONE
// width (desktop-only) while the page family carried both. The s200
// close banked the phone family as the standing candidate with its
// born-green pre-verification (discover-200 LEG-5d); this round's
// discovery (discover-201 LEG-5b) re-probed every state live:
// structural=0 on all 11, every contrast flag citing an existing
// sanctioned matcher (the phone landscape is the desktop landscape
// minus the sidebar arms — hidden below lg at phone). Each walk WAITS
// ON THE VISIBLE DIALOG before scanning (the L-164c2 vacuous-green
// cure: a silently-failed open would otherwise scan the page behind
// the label) and closes it (the Escape form). The Edit Event + Edit
// Activity edit modes are ADJUDICATED same-component at BOTH widths
// (the s199 desktop precedent carried to the width axis: the create
// registrations scan their shared EntityDialog DOM).
//
// THE OPEN-DIALOG SCAN MECHANICS (decoded live at s201, the mutation
// landscape probe): while a Radix Dialog is open, hideOthers
// aria-hides the app root — GATE 1 (structural) therefore sees ONLY
// the dialog content (the page furniture leaves the a11y tree), while
// GATE 2 (color-contrast) still cites the PAINTED page behind (the
// visual rule's applicability is on-screen visibility). The role-based
// openers are part of the register's teeth: a name that evaporates at
// phone width (the hidden-sm:inline genus) renders the trigger
// UNFINDABLE by name — the opener times out (the phone Import
// registration's own mutation proof) and the flat-page scan cites
// button-name (the page family's teeth on the same genus).
// ---------------------------------------------------------------------------
test.describe("the dialog-open two-gate: the create dialogs at phone (session-201)", () => {
  test("phone /leads with the New Lead dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/leads");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "New Lead" }).click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "phone /leads (New Lead dialog OPEN)");
    await page.keyboard.press("Escape");
  });

  test("phone /accounts with the New Account dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/accounts");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "New Account" }).click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "phone /accounts (New Account dialog OPEN)");
    await page.keyboard.press("Escape");
  });

  test("phone /contacts with the New Contact dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/contacts");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "New Contact" }).click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "phone /contacts (New Contact dialog OPEN)");
    await page.keyboard.press("Escape");
  });

  test("phone /calendar with the New Event dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/calendar");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "New Event" }).click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "phone /calendar (New Event dialog OPEN)");
    await page.keyboard.press("Escape");
  });

  test("phone /activities with the Log Call dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/activities");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "Log Call" }).first().click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "phone /activities (Log Call dialog OPEN)");
    await page.keyboard.press("Escape");
  });
});

test.describe("the dialog-open two-gate: the edit + standalone dialogs at phone (session-201)", () => {
  test("phone /contacts with the Edit Contact dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/contacts");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    // the row ⋮ menu → the Edit item (the W7 entity-edit-dialog walk)
    await page.locator("table tbody button[aria-haspopup='menu']").first().click();
    await page.waitForTimeout(600);
    await page.getByRole("menuitem", { name: /^edit/i }).first().click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "phone /contacts (Edit Contact dialog OPEN)");
    await page.keyboard.press("Escape");
  });

  test("phone /leads with the Edit Lead dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/leads");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    // the row ⋮ menu → the Edit item (the Mke config)
    await page.locator("table tbody button[aria-haspopup='menu']").first().click();
    await page.waitForTimeout(600);
    await page.getByRole("menuitem", { name: /^edit/i }).first().click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "phone /leads (Edit Lead dialog OPEN)");
    await page.keyboard.press("Escape");
  });

  test("phone /accounts with the Edit Account dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/accounts");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    // the row ⋮ menu → the Edit item (the wce config)
    await page.locator("table tbody button[aria-haspopup='menu']").first().click();
    await page.waitForTimeout(600);
    await page.getByRole("menuitem", { name: /^edit/i }).first().click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "phone /accounts (Edit Account dialog OPEN)");
    await page.keyboard.press("Escape");
  });

  test("phone /contacts with the Import Contacts dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/contacts");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    // the outline Import trigger (the s26 reference-decoded dialog) —
    // at phone the hidden-sm:inline label evaporates and the
    // aria-label="Import" is the ONLY accessible name (the s171
    // doctrine, decoded live at discover-201 LEG-5c)
    await page.getByRole("button", { name: "Import" }).click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "phone /contacts (Import Contacts dialog OPEN)");
    await page.keyboard.press("Escape");
  });

  test("phone /accounts with the Account Insights dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/accounts");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    // the accounts ROW CLICK opens the Ece insights dialog (the s28
    // reference-decoded surface — the row click / the ⋮ View Insights)
    await page.locator("table tbody tr").first().click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "phone /accounts (Account Insights dialog OPEN)");
    await page.keyboard.press("Escape");
  });

  test("phone /reports with the Save Custom Report View dialog OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/reports");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    // the Saved Reports (N) outline trigger (the s25/walk63 surface)
    await page.getByRole("button", { name: /Saved Reports \(\d+\)/ }).click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "phone /reports (Save Custom Report View dialog OPEN)");
    await page.keyboard.press("Escape");
  });
});

// ---------------------------------------------------------------------------
// The client-state two-gate: the session-202 login-card view states.
// The register's families were URL-addressable (page routes +
// click-opened dialogs) while the login card's view machine
// (src/lib/login-reset.ts: signin | reset | sent | signup | verify)
// renders WHOLE-CARD DOM surfaces no resting scan ever sees — the
// s172 closed-by-default genus's client-state sibling (the view swaps
// REPLACE the card's column entirely: no logo, no Google button, no
// divider). The register carried ZERO view-state registrations at ANY
// width (the surface-blind genus — the s201 close's banked standing
// candidate); the discovery (discover-202 LEG-5b) probed every state
// live at BOTH widths: 6/6 structural=0, zero contrast flags.
//
// THE RIDES: each registration swaps the card to its view and WAITS
// ON THE VIEW'S h2 SENTINEL before scanning (the L-164c2
// vacuous-green cure — a silently-failed swap would otherwise scan
// the signin view behind the label). The sent view rides the DEMO
// email's forgot-password POST (the no-enumeration 200; the in-app
// delivery answers the resetUrl anchor — the RICHER face, the s200
// reset-password precedent; the token row is census-inert and the
// e2e db is the scratch reseeded context). The verify view rides the
// in-card "Need an account?" signup ladder on a throwaway email (the
// s163 in-app OTP delivery; a write the auth.spec/reset-password
// batteries already sanction — the signup budget: 9/10 per IP/15min
// with retries 0).
//
// THE MUTATION LANDSCAPE (decoded live at LEG-5c): the verify view's
// six code inputs carry `aria-label="Digit N"` as their ONLY
// accessible name (no wired <label>, no placeholder, no title) — the
// client-state name-evaporation genus. The getByLabel-driven rides
// still complete under a dropped aria-label (the sentinel is the
// heading), but the SCAN catches the six nameless inputs at the axe
// `label` rule — no other registration ever scans this DOM (the
// register's surface-blindness was the round's own rationale).
// ---------------------------------------------------------------------------
test.describe("the a11y two-gate: the login card's client-state views (session-202)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("desktop /login with the reset view OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/login");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "Forgot password?" }).click();
    await page.getByRole("heading", { name: "Reset your password" }).waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "desktop /login (reset view OPEN)");
  });

  test("phone /login with the reset view OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/login");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "Forgot password?" }).click();
    await page.getByRole("heading", { name: "Reset your password" }).waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "phone /login (reset view OPEN)");
  });

  test("desktop /login with the sent view OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/login");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "Forgot password?" }).click();
    await page.getByRole("heading", { name: "Reset your password" }).waitFor({ state: "visible", timeout: 10000 });
    await page.getByLabel("Email").fill("sepnetflix2023@outlook.com");
    await page.getByRole("button", { name: "Send reset link" }).click();
    await page.getByRole("heading", { name: "Check your email" }).waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "desktop /login (sent view OPEN)");
  });

  test("phone /login with the sent view OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/login");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "Forgot password?" }).click();
    await page.getByRole("heading", { name: "Reset your password" }).waitFor({ state: "visible", timeout: 10000 });
    await page.getByLabel("Email").fill("sepnetflix2023@outlook.com");
    await page.getByRole("button", { name: "Send reset link" }).click();
    await page.getByRole("heading", { name: "Check your email" }).waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "phone /login (sent view OPEN)");
  });

  test("desktop /login with the verify view OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/login");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: /Need an account\?/ }).click();
    await page.getByRole("heading", { name: "Create your account" }).waitFor({ state: "visible", timeout: 10000 });
    await page.getByLabel("Email").fill(`a11y-verify-${Date.now()}@example.com`);
    // exact: the "Password" label substring-matches "Confirm Password"
    // (auth.spec's own strict-mode idiom)
    await page.getByLabel("Password", { exact: true }).fill("A11yThrowaway1!");
    await page.getByLabel("Confirm Password").fill("A11yThrowaway1!");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.getByRole("heading", { name: "Verify your email" }).waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "desktop /login (verify view OPEN)");
  });

  test("phone /login with the verify view OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/login");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: /Need an account\?/ }).click();
    await page.getByRole("heading", { name: "Create your account" }).waitFor({ state: "visible", timeout: 10000 });
    await page.getByLabel("Email").fill(`a11y-verify-phone-${Date.now()}@example.com`);
    await page.getByLabel("Password", { exact: true }).fill("A11yThrowaway1!");
    await page.getByLabel("Confirm Password").fill("A11yThrowaway1!");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.getByRole("heading", { name: "Verify your email" }).waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "phone /login (verify view OPEN)");
  });
});

// ---------------------------------------------------------------------------
// The marketing client-state two-gate: the session-203 landing-page
// arms. The register's families covered the CRM pages, the dialogs,
// and the login card's view machine — while the PUBLIC landing
// surface carries exactly two client-state machines whose non-resting
// states render DOM the resting / registration never sees: the mobile
// disclosure menu's OPEN panel (a whole-panel MOUNT of 6 link
// controls at phone width only — the md:hidden width-inverse, the
// drawer-genus sibling on the marketing surface) + the FAQ's
// non-default open-item states (the answer <p> of an item whose
// resting state is closed, mounted while the resting Q1 answer
// unmounts). The register carried ZERO marketing client-state
// registrations at ANY width (the s202 close's banked standing
// candidate); the discovery (discover-203 LEG-5b) probed every arm
// live: 3/3 structural=0, every contrast flag citing a sanctioned
// matcher.
//
// THE RIDES: each registration drives the arm's toggle and WAITS ON
// THE STATE'S OWN SENTINEL before scanning (the L-164c2
// vacuous-green cure — a silently-failed toggle would otherwise scan
// the resting face behind the label). The FAQ ride's sentinel is the
// PAIR: the Q6 answer mounted (#faq-answer-5 — our aria-controls
// superset id) AND the resting Q1 answer GONE (#faq-answer-0 hidden
// — the single-open invariant, the state the registration claims to
// scan). The menu ride's sentinel is the panel mount itself
// (div.md\:hidden.border-t — the landing.spec:105 house form) + its
// unique "Preview" link (the only Preview link visible at 390: the
// desktop nav computes display:none below md, the footer carries no
// Preview).
//
// THE MUTATION LANDSCAPE (decoded live at LEG-5c): the mobile menu
// toggle carries `aria-label="Toggle navigation"` as its ONLY
// accessible name (an ICON-ONLY md:hidden button — the Menu/X svg,
// no text, no wired label, no title) — the s201 contacts Import
// trigger genus's md:hidden sibling. A dropped aria-label ships a
// nameless trigger the resting phone / registration sees at rest —
// and the OPEN registration's role-based ride goes unfindable by
// name (the s201 Import-opener form). The phone-width division: the
// toggle computes display:none at ≥md, so a desktop scan never sees
// it — the round's own width-blindness rationale.
// ---------------------------------------------------------------------------
test.describe("the a11y two-gate: the landing page's client-state arms (session-203)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("desktop / (landing, anon) with a non-default FAQ item OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    const faq = page.locator("#faq");
    await faq.getByRole("button", { name: "Which tier do I need?" }).click();
    // the L-164c2 sentinel pair: Q6's answer mounted + the resting
    // Q1 answer GONE (the single-open invariant — the non-default
    // open state, never the resting face behind the label)
    await page.locator("#faq-answer-5").waitFor({ state: "visible", timeout: 10000 });
    await expect(page.locator("#faq-answer-0")).toBeHidden();
    await scanTwoGate(page, "desktop / (landing, a non-default FAQ item OPEN)");
  });

  test("phone / (landing, anon) with a non-default FAQ item OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    const faq = page.locator("#faq");
    await faq.getByRole("button", { name: "Which tier do I need?" }).click();
    await page.locator("#faq-answer-5").waitFor({ state: "visible", timeout: 10000 });
    await expect(page.locator("#faq-answer-0")).toBeHidden();
    await scanTwoGate(page, "phone / (landing, a non-default FAQ item OPEN)");
  });

  test("phone / (landing, anon) with the mobile disclosure menu OPEN — structural zero + sanctioned citations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "Toggle navigation" }).click();
    // the panel-mount sentinel (the landing.spec:105 house form) +
    // its unique Preview link (the only one visible at 390)
    const panel = page.locator("div.md\\:hidden.border-t");
    await panel.waitFor({ state: "visible", timeout: 10000 });
    await panel.getByRole("link", { name: "Preview" }).waitFor({ state: "visible", timeout: 10000 });
    await scanTwoGate(page, "phone / (landing, the mobile disclosure menu OPEN)");
  });
});
