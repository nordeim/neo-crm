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
//  - Closes on route change via adjust-during-render — session-35 moved
//    that adjustment INTO AppShell, where `mobileNavOpen` lives (calling a
//    parent's setter from a child's render body trips React's
//    "Cannot update a component while rendering a different component"
//    warning on non-link navigations, e.g. browser back/forward with the
//    drawer open; the click path still closes first via onNavigate).
//  - `inert` (native React 19 boolean prop) removes the closed drawer from
//    the a11y tree and tab order.
//  - Body scroll-lock with original-value cleanup; focus returns to the
//    previously focused element on close.

import * as React from "react";
import { X } from "lucide-react";
import { SidebarNav, BrandMark } from "./sidebar";
import { MOBILE_NAV_LAYOUT } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);

  // Session-35: the close-on-route-change adjust-during-render moved INTO
  // AppShell — the state lives there, and adjusting a parent's state from a
  // child's render body trips React's "Cannot update a component while
  // rendering a different component" warning (fires on non-link
  // navigations, e.g. browser back/forward with the drawer open). The
  // click path still closes first via SidebarNav's onNavigate.

  // Close automatically when the viewport grows past the mobile breakpoint.
  // S8-P1: the query MUST match the drawer's `md:hidden` range (768px) —
  // session-7 changed the range but left this listener at 1024px, which
  // left body + main scroll-locked after resizing from 700 to 800px with
  // the drawer open (the drawer hid, the locks stayed).
  React.useEffect(() => {
    if (!open) return;
    const mql = window.matchMedia(MOBILE_NAV_LAYOUT.autoCloseQuery);
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) onOpenChange(false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [open, onOpenChange]);

  // Body + main-scroller scroll lock + Escape + focus trap + focus restore.
  // Session-6: `main` is now the scroll container (overflow-auto), so the
  // lock must clamp it too — body alone would leave main scrollable.
  React.useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    const scroller = document.querySelector<HTMLElement>("main");
    const prevScrollerOverflow = scroller?.style.overflow ?? "";
    document.body.style.overflow = "hidden";
    if (scroller) scroller.style.overflow = "hidden";

    // S12-P1: the initial focus RETRIES across frames. The drawer opens
    // with a `transition-[visibility]` class flip, and the rAF callback
    // can run in the SAME frame — BEFORE the browser has applied the
    // now-visible state (instrumented live: focus() WAS called on the
    // Close button while its computed visibility was still `hidden`, and
    // focus() on a not-rendered element SILENTLY NO-OPS — focus stayed on
    // the burger and keyboard users Tabbed through the background page
    // behind the aria-modal dialog). Retry until activeElement actually
    // lands inside the panel (bounded; observed to land on frame 3).
    let cancelled = false;
    const focusFirstInPanel = (attempt: number) => {
      if (cancelled) return;
      const el = panelRef.current?.querySelector<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!el) return;
      el.focus();
      if (document.activeElement !== el && attempt < 5) {
        requestAnimationFrame(() => focusFirstInPanel(attempt + 1));
      }
    };
    const raf = requestAnimationFrame(() => focusFirstInPanel(0));

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

    return () => {
      cancelled = true;
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (scroller) scroller.style.overflow = prevScrollerOverflow;
      cancelAnimationFrame(raf);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onOpenChange]);

  return (
    <div
      className={cn(
        // md, not lg — the desktop sidebar appears from md (session-7
        // live pin), so the drawer only covers phone/narrow-tablet widths.
        // MOBILE_NAV_LAYOUT.drawerRange keeps the class and the auto-close
        // media query in lockstep (session-8 S8-P1).
        `fixed inset-0 z-50 transition-[visibility] duration-300 ${MOBILE_NAV_LAYOUT.drawerRange}`,
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
      {/* Panel — fixed, own scroll, slides in from the left. Session-12
          (S12-P1, mobile-nav taxonomy class D): `h-dvh` instead of `h-full`
          so the panel tracks the DYNAMIC viewport on mobile browsers
          (h-full on a fixed element resolves to the large-viewport height —
          the bottom could sit behind the URL bar on iOS Safari). */}
      <div
        ref={panelRef}
        className={cn(
          "fixed left-0 top-0 flex h-dvh w-72 max-w-[85vw] flex-col bg-sidebar shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-line-soft hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:hidden"
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
