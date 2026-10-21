import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "neutral" | "gold" | "available" | "incoming" | "sold";

const VARIANTS: Record<BadgeVariant, { badge: string; dot: string }> = {
  neutral: { badge: "bg-white/[0.06] text-silver", dot: "bg-muted" },
  gold: { badge: "bg-gold/15 text-gold", dot: "bg-gold" },
  available: { badge: "bg-available/16 text-available-text", dot: "bg-available" },
  incoming: { badge: "bg-incoming/16 text-incoming-text", dot: "bg-incoming" },
  sold: { badge: "bg-sold/18 text-sold-text", dot: "bg-sold" },
};

type BadgeProps = ComponentProps<"span"> & {
  variant?: BadgeVariant;
  dot?: boolean;
};

export function Badge({ variant = "neutral", dot = false, className, children, ...props }: BadgeProps) {
  const styles = VARIANTS[variant];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-[11px] py-[5px] text-xs font-semibold whitespace-nowrap",
        styles.badge,
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden="true" className={cn("size-1.5 rounded-full", styles.dot)} />}
      {children}
    </span>
  );
}
