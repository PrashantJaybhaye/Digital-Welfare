import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getFallbackSchemes } from '@/lib/fallback-schemes';
import { Scheme } from '@/types/scheme';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const snapshot = await adminDb.collection('schemes').orderBy('title').get();
    if (!snapshot.empty) {
      const schemes = snapshot.docs.map(doc => {
        const data = doc.data();
        const sanitized = JSON.parse(JSON.stringify(data));
        return {
          id: doc.id,
          ...sanitized,
          lastSyncedAt: sanitized.lastSyncedAt?.toString() || new Date().toISOString()
        };
      }) as Scheme[];

      return NextResponse.json({
        success: true,
        schemes,
        source: 'firestore'
      });
    }
  } catch (err) {
    console.warn('Firebase Admin schemes fetch failed (serving fallback catalog):', err);
  }

  return NextResponse.json({
    success: true,
    schemes: getFallbackSchemes(),
    source: 'fallback'
  });
}

