import React from 'react';

export function SchemeCardSkeleton() {
  return (
    <div className="bg-white rounded-[20px] border border-slate-200/80 p-4 sm:p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between animate-pulse">
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-24 bg-slate-200 rounded-full" />
            <div className="h-5 w-16 bg-slate-100 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-slate-200 rounded" />
            <div className="h-4 w-4 bg-slate-200 rounded" />
            <div className="h-4 w-4 bg-slate-200 rounded" />
          </div>
        </div>

        <div className="h-4.5 w-4/5 bg-slate-200 rounded mb-1.5" />

        <div className="space-y-1 mb-2.5">
          <div className="h-3 w-full bg-slate-100 rounded" />
          <div className="h-3 w-3/4 bg-slate-100 rounded" />
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-2 mb-2.5">
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 bg-[#7eed9e]/30 rounded" />
            <div className="h-3.5 w-14 bg-slate-200 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-200/50">
            <div className="h-3 w-20 bg-slate-200/70 rounded" />
            <div className="h-3 w-16 bg-slate-200/70 rounded" />
          </div>
        </div>

        <div className="h-3 w-2/3 bg-slate-100 rounded mb-2.5" />
      </div>

      <div className="pt-2.5 border-t border-slate-100/90 flex items-center justify-between mt-0.5">
        <div className="h-7 w-24 bg-slate-900/80 rounded-full" />
        <div className="flex items-center gap-1.5">
          <div className="h-7 w-18 bg-slate-100 rounded-full" />
          <div className="h-5 w-5 bg-slate-100 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SchemeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4.5 lg:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SchemeCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default SchemeGridSkeleton;
