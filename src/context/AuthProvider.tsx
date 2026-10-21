import { useCallback, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextValue } from "./AuthContext";
import { readStorage, readToken, removeStorage, STORAGE_KEYS, writeStorage, writeToken } from "@/lib/storage";
import type { User } from "@/types";

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.email === "string" && typeof v.fullName === "string";
}

interface Session {
  token: string | null;
  user: User | null;
}

// localStorage is synchronous, so the session is restored before the first render.
function restoreSession(): Session {
  const token = readToken();
  const user = readStorage(STORAGE_KEYS.user, isUser);
  return token && user ? { token, user } : { token: null, user: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(restoreSession);

  const login = useCallback((token: string, user: User) => {
    writeToken(token);
    writeStorage(STORAGE_KEYS.user, user);
    setSession({ token, user });
  }, []);

  const logout = useCallback(() => {
    removeStorage(STORAGE_KEYS.token);
    removeStorage(STORAGE_KEYS.user);
    setSession({ token: null, user: null });
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    setSession((prev) => {
      if (!prev.user) return prev;
      const user = { ...prev.user, ...patch };
      writeStorage(STORAGE_KEYS.user, user);
      return { ...prev, user };
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session.user,
      token: session.token,
      isAuthenticated: session.user !== null,
      isLoading: false,
      login,
      logout,
      updateUser,
    }),
    [session, login, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
