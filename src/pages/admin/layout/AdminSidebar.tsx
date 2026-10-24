import { Link, NavLink } from "react-router-dom";
import { ArrowLeftRight, CalendarCheck, Car, LayoutDashboard, Ship, Users } from "lucide-react";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { ResetDemoButton } from "../ResetDemoButton";

const ADMIN_NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/cars", label: "Cars", icon: Car, end: false },
  { to: "/admin/shipments", label: "Shipments", icon: Ship, end: false },
  { to: "/admin/reservations", label: "Reservations", icon: CalendarCheck, end: false },
  { to: "/admin/customers", label: "Customers", icon: Users, end: false },
];

const itemBase = "flex min-h-11 items-center gap-3 rounded-full px-4 text-[15px] font-medium transition-colors";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(itemBase, isActive ? "bg-navy-3 text-gold-light" : "text-on-navy-soft hover:bg-white/5 hover:text-white");

/** Navy sidebar: logo + tagline, pill links, "Switch to website" and the demo reset */
export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 py-6 text-white">
      <Link to="/admin" onClick={onNavigate} className="flex items-center gap-3 px-2">
        <img src={logo} alt="" className="h-10 w-auto flex-none" />
        <span className="min-w-0">
          <span className="block text-base leading-tight font-bold">Royal Shades</span>
          <span className="block text-xs text-on-navy-muted italic">Cars, the royal way</span>
        </span>
      </Link>

      <nav aria-label="Admin" className="mt-8">
        <ul className="flex flex-col gap-2">
          {ADMIN_NAV.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={linkClass} onClick={onNavigate}>
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <Link to="/" className={cn(itemBase, "text-on-navy-soft hover:bg-white/5 hover:text-white")}>
              <ArrowLeftRight aria-hidden="true" className="size-5" strokeWidth={1.8} />
              Switch to website
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto border-t border-white/10 px-1 pt-5">
        <p className="px-2 text-xs leading-relaxed text-on-navy-muted">
          <span className="font-bold text-gold-light">Demo mode.</span> Changes are saved in this browser only.
        </p>
        <ResetDemoButton />
      </div>
    </div>
  );
}
