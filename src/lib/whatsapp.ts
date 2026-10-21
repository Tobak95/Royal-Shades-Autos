import { CONTACT } from "./site";
import type { Car } from "@/types";

/** wa.me link; until a real number is set it opens WhatsApp's "choose a chat" screen */
export function whatsappLink(message: string): string {
  const number = CONTACT.whatsapp.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function carEnquiryLink(car: Car): string {
  return whatsappLink(
    `Hello Royal Shades Autos, I'm interested in the ${car.year} ${car.make} ${car.model} ${car.trim} (VIN ${car.vin}). Is it still available?`,
  );
}
