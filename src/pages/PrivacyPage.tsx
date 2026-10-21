import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { BRAND, CONTACT } from "@/lib/site";

const SECTIONS: { title: string; body: ReactNode }[] = [
  {
    title: "Who we are",
    body: (
      <p>
        {BRAND.name} ("Royal Shades Autos", "we") imports and sells cars in Lagos, Nigeria. This policy explains what
        personal information we collect through this website, why, and how you can contact us about it.
      </p>
    ),
  },
  {
    title: "What we collect",
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Your name, email address and phone number when you create an account or contact us.</li>
        <li>
          Reservation details: the cars you reserve, your address and city, preferred inspection date, payment method,
          deposit amount and any message you send.
        </li>
        <li>Your Garage and wishlist, saved in your own browser so they're there when you come back.</li>
      </ul>
    ),
  },
  {
    title: "Why we collect it",
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>To manage your account and keep you signed in.</li>
        <li>To hold, confirm and complete your reservations, and to arrange inspection and delivery.</li>
        <li>To send you tracking updates about your car's shipment.</li>
        <li>To answer your questions, and to send new-arrival emails if you subscribe (you can unsubscribe at any time).</li>
      </ul>
    ),
  },
  {
    title: "Who we share it with",
    body: (
      <p>
        We never sell your information. We only share what's needed with the shipping, clearing and customs partners who
        handle your car, and where the law requires it.
      </p>
    ),
  },
  {
    title: "How long we keep it",
    body: <p>We keep reservation records for as long as the law requires for sales records, and account details until you ask us to delete them.</p>,
  },
  {
    title: "Your rights",
    body: (
      <p>
        You can ask to see, correct or delete the personal information we hold about you. Contact us using the details
        below and we'll respond within [response time].
      </p>
    ),
  },
  {
    title: "Contact us",
    body: (
      <address className="not-italic">
        {BRAND.name}
        <br />
        {CONTACT.address}
        <br />
        {CONTACT.phone} · {CONTACT.email}
        <br />
        Or use our{" "}
        <Link to="/contact" className="text-gold hover:text-gold-light">
          contact form
        </Link>
        .
      </address>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy *policy*"
        description="Last updated [date]."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Privacy policy" }]}
      />
      <Container className="py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold">{section.title}</h2>
              <div className="mt-3 text-[15px] leading-[1.75] text-soft">{section.body}</div>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
