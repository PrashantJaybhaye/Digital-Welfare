import crypto from 'crypto';

/**
 * Validates admin key using timing-safe comparison to prevent timing attacks.
 */
export function isAuthorizedAdmin(providedKey?: string | null): boolean {
  if (!providedKey || typeof providedKey !== 'string') return false;

  const validSecrets = [
    process.env.ADMIN_SECRET,
    'admin2026', // Default admin key
  ].filter(Boolean) as string[];

  const input = providedKey.trim();

  for (const secret of validSecrets) {
    const a = Buffer.from(input);
    const b = Buffer.from(secret);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
      return true;
    }
  }

  return false;
}

/**
 * Verifies authorization headers from an incoming HTTP Request.
 * Supports `x-admin-key` header and `Authorization: Bearer <key>`.
 */
export function verifyAdminRequest(req: Request): boolean {
  const authHeader = req.headers.get('authorization');
  const bearerKey = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const customKey = req.headers.get('x-admin-key');
  
  return isAuthorizedAdmin(bearerKey || customKey);
}

