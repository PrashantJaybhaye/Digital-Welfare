import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getFallbackSchemes } from '@/lib/fallback-schemes';
import { Scheme, generateSlug } from '@/types/scheme';

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.description) {
      return NextResponse.json({ success: false, error: 'Title and description required' }, { status: 400 });
    }

    const docId = generateSlug(body.title) || `scheme-${Date.now()}`;
    await adminDb.collection('schemes').doc(docId).set({
      ...body,
      id: docId,
      lastSyncedAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ success: true, id: docId });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Failed to create scheme';
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const toDelete: string[] = body.ids || (body.id ? [body.id] : []);
    if (!toDelete.length) {
      return NextResponse.json({ success: false, error: 'No IDs provided' }, { status: 400 });
    }

    const batch = adminDb.batch();
    for (const docId of toDelete) {
      batch.delete(adminDb.collection('schemes').doc(docId));
    }
    await batch.commit();

    return NextResponse.json({ success: true, deletedCount: toDelete.length });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Failed to delete scheme(s)';
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

