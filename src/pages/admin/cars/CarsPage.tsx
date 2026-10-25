import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { AdminHeader } from "../AdminHeader";
import { ListedCars } from "./ListedCars";

export default function CarsPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminHeader
        title="Cars"
        crumb="cars"
        actions={
          <ButtonLink to="/admin/cars/new" variant="navy" size="sm">
            <Plus aria-hidden="true" className="size-4" /> Add car
          </ButtonLink>
        }
      />
      <ListedCars searchable />
    </div>
  );
}
