import type { ReactNode } from "react";
import heroImage from "@/assets/carrrrrrrs.avif";
import { AccentText } from "@/components/ui/AccentText";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface PageHeroProps {
  /** Wrap the accent word in asterisks: "Get in *Touch*" */
  title: string;
  breadcrumbs: BreadcrumbItem[];
  eyebrow?: string;
  description?: ReactNode;
  image?: string;
  children?: ReactNode;
  className?: string;
}

/** Navy car-photo banner for inner pages (rounded bottom like the v2 hero) */
export function PageHero({ title, breadcrumbs, eyebrow, description, image = heroImage, children, className }: PageHeroProps) {
  return (
    <section
      className={cn("relative overflow-hidden rounded-b-hero bg-navy bg-cover bg-center text-white", className)}
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(11,27,46,.97) 0%, rgba(11,27,46,.86) 45%, rgba(11,27,46,.55) 100%), url("${image}")`,
      }}
    >
      <Container className="py-14 sm:py-20 lg:py-24">
        <Breadcrumb items={breadcrumbs} tone="light" />
        {eyebrow && (
          <Eyebrow line tone="light" className="mt-6">
            {eyebrow}
          </Eyebrow>
        )}
        <h1
          className={cn(
            "max-w-3xl text-[36px] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance sm:text-[46px] lg:text-[52px]",
            eyebrow ? "mt-3" : "mt-4",
          )}
        >
          <AccentText text={title} tone="light" />
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-base leading-[1.65] text-on-navy-soft sm:text-[17px]">{description}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
