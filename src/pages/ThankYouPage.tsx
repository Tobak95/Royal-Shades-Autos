import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CircleCheck } from "lucide-react";
import streetImage from "@/assets/car.avif";
import { ImportSteps } from "@/components/content/ImportSteps";
import { SuccessModal } from "@/components/feedback/SuccessModal";
import { Container } from "@/components/layout/Container";
import { AccentText } from "@/components/ui/AccentText";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { THANK_YOU_STEPS } from "@/data/content";
import { POLICY } from "@/lib/site";

interface ThankYouState {
  reservationId: string | null;
  carNames: string[];
  /** Set once the success modal has been closed, so a refresh doesn't show it again */
  celebrated: boolean;
}

function readState(state: unknown): ThankYouState {
  const s = typeof state === "object" && state !== null ? (state as Record<string, unknown>) : {};
  return {
    reservationId: typeof s.reservationId === "string" ? s.reservationId : null,
    carNames: Array.isArray(s.carNames) ? s.carNames.filter((n): n is string => typeof n === "string") : [],
    celebrated: s.celebrated === true,
  };
}

/** "Toyota Avalon", "Toyota Avalon and Lexus RX", "Toyota Avalon, Lexus RX and 1 more" */
function listCars(names: string[]): string {
  if (names.length <= 2) return names.join(" and ");
  return `${names.slice(0, 2).join(", ")} and ${names.length - 2} more`;
}

export default function ThankYouPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservationId, carNames, celebrated } = readState(location.state);
  const [celebrating, setCelebrating] = useState(Boolean(reservationId) && !celebrated);

  function closeCelebration() {
    setCelebrating(false);
    navigate(location.pathname, { replace: true, state: { reservationId, carNames, celebrated: true } });
  }

  const reservedText = carNames.length
    ? `Your ${listCars(carNames)} ${carNames.length === 1 ? "is" : "are"} reserved.`
    : "Your cars are reserved.";

  return (
    <>
      {reservationId && (
        <SuccessModal
          open={celebrating}
          onClose={closeCelebration}
          title="Congratulations, {name}!"
          fallbackTitle="Congratulations!"
          description={`${reservedText} We'll call you within ${POLICY.responseTime} to plan the inspection.`}
          reference={{ label: "Reservation", value: reservationId }}
          actions={
            <Button variant="navy" onClick={closeCelebration}>
              See what happens next
            </Button>
          }
        />
      )}
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
