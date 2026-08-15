"use client";

import { useState, useEffect } from 'react';
import { Scheme, formatCategoryName, getSchemeDocuments, getSchemeApplicationSteps, getEstimatedBenefit } from '@/types/scheme';
import Link from 'next/link';
import { 
  ArrowLeft, ExternalLink, Calendar, CheckCircle2, Building2, MapPin, 
  Share2, FileText, CheckSquare, Square, ShieldCheck, Sparkles, 
  HelpCircle, Printer, Bookmark, BookmarkCheck, ArrowRight, Check
} from 'lucide-react';

export default function SchemeDetailView({ scheme }: { scheme: Scheme }) {
  const documents = getSchemeDocuments(scheme);
  const steps = getSchemeApplicationSteps(scheme);
  const benefit = getEstimatedBenefit(scheme);

  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>('Recently verified');

  useEffect(() => {
    if (scheme.id) {
      try {
        const saved: string[] = JSON.parse(localStorage.getItem('saved_schemes') || '[]');
        setIsBookmarked(saved.includes(scheme.id));
      } catch {
        // Fallback
      }
    }
    if (scheme.lastSyncedAt) {
      try {
        setFormattedDate(new Date(scheme.lastSyncedAt).toLocaleDateString());
      } catch {
        // Fallback
      }
    }
  }, [scheme.id, scheme.lastSyncedAt]);

  const toggleDoc = (idx: number) => {
    setCheckedDocs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleBookmark = () => {
    if (typeof window === 'undefined' || !scheme.id) return;
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('saved_schemes') || '[]');
      let updated: string[];
      if (isBookmarked) {
        updated = saved.filter(id => id !== scheme.id);
        setIsBookmarked(false);
      } else {
        updated = [...saved, scheme.id];
        setIsBookmarked(true);
      }
      localStorage.setItem('saved_schemes', JSON.stringify(updated));
    } catch {
      // Fallback
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window === 'undefined') return;
    const text = `Check out this government welfare scheme: *${scheme.title}*\n\n${scheme.description.substring(0, 140)}...\n\n🔗 Read full details and apply here: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const completedDocsCount = Object.values(checkedDocs).filter(Boolean).length;
  const docsProgress = documents.length > 0 ? Math.round((completedDocsCount / documents.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-12">
      
      {/* Top Navigation & Action Buttons */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <Link 
          href="/schemes" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to schemes
        </Link>

        <div className="flex items-center gap-1.5">
          {/* Bookmark Button */}
          <button
            onClick={toggleBookmark}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer shadow-2xs ${
              isBookmarked 
                ? 'bg-amber-50 text-amber-900 border-amber-300' 
                : 'bg-white text-slate-800 border-slate-200/90 hover:border-slate-400'
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" /> : <Bookmark className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-200/90 text-slate-800 hover:border-slate-400 transition-all cursor-pointer shadow-2xs"
            title="Share on WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Share</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-200/90 text-slate-800 hover:border-slate-400 transition-all cursor-pointer shadow-2xs"
            title="Print Details"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Scheme Hero Banner - Compact */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-2xs mb-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200/60">
            <Building2 className="w-3 h-3 mr-1 text-slate-500" /> {formatCategoryName(scheme.category)}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200/60">
            <MapPin className="w-3 h-3 mr-1 text-slate-400" /> {scheme.state || 'All India'}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-950 mb-2 leading-snug tracking-tight">
          {scheme.title}
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl font-normal mb-3.5">
          {scheme.description}
        </p>

        {/* Estimated Support Value Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#7eed9e]/20 border border-[#7eed9e]/50 text-slate-950 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span><span className="text-slate-500 font-normal mr-1">Estimated Support:</span>{benefit.label}</span>
        </div>
      </div>

      {/* 2-Column Main Content & Sticky Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Benefits, Checklists, Steps */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Key Benefits */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
            <h2 className="text-base font-bold text-slate-950 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Benefits & Entitlements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {scheme.benefits?.length ? scheme.benefits.map((benefitItem, i) => (
                <div key={i} className="flex items-start gap-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">✓</span>
                  <span className="text-slate-800 text-xs font-medium leading-snug">{benefitItem}</span>
                </div>
              )) : (
                <div className="p-3 rounded-lg bg-slate-50 text-slate-500 text-xs col-span-2 font-normal">
                  Standard direct public welfare assistance and subsidy provided.
                </div>
              )}
            </div>
          </div>

          {/* Interactive Document Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2.5">
              <div>
                <h2 className="text-base font-bold text-slate-950 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-900" /> Mandatory Document Checklist
                </h2>
                <p className="text-[11px] text-slate-500">Check off documents you have prepared before applying</p>
              </div>
              <span className="text-[11px] font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/60">
                {completedDocsCount}/{documents.length} Ready ({docsProgress}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-slate-100 rounded-full mb-3.5 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${docsProgress}%` }}
              />
            </div>

            <div className="space-y-1.5">
              {documents.map((doc, idx) => {
                const isChecked = !!checkedDocs[idx];
                return (
                  <div 
                    key={idx}
                    onClick={() => toggleDoc(idx)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isChecked 
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' 
                        : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <button type="button" className="shrink-0 text-slate-400">
                      {isChecked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                    <span className={`text-xs select-none ${isChecked ? 'line-through text-slate-400' : 'font-medium text-slate-800'}`}>
                      {doc}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-xs text-slate-500">
              <span className="text-[11px]">💡 Keep digital copies verified on <strong>DigiLocker</strong> for paperless onboarding.</span>
              <a 
                href="https://www.digilocker.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-900 font-bold hover:text-blue-600 inline-flex items-center gap-1 text-[11px]"
              >
                Open DigiLocker <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Step-by-Step Application Process */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
            <h2 className="text-base font-bold text-slate-950 mb-3.5 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-900" /> Step-by-Step Application Guide
            </h2>
            
            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {steps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-950 text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs ring-2 ring-white">
                    0{idx + 1}
                  </div>
                  <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100 grow">
                    <h3 className="font-bold text-slate-950 text-xs mb-0.5">{step.title}</h3>
                    <p className="text-slate-600 text-[11px] leading-relaxed font-normal">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Apply Action & Eligibility Summary */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
          
          {/* Quick Apply Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center">
            <h3 className="font-bold text-slate-950 text-sm mb-1">Apply for this Scheme</h3>
            <p className="text-[11px] text-slate-500 mb-3 font-normal">
              Direct submission through the verified government ministry portal.
            </p>
            
            {scheme.applyLink ? (
              <a 
                href={scheme.applyLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full bg-[#7eed9e] hover:bg-[#69df8e] text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 text-xs active:scale-98 cursor-pointer"
              >
                Apply on Official Portal <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <button disabled className="w-full bg-slate-100 text-slate-400 font-semibold py-2.5 px-4 rounded-xl cursor-not-allowed text-xs">
                Portal Link Pending
              </button>
            )}

            <button 
              onClick={handleCopyLink}
              className="mt-2.5 text-[11px] text-slate-600 hover:text-black font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              {copied ? '✓ Link copied!' : 'Copy direct link to share'}
            </button>
          </div>

          {/* Eligibility Summary Box */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h3 className="font-bold text-slate-950 text-xs mb-2.5 pb-2 border-b border-slate-100">
              Eligibility Criteria
            </h3>
            
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between items-center text-slate-600">
                <span className="font-medium text-[11px]">Age:</span>
                <span className="font-bold text-slate-950 text-right text-[11px]">
                  {scheme.minAge ? `${scheme.minAge}+` : 'Any'} {scheme.maxAge ? `to ${scheme.maxAge} yrs` : ''}
                </span>
              </li>

              <li className="flex justify-between items-center text-slate-600">
                <span className="font-medium text-[11px]">Income:</span>
                <span className="font-bold text-slate-950 text-right text-[11px]">
                  {scheme.maxIncome ? `Up to ₹${scheme.maxIncome.toLocaleString('en-IN')}` : 'No Limit'}
                </span>
              </li>

              <li className="flex justify-between items-center text-slate-600">
                <span className="font-medium text-[11px]">Gender:</span>
                <span className="font-bold text-slate-950 text-right text-[11px]">
                  {scheme.targetGender || 'All'}
                </span>
              </li>

              <li className="flex justify-between items-center text-slate-600">
                <span className="font-medium text-[11px]">Group:</span>
                <span className="font-bold text-slate-950 text-right text-[11px]">
                  {scheme.targetOccupation || 'Open to All'}
                </span>
              </li>

              <li className="flex justify-between items-center text-slate-600">
                <span className="font-medium text-[11px]">Region:</span>
                <span className="font-bold text-slate-950 text-right text-[11px]">
                  {scheme.state || 'All India'}
                </span>
              </li>
            </ul>
          </div>

          {/* Verification & Trust Badge */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Scheme
            </div>
            <p className="leading-relaxed text-[10px]">
              Verified with public ministry guidelines. Ensure bank account is Aadhaar-linked.
            </p>
            <div className="flex items-center gap-1 text-slate-400 pt-1 border-t border-slate-200/60 text-[9px]">
              <Calendar className="w-2.5 h-2.5" />
              <span>Status: {formattedDate}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
