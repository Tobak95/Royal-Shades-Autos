import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { BRAND, CONTACT, DEPOSIT_PERCENT, POLICY } from "@/lib/site";

const SECTIONS: { title: string; body: ReactNode }[] = [
  {
    title: "About these terms",
    body: (
      <p>
        These terms apply when you use this website or reserve, buy, swap or sell a car with {BRAND.name} ("Royal Shades
        Autos", "we"). By placing a reservation you agree to them.
      </p>
    ),
  },
  {
    title: "Prices",
    body: (
      <p>
        {POLICY.priceIncludesText} Prices are in Naira and can change until a reservation is confirmed. We'll always tell
        you the full amount before you pay.
      </p>
    ),
  },
  {
    title: "Reservations and deposits",
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>A {DEPOSIT_PERCENT} deposit holds a car for you once we confirm your reservation.</li>
        <li>{POLICY.refundText}</li>
        <li>We only accept payment into our company account, never a personal one.</li>
        <li>Cars marked "Coming soon" or "Sold" can't be reserved.</li>
      </ul>
    ),
  },
  {
    title: "Imported cars and arrival dates",
    body: (
      <p>
        Arrival dates for cars on the water are estimates. Shipping, port and customs delays can move them, and we'll keep
        your tracking page up to date. [Owner to confirm what happens if a car is delayed by more than a set time.]
      </p>
    ),
  },
  {
    title: "Inspection and collection",
    body: (
      <p>
        You can inspect your car at our Lagos yard before paying the balance. Collection or delivery is arranged once the
        balance is paid. {POLICY.freeLagosDelivery ? "Delivery within Lagos is free." : ""}
      </p>
    ),
  },
  {
    title: "Swaps and selling to us",
    body: (
      <p>
        Swap and sale offers depend on inspecting your car and checking its papers. An offer can change if the car's
        condition or documents differ from what was described.
      </p>
    ),
  },
  {
    title: "Your account",
    body: (
      <p>
        Keep your login details private. You're responsible for activity on your account, and you can ask us to close it at
        any time.
      </p>
    ),
  },
  {
    title: "Liability and governing law",
    body: <p>[Liability terms to be provided by the owner's lawyer.] These terms are governed by the laws of Nigeria.</p>,
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
        <Link to="/contact" className="text-gold-text hover:text-gold-hover">
          contact form
        </Link>
        . See also our{" "}
        <Link to="/privacy" className="text-gold-text hover:text-gold-hover">
          privacy policy
        </Link>
        .
      </address>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms of *service*"
        description="Last updated [date]."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Terms of service" }]}
      />
      <Container className="py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <p className="rounded-control border border-gold-border bg-gold-tint px-4 py-3 text-sm text-[#6B4E12]">
            Draft wording for review. Please have it checked by a lawyer before launch.
          </p>
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-extrabold">{section.title}</h2>
              <div className="mt-3 text-[15px] leading-[1.75] text-[#3D4757]">{section.body}</div>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
