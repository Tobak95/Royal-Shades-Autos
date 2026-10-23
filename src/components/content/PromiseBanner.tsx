import streetImage from "@/assets/car.avif";
import { WhatsAppIcon } from "@/components/icons";
import { AccentText } from "@/components/ui/AccentText";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buttonVariants } from "@/components/ui/variants";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

const background = `linear-gradient(90deg, rgba(11,27,46,.1) 0%, rgba(11,27,46,.85) 58%, #0B1B2E 100%), url("${streetImage}")`;

/** "Our promise" navy panel over the street photo (about page) */
export function PromiseBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-[380px] justify-end overflow-hidden rounded-[28px] bg-navy bg-cover bg-[position:center_left] text-white",
        className,
      )}
      style={{ backgroundImage: background }}
    >
      <div className="flex flex-[0_1_520px] flex-col justify-center bg-gradient-to-t from-navy/95 to-transparent p-7 sm:bg-none sm:p-12">
        <Eyebrow tone="light">Our promise</Eyebrow>
        <h2 className="mt-3 text-[28px] leading-[1.15] font-extrabold tracking-[-0.03em] sm:text-[36px]">
          <AccentText text="Giving new life to vehicles, *responsibly*." tone="light" />
        </h2>
        <p className="mt-4 text-[15px] leading-[1.7] text-on-navy-muted">
          Every car is inspected before shipping, documented at every port, and handed over with its full history. Our aim
          is simple: the best customer experience in Lagos.
        </p>
        <div className="mt-[26px] flex flex-wrap gap-3">
          <ButtonLink to="/contact">Talk to us</ButtonLink>
          <a
            href={whatsappLink("Hello Royal Shades Autos, I'd like to ask about importing a car.")}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-white/35 text-white hover:border-gold-light hover:bg-transparent hover:text-gold-light",
            )}
          >
            <WhatsAppIcon size={16} /> WhatsApp
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
