import type { CarStatus } from "@/types";

export const STATUS_META: Record<CarStatus, { label: string; cta: string }> = {
  available: { label: "Available", cta: "Add to Garage" },
  incoming: { label: "Incoming", cta: "Reserve" },
  sold: { label: "Sold", cta: "Similar" },
};
