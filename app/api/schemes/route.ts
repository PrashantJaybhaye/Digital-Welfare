import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { generateSlug, Scheme } from '@/types/scheme';
import { getFastSchemes, invalidateSchemesCache } from '@/lib/schemes-service';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { rateLimit, getClientIp } from '@/lib/rate-limiter';
import { sanitizeText, sanitizeUrl, sanitizeNumber } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const limiter = rateLimit(`get-schemes-${clientIp}`, 120, 60 * 1000);
    if (!limiter.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Too many requests. Please slow down.' 
      }, { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil(limiter.resetMs / 1000).toString()
        }
      });
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
  const clientIp = getClientIp(req);
  const limiter = rateLimit(`mutate-schemes-${clientIp}`, 20, 60 * 1000);
  if (!limiter.success) {
    return NextResponse.json({ success: false, error: 'Rate limit exceeded for mutations.' }, { status: 429 });
  }

  // Enforce server-side Admin Authentication
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized. Admin credentials required to modify scheme database.'
    }, { status: 401 });
  }

  try {
    const body = await req.json();
    const title = sanitizeText(body.title, 300);
    const description = sanitizeText(body.description, 5000);

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Title and description required' }, { status: 400 });
    }

    // Sanitize and normalize inputs
    const sanitizedScheme: Partial<Scheme> = {
      title,
      description,
      category: sanitizeText(body.category, 100) || 'General',
      department: body.department ? sanitizeText(body.department, 200) : null,
      state: sanitizeText(body.state, 100) || 'Maharashtra',
      minAge: sanitizeNumber(body.minAge, 0, 120),
      maxAge: sanitizeNumber(body.maxAge, 0, 120),
      maxIncome: sanitizeNumber(body.maxIncome, 0, 100000000),
      targetGender: ['Male', 'Female', 'Any'].includes(body.targetGender) ? body.targetGender : 'Any',
      targetOccupation: body.targetOccupation ? sanitizeText(body.targetOccupation, 100) : null,
      socialCategory: ['All', 'SC/ST', 'OBC', 'VJNT', 'SBC', 'General', 'EWS', 'Minority'].includes(body.socialCategory) ? body.socialCategory : 'All',
      benefits: Array.isArray(body.benefits) ? body.benefits.map((b: unknown) => sanitizeText(b, 300)).filter(Boolean).slice(0, 20) : [],
      requiredDocuments: Array.isArray(body.requiredDocuments) ? body.requiredDocuments.map((d: unknown) => sanitizeText(d, 300)).filter(Boolean).slice(0, 30) : [],
      stepsToApply: Array.isArray(body.stepsToApply) ? body.stepsToApply.map((s: unknown) => sanitizeText(s, 500)).filter(Boolean).slice(0, 20) : [],
      financialBenefitText: body.financialBenefitText ? sanitizeText(body.financialBenefitText, 200) : null,
      estimatedBenefitAmount: sanitizeNumber(body.estimatedBenefitAmount, 0, 10000000),
      applyLink: sanitizeUrl(body.applyLink, 1000),
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
  const clientIp = getClientIp(req);
  const limiter = rateLimit(`mutate-schemes-${clientIp}`, 20, 60 * 1000);
  if (!limiter.success) {
    return NextResponse.json({ success: false, error: 'Rate limit exceeded for mutations.' }, { status: 429 });
  }

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
    const toDelete: string[] = rawIds
      .filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
      .map(id => sanitizeText(id, 200));

    if (!toDelete.length) {
      return NextResponse.json({ success: false, error: 'No IDs provided' }, { status: 400 });
    }

    const batch = adminDb.batch();
    toDelete.forEach((id) => {
      const docRef = adminDb.collection('schemes').doc(id);
      batch.delete(docRef);
    });

    await batch.commit();
    invalidateSchemesCache();

    return NextResponse.json({ success: true, deleted: toDelete.length });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Failed to delete scheme';
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
