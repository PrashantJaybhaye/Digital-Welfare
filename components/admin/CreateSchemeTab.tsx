"use client";

import React from 'react';
import { Plus, CheckCircle2, FileText, Users, Sparkles, X, RefreshCw, ArrowRight } from 'lucide-react';
import { Scheme, INDIAN_STATES } from '@/types/scheme';

interface CreateSchemeTabProps {
  newScheme: Partial<Scheme>;
  setNewScheme: React.Dispatch<React.SetStateAction<Partial<Scheme>>>;
  benefitInput: string;
  setBenefitInput: (val: string) => void;
  docInput: string;
  setDocInput: (val: string) => void;
  stepInput: string;
  setStepInput: (val: string) => void;
  savingScheme: boolean;
  createSuccess: boolean;
  addBenefitItem: (text?: string) => void;
  removeBenefitItem: (index: number) => void;
  addDocItem: (text?: string) => void;
  removeDocItem: (index: number) => void;
  addStepItem: () => void;
  removeStepItem: (index: number) => void;
  handleCreateScheme: (e: React.FormEvent) => void;
}

export default function CreateSchemeTab({
  newScheme,
  setNewScheme,
  benefitInput,
  setBenefitInput,
  docInput,
  setDocInput,
  stepInput,
  setStepInput,
  savingScheme,
  createSuccess,
  addBenefitItem,
  removeBenefitItem,
  addDocItem,
  removeDocItem,
  addStepItem,
  removeStepItem,
  handleCreateScheme,
}: CreateSchemeTabProps) {
  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 max-w-4xl mx-auto animate-fade-in">
      <div className="border-b border-slate-200 pb-4 mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Curated GovTech Catalog
        </div>
        <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
          <Plus className="w-5 h-5 text-slate-900" /> Ingest & Publish Welfare Scheme
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Publish verified Central or State public welfare schemes directly into Cloud Firestore with custom eligibility
          rules, document checklists, and application steps.
        </p>
      </div>

      {createSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-bold mb-6 flex items-center gap-2.5 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          Scheme successfully published to Cloud Firestore! Visible across all citizen search and eligibility engines.
        </div>
      )}

      <form onSubmit={handleCreateScheme} className="space-y-6 text-xs">
        {/* Section 1: Basic Information */}
        <div className="space-y-4 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/60">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-700" /> 1. Scheme Identification & Department
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Scheme Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojana"
                value={newScheme.title || ''}
                onChange={(e) => setNewScheme({ ...newScheme, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 font-semibold text-slate-950 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-950 outline-none text-xs sm:text-sm shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Department / Ministry *</label>
              <input
                type="text"
                required
                placeholder="e.g. Directorate of Higher Education (DHE)"
                value={newScheme.department || ''}
                onChange={(e) => setNewScheme({ ...newScheme, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-950 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">State / Jurisdiction *</label>
              <select
                value={newScheme.state || 'Maharashtra'}
                onChange={(e) => setNewScheme({ ...newScheme, state: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 font-medium text-slate-900 focus:ring-2 focus:ring-slate-950 outline-none text-xs cursor-pointer"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Scheme Classification / Category *
              </label>
              <select
                value={newScheme.category || 'MahaDBT (College Student)'}
                onChange={(e) => setNewScheme({ ...newScheme, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 font-medium text-slate-900 focus:ring-2 focus:ring-slate-950 outline-none text-xs cursor-pointer"
              >
                <optgroup label="MahaDBT 2.0 Official Categories">
                  <option value="MahaDBT (College Student)">College Student (MahaScholarship / Higher Education)</option>
                  <option value="MahaDBT (School Student)">School Student (Pre-Matric & Secondary Education)</option>
                  <option value="Agriculture & Krishi (MahaDBT / MP-SIMS)">
                    Farmer (Krishi, Irrigation & Farm Subsidies)
                  </option>
                  <option value="MahaDBT (Pensioner & Special Assistance)">Pensioner & Special Assistance Schemes</option>
                  <option value="MahaDBT (Divyang Welfare)">Divyang Welfare (Disability Support & Grants)</option>
                  <option value="MahaDBT (Women, Labour & Other Welfare)">
                    Women Empowerment, Labor & Other Welfare Schemes
                  </option>
                </optgroup>
                <optgroup label="Central Government Categories">
                  <option value="Central Sector Scheme">Central Sector Scheme (100% Union Funded)</option>
                  <option value="Centrally Sponsored Scheme">Centrally Sponsored Scheme (Central + State)</option>
                  <option value="Climate Change Programme">Climate Change Programme (CCP)</option>
                  <option value="General Welfare">General Public Welfare</option>
                </optgroup>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Official Description & Objectives *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Comprehensive summary describing target beneficiaries, subsidy breakdown, institutional criteria, and government objectives..."
                value={newScheme.description || ''}
                onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 font-normal text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-950 outline-none text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Target Demographics & Eligibility Criteria */}
        <div className="space-y-4 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/60">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-700" /> 2. Eligibility Criteria & Demographics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Gender</label>
              <select
                value={newScheme.targetGender || 'Any'}
                onChange={(e) =>
                  setNewScheme({ ...newScheme, targetGender: e.target.value as 'Male' | 'Female' | 'Any' })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900"
              >
                <option value="Any">Any Gender (All Citizens)</option>
                <option value="Female">Female Only (Women & Girls)</option>
                <option value="Male">Male Only</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Occupation</label>
              <select
                value={newScheme.targetOccupation || 'All Citizens'}
                onChange={(e) => setNewScheme({ ...newScheme, targetOccupation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900"
              >
                <option value="All Citizens">All Citizens</option>
                <option value="Student">Student (School / College / Higher Ed)</option>
                <option value="Farmer">Farmer (Landholder / Tenant)</option>
                <option value="Worker">Worker / Construction / Labour (BOCW)</option>
                <option value="Senior Citizen">Senior Citizen / Pensioner</option>
                <option value="Persons with Disabilities">Persons with Disabilities (Divyang)</option>
                <option value="Unemployed">Unemployed / Job Seeker / Youth</option>
                <option value="Artisan">Artisan / Traditional Craftsman</option>
                <option value="Entrepreneur">Entrepreneur / MSME / Startup</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Social Category</label>
              <select
                value={newScheme.socialCategory || 'All'}
                onChange={(e) =>
                  setNewScheme({
                    ...newScheme,
                    socialCategory: e.target.value as NonNullable<Scheme['socialCategory']>,
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900"
              >
                <option value="All">All Categories (Open / Universal)</option>
                <option value="SC/ST">SC / ST (Scheduled Castes & Tribes)</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="VJNT">VJNT (Vimukta Jati & Nomadic Tribes)</option>
                <option value="SBC">SBC (Special Backward Class)</option>
                <option value="EWS">EWS / EBC (Economically Weaker Section)</option>
                <option value="Minority">Religious Minority (Muslim, Christian, Buddhist, Jain)</option>
                <option value="General">General / Open Category Only</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Min Age (Years)</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 18 (leave blank if none)"
                value={newScheme.minAge ?? ''}
                onChange={(e) =>
                  setNewScheme({ ...newScheme, minAge: e.target.value ? parseInt(e.target.value) : null })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Max Age (Years)</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 60 (leave blank if none)"
                value={newScheme.maxAge ?? ''}
                onChange={(e) =>
                  setNewScheme({ ...newScheme, maxAge: e.target.value ? parseInt(e.target.value) : null })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Annual Income Ceiling (₹)</label>
              <input
                type="number"
                step="5000"
                placeholder="e.g. 250000 or 800000"
                value={newScheme.maxIncome ?? ''}
                onChange={(e) =>
                  setNewScheme({ ...newScheme, maxIncome: e.target.value ? parseInt(e.target.value) : null })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Financial Benefit & Application Portal */}
        <div className="space-y-4 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/60">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-slate-700" /> 3. Direct Subsidies & Official Portal Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Financial Benefit Label (Display)
              </label>
              <input
                type="text"
                placeholder="e.g. ₹1,500 / Month Direct DBT Transfer or 50% Tuition Fee Waiver"
                value={newScheme.financialBenefitText || ''}
                onChange={(e) => setNewScheme({ ...newScheme, financialBenefitText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Estimated Annual Value (₹)</label>
              <input
                type="number"
                step="1000"
                placeholder="e.g. 18000 or 500000"
                value={newScheme.estimatedBenefitAmount ?? ''}
                onChange={(e) =>
                  setNewScheme({
                    ...newScheme,
                    estimatedBenefitAmount: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Official Portal Application URL (MahaDBT 2.0 / Central)
              </label>
              <input
                type="url"
                placeholder="https://mahadbt2.maharashtra.gov.in/home"
                value={newScheme.applyLink || ''}
                onChange={(e) => setNewScheme({ ...newScheme, applyLink: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Key Scheme Benefits */}
        <div className="space-y-3 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/60">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4. Key Benefits & Subsidies ({newScheme.benefits?.length || 0})
            </label>
            <span className="text-[10px] text-slate-500">Press Enter or click Add</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter a specific benefit (e.g. 100% exam fee reimbursement)..."
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addBenefitItem();
                }
              }}
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900"
            />
            <button
              type="button"
              onClick={() => addBenefitItem()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Add Benefit
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400 font-medium self-center mr-1">Quick Add:</span>
            {[
              'Direct monthly DBT bank transfer',
              '100% Tuition & Exam fee waiver',
              '₹5 Lakh cashless health cover per family',
              '50% Capital subsidy on farm equipment',
              'Free hostel accommodation allowance',
            ].map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => addBenefitItem(sug)}
                className="text-[10px] font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
              >
                + {sug}
              </button>
            ))}
          </div>

          {/* Active Benefits Pills */}
          <div className="space-y-1.5 pt-2">
            {newScheme.benefits?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs"
              >
                <span className="font-medium text-slate-900">• {item}</span>
                <button
                  type="button"
                  onClick={() => removeBenefitItem(idx)}
                  className="text-rose-500 hover:text-rose-700 font-bold p-1 rounded hover:bg-rose-50 cursor-pointer"
                  title="Remove benefit"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Required Documents Checklist */}
        <div className="space-y-3 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/60">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              5. Required Documents Checklist ({newScheme.requiredDocuments?.length || 0})
            </label>
            <span className="text-[10px] text-slate-500">Citizen verification checklist</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter required certificate or proof (e.g. 7/12 Land Extract)..."
              value={docInput}
              onChange={(e) => setDocInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addDocItem();
                }
              }}
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900"
            />
            <button
              type="button"
              onClick={() => addDocItem()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Add Document
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400 font-medium self-center mr-1">Common Proofs:</span>
            {[
              'Aadhaar Card (Identity Proof)',
              'Bank Account Passbook (Aadhaar Seeded)',
              'Maharashtra Domicile Certificate',
              'Income Certificate (Issued by Tehsildar)',
              'Caste Certificate & Validity',
              '7/12 & 8-A Land Ownership Record',
              'College Fee Receipt & Bonafide Certificate',
            ].map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => addDocItem(sug)}
                className="text-[10px] font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
              >
                + {sug}
              </button>
            ))}
          </div>

          {/* Active Document Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {newScheme.requiredDocuments?.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs"
              >
                <span className="font-medium text-slate-900 truncate mr-2">📄 {doc}</span>
                <button
                  type="button"
                  onClick={() => removeDocItem(idx)}
                  className="text-rose-500 hover:text-rose-700 font-bold p-1 rounded hover:bg-rose-50 shrink-0 cursor-pointer"
                  title="Remove document"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Steps to Apply */}
        <div className="space-y-3 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/60">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              6. Step-by-Step Application Guide ({newScheme.stepsToApply?.length || 0} Steps)
            </label>
            <span className="text-[10px] text-slate-500">Citizen application journey</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter next application step..."
              value={stepInput}
              onChange={(e) => setStepInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addStepItem();
                }
              }}
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900"
            />
            <button
              type="button"
              onClick={addStepItem}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Add Step
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {newScheme.stepsToApply?.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs"
              >
                <div className="flex items-start gap-2 min-w-0 pr-2">
                  <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                    Step {idx + 1}
                  </span>
                  <span className="font-medium text-slate-900">{step}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeStepItem(idx)}
                  className="text-rose-500 hover:text-rose-700 font-bold p-1 rounded hover:bg-rose-50 shrink-0 cursor-pointer"
                  title="Remove step"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={savingScheme}
            className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2 text-sm active:scale-98 cursor-pointer disabled:opacity-60"
          >
            {savingScheme ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#7eed9e]" />
                <span>Committing Scheme to Cloud Firestore...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-[#7eed9e]" />
                <span>Publish Official Welfare Scheme</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

