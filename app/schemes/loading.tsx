import { SchemeGridSkeleton } from '@/components/SchemeSkeleton';

export default function SchemesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16">
      {/* Header skeleton */}
      <div className="mb-8 sm:mb-10 text-left animate-pulse">
        <div className="h-10 sm:h-12 w-3/4 max-w-lg bg-slate-200 rounded-2xl mb-3" />
        <div className="h-4 w-full max-w-md bg-slate-100 rounded mb-8" />

        {/* Filter bar skeleton */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="h-12 flex-1 bg-slate-100 rounded-2xl" />
          <div className="h-12 w-48 bg-slate-100 rounded-2xl" />
        </div>
      </div>

      {/* Schemes Grid Skeleton */}
      <SchemeGridSkeleton count={9} />
    </div>
  );
}
