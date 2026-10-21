import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import { CarGrid } from "@/components/car/CarGrid";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { useQuery } from "@/hooks/useQuery";
import { DEFAULT_PAGE_SIZE, getCars, getFilterOptions } from "@/services/carService";
import { FilterPanel } from "./FilterPanel";
import { countActiveFilters, parseFilters, patchParams, SIDEBAR_KEYS, type FilterPatch } from "./filterParams";
import { ShowroomToolbar } from "./ShowroomToolbar";

export default function ShowroomPage() {
  const [params, setParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const filters = parseFilters(params);

  const { data: options } = useQuery("filter-options", getFilterOptions);
  const { data, loading } = useQuery(`cars?${params.toString()}`, () =>
    getCars({
      status: filters.status,
      search: filters.q || undefined,
      bodyTypes: filters.body,
      conditions: filters.condition,
      makes: filters.make,
      origins: filters.origin,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minYear: filters.minYear,
      maxYear: filters.maxYear,
      sort: filters.sort,
      page: filters.page,
      pageSize: DEFAULT_PAGE_SIZE,
    }),
  );

  const update = (patch: FilterPatch) => setParams((prev) => patchParams(prev, patch), { replace: true });
  const activeFilterCount = countActiveFilters(filters);
  const clearSidebar = () => update(Object.fromEntries(SIDEBAR_KEYS.map((k) => [k, undefined])));
  const clearAll = () => setParams(new URLSearchParams(), { replace: true });

  function goToPage(page: number) {
    setParams((prev) => patchParams(prev, { page }));
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const first = data && data.total > 0 ? (data.page - 1) * data.pageSize + 1 : 0;
  const last = data ? Math.min(data.page * data.pageSize, data.total) : 0;
  const panel = options ? <FilterPanel filters={filters} options={options} onChange={update} /> : <FilterSkeleton />;

  return (
    <>
      <PageHero
        title="Explore the *Showroom*"
        description="Cars in our Lagos yard, cars on the water, and the ones that have already found a home."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Showroom" }]}
      />

      <Container className="grid gap-8 py-12 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-28 rounded-card border border-line bg-graphite p-5">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              {activeFilterCount > 0 && (
                <button type="button" onClick={clearSidebar} className="min-h-11 text-sm font-semibold text-gold hover:text-gold-light">
                  Clear all
                </button>
              )}
            </div>
            {panel}
          </div>
        </aside>

        <div ref={resultsRef} className="min-w-0 scroll-mt-28">
          <ShowroomToolbar
            filters={filters}
            counts={data?.counts}
            activeFilterCount={activeFilterCount}
            onChange={update}
            onOpenFilters={() => setDrawerOpen(true)}
          />

          <p aria-live="polite" className="mt-6 mb-5 text-sm text-muted">
            {loading ? "Loading cars…" : `Showing ${first}–${last} of ${data?.total ?? 0} ${data?.total === 1 ? "car" : "cars"}`}
          </p>

          <div id="showroom-panel" role="tabpanel" aria-labelledby={`showroom-tab-${filters.status}`}>
            <CarGrid
              cars={data?.cars}
              loading={loading}
              skeletonCount={DEFAULT_PAGE_SIZE}
              className="lg:grid-cols-2 xl:grid-cols-3"
              empty={
                <EmptyState
                  icon={<SearchX aria-hidden="true" className="size-6" />}
                  title="No cars match your search"
                  description="Try removing a filter or searching for a different make or model. New cars land every few weeks."
                  action={<Button onClick={clearAll}>Clear all filters</Button>}
                />
              }
            />
          </div>

          {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={goToPage} className="mt-10" />}
        </div>
      </Container>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filters"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={clearSidebar} className="flex-1">
              Clear
            </Button>
            <Button onClick={() => setDrawerOpen(false)} className="flex-1">
              Show {data?.total ?? ""} cars
            </Button>
          </div>
        }
      >
        {panel}
      </Drawer>
    </>
  );
}

function FilterSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="h-6 w-full" />
      ))}
    </div>
  );
}
