import { createContext } from "react";

/**
 * success: green bar · warning: gentle gold (e.g. session ended) · news: navy, for good news
 * (a car docked, an offer arrived) · error: red · info: neutral
 */
export type ToastTone = "success" | "warning" | "news" | "error" | "info";

export interface ToastOptions {
  tone?: ToastTone;
  /** Second, lighter line after the bold message, e.g. the car's name */
  detail?: string;
  /** Milliseconds before it hides itself (default 3000, errors 5000) */
  duration?: number;
}

export interface ToastContextValue {
  showToast: (message: string, options?: ToastOptions) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
