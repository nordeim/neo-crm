// Seed: NEO CRM demo workspace.
// Idempotent: clears domain tables, then inserts the canonical demo data.
// Run: bun prisma/seed.ts  (or: bun run db:seed)
//
// Demo login (mirrors the reference app): sepnetflix2023@outlook.com / $Abcd1234

import { PrismaClient, type Account, type Contact } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";
import { runtimeDatabaseUrl } from "../src/lib/db-path";

// Explicit datasource URL: never let the Prisma engine (or bun's .env
// absolutization) pick the database location — the shared resolver pins
// every consumer to <repo>/db/<name> (see src/lib/db-path.ts).
const db = new PrismaClient({
  datasources: { db: { url: runtimeDatabaseUrl() } },
});

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function d(offsetDays: number, hour = 10, minute = 0): Date {
  const x = new Date();
  x.setDate(x.getDate() + offsetDays);
  x.setHours(hour, minute, 0, 0);
  return x;
}

function iso(offsetDays: number, hour = 10, minute = 0): Date {
  return d(offsetDays, hour, minute);
}

async function main() {
  // Idempotency: wipe domain data, keep schema.
  await db.savedReport.deleteMany();
  await db.activity.deleteMany();
  await db.event.deleteMany();
  await db.lead.deleteMany();
  await db.contact.deleteMany();
  await db.account.deleteMany();
  await db.user.deleteMany();
  await db.setting.deleteMany();

  // ---- users (sales team) ---------------------------------------------------
  const [demo, sara, omar, lena] = await Promise.all([
    db.user.create({
      data: {
        email: "sepnetflix2023@outlook.com",
        name: "sepnetflix2023",
        passwordHash: hashPassword("$Abcd1234"),
        avatarColor: "#e5e7eb", // light grey + dark "S" — mirrors the reference avatar
        role: "user", // matches the reference account's role display
      },
    }),
    db.user.create({
      data: {
        email: "sara.chen@neo-crm.app",
        name: "Sara Chen",
        passwordHash: hashPassword("Demo1234!"),
        avatarColor: "#0891b2",
      },
    }),
    db.user.create({
      data: {
        email: "omar.haddad@neo-crm.app",
        name: "Omar Haddad",
        passwordHash: hashPassword("Demo1234!"),
        avatarColor: "#7c3aed",
      },
    }),
    db.user.create({
      data: {
        email: "lena.fischer@neo-crm.app",
        name: "Lena Fischer",
        passwordHash: hashPassword("Demo1234!"),
        avatarColor: "#059669",
      },
    }),
  ]);

  const owners = [demo, sara, omar, lena];
  const pick = (i: number) => owners[i % owners.length];

  // ---- accounts --------------------------------------------------------------
  const accountSeed = [
    { name: "Emirates Global Trading", industry: "Logistics", revenue: 12_500_000, employees: 340, tier: "A", isKey: true, status: "active", email: "contact@egt.ae", website: "https://egt.ae", health: "Healthy" },
    { name: "Gulf Tech Solutions", industry: "Technology", revenue: 4_800_000, employees: 120, tier: "A", isKey: true, status: "active", email: "hello@gulftech.io", website: "https://gulftech.io", health: "Healthy" },
    { name: "Al Noor Manufacturing", industry: "Manufacturing", revenue: 8_200_000, employees: 260, tier: "B", isKey: false, status: "active", email: "info@alnoor-mfg.com", health: "At Risk" },
    { name: "Cedar Retail Group", industry: "Retail", revenue: 2_100_000, employees: 85, tier: "B", isKey: false, status: "active", email: "team@cedarretail.com", health: "Needs Attention" },
    { name: "Meridian Financial", industry: "Finance", revenue: 15_900_000, employees: 410, tier: "A", isKey: true, status: "active", email: "sales@meridianfin.com", health: "Healthy" },
    { name: "Oasis Healthcare", industry: "Healthcare", revenue: 6_400_000, employees: 190, tier: "B", isKey: false, status: "active", email: "procurement@oasishealth.ae", health: "Healthy" },
    { name: "Northwind Energy", industry: "Energy", revenue: 22_000_000, employees: 520, tier: "A", isKey: true, status: "active", email: "vendors@northwind.energy", health: "At Risk" },
    { name: "Brightline Education", industry: "Education", revenue: 900_000, employees: 45, tier: "C", isKey: false, status: "inactive", email: "admin@brightline.edu", health: "Needs Attention" },
    { name: "Sahara Logistics", industry: "Logistics", revenue: 3_300_000, employees: 110, tier: "C", isKey: false, status: "churned", email: "ops@saharalog.com", health: "At Risk" },
    { name: "Falcon Analytics", industry: "Technology", revenue: 1_400_000, employees: 32, tier: "B", isKey: false, status: "active", email: "hi@falconanalytics.ai", health: "Healthy" },
  ];

  const accounts: Account[] = [];
  for (let i = 0; i < accountSeed.length; i += 1) {
    const a = accountSeed[i]!;
    accounts.push(
      await db.account.create({
        data: {
          name: a.name,
          industry: a.industry,
          annualRevenue: a.revenue,
          employees: a.employees,
          tier: a.tier,
          isKey: a.isKey,
          status: a.status,
          // Session-26 (S26-P5): the reference's three-state vocabulary.
          health: a.health,
          email: a.email,
          website: a.website ?? null,
          phone: `+971 4 ${200 + i} ${4000 + i * 7}`,
          ownerId: pick(i).id,
          lastActivityAt: d(-((i * 9) % 60) - 1),
        },
      }),
    );
  }

  // ---- contacts ---------------------------------------------------------------
  // Session-5: sources follow the reference's dialog vocabularies — leads
  // use Call/Email/Website/Partner; contacts use the five "How did you
  // meet?" emoji options. Old working values map onto the new lists.
  const LEAD_SOURCE_MAP: Record<string, string> = {
    Referral: "Partner",
    Event: "Partner",
    "Social Media": "Partner",
    Advertisement: "Partner",
    Partner: "Partner",
    Phone: "Call",
    "Cold Call": "Call",
    Call: "Call",
    Website: "Website",
    Email: "Email",
  };
  const CONTACT_SOURCE_MAP: Record<string, string> = {
    Email: "\u2709\ufe0f Email",
    Phone: "\ud83d\udcde Phone Call",
    "Cold Call": "\ud83d\udcde Phone Call",
    Website: "\ud83c\udf10 Website",
    Referral: "\ud83e\udd1d Partner Referral",
    Partner: "\ud83e\udd1d Partner Referral",
    Event: "\ud83d\udc65 Personal Referral",
    "Social Media": "\ud83d\udc65 Personal Referral",
    Advertisement: "\ud83d\udc65 Personal Referral",
  };

  const contactSeed = [
    { name: "Khalid Al Mansoori", position: "Chief Procurement Officer", priority: "hot", company: "Emirates Global Trading", source: "Referral" },
    { name: "Priya Raghavan", position: "IT Director", priority: "hot", company: "Gulf Tech Solutions", source: "Event" },
    { name: "Yousef Haddadi", position: "Plant Manager", priority: "warm", company: "Al Noor Manufacturing", source: "Cold Call" },
    { name: "Marie Dubois", position: "Head of Retail Ops", priority: "warm", company: "Cedar Retail Group", source: "Website" },
    { name: "James Whitfield", position: "CFO", priority: "hot", company: "Meridian Financial", source: "Referral" },
    { name: "Dr. Amina Rashid", position: "Medical Director", priority: "warm", company: "Oasis Healthcare", source: "Email" },
    { name: "Viktor Petrov", position: "VP Operations", priority: "cold", company: "Northwind Energy", source: "Event" },
    { name: "Sarah Thompson", position: "Principal", priority: "cold", company: "Brightline Education", source: "Social Media" },
    { name: "Hassan Al Farsi", position: "Fleet Manager", priority: "cold", company: "Sahara Logistics", source: "Phone" },
    { name: "Elena Kovacs", position: "CEO", priority: "hot", company: "Falcon Analytics", source: "Website" },
    { name: "Daniel Okafor", position: "Sales Manager", priority: "warm", company: "Emirates Global Trading", source: "Email" },
    { name: "Mei Lin Chow", position: "CTO", priority: "warm", company: "Gulf Tech Solutions", source: "Referral" },
    { name: "Tomas Novak", position: "Quality Lead", priority: "cold", company: "Al Noor Manufacturing", source: "Advertisement" },
    { name: "Aisha Bakr", position: "Marketing Head", priority: "warm", company: "Cedar Retail Group", source: "Social Media" },
    { name: "Robert Chen", position: "Investment Analyst", priority: "warm", company: "Meridian Financial", source: "Email" },
  ];

  const contacts: Contact[] = [];
  for (let i = 0; i < contactSeed.length; i += 1) {
    const c = contactSeed[i]!;
    const account = accounts.find((a) => a.name === c.company);
    contacts.push(
      await db.contact.create({
        data: {
          name: c.name,
          email: `${c.name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
          phone: `+971 5${i} ${100 + i} ${2000 + i * 13}`,
          company: c.company,
          position: c.position,
          source: CONTACT_SOURCE_MAP[c.source] ?? c.source,
          priority: c.priority,
          accountId: account?.id ?? null,
          ownerId: pick(i + 1).id,
          lastActivityAt: d(-(i * 3 + 1)),
        },
      }),
    );
  }

  // ---- leads -------------------------------------------------------------------
  // stage / source / value / createdDaysAgo / closedDaysAgo
  const leadSeed: Array<{
    name: string;
    company: string;
    stage: string;
    source: string;
    value: number;
    created: number;
    closed?: number;
    ownerIdx: number;
  }> = [
    { name: "Fleet tracking rollout", company: "Emirates Global Trading", stage: "won", source: "Referral", value: 145_000, created: -140, closed: -96, ownerIdx: 0 },
    { name: "ERP integration phase 1", company: "Gulf Tech Solutions", stage: "won", source: "Event", value: 98_000, created: -120, closed: -70, ownerIdx: 1 },
    { name: "Annual platform license", company: "Meridian Financial", stage: "won", source: "Email", value: 210_000, created: -95, closed: -40, ownerIdx: 2 },
    { name: "Analytics add-on bundle", company: "Falcon Analytics", stage: "won", source: "Website", value: 42_000, created: -80, closed: -18, ownerIdx: 3 },
    { name: "Compliance suite renewal", company: "Oasis Healthcare", stage: "won", source: "Phone", value: 66_000, created: -62, closed: -6, ownerIdx: 0 },
    { name: "Warehouse sensors pilot", company: "Al Noor Manufacturing", stage: "lost", source: "Cold Call", value: 55_000, created: -110, closed: -60, ownerIdx: 1 },
    { name: "Campus-wide deployment", company: "Brightline Education", stage: "lost", source: "Social Media", value: 30_000, created: -150, closed: -100, ownerIdx: 2 },
    { name: "Fleet expansion RFP", company: "Sahara Logistics", stage: "lost", source: "Advertisement", value: 77_000, created: -130, closed: -85, ownerIdx: 3 },
    { name: "Security audit retainer", company: "Northwind Energy", stage: "negotiation", source: "Referral", value: 180_000, created: -55, ownerIdx: 0 },
    { name: "Logistics platform migration", company: "Emirates Global Trading", stage: "negotiation", source: "Referral", value: 125_000, created: -48, ownerIdx: 1 },
    { name: "Payment gateway switch", company: "Cedar Retail Group", stage: "proposal", source: "Website", value: 88_000, created: -35, ownerIdx: 2 },
    { name: "Data center refresh", company: "Meridian Financial", stage: "proposal", source: "Email", value: 160_000, created: -28, ownerIdx: 3 },
    { name: "Patient portal upgrade", company: "Oasis Healthcare", stage: "qualified", source: "Phone", value: 71_000, created: -22, ownerIdx: 0 },
    { name: "IoT monitoring rollout", company: "Al Noor Manufacturing", stage: "qualified", source: "Cold Call", value: 94_000, created: -18, ownerIdx: 1 },
    { name: "CRM seats expansion", company: "Gulf Tech Solutions", stage: "contacted", source: "Event", value: 36_000, created: -12, ownerIdx: 2 },
    { name: "Retail analytics trial", company: "Cedar Retail Group", stage: "contacted", source: "Social Media", value: 24_000, created: -9, ownerIdx: 3 },
    { name: "AI forecasting pilot", company: "Falcon Analytics", stage: "new", source: "Website", value: 58_000, created: -5, ownerIdx: 0 },
    { name: "Turbine telemetry POC", company: "Northwind Energy", stage: "new", source: "Referral", value: 132_000, created: -3, ownerIdx: 1 },
    { name: "LMS replacement", company: "Brightline Education", stage: "new", source: "Email", value: 19_000, created: -2, ownerIdx: 2 },
    { name: "Supply chain visibility", company: "Emirates Global Trading", stage: "new", source: "Phone", value: 110_000, created: -1, ownerIdx: 3 },
    { name: "Compliance tracking", company: "Meridian Financial", stage: "won", source: "Referral", value: 87_000, created: -45, closed: -12, ownerIdx: 1 },
    { name: "Marketing automation", company: "Cedar Retail Group", stage: "won", source: "Email", value: 39_000, created: -38, closed: -9, ownerIdx: 2 },
    { name: "Field service app", company: "Al Noor Manufacturing", stage: "lost", source: "Event", value: 64_000, created: -70, closed: -25, ownerIdx: 0 },
    { name: "Procurement dashboard", company: "Emirates Global Trading", stage: "qualified", source: "Referral", value: 76_000, created: -8, ownerIdx: 3 },
  ];

  for (let i = 0; i < leadSeed.length; i += 1) {
    const l = leadSeed[i]!;
    const account = accounts.find((a) => a.name === l.company);
    const contact = contacts.find((c) => c.company === l.company);
    const closed = l.stage === "won" || l.stage === "lost";
    await db.lead.create({
      data: {
        name: l.name,
        email: contact?.email ?? `deal${i}@example.com`,
        phone: contact?.phone ?? null,
        company: l.company,
        value: l.value,
        stage: l.stage,
        source: LEAD_SOURCE_MAP[l.source] ?? l.source,
        status: closed ? (l.stage === "won" ? "closed_won" : "closed_lost") : "open",
        createdAt: iso(l.created, 9 + (i % 8)),
        closedAt: closed ? iso(l.closed ?? -30, 15) : null,
        expectedCloseDate: !closed ? d(14 + (i * 3) % 60) : null,
        nextFollowUp: !closed ? d(1 + (i % 10)) : null,
        accountId: account?.id ?? null,
        contactId: contact?.id ?? null,
        ownerId: pick(l.ownerIdx).id,
      },
    });
  }

  // ---- activities -----------------------------------------------------------------
  const activitySeed: Array<{
    type: string;
    subject: string;
    status: string;
    due: number;
    ownerIdx: number;
    contactIdx?: number;
    notes?: string;
  }> = [
    { type: "call", subject: "Discovery call — fleet rollout", status: "completed", due: -12, ownerIdx: 0, contactIdx: 0, notes: "Confirmed budget cycle opens next quarter." },
    { type: "email", subject: "Sent pricing to Meridian", status: "completed", due: -9, ownerIdx: 1, contactIdx: 4 },
    { type: "meeting", subject: "Onsite workshop at Al Noor", status: "completed", due: -7, ownerIdx: 2, contactIdx: 2, notes: "Plant tour + IoT requirements gathered." },
    { type: "whatsapp", subject: "Quick Q&A with Priya", status: "completed", due: -5, ownerIdx: 3, contactIdx: 1 },
    { type: "call", subject: "Follow-up: security audit", status: "scheduled", due: -2, ownerIdx: 0, contactIdx: 6, notes: "Left voicemail, retry Thursday." },
    { type: "email", subject: "Proposal revision v3", status: "scheduled", due: -1, ownerIdx: 1, contactIdx: 3 },
    { type: "task", subject: "Prepare RFP response", status: "scheduled", due: 0, ownerIdx: 2, contactIdx: 0 },
    { type: "call", subject: "Check-in — patient portal", status: "scheduled", due: 0, ownerIdx: 0, contactIdx: 5 },
    { type: "meeting", subject: "Executive demo — Northwind", status: "scheduled", due: 1, ownerIdx: 1, contactIdx: 6 },
    { type: "email", subject: "Contract redlines to legal", status: "scheduled", due: 2, ownerIdx: 2, contactIdx: 4 },
    { type: "whatsapp", subject: "Confirm demo attendees", status: "scheduled", due: 3, ownerIdx: 3, contactIdx: 9 },
    { type: "task", subject: "Update CRM forecasting sheet", status: "scheduled", due: 4, ownerIdx: 0 },
    { type: "call", subject: "Renewal conversation", status: "scheduled", due: 6, ownerIdx: 1, contactIdx: 10 },
    { type: "note", subject: "Champion change at Cedar Retail", status: "completed", due: -20, ownerIdx: 2, contactIdx: 3, notes: "Marie left the company; new contact TBD." },
    { type: "email", subject: "Quarterly business review deck", status: "completed", due: -15, ownerIdx: 3, contactIdx: 8 },
    { type: "call", subject: "Overdue: pricing call-back", status: "scheduled", due: -4, ownerIdx: 2, contactIdx: 12 },
    { type: "task", subject: "Book onsite for April", status: "scheduled", due: 9, ownerIdx: 1 },
    { type: "meeting", subject: "Pipeline review — weekly", status: "completed", due: -3, ownerIdx: 0 },
    { type: "call", subject: "Intro call — Falcon Analytics", status: "completed", due: -6, ownerIdx: 3, contactIdx: 9 },
    { type: "email", subject: "Case study request", status: "scheduled", due: 5, ownerIdx: 0, contactIdx: 1 },
  ];

  for (const a of activitySeed) {
    await db.activity.create({
      data: {
        type: a.type,
        subject: a.subject,
        notes: a.notes ?? null,
        status: a.status,
        priority: a.due < 0 && a.status === "scheduled" ? "high" : "normal",
        dueAt: iso(a.due, 10 + (a.ownerIdx * 2), (a.due * 7) % 60),
        completedAt: a.status === "completed" ? iso(a.due, 16) : null,
        accountId: a.contactIdx !== undefined ? (contacts[a.contactIdx]?.accountId ?? null) : null,
        contactId: a.contactIdx !== undefined ? (contacts[a.contactIdx]?.id ?? null) : null,
        ownerId: pick(a.ownerIdx).id,
        createdAt: iso(a.due - (a.status === "completed" ? 0 : 2), 9),
      },
    });
  }

  // ---- events ------------------------------------------------------------------------
  const eventSeed: Array<{
    title: string;
    type: string;
    start: number;
    hour: number;
    location?: string;
    contactIdx?: number;
    ownerIdx: number;
    status?: string;
  }> = [
    { title: "Pipeline review with Sara", type: "meeting", start: 0, hour: 11, location: "Meeting room 2", ownerIdx: 0 },
    { title: "Call — Khalid (EGT)", type: "call", start: 0, hour: 14, contactIdx: 0, ownerIdx: 0 },
    { title: "Product demo — Meridian", type: "meeting", start: 1, hour: 10, location: "https://meet.example.com/demo", contactIdx: 4, ownerIdx: 1 },
    { title: "Dentist appointment", type: "appointment", start: 2, hour: 9, ownerIdx: 2 },
    { title: "Proposal walkthrough — Cedar", type: "meeting", start: 3, hour: 13, location: "Zoom", contactIdx: 3, ownerIdx: 2 },
    { title: "Send onboarding kit", type: "task", start: 3, hour: 16, ownerIdx: 3 },
    { title: "Quarterly business review", type: "meeting", start: 5, hour: 10, location: "Meridian HQ", contactIdx: 4, ownerIdx: 0 },
    { title: "Follow-up — patient portal", type: "call", start: 6, hour: 15, contactIdx: 5, ownerIdx: 0 },
    { title: "Onsite — Al Noor plant", type: "appointment", start: 8, hour: 8, location: "Sharjah industrial zone", contactIdx: 2, ownerIdx: 2 },
    { title: "Intro meeting — Falcon AI", type: "meeting", start: -4, hour: 10, contactIdx: 9, ownerIdx: 3, status: "completed" },
    { title: "Weekly sync", type: "meeting", start: -7, hour: 9, ownerIdx: 0, status: "completed" },
    { title: "Contract call — Northwind", type: "call", start: 10, hour: 12, contactIdx: 6, ownerIdx: 1 },
  ];

  for (const e of eventSeed) {
    await db.event.create({
      data: {
        title: e.title,
        type: e.type,
        status: e.status ?? "scheduled",
        startAt: iso(e.start, e.hour, e.hour % 2 ? 30 : 0),
        endAt: iso(e.start, e.hour + 1, e.hour % 2 ? 30 : 0),
        location: e.location ?? null,
        accountId: e.contactIdx !== undefined ? (contacts[e.contactIdx]?.accountId ?? null) : null,
        contactId: e.contactIdx !== undefined ? (contacts[e.contactIdx]?.id ?? null) : null,
        ownerId: pick(e.ownerIdx).id,
      },
    });
  }

  // ---- settings singleton ---------------------------------------------------------------
  await db.setting.create({
    data: {
      id: "singleton",
      contactSources: JSON.stringify(["Email", "Phone", "Website", "Referral", "Event", "Social Media", "Cold Call", "Advertisement"]),
      leadStages: JSON.stringify(["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"]),
      activityTypes: JSON.stringify(["call", "email", "meeting", "whatsapp", "task", "note"]),
      accountTiers: JSON.stringify(["A", "B", "C"]),
      industries: JSON.stringify(["Technology", "Manufacturing", "Retail", "Finance", "Healthcare", "Education", "Logistics", "Energy"]),
      defaultCurrency: "AED",
      defaultLeadStage: "new",
      defaultTier: "B",
      followUpDays: 3,
      calendarView: "month",
      firstDayOfWeek: "monday",
    },
  });

  const counts = {
    users: await db.user.count(),
    accounts: await db.account.count(),
    contacts: await db.contact.count(),
    leads: await db.lead.count(),
    activities: await db.activity.count(),
    events: await db.event.count(),
  };

  console.log("Seeded NEO CRM demo workspace:", counts);
  console.log("Demo login: sepnetflix2023@outlook.com / $Abcd1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
