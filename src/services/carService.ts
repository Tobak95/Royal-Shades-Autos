// The only place pages get car data from. Each function mirrors a future API
// endpoint; swap the bodies for `api.get(...)` calls when the backend is ready.
import { mockCars } from "@/data/mockCars";
import { matchesStatusFilter } from "@/lib/status";
import { wait } from "@/lib/utils";
import type {
  Car,
  CarFilters,
  CarListResult,
  CarSort,
  InventoryStats,
  NewReservation,
  Origin,
  Reservation,
  Shipment,
  StatusCounts,
  StatusFilter,
} from "@/types";

const LATENCY_MS = 400;
export const DEFAULT_PAGE_SIZE = 9;

// In-memory store so admin edits (Phase 5) persist for the session.
const cars: Car[] = structuredClone(mockCars);
const reservations: Reservation[] = [];

const clone = <T>(value: T): T => structuredClone(value);

function matchesSearch(car: Car, query: string): boolean {
  const haystack = [car.make, car.model, car.trim, car.vin, String(car.year), car.shipment?.trackingNumber ?? ""]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

/** Applies every filter except status, so tab counts reflect the other filters */
function applyFilters(list: Car[], f: CarFilters): Car[] {
  return list.filter((car) => {
    if (f.statuses?.length && !f.statuses.includes(car.status)) return false;
    if (f.search && !matchesSearch(car, f.search)) return false;
    if (f.bodyTypes?.length && !f.bodyTypes.includes(car.bodyType)) return false;
    if (f.conditions?.length && !f.conditions.includes(car.condition)) return false;
    if (f.makes?.length && !f.makes.includes(car.make)) return false;
    if (f.origins?.length && !f.origins.includes(car.origin)) return false;
    if (f.minPrice !== undefined && car.price < f.minPrice) return false;
    if (f.maxPrice !== undefined && car.price > f.maxPrice) return false;
    if (f.minYear !== undefined && car.year < f.minYear) return false;
    if (f.maxYear !== undefined && car.year > f.maxYear) return false;
    return true;
  });
}

const toMiles = (car: Car) => (car.mileageUnit === "km" ? car.mileage * 0.621371 : car.mileage);

const SORTERS: Record<CarSort, (a: Car, b: Car) => number> = {
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  year_desc: (a, b) => b.year - a.year,
  mileage_asc: (a, b) => toMiles(a) - toMiles(b),
};

export async function getCars(filters: CarFilters = {}): Promise<CarListResult> {
  await wait(LATENCY_MS);
  const { status = "all", sort = "newest", page = 1, pageSize = DEFAULT_PAGE_SIZE } = filters;

  const filtered = applyFilters(cars, filters);
  const countFor = (filter: StatusFilter) => filtered.filter((c) => matchesStatusFilter(c.status, filter)).length;
  const counts: StatusCounts = {
    all: filtered.length,
    available: countFor("available"),
    arriving: countFor("arriving"),
    inspection: countFor("inspection"),
    sold: countFor("sold"),
  };

  const byStatus = filtered.filter((c) => matchesStatusFilter(c.status, status));
  const sorted = [...byStatus].sort(SORTERS[sort]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    cars: clone(sorted.slice(start, start + pageSize)),
    total: sorted.length,
    page: safePage,
    pageSize,
    totalPages,
    counts,
  };
}

export interface FilterOptions {
  makes: string[];
  origins: Origin[];
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
}

/** Choices for the showroom filter sidebar, derived from the inventory */
export async function getFilterOptions(): Promise<FilterOptions> {
  await wait(LATENCY_MS);
  const prices = cars.map((c) => c.price);
  const years = cars.map((c) => c.year);
  const million = 1_000_000;
  return {
    makes: [...new Set(cars.map((c) => c.make))].sort(),
    origins: [...new Set(cars.map((c) => c.origin))].sort(),
    minPrice: Math.floor(Math.min(...prices) / (5 * million)) * 5 * million,
    maxPrice: Math.ceil(Math.max(...prices) / (5 * million)) * 5 * million,
    minYear: Math.min(...years),
    maxYear: Math.max(...years),
  };
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  await wait(LATENCY_MS);
  const car = cars.find((c) => c.slug === slug);
  return car ? clone(car) : null;
}

export async function getCarsByIds(ids: string[]): Promise<Car[]> {
  await wait(LATENCY_MS);
  return clone(ids.map((id) => cars.find((c) => c.id === id)).filter((c): c is Car => c !== undefined));
}

/** Cars still in play (never sold ones): same body type first, then same make, then ready-to-buy */
export async function getRelatedCars(car: Car, limit = 6): Promise<Car[]> {
  await wait(LATENCY_MS);
  const score = (c: Car) =>
    (c.bodyType === car.bodyType ? 4 : 0) + (c.make === car.make ? 2 : 0) + (c.status === "available" ? 1 : 0);
  return clone(
    cars
      .filter((c) => c.id !== car.id && c.status !== "sold")
      .sort((a, b) => score(b) - score(a))
      .slice(0, limit),
  );
}

export interface TrackingResult {
  car: Car;
  shipment: Shipment;
}

export async function trackShipment(vinOrTrackingNumber: string): Promise<TrackingResult | null> {
  await wait(LATENCY_MS);
  const query = vinOrTrackingNumber.trim().toUpperCase();
  if (!query) return null;
  const car = cars.find(
    (c) => c.shipment && (c.vin.toUpperCase() === query || c.shipment.trackingNumber.toUpperCase() === query),
  );
  return car?.shipment ? clone({ car, shipment: car.shipment }) : null;
}

export async function getStats(): Promise<InventoryStats> {
  await wait(LATENCY_MS);
  return {
    available: cars.filter((c) => matchesStatusFilter(c.status, "available")).length,
    arriving: cars.filter((c) => matchesStatusFilter(c.status, "arriving")).length,
    inspection: cars.filter((c) => matchesStatusFilter(c.status, "inspection")).length,
    sold: cars.filter((c) => matchesStatusFilter(c.status, "sold")).length,
    total: cars.length,
    ports: ["Tin Can", "Apapa"],
  };
}

export async function createReservation(input: NewReservation): Promise<Reservation> {
  await wait(LATENCY_MS);
  const reservation: Reservation = {
    ...input,
    id: `RSV-${Date.now().toString(36).toUpperCase()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  reservations.unshift(reservation);
  return clone(reservation);
}
