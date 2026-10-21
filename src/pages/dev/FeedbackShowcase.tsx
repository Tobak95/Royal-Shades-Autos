import { useState } from "react";
import { CarFront } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { ArcLoader } from "@/components/ui/ArcLoader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs } from "@/components/ui/Tabs";
import type { StatusFilter } from "@/types";
import { Showcase } from "./Showcase";

const TABS = [
  { value: "all" as const, label: "All", count: 16 },
  { value: "available" as const, label: "Available", count: 7 },
  { value: "incoming" as const, label: "Incoming", count: 5 },
  { value: "sold" as const, label: "Sold", count: 4 },
];

export function FeedbackShowcase() {
  const [tab, setTab] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Showcase title="Tabs and pagination">
        <Tabs items={TABS} value={tab} onChange={setTab} label="Filter by status" />
        <Pagination page={page} totalPages={12} onChange={setPage} className="mt-6 justify-start" />
      </Showcase>

      <Showcase title="Modal">
        <p className="text-sm text-muted">Escape closes it, focus stays inside, and focus returns to the button.</p>
        <Button className="mt-4" onClick={() => setModalOpen(true)}>
          Open modal
        </Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Account created"
          description="We've sent a verification link to your email. Verify it before your first reservation."
          footer={
            <>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => setModalOpen(false)}>Go to login</Button>
            </>
          }
        />
      </Showcase>

      <Showcase title="Accordion">
        <Accordion
          defaultOpen={["duty"]}
          items={[
            {
              id: "duty",
              title: "Is customs duty included in the price?",
              content: "Yes. Every price in the showroom includes clearing and customs at Tin Can or Apapa.",
            },
            {
              id: "inspect",
              title: "Can I inspect the car before paying in full?",
              content: "Yes. Your 10% deposit holds the car, and you pay the balance after inspecting it at our Lagos yard.",
            },
          ]}
        />
      </Showcase>

      <Showcase title="Loader and skeletons">
        <div className="flex flex-wrap items-center gap-8">
          <ArcLoader />
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-28 w-full rounded-card" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      </Showcase>

      <div className="lg:col-span-2">
        <EmptyState
          icon={<CarFront aria-hidden="true" className="size-6" />}
          title="Your garage is empty"
          description="Add cars from the showroom to reserve them."
          action={<ButtonLink to="/cars">Explore the showroom</ButtonLink>}
        />
      </div>
    </div>
  );
}
