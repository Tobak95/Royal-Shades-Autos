import { ChevronDown } from "lucide-react";
import { STATUS_JOURNEY, STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { CarStatus } from "@/types";

const TINTS: Record<CarStatus, string> = {
  arriving: "bg-arriving-tint text-arriving-text",
  arrived: "bg-arriving-tint text-arriving-text",
  inspection: "bg-inspection-tint text-inspection-text",
  available: "bg-available-tint text-available-text",
  sold: "bg-sold-tint text-sold",
};

interface StatusSelectProps {
  value: CarStatus;
  onChange: (status: CarStatus) => void;
  label: string;
  disabled?: boolean;
}

/** Quick status dropdown for a table row, tinted in the status colour (admin names, not customer labels) */
export function StatusSelect({ value, onChange, label, disabled }: StatusSelectProps) {
  return (
    <div className="relative inline-flex">
      <select
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as CarStatus)}
        className={cn(
          "h-11 appearance-none rounded-full border-0 pr-9 pl-3.5 text-[13px] font-bold focus:outline-2 focus:outline-gold disabled:opacity-60",
          TINTS[value],
        )}
      >
        {STATUS_JOURNEY.map((status) => (
          <option key={status} value={status} className="bg-surface text-ink">
            {STATUS_META[status].journeyLabel}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 opacity-70" />
    </div>
  );
}
