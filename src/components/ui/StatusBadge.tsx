import { STATUS_META } from "@/lib/status";
import type { CarStatus } from "@/types";
import { Badge, type BadgeVariant } from "./Badge";

// TEMPORARY until Step 2 replaces the status model ("incoming" becomes arriving/arrived)
const STATUS_VARIANT: Record<CarStatus, BadgeVariant> = {
  available: "available",
  incoming: "arriving",
  sold: "sold",
};

interface StatusBadgeProps {
  status: CarStatus;
  /** White pill for use on top of photos */
  overlay?: boolean;
  className?: string;
}

export function StatusBadge({ status, overlay, className }: StatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT[status]} dot overlay={overlay} className={className}>
      {STATUS_META[status].label}
    </Badge>
  );
}
