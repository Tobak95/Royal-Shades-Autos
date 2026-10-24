// The in-browser "database" used until the real API exists. Every service reads and
// writes here. In mock mode, admin changes persist in localStorage so they survive a
// refresh; "Reset demo data" puts everything back to the seed data.
import { mockCars } from "@/data/mockCars";
import { mockReservations } from "@/data/mockReservations";
import { readStorage, writeStorage } from "@/lib/storage";
import type { ActivityEntry, Car, Reservation } from "@/types";

/** Flip to false when the services call the real API instead of this store */
export const USE_MOCK_DATA = true;

const KEYS = {
  cars: "rsa.demo.cars",
  reservations: "rsa.demo.reservations",
  activity: "rsa.demo.activity",
} as const;

const MAX_ACTIVITY = 50;

type Rec = Record<string, unknown>;
const isRec = (v: unknown): v is Rec => typeof v === "object" && v !== null;

function isCarList(value: unknown): value is Car[] {
  return (
    Array.isArray(value) &&
    value.every((c) => isRec(c) && typeof c.id === "string" && typeof c.slug === "string" && Array.isArray(c.images))
  );
}

function isReservationList(value: unknown): value is Reservation[] {
  return Array.isArray(value) && value.every((r) => isRec(r) && typeof r.id === "string" && Array.isArray(r.carIds));
}

function isActivityList(value: unknown): value is ActivityEntry[] {
  return Array.isArray(value) && value.every((a) => isRec(a) && typeof a.id === "string" && typeof a.message === "string");
}

/** A starter "Recent changes" feed built from the newest seed cars */
function seedActivity(cars: Car[]): ActivityEntry[] {
  return [...cars]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)
    .map((car) => ({ id: `seed-${car.id}`, at: car.createdAt, message: `Added ${car.year} ${car.make} ${car.model}`, carId: car.id }));
}

function seed() {
  const cars = structuredClone(mockCars);
  return { cars, reservations: structuredClone(mockReservations), activity: seedActivity(cars) };
}

function load() {
  const fresh = seed();
  if (!USE_MOCK_DATA) return fresh;
  return {
    cars: readStorage(KEYS.cars, isCarList) ?? fresh.cars,
    reservations: readStorage(KEYS.reservations, isReservationList) ?? fresh.reservations,
    activity: readStorage(KEYS.activity, isActivityList) ?? fresh.activity,
  };
}

export const store = load();

// ── Change notifications (pages refetch when the store changes) ────────────

let version = 0;
const listeners = new Set<() => void>();

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getVersion(): number {
  return version;
}

/** Saves the store (mock mode) and tells subscribers to refetch */
export function commit(): void {
  if (USE_MOCK_DATA) {
    writeStorage(KEYS.cars, store.cars);
    writeStorage(KEYS.reservations, store.reservations);
    writeStorage(KEYS.activity, store.activity);
  }
  version += 1;
  listeners.forEach((listener) => listener());
}

export function logActivity(message: string, carId?: string): void {
  store.activity.unshift({ id: crypto.randomUUID(), at: new Date().toISOString(), message, carId });
  store.activity.length = Math.min(store.activity.length, MAX_ACTIVITY);
}

/** Back to the seed data, and clears what was saved in this browser */
export function resetStore(): void {
  const fresh = seed();
  store.cars = fresh.cars;
  store.reservations = fresh.reservations;
  store.activity = fresh.activity;
  for (const key of Object.values(KEYS)) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage unavailable; the in-memory reset still applies
    }
  }
  version += 1;
  listeners.forEach((listener) => listener());
}
