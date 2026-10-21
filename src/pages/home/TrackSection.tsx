import { Container } from "@/components/layout/Container";
import { FadeUp } from "@/components/motion/FadeUp";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Skeleton } from "@/components/ui/Skeleton";
import { TrackForm } from "@/components/voyage/TrackForm";
import { VoyageTracker } from "@/components/voyage/VoyageTracker";
import type { TrackingResult } from "@/services/carService";

interface TrackSectionProps {
  featured: TrackingResult | null | undefined;
}

export function TrackSection({ featured }: TrackSectionProps) {
  return (
    <section id="track" className="pt-14 pb-24">
      <Container className="flex flex-wrap items-center gap-12">
        <FadeUp className="max-w-[460px] flex-[1_1_380px]">
          <SectionHeading
            eyebrow="Signature feature"
            title="Track your *Voyage*"
            description="From the auction yard abroad to customs at Tin Can, see exactly where your car is, the vessel it's on, and when it lands in Lagos."
          />
          <TrackForm className="mt-7" />
        </FadeUp>

        <FadeUp delay={0.1} className="min-w-0 flex-[1_1_560px]">
          {featured ? (
            <VoyageTracker car={featured.car} shipment={featured.shipment} />
          ) : (
            <div className="rounded-panel border border-line bg-graphite p-7">
              <div className="flex items-center gap-5 border-b border-line pb-6">
                <Skeleton className="size-24 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </div>
          )}
        </FadeUp>
      </Container>
    </section>
  );
}
