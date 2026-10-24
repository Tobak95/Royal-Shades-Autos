import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
}

/** Pages to show: first, last, and the current page with its neighbours; gaps become "…" */
function pageItems(page: number, total: number): (number | "gap")[] {
  const wanted = [...new Set([1, page - 1, page, page + 1, total])].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return wanted.flatMap((p, i) => (i > 0 && p - wanted[i - 1] > 1 ? ["gap" as const, p] : [p]));
}

const square = "flex size-11 items-center justify-center rounded-lg text-sm font-semibold transition-colors";

/** Prev / page numbers / next on the left, "Page x of y" on the right (Torii Gate layout) */
export function AdminPagination({ page, totalPages, onPage }: AdminPaginationProps) {
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-surface p-3 sm:p-4">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className={cn(square, "bg-admin-page text-ink hover:bg-line disabled:opacity-40 disabled:hover:bg-admin-page")}
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>
        {pageItems(page, totalPages).map((p, i) =>
          p === "gap" ? (
            <span key={`gap-${i}`} aria-hidden="true" className={cn(square, "text-muted")}>
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPage(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
              className={cn(square, p === page ? "bg-navy text-white" : "border border-line text-ink hover:border-navy")}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className={cn(square, "bg-admin-page text-ink hover:bg-line disabled:opacity-40 disabled:hover:bg-admin-page")}
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>
      <p className="flex items-center gap-2 text-sm text-muted">
        Page
        <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-navy px-2 font-bold text-white">{page}</span>
        of
        <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-admin-page px-2 font-bold text-ink">{totalPages}</span>
      </p>
    </nav>
  );
}
