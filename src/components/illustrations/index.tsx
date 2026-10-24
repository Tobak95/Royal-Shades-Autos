// Small navy & gold line drawings from design-reference-v3/human-touches.html.
// All decorative (aria-hidden); the text beside them carries the meaning.
// Animations use CSS keyframes, which the global reduced-motion rule turns off.

const NAVY = "#0B1B2E";
const GOLD = "#D4AF5A";

/** A car rolling past a magnifying glass (no search results) */
export function SearchCarDrawing() {
  return (
    <svg aria-hidden="true" width="220" height="130" viewBox="0 0 220 130" fill="none" className="max-w-full">
      <path d="M10 112h200" stroke="#CBD2DC" strokeWidth="2" strokeDasharray="4 6" />
      <g className="animate-drive">
        <path
          d="M30 100 L34 84 Q38 74 50 72 L74 68 Q86 54 104 52 L132 52 Q146 52 156 64 L166 74 Q182 76 186 86 L186 100 Z"
          fill="#F5F6F8"
          stroke={NAVY}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M84 70 Q94 58 108 57 L120 57 L120 70 Z M126 57 L134 57 Q144 58 150 68 L126 70 Z" fill="#E3E6EB" />
        <circle cx="62" cy="102" r="12" fill="#FFFFFF" stroke={NAVY} strokeWidth="2.5" />
        <circle cx="158" cy="102" r="12" fill="#FFFFFF" stroke={NAVY} strokeWidth="2.5" />
      </g>
      <circle cx="168" cy="38" r="22" fill="#FFFFFF" stroke={GOLD} strokeWidth="4" />
      <path d="M184 54l16 16" stroke={GOLD} strokeWidth="7" strokeLinecap="round" />
      <path d="M160 32q8-6 14 2" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** An open garage with a gold lamp and a little plant */
export function GarageDrawing() {
  return (
    <svg aria-hidden="true" width="190" height="120" viewBox="0 0 190 120" fill="none" className="max-w-full">
      <path d="M20 112V48L95 12l75 36v64" stroke={NAVY} strokeWidth="3" strokeLinejoin="round" fill="#F5F6F8" />
      <rect x="44" y="56" width="102" height="56" rx="4" fill="#FFFFFF" stroke={NAVY} strokeWidth="2.5" />
      <path d="M44 70h102M44 84h102M44 98h102" stroke="#CBD2DC" strokeWidth="2" />
      <circle cx="95" cy="34" r="8" fill={GOLD} />
      <path d="M150 104q10-14 20 0" stroke="#1F9D61" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M158 104q4-12 10-4" stroke="#1F9D61" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** A heart-shaped tag hanging from a car key (empty wishlist) */
export function WishlistDrawing() {
  return (
    <svg aria-hidden="true" width="190" height="120" viewBox="0 0 190 120" fill="none" className="max-w-full">
      <path d="M10 112h170" stroke="#CBD2DC" strokeWidth="2" strokeDasharray="4 6" />
      <rect x="40" y="38" width="44" height="64" rx="14" fill="#F5F6F8" stroke={NAVY} strokeWidth="2.5" />
      <circle cx="62" cy="56" r="6" fill="#FFFFFF" stroke={NAVY} strokeWidth="2.5" />
      <path d="M54 80h16M54 88h10" stroke="#CBD2DC" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M84 56 C104 56 108 40 120 40" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" />
      <g className="animate-sway origin-[120px_40px]">
        <path
          d="M120 50 C112 40 98 44 98 56 C98 70 120 82 120 82 C120 82 142 70 142 56 C142 44 128 40 120 50 Z"
          fill={GOLD}
          stroke={NAVY}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>
      <circle cx="150" cy="30" r="3" fill={GOLD} />
      <circle cx="160" cy="48" r="2.5" fill="#1F9D61" />
    </svg>
  );
}

/** A clipboard with two swap arrows (no sell or swap requests) */
export function RequestsDrawing() {
  return (
    <svg aria-hidden="true" width="190" height="120" viewBox="0 0 190 120" fill="none" className="max-w-full">
      <rect x="52" y="14" width="86" height="98" rx="10" fill="#F5F6F8" stroke={NAVY} strokeWidth="2.5" />
      <rect x="76" y="8" width="38" height="14" rx="5" fill={GOLD} stroke={NAVY} strokeWidth="2.5" />
      <path d="M68 42h54M68 56h40" stroke="#CBD2DC" strokeWidth="3" strokeLinecap="round" />
      <path d="M72 80h42l-8-8M118 94H76l8 8" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="152" cy="30" r="3" fill={GOLD} />
      <circle cx="36" cy="60" r="2.5" fill="#2F6FDB" />
    </svg>
  );
}

/** A gold "404" road sign swinging on its post, on a dark background */
export function RoadSignDrawing() {
  return (
    <svg aria-hidden="true" width="200" height="150" viewBox="0 0 200 150" fill="none" className="max-w-full">
      <path d="M0 140 Q100 110 200 140" stroke="rgb(255 255 255 / 0.25)" strokeWidth="2" />
      <path d="M70 140 L95 118 M130 140 L105 118" stroke="rgb(255 255 255 / 0.18)" strokeWidth="2" />
      <g className="animate-sway origin-[100px_140px]">
        <rect x="96" y="44" width="8" height="96" rx="2" fill="#AEB8C6" />
        <path d="M40 22 H150 L166 40 L150 58 H40 Z" fill={GOLD} />
        <text x="98" y="48" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="26" fontWeight="800" fill={NAVY}>
          404
        </text>
      </g>
    </svg>
  );
}

/** Gold check in a soft ring with confetti dots */
export function SuccessCheckDrawing() {
  return (
    <svg aria-hidden="true" width="92" height="92" viewBox="0 0 92 92" fill="none">
      <circle cx="46" cy="46" r="42" fill="#FBF3E1" />
      <circle cx="46" cy="46" r="32" fill={GOLD} />
      <path d="M32 47l10 10 18-20" stroke={NAVY} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="20" r="3" fill={GOLD} />
      <circle cx="82" cy="16" r="2.5" fill="#1F9D61" />
      <circle cx="84" cy="70" r="3" fill="#2F6FDB" />
      <circle cx="8" cy="66" r="2" fill="#B23B35" />
    </svg>
  );
}

/** Envelope with a gold "1" badge */
export function EnvelopeDrawing() {
  return (
    <svg aria-hidden="true" width="74" height="56" viewBox="0 0 74 56" fill="none">
      <rect x="3" y="8" width="60" height="44" rx="8" fill="#FBF3E1" stroke={NAVY} strokeWidth="2.5" />
      <path d="M5 12l28 20 28-20" stroke={NAVY} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="62" cy="10" r="9" fill={GOLD} />
      <text x="62" y="14" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="800" fill={NAVY}>
        1
      </text>
    </svg>
  );
}
