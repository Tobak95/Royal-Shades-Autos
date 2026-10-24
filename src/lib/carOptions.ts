import type { BodyType, CarSort, Condition, Origin, StatusFilter } from "@/types";

export const BODY_TYPES: BodyType[] = ["SUV", "Sedan", "Minivan", "Coupe", "Hatchback", "Pickup", "Bus"];
export const ORIGINS: Origin[] = ["USA", "Canada", "UAE", "Germany", "Nigeria"];
export const CONDITIONS: Condition[] = ["Foreign used", "Brand new", "Nigerian used"];
export const STATUS_FILTERS: StatusFilter[] = ["all", "available", "arriving", "inspection", "sold"];

export const SORT_OPTIONS: { value: CarSort; label: string }[] = [
  { value: "newest", label: "Newest arrivals" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "year_desc", label: "Year: newest first" },
  { value: "mileage_asc", label: "Mileage: lowest first" },
];
