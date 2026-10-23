import { ShieldCheck } from "lucide-react";
import { GarageCta } from "@/components/car/GarageCta";
import { WishlistButton } from "@/components/car/WishlistButton";
import { FuelIcon, GaugeIcon, GearboxIcon, WhatsAppIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { buttonVariants } from "@/components/ui/variants";
import { DEPOSIT_PERCENT, POLICY } from "@/lib/site";
import { cn, formatDate, formatMileage, formatNaira } from "@/lib/utils";
import { carEnquiryLink } from "@/lib/whatsapp";
import type { Car } from "@/types";

export function CarSummaryPanel({ car }: { car: Car }) {
  const sold = car.status === "sold";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={car.status} />
        <Badge>{car.condition}</Badge>
        <Badge variant="gold">From {car.origin}</Badge>
      </div>

      <div>
        <h1 className="text-[32px] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[40px]">
          {car.make} {car.model}
        </h1>
        <p className="mt-2 text-[15px] text-muted">
          {car.year} · {car.trim} · {car.color}
        </p>
      </div>

      <p className={cn("text-[34px] font-extrabold tracking-[-0.02em]", sold ? "text-faint line-through" : "text-white")}>
        {formatNaira(car.price)}
      </p>

      <ul className="grid grid-cols-3 gap-2.5 text-sm" aria-label="Key specs">
        {[
          { icon: <FuelIcon size={16} />, label: "Fuel", value: car.fuelType },
          { icon: <GearboxIcon size={16} />, label: "Gearbox", value: car.transmission },
          { icon: <GaugeIcon size={16} />, label: "Mileage", value: formatMileage(car.mileage, car.mileageUnit) },
        ].map((spec) => (
          <li key={spec.label} className="rounded-control bg-graphite-2 p-3">
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <span className="text-gold">{spec.icon}</span>
              {spec.label}
            </span>
            <span className="mt-1 block font-semibold">{spec.value}</span>
          </li>
        ))}
      </ul>

      {car.status === "incoming" && car.shipment && (
        <p className="rounded-control border border-incoming/30 bg-incoming/10 px-4 py-3 text-sm text-incoming-text">
          On the water now. Expected in Lagos on <strong>{formatDate(car.shipment.eta)}</strong>. Reserve it today with a{" "}
          {DEPOSIT_PERCENT} deposit.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <GarageCta car={car} variant="gold" size="lg" className="flex-[1_1_180px]" />
        <a
          href={carEnquiryLink(car)}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "flex-[1_1_180px]")}
        >
          <WhatsAppIcon size={18} /> Enquire on WhatsApp
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <WishlistButton car={car} appearance="outline" className="size-[52px] rounded-control" />
      </div>

      <p className="flex items-start gap-2.5 text-xs leading-relaxed text-muted">
        <ShieldCheck aria-hidden="true" className="mt-px size-4 flex-none text-gold" />
        {POLICY.priceIncludesText} A {DEPOSIT_PERCENT} deposit holds the car. {POLICY.refundText}
      </p>
    </div>
  );
}
