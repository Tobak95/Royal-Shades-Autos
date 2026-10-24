import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { FadeUp } from "@/components/motion/FadeUp";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { FAQ_GROUPS } from "@/data/faqs";
import { POLICY } from "@/lib/site";

export default function FaqsPage() {
  return (
    <>
      <PageHero
        title="Frequently asked *questions*"
        description="Everything about importing, duty, payment, inspection and delivery."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "FAQs" }]}
      />
      <Container className="grid gap-12 py-16 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="FAQ topics" className="hidden lg:block">
          <ul className="sticky top-28 flex flex-col gap-1">
            {FAQ_GROUPS.map((group) => (
              <li key={group.id}>
                <a
                  href={`#${group.id}`}
                  className="flex min-h-11 items-center rounded-control px-3 text-sm font-semibold text-muted transition-colors hover:bg-navy/[0.04] hover:text-gold-text"
                >
                  {group.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-12">
          {FAQ_GROUPS.map((group) => (
            <FadeUp key={group.id}>
              <section id={group.id} aria-labelledby={`${group.id}-heading`}>
                <h2 id={`${group.id}-heading`} className="text-xs font-semibold tracking-eyebrow text-gold-text uppercase">
                  {group.title}
                </h2>
                <Accordion
                  className="mt-4"
                  items={group.items.map((item) => ({ id: item.id, title: item.question, content: item.answer }))}
                />
              </section>
            </FadeUp>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-5 rounded-panel bg-navy p-7 text-white">
            <div>
              <h2 className="text-xl font-bold">Still have a question?</h2>
              <p className="mt-1 text-sm text-on-navy-muted">Our Lagos team usually replies within {POLICY.responseTime}.</p>
            </div>
            <ButtonLink to="/contact">Contact us</ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}
