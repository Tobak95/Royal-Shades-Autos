import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MonthOverMonth } from "@/types";

interface StatCardProps {
  label: string;
  value: number;
  /** Shows a "+2 vs last month" chip (up is good for every stat here) */
  trend?: MonthOverMonth;
  /** Neutral note instead of a trend, e.g. "2 due in 14 days" */
  note?: string;
}

/** Label above, white card with the big number and a trend chip (Torii Gate stat card) */
export function StatCard({ label, value, trend, note }: StatCardProps) {
  const delta = trend ? trend.thisMonth - trend.lastMonth : 0;
  const tone = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const Icon = tone === "up" ? TrendingUp : tone === "down" ? TrendingDown : Minus;

  return (
    <div>
      <h2 className="mb-2.5 pl-1 text-[15px] font-medium text-muted">{label}</h2>
      <div className="flex min-h-[84px] flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-card bg-surface px-4 py-3">
        <p className="text-[28px] leading-none font-semibold text-ink">{value}</p>
        {trend ? (
          <p className="flex items-center gap-2 text-sm text-muted">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-1 font-semibold",
                tone === "up" && "bg-available-tint text-available-text",
                tone === "down" && "bg-sold-tint text-sold",
                tone === "flat" && "bg-admin-page text-muted",
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              {delta > 0 ? `+${delta}` : delta}
            </span>
            vs last month
          </p>
        ) : (
          note && <p className="rounded-md bg-arriving-tint px-2 py-1 text-sm font-semibold text-arriving-text">{note}</p>
        )}
      </div>
    </div>
  );
}
