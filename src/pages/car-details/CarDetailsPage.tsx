import { useParams } from "react-router-dom";
import { Check, SearchX } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { FadeUp } from "@/components/motion/FadeUp";
import { ArcLoader } from "@/components/ui/ArcLoader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MiniVoyage } from "@/components/voyage/MiniVoyage";
import { useQuery } from "@/hooks/useQuery";
import { carName } from "@/lib/voyage";
import { getCarBySlug } from "@/services/carService";
import { CarSummaryPanel } from "./CarSummaryPanel";
import { Gallery } from "./Gallery";
import { RelatedCars } from "./RelatedCars";
import { SpecTable } from "./SpecTable";

export default function CarDetailsPage() {
  const { slug = "" } = useParams();
  const { data: car, loading } = useQuery(`car-${slug}`, () => getCarBySlug(slug));

  if (loading) return <ArcLoader fullScreen label="Loading car details" />;

  if (!car) {
    return (
      <Container className="py-20">
        <EmptyState
          icon={<SearchX aria-hidden="true" className="size-6" />}
          title="We couldn't find that car"
          description="It may have been sold and removed, or the link is mistyped. Have a look at what's in the showroom now."
          action={<ButtonLink to="/cars">Back to the showroom</ButtonLink>}
        />
      </Container>
    );
  }

  const name = carName(car);

  return (
    <Container className="pt-8 pb-12">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Showroom", to: "/cars" }, { label: name }]} />

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-12">
        <Gallery car={car} name={name} />
        <CarSummaryPanel car={car} />
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <FadeUp>
          <SectionHeading title="Full *specification*" size="md" />
          <div className="mt-5">
            <SpecTable car={car} />
          </div>
        </FadeUp>

        <FadeUp delay={0.1} className="flex flex-col gap-10">
          <div>
            <SectionHeading title="About this *car*" size="md" />
            <p className="mt-4 text-[15px] leading-[1.75] text-soft">{car.description}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold">Features</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {car.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-soft">
                  <Check aria-hidden="true" className="mt-0.5 size-4 flex-none text-gold" strokeWidth={2.4} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          {car.status === "incoming" && car.shipment && (
            <div>
              <SectionHeading title="Track the *voyage*" size="md" />
              <MiniVoyage car={car} shipment={car.shipment} className="mt-5" />
            </div>
          )}
        </FadeUp>
      </div>

      <RelatedCars car={car} />
    </Container>
  );
}
