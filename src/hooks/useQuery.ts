import { useEffect, useEffectEvent, useState } from "react";

interface QueryState<T> {
  key: string;
  data?: T;
  error?: unknown;
}

export interface QueryResult<T> {
  data: T | undefined;
  error: unknown;
  loading: boolean;
}

/**
 * Runs `fetcher` whenever `key` changes and ignores stale responses.
 * `loading` is derived (the stored result belongs to an older key), so no
 * state is set synchronously inside the effect.
 */
export function useQuery<T>(key: string, fetcher: () => Promise<T>): QueryResult<T> {
  const [state, setState] = useState<QueryState<T> | null>(null);
  const run = useEffectEvent(fetcher);

  useEffect(() => {
    let active = true;
    run().then(
      (data) => active && setState({ key, data }),
      (error: unknown) => active && setState({ key, error }),
    );
    return () => {
      active = false;
    };
  }, [key]);

  const ready = state?.key === key;
  return {
    data: ready ? state.data : undefined,
    error: ready ? state.error : undefined,
    loading: !ready,
  };
}
