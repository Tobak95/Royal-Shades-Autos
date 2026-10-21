// localStorage can throw (private mode, quota, blocked storage), so every access is guarded.

export const STORAGE_KEYS = {
  token: "accessToken",
  user: "user",
  garage: "rsa.garage",
  wishlist: "rsa.wishlist",
} as const;

export function readStorage<T>(key: string, isValid: (value: unknown) => value is T): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: state still works for this session.
  }
}

export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore: nothing to clean up if storage is unavailable.
  }
}

/** The token is stored as a raw string (not JSON) to stay compatible with the old app */
export function readToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.token);
  } catch {
    return null;
  }
}

export function writeToken(token: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.token, token);
  } catch {
    // Ignore
  }
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
