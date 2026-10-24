import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowRightLeft, ShieldCheck } from "lucide-react";
import { GarageIcon } from "@/components/icons";
import { TotalsBreakdown } from "@/components/garage/TotalsBreakdown";
import { Container } from "@/components/layout/Container";
import { AccentText } from "@/components/ui/AccentText";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Skeleton } from "@/components/ui/Skeleton";
import { useGarage } from "@/hooks/useGarage";
import { useQuery } from "@/hooks/useQuery";
import { getGarageTotals } from "@/lib/pricing";
import { isReservable } from "@/lib/status";
import { getCarsByIds } from "@/services/carService";
import { GarageItem } from "./GarageItem";

export default function GaragePage() {
  const garage = useGarage();
  // Cars are only removed on this page, so one fetch on arrival is enough
  const { data, loading } = useQuery("garage-cars", () => getCarsByIds(garage.carIds));
  const cars = (data ?? []).filter((car) => garage.has(car.id));
  // Only available, arriving and arrived cars can be reserved (sold or "Coming soon" cars block checkout)
  const reservable = cars.filter(isReservable);
  const totals = getGarageTotals(cars);
  const empty = !loading && cars.length === 0;
  const hasBlocked = reservable.length !== cars.length;
  const canContinue = !loading && reservable.length > 0 && !hasBlocked;
  const continueLabel = (
    <>
      Continue to reservation <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.2} />
    </>
  );

  const countText = empty
    ? "No cars saved yet."
    : `${cars.length} ${cars.length === 1 ? "car" : "cars"} saved. Every car is one of one, so there are no quantities.`;

  return (
    <Container className="pt-[30px] pb-16">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Your Garage" }]} />
      <Eyebrow className="mt-[22px]">Ready when you are</Eyebrow>
      <h1 className="mt-2 text-[38px] font-extrabold tracking-[-0.035em] sm:text-[46px]">
        <AccentText text="Your *Garage*" />
      </h1>
      <p className="mt-2 text-base text-muted">{loading ? "Loading your cars…" : countText}</p>

      <div className="mt-[30px] flex flex-wrap items-start gap-7">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
          {loading && garage.carIds.map((id) => <Skeleton key={id} className="h-[172px] rounded-panel" />)}
          {cars.map((car) => (
            <GarageItem key={car.id} car={car} onRemove={() => garage.remove(car.id)} />
          ))}
          {empty && (
            <div className="rounded-panel border-[1.5px] border-dashed border-line-strong bg-surface px-6 py-[52px] text-center">
              <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-gold-tint text-gold-text">
                <GarageIcon size={26} />
              </span>
              <h2 className="mt-3.5 text-xl font-extrabold">Your garage is empty</h2>
              <p className="mt-1.5 mb-5 text-sm text-muted">Add cars from the showroom to reserve them.</p>
              <ButtonLink to="/cars" variant="navy">
                Explore the showroom
              </ButtonLink>
            </div>
          )}

          {/* Swap add-on */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-panel bg-navy px-[22px] py-5 text-white">
            <div className="flex items-center gap-3.5">
              <span className="flex size-11 flex-none items-center justify-center rounded-control bg-gold/16 text-gold-light">
                <ArrowRightLeft aria-hidden="true" className="size-5" strokeWidth={2} />
              </span>
              <div>
                <p className="font-extrabold">Swapping your current car?</p>
                <p className="mt-0.5 text-sm text-on-navy-muted">Add it here and we'll take its value off your balance.</p>
              </div>
            </div>
            <ButtonLink to="/swap" className="h-[46px]">
              Add my car
            </ButtonLink>
          </div>

          <Link
            to="/cars"
            className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-bold text-gold-text hover:text-gold-hover"
          >
            <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={2} />
            Continue browsing the showroom
          </Link>
        </div>

        <aside
          aria-labelledby="summary-heading"
          className="w-full flex-[1_1_340px] rounded-[22px] border border-line bg-surface p-[26px] shadow-[0_24px_50px_-36px_rgb(11_27_46/0.45)]"
        >
          <h2 id="summary-heading" className="text-xl font-extrabold">
            Reservation summary
          </h2>
          <div className="mt-5">
            <TotalsBreakdown totals={totals} carCount={reservable.length} />
          </div>
          {hasBlocked && (
            <p role="alert" className="mt-4 text-xs text-sold">
              Sold cars and cars still being inspected can't be reserved. Remove them before you continue.
            </p>
          )}
          {canContinue ? (
            <ButtonLink to="/reserve" size="lg" fullWidth className="mt-[18px] font-extrabold">
              {continueLabel}
            </ButtonLink>
          ) : (
            // A real disabled button: a link can't be disabled for mouse users
            <Button size="lg" fullWidth disabled className="mt-[18px] font-extrabold">
              {continueLabel}
            </Button>
          )}
          <p className="mt-4 flex items-start gap-2.5 text-xs leading-[1.55] text-muted">
            <ShieldCheck aria-hidden="true" className="mt-px size-4 flex-none text-gold-text" strokeWidth={2} />
            Pay by bank transfer. Incoming cars get a tracking number as soon as your deposit clears.
          </p>
        </aside>
      </div>
    </Container>
  );
}
