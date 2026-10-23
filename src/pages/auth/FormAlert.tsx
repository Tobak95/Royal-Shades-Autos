import type { ReactNode } from "react";
import { CircleAlert, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormAlertProps {
  tone: "error" | "info";
  children: ReactNode;
  className?: string;
}

export function FormAlert({ tone, children, className }: FormAlertProps) {
  const Icon = tone === "error" ? CircleAlert : Info;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-control border px-4 py-3 text-sm",
        tone === "error" ? "border-sold/40 bg-sold/10 text-sold-text" : "border-gold/30 bg-gold/[0.07] text-gold-light",
        className,
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 flex-none" />
      <div>{children}</div>
    </div>
  );
}
