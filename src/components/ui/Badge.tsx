import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "neutral" | "gold" | "available" | "arriving" | "inspection" | "sold";

const VARIANTS: Record<BadgeVariant, { tint: string; text: string; dot: string }> = {
  neutral: { tint: "bg-surface border border-line", text: "text-ink", dot: "bg-faint" },
  gold: { tint: "bg-gold-tint", text: "text-gold-text", dot: "bg-gold" },
  available: { tint: "bg-available-tint", text: "text-available-text", dot: "bg-available" },
  arriving: { tint: "bg-arriving-tint", text: "text-arriving-text", dot: "bg-arriving" },
  inspection: { tint: "bg-inspection-tint", text: "text-inspection-text", dot: "bg-inspection" },
  sold: { tint: "bg-sold-tint", text: "text-sold", dot: "bg-sold" },
};

type BadgeProps = ComponentProps<"span"> & {
  variant?: BadgeVariant;
  dot?: boolean;
  /** White pill for badges sitting on photos (as on the car cards) */
  overlay?: boolean;
};

export function Badge({ variant = "neutral", dot = false, overlay = false, className, children, ...props }: BadgeProps) {
  const styles = VARIANTS[variant];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap",
        overlay ? "bg-surface shadow-sm" : styles.tint,
        styles.text,
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden="true" className={cn("size-1.5 rounded-full", styles.dot)} />}
      {children}
    </span>
  );
}
