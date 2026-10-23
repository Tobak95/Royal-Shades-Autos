import { createContext } from "react";
import type { User } from "@/types";

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  /** True while the stored session is being restored */
  isLoading: boolean;
  /** `remember` keeps the session after the browser closes ("Keep me signed in") */
  login: (token: string, user: User, remember?: boolean) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
