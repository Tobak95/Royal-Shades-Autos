import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: ReactNode;
  /** Short gold rule before the text */
  line?: boolean;
  className?: string;
}

export function Eyebrow({ children, line = false, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 text-xs font-semibold tracking-eyebrow text-gold uppercase",
        className,
      )}
    >
      {line && <span aria-hidden="true" className="h-px w-7 bg-gold" />}
      {children}
    </p>
  );
}
