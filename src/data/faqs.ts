import { DEPOSIT_PERCENT, POLICY } from "@/lib/site";

export interface FaqGroup {
  id: string;
  title: string;
  items: { id: string; question: string; answer: string }[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "importing",
    title: "Importing",
    items: [
      {
        id: "where-from",
        question: "Where do your cars come from?",
        answer:
          "We source cars from the USA, Canada, the UAE and Germany, through trusted auctions and dealers. We also sell carefully selected Nigerian-used cars.",
      },
      {
        id: "source-request",
        question: "Can you find a specific car for me?",
        answer:
          "Yes. Tell us the make, model, year range and budget, and we'll search our partner auctions and dealers and send you options before we buy.",
      },
      {
        id: "how-long",
        question: "How long does shipping to Lagos take?",
        answer:
          "Usually four to eight weeks from purchase to our yard, depending on the origin port and vessel schedule. You can follow every stage on the Track page.",
      },
    ],
  },
  {
    id: "customs",
    title: "Duty and customs",
    items: [
      {
        id: "duty-included",
        question: "Is customs duty included in the price?",
        answer: `Yes. ${POLICY.priceIncludesText} Cars clear at Tin Can Island or Apapa, and there are no extra charges when the car arrives.`,
      },
      {
        id: "papers",
        question: "Which documents do I get?",
        answer:
          "You receive the customs papers, the bill of lading, the original title or export certificate, and the purchase receipt, ready for registration.",
      },
    ],
  },
  {
    id: "payment",
    title: "Payment",
    items: [
      {
        id: "deposit",
        question: "How much do I pay to reserve a car?",
        answer: `A ${DEPOSIT_PERCENT} deposit holds the car for you. You pay the balance when you inspect and collect it at our Lagos yard.`,
      },
      {
        id: "methods",
        question: "How can I pay?",
        answer:
          "By bank transfer to our company account, or you can choose to pay at inspection. We never ask for payment to a personal account.",
      },
      {
        id: "refund",
        question: "Is the deposit refundable?",
        answer: `Yes. ${POLICY.refundText}`,
      },
    ],
  },
  {
    id: "inspection",
    title: "Inspection",
    items: [
      {
        id: "inspect-before",
        question: "Can I inspect the car before paying in full?",
        answer:
          "Always. Book an inspection date when you reserve, bring a mechanic if you like, and only pay the balance once you're happy.",
      },
      {
        id: "history",
        question: "Do you share the car's history?",
        answer: "Yes. We share the vehicle history report, auction photos and our own pre-shipping inspection notes.",
      },
    ],
  },
  {
    id: "delivery",
    title: "Delivery",
    items: [
      {
        id: "lagos-delivery",
        question: "Do you deliver?",
        answer: `${POLICY.freeLagosDelivery ? "Delivery within Lagos is free." : "We deliver within Lagos for a small fee."} We can also arrange delivery to other states at cost.`,
      },
      {
        id: "collection",
        question: "Where do I collect my car?",
        answer: "From our yard in Lagos. We'll confirm the address and a collection time once your car clears customs.",
      },
    ],
  },
];
