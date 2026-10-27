// Session-191 (discovery): THE THREE UNWALKED CREATE DIALOGS probe — the
// s402 close's named candidates are all CONDITIONAL (the topbar-search
// dropdown the day the reference's own suggestions populate · the
// Insights + Edit-family dialogs the day the reference carries rows
// again · the dashboard follow-up-rows checkbox arms + the activities
// Completed-tab row actions — the data-dependent candidates stay
// suspended) plus the standing conditional gates (the fresh-bundle
// re-derivation the day probe:ref trips · the recharts 4.0 gate when
// 4.0 ships). probe:ref STABLE (46bc2d9c, this session) kills the
// fresh-bundle candidate; the registry's latest 3.10.1 (verified live)
// kills the recharts 4.0 gate. This probe answers the round-shape
// questions BEFORE the plan:
//
//   1. THE EDIT-FAMILY REACHABILITY (standing re-check) — the row
//      counts on /contacts, /leads, /accounts + the calendar chips on
//      both apps (the discover-184..190 census, one leg). The data-
//      dependent arms need rows to exist on BOTH apps; rows=0 kills.
//   2. THE TOPBAR-SEARCH DROPDOWN (the standing conditional gate) —
//      does the reference's own search populate suggestions NOW? One
//      leg: type a seeded-term, census any listbox/popover/dropdown.
//   3. THE DASHBOARD FOLLOW-UP-ROWS CHECKBOX ARMS (the suspended
//      candidate) — the reference's zero-data state re-check.
//   4. THE ACTIVITIES COMPLETED-TAB ROW-ACTION BUTTONS (the suspended
//      candidate) — the empty-panel re-check.
//   5. THE NEW-CONTACT CREATE DIALOG (the NEW candidate — genuinely
//      unwalked two-app: the a11y dialog-open family pins OURS only;
//      walk54 froze the family's CHROME carriers as source pins; the
//      Lead + Log-Activity OPEN interiors were walked [walk54/58] but
//      NEVER the Contact's — the s30-era photo-upload + type=tel +
//      Related-To select construction). DATA-INDEPENDENT: the dialog
//      opens at zero data on both apps.
//   6. THE NEW-ACCOUNT CREATE DIALOG (the NEW candidate — the
//      s15-era 8-field grid + the tier/industry arms, never walked
//      two-app).
//   7. THE NEW-EVENT CREATE DIALOG (the NEW candidate — the WIDE
//      family + the date/time pair + the three selects + the blue
//      submit, never walked two-app).
//
// Run: bun scripts/discover-191.ts
// (reuses the dev server on :3000 — the walk57/58 boot-site form; the
//  reference rides the sweep-state storageState pair, the s162 doctrine.)
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

import { preflightPairState } from "./sweep-state";

const REPO = (() => {
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const root = resolve(here, "..");
    if (existsSync(join(root, "package.json"))) return root;
  } catch {
    /* fall through to the cwd */
  }
  return process.cwd();
})();
const OUR_URL = "http://localhost:3000";
const REF_URL = process.env.REF_URL ?? "https://neo-crm-8ab2c17c.base44.app";

async function waitOnUrl(url: string, ms: number): Promise<boolean> {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(url, { redirect: "follow" });
      if (r.ok) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

/** Leg 1 — the standing Edit-family reachability re-check (the
 * discover-184..190 census, one leg): the entity-page rows + the
 * calendar chips. The reference's rows name which row-borne dialogs
 * and row-action arms can open TWO-APP at all. */
async function censusRows(page: import("@playwright/test").Page, url: string, label: string, w: number): Promise<void> {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2500);
  const census = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("main table tbody tr")).filter(
      (tr) => (tr.textContent ?? "").trim().length > 0,
    );
    const rowMenuButtons = Array.from(document.querySelectorAll('main button[aria-haspopup="true"], main button[aria-haspopup="menu"]'));
    const insightsButtons = Array.from(document.querySelectorAll("main button, [role=\"menuitem\"]")).filter((b) =>
      /view insights|insights/i.test(b.textContent ?? ""),
    );
    return {
      tableRows: rows.length,
      rowMenuCount: rowMenuButtons.length,
      insightsTriggers: insightsButtons.length,
    };
  });
  console.log(`  [${label}@${w}] ${new URL(url).pathname}: rows=${census.tableRows} rowMenus=${census.rowMenuCount} insightsTriggers=${census.insightsTriggers}`);
}

async function censusCalendar(page: import("@playwright/test").Page, base: string, label: string, w: number): Promise<void> {
  await page.goto(`${base}/calendar`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2500);
  const census = await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('main [class*="cursor-pointer"][class*="truncate"], main button[class*="text-xs"]')).filter((el) => (el.textContent ?? "").includes(":"));
    return { chipCount: chips.length };
  });
  console.log(`  [${label}@${w}] calendar chips: ${census.chipCount}`);
}

