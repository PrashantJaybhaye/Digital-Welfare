import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import PWARegister from '@/components/PWARegister';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Welfare Guide | Govt Schemes & Subsidies Portal",
  description: "A Citizen-First Smart Platform for Discovering, Calculating Benefits, and Applying for Public Welfare Schemes in India",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WelfareGuide"
  }
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Animated Background Gradients */}
        <div className="fixed inset-0 z-[-1] bg-slate-50">
          <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-100 blur-[120px] opacity-70"></div>
          <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] opacity-70"></div>
        </div>

        <Navbar />

        <main className="grow">
          {children}
        </main>

        <PWARegister />

        <footer className="bg-white/80 border-t border-slate-200 mt-20">
          <div className="max-w-7xl mx-auto py-8 px-4 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} Digital Welfare Guide. Verified citizen welfare assistance platform.
          </div>
        </footer>
      </body>
    </html>
  );
}
