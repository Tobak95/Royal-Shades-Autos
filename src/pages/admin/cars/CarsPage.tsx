import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Pencil, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { CarImage } from "@/components/car/CarImage";
import { ButtonLink } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { fieldVariants } from "@/components/ui/variants";
import { useDataVersion } from "@/hooks/useDataVersion";
import { useQuery } from "@/hooks/useQuery";
import { useToast } from "@/hooks/useToast";
import { STATUS_JOURNEY, STATUS_META } from "@/lib/status";
import { cn, formatDate, formatNairaShort } from "@/lib/utils";
import { carName } from "@/lib/voyage";
import { adminListCars, deleteCar } from "@/services/adminCarService";
import type { Car, CarStatus } from "@/types";
import { AdminHeader } from "../AdminHeader";
import { ConfirmModal } from "../ConfirmModal";
import { StatusSelect } from "./StatusSelect";
import { useCarStatusChange } from "./useCarStatusChange";

type Filter = CarStatus | "all";
const FILTERS: Filter[] = ["all", ...STATUS_JOURNEY];

export default function CarsPage() {
  const version = useDataVersion();
  const { showToast } = useToast();
  const [params, setParams] = useSearchParams();
  const status = (FILTERS as string[]).includes(params.get("status") ?? "") ? (params.get("status") as Filter) : "all";
  const [search, setSearch] = useState("");
  const { data, loading } = useQuery(
    `admin-cars-${status}-${search.trim()}-${version}`,
    () => adminListCars({ status, search }),
    { keepPrevious: true },
  );
  const statusChange = useCarStatusChange();
  const [toDelete, setToDelete] = useState<Car | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    await deleteCar(toDelete.id);
    showToast(`${carName(toDelete)} deleted`, { tone: "info" });
    setDeleting(false);
    setToDelete(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <AdminHeader
        title="Manage *cars*"
        description={data ? `${data.length} ${data.length === 1 ? "car" : "cars"}${status === "all" ? "" : ` · ${STATUS_META[status].journeyLabel}`}` : "Loading…"}
        actions={
          <ButtonLink to="/admin/cars/new" variant="navy" size="sm">
            <Plus aria-hidden="true" className="size-4" /> Add car
          </ButtonLink>
        }
      />

      <div className="flex flex-wrap items-end gap-3">
        <label className="relative min-w-0 flex-[1_1_260px]">
          <span className="sr-only">Search cars</span>
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search make, model, VIN or tracking number"
            className={cn(fieldVariants(), "h-[50px] bg-surface pl-11")}
          />
        </label>
        <Select
          label="Status"
          hideLabel
          containerClassName="w-[200px]"
          className="bg-surface"
          value={status}
          onChange={(e) => setParams(e.target.value === "all" ? {} : { status: e.target.value }, { replace: true })}
          options={FILTERS.map((f) => ({ value: f, label: f === "all" ? "All statuses" : STATUS_META[f].journeyLabel }))}
        />
      </div>

      <div className="overflow-x-auto rounded-panel border border-line bg-surface">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line bg-page text-xs font-bold tracking-wide text-muted uppercase">
            <tr>
              <th scope="col" className="px-4 py-3">Car</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Price</th>
              <th scope="col" className="px-4 py-3">Updated</th>
              <th scope="col" className="px-4 py-3 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {loading && !data
              ? Array.from({ length: 5 }, (_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-3">
                      <Skeleton className="h-12" />
                    </td>
                  </tr>
                ))
              : data?.map((car) => (
                  <tr key={car.id} className="align-middle">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <CarImage src={car.images[0]} alt="" muted={car.status === "sold"} className="h-12 w-16 flex-none rounded-lg" />
                        <div className="min-w-0">
                          <Link to={`/admin/cars/${car.id}/edit`} className="font-bold hover:text-gold-text">
                            {carName(car)}
                          </Link>
                          <p className="flex items-center gap-2 text-xs text-muted">
                            <span className="truncate">{car.trim} · {car.vin}</span>
                            {car.featured && car.status === "available" && (
                              <span className="inline-flex flex-none items-center gap-1 rounded-full bg-gold-tint px-2 py-0.5 font-bold text-gold-text">
                                <Sparkles aria-hidden="true" className="size-3" /> Hero
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect
                        value={car.status}
                        label={`Status of the ${carName(car)}`}
                        disabled={statusChange.busyId === car.id}
                        onChange={(next) => statusChange.request(car, next)}
                      />
                    </td>
                    <td className="px-4 py-3 font-bold">{formatNairaShort(car.price)}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(car.updatedAt ?? car.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          to={`/admin/cars/${car.id}/edit`}
                          aria-label={`Edit the ${carName(car)}`}
                          className="flex size-11 items-center justify-center rounded-control text-muted hover:bg-navy/5 hover:text-ink"
                        >
                          <Pencil aria-hidden="true" className="size-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setToDelete(car)}
                          aria-label={`Delete the ${carName(car)}`}
                          className="flex size-11 items-center justify-center rounded-control text-muted hover:bg-sold-tint hover:text-sold"
                        >
                          <Trash2 aria-hidden="true" className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            {data?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No cars match. Try another search or status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {statusChange.dialogs}
      <ConfirmModal
        open={toDelete !== null}
        title="Delete this car?"
        description={toDelete && <>The <strong className="text-ink">{carName(toDelete)}</strong> is removed from the showroom and can't be restored (except by resetting the demo data).</>}
        confirmLabel="Delete car"
        danger
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
