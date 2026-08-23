"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Scheme, formatCategoryName, getEstimatedBenefit } from '@/types/scheme';
import Link from 'next/link';
import { 
  ArrowRight, ExternalLink, Search, Bookmark, 
  BookmarkCheck, Sparkles, Bell, Share2
} from 'lucide-react';
import SchemeAlertModal from '@/components/SchemeAlertModal';

function SchemeListContent({ initialSchemes }: { initialSchemes: Scheme[] }) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [showOnlySaved, setShowOnlySaved] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);

  // Sync URL search params when changed externally
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) setSearchTerm(q);
    const cat = searchParams.get('category');
    if (cat !== null) setSelectedCategory(cat);
  }, [searchParams]);

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

  const handleShareWhatsApp = (scheme: Scheme, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/schemes/${scheme.id}`;
    const text = `🏛️ *${scheme.title}*\n\n${scheme.description.substring(0, 130)}...\n\n🔗 *Check eligibility & apply:* ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
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
                            (scheme.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (scheme.targetOccupation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (scheme.state || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const formattedCat = formatCategoryName(scheme.category);
      const matchesCategory = selectedCategory === 'All' || 
                              formattedCat === selectedCategory ||
                              (scheme.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
      
      const matchesTag = selectedTag === 'All' || (scheme.tags && scheme.tags.includes(selectedTag));
      const matchesSaved = !showOnlySaved || (scheme.id ? savedIds.includes(scheme.id) : false);

      return matchesSearch && matchesCategory && matchesTag && matchesSaved;
    });
  }, [initialSchemes, searchTerm, selectedCategory, selectedTag, showOnlySaved, savedIds]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Monotree-Style Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Capsule Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scheme name, state, farmer, scholarship..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all cursor-pointer shadow-2xs"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Bookmarked Filter Pill */}
          <button
            onClick={() => setShowOnlySaved(!showOnlySaved)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
              showOnlySaved
                ? 'bg-slate-950 text-white border-slate-950'
                : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showOnlySaved ? 'fill-current text-white' : 'text-slate-400'}`} />
            <span>Saved ({savedIds.length})</span>
          </button>

          {/* Alert Subscription Button */}
          <button
            onClick={() => setShowAlertModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-[#7eed9e] hover:bg-[#68e48d] text-slate-950 transition-all cursor-pointer shadow-2xs active:scale-98"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Get Scheme Alerts</span>
            <span className="sm:hidden">Alerts</span>
          </button>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <p>
          Showing <span className="font-bold text-slate-900">{Math.min(visibleCount, filteredSchemes.length)}</span> of <span className="font-bold text-slate-900">{filteredSchemes.length}</span> schemes
        </p>
        {(searchTerm || selectedCategory !== 'All' || showOnlySaved) && (
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setShowOnlySaved(false); }}
            className="text-xs font-bold text-slate-900 hover:underline"
          >
            Reset Filters
          </button>
        )}
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
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between relative hover:border-slate-300 transition-all"
                >
                  <div>
                    {/* Category Pill & Bookmark */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200/60 line-clamp-1 max-w-[75%]">
                        {formatCategoryName(scheme.category)}
                      </span>

                      <div className="flex items-center gap-1">
                        {/* 1-Click WhatsApp Share */}
                        <button
                          onClick={(e) => handleShareWhatsApp(scheme, e)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Share on WhatsApp"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Bookmark */}
                        {scheme.id && (
                          <button
                            onClick={(e) => toggleBookmark(scheme.id!, e)}
                            className="p-1.5 text-slate-400 hover:text-amber-500 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
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
                    </div>

                    {/* Title & Description */}
                    <Link href={`/schemes/${scheme.id}`} className="block">
                      <h3 className="text-base font-bold text-slate-950 mb-1.5 leading-snug hover:text-slate-700 transition-colors" title={scheme.title}>
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
                      className="text-slate-950 font-bold text-xs hover:underline flex items-center gap-1"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
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

      {/* Scheme Alert Subscription Modal */}
      <SchemeAlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
      />
    </div>
  );
}

export default function SchemeList({ initialSchemes }: { initialSchemes: Scheme[] }) {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-slate-400">Loading schemes directory...</div>}>
      <SchemeListContent initialSchemes={initialSchemes} />
    </Suspense>
  );
}
