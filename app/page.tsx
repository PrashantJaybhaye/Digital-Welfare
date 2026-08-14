import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck, HeartPulse, GraduationCap, Sprout, Building, Users } from 'lucide-react';

export default function Home() {
  const categories = [
    { name: 'Agriculture & Farmers', icon: Sprout, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Health & Wellness', icon: HeartPulse, color: 'text-rose-600', bg: 'bg-rose-100' },
    { name: 'Education & Skills', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Women & Children', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Housing & Shelter', icon: Building, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Social Security', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  return (
    <div className="flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mb-8 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-primary-600"></span>
          Discover 100+ Government Schemes
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
          Find the Right <br className="hidden md:block"/>
          <span className="gradient-text">Welfare Scheme</span> For You
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed">
          Our smart platform helps you discover, understand, and apply for government welfare programs you are eligible for in just a few clicks.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <Link href="/eligibility-check" className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2 hover:-translate-y-1">
            <Search className="w-5 h-5" />
            Check Eligibility
          </Link>
          <Link href="/schemes" className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-sm flex items-center justify-center gap-2 hover:-translate-y-1">
            Browse All
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Browse by Category</h2>
          <p className="text-slate-600">Explore specific sectors to find specialized assistance programs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link href={`/schemes?category=${encodeURIComponent(category.name)}`} key={category.name}>
              <div className="glass-card rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-2 cursor-pointer group">
                <div className={`w-14 h-14 rounded-xl ${category.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className={`w-7 h-7 ${category.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-slate-500 text-sm flex items-center gap-1 font-medium">
                  View schemes <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}