import { SOCIAL_LINKS, type SocialNetwork } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Brand marks drawn as simple outlines (lucide has no brand icons) */
function SocialIcon({ network }: { network: SocialNetwork }) {
  const common = { "aria-hidden": true, width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9 } as const;
  switch (network) {
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common} strokeLinecap="round">
          <path d="M14 3v11.5a3.5 3.5 0 11-3-3.46M14 3c.5 2.5 2.3 4.2 5 4.5" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common} strokeLinecap="round">
          <path d="M15 3h-2.5A3.5 3.5 0 009 6.5V21M6 11h8" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common} strokeLinejoin="round">
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
        </svg>
      );
  }
}

const circle =
  "flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition-[background-color,border-color,color,transform] duration-200";

/** Round social icons with a gold hover; networks without a URL yet are disabled buttons */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex gap-2.5", className)}>
      {SOCIAL_LINKS.map(({ network, label, url }) => (
        <li key={network}>
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${label} (opens in a new tab)`}
              className={cn(circle, "hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-navy")}
            >
              <SocialIcon network={network} />
            </a>
          ) : (
            <button type="button" disabled aria-label={`${label} (coming soon)`} title={`${label}: coming soon`} className={cn(circle, "opacity-45")}>
              <SocialIcon network={network} />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
