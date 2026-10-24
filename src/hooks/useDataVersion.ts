import { useSyncExternalStore } from "react";
import { getVersion, subscribe } from "@/services/mockStore";

/**
 * Bumps whenever the data store changes (e.g. an admin edit). Add it to a useQuery key
 * to refetch after changes: useQuery(`cars-${version}`, …)
 */
export function useDataVersion(): number {
  return useSyncExternalStore(subscribe, getVersion, getVersion);
}
