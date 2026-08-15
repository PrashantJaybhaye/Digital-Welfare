"use client";

import { useState, useMemo, useEffect } from 'react';
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
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);

  // Reset pagination when search or filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [searchTerm, selectedCategory, selectedTag, showOnlySaved]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('saved_schemes');
      if (stored) {
        setSavedIds(JSON.parse(stored));
      }
    } catch {
      // Graceful fallback
    }
  }, []);

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
      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
        
        {/* Left Side: Clean Search Input */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all text-xs sm:text-sm shadow-2xs font-normal"
            placeholder="Search schemes by name, ministry, keyword (e.g. Kisan)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Right Side: Category Filter & Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Category Dropdown */}
          <div className="relative w-full sm:w-48 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <select
              className="block w-full pl-8 pr-8 py-2.5 bg-white border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 appearance-none transition-all cursor-pointer text-xs font-semibold shadow-2xs"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          {/* Saved Schemes Filter */}
          <button
            onClick={() => setShowOnlySaved(!showOnlySaved)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 active:scale-98 cursor-pointer shadow-2xs ${
              showOnlySaved
                ? 'bg-amber-600 text-white'
                : 'bg-white border border-slate-200/90 text-slate-700 hover:border-slate-400'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({savedIds.length})</span>
          </button>

          {/* Scheme Alerts Modal Trigger */}
          <button
            onClick={() => setShowAlertModal(true)}
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#7eed9e] hover:bg-[#69df8e] text-slate-950 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alerts</span>
          </button>
        </div>

      </div>

      <SchemeAlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
      />

      {/* Results Meta Header */}
      <div className="mb-6 flex justify-between items-center text-xs font-semibold text-slate-500">
        <p>
          Showing <span className="font-bold text-slate-950">{Math.min(visibleCount, filteredSchemes.length)}</span> of <span className="font-bold text-slate-950">{filteredSchemes.length}</span> verified welfare schemes
          {showOnlySaved && <span className="text-amber-700 font-bold ml-1">(Saved Only)</span>}
        </p>
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No schemes found</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">Try adjusting your search query or reset your selected filters.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedTag('All'); setShowOnlySaved(false); }}
            className="mt-5 px-4 py-2 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-2xs"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSchemes.slice(0, visibleCount).map((scheme) => {
            const isSaved = scheme.id ? savedIds.includes(scheme.id) : false;
            const benefit = getEstimatedBenefit(scheme);

            return (
              <div 
                key={scheme.id} 
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group relative"
              >
                <div>
                  {/* Category Pill & Bookmark */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200/60 line-clamp-1 max-w-[80%]">
                      {formatCategoryName(scheme.category)}
                    </span>

                    {scheme.id && (
                      <button
                        onClick={(e) => toggleBookmark(scheme.id!, e)}
                        className="p-1 text-slate-400 hover:text-amber-500 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
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

                  {/* Title & Description */}
                  <Link href={`/schemes/${scheme.id}`} className="block">
                    <h3 className="text-base font-bold text-slate-950 mb-1 leading-snug" title={scheme.title}>
                      {scheme.title}
                    </h3>
                  </Link>

                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3" title={scheme.description}>
                    {scheme.description}
                  </p>

                  {/* Financial Benefit Capsule */}
                  <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-[#7eed9e]/20 border border-[#7eed9e]/50 text-slate-950 text-xs font-bold flex items-center gap-1.5 w-fit max-w-full">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">{benefit.label}</span>
                  </div>

                  {/* Key Highlights */}
                  {scheme.benefits && scheme.benefits.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {scheme.benefits.slice(0, 2).map((b, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-100">
                          ✓ {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action Links */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3">
                  <Link 
                    href={`/schemes/${scheme.id}`} 
                    className="text-slate-950 font-bold text-xs hover:text-slate-700 flex items-center gap-1 transition-colors group-hover:translate-x-0.5"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-950" />
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href="/compare"
                      className="text-xs text-slate-500 hover:text-slate-950 font-semibold px-2 py-1 rounded-md hover:bg-slate-50 transition-colors"
                      title="Compare scheme"
                    >
                      Compare
                    </Link>
                    {scheme.applyLink && (
                      <a 
                        href={scheme.applyLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-1 text-slate-400 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-50" 
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

        {/* Load More Pagination Button */}
        {filteredSchemes.length > visibleCount && (
          <div className="mt-10 text-center flex flex-col items-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 12)}
              className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs tracking-wide transition-all shadow-sm active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <span>Load More Schemes ({filteredSchemes.length - visibleCount} remaining)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              Viewing {visibleCount} of {filteredSchemes.length} total schemes
            </p>
          </div>
        )}
      </>
      )}
    </div>
  );
}
