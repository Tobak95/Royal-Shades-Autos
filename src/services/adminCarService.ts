// Admin car management. Every function mirrors a future admin API endpoint (see README).
// In mock mode they change the shared store and persist it in this browser.
import { buildShipment, STAGE_PROGRESS, updateShipmentStage } from "@/data/shipmentStages";
import { carSlugBase, uniqueSlug } from "@/lib/slug";
import { STATUS_META } from "@/lib/status";
import { wait } from "@/lib/utils";
import { localISODate } from "@/lib/validators";
import type { Car, CarInput, CarStatus, DestinationPort, StageKey } from "@/types";
import { commit, logActivity, store } from "./mockStore";

const LATENCY_MS = 300;
const clone = <T>(value: T): T => structuredClone(value);
const label = (car: Pick<Car, "year" | "make" | "model">) => `${car.year} ${car.make} ${car.model}`;

/** What an admin enters when a car starts its voyage (moving to "arriving") */
export interface ShipmentDetails {
  trackingNumber: string;
  vesselName: string;
  originPort: string;
  destinationPort: DestinationPort;
  /** yyyy-mm-dd */
  eta: string;
  current: StageKey;
}

export class AdminError extends Error {}

function findCar(id: string): Car {
  const car = store.cars.find((c) => c.id === id);
  if (!car) throw new AdminError("That car no longer exists. Refresh the list.");
  return car;
}

/** A tracking number not used by any other car, e.g. RS-48213 */
export function suggestTrackingNumber(): string {
  const taken = new Set(store.cars.map((c) => c.shipment?.trackingNumber));
  const random = () => `RS-${Math.floor(10000 + Math.random() * 90000)}`;
  let number = random();
  while (taken.has(number)) number = random();
  return number;
}

/** Creates a new shipment, or updates the existing one, from the admin's details */
function applyShipment(car: Pick<Car, "origin" | "shipment">, details: ShipmentDetails): Car["shipment"] {
  const today = localISODate();
  const base =
    car.shipment ??
    buildShipment({
      trackingNumber: details.trackingNumber,
      vesselName: details.vesselName,
      purchasedAt: `Purchase · ${car.origin}`,
      originPort: details.originPort,
      seaRoute: "Atlantic Ocean",
      destinationPort: details.destinationPort,
      eta: details.eta,
      progress: STAGE_PROGRESS.purchased,
      current: "purchased",
      dates: {},
    });
  const withPorts = {
    ...base,
    trackingNumber: details.trackingNumber,
    originPort: details.originPort,
    destinationPort: details.destinationPort,
    stages: base.stages.map((s) =>
      s.key === "to_origin_port" ? { ...s, location: details.originPort } : s.key === "arrived_lagos" ? { ...s, location: details.destinationPort } : s,
    ),
  };
  return updateShipmentStage(withPorts, { current: details.current, vesselName: details.vesselName, eta: details.eta }, today);
}

function sortKey(car: Car): string {
  return car.updatedAt ?? car.createdAt;
}

export interface AdminCarPage {
  cars: Car[];
  total: number;
  /** 1-based, clamped to the last page */
  page: number;
  totalPages: number;
}

export async function adminListCars(
  filters: { search?: string; status?: CarStatus | "all"; page?: number; pageSize?: number } = {},
): Promise<AdminCarPage> {
  await wait(LATENCY_MS);
  const q = filters.search?.trim().toLowerCase() ?? "";
  const pageSize = filters.pageSize ?? 8;
  const matches = store.cars
    .filter((c) => !filters.status || filters.status === "all" || c.status === filters.status)
    .filter((c) => !q || [c.make, c.model, c.trim, c.vin, String(c.year), c.shipment?.trackingNumber ?? ""].join(" ").toLowerCase().includes(q))
    .sort((a, b) => sortKey(b).localeCompare(sortKey(a)));
  const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
  const page = Math.min(Math.max(1, Math.floor(filters.page ?? 1)), totalPages);
  return { cars: clone(matches.slice((page - 1) * pageSize, page * pageSize)), total: matches.length, page, totalPages };
}

