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

/** Pulls the backend's `message` out of an axios error, with a readable fallback */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return "The server is taking too long to respond. It may be starting up, so please try again in a minute.";
    }
    if (!error.response) return "We couldn't reach the server. Check your connection and try again.";
    return error.response.data?.message ?? fallback;
  }
  return fallback;
}
