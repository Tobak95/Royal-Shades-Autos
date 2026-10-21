import { formatMileage } from "@/lib/utils";
import type { Car } from "@/types";

export function SpecTable({ car }: { car: Car }) {
  const rows: [string, string][] = [
    ["Make", car.make],
    ["Model", car.model],
    ["Trim", car.trim],
    ["Year", String(car.year)],
    ["Condition", car.condition],
    ["Body type", car.bodyType],
    ["Mileage", formatMileage(car.mileage, car.mileageUnit)],
    ["Transmission", car.transmission],
    ["Fuel", car.fuelType],
    ["Engine", car.engine],
    ["Colour", car.color],
    ["Seats", String(car.seats)],
    ["Imported from", car.origin],
    ["VIN", car.vin],
  ];

  return (
    <dl className="grid overflow-hidden rounded-card border border-line bg-graphite sm:grid-cols-2">
      {/* Even number of rows, so the last pair drops its bottom border on two columns */}
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex justify-between gap-4 border-b border-line px-5 py-3.5 text-sm last:border-b-0 sm:odd:border-r sm:[&:nth-last-child(2)]:border-b-0"
        >
          <dt className="text-muted">{label}</dt>
          <dd className="text-right font-semibold break-all">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
