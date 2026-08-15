"use client";

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Logo from '@/components/Logo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PWARegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.log('PWA ServiceWorker notice: ', err);
        });
      });
    }

    // 2. Handle PWA install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (!showInstallBanner) return null;

  return (
    <aside 
      aria-label="PWA install banner" 
      className="fixed bottom-5 right-5 left-5 sm:left-auto z-50 animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="flex items-center gap-3 bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 rounded-2xl p-2.5 sm:p-3 sm:max-w-sm">
        
        {/* Red Brand Icon */}
        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
          <Logo size={22} color="#dc2626" eyeColor="#ffffff" />
        </div>

        {/* Minimal Text */}
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-xs text-slate-950 leading-tight">
            DigitalWelfare
          </h4>
          <p className="text-[11px] text-slate-500 truncate mt-0.5">
            Install for instant offline access
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstall}
            className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer active:scale-95 shadow-2xs"
          >
            Install
          </button>

          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
}
