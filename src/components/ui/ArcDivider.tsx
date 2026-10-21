import { cn } from "@/lib/utils";

/** Section divider drawn from the logo's speedometer arc */
export function ArcDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex justify-center pt-12 pb-2", className)}>
      <svg width="220" height="40" viewBox="0 0 220 40" fill="none" className="max-w-full">
        <path d="M10 36 A100 100 0 0 1 210 36" stroke="#DEBB6E" strokeOpacity=".5" strokeWidth="1.2" />
        <path
          d="M60 22 l3 5 M110 8 v6 M160 22 l-3 5 M35 30 l4 3 M185 30 l-4 3"
          stroke="#DEBB6E"
          strokeOpacity=".7"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="110" cy="36" r="3" fill="#DEBB6E" />
      </svg>
    </div>
  );
}
