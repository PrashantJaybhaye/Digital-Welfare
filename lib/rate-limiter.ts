/**
 * In-memory sliding-window rate limiter.
 * Protects endpoints from DDoS, brute-force, and automated scraping abuse.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      const activeTimestamps = record.timestamps.filter(ts => now - ts < 15 * 60 * 1000);
      if (activeTimestamps.length === 0) {
        rateLimitStore.delete(key);
      } else {
        record.timestamps = activeTimestamps;
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

export function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const key = identifier || 'anonymous';

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter timestamps within current window
  const windowStart = now - windowMs;
  record.timestamps = record.timestamps.filter(ts => ts > windowStart);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0];
    const resetMs = Math.max(0, oldestTimestamp + windowMs - now);
    return {
      success: false,
      limit,
      remaining: 0,
      resetMs
    };
  }

  record.timestamps.push(now);
  return {
    success: true,
    limit,
    remaining: limit - record.timestamps.length,
    resetMs: windowMs
  };
}

export function getClientIp(req: Request): string {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const candidate = xForwardedFor.split(',')[0].trim();
    // Validate that candidate looks like a valid IPv4 or IPv6 address to prevent header injection
    if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(candidate) || candidate.includes(':')) {
      return candidate;
    }
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp && (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(realIp) || realIp.includes(':'))) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

