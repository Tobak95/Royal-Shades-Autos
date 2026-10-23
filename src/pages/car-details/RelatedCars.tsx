import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarCard } from "@/components/car/CarCard";
import { CarCardSkeleton } from "@/components/car/CarGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useQuery } from "@/hooks/useQuery";
import { getRelatedCars } from "@/services/carService";
import type { Car } from "@/types";

const arrowClass =
  "flex size-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-gold hover:text-gold-text";

/** "You might also like" horizontal carousel with scroll snapping */
export function RelatedCars({ car }: { car: Car }) {
  const { data, loading } = useQuery(`related-${car.id}`, () => getRelatedCars(car));
  const trackRef = useRef<HTMLUListElement>(null);

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  };

  if (!loading && !data?.length) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-20">
      <div className="flex items-end justify-between gap-4">
        <div id="related-heading">
          <SectionHeading eyebrow="Keep exploring" title="You might also *like*" size="md" />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => scroll(-1)} aria-label="Scroll left" className={arrowClass}>
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Scroll right" className={arrowClass}>
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
      <ul
        ref={trackRef}
        className="-mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto px-4 pt-2 pb-6 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6"
      >
        {loading
          ? Array.from({ length: 3 }, (_, i) => (
              <li key={i} className="w-[300px] flex-none">
                <CarCardSkeleton />
              </li>
            ))
          : data?.map((related) => (
              <li key={related.id} className="w-[min(300px,85vw)] flex-none snap-start">
                <CarCard car={related} className="h-full" />
              </li>
            ))}
      </ul>
    </section>
  );
}
