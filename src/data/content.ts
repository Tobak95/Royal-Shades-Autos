export interface Step {
  title: string;
  body: string;
}

export const IMPORT_STEPS: Step[] = [
  {
    title: "Choose your car",
    body: "Pick from the showroom or tell us the exact make, model and budget you want sourced.",
  },
  {
    title: "Reserve securely",
    body: "Place a reservation by bank transfer and get a tracking number straight away.",
  },
  {
    title: "Follow the voyage",
    body: "Watch every stage live, from the origin port to the vessel to customs in Lagos.",
  },
  {
    title: "Drive it home",
    body: "Inspect at our Lagos yard, complete payment and collect your keys.",
  },
];

export const THANK_YOU_STEPS: Step[] = [
  {
    title: "We confirm your reservation",
    body: "Our team calls or emails you within one working day to confirm the details and your inspection date.",
  },
  {
    title: "Your deposit clears",
    body: "Once your 10% deposit clears, every incoming car gets a tracking number you can follow on the Track page.",
  },
  {
    title: "Inspect and collect",
    body: "Visit our Lagos yard on your inspection date, pay the balance and drive home.",
  },
];

export const COMPANY = {
  vision: "To provide the best customer experience, becoming a preferred partner.",
  mission: "To give new life to vehicles by providing responsible automotive solutions.",
};

export const VALUES: Step[] = [
  {
    title: "Inspected before shipping",
    body: "Every car is checked abroad before we buy it, so there are no surprises when it lands in Lagos.",
  },
  {
    title: "Documented at every port",
    body: "Bills of lading, customs papers and photos at each stage, shared with you as the car moves.",
  },
  {
    title: "Clear, all-in pricing",
    body: "Showroom prices include shipping, duty and clearing. The price you see is the price you pay.",
  },
];
