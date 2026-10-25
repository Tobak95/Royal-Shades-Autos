import { CONTACT } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { Container } from "./Container";

/** Thin navy bar above the navbar on the home page: address, hours, phone, WhatsApp */
export function TopInfoBar() {
  return (
    <div className="border-b border-white/8 bg-navy text-[13px] text-on-navy-muted">
      <Container className="flex flex-wrap justify-between gap-x-3 gap-y-1 py-2.5">
        <span className="hidden sm:inline">
          {CONTACT.address} · Mon–Sat, {CONTACT.hours}
        </span>
        <span className="flex gap-5">
          <span>{CONTACT.phone}</span>
          <a
            href={whatsappLink("Hello Royal Shades Autos, I have a question.")}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-gold-light hover:text-white"
          >
            WhatsApp us<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </span>
      </Container>
    </div>
  );
}
