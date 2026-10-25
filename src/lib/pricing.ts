import { POLICY } from "./site";
import { isReservable } from "./status";
import type { Car } from "@/types";

export interface GarageTotals {
  subtotal: number;
  deposit: number;
  balance: number;
}

/** Only available, arriving and arrived cars can be reserved, so only they count */
export function getGarageTotals(cars: Car[]): GarageTotals {
  const subtotal = cars.filter(isReservable).reduce((sum, c) => sum + c.price, 0);
  const deposit = Math.round(subtotal * POLICY.depositRate);
  return { subtotal, deposit, balance: subtotal - deposit };
}
