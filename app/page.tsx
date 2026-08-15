import Link from 'next/link';
import { 
  ArrowRight, Search, ShieldCheck, HeartPulse, GraduationCap, 
  Sprout, Building, Users, Scale, FileCheck, 
  Sparkles, HelpCircle, Wallet
} from 'lucide-react';

export default function Home() {
  const categories = [
    { name: 'Agriculture & Farmers', icon: Sprout, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Health & Wellness', icon: HeartPulse, color: 'text-rose-600', bg: 'bg-rose-100' },
    { name: 'Education & Skills', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Women & Children', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Housing & Shelter', icon: Building, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Social Security', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  const features = [
    {
      icon: Search,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      title: 'Smart Eligibility Engine',
      desc: 'Filter by age, income, and occupation to find matching scholarships, subsidies, and grants instantly.'
    },
    {
      icon: Wallet,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      title: 'Benefit & Subsidy Calculator',
      desc: 'Discover your total potential financial assistance and health coverage entitlement based on your profile.'
    },
    {
      icon: FileCheck,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      title: 'Document Checklist & Roadmap',
      desc: 'Never get rejected due to missing paperwork. Get verified checklists with direct DigiLocker guidance.'
    },
    {
      icon: Scale,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      title: 'Side-by-Side Scheme Compare',
      desc: 'Compare funding models, maximum loan/subsidy amounts, and eligibility requirements between schemes.'
    }
  ];

  return (
    <div className="flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 font-bold text-xs mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-primary-600" />
          Single-Window Citizen Welfare & Schemes Portal
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
          Discover Every Welfare Scheme <br className="hidden md:block"/>
          <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            You Are Entitled To
          </span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
          Check your eligibility in seconds, calculate direct financial subsidies, prepare document checklists, and apply on official Government portals.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-lg mb-16">
          <Link 
            href="/eligibility-check" 
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-xl shadow-primary-600/30 flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <Search className="w-5 h-5" />
            Check My Eligibility
          </Link>
          <Link 
            href="/compare" 
            className="flex-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <Scale className="w-5 h-5 text-primary-600" />
            Compare Schemes
          </Link>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl pt-8 border-t border-slate-200">
          <div className="p-4 bg-white/80 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-2xl font-black text-slate-900">100+</p>
            <p className="text-xs font-medium text-slate-500">Central & State Schemes</p>
          </div>
          <div className="p-4 bg-white/80 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-2xl font-black text-emerald-600">₹5 Lakh</p>
            <p className="text-xs font-medium text-slate-500">Free Health Cover (PM-JAY)</p>
          </div>
          <div className="p-4 bg-white/80 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-2xl font-black text-indigo-600">28+ States</p>
            <p className="text-xs font-medium text-slate-500">Coverage Across India</p>
          </div>
          <div className="p-4 bg-white/80 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-2xl font-black text-purple-600">100% Free</p>
            <p className="text-xs font-medium text-slate-500">Direct Citizen Platform</p>
          </div>
        </div>
      </section>

      {/* High-Impact Platform Features */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">Why Use Digital Welfare Guide?</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            We simplify complex government guidelines into actionable steps and calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all flex flex-col">
              <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-5`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Browse by Sector</h2>
            <p className="text-slate-600 text-sm">Explore specialized programs tailored for farmers, students, workers, and families.</p>
          </div>
          <Link href="/schemes" className="text-primary-600 font-bold text-sm hover:underline flex items-center gap-1">
            View all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link href={`/schemes?category=${encodeURIComponent(category.name)}`} key={category.name}>
              <div className="bg-white rounded-3xl p-6 border border-slate-200 transition-all hover:shadow-xl hover:border-primary-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between h-full">
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${category.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <category.icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Access verified subsidies, financial grants, and welfare benefits in this sector.
                  </p>
                </div>
                <p className="text-primary-600 text-xs flex items-center gap-1 font-bold mt-4">
                  Explore schemes <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Citizen FAQ Section */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-3 flex items-center justify-center gap-2">
            <HelpCircle className="w-8 h-8 text-primary-600" /> Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm">Common questions citizens ask when applying for government welfare.</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "How does Direct Benefit Transfer (DBT) work?",
              a: "Under DBT, government financial assistance, subsidies, or scholarships are directly credited into your Aadhaar-seeded bank account without any intermediaries."
            },
            {
              q: "What is the difference between Central Sector (CS) and Centrally Sponsored (CSS) schemes?",
              a: "Central Sector Schemes are 100% funded and managed directly by the Union Government (e.g., PM-KISAN, PMEGP). Centrally Sponsored Schemes are co-funded by Central and State Governments and executed by States (e.g., MGNREGA, Ayushman Bharat)."
            },
            {
              q: "Can I use digital document copies from DigiLocker?",
              a: "Yes! As per Rule 9A of Information Technology Rules, digitally issued documents on DigiLocker are treated at par with original physical documents across government offices."
            },
            {
              q: "Is there any fee to check eligibility or apply?",
              a: "No. This portal and official government scheme portals are 100% free for all citizens."
            }
          ].map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 text-base mb-2">{faq.q}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}