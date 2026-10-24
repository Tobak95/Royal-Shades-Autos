/** "2014", "Toyota", "Avalon XLE" → "2014-toyota-avalon-xle" */
export function slugify(...parts: (string | number)[]): string {
  return parts
    .join(" ")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Appends -2, -3 … until the slug isn't taken */
export function uniqueSlug(base: string, taken: (slug: string) => boolean): string {
  if (!taken(base)) return base;
  let n = 2;
  while (taken(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

/** Slug for a car, from make, model and year */
export function carSlugBase(car: { year: number; make: string; model: string }): string {
  return slugify(car.year, car.make, car.model) || "car";
}
