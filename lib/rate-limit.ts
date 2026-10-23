interface WindowEntry {
  count: number;
  windowStart: number;
}

const windows = new Map<string, WindowEntry>();

/**
 * Simple in-memory fixed-window rate limiter.
 * Returns whether this call is allowed and how many calls remain in the
 * current window for `key`.
 */
export function rateLimit(
  key: string,
  limit = 20,
  windowMs = 60000,
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const entry = windows.get(key);

  if (!entry || now - entry.windowStart >= windowMs) {
    windows.set(key, { count: 1, windowStart: now });
    return { ok: limit >= 1, remaining: Math.max(0, limit - 1) };
  }

  entry.count += 1;
  return {
    ok: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
  };
}
