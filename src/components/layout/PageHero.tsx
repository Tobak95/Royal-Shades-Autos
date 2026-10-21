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

/** Dark car-photo banner for inner pages */
export function PageHero({ title, breadcrumbs, eyebrow, description, image = heroImage, children, className }: PageHeroProps) {
  return (
    <section
      className={cn("relative border-b border-white/[0.06] bg-cover bg-center", className)}
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(10,10,11,.96) 0%, rgba(10,10,11,.82) 45%, rgba(10,10,11,.5) 100%), linear-gradient(0deg, #0A0A0B 0%, rgba(10,10,11,0) 45%), url("${image}")`,
      }}
    >
      <Container className="py-14 sm:py-20 lg:py-24">
        <Breadcrumb items={breadcrumbs} />
        {eyebrow && (
          <Eyebrow line className="mt-6">
            {eyebrow}
          </Eyebrow>
        )}
        <h1
          className={cn(
            "max-w-3xl text-[36px] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance sm:text-[46px] lg:text-[52px]",
            eyebrow ? "mt-3" : "mt-4",
          )}
        >
          <AccentText text={title} />
        </h1>
        {description && <p className="mt-4 max-w-xl text-base leading-[1.65] text-haze sm:text-[17px]">{description}</p>}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
