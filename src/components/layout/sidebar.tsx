"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, NAV_FOOTER_ITEMS } from "./nav-config";
import { NAV_LAYOUT } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

/**
 * Shared navigation list — rendered inside BOTH the desktop sidebar and the
 * mobile drawer so the two stay in lockstep.
 *
 * Session-7 re-pin (NAV_LAYOUT contracts): links are `px-4 py-3` with
 * `hover:bg-white/5` and a flat `bg-white/10` active state (no bold bump),
 * icons are uniform `h-5 w-5` stroke-2, and the footer group (Settings)
 * is pinned to the sidebar bottom via `mt-auto` with a `border-t`
 * divider. Our focus-visible ring is a deliberate a11y superset.
 */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  // Session-24 (S24-P2): the reference's active-state matching is
  // CASE-INSENSITIVE — its sidebar links carry the capitalized hrefs
  // (/Reports) while its router serves both casings, and at lowercase
  // /reports the Reports item still carries the active background
  // (live-probed: rgba(255,255,255,0.1)). The Dashboard item is active
  // at BOTH "/" and "/Dashboard" (its link points at /Dashboard but the
  // post-login redirect lands on the root — both paths are the
  // dashboard), so it keeps the root special case on the folded compare.
  const isActive = (href: string) => {
    const p = pathname.toLowerCase();
    const h = href.toLowerCase();
    if (h === "/dashboard") return p === "/" || p === "/dashboard";
    return p === h || p.startsWith(`${h}/`);
  };

  const renderLink = (item: (typeof NAV_ITEMS)[number], active: boolean) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        active ? NAV_LAYOUT.linkActive : NAV_LAYOUT.link,
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
      )}
    >
      <item.icon className={cn(NAV_LAYOUT.icon, "shrink-0")} strokeWidth={2} />
      <span className={cn(NAV_LAYOUT.label, "truncate")}>{item.label}</span>
    </Link>
  );

  return (
    <nav aria-label="Main navigation" className={NAV_LAYOUT.container}>
      <div className={NAV_LAYOUT.group}>
        {NAV_ITEMS.map((item) => renderLink(item, isActive(item.href)))}
      </div>
      {/* Reference layout (session-7 re-pin): the Settings group is pinned
          to the sidebar bottom (mt-auto) behind a border-t divider. */}
      <div className={NAV_LAYOUT.footerGroup}>
        {NAV_FOOTER_ITEMS.map((item) => renderLink(item, isActive(item.href)))}
      </div>
    </nav>
  );
}

/** Brand mark — 40px white circle holding a 24px blue dot + the CRM
 *  wordmark at text-2xl (session-7 live pins: `p-6 flex items-center
 *  gap-3`). */
export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={NAV_LAYOUT.brand}>
      <div className={NAV_LAYOUT.brandLogoOuter} aria-hidden="true">
        <div className={NAV_LAYOUT.brandLogoInner} />
      </div>
      {!compact && <span className={NAV_LAYOUT.brandWordmark}>CRM</span>}
    </div>
  );
}
