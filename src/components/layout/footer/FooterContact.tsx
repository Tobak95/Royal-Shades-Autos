import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { directionsHref, emailHref, phoneHref } from "@/lib/contact";
import { CONTACT } from "@/lib/site";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

const ROWS = [
  { icon: MapPin, text: CONTACT.address, href: directionsHref },
  { icon: Phone, text: CONTACT.phone, href: phoneHref },
  { icon: Mail, text: CONTACT.email, href: emailHref },
  { icon: Clock, text: CONTACT.hours, href: () => null },
];

/** Address, phone, email and hours (desktop column and the mobile "Visit us" group) */
export function ContactList({ className }: { className?: string }) {
  return (
    <address className={cn("flex flex-col gap-3.5 text-[15px] text-[#C9D2DE] not-italic", className)}>
      {ROWS.map(({ icon: Icon, text, href }) => {
        const link = href();
        const content = (
          <>
            <Icon aria-hidden="true" className="mt-0.5 size-[17px] flex-none text-gold-light" strokeWidth={2} />
            {text}
          </>
        );
        return link ? (
          <a key={text} href={link} className="flex min-h-11 items-start gap-2.5 py-1 transition-colors hover:text-gold-light md:min-h-0 md:py-0">
            {content}
          </a>
        ) : (
          <span key={text} className="flex min-h-11 items-start gap-2.5 py-1 md:min-h-0 md:py-0">
            {content}
          </span>
        );
      })}
    </address>
  );
}

const tile = "flex h-16 flex-col items-center justify-center gap-1 rounded-[14px] text-xs font-bold text-white";

/** Phones: three big tap targets. Call and Directions stay disabled until the real details are set. */
export function QuickContact() {
  const call = phoneHref();
  const directions = directionsHref();
  return (
    <div className="mt-[22px] grid grid-cols-3 gap-2">
      {call ? (
        <a href={call} className={cn(tile, "bg-white/[0.07] hover:bg-white/[0.12]")}>
          <Phone aria-hidden="true" className="size-5 text-gold-light" /> Call
        </a>
      ) : (
        <button type="button" disabled title="Phone number coming soon" className={cn(tile, "bg-white/[0.07] opacity-45")}>
          <Phone aria-hidden="true" className="size-5 text-gold-light" /> Call
        </button>
      )}
      <a
        href={whatsappLink("Hello Royal Shades Autos, I'd like to talk about getting a car.")}
        target="_blank"
        rel="noreferrer"
        className={cn(tile, "bg-available/[0.18] hover:bg-available/25")}
      >
        <WhatsAppIcon size={20} className="text-[#5FD39A]" /> WhatsApp
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      {directions ? (
        <a href={directions} target="_blank" rel="noreferrer" className={cn(tile, "bg-white/[0.07] hover:bg-white/[0.12]")}>
          <Navigation aria-hidden="true" className="size-5 text-gold-light" /> Directions
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <button type="button" disabled title="Showroom address coming soon" className={cn(tile, "bg-white/[0.07] opacity-45")}>
          <Navigation aria-hidden="true" className="size-5 text-gold-light" /> Directions
        </button>
      )}
    </div>
  );
}
