import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { Heart, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useSignOut } from "@/hooks/useSignOut";
import { MAIN_NAV } from "@/lib/site";
import { cn, getInitials } from "@/lib/utils";
import { Container } from "./Container";
import { SearchPill } from "./SearchPill";

interface MobileMenuProps {
  id: string;
  open: boolean;
  onClose: () => void;
  wishlistCount: number;
}

const linkClass = "flex min-h-12 items-center rounded-control px-3 text-base font-semibold transition-colors";

export function MobileMenu({ id, open, onClose, wishlistCount }: MobileMenuProps) {
  const { user, isAdmin } = useAuth();
  const signOut = useSignOut();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={id}
          key="mobile-menu"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden border-t border-white/6 bg-obsidian lg:hidden"
        >
          <Container className="flex flex-col gap-4 pt-4 pb-6">
            {user && (
              <div className="flex items-center gap-3 rounded-xl border border-line bg-graphite p-3">
                <span
                  aria-hidden="true"
                  className="flex size-11 flex-none items-center justify-center rounded-full bg-gold text-sm font-extrabold text-obsidian"
                >
                  {getInitials(user.fullName, user.email)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{user.fullName}</p>
                  <p className="truncate text-xs text-muted">{user.email}</p>
                </div>
              </div>
            )}

            <SearchPill onSearch={onClose} />
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {MAIN_NAV.map((item, index) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * index + 0.06 }}
                  >
                    {item.to.includes("#") ? (
                      <Link to={item.to} onClick={onClose} className={cn(linkClass, "text-silver hover:text-gold")}>
                        {item.label}
                      </Link>
                    ) : (
                      <NavLink
                        to={item.to}
                        onClick={onClose}
                        className={({ isActive }) =>
                          cn(linkClass, isActive ? "bg-white/4 text-gold" : "text-silver hover:text-gold")
                        }
                      >
                        {item.label}
                      </NavLink>
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-1 border-t border-line pt-4">
              <Link to="/account?tab=wishlist" onClick={onClose} className={cn(linkClass, "gap-3 text-silver hover:text-gold")}>
                <Heart aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
                Wishlist
                {wishlistCount > 0 && <span className="ml-auto text-sm text-gold">{wishlistCount}</span>}
              </Link>
              {user && (
                <>
                  <Link to="/account" onClick={onClose} className={cn(linkClass, "gap-3 text-silver hover:text-gold")}>
                    <UserRound aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
                    My account
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={onClose} className={cn(linkClass, "gap-3 text-silver hover:text-gold")}>
                      <LayoutDashboard aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
                      Admin dashboard
                    </Link>
                  )}
                </>
              )}
            </div>

            {user ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  signOut();
                }}
                className="flex h-12 items-center justify-center gap-2.5 rounded-control border border-sold/40 text-sm font-semibold text-sold-text transition-colors hover:bg-sold/10"
              >
                <LogOut aria-hidden="true" className="size-4" /> Sign out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <ButtonLink to="/login" variant="outline" onClick={onClose}>
                  Log in
                </ButtonLink>
                <ButtonLink to="/register" onClick={onClose}>
                  Create account
                </ButtonLink>
              </div>
            )}
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
