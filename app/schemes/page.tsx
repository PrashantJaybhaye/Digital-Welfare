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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Browse All Schemes</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Explore our comprehensive database of public welfare schemes fetched directly from official portals.
        </p>
      </div>

      <SchemeList initialSchemes={schemes} />
    </div>
  );
}
