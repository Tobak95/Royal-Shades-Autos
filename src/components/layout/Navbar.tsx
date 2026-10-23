import { useId, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { GarageIcon } from "@/components/icons";
import { useAuth } from "@/hooks/useAuth";
import { useGarage } from "@/hooks/useGarage";
import { useWishlist } from "@/hooks/useWishlist";
import { BRAND, MAIN_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";
import { AccountMenu } from "./AccountMenu";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
import { NavIconLink } from "./NavIconLink";

const navLinkClass = "text-[15px] font-semibold transition-colors hover:text-gold-light";

export function Navbar() {
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const garage = useGarage();
  const wishlist = useWishlist();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className="sticky top-0 z-40 border-b border-white/8 bg-navy text-white"
      onKeyDown={(e) => e.key === "Escape" && closeMenu()}
    >
      <Container className="flex items-center justify-between gap-4 py-3.5">
        <Link to="/" aria-label={`${BRAND.shortName} home`} onClick={closeMenu} className="flex flex-none items-center">
          <img src={logo} alt={BRAND.name} className="block h-11 w-auto sm:h-[52px]" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex gap-[30px]">
            {MAIN_NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => cn(navLinkClass, isActive ? "text-white" : "text-[#D8DEE8]")}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <NavIconLink
            to="/account?tab=wishlist"
            label={`Wishlist, ${wishlist.count} ${wishlist.count === 1 ? "car" : "cars"}`}
            className="hidden sm:flex"
          >
            <Heart aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
          </NavIconLink>
          <NavIconLink
            to="/garage"
            label={`Your Garage, ${garage.count} ${garage.count === 1 ? "car" : "cars"}`}
            count={garage.count}
          >
            <GarageIcon size={19} />
          </NavIconLink>
          {isAuthenticated ? (
            <AccountMenu />
          ) : (
            <Link
              to="/login"
              className="hidden h-11 items-center rounded-full bg-gold px-5 text-sm font-bold text-navy transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-gold-light sm:inline-flex"
            >
              Sign in
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex size-11 flex-none items-center justify-center rounded-full border border-white/18 text-white transition-colors hover:border-gold-light hover:text-gold-light lg:hidden"
          >
            {menuOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </Container>

      <MobileMenu id={menuId} open={menuOpen} onClose={closeMenu} wishlistCount={wishlist.count} />
    </header>
  );
}
