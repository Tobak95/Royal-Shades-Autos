import { motion } from "framer-motion";

interface ArcProgressRingProps {
  progress: number;
  size?: number;
  className?: string;
}

// 270° speedometer arc: r=50 gives a circumference of ~314, of which the arc uses 235.
const ARC = 235;
const CIRCUMFERENCE = 314;

export function ArcProgressRing({ progress, size = 96, className }: ArcProgressRingProps) {
  const value = Math.min(100, Math.max(0, progress));
  const filled = (ARC * value) / 100;

  return (
    <svg
      role="img"
      aria-label={`Voyage ${value} percent complete`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
    >
      <circle
        cx="60"
        cy="60"
        r="50"
        fill="none"
        stroke="#2A2A30"
        strokeWidth="8"
        strokeDasharray={`${ARC} ${CIRCUMFERENCE}`}
        strokeLinecap="round"
        transform="rotate(135 60 60)"
      />
      <motion.circle
        cx="60"
        cy="60"
        r="50"
        fill="none"
        stroke="#DEBB6E"
        strokeWidth="8"
        strokeLinecap="round"
        transform="rotate(135 60 60)"
        initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
        animate={{ strokeDasharray: `${filled} ${CIRCUMFERENCE}` }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
      <text x="60" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">
        {value}%
      </text>
      <text x="60" y="84" textAnchor="middle" fill="#A1A1AA" fontSize="10" fontFamily="Plus Jakarta Sans, sans-serif">
        complete
      </text>
    </svg>
  );
}
