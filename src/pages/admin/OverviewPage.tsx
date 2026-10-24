import { Link } from "react-router-dom";
import { ArrowRight, Clock, Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDataVersion } from "@/hooks/useDataVersion";
import { useQuery } from "@/hooks/useQuery";
import { STATUS_JOURNEY, STATUS_META } from "@/lib/status";
import { cn, formatDate } from "@/lib/utils";
import { getOverview } from "@/services/adminOpsService";
import { AdminHeader } from "./AdminHeader";
import { timeAgo } from "./adminFormat";

const panel = "rounded-panel border border-line bg-surface p-5 sm:p-6";

export default function OverviewPage() {
  const version = useDataVersion();
  const { data } = useQuery(`admin-overview-${version}`, getOverview, { keepPrevious: true });

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader
        title="Dashboard *overview*"
        description="Stock by status, cars landing soon and the latest changes."
        actions={
          <ButtonLink to="/admin/cars/new" variant="navy" size="sm">
            <Plus aria-hidden="true" className="size-4" /> Add car
          </ButtonLink>
        }
      />

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <li>
          <Link to="/admin/cars" className="block h-full rounded-card bg-navy p-4 text-white transition-colors hover:bg-navy-2">
            <p className="text-xs font-semibold text-on-navy-muted">All cars</p>
            <p className="mt-1 text-3xl font-extrabold">{data?.counts.total ?? "–"}</p>
          </Link>
        </li>
        {STATUS_JOURNEY.map((status) => (
          <li key={status}>
            <Link
              to={`/admin/cars?status=${status}`}
              className="block h-full rounded-card border border-line bg-surface p-4 transition-colors hover:border-navy"
            >
              <p className="flex items-center gap-2 text-xs font-semibold text-muted">
                <span aria-hidden="true" className={cn("size-2 rounded-full", STATUS_META[status].barClass)} />
                {STATUS_META[status].journeyLabel}
              </p>
              <p className="mt-1 text-3xl font-extrabold">{data?.counts[status] ?? "–"}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 xl:grid-cols-2">
        <section aria-labelledby="soon-heading" className={panel}>
          <div className="flex items-center justify-between gap-3">
            <h2 id="soon-heading" className="text-lg font-extrabold">
              Arriving in the next 14 days
            </h2>
            <Link to="/admin/shipments" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-gold-text hover:text-gold-hover">
              Shipments <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          {!data ? (
            <Skeleton className="mt-4 h-24" />
          ) : data.arrivingSoon.length === 0 ? (
            <p className="mt-4 rounded-control bg-page px-4 py-6 text-center text-sm text-muted">Nothing due in the next 14 days.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line-soft">
              {data.arrivingSoon.map((item) => (
                <li key={item.carId} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <Link to={`/admin/cars/${item.carId}/edit`} className="font-bold hover:text-gold-text">
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted">{item.stage}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatDate(item.eta)}</p>
                    <p className="text-xs font-semibold text-arriving-text">
                      {item.daysLeft === 0 ? "Due today" : `In ${item.daysLeft} day${item.daysLeft === 1 ? "" : "s"}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="recent-heading" className={panel}>
          <h2 id="recent-heading" className="text-lg font-extrabold">
            Recent changes
          </h2>
          {!data ? (
            <Skeleton className="mt-4 h-40" />
          ) : data.recent.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No changes yet.</p>
          ) : (
            <ol className="mt-3 flex flex-col gap-3">
              {data.recent.map((entry) => (
                <li key={entry.id} className="flex items-start gap-3 text-sm">
                  <Clock aria-hidden="true" className="mt-0.5 size-4 flex-none text-gold-text" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{entry.message}</p>
                    <p className="text-xs text-muted">{timeAgo(entry.at)}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
