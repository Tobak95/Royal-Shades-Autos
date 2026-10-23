import { useId, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Heart, Menu, UserRound, X } from "lucide-react";
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
import { SearchPill } from "./SearchPill";

const navLinkClass = "text-sm font-medium transition-colors hover:text-gold";

export function Navbar() {
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const garage = useGarage();
  const wishlist = useWishlist();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className="sticky top-0 z-40 border-b border-white/[0.06] bg-obsidian"
      onKeyDown={(e) => e.key === "Escape" && closeMenu()}
    >
      <Container className="flex items-center justify-between gap-4 py-3.5">
        <Link to="/" aria-label={`${BRAND.shortName} home`} onClick={closeMenu} className="flex flex-none items-center">
          <img src={logo} alt={BRAND.name} className="block h-11 w-auto sm:h-[54px]" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex gap-7">
            {MAIN_NAV.map((item) => (
              <li key={item.to}>
                {/* Hash links point at home sections, so they never show as "active" */}
                {item.to.includes("#") ? (
                  <Link to={item.to} className={cn(navLinkClass, "text-silver")}>
                    {item.label}
                  </Link>
                ) : (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => cn(navLinkClass, isActive ? "text-gold" : "text-silver")}
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <SearchPill className="hidden w-[200px] lg:block xl:w-[220px]" />
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
            <NavIconLink to="/login" label="Log in" className="hidden sm:flex">
              <UserRound aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
            </NavIconLink>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex size-11 flex-none items-center justify-center rounded-full border border-line text-white transition-colors hover:border-gold hover:text-gold lg:hidden"
          >
            {menuOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </Container>

      <MobileMenu id={menuId} open={menuOpen} onClose={closeMenu} wishlistCount={wishlist.count} />
    </header>
  );
}
