import { cn } from "@/lib/utils";

export type ButtonVariant = "gold" | "navy" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  // Lifts 1px on hover, as in the mockups
  gold: "bg-gold text-navy font-bold hover:bg-gold-light hover:-translate-y-px",
  navy: "bg-navy text-white font-bold hover:bg-navy-3",
  // On navy surfaces add "border-white/35 text-white hover:border-gold-light hover:text-gold-light"
  outline: "border-[1.5px] border-line-strong text-ink font-bold hover:border-navy hover:bg-surface",
  ghost: "text-muted font-semibold hover:bg-navy/5 hover:text-ink",
};

// Every size keeps the 44px minimum touch target
const SIZES: Record<ButtonSize, string> = {
  sm: "h-11 px-4 text-[13px]",
  md: "h-12 px-[22px] text-sm",
  lg: "h-[54px] px-[26px] text-[15px]",
};

export function buttonVariants({ variant = "gold", size = "md", fullWidth = false }: ButtonStyleProps = {}): string {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-control transition-[background-color,border-color,color,transform] duration-200",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    fullWidth && "w-full",
  );
}

/** aria-describedby for a control, matching the ids <Field> gives its hint and error */
export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  const ids = [error && `${id}-error`, hint && !error && `${id}-hint`].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

/** Shared look for text inputs, selects and textareas (light grey field, as in the finder card) */
export function fieldVariants(hasError = false): string {
  return cn(
    "w-full rounded-control border bg-page px-4 text-sm text-ink transition-[border-color,box-shadow,background-color] duration-200",
    "placeholder:text-faint focus:border-gold focus:bg-surface focus:shadow-[0_0_0_3px_rgb(212_175_90/0.2)] focus:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-60",
    hasError ? "border-[1.5px] border-sold bg-surface shadow-[0_0_0_4px_rgb(178_59_53/0.12)]" : "border-line",
  );
}
