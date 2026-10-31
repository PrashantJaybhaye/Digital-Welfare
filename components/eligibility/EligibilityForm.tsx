"use client";

import React from 'react';
import { Search, RefreshCw, Users, ShieldCheck } from 'lucide-react';
import { INDIAN_STATES } from '@/types/scheme';

export interface EligibilityFormData {
  age: string;
  gender: string;
  income: string;
  occupation: string;
  state: string;
  socialCategory: string;
}

interface EligibilityFormProps {
  formData: EligibilityFormData;
  setFormData: React.Dispatch<React.SetStateAction<EligibilityFormData>>;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onIncomeQuickSelect: (amount: number) => void;
}

export default function EligibilityForm({
  formData,
  setFormData,
  loading,
  onSubmit,
  onIncomeQuickSelect,
}: EligibilityFormProps) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-slate-900" /> Enter Your Profile
        </h2>
        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          Step 1 of 2
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Age (Years) *
            </label>
            <input
              type="number"
              required
              min={1}
              max={120}
              placeholder="e.g. 24"
              value={formData.age}
              onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50/60 border border-slate-200/80 focus:ring-2 focus:ring-slate-200 focus:bg-white outline-none transition-all text-xs font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Gender *
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50/60 border border-slate-200/80 focus:ring-2 focus:ring-slate-200 focus:bg-white outline-none transition-all text-xs font-medium text-slate-900 cursor-pointer"
            >
              <option value="Any">All / Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            State / Union Territory *
          </label>
          <select
            value={formData.state}
            onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl bg-slate-50/60 border border-slate-200/80 focus:ring-2 focus:ring-slate-200 focus:bg-white outline-none transition-all text-xs font-medium text-slate-900 cursor-pointer"
          >
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
              Annual Income (₹)
            </label>
            <span className="text-[10px] text-slate-400">Total family</span>
          </div>
          <input
            type="number"
            placeholder="e.g. 180000"
            value={formData.income}
            onChange={(e) => setFormData((prev) => ({ ...prev, income: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl bg-slate-50/60 border border-slate-200/80 focus:ring-2 focus:ring-slate-200 focus:bg-white outline-none transition-all text-xs font-medium text-slate-900 mb-1.5"
          />

          <div className="flex flex-wrap gap-1">
            {[
              { label: '< ₹1L', val: 90000 },
              { label: '< ₹2.5L (BPL)', val: 240000 },
              { label: '< ₹5L', val: 480000 },
              { label: '₹8L+', val: 850000 },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => onIncomeQuickSelect(chip.val)}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Primary Occupation / Student Status *
          </label>
          <select
            required
            value={formData.occupation}
            onChange={(e) => setFormData((prev) => ({ ...prev, occupation: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl bg-slate-50/60 border border-slate-200/80 focus:ring-2 focus:ring-slate-200 focus:bg-white outline-none transition-all text-xs font-medium text-slate-900 cursor-pointer"
          >
            <option value="">-- Choose Category --</option>
            <option value="Student">Student / Scholar</option>
            <option value="Farmer">Farmer / Agriculture</option>
            <option value="Unemployed">Unemployed / Job Seeker</option>
            <option value="Worker">Daily Wage / Construction</option>
            <option value="Business">Small Business / MSME</option>
            <option value="Employed">Salaried Employee</option>
            <option value="Senior Citizen">Senior Citizen (60+ yrs)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Social Category
          </label>
          <select
            value={formData.socialCategory}
            onChange={(e) => setFormData((prev) => ({ ...prev, socialCategory: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl bg-slate-50/60 border border-slate-200/80 focus:ring-2 focus:ring-slate-200 focus:bg-white outline-none transition-all text-xs font-medium text-slate-900 cursor-pointer"
          >
            <option value="All">All / General</option>
            <option value="OBC">OBC (Other Backward Classes)</option>
            <option value="SC/ST">SC / ST (Scheduled Castes & Tribes)</option>
            <option value="EWS">EWS (Economically Weaker Section)</option>
            <option value="Minority">Minority Community</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#7eed9e] hover:bg-[#69df8e] text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-2xs flex justify-center items-center gap-1.5 text-xs active:scale-98 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" /> Analyzing 100+ Schemes...
            </>
          ) : (
            <>
              <Search className="w-3.5 h-3.5 text-slate-950" /> Calculate My Eligibility
            </>
          )}
        </button>

        {/* DPDP Act 2023 & Citizen Privacy Commitment */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-700">DPDP Act 2023 Compliant</span>
          </div>
          <span className="text-[9.5px] text-slate-400">Zero PII / No Aadhaar Stored</span>
        </div>
      </form>
    </div>
  );
}

