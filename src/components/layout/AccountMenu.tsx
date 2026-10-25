import { useEffect, useEffectEvent, useId, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { GarageIcon } from "@/components/icons";
import { useAuth } from "@/hooks/useAuth";
import { useGarage } from "@/hooks/useGarage";
import { useSignOut } from "@/hooks/useSignOut";
import { cn, getInitials } from "@/lib/utils";

const itemClass =
  "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition-colors focus:outline-none";
const linkItemClass = cn(itemClass, "text-muted hover:bg-navy/5 hover:text-gold-text focus:bg-navy/5 focus:text-gold-text");

/** Initials button + dropdown (WAI-ARIA menu button pattern). Only rendered when logged in. */
export function AccountMenu() {
  const { user, isAdmin } = useAuth();
  const garage = useGarage();
  const signOut = useSignOut();
  const [open, setOpen] = useState(false);
  const buttonId = useId();
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  // Which item to focus once the menu has rendered
  const pendingFocus = useRef<"first" | "last">("first");

  const items = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);

  function openMenu(focus: "first" | "last") {
    pendingFocus.current = focus;
    setOpen(true);
  }

  function close(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }

  // Move focus into the menu after it opens
  useEffect(() => {
    if (!open) return;
    const list = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    if (!list?.length) return;
    (pendingFocus.current === "first" ? list[0] : list[list.length - 1]).focus();
  }, [open]);

  // Clicking outside closes it; focus only returns to the button if it was inside the menu
  const onOutsidePointerDown = useEffectEvent((event: PointerEvent) => {
    if (wrapperRef.current?.contains(event.target as Node)) return;
    close(wrapperRef.current?.contains(document.activeElement) ?? false);
  });

  useEffect(() => {
    if (!open) return;
    const listener = (event: PointerEvent) => onOutsidePointerDown(event);
    document.addEventListener("pointerdown", listener);
    return () => document.removeEventListener("pointerdown", listener);
  }, [open]);

  function onButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(event.key === "ArrowDown" ? "first" : "last");
    }
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLElement);
    const moves: Record<string, number> = {
      ArrowDown: (index + 1) % list.length,
      ArrowUp: (index - 1 + list.length) % list.length,
      Home: 0,
      End: list.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      list[moves[event.key]]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "Tab") {
      // Let Tab move on naturally, just close behind it
      setOpen(false);
    }
  }

  if (!user) return null;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`Account menu for ${user.fullName}`}
        onClick={() => (open ? close(false) : openMenu("first"))}
        onKeyDown={onButtonKeyDown}
        className={cn(
          "flex size-11 flex-none items-center justify-center rounded-full bg-gold text-sm font-extrabold tracking-wide text-navy transition-shadow",
          "hover:shadow-[0_0_0_3px_rgb(222_187_110/0.25)]",
          open && "shadow-[0_0_0_3px_rgb(222_187_110/0.35)]",
        )}
      >
        <span aria-hidden="true">{getInitials(user.fullName, user.email)}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top right" }}
            className="absolute top-[calc(100%+10px)] right-0 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-line bg-surface p-1.5 shadow-[0_18px_40px_-12px_rgb(0_0_0/0.7)]"
          >
            <div className="border-b border-line px-3 pt-2.5 pb-3">
              <p className="truncate text-sm font-bold" title={user.fullName}>
                {user.fullName}
              </p>
              <p className="truncate text-xs text-muted" title={user.email}>
                {user.email}
              </p>
            </div>

            <div ref={menuRef} id={menuId} role="menu" aria-labelledby={buttonId} onKeyDown={onMenuKeyDown} className="pt-1.5">
              <Link role="menuitem" tabIndex={-1} to="/account" onClick={() => close(true)} className={linkItemClass}>
                <UserRound aria-hidden="true" className="size-4" /> My account
              </Link>
              <Link role="menuitem" tabIndex={-1} to="/garage" onClick={() => close(true)} className={linkItemClass}>
                <GarageIcon size={16} /> My garage
                {garage.count > 0 && (
                  <span className="ml-auto rounded-full bg-gold-tint px-2 py-0.5 text-xs font-bold text-gold-text">
                    {garage.count}
                    <span className="sr-only"> {garage.count === 1 ? "car" : "cars"}</span>
                  </span>
                )}
              </Link>
              {isAdmin && (
                <Link role="menuitem" tabIndex={-1} to="/admin" onClick={() => close(true)} className={linkItemClass}>
                  <LayoutDashboard aria-hidden="true" className="size-4" /> Admin dashboard
                </Link>
              )}
              <div role="separator" className="my-1.5 h-px bg-line" />
              <button
                role="menuitem"
                tabIndex={-1}
                type="button"
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
                className={cn(itemClass, "text-sold hover:bg-sold/10 focus:bg-sold/10")}
              >
                <LogOut aria-hidden="true" className="size-4" /> Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
