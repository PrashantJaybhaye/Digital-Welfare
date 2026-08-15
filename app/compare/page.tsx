"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Scheme, formatCategoryName, getEstimatedBenefit, getSchemeDocuments } from '@/types/scheme';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, ExternalLink, Scale, Plus, X, 
  Building2, Sparkles, CheckCircle2, FileText, Coins, 
  Users, ShieldCheck, ArrowRightLeft, Check, Layers
} from 'lucide-react';

export default function CompareSchemesPage() {
  const [allSchemes, setAllSchemes] = useState<Scheme[]>([]);
  const [selectedSchemeIds, setSelectedSchemeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchemes() {
      try {
        const snap = await getDocs(collection(db, 'schemes'));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Scheme[];
        setAllSchemes(list);
        if (list.length >= 2) {
          setSelectedSchemeIds([list[0].id!, list[1].id!]);
        } else if (list.length === 1) {
          setSelectedSchemeIds([list[0].id!]);
        }
      } catch (err) {
        console.error('Error fetching schemes for comparison:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSchemes();
  }, []);

  const handleSelectScheme = (slotIndex: number, newId: string) => {
    setSelectedSchemeIds(prev => {
      const copy = [...prev];
      copy[slotIndex] = newId;
      return copy;
    });
  };

  const handleAddSlot = () => {
    if (selectedSchemeIds.length < 3 && allSchemes.length > selectedSchemeIds.length) {
      const unused = allSchemes.find(s => !selectedSchemeIds.includes(s.id!));
      if (unused && unused.id) {
        setSelectedSchemeIds(prev => [...prev, unused.id!]);
      }
    }
  };

  const handleRemoveSlot = (slotIndex: number) => {
    if (selectedSchemeIds.length > 1) {
      setSelectedSchemeIds(prev => prev.filter((_, idx) => idx !== slotIndex));
    }
  };

  const handleSwap = () => {
    if (selectedSchemeIds.length >= 2) {
      setSelectedSchemeIds(prev => [prev[1], prev[0], ...prev.slice(2)]);
    }
  };

  const handleApplyPreset = (term1: string, term2: string) => {
    const s1 = allSchemes.find(s => s.title.toLowerCase().includes(term1.toLowerCase()));
    const s2 = allSchemes.find(s => s.title.toLowerCase().includes(term2.toLowerCase()) && s.id !== s1?.id);
    if (s1 && s2 && s1.id && s2.id) {
      setSelectedSchemeIds([s1.id, s2.id]);
    }
  };

  const comparedSchemes = selectedSchemeIds
    .map(id => allSchemes.find(s => s.id === id))
    .filter(Boolean) as Scheme[];

  // Helper to get target audience verdict
  const getBestSuitedVerdict = (s: Scheme) => {
    const combined = `${s.title.toLowerCase()} ${s.description.toLowerCase()} ${(s.targetOccupation || '').toLowerCase()}`;
    if (combined.includes('scholarship') || combined.includes('student') || combined.includes('education')) return 'Students & Higher Education';
    if (combined.includes('kisan') || combined.includes('farmer') || combined.includes('krishi')) return 'Farmers & Agricultural Landowners';
    if (combined.includes('ayushman') || combined.includes('health') || combined.includes('swasthya')) return 'Low-Income Families & Healthcare';
    if (combined.includes('loan') || combined.includes('business') || combined.includes('msme') || combined.includes('mudra')) return 'Entrepreneurs & Micro-Businesses';
    if (combined.includes('pension') || combined.includes('senior')) return 'Senior Citizens (60+ Years)';
    if (combined.includes('worker') || combined.includes('shramik') || combined.includes('wage')) return 'Daily Wage & Unorganized Workers';
    return 'General Indian Citizens';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 pb-16 min-h-[calc(100vh-4rem)]">
      
      {/* Top Breadcrumb & Header */}
      <div className="mb-6 sm:mb-8">
        <Link 
          href="/schemes" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Schemes Directory
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-950 tracking-tight leading-tight mb-2">
              Compare welfare <span className="relative inline-block">
                programs.
                {/* Hand-drawn Underline */}
                <svg 
                  className="absolute -bottom-1.5 left-0 w-full h-2.5 text-slate-950 overflow-visible pointer-events-none" 
                  viewBox="0 0 160 12" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M2 8.5C40 2.5 110 2.5 158 7" 
                    stroke="currentColor" 
                    strokeWidth="2.8" 
                    strokeLinecap="round"
                  />
                  <path 
                    d="M18 10C60 5.5 115 5.5 146 9.5" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeOpacity="0.4"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
              Side-by-side breakdown of direct cash subsidies, eligibility ceilings, application routes, and required documents.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {selectedSchemeIds.length >= 2 && (
              <button
                onClick={handleSwap}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Swap column order"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-slate-700" /> Swap
              </button>
            )}

            {selectedSchemeIds.length < 3 && allSchemes.length > selectedSchemeIds.length && (
              <button
                onClick={handleAddSlot}
                className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#7eed9e]" /> Add 3rd Scheme
              </button>
            )}
          </div>
        </div>

        {/* Quick Comparison Presets */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-slate-700" /> Popular Comparisons:
          </span>
          {[
            { label: 'Kisan DBT vs Agripower', term1: 'kisan', term2: 'agri' },
            { label: 'Scholarship vs Education Grant', term1: 'scholarship', term2: 'education' },
            { label: 'Health Insurance vs Hospitalization', term1: 'health', term2: 'insurance' },
            { label: 'MSME Loan vs Employment', term1: 'mudra', term2: 'employment' }
          ].map(p => (
            <button
              key={p.label}
              onClick={() => handleApplyPreset(p.term1, p.term2)}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-700 hover:bg-slate-200 hover:text-slate-950 transition-colors border border-slate-200/60 cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-16 rounded-2xl border border-slate-200/90 text-center flex flex-col items-center justify-center min-h-75 shadow-2xs">
          <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-950 rounded-full animate-spin mb-3"></div>
          <h4 className="text-sm font-bold text-slate-950 mb-0.5">Loading Comparison Engine...</h4>
          <p className="text-xs text-slate-500">Fetching live database subsidies and gazette rules</p>
        </div>
      ) : allSchemes.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/90 text-center shadow-2xs">
          <p className="text-slate-600 text-sm font-medium">No welfare schemes available in database to compare.</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* ========================================================
              PILLARS / BATTLECARDS HEADER ROW
          ======================================================== */}
          <div className={`grid ${comparedSchemes.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
            {comparedSchemes.map((scheme, slotIdx) => {
              const benefit = getEstimatedBenefit(scheme);
              const verdict = getBestSuitedVerdict(scheme);
              return (
                <div 
                  key={slotIdx} 
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs relative flex flex-col justify-between"
                >
                  {comparedSchemes.length > 1 && (
                    <button
                      onClick={() => handleRemoveSlot(slotIdx)}
                      className="absolute top-3 right-3 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove column"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 rounded-md bg-slate-950 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {slotIdx + 1}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Slot #{slotIdx + 1}
                      </span>
                    </div>

                    {/* Scheme Selector Dropdown */}
                    <select
                      value={scheme.id}
                      onChange={(e) => handleSelectScheme(slotIdx, e.target.value)}
                      className="w-full text-xs font-bold text-slate-950 bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/90 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all cursor-pointer mb-3"
                    >
                      {allSchemes.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.state || 'All India'})
                        </option>
                      ))}
                    </select>

                    {/* Main Title & Category */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200/60">
                        {formatCategoryName(scheme.category)}
                      </span>
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/40">
                        {scheme.state || 'Central'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-950 leading-snug mb-2">
                      {scheme.title}
                    </h3>

                    {/* Highlighted Subsidy Badge */}
                    <div className="p-2.5 rounded-xl bg-[#7eed9e]/20 border border-[#7eed9e]/40 mb-3">
                      <p className="text-[9px] font-bold text-emerald-950 uppercase tracking-wider">Direct Benefit Value</p>
                      <p className="text-sm font-extrabold text-emerald-950 mt-0.5">{benefit.label}</p>
                    </div>

                    {/* Target Audience Pill */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <Users className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                      <span className="text-[11px] font-medium truncate">
                        <strong className="text-slate-900">Suited for:</strong> {verdict}
                      </span>
                    </div>
                  </div>

                  {/* Direct Action Link */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Link
                      href={`/schemes/${scheme.id}`}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition-all whitespace-nowrap"
                    >
                      Inspect Checklist <ArrowRight className="w-3 h-3 text-[#7eed9e]" />
                    </Link>
                    {scheme.applyLink && (
                      <a
                        href={scheme.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center transition-all"
                        title="Official Government Portal"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================
              DETAILED DIMENSION COMPARISON BLOCKS
          ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            
            {/* 1. Overview & Scheme Scope */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Layers className="w-3.5 h-3.5 text-slate-700" /> 1. Scheme Scope & Objective
              </h3>
              <div className={`grid ${comparedSchemes.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
                {comparedSchemes.map((s, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200/60 text-xs text-slate-600 leading-relaxed">
                    <p className="line-clamp-4">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Eligibility Rules Matrix */}
            <div className="p-4 sm:p-5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700" /> 2. Eligibility & Demographics
              </h3>
              
              <div className="space-y-3">
                {/* Age Criteria */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Age Limits</span>
                  <div className={`grid ${comparedSchemes.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
                    {comparedSchemes.map((s, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/50 text-xs font-bold text-slate-900">
                        {s.minAge ? `${s.minAge} years` : 'No minimum'} {s.maxAge ? `to ${s.maxAge} years` : '(No upper limit)'}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Family Income Ceiling */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Household Income Ceiling</span>
                  <div className={`grid ${comparedSchemes.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
                    {comparedSchemes.map((s, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/50 text-xs font-bold text-slate-900">
                        {s.maxIncome ? `Up to ₹${s.maxIncome.toLocaleString('en-IN')} / year` : 'No strict income ceiling'}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Demographics */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Target Gender & Groups</span>
                  <div className={`grid ${comparedSchemes.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
                    {comparedSchemes.map((s, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/50 text-xs font-medium text-slate-800">
                        <span className="font-bold text-slate-950">Gender:</span> {s.targetGender || 'Any'} • <span className="font-bold text-slate-950">Group:</span> {s.targetOccupation || 'All Citizens'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Mandatory Document Checklist */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <FileText className="w-3.5 h-3.5 text-slate-700" /> 3. Required Document Checklist
              </h3>
              <div className={`grid ${comparedSchemes.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
                {comparedSchemes.map((s, idx) => {
                  const docs = getSchemeDocuments(s);
                  return (
                    <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200/60">
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {docs.map((doc, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-1.5 text-[11px] leading-snug">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Bottom Action Bar */}
            <div className="p-4 sm:p-5 bg-white flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-xs text-slate-500">
                Ready to proceed? Verify your specific state quotas and required e-KYC documents.
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href="/eligibility-check"
                  className="px-4 py-2 rounded-xl bg-[#7eed9e] hover:bg-[#69df8e] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" /> Test Your Eligibility
                </Link>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
