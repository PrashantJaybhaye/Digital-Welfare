import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { generateSlug, Scheme } from '@/types/scheme';
import { getFastSchemes, invalidateSchemesCache } from '@/lib/schemes-service';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { rateLimit, getClientIp } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const limiter = rateLimit(`get-schemes-${clientIp}`, 120, 60 * 1000);
    if (!limiter.success) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

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
  // Enforce server-side Admin Authentication
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized. Admin credentials required to modify scheme database.'
    }, { status: 401 });
  }

  try {
    const body = await req.json();
    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 300) : '';
    const description = typeof body.description === 'string' ? body.description.trim().slice(0, 5000) : '';

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Title and description required' }, { status: 400 });
    }

    // Sanitize and normalize inputs
    const sanitizedScheme: Partial<Scheme> = {
      title,
      description,
      category: typeof body.category === 'string' ? body.category.trim().slice(0, 100) : 'General',
      department: typeof body.department === 'string' ? body.department.trim().slice(0, 200) : null,
      state: typeof body.state === 'string' ? body.state.trim().slice(0, 100) : 'Maharashtra',
      minAge: typeof body.minAge === 'number' && body.minAge >= 0 && body.minAge <= 120 ? body.minAge : null,
      maxAge: typeof body.maxAge === 'number' && body.maxAge >= 0 && body.maxAge <= 120 ? body.maxAge : null,
      maxIncome: typeof body.maxIncome === 'number' && body.maxIncome >= 0 ? body.maxIncome : null,
      targetGender: ['Male', 'Female', 'Any'].includes(body.targetGender) ? body.targetGender : 'Any',
      targetOccupation: typeof body.targetOccupation === 'string' ? body.targetOccupation.trim().slice(0, 100) : null,
      socialCategory: ['All', 'SC/ST', 'OBC', 'VJNT', 'SBC', 'General', 'EWS', 'Minority'].includes(body.socialCategory) ? body.socialCategory : 'All',
      benefits: Array.isArray(body.benefits) ? body.benefits.map((b: unknown) => String(b).trim().slice(0, 300)).filter(Boolean).slice(0, 20) : [],
      requiredDocuments: Array.isArray(body.requiredDocuments) ? body.requiredDocuments.map((d: unknown) => String(d).trim().slice(0, 300)).filter(Boolean).slice(0, 30) : [],
      stepsToApply: Array.isArray(body.stepsToApply) ? body.stepsToApply.map((s: unknown) => String(s).trim().slice(0, 500)).filter(Boolean).slice(0, 20) : [],
      financialBenefitText: typeof body.financialBenefitText === 'string' ? body.financialBenefitText.trim().slice(0, 200) : null,
      estimatedBenefitAmount: typeof body.estimatedBenefitAmount === 'number' && body.estimatedBenefitAmount >= 0 ? body.estimatedBenefitAmount : null,
      applyLink: typeof body.applyLink === 'string' && (body.applyLink.startsWith('https://') || body.applyLink.startsWith('http://')) ? body.applyLink.trim().slice(0, 1000) : null,
      lastSyncedAt: new Date().toISOString()
    };

    const docId = generateSlug(title) || `scheme-${Date.now()}`;
    await adminDb.collection('schemes').doc(docId).set({
      ...sanitizedScheme,
      id: docId
    }, { merge: true });

    invalidateSchemesCache();

    return NextResponse.json({ success: true, id: docId });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Failed to create scheme';
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  // Enforce server-side Admin Authentication
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized. Admin credentials required to modify scheme database.'
    }, { status: 401 });
  }

  try {
    const body = await req.json();
    const rawIds: unknown[] = body.ids || (body.id ? [body.id] : []);
    const toDelete: string[] = rawIds.filter((id): id is string => typeof id === 'string' && id.trim().length > 0).map(id => id.trim());

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
