import { Link } from "react-router-dom";
import { ArrowRight, Clock, Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDataVersion } from "@/hooks/useDataVersion";
import { useQuery } from "@/hooks/useQuery";
import { formatDate } from "@/lib/utils";
import { getOverview } from "@/services/adminOpsService";
import { AdminHeader } from "./AdminHeader";
import { timeAgo } from "./adminFormat";
import { ListedCars } from "./cars/ListedCars";
import { SalesChart } from "./overview/SalesChart";
import { StatCard } from "./overview/StatCard";
import { StockByStatus } from "./overview/StockByStatus";

const panel = "rounded-card bg-surface p-5 sm:p-6";
const panelTitle = "text-base font-semibold text-ink";

export default function OverviewPage() {
  const version = useDataVersion();
  const { data } = useQuery(`admin-overview-${version}`, getOverview, { keepPrevious: true });
  const soldInPeriod = data?.salesByMonth.reduce((sum, m) => sum + m.count, 0) ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <AdminHeader
        title="Dashboard"
        crumb="overview"
        actions={
          <ButtonLink to="/admin/cars/new" variant="navy" size="sm">
            <Plus aria-hidden="true" className="size-4" /> Add car
          </ButtonLink>
        }
      />

      {!data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-[118px] rounded-card" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Cars added this month" value={data.added.thisMonth} trend={data.added} />
          <StatCard label="Cars sold this month" value={data.sold.thisMonth} trend={data.sold} />
          <StatCard label="Reservations this month" value={data.reservations.thisMonth} trend={data.reservations} />
          <StatCard
            label="Cars on the way"
            value={data.counts.arriving}
            note={`${data.arrivingSoon.length} due in 14 days`}
          />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section aria-labelledby="sales-heading" className={panel}>
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="sales-heading" className={panelTitle}>
              Cars sold per month
            </h2>
            <p className="text-sm text-muted">{data ? `${soldInPeriod} in the last 6 months` : " "}</p>
          </div>
          {data ? <SalesChart data={data.salesByMonth} /> : <Skeleton className="h-[210px]" />}
        </section>

        <section aria-labelledby="stock-heading" className={panel}>
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h2 id="stock-heading" className={panelTitle}>
              Stock by status
            </h2>
            <p className="text-sm text-muted">{data ? `${data.counts.total} cars` : " "}</p>
          </div>
          {data ? <StockByStatus counts={data.counts} /> : <Skeleton className="h-[210px]" />}
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section aria-labelledby="soon-heading" className={panel}>
          <div className="flex items-center justify-between gap-3">
            <h2 id="soon-heading" className={panelTitle}>
              Arriving in the next 14 days
            </h2>
            <Link to="/admin/shipments" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-gold-text hover:text-gold-hover">
              Shipments <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          {!data ? (
            <Skeleton className="mt-3 h-20" />
          ) : data.arrivingSoon.length === 0 ? (
            <p className="mt-3 rounded-control bg-admin-page px-4 py-6 text-center text-sm text-muted">Nothing due in the next 14 days.</p>
          ) : (
            <ul className="mt-2 divide-y divide-line-soft">
              {data.arrivingSoon.map((item) => (
                <li key={item.carId} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <Link to={`/admin/cars/${item.carId}/edit`} className="font-semibold hover:text-gold-text">
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted">{item.stage}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatDate(item.eta)}</p>
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
          <h2 id="recent-heading" className={panelTitle}>
            Recent changes
          </h2>
          {!data ? (
            <Skeleton className="mt-3 h-32" />
          ) : data.recent.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No changes yet.</p>
          ) : (
            <ol className="mt-3 flex flex-col gap-3">
              {data.recent.slice(0, 5).map((entry) => (
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

      <ListedCars />
    </div>
  );
}
