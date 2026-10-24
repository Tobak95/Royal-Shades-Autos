import { useEffect, useEffectEvent, useId, useRef, useState, type KeyboardEvent } from "react";

const ITEMS = '[role^="menuitem"]:not(:disabled)';

/**
 * WAI-ARIA menu button behaviour (same as the account menu): arrow keys, Home/End,
 * Escape and outside clicks close it, focus moves in on open and back on close.
 */
export function useMenuButton() {
  const [open, setOpen] = useState(false);
  const buttonId = useId();
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<"first" | "last">("first");

  const items = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>(ITEMS) ?? []);

  function openMenu(focus: "first" | "last") {
    pendingFocus.current = focus;
    setOpen(true);
  }

  function close(returnFocus = true) {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    const list = menuRef.current?.querySelectorAll<HTMLElement>(ITEMS);
    if (!list?.length) return;
    (pendingFocus.current === "first" ? list[0] : list[list.length - 1]).focus();
  }, [open]);

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

  // Refs are returned separately (not inside the props objects) so they're never read during render
  const buttonProps = {
    id: buttonId,
    type: "button" as const,
    "aria-haspopup": "menu" as const,
    "aria-expanded": open,
    "aria-controls": open ? menuId : undefined,
    onClick: () => (open ? close(false) : openMenu("first")),
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        openMenu(event.key === "ArrowDown" ? "first" : "last");
      }
    },
  };

  const menuProps = {
    id: menuId,
    role: "menu" as const,
    "aria-labelledby": buttonId,
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
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
        setOpen(false);
      }
    },
  };

  return { open, close, wrapperRef, buttonRef, menuRef, buttonProps, menuProps };
}
