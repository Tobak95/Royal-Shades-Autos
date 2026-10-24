export const BRAND = {
  name: "The Royal Shades Autos Limited",
  shortName: "Royal Shades Autos",
  tagline: "Buy, sell, swap and import cars in Lagos, with every step done properly.",
} as const;

/** Business details not supplied yet; keep the brackets until they are */
export const CONTACT = {
  address: "[Showroom address], Lagos",
  phone: "[Phone number]",
  email: "[Email address]",
  /** International format without "+", used for wa.me links */
  whatsapp: "[WhatsApp number]",
  hours: "[Opening hours]",
} as const;

/**
 * Business policies shown across the site. The owner should confirm these;
 * change them here and every page, total and FAQ follows.
 */
export const POLICY = {
  /** Share of the car price paid to reserve it */
  depositRate: 0.1,
  refundText: "Fully refundable if the car fails inspection on arrival.",
  priceIncludesText: "Price includes shipping, duty and clearing.",
  freeLagosDelivery: true,
  /** How quickly the team replies, used in sentences: "within one working day" */
  responseTime: "one working day",
  /** Sell and swap: hours from inspection to our offer */
  offerWithinHours: 72,
} as const;

/** "10%", derived from POLICY.depositRate */
export const DEPOSIT_PERCENT = `${Math.round(POLICY.depositRate * 100)}%`;

export interface NavItem {
  label: string;
  to: string;
}

export const MAIN_NAV: NavItem[] = [
  { label: "Buy a car", to: "/cars" },
  { label: "Swap", to: "/swap" },
  { label: "Sell", to: "/sell" },
  { label: "Track import", to: "/track" },
  { label: "About", to: "/about" },
];

export interface FooterColumn {
  heading: string;
  links: NavItem[];
}

/** Link columns in the footer; "Visit or call" is built from CONTACT */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Cars",
    links: [
      { label: "Buy a car", to: "/cars" },
      { label: "Swap your car", to: "/swap" },
      { label: "Sell your car", to: "/sell" },
      { label: "Track an import", to: "/track" },
      { label: "Recently sold", to: "/cars?status=sold" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", to: "/about" },
      { label: "How it works", to: "/about#how-it-works" },
      { label: "FAQs", to: "/faqs" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

export type SocialNetwork = "instagram" | "tiktok" | "facebook" | "youtube";

/** Profile URLs not supplied yet; empty ones show as disabled icons */
export const SOCIAL_LINKS: { network: SocialNetwork; label: string; url: string }[] = [
  { network: "instagram", label: "Instagram", url: "" },
  { network: "tiktok", label: "TikTok", url: "" },
  { network: "facebook", label: "Facebook", url: "" },
  { network: "youtube", label: "YouTube", url: "" },
];
