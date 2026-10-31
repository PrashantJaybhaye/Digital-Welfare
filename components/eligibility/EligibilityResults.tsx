"use client";

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Share2,
  Check,
  Printer,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Award,
} from 'lucide-react';
import { Scheme, formatCategoryName, getEstimatedBenefit } from '@/types/scheme';
import { EligibilityResult } from '@/lib/eligibility-engine';

interface EligibilityResultsProps {
  results: EligibilityResult | null;
  loading: boolean;
  isPrinting: boolean;
  copiedShare: boolean;
  navigatingSchemeId: string | null;
  onShareWhatsApp: () => void;
  onPrint: () => void;
  onNavigateScheme: (schemeId: string) => void;
}

export default function EligibilityResults({
  results,
  loading,
  isPrinting,
  copiedShare,
  navigatingSchemeId,
  onShareWhatsApp,
  onPrint,
  onNavigateScheme,
}: EligibilityResultsProps) {
  if (!results && !loading) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 text-center flex flex-col items-center justify-center min-h-75 shadow-2xs">
        <div className="w-12 h-12 mb-3 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
          <Award className="w-6 h-6" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-slate-950 mb-1">
          Instant Eligibility & Subsidy Report
        </h3>
        <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-normal">
          Fill in your age, state, and occupation on the left. We will scan central & state welfare databases to compute
          all programs you qualify for.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200/90 text-center flex flex-col items-center justify-center min-h-75 shadow-2xs">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-950 rounded-full animate-spin mb-2.5"></div>
        <h4 className="text-xs sm:text-sm font-bold text-slate-950 mb-0.5">Scanning Live Datasets...</h4>
        <p className="text-[11px] text-slate-500">
          Checking income ceilings, reservations, age limits & subsidy rules
        </p>
      </div>
    );
  }

  if (!results) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Overview Entitlement Banner */}
      <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 text-white shadow-2xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 border-b border-white/10 pb-3 mb-3">
          <div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-bold uppercase tracking-wider text-slate-200 mb-0.5">
              <Sparkles className="w-2.5 h-2.5 text-[#7eed9e]" /> Profile Match
            </span>
            <h3 className="text-lg sm:text-xl font-bold">
              {results.eligible.length} Schemes Available
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onShareWhatsApp}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3 h-3 text-[#7eed9e]" />
                  <span>Opening...</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3" />
                  <span>Share</span>
                </>
              )}
            </button>
            <button
              onClick={onPrint}
              disabled={isPrinting}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-75"
            >
              {isPrinting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Opening...</span>
                </>
              ) : (
                <>
                  <Printer className="w-3 h-3" />
                  <span>Print</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
              Est. Direct Scheme Entitlement
            </p>
            <p className="text-base sm:text-lg font-bold mt-0.5 text-[#7eed9e]">
              {results.estimatedBenefitLabel}
            </p>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
              Healthcare Protection
            </p>
            <p className="text-base sm:text-lg font-bold mt-0.5 text-[#7eed9e]">
              {results.hasHealthInsuranceCover ? '₹5 Lakh / Year (PM-JAY)' : 'Hospital & OPD Cover'}
            </p>
          </div>
        </div>
      </div>

      {/* Qualified Schemes List */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <h4 className="text-sm font-bold text-slate-950 mb-3 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Qualified Schemes ({results.eligible.length})
        </h4>

        {results.eligible.length === 0 ? (
          <div className="p-5 text-center bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-slate-700 font-bold text-xs">No direct scheme matches with current strict filters.</p>
            <p className="text-xs text-slate-400 mt-0.5">Try widening your income or state selection.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {results.eligible.map((scheme: Scheme) => {
              const benefit = getEstimatedBenefit(scheme);
              return (
                <div
                  key={scheme.id}
                  className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5"
                >
                  <div className="grow">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200/60">
                        {formatCategoryName(scheme.category)}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-800 bg-[#7eed9e]/20 px-2 py-0.5 rounded-md border border-[#7eed9e]/40">
                        {benefit.label}
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-950 text-xs sm:text-sm leading-snug">{scheme.title}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {scheme.description}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Link
                      href={`/schemes/${scheme.id}`}
                      prefetch={true}
                      onClick={() => onNavigateScheme(scheme.id || '')}
                      className={`px-3 py-1.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all whitespace-nowrap active:scale-98 cursor-pointer ${
                        navigatingSchemeId === scheme.id
                          ? 'bg-slate-800 pointer-events-none ring-2 ring-slate-400'
                          : 'bg-slate-950 hover:bg-slate-800'
                      }`}
                    >
                      {navigatingSchemeId === scheme.id ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Opening...</span>
                        </>
                      ) : (
                        <>
                          <span>Check Documents</span>
                          <ArrowRight className="w-3 h-3 text-slate-300" />
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Other Schemes Not Matching Criteria */}
      {results.notEligible.length > 0 && (
        <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80">
          <h4 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
            <XCircle className="w-3 h-3 text-slate-400" />
            Other Schemes Not Matching Criteria ({results.notEligible.length})
          </h4>
          <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
            {results.notEligible.map((scheme: Scheme) => (
              <div
                key={scheme.id}
                className="p-2 bg-white rounded-xl border border-slate-200/60 flex justify-between items-center text-xs opacity-80"
              >
                <span className="font-medium text-slate-700 truncate max-w-sm text-xs">{scheme.title}</span>
                <Link
                  href={`/schemes/${scheme.id}`}
                  className="text-slate-950 font-bold hover:underline shrink-0 text-[10px]"
                >
                  View Rules
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

