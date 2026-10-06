import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  OPP_STAGE_META,
  OPPORTUNITY_STAGES,
  PIPELINE_STAGES,
} from "@/lib/constants";

// Session-31 pins (S31-P1): the Opportunity entity — the reference's SECOND
// deal model, bundle-decoded from index-DZ-xbrIm.js. The reference ships a
// full Opportunity entity (name / account_name STRING / stage / amount /
// probability / close_date / source / owner STRING) with NO create-edit UI
// anywhere (the leads "Convert to Opportunity" item is dead — no onClick;
// no New Opportunity dialog exists). Its data feeds the dashboard, ALL FIVE
// reports tabs, and both insights surfaces. Until this session our clone
// approximated every one of those derivations from the Lead model alone.

function read(rel: string): string | null {
  const p = path.resolve(import.meta.dirname, "..", rel);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

const schema = () => read("prisma/schema.prisma") ?? "";
const types = () => read("src/types/index.ts") ?? "";
const seed = () => read("prisma/seed.ts") ?? "";
const store = () => stripComments(read("src/stores/crm-store.ts") ?? "");
const resetRoute = () => stripComments(read("src/app/api/reset/route.ts") ?? "");
const apiDir = () => read("src/app/api/opportunities/route.ts") ?? "";

describe("session-31: the Opportunity stage vocabulary (the bundle's P + O maps)", () => {
  it("OPPORTUNITY_STAGES is the six-stage vocabulary, raw slugs", () => {
    expect([...OPPORTUNITY_STAGES]).toEqual([
      "prospecting",
      "qualification",
      "proposal",
      "negotiation",
      "closed_won",
      "closed_lost",
    ]);
  });

  it("OPP_STAGE_META carries the P badge tints (the reference's class map)", () => {
    expect(OPP_STAGE_META.prospecting?.badge).toBe("bg-blue-100 text-blue-800");
    expect(OPP_STAGE_META.qualification?.badge).toBe("bg-purple-100 text-purple-800");
    expect(OPP_STAGE_META.proposal?.badge).toBe("bg-yellow-100 text-yellow-800");
    expect(OPP_STAGE_META.negotiation?.badge).toBe("bg-orange-100 text-orange-800");
    expect(OPP_STAGE_META.closed_won?.badge).toBe("bg-green-100 text-green-800");
    expect(OPP_STAGE_META.closed_lost?.badge).toBe("bg-red-100 text-red-800");
  });

  it("OPP_STAGE_META labels title-case with the closed pair's full labels (the reference's lCe select list)", () => {
    expect(OPP_STAGE_META.prospecting?.label).toBe("Prospecting");
    expect(OPP_STAGE_META.qualification?.label).toBe("Qualification");
    expect(OPP_STAGE_META.proposal?.label).toBe("Proposal");
    expect(OPP_STAGE_META.negotiation?.label).toBe("Negotiation");
    // Session-74 (M-74c1): the reference's reports stage select ships
    // "Closed Won"/"Closed Lost" (the lCe list, bundle-decoded) — the
    // s31-era "Won"/"Lost" shorts were the leads-status vocabulary
    // bleeding into the OPP map.
    expect(OPP_STAGE_META.closed_won?.label).toBe("Closed Won");
    expect(OPP_STAGE_META.closed_lost?.label).toBe("Closed Lost");
  });

  it("PIPELINE_STAGES is the OPPORTUNITY open+won vocabulary (the dashboard's 5 stages)", () => {
    // The reference's dashboard chart: ["prospecting","qualification",
    // "proposal","negotiation","closed_won"].map(E => stage label) with VALUE
    // sums — NOT the lead-stage vocabulary our scaffold inferred.
    expect([...PIPELINE_STAGES]).toEqual([
      "prospecting",
      "qualification",
      "proposal",
      "negotiation",
      "closed_won",
    ]);
  });

  it("the s10 merged-list double-report approximation is RETIRED (reportsBucketCounts gone)", () => {
    // The s31 bundle decode disproved the zero-data-inferred interpretation:
    // the reference's 8-slug funnel is a CONCATENATION of the leads'
    // new/contacted/qualified counts + the OPPORTUNITY five-stage counts —
    // new leads are NOT double-reported under "prospecting".
    const src = read("src/lib/constants.ts") ?? "";
    expect(src).not.toMatch(/export function reportsBucketCounts/);
  });
});

describe("session-31: the Opportunity Prisma model + seed + API + store + reset", () => {
  it("the schema carries the model with the reference's field set (strings, not relations)", () => {
    const block = schema().slice(
      schema().indexOf("model Opportunity"),
      schema().indexOf("model Opportunity") + 800,
    );
    expect(block).toMatch(/name\s+String/);
    expect(block).toMatch(/accountName\s+String\?/); // the account NAME string — no relation
    expect(block).toMatch(/stage\s+String\s+@default\("prospecting"\)/);
    expect(block).toMatch(/amount\s+Float\s+@default\(0\)/);
    expect(block).toMatch(/probability\s+Int\?/);
    expect(block).toMatch(/closeDate\s+DateTime\?/);
    expect(block).toMatch(/source\s+String\?/);
    expect(block).toMatch(/owner\s+String\?/); // the owner NAME string — no relation
  });

  it("the client-side Opportunity type carries the serialized shape", () => {
    const block = types().slice(
      types().indexOf("interface Opportunity"),
      types().indexOf("interface Opportunity") + 500,
    );
    expect(block).toMatch(/accountName:\s*string \| null/);
    expect(block).toMatch(/stage:\s*string/);
    expect(block).toMatch(/amount:\s*number/);
    expect(block).toMatch(/probability:\s*number \| null/);
    expect(block).toMatch(/closeDate:\s*string \| null/);
    expect(block).toMatch(/owner:\s*string \| null/);
  });

  it("the seed plants the opportunity dataset (won 337k / lost 92k / open across the four stages)", () => {
    const src = seed();
    expect(src).toMatch(/db\.opportunity\.deleteMany/);
    expect(src).toMatch(/db\.opportunity\.create/);
    // The four won opps: 87k + 145k + 39k + 66k = 337k (the e2e's
    // date-independent All-Time pin rides this sum).
    const wonBlock = src.slice(src.indexOf("oppSeed"));
    expect(wonBlock).toMatch(/87_000/);
    expect(wonBlock).toMatch(/145_000/);
    expect(wonBlock).toMatch(/39_000/);
    expect(wonBlock).toMatch(/66_000/);
    expect(wonBlock).toMatch(/64_000/); // the lost pair 64k + 28k
    expect(wonBlock).toMatch(/28_000/);
  });

  it("the seed plants Opportunity-related activities (the at-risk last-activity join)", () => {
    expect(seed()).toMatch(/relatedType:\s*"Opportunity"/);
  });

  it("GET /api/opportunities exists, session-guarded, createdAt-desc", () => {
    const src = apiDir();
    expect(src).toMatch(/requireSession/);
    expect(src).toMatch(/findMany/);
    expect(src).toMatch(/createdAt:\s*"desc"/);
  });

  it("the store carries the opportunities slice + fetchOpportunities in hydrate", () => {
    const src = store();
    expect(src).toMatch(/opportunities:\s*Opportunity\[\]/);
    expect(src).toMatch(/fetchOpportunities/);
    const hydrateBlock = src.slice(src.indexOf("hydrate:"), src.indexOf("hydrate:") + 700);
    expect(hydrateBlock).toMatch(/fetchOpportunities/);
  });

  it("the reset route wipes opportunities (the reference's confirm message says so)", () => {
    expect(resetRoute()).toMatch(/opportunity\.deleteMany/);
  });
});

describe("session-31: the dashboard KPI derivations (the bundle's Eke memo)", () => {
  const route = () => stripComments(read("src/app/api/dashboard/route.ts") ?? "");

  it("the KPI block hardcodes salesTarget 0 + targetProgress 0 (the reference's V=0 quirk)", () => {
    const src = route();
    const kpiBlock = src.slice(src.indexOf("const salesTarget"), src.indexOf("const salesTarget") + 300);
    expect(kpiBlock).toMatch(/salesTarget\s*=\s*0/);
    const progBlock = src.slice(src.indexOf("salesTargetProgress"), src.indexOf("salesTargetProgress") + 200);
    expect(progBlock).toMatch(/=\s*0/);
  });

  it("dealsClosedValue + revenueThisMonth derive from WON OPPORTUNITIES (updated_date month)", () => {
    const src = route();
    expect(src).toMatch(/db\.opportunity\.findMany/);
    const wonBlock = src.slice(src.indexOf("const wonOpps"), src.indexOf("const wonOpps") + 400);
    expect(wonBlock).toMatch(/closed_won/);
  });

  it("avgSalesCycle is the average AGE of won leads (now − created, per-lead floored)", () => {
    const src = route();
    const block = src.slice(src.indexOf("avgSalesCycleDays"), src.indexOf("avgSalesCycleDays") + 600);
    expect(block).toMatch(/createdAt/);
    expect(block).not.toMatch(/closedAt/);
  });

  it("the revenue chart window is the FIXED Nov..May labels (the reference's hardcoded quirk)", () => {
    const src = route();
    expect(src).toMatch(/"Nov",\s*"Dec",\s*"Jan",\s*"Feb",\s*"Mar",\s*"Apr",\s*"May"/);
  });

  it("the pipeline chart + topReps + recentDeals derive from opportunities", () => {
    const src = route();
    const pipelineBlock = src.slice(src.indexOf("const pipeline"), src.indexOf("const pipeline") + 400);
    expect(pipelineBlock).toMatch(/OPPORTUNITY_STAGES|PIPELINE_STAGES/);
    const topBlock = src.slice(src.indexOf("const repsMap"), src.indexOf("const repsMap") + 700);
    expect(topBlock).toMatch(/wonOpps/);
    const recentBlock = src.slice(src.indexOf("const recentDeals"), src.indexOf("const recentDeals") + 400);
    expect(recentBlock).toMatch(/opportunities/);
    expect(recentBlock).not.toMatch(/leads/);
  });
});

describe("session-31: the reports derivations (the five tab components)", () => {
  const route = () => stripComments(read("src/app/api/reports/route.ts") ?? "");

  it("the route loads opportunities and filters them by the period/stage/owner/status model", () => {
    const src = route();
    expect(src).toMatch(/db\.opportunity\.findMany/);
    const filterBlock = src.slice(src.indexOf("const oppWhere"), src.indexOf("const oppWhere") + 500);
    expect(filterBlock).toMatch(/createdAt/);
    expect(filterBlock).toMatch(/stage/);
    expect(filterBlock).toMatch(/owner/);
  });

  it("the KPI row: openLeads = new+contacted ONLY; won/lost/conversion from OPPS", () => {
    const src = route();
    const openBlock = src.slice(src.indexOf("openLeads"), src.indexOf("openLeads") + 400);
    expect(openBlock).toMatch(/"new"/);
    expect(openBlock).toMatch(/"contacted"/);
    expect(openBlock).not.toMatch(/"qualified"/);
    expect(src).toMatch(/wonOpps/);
    expect(src).toMatch(/lostOpps/);
  });

  it("the 8-slug funnel rides the pipelineStageCounts SPLIT (leads + opps)", () => {
    expect(route()).toMatch(/pipelineStageCounts/);
  });

  it("forecast by probability rides the OPP probability bands (no stage-weight proxy)", () => {
    const src = route();
    const block = src.slice(src.indexOf("forecastByProbability"), src.indexOf("forecastByProbability") + 500);
    expect(block).toMatch(/probability/);
    expect(src).not.toMatch(/weightFor/);
  });

  it("the aging pipeline + deals-at-risk ride the new seams (createdAt age + last activity)", () => {
    expect(route()).toMatch(/agingCounts/);
    expect(route()).toMatch(/dealsAtRiskRows|atRisk/);
  });

  it("account health's lost rule joins closed_lost OPPS by account name", () => {
    const src = route();
    const block = src.slice(src.indexOf("lostOppAccounts"), src.indexOf("lostOppAccounts") + 400);
    expect(block).toMatch(/accountName/);
  });
});
