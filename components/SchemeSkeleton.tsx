import React from 'react';

export function SchemeCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between animate-pulse">
      <div>
        {/* Top Tag & Bookmark placeholder */}
        <div className="flex justify-between items-center mb-3">
          <div className="h-5 w-28 bg-slate-200 rounded-lg" />
          <div className="h-5 w-5 bg-slate-100 rounded-md" />
        </div>

        {/* Title placeholder */}
        <div className="h-5 w-4/5 bg-slate-200 rounded-md mb-2" />

        {/* Description placeholders */}
        <div className="space-y-1.5 mb-4">
          <div className="h-3.5 w-full bg-slate-100 rounded" />
          <div className="h-3.5 w-3/4 bg-slate-100 rounded" />
        </div>

        {/* Benefit pill placeholder */}
        <div className="h-7 w-36 bg-slate-200/70 rounded-lg mb-3" />

        {/* Highlight tags placeholder */}
        <div className="flex gap-1.5 mb-4">
          <div className="h-4 w-20 bg-slate-100 rounded-md" />
          <div className="h-4 w-24 bg-slate-100 rounded-md" />
        </div>
      </div>

      {/* Footer / Buttons placeholder */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
        <div className="h-4 w-20 bg-slate-100 rounded" />
        <div className="h-8 w-24 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

export function SchemeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SchemeCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default SchemeGridSkeleton;
