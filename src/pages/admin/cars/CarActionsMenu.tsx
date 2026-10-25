import { Link } from "react-router-dom";
import { Check, Ellipsis, Pencil, Sparkles } from "lucide-react";
import { useMenuButton } from "@/hooks/useMenuButton";
import { STATUS_JOURNEY, STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";
import { carName } from "@/lib/voyage";
import type { Car, CarStatus } from "@/types";

interface CarActionsMenuProps {
  car: Car;
  disabled?: boolean;
  onStatus: (status: CarStatus) => void;
  onToggleHero: () => void;
}

const item =
  "flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm transition-colors focus:outline-none enabled:hover:bg-navy/5 focus:bg-navy/5 disabled:cursor-not-allowed disabled:opacity-50";

/** ⋯ menu on a car card: move between the five statuses, toggle the home hero, edit */
export function CarActionsMenu({ car, disabled, onStatus, onToggleHero }: CarActionsMenuProps) {
  const { open, close, wrapperRef, buttonRef, menuRef, buttonProps, menuProps } = useMenuButton();
  const canFeature = car.status === "available";

  function pick(action: () => void) {
    close();
    action();
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        {...buttonProps}
        disabled={disabled}
        aria-label={`Actions for the ${carName(car)}`}
        className="flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-navy/5 disabled:opacity-50"
      >
        <Ellipsis aria-hidden="true" className="size-5" />
      </button>

      {open && (
        <div className="absolute top-full right-0 z-20 mt-1 w-60 rounded-xl border border-line bg-surface p-1.5 shadow-float">
          <div ref={menuRef} {...menuProps}>
            <p role="presentation" className="px-3 pt-1.5 pb-1 text-xs font-bold tracking-wide text-muted uppercase">
              Move to
            </p>
            {STATUS_JOURNEY.map((status) => (
              <button
                key={status}
                type="button"
                role="menuitemradio"
                aria-checked={car.status === status}
                tabIndex={-1}
                onClick={() => pick(() => onStatus(status))}
                className={cn(item, car.status === status && "font-bold")}
              >
                <span aria-hidden="true" className={cn("size-2 flex-none rounded-full", STATUS_META[status].barClass)} />
                <span className="flex-1">{STATUS_META[status].journeyLabel}</span>
                {car.status === status && <Check aria-hidden="true" className="size-4 text-gold-text" />}
              </button>
            ))}
            <div role="separator" className="my-1.5 h-px bg-line" />
            <button
              type="button"
              role="menuitemcheckbox"
              aria-checked={Boolean(car.featured) && canFeature}
              tabIndex={-1}
              disabled={!canFeature}
              onClick={() => pick(onToggleHero)}
              className={item}
            >
              <Sparkles aria-hidden="true" className="size-4 text-gold-text" />
              <span className="flex-1">
                Show in home hero
                {!canFeature && <span className="block text-xs text-muted">Available cars only</span>}
              </span>
              {car.featured && canFeature && <Check aria-hidden="true" className="size-4 text-gold-text" />}
            </button>
            <div role="separator" className="my-1.5 h-px bg-line" />
            <Link role="menuitem" tabIndex={-1} to={`/admin/cars/${car.id}/edit`} onClick={() => close(false)} className={cn(item, "hover:bg-navy/5")}>
              <Pencil aria-hidden="true" className="size-4 text-muted" /> Edit details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
