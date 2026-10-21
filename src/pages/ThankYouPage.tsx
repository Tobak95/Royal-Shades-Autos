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
        className="border-b border-white/[0.06] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(10,10,11,.97) 0%, rgba(10,10,11,.85) 50%, rgba(10,10,11,.55) 100%), linear-gradient(0deg, #0A0A0B 0%, rgba(10,10,11,0) 45%), url("${streetImage}")`,
        }}
      >
        <Container className="py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <CircleCheck aria-hidden="true" className="size-12 text-gold" strokeWidth={1.6} />
            <Eyebrow line className="mt-6">
              Reservation received
            </Eyebrow>
            <h1 className="mt-3 text-[38px] leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-[52px]">
              <AccentText text="Thank you for choosing *Royal Shades*" />
            </h1>
            <p className="mt-5 text-base leading-[1.65] text-haze sm:text-[17px]">
              Your cars are held for you. We'll be in touch within one working day to confirm everything.
            </p>
            {reservationId && (
              <p className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-control border border-gold/30 bg-graphite/70 px-4 py-3 text-sm">
                <span className="text-muted">Reservation number</span>
                <strong className="font-bold tracking-wide text-gold">{reservationId}</strong>
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/cars" size="lg">
                Back to the showroom <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.2} />
              </ButtonLink>
              <ButtonLink to="/track" variant="outline" size="lg" className="border-white/30">
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
