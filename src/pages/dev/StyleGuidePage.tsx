// TEMPORARY: Phase 1 review page. Replaced by the Home page in Phase 2.
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { FadeUp } from "@/components/motion/FadeUp";
import { ArcDivider } from "@/components/ui/ArcDivider";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useGarage } from "@/hooks/useGarage";
import { formatNaira, formatNairaShort } from "@/lib/utils";
import { FeedbackShowcase } from "./FeedbackShowcase";
import { FormShowcase } from "./FormShowcase";
import { Showcase } from "./Showcase";

const DEMO_CAR_IDS = ["car-camry-2021", "car-rx350-2022"];

export default function StyleGuidePage() {
  const garage = useGarage();

  return (
    <>
      <PageHero
        title="Design *System*"
        eyebrow="Phase 1 review"
        description="Every building block for the rebuild in one place. This page is temporary and becomes the Home page in Phase 2."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Design system" }]}
      />

      <Container className="flex flex-col gap-6 py-16">
        <FadeUp>
          <SectionHeading eyebrow="The collection" title="Explore the *Showroom*" description="Section heading with an eyebrow and one gold accent word." />
        </FadeUp>

        <div className="grid gap-6 lg:grid-cols-2">
          <Showcase title="Buttons">
            <div className="flex flex-wrap gap-3">
              <Button size="lg">
                Explore Showroom <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.2} />
              </Button>
              <Button variant="outline" size="lg">Track Your Car</Button>
              <Button variant="ghost">Ghost</Button>
              <Button loading>Saving</Button>
              <Button disabled variant="outline">Disabled</Button>
            </div>
          </Showcase>

          <Showcase title="Badges and currency">
            <div className="flex flex-wrap gap-2.5">
              <StatusBadge status="available" />
              <StatusBadge status="incoming" />
              <StatusBadge status="sold" />
              <Badge variant="gold">Pending</Badge>
              <Badge>Foreign used</Badge>
            </div>
            <p className="mt-5 text-sm text-muted">
              Card: <strong className="text-white">{formatNairaShort(68_500_000)}</strong> · Full:{" "}
              <strong className="text-white">{formatNaira(68_500_000)}</strong>
            </p>
          </Showcase>

          <Showcase title="Garage badge (navbar)">
            <p className="text-sm text-muted">Adds two sample cars so you can see the gold count bubble. Persists across reloads.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={() => DEMO_CAR_IDS.forEach(garage.add)}>Add 2 sample cars</Button>
              <Button variant="outline" onClick={garage.clear}>Clear garage ({garage.count})</Button>
            </div>
          </Showcase>

          <Card interactive className="flex flex-col justify-center p-7">
            <h3 className="text-lg font-bold">Interactive card</h3>
            <p className="mt-2 text-sm text-muted">Hover: lifts 4px with a gold border and glow.</p>
            <ButtonLink to="/cars" variant="outline" size="sm" className="mt-4 self-start">
              Similar
            </ButtonLink>
          </Card>
        </div>

        <FormShowcase />
        <FeedbackShowcase />
        <ArcDivider />
      </Container>
    </>
  );
}
