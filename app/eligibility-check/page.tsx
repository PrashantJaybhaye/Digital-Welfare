"use client";

import { useState } from 'react';
import { Scheme } from '@/types/scheme';
import { getFallbackSchemes } from '@/lib/fallback-schemes';
import { evaluateEligibility, EligibilityResult } from '@/lib/eligibility-engine';
import EligibilityForm, { EligibilityFormData } from '@/components/eligibility/EligibilityForm';
import EligibilityResults from '@/components/eligibility/EligibilityResults';
import PrintDossier from '@/components/eligibility/PrintDossier';

export default function EligibilityChecker() {
  const [loading, setLoading] = useState(false);
  const [navigatingSchemeId, setNavigatingSchemeId] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [printMeta, setPrintMeta] = useState({ refSuffix: '109283', printDate: '' });
  const [results, setResults] = useState<EligibilityResult | null>(null);

  const [formData, setFormData] = useState<EligibilityFormData>({
    age: '',
    gender: 'Any',
    income: '',
    occupation: '',
    state: 'All India',
    socialCategory: 'All',
  });

  const handleIncomeQuickSelect = (amount: number) => {
    setFormData((prev) => ({ ...prev, income: amount.toString() }));
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let allSchemes: Scheme[] = [];
      try {
        const res = await fetch('/api/schemes');
        if (res.ok) {
          const data = await res.json();
          allSchemes = data.schemes || [];
        }
      } catch {
        allSchemes = getFallbackSchemes();
      }

      if (allSchemes.length === 0) {
        allSchemes = getFallbackSchemes();
      }

      // Execute decoupled pure eligibility engine
      const evaluation = evaluateEligibility(formData, allSchemes);

      setPrintMeta({
        refSuffix: Math.floor(100000 + Math.random() * 900000).toString(),
        printDate: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      });

      setResults(evaluation);
    } catch (error) {
      console.error('Error evaluating eligibility:', error);
      alert('Could not connect to database. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!results || !results.eligible) return;
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
    const top3 = (results.eligible || [])
      .slice(0, 4)
      .map((s, i) => `${i + 1}. *${s?.title || 'Welfare Scheme'}*`)
      .join('\n');
    const text = `🇮🇳 *My Welfare Schemes Report*\nI checked my eligibility on Digital Welfare Guide and found *${results.eligible.length} government schemes* available for me:\n\n${top3}\n\nCheck yours here: ${window.location.origin}/eligibility-check`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setPrintMeta((prev) => ({
      ...prev,
      printDate:
        prev.printDate ||
        new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    }));
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 200);
  };

  return (
    <>
      <div className="print:hidden max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 pb-16 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] flex flex-col justify-start">
        {/* Page Header */}
        <div className="text-left mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight leading-tight mb-1.5">
            Check your scheme{' '}
            <span className="relative inline-block">
              eligibility.
              <svg
                className="absolute -bottom-1.5 left-0 w-full h-2.5 text-slate-950 overflow-visible pointer-events-none"
                viewBox="0 0 160 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 8.5C40 2.5 110 2.5 158 7" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M18 10C60 5.5 115 5.5 146 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
              </svg>
            </span>
          </h1>
          <p className="text-xs text-slate-600 max-w-xl font-normal leading-relaxed">
            Enter your demographic and economic profile below. Our engine analyzes 100+ verified Central & State programs in real time.
          </p>
        </div>

        {/* Two-Column Grid: Form Left, Results Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-5">
            <EligibilityForm
              formData={formData}
              setFormData={setFormData}
              loading={loading}
              onSubmit={handleCheck}
              onIncomeQuickSelect={handleIncomeQuickSelect}
            />
          </div>

          <div className="lg:col-span-7 space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto no-scrollbar pr-1">
            <EligibilityResults
              results={results}
              loading={loading}
              isPrinting={isPrinting}
              copiedShare={copiedShare}
              navigatingSchemeId={navigatingSchemeId}
              onShareWhatsApp={handleShareWhatsApp}
              onPrint={handlePrint}
              onNavigateScheme={(id) => setNavigatingSchemeId(id)}
            />
          </div>
        </div>
      </div>

      {/* Official A4 Citizen Entitlement Dossier for Print & CSC / Setu Centers */}
      {results && (
        <PrintDossier
          results={results}
          formData={formData}
          printMeta={printMeta}
        />
      )}
    </>
  );
}
