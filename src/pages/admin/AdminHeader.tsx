import type { ReactNode } from "react";

interface AdminHeaderProps {
  title: string;
  /** Last breadcrumb step, shown as "dashboard · {crumb}" */
  crumb: string;
  description?: ReactNode;
  actions?: ReactNode;
}

/** Page title with the "dashboard · page" breadcrumb, as in the Torii Gate dashboard */
export function AdminHeader({ title, crumb, description, actions }: AdminHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-ink">{title}</h1>
        <nav aria-label="Breadcrumb" className="mt-1">
          <ol className="flex items-center gap-2 text-sm text-muted lowercase">
            <li>dashboard</li>
            <li aria-hidden="true">·</li>
            <li aria-current="page" className="text-ink">
              {crumb}
            </li>
          </ol>
        </nav>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
    </div>
  );
}
