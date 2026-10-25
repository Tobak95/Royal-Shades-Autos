// Browser storage can throw (private mode, quota, blocked storage), so every access is guarded.

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

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

// ── Auth session ────────────────────────────────────────────────────────────
// "Keep me signed in" → localStorage (survives restarts); otherwise sessionStorage
// (cleared when the browser closes). Keys match the old app so existing sessions survive.

function stores(): Storage[] {
  try {
    return [localStorage, sessionStorage];
  } catch {
    return [];
  }
}

/** The storage that currently holds the session, if any */
function sessionStore(): Storage | null {
  for (const store of stores()) {
    try {
      if (store.getItem(STORAGE_KEYS.token)) return store;
    } catch {
      // Try the next store
    }
  }
  return null;
}

export function readToken(): string | null {
  try {
    return sessionStore()?.getItem(STORAGE_KEYS.token) ?? null;
  } catch {
    return null;
  }
}

/** Raw stored user; validate it with mapUser before trusting it */
export function readSessionUser(): unknown {
  try {
    const raw = sessionStore()?.getItem(STORAGE_KEYS.user);
    return raw ? (JSON.parse(raw) as unknown) : null;
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: unknown, persistent: boolean): void {
  clearSession();
  try {
    const store = persistent ? localStorage : sessionStorage;
    store.setItem(STORAGE_KEYS.token, token);
    store.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  } catch {
    // Signed in for this page view only
  }
}

export function updateSessionUser(user: unknown): void {
  try {
    sessionStore()?.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  } catch {
    // Ignore
  }
}

export function clearSession(): void {
  for (const store of stores()) {
    try {
      store.removeItem(STORAGE_KEYS.token);
      store.removeItem(STORAGE_KEYS.user);
    } catch {
      // Ignore
    }
  }
}
