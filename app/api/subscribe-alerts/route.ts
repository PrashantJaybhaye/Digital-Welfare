import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { contact, category, state, channel } = await req.json();

    if (!contact || !contact.trim()) {
      return NextResponse.json({ success: false, error: 'Phone number or Email is required' }, { status: 400 });
    }

    const cleanContact = contact.trim().toLowerCase();
    const subscriberRef = adminDb.collection('scheme_subscribers').doc(cleanContact.replace(/[^a-z0-9]/g, '_'));

    await subscriberRef.set({
      contact: cleanContact,
      category: category || 'All Schemes',
      state: state || 'All India',
      channel: channel || 'WhatsApp',
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
