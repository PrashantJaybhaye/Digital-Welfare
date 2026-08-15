"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { Menu, X, Bell, ChevronDown } from 'lucide-react';
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
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-all print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            
            {/* Left: Brand Logo & Links */}
            <div className="flex items-center gap-8 lg:gap-10">
              <Link href="/" className="flex items-center gap-2.5 group">
                <Logo size={32} color="#020617" className="group-hover:scale-105 transition-transform" />
                <span className="font-extrabold text-xl tracking-tight text-slate-950">
                  DigitalWelfare
                </span>
              </Link>

              {/* Desktop Navigation Links - Monotree Style */}
              <nav className="hidden md:flex items-center gap-7">
                <Link 
                  href="/schemes" 
                  className="text-sm font-medium text-slate-800 hover:text-black flex items-center gap-1 transition-colors"
                >
                  <span>Schemes</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-600 stroke-[2.5]" />
                </Link>

                <Link 
                  href="/eligibility-check" 
                  className="text-sm font-medium text-slate-800 hover:text-black transition-colors"
                >
                  Eligibility
                </Link>

                <Link 
                  href="/compare" 
                  className="text-sm font-medium text-slate-800 hover:text-black transition-colors"
                >
                  Compare
                </Link>

                <button
                  onClick={() => setAlertModalOpen(true)}
                  className="text-sm font-medium text-slate-800 hover:text-black transition-colors cursor-pointer"
                >
                  Alerts
                </button>

                <Link 
                  href="/admin" 
                  className="text-sm font-medium text-slate-500 hover:text-black transition-colors"
                >
                  Admin
                </Link>
              </nav>
            </div>
            
            {/* Right: Monotree Action Button & Language Dropdown */}
            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 truncate max-w-32.5">
                    {user.email}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <Link 
                  href="/eligibility-check" 
                  className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/90 px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-[0_1px_3px_rgba(0,0,0,0.05)] active:scale-98"
                >
                  Check eligibility
                </Link>
              )}

              {/* Monotree Language Dropdown */}
              <div className="flex items-center gap-1 text-sm font-medium text-slate-800 cursor-pointer hover:text-black transition-colors pl-2 border-l border-slate-200">
                <span>English</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-600 stroke-[2.5]" />
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setAlertModalOpen(true)}
                className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center cursor-pointer"
                aria-label="Alerts"
              >
                <Bell className="w-4 h-4 text-slate-600" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-950 rounded-xl hover:bg-slate-100 cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 px-4 pt-3 pb-6 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
            <Link 
              href="/schemes" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center justify-between"
            >
              <span>Browse All Schemes</span>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Directory</span>
            </Link>

            <Link 
              href="/eligibility-check" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center justify-between"
            >
              <span>Check Eligibility</span>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Calculator</span>
            </Link>

            <Link 
              href="/compare" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center justify-between"
            >
              <span>Compare Schemes</span>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Matrix</span>
            </Link>

            <button
              onClick={() => { setMobileMenuOpen(false); setAlertModalOpen(true); }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-500" />
                <span>Scheme Alerts</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Free</span>
            </button>

            <Link 
              href="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center justify-between"
            >
              <span>Admin Operations</span>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Portal</span>
            </Link>

            <div className="pt-3 border-t border-slate-100 mt-2">
              {user ? (
                <div className="flex justify-between items-center px-3 pt-1">
                  <span className="text-xs text-slate-500 font-semibold truncate max-w-[180px]">{user.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  href="/eligibility-check" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
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
