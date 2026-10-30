import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SchemeDetailView from '@/components/SchemeDetailView';
import { getFastSchemeById, getFastSchemes } from '@/lib/schemes-service';

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  const schemes = await getFastSchemes();
  return schemes.map((s) => ({
    id: s.id || encodeURIComponent(s.title),
  }));
}

export default async function SchemeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const scheme = await getFastSchemeById(resolvedParams.id);

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
