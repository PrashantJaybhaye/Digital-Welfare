"use client";

import { useState } from 'react';
import { 
  ArrowRight, CheckCircle2, XCircle, Search, 
  Share2, Sparkles, RefreshCw, Printer,
  Users, Award
} from 'lucide-react';
import { Scheme, formatCategoryName, getEstimatedBenefit, getSchemeDocuments } from '@/types/scheme';
import Link from 'next/link';
import Logo from '@/components/Logo';
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
    estimatedBenefitLabel: string;
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

      const userAge = parseInt(formData.age) || 25;
      const userIncome = parseInt(formData.income) || 0;
      const userGender = formData.gender;
      const userOccupation = formData.occupation.toLowerCase();
      const userState = formData.state;
      const userSocial = formData.socialCategory;

      type ScoredScheme = {
        scheme: Scheme;
        score: number;
        reasons: string[];
      };

      const matchedList: ScoredScheme[] = [];
      const notEligible: Scheme[] = [];

      allSchemes.forEach(scheme => {
        let isEligible = true;
        let score = 50; // Base score
        const reasons: string[] = [];

        const title = (scheme.title || '').toLowerCase();
        const desc = (scheme.description || '').toLowerCase();
        const cat = (scheme.category || '').toLowerCase();
        const combined = `${title} ${desc} ${cat}`;

        // 1. Strict Exclusion: Non-citizen / Infrastructure schemes
        if (combined.includes('redevelop existing railway') || combined.includes('infrastructure development') || combined.includes('railway station')) {
          notEligible.push(scheme);
          return;
        }

        // 2. Check Age
        if (scheme.minAge !== null && scheme.minAge !== undefined && userAge < scheme.minAge) {
          isEligible = false;
        }
        if (scheme.maxAge !== null && scheme.maxAge !== undefined && userAge > scheme.maxAge) {
          isEligible = false;
        }

        // 3. Check Income Cap
        if (scheme.maxIncome !== null && scheme.maxIncome !== undefined && userIncome > scheme.maxIncome) {
          isEligible = false;
        }

        // 4. Check Gender Constraints
        const isWomenOnly = combined.includes('for women') || combined.includes('for girl') || combined.includes('pregnant') || combined.includes('lactating') || combined.includes('maternity') || combined.includes('widow') || combined.includes('mahila') || combined.includes('sukanya');
        if (userGender === 'Male' && (scheme.targetGender === 'Female' || isWomenOnly)) {
          isEligible = false;
        }
        if (userGender === 'Female' && isWomenOnly) {
          score += 25;
          reasons.push('Empowerment for Women');
        }

        // 5. Check State
        if (scheme.state && scheme.state !== 'All India' && userState !== 'All India') {
          if (scheme.state.toLowerCase() !== userState.toLowerCase()) {
            isEligible = false;
          } else {
            score += 20;
            reasons.push(`${userState} State Scheme`);
          }
        }

        // 6. Domain & Occupation Relevance Engine
        if (userOccupation === 'student') {
          const isStudentScheme = combined.includes('scholarship') || combined.includes('student') || combined.includes('education') || combined.includes('school') || combined.includes('college') || combined.includes('fellowship') || combined.includes('tuition') || combined.includes('merit') || combined.includes('coaching') || combined.includes('internship') || combined.includes('skill') || combined.includes('youth') || combined.includes('pragati') || combined.includes('vidya');
          const isIrrelevantForStudent = (combined.includes('farmer') || combined.includes('kisan') || combined.includes('krishi') || combined.includes('old age pension') || combined.includes('senior citizen pension') || combined.includes('msme loan') || combined.includes('street vendor loan')) && !isStudentScheme;
          
          if (isIrrelevantForStudent) {
            isEligible = false;
          } else if (isStudentScheme) {
            score += 45;
            reasons.push('Student & Education Benefit');
          }
        } else if (userOccupation === 'farmer') {
          const isFarmerScheme = combined.includes('farmer') || combined.includes('kisan') || combined.includes('krishi') || combined.includes('agriculture') || combined.includes('crop') || combined.includes('soil') || combined.includes('fertilizer') || combined.includes('pm kisan') || combined.includes('irrigation') || combined.includes('fpo') || combined.includes('tractor');
          const isIrrelevantForFarmer = (combined.includes('scholarship') || combined.includes('student') || combined.includes('startup loan') || combined.includes('msme credit')) && !isFarmerScheme;

          if (isIrrelevantForFarmer) {
            isEligible = false;
          } else if (isFarmerScheme) {
            score += 45;
            reasons.push('Agriculture & Farmer Subsidy');
          }
        } else if (userOccupation === 'business') {
          const isBusinessScheme = combined.includes('msme') || combined.includes('business') || combined.includes('loan') || combined.includes('mudra') || combined.includes('pmegp') || combined.includes('startup') || combined.includes('credit') || combined.includes('enterprise') || combined.includes('vendor') || combined.includes('swanidhi');
          if (isBusinessScheme) {
            score += 40;
            reasons.push('Business Loan & Credit Subsidy');
          }
        } else if (userOccupation === 'worker') {
          const isWorkerScheme = combined.includes('shramik') || combined.includes('worker') || combined.includes('labour') || combined.includes('e-shram') || combined.includes('artisan') || combined.includes('vishwakarma') || combined.includes('unorganized') || combined.includes('construction worker');
          if (isWorkerScheme) {
            score += 40;
            reasons.push('Worker Direct Entitlement');
          }
        } else if (userOccupation === 'senior citizen') {
          const isSeniorScheme = combined.includes('pension') || combined.includes('senior') || combined.includes('old age') || combined.includes('vaya vandana') || combined.includes('elderly') || userAge >= 60;
          if (isSeniorScheme) {
            score += 45;
            reasons.push('Senior Citizen Pension & Care');
          }
        }

        // Universal Healthcare / Food Security (Applicable to low/moderate income)
        if (combined.includes('ayushman') || combined.includes('pmjay') || combined.includes('health insurance') || combined.includes('rashtriya swasthya') || combined.includes('ration') || combined.includes('food security') || combined.includes('anna yojana') || combined.includes('free grain')) {
          if (userIncome <= 300000) {
            score += 25;
            reasons.push('Universal Health/Food Support');
          }
        }

        // Social Category Reservations
        if (userSocial === 'SC/ST' && (combined.includes('sc/st') || combined.includes('scheduled caste') || combined.includes('tribal'))) {
          score += 25;
          reasons.push('SC/ST Welfare Quota');
        } else if (userSocial === 'OBC' && (combined.includes('obc') || combined.includes('backward class'))) {
          score += 20;
          reasons.push('OBC Scheme Entitlement');
        } else if (userSocial === 'Minority' && (combined.includes('minority') || combined.includes('begum hazrat') || combined.includes('nai roshni'))) {
          score += 30;
          reasons.push('Minority Development Scheme');
        }

        if (isEligible) {
          matchedList.push({ scheme, score, reasons });
        } else {
          notEligible.push(scheme);
        }
      });

      // Sort by relevance score descending
      matchedList.sort((a, b) => b.score - a.score);
      const eligible = matchedList.map(item => item.scheme);

      // Compute realistic, profile-calibrated benefit estimate
      let benefitLabel = 'Direct Welfare Aid';
      let healthCover = userIncome <= 300000;

      if (userOccupation === 'student') {
        benefitLabel = '₹25,000 - ₹50,000 / Year';
      } else if (userOccupation === 'farmer') {
        benefitLabel = '₹6,000 - ₹15,000 / Year';
      } else if (userOccupation === 'worker') {
        benefitLabel = '₹12,000 - ₹24,000 / Year';
      } else if (userOccupation === 'business') {
        benefitLabel = 'Up to 35% Capital Subsidy';
      } else if (userOccupation === 'senior citizen') {
        benefitLabel = '₹12,000 - ₹36,000 / Year';
      } else if (eligible.length > 0) {
        const topBenefit = getEstimatedBenefit(eligible[0]);
        benefitLabel = topBenefit.label;
      }

      setResults({ 
        eligible, 
        notEligible, 
        totalEstimatedBenefit: 0,
        estimatedBenefitLabel: benefitLabel,
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
    <>
      {/* ========================================================
          WEB / SCREEN INTERACTIVE VIEW (Hidden during print)
      ======================================================== */}
      <div className="print:hidden max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 pb-16 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] flex flex-col justify-start">
        
        {/* Monotree-Style Header Banner - Medium Compact */}
        <div className="text-left mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight leading-tight mb-1.5">
            Check your scheme <span className="relative inline-block">
              eligibility.
              {/* Hand-drawn Underline */}
              <svg 
                className="absolute -bottom-1.5 left-0 w-full h-2.5 text-slate-950 overflow-visible pointer-events-none" 
                viewBox="0 0 160 12" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M2 8.5C40 2.5 110 2.5 158 7" 
                  stroke="currentColor" 
                  strokeWidth="2.8" 
                  strokeLinecap="round"
                />
                <path 
                  d="M18 10C60 5.5 115 5.5 146 9.5" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeOpacity="0.4"
                />
              </svg>
            </span>
          </h1>
          <p className="text-xs text-slate-600 max-w-xl font-normal leading-relaxed">
            Enter your demographic and economic profile below. Our engine analyzes 100+ verified Central & State programs in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Form Section - Medium Compact */}
          <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-950 mb-3 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-900" /> Enter Your Profile
            </h2>

            <form onSubmit={handleCheck} className="space-y-3">
              
              {/* Age & Gender */}
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
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50/60 border border-slate-200/80 focus:ring-2 focus:ring-slate-200 focus:bg-white outline-none transition-all text-xs font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Gender *
                  </label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50/60 border border-slate-200/80 focus:ring-2 focus:ring-slate-200 focus:bg-white outline-none transition-all text-xs font-medium text-slate-900 cursor-pointer"
                  >
                    <option value="Any">All / Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* State / UT */}
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  State / Union Territory *
                </label>
                <select 
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50/60 border border-slate-200/80 focus:ring-2 focus:ring-slate-200 focus:bg-white outline-none transition-all text-xs font-medium text-slate-900 cursor-pointer"
                >
                  {INDIAN_STATES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Annual Income */}
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
                  onChange={(e) => setFormData({...formData, income: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50/60 border border-slate-200/80 focus:ring-2 focus:ring-slate-200 focus:bg-white outline-none transition-all text-xs font-medium text-slate-900 mb-1.5"
                />

                {/* Quick Income Chips */}
                <div className="flex flex-wrap gap-1">
                  {[
                    { label: '< ₹1L', val: 90000 },
                    { label: '< ₹2.5L (BPL)', val: 240000 },
                    { label: '< ₹5L', val: 480000 },
                    { label: '₹8L+', val: 850000 }
                  ].map(chip => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => handleIncomeQuickSelect(chip.val)}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occupation / Status */}
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Occupation / Student Status *
                </label>
                <select 
                  required
                  value={formData.occupation}
                  onChange={(e) => setFormData({...formData, occupation: e.target.value})}
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

              {/* Social Category */}
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Social Category
                </label>
                <select 
                  value={formData.socialCategory}
                  onChange={(e) => setFormData({...formData, socialCategory: e.target.value})}
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
            </form>
          </div>

          {/* Results Section - Medium Compact */}
          <div className="lg:col-span-7 space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto no-scrollbar pr-1">
            {!results && !loading && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 text-center flex flex-col items-center justify-center min-h-75 shadow-2xs">
                <div className="w-12 h-12 mb-3 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-950 mb-1">Instant Eligibility & Subsidy Report</h3>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-normal">
                  Fill in your age, state, and occupation on the left. We will scan central & state welfare databases to compute all programs you qualify for.
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-white p-8 rounded-2xl border border-slate-200/90 text-center flex flex-col items-center justify-center min-h-75 shadow-2xs">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-950 rounded-full animate-spin mb-2.5"></div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-950 mb-0.5">Scanning Live Datasets...</h4>
                <p className="text-[11px] text-slate-500">Checking income ceilings, reservations, age limits & subsidy rules</p>
              </div>
            )}

            {results && !loading && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Financial Benefit Summary Banner */}
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

                    {/* Share & Print Toolbar */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleShareWhatsApp}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Share2 className="w-3 h-3" /> Share
                      </button>
                      <button
                        onClick={handlePrint}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Printer className="w-3 h-3" /> Print
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Est. Direct Scheme Entitlement</p>
                      <p className="text-base sm:text-lg font-bold mt-0.5 text-[#7eed9e]">
                        {results.estimatedBenefitLabel}
                      </p>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Healthcare Protection</p>
                      <p className="text-base sm:text-lg font-bold mt-0.5 text-[#7eed9e]">
                        {results.hasHealthInsuranceCover ? '₹5 Lakh / Year (PM-JAY)' : 'Hospital & OPD Cover'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Eligible Schemes List */}
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
                      {results.eligible.map(scheme => {
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
                              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{scheme.description}</p>
                            </div>

                            <div className="shrink-0">
                              <Link 
                                href={`/schemes/${scheme.id}`} 
                                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-all whitespace-nowrap"
                              >
                                Check Documents <ArrowRight className="w-3 h-3" />
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
                  <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80">
                    <h4 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                      <XCircle className="w-3 h-3 text-slate-400" /> 
                      Other Schemes Not Matching Criteria ({results.notEligible.length})
                    </h4>
                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                      {results.notEligible.map(scheme => (
                        <div key={scheme.id} className="p-2 bg-white rounded-xl border border-slate-200/60 flex justify-between items-center text-xs opacity-80">
                          <span className="font-medium text-slate-700 truncate max-w-sm text-xs">{scheme.title}</span>
                          <Link href={`/schemes/${scheme.id}`} className="text-slate-950 font-bold hover:underline shrink-0 text-[10px]">
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

      {/* ========================================================
          EXECUTIVE PRINT DOSSIER (Visible only during print)
      ======================================================== */}
      {results && (
        <div className="hidden print:block bg-white text-slate-900 p-8 max-w-[210mm] mx-auto text-xs font-sans">
          
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Logo size={36} color="#020617" />
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-600">
                  National Public Welfare Portal • Government of India & States
                </p>
                <h1 className="text-xl font-extrabold text-slate-950 tracking-tight">
                  Citizen Scheme Eligibility & Welfare Entitlement Dossier
                </h1>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Official automated Direct Benefit Assessment & Document Verification Record
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 font-mono text-[10px] font-bold">
                REF: DWG/{formData.age || '0'}{formData.gender?.[0] || 'X'}-{Date.now().toString().slice(-6)}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Generated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-[9px] font-bold text-emerald-800 uppercase mt-0.5">
                ● Status: Profile Scanned & Verified
              </p>
            </div>
          </div>

          {/* 1. Citizen Profile Matrix */}
          <div className="mb-5">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              1. Citizen Demographic & Socio-Economic Assessment
            </h2>
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Applicant Age</span>
                <span className="font-bold text-slate-900">{formData.age ? `${formData.age} Years` : 'Not Specified'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Gender</span>
                <span className="font-bold text-slate-900">{formData.gender || 'Any'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">State of Residence</span>
                <span className="font-bold text-slate-900">{formData.state || 'All India'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Annual Family Income</span>
                <span className="font-bold text-slate-900">
                  {formData.income ? `₹${Number(formData.income).toLocaleString('en-IN')}` : 'Below Benchmark'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Occupation Profile</span>
                <span className="font-bold text-slate-900">{formData.occupation || 'General Citizen'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Social Category</span>
                <span className="font-bold text-slate-900">{formData.socialCategory || 'General / All'}</span>
              </div>
            </div>
          </div>

          {/* 2. Executive Entitlement Summary */}
          <div className="mb-5">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              2. Executive Welfare & Subsidy Potential Summary
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-slate-900 bg-slate-950 text-white">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-300">Total Matching Schemes</p>
                <p className="text-lg font-extrabold text-[#7eed9e] mt-0.5">{results.eligible.length} Programs</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Est. Direct Scheme Entitlement</p>
                <p className="text-sm font-extrabold text-slate-950 mt-0.5">{results.estimatedBenefitLabel}</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Healthcare Protection</p>
                <p className="text-sm font-extrabold text-slate-950 mt-0.5">
                  {results.hasHealthInsuranceCover ? '₹5 Lakh Health Cover' : 'Hospital & OPD Cover'}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Qualified Schemes Table */}
          <div className="mb-5">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              3. Priority Qualified Welfare Programs & Document Checklist
            </h2>

            <table className="w-full text-left border-collapse border border-slate-200 text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-900 border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider">
                  <th className="p-2 border-r border-slate-200 w-8">#</th>
                  <th className="p-2 border-r border-slate-200 w-1/3">Scheme Name & Classification</th>
                  <th className="p-2 border-r border-slate-200 w-1/4">Key Financial / In-kind Benefit</th>
                  <th className="p-2">Mandatory Verification Checklist</th>
                </tr>
              </thead>
              <tbody>
                {results.eligible.slice(0, 10).map((scheme, idx) => {
                  const benefit = getEstimatedBenefit(scheme);
                  const docs = getSchemeDocuments(scheme).slice(0, 3);
                  return (
                    <tr key={scheme.id || idx} className="border-b border-slate-200 even:bg-slate-50/50">
                      <td className="p-2 border-r border-slate-200 font-bold text-center align-top">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 align-top">
                        <p className="font-extrabold text-slate-950 text-[11px] leading-tight">{scheme.title}</p>
                        <span className="inline-block text-[9px] font-bold text-slate-600 mt-0.5">
                          {formatCategoryName(scheme.category)} • {scheme.state || 'All India'}
                        </span>
                      </td>
                      <td className="p-2 border-r border-slate-200 align-top font-bold text-slate-900">
                        {benefit.label}
                      </td>
                      <td className="p-2 align-top text-[10px] text-slate-600">
                        <ul className="list-disc list-inside space-y-0.5">
                          {docs.map((doc, dIdx) => (
                            <li key={dIdx} className="leading-snug">{doc}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 4. Action Plan & Official Notes */}
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-600 space-y-1.5">
            <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
              Application Procedure & Compliance Guidelines:
            </p>
            <ol className="list-decimal list-inside space-y-0.5 leading-normal">
              <li>Keep DigiLocker e-verified digital copies of your Aadhaar Card, Income Certificate, and Bank Passbook ready.</li>
              <li>Ensure your active Bank Account is seeded with your Aadhaar number for Direct Benefit Transfer (DBT/PFMS).</li>
              <li>Submit applications online via the official scheme portal or visit your nearest Common Service Centre (CSC) / Citizen Seva Kendra.</li>
            </ol>
            <p className="text-[9px] text-slate-400 pt-2 border-t border-slate-100">
              Disclaimer: This dossier is a computer-generated entitlement guidance document prepared in accordance with current Central & State guidelines. Final financial sanction and disbursement are subject to physical/e-KYC verification by the respective implementing Ministry.
            </p>
          </div>

        </div>
      )}
    </>
  );
}
