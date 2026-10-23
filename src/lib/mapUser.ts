import type { User, UserRole } from "@/types";

type Raw = Record<string, unknown>;

const isObject = (value: unknown): value is Raw => typeof value === "object" && value !== null;

function firstString(raw: Raw, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }
  return undefined;
}

/**
 * The single place that turns a backend user into our User type.
 * Handles Mongo-style `_id`, alternate field names, and users saved by the old app.
 * Returns null if the essentials (id and email) are missing.
 */
export function mapUser(value: unknown): User | null {
  if (!isObject(value)) return null;
  const raw = isObject(value.user) ? value.user : value;

  const id = firstString(raw, ["id", "_id", "userId"]);
  const email = firstString(raw, ["email"]);
  if (!id || !email) return null;

  const role: UserRole = raw.role === "admin" || raw.isAdmin === true ? "admin" : "customer";
  const verified = raw.isVerified ?? raw.verified ?? raw.emailVerified;

  return {
    id,
    email,
    fullName: firstString(raw, ["fullName", "fullname", "name"]) ?? email.split("@")[0],
    phoneNumber: firstString(raw, ["phoneNumber", "phone", "phone_number"]) ?? "",
    role,
    isVerified: verified === true || verified === "true",
    avatar: firstString(raw, ["avatar", "avatarUrl", "photo"]),
    createdAt: firstString(raw, ["createdAt", "created_at"]) ?? new Date().toISOString(),
  };
}
