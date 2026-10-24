// Admin shipments, reservations, customers and overview. Each function mirrors a
// future admin API endpoint (see README).
import { STAGE_LABELS, STAGE_ORDER, updateShipmentStage, type ShipmentUpdate } from "@/data/shipmentStages";
import { wait } from "@/lib/utils";
import { localISODate } from "@/lib/validators";
import { getCurrentStage } from "@/lib/voyage";
import type { AdminOverview, Car, CarStatus, CustomerSummary, Reservation, ReservationStatus } from "@/types";
import { AdminError } from "./adminCarService";
import { commit, logActivity, resetStore, store } from "./mockStore";

const LATENCY_MS = 300;
const ARRIVING_SOON_DAYS = 14;
const clone = <T>(value: T): T => structuredClone(value);
const label = (car: Pick<Car, "year" | "make" | "model">) => `${car.year} ${car.make} ${car.model}`;

function daysUntil(isoDate: string, today: string): number {
  return Math.round((Date.parse(`${isoDate}T00:00:00`) - Date.parse(`${today}T00:00:00`)) / 86_400_000);
}

// ── Shipments ───────────────────────────────────────────────────────────────

/** Cars on their way or just landed, soonest ETA first */
export async function listShipments(): Promise<Car[]> {
  await wait(LATENCY_MS);
  return clone(
    store.cars
      .filter((c) => c.shipment && (c.status === "arriving" || c.status === "arrived"))
      .sort((a, b) => (a.shipment?.eta ?? "").localeCompare(b.shipment?.eta ?? "")),
  );
}

export interface ShipmentUpdateResult {
  car: Car;
  /** True when an "arriving" car reached Lagos: the UI offers to switch it to "arrived" */
  suggestArrived: boolean;
}

/** Sets the current stage (earlier stages auto-complete), vessel and ETA */
export async function updateShipment(carId: string, update: ShipmentUpdate): Promise<ShipmentUpdateResult> {
  await wait(LATENCY_MS);
  const previous = store.cars.find((c) => c.id === carId);
  if (!previous?.shipment) throw new AdminError("This car has no shipment to update.");
  const shipment = updateShipmentStage(previous.shipment, update, localISODate());
  const car: Car = { ...previous, shipment, updatedAt: new Date().toISOString() };
  store.cars = store.cars.map((c) => (c.id === carId ? car : c));
  logActivity(`${label(car)} shipment: ${STAGE_LABELS[update.current]} · ${update.vesselName} · ETA ${update.eta}`, carId);
  commit();
  const reachedLagos = STAGE_ORDER.indexOf(update.current) >= STAGE_ORDER.indexOf("arrived_lagos");
  return { car: clone(car), suggestArrived: reachedLagos && car.status === "arriving" };
}

// ── Reservations and customers ──────────────────────────────────────────────

export interface AdminReservation extends Reservation {
  carNames: string[];
}

export async function listReservations(): Promise<AdminReservation[]> {
  await wait(LATENCY_MS);
  const nameOf = (id: string) => {
    const car = store.cars.find((c) => c.id === id);
    return car ? label(car) : "Removed car";
  };
  return clone(
    [...store.reservations]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((r) => ({ ...r, carNames: r.carIds.map(nameOf) })),
  );
}

export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<void> {
  await wait(LATENCY_MS);
  const reservation = store.reservations.find((r) => r.id === id);
  if (!reservation) throw new AdminError("That reservation no longer exists.");
  store.reservations = store.reservations.map((r) => (r.id === id ? { ...r, status } : r));
  logActivity(`Reservation ${id} (${reservation.fullName}) marked ${status}`);
  commit();
}

/** One row per email address that has reserved a car */
export async function listCustomers(): Promise<CustomerSummary[]> {
  await wait(LATENCY_MS);
  const byEmail = new Map<string, CustomerSummary>();
  for (const r of store.reservations) {
    const key = r.email.toLowerCase();
    const existing = byEmail.get(key);
    if (!existing) {
      byEmail.set(key, { email: r.email, fullName: r.fullName, phone: r.phone, reservations: 1, totalDeposits: r.deposit, lastReservationAt: r.createdAt });
      continue;
    }
    existing.reservations += 1;
    existing.totalDeposits += r.deposit;
    if (r.createdAt > existing.lastReservationAt) {
      Object.assign(existing, { lastReservationAt: r.createdAt, fullName: r.fullName, phone: r.phone });
    }
  }
  return [...byEmail.values()].sort((a, b) => b.lastReservationAt.localeCompare(a.lastReservationAt));
}

// ── Overview ────────────────────────────────────────────────────────────────

export async function getOverview(): Promise<AdminOverview> {
  await wait(LATENCY_MS);
  const today = localISODate();
  const countOf = (status: CarStatus) => store.cars.filter((c) => c.status === status).length;

  const arrivingSoon = store.cars
    .filter((c) => c.status === "arriving" && c.shipment)
    .map((c) => ({ car: c, days: daysUntil(c.shipment?.eta ?? today, today) }))
    .filter(({ days }) => days >= 0 && days <= ARRIVING_SOON_DAYS)
    .sort((a, b) => a.days - b.days)
    .map(({ car, days }) => ({
      carId: car.id,
      slug: car.slug,
      name: label(car),
      eta: car.shipment?.eta ?? today,
      daysLeft: days,
      stage: car.shipment ? (getCurrentStage(car.shipment)?.label ?? "In transit") : "In transit",
    }));

  return {
    counts: {
      arriving: countOf("arriving"),
      arrived: countOf("arrived"),
      inspection: countOf("inspection"),
      available: countOf("available"),
      sold: countOf("sold"),
      total: store.cars.length,
    },
    arrivingSoon,
    recent: clone(store.activity.slice(0, 8)),
  };
}

// ── Demo data ───────────────────────────────────────────────────────────────

/** Mock mode only: puts every car, reservation and change back to the seed data */
export async function resetDemoData(): Promise<void> {
  await wait(LATENCY_MS);
  resetStore();
}
