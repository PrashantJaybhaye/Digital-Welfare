"use client";

import { useState, useEffect } from 'react';
import { RefreshCw, LayoutDashboard, Settings, FileText, Users, ServerCrash } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getCountFromServer } from 'firebase/firestore';

export default function AdminDashboard() {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{success: boolean, message: string} | null>(null);
  const [schemeCount, setSchemeCount] = useState<number | null>(null);

  const fetchStats = async () => {
    try {
      const coll = collection(db, 'schemes');
      const snapshot = await getCountFromServer(coll);
      setSchemeCount(snapshot.data().count);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const response = await fetch('/api/sync-schemes', {
        method: 'POST',
      });
      const data = await response.json();
      
      setSyncResult({
        success: data.success,
        message: data.message || (data.success ? 'Successfully synced data' : 'Failed to sync data')
      });
      
      // Refresh count after sync
      if (data.success) fetchStats();

    } catch (error: any) {
      setSyncResult({
        success: false,
        message: error.message || 'An unexpected error occurred while syncing.'
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 space-y-2">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">Admin Panel</h2>
        <button className="w-full flex items-center gap-3 bg-primary-50 text-primary-700 px-4 py-3 rounded-xl font-medium transition-colors">
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </button>
        <button className="w-full flex items-center gap-3 hover:bg-slate-50 text-slate-600 px-4 py-3 rounded-xl font-medium transition-colors">
          <FileText className="w-5 h-5" /> Manage Schemes
        </button>
        <button className="w-full flex items-center gap-3 hover:bg-slate-50 text-slate-600 px-4 py-3 rounded-xl font-medium transition-colors">
          <Users className="w-5 h-5" /> Users
        </button>
        <button className="w-full flex items-center gap-3 hover:bg-slate-50 text-slate-600 px-4 py-3 rounded-xl font-medium transition-colors">
          <Settings className="w-5 h-5" /> Settings
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500 mt-1">Manage your Digital Welfare Guide system.</p>
          </div>
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing with Portals...' : 'Sync Live Schemes'}
          </button>
        </div>

        {syncResult && (
          <div className={`p-4 rounded-xl border ${syncResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'} animate-fade-in flex items-start gap-3`}>
            {syncResult.success ? <RefreshCw className="w-5 h-5 text-emerald-600 mt-0.5" /> : <ServerCrash className="w-5 h-5 text-red-600 mt-0.5" />}
            <div>
              <h3 className="font-bold">{syncResult.success ? 'Sync Successful' : 'Sync Failed'}</h3>
              <p className="text-sm opacity-90 mt-1">{syncResult.message}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-100">
            <h3 className="text-slate-500 font-medium text-sm mb-1">Total Schemes</h3>
            <p className="text-4xl font-extrabold text-slate-900">
              {schemeCount !== null ? schemeCount : '...'}
            </p>
            <p className="text-emerald-600 text-sm font-medium mt-2">↑ Live from Database</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-slate-100">
            <h3 className="text-slate-500 font-medium text-sm mb-1">Active Users</h3>
            <p className="text-4xl font-extrabold text-slate-900">12</p>
            <p className="text-emerald-600 text-sm font-medium mt-2">↑ 3 this week</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-slate-100">
            <h3 className="text-slate-500 font-medium text-sm mb-1">API Health</h3>
            <p className="text-4xl font-extrabold text-emerald-500">100%</p>
            <p className="text-slate-400 text-sm font-medium mt-2">All systems operational</p>
          </div>
        </div>

      </div>
    </div>
  );
}
