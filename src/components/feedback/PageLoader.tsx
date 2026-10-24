import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { BRAND } from "@/lib/site";
import { cn } from "@/lib/utils";

const LINES = [
  "Polishing the chrome",
  "Checking the tyre pressure",
  "Warming up the engine",
  "Lining up the showroom",
  "Wiping the windscreen",
];

interface PageLoaderProps {
  /** What's loading, for screen readers ("Loading car details") */
  label: string;
  className?: string;
}

/**
 * Full-page loader: the logo inside a spinning gold ring and a friendly line that changes
 * every few seconds. Screen readers only hear `label`, once.
 */
export function PageLoader({ label, className }: PageLoaderProps) {
  const [line, setLine] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setLine((l) => (l + 1) % LINES.length), 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div role="status" className={cn("flex min-h-[60vh] w-full flex-col items-center justify-center gap-[18px]", className)}>
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="relative size-[120px]">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="absolute inset-0 animate-spin-ring">
          <circle cx="60" cy="60" r="52" stroke="#EEF0F3" strokeWidth="6" />
          <path d="M60 8a52 52 0 0152 52" stroke="#D4AF5A" strokeWidth="6" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-[22px] flex items-center justify-center rounded-full bg-navy">
          <img src={logo} alt="" className="w-[62px]" />
        </div>
      </div>
      <div aria-hidden="true" className="text-center">
        <p className="text-base font-extrabold">{BRAND.shortName}</p>
        <p className="mt-0.5 text-[13px] text-muted italic">
          {LINES[line]}
          <span className="animate-dot">.</span>
          <span className="animate-dot [animation-delay:0.2s]">.</span>
          <span className="animate-dot [animation-delay:0.4s]">.</span>
        </p>
      </div>
    </div>
  );
}
