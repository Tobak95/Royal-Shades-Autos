import { Outlet, useLocation, useMatches } from "react-router-dom";
import { motion } from "framer-motion";
import { SessionGuard } from "@/components/routing/SessionGuard";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { ScrollManager } from "./ScrollManager";
import { SlimFooter } from "./SlimFooter";

/** Set `handle: { footer: "slim" }` on a route to use the one-line footer */
export interface RouteHandle {
  footer?: "full" | "slim";
}

function isRouteHandle(handle: unknown): handle is RouteHandle {
  return typeof handle === "object" && handle !== null && "footer" in handle;
}

export function RootLayout() {
  const { pathname } = useLocation();
  const slimFooter = useMatches().some((match) => isRouteHandle(match.handle) && match.handle.footer === "slim");

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
      {slimFooter ? <SlimFooter /> : <Footer />}
    </div>
  );
}
