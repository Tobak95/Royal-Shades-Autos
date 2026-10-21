import { Link } from "react-router-dom";
import { CarImage } from "@/components/car/CarImage";
import { GarageCta } from "@/components/car/GarageCta";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatNaira } from "@/lib/utils";
import { carName } from "@/lib/voyage";
import type { Car, Shipment } from "@/types";

/** Car summary shown next to the tracker */
export function TrackedCarCard({ car, shipment }: { car: Car; shipment: Shipment }) {
  return (
    <aside aria-label="Car summary" className="overflow-hidden rounded-panel border border-gold/35 bg-graphite">
      <CarImage src={car.images[0]} alt={carName(car)} className="aspect-[16/10] w-full" />
      <div className="flex flex-col gap-4 p-6">
        <StatusBadge status={car.status} />
        <div>
          <h2 className="text-xl font-bold">
            <Link to={`/cars/${car.slug}`} className="hover:text-gold">
              {carName(car)}
            </Link>
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            {car.trim} · {car.color}
          </p>
        </div>
        <dl className="flex flex-col gap-2.5 border-t border-line pt-4 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Origin port</dt>
            <dd className="text-right font-semibold">{shipment.originPort}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Arriving at</dt>
            <dd className="text-right font-semibold">{shipment.destinationPort}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Price</dt>
            <dd className="text-right font-semibold">{formatNaira(car.price)}</dd>
          </div>
        </dl>
        <GarageCta car={car} variant="gold" size="md" fullWidth />
        <Link to={`/cars/${car.slug}`} className="text-center text-sm font-semibold text-gold hover:text-gold-light">
          View full details
        </Link>
      </div>
    </aside>
  );
}
