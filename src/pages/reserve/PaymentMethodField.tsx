import type { UseFormRegisterReturn } from "react-hook-form";
import { Banknote, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/types";

const METHODS: { value: PaymentMethod; title: string; body: string; icon: typeof Banknote }[] = [
  {
    value: "bank_transfer",
    title: "Bank transfer",
    body: "Pay the 10% deposit now to hold your cars and get tracking numbers straight away.",
    icon: Banknote,
  },
  {
    value: "pay_on_inspection",
    title: "Pay on inspection",
    body: "Hold your reservation now and pay the deposit when you inspect at our Lagos yard.",
    icon: ClipboardCheck,
  },
];

interface PaymentMethodFieldProps {
  registration: UseFormRegisterReturn<"paymentMethod">;
  selected: PaymentMethod | undefined;
}

export function PaymentMethodField({ registration, selected }: PaymentMethodFieldProps) {
  return (
    <fieldset>
      <legend className="text-lg font-bold">Payment method</legend>
      <div className="mt-4 flex flex-col gap-3">
        {METHODS.map(({ value, title, body, icon: Icon }) => (
          <label
            key={value}
            className={cn(
              "flex cursor-pointer gap-3.5 rounded-xl border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold",
              selected === value ? "border-gold bg-gold/[0.06]" : "border-line hover:border-line-strong",
            )}
          >
            <input type="radio" value={value} {...registration} className="sr-only" />
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 flex size-5 flex-none items-center justify-center rounded-full border-2",
                selected === value ? "border-gold" : "border-line-strong",
              )}
            >
              {selected === value && <span className="size-2.5 rounded-full bg-gold" />}
            </span>
            <span className="flex-1">
              <span className="flex items-center gap-2 font-semibold">
                <Icon aria-hidden="true" className="size-4 text-gold" /> {title}
              </span>
              <span className="mt-1 block text-[13px] leading-relaxed text-muted">{body}</span>
            </span>
          </label>
        ))}
      </div>

      {selected === "bank_transfer" && (
        <div className="mt-4 rounded-xl border border-dashed border-gold/40 bg-graphite-2 p-4 text-sm">
          <p className="font-semibold text-gold">Transfer to</p>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-soft">
            <dt className="text-muted">Bank</dt>
            <dd>[Bank name]</dd>
            <dt className="text-muted">Account name</dt>
            <dd>The Royal Shades Autos Limited</dd>
            <dt className="text-muted">Account number</dt>
            <dd>[Account details]</dd>
          </dl>
          <p className="mt-3 text-xs text-muted">
            Use your reservation number as the payment reference. We never ask for payment into a personal account.
          </p>
        </div>
      )}
    </fieldset>
  );
}
