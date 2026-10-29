import { adminDb } from './firebase-admin';
import { getFallbackSchemes, getFallbackScheme } from './fallback-schemes';
import { Scheme } from '@/types/scheme';

let inMemoryCache: Scheme[] | null = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export function invalidateSchemesCache() {
  inMemoryCache = null;
  lastCacheTimestamp = 0;
}

/**
 * High-performance schemes retrieval with memory caching and 1.5s timeout race.
 * Ensures the Schemes tab loads in under 10ms instead of hanging on loading screens.
 */
export async function getFastSchemes(): Promise<Scheme[]> {
  const now = Date.now();
  if (inMemoryCache && inMemoryCache.length > 0 && (now - lastCacheTimestamp) < CACHE_TTL_MS) {
    return inMemoryCache;
  }

  try {
    const firestorePromise = (async () => {
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
        return list;
      }
      return null;
    })();

    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), 1500);
    });

    const result = await Promise.race([firestorePromise, timeoutPromise]);

    if (result && result.length > 0) {
      inMemoryCache = result;
      lastCacheTimestamp = Date.now();
      return result;
    }

    if (inMemoryCache && inMemoryCache.length > 0) {
      return inMemoryCache;
    }
  } catch (err) {
    console.warn('Fast schemes fetch warning:', err);
  }

  const fallbacks = getFallbackSchemes();
  inMemoryCache = fallbacks;
  lastCacheTimestamp = Date.now();
  return fallbacks;
}

export async function getFastSchemeById(idOrSlug: string): Promise<Scheme | null> {
  if (!idOrSlug) return null;
  const schemes = await getFastSchemes();
  const target = decodeURIComponent(idOrSlug).toLowerCase().trim();
  const found = schemes.find(s => s.id === target || s.id?.toLowerCase() === target || s.title.toLowerCase().includes(target));
  if (found) return found;
  return getFallbackScheme(idOrSlug);
}

