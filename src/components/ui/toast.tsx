"use client";

// Toast system — a lightweight subscribe/store hook + viewport. Mirrors the
// @radix-ui/react-toast API shape but with far less ceremony (and no portal
// key pitfalls). Auto-dismiss with hover-pause.

import * as React from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

let toastSeq = 0;

// Module-level store so any component (or plain function via `toast()`) can
// publish without prop drilling.
type Listener = (toasts: ToastItem[]) => void;
const listeners = new Set<Listener>();
let toasts: ToastItem[] = [];

function emit() {
  for (const l of listeners) l(toasts);
}

function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

function push(title: string, variant: ToastVariant = "info", description?: string) {
  toastSeq += 1;
  const item: ToastItem = { id: toastSeq, title, description, variant };
  toasts = [...toasts, item].slice(-4); // keep the viewport tidy
  emit();
  return item.id;
}

/** Imperative helper usable from anywhere client-side. */
export const toast = {
  success: (title: string, description?: string) => push(title, "success", description),
  error: (title: string, description?: string) => push(title, "error", description),
  info: (title: string, description?: string) => push(title, "info", description),
  dismiss,
};

function useToasts(): ToastItem[] {
  const [state, setState] = React.useState<ToastItem[]>(toasts);
  React.useEffect(() => {
    const listener: Listener = (next) => setState(next);
    listeners.add(listener);
    return () => listeners.delete(listener) as unknown as void;
  }, []);
  return state;
}

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="h-4.5 w-4.5 text-success" />,
  error: <AlertCircle className="h-4.5 w-4.5 text-danger" />,
  info: <Info className="h-4.5 w-4.5 text-primary" />,
};

function Toaster() {
  const items = useToasts();
  return (
    <div
      aria-label="Notifications"
      role="region"
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2"
    >
      {items.map((t) => (
        <ToastCard key={t.id} item={t} />
      ))}
    </div>
  );
}

function ToastCard({ item }: { item: ToastItem }) {
  // Auto-dismiss (hover-pause via timer reset).
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    timer.current = setTimeout(() => dismiss(item.id), 4000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [paused, item.id]);

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-lg outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4",
        item.variant === "success" && "border-emerald-200 bg-white",
        item.variant === "error" && "border-rose-200 bg-white",
        item.variant === "info" && "border-line bg-white",
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span className="mt-0.5 shrink-0">{ICONS[item.variant]}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{item.title}</p>
        {item.description && <p className="mt-0.5 text-xs text-muted">{item.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => dismiss(item.id)}
        className="shrink-0 rounded-md p-1 text-subtle transition-colors hover:bg-line-soft hover:text-foreground"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export { Toaster };
