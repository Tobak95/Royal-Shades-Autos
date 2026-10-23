import { useState } from "react";
import { Expand } from "lucide-react";
import { CarImage } from "@/components/car/CarImage";
import { cn } from "@/lib/utils";
import type { Car } from "@/types";
import { Lightbox } from "./Lightbox";

interface GalleryProps {
  car: Car;
  name: string;
}

export function Gallery({ car, name }: GalleryProps) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const sold = car.status === "sold";

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        aria-label={`Open photo ${active + 1} of ${car.images.length} full screen`}
        className="group relative block w-full overflow-hidden rounded-panel border border-line"
      >
        <CarImage
          key={car.images[active]}
          src={car.images[active]}
          alt=""
          muted={sold}
          eager
          className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full bg-navy/70 px-3.5 py-2 text-xs font-semibold backdrop-blur-sm">
          <Expand aria-hidden="true" className="size-3.5" /> View photos
        </span>
        {sold && (
          <span className="absolute top-5 -left-10 -rotate-[35deg] bg-sold px-14 py-2 text-xs font-extrabold tracking-[0.2em] text-white">
            SOLD
          </span>
        )}
      </button>

      {car.images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3" aria-label="Photos">
          {car.images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-current={index === active ? "true" : undefined}
                className={cn(
                  "block w-full overflow-hidden rounded-control border-2 transition-colors",
                  index === active ? "border-gold" : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <CarImage src={src} alt="" muted={sold} className="aspect-[4/3] w-full" />
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
