export const BRAND = {
  name: "The Royal Shades Autos Limited",
  shortName: "Royal Shades Autos",
  tagline: "Premium imported cars for Lagos, sourced abroad and tracked to your driveway.",
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
} as const;

/** "10%", derived from POLICY.depositRate */
export const DEPOSIT_PERCENT = `${Math.round(POLICY.depositRate * 100)}%`;

export interface NavItem {
  label: string;
  to: string;
}

export const MAIN_NAV: NavItem[] = [
  { label: "Showroom", to: "/cars" },
  { label: "Track", to: "/track" },
  { label: "How it works", to: "/#how" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export interface FooterColumn {
  heading: string;
  links: NavItem[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Showroom",
    links: [
      { label: "Available cars", to: "/cars?status=available" },
      { label: "Incoming cars", to: "/cars?status=incoming" },
      { label: "Recently sold", to: "/cars?status=sold" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Track your car", to: "/track" },
      { label: "How importing works", to: "/#how" },
      { label: "FAQs", to: "/faqs" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Privacy policy", to: "/privacy" },
    ],
  },
];
