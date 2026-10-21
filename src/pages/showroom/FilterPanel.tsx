import { PriceRangeSlider } from "@/components/ui/PriceRangeSlider";
import { Select } from "@/components/ui/Select";
import { useDraft } from "@/hooks/useDraft";
import { BODY_TYPES, CONDITIONS } from "@/lib/carOptions";
import type { FilterOptions } from "@/services/carService";
import { CheckboxGroup } from "./CheckboxGroup";
import type { FilterPatch, ShowroomFilters } from "./filterParams";

interface FilterPanelProps {
  filters: ShowroomFilters;
  options: FilterOptions;
  onChange: (patch: FilterPatch) => void;
}

const sameRange = (a: [number, number], b: [number, number]) => a[0] === b[0] && a[1] === b[1];

export function FilterPanel({ filters, options, onChange }: FilterPanelProps) {
  const priceFromUrl: [number, number] = [filters.minPrice ?? options.minPrice, filters.maxPrice ?? options.maxPrice];
  // Dragging updates the slider instantly; the URL (and the fetch) follows after a pause
  const [price, setPrice] = useDraft(
    priceFromUrl,
    ([min, max]) =>
      onChange({
        minPrice: min > options.minPrice ? min : undefined,
        maxPrice: max < options.maxPrice ? max : undefined,
      }),
    400,
    sameRange,
  );

  const years: string[] = [];
  for (let y = options.maxYear; y >= options.minYear; y--) years.push(String(y));
  const yearOptions = [{ value: "", label: "Any" }, ...years.map((y) => ({ value: y, label: y }))];

  return (
    <div className="flex flex-col gap-7">
      <CheckboxGroup legend="Body type" options={BODY_TYPES} selected={filters.body} onChange={(body) => onChange({ body })} />
      <CheckboxGroup
        legend="Condition"
        options={CONDITIONS}
        selected={filters.condition}
        onChange={(condition) => onChange({ condition })}
      />
      <CheckboxGroup legend="Make" options={options.makes} selected={filters.make} onChange={(make) => onChange({ make })} />

      <PriceRangeSlider
        min={options.minPrice}
        max={options.maxPrice}
        step={1_000_000}
        value={price}
        onChange={setPrice}
      />

      <fieldset>
        <legend className="mb-3 text-xs font-semibold tracking-[0.16em] text-gold uppercase">Year</legend>
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="From"
            options={yearOptions}
            value={filters.minYear ? String(filters.minYear) : ""}
            onChange={(e) => onChange({ minYear: e.target.value ? Number(e.target.value) : undefined })}
          />
          <Select
            label="To"
            options={yearOptions}
            value={filters.maxYear ? String(filters.maxYear) : ""}
            onChange={(e) => onChange({ maxYear: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </fieldset>

      <CheckboxGroup
        legend="Origin"
        options={options.origins}
        selected={filters.origin}
        onChange={(origin) => onChange({ origin })}
      />
    </div>
  );
}
