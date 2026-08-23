"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Scheme, formatCategoryName, getEstimatedBenefit, getSchemeDocuments } from '@/types/scheme';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, ExternalLink, Plus, X, 
  Users, ShieldCheck, ArrowRightLeft, Check, Layers, Printer
} from 'lucide-react';
import Logo from '@/components/Logo';
import { getFallbackSchemes } from '@/lib/fallback-schemes';

export default function CompareSchemesPage() {
  const [allSchemes, setAllSchemes] = useState<Scheme[]>([]);
  const [selectedSchemeIds, setSelectedSchemeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchemes() {
      try {
        let list: Scheme[] = [];
        try {
          const snap = await getDocs(collection(db, 'schemes'));
          list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Scheme[];
        } catch (err) {
          console.warn('Firestore fetch notice (using fallback schemes):', err);
          list = getFallbackSchemes();
        }

        if (list.length === 0) {
          list = getFallbackSchemes();
        }

        setAllSchemes(list);
        if (list.length >= 2) {
          setSelectedSchemeIds([list[0].id!, list[1].id!]);
        } else if (list.length === 1) {
          setSelectedSchemeIds([list[0].id!]);
        }
      } catch (err) {
        console.error('Error loading compare schemes:', err);
        const fallback = getFallbackSchemes();
        setAllSchemes(fallback);
        if (fallback.length >= 2) setSelectedSchemeIds([fallback[0].id!, fallback[1].id!]);
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

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
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
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 pb-16 min-h-[calc(100vh-4rem)] print:hidden">
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

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-400 text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                title="Print official comparison report"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" /> Print Report
              </button>

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

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Popular Comparisons:</span>
            <button
              onClick={() => handleApplyPreset('kisan', 'fasal')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer"
            >
              PM-Kisan vs Fasal Bima
            </button>
            <button
              onClick={() => handleApplyPreset('ayushman', 'suraksha')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer"
            >
              Ayushman Bharat vs PMSBY
            </button>
            <button
              onClick={() => handleApplyPreset('scholarship', 'pragati')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer"
            >
              Scholarships vs AICTE Pragati
            </button>
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

                      <div className="p-2.5 rounded-xl bg-[#7eed9e]/20 border border-[#7eed9e]/40 mb-3">
                        <p className="text-[9px] font-bold text-emerald-950 uppercase tracking-wider">Direct Benefit Value</p>
                        <p className="text-sm font-extrabold text-emerald-950 mt-0.5">{benefit.label}</p>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <Users className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                        <span className="text-[11px] font-medium truncate">
                          <strong className="text-slate-900">Suited for:</strong> {verdict}
                        </span>
                      </div>
                    </div>

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

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
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

              <div className="p-4 sm:p-5 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-700" /> 2. Eligibility & Demographics
                </h3>
                
                <div className="space-y-3">
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

              <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Layers className="w-3.5 h-3.5 text-slate-700" /> 3. Required Document Checklist
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

              <div className="p-4 sm:p-5 bg-white flex flex-col sm:flex-row justify-between items-center gap-3">
                <p className="text-xs text-slate-500">
                  Ready to proceed? Verify your specific state quotas and required e-KYC documents.
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    href="/eligibility-check"
                    className="px-4 py-2 rounded-xl bg-[#7eed9e] hover:bg-[#69df8e] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
                  >
                    Test Your Eligibility
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {comparedSchemes.length >= 2 && (
        <div className="hidden print:block bg-white text-slate-900 max-w-[210mm] mx-auto text-xs font-sans">
          <div className="print-page-1">
            <div>
              <div className="border-b-2 border-slate-900 pb-3 mb-3.5 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Logo size={36} color="#020617" />
                  <div>
                    <p className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-600 leading-none">
                      National Public Welfare Portal • Government of India & States
                    </p>
                    <h1 className="text-base font-extrabold text-slate-950 tracking-tight mt-1 leading-tight">
                      Comparative Welfare Analysis & Entitlement Breakdown
                    </h1>
                    <p className="text-[10px] text-slate-600">
                      Side-by-Side Assessment of Public Welfare Schemes & Grant Ceilings
                    </p>
                  </div>
                </div>
                <div className="text-right text-[9.5px]">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 font-mono text-[9px] font-bold">
                    REF: DW-COMP/{Date.now().toString().slice(-6)}
                  </span>
                  <p className="text-[9.5px] text-slate-500 mt-0.5">
                    Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-[8.5px] font-bold text-emerald-800 uppercase">
                    ● Status: Comparative Audit
                  </p>
                </div>
              </div>

              <div className="mb-3.5">
                <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1.5">
                  1. Program Identification & Financial Entitlement Comparison
                </h2>
                <div className={`grid ${comparedSchemes.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
                  {comparedSchemes.map((s, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-[10px] space-y-1">
                      <span className="text-[8.5px] font-extrabold px-1.5 py-0.5 rounded bg-slate-900 text-white uppercase tracking-wider">
                        Program #{idx + 1}
                      </span>
                      <h3 className="font-bold text-slate-950 text-[11px] leading-tight mt-0.5">{s.title}</h3>
                      <p className="text-slate-600 text-[9.5px] leading-snug line-clamp-3">{s.description}</p>
                      <div className="pt-1 border-t border-slate-200">
                        <span className="text-[8.5px] font-bold text-slate-500 uppercase block">Est. Financial Benefit:</span>
                        <span className="font-extrabold text-slate-950 text-[11px]">{getEstimatedBenefit(s).label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3.5">
                <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1.5">
                  2. Demographic & Socio-Economic Eligibility Matrix
                </h2>
                <table className="w-full text-left border-collapse border border-slate-200 text-[10px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 border-b border-slate-200 text-[9px] font-extrabold uppercase">
                      <th className="p-1.5 border-r border-slate-200 w-28">Criterion</th>
                      {comparedSchemes.map((s, idx) => (
                        <th key={idx} className="p-1.5 border-r border-slate-200">
                          {s.title.slice(0, 24)}...
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-1.5 border-r border-slate-200 font-bold text-slate-800">Age Limits</td>
                      {comparedSchemes.map((s, idx) => (
                        <td key={idx} className="p-1.5 border-r border-slate-200">
                          {s.minAge ? `${s.minAge} Yrs` : 'No Min'} {s.maxAge ? `to ${s.maxAge} Yrs` : ''}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-200 even:bg-slate-50/50">
                      <td className="p-1.5 border-r border-slate-200 font-bold text-slate-800">Income Ceiling</td>
                      {comparedSchemes.map((s, idx) => (
                        <td key={idx} className="p-1.5 border-r border-slate-200">
                          {s.maxIncome ? `Up to ₹${s.maxIncome.toLocaleString('en-IN')}` : 'No strict cap'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-1.5 border-r border-slate-200 font-bold text-slate-800">Target Group</td>
                      {comparedSchemes.map((s, idx) => (
                        <td key={idx} className="p-1.5 border-r border-slate-200">{s.targetOccupation || 'All Citizens'}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-200 even:bg-slate-50/50">
                      <td className="p-1.5 border-r border-slate-200 font-bold text-slate-800">Best Suited For</td>
                      {comparedSchemes.map((s, idx) => (
                        <td key={idx} className="p-1.5 border-r border-slate-200 font-medium text-slate-950">
                          {getBestSuitedVerdict(s)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-slate-300 pt-2 flex justify-between items-center text-[9px] text-slate-500 font-medium">
              <span>National Welfare Comparative Analysis • Ref: DW-COMP/{Date.now().toString().slice(-6)}</span>
              <span className="font-bold text-slate-900">Page 1 of 2 • (See Page 2 for Document Matrix & Facilitation Seal)</span>
            </div>
          </div>

          <div className="print-page-2">
            <div>
              <div className="border-b-2 border-slate-900 pb-2.5 mb-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Logo size={24} color="#020617" />
                  <span className="text-[11px] font-black text-slate-950 uppercase tracking-tight">
                    Comparative Analysis • Document Verification Matrix & Action Plan (Page 2 of 2)
                  </span>
                </div>
                <span className="text-[9.5px] font-bold text-slate-600">
                  {comparedSchemes.length} Schemes Analyzed
                </span>
              </div>

              <div className="mb-3">
                <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1.5">
                  3. Comparative Mandatory Document Verification Checklist
                </h2>
                <div className={`grid ${comparedSchemes.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
                  {comparedSchemes.map((s, idx) => {
                    const docs = getSchemeDocuments(s);
                    return (
                      <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[9.5px]">
                        <span className="font-bold text-slate-950 block mb-1">{s.title.slice(0, 30)}...</span>
                        <ul className="space-y-1 text-slate-700">
                          {docs.map((doc, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-1">
                              <span className="inline-block w-3 h-3 border border-slate-800 rounded shrink-0 mt-0.5"></span>
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-3">
                <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1.5">
                  4. Citizen Application Strategy & Facilitation Rules
                </h2>
                <div className="grid grid-cols-2 gap-2 text-[9.5px]">
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-900 block mb-0.5">Simultaneous Applications:</span>
                    <p className="text-slate-600 leading-tight">
                      Citizens can simultaneously claim non-conflicting schemes (e.g. Kisan credit + Health Insurance). Ensure separate application tracking tokens.
                    </p>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-900 block mb-0.5">Direct Benefit Transfer (DBT):</span>
                    <p className="text-slate-600 leading-tight">
                      A single Aadhaar-seeded bank account receives direct financial disbursements for all Central and State government welfare programs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-lg mb-3">
                <span className="text-[9px] font-extrabold uppercase text-slate-700 block mb-1">
                  Common Service Centre (CSC) / Citizen Seva Kendra Verification & Filing Seal:
                </span>
                <div className="grid grid-cols-3 gap-2 text-[8.5px] text-slate-600 pt-1">
                  <div>
                    <span>VLE / Operator ID: ________________</span>
                  </div>
                  <div>
                    <span>Operator Signature: ________________</span>
                  </div>
                  <div className="text-right">
                    <span>Center Stamp / Seal: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-300 pt-1.5 text-[8.5px] text-slate-500 flex justify-between items-center">
              <span>Disclaimer: Computer-generated comparative entitlement analysis. Final approval subject to nodal ministry e-KYC guidelines.</span>
              <span className="font-bold text-slate-900 shrink-0 ml-2">Page 2 of 2 • End of Document</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