export async function adminGetCar(id: string): Promise<Car | null> {
  await wait(LATENCY_MS);
  const car = store.cars.find((c) => c.id === id);
  return car ? clone(car) : null;
}

/** Checks the rules that apply however a car's status is set */
function normalise(input: CarInput, previous?: Car): CarInput {
  if (input.status === "arriving" && !input.shipment) {
    throw new AdminError("An arriving car needs shipment details (tracking number, vessel, ETA).");
  }
  return {
    ...input,
    soldAt: input.status === "sold" ? (previous?.status === "sold" ? previous.soldAt : undefined) ?? localISODate() : undefined,
    featured: input.status === "available" ? input.featured : false,
  };
}

export async function createCar(input: CarInput): Promise<Car> {
  await wait(LATENCY_MS);
  const base = carSlugBase(input);
  const now = new Date().toISOString();
  const car: Car = {
    ...normalise(input),
    id: `car-${base}-${crypto.randomUUID().slice(0, 6)}`,
    slug: uniqueSlug(base, (s) => store.cars.some((c) => c.slug === s)),
    createdAt: now,
    updatedAt: now,
  };
  store.cars.unshift(car);
  logActivity(`Added ${label(car)} (${STATUS_META[car.status].label})`, car.id);
  commit();
  return clone(car);
}

export async function updateCar(id: string, input: CarInput): Promise<Car> {
  await wait(LATENCY_MS);
  const previous = findCar(id);
  // Keep the existing slug (and its links) unless make, model or year changed
  const sameName = previous.make === input.make && previous.model === input.model && previous.year === input.year;
  const slug = sameName
    ? previous.slug
    : uniqueSlug(carSlugBase(input), (s) => store.cars.some((c) => c.slug === s && c.id !== id));
  const car: Car = { ...normalise(input, previous), id, slug, createdAt: previous.createdAt, updatedAt: new Date().toISOString() };
  store.cars = store.cars.map((c) => (c.id === id ? car : c));
  logActivity(`Edited ${label(car)}`, id);
  commit();
  return clone(car);
}

export async function deleteCar(id: string): Promise<void> {
  await wait(LATENCY_MS);
  const car = findCar(id);
  store.cars = store.cars.filter((c) => c.id !== id);
  logActivity(`Deleted ${label(car)}`);
  commit();
}

/**
 * Quick status change. Moving to "arriving" needs shipment details (unless the car
 * already has a shipment); moving to "sold" stamps soldAt with today's date.
 */
export async function changeCarStatus(id: string, status: CarStatus, shipment?: ShipmentDetails): Promise<Car> {
  await wait(LATENCY_MS);
  const previous = findCar(id);
  const nextShipment = shipment ? applyShipment(previous, shipment) : previous.shipment;
  const input: CarInput = { ...previous, status, shipment: nextShipment };
  const car: Car = { ...normalise(input, previous), id, slug: previous.slug, createdAt: previous.createdAt, updatedAt: new Date().toISOString() };
  store.cars = store.cars.map((c) => (c.id === id ? car : c));
  logActivity(`${label(car)}: ${STATUS_META[previous.status].journeyLabel} → ${STATUS_META[status].journeyLabel}`, id);
  commit();
  return clone(car);
}

export async function setCarFeatured(id: string, featured: boolean): Promise<Car> {
  await wait(LATENCY_MS);
  const previous = findCar(id);
  if (featured && previous.status !== "available") throw new AdminError("Only available cars can be shown in the home hero.");
  const car: Car = { ...previous, featured, updatedAt: new Date().toISOString() };
  store.cars = store.cars.map((c) => (c.id === id ? car : c));
  logActivity(`${label(car)} ${featured ? "added to" : "removed from"} the home hero`, id);
  commit();
  return clone(car);
}

/** Exposed for the car form: builds or updates a shipment without saving */
export function shipmentFromDetails(car: Pick<Car, "origin" | "shipment">, details: ShipmentDetails): Car["shipment"] {
  return applyShipment(car, details);
}
