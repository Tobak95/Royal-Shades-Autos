import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  /** A small drawing shown instead of the icon (see components/illustrations) */
  illustration?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, illustration, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center rounded-panel border border-line bg-surface px-6 py-12 text-center", className)}>
      {illustration ? (
        <div className="mb-[18px] flex justify-center">{illustration}</div>
      ) : (
        icon && <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-gold/10 text-gold-text">{icon}</div>
      )}
      <h2 className="text-xl font-extrabold">{title}</h2>
      {description && <p className="mt-1.5 max-w-[320px] text-sm leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-[18px] flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}
