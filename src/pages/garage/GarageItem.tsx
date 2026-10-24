import { Link } from "react-router-dom";
import { MapPin, Trash2 } from "lucide-react";
import { CarImage } from "@/components/car/CarImage";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { isReservable } from "@/lib/status";
import { cn, formatNaira } from "@/lib/utils";
import { carName, carNote } from "@/lib/voyage";
import type { Car } from "@/types";

interface GarageItemProps {
  car: Car;
  onRemove: () => void;
}

/** One saved car: photo, status, location note, price and Remove (v2 garage) */
export function GarageItem({ car, onRemove }: GarageItemProps) {
  const name = carName(car);
  const sold = car.status === "sold";
  // Sold or "Coming soon" cars sit in the garage but can't be reserved
  const blocked = !isReservable(car);
  const href = `/cars/${car.slug}`;

  return (
    <article className="group flex flex-wrap items-center gap-5 rounded-panel border border-line bg-surface p-4 transition-shadow duration-300 hover:shadow-[0_20px_40px_-28px_rgb(11_27_46/0.35)]">
      <Link
        to={href}
        tabIndex={-1}
        aria-hidden="true"
        className="block h-[180px] w-full flex-none overflow-hidden rounded-[14px] sm:h-[140px] sm:w-[210px]"
      >
        <CarImage
          src={car.images[0]}
          alt=""
          muted={sold}
          className="size-full [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-105"
        />
      </Link>
      <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-[7px]">
        <StatusBadge status={car.status} />
        <h2 className="text-xl font-extrabold">
          <Link to={href} className="hover:text-gold-text">
            {car.make} {car.model}
          </Link>
        </h2>
        <p className="text-[13px] text-muted">
          {car.bodyType} · {car.color} · {car.year}
        </p>
        <p className={cn("flex items-start gap-1.5 text-[13px]", blocked ? "text-sold" : "text-[#3D4757]")}>
          <MapPin aria-hidden="true" className="mt-0.5 size-3.5 flex-none text-gold-text" strokeWidth={2} />
          {carNote(car)}
        </p>
      </div>
      <div className="ml-auto flex flex-col items-end gap-3">
        <p className={cn("text-[22px] font-extrabold tracking-[-0.02em]", blocked && "text-faint line-through")}>
          {formatNaira(car.price)}
        </p>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name} from your garage`}
          className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border-[1.5px] border-line bg-surface px-3.5 text-[13px] font-bold text-muted transition-colors hover:border-[#E7B4B1] hover:bg-sold-tint hover:text-sold"
        >
          <Trash2 aria-hidden="true" className="size-[15px]" strokeWidth={1.9} />
          Remove
        </button>
      </div>
    </article>
  );
}
