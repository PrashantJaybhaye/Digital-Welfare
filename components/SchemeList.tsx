"use client";

import { useState, useMemo } from 'react';
import { Scheme, formatCategoryName } from '@/types/scheme';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Search, Filter } from 'lucide-react';

export default function SchemeList({ initialSchemes }: { initialSchemes: Scheme[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories (in full form) for the filter dropdown
  const categories = useMemo(() => {
    const cats = new Set(
      initialSchemes
        .map(s => formatCategoryName(s.category))
        .filter(c => c && c !== '—')
    );
    return ['All', ...Array.from(cats)].sort();
  }, [initialSchemes]);

  // Filter schemes based on search term and category
  const filteredSchemes = useMemo(() => {
    return initialSchemes.filter(scheme => {
      const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
      const schemeCategory = formatCategoryName(scheme.category);
      const matchesCategory = selectedCategory === 'All' || schemeCategory === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialSchemes, searchTerm, selectedCategory]);

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
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Search schemes by name or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative md:w-64 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-slate-400" />
          </div>
          <select
            className="block w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none transition-all cursor-pointer"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Results Meta */}
      <div className="mb-6 flex justify-between items-center text-sm text-slate-500">
        <p>Showing <span className="font-bold text-slate-900">{filteredSchemes.length}</span> schemes</p>
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No matches found</h3>
          <p className="text-slate-500">Try adjusting your search or filter to find what you're looking for.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
            className="mt-6 text-primary-600 font-semibold hover:text-primary-700"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <div key={scheme.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col group">
              <div className="mb-4 grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 line-clamp-1 max-w-[70%]">
                    {formatCategoryName(scheme.category)}
                  </span>
                  {scheme.state && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
                      {scheme.state}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2" title={scheme.title}>
                  {scheme.title}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-3 mb-4" title={scheme.description}>
                  {scheme.description}
                </p>
                
                {/* Benefits Badges */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {scheme.benefits?.slice(0, 2).map((benefit, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      ✓ {benefit}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                <Link href={`/schemes/${scheme.id}`} className="text-primary-600 font-semibold text-sm hover:text-primary-700 flex items-center gap-1">
                  View Details <ArrowRight className="w-4 h-4" />
                </Link>
                {scheme.applyLink && (
                  <a href={scheme.applyLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors" title="Apply Externally">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
