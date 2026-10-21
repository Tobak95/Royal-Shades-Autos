import type { Shipment } from "./shipment";

export type CarStatus = "available" | "incoming" | "sold";
export type Condition = "Foreign used" | "Brand new" | "Nigerian used";
export type BodyType = "SUV" | "Sedan" | "Coupe" | "Hatchback" | "Pickup" | "Bus";
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
  shipment?: Shipment;
}

export type StatusFilter = CarStatus | "all";

export type CarSort = "newest" | "price_asc" | "price_desc" | "year_desc" | "mileage_asc";

export interface CarFilters {
  status?: StatusFilter;
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
  incoming: number;
  sold: number;
  total: number;
  ports: string[];
}
