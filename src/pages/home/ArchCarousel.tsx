import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { imagePosition } from "@/data/carImages";
import { useAutoRotate } from "@/hooks/useAutoRotate";
import { cn, formatNairaShort } from "@/lib/utils";
import { carName } from "@/lib/voyage";
import type { Car } from "@/types";

const ROTATE_MS = 4500;

/**
 * Arch-framed hero carousel of AVAILABLE cars: 4.5s auto-rotate, 1.1s crossfade,
 * slow Ken Burns zoom. Pauses on hover/focus, when the tab is hidden and for reduced motion.
 */
export function ArchCarousel({ cars }: { cars: Car[] }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const { index, setIndex, next, prev, running } = useAutoRotate(cars.length, ROTATE_MS, hovered || focused);
  const car = cars[index];

  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      {/* Thin gold ring around the arch */}
      <div aria-hidden="true" className="absolute -inset-3.5 rounded-[260px_260px_34px_34px] border border-gold-light/45" />

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Available cars"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
        className="relative h-[460px] overflow-hidden rounded-[240px_240px_26px_26px] bg-navy-2 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] sm:h-[560px]"
      >
        {cars.map((slide, i) => (
          <img
            key={slide.id}
            src={slide.images[0]}
            alt={i === index ? `${carName(slide)}, ${slide.color}` : ""}
            aria-hidden={i !== index}
            loading={i === 0 ? "eager" : "lazy"}
            style={{ objectPosition: imagePosition(slide.images[0]) }}
            className={cn(
              "absolute inset-0 size-full animate-kenburns object-cover transition-opacity duration-[1100ms] ease-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-navy/0 from-45% to-navy/90" />

        {car && (
          <>
            {/* The whole photo opens the car; the visible caption is the accessible name */}
            <Link to={`/cars/${car.slug}`} className="absolute inset-0 z-[1]" aria-label={`View ${carName(car)}`} />
            <div className="pointer-events-none absolute inset-x-6 bottom-[22px] z-[2] flex flex-col gap-3.5 text-white">
              <div
                aria-live={running ? "off" : "polite"}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${cars.length}`}
                className="flex items-end justify-between gap-3"
              >
                <div>
                  <p className="text-xs tracking-[0.12em] text-on-navy-soft uppercase">
                    In our garage · {index + 1} of {cars.length}
                  </p>
                  <p className="mt-[3px] text-[22px] font-extrabold">{car.make} {car.model}</p>
                  <p className="mt-0.5 text-sm font-bold text-gold-light">{formatNairaShort(car.price)}</p>
                </div>
                <span className="rounded-full bg-available px-3 py-1.5 text-xs font-bold">Available</span>
              </div>

              <div className="pointer-events-auto flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  {cars.map((slide, i) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Show ${carName(slide)}`}
                      aria-current={i === index ? "true" : undefined}
                      className="flex size-7 items-center justify-center"
                    >
                      <span
                        className={cn(
                          "block h-2 rounded-full transition-[width,background-color] duration-300",
                          i === index ? "w-[26px] bg-gold-light" : "w-2 bg-white/55",
                        )}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous car"
                    className="flex size-11 items-center justify-center rounded-full border border-white/35 bg-navy/40 hover:border-gold-light"
                  >
                    <ChevronLeft aria-hidden="true" className="size-4" strokeWidth={2.2} />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next car"
                    className="flex size-11 items-center justify-center rounded-full bg-gold text-navy hover:bg-gold-light"
                  >
                    <ChevronRight aria-hidden="true" className="size-4" strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
