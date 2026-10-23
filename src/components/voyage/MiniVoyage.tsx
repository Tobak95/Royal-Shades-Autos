import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { getCurrentStage, originLabel } from "@/lib/voyage";
import type { Car, Shipment } from "@/types";
import { ArcProgressRing } from "./ArcProgressRing";
import { VoyageRoute } from "./VoyageRoute";

interface MiniVoyageProps {
  car: Car;
  shipment: Shipment;
  className?: string;
}

/** Compact tracker for car details and the account page */
export function MiniVoyage({ car, shipment, className }: MiniVoyageProps) {
  const stage = getCurrentStage(shipment);

  return (
    <div className={cn("rounded-card border border-line bg-surface p-5 sm:p-6", className)}>
      <div className="flex flex-wrap items-center gap-5">
        <ArcProgressRing progress={shipment.progress} size={80} className="flex-none" />
        <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-xs text-muted">Current stage</dt>
            <dd className="mt-0.5 font-semibold text-gold-text">{stage?.label ?? "In transit"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">ETA</dt>
            <dd className="mt-0.5 font-semibold">{formatDate(shipment.eta)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Vessel</dt>
            <dd className="mt-0.5 font-semibold">{shipment.vesselName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Tracking no.</dt>
            <dd className="mt-0.5 font-semibold">{shipment.trackingNumber}</dd>
          </div>
        </dl>
      </div>
      <VoyageRoute
        progress={shipment.progress}
        from={originLabel(shipment, car)}
        to={`${shipment.destinationPort}, Lagos`}
        className="mt-6"
      />
      <Link
        to={`/track?number=${encodeURIComponent(shipment.trackingNumber)}`}
        className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold-text hover:text-gold-text"
      >
        See the full voyage <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}
