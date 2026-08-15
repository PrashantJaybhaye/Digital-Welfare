"use client";

import { useState } from 'react';
import { Scheme, formatCategoryName, getSchemeDocuments, getSchemeApplicationSteps, getEstimatedBenefit } from '@/types/scheme';
import Link from 'next/link';
import { 
  ArrowLeft, ExternalLink, Calendar, CheckCircle2, Building2, MapPin, 
  Share2, FileText, CheckSquare, Square, ShieldCheck, Sparkles, 
  HelpCircle, Printer, Bookmark, BookmarkCheck
} from 'lucide-react';

export default function SchemeDetailView({ scheme }: { scheme: Scheme }) {
  const documents = getSchemeDocuments(scheme);
  const steps = getSchemeApplicationSteps(scheme);
  const benefit = getEstimatedBenefit(scheme);

  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && scheme.id) {
      const saved = JSON.parse(localStorage.getItem('saved_schemes') || '[]');
      return saved.includes(scheme.id);
    }
    return false;
  });
  const [copied, setCopied] = useState(false);

  const toggleDoc = (idx: number) => {
    setCheckedDocs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleBookmark = () => {
    if (typeof window === 'undefined' || !scheme.id) return;
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
  };

  const handleShareWhatsApp = () => {
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
    window.print();
  };

  const completedDocsCount = Object.values(checkedDocs).filter(Boolean).length;
  const docsProgress = Math.round((completedDocsCount / documents.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between mb-8">
        <Link 
          href="/schemes" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all schemes
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleBookmark}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
              isBookmarked 
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-600" /> : <Bookmark className="w-4 h-4 text-slate-400" />}
            {isBookmarked ? 'Saved' : 'Save Scheme'}
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
            title="Share on WhatsApp"
          >
            <Share2 className="w-4 h-4" /> Share on WhatsApp
          </button>

          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
            title="Print Scheme Details"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Print
          </button>
        </div>
      </div>

      {/* Main Card Header */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-8">
        <div className="p-8 md:p-10 border-b border-slate-100 bg-linear-to-br from-slate-50 via-white to-primary-50/30">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-800">
              <Building2 className="w-3.5 h-3.5 mr-1.5" /> {formatCategoryName(scheme.category)}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <MapPin className="w-3.5 h-3.5 mr-1" /> {scheme.state || 'All India'}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Direct Citizen Support
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
            {scheme.title}
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-4xl">
            {scheme.description}
          </p>

          {/* Highlighted Estimated Benefit Banner */}
          <div className="mt-6 inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl bg-primary-600 text-white shadow-md">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-primary-200">Estimated Support Value</p>
              <p className="text-base font-extrabold">{benefit.label}</p>
            </div>
          </div>
        </div>

        {/* 2-Column Content Grid */}
        <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Column: Benefits, Documents Checklist, Application Roadmap */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Key Benefits */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Key Benefits & Entitlements
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scheme.benefits?.length ? scheme.benefits.map((benefitItem, i) => (
                  <div key={i} className="flex items-start gap-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                    <span className="text-emerald-600 font-bold text-lg mt-0.5">✓</span>
                    <span className="text-slate-700 text-sm font-medium">{benefitItem}</span>
                  </div>
                )) : (
                  <div className="p-4 rounded-xl bg-slate-50 text-slate-500 text-sm">Standard government welfare assistance provided.</div>
                )}
              </div>
            </section>

            {/* Interactive Document Checklist */}
            <section className="bg-slate-50/80 p-6 md:p-8 rounded-3xl border border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-600" /> Mandatory Documents Checklist
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Check off documents you have ready before applying</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-primary-700 bg-primary-100 px-3 py-1 rounded-full">
                    {completedDocsCount}/{documents.length} Ready ({docsProgress}%)
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-200 rounded-full mb-6 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${docsProgress}%` }}
                ></div>
              </div>

              <div className="space-y-2.5">
                {documents.map((doc, idx) => {
                  const isChecked = !!checkedDocs[idx];
                  return (
                    <div 
                      key={idx}
                      onClick={() => toggleDoc(idx)}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-emerald-50/70 border-emerald-200 text-slate-800' 
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <button type="button" className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-600">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                      <span className={`text-sm select-none ${isChecked ? 'line-through text-slate-500' : 'font-medium'}`}>
                        {doc}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                <span>💡 Missing documents? Keep digital copies verified on <strong>DigiLocker</strong>.</span>
                <a 
                  href="https://www.digilocker.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 font-semibold hover:underline flex items-center gap-1"
                >
                  Open DigiLocker <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </section>

            {/* Step-by-Step How to Apply Roadmap */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-primary-600" /> Step-by-Step Application Process
              </h2>
              
              <div className="space-y-4 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {steps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md ring-4 ring-white">
                      {idx + 1}
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 grow shadow-sm">
                      <h3 className="font-bold text-slate-900 text-base mb-1">{step.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar: Eligibility & Official Apply Action */}
          <div className="space-y-6">
            
            {/* Quick Action Card */}
            <div className="p-6 rounded-3xl bg-linear-to-b from-primary-50 to-white border border-primary-100 shadow-sm text-center">
              <h3 className="font-extrabold text-slate-900 text-lg mb-2">Ready to Apply?</h3>
              <p className="text-xs text-slate-600 mb-5">
                Submit your application directly through the official Government portal.
              </p>
              
              {scheme.applyLink ? (
                <a 
                  href={scheme.applyLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  Apply on Official Portal <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <button disabled className="w-full bg-slate-200 text-slate-500 font-semibold py-3.5 px-6 rounded-2xl cursor-not-allowed">
                  Portal Link Pending
                </button>
              )}

              <button 
                onClick={handleCopyLink}
                className="mt-3 text-xs text-primary-700 font-semibold hover:underline inline-flex items-center gap-1"
              >
                {copied ? '✓ Link copied to clipboard!' : 'Copy direct link to share'}
              </button>
            </div>

            {/* Eligibility Summary Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base mb-4 pb-2 border-b border-slate-100">
                Eligibility Summary
              </h3>
              
              <ul className="space-y-3.5 text-sm">
                <li className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Age Requirement:</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {scheme.minAge ? `${scheme.minAge}+` : 'Any'} {scheme.maxAge ? `to ${scheme.maxAge} yrs` : ''}
                  </span>
                </li>

                <li className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Income Cap:</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {scheme.maxIncome ? `Up to ₹${scheme.maxIncome.toLocaleString('en-IN')}` : 'No Strict Limit'}
                  </span>
                </li>

                <li className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Target Gender:</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {scheme.targetGender || 'All Genders (Any)'}
                  </span>
                </li>

                <li className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Target Group / Work:</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {scheme.targetOccupation || 'Open to All'}
                  </span>
                </li>

                <li className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">State / Region:</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {scheme.state || 'All India'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Helpline & Verification Info */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Government Scheme
              </div>
              <p>Applications are verified by the respective state or union ministries. Always ensure your bank account is Aadhaar-seeded for DBT benefits.</p>
              <div className="flex items-center gap-1 text-slate-400 pt-2 border-t border-slate-200">
                <Calendar className="w-3 h-3" />
                <span>Last updated: {new Date(scheme.lastSyncedAt).toLocaleDateString()}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
