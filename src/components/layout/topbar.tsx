"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, ChevronDown, Mail, Search } from "lucide-react";
import {
  // Session-47 (S47-P4, N-47g): the Popover-based Dropdown family left
  // when the account menu migrated to the stock Menu* primitives. The
  // block now carries ONLY the four live Menu* members (the N-66g
  // reword — "dead weight" described the pre-P4 state).
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/components/ui/dropdown";
import { MobileNavTrigger } from "./mobile-nav";
import { useCrmStore } from "@/stores/crm-store";
import { SEARCH_INPUT, TOPBAR_LAYOUT } from "@/lib/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STAGE_META } from "@/lib/constants";
import { formatCompactCurrency } from "@/lib/format";
import type { User as AppUser } from "@/types";

interface TopbarProps {
  user: AppUser | null;
  onOpenMobileNav: () => void;
  mobileNavOpen: boolean;
}

/**
 * Topbar — session-7 reference model (TOPBAR_LAYOUT contracts): a STATIC
 * `py-4` header (it never scrolls because `main` owns scrolling) with a
 * `justify-between` inner row. The global search hides below `sm` on the
 * reference; ours keeps the functional results dropdown and the e2e-pinned
 * aria-label. The hamburger is our mobile-nav fix (visible below `md`).
 */
export function Topbar({ user, onOpenMobileNav, mobileNavOpen }: TopbarProps) {
  const router = useRouter();
  const logout = useCrmStore((s) => s.logout);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<{
    accounts: { id: string; name: string }[];
    contacts: { id: string; name: string }[];
    leads: { id: string; name: string; stage: string; value: number }[];
  } | null>(null);
  const [open, setOpen] = React.useState(false);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced global search — all setState happens inside the async timer
  // callback (never synchronously in the effect body).
  // Session-45 (S45-P3): a controller per effect run, aborted in the
  // cleanup — the debounce only prevented same-window timer races; two
  // in-flight fetches could still resolve out of order (a stale "ab"
  // response overwriting "abc"'s). A superseded fetch now hands its
  // state ownership to the newer run instead of clobbering it.
  React.useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const controller = new AbortController();
    timer.current = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults(null);
        setOpen(false);
        return;
      }
      // Session-43 (S43-P4): the wrap — this was the ONLY unwrapped
      // fetch in src (the store's call(), the login card, the profile
      // and the entity dialogs are all wrapped). A network failure
      // rejected the timer callback → an unhandled rejection + silently
      // stale results (the s39 profile-save class). The catch resets
      // both the results and the dropdown.
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
        });
        const body = await res.json().catch(() => null);
        // Session-73 (N-73c2): the SUCCESS path is abort-gated too — the
        // s46-P4 symmetry (the catch + envelope paths already carried
        // it). A superseded run whose body buffered pre-abort could
        // transiently flash stale results before the newer run wrote.
        if (body?.ok && !controller.signal.aborted) {
          setResults(body.data);
          setOpen(true);
        } else if (!controller.signal.aborted) {
          // Session-44 (S44-P5): the envelope path resets too — a JSON
          // 401/500 envelope (body?.ok falsy) used to silently no-op,
          // leaving stale results open (only a network-level rejection
          // hit the catch below).
          // Session-46 (S46-P4): the reset is abort-aware now — an abort
          // landing during the body-parse window resolves `body` to null
          // via the swallowed .catch(() => null); without this gate a
          // SUPERSEDED run took the envelope path and transiently closed
          // the newer run's dropdown. Same handoff semantics as the catch.
          setResults(null);
          setOpen(false);
        }
      } catch {
        // A superseded run hands state to the newer effect — only a
        // REAL failure resets (the s43-P4 reset, unchanged).
        if (controller.signal.aborted) return;
        setResults(null);
        setOpen(false);
      }
    }, 250);
    return () => {
      controller.abort();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  // Close search results on outside click.
  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const hasResults =
    results && (results.accounts.length > 0 || results.contacts.length > 0 || results.leads.length > 0);

  return (
    <header className={TOPBAR_LAYOUT.header}>
      <div className={TOPBAR_LAYOUT.inner}>
        {/* Our mobile-nav fix — the reference ships no navigation below md. */}
        <MobileNavTrigger onClick={onOpenMobileNav} expanded={mobileNavOpen} />

        {/* Global search — hidden below sm (reference behavior). */}
        <div className={TOPBAR_LAYOUT.searchBlock}>
          <div ref={boxRef} className={TOPBAR_LAYOUT.searchWrap}>
            <Search
              className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${TOPBAR_LAYOUT.searchIcon}`}
            />
            {/* Session-10 (S10-3): the reference's search pill is the stock
                Input base + `pl-10 bg-gray-50 border-gray-200` — 12px right
                padding (stock px-3), keyboard-only focus-visible ring and
                the ink/placeholder tokens. Was a custom pr-4 string. */}
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => hasResults && setOpen(true)}
              onKeyDown={(e) => {
                // Session-66 (N-66a): Escape closes the dropdown — the S12-P1
                // mobile-nav precedent (fix the keyboard access on our
                // functional-superset surfaces). Before this, only an outside
                // mousedown / a row click / a query collapse closed it, so a
                // keyboard user Tabbing away stranded the dropdown open.
                if (e.key === "Escape" && open) {
                  setOpen(false);
                }
              }}
              placeholder="Search Anything..."
              aria-label="Search accounts, contacts and leads"
              className={SEARCH_INPUT.extras}
            />
            {open && hasResults && (
              <div className="absolute left-0 right-0 top-11 z-[60] overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-lg animate-in fade-in-0 zoom-in-95">
                {results!.accounts.length > 0 && (
                  <>
                    <p className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-subtle">Accounts</p>
                    {results!.accounts.map((a) => (
                      <SearchResultRow key={a.id} label={a.name} onClick={() => { setOpen(false); router.push("/accounts"); }} />
                    ))}
                  </>
                )}
                {results!.contacts.length > 0 && (
                  <>
                    <p className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-subtle">Contacts</p>
                    {results!.contacts.map((c) => (
                      <SearchResultRow key={c.id} label={c.name} onClick={() => { setOpen(false); router.push("/contacts"); }} />
                    ))}
                  </>
                )}
                {results!.leads.length > 0 && (
                  <>
                    <p className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-subtle">Leads</p>
                    {results!.leads.map((l) => (
                      <SearchResultRow
                        key={l.id}
                        label={l.name}
                        hint={`${STAGE_META[l.stage]?.label ?? l.stage} · ${formatCompactCurrency(l.value)}`}
                        onClick={() => { setOpen(false); router.push("/leads"); }}
                      />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={TOPBAR_LAYOUT.rightGroup}>
          {/* Session-73 (S73-P2, L-73c1/c2/c9): the reference's exact
              construction — the STOCK ghost icon Button + the literal
              `text-gray-600 hidden sm:flex`. The stock base supplies the
              1px near-black focus ring AND the [&_svg]:size-4 cascade
              under which the reference's w-5-h-5-classed icons COMPUTE
              16px (LIVE-measured on the reference — ours rendered 20px
              on the old raw buttons); the w-5 h-5 class noise below is
              the reference's own. */}
          <Button type="button" variant="ghost" size="icon" className="text-gray-600 hidden sm:flex" aria-label="Messages">
            <Mail className={TOPBAR_LAYOUT.iconClass} />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="text-gray-600 hidden sm:flex" aria-label="Notifications">
            <Bell className={TOPBAR_LAYOUT.iconClass} />
          </Button>

          {user && (
            <Menu>
              <MenuTrigger asChild>
                {/* Session-17 (S17-P1): the STOCK ghost Button — the
                    reference's trigger carries the full stock construction
                    (whitespace-nowrap / text-sm font-medium / the 1px
                    focus-visible ring / the ghost hover pair) plus `flex
                    items-center gap-1 sm:gap-2`; TOPBAR_LAYOUT.userButton
                    adds the composition and neutralizes the iconGap's
                    trailing-chevron margin. */}
                <Button type="button" variant="ghost" className={TOPBAR_LAYOUT.userButton} aria-label="Account menu">
                  {/* Session-73 (L-73c4/N-73c1): the reference's fallback
                      chain — display_name || full_name || email ||
                      "Guest". Our name is non-nullable + email-derived
                      at signup (S21-P4), so the tail is dead-in-practice
                      — the FORMULA is the parity (no @-split; the raw
                      email when nameless). */}
                  <span className={TOPBAR_LAYOUT.userLabel}>
                    Hi, {user.name || user.email || "Guest"}
                  </span>
                  <span className={TOPBAR_LAYOUT.userAvatarRoot} aria-hidden="true">
                    {/* Session-30 (S30-P3): the reference's topbar avatar
                        renders the saved profile photo over the gray-200
                        initial fallback (img object-cover rounded-full). */}
                    {user.photoUrl ? (
                      <img
                        src={user.photoUrl}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className={TOPBAR_LAYOUT.userAvatarFallback}>
                        {(user.name || user.email || "G").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </span>
                  <ChevronDown className={TOPBAR_LAYOUT.userChevron} />
                </Button>
              </MenuTrigger>
              <MenuContent>
                {/* Session-73 (S73-P3, L-73c5): the reference's Profile
                    item is `$s asChild` wrapping a REAL anchor (its ox
                    Link → <a href="/Profile">) — the middle-click /
                    open-in-new-tab semantics the router.push form lost.
                    Our next/link twin keeps the client-side nav. */}
                <MenuItem asChild>
                  <Link href="/Profile">Profile</Link>
                </MenuItem>
                <MenuItem
                  onSelect={async () => {
                    await logout();
                    router.push("/login");
                    router.refresh();
                  }}
                >
                  Logout
                </MenuItem>
              </MenuContent>
            </Menu>
          )}
        </div>
      </div>
    </header>
  );
}

function SearchResultRow({ label, hint, onClick }: { label: string; hint?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-line-soft"
    >
      <span className="truncate">{label}</span>
      {hint && <span className="shrink-0 text-xs text-muted">{hint}</span>}
    </button>
  );
}
