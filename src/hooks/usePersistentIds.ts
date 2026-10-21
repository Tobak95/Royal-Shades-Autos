import { useCallback, useState } from "react";
import { isStringArray, readStorage, writeStorage } from "@/lib/storage";

/** A unique list of IDs mirrored to localStorage. Shared by the Garage and Wishlist. */
export function usePersistentIds(storageKey: string) {
  const [ids, setIds] = useState<string[]>(() => readStorage(storageKey, isStringArray) ?? []);

  const update = useCallback(
    (next: (prev: string[]) => string[]) => {
      setIds((prev) => {
        const value = next(prev);
        writeStorage(storageKey, value);
        return value;
      });
    },
    [storageKey],
  );

  const add = useCallback((id: string) => update((prev) => (prev.includes(id) ? prev : [...prev, id])), [update]);
  const remove = useCallback((id: string) => update((prev) => prev.filter((x) => x !== id)), [update]);
  const toggle = useCallback(
    (id: string) => update((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [update],
  );
  const clear = useCallback(() => update(() => []), [update]);

  return { ids, add, remove, toggle, clear };
}
