import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDataVersion } from "@/hooks/useDataVersion";
import { useQuery } from "@/hooks/useQuery";
import { useToast } from "@/hooks/useToast";
import { cn, formatDate, formatNairaShort } from "@/lib/utils";
import { AdminError } from "@/services/adminCarService";
import { listReservations, updateReservationStatus } from "@/services/adminOpsService";
import type { PaymentMethod, ReservationStatus } from "@/types";
import { AdminHeader } from "./AdminHeader";

const RESERVATION_STATUSES: { value: ReservationStatus; label: string; tint: string }[] = [
  { value: "pending", label: "Pending", tint: "bg-inspection-tint text-inspection-text" },
  { value: "confirmed", label: "Confirmed", tint: "bg-arriving-tint text-arriving-text" },
  { value: "completed", label: "Completed", tint: "bg-available-tint text-available-text" },
];

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  bank_transfer: "Bank transfer",
  pay_on_inspection: "Pay on inspection",
};

const th = "px-4 py-3";
const td = "px-4 py-3";

export default function ReservationsPage() {
  const version = useDataVersion();
  const { showToast } = useToast();
  const { data } = useQuery(`admin-reservations-${version}`, listReservations, { keepPrevious: true });
  const [busyId, setBusyId] = useState<string | null>(null);

  async function changeStatus(id: string, status: ReservationStatus) {
    setBusyId(id);
    try {
      await updateReservationStatus(id, status);
      showToast(`Reservation ${id} marked ${status}`);
    } catch (error) {
      showToast(error instanceof AdminError ? error.message : "Couldn't update the reservation.", { tone: "error" });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <AdminHeader title="Reservations" crumb="reservations" description={data ? `${data.length} reservations, newest first` : "Loading…"} />
      <div className="overflow-x-auto rounded-card bg-surface">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-line bg-admin-page text-xs font-bold tracking-wide text-muted uppercase">
            <tr>
              <th scope="col" className={th}>Reservation</th>
              <th scope="col" className={th}>Customer</th>
              <th scope="col" className={th}>Cars</th>
              <th scope="col" className={th}>Deposit</th>
              <th scope="col" className={th}>Inspection</th>
              <th scope="col" className={th}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {!data
              ? Array.from({ length: 4 }, (_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className={td}>
                      <Skeleton className="h-10" />
                    </td>
                  </tr>
                ))
              : data.map((r) => {
                  const tint = RESERVATION_STATUSES.find((s) => s.value === r.status)?.tint;
                  return (
                    <tr key={r.id} className="align-top">
                      <td className={td}>
                        <p className="font-mono font-bold">{r.id}</p>
                        <p className="text-xs text-muted">{formatDate(r.createdAt)}</p>
                      </td>
                      <td className={td}>
                        <p className="font-bold">{r.fullName}</p>
                        <p className="text-xs text-muted">{r.email}</p>
                        <p className="text-xs text-muted">{r.phone}</p>
                      </td>
                      <td className={td}>
                        <ul className="flex flex-col gap-0.5">
                          {r.carNames.map((name, i) => (
                            <li key={`${name}-${i}`}>{name}</li>
                          ))}
                        </ul>
                      </td>
                      <td className={td}>
                        <p className="font-bold">{formatNairaShort(r.deposit)}</p>
                        <p className="text-xs text-muted">{PAYMENT_LABELS[r.paymentMethod]}</p>
                      </td>
                      <td className={cn(td, "whitespace-nowrap")}>{formatDate(r.inspectionDate)}</td>
                      <td className={td}>
                        <div className="relative inline-flex">
                          <select
                            aria-label={`Status of reservation ${r.id}`}
                            value={r.status}
                            disabled={busyId === r.id}
                            onChange={(e) => void changeStatus(r.id, e.target.value as ReservationStatus)}
                            className={cn(
                              "h-11 appearance-none rounded-full border-0 pr-9 pl-3.5 text-[13px] font-bold focus:outline-2 focus:outline-gold disabled:opacity-60",
                              tint,
                            )}
                          >
                            {RESERVATION_STATUSES.map((s) => (
                              <option key={s.value} value={s.value} className="bg-surface text-ink">
                                {s.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 opacity-70" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
            {data?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No reservations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
