import { motion } from "framer-motion";
import { ShipIcon } from "@/components/icons";
import { CarImage } from "@/components/car/CarImage";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Skeleton } from "@/components/ui/Skeleton";
import { TrackForm } from "@/components/voyage/TrackForm";
import { useQuery } from "@/hooks/useQuery";
import { cn, formatDate } from "@/lib/utils";
import { getCurrentStage, originLabel, stageDateLabel } from "@/lib/voyage";
import { trackShipment, type TrackingResult } from "@/services/carService";
import type { StageKey } from "@/types";

/** The car shown in the tracker preview */
const FEATURED_TRACKING_NUMBER = "RS-24817";

// The 7-stage voyage condensed to the 5 chips in the mockup
const CHIP_STAGES: StageKey[] = ["purchased", "departed_origin", "at_sea", "arrived_lagos", "ready"];

const ease = [0.22, 1, 0.36, 1] as const;

export function TrackImport() {
  const { data } = useQuery(`track-${FEATURED_TRACKING_NUMBER}`, () => trackShipment(FEATURED_TRACKING_NUMBER));

  return (
    <section id="track" className="pt-[88px] pb-6">
      <Container className="flex flex-wrap items-center gap-10">
        <div className="max-w-[420px] flex-[1_1_340px]">
          <SectionHeading
            eyebrow="Importing from abroad?"
            title="Track your car *live*, port to driveway."
            description="See the vessel, every stage and the arrival date, all in one place."
          />
          <TrackForm className="mt-6" />
        </div>

        <div className="min-w-0 flex-[1_1_600px] rounded-[22px] border border-line bg-surface px-5 py-[26px] shadow-[0_20px_50px_-34px_rgb(11_27_46/0.35)] sm:px-7">
          {!data ? (
            <div aria-hidden="true" className="flex flex-col gap-5">
              <Skeleton className="h-16 w-2/3" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : (
            <TrackerPreview car={data.car} shipment={data.shipment} />
          )}
        </div>
      </Container>
    </section>
  );
}

function TrackerPreview({ car, shipment }: TrackingResult) {
  const progress = shipment.progress;
  const stage = getCurrentStage(shipment);
  const chips = CHIP_STAGES.map((key) => shipment.stages.find((s) => s.key === key)).filter((s) => s !== undefined);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <CarImage src={car.images[0]} alt={`${car.make} ${car.model}`} className="size-16 flex-none rounded-[14px]" />
          <div>
            <p className="text-lg font-extrabold">
              {car.make} {car.model}
            </p>
            <p className="mt-0.5 text-[13px] text-muted">
              {shipment.trackingNumber} · {shipment.vesselName}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <span className="rounded-full bg-arriving-tint px-3 py-[7px] text-xs font-bold text-arriving-text">
            {stage?.label ?? "In transit"}
          </span>
          <span className="rounded-full bg-gold-tint px-3 py-[7px] text-xs font-bold text-[#6B4E12]">
            ETA {formatDate(shipment.eta)}
          </span>
        </div>
      </div>

      {/* Route: dashed line, navy→gold trail and the ship sailing to its position */}
      <div
        role="img"
        aria-label={`${progress}% of the way from ${originLabel(shipment, car)} to Lagos`}
        className="relative mx-1.5 mt-[34px] mb-2.5 h-[34px]"
      >
        <div className="absolute inset-x-0 top-4 border-t-2 border-dashed border-line-strong" />
        <motion.div
          className="absolute top-[15px] left-0 h-1 rounded bg-gradient-to-r from-navy to-gold"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 2.8, delay: 0.3, ease }}
        />
        <span className="absolute top-2.5 -left-1 size-4 rounded-full bg-navy" />
        <span className="absolute top-2.5 -right-1 size-4 rounded-full border-[3px] border-line-strong bg-surface" />
        <motion.div
          className="absolute top-0 -ml-[17px] flex size-[34px] items-center justify-center rounded-full bg-gold text-navy shadow-[0_0_0_6px_rgb(212_175_90/0.25)]"
          initial={{ left: "0%" }}
          animate={{ left: `${progress}%` }}
          transition={{ duration: 2.8, delay: 0.3, ease }}
        >
          <ShipIcon size={17} strokeWidth={2} />
        </motion.div>
      </div>
      <div className="flex justify-between text-[13px] font-semibold">
        <span>{originLabel(shipment, car)}</span>
        <span className="text-muted">{shipment.destinationPort}, Lagos</span>
      </div>

      <ol className="mt-[22px] grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2.5">
        {chips.map((s) => (
          <li
            key={s.key}
            aria-current={s.current ? "step" : undefined}
            className={cn(
              "rounded-xl px-3 py-2.5",
              s.completed && "bg-navy text-white",
              s.current && "bg-gold text-navy",
              !s.completed && !s.current && "border border-dashed border-line-strong bg-page text-muted",
            )}
          >
            <p className="text-xs font-bold">{s.key === "departed_origin" ? `Left ${shipment.originPort.replace(/^Port of /, "")}` : s.label}</p>
            <p className="mt-[3px] text-[11px] opacity-80">{stageDateLabel(s)}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
