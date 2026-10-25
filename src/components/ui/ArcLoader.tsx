import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

interface ArcLoaderProps {
  size?: number;
  label?: string;
  /** Show the logo above the arc (full-page loading) */
  withLogo?: boolean;
  /** Fill the viewport and centre the loader */
  fullScreen?: boolean;
  className?: string;
}

// A 270° speedometer arc (r=50 → circumference ≈ 314, arc ≈ 235) with a gold
// segment sweeping across it like a needle.
export function ArcLoader({ size = 72, label = "Loading", withLogo = false, fullScreen = false, className }: ArcLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-5",
        fullScreen && "min-h-[60vh] w-full",
        className,
      )}
    >
      {withLogo && <img src={logo} alt="" className="h-14 w-auto" />}
      <svg aria-hidden="true" width={size} height={size} viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="#E3E6EB"
          strokeWidth="8"
          strokeDasharray="235 314"
          strokeLinecap="round"
          transform="rotate(135 60 60)"
        />
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="#D4AF5A"
          strokeWidth="8"
          strokeDasharray="60 314"
          strokeLinecap="round"
          transform="rotate(135 60 60)"
          className="animate-arc-sweep"
        />
        <circle cx="60" cy="60" r="5" fill="#D4AF5A" />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}
