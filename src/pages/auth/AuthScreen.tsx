import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRightLeft, Clock, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { AccentText } from "@/components/ui/AccentText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CAR_IMAGES, imagePosition } from "@/data/carImages";
import { cn } from "@/lib/utils";

interface AuthScreenProps {
  /** Which side the form card sits on; the navy photo panel takes the other side */
  side: "right" | "left";
  eyebrow: string;
  /** Wrap the accent word in asterisks */
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  /** One of the dealership's own photos for the navy panel */
  photo?: string;
  wide?: boolean;
}

const TRUST = [
  { icon: ShieldCheck, text: "Inspected before sale" },
  { icon: ArrowRightLeft, text: "Fair swap value" },
  { icon: Clock, text: "Papers sorted for you" },
];

/** Navy panel with a car photo on one side, white form card on the other (v2 auth pages) */
export function AuthScreen({ side, eyebrow, title, subtitle, children, photo = CAR_IMAGES.avalonFront, wide = false }: AuthScreenProps) {
  return (
    <Container className="py-8 sm:py-12">
      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        <div
          className={cn(
            "relative min-h-[190px] overflow-hidden rounded-[28px] bg-navy text-white sm:min-h-[240px] lg:min-h-[640px]",
            side === "left" && "lg:order-2",
          )}
        >
          <img
            src={photo}
            alt=""
            style={{ objectPosition: imagePosition(photo) }}
            className="absolute inset-0 size-full object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-navy/20 via-navy/45 to-navy/95" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
            <Eyebrow tone="light">The Royal Shades Autos Limited</Eyebrow>
            <p className="mt-2 text-2xl leading-tight font-extrabold tracking-[-0.03em] sm:text-[32px]">
              Your next car, <span className="text-gold-light">the royal way.</span>
            </p>
            <ul className="mt-5 hidden flex-wrap gap-x-6 gap-y-2.5 text-sm text-on-navy-soft sm:flex">
              {TRUST.map(({ icon: Icon, text }) => (
                <li key={text} className="inline-flex items-center gap-2">
                  <Icon aria-hidden="true" className="size-[18px] text-gold-light" strokeWidth={2} />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn("flex", side === "left" && "lg:order-1")}
        >
          <div
            className={cn(
              "mx-auto flex w-full flex-col justify-center rounded-[28px] border border-line bg-surface px-6 py-9 shadow-float sm:px-10 sm:py-11",
              wide ? "max-w-[620px]" : "max-w-[540px]",
            )}
          >
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-2.5 text-[32px] leading-[1.1] font-extrabold tracking-[-0.03em] sm:text-[38px]">
              <AccentText text={title} />
            </h1>
            {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
            {children}
          </div>
        </motion.div>
      </div>
    </Container>
  );
}
