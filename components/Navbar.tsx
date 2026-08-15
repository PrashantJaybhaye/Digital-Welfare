"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { Scale, Search, Menu, X, Bell } from 'lucide-react';
import SchemeAlertModal from '@/components/SchemeAlertModal';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);

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
    <>
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-primary-600/30 group-hover:scale-105 transition-transform">
                🇮🇳
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
                  Digital<span className="text-primary-600">Welfare</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Govt Scheme Guide
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex gap-5 items-center">
              <Link 
                href="/schemes" 
                className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors"
              >
                Browse Schemes
              </Link>

              <Link 
                href="/eligibility-check" 
                className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors flex items-center gap-1.5"
              >
                <Search className="w-4 h-4 text-primary-500" />
                Eligibility Check
              </Link>

              <Link 
                href="/compare" 
                className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors flex items-center gap-1.5"
              >
                <Scale className="w-4 h-4 text-indigo-500" />
                Compare
              </Link>

              {/* Free Alerts Button */}
              <button
                onClick={() => setAlertModalOpen(true)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Bell className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                Get Alerts
              </button>

              <Link 
                href="/admin" 
                className="text-sm font-semibold text-slate-500 hover:text-primary-600 transition-colors"
              >
                Admin Sync
              </Link>
              
              {user ? (
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 truncate max-w-[130px]">
                    {user.email}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary-600/20"
                >
                  Admin Login
                </Link>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setAlertModalOpen(true)}
                className="text-xs font-bold p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1"
                aria-label="Alerts"
              >
                <Bell className="w-4 h-4 text-amber-600" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-fade-in shadow-xl">
            <Link 
              href="/schemes" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-800"
            >
              Browse All Schemes
            </Link>
            <Link 
              href="/eligibility-check" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-primary-600"
            >
              Check My Eligibility
            </Link>
            <Link 
              href="/compare" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-indigo-600"
            >
              Compare Schemes
            </Link>
            <button
              onClick={() => { setMobileMenuOpen(false); setAlertModalOpen(true); }}
              className="w-full text-left py-2 text-sm font-bold text-amber-600 flex items-center gap-1.5"
            >
              <Bell className="w-4 h-4" /> Subscribe to Scheme Alerts
            </button>
            <Link 
              href="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-600"
            >
              Admin Sync
            </Link>

            <div className="pt-2 border-t border-slate-100">
              {user ? (
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-slate-500 font-semibold">{user.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-slate-100 px-4 py-1.5 rounded-xl text-xs font-bold text-slate-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold"
                >
                  Admin Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Scheme Alerts Modal */}
      <SchemeAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
      />
    </>
  );
}
