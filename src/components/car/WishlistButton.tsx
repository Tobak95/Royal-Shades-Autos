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
          ? "bg-obsidian/55 text-white backdrop-blur-sm hover:text-gold"
          : "border border-line-strong text-white hover:border-gold hover:text-gold",
        saved && "text-gold",
        className,
      )}
    >
      <Heart aria-hidden="true" className={cn("size-[17px]", saved && "fill-gold")} strokeWidth={1.8} />
    </button>
  );
}
