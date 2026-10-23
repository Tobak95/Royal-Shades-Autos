import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { VoyageRoute } from "@/components/voyage/VoyageRoute";
import { formatDate } from "@/lib/utils";
import { carName, getCurrentStage, originLabel } from "@/lib/voyage";
import type { TrackingResult } from "@/services/carService";

interface LiveVoyageCardProps {
  featured: TrackingResult | null | undefined;
}

/** Glass card on the hero showing one car currently at sea */
export function LiveVoyageCard({ featured }: LiveVoyageCardProps) {
  return (
    <div className="glass rounded-[18px] p-[22px]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">Live voyage</span>
        <StatusBadge status="incoming" />
      </div>

      {featured ? (
        <>
          <h2 className="mt-3.5 text-xl font-bold">
            <Link to={`/track?number=${featured.shipment.trackingNumber}`} className="hover:text-gold-text">
              {carName(featured.car)}
            </Link>
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            {featured.shipment.trackingNumber} · {featured.shipment.originPort.replace(/^Port of /, "")} →{" "}
            {featured.shipment.destinationPort}
          </p>
          <VoyageRoute
            progress={featured.shipment.progress}
            from={originLabel(featured.shipment, featured.car)}
            to="Lagos"
            className="mt-6"
          />
          <dl className="mt-[18px] grid grid-cols-2 gap-2.5">
            <div className="rounded-control bg-page p-3">
              <dt className="text-[11px] text-muted">Status</dt>
              <dd className="mt-1 text-sm font-semibold">{getCurrentStage(featured.shipment)?.label}</dd>
            </div>
            <div className="rounded-control bg-page p-3">
              <dt className="text-[11px] text-muted">ETA</dt>
              <dd className="mt-1 text-sm font-semibold text-gold-text">{formatDate(featured.shipment.eta)}</dd>
            </div>
          </dl>
        </>
      ) : (
        <div aria-hidden="true" className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="mt-4 h-8 w-full" />
          <div className="mt-2 grid grid-cols-2 gap-2.5">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </div>
      )}
    </div>
  );
}
