import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ArcLoader } from "@/components/ui/ArcLoader";
import { useAuth } from "@/hooks/useAuth";

/** Waits for the session to restore, then sends guests to /login and back here afterwards */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <ArcLoader fullScreen label="Checking your session" />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <>{children}</>;
}
