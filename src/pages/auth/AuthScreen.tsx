import type { ReactNode } from "react";
import { motion } from "framer-motion";
import garageImage from "@/assets/carrrrrrrs.avif";
import streetImage from "@/assets/car.avif";
import { Container } from "@/components/layout/Container";
import { AccentText } from "@/components/ui/AccentText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

interface AuthScreenProps {
  /** Card on the right over the garage photo (login), or on the left over the street photo (sign up) */
  side: "right" | "left";
  eyebrow: string;
  /** Wrap the accent word in asterisks */
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}

const BACKGROUNDS = {
  right: `linear-gradient(90deg, rgba(10,10,11,.15) 0%, rgba(10,10,11,.55) 45%, rgba(10,10,11,.95) 70%, #0A0A0B 100%), linear-gradient(0deg, #0A0A0B 0%, rgba(10,10,11,0) 35%), url("${garageImage}")`,
  left: `linear-gradient(270deg, rgba(10,10,11,.1) 0%, rgba(10,10,11,.6) 45%, rgba(10,10,11,.96) 68%, #0A0A0B 100%), linear-gradient(0deg, #0A0A0B 0%, rgba(10,10,11,0) 35%), url("${streetImage}")`,
};

/** Glass card over a dark car photo, as in the login and sign-up mockups */
export function 

AuthScreen({ side, eyebrow, title, subtitle, children, wide = false }: AuthScreenProps) {
  return (
    <section
      className={cn(
        "flex items-center bg-cover",
        side === "right" ? "bg-[position:left_center] lg:min-h-[760px]" : "bg-[position:right_center] lg:min-h-[860px]",
      )}
      style={{ backgroundImage: BACKGROUNDS[side] }}
    >
      <Container className={cn("flex py-10 sm:py-14", side === "right" ? "justify-end" : "justify-start")}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn("glass w-full rounded-panel px-6 py-9 sm:px-9 sm:py-10", wide ? "max-w-[560px]" : "max-w-[460px]")}
        >
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-2.5 text-[32px] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[38px]">
            <AccentText text={title} />
          </h1>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
          {children}
        </motion.div>
      </Container>
    </section>
  );
}
