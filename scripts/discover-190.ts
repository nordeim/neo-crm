// Session-190 (discovery): THE REPORTS SAVE-CUSTOM-VIEW DIALOG + THE
// DASHBOARD FOLLOW-UP-ROWS CHECKBOX ARMS + THE ACTIVITIES COMPLETED-TAB
// ROW-ACTION BUTTONS probe — the s400 close's named next-rotation
// candidates: "the remaining unwalked interiors at the reference's
// zero-data state (the reports SAVE-CUSTOM-VIEW dialog — the s25-era
// construction, its open faces never walked under ADR-022 · the
// dashboard follow-up-rows checkbox arms — the s27-era construction,
// its interactive faces never walked · the activities Completed-tab's
// row-action buttons — the s109-era mobile-guard construction never
// re-walked at the desktop axis)", plus the standing re-checks (the
// discover-184..189 Edit-family census — the reference's zero-row
// state; the topbar-search dropdown arm gated on the reference's own
// suggestions ever populating). probe:ref STABLE (46bc2d9c, this
// session) kills the fresh-bundle candidate; the registry's latest
// 3.10.1 (verified live) kills the recharts 4.0 gate. This probe
// answers the round-shape questions BEFORE the plan:
//
//   1. THE EDIT-FAMILY REACHABILITY (standing re-check) — the row
//      counts on /contacts, /leads, /accounts + the calendar chips on
//      both apps (the discover-184..189 census, one leg). The data-
//      dependent arms need rows to exist on BOTH apps; rows=0 kills.
//   2. THE REPORTS SAVE-CUSTOM-VIEW DIALOG (first-named) — the s25-era
//      construction: the "Saved Reports (N)" outline button opens the
//      Radix dialog (a CLIENT-side construction + the localStorage
//      `crm_saved_reports` seam — safe to exercise on both apps; the
//      browser context discards it). Leg: open the dialog, census the
//      open faces (the title, the name input + placeholder, the
//      6-column checkbox grid, the Current-Filters box, the footer's
//      Cancel/Save pair + the disabled-until-named Save), then ride a
//      save round-trip + reopen (the L-74c8 state-persistence form).
//   3. THE DASHBOARD FOLLOW-UP-ROWS CHECKBOX ARMS (second-named) — the
//      s27-era construction: the Lead Sources card's [inert Checkbox]
//      rows + the Upcoming Activities rows. DATA-DEPENDENT: the
//      reference's zero-data state renders the containers EMPTY — the
//      leg censuses the row/checkbox counts on BOTH apps to adjudicate.
//   4. THE ACTIVITIES COMPLETED-TAB ROW-ACTION BUTTONS (third-named) —
//      the s109-era construction: the priority-tab rows' ghost
//      "Check as completed" buttons. DATA-DEPENDENT: the Completed tab
//      rides the seeded rows; the leg censuses the tab switch + the
//      row/action counts on BOTH apps to adjudicate.
//   5. THE TOPBAR-SEARCH DROPDOWN (the standing conditional gate) —
//      does the reference's own search populate suggestions NOW? One
//      leg: type a seeded-term, census any listbox/popover/dropdown.
//
// Run: bun scripts/discover-190.ts
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
 * discover-184..189 census, one leg): the entity-page rows + the
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
    const insightsButtons = Array.from(document.querySelectorAll('main button, [role="menuitem"]')).filter((b) =>
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

const face = (el: Element) => {
  const cs = getComputedStyle(el as HTMLElement);
  const r = el.getBoundingClientRect();
  return {
    bg: cs.backgroundColor,
    color: cs.color,
    border: cs.border,
    radius: cs.borderRadius,
    boxShadow: cs.boxShadow.slice(0, 200),
    outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
    font: `${cs.fontSize}/${cs.fontWeight}`,
    box: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`,
    cls: (el.getAttribute("class") ?? "").slice(0, 200),
  };
};

/** Leg 2 — the reports SAVE-CUSTOM-VIEW dialog (the first-named
 * candidate): open the "Saved Reports (N)" outline button, census the
 * open faces on BOTH apps, then ride the save round-trip (the
 * localStorage seam — client-only, context-scoped, never a DB write)
 * + the L-74c8 reopen-state form. */
async function probeSaveReportDialog(
  page: import("@playwright/test").Page,
  base: string,
  label: string,
  w: number,
): Promise<void> {
  await page.goto(`${base}/reports`, { waitUntil: "domcontentloaded" });
  await page.locator("main").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(2800);

  console.log(`\n=== ${label} REPORTS SAVE-CUSTOM-VIEW DIALOG @${w}x*:`);

  const trigger = page.locator('main button:has-text("Saved Reports")').first();
  if (!(await trigger.count())) {
    console.log("  SAVED REPORTS TRIGGER: NOT FOUND — arm unreachable");
    return;
  }
  const triggerText = (await trigger.textContent())?.trim() ?? "";
  const triggerFace = await trigger.evaluate(face).catch(() => null);
  console.log(`  trigger: "${triggerText}" box=${triggerFace?.box} bg=${triggerFace?.bg}\n    border="${triggerFace?.border}" radius=${triggerFace?.radius}\n    cls="${triggerFace?.cls}"`);

  await trigger.click();
  await page.waitForTimeout(1200);

  const census = await page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"]');
    if (!dlg) return null;
    const cs = getComputedStyle(dlg as HTMLElement);
    const r = dlg.getBoundingClientRect();
    const title = dlg.querySelector('[role="dialog"] h2, [role="dialog"] [data-slot="dialog-title"]');
    const input = dlg.querySelector('input[id="reportName"], input[placeholder*="Q1"]') as HTMLInputElement | null;
    const checkboxes = Array.from(dlg.querySelectorAll('[role="checkbox"]'));
    const buttons = Array.from(dlg.querySelectorAll("button")).map((b) => ({
      text: (b.textContent ?? "").trim().slice(0, 40) || "(icon)",
      disabled: (b as HTMLButtonElement).disabled,
    }));
    const summary = Array.from(dlg.querySelectorAll("p")).find((p) => /Current Filters/i.test(p.textContent ?? ""));
    const summaryBox = summary?.closest("div");
    return {
      dlgCls: (dlg.getAttribute("class") ?? "").slice(0, 200),
      dlgBox: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`,
      dlgBg: cs.backgroundColor,
      dlgBorder: cs.border,
      dlgRadius: cs.borderRadius,
      dlgShadow: cs.boxShadow.slice(0, 160),
      title: title?.textContent?.trim() ?? "(none)",
      titleCls: title ? (title.getAttribute("class") ?? "").slice(0, 120) : "",
      input: input
        ? {
            placeholder: input.placeholder,
            value: input.value,
            cls: (input.getAttribute("class") ?? "").slice(0, 160),
          }
        : null,
      checkboxCount: checkboxes.length,
      checkboxLabels: checkboxes.map((c) => {
        const row = c.closest("label, div");
        return (row?.textContent ?? "").trim().slice(0, 30);
      }),
      firstCheckbox: checkboxes[0]
        ? {
            cls: (checkboxes[0].getAttribute("class") ?? "").slice(0, 160),
            aria: checkboxes[0].getAttribute("aria-label") ?? "(none)",
          }
        : null,
      summary: summary ? summary.textContent?.trim().slice(0, 120) ?? "" : "(none)",
      summaryCls: summaryBox ? (summaryBox.getAttribute("class") ?? "").slice(0, 160) : "",
      buttons,
    };
  });
  if (!census) {
    console.log("  DIALOG: NOT FOUND after click");
    return;
  }
  console.log(`  dialog: box=${census.dlgBox} bg=${census.dlgBg}\n    cls="${census.dlgCls}"\n    border="${census.dlgBorder}" radius=${census.dlgRadius}"`);
  console.log(`  title: "${census.title}" cls="${census.titleCls}"`);
  console.log(`  name input: placeholder="${census.input?.placeholder}" cls="${census.input?.cls}"`);
  console.log(`  checkbox grid (${census.checkboxCount}): [${census.checkboxLabels.join(" | ")}]`);
  console.log(`  first checkbox: cls="${census.firstCheckbox?.cls}" aria=${census.firstCheckbox?.aria}`);
  console.log(`  summary: "${census.summary}"\n    summary cls="${census.summaryCls}"`);
  console.log(`  buttons(${census.buttons.length}): [${census.buttons.map((b) => `${b.text}${b.disabled ? " [disabled]" : ""}`).join(" | ")}]`);

  // The REAL Tab focus drive into the name input (the walk54 doctrine
  // pre-check: is the input focus-reachable?) + the disabled-Save gate.
  const input = page.locator('[role="dialog"] input[id="reportName"], [role="dialog"] input[placeholder*="Q1"]').first();
  if (await input.count()) {
    await input.click();
    await input.fill("Discovery Report");
    await page.waitForTimeout(400);
    const saveBtn = page.locator('[role="dialog"] button:has-text("Save Report")').first();
    const saveDisabled = await saveBtn.isDisabled().catch(() => null);
    console.log(`  Save Report disabled-after-type: ${saveDisabled}`);
    const inputFace = await input.evaluate(face).catch(() => null);
    console.log(`  name input face: bg=${inputFace?.bg} border="${inputFace?.border}" box=${inputFace?.box}`);

    // The save round-trip (the localStorage seam — the context discards it)
    await saveBtn.click();
    await page.waitForTimeout(900);
    const dialogGone = (await page.locator('[role="dialog"]').count()) === 0;
    const triggerAfter = await page
      .locator('main button:has-text("Saved Reports")')
      .first()
      .textContent()
      .catch(() => "(n/a)");
    console.log(`  SAVE round-trip: dialog closed=${dialogGone} trigger now "${triggerAfter?.trim()}"`);

    // The L-74c8 reopen form: cancel-then-reopen keeps the typed name?
    // (the s74 decode: the name clears ONLY after a successful save)
    await page.locator('main button:has-text("Saved Reports")').first().click();
    await page.waitForTimeout(900);
    const reopened = await page.evaluate(() => {
      const dlg = document.querySelector('[role="dialog"]');
      const input = dlg?.querySelector('input[id="reportName"], input[placeholder*="Q1"]') as HTMLInputElement | null;
      const savedList = Array.from(dlg?.querySelectorAll("p") ?? []).find((p) => /Saved Reports/i.test(p.textContent ?? ""));
      const items = Array.from(dlg?.querySelectorAll("button") ?? [])
        .filter((b) => /Load/i.test(b.textContent ?? ""))
        .map((b) => (b.textContent ?? "").trim());
      return {
        name: input?.value ?? "(no input)",
        savedLabel: savedList?.textContent?.trim() ?? "(none)",
        loadButtons: items.length,
      };
    });
    console.log(`  REOPEN (post-save): name="${reopened.name}" savedLabel="${reopened.savedLabel}" loadButtons=${reopened.loadButtons}`);
    await page.keyboard.press("Escape").catch(() => undefined);
  } else {
    console.log("  NAME INPUT: NOT FOUND — the Tab-drive leg unreachable");
    await page.keyboard.press("Escape").catch(() => undefined);
  }
}

