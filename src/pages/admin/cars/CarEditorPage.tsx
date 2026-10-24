import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useQuery } from "@/hooks/useQuery";
import { useToast } from "@/hooks/useToast";
import { formatDate } from "@/lib/utils";
import { carName } from "@/lib/voyage";
import { AdminError, adminGetCar, createCar, shipmentFromDetails, suggestTrackingNumber, updateCar } from "@/services/adminCarService";
import type { Car } from "@/types";
import { AdminHeader } from "../AdminHeader";
import { CarForm } from "./CarForm";
import { toCarInput, toFormValues, type CarFormOutput } from "./carFormSchema";

/** /admin/cars/new and /admin/cars/:id/edit */
export default function CarEditorPage() {
  const { id } = useParams();
  const { data: car, loading } = useQuery(id ? `admin-car-${id}` : "admin-car-new", () => (id ? adminGetCar(id) : Promise.resolve(null)));

  if (id && loading) return <Skeleton className="h-[640px] rounded-panel" />;
  if (id && !car) {
    return (
      <EmptyState
        title="Car not found"
        description="It may have been deleted, or the demo data was reset."
        action={<ButtonLink to="/admin/cars" variant="navy">Back to cars</ButtonLink>}
      />
    );
  }
  // Keyed so the form starts fresh when switching between cars
  return <Editor key={car?.id ?? "new"} car={car ?? null} />;
}

function Editor({ car }: { car: Car | null }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [defaults] = useState(() => toFormValues(car, suggestTrackingNumber()));

  async function save(values: CarFormOutput) {
    const shipment = values.status === "arriving" ? shipmentFromDetails({ origin: values.origin, shipment: car?.shipment }, values.shipment) : car?.shipment;
    try {
      const input = toCarInput(values, shipment);
      const saved = car ? await updateCar(car.id, input) : await createCar(input);
      showToast(car ? `${carName(saved)} saved` : `${carName(saved)} added`);
      navigate("/admin/cars");
    } catch (error) {
      showToast(error instanceof AdminError ? error.message : "Couldn't save the car. Try again.", { tone: "error" });
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <ButtonLink to="/admin/cars" variant="ghost" size="sm" className="self-start">
        <ArrowLeft aria-hidden="true" className="size-4" /> All cars
      </ButtonLink>
      <AdminHeader
        title={car ? `Edit *${carName(car)}*` : "Add a *car*"}
        description={car ? `Added ${formatDate(car.createdAt)}` : "Fill in the details, add photos, then save."}
      />
      <CarForm defaultValues={defaults} currentSlug={car?.slug} submitLabel={car ? "Save changes" : "Add car"} onSubmit={save} />
    </div>
  );
}
