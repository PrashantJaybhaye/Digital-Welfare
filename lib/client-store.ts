import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

/**
 * Returns true only on the client after hydration.
 * Pure SSR/Hydration safe without cascading effect renders.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

// -------------------------------------------------------------
// SAVED SCHEMES STORE (Cross-tab synced with localStorage)
// -------------------------------------------------------------
const storageListeners = new Set<() => void>();

export function notifySavedSchemesChange() {
  storageListeners.forEach(listener => {
    try {
      listener();
    } catch {}
  });
}

function subscribeSavedSchemes(callback: () => void) {
  storageListeners.add(callback);
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === 'saved_schemes') {
      callback();
    }
  };
  window.addEventListener('storage', handleStorageEvent);
  return () => {
    storageListeners.delete(callback);
    window.removeEventListener('storage', handleStorageEvent);
  };
}

export function useSavedSchemes(): string[] {
  const rawString = useSyncExternalStore(
    subscribeSavedSchemes,
    () => {
      try {
        return localStorage.getItem('saved_schemes') || '[]';
      } catch {
        return '[]';
      }
    },
    () => '[]'
  );

  try {
    return JSON.parse(rawString);
  } catch {
    return [];
  }
}

export function toggleSavedScheme(schemeId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('saved_schemes');
    const list: string[] = raw ? JSON.parse(raw) : [];
    const updated = list.includes(schemeId)
      ? list.filter(id => id !== schemeId)
      : [...list, schemeId];
    localStorage.setItem('saved_schemes', JSON.stringify(updated));
    notifySavedSchemesChange();
    return updated;
  } catch {
    return [];
  }
}

// -------------------------------------------------------------
// ADMIN SESSION STORE (sessionStorage + syncExternalStore)
// -------------------------------------------------------------
const adminAuthListeners = new Set<() => void>();

function subscribeAdminAuth(callback: () => void) {
  adminAuthListeners.add(callback);
  return () => {
    adminAuthListeners.delete(callback);
  };
}

export function useAdminSessionAuth(): boolean {
  return useSyncExternalStore(
    subscribeAdminAuth,
    () => {
      try {
        const isAuth = sessionStorage.getItem('welfare_admin_auth') === 'true';
        if (!isAuth) return false;
        
        // 2 hours automatic session timeout
        const loginTime = Number(sessionStorage.getItem('admin_auth_timestamp') || '0');
        if (Date.now() - loginTime > 2 * 60 * 60 * 1000) {
          sessionStorage.removeItem('welfare_admin_auth');
          sessionStorage.removeItem('admin_token');
          sessionStorage.removeItem('admin_auth_timestamp');
          return false;
        }
        return true;
      } catch {
        return false;
      }
    },
    () => false
  );
}

export function setAdminSessionAuth(authenticated: boolean) {
  try {
    if (authenticated) {
      sessionStorage.setItem('welfare_admin_auth', 'true');
      sessionStorage.setItem('admin_auth_timestamp', Date.now().toString());
    } else {
      sessionStorage.removeItem('welfare_admin_auth');
      sessionStorage.removeItem('admin_token');
      sessionStorage.removeItem('admin_auth_timestamp');
    }
  } catch {}
  adminAuthListeners.forEach(listener => {
    try {
      listener();
    } catch {}
  });
}
