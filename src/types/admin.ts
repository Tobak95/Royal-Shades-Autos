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

/** A this-month figure with last month's for the trend chip */
export interface MonthOverMonth {
  thisMonth: number;
  lastMonth: number;
}

export interface AdminOverview {
  counts: Record<CarStatus, number> & { total: number };
  added: MonthOverMonth;
  sold: MonthOverMonth;
  reservations: MonthOverMonth;
  /** Cars sold in each of the last 6 months, oldest first; month is "yyyy-mm" */
  salesByMonth: { month: string; count: number }[];
  /** Arriving cars whose ETA is within the next 14 days, soonest first */
  arrivingSoon: { carId: string; slug: string; name: string; eta: string; daysLeft: number; stage: string }[];
  recent: ActivityEntry[];
}
