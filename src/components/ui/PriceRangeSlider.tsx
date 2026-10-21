import { useId } from "react";
import { cn, formatNairaShort } from "@/lib/utils";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  label?: string;
  format?: (value: number) => string;
  className?: string;
}

export function PriceRangeSlider({
  min,
  max,
  step = 500_000,
  value,
  onChange,
  label = "Price range",
  format = formatNairaShort,
  className,
}: PriceRangeSliderProps) {
  const labelId = useId();
  const [low, high] = value;
  const span = max - min || 1;
  const lowPct = ((low - min) / span) * 100;
  const highPct = ((high - min) / span) * 100;

  return (
    <div role="group" aria-labelledby={labelId} className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span id={labelId} className="text-[13px] font-semibold text-silver">
          {label}
        </span>
        <span className="text-[13px] font-semibold text-gold" aria-live="polite">
          {format(low)} – {format(high)}
        </span>
      </div>
      <div className="relative h-6">
        <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
        <div
          aria-hidden="true"
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-gold"
          style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          aria-label="Minimum price"
          aria-valuetext={format(low)}
          onChange={(e) => onChange([Math.min(Number(e.target.value), high - step), high])}
          className="range-thumb absolute inset-0 h-6 w-full"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          aria-label="Maximum price"
          aria-valuetext={format(high)}
          onChange={(e) => onChange([low, Math.max(Number(e.target.value), low + step)])}
          className="range-thumb absolute inset-0 h-6 w-full"
        />
      </div>
      <div className="flex justify-between text-xs text-muted">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}
