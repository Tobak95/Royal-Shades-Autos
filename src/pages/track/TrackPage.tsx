import { useSearchParams } from "react-router-dom";
import { Anchor, Compass } from "lucide-react";
import { ImportSteps } from "@/components/content/ImportSteps";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { ArcLoader } from "@/components/ui/ArcLoader";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrackForm } from "@/components/voyage/TrackForm";
import { VoyageTracker } from "@/components/voyage/VoyageTracker";
import { IMPORT_STEPS } from "@/data/content";
import { useQuery } from "@/hooks/useQuery";
import { trackShipment } from "@/services/carService";
import { TrackedCarCard } from "./TrackedCarCard";

export default function TrackPage() {
  const [params] = useSearchParams();
  const number = params.get("number")?.trim() ?? "";
  const { data: result, loading } = useQuery(`track-${number.toUpperCase()}`, () =>
    number ? trackShipment(number) : Promise.resolve(null),
  );

  return (
    <>
      <PageHero
        title="Track your *Voyage*"
        description="Enter your car's VIN or the tracking number from your reservation to see exactly where it is."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Track" }]}
      >
        {/* key resets the input when the URL changes (e.g. clicking a demo number) */}
        <TrackForm key={number} defaultValue={number} tone="light" className="max-w-xl" />
      </PageHero>

      <Container className="py-14">
        {!number ? (
          <div className="flex flex-col gap-10">
            <EmptyState
              icon={<Compass aria-hidden="true" className="size-6" />}
              title="Where's my car?"
              description="Your tracking number starts with RS- and is on your reservation email. You can also use the 17-character VIN."
            />
            <div>
              <SectionHeading eyebrow="From abroad to your driveway" title="How the *voyage* works" size="md" />
              <ImportSteps steps={IMPORT_STEPS} className="mt-8" />
            </div>
          </div>
        ) : loading ? (
          <ArcLoader fullScreen label="Finding your car" className="min-h-[40vh]" />
        ) : result ? (
          <div aria-live="polite" className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <VoyageTracker car={result.car} shipment={result.shipment} showRoute />
            <TrackedCarCard car={result.car} shipment={result.shipment} />
          </div>
        ) : (
          <div aria-live="polite">
            <EmptyState
              icon={<Anchor aria-hidden="true" className="size-6" />}
              title={`We couldn't find "${number}"`}
              description="Check the number on your reservation email and try again. Cars appear here once they've been purchased abroad. If you're still stuck, our team can help."
              action={
                <div className="flex flex-wrap justify-center gap-3">
                  <ButtonLink to="/contact">Contact us</ButtonLink>
                  <ButtonLink to="/cars?status=arriving" variant="outline">
                    See arriving cars
                  </ButtonLink>
                </div>
              }
            />
          </div>
        )}
      </Container>
    </>
  );
}
