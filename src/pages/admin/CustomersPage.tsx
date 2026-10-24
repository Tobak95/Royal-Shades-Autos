import { Skeleton } from "@/components/ui/Skeleton";
import { useDataVersion } from "@/hooks/useDataVersion";
import { useQuery } from "@/hooks/useQuery";
import { formatDate, formatNairaShort } from "@/lib/utils";
import { listCustomers } from "@/services/adminOpsService";
import { AdminHeader } from "./AdminHeader";

const th = "px-4 py-3";
const td = "px-4 py-3";

/** Read-only for now: customers are derived from reservations until accounts are listed by the API */
export default function CustomersPage() {
  const version = useDataVersion();
  const { data } = useQuery(`admin-customers-${version}`, listCustomers, { keepPrevious: true });

  return (
    <div className="flex flex-col gap-5">
      <AdminHeader title="Our *customers*" description="Everyone who has reserved a car, most recent first." />
      <div className="overflow-x-auto rounded-panel border border-line bg-surface">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line bg-page text-xs font-bold tracking-wide text-muted uppercase">
            <tr>
              <th scope="col" className={th}>Customer</th>
              <th scope="col" className={th}>Phone</th>
              <th scope="col" className={th}>Reservations</th>
              <th scope="col" className={th}>Total deposits</th>
              <th scope="col" className={th}>Last reserved</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {!data
              ? Array.from({ length: 4 }, (_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className={td}>
                      <Skeleton className="h-10" />
                    </td>
                  </tr>
                ))
              : data.map((c) => (
                  <tr key={c.email}>
                    <td className={td}>
                      <p className="font-bold">{c.fullName}</p>
                      <a href={`mailto:${c.email}`} className="text-xs text-muted hover:text-gold-text">
                        {c.email}
                      </a>
                    </td>
                    <td className={td}>
                      <a href={`tel:${c.phone}`} className="hover:text-gold-text">
                        {c.phone}
                      </a>
                    </td>
                    <td className={td}>{c.reservations}</td>
                    <td className={`${td} font-bold`}>{formatNairaShort(c.totalDeposits)}</td>
                    <td className={`${td} text-muted`}>{formatDate(c.lastReservationAt)}</td>
                  </tr>
                ))}
            {data?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