/** Leg 3 — the dashboard follow-up-rows checkbox arms (the
 * second-named candidate): the Lead Sources card's checkbox rows +
 * the Upcoming Activities rows. DATA-DEPENDENT — the leg censuses the
 * row/checkbox counts on BOTH apps (the reference's zero-data state
 * kills the arm if its containers render EMPTY). */
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
      if (!card) return { rows: -1, checkboxes: 0, emptyText: "(card not found)", firstRow: null as ReturnType<typeof face> | null };
      const rows = Array.from(card.querySelectorAll("div.flex.items-center.justify-between, label, li"));
      const checkboxes = Array.from(card.querySelectorAll('[role="checkbox"], input[type="checkbox"]'));
      const emptyP = Array.from(card.querySelectorAll("p")).find((p) => /no |not yet|empty/i.test(p.textContent ?? ""));
      const firstRow = rows[0] ?? null;
      return {
        rows: rows.length,
        checkboxes: checkboxes.length,
        emptyText: emptyP?.textContent?.trim().slice(0, 60) ?? "",
        firstRow: firstRow ? face(firstRow) : null,
      };
    };
    return { leadSources: censusCard(leadSrc), upcoming: censusCard(upcoming) };
  });
  console.log(
    `  Lead Sources card: rows=${census.leadSources.rows} checkboxes=${census.leadSources.checkboxes} empty="${census.leadSources.emptyText}"`,
  );
  if (census.leadSources.firstRow) {
    console.log(`    first row: box=${census.leadSources.firstRow.box} cls="${census.leadSources.firstRow.cls}"`);
  }
  console.log(
    `  Upcoming Activities card: rows=${census.upcoming.rows} checkboxes=${census.upcoming.checkboxes} empty="${census.upcoming.emptyText}"`,
  );
  if (census.upcoming.firstRow) {
    console.log(`    first row: box=${census.upcoming.firstRow.box} cls="${census.upcoming.firstRow.cls}"`);
  }

  // The first Lead-Sources checkbox's face (if any rows exist)
  if (census.leadSources.checkboxes > 0) {
    const cb = page.locator("main [role='checkbox']").first();
    const cbFace = await cb.evaluate(face).catch(() => null);
    console.log(`  first checkbox face: bg=${cbFace?.bg} border="${cbFace?.border}" radius=${cbFace?.radius} box=${cbFace?.box}`);
  }
}

