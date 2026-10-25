import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ScrollManager } from "@/components/layout/ScrollManager";
import { SessionGuard } from "@/components/routing/SessionGuard";
import { useDialog } from "@/hooks/useDialog";
import { AdminSidebar } from "./layout/AdminSidebar";
import { AdminTopBar } from "./layout/AdminTopBar";

/**
 * Dashboard shell (outside the public site's navbar and footer): fixed navy sidebar
 * on desktop, a slide-in sidebar on phones, and a white top bar.
 */
export function AdminLayout() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const { ref: menuRef, onKeyDown: onMenuKeyDown } = useDialog<HTMLDivElement>(menuOpen, closeMenu);

  return (
    <div className="min-h-dvh bg-admin-page">
      <a
        href="#admin-main"
        className="sr-only z-50 rounded-control bg-gold px-4 py-3 font-bold text-navy focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <ScrollManager />
      <SessionGuard />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-navy md:block">
        <AdminSidebar />
      </aside>

      {/* Phones: the same sidebar as a slide-in panel */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              aria-hidden="true"
              onClick={closeMenu}
              className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              ref={menuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Admin menu"
              tabIndex={-1}
              onKeyDown={onMenuKeyDown}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-navy focus:outline-none"
            >
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close admin menu"
                className="absolute top-3 right-3 z-10 flex size-11 items-center justify-center rounded-full text-white hover:bg-white/10"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
              <AdminSidebar onNavigate={closeMenu} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex min-h-dvh flex-col md:pl-64">
        <AdminTopBar onOpenSidebar={() => setMenuOpen(true)} sidebarOpen={menuOpen} />
        <main id="admin-main" tabIndex={-1} className="flex-1 px-4 py-6 focus:outline-none md:px-8 md:py-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mx-auto max-w-[1160px]"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
