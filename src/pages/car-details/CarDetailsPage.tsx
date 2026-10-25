import { useParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { FadeUp } from "@/components/motion/FadeUp";
import { PageLoader } from "@/components/feedback/PageLoader";
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

  if (loading) return <PageLoader label="Loading car details" />;

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
  const voyage = car.status === "arriving" || car.status === "arrived" ? car.shipment : undefined;

  return (
    <Container className="pt-[26px] pb-8">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Showroom", to: "/cars" }, { label: `${car.make} ${car.model}` }]} />

      <div className="mt-5 flex flex-wrap items-start gap-9">
        <div className="min-w-0 flex-[999_1_560px]">
          <Gallery car={car} name={name} />
        </div>
        <aside aria-label="Price and actions" className="min-w-0 flex-[1_1_400px]">
          <CarSummaryPanel car={car} />
        </aside>
      </div>

      <div className="mt-14 flex flex-wrap items-start gap-9">
        <FadeUp className="min-w-0 flex-[999_1_560px]">
          <SectionHeading title="Full *specification*" size="md" />
          <div className="mt-[18px]">
            <SpecTable car={car} />
          </div>
        </FadeUp>

        <FadeUp delay={0.1} className="min-w-0 flex-[1_1_400px]">
          <SectionHeading title="About this *car*" size="md" />
          <p className="mt-4 text-base leading-[1.75] text-[#3D4757]">{car.description}</p>

          <h3 className="mt-6 text-[17px] font-extrabold">Features</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {car.features.map((feature) => (
              <li key={feature} className="rounded-full border border-line bg-surface px-3 py-2 text-[13px] font-semibold">
                {feature}
              </li>
            ))}
          </ul>

          {car.status !== "sold" && (
            <div className="mt-[26px] rounded-card bg-navy p-[22px] text-white">
              <p className="text-lg font-extrabold">Have a car to swap?</p>
              <p className="mt-1.5 mb-3.5 text-sm text-on-navy-muted">
                Tell us what you drive and we'll send a trade-in value for this {car.model}.
              </p>
              <ButtonLink to="/swap" state={{ carSlug: car.slug }} className="h-[46px]">
                Get my swap value
              </ButtonLink>
            </div>
          )}
        </FadeUp>
      </div>

      {voyage && (
        <FadeUp className="mt-14">
          <SectionHeading title="Track the *voyage*" size="md" />
          <MiniVoyage car={car} shipment={voyage} className="mt-5 max-w-3xl" />
        </FadeUp>
      )}

      <RelatedCars car={car} />
    </Container>
  );
}
