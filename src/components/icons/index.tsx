// Small line icons taken from the approved mockups where Lucide has no close match.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 18, children, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function GarageIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M8 20v-5h8v5" />
    </Svg>
  );
}

export function ShipIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 17l2 3h14l2-3" />
      <path d="M5 17V11h14v6" />
      <path d="M12 11V4M9 7h6" />
    </Svg>
  );
}

export function FuelIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20V5a1 1 0 011-1h8a1 1 0 011 1v15M3 20h12M14 9h2.5a1.5 1.5 0 011.5 1.5V17a1.5 1.5 0 003 0V8l-3-3M7 8h4" />
    </Svg>
  );
}

export function GearboxIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="6" r="2" />
      <circle cx="12" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M6 8v8M12 8v8M18 8v4H6" />
    </Svg>
  );
}

export function GaugeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 16a8 8 0 1116 0" />
      <path d="M12 16l4-5" />
    </Svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M21 11.5a8.4 8.4 0 01-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1121 11.5z" />
    </Svg>
  );
}
