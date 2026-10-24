import { Outlet, useLocation, useMatches } from "react-router-dom";
import { motion } from "framer-motion";
import { SessionGuard } from "@/components/routing/SessionGuard";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { ScrollManager } from "./ScrollManager";
import { TopInfoBar } from "./TopInfoBar";

/**
 * Per-route layout options via `handle`:
 * - footerCta: false hides the gold "Ready for your next car?" card (auth pages, reserve)
 * - topBar: true for the address / WhatsApp bar above the navbar (home page)
 */
export interface RouteHandle {
  footerCta?: boolean;
  topBar?: boolean;
}

function isRouteHandle(handle: unknown): handle is RouteHandle {
  return typeof handle === "object" && handle !== null;
}

export function RootLayout() {
  const { pathname } = useLocation();
  const handles = useMatches()
    .map((match) => match.handle)
    .filter(isRouteHandle);
  const hideCta = handles.some((h) => h.footerCta === false);
  const topBar = handles.some((h) => h.topBar);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-control bg-gold px-4 py-3 font-bold text-navy focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <ScrollManager />
      <SessionGuard />
      {topBar && <TopInfoBar />}
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* Subtle fade on each page change */}
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer showCta={!hideCta} />
    </div>
  );
}
