import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Field } from "./Field";
import { describedBy, fieldVariants } from "./variants";

type TextareaProps = ComponentProps<"textarea"> & {
  label: string;
  error?: string;
  hint?: string;
  hideLabel?: boolean;
  containerClassName?: string;
};

export function Textarea({
  label,
  error,
  hint,
  hideLabel,
  containerClassName,
  className,
  id,
  rows = 5,
  ...props
}: TextareaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;

  return (
    <Field id={textareaId} label={label} error={error} hint={hint} hideLabel={hideLabel} className={containerClassName}>
      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(textareaId, error, hint)}
        className={cn(fieldVariants(Boolean(error)), "resize-y py-3 leading-relaxed", className)}
        {...props}
      />
    </Field>
  );
}
