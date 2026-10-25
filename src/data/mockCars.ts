import type { Car } from "@/types";
import { arrivingCars } from "./cars/arriving";
import { soldCars } from "./cars/sold";
import { yardCars } from "./cars/yard-cars";
import { yardSuvs } from "./cars/yard-suvs";

/** Cars switched on for the home hero carousel ("Show in home hero" in the admin) */
const HERO_CARS = new Set(["car-avalon-2014", "car-sonata-sport-2016", "car-gle-2020", "car-camry-2021", "car-hilux-2023"]);

/**
 * 21 cars: 10 available, 2 inspection ("Coming soon"), 4 arriving (different voyage stages),
 * 1 arrived and 4 sold. Seven of them use the real dealership photos in public/cars/.
 */
export const mockCars: Car[] = [...yardSuvs, ...yardCars, ...arrivingCars, ...soldCars].map((car) =>
  HERO_CARS.has(car.id) ? { ...car, featured: true } : car,
);
