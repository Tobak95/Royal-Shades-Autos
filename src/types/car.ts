import type { Shipment } from "./shipment";

/**
 * Set from the admin dashboard. A car usually moves through them in this order:
 * arriving (on the water) → arrived (at port / yard) → inspection (shown as "Coming soon")
 * → available → sold
 */
export type CarStatus = "arriving" | "arrived" | "inspection" | "available" | "sold";
export type Condition = "Foreign used" | "Brand new" | "Nigerian used";
export type BodyType = "SUV" | "Sedan" | "Minivan" | "Coupe" | "Hatchback" | "Pickup" | "Bus";
export type Origin = "USA" | "Canada" | "UAE" | "Germany" | "Nigeria";
export type Transmission = "Automatic" | "Manual";
export type FuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric";

export interface Car {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  /** Naira */
  price: number;
  mileage: number;
  mileageUnit: "mi" | "km";
  transmission: Transmission;
  fuelType: FuelType;
  engine: string;
  color: string;
  bodyType: BodyType;
  seats: number;
  vin: string;
  condition: Condition;
  origin: Origin;
  status: CarStatus;
  images: string[];
  description: string;
  features: string[];
  /** ISO timestamp */
  createdAt: string;
  /** ISO timestamp of the last admin change (falls back to createdAt) */
  updatedAt?: string;
  /** ISO date (yyyy-mm-dd), set when the status changes to "sold" */
  soldAt?: string;
  /** Show in the home hero carousel (only applies while the car is "available") */
  featured?: boolean;
  shipment?: Shipment;
}

/** Everything an admin can set on a car; the server fills in id, slug and timestamps */
export type CarInput = Omit<Car, "id" | "slug" | "createdAt" | "updatedAt">;

/**
 * Showroom tabs. "arriving" covers both arriving and arrived cars;
 * "inspection" is labelled "Coming soon" for customers.
 */
export type StatusFilter = "all" | "available" | "arriving" | "inspection" | "sold";

export type CarSort = "newest" | "price_asc" | "price_desc" | "year_desc" | "mileage_asc";

export interface CarFilters {
  /** Showroom tab (counts are reported for every tab) */
  status?: StatusFilter;
  /** Hard limit to these statuses, applied before counting (e.g. hero shows only "available") */
  statuses?: CarStatus[];
  search?: string;
  bodyTypes?: BodyType[];
  conditions?: Condition[];
  makes?: string[];
  origins?: Origin[];
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  sort?: CarSort;
  page?: number;
  pageSize?: number;
}

export type StatusCounts = Record<StatusFilter, number>;

export interface CarListResult {
  cars: Car[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  /** Counts per status for the current non-status filters (drives tab badges) */
  counts: StatusCounts;
}

export interface InventoryStats {
  available: number;
  /** Arriving + arrived */
  arriving: number;
  inspection: number;
  sold: number;
  total: number;
  ports: string[];
}
