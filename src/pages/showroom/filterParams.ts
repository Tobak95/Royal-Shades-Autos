// Showroom filters live in the URL (?status=arriving&body=SUV,Sedan&page=2) so
// every view can be shared and survives a refresh.
import { BODY_TYPES, CONDITIONS, ORIGINS, SORT_OPTIONS, STATUS_FILTERS } from "@/lib/carOptions";
import type { BodyType, CarSort, Condition, Origin, StatusFilter } from "@/types";

export interface ShowroomFilters {
  status: StatusFilter;
  q: string;
  body: BodyType[];
  condition: Condition[];
  make: string[];
  origin: Origin[];
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  sort: CarSort;
  page: number;
}

export type FilterPatch = Partial<{ [K in keyof ShowroomFilters]: ShowroomFilters[K] | undefined }>;

function oneOf<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function listOf<T extends string>(value: string | null, allowed?: readonly T[]): T[] {
  if (!value) return [];
  const items = value.split(",").map((v) => v.trim()).filter(Boolean) as T[];
  return allowed ? items.filter((v) => allowed.includes(v)) : items;
}

function numberOf(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/** Old links used ?status=incoming; send them to the Arriving tab */
const LEGACY_STATUS: Record<string, string> = { incoming: "arriving", arrived: "arriving", "coming-soon": "inspection" };

export function parseFilters(params: URLSearchParams): ShowroomFilters {
  const rawStatus = params.get("status");
  return {
    status: oneOf(rawStatus && (LEGACY_STATUS[rawStatus] ?? rawStatus), STATUS_FILTERS, "all"),
    q: params.get("q") ?? "",
    body: listOf(params.get("body"), BODY_TYPES),
    condition: listOf(params.get("condition"), CONDITIONS),
    make: listOf(params.get("make")),
    origin: listOf(params.get("origin"), ORIGINS),
    minPrice: numberOf(params.get("minPrice")),
    maxPrice: numberOf(params.get("maxPrice")),
    minYear: numberOf(params.get("minYear")),
    maxYear: numberOf(params.get("maxYear")),
    sort: oneOf(params.get("sort"), SORT_OPTIONS.map((o) => o.value), "newest"),
    page: Math.max(1, numberOf(params.get("page")) ?? 1),
  };
}

/** Applies a change to the URL params. Any change other than `page` goes back to page 1. */
export function patchParams(params: URLSearchParams, patch: FilterPatch): URLSearchParams {
  const next = new URLSearchParams(params);
  for (const [key, value] of Object.entries(patch)) {
    const empty =
      value === undefined || value === "" || (Array.isArray(value) && value.length === 0) ||
      (key === "status" && value === "all") || (key === "sort" && value === "newest") || (key === "page" && value === 1);
    if (empty) next.delete(key);
    else next.set(key, Array.isArray(value) ? value.join(",") : String(value));
  }
  if (!("page" in patch)) next.delete("page");
  return next;
}

/** Number of sidebar filters in use (shown on the mobile "Filters" button) */
export function countActiveFilters(f: ShowroomFilters): number {
  return (
    f.body.length + f.condition.length + f.make.length + f.origin.length +
    (f.minPrice !== undefined || f.maxPrice !== undefined ? 1 : 0) +
    (f.minYear !== undefined || f.maxYear !== undefined ? 1 : 0)
  );
}

export const SIDEBAR_KEYS = ["body", "condition", "make", "origin", "minPrice", "maxPrice", "minYear", "maxYear"] as const;
