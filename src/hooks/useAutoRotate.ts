import { useEffect, useState } from "react";

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Index for an auto-advancing carousel. Advances every `intervalMs` unless paused,
 * the tab is hidden, or the user prefers reduced motion (then only manual controls work).
 */
export function useAutoRotate(count: number, intervalMs: number, paused: boolean) {
  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(() => typeof document !== "undefined" && document.hidden);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const running = count > 1 && !paused && !hidden && !prefersReducedMotion();

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearInterval(timer);
  }, [running, count, intervalMs]);

  // Keep the index valid if the number of slides shrinks
  const safeIndex = count > 0 ? index % count : 0;
  const go = (delta: number) => setIndex((safeIndex + delta + count) % count);

  return { index: safeIndex, setIndex, next: () => go(1), prev: () => go(-1), running };
}