/** Leg 2 — the topbar-search dropdown: does typing populate any
 * suggestion surface on either app? (the standing conditional gate.) */
async function probeTopbarSearch(
  page: import("@playwright/test").Page,
  base: string,
  label: string,
  w: number,
): Promise<void> {
  await page.goto(`${base}/dashboard`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2200);
  const search = page.locator("header input, input[type=\"search\"], input[placeholder*=\"Search\"]").first();
  if (!(await search.count())) {
    console.log(`\n=== ${label} TOPBAR SEARCH @${w}x*: INPUT NOT FOUND`);
    return;
  }
  const ph = await search.getAttribute("placeholder");
  await search.click();
  await search.fill("Acme");
  await page.waitForTimeout(1500);
  const census = await page.evaluate(() => {
    const pop = Array.from(document.querySelectorAll('[role="listbox"], [role="dialog"], [data-radix-popper-content-wrapper], [class*="absolute"] [class*="z-50"]'));
    const visible = pop.filter((p) => {
      const r = p.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    return { popCount: visible.length, texts: visible.map((p) => (p.textContent ?? "").trim().slice(0, 80)) };
  });
  console.log(`\n=== ${label} TOPBAR SEARCH @${w}x*: placeholder="${ph}" populated=${census.popCount}`);
  for (const t of census.texts) console.log(`    pop text: "${t}"`);
  await page.keyboard.press("Escape").catch(() => undefined);
}

/** Leg 3 — the dashboard follow-up-rows checkbox arms (the suspended
 * candidate): the Lead Sources card's checkbox rows + the Upcoming
 * Activities rows. DATA-DEPENDENT — the leg censuses the row/checkbox
 * counts on BOTH apps (the reference's zero-data state kills the arm
 * if its containers render EMPTY). */
async function probeDashboardCheckboxes(
  page: import("@playwright/test").Page,
  base: string,
  label: string,
  w: number,
): Promise<void> {
  await page.goto(`${base}/dashboard`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2800);

  console.log(`\n=== ${label} DASHBOARD FOLLOW-UP CHECKBOX ARMS @${w}x*:`);

  const census = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll("main h3, main [data-slot='card-title'], main h2")).map((h) => {
      const card = h.closest("div.rounded-xl, div.rounded-lg, div.border") ?? h.parentElement?.parentElement?.parentElement;
      return { title: (h.textContent ?? "").trim().slice(0, 40), card };
    });
    const findCard = (re: RegExp) => {
      const hit = cards.find((c) => re.test(c.title));
      return hit?.card ?? null;
    };
    const leadSrc = findCard(/Lead Sources/i);
    const upcoming = findCard(/Upcoming Activities/i);
    const censusCard = (card: Element | null) => {
      if (!card) return { rows: -1, checkboxes: 0, emptyText: "(card not found)" };
      const rows = Array.from(card.querySelectorAll("div.flex.items-center.justify-between, label, li"));
      const checkboxes = Array.from(card.querySelectorAll('[role="checkbox"], input[type="checkbox"]'));
      const emptyP = Array.from(card.querySelectorAll("p")).find((p) => /no |not yet|empty/i.test(p.textContent ?? ""));
      return {
        rows: rows.length,
        checkboxes: checkboxes.length,
        emptyText: emptyP?.textContent?.trim().slice(0, 60) ?? "",
      };
    };
    return { leadSources: censusCard(leadSrc), upcoming: censusCard(upcoming) };
  });
  console.log(
    `  Lead Sources card: rows=${census.leadSources.rows} checkboxes=${census.leadSources.checkboxes} empty="${census.leadSources.emptyText}"`,
  );
  console.log(
    `  Upcoming Activities card: rows=${census.upcoming.rows} checkboxes=${census.upcoming.checkboxes} empty="${census.upcoming.emptyText}"`,
  );
}

/** Leg 4 — the activities Completed-tab row-action buttons (the
 * suspended candidate): the priority-tab rows' ghost "Check as
 * completed" buttons (the s109-era mobile-guard construction).
 * DATA-DEPENDENT — the leg switches to the Completed tab + censuses
 * the rows/action counts on BOTH apps. */
