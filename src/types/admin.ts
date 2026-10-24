import type { CarStatus } from "./car";

/** One line in the admin "Recent changes" feed */
export interface ActivityEntry {
  id: string;
  /** ISO timestamp */
  at: string;
  message: string;
  carId?: string;
}

/** Customers derived from reservations (there's no user-management API yet) */
export interface CustomerSummary {
  email: string;
  fullName: string;
  phone: string;
  reservations: number;
  /** Naira, sum of deposits */
  totalDeposits: number;
  /** ISO timestamp */
  lastReservationAt: string;
}

export interface AdminOverview {
  counts: Record<CarStatus, number> & { total: number };
  /** Arriving cars whose ETA is within the next 14 days, soonest first */
  arrivingSoon: { carId: string; slug: string; name: string; eta: string; daysLeft: number; stage: string }[];
  recent: ActivityEntry[];
}
