import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CarGrid } from "@/components/car/CarGrid";
import { Container } from "@/components/layout/Container";
import { FadeUp } from "@/components/motion/FadeUp";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tabs } from "@/components/ui/Tabs";
import { useQuery } from "@/hooks/useQuery";
import { getCars, getStats } from "@/services/carService";
import type { StatusFilter } from "@/types";

const TAB_LABELS: Record<StatusFilter, string> = {
  all: "All",
  available: "Available",
  incoming: "Incoming",
  sold: "Sold",
};

export function ShowroomPreview() {
  const [tab, setTab] = useState<StatusFilter>("all");
  const { data, loading } = useQuery(`home-showroom-${tab}`, () => getCars({ status: tab, pageSize: 6 }));
  // Counts don't depend on the selected tab, so they come from the stats call
  const { data: stats } = useQuery("stats", getStats);
  const counts: Partial<Record<StatusFilter, number>> | undefined = stats && {
    all: stats.total,
    available: stats.available,
    incoming: stats.incoming,
    sold: stats.sold,
  };

  const tabs = (Object.keys(TAB_LABELS) as StatusFilter[]).map((value) => ({
    value,
    label: TAB_LABELS[value],
    count: counts?.[value],
  }));
  const viewAllHref = tab === "all" ? "/cars" : `/cars?status=${tab}`;

  return (
    <section id="showroom" className="pt-[104px] pb-10">
      <Container>
        <FadeUp className="flex flex-wrap items-end justify-between gap-5">
          <SectionHeading eyebrow="The collection" title="Explore the *Showroom*" />
          <Tabs items={tabs} value={tab} onChange={setTab} label="Filter by status" idPrefix="home-showroom" />
        </FadeUp>

        <div id="home-showroom-panel" role="tabpanel" aria-labelledby={`home-showroom-tab-${tab}`} className="mt-9">
          <CarGrid cars={data?.cars} loading={loading} />
        </div>

        <div className="mt-9 flex justify-center">
          <ButtonLink to={viewAllHref} variant="outline">
            View all {counts?.[tab] ?? ""} {tab === "all" ? "cars" : `${TAB_LABELS[tab].toLowerCase()} cars`}
            <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
