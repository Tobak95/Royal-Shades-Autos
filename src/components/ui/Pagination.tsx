import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

type PageItem = number | "gap-start" | "gap-end";

/** 1 … 4 5 6 … 12 — always shows first, last and the pages around the current one */
function getPageItems(page: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  const items: PageItem[] = [1];
  if (start > 2) items.push("gap-start");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push("gap-end");
  items.push(total);
  return items;
}

const itemClass =
  "flex size-11 items-center justify-center rounded-control border text-sm font-semibold transition-colors";

export function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-2", className)}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(itemClass, "border-line text-ink hover:border-gold hover:text-gold-text disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink")}
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
      </button>
      <ul className="flex items-center gap-2">
        {getPageItems(page, totalPages).map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <button
                type="button"
                onClick={() => onChange(item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  itemClass,
                  item === page
                    ? "border-gold bg-gold text-navy"
                    : "border-line text-muted hover:border-gold hover:text-gold-text",
                )}
              >
                {item}
              </button>
            </li>
          ) : (
            <li key={item} aria-hidden="true" className="px-1 text-muted">
              …
            </li>
          ),
        )}
      </ul>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={cn(itemClass, "border-line text-ink hover:border-gold hover:text-gold-text disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink")}
      >
        <ChevronRight aria-hidden="true" className="size-4" />
      </button>
    </nav>
  );
}
