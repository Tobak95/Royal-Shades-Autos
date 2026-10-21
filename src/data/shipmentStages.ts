import type { DestinationPort, Shipment, StageKey, TrackingStage } from "@/types";

export const STAGE_ORDER: StageKey[] = [
  "purchased",
  "to_origin_port",
  "departed_origin",
  "at_sea",
  "arrived_lagos",
  "customs",
  "ready",
];

export const STAGE_LABELS: Record<StageKey, string> = {
  purchased: "Purchased",
  to_origin_port: "Delivered to origin port",
  departed_origin: "Departed origin port",
  at_sea: "At sea",
  arrived_lagos: "Arrived Lagos port",
  customs: "Customs clearance",
  ready: "Ready for pickup",
};

interface ShipmentInput {
  trackingNumber: string;
  vesselName: string;
  /** Where the car was bought, e.g. "Copart auction · Maryland, USA" */
  purchasedAt: string;
  originPort: string;
  seaRoute: string;
  destinationPort: DestinationPort;
  eta: string;
  progress: number;
  current: StageKey;
  /** Actual dates for finished stages, estimates for upcoming ones */
  dates: Partial<Record<StageKey, string>>;
}

/** Builds the 7-stage voyage from a few facts so mock shipments stay consistent */
export function buildShipment(input: ShipmentInput): Shipment {
  const locations: Record<StageKey, string> = {
    purchased: input.purchasedAt,
    to_origin_port: input.originPort,
    departed_origin: `Loaded on ${input.vesselName}`,
    at_sea: input.seaRoute,
    arrived_lagos: input.destinationPort,
    customs: "Nigeria Customs Service",
    ready: "Royal Shades yard, Lagos",
  };
  const currentIndex = STAGE_ORDER.indexOf(input.current);

  const stages: TrackingStage[] = STAGE_ORDER.map((key, index) => ({
    key,
    label: STAGE_LABELS[key],
    location: locations[key],
    date: input.dates[key],
    completed: index < currentIndex,
    current: index === currentIndex || undefined,
  }));

  return {
    trackingNumber: input.trackingNumber,
    vesselName: input.vesselName,
    originPort: input.originPort,
    destinationPort: input.destinationPort,
    eta: input.eta,
    progress: input.progress,
    stages,
  };
}
