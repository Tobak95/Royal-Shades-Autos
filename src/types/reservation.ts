export type PaymentMethod = "bank_transfer" | "pay_on_inspection";
export type ReservationStatus = "pending" | "confirmed" | "completed";

export interface Reservation {
  id: string;
  carIds: string[];
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  /** ISO date (yyyy-mm-dd) */
  inspectionDate: string;
  paymentMethod: PaymentMethod;
  /** Naira */
  deposit: number;
  message?: string;
  status: ReservationStatus;
  /** ISO timestamp */
  createdAt: string;
}

export type NewReservation = Omit<Reservation, "id" | "status" | "createdAt">;
