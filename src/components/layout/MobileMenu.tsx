import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { Heart, UserRound } from "lucide-react";
import { MAIN_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { SearchPill } from "./SearchPill";

interface MobileMenuProps {
  id: string;
  open: boolean;
  onClose: () => void;
  accountHref: string;
  accountLabel: string;
  wishlistCount: number;
}

const linkClass = "flex min-h-12 items-center rounded-control px-3 text-base font-semibold transition-colors";

export function MobileMenu({ id, open, onClose, accountHref, accountLabel, wishlistCount }: MobileMenuProps) {
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
          className="overflow-hidden border-t border-white/[0.06] bg-obsidian lg:hidden"
        >
          <Container className="flex flex-col gap-4 pt-4 pb-6">
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
                          cn(linkClass, isActive ? "bg-white/[0.04] text-gold" : "text-silver hover:text-gold")
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
              <Link to={accountHref} onClick={onClose} className={cn(linkClass, "gap-3 text-silver hover:text-gold")}>
                <UserRound aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
                {accountLabel}
              </Link>
            </div>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
