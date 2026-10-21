import { formatDate, formatDayMonth } from "./utils";
import type { Car, Shipment, TrackingStage } from "@/types";

export function getCurrentStage(shipment: Shipment): TrackingStage | undefined {
  return shipment.stages.find((s) => s.current) ?? shipment.stages.findLast((s) => s.completed);
}

/** 2T2HZMDA4NC134817 → 2T2HZMDA4NC•••817 */
export function maskVin(vin: string): string {
  return vin.length > 14 ? `${vin.slice(0, 11)}•••${vin.slice(-3)}` : vin;
}

export function stageDateLabel(stage: TrackingStage): string {
  if (stage.current) return "Now";
  if (!stage.date) return "—";
  return stage.completed ? formatDayMonth(stage.date) : `Est. ${formatDayMonth(stage.date)}`;
}

/** "Baltimore, USA" style label for the start of the route */
export function originLabel(shipment: Shipment, car: Car): string {
  return `${shipment.originPort.replace(/^Port of /, "")}, ${car.origin}`;
}

export function carName(car: Car): string {
  return `${car.year} ${car.make} ${car.model}`;
}

/** One-line status used in the garage and summaries */
export function carNote(car: Car): string {
  if (car.status === "sold") return "This car has been sold. Remove it to continue.";
  if (car.status === "available") return "In our Lagos yard. Inspect any day this week.";
  if (!car.shipment) return "On its way to Lagos.";
  const stage = getCurrentStage(car.shipment);
  return `${stage?.label ?? "In transit"} · ${car.shipment.vesselName}. ETA ${formatDate(car.shipment.eta)}.`;
}
