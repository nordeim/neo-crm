"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, Mail, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Dropdown, DropdownContent, DropdownItem, DropdownSeparator, DropdownTrigger } from "@/components/ui/dropdown";
import { MobileNavTrigger } from "./mobile-nav";
import { useCrmStore } from "@/stores/crm-store";
import type { User as AppUser } from "@/types";
import { cn } from "@/lib/utils";
import { STAGE_META } from "@/lib/constants";
import { formatCompactCurrency } from "@/lib/format";

interface TopbarProps {
  user: AppUser | null;
  onOpenMobileNav: () => void;
  mobileNavOpen: boolean;
}

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
  React.useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults(null);
        setOpen(false);
        return;
      }
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      const body = await res.json().catch(() => null);
      if (body?.ok) {
        setResults(body.data);
        setOpen(true);
      }
    }, 250);
    return () => {
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
    <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-line bg-surface px-4 sm:gap-4 sm:px-8">
      <MobileNavTrigger onClick={onOpenMobileNav} expanded={mobileNavOpen} />

      {/* Global search */}
      <div ref={boxRef} className="relative min-w-0 flex-1 sm:max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => hasResults && setOpen(true)}
            placeholder="Search Anything..."
            aria-label="Search accounts, contacts and leads"
            className="h-9 w-full rounded-lg border border-line bg-white pl-9 pr-4 text-sm text-foreground placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
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

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          aria-label="Messages"
          className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-line-soft hover:text-foreground sm:inline-flex"
        >
          <Mail className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-line-soft hover:text-foreground sm:inline-flex"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </button>

        {user && (
          <Dropdown>
            <DropdownTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-line-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                aria-label="Account menu"
              >
                <span className="hidden max-w-[140px] truncate text-sm text-muted sm:inline">
                  Hi, <span className="font-medium text-foreground">{user.name.split(" ")[0] || user.email.split("@")[0]}</span>
                </span>
                <Avatar name={user.name} color={user.avatarColor} size="md" />
                <ChevronDown className="h-3.5 w-3.5 text-subtle" />
              </button>
            </DropdownTrigger>
            <DropdownContent className="min-w-[11rem]">
              <DropdownItem onClick={() => router.push("/profile")}>Profile</DropdownItem>
              <DropdownSeparator />
              <DropdownItem
                destructive
                onClick={async () => {
                  await logout();
                  router.push("/login");
                  router.refresh();
                }}
              >
                Logout
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        )}
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

export { cn };
