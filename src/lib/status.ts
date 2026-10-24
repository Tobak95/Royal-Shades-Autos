// Everything a component needs to know about a car's status lives here.
import type { BadgeVariant } from "@/components/ui/Badge";
import type { Car, CarStatus, StatusFilter } from "@/types";

interface StatusMeta {
  /** Customer-facing badge text */
  label: string;
  /** Short name for the "This car's journey" bar */
  journeyLabel: string;
  cta: string;
  badge: BadgeVariant;
  /** Bar colour for the current step of the journey */
  barClass: string;
  /** Text colour for the current step of the journey */
  textClass: string;
}

export const STATUS_META: Record<CarStatus, StatusMeta> = {
  arriving: {
    label: "Arriving",
    journeyLabel: "Arriving",
    cta: "Reserve",
    badge: "arriving",
    barClass: "bg-arriving",
    textClass: "text-arriving-text",
  },
  arrived: {
    label: "Arrived · At port",
    journeyLabel: "Arrived",
    cta: "Reserve",
    badge: "arriving",
    barClass: "bg-arriving",
    textClass: "text-arriving-text",
  },
  inspection: {
    label: "Coming soon",
    journeyLabel: "Inspection",
    cta: "Notify me",
    badge: "inspection",
    barClass: "bg-inspection",
    textClass: "text-inspection-text",
  },
  available: {
    label: "Available",
    journeyLabel: "Available",
    cta: "Add to Garage",
    badge: "available",
    barClass: "bg-available",
    textClass: "text-available-text",
  },
  sold: {
    label: "Sold",
    journeyLabel: "Sold",
    cta: "Find similar",
    badge: "sold",
    barClass: "bg-sold",
    textClass: "text-sold",
  },
};

/** The order a car normally moves through (drives the journey bar) */
export const STATUS_JOURNEY: CarStatus[] = ["arriving", "arrived", "inspection", "available", "sold"];

/** Only these can go in the Garage and be reserved */
export const RESERVABLE_STATUSES: readonly CarStatus[] = ["available", "arriving", "arrived"];

export function isReservable(car: Pick<Car, "status">): boolean {
  return RESERVABLE_STATUSES.includes(car.status);
}

/** Cars still on the water: they show tracking and an ETA bar */
export function isOnTheWay(car: Pick<Car, "status">): boolean {
  return car.status === "arriving";
}

/** Showroom tabs, in display order */
export const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "arriving", label: "Arriving" },
  { value: "inspection", label: "Coming soon" },
  { value: "sold", label: "Sold" },
];

export function matchesStatusFilter(status: CarStatus, filter: StatusFilter): boolean {
  if (filter === "all") return true;
  if (filter === "arriving") return status === "arriving" || status === "arrived";
  return status === filter;
}
