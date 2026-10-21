import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { useQuery } from "@/hooks/useQuery";
import { cn } from "@/lib/utils";
import { getStats } from "@/services/carService";

const cellClass = "border-line px-7 py-6 [&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-b-0 sm:[&:nth-child(odd)]:border-r lg:[&:not(:last-child)]:border-r";

export function StatsStrip() {
  const { data: stats } = useQuery("stats", getStats);

  const items = [
    { label: "Available now", dot: "bg-available", value: stats?.available },
    { label: "On the water", dot: "bg-incoming", value: stats?.incoming },
    { label: "Recently sold", dot: "bg-sold", value: stats?.sold },
  ];

  return (
    <section aria-label="Inventory at a glance" className="relative z-10 -mt-12">
      <Container>
        <div className="grid overflow-hidden rounded-card border border-line bg-graphite sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className={cellClass}>
              <p className="flex items-center gap-2 text-[13px] text-muted">
                <span aria-hidden="true" className={cn("size-2 rounded-full", item.dot)} />
                {item.label}
              </p>
              {item.value === undefined ? (
                <Skeleton className="mt-2.5 h-10 w-12" />
              ) : (
                <p className="mt-1.5 text-[40px] leading-tight font-extrabold tracking-[-0.02em]">{item.value}</p>
              )}
            </div>
          ))}
          <div className={cellClass}>
            <p className="text-[13px] text-muted">Clearing ports</p>
            <p className="mt-3.5 text-lg font-bold">{stats ? stats.ports.join(" · ") : "Tin Can · Apapa"}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
