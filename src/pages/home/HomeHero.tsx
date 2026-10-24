import type { ReactNode } from "react";
import { ArrowRight, ArrowRightLeft, Check, Clock, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { isRealPhoto } from "@/data/carImages";
import { useQuery } from "@/hooks/useQuery";
import { getCars } from "@/services/carService";
import { ArchCarousel } from "./ArchCarousel";

const HERO_SLIDES = 5;

const TRUST = [
  { icon: ShieldCheck, text: "Inspected before sale" },
  { icon: ArrowRightLeft, text: "Fair swap value" },
  { icon: Clock, text: "Papers sorted for you" },
];

export function HomeHero() {
  // Only "available" cars rotate in the hero; the dealership's own photos go first
  const { data } = useQuery("hero-cars", () => getCars({ statuses: ["available"], pageSize: 50 }));
  const slides = data
    ? [...data.cars].sort((a, b) => Number(isRealPhoto(b.images[0])) - Number(isRealPhoto(a.images[0]))).slice(0, HERO_SLIDES)
    : [];

  return (
    <section className="relative overflow-hidden rounded-b-hero bg-[radial-gradient(120%_90%_at_85%_10%,#1B3556_0%,#0F2238_45%,#0B1B2E_100%)] text-white">
      {/* Decorative arcs from the logo's speedometer */}
      <svg
        aria-hidden="true"
        width="760"
        height="760"
        viewBox="0 0 760 760"
        fill="none"
        className="pointer-events-none absolute -top-[120px] -right-[180px] opacity-[.14]"
      >
        <circle cx="380" cy="380" r="340" stroke="#E5C27A" strokeWidth="1.5" strokeDasharray="2 14" />
        <circle cx="380" cy="380" r="280" stroke="#E5C27A" strokeWidth="1" />
      </svg>

      <Container className="relative z-[1] flex flex-wrap items-center justify-between gap-12 pt-9 pb-[150px]">
        <div className="max-w-[600px] flex-[1_1_500px]">
          <p className="inline-flex animate-rise items-center gap-2 rounded-full border border-gold/35 bg-gold/14 px-3.5 py-[7px] text-[13px] font-semibold text-gold-light">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-gold-light" />
            Buy · Sell · Swap · Import — Lagos
          </p>
          <h1 className="mt-[22px] animate-rise text-[44px] leading-[1.04] font-extrabold tracking-[-0.035em] [animation-delay:.1s] sm:text-[56px] lg:text-[64px]">
            Your next car,
            <br />
            <span className="text-gold-light">the royal way.</span>
          </h1>
          <p className="mt-5 max-w-[500px] animate-rise text-base leading-[1.65] text-on-navy-soft [animation-delay:.2s] sm:text-lg">
            Clean, inspected cars ready to drive in Lagos. Swap your current car, sell it fast, or import one and track it
            all the way home.
          </p>
          <div className="mt-8 flex animate-rise flex-wrap gap-3 [animation-delay:.3s]">
            <ButtonLink to="/cars" size="lg">
              Browse cars <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.2} />
            </ButtonLink>
            <ButtonLink
              to="/swap"
              variant="outline"
              size="lg"
              className="border-white/35 text-white hover:border-gold-light hover:bg-transparent hover:text-gold-light"
            >
              <ArrowRightLeft aria-hidden="true" className="size-[18px]" /> Swap my car
            </ButtonLink>
          </div>
          <ul className="mt-[38px] flex animate-rise flex-wrap gap-x-[26px] gap-y-3 text-sm text-on-navy-soft [animation-delay:.45s]">
            {TRUST.map(({ icon: Icon, text }) => (
              <li key={text} className="inline-flex items-center gap-2">
                <Icon aria-hidden="true" className="size-[18px] text-gold-light" strokeWidth={2} />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex w-full flex-[0_1_460px] justify-center">
          {slides.length > 0 ? (
            <ArchCarousel cars={slides} />
          ) : (
            <div aria-hidden="true" className="h-[460px] w-full max-w-[460px] animate-pulse rounded-[240px_240px_26px_26px] bg-navy-2 sm:h-[560px]" />
          )}
          <FloatingChip
            className="top-[120px] -left-9 animate-bob"
            iconClass="bg-gold-tint text-gold-text"
            icon={<ArrowRightLeft aria-hidden="true" className="size-[18px]" strokeWidth={2} />}
            title="Swap accepted"
            text="Bring your car, top up"
          />
          <FloatingChip
            className="top-[300px] -right-6 [animation:bob_5.5s_ease-in-out_.8s_infinite]"
            iconClass="bg-available-tint text-available"
            icon={<Check aria-hidden="true" className="size-[18px]" strokeWidth={2.4} />}
            title="Inspected"
            text="Engine · body · papers"
          />
        </div>
      </Container>
    </section>
  );
}

interface FloatingChipProps {
  className: string;
  iconClass: string;
  icon: ReactNode;
  title: string;
  text: string;
}

/** White chip floating beside the arch, bobbing gently (decorative, hidden on phones) */
function FloatingChip({ className, iconClass, icon, title, text }: FloatingChipProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute z-[3] hidden items-center gap-2.5 rounded-[14px] bg-surface px-4 py-3 text-ink shadow-chip lg:flex ${className}`}
    >
      <span className={`flex size-9 items-center justify-center rounded-[10px] ${iconClass}`}>{icon}</span>
      <span>
        <span className="block text-[13px] font-extrabold">{title}</span>
        <span className="block text-xs text-muted">{text}</span>
      </span>
    </div>
  );
}
