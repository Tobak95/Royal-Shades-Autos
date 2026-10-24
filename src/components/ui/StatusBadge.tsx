import { STATUS_META } from "@/lib/status";
import type { CarStatus } from "@/types";
import { Badge } from "./Badge";

interface StatusBadgeProps {
  status: CarStatus;
  /** White pill for use on top of photos */
  overlay?: boolean;
  className?: string;
}

export function StatusBadge({ status, overlay, className }: StatusBadgeProps) {
  const meta = STATUS_META[status];
  return (
    <Badge variant={meta.badge} dot overlay={overlay} className={className}>
      {meta.label}
    </Badge>
  );
}
