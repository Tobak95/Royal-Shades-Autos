import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatMileage, formatNairaShort } from "@/lib/utils";
import type { Car } from "@/types";
import { CarImage } from "./CarImage";
import { GarageCta } from "./GarageCta";
import { WishlistButton } from "./WishlistButton";

interface CarTileProps {
  car: Car;
  eagerImage?: boolean;
}

/** Compact card for the home "Fresh arrivals" grid (v2 home mockup) */
export function CarTile({ car, eagerImage }: CarTileProps) {
  const href = `/cars/${car.slug}`;

  return (
    <article className="card-lift flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card">
      <div className="relative h-[230px] overflow-hidden">
        <Link to={href} tabIndex={-1} aria-hidden="true" className="block size-full">
          <CarImage src={car.images[0]} alt="" eager={eagerImage} className="size-full" />
        </Link>
        <StatusBadge status={car.status} overlay className="absolute top-3 left-3" />
        <WishlistButton car={car} className="absolute top-2 right-2" />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 px-[18px] pt-4 pb-[18px]">
        <div>
          <h3 className="text-[17px] font-extrabold">
            <Link to={href} className="hover:text-gold-text">
              {car.make} {car.model}
            </Link>
          </h3>
          <p className="mt-[3px] text-[13px] text-muted">
            {car.bodyType} · {car.year} · {formatMileage(car.mileage, car.mileageUnit)}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line-soft pt-3">
          <p className="text-[19px] font-extrabold">{formatNairaShort(car.price)}</p>
          <GarageCta car={car} tinted className="rounded-[10px]" />
        </div>
      </div>
    </article>
  );
}
