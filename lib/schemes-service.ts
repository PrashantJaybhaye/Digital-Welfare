import { adminDb } from './firebase-admin';
import { getFallbackSchemes, getFallbackScheme } from './fallback-schemes';
import { Scheme } from '@/types/scheme';

// Pre-seed in-memory cache at boot time so cold starts resolve in 0ms
let inMemoryCache: Scheme[] = getFallbackSchemes();
let lastCacheTimestamp = Date.now();
let isRefreshing = false;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export function invalidateSchemesCache() {
  lastCacheTimestamp = 0;
}

function hasFirebaseAdminConfigured(): boolean {
  return !!(
    (process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
}

async function refreshFromFirestore(): Promise<void> {
  if (isRefreshing || !hasFirebaseAdminConfigured()) return;
  isRefreshing = true;

  try {
    const snap = await adminDb.collection('schemes').get();
    if (!snap.empty) {
      const list = snap.docs.map(doc => {
        const data = doc.data();
        const sanitized = JSON.parse(JSON.stringify(data));
        return {
          id: doc.id,
          ...sanitized,
          lastSyncedAt: sanitized.lastSyncedAt?.toString() || new Date().toISOString()
        } as Scheme;
      });
      list.sort((a, b) => a.title.localeCompare(b.title));
      inMemoryCache = list;
      lastCacheTimestamp = Date.now();
    }
  } catch (err) {
    console.warn('Background Firestore refresh warning:', err);
  } finally {
    isRefreshing = false;
  }
}

/**
 * Ultra-fast schemes retrieval using Stale-While-Revalidate.
 * Returns 210 enriched schemes in 0ms without blocking on external database WAN requests.
 */
export async function getFastSchemes(): Promise<Scheme[]> {
  const now = Date.now();

  // If cache is stale and admin credentials exist, trigger background refresh
  if (now - lastCacheTimestamp > CACHE_TTL_MS && hasFirebaseAdminConfigured()) {
    // Non-blocking background revalidation
    refreshFromFirestore().catch(() => {});
  }

  return inMemoryCache;
}

export async function getFastSchemeById(idOrSlug: string): Promise<Scheme | null> {
  if (!idOrSlug) return null;
  const schemes = await getFastSchemes();
  const target = decodeURIComponent(idOrSlug).toLowerCase().trim();
  const found = schemes.find(s => s.id === target || s.id?.toLowerCase() === target || s.title.toLowerCase().includes(target));
  if (found) return found;
  return getFallbackScheme(idOrSlug);
}

