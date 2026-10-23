import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/carrrrrrrs.avif";
import { Container } from "@/components/layout/Container";
import { ShipIcon } from "@/components/icons";
import { AccentText } from "@/components/ui/AccentText";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { TrackingResult } from "@/services/carService";
import { LiveVoyageCard } from "./LiveVoyageCard";

// TEMPORARY: the whole hero is replaced by the v2 arch carousel in Step 4
const heroBackground = `linear-gradient(90deg, rgba(11,27,46,.97) 0%, rgba(11,27,46,.8) 42%, rgba(11,27,46,.35) 75%, rgba(11,27,46,.6) 100%), url("${heroImage}")`;

interface HeroSectionProps {
  featured: TrackingResult | null | undefined;
}

export function HeroSection({ featured }: HeroSectionProps) {
  return (
    <section
      className="relative flex min-h-[620px] items-center overflow-hidden rounded-b-hero bg-navy bg-cover bg-[position:center_right] text-white lg:min-h-[680px]"
      style={{ backgroundImage: heroBackground }}
    >
      <Container className="flex flex-wrap items-center justify-between gap-12 pt-16 pb-24 lg:pt-[72px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[620px] flex-[1_1_520px]"
        >
          <Eyebrow line tone="light">
            Imported with care · Lagos
          </Eyebrow>
          <h1 className="mt-5 text-[42px] leading-[1.02] font-extrabold tracking-[-0.03em] sm:text-[56px] lg:text-[68px]">
            <AccentText text="Drive *Royalty*." tone="light" />
            <br />
            Tracked from port to your driveway.
          </h1>
          <p className="mt-[22px] max-w-[520px] text-base leading-[1.65] text-on-navy-soft sm:text-[17px]">
            Hand-picked cars from the USA, Canada, UAE and Germany. Browse what's in the showroom, reserve what's on the
            water, and follow every mile of the voyage.
          </p>
          <div className="mt-[34px] flex flex-wrap gap-3">
            <ButtonLink to="/cars" size="lg">
              Explore Showroom <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.2} />
            </ButtonLink>
            <ButtonLink
              to="/track"
              variant="outline"
              size="lg"
              className="border-white/35 text-white hover:border-gold-light hover:bg-transparent hover:text-gold-light"
            >
              <ShipIcon /> Track Your Car
            </ButtonLink>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex-[0_1_380px]"
        >
          <LiveVoyageCard featured={featured} />
        </motion.div>
      </Container>
    </section>
  );
}
