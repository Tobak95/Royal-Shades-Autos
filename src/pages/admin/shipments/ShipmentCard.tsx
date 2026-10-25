import { useState } from "react";
import { Link } from "react-router-dom";
import { Anchor, PackageCheck } from "lucide-react";
import { CarImage } from "@/components/car/CarImage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { STAGE_LABELS, STAGE_ORDER } from "@/data/shipmentStages";
import { useToast } from "@/hooks/useToast";
import { formatDate } from "@/lib/utils";
import { carName, getCurrentStage } from "@/lib/voyage";
import { AdminError, changeCarStatus } from "@/services/adminCarService";
import { updateShipment } from "@/services/adminOpsService";
import type { Car, StageKey } from "@/types";

const STAGE_OPTIONS = STAGE_ORDER.map((key) => ({ value: key, label: STAGE_LABELS[key] }));

/** One incoming car: set its current stage, vessel and ETA */
export function ShipmentCard({ car }: { car: Car & { shipment: NonNullable<Car["shipment"]> } }) {
  const { showToast } = useToast();
  const { shipment } = car;
  const [current, setCurrent] = useState<StageKey>(getCurrentStage(shipment)?.key ?? "purchased");
  const [vesselName, setVesselName] = useState(shipment.vesselName);
  const [eta, setEta] = useState(shipment.eta);
  const [saving, setSaving] = useState(false);
  const [offerArrived, setOfferArrived] = useState(false);
  const [switching, setSwitching] = useState(false);

  const vesselError = vesselName.trim() ? undefined : "Vessel is required";
  const etaError = /^\d{4}-\d{2}-\d{2}$/.test(eta) ? undefined : "Choose the ETA";
  const dirty = current !== getCurrentStage(shipment)?.key || vesselName.trim() !== shipment.vesselName || eta !== shipment.eta;

  async function save() {
    if (vesselError || etaError) return;
    setSaving(true);
    try {
      const result = await updateShipment(car.id, { current, vesselName: vesselName.trim(), eta });
      setOfferArrived(result.suggestArrived);
      showToast(`Shipment updated: ${STAGE_LABELS[current]}`);
    } catch (error) {
      showToast(error instanceof AdminError ? error.message : "Couldn't update the shipment.", { tone: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function markArrived() {
    setSwitching(true);
    try {
      await changeCarStatus(car.id, "arrived");
      showToast(`The ${car.make} ${car.model} just docked at ${shipment.destinationPort}!`, { tone: "news", detail: "Customs next." });
      setOfferArrived(false);
    } catch (error) {
      showToast(error instanceof AdminError ? error.message : "Couldn't change the status.", { tone: "error" });
    } finally {
      setSwitching(false);
    }
  }

  return (
    <li className="flex flex-col gap-4 rounded-card bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-4">
        <CarImage src={car.images[0]} alt="" className="h-16 w-24 flex-none rounded-control" />
        <div className="min-w-0 flex-1">
          <Link to={`/admin/cars/${car.id}/edit`} className="text-lg font-extrabold hover:text-gold-text">
            {carName(car)}
          </Link>
          <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
            <span className="font-mono font-semibold text-ink">{shipment.trackingNumber}</span>
            <span aria-hidden="true">·</span>
            <span>
              {shipment.originPort} → {shipment.destinationPort}
            </span>
          </p>
        </div>
        <StatusBadge status={car.status} />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-line-soft" aria-hidden="true">
          <div className="h-full rounded-full bg-gold" style={{ width: `${shipment.progress}%` }} />
        </div>
        <span className="text-xs font-bold text-muted">{shipment.progress}%</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          label="Current stage"
          hint="Earlier stages complete automatically."
          options={STAGE_OPTIONS}
          value={current}
          onChange={(e) => setCurrent(e.target.value as StageKey)}
        />
        <Input label="Vessel" value={vesselName} onChange={(e) => setVesselName(e.target.value)} error={vesselError} />
        <Input label="ETA" type="date" value={eta} onChange={(e) => setEta(e.target.value)} error={etaError} hint={`Was ${formatDate(shipment.eta)}`} />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button variant="navy" size="sm" loading={saving} disabled={!dirty || Boolean(vesselError || etaError)} onClick={save}>
          <Anchor aria-hidden="true" className="size-4" /> Save shipment
        </Button>
      </div>

      {offerArrived && (
        <div role="status" className="flex flex-wrap items-center gap-3 rounded-card border border-gold-border bg-gold-tint p-4">
          <PackageCheck aria-hidden="true" className="size-5 flex-none text-gold-text" />
          <p className="min-w-0 flex-1 text-sm">
            <strong>The car has reached Lagos.</strong> Switch its status to "Arrived"?
          </p>
          <Button variant="outline" size="sm" onClick={() => setOfferArrived(false)}>
            Not yet
          </Button>
          <Button variant="navy" size="sm" loading={switching} onClick={markArrived}>
            Mark as arrived
          </Button>
        </div>
      )}
    </li>
  );
}
