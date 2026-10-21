import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { CarImage } from "@/components/car/CarImage";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn, formatNaira } from "@/lib/utils";
import { carName, carNote } from "@/lib/voyage";
import type { Car } from "@/types";

interface GarageItemProps {
  car: Car;
  onRemove: () => void;
}

export function GarageItem({ car, onRemove }: GarageItemProps) {
  const name = carName(car);
  const sold = car.status === "sold";

  return (
    <article className="flex flex-wrap items-center gap-5 rounded-card border border-line bg-graphite p-[18px]">
      <Link to={`/cars/${car.slug}`} tabIndex={-1} aria-hidden="true" className="w-full flex-none sm:w-[200px]">
        <CarImage src={car.images[0]} alt="" muted={sold} className="aspect-[16/10] w-full rounded-xl sm:h-[124px]" />
      </Link>
      <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-2">
        <StatusBadge status={car.status} />
        <h2 className="text-xl font-bold">
          <Link to={`/cars/${car.slug}`} className="hover:text-gold">
            {name}
          </Link>
        </h2>
        <p className="text-[13px] text-muted">
          {car.bodyType} · {car.color} · from {car.origin}
        </p>
        <p className={cn("text-[13px]", sold ? "text-sold-text" : "text-soft")}>{carNote(car)}</p>
      </div>
      <div className="ml-auto flex flex-col items-end gap-3">
        <p className={cn("text-[22px] font-extrabold tracking-[-0.02em]", sold && "text-faint line-through")}>
          {formatNaira(car.price)}
        </p>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name} from your garage`}
          className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line-strong px-3.5 text-[13px] font-semibold text-muted transition-colors hover:border-sold hover:text-sold-text"
        >
          <Trash2 aria-hidden="true" className="size-[15px]" strokeWidth={1.8} />
          Remove
        </button>
      </div>
    </article>
  );
}
