import axios from "axios";
import { readToken } from "./storage";

const FALLBACK_API_URL = "https://royal-shades-autos-backend.onrender.com/api";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || FALLBACK_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = readToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Pulls the backend's `message` out of an axios error, with a readable fallback */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}
