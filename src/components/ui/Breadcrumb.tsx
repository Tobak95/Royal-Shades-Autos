import { Fragment } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  /** Omit for the current page */
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** "light" on navy or dark photos */
  tone?: "dark" | "light";
  className?: string;
}

export function Breadcrumb({ items, tone = "dark", className }: BreadcrumbProps) {
  const light = tone === "light";
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", light ? "text-on-navy-muted" : "text-muted", className)}>
      <ol className="flex flex-wrap items-center gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={`${item.label}-${index}`}>
              <li>
                {item.to && !isLast ? (
                  <Link
                    to={item.to}
                    className={cn("transition-colors", light ? "hover:text-gold-light" : "hover:text-gold-text")}
                  >
                    {item.label}
                  </Link>
                ) : (
                  // Current page: bold ink, as in the v2 mockups
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={cn(isLast && "font-semibold", isLast && (light ? "text-white" : "text-ink"))}
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true" className="mx-1.5">
                  ›
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
