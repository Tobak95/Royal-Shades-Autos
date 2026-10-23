import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { GarageIcon } from "@/components/icons";
import { TotalsBreakdown } from "@/components/garage/TotalsBreakdown";
import { Container } from "@/components/layout/Container";
import { AccentText } from "@/components/ui/AccentText";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useGarage } from "@/hooks/useGarage";
import { useQuery } from "@/hooks/useQuery";
import { getGarageTotals } from "@/lib/pricing";
import { getCarsByIds } from "@/services/carService";
import { GarageItem } from "./GarageItem";

export default function GaragePage() {
  const garage = useGarage();
  // Cars are only removed on this page, so one fetch on arrival is enough
  const { data, loading } = useQuery("garage-cars", () => getCarsByIds(garage.carIds));
  const cars = (data ?? []).filter((car) => garage.has(car.id));
  const reservable = cars.filter((car) => car.status !== "sold");
  const totals = getGarageTotals(cars);
  const empty = !loading && cars.length === 0;
  const hasSold = reservable.length !== cars.length;
  const canContinue = !loading && reservable.length > 0 && !hasSold;
  const continueLabel = (
    <>
      Continue to reservation <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.2} />
    </>
  );

  const countText = empty
    ? "No cars saved yet."
    : `${cars.length} ${cars.length === 1 ? "car" : "cars"} ready to reserve. No quantities, every car is one of one.`;

  return (
    <Container className="pt-10 pb-24">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Your Garage" }]} />
      <h1 className="mt-3.5 text-[38px] font-extrabold tracking-[-0.025em] sm:text-[46px]">
        <AccentText text="Your *Garage*" />
      </h1>
      <p className="mt-2 text-[15px] text-muted">{loading ? "Loading your cars…" : countText}</p>

      <div className="mt-8 flex flex-wrap items-start gap-7">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
          {loading &&
            garage.carIds.map((id) => <Skeleton key={id} className="h-[160px] rounded-card" />)}
          {cars.map((car) => (
            <GarageItem key={car.id} car={car} onRemove={() => garage.remove(car.id)} />
          ))}
          {empty && (
            <EmptyState
              icon={<GarageIcon size={24} />}
              title="Your garage is empty"
              description="Add cars from the showroom to reserve them."
              action={<ButtonLink to="/cars">Explore the showroom</ButtonLink>}
            />
          )}
          <Link to="/cars" className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-gold hover:text-gold-light">
            <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={2} />
            Continue browsing the showroom
          </Link>
        </div>

        <aside
          aria-labelledby="summary-heading"
          className="w-full flex-[1_1_340px] rounded-[18px] border border-gold/35 bg-graphite p-[26px]"
        >
          <h2 id="summary-heading" className="text-xl font-bold">
            Reservation summary
          </h2>
          <div className="mt-5">
            <TotalsBreakdown totals={totals} carCount={reservable.length} />
          </div>
          {hasSold && (
            <p role="alert" className="mt-4 text-xs text-sold-text">
              Sold cars aren't included. Remove them before you continue.
            </p>
          )}
          {canContinue ? (
            <ButtonLink to="/reserve" size="lg" fullWidth className="mt-5">
              {continueLabel}
            </ButtonLink>
          ) : (
            // A real disabled button: a link can't be disabled for mouse users
            <Button size="lg" fullWidth disabled className="mt-5">
              {continueLabel}
            </Button>
          )}
          <p className="mt-[18px] flex items-start gap-2.5 text-xs leading-normal text-muted">
            <ShieldCheck aria-hidden="true" className="mt-px size-4 flex-none text-gold" />
            Pay by bank transfer. You'll get a tracking number for every incoming car as soon as your deposit clears.
          </p>
        </aside>
      </div>
    </Container>
  );
}
