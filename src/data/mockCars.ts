import type { Car } from "@/types";
import { arrivingCars } from "./cars/arriving";
import { soldCars } from "./cars/sold";
import { yardCars } from "./cars/yard-cars";
import { yardSuvs } from "./cars/yard-suvs";

/**
 * 21 cars: 10 available, 2 inspection ("Coming soon"), 4 arriving (different voyage stages),
 * 1 arrived and 4 sold. Seven of them use the real dealership photos in public/cars/.
 */
export const mockCars: Car[] = [...yardSuvs, ...yardCars, ...arrivingCars, ...soldCars];
