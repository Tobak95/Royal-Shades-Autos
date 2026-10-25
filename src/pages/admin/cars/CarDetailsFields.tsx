import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  BODY_TYPE_OPTIONS,
  CONDITION_OPTIONS,
  FUEL_OPTIONS,
  ORIGIN_OPTIONS,
  TRANSMISSION_OPTIONS,
  type CarFormValues,
} from "./carFormSchema";

interface CarDetailsFieldsProps {
  register: UseFormRegister<CarFormValues>;
  errors: FieldErrors<CarFormValues>;
}

const options = (values: readonly string[]) => values.map((v) => ({ value: v, label: v }));

/** Make, model, year, price and the spec sheet */
export function CarDetailsFields({ register, errors }: CarDetailsFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4 lg:grid-cols-4">
        <Input label="Make" placeholder="e.g. Toyota" {...register("make")} error={errors.make?.message} />
        <Input label="Model" placeholder="e.g. Avalon" {...register("model")} error={errors.model?.message} />
        <Input label="Year" type="number" inputMode="numeric" {...register("year", { valueAsNumber: true })} error={errors.year?.message} />
        <Input label="Trim" placeholder="e.g. XLE Premium" {...register("trim")} error={errors.trim?.message} />
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4 lg:grid-cols-4">
        <Input
          label="Price (₦)"
          type="number"
          inputMode="numeric"
          min={0}
          step={50000}
          placeholder="e.g. 18500000"
          {...register("price", { valueAsNumber: true })}
          error={errors.price?.message}
        />
        <Input
          label="Mileage"
          type="number"
          inputMode="numeric"
          min={0}
          {...register("mileage", { valueAsNumber: true })}
          error={errors.mileage?.message}
        />
        <Select label="Mileage unit" options={[{ value: "mi", label: "Miles" }, { value: "km", label: "Kilometres" }]} {...register("mileageUnit")} />
        <Input
          label="VIN"
          placeholder="17 characters"
          autoCapitalize="characters"
          className="uppercase"
          {...register("vin")}
          error={errors.vin?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4 lg:grid-cols-4">
        <Select label="Body type" options={options(BODY_TYPE_OPTIONS)} {...register("bodyType")} />
        <Select label="Transmission" options={options(TRANSMISSION_OPTIONS)} {...register("transmission")} />
        <Select label="Fuel" options={options(FUEL_OPTIONS)} {...register("fuelType")} />
        <Input label="Engine" placeholder="e.g. 3.5L V6" {...register("engine")} error={errors.engine?.message} />
        <Input label="Colour" placeholder="e.g. Midnight Black" {...register("color")} error={errors.color?.message} />
        <Input label="Seats" type="number" inputMode="numeric" min={1} {...register("seats", { valueAsNumber: true })} error={errors.seats?.message} />
        <Select label="Condition" options={options(CONDITION_OPTIONS)} {...register("condition")} />
        <Select label="Origin" options={options(ORIGIN_OPTIONS)} {...register("origin")} />
      </div>
    </>
  );
}
