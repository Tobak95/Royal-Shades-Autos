import { useMemo, type ReactNode } from "react";
import { WishlistContext, type WishlistContextValue } from "./WishlistContext";
import { usePersistentIds } from "@/hooks/usePersistentIds";
import { STORAGE_KEYS } from "@/lib/storage";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { ids, toggle, remove, clear } = usePersistentIds(STORAGE_KEYS.wishlist);

  const value = useMemo<WishlistContextValue>(
    () => ({ carIds: ids, count: ids.length, has: (id) => ids.includes(id), toggle, remove, clear }),
    [ids, toggle, remove, clear],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
