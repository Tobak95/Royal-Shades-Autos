import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type CardTone = "surface" | "navy" | "gold";

type CardProps = ComponentProps<"div"> & {
  /** "lift": car cards (rise 6px, shadow, photo zoom); "feature": rise 4px with a gold border */
  hover?: "lift" | "feature";
  /** White card (default), navy panel, or gold-tint band */
  tone?: CardTone;
  /** Soft floating shadow for summaries and overlapping cards */
  raised?: boolean;
};

const TONES: Record<CardTone, string> = {
  surface: "border border-line bg-surface text-ink",
  navy: "bg-navy text-white",
  gold: "border border-gold-border bg-gold-tint text-ink",
};

export function Card({ hover, tone = "surface", raised = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card",
        TONES[tone],
        raised && "shadow-[0_24px_50px_-36px_rgb(11_27_46/0.45)]",
        hover === "lift" && "card-lift overflow-hidden",
        hover === "feature" && "feature-lift",
        className,
      )}
      {...props}
    />
  );
}
