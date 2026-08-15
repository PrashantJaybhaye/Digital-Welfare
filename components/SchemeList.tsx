"use client";

import { useState, useMemo } from 'react';
import { Scheme, formatCategoryName, getEstimatedBenefit } from '@/types/scheme';
import Link from 'next/link';
import { 
  ArrowRight, ExternalLink, Search, Filter, Bookmark, 
  BookmarkCheck, Scale, Sparkles, Bell
} from 'lucide-react';
import SchemeAlertModal from '@/components/SchemeAlertModal';

export default function SchemeList({ initialSchemes }: { initialSchemes: Scheme[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [showOnlySaved, setShowOnlySaved] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('saved_schemes') || '[]');
      } catch {
        return [];
      }
    }
    return [];
  });

  const toggleBookmark = (schemeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window === 'undefined') return;

    let updated: string[];
    if (savedIds.includes(schemeId)) {
      updated = savedIds.filter(id => id !== schemeId);
    } else {
      updated = [...savedIds, schemeId];
    }
    setSavedIds(updated);
    localStorage.setItem('saved_schemes', JSON.stringify(updated));
  };

  // Extract unique categories for filter dropdown
  const categories = useMemo(() => {
    const cats = new Set(
      initialSchemes
        .map(s => formatCategoryName(s.category))
        .filter(c => c && c !== '—')
    );
    return ['All', ...Array.from(cats)].sort();
  }, [initialSchemes]);

  // Filter schemes based on search term, category, tag, and bookmarks
  const filteredSchemes = useMemo(() => {
    return initialSchemes.filter(scheme => {
      const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const schemeCategory = formatCategoryName(scheme.category);
      const matchesCategory = selectedCategory === 'All' || schemeCategory === selectedCategory;

      const combinedText = `${scheme.title.toLowerCase()} ${scheme.description.toLowerCase()}`;
      let matchesTag = true;
      if (selectedTag === 'farmer') {
        matchesTag = combinedText.includes('farmer') || combinedText.includes('kisan') || combinedText.includes('krishi') || combinedText.includes('agriculture');
      } else if (selectedTag === 'student') {
        matchesTag = combinedText.includes('scholarship') || combinedText.includes('student') || combinedText.includes('education') || combinedText.includes('school');
      } else if (selectedTag === 'health') {
        matchesTag = combinedText.includes('health') || combinedText.includes('swasthya') || combinedText.includes('bima') || combinedText.includes('insurance');
      } else if (selectedTag === 'women') {
        matchesTag = combinedText.includes('woman') || combinedText.includes('women') || combinedText.includes('mahila') || combinedText.includes('girl') || combinedText.includes('maternity');
      } else if (selectedTag === 'business') {
        matchesTag = combinedText.includes('business') || combinedText.includes('msme') || combinedText.includes('loan') || combinedText.includes('pmegp') || combinedText.includes('employment');
      }

      const matchesSaved = !showOnlySaved || (scheme.id && savedIds.includes(scheme.id));

      return matchesSearch && matchesCategory && matchesTag && matchesSaved;
    });
  }, [initialSchemes, searchTerm, selectedCategory, selectedTag, showOnlySaved, savedIds]);

  if (initialSchemes.length === 0) {
    return (
      <div className="text-center py-20 glass-card rounded-3xl">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No schemes found</h2>
        <p className="text-slate-500 mb-6">Your database is currently empty. Run the Scraper API to populate it!</p>
        <div className="inline-flex gap-4">
          <code className="bg-slate-100 text-slate-800 px-4 py-2 rounded-lg font-mono text-sm border border-slate-200">
            POST /api/sync-schemes
          </code>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Quick Filter Tag Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {[
          { id: 'All', label: 'All Schemes' },
          { id: 'farmer', label: '🌾 Farmers & Krishi' },
          { id: 'student', label: '🎓 Scholarships & Students' },
          { id: 'women', label: '👩 Women & Children' },
          { id: 'health', label: '🏥 Free Healthcare' },
          { id: 'business', label: '💼 MSME & Self-Employment' }
        ].map(tag => (
          <button
            key={tag.id}
            onClick={() => { setSelectedTag(tag.id); setShowOnlySaved(false); }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-98 ${
              selectedTag === tag.id && !showOnlySaved
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white border border-slate-200/80 text-slate-700 hover:border-slate-400'
            }`}
          >
            {tag.label}
          </button>
        ))}

        <button
          onClick={() => setShowOnlySaved(!showOnlySaved)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 active:scale-98 ${
            showOnlySaved
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white border border-slate-200/80 text-slate-700 hover:border-slate-400'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" /> Saved ({savedIds.length})
        </button>

        <Link
          href="/compare"
          className="whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all shrink-0 flex items-center gap-1.5 border border-slate-200/80"
        >
          <Scale className="w-3.5 h-3.5 text-blue-600" /> Compare
        </Link>

        <button
          onClick={() => setShowAlertModal(true)}
          className="whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 transition-all shrink-0 flex items-center gap-1.5 border border-amber-200/80"
        >
          <Bell className="w-3.5 h-3.5 text-amber-600" /> Get Alerts
        </button>
      </div>

      <SchemeAlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
      />

      {/* Search and Category Filter Bar */}
      <div className="bg-white p-3 rounded-2xl shadow-2xs border border-black/[0.08] mb-8 flex flex-col md:flex-row gap-3">
        <div className="relative grow">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-xs sm:text-sm font-medium"
            placeholder="Search schemes by name, ministry, or keywords (e.g. Kisan, Awas, Scholarship)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative md:w-72 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-slate-400" />
          </div>
          <select
            className="block w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all cursor-pointer text-xs sm:text-sm font-semibold"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Results Meta */}
      <div className="mb-6 flex justify-between items-center text-xs font-semibold text-slate-500">
        <p>
          Showing <span className="font-bold text-slate-900">{filteredSchemes.length}</span> schemes
          {showOnlySaved && <span className="text-amber-700 font-bold ml-1">(Saved Only)</span>}
        </p>
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="text-center py-20 bg-white border border-black/[0.06] rounded-3xl shadow-2xs">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No matches found</h3>
          <p className="text-slate-500 text-xs sm:text-sm">Try adjusting your search query or reset your filters.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedTag('All'); setShowOnlySaved(false); }}
            className="mt-6 px-4 py-2 rounded-full bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition-all"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => {
            const isSaved = scheme.id ? savedIds.includes(scheme.id) : false;
            const benefit = getEstimatedBenefit(scheme);

            return (
              <div 
                key={scheme.id} 
                className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-2xs hover:shadow-md hover:border-black/15 transition-all flex flex-col group relative"
              >
                {/* Card Top Category & Bookmark */}
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-black/[0.04] line-clamp-1 max-w-[70%]">
                    {formatCategoryName(scheme.category)}
                  </span>

                  {scheme.id && (
                    <button
                      onClick={(e) => toggleBookmark(scheme.id!, e)}
                      className="p-1.5 text-slate-400 hover:text-amber-500 rounded-full hover:bg-slate-50 transition-colors"
                      title={isSaved ? "Remove from saved" : "Save scheme"}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-slate-400 hover:text-amber-500" />
                      )}
                    </button>
                  )}
                </div>

                {/* Scheme Title & Description */}
                <div className="grow mb-4">
                  <h3 className="text-lg font-bold text-slate-950 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2" title={scheme.title}>
                    {scheme.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-4" title={scheme.description}>
                    {scheme.description}
                  </p>
                  
                  {/* Highlighted Support Value */}
                  <div className="mb-4 p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{benefit.label}</span>
                  </div>

                  {/* Benefits Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {scheme.benefits?.slice(0, 2).map((b, i) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-100">
                        ✓ {b}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <Link 
                    href={`/schemes/${scheme.id}`} 
                    className="text-slate-900 font-bold text-xs hover:text-blue-600 flex items-center gap-1 transition-colors"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/compare"
                      className="text-xs text-slate-400 hover:text-slate-700 font-semibold px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors"
                      title="Compare with another scheme"
                    >
                      Compare
                    </Link>
                    {scheme.applyLink && (
                      <a 
                        href={scheme.applyLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-50" 
                        title="Official Government Portal"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
