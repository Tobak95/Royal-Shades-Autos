import { useState } from "react";
import { CarFront } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarImageProps {
  src: string | undefined;
  alt: string;
  /** Sold cars are shown muted */
  muted?: boolean;
  eager?: boolean;
  className?: string;
}

/** Car photo on the radial graphite stage, with a fallback if the image fails */
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
          className={cn(
            "size-full object-cover transition-opacity duration-500",
            loaded ? (muted ? "opacity-45 grayscale-[35%]" : "opacity-100") : "opacity-0",
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
