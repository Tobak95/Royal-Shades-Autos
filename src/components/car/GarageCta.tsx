import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import type { ButtonSize, ButtonVariant } from "@/components/ui/variants";
import { useGarage } from "@/hooks/useGarage";
import { STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { Car } from "@/types";

interface GarageCtaProps {
  car: Car;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

/**
 * The one action for a car, by status:
 * available → Add to Garage, incoming → Reserve (adds it and opens the Garage),
 * sold → Similar cars, already saved → In Garage ✓
 */
export function GarageCta({ car, variant = "outline", size = "sm", fullWidth, className }: GarageCtaProps) {
  const garage = useGarage();
  const navigate = useNavigate();
  const styles = { variant, size, fullWidth, className };

  if (car.status === "sold") {
    return (
      <ButtonLink to={`/cars?body=${encodeURIComponent(car.bodyType)}`} {...styles} variant="outline">
        {STATUS_META.sold.cta}
      </ButtonLink>
    );
  }

  if (garage.has(car.id)) {
    return (
      <ButtonLink to="/garage" {...styles} variant="outline" className={cn(className, "border-gold/40 text-gold-text")}>
        In Garage <Check aria-hidden="true" className="size-4" strokeWidth={2.4} />
      </ButtonLink>
    );
  }

  function handleClick() {
    garage.add(car.id);
    if (car.status === "incoming") navigate("/garage");
  }

  return (
    <Button onClick={handleClick} {...styles}>
      {STATUS_META[car.status].cta}
    </Button>
  );
}
