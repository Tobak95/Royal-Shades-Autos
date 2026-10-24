import { useState, type ReactNode } from "react";
import { useToast } from "@/hooks/useToast";
import { STATUS_META } from "@/lib/status";
import { carName } from "@/lib/voyage";
import { AdminError, changeCarStatus, suggestTrackingNumber, type ShipmentDetails } from "@/services/adminCarService";
import type { Car, CarStatus } from "@/types";
import { ConfirmModal } from "../ConfirmModal";
import { emptyShipment } from "./carFormSchema";
import { ShipmentDialog } from "./ShipmentDialog";

type Pending = { car: Car; status: "arriving" | "sold" } | null;

/**
 * Status changes with their rules: "arriving" asks for shipment details first,
 * "sold" asks for confirmation (and stamps soldAt); everything else applies at once.
 */
export function useCarStatusChange(): { request: (car: Car, status: CarStatus) => void; busyId: string | null; dialogs: ReactNode } {
  const { showToast } = useToast();
  const [pending, setPending] = useState<Pending>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function apply(car: Car, status: CarStatus, shipment?: ShipmentDetails) {
    setBusyId(car.id);
    try {
      await changeCarStatus(car.id, status, shipment);
      showToast(`${carName(car)} is now ${STATUS_META[status].journeyLabel.toLowerCase()}`);
      setPending(null);
    } catch (error) {
      showToast(error instanceof AdminError ? error.message : "Couldn't change the status. Try again.", { tone: "error" });
    } finally {
      setBusyId(null);
    }
  }

  function request(car: Car, status: CarStatus) {
    if (status === car.status) return;
    if (status === "arriving" || status === "sold") setPending({ car, status });
    else void apply(car, status);
  }

  const dialogs =
    pending?.status === "arriving" ? (
      <ShipmentDialog
        carName={carName(pending.car)}
        initial={emptyShipment(suggestTrackingNumber(), pending.car.shipment)}
        busy={busyId === pending.car.id}
        onConfirm={(details) => void apply(pending.car, "arriving", details)}
        onCancel={() => setPending(null)}
      />
    ) : (
      <ConfirmModal
        open={pending?.status === "sold"}
        title="Mark this car as sold?"
        description={
          pending && (
            <>
              The <strong className="text-ink">{carName(pending.car)}</strong> moves to "Recently sold" with today's date,
              leaves the home hero and can't be reserved any more.
            </>
          )
        }
        confirmLabel="Mark as sold"
        danger
        busy={pending ? busyId === pending.car.id : false}
        onConfirm={() => pending && void apply(pending.car, "sold")}
        onCancel={() => setPending(null)}
      />
    );

  return { request, busyId, dialogs };
}
