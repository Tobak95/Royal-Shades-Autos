import { useId, useRef, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name for the tab list */
  label: string;
  /** Prefix for tab ids so panels can point back with aria-labelledby */
  idPrefix?: string;
  className?: string;
}

export function Tabs<T extends string>({ items, value, onChange, label, idPrefix, className }: TabsProps<T>) {
  const autoId = useId();
  const prefix = idPrefix ?? autoId;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Arrow keys move between tabs (WAI-ARIA tabs pattern, automatic activation)
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = items.findIndex((item) => item.value === value);
    const moves: Record<string, number> = {
      ArrowRight: current + 1,
      ArrowLeft: current - 1,
      Home: 0,
      End: items.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = (moves[event.key] + items.length) % items.length;
    onChange(items[next].value);
    tabRefs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn("flex flex-wrap gap-1 rounded-xl border border-line bg-graphite p-1", className)}
    >
      {items.map((item, index) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            id={`${prefix}-tab-${item.value}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`${prefix}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.value)}
            className={cn(
              "relative min-h-11 rounded-[9px] px-2.5 text-[13px] font-semibold transition-colors duration-200 sm:px-4 sm:text-sm",
              selected ? "text-obsidian" : "text-muted hover:text-white",
            )}
          >
            {selected && (
              <motion.span
                layoutId={`${prefix}-indicator`}
                aria-hidden="true"
                className="absolute inset-0 rounded-[9px] bg-gold"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="relative">
              {item.label}
              {item.count !== undefined && <span className="ml-1 font-medium opacity-60 sm:ml-1.5">{item.count}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
