import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const nairaFull = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

/** ₦68,500,000 — used on details, garage and reserve pages */
export function formatNaira(amount: number): string {
  return nairaFull.format(Math.round(amount));
}

const compact = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 1 });

/** ₦68.5M — used on cards */
export function formatNairaShort(amount: number): string {
  if (amount >= 1_000_000_000) return `₦${compact.format(amount / 1_000_000_000)}B`;
  if (amount >= 1_000_000) return `₦${compact.format(amount / 1_000_000)}M`;
  if (amount >= 1_000) return `₦${compact.format(amount / 1_000)}K`;
  return `₦${compact.format(amount)}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-NG").format(value);
}

export function formatMileage(mileage: number, unit: "mi" | "km"): string {
  return `${formatNumber(mileage)} ${unit}`;
}

/** Parses yyyy-mm-dd as a local date so it never shifts a day across time zones */
function toDate(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** 14 Nov 2026 */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(
    toDate(iso),
  );
}

/** 14 Nov */
export function formatDayMonth(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(toDate(iso));
}

/** "Ayo Bello" → "AB", "Tobi" → "T"; falls back to the email's first letter */
export function getInitials(fullName: string, email = ""): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? words[0][0] + words[words.length - 1][0] : (words[0]?.[0] ?? email[0] ?? "?");
  return letters.toUpperCase();
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
