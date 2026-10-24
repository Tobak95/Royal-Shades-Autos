import { CarImage } from "@/components/car/CarImage";
import { Container } from "@/components/layout/Container";
import { FadeUp } from "@/components/motion/FadeUp";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buttonVariants } from "@/components/ui/variants";
import { CAR_IMAGES } from "@/data/carImages";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

const STEPS = [
  { title: "Bring or send your car's details", body: "Make, model, year, mileage and a few photos." },
  { title: "Get a fair valuation", body: "We inspect it and give you a clear trade-in value." },
  { title: "Top up the difference", body: "Pay only the balance and drive your new car home." },
];

/** Navy "Swap & upgrade" panel: photo on the left, three steps on the right */
export function SwapSection() {
  return (
    <section id="swap" className="py-14">
      <Container>
        <FadeUp className="flex flex-wrap overflow-hidden rounded-[28px] bg-navy text-white">
          <div className="relative min-h-[300px] flex-[1_1_420px] sm:min-h-[420px]">
            <CarImage src={CAR_IMAGES.gleRear} alt="Silver Mercedes-Benz GLE in a carport" className="absolute inset-0" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy/0 from-40% to-navy/90" />
          </div>
          <div className="flex-[1_1_480px] px-6 py-10 sm:px-11 sm:py-12">
            <Eyebrow tone="light">Swap &amp; upgrade</Eyebrow>
            <h2 className="mt-2.5 text-[30px] leading-[1.12] font-extrabold tracking-[-0.03em] sm:text-[38px]">
              Trade in your car.
              <br />
              <span className="text-gold-light">Drive out in a better one.</span>
            </h2>
            <ol className="mt-7 flex flex-col gap-4">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex items-start gap-3.5">
                  <span
                    aria-hidden="true"
                    className="flex size-[34px] flex-none items-center justify-center rounded-full border-[1.5px] border-gold-light text-sm font-extrabold text-gold-light"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold">{step.title}</p>
                    <p className="mt-0.5 text-sm text-on-navy-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/swap">Get a swap quote</ButtonLink>
              <a
                href={whatsappLink("Hello Royal Shades Autos, I'd like to swap my car.")}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-white/35 text-white hover:border-gold-light hover:bg-transparent hover:text-gold-light",
                )}
              >
                Chat on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
