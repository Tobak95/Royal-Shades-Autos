import { STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { CarStatus } from "@/types";

const TINTS: Record<CarStatus, string> = {
  arriving: "bg-arriving-tint text-arriving-text",
  arrived: "bg-arriving-tint text-arriving-text",
  inspection: "bg-inspection-tint text-inspection-text",
  available: "bg-available-tint text-available-text",
  sold: "bg-sold-tint text-sold",
};

/** Admin status pill (admin names: Arriving, Arrived, Inspection, Available, Sold) */
export function StatusPill({ status, className }: { status: CarStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-lg px-2.5 py-1 text-[13px] font-semibold", TINTS[status], className)}>
      {STATUS_META[status].journeyLabel}
    </span>
  );
}
