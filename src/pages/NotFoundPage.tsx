import { Container } from "@/components/layout/Container";
import { RoadSignDrawing } from "@/components/illustrations";
import { ButtonLink } from "@/components/ui/Button";

/** "Oops, wrong turn." with the swinging gold 404 road sign */
export default function NotFoundPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center overflow-hidden rounded-panel bg-navy px-6 py-14 text-center text-white sm:py-20">
        <RoadSignDrawing />
        <h1 className="mt-3 text-[30px] font-extrabold tracking-[-0.025em] sm:text-[40px]">Oops, wrong turn.</h1>
        <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-[#C9D2DE]">
          This road doesn't lead anywhere. Let's get you back to the showroom.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/cars" size="lg">
            Back to the showroom
          </ButtonLink>
          <ButtonLink
            to="/"
            variant="outline"
            size="lg"
            className="border-white/35 text-white hover:border-gold-light hover:bg-transparent hover:text-gold-light"
          >
            Go home
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
