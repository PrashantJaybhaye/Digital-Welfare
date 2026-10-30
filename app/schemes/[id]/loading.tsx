import { 
  ArrowLeft, Bookmark, Share2, Printer, 
  Building2, MapPin, Sparkles, CheckCircle2, 
  FileText, HelpCircle, ShieldCheck 
} from 'lucide-react';

export default function SchemeDetailLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-12 animate-pulse">
      {/* Top Bar Actions */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to schemes</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200/90 text-slate-400">
            <Bookmark className="w-3.5 h-3.5 text-slate-300" />
            <span>Save</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-600">
            <Share2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Share on WhatsApp</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200/90 text-slate-400">
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print Scheme</span>
          </div>
        </div>
      </div>

      {/* Main Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-2xs mb-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-400 border border-slate-200/60">
            <Building2 className="w-3 h-3 mr-1 text-slate-400" />
            <div className="h-2.5 w-32 bg-slate-200 rounded" />
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-50 text-slate-400 border border-slate-200/60">
            <MapPin className="w-3 h-3 mr-1 text-slate-300" />
            <div className="h-2.5 w-16 bg-slate-200 rounded" />
          </span>
        </div>

        <div className="h-7 w-3/4 max-w-xl bg-slate-200 rounded-lg mb-2.5" />
        <div className="space-y-1.5 max-w-4xl mb-4">
          <div className="h-3.5 w-full bg-slate-100 rounded" />
          <div className="h-3.5 w-5/6 bg-slate-100 rounded" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#7eed9e]/20 border border-[#7eed9e]/50">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600/60" />
          <div className="h-3 w-56 bg-emerald-300/40 rounded" />
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Key Benefits Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600/70" />
              <span>Key Benefits & Entitlements</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex items-start gap-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">✓</span>
                <div className="h-3 w-48 bg-slate-200 rounded mt-0.5" />
              </div>
              <div className="flex items-start gap-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">✓</span>
                <div className="h-3 w-40 bg-slate-200 rounded mt-0.5" />
              </div>
              <div className="flex items-start gap-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">✓</span>
                <div className="h-3 w-44 bg-slate-200 rounded mt-0.5" />
              </div>
              <div className="flex items-start gap-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">✓</span>
                <div className="h-3 w-36 bg-slate-200 rounded mt-0.5" />
              </div>
            </div>
          </div>

          {/* Document Checklist Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2.5">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-800" />
                  <span>Mandatory Document Checklist</span>
                </h2>
                <p className="text-[11px] text-slate-400">Check off documents you have prepared before applying</p>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/60">
                0/5 Ready (0%)
              </span>
            </div>

            <div className="w-full h-1 bg-slate-100 rounded-full mb-3.5 overflow-hidden">
              <div className="h-full bg-emerald-500/40 w-1/4 rounded-full" />
            </div>

            <div className="space-y-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 bg-white">
                  <div className="w-3.5 h-3.5 border border-slate-300 rounded shrink-0" />
                  <div className={`h-3 bg-slate-200 rounded ${i % 2 === 0 ? 'w-56' : 'w-72'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Application Steps Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-3.5 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-800" />
              <span>Step-by-Step Application Guide</span>
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    0{step}
                  </div>
                  <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100 grow space-y-1.5">
                    <div className="h-3.5 w-40 bg-slate-200 rounded" />
                    <div className="h-3 w-full bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Apply Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center">
            <h3 className="font-bold text-slate-950 text-sm mb-1">Apply for this Scheme</h3>
            <p className="text-[11px] text-slate-400 mb-3 font-normal">
              Direct submission through the verified government ministry portal.
            </p>
            <div className="w-full bg-[#7eed9e]/60 text-slate-900 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-2xs">
              <div className="h-3.5 w-44 bg-emerald-800/20 rounded" />
            </div>
            <div className="mt-2.5 h-3 w-32 bg-slate-200 rounded mx-auto" />
          </div>

          {/* Eligibility Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h3 className="font-bold text-slate-950 text-xs mb-2.5 pb-2 border-b border-slate-100">
              Eligibility Criteria
            </h3>
            <ul className="space-y-2.5">
              {['Age', 'Income', 'Gender', 'Group', 'Region'].map((label) => (
                <li key={label} className="flex justify-between items-center">
                  <span className="text-[11px] font-medium text-slate-400">{label}:</span>
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                </li>
              ))}
            </ul>
          </div>

          {/* Verified Badge */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Scheme</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Verified with public ministry guidelines. Ensure bank account is Aadhaar-linked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
