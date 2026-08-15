"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, Search, ShieldCheck, HeartPulse, GraduationCap,
  Sprout, Building, Users, Scale, FileCheck,
  Sparkles, HelpCircle, Wallet, ChevronDown, CheckCircle2, ArrowUpRight,
  Star, Check, Calendar
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
      router.push('/eligibility-check');
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

      {/* Monotree-Style Exact Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center w-full">

          {/* Left Column: Typography, Input & Exact Monotree Metrics */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-start text-left">

            {/* Main Headline with Underline */}
            <div className="relative mb-4">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-bold text-slate-950 tracking-tight leading-[1.08]">
                Put <span className="relative inline-block">
                  citizens
                  {/* Monotree-style hand-drawn underline */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-slate-950 overflow-visible"
                    viewBox="0 0 160 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 10.5C40 3.5 110 3.5 158 9"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M18 12C60 7 115 7 146 11.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeOpacity="0.4"
                    />
                  </svg>
                </span> first
              </h1>
            </div>

            {/* Subtitle Description */}
            <p className="text-sm sm:text-base text-slate-600 max-w-md mb-6 leading-relaxed font-normal">
              Fast, user-friendly and engaging – discover public welfare schemes, calculate direct financial subsidies, and verify document checklists with your own citizen guide.
            </p>

            {/* Monotree Input Capsule */}
            <form onSubmit={handleHeroSearch} className="w-full max-w-md mb-8">
              <div className="flex items-center bg-white rounded-2xl border border-slate-200/90 p-1.5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100 transition-all">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter state or scheme (e.g. Kisan)..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent outline-none font-normal"
                />
                <button
                  type="submit"
                  className="bg-[#7eed9e] hover:bg-[#69df8e] text-slate-950 font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm transition-all shrink-0 active:scale-98 shadow-2xs cursor-pointer"
                >
                  Check eligibility
                </button>
              </div>
            </form>

            {/* Exact Monotree Stats Section */}
            <div className="w-full max-w-sm">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">85.3%</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Average match accuracy</p>
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">~100+</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Verified welfare schemes</p>
                </div>
              </div>

              {/* Dividing Line */}
              <div className="w-full border-t border-slate-200/80 my-5" />

              {/* 5-Star Citizen Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-slate-950 gap-0.5">
                  <Star className="w-4 h-4 fill-slate-950 stroke-slate-950" />
                  <Star className="w-4 h-4 fill-slate-950 stroke-slate-950" />
                  <Star className="w-4 h-4 fill-slate-950 stroke-slate-950" />
                  <Star className="w-4 h-4 fill-slate-950 stroke-slate-950" />
                  <Star className="w-4 h-4 fill-slate-950 stroke-slate-950" />
                </div>
                <span className="text-xs font-bold text-slate-950 ml-1">4.9</span>
                <span className="text-xs text-slate-500 font-normal">Average citizen rating</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Impact Isometric Illustration - Flush Right */}
          <div className="lg:col-span-7 xl:col-span-7 flex items-center justify-end relative mt-6 lg:mt-0">
            <div className="relative w-full flex items-center justify-end">
              <Image
                src="/hero-illustration.png"
                alt="Public Welfare Guide Mobile Application & Eligibility Engine"
                width={1100}
                height={800}
                priority
                className="w-full h-auto max-h-125 sm:max-h-145 md:max-h-160 lg:max-h-175 object-contain object-right select-none pointer-events-none transition-transform duration-500 hover:scale-[1.01] mix-blend-multiply"
              />
            </div>
          </div>

        </div>
      </section>
      {/* Illustrated Pastel Bento Grid Feature Section - Compact */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-t border-slate-100">

        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight mb-1">
            Designed for Citizen Clarity.
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-xs font-normal">
            No bureaucratic hurdles. Clean engines that calculate your entitlement precisely.
          </p>
        </div>

        {/* 6-Card Illustrated Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">

          {/* 1. Left Tall Card (Lavender/Purple: #ede8f9) */}
          <Link href="/eligibility-check" className="block">
            <div className="bg-[#ede8f9] rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-full hover:shadow-md transition-all group cursor-pointer border border-purple-100/50">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 tracking-tight leading-snug mb-2">
                  Maximize Scheme <br />Rewards
                </h3>
                {/* Illustration: Citizen with Welfare Card */}
                <div className="w-full flex items-center justify-center my-2">
                  <svg className="w-full max-w-37.5 h-auto" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="35" r="16" fill="#e0d7f5" />
                    <path d="M50 26 V35 H57" stroke="#9065db" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="80" cy="50" r="12" fill="#6d3cb8" />
                    <text x="76" y="54" fill="white" fontSize="11" fontWeight="bold">₹</text>
                    <circle cx="42" cy="65" r="10" fill="#582ca3" />
                    <text x="39" y="69" fill="white" fontSize="9" fontWeight="bold">₹</text>

                    <rect x="45" y="65" width="125" height="70" rx="10" fill="#6d3cb8" />
                    <rect x="58" y="78" width="14" height="9" rx="2" fill="#facc15" />
                    <rect x="58" y="98" width="18" height="5" rx="2" fill="#9065db" />
                    <rect x="82" y="98" width="18" height="5" rx="2" fill="#9065db" />
                    <rect x="106" y="98" width="18" height="5" rx="2" fill="#9065db" />

                    <circle cx="140" cy="35" r="9" fill="#e29578" />
                    <path d="M135 28 C137 23 145 23 148 28 C149 32 137 33 135 28 Z" fill="#2d3142" />
                    <path d="M136 44 L138 72 L144 72 L146 44 Z" fill="#f8fafc" />
                    <path d="M140 46 L141 62 L142 46" stroke="#6d3cb8" strokeWidth="2" strokeLinecap="round" />
                    <path d="M138 72 L136 110 M144 72 L148 110" stroke="#2d3142" strokeWidth="3.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium mt-1">
                Maximize rewards on every scheme. Identify top verified benefits for each family member.
              </p>
            </div>
          </Link>

          {/* Right Column Grid (4 Cards Container) */}
          <div className="md:col-span-2 flex flex-col gap-3.5 sm:gap-4">

            {/* 2. Top Right Wide Card (Soft Pink: #fde8ee) */}
            <Link href="/schemes" className="block">
              <div className="bg-[#fde8ee] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-md transition-all cursor-pointer border border-rose-100/50">
                <div className="max-w-xs">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-950 tracking-tight leading-snug mb-1">
                    Manage Schemes
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Manage multiple schemes, track entitlement benefits, & set application reminders.
                  </p>
                </div>

                {/* Illustration */}
                <div className="shrink-0 flex items-center justify-center">
                  <svg className="w-32 sm:w-36 h-auto" viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="25" y="20" width="75" height="48" rx="8" fill="#f43f5e" />
                    <circle cx="82" cy="44" r="4" fill="white" />
                    <path d="M25 35 H100" stroke="#be123c" strokeWidth="2" strokeDasharray="3 3" />
                    <rect x="75" y="8" width="42" height="28" rx="4" fill="#e11d48" transform="rotate(22 75 8)" />
                    <rect x="84" y="15" width="8" height="5" rx="1" fill="#fde047" transform="rotate(22 84 15)" />
                    <path d="M15 70 C25 55 25 42 35 38" stroke="#fecdd3" strokeWidth="5.5" strokeLinecap="round" />
                    <path d="M145 70 C135 55 130 42 115 32" stroke="#fecdd3" strokeWidth="5.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Middle Row (2 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">

              {/* 3. Middle Left (Soft Butter Yellow: #fef7d8) */}
              <Link href="/eligibility-check" className="block">
                <div className="bg-[#fef7d8] rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-full hover:shadow-md transition-all cursor-pointer border border-amber-100/50">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-950 tracking-tight leading-snug mb-1">
                      Set Goals
                    </h3>
                    <p className="text-[11px] text-slate-700 leading-relaxed font-medium mb-1.5">
                      Set trip goals or target annual subsidy waivers.
                    </p>
                  </div>
                  <div className="flex justify-end mt-1">
                    <svg className="w-14 h-14" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="45" cy="45" r="26" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
                      <circle cx="45" cy="45" r="18" fill="#ffffff" stroke="#ca8a04" strokeWidth="2" />
                      <circle cx="45" cy="45" r="11" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
                      <circle cx="45" cy="45" r="4.5" fill="#ca8a04" />
                      <path d="M22 22 L43 43" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                      <path d="M17 17 L24 19 L19 24 Z" fill="#0f172a" />
                      <path d="M35 70 L30 78 M55 70 L60 78" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* 4. Middle Right (Soft Olive Green: #eaf3d8) */}
              <Link href="/schemes" className="block">
                <div className="bg-[#eaf3d8] rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-full hover:shadow-md transition-all cursor-pointer border border-lime-100/50">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-950 tracking-tight leading-snug mb-1">
                      Lounges & Docs
                    </h3>
                    <p className="text-[11px] text-slate-700 leading-relaxed font-medium mb-1.5">
                      Track & find eligible citizen access and required checklists.
                    </p>
                  </div>
                  <div className="flex justify-end mt-1">
                    <svg className="w-18 h-12" viewBox="0 0 100 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="25" y="6" width="58" height="16" rx="3" fill="#65a30d" />
                      <text x="32" y="18" fill="white" fontSize="9" fontWeight="bold">→ Access</text>
                      <rect x="15" y="28" width="58" height="16" rx="3" fill="#4d7c0f" />
                      <text x="22" y="40" fill="white" fontSize="9" fontWeight="bold">← Checklist</text>
                      <path d="M30 0 V55 M70 0 V55" stroke="#a3e635" strokeWidth="1.5" strokeDasharray="2 2" />
                    </svg>
                  </div>
                </div>
              </Link>

            </div>

          </div>

          {/* 5. Bottom Left Wide Card (Soft Peach: #fee8d6) */}
          <Link href="/compare" className="block md:col-span-2">
            <div className="bg-[#fee8d6] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-md transition-all cursor-pointer border border-orange-100/50 h-full">
              <div className="max-w-xs">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-950 tracking-tight leading-snug mb-1">
                  Citizen Scheme Strategy
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Personalized welfare plan that fits your state domicile and lifestyle.
                </p>
              </div>

              {/* Illustration */}
              <div className="shrink-0 flex items-center justify-center">
                <svg className="w-36 sm:w-40 h-auto" viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="40" y="12" width="85" height="60" rx="8" fill="#ea580c" fillOpacity="0.15" stroke="#ea580c" strokeWidth="1.5" />
                  <path d="M50 40 L65 26 L80 36 L105 22" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="52" y="50" width="6" height="14" fill="#ea580c" rx="1" />
                  <rect x="64" y="45" width="6" height="19" fill="#ea580c" rx="1" />
                  <rect x="76" y="40" width="6" height="24" fill="#ea580c" rx="1" />
                  <rect x="88" y="35" width="6" height="29" fill="#ea580c" rx="1" />
                  <circle cx="112" cy="50" r="7" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx="25" cy="28" r="6" fill="#2d3142" />
                  <path d="M20 37 L28 37 L30 65 L20 65 Z" fill="#ea580c" />
                  <path d="M22 65 L15 95 M28 65 L35 95" stroke="#2d3142" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="150" cy="30" r="6" fill="#2d3142" />
                  <path d="M142 39 L156 39 L152 70 L144 70 Z" fill="#2d3142" />
                  <path d="M146 70 L145 95 M152 70 L155 95" stroke="#2d3142" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </Link>

          {/* 6. Bottom Right Card (Soft Powder Blue: #e5f3fa) */}
          <Link href="/schemes" className="block">
            <div className="bg-[#e5f3fa] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer border border-sky-100/50 h-full">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-950 tracking-tight leading-snug mb-1">
                  Find, Compare & Apply
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium mb-3">
                  Discover ideal schemes. Compare features and apply in minutes.
                </p>
              </div>

              {/* Search Box Graphic */}
              <div className="mt-1">
                <div className="bg-white rounded-xl border border-sky-200 p-2 flex items-center justify-between shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-800 truncate">SBI Kisan / PM Awas..</span>
                  <div className="w-4 h-4 rounded-md bg-sky-500 text-white flex items-center justify-center shrink-0">
                    <Search className="w-2.5 h-2.5" />
                  </div>
                </div>
                <div className="flex justify-end mt-1 mr-2">
                  <svg className="w-3.5 h-3.5 text-sky-600 fill-sky-600" viewBox="0 0 24 24">
                    <path d="M3 3l7 18 3-7 7-3L3 3z" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* 3-Step Civic Workflow - Compact */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-slate-100">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">How It Works</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-0.5 mb-1.5">
            Three Steps from Discovery to Benefit.
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-xs">
            Streamlined process designed to ensure zero delay in citizen welfare onboarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-black/6 shadow-2xs">
            <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-900 font-black text-xs flex items-center justify-center mb-4">
              01
            </span>
            <h4 className="text-base font-bold text-slate-950 mb-1.5">Check Your Profile</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Answer 4 basic questions regarding your age, location, and economic criteria in our confidential engine.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-black/6 shadow-2xs">
            <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-900 font-black text-xs flex items-center justify-center mb-4">
              02
            </span>
            <h4 className="text-base font-bold text-slate-950 mb-1.5">Prepare Paperwork</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review your customized checklist of Aadhaar, bank passbook, and certificates with direct DigiLocker sync advice.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-black/6 shadow-2xs">
            <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-900 font-black text-xs flex items-center justify-center mb-4">
              03
            </span>
            <h4 className="text-base font-bold text-slate-950 mb-1.5">Apply Directly</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Launch directly to the verified official state or central ministry portal with zero agent commission or third-party fees.
            </p>
          </div>
        </div>
      </section>

      {/* Monotree-Style Redesigned FAQ Section - Compact */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 border-t border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Monotree Headline & Speech-Bubble Circle Graphic */}
          <div className="lg:col-span-5 flex flex-col items-start text-left lg:sticky lg:top-24">
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-slate-950 tracking-tight leading-[1.12] mb-3">
              What do our <br />
              citizens <span className="relative inline-block ml-1">
                say?
                {/* Hand-drawn Speech Bubble Loop Around "say?" */}
                <svg
                  className="absolute -inset-x-3.5 -inset-y-1.5 w-[calc(100%+28px)] h-[calc(100%+14px)] text-slate-950 overflow-visible pointer-events-none"
                  viewBox="0 0 120 54"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 30 6 C 65 2, 110 4, 114 20 C 118 36, 95 47, 55 48 C 25 48, 4 41, 4 26 C 4 11, 28 4, 60 5 C 90 6, 112 12, 114 24 C 115 34, 98 44, 78 47 L 88 53 L 74 48"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed font-normal max-w-sm">
              Answers to the most common questions on eligibility criteria, Direct Benefit Transfer (DBT), document checklists, and application processes.
            </p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 w-full max-w-sm">
              <p className="text-xs font-bold text-slate-950 mb-0.5">Have a specific query?</p>
              <p className="text-[11px] text-slate-500 mb-2.5">Our automated engine matches your profile across 100+ verified government schemes in real time.</p>
              <Link
                href="/eligibility-check"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-950 hover:text-blue-600 transition-colors"
              >
                Launch Eligibility Check <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Sleek Monotree FAQ Accordions */}
          <div className="lg:col-span-7 space-y-2.5 w-full">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-xl border transition-all overflow-hidden ${isOpen
                      ? 'border-slate-300 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-200/50'
                      : 'border-slate-200/80 hover:border-slate-300 shadow-2xs'
                    }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3.5 font-bold text-xs sm:text-sm text-slate-950 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    <span className="leading-snug">{faq.q}</span>
                    <div className={`w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'bg-slate-950 text-white rotate-180' : 'text-slate-600'}`}>
                      <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5 animate-fade-in font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative overflow-hidden text-center flex flex-col items-center border-t border-slate-100">

        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-48 sm:w-64 md:w-80 h-auto text-slate-200 pointer-events-none -z-10 hidden sm:block opacity-60"
          viewBox="0 0 200 300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M 60 20 L 60 280 M 60 80 L 120 45 M 60 140 L 20 115 M 60 200 L 130 160 M 120 45 L 120 100 M 20 115 L 20 180" />
          <path d="M 100 0 L 100 300" strokeDasharray="3 3" strokeOpacity="0.4" />
        </svg>

        {/* Right Decorative Isometric Tree Lines */}
        <svg
          className="absolute right-4 top-1/2 -translate-y-1/2 w-48 sm:w-64 md:w-80 h-auto text-slate-200 pointer-events-none -z-10 hidden sm:block opacity-60"
          viewBox="0 0 200 300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M 140 20 L 140 280 M 140 80 L 80 45 M 140 140 L 180 115 M 140 200 L 70 160 M 80 45 L 80 100 M 180 115 L 180 180" />
          <path d="M 100 0 L 100 300" strokeDasharray="3 3" strokeOpacity="0.4" />
        </svg>

        <div className="relative z-10 max-w-xl mx-auto">
          {/* Main Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-[2.6rem] font-bold text-slate-950 tracking-tight leading-[1.2] mb-4">
            Get your benefits in a <span className="relative inline-block">
              few
              {/* Hand-drawn Underline */}
              <svg
                className="absolute -bottom-1 left-0 w-full h-2.5 text-slate-950 overflow-visible"
                viewBox="0 0 80 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 7C20 2 60 2 78 6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M10 8.5C30 5 55 5 70 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeOpacity="0.4"
                />
              </svg>
            </span> steps. <br />
            Let's get in touch!
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-500 mb-8 leading-relaxed font-normal max-w-md mx-auto">
            We simplify public welfare discovery. Check all government schemes, direct subsidies, and required documents in seconds.
          </p>

          {/* Monotree Green Button */}
          <Link
            href="/eligibility-check"
            className="inline-flex items-center justify-center bg-[#7eed9e] hover:bg-[#69df8e] text-slate-950 font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-[0_4px_14px_rgba(126,237,158,0.35)] active:scale-98 cursor-pointer"
          >
            Check eligibility
          </Link>
        </div>
      </section>

    </div>
  );
}