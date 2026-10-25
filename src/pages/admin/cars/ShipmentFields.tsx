import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { STAGE_LABELS, STAGE_ORDER } from "@/data/shipmentStages";
import type { DestinationPort, StageKey } from "@/types";
import { PORT_OPTIONS, type ShipmentFormValues } from "./carFormSchema";

interface ShipmentFieldsProps {
  value: ShipmentFormValues;
  onChange: (value: ShipmentFormValues) => void;
  errors?: Partial<Record<keyof ShipmentFormValues, string>>;
}

const STAGE_OPTIONS = STAGE_ORDER.map((key) => ({ value: key, label: STAGE_LABELS[key] }));

/** Tracking number, vessel, ports, ETA and current stage for a car on its way */
export function ShipmentFields({ value, onChange, errors = {} }: ShipmentFieldsProps) {
  const set = <K extends keyof ShipmentFormValues>(key: K, v: ShipmentFormValues[K]) => onChange({ ...value, [key]: v });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input
        label="Tracking number"
        value={value.trackingNumber}
        onChange={(e) => set("trackingNumber", e.target.value.toUpperCase())}
        error={errors.trackingNumber}
      />
      <Input label="Vessel" placeholder="e.g. MV Grande Lagos" value={value.vesselName} onChange={(e) => set("vesselName", e.target.value)} error={errors.vesselName} />
      <Input
        label="Origin port"
        placeholder="e.g. Port of Baltimore"
        value={value.originPort}
        onChange={(e) => set("originPort", e.target.value)}
        error={errors.originPort}
      />
      <Select
        label="Destination port"
        options={PORT_OPTIONS.map((p) => ({ value: p, label: p }))}
        value={value.destinationPort}
        onChange={(e) => set("destinationPort", e.target.value as DestinationPort)}
      />
      <Input label="ETA" type="date" value={value.eta} onChange={(e) => set("eta", e.target.value)} error={errors.eta} />
      <Select
        label="Current stage"
        hint="Earlier stages are marked complete automatically."
        options={STAGE_OPTIONS}
        value={value.current}
        onChange={(e) => set("current", e.target.value as StageKey)}
      />
    </div>
  );
}
