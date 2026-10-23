import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ArcLoader } from "@/components/ui/ArcLoader";
import { useAuth } from "@/hooks/useAuth";
import type { LoginLocationState } from "@/lib/authRedirect";

/** Waits for the session to restore, then sends guests to /login, which returns them here afterwards */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <ArcLoader fullScreen label="Checking your session" />;
  if (!isAuthenticated) {
    const state: LoginLocationState = { from: location };
    return <Navigate to="/login" replace state={state} />;
  }
  return <>{children}</>;
}
