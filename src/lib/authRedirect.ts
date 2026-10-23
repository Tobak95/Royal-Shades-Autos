import type { Location } from "react-router-dom";

/** Router state passed to /login by ProtectedRoute and the 401 handler */
export interface LoginLocationState {
  from?: Pick<Location, "pathname" | "search" | "hash">;
  reason?: "expired";
}

function asLoginState(state: unknown): LoginLocationState {
  return typeof state === "object" && state !== null ? (state as LoginLocationState) : {};
}

/** Where to go after logging in: the page that sent the user here, or home */
export function getRedirectPath(state: unknown): string {
  const from = asLoginState(state).from;
  if (!from?.pathname || from.pathname.startsWith("/login")) return "/";
  return `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`;
}

export function sessionExpired(state: unknown): boolean {
  return asLoginState(state).reason === "expired";
}
