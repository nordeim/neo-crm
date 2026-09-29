"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, NAV_FOOTER_ITEMS } from "./nav-config";
import { cn } from "@/lib/utils";

/**
 * Shared navigation list — rendered inside BOTH the desktop sidebar and the
 * mobile drawer so the two stay in lockstep.
 */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav aria-label="Main navigation" className="flex h-full flex-col gap-1 px-3">
      <div className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/85 transition-colors",
                "hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                active && "bg-white/15 font-semibold text-white",
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={active ? 2.2 : 1.8} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="mt-auto flex flex-col gap-0.5 pb-2">
        {NAV_FOOTER_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/85 transition-colors",
                "hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                active && "bg-white/15 font-semibold text-white",
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={active ? 2.2 : 1.8} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** Brand mark — white target-ring + CRM wordmark (matches the reference). */
export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-5">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-[2.5px] border-white">
        <span className="h-2.5 w-2.5 rounded-full bg-white" />
      </span>
      {!compact && <span className="text-lg font-bold tracking-wide text-white">CRM</span>}
    </div>
  );
}
