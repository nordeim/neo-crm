/**
 * Static CSV import templates (session-26, S26-P3).
 *
 * The reference's `b(key)` (bundle-extracted from its minified JS): a
 * three-entry STATIC map → `new Blob([_], {type: "text/csv"})` → a
 * programmatic anchor `download=\`${key}_template.csv\``. The strings were
 * captured live on 2026-10-02 via a Blob-constructor spy on the reference
 * (real \n newlines, byte-exact):
 *
 *   contacts: name,email,phone,company,position,source
 *             John Doe,john@example.com,+1234567890,Acme Inc,Sales Manager,email
 *   accounts: name,industry,website,phone,email,annual_revenue,employees,status
 *             Acme Inc,Technology,acme.com,+1234567890,info@acme.com,1000000,50,active
 *   leads:    name,email,phone,company,status,source,value
 *             Jane Smith,jane@example.com,+1234567890,Beta Corp,new,website,50000
 *
 * Our clone previously wired the three buttons to `/api/export?type=X` —
 * server-side, live data, the wrong filename and the wrong content (the
 * s24 click-contract lesson again: the buttons' looks were pinned, never
 * their downloads).
 */

export interface CsvTemplate {
  /** The static CSV body (header row + one example row). */
  content: string;
  /** `${key}_template.csv` — the reference's convention. */
  filename: string;
}

export const CSV_TEMPLATES: Record<"contacts" | "accounts" | "leads", CsvTemplate> = {
  contacts: {
    content:
      "name,email,phone,company,position,source\nJohn Doe,john@example.com,+1234567890,Acme Inc,Sales Manager,email",
    filename: "contacts_template.csv",
  },
  accounts: {
    content:
      "name,industry,website,phone,email,annual_revenue,employees,status\nAcme Inc,Technology,acme.com,+1234567890,info@acme.com,1000000,50,active",
    filename: "accounts_template.csv",
  },
  leads: {
    content:
      "name,email,phone,company,status,source,value\nJane Smith,jane@example.com,+1234567890,Beta Corp,new,website,50000",
    filename: "leads_template.csv",
  },
};

/** The reference's template mime: `new Blob([_], { type: "text/csv" })`. */
export const CSV_TEMPLATE_MIME = "text/csv";
