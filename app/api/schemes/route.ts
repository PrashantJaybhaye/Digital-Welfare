import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { generateSlug } from '@/types/scheme';
import { getFastSchemes, invalidateSchemesCache } from '@/lib/schemes-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const schemes = await getFastSchemes();
    return NextResponse.json({
      success: true,
      schemes,
      total: schemes.length
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Failed to retrieve schemes';
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
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

    invalidateSchemesCache();

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

    invalidateSchemesCache();

    return NextResponse.json({ success: true, deletedCount: toDelete.length });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Failed to delete scheme(s)';
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
