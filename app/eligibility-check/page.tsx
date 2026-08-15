"use client";

import { useState } from 'react';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { Scheme } from '@/types/scheme';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function EligibilityChecker() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ eligible: Scheme[], notEligible: Scheme[] } | null>(null);

  const [formData, setFormData] = useState({
    age: '',
    gender: 'Any',
    income: '',
    occupation: '',
    category: '',
    state: ''
  });

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Fetch all schemes from Firestore
      const snapshot = await getDocs(collection(db, 'schemes'));
      const allSchemes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Scheme[];

      const eligible: Scheme[] = [];
      const notEligible: Scheme[] = [];

      const userAge = parseInt(formData.age);
      const userIncome = parseInt(formData.income) || 0;
      const userGender = formData.gender;
      const userOccupation = formData.occupation;

      // Real Logic: Check each scheme's eligibility against user input
      allSchemes.forEach(scheme => {
        let isEligible = true;

        // Check Age
        if (scheme.minAge !== null && scheme.minAge !== undefined && userAge < scheme.minAge) isEligible = false;
        if (scheme.maxAge !== null && scheme.maxAge !== undefined && userAge > scheme.maxAge) isEligible = false;

        // Check Income
        if (scheme.maxIncome !== null && scheme.maxIncome !== undefined && userIncome > scheme.maxIncome) isEligible = false;

        // Check Gender (If scheme targets specific gender and user doesn't match)
        if (scheme.targetGender && scheme.targetGender !== 'Any' && userGender !== 'Any' && scheme.targetGender !== userGender) isEligible = false;

        // Check Occupation
        if (scheme.targetOccupation && scheme.targetOccupation !== 'Any' && userOccupation && scheme.targetOccupation.toLowerCase() !== userOccupation.toLowerCase()) isEligible = false;

        if (isEligible) {
          eligible.push(scheme);
        } else {
          notEligible.push(scheme);
        }
      });

      setResults({ eligible, notEligible });
    } catch (error) {
      console.error("Error fetching schemes:", error);
      alert("Failed to connect to the database. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Find Schemes For Me</h1>
        <p className="text-lg text-slate-600">
          Enter your basic details below, and our smart engine will instantly find government schemes you are eligible for.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="md:flex">
          {/* Form Section */}
          <div className="p-8 md:w-1/2 bg-slate-50 border-r border-slate-100">
            <form onSubmit={handleCheck} className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 22"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white transition-all"
                >
                  <option value="Any">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Annual Income (₹)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 150000"
                  value={formData.income}
                  onChange={(e) => setFormData({...formData, income: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Occupation / Status</label>
                <select 
                  value={formData.occupation}
                  onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white transition-all"
                >
                  <option value="">Select Occupation</option>
                  <option value="Student">Student</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Employed">Employed</option>
                  <option value="Business">Business / Self-Employed</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing Eligibility...' : 'Check My Eligibility'}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="p-8 md:w-1/2 bg-white">
            {!results && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 opacity-60">
                <div className="w-24 h-24 mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <ArrowRight className="w-10 h-10 text-slate-300" />
                </div>
                <p>Fill out the form and hit check to see your personalized scheme recommendations.</p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium animate-pulse">Scanning live database...</p>
              </div>
            )}

            {results && !loading && (
              <div className="animate-fade-in space-y-6">
                <h3 className="text-xl font-bold text-slate-900 border-b pb-2">Your Results</h3>
                
                <div>
                  <h4 className="text-sm font-semibold text-emerald-600 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Eligible Schemes ({results.eligible.length})
                  </h4>
                  <div className="space-y-3">
                    {results.eligible.length > 0 ? results.eligible.map(scheme => (
                      <div key={scheme.id} className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50">
                        <h5 className="font-bold text-slate-800">{scheme.title}</h5>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{scheme.description}</p>
                        <Link href={`/schemes/${scheme.id}`} className="text-emerald-700 text-sm font-semibold mt-2 inline-block hover:underline">
                          View details
                        </Link>
                      </div>
                    )) : (
                      <p className="text-sm text-slate-500 italic">No schemes found matching your profile.</p>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5" /> Not Eligible For ({results.notEligible.length})
                  </h4>
                  <div className="space-y-3 opacity-60">
                    {results.notEligible.length > 0 ? results.notEligible.map(scheme => (
                      <div key={scheme.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                        <h5 className="font-semibold text-slate-600 text-sm">{scheme.title}</h5>
                      </div>
                    )) : (
                      <p className="text-sm text-slate-500 italic">None</p>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
