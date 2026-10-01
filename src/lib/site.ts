// Canonical site origin seam (contract pinned by tests/metadata.test.ts).
//
// NEXT_PUBLIC_SITE_URL has been documented in .env.example / README / CLAUDE
// as "used for metadata, sitemap.xml, and robots.txt" since the scaffold —
// but before session-18 it was consumed NOWHERE. Every metadata surface
// (the root layout's metadataBase + OG/Twitter cards, app/sitemap.ts,
// app/robots.ts) derives from siteUrl() so the documented contract is
// finally true.
//
// NEXT_PUBLIC_* values are INLINED AT BUILD TIME by Next — set the variable
// before `bun run build` in production (docs/DEPLOYMENT.md).

export const DEFAULT_SITE_URL = "http://localhost:3000";

/** The reference's meta description, mirrored verbatim (405 chars). */
export const SITE_DESCRIPTION =
  "NEO CRM is a clean, intuitive customer relationship management platform designed to help teams manage accounts, contacts, and leads in one centralized dashboard. With powerful search, clear account tracking, activity monitoring, and built-in reporting, NEO CRM keeps your client data organized, accessible, and actionable—so you can focus on building stronger relationships and closing more opportunities.";

/**
 * Canonical public origin: NEXT_PUBLIC_SITE_URL when set (trailing slashes
 * stripped — URL composition below always appends paths), otherwise the
 * localhost dev default.
 */
export function siteUrl(
  env: string | undefined = process.env.NEXT_PUBLIC_SITE_URL,
): string {
  const raw = (env ?? "").trim();
  if (!raw) return DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, "");
}
