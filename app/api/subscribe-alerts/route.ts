import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { rateLimit, getClientIp } from '@/lib/rate-limiter';

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
      }, { status: 429 });
    }

    const { contact, category, state, channel } = await req.json();

    if (!contact || typeof contact !== 'string' || !contact.trim()) {
      return NextResponse.json({ success: false, error: 'Valid Phone number or Email is required' }, { status: 400 });
    }

    const cleanContact = contact.trim().toLowerCase().slice(0, 150);
    
    // Validate email or 10-digit Indian phone
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanContact);
    const isPhone = /^[6-9]\d{9}$/.test(cleanContact.replace(/[^0-9]/g, ''));

    if (!isEmail && !isPhone) {
      return NextResponse.json({
        success: false,
        error: 'Please enter a valid 10-digit Indian mobile number or email address'
      }, { status: 400 });
    }

    const safeChannel = ['WhatsApp', 'Email', 'SMS'].includes(channel) ? channel : 'WhatsApp';
    const safeCategory = typeof category === 'string' ? category.trim().slice(0, 100) : 'All Schemes';
    const safeState = typeof state === 'string' ? state.trim().slice(0, 100) : 'All India';

    const docId = cleanContact.replace(/[^a-z0-9]/g, '_');
    const subscriberRef = adminDb.collection('scheme_subscribers').doc(docId);

    await subscriberRef.set({
      contact: cleanContact,
      category: safeCategory,
      state: safeState,
      channel: safeChannel,
      subscribedAt: new Date().toISOString(),
      isActive: true
    }, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to Scheme Alerts!'
    });
  } catch (err: unknown) {
    console.error('Subscription error:', err);
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
    console.error('Fetch subscribers error:', err);
    return NextResponse.json({ success: true, subscribers: [] });
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
    const { id } = await req.json();
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ success: false, error: 'Subscriber ID is required' }, { status: 400 });
    }
    await adminDb.collection('scheme_subscribers').doc(id.trim()).delete();
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Failed to delete subscriber:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete subscriber' }, { status: 500 });
  }
}
