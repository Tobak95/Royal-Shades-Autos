import { CarImage } from "@/components/car/CarImage";
import { TotalsBreakdown } from "@/components/garage/TotalsBreakdown";
import { formatNaira } from "@/lib/utils";
import type { GarageTotals } from "@/lib/pricing";
import { carName } from "@/lib/voyage";
import type { Car, PaymentMethod } from "@/types";

interface ReserveSummaryProps {
  cars: Car[];
  totals: GarageTotals;
  paymentMethod: PaymentMethod | undefined;
}

export function ReserveSummary({ cars, totals, paymentMethod }: ReserveSummaryProps) {
  return (
    <div>
      <h2 className="text-lg font-bold">Your cars</h2>
      <ul className="mt-4 flex flex-col gap-3">
        {cars.map((car) => (
          <li key={car.id} className="flex items-center gap-3.5">
            <CarImage src={car.images[0]} alt="" className="h-14 w-20 flex-none rounded-control" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{carName(car)}</p>
              <p className="text-xs text-muted capitalize">{car.status}</p>
            </div>
            <p className="text-sm font-semibold">{formatNaira(car.price)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-5 border-t border-line pt-5">
        <TotalsBreakdown
          totals={totals}
          carCount={cars.length}
          depositDue={paymentMethod === "pay_on_inspection" ? "at inspection" : "today"}
        />
      </div>
    </div>
  );
}
