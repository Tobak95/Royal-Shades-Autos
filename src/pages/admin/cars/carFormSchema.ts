import { z } from "zod";
import { STAGE_ORDER } from "@/data/shipmentStages";
import { localISODate } from "@/lib/validators";
import type { BodyType, Car, CarInput, CarStatus, Condition, DestinationPort, FuelType, Origin, StageKey, Transmission } from "@/types";

// Literal tuples for zod enums; `satisfies` keeps them in step with the Car types
export const STATUSES = ["arriving", "arrived", "inspection", "available", "sold"] as const satisfies readonly CarStatus[];
export const BODY_TYPE_OPTIONS = ["SUV", "Sedan", "Minivan", "Coupe", "Hatchback", "Pickup", "Bus"] as const satisfies readonly BodyType[];
export const CONDITION_OPTIONS = ["Foreign used", "Brand new", "Nigerian used"] as const satisfies readonly Condition[];
export const ORIGIN_OPTIONS = ["USA", "Canada", "UAE", "Germany", "Nigeria"] as const satisfies readonly Origin[];
export const TRANSMISSION_OPTIONS = ["Automatic", "Manual"] as const satisfies readonly Transmission[];
export const FUEL_OPTIONS = ["Petrol", "Diesel", "Hybrid", "Electric"] as const satisfies readonly FuelType[];
export const PORT_OPTIONS = ["Tin Can Island", "Apapa"] as const satisfies readonly DestinationPort[];
const STAGE_KEYS = STAGE_ORDER as [StageKey, ...StageKey[]];

const text = (label: string) => z.string().trim().min(1, `${label} is required`);
const number = (label: string) => z.number({ error: `Enter the ${label.toLowerCase()}` });
const thisYear = new Date().getFullYear();

/** URL or site path (the real photos live at /cars/<name>.jpg) */
const imageUrl = z
  .string()
  .trim()
  .refine((v) => /^https?:\/\/\S+$/.test(v) || /^\/\S+$/.test(v), "Use a full image URL (https://…) or a path like /cars/photo.jpg");

export const shipmentDetailsSchema = z.object({
  trackingNumber: z.string().trim(),
  vesselName: z.string().trim(),
  originPort: z.string().trim(),
  destinationPort: z.enum(PORT_OPTIONS),
  eta: z.string(),
  current: z.enum(STAGE_KEYS),
});

export type ShipmentFormValues = z.infer<typeof shipmentDetailsSchema>;

/** Shipment details are only required when the car is (or becomes) "arriving" */
export function shipmentIssues(s: ShipmentFormValues): { field: keyof ShipmentFormValues; message: string }[] {
  const issues: { field: keyof ShipmentFormValues; message: string }[] = [];
  if (!/^[A-Z0-9-]{4,}$/i.test(s.trackingNumber)) issues.push({ field: "trackingNumber", message: "Enter a tracking number, e.g. RS-24817" });
  if (!s.vesselName) issues.push({ field: "vesselName", message: "Vessel is required" });
  if (!s.originPort) issues.push({ field: "originPort", message: "Origin port is required" });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s.eta)) issues.push({ field: "eta", message: "Choose the ETA" });
  return issues;
}

export const carFormSchema = z
  .object({
    make: text("Make"),
    model: text("Model"),
    year: number("Year").int().min(1980, "Check the year").max(thisYear + 1, "Check the year"),
    trim: text("Trim"),
    price: number("Price").positive("Price must be above 0"),
    mileage: number("Mileage").min(0, "Mileage can't be negative"),
    mileageUnit: z.enum(["mi", "km"]),
    transmission: z.enum(TRANSMISSION_OPTIONS),
    fuelType: z.enum(FUEL_OPTIONS),
    engine: text("Engine"),
    color: text("Colour"),
    bodyType: z.enum(BODY_TYPE_OPTIONS),
    seats: number("Seats").int().min(1, "At least 1 seat").max(60, "Check the seats"),
    vin: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-HJ-NPR-Z0-9]{11,17}$/, "11–17 letters and numbers (VINs never use I, O or Q)"),
    condition: z.enum(CONDITION_OPTIONS),
    origin: z.enum(ORIGIN_OPTIONS),
    status: z.enum(STATUSES),
    images: z.array(z.object({ url: imageUrl })).min(1, "Add at least one photo"),
    description: text("Description").min(20, "Write at least a sentence or two"),
    /** One feature per line */
    features: z.string(),
    featured: z.boolean(),
    shipment: shipmentDetailsSchema,
  })
  .superRefine((v, ctx) => {
    if (v.status !== "arriving") return;
    for (const issue of shipmentIssues(v.shipment)) {
      ctx.addIssue({ code: "custom", path: ["shipment", issue.field], message: issue.message });
    }
  });

export type CarFormValues = z.input<typeof carFormSchema>;
export type CarFormOutput = z.output<typeof carFormSchema>;

export function emptyShipment(trackingNumber: string, existing?: Car["shipment"]): ShipmentFormValues {
  const current = existing?.stages.find((s) => s.current)?.key ?? "purchased";
  return {
    trackingNumber: existing?.trackingNumber ?? trackingNumber,
    vesselName: existing?.vesselName ?? "",
    originPort: existing?.originPort ?? "",
    destinationPort: existing?.destinationPort ?? "Tin Can Island",
    eta: existing?.eta ?? localISODate(30),
    current,
  };
}

/** Form defaults: blank for a new car, or the car's current values when editing */
export function toFormValues(car: Car | null, suggestedTracking: string): CarFormValues {
  if (!car) {
    return {
      make: "",
      model: "",
      year: thisYear - 3,
      trim: "",
      price: Number.NaN,
      mileage: Number.NaN,
      mileageUnit: "mi",
      transmission: "Automatic",
      fuelType: "Petrol",
      engine: "",
      color: "",
      bodyType: "SUV",
      seats: 5,
      vin: "",
      condition: "Foreign used",
      origin: "USA",
      status: "inspection",
      images: [],
      description: "",
      features: "",
      featured: false,
      shipment: emptyShipment(suggestedTracking),
    };
  }
  return {
    ...car,
    images: car.images.map((url) => ({ url })),
    features: car.features.join("\n"),
    featured: Boolean(car.featured),
    shipment: emptyShipment(suggestedTracking, car.shipment),
  };
}

/** Form output → CarInput (the shipment is built by the service for arriving cars) */
export function toCarInput(values: CarFormOutput, shipment: Car["shipment"]): CarInput {
  const { images, features, shipment: _details, ...rest } = values;
  void _details;
  return {
    ...rest,
    images: images.map((i) => i.url),
    features: features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean),
    shipment,
  };
}
