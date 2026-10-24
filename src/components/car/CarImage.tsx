import { useState } from "react";
import { CarFront } from "lucide-react";
import { imagePosition } from "@/data/carImages";
import { cn } from "@/lib/utils";

interface CarImageProps {
  src: string | undefined;
  alt: string;
  /** Sold cars are shown muted */
  muted?: boolean;
  eager?: boolean;
  className?: string;
}

/** Car photo on a light grey backdrop, cropped to keep the car in frame, with a fallback if it fails */
export function CarImage({ src, alt, muted = false, eager = false, className }: CarImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("car-stage relative overflow-hidden", className)}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{ objectPosition: imagePosition(src) }}
          className={cn(
            "block size-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
            // Sold cars: greyed photo, as in the v2 "Recently sold" cards
            muted && "brightness-[.92] grayscale-[.55]",
          )}
        />
      ) : (
        <div role="img" aria-label={alt} className="flex size-full items-center justify-center text-line-strong">
          <CarFront aria-hidden="true" className="size-12" strokeWidth={1.2} />
        </div>
      )}
    </div>
  );
}