async function probeActivitiesCompleted(
  page: import("@playwright/test").Page,
  base: string,
  label: string,
  w: number,
): Promise<void> {
  await page.goto(`${base}/activities`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2800);

  console.log(`\n=== ${label} ACTIVITIES COMPLETED-TAB ROW ACTIONS @${w}x*:`);

  const completedTab = page.locator('main button[role="tab"]:has-text("Completed"), main [role="tab"]:has-text("Completed")').first();
  if (await completedTab.count()) {
    await completedTab.click();
    await page.waitForTimeout(1000);
  } else {
    console.log("  COMPLETED TAB: NOT FOUND");
    return;
  }

  const census = await page.evaluate(() => {
    const checkBtns = Array.from(document.querySelectorAll("main button")).filter((b) =>
      /check as completed|mark as scheduled/i.test((b.textContent ?? "") + (b.getAttribute("aria-label") ?? "")),
    );
    const emptyP = Array.from(document.querySelectorAll("main p, main div")).find((el) =>
      /no completed activities/i.test(el.textContent ?? ""),
    );
    return {
      checkButtons: checkBtns.length,
      emptyText: emptyP?.textContent?.trim().slice(0, 60) ?? "",
    };
  });
  console.log(
    `  Completed tab: checkButtons=${census.checkButtons} empty="${census.emptyText}"`,
  );
}

/** Legs 5-7 — THE CREATE-DIALOG CENSUS (the NEW candidates): open the
 * create dialog via its page trigger, census the OPEN interior at the
 * discovery level (the geometry + the title + the labeled-input
 * vocabulary + the select triggers + the construction specials + the
 * footer pair + the mount focus), then Escape. The submits are NEVER
 * fired on either app (the destructive-arm discipline). */
