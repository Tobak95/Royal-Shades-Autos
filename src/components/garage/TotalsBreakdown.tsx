import { formatNaira } from "@/lib/utils";
import type { GarageTotals } from "@/lib/pricing";

interface TotalsBreakdownProps {
  totals: GarageTotals;
  carCount: number;
  /** "Due today" for bank transfer, "Due at inspection" when paying later */
  depositLabel?: string;
}

/** Cars total, free delivery, customs included, balance and the 10% deposit */
export function TotalsBreakdown({ totals, carCount, depositLabel = "Due today · 10% deposit" }: TotalsBreakdownProps) {
  return (
    <>
      <dl className="flex flex-col gap-3.5 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Cars ({carCount})</dt>
          <dd className="font-semibold">{formatNaira(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Delivery within Lagos</dt>
          <dd className="font-semibold text-available-text">Free</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Customs &amp; clearing</dt>
          <dd className="font-semibold">Included</dd>
        </div>
        <div aria-hidden="true" className="h-px bg-line" />
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Balance on pickup</dt>
          <dd className="font-semibold">{formatNaira(totals.balance)}</dd>
        </div>
      </dl>
      <div className="mt-5 rounded-xl bg-graphite-2 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="text-[13px] font-semibold text-silver">{depositLabel}</span>
          <span className="text-[26px] font-extrabold tracking-[-0.02em] text-gold">{formatNaira(totals.deposit)}</span>
        </div>
        <p className="mt-1.5 text-xs leading-normal text-muted">Fully refundable if the car fails inspection on arrival.</p>
      </div>
    </>
  );
}
