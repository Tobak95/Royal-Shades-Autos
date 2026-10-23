import { useEffect, useEffectEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { setUnauthorizedHandler } from "@/lib/api";
import type { LoginLocationState } from "@/lib/authRedirect";

/** When the API answers 401 to a signed-in request: log out and send the user to /login, then back */
export function SessionGuard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleUnauthorized = useEffectEvent(() => {
    logout();
    const state: LoginLocationState = { from: location, reason: "expired" };
    navigate("/login", { replace: true, state });
  });

  useEffect(() => setUnauthorizedHandler(() => handleUnauthorized()), []);

  return null;
}
