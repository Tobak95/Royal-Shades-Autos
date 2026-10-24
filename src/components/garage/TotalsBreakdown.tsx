import { DEPOSIT_PERCENT, POLICY } from "@/lib/site";
import { formatNaira } from "@/lib/utils";
import type { GarageTotals } from "@/lib/pricing";

interface TotalsBreakdownProps {
  totals: GarageTotals;
  carCount: number;
  /** When the deposit is due: "today" for bank transfer, "at inspection" when paying later */
  depositDue?: "today" | "at inspection";
}

/** Cars total, swap credit, delivery, balance and the navy deposit box (v2 garage) */
export function TotalsBreakdown({ totals, carCount, depositDue = "today" }: TotalsBreakdownProps) {
  return (
    <>
      <dl className="flex flex-col gap-3.5 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Cars ({carCount})</dt>
          <dd className="font-bold">{formatNaira(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          {/* Swap valuations aren't built yet, so there's never a credit to show */}
          <dt className="text-muted">Swap credit</dt>
          <dd className="font-bold text-faint">Not added</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Delivery within Lagos</dt>
          {POLICY.freeLagosDelivery ? (
            <dd className="font-bold text-available-text">Free</dd>
          ) : (
            <dd className="font-bold">Quoted on request</dd>
          )}
        </div>
        <div aria-hidden="true" className="h-px bg-line-soft" />
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Balance on pickup</dt>
          <dd className="font-bold">{formatNaira(totals.balance)}</dd>
        </div>
      </dl>
      <div className="mt-5 rounded-2xl bg-navy p-[18px] text-white">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="text-[13px] font-semibold text-on-navy-soft">
            Due {depositDue} · {DEPOSIT_PERCENT} deposit
          </span>
          <span className="text-[28px] font-extrabold tracking-[-0.02em] text-gold-light">{formatNaira(totals.deposit)}</span>
        </div>
        <p className="mt-1.5 text-xs leading-normal text-on-navy-muted">
          Holds your cars while we prepare the paperwork. {POLICY.refundText}
        </p>
      </div>
    </>
  );
}
