import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { rateLimit, getClientIp } from '@/lib/rate-limiter';
import { sanitizeText, sanitizeEmail, sanitizePhone } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    // Rate limit: max 5 alert subscriptions per 10 minutes per IP
    const limiter = rateLimit(`alert-sub-${clientIp}`, 5, 10 * 60 * 1000);
    if (!limiter.success) {
      return NextResponse.json({
        success: false,
        error: 'Too many subscription attempts. Please try again later.'
      }, { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil(limiter.resetMs / 1000).toString()
        }
      });
    }

    const body = await req.json();
    const rawContact = typeof body.contact === 'string' ? body.contact.trim() : '';

    if (!rawContact) {
      return NextResponse.json({ success: false, error: 'Valid Phone number or Email is required' }, { status: 400 });
    }

    // Validate email or 10-digit Indian phone
    const validEmail = sanitizeEmail(rawContact);
    const validPhone = sanitizePhone(rawContact);

    if (!validEmail && !validPhone) {
      return NextResponse.json({
        success: false,
        error: 'Please enter a valid 10-digit Indian mobile number or email address'
      }, { status: 400 });
    }

    const cleanContact = validEmail || validPhone || '';
    const channel = ['WhatsApp', 'Email', 'SMS'].includes(body.channel) ? body.channel : 'WhatsApp';
    const safeCategory = sanitizeText(body.category, 100) || 'All Schemes';
    const safeState = sanitizeText(body.state, 100) || 'All India';

    const docId = cleanContact.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const subscriberRef = adminDb.collection('scheme_subscribers').doc(docId);

    await subscriberRef.set({
      contact: cleanContact,
      category: safeCategory,
      state: safeState,
      channel,
      subscribedAt: new Date().toISOString(),
      isActive: true
    }, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to Scheme Alerts!'
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function GET(req: Request) {
  // Protect subscriber privacy: require Admin authentication
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized. Admin credentials required to view subscriber registry.'
    }, { status: 401 });
  }

  try {
    const snap = await adminDb.collection('scheme_subscribers').orderBy('subscribedAt', 'desc').limit(200).get();
    const subscribers = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return NextResponse.json({ success: true, subscribers });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Failed to load subscribers';
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  // Require Admin authentication
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized. Admin credentials required to remove subscribers.'
    }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = sanitizeText(body.id, 200);
    if (!id) {
      return NextResponse.json({ success: false, error: 'Subscriber ID is required' }, { status: 400 });
    }
    await adminDb.collection('scheme_subscribers').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Failed to delete subscriber';
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
