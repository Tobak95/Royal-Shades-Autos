import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { ScrollManager } from "./ScrollManager";

export function RootLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-control bg-gold px-4 py-3 font-bold text-obsidian focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <ScrollManager />
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
      <Footer />
    </div>
  );
}
