import { CONTACT } from "./site";

/** Business details still show "[Phone number]" style placeholders until the owner supplies them */
export function isProvided(value: string): boolean {
  return value.trim() !== "" && !/\[.*\]/.test(value);
}

/** tel: link, or null while the number is a placeholder */
export function phoneHref(): string | null {
  const digits = CONTACT.phone.replace(/[^\d+]/g, "");
  return isProvided(CONTACT.phone) && digits ? `tel:${digits}` : null;
}

export function emailHref(): string | null {
  return isProvided(CONTACT.email) ? `mailto:${CONTACT.email}` : null;
}

/** Google Maps directions to the showroom, or null while the address is a placeholder */
export function directionsHref(): string | null {
  return isProvided(CONTACT.address)
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONTACT.address)}`
    : null;
}
