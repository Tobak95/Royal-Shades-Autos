import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";

/** Logs out, confirms with a toast and goes home. The garage and wishlist are kept on purpose. */
export function useSignOut() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  return useCallback(() => {
    // Navigate in the same update as logout so a protected page never flashes its login redirect
    logout();
    navigate("/");
    showToast("You've been signed out", { tone: "info" });
  }, [logout, navigate, showToast]);
}
