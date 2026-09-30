import * as React from "react";
import { INPUT_BASE } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      // Session-7: stock shadcn base — rounded-md (the reference's toolbar
      // searches and settings inputs all use the stock rounded-md input,
      // verified live on the contacts search).
      // Session-9 (S9-12, S9-16): `text-base md:text-sm` (16px below md —
      // the reference's phones render 16px input text) and a 1px near-black
      // focus ring with the border color unchanged (ring-ring).
      className={cn(
        `flex h-9 w-full rounded-md border border-line bg-white px-3 py-1 ${INPUT_BASE.size} text-foreground shadow-sm transition-colors placeholder:text-subtle ${INPUT_BASE.focusRing} focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
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
        `flex min-h-[72px] w-full rounded-lg border border-line bg-white px-3 py-2 ${INPUT_BASE.size} text-foreground shadow-sm transition-colors placeholder:text-subtle ${INPUT_BASE.focusRing} focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
        className,
      )}
      {...props}
    />
  );
}

export { Input, Textarea };
