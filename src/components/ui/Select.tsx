import { useId, type ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Field } from "./Field";
import { describedBy, fieldVariants } from "./variants";

export interface SelectOption {
  value: string;
  label: string;
}

type SelectProps = ComponentProps<"select"> & {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
  hideLabel?: boolean;
  containerClassName?: string;
};

export function Select({
  label,
  options,
  placeholder,
  error,
  hint,
  hideLabel,
  containerClassName,
  className,
  id,
  ...props
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;

  return (
    <Field id={selectId} label={label} error={error} hint={hint} hideLabel={hideLabel} className={containerClassName}>
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(selectId, error, hint)}
          className={cn(fieldVariants(Boolean(error)), "h-[50px] appearance-none pr-11", className)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-graphite-2">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted"
        />
      </div>
    </Field>
  );
}
