import crypto from 'crypto';

const SESSION_MAX_AGE_SECONDS = 4 * 60 * 60; // 4 hours

function getMasterSecret(): string | undefined {
  return process.env.ADMIN_SECRET || (process.env.NODE_ENV !== 'production' ? 'admin2026' : undefined);
}

/**
 * Validates admin key using timing-safe comparison to prevent timing attacks.
 * In production, requires process.env.ADMIN_SECRET.
 * In development, falls back to default key if ADMIN_SECRET is not configured.
 */
export function isAuthorizedAdmin(providedKey?: string | null): boolean {
  if (!providedKey || typeof providedKey !== 'string') return false;

  const masterSecret = getMasterSecret();
  if (!masterSecret) return false;

  const input = Buffer.from(providedKey.trim());
  const secret = Buffer.from(masterSecret.trim());

  if (input.length === secret.length && crypto.timingSafeEqual(input, secret)) {
    return true;
  }

  return false;
}

/**
 * Creates a cryptographically signed session token for the Admin dashboard.
 * Format: `<timestamp>.<nonce>.<hmacSignature>`
 */
export function createAdminSessionToken(): string | null {
  const masterSecret = getMasterSecret();
  if (!masterSecret) return null;

  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `${timestamp}.${nonce}`;

  const hmac = crypto.createHmac('sha256', masterSecret);
  hmac.update(payload);
  const signature = hmac.digest('hex');

  return `${payload}.${signature}`;
}

/**
 * Verifies an HMAC signed admin session token.
 * Ensures the token was signed with the master secret and hasn't expired.
 */
export function verifyAdminSessionToken(token?: string | null): boolean {
  if (!token || typeof token !== 'string') return false;

  const masterSecret = getMasterSecret();
  if (!masterSecret) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [timestampStr, nonce, receivedSig] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check expiration (4 hours)
  const ageSeconds = (Date.now() - timestamp) / 1000;
  if (ageSeconds < 0 || ageSeconds > SESSION_MAX_AGE_SECONDS) {
    return false; // Expired or future timestamp
  }

  const payload = `${timestampStr}.${nonce}`;
  const hmac = crypto.createHmac('sha256', masterSecret);
  hmac.update(payload);
  const expectedSig = hmac.digest('hex');

  const bufReceived = Buffer.from(receivedSig);
  const bufExpected = Buffer.from(expectedSig);

  if (bufReceived.length === bufExpected.length && crypto.timingSafeEqual(bufReceived, bufExpected)) {
    return true;
  }

  return false;
}

/**
 * Extracts a cookie value by name from standard Request or cookie string.
 */
export function parseCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Verifies authorization headers or HTTP-only session cookie from an incoming HTTP Request.
 * Supports:
 * 1. HTTP-only secure cookie `admin_session` (browser dashboard)
 * 2. `x-admin-key` header (automation/curl)
 * 3. `Authorization: Bearer <key>`
 */
export function verifyAdminRequest(req: Request): boolean {
  // 1. Check HTTP-only session cookie
  const cookieHeader = req.headers.get('cookie');
  const sessionToken = parseCookie(cookieHeader, 'admin_session');
  if (sessionToken && verifyAdminSessionToken(sessionToken)) {
    return true;
  }

  // 2. Check direct key in headers
  const authHeader = req.headers.get('authorization');
  const bearerKey = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const customKey = req.headers.get('x-admin-key');
  
  if (bearerKey && (isAuthorizedAdmin(bearerKey) || verifyAdminSessionToken(bearerKey))) {
    return true;
  }

  if (customKey && (isAuthorizedAdmin(customKey) || verifyAdminSessionToken(customKey))) {
    return true;
  }

  return false;
}

/**
 * Builds the Set-Cookie string for the admin session token.
 */
export function buildAdminCookie(token: string): string {
  const isProd = process.env.NODE_ENV === 'production';
  return `admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_MAX_AGE_SECONDS}${isProd ? '; Secure' : ''}`;
}

/**
 * Builds the Set-Cookie string to clear the admin session.
 */
export function buildClearAdminCookie(): string {
  return `admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
