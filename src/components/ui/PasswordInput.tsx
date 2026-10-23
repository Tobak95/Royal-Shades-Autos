import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Field } from "./Field";
import type { InputProps } from "./Input";
import { describedBy, fieldVariants } from "./variants";

type PasswordInputProps = Omit<InputProps, "type">;

export function PasswordInput({
  label,
  error,
  hint,
  labelAction,
  hideLabel,
  containerClassName,
  className,
  id,
  ...props
}: PasswordInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

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
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, error, hint)}
          className={cn(fieldVariants(Boolean(error)), "h-[50px] pr-[52px]", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          aria-controls={inputId}
          className="absolute top-[3px] right-[3px] flex size-11 items-center justify-center rounded-control text-muted transition-colors hover:text-gold-text"
        >
          <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
        </button>
      </div>
    </Field>
  );
}
