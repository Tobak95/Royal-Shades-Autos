import { GarageDrawing, RequestsDrawing, SearchCarDrawing, WishlistDrawing } from "@/components/illustrations";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { POLICY } from "@/lib/site";

interface NoSearchResultsProps {
  /** What they looked for, e.g. "Lexus GX under ₦20M" (omit when it's only filters) */
  summary?: string;
  onClear: () => void;
  className?: string;
}

/** Showroom with nothing matching: clear the filters, or ask us to find it */
export function NoSearchResults({ summary, onClear, className }: NoSearchResultsProps) {
  const request = new URLSearchParams({
    subject: "Car request",
    message: summary ? `I'm looking for: ${summary}.` : "I'm looking for a car that isn't in the showroom: ",
  });
  return (
    <EmptyState
      className={className}
      illustration={<SearchCarDrawing />}
      title="No car matches that, yet"
      description={
        <>
          {summary ? <>Nothing fits “{summary}” right now. </> : "Nothing fits those filters right now. "}
          Tell us what you want and we'll find it for you.
        </>
      }
      action={
        <>
          <Button variant="outline" onClick={onClear}>
            Clear filters
          </Button>
          <ButtonLink to={`/contact?${request.toString()}`} variant="navy">
            Request this car
          </ButtonLink>
        </>
      }
    />
  );
}

export function EmptyGarage({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      illustration={<GarageDrawing />}
      title="Your garage is waiting"
      description="Park the cars you love here, then reserve them together with one deposit."
      action={<ButtonLink to="/cars">Explore the showroom</ButtonLink>}
    />
  );
}

export function EmptyWishlist({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      illustration={<WishlistDrawing />}
      title="No favourites yet"
      description="Tap the heart on any car to keep it here. We'll remember it on this device."
      action={<ButtonLink to="/cars">Find a car to love</ButtonLink>}
    />
  );
}

export function EmptyRequests({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      illustration={<RequestsDrawing />}
      title="No sell or swap requests yet"
      description={`Tell us about your car and get a clear offer within ${POLICY.offerWithinHours} hours. Free, and no obligation.`}
      action={
        <>
          <ButtonLink to="/sell" variant="outline">
            Sell my car
          </ButtonLink>
          <ButtonLink to="/swap" variant="navy">
            Swap my car
          </ButtonLink>
        </>
      }
    />
  );
}
