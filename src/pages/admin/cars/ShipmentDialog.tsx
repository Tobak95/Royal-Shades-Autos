import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { ShipmentDetails } from "@/services/adminCarService";
import { ShipmentFields } from "./ShipmentFields";
import { shipmentIssues, type ShipmentFormValues } from "./carFormSchema";

interface ShipmentDialogProps {
  carName: string;
  initial: ShipmentFormValues;
  busy?: boolean;
  onConfirm: (details: ShipmentDetails) => void;
  onCancel: () => void;
}

/** Asked when a car moves to "arriving": it can't be tracked without these details */
export function ShipmentDialog({ carName, initial, busy, onConfirm, onCancel }: ShipmentDialogProps) {
  const [value, setValue] = useState(initial);
  const [showErrors, setShowErrors] = useState(false);
  const issues = shipmentIssues(value);
  const errors = showErrors ? Object.fromEntries(issues.map((i) => [i.field, i.message])) : {};

  function confirm() {
    if (issues.length) {
      setShowErrors(true);
      return;
    }
    onConfirm({ ...value, trackingNumber: value.trackingNumber.trim(), vesselName: value.vesselName.trim(), originPort: value.originPort.trim() });
  }

  return (
    <Modal
      open
      onClose={onCancel}
      size="lg"
      title={`Shipment for the ${carName}`}
      description="Arriving cars appear on the Track page, so they need their voyage details."
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="navy" loading={busy} onClick={confirm}>
            Mark as arriving
          </Button>
        </>
      }
    >
      <ShipmentFields value={value} onChange={setValue} errors={errors} />
    </Modal>
  );
}
