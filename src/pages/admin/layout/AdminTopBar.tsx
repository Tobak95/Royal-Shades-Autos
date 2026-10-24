import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMenuButton } from "@/hooks/useMenuButton";
import { useSignOut } from "@/hooks/useSignOut";
import { cn, firstName, getInitials } from "@/lib/utils";

interface AdminTopBarProps {
  onOpenSidebar: () => void;
  sidebarOpen: boolean;
}

/** White bar: menu toggle (phones), welcome line, and the admin's avatar with a log out dropdown */
export function AdminTopBar({ onOpenSidebar, sidebarOpen }: AdminTopBarProps) {
  const { user } = useAuth();
  const signOut = useSignOut();
  const { open, close, wrapperRef, buttonRef, menuRef, buttonProps, menuProps } = useMenuButton();
  if (!user) return null;
  const name = firstName(user.fullName) || user.email;

  return (
    <header className="sticky top-0 z-30 flex min-h-[72px] items-center gap-3 border-b border-line bg-surface px-4 md:px-8">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open admin menu"
        aria-expanded={sidebarOpen}
        className="-ml-2 flex size-11 items-center justify-center rounded-full text-ink hover:bg-navy/5 md:hidden"
      >
        <Menu aria-hidden="true" className="size-6" />
      </button>

      <p className="min-w-0 flex-1 truncate text-lg font-light md:text-xl">
        Welcome back, <span className="font-semibold">{name}</span>
      </p>

      <div ref={wrapperRef} className="relative">
        <button
          ref={buttonRef}
          {...buttonProps}
          aria-label={`Account menu for ${user.fullName}`}
          className="flex min-h-11 items-center gap-2.5 rounded-full py-1 pr-2 pl-1 text-left transition-colors hover:bg-navy/5"
        >
          <span aria-hidden="true" className="flex size-10 flex-none items-center justify-center rounded-full bg-gold text-sm font-extrabold text-navy">
            {getInitials(user.fullName, user.email)}
          </span>
          <span className="hidden max-w-[220px] md:block">
            <span className="block truncate text-sm font-bold">{user.fullName}</span>
            <span className="block truncate text-[13px] text-muted">{user.email}</span>
          </span>
          <ChevronDown aria-hidden="true" className={cn("size-5 text-muted transition-transform", open && "rotate-180")} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
              transition={{ duration: 0.18 }}
              className="absolute top-[calc(100%+8px)] right-0 z-50 w-56 rounded-xl border border-line bg-surface p-1.5 shadow-float"
            >
              <div className="border-b border-line px-3 pt-2 pb-2.5 md:hidden">
                <p className="truncate text-sm font-bold">{user.fullName}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
              <div ref={menuRef} {...menuProps} className="pt-1 md:pt-0">
                <button
                  role="menuitem"
                  tabIndex={-1}
                  type="button"
                  onClick={() => {
                    close(false);
                    signOut();
                  }}
                  className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold text-sold hover:bg-sold/10 focus:bg-sold/10 focus:outline-none"
                >
                  <LogOut aria-hidden="true" className="size-4" /> Log out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
