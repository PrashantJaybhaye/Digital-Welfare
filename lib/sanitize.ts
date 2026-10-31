/**
 * Centralized Input Sanitization and Security Validation Utilities.
 * Protects against XSS (Cross-Site Scripting), HTML injection, parameter pollution,
 * and malicious payload formatting across forms and API endpoints.
 */

/**
 * Escapes common HTML special characters to prevent HTML/XSS injection.
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Strips script tags, HTML tags, control characters, and clamps string length.
 */
export function sanitizeText(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') return '';
  
  return input
    // Strip HTML tags entirely
    .replace(/<[^>]*>?/gm, '')
    // Strip control characters (except standard whitespace)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize excess whitespace
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates and normalizes an Indian phone number (10 digits starting with 6-9).
 */
export function sanitizePhone(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const digitsOnly = input.replace(/\D/g, '');
  // Indian phone number: 10 digits starting with 6, 7, 8, or 9
  // (or 12 digits starting with 91)
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    const local = digitsOnly.slice(2);
    if (/^[6-9]\d{9}$/.test(local)) return local;
  }
  if (digitsOnly.length === 10 && /^[6-9]\d{9}$/.test(digitsOnly)) {
    return digitsOnly;
  }
  return null;
}

/**
 * Validates and normalizes an email address.
 */
export function sanitizeEmail(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const cleaned = input.trim().toLowerCase().slice(0, 150);
  // RFC 5322 compliant practical email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (emailRegex.test(cleaned)) {
    return cleaned;
  }
  return null;
}

/**
 * Validates and normalizes a web URL.
 * Only allows safe http/https schemes. Blocks javascript:, data:, vbscript: protocols.
 */
export function sanitizeUrl(input: unknown, maxLength = 1000): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim().slice(0, maxLength);
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Validates and bounds numeric values.
 */
export function sanitizeNumber(input: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): number | null {
  if (typeof input === 'number' && !isNaN(input) && isFinite(input)) {
    if (input >= min && input <= max) return input;
  }
  if (typeof input === 'string') {
    const parsed = parseFloat(input.replace(/[^0-9.-]/g, ''));
    if (!isNaN(parsed) && isFinite(parsed) && parsed >= min && parsed <= max) {
      return parsed;
    }
  }
  return null;
}

