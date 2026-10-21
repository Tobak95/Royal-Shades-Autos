import { cn, formatDate } from "@/lib/utils";
import { carName, maskVin, originLabel } from "@/lib/voyage";
import type { Car, Shipment } from "@/types";
import { ArcProgressRing } from "./ArcProgressRing";
import { StageTimeline } from "./StageTimeline";
import { VoyageRoute } from "./VoyageRoute";

interface VoyageTrackerProps {
  car: Car;
  shipment: Shipment;
  /** Adds the horizontal origin → Lagos route (Track page) */
  showRoute?: boolean;
  className?: string;
}

/** The signature tracker card: progress ring, vessel, ETA and the 7-stage timeline */
export function VoyageTracker({ car, shipment, showRoute = false, className }: VoyageTrackerProps) {
  return (
    <div className={cn("min-w-0 rounded-panel border border-line bg-graphite p-5 sm:p-7", className)}>
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-line pb-[22px]">
        <div className="flex min-w-0 items-center gap-4 sm:gap-[18px]">
          <ArcProgressRing progress={shipment.progress} className="size-20 flex-none sm:size-24" />
          <div className="min-w-0">
            <h3 className="text-lg font-bold sm:text-xl">{carName(car)}</h3>
            <p className="mt-1 text-[13px] text-muted">
              VIN {maskVin(car.vin)} · {shipment.trackingNumber}
            </p>
            <p className="mt-0.5 text-[13px] text-muted">
              Vessel <span className="font-semibold text-white">{shipment.vesselName}</span>
            </p>
          </div>
        </div>
        <div className="sm:text-right">
          <p className="text-xs text-muted">Estimated arrival</p>
          <p className="mt-1 text-[22px] font-extrabold text-gold">{formatDate(shipment.eta)}</p>
        </div>
      </div>

      {showRoute && (
        <VoyageRoute
          size="lg"
          progress={shipment.progress}
          from={originLabel(shipment, car)}
          to={`${shipment.destinationPort}, Lagos`}
          className="border-b border-line py-7"
        />
      )}

      <StageTimeline stages={shipment.stages} className="mt-[22px]" />
    </div>
  );
}
