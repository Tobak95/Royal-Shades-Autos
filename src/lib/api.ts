import axios from "axios";
import { readToken } from "./storage";

const FALLBACK_API_URL = "https://royal-shades-autos-backend.onrender.com/api";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || FALLBACK_API_URL,
  headers: { "Content-Type": "application/json" },
  // Generous because a sleeping Render server can take ~50s to wake; without it, requests could hang forever
  timeout: 45_000,
});

api.interceptors.request.use((config) => {
  const token = readToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// The app registers what to do on an expired session (log out + go to /login).
// It's set from inside the router, because navigation needs the router.
let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void): () => void {
  unauthorizedHandler = handler;
  return () => {
    if (unauthorizedHandler === handler) unauthorizedHandler = null;
  };
}

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Only for signed-in requests outside /auth: a wrong password on the login form is also a 401
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config?.headers?.Authorization &&
      !error.config.url?.startsWith("/auth/")
    ) {
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);

/** No response at all: offline, flaky data, or the server is asleep / unreachable */
export function isNetworkError(error: unknown): boolean {
  return axios.isAxiosError(error) && !error.response;
}

/**
 * A friendly, specific message for any failed request. The backend's own `message` is used
 * for 4xx answers (it's usually specific, e.g. "Email already in use"); everything else
 * gets plain words about what happened and what to do next.
 */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong on our side. Please try again."): string {
  if (!axios.isAxiosError<{ message?: string }>(error)) return fallback;
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return "The server is taking a while to wake up. Give it a minute, then try again.";
  }
  if (!error.response) return "We couldn't reach the server. Check your data or Wi-Fi and try again.";
  const { status, data } = error.response;
  if (status === 429) return "That's a lot of tries in a short time. Wait a minute, then try again.";
  if (status >= 500) return "Something went wrong on our side, not yours. Please try again in a minute.";
  return data?.message ?? fallback;
}
