import { Checkbox } from "@/components/ui/Checkbox";

interface CheckboxGroupProps<T extends string> {
  legend: string;
  options: readonly T[];
  selected: T[];
  onChange: (selected: T[]) => void;
}

export function CheckboxGroup<T extends string>({ legend, options, selected, onChange }: CheckboxGroupProps<T>) {
  function toggle(option: T, checked: boolean) {
    onChange(checked ? [...selected, option] : selected.filter((s) => s !== option));
  }

  return (
    <fieldset>
      <legend className="mb-1.5 text-xs font-semibold tracking-[0.16em] text-gold uppercase">{legend}</legend>
      <div className="flex flex-col">
        {options.map((option) => (
          <Checkbox
            key={option}
            label={option}
            checked={selected.includes(option)}
            onChange={(e) => toggle(option, e.target.checked)}
            className="text-sm"
          />
        ))}
      </div>
    </fieldset>
  );
}
