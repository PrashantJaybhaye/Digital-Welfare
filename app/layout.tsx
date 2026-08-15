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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen flex flex-col relative overflow-x-hidden bg-white text-slate-900 selection:bg-slate-200 selection:text-slate-900" suppressHydrationWarning>
        <Navbar />

        <main className="flex-1">
          {children}
        </main>

        <PWARegister />
      </body>
    </html>
  );
}
