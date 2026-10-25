import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AccentText } from "./AccentText";
import { Eyebrow } from "./Eyebrow";

interface SectionHeadingProps {
  /** Wrap the accent word in asterisks: "Fresh *arrivals*" */
  title: string;
  eyebrow?: string;
  eyebrowLine?: boolean;
  description?: ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "lg" | "md";
  align?: "left" | "center";
  /** "light" on navy panels */
  tone?: "dark" | "light";
  className?: string;
}

// v2 headings: weight 800, tight letter-spacing (40px sections, 30–34px sub-sections)
const SIZES = {
  lg: "text-[32px] sm:text-[36px] lg:text-[40px] leading-[1.1]",
  md: "text-[26px] sm:text-[30px] leading-[1.15]",
};

export function SectionHeading({
  title,
  eyebrow,
  eyebrowLine = false,
  description,
  as: Heading = "h2",
  size = "lg",
  align = "left",
  tone = "dark",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={cn(centered && "text-center", className)}>
      {eyebrow && (
        <Eyebrow line={eyebrowLine} tone={tone}>
          {eyebrow}
        </Eyebrow>
      )}
      <Heading className={cn("font-extrabold tracking-[-0.03em] text-balance", SIZES[size], eyebrow && "mt-2.5")}>
        <AccentText text={title} tone={tone} />
      </Heading>
      {description && (
        <p
          className={cn(
            "mt-3.5 text-base leading-[1.7]",
            tone === "light" ? "text-on-navy-muted" : "text-muted",
            centered ? "mx-auto max-w-2xl" : "max-w-xl",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
