"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Scheme, 
  formatCategoryName, 
  getEstimatedBenefit 
} from '@/types/scheme';
import { 
  ChevronRight, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Share2, 
  MapPin, 
  Users, 
  Calendar,
  Layers,
  Copy,
  Check,
  CheckCircle2
} from 'lucide-react';

interface SchemeCardProps {
  scheme: Scheme;
  isSaved: boolean;
  onToggleBookmark: (schemeId: string, e: React.MouseEvent) => void;
  onShareWhatsApp: (scheme: Scheme, e: React.MouseEvent) => void;
}

export default function SchemeCard({ 
  scheme, 
  isSaved, 
  onToggleBookmark, 
  onShareWhatsApp 
}: SchemeCardProps) {
  const [copied, setCopied] = useState(false);
  const benefit = getEstimatedBenefit(scheme);
  const categoryLabel = formatCategoryName(scheme.category);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/schemes/${scheme.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const targetLabel = scheme.targetOccupation || 
    (scheme.socialCategory && scheme.socialCategory !== 'All' ? `${scheme.socialCategory} Citizens` : null) ||
    (scheme.targetGender && scheme.targetGender !== 'Any' ? `${scheme.targetGender} Only` : null) ||
    'All Citizens';

  const ageDisplay = scheme.minAge || scheme.maxAge 
    ? `${scheme.minAge || 18} - ${scheme.maxAge || 60}+ Yrs` 
    : 'All Ages';

  const isCentral = !scheme.state || scheme.state.toLowerCase().includes('all-india') || scheme.state.toLowerCase().includes('central') || scheme.state === '—';
  const stateLabel = isCentral ? 'Pan-India' : scheme.state;

  return (
    <div className="bg-white rounded-[20px] border border-slate-200/80 p-4 sm:p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:border-slate-300/90 transition-all duration-200 flex flex-col justify-between relative group">
      <div>
        <div className="flex items-center justify-between gap-1.5 mb-2.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 tracking-tight truncate max-w-[150px]">
              {categoryLabel}
            </span>

            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-200/60 shrink-0">
              <MapPin className="w-2.5 h-2.5 text-slate-400" />
              <span className="truncate max-w-[80px]">{stateLabel}</span>
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => onShareWhatsApp(scheme, e)}
              className="p-1 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
              title="Share on WhatsApp"
              aria-label="Share on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCopyLink}
              className="p-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              title="Copy Link"
              aria-label="Copy link"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {scheme.id && (
              <button
                onClick={(e) => onToggleBookmark(scheme.id!, e)}
                className="p-1 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                title={isSaved ? "Remove from saved" : "Bookmark scheme"}
                aria-label={isSaved ? "Remove from saved" : "Bookmark scheme"}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                ) : (
                  <Bookmark className="w-4 h-4 text-slate-400 hover:text-amber-500" />
                )}
              </button>
            )}
          </div>
        </div>

        <Link href={`/schemes/${scheme.id}`} className="block focus:outline-none">
          <h3 
            className="text-[14.5px] sm:text-[15px] font-semibold text-slate-900 leading-snug tracking-tight mb-1 hover:text-slate-700 transition-colors line-clamp-2"
            title={scheme.title}
          >
            {scheme.title}
          </h3>
        </Link>

        <p className="text-slate-500 text-[11.5px] leading-relaxed line-clamp-2 mb-2.5" title={scheme.description}>
          {scheme.description}
        </p>

        <div className="bg-slate-50/90 border border-slate-100 rounded-xl p-2.5 space-y-2 mb-2.5">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="text-[12px] font-bold text-slate-900 truncate">
                {benefit.label}
              </span>
            </div>
            <span className="shrink-0 text-[9.5px] font-semibold text-emerald-800 bg-[#7eed9e]/30 px-1.5 py-0.5 rounded-md">
              Direct DBT
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-200/50 text-[11px] text-slate-600">
            <div className="flex items-center gap-1 min-w-0">
              <Users className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate" title={targetLabel}>{targetLabel}</span>
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{ageDisplay}</span>
            </div>
          </div>
        </div>

        {scheme.benefits && scheme.benefits.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2.5 leading-tight">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="line-clamp-1">{scheme.benefits[0]}</span>
          </div>
        )}
      </div>

      <div className="pt-2.5 border-t border-slate-100/90 flex items-center justify-between gap-2 mt-0.5">
        <Link 
          href={`/schemes/${scheme.id}`} 
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-semibold text-[11.5px] tracking-tight active:scale-95 transition-all shadow-2xs"
        >
          <span>Eligibility</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/compare"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium text-slate-600 hover:text-slate-950 bg-slate-100/80 hover:bg-slate-200/70 transition-colors active:scale-95"
            title="Compare scheme"
          >
            <Layers className="w-3 h-3 text-slate-400" />
            <span>Compare</span>
          </Link>

          {scheme.applyLink && (
            <a 
              href={scheme.applyLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer" 
              title="Official Government Portal"
              aria-label="Official Government Portal"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
