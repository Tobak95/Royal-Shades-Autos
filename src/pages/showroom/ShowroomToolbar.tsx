import { useId } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Tabs } from "@/components/ui/Tabs";
import { useDraft } from "@/hooks/useDraft";
import { SORT_OPTIONS } from "@/lib/carOptions";
import { fieldVariants } from "@/components/ui/variants";
import { STATUS_TABS } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { StatusCounts } from "@/types";
import type { FilterPatch, ShowroomFilters } from "./filterParams";

interface ShowroomToolbarProps {
  filters: ShowroomFilters;
  counts: StatusCounts | undefined;
  activeFilterCount: number;
  onChange: (patch: FilterPatch) => void;
  onOpenFilters: () => void;
}

export function ShowroomToolbar({ filters, counts, activeFilterCount, onChange, onOpenFilters }: ShowroomToolbarProps) {
  const searchId = useId();
  const [search, setSearch] = useDraft(filters.q, (q) => onChange({ q: q.trim() }));

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        items={STATUS_TABS.map((t) => ({ ...t, count: counts?.[t.value] }))}
        value={filters.status}
        onChange={(status) => onChange({ status })}
        label="Filter by status"
        idPrefix="showroom"
        className="w-fit"
      />
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-[1_1_260px]">
          <label htmlFor={searchId} className="sr-only">
            Search cars
          </label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
            <input
              id={searchId}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, VIN"
              className={cn(fieldVariants(), "h-[50px] pl-11")}
            />
          </div>
        </div>
        <Select
          label="Sort by"
          hideLabel
          options={SORT_OPTIONS}
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value as ShowroomFilters["sort"] })}
          containerClassName="flex-[0_1_220px] min-w-[180px]"
        />
        <button
          type="button"
          onClick={onOpenFilters}
          className="flex h-[50px] items-center gap-2 rounded-control border border-line bg-page px-4 text-sm font-semibold transition-colors hover:border-gold hover:text-gold-text lg:hidden"
        >
          <SlidersHorizontal aria-hidden="true" className="size-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[11px] font-extrabold text-navy">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
