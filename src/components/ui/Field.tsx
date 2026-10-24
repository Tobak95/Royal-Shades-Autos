import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  /** Rendered on the right of the label row, e.g. "Forgot password?" */
  labelAction?: ReactNode;
  /** Keeps the label for screen readers only */
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
}

/** Label + control + hint/error, shared by every form control */
export function Field({ id, label, error, hint, labelAction, hideLabel, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className={cn("flex items-center justify-between gap-3", hideLabel && "sr-only")}>
        <label htmlFor={id} className="text-[13px] font-semibold text-muted">
          {label}
        </label>
        {labelAction}
      </div>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="flex items-start gap-1.5 text-[13px] leading-snug font-medium text-sold">
          <CircleAlert aria-hidden="true" className="mt-px size-4 flex-none" strokeWidth={2.2} />
          {error}
        </p>
      )}
    </div>
  );
}
