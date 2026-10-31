"use client";

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Sparkles,
  Users,
  Bell,
  Settings,
  Plus,
  ArrowRight,
  Eye,
  Activity,
  ExternalLink,
} from 'lucide-react';
import { Scheme, formatCategoryName, getEstimatedBenefit } from '@/types/scheme';
import { Subscriber, TabType } from './admin-types';

interface OverviewTabProps {
  schemes: Scheme[];
  subscribers: Subscriber[];
  loadingSchemes: boolean;
  loadingSubscribers: boolean;
  setActiveTab: (tab: TabType) => void;
}

export default function OverviewTab({
  schemes,
  subscribers,
  loadingSchemes,
  loadingSubscribers,
  setActiveTab,
}: OverviewTabProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Catalog Schemes</span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <FileText className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {loadingSchemes ? '...' : schemes.length}
          </p>
          <p className="text-[11px] text-emerald-800 font-bold mt-1">● Active in Live Database</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Central Sector</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {loadingSchemes
              ? '...'
              : schemes.filter((s) => s.category === 'CS' || s.category === 'Central Sector Scheme').length}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">100% Union Govt Funded</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">State Programs</span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {loadingSchemes ? '...' : schemes.filter((s) => s.state && s.state !== 'All India').length}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Across 28 States & 8 UTs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subscribers</span>
            <span className="p-1.5 rounded-lg bg-[#7eed9e]/30 text-emerald-950">
              <Bell className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {loadingSubscribers ? '...' : subscribers.length}
          </p>
          <p className="text-[11px] text-emerald-800 font-bold mt-1">WhatsApp & Email Alerts</p>
        </div>
      </div>

      {/* Quick Operations & Recent Ingestion Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Quick Actions Panel */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-slate-800" /> Admin Controls
          </h3>

          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('create')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-left flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-[#7eed9e]/20 text-emerald-900">
                  <Plus className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-950">Publish New Scheme</h4>
                  <p className="text-[10px] text-slate-500">Add Central or State welfare rule</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => setActiveTab('schemes')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-left flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-slate-200/60 text-slate-800">
                  <FileText className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-950">Audit Scheme Inventory</h4>
                  <p className="text-[10px] text-slate-500">Edit, inspect, and delete schemes</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <Link
              href="/schemes"
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-left flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-slate-200/60 text-slate-800">
                  <Eye className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-950">Preview Citizen Directory</h4>
                  <p className="text-[10px] text-slate-500">View public live scheme catalog</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Recently Ingested Schemes */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-slate-800" /> Recently Ingested Schemes
            </h3>
            <button onClick={() => setActiveTab('schemes')} className="text-xs font-bold text-slate-950 hover:underline cursor-pointer">
              View All ({schemes.length}) →
            </button>
          </div>

          {loadingSchemes ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading catalog...</div>
          ) : schemes.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No schemes found. Click &quot;Sync Live Portals&quot;.</div>
          ) : (
            <div className="space-y-2">
              {schemes.slice(0, 5).map((scheme) => {
                const benefit = getEstimatedBenefit(scheme);
                return (
                  <div
                    key={scheme.id}
                    className="p-3 rounded-xl border border-slate-200/70 bg-slate-50/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                  >
                    <div className="grow">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-800 border border-slate-200/60">
                          {formatCategoryName(scheme.category)}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-500">
                          {scheme.state || 'All India'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-950">{scheme.title}</h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#7eed9e]/20 text-emerald-950 border border-[#7eed9e]/40">
                        {benefit.label}
                      </span>
                      <Link
                        href={`/schemes/${scheme.id}`}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                        title="Inspect Scheme"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

