import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDataVersion } from "@/hooks/useDataVersion";
import { useQuery } from "@/hooks/useQuery";
import { useToast } from "@/hooks/useToast";
import { STATUS_JOURNEY, STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";
import { carName } from "@/lib/voyage";
import { AdminError, adminListCars, changeCarStatus, deleteCar, setCarFeatured } from "@/services/adminCarService";
import type { Car, CarStatus } from "@/types";
import { AdminPagination } from "../AdminPagination";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { AdminCarCard } from "./AdminCarCard";
import { useCarStatusChange } from "./useCarStatusChange";

type Filter = CarStatus | "all";
const FILTERS: Filter[] = ["all", ...STATUS_JOURNEY];

/**
 * "Listed Cars": status filter, horizontal car cards and pagination. Status and page
 * live in the URL (?status=&page=) so the view can be linked and survives refresh.
 */
export function ListedCars({ searchable = false }: { searchable?: boolean }) {
  const version = useDataVersion();
  const { showToast } = useToast();
  const [params, setParams] = useSearchParams();
  const rawStatus = params.get("status") ?? "";
  const status: Filter = (FILTERS as string[]).includes(rawStatus) ? (rawStatus as Filter) : "all";
  const page = Number(params.get("page")) || 1;
  const [search, setSearch] = useState("");

  const { data, loading } = useQuery(
    `admin-cars-${status}-${page}-${search.trim()}-${version}`,
    () => adminListCars({ status, page, search }),
    { keepPrevious: true },
  );
  const statusChange = useCarStatusChange();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Car | null>(null);

  function update(next: { status?: Filter; page?: number }) {
    const s = next.status ?? status;
    const p = next.page ?? 1;
    setParams(
      (prev) => {
        const out = new URLSearchParams(prev);
        if (s === "all") out.delete("status");
        else out.set("status", s);
        if (p > 1) out.set("page", String(p));
        else out.delete("page");
        return out;
      },
      { replace: true },
    );
  }

  function changePage(p: number) {
    update({ page: p });
    document.getElementById("listed-cars")?.scrollIntoView({ block: "start" });
  }

  async function run(car: Car, action: () => Promise<unknown>, done: string) {
    setBusyId(car.id);
    try {
      await action();
      showToast(done);
    } catch (error) {
      showToast(error instanceof AdminError ? error.message : "Something went wrong. Try again.", { tone: "error" });
    } finally {
      setBusyId(null);
    }
  }

  /** Delete, or (if they ticked the alternative) mark it sold so it stays in "Recently sold" */
  async function confirmDelete(markSoldInstead: boolean) {
    if (!toDelete) return;
    if (markSoldInstead) {
      await run(toDelete, () => changeCarStatus(toDelete.id, "sold"), `${carName(toDelete)} marked as sold`);
    } else {
      await run(toDelete, () => deleteCar(toDelete.id), `${carName(toDelete)} removed`);
    }
    setToDelete(null);
  }

  return (
    <section id="listed-cars" aria-labelledby="listed-cars-heading" className="flex scroll-mt-24 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="listed-cars-heading" className="text-base font-semibold text-ink">
          Listed Cars {data && <span className="font-normal text-muted">({data.total})</span>}
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          {searchable && (
            <label className="relative">
              <span className="sr-only">Search cars</span>
              <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (page !== 1) update({ page: 1 });
                }}
                placeholder="Make, model, VIN or tracking no."
                className="h-11 w-[min(280px,80vw)] rounded-full border border-line bg-surface pr-4 pl-10 text-sm focus:border-gold focus:outline-none"
              />
            </label>
          )}
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden text-muted md:inline">Status</span>
            <span className="relative">
              <select
                aria-label="Filter by status"
                value={status}
                onChange={(e) => update({ status: e.target.value as Filter })}
                className="h-11 w-[150px] appearance-none rounded-full border border-line bg-surface pr-9 pl-4 font-medium focus:border-gold focus:outline-none"
              >
                {FILTERS.map((f) => (
                  <option key={f} value={f}>
                    {f === "all" ? "All" : STATUS_META[f].journeyLabel}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
            </span>
          </label>
        </div>
      </div>

      {!data ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-[98px] rounded-card" />
          ))}
        </div>
      ) : data.cars.length === 0 ? (
        <EmptyState title="No cars here" description="Try another status or search." />
      ) : (
        <ul className={cn("flex flex-col gap-3 transition-opacity", loading && "opacity-60")} aria-busy={loading}>
          {data.cars.map((car) => (
            <AdminCarCard
              key={car.id}
              car={car}
              busy={busyId === car.id || statusChange.busyId === car.id}
              onStatus={(next) => statusChange.request(car, next)}
              onToggleHero={() =>
                void run(
                  car,
                  () => setCarFeatured(car.id, !car.featured),
                  car.featured ? `${carName(car)} removed from the home hero` : `${carName(car)} added to the home hero`,
                )
              }
              onDelete={() => setToDelete(car)}
            />
          ))}
        </ul>
      )}

      {data && data.totalPages > 1 && <AdminPagination page={data.page} totalPages={data.totalPages} onPage={changePage} />}

      {statusChange.dialogs}
      <ConfirmDialog
        open={toDelete !== null}
        title={toDelete ? `Remove ${toDelete.make} ${toDelete.model}?` : "Remove this car?"}
        description="It disappears from the website and from anyone's garage, and can't be restored (except by resetting the demo data)."
        confirmLabel="Yes, remove"
        cancelLabel="Keep it"
        danger
        alternative={
          toDelete && toDelete.status !== "sold"
            ? { label: "Mark as Sold instead (keeps it in “Recently sold”)", confirmLabel: "Mark as sold" }
            : undefined
        }
        busy={toDelete ? busyId === toDelete.id : false}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  );
}
