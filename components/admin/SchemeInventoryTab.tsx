"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Search, Plus, Trash2, ExternalLink } from 'lucide-react';
import { Scheme, formatCategoryName, getEstimatedBenefit } from '@/types/scheme';
import { TabType } from './admin-types';

interface SchemeInventoryTabProps {
  schemes: Scheme[];
  loadingSchemes: boolean;
  schemeSearch: string;
  setSchemeSearch: (val: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (val: string) => void;
  selectedSchemeIds: string[];
  setSelectedSchemeIds: React.Dispatch<React.SetStateAction<string[]>>;
  isBulkDeleting: boolean;
  toggleSelectAllSchemes: () => void;
  toggleSelectScheme: (id: string) => void;
  handleBulkDelete: () => void;
  handleDeleteScheme: (id: string, title: string) => void;
  setActiveTab: (tab: TabType) => void;
}

export default function SchemeInventoryTab({
  schemes,
  loadingSchemes,
  schemeSearch,
  setSchemeSearch,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  selectedSchemeIds,
  setSelectedSchemeIds,
  isBulkDeleting,
  toggleSelectAllSchemes,
  toggleSelectScheme,
  handleBulkDelete,
  handleDeleteScheme,
  setActiveTab,
}: SchemeInventoryTabProps) {
  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      const q = schemeSearch.toLowerCase();
      const matchesSearch =
        (scheme.title || '').toLowerCase().includes(q) ||
        (scheme.description || '').toLowerCase().includes(q) ||
        (scheme.state || '').toLowerCase().includes(q);

      const matchesCategory =
        selectedCategoryFilter === 'All' ||
        (selectedCategoryFilter === 'CS' && (scheme.category === 'CS' || scheme.category === 'Central Sector Scheme')) ||
        (selectedCategoryFilter === 'CSS' && (scheme.category === 'CSS' || scheme.category === 'Centrally Sponsored Scheme')) ||
        (selectedCategoryFilter === 'CCP' && (scheme.category === 'CCP' || scheme.category === 'Climate Change Programme')) ||
        (selectedCategoryFilter === '—' && (!scheme.category || scheme.category === '—' || scheme.category === 'General Welfare'));

      return matchesSearch && matchesCategory;
    });
  }, [schemes, schemeSearch, selectedCategoryFilter]);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 animate-fade-in">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, state, keyword..."
            value={schemeSearch}
            onChange={(e) => setSchemeSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-800 cursor-pointer focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="CS">Central Sector (CS)</option>
            <option value="CSS">Centrally Sponsored (CSS)</option>
            <option value="CCP">Climate Change (CCP)</option>
            <option value="—">General</option>
          </select>

          <button
            onClick={() => setActiveTab('create')}
            className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3 h-3 text-[#7eed9e]" /> Add Scheme
          </button>
        </div>
      </div>

      {/* Bulk Selection Light-Mode Action Bar */}
      {selectedSchemeIds.length > 0 && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1 duration-150 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 bg-rose-600 text-white text-[11px] font-bold rounded-lg shadow-2xs">
              {selectedSchemeIds.length} Selected
            </span>
            <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
              out of {filteredSchemes.length} schemes
            </span>
            <button
              onClick={() => setSelectedSchemeIds([])}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline ml-1 cursor-pointer transition-colors"
            >
              Deselect all
            </button>
          </div>

          <button
            onClick={handleBulkDelete}
            disabled={isBulkDeleting}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
          >
            {isBulkDeleting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({selectedSchemeIds.length})</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Scheme Inventory Table */}
      <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <th className="p-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={
                    filteredSchemes.length > 0 &&
                    filteredSchemes.every((s) => s.id && selectedSchemeIds.includes(s.id))
                  }
                  onChange={toggleSelectAllSchemes}
                  className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                  title="Select / Deselect all visible schemes"
                />
              </th>
              <th className="p-3">Scheme Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">State / Jurisdiction</th>
              <th className="p-3">Estimated Benefit</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loadingSchemes ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  Loading scheme catalog...
                </td>
              </tr>
            ) : filteredSchemes.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  No schemes matched your search criteria.
                </td>
              </tr>
            ) : (
              filteredSchemes.map((scheme) => {
                const benefit = getEstimatedBenefit(scheme);
                const isSelected = scheme.id ? selectedSchemeIds.includes(scheme.id) : false;

                return (
                  <tr
                    key={scheme.id}
                    className={`transition-colors ${isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/60'}`}
                  >
                    <td className="p-3 text-center">
                      {scheme.id && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectScheme(scheme.id!)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                        />
                      )}
                    </td>
                    <td className="p-3 font-bold text-slate-950 max-w-xs truncate">{scheme.title}</td>
                    <td className="p-3">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200/60">
                        {formatCategoryName(scheme.category)}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">{scheme.state || 'All India'}</td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#7eed9e]/20 text-emerald-950 border border-[#7eed9e]/40">
                        {benefit.label}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/schemes/${scheme.id}`}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="View Public Details"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteScheme(scheme.id!, scheme.title)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="Delete from Database"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

