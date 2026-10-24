import { ArrowRight, ArrowRightLeft, CircleDollarSign, ShieldCheck } from "lucide-react";
import { ShipIcon } from "@/components/icons";
import { Container } from "@/components/layout/Container";
import { FadeUp } from "@/components/motion/FadeUp";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Gold-tint band: "Want to sell your car? We'll buy it." */
export function SellBand() {
  return (
    <section id="sell" className="pt-6 pb-14">
      <Container>
        <FadeUp>
          <Card tone="gold" className="flex flex-wrap items-center justify-between gap-6 rounded-panel px-6 py-8 sm:px-10 sm:py-9">
            <div className="flex-[1_1_420px]">
              <h2 className="text-[26px] font-extrabold tracking-[-0.025em] sm:text-[32px]">
                Want to sell your car? <span className="text-gold-text">We'll buy it.</span>
              </h2>
              <p className="mt-2 text-base text-[#5A4A2A]">
                Send the details, get an offer, and get paid without the stress of strangers and endless calls.
              </p>
            </div>
            <ButtonLink to="/sell" variant="navy" size="lg">
              Get an offer <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.2} />
            </ButtonLink>
          </Card>
        </FadeUp>
      </Container>
    </section>
  );
}

const FEATURES = [
  { icon: ShieldCheck, title: "Inspected cars", body: "Engine, body and papers checked before any car is listed." },
  { icon: ArrowRightLeft, title: "Easy swaps", body: "Trade in your current car and only pay the difference." },
  { icon: CircleDollarSign, title: "Clear pricing", body: "One price, no hidden charges, explained before you pay." },
  { icon: ShipIcon, title: "Tracked imports", body: "Follow your car from the port abroad to Tin Can or Apapa." },
];

/** "Why Royal Shades": four feature cards */
export function WhySection() {
  return (
    <section id="why" className="pt-10 pb-24">
      <Container>
        <FadeUp>
          <SectionHeading eyebrow="Why Royal Shades" title="Buying a car should feel *safe*." align="center" />
        </FadeUp>
        <ul className="mt-10 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <li key={title}>
              <FadeUp delay={i * 0.06} className="h-full">
                <Card hover="feature" className="h-full p-6">
                  <span className="flex size-[46px] items-center justify-center rounded-control bg-gold-tint text-gold-text">
                    <Icon aria-hidden="true" className="size-[22px]" strokeWidth={2} />
                  </span>
                  <h3 className="mt-4 text-[17px] font-bold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
                </Card>
              </FadeUp>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
