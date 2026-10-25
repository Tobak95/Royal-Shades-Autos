import { Link } from "react-router-dom";
import { FuelIcon, GaugeIcon, GearboxIcon } from "@/components/icons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn, formatDayMonth, formatMileage, formatNairaShort } from "@/lib/utils";
import type { Car } from "@/types";
import { CarImage } from "./CarImage";
import { GarageCta } from "./GarageCta";
import { WishlistButton } from "./WishlistButton";

interface CarCardProps {
  car: Car;
  eagerImage?: boolean;
  className?: string;
}

export function CarCard({ car, eagerImage, className }: CarCardProps) {
  const href = `/cars/${car.slug}`;
  const sold = car.status === "sold";
  const name = `${car.make} ${car.model}`;

  return (
    <article
      className={cn(
        "card-lift flex flex-col overflow-hidden rounded-card border border-line bg-surface",
        className,
      )}
    >
      <div className="relative h-[196px]">
        {/* The title link below is the accessible link; this one is a mouse shortcut */}
        <Link to={href} tabIndex={-1} aria-hidden="true" className="block size-full">
          <CarImage src={car.images[0]} alt="" muted={sold} eager={eagerImage} className="size-full" />
        </Link>
        {/* White pill badge, readable on any photo (v2 card style) */}
        {!sold && <StatusBadge status={car.status} overlay className="absolute top-3 left-3" />}
        <WishlistButton car={car} className="absolute top-2 right-2" />
        {sold && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[22px] -left-[38px] -rotate-[35deg] bg-sold px-12 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-white"
          >
            SOLD
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-[18px] pt-4 pb-[18px]">
        <div>
          <div className="flex items-baseline justify-between gap-2.5">
            <h3 className="text-[17px] font-extrabold">
              <Link to={href} className="transition-colors hover:text-gold-text">
                {name}
                {sold && <span className="sr-only"> (sold)</span>}
              </Link>
            </h3>
            <span className="text-[13px] text-muted">{car.year}</span>
          </div>
          <p className="mt-[3px] text-[13px] font-bold text-gold-text">
            {car.bodyType} · {car.origin}
          </p>
        </div>

        <ul aria-label="Key specs" className="flex flex-wrap gap-x-3.5 gap-y-1.5 text-xs text-muted">
          <li className="inline-flex items-center gap-1.5">
            <FuelIcon size={14} className="text-gold-text" />
            {car.fuelType}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <GearboxIcon size={14} className="text-gold-text" />
            {car.transmission}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <GaugeIcon size={14} className="text-gold-text" />
            {formatMileage(car.mileage, car.mileageUnit)}
          </li>
        </ul>

        {car.status === "arriving" && car.shipment && (
          <div className="flex items-center gap-2.5 text-xs text-muted">
            <div
              role="progressbar"
              aria-label="Voyage progress"
              aria-valuenow={car.shipment.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-[5px] flex-1 overflow-hidden rounded-full bg-line"
            >
              <div className="h-full rounded-full bg-arriving" style={{ width: `${car.shipment.progress}%` }} />
            </div>
            <span>
              ETA <strong className="font-bold text-arriving-text">{formatDayMonth(car.shipment.eta)}</strong>
            </span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line-soft pt-3">
          <p className={cn("text-[19px] font-extrabold tracking-[-0.02em]", sold ? "text-faint" : "text-ink")}>
            {formatNairaShort(car.price)}
          </p>
          <GarageCta car={car} className="rounded-[10px] font-bold" />
        </div>
      </div>
    </article>
  );
}
