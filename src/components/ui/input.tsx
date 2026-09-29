import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      // Session-7: stock shadcn base — rounded-md (the reference's toolbar
      // searches and settings inputs all use the stock rounded-md input,
      // verified live on the contacts search).
      className={cn(
        "flex h-9 w-full rounded-md border border-line bg-white px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-subtle focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-[72px] w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-subtle focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input, Textarea };
