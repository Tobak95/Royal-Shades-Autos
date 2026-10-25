import { createContext } from "react";

export interface WishlistContextValue {
  carIds: string[];
  count: number;
  has: (carId: string) => boolean;
  toggle: (carId: string) => void;
  remove: (carId: string) => void;
  clear: () => void;
}

export const WishlistContext = createContext<WishlistContextValue | null>(null);
