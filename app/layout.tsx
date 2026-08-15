import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import PWARegister from '@/components/PWARegister';
import Link from 'next/link';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import Logo from '@/components/Logo';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Welfare Guide | Public Welfare & Direct Subsidy Portal",
  description: "A Citizen-First Smart Platform for Discovering, Calculating Benefits, and Applying for Public Welfare Schemes in India",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WelfareGuide"
  }
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen flex flex-col relative overflow-x-hidden bg-white text-slate-900 selection:bg-slate-200 selection:text-slate-900">
        <Navbar />

        <main className="flex-1">
          {children}
        </main>

        <PWARegister />

        {/* Executive GovTech Footer */}
        <footer className="bg-white border-t border-black/[0.06] mt-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <Logo size={40} />
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    Digital<span className="text-blue-600">Welfare</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  A public welfare intelligence portal built to help Indian citizens discover, calculate direct entitlement subsidies, and navigate official government schemes transparently.
                </p>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full w-fit">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Free Public Resource • Verified Official Direct Links
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Core Tools</h4>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li><Link href="/eligibility-check" className="hover:text-blue-600 transition-colors">Smart Eligibility Engine</Link></li>
                  <li><Link href="/schemes" className="hover:text-blue-600 transition-colors">Central & State Scheme Directory</Link></li>
                  <li><Link href="/compare" className="hover:text-blue-600 transition-colors">Side-by-Side Scheme Compare</Link></li>
                  <li><Link href="/admin" className="hover:text-blue-600 transition-colors">Real-Time Portal Crawler</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Official Portals</h4>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li>
                    <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                      myScheme Portal <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    </a>
                  </li>
                  <li>
                    <a href="https://dbtbharat.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                      DBT Bharat <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.digilocker.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                      DigiLocker India <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    </a>
                  </li>
                  <li>
                    <a href="https://mahadbt.maharashtra.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                      MahaDBT Official <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <p>© {new Date().getFullYear()} Digital Welfare Guide. Verified public welfare information system.</p>
              <p className="text-[11px]">Designed for accessibility, transparency, and rapid citizen onboarding.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
