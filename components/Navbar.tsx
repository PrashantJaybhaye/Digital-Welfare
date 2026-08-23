"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import {
  Menu,
  X,
  Bell,
  ChevronRight,
  Search,
  Sparkles,
  Scale,
  ShieldCheck,
  Compass
} from 'lucide-react';
import SchemeAlertModal from '@/components/SchemeAlertModal';
import Logo from '@/components/Logo';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl transition-all print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-15 sm:h-18">

            <div className="flex items-center gap-8 lg:gap-10">
              <Link href="/" className="flex items-center gap-2.5 group">
                <Logo size={28} color="#09090b" className="group-hover:scale-105 transition-transform" />
                <span className="font-bold text-lg tracking-tight text-neutral-950">
                  DigitalWelfare
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/schemes"
                  className={`text-[13px] font-medium transition-colors ${
                    isActive('/schemes')
                      ? 'text-neutral-950 font-semibold'
                      : 'text-neutral-500 hover:text-neutral-950'
                  }`}
                >
                  Schemes
                </Link>

                <Link
                  href="/eligibility-check"
                  className={`text-[13px] font-medium transition-colors ${
                    isActive('/eligibility-check')
                      ? 'text-neutral-950 font-semibold'
                      : 'text-neutral-500 hover:text-neutral-950'
                  }`}
                >
                  Eligibility
                </Link>

                <Link
                  href="/compare"
                  className={`text-[13px] font-medium transition-colors ${
                    isActive('/compare')
                      ? 'text-neutral-950 font-semibold'
                      : 'text-neutral-500 hover:text-neutral-950'
                  }`}
                >
                  Compare
                </Link>

                <button
                  onClick={() => setAlertModalOpen(true)}
                  className="text-[13px] font-medium text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer"
                >
                  Alerts
                </button>

                <Link
                  href="/admin"
                  className={`text-[13px] font-medium transition-colors ${
                    isActive('/admin')
                      ? 'text-neutral-950 font-semibold'
                      : 'text-neutral-400 hover:text-neutral-950'
                  }`}
                >
                  Admin
                </Link>
              </nav>
            </div>

            <div className="hidden md:flex items-center gap-2.5">
              <button
                onClick={() => router.push('/schemes')}
                className="p-2 text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer rounded-full hover:bg-neutral-100/80 active:scale-95"
                aria-label="Search"
                title="Search Schemes"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => setAlertModalOpen(true)}
                className="p-2 text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer rounded-full hover:bg-neutral-100/80 active:scale-95"
                aria-label="Scheme Alerts"
                title="Scheme Alerts"
              >
                <Bell className="w-4 h-4" />
              </button>

              {user ? (
                <div className="flex items-center gap-2 ml-1">
                  <span className="text-xs text-neutral-500 truncate max-w-28 font-medium">
                    {user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 px-3 py-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href="/eligibility-check"
                  className="ml-1 bg-neutral-950 hover:bg-neutral-800 active:scale-98 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-xs"
                >
                  Check Eligibility
                </Link>
              )}
            </div>

            <div className="md:hidden flex items-center gap-1.5">
              <button
                onClick={() => router.push('/schemes')}
                className="p-2 text-neutral-600 hover:text-neutral-950 rounded-full hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              <button
                onClick={() => setAlertModalOpen(true)}
                className="p-2 text-neutral-600 hover:text-neutral-950 rounded-full hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
                aria-label="Alerts"
              >
                <Bell className="w-4.5 h-4.5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-neutral-900 hover:text-neutral-950 rounded-full hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-black/[0.06] shadow-xl px-5 pt-3 pb-6 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="mb-3">
              <button
                onClick={() => { setMobileMenuOpen(false); router.push('/schemes'); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 bg-neutral-100/90 hover:bg-neutral-100 rounded-xl text-xs text-neutral-500 font-medium transition-colors text-left"
              >
                <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Search schemes, subsidies, grants...</span>
              </button>
            </div>

            <div className="bg-neutral-50/80 rounded-2xl p-1.5 border border-black/[0.04] space-y-0.5 mb-4">
              <Link
                href="/schemes"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
                  isActive('/schemes')
                    ? 'bg-white text-neutral-950 font-semibold shadow-2xs'
                    : 'text-neutral-700 hover:text-neutral-950 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-neutral-500" />
                  <span>Browse Schemes</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </Link>

              <Link
                href="/eligibility-check"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
                  isActive('/eligibility-check')
                    ? 'bg-white text-neutral-950 font-semibold shadow-2xs'
                    : 'text-neutral-700 hover:text-neutral-950 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-neutral-900" />
                  <span>Eligibility Matcher</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </Link>

              <Link
                href="/compare"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
                  isActive('/compare')
                    ? 'bg-white text-neutral-950 font-semibold shadow-2xs'
                    : 'text-neutral-700 hover:text-neutral-950 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Scale className="w-4 h-4 text-neutral-500" />
                  <span>Compare Matrix</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </Link>

              <button
                onClick={() => { setMobileMenuOpen(false); setAlertModalOpen(true); }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-neutral-700 hover:text-neutral-950 hover:bg-white/60 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-neutral-500" />
                  <span>Scheme Alerts</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
                  isActive('/admin')
                    ? 'bg-white text-neutral-950 font-semibold shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-950 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-neutral-400" />
                  <span>Admin Console</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </Link>
            </div>

            <div>
              {user ? (
                <div className="flex justify-between items-center bg-neutral-100/80 px-4 py-2.5 rounded-2xl">
                  <span className="text-xs text-neutral-600 font-medium truncate max-w-45">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-semibold text-neutral-900 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href="/eligibility-check"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-3 bg-neutral-950 active:scale-98 text-white rounded-2xl text-xs font-semibold shadow-xs transition-all"
                >
                  Check Eligibility Now
                </Link>
              )}
            </div>

          </div>
        )}
      </header>

      <SchemeAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
      />
    </>
  );
}
