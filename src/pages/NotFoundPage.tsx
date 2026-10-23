import { Container } from "@/components/layout/Container";
import { AccentText } from "@/components/ui/AccentText";
import { ArcDivider } from "@/components/ui/ArcDivider";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <p className="text-[96px] leading-none font-extrabold tracking-[-0.04em] text-gold-text sm:text-[128px]">404</p>
      <ArcDivider className="pt-2" />
      <h1 className="mt-4 text-[32px] font-extrabold tracking-[-0.025em] sm:text-[40px]">
        <AccentText text="This road doesn't *lead anywhere*" />
      </h1>
      <p className="mt-3 max-w-md text-[15px] text-muted">
        The page you're looking for has moved or never existed. Let's get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to="/" size="lg">
          Go home
        </ButtonLink>
        <ButtonLink to="/cars" variant="outline" size="lg">
          Explore the showroom
        </ButtonLink>
      </div>
    </Container>
  );
}
