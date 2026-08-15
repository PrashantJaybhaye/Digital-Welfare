import { adminDb } from '@/lib/firebase-admin';
import { Scheme } from '@/types/scheme';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SchemeDetailView from '@/components/SchemeDetailView';

export default async function SchemeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const docRef = adminDb.collection('schemes').doc(resolvedParams.id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Scheme Not Found</h1>
        <p className="text-slate-600 mb-8">The scheme you are looking for does not exist or has been removed.</p>
        <Link href="/schemes" className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700">
          <ArrowLeft className="w-4 h-4" /> Back to all schemes
        </Link>
      </div>
    );
  }

  const scheme = { id: docSnap.id, ...docSnap.data() } as Scheme;

  return <SchemeDetailView scheme={scheme} />;
}
