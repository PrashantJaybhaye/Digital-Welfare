"use client";

import { useState } from 'react';
import { 
  ArrowRight, CheckCircle2, XCircle, Search, ShieldCheck, 
  Download, Share2, Sparkles, RefreshCw, Printer, ExternalLink,
  Users, Building, Wallet, MapPin, Award
} from 'lucide-react';
import { Scheme, formatCategoryName, getEstimatedBenefit } from '@/types/scheme';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const INDIAN_STATES = [
  'All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

export default function EligibilityChecker() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ 
    eligible: Scheme[]; 
    notEligible: Scheme[];
    totalEstimatedBenefit: number;
    hasHealthInsuranceCover: boolean;
  } | null>(null);

  const [formData, setFormData] = useState({
    age: '',
    gender: 'Any',
    income: '',
    occupation: '',
    state: 'All India',
    socialCategory: 'All',
    isStudent: false,
    isFarmer: false,
    hasDisability: false,
  });

  const handleIncomeQuickSelect = (amount: number) => {
    setFormData(prev => ({ ...prev, income: amount.toString() }));
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const snapshot = await getDocs(collection(db, 'schemes'));
      const allSchemes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Scheme[];

      const eligible: Scheme[] = [];
      const notEligible: Scheme[] = [];

      const userAge = parseInt(formData.age) || 25;
      const userIncome = parseInt(formData.income) || 0;
      const userGender = formData.gender;
      const userOccupation = formData.occupation.toLowerCase();
      const userState = formData.state;

      allSchemes.forEach(scheme => {
        let isEligible = true;

        // Check Age
        if (scheme.minAge !== null && scheme.minAge !== undefined && userAge < scheme.minAge) isEligible = false;
        if (scheme.maxAge !== null && scheme.maxAge !== undefined && userAge > scheme.maxAge) isEligible = false;

        // Check Income
        if (scheme.maxIncome !== null && scheme.maxIncome !== undefined && userIncome > scheme.maxIncome) isEligible = false;

        // Check Gender
        if (scheme.targetGender && scheme.targetGender !== 'Any' && userGender !== 'Any' && scheme.targetGender !== userGender) {
          isEligible = false;
        }

        // Check State
        if (scheme.state && scheme.state !== 'All India' && userState !== 'All India' && scheme.state.toLowerCase() !== userState.toLowerCase()) {
          isEligible = false;
        }

        // Check Occupation & Profile Keywords
        if (scheme.targetOccupation && scheme.targetOccupation !== 'Any' && userOccupation) {
          const occLower = scheme.targetOccupation.toLowerCase();
          if (occLower !== 'any' && !occLower.includes(userOccupation) && !userOccupation.includes(occLower)) {
            isEligible = false;
          }
        }

        if (isEligible) {
          eligible.push(scheme);
        } else {
          notEligible.push(scheme);
        }
      });

      // Calculate Total Estimated Benefit
      let totalEst = 0;
      let healthCover = false;
      eligible.forEach(scheme => {
        const est = getEstimatedBenefit(scheme);
        if (est.amount === 500000) {
          healthCover = true;
        } else {
          totalEst += est.amount;
        }
      });

      setResults({ 
        eligible, 
        notEligible, 
        totalEstimatedBenefit: totalEst,
        hasHealthInsuranceCover: healthCover
      });

    } catch (error) {
      console.error("Error evaluating eligibility:", error);
      alert("Could not connect to database. Please ensure internet connectivity and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!results) return;
    const top3 = results.eligible.slice(0, 4).map((s, i) => `${i + 1}. *${s.title}*`).join('\n');
    const text = `🇮🇳 *My Welfare Schemes Report*\nI checked my eligibility on Digital Welfare Guide and found *${results.eligible.length} government schemes* available for me:\n\n${top3}\n\nCheck yours here: ${window.location.origin}/eligibility-check`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100 text-primary-800 text-xs font-bold mb-4">
          <Sparkles className="w-4 h-4" /> Smart Eligibility Engine
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Find All Schemes You Qualify For
        </h1>
        <p className="text-base md:text-lg text-slate-600 leading-relaxed">
          Answer a few quick questions about yourself to generate a personalized welfare report with exact subsidy amounts and document checklists.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Section */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-600" /> Enter Your Profile
          </h2>

          <form onSubmit={handleCheck} className="space-y-5">
            
            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Age (Years) *
                </label>
                <input 
                  type="number" 
                  required
                  min={1}
                  max={120}
                  placeholder="e.g. 24"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gender *
                </label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all text-sm font-medium"
                >
                  <option value="Any">All / Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Transgender</option>
                </select>
              </div>
            </div>

            {/* State / UT */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                State / Union Territory *
              </label>
              <select 
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all text-sm font-medium"
              >
                {INDIAN_STATES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Annual Income */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Annual Household Income (₹)
                </label>
                <span className="text-xs text-slate-400">Total family income</span>
              </div>
              <input 
                type="number" 
                placeholder="e.g. 180000"
                value={formData.income}
                onChange={(e) => setFormData({...formData, income: e.target.value})}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all text-sm font-medium mb-2"
              />

              {/* Quick Income Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '< ₹1 Lakh', val: 90000 },
                  { label: '< ₹2.5 Lakh (BPL)', val: 240000 },
                  { label: '< ₹5 Lakh', val: 480000 },
                  { label: '₹8 Lakh+ (Creamy Layer)', val: 850000 }
                ].map(chip => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => handleIncomeQuickSelect(chip.val)}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-primary-100 hover:text-primary-800 transition-colors"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Occupation / Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Occupation / Student Status *
              </label>
              <select 
                required
                value={formData.occupation}
                onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all text-sm font-medium"
              >
                <option value="">-- Choose Your Category --</option>
                <option value="Student">Student / Research Scholar</option>
                <option value="Farmer">Farmer / Agriculture Worker</option>
                <option value="Unemployed">Unemployed / Job Seeker</option>
                <option value="Worker">Daily Wage / Construction Worker / Artisan</option>
                <option value="Business">Small Business / MSME / Street Vendor</option>
                <option value="Employed">Salaried / Private Sector Employee</option>
                <option value="Senior Citizen">Senior Citizen (60+ years)</option>
              </select>
            </div>

            {/* Social Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Social Category (Reservation / Quota)
              </label>
              <select 
                value={formData.socialCategory}
                onChange={(e) => setFormData({...formData, socialCategory: e.target.value})}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all text-sm font-medium"
              >
                <option value="All">All / General</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="SC/ST">SC / ST (Scheduled Castes & Tribes)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
                <option value="Minority">Religious Minority Community</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-extrabold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-primary-600/30 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" /> Analyzing 100+ Schemes...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" /> Calculate My Eligibility
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7 space-y-6">
          {!results && !loading && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-20 h-20 mb-5 rounded-3xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-inner">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Instant Eligibility & Subsidy Report</h3>
              <p className="text-sm text-slate-500 max-w-md leading-relaxed">
                Fill in your age, state, and occupation on the left. We will scan central & state welfare databases to compute all programs you qualify for.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-14 h-14 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mb-4"></div>
              <h4 className="text-lg font-bold text-slate-800 mb-1">Scanning Live Central & State Datasets...</h4>
              <p className="text-xs text-slate-500">Checking income ceilings, reservations, age limits & subsidy rules</p>
            </div>
          )}

          {results && !loading && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Financial Benefit Summary Banner */}
              <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6 mb-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider text-primary-100 mb-2">
                      <Sparkles className="w-3.5 h-3.5" /> Your Welfare Snapshot
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold">
                      {results.eligible.length} Schemes Available
                    </h3>
                  </div>

                  {/* Share & Print Toolbar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShareWhatsApp}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Share2 className="w-4 h-4" /> Share on WhatsApp
                    </button>
                    <button
                      onClick={handlePrint}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Printer className="w-4 h-4" /> Print
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <p className="text-xs font-medium text-primary-200 uppercase tracking-wider">Est. Annual Direct Benefit</p>
                    <p className="text-2xl font-extrabold mt-1">
                      {results.totalEstimatedBenefit > 0 ? `₹${results.totalEstimatedBenefit.toLocaleString('en-IN')}+` : 'Direct Citizen Grant'}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <p className="text-xs font-medium text-primary-200 uppercase tracking-wider">Healthcare Protection</p>
                    <p className="text-2xl font-extrabold mt-1">
                      {results.hasHealthInsuranceCover ? '₹5 Lakh Health Cover' : 'Hospital & OPD Cover'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Eligible Schemes List */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h4 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> 
                  Qualified Schemes ({results.eligible.length})
                </h4>

                {results.eligible.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-slate-600 font-medium">No direct scheme matches with current strict filters.</p>
                    <p className="text-xs text-slate-400 mt-1">Try widening your income or state selection.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results.eligible.map(scheme => {
                      const benefit = getEstimatedBenefit(scheme);
                      return (
                        <div 
                          key={scheme.id}
                          className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50/70 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                        >
                          <div className="grow">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-200/60 text-emerald-900">
                                {formatCategoryName(scheme.category)}
                              </span>
                              <span className="text-[11px] font-semibold text-emerald-700">
                                {benefit.label}
                              </span>
                            </div>
                            <h5 className="font-bold text-slate-900 text-base">{scheme.title}</h5>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{scheme.description}</p>
                          </div>

                          <div className="shrink-0">
                            <Link 
                              href={`/schemes/${scheme.id}`} 
                              className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all whitespace-nowrap"
                            >
                              Check Documents <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Ineligible List Accordion */}
              {results.notEligible.length > 0 && (
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-slate-400" /> 
                    Other Schemes Not Matching Current Age/Income Criteria ({results.notEligible.length})
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {results.notEligible.map(scheme => (
                      <div key={scheme.id} className="p-3 bg-white rounded-xl border border-slate-200/60 flex justify-between items-center text-xs opacity-75">
                        <span className="font-semibold text-slate-700 truncate max-w-sm">{scheme.title}</span>
                        <Link href={`/schemes/${scheme.id}`} className="text-primary-600 font-semibold hover:underline shrink-0">
                          View Rules
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
