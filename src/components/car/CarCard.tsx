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
        "card-lift flex flex-col overflow-hidden rounded-card border border-line bg-graphite",
        className,
      )}
    >
      <div className="relative h-[196px]">
        {/* The title link below is the accessible link; this one is a mouse shortcut */}
        <Link to={href} tabIndex={-1} aria-hidden="true" className="block size-full">
          <CarImage src={car.images[0]} alt="" muted={sold} eager={eagerImage} className="size-full" />
        </Link>
        {/* Dark backing keeps the badge readable on bright photos */}
        {!sold && (
          <StatusBadge status={car.status} className="absolute top-3.5 left-3.5 bg-obsidian/75 backdrop-blur-sm" />
        )}
        <WishlistButton car={car} className="absolute top-2.5 right-2.5" />
        {sold && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[22px] -left-[38px] -rotate-[35deg] bg-sold px-12 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-white"
          >
            SOLD
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pt-[18px] pb-5">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-bold">
              <Link to={href} className="transition-colors hover:text-gold">
                {name}
                {sold && <span className="sr-only"> (sold)</span>}
              </Link>
            </h3>
            <span className="text-[13px] text-muted">{car.year}</span>
          </div>
          <p className="mt-1 text-[13px] font-semibold text-gold">
            {car.bodyType} · {car.origin}
          </p>
        </div>

        <ul aria-label="Key specs" className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-soft">
          <li className="inline-flex items-center gap-1.5">
            <FuelIcon size={14} className="text-gold" />
            {car.fuelType}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <GearboxIcon size={14} className="text-gold" />
            {car.transmission}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <GaugeIcon size={14} className="text-gold" />
            {formatMileage(car.mileage, car.mileageUnit)}
          </li>
        </ul>

        {car.status === "incoming" && car.shipment && (
          <div className="flex items-center gap-2.5 text-xs text-muted">
            <div
              role="progressbar"
              aria-label="Voyage progress"
              aria-valuenow={car.shipment.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-1 flex-1 overflow-hidden rounded bg-line"
            >
              <div className="h-full rounded bg-incoming" style={{ width: `${car.shipment.progress}%` }} />
            </div>
            <span>
              ETA <strong className="font-semibold text-incoming-text">{formatDayMonth(car.shipment.eta)}</strong>
            </span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
          <p className={cn("text-[22px] font-extrabold tracking-[-0.02em]", sold ? "text-faint" : "text-white")}>
            {formatNairaShort(car.price)}
          </p>
          <GarageCta car={car} />
        </div>
      </div>
    </article>
  );
}
