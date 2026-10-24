import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import type { ButtonSize, ButtonVariant } from "@/components/ui/variants";
import { useGarage } from "@/hooks/useGarage";
import { useToast } from "@/hooks/useToast";
import { STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";
import { carName } from "@/lib/voyage";
import type { Car } from "@/types";

interface GarageCtaProps {
  car: Car;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Home-card style: Reserve on a blue tint, Notify me on a gold tint */
  tinted?: boolean;
  className?: string;
}

const TINTS = {
  reserve: "border-0 bg-arriving-tint text-arriving-text hover:bg-arriving/15",
  notify: "border-0 bg-gold-tint text-[#6B4E12] hover:bg-gold/25 hover:border-0",
};

/**
 * The one action for a car, by status:
 * available → Add to Garage · arriving / arrived → Reserve (adds it and opens the Garage)
 * inspection → Notify me (can't be added yet) · sold → Find similar · already saved → In Garage ✓
 */
export function GarageCta({ car, variant = "navy", size = "sm", fullWidth, tinted = false, className }: GarageCtaProps) {
  const garage = useGarage();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const styles = { size, fullWidth, className };

  if (car.status === "sold") {
    return (
      <ButtonLink to={`/cars?body=${encodeURIComponent(car.bodyType)}`} {...styles} variant="outline">
        {STATUS_META.sold.cta}
      </ButtonLink>
    );
  }

  if (car.status === "inspection") {
    // No notification endpoint yet, so this only confirms on screen
    return (
      <Button
        {...styles}
        variant="outline"
        className={cn(className, tinted && TINTS.notify)}
        onClick={() => showToast(`We'll let you know when the ${carName(car)} is ready to view.`, { tone: "info" })}
      >
        {STATUS_META.inspection.cta}
      </Button>
    );
  }

  if (garage.has(car.id)) {
    return (
      <ButtonLink
        to="/garage"
        {...styles}
        variant="outline"
        className={cn(className, "border-gold bg-gold-tint text-[#6B4E12] hover:border-gold hover:bg-gold-tint")}
      >
        In Garage <Check aria-hidden="true" className="size-4" strokeWidth={2.4} />
      </ButtonLink>
    );
  }

  const reserve = car.status === "arriving" || car.status === "arrived";

  function handleClick() {
    garage.add(car.id);
    if (reserve) navigate("/garage");
  }

  return (
    <Button
      onClick={handleClick}
      {...styles}
      variant={variant}
      className={cn(className, tinted && reserve && TINTS.reserve)}
    >
      {STATUS_META[car.status].cta}
    </Button>
  );
}
