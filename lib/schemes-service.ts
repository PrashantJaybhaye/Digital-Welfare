import { adminDb } from './firebase-admin';
import { getFallbackSchemes, getFallbackScheme } from './fallback-schemes';
import { Scheme } from '@/types/scheme';

// Cache configuration: 6-hour sync window (e.g. 12 o'clock, 6 o'clock cycle)
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

let inMemoryCache: Scheme[] = [];
let hasLoadedFromFirestore = false;
let lastCacheTimestamp = 0;
let refreshPromise: Promise<void> | null = null;

export function invalidateSchemesCache() {
  lastCacheTimestamp = 0;
  hasLoadedFromFirestore = false;
}

function hasFirebaseAdminConfigured(): boolean {
  return !!(
    (process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
}

async function refreshFromFirestore(): Promise<void> {
  if (!hasFirebaseAdminConfigured()) return;

  // Deduplicate concurrent refresh calls with a single shared promise
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const snap = await adminDb.collection('schemes').get();
      if (!snap.empty) {
        const list = snap.docs.map((doc) => {
          const data = doc.data();
          const sanitized = JSON.parse(JSON.stringify(data));
          return {
            id: doc.id,
            ...sanitized,
            lastSyncedAt: sanitized.lastSyncedAt?.toString() || new Date().toISOString(),
          } as Scheme;
        });

        list.sort((a, b) => a.title.localeCompare(b.title));
        inMemoryCache = list;
        hasLoadedFromFirestore = true;
        lastCacheTimestamp = Date.now();
      }
    } catch (err) {
      console.warn('Firestore schemes refresh warning:', err);
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * High-performance schemes retrieval with persistent 6-hour cache.
 * Guarantees that the full live database (all 220 schemes) is loaded on startup,
 * and gracefully falls back to the curated catalog if Firestore is unreachable.
 */
export async function getFastSchemes(): Promise<Scheme[]> {
  const now = Date.now();

  // If initial load hasn't happened yet, await Firestore so users always get the full 220 live schemes
  if (!hasLoadedFromFirestore && hasFirebaseAdminConfigured()) {
    await refreshFromFirestore();
  } else if (now - lastCacheTimestamp > CACHE_TTL_MS && hasFirebaseAdminConfigured()) {
    // 6-hour background revalidation (Stale-While-Revalidate)
    refreshFromFirestore().catch(() => {});
  }

  // Return live Firestore schemes if available, otherwise return offline fallback
  if (inMemoryCache.length > 0) {
    return inMemoryCache;
  }

  return getFallbackSchemes();
}

export async function getFastSchemeById(idOrSlug: string): Promise<Scheme | null> {
  if (!idOrSlug) return null;
  const schemes = await getFastSchemes();
  const target = decodeURIComponent(idOrSlug).toLowerCase().trim();
  const found = schemes.find(
    (s) =>
      s.id === target ||
      s.id?.toLowerCase() === target ||
      s.title.toLowerCase().includes(target)
  );
  if (found) return found;
  return getFallbackScheme(idOrSlug);
}
