import { Link } from "react-router-dom";
import { Cog, Fuel, Gauge, MapPin, Sparkles, Trash2 } from "lucide-react";
import { CarImage } from "@/components/car/CarImage";
import { cn, formatDate, formatDayMonth, formatMileage, formatNairaShort } from "@/lib/utils";
import { carName, getCurrentStage } from "@/lib/voyage";
import type { Car, CarStatus } from "@/types";
import { CarActionsMenu } from "./CarActionsMenu";
import { StatusPill } from "./StatusPill";

interface AdminCarCardProps {
  car: Car;
  busy?: boolean;
  onStatus: (status: CarStatus) => void;
  onToggleHero: () => void;
  onDelete: () => void;
}

/** Where the car is: on the water, at port, sold, or in Lagos */
function carLocation(car: Car): string {
  if (car.status === "sold") return car.soldAt ? `Sold ${formatDate(car.soldAt)}` : "Sold";
  if (car.status === "arriving" && car.shipment) {
    return `${getCurrentStage(car.shipment)?.label ?? "In transit"} · ETA ${formatDayMonth(car.shipment.eta)}`;
  }
  if (car.status === "arrived" && car.shipment) return `At ${car.shipment.destinationPort} port, Lagos`;
  return car.origin === "Nigeria" ? "Lagos · Nigerian used" : `Lagos · imported from ${car.origin}`;
}

/** Horizontal admin card (photo, name, location, specs, actions, status), after Torii Gate's AdminPropertyCard */
export function AdminCarCard({ car, busy, onStatus, onToggleHero, onDelete }: AdminCarCardProps) {
  const name = carName(car);
  const hero = car.featured && car.status === "available";

  return (
    <li className={cn("flex items-center justify-between gap-2 rounded-card bg-surface p-2.5 transition-opacity sm:gap-3", busy && "opacity-60")}>
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative flex-none">
          <CarImage src={car.images[0]} alt="" muted={car.status === "sold"} className="h-[96px] w-[100px] rounded-control sm:h-[78px] sm:w-[104px]" />
          <StatusPill status={car.status} className="absolute bottom-1.5 left-1.5 px-2 py-0.5 text-xs sm:hidden" />
        </div>

        <div className="min-w-0">
          <Link to={`/admin/cars/${car.id}/edit`} className="line-clamp-2 text-[15px] leading-snug font-semibold text-ink hover:text-gold-text sm:line-clamp-1">
            {name}
          </Link>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
            <MapPin aria-hidden="true" className="hidden size-3.5 flex-none lg:block" />
            <span className="truncate">{carLocation(car)}</span>
          </p>
          <ul className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink/80">
            <li className="flex items-center gap-1.5">
              <Fuel aria-hidden="true" className="size-4 text-muted" /> {car.fuelType}
            </li>
            <li className="flex items-center gap-1.5">
              <Cog aria-hidden="true" className="size-4 text-muted" /> {car.transmission}
            </li>
            <li className="flex items-center gap-1.5">
              <Gauge aria-hidden="true" className="size-4 text-muted" /> {formatMileage(car.mileage, car.mileageUnit)}
            </li>
            <li className="font-bold text-ink">{formatNairaShort(car.price)}</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-none flex-col items-end justify-between gap-3 self-stretch">
        {/* Phones: buttons stack to leave room for the text */}
        <div className="flex flex-col items-center sm:flex-row">
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            aria-label={`Delete the ${name}`}
            className="flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-sold-tint hover:text-sold disabled:opacity-50"
          >
            <Trash2 aria-hidden="true" className="size-[18px]" />
          </button>
          <CarActionsMenu car={car} disabled={busy} onStatus={onStatus} onToggleHero={onToggleHero} />
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          {hero && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-gold-tint px-2 py-1 text-xs font-bold text-gold-text">
              <Sparkles aria-hidden="true" className="size-3" /> Hero
            </span>
          )}
          <StatusPill status={car.status} />
        </div>
      </div>
    </li>
  );
}
