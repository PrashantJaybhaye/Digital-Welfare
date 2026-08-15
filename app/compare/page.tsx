"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Scheme, formatCategoryName, getEstimatedBenefit, getSchemeDocuments } from '@/types/scheme';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ExternalLink, Scale, CheckCircle2, FileText, Plus, X, Building2, MapPin } from 'lucide-react';

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

  const comparedSchemes = selectedSchemeIds
    .map(id => allSchemes.find(s => s.id === id))
    .filter(Boolean) as Scheme[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <Link href="/schemes" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-600 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to schemes
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 flex items-center gap-3">
            <Scale className="w-8 h-8 text-primary-600" /> Compare Government Schemes
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Compare benefits, funding models, income caps, and required documentation side-by-side.
          </p>
        </div>

        {selectedSchemeIds.length < 3 && allSchemes.length > selectedSchemeIds.length && (
          <button
            onClick={handleAddSlot}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary-50 text-primary-700 hover:bg-primary-100 font-bold text-xs border border-primary-200 transition-all"
          >
            <Plus className="w-4 h-4" /> Add 3rd Scheme
          </button>
        )}
      </div>

      {loading ? (
        <div className="bg-white p-20 rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Loading comparison matrix...</p>
        </div>
      ) : allSchemes.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center">
          <p className="text-slate-500">No schemes available in database to compare.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Selectors Header Row */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
            {comparedSchemes.map((scheme, slotIdx) => (
              <div key={slotIdx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative">
                {comparedSchemes.length > 1 && (
                  <button
                    onClick={() => handleRemoveSlot(slotIdx)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Scheme #{slotIdx + 1}
                </label>
                <select
                  value={scheme.id}
                  onChange={(e) => handleSelectScheme(slotIdx, e.target.value)}
                  className="w-full text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {allSchemes.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Side-by-Side Comparison Matrix */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody>
                
                {/* Scheme Title & Overview */}
                <tr className="border-b border-slate-100">
                  <td className="p-5 font-bold text-xs uppercase text-slate-400 bg-slate-50/50 w-48 shrink-0">Overview</td>
                  {comparedSchemes.map((s) => (
                    <td key={s.id} className="p-5 align-top">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{s.description}</p>
                    </td>
                  ))}
                </tr>

                {/* Funding & Category Type */}
                <tr className="border-b border-slate-100">
                  <td className="p-5 font-bold text-xs uppercase text-slate-400 bg-slate-50/50">Scheme Type</td>
                  {comparedSchemes.map((s) => (
                    <td key={s.id} className="p-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-800">
                        <Building2 className="w-3 h-3 mr-1" /> {formatCategoryName(s.category)}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Estimated Financial Benefit */}
                <tr className="border-b border-slate-100">
                  <td className="p-5 font-bold text-xs uppercase text-slate-400 bg-slate-50/50">Support Value</td>
                  {comparedSchemes.map((s) => {
                    const benefit = getEstimatedBenefit(s);
                    return (
                      <td key={s.id} className="p-5">
                        <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 inline-block">
                          {benefit.label}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Eligibility - Age Limit */}
                <tr className="border-b border-slate-100">
                  <td className="p-5 font-bold text-xs uppercase text-slate-400 bg-slate-50/50">Age Limit</td>
                  {comparedSchemes.map((s) => (
                    <td key={s.id} className="p-5 text-sm font-medium text-slate-800">
                      {s.minAge ? `${s.minAge}+` : 'Any'} {s.maxAge ? `to ${s.maxAge} yrs` : ''}
                    </td>
                  ))}
                </tr>

                {/* Eligibility - Income Cap */}
                <tr className="border-b border-slate-100">
                  <td className="p-5 font-bold text-xs uppercase text-slate-400 bg-slate-50/50">Income Cap</td>
                  {comparedSchemes.map((s) => (
                    <td key={s.id} className="p-5 text-sm font-medium text-slate-800">
                      {s.maxIncome ? `Up to ₹${s.maxIncome.toLocaleString('en-IN')}` : 'No Strict Limit'}
                    </td>
                  ))}
                </tr>

                {/* Target Occupation / Group */}
                <tr className="border-b border-slate-100">
                  <td className="p-5 font-bold text-xs uppercase text-slate-400 bg-slate-50/50">Target Group</td>
                  {comparedSchemes.map((s) => (
                    <td key={s.id} className="p-5 text-sm font-medium text-slate-800">
                      {s.targetOccupation || 'Open to All Citizens'}
                    </td>
                  ))}
                </tr>

                {/* Required Documents */}
                <tr className="border-b border-slate-100">
                  <td className="p-5 font-bold text-xs uppercase text-slate-400 bg-slate-50/50">Required Documents</td>
                  {comparedSchemes.map((s) => {
                    const docs = getSchemeDocuments(s);
                    return (
                      <td key={s.id} className="p-5">
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {docs.map((doc, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary-600 font-bold">•</span>
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    );
                  })}
                </tr>

                {/* Actions Row */}
                <tr>
                  <td className="p-5 font-bold text-xs uppercase text-slate-400 bg-slate-50/50">Action</td>
                  {comparedSchemes.map((s) => (
                    <td key={s.id} className="p-5">
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/schemes/${s.id}`}
                          className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          View Full Details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        {s.applyLink && (
                          <a
                            href={s.applyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1 transition-all"
                          >
                            Official Portal <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}
