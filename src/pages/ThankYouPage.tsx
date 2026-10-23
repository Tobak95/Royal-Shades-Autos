import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CircleCheck } from "lucide-react";
import streetImage from "@/assets/car.avif";
import { ImportSteps } from "@/components/content/ImportSteps";
import { Container } from "@/components/layout/Container";
import { AccentText } from "@/components/ui/AccentText";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { THANK_YOU_STEPS } from "@/data/content";
import { POLICY } from "@/lib/site";

function readReservationId(state: unknown): string | null {
  if (typeof state === "object" && state !== null && "reservationId" in state) {
    const id = (state as { reservationId: unknown }).reservationId;
    return typeof id === "string" ? id : null;
  }
  return null;
}

export default function ThankYouPage() {
  const reservationId = readReservationId(useLocation().state);

  return (
    <>
      <section
        className="overflow-hidden rounded-b-hero bg-navy bg-cover bg-center text-white"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(11,27,46,.97) 0%, rgba(11,27,46,.86) 50%, rgba(11,27,46,.55) 100%), url("${streetImage}")`,
        }}
      >
        <Container className="py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <CircleCheck aria-hidden="true" className="size-12 text-gold-light" strokeWidth={1.6} />
            <Eyebrow line tone="light" className="mt-6">
              Reservation received
            </Eyebrow>
            <h1 className="mt-3 text-[38px] leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-[52px]">
              <AccentText text="Thank you for choosing *Royal Shades*" tone="light" />
            </h1>
            <p className="mt-5 text-base leading-[1.65] text-on-navy-soft sm:text-[17px]">
              Your cars are held for you. We'll be in touch within {POLICY.responseTime} to confirm everything.
            </p>
            {reservationId && (
              <p className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-control border border-gold/40 bg-navy-2/80 px-4 py-3 text-sm">
                <span className="text-on-navy-muted">Reservation number</span>
                <strong className="font-bold tracking-wide text-gold-light">{reservationId}</strong>
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/cars" size="lg">
                Back to the showroom <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.2} />
              </ButtonLink>
              <ButtonLink
                to="/track"
                variant="outline"
                size="lg"
                className="border-white/35 text-white hover:border-gold-light hover:bg-transparent hover:text-gold-light"
              >
                Track a car
              </ButtonLink>
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="What happens next" title="Your next *steps*" />
          <ImportSteps steps={THANK_YOU_STEPS} className="mt-10 lg:grid-cols-3" />
        </Container>
      </section>
    </>
  );
}
