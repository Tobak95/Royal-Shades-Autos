import { createContext } from "react";
import type { User } from "@/types";

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** True while the stored session is being restored */
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
