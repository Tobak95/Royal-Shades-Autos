import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { AccentText } from "@/components/ui/AccentText";
import { CONTACT } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { ContactForm } from "./ContactForm";

export default function ContactPage() {
  const details = [
    { icon: MapPin, label: "Showroom", value: CONTACT.address },
    { icon: Phone, label: "Phone", value: CONTACT.phone },
    { icon: Mail, label: "Email", value: CONTACT.email },
    { icon: Clock, label: "Opening hours", value: CONTACT.hours },
  ];

  return (
    <>
      <PageHero
        title="Get in *Touch*"
        description="Questions about a car, a shipment or sourcing something specific? We're happy to help."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />
      <Container className="grid items-start gap-8 py-16 lg:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="glass rounded-panel p-7 sm:p-8">
          <h2 className="text-[28px] font-extrabold tracking-[-0.02em]">
            <AccentText text="Get in *Touch*" />
          </h2>
          <p className="mt-2 text-sm text-muted">Visit the yard, call, or message us on WhatsApp.</p>
          <ul className="mt-7 flex flex-col gap-5">
            {details.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex gap-3.5">
                <span className="flex size-10 flex-none items-center justify-center rounded-full bg-gold/10 text-gold">
                  <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-xs text-muted">{label}</p>
                  <p className="mt-0.5 text-sm font-semibold">{value}</p>
                </div>
              </li>
            ))}
          </ul>
          <a
            href={whatsappLink("Hello Royal Shades Autos, I have a question.")}
            target="_blank"
            rel="noreferrer"
            className="mt-8 flex h-12 items-center justify-center gap-2.5 rounded-control bg-gold text-sm font-bold text-obsidian transition-colors hover:bg-gold-light"
          >
            <WhatsAppIcon size={18} /> Chat on WhatsApp
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </aside>
        <ContactForm />
      </Container>
    </>
  );
}
