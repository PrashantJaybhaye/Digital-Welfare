"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, Search, ShieldCheck, HeartPulse, GraduationCap, 
  Sprout, Building, Users, Scale, FileCheck, 
  Sparkles, HelpCircle, Wallet, ChevronDown, CheckCircle2, ArrowUpRight
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const categories = [
    { name: 'Agriculture & Farmers', count: '24 Schemes', icon: Sprout, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Health & Wellness', count: '18 Schemes', icon: HeartPulse, color: 'text-rose-600', bg: 'bg-rose-50' },
    { name: 'Education & Skills', count: '32 Schemes', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Women & Children', count: '20 Schemes', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Housing & Shelter', count: '12 Schemes', icon: Building, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Social Security', count: '15 Schemes', icon: ShieldCheck, color: 'text-slate-700', bg: 'bg-slate-100' },
  ];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/schemes?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/schemes');
    }
  };

  const quickTags = [
    { label: 'PM-Kisan', query: 'Kisan' },
    { label: 'Ayushman Bharat', query: 'Ayushman' },
    { label: 'MahaDBT Scholarship', query: 'Scholarship' },
    { label: 'PMAY Housing', query: 'Awas' },
    { label: 'MSME Loans', query: 'PMEGP' }
  ];

  const faqs = [
    {
      q: "How does Direct Benefit Transfer (DBT) work?",
      a: "Under DBT, government financial assistance, subsidies, or scholarships are directly credited into your Aadhaar-seeded bank account without any intermediaries, ensuring 100% transparency and zero leakage."
    },
    {
      q: "What is the difference between Central Sector and Centrally Sponsored schemes?",
      a: "Central Sector Schemes are 100% funded and managed directly by the Union Government (e.g., PM-KISAN, PMEGP). Centrally Sponsored Schemes are co-funded by Central and State Governments and executed by States (e.g., MGNREGA, Ayushman Bharat)."
    },
    {
      q: "Can I use digital document copies from DigiLocker?",
      a: "Yes. Under Rule 9A of the Information Technology (Preservation and Retention of Information by Intermediaries Providing Digital Locker Facilities) Rules, digitally issued documents on DigiLocker are treated at par with original physical documents."
    },
    {
      q: "Is there any fee or charge to check eligibility or apply?",
      a: "No. This portal and all linked official government scheme portals are 100% free public services for all Indian citizens."
    }
  ];

  return (
    <div className="flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-28 md:pb-24 flex flex-col items-center text-center">
        
        {/* Gov Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/[0.08] text-slate-700 text-xs font-semibold mb-8 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Unified Citizen Welfare & Direct Subsidies</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-medium">Verified Official Data</span>
        </div>
        
        {/* Apple-style Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-950 tracking-tight mb-6 leading-[1.08] max-w-4xl">
          Every Public Scheme. <br />
          <span className="text-slate-400 font-medium">Calculated & Simplified.</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed font-normal">
          Check your direct eligibility in seconds, calculate financial subsidy entitlements, prepare verified document checklists, and apply directly on official portals.
        </p>

        {/* Spotlight-style Quick Search Bar */}
        <form onSubmit={handleHeroSearch} className="w-full max-w-2xl mb-6">
          <div className="relative flex items-center bg-white rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] border border-black/[0.08] p-2 hover:border-black/20 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by scheme name, keyword (e.g. Kisan, Ayushman, Scholarship)..."
              className="w-full px-3.5 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent outline-none font-medium"
            />
            <button
              type="submit"
              className="bg-slate-950 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 active:scale-98 shadow-sm"
            >
              Search
            </button>
          </div>
        </form>

        {/* Popular Quick-Filter Tokens */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <span className="text-xs text-slate-400 font-medium mr-1">Popular:</span>
          {quickTags.map((tag) => (
            <Link
              key={tag.label}
              href={`/schemes?search=${encodeURIComponent(tag.query)}`}
              className="px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 text-[11px] font-semibold text-slate-600 hover:text-slate-950 hover:border-slate-400 transition-all shadow-2xs"
            >
              {tag.label}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full justify-center max-w-md">
          <Link 
            href="/eligibility-check" 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98"
          >
            <Search className="w-4 h-4" />
            Check My Eligibility
          </Link>
          <Link 
            href="/schemes" 
            className="flex-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-2xs flex items-center justify-center gap-2 active:scale-98"
          >
            Browse Directory <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>

      </section>

      {/* Verified Civic Metric Ribbon */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-white rounded-3xl border border-black/[0.06] shadow-2xs">
            <p className="text-3xl font-extrabold text-slate-950 tracking-tight">100+</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Central & State Schemes</p>
            <p className="text-[11px] text-slate-400 mt-2">Aggregated from verified portals</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-black/[0.06] shadow-2xs">
            <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">₹5,00,000</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Annual Health Coverage</p>
            <p className="text-[11px] text-slate-400 mt-2">Under PM-JAY Ayushman Bharat</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-black/[0.06] shadow-2xs">
            <p className="text-3xl font-extrabold text-blue-600 tracking-tight">Direct DBT</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">100% Aadhaar-Linked</p>
            <p className="text-[11px] text-slate-400 mt-2">Zero intermediary deductions</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-black/[0.06] shadow-2xs">
            <p className="text-3xl font-extrabold text-slate-950 tracking-tight">DigiLocker</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Verified Paperless Guide</p>
            <p className="text-[11px] text-slate-400 mt-2">IT Act Rule 9A compliant</p>
          </div>
        </div>
      </section>

      {/* Apple-style Bento Grid Feature Showcase */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
            Designed for Citizen Clarity.
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base font-normal">
            No confusing bureaucratic jargon. Clean engines that calculate your entitlement precisely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Card 1: Large Engine Showcase */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border border-black/[0.06] shadow-2xs flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Automated Verification</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1 mb-3">
                Smart Eligibility Engine
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
                Enter your age, state of domicile, category, and occupation. The engine scans income ceilings, quota reservations, and state subsidies simultaneously.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant matching with 100+ government programs
              </div>
              <Link href="/eligibility-check" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Try Engine <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Card 2: Benefit Calculator */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-black/[0.06] shadow-2xs flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Monetary Estimator</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight mt-1 mb-3">
                Entitlement Calculator
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Computes your aggregate annual support value from DBT scholarships, farm inputs, and medical cover.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link href="/eligibility-check" className="text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1">
                Calculate Benefits <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Card 3: DigiLocker Roadmap */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-black/[0.06] shadow-2xs flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Paperless Preparation</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight mt-1 mb-3">
                Document Checklist
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Interactive document roadmaps tailored to specific schemes to eliminate application rejections.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link href="/schemes" className="text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1">
                View Checklists <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Card 4: Side-by-Side Scheme Compare */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border border-black/[0.06] shadow-2xs flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                <Scale className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Comparative Analysis</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1 mb-3">
                Side-by-Side Scheme Compare
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
                Evaluate Central vs. State alternatives. Compare maximum subsidy percentages, collateral concessions, and required certificates side-by-side.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-purple-600" /> Multi-scheme matrix evaluation
              </div>
              <Link href="/compare" className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                Open Comparison Tool <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Sector Directory Explorer */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight mb-2">Browse by Civic Sector</h2>
            <p className="text-slate-500 text-sm">Explore specialized programs verified by domain ministries.</p>
          </div>
          <Link href="/schemes" className="text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1">
            View all categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => (
            <Link href={`/schemes?category=${encodeURIComponent(category.name)}`} key={category.name}>
              <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-2xs hover:border-black/15 hover:shadow-md transition-all cursor-pointer group flex items-start justify-between h-full">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${category.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    <category.icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">{category.count}</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3-Step Civic Workflow */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-100">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-1 mb-3">
            Three Steps from Discovery to Benefit.
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm">
            Streamlined process designed to ensure zero delay in citizen welfare onboarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-white p-8 rounded-3xl border border-black/[0.06] shadow-2xs">
            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 font-black text-xs flex items-center justify-center mb-6">
              01
            </span>
            <h4 className="text-lg font-bold text-slate-950 mb-2">Check Your Profile</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Answer 4 basic questions regarding your age, location, and economic criteria in our confidential engine.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-black/[0.06] shadow-2xs">
            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 font-black text-xs flex items-center justify-center mb-6">
              02
            </span>
            <h4 className="text-lg font-bold text-slate-950 mb-2">Prepare Paperwork</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review your customized checklist of Aadhaar, bank passbook, and certificates with direct DigiLocker sync advice.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-black/[0.06] shadow-2xs">
            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 font-black text-xs flex items-center justify-center mb-6">
              03
            </span>
            <h4 className="text-lg font-bold text-slate-950 mb-2">Apply Directly</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Launch directly to the verified official state or central ministry portal with zero agent commission or third-party fees.
            </p>
          </div>
        </div>
      </section>

      {/* Citizen FAQ Section - Interactive Accordion */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-sm">Essential guidance for Indian citizens applying for public welfare.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="bg-white rounded-2xl border border-black/[0.06] shadow-2xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* High-Trust CTA Banner */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-slate-950 rounded-3xl p-10 sm:p-14 text-white text-center flex flex-col items-center relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-300 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Start in 60 Seconds
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Find Every Public Scheme You Are Entitled To.
            </h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              No paperwork required to check. 100% free citizen tool with direct access to official portals.
            </p>
            <Link
              href="/eligibility-check"
              className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-md active:scale-98 inline-flex items-center gap-2"
            >
              Check My Eligibility Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}