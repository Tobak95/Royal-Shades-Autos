import { Link } from "react-router-dom";
import { STATUS_JOURNEY, STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { AdminOverview } from "@/types";

/** One labelled bar per status (count at the tip); each row opens the filtered car list */
export function StockByStatus({ counts }: { counts: AdminOverview["counts"] }) {
  const max = Math.max(...STATUS_JOURNEY.map((s) => counts[s]), 1);

  return (
    <ul className="flex flex-col gap-1">
      {STATUS_JOURNEY.map((status) => {
        const count = counts[status];
        return (
          <li key={status}>
            <Link
              to={`/admin/cars?status=${status}`}
              aria-label={`${STATUS_META[status].journeyLabel}: ${count} ${count === 1 ? "car" : "cars"}`}
              className="block rounded-lg px-2 py-2 transition-colors hover:bg-admin-page"
            >
              <span aria-hidden="true" className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-ink">
                  <span className={cn("size-2 rounded-full", STATUS_META[status].barClass)} />
                  {STATUS_META[status].journeyLabel}
                </span>
                <span className="font-semibold text-ink tabular-nums">{count}</span>
              </span>
              <span aria-hidden="true" className="mt-1.5 block h-2 overflow-hidden rounded-full bg-line-soft">
                <span className={cn("block h-full rounded-full", STATUS_META[status].barClass)} style={{ width: `${(count / max) * 100}%` }} />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
