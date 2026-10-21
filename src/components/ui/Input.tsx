import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Field } from "./Field";
import { describedBy, fieldVariants } from "./variants";

export type InputProps = ComponentProps<"input"> & {
  label: string;
  error?: string;
  hint?: string;
  labelAction?: ReactNode;
  hideLabel?: boolean;
  containerClassName?: string;
};

export function Input({
  label,
  error,
  hint,
  labelAction,
  hideLabel,
  containerClassName,
  className,
  id,
  ...props
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <Field
      id={inputId}
      label={label}
      error={error}
      hint={hint}
      labelAction={labelAction}
      hideLabel={hideLabel}
      className={containerClassName}
    >
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, error, hint)}
        className={cn(fieldVariants(Boolean(error)), "h-[50px]", className)}
        {...props}
      />
    </Field>
  );
}
