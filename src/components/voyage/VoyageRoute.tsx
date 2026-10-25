import { motion } from "framer-motion";
import { ShipIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface VoyageRouteProps {
  progress: number;
  from: string;
  to: string;
  size?: "sm" | "lg";
  className?: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

/** Horizontal route from the origin port to Lagos, with the ship at the current position */
export function VoyageRoute({ progress, from, to, size = "sm", className }: VoyageRouteProps) {
  const value = Math.min(100, Math.max(0, progress));
  const large = size === "lg";
  const ship = large ? 44 : 30;

  return (
    <div className={className}>
      <div
        role="img"
        aria-label={`Ship ${value}% of the way from ${from} to ${to}`}
        className={cn("relative", large ? "mx-[22px] h-11" : "mx-[15px] h-[30px]")}
      >
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-line-strong" />
        <motion.div
          className="absolute top-1/2 left-0 h-[3px] -translate-y-1/2 rounded-sm bg-gold"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease }}
        />
        <span className="absolute top-1/2 -left-1.5 size-3 -translate-y-1/2 rounded-full bg-gold" />
        <span className="absolute top-1/2 -right-1.5 size-3 -translate-y-1/2 rounded-full border-2 border-line-strong bg-surface" />
        <motion.div
          className="absolute top-1/2 flex animate-pulse-gold items-center justify-center rounded-full bg-gold text-navy"
          style={{ width: ship, height: ship, marginLeft: -ship / 2, marginTop: -ship / 2 }}
          initial={{ left: "0%" }}
          animate={{ left: `${value}%` }}
          transition={{ duration: 1.2, ease }}
        >
          <ShipIcon size={large ? 22 : 16} strokeWidth={2} />
        </motion.div>
      </div>
      <div className={cn("mt-2.5 flex justify-between gap-4 text-muted", large ? "text-[13px]" : "text-xs")}>
        <span>{from}</span>
        <span className="text-right">{to}</span>
      </div>
    </div>
  );
}
