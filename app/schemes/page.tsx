import { adminDb } from '@/lib/firebase-admin';
import { Scheme } from '@/types/scheme';
import SchemeList from '@/components/SchemeList';

// This is a Server Component, meaning it fetches data directly from Firebase securely on the server!
export default async function SchemesPage() {
  // Fetch schemes from Firestore
  let schemes: Scheme[] = [];
  try {
    const snapshot = await adminDb.collection('schemes').orderBy('title').get();
    schemes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Scheme[];
  } catch (error) {
    console.error("Failed to fetch schemes from Firebase:", error);
    // If Firebase isn't fully configured yet, we will show an empty state gracefully.
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16">
      {/* Monotree-Style Schemes Directory Header */}
      <div className="mb-8 sm:mb-10 text-left">
        <h1 className="text-3xl sm:text-4xl lg:text-[3rem] font-bold text-slate-950 tracking-tight leading-[1.1] mb-3">
          Discover public <span className="relative inline-block">
            welfare
            {/* Hand-drawn Underline */}
            <svg 
              className="absolute -bottom-1.5 left-0 w-full h-3 text-slate-950 overflow-visible pointer-events-none" 
              viewBox="0 0 140 12" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M2 8.5C35 2.5 95 2.5 138 7" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round"
              />
              <path 
                d="M15 10C50 5.5 100 5.5 128 9.5" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeOpacity="0.4"
              />
            </svg>
          </span> schemes.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
          Search across verified Central and State programs, verify eligibility criteria, and calculate direct financial subsidies in seconds.
        </p>
      </div>

      <SchemeList initialSchemes={schemes} />
    </div>
  );
}
