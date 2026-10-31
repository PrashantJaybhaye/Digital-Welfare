"use client";

import React from 'react';
import { Bell, RefreshCw } from 'lucide-react';
import { Subscriber } from './admin-types';

interface SubscribersTabProps {
  subscribers: Subscriber[];
  loadingSubscribers: boolean;
  fetchSubscribers: () => void;
}

export default function SubscribersTab({
  subscribers,
  loadingSubscribers,
  fetchSubscribers,
}: SubscribersTabProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 animate-fade-in">
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-slate-800" /> Scheme Alert Subscribers ({subscribers.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Citizens registered for SMS/WhatsApp scheme updates.</p>
        </div>
        <button
          onClick={fetchSubscribers}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
          title="Refresh subscribers"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <th className="p-3">Contact</th>
              <th className="p-3">Preferred Category</th>
              <th className="p-3">State</th>
              <th className="p-3">Alert Channel</th>
              <th className="p-3">Subscribed On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loadingSubscribers ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  Loading subscriber records...
                </td>
              </tr>
            ) : subscribers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  No citizen subscribers registered yet.
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3 font-bold text-slate-950">{sub.contact}</td>
                  <td className="p-3 text-slate-700">{sub.category || 'All Schemes'}</td>
                  <td className="p-3 text-slate-600">{sub.state || 'All India'}</td>
                  <td className="p-3">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {sub.channel || 'WhatsApp'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 text-[11px]">
                    {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString('en-IN') : 'Recent'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

