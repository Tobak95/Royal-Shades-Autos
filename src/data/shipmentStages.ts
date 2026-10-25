import type { DestinationPort, Shipment, StageKey, TrackingStage } from "@/types";

// Note: a current stage keeps its date as "when it started"; the tracker shows "Now" for it.

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

export interface ShipmentInput {
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

/** Rough voyage progress shown on the tracker for each current stage */
export const STAGE_PROGRESS: Record<StageKey, number> = {
  purchased: 8,
  to_origin_port: 15,
  departed_origin: 30,
  at_sea: 55,
  arrived_lagos: 80,
  customs: 90,
  ready: 100,
};

export interface ShipmentUpdate {
  current: StageKey;
  vesselName: string;
  /** yyyy-mm-dd */
  eta: string;
}

/**
 * Moves a shipment to a new current stage. Earlier stages become completed (dated today
 * if they had no date yet); later stages are cleared, except the ETA on "Arrived Lagos port".
 */
export function updateShipmentStage(shipment: Shipment, update: ShipmentUpdate, today: string): Shipment {
  const currentIndex = STAGE_ORDER.indexOf(update.current);
  const stages = shipment.stages.map((stage): TrackingStage => {
    const index = STAGE_ORDER.indexOf(stage.key);
    const location = stage.key === "departed_origin" ? `Loaded on ${update.vesselName}` : stage.location;
    // Stages reached for the first time get today's date (an old date there was only an estimate)
    const reachedBefore = stage.completed || stage.current;
    const date = reachedBefore ? (stage.date ?? today) : today;
    if (index < currentIndex) return { ...stage, location, completed: true, current: undefined, date };
    if (index === currentIndex) return { ...stage, location, completed: false, current: true, date };
    return {
      ...stage,
      location,
      completed: false,
      current: undefined,
      date: stage.key === "arrived_lagos" ? update.eta : undefined,
    };
  });
  return {
    ...shipment,
    vesselName: update.vesselName,
    eta: update.eta,
    progress: STAGE_PROGRESS[update.current],
    stages,
  };
}
