import { Link } from "react-router-dom";
import { WhatsAppIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

const button = "inline-flex h-12 items-center justify-center gap-2 rounded-control px-5 text-[15px] font-bold transition-colors md:h-[50px]";

/** Gold "Ready for your next car?" card that overlaps the footer's top edge */
export function FooterCta() {
  return (
    <div className="relative -top-10 flex flex-wrap items-center justify-between gap-[18px] rounded-[20px] bg-[linear-gradient(120deg,var(--color-gold)_0%,var(--color-gold-light)_100%)] p-5 text-navy shadow-[0_30px_60px_-30px_rgb(11_27_46/0.6)] md:-top-11 md:rounded-panel md:px-8 md:py-7">
      <div>
        <p className="text-[22px] font-extrabold tracking-[-0.02em] md:text-[28px]">Ready for your next car?</p>
        <p className="mt-1 text-sm font-medium text-[#3B2E10] md:text-[15px]">
          <span className="hidden md:inline">Buy, swap or sell. </span>Talk to a real person today.
        </p>
      </div>
      <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:flex-wrap md:gap-2.5">
        <Link to="/cars" className={cn(button, "bg-navy text-white hover:bg-navy-3")}>
          Browse cars
        </Link>
        <Link to="/swap" className={cn(button, "border-[1.5px] border-navy hover:bg-navy/10")}>
          Swap my car
        </Link>
        <a
          href={whatsappLink("Hello Royal Shades Autos, I'd like to talk about getting a car.")}
          target="_blank"
          rel="noreferrer"
          className={cn(button, "hidden bg-white hover:bg-white/85 md:inline-flex")}
        >
          <WhatsAppIcon size={18} className="text-available" /> WhatsApp
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
