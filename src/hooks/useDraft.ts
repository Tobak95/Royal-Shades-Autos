import { useEffect, useEffectEvent, useState } from "react";

/**
 * Local "draft" of a value that lives elsewhere (e.g. the URL). Typing updates the
 * draft instantly and commits it after `delay` ms; outside changes reset the draft.
 */
export function useDraft<T>(
  external: T,
  onCommit: (value: T) => void,
  delay = 350,
  isEqual: (a: T, b: T) => boolean = Object.is,
) {
  const [draft, setDraft] = useState(external);
  const [lastExternal, setLastExternal] = useState(external);

  // Adjust state while rendering when the source changes (React's recommended pattern)
  if (!isEqual(external, lastExternal)) {
    setLastExternal(external);
    setDraft(external);
  }

  const commit = useEffectEvent(onCommit);
  useEffect(() => {
    if (isEqual(draft, external)) return;
    const timer = setTimeout(() => commit(draft), delay);
    return () => clearTimeout(timer);
  }, [draft, external, delay, isEqual]);

  return [draft, setDraft] as const;
}
