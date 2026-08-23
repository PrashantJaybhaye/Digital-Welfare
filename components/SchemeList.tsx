"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Scheme, formatCategoryName } from '@/types/scheme';
import { ArrowRight, Search, Bookmark, Bell } from 'lucide-react';
import SchemeAlertModal from '@/components/SchemeAlertModal';
import SchemeCard from '@/components/SchemeCard';

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

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) setSearchTerm(q);
    const cat = searchParams.get('category');
    if (cat !== null) setSelectedCategory(cat);
  }, [searchParams]);

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
      // Ignore storage read errors
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

  const categories = useMemo(() => {
    const cats = new Set(
      initialSchemes
        .map(s => formatCategoryName(s.category))
        .filter(c => c && c !== '—')
    );
    return ['All', ...Array.from(cats)].sort();
  }, [initialSchemes]);

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
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
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

        <div className="flex items-center gap-2 flex-wrap">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4.5 lg:gap-5">
            {filteredSchemes.slice(0, visibleCount).map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                isSaved={scheme.id ? savedIds.includes(scheme.id) : false}
                onToggleBookmark={toggleBookmark}
                onShareWhatsApp={handleShareWhatsApp}
              />
            ))}
          </div>

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
