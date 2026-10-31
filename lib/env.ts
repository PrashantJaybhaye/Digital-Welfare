/**
 * Environment Variables Validation and Integrity Auditor.
 * Ensures critical secrets and configurations meet security requirements.
 */

export interface EnvValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
}

export function validateEnvironment(): EnvValidationResult {
  const isProd = process.env.NODE_ENV === 'production';
  const warnings: string[] = [];
  const errors: string[] = [];

  // 1. Admin Secret
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    if (isProd) {
      errors.push('CRITICAL: ADMIN_SECRET is not set in production! Admin authentication will be locked.');
    } else {
      warnings.push('ADMIN_SECRET is not configured; using local development fallback.');
    }
  } else if (adminSecret.length < 8) {
    warnings.push('ADMIN_SECRET is shorter than 8 characters. Consider using a 16+ character strong secret.');
  } else if (adminSecret === 'admin2026' && isProd) {
    errors.push('CRITICAL: Default secret "admin2026" detected in production environment! Change immediately.');
  }

  // 2. Firebase Server Credentials
  const fbKey = process.env.FIREBASE_PRIVATE_KEY;
  const fbEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const fbProject = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!fbKey || !fbEmail || !fbProject) {
    warnings.push('Firebase Admin credentials incomplete. Server database operations will use fallback mode.');
  } else if (!fbKey.includes('BEGIN PRIVATE KEY')) {
    errors.push('FIREBASE_PRIVATE_KEY is malformed (missing RSA private key header).');
  }

  // 3. Client Firebase Keys (Should be present for client-side Auth)
  const clientApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!clientApiKey) {
    warnings.push('NEXT_PUBLIC_FIREBASE_API_KEY is not defined.');
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors
  };
}

