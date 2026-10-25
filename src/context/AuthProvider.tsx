import { useCallback, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextValue } from "./AuthContext";
import { mapUser } from "@/lib/mapUser";
import { clearSession, readSessionUser, readToken, saveSession, updateSessionUser } from "@/lib/storage";
import type { User } from "@/types";

interface Session {
  token: string | null;
  user: User | null;
}

// Storage is synchronous, so the session is restored before the first render.
// mapUser also upgrades users saved by the old app (e.g. `_id` instead of `id`).
function restoreSession(): Session {
  const token = readToken();
  const user = mapUser(readSessionUser());
  if (token && user) return { token, user };
  if (token || user) clearSession();
  return { token: null, user: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(restoreSession);

  const login = useCallback((token: string, user: User, remember = true) => {
    saveSession(token, user, remember);
    setSession({ token, user });
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession({ token: null, user: null });
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    setSession((prev) => {
      if (!prev.user) return prev;
      const user = { ...prev.user, ...patch };
      updateSessionUser(user);
      return { ...prev, user };
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session.user,
      token: session.token,
      isAuthenticated: session.user !== null,
      isAdmin: session.user?.role === "admin",
      isLoading: false,
      login,
      logout,
      updateUser,
    }),
    [session, login, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
