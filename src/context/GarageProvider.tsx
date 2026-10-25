import { useMemo, type ReactNode } from "react";
import { GarageContext, type GarageContextValue } from "./GarageContext";
import { usePersistentIds } from "@/hooks/usePersistentIds";
import { STORAGE_KEYS } from "@/lib/storage";

export function GarageProvider({ children }: { children: ReactNode }) {
  const { ids, add, remove, clear } = usePersistentIds(STORAGE_KEYS.garage);

  const value = useMemo<GarageContextValue>(
    () => ({ carIds: ids, count: ids.length, has: (id) => ids.includes(id), add, remove, clear }),
    [ids, add, remove, clear],
  );

  return <GarageContext.Provider value={value}>{children}</GarageContext.Provider>;
}
