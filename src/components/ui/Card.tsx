import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type CardProps = ComponentProps<"div"> & {
  /** Lift 4px with a gold border and glow on hover */
  interactive?: boolean;
  /** Gold-tinted border for highlighted panels (e.g. order summaries) */
  highlight?: boolean;
};

export function Card({ interactive = false, highlight = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border bg-graphite",
        highlight ? "border-gold/35" : "border-line",
        interactive && "card-lift",
        className,
      )}
      {...props}
    />
  );
}
