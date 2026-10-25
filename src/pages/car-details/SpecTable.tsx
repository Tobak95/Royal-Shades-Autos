import { formatMileage } from "@/lib/utils";
import type { Car } from "@/types";

export function SpecTable({ car }: { car: Car }) {
  // Keep an even number of rows so the two-column grid ends cleanly
  const rows: [string, string][] = [
    ["Make", car.make],
    ["Model", car.model],
    ["Year", String(car.year)],
    ["Trim", car.trim],
    ["Body type", car.bodyType],
    ["Condition", car.condition],
    ["Colour", car.color],
    ["Engine", car.engine],
    ["Fuel", car.fuelType],
    ["Gearbox", car.transmission],
    ["Mileage", formatMileage(car.mileage, car.mileageUnit)],
    ["Seats", String(car.seats)],
    ["Imported from", car.origin],
    ["VIN", car.vin],
  ];

  return (
    <dl className="grid overflow-hidden rounded-card border border-line bg-surface sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex justify-between gap-3 border-b border-line-soft px-5 py-[15px] text-sm last:border-b-0 sm:odd:border-r sm:[&:nth-last-child(2)]:border-b-0"
        >
          <dt className="text-muted">{label}</dt>
          <dd className="text-right font-bold break-all">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
