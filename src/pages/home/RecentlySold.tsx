import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { CarImage } from "@/components/car/CarImage";
import { Container } from "@/components/layout/Container";
import { FadeUp } from "@/components/motion/FadeUp";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Skeleton } from "@/components/ui/Skeleton";
import { useQuery } from "@/hooks/useQuery";
import { getCars } from "@/services/carService";
import type { Car } from "@/types";

const SHOWN = 2;

const soldMonth = (car: Car) =>
  car.soldAt
    ? new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(new Date(`${car.soldAt}T12:00:00`))
    : "recently";

export function RecentlySold() {
  const { data, loading } = useQuery("recently-sold", () => getCars({ status: "sold", pageSize: 50 }));
  const sold = [...(data?.cars ?? [])].sort((a, b) => (b.soldAt ?? "").localeCompare(a.soldAt ?? "")).slice(0, SHOWN);

  return (
    <section id="sold" className="pt-14 pb-6">
      <Container>
        <FadeUp className="flex flex-wrap items-end justify-between gap-[18px]">
          <SectionHeading
            eyebrow="Proof, not promises"
            title="Recently *sold*"
            description="Cars that have already found new owners in Lagos."
          />
          <Link
            to="/cars?status=sold"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-gold-text hover:text-gold-hover"
          >
            See all sold cars <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.2} />
          </Link>
        </FadeUp>

        <div className="mt-[30px] grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: SHOWN }, (_, i) => <Skeleton key={i} className="h-[280px] rounded-card" />)
            : sold.map((car) => <SoldTile key={car.id} car={car} />)}

          <div className="flex min-h-[270px] flex-col justify-between gap-[18px] rounded-card bg-navy p-[26px] text-white">
            <div>
              <ShieldCheck aria-hidden="true" className="size-[34px] text-gold-light" strokeWidth={1.8} />
              <h3 className="mt-3.5 text-[22px] leading-[1.2] font-extrabold">
                Missed one? <span className="text-gold-light">We'll source it for you.</span>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-navy-muted">
                Tell us the make, model and budget, and we'll find it abroad or locally.
              </p>
            </div>
            <ButtonLink to="/contact" className="self-start">
              Request a car
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

function SoldTile({ car }: { car: Car }) {
  return (
    <article className="relative overflow-hidden rounded-card border border-line bg-surface">
      <div className="relative h-[210px] overflow-hidden">
        <CarImage src={car.images[0]} alt={`${car.color} ${car.make} ${car.model}, sold`} muted className="size-full" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-5 -left-[42px] -rotate-[35deg] bg-sold px-[54px] py-[7px] text-xs font-extrabold tracking-[0.22em] text-white"
        >
          SOLD
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-[18px] pt-4 pb-[18px]">
        <div>
          <h3 className="text-[17px] font-extrabold">
            {car.make} {car.model}
          </h3>
          <p className="mt-[3px] text-[13px] text-muted">
            {car.bodyType} · Sold {soldMonth(car)}
          </p>
        </div>
        <Link
          to={`/cars?body=${encodeURIComponent(car.bodyType)}`}
          className="inline-flex min-h-11 items-center text-[13px] font-bold text-gold-text hover:text-gold-hover"
        >
          Find similar<span className="sr-only"> to the {car.make} {car.model}</span>
        </Link>
      </div>
    </article>
  );
}
