import { useState } from "react";
import { cn } from "@/lib/utils";

interface SalesChartProps {
  /** Oldest first; month is "yyyy-mm" */
  data: { month: string; count: number }[];
}

const PLOT_HEIGHT = 180;
const monthLabel = (month: string, style: "short" | "long") =>
  new Date(`${month}-01T00:00:00`).toLocaleDateString("en-GB", style === "short" ? { month: "short" } : { month: "long", year: "numeric" });
const carsSold = (n: number) => `${n} ${n === 1 ? "car" : "cars"} sold`;

/**
 * "Cars sold per month": one series of navy columns (<=24px, 4px rounded tops) on hairline
 * gridlines, a value on the latest column, hover/focus tooltips, and a screen-reader table.
 */
export function SalesChart({ data }: SalesChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.count), 0);
  // Whole-number ticks: 0 up to a clean top (at least 4)
  const step = Math.max(1, Math.ceil(max / 4));
  const top = Math.max(4, step * 4);
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step).reverse();
  const last = data.length - 1;

  return (
    <div>
      <div className="flex gap-3" role="group" aria-label="Cars sold per month, last 6 months">
        {/* Y axis */}
        <div aria-hidden="true" className="relative w-6 flex-none text-right text-xs text-muted tabular-nums" style={{ height: PLOT_HEIGHT }}>
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: `${(1 - t / top) * 100}%` }}>
              {t}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative" style={{ height: PLOT_HEIGHT }}>
            {ticks.map((t) => (
              <div key={t} aria-hidden="true" className="absolute inset-x-0 h-px bg-line-soft" style={{ top: `${(1 - t / top) * 100}%` }} />
            ))}
            <div className="absolute inset-0 flex">
              {data.map((d, i) => (
                <div
                  key={d.month}
                  tabIndex={0}
                  role="img"
                  aria-label={`${monthLabel(d.month, "long")}: ${carsSold(d.count)}`}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="group relative flex flex-1 items-end justify-center rounded-md focus:outline-2 focus:outline-gold"
                >
                  {active === i && <div aria-hidden="true" className="absolute inset-x-1 inset-y-0 rounded-md bg-navy/[0.04]" />}
                  {d.count > 0 && (
                    <div
                      aria-hidden="true"
                      className={cn("relative w-full max-w-6 rounded-t-[4px] bg-navy transition-opacity", active !== null && active !== i && "opacity-60")}
                      style={{ height: `${(d.count / top) * 100}%` }}
                    >
                      {i === last && <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-semibold text-ink">{d.count}</span>}
                    </div>
                  )}
                  {active === i && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 rounded-lg bg-navy px-2.5 py-1.5 text-xs whitespace-nowrap text-white shadow-chip"
                    >
                      <span className="font-semibold">{monthLabel(d.month, "long")}</span>
                      <span className="block text-on-navy-soft">{carsSold(d.count)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* X axis */}
          <div aria-hidden="true" className="mt-2 flex border-t border-line pt-2 text-xs text-muted">
            {data.map((d) => (
              <span key={d.month} className="flex-1 text-center">
                {monthLabel(d.month, "short")}
              </span>
            ))}
          </div>
        </div>
      </div>

      <table className="sr-only">
        <caption>Cars sold per month</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Cars sold</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.month}>
              <th scope="row">{monthLabel(d.month, "long")}</th>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
