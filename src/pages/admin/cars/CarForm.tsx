import type { ReactNode } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { carSlugBase } from "@/lib/slug";
import { STATUS_JOURNEY, STATUS_META } from "@/lib/status";
import { CarDetailsFields } from "./CarDetailsFields";
import { carFormSchema, type CarFormOutput, type CarFormValues } from "./carFormSchema";
import { ImageUrlsField } from "./ImageUrlsField";
import { ShipmentFields } from "./ShipmentFields";

interface CarFormProps {
  defaultValues: CarFormValues;
  /** The slug a saved car already has (kept unless make, model or year change) */
  currentSlug?: string;
  submitLabel: string;
  onSubmit: (values: CarFormOutput) => Promise<void>;
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-card bg-surface p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-extrabold">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

const STATUS_OPTIONS = STATUS_JOURNEY.map((s) => ({ value: s, label: STATUS_META[s].journeyLabel }));

export function CarForm({ defaultValues, currentSlug, submitLabel, onSubmit }: CarFormProps) {
  const { register, handleSubmit, control, formState } = useForm<CarFormValues, unknown, CarFormOutput>({
    resolver: zodResolver(carFormSchema),
    defaultValues,
  });
  const { errors, isSubmitting } = formState;
  const [status, make, model, year] = useWatch({ control, name: ["status", "make", "model", "year"] });

  const nameUnchanged = make === defaultValues.make && model === defaultValues.model && year === defaultValues.year;
  const slug = currentSlug && nameUnchanged ? currentSlug : carSlugBase({ make, model, year: Number.isFinite(year) ? year : 0 });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Section title="The car" description="What buyers see on cards and the car page.">
        <CarDetailsFields register={register} errors={errors} />
        <p className="text-sm text-muted">
          Page address: <span className="font-mono text-ink">/cars/{slug || "…"}</span>
          {currentSlug && !nameUnchanged && <span className="ml-1">(changes because the name changed)</span>}
        </p>
      </Section>

      <Section title="Status" description="Where the car is right now. Arriving cars appear on the Track page.">
        <Select label="Status" containerClassName="sm:max-w-xs" options={STATUS_OPTIONS} {...register("status")} />
        {status === "arriving" && (
          <Controller
            control={control}
            name="shipment"
            render={({ field }) => (
              <ShipmentFields
                value={field.value}
                onChange={field.onChange}
                errors={{
                  trackingNumber: errors.shipment?.trackingNumber?.message,
                  vesselName: errors.shipment?.vesselName?.message,
                  originPort: errors.shipment?.originPort?.message,
                  eta: errors.shipment?.eta?.message,
                }}
              />
            )}
          />
        )}
        {status === "sold" && <p className="text-sm text-muted">Sold cars get today's date as the sale date (kept if it was already sold).</p>}
        {status === "available" && (
          <Checkbox
            label={
              <span className="inline-flex items-center gap-1.5 text-ink">
                <Sparkles aria-hidden="true" className="size-4 text-gold" /> Show in home hero
              </span>
            }
            {...register("featured")}
          />
        )}
      </Section>

      <Section title="Photos">
        <ImageUrlsField control={control} errors={errors.images} />
      </Section>

      <Section title="Description and features">
        <Textarea label="Description" rows={5} {...register("description")} error={errors.description?.message} />
        <Textarea
          label="Features"
          rows={6}
          hint="One per line, e.g. Leather seats"
          {...register("features")}
          error={errors.features?.message}
        />
      </Section>

      <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap items-center justify-end gap-3 border-t border-line bg-admin-page/95 px-1 py-4 backdrop-blur">
        {Object.keys(errors).length > 0 && (
          <p role="alert" className="mr-auto text-sm font-medium text-sold">
            Check the highlighted fields.
          </p>
        )}
        <ButtonLink to="/admin/cars" variant="outline">
          Cancel
        </ButtonLink>
        <Button type="submit" variant="navy" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
