// Real backend calls for authentication (endpoints kept from the old app).
// Success is judged on the HTTP status (response.status), not a field in the body.
import { api } from "@/lib/api";
import { mapUser } from "@/lib/mapUser";
import type { User } from "@/types";

export class AuthError extends Error {}

function readToken(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;
  const d = data as Record<string, unknown>;
  const token = d.token ?? d.accessToken ?? (d.data as Record<string, unknown> | undefined)?.token;
  return typeof token === "string" ? token : null;
}

export interface LoginResult {
  token: string;
  user: User;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const response = await api.post<unknown>("/auth/login", { email, password });
  const token = readToken(response.data);
  const user = mapUser(response.data);
  if (response.status !== 200 || !token || !user) {
    throw new AuthError("We couldn't sign you in. Please try again.");
  }
  return { token, user };
}

export interface RegisterInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export async function register(input: RegisterInput): Promise<void> {
  const response = await api.post("/auth/register", input);
  if (response.status !== 201 && response.status !== 200) {
    throw new AuthError("We couldn't create your account. Please try again.");
  }
}

// React StrictMode runs effects twice in development; a verification token only
// works once, so concurrent calls for the same token share one request.
const verifyRequests = new Map<string, Promise<void>>();

export function verifyEmail(token: string): Promise<void> {
  let request = verifyRequests.get(token);
  if (!request) {
    request = api.post(`/auth/verify-email/${encodeURIComponent(token)}`).then((response) => {
      if (response.status !== 200) throw new AuthError("Verification failed.");
    });
    verifyRequests.set(token, request);
  }
  return request;
}

export async function resendVerificationEmail(email: string): Promise<void> {
  const response = await api.post("/auth/resend-verification-email", { email });
  if (response.status !== 200) throw new AuthError("We couldn't resend the email. Please try again.");
}

/**
 * The reset email links to /reset-password/:token on this site; the page sends the new
 * password to PATCH /auth/change-password with exactly { email, token, newPassword }.
 * A 404 from the backend means the link is invalid or expired.
 */
export async function resetPassword(email: string, token: string, newPassword: string): Promise<void> {
  const response = await api.patch("/auth/change-password", { email, token, newPassword });
  if (response.status < 200 || response.status >= 300) {
    throw new AuthError("We couldn't change your password. Please try again.");
  }
}

export async function forgotPassword(email: string): Promise<void> {
  const response = await api.post("/auth/forgot-password", { email });
  if (response.status !== 200) throw new AuthError("We couldn't send the reset link. Please try again.");
}
