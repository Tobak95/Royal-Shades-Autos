import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import type { Car } from "@/types";
import { CarCard } from "./CarCard";

export function CarCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-graphite">
      <Skeleton className="h-[196px] rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-11 w-28" />
        </div>
      </div>
    </div>
  );
}

interface CarGridProps {
  cars: Car[] | undefined;
  loading: boolean;
  skeletonCount?: number;
  /** Shown when loading has finished and there are no cars */
  empty?: ReactNode;
  className?: string;
}

const gridClass = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

export function CarGrid({ cars, loading, skeletonCount = 6, empty, className }: CarGridProps) {
  if (loading) {
    return (
      <div className={cn(gridClass, className)} aria-busy="true" aria-label="Loading cars">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <CarCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (!cars?.length) return <>{empty}</>;
  return (
    <div className={cn(gridClass, className)}>
      {cars.map((car, index) => (
        <CarCard key={car.id} car={car} eagerImage={index < 3} />
      ))}
    </div>
  );
}
