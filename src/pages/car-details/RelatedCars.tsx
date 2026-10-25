import { useEffect, useEffectEvent, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarCard } from "@/components/car/CarCard";
import { CarCardSkeleton } from "@/components/car/CarGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useQuery } from "@/hooks/useQuery";
import { cn } from "@/lib/utils";
import { getRelatedCars } from "@/services/carService";
import type { Car } from "@/types";

const GAP = 20;

interface Position {
  index: number;
  atStart: boolean;
  atEnd: boolean;
}

/** "You might also like": one-card-per-click carousel with an "x / n" counter (swipeable on touch) */
export function RelatedCars({ car }: { car: Car }) {
  const { data, loading } = useQuery(`related-${car.id}`, () => getRelatedCars(car));
  const trackRef = useRef<HTMLUListElement>(null);
  const [pos, setPos] = useState<Position>({ index: 0, atStart: true, atEnd: false });
  const count = data?.length ?? 0;

  function measure() {
    const track = trackRef.current;
    const card = track?.querySelector("li");
    if (!track || !card) return;
    const step = card.offsetWidth + GAP;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    setPos({
      // Several cards are visible at once, so the end of the track counts as the last card
      index: atEnd ? count - 1 : Math.min(count - 1, Math.round(track.scrollLeft / step)),
      atStart: track.scrollLeft <= 1,
      atEnd,
    });
  }

  // Re-measure when the cards arrive or the window resizes (observer callbacks run after layout)
  const onResize = useEffectEvent(measure);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(() => onResize());
    observer.observe(track);
    return () => observer.disconnect();
  }, [count]);

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    const card = track?.querySelector("li");
    if (track && card) track.scrollBy({ left: direction * (card.offsetWidth + GAP), behavior: "smooth" });
  }

  if (!loading && count === 0) return null;

  const arrow = (disabled: boolean) =>
    cn(
      "flex size-[46px] items-center justify-center rounded-full border-[1.5px] transition-colors",
      disabled ? "border-line bg-surface text-[#B7BEC9]" : "border-navy bg-navy text-white hover:bg-navy-3",
    );

  return (
    <section aria-roledescription="carousel" aria-labelledby="related-heading" className="mt-[72px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div id="related-heading">
          <SectionHeading eyebrow="Keep exploring" title="You might also *like*" />
        </div>
        {count > 0 && (
          <div className="flex items-center gap-2.5">
            <span aria-live="polite" className="mr-1.5 text-[13px] text-muted">
              {pos.index + 1} / {count}
            </span>
            <button type="button" onClick={() => scroll(-1)} disabled={pos.atStart} aria-label="Previous cars" className={arrow(pos.atStart)}>
              <ChevronLeft aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
            </button>
            <button type="button" onClick={() => scroll(1)} disabled={pos.atEnd} aria-label="Next cars" className={arrow(pos.atEnd)}>
              <ChevronRight aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
            </button>
          </div>
        )}
      </div>
      <ul
        ref={trackRef}
        onScroll={measure}
        className="-mx-4 mt-[26px] flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pt-1.5 pb-5 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6"
      >
        {loading
          ? Array.from({ length: 3 }, (_, i) => (
              <li key={i} className="w-[300px] flex-none">
                <CarCardSkeleton />
              </li>
            ))
          : data?.map((related, i) => (
              <li
                key={related.id}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                className="w-[min(300px,85vw)] flex-none snap-start"
              >
                <CarCard car={related} className="h-full" />
              </li>
            ))}
      </ul>
    </section>
  );
}
