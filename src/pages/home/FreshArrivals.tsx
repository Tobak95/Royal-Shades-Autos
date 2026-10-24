import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CarCardSkeleton } from "@/components/car/CarGrid";
import { CarTile } from "@/components/car/CarTile";
import { Container } from "@/components/layout/Container";
import { FadeUp } from "@/components/motion/FadeUp";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tabs } from "@/components/ui/Tabs";
import { useQuery } from "@/hooks/useQuery";
import { getCars } from "@/services/carService";
import type { BodyType, CarStatus } from "@/types";

type BodyTab = "All" | Extract<BodyType, "SUV" | "Sedan" | "Minivan" | "Pickup">;
const BODY_TABS: BodyTab[] = ["All", "SUV", "Sedan", "Minivan", "Pickup"];

/** Everything still in play: sold cars have their own section */
const SHOWN: CarStatus[] = ["available", "arrived", "arriving", "inspection"];

export function FreshArrivals() {
  const [body, setBody] = useState<BodyTab>("All");
  const { data, loading } = useQuery(`fresh-${body}`, () =>
    getCars({ statuses: SHOWN, bodyTypes: body === "All" ? [] : [body], pageSize: 6 }),
  );

  return (
    <section id="cars" className="pt-[72px] pb-10">
      <Container>
        <FadeUp className="flex flex-wrap items-end justify-between gap-[18px]">
          <SectionHeading eyebrow="In the showroom" title="Fresh *arrivals*" />
          <Tabs
            items={BODY_TABS.map((b) => ({ value: b, label: b }))}
            value={body}
            onChange={setBody}
            label="Filter by body type"
            idPrefix="fresh"
          />
        </FadeUp>

        <div id="fresh-panel" role="tabpanel" aria-labelledby={`fresh-tab-${body}`} className="mt-8">
          {loading ? (
            <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }, (_, i) => (
                <CarCardSkeleton key={i} />
              ))}
            </div>
          ) : data?.cars.length ? (
            <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
              {data.cars.map((car, i) => (
                <CarTile key={car.id} car={car} eagerImage={i < 3} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={`No ${body.toLowerCase()}s in right now`}
              description="New cars land every few weeks. Tell us what you want and we'll source it."
              action={<ButtonLink to="/contact">Request a car</ButtonLink>}
            />
          )}
        </div>

        <div className="mt-[30px] flex justify-center">
          <ButtonLink to={body === "All" ? "/cars" : `/cars?body=${body}`} variant="outline" className="border-navy">
            See all {body === "All" ? "cars" : `${body}s`}
            <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.2} />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
