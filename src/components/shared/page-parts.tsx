"use client";

import * as React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/** Page title row with actions — mirrors the reference page headers. */
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** KPI stat card with optional delta chip and sparkline strip. */
export function KpiCard({
  label,
  value,
  delta,
  deltaSuffix = "%",
  invertDelta = false,
  hint,
  icon,
  children,
}: {
  label: string;
  value: React.ReactNode;
  delta?: number | null;
  deltaSuffix?: string;
  invertDelta?: boolean;
  hint?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const hasDelta = typeof delta === "number";
  const positive = hasDelta ? (invertDelta ? delta < 0 : delta > 0) : false;
  const neutral = hasDelta ? delta === 0 : false;

  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        {icon && <span className="text-subtle">{icon}</span>}
      </div>
      <div className="mt-2 flex flex-wrap items-baseline gap-2">
        <p className="text-[28px] font-semibold leading-none tracking-tight text-foreground">{value}</p>
        {hasDelta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold",
              neutral
                ? "bg-line-soft text-muted"
                : positive
                  ? "bg-success-soft text-success"
                  : "bg-danger-soft text-danger",
            )}
          >
            {delta! > 0 ? <TrendingUp className="h-3 w-3" /> : delta! < 0 ? <TrendingDown className="h-3 w-3" /> : null}
            {delta! > 0 ? "+" : ""}
            {Math.round(delta! * 10) / 10}
            {deltaSuffix}
          </span>
        )}
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}

/** Secondary label used inside cards ("Last 6 months", etc.). */
export function CardCaption({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-muted">{children}</span>;
}
