"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white font-bold">
              W
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
              Welfare<span className="text-primary-600">Guide</span>
            </span>
          </Link>
          
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/schemes" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Browse Schemes</Link>
            <Link href="/eligibility-check" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Find My Schemes</Link>
            <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Admin</Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-500 truncate max-w-[120px]">
                  {user.email}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2 rounded-full text-sm font-semibold transition-all"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
