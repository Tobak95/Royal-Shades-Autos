import { useContext } from "react";
import { GarageContext, type GarageContextValue } from "@/context/GarageContext";

export function useGarage(): GarageContextValue {
  const ctx = useContext(GarageContext);
  if (!ctx) throw new Error("useGarage must be used inside <GarageProvider>");
  return ctx;
}
