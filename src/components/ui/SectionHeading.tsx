import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AccentText } from "./AccentText";
import { Eyebrow } from "./Eyebrow";

interface SectionHeadingProps {
  /** Wrap the accent word in asterisks: "Explore the *Showroom*" */
  title: string;
  eyebrow?: string;
  eyebrowLine?: boolean;
  description?: ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "lg" | "md";
  align?: "left" | "center";
  className?: string;
}

const SIZES = {
  lg: "text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.08]",
  md: "text-[28px] sm:text-[32px] lg:text-[36px] leading-[1.15]",
};

export function SectionHeading({
  title,
  eyebrow,
  eyebrowLine = false,
  description,
  as: Heading = "h2",
  size = "lg",
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={cn(centered && "text-center", className)}>
      {eyebrow && <Eyebrow line={eyebrowLine}>{eyebrow}</Eyebrow>}
      <Heading className={cn("font-extrabold tracking-[-0.025em] text-balance", SIZES[size], eyebrow && "mt-2.5")}>
        <AccentText text={title} />
      </Heading>
      {description && (
        <p className={cn("mt-4 text-base leading-[1.7] text-soft", centered ? "mx-auto max-w-2xl" : "max-w-xl")}>
          {description}
        </p>
      )}
    </div>
  );
}
