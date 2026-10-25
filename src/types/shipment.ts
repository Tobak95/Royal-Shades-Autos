export type StageKey =
  | "purchased"
  | "to_origin_port"
  | "departed_origin"
  | "at_sea"
  | "arrived_lagos"
  | "customs"
  | "ready";

export interface TrackingStage {
  key: StageKey;
  label: string;
  location: string;
  /** ISO date (yyyy-mm-dd); actual for completed stages, estimated otherwise */
  date?: string;
  completed: boolean;
  current?: boolean;
}

export type DestinationPort = "Tin Can Island" | "Apapa";

export interface Shipment {
  trackingNumber: string;
  vesselName: string;
  originPort: string;
  destinationPort: DestinationPort;
  /** ISO date (yyyy-mm-dd) */
  eta: string;
  /** 0–100 */
  progress: number;
  stages: TrackingStage[];
}
