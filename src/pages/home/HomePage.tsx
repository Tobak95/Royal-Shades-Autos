import { ImportSteps } from "@/components/content/ImportSteps";
import { PromiseBanner } from "@/components/content/PromiseBanner";
import { Container } from "@/components/layout/Container";
import { FadeUp } from "@/components/motion/FadeUp";
import { ArcDivider } from "@/components/ui/ArcDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IMPORT_STEPS } from "@/data/content";
import { useQuery } from "@/hooks/useQuery";
import { trackShipment } from "@/services/carService";
import { HeroSection } from "./HeroSection";
import { ShowroomPreview } from "./ShowroomPreview";
import { StatsStrip } from "./StatsStrip";
import { TrackSection } from "./TrackSection";

/** The car featured in the hero's live voyage card and the tracker section */
const FEATURED_TRACKING_NUMBER = "RS-24817";

export default function HomePage() {
  const { data: featured } = useQuery(`track-${FEATURED_TRACKING_NUMBER}`, () =>
    trackShipment(FEATURED_TRACKING_NUMBER),
  );

  return (
    <>
      <HeroSection featured={featured} />
      <StatsStrip />
      <ShowroomPreview />
      <ArcDivider />
      <TrackSection featured={featured} />

      <section id="how" className="border-y border-section-line bg-section-alt py-24">
        <Container>
          <FadeUp>
            <SectionHeading eyebrow="Simple and transparent" title="How importing *works*" align="center" />
          </FadeUp>
          <ImportSteps steps={IMPORT_STEPS} className="mt-[52px]" />
        </Container>
      </section>

      <section aria-label="Our promise" className="py-24">
        <Container>
          <FadeUp>
            <PromiseBanner />
          </FadeUp>
        </Container>
      </section>
    </>
  );
}
