import { STATUS_JOURNEY, STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { CarStatus } from "@/types";

interface JourneyBarProps {
  status: CarStatus;
  className?: string;
}

/** "This car's journey": Arriving → Arrived → Inspection → Available → Sold */
export function JourneyBar({ status, className }: JourneyBarProps) {
  const current = STATUS_JOURNEY.indexOf(status);

  return (
    <div className={cn("rounded-2xl border border-line bg-surface px-[18px] py-4", className)}>
      <p id="journey-heading" className="text-[13px] font-bold text-muted">
        This car's journey
      </p>
      <ol aria-labelledby="journey-heading" className="mt-3 flex items-start gap-1.5">
        {STATUS_JOURNEY.map((step, index) => {
          const meta = STATUS_META[step];
          const state = index < current ? "done" : index === current ? "current" : "next";
          return (
            <li key={step} aria-current={state === "current" ? "step" : undefined} className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span
                aria-hidden="true"
                className={cn(
                  "h-1.5 rounded-full",
                  state === "done" ? "bg-navy" : state === "current" ? meta.barClass : "bg-line",
                )}
              />
              <span
                className={cn(
                  "truncate text-[11px]",
                  state === "current" ? cn("font-extrabold", meta.textClass) : "font-semibold",
                  state === "done" && "text-ink",
                  state === "next" && "text-faint",
                )}
              >
                {meta.journeyLabel}
                <span className="sr-only">
                  {state === "done" ? " (done)" : state === "current" ? " (current)" : " (not yet)"}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
