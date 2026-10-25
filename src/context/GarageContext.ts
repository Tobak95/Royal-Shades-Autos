import { createContext } from "react";

/** The Garage is the cart. Every car is one of one, so it holds car IDs with no quantities. */
export interface GarageContextValue {
  carIds: string[];
  count: number;
  has: (carId: string) => boolean;
  add: (carId: string) => void;
  remove: (carId: string) => void;
  clear: () => void;
}

export const GarageContext = createContext<GarageContextValue | null>(null);
