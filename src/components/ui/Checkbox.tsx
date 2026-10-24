import { useId, type ComponentProps, type ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  label: ReactNode;
  error?: string;
  containerClassName?: string;
};

export function Checkbox({ label, error, containerClassName, className, id, ...props }: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className={containerClassName}>
      <label htmlFor={inputId} className="flex min-h-11 items-center gap-2.5 text-[13px] text-muted">
        <input
          id={inputId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn("size-[18px] flex-none accent-gold", className)}
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${inputId}-error`} role="alert" className="flex items-start gap-1.5 text-[13px] leading-snug font-medium text-sold">
          <CircleAlert aria-hidden="true" className="mt-px size-4 flex-none" strokeWidth={2.2} />
          {error}
        </p>
      )}
    </div>
  );
}
