"use client";

// Mobile navigation drawer — THE fix for the reference app's mobile bug
// (the original hides the sidebar below `lg` and ships no replacement, so
// phone users cannot reach Accounts/Contacts/Leads/Calendar/Reports at all).
//
// Tailwind v4 pitfalls deliberately avoided (docs/Tailwind-V4-Validation-Report.md):
//  - No `hidden` attribute fighting display utilities (v4: the `hidden`
//    attribute now WINS over display utilities — never combine them).
//  - Panel is `position: fixed` with its own overflow-y so long lists are
//    never clipped by an ancestor (failure class C).
//  - z-index stays on the flat scale (drawer z-50, below toasts z-[100]).
//  - Transitions are pure CSS transform/opacity — no JS animate plugin.
//
// React 19 discipline:
//  - Closes on route change via adjust-during-render (NOT setState-in-useEffect).
//  - `inert` (native React 19 boolean prop) removes the closed drawer from
//    the a11y tree and tab order.
//  - Body scroll-lock with original-value cleanup; focus returns to the
//    previously focused element on close.

import * as React from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { SidebarNav, BrandMark } from "./sidebar";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);

  // Close on navigation — adjust-during-render (React 19 lint-safe pattern).
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (open) onOpenChange(false);
  }

  // Close automatically when the viewport grows past the mobile breakpoint.
  React.useEffect(() => {
    if (!open) return;
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) onOpenChange(false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [open, onOpenChange]);

  // Body scroll lock + Escape + focus trap + focus restore.
  React.useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    const raf = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("a[href], button:not([disabled])")?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      cancelAnimationFrame(raf);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onOpenChange]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-[visibility] duration-300 lg:hidden",
        open ? "visible" : "invisible pointer-events-none",
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      inert={!open}
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close navigation menu"
        tabIndex={open ? 0 : -1}
        onClick={() => onOpenChange(false)}
        className={cn(
          "absolute inset-0 h-full w-full cursor-default bg-gray-900/50 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      {/* Panel — fixed, own scroll, slides in from the left */}
      <div
        ref={panelRef}
        className={cn(
          "fixed left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-sidebar shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <BrandMark />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="mr-4 rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pb-4 scrollbar-thin">
          <SidebarNav onNavigate={() => onOpenChange(false)} />
        </div>
      </div>
    </div>
  );
}

/** Hamburger trigger for the topbar. */
export function MobileNavTrigger({ onClick, expanded }: { onClick: () => void; expanded: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-line-soft hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 lg:hidden"
      aria-label="Open navigation menu"
      aria-haspopup="dialog"
      aria-expanded={expanded}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 5h14M3 10h14M3 15h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </button>
  );
}
