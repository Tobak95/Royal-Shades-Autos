import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import { ApiErrorAlert } from "@/components/feedback/ApiErrorAlert";
import { GarageIcon } from "@/components/icons";
import { Container } from "@/components/layout/Container";
import { AccentText } from "@/components/ui/AccentText";
import { PageLoader } from "@/components/feedback/PageLoader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/hooks/useAuth";
import { useGarage } from "@/hooks/useGarage";
import { useQuery } from "@/hooks/useQuery";
import { getGarageTotals } from "@/lib/pricing";
import { isReservable } from "@/lib/status";
import {
  localISODate,
  reservationSchema,
  type ReservationFormOutput,
  type ReservationFormValues,
} from "@/lib/validators";
import { createReservation, getCarsByIds } from "@/services/carService";
import { PaymentMethodField } from "./PaymentMethodField";
import { ReserveSummary } from "./ReserveSummary";

export default function ReservePage() {
  const { user } = useAuth();
  const garage = useGarage();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<unknown>(null);
  const { data, loading } = useQuery("reserve-cars", () => getCarsByIds(garage.carIds));
  const cars = (data ?? []).filter((c) => garage.has(c.id) && isReservable(c));
  const totals = getGarageTotals(cars);

  const { register, handleSubmit, control, formState } = useForm<ReservationFormValues, unknown, ReservationFormOutput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      phone: user?.phoneNumber ?? "",
      address: "",
      city: "Lagos",
      inspectionDate: "",
      paymentMethod: "bank_transfer",
      message: "",
    },
  });
  const paymentMethod = useWatch({ control, name: "paymentMethod" });
  const { errors, isSubmitting } = formState;

  async function onSubmit(values: ReservationFormOutput) {
    setSubmitError(null);
    try {
      const reservation = await createReservation({
        ...values,
        message: values.message || undefined,
        carIds: cars.map((c) => c.id),
        deposit: totals.deposit,
      });
      navigate("/thank-you", {
        replace: true,
        state: { reservationId: reservation.id, carNames: cars.map((c) => `${c.make} ${c.model}`) },
      });
      garage.clear();
    } catch (error) {
      setSubmitError(error);
    }
  }

  if (loading) return <PageLoader label="Loading your reservation" />;

  return (
    <Container className="pt-10 pb-24">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Your Garage", to: "/garage" }, { label: "Reserve" }]} />
      <h1 className="mt-3.5 text-[38px] font-extrabold tracking-[-0.025em] sm:text-[46px]">
        <AccentText text="Reserve your *cars*" />
      </h1>

      {cars.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={<GarageIcon size={24} />}
          title="Nothing to reserve yet"
          description="Add available or arriving cars to your garage first."
          action={<ButtonLink to="/cars">Explore the showroom</ButtonLink>}
        />
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-8 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="flex flex-col gap-7">
            <section aria-labelledby="contact-heading" className="rounded-card border border-line bg-surface p-6 sm:p-7">
              <h2 id="contact-heading" className="text-lg font-bold">Contact details</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Input label="Full name" autoComplete="name" {...register("fullName")} error={errors.fullName?.message} />
                <Input label="Phone number" type="tel" autoComplete="tel" placeholder="+234 801 234 5678" {...register("phone")} error={errors.phone?.message} />
                <Input label="Email" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} containerClassName="sm:col-span-2" />
                <Input label="Address" autoComplete="street-address" {...register("address")} error={errors.address?.message} containerClassName="sm:col-span-2" />
                <Input label="City" autoComplete="address-level2" {...register("city")} error={errors.city?.message} />
              </div>
            </section>

            <section aria-labelledby="inspection-heading" className="rounded-card border border-line bg-surface p-6 sm:p-7">
              <h2 id="inspection-heading" className="flex items-center gap-2 text-lg font-bold">
                <CalendarCheck aria-hidden="true" className="size-5 text-gold-text" /> Inspection details
              </h2>
              <div className="mt-5 grid gap-4">
                <Input
                  label="Preferred inspection date"
                  type="date"
                  min={localISODate(1)}
                  hint="For arriving cars, pick a date after the ETA. We'll confirm by phone."
                  {...register("inspectionDate")}
                  error={errors.inspectionDate?.message}
                  className="[color-scheme:dark] sm:max-w-xs"
                />
                <Textarea label="Message (optional)" rows={4} placeholder="Anything we should know?" {...register("message")} error={errors.message?.message} />
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-6 rounded-[22px] border border-line bg-surface p-6 shadow-[0_24px_50px_-36px_rgb(11_27_46/0.45)] sm:p-7 lg:sticky lg:top-28">
            <PaymentMethodField registration={register("paymentMethod")} selected={paymentMethod} />
            <ReserveSummary cars={cars} totals={totals} paymentMethod={paymentMethod} />
            <ApiErrorAlert
              error={submitError}
              fallback="We couldn't place your reservation. Your cars are still in your garage, so please try again or message us on WhatsApp."
              onRetry={handleSubmit(onSubmit)}
              retrying={isSubmitting}
            />
            <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
              {isSubmitting ? "Placing reservation…" : "Place reservation"}
            </Button>
          </div>
        </form>
      )}
    </Container>
  );
}
