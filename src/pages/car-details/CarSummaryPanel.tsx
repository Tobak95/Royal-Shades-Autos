import { ArrowRightLeft, ShieldCheck } from "lucide-react";
import { GarageCta } from "@/components/car/GarageCta";
import { JourneyBar } from "@/components/car/JourneyBar";
import { WishlistButton } from "@/components/car/WishlistButton";
import { WhatsAppIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { buttonVariants } from "@/components/ui/variants";
import { STATUS_META } from "@/lib/status";
import { DEPOSIT_PERCENT, POLICY } from "@/lib/site";
import { cn, formatDate, formatMileage, formatNaira } from "@/lib/utils";
import { carEnquiryLink } from "@/lib/whatsapp";
import type { Car } from "@/types";

const NOTES: Partial<Record<Car["status"], { tint: string; text: (car: Car) => string }>> = {
  arriving: {
    tint: "bg-arriving-tint text-arriving-text",
    text: (car) =>
      `On the water now. Expected in Lagos on ${car.shipment ? formatDate(car.shipment.eta) : "soon"}. Reserve it today with a ${DEPOSIT_PERCENT} deposit.`,
  },
  arrived: {
    tint: "bg-arriving-tint text-arriving-text",
    text: () => `Landed in Lagos and clearing customs. Reserve it now with a ${DEPOSIT_PERCENT} deposit.`,
  },
  inspection: {
    tint: "bg-inspection-tint text-inspection-text",
    text: () => `Coming soon. It's in our yard going through inspection. Tap "Notify me" and we'll tell you when it's ready.`,
  },
};

export function CarSummaryPanel({ car }: { car: Car }) {
  const sold = car.status === "sold";
  const meta = STATUS_META[car.status];
  const note = NOTES[car.status];

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="flex flex-wrap gap-2">
        <Badge variant={meta.badge}>{meta.label}</Badge>
        <Badge>{car.condition}</Badge>
        {!sold && <Badge variant="gold">Swap accepted</Badge>}
      </div>

      <div>
        <h1 className="text-[34px] leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-[42px]">
          {car.make} {car.model}
        </h1>
        <p className="mt-2 text-base text-muted">
          {car.year} · {car.trim} · {car.color}
        </p>
      </div>

      <div className="flex flex-wrap items-baseline gap-3">
        <p className={cn("text-[32px] font-extrabold tracking-[-0.02em] sm:text-[38px]", sold && "text-faint line-through")}>
          {formatNaira(car.price)}
        </p>
        {!sold && <span className="text-[13px] text-muted">or swap + top up</span>}
      </div>

      <dl className="grid grid-cols-3 gap-2.5">
        {[
          { label: "Fuel", value: car.fuelType },
          { label: "Gearbox", value: car.transmission },
          { label: "Mileage", value: formatMileage(car.mileage, car.mileageUnit) },
        ].map((spec) => (
          <div key={spec.label} className="rounded-[14px] border border-line bg-surface px-3 py-3 sm:px-3.5">
            <dt className="text-xs text-muted">{spec.label}</dt>
            <dd className="mt-[3px] text-sm font-bold whitespace-nowrap sm:text-base">{spec.value}</dd>
          </div>
        ))}
      </dl>

      {note && <p className={cn("rounded-control px-4 py-3 text-sm", note.tint)}>{note.text(car)}</p>}

      <div className="flex flex-wrap gap-2.5">
        <GarageCta car={car} variant="gold" size="lg" className="flex-[1_1_180px] font-extrabold" />
        {!sold && (
          <ButtonLink to="/swap" state={{ carSlug: car.slug }} variant="navy" size="lg" className="flex-[1_1_180px]">
            <ArrowRightLeft aria-hidden="true" className="size-[17px]" strokeWidth={2} /> Swap for this car
          </ButtonLink>
        )}
      </div>
      <div className="flex gap-2.5">
        <a
          href={carEnquiryLink(car)}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "outline" }), "h-[50px] flex-1")}
        >
          <WhatsAppIcon size={17} className="text-available" /> Enquire on WhatsApp
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <WishlistButton car={car} appearance="outline" className="size-[50px]" />
      </div>

      <JourneyBar status={car.status} />

      <p className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-[18px] flex-none text-gold-text" strokeWidth={2} />
        Inspected before listing. {POLICY.priceIncludesText} A {DEPOSIT_PERCENT} deposit holds this car for you.{" "}
        {POLICY.refundText}
      </p>
    </div>
  );
}
