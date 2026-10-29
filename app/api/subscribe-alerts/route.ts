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

export async function GET() {
  try {
    const snap = await adminDb.collection('scheme_subscribers').orderBy('subscribedAt', 'desc').get();
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
  try {
    const { id } = await req.json();
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
