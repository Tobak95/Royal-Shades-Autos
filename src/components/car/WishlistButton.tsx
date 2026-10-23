import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import type { Car } from "@/types";

interface WishlistButtonProps {
  car: Car;
  /** "overlay" sits on top of photos; "outline" matches outline buttons */
  appearance?: "overlay" | "outline";
  className?: string;
}

export function WishlistButton({ car, appearance = "overlay", className }: WishlistButtonProps) {
  const wishlist = useWishlist();
  const saved = wishlist.has(car.id);
  const name = `${car.year} ${car.make} ${car.model}`;

  return (
    <button
      type="button"
      onClick={() => wishlist.toggle(car.id)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className={cn(
        "flex size-11 flex-none items-center justify-center rounded-full transition-colors",
        appearance === "overlay"
          ? "bg-white/92 text-ink shadow-sm hover:text-gold-text"
          : "rounded-control border-[1.5px] border-line-strong text-ink hover:border-navy hover:bg-surface",
        saved && "text-gold-text",
        className,
      )}
    >
      <Heart aria-hidden="true" className={cn("size-[17px]", saved && "fill-gold")} strokeWidth={1.8} />
    </button>
  );
}
