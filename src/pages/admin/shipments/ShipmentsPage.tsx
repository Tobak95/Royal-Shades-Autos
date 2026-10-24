import { Ship } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDataVersion } from "@/hooks/useDataVersion";
import { useQuery } from "@/hooks/useQuery";
import { listShipments } from "@/services/adminOpsService";
import type { Car } from "@/types";
import { AdminHeader } from "../AdminHeader";
import { ShipmentCard } from "./ShipmentCard";

const hasShipment = (car: Car): car is Car & { shipment: NonNullable<Car["shipment"]> } => Boolean(car.shipment);

export default function ShipmentsPage() {
  const version = useDataVersion();
  const { data } = useQuery(`admin-shipments-${version}`, listShipments, { keepPrevious: true });
  const cars = data?.filter(hasShipment);

  return (
    <div className="flex flex-col gap-5">
      <AdminHeader
        title="Shipments"
        crumb="shipments"
        description="Cars on the water or just landed, soonest ETA first. To start a new voyage, set a car to Arriving on the Cars page."
      />
      {!cars ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-64 rounded-card" />
          <Skeleton className="h-64 rounded-card" />
        </div>
      ) : cars.length === 0 ? (
        <EmptyState icon={<Ship aria-hidden="true" className="size-6" />} title="No incoming cars" description="Cars set to Arriving show up here." />
      ) : (
        <ul className="flex flex-col gap-4">
          {cars.map((car) => (
            <ShipmentCard key={car.id} car={car} />
          ))}
        </ul>
      )}
    </div>
  );
}
