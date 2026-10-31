"use client";

import React from 'react';
import Logo from '@/components/Logo';
import { formatCategoryName, getEstimatedBenefit, getSchemeDocuments } from '@/types/scheme';
import { EligibilityResult } from '@/lib/eligibility-engine';
import { EligibilityFormData } from './EligibilityForm';

interface PrintDossierProps {
  results: EligibilityResult;
  formData: EligibilityFormData;
  printMeta: {
    refSuffix: string;
    printDate: string;
  };
}

export default function PrintDossier({ results, formData, printMeta }: PrintDossierProps) {
  const isMultiPage = results.eligible.length > 6;
  const page1Schemes = results.eligible.slice(0, isMultiPage ? 7 : 6);
  const page2Schemes = isMultiPage ? results.eligible.slice(7, 14) : [];

  return (
    <div className="hidden print:block bg-white text-slate-950 w-full font-sans leading-normal print-page-container">
      {/* ================= PAGE 1 ================= */}
      <div className="flex flex-col justify-between min-h-[250mm]">
        <div>
          {/* Directorate Masthead */}
          <div className="border-b-2 border-slate-950 pb-3 mb-3 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Logo size={38} color="#020617" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 leading-none">
                  National Public Welfare Portal • Government of India & States
                </p>
                <h1 className="text-base sm:text-lg font-black text-slate-950 tracking-tight mt-1 leading-tight">
                  Citizen Scheme Eligibility & Welfare Entitlement Dossier
                </h1>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  Official Automated Direct Benefit Assessment & Verification Record
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-300 font-mono text-[10px] font-bold">
                REF: DWG/{formData.age || '0'}{formData.gender?.[0] || 'X'}-{printMeta.refSuffix}
              </span>
              <p className="text-[9.5px] text-slate-600 mt-0.5">Date: {printMeta.printDate || 'Live'}</p>
              <p className="text-[9px] font-extrabold text-emerald-800 uppercase mt-0.5">
                ● Status: Verified & Eligible {isMultiPage ? '(Page 1 of 2)' : '(Single Page Dossier)'}
              </p>
            </div>
          </div>

          {/* Citizen Demographics & Welfare Summary */}
          <div className="grid grid-cols-2 gap-3.5 mb-3.5">
            <div className="border border-slate-300 rounded-xl p-3 bg-slate-50/70">
              <h2 className="text-[10.5px] font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">
                1. Citizen Demographic Assessment
              </h2>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
                <div>
                  <span className="text-[8.5px] font-bold text-slate-500 uppercase block">Age / Gender</span>
                  <span className="font-bold text-slate-950">
                    {formData.age ? `${formData.age} Yrs` : 'Any'} / {formData.gender || 'Any'}
                  </span>
                </div>
                <div>
                  <span className="text-[8.5px] font-bold text-slate-500 uppercase block">Residence State</span>
                  <span className="font-bold text-slate-950">{formData.state || 'All India'}</span>
                </div>
                <div>
                  <span className="text-[8.5px] font-bold text-slate-500 uppercase block">Annual Family Income</span>
                  <span className="font-bold text-slate-950">
                    {formData.income ? `₹${Number(formData.income).toLocaleString('en-IN')}` : 'Any'}
                  </span>
                </div>
                <div>
                  <span className="text-[8.5px] font-bold text-slate-500 uppercase block">Occupation / Category</span>
                  <span className="font-bold text-slate-950 truncate block">
                    {formData.occupation || 'General'} ({formData.socialCategory || 'All'})
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-slate-300 rounded-xl p-3 bg-slate-50/70 flex flex-col justify-between">
              <h2 className="text-[10.5px] font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">
                2. Welfare Potential Summary
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-slate-950 text-white">
                  <span className="text-[8px] font-bold uppercase text-slate-300 block">Matching Schemes</span>
                  <span className="text-xs font-black text-[#7eed9e]">
                    {results.eligible.length} Programs Qualified
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-300">
                  <span className="text-[8px] font-bold uppercase text-slate-500 block">Est. Direct Support</span>
                  <span className="text-[11px] font-black text-slate-950 truncate block">
                    {results.estimatedBenefitLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Qualified Schemes Table - Page 1 */}
          <div className="mb-2">
            <div className="flex justify-between items-center border-b border-slate-300 pb-1 mb-1.5">
              <h2 className="text-[10.5px] font-black uppercase tracking-wider text-slate-950">
                3. Qualified Welfare Programs & Direct Benefits
              </h2>
              <span className="text-[8.5px] font-bold text-slate-600">
                {isMultiPage
                  ? `Showing Top Priority Schemes 1 to 7 of ${results.eligible.length}`
                  : `Showing All ${results.eligible.length} Qualified Schemes`}
              </span>
            </div>

            <table className="w-full text-left border-collapse border border-slate-300 text-[9.5px]">
              <thead>
                <tr className="bg-slate-100 text-slate-900 border-b border-slate-300 text-[8.5px] font-black uppercase tracking-wider">
                  <th className="py-1 px-2 border-r border-slate-300 w-7 text-center">#</th>
                  <th className="py-1 px-2 border-r border-slate-300 w-5/12">Scheme Name & Classification</th>
                  <th className="py-1 px-2 border-r border-slate-300 w-3/12">Key Benefit / Grant</th>
                  <th className="py-1 px-2">Required Proof / Documents</th>
                </tr>
              </thead>
              <tbody>
                {page1Schemes.map((scheme, idx) => {
                  const benefit = getEstimatedBenefit(scheme);
                  const docs = getSchemeDocuments(scheme).slice(0, 3);
                  return (
                    <tr key={scheme.id || idx} className="border-b border-slate-200 even:bg-slate-50/50">
                      <td className="py-1 px-2 border-r border-slate-200 font-bold text-center align-top">
                        {idx + 1}
                      </td>
                      <td className="py-1 px-2 border-r border-slate-200 align-top">
                        <p className="font-black text-slate-950 text-[10px] leading-snug">{scheme.title}</p>
                        <span className="inline-block text-[8.5px] font-bold text-slate-600 mt-0.5">
                          {formatCategoryName(scheme.category)} • {scheme.state || 'All India'}
                        </span>
                      </td>
                      <td className="py-1 px-2 border-r border-slate-200 align-top font-bold text-slate-900 text-[9.5px]">
                        {benefit.label}
                      </td>
                      <td className="py-1 px-2 align-top text-[9px] text-slate-700">
                        <ul className="list-disc list-inside space-y-0.5">
                          {docs.map((doc, dIdx) => (
                            <li key={dIdx} className="leading-snug">
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* If single page, render the CSC verification block on Page 1 */}
          {!isMultiPage && (
            <div className="grid grid-cols-2 gap-3 p-2.5 bg-slate-50 border border-slate-300 rounded-xl mt-3 mb-2">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-800 block mb-0.5">
                  Mandatory Application Directives:
                </span>
                <p className="text-[8.5px] text-slate-700 leading-relaxed">
                  1. Verify digital certificates via DigiLocker for zero-rejection filing.
                  <br />
                  2. Bank account must be seeded with Aadhaar on NPCI mapper for Direct DBT.
                  <br />
                  3. Direct submission portal: <span className="font-bold text-slate-950">https://mahadbt2.maharashtra.gov.in</span>
                </p>
              </div>
              <div className="border-l border-slate-300 pl-3 flex flex-col justify-between">
                <span className="text-[9px] font-black uppercase text-slate-800 block">
                  Citizen Seva Kendra (CSC) / Setu Verification Stamp:
                </span>
                <div className="border border-dashed border-slate-400 rounded-lg p-2 mt-1 flex justify-between items-end text-[8px] text-slate-600 bg-white">
                  <span>Kiosk Operator Signature: ________________</span>
                  <span>Official Stamp & Date: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Page 1 Footer */}
        <div className="border-t border-slate-300 pt-1 text-[8px] text-slate-600 flex justify-between items-center">
          <span>Disclaimer: Computer-generated entitlement report. Final approval subject to nodal department e-KYC.</span>
          <span className="font-bold text-slate-950">
            {isMultiPage
              ? 'Page 1 of 2 • Continued on Page 2 →'
              : `REF: DWG/${formData.age || '0'}-${printMeta.refSuffix} • Official Single-Page Record`}
          </span>
        </div>
      </div>

      {/* ================= PAGE 2 (Rendered only if > 6 schemes) ================= */}
      {isMultiPage && (
        <div
          className="flex flex-col justify-between min-h-[260mm]"
          style={{ breakBefore: 'page', pageBreakBefore: 'always' }}
        >
          <div>
            {/* Page 2 Header */}
            <div className="border-b-2 border-slate-950 pb-2 mb-3 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Logo size={28} color="#020617" />
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-950">
                    Citizen Scheme Eligibility & Welfare Entitlement Dossier
                  </h2>
                  <p className="text-[9px] text-slate-600">
                    Continuation of Qualified Welfare Programs & Direct Benefits (Page 2 of 2)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                  REF: DWG/{formData.age || '0'}{formData.gender?.[0] || 'X'}-{printMeta.refSuffix}
                </span>
                <span className="block text-[8.5px] font-bold text-slate-500 mt-0.5">Page 2 of 2</span>
              </div>
            </div>

            {/* Schemes 8 to 14 Table */}
            <div className="mb-3">
              <table className="w-full text-left border-collapse border border-slate-300 text-[9.5px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 border-b border-slate-300 text-[8.5px] font-black uppercase tracking-wider">
                    <th className="py-1 px-2 border-r border-slate-300 w-7 text-center">#</th>
                    <th className="py-1 px-2 border-r border-slate-300 w-5/12">Scheme Name & Classification</th>
                    <th className="py-1 px-2 border-r border-slate-300 w-3/12">Key Benefit / Grant</th>
                    <th className="py-1 px-2">Required Proof / Documents</th>
                  </tr>
                </thead>
                <tbody>
                  {page2Schemes.map((scheme, idx) => {
                    const benefit = getEstimatedBenefit(scheme);
                    const docs = getSchemeDocuments(scheme).slice(0, 3);
                    return (
                      <tr key={scheme.id || idx} className="border-b border-slate-200 even:bg-slate-50/50">
                        <td className="py-1 px-2 border-r border-slate-200 font-bold text-center align-top">
                          {idx + 8}
                        </td>
                        <td className="py-1 px-2 border-r border-slate-200 align-top">
                          <p className="font-black text-slate-950 text-[10px] leading-snug">{scheme.title}</p>
                          <span className="inline-block text-[8.5px] font-bold text-slate-600 mt-0.5">
                            {formatCategoryName(scheme.category)} • {scheme.state || 'All India'}
                          </span>
                        </td>
                        <td className="py-1 px-2 border-r border-slate-200 align-top font-bold text-slate-900 text-[9.5px]">
                          {benefit.label}
                        </td>
                        <td className="py-1 px-2 align-top text-[9px] text-slate-700">
                          <ul className="list-disc list-inside space-y-0.5">
                            {docs.map((doc, dIdx) => (
                              <li key={dIdx} className="leading-snug">
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mandatory Filing Directives & CSC Verification Stamp Box */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-300 rounded-xl mb-3">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-800 block mb-0.5">
                  Mandatory Application Directives:
                </span>
                <p className="text-[8.5px] text-slate-700 leading-relaxed">
                  1. Verify digital certificates via DigiLocker for zero-rejection filing.
                  <br />
                  2. Bank account must be seeded with Aadhaar on NPCI mapper for Direct DBT.
                  <br />
                  3. Direct submission portal: <span className="font-bold text-slate-950">https://mahadbt2.maharashtra.gov.in</span>
                  <br />
                  4. Central schemes portal: <span className="font-bold text-slate-950">https://www.myscheme.gov.in</span>
                </p>
              </div>
              <div className="border-l border-slate-300 pl-3 flex flex-col justify-between">
                <span className="text-[9px] font-black uppercase text-slate-800 block">
                  Citizen Seva Kendra (CSC) / Setu Verification Stamp:
                </span>
                <div className="border border-dashed border-slate-400 rounded-lg p-2.5 mt-1 flex justify-between items-end text-[8px] text-slate-600 bg-white">
                  <span>Kiosk Operator Signature: ________________</span>
                  <span>Official Stamp & Date: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</span>
                </div>
              </div>
            </div>
          </div>

          {/* Page 2 Footer */}
          <div className="border-t border-slate-300 pt-1 text-[8px] text-slate-600 flex justify-between items-center">
            <span>Disclaimer: Computer-generated entitlement report. Final approval subject to physical/biometric verification.</span>
            <span className="font-bold text-slate-950">
              REF: DWG/{formData.age || '0'}-{printMeta.refSuffix} • Page 2 of 2 • Official Citizen Record
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