async function probeCreateDialog(
  page: import("@playwright/test").Page,
  base: string,
  label: string,
  w: number,
  cfg: { path: string; trigger: string; title: string },
): Promise<void> {
  await page.goto(`${base}${cfg.path}`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2800);

  console.log(`\n=== ${label} ${cfg.trigger.toUpperCase()} CREATE DIALOG @${w}x*:`);

  const trigger = page.locator(`main button:has-text("${cfg.trigger}")`).first();
  if (!(await trigger.count())) {
    console.log(`  TRIGGER "${cfg.trigger}": NOT FOUND — arm unreachable`);
    return;
  }
  const triggerText = (await trigger.textContent())?.trim() ?? "";
  const tFace = await trigger
    .evaluate((el) => {
      const cs = getComputedStyle(el as HTMLElement);
      const r = el.getBoundingClientRect();
      return {
        bg: cs.backgroundColor,
        color: cs.color,
        radius: cs.borderRadius,
        box: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`,
        cls: (el.getAttribute("class") ?? "").slice(0, 160),
      };
    })
    .catch(() => null);
  console.log(`  trigger: "${triggerText}" box=${tFace?.box} bg=${tFace?.bg} color=${tFace?.color} radius=${tFace?.radius}`);
  console.log(`    cls="${tFace?.cls}"`);

  await trigger.click();
  await page.waitForTimeout(1200);

  const census = await page.evaluate((expectedTitle: string) => {
    const dlg = document.querySelector('[role="dialog"]');
    if (!dlg) return null;
    const cs = getComputedStyle(dlg as HTMLElement);
    const r = dlg.getBoundingClientRect();
    const title = dlg.querySelector('h2, [data-slot="dialog-title"]');
    // the labeled-input vocabulary: label text -> input placeholder/type
    const fields = Array.from(dlg.querySelectorAll("label")).map((l) => {
      const input = (l.getAttribute("for") ? dlg.querySelector(`#${l.getAttribute("for")}`) : null) ?? l.querySelector("input, textarea, button[role=\"combobox\"]");
      const tag = input ? input.tagName.toLowerCase() : "(none)";
      const type = input && (input as HTMLInputElement).type ? (input as HTMLInputElement).type : "";
      const ph = input && (input as HTMLInputElement).placeholder ? (input as HTMLInputElement).placeholder : "";
      return `${(l.textContent ?? "").trim().slice(0, 24)}<${tag}${type ? ":" + type : ""}>${ph ? ":" + ph.slice(0, 24) : ""}`;
    });
    const comboboxes = Array.from(dlg.querySelectorAll('button[role="combobox"]')).map((c) => ({
      text: (c.textContent ?? "").trim().slice(0, 30),
      aria: c.getAttribute("aria-label") ?? "(none)",
    }));
    const fileInputs = Array.from(dlg.querySelectorAll('input[type="file"]')).map((f) => ({
      accept: f.getAttribute("accept") ?? "(none)",
      tabIndex: f.getAttribute("tabIndex") ?? "(none)",
      cls: (f.getAttribute("class") ?? "").slice(0, 60),
    }));
    const telInputs = Array.from(dlg.querySelectorAll('input[type="tel"]')).map((t) => ({
      id: t.id ?? "(none)",
      ph: (t as HTMLInputElement).placeholder ?? "(none)",
    }));
    const dateInputs = Array.from(dlg.querySelectorAll('input[type="date"], input[type="datetime-local"], input[type="time"]')).map((d) => ({
      type: (d as HTMLInputElement).type,
      id: d.id ?? "(none)",
    }));
    const buttons = Array.from(dlg.querySelectorAll("button")).map((b) => ({
      text: (b.textContent ?? "").trim().slice(0, 40) || "(icon)",
      disabled: (b as HTMLButtonElement).disabled,
    }));
    const active = document.activeElement;
    return {
      dlgCls: (dlg.getAttribute("class") ?? "").slice(0, 200),
      dlgBox: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`,
      dlgBg: cs.backgroundColor,
      dlgBorder: cs.border,
      dlgRadius: cs.borderRadius,
      title: title?.textContent?.trim() ?? "(none)",
      titleMatch: (title?.textContent ?? "").trim() === expectedTitle,
      fields,
      comboboxes,
      fileInputs,
      telInputs,
      dateInputs,
      buttons,
      mountFocus: active ? `${active.tagName.toLowerCase()}${active.id ? "#" + active.id : ""}${active.getAttribute("placeholder") ? "[" + active.getAttribute("placeholder")?.slice(0, 20) + "]" : ""}` : "(none)",
    };
  }, cfg.title);
  if (!census) {
    console.log("  DIALOG: NOT FOUND after click");
    return;
  }
  console.log(`  dialog: box=${census.dlgBox} bg=${census.dlgBg} radius=${census.dlgRadius}`);
  console.log(`    border="${census.dlgBorder}"`);
  console.log(`    cls="${census.dlgCls}"`);
  console.log(`  title: "${census.title}" (match=${census.titleMatch})`);
  console.log(`  fields(${census.fields.length}): [${census.fields.join(" | ")}]`);
  console.log(`  comboboxes(${census.comboboxes.length}): [${census.comboboxes.map((c) => `${c.text}(aria=${c.aria})`).join(" | ")}]`);
  for (const f of census.fileInputs) console.log(`  fileInput: accept="${f.accept}" tabIndex=${f.tabIndex} cls="${f.cls}"`);
  for (const t of census.telInputs) console.log(`  telInput: id=${t.id} ph="${t.ph}"`);
  for (const d of census.dateInputs) console.log(`  dateInput: type=${d.type} id=${d.id}`);
  console.log(`  buttons(${census.buttons.length}): [${census.buttons.map((b) => `${b.text}${b.disabled ? " [disabled]" : ""}`).join(" | ")}]`);
  console.log(`  mountFocus: ${census.mountFocus}`);
  await page.keyboard.press("Escape").catch(() => undefined);
  await page.waitForTimeout(400);
}

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[discover-191] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const state = await preflightPairState(browser);
    console.log("[discover-191] pair state: ready (the s162 guarded form)");
    const w = 1440;
    for (const [label, base] of [
      ["OURS", OUR_URL],
      ["REF ", REF_URL],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, storageState: state });
      const page = await ctx.newPage();
      console.log(`\n########## ${label} @${w}x900 ##########`);
      for (const p of ["/contacts", "/leads", "/accounts"]) {
        await censusRows(page, `${base}${p}`, label, w).catch((e) => console.log(`  [${p} ${label}] ERROR: ${e}`));
      }
      await censusCalendar(page, base, label, w).catch((e) => console.log(`  [calendar ${label}] ERROR: ${e}`));
      await probeTopbarSearch(page, base, label, w).catch((e) => console.log(`  [topbar-search ${label}] ERROR: ${e}`));
      await probeDashboardCheckboxes(page, base, label, w).catch((e) => console.log(`  [dashboard-cb ${label}] ERROR: ${e}`));
      await probeActivitiesCompleted(page, base, label, w).catch((e) => console.log(`  [activities-completed ${label}] ERROR: ${e}`));
      await probeCreateDialog(page, base, label, w, { path: "/contacts", trigger: "New Contact", title: "Create New Contact" }).catch((e) => console.log(`  [new-contact ${label}] ERROR: ${e}`));
      await probeCreateDialog(page, base, label, w, { path: "/accounts", trigger: "New Account", title: "Create New Account" }).catch((e) => console.log(`  [new-account ${label}] ERROR: ${e}`));
      await probeCreateDialog(page, base, label, w, { path: "/calendar", trigger: "New Event", title: "New Event" }).catch((e) => console.log(`  [new-event ${label}] ERROR: ${e}`));
      await ctx.close();
    }
  } finally {
    await browser.close().catch(() => undefined);
    if (spawned?.pid) {
      try {
        process.kill(-spawned.pid, "SIGTERM");
      } catch {
        /* already gone */
      }
    }
  }
}

main().catch((e) => {
  console.error("[discover-191]", e);
  process.exit(1);
});
