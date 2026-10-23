import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: ReactNode;
  /** Short gold rule before the text */
  line?: boolean;
  /** "light" on navy or dark photos */
  tone?: "dark" | "light";
  className?: string;
}

export function Eyebrow({ children, line = false, tone = "dark", className }: EyebrowProps) {
  const color = tone === "light" ? "text-gold-light" : "text-gold-text";
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 text-[13px] font-bold tracking-eyebrow uppercase",
        color,
        className,
      )}
    >
      {line && <span aria-hidden="true" className={cn("h-px w-7", tone === "light" ? "bg-gold-light" : "bg-gold")} />}
      {children}
    </p>
  );
}
