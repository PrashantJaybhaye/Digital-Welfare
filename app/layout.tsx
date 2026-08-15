import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';

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

        <Navbar />

        <main className="grow">
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
