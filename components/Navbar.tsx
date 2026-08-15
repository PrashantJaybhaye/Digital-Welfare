"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { Scale, Search, Menu, X, Bell } from 'lucide-react';
import SchemeAlertModal from '@/components/SchemeAlertModal';
import Logo from '@/components/Logo';

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
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-black/[0.06] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Brand Logo & Gov Identity */}
            <Link href="/" className="flex items-center gap-3 group">
              <Logo size={44} className="group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-slate-900 leading-none">
                  Digital<span className="text-blue-600">Welfare</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider mt-0.5">
                  Public Welfare Guide
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex gap-1.5 items-center">
              <Link 
                href="/schemes" 
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-full hover:bg-black/[0.04] transition-all"
              >
                Browse Directory
              </Link>

              <Link 
                href="/eligibility-check" 
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-full hover:bg-black/[0.04] transition-all flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5 text-blue-600" />
                Eligibility Engine
              </Link>

              <Link 
                href="/compare" 
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-full hover:bg-black/[0.04] transition-all flex items-center gap-1.5"
              >
                <Scale className="w-3.5 h-3.5 text-indigo-600" />
                Compare Schemes
              </Link>

              <button
                onClick={() => setAlertModalOpen(true)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100/90 text-slate-700 hover:bg-slate-200/80 border border-black/[0.04] transition-all flex items-center gap-1.5 shadow-2xs ml-1"
              >
                <Bell className="w-3.5 h-3.5 text-amber-600" />
                Alerts
              </button>

              <Link 
                href="/admin" 
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 px-3 py-2 rounded-full hover:bg-black/[0.04] transition-all"
              >
                Admin Sync
              </Link>
              
              {user ? (
                <div className="flex items-center gap-2 pl-3 ml-2 border-l border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 truncate max-w-32.5">
                    {user.email}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <Link 
                  href="/eligibility-check" 
                  className="ml-2 bg-slate-950 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm active:scale-98"
                >
                  Check Eligibility
                </Link>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setAlertModalOpen(true)}
                className="p-2 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center"
                aria-label="Alerts"
              >
                <Bell className="w-4 h-4 text-amber-600" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-950 rounded-full hover:bg-slate-100"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-black/[0.06] px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-xl">
            <Link 
              href="/schemes" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Browse All Schemes
            </Link>
            <Link 
              href="/eligibility-check" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-50"
            >
              Check My Eligibility
            </Link>
            <Link 
              href="/compare" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
            >
              Compare Schemes
            </Link>
            <button
              onClick={() => { setMobileMenuOpen(false); setAlertModalOpen(true); }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-700 hover:bg-amber-50 flex items-center gap-2"
            >
              <Bell className="w-4 h-4 text-amber-600" /> Free Scheme Alerts
            </button>
            <Link 
              href="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50"
            >
              Admin Sync Portal
            </Link>

            <div className="pt-3 border-t border-slate-100">
              {user ? (
                <div className="flex justify-between items-center px-3 pt-1">
                  <span className="text-xs text-slate-500 font-semibold truncate max-w-[180px]">{user.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-slate-100 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  href="/eligibility-check" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-3 bg-slate-950 text-white rounded-2xl text-xs font-bold shadow-sm"
                >
                  Check Eligibility Now
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Scheme Alerts Modal */}
      <SchemeAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
      />
    </>
  );
}
