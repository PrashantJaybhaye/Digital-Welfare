"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  LayoutDashboard,
  FileText,
  Plus,
  Bell,
  Activity,
  Download,
  LogOut,
  CheckCircle2,
  ServerCrash,
  X,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { Scheme } from '@/types/scheme';
import { useIsClient, useAdminSessionAuth, setAdminSessionAuth } from '@/lib/client-store';
import Link from 'next/link';

import { TabType, Subscriber, PipelineStage } from '@/components/admin/admin-types';
import OverviewTab from '@/components/admin/OverviewTab';
import SchemeInventoryTab from '@/components/admin/SchemeInventoryTab';
import CreateSchemeTab from '@/components/admin/CreateSchemeTab';
import SubscribersTab from '@/components/admin/SubscribersTab';
import DiagnosticsTab from '@/components/admin/DiagnosticsTab';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);

  // Admin Security & Authentication State
  const isClient = useIsClient();
  const sessionAuth = useAdminSessionAuth();
  const [firebaseAuthed, setFirebaseAuthed] = useState(false);
  const isAuthenticated = sessionAuth || firebaseAuthed;

  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Data States
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loadingSchemes, setLoadingSchemes] = useState(true);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [schemeSearch, setSchemeSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [selectedSchemeIds, setSelectedSchemeIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // New Scheme Form State
  const [newScheme, setNewScheme] = useState<Partial<Scheme>>({
    title: '',
    description: '',
    department: 'Government of Maharashtra',
    category: 'MahaDBT (College Student)',
    state: 'Maharashtra',
    minAge: null,
    maxAge: null,
    maxIncome: null,
    targetGender: 'Any',
    targetOccupation: 'All Citizens',
    socialCategory: 'All',
    financialBenefitText: '',
    estimatedBenefitAmount: null,
    applyLink: 'https://mahadbt2.maharashtra.gov.in/home',
    benefits: [
      'Direct Direct Benefit Transfer (DBT) to Aadhaar-seeded bank account',
      'Official Maharashtra State welfare subsidy',
    ],
    requiredDocuments: [
      'Aadhaar Card (Identity & Proof of Address)',
      'Bank Account Passbook (Linked to Aadhaar & NPCI for DBT)',
      'State Domicile Certificate',
    ],
    stepsToApply: [
      'Gather Aadhaar, Domicile, and relevant eligibility documents',
      'Register on the official portal and verify via Aadhaar OTP',
      'Fill out personal, bank, and income details and submit form',
      'Track your Application Reference Number (ARN) for Direct DBT approval',
    ],
  });
  const [benefitInput, setBenefitInput] = useState('');
  const [docInput, setDocInput] = useState('');
  const [stepInput, setStepInput] = useState('');
  const [savingScheme, setSavingScheme] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Check Firebase Auth & Secure Server Session in background
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setFirebaseAuthed(true);
    });

    fetch('/api/admin/auth')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setAdminSessionAuth(true);
        }
      })
      .catch(() => {});

    return () => unsubscribe();
  }, []);

  const getAdminHeaders = useCallback((): Record<string, string> => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('admin_token') || '' : '';
    return {
      'Content-Type': 'application/json',
      'x-admin-key': token,
    };
  }, []);

  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('admin_token', passcode.trim());
        }
        setAdminSessionAuth(true);
      } else {
        setAuthError(data.error || 'Invalid Admin Access Key. Access Denied.');
      }
    } catch {
      setAuthError('Connection error. Could not verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      await signOut(auth);
    } catch {}
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_token');
    }
    setAdminSessionAuth(false);
    setFirebaseAuthed(false);
    setPasscode('');
  };

  const addBenefitItem = (text?: string) => {
    const val = (text || benefitInput).trim();
    if (!val) return;
    if (newScheme.benefits && newScheme.benefits.includes(val)) return;
    setNewScheme((prev) => ({
      ...prev,
      benefits: [...(prev.benefits || []), val],
    }));
    setBenefitInput('');
  };

  const removeBenefitItem = (index: number) => {
    setNewScheme((prev) => ({
      ...prev,
      benefits: (prev.benefits || []).filter((_, i) => i !== index),
    }));
  };

  const addDocItem = (text?: string) => {
    const val = (text || docInput).trim();
    if (!val) return;
    if (newScheme.requiredDocuments && newScheme.requiredDocuments.includes(val)) return;
    setNewScheme((prev) => ({
      ...prev,
      requiredDocuments: [...(prev.requiredDocuments || []), val],
    }));
    setDocInput('');
  };

  const removeDocItem = (index: number) => {
    setNewScheme((prev) => ({
      ...prev,
      requiredDocuments: (prev.requiredDocuments || []).filter((_, i) => i !== index),
    }));
  };

  const addStepItem = () => {
    const val = stepInput.trim();
    if (!val) return;
    setNewScheme((prev) => ({
      ...prev,
      stepsToApply: [...(prev.stepsToApply || []), val],
    }));
    setStepInput('');
  };

  const removeStepItem = (index: number) => {
    setNewScheme((prev) => ({
      ...prev,
      stepsToApply: (prev.stepsToApply || []).filter((_, i) => i !== index),
    }));
  };

  // Load Schemes
  const fetchSchemes = useCallback(async () => {
    setLoadingSchemes(true);
    try {
      const res = await fetch('/api/schemes', { cache: 'no-store' });
      const data = await res.json();
      if (data.schemes) {
        setSchemes(data.schemes);
      }
    } catch (err) {
      console.error('Error fetching schemes in admin:', err);
    } finally {
      setLoadingSchemes(false);
    }
  }, []);

  // Load Subscribers
  const fetchSubscribers = useCallback(async () => {
    setLoadingSubscribers(true);
    try {
      const res = await fetch('/api/subscribe-alerts', {
        cache: 'no-store',
        headers: getAdminHeaders(),
      });
      const data = await res.json();
      if (data.subscribers) {
        setSubscribers(data.subscribers);
      }
    } catch (err) {
      console.error('Error fetching subscribers:', err);
    } finally {
      setLoadingSubscribers(false);
    }
  }, [getAdminHeaders]);

  useEffect(() => {
    let ignore = false;
    const init = async () => {
      try {
        const [schemesRes, subsRes] = await Promise.all([
          fetch('/api/schemes', { cache: 'no-store' })
            .then((r) => r.json())
            .catch(() => null),
          fetch('/api/subscribe-alerts', {
            cache: 'no-store',
            headers: getAdminHeaders(),
          })
            .then((r) => r.json())
            .catch(() => null),
        ]);
        if (!ignore) {
          if (schemesRes?.schemes) {
            setSchemes(schemesRes.schemes);
          }
          if (subsRes?.subscribers) {
            setSubscribers(subsRes.subscribers);
          }
          setLoadingSchemes(false);
          setLoadingSubscribers(false);
        }
      } catch (err) {
        console.error('Error loading admin data:', err);
        if (!ignore) {
          setLoadingSchemes(false);
          setLoadingSubscribers(false);
        }
      }
    };
    init();
    return () => {
      ignore = true;
    };
  }, [getAdminHeaders]);

  // Sync Live Schemes
  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const response = await fetch('/api/sync-schemes', {
        method: 'POST',
        headers: getAdminHeaders(),
      });
      const data = await response.json();

      setSyncResult({
        success: Boolean(data.success),
        message:
          data.message ||
          data.error ||
          (data.success ? 'Successfully ingested schemes into database' : 'Sync completed with notice.'),
      });

      if (data.stages) setPipelineStages(data.stages);
      if (data.logs) setPipelineLogs(data.logs);

      if (data.success) fetchSchemes();

      setTimeout(() => {
        setSyncResult(null);
      }, 8000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected network error occurred.';
      setSyncResult({ success: false, message });
    } finally {
      setSyncing(false);
    }
  };

  // Delete Single Scheme
  const handleDeleteScheme = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setSchemes((prev) => prev.filter((s) => s.id !== id));
    setSelectedSchemeIds((prev) => prev.filter((itemId) => itemId !== id));

    try {
      const res = await fetch('/api/schemes', {
        method: 'DELETE',
        headers: getAdminHeaders(),
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Delete request failed');
      await fetchSchemes();
    } catch (err) {
      console.error('Error deleting scheme:', err);
      alert('Failed to delete scheme. Check server permissions.');
      await fetchSchemes();
    }
  };

  // Toggle Selection (Individual)
  const toggleSelectScheme = (id: string) => {
    setSelectedSchemeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle Selection (Select All Visible)
  const toggleSelectAllSchemes = () => {
    const q = schemeSearch.toLowerCase();
    const visibleIds = schemes
      .filter((s) => {
        const matchesSearch =
          s.title.toLowerCase().includes(q) ||
          (s.description || '').toLowerCase().includes(q) ||
          (s.state || '').toLowerCase().includes(q);
        const matchesCat = selectedCategoryFilter === 'All' || s.category === selectedCategoryFilter;
        return matchesSearch && matchesCat;
      })
      .map((s) => s.id!)
      .filter(Boolean);

    if (visibleIds.length > 0 && visibleIds.every((id) => selectedSchemeIds.includes(id))) {
      setSelectedSchemeIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedSchemeIds(Array.from(new Set([...selectedSchemeIds, ...visibleIds])));
    }
  };

  // Bulk Delete Selected Schemes
  const handleBulkDelete = async () => {
    if (selectedSchemeIds.length === 0) return;
    const count = selectedSchemeIds.length;
    if (!confirm(`Are you sure you want to permanently delete ${count} selected scheme(s)?`)) return;

    setIsBulkDeleting(true);
    const idsToDelete = [...selectedSchemeIds];

    setSchemes((prev) => prev.filter((s) => !idsToDelete.includes(s.id!)));
    setSelectedSchemeIds([]);

    try {
      const res = await fetch('/api/schemes', {
        method: 'DELETE',
        headers: getAdminHeaders(),
        body: JSON.stringify({ ids: idsToDelete }),
      });
      if (!res.ok) throw new Error('Bulk delete failed');
      await fetchSchemes();
    } catch (err) {
      console.error('Error bulk deleting schemes:', err);
      alert('Failed to delete some schemes. Please check your permissions.');
      await fetchSchemes();
    } finally {
      setIsBulkDeleting(false);
    }
  };

  // Create Scheme Handler
  const handleCreateScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheme.title || !newScheme.description) {
      alert('Please fill in scheme title and description.');
      return;
    }

    setSavingScheme(true);
    try {
      const res = await fetch('/api/schemes', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          ...newScheme,
          lastSyncedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('Failed to create scheme');

      setCreateSuccess(true);
      await fetchSchemes();

      setNewScheme({
        title: '',
        description: '',
        department: 'Government of Maharashtra',
        category: 'MahaDBT (College Student)',
        state: 'Maharashtra',
        minAge: null,
        maxAge: null,
        maxIncome: null,
        targetGender: 'Any',
        targetOccupation: 'All Citizens',
        socialCategory: 'All',
        financialBenefitText: '',
        estimatedBenefitAmount: null,
        applyLink: 'https://mahadbt2.maharashtra.gov.in/home',
        benefits: [
          'Direct Direct Benefit Transfer (DBT) to Aadhaar-seeded bank account',
          'Official Maharashtra State welfare subsidy',
        ],
        requiredDocuments: [
          'Aadhaar Card (Identity & Proof of Address)',
          'Bank Account Passbook (Linked to Aadhaar & NPCI for DBT)',
          'State Domicile Certificate',
        ],
        stepsToApply: [
          'Gather Aadhaar, Domicile, and relevant eligibility documents',
          'Register on the official portal and verify via Aadhaar OTP',
          'Fill out personal, bank, and income details and submit form',
          'Track your Application Reference Number (ARN) for Direct DBT approval',
        ],
      });
      setBenefitInput('');
      setDocInput('');
      setStepInput('');

      setTimeout(() => setCreateSuccess(false), 4000);
    } catch (err) {
      console.error('Error saving scheme:', err);
      alert('Failed to save new scheme.');
    } finally {
      setSavingScheme(false);
    }
  };

  // Export schemes JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(schemes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `digital-welfare-schemes-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // -------------------------------------------------------------
  // AUTHENTICATION CHECKING & LOCK SCREEN
  // -------------------------------------------------------------
  if (!isClient) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">Loading Admin Console...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-size-[20px_20px] opacity-40 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7eed9e]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-md w-full bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-slate-900/5">
          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-wide uppercase mb-5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#7eed9e] animate-pulse"></span>
              GovTech • Secure Gateway
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight leading-tight mb-2">
              Admin{' '}
              <span className="relative inline-block">
                Operations
                <svg
                  className="absolute -bottom-1 left-0 w-full h-2.5 text-slate-950 overflow-visible pointer-events-none"
                  viewBox="0 0 140 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 7.5C35 2.5 95 2.5 138 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Restricted management console for public welfare datasets, real-time sync, and citizen services.
            </p>
          </div>

          {authError && (
            <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-800 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-semibold">{authError}</span>
            </div>
          )}

          <form onSubmit={handlePasscodeLogin} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-800">Master Security Key</label>
                <span className="text-[10px] text-slate-400 font-semibold">Required for access</span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Key className="w-4 h-4" />
                </div>

                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  autoComplete="current-password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Master Admin Access Key..."
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200/90 rounded-2xl text-sm font-semibold text-slate-950 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all shadow-2xs"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="mt-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-800">Protected Gateway:</span> Authenticate with the secret configured in your deployment environment (<code className="font-mono text-slate-800 bg-slate-200/70 px-1 py-0.5 rounded text-[10px]">ADMIN_SECRET</code>). Sessions expire after 2 hours.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading || !passcode.trim()}
              className="w-full mt-2 py-3.5 px-4 bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {authLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#7eed9e]" />
                  <span>Unlock Admin Operations</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-950 transition-colors">
              ← Return to Citizen Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
      {/* Admin Masthead Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
              Control Panel
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Cloud Firestore Live</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight leading-tight">
            Welfare System Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage scheme inventory, execute GovTech scrapers, monitor citizen alerts, and inspect pipeline stages.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={handleExportJSON}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Download full JSON dataset"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#7eed9e] ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Live Portals'}</span>
          </button>

          <button
            onClick={handleAdminLogout}
            className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Lock Admin Session"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Sync Status Notification */}
      {syncResult && (
        <div
          className={`p-4 rounded-2xl border mb-6 flex items-start justify-between gap-3 animate-fade-in ${
            syncResult.success
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-rose-50/80 border-rose-200 text-rose-950'
          }`}
        >
          <div className="flex items-start gap-3">
            {syncResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            ) : (
              <ServerCrash className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            )}
            <div className="text-xs">
              <h4 className="font-bold">{syncResult.success ? 'Sync Successful' : 'Sync Notice'}</h4>
              <p className="opacity-90 mt-0.5">{syncResult.message}</p>
            </div>
          </div>
          <button
            onClick={() => setSyncResult(null)}
            className="p-1 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 border-b border-slate-200/80 no-scrollbar">
        {[
          { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard },
          { id: 'schemes', label: `Scheme Inventory (${schemes.length})`, icon: FileText },
          { id: 'create', label: 'Add New Scheme', icon: Plus },
          { id: 'subscribers', label: `Citizen Alerts (${subscribers.length})`, icon: Bell },
          { id: 'system', label: 'Diagnostics & API', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-950 text-white shadow-2xs'
                  : 'bg-white hover:bg-slate-100/80 text-slate-600 border border-slate-200/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#7eed9e]' : 'text-slate-500'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <OverviewTab
          schemes={schemes}
          subscribers={subscribers}
          loadingSchemes={loadingSchemes}
          loadingSubscribers={loadingSubscribers}
          setActiveTab={setActiveTab}
        />
      )}

      {/* Scheme inventory tab */}
      {activeTab === 'schemes' && (
        <SchemeInventoryTab
          schemes={schemes}
          loadingSchemes={loadingSchemes}
          schemeSearch={schemeSearch}
          setSchemeSearch={setSchemeSearch}
          selectedCategoryFilter={selectedCategoryFilter}
          setSelectedCategoryFilter={setSelectedCategoryFilter}
          selectedSchemeIds={selectedSchemeIds}
          setSelectedSchemeIds={setSelectedSchemeIds}
          isBulkDeleting={isBulkDeleting}
          toggleSelectAllSchemes={toggleSelectAllSchemes}
          toggleSelectScheme={toggleSelectScheme}
          handleBulkDelete={handleBulkDelete}
          handleDeleteScheme={handleDeleteScheme}
          setActiveTab={setActiveTab}
        />
      )}

      {/* Add scheme tab */}
      {activeTab === 'create' && (
        <CreateSchemeTab
          newScheme={newScheme}
          setNewScheme={setNewScheme}
          benefitInput={benefitInput}
          setBenefitInput={setBenefitInput}
          docInput={docInput}
          setDocInput={setDocInput}
          stepInput={stepInput}
          setStepInput={setStepInput}
          savingScheme={savingScheme}
          createSuccess={createSuccess}
          addBenefitItem={addBenefitItem}
          removeBenefitItem={removeBenefitItem}
          addDocItem={addDocItem}
          removeDocItem={removeDocItem}
          addStepItem={addStepItem}
          removeStepItem={removeStepItem}
          handleCreateScheme={handleCreateScheme}
        />
      )}

      {/* Citizen subscribers tab */}
      {activeTab === 'subscribers' && (
        <SubscribersTab
          subscribers={subscribers}
          loadingSubscribers={loadingSubscribers}
          fetchSubscribers={fetchSubscribers}
        />
      )}

      {/* System diagnostics tab */}
      {activeTab === 'system' && (
        <DiagnosticsTab
          schemes={schemes}
          pipelineStages={pipelineStages}
          pipelineLogs={pipelineLogs}
          syncing={syncing}
          handleSync={handleSync}
        />
      )}
    </div>
  );
}
