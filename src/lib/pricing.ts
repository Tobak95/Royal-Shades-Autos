import { POLICY } from "./site";
import type { Car } from "@/types";

export interface GarageTotals {
  subtotal: number;
  deposit: number;
  balance: number;
}

/** Sold cars can't be reserved, so they're left out of the totals */
export function getGarageTotals(cars: Car[]): GarageTotals {
  const subtotal = cars.filter((c) => c.status !== "sold").reduce((sum, c) => sum + c.price, 0);
  const deposit = Math.round(subtotal * POLICY.depositRate);
  return { subtotal, deposit, balance: subtotal - deposit };
}
