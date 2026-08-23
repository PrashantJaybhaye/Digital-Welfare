import { adminDb } from '@/lib/firebase-admin';
import { Scheme } from '@/types/scheme';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SchemeDetailView from '@/components/SchemeDetailView';
import { getFallbackScheme } from '@/lib/fallback-schemes';

export default async function SchemeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let scheme: Scheme | null = null;

  try {
    const docRef = adminDb.collection('schemes').doc(resolvedParams.id);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      const sanitized = JSON.parse(JSON.stringify(data));
      scheme = { 
        id: docSnap.id, 
        ...sanitized,
        lastSyncedAt: sanitized.lastSyncedAt?.toString() || new Date().toISOString()
      } as Scheme;
    }
  } catch (error) {
    console.warn("Firestore lookup failed (using fallback catalog):", error);
  }

  if (!scheme) {
    scheme = getFallbackScheme(resolvedParams.id);
  }

  if (!scheme) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Scheme Not Found</h1>
        <p className="text-slate-600 mb-8">The scheme you are looking for does not exist or has been removed.</p>
        <Link href="/schemes" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to all schemes
        </Link>
      </div>
    );
  }

  return <SchemeDetailView scheme={scheme} />;
}
