import { cn } from "@/lib/utils";

export type ButtonVariant = "gold" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  gold: "bg-gold text-obsidian font-bold hover:bg-gold-light",
  outline: "border border-line-strong text-white font-semibold hover:border-gold hover:text-gold",
  ghost: "text-silver font-semibold hover:bg-white/5 hover:text-gold",
};

// Every size keeps the 44px minimum touch target
const SIZES: Record<ButtonSize, string> = {
  sm: "h-11 px-4 text-[13px]",
  md: "h-12 px-[22px] text-sm",
  lg: "h-[52px] px-[26px] text-[15px]",
};

export function buttonVariants({ variant = "gold", size = "md", fullWidth = false }: ButtonStyleProps = {}): string {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-control transition-colors duration-200",
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

/** Shared look for text inputs, selects and textareas */
export function fieldVariants(hasError = false): string {
  return cn(
    "w-full rounded-control border bg-graphite-2 px-4 text-sm text-white transition-[border-color,box-shadow] duration-200",
    "placeholder:text-subtle focus:border-gold focus:shadow-[0_0_0_3px_rgb(222_187_110/0.18)] focus:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-60",
    hasError ? "border-sold" : "border-line",
  );
}
