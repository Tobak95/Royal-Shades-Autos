import { createContext } from "react";

export type ToastTone = "success" | "info" | "error";

export interface ToastOptions {
  tone?: ToastTone;
  /** Milliseconds before it hides itself (default 3000) */
  duration?: number;
}

export interface ToastContextValue {
  showToast: (message: string, options?: ToastOptions) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
