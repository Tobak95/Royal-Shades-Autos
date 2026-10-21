import { STATUS_META } from "@/lib/status";
import type { CarStatus } from "@/types";
import { Badge } from "./Badge";

interface StatusBadgeProps {
  status: CarStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={status} dot className={className}>
      {STATUS_META[status].label}
    </Badge>
  );
}
