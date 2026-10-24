import { useId, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { CalendarCheck, Car, ChevronDown, LayoutDashboard, Ship, Users } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import { ResetDemoButton } from "./ResetDemoButton";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/cars", label: "Cars", icon: Car, end: false },
  { to: "/admin/shipments", label: "Shipments", icon: Ship, end: false },
  { to: "/admin/reservations", label: "Reservations", icon: CalendarCheck, end: false },
  { to: "/admin/customers", label: "Customers", icon: Users, end: false },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex min-h-11 items-center gap-3 rounded-control px-3 text-sm font-semibold transition-colors",
    isActive ? "bg-white/10 text-gold-light" : "text-[#D8DEE8] hover:bg-white/5 hover:text-white",
  );

/** Admin shell: navy sidebar on desktop, a collapsible menu bar on phones */
export function AdminLayout() {
  const menuId = useId();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const current = [...NAV].reverse().find((item) => pathname.startsWith(item.to)) ?? NAV[0];

  const nav = (
    <ul className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <li key={to}>
          <NavLink to={to} end={end} className={linkClass} onClick={() => setOpen(false)}>
            <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.9} />
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <Container className="grid grid-cols-1 items-start gap-6 py-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-10">
      <aside className="rounded-panel bg-navy p-3 text-white lg:sticky lg:top-28 lg:p-4">
        {/* Phones: current section + toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={menuId}
          className="flex min-h-11 w-full items-center justify-between rounded-control px-3 text-sm font-semibold lg:hidden"
        >
          <span className="flex items-center gap-3">
            <current.icon aria-hidden="true" className="size-[18px] text-gold-light" />
            Admin · {current.label}
          </span>
          <ChevronDown aria-hidden="true" className={cn("size-4 transition-transform", open && "rotate-180")} />
        </button>

        <div id={menuId} className={cn("mt-2 lg:mt-0 lg:block", open ? "block" : "hidden")}>
          <p className="hidden px-3 pt-1 pb-3 text-[11px] font-bold tracking-[0.16em] text-gold-light uppercase lg:block">
            Admin dashboard
          </p>
          <nav aria-label="Admin">{nav}</nav>
          <div className="mt-4 border-t border-white/10 px-1 pt-4">
            <p className="px-2 text-xs leading-relaxed text-on-navy-muted">
              <span className="font-bold text-gold-light">Demo mode.</span> Changes are saved in this browser only.
            </p>
            <ResetDemoButton />
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <Outlet />
      </div>
    </Container>
  );
}
