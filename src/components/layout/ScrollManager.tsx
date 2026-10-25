import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * - URL with a #hash: smooth-scrolls to that section once it has rendered
 * - New page without a hash: jumps to the top
 * - Query-string changes on the same page (filters, tabs): leaves scroll alone
 * - Back/forward: leaves it to the browser
 */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const lastPathname = useRef(pathname);

  useEffect(() => {
    const pathChanged = lastPathname.current !== pathname;
    lastPathname.current = pathname;
    if (navigationType === "POP" && !hash) return;

    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      let frame = 0;
      let attempts = 0;
      // The target may not exist yet (page transition or async data), so retry briefly
      const tryScroll = () => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
        } else if (attempts++ < 60) {
          frame = requestAnimationFrame(tryScroll);
        }
      };
      frame = requestAnimationFrame(tryScroll);
      return () => cancelAnimationFrame(frame);
    }

    // "instant" bypasses the CSS smooth scrolling so new pages open at the top
    if (pathChanged) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash, key, navigationType]);

  return null;
}
