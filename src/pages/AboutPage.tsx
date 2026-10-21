import { Eye, Target } from "lucide-react";
import streetImage from "@/assets/car.avif";
import { ImportSteps } from "@/components/content/ImportSteps";
import { PromiseBanner } from "@/components/content/PromiseBanner";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { FadeUp } from "@/components/motion/FadeUp";
import { ArcDivider } from "@/components/ui/ArcDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { COMPANY, IMPORT_STEPS, VALUES } from "@/data/content";

export default function AboutPage() {
  const statements = [
    { title: "Our vision", body: COMPANY.vision, icon: Eye },
    { title: "Our mission", body: COMPANY.mission, icon: Target },
  ];

  return (
    <>
      <PageHero
        title="About *Royal Shades*"
        eyebrow="Imported with care · Lagos"
        description="The Royal Shades Autos Limited sources quality cars abroad, ships them to Lagos and hands them over with their full history."
        image={streetImage}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
      />

      <section className="py-20">
        <Container className="grid gap-6 md:grid-cols-2">
          {statements.map(({ title, body, icon: Icon }, index) => (
            <FadeUp key={title} delay={index * 0.1} className="h-full rounded-panel border border-gold/30 bg-graphite p-8 sm:p-10">
              <Icon aria-hidden="true" className="size-7 text-gold" strokeWidth={1.6} />
              <h2 className="mt-5 text-xs font-semibold tracking-eyebrow text-gold uppercase">{title}</h2>
              <p className="mt-3 text-2xl leading-snug font-bold tracking-[-0.01em] text-balance sm:text-[26px]">{body}</p>
            </FadeUp>
          ))}
        </Container>
      </section>

      <section className="border-y border-section-line bg-section-alt py-20">
        <Container>
          <FadeUp>
            <SectionHeading
              eyebrow="What we stand for"
              title="Why buyers *trust* us"
              align="center"
              description="Buying a car from abroad shouldn't feel like a gamble. These are the promises we keep on every import."
            />
          </FadeUp>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {VALUES.map((value, index) => (
              <li key={value.title}>
                <FadeUp delay={index * 0.08} className="h-full rounded-card border border-line bg-graphite p-7">
                  <span aria-hidden="true" className="block h-px w-10 bg-gold" />
                  <h3 className="mt-5 text-lg font-bold">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{value.body}</p>
                </FadeUp>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <ArcDivider />

      <section className="pt-10 pb-20">
        <Container>
          <SectionHeading eyebrow="Simple and transparent" title="How importing *works*" align="center" />
          <ImportSteps steps={IMPORT_STEPS} className="mt-12" />
          <FadeUp className="mt-20">
            <PromiseBanner />
          </FadeUp>
        </Container>
      </section>
    </>
  );
}
