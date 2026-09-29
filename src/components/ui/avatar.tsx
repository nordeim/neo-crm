import * as React from "react";
import { cn } from "@/lib/utils";

function initialsOf(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AvatarProps extends Omit<React.ComponentProps<"div">, "color"> {
  name: string | null | undefined;
  color?: string | null;
  size?: "sm" | "md" | "lg";
}

function Avatar({ name, color, size = "md", className, ...props }: AvatarProps) {
  const sizes: Record<string, string> = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-8 w-8 text-xs",
    lg: "h-10 w-10 text-sm",
  };
  return (
    <div
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white",
        sizes[size],
        className,
      )}
      style={{ backgroundColor: color || "#2563eb" }}
      aria-hidden="true"
      {...props}
    >
      {initialsOf(name)}
    </div>
  );
}

export { Avatar, initialsOf };
