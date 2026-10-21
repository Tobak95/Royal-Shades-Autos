import type { Car } from "@/types";
import { availableCars } from "./cars/available";
import { incomingCars } from "./cars/incoming";
import { soldCars } from "./cars/sold";

/** 16 cars: 7 available, 5 incoming (each at a different point of its voyage), 4 sold */
export const mockCars: Car[] = [...availableCars, ...incomingCars, ...soldCars];
