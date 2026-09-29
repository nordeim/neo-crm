import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: "default" | "outline" | "success" | "warning" | "danger" | "info" | "muted";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-primary/10 text-primary border-primary/20",
    outline: "bg-transparent text-muted border-line",
    success: "bg-success-soft text-success border-emerald-200",
    warning: "bg-warning-soft text-amber-600 border-amber-200",
    danger: "bg-danger-soft text-danger border-rose-200",
    info: "bg-info-soft text-cyan-700 border-cyan-200",
    muted: "bg-line-soft text-muted border-line",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
