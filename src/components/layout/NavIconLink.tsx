import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavIconLinkProps {
  to: string;
  label: string;
  children: ReactNode;
  /** Gold count bubble (hidden when 0) */
  count?: number;
  className?: string;
}

export function NavIconLink({ to, label, children, count = 0, className }: NavIconLinkProps) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={cn(
        "relative flex size-11 flex-none items-center justify-center rounded-full border border-line text-white transition-colors hover:border-gold hover:text-gold",
        className,
      )}
    >
      {children}
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[11px] font-extrabold text-obsidian"
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
