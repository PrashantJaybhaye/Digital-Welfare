"use client";

import { useState, useEffect } from 'react';
import { Scheme, formatCategoryName, getSchemeDocuments, getSchemeApplicationSteps, getEstimatedBenefit } from '@/types/scheme';
import Link from 'next/link';
import {
  ArrowLeft, ExternalLink, Calendar, CheckCircle2, Building2, MapPin,
  Share2, FileText, CheckSquare, Square, ShieldCheck, Sparkles,
  HelpCircle, Printer, Bookmark, BookmarkCheck
} from 'lucide-react';
import Logo from '@/components/Logo';

export default function SchemeDetailView({ scheme }: { scheme: Scheme }) {
  const documents = getSchemeDocuments(scheme);
  const steps = getSchemeApplicationSteps(scheme);
  const benefit = getEstimatedBenefit(scheme);

  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>('Recently verified');
  const [printDate, setPrintDate] = useState<string>('');

  useEffect(() => {
    setPrintDate(new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }));

    if (scheme.id) {
      try {
        const saved: string[] = JSON.parse(localStorage.getItem('saved_schemes') || '[]');
        setIsBookmarked(saved.includes(scheme.id));
      } catch {
        // Ignore local storage error
      }
    }
    if (scheme.lastSyncedAt) {
      try {
        setFormattedDate(new Date(scheme.lastSyncedAt).toLocaleDateString('en-IN'));
      } catch {
        // Ignore date parse error
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
      // Ignore local storage error
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window === 'undefined') return;
    const shareUrl = window.location.href;
    const text = `🏛️ *${scheme.title}*\n\n${scheme.description.substring(0, 130)}...\n\n💰 *Benefit:* ${benefit.label}\n🔗 *Check eligibility & apply:* ${shareUrl}`;
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
    <>
      {/* Citizen View */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-12 print:hidden">

        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <Link
            href="/schemes"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to schemes
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleBookmark}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer shadow-2xs ${isBookmarked
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-800 border-slate-200/90 hover:border-slate-400'
                }`}
            >
              {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" /> : <Bookmark className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 hover:bg-emerald-100 transition-all cursor-pointer shadow-2xs"
              title="Share on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-200/90 text-slate-800 hover:border-slate-400 transition-all cursor-pointer shadow-2xs"
              title="Print Scheme Dossier"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Scheme</span>
            </button>
          </div>
        </div>

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

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#7eed9e]/20 border border-[#7eed9e]/50 text-slate-950 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span><span className="text-slate-500 font-normal mr-1">Estimated Support:</span>{benefit.label}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-5">
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
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${isChecked
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
                <span className="text-[11px]">Keep digital copies verified on <strong>DigiLocker</strong> for paperless onboarding.</span>
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

          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
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

      {/* Official Government Print Dossier */}
      <div className="hidden print:block bg-white text-slate-950 max-w-[210mm] mx-auto font-sans leading-normal">
        <div className="print-page-1">
          <div>
            <div className="border-b-2 border-slate-950 pb-3 mb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Logo size={38} color="#020617" />
                  <div>
                    <h1 className="text-[13px] font-black tracking-tight text-slate-950 uppercase leading-none">
                      National Public Welfare Portal • Government of India & States
                    </h1>
                    <p className="text-[9.5px] font-bold text-slate-600 uppercase tracking-wider mt-1">
                      Official Citizen Scheme Facilitation & Entitlement Dossier
                    </p>
                  </div>
                </div>

                <div className="text-right text-[9.5px] text-slate-600">
                  <p><span className="font-bold text-slate-900">Doc Ref:</span> DW-{(scheme.id || 'SCHEME').toUpperCase().slice(0, 12)}</p>
                  <p><span className="font-bold text-slate-900">Date:</span> {printDate || 'Live'}</p>
                  <span className="inline-block mt-0.5 text-[8.5px] font-bold text-emerald-800 uppercase">
                    ● Active Verified Directive
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5 mb-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8.5px] font-black px-2 py-0.5 rounded bg-slate-900 text-white uppercase tracking-wider">
                      {formatCategoryName(scheme.category)}
                    </span>
                    <span className="text-[9.5px] font-bold text-slate-700">
                      Region: {scheme.state || 'All India'}
                    </span>
                  </div>
                  <h2 className="text-base font-black text-slate-950 mt-0.5 leading-snug">
                    {scheme.title}
                  </h2>
                  <p className="text-[10.5px] text-slate-700 mt-1 leading-relaxed">
                    {scheme.description}
                  </p>
                </div>

                <div className="bg-white border-2 border-slate-900 rounded-lg p-2 text-center shrink-0 min-w-40 shadow-xs">
                  <span className="text-[8.5px] font-bold text-slate-500 uppercase block tracking-wider">Estimated Entitlement</span>
                  <span className="text-[11.5px] font-black text-slate-950 mt-0.5 block">{benefit.label}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2">
                1. Official Demographic & Eligibility Assessment Matrix
              </h3>
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[10px]">
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Age Eligibility</span>
                  <span className="font-bold text-slate-950">
                    {scheme.minAge ? `${scheme.minAge} Yrs` : 'No Min'} {scheme.maxAge ? `to ${scheme.maxAge} Yrs` : 'No Max'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Income Ceiling</span>
                  <span className="font-bold text-slate-950">
                    {scheme.maxIncome ? `Up to ₹${scheme.maxIncome.toLocaleString('en-IN')}/yr` : 'No Upper Cap'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Gender Coverage</span>
                  <span className="font-bold text-slate-950">{scheme.targetGender || 'All Genders'}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Target Occupation</span>
                  <span className="font-bold text-slate-950 truncate block">{scheme.targetOccupation || 'All Eligible Citizens'}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Social Category</span>
                  <span className="font-bold text-slate-950">{scheme.socialCategory || 'All Categories'}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Scheme Type</span>
                  <span className="font-bold text-slate-950">Direct Benefit Transfer (DBT)</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2">
                2. Direct Welfare Provisions & Financial Subsidies
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {scheme.benefits && scheme.benefits.length > 0 ? (
                  scheme.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="font-bold text-slate-900">•</span>
                      <span className="text-slate-800 leading-tight">{b}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-600 col-span-2">
                    Direct government welfare financial subsidy and assistance provided as per official nodal ministry guidelines.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-300 pt-2 flex justify-between items-center text-[9px] text-slate-500 font-medium">
            <span>Official Welfare Dossier • DW-{(scheme.id || 'SCHEME').toUpperCase().slice(0, 10)}</span>
            <span className="font-bold text-slate-900">Page 1 of 2 • (See Page 2 for Verification Checklist & Filing Procedure)</span>
          </div>
        </div>

        <div className="print-page-2">
          <div>
            <div className="border-b-2 border-slate-950 pb-2.5 mb-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Logo size={24} color="#020617" />
                <span className="text-[11px] font-black text-slate-950 uppercase tracking-tight">
                  Digital Welfare Guide • Document Verification & Filing Checklist
                </span>
              </div>
              <span className="text-[9.5px] font-bold text-slate-600">
                Scheme: {scheme.title.slice(0, 32)}... (Page 2 of 2)
              </span>
            </div>

            <div className="mb-3.5">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">
                3. Mandatory Citizen Verification Document Checklist
              </h3>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[9px] font-extrabold uppercase">
                    <th className="p-1.5 border-r border-slate-300 w-10 text-center">Ready</th>
                    <th className="p-1.5 border-r border-slate-300 w-7 text-center">#</th>
                    <th className="p-1.5">Required Document / Proof</th>
                    <th className="p-1.5 border-l border-slate-300 w-44">Issuing Authority / Portal</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, idx) => (
                    <tr key={idx} className="border-b border-slate-200 even:bg-slate-50/50">
                      <td className="p-1.5 border-r border-slate-300 text-center font-bold">
                        <span className="inline-block w-3.5 h-3.5 border-2 border-slate-900 rounded"></span>
                      </td>
                      <td className="p-1.5 border-r border-slate-300 text-center font-bold">{idx + 1}</td>
                      <td className="p-1.5 font-medium text-slate-900">{doc}</td>
                      <td className="p-1.5 border-l border-slate-300 text-[9.5px] text-slate-600">
                        UIDAI / Revenue / DigiLocker
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-3.5">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">
                4. Step-by-Step Application & Direct Benefit Transfer Roadmap
              </h3>
              <div className="space-y-1 text-[9.5px] text-slate-800">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="font-bold text-slate-950 shrink-0 w-4">{idx + 1}.</span>
                    <div>
                      <span className="font-bold text-slate-950">{step.title}: </span>
                      <span className="text-slate-700">{step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 p-2.5 bg-slate-50 border border-slate-300 rounded-lg mb-3">
              <div>
                <span className="text-[9px] font-extrabold uppercase text-slate-700 block mb-0.5">
                  Direct Benefit Transfer (DBT) Compliance:
                </span>
                <p className="text-[8.5px] text-slate-600 leading-tight">
                  1. Bank account must be seeded with Aadhaar and active on NPCI mapper.<br />
                  2. DigiLocker e-certificates are legally valid under IT Act 2000.<br />
                  3. Online Portal: {scheme.applyLink || 'https://www.india.gov.in'}
                </p>
              </div>
              <div className="border-l border-slate-300 pl-2.5 flex flex-col justify-between">
                <span className="text-[9px] font-extrabold uppercase text-slate-700 block">
                  CSC / Citizen Seva Kendra Facilitation Seal:
                </span>
                <div className="flex justify-between items-end pt-3 text-[8.5px] text-slate-500">
                  <span>Facilitator Signature: ________________</span>
                  <span>Date & Seal: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-300 pt-1.5 text-[8.5px] text-slate-500 flex justify-between items-center">
            <span>Disclaimer: Computer-generated citizen guidance dossier. Benefit sanction is subject to implementing ministry e-KYC verification.</span>
            <span className="font-bold text-slate-900 shrink-0 ml-2">Page 2 of 2 • End of Document</span>
          </div>
        </div>
      </div>
    </>
  );
}