/** Leg 4 — the activities Completed-tab row-action buttons (the
 * third-named candidate): the priority-tab rows' ghost "Check as
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

  // The tab strip: the "Completed" trigger (the segmented family)
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
    const rows = Array.from(document.querySelectorAll("main .border-b, main [class*='border-b']")).filter(
      (r) => (r.textContent ?? "").trim().length > 0,
    );
    return {
      checkButtons: checkBtns.length,
      firstBtn: checkBtns[0]
        ? {
            aria: checkBtns[0].getAttribute("aria-label") ?? "(none)",
            text: (checkBtns[0].textContent ?? "").trim().slice(0, 40),
          }
        : null,
      emptyText: emptyP?.textContent?.trim().slice(0, 60) ?? "",
      rowCount: rows.length,
    };
  });
  console.log(
    `  Completed tab: checkButtons=${census.checkButtons} rows=${census.rowCount} empty="${census.emptyText}" firstBtn="${census.firstBtn?.text}" (aria=${census.firstBtn?.aria})`,
  );
  if (census.checkButtons > 0) {
    const btn = page
      .locator("main button")
      .filter({ hasText: /Check as completed/i })
      .first();
    const btnFace = await btn.evaluate(face).catch(() => null);
    console.log(`  first action face: bg=${btnFace?.bg} color=${btnFace?.color} box=${btnFace?.box}\n    cls="${btnFace?.cls}"`);
  }
}

/** Leg 5 — the topbar-search dropdown: does typing populate any
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
  const search = page.locator('header input, input[type="search"], input[placeholder*="Search"]').first();
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

async function main() {
  let spawned: ReturnType<typeof spawn> | null = null;
  if (await waitOnUrl(`${OUR_URL}/login`, 3000)) {
    console.log("[discover-190] reusing the dev server on :3000");
  } else {
    const devEnv: NodeJS.ProcessEnv = { ...process.env };
    delete devEnv.DATABASE_URL; // the F-123a1 boot-site guard
    spawned = spawn("bun", ["run", "dev"], { cwd: REPO, env: devEnv, stdio: "ignore", detached: true });
    if (!(await waitOnUrl(`${OUR_URL}/login`, 90000))) process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const state = await preflightPairState(browser);
    console.log("[discover-190] pair state: ready (the s162 guarded form)");
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
      await probeSaveReportDialog(page, base, label, w).catch((e) => console.log(`  [save-report ${label}] ERROR: ${e}`));
      await probeDashboardCheckboxes(page, base, label, w).catch((e) => console.log(`  [dashboard-cb ${label}] ERROR: ${e}`));
      await probeActivitiesCompleted(page, base, label, w).catch((e) => console.log(`  [activities-completed ${label}] ERROR: ${e}`));
      await probeTopbarSearch(page, base, label, w).catch((e) => console.log(`  [topbar-search ${label}] ERROR: ${e}`));
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
  console.error("[discover-190]", e);
  process.exit(1);
});
