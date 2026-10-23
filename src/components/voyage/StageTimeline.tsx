import { cn } from "@/lib/utils";
import { stageDateLabel } from "@/lib/voyage";
import type { TrackingStage } from "@/types";

interface StageTimelineProps {
  stages: TrackingStage[];
  className?: string;
}

/** Vertical 7-stage timeline: done = gold, current = pulsing, upcoming = muted */
export function StageTimeline({ stages, className }: StageTimelineProps) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {stages.map((stage, index) => {
        const last = index === stages.length - 1;
        const state = stage.completed ? "done" : stage.current ? "current" : "next";
        return (
          <li key={stage.key} aria-current={stage.current ? "step" : undefined} className="flex gap-4">
            <div className="flex w-[22px] flex-none flex-col items-center">
              <span
                aria-hidden="true"
                className={cn(
                  "size-4 flex-none rounded-full",
                  state === "done" && "bg-gold",
                  state === "current" && "animate-pulse-gold border-4 border-gold bg-navy",
                  state === "next" && "border-2 border-line-strong bg-surface",
                )}
              />
              {!last && (
                <span
                  aria-hidden="true"
                  className={cn("my-1 min-h-[22px] w-0.5 flex-1", state === "done" ? "bg-gold" : "bg-line")}
                />
              )}
            </div>
            <div className="flex flex-1 justify-between gap-3 pb-[18px]">
              <div>
                <p
                  className={cn(
                    "text-[15px]",
                    state === "next" ? "font-medium text-faint" : "font-bold",
                    state === "current" ? "text-gold-text" : state === "done" && "text-ink",
                  )}
                >
                  {stage.label}
                  <span className="sr-only">
                    {state === "done" ? " (completed)" : state === "current" ? " (current stage)" : " (upcoming)"}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-faint">{stage.location}</p>
              </div>
              <p className="text-xs whitespace-nowrap text-muted">{stageDateLabel(stage)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
