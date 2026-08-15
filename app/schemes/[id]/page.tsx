import { adminDb } from '@/lib/firebase-admin';
import { Scheme, formatCategoryName } from '@/types/scheme';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, CheckCircle2, Info, Building2, MapPin } from 'lucide-react';

export default async function SchemeDetailsPage({ params }: { params: { id: string } }) {
  // Await the params object according to Next.js 15+ patterns for dynamic routes
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/schemes" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to schemes
      </Link>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 md:p-10 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800">
              <Building2 className="w-3 h-3 mr-1" /> {formatCategoryName(scheme.category)}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
              <MapPin className="w-3 h-3 mr-1" /> {scheme.state || 'All India'}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
            {scheme.title}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {scheme.description}
          </p>
        </div>

        <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" /> 
                Key Benefits
              </h2>
              <ul className="space-y-3">
                {scheme.benefits?.length ? scheme.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                    <span className="text-emerald-600 font-bold mt-0.5">•</span>
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                )) : (
                  <li className="text-slate-500 italic">No specific benefits listed.</li>
                )}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl bg-slate-50">
              <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Eligibility Criteria</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex justify-between items-center">
                  <span className="font-medium">Age Limit:</span>
                  <span className="text-slate-900 font-semibold text-right">
                    {scheme.minAge ? `${scheme.minAge}+` : 'Any'} {scheme.maxAge ? `to ${scheme.maxAge} yrs` : ''}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-medium">Income Cap:</span>
                  <span className="text-slate-900 font-semibold text-right">
                    {scheme.maxIncome ? `Up to ₹${scheme.maxIncome.toLocaleString()}` : 'No Limit'}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-medium">Gender:</span>
                  <span className="text-slate-900 font-semibold text-right">{scheme.targetGender || 'Any'}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-medium">Occupation:</span>
                  <span className="text-slate-900 font-semibold text-right">{scheme.targetOccupation || 'Any'}</span>
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl bg-primary-50 border-primary-100">
              <h3 className="font-bold text-primary-900 mb-2">How to Apply</h3>
              <p className="text-sm text-primary-700 mb-4">
                Applications can be submitted via the official government portal.
              </p>
              {scheme.applyLink ? (
                <a 
                  href={scheme.applyLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Apply Now <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <button disabled className="w-full bg-slate-200 text-slate-500 font-semibold py-3 px-4 rounded-xl cursor-not-allowed">
                  Link Unavailable
                </button>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-4">
              <Calendar className="w-3 h-3" />
              <span>Last updated: {new Date(scheme.lastSyncedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
