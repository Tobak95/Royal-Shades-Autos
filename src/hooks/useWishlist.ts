import { useContext } from "react";
import { WishlistContext, type WishlistContextValue } from "@/context/WishlistContext";

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
