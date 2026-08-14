import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Welfare Guide",
  description: "A Smart Platform for Discovering and Accessing Public Welfare Schemes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Animated Background Gradients for Premium Feel */}
        <div className="fixed inset-0 z-[-1] bg-slate-50">
          <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-100 blur-[120px] opacity-70"></div>
          <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-500/10 blur-[120px] opacity-70"></div>
        </div>

        {/* Navigation Bar */}
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
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-white/80 border-t border-slate-200 mt-20">
          <div className="max-w-7xl mx-auto py-8 px-4 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} Digital Welfare Guide. Built for the citizens.
          </div>
        </footer>
      </body>
    </html>
  );
}
