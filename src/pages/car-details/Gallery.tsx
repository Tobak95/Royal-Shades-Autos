import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { imagePosition } from "@/data/carImages";
import { cn } from "@/lib/utils";
import type { Car } from "@/types";
import { Lightbox } from "./Lightbox";

interface GalleryProps {
  car: Car;
  name: string;
}

const roundButton = "flex size-11 items-center justify-center rounded-full transition-colors";

/** Main photo with crossfade, prev/next, "1 / 3" counter, thumbnails and a full-screen lightbox */
export function Gallery({ car, name }: GalleryProps) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const count = car.images.length;
  const sold = car.status === "sold";
  const go = (delta: number) => setActive((i) => (i + delta + count) % count);

  return (
    <div>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`${name} photos`}
        className="relative h-[320px] overflow-hidden rounded-[22px] bg-[#E9ECF1] shadow-[0_30px_60px_-40px_rgb(11_27_46/0.6)] sm:h-[420px] lg:h-[500px]"
      >
        {/* All photos stacked; the active one fades in over 0.6s */}
        {car.images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === active ? `${name}, photo ${i + 1} of ${count}` : ""}
            aria-hidden={i !== active}
            loading={i === 0 ? "eager" : "lazy"}
            style={{ objectPosition: imagePosition(src) }}
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-600 ease-out",
              i === active ? "opacity-100" : "opacity-0",
              sold && "brightness-[.92] grayscale-[.55]",
            )}
          />
        ))}

        {/* Opens the lightbox; sits under the controls */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Open photos full screen"
          className="absolute inset-0 z-[1] cursor-zoom-in"
        />

        <div className="absolute top-4 left-4 z-[2]">
          <StatusBadge status={car.status} overlay />
        </div>
        {sold && (
          <span
            aria-hidden="true"
            className="absolute top-6 -left-10 z-[2] -rotate-[35deg] bg-sold px-14 py-2 text-xs font-extrabold tracking-[0.22em] text-white"
          >
            SOLD
          </span>
        )}

        <div className="absolute right-4 bottom-4 z-[2] flex gap-2">
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous photo"
                className={cn(roundButton, "bg-white/92 text-ink hover:bg-white")}
              >
                <ChevronLeft aria-hidden="true" className="size-4" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next photo"
                className={cn(roundButton, "bg-navy text-white hover:bg-navy-3")}
              >
                <ChevronRight aria-hidden="true" className="size-4" strokeWidth={2.2} />
              </button>
            </>
          )}
          <span
            aria-live="polite"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-navy/75 px-3.5 text-[13px] font-semibold text-white"
          >
            <Expand aria-hidden="true" className="size-3.5" />
            {active + 1} / {count}
          </span>
        </div>
      </div>

      {count > 1 && (
        <ul className="mt-3.5 flex flex-wrap gap-3" aria-label="Photos">
          {car.images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Photo ${index + 1}`}
                aria-current={index === active ? "true" : undefined}
                className={cn(
                  "block h-[84px] w-[120px] overflow-hidden rounded-xl border-[2.5px] bg-[#E9ECF1] transition-[opacity,transform] duration-200 hover:-translate-y-0.5",
                  index === active ? "border-gold opacity-100" : "border-transparent opacity-70",
                )}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  style={{ objectPosition: imagePosition(src) }}
                  className="block size-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Lightbox
        open={lightboxOpen}
        images={car.images}
        index={active}
        alt={name}
        onIndexChange={setActive}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
