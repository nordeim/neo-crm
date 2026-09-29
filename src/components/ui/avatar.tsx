import * as React from "react";
import { cn } from "@/lib/utils";

function initialsOf(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || parts[0] === "") return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Pick a readable ink color for a given avatar background. Light greys (like
 * the reference app's default avatar) get dark text; saturated colors keep
 * white. Uses relative luminance with the WCAG-ish 0.55 threshold.
 */
function avatarTextColor(bg: string): string {
  const hex = bg.replace("#", "");
  if (hex.length !== 6) return "#ffffff";
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.55 ? "#374151" : "#ffffff";
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
  const bg = color || "#e5e7eb";
  return (
    <div
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold",
        sizes[size],
        className,
      )}
      style={{ backgroundColor: bg, color: avatarTextColor(bg) }}
      aria-hidden="true"
      {...props}
    >
      {initialsOf(name)}
    </div>
  );
}

export { Avatar, avatarTextColor, initialsOf };
